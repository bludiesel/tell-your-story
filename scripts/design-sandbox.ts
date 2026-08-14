#!/usr/bin/env node
/**
 * design-sandbox.ts — emit ONE buildless HTML file for working on the LOOK.
 *
 * WHY THIS EXISTS
 * The design of this book cannot survive being copied somewhere else by hand,
 * and the reason is measurable rather than a matter of taste:
 *
 *   · 63 of the 228 selectors in book.css (28%) only match once JavaScript has
 *     run. `body.open`, `.js-anim .reveal.in`, and page-flip's own
 *     `.stf__item --soft --left` are all added at runtime. Paste the stylesheet
 *     somewhere static and more than a quarter of it silently does nothing.
 *   · 39 of the 42 custom properties it consumes are GENERATED — computed from
 *     theme.json by theme.ts, including WCAG contrast correction. An undefined
 *     custom property inside rgba() invalidates the entire declaration,
 *     silently. That exact fault once erased the page curvature and went
 *     unnoticed for weeks.
 *   · 7 more (--swl, --swr, --stack-bias, --bw, --bh, --bt, --closed-page-w)
 *     are written onto the element by the runtime, frame by frame.
 *
 * So a hand-made copy is not a smaller version of the design — it is a
 * different one, and it disagrees with the real book in ways that look like
 * design problems and are not.
 *
 * WHAT THIS DOES INSTEAD
 * It builds a real book through the real pipeline, then FREEZES it: strips every
 * script, bakes in the classes the runtime would have added, and pins the
 * variables the runtime would have written. What comes out is the genuine
 * article with the machinery removed — same stylesheet, same markup, same
 * generated tokens, no build step, no JavaScript, nothing fetched from anywhere.
 *
 * Safe to open in a browser, an artifact, or any chat that renders HTML.
 *
 *   node scripts/design-sandbox.ts               with the embedded fonts — what it really looks like
 *   node scripts/design-sandbox.ts --no-fonts    fallback type, far smaller, for pasting into a chat
 *
 * ROUND TRIP: only book.css is a source of truth here, and it is fenced with
 * BEGIN/END markers. Take what is between them, put it back in
 * src/runtime/book.css, rebuild. Everything else in the file is generated and
 * editing it achieves nothing.
 */

// node:child_process, not Bun's `$` helper. This script has no business being
// the one thing in the kit that decides which runtime you must have installed.
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const ROOT = join(here, '..')
const SOURCE = join(ROOT, 'design', 'states.md')
const TMP = join(ROOT, 'output', '_design-src.html')
const OUT = join(ROOT, 'output', 'design-sandbox.html')
const noFonts = process.argv.includes('--no-fonts')

/**
 * Layout the runtime would otherwise supply, and NOTHING ELSE.
 *
 * page-flip's own stylesheet ships inside the bundle and sets
 * `.stf__item { display: none; position: absolute }` — it shows one spread at a
 * time by hiding the rest. A static file needs every page visible and stacked,
 * so this undoes exactly that and pins the seven variables the runtime writes.
 *
 * Kept separate and last on purpose: it is scaffolding for the sandbox, not
 * part of the design. Nothing here should ever be copied back into book.css.
 */
const SANDBOX_CSS = `
/* ===================== SANDBOX SCAFFOLDING — NOT THE DESIGN ================ */
html, body { overflow: auto !important; height: auto !important; }
.curtain, .closed-stage, .chrome { display: none !important; }
.wrap { position: static !important; display: block !important; inset: auto !important; }
.book-3d {
  opacity: 1 !important; transform: none !important; pointer-events: auto !important;
  width: min(1180px, 96vw) !important; aspect-ratio: auto !important;
  margin: 0 auto 3.5rem !important; height: auto !important;
}
#book { height: auto !important; }
/* every page visible, laid out as spreads */
.stf__item {
  display: block !important; position: relative !important;
  width: 50% !important; height: auto !important; aspect-ratio: .75;
  float: left; transform: none !important;
}
#book::after { content: ""; display: block; clear: both; }
/* page-flip's moving shadows have no meaning in a still */
.stf__outerShadow, .stf__innerShadow, .stf__hardShadow, .stf__hardInnerShadow { display: none !important; }
/* the seven variables the runtime writes each frame, pinned to mid-book values */
.book-3d { --swl: 14px; --swr: 12px; --book-progress: .5; --stack-bias: 0px; }
:root { --bw: 420px; --bh: 560px; --bt: 44px; --closed-page-w: 420px; }
/* a label above each spread so a state can be named in feedback */
.sbx-label {
  clear: both; padding: 2.4rem 0 .6rem; font-family: var(--font-display);
  text-transform: uppercase; letter-spacing: .14em; font-size: .78rem;
  color: var(--accent); opacity: .85;
}
.sbx-note {
  max-width: 62ch; margin: 0 auto 2rem; padding: 1rem 1.25rem;
  border-left: 3px solid var(--accent); background: var(--panel);
  font-size: .92rem; line-height: 1.6; color: var(--ink-on-dark-muted);
}
.sbx-note strong { color: var(--ink-on-dark); }
/* ===================== END SANDBOX SCAFFOLDING ============================= */
`

await mkdir(join(ROOT, 'output'), { recursive: true })
// `process.execPath` — whichever runtime is running this script builds the book
// too, so the sandbox is generated by exactly the toolchain you already have
// rather than by whichever one this file happened to name.
await promisify(execFile)(process.execPath, [
  join(ROOT, 'src/build.ts'), SOURCE, TMP, '--quiet',
])

let html = await readFile(TMP, 'utf8')

// ── 1. remove the machinery ─────────────────────────────────────────────────
// Every script goes. The sandbox has to render identically with JavaScript
// switched off, or it is not a static reference to anything.
html = html.replace(/<script[\s\S]*?<\/script>/g, '')

// ── 2. optionally drop the embedded type ────────────────────────────────────
// 90 KB of the file is three base64 woff2 faces. Worth every byte when you are
// judging the design; pure cost when you are pasting the file into a chat that
// has to reproduce it token by token.
if (noFonts) html = html.replace(/@font-face\s*\{[^}]*\}/g, '')

// ── 3. bake in what the runtime would have added ────────────────────────────
// `js-anim` is the gate the entrance animation hides behind; `open` and
// `opened-done` are what put the book on screen at all. Without them the file
// renders a closed curtain and nothing else — a truthful rendering, and a
// useless one.
html = html.replace(/<html([^>]*)>/, '<html$1 class="js-anim">')
html = html.replace(/<body([^>]*)>/, '<body$1 class="curtain-open curtain-done open opened-done">')

// page-flip renames the pages it adopts, and the gutter shading, the boards and
// the fore-edge tabs are all keyed off those names. A sandbox without them is
// missing the binding.
let n = 0
html = html.replace(/<div class="page ([^"]*)"/g, (_m, cls: string) => {
  const hard = /divider|cover/.test(cls)
  const side = n % 2 === 1 ? '--right' : '--left'
  n++
  return `<div class="page ${cls} stf__item ${hard ? '--hard' : '--soft'} ${side}"`
})
html = html.replace(/<div class="reveal"/g, '<div class="reveal in"')

// Folios are written by the runtime too, and a handwritten page number in the
// corner is a design element like any other — leaving it out would mean judging
// the page furniture with a piece of it missing.
// Keyed off `data-page`, which the build already writes onto every page, rather
// than off a running counter matched with a regex — the first attempt at that
// landed folios on 8 pages out of 22, and a page-furniture element that appears
// on some pages and not others is worse than none at all when the whole point is
// judging the furniture.
html = html.replace(
  /(<div class="page (?:(?!divider|cover)[^"])*?" data-page="(\d+)"[^>]*>\s*<div class="half">)/g,
  (m, open: string, num: string) => `${open}<span class="pageno">${num}</span>`,
)

// ── 4. fence the one editable thing, and add the scaffolding ────────────────
const bookCssPath = join(ROOT, 'src/runtime/book.css')
const bookCss = await readFile(bookCssPath, 'utf8')
const marker = {
  start: '/* ========== BEGIN book.css — THE ONLY EDITABLE REGION ========== */',
  end: '/* ========== END book.css — copy back to src/runtime/book.css ===== */',
}
// The built file inlines book.css verbatim, so it can be found and fenced
// rather than re-inserted, which would risk shipping two copies that disagree.
const head = bookCss.slice(0, 120)
if (html.includes(head)) {
  html = html.replace(bookCss, `${marker.start}\n${bookCss}\n${marker.end}`)
} else {
  console.warn('  ! book.css not found verbatim in the build — fencing skipped')
}

html = html.replace('</style>', `</style>\n<style>${SANDBOX_CSS}</style>`)

// ── 5. a header explaining what this is ─────────────────────────────────────
const banner = `
<div class="sbx-note">
  <strong>Design sandbox — generated, do not hand-edit.</strong><br>
  Every page of the book, frozen: real stylesheet, real markup, real generated
  colour tokens, no JavaScript and nothing loaded from anywhere. The only part
  worth changing is the CSS fenced as <em>THE ONLY EDITABLE REGION</em>; put it
  back in <code>src/runtime/book.css</code> and rebuild.
  Regenerate with <code>node scripts/design-sandbox.ts</code>.
</div>`
html = html.replace(/<body([^>]*)>/, `<body$1>${banner}`)

await writeFile(OUT, html)
const kb = Math.round(Buffer.byteLength(html) / 1024)
console.log(`  ${OUT}`)
console.log(`  ${kb} KB${noFonts ? ' (fallback type)' : ' (fonts embedded)'} · no scripts · nothing fetched`)
