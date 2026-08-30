/**
 * capabilities.ts — the ONE list of everything this kit can do.
 *
 * WHY THIS FILE EXISTS
 * The kit has grown a lot of features: content blocks, section boards, sticky
 * notes, a stage curtain with printed copy, presenter-remote control, resume,
 * riffle, a themeable palette. An assistant handed a pile of content has to be
 * able to see the whole toolbox, or it will use the three things it happens to
 * remember and silently drop the rest.
 *
 * Prose documentation does not solve that, because prose drifts: a block gets
 * added in `markdown.ts` and nobody edits the README. So this is a MACHINE
 * -READABLE manifest, and `scripts/check.ts` reads the real implementation —
 * `BLOCKS` in markdown.ts, the frontmatter keys in build.ts, the tokens emitted
 * by theme.ts, the CLI flags — and FAILS THE BUILD if anything is present in the
 * code but missing here.
 *
 * That inversion is the whole point. The catalogue cannot fall behind the code,
 * because the code is what proves the catalogue complete.
 *
 * To add a feature: implement it, then add it here. The build will tell you if
 * you forgot the second half.
 */

export interface Capability {
  /** The exact token an author writes, e.g. `:::sticky` or `curtain_photo`. */
  id: string
  /** One line, plain English — this is what an assistant reads to choose. */
  what: string
  /** When to reach for it, so the choice is not guesswork. */
  use: string
  example?: string
}

export interface CapabilityGroup {
  group: string
  where: string
  items: Capability[]
}

export const CAPABILITIES: CapabilityGroup[] = [
  {
    group: 'Content blocks',
    where: 'in the body of any page, written as ::: fences',
    items: [
      { id: ':::note', what: 'A typeset aside, part of the document',
        use: 'A caveat or clarification that belongs to the text itself.',
        example: ':::note Worth knowing\nThe valve is upstream of the meter.\n:::' },
      { id: ':::tip', what: 'A positive, practical pointer',
        use: 'A shortcut, a good habit, something that makes the job easier.' },
      { id: ':::warning', what: 'A danger or hard stop',
        use: 'Anything where getting it wrong hurts someone or breaks something.' },
      { id: ':::takeaway', what: 'The single thing to remember from a page',
        use: 'End of a section, when one idea must survive everything else.' },
      { id: ':::sticky', what: 'A physical sticky note pinned at an angle',
        use: 'An aside in a HUMAN voice — a reminder someone stuck on afterwards. ' +
             'Distinct from :::note, which is typeset into the document. Colour and ' +
             'tilt rotate automatically across notes on a page. It arrives by being pressed ' +
             'onto the paper — in from above, off-square, landing on its tilt — rather ' +
             'than fading in the way the typeset blocks do.',
        example: ':::sticky Remember\nAsk before you assume — every time.\n:::' },
      // ── the layout catalogue ────────────────────────────────────────────
      // Each of these makes a page take one of the seventeen layouts. A page
      // uses ONE layout and fills it in; they are never combined, which is why
      // each block below wants a page to itself.
      { id: ':::opener', what: 'A chapter opener with a drop cap four lines deep',
        use: 'The first page of a section, where the prose should begin rather than continue. ' +
             'The title of the block becomes the small hand-set line above it.',
        example: ':::opener chapter one\nThe first paragraph. Its first letter becomes the cap.\n:::' },
      { id: '{.plate}', what: 'Marks a picture as treated artwork: its own layout, and the page ruling hidden behind it',
        use: 'Add it to any picture that came out of the Ink Studio or dist/ink.mjs. It does two ' +
             'things. It puts the page on the PLATE layout — the drawing wide across the text ' +
             'column at its own proportion, words beneath — because a drawing is usually ' +
             'landscape and the half bleed would crop it. And it blurs what is behind the ' +
             'drawing, so the ruled lines stop where the ink covers them and the paper matches ' +
             'at any position and in any theme. Tune with --plate-blur and --plate-fade.',
        example: '![A technician checking a cylinder](artwork.ink.webp){.plate}' },
      { id: ':::checklist', what: 'Tick boxes the reader marks, sized for a real pen',
        use: 'A list the reader has to CONFIRM, not just read — a pre-start check, a handover, ' +
             'kit to bring. Use it when the point is that each line gets done and signed off. ' +
             'A plain bullet list when they only need to know the items.',
        example: ':::checklist Before you go up\n- Permit signed and in date\n- Anchor point rated for the load\n:::' },
      { id: ':::steps', what: 'A numbered procedure, the numeral set big enough to find',
        use: 'Do these, in this order. Distinct from `:::diagram flow`, which is for a decision ' +
             'that BRANCHES — most training is linear and a flow chart of a straight line is ' +
             'harder to follow than a numbered list, not easier.',
        example: ':::steps Isolating a line\n1. Close the upstream valve\n2. Watch the gauge fall\n3. Tag it\n:::' },
      { id: ':::dodont', what: 'Both halves of a rule side by side on ONE page',
        use: 'A rule with a wrong way and a right way. Write two `###` headings inside it — the ' +
             'first is the DO half, the second the DON\'T. Reach for `:::compare` instead when ' +
             'the two things are separated by TIME rather than by judgement, and you have a ' +
             'facing pair to give it.',
        example: ':::dodont Ladders\n### Do\n- Tie it off\n### Don\'t\n- Stand on the top two rungs\n:::' },
      { id: ':::anatomy', what: 'A drawing with numbered pins on it and a key beneath',
        use: 'Naming the parts of a thing. Each key line carries the pin position as per cent ' +
             'across and down the picture — `1. Burst disk | 32 20` — because you know where the ' +
             'parts are and the software does not. Percentages, so a pin stays on its part at ' +
             'every page size; labels drawn into the artwork instead cannot survive a resize, a ' +
             'rebrand or a translation.',
        example: ':::anatomy The cylinder valve\n![A valve, drawn](valve.ink.png){.plate}\n1. Burst disk | 32 20\n2. Handwheel | 60 45\n:::' },
      { id: ':::timeline', what: 'A rail across the gutter with dated stops on it',
        use: 'A sequence with real times or dates. One line per stop, written `when | what`. ' +
             'Use it on BOTH pages of a spread and the rail reads as one line crossing the fold. ' +
             'The rail draws itself outward from the gutter as the page arrives.',
        example: ':::timeline\n08:00 | Permit raised\n09:30 | Line isolated\n:::' },
      { id: ':::compare', what: 'One side of a before/after spread',
        use: 'Put `:::compare before` on one page and `:::compare after` on the next. Both sides ' +
             'carry the same structure on purpose — the comparison is only honest if the one ' +
             'difference is the content.',
        example: ':::compare before\nThe old sequence, followed from memory.\n:::' },
      { id: ':::marginalia', what: 'A narrow column with hand notes in the outer margin',
        use: 'Text that a reader would annotate. Any `>` blockquote inside becomes a margin note. ' +
             'Notes always sit in the OUTER margin, never the gutter — nobody can write in a fold.',
        example: ':::marginalia\nThe narrow column of text.\n\n> a note in the margin\n:::' },
      { id: ':::bleed', what: 'A photograph running to every edge of the page',
        use: 'One picture, no other content. For a picture crossing a SPREAD, cut it down the ' +
             'middle and use two `:::bleed` pages back to back — a single element cannot span two ' +
             'leaves, because the halves are on different sheets of paper. The block title ' +
             'becomes the caption.',
        example: ':::bleed the site at first light\n![](img/site.png)\n:::' },
      { id: ':::colophon', what: 'The record of how the book was made',
        use: 'The last printed page. Small, centred, quiet, and it carries no folio by ' +
             'convention. A final short paragraph becomes the imprint line.',
        example: ':::colophon\nSet in Barlow Condensed and Caveat.\n\nYour Brand\n:::' },
      { id: ':::diagram', what: 'A real SVG diagram, drawn at build time and animated on reveal',
        use: 'Three types. `:::diagram flow` for a sequence of steps, `cycle` for something that ' +
             'repeats, `bars` for comparing a handful of numbers. Steps are pipe-separated; bars ' +
             'take "Label | number" per line. Generated by svg.js so nothing ships to the reader, ' +
             'and emitted INLINE so GSAP can draw the connectors on and stagger the nodes as the ' +
             'page turns. Prefer this over a screenshot of a diagram — it rebrands with the theme.',
        example: ':::diagram flow\nIsolate | Prove dead | Tag it | Work\n:::' },
      { id: ':::columns', what: 'Side-by-side content',
        use: 'Comparing two things, or pairing a picture with its explanation.' },
      { id: ':::quote', what: 'A pull quote',
        use: 'Someone\'s words, given weight.' },
      { id: ':::big', what: 'One large statement filling the page',
        use: 'A closing line, a rule, a moment of pause. Use `<br>` to break lines.' },
    ],
  },
  {
    group: 'Pacing a page',
    where: 'in braces after any block — these change WHEN it arrives, never where it sits',
    items: [
      { id: '{.step-first}', what: 'Arrives with the page, whatever its position',
        use: 'A warning that must not wait behind three paragraphs of setup.' },
      { id: '{.step-last}', what: 'Arrives last, after everything else on the spread',
        use: 'A takeaway or a closing line, so the point lands after the argument for it.',
        example: ':::takeaway {.step-last}\nProve it dead before you touch it.\n:::' },
      { id: '{.with-previous}', what: 'Arrives WITH the block above it, not on its own press',
        use: 'A caption under a picture, or a sticky note annotating the paragraph it sits by — ' +
             'neither is a beat of its own.' },
      { id: 'node scripts/prep.ts', what: 'Proposes the order for you and says why',
        use: 'The sequencing pass reads the block TYPES and prints the pacing for any page that ' +
             'should not simply be document order, with the exact marker to paste. It is a ' +
             'proposal from structure; YOU are reading the meaning, so overrule it where it is ' +
             'wrong — that split is deliberate.' },
    ],
  },
  {
    group: 'Page structure',
    where: 'markers at the top of a page, above the heading',
    items: [
      { id: '---', what: 'Starts a new page',
        use: 'A line containing only three dashes. One idea per page.' },
      { id: '>> Section name', what: 'Opens a SECTION',
        use: 'Inserts a hard divider board and adds a fore-edge tab that jumps to it. ' +
             'Use for real chapters — three to six in a workbook. NOT every page.' },
      { id: '> eyebrow', what: 'The handwritten kicker on this page only',
        use: 'A short label above the heading. Does NOT create a section.' },
      { id: '## Heading', what: 'The page title, shown in the header band',
        use: 'The first heading is lifted into the band and removed from the body.' },
    ],
  },
  {
    group: 'Book motion',
    where: 'built into every standalone book — guidance, not extra Markdown syntax',
    items: [
      { id: 'GSAP motion direction', what: 'A restrained, book-specific animation grammar',
        use: 'Choose motion by teaching action: reading order for an argument; a drawn path for a flow; sequential segments for a cycle; baseline growth for bars; and a quiet final reveal for a conclusion. Read “Motion direction” in SKILL.md before shaping a presented lesson.' },
      { id: 'built-in choreography', what: 'Curtain, cover, page turns, landings, diagram reveals and controls',
        use: 'These ship automatically and are intentionally not author-tunable per book. Control the content cadence with steps, typing and pacing markers; do not invent competing page-turn or looping motion.' },
      { id: 'reduced-motion final state', what: 'A complete, readable version with motion removed',
        use: 'Treat this as an invariant. Animation may clarify a relationship but must never hide it; every diagram and block has to make sense when it appears immediately.' },
    ],
  },
  {
    group: 'Front matter',
    where: 'the YAML block at the very top of the file',
    items: [
      { id: 'title', what: 'Book title', use: 'Cover, spine, browser tab and the curtain.' },
      { id: 'subtitle', what: 'Secondary line', use: 'Shown on the cover in the handwritten face.' },
      { id: 'spine', what: 'Text down the spine', use: 'Defaults to the title; set it when the title is long.' },
      { id: 'hint', what: 'The prompt on the closed book', use: 'Default: "tap to open".' },
      { id: 'footer', what: 'A line on the cover', use: 'Ownership, confidentiality, edition.' },
      { id: 'curtain_eyebrow', what: 'Small line above the curtain title', use: 'Brand or programme name.' },
      // Caught by the drift check on its first run: accepted by the build for
      // years-old briefs, but nobody had written it down.
      { id: 'eyebrow', what: 'Older alias for curtain_eyebrow', use: 'Accepted for compatibility; prefer curtain_eyebrow in new briefs.' },
      { id: 'curtain_title', what: 'Headline printed on the curtain', use: 'Defaults to `title`. The last word takes the accent colour. It is re-printed down the strip of cloth left showing beside the open book, so keep it short enough to read as one vertical line.' },
      { id: 'curtain_text', what: 'Standfirst on the curtain', use: 'One or two sentences: what this is and how long it takes.' },
      { id: 'curtain_hint', what: 'The prompt on the curtain', use: 'Default: "click anywhere to begin".' },
      { id: 'curtain_photo', what: 'Photograph printed on the curtain', use: 'A path like `img/site.png`. Obeys the --assets switch like any picture. Also carried into the right-hand strip once the curtain settles, dyed into the cloth — so a picture that depends on fine detail will not survive; pick one that reads as a shape.' },
      { id: 'steps', what: 'Reveal page blocks one at a time',
        use: 'Defaults to on for presenter-led training. Set `steps: false` when the reader should see a whole page at once.' },
      { id: 'typing', what: 'Type plain-text blocks into view',
        use: 'Set `typing: true` for a deliberate presenter cadence. Only plain-text blocks type; structured content still arrives as a motion reveal.' },
    ],
  },
  {
    group: 'Build options',
    where: 'command line — the output is always a book',
    items: [      { id: '--assets inline', what: 'Pictures packed INSIDE the HTML (default)', use: 'One file to email. Bigger, but nothing to lose.' },
      { id: '--assets folder', what: 'Pictures in an ./assets folder beside it', use: 'Picture-heavy material that stays in one place.' },
      { id: '--theme', what: 'Point at a different theme.json', use: 'Rebranding for another client.' },
      { id: '--watch', what: 'Rebuild whenever the lesson or its theme changes', use: 'Authoring. Leave it running, save, reload — about 85ms a rebuild. Each one is a fresh process, so nothing is carried over from the last.' },
      { id: '--quiet', what: 'Print only the result line', use: 'Scripted builds.' },
      { id: '--version', what: 'Which copy is this, and what layouts does it have',
        use: 'Answers "why have I not got the new layouts?" — the version plus every layout ' +
             'the installed copy actually knows about, read from its own code. Faster than ' +
             'working out whether you are running a checkout, a plugin cache or a zip.' },
    ],
  },
  {
    group: 'Authoring tools (run these, do not skip prep)',
    where: 'command line, before and after building',
    items: [
      { id: 'node scripts/prep.ts', what: 'Analyses raw content and says how to chunk it',
        use: 'ALWAYS run this before building. It measures what you cannot judge by reading — ' +
             'page lengths against real capacity, missing sections, headless pages — and gives ' +
             'the action for each. It reports; it never rewrites your words. --json for machine use.' },
      { id: 'node scripts/check.ts', what: 'The check suite',
        use: 'After any change to the kit. Each check is a bug that once shipped looking fine. ' +
             'The count is not quoted anywhere on purpose — it only ever drifts.' },
      { id: 'node dist/ink.mjs', what: 'The ink treatment, headless — for an assistant',
        use: 'The one command to run before putting any supplied picture in a book. Same operator ' +
             'as the studio with no browser and no install: reads JPEG or PNG, writes a ' +
             'transparent PNG to use with {.plate}. Presets --soft --drawn --engraved, and every ' +
             'number is a flag. Reach for the studio instead when a PERSON is choosing the look.' },
      { id: 'node dist/studio.mjs', what: 'The Ink Studio — makes artwork look drawn on the page',
        use: 'Before putting any supplied picture in a book. Writes output/ink-studio.html, ' +
             'one self-contained page needing no install: drop the artwork in, turn Line, Tone ' +
             'and Nib, and save a transparent PNG that carries only the ink, so the page own ' +
             'paper and grain read through it. Previews in this book real ink, so what you ' +
             'approve is what lands. Pass a theme path to draw in another book ink.' },
      { id: 'node scripts/gen-capabilities.ts', what: 'Regenerates CAPABILITIES.md from the manifest',
        use: 'After adding a feature. The build fails if the manifest is missing something the code has.' },
    ],
  },
  {
    group: 'Reader controls (built in, nothing to author)',
    where: 'present in every book',
    items: [
      { id: 'presenter-remote', what: 'Clicker support',
        use: 'PageDown/PageUp, arrows, Space, Enter and Backspace all step and turn. ' +
             'Most remotes send PageDown rather than arrows.' },
      { id: 'skip-reveals', what: 'Finish this page at once',
        use: '`End` lands every remaining block on the current page immediately. It does NOT ' +
             'jump to the end of the book — a presenter reaching for it wants out of an ' +
             'animation, not out of their place. `Home` riffles back to the first spread.' },
      { id: 'blackout', what: 'Blank the screen', use: 'The `b` or `.` key, as presenters expect.' },
      { id: 'riffle', what: 'Flick back to the first page', use: 'Bottom-left button; pages flash past rather than jumping.' },
      { id: 'close', what: 'Shut the book and lower the curtain', use: 'Bottom-right button or Escape.' },
      { id: 'resume', what: 'Reopens on the page you left', use: 'Automatic, per book, stored in the browser.' },
      { id: 'fullscreen', what: 'Fill the screen', use: 'The `f` key or F5.' },
      { id: 'tabs', what: 'Fore-edge section tabs', use: 'Generated from `>>` sections; each jumps to that section board.' },
      { id: 'ribbon', what: 'Bookmark to the furthest page reached', use: 'Automatic.' },
    ],
  },
  {
    group: 'Theme (theme.json)',
    where: 'colours, fonts and a11y — everything visual derives from here',
    items: [
      { id: 'colors.surface', what: 'The base dark tone', use: 'Everything else is derived from this unless overridden.' },
      { id: 'colors.accent', what: 'The brand accent', use: 'Rim light, rules, tabs, ribbon, highlighted words.' },
      { id: 'colors.secondary', what: 'The second brand colour', use: 'The stage curtain is derived from this.' },
      { id: 'colors.paper', what: 'The page stock', use: 'Warm light paper. Independent of the dark stage.' },
      { id: 'colors.curtain', what: 'Override the cloth colour', use: 'Only if the derived one is wrong; it is auto-raised to stay 3:1 clear of the void.' },
      { id: 'colors.sticky', what: 'Sticky note colour', use: 'Plus sticky_alt and sticky_third for the rotation.' },
      { id: 'fonts.display', what: 'Headings', use: 'Barlow Condensed ships embedded.' },
      { id: 'fonts.handwriting', what: 'Kickers, sticky notes, folios', use: 'Caveat ships embedded.' },
      { id: 'fonts.book_body', what: 'Page body text', use: 'A serif reads best on paper.' },
      { id: 'a11y.min_contrast', what: 'Contrast floor for text', use: 'Default 4.5. Colours are auto-corrected to meet it.' },
    ],
  },
]

/** Flat ids, for the drift check. */
export const CAPABILITY_IDS = CAPABILITIES.flatMap((g) => g.items.map((i) => i.id))
