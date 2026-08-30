# Quadrant

**Best for:** positioning things on two axes where the QUADRANT is the verdict —
urgent/important, likelihood/severity, effort/value. The reader should be able
to point at a corner and say what to do about anything in it.

**Not for** two measurements that do not interact. Two bar charts say that
better and do not imply a judgement that is not there.

## Layout conventions

- **A square plot.** A rectangle distorts the comparison — a point that is
  "further right than up" must actually look it.
- **Name both axes at both ends** — `low` / `high`, or better, the real words:
  `rarely` → `often`. An unlabelled axis is an opinion with a graph round it.
- **Name all four quadrants**, in the hand font, 11–12px, tucked into the outer
  corner at 40% opacity. The names are the recommendation: *act now*, *plan*,
  *delegate*, *ignore*.
- Axis lines through the centre, `var(--ink-soft)`, 1px. **No grid.** A grid
  implies a precision this diagram does not have.
- Items are dots, 6–8px radius, with the label beside them, never inside.
- **8–12 items.** Past that they collide and you spend the page on leader lines.

## Colour

- Axes and dots `currentColor`.
- **`var(--accent-ink)` on the items in the quadrant that demands action** —
  usually one corner, not one dot.
- Do not fill the quadrants with different tints. A workbook may be printed in
  one colour, and the corner names already carry the meaning.

## Tag it

`dg-node` on every dot · `dg-link` on the two axis lines · `dg-label` on axis
ends, quadrant names and item labels.

## Anti-patterns

- A dot exactly on an axis. Decide, or the reader will think you could not.
- Quadrant names that only describe position (`high-high`). Say what to DO.
- Bubble sizes carrying a third variable — that is a scatter plot, and it needs
  a legend this layout has no room for.
