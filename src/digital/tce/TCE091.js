/* TCE091 DIGITAL INPUT SIGNAL DIAGNOSTICS(17) (331DM09784 page 58, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the
   digital input diagnostics sheets (tce/_lib.js, TCE_LIB.did); the places are those of the page set straight, as on TCE075.
   Shaft vibration very high (C) of the four bearings, as TCE075 has (A) and TCE083 (B). For No.3 and No.4 the drawing prints two stray characters
   between HIGH and (C) (a box and "@", a wide space that the drawing tool could not print); they are typed as the space they stand for. */
(function () {
  if (typeof window === 'undefined') return;
  const R = ['TCP1054', 'TCP2054', 'TCP3054'],
    V = s => {
      const L = [s + ' SHAFT VIBRATION', 'VERY HIGH (C)'];
      return { in: [L, L, L], out: [L, L, [...L, 'INPUT ERROR']] };
    };
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.did({
      id: 'TCE091',
      title: 'DIGITAL INPUT SIGNAL DIAGNOSTICS(17)',
      page: 58,
      f: [180, 75, 2232, 1535],
      tops: [103, 391, 668, 976],
      line2: '',
      g: [
        [V('NO.1 BEARING'), 'B1', 'A', ['001', '004', '032'], ['003', '005', '007'], '031', 'TCE091_1', null, R],
        [V('NO.2 BEARING'), 'B2', 'B', ['008', '011', '033'], ['010', '012', '014'], '009', 'TCE091_3', null, R],
        [V('NO.3 GEN.'), 'B3', 'C', ['015', '018', '034'], ['017', '019', '021'], '016', 'TCE091_5', null, R],
        [V('NO.4 GEN.'), 'B4', 'D', ['022', '025', '035'], ['024', '026', '030'], '023', 'TCE091_7', null, R]
      ],
      or: ['027', '028'],
      e: ['E', ['TCE471']],
      foot: [[247, 1512, 'CONTROLLER:'], [408, 1512, 'EHG+MD'], [670, 1485, 'TRIGGER  :'], [670, 1512, 'CYCLE(ms):30']]
    })
  );
})();
