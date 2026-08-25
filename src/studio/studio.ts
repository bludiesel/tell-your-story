/**
 * studio.ts — the Ink Studio's behaviour.
 *
 * A page, not a command, and deliberately. Treating artwork is a judgement:
 * every picture wants its own numbers, and there is no way to guess them from a
 * filename. Sliders with the result on screen answer in seconds what flag-
 * guessing answers in a dozen rebuilds.
 *
 * It also means the tool needs NOTHING INSTALLED — not Node, not an image
 * library, not a browser engine of its own. The browser already decodes JPEG,
 * PNG, WebP and AVIF, and already encodes PNG. All this file adds is arithmetic.
 *
 * The preview is the real thing, not an impression of it: the paper, the grain
 * and the ink are the built theme's own values, injected by `build_studio.ts`,
 * so what an author approves here is what lands on the page.
 */

import { DEFAULT_INK, hexToRgb, INK_PRESETS, inkWash, type InkSettings, type Raster } from './ink.ts'

/** Written into the page by `scripts/build_studio.ts` from the real palette. */
declare const __INK_THEME__: { ink: string; paper: string; paper2: string; name: string }

const theme = { ...__INK_THEME__ }
let settings: InkSettings = { ...DEFAULT_INK }
let source: HTMLImageElement | null = null
let sourceName = 'artwork'

const $ = <T extends HTMLElement>(sel: string): T => {
  const el = document.querySelector<T>(sel)
  if (!el) throw new Error(`studio: ${sel} is not in the page`)
  return el
}

const preview = $<HTMLCanvasElement>('#preview')
const dropZone = $<HTMLElement>('#drop')
const stage = $<HTMLElement>('#stage')
const exportBtn = $<HTMLButtonElement>('#export')
const status = $<HTMLElement>('#status')

/**
 * PREVIEW SMALL, EXPORT LARGE.
 *
 * The treatment is measured in PIXELS — a 2px nib on a 900px preview is a
 * different drawing from a 2px nib on a 3250px export. Tuning against a small
 * preview and then exporting at full size therefore produces something the
 * author never approved: the same numbers, a finer and colder line.
 *
 * So the nib is scaled by the same factor the picture is, and what you tune is
 * what you get. The preview stays small because a slider that takes a second to
 * respond is a slider nobody explores.
 */
const PREVIEW_W = 900

/**
 * HOW WIDE THE EXPORT ACTUALLY NEEDS TO BE.
 *
 * Exporting at the source's own resolution is the obvious default and it is
 * wrong here. A 3250x4333 photograph came back as a 14.5 MB transparent PNG —
 * alpha does not compress like a photograph does — and this kit inlines its
 * pictures as base64, which adds another third. One picture would have
 * outweighed the entire rest of the book, in a format whose whole promise is
 * that you can email it.
 *
 * A page is 780x1040 in the fixed stage, and the biggest a picture gets is a
 * full bleed across a spread. 1600 is twice that on the long edge, which is
 * more than any display will resolve, so the default costs nothing visible.
 * Full size stays available for print or further editing.
 */
const EXPORT_WIDTHS = [900, 1200, 1600, 2400, 0] as const

/**
 * WEBP, NOT PNG, AND THE MEASUREMENT IS THE WHOLE ARGUMENT.
 *
 * The same 900x1200 drawing: PNG 1,838 KB, WebP at 0.8 592 KB. Three times
 * smaller for a picture whose alpha is the point, and this kit inlines its
 * images as base64 — which adds another third — so the format choice is worth
 * more than every other size decision here put together.
 *
 * PNG stays for print and for handing artwork to someone else's tool, where
 * lossless matters and one file's weight does not.
 */
const EXPORT_FORMATS = [
  { id: 'image/webp', quality: 0.8, ext: 'webp', label: 'WebP — small (recommended)' },
  { id: 'image/png', quality: undefined, ext: 'png', label: 'PNG — lossless, much larger' },
] as const

function render(width: number): Raster | null {
  if (!source) return null
  const scale = width / source.naturalWidth
  const w = Math.max(1, Math.round(width))
  const h = Math.max(1, Math.round(source.naturalHeight * scale))

  const cv = document.createElement('canvas')
  cv.width = w
  cv.height = h
  const ctx = cv.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('studio: this browser gave us no 2D canvas')
  ctx.drawImage(source, 0, 0, w, h)

  const scaled: InkSettings = { ...settings, nib: settings.nib * (w / PREVIEW_W) }
  return inkWash(ctx.getImageData(0, 0, w, h), hexToRgb(theme.ink), scaled)
}

function paint(): void {
  const t0 = performance.now()
  const result = render(PREVIEW_W)
  if (!result) return
  preview.width = result.width
  preview.height = result.height
  const ctx = preview.getContext('2d')
  if (!ctx) return
  ctx.putImageData(new ImageData(result.data, result.width, result.height), 0, 0)
  status.textContent =
    `${source!.naturalWidth}×${source!.naturalHeight} source · preview redrawn in ${Math.round(performance.now() - t0)} ms`
}

/** Load a picture the author dropped, picked, or pasted. */
async function accept(file: File): Promise<void> {
  if (!file.type.startsWith('image/')) {
    status.textContent = `${file.name} is not a picture — drop a JPEG, PNG, WebP or AVIF.`
    return
  }
  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.src = url
    await img.decode()
    source = img
    sourceName = file.name.replace(/\.[^.]+$/, '')
    stage.hidden = false
    dropZone.classList.add('loaded')
    exportBtn.disabled = false
    paint()
  } catch {
    status.textContent = `${file.name} could not be decoded — try a JPEG or PNG.`
  } finally {
    // Revoked only after decode(): letting go of the URL before the bytes are
    // read leaves a picture that silently never appears.
    URL.revokeObjectURL(url)
  }
}

function wireInput(): void {
  const picker = $<HTMLInputElement>('#file')
  picker.addEventListener('change', () => {
    const f = picker.files?.[0]
    if (f) void accept(f)
  })
  dropZone.addEventListener('click', () => picker.click())
  dropZone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); picker.click() }
  })
  for (const type of ['dragenter', 'dragover'] as const) {
    dropZone.addEventListener(type, (e) => { e.preventDefault(); dropZone.classList.add('over') })
  }
  for (const type of ['dragleave', 'drop'] as const) {
    dropZone.addEventListener(type, () => dropZone.classList.remove('over'))
  }
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault()
    const f = e.dataTransfer?.files?.[0]
    if (f) void accept(f)
  })
  // Paste, because a screenshot on the clipboard is how half of these arrive.
  window.addEventListener('paste', (e) => {
    const f = [...(e.clipboardData?.files ?? [])][0]
    if (f) void accept(f)
  })
}

function wireControls(): void {
  const bind = (id: keyof InkSettings): void => {
    const slider = $<HTMLInputElement>(`#${id}`)
    const readout = $<HTMLElement>(`#${id}-val`)
    const show = (): void => { readout.textContent = Number(slider.value).toFixed(2) }
    slider.addEventListener('input', () => {
      settings = { ...settings, [id]: Number(slider.value) }
      show()
      paint()
    })
    show()
  }
  bind('line'); bind('tone'); bind('nib')

  for (const btn of document.querySelectorAll<HTMLButtonElement>('[data-preset]')) {
    btn.addEventListener('click', () => {
      const preset = INK_PRESETS[btn.dataset.preset ?? '']
      if (!preset) return
      settings = { ...preset }
      for (const id of ['line', 'tone', 'nib'] as const) {
        const slider = $<HTMLInputElement>(`#${id}`)
        slider.value = String(settings[id])
        $<HTMLElement>(`#${id}-val`).textContent = settings[id].toFixed(2)
      }
      for (const other of document.querySelectorAll('[data-preset]')) other.removeAttribute('aria-current')
      btn.setAttribute('aria-current', 'true')
      paint()
    })
  }

  // A DARK GROUND IS A CHECK, NOT A THEME. The export carries alpha, so the
  // same file lands on whatever the page is. Flipping the backdrop is how an
  // author confirms the drawing is ink coverage and not a pale rectangle.
  const ground = $<HTMLInputElement>('#ground')
  ground.addEventListener('change', () => {
    document.body.classList.toggle('on-dark', ground.checked)
  })
}

/** 0 means "whatever the source is". */
function exportWidth(): number {
  const chosen = Number($<HTMLSelectElement>('#size').value)
  return chosen > 0 ? chosen : source!.naturalWidth
}

function exportFormat(): (typeof EXPORT_FORMATS)[number] {
  const id = $<HTMLSelectElement>('#format').value
  return EXPORT_FORMATS.find((f) => f.id === id) ?? EXPORT_FORMATS[0]
}

function wireExport(): void {
  const format = $<HTMLSelectElement>('#format')
  for (const f of EXPORT_FORMATS) {
    const opt = document.createElement('option')
    opt.value = f.id
    opt.textContent = f.label
    format.append(opt)
  }
  format.value = EXPORT_FORMATS[0].id

  const size = $<HTMLSelectElement>('#size')
  for (const w of EXPORT_WIDTHS) {
    const opt = document.createElement('option')
    opt.value = String(w)
    opt.textContent = w === 0 ? 'Full size (large file)' : `${w} px wide`
    size.append(opt)
  }
  size.value = '1200'

  exportBtn.addEventListener('click', () => {
    if (!source) return
    exportBtn.disabled = true
    status.textContent = 'Drawing at full size…'
    // Yielded to the browser first: a 3000px export blocks for long enough that
    // clicking would otherwise look like it did nothing at all.
    setTimeout(() => {
      try {
        const t0 = performance.now()
        const full = render(Math.min(exportWidth(), source!.naturalWidth))
        if (!full) return
        const cv = document.createElement('canvas')
        cv.width = full.width
        cv.height = full.height
        cv.getContext('2d')!.putImageData(new ImageData(full.data, full.width, full.height), 0, 0)
        const fmt = exportFormat()
        cv.toBlob((blob) => {
          if (!blob) { status.textContent = `The browser refused to encode ${fmt.ext.toUpperCase()}.`; return }
          const name = `${sourceName}.ink.${fmt.ext}`
          const a = document.createElement('a')
          a.href = URL.createObjectURL(blob)
          a.download = name
          a.click()
          setTimeout(() => URL.revokeObjectURL(a.href), 4000)
          // THE COST IS SHOWN, NOT BURIED. This kit packs pictures inside the
          // HTML, so a book's weight is the sum of these numbers plus a third
          // for base64 — an author who cannot see the figure cannot choose.
          const inBook = (blob.size * 1.37) / 1024
          status.textContent =
            `Saved ${name} — ${full.width}×${full.height}, ${(blob.size / 1024).toFixed(0)} KB ` +
            `(about ${inBook.toFixed(0)} KB once packed into a book), ` +
            `drawn in ${Math.round(performance.now() - t0)} ms`
        }, fmt.id, fmt.quality)
      } finally {
        exportBtn.disabled = false
      }
    }, 16)
  })
}

document.documentElement.style.setProperty('--paper', theme.paper)
document.documentElement.style.setProperty('--paper-2', theme.paper2)
document.documentElement.style.setProperty('--ink', theme.ink)
$<HTMLElement>('#theme-name').textContent = theme.name
wireInput()
wireControls()
wireExport()
