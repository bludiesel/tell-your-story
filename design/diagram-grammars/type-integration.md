# Integration

**Best for:** how two or more separately-owned systems are wired together — what
crosses, in which direction, by what mechanism, and how often. The diagram you
draw before signing up to an interface, and the one you want when it breaks.

**Not for** the internals of either system. Each side is one box here; drawing
inside them is the fastest way to make this diagram unusable.

## Layout conventions

- **One box per SYSTEM, left and right, with the owner underneath** — the team,
  or the company. Ownership is the reason integrations are hard and it belongs
  on the page.
- **Each interface is one horizontal connector between them**, and each carries
  four facts: **direction, mechanism, payload and cadence** —
  `→ REST · signed permits · on save` or `← nightly SFTP · asset register ·
  02:00`. **A connector missing any of the four is the one that causes the
  incident.**
- **Stack the interfaces vertically** in the gap, most important at the top,
  with room for the label above each line. Never bundle several into one arrow.
- **A middleware or queue in the middle** gets its own narrow box; if there is
  one, say who owns THAT too, because it is usually nobody.
- **Mark what happens when it fails** — a short note under the connector:
  `retries 3×, then alerts`, or `fails silently`. Writing "fails silently" on a
  page has fixed more integrations than any amount of design.
- 2–4 systems, 3–6 interfaces.

## Colour

- `currentColor` strokes, `var(--paper-2)` fills.
- **`var(--accent-ink)` on the interface the page is about**, or on the one with
  no failure handling.
- Third-party systems dashed and in `var(--ink-soft)`.

## Tag it

`dg-node` on system and middleware boxes · `dg-link` on interface connectors ·
`dg-label` on system names, owners and the four facts per interface.

## Anti-patterns

- One thick arrow labelled `integration`. That is the absence of a diagram.
- No cadence. Real-time and nightly are different products, not different
  settings.
- Omitting the failure behaviour because it is "an implementation detail". It is
  the behaviour the reader will actually experience.
