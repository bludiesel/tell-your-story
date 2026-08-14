---
title: Design states
subtitle: every visual component, one per page
spine: Design states
curtain_eyebrow: tell-your-story
curtain_title: Design states
curtain_text: A frozen sandbox of every visual component in the kit, for working on the look without running the book.
steps: false
---

>> Text

> the ordinary page
## A page of prose

The default page: a header band lifted from the heading, an eyebrow above it,
body copy on ruled paper, a folio and the brand mark in the outer corner.

This paragraph exists so line length, leading and the ruled-line rhythm can be
judged against real copy rather than against a placeholder.

---

## Lists and emphasis

Body copy carries **bold**, *italic*, `inline code` and [a link](https://example.com),
all of which need to sit on paper without fighting the rules underneath.

- A list item, to check the bullet and its indent
- A second one, long enough to wrap onto a second line so the hanging indent is visible
- A third

---

>> Blocks

## Note, tip, warning

:::note Worth knowing
A typeset aside — part of the document, not stuck on afterwards.
:::

:::tip
A practical pointer, in the positive key.
:::

:::warning
The danger case. This one has to read as a stop at a glance.
:::

---

## Takeaway, quote, sticky

:::takeaway
The single thing to remember from a page.
:::

:::quote
Someone's words, given weight and a different voice.
:::

:::sticky Remember
An aside in a human voice, pinned on at an angle.
:::

---

## Columns and a table

:::columns
Left column, for comparing two things side by side.
:::
:::columns
Right column, which should balance the left without matching it exactly.
:::

| Component | Where it lives | Notes |
|---|---|---|
| Header band | top of every page | lifted from the heading |
| Folio | outer corner | handwritten face |
| Brand mark | outer corner | theme token |

---

>> Diagrams

## A process, drawn

:::diagram flow
Isolate | Prove dead | Tag it | Work
:::

---

## Something that repeats

:::diagram cycle
Plan | Do | Check | Act
:::

---

## Comparing numbers

:::diagram bars
Before | 42
After | 78
Target | 90
:::

---

>> Closing

## One large statement

:::big
Nothing moves on the page.<br>Only the order it arrives in.
:::

---

>> Layouts

## Chapter opener

:::opener chapter one
The drop cap is cut by CSS rather than by splitting the text, so the words stay
one selectable string. Four lines deep, with the opening line in small caps.
:::

---

## The timeline

:::timeline
08:00 | Permit raised
09:30 | Line isolated
11:00 | Purge complete
:::

---

## Before

:::compare before
The old sequence, followed from memory. Three steps, none interlocked.
:::

---

## After

:::compare after
The same three steps, interlocked, with the sign-off logged.
:::

---

## Marginalia

:::marginalia
A narrow column, with the reader's own notes in the outer margin — never in the
gutter, because nobody can write in a fold.

> the hand goes here

> and a second, lower down
:::

---

## Full bleed

:::bleed a caption over the picture
![](../content/img/site-photo.png)
:::

---

## The colophon

:::colophon
Set in Barlow Condensed and Caveat, built from one Markdown file and rendered as
a single standalone page.

Your Brand
:::

---

## The last page

The end of the book, so the closing spread and the final page mark can be
checked in place.
