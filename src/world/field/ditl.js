/* src/world/field/ditl.js: LANE 1 (MARIA), Phase 6 DITL half (phase thread handoff 2026-11-26, /mnt/project-files/phase6/
   phase6-ditl-handoff-2026-11-26.md, B1 DITL inputs with no source). Field signals of DITL input rows that the linker leaves without a source
   (src/world/field/README.md). Each row reads engine state that already exists, or a field state with its documented normal value. */

/* 1. DITL-42 rows 1 ~ 6: PLANT / INSTRUMENT AIR COMPRESSOR A ~ C RUNNING (MIR-C0703A ~ C, MIR-C0704A ~ C, from the HVP soft starter). The same
   running contacts are the input rows of DITL-114 (plant air) / DITL-113 (instrument air) rows 5 / 12 / 19 (IA: I.0015 / I.0095 / I.0335,
   the addresses of DITL-42 rows 4 ~ 6), which the air model writes (unit.js anAirStep, U.paR0..2 / U.iaR0..2 = the RUNNING contact of the
   local panel). One source: the model's run state, here on the alarm sheet DITL-42 too */
FIELD.add(
  lane,
  [
    ['C0703', 'pa', 'PLANT'],
    ['C0704', 'ia', 'INSTRUMENT']
  ].flatMap(([t, k, w]) =>
    ['A', 'B', 'C'].map((x, i) => ({
      stn: 5,
      di: 1,
      tag: 'MIR-' + t + x,
      sheet: 'DITL-42',
      v: U => (Array.isArray(U[k + 'Run']) ? (U[k + 'R' + i] ? 1 : 0) : NaN),
      rel: w.toLowerCase() + ' air compressor ' + x + ' running (the RUNNING contact of the air model)',
      src: 'DITL-42 row ' + (k === 'pa' ? i + 1 : i + 4) + ' MIR-' + t + x + '; the same contact on DITL-11' + (k === 'pa' ? '4' : '3') + ' row ' + [5, 12, 19][i] + ' (unit.js anAirStep)'
    }))
  )
);

/* 2. DITL-45 (A) / #B / #C PLANT / INSTRUMENT AIR DRYER REMOTE and PLANT AIR DRYER ALARM: the FROM column names an output of the same sheet
   (45-55 / 45-56 / 45-66), that is the station channel of the field contact repeated to the CRT, not its source (the same reading as
   field/boiler.js item 10). The source is the dryer local panel:
   - REMOTE (I.0085 / 88 / 8B plant, I.0099 / 9C / 9F instrument): the dryer is started from the DCS (DITL-45 START P.B. from the CRT,
     M.1110 / 1115 / 111A, M.1120 / 1125 / 112A) in service, so its selector stands at REMOTE: normal 1. DERIVED from the drawing
   - ALARM (I.0084 / 87 / 8A): no alarm in service: normal 0 */
{
  const D = [
      ['A', '', '85', '84', '99'],
      ['B', ' #B', '88', '87', '9C'],
      ['C', ' #C', '8B', '8A', '9F']
    ],
    st = [],
    rw = [];
  for (const [x, cp, rp, al, ri] of D) {
    const sh = 'DITL-45' + cp;
    st.push(
      { id: 'PA-DRY-' + x + '.remote', tag: 'PLANT AIR DRYER-' + x + ' REMOTE', normal: 1, t: 'Plant air dryer ' + x + ' not in remote', g: 'Other',
        src: 'DITL-45' + cp + ' rows 5 / 9 I.00' + rp + ' PLANT AIR DRYER-' + x + ' REMOTE (DCS start P.B. on the same sheet: in service = REMOTE)' },
      { id: 'PA-DRY-' + x + '.alarm', tag: 'PLANT AIR DRYER-' + x + ' ALARM', normal: 0, t: 'Plant air dryer ' + x + ' alarm', g: 'Other',
        src: 'DITL-45' + cp + ' row 6 I.00' + al + ' PLANT AIR DRYER-' + x + ' ALARM' },
      { id: 'IA-DRY-' + x + '.remote', tag: 'INSTRUMENT AIR DRYER-' + x + ' REMOTE', normal: 1, t: 'Instrument air dryer ' + x + ' not in remote', g: 'Other',
        src: 'DITL-45' + cp + ' rows 16 / 20 I.00' + ri + ' INSTRUMENT AIR DRYER-' + x + ' REMOTE (DCS start P.B. on the same sheet)' }
    );
    rw.push(
      { stn: 5, di: 1, tag: 'PLANT AIR DRYER-' + x + ' REMOTE', adr: 'I.00' + rp, sheet: sh, v: (U, X) => X.state('PA-DRY-' + x + '.remote'),
        rel: 'plant air dryer ' + x + ' selector at REMOTE', src: sh + ' rows 5 / 9' },
      { stn: 5, di: 1, tag: 'PLANT AIR DRYER-' + x + ' ALARM', adr: 'I.00' + al, sheet: sh, v: (U, X) => X.state('PA-DRY-' + x + '.alarm'),
        rel: 'plant air dryer ' + x + ' alarm contact', src: sh + ' row 6' },
      { stn: 5, di: 1, tag: 'INSTRUMENT AIR DRYER-' + x + ' REMOTE', adr: 'I.00' + ri, sheet: sh, v: (U, X) => X.state('IA-DRY-' + x + '.remote'),
        rel: 'instrument air dryer ' + x + ' selector at REMOTE', src: sh + ' rows 16 / 20' }
    );
  }
  FIELD.state(lane, st);
  FIELD.add(lane, rw);
}

/* 3. The sootblower trips and the air preheater sootblower LOCAL selector (DITL-80K row 10, DITL-80M row 2, DITL-80Q rows 11 / 12 / 38 / 39;
   FROM SB PANEL / LOCAL/MCC). Field contacts of the sootblower panel with no physics in the model: field states with the value of the
   normal service state. TRIP: not tripped, normal 0. LOCAL SELECTED (I.073E): the sootblowing program runs from the DCS (DITL-80M REMOTE
   START P.B. from the CRT, DITL-80K REMOTE START COMMAND), so the APH sootblower system stands at REMOTE: LOCAL normal 0. DERIVED from the
   drawings */
FIELD.state(lane, [
  ...['1011', '1012', '1038'].map(n => ({ id: 'SB-N' + n + '.trip', tag: 'N-' + n + ' SOOTBLOWER TRIP', normal: 0, t: 'Sootblower N-' + n + ' trip',
    g: 'Boiler', src: 'DITL-80Q row ' + { 1011: 11, 1012: 12, 1038: 38 }[n] + ' N-' + n + ' SOOTBLOWER TRIP from the SB panel' })),
  { id: 'SB-APH.trip', tag: 'AIR PREHEATER SOOTBLOWER TRIP', normal: 0, t: 'Air preheater sootblower trip', g: 'Boiler',
    src: 'DITL-80K row 10 I.073D (SB-PANEL), DITL-80Q row 39 (LOCAL/MCC) AIR PREHEATER SOOTBLOWER TRIP' },
  { id: 'SB-APH.local', tag: 'AIR PREHEATER SOOTBLOWER SYSTEM LOCAL SELECTED', normal: 0, t: 'Air preheater sootblower system in local',
    g: 'Boiler', src: 'DITL-80M row 2 I.073E AIR PREHEATER SOOTBLOWER SYSTEM LOCAL SELECTED (LOCAL/MCC)' }
]);
/* the rows match by a word of their text (plantsw.js build: the tag is one of the first words): the sootblower number, the I/O address.
   DITL-80Q row 39 AIR PREHEATER SOOTBLOWER TRIP has neither (it is the same contact as DITL-80K row 10 I.073D): left to the linker */
FIELD.add(lane, [
  ...['1011', '1012', '1038'].map(n => ({ di: 1, tag: 'N-' + n, sheet: 'DITL-80Q', v: (U, X) => X.state('SB-N' + n + '.trip'),
    rel: 'sootblower N-' + n + ' trip contact of the SB panel', src: 'DITL-80Q row ' + { 1011: 11, 1012: 12, 1038: 38 }[n] + ' (SB PANEL)' })),
  { di: 1, tag: 'I.073D', sheet: 'DITL-80K', v: (U, X) => X.state('SB-APH.trip'), rel: 'air preheater sootblower trip contact',
    src: 'DITL-80K row 10 I.073D' },
  { di: 1, tag: 'I.073E', sheet: 'DITL-80M', v: (U, X) => X.state('SB-APH.local'),
    rel: 'air preheater sootblower system selector at LOCAL', src: 'DITL-80M row 2 I.073E' }
]);
