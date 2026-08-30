# Architecture

**Best for:** the boxes a system is made of and how they talk. The diagram a new
person is shown on their first day.

**Not for** deployment topology (that is `deployment`) or data movement (that is
`data-flow`). All three get drawn as "the architecture diagram" and end up as
one unreadable page trying to be three.

## Layout conventions

- **Tiers as horizontal bands**, top to bottom: what people touch, what does the
  work, what remembers things. Consistency across a book beats any particular
  order.
- Components 130–170 wide, 48–60 tall, `rx=6`, with **one line of what it does**
  underneath the name at 10–11px in `var(--ink-soft)`. A box with only a product
  name teaches nothing.
- **Connectors are orthogonal, and each is labelled with its PROTOCOL or
  payload** — `HTTPS`, `events`, `nightly CSV`. An unlabelled arrow between two
  services is the most common way this diagram fails to be useful.
- **Direction means initiation**, not data movement. Say so in the caption once;
  it removes an argument that happens at every whiteboard.
- **External systems as dashed boxes** outside a `nested` boundary, so the edge
  of your responsibility is visible.
- **9 components maximum on a page.** A real system has more; a page that shows
  them all shows nothing. Draw the sub-system on its own page.

## Colour

- `currentColor` strokes, `var(--paper-2)` fills.
- **`var(--accent-ink)` on the component or path the lesson is about.**
- Never colour-code by team or by language. Put it in the sub-label.

## Tag it

`dg-node` on components · `dg-link` on connectors and boundaries · `dg-label` on
names, sub-labels and protocol tags.

## Anti-patterns

- Vendor logos instead of responsibilities. The logo dates, the job does not.
- A box called "API". Which API, for what?
- Every box connected to every other. Draw the paths that carry meaning; a mesh
  is a statement that nothing is decoupled, and if that is true, SAY it.
