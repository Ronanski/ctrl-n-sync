/* TCE063 ANALOG INPUT SIGNAL DIAGNOSTICS(4) (331DM09784 page 31, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. Drawn in the pattern of the analog input diagnostics sheets (tce/_lib.js, TCE_LIB.tmr). */
(function () {
  if (typeof window === 'undefined') return;
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.tmr({
      id: 'TCE063',
      title: 'ANALOG INPUT SIGNAL DIAGNOSTICS(4)',
      page: 31,
      f: [163, 83, 2223, 1547],
      tag: 'nPT-LOn007',
      let: ['D4', 'E4'],
      name: (ch, sig) => ['TURBINE TRIP OIL', 'PRESS.(' + ch + ')' + (sig ? '' : ' INPUT ERR')],
      sg: ['K:255.0kg/cm2g', 'K:-12.5g/cm2g', 'K:50.0kg/cm2g', 'K:25.0kg/cm2g'],
      out: ['TURBINE TRIP OIL', 'PRESS.', 'PRESS. ABN.'],
      refA: ['-'],
      refA1: ['-'],
      refC: ['TCT201', 'TCT201', 'TCT201'],
      /* C3 leaves the line to IN C of the detector (x = 1436 + dr) */
      cs: [[1335, 778], [1311, 862], [1433, 947]],
      cx: 2067,
      dx: -5,
      dr: -3,
      foot: [[232, 1528, 'CONTROLLER:'], [391, 1528, 'EHG+MD'], [653, 1501, 'TRIGGER  :'], [653, 1528, 'CYCLE(ms):30']]
    })
  );
})();
