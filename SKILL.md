---
name: tell-your-story
description: Turn a Markdown lesson into ONE standalone HTML flipbook — a 3D workbook that opens on a stage curtain, with hard section boards, fore-edge tabs, sticky notes, page curvature and presenter-remote control. Brand-agnostic; everything visual comes from theme.json. Use when asked to build training material, a workbook, a handbook, an induction, a briefing, or an interactive lesson that must work offline from a single file.
user-invocable: true
---

# Tell Your Story

One Markdown file in, **one standalone HTML flipbook out**. No server, no
network, no folder of assets unless you ask for one. It opens from a USB stick.

> **THE BOOK IS THE ONLY OUTPUT.** There is no slide mode, no deck, no
> `--format` flag. That was removed deliberately. If you are looking for a slide
> deck, this is the wrong skill — use `slide-kit`. Do not add a second output
> format here.

## The order to do things in

```bash
npm install                                   # once
node scripts/prep.ts   content/lesson.md              # 1. shape the content  ← do not skip
node src/build.ts  content/lesson.md output/lesson.html   # 2. build it
node scripts/check.ts                                 # 3. prove it still works
```

**Step 1 is the one that decides whether the result is any good.** A
well-chunked source makes a good book; a wall of text defeats every feature in
here. `prep` measures what you cannot judge by reading — page lengths against
measured capacity, missing sections, headless pages — and tells you what to do
about each. It never rewrites your words.

## Start from a template, not from a blank file

| File | What it is for |
|---|---|
| **[`templates/starter.md`](templates/starter.md)** | Copy this and fill it in. A real three-section book with every placeholder written as `[CAPITALS]`. It builds as it stands, so you can see the shape before you write a word. |
| **[`templates/CHOOSING.md`](templates/CHOOSING.md)** | **Which layout for which content.** One table, worked top to bottom. Read this before authoring — choosing the layout is the decision most likely to go wrong. |
| **[`templates/LAYOUTS.md`](templates/LAYOUTS.md)** | Every one of the 17 layouts, with copyable syntax and the placeholder text to replace. |
| [`CAPABILITIES.md`](CAPABILITIES.md) | Every feature with one line on when to reach for it. GENERATED from `src/capabilities.ts`; the build **fails** if the code implements something the manifest does not list, so it is complete by construction rather than by anyone remembering. |

**Placeholders cannot ship.** `build` refuses to write a book containing a
`[BRACKETED]` string from a template, names every one it found, and writes
nothing. The likeliest mistake in the whole skill is copying the starter,
filling in most of it, and sending the rest.

**The other common failure is using three blocks and ignoring the other twelve.**
`CHOOSING.md` exists to stop that: it names the content shape, not the block.

## Two layouts need FACING pages, and pagination is not obvious

`:::compare` and `:::timeline` only work as a **pair on a spread** — a comparison
with its other half overleaf is half an argument, and a timeline rail that does
not meet its other half does not cross the gutter.

You do not have to count. **`prep` reports the spread each page lands on** and
warns when a pair has been split, because working it out by hand means knowing
that the cover takes two faces, that a contents page and its blank back are
inserted when there are two or more sections, and that a section board must begin
on an even index. That is real arithmetic on a moving target, and getting it
wrong produces a book that looks fine and argues badly.

## When you do not know the subject

If the brief does not say what the training is ABOUT, do not ship the starter
with its placeholders — the build will refuse it, and rightly. Write real
content on the subject you can infer, and mark its status honestly: a
`:::warning` on the first page and a line in the `:::colophon` saying it is a
draft pending review by whoever owns the material. **Never invent statistics,
measurements, or regulatory limits** to fill a chart or a table — leave the
layout out rather than fabricate numbers someone might act on.

## Motion direction — apply this to every book

This is a **physical book in a stage**, not a slide deck with page-turn effects.
Use GSAP to direct attention in the order a reader understands the page; do
not make every object move merely because it can. The existing runtime ships
GSAP inside the standalone HTML and replays the landed spread's reveal when a
reader returns to it. It also honours `prefers-reduced-motion`: the final,
fully readable state must work without any motion.

Before writing the lesson, decide the page's single teaching action: _follow a
process_, _compare values_, _notice a relationship_, _pause on a rule_, or
_inspect evidence_. Then choose the corresponding motion below. One primary
motion plus, at most, one supporting motion per page is the default. Most of
the page should remain still.

| Teaching action | Use this motion | Why it feels right in a book |
|---|---|---|
| Open the experience | Let the curtain part, then let the cover settle before the first spread reveals. | These are physical stage/book actions with weight; they establish the world once rather than becoming decoration. |
| Read an argument | Reveal the eyebrow, heading, then the first content group in reading order; leave later groups for the presenter step. | The eye moves down the printed page. A short lift/fade supports that path without competing with it. |
| Follow a process | Use `:::diagram flow`; draw connectors first, then bring in nodes and their labels in process order. | A route is understood as a path before its stops are named. |
| Understand a repeating system | Use `:::diagram cycle`; reveal one segment at a time around the loop, then hold. | The sequence teaches recurrence without an endlessly spinning, distracting wheel. |
| Compare magnitudes | Use `:::diagram bars`; grow bars from their shared baseline, then reveal labels. | It preserves the chart's measurement logic: values rise from zero rather than popping into existence. |
| Land a decision or safety rule | Use `:::takeaway {.step-last}` or `:::big` and give it a quiet final reveal. | A conclusion needs a beat of stillness, not a bounce or a typewriter effect. |
| Pair evidence with explanation | Put the image beside its explanation with `:::columns`, then reveal both as one `{.with-previous}` group. | The caption and its evidence are one thought; separating them makes the reader hunt. |
| Show a real-world reminder | Use `:::sticky` as a supporting accent, not the lead animation. | A note feels placed onto paper; it should not steal focus from the lesson. |

### The book's motion grammar

Apply these rules when generating or extending a book:

1. **Turn first; reveal after the page lands.** A page turn is the only motion
   that changes the book's geometry. Never run a competing transform, parallax,
   stack shift, or chart sequence while the sheet is mid-turn. Start a content
   reveal only after the turn has visually settled.
2. **Use paper-scale movement.** Default to opacity plus a small vertical or
   lateral settle (roughly 8–18 px over 350–550 ms), with a soft deceleration.
   Use a short stagger only when it communicates order. Large travel, rotation,
   springy overshoot, and elastic easing read as interface chrome, not ink on
   paper.
3. **Make the cause visible.** Lines draw; bars grow from a baseline; nodes
   appear after their connector; captions arrive with their image; a final rule
   arrives last. If a motion does not explain a relationship, remove it.
4. **Use presenter steps as the pacing engine.** Put the first essential group
   on the page at arrival. Reveal no more than three later groups on a typical
   spread. Use `{.with-previous}` for attached evidence and `{.step-last}` for
   the conclusion. Do not make the audience click through individual sentences.
5. **Give material a rest state.** Motion is an entrance or a direct response
   to a reader action. Do not loop charts, bob sticky notes, pulse headings, or
   keep the curtain/infographics redrawing once they settle. Idle motion drains
   battery and makes a printed object feel synthetic.
6. **Use text typing sparingly.** `typing: true` is appropriate for a short
   quotation, instruction, or presenter-led reveal—not body paragraphs. Text
   that takes longer to type than to read makes the book feel slow.
7. **Always design the no-motion version.** The final state must be complete,
   legible, and in the same reading order under reduced motion or when script
   execution fails. Motion may clarify content; it must never conceal it.
8. **Board stock does not move and does not hold steps.** The cover and every
   section board turn rigid — a hardback does not bend — and show everything at
   once. They are punctuation, not argument: staggering a number, a kicker and a
   title onto a board turns a full stop into three separate events, and makes
   the reader wait for something they are meant to take in at a glance. The
   half that is easy to miss is the clicker. A board that still counts its
   contents as reveal steps swallows a press per block, so a presenter hits next
   and *nothing happens* two or three times before the page turns — from the
   front of a room it looks like the clicker has died. Both halves are one rule
   and are enforced together by `node scripts/motion.ts`, which fails if either drifts.

The curtain, cover opening, page turn, landing reveal, diagram choreography,
section tabs, and riffle are **built-in choreography**, not per-book Markdown
controls. There is deliberately no front-matter setting for individual GSAP
durations or eases: a shared motion language keeps a workbook coherent. Choose
the content's pacing with `steps`, `typing`, and the step markers; extend the
runtime only when a new inline SVG teaches something the supplied blocks cannot.

### What not to imitate

Avoid slide-deck clichés: every element flying from a different edge, 3D text,
continuous carousel movement, bouncing numbers, spinning cycles, page-curl on
hover, cursor-reactive parallax, and page shadows that deepen indefinitely.
They spend attention without teaching anything and, on a standalone HTML file,
are often the first cause of uneven frame pacing.

### When the supplied blocks are not enough

Do not fake an unsupported animation by shipping a GIF/video or by attaching
an opaque screenshot. Prefer a simple inline SVG or a static, well-labelled
figure. If a genuinely new graphic is needed, specify its **teaching action**,
its **start and final states**, its **one-time trigger** (page landing or a
presenter step), and its **reduced-motion final state** before adding runtime
code. Build it as inline SVG so the existing GSAP timeline can animate only
the meaningful parts; keep it transform/opacity based and tear it down when
the reader leaves the spread.

## Every script, and what it is for

Scripts here exist to help an assistant **think and execute better**. This is a
skill, not an application — nothing here is a user-facing program.

| Command | File | What it does |
|---|---|---|
| `node scripts/prep.ts` | `scripts/prep.ts` | Analyses raw content and says how to chunk it. Reports, never rewrites. `--json` for machine use. |
| `node src/build.ts` | `src/build.ts` | Markdown → one standalone HTML book. |
| `node scripts/check.ts` | `scripts/check.ts` | Every check is a bug that once shipped looking fine. The count is deliberately not quoted here — it only ever drifts. |
| `node scripts/motion.ts` | `scripts/motion.ts` | **What moves on every page**, and whether it obeys the rules. Prints turn behaviour and step count per page for a built book, and fails if a section board starts bending or eating presses. Run it on any book before presenting from it. |
| `node scripts/verify.ts` | `scripts/verify.ts` | Copies each snippet out of `templates/LAYOUTS.md`, builds it, and checks the page comes back as the layout the template promised. Catches a layout that is documented but unreachable — `pickLayout` is first-match-wins, so an earlier test can shadow a later one with nothing failing. Writes `VERIFICATION.md`. |
| `node scripts/gen-capabilities.ts` | `scripts/gen-capabilities.ts` | Regenerates `CAPABILITIES.md` from the manifest. Run after adding a feature. |
| `npx tsc --noEmit` | — | `tsc --noEmit`. TypeScript 7, ~0.11s. |
| `node src/build.ts content/sample-book.md output/book.html` | — | Builds the shipped sample, for a quick visual check. |
| — | `scripts/vendor-fonts.sh` | **Dev-only.** Re-subsets the embedded fonts. Its output is committed; you do not need to run it. |
| — | `scripts/qa_curtain.ts` | Compiles the WebGL shader in a real context and reads pixels back. `tsc` cannot see inside a template literal, and curtains.js swallows shader errors. |
| — | `scripts/drive-browser.mjs` | **Dev-only.** Opens a built book in a real headless Chrome and drives it the way a presenter does — curtain, turns, reveals, a held clicker, the tabs, the resume. Nothing about pressing a button exists until a browser runs the page; this is the only thing that can see it. Its results fold into `VERIFICATION.md`. |

## Every directory

| Path | What lives there |
|---|---|
| `src/` | The build. `build.ts` (CLI) · `book.ts` (pages, sections, boards) · `markdown.ts` (blocks) · `theme.ts` (palette, contrast) · `assets.ts` (the inline/folder switch) · `fonts.ts` (embedding) · `svg.ts` (build-time SVG) · `capabilities.ts` (the manifest) |
| `src/runtime/` | What ships **inside** the HTML: `book.ts`/`book.css` (flipbook) and `curtain.ts`/`curtain.css` (WebGL stage curtain). Bundled by esbuild into the committed `assets/runtime.bundle.js`, then inlined. |
| `src/types/` | Hand-written ambient declarations for curtainsjs, page-flip and markdown-it-container. **Not dead files** — the compiler consumes them without any import, so grepping for their names finds nothing. |
| `scripts/` | Dev tooling. Never shipped inside a book. |
| `assets/fonts/` | The embedded woff2 faces, already subset. |
| `content/` | Sample lesson and its pictures. |
| `output/` | Build results. **Gitignored.** |

## Configuration formats

| Format | Where | Notes |
|---|---|---|
| **JSON** | `theme.json` | All colour, fonts and a11y. The only file to touch when rebranding. |
| **JSON** | `package.json`, `tsconfig.json` | Toolchain. |
| **YAML** | the front matter at the top of a lesson | Parsed by `markdown.ts`. Every key is listed in `CAPABILITIES.md`. |
| **XML** | *none* | There is no XML in this skill. SVG is generated in `src/svg.ts` at build time and inlined; nothing is authored by hand. |

## How a book is put together

```markdown
---
title: "Field Safety Workbook"
curtain_text: "A short induction. Around twenty minutes."
curtain_photo: "img/site.png"
---

>> The basics          ← a SECTION: hard divider board + fore-edge tab
> why this matters     ← this page's handwritten eyebrow
## Why this matters    ← the page title, lifted into the header band

Body text.

:::sticky Remember
Ask before you assume — every time.
:::

---                    ← next page
```

Three rules that matter:

1. **`>>` is a section, `>` is an eyebrow.** Use `>>` three to six times in a
   workbook, not on every page — every `>>` inserts a physical divider board.
2. **One idea per page.** A page is a page, not a scroll. `prep` will tell you
   which pages break this.
3. **Pictures are ordinary Markdown.** `![alt](img/x.png)` — packed into the
   file automatically and deduplicated by content.

## Rebranding

Everything derives from `theme.json`. Set `surface`, `accent` and `secondary`
and the rest follows — the curtain comes from your secondary colour, the accent
lights its rim and the fore-edge tabs.

The build enforces what is easy to get wrong: text contrast is auto-corrected to
`a11y.min_contrast`, and the curtain is raised until it is at least 3:1 clear of
the void behind it, so a dark brand cannot collapse the stage into one flat
colour.

**Fonts ship inside the file** — Caveat and Barlow Condensed, subset and
single-weight, 68 KB for all three faces. Both are SIL Open Font License. This
is deliberate: the kit previously *declared* those faces without shipping them,
so the handwriting fell back to Comic Sans on any machine without them.
