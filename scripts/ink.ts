/**
 * ink.ts — apply the Ink Studio's treatment from the command line.
 *
 *   node dist/ink.mjs photo.jpg                      -> photo.ink.png, "drawn"
 *   node dist/ink.mjs photo.jpg art.png --soft
 *   node dist/ink.mjs photo.jpg --engraved --width 1600
 *   node dist/ink.mjs photo.jpg --line 40 --body 6 --fade 0.2
 *   node dist/ink.mjs photo.jpg --theme themes/slate.json
 *
 * WHO THIS IS FOR. The Ink Studio is a page with sliders, which is right for a
 * person choosing how a picture should look and useless to an assistant working
 * without a screen. This is the same treatment, same module, no browser — so
 * "put this artwork in the book" is one command rather than a conversation.
 *
 * A person should still prefer the studio when the look is in question: every
 * picture wants its own numbers and a live preview answers in seconds what
 * flags answer in a dozen rebuilds. Use this when the numbers are already
 * settled, or for a batch.
 *
 * IT WRITES PNG. The studio's WebP is roughly three times smaller and that
 * matters, because a book packs its pictures inside itself — but WebP encoding
 * has no pure-JavaScript implementation worth bundling, and this command has to
 * work in a folder with no `node_modules`. Convert afterwards if size bites:
 * `cwebp -q 80 art.ink.png -o art.ink.webp`.
 */

import { readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import jpeg from 'jpeg-js'
import { PNG } from 'pngjs'

import { buildPalette, loadTheme } from '../src/theme.ts'
import { DEFAULT_INK, INK_PRESETS, hexToRgb, inkWash, type InkSettings } from '../src/studio/ink.ts'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function exit(msg: string): never {
  console.error(`ink: ${msg}`)
  process.exit(1)
}

const USAGE = `
  node dist/ink.mjs <picture> [out.png] [options]

  Turns a picture into something that looks drawn on the page, in the book's
  own ink. Writes a transparent PNG: it carries only ink coverage, so the
  page reads through it. Add {.plate} in your lesson if the page's ruled
  lines should not run through the picture.

  Presets     --soft  --drawn (default)  --engraved
  The hand    --nib <px>  --line <p>  --threshold <e>  --body <phi>
  The plate   --fade <0..0.45>
  Output      --width <px>   (default 1200; 0 keeps the source size)
  Theme       --theme <path> (default theme.json)
`

interface Args {
  input: string
  output: string
  width: number
  theme: string
  settings: InkSettings
}

function parse(argv: string[]): Args {
  const positional: string[] = []
  let settings: InkSettings = { ...DEFAULT_INK }
  let width = 1200
  let theme = 'theme.json'

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!
    const next = (): string => {
      const v = argv[++i]
      if (v === undefined) exit(`${a} needs a value`)
      return v
    }
    const num = (): number => {
      const v = Number(next())
      if (!Number.isFinite(v)) exit(`${a} needs a number`)
      return v
    }
    if (!a.startsWith('--')) { positional.push(a); continue }
    const preset = INK_PRESETS[a.slice(2)]
    if (preset) { settings = { ...preset }; continue }
    switch (a) {
      case '--nib': settings.nib = num(); break
      case '--line': settings.line = num(); break
      case '--threshold': settings.threshold = num(); break
      case '--body': settings.body = num(); break
      case '--fade': settings.vignette = num(); break
      case '--width': width = num(); break
      case '--theme': theme = next(); break
      case '--help': case '-h': console.log(USAGE); process.exit(0); break
      default: exit(`unknown option ${a}\n${USAGE}`)
    }
  }

  const input = positional[0]
  if (!input) { console.error(USAGE); process.exit(1) }
  // `.ink.png` rather than overwriting: a treatment is not reversible, and the
  // original is the only thing that can be re-treated with different numbers.
  const named = positional[1]
  const output = named ?? join(dirname(input), `${basename(input, extname(input))}.ink.png`)
  return { input, output, width, theme, settings }
}

/**
 * Decode to RGBA. Only what a lesson actually contains: JPEG and PNG.
 *
 * Pure JavaScript on purpose — both decoders bundle into `dist/`, so this runs
 * in a folder with no install, which is the same promise the builder makes.
 */
async function decode(path: string): Promise<{ data: Uint8ClampedArray; width: number; height: number }> {
  const bytes = await readFile(path).catch(() => exit(`cannot read ${path}`))
  const ext = extname(path).toLowerCase()
  if (ext === '.png') {
    const png = PNG.sync.read(bytes)
    return { data: new Uint8ClampedArray(png.data), width: png.width, height: png.height }
  }
  if (ext === '.jpg' || ext === '.jpeg') {
    const img = jpeg.decode(bytes, { useTArray: true })
    return { data: new Uint8ClampedArray(img.data), width: img.width, height: img.height }
  }
  exit(`${ext || 'that'} is not a format this can read — give it a JPEG or a PNG.\n` +
       `       WebP and AVIF decode in the studio, which uses the browser's own decoders.`)
}

/**
 * Box-average downscale.
 *
 * Nearest-neighbour would be one line and would ruin the result: the treatment
 * measures its nib in pixels, and a nearest-neighbour shrink leaves the
 * original's noise at the new scale for the edge detector to find. Averaging
 * every source pixel that lands in a destination pixel is what a browser's
 * `drawImage` does, so the command and the studio agree.
 */
function resize(
  src: { data: Uint8ClampedArray; width: number; height: number },
  w: number,
): { data: Uint8ClampedArray; width: number; height: number } {
  if (w >= src.width || w <= 0) return src
  const h = Math.max(1, Math.round((src.height * w) / src.width))
  const out = new Uint8ClampedArray(w * h * 4)
  const sx = src.width / w
  const sy = src.height / h
  for (let y = 0; y < h; y++) {
    const y0 = Math.floor(y * sy)
    const y1 = Math.min(src.height, Math.max(y0 + 1, Math.floor((y + 1) * sy)))
    for (let x = 0; x < w; x++) {
      const x0 = Math.floor(x * sx)
      const x1 = Math.min(src.width, Math.max(x0 + 1, Math.floor((x + 1) * sx)))
      let r = 0, g = 0, b = 0, a = 0, n = 0
      for (let yy = y0; yy < y1; yy++) {
        for (let xx = x0; xx < x1; xx++) {
          const i = (yy * src.width + xx) * 4
          r += src.data[i]!; g += src.data[i + 1]!; b += src.data[i + 2]!; a += src.data[i + 3]!; n++
        }
      }
      const o = (y * w + x) * 4
      out[o] = r / n; out[o + 1] = g / n; out[o + 2] = b / n; out[o + 3] = a / n
    }
  }
  return { data: out, width: w, height: h }
}

async function main(): Promise<void> {
  const args = parse(process.argv.slice(2))
  const theme = await loadTheme(resolve(ROOT, args.theme))
    .catch(() => exit(`cannot read the theme at ${args.theme}`))
  const palette = buildPalette(theme)

  const source = await decode(args.input)
  const scaled = resize(source, args.width)
  // The nib is in pixels, so it scales with the picture — otherwise the same
  // number means a different drawing at every size, which is the trap the
  // studio's preview fell into.
  const settings: InkSettings = {
    ...args.settings,
    nib: args.settings.nib * (scaled.width / 900),
  }

  const t0 = Date.now()
  const drawn = inkWash(scaled, hexToRgb(palette.ink!), settings)

  const png = new PNG({ width: drawn.width, height: drawn.height })
  png.data = Buffer.from(drawn.data.buffer, drawn.data.byteOffset, drawn.data.byteLength)
  const bytes = PNG.sync.write(png)
  await writeFile(args.output, bytes)

  const kb = (n: number) => `${Math.round(n / 1024)} KB`
  console.log(`  ${args.output}`)
  console.log(`  ${drawn.width}×${drawn.height} · ${kb(bytes.length)} · ink ${palette.ink} · ${Date.now() - t0} ms`)
  console.log(`  use it with {.plate} if the page's ruled lines should not run through it`)
}

await main()
