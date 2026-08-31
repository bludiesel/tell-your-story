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

> and effect

## Fishbone

:::diagram fishbone
<svg viewBox="-8 20 630 296" role="img" aria-label="Why the permit was issued late">
  <defs>
    <marker id="fb" viewBox="0 0 8 8" refX="7" refY="4"
            markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0 0 L8 4 L0 8 z" fill="currentColor"/>
    </marker>
  </defs>
  <g fill="none" stroke="currentColor" stroke-width="1.6">
    <path class="dg-link" d="M20 160 L430 160" marker-end="url(#fb)"/>
    <path class="dg-link" d="M170 160 L100 40"/>
    <path class="dg-link" d="M330 160 L260 40"/>
    <path class="dg-link" stroke="var(--accent-ink)" d="M240 160 L170 280"/>
    <path class="dg-link" d="M390 160 L320 280"/>
    <g stroke-width="1.2">
      <path class="dg-link" d="M135 100 L89 100"/>
      <path class="dg-link" d="M295 100 L249 100"/>
      <path class="dg-link" stroke="var(--accent-ink)" d="M205 220 L159 220"/>
      <path class="dg-link" d="M355 220 L309 220"/>
    </g>
  </g>
  <rect class="dg-node" x="440" y="138" width="170" height="44" rx="8"
        fill="var(--paper-2)" stroke="currentColor"/>
  <g class="dg-label" fill="currentColor">
    <g font-size="15" text-anchor="middle">
      <text x="100" y="31">People</text>
      <text x="260" y="31">Process</text>
      <text x="170" y="299" fill="var(--accent-ink)">Equipment</text>
      <text x="320" y="299">Records</text>
    </g>
    <g font-size="13" text-anchor="end" fill="var(--ink-soft)">
      <text x="85" y="104">one signatory</text>
      <text x="245" y="104">no cut-off time</text>
      <text x="155" y="224" fill="var(--accent-ink)">gauge unreadable</text>
      <text x="305" y="224">register out of date</text>
    </g>
    <text x="525" y="166" font-size="16" text-anchor="middle">Permit issued late</text>
  </g>
</svg>
:::

One bone in the accent: the cause the investigation actually confirmed.

---

> what rests on what

## Layers

:::diagram layers
<svg viewBox="80 18 480 224" role="img" aria-label="What a permit rests on">
  <g stroke="currentColor" stroke-width="1.3">
    <rect class="dg-node" x="90" y="26" width="460" height="50" rx="6" fill="var(--paper)"/>
    <rect class="dg-node" x="90" y="77" width="460" height="50" fill="var(--paper-2)"/>
    <rect class="dg-node" x="90" y="128" width="460" height="50" fill="var(--paper-2)"
          stroke="var(--accent-ink)"/>
    <rect class="dg-node" x="90" y="179" width="460" height="50" rx="6" fill="var(--paper-2)"/>
  </g>
  <g class="dg-label" font-size="13" fill="currentColor">
    <text x="110" y="56">The signature</text>
    <text x="110" y="107">The checks that were done</text>
    <text x="110" y="158" fill="var(--accent-ink)">The isolation that made them safe</text>
    <text x="110" y="209">The drawing everyone trusted</text>
    <g font-size="10" text-anchor="end" fill="var(--ink-soft)">
      <text x="530" y="56">last</text>
      <text x="530" y="209">first</text>
    </g>
  </g>
</svg>
:::

Bottom is the foundation, and nobody has to be told.

---

> where things sit

## Quadrant

:::diagram quadrant
<svg viewBox="60 14 420 300" role="img" aria-label="Findings by likelihood and severity">
  <g stroke="var(--ink-soft)" stroke-width="1">
    <path class="dg-link" d="M90 292 L450 292"/>
    <path class="dg-link" d="M90 292 L90 32"/>
    <path class="dg-link" d="M270 292 L270 32"/>
    <path class="dg-link" d="M90 162 L450 162"/>
  </g>
  <g class="dg-node" fill="currentColor">
    <circle cx="150" cy="238" r="6"/>
    <circle cx="196" cy="212" r="6"/>
    <circle cx="336" cy="222" r="6"/>
    <circle cx="152" cy="104" r="6"/>
    <circle cx="358" cy="80" r="6" fill="var(--accent-ink)"/>
    <circle cx="392" cy="118" r="6" fill="var(--accent-ink)"/>
  </g>
  <g class="dg-label" font-size="11" fill="currentColor">
    <text x="162" y="242">labelling</text>
    <text x="208" y="216">signage</text>
    <text x="348" y="226">housekeeping</text>
    <text x="164" y="108">relief valve</text>
    <text x="370" y="84" fill="var(--accent-ink)">isolation</text>
    <text x="404" y="122" fill="var(--accent-ink)">gas detection</text>
    <g font-size="10" fill="var(--ink-soft)">
      <text x="96" y="308">rare</text>
      <text x="450" y="308" text-anchor="end">often</text>
      <text x="80" y="292" text-anchor="end">minor</text>
      <text x="80" y="40" text-anchor="end">severe</text>
      <text x="100" y="46">plan for it</text>
      <text x="440" y="46" text-anchor="end">act now</text>
      <text x="100" y="284">note it</text>
      <text x="440" y="284" text-anchor="end">tidy it up</text>
    </g>
  </g>
</svg>
:::

Four corners, four verdicts — and the accent marks the corner that cannot wait.

---

> how many of them

## Waffle

:::diagram waffle
62 of 100 | of permits were signed before the work started
:::

A hundred squares, sixty-two filled. The reader can count the claim.

---

> one in how many

## Pictogram

:::diagram pictogram
7 in 10 | engineers could not read the gauge
:::

The three empty figures are the point, so they are outlined rather than absent.

---

> how far through

## Progress

:::diagram progress
Signed off | 62
Isolated | 88
Purged | 41
Handed over | 95
:::

Each row against its own limit — a different question from a bar chart, which
compares rows to each other.

---

> the headline figures

## Stats

:::diagram stats
12 | incidents last year
3 | had a permit
0 | had a valid isolation
:::

Rules between them rather than boxes around them: three facts, not three cards.

---

> most of it was one thing

## Donut

:::diagram donut
<svg viewBox="14 14 372 172" role="img" aria-label="Where the delays came from">
  <g fill="none" stroke-width="30">
    <circle class="dg-node" cx="100" cy="100" r="80" stroke="var(--accent-ink)"
            stroke-dasharray="308.6 502.65" transform="rotate(-90 100 100)"/>
    <circle class="dg-node" cx="100" cy="100" r="80" stroke="var(--ink-soft)"
            stroke-dasharray="122.6 502.65" transform="rotate(133.2 100 100)"/>
    <circle class="dg-node" cx="100" cy="100" r="80" stroke="var(--ink-soft)"
            stroke-dasharray="65.4 502.65" transform="rotate(221.2 100 100)" opacity="0.55"/>
  </g>
  <g class="dg-label" fill="currentColor">
    <text x="100" y="94" text-anchor="middle" font-size="40" font-weight="700"
          fill="var(--accent-ink)">62%</text>
    <text x="100" y="122" text-anchor="middle" font-size="13">waiting on a signature</text>
    <text x="200" y="70" font-size="13">Signature — 62%</text>
    <text x="200" y="104" font-size="13">Isolation — 25%</text>
    <text x="200" y="138" font-size="13">Everything else — 13%</text>
  </g>
</svg>
:::

Five segments at most, one of them in the accent, and the figure in the hole so
nobody has to estimate an angle.

---

> where they were lost

## Funnel

:::diagram funnel
<svg viewBox="20 16 420 250" role="img" aria-label="Permits from raised to closed">
  <g stroke="currentColor" stroke-width="1.4">
    <rect class="dg-node" x="60" y="26" width="300" height="42" fill="var(--paper-2)"/>
    <rect class="dg-node" x="105" y="86" width="210" height="42" fill="var(--paper-2)"/>
    <rect class="dg-node" x="141" y="146" width="138" height="42" fill="var(--paper-2)"
          stroke="var(--accent-ink)"/>
    <rect class="dg-node" x="171" y="206" width="78" height="42" fill="var(--paper-2)"/>
  </g>
  <g class="dg-link" fill="none" stroke="var(--ink-soft)" stroke-width="1.1">
    <path d="M60 68 L105 86"/><path d="M360 68 L315 86"/>
    <path d="M105 128 L141 146"/><path d="M315 128 L279 146"/>
    <path d="M141 188 L171 206"/><path d="M279 188 L249 206"/>
    <path d="M249 227 L262 227"/>
  </g>
  <g class="dg-label" fill="currentColor" font-size="13">
    <text x="210" y="52" text-anchor="middle">Raised — 420</text>
    <text x="210" y="112" text-anchor="middle">Approved — 294</text>
    <text x="210" y="172" text-anchor="middle" fill="var(--accent-ink)">Isolated — 193</text>
    <text x="268" y="232" text-anchor="start">Closed — 109</text>
    <g font-size="11" fill="var(--ink-soft)">
      <text x="376" y="82">×0.70</text>
      <text x="376" y="142" fill="var(--accent-ink)">×0.66</text>
      <text x="376" y="202">×0.56</text>
    </g>
  </g>
</svg>
:::

Widths are the values, so every narrowing is a real loss. The accent is on the
worst drop, not on the last stage — and the last label sits outside its stage
on a short leader, because it does not fit inside and shrinking type to make it
fit is how a chart stops being readable.

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
