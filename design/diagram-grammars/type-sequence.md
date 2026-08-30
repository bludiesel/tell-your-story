# Sequence

**Best for:** messages between parties in order, where the ORDER and the WAIT
matter — a radio call-out, a permit request and its acknowledgement, an alarm
escalation. Anything you would describe as "then they tell them, and wait".

**Not for** a process without a back-and-forth. If nothing ever replies, it is
`:::steps`.

## Layout conventions

- **Participants across the top**, each with a vertical lifeline dropping from
  it. 3–5 participants; a sixth will not fit a book page.
- Participant boxes 110–150 wide, 36–44 tall, evenly spaced.
- **Lifelines are dashed** (`stroke-dasharray="3,4"`), `var(--ink-soft)`,
  0.8px — they are scaffolding, not content.
- Messages are horizontal arrows between lifelines, **top to bottom in time
  order**, 44–56px apart vertically.
- **Label every arrow**, 11–12px, sitting ON the line with a `var(--paper)`
  fill behind the text so the lifeline does not strike through it.
- A **reply** is a dashed arrow back. A **wait** is a gap — leave the vertical
  space rather than drawing a clock.
- An **activation bar** (a narrow rect on the lifeline) only where a party is
  genuinely busy for a while and that matters. Otherwise omit it.
- 6–10 messages. Past that the page is a transcript.

## Colour

- Lifelines and arrows `currentColor`; lifelines lightened with `var(--ink-soft)`.
- **`var(--accent-ink)` on the message that must not be missed** — the
  acknowledgement, or the one that starts the clock.

## Tag it

`dg-node` on participant boxes and activation bars · `dg-link` on every message
arrow and every lifeline · `dg-label` on all text.

## Anti-patterns

- Arrows that skip a lifeline. If A talks to C through B, draw both hops.
- Unlabelled arrows. "Something is sent" is not information.
- A sequence where every arrow goes the same way — that is a flow chart.
