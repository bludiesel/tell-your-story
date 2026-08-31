/**
 * book.ts — Markdown to a flipbook.
 *
 * One Markdown file becomes a physical object: pages, sections, a cover.
 * A `---` starts a new PAGE; a `##` heading becomes the header band.
 *
 * page-flip wants an even number of pages so every leaf has a back, so a blank
 * is appended when the count is odd — a real book has no half-leaf either.
 */

import type MarkdownIt from 'markdown-it'
import type { AssetStore } from './assets.ts'
import { internImages } from './markdown.ts'
import {
  barsDiagram, cycleDiagram, flowDiagram, pictogramDiagram, progressDiagram,
  statsDiagram, waffleDiagram, type DiagramColours,
} from './svg.ts'
import { attachStickies, pickLayout, renderLayouts, screenLabel, tagSlots } from './layout.ts'

type Renderer = InstanceType<typeof MarkdownIt>

export interface BookPage {
  html: string
  title: string
  kicker?: string
  /** Set by a `>> Name` line: this page opens a new section. */
  section?: string
  /**
   * Markup placed OUTSIDE the paper block, as a sibling of `.half`. Used by the
   * glued fore-edge tab, which has to hang past the page edge — anything inside
   * `.half` is subject to the reveal wrapper's transform, and a transformed
   * ancestor becomes the containing block, so an absolutely-positioned tab
   * would be pinned to the text column instead of the sheet.
   */
  aside?: string
  kind: 'cover' | 'content' | 'hard'
}

export interface BookMeta {
  title?: string
  subtitle?: string
  spine?: string
  hint?: string
  footer?: string
  /** Curtain: the eyebrow, headline and standfirst on the closed cloth. */
  curtainEyebrow?: string
  curtainTitle?: string
  curtainText?: string
  curtainHint?: string
  /** Curtain photo — an `asset:` ref, resolved by the same switch as any picture. */
  curtainPhoto?: string
  /** Blocks arrive one press at a time (default). `steps: false` shows the page whole. */
  steps?: boolean
  /** Plain-text blocks are typed on character by character rather than faded in. */
  typing?: boolean
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/**
 * Split the body into pages. A `---` line starts a new page; the
 * author writes one document; the kit gives it a physical form.
 */
export async function buildPages(
  body: string,
  md: Renderer,
  store: AssetStore,
  baseDir: string,
  diagramColours?: DiagramColours,
): Promise<BookPage[]> {
  const chunks = body.split(/^\s*---\s*$/m).map((c) => c.trim()).filter(Boolean)
  const pages: BookPage[] = []

  for (const [i, chunk] of chunks.entries()) {
    // TWO different markers, because they mean different things and conflating
    // them turned every page into its own section:
    //   `>> Name`  starts a SECTION — a hard divider board and a fore-edge tab
    //   `> text`   is this page's handwritten eyebrow only
    // The sample carries an eyebrow on every page, so deriving sections from
    // eyebrows produced nine boards in a nine-page book.
    const sectionMatch = chunk.match(/^>>\s*(.+)$/m)
    const section = sectionMatch?.[1]?.trim()
    const afterSection = sectionMatch ? chunk.replace(sectionMatch[0], '') : chunk

    const kickMatch = afterSection.match(/^>(?!>)\s*(.+)$/m)
    const kicker = kickMatch?.[1]?.trim() ?? section
    const withoutKick = kickMatch ? afterSection.replace(kickMatch[0], '') : afterSection

    // The first heading becomes the band title and is removed from the body,
    // so it is not printed twice.
    const headingMatch = withoutKick.match(/^#{1,3}\s+(.+)$/m)
    const rawTitle = headingMatch?.[1]?.trim() ?? ''
    const content = headingMatch ? withoutKick.replace(headingMatch[0], '') : withoutKick

    let rendered = md.render(content.trim())
    if (diagramColours) rendered = renderDiagrams(rendered, diagramColours)
    const html = await internImages(rendered, store, baseDir, `page ${i + 1}`)

    pages.push({
      html,
      title: rawTitle.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
      kicker,
      section,
      kind: 'content',
    })
  }
  return pages
}

/**
 * Turn a `:::diagram` fence into a real SVG, drawn by svg.js at BUILD time.
 *
 *   :::diagram flow
 *   Isolate | Prove dead | Tag it | Work
 *   :::
 *
 * Emitted INLINE rather than as a data URI, deliberately: a data URI is an
 * opaque image, but an inline <svg> is a document GSAP can reach into and
 * animate element by element when the page turns. Nothing of svg.js itself
 * ships — the reader receives finished markup.
 */
/**
 * A hand-drawn diagram may not carry its own colours.
 *
 * This is the ONE thing that cannot be delegated to whoever writes the SVG. A
 * literal `#35C0B6` looks right in the theme it was written against and is
 * wrong in every other — and a rebrand that silently misses a diagram produces
 * a book with one page in somebody else's palette, which is worse than a book
 * that fails to build.
 *
 * `currentColor` and `var(--token)` both inherit, so the whole grammar can be
 * written once and every theme gets its own diagram. The build refuses anything
 * else and names the offending colour, because a warning in a log is a warning
 * nobody reads.
 */
export function assertThemedColours(svg: string, kind: string): void {
  const literals = [...new Set([
    ...(svg.match(/#[0-9a-fA-F]{3,8}\b/g) ?? []),
    ...(svg.match(/\brgba?\([^)]*\)/g) ?? []),
    ...(svg.match(/\bhsla?\([^)]*\)/g) ?? []),
  ])]
  if (literals.length === 0) return
  throw new Error(
    `the ${kind} diagram hard-codes ${literals.length} colour${literals.length > 1 ? 's' : ''}: ` +
    `${literals.slice(0, 6).join(' ')}\n` +
    '  Diagrams take their colour from the theme, or a rebrand leaves this page behind.\n' +
    '  Use currentColor, or var(--ink) / var(--accent-ink) / var(--paper) / var(--paper-2).',
  )
}

export function renderDiagrams(html: string, c: DiagramColours): string {
  return html.replace(
    /<div class="diagram">\s*(?:<h4 class="block-title">([^<]*)<\/h4>)?([\s\S]*?)<\/div>/g,
    (_all, title: string | undefined, inner: string) => {
      const kind = (title ?? 'flow').trim().toLowerCase()

      // ── AUTHORED SVG PASSES STRAIGHT THROUGH ──────────────────────────
      //
      // Three diagram types are generated in code. There are thirty-nine shapes
      // a training book might want, and writing thirty-nine generators is the
      // wrong trade — the geometry of a fishbone or a Wardley map is a page of
      // layout rules, not an algorithm, and a model reading those rules draws
      // it better and in less code than a function ever will.
      //
      // So a `:::diagram` may simply CONTAIN its SVG, written from a grammar in
      // `design/diagram-grammars/`. What the kit keeps is the part that must not
      // be delegated: every colour comes from the theme, and the reveal is ours.
      //
      // `dg-node`, `dg-link`, `dg-bar`, `dg-label` are the whole animation
      // contract. `animateDiagrams` in the runtime knows those four class names
      // and nothing about diagram types, so a hand-drawn Sankey animates on the
      // page turn for free the moment its shapes carry them.
      const authored = /<svg[\s>]/i.test(inner)
      if (authored) {
        // Un-escape: markdown-it has already turned the author's `<svg>` into
        // entities on its way through, and a diagram made of &lt;svg&gt; renders
        // as a paragraph of angle brackets.
        const svgSource = inner
          .replace(/<\/?p>/g, '')
          .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'").replace(/&amp;/g, '&')
          .trim()
        // Rethrown with the block's own words so the message names the page
        // the author has to go and fix, not a regex.
        assertThemedColours(svgSource, kind)
        return `<figure class="diagram diagram-${kind}">${svgSource}</figure>`
      }

      const text = inner.replace(/<[^>]+>/g, '\n').replace(/&amp;/g, '&')
      const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)

      /** `62 of 80`, `62%`, or a bare `62` — all mean the same thing. */
      const share = (line: string): [number, number] => {
        const of = /^\s*([\d.]+)\s*(?:of|in|\/)\s*([\d.]+)/i.exec(line)
        if (of) return [Number(of[1]), Number(of[2])]
        const pct = /([\d.]+)/.exec(line)
        return [Number(pct?.[1] ?? 0), 100]
      }
      /** Everything after the number, minus a leading pipe: the caption. */
      const caption = (line: string): string =>
        (line.split('|')[1] ?? '').trim()

      let svg = ''
      if (kind.startsWith('waffle')) {
        const [f, t] = share(lines[0] ?? '')
        svg = waffleDiagram(f, t, caption(lines[0] ?? ''), c)
      } else if (kind.startsWith('pictogram')) {
        const [f, t] = share(lines[0] ?? '')
        svg = pictogramDiagram(f, t, caption(lines[0] ?? ''), c)
      } else if (kind.startsWith('progress')) {
        const rows = lines.map((l) => {
          const [label, v] = l.split('|').map((x) => x.trim())
          return [label ?? '', Number((v ?? '0').replace('%', ''))] as [string, number]
        })
        svg = progressDiagram(rows, c)
      } else if (kind.startsWith('stats')) {
        const rows = lines.map((l) => {
          const [value, note] = l.split('|').map((x) => x.trim())
          return [value ?? '', note ?? ''] as [string, string]
        })
        svg = statsDiagram(rows, c)
      } else if (kind.startsWith('cycle')) {
        svg = cycleDiagram(lines.flatMap((l) => l.split('|').map((x) => x.trim())), c)
      } else if (kind.startsWith('bars')) {
        const rows = lines.map((l) => {
          const [label, v] = l.split('|').map((x) => x.trim())
          return [label ?? '', Number(v ?? 0)] as [string, number]
        })
        svg = barsDiagram(rows, c)
      } else {
        svg = flowDiagram(lines.flatMap((l) => l.split('|').map((x) => x.trim())), c)
      }
      return `<figure class="diagram diagram-${kind}">${svg}</figure>`
    },
  )
}

/** One page of the book: header band + content, wrapped for page-flip. */
function pageHtml(page: BookPage, index: number, total: number): string {
  // A page's heading and eyebrow are PART OF THE PAGE, not something it
  // acquires: printed paper does not grow its own title while you look at it.
  // So the band's slots are tagged here rather than going through the reveal.
  const band = page.title
    ? `<div class="band${index % 2 === 1 ? ' r' : ''}">
        ${page.kicker ? `<span class="bk" data-slot="eyebrow">${esc(page.kicker)}</span>` : ''}
        <span class="bt" data-slot="heading">${esc(page.title)}</span>
      </div>`
    : ''

  // pl / pr mark which side of the gutter a leaf falls on. page-flip re-parents
  // every page into its own wrapper, so :nth-child cannot be relied on once the
  // book is live — the side has to be baked in at build time.
  const hard = page.kind === 'hard'
  const side = index % 2 === 1 ? 'pr' : 'pl'
  // Build the layout's scaffolding FIRST — the choice is made from what the
  // author wrote, and several layouts are only recognisable from the block they
  // came from rather than from the structure built around it afterwards.
  const built = renderLayouts(page.html)
  const layout = pickLayout(built, page.kind)
  // The layout name is also a class, so rules that key off the page itself —
  // `.page.full-bleed`, and `.page.cover` / `.page.divider` which already
  // existed — resolve without a second source of truth deciding which pages
  // get which class.
  const cls = `page ${side} ${layout}${hard && layout !== 'divider' ? ' divider' : ''}`

  // TWO NAMES FOR ONE FACT, AND BOTH ARE LOAD-BEARING.
  //
  // `data-stock` is the design's contract — what DESIGN.md §16.1 specifies and
  // what the audit queries. `data-density` is what page-flip itself reads:
  // literally `density === "hard" ? "hard" : "soft"` inside the engine.
  //
  // Renaming to data-stock alone silently made EVERY page soft. Nothing failed:
  // the book built, the checks passed, and the covers and section boards began
  // bending like paper instead of swinging rigid. It also quietly re-armed a
  // bug that was fixed once before — the glued fore-edge tab survives only
  // because `drawHard` sets `clip-path: none`, so on a soft page the bend clip
  // slices the tab off mid-turn.
  //
  // A check asserts the two never disagree.
  return `<div class="${cls}" data-page="${index + 1}"
  data-stock="${hard ? 'hard' : 'soft'}" data-density="${hard ? 'hard' : 'soft'}"
  data-layout="${layout}" data-screen-label="${esc(screenLabel(page.title, index, layout))}">
  <div class="half">
    ${hard ? '' : band}
    <div class="below"><div class="reveal">${tagSlots(attachStickies(built))}</div></div>
  </div>${page.aside ?? ''}
</div>`
}

/**
 * The stage curtain. Closed on load, carrying a headline and a photo; drawn
 * back on the first gesture to reveal the book, then it stays as the backdrop.
 *
 * The panels are real elements so the sequence survives without WebGL —
 * curtains.js paints a shader over them when it can.
 */
function curtainStage(meta: BookMeta): string {
  const title = meta.curtainTitle ?? meta.title ?? ''
  const words = title.split(' ')
  const titled = words.length > 1
    ? `${esc(words.slice(0, -1).join(' '))} <em>${esc(words.at(-1)!)}</em>`
    : esc(title)

  return `<div class="stage-void" aria-hidden="true"></div>
<div class="curtain" role="button" tabindex="0" aria-label="Open the curtain">
  <div class="curtain-panel left"></div>
  <div class="curtain-panel right"></div>
  <div id="curtain-gl"></div>
  <div class="curtain-rail"></div>
  <div class="curtain-copy">
    <div class="curtain-side left">
      ${meta.curtainEyebrow ? `<div class="curtain-eyebrow" data-slot="curtain-eyebrow">${esc(meta.curtainEyebrow)}</div>` : ''}
      ${title ? `<div class="curtain-title" data-slot="curtain-title">${titled}</div>` : ''}
    </div>
    <div class="curtain-side right">
      <div class="curtain-photo" data-image-slot="curtain-art">${
        meta.curtainPhoto ? `<img src="${meta.curtainPhoto}" alt="">` : ''
      }</div>
      ${meta.curtainText ? `<p class="curtain-sub" data-slot="curtain-sub">${esc(meta.curtainText)}</p>` : ''}
    </div>
  </div>
  <div class="curtain-hint" data-slot="hint">${esc(meta.curtainHint ?? 'click anywhere to begin')}</div>
</div>`
}

/** The closed book the reader taps to open. */
function closedBook(meta: BookMeta, markHtml: string): string {
  const spine = meta.spine ?? meta.title ?? ''
  return `<div class="closed-stage">
  <div class="book-closed" tabindex="0" role="button" aria-label="Open the book">
    <div class="bc-face bc-back"></div>
    <div class="bc-face bc-spine"><span data-slot="spine">${esc(spine)}</span></div>
    <div class="bc-face bc-fore"></div>
    <div class="bc-face bc-top"></div>
    <div class="bc-face bc-bottom"></div>
    <div class="bc-face bc-front">
      ${markHtml ? `<div class="bc-logo">${markHtml}</div>` : ''}
      <div class="bc-t" data-slot="title">${esc(meta.title ?? 'Workbook')}</div>
      ${meta.subtitle ? `<div class="bc-s" data-slot="subtitle">${esc(meta.subtitle)}</div>` : ''}
    </div>
    <div class="bc-hint" data-slot="hint">${esc(meta.hint ?? 'tap to open')}</div>
  </div>
  <div class="bc-shadow"></div>
</div>`
}

/** The inside-cover spread: the book opens onto its binding, not onto content. */
function coverSpread(meta: BookMeta, markHtml: string): string {
  // A title of "Working Safely with LPG" reads better with its last phrase in
  // the accent, the way the original cover did. Split on the last two words.
  const title = meta.title ?? 'Workbook'
  const words = title.split(' ')
  const head = words.slice(0, -1).join(' ')
  const tail = words.at(-1) ?? ''
  const titled = head ? `${esc(head)} <em>${esc(tail)}</em>` : esc(tail)

  return `<div class="page cover cl" data-stock="hard" data-density="hard" data-layout="cover"
  data-screen-label="cover · inside board">
  <div class="half">
    ${markHtml ? `<div class="cover-mark">${markHtml}</div>` : ''}
    ${meta.subtitle ? `<div class="cover-sub" data-slot="subtitle">${esc(meta.subtitle)}</div>` : ''}
  </div>
</div>
<div class="page cover cr" data-stock="hard" data-density="hard" data-layout="cover"
  data-screen-label="cover · front">
  <div class="half">
    <div class="cover-title" data-slot="title">${titled}</div>
    ${meta.footer ? `<div class="cover-foot" data-slot="imprint">${esc(meta.footer)}</div>` : ''}
  </div>
</div>`
}

/**
 * Sections, derived from the kickers. A new `> kicker` starts a new section.
 *
 * Each one gets a HARD DIVIDER BOARD inserted ahead of its first page, and the
 * fore-edge tab points at that board rather than at the first content page — so
 * clicking a tab arrives somewhere that announces the section, the way a real
 * tabbed manual does, instead of dropping you mid-topic.
 */
export interface Section { label: string; at: number }

export function findSections(pages: BookPage[]): Section[] {
  const seen = new Set<string>()
  const out: Section[] = []
  pages.forEach((p, i) => {
    const label = p.section?.trim()
    if (!label || seen.has(label.toLowerCase())) return
    seen.add(label.toLowerCase())
    out.push({ label, at: i })
  })
  return out
}

/**
 * Where a section's tab sits down the fore-edge, 0-based.
 *
 * Shared by the overlay rail and the tab glued to the board itself, because
 * the two have to land on exactly the same line — the whole illusion is that
 * they are one object. Two copies of this arithmetic is how they drift apart.
 */
function tabTop(n: number, span: number): number {
  return 8 + (n * (76 / Math.max(span, 1)))
}

/**
 * A hard board announcing a section. Two sides, because a leaf has two.
 *
 * The RIGHT-hand board carries a real, glued-on index tab. That is not
 * decoration: the overlay rail below floats above the whole book and cannot
 * rotate, so when you turned past a section its tab sat perfectly still through
 * the arc and then teleported to the other edge as the page landed — the one
 * thing a physical tab can never do. This one is a child of the board, so
 * page-flip's own transform carries it round. Safe specifically because boards
 * are rendered by `drawHard`, which sets `clip-path: none`; a tab hanging off a
 * SOFT page would be sliced away by the bend clip.
 */
function dividerPages(section: Section, n: number, span: number): BookPage[] {
  const front =
    `<div class="divider-n" data-slot="board-number">${String(n).padStart(2, '0')}</div>` +
    `<div class="divider-kicker" data-slot="board-title">${esc(section.label)}</div>` +
    `<div class="divider-rule"></div>`
  // `alt` mirrors `.tab:nth-child(2n)` on the rail, so the glued tab and its
  // stand-in are the same colour as well as the same height.
  const glued =
    `<span class="leaf-tab${n % 2 === 0 ? ' alt' : ''}" aria-hidden="true" data-slot="tab-label" ` +
    `style="top:${tabTop(n - 1, span).toFixed(1)}%">${esc(section.label)}</span>`
  // The back of a section board is left blank on purpose: printed manuals do
  // the same, and it means content always starts on a fresh right-hand page.
  return [
    { html: front, title: '', kind: 'hard' },
    { html: '', title: '', kind: 'hard', aside: glued },
  ]
}

/**
 * The contents page — GENERATED from the sections, never authored.
 *
 * The reference audit has a check for exactly one bug: a contents page pointing
 * at folios 3, 5, 7, 9, 11, 13 when the sections actually began on 2, 4, 6, 8,
 * 10, 12. That is what a hand-written contents page does the first time a leaf
 * is inserted anywhere above it. Deriving it from the same section list the
 * boards and the fore-edge tabs come from means it cannot drift: there is no
 * second copy of the answer to go stale.
 *
 * The dot leader is a border on an empty cell that takes the grid's slack, not
 * a row of typed periods — so it sits on the baseline and stops exactly where
 * the folio starts, at any title length.
 */
function contentsPage(entries: Array<{ label: string; folio: number; page: number }>): BookPage {
  if (entries.length === 0) return { html: '', title: '', kind: 'content' }
  // A CONTENTS ROW THAT LOOKS LIKE A DESTINATION HAS TO BE ONE.
  //
  // On paper a contents page is a printed index: it cites a folio and you turn
  // there yourself. On a screen it reads as a list of links, so a reader clicks
  // it — and until this carried `data-goto` nothing happened, which teaches
  // them the book is not interactive right at the point they were exploring it.
  // The fore-edge tabs were the only way to jump, and a first-time reader has
  // no reason to know that.
  const rows = entries.map((e, i) =>
    `<div class="contents-row" role="button" tabindex="0" data-goto="${e.page}" ` +
    `aria-label="Go to ${esc(e.label)}, page ${e.folio}">` +
    `<span class="contents-n" data-slot="contents-number">${String(i + 1).padStart(2, '0')}</span>` +
    `<span class="contents-t" data-slot="contents-title">${esc(e.label)}</span>` +
    `<span class="contents-lead" aria-hidden="true"></span>` +
    `<span class="contents-f" data-slot="contents-folio">${e.folio}</span>` +
    `</div>`).join('')
  return {
    html: `<div class="contents">${rows}</div>`,
    title: 'Contents',
    kicker: 'what is in here',
    kind: 'content',
  }
}

/** Fore-edge index tabs, one per section, pointing at that section's board. */
function tabsHtml(chapters: Array<{ label: string; page: number }>): string {
  if (chapters.length === 0) return ''

  const span = chapters.length
  const buttons = chapters.map((c, n) => {
    // spread them down the fore-edge
    const top = tabTop(n, span)
    return `<button type="button" class="tab" data-page="${c.page}" style="top:${top.toFixed(1)}%"
      aria-label="Jump to ${esc(c.label)}">${esc(c.label)}</button>`
  }).join('\n    ')

  return `<div class="tabs">\n    ${buttons}\n  </div>`
}

/**
 * Returns the HTML AND the real leaf count. The caller used to report the
 * authored page count, which stopped being true the moment section boards were
 * spliced in — a 9-page source now produces 16 leaves, and printing "9 pages"
 * is a lie the author would only discover by counting.
 */
export function renderBook(opts: {
  pages: BookPage[]
  meta: BookMeta
  markHtml: string
  themeBlock: string
  bookBlock: string
  css: string
}): { html: string; pageCount: number; sectionCount: number } {
  // The cover spread occupies the first leaf, so content starts on a fresh one.
  const cover = coverSpread(opts.meta, opts.markHtml)

  // Splice a hard board in ahead of each section, and record where each one
  // lands so the tabs can point at the boards rather than at content pages.
  // Built in one pass, forwards, with the running offset applied as we go —
  // inserting first and re-deriving positions afterwards is where off-by-one
  // bugs breed.
  const sections = findSections(opts.pages)
  const pages: BookPage[] = []
  const tabTargets: Array<{ label: string; page: number }> = []
  let sectionNo = 0

  // Front matter: the contents, on the first right-hand page, with a blank back
  // so content still starts on a fresh recto. Reserved as a placeholder and
  // filled in at the end — its own rows cite folios that do not exist until
  // every board has been spliced in and counted.
  const hasContents = sections.length >= 2
  if (hasContents) {
    pages.push({ html: '', title: '', kind: 'content' })
    pages.push({ html: '', title: '', kind: 'content' })
  }
  const contentsAt = 0

  opts.pages.forEach((p, i) => {
    const starts = sections.find((s) => s.at === i)
    if (starts) {
      sectionNo++
      // A board is a LEAF (two sides), so it must begin on an even index or the
      // front of the board would land on a left-hand page — a divider you meet
      // side-on rather than face-on.
      if (pages.length % 2 === 1) pages.push({ html: '', title: '', kind: 'content' })
      tabTargets.push({ label: starts.label, page: pages.length })
      pages.push(...dividerPages(starts, sectionNo, sections.length))
    }
    pages.push(p)
  })

  // page-flip needs pairs: a leaf has two sides.
  if (pages.length % 2 === 1) {
    pages.push({ html: '', title: '', kind: 'content' })
  }

  // Now the contents can be written, because the folios it cites finally exist.
  //
  // The numbers have to be derived exactly as the runtime's folio pass derives
  // them — printed pages only, boards and covers and the colophon skipped —
  // or the contents cites page numbers the reader will never find. That is the
  // reference audit's third check, and it is a bug that has happened.
  if (hasContents) {
    let printed = 1
    const folioOf = new Map<number, number>()
    pages.forEach((p, i) => {
      if (p.kind !== 'content' || i === contentsAt) return
      folioOf.set(i, ++printed)
    })
    // A tab points at the BOARD; the section's first printed page is the one
    // after it, which is what a reader turning to that entry actually wants.
    const entries = tabTargets.map((t) => {
      for (let i = t.page; i < pages.length; i++) {
        const f = folioOf.get(i)
        // `t.page` is the BOARD; the reader wants the board, the same place the
        // fore-edge tab sends them, so the section announces itself rather than
        // dropping them into the middle of it. The folio is the printed page
        // after it, which is what the number in the contents cites.
        if (f !== undefined) return { label: t.label, folio: f, page: t.page }
      }
      return { label: t.label, folio: 0, page: t.page }
    })
    pages[contentsAt] = contentsPage(entries)
  }

  const tabs = tabsHtml(tabTargets)

  // +2 for the cover spread, and the tab page indices shift with it.
  const pagesHtml = cover + '\n' +
    pages.map((p, i) => pageHtml(p, i, pages.length)).join('\n')
  const spreads = Math.ceil((pages.length + 2) / 2)

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="generator" content="tell-your-story (book)">
<title>${esc(opts.meta.title ?? 'Workbook')}</title>
<style>${opts.themeBlock}
${opts.bookBlock}
${opts.css}</style>
</head>
<body data-steps="${opts.meta.steps === false ? 'off' : 'on'}" data-typing="${opts.meta.typing ? 'on' : 'off'}">
${curtainStage(opts.meta)}
<div class="wrap">
  ${closedBook(opts.meta, opts.markHtml)}
  <div class="book-3d">
    <div class="boards"></div>
    <div class="stack stack-l"></div>
    <div class="stack stack-r"></div>
    <div id="book">
${pagesHtml}
    </div>
    ${tabs}
    <button type="button" class="ribbon" aria-label="Back to where you got to">
      <span>bookmark</span>
    </button>
    <div class="gutterline"></div>
    <div class="floor"></div>
  </div>
</div>
<div class="chrome">
  <button type="button" data-action="view" data-view="auto"
    aria-label="Page view: automatic. Click for one page at a time."
    title="Page view: automatic"><span class="view-glyph">&#9707;</span></button>
  <button type="button" data-action="riffle" aria-label="Riffle back to the first page"
    title="Back to the start">&#8630;</button>
  <button type="button" data-action="prev" aria-label="Previous page">&#8249;</button>
  <span class="spread" aria-live="polite">1 / ${spreads}</span>
  <button type="button" data-action="next" aria-label="Next page">&#8250;</button>
  <button type="button" data-action="close"
    aria-label="Close the book and lower the curtain" title="Close (Esc)">&#10005;</button>
</div>
<div class="blackout-layer" aria-hidden="true"></div>
<script>__JS__</script>
</body>
</html>
`
  return { html, pageCount: pages.length + 2, sectionCount: sections.length }
}
