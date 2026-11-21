/* ===== SEQUENCE OF EVENTS AND FIRST OUT (user "go all" 2026-11-19, item 2: first-out / SOE per MFT and turbine trip) =====
   Nothing here decides a trip. The DCS and the TCS logic already do it; this file only records what their signals did, in order:
   - MFT (DCS): the 18 trip inputs of DITL-03A (rows 1 ~ 18), its MFT output (row 17, MASTER FUEL TRIP (MFT) · SER: the output the
     drawing sends to the sequence-of-events recorder), the first-out memories of DITL-05 / DITL-06 (output rows "... FIRST OUT · CRT
     (ANN)", latched by the drawing until RESET FIRST OUT) and RESET FIRST OUT itself (DITL-02).
   - TURBINE TRIP (TCS): the trip inputs of IBD TA-9 and the first out of the TCS (U.tc.trip, tcs-trip.js tcsTripFirst).
   The points are found on the drawings by their own output names (FIRST OUT, MFT · SER, RESET FIRST OUT) and rows, never typed here.
   Resolution: one record per plant model step (the scan of the simulation), not the 1 ms of a field SOE card; two signals that change
   in the same scan carry the same time and keep the order of the drawing.
   AN.soe(n)      -> the last n records, oldest first: { t (s of plant time), sys 'DCS' | 'TCS', sheet, name, on 1 | 0, kind }
                     kind: 'trip' (a trip input), 'mft' (the MFT output), 'fo' (a first-out memory), 'reset' (RESET FIRST OUT),
                     'tt' (the turbine trip state of the TCS).
   AN.soeTrip()   -> { mft: { on, first, at, inputs: [names at 1] }, turbine: { on, first, at, inputs: [...] } }
                     first = the first-out memory of the DCS that is lit (DITL-05 / 06) / the first out of the TCS; at = the time of the
                     record that set it. Kept until the logic clears it (the memories after RESET FIRST OUT, the TCS after its reset).
   AN.soeClear()  -> empties the record (a new start, the instructor). The record also starts empty at each load of a plant. */
const AN_SOE_N = 2000;
const AN_SOE = { log: [], pts: null, of: null, tc: null, tcT: 0, last: {}, mft: null, tt: null };
function anSoeSheet(re) {
  if (typeof S === 'undefined' || !S.sheets) return null;
  return S.sheets.find(x => re.test(x.name)) || null;
}
/* the watched points, from the drawings: [sheet, row, 'i' | 'o', kind, name] */
function anSoePoints() {
  const Z = AN_SOE;
  if (typeof S === 'undefined' || !S.sheets || !window.DUI) return null;
  if (Z.pts && Z.of === S.sheets) return Z.pts;
  const P = [],
    out = s => (s ? (call0(() => DUI.outs(s)) || []).map(o => ({ row: o.row, t: String(o.name || '').split(' · ').slice(1).join(' · ') })) : []);
  const d3 = anSoeSheet(/DITL-03A$/);
  if (d3) {
    for (let r = 0; r < (d3.rows || []).length; r++) {
      const nm = String((call0(() => DUI.rowInfo(d3, r)) || {}).svc || '').trim();
      /* the trip inputs of the MFT: every named input row above the purge rows (BOILER PURGE COMPLETED has its memory address M.0513) */
      if (nm && !/PURGE/.test(nm) && !(call0(() => DUI.rowInfo(d3, r)) || {}).tag) P.push([d3, r, 'i', 'trip', nm]);
    }
    for (const o of out(d3)) if (/\bMFT\b.*\bSER\b/.test(o.t)) P.push([d3, o.row, 'o', 'mft', 'MASTER FUEL TRIP (MFT)']);
  }
  for (const re of [/DITL-05$/, /DITL-06$/]) {
    const s = anSoeSheet(re);
    for (const o of out(s))
      if (/FIRST OUT/.test(o.t)) P.push([s, o.row, 'o', 'fo', o.t.replace(/\s*·\s*CRT \(ANN\)\s*$/, '').replace(/\s*FIRST OUT\s*$/, '').replace(/\)(?=\S)/, ') ').trim()]);
  }
  const d2 = anSoeSheet(/DITL-02$/);
  for (const o of out(d2)) if (/^RESET FIRST OUT$/.test(o.t)) P.push([d2, o.row, 'o', 'reset', 'RESET FIRST OUT']);
  Z.pts = P;
  Z.of = S.sheets;
  Z.last = {};
  return P;
}
function call0(f) {
  try {
    return f();
  } catch (e) {
    return null;
  }
}
function anSoeAdd(sys, sheet, name, on, kind) {
  const L = AN_SOE.log,
    t = Math.round(anPlantT() * 10) / 10;
  L.push({ t, sys, sheet, name, on, kind });
  if (L.length > AN_SOE_N) L.splice(0, L.length - AN_SOE_N);
  return t;
}
function anSoeStep() {
  const Z = AN_SOE;
  if (window.ENG && ENG.mode === 'mirror') return;
  /* a new plant (load, Reset) starts a new record */
  if (Z.of && typeof S !== 'undefined' && Z.of !== S.sheets) anSoeClear();
  const P = window.WORLD && WORLD.on ? anSoePoints() : null;
  if (P)
    for (let i = 0; i < P.length; i++) {
      const [s, row, io, kind, name] = P[i],
        v = io === 'i' ? DUI.rowVal(s, row) : DUI.outVal(s, row);
      if (v == null) continue;
      const k = s.name + '|' + io + row,
        was = Z.last[k];
      Z.last[k] = v;
      if (was === undefined || was === v) continue;
      const t = anSoeAdd('DCS', String(s.name).replace(/^\(\d+\)/, ''), name, v, kind);
      if (kind === 'mft') Z.mft = v ? { at: t } : null;
    }
  /* the TCS: the trip inputs of IBD TA-9 (their live values in the TCS state) and the trip of the turbine */
  const U = AN.unit,
    c = U && (U.tc || U.tco),
    ib = c && c.ib,
    s9 = typeof TCS_IBD !== 'undefined' && TCS_IBD.by && TCS_IBD.by['TA-9'];
  if (ib && s9) {
    const v = ib.v['TA-9'] || [];
    for (const r of s9.i) {
      const k = 'TA-9|' + r[0],
        on = v[r[0]] > 0.5 ? 1 : 0,
        was = Z.last[k];
      Z.last[k] = on;
      /* the channel number is kept (tcsIbdName takes it off): BOILER MFT 1 and BOILER MFT 2 are two records */
      if (was !== undefined && was !== on)
        anSoeAdd('TCS', 'TA-9', String(r[1]).replace(/SH-.*$/, '').replace(/\(\*[0-9]\)/g, '').replace(/ +/g, ' ').trim(), on, 'trip');
    }
  }
  const tr = c ? c.trip || '' : '',
    was = Z.last['TCS|trip'];
  Z.last['TCS|trip'] = tr;
  if (was !== undefined && was !== tr) {
    const t = anSoeAdd('TCS', 'TA-1', tr ? 'TURBINE TRIP, first out: ' + tr : 'TURBINE RESET', tr ? 1 : 0, 'tt');
    Z.tt = tr ? { at: t, first: tr } : null;
  }
}
function anSoeClear() {
  const Z = AN_SOE;
  Z.log.length = 0;
  Z.pts = null;
  Z.of = null;
  Z.last = {};
  Z.mft = Z.tt = null;
}
AN.soe = n => {
  const L = AN_SOE.log;
  return L.slice(Math.max(0, L.length - (n > 0 ? n : AN_SOE_N))).map(x => Object.assign({}, x));
};
AN.soeClear = anSoeClear;
AN.soeTrip = () => {
  const Z = AN_SOE,
    P = Z.pts || [],
    lit = kind => P.filter(p => p[3] === kind && Z.last[p[0].name + '|' + (p[2] + p[1])] === 1);
  /* the DCS first out = the memory of DITL-05 / 06 that is lit FIRST; the time = its record. Beta.241 (Jennie, HOT save by real clicks
     2026-11-22: after a turbine trip the first out read SAF STOPPED, which came minutes later): the memories of the drawing latch each
     on its own until RESET FIRST OUT, so more than one stands after a trip; the first out is the one whose record is the oldest (one
     scan = one time; in the same scan the order of the drawing), not the first lit row of the drawing */
  const setAt = p => {
      const r = Z.log.filter(x => x.kind === 'fo' && x.name === p[4] && x.on === 1).pop();
      return r ? r.t : Infinity;
    },
    fo = lit('fo')
      .map((p, i) => [p, setAt(p), i])
      .sort((a, b) => a[1] - b[1] || a[2] - b[2])
      .map(x => x[0])[0],
    foAt = fo ? (isFinite(setAt(fo)) ? setAt(fo) : null) : null;
  const mftOn = lit('mft').length > 0;
  const U = AN.unit,
    c = U && (U.tc || U.tco),
    st = c && typeof tcsTripState === 'function' ? call0(() => tcsTripState(U)) : null;
  return {
    mft: { on: mftOn, first: fo ? fo[4] : '', at: fo ? foAt : Z.mft ? Z.mft.at : null, inputs: lit('trip').map(p => p[4]) },
    turbine: { on: !!(c && c.trip), first: (c && c.trip) || '', at: Z.tt ? Z.tt.at : null, inputs: (st && st.held) || [] }
  };
};
