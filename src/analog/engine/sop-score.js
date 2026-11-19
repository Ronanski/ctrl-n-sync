/* ===== SOP SCORING (user "go all" 2026-11-19, item 6: instructor tools, SOP scoring) =====
   Scores a trainee's start-up against the START-UP PROCEDURE PR-OPE-5002 (Rev 03, the sections of LS_PROC5002). Nothing here decides
   or changes the plant: it watches what the logic shows.
   - Milestones: the sections of PR-OPE-5002 whose end the DCS / TCS shows by a signal of its own (a RUNNING / IN SERVICE / COMPLETED
     output of the DITL drawing, found by its name like soe.js; the turbine state of the TCS). Every machine copy (A / B / C, world.js
     W.inst) counts: one running is the section done.
   - Order: each milestone names the milestones the procedure puts before it in the same line of the plant (the water line: sea water,
     its booster, the auxiliary cooling water, the condensate, the feedwater; the air and gas line: air heater, IDF, FAB, SAF, PAF, purge,
     burner, coal; the turbine: roll after the burner, synchronizing after the roll). A milestone done while one of those is not done is
     "out of order". The plant interlocks block most of these by themselves; what they let through is what the score shows.
   - Trips: every MFT and every turbine trip after the start of the score (the records of soe.js).
   - Score: 100 minus the deductions of AN_SOP_W (NO-SOURCE: the instructor's weights, not from a document; set them with
     AN.sopScore({ w: { mft, tt, order } })). A milestone already done when the score starts (a 150 MW starting point) is "given".
   AN.sopScore()            -> { from, t, score, steps: [{ id, sec, name, at, given, late: [ids not yet done then] }], trips: { mft, tt },
                                 deduct: [{ why, pts }], w }
   AN.sopScore({ restart }) -> starts the score again from now (the instructor, a new trainee); the score also starts again at each load
                                of a plant. */
const AN_SOP_W = { mft: 25, tt: 25, order: 5 };
/* [id, PR-OPE-5002 section (1-based, as printed), sheet, output name, the milestones before it] */
const AN_SOP_M = [
  ['swp', 2, /DITL-39$/, /^ANY SEAWATER PUMP RUNNING/, []],
  ['swbp', 5, /DITL-30$/, /^SEAWATER BOOSTER PUMP A RUNNING/, ['swp']],
  ['mwp', 7, /DITL-112$/, /^MWP A RUNNING/, []],
  ['acw', 8, /DITL-7[67]$/, /AUX\. CW PUMP RUNNING/, ['swbp']],
  ['iad', 9, /DITL-45$/, /^INSTRUMENT AIR DRYER-A RUNNING/, []],
  ['pad', 11, /DITL-45$/, /^PLANT AIR DRYER-A RUNNING/, []],
  ['aph', 17, /DITL-43$/, /^AIR PREHEATER RUNNING/, ['iad']],
  ['cep', 18, /DITL-61A$/, /^CONDENSATE PUMP A RUNNING/, ['acw', 'mwp']],
  ['bfwp', 20, /DITL-23A$/, /^BFWP A RUNNING/, ['cep']],
  ['idf', 22, /DITL-25A$/, /^IDF RUNNING/, ['aph', 'acw']],
  ['fab', 23, /DITL-28A$/, /^ANY FAB RUNNING/, ['idf']],
  ['saf', 24, /DITL-27A$/, /^SAF RUNNING/, ['fab']],
  ['paf', 25, /DITL-26A$/, /^PAF RUNNING/, ['saf']],
  ['purge', 26, /DITL-02$/, /^FURNACE PURGE COMPLETED$/, ['paf', 'bfwp']],
  ['burner', 28, /DITL-12[ABC]?$/, /^BURNER [A-D] IN SERVICE$/, ['purge']],
  ['roll', 41, null, 'roll', ['burner']],
  ['sync', 42, null, 'sync', ['roll']],
  ['coal', 44, /DITL-19$/, /^COAL FEEDER A RUNNING/, ['burner']]
];
const AN_SOP = { of: null, from: null, pts: null, st: {}, steps: [], soeN: 0, trips: { mft: 0, tt: 0 }, w: Object.assign({}, AN_SOP_W), lt: -1 };
function anSopName(id) {
  const m = AN_SOP_M.find(x => x[0] === id),
    P = (typeof window !== 'undefined' && window.LS_PROC5002) || [];
  return m ? String((P[m[1] - 1] || {}).t || id) : id;
}
/* the outputs of each milestone, on the drawing and on its machine copies */
function anSopPoints() {
  const Z = AN_SOP;
  if (Z.pts && Z.of === S.sheets) return Z.pts;
  const all = S.sheets.concat((window.WORLD && WORLD.inst) || []),
    base = n => String(n).replace(/\s+#[A-Z]$/, '');
  Z.pts = {};
  for (const [id, , re, nm] of AN_SOP_M) {
    if (!re) continue;
    const L = [];
    for (const s of all) {
      if (!re.test(base(s.name))) continue;
      let os = [];
      try {
        os = DUI.outs(s) || [];
      } catch (e) {}
      for (const o of os) {
        const t = String(o.name || '').split(' · ')[1] || '';
        if (nm.test(t.trim())) L.push([s, o.row]);
      }
    }
    Z.pts[id] = L;
  }
  return Z.pts;
}
function anSopDone(id, src, nm) {
  if (!src) {
    const st = AN.unit && AN.unit.tb && AN.unit.tb.st;
    return nm === 'roll' ? st === 'roll' || st === 'sync' || st === 'load' : st === 'sync' || st === 'load';
  }
  for (const [s, row] of AN_SOP.pts[id] || []) {
    let v = null;
    try {
      v = DUI.outVal(s, row);
    } catch (e) {}
    if (v === 1) return true;
  }
  return false;
}
function anSopRestart() {
  const Z = AN_SOP;
  Z.of = typeof S !== 'undefined' ? S.sheets : null;
  Z.pts = null;
  Z.from = Math.round(anPlantT() * 10) / 10;
  Z.st = {};
  Z.steps = [];
  Z.trips = { mft: 0, tt: 0 };
  Z.soeN = typeof AN_SOE !== 'undefined' ? AN_SOE.log.length : 0;
  Z.lt = -1;
  Z.init = false;
}
function anSopStep() {
  if (window.ENG && ENG.mode === 'mirror') return;
  if (typeof S === 'undefined' || !S.sheets || !window.DUI || !(window.WORLD && WORLD.on)) return;
  const Z = AN_SOP;
  if (Z.of !== S.sheets) anSopRestart();
  const t = Math.round(anPlantT() * 10) / 10;
  anSopPoints();
  for (const [id, sec, re, nm, before] of AN_SOP_M) {
    if (Z.st[id]) continue;
    if (!anSopDone(id, re, nm)) continue;
    const late = Z.init ? before.filter(b => !Z.st[b]) : [];
    Z.st[id] = { at: t, given: !Z.init };
    Z.steps.push({ id, sec, name: anSopName(id), at: t, given: !Z.init, late });
  }
  /* at the start of the score: a milestone whose signal is a moment (FURNACE PURGE COMPLETED drops when the burners take over) is given
     when a milestone after it is already done */
  if (!Z.init)
    for (let k = AN_SOP_M.length - 1; k >= 0; k--) {
      const [id, , , , before] = AN_SOP_M[k];
      if (!Z.st[id]) continue;
      for (const b of before)
        if (!Z.st[b]) {
          const m = AN_SOP_M.find(x => x[0] === b);
          Z.st[b] = { at: t, given: true };
          Z.steps.push({ id: b, sec: m[1], name: anSopName(b), at: t, given: true, late: [] });
        }
    }
  Z.init = true;
  /* the trips: the new records of the sequence of events (soe.js keeps its own record; it is emptied at a new plant, as this score) */
  const L = typeof AN_SOE !== 'undefined' ? AN_SOE.log : [];
  if (Z.soeN > L.length) Z.soeN = 0;
  for (let i = Z.soeN; i < L.length; i++) {
    if (L[i].kind === 'mft' && L[i].on === 1) Z.trips.mft++;
    if (L[i].kind === 'tt' && L[i].on === 1) Z.trips.tt++;
  }
  Z.soeN = L.length;
}
AN.sopScore = o => {
  const Z = AN_SOP;
  if (o && o.w) for (const k of Object.keys(AN_SOP_W)) if (isFinite(o.w[k]) && o.w[k] >= 0) Z.w[k] = +o.w[k];
  if (o && o.restart) anSopRestart();
  const D = [];
  if (Z.trips.mft) D.push({ why: Z.trips.mft + ' x MASTER FUEL TRIP', pts: Z.trips.mft * Z.w.mft });
  if (Z.trips.tt) D.push({ why: Z.trips.tt + ' x TURBINE TRIP', pts: Z.trips.tt * Z.w.tt });
  for (const s of Z.steps)
    if (s.late.length)
      D.push({ why: s.name + ' before ' + s.late.map(anSopName).join(', ') + ' (PR-OPE-5002 order)', pts: Z.w.order });
  const lost = D.reduce((a, x) => a + x.pts, 0);
  return {
    from: Z.from,
    t: Math.round(anPlantT() * 10) / 10,
    score: Math.max(0, 100 - lost),
    steps: Z.steps.map(s => Object.assign({}, s, { late: s.late.slice() })),
    todo: AN_SOP_M.filter(m => !Z.st[m[0]]).map(m => ({ id: m[0], sec: m[1], name: anSopName(m[0]) })),
    trips: Object.assign({}, Z.trips),
    deduct: D,
    w: Object.assign({}, Z.w)
  };
};
AN._sop = AN_SOP; /* the state, for the regression test (tests/regress/sop_score.js) */
