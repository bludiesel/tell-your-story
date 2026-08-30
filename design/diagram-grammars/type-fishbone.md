# Fishbone (Ishikawa)

**Best for:** root-cause analysis. One effect at the head, causes grouped by
category on the bones, sub-causes hanging off those. The classic incident
review shape.

**Not for** a cause with one chain. That is `flowchart` or a `:::steps` page —
a fishbone with two bones is a fishbone missing the point.

## Layout conventions

- **A horizontal spine** across the vertical centre, arrowhead at the right,
  1.2px, ending in the **effect box** — the thing that went wrong.
- **Bones at 60° to the spine**, alternating above and below, evenly spaced.
  This is the one diagram where diagonals are correct — the angle is the form.
- **4–6 bones.** The classic categories are People, Process, Equipment,
  Materials, Environment, Measurement — use the ones that apply and drop the
  rest rather than padding to six.
- **Category tag at the outer end of each bone**, in the hand font, 11–12px.
- **Sub-causes** are short horizontal ticks off the bone, 30–36 long, at even
  fractions of its length. Two or three per bone; a fourth crowds the neighbour.
- Sub-cause text sits beyond the tick, 10–11px, never on top of the bone.

## Colour

- Spine, bones and ticks `currentColor`.
- **Exactly one bone in `var(--accent-ink)`** — the cause the investigation
  actually confirmed. That is the entire finding, and a fishbone with nothing
  emphasised is a brainstorm somebody photographed.
- The effect box gets `var(--paper-2)` fill and a `currentColor` stroke.

## Tag it

`dg-link` on the spine, every bone and every tick (they draw outward from the
spine, which reads exactly like an investigation) · `dg-node` on the effect box ·
`dg-label` on the effect, the category tags and the sub-causes.

## Anti-patterns

- Every bone emphasised. Then nothing was concluded.
- A bone with no sub-causes — that is a category nobody investigated. Say so or
  drop it.
- Naming a person as a cause. If a human could make that mistake, the system
  allowed it; name the system.
