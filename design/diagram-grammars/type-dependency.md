# Dependency

**Best for:** what needs what — modules, services, tasks, or the prerequisites of
a job. Unlike a `tree`, a thing may have several parents, and that sharing is
usually the point.

**Not for** a sequence in time. That is `gantt` or `flowchart`. "A depends on B"
and "A happens after B" are different claims, and a diagram that blurs them
produces plans that cannot be executed.

## Layout conventions

- **Layer it.** Put everything with no dependencies at the bottom, then each
  layer above containing only things that depend on layers below. A dependency
  graph drawn without layering looks like a hairball and hides the very
  structure it exists to show.
- **Arrow points from dependent TO dependency** — "A → B" reads "A needs B".
  State it in the caption; the reverse convention is equally common and the
  reader cannot tell which you used.
- Nodes 120–160 wide, 40–46 tall, `rx=5`.
- **A cycle is the finding, not a drawing problem.** If A needs B needs A, draw
  the loop in `var(--accent-ink)` and say so in the caption — that is the most
  valuable thing this diagram ever produces.
- **Fan-in is the other finding.** A node that four others point at is the one
  that breaks everything; give it a heavier stroke.
- 8–10 nodes. Past that, collapse a subsystem to a single box.

## Colour

- `currentColor` strokes, `var(--paper-2)` fills.
- **`var(--accent-ink)` on the cycle, or on the critical shared dependency.**
- Do not colour by team; the reader wants structure, not org.

## Tag it

`dg-node` on every node, **bottom layer first** so the diagram builds on its own
foundations · `dg-link` on every edge · `dg-label` on names.

## Anti-patterns

- Undirected lines. Then it is not a dependency graph, it is a friendship chart.
- Duplicating a shared dependency to keep it tidy. The sharing IS the content.
- Optional dependencies drawn the same as required ones. Dash the optional, and
  say so.
