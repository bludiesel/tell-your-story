# Story map

**Best for:** everything a user does, arranged so a release can be sliced out of
it — the top row is the journey, the columns beneath are the detail, and a
horizontal line is a decision about what ships.

**Not for** a backlog. A backlog is a list; the map exists precisely because a
list loses the shape of the user's day.

## Layout conventions

- **Top row = the spine**: the big activities in the order a user meets them,
  left to right, as verb phrases. 5–8 of them, in slightly larger boxes.
- **Below each spine item, a column of the smaller tasks**, most essential at
  the top, descending to nice-to-have. **The vertical order is a priority
  claim** and it is the second-most important thing on the page.
- **A horizontal slice line across the whole map**, labelled at the left margin:
  `release 1`. Everything above the line ships; everything below waits. Two
  lines maximum.
- Spine boxes 120–150 wide; task cards the same width, 30–38 tall, 6px apart,
  one line of text each.
- **Columns are the same width and aligned to a grid**, so the slice line means
  the same thing across the page.
- **Every column crosses the first slice line.** A release that skips a spine
  activity entirely is a release the user cannot complete — the map's most
  useful catch.

## Colour

- `currentColor` strokes; spine `var(--paper-2)` with a heavier stroke, cards
  `var(--paper)`.
- **The slice line in `var(--accent-ink)`, dashed, with its label.** It is the
  decision; it should be the thing the eye lands on.
- Cards below the line drop to `var(--ink-soft)`.

## Tag it

`dg-node` on spine boxes and cards — **spine first, then the columns**, so the
journey appears before the detail · `dg-link` on the slice line · `dg-label` on
all text.

## Anti-patterns

- A spine that is a list of features. It must be the USER's activities, in their
  order, or the map is a backlog in an expensive layout.
- No slice line. Then no decision has been made and the map has not done its job.
- Estimates on the cards. Different conversation, different page.
