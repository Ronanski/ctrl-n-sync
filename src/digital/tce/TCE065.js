/* TCE065 ANALOG INPUT SIGNAL DIAGNOSTICS(6) (331DM09784 page 33, controller EHG+MD, cycle 30 ms). Typed from the drawing; units = the pixels of the page
   rendered 2296 wide. Drawn in the pattern of the analog input diagnostics sheets (tce/_lib.js, TCE_LIB.tmr). The three values leave by D1, D2, D3.
   The limits are typed as the drawing prints them: K:1.05g/cm2g (SG A012) and K:-0.05cm2g (SG A017, read from the page rendered three times
   larger; a name is printed over it). The drawing cuts the unit short. Second source, TCS I/O list (iolist-tcs.zip, HMI_DI_FOR_EDIT.xlsx, analog
   input sheet, rows PT-STn110-1 / -2 / -3): range 0 to 1 kg/cm2g, so the unit is kg/cm2g. The low limit of every sheet of this kind is the bottom
   of the range of that list less 5 % of the range (TCE060 0 to 50: -2.5; TCE061 0 to 5: -0.25; TCE062 and TCE063 0 to 250: -12.5; TCE064 0 to
   150: -7.5); here 0 to 1 gives -0.05, the value read. */
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
      sg: ['K:1.05g/cm2g', 'K:-0.05cm2g', 'K:0.2kg/cm2g', 'K:0.1kg/cm2g'],
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
