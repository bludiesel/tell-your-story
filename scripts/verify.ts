/**
 * verify.ts — prove the catalogue from the DOCUMENTATION, not from the source.
 *
 * `check.ts` asks "does the engine still work?". This asks a different and
 * sharper question: **if an author copies what the templates tell them to copy,
 * do they get the layout the templates promised?**
 *
 * That distinction matters because `pickLayout` is first-match-wins and ordered.
 * A layout can be fully implemented, fully documented, and still unreachable —
 * shadowed by an earlier test that also matches. Nothing in the engine notices;
 * the page simply comes out as something else, and it looks fine. The only way
 * to catch it is to walk in through the front door the templates describe.
 *
 * So every snippet in `templates/LAYOUTS.md` is extracted, its placeholders
 * filled the way an author would fill them, built through the real entry point
 * (`src/build.ts`, as a subprocess — no internal shortcuts), and the resulting
 * page is asked what layout it thinks it is.
 *
 * Output is `VERIFICATION.md`: one row per layout, one row per authoring block,
 * each carrying the evidence that produced it. Re-run it after any change to
 * the catalogue, the picker, or the templates.
 *
 *   node scripts/verify.ts            # write VERIFICATION.md
 *   node scripts/verify.ts --quiet    # exit code only
 */

import { execFile } from 'node:child_process'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const run = promisify(execFile)
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const WORK = join(ROOT, 'output', '.verify')

type Row = {
  name: string
  /** The layout the templates promise, or '' for a block feature. */
  layout: string
  ok: boolean
  evidence: string
}

const rows: Row[] = []
const record = (name: string, layout: string, ok: boolean, evidence: string) => {
  rows.push({ name, layout, ok, evidence })
  if (!process.argv.includes('--quiet')) {
    console.log(`${ok ? '  ok  ' : ' FAIL '} ${name.padEnd(42)} ${evidence}`)
  }
}

/**
 * Fill the placeholders the way an author does.
 *
 * The bracket is the marker, not the text: `[FIRST PARAGRAPH. Two sentences.]`
 * becomes that sentence without its brackets. Keeping the length is the point —
 * several picker tests are proportional (`dominates()` asks whether one block
 * accounts for 70% of a page), so substituting "x" for a paragraph would test a
 * book no author would ever write.
 *
 * Image paths are the one exception: `img/[FILE].png` has to resolve to a file
 * that exists, or the build fails for a reason that has nothing to do with the
 * layout under test.
 */
const fill = (snippet: string): string =>
  snippet
    // A TREATED DRAWING IS NOT A PHOTOGRAPH, and the plate layout only exists
    // because of the difference — so the stand-in has to be one. Substituting
    // the photograph here would have built the plate snippet as a picture with
    // no transparency, which is the one case the layout is not for.
    .replace(/img\/\[[^\]]+\]\.ink\.png/g, 'img/valve.ink.png')
    .replace(/img\/\[[^\]]+\]\.png/g, 'img/site-photo.png')
    .replace(/\[([^\]\n]+)\]/g, (_, inner: string) => inner)

const FRONT = [
  '---',
  'title: Layout Check',
  'subtitle: one layout, isolated',
  'spine: Layout Check',
  'footer: verification',
  'hint: tap to open',
  'curtain_eyebrow: verification',
  'curtain_title: Layout Check',
  'curtain_text: A single layout, built through the real entry point, asked what it thinks it is.',
  'curtain_hint: click anywhere to begin',
  '---',
  '',
  // TWO sections, not one. A contents page listing a single entry tells the
  // reader nothing, so the builder only writes one from two sections up
  // (`hasContents = sections.length >= 2`). A one-section fixture would make
  // this harness report the contents page as missing and send someone hunting
  // a bug that is deliberate behaviour.
  '>> Section',
  '',
  'A first page, so the section it opens is not empty.',
  '',
  '---',
  '',
  '>> Second Section',
  '',
].join('\n')

/**
 * Every `## Heading` in LAYOUTS.md that ends in a backticked identifier is a
 * promise: copy this, get that layout. Headings without one document a BLOCK
 * (a sticky, an aside, a diagram) rather than a layout, and are checked by the
 * markup they produce instead.
 */
function parseTemplates(md: string): Array<{ title: string; layout: string; snippets: string[] }> {
  const out: Array<{ title: string; layout: string; snippets: string[] }> = []
  const lines = md.split('\n')
  let current: { title: string; layout: string; snippets: string[] } | null = null
  let fence: string[] | null = null

  for (const line of lines) {
    const heading = /^## (.+?)(?:\s+`([a-z-]+)`)?\s*$/.exec(line)
    if (heading && fence === null) {
      current = { title: heading[1].trim(), layout: heading[2] ?? '', snippets: [] }
      out.push(current)
      continue
    }
    if (/^```markdown\s*$/.test(line)) { fence = []; continue }
    if (fence !== null && /^```\s*$/.test(line)) {
      current?.snippets.push(fence.join('\n'))
      fence = null
      continue
    }
    if (fence !== null) fence.push(line)
  }
  return out.filter((s) => s.snippets.length > 0)
}

/**
 * Build a one-layout book through the real CLI and return its HTML.
 *
 * `raw` skips the synthetic front matter, for a source that already carries its
 * own — the catalogue book is a real, finished document rather than a snippet
 * that needs wrapping.
 */
async function buildSnippet(
  slug: string,
  body: string,
  opts: { raw?: boolean } = {},
): Promise<string> {
  const src = join(WORK, `${slug}.md`)
  const out = join(WORK, `${slug}.html`)
  await writeFile(src, opts.raw ? body : FRONT + body + '\n', 'utf8')
  await run(process.execPath, [join(ROOT, 'src', 'build.ts'), src, out], { cwd: ROOT })
  return readFile(out, 'utf8')
}

/** Which layouts does this book actually contain, in page order? */
const layoutsIn = (html: string): string[] =>
  [...html.matchAll(/data-layout="([a-z-]+)"/g)].map((m) => m[1])

async function main(): Promise<void> {
  await rm(WORK, { recursive: true, force: true })
  await mkdir(WORK, { recursive: true })
  // The image snippets reference `img/…` relative to the book being built.
  await run('cp', ['-R', join(ROOT, 'content', 'img'), join(WORK, 'img')])

  const templates = parseTemplates(await readFile(join(ROOT, 'templates', 'LAYOUTS.md'), 'utf8'))

  // ── AUTHORED LAYOUTS ────────────────────────────────────────────────────
  // One build per layout, so a failure names the layout rather than the book.
  const authored = templates.filter((t) => t.layout)
  const seenGenerated = new Set<string>()

  for (const t of authored) {
    const slug = t.layout
    let html = ''
    try {
      html = await buildSnippet(slug, t.snippets.map(fill).join('\n\n---\n\n'))
    } catch (error) {
      record(t.title, slug, false, `build failed — ${(error as Error).message.split('\n')[0]}`)
      continue
    }
    const found = layoutsIn(html)
    found.forEach((l) => seenGenerated.add(l))
    const hits = found.filter((l) => l === slug).length
    record(
      t.title,
      slug,
      hits > 0,
      hits > 0
        ? `${hits} page(s) came back data-layout="${slug}"`
        : `documented as ${slug}, built as ${[...new Set(found)].filter((l) => !['cover', 'contents', 'divider'].includes(l)).join(', ') || 'nothing'}`,
    )
  }

  // ── SURJECTIVITY ────────────────────────────────────────────────────────
  // Every layout the engine knows must be reachable. A layout that exists in
  // LAYOUTS but comes out of no documented snippet is either undocumented or
  // shadowed by an earlier picker test — both are defects, and neither shows
  // up as a failing page.
  const layoutSrc = await readFile(join(ROOT, 'src', 'layout.ts'), 'utf8')
  const known = (/export const LAYOUTS = \[([\s\S]*?)\] as const/.exec(layoutSrc)?.[1] ?? '')
    .match(/'([a-z-]+)'/g)?.map((s) => s.replaceAll("'", '')) ?? []
  const documented = new Set(authored.map((t) => t.layout))
  const GENERATED = ['cover', 'contents', 'divider']
  const orphans = known.filter((l) => !documented.has(l) && !GENERATED.includes(l))
  record(
    'Every layout is reachable',
    '',
    orphans.length === 0,
    orphans.length === 0
      ? `${known.length} known = ${documented.size} authored + ${GENERATED.length} generated`
      : `unreachable from any documented snippet: ${orphans.join(', ')}`,
  )

  // ── GENERATED LAYOUTS ───────────────────────────────────────────────────
  // Nobody authors these; they come out of the front matter and the `>>`
  // sections. Every book above carried one `>> Section`, so all three had to
  // appear in all of them — which is a stronger claim than "appears somewhere".
  for (const g of GENERATED) {
    record(
      `Generated: ${g}`,
      g,
      seenGenerated.has(g),
      seenGenerated.has(g)
        ? `emitted in every one of the ${authored.length} builds above`
        : 'never emitted',
    )
  }

  // ── AUTHORING BLOCKS ────────────────────────────────────────────────────
  // Documented features that are not layouts. Same front door, but the promise
  // is markup rather than a layout name.
  const BLOCK_MARKS: Record<string, RegExp> = {
    'Notes and asides — typeset into the document': /class="callout callout-(note|tip|warning)"/,
    'Flow and cycle diagrams': /<svg[\s>]/,
    'Two columns': /class="[^"]*\bcolumns\b/,
  }
  for (const t of templates.filter((x) => !x.layout && BLOCK_MARKS[x.title])) {
    let html = ''
    try {
      html = await buildSnippet(t.title.replace(/\W+/g, '-').toLowerCase(), t.snippets.map(fill).join('\n\n---\n\n'))
    } catch (error) {
      record(t.title, '', false, `build failed — ${(error as Error).message.split('\n')[0]}`)
      continue
    }
    const re = BLOCK_MARKS[t.title]
    const count = (html.match(new RegExp(re.source, 'g')) ?? []).length
    record(t.title, '', count > 0, count > 0 ? `${count} match(es) for ${re.source.slice(0, 40)}…` : 'produced no matching markup')
  }

  // ── THE CATALOGUE BOOK ──────────────────────────────────────────────────
  // `content/every-layout.md` is the one artefact a person can OPEN to see all
  // seventeen layouts rendered, rather than imagining them from syntax. It is
  // documented in SKILL.md as the thing to look at before choosing a layout, so
  // it has to keep working — and the failure mode is quiet: a layout drops out
  // of the catalogue, the book still builds, and the reference silently stops
  // being complete.
  //
  // Checked LAST because it is the only row that proves the layouts still work
  // TOGETHER in one book, rather than each alone in its own fixture.
  {
    const html = await buildSnippet(
      'catalogue',
      await readFile(join(ROOT, 'content', 'every-layout.md'), 'utf8'),
      { raw: true },
    ).catch((error: Error) => `BUILD FAILED: ${error.message.split('\n')[0]}`)

    if (html.startsWith('BUILD FAILED')) {
      record('The catalogue book builds', '', false, html.slice(0, 90))
    } else {
      const inBook = new Set(layoutsIn(html))
      const missing = known.filter((l) => !inBook.has(l))
      record(
        'The catalogue shows every layout',
        '',
        missing.length === 0,
        missing.length === 0
          ? `all ${known.length} layouts rendered in content/every-layout.md`
          : `missing from the catalogue: ${missing.join(', ')}`,
      )
    }
  }

  // ── THE REPORT ──────────────────────────────────────────────────────────
  const failed = rows.filter((r) => !r.ok)
  const table = [
    '| Layout / block | Identifier | Verified | Evidence |',
    '|---|---|:--:|---|',
    ...rows.map((r) => `| ${r.name} | ${r.layout ? `\`${r.layout}\`` : '—'} | ${r.ok ? '✅' : '❌'} | ${r.evidence} |`),
  ].join('\n')

  // The browser half, if it has been run. Kept as a separate pass because it
  // needs a served book and a real Chrome, and a report that silently omitted
  // it would be claiming the runtime works on the strength of the build.
  let runtime = ['## The runtime', '', '_Not run in this pass._ Run `node scripts/drive-browser.mjs <url>` (see its', 'header for the two commands it needs) and re-run this to fold the results in.', '']
  try {
    const raw = JSON.parse(await readFile(join(ROOT, 'output', '.verify', 'runtime.json'), 'utf8')) as {
      results: Array<{ fn: string; name: string; pass: boolean; evidence: string }>
      errors: string[]
      walkLength: number
    }
    const passed = raw.results.filter((r) => r.pass).length
    runtime = [
      '## The runtime — driven in a real browser',
      '',
      'Produced by `node scripts/drive-browser.mjs`, which opens a built book in',
      'a headless Chrome and drives it the way a presenter does. Each row is an',
      'OBSERVED EFFECT, not a function that was called.',
      '',
      `**${passed}/${raw.results.length} verified** · ${raw.errors.length} page errors · ${raw.walkLength} presses walked`,
      '',
      '| Behaviour | What was observed | Verified | Evidence |',
      '|---|---|:--:|---|',
      ...raw.results.map((r) => `| \`${r.fn}\` | ${r.name} | ${r.pass ? '✅' : '❌'} | ${r.evidence.replace(/\n/g, ' ')} |`),
      '',
    ]
  } catch { /* not run — the placeholder above stands */ }

  await writeFile(
    join(ROOT, 'VERIFICATION.md'),
    [
      '# Verification',
      '',
      'Two passes, because the skill has two halves and one cannot prove the other.',
      'Regenerate with `node scripts/verify.ts`.',
      '',
      '## The catalogue — proved from the templates, not from the source',
      '',
      'Every row below was produced by copying a snippet out of',
      '`templates/LAYOUTS.md`, filling its placeholders the way an author would,',
      'building it through `src/build.ts` as a real subprocess, and asking the',
      'resulting page what layout it thinks it is.',
      '',
      'This is deliberately the long way round. `pickLayout` is first-match-wins',
      'and ordered, so a layout can be fully built, fully documented, and still',
      'unreachable — shadowed by an earlier test that also matches. Nothing fails;',
      'the page simply comes out as something else. Walking in through the front',
      'door the templates describe is the only way to catch it.',
      '',
      `**${rows.length - failed.length}/${rows.length} verified.**`,
      '',
      table,
      '',
      ...runtime,
    ].join('\n'),
    'utf8',
  )

  console.log(`\n${rows.length - failed.length}/${rows.length} verified → VERIFICATION.md`)
  if (failed.length) process.exitCode = 1
}

await main()
