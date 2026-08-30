# Causal loop

**Best for:** feedback — where an effect comes back round and changes its own
cause. Why a backlog grows on its own, why cutting inspections raises costs,
why a fix made things worse.

**`:::diagram cycle` generates a simple ring** of stages from a line of text. Use
that for a cycle that just repeats. Use THIS when the arrows carry a polarity
and the loop reinforces or balances — that is a different and much stronger
claim.

**Not for** a process that repeats. Repetition is not feedback.

## Layout conventions

- **Variables, not actions.** Each node is something that can go up or down:
  `backlog size`, `time per job`. If it is a verb, this diagram cannot express
  it.
- **Every arrow carries a polarity**, a small `+` or `−` beside its head, 11px:
  `+` means they move together, `−` means one rises as the other falls. **An
  unpolarised arrow makes the diagram unreadable** — the polarity IS the content.
- **Name the loop in the middle**, with `R` for reinforcing (an odd number of
  `−` is balancing, an even number reinforcing) and a short phrase:
  `R · the backlog feeds itself`. Then a reader who does not know the notation
  still gets the finding.
- Arrows are curved, following the ring, all the same direction of travel.
- 3–5 variables per loop. **Two loops on a page at most**, sharing one variable
  — that shared variable is where an intervention goes.
- **Mark a delay** with two short cross-ticks on the arrow, labelled `delay`.
  Delays are why feedback surprises people and are worth drawing.

## Colour

- `currentColor` on nodes (text only — no boxes; boxes make variables look like
  steps) and arrows.
- **`var(--accent-ink)` on the arrow you can actually change.** A causal loop
  with no intervention marked is an explanation of helplessness.

## Tag it

`dg-link` on the curved arrows — **in loop order**, so the diagram draws itself
round the ring and the feedback is visible as motion · `dg-label` on variable
names, polarities and the loop name.

## Anti-patterns

- Boxes round the variables. They read as steps and the whole meaning changes.
- Arrows without `+` / `−`. Nothing can be concluded.
- Four interlocking loops. True, unreadable, and it will not change a decision.
