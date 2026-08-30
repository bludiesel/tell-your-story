# Polar

**Best for:** a quantity that varies with DIRECTION or with a cycle — wind rose,
noise by bearing, incidents by hour of day, load by month. The circle is not
decoration: it means the axis wraps around.

**Not for** categories with no cyclical order. A circle claims that after the
last comes the first again; if that is untrue, use a `bar` chart.

## Layout conventions

- **Sectors, not lines.** Each division is a wedge from the centre; its RADIUS
  is the value.
- **North / midnight / January at the top**, going clockwise. Every reader
  expects it and a different convention needs a label saying so.
- **Rings at even values**, `var(--ink-soft)`, with the outer one labelled.
  Radius must be proportional to the value, not to its square root — area
  distortion is exactly the trap this chart is famous for.
- **Bearing or hour labels outside the outer ring**, horizontal, 11px, at the
  cardinal points and every third division at most.
- 8, 12, 16 or 24 divisions. 24 for hours, 16 for a wind rose, 12 for months.
- A stacked polar (bands within each wedge, e.g. by wind speed) is legitimate,
  but 2–3 bands only.

## Colour

- Wedges `var(--paper-2)` fill, `currentColor` stroke.
- **`var(--accent-ink)` on the sector that matters** — the prevailing wind, the
  shift with the incidents.
- Bands within a wedge differ by fill weight, not hue.

## Tag it

`dg-bar` on every wedge — it grows from the centre, which reads as measurement
radiating out · `dg-link` on the rings · `dg-label` on bearings and the ring
value.

## Anti-patterns

- A polar chart of things with no cycle. The commonest misuse, and it is only
  ever chosen because it looks better than a bar chart.
- Uneven division widths. The wedge angle must be the interval.
- Reading the wedge AREA as the value. Radius is the value; area grows as its
  square. Keep the ratios modest or say the scale in words.
