# Current and future state

**Best for:** a change, shown as before and after on one spread — the point of a
migration, a reorganisation, a process improvement. The reader compares, and the
comparison is the argument.

**Not for** a future with no present drawn beside it. A future-state diagram
alone is a wish; the value is entirely in the delta.

## Layout conventions

- **Two panels, side by side, IDENTICALLY laid out.** Same box sizes, same grid
  positions, same order. Anything that moves has moved because it changed —
  which means a cosmetic difference between the panels is a lie the reader
  cannot detect.
- **Panel headings**: `today` and `after`, in the hand font, above each panel.
  Dates rather than "future" if you have them.
- **Keep the unchanged parts unchanged and unemphasised**, in
  `var(--ink-soft)`. They are the frame that makes the change visible.
- **Three marks, and only three**: something added, something removed, something
  changed. Removed items stay in place in the right-hand panel, dashed and
  faded, so the reader sees the gap. Ghosting the removal is what turns two
  pictures into one story.
- **A short delta list under the pair** — three or four lines, each naming one
  change. Some readers take it from the list, some from the picture, and they
  should agree.
- 5–7 boxes per panel. Two panels means half the page each.

## Colour

- Unchanged: `var(--ink-soft)`.
- **Added and changed: `var(--accent-ink)`.** Removed: dashed `var(--ink-soft)`.
- That is three states and it is the maximum this diagram can carry.

## Tag it

`dg-node` on every box in both panels — **left panel first, then the right**, so
the reader sees today before tomorrow · `dg-link` on connectors · `dg-label` on
names, panel headings and the delta list.

## Anti-patterns

- Panels with different layouts. The reader spends the whole page working out
  what is actually different, which is the one thing the diagram owed them.
- A future state with no owner or date. That is a drawing of a meeting.
- More than about five changes. Split it into stages, each its own spread.
