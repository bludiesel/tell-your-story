/**
 * theme.ts — brand colours, derived and contrast-checked.
 *
 * A TypeScript port of learn-kit's Python colour engine. `theme.json` holds a
 * handful of colours; everything else is derived, and any colour used as text
 * on the light background is darkened automatically until it clears WCAG AA.
 * That way an author can pick a pretty accent without discovering later that
 * nobody can read it.
 */

import { readFile } from 'node:fs/promises'

import { checkMarkUri, circleMarkUri, crossMarkUri, grainUri } from './svg.ts'

export interface ThemeFile {
  name?: string
  brand?: Record<string, string>
  colors?: Record<string, string>
  /** The spacing scale and the four page margins. */
  space?: Record<string, string>
  /** The type scale. Absolute units — see `scaleCss` for why. */
  type?: Record<string, string>
  /** Durations and easings. */
  motion?: Record<string, string | number>
  fonts?: {
    display?: string
    display_files?: Array<[string, number]>
    body?: string
    mono?: string
    /** Serif reading face for the flipbook — a book is not read in UI sans. */
    book_body?: string
    /** Handwritten accents: kickers, folios, marginalia. */
    handwriting?: string
  }
  a11y?: { enforce?: boolean; min_contrast?: number }
}

// ── colour maths ─────────────────────────────────────────────────────────────

const hexToRgb = (h: string): [number, number, number] => {
  let s = h.replace('#', '')
  if (s.length === 3) s = [...s].map((c) => c + c).join('')
  return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)]
}

const rgbToHex = (rgb: [number, number, number]) =>
  '#' + rgb.map((c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0')).join('').toUpperCase()

export const mix = (a: string, b: string, t: number): string => {
  const [ra, ga, ba] = hexToRgb(a)
  const [rb, gb, bb] = hexToRgb(b)
  return rgbToHex([ra + (rb - ra) * t, ga + (gb - ga) * t, ba + (bb - ba) * t])
}

export const darken = (h: string, t: number) => mix(h, '#000000', t)
export const lighten = (h: string, t: number) => mix(h, '#FFFFFF', t)
export const rgbTriple = (h: string) => hexToRgb(h).join(',')

const channel = (c: number) => {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

export const luminance = (h: string): number => {
  const [r, g, b] = hexToRgb(h)
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

/** WCAG 2.1 contrast ratio, 1.0 … 21.0. */
export const contrast = (fg: string, bg: string): number => {
  const l1 = luminance(fg)
  const l2 = luminance(bg)
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

/** Step `fg` toward black (or white) until it clears `target` against `bg`. */
export function accessibleOn(fg: string, bg: string, target = 4.5, steps = 40): string {
  if (contrast(fg, bg) >= target) return fg
  const toward = luminance(bg) > 0.5 ? '#000000' : '#FFFFFF'
  let best = fg
  let bestRatio = contrast(fg, bg)
  for (let i = 1; i <= steps; i++) {
    const cand = mix(fg, toward, i / steps)
    const ratio = contrast(cand, bg)
    if (ratio > bestRatio) { best = cand; bestRatio = ratio }
    if (ratio >= target) return cand
  }
  return best
}

/**
 * Raise `colour` until it is clearly distinguishable from `bg`.
 *
 * Not `accessibleOn`: that steps toward white, which washes the hue out and
 * would turn a brand-navy curtain into grey gauze. Scaling the channels instead
 * keeps the hue exactly and reads as the SAME cloth under more light — which is
 * what a stage actually does to fabric.
 *
 * 3:1 is the accepted floor for telling two non-text surfaces apart. The old
 * curtain sat at 1.52:1 against its background, which is why it was invisible.
 */
export function separateFrom(colour: string, bg: string, target = 3, steps = 60): string {
  if (contrast(colour, bg) >= target) return colour
  const [r, g, b] = hexToRgb(colour)
  let best = colour
  for (let i = 1; i <= steps; i++) {
    const k = 1 + (i / steps) * 2.4
    const cand = rgbToHex([r * k, g * k, b * k])
    if (contrast(cand, bg) >= target) return cand
    best = cand
  }
  return best
}

/**
 * Lift a fold shadow until the cloth out-contrasts its own folds.
 *
 * The failure this prevents is subtler than "too dark": when the folds INSIDE
 * a curtain separate from each other more than the curtain separates from the
 * room behind it, the eye reads stripes on a dark field rather than a lit
 * fabric. Measured on the palette that shipped that bug: cloth-on-void 1.52:1
 * while the folds sat at 2.71:1.
 *
 * Lightens toward the void rather than toward white, so the shadow stays the
 * same colour of dark — the fold is less deep, not less coloured. Returns the
 * shadow untouched when the cloth already wins, which is the common case.
 */
function shallowerThan(fold: string, lit: string, voidColour: string, steps = 40): string {
  const target = contrast(lit, voidColour)
  let out = fold
  for (let i = 0; i <= steps; i++) {
    if (contrast(lit, out) < target) return out
    out = mix(fold, voidColour, (i + 1) / steps)
  }
  return out
}

// ── the derived palette ──────────────────────────────────────────────────────

export interface Palette extends Record<string, string> {}

export const DEFAULT_THEME: ThemeFile = {
  name: 'Teal Arc',
  brand: { name: 'Your Brand', footer: '' },
  colors: {
    surface: '#0F2733',
    accent: '#35C0B6',
    secondary: '#3E7FB8',
    text_on_dark: '#EEF3F9',
  },
  fonts: {
    display: "'Barlow Condensed', 'Arial Narrow', 'Liberation Sans Narrow', 'Roboto Condensed', system-ui, sans-serif",
    body: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    mono: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
  },
  space: {
    1: '.5rem', 2: '.75rem', 3: '1rem', 4: '1.5rem', 5: '2rem', 6: '3rem',
    page_x: '4.5rem', page_top: '3rem', page_bottom: '4rem',
  },
  type: {
    band: '3rem', h1: '3.2rem', h2: '2.4rem', h3: '1.75rem',
    body: '1.55rem', hand: '2.1rem', statement: '4.6rem', line_height: '1.55',
  },
  motion: {
    ease_paper: 'cubic-bezier(.16, 1, .3, 1)',
    ease_cloth: 'cubic-bezier(.5, 0, .2, 1)',
    curtain: '2200ms', float: '900ms', open: '1100ms', flip: '720ms',
    riffle_page: '150ms', reveal: '520ms', reveal_stagger: '140ms',
    write_speed_ms_per_char: 34,
  },
  a11y: { enforce: true, min_contrast: 4.5 },
}

export function buildPalette(theme: ThemeFile): Palette {
  const c = theme.colors ?? {}
  const enforce = theme.a11y?.enforce ?? true
  const target = theme.a11y?.min_contrast ?? 4.5

  const surface = c.surface ?? '#1C2833'
  const surfaceAlt = c.surface_alt ?? lighten(surface, 0.06)
  const accent = c.accent ?? '#E0A33E'
  const secondary = c.secondary ?? mix(surface, '#4A7FB5', 0.75)
  const white = c.white ?? '#FFFFFF'

  const text = c.text_on_dark ?? '#EEF3F9'
  const textOnLight = c.text_on_light ?? surface
  const textMuted = c.text_on_dark_muted ?? mix(text, surface, 0.42)
  // THE VOID. Near-black, and deliberately NOT a darkened `surface`.
  //
  // Measured on the previous derivation: void #10171E against cloth #213951 gave
  // 1.52:1, and cloth against surface 1.26:1 — while the FOLDS inside the cloth
  // sat at 2.71:1. The folds had nearly twice the contrast the cloth had against
  // its own background, so the eye read stripes but no fabric. The cause was
  // that every dark tone descended from one navy and differed only by how much
  // black was mixed in: siblings, not opposites.
  //
  // A stage works the other way round — a genuinely black void with a LIT cloth
  // in front of it. So the void goes almost to black, with a faint cool cast so
  // it still reads as a space rather than as switched-off pixels.
  const deep = c.surface_deep ?? mix(mix(surface, '#000000', 0.9), '#04070E', 0.5)
  const lightBg = c.surface_light ?? mix(surface, white, 0.94)

  const accentBright = c.accent_bright ?? lighten(accent, 0.1)
  const secondaryBright = c.secondary_bright ?? lighten(secondary, 0.22)
  const fix = (col: string, bg: string) => (enforce ? accessibleOn(col, bg, target) : col)
  // A pinned value is a design decision and outranks derivation — but it is
  // still measured, so pinning a colour cannot silently smuggle in one nobody
  // can read. Pin something illegible and it gets corrected and reported.
  const pinned = (explicit: string | undefined, derived: string, bg: string) =>
    fix(explicit ?? derived, bg)

  // Paper for the flipbook. A book is read on warm stock, not on the app's
  // dark surface, so these are their own tokens — tinted toward the accent so
  // the paper still belongs to the brand rather than being generic cream.
  const paper = c.paper ?? mix('#FAF6EC', accent, 0.04)
  const paper2 = c.paper_alt ?? darken(paper, 0.05)
  const ink = c.ink ?? mix(surface, '#000000', 0.12)

  // The stage cloth. Derived from `secondary` — the brand's second colour —
  // rather than from `surface`, because a curtain built out of the app's own
  // near-neutral background renders as an almost-black rectangle and a rebrand
  // makes no visible difference to it. Pulled dark so it still reads as heavy
  // fabric, but saturated enough that the brand is unmistakably on stage.
  // THE CLOTH — LIT, not shadowed. Previously `mix(secondary, black, 0.55)`,
  // which produced fabric darker than the room it hung in. It is now only
  // slightly deepened from the brand's secondary, then RAISED until it clears
  // 3:1 against the void (the accepted floor for telling two non-text surfaces
  // apart). `separateFrom` does the raising by measurement, so a rebrand to a
  // very dark secondary cannot quietly collapse the stage back into navy soup.
  const cloth = c.curtain ?? separateFrom(mix(secondary, '#000000', 0.18), deep, 3)

  return {
    surface, surfaceAlt, deep, accent, accentBright, secondary, secondaryBright, white,
    text, textMuted,
    textFaint: mix(text, surface, 0.66),

    // ── the stage ────────────────────────────────────────────────────────
    // WARM LIGHT, COOL SHADOW. This is the oldest trick in stage and film
    // lighting and it is doing most of the work here: the lit face of the cloth
    // is pulled toward the accent, the folds toward a cold blue-black. Two
    // tones of the same hue read as flat; a warm/cool pair reads as lit.
    curtainCloth: cloth,
    // Restrained on purpose. At lighten(.26) the whole upper half of the cloth
    // washed out to a pale sky and stopped reading as heavy fabric — the base
    // colour already carries the 3.48:1 separation, so the highlight only has
    // to shape the folds, not add more light.
    // PINNED, BUT STILL MEASURED — the same rule as `accent_ink` and
    // `link_on_paper` above: a design decision outranks derivation, and it does
    // not outrank a measurement.
    //
    // The lit crest is what the eye reads as "there is cloth there" — the base
    // colour is the shadowed trough. Four of the seven ported palettes pin a
    // crest that scores under 3:1 against their own void (Plum 2.04, Oxblood
    // 2.06, Tobacco 2.21, Green 2.70) because they were authored for a CSS
    // gradient curtain rather than a lit shader, and the shader draws the same
    // colour darker. Shipped as pinned they would each render the invisible
    // curtain this kit already fixed once.
    //
    // `separateFrom` raises by SCALING the channels, so the hue survives and
    // the cloth reads as the same fabric under more light — which is what a
    // stage actually does. A crest already clearing the bar is returned
    // untouched, so the shipped Teal Arc keeps the design's exact #1C6B72.
    curtainClothLit: separateFrom(c.curtain_lit ?? mix(lighten(cloth, 0.13), accent, 0.14), deep, 3),
    // The deep fold is measured against the CREST, not fixed, for the same
    // reason: the whole failure mode is folds out-contrasting the cloth against
    // its own background, which makes the eye read stripes on a dark field
    // rather than lit fabric. Raising a crest to clear the void raises the fold
    // contrast with it — Green ended up failing by 0.01 that way, having passed
    // before the crest was corrected. So the fold is lifted until the cloth
    // wins its own comparison, and a palette that already reads as fabric is
    // left exactly as it is.
    curtainClothDeep: shallowerThan(
      c.curtain_deep ?? mix(darken(cloth, 0.62), '#050B14', 0.35),
      separateFrom(c.curtain_lit ?? mix(lighten(cloth, 0.13), accent, 0.14), deep, 3),
      deep,
    ),
    // The rim: where the gathered edge catches the house lights. This is what
    // actually separates the swag from the void — an edge, not a fill.
    curtainRim: c.curtain_rim ?? mix(accentBright, white, 0.15),
    // Haze hanging in the void, so the space behind has depth instead of being
    // switched-off pixels. Sits between the void and the cloth in luminance.
    stageHaze: c.stage_haze ?? mix(deep, secondary, 0.3),
    // The pool of light the book stands in.
    stagePool: c.stage_pool ?? mix(deep, accent, 0.16),

    // Sticky notes. Derived from the accent so they belong to the brand, but
    // pushed toward yellow-green and heavily lightened — a sticky note that is
    // simply "the brand colour" reads as a UI chip, not as a thing someone
    // stuck on the page. Ink is dark enough to stay legible on all three.
    sticky1: c.sticky ?? mix(lighten(accent, 0.62), '#FFF9A8', 0.5),
    sticky2: c.sticky_alt ?? mix(lighten(accent, 0.58), '#BFEFCB', 0.55),
    sticky3: c.sticky_third ?? mix(lighten(accent, 0.6), '#FFC9D6', 0.5),
    stickyInk: c.sticky_ink ?? mix(ink, '#000000', 0.15),

    // book / paper
    paper,
    paper2,
    paperEdge: darken(paper, 0.08),
    paperEdge2: darken(paper, 0.14),
    paperEdge3: darken(paper, 0.20),
    paperEdge4: darken(paper, 0.27),
    ink,
    inkSoft: mix(ink, paper, 0.45),
    rule: `rgba(${rgbTriple(ink)},0.07)`,
    ruleStrong: `rgba(${rgbTriple(ink)},0.16)`,
    // Accent and links must stay legible on PAPER, which is light — so they get
    // the same automatic correction the light theme gets.
    accentInk: pinned(c.accent_ink, accent, paper),
    linkOnPaper: pinned(c.link_on_paper, secondary, paper),
    lightBg,
    lightAlt: mix(surface, white, 0.965),
    lightText: textOnLight,
    lightTextMuted: fix(mix(textOnLight, lightBg, 0.38), lightBg),
    lightAccent: fix(accent, lightBg),
    lightAccentBright: fix(accentBright, lightBg),
    lightSecondaryBright: fix(secondaryBright, lightBg),
    rgbSurface: rgbTriple(surface),
    rgbDeep: rgbTriple(deep),
    rgbAccent: rgbTriple(accent),
    rgbWhite: '255,255,255',
    rgbBlack: '0,0,0',
  }
}

/** Contrast report — printed by the build so a bad palette is visible. */
export function auditPalette(p: Palette, target = 4.5) {
  const pairs: Array<[string, string, string]> = [
    ['body text on dark', p.text, p.deep],
    ['muted text on dark', p.textMuted, p.deep],
    ['accent on dark', p.accent, p.deep],
    ['body text on light', p.lightText, p.lightBg],
    ['accent on light', p.lightAccent, p.lightBg],
    ['text on accent fill', p.surface, p.accent],
  ]
  return pairs.map(([label, fg, bg]) => {
    const ratio = contrast(fg, bg)
    return { label, fg, bg, ratio: Math.round(ratio * 100) / 100, pass: ratio >= target }
  })
}

export async function loadTheme(path: string): Promise<ThemeFile> {
  try {
    const raw = await readFile(path, 'utf8')
    const parsed = JSON.parse(raw) as ThemeFile
    // Every block merges KEY BY KEY over the defaults. A shallow spread would
    // let a theme that pins one colour drop the other thirty, and a theme that
    // sets one duration drop the rest — which is the same undeclared-token
    // failure as above, arriving from the other direction.
    return {
      ...DEFAULT_THEME, ...parsed,
      colors: { ...DEFAULT_THEME.colors, ...parsed.colors },
      space: { ...DEFAULT_THEME.space, ...parsed.space },
      type: { ...DEFAULT_THEME.type, ...parsed.type },
      motion: { ...DEFAULT_THEME.motion, ...parsed.motion },
      fonts: { ...DEFAULT_THEME.fonts, ...parsed.fonts },
    }
  } catch {
    return DEFAULT_THEME
  }
}

/** The CSS custom properties every book carries. */
export function themeCss(p: Palette, fonts: ThemeFile['fonts'] = {}): string {
  return `:root{
  --surface:${p.surface};--surface-alt:${p.surfaceAlt};--deep:${p.deep};
  --accent:${p.accent};--accent-bright:${p.accentBright};
  --secondary:${p.secondary};--secondary-bright:${p.secondaryBright};
  --white:${p.white};
  --bg:${p.deep};--text:${p.text};--text-muted:${p.textMuted};--text-faint:${p.textFaint};
  --rgb-accent:${p.rgbAccent};
  /* Indirect on purpose. Written as a baked literal, this stops following the
     accent the moment a [data-pairing] block re-themes a subtree — the fill
     would keep the old hue while the colour it is meant to be a wash OF has
     moved. Custom properties substitute at USE time, so referring to a triple
     declared further down the same block is fine. */
  --accent-soft:rgba(var(--rgb-accent), .16);
  --border:rgba(${p.rgbWhite},0.12);
  --panel:rgba(${p.rgbWhite},0.045);
  --shadow:0 22px 60px -22px rgba(${p.rgbBlack},0.7);
  --ink-on-dark:${p.text};--ink-on-dark-muted:${p.textMuted};
  --font-display:${fonts.display ?? DEFAULT_THEME.fonts!.display};
  --font-body:${fonts.body ?? DEFAULT_THEME.fonts!.body};
  --font-mono:${fonts.mono ?? DEFAULT_THEME.fonts!.mono};
}
:root[data-theme="light"]{
  --bg:${p.lightBg};--text:${p.lightText};--text-muted:${p.lightTextMuted};
  --accent:${p.lightAccent};--accent-bright:${p.lightAccentBright};
  --secondary-bright:${p.lightSecondaryBright};
  --border:rgba(${p.rgbSurface},0.14);
  --panel:${p.lightAlt};
  --shadow:0 22px 60px -26px rgba(${p.rgbSurface},0.3);
}`
}

/**
 * The scales: spacing, page margins, type sizes, durations and easings.
 *
 * Separate from `themeCss` because these are the only tokens that are NOT
 * colours, and separate from `bookCss` because a rebrand touches the palette
 * far more often than it touches the rhythm.
 *
 * **The type scale is absolute, and that is the whole point.** The stage is a
 * fixed 1560 x 1040 scaled to the window by ONE transform, so a rem here is a
 * fixed number of stage pixels: the type scales with the paper it is printed
 * on, exactly as ink does. A `clamp(...vw...)` size would resize the words
 * independently of the page, which is why §15 bans one in a page.
 *
 * `--undrawn` / `--drawn` are the write-on mask's two ends. They are declared
 * HERE, at the root, rather than only inside the keyframes that animate them:
 * a custom property referenced but never declared invalidates the entire
 * declaration it sits in, and the element then paints NOTHING. That failure is
 * silent, and the reference bundle ships with exactly that bug — `--cast-l` and
 * `--cast-r` are used by its turn-shadow rules and declared nowhere, so the
 * sweep it documents at length simply never renders.
 */
export function scaleCss(theme: ThemeFile = {}): string {
  const s = { ...DEFAULT_THEME.space, ...theme.space }
  const t = { ...DEFAULT_THEME.type, ...theme.type }
  const m = { ...DEFAULT_THEME.motion, ...theme.motion }
  return `:root{
  --sp-1:${s['1']};--sp-2:${s['2']};--sp-3:${s['3']};
  --sp-4:${s['4']};--sp-5:${s['5']};--sp-6:${s['6']};
  --pg-x:${s.page_x};--pg-top:${s.page_top};--pg-bottom:${s.page_bottom};

  --t-band:${t.band};--t-h1:${t.h1};--t-h2:${t.h2};--t-h3:${t.h3};
  --t-body:${t.body};--t-hand:${t.hand};--t-statement:${t.statement};
  --lh-body:${t.line_height};

  --ease-paper:${m.ease_paper};--ease-cloth:${m.ease_cloth};
  --t-curtain:${m.curtain};--t-float:${m.float};--t-open:${m.open};
  --t-flip:${m.flip};--t-riffle-page:${m.riffle_page};
  --t-riffle-quick:calc(${m.riffle_page} * .62);
  --t-reveal:${m.reveal};--t-reveal-stagger:${m.reveal_stagger};

  /* The write-on mask's two ends, and the angle a sticky is stuck at. Declared
     at the root so nothing downstream can reference an undeclared name. */
  --undrawn:0%;--drawn:100%;--tilt:-1.6deg;--pen:var(--accent-ink);
}
@media (prefers-reduced-motion: reduce){
  /* Not a courtesy. Every one of these durations is read by JS as well as CSS,
     so collapsing them here keeps the runtime and the stylesheet agreeing about
     how long a turn takes instead of the runtime waiting on an animation that
     already finished. */
  :root{
    --t-curtain:1ms;--t-float:1ms;--t-open:1ms;--t-flip:1ms;
    --t-riffle-page:1ms;--t-riffle-quick:1ms;
    --t-reveal:1ms;--t-reveal-stagger:0ms;
  }
}`
}

/** Milliseconds per character for the write-on. Read by the runtime, not CSS. */
export const writeSpeed = (theme: ThemeFile = {}): number =>
  Number(theme.motion?.write_speed_ms_per_char ?? DEFAULT_THEME.motion!.write_speed_ms_per_char)

/**
 * Extra tokens the flipbook needs on top of `themeCss`: paper stock, ink,
 * hand-drawn marks and the paper grain. The marks and grain are generated SVG
 * data URIs so they take the accent colour rather than being fixed artwork.
 */
export function bookCss(p: Palette, fonts: ThemeFile['fonts'] = {}, markRef = ''): string {
  // Every picture below is built by a real SVG library at build time
  // (see src/svg.ts) rather than glued together as a string. That is not
  // fussiness: the string version silently produced a solid black grain tile
  // across every page from one double-encoded `#`.
  return `:root{
  --paper:${p.paper};--paper-2:${p.paper2};
  --sticky-1:${p.sticky1};--sticky-2:${p.sticky2};--sticky-3:${p.sticky3};
  --sticky-ink:${p.stickyInk};
  --paper-edge:${p.paperEdge};--paper-edge-2:${p.paperEdge2};
  --paper-edge-3:${p.paperEdge3};--paper-edge-4:${p.paperEdge4};
  --ink:${p.ink};--ink-soft:${p.inkSoft};
  --rule:${p.rule};--rule-strong:${p.ruleStrong};
  --accent-ink:${p.accentInk};--link-on-paper:${p.linkOnPaper};
  --curtain-cloth:${p.curtainCloth};
  --curtain-cloth-lit:${p.curtainClothLit};
  --curtain-cloth-deep:${p.curtainClothDeep};
  --curtain-rim:${p.curtainRim};
  --stage-haze:${p.stageHaze};
  --stage-pool:${p.stagePool};
  --rgb-rim:${rgbTriple(p.curtainRim)};
  --rgb-pool:${rgbTriple(p.stagePool)};
  /* Bare r,g,b triples, for CSS that needs to vary only the alpha.
     THESE WERE MISSING SINCE THE PYTHON PORT and it was invisible: an
     undefined custom property inside rgba() invalidates the WHOLE declaration,
     so the page-curvature gradient was thrown away in its entirety and the
     crest simply never painted. Nothing errored; it just was not there.
     16 declarations across the stylesheets depend on these. */
  --rgb-deep:${rgbTriple(p.deep)};
  --rgb-ink:${rgbTriple(p.ink)};
  --rgb-accent:${rgbTriple(p.accent)};
  --font-ui:${fonts.body ?? DEFAULT_THEME.fonts!.body};
  --font-body:${fonts.book_body ?? "Georgia,'Iowan Old Style','Times New Roman',serif"};
  --font-hand:${fonts.handwriting ?? "'Caveat','Segoe Script','Bradley Hand','Brush Script MT',cursive"};
  --mark-check:url("${checkMarkUri(p.accentInk)}");
  --mark-cross:url("${crossMarkUri(p.danger ?? '#E5484D')}");
  --mark-circle:url("${circleMarkUri(p.accentInk)}");
  --grain:url("${grainUri()}");
  --page-mark:${markRef ? `url("${markRef}")` : 'none'};
}`
}
