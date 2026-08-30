#!/usr/bin/env node
import{createRequire as __cr}from"node:module";const require=__cr(import.meta.url);

// scripts/prep.ts
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
var WORDS_COMFORTABLE = 130;
var WORDS_CROWDED = 170;
var WORDS_THIN = 35;
var WORDS_PER_IMAGE = 55;
var WORDS_PER_TABLE_ROW = 12;
function topBlocks(chunk) {
  const lines = chunk.split("\n");
  const items = [];
  let fence = null;
  let fenceMarker;
  let buf = [];
  const STEP = /\{[^}]*\.(step-first|step-last|with-previous)[^}]*\}[ \t]*$/m;
  const flush = (kind, marker) => {
    const text = buf.join("\n").trim();
    if (text) items.push({ kind, text, marker: marker ?? STEP.exec(text)?.[1] });
    buf = [];
  };
  for (const line of lines) {
    const open = /^:::(\w+)/.exec(line);
    if (fence === null && open) {
      flush("prose");
      fence = open[1];
      fenceMarker = STEP.exec(line)?.[1];
      continue;
    }
    if (fence !== null && /^:::\s*$/.test(line)) {
      flush(fence, fenceMarker);
      fence = null;
      fenceMarker = void 0;
      continue;
    }
    if (fence === null && /^(>>?\s|#{1,6}\s)/.test(line)) continue;
    if (fence === null && line.trim() === "") {
      flush("prose");
      continue;
    }
    buf.push(line);
  }
  flush(fence ?? "prose", fenceMarker);
  return items;
}
function moves(chunk) {
  const blocks = topBlocks(chunk);
  const label = (b) => `${b.kind}: ${b.text.replace(/\{[^}]*\}/g, "").replace(/\s+/g, " ").replace(/[*_`|]/g, "").trim().slice(0, 38)}`;
  const order2 = [
    ...blocks.filter((b) => b.marker === "step-first"),
    ...blocks.filter((b) => b.marker !== "step-first" && b.marker !== "step-last"),
    ...blocks.filter((b) => b.marker === "step-last")
  ];
  const out = [];
  for (const b of blocks) {
    if (!b.marker || b.marker === "with-previous") continue;
    const from = blocks.indexOf(b);
    const to = order2.indexOf(b);
    if (from === to) {
      out.push(`{.${b.marker}} on "${label(b)}" changes nothing \u2014 it is already ${b.marker === "step-first" ? "the first" : "the last"} block. Drop the marker.`);
    } else if (b.marker === "step-first") {
      out.push(`{.step-first} pulls "${label(b)}" ahead of ${from} block(s) written before it, so it is what the reader meets on the turn.`);
    } else {
      out.push(`{.step-last} pushes "${label(b)}" behind ${blocks.length - 1 - from} block(s) written after it, so it lands once the argument is finished.`);
    }
  }
  const first = blocks[0];
  if (first?.marker === "with-previous") {
    out.push(`{.with-previous} on "${label(first)}" has nothing above it to join. Drop the marker.`);
  }
  return out;
}
function sequence(chunk) {
  const items = topBlocks(chunk);
  const LAST = /* @__PURE__ */ new Set(["takeaway", "big"]);
  const EARLY = /* @__PURE__ */ new Set(["warning"]);
  const ATTACH = /* @__PURE__ */ new Set(["sticky"]);
  const described = items.map((it) => {
    if (it.kind === "prose" && /^\s*!\[/.test(it.text)) return { ...it, kind: "image" };
    if (it.kind === "prose" && /^\s*\|/.test(it.text)) return { ...it, kind: "table" };
    return it;
  });
  const steps = [];
  const push = (kind, text, why, marker) => steps.push({
    n: 0,
    what: `${kind}: ${text.replace(/\s+/g, " ").replace(/[*_`]/g, "").trim().slice(0, 46)}`,
    why,
    marker
  });
  const early = described.filter((d) => EARLY.has(d.kind));
  const late = described.filter((d) => LAST.has(d.kind));
  const middle = described.filter((d) => !EARLY.has(d.kind) && !LAST.has(d.kind));
  middle.slice(0, 1).forEach((d) => push(d.kind, d.text, "opens the page \u2014 arrives with the turn, so the spread is never blank"));
  early.forEach((d) => push(
    d.kind,
    d.text,
    "a warning should not wait behind the setup",
    described.indexOf(d) > 1 ? ".step-first" : void 0
  ));
  middle.slice(1).forEach((d, i) => {
    const prev = middle[i];
    if (ATTACH.has(d.kind)) {
      push(d.kind, d.text, "an annotation on the block above, not a beat of its own", ".with-previous");
    } else if (prev?.kind === "image" && words(d.text) <= 22) {
      push(d.kind, d.text, "short line under a picture \u2014 reads as its caption", ".with-previous");
    } else if (d.kind === "diagram") {
      push(d.kind, d.text, "lands after the words that set it up, so it answers a question already asked");
    } else {
      push(d.kind, d.text, "follows in the order it was written");
    }
  });
  late.forEach((d) => push(
    d.kind,
    d.text,
    "the thing to remember lands last, after the argument for it",
    described.indexOf(d) < described.length - 1 ? ".step-last" : void 0
  ));
  steps.forEach((s, i) => {
    s.n = i + 1;
  });
  return steps;
}
var words = (s) => s.split(/\s+/).filter(Boolean).length;
function analyse(body2) {
  const chunks = body2.split(/^\s*---\s*$/m).map((c) => c.trim()).filter(Boolean);
  const pages2 = [];
  const findings2 = [];
  chunks.forEach((chunk, i) => {
    const section = chunk.match(/^>>\s*(.+)$/m)?.[1]?.trim();
    const eyebrow = chunk.match(/^>(?!>)\s*(.+)$/m)?.[1]?.trim();
    const heading = chunk.match(/^#{1,3}\s+(.+)$/m)?.[1]?.trim();
    const blocks = [...chunk.matchAll(/^:::(\w+)/gm)].map((m) => m[1]);
    const images = [...chunk.matchAll(/!\[[^\]]*\]\([^)]+\)/g)].length;
    const tableRows = chunk.split("\n").filter((l) => /^\s*\|.*\|\s*$/.test(l)).length;
    const prose = chunk.replace(/^>>?.*$/gm, "").replace(/^#{1,6}.*$/gm, "").replace(/^:::.*$/gm, "").replace(/!\[[^\]]*\]\([^)]+\)/g, "").replace(/^\s*\|.*\|\s*$/gm, "");
    const w = words(prose);
    const budget = w + images * WORDS_PER_IMAGE + tableRows * WORDS_PER_TABLE_ROW;
    pages2.push({
      n: i + 1,
      section,
      eyebrow,
      heading,
      words: w,
      budget,
      images,
      tableRows,
      blocks,
      steps: sequence(chunk),
      moves: moves(chunk),
      raw: chunk
    });
  });
  for (const p of pages2) {
    if (p.budget > WORDS_CROWDED) {
      findings2.push({
        where: `page ${p.n}${p.heading ? ` \u2014 "${p.heading}"` : ""}`,
        severity: "fix",
        what: `about ${p.budget} words of content; a page holds ~${WORDS_COMFORTABLE} comfortably`,
        do: "Split it. Find the second idea and start a new page there with its own heading \u2014 do not shrink the type, a workbook is read at arm's length."
      });
    } else if (p.budget < WORDS_THIN && p.images === 0 && p.blocks.length === 0) {
      findings2.push({
        where: `page ${p.n}${p.heading ? ` \u2014 "${p.heading}"` : ""}`,
        severity: "consider",
        what: `only ~${p.budget} words and nothing else on the page`,
        do: "Either merge it into a neighbour, or give it something to carry \u2014 a :::sticky aside, a picture, or a :::takeaway if it is the point of the section."
      });
    }
    const marks = (p.raw.match(/^>>\s*\S/gm) ?? []).length;
    if (marks > 1) {
      findings2.push({
        where: `page ${p.n}${p.heading ? ` \u2014 "${p.heading}"` : ""}`,
        severity: "fix",
        what: `${marks} section markers on one page`,
        do: "A page opens ONE section. The extra `>>` lines have nowhere to go and print as body text. Put a `---` before each one so it gets its own page, or delete it."
      });
    }
    const headless = /* @__PURE__ */ new Set(["bleed", "colophon", "big", "quote"]);
    const soleTakeaway = p.blocks.length === 1 && p.blocks[0] === "takeaway";
    const wantsNoBand = p.blocks.some((b) => headless.has(b)) || soleTakeaway;
    if (!p.heading && !wantsNoBand) {
      findings2.push({
        where: `page ${p.n}`,
        severity: "fix",
        what: "no heading, so the page has no header band and no entry in the reader's sense of place",
        do: "Add a `## Heading`. It is lifted into the band and removed from the body, so it costs no space."
      });
    }
    const stepCount = p.steps.filter((s) => !/with-previous/.test(s.marker ?? "")).length;
    if (stepCount > 5) {
      findings2.push({
        where: `page ${p.n}${p.heading ? ` \u2014 "${p.heading}"` : ""}`,
        severity: "consider",
        what: `${stepCount} things arrive one press at a time; five is the ceiling`,
        do: "Either move a block to the next page, or mark the ones that belong together with {.with-previous} so they arrive as one beat \u2014 a caption under a picture is not a beat of its own."
      });
    }
    for (const m of p.moves) {
      findings2.push({
        where: `page ${p.n}${p.heading ? ` \u2014 "${p.heading}"` : ""}`,
        severity: /Drop the marker/.test(m) ? "fix" : "consider",
        what: m,
        do: /Drop the marker/.test(m) ? "Remove it. A marker that changes nothing is a claim about the page that is not true, and the next person to read the source will trust it." : "Confirm that is the reading you want. If it is not, remove the marker and the block arrives where you wrote it."
      });
    }
    if (p.tableRows > 12) {
      findings2.push({
        where: `page ${p.n}`,
        severity: "fix",
        what: `a ${p.tableRows}-row table on one page`,
        do: "Split the table across pages, or cut it to the rows that matter. A printed page cannot scroll."
      });
    }
  }
  const sections = pages2.filter((p) => p.section);
  if (sections.length === 0 && pages2.length > 4) {
    findings2.push({
      where: "the document",
      severity: "fix",
      what: `${pages2.length} pages and no sections at all`,
      do: "Add `>> Section name` to the first page of each theme. Each one becomes a hard divider board and a fore-edge tab \u2014 without them the reader has no way to navigate and no sense of how the material is organised."
    });
  } else if (sections.length > pages2.length / 3) {
    findings2.push({
      where: "the document",
      severity: "fix",
      what: `${sections.length} sections across only ${pages2.length} pages`,
      // The test is a RATIO, so the advice has to be phrased as one. It used to
      // end "three to six sections suits a workbook", which is an absolute
      // range — and flagging five sections while recommending three to six
      // leaves an author with no idea what they are supposed to change.
      do: `Too many for the length. Every \`>>\` inserts a physical divider board \u2014 two faces of hard stock \u2014 so at this rate the reader turns past nearly as many boards as pages of content. Aim for a section every four pages or more: at ${pages2.length} pages that is about ${Math.max(1, Math.floor(pages2.length / 4))}. Either merge two sections, or use \`>\` for a page eyebrow where you do not mean a new section.`
    });
  }
  const withStickies = pages2.filter((p) => p.blocks.includes("sticky")).length;
  if (withStickies === 0 && pages2.length > 3) {
    findings2.push({
      where: "the document",
      severity: "consider",
      what: "no sticky notes anywhere",
      do: "A `:::sticky` is an aside in a human voice \u2014 the thing a trainer would say out loud but would not put in the manual. One or two across a workbook lift it out of textbook register. Do not put one on every page."
    });
  }
  const emphasis = pages2.filter((p) => p.blocks.some((b) => ["warning", "tip", "takeaway"].includes(b))).length;
  if (emphasis === 0 && pages2.length > 3) {
    findings2.push({
      where: "the document",
      severity: "consider",
      what: "every page is flat body copy \u2014 no tips, warnings or takeaways",
      do: 'Look for sentences that are already doing one of those jobs: a "never do X" is a :::warning, a "the one thing to remember" is a :::takeaway. Promote them rather than inventing new ones.'
    });
  }
  {
    const faceOf = /* @__PURE__ */ new Map();
    let face = 2;
    if (sections.length >= 2) face += 2;
    const seenSection = /* @__PURE__ */ new Set();
    pages2.forEach((p) => {
      if (p.section && !seenSection.has(p.section)) {
        seenSection.add(p.section);
        if (face % 2 === 1) face += 1;
        face += 2;
      }
      faceOf.set(p.n, face);
      face += 1;
    });
    const spreadOf = (n) => Math.floor((faceOf.get(n) ?? 0) / 2) + 1;
    for (const kind of ["compare", "timeline"]) {
      const users = pages2.filter((p) => p.blocks.includes(kind));
      for (let i = 0; i < users.length; i += 2) {
        const a = users[i], b = users[i + 1];
        if (!b) {
          findings2.push({
            where: `page ${a.n}${a.heading ? ` \u2014 "${a.heading}"` : ""}`,
            severity: "fix",
            what: `a lone :::${kind}, and it needs a facing page to work`,
            do: kind === "compare" ? "Add the other half on the next page \u2014 `:::compare before` and `:::compare after` are one argument split across a spread." : "Continue the rail on the next page with a second `:::timeline`, so it reads as one line crossing the fold."
          });
        } else if (spreadOf(a.n) !== spreadOf(b.n)) {
          findings2.push({
            where: `pages ${a.n} and ${b.n}`,
            severity: "fix",
            what: `this :::${kind} pair lands on spreads ${spreadOf(a.n)} and ${spreadOf(b.n)}, so the two halves never face each other`,
            do: "Move one page, or add a page before the pair, so both land on the same spread. Re-run prep afterwards \u2014 inserting a page shifts every pair after it."
          });
        }
      }
    }
    pages2.forEach((p) => {
      p.spread = spreadOf(p.n);
    });
  }
  const finalFace = (() => {
    let f = 2;
    if (sections.length >= 2) f += 2;
    const seen = /* @__PURE__ */ new Set();
    for (const p of pages2) {
      if (p.section && !seen.has(p.section)) {
        seen.add(p.section);
        if (f % 2 === 1) f += 1;
        f += 2;
      }
      f += 1;
    }
    return f;
  })();
  if (finalFace % 2 === 1) {
    findings2.push({
      where: "the document",
      severity: "consider",
      what: "the page count is odd, so the book ends on a half-leaf and a blank is appended",
      do: "Add a closing page \u2014 a :::big statement or a summary \u2014 so the last thing the reader sees is deliberate rather than empty."
    });
  }
  return { pages: pages2, findings: findings2 };
}
var argv = process.argv.slice(2);
var wantJson = argv.includes("--json");
var input = argv.find((a) => !a.startsWith("-"));
if (!input) {
  console.log(`
  Analyse content BEFORE building, and say how to shape it.

    node scripts/prep.ts <input.md> [--json]

  Reports what a model cannot reliably judge by reading: page lengths against
  measured capacity, missing or excessive sections, pages with no heading, and
  where the kit's blocks are going unused. It never rewrites your words.
`);
  process.exit(1);
}
var source = await readFile(resolve(input), "utf8").catch(() => {
  console.error(`
  Error: cannot read ${input}
`);
  process.exit(1);
});
var stripComments = (s) => s.replace(/<!--[\s\S]*?-->/g, "");
var body = stripComments(
  source.startsWith("---") ? source.slice(source.indexOf("\n---", 3) + 4) : source
);
var { pages, findings } = analyse(body);
if (wantJson) {
  console.log(JSON.stringify({ pages, findings }, null, 2));
  process.exit(findings.some((f) => f.severity === "stop") ? 1 : 0);
}
var bar = (n) => {
  const filled = Math.min(Math.round(n / WORDS_CROWDED * 20), 20);
  return "\u2588".repeat(filled) + "\xB7".repeat(20 - filled);
};
console.log(`
  ${input}
`);
console.log(`  page  fill                  words  extras`);
for (const p of pages) {
  const extras = [
    p.section ? `SECTION: ${p.section}` : "",
    p.images ? `${p.images} pic` : "",
    p.tableRows ? `${p.tableRows}-row table` : "",
    ...p.blocks.map((b) => `:::${b}`)
  ].filter(Boolean).join("  ");
  console.log(
    `  ${String(p.n).padStart(4)}  ${bar(p.budget)}  ${String(p.budget).padStart(5)}  ${extras}`
  );
}
var paced = pages.filter((p) => p.steps.some((s) => s.marker));
if (paced.length > 0) {
  console.log(`
  reveal order \u2014 ${paced.length} page(s) where it should not be document order:
`);
  console.log("  Blocks arrive one press at a time. Add the marker in braces after the");
  console.log("  block, e.g.  :::takeaway {.step-last}  \u2014 this is a proposal from the");
  console.log("  block TYPES; you are reading the meaning, so overrule it where it is wrong.\n");
  for (const p of paced) {
    console.log(`  page ${p.n}${p.heading ? ` \u2014 "${p.heading}"` : ""}`);
    for (const s of p.steps) {
      const mark = s.marker ? `  {${s.marker}}` : "";
      console.log(`    ${s.n}. ${s.what}${mark}`);
      console.log(`       ${s.why}`);
    }
    console.log("");
  }
}
var order = { stop: 0, fix: 1, consider: 2 };
findings.sort((a, b) => order[a.severity] - order[b.severity]);
if (findings.length === 0) {
  console.log("\n  Nothing to flag \u2014 this is well chunked. Build it.\n");
} else {
  console.log(`
  ${findings.length} thing(s) to look at:
`);
  for (const f of findings) {
    const tag = f.severity === "stop" ? "STOP" : f.severity === "fix" ? "FIX " : "MAYBE";
    console.log(`  ${tag}  ${f.where}`);
    console.log(`        ${f.what}`);
    console.log(`        \u2192 ${f.do}
`);
  }
}
