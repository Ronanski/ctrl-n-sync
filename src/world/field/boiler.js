/* Lane 3 DCS LINKS BOILER (KIRARA), field signals of the boiler side (src/world/field/README.md). Each row reads engine state only and
   writes the I/O point of the I/O list (src/data/ades.txt, station / address / tag). rel = how the value follows from the state,
   src = the drawing or list row. Worklist and the paper derivation: lane 3 worklist 2026-11-25 sections 7 and 10, field signals paper rev 1.
   End-of-travel rule of the app's motor valves (src/digital/parts/03b-sim.js mvForced / fld: ZSO = position >= 100 %, ZSC = position
   <= 0 %): the same rule for every limit switch below, no new threshold. */
const num = v => (v == null || !isFinite(+v) ? NaN : +v);
const closed = v => (isFinite(v) ? v <= 0 : NaN);
const opened = v => (isFinite(v) ? v >= 100 : NaN);
const rows = [];

/* 1. Sootblower steam supply motor valve MV-SB1001 (DITL-80S, STN102). DITL-80S rows 6 / 22 read the full open contact ZSO I.024A from
   the valve; the full closed contact and the position transmitter are on no logic row (HMI only) and are the same valve state. */
rows.push(
  { stn: 2, di: 1, tag: 'ZSC-SB1001', v: (U, X) => closed(num(X.ditlPos('DITL-80S', 0))), rel: 'MV-SB1001 at 0 % travel (closed limit)',
    src: 'IO list STN102 I.024B ZSC-SB1001; DITL-80S MV-SB1001; MOV rule 03b-sim.js' },
  { stn: 2, ai: 'AI0770', tag: 'ZT-SB1001', v: (U, X) => num(X.ditlPos('DITL-80S', 0)), rel: 'MV-SB1001 position 0 ~ 100 %',
    src: 'IO list STN102 AI0770 ZT-SB1001; DITL-80S MV-SB1001' }
);

/* 2. Furnace temperature control dampers FA1005 ~ FA1026 (STN103: front wall FA1005 ~ 1018 on ABC-015 / 016, rear wall FA1019 ~ 1026 on ABC-016): the open / closed limit switches of each motor damper. The damper
   position is its own position transmitter ZT-FA10xx (AI0544 ~ AI0566, on ABC-015 / 016 following MCV-FA10xx). */
[
  [1005, 'I.0330', 'I.0331', 'AI0544'], [1006, 'I.0335', 'I.0336', 'AI0545'], [1007, 'I.033A', 'I.033B', 'AI0546'],
  [1008, 'I.0720', 'I.0721', 'AI0547'], [1009, 'I.0725', 'I.0726', 'AI0548'], [1010, 'I.072A', 'I.072B', 'AI0549'],
  [1011, 'I.0730', 'I.0731', 'AI0550'], [1012, 'I.0735', 'I.0736', 'AI0560'], [1013, 'I.073A', 'I.073B', 'AI0561'],
  [1014, 'I.0800', 'I.0801', 'AI0562'], [1015, 'I.0805', 'I.0806', 'AI0563'], [1016, 'I.080A', 'I.080B', 'AI0564'],
  [1017, 'I.0810', 'I.0811', 'AI0565'], [1018, 'I.0815', 'I.0816', 'AI0566'],
  /* rear wall dampers FA1019 ~ FA1026 (ABC-016, ZT-FA1019 ~ 1026 AI0416 ~ AI0423) */
  [1019, 'I.0000', 'I.0001', 'AI0416'], [1020, 'I.0005', 'I.0006', 'AI0417'], [1021, 'I.000A', 'I.000B', 'AI0418'],
  [1022, 'I.0010', 'I.0011', 'AI0419'], [1023, 'I.0015', 'I.0016', 'AI0420'], [1024, 'I.001A', 'I.001B', 'AI0421'],
  [1025, 'I.0320', 'I.0321', 'AI0422'], [1026, 'I.0325', 'I.0326', 'AI0423']
].forEach(([n, o, c, z]) => {
  const zt = X => num(X.ai('3|' + z));
  rows.push(
    { stn: 3, di: 1, tag: 'ZSO-FA' + n, v: (U, X) => opened(zt(X)), rel: 'ZT-FA' + n + ' at 100 % (open limit)',
      src: 'IO list STN103 ' + o + ' ZSO-FA' + n + '; ZT-FA' + n + ' STN103 ' + z + ' (ABC-015 / 016); MOV rule' },
    { stn: 3, di: 1, tag: 'ZSC-FA' + n, v: (U, X) => closed(zt(X)), rel: 'ZT-FA' + n + ' at 0 % (closed limit)',
      src: 'IO list STN103 ' + c + ' ZSC-FA' + n + '; ZT-FA' + n + ' STN103 ' + z + ' (ABC-015 / 016); MOV rule' }
  );
});

/* 3. Burner hot secondary air dampers FA1043-A ~ D: the closed limit (STN104) of the damper whose position transmitter is on STN101
   (ABC-003A ~ D). The open limit ZSO-FA1043-x is linked already (DITL-16). */
[['A', 'I.0017', 'AI0291'], ['B', 'I.0337', 'AI0437'], ['C', 'I.0657', 'AI0582'], ['D', 'I.0977', 'AI0629']].forEach(([x, c, z]) =>
  rows.push({ stn: 4, di: 1, tag: 'ZSC-FA1043-' + x, v: (U, X) => closed(num(X.ai('1|' + z))), rel: 'ZT-FA1043-' + x + ' at 0 % (closed limit)',
    src: 'IO list STN104 ' + c + ' ZSC-FA1043-' + x + '; ZT-FA1043-' + x + ' STN101 ' + z + '; MOV rule' })
);

/* 3b. Hot reheat steam blow-off motor valve MV-HR1391 (ABC-054 PICHR1391, STN102 position ZT-HR1391 AI0737): its open / closed limit
   switches (Phase 6, YUA PDF read 2026-11-26: memory list 102 WM 3588 / 3589 M.3222 / M.3223 "valve open / close", no logic sheet reads
   them; display only). Same MOV rule. */
rows.push(
  { stn: 2, di: 1, tag: 'ZSO-HR1391', v: (U, X) => opened(num(X.ai('2|AI0737'))), rel: 'ZT-HR1391 at 100 % (open limit)',
    src: 'IO list STN102 I.000A ZSO-HR1391; ZT-HR1391 STN102 AI0737 (ABC-054); memory list 102 M.3222; MOV rule' },
  { stn: 2, di: 1, tag: 'ZSC-HR1391', v: (U, X) => closed(num(X.ai('2|AI0737'))), rel: 'ZT-HR1391 at 0 % (closed limit)',
    src: 'IO list STN102 I.000B ZSC-HR1391; ZT-HR1391 STN102 AI0737 (ABC-054); memory list 102 M.3223; MOV rule' }
);

/* 3c. HP / LP turbine bypass valves PCV-MS1020 / PCV-HR1010 (STN102, positions ZT-MS1020 AI0384 on ABC-050 / DITL-03H, ZT-HR1010
   AI0385 on ABC-052 / DITL-03H): the limit switches that no sheet reads (YUA PDF read 2026-11-26 section C: the sheets use ZSC-MS1020
   I.0081 on DITL-115-16 and the positions). Display only; same end-of-travel rule. */
rows.push(
  { stn: 2, di: 1, tag: 'ZSO-MS1020', v: (U, X) => opened(num(X.ai('2|AI0384'))), rel: 'ZT-MS1020 at 100 % (open limit)',
    src: 'IO list STN102 I.0080 ZSO-MS1020; ZT-MS1020 STN102 AI0384 (ABC-050); MOV rule' },
  { stn: 2, di: 1, tag: 'ZSO-HR1010', v: (U, X) => opened(num(X.ai('2|AI0385'))), rel: 'ZT-HR1010 at 100 % (open limit)',
    src: 'IO list STN102 I.0082 ZSO-HR1010; ZT-HR1010 STN102 AI0385 (ABC-052); MOV rule' },
  { stn: 2, di: 1, tag: 'ZSC-HR1010', v: (U, X) => closed(num(X.ai('2|AI0385'))), rel: 'ZT-HR1010 at 0 % (closed limit)',
    src: 'IO list STN102 I.0083 ZSC-HR1010; ZT-HR1010 STN102 AI0385 (ABC-052); MOV rule' }
);

/* 4. Biasing damper air buffer tanks PT-IA1064-A / B (STN104): on P&ID PD-023 sheet 6/6 (over-all instrument list), filled from the
   instrument air to unit 1 (IA1706, unit.js AN_AIR U.iaPU). The tank only fills the damper actuators: no flow through its inlet = no
   friction drop, so the tank is at the header pressure. */
rows.push(
  { stn: 4, ai: 'AI0438', tag: 'PT-IA1064-A', v: U => num(U.iaPU), rel: 'no flow out of the tank: tank pressure = unit 1 instrument air header',
    src: 'IO list STN104 AI0438 PT-IA1064-A; P&ID PD-023 6/6; unit.js AN_AIR iaPU' },
  { stn: 4, ai: 'AI0470', tag: 'PT-IA1064-B', v: U => num(U.iaPU), rel: 'no flow out of the tank: tank pressure = unit 1 instrument air header',
    src: 'IO list STN104 AI0470 PT-IA1064-B; P&ID PD-023 6/6; unit.js AN_AIR iaPU' }
);

/* 5. Cyclone-A inlet gas TT-FG1092-A (STN101): the cyclone inlet duct is the furnace outlet (P&ID PD-051), so the gas is the furnace exit
   gas of the bed model (unit.js U.tgF), which already takes the duct refractory into account. */
rows.push({ stn: 1, ai: 'AI0659', tag: 'TT-FG1092-A', v: U => num(U.tgF), rel: 'furnace exit gas = gas into cyclone A',
  src: 'IO list STN101 AI0659 TT-FG1092-A; P&ID PD-051; unit.js U.tgF' });

/* 6. Backpass gas thermocouples (STN104), P&ID K1AU3-PD-051 "Combustion air / flue gas system" (RA page 42), on the gas leaving each bank
   of the heat exchanger chain (hx.js U.hxO.gBank). The gas meets the LAST index first: RH pass rh[3] -> rh[0] -> No.2 eco R; SH pass
   fsh[2] -> fsh[0] -> No.3 eco -> No.2 eco S. A thermocouple between two banks reads the gas leaving the bank before it. TT-FG1109
   (between ECO #3 upper and lower; hx.js runs ECO #3 as one bank) = gBank.e3m, the same bank solution at half its surface. */
const gb = (U, k, i) => {
  const g = U.hxO && U.hxO.gBank;
  return num(g && (i == null ? g[k] : g[k] && g[k][i]));
};
[
  ['TT-FG1100', 'AI0448', 'wl', null, 'above RH bank 1: gas leaving the backpass walls'],
  ['TT-FG1102', 'AI0449', 'rh', 3, 'between RH banks 1 and 2: gas leaving RH bank 1'],
  ['TT-FG1104', 'AI0464', 'rh', 2, 'between RH banks 2 and 3: gas leaving RH bank 2'],
  ['TT-FG1106', 'AI0465', 'rh', 1, 'between RH banks 3 and 4: gas leaving RH bank 3'],
  ['TT-FG1108', 'AI0450', 'rh', 0, 'between the last RH bank and ECO #2R: gas leaving RH bank 4'],
  ['TT-FG1110', 'AI0466', 'e2r', null, 'ECO #2R outlet'],
  ['TT-FG1101', 'AI0453', 'wl', null, 'above finishing S/H 1: gas leaving the backpass walls'],
  ['TT-FG1103', 'AI0454', 'fsh', 2, 'between finishing S/H 1 and 2: gas leaving S/H 1'],
  ['TT-FG1105', 'AI0469', 'fsh', 1, 'between finishing S/H 2 and 3: gas leaving S/H 2'],
  ['TT-FG1107', 'AI0452', 'fsh', 0, 'between finishing S/H 3 and ECO #3 upper: gas leaving S/H 3'],
  ['TT-FG1109', 'AI0468', 'e3m', null, 'between ECO #3 upper and lower: gas leaving the upper half of ECO #3'],
  ['TT-FG1111', 'AI0451', 'e3', null, 'between ECO #3 lower and ECO #2S: gas leaving ECO #3'],
  ['TT-FG1113', 'AI0467', 'e2s', null, 'ECO #2S outlet']
].forEach(([t, a, k, i, w]) =>
  rows.push({ stn: 4, ai: a, tag: t, v: U => gb(U, k, i), rel: w, src: 'IO list STN104 ' + a + ' ' + t + '; P&ID PD-051 (RA p 42); hx.js gBank.' + k + (i == null ? '' : '[' + i + ']') })
);

FIELD.add(lane, rows);

/* 7. Field states (beta.530, FIELD.state): field devices with no physics in the plant model. Each starts in its documented normal service
   state; the trainer changes it from the Plant menu (t = the abnormal condition). Left out on purpose, one source per tag: MIA-CL1061-x4
   discharge plugging (trainer fault cf.jamA ~ C, world.js jamSet), MIA-CL1061-x6 and ZSO / ZSC-CL1061-x7 (linked on DITL-19 / 20),
   MIA-CL1061-x1 (AI of unit.js). */
const states = [],
  fr = [];
const YAM = 'Yamato GM-BSC22-36 Final Drawing for LMYP-1 (L12 Coal Feeder) P8 signal list';
const FD = {
  A: ['', 'I.0131', 'I.0134', ['I.0120', 'I.0121', 'I.0122', 'I.0123'], ['I.0128', 'I.0129', 'I.012B', 'I.012D']],
  B: [' #B', 'I.0451', 'I.0454', ['I.0440', 'I.0441', 'I.0442', 'I.0443'], ['I.0448', 'I.0449', 'I.044B', 'I.044D']],
  C: [' #C', 'I.0491', 'I.0494', ['I.0480', 'I.0481', 'I.0482', 'I.0483'], ['I.0488', 'I.0489', 'I.048B', 'I.048D']]
};
/* clean-out conveyor contacts [MIA-CL1061-x8 auto mode, MIR-CL1061-x1 running] (IO list STN104) */
const CO = { A: ['I.012E', 'I.0133'], B: ['I.044E', 'I.0453'], C: ['I.048E', 'I.0493'] };
for (const x of 'ABC') {
  const [cp, mit, mit1, zs, mia] = FD[x],
    sh = 'DITL-19' + cp;
  /* feeder fault = the field trip of the feeder motor drawing (trainer fault mt.cfa, the unit black-out) */
  fr.push({ stn: 4, di: 1, tag: 'MIT-CL1061-' + x, adr: mit, sheet: sh, v: (U, X) => X.ftrip(sh), rel: 'feeder motor tripped in the field (DITL-19' + cp + ' field trip)',
    src: 'IO list STN104 ' + mit + ' MIT-CL1061-' + x + ' "Coal feeder-' + x + ' fault"; DITL-19' + cp + ' row 12; ' + YAM });
  /* silo outlet manual knife valves 1 / 2 between bunker T-1008x and feeder L-1061x: the feeder takes its coal only through them, so
     they stand open while the feeder is in service */
  [1, 2].forEach((g, k) => {
    const id = 'CL1061-' + x + '.gate' + g;
    states.push({ id, tag: 'ZSO-CL1061-' + x + g, normal: 1, t: 'Coal silo ' + x + ' outlet gate ' + g + ' closed', g: 'Coal and limestone',
      src: 'P&ID K1AU3-PD-061 Rev A (flow diagram RA p 48): MANUAL KNIFE VALVE between coal bunker T-1008' + x + ' and coal feeder L-1061' + x + ', the only coal path to the feeder' });
    fr.push({ stn: 4, di: 1, tag: 'ZSO-CL1061-' + x + g, v: (U, X) => X.state(id), rel: 'manual knife valve open', src: 'IO list STN104 ' + zs[2 * k] + '; P&ID PD-061 (RA p 48)' });
    fr.push({ stn: 4, di: 1, tag: 'ZSC-CL1061-' + x + g, v: (U, X) => 1 - X.state(id), rel: 'manual knife valve closed', src: 'IO list STN104 ' + zs[2 * k + 1] + '; P&ID PD-061 (RA p 48)' });
  });
  /* feeder package alarm contacts (DITL-19 outputs to the CRT / annunciator): 0 in service, 1 on the abnormal condition */
  [['2', 'vol', 'Coal feeder ' + x + ' in volumetric mode (load cell out)', 'gravimetric feeder (GM = gravimetric): volumetric only when the load cell is out'],
    ['3', 'plugIn', 'Coal feeder ' + x + ' inlet plugged', 'inlet plugging detector: alarm contact'],
    ['5', 'noCoal', 'Coal feeder ' + x + ' no coal on the belt', 'belt coal detector: alarm contact'],
    ['7', 'track', 'Coal feeder ' + x + ' belt off track', 'belt tracking switch: alarm contact']].forEach(([n, k, t, w], j) => {
    const id = 'CL1061-' + x + '.' + k;
    states.push({ id, tag: 'MIA-CL1061-' + x + n, normal: 0, t, g: 'Coal and limestone', src: YAM + ': ' + w });
    fr.push({ stn: 4, di: 1, tag: 'MIA-CL1061-' + x + n, v: (U, X) => X.state(id), rel: t, src: 'IO list STN104 ' + mia[j] + '; ' + YAM });
  });
  const ic = 'CL1061-' + x + '.coTrip';
  states.push({ id: ic, tag: 'MIT-CL1061-' + x + '1', normal: 0, t: 'Coal feeder ' + x + ' clean-out conveyor tripped', g: 'Coal and limestone',
    src: YAM + ': clean-out conveyor motor fault contact' });
  fr.push({ stn: 4, di: 1, tag: 'MIT-CL1061-' + x + '1', v: (U, X) => X.state(ic), rel: 'clean-out conveyor motor tripped', src: 'IO list STN104 ' + mit1 + '; ' + YAM });
  /* clean-out conveyor of the feeder package (0.55 kW DOL), Yamato ladder 60GM4130690005 sheet E5 rev 5 (PDF p 21), no conveyor timer:
     KM1 / R4 = NOT R5 AND [K3 AUTO: R2 | K3 MAN: (K4 OR KM1 seal) AND NOT K5]. R2 = feeder running (sheet E3) = the DITL-19 motor model,
     R5 = thermal relay 49-1 = the clean-out trip state above, K3 = the local AUTO / MAN selector (2nd pole = DO13 = MIA-CL1061-x8),
     R4 = DO05 = MIR-CL1061-x1. Normal line-up AUTO: the conveyor runs whenever the feeder runs (Yamato manual sec 7-8). The local push
     buttons K4 / K5 are not in the trainer, so in MAN only the seal KM1 holds what ran when MAN was selected, and R5 drops it. The seal
     is this row's own value of the last scan (U.fld, in the keyframe; none just after a load = the AUTO leg). */
  const ia = 'CL1061-' + x + '.coAuto',
    [mia8, mir1] = CO[x];
  states.push({ id: ia, tag: 'MIA-CL1061-' + x + '8', normal: 1, t: 'Coal feeder ' + x + ' clean-out conveyor selector in MAN', g: 'Coal and limestone',
    src: 'Yamato 60GM4130690005 sheet E5 rev 5 (PDF p 21) K3 AUTO / MAN, 2nd pole DO13; normal line-up AUTO (Yamato manual sec 7-8)' });
  fr.push({ stn: 4, di: 1, tag: 'MIA-CL1061-' + x + '8', v: (U, X) => X.state(ia), rel: 'clean-out conveyor selector in AUTO', src: 'IO list STN104 ' + mia8 + '; Yamato 60GM4130690005 E5 (PDF p 21) DO13' });
  const kn = 'MIRCL1061' + x + '1';
  fr.push({ stn: 4, di: 1, tag: 'MIR-CL1061-' + x + '1', rel: 'clean-out conveyor running (KM1 / R4)',
    src: 'IO list STN104 ' + mir1 + '; Yamato 60GM4130690005 E5 (PDF p 21) DO05 R4',
    v: (U, X) => {
      const r2 = X.ditlRun(sh), r5 = X.state(ic), auto = X.state(ia);
      if (r2 == null || r5 == null || auto == null) return NaN;
      const seal = U.fld && kn in U.fld ? U.fld[kn] === 1 : r2 === 1;
      return r5 !== 1 && (auto === 1 ? r2 === 1 : seal) ? 1 : 0;
    } });
}
/* motor dampers positioned from the DCS: furnace temperature control FA1005 ~ FA1026 (ABC-015 / 016, MCV-FA10xx) and burner hot SA
   FA1043-A ~ D (ABC-003A ~ D). A damper the DCS positions is in REMOTE on its field panel, its motor not tripped, its torque switch
   not made (I/O list contacts "trip", "remote", "torque" of each damper). */
[[1005, 'I.0332', 'I.0334', 'I.0333'], [1006, 'I.0337', 'I.0339', 'I.0338'], [1007, 'I.033C', 'I.033E', 'I.033D'],
  [1008, 'I.0722', 'I.0724', 'I.0723'], [1009, 'I.0727', 'I.0729', 'I.0728'], [1010, 'I.072C', 'I.072E', 'I.072D'],
  [1011, 'I.0732', 'I.0734', 'I.0733'], [1012, 'I.0737', 'I.0739', 'I.0738'], [1013, 'I.073C', 'I.073E', 'I.073D'],
  [1014, 'I.0802', 'I.0804', 'I.0803'], [1015, 'I.0807', 'I.0809', 'I.0808'], [1016, 'I.080C', 'I.080E', 'I.080D'],
  [1017, 'I.0812', 'I.0814', 'I.0813'], [1018, 'I.0817', 'I.0819', 'I.0818'],
  [1019, 'I.0002', 'I.0004', 'I.0003'], [1020, 'I.0007', 'I.0009', 'I.0008'], [1021, 'I.000C', 'I.000E', 'I.000D'],
  [1022, 'I.0012', 'I.0014', 'I.0013'], [1023, 'I.0017', 'I.0019', 'I.0018'], [1024, 'I.001C', 'I.001E', 'I.001D'],
  [1025, 'I.0322', 'I.0324', 'I.0323'], [1026, 'I.0327', 'I.0329', 'I.0328']]
  .map(([n, a, b, c]) => ['FA' + n, 3, a, b, c, (n > 1018 ? 'ABC-016' : 'ABC-015 / 016') + ' MCV-FA' + n])
  .concat([['FA1043-A', 4, 'I.0018', 'I.001A', 'I.0019', 'ABC-003A'], ['FA1043-B', 4, 'I.0338', 'I.033A', 'I.0339', 'ABC-003B'],
    ['FA1043-C', 4, 'I.0658', 'I.065A', 'I.0659', 'ABC-003C'], ['FA1043-D', 4, 'I.0978', 'I.097A', 'I.0979', 'ABC-003D']])
  .forEach(([d, stn, mit, ts, mil, abc]) => {
    const k = 'damper-' + d,
      s0 = 'IO list STN10' + stn + ' ',
      why = abc + ' positions the damper from the DCS in service (it needs REMOTE, a healthy motor and no torque stop)';
    states.push({ id: k + '.trip', tag: 'MIT-' + d, normal: 0, t: 'Damper ' + d + ' motor tripped', g: 'Air and flue gas', src: s0 + mit + ' "trip"; ' + why },
      { id: k + '.torque', tag: 'TS-' + d, normal: 0, t: 'Damper ' + d + ' torque switch made (jammed)', g: 'Air and flue gas', src: s0 + ts + ' "torque"; ' + why },
      { id: k + '.remote', tag: 'MIL-' + d, normal: 1, t: 'Damper ' + d + ' in LOCAL on the field panel', g: 'Air and flue gas', src: s0 + mil + ' "remote"; ' + why });
    fr.push({ stn, di: 1, tag: 'MIT-' + d, v: (U, X) => X.state(k + '.trip'), rel: 'motor thermal trip', src: s0 + mit },
      { stn, di: 1, tag: 'TS-' + d, v: (U, X) => X.state(k + '.torque'), rel: 'torque switch', src: s0 + ts },
      { stn, di: 1, tag: 'MIL-' + d, v: (U, X) => X.state(k + '.remote'), rel: 'REMOTE selected on the field panel', src: s0 + mil });
  });
/* 7b. MCC contacts of the motor valves MV-BR1391 (S/H No.1 outlet header to reheater, ABC-055, STN101) and MV-HR1391 (hot reheat blow-off,
   ABC-054, STN102): trip (MIT), remote (MIL) and torque (TS). Phase 6, YUA PDF read 2026-11-26: no logic sheet reads them; TS goes only
   to DISPLAY bits (memory list 101 B.2555 / B.2554, 102 B.253F / B.253E). Monitor points: field states in their normal service state
   (no trip, remote, no torque), the trainer sets the abnormal one. No interlock is made from them. */
[[1, 'BR1391', 'I.000C', 'I.000D', 'I.000E', 'S/H No.1 outlet header to reheater'], [2, 'HR1391', 'I.000C', 'I.000D', 'I.000E', 'hot reheat steam blow-off']].forEach(
  ([stn, d, mit, mil, ts, w]) => {
    const src = a => 'IO list STN10' + stn + ' ' + a + '; MV-' + d + ' (' + w + ' motor valve); Phase 6 wiring read (no logic sheet: monitor point)';
    [['MIT', mit, 0, 'tripped'], ['MIL', mil, 1, 'not in remote'], ['TS', ts, 0, 'torque switch made']].forEach(([p, a, nrm, ab]) => {
      const id = d + '.' + p.toLowerCase();
      states.push({ id, tag: p + '-' + d, normal: nrm, t: 'MV-' + d + ' ' + ab, g: 'Boiler', src: src(a) });
      fr.push({ stn, di: 1, tag: p + '-' + d, v: (U, X) => X.state(id), rel: 'MCC contact (field state)', src: src(a) });
    });
  }
);
/* 7c. MCC contacts of the PAF / SAF inlet flow control dampers (STN101; YUA PDF read section C: ABC-007, DITL-26A / 27A use only their
   ZSC / ZSO). Monitor points in normal service, no interlock. */
[[1, 'FA1053-1', 'MIT', 'I.0048', 0, 'PAF inlet damper tripped'], [1, 'FA1053-1', 'TS', 'I.004A', 0, 'PAF inlet damper torque switch made'],
  [1, 'FA1054-1', 'MIT', 'I.0058', 0, 'SAF inlet damper tripped'], [1, 'FA1054-1', 'MIL', 'I.0059', 1, 'SAF inlet damper not in remote'],
  [1, 'FA1054-1', 'TS', 'I.005A', 0, 'SAF inlet damper torque switch made']].forEach(([stn, d, p, a, nrm, t]) => {
  const id = d + '.' + p.toLowerCase(),
    src = 'IO list STN101 ' + a + ' ' + p + '-' + d + '; Phase 6 wiring read (ABC-007, DITL-26A / 27A do not read it: monitor point)';
  states.push({ id, tag: p + '-' + d, normal: nrm, t, g: 'Air and flue gas', src });
  fr.push({ stn, di: 1, tag: p + '-' + d, v: (U, X) => X.state(id), rel: 'MCC contact (field state)', src });
});
FIELD.state(lane, states);
FIELD.add(lane, fr);

/* 8. Air preheater secure power supply (DITL-43 output 12 AIR PREHEATER SECURE POWER SUPPLY NOT FAILURE, field contact XA-FA1052-5 on the
   output wire, IO list STN103 I.0659 "Air preheater secure power supply not failure"): a not-failure contact of the APH drive panel, made
   (1) while the secure supply is healthy. No supply model: a field state, normal 1. */
FIELD.state(lane, [{ id: 'FA1052.securePwr', tag: 'XA-FA1052-5', normal: 1, t: 'Air preheater secure power supply failed', g: 'Air and flue gas',
  src: 'IO list STN103 I.0659 XA-FA1052-5 "Air preheater secure power supply not failure" (not-failure contact, made in service); DITL-43 output 12' }]);
FIELD.add(lane, [{ stn: 3, di: 1, tag: 'XA-FA1052-5', sheet: 'DITL-43', v: (U, X) => X.state('FA1052.securePwr'), rel: 'secure power supply not failed',
  src: 'IO list STN103 I.0659; DITL-43 output 12 (field contact on the output wire)' }]);

/* 9. Bottom ash mechanical conveyors (bottom ash PLC logic DITL-BA59 ~ BA71, the I/O list station 103 B/A Handling points; the drawings
   write the tags with one dash more, MIR-L-1091 for MIR-L1091: tag = the drawing's name that finds the row, io = the I/O list name). The motor starter of each machine runs while its start command is on
   (DITL-BA71 motor outputs = IO list O.0202 MOR-L1091 bucket elevator, O.0203 MOR-L1092 screw, O.0204 MOR-F1091 bag filter fan; output
   rows counted from 0: 8, 7, 10), and its running contact (DITL-BA59 RUNNING inputs) is made while it runs. The chain conveyor L-1090
   running contact (I.0163) is the plant model's U.baConv, as DITL-21A reads it (plantsw.js MIR-L1090): one source for the one signal.
   The two-way separator L-1094 goes to the end its solenoid drives (DITL-BA71 outputs 5 / 6 = O.0210 SVO-BH1754 / O.0211 SVC-BH1754) and
   stays there (engine boiler.js U.ba.tw); it makes that limit switch (DITL-BA60 TWO-WAY LSO / LSC = I.0173 / I.0174). OPEN sends the
   ash to the vibrating screens, CLOSE to the ash silo: DITL-BA66 lets the screw run with (VIBRATING SCREEN RUNNING and TWO WAY OPEN) or
   (NOT ASH SILO HIGH LEVEL and TWO WAY CLOSE). */
FIELD.add(lane, [
  { stn: 3, di: 1, tag: 'MIR-L-1090', io: 'MIR-L1090', sheet: 'DITL-BA59', v: U => U.baConv, rel: 'chain conveyor L-1090 running (plant model, on its ON COMMAND DITL-BA68)',
    src: 'IO list STN103 I.0163 MIR-L1090; DITL-BA59 RUNNING input; engine boiler.js anBaStep U.baConv' }
].concat([
  ['MIR-L-1091', 8, 'I.0166', 'O.0202', 'bucket elevator L-1091 running'], ['MIR-L-1092', 7, 'I.0169', 'O.0203', 'screw conveyor L-1092 running'],
  ['MIR-F-1091', 10, 'I.016C', 'O.0204', 'bag filter venting fan F-1091 running']
].map(([tag, r, a, o, rel]) => ({ stn: 3, di: 1, tag, io: tag.replace(/^(MIR-[LF])-/, '$1'), sheet: 'DITL-BA59', v: (U, X) => X.ditlRun('DITL-BA71@' + r, 1), rel,
  src: 'IO list STN103 ' + a + '; DITL-BA59 RUNNING input; start command DITL-BA71 motor output ' + r + ' = ' + o }))
).concat([['ZSO-BH1754', 'twO', 'I.0173', 'LSO', 'two-way separator at its open end (ash to the vibrating screens)'],
  ['ZSC-BH1754', 'twC', 'I.0174', 'LSC', 'two-way separator at its closed end (ash to the silo)']].map(([tag, k, a, ls, rel]) => ({
  stn: 3, di: 1, tag, sheet: 'DITL-BA60', v: U => (U.ba && U.ba.sw ? U.ba.sw[k] : NaN), rel,
  src: 'IO list STN103 ' + a + '; DITL-BA60 TWO-WAY ' + ls + ' input; position from DITL-BA71 outputs 5 / 6 = O.0210 / O.0211 (engine boiler.js anBaStep)' }))));

/* 10. DITL input rows of the boiler drawings whose FROM column names an output of the same sheet (QA xref 2026-11-25 11:30 "missing":
   DITL-18 r20, DITL-19 r6 / r12 / r23, DITL-43 r4 / r5). That number is the station channel of the field contact (the output repeats
   it to the CRT, world.js selfDep), not its source: the source is the field. The drawing writes the row by its I/O address ("I.0132
   COAL FEEDER A REMOTE SELECTED"), not by the tag, so each row gives adr (the I/O address on that sheet) and sheet (the copy).
   - BI7-DO1043-x burner local panel LAMP TEST push button (DITL-18 row 20): pressed only to test the lamps, normal 0
   - MIL-CL1061-x coal feeder REMOTE (DITL-19 rows 6 / 23): the feeder is started and its speed set from the DCS in service
     (DITL-19 START / STOP, ABC feeder speed), so its selector stands at REMOTE, normal 1
   - YSR-FA1052M1 air preheater LOCAL (DITL-43 row 4): the APH runs from the DCS in service, normal 0
   Not given here: DITL-43 rows 10 / 12 / 13 RUNNING / SPEED NOT LOW / NOT L.L. (I.0650 / I.0653 / I.0654): the APH run state of the model
   is DITL-43's own RUNNING output (DUI.motState), which is this row: the start / stop command O.0206 / O.0207 CSC / CSO-FA1052M1-1 is on
   no parsed drawing, so a running contact from it would be the row reading itself. Left to lane 0 (drawing read). Row 5 NOT TRIP
   (XA-FA1052M1 I.0651) too: the APH inverter of DITL-43 (s._fd.inv) reads it in the first scan after a load, before the plant switch
   rows have a value, so without the 150 MW seed bit the APH trips at the start (MFT); lane 0 orders that scan first. */
{
  const BU = [['A', '', 'I.0041'], ['B', ' #B', 'I.0361'], ['C', ' #C', 'I.0681'], ['D', ' #D', 'I.1001']],
    CF = [['A', '', 'I.0132'], ['B', ' #B', 'I.0452'], ['C', ' #C', 'I.0492']],
    st = [],
    rw = [];
  for (const [x, cp, a] of BU) {
    const id = 'DO1043-' + x + '.lampTest';
    st.push({ id, tag: 'BI7-DO1043-' + x, normal: 0, t: 'Burner ' + x + ' local panel lamp test pressed', g: 'Boiler',
      src: 'IO list STN104 ' + a + ' BI7-DO1043-' + x + ' "Burner-' + x + ' lamp test" (push button, pressed only for a lamp test)' });
    rw.push({ stn: 4, di: 1, tag: 'BI7-DO1043-' + x, adr: a, sheet: 'DITL-18' + cp, v: (U, X) => X.state(id), rel: 'lamp test push button pressed',
      src: 'IO list STN104 ' + a + '; DITL-18' + cp + ' row 20 BURNER ' + x + ' LCP LAMP TEST' });
  }
  for (const [x, cp, a] of CF) {
    const id = 'CL1061-' + x + '.remote';
    st.push({ id, tag: 'MIL-CL1061-' + x, normal: 1, t: 'Coal feeder ' + x + ' in LOCAL', g: 'Coal and limestone',
      src: 'IO list STN104 ' + a + ' MIL-CL1061-' + x + ' "Coal feeder-' + x + ' remote"; DITL-19' + cp + ' starts / stops the feeder from the DCS in service; ' + YAM });
    rw.push({ stn: 4, di: 1, tag: 'MIL-CL1061-' + x, adr: a, sheet: 'DITL-19' + cp, v: (U, X) => X.state(id), rel: 'REMOTE selected on the feeder panel',
      src: 'IO list STN104 ' + a + '; DITL-19' + cp + ' rows 6 / 23 COAL FEEDER ' + x + ' REMOTE SELECTED' });
  }
  st.push({ id: 'FA1052.local', tag: 'YSR-FA1052M1', normal: 0, t: 'Air preheater in LOCAL', g: 'Air and flue gas',
    src: 'IO list STN103 I.0652 YSR-FA1052M1 "Air preheater local"; DITL-43 runs the APH from the DCS (CRT START / STOP P.B.) in service' });
  rw.push({ stn: 3, di: 1, tag: 'YSR-FA1052M1', adr: 'I.0652', sheet: 'DITL-43', v: (U, X) => X.state('FA1052.local'), rel: 'LOCAL selected on the APH panel',
    src: 'IO list STN103 I.0652; DITL-43 row 4 AIR PREHEATER LOCAL' });
  FIELD.state(lane, st);
  FIELD.add(lane, rw);
}

/* 11. Air preheater drive panel contacts on the output wires of DITL-43 (field contacts drawn at the left end of the output rows, the
   APH panel side; IO list STN103). No fire detection, speed sensor or supply model: field states at the documented normal service state.
   The "not fault" contacts are made (1) in service; the emergency push button is not operated (0). Same as XA-FA1052-5 (section 8). */
{
  const C = [
    ['XA-FA1052-1', 'I.0655', 'fireSys', 1, 'Air preheater fire detection system fault', 'Air preheater fire detect system not fault', 8],
    ['XA-FA1052-2', 'I.0656', 'fireSen', 1, 'Air preheater fire detection sensor open circuit', 'Air preheater fire detect sensor not open circuit', 9],
    ['XA-FA1052-3', 'I.0657', 'fire', 1, 'Air preheater fire alarm', 'Air preheater not fire alarm', 10],
    ['XA-FA1052-4', 'I.0658', 'spdSen', 1, 'Air preheater speed sensor fault', 'Air preheater speed sensor not fault', 11],
    ['XA-FA1052-6', 'I.065A', 'normPwr', 1, 'Air preheater normal power supply failed', 'Air preheater normal power supply not failure', 13],
    ['ES-FA1052', 'I.065E', 'emg', 0, 'Air preheater emergency push button operated', 'Air preheater emergency push button operated', 14]
  ];
  FIELD.state(lane, C.map(([tag, a, k, normal, t, d]) => ({ id: 'FA1052.' + k, tag, normal, t, g: 'Air and flue gas',
    src: 'IO list STN103 ' + a + ' ' + tag + ' "' + d + '"; normal = ' + (normal ? 'contact made in service' : 'push button not operated') })));
  FIELD.add(lane, C.map(([tag, a, k, normal, t, d, o]) => ({ stn: 3, di: 1, tag, sheet: 'DITL-43', v: (U, X) => X.state('FA1052.' + k),
    rel: d.replace(/^Air preheater /, ''), src: 'IO list STN103 ' + a + '; DITL-43 output ' + o + ' (field contact on the output wire)' })));
}
