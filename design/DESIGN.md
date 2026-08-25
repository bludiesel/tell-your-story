# The Book — design specification

A presentation that behaves like a bound book. It opens on a closed stage curtain;
the first page floats alone in the dark; the volume assembles around it; from then
on it is paged with a clicker, one leaf at a time.

**Every page in this book is a placeholder for a shape of content, not an example
of it.** The words are there to be replaced. `content-slots.md` lists every string
and image slot in the book, by spread, for exactly that job.

Built on the **Tell Your Story** design system, which owns the physical object —
paper, binding, gutter shadow, boards, curtain cloth, fore-edge tabs. This document
owns the decisions that system leaves open. `theme.css` owns the values.

---

## How to read this

| If you are… | Start at |
|---|---|
| adding or editing a page | §9 the layout catalogue, then §10 the elements |
| changing the look | §2 the dials — and nowhere else |
| wiring this into a real app | §14 the handoff checklist, then §7a and §13 |
| debugging a turn | §7a — the two bugs that cost the most are written up there |

Class names in this document are the contract. Adding a page should be copying a
block and changing the words.

---

## 1. The files

Four, and one of them is this one.

| file | holds |
|---|---|
| `theme.css` | the dials, the pairings, the scales, the motion tokens. The only file that names a colour, a font or a duration. |
| `The Book.dc.html` | the book itself — curtain, stage, 16 leaves, and the runtime. |
| `design.md` | this document: the decisions and the reasons. |
| `content-slots.md` | every placeholder string and image slot, by spread. |
| `audit.js` | paste into the console: `bookAudit()` checks every invariant that broke at least once during the design |
| `content-slots.md` | every placeholder and image slot, generated FROM the book |
| `Palettes.dc.html` | review canvas: four complete palettes side by side. Predates the teal arc — it holds the warm candidates. Nothing ships from here. |

### The leaf model — read this before editing markup

The book is a **stack of leaves, not a list of spreads**. A leaf occupies the right
half of the block, hinges on the gutter, and carries a right-hand page on its
**front** and a left-hand page on its **back**. Turning it 180° sends its front to
the left stack and brings its back up as the new left page — which is what a sheet
of paper physically does, and why nothing is ever cloned, hidden or reordered.

A spread is therefore *derived*: the left page is the back of the last turned leaf,
the right page is the front of the next one.

Two consequences:

1. **You author leaves, not spreads.** Folio 2 and folio 3 are not siblings; 2 is
   the back of one leaf and 3 is the front of the next. To insert a spread you add
   a leaf, and the pages either side of it re-pair.
2. **Which face you see is set explicitly.** `backface-visibility` was not reliable
   here — the browser painted the rotated back face over the front and the reader
   got a mirrored page. The runtime toggles a `flipped` class at the turn's 90°
   point instead, which is also the moment a real sheet stops showing its recto.

**The stage is fixed at 1560 × 1040** — two 780 × 1040 pages — and scaled once by a
transform to fit the window. That is what lets every measurement in the book be
absolute.

**It renders once.** After mount, every visual change is a class or a custom
property written onto a node that already exists. A book mid-turn must never be
re-rendered: reconciliation fights the 3D transforms.

---

## 2. One place to change the look

`theme.css` sits after the design system's stylesheet and overrides its tokens. It
is the only file in the project that names a colour or a font.

**The rule:** no page, component or DC may write a colour or a font-family
literal. If a new thing needs a colour, add a dial. This is what makes a rebrand a
ten-line diff instead of a search-and-replace.

**The dials** — the void, the surfaces, the accent and its on-paper twin, the
supporting colour, the curtain cloth and rim, the paper stock, the ink, the three
sticky stocks, the three faces. Everything else derives: diagrams take the accent,
tabs alternate accent and surface, the band takes the surfaces.

**Scoping.** Dials are declared on `:root`; each alternative palette is declared on
`[data-pairing="…"]`. Put that attribute on any wrapper and everything inside
re-themes, because custom properties inherit. Shipping a pairing means moving its
block into `:root`.

### The palettes

**Teal is the shipped palette, in `:root`** — blue and teal as a single arc, not
two colours put next to each other:

| | hue | lightness | token |
|---|---|---|---|
| the void | 215° | 3% | `--deep` #03080E |
| the boards | 203° | 15% | `--surface` #0F2733 |
| the cloth | 190° | 22% | `--curtain-cloth` #0B3A42 |
| a lit pleat crest | 186° | 40% | `--curtain-cloth-lit` #1C6B72 |
| the braid and rim | 177° | 78% | `--curtain-rim` #79C3BD |
| the accent | 176° | 70% | `--accent` #35C0B6 |
| the paper | 180° | 97% | `--paper` #F2F7F6 |

Hue drifts one way only and chroma rises as things lighten, so any two colours in
the book are neighbours on that road. That is what makes the curtain, the boards
and the paper read as one room rather than three decisions. The mid **blue** (`--secondary` #3E7FB8, 207°) is the same road at mid lightness —
which is why the blue and the teal sit together instead of competing. **It does
real work in three places**, and a token that names a colour nothing paints is a
lie in the spec:

| where | what the blue does |
|---|---|
| the chart | alternating bars. A single-hue chart makes the accent do two jobs at once — "this is the identity colour" and "this bar differs from that one" — and it can only do one |
| the timeline | both rails. The rail is structure, not emphasis, so the blue carries it and the teal dots sit on top as the things to read |
| the comparison spread | the *before* tag against the teal *after*. The layout's argument is "same structure, one difference", so the difference has to be visible at a glance — a pair of neighbouring hues says "comparable" in a way one hue at two opacities cannot |

`--link-on-paper` (#2C6796, the blue darkened for AA on paper) is the documented
default for any link added later, and doubles as the *before* tag's colour.

Two consequences worth stating, because both were adjusted after looking:

- **The paper is cool.** A warm cream against teal cloth reads as two palettes. It
  is still the lightest thing in frame by a distance, so it is still the lit
  object.
- **The braid is a cool metal, not gold.** A warm metal on teal cloth is the one
  thing that would break the arc. And the sticky stocks are saturated well clear
  of the paper — against a cool stock a pale cool note disappears into the page and
  stops reading as something stuck on.

Seven alternatives are `[data-pairing]` sets, reachable from the **Look** tweak:

| pairing | cloth leads | reads as |
|---|---|---|
| `oxblood` | deep oxblood velvet, antique gold braid | a theatre, house lights down. The palette this book shipped with before the teal arc, kept whole so the decision is one word to reverse |
| `green` | bottle green, brass | a reading room rather than a theatre |
| `plum` | aubergine, antique brass | red's richness without its glare |
| `tobacco` | cloth, paper and boards from one warm family | archival — the room and the book are one object |
| `blue` | the curtain cloth becomes the brand | corporate, gold demoted to emphasis |
| `ink` | paper and ink, near monochrome | a printed book that happens to be on screen |
| `deep` | same hues, darker void, brighter rim | the paper is the only lit object in the room |

**Judge a cloth colour only alongside the paper, ink and sticky stocks it has to
live with.** On its own, any of the seven looks fine. `Palettes.dc.html` exists
because of this.

### The tweaks

Three props on the root DC, all read with a fallback so the runtime never depends
on the editor:

| prop | editor | does |
|---|---|---|
| `pairing` | enum, section *Look* | swaps the whole palette |
| `writeOn` | boolean | turns the write-on effect off — content then fades in |
| `writeSpeed` | range, ms/character | 34ms is the default; raise it for a slower hand |

---

## 3. Type

Three voices, and nothing else.

| role | face | token | treatment |
|---|---|---|---|
| Band heading | display | `--t-band` 3rem | uppercase, 700, line-height .92 |
| Page heading | display | `--t-h1` 3.2rem | uppercase, 700 |
| Sub-heading | display | `--t-h2` 2.4rem | uppercase |
| Minor heading | display | `--t-h3` 1.75rem | sentence case |
| Body | body serif | `--t-body` 1.55rem | line-height 1.55, max 62 characters |
| Statement | display | `--t-statement` 4.6rem | uppercase, one per page maximum |
| Hand-set | hand | `--t-hand` 2.1rem | see below |

**Sizes are absolute, not viewport-derived.** The design system shipped
`clamp(…vw…)` type, which meant the same page rendered at different proportions in
different windows and two pages in one spread could disagree. The stage is fixed
and scaled once, so `rem` stays honest and every page is typographically identical.
Body copy lands at ~25px on the stage, ~24px on a 1920 screen once fitted.

**The curtain is the single exception** — it hangs on the window rather than
standing inside the stage, so its type stays viewport-derived.

**One handwriting, everywhere.** The hand face is not decorative variety; it means
*a person wrote this, not the document*. It is used for exactly seven things: the
page eyebrow, the folio, block titles, the pull quote, sticky notes, the cover
subtitle, the curtain hint. Nothing else may use it, and none of those may use
anything else.

**Line length is capped at 62 characters.** A full-width page of prose on a 780px
page otherwise runs long and stops reading like a book.

---

## 4. Spacing

One 8px scale, `--sp-1` … `--sp-6`. Two rules do the real work:

1. **Every page has the same four margins** — `--pg-x`, `--pg-top`, `--pg-bottom`,
   absolute. No page sets its own padding.
2. **The gap owns vertical rhythm; nothing carries its own margin.** Page content
   is a flex column with a single `--sp-4` gap, and every direct child's block
   margins are zeroed with `!important`. Previously the space between two blocks
   depended on which two blocks they were — a callout then a sticky was 2.3rem,
   two callouts were 1.6rem, and no page agreed with any other.

Inside a block, paragraphs keep a tighter `--sp-2` rhythm. That is the only
exception.

**The `!important` has a consequence worth knowing:** anything that needs to reach
the paper's edge cannot be pulled there with a negative margin. Pin it absolutely
instead (see the bleed rules in §9).

---

## 5. The object

The design system's construction is not to be reinvented, only respected.

- Two boards, a page block with visible thickness either side of the spine, and
  that thickness **shifts as you read** — the left stack grows, the right thins
  (`--swl`, `--swr`), and the whole book leans with it (`--stack-bias`).
- The gutter is three layers: a shadow trough, the binding board glimpsed in the
  gap, light catching head and tail. Never a painted line.
- Each leaf darkens into the binding. No highlight crest — removed deliberately;
  the bend reads from the shadow alone.
- Two floor shadows: a tight contact shadow under the spine, a broad soft one for
  the volume. One blurred ellipse is what makes a 3D object look pasted on.
- **No idle animation on the open book.** It holds all the body text, and animating
  a transform on it re-rasterises every glyph continuously. Motion belongs on the
  closed cover and on turns.
- **Headbands at head and tail.** The woven band that covers the kettle stitch on
  a case-bound spine, two-tone because it is woven from two threads. It only
  exists on sewn hardbacks — which is why its absence reads as "not a real book"
  without the viewer being able to say why.
- **The gutter shadow follows the sheet, not the clock.** It used to switch on for
  the duration of a turn and off again, which is a light being flicked rather than
  a page being lifted. It now reads the same `--spec` bell the specular sweep
  uses: hardest at 90° where the sheet stands edge-on above the gutter, nothing at
  either end where it lies flat. Its width grows 190 → 340px with it. **No
  transition on it** — the bell is the easing, and a transition on top of a
  per-frame value lags it (measured: opacity reached only 0.75 of peak and then
  hung on after the paper had landed).
- **A turning sheet shades the pages beneath it, and that shadow sweeps.**
  `.gutter-well` darkens the gutter — the shadow a lifted sheet throws back into
  its own hinge — but a raised page also shades the page *under* it, and the
  shaded band moves: flat on the right it is coincident with the page and casts
  nothing; lifting, it shades the right page and the band pulls **in** toward the
  gutter as the sheet stands up; edge-on at 90° it covers no horizontal area;
  descending, the band sweeps back **out** across the new left page; flat again,
  nothing. So extent runs (1−2k) on the outgoing side and (2k−1) on the receiving
  one, anchored at the gutter, while opacity follows the same 90°-peaked bell as
  the specular — which is what makes it vanish cleanly at both ends instead of
  leaving a smear. Measured through one turn: right 0.94 → 0.10, swap at peak
  opacity 0.85, left 0.01 → 0.96 as opacity falls to 0.05.
- **The binding is always in front of a leaf's inner edge.** A turning leaf used to
  sweep across the gutter, and at 90° a leaf is edge-on and infinitely thin — so
  for a frame or two you saw through the spine to the boards behind it. Leaves are
  sewn *inside* the binding: `.spine-cap` sits above every leaf (z 50) and the leaf
  tucks into it; `.gutter-well` deepens the gutter shadow while a leaf is lifted.
- **Nothing inside the book can paint above the chrome.** The chrome is a fixed
  z-20 bar; the stage is a transformed element, so its entire subtree is confined
  below z-20 whatever z-index a child is given. Any affordance near the bottom edge
  hits this wall. The bar is transparent to the pointer with only its controls
  taking clicks, so it does not swallow the book.

---

## 6. The curtain

Two pleated panels on a flat pelmet, parting down the centre.

**The copy is woven in.** The title lives *inside* the left panel and the
standfirst inside the right, so both travel with the fabric instead of being an
overlay that fades while the cloth leaves. The pleat gradient is then repeated **on
top** of the type at 62% multiply, so the light and shade of the folds crosses the
letterforms. That is what makes the words read as part of the cloth rather than
printed on glass in front of it. Nothing crosses the centre: that is where the
cloth parts.

**The pleats are not corrugated iron.** One repeating gradient at a fixed 52px
period is a machined surface, and the eye reads it as metal. Two things break it:
a second period at **83px** — deliberately not a multiple of 52, so the two
interfere and no two pleats along the panel are quite alike — and a horizontal
squeeze on the pleat layer alone, so the folds **crowd toward the leading edge**
the way cloth gathers where it is drawn back, and open out toward the wall.

**Three things separate hung velvet from a coloured rectangle**, all in `.nap`:

- **Nap.** Velvet has a directional pile, so a broad soft sheen sits across it at
  the height the light strikes. It is the most recognisable property of the
  material and the cheapest to fake.
- **The hem pools.** Cloth is heavy: it darkens into the floor, and the leading
  edge is a hem folded back on itself, so it sits a shade darker than the face of
  the cloth just before the rim light picks it out.
- **The pelmet casts down.** The cloth immediately beneath it is in its shadow.
  Without that, the valance looks stuck on rather than in front.

**The braid** is one fine line on each pleat crest, on the same 52px period as the
weave, so the lines belong to the cloth's structure instead of sitting on it.
Screen-blended, because the metal has to gain light on dark cloth — multiplied, it
just goes muddy.

**It does not draw all the way off.** The panels stop at 60%, leaving about 15% of
the window in cloth each side. An open curtain that leaves a sliver reads as no
curtain at all; the cloth should still frame the book. It sits behind the stage, so
it frames without covering.

**A swag valance was tried and dropped.** Swags, beaded fringe, cascades, jabots
and a low tieback are fabric rendered as geometry; CSS gradients and clip-paths
reach "decorative" and stop well short of "convincing". A plain, well-lit cloth
beats an unconvincing elaborate one. If the elaborate version matters it belongs in
`curtains.js` with the shader work, where the cloth is real geometry with real
lighting — and where the woven-in copy would be rasterised into the cloth texture
and done properly, per fold, per frame.

---

## 7. Motion

Theatrical: the opening is a show, the reading is not. All timings are tokens in
`theme.css`, and all of them collapse to ~0 under `prefers-reduced-motion`.

| phase | token | what happens |
|---|---|---|
| **House lights** | `--t-curtain` × 1.3 | The room does not hold one brightness through the reveal. A soft rim-coloured spill rises behind the book as the cloth leaves — a closed stage is lit by the curtain, an open one by what is on it. Holding the light constant is the tell that this is two divs and not a space. |
| **Curtain** | `--t-curtain` 2200ms | Keyframed, not a transition: the cloth takes up its slack, gathers, then goes, skewing under its own weight and closing its pleats as it stacks at the edge. The rim light on the leading edge is the last thing to leave. **The hem drags:** only the top of a curtain is on the track, so the loose hem lags behind it — a skewX peaking mid-draw where the panel moves fastest, all but settled by the time it stops, reversing with the direction of travel on close. Without it the panel translates as one rigid rectangle, which is the difference between cloth on a track and a painted flat on castors. Closing runs its own keyframe at 0.8× — cloth falling shut arrives faster than it drew, then settles — so the cycle runs open, closed, open again. |
| **Float** | `--t-float` 900ms | The first page appears alone in the void, lifted and tilted, for a beat under a second: long enough to register as paper, short enough not to stall. |
| **Open** | `--t-open` 1100ms | The volume assembles around that page — boards swing out, the block gains thickness, the floor shadow spreads. A transition on `.book-3d`, not a keyframe: every state has to carry the fit scale, and an animation ending at `transform: none` drops it and slams the book to its full 1560px. |
| **Flip** | `--t-flip` 720ms | One leaf turns. Hard stock swings rigid, soft stock bends (§7b). The static gutter curvature dims to 32% so the fold shadow does not double. Faces swap at 90°, which this easing reaches at **33.2%** of the duration (§7a). |
| **Riffle** | `--t-riffle-page` 150ms | Leaves flick past in sequence, `Home` to the start. Turn duration is 1.7× the page interval, so riffled leaves overlap in the air. |
| **Reveal** | `--t-reveal` 520ms, `--t-reveal-stagger` 140ms | Content arrives per element, in order, on the clicker. |
| **Write-on** | `writeSpeed` 34ms/char | Type is laid down rather than faded in. |

### 7a. Two bugs worth keeping written down

**The faces swap at 90°, and 90° is not half the duration.** Getting this instant
wrong is the most visible defect the book can have, and it was wrong twice:

- *Half the duration* is only correct for a linear turn. `cubic-bezier(.34,.06,.24,1)`
  is slow off the mark and fast into the finish, so it passes 90° at **33.2%** —
  239ms of 720. Swapping at 360ms meant the sheet had rotated **140°** with the
  outgoing page still painted on it: the reader sees the page they just left,
  mirrored, for about 120ms.
- *Polling the live transform matrix* is right in principle — `m11` is
  `cos(rotateY)` and changes sign exactly at 90° — but it depends on getting
  frames. Callbacks arrived tens of frames apart in the preview, and a late
  detection looks identical to the bug it was meant to fix.

**Solve it instead.** One bisection at mount finds the parametric point where the
timing function reaches 0.5 and reads its input: the fraction of the duration at
which 90° happens. It re-derives from the computed timing function, so changing the
easing token moves the swap point with it.

**Ride the transition, not the clock.** A CSS transition does not start when you
set the class — it starts at the next style flush, measured at 130–140ms of latency
here. Every timer counted from the *click* therefore ran ahead of the paper, and
the completion handler is destructive: it drops `moving` (so a still-turning leaf
re-sorts its z-index against its neighbours), snaps off the curl and crease
mid-rotation, clears the transition duration under a running transition, and starts
revealing the next page while the previous leaf is visibly still in the air.
Measured: the handler fired at transition currentTime 583 of 720 — 137ms early.

The `Animation` object is the sheet's own clock: `ready` resolves when the
transition actually starts, `finished` when it actually ends. Plain timers remain
as a fallback for when there is no animation to ride — reduced motion, or a
duration the engine optimises away. The riffle rides the same way, against the
riffle duration rather than the page interval; at that speed the start latency is
most of a page, so a timer off the click swapped faces a whole page out of step.

### 7b. Soft stock and hard stock — and where the limit is

**Hard stock** — covers and section boards. Rigid: it swings flat about the spine
and holds its shape. This is already correct, and it is correct *because* CSS
transforms are rigid.

**Soft stock** — every ordinary page. Paper lifts at its free edge, takes a crease
running back toward the gutter, foreshortens as it turns, and casts a shadow on the
page beneath. `--curl` is driven 0 → 1 → 0 across the turn on a half sine (paper
bends most halfway and lies flat at either end) and read by CSS as a skew, a
foreshorten, and a travelling crease shadow: dark where the sheet is held at the
gutter, light along the lifted edge.

**That is an approximation, and it is as far as this environment goes.** A real
bend is a geometry problem: the sheet solved as a developable surface — a cylinder
tangent to the fold line — every frame, the visible part clipped to a curve rather
than a rectangle, and its shadow projected onto the leaf underneath. That needs
per-frame geometry and a canvas or WebGL surface. A CSS transform can rotate and
skew a flat rectangle; it cannot bend one.

**So the real bend belongs on a flip engine** — `page-flip` / `StPageFlip`, whose
stylesheet this design system already ships (`.stf__item`, `.stf__outerShadow`,
`.stf__innerShadow`, `.stf__hardShadow`), or a WebGL implementation. When it goes
in:

- Keep `pl` / `pr` baked into the markup. The engine reorders the DOM mid-turn, so
  any `:nth-child` styling will jump sides halfway through a flip.
- Keep the soft/hard distinction — the engine draws them with different routines
  (`drawSoft` clips to the bend polygon; `drawHard` does not, which is what lets a
  board carry its index tab past the fore-edge).
- Let the engine's moving shadows do the fold; the static gutter curvature already
  dims during a turn so the two do not double.
- Everything else in this document survives unchanged: the leaf model here is the
  model the engine uses, so pages, reveals, riffle and chrome all port over.

### The end

The book opened with ceremony and used to simply run out: the last spread was the
last spread, and the only way out was Esc, which cut. **A book you have finished
gets closed.** Forward past the final reveal starts three beats, in the order a
person does them in:

1. the block riffles shut back to the first leaf;
2. the front board comes over — its own beat at `--t-open`, deliberately outside
   the riffle's range so it reads as closing the cover rather than as the tail of
   a riffle;
3. the cloth comes back in, and the book resets to spread 1.

`Escape` still cuts straight to the curtain. A presenter who needs out **now**
must not sit through the ceremony — the ceremony is for the ending you meant, not
the one you needed.

---

## 8. The reveal model

A page is a sequence of steps, not a slab that appears. Each press of the clicker
advances one step; the next press past the last step turns the page.

**Order is fixed:** band heading → body → supporting blocks in document order →
diagram → sticky → takeaway. The takeaway always lands last. A page has at most
**five** steps; more than that and the presenter is clicking, not talking.

**The first step lands on arrival.** A page that lands completely blank reads as a
loading failure, so step one is automatic and the rest are the presenter's.

**Write-on is a mask retreating across the type**, not per-character DOM — one
compositor layer regardless of length.

**It applies to what a click reveals, never to a title.** A page's heading and
eyebrow are part of the page, present the instant the paper lands: a printed page
does not acquire its own title while you look at it.

**Handwritten elements are drawn, not typed** — the same mask, revealed along the
baseline, so a hand-set line appears the way a hand lays it down.

**A sticky note is stuck, not faded in.** It arrives from above at the wrong angle,
lands, and gets pressed — a 2.3% squash at 68% of the animation is a thumb going
down on the middle of it — while its shadow tightens from a wide soft cast to a
close one. A pair goes up 190ms apart. 720ms, and it is the only element in the
book that overshoots.

**A press during a turn is not a press into the void.** A presenter mashing → or
End through a turn was losing every press that landed while the paper moved —
usually the one that would have revealed the page they were already talking to. The
last intent is held and run when the turn settles; only the last, because catching
up on four queued presses would fly past the page. A held press *is* the arriving
page's first beat, so the automatic one is suppressed — otherwise one click reveals
two things.

**The presenter can always skip.** Holding `→` or pressing `End` completes every
remaining step immediately. Nobody should be trapped watching their own animation.

### Keyboard and controls

| key | does |
|---|---|
| `→` `Space` `PgDn` | next step, turn the page, or — past the last reveal — close the book |
| `←` `PgUp` | back a page |
| `End` | finish this page's reveals |
| `Home` | riffle back to the first spread |
| `n` | presenter notes on/off (off by default) |
| `Esc` | close the book and lower the curtain, without the ceremony |
| `b` or `.` | black the room out; any key restores |
| fore-edge tab | riffle to that section's board |
| chrome | back · spread count · next · riffle · close |

---

## 9. The layout catalogue

**Seventeen layouts. A page picks one and fills it in.** Layouts are never combined
on one page, and the reveal behaviour belongs to the layout, not to the page using
it. An eighteenth layout is a design decision, not an authoring one.

| layout | class on `.page` | holds | how it arrives |
|---|---|---|---|
| Cover | `cover cr` / `cover cl` | title, subtitle, footer; inside boards are blank | present; the cover is the closed book |
| Contents | `contents` | rows of number, title, dot leader, folio | rows cascade 70ms apart |
| Section board | `divider` | ghosted number, kicker, title, rule, index tab | present on landing, hard stock |
| Chapter opener | `opener` | drop cap four lines deep, small-caps first line | written on, cap first |
| Prose | *(default)* | two or three paragraphs | paragraph by paragraph, written on |
| Notes and asides | `has-sticky` | a callout or paragraph with a note stuck to it | block, then the note pressed on |
| Marginalia | `marginalia` | narrow text column, hand notes in the **outer** margin | text, then notes |
| Half bleed | `half-bleed` | picture off the fore-edge, text in the inner column | picture, then copy |
| Full bleed spread | `full-bleed` | two slots holding the halves of one photograph | picture present on landing, caption draws on |
| Table | `ptable` | three horizontal rules, tabular figures | rules, then rows |
| Chart | `barchart` | horizontal bars: label, bar, value | bars grow in order, 90ms apart |
| Timeline | `timeline` | one rail across the gutter, two stops a page | rail draws outward from the gutter, then stops |
| Before / after | `compare` / `compare after` | same structure both pages, one marked | left page, then right |
| Statement | `statement` | one line, centred, largest type in the book | one beat |
| Full-page quote | `quote-page` | one sentence in the hand, attribution | drawn along the baseline |
| Takeaway | `takeaway` | the one thing to remember | lands last on its page |
| Colophon | `colophon` | small centred type, narrow measure | one block |

**Every layout is in the book already**, so the book is its own reference sheet.
Spread numbers, with `L` and `R` for the page within the spread — `content-slots.md`
lists what is on each:

| layout | appears on |
|---|---|
| Cover | 1L, 16L |
| Contents | 1R |
| Section board | 2L, 2R, 4L, 4R, 6L, 6R, 8L, 8R, 10L, 10R, 12L, 12R |
| Chapter opener | 3R |
| Prose | 5L, 5R |
| Notes and asides | 5R |
| Marginalia | 7L |
| Half bleed | 7R |
| Full bleed spread | 9L, 9R |
| Table | 11L |
| Chart | 11R |
| Timeline | 13L, 13R |
| Before / after | 14L, 14R |
| Statement | 15L |
| Full-page quote | 3L |
| Takeaway | 5R |
| Colophon | 15R |

### Rules that hold across all of them

- **Nothing bleeds at the gutter.** Paper is bound at the spine; an image bleeding
  into the fold would be swallowed by it. Bleeds go off the fore-edge, the head and
  the tail — never the inner edge.
- **A full-bleed spread is two slots, not one.** A single element cannot span two
  leaves; the halves are on different sheets of paper.
- **Neither half of a bleed is a step.** A picture crossing the gutter arriving one
  half at a time reads as broken rather than as pacing. The picture is there when
  the spread lands; the caption is the spread's one reveal.
- **A bleed is pinned, not pulled** — absolute to the page, transform none, fade
  only. Negative margins lose to the page-rhythm `!important`, and a reveal
  transform on a pinned element puts it back off the edge.
- **A band runs across the spread.** The heading prints once, on the verso, but the
  bar continues onto the recto as `band band-cont` — same height, no words. A
  printed bar that stops dead at the gutter is not how a spread is printed, and
  without it the facing page's content starts 12% higher, so anything crossing the
  fold lands out of true. **Any spread-crossing layout whose recto has no heading
  of its own needs it.**
- **Tables use rules, not boxes.** Three horizontal rules in the whole table —
  above the head, under the head, under the last row — and nothing vertical.
  Figures tabular and right-aligned.
- **Marginalia never goes in the gutter margin.** Nobody can write in a fold.
- **A board is hard stock**, carries no argument, and is punctuation. Two adjacent
  statement pages is the same rhythm failure.
- **Front faces are `pr`, back faces are `pl`** — always, with `cr` / `cl` on the
  covers. The side class carries the gutter shadow direction, the asymmetric
  margins and the folio's corner, so a page wearing the wrong one is subtly
  mirrored against its own spread. Worth a pass whenever leaves are added or
  reordered.

Two layouts from the first draft — a standalone diagram page and a two-column page
— are still in `theme.css` and still valid. The book does not use them now that the
half-bleed and the comparison spread cover the same jobs better.

---

## 10. The elements

### Sticky notes

The complaint that started this work: stickies were arriving in assorted shapes,
sizes and hands. The fix is a set, not a family.

- **A sticky is stuck ONTO something.** It belongs to a paragraph or a block —
  positioned against it, overlapping its edge, hanging into the page margin. It
  never gets a page, a column slot or a centred position of its own: that reads as
  a designed panel, which is the opposite of a note. `has-sticky` on the host
  block, `data-at="right|left|br|bl"` on the note.
- **One shape** — 15.5rem × 9.5rem attached, 19rem × 12rem standalone. Not
  variable, not content-sized.
- **Three stocks** (`--sticky-1/2/3`) and **three tilts** — −1.6°, +1.4°, −0.7°
  standalone; attached notes go steeper, ±5.5° to ±7.5° by corner. A note pressed
  on by hand is never square.
- Rotation is **deterministic** (`nth-of-type`), never random: a re-render during a
  presentation would visibly reshuffle the notes.
- **One hand**, one size, title and body alike.
- **Maximum two per page**, side by side in `.sticky-pair`, never stacked. Three is
  a page that should have been a callout list.
- **Never on a board or a cover.** A sticky is stuck to *paper*.
- A sticky is something a person added afterwards; a `Note` is typeset into the
  document. If the words would survive reprinting, it is a Note.

### Typeset asides

`callout callout-note` · `callout-tip` · `callout-warn`. Part of the document,
hand-set title, typeset body. These are what a sticky is not.

### Fore-edge section markers

Six tabs, one per section board, each riffling to that board. They pop out 9px
under the pointer, and a section you have passed hops to the **left** edge — so the
fore-edge itself shows how far through the book you are, with no progress bar. A
board also carries its own glued tab, which travels round the turn with it; the
glued tab is hidden on every leaf but the one you are standing on, or six of them
stack against the rail at once. The rail hides during a turn.

### Folios

**A folio on every printed page** — never on a cover, board or colophon. The
colophon carries none by convention: it is the record of how the book was made, not
part of its argument.

**Renumber in one pass over every `.pageno`, never one at a time.** Hand-editing a
single folio is what produced two 2s, two 3s and a gap from 4 to 7. Front matter
takes roman, the first prose page starts at 2, and each printed page takes the next
number in physical order (leaf front, then leaf back) — which makes facing pages
consecutive for free. The brand mark prints on the outer corner, away from the
spine.

### Image slots

Four, each a drop target that survives reload: `curtain-art` (cover art on the
curtain's right panel), `book-halfbleed`, `book-bleed-l` and `book-bleed-r` (the
two halves of one photograph). **I cannot generate images** — these need real
material.

### Presenter view

Notes live in `data-notes` **on each page**, so a note travels with its page
through any reorder — the same reason a deck keeps notes on the slide rather than
in a side table. Both visible pages contribute, de-duplicated: a spread whose two
halves are one layout (a full bleed, a comparison) carries the same note twice,
and printing it twice is how a presenter learns to stop reading the panel.

Toggled with **N**, and **off by default** — a presenter who forgets to hide it
has put their notes on the projector, so it can never be the default state. The
panel is fixed and outside the stage, because anything inside the book is confined
below the chrome's stacking context.

**The "next" line names the leaf AFTER the one on screen.** At `turned = N` the
visible spread is `leaves[N-1].back + leaves[N].front`, so `leaves[N]` is the leaf
whose front you are *looking at* — reading it named the page the presenter was
already standing on, which is the one thing that line exists not to do. It is
`leaves[N + 1]`, and the last spread has no right-hand leaf at all, so the
end-of-book guard has to fire a spread earlier than the index suggests — which is
also when a presenter wants to know the ending is coming.

**Notes are keyed on `data-layout`, never on `class`.** The first generator
matched class names — and a page's class is only `page pl stf__item`, so every
layout whose name was not literally in the class fell through to a generic line.
Fifteen of thirty-three did, silently, and the two that *did* match matched the
wrong thing: `/cover/` caught the inside boards before any other test, so the
final spread of the book told the presenter to introduce themselves.

`cover-inside` is the one layout that legitimately carries two different notes.
The board inside the front cover and the board inside the back cover are the same
layout and opposite moments — one is the pause before the contents, the other is
where you thank the room and close the book.

Notes say *what to say*, never what is already printed on the page. That
distinction is the whole value of the panel, and the one thing to hold to when the
placeholder notes are replaced with real ones.

### An unfilled picture slot must not look like a bug

Every slot ships empty, and somebody will fill three of eight and present anyway.
In edit mode the dashed drop target is correct — it is an instruction. On an open
book it is a defect on the projector. So once the covers are open (`body.open`)
the slot becomes a quiet printed panel with its caption in the book's own hand:
*picture to come*, not *component failed to load*. Dark pages take the inverse
treatment, or the caption vanishes into the board.

---

## 11. Realism

Ordered by what each is worth, because the cheap ones are worth the most.

**Turn timing varies** — ±8% per leaf, deterministic from the leaf's index so the
same page always behaves the same way. Identical durations are most of what makes a
flip read as an animation rather than as paper.

**Soft stock overshoots.** Paper flops when it lands; a board does not. The
soft-stock easing has `y2 > 1` — one frame past flat, then it settles.

**The block is not a perfect pile.** Every leaf carries ±0.18° of its own, set once
at mount from its index, so the turned side fans instead of stacking like cards.
Static on purpose: a fan recomputed per turn would start a second transform
transition on every leaf and confuse the turn's own animation clock.

**One light, and it does not move.** A sheet passing through vertical turns its face
toward it and catches it. `--spec` peaks at 90° and travels across the sheet as it
rotates. Boards are shinier than paper, so the gradient is harder on hard stock.

**Ink bleeds through** — the cue that says *one sheet*, not two divs. A page whose
reverse is a dark board looks faintly grey, and the board's numeral ghosts through
**mirrored**, because you are seeing it from behind. Applied only where it is true:
the pages backed by a board.

**Wear, twice in the whole book.** One dog-ear — a real fold: the corner of the
sheet is *missing*, so the page under it shows through, and the folded triangle lies
on top back-side up — and one thumb smudge at the fore-edge, at the height a hand
holds a page. A third mark would read as a filter.

**Depth on the edges only.** The page-edge stacks go 0.35px soft because they are
further from the eye than the open spread. Never on a face carrying text: a blurred
word is a bug, not depth of field.

---

## 11b. First paint

Two things were visible on every refresh, and both were the browser painting the
document before the design had arrived.

**A flash of black, then the colour.** `--deep` is declared in `theme.css`, which
is a `<link>` and therefore lands after the inline block has already painted.
Until then the var is undefined and the browser uses its own background. The fix
is a literal fallback — `background: var(--deep, #03080E)` — inert once the sheet
arrives, so pairing switching still works.

**A rectangle reading "TITLE OF THE BOOK" above the book.** Everything that
positions this design — the stage, the curtain, the 3D block, and
`.book-3d { opacity: 0 }` which keeps the closed book invisible — lives in the two
linked stylesheets. For the moment before they arrive the browser laid the
template out as ordinary flowing HTML and painted the cover title as a plain block
of text. The stage is now hidden by the inline block and revealed by
`html body .book-live { visibility: visible }` at the top of `theme.css`: by the
time that rule applies, the linked sheets have landed and the design is dressed.

Three traps, all hit while fixing this, all recorded so they are not retried:

| tried | what happened |
|---|---|
| a `<style>` block in the document `<head>` | **breaks the mount outright** — the component ends up nested inside the raw template, which the runtime hides, and the page renders blank. Verified twice. Nothing may be added to `<head>`. |
| `x-dc { display: none }` of our own | the runtime already does exactly this for the source template; a second rule hid the live tree with it |
| an equal-weight reveal rule in `theme.css` | the hiding rule is an inline block that comes *after* this file's link, so it won by source order. The reveal needs `html body` specificity, not a later position |

**If `theme.css` fails to load the stage stays invisible.** Deliberate: without it
there is no palette, no type scale and no layouts, and showing the book undressed
is worse than showing the empty void.

---

## 12. What was tried and dropped

Recorded so it is not re-attempted by accident.

| dropped | why |
|---|---|
| Swag valance, fringe, cascades, tieback | fabric as geometry; CSS reaches "decorative" and stops short of "convincing" |
| Bookmark ribbon (spine tail, laid-over length, stored mark, `m` / `r`) | never read as cloth at this scale, and its only pointer target sat under the chrome. Removed entirely — no elements, no logic, no keys |
| Highlight crest in the gutter | the bend reads better from shadow alone |
| Standalone diagram page, two-column page | still valid in `theme.css`; the half-bleed and comparison spread do the same jobs better |
| A `.contents-sub` rule | declared, used by nothing, removed. A rule with no user is a rule the next person has to decide about |
| A brighter theatre red (#8A1220) | at this size a true theatre red is an hour of glare; the paper is meant to be the lit thing |
| Oxblood and gold as the shipped palette | replaced by the blue-teal arc (§2). Kept as a pairing, not deleted |
| Warm cream paper under teal cloth | reads as two palettes rather than one room |

---

## 13. Not built here, and why

**Sound** is the single biggest missing cue — a paper whisper per turn with a few
percent of pitch jitter, a board thump on open and close, a riffle. It needs real
audio files.

**Drag-to-turn** is the biggest missing *interaction*, and it belongs on the flip
engine. The spec:

- **Grab zone** — the outer 18% of the recto, full height, plus the top and bottom
  20% of the fore-edge for a corner grab. Cursor `grab`.
- **Follow** — the leaf's angle tracks the pointer's horizontal distance from the
  gutter, clamped 0–180°, with the soft-stock bend at `--curl = sin(π · angle/180)`.
- **Threshold** — past 45% of the width, or a release velocity over 0.35 px/ms
  toward the gutter, the turn completes; otherwise it springs back.
- **Spring back** — 260ms, `cubic-bezier(.2,.9,.3,1.04)`: faster than a turn, same
  one-frame overshoot, because the sheet is falling rather than being carried.
- **While dragging** — no reveals fire and the step index does not move until the
  turn completes. A half-turn that springs back must leave the reveal state exactly
  as it was.

**A second-screen presenter window** — the in-page panel (§10) covers notes, the
spread counter and what is next. What is *not* built is a genuine second window on
another display, with a clock and a thumbnail of the spread. The reveal model
already knows the step index and the spread; that window is a reader of this one.

**Real paper bend, woven-in curtain copy, true depth of field** — all three need the
WebGL path (§7b, §6).

**A forty-page book.** Sixteen leaves is comfortable. At forty, the riffle needs to
jump rather than turn every leaf, the tab rail needs to scroll or group, and the
fore-edge stops being a reliable position cue. Decide that before authoring, not
after.

---

## 13b. The design system, and what is actually used

**Only `_ds_bundle.css` is linked. `_ds_bundle.js` is not, and
`window.TellYourStory` is undefined.** The React component library ships
`Curtain`, `Page`, `Spread`, `Cover`, `Board`, `Sticky`, `Note`, `Tab`, `Chrome`
and `DiagramBars` — most of what this book writes as raw markup — so state the
reason plainly rather than let it look like an oversight:

- **The 3D leaf model needs DOM-level control the wrappers do not expose.** A leaf
  is one element with two faces, turned about the spine, carrying per-frame custom
  properties (`--curl`, `--spec`, `--cast-l/r`) written by the runtime. That is not
  a prop on a `Page` component; it is the geometry the whole design rests on.
- **The class contracts are still the design system's.** `.page.pl` / `.pr`,
  `.half`, `.below`, `.reveal`, `.leaf-tab`, `.stf__item` all come from its
  stylesheet, which is linked and doing the work. The markup honours the
  components' structure without instantiating them.

So: **use the stylesheet's contracts, not the JS components** — and if a future
screen genuinely is a plain page with no leaf geometry, mounting the real
component is the better answer than copying markup.

---

## 14. Handoff checklist

What this bundle is: **a design reference in HTML** — a prototype of look and
behaviour, not production code to lift. The job is to recreate it in the target
codebase's own environment and patterns.

Fidelity: **high**. Colours, type, spacing, timings and easings are final and all
of them are tokens in `theme.css`.

In rough order:

1. **Port `theme.css` as tokens first.** Everything else derives from it. Keep the
   one-file rule — it is the reason a rebrand is a ten-line diff.
2. **Build the leaf model before any content** (§1). Get a spread deriving from a
   leaf stack, with `pl` / `pr` baked in, and the face swap on the solved 90° point
   riding the animation's own clock (§7a). Everything else depends on this being
   right, and it is the part most likely to be rebuilt wrongly from intuition.
3. **Drop in the flip engine** (§7b) rather than porting the CSS approximation.
   Keep the soft/hard distinction and the side classes.
4. **Then the reveal model** (§8) — step list per spread, first step automatic,
   held press queued, `End` skips.
5. **Then the layouts** (§9), one at a time, checking the band continuation and the
   folio pass each time a leaf is added.
6. **Curtain last.** It is a show, not a mechanism, and it is the one part that can
   ship in a rougher form without anyone noticing.
7. **Replace the copy** from `content-slots.md`, and get real imagery into the four
   image slots.

Two things that will bite:

- **The chrome z-index wall** (§5) — nothing in the book can paint above the fixed
  chrome bar, because the stage is a transformed element.
- **The page-rhythm `!important`** (§4) — anything reaching the paper's edge must be
  pinned, not pulled.

---

## 15. Do / don't

**Do**
- Add a dial in `theme.css` when something needs a colour.
- Let the page gap set spacing; zero the block's own margins.
- Keep every page to one layout and at most five reveal steps.
- Give the presenter a way past every animation.
- Keep absolute units inside the stage; scale the stage, not the type.
- Renumber folios in one pass.

**Don't**
- Write a hex value, a font stack, or a `clamp(…vw…)` size in a page.
- Animate the open book while there is text on it.
- Use `:nth-child` for anything that depends on which side of the gutter a page is
  on — the flip engine reorders the DOM mid-turn and the styling will jump sides.
- Randomise sticky tilt or colour.
- Stack more than two stickies on a page, or put one on a board.
- Bleed an image into the gutter.
- Let a reveal step exist that the audience will not notice.

---

## 16. Handing this to Claude Code

The failures in this design were never failures of taste. Every one was a **rule
that lived only in prose** — true, written down, and silently violated three
edits later. So the defences are mechanical, and there are four of them.

### 16.1 The book declares its own structure

Two attributes, on every relevant element, so nothing has to be inferred:

| attribute | on | why |
|---|---|---|
| `data-layout` | every `.page` | Layout classes live on *inner* blocks (`.contents`, `.tl-rail`, `.compare`), so a page's own class tells you almost nothing. With this, `[data-layout="timeline"]` finds both halves of the timeline spread and no inspection is needed. |
| `data-slot` | every element holding copy | 172 of them. `[data-slot="heading"]` is every page heading; `[data-slot="body"]` is every paragraph. Replacing placeholder copy becomes a query, not a reading exercise. |
| `data-stock` | every `.leaf` | `hard` swings rigid, `soft` bends. The flip engine needs this and cannot guess it. |
| `data-screen-label` | every `.leaf` | So a comment or a bug report can name a leaf. |

The roles are listed with counts in `content-slots.md`. **Do not invent new role
names** — reuse one, or add it to the catalogue and the audit together.

### 16.2 The audit runs, the prose does not

`audit.js` → `bookAudit()` in the console. Nine checks, each one a bug that
actually happened:

| check | the bug it catches |
|---|---|
| leaf sides | a face wearing `pr` on the back of a leaf — it rendered as a right-hand page while sitting on the left, mirroring its gutter shadow, margins and folio |
| folio sequence | two 2s, two 3s and a gap from 4 to 7, from editing one folio by hand |
| contents targets | a contents page pointing at folios 3,5,7,9,11,13 when the sections began on 2,4,6,8,10,12 |
| layout tags | a page with no `data-layout`, which is invisible until something tries to query it |
| loose text | copy with no `data-slot`, which is copy nobody will find |
| inline colour | a hex literal outside `theme.css` |
| dead tokens | `--paper-1` for `--paper`: one wrong name invalidates the whole declaration and the element paints *nothing* |
| overflow | content past the foot of its paper |
| full-bleed steps | a picture crossing the gutter arriving one half at a time |

**Add a check whenever you fix a class of bug.** A rule in prose gets forgotten; a
rule that fails out loud does not.

### 16.3 The three traps that are not obvious

1. **The chrome is a fixed z20 bar, and the stage is a transformed element.**
   Nothing inside the book can paint above the bar — its whole subtree is confined
   below z20 no matter what z-index a child is given. Any affordance near the
   bottom edge hits this wall. (Cost: a whole feature that could not be clicked.)
2. **The page-rhythm rule zeroes every direct child's block margins with
   `!important`.** Negative margins to pull something to a page edge therefore do
   nothing. Pin it absolutely instead — and remember a reveal's slide transform
   will put a pinned element back off the edge, so full-bleed elements fade only.
3. **Ride the animation's clock, never the click's.** A CSS transition does not
   start until the next style flush, ~130ms later. Timers counted from the click
   fire while the paper is still moving. Use the leaf's own `Animation` object:
   `ready` for the real start, `finished` for the real end. And the 90° face swap
   is at **33.2%** of the duration, not half — the easing is slow off the mark and
   fast into the finish.

### 16.4 Content, not layout, is what changes

When the real book is written, nothing about the leaf model, the reveal model or
the layouts should need to move. The work is:

1. Replace `[data-slot]` copy, role by role, from `content-slots.md`.
2. Fill the four image slots (see the same file — the two bleed halves are one
   picture cut down the middle).
3. Add or remove **leaves**, not faces: a spread is `leaf[k−1].back` +
   `leaf[k].front`, so adding a section means one new leaf carrying the board's
   right half, plus a rail tab pointing at its spread index.
4. Renumber folios **in one pass**, then run `bookAudit()`.

If a layout genuinely does not exist for the content — a contact sheet was specced
and never built, for instance — add it to the catalogue in §12, build it once in
the book so the book stays its own reference sheet, and give it a
`data-layout` name and an audit entry in the same commit.
