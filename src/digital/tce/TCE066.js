/* TCE066 ANALOG INPUT SIGNAL DIAGNOSTICS(7) (331DM09784 page 34, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. Drawn in the pattern of the analog input diagnostics sheets (tce/_lib.js, TCE_LIB.tmr). */
(function () {
  if (typeof window === 'undefined') return;
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.tmr({
      id: 'TCE066',
      title: 'ANALOG INPUT SIGNAL DIAGNOSTICS(7)',
      page: 34,
      f: [167, 80, 2221, 1548],
      tag: 'nZE-STn003',
      let: ['D2', 'E2'],
      sh: ['071', '073', '075'],
      name: (ch, sig) => ['TURBINE ROTOR', 'POSITION(' + ch + ')' + (sig ? '' : ' INPUT ERR')],
      sg: ['K:2.08mm', 'K:-2.02mm', 'K:0.8mm', 'K:0.4mm'],
      out: ['TURBINE ROTOR', 'POSITION', 'POSITION ABN.'],
      refA: ['-'],
      refA1: ['-'],
      refC: [['TCT208', 'TCA541'], ['TCT208', 'TCA541'], ['TCT208', 'TCA541']],
      /* C1 steps to the right under the detector on its way down; C2 leaves the line to IN B (x = 1414 + dr), C3 the line to IN C
         (x = 1436 + dr), level with the output */
      cs: [[1324, 828], [1409, 933], [1431, null]],
      c1via: [412, 1524],
      cx: 2066,
      dx: -8,
      dr: -5,
      foot: [[234, 1529, 'CONTROLLER:'], [394, 1529, 'EHG+MD'], [655, 1500, 'TRIGGER  :'], [655, 1527, 'CYCLE(ms):30']]
    })
  );
})();
