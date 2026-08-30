# Sankey

**Best for:** where a quantity GOES — energy in and losses out, budget to
categories, incoming reports to outcomes. The width of a flow is its size, and
that width is the whole argument.

**Not for** a process with no quantity attached. A Sankey with equal-width bands
is a `flowchart` that has taken a very long time to draw.

## Layout conventions

- **Left to right, 2–3 columns of nodes.** A fourth column makes the middle
  bands too thin to read.
- **Band width is proportional to value, and the total in equals the total out
  at every node.** If it does not balance, the diagram is wrong, and this is the
  one shape where a reader will actually notice.
- **Bands are cubic curves** — leave one node's right edge horizontally, arrive
  at the next node's left edge horizontally. Control points at about 40% of the
  horizontal gap. Straight diagonal bands look like a mistake.
- **Order the bands at each node to minimise crossings** — usually largest at
  the top. Crossings are unavoidable in a real Sankey; unnecessary ones are not.
- Nodes are thin vertical bars, 8–12 wide, spanning the total of their bands.
- **Label with name AND value**, outside the node: `Vented  12 %`. Without the
  number the reader is estimating widths by eye.
- **Fold everything under ~3% into "other"** — thinner than a line of text is
  thinner than a label, and an unlabelled band is a mystery.

## Colour

- Bands `var(--paper-2)` fill at partial weight with a `currentColor` hairline,
  so overlaps stay legible.
- **`var(--accent-ink)` on the one flow the page is about** — usually the loss
  you want people to care about.

## Tag it

**`dg-link` on every band** — it draws along its own path, so the diagram
animates as flow moving left to right, which is precisely what it depicts ·
`dg-node` on the node bars · `dg-label` on names and values.

## Anti-patterns

- Widths that do not sum. It destroys trust in the whole page.
- More than about nine bands. Aggregate.
- A Sankey where every band is the same size. Nothing is being shown.
