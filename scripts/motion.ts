/**
 * motion.ts — what MOVES on each page, and whether that obeys the rules.
 *
 * `prep` answers "how should this content be chunked?" before a book exists.
 * This answers the question that comes after it: **given the book you just
 * built, what happens when the reader presses next?**
 *
 * It exists because the motion rules were previously only prose. SKILL.md says
 * boards do not animate; the runtime skips them; page-flip is told they are
 * rigid. Three separate places, agreeing today, with nothing checking that they
 * still agree tomorrow — and a board that quietly starts bending like paper, or
 * that eats a press waiting for a reveal nobody can see, is exactly the kind of
 * failure that looks fine in a screenshot and wrong in a room.
 *
 * So the rules live here, once, as data:
 *
 *   A HARD page (the cover, every section board) is punctuation, not argument.
 *   It turns rigid — a cover does not bend — and it shows everything at once.
 *   Staggering a number and a kicker onto a board turns a full stop into three
 *   events and makes the reader wait for something meant to be read at a glance.
 *
 *   A SOFT page is argument. It bends when it turns, and it arrives one block
 *   at a time so you can talk to a point while it is the only thing on the page.
 *
 *   node scripts/motion.ts output/book.html      # report + enforce
 *   node scripts/motion.ts content/book.md       # builds it first, then reports
 *   node scripts/motion.ts <path> --json         # machine-readable
 */

import { execFile } from 'node:child_process'
import { mkdtemp, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { parseHTML } from 'linkedom'

const run = promisify(execFile)
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

/**
 * Which layouts are printed on board stock. Hard is a PROPERTY OF THE PAPER, so
 * it decides both halves of the behaviour at once — how the leaf turns, and
 * whether its contents arrive in steps. Keeping one list means the two can
 * never drift apart, which is precisely what happened when they were separate.
 */
const HARD_LAYOUTS = new Set(['cover', 'divider'])

type PageReport = {
  index: number
  label: string
  layout: string
  stock: string
  density: string
  turn: 'rigid' | 'bends'
  reveal: 'all at once' | string
  blocks: number
  problems: string[]
}

function report(html: string): PageReport[] {
  const { document } = parseHTML(html)
  const pages = [...document.querySelectorAll('#book > .page')] as unknown as Array<{
    getAttribute(n: string): string | null
    classList: { contains(c: string): boolean }
    querySelector(s: string): { children: ArrayLike<unknown> } | null
  }>

  return pages.map((page, index) => {
    const layout = page.getAttribute('data-layout') ?? '(none)'
    const stock = page.getAttribute('data-stock') ?? '(none)'
    const density = page.getAttribute('data-density') ?? '(none)'
    const label = page.getAttribute('data-screen-label') ?? `page ${index + 1}`
    const blocks = page.querySelector('.reveal')?.children.length ?? 0
    const hard = HARD_LAYOUTS.has(layout)
    const problems: string[] = []

    // The stock has to match what the layout IS, or every rule below is being
    // applied to the wrong page.
    if (hard && stock !== 'hard') problems.push(`${layout} must be printed hard, is "${stock}"`)
    if (!hard && stock !== 'soft') problems.push(`${layout} must be printed soft, is "${stock}"`)

    // page-flip reads `density`, not `stock` — it compares the string literally
    // and treats anything that is not "hard" as soft. Emitting only our own name
    // is what once made every leaf in the book bend, covers included.
    if (density !== stock) problems.push(`data-density="${density}" disagrees with data-stock="${stock}" — page-flip reads density`)

    // A board's number, kicker and title live inside `.reveal` like any other
    // block — that is fine, and is how they get their hold released. What is
    // NOT fine is them counting as steps, which is asserted against the runtime
    // once, below, rather than guessed at per page.

    return {
      index: index + 1,
      label,
      layout,
      stock,
      density,
      turn: hard ? 'rigid' : 'bends',
      reveal: hard ? 'all at once' : `${blocks} step${blocks === 1 ? '' : 's'}`,
      blocks,
      problems,
    }
  })
}

async function main(): Promise<void> {
  const args = process.argv.slice(2).filter((a) => a !== '--json')
  const asJson = process.argv.includes('--json')
  const target = args[0]

  if (!target) {
    console.error('usage: node scripts/motion.ts <book.html | book.md> [--json]')
    process.exitCode = 2
    return
  }

  let htmlPath = target
  if (/\.(md|markdown)$/i.test(target)) {
    const dir = await mkdtemp(join(tmpdir(), 'motion-'))
    htmlPath = join(dir, 'book.html')
    await run(process.execPath, [join(ROOT, 'src', 'build.ts'), target, htmlPath], { cwd: ROOT })
  }

  const pages = report(await readFile(htmlPath, 'utf8'))

  // THE RULE ITSELF, CHECKED ONCE AGAINST THE ENGINE.
  //
  // Every board in the table below is reported as turning rigid and showing
  // everything at once. That claim is only true if the runtime excludes boards
  // from BOTH passes — the one that animates, and the one that counts presses.
  // It used to do only the first, so a reader pressing next on a board watched
  // nothing happen three times before the page turned. Asserted here rather
  // than trusted, because the report is worthless if it is describing a rule
  // the engine stopped following.
  const runtime = await readFile(join(ROOT, 'src', 'runtime', 'book.ts'), 'utf8')
  const stepFn = /function visibleBlocks\(\): HTMLElement\[\] \{([\s\S]*?)\n  \}/.exec(runtime)?.[1] ?? ''
  const revealFn = /const fresh = \[[\s\S]*?\n      \}\)/.exec(runtime)?.[0] ?? ''
  const excludes = (src: string) => /divider/.test(src) && /cover/.test(src)
  const enginePasses = excludes(stepFn) && excludes(revealFn)

  const broken = pages.filter((p) => p.problems.length > 0)
  if (!enginePasses) {
    broken.push({
      ...pages[0]!,
      index: 0,
      label: 'the engine',
      problems: [
        !excludes(stepFn)
          ? 'visibleBlocks() does not exclude boards — every board will eat a press per block'
          : 'the reveal pass does not exclude boards — boards will animate in',
      ],
    })
  }

  if (asJson) {
    console.log(JSON.stringify({ pages, problems: broken.length }, null, 2))
    if (broken.length) process.exitCode = 1
    return
  }

  const w = (s: string, n: number) => s.length > n ? s.slice(0, n - 1) + '…' : s.padEnd(n)
  console.log('')
  console.log(`  ${w('#', 4)}${w('PAGE', 30)}${w('LAYOUT', 13)}${w('TURN', 8)}REVEAL`)
  console.log(`  ${'─'.repeat(70)}`)
  for (const p of pages) {
    const mark = p.problems.length ? ' ✗' : ''
    console.log(`  ${w(String(p.index), 4)}${w(p.label, 30)}${w(p.layout, 13)}${w(p.turn, 8)}${p.reveal}${mark}`)
  }

  const hard = pages.filter((p) => p.turn === 'rigid')
  const steps = pages.reduce((n, p) => n + (p.turn === 'bends' ? p.blocks : 0), 0)
  console.log('')
  console.log(`  ${pages.length} pages · ${hard.length} rigid (no reveal, no bend) · ${steps} presses to walk the whole book`)

  if (broken.length) {
    console.log('')
    console.log('  MOTION RULES BROKEN:')
    for (const p of broken) for (const problem of p.problems) console.log(`    page ${p.index} (${p.label}): ${problem}`)
    process.exitCode = 1
  } else {
    console.log('  Every page obeys the motion rules.')
  }
}

await main()
