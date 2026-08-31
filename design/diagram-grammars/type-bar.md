# Bar chart

**`:::diagram bars` generates one from a line of text** — `Leaks 40 | Vents 25 |
Purges 12` — and for a plain comparison of a handful of quantities, use that.
This grammar is for a bar chart the generator cannot draw: grouped, stacked,
negative values, or one with an annotation on a specific bar.

**Best for:** comparing quantities across categories.

**Not for** parts of one whole (say the percentage in words) or change over time
(use `line`).

## Layout conventions

- **Horizontal bars when the labels are words**, vertical when they are dates or
  short codes. A vertical chart with rotated labels is a chart nobody read.
- **Baseline at zero. Always.** A truncated axis exaggerates a difference by an
  arbitrary factor, and on a page teaching people to be careful, that is worse
  than no chart.
- **Bar thickness roughly twice the gap.** Thin bars with wide gaps read as a
  scatter of sticks.
- **Value at the end of each bar**, in the mono face, 11px — then no axis ticks
  are needed and the chart loses a whole layer of furniture.
- Sort by value, descending, unless the category order carries meaning (months,
  severity bands). An unsorted bar chart makes the reader do the ranking.
- **Stacked only for 2–3 segments**, and only when the TOTAL matters as much as
  the parts. Beyond that the middle segments cannot be compared and you have
  drawn decoration.

## Colour

- `var(--paper-2)` fill with a `currentColor` stroke on every bar.
- **`var(--accent-ink)` on the one bar the page is about.** Every bar in a
  different colour is a legend, and a legend means the reader looks away from
  the chart to decode it.
- Stacked segments differ by fill weight, not hue, for the same reason.

## Tag it

**`dg-bar` on every bar — it grows from its baseline**, which is what makes a
bar chart read as measurement rather than as coloured rectangles ·
`dg-label` on values and category names · `dg-link` on the axis line if you
draw one.

**Which edge is the baseline is worked out from the bars, not guessed.** Bars
that all share a bottom edge are columns and grow upward; anything else grows
rightward from its left edge. That is decided by geometry rather than by shape,
because a bar chart's smallest bar is often taller than it is wide and the data
must never choose the animation. **A lone bar has no baseline to share** — it
grows rightward unless you say otherwise with `data-grow="up"` on the bar or on
the `<svg>`.

## Anti-patterns

- A three-dimensional bar. It adds nothing and misreports every value.
- Gridlines. With the value at the end of the bar they are noise.
- A chart of two bars. Write the sentence.
