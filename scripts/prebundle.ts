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
  console.log(`  ${BUNDLE_PATH}`)
  console.log(`  ${Math.round(Buffer.byteLength(js) / 1024)} KB · stamp ${await runtimeStamp()}`)
  console.log('  commit this — it is what makes the skill installable without Bun')
}
