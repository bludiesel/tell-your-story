---
title: Every Layout
subtitle: the torture test
spine: Every Layout
footer: Tell Your Story · verification
hint: tap to open
curtain_eyebrow: verification build
curtain_title: Every Layout
curtain_text: One page per layout, one block per feature. If a page in here looks wrong, that layout is broken — this book exists to make that obvious rather than discoverable.
curtain_hint: click anywhere to begin
typing: true
---

>> Prose

> the plain ones

## Plain prose

Two or three paragraphs and nothing else. This is the default layout, and most
of a real book is made of it.

A second paragraph, so the vertical rhythm between blocks has something to
prove. The gap between any two blocks should be identical and set in one place.

---

> the plain ones

## Chapter opener

:::opener chapter one
The drop cap is cut by CSS rather than by splitting the text, so these words
stay one selectable, searchable string. It runs four lines deep and the opening
line goes to small caps, so the eye gets a run-in rather than a cliff.
:::

---

> the plain ones

## A page given to one sentence

:::quote
A page given to one sentence. Nothing else on it, because the point of a quote
page is the silence around the quote.
:::

---

> the plain ones

## The statement

:::big
One line. The largest type in the book.
:::

---

>> Asides

> things stuck on

## Notes and asides

The typeset asides are part of the document. If the words would survive
reprinting, they belong here rather than on a sticky.

:::note What a note is
Typeset into the page, with a hand-set title and a typeset body.
:::

:::tip A tip
The same shape, a different voice.
:::

:::warning A warning
And the third.
:::

---

> things stuck on

## Stickies are stuck onto something

A sticky belongs to the block above it — positioned against it, overlapping its
edge, hanging into the margin. It never gets a column slot of its own.

:::sticky Remember
A note is something a person added afterwards.
:::

---

> things stuck on

## Marginalia

:::marginalia
A narrow column of text, with the reader's own notes in the outer margin. The
notes go in the OUTER margin on both sides of the spread and never in the
gutter, because nobody can write in a fold.

The column is deliberately narrow — that is what leaves room for the hand.

> the hand goes here

> and a second one lower down
:::

---

> things stuck on

## The takeaway

The takeaway always lands last on its page, whatever else is above it.

:::takeaway The one thing
If a reveal step exists that the audience will not notice, it should not exist.
:::

---

>> Data

> numbers and shapes

## A printed table

| Check | Before | After |
|---|---|---|
| Isolation | manual | interlocked |
| Purge | 4 min | 90 s |
| Sign-off | paper | logged |

---

> numbers and shapes

## The bar chart

:::diagram bars
Isolation | 92
Purge | 74
Sign-off | 58
Handover | 41
:::

---

> numbers and shapes

## A flow

:::diagram flow
Isolate | Prove dead | Tag it | Work
:::

---

> numbers and shapes

## A cycle

:::diagram cycle
Plan | Do | Check | Act
:::

---

>> Spreads

> two pages at once

## The timeline

:::timeline
08:00 | Permit raised
09:30 | Line isolated
11:00 | Purge complete
:::

---

> two pages at once

## The timeline continues

:::timeline
13:00 | Work starts
15:30 | Pressure test
16:45 | Handover signed
:::

---

> two pages at once

## Before

:::compare before
The old sequence, written down and followed from memory. Three steps, none of
them interlocked, and a sign-off on paper.
:::

---

> two pages at once

## After

:::compare after
The same three steps, interlocked so the next cannot start until the last is
proved, and the sign-off logged where it can be audited.
:::

---

> two pages at once

## Two columns

:::columns
Left-hand column, for when a page genuinely holds two parallel things.

Right-hand column, the same weight as the first.
:::

---

>> Workbook

> confirm it

## Checklist

:::checklist Before you go up
- Permit signed and in date
- Anchor point rated for the load
- Harness inspected this month
- Second person on site
:::

---

> a decision

## Flowchart

:::diagram flowchart
<svg viewBox="228 16 384 248" role="img" aria-label="Is the line dead?">
  <defs>
    <marker id="fa" viewBox="0 0 8 8" refX="7" refY="4"
            markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0 0 L8 4 L0 8 z" fill="currentColor"/>
    </marker>
  </defs>
  <g fill="none" stroke="currentColor" stroke-width="1.5" marker-end="url(#fa)">
    <path class="dg-link" d="M320 74 L320 108"/>
    <path class="dg-link" d="M320 172 L320 206"/>
    <path class="dg-link" stroke="var(--accent-ink)" d="M394 140 L520 140 L520 206"/>
  </g>
  <rect class="dg-node" x="240" y="30" width="160" height="44" rx="22"
        fill="var(--paper-2)" stroke="currentColor"/>
  <path class="dg-node" d="M320 108 L394 140 L320 172 L246 140 z"
        fill="var(--paper-2)" stroke="currentColor"/>
  <rect class="dg-node" x="240" y="206" width="160" height="44" rx="8"
        fill="var(--paper-2)" stroke="currentColor"/>
  <rect class="dg-node" x="440" y="206" width="160" height="44" rx="8"
        fill="var(--paper-2)" stroke="var(--accent-ink)"/>
  <g class="dg-label" text-anchor="middle" font-size="13" fill="currentColor">
    <text x="320" y="57">Gauge read</text>
    <text x="320" y="145">Fallen to zero?</text>
    <text x="320" y="233">Open it</text>
    <text x="520" y="233">Stop. Ask.</text>
    <text x="336" y="192" font-size="11">yes</text>
    <text x="452" y="132" font-size="11">no</text>
  </g>
</svg>
:::

Drawn from the grammar, coloured by the theme, animated by the page turn.

---

> in this order

## Steps

:::steps Isolating a line
1. Close the upstream valve
2. Watch the gauge fall — do not assume
3. Prove the line is dead downstream
4. Tag it so nobody reopens behind you
:::

---

> both halves

## Do and don't

:::dodont Ladders
### Do
- Tie it off at the top
- Keep three points of contact
- Set it at one in four
### Don't
- Stand on the top two rungs
- Lean out past your belt
- Use it as a workbench
:::

---

> name the parts

## Anatomy

:::anatomy The cylinder valve
![A cylinder valve and its burst disk, drawn](img/valve.ink.png){.plate}
1. Burst disk | 30 34
2. Outlet | 62 52
3. Handwheel | 44 26
4. Guard | 24 62
:::

---

>> Pictures

> images on paper

## Plate

![A cylinder valve and its burst disk, drawn](img/valve.ink.png){.plate}

A drawing laid on the paper, wide, with the words beneath it. The page's ruled
lines stop where the drawing sits, so the ink covers what is under it.

---

> images on paper

## Half bleed

![A site photograph](img/site-photo.png)

---

> images on paper

:::bleed the left half of one photograph
![](img/diagram.png)
:::

---

> images on paper

:::bleed the right half of the same photograph
![](img/chart.png)
:::

---

>> Closing

> the end matter

## The colophon

:::colophon
Set in Barlow Condensed and Caveat, built from one Markdown file by Tell Your
Story, and rendered as a single standalone HTML page with nothing loaded from
outside it.

Tell Your Story
:::
