/* TCE084 DIGITAL INPUT SIGNAL DIAGNOSTICS(10) (331DM09784 page 51, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the
   digital input diagnostics sheets (tce/_lib.js, TCE_LIB.did); the places are those of the page set straight, as on TCE075.
   Generator and unit transformer protection operated 2 and 5, boiler MFT 2 and generator lock out relay 86G-B. The names of the two input errors are
   typed as the drawing cuts them ("PROTECTION OPERATE", "PROTECTION OPERATED"). */
(function () {
  if (typeof window === 'undefined') return;
  const R = ['TCP1052', 'TCP2052', 'TCP3052'],
    T = 'GEN TRANSF. AND UNIT TRANSF.',
    P = (n, e) => {
      const L = [T, 'PROTECTION OPERATED ' + n];
      return { in: [L, L, L], out: [L, L, [T, e, 'INPUT ERROR']] };
    },
    M = ['BOILER MFT 2'],
    G = ['86G-B GEN LOCK OUT RELAY A', 'OPERATED'];
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.did({
      id: 'TCE084',
      title: 'DIGITAL INPUT SIGNAL DIAGNOSTICS(10)',
      page: 51,
      f: [180, 75, 2232, 1535],
      tops: [103, 391, 668, 976],
      line2: '',
      g: [
        [P(2, 'PROTECTION OPERATE'), 'B5', 'A', ['001', '004', '032'], ['003', '005', '007'], '031', 'TCE084_1', null, R],
        [P(5, 'PROTECTION OPERATED'), 'B6', 'B', ['008', '011', '033'], ['010', '012', '014'], '009', 'TCE084_3', null, R],
        [{ in: [M, M, M], out: [M, M, [...M, 'INPUT ERROR']] }, 'B7', 'C', ['015', '018', '034'], ['017', '019', '021'], '016', 'TCE084_5', null, R],
        [{ in: [G, G, G], out: [G, G, [...G, 'INPUT ERROR']] }, 'B8', 'D', ['022', '025', '035'], ['024', '026', '030'], '023', 'TCE084_7', ['TCE601'], R]
      ],
      or: ['027', '028'],
      e: ['E', ['TCE471']],
      foot: [[247, 1512, 'CONTROLLER:'], [408, 1512, 'EHG+MD'], [670, 1485, 'TRIGGER  :'], [670, 1512, 'CYCLE(ms):30']]
    })
  );
})();
