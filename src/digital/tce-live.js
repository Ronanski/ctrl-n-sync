/* The compiled TCE / TCA program of the app, the page side (lane 9 AUDIT FIX : SORA 2026-11-25; lane 0: the program itself moved to the
   engine, src/analog/engine/tcs-sheets.js: one program, one memory, in SAVE / LOAD). This file only shows it: AN.tce() is the program with
   the nets of the engine (in Worker mode the engine sends the changed ones), a press goes to the engine (AN.turbine tce) and is held for
   its time in plant seconds. The sheets that drive: AN.tce().drv; the others run beside tcs.js and TCE.compare() holds their outputs against
   the engine's own value of the same signal (tce-io.js 'out' ends).
   The HMI API (window.TCE), names agreed with lane 1 MARIA on 2026-11-25:
     TCE.on()                 true while the program runs
     TCE.start() / stop()     show / do not show the program; it is shown from the start
     TCE.press(port, ms)      a CRT push button: the port ('CRT:<sheet>.<tag>') is 1 for ms (default 3000, the HMI_DO hold), then 0
     TCE.read(sheet, key)     the value of a net / CRT lamp of a sheet; { on: false } while the program is off; undefined for a key the
                              program does not know (never a new port)
     TCE.ports() / port(n)    the input ports of the program / the value of one
     TCE.crt()                the CRT buttons and lamps of the set (TCE_RUN.crt), null until lane 1 has it
     TCE.compare()            the program's outputs against the engine's value of the same signal (QA)
     TCE.status()             on, sheets, the time the engine has run the program (s; 0 in the page of a Worker), PI/O inputs, the sheets that drive */
(function (root) {
  'use strict';
  const HOLD_MS = 3000;
  const S = { on: true, err: '' };
  const R = () => root.TCE_RUN;
  const unit = () => (typeof AN !== 'undefined' && AN && AN.unit) || null;
  Object.defineProperty(S, 'prog', { get: () => (typeof AN !== 'undefined' && AN && AN.tce && AN.tce()) || null });
  /* the state of the TCS program: what the operator holds pressed */
  const held = port => {
    const U = unit(),
      c = U && (U.tc || U.tco);
    return !!(c && c.sm && c.sm.pb && c.sm.pb[port] > 0);
  };
  const known = (sheet, key) => {
    const P = S.prog;
    return P && P.idx && P.idx.has(sheet + ':' + key);
  };
  const API = {
    on: () => S.on,
    start: () => (S.on = !!S.prog),
    stop() {
      S.on = false;
      return true;
    },
    press(port, ms) {
      if (!S.on || !S.prog || !S.prog.crt.some(x => x[1] === port)) return false;
      return AN.turbine('tce', { port, ms: ms > 0 ? ms : HOLD_MS }) === '';
    },
    read(sheet, key) {
      if (!S.on || !S.prog) return { on: false };
      if (R().read) return R().read(S.prog, sheet, key);
      return known(sheet, key) ? R().get(S.prog, sheet, key) : undefined;
    },
    /* the input ports of the program (CRT / PIO / CON / PLANT / SYS / REF) and the value of one */
    ports: () => (S.prog ? S.prog.ports.slice() : []),
    port: name => (S.prog && S.prog.idx.has(name) ? (/^CRT:/.test(name) ? (held(name) ? 1 : 0) : S.prog.v[S.prog.idx.get(name)]) : undefined),
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
      return { on: S.on, ready: true, t: unit() ? +unit().t : 0, kinds, count, same: count.same || 0, diff: count.differs || 0, rows };
    },
    status() {
      const st = S.prog && R().stats ? R().stats(S.prog) : null;
      return {
        on: S.on,
        sheets: st ? st.sheets : 0,
        run: st ? st.run : 0,
        t: S.prog ? S.prog.t : 0,
        inputs: S.prog ? S.prog.ports.filter(x => /^PIO:/.test(x)).length : 0,
        drive: S.prog ? S.prog.drv.map(q => q.id) : [],
        err: S.err
      };
    }
  };
  root.TCE = API;
})(typeof window !== 'undefined' ? window : globalThis);
