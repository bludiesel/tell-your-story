# Kanban board

**Best for:** work in progress across stages, when the QUEUE is the point — what
is piling up, where the bottleneck is, what is actually being worked on.

**Not for** a plan over time. That is `gantt`. A board shows a moment; the
moment it is printed, it is history — so print one only when that snapshot
teaches something.

## Layout conventions

- **Columns are stages, left to right in flow order.** 3–5 columns; six needs a
  wider page than a book has.
- **Column header carries the stage name AND the count**: `In review · 7`. The
  count is what makes the picture an argument.
- **A WIP limit, if there is one, in the header at 10px** — `max 3` — and when
  the count exceeds it, the header goes `var(--accent-ink)`. That is the entire
  reason to draw a board in a teaching book.
- Cards 100–140 wide, 34–44 tall, `rx=4`, stacked with a 6–8px gap. **One line
  of text per card**, 10–11px, truncated with an ellipsis rather than wrapped —
  wrapped cards of different heights make the columns impossible to compare.
- **A column with nothing in it is drawn empty, not omitted.** The empty column
  is often the finding.
- 4–6 cards per column at most; a taller stack becomes `+ 9 more` at the bottom.

## Colour

- `currentColor` strokes; cards `var(--paper-2)`, column background
  `var(--paper)` with a hairline `var(--ink-soft)` divider between columns.
- **`var(--accent-ink)` on the column that is over its limit**, or the blocked
  card. One thing.

## Tag it

`dg-node` on every card — **column by column, left to right**, so the board
fills the way work moves · `dg-label` on card text and headers · `dg-link` on
the column dividers.

## Anti-patterns

- Coloured cards by owner or type. It becomes a legend and the queue lengths —
  the actual content — stop being visible.
- A board with even columns everywhere. Then there is no bottleneck and no
  reason for the diagram.
- Real names on cards in a training book. Use roles.
