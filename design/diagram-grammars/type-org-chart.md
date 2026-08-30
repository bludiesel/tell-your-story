# Org chart

**Best for:** reporting lines and, more usefully in a workbook, **who is
accountable for what**. On a safety or permit page, this is the diagram that
answers "who do I call".

**Not for** how work actually flows. It rarely does flow along these lines, and
drawing it as though it does is how a process gets designed for the chart
rather than for the job.

## Layout conventions

- **Top-down, orthogonal connectors** — down, across, down. Never diagonal.
- **Role, not name, on the first line.** Names change; the diagram should not
  need reprinting because somebody left. If a name is needed, second line,
  11px, `var(--ink-soft)`.
- Boxes 140–180 wide, 44–52 tall, `rx=4`. Same size at every level: a bigger box
  for the boss is a claim about importance the diagram does not need to make.
- **A dotted connector for a dotted line** — advisory rather than managerial.
  Say so in the caption; a dash pattern is not self-explanatory.
- **Three levels on a page.** Below that, name the team as one box and give it
  its own page if it matters.
- Assistants and staff roles hang off the SIDE of the connector, not below the
  box — that is the convention, and breaking it makes them look like reports.

## Colour

- `currentColor` strokes, `var(--paper-2)` fills.
- **`var(--accent-ink)` on the role the reader IS**, or the one they must
  contact. On a workbook page this is the single most useful mark on the sheet.

## Tag it

`dg-node` on every box · `dg-link` on every connector · `dg-label` on roles and
names.

## Anti-patterns

- A chart with a vacancy drawn as an empty box. Write "vacant" or leave it out;
  an empty box reads as a rendering bug.
- Fifteen boxes on one page. Nobody reads past the second row.
- Using it to show a process. Use `swimlane`, which is the org chart with time
  added and is what you actually meant.
