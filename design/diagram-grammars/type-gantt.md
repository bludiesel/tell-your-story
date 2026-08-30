# Gantt

**Best for:** work over time where the OVERLAPS and the dependencies matter — a
shutdown plan, a commissioning schedule, a training programme.

**Not for** a list of tasks with no dates. That is a checklist, and it is
`:::checklist`, which is a better page.

## Layout conventions

- **Rows are tasks, the x-axis is time.** Task names in a fixed-width column on
  the left, left-aligned, 12px; bars in the plot area to the right.
- **A time header along the top** — weeks, days, shifts. Vertical hairlines in
  `var(--ink-soft)` at each division, behind the bars.
- Bars 14–18 tall, `rx=3`, with **8–12px of vertical air between rows** so the
  eye can track a row across the page.
- **A "today" line**, if there is a today: a vertical rule in
  `var(--accent-ink)` with a small label at the top. On a printed workbook this
  is usually wrong within a week — only draw it if the book is for a date.
- **Dependencies are thin elbow connectors** from the end of one bar to the
  start of the next. Draw them only for the dependencies that CONSTRAIN the
  plan; drawing all of them produces a net.
- Milestones are diamonds on the row, 10px, not bars.
- **8–12 rows.** Past that, group into phases and give each phase its own page.

## Colour

- Bars `var(--paper-2)` with a `currentColor` stroke.
- **`var(--accent-ink)` on the critical path** — the bars where slipping costs a
  day of the whole job. If you do not know which those are, the chart is a
  drawing of hope and should say so.
- Do not colour by owner. Put the owner's initials in the bar.

## Tag it

**`dg-bar` on every task bar** — it grows from its start date, which reads as
time being consumed · `dg-node` on milestone diamonds · `dg-link` on dependency
connectors and the time gridlines · `dg-label` on task names, dates and the
today marker.

## Anti-patterns

- Bars that all start on day one. Then there is no schedule, only a wish.
- A dependency arrow that runs backwards in time. Fix the plan, not the drawing.
- Percent-complete shading on a printed page. It was true the day it printed.
