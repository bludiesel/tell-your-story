# Deployment

**Best for:** what physically runs where — machines, containers, sites, networks.
The diagram you need at three in the morning when something is down.

**Not for** what the software is made of. That is `architecture`. The test:
would this diagram change if you moved everything to a different host, with no
code change? If yes, it is a deployment diagram.

## Layout conventions

- **Containment carries the meaning**, so this is `nested` with infrastructure
  words: region contains network, network contains host, host contains process.
- **Label each container with WHAT IT IS and WHERE**: `eu-west-1`,
  `plant DMZ`, `field tablet`. A box called "server" helps nobody.
- **Instance counts on the box**, not as repeated boxes: `api ×3` in the corner.
  Three identical boxes suggest three different things.
- **Every network boundary is drawn and named**, dashed for logical, solid for
  physical. This diagram exists to make boundaries visible; leaving one out is
  the failure mode with real consequences.
- **Connections labelled with port and protocol** — `:443 https`, `:502 modbus`.
- **Mark what is outside your control** — the ISP, the vendor cloud, the
  customer's LAN — in `var(--ink-soft)` with a dashed border. Half of every
  incident lives there.
- 3 nesting levels, 9 leaf boxes.

## Colour

- `currentColor` strokes; fills alternate `var(--paper)` / `var(--paper-2)` by
  depth.
- **`var(--accent-ink)` on the boundary or hop the page is about** — the one
  that fails, the one that needs the firewall rule.

## Tag it

`dg-node` on every host, container and process box, **outermost first** ·
`dg-link` on network connections and boundaries · `dg-label` on names, ports and
counts.

## Anti-patterns

- Cloud-provider icons as the only label. The icon says whose it is, not what it
  does or where it sits.
- Omitting the network boundaries because "they're obvious". They are not, and
  they are why this diagram is drawn.
- A single box called "the cloud" holding everything. Draw the parts that can
  fail independently.
