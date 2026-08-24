/**
 * qa_curtain.ts — proves the curtain shader compiles AND moves.
 *
 * WHY THIS EXISTS
 * `tsc` cannot see inside a template literal, and curtains.js is built with
 * `production: true`, which swallows the compile log and silently substitutes
 * `gl_FragColor = vec4(0,0,0,1)`. So the two failures that actually ship — a
 * GLSL syntax error and a NaN from an undefined `pow()` — both look like "the
 * screen is black" and neither reaches the console. The only way to see the
 * compiler's own words is to compile the shaders by hand.
 *
 * It also tests the reported bug rather than only the crash: the curtain read
 * as "static", so the harness renders two frames a few milliseconds apart and
 * asserts the pixels DIFFER. A shader can compile perfectly and still be a
 * poster.
 *
 * WHAT IT DOES
 * Reads the shader sources straight out of curtain.ts, builds a self-contained
 * page that draws the same 48x20 grid curtains.js would, and runs the checks in
 * a real browser. Run it, then open the printed URL and read `__CURTAIN_QA__`.
 *
 *   node scripts/qa_curtain.ts          # writes the page and serves it
 */

import { createServer } from 'node:http'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const SOURCE = join(root, 'src', 'runtime', 'curtain.ts')
const OUT_DIR = join(root, 'output', 'qa')
const OUT_PAGE = join(OUT_DIR, 'curtain-shader.html')

/**
 * Pull a top-level template literal out of the module text. GLSL cannot contain
 * a backtick, so the first unescaped one closes the literal and a plain
 * non-greedy match is exact rather than approximate.
 */
function literal(src: string, name: string): string {
  const m = new RegExp('const\\s+' + name + '\\s*=\\s*`([\\s\\S]*?)`', 'm').exec(src)
  if (!m || m[1] === undefined) {
    throw new Error(
      `qa_curtain: could not find the \`${name}\` template literal in ${SOURCE}. ` +
        'If the shader constants were renamed, update this harness — do not delete the check.',
    )
  }
  return m[1]
}

const source = readFileSync(SOURCE, 'utf8')

/**
 * The shared chunk is optional: it only exists once the vertex and fragment
 * cloth models have been factored into one definition. Both spellings must
 * still be testable, so an absent CLOTH is an empty prefix rather than a
 * failure.
 */
/**
 * `literal()` returns the template's RAW text, so an interpolation such as
 * `${CLOTH}` and an escape such as `\n` arrive verbatim — and GLSL rejects both
 * on sight (`'$' : invalid character`). The shared chunk is already prepended
 * below, so the marker is dropped rather than expanded; escapes are resolved
 * because that is what the TypeScript template does at runtime. Skipping this
 * made every compile check fail identically at the same line, which is exactly
 * the silent failure this harness exists to catch.
 */
const resolve = (glsl: string) => glsl.replace(/\$\{CLOTH\}/g, '').replace(/\\n/g, '\n')

const shared = /const\s+CLOTH\s*=\s*`/.test(source) ? literal(source, 'CLOTH') : ''
const vertex = shared + '\n' + resolve(literal(source, 'VERTEX'))
const fragment = shared + '\n' + resolve(literal(source, 'FRAGMENT'))

const json = (v: unknown) => JSON.stringify(v)

const page = `<!doctype html>
<meta charset="utf-8">
<title>curtain shader QA</title>
<style>
  body { margin: 0; background: #111; color: #ddd; font: 13px ui-monospace, monospace; }
  canvas { display: block; width: 640px; height: 360px; image-rendering: pixelated; }
  pre { padding: 12px; white-space: pre-wrap; }
</style>
<canvas id="gl" width="640" height="360"></canvas>
<pre id="out">running…</pre>
<script>
const VERTEX = ${json(vertex)};
const FRAGMENT = ${json(fragment)};

/** Every check appends here; the page is green only if failures is empty. */
const checks = [];
const record = (name, pass, detail) => checks.push({ name, pass: !!pass, detail: detail ?? '' });

const canvas = document.getElementById('gl');
// preserveDrawingBuffer so readPixels sees the frame we just drew rather than a
// buffer the compositor has already recycled.
const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true, antialias: false, alpha: true });

function compile(type, src, label) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  const ok = gl.getShaderParameter(sh, gl.COMPILE_STATUS);
  const log = (gl.getShaderInfoLog(sh) || '').trim();
  record(label + ' compiles', ok, log || 'no log');
  return ok ? sh : null;
}

function run() {
  if (!gl) { record('webgl1 context', false, 'no context'); return; }
  record('webgl1 context', true, gl.getParameter(gl.VERSION));

  const vs = compile(gl.VERTEX_SHADER, VERTEX, 'vertex');
  const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT, 'fragment');
  if (!vs || !fs) return;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  const linked = gl.getProgramParameter(prog, gl.LINK_STATUS);
  record('program links', linked, (gl.getProgramInfoLog(prog) || '').trim() || 'no log');
  if (!linked) return;
  gl.useProgram(prog);

  // curtains.js discovers the sampler and its texture matrix by walking
  // ACTIVE_UNIFORMS on the LINKED program (Program.js:218-229). A uniform the
  // compiler optimised away is simply never uploaded, and an unset texture
  // matrix is all zeroes — which is the documented "curtain painted flat black"
  // bug. So its presence is a hard requirement, not a nicety.
  const active = [];
  const n = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) active.push(gl.getActiveUniform(prog, i).name);
  record('uPrintMatrix is an active uniform', active.indexOf('uPrintMatrix') !== -1, active.join(' '));
  record('uPrint sampler is active', active.indexOf('uPrint') !== -1, '');

  // ── the same grid curtains.js builds: position -1..1, uv 0..1, v up ──────
  const COLS = 48, ROWS = 20;
  const pos = [], uv = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const quad = [[x, y], [x + 1, y], [x, y + 1], [x + 1, y], [x + 1, y + 1], [x, y + 1]];
      for (const [cx, cy] of quad) {
        const u = cx / COLS, v = cy / ROWS;
        pos.push(u * 2 - 1, v * 2 - 1, 0);
        uv.push(u, v);
      }
    }
  }
  const vertexCount = pos.length / 3;

  const bind = (name, data, size) => {
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, name);
    if (loc < 0) { record('attribute ' + name, false, 'not active'); return; }
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
  };
  bind('aVertexPosition', pos, 3);
  bind('aTextureCoord', uv, 2);

  const identity = new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
  const setMat = (name) => {
    const loc = gl.getUniformLocation(prog, name);
    if (loc) gl.uniformMatrix4fv(loc, false, identity);
  };
  setMat('uMVMatrix'); setMat('uPMatrix'); setMat('uPrintMatrix');

  const setF = (name, value) => {
    const loc = gl.getUniformLocation(prog, name);
    if (loc) gl.uniform1f(loc, value);
  };
  const setV3 = (name, r, g, b) => {
    const loc = gl.getUniformLocation(prog, name);
    if (loc) gl.uniform3f(loc, r, g, b);
  };
  setV3('uTint', 0.11, 0.16, 0.20);
  setV3('uTintLit', 0.22, 0.25, 0.28);
  setV3('uTintDeep', 0.05, 0.08, 0.10);

  // A print that is unmistakable against the cloth: pure white ink across the
  // middle third, fully transparent everywhere else. Cloth is dark, so "is
  // there ink here" is just "is this pixel bright".
  const S = 64;
  const px = new Uint8Array(S * S * 4);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const i = (y * S + x) * 4;
      const inside = y > S * 0.36 && y < S * 0.64 && x > S * 0.20 && x < S * 0.80;
      px[i] = px[i+1] = px[i+2] = 255;
      px[i+3] = inside ? 255 : 0;
    }
  }
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, S, S, 0, gl.RGBA, gl.UNSIGNED_BYTE, px);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.activeTexture(gl.TEXTURE0);
  const sampler = gl.getUniformLocation(prog, 'uPrint');
  if (sampler) gl.uniform1i(sampler, 0);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const W = canvas.width, H = canvas.height;
  const buf = new Uint8Array(W * H * 4);

  /* Draw one frame against a magenta ground, so a discarded pixel is visibly
     magenta rather than merely dark. */
  function frame({ open, time, vel, whip }) {
    gl.viewport(0, 0, W, H);
    gl.clearColor(1, 0, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    setF('uTime', time); setF('uOpen', open); setF('uSwag', 0.12);
    setF('uVel', vel); setF('uWhip', whip);
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
    gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, buf);
    return buf.slice();
  }

  // readPixels returns rows from the BOTTOM up, and v = 0 is the bottom too, so
  // the row index is y directly — no flip.
  const at = (px, x, y) => {
    const i = (Math.round(y * (H - 1)) * W + Math.round(x * (W - 1))) * 4;
    return [px[i], px[i+1], px[i+2], px[i+3]];
  };
  const isGap = (c) => c[0] > 200 && c[1] < 60 && c[2] > 200;
  const luma = (c) => (c[0] * 0.299 + c[1] * 0.587 + c[2] * 0.114) / 255;
  const countGap = (px) => {
    let k = 0;
    for (let i = 0; i < px.length; i += 4) if (px[i] > 200 && px[i+1] < 60 && px[i+2] > 200) k++;
    return k / (px.length / 4);
  };
  const differing = (a, b) => {
    let k = 0;
    for (let i = 0; i < a.length; i += 4) if (Math.abs(a[i] - b[i]) > 1) k++;
    return k / (a.length / 4);
  };
  const allBlack = (px) => {
    for (let i = 0; i < px.length; i += 4) {
      if (px[i] > 3 || px[i+1] > 3 || px[i+2] > 3) return false;
    }
    return true;
  };

  // ── 1. never the silent-black fallback, at any point in the draw ─────────
  const stops = [0, 0.35, 0.7, 1];
  for (const open of stops) {
    const px = frame({ open, time: 3, vel: open > 0 && open < 1 ? 0.9 : 0, whip: 0.4 });
    record('uOpen ' + open + ' is not a black frame', !allBlack(px), '');
  }

  // ── 2. the closed curtain covers the screen — no hairline down the middle ─
  const closed = frame({ open: 0, time: 3, vel: 0, whip: 0 });
  record('closed curtain has no gap', countGap(closed) === 0, 'gap fraction ' + countGap(closed).toFixed(4));

  // ── 3. the cloth is ALIVE — the actual reported bug ──────────────────────
  // 5.6s apart is a quarter of the idle sweep's 22.4s period — the widest
  // separation available, so a pass here is not luck about where the band sat.
  const idleA = frame({ open: 0, time: 0.0, vel: 0, whip: 0 });
  const idleB = frame({ open: 0, time: 5.6, vel: 0, whip: 0 });
  record('closed cloth breathes', differing(idleA, idleB) > 0.02,
    (differing(idleA, idleB) * 100).toFixed(1) + '% of pixels changed');

  const mid = { open: 0.5, time: 3.0, vel: 0.9, whip: 0.55 };
  const moveA = frame(mid);
  const moveB = frame({ ...mid, time: 3.05, open: 0.53, vel: 0.92, whip: 0.5 });
  record('drawing cloth moves frame to frame', differing(moveA, moveB) > 0.05,
    (differing(moveA, moveB) * 100).toFixed(1) + '% of pixels changed');

  // ── 4. the cloth GATHERS rather than translating ─────────────────────────
  // The window is a FIXED slice of SCREEN, deliberately: under a translation
  // the same screen slice always shows the same length of cloth and the fold
  // count cannot change, whereas under a compression map more and more cloth
  // is crowded into it. Counting luma turning points along one row is a direct
  // read of pleat density, and it is the difference between the two numbers —
  // not either one alone — that distinguishes a gather from a slide.
  function foldsInWindow(px) {
    // One sample per pixel COLUMN, not a fixed 600: the window is 9.5% of a
    // 640px canvas, so 600 samples landed ~10 to a pixel, every neighbouring
    // pair was byte-identical, and the turning-point count was structurally
    // pinned at zero for both states. Oversampling a raster does not add
    // detail, it just manufactures flat ground.
    const y = 0.5, vals = [];
    const N = Math.max(2, Math.round(0.095 * W));
    for (let i = 0; i < N; i++) {
      const c = at(px, 0.005 + (i / (N - 1)) * 0.095, y);
      if (!isGap(c)) vals.push(luma(c));
    }
    let turns = 0;
    for (let i = 2; i < vals.length; i++) {
      const a = vals[i-1] - vals[i-2], b = vals[i] - vals[i-1];
      if ((a > 0.0008 && b < -0.0008) || (a < -0.0008 && b > 0.0008)) turns++;
    }
    return turns;
  }
  const shutFolds = foldsInWindow(frame({ open: 0, time: 3, vel: 0, whip: 0 }));
  const openFolds = foldsInWindow(frame({ open: 1, time: 3, vel: 0, whip: 0 }));
  record('pleats densify as the curtain gathers', openFolds > shutFolds,
    'folds in the outer 10% of screen: ' + shutFolds + ' closed -> ' + openFolds + ' open');

  // ── 5. the swag survives and the middle is genuinely open ────────────────
  const wide = frame({ open: 1, time: 3, vel: 0, whip: 0 });
  record('open curtain shows the stage', isGap(at(wide, 0.5, 0.5)), 'centre pixel');
  record('a swag of cloth is left at each edge',
    !isGap(at(wide, 0.02, 0.5)) && !isGap(at(wide, 0.98, 0.5)), 'edge pixels');

  // ── 6. the print is glued to the cloth, and does not survive as a smear ──
  const inkClosed = luma(at(closed, 0.5, 0.5));
  record('the copy is printed on the closed cloth', inkClosed > 0.5, 'centre luma ' + inkClosed.toFixed(3));
  // x = 0.09 at full open maps to cloth x ~ 0.32, which is inside the printed
  // band — so this samples a spot that WOULD show ink if inkFade were absent,
  // rather than a spot that is blank either way.
  const swagLuma = luma(at(wide, 0.09, 0.5));
  record('crushed print does not survive in the swag', swagLuma < 0.45, 'swag luma ' + swagLuma.toFixed(3));

}

/* run() bails early on a compile or link failure — the very cases this page is
   for. Publishing from a finally is what makes those visible: without it the
   verdict global stayed undefined and the page read "running…" forever, so a
   broken shader was indistinguishable from a harness that never started. */
function publish() {
  const failed = checks.filter((c) => !c.pass);
  window.__CURTAIN_QA__ = { pass: failed.length === 0 && checks.length > 0, checks, failed };
  document.getElementById('out').textContent =
    checks.map((c) => (c.pass ? 'PASS  ' : 'FAIL  ') + c.name + (c.detail ? '   [' + c.detail + ']' : '')).join('\\n') +
    '\\n\\n' + (failed.length === 0 ? 'ALL PASS' : failed.length + ' FAILED');
}

try { run(); } catch (err) {
  record('harness ran', false, String(err && err.stack || err));
} finally { publish(); }
</script>
`

mkdirSync(OUT_DIR, { recursive: true })
writeFileSync(OUT_PAGE, page)

// WRITE AND EXIT by default. This used to call Bun.serve() unconditionally,
// which never returns — so every run looked like the script had hung, and it was
// eventually killed after ten minutes and written off as a dead QA path. It was
// working perfectly; it just had no way to finish.
//
// The page is self-contained, so `open` on the file is enough for the normal
// case. `--serve` is kept for the times a real origin is wanted (some engines
// gate WebGL differently on file://).
if (process.argv.includes('--serve')) {
  const port = Number(process.env.QA_PORT ?? 8722)
  // node:http rather than Bun.serve. One page, one handler — there was nothing
  // here that needed a Bun-specific server, only a habit of reaching for one.
  createServer((_req, res) => {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
    res.end(page)
  }).listen(port)
  console.log(`qa_curtain: page written to ${OUT_PAGE}`)
  console.log(`qa_curtain: serving on http://localhost:${port}/  (read window.__CURTAIN_QA__)`)
  console.log('qa_curtain: ctrl-c to stop')
} else {
  console.log(`qa_curtain: page written to ${OUT_PAGE}`)
  console.log(`qa_curtain: open it and read window.__CURTAIN_QA__ — the verdict is on the page`)
  console.log(`qa_curtain:   open ${OUT_PAGE}`)
  console.log('qa_curtain: pass --serve to host it on a real origin instead')
}
