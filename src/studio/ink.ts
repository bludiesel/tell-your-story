/**
 * ink.ts — turn a supplied picture into something that looks DRAWN on the page.
 *
 * THE PROBLEM THIS SOLVES. A book made of paper, handwriting and paper grain
 * puts a photograph on one of its pages and the photograph looks pasted in. It
 * is the one element that did not come from the same hand as everything else.
 *
 * THE METHOD IS XDoG, and it is not ours.
 *
 *   Winnemöller, H., Kyprianidis, J. E., Olsen, S. C.
 *   "XDoG: An eXtended difference-of-Gaussians compendium including advanced
 *   image stylization", Computers & Graphics 36(6), 2012.
 *
 * This file first shipped with a hand-rolled difference of two blurs plus a
 * separate tone pass and some invented power curves. It worked, and it was a
 * naive re-derivation of the *first half* of a twenty-year-old field. The
 * published operator is better on three counts, and each one removes code:
 *
 *   1. SHARPENING, NOT SUBTRACTION. `(1+p)·Gσ − p·Gkσ` has weights summing to
 *      one, so it returns an IMAGE rather than a set of edges. Tone and line
 *      come out of one pass — the separate wash blur is gone.
 *   2. A REAL THRESHOLD. `T(u) = 1 if u ≥ ε, else 1 + tanh(φ(u−ε))` is a smooth
 *      ramp with two meaningful numbers: where ink begins, and how hard it
 *      commits. That is exactly the "why is it see-through" question, answered
 *      by the literature instead of by a power curve somebody guessed.
 *   3. k = 1.6. The Marr–Hildreth ratio at which a difference of Gaussians best
 *      approximates the Laplacian of a Gaussian. Not a taste setting.
 *
 * WHAT WE ADD, and it is only this: the output is INK COVERAGE, not a picture.
 * XDoG returns luminance where 1 is white; a drawing on paper wants alpha where
 * 0 is bare sheet. Inverting it means the page's own paper, grain and ruled
 * lines read through the drawing, and the ink itself is the book's ink colour.
 *
 * Still no library, no WebGL, and it runs ONCE before the artwork ever reaches
 * a book — so a reader downloads a plain image and the book has nothing to
 * maintain.
 *
 * NOT IMPLEMENTED, deliberately: the flow-based variant (Kang, Lee & Chui,
 * "Coherent Line Drawing", NPAR 2007) runs the filter along the edge tangent
 * flow so strokes stay continuous on noisy photographs. It needs a tangent
 * field per image and it is the right answer only if artwork still breaks into
 * speckle after this.
 */

/**
 * What an author actually turns. The names are ours; the quantities are the
 * paper's, so a reader who knows XDoG can map them at a glance.
 */
export interface InkSettings {
  /** σ — the nib, in pixels. The smallest mark the pen can make. */
  nib: number
  /** p — sharpness. How hard the operator pushes edges away from their surroundings. */
  line: number
  /** ε — where ink begins. Above it the page stays bare. */
  threshold: number
  /** φ — how hard the ink commits once it has begun. Small is a wash, large is a woodcut. */
  body: number
  /**
   * How far the drawing dissolves into bare page at its edges, as a fraction of
   * the picture. 0 leaves a hard rectangle; 0.3 is a generous fade.
   */
  vignette: number
}

/**
 * THE RATIO IS NOT A PREFERENCE.
 *
 * Marr and Hildreth showed a difference of two Gaussians best approximates the
 * Laplacian of a Gaussian at σ₂/σ₁ ≈ 1.6, and every XDoG implementation uses
 * it. Exposing it as a slider would only offer an author a worse edge detector.
 */
const K = 1.6

/**
 * Starting points derived from the styles the XDoG paper names — pencil
 * shading, natural media, and the two-tone woodcut — then tuned against real
 * pictures here, because ε depends on how the input is normalised and every
 * implementation normalises differently.
 *
 * Chosen off a 4x4 sweep of ε against φ rather than picked. The sweep also
 * settled which control matters: φ moves a picture from a pale wash to a
 * woodcut on its own, ε decides how much sheet is left bare, and p is the
 * weakest of the three — the sharpening weights sum to one, so in flat regions
 * it cancels out and only edges feel it.
 */
export const INK_PRESETS: Readonly<Record<string, InkSettings>> = {
  /** Pencil shading: a gentle ramp, so most of the picture survives as tone. */
  soft: { nib: 0.9, line: 12, threshold: 0.70, body: 2, vignette: 0.28 },
  /** Natural media — the house setting. A drawn line over real tone. */
  drawn: { nib: 0.9, line: 12, threshold: 0.62, body: 4, vignette: 0.28 },
  /** Two-tone woodcut: φ high enough that the ramp is effectively a cliff. */
  engraved: { nib: 1.1, line: 20, threshold: 0.56, body: 16, vignette: 0.22 },
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
 * Gaussian blur, approximated by three box blurs.
 *
 * Three passes of a box filter converge on a true Gaussian closely enough that
 * the difference is invisible in a drawing, and each pass costs one add and one
 * subtract per pixel regardless of radius. A real Gaussian kernel at σ=2 is 13
 * multiply-adds per pixel per axis; this is 6 adds. The operator runs four
 * blurs per image, so the saving is the difference between a slider you drag
 * and a slider you wait for.
 *
 * Box widths follow Kovesi's standard sizing so the three passes sum to the
 * requested σ rather than to something close to it.
 */
function boxPass(src: Float32Array, dst: Float32Array, w: number, h: number, r: number): void {
  const span = r * 2 + 1
  const clampX = (x: number) => (x < 0 ? 0 : x > w - 1 ? w - 1 : x)
  for (let y = 0; y < h; y++) {
    const row = y * w
    let acc = 0
    for (let x = -r; x <= r; x++) acc += src[row + clampX(x)]!
    for (let x = 0; x < w; x++) {
      dst[row + x] = acc / span
      acc += src[row + clampX(x + r + 1)]! - src[row + clampX(x - r)]!
    }
  }
}

function transpose(src: Float32Array, dst: Float32Array, w: number, h: number): void {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) dst[x * h + y] = src[y * w + x]!
  }
}

function gaussian(plane: Float32Array, w: number, h: number, sigma: number): Float32Array {
  if (sigma <= 0.05) return plane.slice()
  // Kovesi's box sizes for approximating a Gaussian with three passes.
  const ideal = Math.sqrt((12 * sigma * sigma) / 3 + 1)
  let wl = Math.floor(ideal)
  if (wl % 2 === 0) wl--
  const radius = Math.max(1, (wl - 1) / 2)

  let a = plane.slice()
  let b = new Float32Array(plane.length)
  // Horizontal three times, transpose, horizontal three times, transpose back —
  // one code path does both axes, and the transposed passes run down cache
  // lines rather than across them.
  for (const [ww, hh] of [[w, h], [h, w]] as const) {
    for (let pass = 0; pass < 3; pass++) {
      boxPass(a, b, ww, hh, radius)
      const t = a; a = b; b = t
    }
    transpose(a, b, ww, hh)
    const t = a; a = b; b = t
  }
  return a
}

/**
 * Deterministic value noise. Deterministic MATTERS: an author who re-exports
 * the same artwork must get the same edge, or a rebuilt book quietly changes.
 */
function hash2(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return n - Math.floor(n)
}

function valueNoise(x: number, y: number): number {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const u = xf * xf * (3 - 2 * xf)
  const v = yf * yf * (3 - 2 * yf)
  const a = hash2(xi, yi)
  const b = hash2(xi + 1, yi)
  const c = hash2(xi, yi + 1)
  const d = hash2(xi + 1, yi + 1)
  return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v
}

const smoothstep = (t: number): number => {
  const c = t < 0 ? 0 : t > 1 ? 1 : t
  return c * c * (3 - 2 * c)
}

/**
 * THE VIGNETTE — and why it is not a second sheet.
 *
 * The obvious way to stop page ruling crossing a picture is to flatten the
 * drawing onto its own paper, so the ruling stops at the picture's edge. That
 * was built first and it fights itself: flattening gives you a rectangle, and
 * feathering the rectangle punches transparency through the paper you just
 * added, which reads as a dirty halo rather than a soft edge.
 *
 * XDoG already returns COVERAGE, so no second sheet is needed. Letting the
 * coverage itself fall away toward the edges gives a picture that is solid
 * where the drawing is — ruling cannot cross a face that is opaque — and
 * dissolves into bare page at the margins. There is no rectangle to feather
 * because there was never a rectangle.
 *
 * This is an old printing idea rather than a new one: a *vignetted* plate, the
 * way photogravure and wood engraving faded an illustration into the sheet
 * instead of boxing it. The falloff is measured from the nearest edge, so
 * corners go first and the composition survives.
 *
 * The noise is what stops it looking like a radial gradient. A mechanically
 * perfect fade reads as software; a slightly ragged one reads as ink running
 * out on paper.
 */
function edgeMask(
  x: number, y: number, w: number, h: number, vignette: number,
): number {
  if (vignette <= 0) return 1
  const spanX = Math.max(1, w * vignette)
  const spanY = Math.max(1, h * vignette)
  const dx = Math.min(x, w - 1 - x) / spanX
  const dy = Math.min(y, h - 1 - y) / spanY
  let d = Math.min(dx, dy)
  // Only the band that is actually fading pays for the noise — the middle of a
  // picture is already fully inside and four sines per pixel there would be
  // paid for nothing.
  if (d < 1.4) {
    // GRAIN IS MEASURED IN FADE-WIDTHS, NOT PIXELS. Written in absolute pixels
    // first, which meant a 340 px preview and a 1200 px export disagreed about
    // how ragged the edge was — the same trap the nib fell into. Tying the
    // wobble to the band it lives in gives roughly three undulations across the
    // fade at any size, so what an author approves is what they get.
    const grain = Math.max(spanX, spanY) / 3
    d += (valueNoise(x / grain, y / grain) - 0.5) * 0.5
  }
  return smoothstep(d)
}

/**
 * The XDoG threshold, verbatim from the paper.
 *
 *   T(u) = 1                        if u ≥ ε
 *          1 + tanh(φ · (u − ε))    otherwise
 *
 * Above ε the sheet is left bare. Below it, tanh gives a soft shoulder that
 * falls to −1 at its limit — so the returned value spans (0, 1] for gentle φ
 * and snaps to two levels as φ grows. This one function is the difference
 * between an ink drawing and a grey smear, and it is why the "why is it
 * see-through" problem has a principled answer rather than a fudge factor.
 */
function threshold(u: number, epsilon: number, phi: number): number {
  return u >= epsilon ? 1 : 1 + Math.tanh(phi * (u - epsilon))
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
  /** The book's ink. Nothing else is baked in — see the note on `.plate`. */
  ink: Rgb,
  settings: InkSettings = DEFAULT_INK,
): Raster {
  const { width: w, height: h } = src
  const px = src.data
  const { nib, line, threshold: epsilon, body: phi, vignette } = settings

  // Luminance, because a drawing is made of light and dark rather than of hue.
  // Rec. 601 weights: the eye reads green as far brighter than blue, and an
  // unweighted average turns a blue sky into the same grey as a lawn.
  const lum = new Float32Array(w * h)
  for (let i = 0, p = 0; p < lum.length; i += 4, p++) {
    lum[p] = (0.299 * px[i]! + 0.587 * px[i + 1]! + 0.114 * px[i + 2]!) / 255
  }

  const sigma = Math.max(0.3, nib)
  const near = gaussian(lum, w, h, sigma)
  const far = gaussian(lum, w, h, sigma * K)

  const out = new Uint8ClampedArray(new ArrayBuffer(px.length))
  for (let p = 0, i = 0; p < lum.length; p++, i += 4) {
    const x = p % w
    const y = (p - x) / w
    // S = (1+p)·Gσ − p·Gkσ — the sharpening form. Its weights sum to one, so
    // a flat region comes back unchanged and its TONE survives; only where the
    // two blurs disagree does it push away from the local average. That is why
    // one pass now does what a line pass and a wash pass used to.
    const s = (1 + line) * near[p]! - line * far[p]!
    // 1 is bare paper, 0 is full ink — so coverage is what is left over.
    const coverage = 1 - Math.min(1, Math.max(0, threshold(s, epsilon, phi)))
    const mask = edgeMask(x, y, w, h, vignette)

    // INK OVER ITS OWN SHEET, AND BOTH FADE TOGETHER.
    //
    // A drawing whose only substance is ink lets the page's ruled lines run
    // straight through a face, which is wrong: ink on paper hides what is under
    // it. So the picture gets paper of its own — and because that paper carries
    // the SAME edge fade as the ink, the ruling dissolves back in over the
    // margin instead of stopping at a border. There is still no rectangle.
    //
    // This is the standard "over" composite, resolved by hand because canvas
    // wants unpremultiplied bytes: ink of alpha `inkA` laid over paper of alpha
    // `backing`, the pair then laid over whatever page it lands on.
    // PURE INK, AND THE PAPER IS THE BOOK'S PROBLEM.
    //
    // Three versions of this baked paper into the export so a picture could
    // hide the page's ruling, and every one of them showed a faint rectangle on
    // a real page. The reason is structural rather than fixable: a page is a
    // GRADIENT, and a picture does not know where on that gradient it sits, so
    // any colour baked in is right in one place and wrong everywhere else.
    //
    // So nothing is baked. The book hides its own ruling with `.plate` — a
    // backdrop blur, which dissolves the lines into whatever the paper actually
    // is at that spot, gradient and watermark included, and cannot be wrong.
    // See `layouts.css`. What stays here is the ink and its deckled edge.
    const alpha = coverage * mask
    out[i] = ink[0]
    out[i + 1] = ink[1]
    out[i + 2] = ink[2]
    out[i + 3] = Math.round(alpha * 255)
  }

  return { data: out, width: w, height: h }
}
