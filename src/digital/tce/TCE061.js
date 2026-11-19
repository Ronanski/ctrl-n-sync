/* TCE061 ANALOG INPUT SIGNAL DIAGNOSTICS(2) (331DM09784 page 29, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. Drawn in the pattern of the analog input diagnostics sheets (tce/_lib.js, TCE_LIB.tmr). */
(function () {
  if (typeof window === 'undefined') return;
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.tmr({
      id: 'TCE061',
      title: 'ANALOG INPUT SIGNAL DIAGNOSTICS(2)',
      page: 29,
      f: [161, 82, 2220, 1545],
      tag: 'nPT-LOn003',
      let: ['D2', 'E2'],
      name: (ch, sig) => (sig ? ['', 'BEARING OIL PRESS.(' + ch + ')'] : ['BEARING OIL PRESS.(' + ch + ')', 'INPUT ERR']),
      sg: ['K:5.1kg/cm2g', 'K:-0.25kg/cm2g', 'K:1.0kg/cm2g', 'K:1.5kg/cm2g'],
      out: ['BEARING OIL', 'PRESS.', 'PRESS. ABN.'],
      refA: ['TCE350'],
      refA1: ['TCA536'],
      cs: [[1343, 766], [1320, 840], [1541, 914]],
      cx: 2054,
      dx: -9,
      dr: -7,
      foot: [[230, 1527, 'CONTROLLER:'], [389, 1527, 'EHG+MD'], [650, 1499, 'TRIGGER  :'], [650, 1527, 'CYCLE(ms):30']]
    })
  );
})();
