# Nested (containment)

**Best for:** what is INSIDE what — a site inside a boundary, a service inside a
network inside a VPC, scope inside scope. Containment is a stronger and clearer
claim than an arrow, and readers understand it instantly.

**Not for** a hierarchy of ideas. That is a `tree`, and boxes-in-boxes runs out
of room after two levels.

## Layout conventions

- **Three levels maximum**, and two reads better.
- **The outer box's label goes in its TOP-LEFT corner, inset 12px**, 12–13px,
  not centred — the centre belongs to the children. Centre it and the reader
  cannot tell whether it names the container or something inside it.
- **Even padding all round**, 16–20px between a container's edge and its
  children. Uneven padding reads as significant when it is not.
- Nested boxes get progressively smaller corner radii — 8, 6, 4 — which
  subliminally signals depth.
- **Children of one container are laid out in a grid**, all the same size unless
  size means something.
- **A dashed border for a logical boundary** (a trust zone, a scope) and a solid
  one for a physical thing (a building, a device). Say which is which in the
  caption.
- A crossing that must leave a container gets a single connector through the
  boundary, tagged `dg-link` — draw at most two of these, or you have an
  `architecture` diagram.

## Colour

- All strokes `currentColor`; fills alternate `var(--paper)` and
  `var(--paper-2)` by depth, so each level sits on the one outside it.
- **`var(--accent-ink)` on the boundary that matters** — usually the one being
  crossed, or the one being defended.

## Tag it

`dg-node` on every box — **outermost first**, so the containers appear before
their contents and the diagram builds from the outside in · `dg-label` on the
names · `dg-link` on any boundary-crossing connector.

## Anti-patterns

- A box that touches its container's edge. It reads as a rendering error.
- Four levels. Split the innermost into its own diagram and reference it.
- Containment used to mean "related to". Nesting means "part of"; do not spend
  the reader's trust on a loose metaphor.
