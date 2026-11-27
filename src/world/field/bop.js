/* src/world/field/bop.js: LANE 4 DCS LINKS BOP (RARA). Field signals of the balance of plant (src/world/field/README.md).
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
  [2, 'AI0705', 'ZT-CW1201', 'ABC-053', 'TICLO1002', 'TCV-CW1201 lube oil temperature, item 40'],
  [2, 'AI0386', 'ZT-AS1030', 'ABC-056', 'PICCD1104', 'PCV-AS1030 deaerator pegging steam (AO0403 on ABC-056)'],
  [2, 'AI0388', 'ZT-SB1053', 'ABC-017', 'PICSB1052', 'PCV-SB1053 sootblower steam supply pressure, item 9 (loop list STN104 row 73 ZISB1053)']
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
/* 2. limit switches: end of travel (K1AU3-E2-0-123 R1 "Limit Switches: OMRON D4A-2502N (1 Open & 1 Closed)"). All 11 are air-operated
   valves with a positioner, so they use the one app rule of plantsw.js (WORLD.endBand: closed <= 2 %, open >= 98 %), not a copy */
const END = () => (G.WORLD && G.WORLD.endBand) || null;
const zt = t => {
  /* PCV-AS1010 (main steam to aux steam, AO0580 on ABC-030 PICAS1004): its ZT-AS1010 (AI0387) is written on ABC-030 by the model, so the
     switches read the same opening, not a second ZT row */
  if (t === 'PCV-AS1010') return (U, X) => open(X, 'ABC-030', 'PICAS1004');
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
  ['I.0897', 'ZSC-CD1126', 'ZT-CD1126', 0],
  ['I.0042', 'ZSO-AS1010', 'PCV-AS1010', 1],
  ['I.0043', 'ZSC-AS1010', 'PCV-AS1010', 0]
]) {
  const f = zt(z);
  R.push({
    stn: 2,
    di: 1,
    tag,
    v: (U, X) => {
      const p = f(U, X),
        e = END();
      return isFinite(p) && e ? (o ? p >= e.open : p <= e.closed) : NaN;
    },
    rel: (o ? 'open limit: ' : 'closed limit: ') + z + (o ? ' >= WORLD.endBand.open (98 %)' : ' <= WORLD.endBand.closed (2 %)'),
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
  ['AI0448', 'PT-SW1110-A1', 'swPiA'],
  ['AI0449', 'PT-SW1110-A2', 'swPoA'],
  ['AI0805', 'TT-SW1110-A1', 'swTiA'],
  ['AI0806', 'TT-SW1110-A2', 'swToA'],
  ['AI0800', 'PT-SW1110-B1', 'swPiB'],
  ['AI0801', 'PT-SW1110-B2', 'swPoB'],
  ['AI0933', 'TT-SW1110-B1', 'swTiB'],
  ['AI0934', 'TT-SW1110-B2', 'swToB']
])
  R.push({ stn: 2, ai, tag, v: U => fin(U[k]), rel: 'U.' + k + ' (condenser sea water side ' + tag.slice(-2, -1) + ')', src: io(2) + ' ' + ai + '; unit.js sea water model' });
/* condensate water pressure low switch (STN102 I.0049; on no DITL row: alarm and HMI): made below 15.5 kg/cm2 of the pump discharge header
   pressure of the model (U.cdPd, the PT-CD1117 value). The I.0049 on DITL-03B is the station 103 address (MIS-F1055A FA blower A stopped) */
R.push({ stn: 2, di: 1, tag: 'PS-CD1117', v: U => (isFinite(U.cdPd) ? (U.cdPd < 15.5 ? 1 : 0) : NaN), rel: 'U.cdPd < 15.5 kg/cm2 (condensate pump discharge pressure)',
  src: io(2) + ' I.0049 "#1 Condensate water pressure switch low"; Alarm List 20160912 sheet PS: PS-CD1117 stn 102 I.0049 set L 15.5; unit.js AN_CD cdPd' });
/* plant air to unit 1 pressure low switch (STN104 I.052A; alarm list PS set L 2.8 kg/cm2): the unit header of the air model (U.paPU, the
   PT-PA1705 value) */
R.push({ stn: 4, di: 1, tag: 'PSL-PA1705', v: U => (isFinite(U.paPU) ? (U.paPU < 2.8 ? 1 : 0) : NaN), rel: 'U.paPU < 2.8 kg/cm2', src: io(4) + ' I.052A; alarm list PS (PD-023 3/6) set L 2.8; unit.js AN_AIR paPU' });
/* expansion tank level low low switch (STN103 I.053F; alarm list LS LL 300 mm; DITL-76 / 77 row 26 "< 0.3 M"): U.etLvl (m) */
R.push({ stn: 3, di: 1, tag: 'LSLL-CW1109', v: U => (isFinite(U.etLvl) ? (U.etLvl <= 0.3 ? 1 : 0) : NaN), rel: 'U.etLvl <= 0.3 m', src: io(3) + ' I.053F; alarm list LS (PD-021) LL 300 mm; unit.js AN_ACW etLvl' });
R.push({ stn: 3, ai: 'AI0433', tag: 'IT-P1503A', v: U => fin(U.swIb0), rel: 'U.swIb0 booster pump A current', src: io(3) + ' AI0433; unit.js sea water booster model' });
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
  src: io(2) + ' AI0419 "NO.1 LPH steam pressure"; unit.js AN_LP (design 0.354 kgf/cm2A x turbine.js anTbPx x1)'
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
/* BFWP 6.6 kV VCB (K1AU3E1-0008, bus 1AM): ON = the DITL-23A copy runs and its breaker is not opened by a field trip or the black-out,
   OFF = NOT ON (as the sea water pumps above) */
for (const [L, on, off, sh] of [
  ['A', 'I.005A', 'I.005B', 'DITL-23A'],
  ['B', 'I.037A', 'I.037B', 'DITL-23A #B']
]) {
  const vcb = X => {
    const r = X.ditlRun(sh);
    return r == null ? NaN : r === 1 && !X.ftrip(sh) && !X.fault('el.1am') ? 1 : 0;
  };
  R.push({ stn: 3, di: 1, tag: 'MIV-P1115' + L + '1', v: (U, X) => vcb(X), rel: 'VCB ON = ' + sh + ' running AND no field trip AND bus 1AM alive', src: io(3) + ' ' + on + ' "BFWP-' + L + ' VCB on"; K1AU3E1-0008' });
  R.push({
    stn: 3,
    di: 1,
    tag: 'MIV-P1115' + L + '2',
    v: (U, X) => {
      const x = vcb(X);
      return isFinite(x) ? 1 - x : NaN;
    },
    rel: 'VCB OFF = NOT ON',
    src: io(3) + ' ' + off + ' "BFWP-' + L + ' VCB off"; K1AU3E1-0008'
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
/* hypochlorite dosing AC main power (STN105 I.032F MIA-HC0001 "not fail"). Feeder: K1AU3E1-0052 rev 2 (as built) water treatment area 460 V
   system WTX-B, feeder CD-PS "PUMP STATION CHEMICAL DOSING SYSTEM" 5 kW 9.8 A, MCCB 20AT. Chain (K1AU3E1-0014 rev 2): WTX-B <- ACBWT <-
   TR-WTX1 6.6 kV / 460 V 2000 kVA <- VCB WTX3 <- 6.6 kV bus WTX <- 1A23 through WTX1M (N.C., K1AU3E1-0009); the other feeder 2A5 through
   WTX2M is N.O. (K1AU3E1-0010) and closed by hand only. So the panel is dead in the unit black-out of bus 1A (el.1am) until WTX2M is closed
   by hand (not in the model). Panel = CD-PS: derived, no drawing prints HC0001; the hypochlorite package (LIMAY-D1-41-0, Taiwan Nikkiso
   QU15-1064) is part of the sea water intake, at the pump station, and CD-PS is the only chemical dosing feeder there (YUA search
   2026-11-25; no feeder in K1AU3-E1-0-107, E1-0033, 0034, 0036 / 0037, 0045, 0053, 0073) */
R.push({ stn: 5, di: 1, tag: 'MIA-HC0001', v: (U, X) => (X.fault('el.1am') ? 0 : 1), rel: 'power not fail = bus WTX alive through WTX1M from 1A23 (no black-out el.1am)', src: io(5) + ' I.032F; K1AU3E1-0052 rev 2 feeder CD-PS; K1AU3E1-0014 rev 2; K1AU3E1-0009 / 0010' });
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
  ['CH1101', 'Tri-sodium phosphate solution tank', null, null, null, ['I.0130', 'I.0131', 'I.0132']],
  ['CH1103', 'Neutral amine solution tank', 0.09, 0.12, 0.48, ['I.0133', 'I.0134', 'I.0135']],
  ['CH1105', 'Carbon hydraride solution tank', 0.1, 0.13, 0.53, ['I.0136', 'I.0137', 'I.0138']]
]) {
  const doc = LL == null ? '; K1AU3-D1-0-035 (tri-sodium phosphate tank Z-1101); switch heights not in the alarm list rows read' : '; K1AU3-D1-0-035 R0 p11 / p18; alarm list LS.csv 34-42 (LL ' + LL + ' / L ' + Lo + ' / H ' + H + ' m)';
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
  [5, 'I.0121', 'MIT-P0761B', 'Hypo-chlorinated dosing system unloading pump-B overload'],
  [5, 'I.032A', 'MIT-P0762A', 'Hypo-chlorinated dosing system NaOCl dosing pump-A overload'],
  [5, 'I.032C', 'MIT-P0762B', 'Hypo-chlorinated dosing system NaOCl dosing pump-B overload']
])
  ST.push({ id: tag.slice(4) + '.trip', tag, di: addr, stn, normal: 0, t: what, g: 'Chemical dosing', src: io(stn) + ' ' + addr + ' "' + what + '"; normal = no trip' });
/* BFWP lube oil tank level switch low (KSB forced oil system of the pump; no oil inventory in the physics): normal = level above low */
for (const [L, addr] of [['A', 'I.0093'], ['B', 'I.0413']])
  ST.push({ id: 'LO1115-' + L + '.lo', tag: 'LS-LO1115-' + L, di: addr, stn: 3, normal: 0, t: 'BFWP-' + L + ' lube oil level low', g: 'Feedwater and condensate', src: io(3) + ' ' + addr + ' "Lube oil of BFWP-' + L + ' level switch low"; normal = no oil loss' });
/* AKIHO alarm switches (alarm list 20160912): devices with no physics in the model. Coal feeder air tank pressure switches high / low:
   the instrument air supply is unlimited (user rule 2026-11-25), so normal = pressure in band (setpoints "BY VENDOR"); FA blower inlet
   filter DP high: no filter fouling in the physics; industrial water tank level low: the tank is fed from the water treatment plant
   (excluded, unlimited) */
for (const [x, hi, lo] of [['A', 'I.013E', 'I.013F'], ['B', 'I.045E', 'I.045F'], ['C', 'I.049E', 'I.049F']]) {
  ST.push({ id: 'IA1061-' + x + '.hi', tag: 'PS-IA1061-' + x + '1', di: hi, stn: 4, normal: 0, t: 'Coal feeder ' + x + ' air tank pressure high', g: 'Coal and limestone', src: io(4) + ' ' + hi + '; alarm list PS (PD-052, set by vendor); normal = in band' });
  ST.push({ id: 'IA1061-' + x + '.lo', tag: 'PS-IA1061-' + x + '2', di: lo, stn: 4, normal: 0, t: 'Coal feeder ' + x + ' air tank pressure low', g: 'Coal and limestone', src: io(4) + ' ' + lo + '; alarm list PS (PD-052, set by vendor); normal = in band' });
}
for (const [x, addr] of [['A', 'I.0094'], ['B', 'I.0414']])
  ST.push({ id: 'FA1055-' + x + '.filter', tag: 'DPSH-FA1055-' + x, di: addr, stn: 3, normal: 0, t: 'FA blower ' + x + ' inlet filter DP high', g: 'Air and flue gas', src: io(3) + ' ' + addr + '; alarm list DPS (PD-054); normal = clean filter' });
ST.push({ id: 'IW0714.lo', tag: 'LS-IW0714', di: 'I.001F', stn: 5, normal: 0, t: 'Industrial water tank level low', g: 'Water, waste water and fire', src: io(5) + ' I.001F; alarm list LS (PD-025, LL 1 m / 0.2 m); normal = tank filled by the water treatment plant (unlimited)' });
/* Phase 9 (2026-11-26): the inputs shown on the HX pages that no sheet reads and no model drives. Electric trouble of the industrial water,
   waste water and transformer pit pumps: no electrical fault in the physics, normal = no trouble */
for (const [stn, addr, tag, what] of [
  [5, 'I.0007', 'MIT-P0715A', 'Industrial water pump-A electric trouble'],
  [5, 'I.0327', 'MIT-P0715B', 'Industrial water pump-B electric trouble'],
  [5, 'I.000A', 'MIT-P0058A', 'Waste water pump-A electric trouble'],
  [5, 'I.001D', 'MIT-P0058B', 'Waste water pump-B electric trouble'],
  [3, 'I.017E', 'MIT-P1127', 'Transformer area pit submerge pump electric trouble']
])
  ST.push({ id: tag.slice(4) + '.trip', tag, di: addr, stn, normal: 0, t: what, g: 'Water, waste water and fire', src: io(stn) + ' ' + addr + ' "' + what + '"; normal = no trouble' });
/* fire water tank level low: the tank is filled from the water treatment plant (excluded, unlimited), as LS-IW0714 (INFERRED: same supply) */
ST.push({ id: 'IW0724.lo', tag: 'LS-IW0724', di: 'I.0018', stn: 5, normal: 0, t: 'Fire water tank level low', g: 'Water, waste water and fire', src: io(5) + ' I.0018 "Fire water tank level switch low"; normal = tank filled by the water treatment plant (INFERRED, as LS-IW0714)' });
/* pits and the hypochlorite unloading: no rain, no leak and no truck in the model. Normal (INFERRED): the waste water pit below its high
   high switch, the transformer area pit dry (its submerge pump stopped), the unloading pump B stopped (it runs only while a truck
   unloads, from its local panel: hx-page-sea-water.js) */
ST.push({ id: 'P0058.hh', tag: 'LSHH-P0058', di: 'I.001A', stn: 5, normal: 0, t: 'Waste water pit level high high', g: 'Water, waste water and fire', src: io(5) + ' I.001A "Waste water pit level switch high high"; normal = no high high (INFERRED: no inflow model)' });
ST.push({ id: 'P1127.run', tag: 'MIR-P1127', di: 'I.017D', stn: 3, normal: 0, t: 'Transformer area pit submerge pump running', g: 'Water, waste water and fire', src: io(3) + ' I.017D "Transformer area pit submerge pump running"; normal = pit dry, pump stopped (INFERRED: no rain model)' });
ST.push({ id: 'P0761B.run', tag: 'MIR-P0761B', di: 'I.0120', stn: 5, normal: 0, t: 'Hypochlorite unloading pump-B running', g: 'Chemical dosing', src: io(5) + ' I.0120 (beside MIT-P0761B I.0121 overload); normal = no unloading (INFERRED: runs only while a truck unloads)' });
/* BFWP suction manual valves: a running or stand-by boiler feed pump has its suction valve open (a pump cannot run on a shut suction), so
   normal = open */
for (const [L, addr] of [['A', 'I.028F'], ['B', 'I.032F']])
  ST.push({ id: 'FW103' + (L === 'A' ? 1 : 2) + '.open', tag: 'ZSO-FW103' + (L === 'A' ? 1 : 2), di: addr, stn: 2, normal: 1, t: 'BFWP-' + L + ' suction manual valve open', g: 'Feedwater and condensate', src: io(2) + ' ' + addr + ' "#1 BFWP-' + L + ' suction manual valve open"; normal = open (pump in service or stand-by)' });
/* generator breaker 52G1 in REMOTE: the DCS closes it through the auto synchronizing (DITL-115 AUTO SYNCHRONIZE START COMMAND, TCS-DO1006),
   which works only with the breaker in REMOTE (INFERRED) */
ST.push({ id: '52G1.rem', tag: 'MIL-52G1', di: 'I.0930', stn: 2, normal: 1, t: 'GCB 52G1 remote', g: 'Electrical and generator', src: io(2) + ' I.0930 "#1 GCB 52G1 remote"; normal = REMOTE (INFERRED: the auto synchronizing of the DCS closes it)' });
/* breaker positions of the PAF circulating oil panel (a breaker does not open on a dead bus): normal = closed */
ST.push({ id: 'LO1753.ctl', tag: 'MIA-LO1753-1', di: 'I.065B', stn: 3, normal: 0, t: 'PAF circulating oil system control power switch off', g: 'Air and flue gas', src: io(3) + ' I.065B "PAF circulating oil system control power auxiliary switch off"; normal = switch on' });
ST.push({ id: 'LO1753.nfb2', tag: 'MIA-LO1753-2', di: 'I.065C', stn: 3, normal: 1, t: 'PAF circulating oil system NFB2 off', g: 'Air and flue gas', src: io(3) + ' I.065C "PAF circulating oil system NFB2 auxiliary switch not off"; normal = NFB closed (1)' });
ST.push({ id: 'LO1753.nfb1', tag: 'MIA-LO1753-3', di: 'I.065D', stn: 3, normal: 1, t: 'PAF circulating oil system NFB1 off', g: 'Air and flue gas', src: io(3) + ' I.065D "PAF circulating oil system NFB1 auxiliary switch not off"; normal = NFB closed (1)' });
/* fire fighting pumps (DITL-87 rows 24 / 26, LOCATION FFS = the fire fighting system panel; that system is not in the DCS and not in the
   model): the DCS only reads their running contacts. Normal = not running (no fire demand): DITL-87 out 27 "ANY FIRE PUMP RUNNING & FIRE
   TANK LEVEL < 50%" is an annunciator (CRT ANN), so a running fire pump is an abnormal state. The jockey pump P-0720 (I.033C) starts and
   stops on the header pressure in its own controller (package, EE); the DCS only reads it. Its screen message (StsChange sheet of STN105,
   "Fire sys jockey p. stop", process alarm on OFF; PC read 2026-11-26) makes running the normal state: normal 1, the instructor sets it off */
[
  ['I.0338', 'MIR-P0719', 'Fire pump P-0719 (motor driven) running', 'DITL-87 row 24'],
  ['I.033A', 'MIR-P0718', 'Fire pump P-0718 (diesel engine driven) running', 'DITL-87 row 26']
].forEach(([addr, tag, what, row]) =>
  ST.push({ id: tag.slice(4) + '.run', tag, di: addr, stn: 5, normal: 0, t: what, g: 'Water, waste water and fire', src: io(5) + ' ' + addr + ' "' + what + '"; ' + row + '; DITL-87 out 27 (ANN) = running is abnormal' })
);
ST.push({ id: 'P0720.run', tag: 'MIR-P0720', di: 'I.033C', stn: 5, normal: 1, t: 'Fire jockey pump P-0720 running', g: 'Water, waste water and fire', src: io(5) + ' I.033C "Fire fighting system fire motor driven jockey pump running"; STN105 screen message: alarm on stop' });
/* the CEMS common alarm (I.001F, STN101, CEMS panel contact): the screen raises a process alarm on ON (StsChange sheet of STN101), so 0 in
   service; the CEMS own list of causes (K1AU3-E2-0-124) was not read: one state for the instructor */
ST.push({ id: 'FG1057.cems', tag: 'LI1-FG1057', di: 'I.001F', stn: 1, normal: 0, t: 'CEMS common alarm', g: 'Air and flue gas', src: io(1) + ' I.001F "#1 CEMS common alarm"; STN101 screen message: alarm on ON' });
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
