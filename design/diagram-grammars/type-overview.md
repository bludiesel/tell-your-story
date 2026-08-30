# Overview (high level)

**Best for:** the whole of something on one page, at the coarsest useful grain —
the diagram that goes at the FRONT, before any detail, so a reader knows where
they are for the rest of the book.

**Not for** anything a reader must act on. This diagram is deliberately
imprecise; treating it as a specification is how the imprecision escapes into
the work.

## Layout conventions

- **Five to seven boxes. Full stop.** This is the one type where the constraint
  is the design. If it needs eight, the grain is too fine — merge two and give
  the pair a name.
- **Big boxes, generous air** — 160–200 wide, 60–72 tall, 40px between them. It
  should look uncrowded, because "there are only this many things" is the
  message.
- **One line under each name saying what it is FOR**, 11px, `var(--ink-soft)`.
  A one-word box on an overview page teaches nothing at all.
- **Connectors only where the relationship is essential.** An overview with
  every link drawn has become an architecture diagram with the details missing —
  the worst of both.
- **Left to right or clockwise** in the order the reader will meet them in the
  book, so the overview doubles as a table of contents.
- **No numbers, no protocols, no versions.** Anything that dates belongs on a
  detail page.

## Colour

- `currentColor` strokes, `var(--paper-2)` fills.
- **`var(--accent-ink)` on the part this book is actually about**, if it is
  about one part. That single mark orients the reader for fifty pages.

## Tag it

`dg-node` on the boxes · `dg-link` on the few connectors · `dg-label` on names
and their one-line descriptions.

## Anti-patterns

- Twelve boxes. It is no longer an overview, and the reader stops trusting the
  book's sense of what matters.
- Detail that will be wrong in six months. Overviews are the pages that get
  reprinted least.
- Skipping this diagram because "everyone knows the system". Everyone who has
  been here two years knows it.
