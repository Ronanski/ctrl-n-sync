// plan c4 (3.2.3): the electrical model of elec.js (house load of the 6.6 kV motors, export, transformer loading, 52L1), in Node. Usage: node tests/regress/elec_desk.js
const fs = require('fs'),
  vm = require('vm');
const G = { MVAr: 33.1 };
const ctx = { Math, isFinite, Object, AN_UNIT: null, anGenEl: () => G, AN_SRC: { field: { esp: false } } };
vm.createContext(ctx);
/* Phase 11 (YUI 2026-11-28): the house load is the sum of the motor ports q.motor.<part> {P kW, Q kvar} (ports.js anPortGet, loaded
   here as in the app) + the rows of AN_EL.mot not yet moved to a port + the 460 V and ESP transformers; was: current x a fixed pf */
vm.runInContext(fs.readFileSync('src/analog/engine/ports.js', 'utf8') + ';' + fs.readFileSync('src/analog/engine/elec.js', 'utf8') + ';this.API={anElec,anElecStep,anElecL52,AN_EL}', ctx);
const { anElec, anElecStep, anElecL52, AN_EL } = ctx.API;
const lab = () => ({ S: { rt: { force: {}, ext: {} }, ext: [5] }, n: 5 });
/* desk inputs (not a plant reading): three part ports and the 6.6 kV currents of the rows still in AN_EL.mot */
const PT = { 'q.motor.AOI': { P: 5990, Q: 2900 }, 'q.motor.NANA': { P: 3030, Q: 1700 }, 'q.motor.MEI': { P: 260, Q: 140 }, 'q.motor.SUZU': { P: 2400, Q: 1900 } };
const mk = () => ({ on: true, MW: 150, tcsT: 150, tb: { st: 'load', rpm: 3600 }, di: { l52: lab(), on: lab() }, pt: JSON.parse(JSON.stringify(PT)), swIa0: 230, swIa1: 230, acI0: 26.8, paI0: 43.8 });
let fail = 0;
const ck = (ok, w, x) => {
  console.log((ok ? 'PASS ' : 'FAIL ') + w + (x !== undefined ? ' ' + JSON.stringify(x) : ''));
  if (!ok) fail++;
};
const r3 = Math.sqrt(3),
  u0 = mk();
let P = 0,
  Q = 0;
for (const k in PT) (P += PT[k].P / 1000), (Q += PT[k].Q / 1000);
for (const [k, , pf] of AN_EL.mot || []) {
  const p = (r3 * 6.6 * (+u0[k] || 0) * pf) / 1000;
  (P += p), (Q += p * Math.tan(Math.acos(pf)));
}
(P += 0.721), (Q += 0.496);
const tr = (T, S) => {
  const k = S / T.S,
    r = T.pk / T.S;
  return [T.p0 + T.pk * k * k, T.q0 * T.S + Math.sqrt(T.z * T.z - r * r) * T.S * k * k];
};
let U = mk(),
  e = anElec(U);
ck(Math.abs(e.aux - P) < 1e-9 && Math.abs(e.auxMVAr - Q) < 1e-9, 'house load = ports + the rows left + 460 V 0.721 MW / 0.496 Mvar', [+e.aux.toFixed(3), +e.auxMVAr.toFixed(3)]);
const S = Math.hypot(P, Q);
ck(Math.abs(e.busA - (1000 * S) / (r3 * 6.6)) < 1e-6, '6.6 kV bus current = S / (sqrt3 x 6.6 kV)', +e.busA.toFixed(1));
U = mk();
delete U.pt['q.motor.NANA'];
ck(Math.abs(anElec(U).aux - (P - 3.03)) < 1e-9, 'a port not written adds nothing');
ctx.AN_SRC.field.esp = true;
const eE = anElec(mk());
ctx.AN_SRC.field.esp = false;
ck(Math.abs(eE.aux - e.aux - 0.91) < 1e-9 && Math.abs(eE.auxMVAr - e.auxMVAr - 0.024) < 1e-9, 'ESP in service: + its T/R sets 0.910 MW / 0.024 Mvar (Bus51)', +eE.aux.toFixed(3));
const Lu = tr(AN_EL.tr.uat, S),
  P13 = 150 - P - Lu[0],
  Q13 = 33.1 - Q - Lu[1],
  Lm = tr(AN_EL.tr.mt, Math.hypot(P13, Q13));
ck(Math.abs(e.exp - (P13 - Lm[0])) < 1e-9 && e.mtPct > 70 && e.mtPct < 80, 'export = 150 - house load - UAT and main transformer losses (Shihlin guaranteed), main transformer % of 180 MVA', [+e.exp.toFixed(2), +e.mtPct.toFixed(1)]);
ck(Math.abs(e.uatPct - (100 * S) / 34) < 1e-6, 'unit auxiliary transformer % of 34 MVA', +e.uatPct.toFixed(2));
anElecStep(U);
ck(U.di.l52.S.rt.ext[5] === 0, '52L1 closed: I.0937 = 0');
U.tb.st = 'off';
ck(/generator on line/.test(anElecL52(U, 0)), 'open 52L1 refused with 52G1 open');
e = anElec(U);
ck(e.exp < 0 && e.src === 'grid (back-feed)', 'before sync: the house load comes from the grid', [+e.exp.toFixed(1), e.src]);
U = mk();
ck(anElecL52(U, 0) === '', 'open 52L1 on load: accepted');
U.di.on.S.rt.ext[5] = 1;
anElecStep(U);
e = anElec(U);
ck(U.di.l52.S.rt.ext[5] === 1 && e.house === 1 && e.exp === 0, 'house load: I.0937 = 1, nothing to the grid');
ck(Math.abs(U.tcsT - e.aux) < 1e-9, 'house load: the turbine target = the house load', +U.tcsT.toFixed(2));
ck(U.di.on.S.rt.ext[5] === 0, 'house load: DCS control mode on feedback off');
U.MW = 15;
ck(anElecL52(U, 1) === '' && U.tb.aim === 15 && U.tb.tgt === 15, 'close 52L1: the TCS target stays at the load of the moment');
ck(/already closed/.test(anElecL52(U, 1)), 'close again: refused');
console.log(fail ? 'FAILED ' + fail : 'ALL PASS');
process.exit(fail ? 1 : 0);
