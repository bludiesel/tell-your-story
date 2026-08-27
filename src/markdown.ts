/**
 * markdown.ts — Markdown in, page HTML out.
 *
 * The old Python build hand-parsed `:::block` fences with ~970 lines of regex.
 * `markdown-it-container` is a library for exactly that syntax, so the block
 * system here is a short table of declarations instead of a parser.
 *
 * Pictures are the interesting part: every image the author writes, whether as
 * Markdown `![alt](photo.jpg)` or inside a `:::image` block, is handed to the
 * AssetStore and replaced with an `asset:<key>` reference. Nothing downstream
 * knows whether that will become an inlined data URI or a file path.
 */

import MarkdownIt from 'markdown-it'
import container from 'markdown-it-container'
import attrs from 'markdown-it-attrs'
import { parse as parseYaml } from 'yaml'

import { AssetStore, isExternalRef } from './assets.ts'

/** The instance type of markdown-it (its default export is a class value). */
type Renderer = InstanceType<typeof MarkdownIt>

export interface Frontmatter {
  title?: string
  subtitle?: string
  eyebrow?: string
  footer?: string
  theme?: string
  [key: string]: unknown
}

/** Blocks an author can use. Each becomes `:::name … :::`. */
const BLOCKS: Array<{ name: string; className: string; hasTitle?: boolean }> = [
  { name: 'note', className: 'callout callout-note', hasTitle: true },
  { name: 'warning', className: 'callout callout-warning', hasTitle: true },
  { name: 'tip', className: 'callout callout-tip', hasTitle: true },
  { name: 'takeaway', className: 'takeaway', hasTitle: true },
  // A physical sticky note pinned to the page, NOT a callout. `note` above is a
  // typeset aside that belongs to the document; `sticky` is something a person
  // stuck on afterwards, so it sits at an angle, casts a shadow and interrupts
  // the text block rather than flowing with it.
  { name: 'sticky', className: 'sticky', hasTitle: true },
  // `:::diagram flow|cycle|bars` — becomes a real SVG at build time, drawn by
  // svg.js and animated by GSAP on page reveal. The "title" is the diagram TYPE.
  { name: 'diagram', className: 'diagram', hasTitle: true },
  { name: 'columns', className: 'columns' },
  { name: 'quote', className: 'pullquote' },
  { name: 'big', className: 'statement' },
  // ── the layout catalogue ────────────────────────────────────────────────
  // These seven had styling in the design's stylesheet and no way to write one,
  // which makes them dead CSS. Each is restructured after rendering by
  // `renderLayouts` in book.ts, because a layout needs internal scaffolding
  // (a rail, a pair of columns, a tag) that Markdown has no way to express.
  // `contents` is the exception and is not here: it is GENERATED from the
  // sections, like the folios, because a table of contents that can disagree
  // with the book is worse than no table of contents.
  { name: 'timeline', className: 'timeline' },
  { name: 'compare', className: 'compare', hasTitle: true },
  { name: 'marginalia', className: 'marginalia' },
  { name: 'colophon', className: 'colophon' },
  { name: 'opener', className: 'opener', hasTitle: true },
  { name: 'bleed', className: 'bleed-out', hasTitle: true },
  // ── the workbook instruments ────────────────────────────────────────────
  // What a TRAINING book does that a book does not: it is followed, ticked and
  // filled in. The kit had eighteen ways to present a page and no way to hand
  // the reader a job, which for a workbook is the wrong gap to have.
  //
  //   checklist  boxes to tick, sized for a real pen
  //   steps      a numbered procedure — linear, unlike a flow diagram, which
  //              is for a decision that branches
  //   dodont     the two halves of a rule, side by side on ONE page. `compare`
  //              does this across a SPREAD, which is a different argument and
  //              breaks if the partner page is a turn away.
  //   anatomy    a picture with numbered pins on it and a key beneath
  { name: 'checklist', className: 'checklist', hasTitle: true },
  { name: 'steps', className: 'steps', hasTitle: true },
  { name: 'dodont', className: 'dodont', hasTitle: true },
  { name: 'anatomy', className: 'anatomy', hasTitle: true },
]

/**
 * Classes that change WHEN a block arrives during a presented page, never where
 * it sits. Listed here so a typo in a brief is ignored rather than pasted into
 * the page as a class nobody styles.
 */
export const STEP_CLASSES = new Set(['step-first', 'step-last', 'with-previous'])

export function createRenderer(): Renderer {
  const md = new MarkdownIt({ html: true, linkify: true, typographer: true })
  md.use(attrs)

  for (const block of BLOCKS) {
    md.use(container, block.name, {
      render(tokens: any[], idx: number) {
        const token = tokens[idx]
        if (token.nesting !== 1) return '</div>\n'
        let arg = token.info.trim().slice(block.name.length).trim()

        // PACING MARKERS on a fenced block.
        //
        // `markdown-it-attrs` handles `{.class}` on ordinary Markdown, but a
        // `:::` container is rendered by the function you are reading — attrs
        // never sees it, so the braces would have been printed as part of the
        // block's title. They are pulled out of the info string here and turned
        // into real classes, which is what the runtime reads to group and order
        // the steps.
        const step: string[] = []
        const take = (raw: string) => {
          for (const cls of raw.split(/\s+/)) {
            const name = cls.replace(/^\./, '')
            if (STEP_CLASSES.has(name) && !step.includes(name)) step.push(name)
          }
        }
        // TWO SOURCES, because markdown-it-attrs gets there first. It runs as a
        // core rule, sees `{.step-last}` on the fence line, strips it from the
        // info string and hangs it on the token as a real attribute — which this
        // renderer would then throw away, since it builds its own <div>. So read
        // the token's attributes AND the info string: whichever survived.
        take(String(token.attrGet?.('class') ?? ''))
        arg = arg.replace(/\{([^}]*)\}/g, (_match: string, inner: string) => {
          take(String(inner))
          return ''
        }).trim()

        const cls = [block.className, ...step].join(' ')
        const heading =
          block.hasTitle && arg ? `<h4 class="block-title">${md.utils.escapeHtml(arg)}</h4>` : ''
        return `<div class="${cls}">${heading}\n`
      },
    })
  }
  return md
}

/** Split `---` YAML frontmatter off the top of a document. */
export function splitFrontmatter(source: string): { fm: Frontmatter; body: string } {
  if (!source.startsWith('---')) return { fm: {}, body: source }
  const end = source.indexOf('\n---', 3)
  if (end === -1) return { fm: {}, body: source }
  const head = source.slice(3, end)
  const body = source.slice(end + 4)
  try {
    return { fm: (parseYaml(head) ?? {}) as Frontmatter, body }
  } catch {
    return { fm: {}, body }
  }
}

/**
 * Find every local image reference in rendered HTML, load it into the store,
 * and swap the `src` for an `asset:` reference.
 *
 * Absolute URLs and data URIs are left alone — the author asked for those on
 * purpose, and a book that reaches the network is their choice, not ours.
 */
export async function internImages(
  html: string,
  store: AssetStore,
  baseDir: string,
  referencedFrom: string,
): Promise<string> {
  const srcPattern = /(<img\b[^>]*?\ssrc=)(["'])(.*?)\2/gi
  const found: Array<{ whole: string; prefix: string; quote: string; src: string }> = []

  for (const m of html.matchAll(srcPattern)) {
    found.push({ whole: m[0], prefix: m[1], quote: m[2], src: m[3] })
  }

  let out = html
  for (const hit of found) {
    if (isExternalRef(hit.src) || hit.src.startsWith('asset:')) continue
    const ref = await store.add(hit.src, baseDir, referencedFrom)
    out = out.replace(hit.whole, `${hit.prefix}${hit.quote}${ref}${hit.quote}`)
  }

  // Background images written inline, e.g. style="background-image:url(bg.jpg)"
  const urlPattern = /url\((["']?)([^)"']+)\1\)/gi
  const urls = [...out.matchAll(urlPattern)]
  for (const m of urls) {
    const src = m[2]
    if (isExternalRef(src) || src.startsWith('asset:')) continue
    const ref = await store.add(src, baseDir, referencedFrom)
    out = out.replace(m[0], `url("${ref}")`)
  }

  return out
}
