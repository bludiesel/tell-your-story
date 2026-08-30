# Data flow

**Best for:** where information goes, in what form, and who touches it on the
way — an inspection record from tablet to report, personal data through a
system, a reading from sensor to alarm.

**Not for** control flow. This diagram answers "where does the data end up", not
"what happens next"; conflating the two is why so many of these are unreadable.

## Layout conventions

- **Four element types, and no fifth.** A rounded rect is a PROCESS (something
  transforms the data); a stadium or open-ended rectangle is a STORE; a square
  is an EXTERNAL entity (a person, another company); an arrow is the FLOW.
- **Every arrow is labelled with what it carries** — `signed permit`,
  `pressure reading`. An unlabelled arrow in a data-flow diagram is a blank
  space where the entire content should be.
- **Left to right in the direction of travel**, origin at the left, destination
  at the right.
- **Stores are drawn once**, even if several processes touch them. Duplicating a
  store to avoid a crossing hides the sharing that matters — often the point.
- **A dashed boundary** around what your system owns; anything crossing it is a
  place to think about privacy, retention and trust. Label the crossings.
- 7–9 elements. Split by level, not by squeezing.

## Colour

- `currentColor` strokes; processes `var(--paper-2)`, stores `var(--paper)`,
  externals unfilled.
- **`var(--accent-ink)` on the flow carrying the sensitive thing** — the
  personal data, the safety-critical reading. That is the flow the page exists
  for.

## Tag it

`dg-link` on every flow — they draw along their paths, and a data-flow diagram
animating is genuinely useful: the reader watches the data travel · `dg-node` on
processes, stores and externals · `dg-label` on names and flow contents.

## Anti-patterns

- A process with input and no output, or output and no input. One of them is
  missing and the reader will assume the diagram is wrong about everything else.
- Naming a process with a noun (`validation`). Use a verb phrase: `check
  against register`.
- Mixing in control arrows ("if rejected, go back"). Different diagram.
