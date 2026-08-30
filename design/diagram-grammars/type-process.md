# Process

**Best for:** how work actually gets done, end to end, including the waiting.
Unlike a `flowchart`, this one carries WHO and HOW LONG — the two facts that
turn a diagram into an improvement.

**Not for** a decision. If the interesting part is a branch, use `flowchart`. If
the interesting part is which department drops the ball, use `swimlane`.

## Layout conventions

- **Left to right, one row**, wrapping to a second row only if it must — and
  when it wraps, the return should be visibly a return (down and back to the
  left margin), never a long diagonal.
- **Each step: a rounded rect with a VERB PHRASE** — `raise the permit`, not
  `permit`. 130–170 wide, 48–58 tall.
- **Owner underneath the box**, 10px, `var(--ink-soft)`: the role, not a name.
- **Duration in the gap between steps**, in the mono face at 10px, and mark the
  WAITS as well as the work: `2 min` on a step, `up to 2 days` on the arrow
  between two. In most real processes the waits are nearly all of the elapsed
  time, and a diagram that omits them is why the improvement effort goes to the
  wrong place.
- **A handover between owners gets a heavier arrow.** Handovers are where work
  gets lost, and the diagram should make them countable at a glance.
- 5–8 steps.

## Colour

- `currentColor` strokes, `var(--paper-2)` fills.
- **`var(--accent-ink)` on the longest wait**, not the longest task. That is
  almost always the finding, and almost never what people expect.

## Tag it

`dg-node` on step boxes · `dg-link` on arrows (they draw left to right, which
reads as the job progressing) · `dg-label` on step names, owners and durations.

## Anti-patterns

- No durations. Then it is an unbranched `flowchart` and a `:::steps` page would
  have been clearer and cheaper.
- The process as designed rather than as performed. Draw what people do; the
  gap between the two is the most valuable thing on the page.
- Twelve steps with no grouping. Name the phases and draw one phase per page.
