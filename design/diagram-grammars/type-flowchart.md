# Flowchart

**Best for:** a decision with branches. "Is the line dead? → yes / no", a
triage, a permit path, anything where the reader's next action depends on an
answer.

**Not for a straight sequence.** Four boxes and three arrows in a line is a
`:::steps` page — a flow chart of a procedure with no branches is harder to
follow than a numbered list, not easier, and it costs a whole page to say so.

## Layout conventions

- **Top to bottom.** Left-to-right only when the page is wider than tall, which
  in this book it is not.
- **Three shapes, no more.** A rounded rect is a step, a diamond is a decision,
  a stadium (fully rounded ends) is a start or an end. A fourth shape is a
  legend nobody read.
- Boxes 140–180 wide, 44–56 tall. Diamonds 120–150 across the points.
- **56–72px of clear air between rows.** Tighter and the arrowheads touch the
  boxes; looser and the eye loses the thread.
- **Label every branch out of a decision** — `yes` / `no` on the line itself,
  in the hand font at 11–13px, offset 8px from the path so it does not sit on
  it. An unlabelled branch is a coin toss.
- **The failure branch goes right, the continue branch goes down.** Consistency
  across a book matters more than which way round it is.
- **At most 9 nodes.** Past that, split it — a decision tree that does not fit
  on a page is not a diagram, it is a document.
- Arrowheads: one shared `<marker>`, `fill="currentColor"`.

## Colour

- Every stroke `currentColor` or `var(--ink)`.
- **`var(--accent-ink)` on ONE path** — the one the reader should take, or the
  one that ends badly. Not both.
- Fills `var(--paper-2)`, so a box sits on the paper rather than over it.

## Tag it

- Every `<path>` and `<line>` between nodes → `class="dg-link"` (they draw
  themselves).
- Every box and diamond → `class="dg-node"`.
- Every `<text>` → `class="dg-label"`.

## Anti-patterns

- A flow chart with no diamond. That is a sequence — use `:::steps`.
- Crossing lines. Reorder the nodes; a crossing costs the reader more than the
  reorder costs you.
- Text inside a diamond that runs to three lines. Shorten the question.
- Colour used to mean severity — a workbook may be printed in one colour and
  the meaning has to survive that. Say it in words.

## Example

```markdown
:::diagram flowchart
<svg viewBox="228 16 384 248" role="img" aria-label="Is the line dead?">
  <defs>
    <marker id="fa" viewBox="0 0 8 8" refX="7" refY="4"
            markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0 0 L8 4 L0 8 z" fill="currentColor"/>
    </marker>
  </defs>
  <g fill="none" stroke="currentColor" stroke-width="1.5" marker-end="url(#fa)">
    <path class="dg-link" d="M320 74 L320 108"/>
    <path class="dg-link" d="M320 172 L320 206"/>
    <path class="dg-link" stroke="var(--accent-ink)" d="M394 140 L520 140 L520 206"/>
  </g>
  <rect class="dg-node" x="240" y="30" width="160" height="44" rx="22"
        fill="var(--paper-2)" stroke="currentColor"/>
  <path class="dg-node" d="M320 108 L394 140 L320 172 L246 140 z"
        fill="var(--paper-2)" stroke="currentColor"/>
  <rect class="dg-node" x="240" y="206" width="160" height="44" rx="8"
        fill="var(--paper-2)" stroke="currentColor"/>
  <rect class="dg-node" x="440" y="206" width="160" height="44" rx="8"
        fill="var(--paper-2)" stroke="var(--accent-ink)"/>
  <g class="dg-label" text-anchor="middle" font-size="13" fill="currentColor">
    <text x="320" y="57">Gauge read</text>
    <text x="320" y="145">Fallen to zero?</text>
    <text x="320" y="233">Open it</text>
    <text x="520" y="233">Stop. Ask.</text>
    <text x="336" y="192" font-size="11">yes</text>
    <text x="452" y="132" font-size="11">no</text>
  </g>
</svg>
:::
```
