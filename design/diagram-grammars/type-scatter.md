# Scatter plot

**Best for:** whether two measurements move together — hours since last check
against fault rate, temperature against pressure. The reader should see the
relationship, or see that there isn't one.

**Not for** fewer than about fifteen points. With eight dots the eye invents a
trend that is not there, and a table would have been honest.

**Note the difference from `quadrant`:** a quadrant plots a handful of NAMED
items on two judgement axes; a scatter plots many measurements to reveal a
correlation. Same shape, opposite purposes.

## Layout conventions

- **Square plot area**, so the slope is not distorted by aspect ratio.
- Dots 3–4px, no stroke. **Reduce opacity to about 0.6 where they crowd** so
  density becomes visible — overlapping solid dots hide exactly the region with
  the most data.
- Both axes labelled with **quantity and unit**. An unlabelled axis on a scatter
  is a decorative texture.
- **A trend line only if you can state what it is** — least squares, eyeballed —
  in the caption. An unexplained line is a claim of statistical work that may not
  have happened.
- Label individual points only when a specific one is the story (the outlier).
  Labelling all of them turns it into a `quadrant` and defeats the purpose.
- Axes need not start at zero here — a scatter is about relationship, not
  magnitude — but say the range in the tick labels.

## Colour

- Dots `currentColor`.
- **`var(--accent-ink)` on the outlier the page is about**, with its label.
- A second group may be distinguished by an open circle versus a filled one —
  shape, not hue, so it survives one-colour printing.

## Tag it

`dg-node` on every dot — they pop in staggered, which reads as measurements
accumulating · `dg-link` on the axes and any trend line (it draws itself along
the trend, which is the right emphasis) · `dg-label` on axis titles and any
point labels.

## Anti-patterns

- A trend line through a cloud with no relationship. The point of this chart is
  that it can say "no", and a line takes that away.
- Bubble sizes carrying a third variable without a size legend.
- Reading causation off a slope in the caption. Say what was measured.
