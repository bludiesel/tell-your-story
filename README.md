<div align="center">

# Tell Your Story

**One Markdown file in. One standalone HTML flipbook out.**

A 3D workbook that opens on a stage curtain — hard section boards, fore-edge
tabs, sticky notes, page curvature, presenter-remote control. No server, no
network, no folder of assets. It opens from a USB stick.

<img src="docs/screenshots/01-curtain.jpg" alt="A WebGL stage curtain parts to reveal a closed 3D book floating in the dark" width="100%">

</div>

---

## What this is

A [Claude Code](https://claude.com/claude-code) skill. Point it at a Markdown
lesson and it produces **one HTML file** — fonts, pictures, animation engine and
all — that runs offline, anywhere, forever.

It is deliberately **brand-agnostic**. Every colour, typeface and proportion
comes out of `theme.json`. Ships neutral; rebrand in one file.

```bash
npm install                                              # once
node scripts/prep.ts  content/lesson.md                  # 1. shape the content  ← do not skip
node src/build.ts     content/lesson.md output/book.html  # 2. build it
```

That's it. `output/book.html` is the deliverable.

---

## What it looks like

<table>
<tr>
<td width="50%"><img src="docs/screenshots/02-page-turn.jpg" alt="A page mid-turn, bending with a soft shadow across the curve"></td>
<td width="50%"><img src="docs/screenshots/03-open.jpg" alt="The open book with fore-edge index tabs down the right margin"></td>
</tr>
<tr>
<td><b>Real page turns.</b> Paper bends. Boards don't — a hardback cover turns rigid, because it is one.</td>
<td><b>Fore-edge tabs</b> per section, which step aside once read. Click one to jump.</td>
</tr>
<tr>
<td><img src="docs/screenshots/11-compare.jpg" alt="A before and after comparison across two facing pages"></td>
<td><img src="docs/screenshots/10-timeline.jpg" alt="A timeline rail running across the gutter between two pages"></td>
</tr>
<tr>
<td><b>Before / after</b> across facing pages. Same structure both sides, so the only difference is the content.</td>
<td><b>A timeline rail</b> that crosses the fold — one line over two sheets of paper.</td>
</tr>
<tr>
<td><img src="docs/screenshots/06-marginalia.jpg" alt="Hand-written notes in the outer margin beside a narrow column of text"></td>
<td><img src="docs/screenshots/05-has-sticky.jpg" alt="A sticky note attached to the paragraph above it"></td>
</tr>
<tr>
<td><b>Marginalia</b> in the outer margin, never the gutter — nobody can write in a fold.</td>
<td><b>Sticky notes</b> that attach to the block above them, the way a person actually adds one.</td>
</tr>
<tr>
<td><img src="docs/screenshots/09-barchart.jpg" alt="A horizontal bar chart drawn as SVG on the page"></td>
<td><img src="docs/screenshots/12-full-bleed.jpg" alt="A photograph running to every edge of the spread"></td>
</tr>
<tr>
<td><b>Charts and diagrams</b> are real SVG, drawn at build time, animated when their step arrives.</td>
<td><b>Full-bleed pictures</b> to every edge, with the caption printed over them.</td>
</tr>
</table>

---

## Seventeen layouts, and a guide for choosing between them

The failure mode of any kit like this is using three blocks and ignoring the
rest, so choosing is documented separately from syntax:

| File | What it answers |
|---|---|
| [`templates/CHOOSING.md`](templates/CHOOSING.md) | **Which layout for which content.** One table, by content shape — not by block name. Read this first. |
| [`templates/LAYOUTS.md`](templates/LAYOUTS.md) | Every layout, with copyable syntax and placeholder text to replace. |
| [`templates/starter.md`](templates/starter.md) | A real three-section book to copy. It builds as it stands. |

| Authored | Generated for you |
|---|---|
| `prose` · `opener` · `statement` · `quote-page` · `has-sticky` · `marginalia` · `takeaway` · `ptable` · `barchart` · `timeline` · `compare` · `half-bleed` · `full-bleed` · `colophon` | `cover` · `contents` · `divider` |

The generated three are derived, never written: the contents page takes its page
numbers from where the pages actually landed, so **it cannot cite a page that is
not there.**

---

## Why it is built the way it is

**The book states what it is.** Every page carries `data-layout`, `data-slot`,
`data-stock` and `data-screen-label`. Rules that live only in prose get violated
three edits later; rules in attributes can be checked.

**It measures the machine it lands on.** A book might be opened on a locked-down
site laptop, a decade-old meeting-room PC, or a phone. User agents lie and pixel
ratios say nothing about the GPU, so the book doesn't ask — it watches its own
frames for the first second and steps the whole page down a tier if they aren't
arriving on time. What it drops is scenery (blurs, the second floor shadow, the
cloth shader). What it keeps is paper, type, turns and reveals.

**Presenter steps are the pacing engine.** A page arrives one block at a time,
and `next` means *next block* until the spread is exhausted — so you can talk to
a point while it is the only thing on the page. It hangs off the same next/back
a clicker already sends.

**Placeholders cannot ship.** The build refuses to write a book still containing
a `[BRACKETED]` string from a template, names every one it found, and writes
nothing.

---

## Light on purpose

A built book is one file. The tool that builds it is nearly as lean:

| | |
|---|---|
| Runtime | **Node only.** No Bun, no Python, no browser, no build step |
| Needed to build a book | **4 packages** — markdown-it, linkedom, yaml, svg.js |
| Bundled into the book | page-flip, GSAP, curtains.js — already committed as one file, so they are not fetched at build time |
| Fonts | subset and embedded; a book needs no network |

---

## Every script

| Command | What it does |
|---|---|
| `node scripts/prep.ts <file>` | **Run this first.** Measures page lengths against real capacity, finds headless pages, warns when a facing pair has been split, proposes the reveal order. Reports; never rewrites your words. `--json` for machine use. |
| `node src/build.ts <in> <out>` | Markdown → one standalone HTML book. |
| `node scripts/check.ts` | The full suite. Every check in it is a bug that once shipped looking fine. |
| `node scripts/motion.ts <book.html>` | **What moves on every page.** Prints turn behaviour and step count per page, and fails if a section board starts bending or swallowing presses. |
| `node scripts/verify.ts` | Copies each snippet out of `LAYOUTS.md`, builds it, and checks the page comes back as the layout the template promised. Writes [`VERIFICATION.md`](VERIFICATION.md). |
| `node scripts/drive-browser.mjs <url>` | Drives a built book in a real headless Chrome — curtain, turns, reveals, a held clicker, the tabs, the resume. The only thing that can see what a button press actually does. |

The last three exist because of one bug worth repeating: section boards were
never *animated* — that rule always held — but they still counted their number,
kicker and title as three reveal steps. So a presenter pressed next on a board
and **nothing happened three times** before the page turned. Invisible in the
HTML, obvious the moment you press a key twice.

---

## Rebranding

Everything visual is in [`theme.json`](theme.json) — palette, fonts, spacing
scale, motion durations. Seven ready-made palettes are in [`themes/`](themes/).

Contrast is enforced rather than hoped for: the build computes the real ratio of
body text against paper and of the cloth against its own folds, and tells you
which colour to move and by how much when a palette fails.

---

## Licence

[MIT](LICENSE) for this project's code.

Read [NOTICE](NOTICE) before redistributing books made with it: **GSAP and
page-flip are compiled into every book**, so they travel with anything you send.
page-flip is MIT; GSAP is free for most uses but is not an open-source licence.
The embedded fonts are SIL OFL 1.1.

[CREDITS.md](CREDITS.md) records the design lineage, including exactly what was
reimplemented from other projects and what was deliberately left behind.
