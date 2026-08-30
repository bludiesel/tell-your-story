# Layers

**Best for:** a stack where each band sits ON the one below and only talks to its
neighbours — a protocol stack, a tech stack, defence in depth, the strata of an
organisation.

**Not for** things that merely belong to the same set. A stack claims an order
and a dependency; if neither is true, use a list or a `nested` diagram.

## Layout conventions

- **Full-width bands, stacked with no gap** — or a 1px gap at most. Space
  between bands says they are separate systems, which is the opposite of what a
  stack means.
- **Bottom is the foundation.** Everything rests on it, and the reader knows
  that without being told.
- Bands 44–60 tall, `rx=4` on the top corners of the top band and the bottom
  corners of the bottom one only, so the stack reads as one object.
- **4–6 bands.** A seventh becomes a colour chart nobody can hold in their head.
- Label inside the band, left-aligned with 16px of inset, 13px. A short
  qualifier may sit right-aligned in the same band at 11px in `var(--ink-soft)`.
- **Side brackets** for a group of bands that form a tier — a thin line with
  serifs, outside the stack, with the tier name rotated or set beside it.

## Colour

- Stroke `currentColor` on every band; fill `var(--paper-2)`.
- **Depth by fill weight, not by hue** — a slightly stronger fill toward the
  bottom reads as foundation and survives monochrome printing.
- **`var(--accent-ink)` on the layer the lesson is about.** One band.

## Tag it

`dg-node` on every band — they pop in staggered, and because they are stacked
the stagger reads as building up · `dg-label` on the text · `dg-link` on the
tier brackets.

## Anti-patterns

- Arrows between adjacent bands. Adjacency IS the relationship; the arrows add
  nothing and imply a flow direction that is usually both ways.
- A band that is a vendor name rather than a responsibility. Name the job, put
  the product in the caption.
- Bands of different widths. That is a `pyramid`, and it makes a claim about
  size you probably did not intend.
