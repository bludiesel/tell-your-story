/**
 * book.ts — the flipbook runtime, shipped inside every book.
 *
 * page-flip and GSAP are imported as real npm packages here and bundled in by
 * `Bun.build()`. The old Python build hand-downloaded them into
 * `assets/vendor/` and pasted them in with string replacement, which is how
 * the vendored animation library quietly fell a version behind.
 *
 * GSAP rather than anime.js: the reveal is a real timeline, so the eyebrow,
 * heading and body of a spread can be choreographed against each other with
 * overlap instead of a flat stagger, and `gsap.context()` gives us one handle
 * to kill everything when a page turns mid-flight.
 */

import { PageFlip } from 'page-flip'
import gsap from 'gsap'

import { initCurtain } from './curtain.ts'

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

function boot(): void {
  const bookEl = document.getElementById('book')
  if (!bookEl) return

  const pages = document.querySelectorAll<HTMLElement>('#book > .page')
  const total = pages.length
  const reducedMotion = prefersReducedMotion()

  // ── FIT THE FIXED STAGE TO THE WINDOW ──────────────────────────────────
  // The stage is 1560 x 1040 and is scaled to fit by one transform, which is
  // what lets every measurement inside it be absolute (DESIGN.md §1).
  //
  // In JS because CSS cannot express it: `calc(97vw / 1560)` divides a length
  // by a number and therefore yields a LENGTH, `scale()` requires a unitless
  // number, and the declaration is thrown away in silence. There is no way to
  // divide a length by a length in CSS. Written before anything else so the
  // first painted frame is already the right size — the closed book reads this
  // too, since its cover has to land exactly on the left half of the spread.
  //
  // 40px is held back horizontally for the fore-edge tabs, which overhang 18px
  // each side and would otherwise be clipped at the window edge.
  const fitStage = () => {
    const fit = Math.min((window.innerWidth * 0.97 - 40) / 1560, (window.innerHeight * 0.92) / 1040)
    document.documentElement.style.setProperty('--fit', String(Math.max(fit, 0.05)))
  }
  fitStage()
  window.addEventListener('resize', fitStage, { passive: true })

  // ── THE BOOK MEASURES THE MACHINE IT LANDED ON ─────────────────────────
  //
  // This ships as one file to whoever is handed it: a locked-down site laptop,
  // a ten-year-old meeting-room PC, a phone, a remote-desktop session. None of
  // those can be detected reliably by asking — user agents lie, device pixel
  // ratio says nothing about the GPU behind it, and hardwareConcurrency counts
  // cores that may be busy with something else.
  //
  // So it does not ask. It WATCHES ITS OWN FRAMES for the first second, while
  // the curtain is closed and the shader is working hardest, and steps the
  // whole page down a tier if they are not arriving on time. Every effect that
  // costs real time — the blurs, the layered shadows, the cloth shader — is
  // scoped to a class on <html>, so one decision reaches all of them.
  //
  // Measured rather than assumed, and re-measured after a resize, because
  // dragging a window onto a 5K display changes the answer.
  //
  // The tiers deliberately keep the BOOK and give up the SCENERY: a reader on a
  // slow machine still gets paper, type, turns and reveals. What they lose is
  // depth-of-field, a second floor shadow and a cloth simulation — none of
  // which is the reason anybody opened the file.
  const grade = () => {
    const frames: number[] = []
    let last = performance.now()
    let raf = 0
    const tick = () => {
      const now = performance.now()
      frames.push(now - last)
      last = now
      if (frames.length < 64) raf = requestAnimationFrame(tick)
      else settle()
    }
    const settle = () => {
      cancelAnimationFrame(raf)
      // The first few frames include layout and font work and are never
      // representative; the median of the rest is.
      const s = frames.slice(8).sort((a, b) => a - b)
      const median = s[Math.floor(s.length / 2)] ?? 16
      // Against the display's OWN rhythm, not a fixed 60Hz. A 120Hz panel that
      // is comfortably hitting 8.3ms must not be graded the same as a 60Hz one
      // struggling at 16.6 — the number is identical in spirit and opposite in
      // meaning. The floor of the observed distribution is the display's true
      // interval, so the ratio is what matters.
      const best = s[Math.floor(s.length * 0.1)] ?? median
      const ratio = median / Math.max(best, 1)
      const tier = ratio > 2.2 || median > 34 ? 'perf-min'
        : ratio > 1.35 || median > 20 ? 'perf-lite'
          : 'perf-full'
      document.documentElement.classList.remove('perf-full', 'perf-lite', 'perf-min')
      document.documentElement.classList.add(tier)
      // Kept on the element so a reader can read it back, and so a bug report
      // can carry the real numbers rather than "it felt slow".
      document.documentElement.dataset.perf =
        `${tier} · ${median.toFixed(1)}ms median, ${best.toFixed(1)}ms floor, ${(1000 / median).toFixed(0)}fps`
    }
    raf = requestAnimationFrame(tick)
  }
  grade()
  let regrade: ReturnType<typeof setTimeout> | undefined
  window.addEventListener('resize', () => {
    clearTimeout(regrade)
    regrade = setTimeout(grade, 400)
  }, { passive: true })

  // THE FOLIO PASS. One pass over every printed page, never one at a time —
  // DESIGN.md §10, where hand-editing single folios is what produced two 2s,
  // two 3s and a gap from 4 to 7.
  //
  // A folio goes on every PRINTED page and never on a cover, a section board or
  // the colophon. The colophon is excluded by convention: it is the record of
  // how the book was made, not part of its argument.
  //
  // This used to number by raw DOM index and skip on `.hard`, a class the
  // markup never carries — boards are `.divider`. So boards were numbered, then
  // hidden by CSS, and the visible sequence ran 5, 6, 9, 10: precisely the
  // gapped run the reference audit exists to catch. Counting only the pages
  // that actually print a number is the fix, and it cannot drift because the
  // counter and the printing are the same statement.
  //
  // Front matter takes roman, and the first prose page starts at 2.
  const roman = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii']
  let front = 0
  let printed = 1
  pages.forEach((page) => {
    const skip = page.classList.contains('cover') || page.classList.contains('divider') ||
      page.classList.contains('hard') || page.classList.contains('colophon') ||
      page.dataset.stock === 'hard'
    if (skip) return
    const folio = document.createElement('span')
    folio.className = 'pageno'
    folio.setAttribute('data-slot', 'folio')
    folio.textContent = page.dataset.layout === 'contents'
      ? (roman[front++] ?? String(front))
      : String(++printed)
    ;(page.querySelector('.half') ?? page).appendChild(folio)
  })

  let flip: PageFlip
  try {
    flip = new PageFlip(bookEl, {
      // ONE PAGE, and its proportion MUST agree with `.book-3d`'s aspect-ratio
      // in book.css — a spread is two of these side by side, so
      //     spread ratio = 2 * width / height = 2 * 660 / 880 = 1.5
      //
      // They are two numbers describing one shape, and they drifted: the CSS
      // ratio was changed to 1.5 to make the book taller while this still said
      // 660x800, i.e. 1.65. page-flip honours its OWN ratio inside whatever box
      // it is given, so it laid out a 599px-tall spread inside a 659px-tall
      // container and left 30px of `.stf__block` showing above and below. That
      // block is painted in the PAPER colour, so the leftover read as cream
      // bands across the top and bottom of every page — a page design fault
      // with no cause anywhere in the page design.
      //
      // scripts/check.ts now asserts the two agree.
      // ONE PAGE OF THE FIXED STAGE. The stage is 1560 x 1040 — two of these
      // side by side — and is fitted to the window by a single transform on
      // `.book-3d`, so these are the real, absolute page dimensions rather than
      // an arbitrary pair with the right ratio.
      width: 780,
      height: 1040,
      size: 'stretch',
      minWidth: 320, maxWidth: 1980,
      minHeight: 420, maxHeight: 1200,
      showCover: false,
      usePortrait: true,
      maxShadowOpacity: 0.5,
      drawShadow: true,
      // page-flip rejects 0. Reduced-motion navigation uses turnToPage below,
      // but the constructor still needs a valid positive duration.
      flippingTime: reducedMotion ? 1 : 820,
      clickEventForward: true,
      // Taps must never turn the page — pages carry interactive content.
      // Corner drags and the buttons still work.
      disableFlipByClick: true,
      // No corner fold on HOVER. page-flip lifts the corner as the pointer merely
      // passes near it, which reads as the page twitching at you while you are
      // trying to read. Turning it off leaves drag-to-turn intact: the fold still
      // appears once you actually take hold of the corner, which is when a real
      // page lifts too.
      showPageCorners: false,
      mobileScrollSupport: false,
    })
    flip.loadFromHTML(pages)
  } catch (error) {
    // Keep the authored paper readable if page-flip cannot initialise. In
    // particular, never add the reveal gate before this point.
    console.warn('[book] page-flip unavailable:', error)
    return
  }

  // Only now, with page-flip loaded and the runtime definitely alive, is it
  // safe to hide content for the entrance animation — we are the ones who will
  // bring it back.
  document.documentElement.classList.add('js-anim')

  const spreadLabel = document.querySelector<HTMLElement>('.spread')
  const stage = document.querySelector<HTMLElement>('.book-3d')

  const index = () => {
    try { return flip.getCurrentPageIndex() } catch { return 0 }
  }

  const stackState = { page: 0 }
  let stackTween: gsap.core.Tween | undefined

  /** The unread stack shrinks on the right and grows on the left as you read. */
  function updateStacks(page = index()): void {
    if (!stage) return
    const span = Math.max(total - 2, 1)
    const progress = Math.min(Math.max(page / span, 0), 1)
    const THICK = 26
    const MIN = 5
    const left = Math.round(MIN + (THICK - 2 * MIN) * progress)
    stage.style.setProperty('--swl', `${left}px`)
    stage.style.setProperty('--swr', `${THICK - left}px`)
    stage.style.setProperty('--book-progress', progress.toFixed(3))
    stage.style.setProperty('--stack-bias', `${Math.round((progress - 0.5) * -12)}px`)
  }

  /**
   * A programmatic turn transfers the weight of the page block while the leaf
   * is in the air, rather than making both stacks jump after it lands. PageFlip
   * supplies the paper mesh; this carries the book's changing mass alongside it.
   */
  function animateStacks(toPage: number): void {
    if (reducedMotion || !stage) {
      stackState.page = toPage
      updateStacks(toPage)
      return
    }
    stackTween?.kill()
    stackTween = gsap.to(stackState, {
      page: toPage,
      duration: 0.78,
      ease: 'power2.inOut',
      overwrite: true,
      onUpdate: () => updateStacks(stackState.page),
    })
  }

  /** One handle for every tween the reveal starts, so a fast reader turning
      pages mid-animation cannot leave half-faded content stranded. */
  let revealCtx: gsap.Context | undefined
  /** Which spread the reveal last ran for, so one turn cannot fire it twice. */
  let revealedAt = -1
  /** The incoming spread must survive two paints before it is queried. */
  let revealFrame = 0

  function scheduleReveal(): void {
    cancelAnimationFrame(revealFrame)
    // PageFlip's `read` state means its own animation has finished, but the
    // incoming pages can still carry the previous display value until layout
    // and paint complete. Two frames guarantees the visibility filter below
    // sees the newly landed spread, not the leaf that just left it.
    revealFrame = requestAnimationFrame(() => {
      revealFrame = requestAnimationFrame(() => {
        revealFrame = 0
        if (document.body.classList.contains('open')) revealSpread()
      })
    })
  }

  // ── step-by-step reveal ───────────────────────────────────────────────────
  // A page arrives one block at a time, and NEXT means "next block" until the
  // spread is exhausted — only then does it turn. That is what makes the book
  // presentable: you talk to a point while it is the only thing on the page,
  // instead of putting the whole argument up and asking the room not to read
  // ahead. It costs nothing at the remote, because it hangs off the same next /
  // previous the clicker already sends.
  //
  // Off with `steps: false` in the front matter, for material meant to be read
  // rather than presented.
  const STEPS_ON = document.body.dataset.steps !== 'off'
  const TYPING_ON = document.body.dataset.typing === 'on'

  /**
   * The blocks on the spread you can see, in reading order — left page, then
   * right, document order within each.
   *
   * Recomputed on every press rather than cached. A cached list is a second
   * copy of the truth, and the first version kept one: it went stale whenever a
   * turn and a reveal raced, so `next` believed there were still five blocks to
   * show on a page holding two, ate every press and never turned the page. The
   * DOM already knows what is on screen; asking it costs nothing at the rate a
   * human presses a clicker.
   */
  function visibleBlocks(): HTMLElement[] {
    return [...document.querySelectorAll<HTMLElement>('.page')]
      .filter((p) => getComputedStyle(p).display !== 'none')
      // BOARDS HOLD NO STEPS. The reveal pass already refuses to animate a
      // cover or a section board, but this is the OTHER half of that rule and
      // it was missing: a board's number, kicker and title still counted as
      // three blocks here, so `next` spent three presses "advancing" through
      // content that was already fully visible before it would turn the leaf.
      // From the reader's side the clicker simply stopped working on every
      // board in the book. Excluded at the source, so the reveal pass and the
      // step counter cannot disagree about what a board contains.
      .filter((p) => !p.classList.contains('divider') && !p.classList.contains('cover'))
      .flatMap((p) => [...(p.querySelector('.reveal')?.children ?? [])] as HTMLElement[])
  }

  /**
   * The blocks grouped and ordered into the STEPS a press moves through.
   *
   * Document order is the default and is right most of the time, but not
   * always, so three classes — written in the Markdown with `markdown-it-attrs`
   * and proposed by `node scripts/prep.ts` — bend it:
   *
   *   .step-first        arrive with the page, whatever the position on it
   *   .step-last         arrive last, so a takeaway lands after its argument
   *   .with-previous     arrive WITH the block above: a caption is not a beat,
   *                      and neither is a sticky note on the paragraph it annotates
   *
   * Only the ORDER OF ARRIVAL changes. Nothing moves on the page — a block
   * marked `.step-last` still sits exactly where it was typed, it simply waits
   * its turn. Reordering the layout as a side effect of pacing would make the
   * printed page and the presented page two different documents.
   */
  function stepGroups(): HTMLElement[][] {
    const blocks = visibleBlocks()
    // Also consult a lone child. `![pic](x){.with-previous}` puts the class on
    // the <img>, because that is the token the author attached it to — but the
    // block markdown-it wraps it in is the <p>, and the <p> is what a step moves.
    // Reading through one level of wrapping means the marker works where the
    // author naturally writes it, rather than only where the parser happens to
    // leave it.
    const has = (el: HTMLElement, c: string) =>
      el.classList.contains(c) ||
      (el.children.length === 1 && (el.firstElementChild as HTMLElement).classList.contains(c))
    const ordered = [
      ...blocks.filter((b) => has(b, 'step-first')),
      ...blocks.filter((b) => !has(b, 'step-first') && !has(b, 'step-last')),
      ...blocks.filter((b) => has(b, 'step-last')),
    ]
    const groups: HTMLElement[][] = []
    for (const b of ordered) {
      // `.with-previous` on the very first block has nothing to join, so it
      // opens a group rather than being silently dropped.
      if (has(b, 'with-previous') && groups.length > 0) groups[groups.length - 1]!.push(b)
      else groups.push([b])
    }
    return groups
  }

  /** Parked, i.e. waiting its turn. GSAP writes the hold as an inline opacity. */
  const parked = (el: HTMLElement): boolean => (parseFloat(el.style.opacity || '1') || 0) < 0.5
  /** Text mid-typing, so leaving a spread can never strand a half-written line. */
  let typed: Array<{ el: HTMLElement; full: string }> = []

  function restoreTyped(): void {
    typed.forEach(({ el, full }) => { el.textContent = full })
    typed = []
  }

  /**
   * Write a line on, character by character.
   *
   * Only for elements with no child ELEMENTS — retyping innerHTML would rebuild
   * markup one bracket at a time and briefly render raw tags. The full string is
   * restored on completion and by `restoreTyped()`, because GSAP's revert()
   * undoes inline styles and knows nothing about text content.
   */
  function typeOn(el: HTMLElement, tl: gsap.core.Timeline, at: number): void {
    const full = el.textContent ?? ''
    typed.push({ el, full })
    const state = { n: 0 }
    el.textContent = ''
    tl.set(el, { opacity: 1, y: 0 }, at)
    tl.to(state, {
      n: full.length,
      // Fast enough to keep up with a speaker, capped so a long paragraph does
      // not hold the room hostage.
      duration: Math.min(0.018 * full.length, 2.0),
      ease: 'none',
      onUpdate: () => { el.textContent = full.slice(0, Math.round(state.n)) },
      onComplete: () => { el.textContent = full },
    }, at)
  }

  /**
   * DIAGRAMS. svg.js drew these at build time and emitted them INLINE, which is
   * the whole reason GSAP can animate them: a data URI would be an opaque image,
   * but an inline <svg> is a document with reachable elements. Three passes, in
   * the order a person would draw it — connectors first, then boxes, then their
   * labels.
   *
   * Lives here rather than in the page reveal so a diagram animates when ITS
   * step arrives. A chart that drew itself while the reader was still on the
   * paragraph above it has already spent its one moment of attention.
   */
  function animateDiagrams(root: HTMLElement, tl: gsap.core.Timeline, at: number): void {
    try {
      for (const fig of root.querySelectorAll<SVGElement>('.diagram svg')) {
        const links = fig.querySelectorAll<SVGGeometryElement>('.dg-link')
        const nodes = fig.querySelectorAll('.dg-node')
        const bars = fig.querySelectorAll<SVGRectElement>('.dg-bar')
        const labels = fig.querySelectorAll('.dg-label')

        // stroke-dashoffset makes a line DRAW itself rather than fade in.
        // getTotalLength() exists only on geometry elements, so arrow heads
        // fall through to a plain fade.
        links.forEach((link) => {
          const len = typeof link.getTotalLength === 'function' ? link.getTotalLength() : 0
          if (len > 0) {
            tl.fromTo(link,
              { strokeDasharray: len, strokeDashoffset: len },
              { strokeDashoffset: 0, duration: 0.5, ease: 'power2.inOut' }, at + 0.06)
          } else {
            tl.from(link, { opacity: 0, duration: 0.3 }, at + 0.31)
          }
        })
        if (nodes.length) {
          tl.from(nodes, {
            opacity: 0, scale: 0.72, transformOrigin: '50% 50%',
            duration: 0.42, ease: 'back.out(1.7)', stagger: 0.08,
          }, at + 0.11)
        }
        // A bar chart reads as measurement, so bars GROW from the baseline.
        if (bars.length) {
          tl.from(bars, {
            scaleX: 0, transformOrigin: '0% 50%',
            duration: 0.6, ease: 'power3.out', stagger: 0.09,
          }, at + 0.16)
        }
        if (labels.length) {
          tl.from(labels, { opacity: 0, duration: 0.3, stagger: 0.05 }, at + 0.36)
        }
      }
    } catch (err) {
      // A diagram that will not animate must never take the page's whole reveal
      // with it — the content matters, the flourish does not.
      console.warn('[diagram] animation skipped:', err)
    }
  }

  /**
   * Everything a single step brings in: the block, and any diagram inside it.
   *
   * fromTo, NEVER from. A `from` tween takes the element's CURRENT state as its
   * destination — and a step waiting its turn is parked at opacity 0, so `from`
   * dutifully animated 0 to 0 and every page after the first went blank while
   * next silently ate the presses. The end state has to be stated, not inferred
   * from a state that is deliberately wrong.
   */
  function animateStep(el: HTMLElement, tl: gsap.core.Timeline, at: number): void {
    if (TYPING_ON && el.children.length === 0 && (el.textContent ?? '').trim()) {
      typeOn(el, tl, at)
    } else {
      tl.fromTo(el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, at)
    }
    animateDiagrams(el, tl, at)
  }

  /** Reveal the next block. Returns false when the spread has nothing left. */
  function advanceStep(): boolean {
    if (!STEPS_ON) return false
    const next = stepGroups().find((g) => g.some(parked))
    if (!next) return false
    const run = () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      // Members of one group share a step but not an instant: a caption landing
      // a beat behind its picture reads as one movement, whereas both arriving
      // on the same frame reads as a jump cut.
      next.forEach((el, i) => animateStep(el, tl, i * 0.09))
    }
    if (revealCtx) revealCtx.add(run)
    else run()
    return true
  }

  /**
   * Finish this page's reveals at once.
   *
   * DESIGN.md §8: "The presenter can always skip. Holding the forward key or
   * pressing End completes every remaining step immediately. Nobody should be
   * trapped watching their own animation."
   *
   * `End` used to jump to the LAST SPREAD of the book, which is the ordinary
   * meaning of the key and the wrong one here: a presenter reaching for it
   * wants out of an animation, not out of their place in the document. It
   * skipped past everything they were about to talk about.
   *
   * Everything remaining lands together and fast rather than instantly, so the
   * page still reads as arriving rather than blinking into existence.
   */
  function finishSteps(): boolean {
    if (!STEPS_ON) return false
    const rest = stepGroups().filter((g) => g.some(parked)).flat()
    if (rest.length === 0) return false
    const run = () => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
      rest.forEach((el, i) => animateStep(el, tl, i * 0.03))
    }
    if (revealCtx) revealCtx.add(run)
    else run()
    return true
  }

  /**
   * Take the last block back. Returns false when only the first one is left —
   * the page never empties completely, so a press at the top of a page turns
   * back rather than leaving the reader on a blank sheet.
   */
  function retreatStep(): boolean {
    if (!STEPS_ON) return false
    const groups = stepGroups()
    const lastShown = groups.map((g) => g.some(parked)).lastIndexOf(false)
    if (lastShown <= 0) return false
    const group = groups[lastShown]!
    const run = () => { gsap.to(group, { opacity: 0, y: 16, duration: 0.22 }) }
    if (revealCtx) revealCtx.add(run)
    else run()
    return true
  }

  function revealSpread(): void {
    if (reducedMotion) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'))
      return
    }
    const here = index()
    if (here === revealedAt) return
    const backwards = here < revealedAt && revealedAt !== -1
    // ONLY the spread you can actually see, and EVERY time you arrive at it.
    //
    // Two separate faults lived here, and each on its own was enough to make the
    // whole book look like static paper:
    //
    //  1. The selector took every `.reveal` in the document. page-flip keeps all
    //     thirty pages in the DOM for the life of the book and hides the
    //     off-screen ones with `display:none`, so the first reveal built ONE
    //     timeline over all twenty-eight of them while two were on screen.
    //  2. `onComplete` then stamped `in` on the lot, and `in` was a permanent
    //     "already animated" flag. From that moment the function returned
    //     immediately, for good.
    //
    // Note page-flip puts `stf__item` ON the page element itself rather than in
    // a wrapper, so the visibility test has to walk to `.page`, not to a parent.
    //
    // The `in` flag is gone. An entrance animation is not a one-time initiation
    // — this is presentation material, the reader turns back and forth, and a
    // heading that slides in going forwards but not coming back reads as broken.
    // Re-arriving at a spread replays it. `revealedAt` only guards against the
    // same spread being announced twice by one turn.
    const fresh = [...document.querySelectorAll<HTMLElement>('.reveal')]
      .filter((el) => {
        const page = el.closest<HTMLElement>('.page')
        if (!page || getComputedStyle(page).display === 'none') return false
        // BOARDS DO NOT ANIMATE. A section divider and the cover are not pages
        // of argument — they are punctuation, and the whole board IS the beat.
        // Staggering a number, a kicker and a rule onto a board turns a full
        // stop into three separate events, and worse, makes the reader wait for
        // a press to see something they are meant to read at a glance and pass.
        if (page.classList.contains('divider') || page.classList.contains('cover')) {
          // Still lift the CSS hold, or the board would simply be blank: the
          // `in` class is what releases `.js-anim .reveal { opacity: 0 }`, and
          // nothing else is going to release it for a page we chose to skip.
          el.classList.add('in')
          return false
        }
        return true
      })
    if (fresh.length === 0) return

    // CLAIM THE SPREAD ONLY ONCE THERE IS SOMETHING TO ANIMATE. Setting this up
    // beside the guard at the top looks tidier and is fatal: a call that arrives
    // before page-flip has swapped `display` finds nothing to do and returns —
    // but has already recorded the spread as revealed, so the real call that
    // follows is turned away by its own guard and the page never animates at
    // all. The marker has to be earned, not claimed on entry.
    revealedAt = here
    restoreTyped()

    // Kill anything still running from the previous spread, and — critically —
    // revert its inline styles, so a half-finished tween never leaves an
    // element stuck at opacity .4.
    revealCtx?.revert()

    // Hand these pages over to GSAP. `.js-anim .reveal` is held at opacity 0 by
    // CSS so content can never flash un-animated, and `in` is what lifts that
    // hold. It used to be added on COMPLETE, which made it a permanent
    // "already done" flag; it is added up front now, and the opening tween below
    // sets opacity back to 0 on the very same tick, so there is no flash and the
    // page is free to animate again every time the reader returns to it. The
    // gate still fails visible: if the runtime never starts, `.js-anim` is never
    // set and every page renders as plain, readable paper.
    fresh.forEach((el) => el.classList.add('in'))

    revealCtx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // The page settles, then its contents arrive. Choreographed in three
      // passes rather than one flat stagger: the eyebrow leads, the heading
      // follows under it, and the body catches up — the way a reader's eye
      // actually moves down a page.
      for (const el of fresh) {
        const kicker = el.parentElement?.parentElement?.querySelector('.band .bk')
        const heading = el.parentElement?.parentElement?.querySelector('.band .bt')

        if (kicker) tl.from(kicker, { opacity: 0, x: -14, duration: 0.42 }, 0)
        if (heading) tl.from(heading, { opacity: 0, y: 18, duration: 0.52 }, 0.06)

        // At position 0, not 0.1: this tween owns the hidden start state now
        // that the CSS gate has been lifted, so any delay here is a frame of
        // fully-visible content before it snaps back to transparent.
        tl.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.42 }, 0)
      }

      // THE BLOCKS, left page then right, grouped and ordered into steps.
      const blocks = fresh.flatMap((el) => [...el.children] as HTMLElement[])
      if (blocks.length === 0) return

      // Everything at once for `steps: false`, and also when arriving BACKWARDS:
      // a reader turning back is looking for something they have already been
      // shown, and making them click through it again would be a puzzle rather
      // than a presentation. Document order here, not step order — this is the
      // page as printed, and the pacing no longer applies.
      if (!STEPS_ON || backwards) {
        blocks.forEach((el, i) => animateStep(el, tl, 0.14 + i * 0.06))
        return
      }

      // The FIRST GROUP comes in with the page — a spread that opens completely
      // empty reads as a loading failure, not as anticipation. Everything else
      // is parked, and parked by GSAP rather than by CSS so that a runtime which
      // never starts leaves the whole page readable.
      const groups = stepGroups()
      // A HELD PRESS IS THIS PAGE'S FIRST BEAT — DESIGN.md §8. Someone who
      // pressed again while the paper was still moving has already asked for
      // the opening group; running the automatic one as well would mean one
      // click revealed two things, and the page would arrive a beat ahead of
      // where the presenter thinks they are for the rest of it. Consumed here
      // rather than replayed afterwards, so the two can never both fire.
      // Consumed here whether or not it was set, so a press that somehow
      // outlives its own turn cannot be spent on a later page — a stale intent
      // would reveal two blocks on a spread the presenter arrived at cleanly,
      // which is a worse bug than the dropped press this exists to fix.
      const claimed = heldIntent === 'next'
      heldIntent = null
      const opening = claimed ? [...(groups[0] ?? []), ...(groups[1] ?? [])] : (groups[0] ?? [])
      opening.forEach((el, i) => animateStep(el, tl, 0.14 + i * 0.09))
      const rest = groups.slice(claimed ? 2 : 1).flat()
      if (rest.length > 0) gsap.set(rest, { opacity: 0, y: 16 })
    })
  }

  function sync(reveal = false): void {
    if (spreadLabel) {
      spreadLabel.textContent = `${Math.floor(index() / 2) + 1} / ${Math.ceil(total / 2)}`
    }
    updateStacks()
    updateTabs()
    if (index() > furthest) furthest = index()
    if (reveal) scheduleReveal()
  }

  // ── fore-edge tabs ──────────────────────────────────────────────────────
  // +2 because the cover spread sits ahead of the authored pages.
  const tabs = [...document.querySelectorAll<HTMLElement>('.tab')]
  tabs.forEach((tab) => {
    const target = Number(tab.dataset.page ?? 0) + 2
    tab.addEventListener('click', () => { open(); turnTo(target) })
  })
  /**
   * A tab you have passed hops to the left edge — the fore-edge IS the progress
   * bar.
   *
   * The rail is an OVERLAY: it floats above the book and cannot rotate. So the
   * moment a board is actually on screen, its rail tab steps aside and the tab
   * glued to the board itself takes over — that one is a child of the page, so
   * it swings round with the turn instead of sitting still and then teleporting
   * to the far edge when the page lands.
   */
  function updateTabs(): void {
    const here = index()
    tabs.forEach((tab) => {
      const target = Number(tab.dataset.page ?? 0) + 2
      tab.classList.toggle('read', target < here)
      // `target` is the board's LEFT face; the glued tab lives on its right
      // face, one page along. Either being on screen means the real tab is
      // visible, so the stand-in must not double it up.
      tab.classList.toggle('onboard', here === target || here === target + 1)
    })
  }

  // Any turn at all retires the rail until the page settles. Mid-arc is exactly
  // when a static overlay reads as broken, and it has nothing useful to say
  // while the reader is already moving.
  const rail = document.querySelector<HTMLElement>('.tabs')
  const currentStride = (): number =>
    [...pages].filter((page) => getComputedStyle(page).display !== 'none').length > 1 ? 2 : 1
  let requestedDirection = 0
  flip.on('changeState', (e) => {
    const state = String(e.data)
    rail?.classList.toggle('turning', state !== 'read')
    stage?.classList.toggle('is-turning', state !== 'read')
    if (state === 'flipping' && requestedDirection !== 0) {
      // Landscape turns move a spread; portrait turns move one leaf. Inspecting
      // the live pages keeps the visual stack correct across responsive modes.
      const stride = currentStride()
      animateStacks(index() + requestedDirection * stride)
    }
    // 'read' means the turn has FINISHED and the new spread is painted. The
    // `flip` event fires too early: at that moment page-flip has not yet swapped
    // `display` on the incoming pages, so a reveal driven from it looked at the
    // OUTGOING spread, found nothing new, and returned. That is why the entrance
    // animation appeared to work when jumping via a tab and not when turning
    // page by page — the two paths simply race differently.
    if (state === 'read') {
      requestedDirection = 0
      stackTween?.kill()
      stackState.page = index()
      updateStacks()
      sync(false)
      scheduleReveal()
    }
  })

  // ── ribbon bookmark ─────────────────────────────────────────────────────
  let furthest = 0
  const ribbon = document.querySelector<HTMLElement>('.ribbon')
  ribbon?.addEventListener('click', () => { open(); turnTo(furthest) })

  // `flip` updates progress and labels, but does not reveal: it is emitted
  // before the new DOM spread is reliably paintable. `changeState: read` above
  // owns that job through the two-frame hand-off.
  flip.on('flip', () => sync(false))
  flip.on('init', () => { sync(false); scheduleReveal() })

  // Blur after a click. A presenter remote sends Space/Enter, and a focused
  // button swallows those to re-fire ITSELF — so after one click on "next" the
  // clicker would keep pressing next even when the presenter meant back.
  const navClick = (sel: string, fn: () => void) =>
    document.querySelector<HTMLElement>(sel)?.addEventListener('click', (e) => {
      fn()
      ;(e.currentTarget as HTMLElement).blur()
    })
  // ONE meaning of forward, shared by the buttons, the keyboard and therefore
  // every presenter remote: bring in the next block, and turn the page only once
  // the spread has nothing left to give. The remote needs no special handling —
  // it is already sending these keys.
  const turnNext = (): void => {
    requestedDirection = 1
    if (reducedMotion) {
      flip.turnToPage(Math.min(index() + currentStride(), total - 1))
      stackState.page = index()
      updateStacks()
      scheduleReveal()
    } else {
      flip.flipNext('bottom')
    }
  }
  const turnPrev = (): void => {
    requestedDirection = -1
    if (reducedMotion) {
      flip.turnToPage(Math.max(index() - currentStride(), 0))
      stackState.page = index()
      updateStacks()
      scheduleReveal()
    } else {
      flip.flipPrev('bottom')
    }
  }
  const turnTo = (target: number): void => {
    const current = index()
    requestedDirection = Math.sign(target - current)
    if (reducedMotion) {
      flip.turnToPage(target)
      stackState.page = index()
      updateStacks()
      requestAnimationFrame(() => { sync(false); scheduleReveal() })
    } else if (target !== current) {
      flip.flip(target, 'bottom')
    }
  }
  /**
   * A PRESS DURING A TURN IS NOT A PRESS INTO THE VOID.
   *
   * DESIGN.md §8. A presenter mashing the clicker through a turn was losing
   * every press that landed while the paper moved — and it is usually the one
   * that would have revealed the page they are already talking to, because the
   * natural thing to do is press again the instant you decide to move on.
   *
   * Only the LAST intent is held. Replaying four queued presses would fly past
   * the page the presenter was heading for, which is a worse failure than
   * dropping them: they would have to navigate back, in front of the room.
   *
   * `heldIntent` is also read by the reveal, because a held press IS the
   * arriving page's first beat. Without that the automatic first step and the
   * replayed press both fire and one click reveals two things.
   */
  let heldIntent: 'next' | null = null
  const turning = () => stage?.classList.contains('is-turning') ?? false

  const goNext = (): void => {
    if (turning()) { heldIntent = 'next'; return }
    // Any press that STARTS a turn clears the slate, so an intent can only ever
    // belong to the turn currently in the air.
    heldIntent = null
    if (!advanceStep()) turnNext()
  }
  // FORWARD ONLY, which is what §8 describes — "a presenter mashing the forward
  // key through a turn". A backward press mid-turn is still dropped, and that
  // is deliberate rather than an omission: holding it would mean the book keeps
  // moving backwards after the reader has already seen the page they wanted and
  // stopped pressing, which is the runaway the last-intent-only rule exists to
  // prevent, pointed the other way.
  const goPrev = (): void => { if (turning()) return; if (!retreatStep()) turnPrev() }

  navClick('[data-action="next"]', goNext)
  navClick('[data-action="prev"]', goPrev)
  navClick('[data-action="riffle"]', () => { void riffle() })
  navClick('[data-action="close"]', () => { void closeShow() })

  /**
   * RIFFLE back to the front — the thumb-flick you give a book to get back to
   * the beginning.
   *
   * Deliberately NOT `flip.flip(0)`, which is a single 850ms turn and reads as
   * a jump cut: the reader loses all sense of how far they had come. And not a
   * queue of normal turns either — page-flip cancels an in-flight animation when
   * the next is requested, so chaining them just drops frames.
   *
   * Instead each spread is placed INSTANTLY, in quick succession, which is
   * exactly what riffling looks like: pages flashing past too fast to read. The
   * interval eases out, so it tears away from where you were and settles onto
   * the first page rather than stopping dead — a real riffle loses momentum
   * against the thumb.
   */
  let riffling = false
  async function riffle(): Promise<void> {
    if (riffling) return
    const from = index()
    if (from <= 0) return
    riffling = true
    document.body.classList.add('riffling')

    if (reducedMotion) {
      flip.turnToPage(0)
      document.body.classList.remove('riffling')
      riffling = false
      return
    }

    // Spreads, not pages: a two-page leaf turns as one.
    const stops: number[] = []
    for (let i = from - (from % 2); i >= 0; i -= 2) stops.push(i)

    // 26ms between jumps was roughly 38 spreads a second — far past the rate the
    // eye resolves as motion, so it read as a strobe rather than a riffle. A
    // thumb releases pages at closer to 8-12 a second. Everything below the last
    // leaf is placed instantly at that rate; the FINAL turn is a real animated
    // flip, so the book settles onto page one instead of snapping to it.
    const settle = stops.pop()
    for (const [n, target] of stops.entries()) {
      flip.turnToPage(target)
      updateStacks()
      const t = stops.length > 1 ? n / (stops.length - 1) : 1
      await new Promise((r) => setTimeout(r, 88 + 150 * t * t))
    }
    if (settle !== undefined) {
      await new Promise((r) => setTimeout(r, 90))
      turnTo(settle)                          // animated, not placed
      await new Promise((r) => setTimeout(r, 900))
    }

    document.body.classList.remove('riffling')
    riffling = false
    sync()
  }

  /**
   * PRESENTER REMOTES. A wireless presenter (Logitech R400/R500/Spotlight,
   * Kensington, the no-name ones) is not a special device that needs an API: it
   * enumerates as a USB HID KEYBOARD and sends ordinary keystrokes. So making
   * the book "clicker compatible" means covering the keys those devices
   * actually emit — which is more than the arrows.
   *
   *   forward   Right, Down, PageDown, Space, Enter   (PageDown is the default
   *                                                    on most Logitech units)
   *   back      Left, Up, PageUp, Backspace
   *   start     F5                                     (and Shift+F5)
   *   end/exit  Escape, period       -> close the book and drop the curtain
   *   blank     b, B, full-stop      -> the black-screen key presenters expect
   *   ends      Home / End
   *
   * Two things that silently break clicker support and are guarded here:
   *   1. If focus sits on one of the on-screen buttons, Space/Enter would
   *      re-fire THAT button instead of paging. The buttons are blurred after a
   *      click for exactly this reason.
   *   2. `key` values differ across layouts; these are all layout-independent
   *      named keys, so no `code`/`keyCode` mapping is needed.
   */
  const FORWARD = new Set(['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter', 'Spacebar'])
  const BACK = new Set(['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'])

  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return

    // Blackout is a presenter's panic key and must work at any point.
    if (e.key === 'b' || e.key === 'B' || e.key === '.') {
      e.preventDefault()
      document.body.classList.toggle('blackout')
      return
    }
    if (document.body.classList.contains('blackout')) {
      e.preventDefault()
      document.body.classList.remove('blackout')
      return
    }

    // `?` reports what the book measured on THIS machine. It exists because a
    // performance complaint is otherwise unanswerable: "it feels slow" cannot
    // be reproduced by whoever built it, on different hardware, at a different
    // pixel ratio, with a different GPU. This turns it into numbers that can be
    // pasted into a message.
    if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
      e.preventDefault()
      const el = document.documentElement
      const box = document.createElement('div')
      box.setAttribute('role', 'status')
      box.style.cssText =
        'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:1000;' +
        'background:rgba(0,0,0,.88);color:#fff;padding:1.2rem 1.5rem;border-radius:10px;' +
        'font:13px/1.7 ui-monospace,Menlo,monospace;max-width:34rem;white-space:pre-wrap'
      const stage = document.querySelector<HTMLElement>('.book-3d')
      box.textContent = [
        `tier      ${el.dataset.perf ?? 'not graded yet'}`,
        `screen    ${window.innerWidth}x${window.innerHeight} at ${window.devicePixelRatio}x`,
        `stage     ${stage?.offsetWidth}x${stage?.offsetHeight} drawn at ` +
          `${Math.round(stage?.getBoundingClientRect().width ?? 0)}px`,
        `cloth     ${document.querySelector('#curtain-gl canvas') ? 'WebGL' : 'CSS fallback'}`,
        `pages     ${total}`,
        '',
        'press any key to dismiss',
      ].join('\n')
      document.body.appendChild(box)
      const drop = () => { box.remove(); document.removeEventListener('keydown', drop, true) }
      setTimeout(() => document.addEventListener('keydown', drop, true), 60)
      return
    }
    if (e.key === 'f' || e.key === 'F5') {
      e.preventDefault()
      if (!document.fullscreenElement) void document.documentElement.requestFullscreen?.()
      return
    }
    // Escape means "end the show". Browsers also send it when leaving
    // fullscreen, so only treat it as a close when we are not doing that.
    if (e.key === 'Escape') {
      if (document.fullscreenElement) return
      e.preventDefault()
      void closeShow()
      return
    }

    if (!document.body.classList.contains('open')) {
      if (FORWARD.has(e.key)) { e.preventDefault(); void advanceFromClosed() }
      return
    }

    if (FORWARD.has(e.key)) { e.preventDefault(); goNext() }
    else if (BACK.has(e.key)) { e.preventDefault(); goPrev() }
    else if (e.key === 'Home') { e.preventDefault(); turnTo(0) }
    // `End` FINISHES THIS PAGE'S REVEALS — it does not jump to the last spread.
    // See finishSteps(). If the page is already whole there is nothing to skip,
    // so it does nothing rather than silently becoming a navigation key.
    else if (e.key === 'End') { e.preventDefault(); finishSteps() }
  })

  /** A forward press before the book is open advances the SEQUENCE, not a page. */
  async function advanceFromClosed(): Promise<void> {
    if (curtain && !document.body.classList.contains('curtain-done')) {
      await curtain.open()
      return
    }
    open()
  }

  // ── opening the book ────────────────────────────────────────────────────
  let opened = false
  function open(): void {
    if (opened) return
    opened = true
    document.body.classList.add('open')

    if (reducedMotion) {
      document.body.classList.add('opened-done')
      sync(false)
      scheduleReveal()
      resume()
      return
    }

    // The opening is one timeline rather than three racing CSS transitions, so
    // the beats stay in step no matter how slow the device is: the volume
    // squares up, the cover swings on its spine, the spread arrives behind it,
    // and only then is the cover retired.
    // CSS owns the physical motion (see the timing table in book.css); this
    // timeline is the CLOCK that keeps JS in step with it. Its length must
    // therefore match the last CSS beat — 1.22s — not exceed it. It used to run
    // to 2.05s, because `.to({}, {duration: 1.15})` with no position appends
    // AFTER the 0.9s call rather than starting at zero, leaving ~800ms of dead
    // air in which nothing moved and the closed cover sat over the open spread.
    gsap.timeline({
      onComplete: () => { document.body.classList.add('opened-done'); resume() },
    })
      // Page content begins arriving as the spread settles, not after it has
      // landed, so the two motions read as one continuous reveal.
      .call(() => { sync(false); scheduleReveal() }, undefined, 0.86)
      .to({}, { duration: 1.25 }, 0)
  }

  /**
   * Jump to the remembered spread once the book is actually open. Deliberately
   * NOT a flip: turning twenty leaves to reach page 21 is a slot-machine, not a
   * resume. The opening theatre still plays in full — it is the brand moment
   * and skipping it would make a resumed book feel like a different product.
   */
  let resumed = false
  function resume(): void {
    if (resumed) return
    resumed = true
    if (resumeAt > 0 && resumeAt !== index()) {
      flip.turnToPage(resumeAt)
      stackState.page = index()
      updateStacks()
      scheduleReveal()
    }
  }

  // ── closing: the whole sequence in reverse ──────────────────────────────
  /**
   * Shut the book, then let the curtain back down — the opposite of the way in.
   * Deliberately sequential rather than simultaneous: the cloth arriving while
   * the covers are still swinging reads as two unrelated animations firing at
   * once, whereas waiting for the book to shut makes it one gesture.
   */
  /** Must match the closing timing table in book.css. */
  const CLOSE_MS = 1650
  /** Guards against a second Escape landing mid-close and desyncing the order. */
  let closing = false

  async function closeShow(): Promise<void> {
    if (closing) return
    if (!opened && !handleCurtainOpen()) return
    closing = true
    remember()                       // where we stopped is worth keeping

    if (opened) {
      opened = false
      document.body.classList.remove('opened-done')
      // `closing` goes on BEFORE `open` comes off, so the element never spends a
      // frame with no transition attached — that gap is what made the closed
      // volume snap into view instead of arriving.
      document.body.classList.add('closing')
      document.body.classList.remove('open')

      // Wait for the cover to actually finish swinging shut. The old 620ms was
      // shorter than the book's own motion, so the curtain came down over a
      // book that was still closing.
      if (!reducedMotion) await new Promise((r) => setTimeout(r, CLOSE_MS))
    }

    await curtain?.close()
    // Only now is the cloth back down and covering the book, so restoring the
    // resting state cannot be seen.
    document.body.classList.remove('closing')
    resumed = false
    closing = false
  }
  const handleCurtainOpen = () => document.body.classList.contains('curtain-done')

  document.querySelector('[data-action="close"]')?.addEventListener('click', () => {
    void closeShow()
  })

  // ── remembering where you got to ────────────────────────────────────────
  /**
   * Reopen on the page you left. Keyed by the book's own title and length, NOT
   * by URL: every `file://` document shares ONE localStorage origin, so a plain
   * key would make two different workbooks overwrite each other's progress the
   * moment both are opened from a folder or a USB stick.
   *
   * Storage can also be unavailable outright (private mode, a locked-down
   * policy), so every access is guarded — a book that throws on load because it
   * could not read a bookmark would be a far worse failure than forgetting one.
   */
  const MEMORY_KEY = (() => {
    const seed = `${document.title}|${total}`
    let h = 0
    for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0
    // Namespaced by the kit's own name. It said `learn-kit:` — the name this
    // skill had before it became Tell Your Story — which is only cosmetic in
    // storage but is the kind of leak that outlives every other trace of a
    // rename. Books already built keep their own key, since each carries its
    // own runtime; only new ones move.
    return `tell-your-story:book:${(h >>> 0).toString(36)}`
  })()

  function remember(): void {
    try { localStorage.setItem(MEMORY_KEY, String(index())) } catch { /* storage denied */ }
  }
  function recall(): number {
    try {
      const raw = localStorage.getItem(MEMORY_KEY)
      const n = raw === null ? 0 : Number(raw)
      return Number.isFinite(n) && n > 0 && n < total ? n : 0
    } catch { return 0 }
  }

  // Read ONCE, at boot. The first `flip` event overwrites storage, so asking
  // later would only ever return where we already are.
  const resumeAt = recall()

  flip.on('flip', remember)
  // A tab closed or backgrounded mid-read must still be remembered; 'unload'
  // is unreliable on mobile, 'visibilitychange' is the one that actually fires.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') remember()
  })

  const cover = document.querySelector<HTMLElement>('.book-closed')
  cover?.addEventListener('click', open)
  cover?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open() }
  })

  // ── the full sequence ───────────────────────────────────────────────────
  // curtain closed -> drawn back -> the floating book is revealed -> tap it to
  // open. The curtain stops intercepting clicks once it has finished so the
  // book underneath becomes reachable.
  const curtain = initCurtain(() => {
    document.body.classList.add('curtain-done')
    // One continuous piece of theatre: the cloth parts, the revealed book is
    // allowed a beat to be seen floating, and then it opens on its own. A
    // reader who taps during that beat just gets there sooner — `open()` is
    // idempotent, so the two paths cannot collide.
    if (!reducedMotion) setTimeout(open, 1200)
    else open()
  })

  // No curtain in the document (or a deep link straight to a spread): go
  // directly to the book rather than waiting for a gesture that never comes.
  if (!curtain) document.body.classList.add('curtain-done')
  if (location.hash) {
    void curtain?.open()
    document.body.classList.add('curtain-done')
    open()
  }

  // Controls fade away while you read and return on any movement — this is
  // presentation material, so the chrome should not compete with the content.
  let idleTimer: ReturnType<typeof setTimeout> | undefined
  function poke(): void {
    document.body.classList.remove('idle')
    clearTimeout(idleTimer)
    idleTimer = setTimeout(() => {
      if (document.body.classList.contains('open')) document.body.classList.add('idle')
    }, 2600)
  }
  ;['mousemove', 'keydown', 'touchstart', 'click'].forEach((evt) =>
    document.addEventListener(evt, poke, { passive: true }))
  poke()

  // Wrapped, not passed directly: updateStacks takes a page number, and handing
  // it straight to addEventListener would feed it the resize Event as the page.
  window.addEventListener('resize', () => updateStacks())
  sync(false)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot)
} else {
  boot()
}
