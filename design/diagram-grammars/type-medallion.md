# Medallion (refinement stages)

**Best for:** data that gets progressively cleaner — raw as it arrived, then
conformed, then ready to use. The bronze / silver / gold convention, and more
generally any pipeline where the SAME material is refined in stages.

**Not for** different datasets at each stage. The whole idea is one body of
material getting better; if the stages hold different things, draw a
`data-flow`.

## Layout conventions

- **Three columns, left to right**, one per stage, of equal width. Equal width
  matters: a wider "gold" column implies more data, when in fact there is
  usually far less.
- **Column header: the stage name AND its contract** — `bronze · exactly as it
  arrived, nothing dropped`. The contract is what makes the diagram governance
  rather than decoration.
- **Datasets as small boxes stacked inside the column**, 100–140 wide, 30–38
  tall, name at 11px.
- **Arrows only between the boxes that actually derive from one another**, left
  to right. Big column-to-column arrows say nothing about lineage.
- **A transformation label on each arrow** — `dedupe`, `join to asset register`,
  `aggregate daily`. That label is where the errors live.
- **Nothing ever flows right to left.** If something does, that is a finding: it
  means the refinement is not a refinement, and it should be drawn in
  `var(--accent-ink)` with a caption explaining it.
- 3–4 boxes per column.

## Colour

- `currentColor` strokes; boxes `var(--paper-2)`; column separators
  `var(--ink-soft)` hairlines.
- **Fill weight increasing left to right** — literally getting more solid as it
  gets more trustworthy.
- **`var(--accent-ink)` on the transformation the lesson is about.**

## Tag it

`dg-node` on dataset boxes, **column by column left to right** so the pipeline
fills in refinement order · `dg-link` on derivation arrows · `dg-label` on
names, contracts and transformations.

## Anti-patterns

- Gold and silver metaphors with no contract written down. Then the stages mean
  whatever each team assumed, which is the problem this diagram exists to fix.
- A fourth stage. Three is the convention because three is what people hold.
- Drawing tools instead of datasets. The tool changes; the contract should not.
