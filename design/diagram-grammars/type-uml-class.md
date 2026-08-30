# Class diagram

**Best for:** the shape of a design in code — what the types are, what they hold,
what they can do, and how they relate. For a reader about to open the source.

**Not for** explaining a domain to a non-programmer. That is `er`, in their
words. A class diagram shown to a stakeholder is a way of ending a conversation.

## Layout conventions

- **Three compartments**: name, attributes, operations, separated by a full-width
  hairline. Name at 12–13px centred; the others 10px mono, left-aligned.
- **Elide ruthlessly.** Show the 2–4 members the lesson is about and put
  `… ` in place of the rest. A faithful class diagram is a header file that has
  been retyped by hand.
- **Visibility markers** `+` public `−` private `#` protected, before the name.
- **Four relationships, four notations, and no more:** inheritance is a hollow
  triangle at the parent; composition a filled diamond at the owner;
  aggregation a hollow diamond; plain association a line, with a role name and
  cardinality. **Draw only the relationship you mean** — the difference between
  composition and aggregation is a lifetime claim, so if you do not intend it,
  use a plain association.
- **Parents above children.** Inheritance arrows point up, always.
- Interfaces get `«interface»` above the name.
- 4–6 classes.

## Colour

- `currentColor` strokes, `var(--paper-2)` fill on the name compartment,
  `var(--paper)` on the others.
- **`var(--accent-ink)` on the relationship or member the lesson turns on.**

## Tag it

`dg-node` on class boxes, **parents before children** so the hierarchy grows
downward · `dg-link` on relationship lines · `dg-label` on names, members,
roles and cardinalities.

## Anti-patterns

- Getters and setters listed out. They are noise in every diagram ever drawn.
- A diamond used because it looks more precise. Composition means the part dies
  with the whole; if that is not true, it is wrong.
- A diagram that must be regenerated on every commit. If it needs to be exact,
  generate it from the source; a hand-drawn one should be about an IDEA.
