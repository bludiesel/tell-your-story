#!/usr/bin/env node
import{createRequire as __cr}from"node:module";const require=__cr(import.meta.url);

// scripts/doctor.ts
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
var run = promisify(execFile);
var ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
var tool = (bundled, source) => {
  const b = join(ROOT, "dist", bundled);
  return existsSync(b) ? b : join(ROOT, source);
};
var kb = (n) => `${Math.round(n / 1024)} KB`;
async function main() {
  const argv = process.argv.slice(2);
  const asJson = argv.includes("--json");
  const input = argv.find((a) => !a.startsWith("-"));
  if (!input) {
    console.error("usage: node dist/doctor.mjs <lesson.md> [--json]");
    process.exit(1);
  }
  const lesson = resolve(input);
  const checks = [];
  const node = process.execPath;
  const dir = await mkdtemp(join(tmpdir(), "tys-doctor-"));
  const out = join(dir, "book.html");
  try {
    let prep = null;
    try {
      const { stdout } = await run(node, [tool("prep.mjs", "scripts/prep.ts"), lesson, "--json"]);
      prep = JSON.parse(stdout);
    } catch (e) {
      checks.push({
        name: "chunking",
        ok: false,
        detail: "prep could not read the lesson",
        fix: e.message.split("\n")[0] ?? ""
      });
    }
    if (prep) {
      const must = prep.findings.filter((f) => f.severity === "fix" || f.severity === "stop");
      const maybe = prep.findings.filter((f) => !(f.severity === "fix" || f.severity === "stop"));
      checks.push({
        name: "chunking",
        ok: must.length === 0,
        detail: must.length === 0 ? `${prep.pages.length} pages, nothing over capacity` : `${must.length} thing(s) to fix across ${prep.pages.length} pages`,
        fix: must.map((f) => `${f.where}: ${f.what}`).join("\n                ")
      });
      if (maybe.length > 0) {
        checks.push({
          name: "suggestions",
          ok: true,
          detail: `${maybe.length} thing(s) prep would consider \u2014 opinions, not defects`,
          fix: maybe.map((f) => `${f.where}: ${f.what}`).join("\n                ")
        });
      }
    }
    let built = false;
    try {
      await run(node, [tool("build.mjs", "src/build.ts"), lesson, out, "--quiet"]);
      const size = (await stat(out)).size;
      built = true;
      checks.push({ name: "build", ok: true, detail: `${kb(size)}, one standalone file` });
    } catch (e) {
      const msg = e.stdout ?? e.stderr ?? e.message;
      checks.push({
        name: "build",
        ok: false,
        detail: "the book did not build",
        fix: msg.trim().split("\n").slice(0, 6).join("\n                ")
      });
    }
    if (built) {
      try {
        const { stdout } = await run(node, [tool("motion.mjs", "scripts/motion.ts"), out, "--json"]);
        const m = JSON.parse(stdout);
        const presses = m.pages.reduce((n, p) => {
          const found = /(\d+) step/.exec(p.reveal);
          return n + (found ? Number(found[1]) : 0);
        }, 0);
        checks.push({
          name: "motion",
          ok: m.problems === 0,
          detail: `${m.pages.length} pages, ${presses} presses to walk it`,
          fix: m.pages.flatMap((p) => p.problems).join("\n                ")
        });
      } catch (e) {
        checks.push({
          name: "motion",
          ok: false,
          detail: "could not read the built book",
          fix: e.message.split("\n")[0] ?? ""
        });
      }
    }
    const failed = checks.filter((c) => !c.ok);
    if (asJson) {
      console.log(JSON.stringify({ ok: failed.length === 0, checks }, null, 2));
      process.exit(failed.length === 0 ? 0 : 1);
    }
    console.log("");
    for (const c of checks) {
      console.log(`  ${c.ok ? "\u2713" : "\u2717"} ${c.name.padEnd(14)}${c.detail}`);
      if (c.fix) for (const line of c.fix.split("\n")) console.log(`                ${line.trim()}`);
    }
    console.log("");
    console.log(failed.length === 0 ? "  Nothing is broken. Whether it is any GOOD is a question for a reader." : `  ${failed.length} thing(s) to fix before this ships.`);
    console.log("");
    process.exit(failed.length === 0 ? 0 : 1);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
await main();
