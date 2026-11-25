/* The hard-wired signals TCS -> DCS (TCS I/O list 310SC90-773 rev 2, src/data/tcs-dcs.json rows 'in'), lane 0 YUA 2026-11-25 (user
   "Interconnected din dapat ang mga logic: DITL ABC TCS"). One source a signal: the DCS address takes the output of the TCE / TCA sheet that draws
   it, as the program of engine/tcs-sheets.js has it now, never a value of the plant model beside it. TCS_HW = the PI/O outputs that drive. The
   outputs of the list that are not here keep their present source; tests/lanes/integrator/tcs-dcs.cjs lists each with its reason. */
const TCS_HW = new Set(
  (
    'TCE960-8 TCE960-13 TCE960-18 TCE960-25 TCE960-26 TCE960-29 TCE960-30 TCE960-31 TCE961-8 TCE961-13 TCE970-3 TCE970-4 TCE970-5 TCE970-6 ' +
    'TCA980-13 TCA980-15 TCA980-16 TCA980-17 TCA980-18 TCA980-19 TCA980-20 TCA980-21 TCA990-6 TCA990-13 TCA990-18'
  ).split(' ')
);
/* the output net of a PI/O row in the program; -1 = none */
function tcsHwSlot(p, id) {
  if (!p.hw) {
    const io = window.TCE_IO_LIVE;
    p.hw = new Map();
    for (const o of window.TCE_RUN.outs(p)) {
      if (o.kind !== 'pio' || !io) continue;
      const r = (o.row && io.row(o.row) ? o.row : '') || (o.key ? io.ports['PIO:' + o.sheet + '.' + o.key] : '') || '';
      if (r && r !== 'SPARE' && !p.hw.has(r)) p.hw.set(r, o.slot);
    }
  }
  return p.hw.has(id) ? p.hw.get(id) : -1;
}
/* the value of a TCS output row that drives; undefined = the program does not run (no plant, no TCS state yet) or the row is not in TCS_HW */
function tcsHw(U, id) {
  const c = U && (U.tc || U.tco),
    p = TCS_HW.has(id) && c && c.sm && AN_TCE.n === c.sm.n && AN_TCE.n >= 0 ? tcsShProg() : null,
    k = p ? tcsHwSlot(p, id) : -1;
  return k < 0 || Number.isNaN(p.v[k]) ? undefined : p.v[k];
}
/* the start-up mode of TCA500 (its outputs to the DCS, TCA831): 'amb' 'c1' 'c2' 'warm' 'hot'; '' = the program has none now */
const TCS_HW_MODE = { amb: 'TCA980-17', c1: 'TCA980-18', c2: 'TCA980-19', warm: 'TCA980-21', hot: 'TCA980-20' };
function tcsHwMode(U) {
  for (const m in TCS_HW_MODE) if (tcsHw(U, TCS_HW_MODE[m]) > 0.5) return m;
  return '';
}
/* a new program memory beside a running plant (150 MW start, an old save): the START-UP MODE MT1 memories of TCA500 (HP first stage and reheat
   bowl) stand as the turbine was started: the mode the plant state holds */
function tcsHwSeed(p, c) {
  const k = Object.keys(TCS_HW_MODE).indexOf(c.mode);
  if (k < 0) return;
  for (const [, x] of p.keyed) if (x.t === 'M' && x.name === 'START-UP MODE MT1') x.st.m = k;
}
