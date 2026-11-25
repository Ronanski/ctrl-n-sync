/* The compiled TCE / TCA program LIVE in the app, side by side (lane 9 AUDIT FIX : SORA, coordinator item 3, 2026-11-25; plan
   docs/tcs/SHEETS_AS_LOGIC_PLAN.md step 4 "shadow run"). The program is lane 1's (src/digital/tce-run.js TCE_RUN: compile / step / set /
   get, and crt / read / outs when they are there); the inputs are lane 2's TCS I/O list (src/digital/tce-io.js, window.TCE_IO_LIVE).
   What this file does, and only this:
     - compiles window.TCE_SHEETS once, at the first start;
     - before each step, every PI/O input port of the program ('PIO:...') takes the value of its TCS I/O list end (TCE_IO_LIVE.read):
       the model value of a field signal, a DCS address, the IBD net, or the healthy TCS hardware status; a row with no value yet stays NaN;
     - steps the program by the plant time that has passed (AN.unit.t), each sheet at its own cycle (TCE_RUN.step).
   The sheets that drive their motor run in the engine (src/analog/engine/tcs-sheets.js, lane 0): c.sm.ids of the TCS state. Here they are
   not scanned again: their nets take the engine values, and a press of one of their buttons goes to the engine (AN.turbine tce).
   The rest is SIDE BY SIDE ONLY: nothing here writes the plant, tcs.js, the IBD or the DCS. Most sheets are not complete yet (tests/lanes/qa/tce-complete.cjs),
   so the outputs are only shown and compared (TCE.compare) against the engine's own value of the same signal (tce-io.js 'out' ends).
   Cost: the program is about 60 ms of CPU for each second of plant time (tests/tce/sheets.cjs: 30 s in ~1.9 s), so one tick steps at most
   MAXDT of plant time: at a fast forward the program runs behind the plant and TCE.status() says by how much (lag), it never slows the plant.
   The HMI API (window.TCE), names agreed with lane 1 MARIA on 2026-11-25:
     TCE.on()                 true while the program runs
     TCE.start() / stop()     start (compile at the first start) / stop the program; it starts by itself at load (LIVE_DEFAULT)
     TCE.press(port, ms)      a CRT push button: the port ('CRT:<sheet>.<tag>') is 1 for ms (default 3000, the HMI_DO hold), then 0
     TCE.read(sheet, key)     the value of a net / CRT lamp of a sheet; { on: false } while the program is off; undefined for a key the
                              program does not know (never a new port)
     TCE.ports() / port(n)    the input ports of the program / the value of one
     TCE.crt()                the CRT buttons and lamps of the set (TCE_RUN.crt), null until lane 1 has it
     TCE.compare()            the program's outputs against the engine's value of the same signal (QA)
     TCE.status()             on, sheets, plant time of the program, lag, ms a tick, inputs fed */
(function (root) {
  'use strict';
  const LIVE_DEFAULT = true,
    TICK_MS = 250,
    MAXDT = 0.5,
    HOLD_MS = 3000;
  const S = { on: false, prog: null, last: NaN, lag: 0, ms: 0, fed: 0, nan: 0, timer: 0, err: '', holds: {} };
  const R = () => root.TCE_RUN;
  const unit = () => (typeof AN !== 'undefined' && AN && AN.unit) || null;
  const compile = () => {
    if (S.prog) return S.prog;
    /* the TCE / TCA and G sheets, the set of tests/tce/sheets.cjs (421): the typed IBD sheets in TCE_SHEETS are the pictures of the IBD
       netlist that already runs in the engine (tcs-trip.js), not a second copy of it */
    const sheets = (root.TCE_SHEETS || []).filter(q => q && /^(TC[AE]|G-)/.test(q.id || ''));
    if (!R() || !sheets.length) throw new Error('no TCE_RUN or no TCE_SHEETS in the page');
    S.prog = R().compile(sheets);
    /* a PIO port is named by its box and the words printed in it ('PIO:TCA900-1 ...' / 'PIO:<sheet>.<box> ...'): the TCS I/O list knows the first word */
    S.pio = S.prog.ports.filter(p => /^PIO:/.test(p)).map(p => [p, p.split(' ')[0]]);
    return S.prog;
  };
  /* the PI/O inputs of the program from the TCS I/O list */
  const feed = U => {
    const io = root.TCE_IO_LIVE;
    if (!io) return;
    let n = 0,
      nan = 0;
    /* a row with no value yet (needs model, an output row, a box the list does not know) keeps the program's start value: a NaN
       would only spread through the gates */
    for (const [p, k] of S.pio) {
      const v = io.read(U, k);
      if (isFinite(v)) R().set(S.prog, p, v), n++;
      else nan++;
    }
    S.fed = n;
    S.nan = nan;
  };
  /* the memory of the sheets the engine runs (null: none yet) */
  const engSm = U => {
    const c = U && (U.tc || U.tco);
    return (c && c.sm && c.sm.ids && c.sm) || null;
  };
  const own = (U, sheet) => {
    const sm = engSm(U);
    return !!(sm && sm.ids.includes(sheet));
  };
  const stepSide = (U, d) => {
    const sm = engSm(U),
      P = S.prog,
      all = P.plan;
    if (!sm) return void R().step(P, d);
    for (const n in sm.v) if (P.idx.has(n)) P.v[P.idx.get(n)] = sm.v[n];
    for (const n of P.ports) if (n.startsWith('CRT:') && sm.ids.includes(n.slice(4).split('.')[0])) P.v[P.idx.get(n)] = sm.pb && sm.pb[n] > 0 ? 1 : 0;
    P.plan = all.filter(q => !sm.ids.includes(q.id));
    try {
      R().step(P, d);
    } finally {
      P.plan = all;
    }
  };
  const tick = () => {
    if (!S.on) return;
    if (typeof document !== 'undefined' && document.hidden) return;
    const U = unit();
    if (!U || !isFinite(+U.t)) return;
    const t = +U.t;
    /* a LOAD, a new start or a state jump: the program goes on from the new time (not counted as lag) */
    if (!isFinite(S.last) || t < S.last || t - S.last > 60) S.last = t;
    const dt = t - S.last;
    if (!(dt > 0)) return;
    const t0 = typeof performance !== 'undefined' ? performance.now() : Date.now();
    try {
      const d = Math.min(dt, MAXDT);
      feed(U);
      stepSide(U, d);
      S.lag += dt - d;
      S.last = t;
      S.err = '';
    } catch (e) {
      S.err = String((e && e.message) || e);
    }
    const ms = (typeof performance !== 'undefined' ? performance.now() : Date.now()) - t0;
    S.ms = S.ms ? S.ms * 0.8 + ms * 0.2 : ms;
  };
  const known = (sheet, key) => {
    const P = S.prog;
    return P && P.idx && P.idx.has(sheet + ':' + key);
  };
  const API = {
    on: () => S.on,
    start() {
      try {
        compile();
      } catch (e) {
        S.err = String(e.message || e);
        return false;
      }
      if (!S.on) {
        S.on = true;
        S.last = NaN;
        if (!S.timer) S.timer = setInterval(tick, TICK_MS);
      }
      return true;
    },
    stop() {
      S.on = false;
      if (S.timer) clearInterval(S.timer), (S.timer = 0);
      return true;
    },
    press(port, ms) {
      if (!S.on || !S.prog) return false;
      if (own(unit(), String(port).slice(4).split('.')[0])) {
        if (S.prog.ports.includes(port)) return AN.turbine('tce', { port, ms: ms > 0 ? ms : HOLD_MS }) === '';
        return false;
      }
      if (!R().set(S.prog, port, 1)) return false;
      clearTimeout(S.holds[port]);
      S.holds[port] = setTimeout(() => {
        delete S.holds[port];
        if (S.prog) R().set(S.prog, port, 0);
      }, ms > 0 ? ms : HOLD_MS);
      return true;
    },
    read(sheet, key) {
      if (!S.on || !S.prog) return { on: false };
      if (R().read) return R().read(S.prog, sheet, key);
      return known(sheet, key) ? R().get(S.prog, sheet, key) : undefined;
    },
    /* the input ports of the program (CRT / PIO / CON / PLANT / SYS / REF) and the value of one */
    ports: () => (S.prog ? S.prog.ports.slice() : []),
    port: name => (S.prog && S.prog.idx.has(name) ? S.prog.v[S.prog.idx.get(name)] : undefined),
    /* the outputs of the program (TCE_RUN.outs) with their value now: kind pio / con / crt / spare */
    outs: () => (S.prog && R().outs ? R().outs(S.prog).map(o => Object.assign({}, o, { v: S.prog.v[o.slot] })) : null),
    crt: () => (S.prog && R().crt ? R().crt(S.prog) : null),
    /* the PI/O outputs of the program (TCE_RUN.outs kind 'pio') against the engine's own value of the same TCS I/O list row (tce-io.js
       'out' end: what the engine drives today). Each output gets one state:
         same / differs           both values exist (equal = within 1 % or 1e-6)
         no engine value          the row is known, its end has no engine value yet (end text says why: tce-io.js)
         builder box, no row      a box of a table builder sheet (TCA830 ~ 835, 850, TCE600 ~ 610) drawn with no name: the program
                                  does not yet say which table row the output is (lane 1: outs() row); its rows are printed "(TCxxxx-n)"
         reader box               a block the sheet reader takes as PI/O but is not a channel (TCE060 ~ 069 td2 / v2o3, the same list
                                  as tests/lanes/tcs-io/io.cjs READER)
         generator panel          a G sheet output to the generator / GCP panel (not a TCS PI/O table row)
         no row                   anything else with no TCS I/O list row
       'con' outputs (to the TCT / TCP sheets, not in the set) and CRT lamps have no engine twin and are only counted. */
    compare() {
      if (!S.prog) return { on: false };
      if (!R().outs) return { on: S.on, ready: false, why: 'TCE_RUN.outs (lane 1) is not in this build yet' };
      const io = root.TCE_IO_LIVE,
        U = unit(),
        rows = [],
        count = {},
        kinds = {};
      for (const o of R().outs(S.prog)) {
        kinds[o.kind] = (kinds[o.kind] || 0) + 1;
        if (o.kind !== 'pio') continue;
        const id = (o.row && io && io.row(o.row) ? o.row : '') || (io && o.key ? io.ports['PIO:' + o.sheet + '.' + o.key] : '') || '',
          tce = S.prog.v[o.slot];
        let st,
          eng = NaN,
          why = '';
        if (id && id !== 'SPARE') {
          const e = io.end(id);
          eng = U && e && e.read ? io.read(U, id) : NaN;
          if (!isFinite(eng)) (st = 'no engine value'), (why = (e && e.text) || '');
          else st = Math.abs(tce - eng) <= Math.max(1e-6, Math.abs(eng) * 0.01) ? 'same' : 'differs';
        } else if (/^TCE06\d$/.test(o.sheet) && /^(td2|v2o3)$/.test(o.key)) st = 'reader box';
        else if (/^G-/.test(o.sheet)) st = 'generator panel';
        else if (!o.key) st = 'builder box, no row';
        else st = 'no row';
        count[st] = (count[st] || 0) + 1;
        rows.push({ sheet: o.sheet, key: o.key, row: id === 'SPARE' ? '' : id, tce, eng, st, why });
      }
      return { on: S.on, ready: true, t: S.prog.t, kinds, count, same: count.same || 0, diff: count.differs || 0, rows };
    },
    status() {
      const st = S.prog && R().stats ? R().stats(S.prog) : null;
      return {
        on: S.on,
        sheets: st ? st.sheets : 0,
        run: st ? st.run : 0,
        t: S.prog ? S.prog.t : 0,
        lag: S.lag,
        ms: S.ms,
        inputs: S.pio ? S.pio.length : 0,
        fed: S.fed,
        nan: S.nan,
        err: S.err
      };
    }
  };
  root.TCE = API;
  if (LIVE_DEFAULT && typeof setInterval === 'function') API.start();
})(typeof window !== 'undefined' ? window : globalThis);
