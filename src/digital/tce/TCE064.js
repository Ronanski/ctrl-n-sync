/* TCE064 ANALOG INPUT SIGNAL DIAGNOSTICS(5) (331DM09784 page 32, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. Drawn in the pattern of the analog input diagnostics sheets (tce/_lib.js, TCE_LIB.tmr). Here C1, C2, C3 carry their name and
   also go to D1, D2, D3. The lamp of "abnormal" is tagged nPT-STn003_PVC in the drawing (not STn001); it is typed as drawn. */
(function () {
  if (typeof window === 'undefined') return;
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.tmr({
      id: 'TCE064',
      title: 'ANALOG INPUT SIGNAL DIAGNOSTICS(5)',
      page: 32,
      f: [162, 81, 2221, 1546],
      tag: 'nPT-STn001',
      tagAbn: 'nPT-STn003_PVC',
      let: ['D5', 'E5'],
      name: (ch, sig) => ['HP TURBINE FIRST STAGE', 'STEAM PRESS.(' + ch + ')' + (sig ? '' : ' INPUT ERR')],
      sg: ['K:153.0kg/cm2g', 'K:-7.5g/cm2g', 'K:30.0kg/cm2g', 'K:125.0kg/cm2g'],
      out: ['HP TURBINE FIRST', 'STAGE STEAM PRESS.', 'STEAM PRESS. ABN.', 'HP TURBINE FIRST STAGE'],
      refA: ['TCE206'],
      refA1: ['TCA825'],
      refC: ['TCE610', 'TCE610', 'TCE610'],
      /* C2 leaves the line to IN B of the detector (x = 1414 + dr), C3 the line to IN C (x = 1436 + dr), level with the output */
      cs: [[1310, 807], [1408, 935], [1430, null]],
      cx: 2065,
      cdbl: 0,
      cname: ch => ['HP TURBINE FIRST STAGE', 'STEAM PRESS.(' + ch + ')'],
      cnx: 1836,
      ds: [1798, [860, 990, 1128], [2065, 2065, 2075], 'TCT202'],
      dx: -8,
      dr: -6,
      foot: [[229, 1527, 'CONTROLLER:'], [391, 1527, 'EHG+MD'], [652, 1499, 'TRIGGER  :'], [652, 1527, 'CYCLE(ms):30']]
    })
  );
})();
