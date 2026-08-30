# Treemap

**Best for:** parts of a whole when there are too many parts for a bar chart and
some are much bigger than others — spend by category, faults by system, storage
by owner. Area is the value.

**Not for** precise comparison. Humans read length well and area badly, so if
the reader needs to know that A is 12% bigger than B, use a `bar` chart. A
treemap is for "this one is most of it, and these are the rest".

## Layout conventions

- **Squarified layout** — subdivide so the rectangles come out near-square.
  Long thin slivers are unreadable and their areas are impossible to judge.
- **Largest at the top left**, descending toward the bottom right. A reader
  scans that way and gets the ranking for free.
- 1px gaps between tiles, `var(--paper)`. Any wider and the gaps steal area from
  the values.
- **Label inside the tile** when it fits — name on one line, value on the next
  in the mono face at 10–11px. **A tile too small for a label gets none**, and
  its name goes in a caption line beneath the diagram. Leader lines out of a
  treemap are a sign the chart is the wrong choice.
- **One level of nesting at most**: a group border in `currentColor` around its
  children, with the group name in a 16px header strip above them.
- 6–15 tiles. Below six, use a bar chart; above fifteen, aggregate a tail.

## Colour

- Tiles `var(--paper-2)`, hairline `currentColor` stroke.
- **`var(--accent-ink)` on the tile that is the finding** — usually the one
  nobody expected to be that big.
- Weight of fill may encode a second variable (e.g. rate of change), but say so
  in the caption; nobody guesses it.

## Tag it

`dg-node` on every tile — they pop in staggered, largest first, which reads as
the picture assembling itself · `dg-label` on names and values.

## Anti-patterns

- A treemap of similar-sized things. It is a grid, and a grid says nothing.
- Negative values. Area cannot be negative; the chart cannot show them at all.
- Nesting three deep. The inner borders and the tile borders become the same
  thing and the hierarchy disappears.
