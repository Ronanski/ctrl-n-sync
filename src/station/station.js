/* Operator station (user 2026-11-18): the new frame of the app. It only shows and presses what the app already has:
   the plant pages (HX), the unit numbers of the plant model (AN.unit), the alarm list (lsShellC.alarms), Run / Pause (AN.runOn / AN.pauseOn).
   No logic, plant model or drawing is changed here. */
(function () {
  if (!window.LS_STATION) return;
  const $ = (s, r) => (r || document).querySelector(s);
  const E = (t, c, x) => {
    const e = document.createElement(t);
    if (c) e.className = c;
    if (x != null) e.textContent = x;
    return e;
  };
  /* UI audit 2026-11-21: is the plant running? On the Analog sheets the ABC run (AN.run, not VIEW); on the Digital and Turbine sheets the
     DITL simulation (SIM on, DPAUSE off: category-search.js setCat carries the run over, AN.run is false there). The button said
     Paused on Engineer > Digital / Turbine while the plant ran on, and a press there could not pause it */
  const running = () => {
    const A = window.AN;
    if (!A) return false;
    if (A.cat && A.cat !== 'an') {
      try {
        return !!SIM && !DPAUSE;
      } catch (e) {
        return false;
      }
    }
    return !!A.run && !A.view;
  };
  /* the pause of the plant: DITL Pause (Run on, time stopped, ditl.js) on the Digital / Turbine sheets, the ABC pause on the Analog ones */
  const plantPause = () => {
    if (window.AN && AN.cat && AN.cat !== 'an') {
      try {
        DPAUSE = true;
      } catch (e) {}
    } else call(() => AN.pauseOn());
  };
  const call = (f, d) => {
    try {
      const r = f();
      return r == null ? d : r;
    } catch (e) {
      return d;
    }
  };
  const mem = {
    get: k => call(() => localStorage.getItem('st-' + k)),
    set: (k, v) => call(() => localStorage.setItem('st-' + k, v))
  };
  /* the pages of the unit in the order an operator walks the plant; a page that is not in the app is left out */
  const GROUPS = [
    ['', ['overview', '@soe']],
    [
      'Fuel and air',
      ['coal', 'limestone-sand', 'oil-burners', 'combustion-air', 'furnace-gas', 'purge-trip', 'sootblowers']
    ],
    ['Steam', ['drum-steam', 'reheat-steam', 'extraction', 'aux-steam', 'generator', '@gen']],
    ['Water', ['feedwater', 'condensate', 'sea-water', 'makeup-cooling', 'sampling']],
    ['Auxiliaries', ['compressed-air', 'ash']]
  ];
  /* The turbine has its own control system (TCS) with its own operator station, apart from the DCS of the plant (Hitachi TC-14-116,
     section 5.1 / 5.2): its pages are a list of their own, reached with the Plant / Turbine switch of the page list. */
  const TCS_GROUPS = [
    ['', ['turbine']],
    ['Operation', ['@criteria', '@load']],
    ['Protection', ['@trip', '@vtest', '@ost']],
    ['Auxiliaries', ['turbine-oil']]
  ];
  /* pages the frame draws itself (their id starts with @): a list read from the turbine control of the app, no drawing */
  const OWN = {
    '@soe': 'First out and events',
    '@gen': 'Generator panel',
    '@score': 'Trainee score',
    '@criteria': 'Start-up criteria',
    '@load': 'Speed and load',
    '@trip': 'Turbine trip',
    '@vtest': 'Valve tests',
    '@ost': 'Overspeed test'
  };
  const STATIONS = [
    ['plant', 'Plant', 'Pages of the plant control system (DCS)', GROUPS],
    ['turbine', 'Turbine', 'Pages of the turbine control system (TCS)', TCS_GROUPS]
  ];
  const stnOf = id => (TCS_GROUPS.some(g => g[1].includes(id)) ? 'turbine' : 'plant');
  /* the five numbers of the unit: the keys of the plant model that the unit overview of the app reads */
  const NUMS = [
    ['Load', 'MW', 'MW', 1],
    ['Steam pressure', 'MSP', 'kg/cm²', 1],
    ['Steam temperature', 'MST', '°C', 0],
    ['Drum level', 'lvl', 'mm', 0],
    ['Furnace pressure', 'FP', 'mmH₂O', 0]
  ];
  const vis = e => !!e && e.getBoundingClientRect().width > 0;
  const pick = () => $('#plantws .plpick');
  const pages = () => {
    const o = {},
      p = pick();
    if (p) for (const x of p.options) if (/^HX-/.test(x.value)) o[x.value.slice(3)] = x.textContent.trim();
    if (o.turbine) Object.assign(o, OWN);
    return o;
  };
  let own = '';
  const cur = () => {
    const p = pick();
    return own || (p && /^HX-/.test(p.value) ? p.value.slice(3) : '');
  };
  const go = id => {
    if (OWN[id]) {
      own = id;
      mem.set('page', id);
      setTimeout(() => {
        paint();
        tick();
      }, 30);
      return;
    }
    own = '';
    const p = pick();
    if (!p || ![...p.options].some(o => o.value === 'HX-' + id)) return;
    p.value = 'HX-' + id;
    p.dispatchEvent(new Event('change', { bubbles: true }));
    mem.set('page', id);
    setTimeout(paint, 50);
  };
  let stn = 'plant',
    backB,
    stnSeg,
    ownPg,
    root,
    list,
    title,
    tabs,
    kv,
    runB,
    almX,
    almT,
    almM,
    almN,
    almPop,
    condB,
    condPop,
    spdB,
    spdPop,
    sheets,
    mode,
    tools,
    eng = false;

  /* The groups of a list fold: a press on the title of a group hides its entries (the entry that is open stays). What the operator folded is
     remembered per list. dflt 1 = a long list starts folded; q = a search is on, so every group is open. */
  const folds = {
    get: k => {
      try {
        return JSON.parse(mem.get('fold-' + k) || '{}') || {};
      } catch (e) {
        return {};
      }
    },
    set: (k, o) => mem.set('fold-' + k, JSON.stringify(o))
  };
  function foldApply(box, key, dflt, q) {
    const F = folds.get(key);
    let shut = false,
      head = null;
    for (const e of box.children) {
      if (e.classList.contains('st-grp')) {
        head = e;
        shut = !q && (F[e._g] != null ? !!F[e._g] : !!dflt);
        e.classList.toggle('shut', shut);
        e.setAttribute('aria-expanded', String(!shut));
      } else if (e.classList.contains('st-nav')) e.classList.toggle('fold', !!head && shut);
    }
  }
  function grpHead(box, key, name, n, dflt) {
    const b = E('button', 'st-grp');
    b.append(E('span', '', name));
    b.title = name; /* UI audit 2026-11-21 D5: one line, full name on hover */
    if (n != null) b.append(E('i', '', String(n)));
    b._g = name;
    b.onclick = () => {
      const F = folds.get(key);
      F[name] = b.classList.contains('shut') ? 0 : 1;
      folds.set(key, F);
      foldApply(box, key, dflt, box._find && box._find.value.trim());
    };
    box.append(b);
    return b;
  }
  function drag(pop) {
    const h = $('header', pop);
    h.addEventListener('pointerdown', e => {
      if (e.target.closest('button')) return;
      const r = pop.getBoundingClientRect(),
        x0 = e.clientX,
        y0 = e.clientY;
      pop.style.right = 'auto';
      pop.style.bottom = 'auto';
      h.setPointerCapture(e.pointerId);
      const mv = ev => {
        pop.style.left = Math.max(0, Math.min(innerWidth - 80, r.left + ev.clientX - x0)) + 'px';
        pop.style.top = Math.max(0, Math.min(innerHeight - 40, r.top + ev.clientY - y0)) + 'px';
      };
      const up = () => {
        h.removeEventListener('pointermove', mv);
        h.removeEventListener('pointerup', up);
      };
      h.addEventListener('pointermove', mv);
      h.addEventListener('pointerup', up);
    });
  }
  function popup(name, sub, w) {
    const p = E('section', 'st-pop');
    p.style.width = w + 'px';
    p.setAttribute('aria-label', name);
    const h = E('header'),
      x = E('button', 'st-t', '✕');
    x.setAttribute('aria-label', 'Close');
    x.onclick = () => (p.hidden = true);
    const s = E('small', '', sub);
    h.append(E('b', '', name), s, x);
    const b = E('div', 'st-body');
    p.append(h, b);
    p._sub = s;
    p._body = b;
    root.append(p);
    drag(p);
    return p;
  }

  function build() {
    /* the frame lives in a shadow root: its styles and the styles of the old frame cannot touch each other */
    const host = E('div');
    host.id = 'station';
    const sh = host.attachShadow({ mode: 'open' });
    sh.append(E('style', '', window.LS_STATION_CSS || ''));
    root = E('div', 'st-frame');
    sh.append(root);
    const rail = E('nav', 'st-rail');
    rail.setAttribute('aria-label', 'Pages of the unit');
    const unit = E('div', 'st-unit'),
      hide = E('button', 'st-t', '‹ Hide'),
      verB = E('button', 'st-who');
    hide.setAttribute('aria-label', 'Hide the page list');
    verB.append(E('b', '', 'LMYP Unit 1'), E('small', 'st-ver', VER || 'Version'));
    verB.title = 'Version, update and channel';
    verB.onclick = about;
    unit.append(verB, hide);
    stnSeg = E('div', 'st-stn');
    for (const [k, t, tip] of STATIONS) {
      const b = E('button', 'st-b', t);
      b._k = k;
      b.title = tip;
      b.onclick = () => setStn(k);
      stnSeg.append(b);
    }
    list = E('div', 'st-list');
    /* Engineer: the logic sheets instead of the plant pages */
    sheets = E('div', 'st-list');
    sheets.hidden = true;
    const foot = E('div', 'st-railfoot');
    mode = E('div', 'st-seg');
    for (const [t, e] of [
      ['Operator', false],
      ['Engineer', true]
    ]) {
      const b = E('button', 'st-b', t);
      b._e = e;
      b.onclick = () => setEng(e);
      mode.append(b);
    }
    const insB = E('button', 'st-b st-ins', 'Instructor');
    insB.title = 'Starting point, save points, faults and trips';
    insB.onclick = instructor;
    foot.append(mode, insB);
    rail.append(unit, stnSeg, list, sheets, foot);
    const top = E('header', 'st-top'),
      show = E('button', 'st-b', 'Pages ›');
    show.hidden = true;
    title = E('h1');
    tabs = E('div', 'st-tabs');
    kv = E('div', 'st-kv');
    const sim = E('div', 'st-sim');
    runB = E('button', 'st-b');
    spdB = E('button', 'st-b');
    spdB.title = 'Simulation speed';
    spdB.onclick = speeds;
    sim.append(runB, spdB);
    for (const [name, v] of [
      ['Process', 0],
      ['Trends', 2]
    ]) {
      const b = E('button', '', name);
      b.onclick = () => view(v);
      b._v = v;
      tabs.append(b);
    }
    for (const n of NUMS) {
      const s = E('span'),
        b = E('b', '', '--');
      s.append(E('i', '', n[0]), b, n[2]);
      s._b = b;
      s._n = n;
      kv.append(s);
    }
    condB = E('button', 'st-b');
    condB.hidden = true;
    condB.onclick = () => {
      if (!condPop) {
        condPop = popup('Conditions', '', 420);
        condPop.style.left = 'calc(var(--st-rail) + 12px)';
        condPop.style.top = '56px';
      }
      condPop.hidden = false;
      tick();
    };
    top.append(show, title, tabs, condB, kv, sim);
    const alm = E('footer', 'st-alm');
    almM = E('i', 'st-mk');
    almT = E('span', 'st-tm');
    almX = E('span', 'st-x');
    almN = E('span', 'st-n');
    const open = E('button', 'st-t', 'Alarm list');
    alm.append(almM, almT, almX, almN, open);
    /* UI audit 2026-11-21 D9: the alarm line itself opens the list too, and a press outside the list closes it */
    almX.classList.add('st-go');
    almX.title = 'Open the alarm list';
    almX.onclick = () => open.click();
    addEventListener(
      'pointerdown',
      e => {
        if (!almPop || almPop.hidden) return;
        const P = e.composedPath();
        if (P.includes(almPop) || P.includes(open) || P.includes(almX)) return;
        almPop.hidden = true;
      },
      true
    );
    /* the tools of a logic sheet: the zoom controls the app already has, as one small bar */
    tools = E('div', 'st-tools');
    tools.hidden = true;
    /* Back: the way back after a link of a drawing (a connector of a TCS sheet, a page link of a DITL sheet, a trace jump of an analog
       sheet). The history is the app's own (ditl.js hist, AN.hist): this presses its Back, which the station does not show */
    backB = E('button', 'st-b st-back', '‹ Back');
    backB.title = 'Back to the sheet before the last link';
    backB.hidden = true;
    backB.onclick = () => {
      const b = appBack();
      if (b) b.click();
      setTimeout(tick, 200);
      setTimeout(tick, 700);
    };
    tools.append(backB);
    for (const [t, lab, k] of [
      ['−', 'Zoom out', 'out'],
      ['+', 'Zoom in', 'in'],
      ['Readable', 'Zoom until the text of the drawing can be read', 'read'],
      ['Whole sheet', 'Show the whole sheet', 'fit']
    ]) {
      const b = E('button', 'st-b', t);
      b.title = lab;
      b.setAttribute('aria-label', lab);
      b.onclick = () => zoom(k);
      tools.append(b);
    }
    ownPg = E('main', 'st-page');
    ownPg.hidden = true;
    root.append(rail, top, ownPg, alm, tools);
    /* a plant page opened by the app itself (a link of a drawing) closes a page of the frame */
    document.addEventListener(
      'change',
      e => {
        if (own && e.target === pick()) {
          own = '';
          setTimeout(paint, 30);
        }
      },
      true
    );
    document.body.append(host);
    /* Esc closes the popup on top (at the window, before the key handlers of the app) */
    addEventListener(
      'keydown',
      e => {
        if (e.key !== 'Escape') return;
        const P = [...root.querySelectorAll('.st-pop')].filter(p => !p.hidden);
        if (!P.length) return;
        P[P.length - 1].hidden = true;
        e.preventDefault();
        e.stopImmediatePropagation();
      },
      true
    );
    const setRail = (on, user) => {
      document.body.classList.toggle('st-norail', !on);
      root.classList.toggle('norail', !on);
      show.hidden = on;
      if (user) mem.set('side', on ? '1' : '0');
      setTimeout(() => dispatchEvent(new Event('resize')), 30);
    };
    hide.onclick = () => setRail(false, true);
    show.onclick = () => setRail(true, true);
    /* UI audit 2026-11-21 C10 (frame part): on a tablet (under 1400 px wide) the side list starts hidden, so the plant drawing gets the
       176 px and its text is drawn larger; the choice of Hide / Show is kept (key 'side': the old key 'rail' was written at every start) */
    const sd = mem.get('side');
    setRail(sd ? sd !== '0' : innerWidth >= 1400);
    runB.onclick = () => {
      if (!window.AN) return;
      if (running()) plantPause();
      else if (AN.cat && AN.cat !== 'an') call(() => {
        SIM = true;
        DPAUSE = false;
        TSP = AN.spd || 1;
      });
      else call(() => AN.runOn());
      setTimeout(tick, 100);
    };
    open.onclick = () => {
      if (!almPop) {
        almPop = popup('Alarms', '', 600);
        almPop.style.right = '12px';
        almPop.style.bottom = '44px';
        const ft = E('footer', 'st-foot');
        almPop._ack = E('button', 'st-b', 'Acknowledge all');
        almPop._ack.onclick = () => {
          ackAll();
          setTimeout(tick, 150);
        };
        ft.append(almPop._ack);
        almPop.append(ft);
      }
      almPop.hidden = false;
      tick();
    };
    fillPages();
  }
  /* the page list of the station that is shown (Plant or Turbine) */
  function fillPages() {
    const P = pages();
    list.textContent = '';
    for (const [g, ids] of STATIONS.find(x => x[0] === stn)[3]) {
      const have = ids.filter(i => P[i]);
      if (!have.length) continue;
      if (g) grpHead(list, 'pages-' + stn, g, null, 0);
      for (const i of have) {
        const b = E('button', 'st-nav', P[i]);
        b._id = i;
        b.onclick = () => go(i);
        list.append(b);
      }
    }
    foldApply(list, 'pages-' + stn, 0);
    for (const b of stnSeg.children) {
      b.classList.toggle('on', b._k === stn);
      b.setAttribute('aria-pressed', String(b._k === stn));
    }
  }
  /* the operator moves to the other station: its page list, and the page that was open there last */
  function setStn(k) {
    if (k === stn) return;
    stn = k;
    fillPages();
    const P = pages(),
      ids = STATIONS.find(x => x[0] === k)[3]
        .flatMap(g => g[1])
        .filter(i => P[i]),
      last = mem.get('page-' + k);
    if (ids.length) go(ids.includes(last) ? last : ids[0]);
    setTimeout(paint, 60);
  }
  /* Engineer shows the logic view of the app (its own drawing, zoom and trace) inside the station; Operator shows the plant pages */
  function setEng(on) {
    eng = !!on;
    mem.set('eng', eng ? '1' : '0');
    document.body.classList.toggle('st-eng', eng);
    list.hidden = eng;
    stnSeg.hidden = eng;
    sheets.hidden = !eng;
    if (eng) {
      call(() => lsSetTab('logic'));
      if (!sheets.firstChild) fillSheets();
      setTimeout(() => zoom('fit'), 500);
      /* Audit 3: the first visit opened on ABC-057, the last sheet of the list. With no sheet of the last time, the first sheet of the
         list opens */
      const had = mem.get('sheet-' + fam);
      setTimeout(() => {
        if (restoring || !eng || had) return;
        const b = sheets.querySelector('.st-nav');
        if (b && !b.classList.contains('on')) b.click();
      }, 800);
    } else {
      call(() => lsSetTab('operate'));
      call(() => lsPlant(true));
    }
    if (condPop) condPop.hidden = true;
    tools.hidden = !eng;
    paint();
    setTimeout(() => dispatchEvent(new Event('resize')), 60);
    setTimeout(() => {
      tick();
      paint();
    }, 120);
  }
  /* the whole sheet of a Digital / Turbine sheet: the frame of its drawing in the middle of the place, as the app's own first view of a sheet
     (the Fit button of the app answers for the Analog page while the station shows another family) */
  function fitSheet() {
    return call(() => {
      const sh = S.sheets[S.cur],
        e = LOVIEW.dext(sh),
        svg = document.getElementById('svg'),
        r = svg.getBoundingClientRect();
      if (!e || !r.width || !r.height) return false;
      let w = e[2] - e[0] + 8,
        h = e[3] - e[1] + 8;
      const ar = r.width / r.height;
      if (w / h < ar) w = h * ar;
      else h = w / ar;
      const v = [(e[0] + e[2]) / 2 - w / 2, (e[1] + e[3]) / 2 - h / 2, w, h];
      if (VB[S.cur]) VB[S.cur].splice(0, 4, ...v);
      else VB[S.cur] = v;
      svg.setAttribute('viewBox', v.join(' '));
      return true;
    }, false);
  }
  function zoom(k) {
    if (k === 'read') return readable();
    if (k === 'fit' && fam !== 'an' && fitSheet()) return;
    const B = [...document.querySelectorAll('button')],
      b =
        k === 'out'
          ? B.find(x => x.title === 'Zoom out' && x.closest('#zbar'))
          : k === 'in'
            ? B.find(x => x.title === 'Zoom in' && x.closest('#zbar'))
            : B.find(x => x.closest('#zbar') && x.textContent.trim() === 'Fit');
    if (b) b.click();
  }
  /* readable: the wheel zoom of the drawing itself, around the top left of what is drawn, until its text is about 12 px high
     (the Readable size of the app stops at the height of the sheet in its Engineer layout) */
  function readable() {
    const sv = $('#svg');
    if (!sv) return;
    const R = [...sv.querySelectorAll('text')].map(t => t.getBoundingClientRect()).filter(r => r.height > 0);
    if (!R.length) return;
    const hs = R.map(r => r.height).sort((a, b) => a - b),
      px = hs[hs.length >> 1],
      box = sv.getBoundingClientRect();
    if (px >= 11.5) return;
    const x = Math.min(box.right - 4, Math.max(box.left + 4, Math.min(...R.map(r => r.left)) - 16)),
      y = Math.min(box.bottom - 4, Math.max(box.top + 4, Math.min(...R.map(r => r.top)) - 16)),
      n = Math.min(16, Math.ceil(Math.log(12 / px) / Math.log(1.15)));
    for (let i = 0; i < n; i++)
      sv.dispatchEvent(
        new WheelEvent('wheel', { deltaY: -100, clientX: x, clientY: y, bubbles: true, cancelable: true })
      );
    /* then the drag of the drawing itself, so that what is drawn starts at the top left of the view */
    const T = [...sv.querySelectorAll('text')].map(t => t.getBoundingClientRect()).filter(r => r.height > 0),
      dx = Math.min(...T.map(r => r.left)) - (box.left + 24),
      dy = Math.min(...T.map(r => r.top)) - (box.top + 24);
    if (Math.hypot(dx, dy) < 8) return;
    const cx = box.left + box.width / 2,
      cy = box.top + box.height / 2,
      o = { bubbles: true, cancelable: true, pointerId: 92, pointerType: 'mouse', isPrimary: true, button: 0 };
    /* a made pointer event has no live pointer, so the capture the drawing asks for is skipped for this one drag */
    const P = Element.prototype,
      cap = P.setPointerCapture,
      rel = P.releasePointerCapture;
    P.setPointerCapture = P.releasePointerCapture = function () {};
    try {
      sv.dispatchEvent(new PointerEvent('pointerdown', { ...o, buttons: 1, clientX: cx, clientY: cy }));
      sv.dispatchEvent(new PointerEvent('pointermove', { ...o, buttons: 1, clientX: cx - dx, clientY: cy - dy }));
      sv.dispatchEvent(new PointerEvent('pointerup', { ...o, buttons: 0, clientX: cx - dx, clientY: cy - dy }));
      sv.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true, clientX: cx - dx, clientY: cy - dy })
      );
    } finally {
      P.setPointerCapture = cap;
      P.releasePointerCapture = rel;
    }
  }
  const sheetName = x => String((x && (x.name || x.id)) || '');
  const sheetTitle = x => String((x && (x.title || x.desc || x.t)) || '');
  /* the three families of logic sheets, as the app names them (its own family buttons and its own sheet list do the work) */
  const FAMS = [
    ['an', 'Analog', 'Analog logic'],
    ['dig', 'Digital', 'Digital interlock logic'],
    ['tcs', 'Turbine', 'Turbine control system']
  ];
  let fam = 'an';
  const shsel = () => $('#shsel');
  /* the Back button of the app that is live for the open family: shown by the app only while there is a way back */
  const appBack = () => {
    const b = fam === 'an' ? document.querySelector('button[data-ic="back"]') : document.querySelector('.dui-back');
    return b && !b.disabled && b.style.display !== 'none' ? b : null;
  };
  /* the sheet list follows the open sheet: its line is shown (search cleared, its group opened) and scrolled into the list */
  function showCur() {
    const ci = curSheet(),
      b = [...sheets.querySelectorAll('.st-nav')].find(x => x._i === ci);
    if (!b) return;
    if (b.hidden && sheets._find) {
      sheets._find.value = '';
      sheets._find.oninput();
    }
    if (b.classList.contains('fold')) {
      let g = b.previousElementSibling;
      while (g && !g.classList.contains('st-grp')) g = g.previousElementSibling;
      if (g && g.classList.contains('shut')) g.click();
    }
    call(() => b.scrollIntoView({ block: 'nearest' }));
  }
  /* an entry of the sheet list of the app: "(6)DITL-01 · FURNACE PURGE CONDITION" */
  const optName = t =>
    String(t)
      .replace(/^\(\d+\)/, '')
      .split(' · ')[0]
      .trim();
  const optTitle = t => String(t).split(' · ').slice(1).join(' · ').trim();
  /* the view of the last time: Engineer, its family of sheets and the sheet that was open there */
  let restoring = false;
  function restore() {
    restoring = true;
    setEng(true);
    const f = mem.get('fam'),
      last = () => {
        const n = mem.get('sheet-' + fam),
          b = n && [...sheets.querySelectorAll('.st-nav')].find(x => x._name === n);
        restoring = false;
        if (b && !b.classList.contains('on')) b.click();
      };
    if (f && f !== fam && FAMS.some(x => x[0] === f)) {
      setFam(f);
      setTimeout(last, 1600);
    } else setTimeout(last, 900);
  }
  function setFam(f) {
    fam = f;
    mem.set('fam', f);
    const b = [...document.querySelectorAll('#gsbar button')].find(x =>
      x.title.startsWith(FAMS.find(y => y[0] === f)[2])
    );
    if (b) b.click();
    setTimeout(() => {
      fillSheets();
      tick();
      paint();
      zoom('fit');
    }, 700);
  }
  /* the groups of the turbine control sheets, named after what their sheets hold (IBD SC90794: TA-1 TURBINE MASTER TRIP ..., TB-1 MAIN OIL
     PUMP ..., TC-1 ... DRAIN VALVE ..., TD-1 TURBINE ALARM ..., TE-1 ... GROUP CONTROL, GD-1 ... GEN.; sheets 15 ~ 23 are the typical logics) */
  const TCS_SHEETS = {
    TA: 'Trip and valve tests',
    TB: 'Oil pumps and turning gear',
    TC: 'Valves and drains',
    TD: 'Turbine alarms',
    TE: 'Group control',
    GD: 'Generator',
    G: 'Generator protection and breakers',
    TCE: 'Governor logic (TCE)',
    TCA: 'Start-up logic (TCA)',
    '': 'Typical logic'
  };
  /* the governor (TCE 331DM09784) and start-up (TCA 331DM09788) drawings hold some 200 sheets each: they are split by the number of the
     sheet into the sections of the drawing, named short (the list is narrow) from the titles of their sheets */
  const TCS_SUB = {
    TCE: [
      [59, 'inputs'],
      [144, 'diagnostics'],
      [175, 'speed control'],
      [209, 'load control'],
      [299, 'valves'],
      [399, 'oil pumps'],
      [499, 'alarms'],
      [599, 'simulator'],
      [899, 'outputs'],
      [999, 'I/O tables']
    ],
    TCA: [
      [299, 'inputs'],
      [499, 'diagnostics'],
      [529, 'step control'],
      [549, 'criteria'],
      [579, 'criteria monitor'],
      [599, 'sequence'],
      [749, 'valves and auxiliaries'],
      [799, 'thermal stress and tests'],
      [829, 'alarms'],
      [899, 'outputs'],
      [999, 'I/O tables']
    ]
  };
  const TCS_ORDER = ['', 'TA', 'TB', 'TC', 'TD', 'TE', 'GD', 'G', 'TCE', 'TCA'];
  const tcsGroup = text => {
    const m = /TCS-([A-Z]+)-(\d+)/.exec(text) || /TCS-([A-Z]+)-/.exec(text) || [],
      k = TCS_SHEETS[m[1]] ? m[1] : '',
      i = TCS_ORDER.indexOf(k) * 20;
    const sub = TCS_SUB[k];
    if (!sub || !m[2]) return [i, TCS_SHEETS[k]];
    const j = sub.findIndex(s => +m[2] <= s[0]);
    return [i + 1 + j, (k === 'TCE' ? 'Governor' : 'Start-up') + ' ' + sub[j][1]];
  };
  /* The groups of the Analog sheets (ABC) and of the Digital sheets (DITL), by the number of the sheet: sheets of one system stand together under the
     name of that system, in the words of the page list. A sheet whose number is in no group stands under Other. */
  const AN_G = [
    ['Contents and symbols', [0]],
    ['Unit master', [1]],
    ['Fuel and limestone', [3, 4, 5, 28, 29]],
    ['Air and furnace pressure', [2, 6, 7, 8, 14]],
    ['Furnace temperature and bottom ash', [9, 15, 16, 26, 27, 57]],
    ['Drum and steam', [10, 11, 12, 13, 17, 19, 20, 54, 55]],
    ['Auxiliary steam, condensate and heaters', [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 56]],
    ['Turbine bypass and oil', [50, 51, 52, 53]]
  ];
  const rng = (p, q) => Array.from({ length: q - p + 1 }, (_, i) => p + i);
  const DI_G = [
    ['Contents', [0]],
    ['Purge and master fuel trip', rng(1, 6)],
    ['Burners', rng(7, 18)],
    ['Coal feeders and bottom ash', [19, 20, 21, 117, 118]],
    ['Pumps and fans', [...rng(22, 31), 111, 112, 120]],
    ['Spray valves, alarms and annunciator', [...rng(32, 38), 40, 41, 42, 50]],
    ['Air preheater and compressed air', [43, 44, 45, 113, 114]],
    ['Auxiliary steam, vents and drains', [...rng(51, 57), 116]],
    ['Condensate', [...rng(60, 72), 119]],
    ['Steam lines and bypass', [73, 74, 75, 79, 80, 81, 83, 88, 89, 121]],
    ['Cooling and service water', [39, 76, 77, 78, 86, 87, 92, 93]],
    ['Extraction steam', rng(94, 110)],
    ['Turbine interface', [115]]
  ];
  /* the sheets of the other drawings of the digital logic, told by the letter the app lists them with */
  const DI_X = { S: 'Sootblowers', B: 'DITL-BA sheets', L: 'Limestone feeding (LS)', D: 'Sand injection' };
  const inG = (G, n) => {
    const i = G.findIndex(g => g[1].includes(n));
    return i < 0 ? [90, 'Other'] : [i, G[i][0]];
  };
  const anGroup = name => inG(AN_G, +((/-(\d+)/.exec(name) || [])[1] || -1));
  const diGroup = (text, name) => {
    const x = (/^\(([A-Z]+)\d+\)/.exec(text) || [])[1];
    if (x && DI_X[x]) return [50 + Object.keys(DI_X).indexOf(x), DI_X[x]];
    return inG(DI_G, +((/-(\d+)/.exec(name) || [])[1] || -1));
  };
  function fillSheets() {
    const q0 = sheets._find ? sheets._find.value : '';
    sheets.textContent = '';
    const seg = E('div', 'st-fam');
    for (const [k, t] of FAMS) {
      const b = E('button', 'st-b' + (k === fam ? ' on' : ''), t);
      b.setAttribute('aria-pressed', String(k === fam));
      b.onclick = () => setFam(k);
      seg.append(b);
    }
    const find = E('input', 'st-find');
    find.type = 'search';
    find.placeholder = 'Find a sheet…';
    find.setAttribute('aria-label', 'Find a logic sheet');
    find.value = q0;
    sheets._find = find;
    sheets.append(seg, find);
    const key = 'sh-' + fam,
      L = [];
    if (fam === 'an')
      ((window.AN && AN.sheets) || []).forEach((x, i) =>
        L.push({ name: sheetName(x), title: sheetTitle(x), i, open: () => AN.go(i), g: anGroup(sheetName(x)) })
      );
    else {
      const sel = shsel();
      if (sel)
        for (const o of sel.options) {
          const tcs = /TCS-/.test(o.textContent);
          if (tcs !== (fam === 'tcs')) continue;
          const name = optName(o.textContent);
          let g;
          /* the sheets of the turbine control in the groups of their drawing (the letters of the sheet number) and its sections */
          if (tcs) g = tcsGroup(o.textContent);
          else g = diGroup(o.textContent, name);
          L.push({
            name,
            title: optTitle(o.textContent),
            i: o.value,
            g,
            open: () => {
              sel.value = o.value;
              sel.dispatchEvent(new Event('change', { bubbles: true }));
            }
          });
        }
    }
    const nat = t => t.replace(/\d+/g, d => d.padStart(5, '0'));
    L.forEach((x, n) => (x.n = n));
    L.sort(
      (p, q) =>
        p.g[0] - q.g[0] ||
        (fam !== 'dig' ? (nat(p.name) < nat(q.name) ? -1 : nat(p.name) > nat(q.name) ? 1 : 0) : p.n - q.n)
    );
    let grp = null;
    for (const x of L) {
      if (x.g[1] !== grp) {
        grp = x.g[1];
        grpHead(sheets, key, grp, L.filter(y => y.g[1] === grp).length, 1);
      }
      const b = E('button', 'st-nav');
      b.append(E('span', '', x.name));
      if (x.title) b.append(E('small', '', x.title));
      b._i = x.i;
      b._name = x.name;
      b._q = (x.name + ' ' + x.title).toLowerCase();
      /* Audit 3: 'TCA532' finds TCS-TCA-532 (a search without the dashes, spaces or the TCS- of the name) */
      b._c = b._q.replace(/[^a-z0-9]/g, '');
      b.onclick = () => {
        call(x.open);
        setTimeout(tick, 150);
        setTimeout(() => zoom('fit'), 500);
      };
      sheets.append(b);
    }
    find.oninput = () => {
      const q = find.value.trim().toLowerCase();
      const cq = q.replace(/[^a-z0-9]/g, '');
      for (const b of sheets.querySelectorAll('.st-nav')) b.hidden = !!q && !b._q.includes(q) && !(cq && b._c.includes(cq));
      /* a group title with no sheet left under it is not shown */
      for (const g of sheets.querySelectorAll('.st-grp')) {
        let e = g.nextElementSibling,
          any = false;
        for (; e && !e.classList.contains('st-grp'); e = e.nextElementSibling) if (!e.hidden) any = true;
        g.hidden = !any;
      }
      foldApply(sheets, key, 1, q);
      /* UI audit 2026-11-21 D3: a search that finds no sheet says so */
      none.hidden = !q || [...sheets.querySelectorAll('.st-nav')].some(b => !b.hidden);
    };
    const none = E('p', 'st-none st-nofind', 'No sheet found.');
    none.hidden = true;
    find.after(none);
    find.oninput();
  }
  /* the sheet the logic view shows: AN.i (set by AN.go) for the analog sheets, the entry of the sheet list of the app for the others */
  const curSheet = () =>
    fam === 'an' ? (window.AN && typeof AN.i === 'number' ? AN.i : -1) : shsel() ? shsel().value : -1;
  const curTitle = () => {
    if (fam === 'an') {
      const x = ((window.AN && AN.sheets) || [])[curSheet()];
      return sheetName(x) + (sheetTitle(x) ? ' · ' + sheetTitle(x) : '');
    }
    const o = shsel() && shsel().selectedOptions[0];
    return o ? optName(o.textContent) + (optTitle(o.textContent) ? ' · ' + optTitle(o.textContent) : '') : '';
  };

  /* the short description of a DITL / TCE / TCA / IBD sheet (src/digital/tce/_desc.js and the sheet data), shown under its name */
  const curDesc = () => {
    if (fam === 'an' || typeof S === 'undefined' || !S.sheets) return '';
    const x = S.sheets[+curSheet()];
    return (x && x.desc) || '';
  };

  /* acknowledge: the Acknowledge all of the alarm list of the app (it also acknowledges the unit and logic rows); the list stays hidden */
  function ackAll() {
    call(() => lsShellC.openAl('alarms'));
    const al = $('#scal'),
      b = al && $('.scack', al);
    if (b && !b.disabled) b.click();
    if (al) al.hidden = true;
  }
  /* speed: the Simulation speed control of the app, its own choices */
  const speedSel = () => [...document.querySelectorAll('select')].find(x => x.title === 'Simulation speed') || null;
  /* the name and the version the build wrote (tools/station/build.js). The <title> of the page keeps its version: the update check
     and the channel switch of the app read it */
  const NAME = window.LS_STATION_NAME || 'LMYP OTS',
    VER = window.LS_STATION_VER || (document.title.match(/v\d+(\.\d+)+(-beta\.\d+)?/) || [''])[0];
  document.title = NAME + (VER ? ' ' + VER : '');
  /* version popup: check for a new version (the update check of the app) and the channel (its own Stable / Beta switch) */
  let verPop = null;
  /* Lite mode, for a weak tablet (user, Xiaomi Pad 5, 2026-11-19: the app felt heavy and slow). The station measures how many pictures a
     second the device draws at start; under 40 it turns Lite on by itself (the setting Auto), and the user can set On or Off. Lite = the body
     class st-lite and window.LS_LITE (the pages and the engine hang their own savings on these), the station refreshes each second instead
     of each half second, and its popups drop their shadows. */
  const lite = { fps: 0, on: false };
  function liteApply() {
    const pref = mem.get('lite') || 'auto';
    lite.on = pref === 'on' || (pref === 'auto' && lite.fps > 0 && lite.fps < 40);
    document.body.classList.toggle('st-lite', lite.on);
    if (root) root.classList.toggle('lite', lite.on);
    window.LS_LITE = lite.on;
    call(() => dispatchEvent(new CustomEvent('ls-lite', { detail: lite.on })));
  }
  function liteMeasure() {
    let n = 0,
      t0 = 0;
    const step = t => {
      if (!t0) t0 = t;
      n++;
      if (t - t0 < 2000) return requestAnimationFrame(step);
      lite.fps = Math.round((n - 1) / ((t - t0) / 1000));
      liteApply();
    };
    /* after the first pages have settled, and only while the page is shown (a hidden page draws nothing) */
    setTimeout(() => (document.hidden ? 0 : requestAnimationFrame(step)), 4000);
  }
  function about() {
    if (!verPop) {
      verPop = popup(NAME, '', 300);
      verPop.style.left = 'calc(var(--st-rail) + 12px)';
      verPop.style.bottom = '44px';
      verPop.hidden = true;
    }
    verPop.hidden = !verPop.hidden;
    if (verPop.hidden) return;
    const body = verPop._body,
      sel = document.getElementById('chsel');
    body.textContent = '';
    body.append(
      E(
        'p',
        'st-none',
        'Version ' +
          (VER || 'not known') +
          (sel ? ' · ' + (sel.value === 'beta' ? 'Beta' : 'Stable') + ' channel' : '') +
          (window.LS_STATION_SIM ? ' · simulator ' + window.LS_STATION_SIM : '')
      )
    );
    const r = E('div', 'st-row'),
      up = E('button', 'st-b', 'Check for update');
    up.title = 'Asks the site for a newer version; nothing is installed before you agree';
    up.disabled = typeof window.lsCheckUpdate !== 'function';
    up.onclick = () => {
      verPop.hidden = true;
      call(() => lsCheckUpdate(true));
    };
    r.append(up);
    body.append(r);
    if (sel) {
      const h = E('h2', 'st-h', 'Channel'),
        c = E('div', 'st-row');
      for (const [v, t, tip] of [
        ['stable', 'Stable', 'The released version'],
        ['beta', 'Beta', 'The newest fixes, still under test']
      ]) {
        const b = E('button', 'st-b' + (sel.value === v ? ' on' : ''), t);
        b.title = tip + (sel.value === v ? ' (in use)' : ': the app reloads, the running plant is lost');
        b.setAttribute('aria-pressed', String(sel.value === v));
        if (sel.value !== v)
          arm(b, t, () => {
            sel.value = v;
            sel.dispatchEvent(new Event('change', { bubbles: true }));
          });
        c.append(b);
      }
      body.append(h, c);
    }
    const lh = E('h2', 'st-h', 'Lite mode'),
      lr = E('div', 'st-row'),
      pref = mem.get('lite') || 'auto';
    for (const [v, t, tip] of [
      ['auto', 'Auto', 'On by itself on a slow device'],
      ['on', 'On', 'Fewer moving pictures and a slower refresh, for a slow device'],
      ['off', 'Off', 'Everything moves, the fastest refresh']
    ]) {
      const b = E('button', 'st-b' + (pref === v ? ' on' : ''), t);
      b.title = tip;
      b.setAttribute('aria-pressed', String(pref === v));
      b.onclick = () => {
        mem.set('lite', v);
        liteApply();
        verPop.hidden = true;
        about();
      };
      lr.append(b);
    }
    body.append(
      lh,
      lr,
      E(
        'p',
        'st-none',
        (lite.on ? 'Lite mode is on. ' : 'Lite mode is off. ') +
          (lite.fps
            ? 'This device draws ' + lite.fps + ' pictures a second.'
            : 'The speed of this device is not measured yet.')
      )
    );
  }
  /* the update question of the app (#updask of src/boot/update-question.js, hidden under the station): the station shows the same
     question in its own popup; its buttons press the buttons of the app, so the update itself is the app's own */
  let updPop = null;
  function updAsk() {
    const ua = document.getElementById('updask');
    if (!ua) {
      if (updPop) updPop.hidden = true;
      return;
    }
    if (updPop && updPop._for === ua) return;
    if (!updPop) {
      updPop = popup('New version', '', 340);
      updPop.style.right = '12px';
      updPop.style.top = '56px';
    }
    updPop._for = ua;
    updPop.hidden = false;
    const body = updPop._body,
      b0 = ua.querySelector('b');
    body.textContent = '';
    body.append(
      E('p', 'st-upd', b0 ? b0.textContent : 'A new version is available'),
      E(
        'p',
        'st-none',
        'Installed: ' +
          (VER || 'not known') +
          '. Update now reloads the app and the running plant is lost. To keep it, save a save point in Instructor first.'
      )
    );
    const r = E('div', 'st-row');
    for (const o of ua.querySelectorAll('button')) {
      const b = E('button', 'st-b', o.textContent);
      b.onclick = () => {
        o.click();
        setTimeout(updAsk, 100);
      };
      r.append(b);
    }
    body.append(r);
  }
  /* Engineer: the picked signal. The app explains a picked wire or block itself ("Why is it 55.00?" of its Engineer layout, the
     element #scewhy: heading .scesec, lines .scewb, links .scelinks); that box is hidden under the station, so the station shows
     the same words in a popup. Nothing is worked out here. */
  let whyPop = null,
    whySig = '',
    whyShut = '';
  function why() {
    const w = eng ? document.getElementById('scewhy') : null,
      hd = w && w.querySelector('.scesec'),
      bd = w && w.querySelector('.scewb'),
      head = hd ? hd.textContent.replace(/\s+/g, ' ').trim() : '',
      lines = bd
        ? (bd.children.length ? [...bd.children] : [bd])
            .map(x => x.textContent.replace(/\s+/g, ' ').trim())
            .filter(Boolean)
        : [],
      sig = head + '|' + lines.join('|');
    if (!lines.length || /…\?$/.test(head)) {
      if (whyPop) whyPop.hidden = true;
      whySig = '';
      return;
    }
    if (sig === whySig) return;
    whySig = sig;
    if (sig === whyShut) return;
    whyShut = '';
    if (!whyPop) {
      whyPop = popup('Signal', '', 340);
      whyPop.style.right = '12px';
      /* UI audit 2026-11-21 D1: below the sheet tools (top 45, 36 high), so Back, zoom and Whole sheet stay free */
      whyPop.style.top = '88px';
      const x = whyPop.querySelector('header .st-t');
      x.onclick = () => {
        whyPop.hidden = true;
        whyShut = whySig;
      };
    }
    const body = whyPop._body;
    body.textContent = '';
    body.append(E('p', 'st-upd', head));
    for (const l of lines) body.append(E('p', 'st-why', l));
    const open = [...w.querySelectorAll('.scelinks button')].find(b => /^Open /.test(b.textContent.trim()));
    if (open && !open.disabled && !open.hidden) {
      const r = E('div', 'st-row'),
        b = E('button', 'st-b', open.textContent.trim());
      b.title = open.title || '';
      b.onclick = () => {
        open.click();
        setTimeout(() => {
          tick();
          paint();
          zoom('read');
        }, 600);
      };
      r.append(b);
      body.append(r);
    }
    whyPop.hidden = false;
  }
  /* Instructor: the starting point, the save points, the faults and the trips of the app, through its own controls and functions
     (the same ones its Instructor console presses: shellc-ins.js). A press that changes the plant asks for a second press within 5 s */
  let insPop = null;
  const pressId = id => {
    const b = document.getElementById(id);
    if (b) b.click();
    return !!b;
  };
  /* keep: true = the words of the button stay as they are and a "Press again" mark is laid over its right end (CSS .arm.keep), so
     nothing in a list changes size or place between the two presses; without it the short button says "Press again: ..." itself */
  function arm(b, label, fn, keep) {
    const off = () => {
      b._arm = 0;
      if (!keep) b.textContent = label;
      b.classList.remove('arm', 'keep');
      b.removeAttribute('aria-description');
    };
    b.onclick = () => {
      if (!b._arm) {
        b._arm = setTimeout(off, 5000);
        if (keep) b.classList.add('keep');
        else b.textContent = 'Press again: ' + label;
        b.classList.add('arm');
        b.setAttribute('aria-description', 'Press again within 5 seconds to confirm');
        return;
      }
      clearTimeout(b._arm);
      off();
      fn();
    };
  }
  /* The popup is built ONCE; after that each part is filled again on its own, and a part swaps its old rows for the new ones in one
     step. Before (live test, Jennie, 2026-11-19): every press rebuilt the whole popup, and the save points came back a moment
     later (their list is read from storage), so with save points kept the fault rows first moved up and then down again, and the
     next press landed on another fault. */
  const ins = {};
  function instructor() {
    if (!insPop) {
      insPop = popup('Instructor', '', 360);
      insPop.style.left = 'calc(var(--st-rail) + 12px)';
      insPop.style.top = '56px';
      insPop.hidden = true;
      buildIns();
    }
    insPop.hidden = !insPop.hidden;
    if (!insPop.hidden) {
      ins.name.value = call(() => lsSaves.name(), '') || '';
      fillSaves();
      fillTrips();
      fillFaults();
      fillFrz();
      fillScore();
    }
  }
  /* the freeze of the instructor: the plant time stops and Run is refused until the instructor takes it off (instructor.js AN.freeze) */
  function fillFrz() {
    const F = call(() => AN.freeze(), null),
      N = [],
      again = () =>
        setTimeout(() => {
          fillFrz();
          tick();
        }, 200);
    if (!F) N.push(E('p', 'st-none', 'Not available at this starting point.'));
    else if (F.on) {
      const b = E('button', 'st-b on', 'Take the freeze off');
      b.title = 'The trainee can press Run again';
      b.onclick = () => {
        call(() => AN.freeze(false));
        again();
      };
      N.push(b, E('span', 'st-cs', 'The plant is held since ' + clock(F.at) + '. Run is refused.'));
    } else {
      const b = E('button', 'st-b', 'Freeze the plant'),
        m = E('span', 'st-pm');
      b.title = 'The plant time stops and the trainee cannot run it on until the freeze is taken off';
      b.onclick = () => {
        const x = call(() => AN.freeze(true, 'Instructor'), '');
        if (x) m.textContent = String(x);
        else again();
      };
      N.push(b, m);
    }
    ins.frz.replaceChildren(...N);
  }
  /* UI audit 2026-11-21 D7: steps the starting point already had (given) are not the trainee's; without a step of the trainee there
     is no score to show (the 150 MW point showed 100 of 100 · 18 of 18 before any press) */
  const ownSteps = Z => Z.steps.filter(x => !x.given && !Z.todo.some(y => y.id === x.id)).length;
  const scoreText = Z =>
    ownSteps(Z) || Z.deduct.length
      ? fmt(Z.score, 1) + ' of 100 · ' + ownSteps(Z) + ' steps by the trainee'
      : 'No step by the trainee yet · ' + (Z.of - Z.todo.length) + ' of ' + Z.of + ' done at the starting point';
  function fillScore() {
    const Z = call(() => AN.sopScore(), null),
      N = [];
    if (!Z || !Z.of) N.push(E('p', 'st-none', 'Not kept at this starting point.'));
    else {
      const op = E('button', 'st-b', 'Open the score'),
        ag = E('button', 'st-b', 'Start again');
      op.title = 'The steps of the start-up procedure and the points lost';
      op.onclick = () => {
        insPop.hidden = true;
        go('@score');
      };
      ag.title = 'A new trainee: the score starts again from now';
      arm(ag, 'Start again', () => {
        call(() => AN.sopScore({ restart: true }));
        setTimeout(() => {
          fillScore();
          tick();
        }, 200);
      });
      N.push(
        E('span', 'st-scv', scoreText(Z)),
        op,
        ag
      );
    }
    ins.score.replaceChildren(...N);
  }
  function buildIns() {
    const body = insPop._body;
    const head = t => body.append(E('h2', 'st-h', t));
    const row = cls => {
      const r = E('div', 'st-row' + (cls ? ' ' + cls : ''));
      body.append(r);
      return r;
    };
    head('Starting point');
    let r = row();
    for (const [t, id] of [
      ['150 MW', 'load150'],
      ['Cold', 'loadcold']
    ]) {
      const b = E('button', 'st-b', t);
      b.title = 'The running plant is replaced by the ' + t + ' starting point';
      arm(b, t, () => {
        if (running()) plantPause();
        pressId(id);
        insPop.hidden = true;
        setTimeout(tick, 1500);
      });
      r.append(b);
    }
    head('Freeze');
    ins.frz = row();
    head('Trainee score');
    ins.score = row();
    head('Save points');
    r = row('st-save');
    const nm = E('input', 'st-find');
    nm.type = 'text';
    nm.setAttribute('aria-label', 'Name of the save point');
    nm.placeholder = 'Name…';
    const sv = E('button', 'st-b', 'Save now');
    sv.title = 'Keeps the whole plant at this moment under this name';
    sv.onclick = () => {
      const t = nm.value.trim();
      if (!t) return nm.focus();
      sv.disabled = true;
      const done = () => {
        sv.disabled = false;
        fillSaves();
      };
      Promise.resolve(call(() => lsSaves.save(t))).then(done, done);
    };
    /* a save point from a file (one written by File of a row below), so a save survives a new browser or a restart of the PC */
    const fi = E('input');
    fi.type = 'file';
    fi.accept = '.json,application/json';
    fi.hidden = true;
    fi.onchange = () => {
      const fl = fi.files && fi.files[0];
      fi.value = '';
      if (fl)
        fl.text()
          .then(t => call(() => lsSaves.imp(t)))
          .then(fillSaves, fillSaves);
    };
    const op = E('button', 'st-b', 'Open file…');
    op.title = 'Adds a save point from a file kept on this computer';
    op.onclick = () => fi.click();
    r.append(nm, sv, op, fi);
    ins.name = nm;
    ins.saves = E('div', 'st-svl');
    body.append(ins.saves);
    head('Trips');
    ins.trips = row();
    head('Faults');
    ins.faults = row('st-col');
  }
  /* the save points: the rows on screen stay until the new list is read, then they are swapped in one step */
  function fillSaves() {
    const show = L => {
      const N = [];
      if (!L || !L.length) N.push(E('p', 'st-none', 'No save point yet.'));
      else
        for (const e of L.slice().reverse()) {
          const rr = E('div', 'st-svr'),
            ld = E('button', 'st-b', 'Load'),
            dl = E('button', 'st-b', 'Delete');
          ld.title = 'Puts the whole plant back as it was saved, then pauses';
          dl.title = 'Removes this save point; it cannot be undone';
          arm(ld, 'Load', () => {
            insPop.hidden = true;
            call(() => lsSaves.load(e));
            setTimeout(tick, 1500);
          });
          arm(dl, 'Delete', () => Promise.resolve(call(() => lsSaves.del(e))).then(fillSaves, fillSaves));
          const fb = E('button', 'st-b', 'File');
          fb.title = 'Keeps this save point as a file on this computer; Open file… puts it back';
          fb.onclick = () => {
            const a = E('a');
            a.href = URL.createObjectURL(new Blob([lsSaves.exp(e)], { type: 'application/json' }));
            a.download = 'save-' + e.name.replace(/[^A-Za-z0-9.-]+/g, '_') + '.json';
            a.click();
            setTimeout(() => URL.revokeObjectURL(a.href), 4000);
          };
          rr.append(E('span', '', e.name), ld, fb, dl);
          N.push(rr);
        }
      ins.saves.replaceChildren(...N);
    };
    Promise.resolve(call(() => lsSaves.list(), [])).then(show, () => show([]));
  }
  function fillTrips() {
    const N = [],
      again = () => setTimeout(fillTrips, 300);
    const tt = E('button', 'st-b', 'Turbine trip');
    tt.title = 'The turbine trips now and the plant reacts to it';
    arm(tt, 'Turbine trip', () => {
      call(() => AN.turbine('trip'));
      call(() => lsEventAdd('TCS', 'TCS', 'Instructor: TURBINE TRIP (TA-1)'));
      again();
    });
    N.push(tt);
    const el = call(() => (AN.elec ? AN.elec() : null), null);
    if (el) {
      const t = el.l52 ? 'Open line breaker' : 'Close line breaker',
        lb = E('button', 'st-b', t);
      lb.title = el.l52
        ? '230 kV line breaker 52L1 opens: the generator carries the house load only'
        : '230 kV line breaker 52L1 closes: the unit is on the grid again';
      arm(lb, t, () => {
        const x = call(() => AN.turbine('52l', el.l52 ? 0 : 1), '');
        call(() =>
          lsEventAdd('TCS', 'TCS', 'Instructor: ' + (el.l52 ? 'open' : 'close') + ' 52L1' + (x ? ': ' + x : ''))
        );
        again();
      });
      N.push(lb);
    }
    ins.trips.replaceChildren(...N);
  }
  /* the faults: always the same rows in the same order; "Clear all faults" is the last row, so nothing above it ever moves */
  function fillFaults() {
    const N = [],
      again = () => setTimeout(fillFaults, 300);
    const FL = [...call(() => AN.fault(), []), ...call(() => WORLD.ftrip(), [])];
    if (!FL.length) N.push(E('p', 'st-none', 'No fault in this starting point.'));
    /* One line per instrument or machine: its name once, its faults as small buttons beside it ("signal lost", "over range"). A fault whose words
       do not end the name of a tagged device ("... (TAG) fault") is a line of its own. The lines stand in groups by kind of fault. */
    const FG = call(() => AN.faultGroups(), null),
      gOf = {};
    if (FG) FG.forEach((g, i) => g.items.forEach(x => (gOf[x.id] = i)));
    const D = [];
    for (const f of FL) {
      const m = /^(.*\))\s+(\S.*)$/.exec(String(f.t)),
        dev = m ? m[1] : '',
        kind = m ? m[2].charAt(0).toUpperCase() + m[2].slice(1) : String(f.t);
      let d = dev && D.find(x => x.dev === dev);
      if (!d) D.push((d = { dev, L: [] }));
      d.L.push([f, kind]);
    }
    /* the kinds of fault, in the order an instructor reaches for them; a fault that fits none stands under Other */
    const KIND = [
      ['Instruments and valves', t => false],
      ['Machine trips', t => /trips in the field/i.test(t)],
      ['Electrical', t => /black-out|frequency|lockout|bus|grid/i.test(t)],
      ['Fuel', t => /coal/i.test(t)],
      ['Leaks and plugging', t => /leak|plugged/i.test(t)],
      ['Other', t => true]
    ];
    /* the group of a line: the plant system of its first fault; without the list of the engine, the kinds above */
    for (const d of D)
      d.k = FG
        ? gOf[d.L[0][0].id] != null
          ? gOf[d.L[0][0].id]
          : FG.length
        : d.dev
          ? 0
          : KIND.findIndex(k => k[1](String(d.L[0][0].t)));
    D.sort((p, q) => p.k - q.k);
    let head = -1;
    for (const d of D) {
      if (d.k !== head) N.push(E('h3', 'st-flh', FG ? (FG[(head = d.k)] || { g: 'Other' }).g : KIND[(head = d.k)][0]));
      const row = E('div', 'st-fl');
      if (d.dev) row.append(E('span', '', d.dev));
      for (const [f, kind] of d.L) {
        const id = 'flt-' + String(f.id).replace(/\W/g, '-'),
          b = E('button', 'st-b' + (f.on ? ' on' : ''), kind);
        b.setAttribute('aria-pressed', String(!!f.on));
        b.setAttribute('aria-label', f.t);
        b.title = f.on ? 'On: press to clear it' : 'Puts the fault on the running plant until it is cleared';
        if (f.on)
          b.onclick = () => {
            pressId(id);
            again();
          };
        else
          arm(
            b,
            kind,
            () => {
              pressId(id);
              again();
            },
            true
          );
        row.append(b);
      }
      N.push(row);
    }
    if (FL.some(f => f.on)) {
      const c = E('button', 'st-b', 'Clear all faults');
      c.onclick = () => {
        pressId('flt-clear');
        again();
      };
      N.push(c);
    }
    ins.faults.replaceChildren(...N);
  }
  function speeds() {
    const sel = speedSel();
    if (!sel) return;
    if (!spdPop) {
      spdPop = popup('Simulation speed', '', 220);
      spdPop.style.right = '12px';
      spdPop.style.top = '56px';
      spdPop._body.classList.add('st-two');
    }
    spdPop._body.textContent = '';
    const now = String((window.AN && AN.spd) || sel.value);
    for (const o of sel.options) {
      const b = E('button', 'st-b' + (String(o.value) === now ? ' on' : ''), '×' + o.value);
      b.onclick = () => {
        sel.value = o.value;
        sel.dispatchEvent(new Event('change', { bubbles: true }));
        spdPop.hidden = true;
        setTimeout(tick, 100);
      };
      spdPop._body.append(b);
    }
    spdPop.hidden = false;
  }

  /* the condition boxes of a plant page (state only, not its push buttons) are not drawn on the picture: they are read here and shown
     in one popup, under the section title the page gives them */
  const xy = e => {
    const m = /translate\(([-\d.]+)[ ,]+([-\d.]+)/.exec(e.getAttribute('transform') || '');
    return m ? [+m[1], +m[2]] : [+e.getAttribute('x') || 0, +e.getAttribute('y') || 0];
  };
  /* Start-up criteria: the criteria of the automatic turbine start-up as the turbine control of the app holds them (AN.tcs():
     drawings 310SC90-775 / 776). A criterion that is not met can be bypassed, one at a time, with the app's own command. */
  /* every list of the Turbine station is shown in groups: the part of the turbine a line belongs to, read from its own words */
  const KINDS = ['Steam and vacuum', 'Oil', 'Turbine', 'Generator', 'Other systems'];
  const kindOf = t =>
    /VIBRATION|SPEED|THRUST|EXPANSION/.test(t)
      ? 'Turbine'
      : /\bOIL\b|EXTRACTOR/.test(t)
        ? 'Oil'
        : /52G|GEN\.|AVR|FIELD|EXCIT|V\/F|PROTECTION|LOCKOUT/.test(t)
          ? 'Generator'
          : /MFT|SHUTDOWN COMMAND|TCS MAJOR/.test(t)
            ? 'Other systems'
            : /STEAM|BYPASS|GLAND|CONDENSER|VACUUM|HOOD/.test(t)
              ? 'Steam and vacuum'
              : 'Turbine';
  const byKind = (L, text) => KINDS.map(k => [k, L.filter(x => kindOf(text(x)) === k)]).filter(g => g[1].length);
  const crit = {};
  const STEPS = [
    ['warm', 'HP turbine warming'],
    ['prep', 'Preparation'],
    ['rub', 'Turbine rub check'],
    ['accel', 'Acceleration'],
    ['excite', 'Excitation'],
    ['sync', 'Synchronizing and initial load'],
    ['loadup', 'Load up'],
    ['normal', 'Normal operation'],
    ['shutdown', 'Turbine shut-down']
  ];
  function criteria() {
    const T = call(() => AN.tcs(), null);
    if (!T || !T.crit) {
      /* a starting point without the automatic start-up (the turbine control of the app holds no start-up there) */
      if (crit.key !== 'none') {
        crit.key = 'none';
        crit.h = null;
        crit.v = {};
        ownPg.replaceChildren(E('p', 'st-none', 'The automatic start-up is not in use at this starting point.'));
      }
      return;
    }
    const num = k => String(k).split('.').map(Number),
      byp = T.byp || [],
      all = Object.values(T.crit).sort((a, b) => num(a.no)[0] - num(b.no)[0] || num(a.no)[1] - num(b.no)[1]),
      /* what the next step still waits for, as the turbine control of the app lists it ("1.10 TEXT [value]; 1.11 ...") */
      need = String(T.next || '')
        .split('; ')
        .map(x => x.split(' ')[0])
        .filter(k => T.crit[k]);
    const auto = !!(T.aux && T.aux.auto);
    const key =
      all.map(c => c.no + (c.ok ? 1 : 0) + (byp.includes(c.no) ? 'b' : '')).join() +
      '|' +
      [need.join(), T.cur, T.step, auto, T.hold ? 1 : 0].join('|');
    const val = c => (c.val != null && isFinite(c.val) ? fmt(c.val, Math.abs(c.val) < 2 ? 2 : 1) : '');
    const armed = !!ownPg.querySelector('.arm');
    if (key !== crit.key && !armed) {
      crit.key = key;
      crit.v = {};
      crit.h = {};
      const N1 = [],
        head = E('div', 'st-ph');
      for (const k of ['Start-up mode', 'Step', 'Speed', 'Hold']) {
        const d = E('div'),
          b = E('b');
        d.append(E('i', '', k), b);
        crit.h[k] = b;
        head.append(d);
      }
      N1.push(head);
      /* the push buttons of the automatic start-up (TCS HMI faceplates TCA501 ATS MODE SELECT, TCA520 ~ 528 the nine steps, TCE164
         SPEED / LOAD HOLD): each presses the app's own turbine command; what the turbine control refuses is shown in its words */
      crit.msg = crit.msg || E('p', 'st-pm');
      const say = m => {
        crit.msg.textContent = m ? String(m) : '';
        crit.key = '';
        setTimeout(tick, 150);
      };
      const act = E('div', 'st-row st-pa'),
        au = E('button', 'st-b' + (auto ? ' on' : ''), 'Automatic start-up'),
        hd = E('button', 'st-b', 'Hold'),
        ho = E('button', 'st-b', 'Hold off');
      au.setAttribute('aria-pressed', String(auto));
      au.title = auto
        ? 'On: each step starts by itself when its criteria are met. Press for off'
        : 'Off: the operator starts each step. Press for on';
      au.onclick = () => say(call(() => AN.turbine('auto', auto ? 0 : 1), ''));
      hd.title = 'Holds the speed or the load where it is';
      hd.onclick = () => say(call(() => AN.turbine('hold', 1), ''));
      ho.title = 'Lets the start-up go on, if no hold condition stands';
      ho.onclick = () => say(call(() => AN.turbine('holdoff'), ''));
      act.append(au, hd, ho);
      N1.push(act);
      const steps = E('div', 'st-row st-steps');
      STEPS.forEach(([cmd, name], i) => {
        const b = E('button', 'st-b' + (i === T.cur ? ' on' : ''), name);
        b.title = i === T.cur ? 'In progress' : i <= T.step ? 'Complete' : 'Starts this step, if its criteria are met';
        if (i <= T.step && i !== T.cur) b.classList.add('done');
        arm(b, name, () => say(call(() => AN.turbine(cmd), '')));
        steps.append(b);
      });
      N1.push(E('h2', 'st-h', 'Steps'), steps, crit.msg);
      const sec = (t, L0) => {
        if (!L0.length) return;
        N1.push(E('h2', 'st-h', t));
        const box = E('div', 'st-crit');
        for (const [kind, L] of byKind(L0, c => c.txt)) {
          box.append(E('div', 'st-cg', kind));
          for (const c of L) {
            const b = byp.includes(c.no),
              r = E('div', 'st-cr' + (c.ok ? '' : b ? ' byp' : ' miss')),
              v = E('em', '', val(c)),
              st = E('span', 'st-cs', c.ok ? 'Met' : b ? 'Bypassed' : 'Not met');
            (crit.v[c.no] = crit.v[c.no] || []).push(v);
            r.append(
              E('i', 'st-mk' + (c.ok ? ' ok' : b ? '' : ' new')),
              E('span', 'st-cn', c.no),
              E('span', '', c.txt),
              v,
              st
            );
            if (!c.ok || b) {
              const x = E('button', 'st-b', b ? 'Put back' : 'Bypass');
              x.title = b
                ? 'The criterion counts again'
                : 'Takes this criterion out of the step until it is put back; a hold is not bypassed';
              const fn = () => {
                const m = call(() => AN.turbine('critbypass', c.no), '');
                if (m) x.title = m;
                crit.key = '';
                setTimeout(tick, 100);
              };
              if (b) x.onclick = fn;
              else arm(x, 'Bypass', fn);
              r.append(x);
            } else r.append(E('span'));
            box.append(r);
          }
        }
        N1.push(box);
      };
      sec(
        'The next step waits for',
        need.map(k => T.crit[k])
      );
      sec('All criteria', all);
      ownPg.replaceChildren(...N1);
    }
    if (crit.h) {
      crit.h['Start-up mode'].textContent = T.mode || '--';
      crit.h.Step.textContent =
        T.cur >= 0 ? T.curName + ' (in progress)' : T.step >= 0 ? T.stepName + ' (complete)' : 'Not started';
      crit.h.Speed.textContent = fmt(T.rpm, 0) + ' rpm';
      crit.h.Hold.textContent = T.hold ? String(T.hold === true ? 'On' : T.hold) : 'Off';
    }
    for (const c of all) for (const v of crit.v[c.no] || []) v.textContent = val(c);
  }
  /* Turbine trip: the inputs of the trip logic of the turbine control (sheet TA-9 TRIP LOGIC (TOTAL) of the IBD SC90794), each with its
     state now, the cause that came first, and the master trip / reset of the operator (the app's own commands). */
  const trp = {};
  let ownWas = '';
  /* First out and sequence of events (user "go all" 2026-11-19, item 2): after an MFT or a turbine trip, what tripped first and the order
     of what followed. Read only: the record of the engine (soe.js AN.soeTrip / AN.soe), which takes it from the signals of the DCS and
     TCS logic. Oldest first, as a sequence-of-events print is read; a new block starts after 60 s without a record */
  /* Generator panel (user "go all" 2026-11-19, item 5): manual synchronizing, the AVR and the generator lockout relays, as the engine
     holds them (gen-panel.js: AN.genPanel reads, AN.turbine('gen', { op, v }) presses; sources GEE-2015-0141, GEE-2015-0173,
     Generator Logic.pdf). The panel devices keep their numbers: 7-90R voltage, 7-65 speed, 25 synchronizing check, 52G, 41, 86 */
  const gp = {};
  function gens() {
    const G = call(() => AN.genPanel(), null);
    if (!G) {
      if (gp.h !== 0) {
        gp.h = 0;
        ownPg.replaceChildren(E('p', 'st-none', 'The generator panel is not in service at this starting point.'));
      }
      return;
    }
    if (!gp.h) {
      const h = (gp.h = {}),
        head = E('div', 'st-ph');
      for (const k of [
        'Generator breaker 52G',
        'Field breaker 41',
        'Generator voltage',
        'Frequency',
        'Synchronizing check 25',
        'Lockout relays'
      ]) {
        const d = E('div'),
          b = E('b');
        d.append(E('i', '', k), b);
        h[k] = b;
        head.append(d);
      }
      gp.msg = E('p', 'st-pm');
      const say = m => {
        gp.msg.textContent = m ? String(m) : '';
        setTimeout(tick, 120);
      };
      const press = (r, t, tip, op, v) => {
        const b = E('button', 'st-b', t);
        b.title = tip;
        b.onclick = () => say(call(() => AN.turbine('gen', { op, v }), ''));
        r.append(b);
        return b;
      };
      const card = (name, tip) => {
        const c = E('section', 'st-gc'),
          v = E('b', 'st-gv'),
          m = E('span', 'st-cs'),
          r = E('div', 'st-row');
        c.title = tip;
        c.append(E('h2', 'st-h', name), v, m, r);
        return { c, v, m, r };
      };
      const box = E('div', 'st-gov');
      /* synchronizing: the synchroscope (the pointer at 12 o'clock = in phase), the mode and the close of 52G */
      const sy = card(
        'Synchronizing',
        'The generator is brought to the voltage, the frequency and the phase of the line, then 52G is closed'
      );
      const NS = 'http://www.w3.org/2000/svg',
        sv = document.createElementNS(NS, 'svg');
      sv.setAttribute('viewBox', '-52 -52 104 104');
      sv.setAttribute('class', 'st-sync');
      sv.setAttribute('role', 'img');
      sv.setAttribute('aria-label', 'Synchroscope');
      sv.innerHTML =
        '<circle r="46" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
        '<path d="M0 -46V-36M-46 0H-40M46 0H40M0 46V40" stroke="currentColor" stroke-width="1.5"/>' +
        '<path d="M-8 -45.3A46 46 0 0 1 8 -45.3" fill="none" stroke="currentColor" stroke-width="5"/>' +
        '<line class="p" y2="-38" stroke="currentColor" stroke-width="3"/><circle r="3" fill="currentColor"/>';
      h.ptr = sv.querySelector('.p');
      h.scope = sv;
      sy.c.insertBefore(sv, sy.r);
      h.sy = sy;
      h.synA = press(sy.r, 'Automatic', 'Automatic synchronizing (ASD)', 'syn', 'AUTO');
      h.synM = press(
        sy.r,
        'Manual',
        'Manual synchronizing: the operator matches voltage and speed and closes 52G',
        'syn',
        'MAN'
      );
      const cl = E('button', 'st-b', 'Close 52G');
      cl.title = 'Closes the generator breaker; possible only in manual with the synchronizing check 25 operated';
      arm(cl, 'Close 52G', () => say(call(() => AN.turbine('gen', { op: 'close52g' }), '')));
      sy.r.append(cl);
      h.cl = cl;
      /* 7-90R: the voltage of the generator through the AVR */
      const vo = card('Voltage (7-90R)', 'Raise / lower of the generator voltage; the AVR in automatic or manual');
      h.vo = vo;
      press(vo.r, 'Lower', 'Lowers the generator voltage', 'v-');
      press(vo.r, 'Raise', 'Raises the generator voltage', 'v+');
      h.avrA = press(vo.r, 'AVR automatic', 'The AVR holds the generator voltage', 'avr', 'AUTO');
      h.avrM = press(vo.r, 'AVR manual', 'The field is set by hand', 'avr', 'MAN');
      /* 41: the field breaker by hand (TCA587, the operator station 41 close / open commands); the engine refuses with the reason */
      const fb = card('Field breaker 41', 'Closes or opens the field breaker; the ATS closes it by itself in the excitation step');
      h.fb = fb;
      for (const [t, op, tip] of [
        ['Close 41', 'close41', 'Closes the field breaker: 52G open, rated speed, no trip'],
        ['Open 41', 'open41', 'Opens the field breaker: only with 52G open']
      ]) {
        const b41 = E('button', 'st-b', t);
        b41.title = tip;
        arm(b41, t, () => say(call(() => AN.turbine('gen', { op }), '')));
        fb.r.append(b41);
        h[op] = b41;
      }
      /* 7-65: the speed of the turbine through the governor */
      const sp = card(
        'Speed (7-65)',
        'Raise / lower of the turbine speed through the governor, to match the frequency of the line'
      );
      h.sp = sp;
      press(sp.r, 'Lower', 'Lowers the speed', 'n-');
      press(sp.r, 'Raise', 'Raises the speed', 'n+');
      /* 86G-A, 86G-B, 86T */
      const lo = card(
        'Lockout relays',
        'A lockout relay opens 52G, 52L and 41 and trips the turbine; it is reset by hand when its cause is gone'
      );
      h.lo = lo;
      press(lo.r, 'Reset lockout relays', 'Refused while the cause stands', 'reset86');
      box.append(sy.c, fb.c, vo.c, sp.c, lo.c);
      ownPg.replaceChildren(head, box, gp.msg);
    }
    const h = gp.h,
      on = (b, x) => {
        b.classList.toggle('on', !!x);
        b.setAttribute('aria-pressed', String(!!x));
      },
      L = G.lo86 || {},
      lk = [L.a && '86G-A', L.b && '86G-B', L.t && '86T'].filter(Boolean);
    /* UI audit 2026-11-21 D8: a command for the state the breaker is already in is not offered */
    h.cl.disabled = !!G.c52g;
    h.close41.disabled = !!G.f41;
    h.open41.disabled = !G.f41;
    h['Generator breaker 52G'].textContent = G.c52g ? 'Closed' : 'Open';
    h['Field breaker 41'].textContent = G.f41 ? 'Closed' : 'Open';
    h['Generator voltage'].textContent = fmt(G.kV, 2) + ' kV';
    h['Frequency'].textContent = fmt(G.hz, 2) + ' Hz';
    h['Synchronizing check 25'].textContent = G.c52g ? 'On the line' : G.r25 ? 'Operated' : 'Not operated';
    h['Lockout relays'].textContent = lk.length ? lk.join(', ') + ' operated' : 'Reset';
    h['Lockout relays'].classList.toggle('st-hot', !!lk.length);
    h.sy.v.textContent = G.c52g ? 'On the line' : fmt(G.th, 0) + '°';
    h.sy.m.textContent =
      'Voltage difference ' +
      fmt(G.dv, 1) +
      ' % · slip ' +
      fmt(G.slip, 3) +
      ' Hz · line ' +
      fmt(G.gridHz, 2) +
      ' Hz · ' +
      (G.asd ? 'ASD in use' : 'ASD off');
    h.ptr.setAttribute('transform', 'rotate(' + (G.c52g || !isFinite(G.th) ? 0 : G.th) + ')');
    h.scope.classList.toggle('ok', !!G.r25 || !!G.c52g);
    on(h.synA, G.syn !== 'MAN');
    on(h.synM, G.syn === 'MAN');
    h.vo.v.textContent = fmt(G.kV, 2) + ' kV';
    h.vo.m.textContent =
      'Field ' + fmt(G.efd, 2) + ' pu · ' + (G.x84 ? 'voltage established' : 'voltage not established');
    on(h.avrA, G.avr !== 'MAN');
    on(h.avrM, G.avr === 'MAN');
    h.fb.v.textContent = G.f41 ? 'Closed' : 'Open';
    h.fb.m.textContent = G.x84 ? 'Voltage established' : 'Voltage not established';
    h.sp.v.textContent = fmt(G.hz, 2) + ' Hz';
    h.sp.m.textContent = 'Slip ' + fmt(G.slip, 3) + ' Hz against the line';
    h.lo.v.textContent = lk.length ? lk.join(' · ') : 'Reset';
    h.lo.v.classList.toggle('st-hot', !!lk.length);
    h.lo.m.textContent = L.why ? 'Cause: ' + L.why : 'No lockout relay is operated';
  }
  /* Trainee score (user "go all" 2026-11-19, item 6): the start-up of the trainee against the procedure PR-OPE-5002, as the engine
     scores it (sop-score.js AN.sopScore: one share of 100 per milestone of the procedure; a share is lost for a milestone done out of
     the order of the procedure and for one undone by a trip). Read only; the instructor starts it again from the Instructor popup */
  const sc = {};
  function scores() {
    const Z = call(() => AN.sopScore(), null);
    if (!Z || !Z.of) {
      if (sc.key !== 'none') {
        sc.key = 'none';
        ownPg.replaceChildren(E('p', 'st-none', 'The score is not kept at this starting point.'));
      }
      return;
    }
    const tr = Z.trips || {},
      key = [Z.score, Z.steps.length, Z.todo.length, Z.deduct.length, tr.mft, tr.tt, Z.from].join('|');
    if (key === sc.key) return;
    sc.key = key;
    const head = E('div', 'st-ph');
    for (const [k, v, hot] of [
      ['Score', ownSteps(Z) || Z.deduct.length ? fmt(Z.score, 1) + ' of 100' : 'No step by the trainee yet', Z.deduct.length > 0],
      ['Steps of the procedure done', Z.of - Z.todo.length + ' of ' + Z.of],
      [
        'Trips',
        (tr.mft || 0) + ' master fuel trip · ' + (tr.tt || 0) + ' turbine trip',
        (tr.mft || 0) + (tr.tt || 0) > 0
      ]
    ]) {
      const d = E('div'),
        b = E('b', hot ? 'st-hot' : '', v);
      d.append(E('i', '', k), b);
      head.append(d);
    }
    const ded = E('div', 'st-crit');
    if (!Z.deduct.length) ded.append(E('p', 'st-none', 'No point lost.'));
    for (const d of Z.deduct) {
      const r = E('div', 'st-cr st-tr miss');
      /* the engine writes the plant time in seconds: shown as the clock of the other lists */
      const why = String(d.why).replace(/ at ([\d.]+) s$/, (m, t) => ' at ' + clock(+t));
      r.append(E('i', 'st-mk new'), E('span', '', why), E('span', 'st-cs', '−' + fmt(d.pts, 1) + ' points'));
      ded.append(r);
    }
    const lost = new Set((Z.lost || []).map(x => x.id)),
      todo = new Set(Z.todo.map(x => x.id)),
      /* one line per step of the procedure: a step undone by a trip stands as to do, not also as done */
      all = Z.steps
        .filter(x => !todo.has(x.id))
        .map(x => Object.assign({ done: 1 }, x))
        .concat(Z.todo.map(x => Object.assign({ done: 0 }, x)));
    all.sort((p, q) => p.sec - q.sec);
    const box = E('div', 'st-crit');
    for (const x of all) {
      const late = x.done && x.late && x.late.length,
        undone = !x.done && lost.has(x.id),
        r = E('div', 'st-cr st-sc' + (late || undone ? ' miss' : ''));
      r.append(
        E('i', 'st-mk' + (late || undone ? ' new' : x.done ? ' done' : ' ok')),
        E('span', 'st-cn', 'Section ' + x.sec),
        E('span', '', String(x.name)),
        E(
          'span',
          'st-cs',
          undone
            ? 'Undone by a trip, to do again'
            : !x.done
              ? 'To do'
              : late
                ? 'Done out of order at ' + clock(x.at)
                : x.given
                  ? 'Done before the score started'
                  : 'Done at ' + clock(x.at)
        )
      );
      box.append(r);
    }
    ownPg.replaceChildren(
      head,
      E('h2', 'st-h', 'Points lost'),
      ded,
      E('h2', 'st-h', 'Start-up procedure PR-OPE-5002'),
      box
    );
  }
  const soe = {};
  const clock = t => {
    if (t == null || !isFinite(t)) return '--';
    const s = Math.max(0, +t),
      h = Math.floor(s / 3600),
      m = Math.floor((s % 3600) / 60);
    return h + ':' + String(m).padStart(2, '0') + ':' + (s % 60).toFixed(1).padStart(4, '0');
  };
  const SOEK = { trip: 'Trip input', mft: 'Master fuel trip', fo: 'First out', reset: 'Reset', tt: 'Turbine trip' };
  function soes() {
    const T = call(() => AN.soeTrip(), null),
      L = call(() => AN.soe(400), null);
    if (!T || !L) {
      if (soe.key !== 'none') {
        soe.key = 'none';
        ownPg.replaceChildren(E('p', 'st-none', 'The sequence of events is not recorded at this starting point.'));
      }
      return;
    }
    const m = T.mft || {},
      u = T.turbine || {},
      key = L.length + '|' + (L.length ? L[L.length - 1].t : '') + '|' + m.on + m.first + '|' + u.on + u.first;
    if (key === soe.key) return;
    soe.key = key;
    const head = E('div', 'st-ph');
    for (const [k, v, hot] of [
      ['Boiler', m.on ? 'Master fuel trip' : 'No trip', m.on],
      ['Boiler first out', m.first || 'None', m.on],
      ['Turbine', u.on ? 'Turbine trip' : 'No trip', u.on],
      ['Turbine first out', u.first || 'None', u.on]
    ]) {
      const d = E('div'),
        b = E('b', hot ? 'st-hot' : '', v);
      d.append(E('i', '', k), b);
      head.append(d);
    }
    const box = E('div', 'st-crit');
    if (!L.length)
      box.append(
        E(
          'p',
          'st-none',
          'No event since this starting point. The list fills by itself at the next master fuel trip or turbine trip.'
        )
      );
    let last = -1e9,
      t0 = 0;
    for (const x of L) {
      if (x.t - last > 60) {
        t0 = x.t;
        box.append(E('div', 'st-cg', 'Events from ' + clock(x.t)));
      }
      last = x.t;
      const fo = (x.kind === 'fo' || x.kind === 'tt') && x.on,
        r = E('div', 'st-cr st-se' + (fo ? ' miss' : ''));
      r.append(
        E('i', 'st-mk' + (x.on ? ' new' : ' ok')),
        E('span', 'st-cn', clock(x.t)),
        E('em', '', '+' + (x.t - t0).toFixed(1) + ' s'),
        E('span', '', String(x.name || '')),
        E('span', 'st-cn st-sy', (x.sys || '') + (x.sheet ? ' · ' + x.sheet : '')),
        E('span', 'st-cs', (SOEK[x.kind] || '') + (x.on ? '' : ' off'))
      );
      box.append(r);
    }
    ownPg.replaceChildren(head, E('h2', 'st-h', 'Sequence of events'), box);
  }
  function trips() {
    const sh = call(() => AN.tcsIbdSheets().find(x => x.id === 'TA-9'), null),
      st = call(() => AN.tcsIbd('TA-9'), null),
      T = call(() => AN.tcsTrip(), null),
      tb = call(() => AN.unit.tb, null);
    if (!sh || !T) {
      if (trp.key !== 'none') {
        trp.key = 'none';
        ownPg.replaceChildren(E('p', 'st-none', 'The trip logic of the turbine is not loaded at this starting point.'));
      }
      return;
    }
    const L = sh.i.map(i => ({ t: String(i[1]), on: !!(st && st.v[i[0]] > 0.5) })),
      off = !!tb && tb.st === 'off',
      key = L.map(x => (x.on ? 1 : 0)).join('') + '|' + T.first + '|' + off;
    if (key !== trp.key && !ownPg.querySelector('.arm')) {
      trp.key = key;
      const head = E('div', 'st-ph');
      trp.h = {};
      for (const k of ['Turbine', 'First cause', 'Speed']) {
        const d = E('div'),
          b = E('b');
        d.append(E('i', '', k), b);
        trp.h[k] = b;
        head.append(d);
      }
      const act = E('div', 'st-row st-pa'),
        tr = E('button', 'st-b', 'Trip the turbine'),
        rs = E('button', 'st-b', 'Reset the turbine');
      trp.msg = trp.msg || E('span', 'st-pm');
      tr.title = 'Master trip: the stop valves and the control valves close at once';
      rs.title = 'Master reset: possible only when no trip cause is standing';
      const say = m => {
        trp.msg.textContent = m ? String(m) : '';
        setTimeout(tick, 150);
      };
      arm(tr, 'Trip the turbine', () => say(call(() => AN.turbine('trip'), '')));
      rs.onclick = () => say(call(() => AN.turbine('tripreset'), ''));
      act.append(tr, rs, trp.msg);
      const box = E('div', 'st-crit');
      for (const [kind, K] of byKind(L, x => x.t)) {
        box.append(E('div', 'st-cg', kind));
        for (const x of K) {
          const r = E('div', 'st-cr st-tr' + (x.on ? ' miss' : ''));
          r.append(
            E('i', 'st-mk' + (x.on ? ' new' : ' ok')),
            E('span', '', x.t),
            E('span', 'st-cs', x.on ? 'Standing' : 'Normal')
          );
          box.append(r);
        }
      }
      ownPg.replaceChildren(head, act, E('h2', 'st-h', 'Trip causes'), box);
    }
    if (trp.h) {
      trp.h.Turbine.textContent = L.some(x => x.on) ? 'Trip standing' : off ? 'Tripped or not started' : 'Reset';
      trp.h['First cause'].textContent = T.first || 'None';
      trp.h.Speed.textContent = fmt(tb ? tb.rpm : null, 0) + ' rpm';
    }
  }
  /* Speed and load: the governor set and the load limiter of the turbine control (TCS soft logic TCE196 GOVERNOR SET, TCE205 LOAD LIMIT
     SET), read with AN.tcsGov() and pressed with the app's own commands AN.turbine('gov' | 'llm'). One press = 1 %, as on the real station. */
  const gov = {};
  function loads() {
    const G = call(() => AN.tcsGov(), null),
      tb = call(() => AN.unit.tb, null);
    if (!G) {
      if (gov.h !== 0) {
        gov.h = 0;
        ownPg.replaceChildren(E('p', 'st-none', 'The governor of the turbine is not loaded at this starting point.'));
      }
      return;
    }
    if (!gov.h) {
      gov.h = {};
      const head = E('div', 'st-ph');
      for (const k of ['Speed', 'Load target', 'Load change rate', 'Valve demand', 'In control']) {
        const d = E('div'),
          b = E('b');
        d.append(E('i', '', k), b);
        gov.h[k] = b;
        head.append(d);
      }
      gov.msg = E('p', 'st-pm');
      const box = E('div', 'st-gov');
      for (const [k, name, tip] of [
        ['gov', 'Governor set', 'The load the governor asks from the valves'],
        ['llm', 'Load limiter', 'The highest valve demand allowed; in automatic it follows 5 % above the governor']
      ]) {
        const c = E('section', 'st-gc'),
          v = E('b', 'st-gv'),
          m = E('span', 'st-cs'),
          r = E('div', 'st-row');
        c.title = tip;
        gov.h[k] = v;
        gov.h[k + 'm'] = m;
        const press = (t, op, tp) => {
          const b = E('button', 'st-b', t);
          b.title = tp;
          b._op = op;
          b.onclick = () => {
            const x = call(() => AN.turbine(k, { op }), '');
            gov.msg.textContent = x ? String(x) : '';
            setTimeout(tick, 120);
          };
          r.append(b);
          return b;
        };
        press('Lower', 'lower', 'One press lowers it by 1 %; it goes to manual');
        press('Raise', 'raise', 'One press raises it by 1 %; it goes to manual');
        gov.h[k + 'a'] = press('Automatic', 'auto', 'Back to automatic');
        c.append(E('h2', 'st-h', name), v, m, r);
        box.append(c);
      }
      /* the speed control of the station with the automatic start-up off (TCS soft logic TCE160 TARGET ACCELERATION, TCE161 / 162 TARGET
         SPEED): one select at a time, pressed with the app's own commands */
      const box2 = E('div', 'st-gov');
      gov.sel = [];
      for (const [k, name, tip, L] of [
        [
          'tspeed',
          'Target speed',
          'Used with the automatic start-up off, the turbine reset and the generator off the line',
          [
            [0, 'Close valves'],
            [200, '200 rpm'],
            [1800, '1800 rpm'],
            [2700, '2700 rpm'],
            [3600, '3600 rpm']
          ]
        ],
        [
          'accel',
          'Acceleration rate',
          'How fast the speed goes to the target',
          [
            ['slow', 'Slow 120 rpm/min', 120],
            ['med', 'Medium 180 rpm/min', 180],
            ['fast', 'Fast 360 rpm/min', 360]
          ]
        ]
      ]) {
        const c = E('section', 'st-gc'),
          r = E('div', 'st-row');
        c.title = tip;
        for (const [a, t, v] of L) {
          const b = E('button', 'st-b', t);
          b.onclick = () => {
            /* the rate has its own command name: 'accel' is the ACCELERATION step of the start-up */
            const x = call(() => AN.turbine(k === 'accel' ? 'accrate' : k, a), '');
            gov.msg.textContent = x ? String(x) : '';
            setTimeout(tick, 120);
          };
          gov.sel.push([b, k, v == null ? a : v]);
          r.append(b);
        }
        c.append(E('h2', 'st-h', name), r);
        box2.append(c);
      }
      ownPg.replaceChildren(head, box, box2, gov.msg);
    }
    const T = call(() => AN.tcs(), null);
    for (const [b, k, v] of gov.sel || []) {
      const on = !!T && T[k] === v;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', String(on));
    }
    const pc = x => (x == null ? '--' : fmt(x, 1) + ' %');
    gov.h.Speed.textContent = fmt(tb ? tb.rpm : null, 0) + ' rpm';
    gov.h['Load target'].textContent = G.target == null ? '--' : fmt(G.target, 1) + ' MW';
    gov.h['Load change rate'].textContent = G.rate == null ? '--' : fmt(G.rate, 1) + ' %/min';
    gov.h['Valve demand'].textContent = pc(G.fd);
    gov.h['In control'].textContent = G.limiting ? 'Load limiter (limiting)' : 'Governor';
    gov.h.gov.textContent = pc(G.gov);
    gov.h.llm.textContent = pc(G.llm);
    for (const [k, man] of [
      ['gov', G.govMan],
      ['llm', G.llmMan]
    ]) {
      gov.h[k + 'm'].textContent = man ? 'Manual' : 'Automatic';
      gov.h[k + 'a'].classList.toggle('on', !man);
      gov.h[k + 'a'].setAttribute('aria-pressed', String(!man));
    }
  }
  /* Valve tests: the tests of the main stop valves and the control valves of the turbine station (TCS HMI faceplates 1SVST1903A / B MSV
     TEST, 1SVST1904A / B CV TEST), read with AN.tcsVt() and started with the app's own command AN.turbine('vtest'). One test at a time;
     a test that is not allowed says why, in the words of the turbine control. */
  const vt = {};
  const VT_VALVES = [
    [
      'Main stop valves',
      [
        ['msvA', 'Main stop valve A'],
        ['msvB', 'Main stop valve B']
      ]
    ],
    [
      'Control valves',
      [
        ['cvA', 'Control valve A'],
        ['cvB', 'Control valve B']
      ]
    ]
  ];
  const VT_OPS = [
    ['partial', 'Partial test', 'Moves the valve a part of its travel and back'],
    [
      'close',
      'Full close test',
      'Closes the valve fully; on a main stop valve the control valves of that side close first'
    ],
    ['open', 'Open again', 'Opens the valve again after a full close test'],
    ['cancel', 'Cancel', 'Stops the test and brings the valve back']
  ];
  const VT_PH = {
    msv: 'Main stop valve moving',
    cv: 'Control valves moving',
    reopen: 'Opening again',
    held: 'Held closed'
  };
  function vtests() {
    const V = call(() => AN.tcsVt(), null);
    if (!V) {
      if (vt.key !== 'none') {
        vt.key = 'none';
        ownPg.replaceChildren(
          E('p', 'st-none', 'The valve tests of the turbine are not loaded at this starting point.')
        );
      }
      return;
    }
    const perm = V.perm || {},
      why = (v, op) => {
        const k = v + ':' + op;
        return Array.isArray(perm) ? '' : perm[k] == null ? null : String(perm[k]);
      },
      key = JSON.stringify([perm, V.on, V.sel, V.op, V.ph]);
    if (key !== vt.key && !ownPg.querySelector('.arm')) {
      vt.key = key;
      vt.h = {};
      vt.p = {};
      const head = E('div', 'st-ph');
      for (const k of ['Valve test', 'Valve under test', 'Phase']) {
        const d = E('div'),
          b = E('b');
        d.append(E('i', '', k), b);
        vt.h[k] = b;
        head.append(d);
      }
      vt.msg = vt.msg || E('p', 'st-pm');
      const N1 = [head];
      for (const [grp, L] of VT_VALVES) {
        N1.push(E('h2', 'st-h', grp));
        const box = E('div', 'st-gov');
        for (const [v, name] of L) {
          const c = E('section', 'st-gc' + (V.sel === v ? ' on' : '')),
            pos = E('b', 'st-gv'),
            r = E('div', 'st-row');
          vt.p[v] = pos;
          for (const [op, t, tip] of VT_OPS) {
            const w = why(v, op);
            /* an operation the turbine control does not list for this valve is not offered */
            if (w === null && (op === 'partial' || op === 'close') && Object.keys(perm).length) continue;
            const b = E('button', 'st-b', t);
            b.title = w ? 'Not allowed now: ' + w : tip;
            if (w) b.classList.add('no');
            const fn = () => {
              const x = call(() => AN.turbine('vtest', { v, op }), '');
              vt.msg.textContent = x ? name + ': ' + x : '';
              vt.key = '';
              setTimeout(tick, 150);
            };
            if (op === 'cancel' || op === 'open') b.onclick = fn;
            else arm(b, t, fn);
            r.append(b);
          }
          c.append(E('h2', 'st-h', name), pos, E('span', 'st-cs', 'Position'), r);
          box.append(c);
        }
        N1.push(box);
      }
      N1.push(vt.msg);
      ownPg.replaceChildren(...N1);
    }
    const nameOf = v => (VT_VALVES.flatMap(g => g[1]).find(x => x[0] === v) || [])[1] || '';
    vt.h['Valve test'].textContent = V.on ? 'In progress' : 'None';
    vt.h['Valve under test'].textContent = V.sel ? nameOf(V.sel) : 'None';
    vt.h.Phase.textContent = V.on ? VT_PH[V.ph] || String(V.ph || '') : '--';
    for (const v in vt.p) vt.p[v].textContent = V[v] == null ? '--' : fmt(V[v], 0) + ' %';
  }
  /* Overspeed test: the main and the back-up overspeed test of the turbine station (TCS HMI faceplates TCE176_1 EMERGENCY OVERSPEED TEST and
     TCE177_1 BACK UP OVERSPEED TEST), read from AN.tcs().ost and started with the app's own commands AN.turbine('ostmain' | 'ostbk').
     Permitted only at rated speed, off the line, with no trip standing; a refusal is shown in the words of the turbine control. */
  const ost = {};
  const OST = [
    ['main', 'ostmain', 'Main overspeed test', 'The speed rises until the overspeed trip acts (3978 rpm)'],
    ['bk', 'ostbk', 'Back-up overspeed test', 'The speed rises until the back-up overspeed trip acts (3915 rpm)']
  ];
  function osts() {
    const T = call(() => AN.tcs(), null),
      O = T && T.ost;
    if (!O) {
      if (ost.h !== 0) {
        ost.h = 0;
        ownPg.replaceChildren(
          E(
            'p',
            'st-none',
            'The overspeed test is not in use at this starting point (the turbine control holds no start-up there).'
          )
        );
      }
      return;
    }
    if (!ost.h) {
      ost.h = {};
      const head = E('div', 'st-ph');
      for (const k of ['Speed', 'Above rated speed', 'Test', 'Permitted']) {
        const d = E('div'),
          b = E('b');
        d.append(E('i', '', k), b);
        ost.h[k] = b;
        head.append(d);
      }
      ost.msg = E('p', 'st-pm');
      const box = E('div', 'st-gov');
      for (const [k, cmd, name, tip] of OST) {
        const c = E('section', 'st-gc'),
          st = E('b', 'st-gv'),
          r = E('div', 'st-row'),
          on = E('button', 'st-b', 'Start the test'),
          off = E('button', 'st-b', 'Stop the test');
        c.title = tip;
        ost.h[k] = st;
        ost.h[k + 'c'] = c;
        const say = m => {
          ost.msg.textContent = m ? String(m) : '';
          setTimeout(tick, 150);
        };
        arm(on, 'Start the test', () => say(call(() => AN.turbine(cmd, 1), '')));
        off.onclick = () => say(call(() => AN.turbine(cmd, 0), ''));
        r.append(on, off);
        c.append(E('h2', 'st-h', name), st, E('span', 'st-cs', tip), r);
        box.append(c);
      }
      ownPg.replaceChildren(head, E('h2', 'st-h', 'Tests'), box, ost.msg);
    }
    ost.h.Speed.textContent = fmt(T.rpm, 0) + ' rpm';
    ost.h['Above rated speed'].textContent = fmt(O.pattern, 0) + ' rpm';
    ost.h.Test.textContent = O.main ? 'Main overspeed test' : O.bk ? 'Back-up overspeed test' : 'None';
    ost.h.Permitted.textContent = O.perm ? 'Yes' : 'No';
    for (const [k] of OST) {
      ost.h[k].textContent = O[k] ? 'In progress' : 'Off';
      ost.h[k + 'c'].classList.toggle('on', !!O[k]);
    }
  }
  function conds() {
    const pg = $('#plantws .hx-process');
    if (!pg || own) return [];
    const Z = [...pg.querySelectorAll('.hx-zone')].map(z => ({
      z,
      p: xy(z),
      t: z.textContent.replace(/\s+/g, ' ').trim(),
      n: 0
    }));
    const out = [];
    for (const h of pg.querySelectorAll('.hx-hook:not([data-press]):not([data-plain])')) {
      const p = xy(h),
        st = h.querySelector('.hx-hks');
      let g = null;
      for (const z of Z) if (z.p[1] < p[1] && Math.abs(z.p[0] - p[0]) < 360 && (!g || z.p[1] > g.p[1])) g = z;
      if (g) {
        g.n++;
        if (p[1] - g.p[1] < 80) g.near = 1;
      }
      /* the group of a condition = the logic sheet it is read from (the boxes of one sheet belong together on every page) */
      const hk = h.dataset.hook || '',
        sh = (/"((?:DITL|ABC)-[\w]+)\|/.exec(hk) || [])[1] || '',
        grp = (/data-g="(\w+)"/.exec(hk) || [])[1] || '';
      out.push({
        g: GROUPS_OF[grp] || SHEETS[sh] || '',
        label: h.dataset.label || '',
        state: st ? st.textContent.trim() : '',
        /* the row of the logic sheet the condition is read from ("DITL-01|i|1"): the app can say which object it belongs to */
        dy: (/data-dy="([^"]+)"/.exec(hk) || [])[1] || '',
        k: h.classList.contains('run') ? 'run' : h.classList.contains('stop') ? 'stop' : ''
      });
    }
    /* a section title that only headed boxes has nothing under it now */
    for (const z of Z) z.z.style.visibility = z.n && z.near ? 'hidden' : '';
    /* one block per group, in the order the groups first appear on the page */
    const ord = [...new Set(out.map(c => c.g))];
    return out
      .map((c, i) => [c, i])
      .sort((a, b) => ord.indexOf(a[0].g) - ord.indexOf(b[0].g) || a[1] - b[1])
      .map(x => x[0]);
  }
  /* the name of the group of a logic sheet, in the words of its plant page (hx-page-purge-trip.js); other sheets: one plain list */
  const SHEETS = {
    'DITL-01': 'Purge permissive',
    'DITL-02': 'Furnace purge sequence',
    'DITL-03A': 'Master fuel trip'
  };
  /* a page can mark the boxes of one group itself (data-g of the box): PP = the purge permissives */
  const GROUPS_OF = { PP: 'Purge permissive' };
  const title1 = t => t || 'Conditions';

  /* from a condition to its object: the page of the object, its faceplate opened by the page's own press, the object marked for a moment */
  function jump(tg) {
    const P = pages();
    if (tg.page && P[tg.page] && cur() !== tg.page) go(tg.page);
    let n = 0;
    const t = setInterval(() => {
      const el = [...document.querySelectorAll('#plantws [data-open]')].find(x => x.dataset.open === tg.open);
      if (!el && ++n < 20) return;
      clearInterval(t);
      if (!el) return;
      el.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          clientX: el.getBoundingClientRect().left + 4,
          clientY: el.getBoundingClientRect().top + 4
        })
      );
      const M = [el];
      if (tg.mark)
        for (const x of document.querySelectorAll('#plantws .hx-process text'))
          if (x.textContent.includes(tg.mark)) M.push(x);
      M.forEach(x => x.classList.add('st-mark'));
      setTimeout(() => M.forEach(x => x.classList.remove('st-mark')), 5000);
      setTimeout(tick, 200);
    }, 150);
  }
  /* The trend of a faceplate: the measured value, the set point and the output of its controller or valve over the last 10 or 30 minutes,
     as the app has kept them (AN.fpHist(key, seconds), one sample a second). A button "Trend" on the faceplate opens it. */
  const trend = { key: '', span: 600 };
  let trendPop = null;
  function trendOpen(key, name) {
    if (!trendPop) {
      trendPop = popup('Trend', '', 380);
      trendPop.style.right = '12px';
      trendPop.style.top = '56px';
      const row = E('div', 'st-row');
      trend.b = [];
      for (const [sec, t] of [
        [600, '10 minutes'],
        [1800, '30 minutes']
      ]) {
        const b = E('button', 'st-b', t);
        b.onclick = () => {
          trend.span = sec;
          trendDraw();
        };
        b._s = sec;
        trend.b.push(b);
        row.append(b);
      }
      trend.box = E('div', 'st-trend');
      trend.leg = E('div', 'st-tleg');
      trendPop._body.append(row, trend.box, trend.leg);
    }
    trend.key = key;
    trendPop._sub.textContent = name || key;
    trendPop.hidden = false;
    trendDraw();
  }
  function trendDraw() {
    if (!trendPop || trendPop.hidden || !trend.key) return;
    for (const b of trend.b) {
      b.classList.toggle('on', b._s === trend.span);
      b.setAttribute('aria-pressed', String(b._s === trend.span));
    }
    const H = call(() => AN.fpHist(trend.key, trend.span), null);
    if (!H || !H.t || H.t.length < 2) {
      trend.box.replaceChildren(
        E('p', 'st-none', 'No history yet for this faceplate. It is kept from the moment the app starts.')
      );
      trend.leg.replaceChildren();
      return;
    }
    const W = 340,
      Ht = 140,
      t1 = H.t[H.t.length - 1],
      t0 = t1 - trend.span,
      ok = v => v != null && isFinite(v),
      all = [...(H.pv || []), ...(H.sp || [])].filter(ok);
    let lo = ok(H.lo) ? H.lo : Math.min(...all),
      hi = ok(H.hi) ? H.hi : Math.max(...all);
    if (!(hi > lo)) {
      lo -= 1;
      hi += 1;
    }
    const path = (A, a, z) =>
      (A || [])
        .map((v, i) =>
          ok(v) && H.t[i] >= t0
            ? ((W * (H.t[i] - t0)) / trend.span).toFixed(1) + ',' + (Ht - (Ht * (v - a)) / (z - a)).toFixed(1)
            : ''
        )
        .filter(Boolean)
        .join(' ');
    const ns = 'http://www.w3.org/2000/svg',
      svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + Ht);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Trend of ' + trend.key);
    for (const [A, cls, a, z] of [
      [H.mv, 'mv', 0, 100],
      [H.sp, 'sp', lo, hi],
      [H.pv, 'pv', lo, hi]
    ]) {
      const p = document.createElementNS(ns, 'polyline');
      p.setAttribute('points', path(A, a, z));
      p.setAttribute('class', cls);
      svg.append(p);
    }
    trend.box.replaceChildren(svg);
    const last = A => {
      const v = (A || []).filter(ok);
      return v.length ? v[v.length - 1] : null;
    };
    const item = (cls, name, v, unit) => {
      const d = E('span', 'st-tl ' + cls);
      d.append(
        E('i'),
        name + ' ',
        E('b', '', v == null ? '--' : fmt(v, Math.abs(v) < 100 ? 2 : 1)),
        ' ' + (unit || '')
      );
      return d;
    };
    trend.leg.replaceChildren(
      item('pv', 'Measured', last(H.pv), H.unit),
      item('sp', 'Set point', last(H.sp), H.unit),
      item('mv', 'Output', last(H.mv), '%'),
      E('span', 'st-tl', 'Scale ' + fmt(lo, 1) + ' to ' + fmt(hi, 1) + ' ' + (H.unit || '') + '; output 0 to 100 %')
    );
  }
  /* the faceplate of the page (its own popup): it takes the full name of the machine from the page, and it can be dragged by its title */
  function face() {
    faceOf($('#fpop'), '.fpo-h', f => {
      const b = $('.fpo-tt > b', f),
        key = b ? b.textContent.trim() : '',
        n = [...document.querySelectorAll('#plantws .hx-node[data-ms]')].find(x => x.dataset.ms === key),
        nm = n && $('.hx-name', n);
      return nm ? nm.textContent : key;
    });
    /* a controller: the name the page gives the loop (data-name of its card) */
    faceOf($('#plfp'), '.plfph', f => {
      const tag = f.dataset.tag || '',
        n = [...document.querySelectorAll('#plantws .hx-node[data-lv2]')].find(x => x.dataset.lv2 === tag);
      return (n && n.dataset.name) || tag;
    });
  }
  function faceOf(f, head, name) {
    if (!f) return;
    const nm = JSON.stringify(String(name(f)).replace(/\s+/g, ' ').trim());
    if (f._nm !== nm) f.style.setProperty('--st-name', (f._nm = nm));
    if (f._st) return;
    f._st = 1;
    const h = $(head, f);
    if (h && typeof window.AN === 'object' && typeof AN.fpHist === 'function') {
      const tb = document.createElement('button');
      tb.type = 'button';
      tb.className = 'st-fptrend';
      tb.textContent = 'Trend';
      tb.title = 'The measured value, the set point and the output over the last 10 or 30 minutes';
      tb.onclick = e => {
        e.stopPropagation();
        const key = f.dataset.tag || (($('.fpo-tt > b', f) || {}).textContent || '').trim();
        trendOpen(key, String(name(f)).replace(/\s+/g, ' ').trim());
      };
      h.append(tb);
    }
    if (h)
      h.addEventListener('pointerdown', e => {
        if (e.target.closest('button')) return;
        const x0 = e.clientX,
          y0 = e.clientY,
          l = f.offsetLeft,
          t = f.offsetTop;
        h.setPointerCapture(e.pointerId);
        const mv = ev => {
          f.style.left = l + ev.clientX - x0 + 'px';
          f.style.top = t + ev.clientY - y0 + 'px';
        };
        const up = () => {
          h.removeEventListener('pointermove', mv);
          h.removeEventListener('pointerup', up);
        };
        h.addEventListener('pointermove', mv);
        h.addEventListener('pointerup', up);
      });
  }

  /* the views of a plant page: its own Process and Trends views */
  function view(v) {
    const t = document.querySelectorAll('#plantws .hx-tabs button')[v];
    if (t) t.click();
    tabs._v = v;
    paint();
  }
  function paint() {
    const c = cur(),
      P = pages();
    /* a page opened from somewhere else (a link of a drawing, a save point) brings its own station with it */
    if (c && stnOf(c) !== stn) {
      stn = stnOf(c);
      fillPages();
    }
    if (c) mem.set('page-' + stn, c);
    const ci = eng ? curSheet() : -1;
    title.textContent = eng ? curTitle() : P[c] || '';
    const ds = eng ? curDesc() : '';
    if (ds) title.append(E('small', 'st-desc', ds));
    title.title = title.textContent.replace(ds, ds ? ' · ' + ds : '');
    tabs.hidden = eng || !!own;
    ownPg.hidden = eng || !own;
    /* UI audit 2026-11-21 D10: the plant page of the app under a page of the frame (First out, Generator panel, ...) takes no click and
       is not drawn; it comes back as it was when a plant page opens again */
    const ws = document.getElementById('plantws');
    if (ws) {
      const under = !eng && !!own;
      ws.inert = under;
      ws.style.visibility = under ? 'hidden' : '';
    }
    for (const b of mode.children) {
      b.classList.toggle('on', b._e === eng);
      b.setAttribute('aria-pressed', String(b._e === eng));
    }
    for (const b of sheets.querySelectorAll('.st-nav')) {
      b.classList.toggle('on', b._i === ci);
      if (eng && !restoring && b._i === ci && b._name) mem.set('sheet-' + fam, b._name);
    }
    for (const b of list.querySelectorAll('.st-nav')) {
      const on = b._id === c;
      b.classList.toggle('on', on);
      if (on) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    }
    for (const b of tabs.children) b.classList.toggle('on', (tabs._v || 0) === b._v);
  }
  const fmt = (v, dp) => (v == null || !isFinite(v) ? '--' : (+(+v).toFixed(dp) || 0).toFixed(dp).replace('-', '−'));
  const text = a =>
    String(a.nm ? a.nm + (a.lv ? ' ' + a.lv : '') : a.txt || a.text || a.msg || a.name || a.k || '')
      .replace(/\s+/g, ' ')
      .trim();
  function tick() {
    updAsk();
    why();
    trendDraw();
    if (own !== ownWas) {
      /* another page of the frame: its content is built anew */
      ownWas = own;
      crit.key = trp.key = soe.key = '';
      gov.h = null;
      gp.h = null;
      sc.key = '';
      ost.h = null;
      vt.key = '';
      if (ownPg) ownPg.replaceChildren();
    }
    if (own === '@soe' && !eng) soes();
    if (own === '@gen' && !eng) gens();
    if (own === '@score' && !eng) scores();
    if (own === '@criteria' && !eng) criteria();
    if (own === '@trip' && !eng) trips();
    if (own === '@load' && !eng) loads();
    if (own === '@vtest' && !eng) vtests();
    if (own === '@ost' && !eng) osts();
    /* the reader of the unit overview of the app (LS_LIVE.getV); the plant model value where the reader has none.
       After a start state is loaded and before the first Run the reader still holds the numbers of the state before (shellc-home.js
       "stale"): only the 150 MW state is its own snapshot, so the other states show the plant model value, or "--", until Run */
    const U = (window.AN && AN.unit) || {},
      ss = window.AN ? AN.startState : null;
    if (ss !== tick._ss) {
      tick._ss = ss;
      tick._fresh = ss === 'plantLoad150';
    }
    if (running()) tick._fresh = true;
    kv.title = tick._fresh ? '' : 'Press Paused to run the plant: the numbers are read on the first scan';
    for (const s of kv.children) {
      const v = tick._fresh ? call(() => +LS_LIVE.getV(s._n[1]), NaN) : NaN;
      s._b.textContent = fmt(isFinite(v) ? v : U[s._n[1]], s._n[3]);
    }
    const on = running();
    runB.textContent = on ? 'Running' : 'Paused';
    runB.classList.toggle('on', on);
    runB.setAttribute('aria-pressed', String(on));
    runB.title = on ? 'Press to pause the simulation' : 'Press to run the simulation';
    const sel = speedSel();
    spdB.hidden = !sel;
    spdB.textContent = 'Speed ×' + ((window.AN && AN.spd) || (sel && sel.value) || 1);
    const A = call(() => lsShellC.alarms(), [])
        .slice()
        .reverse(),
      nw = A.filter(a => !a.ack).length,
      a = A[0];
    almM.hidden = !a;
    almM.classList.toggle('new', !!(a && !a.ack));
    almT.textContent = a ? a.t || '' : '';
    almX.textContent = a ? text(a) : 'No standing alarm';
    almN.textContent = '';
    almN.append(E('b', '', A.length), ' standing · ', E('b', '', nw), ' not acknowledged');
    if (almPop && almPop._ack) almPop._ack.disabled = !nw;
    if (almPop && !almPop.hidden) {
      almPop._sub.textContent = A.length + ' standing';
      almPop._body.textContent = '';
      if (!A.length) almPop._body.append(E('p', 'st-none', 'No standing alarm.'));
      for (const x of A.slice(0, 40)) {
        const r = E('div', 'st-arow');
        r.append(
          E('i', 'st-mk' + (x.ack ? '' : ' new')),
          E('span', 'st-tm', x.t || ''),
          E('span', '', text(x)),
          E('small', '', x.ack ? 'acknowledged' : 'not acknowledged')
        );
        almPop._body.append(r);
      }
    }
    const C = conds();
    condB.hidden = eng || !C.length || (tabs._v || 0) !== 0;
    condB.textContent = 'Conditions · ' + C.length;
    if (condPop && !C.length) condPop.hidden = true;
    if (condPop && !condPop.hidden) {
      const key = C.map(c => c.g + c.label + c.state + c.k).join('|');
      if (key !== condPop._key) {
        condPop._key = key;
        condPop._sub.textContent = pages()[cur()] || '';
        condPop._body.textContent = '';
        let last = null;
        for (const c of C) {
          if (c.g !== last) condPop._body.append(E('div', 'st-cg', title1(c.g)));
          last = c.g;
          /* a condition whose object the app knows is a button: it goes to the page of that object and opens its faceplate */
          const tg = c.dy ? call(() => AN.condTarget(c.dy), null) : null,
            r = E(tg && tg.open ? 'button' : 'div', 'st-cond' + (tg && tg.open ? ' st-go' : ''));
          r.append(E('i', c.k ? 'st-dot ' + c.k : 'st-dot'), E('span', '', c.label), E('em', '', c.state));
          if (tg && tg.open) {
            r.title = 'Opens ' + (tg.mark || tg.open.split(':')[1] || 'its faceplate');
            r.onclick = () => jump(tg);
          }
          condPop._body.append(r);
        }
      }
    }
    face();
    /* a link of a drawing opens another sheet without the sheet list of the app: the list entry is set to the open sheet (no event) */
    if (eng && fam !== 'an') {
      const sel = shsel(),
        c = call(() => String(S.cur), '');
      if (sel && c && sel.value !== c && [...sel.options].some(o => o.value === c)) sel.value = c;
    }
    if (eng && curSheet() !== tick._s) {
      tick._s = curSheet();
      paint();
      showCur();
    }
    if (backB) backB.hidden = !eng || !appBack();
    if (cur() !== tick._c) {
      tick._c = cur();
      tabs._v = 0;
      paint();
    }
  }

  /* the start: the state of the plant is chosen on the start screen of the station, and loaded by the start screen of the app under it */
  function start(state) {
    const st = $('#scstart');
    if (vis(st)) {
      const chip = [...st.querySelectorAll('.scchips button')].find(b => b.textContent.trim() === state),
        card = [...st.querySelectorAll('.sccard')].find(b => /Operator/.test(b.textContent));
      if (chip) chip.click();
      if (card) card.click();
    }
    /* loaded = the start screen of the app has shown its overview (shellc-home.js loadState, then showOv); at 150 MW the logic of that state is on too */
    const loaded = () =>
      window.AN &&
      !AN._loading &&
      AN.startState &&
      (document.body.classList.contains('scov') || !state) &&
      (state !== '150 MW' || (window.DITL150 && DITL150.on));
    let asked = 0;
    const t = setInterval(() => {
      if (!loaded()) return;
      /* the plant pages exist once the Plant view has been opened */
      if (!pick() || !Object.keys(pages()).length) {
        if (asked++ % 10 === 0) call(() => window.lsPlant && lsPlant(true));
        return;
      }
      clearInterval(t);
      document.body.classList.add('st');
      wait.remove();
      build();
      const P = pages(),
        want = mem.get('page');
      go(P[want] ? want : P.overview ? 'overview' : Object.keys(P)[0]);
      if (mem.get('eng') === '1') setTimeout(restore, 800);
      /* the refresh of the station: each half second, each second in Lite mode */
      const loop = () => {
        tick();
        setTimeout(loop, lite.on ? 1000 : 500);
      };
      setTimeout(loop, 500);
      liteApply();
      liteMeasure();
      tick();
      setTimeout(() => dispatchEvent(new Event('resize')), 200);
    }, 300);
  }
  /* the two starting points of the spec (docs/SPEC.md S5, S6): full load and cold start; Warm and Hot are not in the spec */
  const STATES = [
    ['150 MW', 'Normal operation at full load'],
    ['Cold', 'Start-up from zero: drum 0 kg/cm², bed and water 30 °C']
  ];
  const wait = E('div');
  wait.id = 'stationwait';
  const ws = wait.attachShadow({ mode: 'open' });
  ws.append(
    E(
      'style',
      '',
      ':host{position:fixed;inset:0;z-index:2000;display:grid;place-items:center;background:#171b1f;color:#e6eaed;font:400 14px/1.4 "IBM Plex Sans","Segoe UI",system-ui,sans-serif}' +
        'main{width:min(560px,calc(100vw - 32px));display:grid;gap:8px}h1{font:600 20px/1.3 inherit;font-family:inherit;margin:0}p{margin:0 0 8px;color:#9aa4ae}' +
        'button{all:unset;box-sizing:border-box;display:grid;grid-template-columns:96px 1fr;gap:12px;align-items:center;min-height:48px;padding:8px 12px;border:1px solid #7a8692;border-radius:2px;background:#20262c;cursor:pointer}' +
        'button:hover{background:#2b333b;border-color:#a9b3bd}button:focus-visible{outline:2px solid #e6eaed;outline-offset:2px}button b{font-weight:600}button span{color:#9aa4ae;font-size:13px}small{color:#9aa4ae;font-size:12px}'
    )
  );
  const wm = E('main');
  ws.append(wm);
  const ask = () => {
    wm.textContent = '';
    wm.append(E('h1', '', NAME), E('p', '', 'Choose the state the plant starts from.'));
    for (const [k, d] of STATES) {
      const b = E('button');
      b.append(E('b', '', k), E('span', '', d));
      b.onclick = () => {
        wm.textContent = '';
        wm.append(E('h1', '', NAME), E('p', '', 'Loading the plant: ' + k + '…'));
        start(k);
      };
      wm.append(b);
    }
  };
  wm.append(E('h1', '', NAME), E('p', '', 'Starting…'));
  document.body.append(wait);
  const boot = setInterval(() => {
    const st = $('#scstart');
    if (vis(st)) {
      clearInterval(boot);
      /* ?state=... opens one state at once (the tests, a shortcut of the desktop) */
      const q = (/[?&]state=([^&]+)/.exec(location.search) || [])[1],
        k =
          q &&
          STATES.map(x => x[0]).find(
            x => x.toLowerCase().replace(/\s/g, '') === decodeURIComponent(q).toLowerCase().replace(/\s/g, '')
          );
      if (k) {
        wm.lastChild.textContent = 'Loading the plant: ' + k + '…';
        start(k);
      } else ask();
    } else if (window.AN && AN.startState && pick()) {
      clearInterval(boot);
      start('');
    }
  }, 200);
})();
