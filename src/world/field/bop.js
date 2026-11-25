/* src/world/field/bop.js: LANE 4 DCS LINKS BOP (RARA), beta.574. Field signals of the balance of plant (src/world/field/README.md).
   Each row reads engine state that already exists (read only) and names its physical source. No constant stands for a process value,
   no fitted number (RULES 3.12). Paper with the physical source of every value (QA : SAORI pass 2026-11-25):
   lanes/bop/lane4-field-values-paper-2026-11-25.md. A value that is not a number writes nothing (the point keeps its last value).
   Open, not filled here (needs model or a PC document): CEP motor temperatures, chemical tank levels, pit / leak switches, PAF oil panel,
   industrial water strainer DP. */
const G = typeof window !== 'undefined' ? window : globalThis;
const fin = x => (typeof x === 'number' && isFinite(x) ? x : NaN);
/* the controller MV on its ABC sheet (the valve command), read the way unit.js reads it (anFwTagStep ctl / mvOf: AN.hmiCtrls out net) */
const C = {};
const mv = (sheet, tag) => {
  const A = G.AN;
  if (!A || !A.sheets) return NaN;
  let c = C[tag];
  if (!c) {
    const x = A.sheets.find(y => y.name === sheet),
      q = x && x.S && A.hmiCtrls ? (A.hmiCtrls(x.S) || []).find(k => k.tag === tag) : null;
    if (!q || q.out == null) return NaN;
    c = C[tag] = { S: x.S, n: q.out };
  }
  return Math.max(0, Math.min(100, +c.S.rt.v[c.n] || 0));
};
/* the opening that reaches the process: the positioner drives the stem to the command, the airlock holds it when the instrument air is
   lost (X.av = unit.js anAv, valve package K1AU3-E2-0-123 R1). A valve outside the airlock list follows its command */
const open = (X, sheet, tag) => {
  const m = mv(sheet, tag);
  return isFinite(m) ? fin(X.av(tag, m)) : NaN;
};
/* the heater drain valves as the drain model drives them (unit.js AN_HD): primary = the split-range F(X) of the drawing (ABC-035 ~ 039,
   LN38 ...) on the primary MV, alternate = its own station MV; both through the airlock */
const hdv = (U, X, k, j) => {
  const h = (U.hd || []).find(x => x.k === k);
  if (!h) return NaN;
  const o = j === 1 ? h.v1 : h.v2;
  if (!o || !o.S) return NaN;
  let x = +o.S.rt.v[o.n] || 0;
  if (j === 1 && h.fx && h.fx.p) {
    const pin = (h.fx.p.pins || []).find(p => p.role === 'out');
    if (pin && pin.n != null) x = +o.S.rt.v[pin.n] || 0;
  }
  return fin(X.av(j === 1 ? h.c1 : h.c2, Math.max(0, Math.min(100, x))));
};
const R = [];
const io = s => 'I/O list STN10' + s;
/* 1. control valve position ZT = the opening that reaches the process */
for (const [stn, ai, tag, sheet, ctl, why] of [
  [1, 'AI0180', 'ZT-FW1130-1', 'ABC-010', 'FICFW1007', 'FCV-FW1130-1, valve package item 27'],
  [1, 'AI0195', 'ZT-FW1130-2', 'ABC-010', 'LICBR1001B', 'FCV-FW1130-2 start-up valve, item 28'],
  [2, 'AI0694', 'ZT-FW1060', 'ABC-051', 'TICMS1022', 'TCV-FW1060 HP bypass spray'],
  [2, 'AI0704', 'ZT-FW1150', 'ABC-019', 'TICHR1002', 'TCV-FW1150 reheater spray'],
  [2, 'AI0390', 'ZT-CD1115', 'ABC-052', 'TICHR1012', 'TCV-CD1115 LP bypass spray (the same opening as the flow FT-CD1115 of unit.js)'],
  [2, 'AI0688', 'ZT-CD1124', 'ABC-033', 'TICAS1001', 'TCV-CD1124 aux steam spray'],
  [2, 'AI0689', 'ZT-CD1126', 'ABC-034', 'TICAS1017', 'TCV-CD1126 gland steam spray'],
  [2, 'AI0389', 'ZT-CD1121', 'ABC-032', 'FICCD1121', 'FCV-CD1121, item 11'],
  [2, 'AI0690', 'ZT-CD1120', 'ABC-032', 'FICCD1120', 'FCV-CD1120 minimum flow, item 18'],
  [2, 'AI0691', 'ZT-CD1110', 'ABC-031', 'LICCD1110B', 'LCV-CD1110 dump to raw pit, item 15'],
  [2, 'AI0692', 'ZT-CD1104', 'ABC-031', 'LICCD1104', 'LCV-CD1104 deaerator level, item 14'],
  [2, 'AI0693', 'ZT-MU1110', 'ABC-031', 'LICCD1110A', 'LCV-MU1110 condenser make-up, item 17'],
  [1, 'AI0179', 'ZT-MS1001', 'ABC-013', 'PICMS1002', 'PCV-MS1001 blow off, item 1'],
  [2, 'AI0705', 'ZT-CW1201', 'ABC-053', 'TICLO1002', 'TCV-CW1201 lube oil temperature, item 40']
])
  R.push({ stn, ai, tag, v: (U, X) => open(X, sheet, ctl), rel: 'opening = anAv(' + ctl + ', MV of ' + ctl + ')', src: io(stn) + ' ' + ai + '; ' + sheet + ' ' + ctl + '; ' + why });
for (const [n, k, sh, a1, a2] of [
  ['1101', 'H1', 'ABC-037', 'AI0707', 'AI0721'],
  ['1102', 'H2', 'ABC-038', 'AI0708', 'AI0722'],
  ['1103', 'H3', 'ABC-039', 'AI0709', 'AI0723'],
  ['1105', 'H5', 'ABC-035', 'AI0710', 'AI0725'],
  ['1106', 'H6', 'ABC-036', 'AI0724', 'AI0726']
]) {
  R.push({ stn: 2, ai: a1, tag: 'ZT-HD' + n + '-1', v: (U, X) => hdv(U, X, k, 1), rel: 'primary drain valve = anAv(LICHD' + n + '1, split-range F(X) of the primary MV), as AN_HD', src: io(2) + ' ' + a1 + '; ' + sh + ' LICHD' + n + '1; LCV-HD' + n + '-1' });
  R.push({ stn: 2, ai: a2, tag: 'ZT-HD' + n + '-2', v: (U, X) => hdv(U, X, k, 2), rel: 'alternate drain valve = anAv(LICHD' + n + '2, its MV), as AN_HD', src: io(2) + ' ' + a2 + '; ' + sh + ' LICHD' + n + '2; LCV-HD' + n + '-2' });
}
/* 2. limit switches: end of travel (K1AU3-E2-0-123 R1 "Limit Switches: OMRON D4A-2502N (1 Open & 1 Closed)"), the app's end of travel:
   open = position >= 100 %, closed = position <= 0 % (QA review 2026-11-25) */
const zt = t => {
  const r = R.find(x => x.tag === t);
  return r ? r.v : () => NaN;
};
for (const [addr, tag, z, o] of [
  ['I.0898', 'ZSO-FW1060', 'ZT-FW1060', 1],
  ['I.0899', 'ZSC-FW1060', 'ZT-FW1060', 0],
  ['I.089A', 'ZSO-FW1150', 'ZT-FW1150', 1],
  ['I.089B', 'ZSC-FW1150', 'ZT-FW1150', 0],
  ['I.0893', 'ZSC-CD1115', 'ZT-CD1115', 0],
  ['I.0894', 'ZSO-CD1124', 'ZT-CD1124', 1],
  ['I.0895', 'ZSC-CD1124', 'ZT-CD1124', 0],
  ['I.0896', 'ZSO-CD1126', 'ZT-CD1126', 1],
  ['I.0897', 'ZSC-CD1126', 'ZT-CD1126', 0]
]) {
  const f = zt(z);
  R.push({
    stn: 2,
    di: 1,
    tag,
    v: (U, X) => {
      const p = f(U, X);
      return isFinite(p) ? (o ? p >= 100 : p <= 0) : NaN;
    },
    rel: (o ? 'open limit: ' : 'closed limit: ') + z + (o ? ' >= 100 %' : ' <= 0 %'),
    src: io(2) + ' ' + addr + '; K1AU3-E2-0-123 R1 OMRON D4A-2502N end of travel'
  });
}
/* 3. motor valve positions: the DITL-38 MOTOR CONTROL VALVE copy of each valve (stroke = the TIMER SETTING of the drawing) */
for (const [stn, ai, tag, sh] of [
  [1, 'AI0177', 'ZT-BD1001', 'DITL-38'],
  [1, 'AI0178', 'ZT-BD1002', 'DITL-38 #MV-BD1002'],
  [2, 'AI0768', 'ZT-FW1001', 'DITL-38 #MV-FW1001'],
  [2, 'AI0784', 'ZT-FW1002', 'DITL-38 #MV-FW1002'],
  [2, 'AI0785', 'ZT-FW1392', 'DITL-38 #MV-FW1392'],
  [2, 'AI0736', 'ZT-MS1391', 'DITL-38 #MV-MS1391']
])
  R.push({ stn, ai, tag, v: (U, X) => fin(X.ditlPos(sh, 0)), rel: 'position of ' + sh, src: io(stn) + ' ' + ai + '; ' + sh + ' (DITL-38 MOTOR CONTROL VALVE)' });
/* 4. model values that exist (bind) */
const mt = t => U => fin((U.mt || {})[t]);
['1', '2', '3', '4', 'W'].forEach((e, i) => {
  const ai = ['AI0662', 'AI0661', 'AI0659', 'AI0660', 'AI0658'][i];
  R.push({ stn: 3, ai, tag: 'TT-FW1115-B' + e, v: mt('TT-FW1115-B' + e), rel: 'U.mt (AN_MT BFWP-B)', src: io(3) + ' ' + ai + '; unit.js AN_MT BFWP-B' });
});
['11', '12', '21', '22', '41', '42', '31', '32'].forEach((e, i) => {
  const ai = 'AI' + (1008 + i);
  R.push({ stn: 3, ai, tag: 'VT-FW1115-B' + e, v: mt('VT-FW1115-B' + e), rel: 'U.mt (AN_MT BFWP-B)', src: io(3) + ' ' + ai + '; unit.js AN_MT BFWP-B' });
});
R.push({ stn: 3, ai: 'AI0736', tag: 'TT-SW1501-BU', v: mt('TT-SW1501-BU'), rel: 'U.mt (AN_MT SWP-B)', src: io(3) + ' AI0736; unit.js AN_MT SWP-B' });
R.push({ stn: 3, ai: 'AI0758', tag: 'VT-SW1501-C2', v: mt('VT-SW1501-C2'), rel: 'U.mt (AN_MT SWP-C)', src: io(3) + ' AI0758; unit.js AN_MT SWP-C' });
for (const [ai, tag, k] of [
  ['AI0800', 'PT-SW1110-B1', 'swPiB'],
  ['AI0801', 'PT-SW1110-B2', 'swPoB'],
  ['AI0933', 'TT-SW1110-B1', 'swTiB'],
  ['AI0934', 'TT-SW1110-B2', 'swToB']
])
  R.push({ stn: 2, ai, tag, v: U => fin(U[k]), rel: 'U.' + k + ' (condenser sea water side B)', src: io(2) + ' ' + ai + '; unit.js sea water model' });
R.push({ stn: 3, ai: 'AI0434', tag: 'IT-P1503B', v: U => fin(U.swIb1), rel: 'U.swIb1 booster pump B current', src: io(3) + ' AI0434; unit.js sea water booster model' });
R.push({ stn: 3, ai: 'AI0435', tag: 'IT-P1503C', v: U => fin(U.swIb2), rel: 'U.swIb2 booster pump C current', src: io(3) + ' AI0435; unit.js sea water booster model' });
R.push({ stn: 3, ai: 'AI0465', tag: 'IT-P1116B', v: U => fin(U.cdI1), rel: 'U.cdI1 CEP-B current', src: io(3) + ' AI0465; unit.js condensate pump model' });
R.push({ stn: 2, ai: 'AI0854', tag: 'TT-CD1110-2', v: U => fin(U.cdT), rel: 'hotwell water = condenser saturation U.cdT', src: io(2) + ' AI0854; unit.js condenser model' });
R.push({ stn: 2, ai: 'AI0869', tag: 'TT-CD1110-3', v: U => fin(U.cdT), rel: 'condenser neck = exhaust saturation U.cdT', src: io(2) + ' AI0869; unit.js condenser model' });
R.push({ stn: 2, ai: 'AI0901', tag: 'TT-FW1010', v: U => fin(U.tSr), rel: 'storage tank water = deaerator saturation U.tSr (steam table)', src: io(2) + ' AI0901; unit.js deaerator model' });
R.push({ stn: 2, ai: 'AI0929', tag: 'TT-HD1102', v: U => fin((U.tt || {})['TT-HD1102']), rel: "U.tt['TT-HD1102'] drain out of No.2 LPH", src: io(2) + ' AI0929; unit.js anLphStep, PPE-14-0725 DCA' });
R.push({ stn: 2, ai: 'AI0930', tag: 'TT-HD1103', v: U => fin((U.tt || {})['TT-HD1103']), rel: "U.tt['TT-HD1103'] drain out of No.3 LPH", src: io(2) + ' AI0930; unit.js anLphStep, PPE-14-0725 DCA' });
R.push({
  stn: 2,
  ai: 'AI0419',
  tag: 'PT-HD1101',
  v: U => fin(((U.lpHt || {}).H1 || {}).Ps - 1.0332),
  rel: 'No.1 LPH shell U.lpHt.H1.Ps (kgf/cm2 A) - 1.0332 = gauge',
  src: io(2) + ' AI0419 "NO.1 LPH steam pressure"; unit.js AN_LP (design 0.354 kgf/cm2A x anHb x1)'
});
/* the transmitter shows its own range at most (alarm list FT.csv rows 12-13: FT-HD1102 0-27.5, FT-HD1103 0-15 t/h); the AI is on no
   sheet, so no AI block range clamps it */
const hdw = (k, hi) => U => {
  const w = fin(((U.hd || []).find(h => h.k === k) || {}).w1);
  return isFinite(w) ? Math.max(0, Math.min(hi, w)) : NaN;
};
R.push({ stn: 2, ai: 'AI0432', tag: 'FT-HD1102', v: hdw('H2', 27.5), rel: 'AN_HD H2 w1, the normal drain flow, within the range 0-27.5', src: io(2) + ' AI0432 "NO.2 LPH drain water flow"; PD-018 rev D (RB p12) HD-1-031 normal drain before LCV-HD1102-1; unit.js AN_HD mass balance' });
R.push({ stn: 2, ai: 'AI0433', tag: 'FT-HD1103', v: hdw('H3', 15), rel: 'AN_HD H3 w1, the normal drain flow, within the range 0-15', src: io(2) + ' AI0433 "NO.3 LPH drain water flow"; PD-018 rev D (RB p12) HD-1-021 normal drain before LCV-HD1103-1; unit.js AN_HD mass balance' });
R.push({
  stn: 5,
  ai: 'AI0064',
  tag: 'FT-MU0001',
  v: U => (Array.isArray(U.muQ) ? U.muQ.reduce((a, b) => a + (+b || 0), 0) : NaN),
  rel: 'sum of the make-up water pump flows U.muQ (AN_MU pump curves)',
  src: io(5) + ' AI0064 tag FT-MU0001 (the description column of this row repeats the fire pump text of AI0065); replaces the snapshot 28.6 of hmi-op.js'
});
/* 5. switches from model state */
let hh = false;
R.push({
  stn: 2,
  di: 1,
  tag: 'LSHH-CD1110',
  v: (U, X) => {
    const L = X.ai('2|AI0640');
    if (!isFinite(L)) return NaN;
    hh = hh ? L > 300 - 10 : L >= 300;
    return hh;
  },
  rel: 'hotwell level LT-CD1110 >= +300 mm (HHL 900 mm, normal 600 mm from the bottom), resets 10 mm below (the dead band DB0 of the plantsw level switches)',
  src: io(2) + ' I.0291; condenser outline K1AU3-D1-0-039 R1 p 4 (as plantsw LSLL-CD1110)'
});
/* sea water pump 6.6 kV VCB (K1AU3E1-0008, bus 1AM): ON = the DITL-29A copy runs (the soft starter closes the VCB to run, the protection
   relay opens it on a trip, so the run output is 0 on a trip), OFF = NOT ON (QA review 2026-11-25). The copy rows read the tag of their
   own pump (W.showText), so the tag holds each row to its pump */
for (const [L, on, off, sh] of [
  ['A', 'I.032E', 'I.032F', 'DITL-29A'],
  ['B', 'I.052A', 'I.052B', 'DITL-29A #B'],
  ['C', 'I.081E', 'I.081F', 'DITL-29A #C']
]) {
  /* beta.530 readers: the breaker is open on a field trip of the pump (X.ftrip) and on the black-out of bus 1AM (X.fault 'el.1am') */
  const vcb = X => {
    const r = X.ditlRun(sh);
    return r == null ? NaN : r === 1 && !X.ftrip(sh) && !X.fault('el.1am') ? 1 : 0;
  };
  R.push({ stn: 3, di: 1, tag: 'MIV-P1501' + L + '1', v: (U, X) => vcb(X), rel: 'VCB ON = ' + sh + ' running AND no field trip AND bus 1AM alive', src: io(3) + ' ' + on + '; DITL-29A HVP/SOFTSTARTER, K1AU3E1-0008' });
  R.push({
    stn: 3,
    di: 1,
    tag: 'MIV-P1501' + L + '2',
    v: (U, X) => {
      const x = vcb(X);
      return isFinite(x) ? 1 - x : NaN;
    },
    rel: 'VCB OFF = NOT ON',
    src: io(3) + ' ' + off + '; DITL-29A HVP/SOFTSTARTER, K1AU3E1-0008'
  });
}
/* condensate pump 6.6 kV VCB (DITL-61A / #B input rows): ON = the pump runs and its breaker is not opened by a field trip or a black-out
   (X.ftrip), OFF = NOT ON. The rows are on the drawing, so the field row drives them (by the tag of each copy) */
for (const [L, on, off, sh] of [
  ['A', 'I.0084', 'I.0085', 'DITL-61A'],
  ['B', 'I.0404', 'I.0405', 'DITL-61A #B']
]) {
  const vcb = X => {
    const r = X.ditlRun(sh);
    return r == null ? NaN : r === 1 && !X.ftrip(sh) ? 1 : 0;
  };
  R.push({ stn: 3, di: 1, tag: 'MIV-P1116' + L + '1', v: (U, X) => vcb(X), rel: 'VCB ON = ' + sh + ' running AND no field trip', src: io(3) + ' ' + on + ' "Condensate pump-' + L + ' VCB on"; DITL-61A input row' });
  R.push({
    stn: 3,
    di: 1,
    tag: 'MIV-P1116' + L + '2',
    v: (U, X) => {
      const x = vcb(X);
      return isFinite(x) ? 1 - x : NaN;
    },
    rel: 'VCB OFF = NOT ON',
    src: io(3) + ' ' + off + ' "Condensate pump-' + L + ' VCB off"; DITL-61A input row'
  });
}
/* the unit 460 V buses (TR-1B1 / TR-1B2, K1AU3-E1-0-307 load flow p A.14) are dead in the unit black-out (elec.js: BUS 1AM dead) */
R.push({ stn: 1, di: 1, tag: 'SIA-CDS01', v: (U, X) => (X.fault('el.1am') ? 0 : 1), rel: 'dosing AC main power normal = the unit 460 V bus alive (no black-out el.1am)', src: io(1) + ' I.012E "Dosing system AC main power normal"; K1AU3-E1-0-307 p A.14; elec.js 460 V buses dead with BUS 1AM' });
/* 6. field states (beta.530 FIELD.state): devices with no physics in the model. The instructor sets the abnormal state (Plant menu); the
   normal state is the documented service state */
const ST = [];
for (const [L, addr] of [
  ['A', 'I.0299'],
  ['B', 'I.029A']
])
  ST.push({
    id: 'FW1115-' + L + '.leak',
    tag: 'LS-FW1115-' + L,
    di: addr,
    normal: 0,
    t: 'BFWP-' + L + ' motor cooling water leakage',
    g: 'Feedwater and condensate',
    src: io(2) + ' ' + addr + ' "BFWP-' + L + ' motor cooling water leakage detector"; normal = no leak (no leak in the physics)'
  });
ST.push({ id: 'P1127.pit', tag: 'LSHH-P1127', di: 'I.017F', stn: 3, normal: 0, t: 'Transformer area pit level high high', g: 'Electrical and generator', src: io(3) + ' I.017F "Transformer area pit level switch high high"; normal = pit dry (no pit inflow model)' });
ST.push({
  id: 'LO1753.tank',
  tag: 'LSLL-LO1753',
  di: 'I.0699',
  stn: 3,
  normal: 0,
  t: 'PAF lube oil tank level low low',
  g: 'Air and flue gas',
  src: io(3) + ' I.0699; alarm list LS.csv 52-53 (tank 270 L, LSL < 240 L, LSLL < 200 L); fan manual p205 A-RF2-0581-100 (low 145 / low-low 85 mm); normal = tank full, no oil loss in the physics'
});
/* the chemical solution tanks (K1AU3-D1-0-035 R0 p11 / p18: Z-1103 200 L 685 ID x 720 H, Z-1105 100 L 484 ID x 720 H; switch heights alarm
   list LS.csv 34-42: CH1103 LL 0.09 / L 0.12 / H 0.48 m, CH1105 LL 0.10 / L 0.13 / H 0.53 m). No tank level model (parked): in service
   the level stands between L and H; the instructor sets low, low low or high */
for (const [n, what, LL, Lo, H, a] of [
  ['CH1103', 'Neutral amine solution tank', 0.09, 0.12, 0.48, ['I.0133', 'I.0134', 'I.0135']],
  ['CH1105', 'Carbon hydraride solution tank', 0.1, 0.13, 0.53, ['I.0136', 'I.0137', 'I.0138']]
]) {
  const doc = '; K1AU3-D1-0-035 R0 p11 / p18; alarm list LS.csv 34-42 (LL ' + LL + ' / L ' + Lo + ' / H ' + H + ' m)';
  ST.push({ id: n + '.ll', tag: 'LSLL-' + n, di: a[0], stn: 1, normal: 0, t: what + ' level low low', g: 'Feedwater and condensate', src: io(1) + ' ' + a[0] + doc });
  ST.push({ id: n + '.lo', tag: 'LSL-' + n, di: a[1], stn: 1, normal: 0, t: what + ' level low', g: 'Feedwater and condensate', src: io(1) + ' ' + a[1] + doc });
  ST.push({ id: n + '.hi', tag: 'LSH-' + n, di: a[2], stn: 1, normal: 0, t: what + ' level high', g: 'Feedwater and condensate', src: io(1) + ' ' + a[2] + doc });
}
/* dosing pump trips (no trip in the physics; the pumps are FIELD equipment, source.js AN_SRC.field): normal = no trip */
for (const [stn, addr, tag, what] of [
  [1, 'I.0121', 'MIT-Z1107A', 'Tri-sodium phosphate dosing pump-A trip'],
  [1, 'I.0123', 'MIT-Z1107B', 'Tri-sodium phosphate dosing pump-B trip'],
  [1, 'I.0125', 'MIT-Z1108A', 'Neutral amine dosing pump-A electric trouble'],
  [1, 'I.0127', 'MIT-Z1108B', 'Neutral amine dosing pump-B electric trouble'],
  [1, 'I.0129', 'MIT-Z1109A', 'Carbon hydraride dosing pump-A trip'],
  [1, 'I.012B', 'MIT-Z1109B', 'Carbon hydraride dosing pump-B trip'],
  [1, 'I.012D', 'MIT-Z1101A', 'Tri-sodium phosphate agitator trip'],
  [5, 'I.032E', 'MIT-P0761A', 'Hypo-chlorinated dosing system unloading pump-A overload'],
  [5, 'I.0121', 'MIT-P0761B', 'Hypo-chlorinated dosing system unloading pump-B overload']
])
  ST.push({ id: tag.slice(4) + '.trip', tag, di: addr, stn, normal: 0, t: what, g: 'Other', src: io(stn) + ' ' + addr + ' "' + what + '"; normal = no trip' });
/* breaker positions of the PAF circulating oil panel and the hypochlorite power (a breaker does not open on a dead bus; the bus of the
   hypochlorite system is not in the documents searched, so its power is a field state): normal = closed / power present */
ST.push({ id: 'LO1753.ctl', tag: 'MIA-LO1753-1', di: 'I.065B', stn: 3, normal: 0, t: 'PAF circulating oil system control power switch off', g: 'Air and flue gas', src: io(3) + ' I.065B "PAF circulating oil system control power auxiliary switch off"; normal = switch on' });
ST.push({ id: 'LO1753.nfb2', tag: 'MIA-LO1753-2', di: 'I.065C', stn: 3, normal: 1, t: 'PAF circulating oil system NFB2 off', g: 'Air and flue gas', src: io(3) + ' I.065C "PAF circulating oil system NFB2 auxiliary switch not off"; normal = NFB closed (1)' });
ST.push({ id: 'LO1753.nfb1', tag: 'MIA-LO1753-3', di: 'I.065D', stn: 3, normal: 1, t: 'PAF circulating oil system NFB1 off', g: 'Air and flue gas', src: io(3) + ' I.065D "PAF circulating oil system NFB1 auxiliary switch not off"; normal = NFB closed (1)' });
ST.push({ id: 'HC0001.power', tag: 'MIA-HC0001', di: 'I.032F', stn: 5, normal: 1, t: 'Hypo-chlorinated dosing system AC main power fail', g: 'Other', src: io(5) + ' I.032F "Hypo-chlorinated dosing system AC main power not fail"; normal = power present (1)' });
FIELD.state(
  lane,
  ST.map(({ id, tag, normal, t, g, src }) => ({ id, tag, normal, t, g, src }))
);
for (const x of ST) {
  /* a level below low low is below low too: LSL follows the low low state as well */
  const ll = /\.lo$/.test(x.id) ? x.id.replace(/\.lo$/, '.ll') : null;
  R.push({
    stn: x.stn || 2,
    di: 1,
    tag: x.tag,
    v: (U, X) => {
      const a = X.state(x.id),
        b = ll ? X.state(ll) : 0;
      return a == null ? NaN : a || b ? 1 : 0;
    },
    rel: 'field state ' + x.id + (ll ? ' OR ' + ll : '') + ' (normal ' + x.normal + ')',
    src: x.src
  });
}
FIELD.add(lane, R);
