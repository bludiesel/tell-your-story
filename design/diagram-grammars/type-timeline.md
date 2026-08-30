# Timeline (single page)

**Best for:** events on an axis where the GAPS matter — an incident replayed
minute by minute, a project's phases, a certification's renewal cycle.

**`:::timeline` is the block for a timeline that crosses a spread** — a rail
running over the gutter, one line across two sheets of paper. Use this grammar
for a timeline that lives on one page, or that needs a shape the block does not
give you.

## Layout conventions

- **A single rail** across the page, `currentColor`, 1.5px, with an arrowhead
  if time continues past the last event.
- **Stops are dots on the rail**, 6–7px radius, filled `var(--paper)` with a
  `currentColor` stroke so the rail appears to pass behind them.
- **Space stops by real time, not evenly**, whenever the intervals matter. A
  three-week gap drawn the same width as a three-minute one destroys the only
  thing a timeline knows that a list does not.
- **Alternate labels above and below** the rail when they would otherwise
  collide. Keep the date on the same side as its text.
- Date in the mono face, 10–11px; the event in body face, 12–13px.
- 4–8 stops. Past that, break by phase.

## Colour

- Rail and dots `currentColor`.
- **`var(--accent-ink)` on the moment everything changed** — the failure, the
  decision, the deadline. One.

## Tag it

`dg-link` on the rail (it draws left to right, which is the passage of time and
worth having) · `dg-node` on every stop · `dg-label` on dates and events.

## Anti-patterns

- Even spacing when the intervals are wildly different — the commonest and most
  misleading timeline error.
- A timeline with no dates. That is a `:::steps` page.
- Two rails on one page. Use a `swimlane`.
