# Wardley map

**Best for:** deciding whether to build, buy or outsource something, by showing
how mature each piece is. Two axes: how visible a component is to the user, and
how evolved it is — from a one-off idea to a utility you buy by the metre.

**Not for** anything else. It looks like a general-purpose positioning chart and
it is not: the axes have specific meanings, and using them loosely produces a
diagram that is confidently wrong.

## Layout conventions

- **Y axis = value chain**: the user at the very top, and each component placed
  by how directly the user depends on it. Label the top `visible to the user`
  and the bottom `invisible`.
- **X axis = evolution**, in four named bands, left to right:
  `genesis` · `custom-built` · `product` · `commodity`. **Name all four on the
  axis** — an unlabelled x-axis makes this diagram meaningless.
- **The user is a node at the top**, and every chain hangs from it. A component
  with no path up to a user is one nobody can justify — a genuine finding.
- Components are small circles, 6–7px, with the label beside them, 11px.
- **Movement is an arrow to the right** with a short note: `→ becoming a
  product`. That prediction is the point of the map.
- **No gridlines other than the four evolution bands**, `var(--ink-soft)`,
  hairline.
- 8–12 components.

## Colour

- Chain lines and nodes `currentColor`.
- **`var(--accent-ink)` on the component the decision is about**, and on its
  movement arrow.
- Never colour by team or by cost. The map is about position.

## Tag it

`dg-node` on components and the user · `dg-link` on chain lines, movement arrows
and the band dividers · `dg-label` on component names, axis labels and the four
band names.

## Anti-patterns

- Building something sitting in the commodity band. That is the map's main
  finding, so if you draw the map and then ignore it, do not draw the map.
- Position by gut feel with no note of why. Add one line per surprising
  placement.
- Using the shape as a generic 2×2. That is `quadrant`, and it is honest about
  being a judgement.
