/* ═══════════════════════════════════════════════════════════════════════════
   THE BOOK — SELF-AUDIT
   ---------------------------------------------------------------------------
   Paste into the browser console with the book open (past the curtain), or run
   it after any edit. Every check here exists because the thing it checks for
   went wrong at least once during the design.

     bookAudit()        run everything, print a report
     bookAudit(true)    also return the machine-readable result

   Add a check whenever you fix a class of bug. A rule in prose gets forgotten;
   a rule that fails out loud does not.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  const RUNTIME_TOKENS = [
    '--curl', '--spec', '--swl', '--swr', '--i', '--pen', '--undrawn',
    '--book-progress', '--stack-bias', '--t-riffle-quick', '--tilt', '--bar', '--fan'
  ];

  const LAYOUTS = [
    'cover-front', 'cover-inside', 'contents', 'section-board', 'chapter-opener',
    'prose', 'marginalia', 'quote', 'statement', 'half-bleed', 'full-bleed',
    'table', 'chart', 'timeline', 'comparison', 'colophon'
  ];

  function run() {
    const fail = [], warn = [], note = [];
    const pages = [...document.querySelectorAll('.page')];
    const leaves = [...document.querySelectorAll('.leaf')];

    /* ── 1. the leaf model ──────────────────────────────────────────────────
       A leaf's front is always a RECTO and its back always a VERSO. Getting
       this wrong mirrors the gutter shadow, the margins and the folio, and it
       is invisible until you look at the spread and something feels off. */
    leaves.forEach((l, i) => {
      const f = l.querySelector('.leaf-face.front .page');
      const b = l.querySelector('.leaf-face.back .page');
      if (f && !(f.classList.contains('pr') || f.classList.contains('cr')))
        fail.push(`L${i + 1} front is not a recto (needs pr or cr): ${f.className}`);
      if (b && !(b.classList.contains('pl') || b.classList.contains('cl')))
        fail.push(`L${i + 1} back is not a verso (needs pl or cl): ${b.className}`);
    });

    /* ── 2. folios ──────────────────────────────────────────────────────────
       One pass, in physical order. Hand-editing a single folio is what once
       produced two 2s, two 3s and a gap from 4 to 7. */
    const folios = pages
      .map(p => (p.querySelector('[data-slot="folio"]') || {}).textContent)
      .filter(Boolean).map(s => s.trim());
    const dup = folios.filter((v, i) => folios.indexOf(v) !== i);
    if (dup.length) fail.push('duplicate folios: ' + dup.join(', '));
    const nums = folios.filter(s => /^\d+$/.test(s)).map(Number);
    nums.forEach((n, i) => {
      if (i && n !== nums[i - 1] + 1) fail.push(`folio jumps ${nums[i - 1]} → ${n}`);
    });

    /* ── 3. the contents must point at the right pages ──────────────────────
       It pointed at 3,5,7,9,11,13 while the sections actually began on
       2,4,6,8,10,12 — written before a renumber and never revisited. Checking
       that the listed folios merely EXIST is not enough: those six all existed.
       Each row must point at the first numbered page after its own board. */
    const listed = [...document.querySelectorAll('[data-slot="contents-folio"]')]
      .map(e => e.textContent.trim());
    const boardRectos = pages.filter(p => p.dataset.layout === 'section-board' && p.classList.contains('pr'));
    const expected = boardRectos.map(b => {
      let i = pages.indexOf(b);
      while (++i < pages.length) {
        const n = (pages[i].querySelector('[data-slot="folio"]') || {}).textContent;
        if (n && /^\d+$/.test(n.trim())) return n.trim();
      }
      return null;
    });
    if (listed.length !== expected.length)
      warn.push(`contents has ${listed.length} rows but the book has ${expected.length} section boards`);
    listed.forEach((n, i) => {
      if (expected[i] && n !== expected[i])
        fail.push(`contents row ${i + 1} points at folio ${n}; that section begins on ${expected[i]}`);
    });

    /* ── 4. every page declares its layout ─────────────────────────────────
       Layout classes live on inner blocks, so without this you cannot tell a
       page's layout from the page itself — and neither can a script. */
    const untagged = pages.filter(p => !p.dataset.layout);
    if (untagged.length) fail.push(`${untagged.length} page(s) with no data-layout`);
    const unknown = [...new Set(pages.map(p => p.dataset.layout))]
      .filter(l => l && !LAYOUTS.includes(l));
    if (unknown.length) warn.push('layout not in the catalogue: ' + unknown.join(', '));
    const absent = LAYOUTS.filter(l => !pages.some(p => p.dataset.layout === l));
    if (absent.length) note.push('catalogued but not in the book: ' + absent.join(', '));

    /* ── 5. every piece of copy is reachable by role ────────────────────────
       So "replace all the headings" is one query, not a reading exercise. */
    const loose = [];
    pages.forEach(p => p.querySelectorAll('*').forEach(el => {
      if (el.closest('[data-slot]')) return;
      const hasText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
      if (hasText) loose.push(el.tagName.toLowerCase() + ' :: ' + el.textContent.trim().slice(0, 40));
    }));
    if (loose.length) fail.push(`${loose.length} text element(s) with no data-slot: ` + loose.slice(0, 4).join(' | '));

    /* ── 6. nothing hard-codes the look ────────────────────────────────────
       theme.css is the only place a colour or a face may be named. */
    const inlineHex = [...document.querySelectorAll('[style]')]
      .filter(e => /#[0-9a-f]{3,8}\b/i.test(e.getAttribute('style')))
      .map(e => e.getAttribute('style').match(/#[0-9a-f]{3,8}/i)[0]);
    if (inlineHex.length) fail.push('inline colour literals: ' + [...new Set(inlineHex)].join(' '));

    /* ── 7. every token resolves ───────────────────────────────────────────
       One misspelt token (`--paper-1` for `--paper`) silently invalidates the
       whole declaration and the element paints nothing at all. Declarations are
       looked for ANYWHERE in the stylesheets, not just on :root — plenty of
       tokens are scoped to the element that uses them (`--bw` on the stage,
       `--v` on a bar), and those are correct, not missing. */
    const sheets = [...document.styleSheets].flatMap(s => { try { return [...s.cssRules].map(r => r.cssText); } catch (e) { return []; } });
    const all = sheets.join(' ');
    const used = [...new Set(all.match(/var\((--[a-z0-9-]+)/g) || [])].map(s => s.slice(4));
    const declared = new Set((all.match(/(--[a-z0-9-]+)\s*:/g) || []).map(s => s.replace(/\s*:$/, '')));
    const inline = new Set([...document.querySelectorAll('[style]')]
      .flatMap(e => (e.getAttribute('style').match(/(--[a-z0-9-]+)\s*:/g) || []).map(s => s.replace(/\s*:$/, ''))));
    const dead = used.filter(v => !RUNTIME_TOKENS.includes(v) && !declared.has(v) && !inline.has(v));
    if (dead.length) fail.push('tokens referenced but never declared: ' + dead.join(' '));

    /* ── 8. nothing overflows its paper ────────────────────────────────────*/
    pages.forEach((p, i) => {
      const below = p.querySelector('.below');
      if (!below) return;
      const pr = p.getBoundingClientRect(), br = below.getBoundingClientRect();
      if (br.bottom > pr.bottom + 1) fail.push(`page ${i} content overflows the foot by ${Math.round(br.bottom - pr.bottom)}px`);
    });

    /* ── 9. the reveal model ───────────────────────────────────────────────
       A spread-crossing picture must not arrive one half at a time. */
    pages.filter(p => p.dataset.layout === 'full-bleed').forEach((p, i) => {
      if (p.querySelector('.bleed-out.step')) fail.push(`full-bleed half ${i} is a .step — the picture must land whole`);
    });

    const report = { fail, warn, note, counts: {
      leaves: leaves.length, pages: pages.length,
      layouts: new Set(pages.map(p => p.dataset.layout)).size,
      slots: document.querySelectorAll('[data-slot]').length,
      folios: folios.length, tabs: document.querySelectorAll('.tab').length,
      imageSlots: document.querySelectorAll('image-slot').length
    } };

    const line = '─'.repeat(60);
    console.log('%cTHE BOOK — AUDIT', 'font-weight:bold');
    console.log(line);
    Object.entries(report.counts).forEach(([k, v]) => console.log(`  ${k.padEnd(12)} ${v}`));
    console.log(line);
    if (!fail.length) console.log('%c  no failures', 'color:#35C0B6');
    fail.forEach(m => console.log('%c  FAIL  ' + m, 'color:#E0544A'));
    warn.forEach(m => console.log('%c  WARN  ' + m, 'color:#E0A33E'));
    note.forEach(m => console.log('  note  ' + m));
    return report;
  }

  window.bookAudit = function (returnResult) {
    const r = run();
    return returnResult ? r : undefined;
  };
  console.log('bookAudit() ready');
})();
