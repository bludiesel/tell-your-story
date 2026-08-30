# State machine

**Best for:** a thing that is in exactly one condition at a time and moves
between them on events — a valve, a permit, a ticket, an alarm, a session.

**Not for** a sequence of activities. That is `flowchart` or `process`. The
test: can you point at the object right now and name which box it is in? If not,
it is not a state machine.

## Layout conventions

- **States are stadiums** (fully rounded ends), 120–160 wide, 40–48 tall. The
  shape distinguishes a state from a step at a glance, which matters because
  the two diagrams otherwise look identical.
- **A filled dot for the initial state**, 6px, with a short arrow into the first
  state. **A ringed dot for the final one.** These are borrowed from UML and
  readers recognise them.
- **Every transition is labelled with its EVENT**, not its outcome —
  `pressure drops`, not `now unsafe`. An unlabelled transition is the commonest
  and worst error in this diagram: it says the object changes state
  spontaneously.
- Guards in brackets after the event: `close [pressure < 2 bar]`.
- **Self-transitions** loop out of the top of the state and back, a small arc,
  labelled outside.
- 4–7 states. More belongs on a page per sub-machine.
- Lay them out in the order they are normally reached, left to right or round a
  loop — the happy path should be visible as a shape.

## Colour

- `currentColor` strokes, `var(--paper-2)` fills.
- **`var(--accent-ink)` on the state you must never be in**, or the transition
  that is the whole reason for the page.

## Tag it

`dg-node` on states and the initial/final dots · `dg-link` on transitions (they
draw along their arcs, which reads as the object moving) · `dg-label` on state
names, events and guards.

## Anti-patterns

- Two transitions on the same event out of one state with no guards. That is
  non-deterministic and it means the rule is not actually written down yet.
- A state nothing leaves that is not marked final. Say it is a trap state.
- Naming a state with a verb (`opening`). Unless the object really can sit in
  `opening` for a while, that is a transition wearing a state's clothes.
