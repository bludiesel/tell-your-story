#!/usr/bin/env node
/**
 * doctor.ts — is this book finished?
 *
 * ONE QUESTION, ONE ANSWER. Everything this runs already existed as its own
 * command, and that was the problem: an assistant finishing a job had to run
 * `prep`, then `build`, then `motion`, read three different prose reports, and
 * decide for itself whether the combination meant "ready". Three judgement
 * calls where there should be none, and every one of them a chance to declare
 * a book finished that is not.
 *
 * So this asks all of it and returns a verdict. `--json` for a caller that is
 * going to branch on the answer; the printed version for a person.
 *
 *   node dist/doctor.mjs content/lesson.md
 *   node dist/doctor.mjs content/lesson.md --json
 *
 * WHAT IT DELIBERATELY DOES NOT DO. It never judges the WRITING. Whether a
 * paragraph is clear, whether a layout suits its content, whether the material
 * is worth teaching — those are meaning, and a model reading the lesson does
 * them better than any exit code. This checks what is countable: capacity,
 * structure, whether the thing builds, whether it moves correctly, and whether
 * anything got left behind. A green result means nothing is BROKEN. It does not
 * mean the book is good.
 */

import { execFile } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdtemp, rm, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const run = promisify(execFile)
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/** Prefer the bundled command, exactly as a user without node_modules would. */
const tool = (bundled: string, source: string): string => {
  const b = join(ROOT, 'dist', bundled)
  return existsSync(b) ? b : join(ROOT, source)
}

interface Check {
  name: string
  ok: boolean
  detail: string
  /** What to do about it, when it is not ok. Empty when there is nothing to do. */
  fix?: string
}

interface PrepFinding { where: string; severity: string; what: string; do: string }
interface PrepOut { pages: Array<{ n: number; budget: number }>; findings: PrepFinding[] }
interface MotionOut { pages: Array<{ turn: string; reveal: string; problems: string[] }>; problems: number }

const kb = (n: number) => `${Math.round(n / 1024)} KB`

async function main(): Promise<void> {
  const argv = process.argv.slice(2)
  const asJson = argv.includes('--json')
  const input = argv.find((a) => !a.startsWith('-'))
  if (!input) {
    console.error('usage: node dist/doctor.mjs <lesson.md> [--json]')
    process.exit(1)
  }
  const lesson = resolve(input)
  const checks: Check[] = []
  const node = process.execPath
  const dir = await mkdtemp(join(tmpdir(), 'tys-doctor-'))
  const out = join(dir, 'book.html')

  try {
    // ── 1. is it chunked like a book? ────────────────────────────────────
    let prep: PrepOut | null = null
    try {
      const { stdout } = await run(node, [tool('prep.mjs', 'scripts/prep.ts'), lesson, '--json'])
      prep = JSON.parse(stdout) as PrepOut
    } catch (e) {
      checks.push({ name: 'chunking', ok: false, detail: 'prep could not read the lesson',
        fix: (e as Error).message.split('\n')[0] ?? '' })
    }
    if (prep) {
      // `fix` findings are defects. `consider` ones are opinions, and a book is
      // not unfinished for disagreeing with an opinion — they are reported and
      // do not fail the verdict.
      const must = prep.findings.filter((f) => f.severity === 'fix' || f.severity === 'stop')
      const maybe = prep.findings.filter((f) => !(f.severity === 'fix' || f.severity === 'stop'))
      checks.push({
        name: 'chunking',
        ok: must.length === 0,
        detail: must.length === 0
          ? `${prep.pages.length} pages, nothing over capacity`
          : `${must.length} thing(s) to fix across ${prep.pages.length} pages`,
        fix: must.map((f) => `${f.where}: ${f.what}`).join('\n                '),
      })
      if (maybe.length > 0) {
        checks.push({ name: 'suggestions', ok: true,
          detail: `${maybe.length} thing(s) prep would consider — opinions, not defects`,
          fix: maybe.map((f) => `${f.where}: ${f.what}`).join('\n                ') })
      }
    }

    // ── 2. does it build? ────────────────────────────────────────────────
    // The placeholder guard lives inside the builder, so a template still
    // carrying [BRACKETS] fails HERE rather than needing a check of its own.
    let built = false
    try {
      await run(node, [tool('build.mjs', 'src/build.ts'), lesson, out, '--quiet'])
      const size = (await stat(out)).size
      built = true
      checks.push({ name: 'build', ok: true, detail: `${kb(size)}, one standalone file` })
    } catch (e) {
      const msg = (e as { stdout?: string; stderr?: string }).stdout
        ?? (e as { stderr?: string }).stderr ?? (e as Error).message
      checks.push({ name: 'build', ok: false, detail: 'the book did not build',
        fix: msg.trim().split('\n').slice(0, 6).join('\n                ') })
    }

    // ── 3. does it move correctly? ───────────────────────────────────────
    if (built) {
      try {
        const { stdout } = await run(node, [tool('motion.mjs', 'scripts/motion.ts'), out, '--json'])
        const m = JSON.parse(stdout) as MotionOut
        const presses = m.pages.reduce((n, p) => {
          const found = /(\d+) step/.exec(p.reveal)
          return n + (found ? Number(found[1]) : 0)
        }, 0)
        checks.push({
          name: 'motion',
          ok: m.problems === 0,
          detail: `${m.pages.length} pages, ${presses} presses to walk it`,
          fix: m.pages.flatMap((p) => p.problems).join('\n                '),
        })
      } catch (e) {
        checks.push({ name: 'motion', ok: false, detail: 'could not read the built book',
          fix: (e as Error).message.split('\n')[0] ?? '' })
      }
    }

    const failed = checks.filter((c) => !c.ok)

    if (asJson) {
      console.log(JSON.stringify({ ok: failed.length === 0, checks }, null, 2))
      process.exit(failed.length === 0 ? 0 : 1)
    }

    console.log('')
    for (const c of checks) {
      console.log(`  ${c.ok ? '✓' : '✗'} ${c.name.padEnd(14)}${c.detail}`)
      if (c.fix) for (const line of c.fix.split('\n')) console.log(`                ${line.trim()}`)
    }
    console.log('')
    console.log(failed.length === 0
      ? '  Nothing is broken. Whether it is any GOOD is a question for a reader.'
      : `  ${failed.length} thing(s) to fix before this ships.`)
    console.log('')
    process.exit(failed.length === 0 ? 0 : 1)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

await main()
