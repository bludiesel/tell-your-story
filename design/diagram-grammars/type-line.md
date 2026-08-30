# Line chart

**Best for:** a quantity changing over time, when the SHAPE of the change is the
point — a pressure trace, an incident count falling, a temperature curve.

**Not for** categories with no order between them. Connecting unrelated
categories with a line invents a trend.

## Layout conventions

- **Time on the x-axis, left to right.** No exceptions worth taking.
- **One to three series.** Four is a spaghetti plot; split the page.
- **Label each line AT ITS END**, in line with the last point, 11–12px. A legend
  costs the reader a lookup per glance and this chart cannot afford it.
- Points marked only when there are few enough to matter (under ~12), 3px
  radius. A continuous trace has no dots.
- Axis: a single baseline and a single left rule, `var(--ink-soft)`, hairline.
  **Ticks only where a number is printed.**
- **Say if the y-axis is truncated**, in words, near the axis. It is sometimes
  legitimate for a trace where the interesting variation is small — but it must
  be stated, not implied.
- Annotate the event that explains the shape — a short vertical hairline with a
  label: `procedure changed`. That annotation is usually the actual lesson.

## Colour

- Lines `currentColor`, 1.6–2px.
- **`var(--accent-ink)` on the series being discussed**; the others drop to
  `var(--ink-soft)` at 1.2px. Emphasis by weight AND colour survives a
  monochrome print, where colour alone does not.
- Never fill under the line unless it is a single series and the AREA means
  something (a total, a volume).

## Tag it

**`dg-link` on every line path — it draws itself left to right**, which is time
passing, and is the single best animation in this whole set · `dg-node` on
marked points · `dg-label` on series names, axis numbers and annotations.

## Anti-patterns

- Smoothing a curve through real measurements. It invents values between the
  points; use straight segments.
- A dual y-axis. Two scales on one plot can be made to show any relationship you
  like, so it shows none.
- Gaps in the data drawn as a straight line through them. Break the line.
