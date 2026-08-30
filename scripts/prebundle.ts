#!/usr/bin/env node
/**
 * prebundle.ts — squeeze the browser runtime once, here, so nobody else has to.
 *
 * THE PROBLEM THIS SOLVES
 * The finished book carries three animation libraries inside it: GSAP,
 * page-flip and curtains.js. Until now they were fetched and squeezed together
 * on EVERY build, by every person who ever ran the skill, which cost them:
 *
 *   · 80 MB and 3,835 files of node_modules
 *   · Bun specifically, because the squeezing used `Bun.build()` — an API that
 *     does not exist in Node
 *
 * And the result of all that work is byte-for-byte identical every time. Nobody
 * gets a different copy of GSAP.
 *
 * So it happens once, here, and the result travels inside the skill. A colleague
 * running this in a Claude sandbox reads a file off the shelf instead of
 * rebuilding a mill.
 *
 * WHAT STAYS A DEPENDENCY: markdown-it and yaml, which are small, pure text
 * handling, and genuinely needed while a book is being built rather than while
 * it is being read. Those are a one-second first-run install, not eighty
 * megabytes.
 *
 *   node scripts/prebundle.ts          rebuild assets/runtime.bundle.js
 *
 * The bundle is COMMITTED. `node scripts/check.ts` fails if it is stale, because a
 * silently out-of-date runtime is the worst of both worlds: it builds happily
 * and ships last week's behaviour.
 */

import { createHash } from 'node:crypto'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const ROOT = join(here, '..')
export const BUNDLE_PATH = join(ROOT, 'assets', 'runtime.bundle.js')
export const STAMP_PATH = join(ROOT, 'assets', 'runtime.bundle.sha')

/**
 * Everything whose contents change what the runtime does. The stamp is taken
 * over the SOURCES rather than the output, because a bundler upgrade that
 * produces different bytes from identical sources is not a stale bundle — and
 * flagging it as one would train everybody to ignore the warning.
 */
export const RUNTIME_SOURCES = [
  'src/runtime/book.ts',
  'src/runtime/curtain.ts',
  'package.json', // a dependency version bump changes the runtime too
]

export async function runtimeStamp(root = ROOT): Promise<string> {
  const h = createHash('sha256')
  for (const rel of RUNTIME_SOURCES) h.update(await readFile(join(root, rel)))
  return h.digest('hex').slice(0, 16)
}

export const TOOLS_STAMP_PATH = join(ROOT, 'dist', 'tools.sha')
export const TOOLS_SOURCES_PATH = join(ROOT, 'dist', 'tools.sources')

/**
 * The stamp for `dist/`, taken over the exact files esbuild reported pulling in
 * (written to `dist/tools.sources` when the bundles are built) plus
 * `package.json`, since a dependency bump changes the tools too.
 *
 * Recorded rather than hand-listed so it cannot drift: add an import to
 * `src/build.ts` and the next bundle records it automatically, while editing a
 * file the tools do not touch never raises a false alarm.
 */
export async function toolsStamp(root = ROOT): Promise<string> {
  const h = createHash('sha256')
  let list: string[]
  try {
    list = (await readFile(join(root, 'dist', 'tools.sources'), 'utf8'))
      .split('\n').map((s) => s.trim()).filter(Boolean)
  } catch {
    return 'no-sources'
  }
  for (const rel of [...list, 'package.json']) {
    try { h.update(await readFile(join(root, rel))) } catch { h.update(`missing:${rel}`) }
  }
  return h.digest('hex').slice(0, 16)
}

// esbuild, NOT Bun.build.
//
// Bundling browser JavaScript needs a bundler in any language — that part is
// unavoidable. What IS avoidable is which one, and `Bun.build()` made this file
// the single reason the kit demanded a specific runtime. esbuild is a
// devDependency that runs anywhere, so the whole skill is now one language on
// one runtime, and Bun is something you may use because it is faster rather than
// something anybody has to install.
//
// `import.meta.main` is a Bun extension too; comparing argv[1] is the portable
// way to ask "was I run directly, or imported by the staleness check?".
const runDirectly = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])
if (runDirectly) {
  const { build } = await import('esbuild')
  const result = await build({
    entryPoints: [join(ROOT, 'src/runtime/book.ts')],
    bundle: true,
    format: 'iife',
    platform: 'browser',
    minify: true,
    write: false,
    legalComments: 'none',
  })
  const js = result.outputFiles![0]!.text
  await mkdir(dirname(BUNDLE_PATH), { recursive: true })
  await writeFile(BUNDLE_PATH, js)
  await writeFile(STAMP_PATH, await runtimeStamp())

  // page-flip ships its stylesheet as an unbundled source file, so the build was
  // reading it straight out of node_modules — one line that kept the entire
  // 80 MB install mandatory even though the library's JavaScript was already
  // inside the bundle above. Vendored here so it travels with the skill.
  await writeFile(
    join(ROOT, 'assets', 'pageflip.css'),
    await readFile(join(ROOT, 'node_modules/page-flip/src/Style/stPageFlip.css'), 'utf8'),
  )
  // The studio is a browser bundle too, and for the same reason: an author
  // opening it must not need an install. It is separate from the runtime
  // because nothing here ever travels inside a book — a reader gets pages, an
  // author gets the tool that made the pictures on them.
  const studio = await build({
    entryPoints: [join(ROOT, 'src/studio/studio.ts')],
    bundle: true,
    format: 'esm',
    platform: 'browser',
    minify: true,
    write: false,
    legalComments: 'none',
  })
  const studioJs = studio.outputFiles![0]!.text
  await writeFile(join(ROOT, 'assets', 'studio.bundle.js'), studioJs)

  console.log(`  ${BUNDLE_PATH}`)
  console.log(`  ${Math.round(Buffer.byteLength(js) / 1024)} KB · stamp ${await runtimeStamp()}`)
  console.log(`  assets/studio.bundle.js · ${Math.round(Buffer.byteLength(studioJs) / 1024)} KB`)
  console.log('  commit this — it is what makes the skill installable without Bun')

  // ── THE NODE-SIDE TOOLS, SO A READER NEEDS NO INSTALL EITHER ───────────
  //
  // The runtime bundle above removed the three animation libraries from a
  // user's disk. These remove the last four: markdown-it, linkedom, yaml and
  // svg.js are compiled into the builder here, so `node dist/build.mjs` works
  // in a folder with no node_modules at all. Verified byte-identical against
  // the installed path — same book, same SHA, the packages are simply linked
  // ahead of time rather than downloaded.
  //
  // `motion` comes too because it is the one QA tool an AUTHOR runs — it says
  // what moves on every page. `check`, `verify` and this script stay
  // install-only: they are for people changing the skill, not using it.
  //
  // THE REQUIRE SHIM IS LOAD-BEARING. `yaml`'s CommonJS build calls
  // `require('process')` internally. Bundled to ESM without this banner the
  // builder dies on its first line with "Dynamic require of process is not
  // supported" — and CJS output is not an option either, because build.ts uses
  // top-level await and import.meta.url.
  const NODE_BANNER =
    'import{createRequire as __cr}from"node:module";const require=__cr(import.meta.url);'
  const TOOLS = [
    { entry: 'src/build.ts', out: 'dist/build.mjs' },
    { entry: 'scripts/motion.ts', out: 'dist/motion.mjs' },
    // The studio generator is an AUTHOR's tool, like motion — it is how the
    // pictures in a book get made, so it cannot be install-only.
    { entry: 'scripts/build_studio.ts', out: 'dist/studio.mjs' },
    // And the headless one, for an assistant with no screen to drag a slider
    // on. Its two image codecs are pure JavaScript precisely so they can be
    // compiled in here and cost a user nothing.
    { entry: 'scripts/ink.ts', out: 'dist/ink.mjs' },
    // The one command that answers "is this finished?". It shells out to prep,
    // build and motion, so it has to ship wherever they do — an assistant that
    // can build a book but cannot ask whether the book is sound is exactly the
    // gap this exists to close.
    { entry: 'scripts/doctor.ts', out: 'dist/doctor.mjs' },
  ]

  await mkdir(join(ROOT, 'dist'), { recursive: true })
  // The stamp covers exactly what esbuild actually pulled in. Taking it from
  // the metafile rather than a hand-written list means a new import is covered
  // the moment it is added — and, just as important, editing a file the tools
  // do NOT depend on never raises a false alarm. A staleness warning people
  // learn to ignore is worse than none.
  const inputs = new Set<string>()
  for (const tool of TOOLS) {
    const built = await build({
      entryPoints: [join(ROOT, tool.entry)],
      bundle: true,
      format: 'esm',
      platform: 'node',
      target: 'node22',
      banner: { js: NODE_BANNER },
      metafile: true,
      write: false,
    })
    await writeFile(join(ROOT, tool.out), built.outputFiles![0]!.text)
    for (const file of Object.keys(built.metafile!.inputs)) {
      if (!file.includes('node_modules')) inputs.add(file)
    }
    const kb = Math.round(Buffer.byteLength(built.outputFiles![0]!.text) / 1024)
    console.log(`  ${tool.out} · ${kb} KB`)
  }
  await writeFile(TOOLS_SOURCES_PATH, [...inputs].sort().join('\n') + '\n')
  await writeFile(TOOLS_STAMP_PATH, await toolsStamp())
  console.log(`  dist/ stamp ${await toolsStamp()} over ${inputs.size} source files`)
  console.log('  commit dist/ too — it is what makes the skill need no npm install')
}
