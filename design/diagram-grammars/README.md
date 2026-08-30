# Diagram grammars

**One short file per diagram type. Read only the one you are drawing.**

Thirty-nine shapes will not fit in a document anybody reads, and they do not
belong in code either — the geometry of a fishbone is a page of layout rules,
not an algorithm. So each type is a page of rules, and the assistant drawing the
diagram writes the SVG from it.

Adapted from [diagram-design](https://github.com/cathrynlavery/diagram-design)
(MIT, © 2025 Cathryn Lavery) — see [`CREDITS.md`](../../CREDITS.md) for what was
taken and what was not, and `LICENSE-diagram-design.txt` beside this file.

---

## How a diagram gets into a book

````markdown
:::diagram flowchart
<svg viewBox="0 0 720 320" role="img" aria-label="Isolation decision">
  …
</svg>
:::
````

The block's title is the TYPE. Write the SVG inside it and the build passes it
through untouched. `:::diagram flow`, `cycle` and `bars` still generate
themselves from a line of text — those three are common enough to be worth
never hand-drawing.

---

## The two rules that are not yours to break

Everything else on this page is advice. These two are enforced.

### 1. Colour comes from the theme. Always.

**The build refuses a diagram containing a hex, `rgb()` or `hsl()` value** and
names it. A literal looks right in the theme it was written against and is wrong
in every other, and a rebrand that silently misses one page is worse than a
build that stops.

| Use | For |
|---|---|
| `currentColor` | Anything that should read as ink. Inherits, so it is right in every theme by construction |
| `var(--ink)` | Body strokes and text |
| `var(--accent-ink)` | **The one or two things the reader should look at first.** Reserve it |
| `var(--paper)` · `var(--paper-2)` | Fills, so a shape sits ON the page rather than over it |
| `var(--ink-soft)` | Hairlines, dividers, anything supporting |

### 2. Tag the shapes, and the diagram animates itself

The runtime knows four class names and nothing about diagram types. Put them on
and a hand-drawn Sankey animates on the page turn exactly like a generated
flow chart — with no code anywhere that knows what a Sankey is.

| Class | What happens when the page turns |
|---|---|
| `dg-link` | **Draws itself** — the stroke runs along its own path. Put it on every line, edge, arrow and connector |
| `dg-node` | Pops in, staggered, with a slight overshoot. Boxes, circles, any shape that IS a thing |
| `dg-bar` | **Grows from its baseline** — a bar chart reads as measurement, so it measures |
| `dg-label` | Fades in last, staggered. Text |

Untagged shapes simply appear with the page. That is a valid choice for
background scaffolding — an axis does not need to make an entrance.

---

## Writing one

- **`viewBox`, never `width`/`height`.** The page scales; a fixed size does not.
- **Hug the artwork with it.** The SVG is stretched to the column, so empty
  space INSIDE the viewBox is empty space on the page — a drawing sitting in the
  middle of a `0 0 640 300` box when it only occupies `240..600` renders at 56%
  of the width it could have had, and reads as a thumbnail somebody forgot to
  enlarge. Set the viewBox to the artwork's own bounds.
- **`role="img"` and `aria-label`** saying what the diagram shows. A reader
  using a screen reader gets the label or gets nothing.
- **Target density 4/10.** Every node earns its place; the highest-quality move
  is usually deletion.
- **The accent is for one or two things.** If everything is emphasised, nothing
  is.
- **Text is `<text>`, not paths.** It has to be searchable, translatable and
  re-themable, and outlined type is none of those.

---

## The types

Read the one you need. Each is *best for / layout conventions / anti-patterns*.

| | |
|---|---|
| **Generated, no SVG needed** | `flow` · `cycle` · `bars` — write a line of text, the build draws it |
| **Sequence and process** | [`flowchart`](type-flowchart.md) · [`swimlane`](type-swimlane.md) · [`sequence`](type-sequence.md) · [`journey`](type-journey.md) · `process` · `state` |
| **Hierarchy and structure** | [`pyramid`](type-pyramid.md) · [`tree`](type-tree.md) · `org-chart` · `nested` · `layers` · `architecture` |
| **Comparison and position** | [`quadrant`](type-quadrant.md) · `radar` · `venn` · `matrix` |
| **Cause and effect** | [`fishbone`](type-fishbone.md) · `loop` · `dependency` |
| **Quantity** | `sankey` · `treemap` · `gantt` · `line` · `scatter` |

Types without a link are not written yet. Adding one is a file in this folder
and a row in this table — no code changes, because nothing in the build knows
what a diagram type is.
