# Swimlane

**Best for:** a process where *who does it* matters as much as *what happens* —
a permit passing between operator, supervisor and controller, a handover, an
escalation. The lane is the answer to "whose job is this?"

**Not for** a process with one actor. That is `:::steps`; a swimlane with one
lane is a numbered list with a box drawn round it.

## Layout conventions

- **Lanes are horizontal rows, time runs left to right.** Vertical lanes read as
  columns of unrelated lists.
- **3–5 lanes.** Past five, the rows get too short to hold a label and the
  reader loses which lane they are in.
- Lane height 90–120. Lane label on the left in the hand font, 12–13px, rotated
  only if you genuinely cannot fit it horizontally — rotated text is read last.
- A hairline between lanes, `var(--ink-soft)` at 0.8px. **No lane fills.**
  Alternating stripes make the lanes look like data rather than actors.
- Steps are rounded rects, 130–170 wide, 40–48 tall, aligned on a shared
  vertical rhythm so a handover reads as a straight line down the page.
- **A handover crosses lanes vertically.** That crossing is the whole point of
  the diagram — never route it round the outside to keep the picture tidy.
- 5–9 steps total. More than that is two diagrams.

## Colour

- Lane rules and step strokes `currentColor`.
- Step fills `var(--paper-2)`.
- **`var(--accent-ink)` on the handover that goes wrong most often**, or on the
  one step nobody may skip. One, occasionally two.

## Tag it

`dg-node` on every step box · `dg-link` on every arrow, especially the
lane-crossing ones · `dg-label` on lane names and step text.

## Anti-patterns

- A lane with one box in it. Fold that actor into a neighbouring lane or admit
  they are not really part of the process.
- Arrows that avoid crossing lanes. The crossings ARE the content.
- Time running right to left because it fitted better.
