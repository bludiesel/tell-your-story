/**
 * fonts.ts — put the typefaces INSIDE the file.
 *
 * WHY THIS EXISTS
 * The book declared `--font-hand: 'Caveat', 'Bradley Hand', cursive` and shipped
 * no font data at all: zero `@font-face` rules. Caveat is a Google font that is
 * not installed by default and Bradley Hand is macOS-only, so the whole
 * handwritten character of the design held together on the author's Mac and
 * collapsed to **Comic Sans** on a client's Windows laptop. Headings fell from
 * Barlow Condensed to Arial Narrow the same way.
 *
 * A white-label kit whose typography depends on what the viewer happens to have
 * installed is not white-label. So the faces travel with the file.
 *
 * WHAT IT COSTS, MEASURED
 *   raw woff2                 149.6 KB
 *   subset + single weight     67.8 KB   (55% saved)
 *
 * Two things got that back. Caveat ships as a VARIABLE font carrying every
 * weight from 400 to 700, so it is instanced down to one; and all three faces
 * are subset to Latin plus the punctuation actually used. Both are done at
 * vendoring time by `fonttools` — a dev-only tool that never reaches the skill.
 * See `scripts/vendor-fonts.sh`.
 *
 * LICENCE: Caveat and Barlow Condensed are both SIL Open Font License, which
 * permits embedding and redistribution. Nothing here is a licensed brand face —
 * that matters because this kit is meant to be handed to other people.
 */

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

/** A face we ship, and the family name the CSS refers to. */
interface Face {
  file: string
  family: string
  weight: number
  style: string
}

const FACES: Face[] = [
  { file: 'Caveat.subset.woff2', family: 'Caveat', weight: 500, style: 'normal' },
  { file: 'BarlowCondensed-SemiBold.subset.woff2', family: 'Barlow Condensed', weight: 600, style: 'normal' },
  { file: 'BarlowCondensed-Bold.subset.woff2', family: 'Barlow Condensed', weight: 700, style: 'normal' },
]

/**
 * Build the `@font-face` block, with the font data inlined as base64.
 *
 * `font-display: block` rather than `swap`: the type here is decorative and
 * structural — a handwritten kicker rendered in the fallback and then swapped
 * mid-read is more distracting than a brief blank, and because the data is in
 * the same file there is no network wait to cover.
 */
/**
 * The first family named in a CSS font stack, unquoted.
 *
 * `"'Owners Text', system-ui, sans-serif"` -> `Owners Text`. The theme states
 * its display face once, in the stack the CSS actually uses, so a brand face
 * cannot be declared under one name and embedded under another.
 */
function leadFamily(stack: string): string {
  return (stack.split(',')[0] ?? '').trim().replace(/^['"]|['"]$/g, '')
}

/**
 * Faces a THEME ships on top of the kit's own.
 *
 * A brand face belongs to one theme, not to the kit: embedding Owners Text in
 * every neutral book would add 38KB to files that never render a glyph of it.
 * `display_files` has been in the theme type since it was written and was read
 * by nothing — declared support that silently did nothing, which is worse than
 * no support, because a theme could name its font files and be ignored without
 * an error.
 */
function themeFaces(theme?: ThemeFonts): Face[] {
  const files = theme?.display_files
  if (!files?.length || !theme?.display) return []
  const family = leadFamily(theme.display)
  if (!family) return []
  return files.map(([file, weight]) => ({ file, family, weight, style: 'normal' }))
}

export interface ThemeFonts {
  display?: string
  display_files?: Array<[string, number]>
}

export async function fontFaceCss(skillRoot: string, themeFonts?: ThemeFonts): Promise<string> {
  const dir = join(skillRoot, 'assets', 'fonts')
  const blocks: string[] = []

  for (const face of [...FACES, ...themeFaces(themeFonts)]) {
    let bytes: Buffer
    try {
      bytes = await readFile(join(dir, face.file))
    } catch {
      // A missing face must not break the build — the CSS stack still lists
      // system fallbacks. But it IS worth saying out loud, because the failure
      // is otherwise invisible until someone opens the file on another machine.
      console.warn(`  ! font not vendored: ${face.file} — run scripts/vendor-fonts.sh`)
      continue
    }
    blocks.push(
      `@font-face{font-family:'${face.family}';font-style:${face.style};` +
      `font-weight:${face.weight};font-display:block;` +
      `src:url(data:font/woff2;base64,${bytes.toString('base64')}) format('woff2')}`,
    )
  }
  return blocks.join('\n')
}

/** Which families we actually ship — used by the build check. */
export const EMBEDDED_FAMILIES = [...new Set(FACES.map((f) => f.family))]
