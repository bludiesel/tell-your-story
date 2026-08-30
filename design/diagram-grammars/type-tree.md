# Tree

**Best for:** parent → children where every child has exactly one parent — a
document hierarchy, a fault tree, an organisation of topics, a decomposition.

**Not for** a network where things depend on several parents. That is
`dependency`, and drawing it as a tree means duplicating nodes, which hides the
shared dependency that was the interesting part.

## Layout conventions

- **Top-down, or left-to-right when the labels are long.** A book page is
  taller than wide, so top-down is the default and left-to-right is the escape
  hatch for wordy nodes.
- **Three levels maximum on one page.** A fourth needs a page of its own, or a
  `nested` diagram.
- Nodes 130–170 wide, 40–48 tall, `rx=6`.
- **Even sibling spacing**, 16–24px apart. Uneven gaps imply grouping that is
  not there.
- Connectors are orthogonal — down from the parent, along, then down to the
  child. **Never diagonal**: a diagonal in a tree reads as "sort of related".
- Parent centred over the span of its children, not over the first one.

## Colour

- Strokes `currentColor`, fills `var(--paper-2)`.
- **`var(--accent-ink)` on the branch being discussed.** A tree with every
  branch emphasised is a tree with none.
- Deeper levels may lighten toward `var(--ink-soft)` — depth as weight reads
  naturally and needs no legend.

## Tag it

`dg-node` on every box · `dg-link` on every connector · `dg-label` on text.

## Anti-patterns

- A node with one child. Merge them; the branch says nothing.
- More than five children on one parent — group them, or the row runs off the
  page and the eye cannot pair them with the parent.
- Crossing connectors. In a true tree they are never necessary; if you need one,
  what you have is a `dependency` graph.
