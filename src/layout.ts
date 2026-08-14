/**
 * layout.ts — make the book declare its own structure.
 *
 * From `design/DESIGN.md` §16.1, and the reasoning there is worth repeating
 * because it is the whole point of this file:
 *
 * > The failures in this design were never failures of taste. Every one was a
 * > rule that lived only in prose — true, written down, and silently violated
 * > three edits later.
 *
 * So the book states what it is, in attributes, rather than leaving it to be
 * inferred from markup:
 *
 *   data-layout        on every page — which of the layouts it is using
 *   data-slot          on every element holding copy — what ROLE that copy plays
 *   data-stock         on every page — hard or soft; the flip engine cannot guess
 *   data-screen-label  on every page — so a bug report can name it
 *
 * Layout classes live on INNER blocks (`.contents`, `.tl-rail`, `.compare`), so
 * a page's own class tells you almost nothing. `[data-layout="timeline"]` finds
 * both halves of a timeline spread with no inspection at all. And `data-slot`
 * turns replacing placeholder copy into a query rather than a reading exercise.
 *
 * Everything downstream depends on these existing: the audit cannot run without
 * them, and neither can the checks that enforce the catalogue.
 */

import { parseHTML } from 'linkedom'

/**
 * The layout catalogue. A page picks exactly ONE and fills it in.
 *
 * Layouts are never combined on one page — that is a design rule, not a
 * limitation, and it is why selection below is ordered rather than additive.
 * An eighteenth layout is a design decision, not an authoring one.
 */
export const LAYOUTS = [
  'cover', 'contents', 'divider', 'opener', 'prose', 'has-sticky', 'marginalia',
  'half-bleed', 'full-bleed', 'ptable', 'barchart', 'timeline', 'compare',
  'statement', 'quote-page', 'takeaway', 'colophon',
] as const
export type Layout = (typeof LAYOUTS)[number]

/**
 * Every role a piece of copy can play. Taken from the reference book's own
 * catalogue (`design/CONTENT-SLOTS.md`) rather than invented, because the
 * instruction there is explicit: do not invent new role names — reuse one, or
 * add it to the catalogue and the audit together.
 */
export const SLOT_ROLES = new Set([
  'body', 'folio', 'eyebrow', 'heading', 'subtitle', 'title', 'block-title',
  'list-item', 'caption', 'quote', 'quote-attribution', 'statement',
  'board-number', 'board-eyebrow', 'board-title', 'tab-label',
  'contents-number', 'contents-title', 'contents-folio',
  'table-number', 'table-head', 'table-cell', 'table-caption',
  'bar-label', 'bar-value', 'timeline-when', 'timeline-what',
  'compare-tag', 'margin-note', 'opener-number', 'imprint', 'colophon-label',
  // The curtain and the closed book, which are copy the reader meets BEFORE any
  // page — and which the reference catalogue names separately because they are
  // the show, not the text. `spine` and `hint` are ours: the reference has no
  // closed book to letter.
  'curtain-eyebrow', 'curtain-title', 'curtain-sub', 'hint', 'spine',
])

/**
 * Which layout a page is using, decided from what the page actually CONTAINS.
 *
 * Deterministic on purpose. The alternative — asking a model to look at a chunk
 * and name its layout — gives a different answer on a rebuild, and a book whose
 * pages silently reshuffle between builds is not a book anyone can proofread.
 *
 * ORDER IS THE CONTRACT. The tests run top to bottom and the first match wins,
 * so the most specific shapes have to come first: a page holding a table AND a
 * sticky note is a table page that happens to have a note on it, never a
 * `has-sticky` page that happens to contain a table.
 */
export function pickLayout(html: string, kind: 'cover' | 'content' | 'hard'): Layout {
  if (kind === 'cover') return 'cover'
  if (kind === 'hard') return 'divider'

  const has = (re: RegExp) => re.test(html)
  // Text with the markup stripped — used to tell "a page that IS a quote" from
  // "a page with a quote on it", which is a difference of proportion, not kind.
  const bare = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  const inside = (re: RegExp) => (html.match(re)?.[1] ?? '')
    .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  /** Does one block account for essentially the whole page? */
  const dominates = (text: string) => bare.length > 0 && text.length >= bare.length * 0.7

  if (has(/<table[\s>]/)) return 'ptable'
  if (has(/class="[^"]*\bdiagram-bars\b/)) return 'barchart'
  if (has(/class="[^"]*\btimeline\b/)) return 'timeline'
  if (has(/class="[^"]*\bcompare\b/)) return 'compare'
  if (has(/class="[^"]*\bcolophon\b/)) return 'colophon'
  if (has(/class="[^"]*\bmarginalia\b/)) return 'marginalia'
  if (has(/class="[^"]*\bcontents\b/)) return 'contents'
  if (has(/class="[^"]*\bopener\b/)) return 'opener'

  // A picture with essentially no words is a bleed; `full-bleed` is the pair
  // that spans a spread and is marked explicitly, because a single element
  // cannot span two leaves and the halves live on different sheets of paper.
  // Keyed off `bleed-out`, the block an author writes — `full-bleed` is the
  // class this decision PUTS on the page, so matching it here would be circular.
  if (has(/class="[^"]*\bbleed-out\b/)) return 'full-bleed'
  // `renderLayouts` has already built the grid if this page is one, so agree
  // with it rather than re-deriving from the picture and risking the two
  // disagreeing — a page laid out as a half-bleed but labelled prose gets none
  // of the layout's rules and reads as a picture floating mid-page.
  if (has(/class="[^"]*\bhalf-bleed\b/)) return 'half-bleed'

  // Proportion, not presence. A pull quote inside three paragraphs of argument
  // is prose with a quote in it; a page that is nothing BUT the quote is a
  // quote page, and the silence around it is the layout.
  if (has(/class="[^"]*\bstatement\b/) && dominates(inside(/class="[^"]*\bstatement\b[^"]*"[^>]*>([\s\S]*?)<\/(?:div|p|blockquote)>/)))
    return 'statement'
  if (has(/class="[^"]*\bpullquote\b/) && dominates(inside(/class="[^"]*\bpullquote\b[^"]*"[^>]*>([\s\S]*?)<\/(?:div|blockquote)>/)))
    return 'quote-page'

  // A takeaway ALWAYS lands last on its page, so a page carrying one is a
  // takeaway page regardless of what else sits above it.
  if (has(/class="[^"]*\btakeaway\b/)) return 'takeaway'
  if (has(/class="[^"]*\bsticky\b/)) return 'has-sticky'
  return 'prose'
}

/**
 * Tag every element that holds copy with the role that copy plays.
 *
 * A DOM pass rather than a regex sweep: roles depend on where an element SITS
 * (a `<td>` inside `<thead>` is a `table-head`, the same tag inside `<tbody>` is
 * a `table-cell`), and that is a tree question. Regexes cannot see ancestry, and
 * the version of this that tried produced `table-cell` for every header in the
 * book.
 *
 * Only leaf-level text elements are tagged. Tagging a wrapper as well would
 * double-count every string in the audit and make `[data-slot="body"]` return
 * the paragraph and its container both.
 */
export function tagSlots(html: string): string {
  if (!html.trim()) return html
  const { document } = parseHTML(`<!doctype html><html><body>${html}</body></html>`)

  const role = (el: Element): string | null => {
    const tag = el.tagName.toLowerCase()
    const cls = el.getAttribute('class') ?? ''
    const inside = (sel: string) => el.closest(sel) !== null

    if (inside('.contents')) {
      if (cls.includes('contents-n')) return 'contents-number'
      if (cls.includes('contents-t')) return 'contents-title'
      if (cls.includes('contents-f')) return 'contents-folio'
    }
    if (tag === 'th') return 'table-head'
    if (tag === 'td') return 'table-cell'
    if (tag === 'caption') return 'table-caption'
    if (tag === 'figcaption') return 'caption'
    if (tag === 'li') return 'list-item'
    if (tag === 'blockquote') return 'quote'
    if (/^h[1-6]$/.test(tag)) return cls.includes('block-title') ? 'block-title' : 'heading'
    if (cls.includes('margin-note')) return 'margin-note'
    if (cls.includes('compare-tag')) return 'compare-tag'
    if (cls.includes('tl-when')) return 'timeline-when'
    if (cls.includes('tl-what')) return 'timeline-what'
    if (cls.includes('bar-label')) return 'bar-label'
    if (cls.includes('bar-v')) return 'bar-value'
    if (cls.includes('statement')) return 'statement'
    if (tag === 'p') return 'body'
    return null
  }

  for (const el of document.querySelectorAll('*') as unknown as Iterable<Element>) {
    if (el.getAttribute('data-slot')) continue
    // Only elements whose own text is theirs — a <div> wrapping three
    // paragraphs holds no copy of its own, its children do.
    const ownText = [...(el.childNodes as unknown as Iterable<Node>)]
      .filter((n) => n.nodeType === 3).map((n) => n.textContent ?? '').join('').trim()
    if (!ownText) continue
    const r = role(el)
    if (r) el.setAttribute('data-slot', r)
  }

  return document.body.innerHTML
}

/**
 * Build the internal scaffolding each catalogue layout needs.
 *
 * Markdown can express a list of things; it cannot express a rail with dots on
 * it, a tagged comparison panel, or a narrow column with notes in the outer
 * margin. So the author writes the CONTENT and this builds the STRUCTURE around
 * it — which is the same division the design draws: "adding a page should be
 * copying a block and changing the words."
 *
 * Runs after markdown-it and before slot tagging, so the elements it creates
 * get their roles from the same pass as everything else.
 */
export function renderLayouts(html: string): string {
  // `<img` is in the guard because the half-bleed is the one layout with no
  // block of its own — it is recognised from a page being mostly a picture. Left
  // out, a plain image page returned here untouched and the grid was never
  // built, so the picture floated in the middle of the page instead of running
  // off the fore-edge. The layout looked unimplemented; it was just unreached.
  // Every shape this function touches has to appear here, and the cost of
  // forgetting one is silent: the function returns untouched, the layout looks
  // unimplemented, and nothing fails. It has happened twice — the half-bleed
  // grid was never built because a plain image page matched nothing, and the
  // quote attribution never ran for the same reason.
  if (!/timeline|compare|marginalia|colophon|opener|bleed-out|pullquote|<img/.test(html)) return html
  const { document } = parseHTML(`<!doctype html><html><body>${html}</body></html>`)

  /**
   * The lines an author wrote inside a block.
   *
   * Split on newlines as well as on elements, because Markdown folds
   * consecutive lines into ONE paragraph — three timeline stops written on
   * three lines arrive as a single <p> with soft breaks in it, and reading one
   * line per element produced a timeline with one stop on it. The authored
   * shape is a line; the rendered shape is not, and this is where they meet.
   */
  const rows = (el: Element) =>
    [...(el.querySelectorAll('p, li') as unknown as Iterable<Element>)]
      .flatMap((p) => (p.innerHTML ?? '')
        .split(/<br\s*\/?>|\n/)
        .map((s) => s.replace(/<[^>]+>/g, '').trim()))
      .filter(Boolean)

  // ── timeline ──────────────────────────────────────────────────────────
  // One rail across the gutter, drawn outward from the fold, with the stops
  // written `when | what`. The rail is a sibling of the stops rather than a
  // border on them, because it has to extend past the page's own margins to
  // meet its other half on the facing page.
  for (const el of [...document.querySelectorAll('.timeline')] as Element[]) {
    const stops = rows(el).map((line) => {
      const [when, what] = line.split('|').map((s) => s.trim())
      return `<div class="tl-stop"><div class="tl-dot"></div><div class="tl-cap">` +
        `<div class="tl-when" data-slot="timeline-when">${esc(when ?? '')}</div>` +
        `<div class="tl-what" data-slot="timeline-what">${esc(what ?? '')}</div></div></div>`
    }).join('')
    el.innerHTML = `<div class="tl-rail"></div><div class="tl-stops">${stops}</div>`
  }

  // ── before / after ────────────────────────────────────────────────────
  // Both sides carry the SAME structure; the comparison is only honest if the
  // one difference is the content. The tag comes from the block's own title.
  for (const el of [...document.querySelectorAll('.compare')] as Element[]) {
    const title = el.querySelector('.block-title')
    const tag = (title?.textContent ?? 'before').trim()
    title?.remove()
    el.classList.add(/after/i.test(tag) ? 'after' : 'before')
    el.innerHTML = `<div class="compare-tag" data-slot="compare-tag">${esc(tag)}</div>` +
      `<div class="compare-body">${el.innerHTML}</div>`
  }

  // ── marginalia ────────────────────────────────────────────────────────
  // A blockquote is the note; everything else is the column. Blockquote is the
  // right carrier because that is already "an aside" in Markdown's own grammar,
  // so the source reads as what it produces. The CSS puts the notes in the
  // OUTER margin on both sides — never the gutter, nobody can write in a fold.
  for (const el of [...document.querySelectorAll('.marginalia')] as Element[]) {
    const notes = [...(el.querySelectorAll('blockquote') as unknown as Iterable<Element>)]
    const noteHtml = notes.map((n) => {
      n.remove()
      return `<div data-slot="margin-note">${(n.textContent ?? '').trim()}</div>`
    }).join('')
    el.innerHTML = `<div class="marginalia-main">${el.innerHTML}</div>` +
      `<div class="marginalia-notes">${noteHtml}</div>`
  }

  // ── colophon ──────────────────────────────────────────────────────────
  // The record of how the book was made. A rule, then the prose, then the
  // imprint in caps. It carries no folio by convention — that is enforced by
  // the folio pass, not here.
  for (const el of [...document.querySelectorAll('.colophon')] as Element[]) {
    const paras = [...(el.querySelectorAll('p') as unknown as Iterable<Element>)]
    const mark = paras.length > 1 ? paras.pop()! : null
    const markHtml = mark
      ? `<div class="colophon-mark" data-slot="colophon-label">${(mark.textContent ?? '').trim()}</div>`
      : ''
    mark?.remove()
    el.innerHTML = `<div class="colophon-rule"></div>${el.innerHTML}${markHtml}`
  }

  // ── chapter opener ────────────────────────────────────────────────────
  // The only place in the book where a paragraph is decorated: a drop cap four
  // lines deep, cut by CSS ::first-letter rather than by splitting the text, so
  // the words stay one selectable, searchable string.
  for (const el of [...document.querySelectorAll('.opener')] as Element[]) {
    const title = el.querySelector('.block-title')
    const n = (title?.textContent ?? '').trim()
    title?.remove()
    const body = [...(el.querySelectorAll('p') as unknown as Iterable<Element>)]
    body.forEach((p) => p.classList.add('opener-body'))
    if (n) el.innerHTML = `<div class="opener-n" data-slot="opener-number">${esc(n)}</div>${el.innerHTML}`
  }

  // ── quote attribution ─────────────────────────────────────────────────
  // A quote page is a quote AND who said it, and the two must not look alike.
  // Without this the attribution rendered as a second body paragraph in the
  // same hand at the same size — visually identical to the sentence it was
  // attributing, so the page read as two quotes. The design gives it its own
  // role for exactly that reason.
  for (const el of [...document.querySelectorAll('.pullquote')] as Element[]) {
    const paras = [...(el.querySelectorAll('p') as unknown as Iterable<Element>)]
    if (paras.length < 2) continue
    const last = paras[paras.length - 1]!
    const text = (last.textContent ?? '').trim()
    // An attribution is short and usually opens with a dash or an em dash. A
    // long final paragraph is part of the quotation, not its source.
    if (text.length > 90 && !/^[\u2014\u2013-]/.test(text)) continue
    last.className = 'quote-by'
    last.setAttribute('data-slot', 'quote-attribution')
  }

  // ── half bleed ────────────────────────────────────────────────────────
  // A picture running off the FORE-EDGE with the copy in the inner column.
  // Built here rather than authored, because the shape is entirely structural:
  // a two-column grid whose art cell carries negative margins to reach three
  // page edges. Never off the gutter — paper is bound at the spine, so nothing
  // can bleed there, and the CSS puts the art on the outer side of whichever
  // page it lands on.
  //
  // Recognised the same way `pickLayout` recognises the page: a picture, and
  // few enough words that the picture is the point. Built BEFORE the layout is
  // chosen, so the choice can simply see `.half-bleed` and agree.
  {
    const body = document.body
    const imgs = [...(body.querySelectorAll('img') as unknown as Iterable<Element>)]
    const words = (body.textContent ?? '').replace(/\s+/g, ' ').trim()
    const alreadyLaidOut = body.querySelector('.bleed-out, .half-bleed, .marginalia, .compare, .timeline')
    if (imgs.length === 1 && !alreadyLaidOut && words.length < 420) {
      const art = imgs[0]!
      // The picture's own paragraph is scaffolding, not copy — unwrap it, or
      // the art cell inherits a paragraph's margins and stops reaching the edge.
      const holder = art.parentElement?.tagName === 'P' ? art.parentElement : art
      const rest = [...(body.children as unknown as Iterable<Element>)]
        .filter((c) => c !== holder).map((c) => c.outerHTML).join('')
      body.innerHTML =
        `<div class="half-bleed">` +
        `<div class="half-bleed-art">${art.outerHTML}</div>` +
        `<div class="half-bleed-copy">${rest}</div>` +
        `</div>`
    }
  }

  // ── full bleed ────────────────────────────────────────────────────────
  // The picture runs to every edge. Its caption is PINNED, never pulled: the
  // page-rhythm rule zeroes direct children's margins with !important, so a
  // negative margin does nothing here — and a reveal's slide transform would
  // put a pinned element straight back off the edge, which is why a bleed
  // fades and never slides.
  for (const el of [...document.querySelectorAll('.bleed-out')] as Element[]) {
    // The `full-bleed` class goes on the PAGE, not here — this runs on the
    // page's inner HTML, before it is wrapped, so there is no .page to reach.
    // pageHtml adds it from the layout name instead.
    const title = el.querySelector('.block-title')
    const caption = (title?.textContent ?? '').trim()
    title?.remove()
    if (caption) {
      const cap = document.createElement('div')
      cap.className = 'bleed-caption'
      cap.setAttribute('data-slot', 'caption')
      cap.textContent = caption
      el.appendChild(cap)
    }
  }

  return document.body.innerHTML
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/**
 * Stick each note ONTO the block above it.
 *
 * DESIGN.md §10: a sticky belongs to a paragraph or a block — positioned
 * against it, overlapping its edge, hanging into the margin. "It never gets a
 * page, a column slot or a centred position of its own: that reads as a
 * designed panel, which is the opposite of a note."
 *
 * Markdown cannot express containment here — `:::sticky` closes as a sibling of
 * whatever it follows — so the note arrives beside its host and rendered as
 * exactly the designed panel the design rules out. This moves it inside, which
 * is what `has-sticky` and its absolute positioning need to work at all.
 *
 * The corner alternates so a page carrying two notes does not stack them, and
 * it is derived from position rather than randomised: a re-render mid
 * presentation must not visibly reshuffle the notes.
 */
export function attachStickies(html: string): string {
  if (!html.includes('sticky')) return html
  const { document } = parseHTML(`<!doctype html><html><body>${html}</body></html>`)
  const corners = ['right', 'bl', 'left', 'br']
  let n = 0

  for (const note of [...document.querySelectorAll('.sticky')] as Element[]) {
    // Already stuck onto something — leave it be.
    if (note.parentElement?.classList.contains('has-sticky')) continue
    const host = note.previousElementSibling as Element | null
    // Nothing to stick it to: the first thing on a page has no host, and a note
    // with no referent is a standalone note, which is a shape the design keeps.
    if (!host || host.classList.contains('sticky')) { note.classList.add('sticky-alone'); continue }
    note.setAttribute('data-at', corners[n % corners.length]!)
    n++

    // A <p> CANNOT CONTAIN A <div>, and nothing here will tell you so.
    //
    // linkedom accepts `p.appendChild(div)` and serialises exactly what it was
    // given. The BROWSER then re-parses that markup under HTML's own rules,
    // which close an open <p> at the first block-level child — so the note is
    // ejected to become the paragraph's SIBLING, losing `.has-sticky`'s
    // positioning context along with it. The note then lands wherever the flow
    // puts it, un-rotated, reading as a designed panel: the precise thing
    // DESIGN.md §10 says a sticky must never be.
    //
    // Nothing fails. The build is clean, the DOM in linkedom is correct, and
    // only the browser disagrees. So when the host cannot legally hold the
    // note, wrap the host instead of reaching inside it.
    const canHoldFlow = !['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'DT', 'DD']
      .includes(host.tagName)
    if (canHoldFlow) {
      host.classList.add('has-sticky')
      host.appendChild(note)
    } else {
      const wrap = document.createElement('div')
      wrap.className = 'has-sticky'
      host.replaceWith(wrap)
      wrap.appendChild(host)
      wrap.appendChild(note)
    }
  }
  return document.body.innerHTML
}

/**
 * A human-readable name for a page, so a comment or a bug report can point at
 * one. "leaf 7 back" is a position and moves when a section is inserted; a
 * title does not.
 */
export function screenLabel(title: string, index: number, layout: Layout): string {
  const named = title.trim().replace(/\s+/g, ' ').slice(0, 48)
  return named ? `${index + 1} · ${named}` : `${index + 1} · ${layout}`
}
