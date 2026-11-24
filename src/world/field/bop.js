/* src/world/field/bop.js: LANE 4 DCS LINKS BOP (RARA), beta.494. Field signals of the balance of plant (src/world/field/README.md).
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
const hdw = k => U => fin(((U.hd || []).find(h => h.k === k) || {}).w1);
R.push({ stn: 2, ai: 'AI0432', tag: 'FT-HD1102', v: hdw('H2'), rel: 'AN_HD H2 w1, the normal (cascade) drain flow', src: io(2) + ' AI0432 "NO.2 LPH drain water flow"; unit.js AN_HD mass balance' });
R.push({ stn: 2, ai: 'AI0433', tag: 'FT-HD1103', v: hdw('H3'), rel: 'AN_HD H3 w1, the normal (cascade) drain flow', src: io(2) + ' AI0433 "NO.3 LPH drain water flow"; unit.js AN_HD mass balance' });
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
  const vcb = X => {
    const r = X.ditlRun(sh);
    return r == null ? NaN : r === 1 ? 1 : 0;
  };
  R.push({ stn: 3, di: 1, tag: 'MIV-P1501' + L + '1', v: (U, X) => vcb(X), rel: 'VCB ON = ' + sh + ' running', src: io(3) + ' ' + on + '; DITL-29A HVP/SOFTSTARTER, K1AU3E1-0008' });
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
FIELD.add(lane, R);
