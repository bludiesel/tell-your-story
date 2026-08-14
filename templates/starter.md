---
title: "[BOOK TITLE]"
subtitle: "[WHO IT IS FOR, three or four words]"
spine: "[SHORT TITLE FOR THE SPINE]"
footer: "[YOUR BRAND]"
hint: tap to open
curtain_eyebrow: "[YOUR BRAND · WHAT THIS IS]"
curtain_title: "[BOOK TITLE]"
curtain_text: "[ONE OR TWO SENTENCES ON WHAT THIS COVERS AND HOW LONG IT TAKES.]"
curtain_hint: click anywhere to begin
typing: true
---

<!--
  A STARTER, not an example to keep. Every [BRACKETED] string is a placeholder:
  replace it, and delete the pages you do not need. `node scripts/check.ts` fails the
  build if any survive, so an unreplaced placeholder cannot reach a reader.

  Pages are separated by ---
  ## Heading   becomes the header band, and is removed from the body
  > line       the handwritten eyebrow above it
  >> Name      starts a section: a hard board, a fore-edge tab, a contents entry

  Every layout, ready to copy:  templates/LAYOUTS.md
  Which layout for which content: templates/CHOOSING.md
-->

>> [FIRST SECTION]

> [EYEBROW]

## [OPENING HEADING]

:::opener [SMALL HAND-SET LINE]
[THE OPENING PARAGRAPH. Its first letter becomes a drop cap four lines deep, so
give it a sentence worth opening on.]
:::

---

> [EYEBROW]

## [HEADING]

[A PARAGRAPH.]

[A SECOND PARAGRAPH.]

:::sticky [NOTE TITLE]
[A note in a human voice, stuck onto the paragraph above.]
:::

---

> [EYEBROW]

## [HEADING]

[A SHORT INTRODUCTION TO WHATEVER FOLLOWS.]

:::note [TITLE]
[Something worth knowing, typeset into the page.]
:::

:::takeaway [TITLE]
[The one thing to remember from this page. It lands last.]
:::

---

>> [SECOND SECTION]

> [EYEBROW]

## [HEADING]

| [COLUMN] | [COLUMN] | [COLUMN] |
|---|---|---|
| [CELL] | [CELL] | [CELL] |
| [CELL] | [CELL] | [CELL] |

---

> [EYEBROW]

## [HEADING]

:::diagram flow
[STEP] | [STEP] | [STEP] | [STEP]
:::

---

>> [THIRD SECTION]

> [EYEBROW]

## [HEADING]

[THE ARGUMENT THIS BOOK IS BUILDING TO.]

---

> [EYEBROW]

:::big
[THE ONE LINE YOU WANT THEM TO LEAVE WITH.]
:::

---

:::colophon
[HOW THIS WAS MADE, in a sentence or two.]

[YOUR BRAND]
:::
