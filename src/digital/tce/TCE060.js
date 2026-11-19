/* TCE060 ANALOG INPUT SIGNAL DIAGNOSTICS(1) (331DM09784 page 28, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. Drawn in the pattern of the analog input diagnostics sheets (tce/_lib.js, TCE_LIB.tmr). */
(function () {
  if (typeof window === 'undefined') return;
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.tmr({
      id: 'TCE060',
      title: 'ANALOG INPUT SIGNAL DIAGNOSTICS(1)',
      page: 28,
      f: [167, 81, 2228, 1545],
      tag: 'nPT-CRn901',
      let: ['D1', 'E1'],
      name: (ch, sig) => ['HP TURBINE EXHAUST', 'STEAM PRESS.(' + ch + ')' + (sig ? '' : ' INPUT ERR')],
      sg: ['K:51.0kg/cm2g', 'K:-2.5kg/cm2g', 'K:10.0kg/cm2g', 'K:4.0kg/cm2g'],
      out: ['HP TURBINE EXHAUST', 'STEAM PRESS.', 'STEAM PRESS. ABN.'],
      refA: ['-'],
      refA1: ['TCA686', 'TCA825'],
      cs: [[1321, 796], [1339, 870], [1550, 945]],
      cx: 2083,
      foot: [[236, 1525, 'CONTROLLER:'], [397, 1525, 'EHG+MD'], [658, 1498, 'TRIGGER  :'], [658, 1525, 'CYCLE(ms):30']]
    })
  );
})();
