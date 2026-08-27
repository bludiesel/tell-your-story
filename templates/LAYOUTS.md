# Every layout, ready to copy

**One page per layout, with the syntax and the placeholder text to replace.**
Copy a block, change the words, delete the rest. A page uses exactly ONE layout;
they are never combined.

Placeholders are written as `[SOMETHING IN CAPITALS]` so an unreplaced one is
impossible to miss — `node scripts/check.ts` fails the build if any survive into a book.

## What is in here

Jump to the one you need — the whole file is worked examples, so reading it end
to end is rarely what you want.

| Layout | Reach for it when |
|---|---|
| [Prose](#prose--the-default--prose) | Most of a real book. The default; no block needed. |
| [Checklist](#checklist--boxes-to-tick--checklist) | A list the reader has to tick, not just read. |
| [Steps](#steps--a-numbered-procedure--steps) | Do these, in this order. |
| [Do / Don't](#do--dont--both-halves-of-a-rule--dodont) | A rule with a right way and a wrong way. |
| [Anatomy](#anatomy--a-drawing-with-numbered-pins--anatomy) | Naming the parts of a thing. |
| [Chapter opener](#chapter-opener--a-drop-cap-four-lines-deep--opener) | The first page of a section. |
| [Statement](#statement--one-line-the-largest-type-in-the-book--statement) | One sentence that has to land on its own. |
| [Quote page](#quote-page--a-page-given-to-one-sentence--quote-page) | Someone else's words, attributed. |
| [Notes and asides](#notes-and-asides--typeset-into-the-document) | `:::warning` `:::tip` `:::note` — a rule, a shortcut, an aside. |
| [Sticky note](#sticky-note--stuck-onto-the-block-above-it--has-sticky) | An annotation ON something, in a human voice. |
| [Marginalia](#marginalia--hand-notes-in-the-outer-margin--marginalia) | A hand note beside the text, not in it. |
| [Takeaway](#takeaway--the-one-thing-to-remember--takeaway) | The line that must survive the book. |
| [Table](#table--rules-never-boxes--ptable) | Facts that line up in columns. |
| [Chart](#chart--horizontal-bars--barchart) | Quantities worth comparing by eye. |
| [Flow and cycle](#flow-and-cycle-diagrams) | A sequence of steps, or a loop. |
| [Timeline](#timeline--one-rail-across-the-gutter--timeline) | Events in order. **Needs a facing pair.** |
| [Before / after](#before--after--a-comparison-spread--compare) | Two things set against each other. **Needs a facing pair.** |
| [Two columns](#two-columns) | Text that reads better narrow. |
| [Plate](#plate--a-drawing-laid-on-the-paper--plate) | Artwork you treated with `ink.mjs`. Wide, words beneath. |
| [Half bleed](#half-bleed--a-picture-off-the-outer-edge--half-bleed) | A photograph beside its explanation. |
| [Full bleed](#full-bleed--a-picture-to-every-edge--full-bleed) | A picture that IS the page. |
| [Colophon](#colophon--the-record-of-how-the-book-was-made--colophon) | The last page: how the book was made. |

For *which* of these a given piece of content wants, read
[`CHOOSING.md`](CHOOSING.md) — it starts from the content, not the layout.

Pages are separated by `---`. `## Heading` becomes the header band and is
removed from the body, so it costs no space. `> line` is the handwritten
eyebrow above it. `>> Name` starts a new section: a hard board, a fore-edge tab
and a contents entry, all generated.

---

## Prose — the default  `prose`

Most of a real book. No block needed; just write.

```markdown
> [EYEBROW — 2 OR 3 WORDS]

## [HEADING]

[FIRST PARAGRAPH. Two or three sentences.]

[SECOND PARAGRAPH.]
```

---

## Chapter opener — a drop cap four lines deep  `opener`

The first page of a section, where the prose should BEGIN rather than continue.

```markdown
> [EYEBROW]

## [HEADING]

:::opener [SMALL HAND-SET LINE, e.g. chapter one]
[THE OPENING PARAGRAPH. Its first letter becomes the cap, cut by CSS, so the
words stay one selectable, searchable string.]
:::
```

---

## Statement — one line, the largest type in the book  `statement`

```markdown
> [EYEBROW]

:::big
[ONE SENTENCE. If it needs two, it is not a statement.]
:::
```

---

## Quote page — a page given to one sentence  `quote-page`

The silence around the quote IS the layout. Nothing else goes on this page.

```markdown
> [EYEBROW]

:::quote
[THE QUOTED SENTENCE.]
:::
```

---

## Notes and asides — typeset into the document

Three voices. If the words would survive reprinting, they belong here rather
than on a sticky.

```markdown
## [HEADING]

[A PARAGRAPH THE ASIDE BELONGS TO.]

:::note [TITLE]
[Something worth knowing.]
:::

:::tip [TITLE]
[A shortcut, a good habit, something that makes the job easier.]
:::

:::warning [TITLE]
[Anything where getting it wrong hurts someone or breaks something.]
:::
```

---

## Sticky note — stuck ONTO the block above it  `has-sticky`

A sticky is something a person added afterwards. It attaches to whatever
precedes it, so **write it directly after the block it annotates.** Maximum two
per page, never on a board or a cover.

```markdown
## [HEADING]

[THE PARAGRAPH THE NOTE IS STUCK TO.]

:::sticky [TITLE]
[The note, in a human voice.]
:::
```

---

## Marginalia — hand notes in the outer margin  `marginalia`

Any `>` quote inside becomes a margin note. They sit in the OUTER margin on both
sides of the spread, never in the gutter — nobody can write in a fold.

```markdown
## [HEADING]

:::marginalia
[THE NARROW COLUMN OF TEXT.]

[A SECOND PARAGRAPH IF YOU NEED ONE.]

> [A NOTE IN THE MARGIN]

> [AND A SECOND, LOWER DOWN]
:::
```

---

## Takeaway — the one thing to remember  `takeaway`

Always lands last on its page, whatever else is above it.

```markdown
## [HEADING]

[THE ARGUMENT.]

:::takeaway [TITLE]
[The single thing that must survive everything else on this page.]
:::
```

---

## Table — rules, never boxes  `ptable`

Three horizontal rules in the whole table and nothing vertical. Keep it under
about twelve rows; more than that wants two pages.

```markdown
## [HEADING]

| [COLUMN] | [COLUMN] | [COLUMN] |
|---|---|---|
| [CELL] | [CELL] | [CELL] |
| [CELL] | [CELL] | [CELL] |
```

---

## Chart — horizontal bars  `barchart`

One row per bar, written `label | number`.

```markdown
## [HEADING]

:::diagram bars
[LABEL] | [NUMBER]
[LABEL] | [NUMBER]
[LABEL] | [NUMBER]
:::
```

---

## Flow and cycle diagrams

Real SVG, drawn at build time and animated when its step arrives.

```markdown
## [HEADING]

:::diagram flow
[STEP] | [STEP] | [STEP] | [STEP]
:::
```

```markdown
## [HEADING]

:::diagram cycle
[STAGE] | [STAGE] | [STAGE] | [STAGE]
:::
```

---

## Timeline — one rail across the gutter  `timeline`

Written `when | what`. **Use it on BOTH pages of a spread** and the rail reads
as one line crossing the fold. Two or three stops a page.

```markdown
## [HEADING]

:::timeline
[TIME OR DATE] | [WHAT HAPPENED]
[TIME OR DATE] | [WHAT HAPPENED]
[TIME OR DATE] | [WHAT HAPPENED]
:::

---

## [HEADING CONTINUED]

:::timeline
[TIME OR DATE] | [WHAT HAPPENED]
[TIME OR DATE] | [WHAT HAPPENED]
:::
```

---

## Before / after — a comparison spread  `compare`

Both sides carry the SAME structure on purpose: the comparison is only honest if
the one difference is the content. **Always a pair, on facing pages.**

```markdown
## [HEADING]

:::compare before
[HOW IT WAS.]
:::

---

## [HEADING]

:::compare after
[HOW IT IS NOW — the same shape of sentence, so the difference is the content.]
:::
```

---

## Two columns

For a page that genuinely holds two parallel things.

```markdown
## [HEADING]

:::columns
[LEFT-HAND COLUMN.]

[RIGHT-HAND COLUMN, the same weight as the first.]
:::
```

---

## Checklist — boxes to tick  `checklist`

A list the reader has to **confirm**, not just read. The boxes are sized for a
real pen, because this is a page people mark standing on a site.

```markdown
## [HEADING]

:::checklist [WHAT THEY ARE CONFIRMING]
- [FIRST THING TO CONFIRM]
- [SECOND THING]
- [THIRD THING]
:::
```

---

## Steps — a numbered procedure  `steps`

Do these, in this order. Not a flow diagram: `:::diagram flow` is for a decision
that **branches**, and a flow chart of a straight line is harder to follow than
a numbered list, not easier.

```markdown
## [HEADING]

:::steps [WHAT THE PROCEDURE IS]
1. [FIRST ACTION]
2. [SECOND ACTION]
3. [THIRD ACTION]
:::
```

---

## Do / Don't — both halves of a rule  `dodont`

One page, both halves, one glance. Write two `###` headings inside: the first is
the DO half, the second the DON'T. Use `:::compare` instead when the two things
are separated by **time** rather than by judgement — and only when you have a
facing pair to give it.

No colour carries the meaning, deliberately: a workbook printed in one colour
still has to work.

```markdown
## [HEADING]

:::dodont [WHAT THE RULE IS ABOUT]
### Do
- [THE RIGHT WAY]
- [ANOTHER RIGHT WAY]
### Don't
- [THE WRONG WAY]
- [ANOTHER WRONG WAY]
:::
```

---

## Anatomy — a drawing with numbered pins  `anatomy`

Naming the parts of a thing. Each key line carries its pin position as **per
cent across and per cent down the picture** — you know where the parts are and
the software does not.

Percentages, not pixels, so a pin stays on its part at every page size. Labels
drawn into the artwork instead cannot survive a resize, a rebrand or a
translation.

```markdown
## [HEADING]

:::anatomy [WHAT THE THING IS]
![[DESCRIPTION FOR SCREEN READERS]](img/[FILE].ink.png){.plate}
1. [FIRST PART] | 32 20
2. [SECOND PART] | 60 45
3. [THIRD PART] | 48 72
:::
```

---

## Plate — a drawing laid on the paper  `plate`

For **artwork you have treated**, not for a photograph. The drawing runs wide
across the text column with the words beneath it, at its own proportion — a
drawing is usually landscape, and pouring one into the half bleed's tall outer
column crops it and blurs half the page.

Reach for it whenever the picture came out of `dist/ink.mjs`. It is chosen
automatically by the `{.plate}` on the image; there is nothing else to write.

```markdown
## [HEADING]

![[DESCRIPTION FOR SCREEN READERS]](img/[FILE].ink.png){.plate}

[ONE OR TWO SHORT PARAGRAPHS ABOUT WHAT THE DRAWING SHOWS.]
```

---

## Half bleed — a picture off the outer edge  `half-bleed`

A page that is mostly a picture, with the copy in the inner column. Just an
image and a little text; the layout is chosen automatically.

```markdown
## [HEADING]

![[DESCRIPTION FOR SCREEN READERS]](img/[FILE].png)

[ONE SHORT PARAGRAPH, OR NONE.]
```

> **Half bleed is for a PHOTOGRAPH.** A photograph on a page of paper and
> handwriting is the one element that came from a different hand, so treat it
> first: run `node dist/ink.mjs img/[FILE].png` and place the `.ink.png` it
> writes with `{.plate}` — which puts the page on the **Plate** layout above,
> where a drawing belongs. Full syntax and the slider version are in SKILL.md.

---

## Full bleed — a picture to every edge  `full-bleed`

For a picture crossing a SPREAD, cut it down the middle and use **two** `:::bleed`
pages back to back. A single element cannot span two leaves — the halves are on
different sheets of paper.

```markdown
:::bleed [CAPTION, PRINTED OVER THE PICTURE]
![](img/[LEFT-HALF].png)
:::

---

:::bleed
![](img/[RIGHT-HALF].png)
:::
```

---

## Colophon — the record of how the book was made  `colophon`

The last printed page. It carries no folio, by convention. A final short
paragraph becomes the imprint line.

```markdown
:::colophon
[HOW THIS WAS MADE, in a sentence or two.]

[YOUR BRAND]
:::
```

---

## Generated for you — do not author these

| Layout | Comes from |
|---|---|
| **Cover** | the `title`, `subtitle` and `footer` in the front matter |
| **Contents** | your `>>` sections — numbers, titles, dot leaders and folios, all derived, so it can never cite a page that is not there |
| **Section board** | each `>> Name`, with its fore-edge tab |
| **Folios** | every printed page, in one pass; never on a cover, board or colophon |
