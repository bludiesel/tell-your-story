# Credits

## The sample photograph

`content/img/valve.jpg` — *Hydrogen gas cylinder valve and burst disk*, U.S.
National Archives and Records Administration, **public domain**.
<https://commons.wikimedia.org/wiki/File:HYDROGEN_GAS_CYLINDER_VALVE_AND_BURST_DISK_-_NARA_-_17468077.jpg>

It ships for one reason: the kit's other pictures are placeholder gradients, and
a gradient cannot demonstrate an edge-detection treatment — run the Ink Studio
on one and it correctly produces a smudge. `valve.ink.png` beside it is that
photograph through `node dist/ink.mjs`, so a reader can see what the treatment
is for, and re-run it to see how.

## XDoG — the Ink Studio's treatment

Winnemöller, H., Kyprianidis, J. E., Olsen, S. C.
**"XDoG: An eXtended difference-of-Gaussians compendium including advanced image
stylization"**, *Computers & Graphics* 36(6), 2012, pp. 740–753.
<https://doi.org/10.1016/j.cag.2012.03.004>

`src/studio/ink.ts` implements the operator described in that paper: the
sharpening form `(1+p)·Gσ − p·Gkσ`, the soft threshold
`T(u) = 1 if u ≥ ε, else 1 + tanh(φ(u−ε))`, and `k = 1.6` — the Marr–Hildreth
ratio at which a difference of Gaussians best approximates the Laplacian of a
Gaussian. The preset names (pencil shading, natural media, two-tone woodcut) are
the styles the paper itself demonstrates; the parameter values were re-tuned
here, because ε depends on how the input is normalised and every implementation
normalises differently.

**No code was copied.** The Gaussian is approximated with three box passes
(Kovesi's sizing) rather than a real kernel, the output is ink *coverage* in the
alpha channel rather than luminance, and the whole thing runs at authoring time
on an author's own machine. What is borrowed is the formulation, and it is
borrowed knowingly: this file first shipped with a hand-rolled difference of
blurs, which was a worse re-derivation of the same idea.

### Deliberately not taken

The flow-based variant — Kang, H., Lee, S., Chui, C. K., **"Coherent Line
Drawing"**, *NPAR 2007* — runs the filter along the edge tangent flow so strokes
stay continuous on noisy photographs. It needs a tangent field computed per
image, and it is the right answer only if artwork still breaks into speckle
after XDoG. It has not been needed yet.

## Bento — ideas, not code

<https://github.com/nyblnet/bento> · MIT · audited at commit `fd55c8f` (2026-08-05)

Tell Your Story contains **no copied Bento source**. Two design ideas were taken
and reimplemented from scratch, which is worth recording plainly:

**1. The indirect asset reference** (`src/assets.ts`)

Bento stores document assets in a flat `doc.assets` table and has elements
reference them by key (`asset:<key>`) rather than embedding data inline, with a
resolve step at render time and interning that dedupes identical values. That
shape is what makes Tell Your Story's inline-vs-folder switch a single function
instead of two renderers. Our implementation differs — content-hash keys,
filesystem output, a different resolve signature — but the idea is theirs.

**2. Never let a literal `</script>` into inlined output** (`src/build.ts`)

Bento's hard rule #1, learned the hard way. We split the literal the same way
they do so it cannot appear in our own bundle, and escape it in anything we
inline.

Bento is MIT licensed, so copying source *would* have been permitted with
attribution. We chose to reimplement because their code is tied to their
document model, encryption envelope and collaboration layer — none of which
applies here.

### Deliberately not taken

- **Their Vite + `vite-plugin-singlefile` build.** Right for an app that is
  itself the file; wrong for a generator that emits a book per run. We use
  esbuild, once, into a committed bundle.
- **Self-update, encryption, IndexedDB autosave, i18n.** Real engineering for
  problems a presentation generator does not have.
- **Their deflate-payload compression.** Measured on our output it saves ~17%,
  because most bytes are already-compressed images and fonts — and it is the
  machinery behind their worst bug (a file that grew 100 KB on every save).

## Runtime dependencies

| Package | Licence | Used for |
|---|---|---|
| markdown-it | MIT | Markdown to HTML |
| markdown-it-container | MIT | the `:::block` syntax |
| markdown-it-attrs | MIT | `{.class}` attributes |
| yaml | ISC | frontmatter |
| page-flip | MIT | the book's page-turn (ships inside a book) |
| gsap | **GreenSock standard "no charge"** | the book's opening + reveal timelines (ships inside a book) |
| @svgdotjs/svg.js | MIT | build-time SVG generation (does NOT ship) |
| svgdom | MIT | DOM for svg.js under Bun (does NOT ship) |

The Markdown packages and the SVG packages run at build time only. `page-flip`
and `gsap` DO ship inside a built book — they are bundled into its inlined
runtime, which is why they are installed as real dependencies rather than
hand-downloaded into a vendor folder as the Python version did.

### A note on GSAP's licence

Every other dependency here is MIT or ISC. GSAP is not: the package carries
`@license Copyright 2026 — Subject to the terms at https://gsap.com/standard-license`.
This was raised and the decision to use it was taken deliberately by the project
owner. Recorded here so that whoever redistributes this kit knows the obligation
exists and can check it against their own use, rather than discovering it in a
minified bundle.

## The flipbook design

The book's look — the closed 3D volume you tap to open, the cover boards, the
page stack that shrinks as you read, the ruled paper and handwritten accents —
is ported from learn-kit's own `book/book-workbook.src.html`. Every colour that
was a hardcoded navy or orange there is a theme token here.
