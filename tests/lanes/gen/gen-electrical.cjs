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
  /* the stator and cooling gas temperatures go to their design value: cold gas = cooling water + 8 K (37 C water -> 45 C gas, GAE-2013-0136
     R2 / nameplate 310SD18-613), stator = cold gas + 78 K x (I / 7.384 kA)^2 (123 C limit by RTD at the rating, GEE-2014-0322 R2 p4), lag 600 s */
  const th = () => JSON.parse(E.js(`JSON.stringify({ts:AN.unit.genT.ts.slice(),ta:AN.unit.genT.ta.slice(),cw:AN.unit.acT2,kA:AN.gen().kA})`));
  const t0 = th();
  E.step(1);
  const t1 = th(),
    air = t1.cw + 8,
    a = 0.5 / 600,
    eTa = t0.ta.map(v => v + (air - v) * a),
    eTs = t0.ts.map(v => v + (air + 78 * (t1.kA / 7.384) ** 2 - v) * a);
  ok(t1.ta.every((v, i) => Math.abs(v - eTa[i]) < 2e-3), 'cooling gas after the coolers goes to the cooling water + 8 K (45 C gas at 37 C water, nameplate 310SD18-613) = ' + air.toFixed(1) + ' C');
  ok(t1.ts.every((v, i) => Math.abs(v - eTs[i]) < 2e-3), 'stator coil goes to ' + (air + 78 * (t1.kA / 7.384) ** 2).toFixed(1) + ' C at ' + t1.kA.toFixed(2) + ' kA (123 C at 7.384 kA)');
  /* the generator losses = the segregated loss test LM-GEE-2014-0822 R0 p31 (2,032 kW at 176.5 MVA): armature 3 I^2 Ra, field If^2 Rf,
     exciter 29 kW (If / 1,141)^2, stray 283 kW (I / In)^2, core 388 kW V^2, friction and windage 875 kW n^3; the coolers get it less the
     bearing friction 240 kW n^3 to the lube oil (GAE-2015-0063 R0 p36) */
  const q = JSON.parse(E.js(`JSON.stringify({q:AN.unit.pt['q.ccw.YUI'].Q,L:AN.unit.genT.L,kA:AN.gen().kA,If:AN.gen().If,V:AN.unit.gen.V,n:AN.unit.tb.rpm/3600})`)),
    ifm = (q.If * 463) / 4.5,
    Le = (3 * (q.kA * 1000) ** 2 * 0.001051 + ifm ** 2 * 0.2188) / 1000 + 29 * (ifm / 1141) ** 2 + 283 * (q.kA / 7.384) ** 2 + 388 * q.V ** 2 + 875 * q.n ** 3,
    Lr = (3 * 7384 ** 2 * 0.001051 + 1141 ** 2 * 0.2188) / 1000 + 29 + 283 + 388 + 875;
  ok(Math.abs(Lr - 2032) < 1, 'the loss terms give ' + Lr.toFixed(0) + ' kW at the rating (2,032 kW in the type test)');
  ok(Math.abs(q.L - Le) < 1 && Math.abs(q.q - (Le - 240 * q.n ** 3)) < 1 && q.q < 2120, 'generator losses ' + q.L.toFixed(0) + ' kW, to the air coolers ' + q.q.toFixed(0) + ' kW (rated 2,120 kW)');
  const pt = JSON.parse(E.js(`JSON.stringify({g:AN.unit.pt.gen,a:AN.unit.pt['aux.power'],s:AN.unit.pt['store.YUI'],MW:AN.unit.MW,aux:AN.elec().aux})`));
  ok(pt.g && pt.g.W === pt.MW && pt.g.x.b52g === 1, 'port gen: ' + (pt.g && pt.g.W.toFixed(2)) + ' MW, 52G closed');
  ok(pt.a && Math.abs(pt.a.W - pt.aux) < 1e-9, 'port aux.power: ' + (pt.a && pt.a.W.toFixed(2)) + ' MW = the house load of elec.js');
  ok(pt.s && pt.s.mw === 0 && Math.abs(pt.s.E - 4.01 * 176.5 * 16200 / 39900) < 3, 'port store.YUI: rotor energy ' + (pt.s && pt.s.E.toFixed(0)) + ' MJ (generator + exciter share of H 4.01 s)');
  /* the generator protection relay (A): the pick-up contacts of the model on the TCS sheets SH-G-5A / 5B (GEE-2015-0173 R1 settings),
     the times and the 52G gating are the sheets' */
  const rq = `(()=>{const p=AN.tce(),U=AN.unit,x=U.pt['relay.gen'].x,pl=k=>{const n=p.ports.find(q=>q.startsWith('PLANT:'+k+' '));return n?p.v[p.idx.get(n)]:NaN},
    v=k=>p.v[p.idx.get(k)];return JSON.stringify({x,c:{r24b:pl('G-5A.r24b'),r27:pl('G-5A.r27'),r81l1:pl('G-5B.r81l1'),r81l2:pl('G-5B.r81l2'),r59a:pl('G-5A.r59a'),
    b27:pl('G-6A.r27'),b81:pl('G-6B.r81l2'),b24:pl('G-6A.r24b')},M:pl('G-5A.d24b.M'),MB:pl('G-6A.d24b.M'),gA:v('G-5A:gor'),gB:v('G-5B:gor'),gC:v('G-6A:gor'),gD:v('G-6B:gor'),V:U.gen.V,f:U.tb.rpm/60})})()`;
  const r1 = JSON.parse(E.js(rq)),
    vhz = (100 * r1.V) / (r1.f / 60);
  ok(Object.entries(r1.x).every(([k, v]) => k === 'vhz' || v === 0) && Math.abs(r1.M - vhz) < 0.05 && r1.MB === r1.M && r1.gC === 0 && r1.gD === 0 && Object.values(r1.c).every(v => v === 0) && r1.gA === 0 && r1.gB === 0,
    'relays (A) and (B) at 150 MW: every contact open, V/Hz ' + r1.M.toFixed(2) + ' % into the 24 inverse element, no trip');
  /* the 32 reverse power through the sheets (GEE-2015-0173 p.16: #2 -0.013 pu = -2.3 MW, 10 s, SH-G-5A d32 / 6A -> 86G-A / 86G-B):
     GOV SET to 0 with 52G closed and the turbine not tripped: the generator motors at minus its losses, the lockouts trip the turbine */
  const E2 = load();
  await E2.start('150');
  E2.step(10);
  /* the honest form (phase thread 2026-11-28, no mask): the unit comes down first through the DCS, as the operator does it. In CCS (DCS
     control mode ON) the load is set on HIC-ULD (ABC-001A), the same write as its faceplate (hmi.js: the station output and, in AUTO,
     its own set input SI0243 TARGET MW SETUP FROM CCS CRT), to 45 MW, the HB case 7 load (32.7 %, the low end of the design sweep, docs/ACCEPTANCE.md).
     There the boiler fires for 45 MW, so GOV SET 0 does not take the drum to H.H. (at 150 MW it does: BOILER MFT trips the turbine
     through TA-9 before the 32 times out, KANA 2026-11-28, which is the plant's own protection) */
  const uld = v =>
    E2.js(`(()=>{const sh=AN.sheets.find(s=>s.name==='ABC-001A'),S=sh.S,b=S.blk.find(x=>x.k==='MAN'&&x.tag==='HIC-ULD');AN.stVal(sh.name,b.id,${v});
      const si=b.svI>=0?b.i[b.svI]:null,dr=si!=null?(S.drv[si]||[]).find(z=>z.k==='AMT'):null,ds=dr&&S.rt.st[dr.id];
      if(dr&&ds&&ds.pk==='A'&&dr.a!=null&&S.ext.includes(dr.a))S.rt.ext[dr.a]=${v};AN.settle&&AN.settle();return ''})()`);
  /* the CCS brings it down at the HIC-MWRL rate of the start until the logic takes the boiler master out of AUTO (ABC-001C HIC-BM
     BU-CMD M.2013, steam flow < 220 T/H): HIC-ULD then tracks the load (about 73 MW here). The case goes on from where the logic stops
     it. 2026-11-28: the start's rate is the design 1.2 MW/min (PPE-15-0080 R1; was 3.0 from a screen), so the wait is sized from the rate
     the start holds (E2.step(240) = 2 plant min), not from a fixed 40 min */
  uld(45);
  const rate = +E2.js(`(()=>{const S=AN.sheets.find(s=>s.name==='ABC-001B').S,b=S.blk.find(x=>x.k==='MAN'&&x.tag==='HIC-MWRL');return S.rt.st[b.id].val})()`) || 3;
  const nMax = Math.ceil((150 - 70) / rate / 2) + 10;
  let mLow = 150,
    mPrev = 150;
  for (let m = 0; m < nMax && mLow > 46; m++) {
    E2.step(240);
    (mPrev = mLow), (mLow = +E2.js('AN.unit.MW'));
    if (mLow < 90 && Math.abs(mPrev - mLow) < 1) break;
  }
  const low = JSON.parse(E2.js(`JSON.stringify({MW:AN.unit.MW,st:AN.unit.tb.st})`));
  ok(low.st === 'load' && low.MW < 80, 'load down through CCS (HIC-ULD set 45 MW): ' + low.MW.toFixed(1) + ' MW where the logic holds it, 52G closed');
  E2.js("AN.turbine('gov',{op:'set',v:0})");
  let tNeg = -1,
    tLo = -1,
    mwNeg = 0,
    mot = null,
    why = '';
  for (let i = 1; i <= 120 && tLo < 0; i++) {
    E2.step(2);
    const o = JSON.parse(E2.js(`JSON.stringify({MW:AN.unit.MW,lo:AN.unit.lo86,L:AN.unit.genT.L,m:-AN.unit.Pm,st:AN.unit.tb.st})`));
    if (tNeg < 0 && o.MW <= -0.013 * 176.5) (tNeg = i), (mwNeg = o.MW);
    if (o.lo.a && o.lo.b) (tLo = i), (why = o.lo.why);
    else if (o.st === 'load' && (!mot || o.MW < mot.MW)) mot = o;
  }
  /* the motoring power with the valves shut = the turbine mechanical loss (AN_TB.mech, HB) + the generator losses at no load (type test
     p31: friction and windage, core, field, exciter): it holds the 2nd step pick-up -0.013 pu (GEE-2015-0173 p16) with margin, the 1st
     step -0.008 pu about half of it. Blade windage without steam flow is not modelled (NO-SOURCE): it only adds to the motoring power */
  ok(mot && Math.abs(mot.MW + mot.m + mot.L / 1000) < 0.02 && mot.MW < -0.013 * 176.5 - 0.3,
    'motoring power ' + (mot ? mot.MW.toFixed(2) : '?') + ' MW = turbine ' + (mot ? mot.m.toFixed(2) : '?') + ' + generator ' + (mot ? (mot.L / 1000).toFixed(2) : '?') + ' MW no load, ' + (mot ? (mot.MW / 176.5).toFixed(4) : '?') + ' pu (2nd step -0.013, 1st -0.008)');
  E2.step(10);
  const st2 = E2.js('AN.unit.tb.st');
  ok(tNeg > 0 && tLo - tNeg >= 9 && tLo - tNeg <= 12 && st2 === 'off',
    'reverse power: ' + mwNeg.toFixed(2) + ' MW (motoring at the losses), 86G-A / 86G-B ' + (tLo - tNeg) + ' s after -2.3 MW (' + why + '), turbine off');
  ok(E2.js("AN.turbine('gen',{op:'reset86'})") === '' && !JSON.parse(E2.js('JSON.stringify(AN.unit.lo86)')).a, 'lockouts reset once the relay has dropped out (52G open)');
  /* the generator breaker 52G trips open alone (Plant-menu fault 'gen.52g', elec.js anElec52gTrip): 52G open, the turbine stays latched,
     the field 41 stays closed, the open circuit voltage starts at the transient EMF |E'q, E'd| (tcs-gen.js), the house load comes back
     from the grid through 52L1 (back-feed); trip-free: a 52G CLOSE while the trip stands does not hold */
  const E3 = load();
  await E3.start('150');
  E3.step(10);
  E3.js("WORLD.ftrip('gen.52g',true)");
  let vMin = 9,
    vMax = 0,
    vhz3 = 0;
  for (let i = 0; i < 20; i++) {
    E3.step(1);
    const v = +E3.js('AN.unit.gen.V');
    vMin = Math.min(vMin, v);
    vMax = Math.max(vMax, v);
    vhz3 = Math.max(vhz3, +E3.js("AN.unit.pt['relay.gen'].x.vhz"));
  }
  const r3 = JSON.parse(E3.js(`JSON.stringify({st:AN.unit.tb.st,trip:!!(AN.unit.tc&&AN.unit.tc.trip),f41:AN.unit.gen.f41,lo:AN.unit.lo86,b52:AN.unit.pt.gen.x.b52g,el:AN.elec(),c:AN.turbine('gen',{op:'close52g'})})`));
  E3.step(2);
  const st3 = E3.js('AN.unit.tb.st');
  ok(r3.st === 'roll' && r3.b52 === 0 && !r3.trip && r3.f41 && !r3.lo.a && !r3.lo.b && vMin > 0.9 && vMax < 1.1 && r3.el.exp < 0 && Math.abs(r3.el.exp + r3.el.aux + r3.el.uatLoss + r3.el.mtLoss) < 1e-6 && st3 !== 'sync' && st3 !== 'load',
    '52G trip: open, turbine not tripped, field on, voltage ' + vMin.toFixed(3) + ' ~ ' + vMax.toFixed(3) + ' pu, peak V/Hz ' + vhz3.toFixed(1) + ' % (relay.gen), house load ' + r3.el.aux.toFixed(1) + ' MW from the grid, no reclose while the trip stands');
  E.js("AN.turbine('trip')");
  E.step(240);
  const r2 = JSON.parse(E.js(rq));
  ok(r2.c.r27 === 1 && r2.c.r81l1 === 1 && r2.c.r81l2 === 1 && r2.c.r24b === 0 && r2.c.b27 === 1 && r2.c.b81 === 1 && r2.gA === 0 && r2.gB === 0 && r2.gC === 0 && r2.gD === 0,
    'relays (A) and (B) after the turbine trip (' + r2.f.toFixed(1) + ' Hz, ' + (r2.V * 115).toFixed(0) + ' V): 27 and 81U picked up, no lockout (52G open gates them)');
  process.exit(bad ? 1 : 0);
})().catch(e => {
  console.error(e);
  process.exit(1);
});
