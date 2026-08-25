/**
 * build_studio.ts — write the Ink Studio out as one self-contained HTML file.
 *
 *   node scripts/build_studio.ts                       theme.json  -> output/ink-studio.html
 *   node scripts/build_studio.ts themes/slate.json     that theme  -> output/ink-studio.html
 *   node scripts/build_studio.ts theme.json studio.html
 *
 * WHY GENERATED RATHER THAN SHIPPED AS A STATIC PAGE. The studio previews the
 * drawing on the book's real paper in the book's real ink, and those two values
 * are not written down anywhere — they are DERIVED, by `buildPalette`, from the
 * one or two colours a theme actually declares. A hand-written page would have
 * to restate that derivation, and a restated derivation is a copy waiting to
 * drift from the original. Importing `buildPalette` means the studio's ink is
 * the book's ink by construction, and a rebrand carries it across for free.
 *
 * The output is one file with no external anything, for the same reason a book
 * is: it has to survive being emailed to somebody.
 */

import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { buildPalette, loadTheme } from '../src/theme.ts'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const exit = (msg: string): never => {
  console.error(`build_studio: ${msg}`)
  process.exit(1)
}

const SCRIPT_CLOSE = '</scr' + 'ipt>'
/** Same trap as the book build: an inlined bundle must not close its own tag. */
const escapeForScriptTag = (js: string) => js.replaceAll(SCRIPT_CLOSE, '<\\/script>')

async function studioBundle(): Promise<string> {
  const shelf = join(ROOT, 'assets', 'studio.bundle.js')
  try {
    return await readFile(shelf, 'utf8')
  } catch {
    return exit(
      `the studio bundle is missing.\n` +
      `  expected: ${shelf}\n` +
      `  fix:      run "node scripts/prebundle.ts" and commit the result.`,
    )
  }
}

function page(js: string, theme: { ink: string; paper: string; paper2: string; name: string }): string {
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Ink Studio — ${theme.name}</title>
<style>
:root {
  --paper: ${theme.paper};
  --paper-2: ${theme.paper2};
  --ink: ${theme.ink};
  --shell: #14202a;
  --shell-2: #1b2c38;
  --edge: #2b4150;
  --on-shell: #e8eef2;
  --on-shell-dim: #9db0bd;
}
* { box-sizing: border-box; }
body {
  margin: 0; min-height: 100vh; background: var(--shell); color: var(--on-shell);
  font: 15px/1.6 system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  padding: 26px clamp(16px, 4vw, 44px) 60px;
}
h1 { font-size: 20px; font-weight: 600; margin: 0 0 2px; letter-spacing: -.01em; }
.lede { color: var(--on-shell-dim); margin: 0 0 22px; max-width: 62ch; font-size: 14px; }
.lede code { background: var(--shell-2); padding: 1px 5px; border-radius: 3px; font-size: 12.5px; }
.layout { display: grid; grid-template-columns: 300px minmax(0, 1fr); gap: 26px; align-items: start; }
@media (max-width: 860px) { .layout { grid-template-columns: 1fr; } }

.panel { background: var(--shell-2); border: 1px solid var(--edge); border-radius: 10px; padding: 16px 18px; }
.panel + .panel { margin-top: 14px; }
.panel h2 { font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase;
            color: var(--on-shell-dim); margin: 0 0 12px; }

#drop { border: 1.5px dashed var(--edge); border-radius: 10px; padding: 26px 18px; text-align: center;
        cursor: pointer; transition: border-color .15s, background .15s; background: transparent; }
#drop:hover, #drop.over, #drop:focus-visible { border-color: var(--paper); background: rgba(255,255,255,.04); outline: none; }
#drop strong { display: block; font-size: 14px; margin-bottom: 3px; }
#drop span { font-size: 12.5px; color: var(--on-shell-dim); }
#drop.loaded { padding: 14px; }
#file { display: none; }

.control { margin-bottom: 15px; }
.control:last-child { margin-bottom: 0; }
.control label { display: flex; justify-content: space-between; align-items: baseline;
                 font-size: 13px; margin-bottom: 5px; }
.control .name { font-weight: 500; }
.control output { font-variant-numeric: tabular-nums; color: var(--on-shell-dim); font-size: 12.5px; }
.control .hint { display: block; font-size: 11.5px; color: var(--on-shell-dim); margin-top: 4px; line-height: 1.45; }
input[type=range] { width: 100%; accent-color: var(--paper); }
select { width: 100%; background: var(--shell); color: var(--on-shell); font: inherit; font-size: 13px;
         border: 1px solid var(--edge); border-radius: 7px; padding: 7px 9px; }

.presets { display: flex; gap: 7px; flex-wrap: wrap; }
.presets button { flex: 1 1 auto; background: transparent; color: var(--on-shell); font: inherit; font-size: 13px;
                  border: 1px solid var(--edge); border-radius: 7px; padding: 7px 10px; cursor: pointer; }
.presets button:hover { background: rgba(255,255,255,.05); }
.presets button[aria-current] { border-color: var(--paper); background: rgba(255,255,255,.09); }

#export { width: 100%; margin-top: 4px; background: var(--paper); color: var(--ink); font: inherit; font-weight: 600;
          border: 0; border-radius: 8px; padding: 11px; cursor: pointer; }
#export:disabled { opacity: .4; cursor: not-allowed; }
.check { display: flex; align-items: center; gap: 9px; font-size: 13px; margin-top: 12px; }

/* THE SHEET IS THE POINT. The drawing is previewed on the book's real paper,
   with the book's real grain over it, because a picture judged against a white
   browser background is judged against something no reader will ever see. */
.sheet { position: relative; background: var(--paper); border-radius: 4px; padding: 30px;
         box-shadow: 0 1px 2px rgba(0,0,0,.35), 0 24px 60px -26px rgba(0,0,0,.75); }
body.on-dark .sheet { background: #16242e; }
.sheet::after {
  content: ''; position: absolute; inset: 0; border-radius: 4px; pointer-events: none;
  opacity: .5; mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23g)' opacity='.055'/%3E%3C/svg%3E");
}
body.on-dark .sheet::after { mix-blend-mode: screen; opacity: .28; }
#preview { display: block; width: 100%; height: auto; border-radius: 2px; }
#status { font-size: 12.5px; color: var(--on-shell-dim); margin-top: 12px; min-height: 1.5em; }
[hidden] { display: none !important; }
</style>
</head><body>

<h1>Ink Studio</h1>
<p class="lede">Turn a supplied picture into something that looks <em>drawn on the page</em>. The
preview sits on this book's real paper, in its real ink — theme <code id="theme-name"></code>.
Export saves a transparent PNG: it carries only the ink, so the page's own paper and grain read
through it. Drop the result into a lesson like any other picture.</p>

<div class="layout">
  <div>
    <div class="panel">
      <h2>Artwork</h2>
      <div id="drop" tabindex="0" role="button" aria-label="Choose a picture">
        <strong>Drop a picture</strong>
        <span>or click to choose · paste also works</span>
      </div>
      <input type="file" id="file" accept="image/*">
    </div>

    <div class="panel">
      <h2>Starting points</h2>
      <div class="presets">
        <button type="button" data-preset="soft">Soft</button>
        <button type="button" data-preset="drawn" aria-current="true">Drawn</button>
        <button type="button" data-preset="engraved">Engraved</button>
      </div>
    </div>

    <div class="panel">
      <h2>The hand</h2>
      <div class="control">
        <label for="line"><span class="name">Line</span><output id="line-val"></output></label>
        <input type="range" id="line" min="0" max="3" step="0.05" value="0.9">
        <span class="hint">How much pen. Nothing is a pure wash; a lot is an engraving.</span>
      </div>
      <div class="control">
        <label for="tone"><span class="name">Tone</span><output id="tone-val"></output></label>
        <input type="range" id="tone" min="0" max="1" step="0.02" value="0.46">
        <span class="hint">How much pigment the wash lays down. The rest is bare paper.</span>
      </div>
      <div class="control">
        <label for="nib"><span class="name">Nib</span><output id="nib-val"></output></label>
        <input type="range" id="nib" min="0.5" max="6" step="0.1" value="1.3">
        <span class="hint">The width of the pen. Broad loses detail on purpose.</span>
      </div>
      <label class="check"><input type="checkbox" id="ground"> Check it on a dark page</label>
    </div>

    <div class="panel">
      <h2>Export</h2>
      <div class="control">
        <label for="format"><span class="name">Format</span></label>
        <select id="format"></select>
        <span class="hint">Measured on the same drawing: PNG 1,838&nbsp;KB, WebP 592&nbsp;KB.
        Both carry transparency. Keep PNG for print.</span>
      </div>
      <div class="control">
        <label for="size"><span class="name">Size</span></label>
        <select id="size"></select>
        <span class="hint">A page is 780&nbsp;px wide, so 1200 is already more than a screen
        resolves. Pictures are packed inside the book, so this is the one number that decides
        whether it stays a file you can send.</span>
      </div>
      <button type="button" id="export" disabled>Save transparent PNG</button>
      <div id="status">Drop a picture to begin.</div>
    </div>
  </div>

  <div id="stage" hidden>
    <div class="sheet"><canvas id="preview"></canvas></div>
  </div>
</div>

<!-- THE THEME REACHES THE SCRIPT AS DATA, NOT AS A REBUILD.
     The bundle is compiled once and shared by every theme; baking colours into
     it would mean a bundle per brand. This one line is the whole difference
     between books, which is also why a rebrand costs nothing here. -->
<script>window.__INK_THEME__ = ${JSON.stringify(theme)};</scr` + `ipt>
<script type="module">
${escapeForScriptTag(js)}
</scr` + `ipt>
</body></html>
`
}

async function main(): Promise<void> {
  const [themeArg, outArg] = process.argv.slice(2)
  const themePath = resolve(ROOT, themeArg ?? 'theme.json')
  const outPath = resolve(ROOT, outArg ?? 'output/ink-studio.html')

  const theme = await loadTheme(themePath).catch(() => exit(`could not read the theme at ${themePath}`))
  const p = buildPalette(theme)
  const js = await studioBundle()

  const html = page(js, {
    ink: p.ink!,
    paper: p.paper!,
    paper2: p.paper2!,
    // Named so an author can see at a glance WHICH book's ink they are drawing
    // in — the studio is worth nothing if it is quietly previewing the default
    // theme while the book ships another.
    name: themeArg ?? 'theme.json',
  })

  await mkdir(dirname(outPath), { recursive: true })
  await writeFile(outPath, html, 'utf8')

  const kb = (Buffer.byteLength(html) / 1024).toFixed(0)
  console.log(`  Ink Studio  ·  ${outPath}`)
  console.log(`  ${kb} KB, one file, no install  ·  ink ${p.ink} on paper ${p.paper}`)
  console.log(`  Open it, drop artwork in, export a transparent PNG.`)
}

await main()
