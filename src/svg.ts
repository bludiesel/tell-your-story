/**
 * svg.ts — SVG built with a real SVG library, at BUILD TIME.
 *
 * These pictures used to be template strings. That is how a mis-encoded `#`
 * turned the paper grain into a solid black tile across every page: the markup
 * was never parsed, only concatenated, so nothing could tell us it was wrong.
 *
 * Now svg.js builds an actual DOM and serialises it, so the output is
 * well-formed by construction and `encodeURIComponent` runs exactly once, over
 * a known-good string.
 *
 * DOM BACKEND: linkedom, not svgdom. svgdom is the usual pairing but it drags
 * in `fontkit` for text metrics, whose dependency chain does not resolve under
 * Bun (`ENOENT … unicode-properties`) — it fails under plain Node here too.
 * linkedom is lighter, has no native deps, and svg.js only needs somewhere to
 * hang elements. One caveat found the hard way: `SVG(someNode)` does not adopt
 * a hand-made node under linkedom — build with `SVG().addTo(document.body)`.
 *
 * NOTHING HERE SHIPS. svg.js and linkedom are devDependencies; what lands in a
 * book is a finished data URI. The reader downloads zero bytes of SVG tooling.
 */

import { parseHTML } from 'linkedom'
import { SVG, registerWindow, type Svg } from '@svgdotjs/svg.js'

let doc: Document | undefined

function canvas(width: number, height: number): Svg {
  if (!doc) {
    const { window, document } = parseHTML('<!doctype html><html><body></body></html>')

    // svg.js's text() calls window.getComputedStyle to work out line spacing,
    // and linkedom does not implement it — the call throws and takes the whole
    // build with it. THIS IS WHY the original code here only ever drew shapes
    // and paths: text was quietly off the table.
    //
    // A minimal shim is enough. svg.js only reads font-size, and only to
    // position subsequent tspans; a single-line label never uses the value.
    // Returning a fixed 16px is therefore correct for what we generate, and
    // wrong only for multi-line text, which we do not emit.
    if (typeof (window as { getComputedStyle?: unknown }).getComputedStyle !== 'function') {
      ;(window as unknown as { getComputedStyle: () => { getPropertyValue: () => string } })
        .getComputedStyle = () => ({ getPropertyValue: () => '16px' })
    }

    registerWindow(window as unknown as Window, document as unknown as Document)
    doc = document as unknown as Document
  }
  return SVG().addTo(doc.body).size(width, height) as Svg
}

/**
 * A dangling `url(#thing)` is the exact failure that painted every page black:
 * the filter never resolved, so the rect fell back to its default fill. The
 * markup was perfectly well-formed — so validating the XML alone would NOT
 * have caught it. This checks the references themselves.
 */
export function assertReferencesResolve(svg: string, label: string): void {
  const declared = new Set([...svg.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))
  const used = [...svg.matchAll(/url\(#([^)]+)\)/g)].map((m) => m[1])
  const dangling = used.filter((id) => !declared.has(id))
  if (dangling.length > 0) {
    throw new Error(
      `${label}: references ${dangling.map((d) => `url(#${d})`).join(', ')} ` +
      `but no element declares that id. The shape would render with its ` +
      `default fill — solid black — instead of the intended effect.`,
    )
  }
}

/** Serialise to a data URI. The single encode point for every picture here. */
function toDataUri(svg: Svg, label: string): string {
  const markup = svg.svg()
  assertReferencesResolve(markup, label)
  return `data:image/svg+xml,${encodeURIComponent(markup)}`
}

/** Paper grain: fractal noise at very low alpha, tiled across a page. */
export function grainUri(): string {
  const svg = canvas(160, 160)
  const filter = svg.defs().element('filter').attr({ id: 'grain' })
  filter.element('feTurbulence').attr({
    type: 'fractalNoise', baseFrequency: 0.9, numOctaves: 2,
  })
  filter.element('feColorMatrix').attr({
    values: '0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .045 0',
  })
  // fill:none is belt-and-braces: if the filter ever failed to resolve, this
  // stops the rect painting solid black. assertReferencesResolve is the belt.
  svg.rect(160, 160).attr({ fill: 'none', filter: 'url(#grain)' })
  return toDataUri(svg, 'paper grain')
}

/** Hand-drawn tick, for checklists and worksheets. */
export function checkMarkUri(colour: string): string {
  const svg = canvas(32, 32)
  svg.path('M5 17 q4 1 7 8 q3 -16 16 -20').attr({
    fill: 'none', stroke: colour, 'stroke-width': 3.4,
    'stroke-linecap': 'round', 'stroke-linejoin': 'round',
  })
  return toDataUri(svg, 'check mark')
}

/** Hand-drawn cross. */
export function crossMarkUri(colour: string): string {
  const svg = canvas(32, 32)
  svg.path('M7 6 q10 9 19 20 M26 7 q-10 9 -19 19').attr({
    fill: 'none', stroke: colour, 'stroke-width': 3.2, 'stroke-linecap': 'round',
  })
  return toDataUri(svg, 'cross mark')
}

/** Hand-drawn ring, for circling an answer. */
export function circleMarkUri(colour: string): string {
  const svg = canvas(140, 64)
  svg.attr({ preserveAspectRatio: 'none' })
  svg.path('M16 34 q2 -26 60 -26 q60 0 50 30 q-6 22 -62 22 q-54 0 -46 -28').attr({
    fill: 'none', stroke: colour, 'stroke-width': 2.4, 'stroke-linecap': 'round',
  })
  return toDataUri(svg, 'circle mark')
}

/**
 * The cover mark, drawn from the palette rather than shipped as a file, so a
 * rebrand re-colours it with no artwork to replace.
 */
export function markSvg(opts: {
  monogram: string
  accent: string
  ink: string
  plate: string
  label?: string
}): string {
  const svg = canvas(300, 200)
  svg.attr({ role: 'img', 'aria-label': opts.label ?? 'Brand mark' })
  svg.rect(284, 184).move(8, 8).radius(16).attr({
    fill: 'none', stroke: opts.accent, 'stroke-width': 4, 'stroke-opacity': 0.7,
  })
  // `svg.text()` is unusable here for the reason spelled out above `label()`:
  // its constructor builds a tspan and MEASURES it, reaching getBBox(), which
  // linkedom cannot answer because it has no renderer. This function went years
  // without hitting that because nothing called it — the build shipped a static
  // mark.svg instead — so the first real call died at `Getting bbox of element
  // TEXT is not possible`. Create the element directly, exactly as `label` does.
  const mono = svg.element('text').attr({
    x: 150, y: 98, 'text-anchor': 'middle', 'dominant-baseline': 'central',
    'font-family': 'Barlow Condensed, Arial Narrow, sans-serif',
    'font-weight': 700, 'font-size': 86, 'letter-spacing': 6, fill: opts.ink,
  })
  mono.node.textContent = opts.monogram
  svg.rect(90, 8).move(105, 140).radius(4).attr({ fill: opts.accent })
  const markup = svg.svg()
  assertReferencesResolve(markup, 'cover mark')
  return markup
}

// ── diagrams ─────────────────────────────────────────────────────────────────
/**
 * Real work for svg.js: build diagrams AT BUILD TIME from a few lines of
 * Markdown, so a page can carry a proper flow or cycle without anyone drawing
 * one and without a rendering library reaching the reader.
 *
 * Every shape is tagged with a class the runtime animates on page reveal:
 *   .dg-node   the boxes / segments — arrive in sequence
 *   .dg-link   the connectors — draw themselves on via stroke-dashoffset
 *   .dg-label  the text — fades in behind its node
 *
 * These are emitted INLINE (not as a data URI) precisely so GSAP can reach
 * inside and animate the individual elements. A data URI is an opaque image;
 * an inline <svg> is a document.
 *
 * Colour comes in as arguments rather than being read from CSS, because this
 * runs in Node where there is no cascade — the caller passes theme tokens.
 */

/**
 * Place text by COORDINATE, never by measurement.
 *
 * svg.js's `.center()` and `.move()` on a text node call `getBBox()`, which is
 * a real layout API — linkedom has no renderer and cannot answer it, so the
 * build dies with "Getting bbox of element TEXT is not possible". Shimming
 * getComputedStyle gets text created; nothing can shim actual text metrics.
 *
 * So anchoring is handed to SVG itself: `text-anchor` and `dominant-baseline`
 * centre the glyphs at render time, in the browser, where the metrics exist.
 * The result is better anyway — it stays correct after a rebrand changes the
 * font, whereas a build-time measurement would have baked in the old one.
 */
function label(
  draw: Svg, text: string, x: number, y: number,
  opts: { size: number; fill: string; weight?: string; anchor?: string },
) {
  // `draw.text()` is unusable here: its constructor builds a tspan and measures
  // it, so it reaches getBBox() no matter what you set afterwards. Creating the
  // element directly sidesteps the Text class entirely while svg.js continues to
  // do everything else — shapes, paths, structure, serialisation.
  const el = draw.element('text').attr({
    x, y,
    'text-anchor': opts.anchor ?? 'middle',
    'dominant-baseline': 'central',
    'font-size': opts.size,
    'font-weight': opts.weight ?? '400',
    fill: opts.fill,
  })
  el.node.textContent = text
  return el
}

export interface DiagramColours {
  node: string
  nodeEdge: string
  link: string
  text: string
  accent: string
}

/** Left-to-right flow: step, arrow, step, arrow, step. */
export function flowDiagram(steps: string[], c: DiagramColours): string {
  const n = Math.max(steps.length, 1)
  const boxW = 150, boxH = 74, gap = 46
  const width = n * boxW + (n - 1) * gap
  const height = 120
  const y = (height - boxH) / 2
  const draw = canvas(width, height).viewbox(0, 0, width, height)

  steps.forEach((text, i) => {
    const x = i * (boxW + gap)
    if (i > 0) {
      const ax = x - gap, mid = y + boxH / 2
      draw.line(ax + 6, mid, x - 10, mid)
        .stroke({ color: c.link, width: 2.5, linecap: 'round' })
        .addClass('dg-link')
      draw.polygon(`${x - 10},${mid} ${x - 20},${mid - 6} ${x - 20},${mid + 6}`)
        .fill(c.link).addClass('dg-link')
    }
    draw.rect(boxW, boxH).move(x, y).radius(10)
      .fill(c.node).stroke({ color: i === n - 1 ? c.accent : c.nodeEdge, width: 2 })
      .addClass('dg-node')
    label(draw, text, x + boxW / 2, y + boxH / 2,
      { size: 15, fill: c.text, weight: '600' }).addClass('dg-label')
  })
  return draw.svg()
}

/** A closed cycle: steps evenly spaced round a circle, arrows between them. */
export function cycleDiagram(steps: string[], c: DiagramColours): string {
  const n = Math.max(steps.length, 2)
  const size = 380, r = 128, cx = size / 2, cy = size / 2, nodeR = 42
  const draw = canvas(size, size).viewbox(0, 0, size, size)

  const at = (i: number) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r }
  }

  // Arcs first so the nodes sit on top of them.
  for (let i = 0; i < n; i++) {
    const p = at(i), q = at((i + 1) % n)
    draw.path(`M ${p.x} ${p.y} A ${r} ${r} 0 0 1 ${q.x} ${q.y}`)
      .fill('none').stroke({ color: c.link, width: 2.5, linecap: 'round' })
      .addClass('dg-link')
  }
  steps.slice(0, n).forEach((text, i) => {
    const p = at(i)
    draw.circle(nodeR * 2).center(p.x, p.y)
      .fill(c.node).stroke({ color: c.nodeEdge, width: 2 })
      .addClass('dg-node')
    label(draw, String(i + 1), p.x, p.y - 9,
      { size: 17, fill: c.accent, weight: '700' }).addClass('dg-label')
    label(draw, text, p.x, p.y + 11, { size: 11, fill: c.text }).addClass('dg-label')
  })
  return draw.svg()
}

/** Horizontal bars for comparing a handful of values. */
export function barsDiagram(rows: Array<[string, number]>, c: DiagramColours): string {
  const n = Math.max(rows.length, 1)
  const width = 460, rowH = 46, labelW = 130, height = n * rowH + 10
  const max = Math.max(...rows.map(([, v]) => v), 1)
  const draw = canvas(width, height).viewbox(0, 0, width, height)

  rows.forEach(([name, value], i) => {
    const y = i * rowH + 8
    const barMax = width - labelW - 54
    const w = Math.max((value / max) * barMax, 3)
    label(draw, name, labelW - 12, y + 14,
      { size: 13, fill: c.text, anchor: 'end' }).addClass('dg-label')
    draw.rect(barMax, 20).move(labelW, y + 4).radius(10)
      .fill(c.node).opacity(0.45).addClass('dg-node')
    draw.rect(w, 20).move(labelW, y + 4).radius(10)
      .fill(i === 0 ? c.accent : c.link).addClass('dg-bar')
    label(draw, String(value), labelW + barMax + 10, y + 14,
      { size: 13, fill: c.text, weight: '600', anchor: 'start' }).addClass('dg-label')
  })
  return draw.svg()
}
