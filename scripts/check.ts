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
import { access, cp, mkdtemp, rm, readFile, readdir, mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
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
async function runScript(script: string, args: string[]): Promise<{ code: number; out: string }> {
  return await new Promise((res) => {
    const proc = spawn(process.execPath, [join(ROOT, script), ...args], {
      cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'],
    })
    let out = ''
    proc.stdout.on('data', (d) => { out += d })
    proc.stderr.on('data', (d) => { out += d })
    proc.on('close', (code) => res({ code: code ?? 0, out }))
  })
}

const build = (args: string[]) => runScript('src/build.ts', args)

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
// ASSERT THE PROPERTY, NOT A COUNT. This used to require exactly three files,
// which meant adding one picture to the sample failed a check about
// DEDUPLICATION for reasons that had nothing to do with it. A hard-coded total
// tests the content; what is worth testing is that identical bytes collapse to
// one file and that the collapsing actually happened.
const uniqueFiles = new Set(referenced)
check('dedup: identical pictures stored once',
  written.length === uniqueFiles.size && referenced.length > written.length,
  `stored ${written.length}, referenced ${referenced.length} times` +
  (referenced.length <= written.length ? ' — no picture is reused, so dedup was never exercised' : ''))

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

// EVERY REVEAL-GATED SELECTOR MUST NAME A CLASS THE BOOK ACTUALLY RENDERS.
//
// The sibling of the `.rail` check above, and it exists for a worse case. The
// whole `.step` family — the reveal stagger, the sticky-note press, the bar
// growth, the timeline rail draw — was gated on `.step.in` / `.step:not(.in)`,
// and `.step` is not a class this book has ever rendered: the runtime marks
// `.reveal`. Four separate pieces of choreography, including two the design
// specifies by name, silently did nothing. CSS never complains about a selector
// that matches no element, so nothing but a check like this can notice.
//
// Scoped to `.in`-gated rules on purpose. A blanket "every class selector must
// match" would flag every layout the sample book happens not to use, and a
// check that cries wolf is a check people learn to skip; a rule that gates a
// REVEAL, on the other hand, has exactly one job and cannot do it from a class
// that is never on the page. The catalogue is the corpus because it is the one
// document written to render every block and layout the kit has.
// Scanned over the STYLESHEET WITH ITS COMMENTS STRIPPED, not the whole file.
// The first draft matched `.step` in the comments left behind explaining why
// `.step` was removed — a check that fails because of the note explaining its
// own last catch is a check nobody can keep.
const styleCss = [...bookHtml.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)]
  .map((m) => m[1]!).join('\n').replace(/\/\*[\s\S]*?\*\//g, '')
const catalogueDir = join(TMP, 'catalogue')
const cataloguePath = join(catalogueDir, 'c.html')
const catalogue = await build([join(ROOT, 'content/every-layout.md'), cataloguePath, '--quiet'])
check('book: the layout catalogue builds', catalogue.code === 0, catalogue.out.trim())
const catalogueHtml = catalogue.code === 0 ? await readFile(cataloguePath, 'utf8') : ''
const rendersClass = (cls: string): boolean =>
  new RegExp(`class="[^"]*\\b${cls}\\b`, 'i').test(bookHtml) ||
  new RegExp(`class="[^"]*\\b${cls}\\b`, 'i').test(catalogueHtml)
const gated = [...new Set(
  [...styleCss.matchAll(/\.([a-z][a-z0-9-]*)(?:\.in\b|:not\(\.in\))/gi)].map((m) => m[1]!),
)].filter((cls) => cls !== 'in')
const gatedDead = gated.filter((cls) => !rendersClass(cls))
check('book: every reveal-gated rule targets a class that exists',
  gatedDead.length === 0,
  gatedDead.length
    ? `gates nothing: ${gatedDead.map((c) => '.' + c).join(', ')}`
    : `${gated.length} gating classes checked against the sample and the catalogue`)

// A KEYFRAME NOBODY PLAYS IS A FLOURISH THAT WAS LOST, NOT ONE THAT WAS CUT.
//
// `sticky-press` was a complete, carefully-authored landing — arrival angle,
// overshoot, shadow collapse — attached to a trigger that could not fire. It
// read as present in the source right up until you watched a note fade in like
// a paragraph. An unplayed keyframe is the visible half of that failure.
const keyframeNames = [...styleCss.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1]!)
const unplayed = [...new Set(keyframeNames)].filter(
  (name) => !new RegExp(`animation(?:-name)?\\s*:[^;{}]*\\b${name}\\b`).test(styleCss),
)
check('book: every keyframe is played by something',
  unplayed.length === 0,
  unplayed.length ? `never runs: ${unplayed.join(', ')}` : `${keyframeNames.length} keyframes checked`)

// EVERY SHIPPED COMMAND MUST RUN WHERE THERE IS NO INSTALL.
//
// The suite runs in a checkout, where node_modules exists, so it could not see
// that `motion` spawned `src/build.ts` — which imports markdown-it and dies the
// moment the skill is somewhere real. One of the four commands a user is told
// to run was the one command a user could not run, and it took copying the
// skill exactly as it ships to notice.
//
// This copies it that way on purpose: no node_modules, no output, nothing but
// what a user receives, then runs all four.
// OUTSIDE THE REPOSITORY, and that is the whole trick.
//
// The first version put the copy under `output/`, which is inside the project —
// so Node walked UP the directory tree, found the real `node_modules`, and
// every command passed. The check was vacuous: reintroducing the exact bug it
// was written for did not fail it. A temp directory elsewhere on disk is the
// only place where "no install" is actually true.
const clean = await mkdtemp(join(tmpdir(), 'tys-cleanroom-'))
// Everything a user gets, and nothing they do not: the whole folder minus the
// three directories that never travel. Listing wanted entries instead was tried
// and gave a FALSE failure — the copy was thinner than a real skill, so the
// builder failed for a reason no user would ever hit. A clean-room test is only
// worth anything if the room matches.
for (const entry of await readdir(ROOT)) {
  if (entry === 'node_modules' || entry === 'output' || entry === '.git') continue
  await cp(join(ROOT, entry), join(clean, entry), { recursive: true }).catch(() => {})
}
// EVERY command a user is told to run, not a sample of them. Two shipped
// untested — `doctor` and `prep` — and prep was the worse of the two: it is
// step one of every documented workflow and it was still raw TypeScript, so on
// a Node that does not strip types by default the FIRST command anyone ran
// would fail while the builder worked. The list is derived below rather than
// hand-kept, so adding a command to dist/ adds it to this test.
const shippedArgs: Record<string, string[]> = {
  'build.mjs': ['content/sample-book.md', 'out.html', '--quiet'],
  'ink.mjs': ['content/img/valve.jpg', 'out.ink.png'],
  'studio.mjs': ['theme.json', 'studio.html'],
  'motion.mjs': ['content/sample-book.md'],
  'doctor.mjs': ['content/sample-book.md'],
  'prep.mjs': ['content/sample-book.md'],
}
const shipped: Array<[string, string[]]> = (await readdir(join(ROOT, 'dist')))
  .filter((f) => f.endsWith('.mjs'))
  .map((f) => [`dist/${f}`, shippedArgs[f] ?? ['content/sample-book.md']])
const brokenInTheWild: string[] = []
for (const [cmd, argv] of shipped) {
  const r = await new Promise<number>((res) => {
    const proc = spawn(process.execPath, [join(clean, cmd), ...argv], {
      cwd: clean, stdio: ['ignore', 'ignore', 'ignore'],
    })
    proc.on('close', (code) => res(code ?? 0))
  })
  if (r !== 0) brokenInTheWild.push(cmd)
}
{
  // The flag the docs point at for "which copy am I running?" has to work in
  // the same empty room as everything else — it is the command someone reaches
  // for precisely when their install is in doubt.
  const v = await new Promise<number>((res) => {
    const proc = spawn(process.execPath, [join(clean, 'dist/build.mjs'), '--version'],
      { cwd: clean, stdio: ['ignore', 'ignore', 'ignore'] })
    proc.on('close', (code) => res(code ?? 0))
  })
  if (v !== 0) brokenInTheWild.push('dist/build.mjs --version')
}
check('shipped: every command runs with no node_modules at all',
  brokenInTheWild.length === 0,
  brokenInTheWild.length ? `dies without an install: ${brokenInTheWild.join(', ')}` :
    `${shipped.length} commands run from a copy with nothing installed`)

// ── the Ink Studio ──────────────────────────────────────────────────────────
//
// The studio is the only tool here an AUTHOR opens rather than an assistant
// runs, so it has to survive being handed over: one file, no install, and
// previewing the ink the book is actually printed in.
const studioDir = join(TMP, 'studio')
const studioPath = join(studioDir, 'ink-studio.html')
const studioRun = await runScript('scripts/build_studio.ts', ['theme.json', studioPath])
check('studio: it builds', studioRun.code === 0, studioRun.out.trim())
const studioHtml = studioRun.code === 0 ? await readFile(studioPath, 'utf8') : ''

// SELF-CONTAINED, like everything else this kit emits. A studio that fetches
// its own script is a studio that stops working the moment it is moved out of
// the folder it was built in — which is exactly what an author does with it.
const studioExternal = [...studioHtml.matchAll(/<(?:script|link|img)\b[^>]*?\s(?:src|href)=["']([^"']+)["']/gi)]
  .map((m) => m[1]!)
  .filter((u) => !u.startsWith('data:'))
check('studio: nothing is loaded from outside the file',
  studioExternal.length === 0,
  studioExternal.length ? `reaches out to: ${studioExternal.join(', ')}` : 'one file, no install')

// THE INK MUST BE THE BOOK'S INK, AND DERIVED RATHER THAN TYPED.
//
// The whole promise is that what an author approves in the studio is what lands
// on the page. `ink` and `paper` are computed by buildPalette from the one or
// two colours a theme declares — nobody writes them down — so a studio with its
// own copy of those values is a studio that silently previews the wrong book.
const { buildPalette: studioBuildPalette, loadTheme: studioLoadTheme } =
  await import(join(ROOT, 'src/theme.ts'))
const studioPalette = studioBuildPalette(await studioLoadTheme(join(ROOT, 'theme.json')))
const studioTheme = studioHtml.match(/window\.__INK_THEME__\s*=\s*(\{.*?\});/)?.[1]
const parsedStudioTheme = studioTheme ? JSON.parse(studioTheme) : null
check('studio: it previews in the book\'s own derived ink and paper',
  parsedStudioTheme?.ink === studioPalette.ink && parsedStudioTheme?.paper === studioPalette.paper,
  parsedStudioTheme
    ? `studio ${parsedStudioTheme.ink} / ${parsedStudioTheme.paper} vs palette ${studioPalette.ink} / ${studioPalette.paper}`
    : 'no theme was injected into the page at all')

// A COLOUR LITERAL IN THE TREATMENT WOULD OUTLAST EVERY REBRAND.
// The shell around the tool may be any colour it likes; the drawing may not.
const inkSource = await readFile(join(ROOT, 'src/studio/ink.ts'), 'utf8')
const inkLiterals = [...inkSource.matchAll(/#[0-9a-f]{3,8}\b/gi)].map((m) => m[0])
check('studio: the treatment itself holds no colour',
  inkLiterals.length === 0,
  inkLiterals.length ? `hard-coded: ${inkLiterals.join(', ')}` : 'every colour arrives as an argument')

// A CONTROL MUST OPEN ON THE VALUE IT IS ACTUALLY DRAWING WITH.
//
// It did not. The studio shipped for an hour marked "drawn" while nib, line and
// body showed numbers from an earlier tuning — the presets were re-tuned off a
// sweep and the slider attributes, written down separately, were not. The
// picture was correct because it reads the preset; the READOUT lied, which is
// worse, because a number on screen is what an author writes down and reuses.
// The values are generated from the preset now, and this is what stops anyone
// helpfully hard-coding them back.
const { DEFAULT_INK: studioDefaults } = await import(join(ROOT, 'src/studio/ink.ts'))
const sliderValues = Object.fromEntries(
  [...studioHtml.matchAll(/<input[^>]*id="([a-z]+)"[^>]*value="([^"]*)"/g)].map((m) => [m[1]!, m[2]!]),
)
const drifted = Object.entries(studioDefaults as Record<string, number>)
  .filter(([k, v]) => sliderValues[k] !== undefined && Number(sliderValues[k]) !== v)
  .map(([k, v]) => `${k}: slider ${sliderValues[k]}, preset ${v}`)
check('studio: every control opens on the value it is drawing with',
  drifted.length === 0,
  drifted.length ? drifted.join(' · ') : `${Object.keys(studioDefaults).length} controls agree with the default preset`)

// THE DEFAULT EXPORT HAS TO BE THE SMALL ONE.
//
// Pictures are packed into the book as base64, so the studio's default format
// is the single biggest lever on whether a book stays sendable: the same
// drawing is 1,838 KB as PNG and 592 KB as WebP. It shipped as PNG first, which
// is why this is asserted rather than assumed — a default nobody checks is a
// default that quietly reverts.
// Matched on the MIME strings themselves rather than on the constant's name:
// the studio ships minified, so every identifier in it is a single letter.
const webpAt = studioHtml.indexOf('image/webp')
const pngAt = studioHtml.indexOf('image/png')
check('studio: it exports the small format by default, and still offers PNG',
  webpAt !== -1 && pngAt !== -1 && webpAt < pngAt,
  webpAt === -1 ? 'no WebP export at all'
    : pngAt === -1 ? 'PNG was dropped — print needs a lossless option'
    : webpAt < pngAt ? 'webp first, png kept for print' : 'PNG is listed first, so it is the default')

// Every control the instructions promise has to be in the page. SKILL.md names
// Line, Tone and Nib by name, and a doc that names a control the tool does not
// have is worse than no doc.
const studioControls = ['nib', 'line', 'threshold', 'body', 'vignette', 'format', 'size'].filter((id) => !studioHtml.includes(`id="${id}"`))
check('studio: every control the instructions name exists',
  studioControls.length === 0,
  studioControls.length ? `missing: ${studioControls.join(', ')}` : 'line, tone, nib')

// A PLATE MUST HIDE THE RULING WITHOUT GUESSING THE PAPER.
//
// Three versions baked paper into the exported picture so it could cover the
// page's ruled lines, and all three showed a faint rectangle on a real page: a
// page is a gradient and a picture cannot know where on it it sits. The rule
// that replaced them blurs the backdrop instead, which matches by construction.
// Asserted because the temptation to "just paint the paper colour" is going to
// come back, and it looks right on a flat test swatch every time.
const plateRule = styleCss.match(/\.plate\s*\{[^}]*\}/)?.[0] ?? ''
check('book: a plate hides the ruling by blurring, not by painting paper',
  /backdrop-filter\s*:\s*blur/.test(plateRule) && /mask-image/.test(plateRule),
  plateRule === '' ? 'no .plate rule ships at all'
    : !/backdrop-filter\s*:\s*blur/.test(plateRule) ? 'it paints something instead of blurring the backdrop'
    : !/mask-image/.test(plateRule) ? 'the blurred region has no mask, so it is a rectangle'
    : 'blurs its backdrop and masks the edge')

// FAILS SOFT. A browser without backdrop-filter must still show the drawing —
// the ruling reads through it, which is the default look rather than a fault.
// A rule that hid the picture instead would blank artwork on older browsers.
check('book: a plate without backdrop-filter still shows the picture',
  plateRule !== '' && !/display\s*:\s*none/.test(plateRule) && !/opacity\s*:\s*0\b/.test(plateRule),
  'the picture must never depend on the effect to be visible')

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
  // `(?!\()` — a Markdown link is not a placeholder. Adding a contents table to
  // LAYOUTS.md turned every `[Prose](#prose)` into a demand that the build guard
  // against the word "Prose", which is nonsense: the build scans rendered HTML,
  // where a link is already an <a> and this shape cannot occur.
  for (const f of ['templates/starter.md', 'templates/LAYOUTS.md']) {
    for (const m of (await readFile(join(ROOT, f), 'utf8')).matchAll(/\[[A-Z][^\]\n]{1,70}\](?!\()/g)) {
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

// ── prep's marker audit ─────────────────────────────────────────────────────
//
// PROVEN BY PLANTING THE BUG. `{.step-first}` on the SECOND of two blocks
// inverts the page: the warning arrives on the turn and the paragraph it warns
// about arrives after it. The book still builds and every other check still
// passes — the only symptom is a page that reads backwards, which is exactly
// the class of defect a human reviewer misses and a script should not.
//
// The second case is quieter and worse to leave in shipped content: a marker
// that changes nothing still TEACHES, and the next author copies it.
{
  const dir = await mkdtemp(join(tmpdir(), 'tys-prep-'))
  const inverted = join(dir, 'inverted.md')
  await writeFile(inverted, [
    '# The harness is the last line',
    '',
    ':::opener the harness',
    'An anchor point rated for the load.',
    ':::',
    '',
    ':::warning A harness that has arrested a fall is finished {.step-first}',
    'It is destroyed, not returned to stores.',
    ':::',
  ].join('\n'))
  const flagged = await runScript('scripts/prep.ts', [inverted])
  check('prep: a marker that reorders a page is reported',
    /\{\.step-first\} pulls/.test(flagged.out),
    'prep said nothing about a marker that moves a block — an inverted page ships silently')

  const noop = join(dir, 'noop.md')
  await writeFile(noop, [
    '# What to remember',
    '',
    'The argument that leads up to it.',
    '',
    ':::takeaway {.step-last}',
    'Already the last block, so the marker does nothing.',
    ':::',
  ].join('\n'))
  const dead = await runScript('scripts/prep.ts', [noop])
  check('prep: a marker that changes nothing is reported',
    /changes nothing/.test(dead.out),
    'a no-op marker passed unremarked — it reads as intent and gets copied')

  // TWO `>>` ON ONE PAGE. Only the first opens a section; the rest print as
  // body text in the middle of the page. It happened in this kit's own
  // catalogue and the reader saw the word "Workbook" loose on a checklist.
  const twoSections = join(dir, 'two-sections.md')
  await writeFile(twoSections, ['# A page', '', '>> One', '', '>> Two', '', 'Some words.'].join('\n'))
  const sect = await runScript('scripts/prep.ts', [twoSections])
  check('prep: two section markers on one page are reported',
    /section markers on one page/.test(sect.out),
    'a second `>>` on a page passed unremarked — it prints as body text and looks like a typo')

  // AND THE SHIPPED CONTENT OBEYS ITS OWN ADVICE. A kit whose sample lessons
  // carry no-op markers is teaching by example the thing it warns about.
  for (const name of ['sample-book.md', 'reference-lesson.md', 'every-layout.md', 'audit-lesson.md']) {
    const r = await runScript('scripts/prep.ts', [join(ROOT, 'content', name)])
    check(`prep: content/${name} has no marker that does nothing`,
      !/changes nothing/.test(r.out),
      'a shipped lesson carries a marker with no effect')
  }
  await rm(dir, { recursive: true, force: true })
}

// ── the two things a reader SEES first ──────────────────────────────────────
//
// Both were reported from a real book, not deduced, and both are one-line
// regressions that no other check would notice.
{
  const runtime = await readFile(join(ROOT, 'src', 'runtime', 'book.ts'), 'utf8')
  // A BOOK OPENS AS A BOOK. `auto` picks whichever mode draws the larger page,
  // and on an ordinary 1060x857 window it chose ONE page — no fore-edge tabs,
  // and every `:::compare` / `:::timeline` split across a turn.
  check('view: a book opens on the two-page spread',
    /DEFAULT_VIEW\s*:\s*ViewMode\s*=\s*'spread'/.test(runtime),
    'the default view is not the spread — a book that opens as one page is not a book')

  const layouts = await readFile(join(ROOT, 'src', 'runtime', 'layouts.css'), 'utf8')
  // A PLATE IS NOT A BLEED. `.bleed-out img` / `.half-bleed-art img` fill their
  // slot with `object-fit: cover`, which crops a drawing AND makes the plate's
  // backdrop-filter blur half the page — measured at 51% wide by 86% tall, so
  // the ruled lines vanished from practically the whole page.
  const plateInBleed = /\.bleed-out img\.plate[\s\S]{0,400}?\}/.exec(layouts)?.[0] ?? ''
  check('plate: a drawing in a bleed slot is contained, not cropped',
    /object-fit:\s*contain/.test(plateInBleed) && /max-width:\s*100%/.test(plateInBleed),
    'a {.plate} inside a bleed layout inherits object-fit: cover — it gets cropped, ' +
    'and its blur covers the whole slot instead of the drawing')

  // THE PLATE PAGE IS THE ONLY LAYOUT THAT REACHES THE BOTTOM OF THE PAGE.
  // Prose flows from the top and runs out before the folio; this grid pins its
  // copy to the bottom because the art row takes every pixel of slack, so
  // without a reserve the last line prints straight through the page number —
  // which the sample shipped doing until it was seen on screen.
  const layoutTsForNames = await readFile(join(ROOT, 'src', 'layout.ts'), 'utf8')
  const platePage = /\.plate-page\s*\{[\s\S]{0,900}?\}/.exec(layouts)?.[0] ?? ''
  check('plate: the plate page reserves room for the folio',
    /padding-bottom:/.test(platePage),
    'the plate layout does not clear the page number — its last line will print over the folio')

  // ── NO CSS RULE MAY SHARE A NAME WITH A LAYOUT ───────────────────────────
  //
  // A page carries its LAYOUT NAME as a class: `<div class="page pl plate">`.
  // So a bare `.plate { … }` written for an image also styles the whole page,
  // silently, and the symptom shows up nowhere near the rule — a blur meant for
  // a drawing washed out the header band at the top of the page.
  //
  // This has now happened twice. `.barchart { display: flex }` matched only
  // `<div class="page pr barchart">` and nothing else, and `.plate` put a
  // backdrop-filter and an edge mask on an entire page. Both were written by
  // someone who had read the other one's warning comment, which is exactly why
  // a comment is not enough and this is a check.
  //
  // Qualify the selector — `img.plate`, `.plate-art img` — or rename it. A
  // layout's OWN rules are the legitimate exception: `.page.plate` and
  // `.page.divider` are qualified by `.page` and say what they mean.
  {
    const names = new Set((/export const LAYOUTS = \[([\s\S]*?)\] as const/.exec(layoutTsForNames)?.[1] ?? '')
      .match(/'([a-z-]+)'/g)?.map((q) => q.slice(1, -1)) ?? [])
    const css = [layouts, await readFile(join(ROOT, 'src', 'runtime', 'book.css'), 'utf8')].join('\n')
    // NARROWED TO WHAT ACTUALLY WRECKS A PAGE. Twelve layouts are named after
    // the block they contain — `.takeaway`, `.opener`, `.contents` — and those
    // rules matching the page too is old, harmless and intended: they set
    // layout and type, and a page is already the box they describe.
    //
    // These properties are different. Each one repaints or reshapes an entire
    // box irrespective of what is in it, so applying one to a whole page is
    // never what was meant and the damage appears far from the rule. That is
    // the whole failure: the blur meant for a 347x277 drawing washed out a
    // header band 60px from the top of the page.
    const WRECKS_A_PAGE = /(backdrop-filter|[^-]filter\s*:|mask-image|mask-composite|mix-blend-mode|clip-path|opacity\s*:)/
    const collisions = [...names].filter((n) => {
      const rule = new RegExp(`(^|[,}])\\s*\\.${n}(?![\\w-])[^{]*\\{([^}]*)\\}`, 'm').exec(css)
      return rule ? WRECKS_A_PAGE.test(rule[2]!) : false
    })
    check(`design: no bare CSS selector paints a whole page via one of the ${names.size} layout names`,
      collisions.length === 0,
      `${collisions.map((c) => `.${c}`).join(' ')} — a page carries its layout name as a class, so ` +
      'this rule also blurs, masks or blends the whole page. Qualify it (img.plate) or rename it.')
  }

  // A PLATE IS A LAYOUT NOW, NOT A DECORATION, and the picker has to reach it
  // BEFORE the half bleed: both are "one picture and a little copy", so
  // whichever is tested first wins and a drawing would go back to being cropped.
  const layoutTs = await readFile(join(ROOT, 'src', 'layout.ts'), 'utf8')
  const plateAt = layoutTs.indexOf("return 'plate'")
  const bleedAt = layoutTs.indexOf("return 'half-bleed'")
  check('plate: the picker reaches a plate before a half bleed',
    plateAt > 0 && bleedAt > 0 && plateAt < bleedAt,
    'half-bleed is tested first, so a treated drawing lands in the photograph layout again')
}

// ── hand-drawn diagrams ─────────────────────────────────────────────────────
//
// Three diagram types are generated in code; the rest are drawn by whoever is
// writing the book, from a grammar in `design/diagram-grammars/`. That trade is
// only safe because two things are enforced rather than requested.
{
  const dir = await mkdtemp(join(tmpdir(), 'tys-dg-'))
  const svg = (fill: string) =>
    ['# A page', '', ':::diagram flowchart',
     '<svg viewBox="0 0 200 100" role="img" aria-label="t">',
     `  <rect class="dg-node" x="10" y="10" width="80" height="40" fill="${fill}"/>`,
     '</svg>', ':::'].join('\n')

  // 1. COLOUR IS THE THEME'S, NOT THE DIAGRAM'S. A literal looks right in the
  // theme it was written against and wrong in every other, and a rebrand that
  // misses one page is worse than a build that stops.
  const bad = join(dir, 'bad.md')
  await writeFile(bad, svg('#35C0B6'))
  const r1 = await runScript('dist/build.mjs', [bad, join(dir, 'bad.html')])
  check('diagram: a hand-drawn diagram may not carry its own colours',
    r1.code !== 0 && /hard-codes/.test(r1.out),
    'a diagram with a hex colour built happily — it will survive a rebrand looking wrong')

  // 2. AND THE SAME DIAGRAM ON THEME MUST BUILD, or the guard is just a wall.
  const good = join(dir, 'good.md')
  await writeFile(good, svg('var(--paper-2)'))
  const r2 = await runScript('dist/build.mjs', [good, join(dir, 'good.html'), '--quiet'])
  check('diagram: the same diagram on theme tokens builds',
    r2.code === 0,
    `a themed diagram was refused too:\n${r2.out.split('\n').slice(0, 6).join('\n')}`)

  // 3. THE AUTHORED SVG SURVIVES. Stripping tags is what the generated path
  // does to its text input, and it would quietly reduce a hand-drawn diagram to
  // a paragraph of nothing.
  const html = await readFile(join(dir, 'good.html'), 'utf8')
  check('diagram: authored SVG reaches the page intact',
    /<svg[\s>]/.test(html) && /dg-node/.test(html),
    'the SVG did not survive the build — the animation contract needs the elements')
  await rm(dir, { recursive: true, force: true })

  // 4. THE ANIMATION CONTRACT IS THE FOUR CLASS NAMES, and the grammar README
  // is where anyone drawing a diagram learns them. If the runtime grows a fifth
  // and the document does not, every diagram drawn after that is under-animated
  // and nobody finds out.
  const runtime = await readFile(join(ROOT, 'src', 'runtime', 'book.ts'), 'utf8')
  const anim = /function animateDiagrams[\s\S]*?\n  \}/.exec(runtime)?.[0] ?? ''
  const classes = [...new Set([...anim.matchAll(/'\.?(dg-[a-z]+)'/g)].map((m) => m[1]!))]
  const grammar = await readFile(join(ROOT, 'design', 'diagram-grammars', 'README.md'), 'utf8')
  const undocumented = classes.filter((c) => !grammar.includes(c))
  check(`diagram: all ${classes.length} animated classes are in the grammar`,
    undocumented.length === 0,
    `${undocumented.join(' ')} — the runtime animates these and the grammar never mentions them, ` +
    'so nothing drawn from it will use them')

  // 5. THE INDEX AND THE FOLDER AGREE, BOTH WAYS. A grammar nothing links to is
  // a page nobody finds, and a linked page that does not exist is a 404 in the
  // middle of drawing a diagram. Both happen by writing one and forgetting the
  // other, which is exactly the kind of drift a check exists for.
  const grammarDir = join(ROOT, 'design', 'diagram-grammars')
  const onDisk = (await readdir(grammarDir))
    .filter((f) => f.startsWith('type-') && f.endsWith('.md'))
  const linked = [...grammar.matchAll(/\(type-([a-z-]+)\.md\)/g)].map((m) => `type-${m[1]}.md`)
  const unlinked = onDisk.filter((f) => !linked.includes(f))
  const missing = [...new Set(linked)].filter((f) => !onDisk.includes(f))
  check(`diagram: all ${onDisk.length} grammars are listed in the index`,
    unlinked.length === 0,
    `${unlinked.join(' ')} — written but linked from nowhere, so nobody drawing a diagram finds them`)
  check('diagram: every type the index links to has a grammar',
    missing.length === 0,
    `${missing.join(' ')} — the index promises these and the folder does not have them`)

  // 6. AND SKILL.md's COUNT IS THE REAL ONE. An assistant reads that number to
  // decide whether the folder is worth opening, so a stale one either hides
  // types or promises types that were never written.
  for (const doc of ['SKILL.md', 'README.md']) {
    const text = await readFile(join(ROOT, doc), 'utf8')
    const claims = [...text.matchAll(/(?:\*\*|<b>)(\d+) (?:diagram )?grammars/g)].map((m) => Number(m[1]))
    check(`diagram: ${doc}'s count matches the folder (${onDisk.length})`,
      claims.length > 0 && claims.every((n) => n === onDisk.length),
      claims.length === 0
        ? `${doc} no longer states a grammar count — the check that keeps it honest has nothing to read`
        : `${doc} says ${claims.join('/')} grammars, the folder has ${onDisk.length}`)
  }
}

// ── every layout has a picture ──────────────────────────────────────────────
//
// The README's "what it looks like" table is how anyone decides a layout is
// worth using — reading syntax is not the same as seeing the page. So a layout
// with no picture is a layout nobody chooses.
//
// Five shipped without one and the README showed 17 while claiming 22. Nothing
// failed; the docs were simply a photograph of an older kit. `scripts/
// screenshot.mjs` makes refreshing them one command, and this makes forgetting
// impossible.
{
  const shots = new Set((await readdir(join(ROOT, 'docs', 'screenshots')))
    .map((f) => f.replace(/^\d+-/, '').replace(/\.\w+$/, '')))
  const layoutTs = await readFile(join(ROOT, 'src', 'layout.ts'), 'utf8')
  const names = (/export const LAYOUTS = \[([\s\S]*?)\] as const/.exec(layoutTs)?.[1] ?? '')
    .match(/'([a-z-]+)'/g)?.map((q) => q.slice(1, -1)) ?? []
  // The generated four have no page a reader chooses — a cover, a contents, a
  // divider board and a colophon arrive whether you want them or not, so there
  // is nothing to decide and nothing to photograph for.
  const GENERATED = new Set(['cover', 'contents', 'divider', 'colophon'])
  const undocumented = names.filter((n) => !GENERATED.has(n) && !shots.has(n))
  check(`docs: all ${names.length - GENERATED.size} chooseable layouts have a screenshot`,
    undocumented.length === 0,
    `no picture for: ${undocumented.join(', ')} — a layout nobody can see is a layout ` +
    'nobody picks. node scripts/screenshot.mjs <url> ' + undocumented.join(' '))
}

// ── the docs must not send a user at raw TypeScript ─────────────────────────
//
// `node scripts/prep.ts` relies on Node stripping types, which is not on by
// default across the whole Node 22 line the docs promise. prep is STEP ONE of
// every workflow, so on an early 22 the first command anyone ran would fail
// while the builder worked fine — the most confusing possible failure.
//
// Bundled now, and the docs point at the bundle. Checked because the two are
// easy to let drift apart, and the drift is invisible on a machine new enough
// to run either.
{
  const docs = await Promise.all(
    ['SKILL.md', 'README.md', 'templates/CHOOSING.md']
      .map((f) => readFile(join(ROOT, f), 'utf8')))
  const raw = docs.join('\n').match(/node scripts\/\w+\.ts/g) ?? []
  // `check`, `verify`, `prebundle` and `gen-capabilities` are contributor tools
  // and are allowed to be run from source — they are not part of the promise.
  const CONTRIBUTOR = /check|verify|prebundle|gen-capabilities|drive-browser/
  const forUsers = [...new Set(raw)].filter((c) => !CONTRIBUTOR.test(c))
  check('docs: no user-facing command is run from raw TypeScript',
    forUsers.length === 0,
    `${forUsers.join(' ')} — needs Node's type stripping, which the promised Node 22 ` +
    'floor does not guarantee. Bundle it and point the docs at dist/.')
}

// ── doctor has to actually fail a broken book ───────────────────────────────
//
// A verdict command that says "fine" whatever you give it is worse than no
// verdict command: an assistant trusts it and hands over a broken book with
// more confidence than if it had checked nothing. So the check is not "does it
// run" — it is "does it say no when the answer is no".
{
  const dir = await mkdtemp(join(tmpdir(), 'tys-doctor-'))
  const doctor = join(ROOT, 'dist', 'doctor.mjs')

  // A book that cannot build: a template placeholder the builder refuses.
  const broken = join(dir, 'broken.md')
  await writeFile(broken, ['# A page', '', 'This still says [BOOK TITLE] in it.'].join('\n'))
  const bad = await runScript('dist/doctor.mjs', [broken])
  check('doctor: it fails a book that does not build',
    bad.code !== 0 && /✗/.test(bad.out),
    'doctor passed a lesson the builder refuses — a verdict that is always yes is worse ' +
    'than no verdict at all')

  // And passes the shipped sample, which is known good.
  const good = await runScript('dist/doctor.mjs', [join(ROOT, 'content', 'sample-book.md')])
  check('doctor: it passes the shipped sample',
    good.code === 0,
    `doctor fails the kit's own sample:\n${good.out.split('\n').slice(0, 8).join('\n')}`)

  check('doctor: --json carries the verdict a caller branches on',
    /"ok":/.test((await runScript('dist/doctor.mjs',
      [join(ROOT, 'content', 'sample-book.md'), '--json'])).out),
    '--json has no ok field, so a caller has to parse prose to find the answer')

  void doctor
  await rm(dir, { recursive: true, force: true })
}

// ── --version must list the layouts that actually exist ─────────────────────
//
// The question behind "why haven't I got the new layouts?" is "which copy am I
// running?", and no document can answer it — the reader has a checkout, a
// plugin cache or a zip, and cannot tell which. So the builder answers it, and
// answers with the layout list READ FROM THE CODE rather than a count somebody
// remembered to update. A hardcoded number here would be the same lie the
// question exists to escape.
{
  const buildTs = await readFile(join(ROOT, 'src', 'build.ts'), 'utf8')
  const fn = /function version\(\)[\s\S]*?\n\}/.exec(buildTs)?.[0] ?? ''
  check('version: --version reads the layout list from the code',
    /LAYOUTS\.length/.test(fn) && /LAYOUTS\.join/.test(fn),
    '--version restates a count instead of reading LAYOUTS, so it can claim ' +
    'layouts the installed copy does not have')
  const readme = await readFile(join(ROOT, 'README.md'), 'utf8')
  check('docs: the README says how to update, not just how to install',
    /git -C[^\n]*pull/.test(readme) && /--version/.test(readme),
    'the README installs the skill and never says how to update it or how to ' +
    'find out which version is running — the exact hole someone falls into')
}

// ── the docs must not promise a build the guard refuses ─────────────────────
//
// README.md and SKILL.md both said the starter template "builds as it stands".
// It does not, and cannot: it is 28 bracketed placeholders and the builder
// blocks any book still carrying one. That refusal is correct — a forgotten
// [BOOK TITLE] must never reach a reader — but it made the FIRST thing a new
// user tries fail with an error the documentation told them would not happen.
//
// Checked against the template rather than against a phrase, so it stays true
// however the sentence is worded next.
{
  const starter = await readFile(join(ROOT, 'templates', 'starter.md'), 'utf8')
  const hasPlaceholders = /\[[A-Z][^\]\n]{1,70}\]/.test(starter)
  const docs = [
    await readFile(join(ROOT, 'README.md'), 'utf8'),
    await readFile(join(ROOT, 'SKILL.md'), 'utf8'),
  ].join('\n')
  const promises = /starter[\s\S]{0,400}?builds as it stands|builds as it stands[\s\S]{0,400}?starter/i.test(docs)
  check('docs: nothing claims the starter builds while it is still placeholders',
    !(hasPlaceholders && promises),
    'the starter is placeholders and the builder refuses it, but the docs say it builds — ' +
    'which is the first thing a new reader tries')
}

// ── renderLayouts must reach every shape it handles ─────────────────────────
//
// It starts with a bail-out: a page whose HTML matches none of a list of names
// is returned untouched. Miss a name and the layout is silently never built —
// the page renders, nothing throws, and the feature simply is not there.
//
// Three times now. The half-bleed grid, the quote attribution, and then all
// four workbook blocks at once. The function's own comment says "every shape
// this function touches has to appear here"; that comment has now failed twice,
// so the list is checked against the selectors the function actually uses.
{
  const layoutTs = await readFile(join(ROOT, 'src', 'layout.ts'), 'utf8')
  const fn = /export function renderLayouts[\s\S]*?\n\}/.exec(layoutTs)?.[0] ?? ''
  const guard = /if \(!\/([^/]+)\/\.test\(html\)\) return html/.exec(fn)?.[1] ?? ''
  const handled = new Set(
    [...fn.matchAll(/querySelectorAll\('([^']+)'\)/g)]
      .flatMap((m) => m[1]!.split(','))
      .map((sel) => /\.([a-z][a-z0-9-]*)/.exec(sel.trim())?.[1])
      .filter((c): c is string => Boolean(c)))
  const missing = [...handled].filter((c) => !guard.includes(c))
  check(`design: renderLayouts reaches all ${handled.size} shapes it handles`,
    missing.length === 0,
    `${missing.join(' ')} — handled inside renderLayouts but absent from its bail-out, ` +
    'so those pages are returned untouched and the layout silently never happens')
}

// ── the tick is written, and it fails visible ───────────────────────────────
{
  const layoutTs = await readFile(join(ROOT, 'src', 'layout.ts'), 'utf8')
  const css = await readFile(join(ROOT, 'src', 'runtime', 'layouts.css'), 'utf8')
  const runtime = await readFile(join(ROOT, 'src', 'runtime', 'book.ts'), 'utf8')

  // pathLength="1" is what lets the stroke draw at any size without measuring.
  // getTotalLength() returns 0 for a path the browser has not laid out, and
  // every page except the one on screen is exactly that — so a measured version
  // would draw nothing on every page but the first and look like dead code.
  // MATCHED ON THE EMITTED MARKUP, not anywhere in the file. The first version
  // tested for `pathLength="1"` loose, and the COMMENT above the code explaining
  // why pathLength is needed satisfied it — so deleting the attribute left the
  // check green. Same trap as a `.step` check that matched the note explaining
  // why `.step` had been removed.
  check('checklist: the tick is drawn in unit length',
    /'<path pathLength="1"/.test(layoutTs),
    'the tick has no pathLength, so its stroke-on has to measure geometry that ' +
    'does not exist yet on an unrendered page')

  // FAIL VISIBLE. Hiding the stroke in the stylesheet means a book with broken
  // scripting shows a page of empty boxes — which reads as a bug, not as a
  // checklist. The hide belongs to the code that also un-hides it.
  const tickRule = /\.checklist \.tick path \{([^}]*)\}/.exec(css)?.[1] ?? ''
  check('checklist: an unticked box is never the CSS default',
    !/stroke-dashoffset/.test(tickRule),
    'the stylesheet hides the tick, so a book whose JavaScript failed shows ' +
    'empty boxes for ever instead of ticked ones')
  check('checklist: the runtime is what hides the tick before writing it',
    /strokeDashoffset: 1/.test(runtime),
    'nothing parks the stroke, so the ticks are already drawn when the page arrives')
}

// ── a sticky note lands under its host, not across it ───────────────────────
//
// The placement used to try the four corners first and drop to `under` only
// when every corner buried more text. The result was that the SAME note looked
// different in two books for no reason a reader could see — below the host on a
// crowded page, across its corner on a sparse one. `under` is the preferred
// placement now, and a corner has to beat it by a full line of body text before
// it takes the note away.
{
  const runtime = await readFile(join(ROOT, 'src', 'runtime', 'book.ts'), 'utf8')
  const place = /function placeStickies\(\)[\s\S]*?\n  \}/.exec(runtime)?.[0] ?? ''
  const order = /const CORNERS = \[([^\]]*)\]/.exec(place)?.[1] ?? ''
  check('sticky: under is the first placement tried',
    /^\s*'under'/.test(order),
    `CORNERS starts ${order.trim().slice(0, 24)} — a corner wins ties, so notes go back to `
    + 'landing across the text on any page with room')
  check('sticky: a corner has to be measurably better to take the note',
    /bestCost - worthMoving/.test(place),
    'any cheaper corner displaces the preferred placement, so a rounding error decides the look')
}

// ── the riffle has to actually turn pages ───────────────────────────────────
//
// `turnToPage` SETS the position; `flip`/`flipPrev` ANIMATE it. The riffle
// shipped using turnToPage for every step but the last, so a control whose
// whole purpose is motion was a run of instant cuts. Recorded at 16ms from
// spread 6 of 11: 10|11 -> 8|9 -> 6|7 -> 4|5 -> 2|3, each landing in one frame.
//
// The only turnToPage a riffle may contain is the reduced-motion path, which is
// SUPPOSED to place the page without animating, and a final position tidy-up.
{
  const runtime = await readFile(join(ROOT, 'src', 'runtime', 'book.ts'), 'utf8')
  const body = /async function riffle\(\)[\s\S]*?\n  \}/.exec(runtime)?.[0] ?? ''
  check('riffle: every step of the riffle is a real page turn',
    /flipPrev\(/.test(body),
    'the riffle animates nothing — it places pages, so the pages cut instead of turning')
  // TWO of them: the stepping loop and the uninterrupted final turn. One would
  // mean the loop still places its pages and only the last leaf moves — which
  // is exactly the bug, wearing a flipPrev as a disguise. The paired ceiling on
  // turnToPage keeps the reduced-motion path and the end-position tidy legal
  // and nothing else. (Written this way because the first draft, `turnToPage
  // <= 2` alone, PASSED on the broken code — it had exactly two.)
  const places = (body.match(/turnToPage\(/g) ?? []).length
  const turns = (body.match(/flipPrev\(/g) ?? []).length
  check('riffle: it turns pages rather than placing them',
    turns >= 2 && places <= 2,
    `${turns} animated turns and ${places} instant placements in riffle() — ` +
    'a riffle wants a turn per step, not a run of cuts')
}

// ── motion stays truthful ───────────────────────────────────────────────────
//
// SKILL.md tells whoever is writing a book that comparable marks animate for
// the same DURATION and that sequence comes from staggering their DELAYS. That
// is not a style note: three bars growing at three speeds show a false ratio in
// every frame between the start and the end, and the frames in between are
// roughly all anyone looks at.
//
// A rule in a document that the runtime does not follow is worse than no rule,
// so this holds the two together.
{
  const runtime = await readFile(join(ROOT, 'src', 'runtime', 'book.ts'), 'utf8')
  const anim = /function animateDiagrams[\s\S]*?\n  \}/.exec(runtime)?.[0] ?? ''

  const durations = [...anim.matchAll(/duration: ([\d.]+)/g)].map((m) => Number(m[1]))
  const bars = /if \(bars\.length\) \{[\s\S]*?\n        \}/.exec(anim)?.[0] ?? ''
  const barDurations = [...bars.matchAll(/duration: ([\d.]+)/g)].map((m) => Number(m[1]))
  check('motion: every bar in a chart grows for the same length of time',
    barDurations.length > 0 && new Set(barDurations).size === 1,
    `bars animate over ${[...new Set(barDurations)].join(' and ')} seconds — ` +
    'marks the reader compares must share a duration, or every mid-flight frame is a false ratio')
  check('motion: their order comes from staggered delays',
    /stagger: [\d.]+/.test(bars),
    'the bars have no stagger, so either they all arrive at once or someone will be tempted to ' +
    'sequence them by changing durations, which is the thing that lies')
  check('motion: nodes and labels are staggered rather than raced',
    (anim.match(/stagger: [\d.]+/g) ?? []).length >= 3 && durations.length >= 4,
    'a family of shapes is being sequenced some other way — check it is not by duration')

  const skill = await readFile(join(ROOT, 'SKILL.md'), 'utf8')
  check('motion: the rule is written down where a book author will read it',
    /same duration/i.test(skill) && /stagger/i.test(skill),
    'the runtime keeps comparable marks honest and nothing tells an author to keep their own drawings honest')
}

// ── the four generated data forms ───────────────────────────────────────────
//
// A waffle, a pictogram, a progress meter and a stat row are common enough that
// hand-drawing them is wasted effort and a chance to get the arithmetic wrong.
// These build one of each and count what came out, because the fault worth
// catching here is silent: a form that draws the FILLED half correctly and the
// empty half invisibly still looks like a chart.
{
  const dir = await mkdtemp(join(tmpdir(), 'tys-forms-'))
  const md = join(dir, 'f.md')
  await writeFile(md, [
    '# Forms', '',
    ':::diagram waffle', '62 of 100 | caption', ':::', '',
    ':::diagram pictogram', '7 in 10 | caption', ':::', '',
    ':::diagram progress', 'One | 62', 'Two | 88', ':::', '',
    ':::diagram stats', '12 | incidents', '3 | permits', ':::',
  ].join('\n'))
  const out = join(dir, 'f.html')
  const r = await runScript('dist/build.mjs', [md, out, '--quiet'])
  check('forms: a book using all four generated forms builds',
    r.code === 0, `it did not build:\n${r.out.split('\n').slice(0, 5).join('\n')}`)
  const html = await readFile(out, 'utf8')
  const figure = (kind: string): string => {
    const i = html.indexOf(`diagram-${kind}`)
    return i < 0 ? '' : html.slice(i, html.indexOf('</figure>', i))
  }

  const waffle = figure('waffle')
  const cells = (waffle.match(/<rect/g) ?? []).length
  const outlined = (waffle.match(/fill="none"/g) ?? []).length
  check('forms: a waffle draws the whole hundred, not just the filled part',
    cells === 100 && outlined === 38,
    `${cells} cells, ${outlined} of them outlined — "62 of 100" is only a claim if the reader can see the 100`)
  // THE BUG THIS GUARDS. The empty cells were drawn as a faint fill in the node
  // tone, which sits a hair off the paper: all 38 rendered as nothing and the
  // grid read as "62 of 62". Outlining them in that same tone changed nothing.
  // They are stroked in the EDGE tone, which is the one meant to be seen.
  check('forms: the empty cells are outlined in a tone that shows on paper',
    /stroke="[^"]+"[^>]*fill="none"|fill="none"[^>]*stroke="[^"]+"/.test(waffle)
      && !/fill="none"[^>]*stroke="none"/.test(waffle),
    'the empty cells have no visible outline, so the grid reads as though everything is filled')

  const picto = figure('pictogram')
  check('forms: a pictogram draws the empty figures too',
    (picto.match(/fill="none"/g) ?? []).length === 6,
    'the three unfilled figures are missing, which turns "7 in 10" into a picture of seven people')

  const progress = figure('progress')
  check('forms: a progress meter draws a track behind every bar',
    (progress.match(/dg-bar/g) ?? []).length === 2 && (progress.match(/dg-node/g) ?? []).length === 2,
    'the empty part of the track is the subject — a meter without one is a bar chart')

  const stats = figure('stats')
  check('forms: a stat row rules between the figures rather than boxing them',
    (stats.match(/<line/g) ?? []).length === 1 && !/<rect/.test(stats),
    'boxes turn three facts into three cards, which is the dashboard look the kit avoids')
  await rm(dir, { recursive: true, force: true })
}

// ── does every page actually fit? ───────────────────────────────────────────
//
// `prep` answers "will this page fit" by counting characters against a budget,
// which is a guess made before a browser has laid anything out. `overflow`
// opens the built book and measures the painted glyphs instead. These run its
// four detectors against a book with the fault planted in it, because a
// detector nobody has seen fire is a detector nobody should trust — and the
// first version of this one reported that fifty pages and four pieces of text
// all fitted perfectly, having measured a closed book.
{
  const dir = await mkdtemp(join(tmpdir(), 'tys-fit-'))
  const lesson = join(dir, 'l.md')
  await writeFile(lesson, ['# A page', '', 'One paragraph, comfortably inside the sheet.'].join('\n'))
  const book = join(dir, 'book.html')
  await runScript('dist/build.mjs', [lesson, book, '--quiet'])
  const clean = await readFile(book, 'utf8')

  const plant = async (name: string, markup: string): Promise<string> => {
    const at = clean.indexOf('<div class="reveal">') + '<div class="reveal">'.length
    const file = join(dir, `${name}.html`)
    await writeFile(file, clean.slice(0, at) + markup + clean.slice(at))
    return file
  }
  const measure = async (file: string): Promise<{ ran: boolean; why?: string; errors: Array<{ kind: string }> }> => {
    const r = await runScript('dist/overflow.mjs', [file, '--json'])
    try { return JSON.parse(r.out) } catch { return { ran: false, why: r.out.slice(0, 120), errors: [] } }
  }

  const base = await measure(book)
  if (!base.ran) {
    // NOT SILENTLY SKIPPED. A machine with no browser cannot run these, and
    // saying so is the difference between "we checked" and "we did not".
    console.log(`  skip  page fit: not measured — ${base.why ?? 'no browser on this machine'}`)
  } else {
    check('overflow: a page that fits reports nothing',
      base.errors.length === 0,
      `a plain one-paragraph page was reported as broken: ${JSON.stringify(base.errors).slice(0, 200)}`)

    const cases: Array<[string, string, string]> = [
      ['off', '<p style="margin-left:900px;white-space:nowrap">planted line running off the sheet</p>', 'text-off-page'],
      ['clip', '<div style="overflow:hidden;height:6px"><p>planted text cut off by its box</p></div>', 'text-clipped'],
      ['over', '<div style="position:relative;height:40px">'
        + '<span style="position:absolute;left:0;top:0">PLANTED OVERLAP ONE</span>'
        + '<span style="position:absolute;left:0;top:0">PLANTED OVERLAP TWO</span></div>', 'text-collision'],
      ['tiny', '<p style="font-size:6px">planted microscopic caption</p>', 'text-too-small'],
    ]
    for (const [name, markup, kind] of cases) {
      const r = await measure(await plant(name, markup))
      check(`overflow: it catches ${kind}`,
        r.errors.some((e) => e.kind === kind),
        `the fault was planted and not reported — found ${JSON.stringify(r.errors.map((e) => e.kind))}`)
    }
  }
  await rm(dir, { recursive: true, force: true })

  const doctor = await readFile(join(ROOT, 'scripts', 'doctor.ts'), 'utf8')
  check('doctor: page fit is one of its checks',
    /name: 'page fit'/.test(doctor) && /overflow\.mjs/.test(doctor),
    'doctor still answers "is this book finished?" without ever measuring whether a page fits')
  // A missing browser must never turn into a broken book. The whole point of
  // the fourth check is that it is additive.
  check('doctor: a machine with no browser still gets a verdict',
    /ok: true, detail: `not measured/.test(doctor),
    'a book on a machine without Chrome would be reported as failing, which is a lie about the book')
}

// ── dg-bar grows the way the grammars say it does ───────────────────────────
//
// The runtime scaled X from the left edge, always. Correct for a horizontal bar
// chart, and wrong for the two other things the grammars send here: a column
// chart, where a column that grows sideways out of its axis reads as a fault,
// and a polar wedge, which grows from the chart's centre — a point that is not
// on its own bounding box and that nothing in the runtime can know.
//
// Both grammars were written on the same day as this check and both described
// an animation that did something else. So the runtime learned to find its own
// baseline, polar was moved to `dg-node`, and these hold the three of them
// together.
{
  const runtime = await readFile(join(ROOT, 'src', 'runtime', 'book.ts'), 'utf8')
  const branch = /if \(bars\.length\) \{[\s\S]*?\n        \}/.exec(runtime)?.[0] ?? ''
  check('dg-bar: it can grow upward as well as rightward',
    /scaleY: 0/.test(branch) && /scaleX: 0/.test(branch),
    'only one axis is implemented — a column chart grows sideways out of its own axis')
  // The aspect-ratio version of this passed a naive check and was still wrong:
  // a 1-in-100 bar is 2.8px wide by 20px tall, so the DATA would have picked the
  // axis and one short bar in a chart would have grown the wrong way. What
  // defines the chart is the shared baseline, which is true at every value.
  check('dg-bar: the axis comes from the shared baseline, not from one bar\'s shape',
    /b\.y \+ b\.height/.test(branch) && /boxes\.length > 1/.test(branch),
    'the growth axis is decided per bar rather than from the baseline the bars share — ' +
    'a chart\'s smallest bar is often taller than it is wide, so the data would choose the animation')
  check('dg-bar: a lone bar can be told which way to grow',
    /data-grow/.test(branch),
    'a single bar has no baseline to share and no way to override the guess')

  const polar = await readFile(join(ROOT, 'design', 'diagram-grammars', 'type-polar.md'), 'utf8')
  const tagIt = /## Tag it\n([\s\S]*?)\n## /.exec(polar)?.[1] ?? ''
  check('dg-bar: polar does not tag its wedges as bars',
    /dg-node/.test(tagIt) && !/`dg-bar` on every wedge/.test(polar),
    'the polar grammar still sends wedges to dg-bar, which grows a shape from its own edge — ' +
    'a wedge would stretch sideways instead of radiating')

  const grammarIndex = await readFile(join(ROOT, 'design', 'diagram-grammars', 'README.md'), 'utf8')
  const row = /\| `dg-bar` \|[^\n]*/.exec(grammarIndex)?.[0] ?? ''
  check('dg-bar: the grammar index describes both directions',
    /upward/.test(row) && /rightward/.test(row),
    'the index still promises one direction, so anyone drawing a column chart from it is misled')
}

// ── a skip must never strand content half-faded ─────────────────────────────
//
// `End` means "show me the rest of this page". It used to be obeyed the instant
// it was pressed, and both of the moments a reader is most likely to press it
// were broken:
//
//   DURING a turn — the tweens it started belonged to the OUTGOING spread's
//   context, which is reverted the moment the turn lands. Whatever they were
//   animating stopped where it was: measured at opacity 0.1969, permanently, on
//   a fishbone whose labels were present in the DOM and invisible on the page.
//
//   JUST AFTER one — a second timeline layered over the arrival timeline still
//   in flight, both owning the same targets, and the loser stopped mid-fade.
//
// Entrance animation must FAIL VISIBLE. This failed invisible, and it took four
// photographs of a "broken" diagram before the diagram turned out to be fine.
{
  const runtime = await readFile(join(ROOT, 'src', 'runtime', 'book.ts'), 'utf8')
  const body = /function finishSteps\(\)[\s\S]*?\n  \}/.exec(runtime)?.[0] ?? ''
  check('skip: a skip pressed mid-turn is held, not thrown away',
    /if \(turning\(\)\) \{ heldIntent = 'finish'/.test(body),
    'End acts while the leaf is in the air — its tweens die with the outgoing context')
  check('skip: the arriving spread spends a held skip',
    /heldIntent === 'finish'/.test(runtime.replace(body, '')),
    'the intent is held and never consumed, so pressing skip mid-turn does nothing at all')
  check('skip: it completes the arrival timeline before starting its own',
    /revealTl\?\.progress\(1\)/.test(body),
    'a second timeline is layered over one still running — whatever they share stops mid-fade')
}

console.log(`\n  ${passed} passed, ${failed} failed\n`)
await rm(TMP, { recursive: true, force: true })
process.exit(failed === 0 ? 0 : 1)
