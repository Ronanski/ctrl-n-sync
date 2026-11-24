/* HX in the app (user 2026-11-17: "Ganyan ang HMI na gsto ko. Dapat iyan lang makita ko"): the adapter HX.data of README section 5 and
   the registration of every HX page as a page of the Plant view.
   ONE source of every number: the page never reads the simulator itself.
   - a value key      = the same link a temporary page uses for that tag (plant.js api.reg 'val': the logic transmitter first, else
                        the plant model key of the temporary page, LS_MOCK.defs[].unit), so both pages can never show two numbers;
   - a controller     = plant.js api.reg 'ctl' (PV, SV, MV, mode), click = the controller faceplate of the app;
   - a valve of a DITL sheet = the resolver of hmi-mock.js (position, AUTO / MANUAL, Y / N), read through a hidden page of
                        hmi-mock.js built from the bind of hx-registry.js; click = the two faceplates of fp-pop.js.
   Nothing here presses or forces anything: the faceplates do. */
(function () {
  if (!window.PLANT_V2 || !window.HX || !window.LS_MOCK || !HX.pages) return;
  const NS = 'http://www.w3.org/2000/svg',
    R = window.HXREG || { machines: {}, loops: {}, sample: { valves: {} } };
  const call = (f, d) => {
    try {
      const r = f();
      return r == null ? d : r;
    } catch (e) {
      return d;
    }
  };
  const fin = x => (x != null && isFinite(x) ? +x : null);
  const unitKey = tag => {
    for (const d of LS_MOCK.defs) if (d.unit && d.unit[tag]) return d.unit[tag];
    return null;
  };
  /* the sheet and tag of a valve: hx-registry.js (what the temporary pages bind) */
  const bindOf = tag => {
    const m = R.machines[tag],
      v = (R.sample && R.sample.valves && R.sample.valves[tag]) || null;
    if (m && m.bind && m.bind.mov) return { mov: m.bind.mov, tg: m.bind.tg || tag, t: m.t || tag };
    if (v && v.bind) return { mov: v.bind, tg: tag, t: tag };
    return null;
  };
  let S = null; /* the store of the page that is open: one page of the Plant view at a time */
  let lastXY = [200, 200];
  document.addEventListener('pointerdown', e => (lastXY = [e.clientX, e.clientY]), true);
  function store(api, g) {
    const st = {
      api,
      LOG: {},
      PM: {},
      CT: {},
      vals: new Set(),
      hooks: {},
      loops: {},
      valves: {},
      machs: {},
      px: null,
      pm: {}
    };
    /* hidden holder of the click targets of the controllers and of the page of hmi-mock.js that resolves the valves */
    st.px = document.createElementNS(NS, 'g');
    st.px.setAttribute('opacity', '0');
    /* 2026-11-22: not painted and never under the pointer (its targets are clicked by code only) */
    st.px.setAttribute('visibility', 'hidden');
    st.px.setAttribute('pointer-events', 'none');
    st.px.setAttribute('aria-hidden', 'true');
    g.append(st.px);
    return st;
  }
  const needVal = key => S && S.vals.add(key);
  const needHook = (h, label) =>
    S && !(h in S.hooks) && (S.hooks[h] = { i: Object.keys(S.hooks).length, label: label || '' });
  const needLoop = tag => {
    if (!S || S.loops[tag]) return;
    const st = S,
      hit = document.createElementNS(NS, 'rect');
    hit.setAttribute('width', '1');
    hit.setAttribute('height', '1');
    st.px.append(hit);
    st.loops[tag] = hit;
    st.api.reg({ t: 'ctl', tag }, X => (st.CT[tag] = X || null), hit);
  };
  const needValve = tag => S && !(tag in S.valves) && (S.valves[tag] = bindOf(tag));
  /* a machine (pump, fan ...): the SAME description the temporary page has for it (LS_MOCK.defs: its DITL sheet, I/O tag, lube oil
     pumps ...), found by the page and id of hx-registry.js, so state, mode, Y / N and both faceplates are the ones of that page */
  const machDef = name => {
    const m = R.machines[name],
      d = m && LS_MOCK.defs.find(x => x.id === m.page);
    return (d && d.mach && d.mach[m.id]) || null;
  };
  const needMach = name => S && !(name in S.machs) && (S.machs[name] = machDef(name));
  /* after the first pass of the page (every key it asks is known): the hidden page of hmi-mock.js for its valves */
  /* beta.486 (EIMI): the monitor rows (o.mon) and the VCB point (o.vcb) that the page gives a machine (HX.M), by machine name */
  function machExtra() {
    const X = {},
      d = S && S.def;
    if (!d) return X;
    const all = d.plan ? d.plan.items : (d.lanes || []).flatMap(L => L.items.flatMap(c => (Array.isArray(c) ? c : [c])));
    for (const it of all) {
      if (!it || it.k !== 'mach' || !(it.mon || it.vcb)) continue;
      const x = (X[it.mach] = X[it.mach] || { mon: [], vcb: null });
      for (const r of it.mon || []) if (!x.mon.some(q => q.key === r.key && q.label === r.label)) x.mon.push(r);
      if (it.vcb) x.vcb = it.vcb;
    }
    return X;
  }
  const plainKey = k => !/^(an|tcs):/.test(k);
  function proxy() {
    const mach = {},
      unit = {},
      EX = machExtra();
    /* the keys of the monitor rows are values of the page as well (linked before the hidden page is built) */
    for (const n in EX) for (const k of EX[n].mon.map(r => r.key).concat(EX[n].vcb || [])) if (plainKey(k)) needVal(k);
    let art = '';
    /* values: [data-v] of hmi-mock.js (the logic transmitter, else the plant model key, 'tt:' and 'ux:' keys of the temporary pages) */
    for (const key of S.vals) {
      const u = unitKey(key);
      if (u) unit[key] = u;
      art += '<text data-v="' + key + '" data-dp="6"></text>';
    }
    /* push buttons and states (HX.B): the element the page of hmi-mock.js wires, with the same data attribute */
    for (const h in S.hooks) {
      if (h.slice(0, 3) === 'fv:') continue;
      art +=
        '<g data-hxk="' +
        S.hooks[h].i +
        '" ' +
        h +
        '><rect width="1" height="1" fill="none"/><text>' +
        S.hooks[h].label.replace(/[<&]/g, '') +
        '</text></g>';
    }
    for (const tag in S.valves) {
      const b = S.valves[tag];
      if (!b) continue;
      mach[tag] = { n: tag, t: b.t, mov: b.mov, tg: b.tg };
      art +=
        '<text data-mov="' +
        b.mov +
        '|' +
        b.tg +
        '|pct" data-hxp="' +
        tag +
        '"></text>' +
        '<text data-mov="' +
        b.mov +
        '|' +
        b.tg +
        '|am" data-hxm="' +
        tag +
        '"></text>' +
        '<text data-ynt="' +
        tag +
        '" data-hxy="' +
        tag +
        '"></text>' +
        '<rect data-hit="' +
        tag +
        '" width="1" height="1"/><rect data-yn="' +
        tag +
        '" width="1" height="1"/>';
    }
    for (const name in S.machs) {
      if (!S.machs[name]) continue;
      const ex = EX[name];
      /* a copy: the description of the temporary page (LS_MOCK.defs) is shared and stays as it is */
      mach[name] = !ex
        ? S.machs[name]
        : Object.assign({}, S.machs[name], {
            mon: (S.machs[name].mon || []).concat(ex.mon.map(r => [r.label, () => HX.data.value(r.key), r.unit, plainKey(r.key) ? r.key : '', r.dp, r.words])),
            vcb: ex.vcb ? () => HX.data.value(ex.vcb) : S.machs[name].vcb,
            vcbTag: ex.vcb && plainKey(ex.vcb) ? ex.vcb : ''
          });
      art +=
        '<text data-st="' +
        name +
        '" data-hxs="' +
        name +
        '"></text><text data-md="' +
        name +
        '" data-hxd="' +
        name +
        '"></text>' +
        '<text data-ynt="' +
        name +
        '" data-hxy="' +
        name +
        '"></text>' +
        '<rect data-hit="' +
        name +
        '" width="1" height="1"/><rect data-yn="' +
        name +
        '" width="1" height="1"/>';
    }
    if (!art) return;
    const g2 = document.createElementNS(NS, 'g');
    S.px.append(g2);
    S.pm = { g: g2 };
    call(() =>
      LS_MOCK.page({
        id: 'HXP',
        bare: true,
        title: '',
        w: 10,
        h: 10,
        art,
        mach,
        unit,
        udi: Object.assign({}, ...LS_MOCK.defs.map(d => d.udi || {}))
      })(g2, S.api)
    );
  }
  const pq = sel => (S && S.pm.g ? S.pm.g.querySelector(sel) : null);
  /* the faceplate of fp-pop.js opens beside the element that was clicked: the hidden click target is moved under the pointer first */
  const under = el => {
    const m = call(() => el.parentNode.getScreenCTM().inverse(), null);
    if (!m) return;
    const p = new DOMPoint(lastXY[0], lastXY[1]).matrixTransform(m);
    el.setAttribute('x', p.x);
    el.setAttribute('y', p.y);
  };
  const click = el =>
    el &&
    (under(el), true) &&
    el.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true, clientX: lastXY[0], clientY: lastXY[1] })
    );
  /* audit 2026-11-21 A1: a click on a measured value (a transmitter on its line, a value beside its equipment) opened nothing. It opens
     the PERMISSIVE · TREND · MONITOR faceplate of fp-pop.js (the house faceplate, one look): the value now and its trend. The trend
     starts with what the trend recorder of the HX pages (HX.rec, simulation time) already holds for that value, so it is not empty. */
  function valueCard(anchor, name, keys) {
    if (!window.LS_FPOP || !LS_FPOP.info || !anchor) return false;
    const vs = keys
      ? [...anchor.querySelectorAll('[data-hv]')].filter(e => keys.includes(e.dataset.hv))
      : [...anchor.querySelectorAll('[data-hv]')];
    const rows = (vs.length ? vs : (keys || []).map(k => ({ dataset: { hv: k, dp: 1 } }))).map(e => {
      const k = e.dataset.hv,
        u = e.parentNode && e.parentNode.querySelector ? e.parentNode.querySelector('.hx-unit') : null,
        lb = e.parentNode && e.parentNode.previousElementSibling && e.parentNode.previousElementSibling.classList.contains('hx-lab') ? e.parentNode.previousElementSibling.textContent : '';
      return { k, dp: e.dataset.dp == null ? 1 : +e.dataset.dp, unit: u ? u.textContent.trim() : '', lb: lb || (e.parentNode && e.parentNode.firstChild && e.parentNode.firstChild.nodeType === 3 ? e.parentNode.firstChild.textContent.trim() : '') };
    });
    if (!rows.length) return false;
    const title = name || anchor.getAttribute('aria-label') || rows[0].k,
      tagEl = anchor.querySelector('.hx-tag'),
      r0 = rows[0],
      h = 'Trend · ' + (r0.lb || title) + ' · ' + r0.k,
      H = (window.LS_FPHIST = window.LS_FPHIST || {}),
      buf = HX.rec && HX.rec.watch ? HX.rec.watch(r0.k) : null /* recorded from now on as well, for the next time */,
      now = Date.now(),
      tNow = HX.data.time(),
      spd = call(() => (AN.spd > 0 ? AN.spd : 1), 1);
    if (buf && buf.length && !(H['trend:' + h] && H['trend:' + h].length))
      H['trend:' + h] = buf.filter(p => p[1] != null && isFinite(p[1])).map(p => [now - ((tNow - p[0]) / spd) * 1000, p[1]]);
    return LS_FPOP.info({
      n: title,
      t: tagEl ? tagEl.textContent : r0.k,
      mon: rows.map(r => [(r.lb || title) + (rows.length > 1 && !r.lb ? ' · ' + r.k : ''), () => HX.data.value(r.k), r.unit, r.dp]),
      trend: { h, fn: () => HX.data.value(r0.k) }
    });
  }
  /* beta.486 (EIMI): the TCS operator buttons and lamps (the CRT ports of the TCS soft logic, lanes/tcs-crt-ports.json). HX.B hooks:
       'crt:<port>'          a push button, e.g. HX.B('RESET', 'crt:CRT:TCE114.<tag>', { press: true }): a press holds the port
                             CRT.HOLD ms (the TCS program reads a CRT press as a held contact);
       'crtl:<sheet>|<key>'  a lamp, e.g. HX.B('TRIP', 'crtl:TCE114|<lamp tag>'): ON (lit) at 1, OFF at 0.
     While the TCS program is not running (no API, or a read gives no value) the lamp shows '-----' and a press does nothing.
     CRT.press / CRT.read are the ONE place that names the live API of the TCS program (lane 9); nothing else calls it. */
  const CRT = {
    HOLD: 3000,
    api: () => (window.TCE && typeof TCE.press === 'function' && typeof TCE.read === 'function' ? TCE : null),
    press: (port, ms) => call(() => CRT.api().press(port, ms), null),
    read: (sheet, key) => call(() => CRT.api().read(sheet, key), null)
  };
  const crtLamp = h => {
    const i = h.indexOf('|'),
      v = CRT.api() ? CRT.read(h.slice(5, i), h.slice(i + 1)) : null,
      x = typeof v === 'boolean' ? (v ? 1 : 0) : v != null && isFinite(v) ? +v : null;
    return { text: x == null ? '-----' : x >= 0.5 ? 'ON' : 'OFF', tone: x == null ? '' : x >= 0.5 ? 'on' : '' };
  };
  const ALC = { t: 0, m: {} };
  HX.data = {
    time: () => call(() => (window.AN && AN.unit && isFinite(AN.unit.t) ? AN.unit.t : null), Date.now() / 1000),
    value(key) {
      /* Audit 3: a value with no row on the app pages reads its field of the unit model ('an:Pip' = AN.unit.Pip) */
      /* beta.486 (EIMI): a dotted path reads a field inside the unit model ('an:lpHt.H2.dr' = AN.unit.lpHt.H2.dr); a flag reads 1 / 0 */
      if (/^an:/.test(key))
        return call(() => { const v = key.slice(3).split('.').reduce((o, k) => (o == null ? o : o[k]), AN.unit); return typeof v === 'boolean' ? (v ? 1 : 0) : v != null && isFinite(v) ? +v : null; }, null);
      /* a value of the TCS model ('tcs:aux.hso' = AN.tcs().aux.hso); an open / closed flag reads 100 / 0 % */
      if (/^tcs:/.test(key))
        return call(() => { const v = key.slice(4).split('.').reduce((o, k) => (o == null ? o : o[k]), AN.tcs()); return typeof v === 'boolean' ? (v ? 100 : 0) : v != null && isFinite(v) ? +v : null; }, null);
      needVal(key);
      const e = pq('[data-v="' + key + '"]'),
        t = e ? e.textContent : '';
      return /^-?[0-9]/.test(t) ? parseFloat(t) : null;
    },
    machine(name) {
      needMach(name);
      const e = pq('[data-hxs="' + name + '"]');
      if (!e) return null;
      const t = e.textContent || '',
        /* a system that has no motor state but a state row on its drawing (limestone filling cycle, sand system: registry
           bind.d + bind.df.st, the row its faceplate reads): 1 = on */
        /* a field item without a logic row: the lower ring header drains are a state of the plant model (hmi-mock-ms.js LHD) */
        FLD = name === 'V-BD1005 ~ V-BD1021' ? call(() => (AN.fieldState().lhd ? 1 : 0), null) : null,
        BD = R.machines[name] && R.machines[name].bind,
        DFV = BD && BD.df && BD.d && BD.df.st != null ? call(() => window.LS_OP.dout(BD.d, BD.df.st), null) : null,
        md = (pq('[data-hxd="' + name + '"]') || {}).textContent || '',
        y = (pq('[data-hxy="' + name + '"]') || {}).textContent || '',
        /* 3.2.5-beta.1 (JENNIE live Cold 2026-11-18, F-L): a state row that is not a running state (DITL-09 row 26 REMOTE of the
           burner panels) showed as Running in red on the oil page, a burner without flame looked fired: the words of the row, grey */
        ON = DFV != null && BD.df.on ? String(BD.df.on) : '',
        /* Audit 3: the tube cleaning panels (DITL-119) get only REMOTE AUTO START / STOP pulses (rows 7, 9, 18, 20); no running
           feedback comes back to the DCS (hmi-sw.js 'STATUS AT LCP'), so the page says where the state is instead of '-----' */
        LCP = /^CTCS-[AB]$/.test(name) ? 'STATUS AT LOCAL PANEL' : null,
        word = LCP || (ON && !/^(OPERATING|RUNNING|SYSTEM ON|FILL CYCLE ON|OPEN)$/.test(ON) ? (DFV === 1 ? ON : BD.df.off || '') : null);
      return {
        word,
        st:
          /REMOTE/.test(ON)
            ? null
            : (FLD != null ? FLD : DFV) != null
            ? (FLD != null ? FLD : DFV) === 1
              ? 'run'
              : 'stop'
            : t === 'RUNNING'
              ? 'run'
              : t === 'STOPPED'
                ? 'stop'
                : t === 'TRIP'
                  ? 'trip'
                  : null,
        /* a part the page of hmi-mock.js cannot tell (a machine without an AUTO selection) is left out */
        mode:
          md
            .split(' · ')
            .filter(x => x && x !== '-----')
            .join(' · ') || null,
        perm: y === 'Y' ? true : y === 'N' ? false : null
      };
    },
    loop(tag) {
      needLoop(tag);
      const X = S && S.CT[tag];
      if (!X) return null;
      const u = (R.loops[tag] && R.loops[tag].s && R.loops[tag].s.unit) || '';
      return {
        pv: fin(X.pv),
        sv: fin(X.sv),
        mv: fin(X.mv),
        mode: X.m === 'M' ? 'MANUAL' : X.m === 'R' ? 'REMOTE' : X.m === 'A' ? 'AUTO' : null,
        unit: u
      };
    },
    valve(tag) {
      needValve(tag);
      const p = pq('[data-hxp="' + tag + '"]');
      if (!p) return null;
      const m = /-?\d+(?:\.\d+)?/.exec(p.textContent || ''),
        pct = m ? +m[0] : null,
        am = (pq('[data-hxm="' + tag + '"]') || {}).textContent || '',
        y = (pq('[data-hxy="' + tag + '"]') || {}).textContent || '';
      return {
        pct,
        open: pct == null ? null : pct > 0.5,
        mode: /^AUTO/.test(am) ? 'AUTO' : /^MANUAL/.test(am) ? 'MANUAL' : null,
        perm: y === 'Y' ? true : y === 'N' ? false : null
      };
    },
    flag: () => null,
    /* the step cards of the automatic turbine start-up: the check list of hmi-mock.js (page 13) */
    ats: () => call(() => (window.LS_ATS ? LS_ATS() : null), null),
    /* the standing alarms of the app by transmitter: the first word of an alarm is its DCS tag (PIST10013, LIHD11022); the
       value on a page may be named by the indicator (PI..., TI..., LI..., FI...) or by its transmitter (PT, TT / TE, LT, FT),
       so both spellings are given. Value: true = acknowledged */
    alarms() {
      const now = Date.now();
      if (ALC.t && now - ALC.t < 1000) return ALC.m;
      const m = {};
      for (const a of call(() => lsActiveAlarms().list, []) || []) {
        const tag = String((a && a.text) || '')
          .split(' ')[0]
          .replace(/[^A-Za-z0-9]/g, '')
          .toUpperCase();
        if (tag.length < 5) continue;
        const ack = !!a.ack;
        m[tag] = ack;
        if (tag[1] === 'I') {
          m[tag[0] + 'T' + tag.slice(2)] = ack;
          m[tag[0] + 'E' + tag.slice(2)] = ack;
        }
      }
      ALC.t = now;
      ALC.m = m;
      return m;
    },
    hook(h, label) {
      /* a hand valve of the plant model: the state and the field faceplate of fp-pop.js */
      if (h.slice(0, 3) === 'fv:') {
        const o = call(() => LS_FPOP.valveOpen(h.slice(3)), null);
        return { text: o == null ? '' : o ? 'OPEN' : 'CLOSED', tone: o == null ? '' : o ? 'run' : 'stop' };
      }
      if (h.slice(0, 5) === 'crtl:') return crtLamp(h);
      if (h.slice(0, 4) === 'crt:') return { text: CRT.api() ? '' : '-----', tone: '' };
      needHook(h, label);
      const e = S && S.hooks[h] && pq('[data-hxk="' + S.hooks[h].i + '"]');
      if (!e) return null;
      let text = '';
      for (const n of e.childNodes) if (n.nodeName !== 'title' && n.nodeName !== 'rect') text += n.textContent;
      text = text.trim();
      const r = e.querySelector('rect'),
        lit = !!r && (r.getAttribute('fill') || 'none') !== 'none',
        f = String(e.getAttribute('fill') || '').toLowerCase();
      return {
        text: text === S.hooks[h].label ? '' : text,
        tone: lit ? 'on' : f === '#ff6b6b' ? 'run' : f === '#4fd06a' ? 'stop' : ''
      };
    },
    press(h) {
      if (h.slice(0, 3) === 'fv:') return void call(() => LS_FPOP.valveTag(h.slice(3)));
      if (h.slice(0, 4) === 'crt:') {
        if (!CRT.api()) return;
        CRT.press(h.slice(4), CRT.HOLD);
        return void call(() => window.lsEventAdd('TCS', 'DCS', 'Operator: ' + h.slice(4) + ' pressed (HMI)'));
      }
      if (h.slice(0, 5) === 'crtl:') return;
      const e = S && S.hooks[h] && pq('[data-hxk="' + S.hooks[h].i + '"]');
      if (e)
        e.dispatchEvent(
          new MouseEvent('click', { bubbles: true, cancelable: true, clientX: lastXY[0], clientY: lastXY[1] })
        );
    },
    open(kind, id, second, anchor, name) {
      if (kind === 'value') return void valueCard(anchor, name, [id]);
      if (kind === 'loop') return click(S && S.loops[id]);
      /* audit 2026-11-21 A1 / A2: a piece of plant with no faceplate of its own (strainer, tube cleaning, generator values) or a
         Y square whose target is missing opened nothing under a hand cursor: the values it shows, with their trend */
      if (!click(pq(second ? '[data-yn="' + id + '"]' : '[data-hit="' + id + '"]'))) valueCard(anchor, name, null);
    }
  };
  /* one HX page = one page of the Plant view: the HTML page of HX inside the 1920 x 1000 frame of the Plant view */
  const FW = 1920,
    FH = 1140;
  /* audit 2026-11-21 C10: on a tablet (1280 x 800) the Plant view fitted the whole 1920 x 1140 frame into the area, so every word
     of the drawing came out at 0.6 (6-7 px). Where the area is narrower than 1500 px the frame is the size of the area itself (1 : 1):
     the page scrolls inside it and the drawing keeps its readable width (hx.css .hx-real min-width); a desktop keeps the whole page */
  const frame = () => {
    const e = document.getElementById('plsvg'),
      r = e ? e.getBoundingClientRect() : null;
    /* beta.295 (user, apk test 2026-11-22: "Draggable p rin ang hmi at hndi fit ang scale ng display nya sa screen"): on a touch screen
       of the Operator Station (the apk) the page is fitted whole into the area and nothing moves under a finger; the words keep their
       11 px minimum (hx-core.js minText) and the tag numbers step back at that scale. A mouse screen keeps the C10 frame below */
    /* beta.305: every screen big enough to hold the whole page (HX.fitWhole), touch or mouse */
    if (window.HX && HX.fitWhole && HX.fitWhole()) return [FW, FH];
    return r && r.width > 300 && r.width < 1500 && r.height > 300 ? [Math.round(r.width), Math.round(r.height)] : [FW, FH];
  };
  function screen(def) {
    return function (g, api) {
      S = store(api, g);
      S.def = def;
      const fo = document.createElementNS(NS, 'foreignObject');
      const [fw, fh] = frame();
      for (const [a, v] of Object.entries({ x: 0, y: 0, width: fw, height: fh })) fo.setAttribute(a, v);
      const host = document.createElement('div');
      host.className = 'hx-app';
      /* C10: the 1 : 1 frame of a tablet scrolls (the page is taller than the area) */
      if (fw < FW) host.style.overflow = 'auto';
      fo.append(host);
      g.append(fo);
      /* a link to another page: the page list of the Plant view opens it, as a link of an old page does (hmi-mock.js data-go).
               Found 2026-11-17 on the new overview: lsPlant(id) only SHOWS the Plant view (it takes true / false), so no link of a
               realistic page ever changed the page */
      const goPage = id => {
        const pk = document.querySelector('#plantws .plpick'),
          v = 'HX-' + id;
        if (pk && [...pk.options].some(o => o.value === v)) {
          pk.value = v;
          pk.dispatchEvent(new Event('change', { bubbles: true }));
        } else call(() => api.go && api.go(v));
      };
      const h = HX.mount(host, def.id, { noTimer: true, go: goPage });
      /* every view once, so each key the page reads is linked before plant.js resolves the links of the page */
      for (const v of ['controls', 'trends', 'process']) call(() => h.show(v));
      proxy();
      const t = setInterval(() => {
        if (!host.isConnected) return (clearInterval(t), call(() => h.destroy && h.destroy()));
        call(() => h.tick());
      }, 500);
      return fo;
    };
  }
  const L = (window.PLANT_SYS = window.PLANT_SYS || []);
  HX.pages.forEach((def, i) => {
    const id = 'HX-' + def.id;
    PLANT_V2.screens[id] = screen(def);
    L.splice(i, 0, {
      fitAll: 1,
      id,
      title: def.title,
      num: 'R' + String(i + 1).padStart(2, '0'),
      name: def.title.toUpperCase(),
      src: '',
      get w() {
        return frame()[0];
      },
      get h() {
        return frame()[1];
      },
      v2: true,
      screen: id,
      style: 'steel',
      items: [],
      hx: true
    });
  });
  /* THE OLD PAGES THAT ARE GONE (user 2026-11-17: "Ung temporary at old hmi, aalisin na"): an old page leaves the page list when
     the new page shows everything it had. Its entry stays (the description of its machines is still read by the new page, and
     old links still name it) with gone = the new page, which plant.js opens instead. One line per old page, added only after
     the new page was checked against it. */
  const GONE = {
    UNIT: 'HX-overview' /* UNIT: BOILER + TURBINE: its controllers and values are on the pages of their systems */,
    MK00: 'HX-overview' /* OVERVIEW: its values, the five controllers, a link to every page */,
    APH: 'HX-combustion-air' /* 038 AIR PREHEATER: main drive, back-up air motor valve, air and gas values */,
    BIAS: 'HX-reheat-steam' /* 039 RH / SH BIASING DAMPER: pass dampers, spray, gas temperatures */,
    MK16: 'HX-sampling' /* SAMPLING AND DOSING: every analyzer, alarm, pump and level switch it had */,
    MK09: 'HX-furnace-gas' /* AIR AND FLUE GAS: Furnace and flue gas + Combustion air */,
    AFG: 'HX-furnace-gas' /* 007 AIR & FLUE GAS, the page before MK09 */,
    MK04: 'HX-turbine-oil' /* 036 TURBINE OIL (temporary page 04) */,
    TO: 'HX-turbine-oil' /* 036 TURBINE OIL, the page before MK04 */,
    MK08: 'HX-aux-steam' /* AUX STEAM AND VACUUM */,
    MK18: 'HX-extraction' /* EXTRACTION AND DRAINS */,
    MK17: 'HX-generator' /* GENERATOR: every state and value it had */,
    MK15: 'HX-sootblowers' /* SOOTBLOWERS: every blower, state and value it had */,
    CWN: 'HX-sea-water' /* 030 CIRCULATING WATER: pumps, values, hand valves, filter states */,
    MK02: 'HX-makeup-cooling' /* MAKE-UP AND CLOSED COOLING WATER: pumps, values, hand valves, fill valve */,
    MK03: 'HX-compressed-air' /* INSTRUMENT AND PLANT AIR: machines, values, the one model valve */,
    MK13: 'HX-turbine' /* TURBINE START: valves, breakers, step cards with their check items, push buttons, first out */,
    MK11: 'HX-oil-burners' /* DIESEL OIL AND BURNERS: the six field valves, the burner states and all values are on the new page */,
    MK12: 'HX-coal' /* COAL, LIMESTONE AND SAND: feeders on the Coal page, the two trains on the Limestone and sand page */,
    MK05: 'HX-condensate' /* CONDENSATE: the heater valves and the polisher flow are on the new page */,
    MK06: 'HX-feedwater' /* FEEDWATER: the heater valves and the deaerator temperature are on the new page */,
    MK07: 'HX-drum-steam' /* BOILER WATER AND STEAM: spray valve positions and the ring header drains are on the new page */,
    MK14: 'HX-ash' /* ESP AND ASH: the bottom ash train, the coolers and the precipitator panel are on the new page */,
    MK10: 'HX-purge-trip' /* PURGE AND TRIP: every row of DITL-01 / 02 / 03A it had */,
    /* an older page of a system whose temporary page is still needed (hand valves, states the new look has no piece for yet):
       it opens that temporary page until the new page is complete */
    SW: 'HX-sea-water' /* 030 SEAWATER */,
    MU: 'HX-makeup-cooling' /* MAKE-UP WATER */,
    CW: 'HX-makeup-cooling' /* 027 CLOSED COOLING WATER */,
    IA: 'HX-compressed-air' /* INSTRUMENT & PLANT AIR */,
    /* the first temporary pages (2026-11-03, removed on 2026-11-21 with the Training steps they read), each followed by a page 00 ~ 18 */
    TCF: 'HX-condensate',
    TDO: 'MK11',
    TFN: 'HX-combustion-air',
    TPG: 'HX-purge-trip',
    TBR: 'MK11',
    TTA: 'HX-turbine-oil',
    TTS: 'HX-turbine',
    TCC: 'MK12'
  };
  for (const e of L) if (GONE[e.id] && L.some(x => x.id === GONE[e.id])) e.gone = GONE[e.id];
  window.LS_HX = { pages: () => HX.pages.map(p => p.id), store: () => S, gone: GONE };
})();
