#!/usr/bin/env node
/**
 * gen-capabilities.ts — write CAPABILITIES.md from the manifest.
 *
 * The catalogue an assistant reads is GENERATED, never hand-written, so it
 * cannot drift from `src/capabilities.ts`. And `check.ts` proves the manifest
 * itself covers everything the code implements. Two links, both mechanical.
 */
import { writeFile } from 'node:fs/promises'

import { CAPABILITIES } from '../src/capabilities.ts'

let out = '<!-- GENERATED from src/capabilities.ts by scripts/gen-capabilities.ts. Do not edit. -->\n\n'
out += '# What this kit can do\n\nEvery feature, with when to use it. This file is GENERATED from\n'
out += '`src/capabilities.ts`, and `scripts/check.ts` fails the build if the code\n'
out += 'implements something the manifest does not list — so nothing here can go stale\n'
out += 'and nothing in the code can stay hidden.\n'

for (const g of CAPABILITIES) {
  out += `\n## ${g.group}\n\n_${g.where}_\n\n| | What it is | When to use it |\n|---|---|---|\n`
  for (const i of g.items) out += `| \`${i.id}\` | ${i.what} | ${i.use} |\n`
  for (const i of g.items.filter((x) => x.example)) out += `\n\`\`\`markdown\n${i.example}\n\`\`\`\n`
}

await writeFile(new URL('../CAPABILITIES.md', import.meta.url), out)
console.log(`CAPABILITIES.md — ${CAPABILITIES.reduce((n, g) => n + g.items.length, 0)} capabilities`)
