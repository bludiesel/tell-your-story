# Entity relationship

**Best for:** the THINGS a business deals in and how they relate — a job has
many inspections, an inspection covers one asset. Business words, no columns, no
types.

**Not for** the physical tables. That is `db-schema`. The distinction is worth
holding: an ER diagram can be read and corrected by the person who knows the
work, and that review is the entire value.

## Layout conventions

- **Entities are rectangles with the name only**, singular, in business
  language: `Permit`, not `permits_tbl`. 130–170 wide, 44–52 tall, `rx=4`.
- **A relationship is a labelled line, and the label is a VERB** —
  `covers`, `is signed by`. Read it aloud with the cardinalities and it should
  be a true English sentence. If it is not, the model is wrong.
- **Cardinality at both ends**: crow's foot for many, a tick for one, an open
  circle for optional. Both ends, always — half a cardinality is worse than
  none because it looks complete.
- **Read the diagram out loud both ways** before shipping it: "a permit covers
  one asset; an asset is covered by many permits". This catches more modelling
  errors than any review.
- **Attributes only when one is the lesson** — as a short line under the entity
  name, 10px, `var(--ink-soft)`. Otherwise leave them out entirely.
- 5–7 entities.

## Colour

- `currentColor` strokes, `var(--paper-2)` fills.
- **`var(--accent-ink)` on the relationship people get wrong** — usually a
  many-to-many somebody has been treating as one-to-one.

## Tag it

`dg-node` on entity boxes · `dg-link` on relationship lines · `dg-label` on
entity names and relationship verbs.

## Anti-patterns

- A relationship labelled `has`. It is true of everything and says nothing.
- Many-to-many drawn without comment. It always means a hidden third entity —
  name it, because it usually turns out to be the interesting one.
- Table names, plurals, or `_id` anywhere on the page. Wrong diagram.
