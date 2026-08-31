#!/usr/bin/env node
/**
 * overflow.ts — does any page actually FIT?
 *
 *   node dist/overflow.mjs book.html [--json]
 *
 * WHY THIS EXISTS. `prep` estimates whether a page will fit by counting its
 * characters against a budget. That is a guess, made before a browser has ever
 * laid the page out, and it is wrong in both directions: it passes a page whose
 * heading wraps to three lines and pushes a diagram off the sheet, and it warns
 * about a page that fits perfectly because the words happen to be short. A book
 * is a FIXED-SIZE page — the one format where content cannot simply scroll — so
 * "does it fit" is the question that matters most and the one we were answering
 * by arithmetic.
 *
 * This opens the built book in a real browser and MEASURES. Four faults, each
 * of which has actually happened in this kit:
 *
 *   text-off-page   a line that extends past the edge of the sheet it is on
 *   text-clipped    a line cut off by an overflow-hidden ancestor
 *   text-collision  two pieces of text painting over each other
 *   text-too-small  type below the readable floor
 *
 * The measurement technique is adapted from epic-infographics (MIT) — see
 * CREDITS.md. Its insight, which is not obvious and which we would have got
 * wrong: a line box is not the ink. `getClientRects()` returns the line box,
 * which carries the font's full ascent and descent — air well beyond the
 * painted glyphs, and on display type that air is most of the box. Comparing
 * line boxes reports collisions between things that visibly do not touch. So
 * every rect here is shaved down to the ink the canvas TextMetrics API reports
 * for that exact string in that exact font, and SVG text is measured
 * per-character through its own screen matrix so a rotated label does not
 * inherit the bounding box of its whole arc.
 *
 * NO NEW DEPENDENCY. It finds a Chrome already on the machine, runs it headless
 * on an ephemeral port, drives it over the DevTools protocol and kills it. If
 * there is no browser it says so and returns "not run" rather than failing —
 * a skill that cannot be used without installing a browser engine is a skill
 * nobody uses.
 */

import { spawn, type ChildProcess } from 'node:child_process'
import { createServer } from 'node:http'
import { existsSync, readFileSync } from 'node:fs'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, resolve } from 'node:path'

/**
 * Type below MIN is a defect; below COMFORT is worth a second look.
 *
 * Set against the book rather than against a poster. The diagram grammars ship
 * 10px as the smallest label they recommend, so a comfort floor above that
 * would have flagged ten labels in our own catalogue on the day it was written
 * — and a checker that cries wolf on the house style is a checker people learn
 * to skip.
 */
const FONT_MIN = 8
const FONT_COMFORT = 10

export interface Finding {
  kind: 'text-off-page' | 'text-clipped' | 'text-collision' | 'text-too-small' | 'text-small' | 'text-near-miss'
  page: string
  detail: string
}

export interface Report {
  ran: boolean
  why?: string
  pages: number
  texts: number
  errors: Finding[]
  warnings: Finding[]
}

/**
 * Somewhere to find a browser.
 *
 * `CHROME_PATH` first, so anyone with a Chromium in an unusual place — a CI
 * image, a Nix store, a Playwright cache — can point at it without this file
 * needing to know their layout.
 */
const CHROMES = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/microsoft-edge',
].filter(Boolean) as string[]

const findChrome = (): string | null => CHROMES.find((p) => existsSync(p)) ?? null

/** The page script. Runs inside the book; returns findings, never elements. */
const MEASURE = String.raw`(() => {
  const FONT_MIN = __MIN__, FONT_COMFORT = __COMFORT__
  const errors = [], warnings = []

  // ── force the finished state ────────────────────────────────────────────
  // Every page is mounted at full size — page-flip keeps the leaves it is not
  // showing just outside the viewport rather than unmounting them — so the whole
  // book is measurable without turning a single page. What is NOT true is that
  // they are in their finished state: a page the reader has not reached is
  // parked by GSAP at opacity 0 with a 16px offset, and that offset would move
  // text across a boundary it never crosses in life. Opacity does not change
  // geometry; the transform does. So strip the inline transforms, and lift the
  // CSS reveal gate so nothing is hidden from the walker below.
  const gate = document.createElement('style')
  gate.textContent = '.reveal,.reveal *{opacity:1 !important}'
  document.head.appendChild(gate)
  for (const el of document.querySelectorAll('[style*="transform"],[style*="translate"]')) {
    el.style.transform = 'none'
  }

  const pageOf = (el) => el.closest('.page')
  const nameOf = (p) => (p?.dataset.screenLabel || p?.dataset.layout || p?.dataset.page || '?')

  const visible = (el) => {
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      const cs = getComputedStyle(n)
      if (cs.display === 'none' || cs.visibility === 'hidden') return false
    }
    return true
  }
  const describe = (el) => {
    let sel = el.tagName.toLowerCase()
    if (el.classList.length) sel += '.' + [...el.classList].slice(0, 2).join('.')
    const t = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30)
    return t ? sel + ' “' + t + '”' : sel
  }

  // ── glyph-tight rects ───────────────────────────────────────────────────
  // A line box carries the font's whole ascent and descent. The ink usually
  // does not fill it, and on a display face most of the box is air — so
  // comparing line boxes reports collisions between things that visibly do not
  // touch. TextMetrics gives the real ink extent for this string in this font.
  const mctx = document.createElement('canvas').getContext('2d')
  const metrics = (el, text) => {
    const cs = getComputedStyle(el)
    mctx.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + parseFloat(cs.fontSize) + 'px ' + cs.fontFamily
    const m = mctx.measureText(text)
    return {
      fontAsc: m.fontBoundingBoxAscent || 0, fontDesc: m.fontBoundingBoxDescent || 0,
      inkAsc: m.actualBoundingBoxAscent || 0, inkDesc: m.actualBoundingBoxDescent || 0,
      advance: m.width,
    }
  }
  const bbox = (pts) => {
    const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y)
    const left = Math.min(...xs), right = Math.max(...xs)
    const top = Math.min(...ys), bottom = Math.max(...ys)
    return { left, right, top, bottom, width: right - left, height: bottom - top }
  }

  const byElement = new Map()
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const node = walker.currentNode
    if (!node.textContent.trim()) continue
    const el = node.parentElement
    if (!el || !visible(el) || !pageOf(el)) continue
    if (!byElement.has(el)) byElement.set(el, [])
    byElement.get(el).push(node)
  }

  const leaves = []
  for (const [el, nodes] of byElement) {
    const fontSize = parseFloat(getComputedStyle(el).fontSize)
    let rects = []

    if (el instanceof SVGElement) {
      // Per-character ink, mapped through the element's own screen matrix, so a
      // label set along a curve is measured where each glyph actually lands
      // rather than as one box around the whole arc.
      try {
        const ctm = el.getScreenCTM()
        const n = el.getNumberOfChars()
        const chars = el.textContent
        if (ctm && n) {
          for (let i = 0; i < n; i++) {
            const ch = chars[i]
            if (!ch || !ch.trim()) continue
            const ext = el.getExtentOfChar(i)
            const m = metrics(el, ch)
            const rot = el.getRotationOfChar(i) * Math.PI / 180
            const cx = ext.x + ext.width / 2, cy = ext.y + ext.height / 2
            const base = (m.fontAsc - m.fontDesc) / 2
            const w2 = m.advance / 2
            const cos = Math.cos(rot), sin = Math.sin(rot)
            rects.push(bbox([
              [-w2, base - m.inkAsc], [w2, base - m.inkAsc],
              [-w2, base + m.inkDesc], [w2, base + m.inkDesc],
            ].map(([x, y]) => {
              const rx = cx + x * cos - y * sin, ry = cy + x * sin + y * cos
              return { x: ctm.a * rx + ctm.c * ry + ctm.e, y: ctm.b * rx + ctm.d * ry + ctm.f }
            })))
          }
        }
      } catch (e) { /* not an SVGTextContentElement */ }
      if (!rects.length) rects = [el.getBoundingClientRect()]
    } else {
      // Which sides carry the metric air depends on how the text is turned —
      // the fore-edge tabs and the spine are rotated, and shaving the top off a
      // sideways label would shave its left instead.
      let angle = 0
      for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
        const t = getComputedStyle(n).transform
        if (t && t !== 'none') { const m = new DOMMatrix(t); angle += Math.atan2(m.b, m.a) * 180 / Math.PI }
      }
      if (getComputedStyle(el).writingMode.startsWith('vertical')) angle += 90
      const norm = ((Math.round(angle) % 360) + 360) % 360
      const upright = norm % 180 < 3 || norm % 180 > 177
      const sideways = Math.abs((norm % 180) - 90) < 3

      const text = nodes.map((n) => n.textContent).join(' ').trim()
      const m = metrics(el, text)
      const airTop = Math.max(0, m.fontAsc - m.inkAsc)
      const airBottom = Math.max(0, m.fontDesc - m.inkDesc)
      let iL = 0, iR = 0, iT = 0, iB = 0
      if (upright) { iT = airTop; iB = airBottom }
      else if (sideways) { iL = iR = (airTop + airBottom) / 2 }
      else { iL = iR = iT = iB = (airTop + airBottom) / 2 }

      // A LINE TALLER THAN THE LINE-HEIGHT HOLDS SOMETHING BIGGER THAN THE
      // BODY TEXT — a drop cap, an inline image, a run of display type. Its box
      // then reaches far above its own ink, because the glyph sits on the
      // baseline near the bottom of it. The chapter-opener page is exactly
      // this: a 118px drop cap in an 85px line box, whose rect starts at y=416
      // while the eyebrow above it ends at y=436, so the two BOXES overlap by
      // 20px and the two pieces of INK are 19px apart and obviously fine on
      // screen. Reported as the only error in the whole catalogue, on a page
      // that has never looked wrong.
      //
      // The metric air computed above cannot catch it: it is measured with the
      // element's own font, and the drop cap is nearly five times that size.
      // So for an oversized line, take the ink to be the last line-height of
      // the box and drop the rest, which is where the glyph actually is.
      const lh = parseFloat(getComputedStyle(el).lineHeight) || fontSize * 1.4
      for (const node of nodes) {
        const range = document.createRange()
        range.selectNodeContents(node)
        for (const r of range.getClientRects()) {
          const left = r.left + Math.min(iL, r.width / 3)
          const right = r.right - Math.min(iR, r.width / 3)
          const oversized = upright && r.height > lh * 1.4
          const top = oversized ? r.bottom - lh : r.top + Math.min(iT, r.height / 3)
          const bottom = r.bottom - Math.min(iB, r.height / 3)
          rects.push({ left, right, top, bottom, width: right - left, height: bottom - top })
        }
      }
    }

    rects = rects.filter((r) => r.width > 0.5 && r.height > 0.5)
    if (!rects.length) continue
    const page = pageOf(el)
    leaves.push({
      el, rects, fontSize, page, name: nameOf(page),
      ink: rects.reduce((s, r) => s + r.width * r.height, 0),
      // Three things overhang ON PURPOSE and must not be reported as faults:
      // a sticky note is pressed onto the page and overlaps what it annotates
      // (DESIGN.md §10 — a note that sits neatly in its own slot reads as a
      // designed panel instead); a fore-edge tab is glued to the outside of the
      // sheet; and anything an author has explicitly waived.
      loose: !!el.closest('.sticky,.tab,.tabs,.leaf-tab,.spine,[data-overflow-ok]'),
    })
  }

  const at = (r) => Math.round(r.left) + ',' + Math.round(r.top)
  const push = (list, kind, page, detail) => list.push({ kind, page, detail })

  // ── type below the floor ────────────────────────────────────────────────
  for (const l of leaves) {
    if (l.fontSize < FONT_MIN) push(errors, 'text-too-small', l.name,
      describe(l.el) + ' is ' + l.fontSize.toFixed(1) + 'px (floor ' + FONT_MIN + 'px)')
    else if (l.fontSize < FONT_COMFORT) push(warnings, 'text-small', l.name,
      describe(l.el) + ' is ' + l.fontSize.toFixed(1) + 'px (comfort floor ' + FONT_COMFORT + 'px)')
  }

  // ── off the sheet ───────────────────────────────────────────────────────
  const EDGE = 2
  for (const l of leaves) {
    if (l.loose) continue
    const b = l.page.getBoundingClientRect()
    for (const r of l.rects) {
      if (r.left < b.left - EDGE || r.top < b.top - EDGE || r.right > b.right + EDGE || r.bottom > b.bottom + EDGE) {
        push(errors, 'text-off-page', l.name, describe(l.el) + ' at ' + at(r) + ' runs past the edge of the sheet')
        break
      }
    }
  }

  // ── cut off by a clipping ancestor ──────────────────────────────────────
  for (const l of leaves) {
    if (l.loose || l.el instanceof SVGElement) continue
    for (let anc = l.el; anc && anc !== document.body; anc = anc.parentElement) {
      const cs = getComputedStyle(anc)
      const clips = (v) => v === 'hidden' || v === 'clip' || v === 'scroll' || v === 'auto'
      if (!clips(cs.overflowX) && !clips(cs.overflowY)) continue
      const box = anc.getBoundingClientRect()
      const cut = l.rects.some((r) =>
        (clips(cs.overflowX) && (r.left < box.left - EDGE || r.right > box.right + EDGE)) ||
        (clips(cs.overflowY) && (r.top < box.top - EDGE || r.bottom > box.bottom + EDGE)))
      if (cut) { push(errors, 'text-clipped', l.name, describe(l.el) + ' is cut off by ' + describe(anc)); break }
    }
  }

  // ── text painted over text ──────────────────────────────────────────────
  // Compared as a SHARE of the smaller element's ink, so a one-character graze
  // between two long labels reads as a near miss and a label buried under
  // another reads as a collision.
  const COLLIDE = 0.12, NEAR = 0.05
  const seen = new Set()
  for (let i = 0; i < leaves.length; i++) {
    for (let j = i + 1; j < leaves.length; j++) {
      const a = leaves[i], b = leaves[j]
      if (a.page !== b.page) continue
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue
      let inter = 0, worst = 0, where = null
      for (const ra of a.rects) for (const rb of b.rects) {
        const w = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left)
        const h = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top)
        if (w < 3 || h < 3) continue
        inter += w * h
        if (w * h > worst) { worst = w * h; where = { left: Math.max(ra.left, rb.left), top: Math.max(ra.top, rb.top) } }
      }
      if (!inter) continue
      const ratio = inter / Math.min(a.ink, b.ink)
      if (ratio < NEAR) continue
      const key = describe(a.el) + '|' + describe(b.el)
      if (seen.has(key)) continue
      seen.add(key)
      const line = describe(a.el) + ' and ' + describe(b.el) + ' at ' + at(where) +
        ' (' + Math.round(ratio * 100) + '% of the smaller one covered)'
      // A sticky is MEANT to sit on the words it annotates. 'placeStickies'
      // picks the least-bad corner and there is not always a clear one, so this
      // is a thing to look at, never a thing that fails a book.
      if (a.loose || b.loose) push(warnings, 'text-near-miss', a.name, line + ' — one of them overhangs by design')
      else if (ratio >= COLLIDE) push(errors, 'text-collision', a.name, line)
      else push(warnings, 'text-near-miss', a.name, line)
    }
  }

  gate.remove()
  return { ran: true, pages: 0, texts: leaves.length, errors, warnings, spread: [...document.querySelectorAll('.page')]
      .filter((p) => getComputedStyle(p).display !== 'none').map(nameOf) }
})()`

/** Serve the book on an ephemeral port. A page needs an origin; file:// has its own rules. */
async function serve(file: string): Promise<{ url: string; close: () => void }> {
  const html = readFileSync(file)
  const server = createServer((_req, res) => {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
    res.end(html)
  })
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', r))
  const { port } = server.address() as { port: number }
  return { url: `http://127.0.0.1:${port}/${basename(file)}`, close: () => server.close() }
}

interface Cdp {
  send: (method: string, params?: Record<string, unknown>, sessionId?: string) => Promise<Record<string, unknown>>
  close: () => void
}

async function connect(wsUrl: string): Promise<Cdp> {
  const ws = new WebSocket(wsUrl)
  await new Promise((r) => ws.addEventListener('open', r, { once: true }))
  let id = 0
  const pending = new Map<number, (m: Record<string, unknown>) => void>()
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(String((ev as MessageEvent).data)) as { id?: number }
    if (m.id && pending.has(m.id)) { pending.get(m.id)!(m as Record<string, unknown>); pending.delete(m.id) }
  })
  return {
    send: (method, params = {}, sessionId) => new Promise((res) => {
      const n = ++id
      pending.set(n, res)
      ws.send(JSON.stringify(sessionId ? { id: n, method, params, sessionId } : { id: n, method, params }))
    }),
    close: () => ws.close(),
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function inspect(file: string): Promise<Report> {
  const empty: Report = { ran: false, pages: 0, texts: 0, errors: [], warnings: [] }
  const chrome = findChrome()
  if (!chrome) {
    return { ...empty, why: 'no Chrome, Chromium or Edge found — set CHROME_PATH to measure page fit' }
  }

  const profile = await mkdtemp(`${tmpdir()}/tys-fit-`)
  const site = await serve(resolve(file))
  let proc: ChildProcess | null = null
  let cdp: Cdp | null = null
  try {
    proc = spawn(chrome, [
      '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
      '--window-size=1600,1008', '--no-first-run', '--no-default-browser-check',
      '--disable-gpu', 'about:blank',
    ], { stdio: ['ignore', 'ignore', 'pipe'] })

    // Chrome prints the port it actually took on stderr. Asking for one rather
    // than picking a number means two of these can run at once — a check suite
    // and a person — without fighting over :9222.
    const wsUrl = await new Promise<string>((res, rej) => {
      const timer = setTimeout(() => rej(new Error('browser did not report a debugging port')), 20000)
      let buf = ''
      proc!.stderr?.on('data', (d: Buffer) => {
        buf += d.toString()
        const m = /ws:\/\/[^\s]+/.exec(buf)
        if (m) { clearTimeout(timer); res(m[0]) }
      })
      proc!.on('exit', () => { clearTimeout(timer); rej(new Error('browser exited before it was ready')) })
    })

    cdp = await connect(wsUrl)

    // THE PORT'S OWN SOCKET IS THE BROWSER, NOT A PAGE. Chrome prints the
    // browser-level endpoint, and that endpoint has no Runtime or Page domain —
    // asking it to evaluate anything comes back "'Runtime.evaluate' wasn't
    // found", which reads like a version problem and is not one. Open a tab and
    // attach to it; a flat session then carries page commands over this same
    // socket, so there is no second connection and no HTTP round trip.
    const made = await cdp.send('Target.createTarget', { url: site.url }) as
      { result?: { targetId?: string } }
    const targetId = made.result?.targetId
    if (!targetId) return { ...empty, why: 'the browser would not open a tab' }
    const attached = await cdp.send('Target.attachToTarget', { targetId, flatten: true }) as
      { result?: { sessionId?: string } }
    const session = attached.result?.sessionId
    if (!session) return { ...empty, why: 'could not attach to the page' }

    await cdp.send('Page.enable', {}, session)
    await cdp.send('Runtime.enable', {}, session)
    await sleep(2200)

    // THE BOOK HAS TO BE OPEN BEFORE ANY OF IT CAN BE MEASURED. A closed book
    // is not a book with hidden pages — `.page` is `display: none` until the
    // engine mounts the leaves, and a display:none element has no geometry at
    // all. Measured on the catalogue: 282 of its 310 pieces of text were on
    // unmounted pages, so the first run of this checker cheerfully reported
    // that 50 pages and 4 pieces of text all fitted perfectly.
    //
    // Both gestures are REAL pointer events. The curtain and the cover listen
    // for a pointer sequence, and a synthetic .click() returns having opened
    // nothing — the same trap the screenshot tool fell into, twice.
    const evaluate = async (expression: string): Promise<unknown> => {
      const out = await cdp!.send('Runtime.evaluate',
        { expression, returnByValue: true, awaitPromise: true }, session) as
        { result?: { result?: { value?: unknown } } }
      return out.result?.result?.value
    }
    const clickCentre = async (): Promise<void> => {
      for (const type of ['mousePressed', 'mouseReleased']) {
        await cdp!.send('Input.dispatchMouseEvent',
          { type, x: 800, y: 500, button: 'left', clickCount: 1 }, session)
      }
    }
    const waitFor = async (cls: string, ms = 15000): Promise<boolean> => {
      const until = Date.now() + ms
      while (Date.now() < until) {
        if (await evaluate(`document.body.classList.contains(${JSON.stringify(cls)})`)) return true
        await sleep(200)
      }
      return false
    }
    await evaluate('try{localStorage.clear()}catch(e){}')
    await clickCentre()
    if (!await waitFor('curtain-done')) return { ...empty, why: 'the curtain never opened' }
    await sleep(900)
    await clickCentre()
    if (!await waitFor('opened-done')) return { ...empty, why: 'the book never opened' }
    await sleep(1200)

    const script = MEASURE
      .replace('__MIN__', String(FONT_MIN))
      .replace('__COMFORT__', String(FONT_COMFORT))

    // ONE SPREAD AT A TIME, because that is all there is. The first version
    // measured the whole book in a single pass and reported that 50 pages and
    // 4 pieces of text all fitted perfectly — page-flip keeps every leaf but
    // the open spread at `display: none`, and a display:none element has no
    // geometry to measure. 282 of the catalogue's 310 pieces of text were
    // invisible to it. So walk the book the way a reader does; it is also the
    // only way to measure a page under the exact conditions it is read in.
    const next = '(()=>{const b=[...document.querySelectorAll(".chrome button")]'
      + '.find(x=>x.getAttribute("aria-label")==="Next page");b&&b.click();return !!b})()'
    const totalPages = Number(await evaluate('document.querySelectorAll(".page").length')) || 0

    const errors: Finding[] = []
    const warnings: Finding[] = []
    const seen = new Set<string>()
    const visited = new Set<string>()
    let texts = 0

    const press = async (key: string, code: string, vk: number): Promise<void> => {
      for (const type of ['keyDown', 'keyUp']) {
        await cdp!.send('Input.dispatchKeyEvent', { type, key, code, windowsVirtualKeyCode: vk }, session)
      }
    }
    const landed = async (): Promise<void> => {
      for (let w = 0; w < 40; w++) {
        if (!await evaluate('!!document.querySelector(".is-turning")')) break
        await sleep(120)
      }
      await sleep(420)
    }

    for (let spread = 0; spread <= Math.ceil(totalPages / 2) + 2; spread++) {
      // FINISH THE PAGE BEFORE MEASURING IT, AND BEFORE TURNING.
      // Next is not "turn the page" — it is "show me the next thing", so on a
      // spread with four reveal steps the first four presses reveal and only
      // the fifth turns. One press per pass therefore walked 28 pages of 50 and
      // printed a confident summary of the half it had seen. End completes the
      // spread, which both makes the measurement the reader's own final view
      // and guarantees the following Next is a turn.
      await press('End', 'End', 35)
      await sleep(700)
      const r = await cdp.send('Runtime.evaluate',
        { expression: script, returnByValue: true, awaitPromise: true }, session)
      const value = (r as { result?: { result?: { value?: Report & { spread: string[] } }; exceptionDetails?: unknown } }).result
      if (value?.exceptionDetails || !value?.result?.value) {
        const d = value?.exceptionDetails as { exception?: { description?: string } } | undefined
        return { ...empty, why: d?.exception?.description ?? JSON.stringify(r).slice(0, 400) }
      }
      const page = value.result.value
      const key = page.spread.join('|')
      if (!visited.has(key)) {
        visited.add(key)
        texts += page.texts
        for (const f of [...page.errors, ...page.warnings]) {
          const id = `${f.kind}|${f.page}|${f.detail}`
          if (seen.has(id)) continue
          seen.add(id)
          ;(page.errors.includes(f) ? errors : warnings).push(f)
        }
      }
      if (!await evaluate(next)) break
      // And wait for the leaf to LAND rather than sleeping a guess — a click
      // that arrives mid-turn is dropped, and a delay a shade too short stops
      // the walk without saying so.
      await landed()
    }

    return { ran: true, pages: visited.size * 2, texts, errors, warnings }
  } catch (e) {
    return { ...empty, why: (e as Error).message }
  } finally {
    cdp?.close()
    site.close()
    // WAIT FOR IT TO ACTUALLY GO. Chrome keeps writing its profile while it
    // shuts down, so removing the directory the instant after `kill()` races
    // its own extension storage and throws ENOTEMPTY — which, in a `finally`,
    // replaced a perfectly good report with a stack trace about a temp folder.
    if (proc) {
      const gone = new Promise<void>((r) => proc!.once('exit', () => r()))
      proc.kill()
      await Promise.race([gone, sleep(3000)])
    }
    await rm(profile, { recursive: true, force: true }).catch(() => {})
  }
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2)
  const asJson = argv.includes('--json')
  const input = argv.find((a) => !a.startsWith('-'))
  if (!input) {
    console.error('usage: node dist/overflow.mjs <book.html> [--json]')
    process.exit(1)
  }

  const report = await inspect(input)

  if (asJson) {
    console.log(JSON.stringify(report, null, 2))
    process.exit(report.errors.length ? 1 : 0)
  }

  console.log('')
  if (!report.ran) {
    console.log(`  not run — ${report.why}`)
    console.log('')
    process.exit(0)
  }
  for (const e of report.errors) console.log(`  ✗ ${e.kind.padEnd(15)}${e.page}: ${e.detail}`)
  for (const w of report.warnings) console.log(`  ! ${w.kind.padEnd(15)}${w.page}: ${w.detail}`)
  console.log('')
  console.log(report.errors.length === 0 && report.warnings.length === 0
    ? `  ${report.pages} pages, ${report.texts} pieces of text — everything fits.`
    : `  ${report.pages} pages, ${report.texts} pieces of text — ` +
      `${report.errors.length} to fix, ${report.warnings.length} to look at.`)
  console.log('')
  process.exit(report.errors.length ? 1 : 0)
}

if (import.meta.filename === process.argv[1] || process.argv[1]?.endsWith('overflow.mjs')) {
  await main()
}
