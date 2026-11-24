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

/* 2. Furnace temperature control dampers FA1005 ~ FA1018 (STN103): the open / closed limit switches of each motor damper. The damper
   position is its own position transmitter ZT-FA10xx (AI0544 ~ AI0566, on ABC-015 / 016 following MCV-FA10xx). */
[
  [1005, 'I.0330', 'I.0331', 'AI0544'], [1006, 'I.0335', 'I.0336', 'AI0545'], [1007, 'I.033A', 'I.033B', 'AI0546'],
  [1008, 'I.0720', 'I.0721', 'AI0547'], [1009, 'I.0725', 'I.0726', 'AI0548'], [1010, 'I.072A', 'I.072B', 'AI0549'],
  [1011, 'I.0730', 'I.0731', 'AI0550'], [1012, 'I.0735', 'I.0736', 'AI0560'], [1013, 'I.073A', 'I.073B', 'AI0561'],
  [1014, 'I.0800', 'I.0801', 'AI0562'], [1015, 'I.0805', 'I.0806', 'AI0563'], [1016, 'I.080A', 'I.080B', 'AI0564'],
  [1017, 'I.0810', 'I.0811', 'AI0565'], [1018, 'I.0815', 'I.0816', 'AI0566']
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
