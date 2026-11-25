/* Audit 3 #6 (2026-11-22): moved here from hmi-mock-pb.js. The push button machines of the HX pages; the marks it added to the old
   drawings are gone with those drawings. */
/* 3.2.1 (LISA): push button faceplates on two generated mockup pages (tools/hmi-mock/p12.py, p15.py: not edited by hand), added here at
   run time, before the page is drawn: [data-hit] on a label of the mockup + a mach entry with df = the push button faceplate of fp-pop.js
   (LS_FPOP.pb, the same as the debris filters): STATUS = an output row of the drawing, DCS buttons = input rows of the same drawing
   (LS_OP.dpress). The drawing decides what a press does: nothing is forced here. */
(function () {
  if (!window.LS_MOCK) return;
  const adr = (d, r) => {
    try {
      const s = window.LS_OP && LS_OP.dOf(d),
        t = s && s.cells && s.cells[r + ':T'];
      return t && t.length ? String(t[0].t) : '';
    } catch (e) {
      return '';
    }
  };
  const pbf = (n, t, d, st, on, pbs, off) => ({
    n,
    t,
    d,
    df: {
      st,
      on,
      off: off || 'STOPPED',
      get pbs() {
        return pbs.map(([l, r, k, v, pd, pa]) => [l, r, pa ? pa() : adr(pd || d, r), k, v, pd]);
      },
      perm: [],
      why: ''
    }
  });
  /* lane 6: the start permissives of a machine as its drawing has them: [label, sheet, 'i' or 'o', row, 0 = the row must be 0]. The page
     shows them on the second faceplate (Y / N square) and the control faceplate names the one that is missing */
  const nd = L => L.map(([l, d, io, r, w]) => ({ l, key: 'dl:' + d + '|' + io + '|' + r + (w === 0 ? '|neg' : '') }));
  const defOf = id => {
    const def = (LS_MOCK.defs || []).find(x => x.id === id);
    if (!def || (def._pb = def._pb || {})[id]) return null;
    def._pb[id] = 1;
    def.mach = def.mach || {};
    return def;
  };
  /* SOOTBLOWERS (Mina beta.173: a click on the blower N-1011 opened the PLANT chip menu, no blower faceplate). Each blower label of the
     mockup ([data-dy="DITL-80x|o|row"][data-on="N-10xx"]) = its "N-10xx SOOTBLOWER OPERATING" output; on the same drawing row r is
     "N-10xx SOOTBLOWER START COMMAND" (M.4011 for N-1011 ...) and row r + 1 "N-10xx SOOTBLOWER SKIPPED" (M.4010 ...): read on all 30 rows of
     DITL-80A ~ 80F.
     Audit 3 (Jennie, live 2026-11-21: in MANUAL a START did nothing): row r is the step command of the AUTO program (FROM 80-59), no CRT
     button, and row r + 1 is the SKIPPED lamp. The CRT push buttons are on DITL-80M: row 2 "N-1011 SOOTBLOWER REMOTE START P.B." M.4015
     and row 7 "REMOTE REVERSE P.B." M.4014 (into DITL-80G rows 5 / 10 "REMOTE START / REVERSE COMMAND", F = 80M-303 / 80M-375), row 4
     M.401D for N-1012; the other blowers (the dots of the drawing) have their own copy of DITL-80M rows 2 / 7
     (src/world/inst/sootblowers.json, addresses of memory list 102): the press goes through the 2 s pulse and REMOTE SELECTED. The air preheater sootblower: DITL-80M rows 5 / 8 M.417D / M.417C. STATUS stays the
     OPERATING row of DITL-80A ~ 80F */
  const sb = defOf('MK15');
  const sbIns = n => {
    const L = (window.WORLD && WORLD.inst) || [];
    return L.find(x => x.name.endsWith('DITL-80M #' + n));
  };
  const sbAd = (n, a) => () => {
    const x = sbIns(n),
      m = x && x._inst && x._inst.amap;
    return (m && m[a]) || '';
  };
  const sbPb = (n, d) =>
    /80F/.test(d)
      ? [['START', 5, null, null, 'DITL-80M'], ['RETRACT', 8, null, null, 'DITL-80M']]
      : n === 'N-1011'
        ? [['START', 2, null, null, 'DITL-80M'], ['RETRACT', 7, null, null, 'DITL-80M']]
        : n === 'N-1012'
          ? [['START', 4, null, null, 'DITL-80M'], ['RETRACT', 7, null, null, 'DITL-80M #N-1012', sbAd(n, 'M.4014')]]
          : [['START', 2, null, null, 'DITL-80M #' + n, sbAd(n, 'M.4015')], ['RETRACT', 7, null, null, 'DITL-80M #' + n, sbAd(n, 'M.4014')]];
  if (sb)
    /* Audit 3 #6: the 30 blower labels the old drawing had ([data-dy="DITL-80x|o|row"][data-on="N-10xx"]): [blower, sheet, row] */
    [["N-1011","DITL-80A",25],["N-1012","DITL-80B",1],["N-1014","DITL-80B",9],["N-1013","DITL-80B",5],["N-1015","DITL-80B",13],["N-1016","DITL-80B",17],["N-1018","DITL-80B",25],["N-1017","DITL-80B",21],["N-1019","DITL-80C",1],["N-1020","DITL-80C",5],["N-1022","DITL-80C",13],["N-1021","DITL-80C",9],["N-1023","DITL-80C",17],["N-1024","DITL-80C",21],["N-1026","DITL-80D",1],["N-1025","DITL-80C",25],["N-1027","DITL-80D",5],["N-1028","DITL-80D",9],["N-1030","DITL-80D",17],["N-1029","DITL-80D",13],["N-1031","DITL-80D",21],["N-1032","DITL-80D",25],["N-1034","DITL-80E",5],["N-1033","DITL-80E",1],["N-1035","DITL-80E",9],["N-1036","DITL-80E",13],["N-1038","DITL-80E",21],["N-1037","DITL-80E",17],["N-1040","DITL-80F",25],["N-1042","DITL-80F",25]].forEach(([n, d, r]) => {
      const id = 'SB' + n;
      if (!sb.mach[id]) {
        sb.mach[id] = pbf(n, /80F/.test(d) ? 'Air preheater sootblower' : 'Sootblower', d, +r, 'OPERATING', sbPb(n, d));
        /* started by hand the AUTO program's OPERATING lamp stays off: the status also reads the blower's retract limit switch (DITL-80G
           row 12 ZSR-N1011, input row 11; its own copy for N-1012 ~ N-1038) */
        if (!/80F/.test(d)) sb.mach[id].df.away = { d: n === 'N-1011' ? 'DITL-80G' : 'DITL-80G #' + n, row: 11 };
        /* Rosé 2026-11-22 (live test finding 3: a START without the permissive did nothing and said nothing): the BLOWING PERMISSIVE,
           DITL-80A output row 20 (MV-SB1001 open 600 s and both drain temperatures above 220 °C, the panel of this page). The press
           still goes to the drawing; the faceplate says why the logic does not take it */
        if (!/80F/.test(d)) sb.mach[id].df.need = [{ d: 'DITL-80A', row: 20, l: 'blowing permissive (steam supply valve open 600 s, both drain temperatures above 220 °C)' }];
      }
    });
  /* 3.2.4-beta.8 (live test 2026-11-17: the backpass fouled for 4.5 h at 150 MW and no press on this page could open the steam or start
     the blowing: a blower START does nothing without the BLOWING PERMISSIVE, which needs MV-SB1001 open 600 s). The CRT push buttons of
     the drawings (input rows):
     - MV-SB1001 steam supply motor valve, DITL-80S: OPEN P.B. row 4 M.4210, STOP P.B. row 8 M.421A, CLOSE P.B. row 10 M.4211;
       STATUS = output row 4 "S/B STEAM SUPPLY MOTOR VALVE FULL OPENED" (CRT lamp, from I.024A row 5; 3.2.4-beta.9: live test 2026-11-17
       read output row 21, the OPEN / CLOSE COMMAND annunciation = OR of O.016E / O.016F, and showed NOT OPEN with the valve at 100 %).
       The valve takes the CRT command in REMOTE (row 0 I.024D).
     - Sootblower sequence, DITL-80A: AUTO / MANUAL mode select row 9 M.4005 (CRT, AUTO START SELECTED), AUTO SEQUENCE START row 10
       M.4002, SEQUENCE STOP row 4 M.4003, EMERGENCY RETRACT row 5 M.4004; STATUS = output row 5 "SOOTBLOWER SYSTEM PROGRAM ON".
     In MANUAL mode each blower is started from its own label (above) once the blowing permissive is Y. */
  if (sb) {
    sb.mach.SBMV = pbf('MV-SB1001', 'Sootblower steam supply motor valve', 'DITL-80S', 4, 'OPEN', [['OPEN', 4], ['STOP', 8], ['CLOSE', 10]], 'NOT OPEN');
    sb.mach.SBMV.df.free = 1;
    sb.mach.SBSEQ = pbf('Sootblower sequence', 'Sootblower program (30 blowers)', 'DITL-80A', 5, 'PROGRAM ON', [['AUTO MODE', 9, 'set', 1], ['MANUAL MODE', 9, 'set', 0], ['SEQUENCE START', 10], ['SEQUENCE STOP', 4], ['EMERGENCY RETRACT', 5]], 'PROGRAM OFF');
    sb.mach.SBSEQ.df.free = 1;
  }
  /* COAL, LIMESTONE AND SAND (Jennie OK 2026-11-08: the sand start buttons of 20.PNG). The order of the drawings (MINA_NEXT "PR 310 retest"):
     ISOLATING VALVE OPEN first (DITL-776 row 3 M.0870 "SAND ISO. VALVE OPEN (CRT)", memory list 103): valves -1 / -2 open, ROUTE OK
     (out 13 M.0872), then SYSTEM READY; then SYSTEM START (DITL-771 row 3 M.0800 "SAND SYSTEM START (CRT)") / STOP (row 4 M.0802): SYSTEM ON
     (out 14). The label "Sand" = the system, the labels XV-SD1802A / B = the isolating valves */
  const cl = defOf('MK12');
  if (cl) {
    /* design review 2026-11-08 (Yuna): the faceplate title is the tag or the short name, the sub line the full name (as the debris
       filters: S-1504 / Debris filter), not in capitals */
    cl.mach.SDSYS = pbf('Sand system', 'Sand injection system', 'DITL-771', 14, 'SYSTEM ON', [['START', 2], ['STOP', 3]], 'SYSTEM OFF');
    cl.mach.SDSYS.df.need = nd([
      ['System ready (M.0881)', 'DITL-771', 'i', 1],
      ['Selector in remote (SIL-SD1300)', 'DITL-771', 'i', 4],
      ['No system trip', 'DITL-771', 'i', 5, 0],
      ['No master fuel trip', 'DITL-771', 'i', 0, 0]
    ]);
    /* ISO. VALVE OPEN/CLOSE M.0870 is a MAINTAINED selection (Jennie 2026-11-18; regress sand.js holds the row with WORLD.dset): a pulse
       lets the valves close again before the 3 s stroke reaches FULLY OPEN (rows 7 / 8), so ROUTE OK never came from the faceplate */
    cl.mach.SDISO = pbf('XV-SD1802A / B', 'Sand isolating valves', 'DITL-776', 13, 'ROUTE OK', [['OPEN', 2, 'set', 1], ['CLOSE', 2, 'set', 0]], 'ROUTE NOT OK');
    cl.mach.SDISO.df.need = nd([
      ['No emergency stop', 'DITL-776', 'i', 4, 0],
      ['No master fuel trip', 'DITL-776', 'i', 5, 0]
    ]);
    /* LIMESTONE (sweep item 8, Mina item 8a beta.73: no start path): FILL CYCLE START PB (LS10 row 3 M.1800, STOP row 5 M.1801) ->
       FILLING CYCLE ENABLED FLAG -> VALVE STATE CHANGE PERMIT (LS212 M.182D) -> ISOLATING VALVE A~H OPEN/CLOSE SW (LS212 row 10 M.184C)
       -> FEEDER START COMMAND PB (LS110 row 8 M.1847, STOP row 9 M.1848). The model (boiler.js AN_LM) answers these commands */
    cl.mach.LMSYS = pbf('Limestone system', 'Limestone injection, filling cycle', 'DITL-LS10', 3, 'FILL CYCLE ON', [['START', 2], ['STOP', 4]], 'FILL CYCLE OFF');
    cl.mach.LMISO = pbf('XV-LM1811A ~ H', 'Limestone isolating valves', 'DITL-LS212', 19, 'OPEN', [['OPEN', 9, 'set', 1], ['CLOSE', 9, 'set', 0]], 'CLOSED');
    cl.mach.LMFD = pbf('L-1311', 'Limestone rotary feeder', 'DITL-LS110', 6, 'RUNNING', [['START', 7], ['STOP', 8]]);
    cl.mach.LMSYS.df.need = nd([
      ['System switch in remote', 'DITL-LS10', 'i', 5],
      ['Limestone feeder running', 'DITL-LS10', 'i', 10],
      ['Isolating valves all open', 'DITL-LS10', 'i', 11],
      ['Coal feeder in service', 'DITL-LS10', 'i', 9, 0],
      ['No feeder fault', 'DITL-LS10', 'i', 6, 0],
      ['Air tank pressure not low', 'DITL-LS10', 'i', 7, 0],
      ['Vent filter not tripped', 'DITL-LS10', 'i', 8, 0],
      ['Lock vessel inlet valve closed, no fault', 'DITL-LS10', 'i', 14, 0],
      ['Dispensing vessel inlet valve closed, no fault', 'DITL-LS10', 'i', 15, 0],
      ['Balance valve closed, no fault', 'DITL-LS10', 'i', 16, 0],
      ['Vent valve closed, no fault', 'DITL-LS10', 'i', 17, 0],
      ['Line not blocked', 'DITL-LS10', 'i', 18, 0],
      ['No fill cycle fault', 'DITL-LS10', 'i', 20, 0],
      ['No plant emergency stop', 'DITL-LS10', 'i', 13, 0],
      ['Breaker 52G1 / 52L1 not open', 'DITL-LS10', 'i', 12, 0],
      ['No master fuel trip', 'DITL-LS10', 'i', 3, 0]
    ]);
    cl.mach.LMISO.df.need = nd([
      ['Valve state change permit (M.182D)', 'DITL-LS212', 'i', 14],
      ['No plant emergency stop', 'DITL-LS212', 'i', 16, 0],
      ['No master fuel trip', 'DITL-LS212', 'i', 17, 0],
      ['Breaker 52G1 / 52L1 not open', 'DITL-LS212', 'i', 18, 0],
      ['Coal feeder in service', 'DITL-LS212', 'i', 19, 0]
    ]);
    cl.mach.LMFD.df.need = [{ l: 'Conveying pressure at low limit (its own run holds it)', key: 'cal:lmFdPress' }].concat(
      nd([
        ['Conveying pressure not high', 'DITL-LS110', 'i', 4, 0],
        ['Feeder drive in remote', 'DITL-LS110', 'i', 6],
        ['System switch in remote', 'DITL-LS110', 'i', 10],
        ['Conveying air valve open', 'DITL-LS110', 'i', 18],
        ['No oil burner in service', 'DITL-LS110', 'i', 5, 0],
        ['Coal feeder in service', 'DITL-LS110', 'i', 0, 0],
        ['Air tank pressure not low', 'DITL-LS110', 'i', 3, 0],
        ['No feeder fault', 'DITL-LS110', 'i', 9, 0],
        ['Line not blocked', 'DITL-LS110', 'i', 12, 0],
        ['Lock vessel valve closed, no fault', 'DITL-LS110', 'i', 13, 0],
        ['Dispensing vessel inlet valve closed, no fault', 'DITL-LS110', 'i', 14, 0],
        ['Balance valve closed, no fault', 'DITL-LS110', 'i', 15, 0],
        ['Vent valve closed, no fault', 'DITL-LS110', 'i', 16, 0],
        ['No plant emergency stop', 'DITL-LS110', 'i', 11, 0],
        ['Breaker 52G1 / 52L1 not open', 'DITL-LS110', 'i', 1, 0],
        ['No master fuel trip', 'DITL-LS110', 'i', 19, 0]
      ])
    );
  }
  /* PURGE AND TRIP (live Cold start 2026-11-13, finding F9: step 3 "Press FURNACE PURGE START" had no button). DITL-02 input row 6
     M.0500 "FURNACE PURGE START P.B." (CRT push button), STATUS = output row 6 "FURNACE PURGE IN PROGRESS". The permissives (rows 2 ~ 5
     burner SA dampers in purge position, row 15 M.050E furnace purge permissive) are all needed and already shown on the page */
  const pt = defOf('MK10');
  if (pt) {
    pt.mach.PURGE = pbf('Furnace purge', 'Furnace purge start (screen push button)', 'DITL-02', 5, 'PURGE IN PROGRESS', [['PURGE START', 5]], 'NOT IN PROGRESS');
    pt.mach.PURGE.df.need = nd([
      ['Furnace purge permissive (M.050E)', 'DITL-02', 'i', 14],
      ['Burner A air damper at purge position', 'DITL-02', 'i', 1],
      ['Burner B air damper at purge position', 'DITL-02', 'i', 2],
      ['Burner C air damper at purge position', 'DITL-02', 'i', 3],
      ['Burner D air damper at purge position', 'DITL-02', 'i', 4],
      ['Master fuel trip in effect', 'DITL-02', 'i', 26],
      ['Furnace not above 700 °C (purge by-pass)', 'DITL-02', 'i', 24, 0]
    ]);
  }
  /* DIESEL AND BURNERS (live Cold start 2026-11-13, finding F10: the igniter and burner ON / OFF push buttons were on no page). DITL-09 /
     #B / #C / #D input rows 5 / 7 / 9 / 11 = IGNITER x "ON" / "OFF" P.B., BURNER x "ON" / "OFF" P.B. (M.0110 / 0111 / 0118 / 0119 for A),
     STATUS = output row 27 BURNER x REMOTE SELECTED (the CRT buttons need REMOTE). The label "Burner A" ... opens the faceplate */
  const db = defOf('MK11');
  if (db) {
    for (const x of 'ABCD') {
      const d = x === 'A' ? 'DITL-09' : 'DITL-09 #' + x;
      db.mach['BN' + x] = pbf('Burner ' + x, 'Igniter and burner ' + x + ' push buttons', d, 26, 'REMOTE', [['IGNITER ON', 4], ['IGNITER OFF', 6], ['BURNER ON', 8], ['BURNER OFF', 10]], 'NOT REMOTE');
      db.mach['BN' + x].df.free = 1; /* F10b: four separate presses, REMOTE does not lock IGNITER ON */
      const n = x === 'A' ? '' : ' #' + x,
        lo = 'DITL-12' + (x === 'A' ? '' : 'ABC'['BCD'.indexOf(x)]);
      db.mach['BN' + x].df.need = nd([
        ['Remote selected', d, 'i', 13, 0],
        ['No master fuel trip', 'DITL-07' + n, 'i', 1, 0],
        ['Igniter: air damper at ignition position', 'DITL-07' + n, 'i', 3],
        ['Igniter: oil valve at ignition position', 'DITL-07' + n, 'i', 4],
        ['Igniter: in retract position', 'DITL-10' + n, 'i', 1],
        ['Burner: diesel oil pressure not high', 'DITL-07' + n, 'i', 9],
        ['Burner: atomizing air pressure not low', 'DITL-07' + n, 'i', 11],
        ['Burner: flame detector off', lo, 'i', 8, 0],
        ['Burner: shutdown completed', lo, 'i', 10],
        ['Burner: ready (igniter inserted or permitted)', lo, 'o', 7]
      ]);
    }
  }
})();
