# Venn

**Best for:** overlap, when the OVERLAP is the point — what two roles share,
where two standards agree, the sweet spot between three constraints.

**Not for** three things that merely coexist. A Venn asserts intersection; if
the middle is empty, you have drawn a lie in a shape people trust.

## Layout conventions

- **Two or three circles. Never four.** Four circles cannot produce all their
  intersections — the standard four-set drawing uses ellipses, and by then the
  shape is doing the confusing rather than the explaining.
- Equal radii unless size means something, and if it does, say so in the
  caption.
- **Overlap of about a third of the radius.** Less and the intersection has no
  room for a word; more and the outer regions vanish.
- **Label every region that has content**, including the outer crescents. An
  unlabelled region reads as "nothing here", which is a claim.
- Circle names OUTSIDE the circles, near the outer edge, 13px. Region contents
  inside, 11–12px, centred in the region's visual centre — which for a crescent
  is not its bounding-box centre; nudge it outward.
- **The centre gets two or three words at most.** If it needs a sentence, the
  page needs a `quadrant` or prose.

## Colour

- Circles: `currentColor` stroke, **`fill="none"` or a very light
  `var(--paper-2)`** — real transparency tints stack unpredictably across
  themes and print, and this diagram must read in one colour.
- **`var(--accent-ink)` on the intersection that matters** — its label, or a
  stroked outline of that region, not a fill.

## Tag it

`dg-node` on every circle — they pop in one after another, and the overlap
appearing last is exactly the reveal you want · `dg-label` on names and region
contents.

## Anti-patterns

- An empty intersection drawn anyway. Move the circles apart or drop one.
- A Venn used for a process. Circles do not have a direction.
- Text straddling a boundary, so the reader cannot tell which region it is in.
