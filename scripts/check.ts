#!/usr/bin/env node
/**
 * check.ts — prove the thing works before it ships.
 *
 * Every check here exists because getting it wrong would ship a broken book
 * that still *looks* fine to whoever built it:
 *   - inline mode leaving a file path behind  -> pictures break when emailed
 *   - folder mode leaving a data URI behind   -> the "small" file is not small
 *   - dedup regressing                        -> books quietly double in size
 *   - a missing picture not failing the build -> a blank hole ships
 */

import { spawn } from 'node:child_process'
import { access, rm, readFile, readdir, mkdir, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const TMP = join(ROOT, 'output', '.check')
// One sample now: the book is the only output.
const SAMPLE = join(ROOT, 'content', 'sample-book.md')

let passed = 0
let failed = 0

function check(name: string, ok: boolean, detail = ''): void {
  if (ok) { passed++; console.log(`  pass  ${name}`) }
  else { failed++; console.log(`  FAIL  ${name}${detail ? `\n        ${detail}` : ''}`) }
}

/**
 * Run the real build as a child process.
 *
 * `process.execPath` — the checks exercise the build under whichever runtime is
 * running the checks. Naming `bun` here would have meant the suite silently kept
 * proving the Bun path worked while the shipped Node path went untested, which
 * is precisely the wrong thing for a suite whose job is to catch that.
 */
async function build(args: string[]): Promise<{ code: number; out: string }> {
  return await new Promise((res) => {
    const proc = spawn(process.execPath, [join(ROOT, 'src/build.ts'), ...args], {
      cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'],
    })
    let out = ''
    proc.stdout.on('data', (d) => { out += d })
    proc.stderr.on('data', (d) => { out += d })
    proc.on('close', (code) => res({ code: code ?? 0, out }))
  })
}

console.log('\ntell-your-story — checks\n')

await rm(TMP, { recursive: true, force: true })
await mkdir(TMP, { recursive: true })

// ── inline mode ─────────────────────────────────────────────────────────────
const inlinePath = join(TMP, 'inline.html')
const inline = await build([SAMPLE, inlinePath, '--quiet'])
check('inline build succeeds', inline.code === 0, inline.out.trim())

const inlineHtml = await readFile(inlinePath, 'utf8')
check('inline: pictures are embedded', inlineHtml.includes('src="data:image/png;base64,'))
check('inline: NO folder paths leaked', !/src="assets\//.test(inlineHtml))
check('inline: no unresolved references', !inlineHtml.includes('asset:'))
check('inline: nothing to write beside it',
  !(await readdir(TMP)).includes('assets'))

// ── folder mode ─────────────────────────────────────────────────────────────
const folderDir = join(TMP, 'folder')
const folderPath = join(folderDir, 'folder.html')
const folder = await build([SAMPLE, folderPath, '--assets', 'folder', '--quiet'])
check('folder build succeeds', folder.code === 0, folder.out.trim())

const folderHtml = await readFile(folderPath, 'utf8')
check('folder: pictures are paths', /src="assets\/[a-f0-9]{8}\.png"/.test(folderHtml))
check('folder: NO embedded pictures leaked', !folderHtml.includes('data:image/png;base64,'))
check('folder: no unresolved references', !folderHtml.includes('asset:'))

const written = await readdir(join(folderDir, 'assets'))
check('folder: picture files were written', written.length > 0)

// every path in the HTML must exist on disk, or the book ships broken
const referenced = [...folderHtml.matchAll(/src="assets\/([^"]+)"/g)].map((m) => m[1])
const missing = referenced.filter((f) => !written.includes(f))
check('folder: every referenced file exists', missing.length === 0, `missing: ${missing.join(', ')}`)

// ── the switch changes only the pictures ────────────────────────────────────
// Normalise BOTH ways an asset can be referenced. The original only handled
// `src="…"`, which was enough for the deck; the book also pulls assets from CSS
// `url(…)` (the grain tile, the page mark), so the two modes differed on those
// and the comparison failed for the wrong reason.
const strip = (html: string) =>
  html.replace(/src="(data:[^"]+|assets\/[^"]+)"/g, 'src="X"')
      .replace(/url\("?(data:[^)"]+|assets\/[^)"]+)"?\)/g, 'url("X")')
check('both modes produce the same book apart from picture refs',
  strip(inlineHtml) === strip(folderHtml))

// ── dedup ───────────────────────────────────────────────────────────────────
// The sample references 4 images, two of which are byte-identical.
const uniqueFiles = new Set(referenced)
check('dedup: identical pictures stored once',
  written.length === uniqueFiles.size && written.length === 3,
  `stored ${written.length}, referenced ${referenced.length} times`)

// ── failure paths ───────────────────────────────────────────────────────────
const brokenMd = join(TMP, 'broken.md')
await writeFile(brokenMd, '---\ntitle: "x"\n---\n\n# x\n\n![gone](nope.png)\n')
const broken = await build([brokenMd, join(TMP, 'broken.html'), '--quiet'])
check('a missing picture fails the build', broken.code !== 0)
check('...with a readable message, not a stack trace',
  broken.out.includes('Picture not found') && !broken.out.includes('at async'))

const badMode = await build([SAMPLE, join(TMP, 'x.html'), '--assets', 'sideways'])
check('an invalid --assets value is rejected', badMode.code !== 0)

// ── output hygiene ──────────────────────────────────────────────────────────
check('no literal script-close sequence in the output',
  !inlineHtml.includes('</scr' + 'ipt>') || inlineHtml.split('</scr' + 'ipt>').length === 2,
  'an inlined bundle containing that literal would truncate the file')


// ── the flipbook ────────────────────────────────────────────────────────────
const SAMPLE_BOOK = SAMPLE

const bookInlinePath = join(TMP, 'book.html')
const bookInline = await build([SAMPLE_BOOK, bookInlinePath, '--quiet'])
check('book build succeeds', bookInline.code === 0, bookInline.out.trim())

const bookHtml = await readFile(bookInlinePath, 'utf8')
check('book: page-flip stylesheet is included', bookHtml.includes('.stf__block'))
check('book: no unreplaced script placeholder', !bookHtml.includes('__JS__'),
  'a $& in the minified bundle hijacks a string replace and pastes the placeholder back')
check('book: closed cover is present', bookHtml.includes('book-closed'))
check('book: paper token resolved to a colour', /--paper:#[0-9A-F]{6}/i.test(bookHtml))

// The grain tile must be a TRANSPARENT noise overlay. If its filter reference
// does not resolve, the rect falls back to a solid black fill and every page
// turns black — which is exactly what happened once.
// (The id is whatever svg.ts declares; assert the reference MATCHES it rather
// than hard-coding a name, so renaming the filter cannot fail this falsely.)
const grain = bookHtml.match(/--grain:url\("data:image\/svg\+xml,([^"]+)"\)/)
const grainSvg = grain ? decodeURIComponent(grain[1]) : ''
const grainId = grainSvg.match(/id="([^"]+)"/)?.[1]
check('book: grain filter reference resolves',
  !!grainId && grainSvg.includes(`url(#${grainId})`),
  `declared id=${grainId ?? '(none)'}, references present: ${/url\(#/.test(grainSvg)}`)
check('book: grain rect cannot paint solid black', /fill="none"/.test(grainSvg))

// ── single-page mode ──────────────────────────────────────────────────────
// The reader can force one page or the spread, so both must ship and both must
// be reachable from the control.
check('book: the view control ships', /data-action="view"/.test(bookHtml))
// Asserted as the ORDER ARRAY rather than three loose words: `single` and
// `spread` both occur elsewhere in the runtime (the page counter is `.spread`),
// so searching for the words alone would pass even if a mode were dropped.
check('book: the view control offers all three modes',
  bookHtml.includes('["auto","single","spread"]'),
  'auto / one page / spread must all be reachable from the runtime')

// EVERY `body.portrait .x` RULE MUST NAME A CLASS THE BOOK ACTUALLY RENDERS.
//
// This exists because `body.portrait .rail { display: none }` sat in the
// stylesheet for its whole life hiding nothing: the element is `.tabs`, and the
// only rails in the tree belong to the curtain and the timeline. Nothing failed,
// nothing warned — the fore-edge tabs simply stayed glued to the edge of a lone
// page and single-page mode looked like a broken half-spread.
//
// A rule that targets a class no page carries is always a typo or a rename, and
// it is invisible precisely because CSS does not complain.
const portraitTargets = [...bookHtml.matchAll(/body\.portrait\s+\.([a-z0-9-]+)/gi)].map((m) => m[1])
const unusedTargets = [...new Set(portraitTargets)].filter(
  (cls) => !new RegExp(`class="[^"]*\\b${cls}\\b`, 'i').test(bookHtml),
)
check('book: every single-page override targets a class that exists',
  unusedTargets.length === 0,
  unusedTargets.length ? `hides nothing: ${unusedTargets.map((c) => '.' + c).join(', ')}` : `${portraitTargets.length} checked`)

// Content must survive a dead runtime: hiding is applied BY js, not in the
// base stylesheet.
// An UNGUARDED rule is one whose selector begins with `.reveal` — the guarded
// form is `.js-anim .reveal`, so it never starts the selector.
check('book: content is not hidden by default CSS',
  bookHtml.includes('.js-anim .reveal') && !/^\s*\.reveal\s*\{[^}]*opacity:\s*0/m.test(bookHtml),
  'CSS-hidden + JS-revealed content ships blank whenever the script fails')

const bookFolderDir = join(TMP, 'bookfolder')
const bookFolder = await build([SAMPLE_BOOK, join(bookFolderDir, 'b.html'), '--assets', 'folder', '--quiet'])
check('book: folder mode succeeds', bookFolder.code === 0, bookFolder.out.trim())
const bookFolderHtml = await readFile(join(bookFolderDir, 'b.html'), 'utf8')
check('book: folder mode has no embedded pictures', !bookFolderHtml.includes('data:image/png;base64,'))
// Measure what the switch actually promises: that the picture payload LEFT the
// file. A whole-file ratio cannot say that — the engine (GSAP + page-flip +
// curtains.js) is a fixed few hundred KB, so a picture-light book would fail a
// "3x smaller" test while behaving perfectly.
const embeddedBase64 = [...bookHtml.matchAll(/data:image\/[a-z+.-]+;base64,([A-Za-z0-9+/=]+)/g)]
  .reduce((n, m) => n + m[1]!.length, 0)
check('book: folder mode sheds the whole picture payload',
  embeddedBase64 > 0 &&
  Buffer.byteLength(bookHtml) - Buffer.byteLength(bookFolderHtml) > embeddedBase64 * 0.9,
  `inline ${Buffer.byteLength(bookHtml)}B, folder ${Buffer.byteLength(bookFolderHtml)}B, ` +
  `base64 payload ${embeddedBase64}B`)


// ── the curtain, against curtains.js's real contract ────────────────────────
// Each of these was a live bug. They are cheap to assert and expensive to
// rediscover, because every one of them fails SILENTLY in the browser.
const curtainSrc = await readFile(join(ROOT, 'src/runtime/curtain.ts'), 'utf8')

// The default vertex shader assigns `vTextureCoord = aTextureCoord` directly.
// `planeTextureMatrix` is not a uniform on an untextured plane, so multiplying
// by it multiplies by a zero matrix: every UV comes out 0 and the curtain
// paints flat black.
// Matches real GLSL use — a declaration or a multiplication — not the comments
// that explain why it is banned.
check('curtain: no phantom planeTextureMatrix uniform',
  !/uniform\s+mat4\s+planeTextureMatrix|planeTextureMatrix\s*\*/.test(curtainSrc),
  'that uniform does not exist on an untextured plane — it reads as a zero matrix')

// The cloth parts inside the shader (uOpen + discard) rather than by moving the
// plane. A CSS transform on the source element moves NOTHING — a plane's matrix
// comes from the element's bounding rect — and moving two planes would leave the
// printed copy split across two textures that must be kept in register.
check('curtain: the cloth parts in the shader, not by moving the element',
  /discard/.test(curtainSrc) && /uOpen/.test(curtainSrc),
  'a CSS transform on the source element does not move a curtains.js plane')

// The copy is rasterised into the plane's texture so it rides the folds. If it
// ever goes back to being HTML over the canvas it will sit flat and rigid again.
check('curtain: the copy is printed into the cloth texture',
  /printCopy/.test(curtainSrc) && /texture2D\(uPrint/.test(curtainSrc),
  'the title and photo must be part of the fabric, not floating above it')

// The texture matrix uniform is `<samplerName>Matrix` (Texture.js:343) and the
// sampler name must match the one declared to the Plane.
check('curtain: sampler and its matrix uniform agree',
  /sampler:\s*'uPrint'/.test(curtainSrc) &&
  /uniform sampler2D uPrint/.test(curtainSrc) &&
  /uniform mat4 uPrintMatrix/.test(curtainSrc))

// Rasterising before webfonts land bakes a fallback face into the cloth, and
// unlike HTML a texture cannot re-flow when the real font arrives.
check('curtain: waits for webfonts before printing the cloth',
  /document\.fonts\?*\.ready/.test(curtainSrc))

// Custom shaders are compiled verbatim — curtains.js prepends its chunks only
// to its own defaults, so ours must declare precision/attributes/varyings.
for (const decl of ['precision mediump float', 'attribute vec3 aVertexPosition',
                    'attribute vec2 aTextureCoord']) {
  check(`curtain: custom shader declares "${decl}"`, curtainSrc.includes(decl),
    'a custom shader gets no chunks prepended')
}

// uTime as a frame counter advances the wave by its whole coefficient EVERY
// frame — the cloth strobed several times a second and read as broken. It must
// come from wall time, which is also the only way the speed matches on a 60Hz
// and a 120Hz display.
// The timestamp may be hoisted into a local — the render loop needs one single
// reading of the clock for uTime and for the whip integrator's dt, and calling
// performance.now() twice would hand them different instants. So this accepts a
// variable as the numerator but still insists the file reads wall time and
// never increments uTime.
check('curtain: uTime is wall-clock seconds, not a frame counter',
  /uTime\.value\s*=\s*\(\s*(?:performance\.now\(\)|\w+)\s*-\s*\w+\s*\)\s*\/\s*1000/.test(curtainSrc) &&
  /performance\.now\(\)/.test(curtainSrc) &&
  !/uTime\.value\s*(as number)?\s*\)?\+\+|\+\+\s*\(?\s*plane\.uniforms\.uTime/.test(curtainSrc),
  'incrementing uTime per frame makes the curtain strobe and ties speed to refresh rate')

// GLSL leaves pow() UNDEFINED for a negative base. `pow((uv.x - p) * 3.0, 2.0)`
// compiled cleanly and returned NaN at runtime, turning the curtain black. Any
// pow() whose base contains a subtraction is suspect — use d*d for squares.
// Scan CODE only. Matching raw source flags the comments that explain the rule,
// which is how this check failed the first time it was written.
const curtainCode = curtainSrc.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '')
const powBases = [...curtainCode.matchAll(/pow\(([^,]*),/g)].map((m) => m[1]!)
check('curtain: no pow() with a possibly-negative base',
  powBases.every((b) => !b.includes('-')),
  `suspect bases: ${powBases.filter((b) => b.includes('-')).join(' | ')} — GLSL pow() is ` +
  'undefined for a negative base and yields NaN, not an error')

// A backtick inside the GLSL template literals TERMINATES the JS string. It has
// happened three times, always in a comment quoting a shader expression, and the
// error it produces points at the wrong thing entirely.
const glslBlocks = [...curtainSrc.matchAll(/const (?:CLOTH|VERTEX|FRAGMENT) = `([\s\S]*?)\n`/g)]
check('curtain: no backticks inside the GLSL template literals',
  glslBlocks.every((m) => !m[1]!.includes('\u0060')),
  'a backtick in a shader comment ends the JS string and the error points elsewhere')

// A running CSS keyframe animation outranks an inline style, so the hint has to
// have its animation stopped before it can be faded out.
check('curtain: the pulsing hint has its animation stopped before fading',
  /animation:\s*'none'/.test(curtainSrc),
  'CSS keyframes outrank the inline opacity GSAP writes')

// ── the capability manifest cannot drift ────────────────────────────────────
// The kit has a lot of features now, and an assistant handed content will only
// use the ones it can see. Prose docs rot: a block gets added in markdown.ts and
// nobody edits the README. So the check reads the REAL IMPLEMENTATION and fails
// if anything in the code is missing from the manifest. The code proves the
// catalogue complete — not the other way round.
const { CAPABILITY_IDS } = await import(join(ROOT, 'src/capabilities.ts'))
const manifest = new Set<string>(CAPABILITY_IDS)

// 1. every ::: block declared in markdown.ts
const markdownSrc = await readFile(join(ROOT, 'src/markdown.ts'), 'utf8')
const blockNames = [...markdownSrc.matchAll(/\{\s*name:\s*'([a-z]+)'/g)].map((m) => m[1]!)
const missingBlocks = blockNames.filter((b) => !manifest.has(`:::${b}`))
check('manifest: every content block is documented',
  missingBlocks.length === 0,
  `implemented but undocumented: ${missingBlocks.map((b) => ':::' + b).join(', ')} — ` +
  'add them to src/capabilities.ts or an assistant will never use them')

// ── the committed runtime bundle ────────────────────────────────────────────
// `assets/runtime.bundle.js` is what lets this skill build a book without Bun
// and without the three animation libraries — it is the whole zero-heavy-install
// story in one file. Which means a STALE one is the worst possible failure: the
// build succeeds, says nothing, and ships last week's behaviour. So the stamp is
// taken over the runtime sources and compared here rather than trusted.
{
  const { runtimeStamp, BUNDLE_PATH, STAMP_PATH } = await import(join(ROOT, 'scripts/prebundle.ts'))
  const bundled = await readFile(BUNDLE_PATH, 'utf8').catch(() => '')
  check('runtime: the committed bundle exists',
    bundled.length > 1000,
    'run "node scripts/prebundle.ts" and commit assets/runtime.bundle.js — without it the ' +
    'skill needs Bun and 17 MB of animation libraries on every machine')

  const stamped = (await readFile(STAMP_PATH, 'utf8').catch(() => '')).trim()
  const actual = await runtimeStamp(ROOT)
  check('runtime: the committed bundle is not stale',
    stamped === actual,
    `the runtime sources changed since the bundle was built (${stamped || 'none'} vs ${actual}) — ` +
    'run "node scripts/prebundle.ts". A stale bundle builds happily and ships old behaviour.')

  // ── THE NODE-SIDE TOOLS ─────────────────────────────────────────────────
  // Same failure, one layer up. A stale dist/build.mjs is worse than a stale
  // runtime bundle, because it is the DEFAULT path in the docs: a reader with
  // no node_modules would silently build with last week's engine and have no
  // way to notice, since the book it produces looks entirely correct.
  const { toolsStamp, TOOLS_STAMP_PATH } = await import(join(ROOT, 'scripts/prebundle.ts'))
  const builder = await readFile(join(ROOT, 'dist/build.mjs'), 'utf8').catch(() => '')
  check('dist: the zero-install builder exists',
    builder.length > 10000,
    'run "node scripts/prebundle.ts" and commit dist/ — without it a user must npm install ' +
    'before they can build anything')

  const toolsStamped = (await readFile(TOOLS_STAMP_PATH, 'utf8').catch(() => '')).trim()
  const toolsActual = await toolsStamp(ROOT)
  check('dist: the zero-install builder is not stale',
    toolsStamped === toolsActual && toolsActual !== 'no-sources',
    `the builder's sources changed since dist/ was built (${toolsStamped || 'none'} vs ` +
    `${toolsActual}) — run "node scripts/prebundle.ts". Anyone without node_modules is ` +
    'running the old engine and cannot tell.')

  // Not startsWith: build.ts carries a `#!/usr/bin/env node` shebang, which
  // esbuild keeps on line one and puts the banner beneath.
  check('dist: the require shim survived bundling',
    builder.slice(0, 400).includes('createRequire'),
    "dist/build.mjs is missing the createRequire banner — yaml's CommonJS build calls " +
    "require('process') internally and the builder dies on its first line without it")

  check('runtime: page-flip css is vendored',
    (await readFile(join(ROOT, 'assets/pageflip.css'), 'utf8').catch(() => '')).includes('stf__'),
    'assets/pageflip.css is missing — the build would fall back to reading it out of ' +
    'node_modules, which quietly makes the whole 17 MB install mandatory again')
}

// ── no Bun-only APIs on the path that builds a book ─────────────────────────
// One of them is enough to make the entire skill require Bun. `Bun.build` and
// `Bun.file` were both here; `import.meta.dir` is a Bun extension that arrives
// as undefined in Node and takes the process down inside path.resolve() before
// a single file is read.
// EVERY file, not only the ones that build a book. A kit where the build runs on
// Node but half the tooling demands Bun is not one runtime, it is two with extra
// steps — and the person who finds out is whoever tries to run `check` on a
// machine that has the other one.
const portableFiles = [
  ...(await readdir(join(ROOT, 'src'))).filter((f) => f.endsWith('.ts')).map((f) => `src/${f}`),
  ...(await readdir(join(ROOT, 'scripts'))).filter((f) => f.endsWith('.ts')).map((f) => `scripts/${f}`),
]
for (const file of portableFiles) {
  const raw = await readFile(join(ROOT, file), 'utf8').catch(() => '')
  // Comments stripped FIRST. The first version of this check failed on the very
  // comments explaining why the Bun calls had been removed — a check that cannot
  // tell code from prose is worse than none, because the fix is to delete the
  // explanation.
  const src = raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
  const bunOnly = /\bBun\.\w+|import\.meta\.(dir|main)\b|from ['"]bun['"]/.test(src)
  check(`portable: ${file}`, !bunOnly,
    'uses a Bun-only API — one of these is enough to make the whole skill require ' +
    'a specific runtime, which is the thing this kit is supposed to have stopped needing')
}

// 1b. every block also has to APPEAR in the design sandbox's source, or the
// sandbox stops being a complete picture of the design the moment a block is
// added. A component you cannot see is a component nobody will notice is broken
// — which is the exact failure this sandbox exists to prevent.
const statesSrc = await readFile(join(ROOT, 'design/states.md'), 'utf8')
const unshown = blockNames.filter((b) => !new RegExp(`^:::${b}\\b`, 'm').test(statesSrc))
check('design: every block appears in the sandbox',
  unshown.length === 0,
  `not shown in design/states.md: ${unshown.map((b) => ':::' + b).join(', ')} — ` +
  'add a page for it, or working on the design there means working blind to it')

// 2. every frontmatter key the book build actually reads
const bookBuildSrc = await readFile(join(ROOT, 'src/build.ts'), 'utf8')
const fmKeys = [...bookBuildSrc.matchAll(/fm\.([a-z_]+)/g)].map((m) => m[1]!)
const missingFm = [...new Set(fmKeys)].filter(
  (k) => !manifest.has(k) && !['lang', 'transition'].includes(k))
check('manifest: every front-matter key is documented',
  missingFm.length === 0,
  `read by the build but undocumented: ${missingFm.join(', ')}`)

// 3. every CLI flag
const flags = [...bookBuildSrc.matchAll(/arg === '(--[a-z]+)'/g)].map((m) => m[1]!)
const missingFlags = flags.filter(
  (f) => !CAPABILITY_IDS.some((id: string) => id.startsWith(f)) && f !== '--help')
check('manifest: every CLI flag is documented',
  missingFlags.length === 0,
  `accepted but undocumented: ${missingFlags.join(', ')}`)

// A manifest that documents things that do not exist is the opposite failure
// and is just as misleading to an assistant choosing from it.
const phantom = [...manifest].filter((id) => id.startsWith(':::'))
  .filter((id) => !blockNames.includes(id.slice(3)))
check('manifest: documents nothing that does not exist',
  phantom.length === 0,
  `documented but not implemented: ${phantom.join(', ')}`)

// ── an unreplaced placeholder must never reach a reader ─────────────────────
//
// The templates are written with [BRACKETED CAPITALS] precisely so a forgotten
// one is impossible to miss on the page — but "impossible to miss" assumes
// somebody looks. This makes the build refuse instead.
//
// It is the single most likely user error in the whole skill: copy the starter,
// fill in most of it, build, send. The failure is silent, public, and lands on
// the person who sent it rather than on the person who wrote the tool.
{
  const leaked = [...bookHtml.matchAll(/\[[A-Z][A-Z0-9 ,'·\-—]{2,60}\]/g)]
    .map((m) => m[0])
    // A real book may legitimately print bracketed capitals — an acronym gloss,
    // a citation marker. What it never does is print the exact strings the
    // templates ship, so the check is anchored to those words rather than to
    // the shape alone.
    .filter((s) => /\b(TITLE|HEADING|EYEBROW|PARAGRAPH|SECTION|BRAND|COLUMN|CELL|STEP|STAGE|LABEL|NUMBER|CAPTION|NOTE|TIME|DATE|SENTENCE|LINE|WHAT|HOW|YOUR|FIRST|SECOND|THIRD|DESCRIPTION|FILE|SHORT)\b/.test(s))
  check('content: no template placeholder survived into the book',
    leaked.length === 0,
    `${[...new Set(leaked)].slice(0, 6).join(' ')} — replace these, or delete the page that carries them`)

  // THE GUARD KNOWS EXACT STRINGS, so it has to be kept in step with the
  // templates it guards. A new placeholder in a template that is not in the
  // embedded set is a placeholder the build will happily ship.
  //
  // Exact strings rather than a shape, because the shape version blocked
  // [LOCAL EMERGENCY NUMBER] and [HOLD TIME IN MINUTES] — deliberate fill-in
  // markers for site-specific values an author refuses to invent. Every one of
  // the baseline eval runs reached for that pattern unprompted, and on safety
  // material it is the right instinct: refusing it pushes someone to make an
  // emergency number up rather than leave it visibly blank.
  const buildSrc = await readFile(join(ROOT, 'src/build.ts'), 'utf8')
  const embedded = new Set(
    [...(/const TEMPLATE_PLACEHOLDERS = new Set\(\[([\s\S]*?)\]\)/.exec(buildSrc)?.[1] ?? '')
      .matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => JSON.parse(`"${m[1]}"`) as string),
  )
  const inTemplates = new Set<string>()
  for (const f of ['templates/starter.md', 'templates/LAYOUTS.md']) {
    for (const m of (await readFile(join(ROOT, f), 'utf8')).matchAll(/\[[A-Z][^\]\n]{1,70}\]/g)) {
      inTemplates.add(m[0])
    }
  }
  const unguarded = [...inTemplates].filter((s) => !embedded.has(s))
  check(`content: all ${inTemplates.size} template placeholders are in the build's guard`,
    unguarded.length === 0,
    `${unguarded.slice(0, 5).join(' ')} — the build would ship these; regenerate TEMPLATE_PLACEHOLDERS in src/build.ts`)
}

// ── the templates cover every layout an author can reach ────────────────────
//
// A layout with no template is one an author has to reverse-engineer from the
// source, which in practice means it never gets used. This keeps the catalogue
// and the documentation from drifting apart in the direction that silently
// shrinks the kit.
{
  const layoutsDoc = await readFile(join(ROOT, 'templates/LAYOUTS.md'), 'utf8')
  const md = await readFile(join(ROOT, 'src/markdown.ts'), 'utf8')
  const authored = [...md.matchAll(/\{ name: '([a-z]+)'/g)].map((m) => m[1]!)
  const undocumented = authored.filter((b) => !layoutsDoc.includes(`:::${b}`))
  check(`templates: all ${authored.length} content blocks have a copyable example`,
    undocumented.length === 0,
    `${undocumented.map((b) => ':::' + b).join(', ')} — an author cannot use a block they cannot find`)

  const { LAYOUTS } = await import(join(ROOT, 'src/layout.ts'))
  // The four generated layouts are listed in the doc's closing table rather
  // than as copyable blocks, because authoring one by hand is the bug.
  const generated = ['cover', 'contents', 'divider', 'prose', 'has-sticky', 'half-bleed']
  const missing = (LAYOUTS as string[])
    .filter((l) => !generated.includes(l))
    .filter((l) => !layoutsDoc.toLowerCase().includes(l.replace('-', ' ')) && !layoutsDoc.includes(`:::${l}`))
  check(`templates: all ${LAYOUTS.length} layouts are documented`,
    missing.length === 0, missing.join(', '))
}

// ── every import on the build path is a real dependency ─────────────────────
//
// The split is not cosmetic. `dependencies` is what a user needs to BUILD a
// book; `devDependencies` is tooling plus the three runtime libraries, which
// are already inside the committed bundle and are therefore never needed by
// anyone installing this skill.
//
// linkedom and @svgdotjs/svg.js were declared as devDependencies while being
// imported on the build path, so `npm install --omit=dev` produced a skill that
// installed cleanly and then could not build anything. That fails at the worst
// possible moment: for a new user, on their first run, with an error naming a
// package they never heard of.
{
  const pkg = JSON.parse(await readFile(join(ROOT, 'package.json'), 'utf8'))
  const deps = Object.keys(pkg.dependencies ?? {})
  const dev = Object.keys(pkg.devDependencies ?? {})
  const seen = new Set<string>()
  const bare = new Set<string>()
  const walk = async (file: string) => {
    if (seen.has(file)) return
    seen.add(file)
    const src = await readFile(file, 'utf8').catch(() => '')
    for (const m of src.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
      const spec = m[1]!
      if (spec.startsWith('.')) await walk(join(dirname(file), spec))
      else if (!spec.startsWith('node:')) {
        bare.add(spec.split('/').slice(0, spec.startsWith('@') ? 2 : 1).join('/'))
      }
    }
  }
  await walk(join(ROOT, 'src/build.ts'))
  const misfiled = [...bare].filter((b) => !deps.includes(b))
  check(`deps: all ${bare.size} build-path imports are real dependencies`,
    misfiled.length === 0,
    misfiled.map((m) => `${m} (${dev.includes(m) ? 'declared as a devDependency' : 'not declared at all'})`).join(', ') +
    ' — a production install would fail on first build')

  // And the mirror: the three runtime libraries must NOT be dependencies. They
  // are pre-bundled, and declaring them would make every user download 16 MB
  // of packages whose code they already have inside assets/runtime.bundle.js.
  const prebundled = ['gsap', 'page-flip', 'curtainsjs'].filter((p) => deps.includes(p))
  check('deps: the pre-bundled runtime libraries are not forced on users',
    prebundled.length === 0,
    `${prebundled.join(', ')} are already inside the committed bundle — declaring them costs every user the download for nothing`)
}

// ── the GLSL is inside a template literal, so a backtick ends it ────────────
//
// FIFTH OCCURRENCE. Writing `folds` or `lit` in a shader COMMENT — the ordinary
// way to quote an identifier in every other file in this project — terminates
// the template literal holding the GLSL, and the build dies somewhere further
// down with a message that names neither the shader nor the backtick.
//
// Worse when it does not die: a failed shader compile is SILENT under
// curtains.js, which falls back to a fragment shader that is literally
// `gl_FragColor = vec4(0,0,0,1)`. The curtain simply goes black, with no
// console error, and the cause is a punctuation mark inside a comment.
{
  const src = await readFile(join(ROOT, 'src/runtime/curtain.ts'), 'utf8')
  const shaderBlocks = [...src.matchAll(/const (CLOTH|VERTEX|FRAGMENT)\s*=\s*`([\s\S]*?)`\s*\n/g)]
  const withTick = shaderBlocks.filter((m) => m[2]!.includes('`'))
  check(`shader: all ${shaderBlocks.length} GLSL blocks are free of stray backticks`,
    shaderBlocks.length >= 2 && withTick.length === 0,
    withTick.length
      ? `${withTick.map((m) => m[1]).join(', ')} — a backtick in a GLSL comment ends the template literal`
      : 'no GLSL blocks found, so this check is not looking at anything')

  // pow() with a negative base is UNDEFINED in GLSL and returns NaN in silence.
  // Both traps below have been hit here before, which is why they are checks.
  const powSubtract = [...src.matchAll(/pow\(\s*[^,)]*[a-zA-Z0-9_)]\s*-\s*[^,)]*,/g)]
    .map((m) => m[0])
    .filter((s) => !/clamp|max\(/.test(s))
  check('shader: no pow() takes a base that can go negative',
    powSubtract.length === 0,
    `${powSubtract.join(' | ')} — pow() is undefined for a negative base and returns NaN silently; clamp it`)
}

// ── every shipped palette, not just the default ─────────────────────────────
//
// themes/ holds seven alternates ported from the design's own pairings. Four of
// them pinned a lit crest that scored under 3:1 against their own void — they
// were authored for a CSS gradient curtain, and the shader draws the same
// colour darker — so shipped as written they would each render the invisible
// curtain this kit already fixed once. The derivation corrects them by
// measurement; this proves it still does, for every one, rather than for the
// one palette that happens to be default.
{
  const { readdir } = await import('node:fs/promises')
  const { buildPalette: bp, loadTheme: lt, contrast: ct } = await import(join(ROOT, 'src/theme.ts'))
  const files = (await readdir(join(ROOT, 'themes')).catch(() => [])).filter((f) => f.endsWith('.json'))
  const bad: string[] = []
  for (const f of ['../theme.json', ...files]) {
    const theme = await lt(join(ROOT, 'themes', f))
    const p = bp(theme)
    const lit = ct(p.curtainClothLit, p.deep)
    const fold = ct(p.curtainClothLit, p.curtainClothDeep)
    if (lit < 3 || lit <= fold) {
      bad.push(`${theme.name}: cloth-on-void ${lit.toFixed(2)}, folds ${fold.toFixed(2)}`)
    }
  }
  check(`theme: all ${files.length + 1} shipped palettes read as lit fabric`,
    bad.length === 0, bad.join(' | '))
}

// ── the stage: colour hierarchy ─────────────────────────────────────────────
// The curtain was once 1.52:1 against the void it hung in, while the FOLDS
// inside it sat at 2.71:1 — so the eye read stripes but no cloth. Every dark
// tone descended from one navy and differed only by how much black was mixed
// in. These checks exist so a rebrand cannot quietly recreate that.
const { buildPalette, loadTheme, contrast } = await import(join(ROOT, 'src/theme.ts'))
const pal = buildPalette(await loadTheme(join(ROOT, 'theme.json')))

// MEASURE THE CREST, NOT THE TROUGH.
//
// This check used to read the base cloth colour, and it was measuring the wrong
// surface. On a pleated fabric the base tone is the shadowed trough; the lit
// crest is the part facing the room, and it is what the eye reads as "there is
// cloth there". The design's own cloth measures 1.63:1 flat and 3.25:1 at the
// crest — the first number would condemn a curtain that is plainly visible on
// screen, and "correcting" it would have meant lightening a palette that was
// deliberately kept dark so the paper stays the lit thing in the room.
const clothVsVoid = contrast(pal.curtainClothLit, pal.deep)
check('stage: the lit cloth is distinguishable from the void',
  clothVsVoid >= 3,
  `lit crest ${pal.curtainClothLit} on void ${pal.deep} = ${clothVsVoid.toFixed(2)}:1, needs 3:1`)

// The real failure mode, and the one that produced the original bug: the folds
// INSIDE the cloth out-contrasting the cloth against its own background. When
// that inverts, the eye reads stripes on a dark field instead of a lit fabric.
// Recorded numbers from the bug: cloth-on-void 1.52:1 while folds sat at 2.71:1.
const foldContrast = contrast(pal.curtainClothLit, pal.curtainClothDeep)
check('stage: the cloth separates from the void more than its folds do from each other',
  clothVsVoid > foldContrast,
  `lit-on-void ${clothVsVoid.toFixed(2)}:1 vs fold ${foldContrast.toFixed(2)}:1 — ` +
  'when the folds win, the curtain reads as a striped background, not fabric')
// Both assertions were re-run against the palette that shipped the original bug
// before this rewrite was accepted: it derives a lit crest of #555E62, scoring
// 2.72:1 on the void against folds at 2.84:1 — and fails BOTH. Measuring the
// crest instead of the trough made the check correct, not lenient.

// The rim is what actually pulls the gathered swag off a near-black void.
check('stage: the rim light reads against the void',
  contrast(pal.curtainRim, pal.deep) >= 6,
  `rim ${pal.curtainRim} on void = ${contrast(pal.curtainRim, pal.deep).toFixed(2)}:1`)

// Warm light, cool shadow. Two tones of ONE hue read as flat however far apart
// their luminance is, so the split is checked, not assumed.
// Warmth must be NORMALISED by overall brightness. Raw (red - blue) shrinks as
// a colour darkens, so a shadow will always look "warmer" than a highlight by
// that measure — this check failed on a correctly warm/cool pair before the
// denominator was added.
const warmth = (h: string) => {
  const n = parseInt(h.slice(1), 16)
  const r = n >> 16, g = (n >> 8) & 255, b = n & 255
  return (r - b) / (r + g + b + 1)
}
check('stage: lit cloth is warmer than its own shadow',
  warmth(pal.curtainClothLit) > warmth(pal.curtainClothDeep),
  `lit ${pal.curtainClothLit} (${warmth(pal.curtainClothLit).toFixed(3)}) must exceed ` +
  `deep ${pal.curtainClothDeep} (${warmth(pal.curtainClothDeep).toFixed(3)})`)

// Mohammad's explicit instruction: dark theme only, PAPER UNCHANGED. The paper
// is the one surface the stage relighting must never touch.
check('stage: the page stock is still warm paper',
  contrast(pal.paper, '#FFFFFF') < 1.2 && contrast(pal.paper, pal.deep) > 12,
  `paper is ${pal.paper} — it must stay warm light stock regardless of stage changes`)

// ── the book's opening choreography ─────────────────────────────────────────
// Measured defect: the closed cover and the open spread sat BOTH fully opaque
// for 900ms, then the cover vanished ~800ms after every other motion finished.
// The cause was retiring the closed book on `opened-done` (a late JS class)
// instead of as part of `body.open`, plus a GSAP placeholder appended after a
// 0.9s call rather than positioned at 0.
const bookCss = await readFile(join(ROOT, 'src/runtime/book.css'), 'utf8')
const bookRuntime = await readFile(join(ROOT, 'src/runtime/book.ts'), 'utf8')
const openClosedRule = bookCss.match(/body\.open\s+\.book-closed\s*\{[^}]*\}/)?.[0] ?? ''
check('book open: the closed cover retires during the opening',
  /opacity:\s*0/.test(openClosedRule),
  'retiring it on opened-done leaves it stacked over the spread until the JS clock fires')
check('book open: opened-done does not own the cover fade',
  !/body\.opened-done\s+\.book-closed\s*\{[^}]*opacity:\s*0/.test(bookCss))
// The JS clock must not outlast the CSS motion, or the deck stalls before it
// hands over (and before resume() fires).
check('book open: the JS clock is positioned at 0, not appended',
  /\.to\(\{\},\s*\{[^}]*\}\s*,\s*0\)/.test(bookRuntime),
  'an appended tween starts after the preceding call and overruns the animation')

// ── closing must be a real reversal, not the absence of a class ─────────────
// Measured before the fix: the cover swept 0° — it never rotated at all — while
// the closed volume faded IN over a still-fully-opaque spread, and the curtain
// began descending at ~700ms with the book still dissolving. Every opening
// transition lives inside a `body.open` rule, so removing that class removes
// the transitions with it and nothing animates back.
check('close: closing has its own state, not just the absence of open',
  /body\.closing\s+\.bc-front\s*\{[^}]*transform/.test(bookCss),
  'without an explicit closing state the cover never swings shut — it cross-fades')
check('close: the cover is driven back to 0deg',
  /body\.closing\s+\.bc-front\s*\{[^}]*rotateY\(0deg\)/.test(bookCss))
// The book must be FULLY shut before the cloth starts down. If this wait is
// shorter than the CSS table the curtain lands on a book still closing.
const closeMs = Number(bookRuntime.match(/const CLOSE_MS = (\d+)/)?.[1] ?? 0)
check('close: the curtain waits for the book to finish',
  closeMs >= 1550,
  `CLOSE_MS is ${closeMs}ms but the closing table in book.css runs to 1550ms`)
check('close: a second Escape cannot desync the order',
  /if \(closing\) return/.test(bookRuntime))

// ── the docs cannot re-advertise a removed feature ──────────────────────────
// The README survived the deck removal fully intact: it documented two output
// formats, a `bun run deck` script and a sample file, none of which still
// existed. Stale docs are worse than no docs for an assistant, which reads them
// as fact and then builds against an API that is gone.
for (const doc of ['SKILL.md', 'README.md']) {
  const text = await readFile(join(ROOT, doc), 'utf8')
  // Mentions are allowed ONLY on a line that says it was removed.
  const offending = text.split('\n').filter((l) =>
    /--format|sample-deck|bun run deck/.test(l) &&
    !/removed|no slide|only output|slide-kit|was left stale/i.test(l))
  check(`docs: ${doc} does not advertise the removed slide format`,
    offending.length === 0,
    `stale lines: ${offending.slice(0, 3).join(' | ')}`)
}
// Every npm script must exist as a file, or the docs point at nothing.
const pkg = JSON.parse(await readFile(join(ROOT, 'package.json'), 'utf8'))
const brokenScripts: string[] = []
for (const [name, cmd] of Object.entries(pkg.scripts as Record<string, string>)) {
  const file = cmd.match(/(?:src|scripts)\/[\w.-]+\.ts/)?.[0]
  if (file && !(await access(join(ROOT, file)).then(() => true, () => false))) {
    brokenScripts.push(`${name} -> ${file}`)
  }
}
check('docs: every package.json script points at a file that exists',
  brokenScripts.length === 0, brokenScripts.join(', '))

// ── presenter remotes, close, and resume ────────────────────────────────────
// A wireless presenter is a USB HID KEYBOARD, not a device needing an API. So
// "clicker compatible" means covering the keys those units actually emit. Most
// Logitech models send PageDown/PageUp rather than the arrows, so shipping only
// arrow support looks fine on a laptop and dies on stage.
for (const k of ['PageDown', 'PageUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End', 'Escape', 'F5']) {
  check(`clicker: "${k}" is handled`, bookRuntime.includes(`'${k}'`))
}
// A focused button swallows Space/Enter and re-fires itself, so a clicker would
// keep pressing whichever control was last clicked.
check('clicker: nav buttons blur after a click',
  /\.blur\(\)/.test(bookRuntime),
  'a focused button hijacks the Space/Enter a presenter remote sends')

// Progress is keyed by title+length, NOT by URL: every file:// document shares
// ONE localStorage origin, so a fixed key makes two workbooks opened from the
// same folder overwrite each other's progress.
check('resume: storage key is derived from the deck identity',
  /MEMORY_KEY/.test(bookRuntime) && /document\.title/.test(bookRuntime))
// Storage can be denied outright (private mode, policy). Throwing on load would
// be far worse than forgetting a bookmark.
check('resume: every storage access is guarded',
  !/[^.]\blocalStorage\.(get|set)Item/.test(
    bookRuntime.replace(/try\s*\{[^}]*\}\s*catch[^}]*\}/g, '')),
  'an unguarded localStorage call throws the whole deck on a locked-down browser')
check('resume: saved on hide, not only on unload',
  /visibilitychange/.test(bookRuntime),
  'unload does not fire reliably on mobile')

// Closing must REVERSE the sequence, and the curtain has to expose a close.
check('close: the curtain can be brought back down',
  /close\(\):\s*Promise<void>/.test(curtainSrc) && /handle\.close\s*=/.test(curtainSrc))
check('close: the show-close control is wired',
  bookHtml.includes('data-action="close"') && /closeShow/.test(bookRuntime))
check('close: blackout layer ships',
  bookHtml.includes('blackout-layer'),
  'presenters expect a b / . key that blanks the screen')

// THE SINGLE-FILE GUARANTEE. The whole point of this format is one file you can
// email. Anything that reaches the network at runtime silently breaks a deck
// opened offline, on a locked-down laptop, or from a USB stick.
const externalRefs = [...bookHtml.matchAll(/(?:src|href)="((?!data:|#)[^"]+)"/g)].map((m) => m[1]!)
check('book: nothing is loaded from outside the file',
  externalRefs.length === 0,
  `these would 404 offline: ${externalRefs.slice(0, 5).join(', ')}`)
check('book: no runtime network calls',
  !/\bfetch\s*\(|XMLHttpRequest|importScripts/.test(bookHtml),
  'a fetch at runtime means the file is not really standalone')

// Dropping the drawn curtain behind the body background would erase the swag
// that is meant to frame the book for the rest of the session.
const curtainCss = await readFile(join(ROOT, 'src/runtime/curtain.css'), 'utf8')
check('curtain: the drawn curtain is not pushed behind the page background',
  !/curtain-done[^}]*z-index:\s*-/.test(curtainCss))

// ── GSAP + build-time SVG ───────────────────────────────────────────────────
check('book: GSAP is bundled in', /gsap/i.test(bookHtml) || bookHtml.includes('_gsap'),
  'the animation engine must ship inside the book, not be fetched')

// The entrance choreography must only ever run against the spread on screen.
// page-flip holds every page in the DOM and hides the off-screen ones with
// display:none, so a reveal that selects `.stf__item .reveal` without checking
// visibility animates the WHOLE BOOK in one timeline on first open — and then
// stamps every page `in`, so no heading, body stagger or diagram ever animates
// again. It fails completely silently: the pages look right, they just arrive
// already finished. Cost a full debugging session to find, twice.
const revealFn = bookRuntime.slice(
  bookRuntime.indexOf('function revealSpread'),
  bookRuntime.indexOf('function revealSpread') + 1800)
check('book: the reveal only animates pages that are actually displayed',
  /closest[^\n]*\.page[\s\S]{0,220}display[\s\S]{0,40}none/.test(revealFn),
  'revealSpread must skip pages page-flip has hidden with display:none')

// The other half of the same bug. page-flip fires `flip` BEFORE it swaps
// `display` on the incoming spread, so a reveal driven from that event inspects
// the OUTGOING pages, finds nothing to do and returns — silently, and only on
// the page-by-page path, which is why jumping via a tab appeared to work.
// `changeState === 'read'` is the turn actually landing.
check('book: the reveal is driven by the settled turn, not the raw flip event',
  /changeState[\s\S]{0,2000}===\s*'read'[\s\S]{0,600}(scheduleReveal|revealSpread)\(\)/.test(bookRuntime),
  "the reveal must be triggered from changeState 'read'")

// THE SPREAD SHAPE IS DEFINED TWICE and must agree. page-flip is told the size
// of ONE page; book.css is told the aspect-ratio of the whole spread. If they
// disagree, page-flip keeps its own proportion inside the box it was given and
// the leftover strip of `.stf__block` — which is painted in the PAPER colour —
// shows above and below every page as cream bands. It looks like a page-design
// bug and has no cause anywhere in the page design, which is exactly why it
// needs a check rather than an eye.
//
// Now stronger than a ratio check. The stage is a FIXED 1560 x 1040 scaled by
// one transform, so page-flip's page size and the CSS are not merely two
// numbers that must share a proportion — they are the same two numbers, and
// each page is literally half the stage. Checking the actual dimensions catches
// a whole class the ratio check could not: 660 x 880 has the correct 1.5 ratio
// and is still the wrong size, which is what made every rem in the ported
// catalogue land about 1.6x oversized against its own paper.
{
  const pf = /new PageFlip\([\s\S]{0,1800}?width:\s*(\d+)[\s\S]{0,1400}?height:\s*(\d+)/.exec(bookRuntime)
  const stage = /\.book-3d\s*\{[\s\S]*?width:\s*(\d+)px;\s*height:\s*(\d+)px/.exec(bookCss)
  const pw = pf ? Number(pf[1]) : NaN, ph = pf ? Number(pf[2]) : NaN
  const sw = stage ? Number(stage[1]) : NaN, sh = stage ? Number(stage[2]) : NaN
  check('book: a page is exactly half the fixed stage',
    pw * 2 === sw && ph === sh,
    `page-flip is set to ${pw}x${ph}, so a spread is ${pw * 2}x${ph}, but the stage is ${sw}x${sh}`)
  check('book: the stage is the design\'s 1560 x 1040',
    sw === 1560 && sh === 1040,
    `book.css declares ${sw}x${sh} — DESIGN.md §1 fixes it at 1560x1040 so every measurement can be absolute`)
  // The closed book's cover is sized to land exactly on the left half of the
  // open spread. If it derives its width from a different formula than the
  // stage, the handoff that makes the opening read as one movement becomes a
  // visible jump at the one moment everything is watching.
  check('book: the closed cover is one page of the same fitted stage',
    /--closed-page-w:\s*calc\(780px\s*\*\s*var\(--fit\)\)/.test(bookCss),
    'the closed book and the open spread must derive their page width from the same number')
  // --fit MUST be written by the runtime. Spelled in CSS it is silently
  // invalid: length-divided-by-number is a length, scale() needs a number, and
  // the declaration is discarded — leaving a 1560px book inside a 1000px window
  // with `overflow: hidden` to hide the evidence.
  check('book: the stage fit is computed in JS, where it can be',
    /--fit['"]?,\s*String\(/.test(bookRuntime) && /window\.addEventListener\('resize', fitStage/.test(bookRuntime),
    'CSS cannot divide a length by a length, so --fit has to come from the runtime and follow resize')
  check('book: every .book-3d transform carries the fit',
    (bookCss.match(/\.book-3d[^{]*\{[^}]*transform:[^;]*;/g) ?? [])
      .filter((r) => !/transform:\s*none\s*!important/.test(r))
      .every((r) => r.includes('var(--fit)')),
    'a transform state without the fit scale snaps the book to its full 1560px the moment it applies')
}

// And even 'read' is a frame early: page-flip has finished its own animation,
// but the incoming pages can still carry the outgoing display value until layout
// and paint complete. The reveal therefore waits two frames before asking which
// pages are visible.
check('book: the reveal waits for the landed spread to paint',
  /requestAnimationFrame\([\s\S]{0,200}requestAnimationFrame\(/.test(bookRuntime),
  'scheduleReveal must double-rAF so the visibility filter sees the new spread')

// Build-time tooling must never reach the reader.
for (const dep of ['linkedom', 'svgdotjs', 'markdown-it', 'parseHTML']) {
  check(`book: build-time dep "${dep}" does NOT ship`, !bookHtml.includes(dep))
}

// The reference check is the guard against the solid-black-page bug. Prove it
// still fires, and still does not false-positive.
const { assertReferencesResolve } = await import(join(ROOT, 'src/svg.ts'))
let caught = false
try { assertReferencesResolve('<svg><filter id="a"/><rect filter="url(#MISSING)"/></svg>', 't') }
catch { caught = true }
check('svg: a dangling url(#id) is rejected', caught,
  'well-formed XML with a broken reference paints solid black — XML validation alone misses it')
let falsePositive = false
try { assertReferencesResolve('<svg><filter id="a"/><rect filter="url(#a)"/></svg>', 't') }
catch { falsePositive = true }
check('svg: a valid reference passes', !falsePositive)

// The grain must be a real, resolvable filter in the shipped file.
const grainMatch = bookHtml.match(/--grain:url\("data:image\/svg\+xml,([^"]+)"\)/)
const grainDecoded = grainMatch ? decodeURIComponent(grainMatch[1]) : ''
check('book: shipped grain filter resolves',
  /id="grain"/.test(grainDecoded) && /url\(#grain\)/.test(grainDecoded),
  'this is the exact bug that turned every page black')

// ── the book declares its own structure ──────────────────────────────────────
//
// design/DESIGN.md §16.1 and §16.2. These are the reference audit's checks 4
// and 5, and the reason they are mechanical is that the rules they enforce were
// each written down in prose first and then silently violated: a page with no
// layout tag is invisible until something tries to query it, and copy with no
// role is copy nobody will find when the placeholder text has to be replaced.
{
  const { parseHTML } = await import('linkedom')
  const { LAYOUTS, SLOT_ROLES } = await import(join(ROOT, 'src/layout.ts'))
  const { document } = parseHTML(bookHtml)
  const pages = [...document.querySelectorAll('.page')] as Element[]

  for (const attr of ['data-layout', 'data-stock', 'data-screen-label']) {
    const without = pages.filter((p) => !p.getAttribute(attr))
    check(`structure: every one of the ${pages.length} pages declares ${attr}`,
      without.length === 0,
      without.map((p) => p.getAttribute('class')).join(' | '))
  }

  // A typo in a layout name is not a different layout, it is no layout — the
  // stylesheet has no rule for it and the page renders as bare prose.
  const badLayout = pages.map((p) => p.getAttribute('data-layout')!)
    .filter((l) => !LAYOUTS.includes(l as never))
  check('structure: every layout is one from the catalogue',
    badLayout.length === 0,
    `${[...new Set(badLayout)].join(' ')} — add it to LAYOUTS and the stylesheet together, or it silently renders as prose`)

  // Hard stock is the covers and the section boards, and nothing else. The flip
  // engine draws the two with different routines, so getting this wrong makes an
  // ordinary page refuse to bend or a board crease down the middle.
  const wrongStock = pages.filter((p) => {
    const hard = p.getAttribute('data-stock') === 'hard'
    const isBoard = /\b(cover|divider)\b/.test(p.getAttribute('class') ?? '')
    return hard !== isBoard
  })
  check('structure: hard stock is exactly the covers and the section boards',
    wrongStock.length === 0,
    wrongStock.map((p) => `${p.getAttribute('class')} = ${p.getAttribute('data-stock')}`).join(' | '))

  // THE ENGINE READS A DIFFERENT NAME THAN THE DESIGN SPECIFIES.
  //
  // `data-stock` is the design's contract and what the audit queries;
  // `data-density` is what page-flip itself reads — `density === "hard" ?
  // "hard" : "soft"`, inside the bundled engine. Emitting only the design's
  // name made every page soft and NOTHING failed: the book built, every check
  // passed, and the covers and section boards quietly started bending like
  // paper. It also re-armed a fixed bug, because the glued fore-edge tab
  // survives only under `drawHard`'s `clip-path: none` and a soft page's bend
  // clip cuts it off mid-turn. Two names for one fact, asserted equal.
  const stockMismatch = pages.filter((p) =>
    p.getAttribute('data-stock') !== p.getAttribute('data-density'))
  check('structure: data-stock and data-density agree on every page',
    stockMismatch.length === 0,
    stockMismatch.map((p) => `${p.getAttribute('data-screen-label')}: stock=${p.getAttribute('data-stock')} density=${p.getAttribute('data-density')}`).join(' | '))
  check('structure: the engine is actually told which pages are hard',
    pages.some((p) => p.getAttribute('data-density') === 'hard'),
    'no page carries data-density="hard", so page-flip renders every one with drawSoft — boards bend and glued tabs get clipped away')

  // A STICKY MUST SURVIVE RE-PARSING, not merely be built correctly.
  //
  // `p.appendChild(div)` is accepted by linkedom and serialised verbatim, but
  // HTML's own parsing rules close an open <p> at the first block-level child —
  // so the browser ejects the note to become the paragraph's SIBLING, stripping
  // the positioning context that makes it a note stuck onto something rather
  // than a designed panel. Nothing fails; only the browser disagrees. This
  // check reads the SHIPPED markup through a parser, which is the only parse
  // that counts.
  const notes = [...document.querySelectorAll('.sticky')] as Element[]
  const detached = notes.filter((s) =>
    !s.classList.contains('sticky-alone') && !s.parentElement?.classList.contains('has-sticky'))
  check(`structure: all ${notes.length} sticky notes are still attached after parsing`,
    detached.length === 0,
    'a note appended to a <p> is ejected by the HTML parser and loses its host — wrap the host instead')

  // ── the reference audit's remaining checks ──────────────────────────────
  // design/reference/audit.reference.js, ported. Each one is a bug that
  // actually happened during the design, which is why they are mechanical:
  // "a rule in prose gets forgotten; a rule that fails out loud does not."

  // 1 — LEAF SIDES. A face wearing `pr` on the back of a leaf renders as a
  // right-hand page while sitting on the left: its gutter shadow, its
  // asymmetric margins and its folio corner all mirror against the spread.
  // Front faces are pr, back faces are pl, with cr/cl on the covers.
  const sided = pages.filter((p) => /\b(pl|pr|cl|cr)\b/.test(p.getAttribute('class') ?? ''))
  const wrongSide = sided.filter((p, i) => {
    const cls = p.getAttribute('class') ?? ''
    const wantsRight = i % 2 === 1
    const isRight = /\b(pr|cr)\b/.test(cls)
    return isRight !== wantsRight
  })
  check(`structure: all ${sided.length} faces carry the side they sit on`,
    wrongSide.length === 0,
    wrongSide.map((p) => p.getAttribute('data-screen-label')).join(' | '))

  // 2 and 3 — FOLIOS AND THE CONTENTS PAGE.
  //
  // THE FOLIOS DO NOT EXIST IN THIS FILE. The runtime writes them in one pass
  // once the book loads, so a check that counts `.pageno` elements here finds
  // none — and "no duplicates among zero folios" PASSES. The first version of
  // this did exactly that and reported a clean book while proving nothing,
  // which is the failure mode these checks exist to prevent.
  //
  // So this recomputes the numbering the runtime will apply, from the same rule
  // — printed pages only, counted from 2, with covers, boards and the colophon
  // skipped — and checks the CONTENTS PAGE against it. That is the recorded bug
  // (a contents citing 3,5,7,9,11,13 where the sections began on 2,4,6,8,10,12)
  // and it is genuinely catchable here, because both the contents and the
  // numbering are derived at build time from the same page list.
  //
  // The run itself being consecutive was verified in a browser: folios 2 to 25,
  // 24 of them, no duplicates and no breaks.
  const willPrintFolio = (p: Element) =>
    !/\b(cover|divider|colophon|contents)\b/.test(p.getAttribute('class') ?? '')
  const folioOf = new Map<number, number>()
  {
    let n = 1
    pages.forEach((p, i) => { if (willPrintFolio(p)) folioOf.set(i, ++n) })
  }
  const rows = [...document.querySelectorAll('.contents-row')] as Element[]
  if (rows.length > 0) {
    const claimed = rows.map((r) =>
      Number(r.querySelector('[data-slot="contents-folio"]')?.textContent?.trim()))
    const real: number[] = []
    pages.forEach((p, i) => {
      if (!p.querySelector('[data-slot="board-title"]')) return
      for (let j = i + 1; j < pages.length; j++) {
        const f = folioOf.get(j)
        if (f !== undefined) { real.push(f); return }
      }
    })
    const wrong = claimed
      .map((c, i) => (c === real[i] ? null : `entry ${i + 1} says ${c}, section starts at ${real[i]}`))
      .filter(Boolean)
    check(`structure: all ${rows.length} contents entries point where the section starts`,
      wrong.length === 0 && real.length === rows.length,
      wrong.length ? wrong.join(' | ') : `${rows.length} entries but ${real.length} sections found`)
  }

  // 9 — A FULL BLEED IS NOT A REVEAL STEP. A picture crossing the gutter that
  // arrives one half at a time reads as broken rather than as pacing, so the
  // picture is present when the spread lands and only the caption is a beat.
  const bleedSteps = [...document.querySelectorAll('.page.full-bleed .bleed-out')]
    .filter((b: Element) => /\bstep\b|\breveal-item\b/.test(b.getAttribute('class') ?? '') ||
      b.getAttribute('style')?.includes('opacity'))
  check('structure: neither half of a full bleed is a reveal step',
    bleedSteps.length === 0,
    'the picture must be there when the spread lands — half a photograph arriving first reads as broken')

  const badRole = [...document.querySelectorAll('[data-slot]')]
    .map((e: Element) => e.getAttribute('data-slot')!)
    .filter((r) => !SLOT_ROLES.has(r))
  check('structure: every slot uses a role from the catalogue',
    badRole.length === 0,
    `${[...new Set(badRole)].join(' ')} — do not invent role names; add to the catalogue and this check together`)

  // LOOSE TEXT: copy sitting on a page with no role attached to it. Everything
  // inside the reference book is addressable as [data-slot="..."], which is what
  // turns replacing placeholder copy into a query rather than a reading job.
  //
  // Scoped to the pages AND the curtain and closed book, because those carry
  // copy the reader meets before any page — the title, the standfirst, the
  // spine — and scoping this to `.page` alone let all nine of those strings sit
  // untagged while the check reported a clean book.
  const loose: string[] = []
  const copyRoots = [...pages,
    ...document.querySelectorAll('.curtain, .closed-stage')] as Element[]
  for (const page of copyRoots) {
    for (const el of [...page.querySelectorAll('*')] as Element[]) {
      if (el.closest('[data-slot]') || el.closest('svg')) continue
      const own = [...(el.childNodes as unknown as Iterable<Node>)]
        .filter((n) => n.nodeType === 3).map((n) => n.textContent ?? '').join('').trim()
      if (own.length > 1) loose.push(`${el.tagName.toLowerCase()}.${el.getAttribute('class') ?? ''}: ${own.slice(0, 40)}`)
    }
  }
  check('structure: no copy is left without a role',
    loose.length === 0, [...new Set(loose)].slice(0, 8).join('\n        '))
}

// ── the band cannot clip a heading ───────────────────────────────────────────
//
// A static guard, and deliberately so: proving this properly needs a real
// browser, and this skill installs with three pure-Python-equivalent deps and
// no Playwright — adding a browser to the check suite would cost every user the
// install to catch one class of bug. So the geometry was verified by hand in a
// browser (band 79px = 12% of a 659px page, heading inside it, and a wrapped
// two-line heading no longer overflowing the top) and this locks the shape in.
//
// The bug: `.band` fills downward from `justify-content: flex-end`, so a fixed
// height sends a second line off the TOP of the band rather than the bottom,
// and the first line loses its cap heights. It looks like a crop, not a bug.
{
  const layouts = await readFile(join(ROOT, 'src/runtime/layouts.css'), 'utf8')
  const rule = /\.band\s*\{([^}]*)\}/.exec(layouts)?.[1] ?? ''
  check('band: its height is a floor, not a fixed size',
    /min-height:\s*12%/.test(rule) && /height:\s*auto/.test(rule),
    'a fixed height on .band clips any heading that wraps to two lines')
  check('band: it does not shrink below its content',
    /flex-shrink:\s*0/.test(rule),
    'as a flex child of .half it collapses past its own text — measured at 24px where 12% is 79px')
}

// ── design parity ────────────────────────────────────────────────────────────
//
// `design/reference/theme.reference.css` is the design's own shipped palette,
// vendored unchanged. This check proves the generated tokens still ARE it.
//
// Without it, parity is a claim someone made once. Any of the ordinary reasons a
// value drifts — a derivation tweaked, a pin dropped in a rebase, a rename —
// changes the book's colour, spacing or timing while every other check keeps
// passing, because nothing else in this suite knows what the design decided.
{
  const { buildPalette, loadTheme, themeCss, bookCss, scaleCss } =
    await import(join(ROOT, 'src/theme.ts'))
  const theme = await loadTheme(join(ROOT, 'theme.json'))
  const palette = buildPalette(theme)
  const generated = [
    themeCss(palette, theme.fonts), scaleCss(theme), bookCss(palette, theme.fonts, ''),
  ].join('\n')
  const reference = await readFile(join(ROOT, 'design/reference/theme.reference.css'), 'utf8')

  // PLAIN `:root` only, both sides. The light theme sits behind
  // [data-theme="light"] and the alternate palettes behind [data-pairing]; fold
  // either in and you compare a colour against a different colour scheme, then
  // report a difference that is not one. That artefact cost a debugging pass.
  const plainRoots = (s: string) =>
    [...s.matchAll(/(^|\})\s*:root\s*\{([\s\S]*?)\n\}/gm)].map((m) => m[2]).join('\n')
  // LAST declaration wins, as the browser resolves it — `--font-body` is set to
  // the UI face by themeCss and legitimately overridden to the reading face by
  // bookCss, so taking the first would flag a correct cascade as a mismatch.
  const grab = (s: string) => {
    const out: Record<string, string> = {}
    for (const m of s.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) out[m[1]!] = m[2]!.split('/*')[0]!.trim()
    return out
  }
  const norm = (v: string) => v.toLowerCase().replace(/\s+/g, '').replace(/["']/g, '')

  const want = grab(plainRoots(reference))
  const got = grab(plainRoots(generated))
  /**
   * DELIBERATE DIVERGENCES FROM THE REFERENCE, each with its reason.
   *
   * The reference stylesheet is the design authority and stays untouched, so a
   * change we make on purpose has to be declared here rather than by quietly
   * editing the thing we are checking against. A divergence with no entry is
   * still a failure — which is the point.
   */
  const ALLOWED: Record<string, string> = {
    // The reference was written on a Mac. Bradley Hand does not exist on
    // Windows or Linux, so the hand-set type fell straight through to generic
    // `cursive` — Comic Sans on most Windows machines, which is not a fallback
    // so much as a punchline. Same for Arial Narrow, absent on many Linux
    // installs. Extra names only; the reference's own order is preserved, so a
    // machine that HAS the reference fonts renders exactly as designed.
    '--font-display': 'cross-platform fallbacks added after Arial Narrow',
    '--font-hand': 'cross-platform fallbacks added after Caveat',
  }
  const drifted: string[] = []
  const missing: string[] = []
  const allowed: string[] = []
  for (const [k, v] of Object.entries(want)) {
    if (!(k in got)) { missing.push(k); continue }
    if (norm(got[k]!) === norm(v)) continue
    // A declared divergence must still contain EVERY family the reference
    // names, in the reference's own order — a subsequence test, not a substring
    // one, because the whole point is inserting new names BETWEEN the old ones.
    // This is what stops "extension" being a cover story for a replacement: drop
    // or reorder any reference face and it fails like any other drift.
    const subsequence = (needle: string[], hay: string[]) => {
      let i = 0
      for (const h of hay) if (i < needle.length && h === needle[i]) i++
      return i === needle.length
    }
    const families = (s: string) => norm(s).split(',').filter(Boolean)
    const isExtension = Boolean(ALLOWED[k]) && subsequence(families(v), families(got[k]!))
    if (isExtension) allowed.push(`${k} — ${ALLOWED[k]}`)
    else drifted.push(`${k}: want ${v}, got ${got[k]}`)
  }
  check(`design: ${allowed.length} declared divergence(s) still extend the reference`,
    allowed.length === Object.keys(ALLOWED).length,
    `declared in ALLOWED but not actually an extension of the reference stack: ` +
    Object.keys(ALLOWED).filter((k) => !allowed.some((a) => a.startsWith(k))).join(', '))
  check(`design: all ${Object.keys(want).length} reference tokens are generated`,
    missing.length === 0, missing.join(' '))
  check('design: no generated token has drifted from the reference',
    drifted.length === 0, drifted.join('\n        '))

  // The reference bundle ships with `--cast-l` / `--cast-r` used by its
  // turn-shadow rules and declared nowhere, so those rules paint nothing at all
  // and it fails its own audit. An undeclared name voids the WHOLE declaration
  // it appears in, silently — so check ours, rather than trusting that we did
  // not inherit the habit along with the stylesheet.
  const declared = new Set(Object.keys(grab(generated)))
  // Custom properties the RUNTIME sets, so the theme is not expected to declare
  // them. `--book-w` is how wide the book actually is and `--swag-w` how wide
  // the curtain's settled print must be laid out — both are geometry, computed
  // from a measurement, and neither is a colour anyone can rebrand.
  //
  // Trimmed to what is genuinely written: `--curl`, `--spec` and `--fan` were
  // exempted here while appearing nowhere in the source at all, and `--i` and
  // `--v` are read with fallbacks rather than written (see below).
  const runtimeWritten = new Set(['--swl', '--swr', '--stack-bias', '--book-progress',
    '--book-w', '--swag-w'])
  const css = await readFile(join(ROOT, 'src/runtime/book.css'), 'utf8') +
    await readFile(join(ROOT, 'src/runtime/curtain.css'), 'utf8')
  // A `var(--x, fallback)` cannot void its declaration — that is what the
  // fallback is for — so only a BARE reference is dangerous. Distinguishing the
  // two is what lets the allowlist above shrink to names something really does
  // set, instead of absorbing every name the theme happens not to declare.
  const bare = new Set([...css.matchAll(/var\(\s*(--[\w-]+)\s*\)/g)].map((m) => m[1]!))
  const undeclared = [...bare]
    .filter((t) => !declared.has(t) && !runtimeWritten.has(t) &&
      !new RegExp(`${t}\\s*:`).test(css))
  check('design: no stylesheet references an undeclared token',
    undeclared.length === 0,
    `${undeclared.join(' ')} — an undeclared name voids its whole declaration and the element paints NOTHING`)

  // The RUNTIME reads tokens too, and CSS-side checking cannot see those: the
  // curtain shader pulls its four cloth colours through getPropertyValue. Those
  // reads used to carry hard-coded hex fallbacks from an older palette — an
  // amber rim among them, on a scheme whose own notes call warm metal the one
  // thing that breaks it. The fallbacks are gone; this is what replaces them.
  const runtimeTs = await readFile(join(ROOT, 'src/runtime/curtain.ts'), 'utf8') +
    await readFile(join(ROOT, 'src/runtime/book.ts'), 'utf8')
  const readByJs = [...new Set(
    [...runtimeTs.matchAll(/getPropertyValue\(\s*['"](--[\w-]+)['"]/g)].map((m) => m[1]!)
      .concat([...runtimeTs.matchAll(/\btoken\(\s*['"](--[\w-]+)['"]/g)].map((m) => m[1]!)),
  )]
  const notEmitted = readByJs.filter((t) => !declared.has(t) && !runtimeWritten.has(t))
  check(`design: all ${readByJs.length} tokens the runtime reads are emitted by the theme`,
    notEmitted.length === 0,
    `${notEmitted.join(' ')} — the runtime would paint its missing-token magenta instead`)

  // And no stale palette may hide in a fallback anywhere on the runtime path.
  // A colour literal in the runtime is a second palette that no rebrand reaches.
  const strayHex = [...runtimeTs.matchAll(/['"](#[0-9A-Fa-f]{6})['"]/g)].map((m) => m[1]!)
    .filter((h) => h.toUpperCase() !== '#FF00FF')  // the deliberate missing-token flag
  // AND THE ALLOWLIST HAS TO EARN ITSELF. Its entries are exempt from the
  // theme's declaration rule, so a name that lands in it by mistake — a typo, or
  // a property whose writer was deleted — becomes a var() that resolves to
  // nothing and silently voids the declaration it sits in. That is the same
  // failure the check above exists to catch, smuggled past it by the escape
  // hatch. Every exemption must therefore be a property the runtime really does
  // write.
  const notWritten = [...runtimeWritten].filter(
    (t) => !new RegExp(`setProperty\\(\\s*'${t}'`).test(runtimeTs) &&
           !new RegExp(`${t}\\s*:`).test(runtimeTs))
  check(`design: all ${runtimeWritten.size} runtime-written properties are actually written`,
    notWritten.length === 0,
    `${notWritten.join(' ')} — exempted from the theme but nothing sets them, so they resolve to nothing`)

  check('design: the runtime holds no colour literals',
    strayHex.length === 0,
    `${[...new Set(strayHex)].join(' ')} — every colour comes from the theme, or a rebrand silently misses it`)
}

console.log(`\n  ${passed} passed, ${failed} failed\n`)
await rm(TMP, { recursive: true, force: true })
process.exit(failed === 0 ? 0 : 1)
