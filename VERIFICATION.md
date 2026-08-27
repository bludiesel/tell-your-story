# Verification

Two passes, because the skill has two halves and one cannot prove the other.
Regenerate with `node scripts/verify.ts`.

## The catalogue — proved from the templates, not from the source

Every row below was produced by copying a snippet out of
`templates/LAYOUTS.md`, filling its placeholders the way an author would,
building it through `src/build.ts` as a real subprocess, and asking the
resulting page what layout it thinks it is.

This is deliberately the long way round. `pickLayout` is first-match-wins
and ordered, so a layout can be fully built, fully documented, and still
unreachable — shadowed by an earlier test that also matches. Nothing fails;
the page simply comes out as something else. Walking in through the front
door the templates describe is the only way to catch it.

**27/27 verified.**

| Layout / block | Identifier | Verified | Evidence |
|---|---|:--:|---|
| Prose — the default | `prose` | ✅ | 5 page(s) came back data-layout="prose" |
| Chapter opener — a drop cap four lines deep | `opener` | ✅ | 1 page(s) came back data-layout="opener" |
| Statement — one line, the largest type in the book | `statement` | ✅ | 1 page(s) came back data-layout="statement" |
| Quote page — a page given to one sentence | `quote-page` | ✅ | 1 page(s) came back data-layout="quote-page" |
| Sticky note — stuck ONTO the block above it | `has-sticky` | ✅ | 1 page(s) came back data-layout="has-sticky" |
| Marginalia — hand notes in the outer margin | `marginalia` | ✅ | 1 page(s) came back data-layout="marginalia" |
| Takeaway — the one thing to remember | `takeaway` | ✅ | 1 page(s) came back data-layout="takeaway" |
| Table — rules, never boxes | `ptable` | ✅ | 1 page(s) came back data-layout="ptable" |
| Chart — horizontal bars | `barchart` | ✅ | 1 page(s) came back data-layout="barchart" |
| Timeline — one rail across the gutter | `timeline` | ✅ | 2 page(s) came back data-layout="timeline" |
| Before / after — a comparison spread | `compare` | ✅ | 2 page(s) came back data-layout="compare" |
| Checklist — boxes to tick | `checklist` | ✅ | 1 page(s) came back data-layout="checklist" |
| Steps — a numbered procedure | `steps` | ✅ | 1 page(s) came back data-layout="steps" |
| Do / Don't — both halves of a rule | `dodont` | ✅ | 1 page(s) came back data-layout="dodont" |
| Anatomy — a drawing with numbered pins | `anatomy` | ✅ | 1 page(s) came back data-layout="anatomy" |
| Plate — a drawing laid on the paper | `plate` | ✅ | 1 page(s) came back data-layout="plate" |
| Half bleed — a picture off the outer edge | `half-bleed` | ✅ | 1 page(s) came back data-layout="half-bleed" |
| Full bleed — a picture to every edge | `full-bleed` | ✅ | 2 page(s) came back data-layout="full-bleed" |
| Colophon — the record of how the book was made | `colophon` | ✅ | 1 page(s) came back data-layout="colophon" |
| Every layout is reachable | — | ✅ | 22 known = 19 authored + 3 generated |
| Generated: cover | `cover` | ✅ | emitted in every one of the 19 builds above |
| Generated: contents | `contents` | ✅ | emitted in every one of the 19 builds above |
| Generated: divider | `divider` | ✅ | emitted in every one of the 19 builds above |
| Notes and asides — typeset into the document | — | ✅ | 3 match(es) for class="callout callout-(note|tip|warning… |
| Flow and cycle diagrams | — | ✅ | 2 match(es) for <svg[\s>]… |
| Two columns | — | ✅ | 1 match(es) for class="[^"]*\bcolumns\b… |
| The catalogue shows every layout | — | ✅ | all 22 layouts rendered in content/every-layout.md |

## The runtime

_Not run in this pass._ Run `node scripts/drive-browser.mjs <url>` (see its
header for the two commands it needs) and re-run this to fold the results in.
