# Choosing a layout

**Read the content, name its shape, take the layout.** This is the decision an
assistant has to make on every page, and it is the one most likely to go wrong —
not because the layouts are hard, but because it is tempting to reach for the
interesting ones.

---

## The rule, in one table

Work down it. The first row that genuinely fits is the answer.

| If the content is… | Use | Not |
|---|---|---|
| a sequence with real **times or dates** | `:::timeline` | a bulleted list |
| **two states of one thing** — old/new, wrong/right, before/after | `:::compare before` + `:::compare after` on facing pages | two prose pages |
| **rows and columns** of comparable values | a Markdown table | prose describing the table |
| **quantities you want compared at a glance** | `:::diagram bars` | a table of the same numbers |
| **steps in an order** | `:::diagram flow` | a numbered list, when the order is the point |
| a **repeating** process with no end | `:::diagram cycle` | `flow`, which implies it finishes |
| **the first page of a section** | `:::opener` | ordinary prose |
| **one sentence that is the whole point** | `:::big` | a heading plus a paragraph |
| **someone else's words**, given room | `:::quote` | an indented blockquote in prose |
| text a reader would **annotate** | `:::marginalia` | prose with parenthetical asides |
| **the one thing to remember** | `:::takeaway` | a bolded last paragraph |
| a **list they must confirm, not just read** | `:::checklist` — boxes sized for a pen | a plain bullet list when they only need to know the items |
| a **procedure in a fixed order** | `:::steps` — big numerals, findable at arm's length | `:::diagram flow`, which is for a decision that BRANCHES |
| a **rule with a right and a wrong way** | `:::dodont` — both halves, one page, one glance | `:::compare`, which is a spread and is about time, not judgement |
| **naming the parts of a thing** | `:::anatomy` — numbered pins on the drawing, key beneath | a picture with the labels drawn into it, which cannot be resized or translated |
| a **photograph that is the point** | an image alone (half bleed) or `:::bleed` | a picture inside prose |
| a **drawing you treated with `ink.mjs`** | the image with `{.plate}` — that is the plate layout, wide with the words beneath | a photograph; treat it first, then it is a drawing |
| **how the book was made** | `:::colophon` | a credits paragraph |
| anything else | **prose** | a block, just to use one |

**When two rows both fit, take the earlier one.** It is more specific, and
specific layouts carry meaning that prose has to spell out.

---

## What goes wrong, and how to avoid it

**Reaching for the interesting layout.** A timeline with no times is a list that
has been made harder to read. A comparison where only one side is real is a
prose page wearing a costume. If the content does not have the SHAPE, it does
not get the layout.

**One layout per page.** They are never combined. A page with a table and a
chart is two pages.

**Prose is the correct answer most of the time.** In a well-made book most pages
are prose; the specific layouts are punctuation. A book where every page is a
different layout is exhausting to read and reads as a demo of the tool.

**A block does not make a page.** `:::big` on a page that also has three
paragraphs is not a statement page — the statement layout is chosen because the
sentence is ALONE.

**Sticky notes attach to what precedes them.** Write the note directly after the
block it annotates. One on its own, at the top of a page, has nothing to stick
to.

**A comparison is a pair.** `:::compare before` without an `after` on the facing
page is half an argument.

**A timeline crossing the gutter is two blocks.** One per page, two or three
stops each — not six stops crammed onto one side.

---

## Sections, and how many

`>> Name` starts a section. Each one costs a hard board (two faces), a fore-edge
tab and a contents entry — so sections are chapters, not topics.

- **Fewer than 2** and the contents page is not generated at all: there is
  nothing to list.
- **Six is comfortable.** The fore-edge tabs are spread down the edge, and past
  about eight they stop being a reliable position cue.
- **Two to four pages per section** reads well. A section with one page is a
  page wearing a chapter's clothing.

---

## Pacing — what arrives when

A page is a sequence of steps, not a slab. The first lands with the page; each
press brings the next.

**At most five steps a page.** More than that and the presenter is clicking
rather than talking. `node scripts/prep.ts` counts them and says so.

Three markers change the order, and nothing else does:

| Marker | Effect | Use it for |
|---|---|---|
| `{.step-first}` | arrives with the page, wherever it sits | a warning that must not wait behind three paragraphs |
| `{.step-last}` | arrives after everything else | a takeaway, so the point lands after the argument for it |
| `{.with-previous}` | arrives WITH the block above, not on its own press | a caption under a picture; a sticky on the paragraph it annotates |

```markdown
:::takeaway {.step-last}
[The line that has to land last.]
:::
```

**Run `node scripts/prep.ts <file>` before building.** It measures what cannot be judged
by reading — page lengths against real capacity, headless pages, overlong
tables, too many steps — and proposes the pacing, with the exact marker to
paste. It never rewrites your words. Overrule it where it is wrong: it reads
structure, you read meaning.

---

## The order to work in

```bash
node scripts/prep.ts   content/lesson.md                      # 1. shape it   <- do not skip
node dist/build.mjs content/lesson.md output/lesson.html  # 2. build it
node scripts/check.ts                                         # 3. prove it
```

Step 1 decides whether the result is any good. A well-chunked source makes a
good book; a wall of text defeats every feature in here.
