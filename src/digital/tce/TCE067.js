/* TCE067 ANALOG INPUT SIGNAL DIAGNOSTICS(8) (331DM09784 page 35, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the analog
   input diagnostics sheets (tce/_lib.js, TCE_LIB.tmr), in the units of sheet TCE060: the frame of this page stands 8 to the left and 7 higher on the
   rendered page, so every place read from it has 8 and 7 added. MSV inlet steam temperature: each block reads one signal for its three inputs, and
   the signal also leaves by C1, C2, C3. */
(function () {
  if (typeof window === 'undefined') return;
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.tmr({
      id: 'TCE067',
      title: 'ANALOG INPUT SIGNAL DIAGNOSTICS(8)',
      page: 35,
      f: [167, 81, 2228, 1545],
      tag: 'nTE-MSn902',
      tagAbn: 'nTE-MSn902-PVQ',
      let: ['B1', 'D1'],
      single: [[735, 768, 77], [678, 731, 140], [665, 718, 186]],
      inref: ['TCA357', 'TCA361', 'TCA365'],
      cref: ['TCP1101', 'TCP2101', 'TCP3101'],
      name: (ch, sig) => (sig ? ['', 'MSV INLET STEAM TEMP.(' + ch + ')'] : ['MSV INLET STEAM TEMP.(' + ch + ')', 'INPUT ERR']),
      sg: ['K:714.0degC', 'K:-35.0degC', 'K:140.0degC', 'K:450.0degC'],
      out: ['MSV INLET', 'STEAM TEMP.', 'STEAM TEMP. ABN.'],
      refA: ['-'],
      refA1: ['TCA536', 'TCA825'],
      refB1: ['TCA548'],
      foot: [[236, 1525, 'CONTROLLER:'], [397, 1525, 'EHG+MD'], [658, 1498, 'TRIGGER  :'], [658, 1525, 'CYCLE(ms):30']]
    })
  );
})();
