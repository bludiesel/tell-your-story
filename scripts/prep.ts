#!/usr/bin/env node
/**
 * prep.ts — read raw content and tell the ASSISTANT how to shape it.
 *
 * WHAT THIS IS FOR, AND WHAT IT DELIBERATELY IS NOT
 *
 * This kit is a SKILL, not an application. Nobody runs this to produce a book;
 * an assistant runs it to think better before producing one. So this script
 * REPORTS and RECOMMENDS — it never rewrites the author's words. Rewriting
 * would be the wrong division of labour twice over: the model is far better at
 * judging what a paragraph means than a heuristic is, and silently altering
 * someone's copy is not a thing a tool should do behind their back.
 *
 * What it is genuinely good at is the part the model is WORST at: counting.
 * A model reading a long Markdown file cannot reliably tell you that page 7 is
 * three times the length of page 3, that eleven pages carry no section marker,
 * or that a spread will overflow. Those are measurements, and measurements are
 * what this returns — each one paired with the specific action to take.
 *
 * Run it BEFORE building. A well-chunked source is the single biggest lever on
 * how good the finished book is; every feature in the kit is downstream of
 * whether the content was cut into pages properly.
 *
 *   node scripts/prep.ts content/lesson.md            human-readable report
 *   node scripts/prep.ts content/lesson.md --json     same findings, machine-readable
 *
 * THE CAPACITY NUMBERS BELOW ARE MEASURED, NOT GUESSED. They come from the
 * shipped sample rendered at 1440x900: a page that fills its area well carries
 * roughly 90-130 words of body copy, and passes 170 when it starts to crowd the
 * fore-edge. They are stated as ranges because a page with a picture or a table
 * holds far less text, which is why those are counted separately.
 */

import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

// ── measured page capacity ───────────────────────────────────────────────────
const WORDS_COMFORTABLE = 130   // fills the page without crowding
const WORDS_CROWDED = 170       // starts to reach the fore-edge
const WORDS_THIN = 35           // a page this empty looks unfinished
/** A picture takes roughly this much of a page's text budget. */
const WORDS_PER_IMAGE = 55
/** Each table row costs about this much. */
const WORDS_PER_TABLE_ROW = 12

interface Finding {
  where: string
  severity: 'stop' | 'fix' | 'consider'
  what: string
  do: string
}

interface PageStat {
  n: number
  /** Which spread this page lands on once covers and boards are counted in. */
  spread?: number
  section?: string
  eyebrow?: string
  heading?: string
  words: number
  budget: number
  images: number
  tableRows: number
  blocks: string[]
  steps: Step[]
  /** What the author's own reveal markers will do to the order, if anything. */
  moves: string[]
}

/** One beat of a page: what arrives, when, and why it goes there. */
interface Step {
  n: number
  what: string
  why: string
  /** The marker to write in the Markdown, when the order is not simply document order. */
  marker?: '.step-first' | '.step-last' | '.with-previous'
}

/** One top-level block of a page, with any reveal marker the author wrote on it. */
interface Block { kind: string; text: string; marker?: string }

/**
 * Split a page into its top-level blocks, in the order they were written,
 * carrying whichever reveal marker sits on each one.
 *
 * The marker is captured from the same places the runtime reads it: the fence
 * line of a `:::block`, and the trailing attribute list of a picture or a
 * paragraph. Reading it here is what lets `moves()` below say what an author's
 * marker will actually DO, rather than only proposing markers of its own.
 */
function topBlocks(chunk: string): Block[] {
  const lines = chunk.split('\n')
  const items: Block[] = []
  let fence: string | null = null
  let fenceMarker: string | undefined
  let buf: string[] = []
  // Anchored to end-of-line because that is where markdown-it-attrs honours an
  // attribute block. Matching one mid-sentence would flag documentation that
  // merely NAMES a marker — which it did, on the kit's own CHOOSING.md.
  const STEP = /\{[^}]*\.(step-first|step-last|with-previous)[^}]*\}[ \t]*$/m
  const flush = (kind: string, marker?: string) => {
    const text = buf.join('\n').trim()
    if (text) items.push({ kind, text, marker: marker ?? STEP.exec(text)?.[1] })
    buf = []
  }
  for (const line of lines) {
    const open = /^:::(\w+)/.exec(line)
    if (fence === null && open) {
      flush('prose')
      fence = open[1]!
      fenceMarker = STEP.exec(line)?.[1]
      continue
    }
    if (fence !== null && /^:::\s*$/.test(line)) { flush(fence, fenceMarker); fence = null; fenceMarker = undefined; continue }
    if (fence === null && /^(>>?\s|#{1,6}\s)/.test(line)) continue  // markers and headings
    if (fence === null && line.trim() === '') { flush('prose'); continue }
    buf.push(line)
  }
  flush(fence ?? 'prose', fenceMarker)
  return items
}

/**
 * ── WHAT THE AUTHOR'S OWN MARKERS WILL DO ───────────────────────────────────
 * Replay the runtime's ordering rule over a page and report every block whose
 * marker moves it away from where it was written.
 *
 * Everything else in this file PROPOSES an order. This checks the one the
 * author already committed to, which is a different job and the one that was
 * missing: `{.step-first}` on the last of two blocks silently inverts the page,
 * and the page still builds, still passes every check, and reads backwards.
 * That happened while dogfooding this very script, which is why it exists.
 *
 * It reports rather than forbids. Pulling a warning ahead of three paragraphs
 * of setup is exactly what the marker is for, so the only honest thing a script
 * can do is state the consequence and let the author confirm it was the intent.
 *
 * The rule mirrors `src/runtime/book.ts`: step-first blocks, then unmarked ones
 * in document order, then step-last. Keep the two in step.
 */
function moves(chunk: string): string[] {
  const blocks = topBlocks(chunk)
  const label = (b: Block) =>
    `${b.kind}: ${b.text.replace(/\{[^}]*\}/g, '').replace(/\s+/g, ' ').replace(/[*_`|]/g, '').trim().slice(0, 38)}`

  const order = [
    ...blocks.filter((b) => b.marker === 'step-first'),
    ...blocks.filter((b) => b.marker !== 'step-first' && b.marker !== 'step-last'),
    ...blocks.filter((b) => b.marker === 'step-last'),
  ]

  const out: string[] = []
  for (const b of blocks) {
    if (!b.marker || b.marker === 'with-previous') continue
    const from = blocks.indexOf(b)
    const to = order.indexOf(b)
    if (from === to) {
      out.push(`{.${b.marker}} on "${label(b)}" changes nothing — it is already ${
        b.marker === 'step-first' ? 'the first' : 'the last'} block. Drop the marker.`)
    } else if (b.marker === 'step-first') {
      out.push(`{.step-first} pulls "${label(b)}" ahead of ${from} block(s) written before it, ` +
        `so it is what the reader meets on the turn.`)
    } else {
      out.push(`{.step-last} pushes "${label(b)}" behind ${blocks.length - 1 - from} block(s) ` +
        `written after it, so it lands once the argument is finished.`)
    }
  }
  const first = blocks[0]
  if (first?.marker === 'with-previous') {
    out.push(`{.with-previous} on "${label(first)}" has nothing above it to join. Drop the marker.`)
  }
  return out
}

/**
 * ── THE SEQUENCE ────────────────────────────────────────────────────────────
 * Propose the order a page's blocks should arrive in, and say why for each one.
 *
 * The book reveals one block per press. Document order is the default and is
 * usually right, because the author already wrote it in the order they want it
 * read. It is wrong in a small number of RECOGNISABLE cases, and those are what
 * this encodes:
 *
 *   · a takeaway or a closing statement should land AFTER the argument it
 *     concludes, wherever it happens to sit on the page
 *   · a caption is not a beat — it belongs to the picture above it
 *   · a sticky note is an annotation ON something, so it arrives with it
 *   · a warning should not wait behind three paragraphs of setup
 *
 * These are structural facts about block TYPES, which is why a script can state
 * them and state them identically every run. What a script cannot judge is
 * whether THESE two particular paragraphs are one thought or two — that is about
 * meaning, and the assistant reading the content decides it. So this proposes;
 * the assistant overrides in the Markdown where it disagrees. Neither half is
 * sufficient alone, which is the whole reason it is split this way.
 */
function sequence(chunk: string): Step[] {
  const items = topBlocks(chunk)

  const LAST = new Set(['takeaway', 'big'])
  const EARLY = new Set(['warning'])
  const ATTACH = new Set(['sticky'])

  const described = items.map((it) => {
    if (it.kind === 'prose' && /^\s*!\[/.test(it.text)) return { ...it, kind: 'image' }
    if (it.kind === 'prose' && /^\s*\|/.test(it.text)) return { ...it, kind: 'table' }
    return it
  })

  const steps: Step[] = []
  const push = (kind: string, text: string, why: string, marker?: Step['marker']) =>
    steps.push({
      n: 0,
      what: `${kind}: ${text.replace(/\s+/g, ' ').replace(/[*_`]/g, '').trim().slice(0, 46)}`,
      why, marker,
    })

  const early = described.filter((d) => EARLY.has(d.kind))
  const late = described.filter((d) => LAST.has(d.kind))
  const middle = described.filter((d) => !EARLY.has(d.kind) && !LAST.has(d.kind))

  // The opening beat: whatever the author put first, unless a warning outranks
  // it. A page must never open empty.
  middle.slice(0, 1).forEach((d) =>
    push(d.kind, d.text, 'opens the page — arrives with the turn, so the spread is never blank'))
  early.forEach((d) =>
    push(d.kind, d.text, 'a warning should not wait behind the setup',
      described.indexOf(d) > 1 ? '.step-first' : undefined))

  middle.slice(1).forEach((d, i) => {
    const prev = middle[i]  // the block written before this one
    if (ATTACH.has(d.kind)) {
      push(d.kind, d.text, 'an annotation on the block above, not a beat of its own', '.with-previous')
    } else if (prev?.kind === 'image' && words(d.text) <= 22) {
      push(d.kind, d.text, 'short line under a picture — reads as its caption', '.with-previous')
    } else if (d.kind === 'diagram') {
      push(d.kind, d.text, 'lands after the words that set it up, so it answers a question already asked')
    } else {
      push(d.kind, d.text, 'follows in the order it was written')
    }
  })

  late.forEach((d) =>
    push(d.kind, d.text, 'the thing to remember lands last, after the argument for it',
      described.indexOf(d) < described.length - 1 ? '.step-last' : undefined))

  steps.forEach((s, i) => { s.n = i + 1 })
  return steps
}

const words = (s: string) => s.split(/\s+/).filter(Boolean).length

function analyse(body: string): { pages: PageStat[]; findings: Finding[] } {
  const chunks = body.split(/^\s*---\s*$/m).map((c) => c.trim()).filter(Boolean)
  const pages: PageStat[] = []
  const findings: Finding[] = []

  chunks.forEach((chunk, i) => {
    const section = chunk.match(/^>>\s*(.+)$/m)?.[1]?.trim()
    const eyebrow = chunk.match(/^>(?!>)\s*(.+)$/m)?.[1]?.trim()
    const heading = chunk.match(/^#{1,3}\s+(.+)$/m)?.[1]?.trim()
    const blocks = [...chunk.matchAll(/^:::(\w+)/gm)].map((m) => m[1]!)
    const images = [...chunk.matchAll(/!\[[^\]]*\]\([^)]+\)/g)].length
    const tableRows = chunk.split('\n').filter((l) => /^\s*\|.*\|\s*$/.test(l)).length

    // Body prose only: strip the markers, block fences, tables and images, so
    // "words" means what a reader actually reads on the page.
    const prose = chunk
      .replace(/^>>?.*$/gm, '')
      .replace(/^#{1,6}.*$/gm, '')
      .replace(/^:::.*$/gm, '')
      .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
      .replace(/^\s*\|.*\|\s*$/gm, '')
    const w = words(prose)
    const budget = w + images * WORDS_PER_IMAGE + tableRows * WORDS_PER_TABLE_ROW

    pages.push({
      n: i + 1, section, eyebrow, heading, words: w, budget, images, tableRows, blocks,
      steps: sequence(chunk),
      moves: moves(chunk),
    })
  })

  // ── per-page findings ──────────────────────────────────────────────────
  for (const p of pages) {
    if (p.budget > WORDS_CROWDED) {
      findings.push({
        where: `page ${p.n}${p.heading ? ` — "${p.heading}"` : ''}`,
        severity: 'fix',
        what: `about ${p.budget} words of content; a page holds ~${WORDS_COMFORTABLE} comfortably`,
        do: 'Split it. Find the second idea and start a new page there with its own heading — ' +
            'do not shrink the type, a workbook is read at arm\'s length.',
      })
    } else if (p.budget < WORDS_THIN && p.images === 0 && p.blocks.length === 0) {
      findings.push({
        where: `page ${p.n}${p.heading ? ` — "${p.heading}"` : ''}`,
        severity: 'consider',
        what: `only ~${p.budget} words and nothing else on the page`,
        do: 'Either merge it into a neighbour, or give it something to carry — a :::sticky ' +
            'aside, a picture, or a :::takeaway if it is the point of the section.',
      })
    }
    // SOME LAYOUTS ARE MEANT TO HAVE NO HEADING, and advice that ignores that
    // is worse than silence: it tells an author to add a heading the stylesheet
    // then hides, so they change the source and nothing happens.
    //
    //   full bleed — `.page.full-bleed .band { display: none }`. The picture
    //                runs to every edge; a band across it is the one thing that
    //                would stop it being a bleed.
    //   colophon   — small, centred and quiet by definition, and it does not
    //                even take a folio.
    //   statement  — one line, centred, the largest type in the book. A header
    //                above it competes with the only thing on the page.
    //   quote      — LAYOUTS.md's own example has an eyebrow and no heading, and
//                CHOOSING.md says nothing else goes on the page. Flagging it
//                contradicted the skill's own instructions, which is the worst
//                kind of advice: following the docs produced a warning.
    const headless = new Set(['bleed', 'colophon', 'big', 'quote'])
    const wantsNoBand = p.blocks.some((b: string) => headless.has(b))
    if (!p.heading && !wantsNoBand) {
      findings.push({
        where: `page ${p.n}`,
        severity: 'fix',
        what: 'no heading, so the page has no header band and no entry in the reader\'s sense of place',
        do: 'Add a `## Heading`. It is lifted into the band and removed from the body, so it costs no space.',
      })
    }
    // FIVE STEPS IS THE CEILING — DESIGN.md §8: "A page has at most five steps;
    // more than that and the presenter is clicking, not talking." Advice rather
    // than an enforced cap, because the fix is to move a block to the next page
    // or group two with {.with-previous}, and only the author knows which of
    // those the argument wants. Silently collapsing steps would take a pacing
    // decision away from them without saying so.
    const stepCount = p.steps.filter((s: { marker?: string }) => !/with-previous/.test(s.marker ?? '')).length
    if (stepCount > 5) {
      findings.push({
        where: `page ${p.n}${p.heading ? ` — "${p.heading}"` : ''}`,
        severity: 'consider',
        what: `${stepCount} things arrive one press at a time; five is the ceiling`,
        do: 'Either move a block to the next page, or mark the ones that belong together ' +
            'with {.with-previous} so they arrive as one beat — a caption under a picture ' +
            'is not a beat of its own.',
      })
    }
    for (const m of p.moves) {
      findings.push({
        where: `page ${p.n}${p.heading ? ` — "${p.heading}"` : ''}`,
        severity: /Drop the marker/.test(m) ? 'fix' : 'consider',
        what: m,
        do: /Drop the marker/.test(m)
          ? 'Remove it. A marker that changes nothing is a claim about the page that is not true, ' +
            'and the next person to read the source will trust it.'
          : 'Confirm that is the reading you want. If it is not, remove the marker and the block ' +
            'arrives where you wrote it.',
      })
    }
    if (p.tableRows > 12) {
      findings.push({
        where: `page ${p.n}`,
        severity: 'fix',
        what: `a ${p.tableRows}-row table on one page`,
        do: 'Split the table across pages, or cut it to the rows that matter. A printed page cannot scroll.',
      })
    }
  }

  // ── whole-document findings ────────────────────────────────────────────
  const sections = pages.filter((p) => p.section)
  if (sections.length === 0 && pages.length > 4) {
    findings.push({
      where: 'the document',
      severity: 'fix',
      what: `${pages.length} pages and no sections at all`,
      do: 'Add `>> Section name` to the first page of each theme. Each one becomes a hard ' +
          'divider board and a fore-edge tab — without them the reader has no way to navigate ' +
          'and no sense of how the material is organised.',
    })
  } else if (sections.length > pages.length / 3) {
    findings.push({
      where: 'the document',
      severity: 'fix',
      what: `${sections.length} sections across only ${pages.length} pages`,
      // The test is a RATIO, so the advice has to be phrased as one. It used to
      // end "three to six sections suits a workbook", which is an absolute
      // range — and flagging five sections while recommending three to six
      // leaves an author with no idea what they are supposed to change.
      do: `Too many for the length. Every \`>>\` inserts a physical divider board — two faces of ` +
          `hard stock — so at this rate the reader turns past nearly as many boards as pages of ` +
          `content. Aim for a section every four pages or more: at ${pages.length} pages that is ` +
          `about ${Math.max(1, Math.floor(pages.length / 4))}. Either merge two sections, or use ` +
          '`>` for a page eyebrow where you do not mean a new section.',
    })
  }

  const withStickies = pages.filter((p) => p.blocks.includes('sticky')).length
  if (withStickies === 0 && pages.length > 3) {
    findings.push({
      where: 'the document',
      severity: 'consider',
      what: 'no sticky notes anywhere',
      do: 'A `:::sticky` is an aside in a human voice — the thing a trainer would say out loud ' +
          'but would not put in the manual. One or two across a workbook lift it out of ' +
          'textbook register. Do not put one on every page.',
    })
  }

  const emphasis = pages.filter((p) =>
    p.blocks.some((b) => ['warning', 'tip', 'takeaway'].includes(b))).length
  if (emphasis === 0 && pages.length > 3) {
    findings.push({
      where: 'the document',
      severity: 'consider',
      what: 'every page is flat body copy — no tips, warnings or takeaways',
      do: 'Look for sentences that are already doing one of those jobs: a "never do X" is a ' +
          ':::warning, a "the one thing to remember" is a :::takeaway. Promote them rather than ' +
          'inventing new ones.',
    })
  }

  // ── WHICH PAGES FACE EACH OTHER ────────────────────────────────────────
  //
  // `:::compare` and `:::timeline` only work as a PAIR ON A SPREAD: a
  // comparison whose other half is overleaf is half an argument, and a timeline
  // rail that does not meet its other half never crosses the gutter.
  //
  // Working that out by hand means knowing that the cover occupies two faces,
  // that a contents page and its blank back are inserted once there are two or
  // more sections, and that a section board must begin on an even index so its
  // front lands on a right-hand page. That is real arithmetic on a moving
  // target — inserting one page shifts every pair after it — and getting it
  // wrong produces a book that looks correct and argues badly.
  //
  // So the layout that needs the fact is told the fact. The face index is
  // rebuilt here exactly as renderBook builds it, rather than approximated,
  // because an approximation that is right most of the time is the worst
  // possible version of this.
  {
    const faceOf = new Map<number, number>()
    let face = 2                                   // the cover spread
    if (sections.length >= 2) face += 2            // contents + its blank back
    const seenSection = new Set<string>()
    pages.forEach((p) => {
      if (p.section && !seenSection.has(p.section)) {
        seenSection.add(p.section)
        if (face % 2 === 1) face += 1              // a board starts on an even face
        face += 2                                  // the board's two faces
      }
      faceOf.set(p.n, face)
      face += 1
    })
    const spreadOf = (n: number) => Math.floor((faceOf.get(n) ?? 0) / 2) + 1

    for (const kind of ['compare', 'timeline'] as const) {
      const users = pages.filter((p) => p.blocks.includes(kind))
      for (let i = 0; i < users.length; i += 2) {
        const a = users[i]!, b = users[i + 1]
        if (!b) {
          findings.push({
            where: `page ${a.n}${a.heading ? ` — "${a.heading}"` : ''}`,
            severity: 'fix',
            what: `a lone :::${kind}, and it needs a facing page to work`,
            do: kind === 'compare'
              ? 'Add the other half on the next page — `:::compare before` and `:::compare after` are one argument split across a spread.'
              : 'Continue the rail on the next page with a second `:::timeline`, so it reads as one line crossing the fold.',
          })
        } else if (spreadOf(a.n) !== spreadOf(b.n)) {
          findings.push({
            where: `pages ${a.n} and ${b.n}`,
            severity: 'fix',
            what: `this :::${kind} pair lands on spreads ${spreadOf(a.n)} and ${spreadOf(b.n)}, so the two halves never face each other`,
            do: 'Move one page, or add a page before the pair, so both land on the same spread. ' +
                'Re-run prep afterwards — inserting a page shifts every pair after it.',
          })
        }
      }
    }
    // Printed for every page, because "which spread am I on" is otherwise
    // unanswerable without reading the builder's source.
    pages.forEach((p) => { (p as PageStat & { spread?: number }).spread = spreadOf(p.n) })
  }

  // THIS ADVICE USED TO BE WRONG, AND WRONG ADVICE IS WORSE THAN NONE.
  //
  // It counted source pages plus two faces per section plus the cover, and
  // ignored the blanks the binder inserts to start each section board on an
  // even face. So it told an author with a book that ended cleanly on its
  // colophon to "add a closing page" — they did, and it pushed the colophon
  // onto a left-hand page with a blank leaf trailing after it. The book was
  // better before it took the advice.
  //
  // `face` below is the real running total, built by the same rules as
  // renderBook and already used for the facing-pair checks above, so there is
  // one model of the binding rather than two that disagree.
  const finalFace = (() => {
    let f = 2
    if (sections.length >= 2) f += 2
    const seen = new Set<string>()
    for (const p of pages) {
      if (p.section && !seen.has(p.section)) { seen.add(p.section); if (f % 2 === 1) f += 1; f += 2 }
      f += 1
    }
    return f
  })()
  if (finalFace % 2 === 1) {
    findings.push({
      where: 'the document',
      severity: 'consider',
      what: 'the page count is odd, so the book ends on a half-leaf and a blank is appended',
      do: 'Add a closing page — a :::big statement or a summary — so the last thing the reader ' +
          'sees is deliberate rather than empty.',
    })
  }

  return { pages, findings }
}

// ── report ───────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2)
const wantJson = argv.includes('--json')
const input = argv.find((a) => !a.startsWith('-'))

if (!input) {
  console.log(`
  Analyse content BEFORE building, and say how to shape it.

    node scripts/prep.ts <input.md> [--json]

  Reports what a model cannot reliably judge by reading: page lengths against
  measured capacity, missing or excessive sections, pages with no heading, and
  where the kit's blocks are going unused. It never rewrites your words.
`)
  process.exit(1)
}

const source = await readFile(resolve(input), 'utf8').catch(() => {
  console.error(`\n  Error: cannot read ${input}\n`)
  process.exit(1)
})

// HTML COMMENTS ARE NOT CONTENT, and counting them as content makes this whole
// script lie. A note to a collaborator at the top of a page was measured as body
// text and as reveal steps: one comment turned a 57-word page into a reported
// 202 words and 6 steps, and produced two confident FIX findings about a page
// that was fine. Advice derived from a miscount is worse than no advice — the
// author edits real prose to satisfy a number that was never about their prose.
//
// Stripped here rather than in `analyse` so every measurement downstream — word
// counts, step counts, headings, block detection — sees the same text the
// builder will.
const stripComments = (s: string) => s.replace(/<!--[\s\S]*?-->/g, '')

const body = stripComments(
  source.startsWith('---')
    ? source.slice(source.indexOf('\n---', 3) + 4)
    : source,
)

const { pages, findings } = analyse(body)

if (wantJson) {
  console.log(JSON.stringify({ pages, findings }, null, 2))
  process.exit(findings.some((f) => f.severity === 'stop') ? 1 : 0)
}

const bar = (n: number) => {
  const filled = Math.min(Math.round((n / WORDS_CROWDED) * 20), 20)
  return '█'.repeat(filled) + '·'.repeat(20 - filled)
}

console.log(`\n  ${input}\n`)
console.log(`  page  fill                  words  extras`)
for (const p of pages) {
  const extras = [
    p.section ? `SECTION: ${p.section}` : '',
    p.images ? `${p.images} pic` : '',
    p.tableRows ? `${p.tableRows}-row table` : '',
    ...p.blocks.map((b) => `:::${b}`),
  ].filter(Boolean).join('  ')
  console.log(
    `  ${String(p.n).padStart(4)}  ${bar(p.budget)}  ${String(p.budget).padStart(5)}  ${extras}`,
  )
}

// ── the proposed reveal order ────────────────────────────────────────────────
// Printed only for pages where it has something to say — a page whose blocks
// simply arrive in the order they were written needs no advice, and printing
// "1, 2, 3, as written" for twenty pages buries the four that matter.
const paced = pages.filter((p) => p.steps.some((s) => s.marker))
if (paced.length > 0) {
  console.log(`\n  reveal order — ${paced.length} page(s) where it should not be document order:\n`)
  console.log('  Blocks arrive one press at a time. Add the marker in braces after the')
  console.log('  block, e.g.  :::takeaway {.step-last}  — this is a proposal from the')
  console.log('  block TYPES; you are reading the meaning, so overrule it where it is wrong.\n')
  for (const p of paced) {
    console.log(`  page ${p.n}${p.heading ? ` — "${p.heading}"` : ''}`)
    for (const s of p.steps) {
      const mark = s.marker ? `  {${s.marker}}` : ''
      console.log(`    ${s.n}. ${s.what}${mark}`)
      console.log(`       ${s.why}`)
    }
    console.log('')
  }
}

const order = { stop: 0, fix: 1, consider: 2 } as const
findings.sort((a, b) => order[a.severity] - order[b.severity])

if (findings.length === 0) {
  console.log('\n  Nothing to flag — this is well chunked. Build it.\n')
} else {
  console.log(`\n  ${findings.length} thing(s) to look at:\n`)
  for (const f of findings) {
    const tag = f.severity === 'stop' ? 'STOP' : f.severity === 'fix' ? 'FIX ' : 'MAYBE'
    console.log(`  ${tag}  ${f.where}`)
    console.log(`        ${f.what}`)
    console.log(`        → ${f.do}\n`)
  }
}
