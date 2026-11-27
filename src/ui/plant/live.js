/* ===== LIVE READER of the running plant (moved from src/ui/training/live.js on 2026-11-21, GO NO SOP: the procedure step checks,
   ticks and coach of the guided Training are removed; what stays is what the operator pages read).
   - fp(tag), ctlTag, modeOf / mvOf / pvOf / svOf: the controller and MAN station of a tag on the ABC sheets (faceplates, HMI boxes);
   - has / val / sheetOf: a label or net of the ABC sheets;
   - getV / NAMES: the main plant values (generator MW, steam, air, drum, O2 …) with units;
   - rec / recCsv / recNow / recClear: the trend recorder (one row each minute of plant time).
   Read only: nothing here writes the engine. ===== */
/* Phase 11 AOI: the dry O2 of the flue gas mole balance at a coal and air flow (T/H), for the sweep judge (engine api fgO2dry) */
window.LS_FG = { o2dry: (coalTH, airTH) => AN.fgO2dry(coalTH, airTH) };
window.LS_LIVE = (function () {
  /* ---------- reading the running plant ---------- */
  const abc = () => ((typeof AN !== 'undefined' && AN.sheets) || []).filter(s => /^ABC-/.test(s.name) && !/^ABC-000/.test(s.name));
  const sOf = name => {
    const sh = AN.sheets.find(s => s.name === name);
    try {
      return sh && (sh.S || AN.ensure(sh));
    } catch (e) {
      return null;
    }
  };
  /* label / net name -> the sheets and nets that carry it (one address = one signal on every sheet, CLAUDE.md 1) */
  let LX = null,
    LXof = null;
  function lx() {
    /* built again when the ABC sheets change (the page starts on another category, AN.setCat makes a new list) */
    const L = abc();
    if (LX && LXof === (typeof AN !== 'undefined' && AN.sheets) && L.length) return LX;
    LXof = typeof AN !== 'undefined' && AN.sheets;
    const m = {},
      P = {};
    for (const sh of L) {
      let S;
      try {
        S = sh.S || AN.ensure(sh);
      } catch (e) {
        continue;
      }
      if (!S || !S.lab) continue;
      for (let n = 0; n < S.lab.length; n++) {
        /* 3.2.0-beta.78: an address written with its station ("S4 M.0340" on ABC-020 = STN104 RH biasing damper open) is another signal
           than the same number written plain (ABC-006 M.0340 = STN101 total air < 25 % MCR, memory lists 101 / 104): it is kept under
           its station key, and under the plain key only when no sheet writes that address plain (below) */
        const raw = S.lab[n] ? String(S.lab[n].t).trim() : '',
          ps = /^S\d\s+/.test(raw),
          a = raw.replace(/^S\d\s+/, '');
        let b = '';
        try {
          b = (AN.nm(S, n) || '').trim().replace(/^S\d\s+/, '');
        } catch (e) {}
        /* d: the net is driven by the logic of its sheet (an output, not an input of the sheet) */
        const d = !(S.ext || []).includes(n) && !!(S.drv && S.drv[n] && S.drv[n].length);
        for (const k of new Set([a, b])) if (k) (ps ? (P[k] = P[k] || []) : (m[k] = m[k] || [])).push({ sh: sh.name, n, d });
        if (ps) (m[raw] = m[raw] || []).push({ sh: sh.name, n, d });
      }
    }
    for (const k in P) if (!m[k]) m[k] = P[k];
    LX = L.length ? m : null;
    return m;
  }
  const has = l => !!lx()[l];
  const val = l => {
    const r = lx()[l];
    if (!r) return NaN;
    /* 3.2.0-beta.78 (CLAUDE.md 1, one address = one signal): the sheet whose logic writes the address is the value (ABC-006 M.0340 = 0
       at 221 T/H while an unlinked input copy elsewhere still read 1: the purge air step never ended) */
    for (const q of r) {
      if (!q.d) continue;
      const S = sOf(q.sh),
        y = S && S.rt ? +S.rt.v[q.n] : NaN;
      if (isFinite(y)) return y;
    }
    /* an input: the first sheet that has a value other than the default is as good as any (the links keep them equal) */
    let x = NaN;
    for (const q of r) {
      const S = sOf(q.sh);
      if (!S || !S.rt) continue;
      const y = +S.rt.v[q.n];
      if (isFinite(y)) {
        x = y;
        if (y) break;
      }
    }
    return x;
  };
  /* a faceplate tag: the procedure writes PIC-FG108, FCV-CD1120, LCV-MU1110; the drawings PICFG108, FICCD1120, LICMU1110 */
  const CTL = {};
  function ctlTag(t) {
    if (CTL[t]) return CTL[t];
    const u = String(t).toUpperCase().replace(/\s+/g, ''),
      d = u.replace(/-/g, '');
    const c = [u, d];
    /* the valve -> controller table of the plant graphics (valvectl.js: LCVMU1110 -> LICCD1110A, FCVFW11302 -> LICBR1001B) */
    const vc = window.PLANT_VALVE_CTL && window.PLANT_VALVE_CTL[d];
    if (vc) c.unshift(vc);
    const m = /^([FLPT])CV-?([A-Z]{2})-?(\d{3,5}[A-Z]?)/.exec(u);
    if (m) c.push(m[1] + 'IC' + m[2] + m[3]);
    const m2 = /^(FCV|MCV|PCV)([A-Z]{2})(\d{4})([A-Z])\d?$/.exec(d);
    if (m2) c.push((m2[1] === 'FCV' ? 'FIC' : m2[1] === 'PCV' ? 'PIC' : 'HIC') + m2[2] + m2[3] + m2[4]);
    let hit = null;
    for (const x of c)
      try {
        if (AN.fpFind && AN.fpFind(x)) {
          hit = x;
          break;
        }
      } catch (e) {}
    /* a miss is not kept: the faceplates are only found once the ABC sheets are loaded (the page may start on DITL) */
    if (hit) CTL[t] = hit;
    return hit;
  }
  /* the faceplate: controller (PID / PIDV) or MAN station */
  function fp(tag) {
    const t = ctlTag(tag);
    if (!t) return null;
    const shn = AN.fpFind(t),
      S = sOf(shn);
    if (!S) return null;
    const c = (AN.hmiCtrls ? AN.hmiCtrls(S) : []).find(z => z.tag === t);
    if (c) return { t, shn, S, c, kind: 'ctl' };
    const b = S.blk.find(z => z.k === 'MAN' && (z.tag === t || (z.txt || []).includes(t)));
    return b ? { t, shn, S, b, kind: 'man' } : null;
  }
  const mvOf = f => (f.kind === 'ctl' ? +f.S.rt.v[f.c.out] : f.S.rt.st[f.b.id] ? +f.S.rt.st[f.b.id].val : +f.S.rt.v[f.b.o[0]]);
  const pvOf = f => (f.kind === 'ctl' ? +f.S.rt.v[f.c.q.pv] : NaN);
  const svOf = f => (f.kind === 'ctl' && f.c.q.sv != null ? +f.S.rt.v[f.c.q.sv] : NaN);
  /* MAN / AUTO / REM as the faceplate shows it (hmi.js) */
  function modeOf(f) {
    if (f.kind === 'ctl') {
      const c = f.c,
        S = f.S,
        pk = c.amt && S.rt.st[c.amt.id] ? S.rt.st[c.amt.id].pk : c.autoLeg;
      if (c.amt && pk !== c.autoLeg) return 'MAN';
      if (c.remote && c.svSw && S.rt.st[c.svSw.id] && S.rt.st[c.svSw.id].pk === 'A') return 'REM';
      return 'AUTO';
    }
    /* 3.2.0-beta.16 (bug, fixed): the MODE NETS of the station (AN.modeNets: "TURBINE MASTER IN MANUAL" on ABC-001A ~ C, the nets the
       engine and the faceplate write) first; the lookup of the name EIC-TM.MAN read 0 while the turbine master was MANUAL by its
       back-up command M.2016 (all five mode nets 1), so the step said AUTO */
    try {
      const L = AN.modeNets ? AN.modeNets(f.t) || [] : [];
      if (L.length) return L.some(([S2, n]) => +S2.rt.v[n] > 0.5) ? 'MAN' : 'AUTO';
    } catch (e) {}
    const m = val(f.t + '.MAN');
    if (isFinite(m)) return m > 0.5 ? 'MAN' : 'AUTO';
    /* no .MAN address on the sheets (HIC-BM): the A / M switch of its set input, leg A = AUTO (hmi.js MAN station, check.js bmA) */
    try {
      const S = f.S,
        b = f.b,
        si = b.svI >= 0 ? b.i[b.svI] : null,
        dr = si != null ? (S.drv[si] || []).find(z => z.k === 'AMT') : null,
        ds = dr && S.rt.st[dr.id];
      if (ds && ds.pk) return ds.pk === 'A' ? 'AUTO' : 'MAN';
    } catch (e) {}
    /* Mina F57: a hand station with no AUTO of its own (HICDO1012) is always in the hand of the operator; '?' refused every arrow of the dock */
    return f.kind === 'man' ? 'MAN' : '?';
  }
  const U = () => (typeof AN !== 'undefined' && AN.unit) || {};
  let HH = null,
    HT = 0;
  const H = () => {
    if (!window.CHECK || !CHECK.H) return null;
    if (!HH || Date.now() - HT > 5000) {
      try {
        HH = CHECK.H();
        HT = Date.now();
      } catch (e) {
        HH = null;
      }
    }
    return HH;
  };
  const hv = k => {
    const h = H();
    try {
      return h ? +h[k]() : NaN;
    } catch (e) {
      return NaN;
    }
  };
  const f1 = x => (isFinite(x) ? (Math.abs(x) >= 100 ? x.toFixed(0) : x.toFixed(1)).replace(/^-(0(?:\.0)?)$/, '$1') : '—');
  const NAMES = {
    MW: ['Generator MW', 'MW', 'ABC-001C', 'AI0419'],
    MSP: ['Main steam pressure', 'kg/cm2', 'ABC-001C', 'AI0131'],
    MSF: ['Main steam flow', 'T/H', 'ABC-001C', ''],
    FP: ['Furnace pressure', 'mmH2O', 'ABC-008', 'PICFG108'],
    lvl: ['Drum level', 'mm', 'ABC-010', 'LICBR1001'],
    FW: ['Feedwater flow', 'T/H', 'ABC-010', 'FICFW1007'],
    PA: ['Primary air flow', 'T/H', 'ABC-006', 'FIFA1071.PV'],
    SA: ['Secondary air flow', 'T/H', 'ABC-006', 'FIFA1081.PV'],
    FA: ['Fluidizing air flow', 'T/H', 'ABC-006', 'FIFA1055.PV'],
    MST: ['Main steam temperature', '°C', 'ABC-012', 'TICMS1004'],
    O2: ['Flue gas O2', '%', 'ABC-002', 'AICFG112'],
    coal: ['Total coal flow', 'T/H', 'ABC-004A', ''],
    AIR: ['Total air flow (PA + SA + FA)', 'T/H', 'ABC-006', ''],
    Pd: ['Drum pressure', 'kg/cm2', 'ABC-010', ''],
    Tb: ['Bed temperature', '°C', '', ''],
    Tw: ['Boiler water temperature', '°C', '', ''],
    oilF: ['Burner oil, total', 'T/H', 'ABC-003A', ''],
    rpm: ['Turbine speed', 'rpm', 'ABC-050', ''],
    RHP: ['Reheat pressure', 'kg/cm2', 'ABC-052', 'PICHR1003'],
    /* audit 2026-11-03 (SOP 24.13 / 24.14): the secondary air pressure to the furnace PT-FA1088 (IO list STN101 AI0289, ABC-003A) */
    SAP: ['Secondary air pressure (PT-FA1088)', 'mmH2O', 'ABC-003A', 'AI0289']
  };
  const getV = k => {
    if (k === 'AIR') return hv('PA') + hv('SA') + hv('FA');
    if (k === 'Pd' || k === 'Tb' || k === 'Tw' || k === 'oilF' || k === 'rpm') return +U()[k];
    return hv(k);
  };
  /* 3.2.1 TREND RECORDER (user 2026-11-08 testing plan 3): one row each minute of plant time while the plant model runs: the values the
     plant trends of the user hold (scenario 1 / 2), for the PC-only comparison script (team-files/tools/trend-compare). A new starting
     state or a save point loaded starts a new record */
  const REC_K = ['MW', 'MSF', 'MSP', 'MST', 'coal', 'PA', 'SA', 'FA', 'O2', 'Tb', 'lvl', 'FW', 'FP', 'Pd', 'RHP'];
  const REC = { rows: [], last: -1, n: 0 };
  const recRow = () => {
    const r = { t: Math.round(+U().t || 0) };
    for (const k of REC_K) {
      let v = null;
      try {
        v = getV(k);
      } catch (e) {}
      r[k] = isFinite(v) ? Math.round(+v * 100) / 100 : '';
    }
    let rht = null;
    try {
      rht = pvOf(fp('TICHR1002'));
    } catch (e) {}
    r.RHT = isFinite(rht) ? Math.round(+rht * 10) / 10 : '';
    /* the water inventory (Mina beta.146 ~ 154: hotwell -300 on a feedwater surge): hotwell level, deaerator level and its valve
       LCV-CD1104, the condensate flow, the hotwell make-up valve LCV-MU1110 */
    const u = U(),
      w = (k, x) => (r[k] = isFinite(x) ? Math.round(+x * 10) / 10 : '');
    w('HW', u.cdHw);
    w('CDQ', u.cdQt);
    const g = (t, fn) => {
      try {
        return fn(fp(t));
      } catch (e) {
        return NaN;
      }
    };
    w('DA', g('LICCD1104', pvOf));
    w('DAMV', g('LICCD1104', mvOf));
    w('MUMV', g('LICCD1110A', mvOf));
    /* 3.2.3-beta.5 (Mina load run L1, RHT 560 C on load up): the steam temperature loops, to compare with plant scenario 1 (load up
       7.6 ~ 8.6 h: MST 551, RHT 552, 2nd spray MV in steps of 5): ABC-012 outer TICMS1004 and spray 2 TICBR1150, ABC-011 spray 1
       TICBR1130, ABC-019 RH spray TICHR1002, ABC-020 RH / SH flue gas damper TICHR1002A (controller MV, %) */
    w('MSOMV', g('TICMS1004', mvOf));
    w('SP1MV', g('TICBR1130', mvOf));
    w('SP2MV', g('TICBR1150', mvOf));
    w('RHSMV', g('TICHR1002', mvOf));
    w('RHDMV', g('TICHR1002A', mvOf));
    /* 3.2.3-beta.10 (Mina beta.9 B6-7, hotwell -293 mm after the trip): where the steam goes after a trip. ABC-013 blow-off
       PICMS1002 (PCV-MS1001, to the air: the water leaves the cycle) and ABC-050 HP bypass PICMS1006 (PCV-MS1020, back to the
       condenser through the reheater and the LP bypass) */
    w('BOSV', g('PICMS1002', svOf));
    w('BOMV', g('PICMS1002', mvOf));
    w('HPBSV', g('PICMS1006', svOf));
    w('HPBMV', g('PICMS1006', mvOf));
    return r;
  };
  /* Mina beta.148 S148-7 (no rows t 1806 ~ 1853 with the browser pane hidden): the 1 s timer of the page is throttled while the page is
     hidden (and so was her own 60 s log), the Worker plant goes on. A row is also taken when a patch of the Worker comes in (messages
     are not throttled), so the record follows the plant time, not the page's timers */
  const recTick = () => {
    try {
      const u = window.AN && AN.unit;
      if (!u || !u.on || AN._loading) return;
      if (((window.AN && AN.loadN) || 0) !== REC.n) (REC.n = AN.loadN || 0), (REC.rows = []), (REC.last = -1);
      const m = Math.floor((+u.t || 0) / 60);
      if (m < REC.last) (REC.rows = []), (REC.last = -1); /* time went back: a save point or a Reset */
      if (m === REC.last) return;
      /* Mina, load run of 3.2.2: the first row had empty hotwell / condensate columns (taken before the first step of the plant after a
         state load). The first row waits for the condenser (a few seconds at most, then it goes in anyway) */
      /* Mina, beta.2 check: still empty with the plant paused at t = 0 after the load (the condenser had not stepped yet): the first row
         also waits for the first step of the plant (t > 0) */
      if (!REC.rows.length && !(+u.t > 0)) return;
      if (!REC.rows.length && !(isFinite(u.cdHw) && isFinite(u.cdQt)) && (REC.wait = (REC.wait || 0) + 1) < 6) return;
      REC.wait = 0;
      REC.last = m;
      REC.rows.push(recRow());
      if (REC.rows.length > 6000) REC.rows.shift();
    } catch (e) {}
  };
  setInterval(recTick, 1000);
  if (window.ENG) {
    const prevP = ENG.onPatch;
    ENG.onPatch = m => {
      if (prevP) prevP(m);
      recTick();
    };
  }
  const recCsv = () => {
    const X = ['RHT', 'HW', 'CDQ', 'DA', 'DAMV', 'MUMV', 'MSOMV', 'SP1MV', 'SP2MV', 'RHSMV', 'RHDMV', 'BOSV', 'BOMV', 'HPBSV', 'HPBMV'],
      H = ['t_min'].concat(REC_K, X);
    /* Mina, load run of 3.2.2: t_min 42 came twice. A row is taken once per whole minute (Math.floor), so the column counts the same
       way: Math.round put 41.5 min and 42.0 min both at 42 */
    return [H.join(',')].concat(REC.rows.map(r => [Math.floor(r.t / 60)].concat(REC_K.map(k => r[k]), X.map(k => r[k])).join(','))).join('\r\n');
  };
  /* the first ABC sheet that carries a label */
  const sheetOf = l => {
    const r = lx()[l];
    return r && r[0] ? r[0].sh : null;
  };
  /* 3.2.0-beta.21: the condition makers, for the guided Training (guide.js) */
  /* recNow: a row at once (tests/regress/load_ramp.js steps the plant faster than the 1 s timer) */
  const recNow = () => {
    const m = Math.floor((+U().t || 0) / 60);
    if (m === REC.last && REC.rows.length) REC.rows.pop(); /* one row per minute: the newer one stays */
    REC.last = m;
    REC.rows.push(recRow());
  };
  return { rec: () => REC.rows, recCsv, recNow, recClear: () => ((REC.rows = []), (REC.last = -1)), fp, ctlTag, has, val, sheetOf, H, modeOf, mvOf, pvOf, svOf, getV, NAMES, f1 };
})();
