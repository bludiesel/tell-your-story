# Security matrix

**Best for:** who may do what to which thing — roles against resources, with the
permitted actions in the cells. An access-control review, a permit authority
table, a RACI with teeth.

**Not for** how the control is enforced. That is `architecture` or `deployment`.
This diagram answers "who is allowed", and keeping it to that is what makes it
reviewable by the person who actually decides.

## Layout conventions

- **Rows are roles, columns are resources.** Roles down the left because there
  are usually fewer of them and the names are longer.
- **Cells contain letters, not colours** — `R` read, `W` write, `A` approve, `—`
  none. Letters survive photocopying, colour-blindness and one-colour printing,
  and this is a document people print.
- **Every cell is filled.** A blank cell is ambiguous: it might mean "no access"
  or "we never decided", and those are very different. Use `—` for none and `?`
  for undecided — **and a `?` on a shipped page is itself the finding.**
- Header row and header column in `var(--paper-2)` with a heavier rule beneath
  and beside them.
- Cells 44–64 wide, 28–34 tall; letters centred in the mono face at 12px.
- **A legend, once, under the table**, at 10px. Four letters, four expansions.
- 5–7 roles × 4–6 resources. Bigger belongs in a spreadsheet, and saying so is
  more honest than shrinking the type.

## Colour

- Grid `var(--ink-soft)` hairlines; the outer border and header rules
  `currentColor`.
- **`var(--accent-ink)` on the cell that is the point** — the surprising
  permission, the one being removed, the `?`.
- No red/green fills. The letters carry the meaning and the page may be
  monochrome.

## Tag it

`dg-node` on the cell rectangles if you draw them — **row by row**, which reads
as the table being filled in · `dg-link` on the grid rules · `dg-label` on
headers, cell letters and the legend.

## Anti-patterns

- Colour as the only encoding. It fails on a photocopy, which is where this page
  spends its life.
- A role called `admin` with `W` everywhere. True and useless; split the role or
  say what it actually needs.
- Leaving the undecided cells blank so the table looks finished. The whole value
  of drawing this is finding those.
