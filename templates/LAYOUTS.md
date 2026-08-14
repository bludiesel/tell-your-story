# Every layout, ready to copy

**One page per layout, with the syntax and the placeholder text to replace.**
Copy a block, change the words, delete the rest. A page uses exactly ONE layout;
they are never combined.

Placeholders are written as `[SOMETHING IN CAPITALS]` so an unreplaced one is
impossible to miss — `node scripts/check.ts` fails the build if any survive into a book.

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

## Half bleed — a picture off the outer edge  `half-bleed`

A page that is mostly a picture, with the copy in the inner column. Just an
image and a little text; the layout is chosen automatically.

```markdown
## [HEADING]

![[DESCRIPTION FOR SCREEN READERS]](img/[FILE].png)

[ONE SHORT PARAGRAPH, OR NONE.]
```

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
