# Funnel

**Best for:** a staged reduction where the DROP is the finding — a pipeline, a
sign-off chain, how many of the people who started finished. The reader should
be able to point at the stage where most of them were lost.

**Not for** stages that do not narrow. If the number can go up between stages
it is not a funnel, it is a `process`, and drawing it as a funnel makes a claim
about loss that is not true.

## Layout conventions

- **Width is proportional to the value.** Equal steps with different labels is
  the commonest funnel and it is a decoration, not a chart — it shows the shape
  of a funnel regardless of the data.
- Stages stacked vertically, centred, each 44–56 tall with a 2–4px gap; the
  slope between two stages is the reduction made visible.
- **The drop-off between stages is the story, so annotate it** — a small figure
  in the gutter beside the taper: `×0.15`, or `−85%`. Pick one convention and
  hold it through the book.
- **Stage name and value inside if they fit**, otherwise to the right with a
  short leader. Never shrink the type to make it fit inside; a 9px label inside
  a stage is a label nobody reads.
- **4–6 stages.** Past six the last ones are slivers and their labels collide.
- If the final stage would be under about 2% of the first, the funnel is too
  steep to draw honestly at page size — say the numbers in words, or split the
  chart at a stated break and label it.

## Colour

- Stages `var(--paper-2)` with a `currentColor` stroke.
- **`var(--accent-ink)` on the stage with the worst drop**, not on the last
  stage. The last stage is where you ended up; the worst drop is where the
  problem is, and they are usually not the same.
- The tapers between stages stay unfilled, or take `var(--ink-soft)` — they are
  the gap, not a quantity.

## Tag it

`dg-bar` on each stage — they share a baseline only if you draw them
left-aligned, so **stack them centred and give the stages `data-grow="up"`**,
or tag them `dg-node` and let them arrive in order. `dg-link` on the tapers and
any leader lines · `dg-label` on names, values and the drop-off figures.

## Anti-patterns

- Equal-width stages. The most common funnel and the least honest one.
- A funnel drawn for four stages that never lose anybody.
- Percentages that are each of the ORIGINAL total in one place and of the
  PREVIOUS stage in another. Say which, once, and mean it everywhere.
