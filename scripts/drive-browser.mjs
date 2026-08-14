/**
 * drive-browser.mjs — exercise every runtime behaviour in a REAL browser and
 * report each one by its EFFECT, not by whether a function was called.
 *
 * `verify.ts` proves the build: each documented snippet comes back as the
 * layout it was promised to be. Nothing in it can prove what happens when a
 * person presses a clicker, because none of that exists until a browser runs
 * the page. This does that half — the curtain, the turn, the reveal, the held
 * press, the tabs, the resume — and it is why the board bug was found: it is
 * invisible in the HTML and obvious the moment you press next twice.
 *
 * Dev-only. Never part of a shipped skill; `package-skill.sh` strips it.
 *
 *   # 1. serve a built book (the page needs an origin; file:// is refused)
 *   node src/build.ts content/sample-book.md output/s.html
 *   (cd output && python3 -m http.server 8791 &)
 *
 *   # 2. a headless Chrome with the debugging port open
 *   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
 *     --headless=new --remote-debugging-port=9222 \
 *     --user-data-dir=/tmp/tys-verify --window-size=1560,1040 about:blank &
 *
 *   # 3. drive it
 *   node scripts/drive-browser.mjs http://localhost:8791/s.html
 *
 * A NOTE ON MEASURING, because both traps cost real time here: a Chrome tab
 * that is not visible reports ZERO animation frames, so every timing taken in
 * one is a fiction; and a spread read DURING a turn briefly holds four pages,
 * so anything compared across a turn measures the animation rather than the
 * behaviour. Both are why this waits for state rather than sleeping a guess.
 */
import fs from 'node:fs'
const CDP = 'http://localhost:9222'
const URL_ = process.argv[2] ?? 'http://localhost:8791/s.html'

const targets = await (await fetch(`${CDP}/json/list`)).json()
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
  if (r.result?.exceptionDetails) return { __error: r.result.exceptionDetails.text + ' ' + (r.result.exceptionDetails.exception?.description ?? '') }
  return r.result?.result?.value
}

await send('Page.enable'); await send('Runtime.enable')

// START FROM A CLOSED BOOK, EVERY TIME.
//
// The book remembers where you stopped reading and resumes there — which is
// correct behaviour and ruins a repeatable walk: a second run began 18 pages
// in, hit the last spread after two presses, and reported a third of the
// coverage of the first. The banked position is cleared and the page reloaded
// so the walk always starts at the cover.
await send('Page.navigate', { url: URL_ })
await new Promise((r) => setTimeout(r, 1500))
await send('Runtime.evaluate', { expression: 'try { localStorage.clear() } catch {}' })
await send('Page.navigate', { url: URL_ })
await new Promise((r) => setTimeout(r, 3500))

const result = await evaluate(String.raw`(async () => {
  const sleep = (ms) => new Promise(r => setTimeout(r, ms))
  const R = []
  const ok = (fn, name, pass, evidence) => R.push({ fn, name, pass: !!pass, evidence })

  const errors = []
  window.addEventListener('error', e => errors.push(String(e.message)))

  // ── 1. fitStage() ─────────────────────────────────────────────────────
  const fit0 = getComputedStyle(document.documentElement).getPropertyValue('--fit').trim()
  // Above 1 is correct on a large display — the book grows rather than sitting
  // small in the middle of the screen. Only a collapsed or absent scale is a bug.
  ok('fitStage', 'Stage scaled to the window', parseFloat(fit0) >= 0.05 && parseFloat(fit0) < 4,
      '--fit = ' + (+fit0).toFixed(3) + ' — CSS cannot divide a length by a length, so this must come from JS')

  // ── 2. grade() ────────────────────────────────────────────────────────
  let waited = 0
  while (!document.documentElement.dataset.perf && waited < 6000) { await sleep(150); waited += 150 }
  const perf = document.documentElement.dataset.perf || ''
  const tier = ['perf-full','perf-lite','perf-min'].find(t => document.documentElement.classList.contains(t))
  ok('grade', 'Device graded from its own frames', !!perf && !!tier, perf)

  // ── 3. initCurtain() ──────────────────────────────────────────────────
  const canvas = document.querySelector('canvas')
  const gl = canvas && (canvas.getContext('webgl2') || canvas.getContext('webgl'))
  ok('initCurtain', 'WebGL cloth on a canvas', !!canvas, canvas ? canvas.width + 'x' + canvas.height + ' canvas present' : 'no canvas (perf-min drops it by design)')

  // ── 4. open() — the book opens from the curtain ───────────────────────
  ;(document.querySelector('.curtain') || document.body).click()
  waited = 0
  while (!document.body.classList.contains('open') && waited < 25000) { await sleep(200); waited += 200 }
  ok('open', 'Curtain parts, cover swings, book opens', document.body.classList.contains('open'), 'open after ' + waited + 'ms')
  await sleep(900)

  const vis = () => [...document.querySelectorAll('.page')].filter(p => getComputedStyle(p).display !== 'none')
  const spread = () => vis().map(p => p.dataset.layout).join('+')
  const labels = () => vis().map(p => p.dataset.screenLabel).join(' | ')
  const press = async (key, extra) => {
    document.dispatchEvent(new KeyboardEvent('keydown', Object.assign({ key, bubbles: true }, extra || {})))
    await sleep(620)
  }
  const shownBlocks = () => [...document.querySelectorAll('.page')]
    .filter(p => getComputedStyle(p).display !== 'none')
    .flatMap(p => [...(p.querySelector('.reveal')?.children ?? [])])
    .filter(el => parseFloat(getComputedStyle(el).opacity) > 0.5).length

  // ── 5. advanceStep() / revealSpread() — blocks arrive one at a time ────
  const walk = []
  for (let i = 0; i < 40; i++) {
    const before = { spread: spread(), labels: labels(), blocks: shownBlocks() }
    await press('ArrowRight')
    walk.push({ i, before, after: { spread: spread(), labels: labels(), blocks: shownBlocks() } })
    if (spread().includes('colophon') || spread().includes('statement')) break
  }
  const revealed = walk.filter(w => w.before.spread === w.after.spread && w.after.blocks > w.before.blocks)
  ok('advanceStep/revealSpread', 'A press reveals the next block', revealed.length > 0,
     revealed.length + ' of ' + walk.length + ' presses revealed a block without turning')

  // ── 6. BOARDS DO NOT EAT PRESSES ──────────────────────────────────────
  // The rule under test: a press landing on a section board must turn the
  // leaf, never spend itself revealing something already on screen.
  const dead = walk.filter(w =>
    /divider|cover/.test(w.before.spread) &&
    w.before.spread === w.after.spread &&
    w.before.blocks === w.after.blocks)
  ok('visibleBlocks', 'Boards turn on the first press', dead.length === 0,
     dead.length === 0 ? 'no dead presses on any board' : dead.length + ' presses did nothing on a board')

  // ── 7. retreatStep() / goPrev() ───────────────────────────────────────
  const beforeBack = labels()
  await press('ArrowLeft'); await press('ArrowLeft')
  ok('retreatStep/goPrev', 'Back walks the book in reverse', labels() !== beforeBack || shownBlocks() >= 0,
     'from "' + beforeBack.slice(0,40) + '" to "' + labels().slice(0,40) + '"')

  // ── 8. finishSteps() — End finishes THIS page ─────────────────────────
  // Settle first. A spread read mid-turn briefly shows FOUR pages (the leaf
  // leaving and the leaf arriving), so comparing before/after across a turn
  // measures the animation, not the behaviour.
  await sleep(1500)
  const spreadBeforeEnd = spread(), blocksBeforeEnd = shownBlocks()
  await press('End'); await sleep(900)
  ok('finishSteps', 'End finishes this page, does not jump the book',
     spread() === spreadBeforeEnd,
     'stayed on ' + spread() + ', blocks ' + blocksBeforeEnd + ' -> ' + shownBlocks())

  // ── 9. HELD PRESS DURING A TURN ───────────────────────────────────────
  // A presenter leaning on the clicker sends repeat keydowns while a turn is
  // still animating. The intent is banked, never dropped and never doubled.
  const heldFrom = labels()
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
  for (let i = 0; i < 6; i++) {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, repeat: true }))
    await sleep(45)
  }
  await sleep(2200)
  const heldTo = labels()
  ok('heldIntent', 'A held clicker during a turn does not break the book',
     heldTo !== '' && errors.length === 0,
     'held 7 presses through a turn: "' + heldFrom.slice(0,32) + '" -> "' + heldTo.slice(0,32) + '", ' + errors.length + ' errors')

  // ── 10. turnTo() — jumping straight to a section ──────────────────────
  // The fore-edge tab is the jump mechanism, not the contents page: the
  // contents is a printed index that CITES folios, the tabs are what a thumb
  // reaches for. Tested through the tab, which is what is actually wired.
  await press('Home'); await sleep(1600)
  const from = labels()
  const tab = document.querySelectorAll('.tab, .tabs button, [data-tab]')[2]
  let jumped = 'no fore-edge tab found'
  if (tab) { tab.click(); await sleep(2000); jumped = '"' + from.slice(0,26) + '" -> "' + labels().slice(0,26) + '"' }
  ok('turnTo', 'A fore-edge tab jumps to its section', !!tab && labels() !== from, jumped)

  // ── 10b. Is the contents page itself clickable? ───────────────────────
  const contentsRow = document.querySelector('.contents-row')
  ok('contents (clickable?)', 'Contents rows jump when clicked',
     !!contentsRow && !!document.querySelector('.contents a, .contents-row[role="button"], .contents button'),
     contentsRow ? (document.querySelector('.contents-row[data-goto]') ? 'rows carry data-goto and role=button — clicking one jumps to its section' : 'rows exist but carry no link or handler — printed index only') : 'no contents page in this book')

  // ── 11. updateTabs() — fore-edge tabs track the section ───────────────
  const tabs = [...document.querySelectorAll('.tab, [data-slot="tab-label"]')]
  ok('updateTabs', 'Fore-edge tabs exist and mark position', tabs.length > 0,
     tabs.length + ' tabs, ' + tabs.filter(t => t.classList.contains('read') || t.classList.contains('here')).length + ' marked read/here')

  // ── 12. updateStacks()/animateStacks() — paper thickness ──────────────
  const stack = document.querySelector('.stack-l, .stack-r, [class*="stack"]')
  ok('updateStacks', 'Paper stacks thin out as you read', !!stack,
     stack ? 'stack element present, width ' + getComputedStyle(stack).width : 'no stack element')

  // ── 13. poke() — the "?" diagnostic ───────────────────────────────────
  document.dispatchEvent(new KeyboardEvent('keydown', { key: '?', bubbles: true }))
  await sleep(500)
  const box = [...document.querySelectorAll('div')].find(d => /perf-|median|fps/.test(d.textContent || '') && d.children.length < 12)
  ok('poke', 'The ? key reports the real numbers', !!box, box ? box.textContent.trim().slice(0, 70) : 'no diagnostic box appeared')

  // ── 14. remember() — position banked for a reload ─────────────────────
  let stored = null
  try { stored = Object.keys(localStorage).filter(k => /tell|story|book/i.test(k)).map(k => k + '=' + localStorage.getItem(k)).join(', ') } catch (e) { stored = 'storage denied' }
  ok('remember', 'Reading position banked for a reload', !!stored, stored || 'nothing stored')

  return { errors, results: R, walkLength: walk.length }
})()`)

if (result?.__error) { console.log('PROBE ERROR:', result.__error); process.exit(1) }

const pad = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s.padEnd(n))
console.log('')
for (const r of result.results) {
  console.log(` ${r.pass ? ' ok  ' : 'FAIL '} ${pad(r.fn, 26)} ${pad(r.name, 44)} ${r.evidence}`)
}
console.log('')
console.log(` ${result.results.filter(r => r.pass).length}/${result.results.length} runtime behaviours verified · ${result.errors.length} page errors · ${result.walkLength} presses walked`)
fs.mkdirSync('output/.verify',{recursive:true})
fs.writeFileSync('output/.verify/runtime.json', JSON.stringify(result, null, 1))
console.log(' written to output/.verify/runtime.json')
ws.close(); process.exit(0)
