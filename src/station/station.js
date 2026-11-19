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
    ['', ['overview']],
    [
      'Fuel and air',
      ['coal', 'limestone-sand', 'oil-burners', 'combustion-air', 'furnace-gas', 'purge-trip', 'sootblowers']
    ],
    ['Steam', ['drum-steam', 'reheat-steam', 'extraction', 'aux-steam', 'generator']],
    ['Water', ['feedwater', 'condensate', 'sea-water', 'makeup-cooling', 'sampling']],
    ['Auxiliaries', ['compressed-air', 'ash']]
  ];
  /* The turbine has its own control system (TCS) with its own operator station, apart from the DCS of the plant (Hitachi TC-14-116,
     section 5.1 / 5.2): its pages are a list of their own, reached with the Plant / Turbine switch of the page list. */
  const TCS_GROUPS = [
    ['', ['turbine']],
    ['Operation', ['@criteria', '@load']],
    ['Protection', ['@trip']],
    ['Auxiliaries', ['turbine-oil']]
  ];
  /* pages the frame draws itself (their id starts with @): a list read from the turbine control of the app, no drawing */
  const OWN = { '@criteria': 'Start-up criteria', '@load': 'Speed and load', '@trip': 'Turbine trip' };
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
    const unit = E('div', 'st-unit', 'LMYP Unit 1'),
      hide = E('button', 'st-t', '‹ Hide');
    hide.setAttribute('aria-label', 'Hide the page list');
    unit.append(hide);
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
    const verB = E('button', 'st-t st-ver', VER || 'Version');
    verB.title = 'Version, update and channel';
    verB.onclick = about;
    foot.append(mode, insB, verB);
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
    /* the tools of a logic sheet: the zoom controls the app already has, as one small bar */
    tools = E('div', 'st-tools');
    tools.hidden = true;
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
    const setRail = on => {
      document.body.classList.toggle('st-norail', !on);
      root.classList.toggle('norail', !on);
      show.hidden = on;
      mem.set('rail', on ? '1' : '0');
      setTimeout(() => dispatchEvent(new Event('resize')), 30);
    };
    hide.onclick = () => setRail(false);
    show.onclick = () => setRail(true);
    setRail(mem.get('rail') !== '0');
    runB.onclick = () => {
      const A = window.AN;
      if (!A) return;
      call(() => (A.run && !A.view ? A.pauseOn() : A.runOn()));
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
      if (g) list.append(E('div', 'st-grp', g));
      for (const i of have) {
        const b = E('button', 'st-nav', P[i]);
        b._id = i;
        b.onclick = () => go(i);
        list.append(b);
      }
    }
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
      ids = STATIONS.find(x => x[0] === k)[3].flatMap(g => g[1]).filter(i => P[i]),
      last = mem.get('page-' + k);
    if (ids.length) go(ids.includes(last) ? last : ids[0]);
    setTimeout(paint, 60);
  }
  /* Engineer shows the logic view of the app (its own drawing, zoom and trace) inside the station; Operator shows the plant pages */
  function setEng(on) {
    eng = !!on;
    document.body.classList.toggle('st-eng', eng);
    list.hidden = eng;
    stnSeg.hidden = eng;
    sheets.hidden = !eng;
    if (eng) {
      call(() => lsSetTab('logic'));
      if (!sheets.firstChild) fillSheets();
      setTimeout(() => zoom('read'), 500);
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
  function zoom(k) {
    if (k === 'read') return readable();
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
  /* an entry of the sheet list of the app: "(6)DITL-01 · FURNACE PURGE CONDITION" */
  const optName = t =>
    String(t)
      .replace(/^\(\d+\)/, '')
      .split(' · ')[0]
      .trim();
  const optTitle = t => String(t).split(' · ').slice(1).join(' · ').trim();
  function setFam(f) {
    fam = f;
    const b = [...document.querySelectorAll('#gsbar button')].find(x =>
      x.title.startsWith(FAMS.find(y => y[0] === f)[2])
    );
    if (b) b.click();
    setTimeout(() => {
      fillSheets();
      tick();
      paint();
      zoom('read');
    }, 700);
  }
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
    const add = (name, title, i, open) => {
      const b = E('button', 'st-nav', name);
      b._i = i;
      b.title = title;
      b._q = (name + ' ' + title).toLowerCase();
      b.onclick = () => {
        call(open);
        setTimeout(tick, 150);
        setTimeout(() => zoom('read'), 500);
      };
      sheets.append(b);
    };
    if (fam === 'an')
      ((window.AN && AN.sheets) || []).forEach((x, i) => add(sheetName(x), sheetTitle(x), i, () => AN.go(i)));
    else {
      const sel = shsel();
      if (sel)
        for (const o of sel.options) {
          const tcs = /TCS-/.test(o.textContent);
          if (tcs !== (fam === 'tcs')) continue;
          add(optName(o.textContent), optTitle(o.textContent), o.value, () => {
            sel.value = o.value;
            sel.dispatchEvent(new Event('change', { bubbles: true }));
          });
        }
    }
    find.oninput = () => {
      const q = find.value.trim().toLowerCase();
      for (const b of sheets.querySelectorAll('.st-nav')) b.hidden = !!q && !b._q.includes(q);
    };
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
      whyPop.style.top = '56px';
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
    }
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
        call(() => AN.run && !AN.view && AN.pauseOn());
        pressId(id);
        insPop.hidden = true;
        setTimeout(tick, 1500);
      });
      r.append(b);
    }
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
    r.append(nm, sv);
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
          rr.append(E('span', '', e.name), ld, dl);
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
    for (const f of FL) {
      const id = 'flt-' + String(f.id).replace(/\W/g, '-'),
        b = E('button', 'st-b' + (f.on ? ' on' : ''), f.t);
      b.setAttribute('aria-pressed', String(!!f.on));
      b.title = f.on ? 'On: press to clear it' : 'Puts the fault on the running plant until it is cleared';
      if (f.on)
        b.onclick = () => {
          pressId(id);
          again();
        };
      else
        arm(
          b,
          f.t,
          () => {
            pressId(id);
            again();
          },
          true
        );
      N.push(b);
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
    for (const h of pg.querySelectorAll('.hx-hook:not([data-press])')) {
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
    tabs.hidden = eng || !!own;
    ownPg.hidden = eng || !own;
    for (const b of mode.children) {
      b.classList.toggle('on', b._e === eng);
      b.setAttribute('aria-pressed', String(b._e === eng));
    }
    for (const b of sheets.querySelectorAll('.st-nav')) b.classList.toggle('on', b._i === ci);
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
    if (own !== ownWas) {
      /* another page of the frame: its content is built anew */
      ownWas = own;
      crit.key = trp.key = '';
      gov.h = null;
      if (ownPg) ownPg.replaceChildren();
    }
    if (own === '@criteria' && !eng) criteria();
    if (own === '@trip' && !eng) trips();
    if (own === '@load' && !eng) loads();
    /* the reader of the unit overview of the app (LS_LIVE.getV); the plant model value where the reader has none.
       After a start state is loaded and before the first Run the reader still holds the numbers of the state before (shellc-home.js
       "stale"): only the 150 MW state is its own snapshot, so the other states show the plant model value, or "--", until Run */
    const U = (window.AN && AN.unit) || {},
      ss = window.AN ? AN.startState : null;
    if (ss !== tick._ss) {
      tick._ss = ss;
      tick._fresh = ss === 'plantLoad150';
    }
    if (window.AN && AN.run && !AN.view) tick._fresh = true;
    kv.title = tick._fresh ? '' : 'Press Paused to run the plant: the numbers are read on the first scan';
    for (const s of kv.children) {
      const v = tick._fresh ? call(() => +LS_LIVE.getV(s._n[1]), NaN) : NaN;
      s._b.textContent = fmt(isFinite(v) ? v : U[s._n[1]], s._n[3]);
    }
    const on = !!(window.AN && AN.run && !AN.view);
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
          const r = E('div', 'st-cond');
          r.append(E('i', c.k ? 'st-dot ' + c.k : 'st-dot'), E('span', '', c.label), E('em', '', c.state));
          condPop._body.append(r);
        }
      }
    }
    face();
    if (eng && curSheet() !== tick._s) {
      tick._s = curSheet();
      paint();
    }
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
      setInterval(tick, 500);
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
