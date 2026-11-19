/* AN.condTarget(dy): the object a condition row of a logic sheet belongs to, for the pressable conditions of the station
   (user "go all" 2026-11-19, item 1). dy = "SHEET|i|row" (an input row) or "SHEET|o|row" (an output row), the data-dy of the pages.
   Returns { page, open, mark } or null:
   - page = the HX page id that shows the object, open = its data-open on that page ('loop:TAG', 'mach:NAME', 'valve:TAG'),
     mark = the tag to point at (the field device when the row is its limit switch, MCV-FA1053-1 for "PAF INLET VANE CLOSED").
   Traced from the logic, never from the words of the label:
   1. an output row of a machine sheet: the machine of that sheet (HXREG machines bind.d / bind.ad, HXCARDS valves sheet);
   2. an input row: its sources in the one world (WORLD.idx.din, the same links the simulation runs): a row fed by another DITL
      sheet -> the machine of that sheet; a row fed by an ABC net -> the controller of that net (TAG.MV / .PV / .SV), else the
      controller of the station that drives it; a limit / level / pressure switch of the plant model (WORLD.plantSwSrc) -> the station
      or transmitter loop it follows; the row's own tag when it is a page object;
   3. none of these on any page -> null (the row is shown, not pressable). */
(function () {
  const call = (f, d) => {
    try {
      const v = f();
      return v === undefined ? d : v;
    } catch (e) {
      return d;
    }
  };
  const bare = n => String(n || '').replace(/^\(S?\d+\)/, '').trim();
  let IX = null,
    IXn = 0;
  /* every object of every HX page: kind:id -> the first page that shows it; DITL sheet -> machine / valve */
  function index() {
    const n = (window.HX && HX.pages && HX.pages.length) || 0;
    if (IX && IXn === n) return IX;
    IXn = n;
    IX = { on: {}, sheet: {} };
    const put = (k, id, pg) => {
      if (id && !IX.on[k + ':' + id]) IX.on[k + ':' + id] = pg;
    };
    for (const p of (window.HX && HX.pages) || []) {
      const walk = (o, d) => {
        if (!o || d > 12) return;
        if (typeof o === 'string') {
          for (const m of o.matchAll(/data-open="(loop|mach|valve):([^"]+)"/g)) put(m[1], m[2], p.id);
          return;
        }
        if (typeof o !== 'object') return;
        if ((o.k === 'loop' || o.k === 'mach' || o.k === 'valve') && typeof o[o.k] === 'string') put(o.k, o[o.k], p.id);
        for (const k in o) {
          if ((k === 'loops' || k === 'machines' || k === 'valves') && Array.isArray(o[k]))
            for (const x of o[k]) if (Array.isArray(x)) put(k === 'loops' ? 'loop' : k === 'machines' ? 'mach' : 'valve', x[0], p.id);
          walk(o[k], d + 1);
        }
      };
      walk(p, 0);
    }
    const R = window.HXREG || {},
      C = window.HXCARDS || {};
    for (const nm in R.machines || {}) {
      const b = R.machines[nm].bind || {};
      for (const sh of [b.d, b.ad, b.mov]) if (sh && /^DITL-/.test(sh) && !IX.sheet[sh]) IX.sheet[sh] = ['mach', nm, b.tg || nm];
    }
    for (const tg in C.valves || {}) {
      const sh = C.valves[tg].sheet;
      if (sh && !IX.sheet[sh]) IX.sheet[sh] = ['valve', tg, tg];
    }
    return IX;
  }
  /* the object kind:id on a page: valves and machines named by a tag are both tried */
  function hit(kind, id, mark) {
    if (!id) return null;
    const I = index();
    for (const k of kind === 'any' ? ['loop', 'valve', 'mach'] : kind === 'valve' || kind === 'mach' ? [kind, kind === 'valve' ? 'mach' : 'valve'] : [kind]) {
      const pg = I.on[k + ':' + id];
      if (pg) return { page: pg, open: k + ':' + id, mark: mark || id };
    }
    return null;
  }
  const ofSheet = (name, mark) => {
    const x = index().sheet[bare(name)];
    return x ? hit(x[0], x[1], mark || x[2]) : null;
  };
  /* the controller tag of an ABC net: its own name (FICFA1071.MV), else the station that drives it */
  function abcTag(sh, n) {
    const nm = call(() => String(AN.nm(sh.S, n) || ''), '').replace(/^S\d\s*/, '').trim(),
      t = /^([A-Z][A-Z0-9-]*?)\.(MV|PV|SV|OUT|MAN|LOC|REM|AUTO)\b/i.exec(nm);
    if (t) return t[1].toUpperCase();
    const cs = call(() => AN.hmiCtrls(sh.S), []) || [];
    for (const c of cs) if (c.out === n || (c.q && (c.q.pv === n || c.q.sv === n))) return c.tag;
    return /^[A-Z]{2,5}-?[A-Z]{0,3}\d{3,5}[A-Z]?$/i.test(nm) ? nm.toUpperCase() : '';
  }
  function fromRow(s, row, depth) {
    /* the row's own field tag (MCV-FA1053-1, PT-FW1115-A ...) when a page shows it */
    const info = call(() => DUI.rowInfo(s, row), null) || {};
    /* a switch of the plant model on this row: the station / transmitter it follows */
    for (const q of call(() => WORLD.plantSwSrc(), []) || [])
      if (q.src && q.row === row && bare(q.sheet) === bare(s.name)) {
        const h = hit('loop', q.src.tag, q.src.dev || q.src.tag) || hit('any', q.src.tag);
        if (h) return h;
      }
    const m = call(() => WORLD.idx.din.get(s), null),
      srcs = (m && m.get(row)) || [];
    for (const q of srcs) {
      if (q.k === 'd' && q.d) {
        const h = ofSheet(q.d.name);
        if (h) return h;
        if (depth < 4 && typeof q.row === 'number') {
          const r = fromOut(q.d, q.row, depth + 1) || fromRow(q.d, q.row, depth + 1);
          if (r) return r;
        }
      }
      if (q.k === 'm' && q.c) {
        const h = hit('loop', q.c.tag);
        if (h) return h;
      }
      if ((q.k === 'a' || q.k === 'v') && q.sh && q.sh.S) {
        const t = abcTag(q.sh, q.n),
          h = t && (hit('loop', t) || hit('any', t));
        if (h) return h;
      }
    }
    if (info.tag) {
      const h = hit('any', info.tag);
      if (h) return h;
    }
    /* a field input (I. address of the station wiring, no other source) on a machine's own drawing is that machine's signal
       (REMOTE SELECTED, TRIP, RUNNING of the motor) */
    if (!srcs.length && /^I\.\w+/.test(String(info.tag || '').trim())) return ofSheet(s.name);
    return null;
  }
  /* an OUTPUT row of an intermediate drawing (DITL-03B IDF STOPPED feeding the MFT of DITL-03A): the input rows of its logic
     (the netlist walk of the Why?, both ways), followed to their objects */
  function fromOut(s, row, depth) {
    const o = call(() => s.nl.outs.find(x => x.row === row), null);
    if (!o) return null;
    const own = ofSheet(s.name);
    if (own) return own;
    /* every input row the output depends on, from the gates of the netlist (structure, not the state of the moment) */
    const G = (s.nl && s.nl.gates) || [],
      seen = new Set(),
      leaf = new Set(),
      st = [o.n];
    while (st.length && seen.size < 400) {
      const n = st.pop();
      if (seen.has(n)) continue;
      seen.add(n);
      const g = G.filter(x => (x.out || []).includes(n));
      if (!g.length) leaf.add(n);
      for (const x of g) for (const m of [].concat(x.ins || [], x.s || [], x.r || [])) st.push(m);
    }
    const rows = [];
    for (let r = 0; r < (s.rows || []).length; r++) if ((call(() => DUI.rowNets(s, r, 'L'), []) || []).some(n => leaf.has(n))) rows.push(r);
    /* only a pass-through (every input leads to ONE object): an output made of several objects (MFT, ALL FAB STOPPED) is no one
       object, and the first input of the walk would point at the wrong one */
    let one = null;
    for (const r of rows.slice(0, 8)) {
      const h = fromRow(s, r, depth);
      if (!h) continue;
      if (one && one.open !== h.open) return null;
      one = one || h;
    }
    return one;
  }
  const condTarget = dy => {
    const p = String(dy || '').split('|');
    if (p.length < 3) return null;
    const s = call(() => LS_DOCK.dOf(p[0]), null),
      row = +p[2];
    if (!s || !isFinite(row)) return null;
    if (p[1] === 'o') return ofSheet(p[0]) || ofSheet(s.name);
    return fromRow(s, row, 0);
  };
  const put = () => window.AN && typeof AN === 'object' && (AN.condTarget = condTarget);
  if (!put()) document.addEventListener('DOMContentLoaded', put);
  window.LS_CONDT = condTarget;
})();
