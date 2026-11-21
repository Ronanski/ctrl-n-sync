/* ===== 3.2.0-beta.8 GUIDED WORKBENCH (user pick 2026-10-23: "B + C"): two pages of the shell.
   - HOME: "What do you want to do?" (cards that open the pages the app already has), the starting state of the plant (the same
     Start ▾ buttons, then the PLANT VIEW), the sheets and faceplates opened last.
   The TRAINING page (the PR-OPE-5002 check list with its ticks and practices) was removed 2026-11-21 (user: GO NO SOP, no training or
   guided start-up; the operator picks a starting state or loads a save point).
   Only buttons and lists: nothing here reads or writes the engine except through the app's own buttons. ===== */
(function () {
  const $ = id => document.getElementById(id);
  const E = (t, a, kids) => {
    const e = document.createElement(t);
    if (a)
      for (const k in a) {
        if (k === 'txt') e.textContent = a[k];
        else if (k === 'cls') e.className = a[k];
        else if (k === 'on') e.onclick = a[k];
        else e.setAttribute(k, a[k]);
      }
    (kids || []).forEach(x => x != null && e.append(typeof x === 'string' ? document.createTextNode(x) : x));
    return e;
  };
  const ls = {
    get: (k, d) => {
      try {
        const v = localStorage.getItem(k);
        return v == null ? d : JSON.parse(v);
      } catch (e) {
        return d;
      }
    },
    set: (k, v) => {
      try {
        localStorage.setItem(k, JSON.stringify(v));
      } catch (e) {}
    }
  };
  const tab = t => window.lsSetTab && lsSetTab(t);
  /* the rail / tab bar button of a page: the Plant view button opens its own window on a PC, like a click on the rail */
  const tabBtn = l => [...document.querySelectorAll('#gsbar .tabs button, #crrail .tabs button, #crnav .tabs button')].find(b => b.textContent.trim() === l);
  const goPlant = () => {
    const b = tabBtn('Plant view');
    b ? b.click() : tab('operate');
  };
  const goSheet = name => {
    try {
      tab('logic');
      if (AN.cat !== 'an') AN.setCat('an');
      const i = AN.sheets.findIndex(s => s.name === name);
      if (i >= 0) AN.go(i);
    } catch (e) {}
  };
  /* 3.2.0-beta.21 (bug, user 2026-10-24 "ang hirap nya paganahin"): a Practise button pressed while the page was on DITL set the plant
     before the ABC engine was loaded: Start cold did nothing (MSP 75, bed 850 C, turbine 3600 rpm). The ABC sheets are loaded first. */
  const abcReady = fn => {
    try {
      AN._cold0 = 1;
      /* retest #59: a starting state is on its way (Gabay / Practise): no starting-state question meanwhile */
      AN._startPending = 1;
      if (AN.cat !== 'an') AN.setCat('an');
    } catch (e) {}
    let k = 0;
    const iv = setInterval(() => {
      const ok = window.AN && AN.cat === 'an' && AN.sheets && AN.sheets.length >= 54 && AN.plantCold;
      if (ok || ++k > 120) {
        clearInterval(iv);
        if (ok)
          try {
            fn();
          } catch (e) {}
        /* the Gabay keeps it until its own load starts (guide.js start) */
        if (window.AN && !AN._gdWait) AN._startPending = 0;
      }
    }, 250);
  };
  const search = () => {
    tab('logic');
    setTimeout(() => {
      const sb = $('srchbtn'),
        q = $('ansb');
      if (sb && getComputedStyle(sb).display !== 'none') sb.click();
      if (q) {
        q.focus();
        q.select();
      }
    }, 60);
  };
  const ICON = {
    go: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    plant: '<path d="M3 21V10l6 4v-4l6 4V5h6v16z"/><path d="M3 21h18"/>',
    learn: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    find: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/>',
    curve: '<path d="M3 20h18M3 20V4"/><path d="M5 17c4 0 5-9 9-9s4 4 6 4"/>',
    book: '<path d="M3 5h6a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H3z"/><path d="M21 5h-6a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h7z"/>',
    logic: '<path d="M6 6h5a6 6 0 0 1 0 12H6z"/><path d="M2 9h4M2 15h4M17 12h5"/>'
  };
  const ico = k => {
    const i = E('i', { cls: 'hmico', 'aria-hidden': 'true' });
    i.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ICON[k] + '</svg>';
    return i;
  };
  const NAMES = { operate: 'Plant view', logic: 'Logic', library: 'Library', tools: 'Engineering tools' };
  let home = null;

  /* ---------- HOME ---------- */
  function card(k, title, line, on, cls) {
    const b = E('button', { cls: 'hmcard' + (cls ? ' ' + cls : ''), type: 'button', on }, [ico(k), E('b', { txt: title }), E('span', { txt: line })]);
    return b;
  }
  function fillHome() {
    if (!home) return;
    const last = (() => {
        try {
          return localStorage.getItem('ls-tab') || 'logic';
        } catch (e) {
          return 'logic';
        }
      })(),
      lastT = NAMES[last] ? last : 'logic',
      rs = ls.get('ls-recent', { sh: [], fp: [] });
    const g = home.querySelector('.hmcards');
    g.textContent = '';
    g.append(
      card('go', 'Continue', 'Back to ' + NAMES[lastT] + (lastT === 'logic' && rs.sh[0] ? ' · ' + rs.sh[0] : ''), () => (lastT === 'operate' ? goPlant() : tab(lastT)), 'hmmain'),
      card('plant', 'Operate the plant', 'Plant graphics and faceplates: A / M / R, SV, MV, like the operator station', goPlant),
      card('find', 'Find a signal · Why?', 'Search a tag or address: where it comes from, where it goes, why it has its value', search),
      card('logic', 'Read the logic', 'The ABC and DITL drawings: trace a wire, run, force an input', () => tab('logic')),
      card('curve', 'F(X) curves', 'Each linear curve as in the workbook: edit it, see what it does', () => window.lsFx && lsFx()),
      card('book', 'I/O and memory lists', 'Address, tag, description, wiring, relay / SER', () => tab('library'))
    );
    const r = home.querySelector('.hmrecent');
    r.textContent = '';
    const list = (h, L, on, empty) =>
      E('div', { cls: 'hmlist' }, [E('h3', { txt: h }), L.length ? E('div', { cls: 'hmchips' }, L.map(x => E('button', { cls: 'hmchip', type: 'button', txt: x, on: () => on(x) }))) : E('p', { cls: 'hmempty', txt: empty })]);
    r.append(
      list('Sheets you opened', rs.sh, goSheet, 'None yet: open a sheet in Logic.'),
      list('Faceplates you opened', rs.fp, t => {
        goPlant();
        setTimeout(() => window.lsPlantFp && lsPlantFp(t), 400);
      }, 'None yet: click a controller or valve in the Plant view.')
    );
  }
  function startBtn(id, title, line) {
    return E('button', {
      cls: 'hmstart',
      type: 'button',
      on: () => {
        try {
          if (window.AN && AN.cat !== 'an' && AN.setCat) AN.setCat('an');
        } catch (e) {}
        /* Mina, live test of 271: the old "No starting state picked" question showed behind the loading bar: the state is picked here */
        if (window.AN) AN._askNo = 1;
        const b = $(id);
        if (b) b.click();
        goPlant();
      }
    }, [E('b', { txt: title }), E('span', { txt: line })]);
  }
  function buildHome() {
    home = E('div', { id: 'homews', role: 'region', 'aria-label': 'Home' });
    const w = E('div', { cls: 'hmwrap' }, [
      E('div', { cls: 'hmhead' }, [E('h2', { txt: 'What do you want to do?' }), E('p', { txt: 'LMYP #1 · 460 T/H CFB boiler, 150 MW · the DCS logic of STN101 ~ STN105 (ABC analog, DITL digital)' })]),
      E('div', { cls: 'hmcards' }),
      E('section', { cls: 'hmsec' }, [
        E('h3', { txt: 'Starting state of the plant' }),
        E('p', { cls: 'hmnote', txt: 'Sets the plant, then opens the Plant view. Press RUN there to let it run.' }),
        E('div', { cls: 'hmstarts' }, [
          startBtn('load150', 'At 150 MW', 'Steady state of the plant model, all loops in AUTO'),
          startBtn('loadcold', 'Cold', 'Start-up from zero: no fire, fans stopped')
        ])
      ]),
      E('section', { cls: 'hmsec hmrecent' })
    ]);
    home.append(w);
    document.body.append(home);
    fillHome();
  }

  /* ---------- recent sheets and faceplates (read from the page, every 2 s) ---------- */
  function recent() {
    try {
      const rs = ls.get('ls-recent', { sh: [], fp: [] });
      let ch = false;
      const add = (L, x) => {
        if (!x || L[0] === x) return;
        const i = L.indexOf(x);
        if (i >= 0) L.splice(i, 1);
        L.unshift(x);
        L.length = Math.min(L.length, 6);
        ch = true;
      };
      if (window.AN && AN.sheets && AN.cat === 'an' && document.body.dataset.tab === 'logic' && AN.sheets[AN.i]) add(rs.sh, AN.sheets[AN.i].name);
      const fp = $('plfp');
      if (fp && fp.dataset.tag) add(rs.fp, fp.dataset.tag);
      if (ch) ls.set('ls-recent', rs);
    } catch (e) {}
  }
  setInterval(recent, 2000);
  new MutationObserver(() => {
    if (document.body.dataset.tab === 'home') fillHome();
  }).observe(document.body, { attributes: true, attributeFilter: ['data-tab'] });

  /* 3.2.0-beta.8 (UI audit: form fields without a name for a screen reader): the sheet pickers, the UAT and audit fields get a
     name: the known ones by place, the others from their own title or placeholder or the text just before them */
  const NAMED = [
    ['#shsel', 'DITL sheet'],
    ['#anshbox select', 'ABC sheet'],
    ['#cv2h select', 'Second sheet'],
    ['#uatp select', 'UAT test']
  ];
  function names() {
    for (const [q, n] of NAMED) document.querySelectorAll(q).forEach(e => e.getAttribute('aria-label') || e.setAttribute('aria-label', n));
    document.querySelectorAll('select:not([aria-label]),textarea:not([aria-label]),input:not([type=hidden]):not([aria-label])').forEach(e => {
      if (e.id && document.querySelector('label[for="' + e.id + '"]')) return;
      if (e.closest('label')) return;
      const p = e.previousElementSibling,
        t = e.title || e.placeholder || (p && /^(SPAN|B|LABEL|SMALL)$/.test(p.tagName) ? p.textContent.trim().slice(0, 40) : '');
      if (t) e.setAttribute('aria-label', t);
    });
  }
  setInterval(names, 3000);

  window.lsHome = { fill: fillHome };
  buildHome();
})();
