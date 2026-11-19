/* TCE069 ANALOG INPUT SIGNAL DIAGNOSTICS(10) (331DM09784 page 37, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the analog
   input diagnostics sheets (tce/_lib.js, TCE_LIB.tmr), in the units of sheet TCE060: the frame of this page stands 8 higher on the rendered page, so
   every height read from it has 8 added. LP turbine exhaust hood steam temperature: one signal per block, as on TCE067. The low limit (SG A017) has
   a name printed over it; K:-7.5degC is read, and it is the bottom of the range less 5 % as on the other sheets (TCS I/O list, iolist-tcs.zip,
   HMI_DI_FOR_EDIT.xlsx, analog input sheet, row TE-STn110-1: range 0 to 150 degC, so -7.5). */
(function () {
  if (typeof window === 'undefined') return;
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.tmr({
      id: 'TCE069',
      title: 'ANALOG INPUT SIGNAL DIAGNOSTICS(10)',
      page: 37,
      f: [167, 81, 2228, 1545],
      tag: 'nTE-STn110',
      let: ['B3', 'D3'],
      single: [[712, 776, 86], [677, 720, 131], [673, 718, 119]],
      inref: ['TCA357', 'TCA361', 'TCA365'],
      cref: ['TCP1104', 'TCP2104', 'TCP3104'],
      name: (ch, sig) => ['LP TURBINE EXHAUST HOOD', 'STEAM TEMP.(' + ch + ')' + (sig ? '' : ' INPUT ERR')],
      sg: ['K:153.0degC', 'K:-7.5degC', 'K:30.0degC', 'K:15.0degC'],
      out: ['LP TURBINE EXHAUST', 'HOOD STEAM TEMP.', 'HOOD STEAM TEMP. ABN.'],
      refA: ['-'],
      refA1: ['TCA540'],
      foot: [[236, 1525, 'CONTROLLER:'], [397, 1525, 'EHG+MD'], [658, 1498, 'TRIGGER  :'], [658, 1525, 'CYCLE(ms):30']]
    })
  );
})();
