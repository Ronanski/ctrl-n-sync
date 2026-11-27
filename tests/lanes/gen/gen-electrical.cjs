/* Phase 11 plant model, part 6 generator and electrical (MODEL GENERATOR ELECTRICAL : YUI, 2026-11-27).
   A. The field / on-line phasor model of src/analog/engine/tcs-gen.js on its own (the file itself, in a vm), over the continuous load
      sweep 45 ~ 150 MW in 0.5 MW steps with the AVR at its set 1.0 pu (steady state, tcsGenEqFor): the terminal voltage is held, the
      power out of the phasors is the turbine power (energy balance of the machine), the field rises with the load and stays between the
      no-load field 4.5 A and the ceiling 17.6 A (GEE-2015-0152 p6), and the stator current stays under its rating 7384 A (GAE-2013-0136 R2).
      The V curves of 310SD23-270 R1 at 1.0 pu kVA (main field A; 463 A = 1 pu field, 310SD23-268 R1) from Xd of the same file: within 2 %.
   B. The running app at 150 MW: ONE generator. The page values (AN.gen, page 17 and the HMI) are the TCS values (U.gen: TCS I/O, Modbus,
      var-hour meter): Mvar, power factor, stator current, terminal voltage, field current; the generator temperatures go to their
      design values (unit.js anGenTemp). */
'use strict';
const fs = require('fs'),
  path = require('path'),
  vm = require('vm');
const root = path.resolve(__dirname, '..', '..', '..');
let bad = 0;
const ok = (c, m) => {
  if (!c) bad++;
  console.log((c ? 'PASS ' : 'FAIL ') + m);
};
/* A */
{
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(root, 'src/analog/engine/tcs-gen.js'), 'utf8') + '\n;this.K = TCS_GEN; this.ph = tcsGenPh; this.eqFor = tcsGenEqFor;', ctx);
  const { K, ph, eqFor } = ctx;
  let vMax = 0,
    pMax = 0,
    mono = true,
    fLo = Infinity,
    fHi = 0,
    iHi = 0,
    last = 0;
  for (let mw = 45; mw <= 150.0001; mw += 0.5) {
    const P = mw / K.sb,
      eq = eqFor(1, P),
      r = ph(eq, P);
    vMax = Math.max(vMax, Math.abs(r.V - 1));
    pMax = Math.max(pMax, Math.abs(r.P - P) * K.sb);
    if (eq < last) mono = false;
    last = eq;
    fLo = Math.min(fLo, eq * K.ifo);
    fHi = Math.max(fHi, eq * K.ifo);
    iHi = Math.max(iHi, r.I * K.ib);
  }
  ok(vMax < 1e-3, 'sweep 45 ~ 150 MW: terminal voltage held by the AVR at 1.0 pu (worst ' + vMax.toExponential(1) + ' pu)');
  ok(pMax < 0.01, 'sweep: electrical power of the phasors = turbine power (worst ' + pMax.toFixed(4) + ' MW)');
  ok(mono, 'sweep: field rises with the load (no step, no table)');
  ok(fLo > 4.5 && fHi < 17.6, 'sweep: exciter field ' + fLo.toFixed(2) + ' ~ ' + fHi.toFixed(2) + ' A inside no load 4.5 A / ceiling 17.6 A');
  ok(iHi < 7.384, 'sweep: stator current up to ' + iHi.toFixed(3) + ' kA < rating 7.384 kA');
  /* 310SD23-270 R1 V curves at 1.0 pu kVA, Vt = 1 (as read in lanes/tcs-io/gen-reactive-model.md 4): pf (negative = lead), main field A */
  const VC = [
    [0.85, 1218],
    [0.9, 1185],
    [0.95, 1135],
    [1.0, 1008],
    [-0.95, 868],
    [-0.92, 828]
  ];
  for (const [pf, A] of VC) {
    const a = Math.acos(Math.abs(pf)) * (pf < 0 ? -1 : 1),
      /* I = 1 pu at angle -a behind Vt = 1: Eq = |1 + j Xd I| */
      ir = Math.cos(a),
      ii = -Math.sin(a),
      eq = Math.hypot(1 - K.xd * ii, K.xd * ir),
      m = eq * 463,
      e = (100 * (m - A)) / A;
    ok(Math.abs(e) < 2, 'V curve 310SD23-270 at pf ' + (pf < 0 ? -pf + ' lead' : pf + ' lag') + ': ' + m.toFixed(0) + ' A vs ' + A + ' A (' + e.toFixed(1) + ' %)');
  }
}
/* B */
const { load } = require(path.join(root, 'tools', 'trace', 'world.cjs'));
(async () => {
  const E = load();
  await E.start('150');
  E.step(20);
  const r = JSON.parse(
    E.js(`(()=>{const U=AN.unit,g=U.gen,p=AN.gen();return JSON.stringify({p,g:{Q:g.Q*176.5,pf:g.pf,kA:g.I*7.384,kV:g.V*13.8,If:g.efd*4.5},MW:U.MW})})()`)
  );
  const same = (a, b, t) => Math.abs(a - b) <= t;
  ok(same(r.p.MVAr, r.g.Q, 1e-6), 'one generator: page Mvar ' + r.p.MVAr.toFixed(2) + ' = TCS Mvar ' + r.g.Q.toFixed(2));
  ok(same(r.p.pf, r.g.pf, 1e-9), 'one generator: page power factor ' + r.p.pf.toFixed(4) + ' = TCS ' + r.g.pf.toFixed(4));
  ok(same(r.p.kA, r.g.kA, 1e-6), 'one generator: page current ' + r.p.kA.toFixed(3) + ' kA = TCS ' + r.g.kA.toFixed(3) + ' kA');
  ok(same(r.p.kV, r.g.kV, 1e-6), 'one generator: page voltage ' + r.p.kV.toFixed(2) + ' kV = TCS ' + r.g.kV.toFixed(2) + ' kV');
  ok(same(r.p.If, r.g.If, 1e-6), 'one generator: page field ' + r.p.If.toFixed(2) + ' A = TCS ' + r.g.If.toFixed(2) + ' A');
  const Ip = r.MW / (Math.sqrt(3) * r.p.kV * r.p.pf);
  ok(same(r.p.kA, Ip, 0.01 * Ip), 'page current = P / (sqrt3 V pf) ' + Ip.toFixed(3) + ' kA');
  /* check only (RULES 3.5): control room screen 37.PNG, 151.1 MW: field 8.7 A */
  console.log('INFO field ' + r.p.If.toFixed(2) + ' A at ' + r.MW.toFixed(1) + ' MW (screen 37.PNG: 8.7 A at 151.1 MW, check only)');
  /* the stator and cooling gas temperatures go to their design value: cold gas = cooling water + 3 K (37 C water -> 40 C gas, GAE-2013-0136
     R2 / IEC 60034-1), stator = cold gas + 83 K x (I / 7.384 kA)^2 (123 C limit by RTD at the rating, GEE-2014-0322 R2 p4), lag 600 s */
  const th = () => JSON.parse(E.js(`JSON.stringify({ts:AN.unit.genT.ts.slice(),ta:AN.unit.genT.ta.slice(),cw:AN.unit.acT2,kA:AN.gen().kA})`));
  const t0 = th();
  E.step(1);
  const t1 = th(),
    air = t1.cw + 3,
    a = 0.5 / 600,
    eTa = t0.ta.map(v => v + (air - v) * a),
    eTs = t0.ts.map(v => v + (air + 83 * (t1.kA / 7.384) ** 2 - v) * a);
  ok(t1.ta.every((v, i) => Math.abs(v - eTa[i]) < 2e-3), 'cooling gas after the coolers goes to the cooling water + 3 K = ' + air.toFixed(1) + ' C');
  ok(t1.ts.every((v, i) => Math.abs(v - eTs[i]) < 2e-3), 'stator coil goes to ' + (air + 83 * (t1.kA / 7.384) ** 2).toFixed(1) + ' C at ' + t1.kA.toFixed(2) + ' kA (123 C at 7.384 kA)');
  process.exit(bad ? 1 : 0);
})().catch(e => {
  console.error(e);
  process.exit(1);
});
