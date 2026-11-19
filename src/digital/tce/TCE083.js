/* TCE083 DIGITAL INPUT SIGNAL DIAGNOSTICS(9) (331DM09784 page 50, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the
   digital input diagnostics sheets (tce/_lib.js, TCE_LIB.did); the places are those of the page set straight, as on TCE075.
   Shaft vibration very high (B) of the four bearings, as TCE075 has (A). */
(function () {
  if (typeof window === 'undefined') return;
  const R = ['TCP1052', 'TCP2052', 'TCP3052'],
    V = s => {
      const L = [s + ' SHAFT VIBRATION', 'VERY HIGH(B)'];
      return { in: [L, L, L], out: [L, L, [...L, 'INPUT ERROR']] };
    };
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.did({
      id: 'TCE083',
      title: 'DIGITAL INPUT SIGNAL DIAGNOSTICS(9)',
      page: 50,
      f: [180, 75, 2232, 1535],
      tops: [103, 391, 668, 976],
      line2: '',
      g: [
        [V('NO.1 BEARING'), 'B1', 'A', ['001', '004', '032'], ['003', '005', '007'], '031', 'TCE083_1', null, R],
        [V('NO.2 BEARING'), 'B2', 'B', ['008', '011', '033'], ['010', '012', '014'], '009', 'TCE083_3', null, R],
        [V('NO.3 GEN.'), 'B3', 'C', ['015', '018', '034'], ['017', '019', '021'], '016', 'TCE083_5', null, R],
        [V('NO.4 GEN.'), 'B4', 'D', ['022', '025', '035'], ['024', '026', '030'], '023', 'TCE083_7', null, R]
      ],
      or: ['027', '028'],
      e: ['E', ['TCE471']],
      foot: [[247, 1512, 'CONTROLLER:'], [408, 1512, 'EHG+MD'], [670, 1485, 'TRIGGER  :'], [670, 1512, 'CYCLE(ms):30']]
    })
  );
})();
