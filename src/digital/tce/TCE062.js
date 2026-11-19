/* TCE062 ANALOG INPUT SIGNAL DIAGNOSTICS(3) (331DM09784 page 30, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. Drawn in the pattern of the analog input diagnostics sheets (tce/_lib.js, TCE_LIB.tmr). */
(function () {
  if (typeof window === 'undefined') return;
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.tmr({
      id: 'TCE062',
      title: 'ANALOG INPUT SIGNAL DIAGNOSTICS(3)',
      page: 30,
      f: [163, 81, 2222, 1546],
      tag: 'nPT-LOn006',
      let: ['D3', 'E3'],
      name: (ch, sig) => (sig ? ['', 'CONTROL OIL PRESS.(' + ch + ')'] : ['CONTROL OIL PRESS.(' + ch + ')', 'INPUT ERR']),
      sg: ['K:255.0kg/cm2g', 'K:-12.5kg/cm2g', 'K:50.0g/cm2g', 'K:150.0kg/cm2g'],
      out: ['CONTROL OIL', 'PRESS.', 'PRESS. ABN.'],
      refA: ['-'],
      refA1: ['TCA536'],
      refC: ['TCT200', 'TCT201', 'TCT201'],
      cs: [[1335, 786], [1312, 870], [1543, 956]],
      cx: 2067,
      dx: -7,
      dr: -5,
      foot: [[232, 1527, 'CONTROLLER:'], [393, 1527, 'EHG+MD'], [655, 1499, 'TRIGGER  :'], [655, 1527, 'CYCLE(ms):30']]
    })
  );
})();
