/* TCE065 ANALOG INPUT SIGNAL DIAGNOSTICS(6) (331DM09784 page 33, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. Drawn in the pattern of the analog input diagnostics sheets (tce/_lib.js, TCE_LIB.tmr). The three values leave by D1, D2, D3.
   The low limit (SG A017) is overprinted by a name in the drawing: K:-0.05 is read, its unit is typed like the unit of the high limit. */
(function () {
  if (typeof window === 'undefined') return;
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.tmr({
      id: 'TCE065',
      title: 'ANALOG INPUT SIGNAL DIAGNOSTICS(6)',
      page: 33,
      f: [160, 81, 2221, 1546],
      tag: 'nPT-STn110',
      let: ['D1', 'E1'],
      sh: ['071', '073', '075'],
      name: (ch, sig) =>
        sig ? ['LP TURBINE EXHAUST HOOD', 'STEAM PRESS.(COND VAC)(' + ch + ')'] : ['LP TURBINE EXHAUST HOOD STEAM', 'PRESS.(COND VAC)(' + ch + ') INPUT ERR'],
      sg: ['K:1.05g/cm2g', 'K:-0.05g/cm2g', 'K:0.2kg/cm2g', 'K:0.1kg/cm2g'],
      over: 'LP TURBINE EXHAUST',
      out: ['HOOD STEAM PRESS.', '(COND VAC)', '(COND VAC) ABN.'],
      refA: ['-'],
      refA1: ['TCA536'],
      cl: 'D',
      refC: ['TCT202', 'TCT202', 'TCT203'],
      /* D3 leaves the line to IN C of the detector (x = 1436 + dr), level with the output */
      cs: [[1340, 871], [1320, 967], [1428, null]],
      cx: 2063,
      dx: -9,
      dr: -8,
      foot: [[230, 1527, 'CONTROLLER:'], [388, 1527, 'EHG+MD'], [650, 1499, 'TRIGGER  :'], [650, 1527, 'CYCLE(ms):30']]
    })
  );
})();
