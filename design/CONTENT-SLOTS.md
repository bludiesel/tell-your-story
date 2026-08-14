# Content slots

Every piece of placeholder copy in **The Book**, and where it sits. Generated
from the book itself, not written by hand — **regenerate it after editing the
book** rather than patching it, or it drifts and stops being worth reading.

Two things make this queryable at runtime, so you rarely need this file at all:

    [data-layout]   on every .page      — the page declares its own layout
    [data-slot]     on every text node  — the copy declares its own role

    document.querySelectorAll('[data-slot="heading"]')        every page heading
    document.querySelectorAll('[data-layout="section-board"]') every board face
    [...document.querySelectorAll('[data-slot]')].map(e => e.dataset.slot)

**172 slots**, 16 leaves, 33 page faces, 16 layouts, 4 image slots.

---

## The spreads

Spread *k* shows `leaf[k−1].back` on the left and `leaf[k].front` on the right.
That is the whole navigation model: one number, two faces.

| spread | left (verso) | right (recto) |
|---|---|---|
| **1** | L1 back · cover-inside · board verso · — | L2 front · contents · recto · folio i |
| **2** | L2 back · section-board · verso · — | L3 front · section-board · recto · — |
| **3** | L3 back · quote · verso · folio 2 | L4 front · chapter-opener · recto · folio 3 |
| **4** | L4 back · section-board · verso · — | L5 front · section-board · recto · — |
| **5** | L5 back · prose · verso · folio 4 | L6 front · prose · recto · folio 5 |
| **6** | L6 back · section-board · verso · — | L7 front · section-board · recto · — |
| **7** | L7 back · marginalia · verso · folio 6 | L8 front · half-bleed · recto · folio 7 |
| **8** | L8 back · section-board · verso · — | L9 front · section-board · recto · — |
| **9** | L9 back · full-bleed · verso · folio 8 | L10 front · full-bleed · recto · folio 9 |
| **10** | L10 back · section-board · verso · — | L11 front · section-board · recto · — |
| **11** | L11 back · table · verso · folio 10 | L12 front · chart · recto · folio 11 |
| **12** | L12 back · section-board · verso · — | L13 front · section-board · recto · — |
| **13** | L13 back · timeline · verso · folio 12 | L14 front · timeline · recto · folio 13 · dog-eared |
| **14** | L14 back · comparison · verso · folio 14 | L15 front · comparison · recto · folio 15 |
| **15** | L15 back · statement · verso · folio 16 | L16 front · colophon · recto · — |
| **16** | L16 back · cover-inside · board verso · — | — (the book ends here) |

Sixteen spreads. Folios run **i, then 2–16**: front matter takes roman, the first
prose page starts at 2, and each printed page takes the next number in physical
order. Covers and boards carry none, and neither does the colophon — it is the
record of how the book was made, not part of its argument.

---

## The copy, by face

### L1 front · cover-front

| role | placeholder |
|---|---|
| `title` | TITLE OF THE BOOK |
| `subtitle` | what kind of book this is |
| `imprint` | owner · internal |

### L1 back · cover-inside

| role | placeholder |
|---|---|
| `subtitle` | inside the front board |

### L2 front · contents

| role | placeholder |
|---|---|
| `eyebrow` | what is in here |
| `heading` | Contents |
| `contents-number × 6` | 01 … 06 |
| `contents-title × 6` | THE ARGUMENT · THE EVIDENCE · THE OBJECTION · THE METHOD · THE NUMBERS · WHAT HAPPENS NEXT |
| `contents-folio × 6` | 2 · 4 · 6 · 8 · 10 · 12 |
| `body` | Six sections. The fore-edge tabs go to the same six places… |

### section boards (× 6)

| role | placeholder |
|---|---|
| `board-number` | 01 … 06 |
| `board-eyebrow` | section 01 … section 06 |
| `board-title` | the six section titles, repeated from the contents |
| `body` | What the section claims, in one line, on the board itself. |
| `tab-label` | argument · evidence · objection · method · numbers · next |

### L3 back · quote

| role | placeholder |
|---|---|
| `quote` | A page given to one sentence… |
| `quote-attribution` | attribution, and where it came from |

### L4 front · chapter-opener

| role | placeholder |
|---|---|
| `eyebrow` | section 01 begins |
| `heading` | The argument |
| `opener-number` | one |
| `body × 2` | opening paragraph with the drop cap, then a second at the same measure |

### L5 back · prose

| role | placeholder |
|---|---|
| `eyebrow` | handwritten eyebrow |
| `heading` | Prose, left |
| `body` | The default layout… |
| `block-title × 2` | worth doing · hard stop |
| `body × 2` | one line inside each aside |

### L6 front · prose + stickies

| role | placeholder |
|---|---|
| `eyebrow` | asides |
| `heading` | Notes and stickies |
| `body` | An ordinary page of prose… |
| `block-title × 3` | a typeset aside · Remember (sticky) · the one thing (takeaway) |
| `body × 3` | one line inside each |

### L7 back · marginalia

| role | placeholder |
|---|---|
| `eyebrow` | notes in the margin |
| `heading` | Marginalia |
| `body × 2` | narrow-measure text |
| `margin-note × 2` | a note, level with the line it answers · and a second, further down |

### L8 front · half-bleed

| role | placeholder |
|---|---|
| `eyebrow` | picture and text |
| `heading` | Half bleed |
| `body × 2` | inner-column text and one aside |
| `block-title` | why it never bleeds at the gutter |
| `IMAGE book-halfbleed` | Drop a photograph here — it runs off the outer edge |

### L9 back / L10 front · full-bleed

| role | placeholder |
|---|---|
| `IMAGE book-bleed-l` | LEFT half of one photograph |
| `IMAGE book-bleed-r` | RIGHT half of the same photograph |
| `caption` | the caption sits on the picture, on one side only |

### L11 back · table

| role | placeholder |
|---|---|
| `eyebrow` | set as print |
| `heading` | A table |
| `table-caption` | rules, not boxes |
| `table-head × 4` | Line · Before · After · Delta |
| `table-cell × 4` | row labels |
| `table-number × 12` | the figures |
| `body` | Three horizontal rules in the whole table… |

### L12 front · chart

| role | placeholder |
|---|---|
| `eyebrow` | the same numbers |
| `heading` | A chart |
| `bar-label × 4` | First … Fourth |
| `bar-value × 4` | 78 · 62 · 41 · 24 |
| `block-title` | how it arrives |
| `body` | The bars have no width until the block is revealed… |

### L13 back / L14 front · timeline

| role | placeholder |
|---|---|
| `eyebrow` | across the fold |
| `heading` | A timeline |
| `timeline-when × 4` | first · second · third · fourth |
| `timeline-what × 4` | one line each |

### L14 back / L15 front · comparison

| role | placeholder |
|---|---|
| `eyebrow × 2` | the comparison |
| `heading × 2` | Before · After |
| `compare-tag × 2` | before · after |
| `list-item × 6` | three lines a side |

### L15 back · statement

| role | placeholder |
|---|---|
| `statement` | One statement, filling the page |

### L16 front · colophon

| role | placeholder |
|---|---|
| `colophon-label` | colophon |
| `body × 2` | how the book was set; one closing line |

### L16 back · cover-inside

| role | placeholder |
|---|---|
| `subtitle` | inside the back board |

### the curtain (before the book opens)

| role | placeholder |
|---|---|
| `curtain-eyebrow` | handwritten eyebrow |
| `curtain-title` | THE TITLE GOES HERE |
| `curtain-sub` | the standfirst, on the right panel |
| `IMAGE curtain-art` | Drop the cover art here |

---

## Roles, by count

Every role in the book. `folio` is generated, not authored — renumber in one
pass (see design.md §11) rather than editing single values.

| role | count |
|---|---|
| `body` | 24 |
| `folio` | 16 |
| `table-number` | 12 |
| `eyebrow` | 11 |
| `heading` | 11 |
| `block-title` | 7 |
| `contents-number` | 6 |
| `contents-title` | 6 |
| `contents-folio` | 6 |
| `board-number` | 6 |
| `board-eyebrow` | 6 |
| `board-title` | 6 |
| `tab-label` | 6 |
| `list-item` | 6 |
| `subtitle` | 4 |
| `table-head` | 4 |
| `table-cell` | 4 |
| `bar-label` | 4 |
| `bar-value` | 4 |
| `timeline-when` | 4 |
| `timeline-what` | 4 |
| `title` | 2 |
| `imprint` | 2 |
| `margin-note` | 2 |
| `compare-tag` | 2 |
| `quote` | 1 |
| `quote-attribution` | 1 |
| `opener-number` | 1 |
| `caption` | 1 |
| `table-caption` | 1 |
| `statement` | 1 |
| `colophon-label` | 1 |

---

## Images

Four slots, all empty. Each survives a reload once filled, keyed by its id.

| id | where | what goes there |
|---|---|---|
| `curtain-art` | the curtain's right panel | the cover art, woven into the cloth |
| `book-halfbleed` | L8 front, half-bleed | a photograph running off the outer edge |
| `book-bleed-l` | L9 back, full-bleed | the LEFT half of one photograph |
| `book-bleed-r` | L10 front, full-bleed | the RIGHT half of the same photograph |

`book-bleed-l` and `book-bleed-r` are two halves of **one** picture: a single
element cannot span two leaves, because the two halves are on different sheets of
paper. Cut the image down the middle and drop each half in its own slot.

---

## Before handing content back

Run `bookAudit()` in the console (`audit.js`). It checks the things that went
wrong at least once during the design: side classes, folio sequence, contents
pointing at pages that exist, every page declaring a layout, every text node
declaring a role, no inline colour literals, no unresolved tokens, nothing
overflowing its paper, and the full-bleed picture landing whole.


---

## Speaker notes

Every page also carries a `data-notes` placeholder — 33 of them, one per face.
They are written as *what to say*, not as a description of what is on the page,
because that is the distinction that makes a presenter panel worth having. Replace
them the same way as any other slot: edit the attribute in place, keep the voice.

Press **N** during a presentation to show them. Off by default, deliberately.
