# Radar (spider)

**Best for:** one thing scored on 5–8 dimensions, where the SHAPE is the
finding — a competency profile, a readiness assessment, a site scored against a
standard. Two overlaid shapes answer "where are we weak against the target".

**Not for** dimensions measured in different units. The axes share one scale by
construction, so putting bar and °C on the same web is nonsense with a
professional finish.

## Layout conventions

- **5–8 axes**, evenly spaced round the circle. Fewer looks like a mistake;
  more and the labels collide.
- **Rings at even intervals**, 3–5 of them, `var(--ink-soft)` hairline, with the
  outermost labelled with its value. No other numbers.
- **Axis labels outside the outer ring**, radiating, 11–12px, horizontal —
  rotated labels on a radar are unreadable and always have been.
- **Two overlaid shapes maximum.** Three is a tangle.
- Close every polygon, and mark the vertices with small dots so the reader can
  see which ring each one reaches.
- **Axis order is a decision.** Related dimensions adjacent makes the shape
  meaningful; a random order makes it noise that happens to be symmetrical.

## Colour

- Web and rings `var(--ink-soft)`.
- The measured shape: `currentColor` stroke, no fill or a very light
  `var(--paper-2)`.
- **The target or benchmark shape: `var(--accent-ink)`, dashed, no fill.** The
  gap between the two is the entire diagram.

## Tag it

`dg-link` on the polygon outlines and the web (each polygon draws itself round
the circle) · `dg-node` on the vertex dots · `dg-label` on axis names and the
outer ring's value.

## Anti-patterns

- A filled shape hiding the one underneath. Stroke, do not fill.
- Different scales per axis. If the units differ, normalise and SAY so, or use
  a bar chart.
- Reading area as a total score. The area depends on the axis ORDER, which is
  arbitrary — a genuinely misleading property of this chart, and the reason to
  keep the axes few and deliberate.
