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

## The first thing you do is ASK — do not start writing

**When this skill triggers, open a conversation before you open an editor.** The
person asking for a workbook almost never arrives with a finished brief, and a
book built from a one-line request is a book they will quietly not use.

Work through the four below **in one batch**, not as a drip of single questions.
Say what you already know from their request so they only fill the gaps.

**1 — What is this, and who reads it?**
Ask what the book must make its reader able to DO afterwards. Every later choice
follows from that one answer: how much detail, which warnings, whether a page is
prose or a checklist. "A refresher for people who already know it" and "the only
training a new starter gets" produce different books from the same material.

**2 — What content already exists?**
An SOP, a deck, a policy, a transcript, notes, a previous version. Ask them to
paste it or point you at it. If the honest answer is "nothing", **interview them
instead** — ask what goes wrong on this job, what people get wrong, what the one
rule is that nobody may break. A subject-matter expert will talk for ten minutes
and give you a better book than any document would have.

**3 — Artwork and assets.**
Ask what pictures they have and what each one shows. Photographs of their own
kit, their own site and their own people are worth more than anything you could
find, and they carry no licensing question. Treat every one through the Ink
Studio so it belongs to the page — see *Artwork* below.

**If they have none, offer to go and find some.** See *Researching what they do
not have*, next — including the licence rule, which matters because company
training material gets distributed.

**4 — Brand.**
`theme.json` is the only file that brands a book: two colours and a font name is
the whole job, and `brand.mark` points at their logo. "We do not have one yet"
is a fine answer — the kit ships neutral and generates a monogram from the brand
name. See *Rebranding*.

**Then say what you are going to build before you build it.** A one-paragraph
shape — how many sections, roughly what is on each, how long it takes to read —
costs thirty seconds and catches a wrong turn that would otherwise cost an
afternoon.

## Researching what they do not have

When the user has no pictures, no examples, or thin material, **offer to
research** — do not silently proceed with an empty book, and do not invent facts
to fill it.

| Ask for | What to do |
|---|---|
| **Pictures** | Search for images of the actual equipment, site or procedure. Then **treat the chosen one through `dist/ink.mjs`** so it reads as drawn rather than pasted. |
| **Quotes** | A regulator's own wording, a standard, a line from an incident report. Attribute it on a `:::quote` page. A quote nobody can source is worse than no quote. |
| **Supporting material** | The relevant standard or regulation, typical failure modes, real incident summaries. These make a book specific instead of generic. |

**THE LICENCE RULE, AND IT IS NOT OPTIONAL.** This produces training material a
company distributes to its staff. An image found through a search is somebody
else's property unless it explicitly says otherwise.

- Prefer **public domain and openly licensed** sources — national archives,
  government and regulator publications, Wikimedia Commons, Unsplash, the
  organisation's own materials.
- **Record where every asset came from and under what licence**, on the
  `:::colophon` page. That layout exists for this.
- **Tell the user what you used and where it came from.** Do not present a found
  image as theirs.
- If you cannot establish a licence, **say so and offer the alternatives**: their
  own photograph, a diagram (`:::diagram`, generated and owned by them), or a
  page that carries no picture. A page with no picture is not a failure; an
  unlicensed picture in a company handbook is.

Facts get the same treatment. Cite a regulation by number, and if you are not
certain of a figure, say you are not certain rather than writing it into a book
that people will treat as authoritative.

## The shape you are aiming for, before you write

| | |
|---|---|
| **The spine: 2–6 sections** | Written `>> Section name` — each becomes a hard divider board with its own fore-edge tab, and the reader navigates by them. Two is thin; past six the tabs crowd. `#` is a page, `>>` is a section; getting that wrong produces a book with no tabs, and `prep` will say so. |
| **At least 4 pages per section** | Every `>>` inserts two faces of hard stock. A reader turning past nearly as many boards as pages of content is being obstructed, not helped. `prep` flags anything over one section per three pages — a short book wants two sections, not five. |
| **~130 words a page** | 170 at a crush, under 35 looks unfinished. Measured against the real page box, not guessed. A picture costs about 55 words of room and a table row about 12. Write to that and `prep` will have little to say. |

**What NOT to ask them.** Do not ask which layout to use, or how the pages should
be split. That is your job, below — asking pushes the work back onto someone who
came here to avoid it. Take the material and the intent, then choose.

## The order to do things in

**NO INSTALL NEEDED. Node 22 or newer is the entire requirement** — no npm, no
Python, no browser. Every command below is compiled into `dist/` and runs from a
folder with no `node_modules` at all; a check spawns each one in a clean room, so
that is tested rather than promised.

**If anything looks wrong, run this first** — it exercises the whole chain and
exits non-zero if the install is not sound:

```bash
node dist/doctor.mjs content/sample-book.md
``` The skill IS the
repository: `git clone … ~/.claude/skills/tell-your-story` installs it and
`git -C ~/.claude/skills/tell-your-story pull` updates it. To find out which
version is actually running — the question behind "why don't I have the new
layouts?" — `node dist/build.mjs --version` prints it and lists every layout it
knows about, read from the code rather than from a number in a document.

```bash
node dist/prep.mjs  content/lesson.md                      # 1. shape it  ← do not skip
node dist/build.mjs   content/lesson.md output/lesson.html   # 2. build it
node dist/motion.mjs  output/lesson.html                     # 3. see what moves
node dist/doctor.mjs  content/lesson.md                      # 4. is it finished?  ← before handing over

# authoring? leave this running and just save:
node dist/build.mjs   content/lesson.md output/lesson.html --watch
```

`dist/build.mjs` is the builder with its four dependencies compiled in, committed
to the repo. It produces a **byte-identical** book to `src/build.ts` — same
SHA-256 — so nothing is traded away by using it. `prep` needs nothing at all: it
imports only `node:fs` and `node:path`.

**Changing the skill** is the only reason to install anything:

```bash
npm install                # or `bun install` — either works, and ONLY if you are
                           # changing the skill. Using it needs no install at all.
node scripts/check.ts      # the full suite
node scripts/verify.ts     # every documented layout, built and identified
node scripts/prebundle.ts  # rebuild dist/ and assets/ after editing src/
```

`check` fails if `dist/` is stale, so a shipped builder cannot quietly fall
behind the source it was built from.

**Step 1 is the one that decides whether the result is any good.** A
well-chunked source makes a good book; a wall of text defeats every feature in
here. `prep` measures what you cannot judge by reading — page lengths against
measured capacity, missing sections, headless pages — and tells you what to do
about each. It never rewrites your words.

## Turning raw material into pages

This is the loop. It is short, and every step exists because skipping it
produced a worse book.

**1 — Cut before you style.** Read the material for its *joints*: where the
subject changes. Each joint is a `---`. Do not decide layouts yet; a page you
have not yet sized is a page you cannot choose a layout for.

**2 — Name the spine.** Group the pages into 2–6 themes and put `>> Theme name`
on the first page of each. Then a `## Heading` on every page and a `> eyebrow`
where a page needs a second line of orientation. Both are lifted into the header
band and removed from the body, so they cost no space.

**3 — Run `prep` and act on what it says.** It counts what a model reading
Markdown cannot: which page is three times its neighbour, which page has no
heading, whether the sections outnumber the content. Fix, re-run, repeat until it
says *nothing to flag*. Two or three passes is normal.

**4 — Now match the content shape to a layout**, with
[`templates/CHOOSING.md`](templates/CHOOSING.md) open. Choose from what the
content *is* — a rule with consequences is a `:::warning`, a thing to remember is
a `:::takeaway`, an aside in a human voice is a `:::sticky` — never from which
block you used last. If you are unsure what a layout looks like, build
`content/every-layout.md` and turn to it rather than imagining it.

**5 — Set the reveal order.** Blocks arrive one press at a time in the order they
are written, which is usually right because you wrote them in reading order.
Three markers bend it, and `prep` proposes each one with its reason:

| Marker | What it does |
|---|---|
| `{.step-first}` | Arrives with the page turn, whatever its position. For a warning that must not wait behind the setup. |
| `{.step-last}` | Arrives after everything else. For the line that concludes an argument. |
| `{.with-previous}` | Shares a press with the block above. A caption is not a beat of its own. |

**`prep` also audits the markers you wrote**, and says what each one will
actually do — *"pulls this ahead of 2 blocks written before it"*. Read those
lines. A `{.step-first}` on the second of only two blocks inverts the page: the
warning arrives on the turn and the thing it warns about arrives after it. The
book still builds, every check still passes, and the page reads backwards. It
happened while dogfooding this skill, which is why the audit exists. A marker
that `prep` says *changes nothing* should be deleted — it reads as intent and the
next author copies it.

**6 — Build, then walk it.** `node dist/motion.mjs` prints every page, its
layout, whether it bends, and how many presses it costs. It is the cheapest way
to notice that a page has seven steps or that a section board landed in the wrong
place. Then open the book and turn it.

## Start from a template, not from a blank file

| File | What it is for |
|---|---|
| **[`templates/starter.md`](templates/starter.md)** | Copy this and fill it in. A real three-section book with every placeholder written as `[CAPITALS]`. It **will not build until you have replaced them** — the builder blocks any book still carrying one and names every survivor. That refusal is the feature: a forgotten placeholder cannot reach a reader. To see the shape moving before you write, build `content/sample-book.md` instead. |
| **[`templates/CHOOSING.md`](templates/CHOOSING.md)** | **Which layout for which content.** One table, worked top to bottom. Read this before authoring — choosing the layout is the decision most likely to go wrong. |
| **[`templates/LAYOUTS.md`](templates/LAYOUTS.md)** | Every one of the 22 layouts, with copyable syntax and the placeholder text to replace. |
| **[`content/every-layout.md`](content/every-layout.md)** | **The catalogue — LOOK at the layouts instead of imagining them.** One page per layout, one block per feature, in a real book you open and turn. Build it once and keep it open while authoring: `node dist/build.mjs content/every-layout.md output/every-layout.html`. Choosing well is a visual judgement, and reading syntax is not the same as seeing the page it produces. |
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
   and are enforced together by `node dist/motion.mjs`, which fails if either drifts.

The curtain, cover opening, page turn, landing reveal, diagram choreography,
section tabs, riffle, and the one-page/spread view control are **built-in
choreography**, not per-book Markdown controls. **A book opens on the two-page
spread** — that is the object it is imitating, and it is what `:::compare` and
`:::timeline` are laid out across. The view control cycles automatic → one page
→ spread from there, and the choice is remembered per reader, not per book. Even
so, never author a lesson that assumes a facing page is on screen: a reader on a
phone, or one who picked a single page, must still be able to read a spread
layout when its partner is a page turn away. There is deliberately no front-matter setting for individual GSAP
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
| `node dist/doctor.mjs <lesson.md>` | `scripts/doctor.ts` | **Is this book finished?** Runs prep, build, motion and page fit and returns ONE verdict with an exit code — the command to run before you hand anything over. `--json` to branch on the answer. It never judges the WRITING: green means nothing is broken, not that the book is good. |
| `node dist/overflow.mjs <book.html>` | `scripts/overflow.ts` | **Does every page fit?** The only check that opens a browser. It walks every spread of the built book and measures the painted glyphs, so "does this page fit" is answered by measurement rather than by the character count `prep` uses. Four faults: off the sheet, cut off by a clipping box, text over text, type below the floor. `doctor` runs it for you. |
| `node dist/build.mjs --version` | — | **Which copy is this?** Version plus every layout the installed copy actually knows about, read from the code. Answers "why have I not got the new layouts?" without anyone having to work out whether they are running a checkout, a plugin cache or a zip. `--json` too. |
| `node dist/prep.mjs` | `scripts/prep.ts` | Analyses raw content and says how to chunk it, and audits the reveal markers already in it. Reports, never rewrites. `--json` for machine use. |
| `node dist/build.mjs` | `dist/build.mjs` | Markdown → one standalone HTML book. **No install needed.** `src/build.ts` is the same thing from source, for contributors. |
| `node scripts/check.ts` | `scripts/check.ts` | Every check is a bug that once shipped looking fine. The count is deliberately not quoted here — it only ever drifts. |
| `node dist/motion.mjs` | `dist/motion.mjs` | **What moves on every page**, and whether it obeys the rules. Prints turn behaviour and step count per page for a built book, and fails if a section board starts bending or eating presses. Run it on any book before presenting from it. |
| `node scripts/verify.ts` | `scripts/verify.ts` | Copies each snippet out of `templates/LAYOUTS.md`, builds it, and checks the page comes back as the layout the template promised. Catches a layout that is documented but unreachable — `pickLayout` is first-match-wins, so an earlier test can shadow a later one with nothing failing. Writes `VERIFICATION.md`. |
| `node dist/build.mjs content/every-layout.md output/every-layout.html` | — | **The catalogue.** All 22 layouts rendered in one book. Open it before choosing a layout, and after any change to `layouts.css` — it is the fastest way to see what actually broke. |
| `node dist/ink.mjs <picture>` | `scripts/ink.ts` | **The treatment, headless.** Same operator as the studio, no browser, no install — for an assistant with no screen to drag a slider on. Writes `<name>.ink.png`. `--soft`/`--drawn`/`--engraved`, or `--nib --line --threshold --body --fade --width --theme`. |
| `node dist/studio.mjs` | `scripts/build_studio.ts` | **The Ink Studio.** Writes `output/ink-studio.html` — one self-contained page, no install — where an author turns supplied artwork into something that looks drawn on the page. Takes an optional theme path, so the preview is the book's real ink on the book's real paper. See *Artwork* below. |
| `node scripts/gen-capabilities.ts` | `scripts/gen-capabilities.ts` | Regenerates `CAPABILITIES.md` from the manifest. Run after adding a feature. |
| `npx tsc --noEmit` | — | `tsc --noEmit`. TypeScript 7, ~0.11s. |
| `node dist/build.mjs content/sample-book.md output/book.html` | — | Builds the shipped sample, for a quick visual check. |
| — | `scripts/vendor-fonts.sh` | **Dev-only.** Re-subsets the embedded fonts. Its output is committed; you do not need to run it. |
| — | `scripts/qa_curtain.ts` | Compiles the WebGL shader in a real context and reads pixels back. `tsc` cannot see inside a template literal, and curtains.js swallows shader errors. |
| — | `scripts/drive-browser.mjs` | **Dev-only.** Opens a built book in a real headless Chrome and drives it the way a presenter does — curtain, turns, reveals, a held clicker, the tabs, the resume. Nothing about pressing a button exists until a browser runs the page; this is the only thing that can see it. Its results fold into `VERIFICATION.md`. |

## Every directory

| Path | What lives there |
|---|---|
| `src/` | The build. `build.ts` (CLI) · `book.ts` (pages, sections, boards) · `markdown.ts` (blocks) · `theme.ts` (palette, contrast) · `assets.ts` (the inline/folder switch) · `fonts.ts` (embedding) · `svg.ts` (build-time SVG) · `capabilities.ts` (the manifest) |
| `src/runtime/` | What ships **inside** the HTML: `book.ts`/`book.css` (flipbook) and `curtain.ts`/`curtain.css` (WebGL stage curtain). Bundled by esbuild into the committed `assets/runtime.bundle.js`, then inlined. |
| `src/studio/` | The Ink Studio: `ink.ts` (the treatment — pure arithmetic over pixels, no DOM) and `studio.ts` (its interface). Bundled to `assets/studio.bundle.js`. **Never travels inside a book** — a reader gets pages, an author gets the tool that made the pictures on them. |
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

## Diagrams beyond the three generated ones

**Seven types write themselves from a line of text** — `flow`, `cycle`, `bars`,
and four for data:

| Block | Write | Draws |
|---|---|---|
| `:::diagram waffle` | `62 of 100 \| caption` | a hundred squares, 62 filled — the reader can count the claim |
| `:::diagram pictogram` | `7 in 10 \| caption` | ten figures, seven filled — a proportion about people |
| `:::diagram progress` | `Signed off \| 62` per line | ratios against a shared track, each against its own limit |
| `:::diagram stats` | `12 \| incidents` per line | two to four headline figures, ruled between not boxed |

The empty half of a waffle and a pictogram is drawn, not omitted: "62 of 100"
is only a claim if the reader can see the 100.

For anything
else — a decision with branches, a swimlane, a fishbone, a pyramid — **draw the
SVG and put it in the block**:

````markdown
:::diagram flowchart
<svg viewBox="228 16 384 248" role="img" aria-label="Is the line dead?">…</svg>
:::
````

The layout rules live in [`design/diagram-grammars/`](design/diagram-grammars/)
— **41 grammars, one short file per type**, adapted from
[diagram-design](https://github.com/cathrynlavery/diagram-design) (MIT). **Read
only the one you are drawing.** Each gives what it is best for, what it is *not*
for, the geometry, the numbers, and the anti-patterns worth naming. The
[index](design/diagram-grammars/README.md) groups them: sequence and process,
hierarchy, comparison, cause and effect, quantity, systems and data.

Two things are enforced rather than requested:

| | |
|---|---|
| **Colour comes from the theme** | The build **refuses** a diagram containing a hex, `rgb()` or `hsl()` value and names it. Use `currentColor`, `var(--ink)`, `var(--accent-ink)`, `var(--paper-2)`. A literal is right in one theme and wrong in every other. |
| **Four class names animate it** | `dg-link` draws itself, `dg-node` pops in, `dg-bar` grows from its baseline, `dg-label` fades last. The runtime knows those four and nothing about diagram types — so a hand-drawn Sankey animates on the turn with no code that knows what a Sankey is. |

Adding a type is a file in that folder. Nothing in the build knows what a
diagram type is, so there is no code to change.

## Artwork — make it look drawn, do not paste it in

A book of paper, handwriting and grain puts a photograph on a page and the
photograph is the one thing on that spread that came from a different hand. The
Ink Studio fixes that before the picture ever reaches a lesson.

**If you are an assistant putting a picture in a book, this is the whole job:**

```bash
node dist/ink.mjs img/photo.jpg           # -> img/photo.ink.png, the "drawn" preset
```

Then reference the result with `{.plate}`:

```markdown
![A technician checking a cylinder](img/photo.ink.png){.plate}
```

That is enough. Do not skip it and drop a raw photograph onto a page — a
photograph is the one element on a spread that came from a different hand, and
the whole book is built to look like one.

It reads JPEG and PNG and writes PNG. Presets are `--soft`, `--drawn` (default)
and `--engraved`; every number is also a flag (`--nib --line --threshold --body
--fade --width --theme`). The default export is 1200 px wide, which is already
more than a 780 px page resolves.

**When a person is choosing the look, give them the studio instead** — every
picture wants its own numbers and sliders answer in seconds what flags answer in
a dozen rebuilds:

```bash
node dist/studio.mjs                      # -> output/ink-studio.html, using theme.json
node dist/studio.mjs themes/slate.json    # -> the same page in that theme's ink
```

The studio also exports **WebP, about three times smaller than the command's
PNG** — WebP has no pure-JavaScript encoder worth bundling, and the command has
to run without an install. If size matters and you only have the command:
`cwebp -q 80 img/photo.ink.png -o img/photo.ink.webp`.

Open the page, drop the artwork in, and turn three things:

| Control | What it does | Reach for it when |
|---|---|---|
| **Nib** — σ | The smallest mark the pen can make, in pixels. | Detail is too busy; a broader nib loses it deliberately. |
| **Line** — p | Sharpness: how hard an edge is pushed from what surrounds it. | The weakest of the four — φ does most of the work. |
| **Threshold** — ε | Where ink begins. Above it the sheet is left bare. | Too much of the page is inked, or too little. |
| **Body** — φ | How hard the ink commits. `2` is a wash, `4` a drawing, `16` a woodcut. | **This is the headline control.** |
| **Edge fade** | How far the drawing dissolves into bare page. | Always. Zero leaves a hard rectangle. |
| **Format** | WebP by default, PNG for print. | Only reach for PNG when the file leaves the book. |
| **Size** | Export width. 1200 by default. | Bigger only if the artwork is a full bleed on a large display. |

The treatment is **XDoG** (Winnemöller, Kyprianidis & Olsen, 2012) — see `CREDITS.md`.
ε and φ are that paper's parameters, not invented ones.

Then **Save**, and use the result like any other picture:

```markdown
![A technician checking a cylinder](artwork.ink.webp)
```

**Format and size are the two numbers that matter**, because pictures are packed
*inside* the book as base64 — a book's weight is the sum of them plus a third.
The same 900×1200 drawing measured: **PNG 1,838 KB, WebP 592 KB.** Both carry
transparency, so WebP is the default and PNG is there for print. The width
defaults to 1200, which is already more than a 780 px page resolves. The status
line shows what each export costs, packed.

Nothing in the book changes to support this. The export is an ordinary PNG, so
the asset store packs it, `--assets folder` splits it out, and it prints.

### Add `{.plate}` if the page's ruled lines should not run through it

```markdown
![A technician checking a cylinder](artwork.ink.webp){.plate}
```

The export carries only *how much pen landed where*, so by default the page reads
straight through it — correct for line art on an open page, wrong for a face.
`{.plate}` makes the book hide its own ruling behind the picture.

**It does not guess the paper colour, it blurs what is actually there.** Ruled
lines blurred wider than their spacing dissolve into their local average, and
that average *is* the paper at that spot — gradient, watermark and all. Baking
paper into the export was built three times and failed three times the same way,
with a faint rectangle, because a page is a gradient and a picture cannot know
where on it it sits. This cannot be wrong, because it never asks.

Two knobs, both CSS custom properties on the picture: `--plate-blur` (18px) and
`--plate-fade` (12%). A browser without `backdrop-filter` simply shows the
drawing with the ruling reading through — the default look, not a broken page.

**The pictures in `content/img/` are placeholders — smooth gradients, not
photographs.** Running the treatment on them produces a smudge, correctly: there
are no edges to find. Judge the Ink Studio on real artwork, never on those.

**Three things worth knowing before you judge a result.**

- **Artwork beats photographs.** Flat areas ink cleanly; film grain and woven
  cloth register as thousands of tiny edges and come out as texture. That is the
  treatment reporting the picture honestly, not a fault — reach for a broader
  nib, or a lower `line`.
- **A source on white drops out completely.** A subject photographed against a
  dark studio ground washes to pigment across the whole frame, and the drawing
  reads as a tinted rectangle. Cut the background out first and it will sit
  directly on the paper.
- **The ink follows the theme, the export does not follow a rebrand.** The
  studio draws in the palette's `ink`, so the colours are right by construction —
  but the exported file is a file. Change `theme.json` and the artwork wants
  re-exporting, which is one drop and one click. The *paper* is not baked in at
  all, so `{.plate}` keeps matching whatever the theme becomes.

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
