#!/usr/bin/env node
/**
 * build.ts — Markdown in, one standalone HTML presentation out.
 *
 *   node src/build.ts content/lesson.md output/lesson.html                 (pictures inside the file)
 *   node src/build.ts content/lesson.md output/lesson.html --assets folder (pictures in ./assets/)
 *
 * THE ONE SETTING is `--assets`. It changes nothing about how the book is
 * written, parsed or rendered — only what `AssetStore.resolve()` returns at the
 * final step. Everything before that point deals in `asset:<key>` references.
 */

import { readFileSync } from 'node:fs'
import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { AssetStore, MissingAssetError, type AssetMode } from './assets.ts'
import { createRenderer, splitFrontmatter } from './markdown.ts'
import { buildPages, renderBook, type BookMeta } from './book.ts'
import { auditPalette, buildPalette, bookCss, contrast, loadTheme, scaleCss, themeCss } from './theme.ts'
import { fontFaceCss } from './fonts.ts'
import { markSvg } from './svg.ts'
import { LAYOUTS } from './layout.ts'

// `import.meta.url` + fileURLToPath, NOT `import.meta.dir` — the latter is a Bun
// extension and does not exist in Node, where it arrives as undefined and takes
// the process down inside path.resolve() before the build has read a single
// file. This is the portable spelling and it works in both.
const SKILL_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/**
 * Read from package.json rather than restated here, so `--version` cannot
 * disagree with the package it shipped in. `..` from the module resolves to the
 * skill root from BOTH `src/build.ts` and `dist/build.mjs`, which is why the
 * same expression serves the source and the bundled builder.
 *
 * Falls back rather than throwing: a missing package.json is a reason to be
 * vague about the version, not a reason to refuse to build a book.
 */
const PKG_VERSION: string = (() => {
  try {
    return (JSON.parse(readFileSync(join(SKILL_ROOT, 'package.json'), 'utf8')) as { version?: string })
      .version ?? 'unknown'
  } catch { return 'unknown' }
})()

interface Options {
  input: string
  output: string
  mode: AssetMode
  themePath: string
  quiet: boolean
  watch: boolean
}

/**
 * Printed by `--version`. The layout count is READ FROM THE CODE, not restated:
 * a version number tells you nothing about whether the copy you are reading has
 * the layouts you expect, and that is the question people actually have.
 */
function version(): void {
  // `--version --json` for a caller that is going to branch on the answer.
  // The layout list is the point of the flag, so it is in both forms.
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify({ name: 'tell-your-story', version: PKG_VERSION, layouts: LAYOUTS }, null, 2))
    return
  }
  console.log(`
  tell-your-story ${PKG_VERSION}
  ${LAYOUTS.length} layouts · ${LAYOUTS.join(' · ')}

  Newest release and how to update:
  https://github.com/bludiesel/tell-your-story#keeping-it-up-to-date
`)
}

function parseArgs(argv: string[]): Options {
  const positional: string[] = []
  let mode: AssetMode = 'inline'
  let themePath = join(SKILL_ROOT, 'theme.json')
  let quiet = false
  let watch = false

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--assets') {
      const value = argv[++i]
      if (value !== 'inline' && value !== 'folder') {
        exit(`--assets must be "inline" or "folder", got ${value ?? '(nothing)'}`)
      }
      mode = value
    } else if (arg === '--theme') {
      themePath = resolve(argv[++i] ?? '')
    } else if (arg === '--watch') {
      watch = true
    } else if (arg === '--quiet') {
      quiet = true
    } else if (arg === '--version' || arg === '-v' || arg === '-V') {
      // WHAT HAVE I ACTUALLY GOT? A skill installed by cloning is updated by
      // pulling, and a skill installed as a plugin is updated by updating the
      // plugin — so "I pulled and nothing changed" is a real and confusing
      // failure. One command that prints the version and the layout count
      // settles it in a second, without the reader having to know where the
      // copy being read actually lives.
      version(); process.exit(0)
    } else if (arg === '--help' || arg === '-h') {
      usage(); process.exit(0)
    } else if (arg.startsWith('-')) {
      exit(`unknown option: ${arg}`)
    } else {
      positional.push(arg)
    }
  }

  if (positional.length < 1) { usage(); process.exit(1) }
  const input = resolve(positional[0])
  const output = resolve(positional[1] ?? input.replace(/\.mdx?$/i, '.html'))
  return { input, output, mode, themePath, quiet, watch }
}

function usage(): void {
  console.log(`
  Build a standalone HTML flipbook from a Markdown file.

    node src/build.ts <input.md> [output.html] [options]

  Options
    --watch            rebuild whenever the lesson or the theme changes
    --assets inline    pack pictures INSIDE the HTML file        (default)
    --assets folder    put pictures in an ./assets/ folder beside it
    --theme <path>     theme.json to use            (default: skill root)
    --quiet            only print the result line
    --version          which copy this is, and every layout it knows about

  Pick 'inline' when you want one thing to send and don't mind the size.
  Pick 'folder' when the book is picture-heavy and stays in one place.
`)
}

function exit(message: string): never {
  console.error(`\n  Error: ${message}\n`)
  process.exit(1)
}

/**
 * page-flip ships its stylesheet as a source file rather than bundling it into
 * its JavaScript, so it has to be read from somewhere. Vendored copy first, the
 * package second — same shelf-then-toolchain rule as the runtime bundle.
 */
async function pageFlipCss(): Promise<string> {
  const shelf = join(SKILL_ROOT, 'assets', 'pageflip.css')
  try { return await readFile(shelf, 'utf8') } catch { /* fall through */ }
  return await readFile(
    join(SKILL_ROOT, 'node_modules/page-flip/src/Style/stPageFlip.css'), 'utf8')
}

/**
 * The runtime JavaScript that gets inlined into the book.
 *
 * OFF THE SHELF FIRST. `assets/runtime.bundle.js` is committed, so the common
 * case — someone running this skill to make a book — does not need the three
 * animation libraries on disk at all. It reads a file.
 *
 * Bundling live is the DEVELOPMENT path, taken only when the shelf copy is
 * absent. It needs esbuild and `node_modules`, which are fine here and are not
 * fine in a colleague's sandbox — the entire reason for the split.
 *
 * If the shelf copy is stale, `node scripts/check.ts` says so. It deliberately does not
 * rebuild silently: a build that quietly regenerates the bundle would need the
 * toolchain again, which would undo the point.
 */
async function bundleRuntime(): Promise<string> {
  const shelf = join(SKILL_ROOT, 'assets', 'runtime.bundle.js')
  try {
    return await readFile(shelf, 'utf8')
  } catch { /* not built yet — fall through to bundling it live */ }

  const bun = (globalThis as { Bun?: { build: (o: unknown) => Promise<any> } }).Bun
  if (!bun) {
    exit(
      `the runtime bundle is missing and cannot be rebuilt here.\n` +
      `  expected: ${shelf}\n` +
      `  fix:      run "node scripts/prebundle.ts" on a machine with Bun, and commit the result.\n` +
      `  why:      building it needs Bun and the animation libraries; USING it needs neither.`,
    )
  }
  const result = await bun.build({
    entrypoints: [join(SKILL_ROOT, 'src/runtime/book.ts')],
    target: 'browser',
    minify: true,
  })
  if (!result.success) {
    exit(`could not bundle the book runtime:\n${result.logs.join('\n')}`)
  }
  return await result.outputs[0].text()
}

/**
 * `</script>` inside inlined JS would close the tag early and break the file.
 * Splitting the literal keeps it out of our own bundle too — the same rule
 * bento learned the hard way and made hard rule #1.
 */
const SCRIPT_CLOSE = '</scr' + 'ipt>'
const escapeForScriptTag = (js: string) => js.replaceAll(SCRIPT_CLOSE, '<\\/script>')

/**
 * Substitute a placeholder with generated code.
 *
 * MUST use the function form of `replace`. A minified bundle contains `$&`
 * (six times, in ours), and in a *string* replacement `$&` means "insert the
 * matched text" — so the placeholder gets pasted back into the middle of the
 * script and the page dies with "__JS__ is not defined". The function form
 * treats the replacement as literal text.
 */
const injectScript = (html: string, placeholder: string, js: string) =>
  html.replace(placeholder, () => escapeForScriptTag(js))



/**
 * The exact placeholder strings the templates ship.
 *
 * GENERATED from templates/starter.md and templates/LAYOUTS.md — regenerate with
 * `node scripts/check.ts`, which fails if the templates introduce one that is not here.
 * Embedded rather than read at build time because a distributed skill may ship
 * without its templates, and the guard has to work anyway.
 */
const TEMPLATE_PLACEHOLDERS = new Set([
  "[WHAT THEY ARE CONFIRMING]",
  "[FIRST THING TO CONFIRM]",
  "[SECOND THING]",
  "[THIRD THING]",
  "[WHAT THE PROCEDURE IS]",
  "[FIRST ACTION]",
  "[SECOND ACTION]",
  "[THIRD ACTION]",
  "[WHAT THE RULE IS ABOUT]",
  "[THE RIGHT WAY]",
  "[ANOTHER RIGHT WAY]",
  "[THE WRONG WAY]",
  "[ANOTHER WRONG WAY]",
  "[WHAT THE THING IS]",
  "[FIRST PART]",
  "[SECOND PART]",
  "[THIRD PART]",
  "[ONE OR TWO SHORT PARAGRAPHS ABOUT WHAT THE DRAWING SHOWS.]",
  "[A NOTE IN THE MARGIN]",
  "[A PARAGRAPH THE ASIDE BELONGS TO.]",
  "[A PARAGRAPH.]",
  "[A SECOND PARAGRAPH IF YOU NEED ONE.]",
  "[A SECOND PARAGRAPH.]",
  "[A SHORT INTRODUCTION TO WHATEVER FOLLOWS.]",
  "[A note in a human voice, stuck onto the paragraph above.]",
  "[A shortcut, a good habit, something that makes the job easier.]",
  "[AND A SECOND, LOWER DOWN]",
  "[Anything where getting it wrong hurts someone or breaks something.]",
  "[BOOK TITLE]",
  "[BRACKETED]",
  "[CAPTION, PRINTED OVER THE PICTURE]",
  "[CELL]",
  "[COLUMN]",
  "[DESCRIPTION FOR SCREEN READERS]",
  "[EYEBROW — 2 OR 3 WORDS]",
  "[EYEBROW]",
  "[FILE]",
  "[FIRST PARAGRAPH. Two or three sentences.]",
  "[FIRST SECTION]",
  "[HEADING CONTINUED]",
  "[HEADING]",
  "[HOW IT WAS.]",
  "[HOW THIS WAS MADE, in a sentence or two.]",
  "[LABEL]",
  "[LEFT-HALF]",
  "[LEFT-HAND COLUMN.]",
  "[NOTE TITLE]",
  "[NUMBER]",
  "[ONE OR TWO SENTENCES ON WHAT THIS COVERS AND HOW LONG IT TAKES.]",
  "[ONE SENTENCE. If it needs two, it is not a statement.]",
  "[ONE SHORT PARAGRAPH, OR NONE.]",
  "[OPENING HEADING]",
  "[RIGHT-HALF]",
  "[RIGHT-HAND COLUMN, the same weight as the first.]",
  "[SECOND PARAGRAPH.]",
  "[SECOND SECTION]",
  "[SHORT TITLE FOR THE SPINE]",
  "[SMALL HAND-SET LINE, e.g. chapter one]",
  "[SMALL HAND-SET LINE]",
  "[SOMETHING IN CAPITALS]",
  "[STAGE]",
  "[STEP]",
  "[Something worth knowing, typeset into the page.]",
  "[Something worth knowing.]",
  "[THE ARGUMENT THIS BOOK IS BUILDING TO.]",
  "[THE ARGUMENT.]",
  "[THE NARROW COLUMN OF TEXT.]",
  "[THE ONE LINE YOU WANT THEM TO LEAVE WITH.]",
  "[THE PARAGRAPH THE NOTE IS STUCK TO.]",
  "[THE QUOTED SENTENCE.]",
  "[THIRD SECTION]",
  "[TIME OR DATE]",
  "[TITLE]",
  "[The note, in a human voice.]",
  "[The one thing to remember from this page. It lands last.]",
  "[The single thing that must survive everything else on this page.]",
  "[WHAT HAPPENED]",
  "[WHO IT IS FOR, three or four words]",
  "[YOUR BRAND · WHAT THIS IS]",
  "[YOUR BRAND]",
])

/**
 * --watch, as a re-exec rather than a loop inside the builder.
 *
 * Authoring was edit, switch window, run the build, reload. The build takes
 * about a fifth of a second, so the typing was never the cost — the ceremony
 * was.
 *
 * Each rebuild is a FRESH PROCESS on purpose. The builder holds real state
 * across a run: an AssetStore interning by content hash, a markdown-it instance
 * with registered containers, a parsed theme. Re-running it in-process would
 * mean auditing every one of those for reuse, and the first thing to go stale
 * would be something quiet like a cached font buffer. A subprocess cannot carry
 * anything over, so what you see is exactly what a cold `node dist/build.mjs`
 * would produce — which is the only thing worth watching for.
 *
 * Watched: the lesson, its theme, and the directory the lesson lives in, so a
 * picture dropped in beside it counts too. Debounced, because an editor writing
 * a file fires several events and a half-written Markdown file builds badly.
 */
async function watchAndRebuild(opts: Options): Promise<never> {
  const { watch } = await import('node:fs')
  const { spawn } = await import('node:child_process')
  const args = process.argv.slice(2).filter((a) => a !== '--watch')

  let timer: ReturnType<typeof setTimeout> | undefined
  let running = false
  // An edit made DURING a rebuild must not be lost. Dropping it was the first
  // version and it is the worst possible behaviour for a watcher: you save,
  // nothing appears, and you cannot tell whether the tool is slow or broken.
  // One pending rebuild is remembered and run on completion — coalesced, so ten
  // saves during one build still cost exactly one more build.
  let pending = false
  const rebuild = () => {
    if (running) { pending = true; return }
    running = true
    const started = Date.now()
    const child = spawn(process.execPath, [process.argv[1]!, ...args], { stdio: 'inherit' })
    child.on('exit', (code) => {
      running = false
      const stamp = new Date().toTimeString().slice(0, 8)
      console.log(code === 0
        ? `  ${stamp}  rebuilt in ${Date.now() - started}ms — reload the page`
        : `  ${stamp}  build failed (exit ${code}) — the last good book is untouched`)
      if (pending) { pending = false; rebuild() }
    })
  }

  // IGNORE WHAT WE OURSELVES WROTE, OR THE WATCHER EATS ITS OWN TAIL.
  // Watching the lesson's directory is what picks up a picture dropped in
  // beside it — and when the book is written into that same directory, as it
  // usually is, the write retriggers the watch. Measured: one edit produced
  // twenty rebuilds, each one starting the next.
  const ours = new Set([basename(opts.output), basename(opts.output) + '.map'])
  const nudge = (_event: unknown, filename: string | Buffer | null) => {
    const name = typeof filename === 'string' ? filename : filename?.toString()
    if (name && (ours.has(name) || name.startsWith('assets/'))) return
    clearTimeout(timer)
    timer = setTimeout(rebuild, 250)
  }
  for (const path of [opts.input, opts.themePath, dirname(opts.input)]) {
    try { watch(path, nudge) } catch { /* a theme beside the skill may not be watchable */ }
  }

  console.log(`\n  watching ${basename(opts.input)} — Ctrl-C to stop`)
  rebuild()
  return new Promise<never>(() => {}) // hold the process open
}

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2))
  if (opts.watch) await watchAndRebuild(opts)
  const log = (msg: string) => { if (!opts.quiet) console.log(msg) }

  let source: string
  try {
    source = await readFile(opts.input, 'utf8')
  } catch {
    exit(`cannot read ${opts.input}`)
  }

  const { fm, body } = splitFrontmatter(source)
  const baseDir = dirname(opts.input)
  const store = new AssetStore()
  const md = createRenderer()

  const theme = await loadTheme(opts.themePath)
  const palette = buildPalette(theme)

  // ── build the book ──────────────────────────────────────────────────────
  {
    // Diagram colours are passed in rather than read from CSS: svg.ts runs in
    // Node, where there is no cascade to read a custom property from.
    const pages = await buildPages(body, md, store, baseDir, {
      node: palette.paper2,
      nodeEdge: palette.paperEdge3,
      link: palette.inkSoft,
      text: palette.ink,
      accent: palette.accentInk,
    })
    if (pages.length === 0) exit('that file produced no pages — separate pages with a --- line')

    // THE COVER MARK IS GENERATED, NOT A SHIPPED FILE.
    //
    // It used to be `assets/mark.svg`, a static file with the accent colour and
    // the monogram "YB" baked into it. Both were wrong for anyone who rebranded:
    // the mark kept the kit's original amber on a palette that had moved to
    // teal — and the design is explicit that a warm metal on this arc is the one
    // thing that breaks it — while the initials ignored `brand.name` completely.
    // Neither failed anything; the book simply carried someone else's logo.
    //
    // So it is drawn from the palette, like every other mark in the kit, and a
    // real logo arrives by pointing `brand.mark` at a file.
    let markHtml = ''
    let markRef = ''
    const customMark = theme.brand?.mark
    // node:fs, not Bun.file — this was the last Bun-only call on the build path,
    // and one of them is enough to make the whole skill require Bun.
    if (customMark) {
      const abs = resolve(dirname(opts.themePath), customMark)
      if (!(await access(abs).then(() => true, () => false))) {
        exit(`theme.json brand.mark points at "${customMark}", which is not there\n` +
          `  looked in: ${abs}`)
      }
      markRef = await store.add(basename(abs), dirname(abs), 'the book cover')
    } else {
      // Initials from the brand name, so "Acme Gas" marks the book AG rather
      // than carrying whatever the kit shipped with.
      const monogram = (theme.brand?.name ?? '')
        .split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join('')
      markRef = store.addBytes(
        new TextEncoder().encode(markSvg({
          monogram: monogram || 'YB',
          accent: palette.accent,
          ink: palette.text,
          plate: palette.surface,
          label: theme.brand?.name,
        })),
        '.svg', 'mark.svg', 'the book cover',
      )
    }
    markHtml = `<img src="${markRef}" alt="">`

    const meta: BookMeta = {
      title: fm.title as string | undefined,
      subtitle: fm.subtitle as string | undefined,
      spine: (fm.spine as string) ?? (fm.title as string),
      hint: fm.hint as string | undefined,
      footer: fm.footer as string | undefined,
      curtainEyebrow: (fm.curtain_eyebrow as string) ?? (fm.eyebrow as string),
      curtainTitle: (fm.curtain_title as string) ?? (fm.title as string),
      curtainText: fm.curtain_text as string | undefined,
      curtainHint: fm.curtain_hint as string | undefined,
      // The curtain photo is an ordinary picture: same store, same dedup, and
      // it obeys --assets inline|folder like everything else.
      curtainPhoto: fm.curtain_photo
        ? await store.add(String(fm.curtain_photo), baseDir, 'the curtain')
        : undefined,
      // Presenting is the default posture of this kit, so blocks arrive one at a
      // time unless the author says otherwise. `steps: false` hands the whole
      // page over at once, for material meant to be read alone.
      steps: fm.steps !== false,
      typing: fm.typing === true,
    }

    const rendered = renderBook({
      pages, meta, markHtml,
      themeBlock: await fontFaceCss(SKILL_ROOT) + '\n' + themeCss(palette, theme.fonts) +
        // The scales go with the palette, before any stylesheet that reads them.
        // Order is load-bearing: book.css computes several of its own tokens FROM
        // these, and a `calc()` over an undeclared name yields nothing at all.
        '\n' + scaleCss(theme),
      bookBlock: bookCss(palette, theme.fonts, markRef),
      // page-flip's own stylesheet, from the vendored copy. It used to be read
      // straight out of node_modules, which quietly made the whole library a
      // build-time requirement even though its JavaScript is already inside the
      // committed bundle — the one file left holding the 80 MB install in place.
      // ORDER IS THE CONTRACT. layouts.css comes LAST because 23 of its
      // selectors also live in book.css — type sizes, the hand-set faces, the
      // page rhythm — and the design specification is the authority on those.
      // It wins by cascade position rather than by `!important`, which keeps
      // both files readable and leaves book.css owning everything the
      // catalogue does not speak to.
      css: await pageFlipCss()
         + '\n' + await readFile(join(SKILL_ROOT, 'src/runtime/book.css'), 'utf8')
         + '\n' + await readFile(join(SKILL_ROOT, 'src/runtime/curtain.css'), 'utf8')
         + '\n' + await readFile(join(SKILL_ROOT, 'src/runtime/layouts.css'), 'utf8'),
    })
    let bookHtml = injectScript(rendered.html, '__JS__', await bundleRuntime())

    const missing = store.danglingRefs(bookHtml)
    if (missing.length > 0) exit(`these pictures are referenced but missing: ${missing.join(', ')}`)

    bookHtml = store.resolveAll(bookHtml, opts.mode)

    await mkdir(dirname(opts.output), { recursive: true })
    // ── THE BUILD REFUSES AN UNFINISHED BOOK ────────────────────────────
    //
    // This lived in `check` and therefore protected nothing: `check` builds the
    // sample that ships with the skill, never the book an author just wrote. So
    // the guarantee SKILL.md advertised — that a forgotten placeholder cannot
    // ship — was true of one file nobody sends anybody, and false of every book
    // a real person makes. A safety claim that holds only for the test case is
    // worse than no claim, because it stops people looking.
    //
    // It belongs at the moment of writing, where it applies to whatever is
    // actually being written. Anchored to the words the templates use rather
    // than to the bracket shape alone, so a book that legitimately prints
    // bracketed capitals — an acronym gloss, a citation marker — still builds.
    // MATCHED AGAINST THE TEMPLATES THEMSELVES, not against a shape.
    //
    // The first version matched any bracketed capitals containing a word like
    // NUMBER or TIME, and that blocked things it had no business blocking:
    // [LOCAL EMERGENCY NUMBER] and [HOLD TIME IN MINUTES] are exactly the
    // deliberate fill-in markers a careful author uses for a site-specific
    // value they refuse to invent. Every one of the baseline runs reached for
    // that pattern unprompted, and on safety material it is the RIGHT
    // instinct — refusing it would push someone to make an emergency number up
    // rather than leave it visibly blank.
    //
    // So the guard knows the exact strings the templates ship and objects to
    // those alone. An author's own marker passes; a forgotten [BOOK TITLE] does
    // not. A check keeps this list in step with the templates.
    const leaked = [...new Set(
      [...bookHtml.matchAll(/\[[A-Z][^\]\n]{1,70}\]/g)].map((m) => m[0])
        .filter((s) => TEMPLATE_PLACEHOLDERS.has(s)),
    )]
    if (leaked.length > 0) {
      exit(
        `this book still contains ${leaked.length} template placeholder${leaked.length > 1 ? 's' : ''}:\n` +
        leaked.slice(0, 12).map((s) => `    ${s}`).join('\n') +
        (leaked.length > 12 ? `\n    ...and ${leaked.length - 12} more` : '') +
        '\n\n  Replace them, or delete the page that carries them. Nothing was written.',
      )
    }

    await writeFile(opts.output, bookHtml, 'utf8')
    const bookReport = await store.writeFolder(dirname(opts.output), opts.mode)

    // The contrast audit belongs to the THEME, not to any one output, so it
    // survived the removal of the slide format rather than going with it. A low-contrast warning is the difference between an author
    // finding out now and a trainee finding out on a projector.
    // A WARNING WITH NO REMEDY IS JUST A COMPLAINT.
    //
    // This printed `! low contrast 4.13:1` and carried on, while the docs said
    // contrast "is auto-corrected" — which is true only for text on PAPER,
    // where a colour can be darkened until it clears. On the dark stage the
    // correction would have to go the other way, and lightening a brand colour
    // changes it into a different colour, which is not a decision a build gets
    // to make on someone's behalf.
    //
    // So it says which of the two situations this is, and what to do. A brand
    // colour whose own best case is still short of the bar is not an author
    // error; it is a fact about the colour, and they should hear it as one
    // rather than go reading theme.ts to work out why nothing changed.
    if (!opts.quiet) {
      for (const f of auditPalette(palette, theme.a11y?.min_contrast ?? 4.5).filter((r) => !r.pass)) {
        log(`  ! low contrast ${f.ratio}:1 — ${f.label} (${f.fg} on ${f.bg})`)
        const floor = theme.a11y?.min_contrast ?? 4.5
        if (/on dark/.test(f.label)) {
          // The best this colour could manage against pure black — the most
          // generous background the stage can offer it. If even that falls
          // short, no choice of background rescues it and the author should
          // hear that as a fact about the colour rather than as their mistake.
          const ceiling = contrast(f.fg, '#000000')
          log(ceiling < floor
            ? `      ${f.fg} cannot reach ${floor}:1 on ANY dark background — ` +
              `${ceiling.toFixed(2)}:1 against pure black is its ceiling.\n` +
              '      Keep it for chrome and rules, and set colors.accent_bright to a lighter\n' +
              '      relative for anything that has to be READ on the stage.'
            : '      Only text on PAPER is corrected automatically — there a colour can be\n' +
              '      darkened until it clears. On the dark stage the fix is the other way, and\n' +
              '      lightening your brand colour is your decision rather than the build\'s:\n' +
              '      set colors.accent_bright to a lighter relative.')
        } else if (/accent fill/.test(f.label)) {
          // A different problem with the same symptom: this is the label colour
          // printed ON the accent, so the fill is what has to move, not the
          // background behind it.
          log(`      This is text printed ON the accent, so the fill is what has to give.\n` +
              `      Either lighten colors.accent until ${f.fg} clears ${floor}:1 on it, or set\n` +
              '      colors.text_on_dark to something lighter for anything that sits on a fill.')
        }
      }
    }

    log('')
    log(`  ${opts.output}`)
    log(`  ${rendered.pageCount} leaves (${Math.ceil(rendered.pageCount / 2)} spreads` +
        `${rendered.sectionCount ? `, ${rendered.sectionCount} sections` : ''})  ·  ` +
        `${(Buffer.byteLength(bookHtml) / 1024).toFixed(0)} KB  ·  ${AssetStore.describe(bookReport)}`)
    log(opts.mode === 'inline'
      ? '  Everything is in that one file. Send it anywhere.'
      : '  Send the .html AND the assets folder together, or the pictures break.')
    log('')
    return
  }

}

// A missing picture is an ordinary authoring mistake, not a crash: show the
// message we wrote for it, not a stack trace the author cannot act on.
try {
  await main()
} catch (err) {
  if (err instanceof MissingAssetError) exit(err.message)
  throw err
}
