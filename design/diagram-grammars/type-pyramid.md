# Pyramid / Funnel

**Best for:** a hierarchy where the top is rarest or most important — a
hierarchy of controls, a priority stack, what matters most. Or inverted as a
funnel, where the narrow end is what survives.

**Pick one orientation and stay in it.** Point-up means "rarest at the top";
point-down means "fewest get through". Mixing them in one book confuses both.

## Layout conventions

- **4–6 layers.** Each is a `<polygon>` of four points — a trapezoid.
- **Consistent layer height**, 56–72. Uneven heights read as data even when
  they are not.
- Widths decrease linearly. **If the widths represent real numbers, they must be
  honest** — a funnel with equal steps and unequal counts is a lie drawn to
  scale.
- Each layer carries a name centred inside it, 13–15px. A sublabel, if any,
  goes underneath in 10–11px.
- Optional annotation outside the shape on one side — for a funnel, the drop-off
  (`−40%`).
- **Hairline dividers between layers**, not gaps. Gaps make it a stack of
  unrelated bars.

## Colour

- Fills `var(--paper-2)`, dividers `currentColor` at hairline weight. Graded
  tints are allowed but pick ONE approach and hold it.
- **`var(--accent-ink)` on exactly one layer** — the apex of a pyramid, the
  conversion layer of a funnel, or the bottleneck. **Never the base**: it
  dilutes the "top is rare" signal that the shape exists to make.

## Tag it

`dg-node` on every layer polygon · `dg-label` on names, sublabels and
annotations. There are usually no links.

## Anti-patterns

- Seven or more layers — compress or split.
- A pyramid for non-hierarchical data. Use a tree or a bar chart.
- Dishonest widths.
