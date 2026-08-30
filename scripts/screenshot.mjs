/**
 * screenshot.mjs — photograph named layouts from a built book, at full size.
 *
 * WHY THIS EXISTS. The README shows what the kit looks like, and that table is
 * how anyone decides whether a layout is worth using — reading the syntax is
 * not the same as seeing the page. So a layout with no picture is a layout
 * nobody chooses. Five layouts shipped without one, and the README claimed 22
 * while showing 17.
 *
 * Doing it by hand is why: opening a book, walking to the right spread, waiting
 * out the reveals and cropping is fifteen minutes per picture and nobody was
 * ever going to keep it current. This makes it one command.
 *
 * Dev-only, like `drive-browser.mjs`, and stripped from a shipped skill.
 *
 *   # 1. serve a built book — the page needs an origin, file:// is refused
 *   node dist/build.mjs content/every-layout.md output/cat.html
 *   (cd output && python3 -m http.server 8811 &)
 *
 *   # 2. a REAL headless Chrome, sized to the stage so nothing is scaled
 *   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
 *     --headless=new --remote-debugging-port=9222 \
 *     --user-data-dir=/tmp/tys-shots --window-size=1600,1008 about:blank &
 *
 *   # 3. name the layouts you want
 *   node scripts/screenshot.mjs http://localhost:8811/cat.html \
 *        checklist steps dodont anatomy plate
 *
 * 1600x1008 to match the shots already in `docs/screenshots/`. A set that
 * changes size halfway through reads as two photoshoots stitched together.
 *
 * IT WALKS RATHER THAN JUMPS. The reveals are the point of several of these
 * pages — a checklist photographed before its ticks are drawn is a picture of
 * empty boxes — so each page is pressed through its own steps before the
 * shutter, exactly as a reader would.
 */

import fs from 'node:fs'
import { join } from 'node:path'

const CDP = 'http://localhost:9222'
const [url, ...wanted] = process.argv.slice(2)
if (!url || wanted.length === 0) {
  console.error('usage: node scripts/screenshot.mjs <url> <layout> [layout...]')
  process.exit(1)
}
const OUT = join(process.cwd(), 'docs', 'screenshots')

const targets = await (await fetch(`${CDP}/json/list`).catch(() => {
  console.error('  No Chrome on :9222. Start one — the header of this file has the command.')
  process.exit(1)
})).json()
const page = targets.find((t) => t.type === 'page')
const ws = new WebSocket(page.webSocketDebuggerUrl)
await new Promise((r) => ws.addEventListener('open', r, { once: true }))

let id = 0
const pending = new Map()
ws.addEventListener('message', (ev) => {
  const m = JSON.parse(ev.data)
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) }
})
const send = (method, params = {}) => new Promise((res) => {
  const n = ++id; pending.set(n, res); ws.send(JSON.stringify({ id: n, method, params }))
})
const evaluate = async (expression) => {
  const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
  return r.result?.result?.value
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

await send('Page.enable'); await send('Runtime.enable')

// A book resumes where you stopped reading. For a photograph that is a trap —
// the second run would start somewhere else and shoot a different page — so the
// bookmark goes before anything else does.
// A CACHE-BUSTER, BECAUSE THE POINT IS TO PHOTOGRAPH THE CURRENT BUILD.
// Chrome serves the same URL from its own cache, so a run right after a rebuild
// quietly photographs the previous book — which it did, and cost a round of
// "why has the CSS change not taken effect" when the CSS was fine all along.
const fresh = `${url}${url.includes('?') ? '&' : '?'}shot=${Math.random().toString(36).slice(2)}`

await send('Page.navigate', { url: fresh })
await sleep(1200)
await evaluate('try{localStorage.clear()}catch(e){}')
await send('Page.navigate', { url: fresh })
await sleep(2000)

// A REAL MOUSE, NOT element.click(). The curtain and the cover both listen for
// a genuine pointer sequence; a synthetic `.click()` returns without opening
// anything and the script sails on to photograph a closed curtain. It did
// exactly that on the first run and produced two identical pictures of cloth.
const clickAt = async (x, y) => {
  for (const type of ['mousePressed', 'mouseReleased']) {
    await send('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 })
  }
}

/** Wait for the book to SAY it is in a state, rather than sleeping a guess. */
const waitFor = async (cls, ms = 15000) => {
  const until = Date.now() + ms
  while (Date.now() < until) {
    if (await evaluate(`document.body.classList.contains(${JSON.stringify(cls)})`)) return true
    await sleep(250)
  }
  return false
}

await clickAt(800, 500)
if (!await waitFor('curtain-done')) { console.error('  the curtain never opened'); process.exit(1) }
await sleep(1500)
await clickAt(800, 500)
if (!await waitFor('opened-done')) { console.error('  the book never opened'); process.exit(1) }
await sleep(1500)

const nextPage = '(()=>{const b=[...document.querySelectorAll(".chrome button")]' +
  '.find(x=>x.getAttribute("aria-label")==="Next page");b&&b.click();return !!b})()'

/**
 * Which layouts are on screen right now.
 *
 * The pages exist in the DOM behind the curtain, so a width test alone reports
 * a layout as visible while the reader is still looking at cloth. That is how
 * the first run photographed the curtain twice and called it a checklist.
 */
/**
 * A NAME MAY BE A LAYOUT OR A SELECTOR. Most pages are identified by their
 * layout, but a diagram is a BLOCK on a prose page — there are six prose pages
 * in the catalogue and `prose` names all of them. `.diagram-flowchart` names
 * exactly one, so anything starting with a dot is matched as a selector on the
 * current spread instead.
 */
const matches = async (name) => {
  if (!name.startsWith('.')) return (await onScreen()).includes(name)
  return await evaluate(
    `[...document.querySelectorAll(".stf__item.--left,.stf__item.--right")]` +
    `.some(e=>e.querySelector(${JSON.stringify(name)}))`)
}

const onScreen = async () => await evaluate(
  // ASK THE ENGINE, DO NOT MEASURE. page-flip marks the leaves of the CURRENT
  // spread `--left` and `--right`; every other leaf stays mounted at full size
  // just outside the viewport. Two runs were filed under the wrong name before
  // this stopped being a geometry problem and started being a state question.
  '(()=>[...document.querySelectorAll(".stf__item.--left,.stf__item.--right")]' +
  '.map(e=>e.dataset.layout).filter(Boolean))()')

const shot = async (name) => {
  // Hide the floating controls. They idle-fade on their own, but a photograph
  // should not be a race against a timer.
  await evaluate('(()=>{const c=document.querySelector(".chrome");if(c)c.style.opacity="0"})()')
  await sleep(400)
  const r = await send('Page.captureScreenshot', { format: 'jpeg', quality: 88 })
  const file = join(OUT, `${name.replace(/^\./, '').replace(/[^\w-]/g, '-')}.jpg`)
  fs.writeFileSync(file, Buffer.from(r.result.data, 'base64'))
  const kb = Math.round(fs.statSync(file).size / 1024)
  console.log(`  ${file}  ${kb} KB`)
  await evaluate('(()=>{const c=document.querySelector(".chrome");if(c)c.style.opacity=""})()')
}

const found = new Set()
console.log('')
for (let press = 0; press < 90 && found.size < wanted.length; press++) {
  for (const layout of wanted) {
    if (found.has(layout) || !await matches(layout)) continue
    // PRESS THROUGH THE REVEALS FIRST. A checklist shot on arrival is a picture
    // of empty boxes; the ticks are the thing worth showing.
    // `End` COMPLETES THE PAGE'S REVEALS WITHOUT TURNING IT — DESIGN.md's
    // "nobody should be trapped watching their own animation". Pressing Next
    // instead both reveals AND, once a spread is spent, turns the leaf, so the
    // shutter fired on the page after the one it came for: three runs filed a
    // divider board as `anatomy` before this stopped using the wrong key.
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'End', code: 'End', windowsVirtualKeyCode: 35 })
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'End', code: 'End', windowsVirtualKeyCode: 35 })
    await sleep(1600)
    await shot(layout)
    found.add(layout)
  }
  if (found.size === wanted.length) break
  await evaluate(nextPage)
  await sleep(1000)
}

const missed = wanted.filter((w) => !found.has(w))
console.log('')
console.log(missed.length === 0
  ? `  ${found.size} photographed.`
  : `  never reached: ${missed.join(', ')} — is that layout in this book?`)
ws.close()
process.exit(missed.length === 0 ? 0 : 1)
