/* Lane 0 (YUA): TCS -> DCS. Every hard-wired signal of the TCS I/O list (src/data/tcs-dcs.json rows 'in') either takes the output of its TCE / TCA
   sheet in the engine (src/analog/engine/tcs-dcs.js TCS_HW) or stands in the list below with its reason. The input sheets of the EHG read the three
   protection controllers (tcs-tpc.js), and every connector of the program joins its sheet or is in the list below. */
const path = require('path'),
  fs = require('fs');
const root = path.join(__dirname, '../../..');
const { load } = require(path.join(root, 'tools/trace/world.cjs'));
/* not linked yet: the reason */
const GOV = 'governor chain: blocks of lane 1 with no meaning yet (CRT OPE INC/DEC, CCS SIM.MT1, VALVE CONTROL MT1 ...)',
  AUX = 'AUXILIARY TYPE 15: no meaning yet (lane 1)',
  GEN = 'no reactive power model / generator transducer';
const WAIT = {
  'TCE960-32': GOV,
  'TCE961-5': GOV,
  'TCE960-20': GOV,
  'TCE970-1': GOV,
  'TCE970-2': GOV,
  'TCE960-27': GOV,
  'TCE960-28': GOV,
  'TCA981-9': AUX,
  'TCA981-8': AUX,
  'TCA980-11': AUX,
  'TCA980-12': AUX,
  'TCA980-22': 'load hold of the ATS: the ATS steps do not drive yet',
  'TCA990-5': GEN,
  'TCA990-12': GEN,
  'TCA990-17': GEN,
  'TCA990-11': GEN,
  'TCA990-14': GEN,
  'TCA990-15': 'below 55 Hz the AI diagnosis gives its SIM 60 Hz: the signal range of the transducer is open (lane 1)'
};
/* connectors of the drawings that no sheet of this repository gives */
const OPEN = [
  /^CON:TCP[123]0(7\d|5\d)\./ /* TPC: input errors, SPARE, rotor position, the 86T / 50BF-80BF of no source */,
  /^CON:TCP[123](200\.C[16]|210\.|220\.|23[01]\.|50[013]\.)/ /* CRT OPE. PERM., fast acting solenoids, TPC hardware status */,
  /^CON:TCT/ /* the CRT / DCS commands of the ATS: with the ATS steps */,
  /^CON:(TCA782\.Z[123]|TCE073\.-|TCE100\.-|TCE116\.B1[12]|TCE153\.B3|TCE164\.A|TCE195\.C|TCE250\.-|TCE472\.C)$/ /* "(-)" on the drawing */,
  /^CON:G-5A\/G-6A\.6$/ /* two outputs of that letter */
];
(async () => {
  const bad = [],
    ok = (x, t) => x || bad.push(t),
    E = load();
  await E.start('150');
  E.step(40);
  const AN = E.AN,
    p = AN.tce(),
    hw = JSON.parse(E.js('JSON.stringify([...AN.tcsHwList()])')),
    rows = JSON.parse(fs.readFileSync(path.join(root, 'src/data/tcs-dcs.json'), 'utf8')).rows.filter(r => r.dir === 'in');
  for (const r of rows) {
    const to = r.to;
    if (!/^TC[AE]9/.test(to)) continue; /* not a PI/O output of a sheet: the IBD, the panel or the COMM line */
    if (hw.includes(to)) {
      ok(!WAIT[to], to + ' is linked: take it off the waiting list');
      ok(Number.isFinite(AN.tcsHw(to)), r.addr + ' ' + to + ': no value of the program');
    } else ok(WAIT[to], r.addr + ' ' + to + ' is not linked and has no reason');
  }
  /* the program, the DCS address and the list of the TCS page read one value */
  ok(AN.tcsHw('TCA980-20') === 1 && AN.unit.tc.mode === 'hot', 'TCA500 HOT mode at 150 MW');
  ok(Math.abs(AN.tcsHw('TCE970-6') - AN.unit.tb.rpm) < 5, 'AI0534 = the shaft ' + AN.tcsHw('TCE970-6'));
  ok(Math.abs(p.v[p.idx.get('CON:TCP1070.D6')] - p.v[p.idx.get('CON:TCP2070.D6')]) < 1e-9 && p.v[p.idx.get('CON:TCP1070.D6')] > 100, 'TPC gen. MW');
  const fed = new Set(p.tpc.flatMap(x => x[0]).concat(p.in.map(x => x[0])));
  const open = p.ports.filter(n => /^CON:/.test(n) && !fed.has(p.idx.get(n)) && !OPEN.some(r => r.test(n)));
  ok(!open.length, open.length + ' connectors with no sheet and no reason: ' + open.slice(0, 12).join(' '));
  ok(p.tpc.length > 60, 'TPC signals ' + p.tpc.length);
  /* turbine trip: RSV / ICV closed, trip 2, TRIP of the protection controllers */
  AN.turbine('trip');
  E.step(6);
  ok(AN.tcsHw('TCE960-13') === 1 && AN.tcsHw('TCE961-13') === 1 && AN.tcsHw('TCE960-26') === 1, 'trip: I.0401 / I.0402 / I.0416');
  ok([1, 2, 3].every(n => p.v[p.idx.get('CON:TCP' + n + '121.A1')] === 1), 'trip: TURBINE TRIP of the three TPC');
  ok(AN.tcsHw('TCE960-18') === 0, 'I.0406 off above 2450 rpm');
  console.log('TCS -> DCS: ' + hw.length + ' outputs linked, ' + Object.keys(WAIT).length + ' waiting, ' + p.tpc.length + ' TPC signals');
  for (const b of bad) console.log('FAIL ' + b);
  process.exit(bad.length ? 1 : 0);
})().catch(e => {
  console.log(e);
  process.exit(1);
});
