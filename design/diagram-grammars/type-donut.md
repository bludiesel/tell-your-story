# Donut

**Best for:** one dominant share of a whole, at a glance — "most of the delays
came from one thing". The key figure goes in the hole, and that number is what
the reader takes away.

**Not for** comparing close values. Nobody reads two similar angles correctly,
which is why a donut of 34/33/33 says nothing at all. And **not for a part of a
whole where the reader should be able to count** — that is `:::diagram waffle`,
which is honest about the hundred.

**Two segments is not a donut.** One value with a remainder is a
`:::diagram progress` meter, or a sentence.

## Layout conventions

- **A ring, not a pie.** Stroke width 28–36 against a radius of ~80 — a filled
  circle has no hole, and the hole is where the number goes.
- **≤ 5 segments.** Fold the tail into "other" and say what is in it.
- **Segments are `stroke-dasharray` on circles, rotated into place.** No path
  arithmetic, and — this is the trap — **do not position them with
  `stroke-dashoffset`**: its sign convention is the classic way to make a
  segment vanish or land on the wrong arc. Rotate each circle instead.
- A stroke starts at **3 o'clock and sweeps clockwise**, so `rotate(-90 …)`
  puts the first segment at twelve.
- **The whole recipe, for `r = 80`:**
  ```
  C     = 2πr ≈ 502.65
  dash  = share × C − 3                       (the −3 shaves a visible gap)
  angle = −90 + (sum of previous shares) × 360
  transform = rotate(angle 100 100)           ← about the CENTRE, not the origin
  ```
- **Direct-label every segment ≥ 10%** outside the ring, with its value. Below
  that the label will not fit and the segment is a candidate for "other".
- The hole carries the headline share at ~40px and one line of label under it.

## Colour

- `var(--accent-ink)` on the segment the page is about — usually the largest.
- Every other segment `currentColor` at a lighter weight, or `var(--ink-soft)`.
- **Segments do not each get their own colour.** That is a legend, and a legend
  means the reader looks away from the chart to decode it.
- Text in `var(--ink)`, never in the segment's colour.

## Tag it

`dg-node` on each segment circle · `dg-label` on the hole figure and every
segment label.

**Not `dg-bar`** — that grows a shape from one edge of itself, and an arc has
no edge to grow from. A donut's segments arriving one after another around the
ring is the reading order anyway.

## Anti-patterns

- Two slices. Write the sentence.
- An exploded segment, a 3D tilt, a gradient. Each of them misreports the angle
  it is decorating.
- A donut with no number in the hole. Then the reader has to estimate an angle,
  which is the one thing this shape is bad at.
