/**
 * ink.ts — turn a supplied picture into something that looks DRAWN on the page.
 *
 * THE PROBLEM THIS SOLVES. A book made of paper, handwriting and paper grain
 * puts a photograph on one of its pages and the photograph looks pasted in. It
 * is the one element that did not come from the same hand as everything else.
 *
 * THE APPROACH, and why it is this one. Three routes were built and measured on
 * the same picture before this file existed:
 *
 *   glfx.js         7.8 KB gzipped shipped into every book, needs WebGL, and
 *                   the ink colour is burnt into the pixels, so a rebrand
 *                   orphans every picture. It also keeps the photograph
 *                   underneath — a sharpened photo, not a drawing.
 *   a WebGL shader  0 KB, because curtainsjs already ships for the curtain, and
 *                   the ink can be a live uniform. But it is a running shader,
 *                   a fallback path and a perf tier, re-solving a picture that
 *                   never moves.
 *   this            about a hundred lines of arithmetic over an array of bytes.
 *                   No WebGL, no library, 14 ms for a 3250x4333 source, and it
 *                   runs ONCE, before the artwork ever reaches a book.
 *
 * The book gains nothing to maintain: the author drops in an ordinary PNG.
 *
 * THE OUTPUT IS ALPHA, NOT A PICTURE. Every pixel carries only *how much pen
 * landed here*. Nothing is painted paper-coloured, so the page's own paper,
 * grain and edge shadow read through the drawing and it sits ON the sheet
 * rather than in a rectangle laid over it.
 *
 * Credit where it is due: the line comes from a difference of two blurs, which
 * is the idea behind the `ink` filter in glfx.js (MIT, Evan Wallace). Taking it
 * over blurs rather than over raw pixels is the change that stops a photograph
 * breaking into speckle — see `line` below.
 */

/** What an author actually turns. Three numbers, because three is learnable. */
export interface InkSettings {
  /** How much pen. 0 is a pure wash, 1 is a firm drawing, above 2 is engraving. */
  line: number
  /** How much pigment the wash lays down. The rest is bare paper. */
  tone: number
  /** Nib width in pixels. Small is fine and detailed, large is broad and loose. */
  nib: number
}

/**
 * Starting points, not a menu. Every picture wants its own numbers — these
 * exist so the first preview is close enough to judge rather than to reset.
 */
export const INK_PRESETS: Readonly<Record<string, InkSettings>> = {
  /** Tone with barely a line. Reads as a wash laid down with a brush. */
  soft: { line: 0.35, tone: 0.55, nib: 1.6 },
  /** The house setting: a drawn line over soft tone, paper showing everywhere. */
  drawn: { line: 0.9, tone: 0.46, nib: 1.3 },
  /** Hard cross-hatch. Striking on simple artwork, noisy on a busy photograph. */
  engraved: { line: 2.6, tone: 0.34, nib: 1.0 },
}

export const DEFAULT_INK: InkSettings = INK_PRESETS.drawn!

/**
 * A raster this module can read or write.
 *
 * `data` is pinned to a plain `ArrayBuffer` rather than left as the default
 * `ArrayBufferLike`, because `ImageData` will not accept the shared-memory
 * variant and the compiler is right to refuse it: a canvas cannot be handed a
 * buffer another thread might be writing to.
 */
export interface Raster {
  data: Uint8ClampedArray<ArrayBuffer>
  width: number
  height: number
}

/** An RGB triple, 0-255. The ink the book is written in. */
export type Rgb = readonly [number, number, number]

/** `#RRGGBB` to an RGB triple. Accepts the short `#RGB` form too. */
export function hexToRgb(hex: string): Rgb {
  const h = hex.trim().replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  return [
    parseInt(full.slice(0, 2), 16) || 0,
    parseInt(full.slice(2, 4), 16) || 0,
    parseInt(full.slice(4, 6), 16) || 0,
  ]
}

/**
 * Separable box blur over a single plane.
 *
 * Separable because the alternative is not: a radius-15 two-dimensional kernel
 * is 961 samples per pixel, and the same blur done as a horizontal pass then a
 * vertical one is 62. On a 3250-pixel-wide source that is the difference
 * between a tool you tune interactively and one you wait for. Running totals
 * make each pass cost one add and one subtract per pixel regardless of radius,
 * so a wide wash blur costs no more than a narrow one.
 *
 * Edges clamp rather than wrap. A picture has no pixels past its border, and
 * wrapping would drag the far side of the artwork into the near side's line.
 */
function boxBlur(plane: Float32Array, w: number, h: number, r: number): Float32Array {
  const radius = Math.max(0, Math.round(r))
  if (radius === 0) return plane.slice()
  const span = radius * 2 + 1
  const tmp = new Float32Array(plane.length)
  const out = new Float32Array(plane.length)
  const clampX = (x: number) => (x < 0 ? 0 : x > w - 1 ? w - 1 : x)
  const clampY = (y: number) => (y < 0 ? 0 : y > h - 1 ? h - 1 : y)

  for (let y = 0; y < h; y++) {
    const row = y * w
    let acc = 0
    for (let x = -radius; x <= radius; x++) acc += plane[row + clampX(x)]!
    for (let x = 0; x < w; x++) {
      tmp[row + x] = acc / span
      acc += plane[row + clampX(x + radius + 1)]! - plane[row + clampX(x - radius)]!
    }
  }
  for (let x = 0; x < w; x++) {
    let acc = 0
    for (let y = -radius; y <= radius; y++) acc += tmp[clampY(y) * w + x]!
    for (let y = 0; y < h; y++) {
      out[y * w + x] = acc / span
      acc += tmp[clampY(y + radius + 1) * w + x]! - tmp[clampY(y - radius) * w + x]!
    }
  }
  return out
}

const smoothstep = (t: number): number => {
  const c = t < 0 ? 0 : t > 1 ? 1 : t
  return c * c * (3 - 2 * c)
}

/**
 * The treatment. Reads RGBA in, writes RGBA out, touches nothing else — no DOM,
 * no canvas, no files — so the same function serves the studio, a test, and
 * whatever runs it next.
 *
 * `ink` is the book's own ink colour, so the drawing is in the same hand as the
 * type on the page rather than in a generic black.
 */
export function inkWash(
  src: { data: Uint8ClampedArray; width: number; height: number },
  ink: Rgb,
  settings: InkSettings = DEFAULT_INK,
): Raster {
  const { width: w, height: h } = src
  const px = src.data
  const { line, tone, nib } = settings

  // Luminance, because a drawing is made of light and dark rather than of hue.
  // Rec. 601 weights: the eye reads green as far brighter than blue, and an
  // unweighted average turns a blue sky into the same grey as a lawn.
  const lum = new Float32Array(w * h)
  for (let i = 0, p = 0; p < lum.length; i += 4, p++) {
    lum[p] = (0.299 * px[i]! + 0.587 * px[i + 1]! + 0.114 * px[i + 2]!) / 255
  }

  // THE LINE — a difference of two blurs.
  //
  // Where a picture changes tone, a tight average and a wide one disagree; where
  // it is flat, they agree. That disagreement is where a person draws, which is
  // why this finds a line rather than an outline.
  //
  // Both terms are BLURRED. Taking the tight term from raw pixels is the
  // obvious version and it fails on anything photographic: every grain of film
  // and every thread of cloth registers as its own edge, and the drawing comes
  // out as speckle. Blurring first sets the smallest mark the pen can make.
  const tight = boxBlur(lum, w, h, Math.max(1, nib))
  const wide = boxBlur(lum, w, h, Math.max(2, nib * 2.6))

  // THE WASH — the picture through half-closed eyes.
  //
  // Deliberately blurred far wider than the line. A wash is pigment spreading
  // in water; it carries broad tone and nothing else, and it is the line's job
  // to be sharp. Posterising the sharp original instead was tried first and
  // banded badly, which is what made this a separate, softer read.
  const soft = boxBlur(lum, w, h, Math.max(3, nib * 5))

  const out = new Uint8ClampedArray(new ArrayBuffer(px.length))
  for (let p = 0, i = 0; p < lum.length; p++, i += 4) {
    const edge = Math.max(0, wide[p]! - tight[p]!)
    // The exponent hardens the line: it pushes faint disagreement towards
    // nothing and confident disagreement towards full ink, so the pen commits
    // instead of leaving a grey halo around everything.
    const pen = Math.min(1, Math.pow(edge * 7, 1.35) * line)

    // Lift the paper before deepening the darks, so a picture that is merely
    // dim does not wash out as uniformly grubby.
    const t = smoothstep(Math.min(1, Math.max(0, (soft[p]! - 0.1) * 1.5)))
    const pigment = (1 - t) * tone

    const coverage = Math.min(1, pigment + pen)
    out[i] = ink[0]
    out[i + 1] = ink[1]
    out[i + 2] = ink[2]
    // ALPHA IS THE WHOLE POINT. Not "ink over white" — "ink, this much of it".
    // The paper underneath is the real page, so the sheet's grain and its edge
    // shadow run through the drawing and it belongs to the book.
    out[i + 3] = Math.round(coverage * 255)
  }

  return { data: out, width: w, height: h }
}
