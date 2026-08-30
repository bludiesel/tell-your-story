# Database schema

**Best for:** the tables, their columns and their foreign keys — the physical
picture, for someone who will write a query against it.

**Not for** the conceptual model. That is `er`, which uses business words and
does not care whether something is a column or a join table. Showing an `er`
where a schema is needed frustrates the developer; the reverse frustrates
everyone else.

## Layout conventions

- **A table is a header strip plus rows.** Table name in the header at 12–13px;
  each column on its own row, 16–18 tall, `name` left-aligned, `type` right, at
  10px in the mono face and `var(--ink-soft)`.
- **Mark the key columns in the row itself** — `PK` / `FK` in a 9px tag, left of
  the name. Legends get skipped; inline tags do not.
- **List the key columns first**, then the ones the lesson mentions. **Elide the
  rest as `… 9 more`** — a table drawn with all 34 of its columns is a data
  dictionary, and it is unreadable at page size.
- **Relationship lines join the FK row to the PK row**, not box edge to box
  edge. That is the whole information content of the line.
- **Crow's foot at the many end**, a single tick at the one end, an open circle
  for optional. Three marks, all conventional.
- 4–6 tables. Beyond that, draw the subsystem.

## Colour

- `currentColor` strokes, header strip `var(--paper-2)`, rows `var(--paper)`.
- **`var(--accent-ink)` on the join the lesson turns on** — the one people get
  wrong, or the one that explains the duplicate rows.

## Tag it

`dg-node` on each table box · `dg-link` on relationship lines · `dg-label` on
table names, column names and types.

## Anti-patterns

- Every column of every table. Nobody reads it and it will be stale by Friday.
- Relationship lines with no cardinality marks. One-to-many versus many-to-many
  is usually the whole question.
- A join table drawn without saying it is one. Say `link table` in the header.
