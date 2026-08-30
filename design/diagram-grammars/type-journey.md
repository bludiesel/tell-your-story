# Journey

**Best for:** a person's path through something, with **how it feels** plotted
alongside what happens — a first day on site, a permit application, an
inspection from the inspected party's side. The emotional line is what makes it
a journey rather than a process.

**Not for** a technical sequence. If nobody in it has a feeling, use `:::steps`
or a `flowchart`.

## Layout conventions

- **Stages across the top** as column headers, 4–6 of them. More and the
  columns get too narrow for a sentence.
- **A feeling line** running under them: a polyline whose y is the sentiment at
  each stage. Plot it on 3 or 5 levels, never a continuous scale — nobody can
  tell 0.62 from 0.71 and pretending otherwise is false precision.
- **Mark the low point.** That is where the work is, and it is the reason the
  diagram exists.
- Under each stage, 1–3 short lines: what they DO, and what they THINK. Keep
  the think line in the hand font — it is a quotation, not a specification.
- Column dividers as hairlines, `var(--ink-soft)`.

## Colour

- The feeling line `currentColor`, 2px, round caps.
- **`var(--accent-ink)` on the low point marker only.** Colouring the whole
  line by sentiment turns a story into a heat map.

## Tag it

`dg-link` on the feeling line (it draws itself, which is exactly right here) ·
`dg-node` on the stage markers · `dg-label` on stage names and the do/think text.

## Anti-patterns

- A journey that only goes up. Nobody believes it, and the flat truth is more
  useful than the flattering curve.
- Smoothing the line through a bezier — the kink at the bad moment IS the point.
- More than six stages. Split into before / during / after.
