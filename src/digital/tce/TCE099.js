/* TCE099 DIGITAL INPUT SIGNAL DIAGNOSTICS(25) (331DM09784 page 66, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the
   digital input diagnostics sheets (tce/_lib.js, TCE_LIB.did); the places are those of the page set straight, as on TCE075.
   The energize commands of the fast acting solenoid valves of MSV(A), MSV(B), CV(A) and CV(B), each read from the three protection controllers
   (sheets TCP1210 / 1220 and so on). The input connectors have a single line here, and OUT of each block goes to its connector only (no lamp).
   The input error of the fourth block is named "P.S.NORMAL INPUT ERROR" in the drawing; typed as printed. The title block of this page
   prints PAGE 65 a second time; it is page 66 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  const F = s => {
      const L = [s + ' FAST ACTING SOLENOID', 'VALVE ENERGIZE COMMAND'];
      return { in: [L, L, L], out: [L, L, ['INPUT ERROR']] };
    },
    R1 = ['TCP1210', 'TCP2210', 'TCP3210'],
    R2 = ['TCP1220', 'TCP2220', 'TCP3220'],
    O = { conn: 1 },
    D = F('CV(B)');
  D.out[2] = ['P.S.NORMAL', 'INPUT ERROR'];
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.did({
      id: 'TCE099',
      title: 'DIGITAL INPUT SIGNAL DIAGNOSTICS(25)',
      page: 66,
      f: [180, 75, 2232, 1535],
      tops: [103, 391, 668, 976],
      line2: '',
      single: 1,
      g: [
        [F('MSV(A)'), 'A1', 'A', ['001', '004', '032'], ['003', '005', '007'], '031', '', ['TCE210'], R1, O],
        [F('MSV(B)'), 'B2', 'B', ['008', '011', '033'], ['010', '012', '014'], '009', '', ['TCE211'], R1, O],
        [F('CV(A)'), 'A', 'C', ['015', '018', '034'], ['017', '019', '021'], '016', '', ['TCE212'], R2, O],
        [D, 'B', 'D', ['022', '025', '035'], ['024', '026', '030'], '023', '', ['TCE212'], R2, O]
      ],
      or: ['027', '028'],
      e: ['E', ['-']],
      foot: [[247, 1512, 'CONTROLLER:'], [408, 1512, 'EHG+MD'], [670, 1485, 'TRIGGER  :'], [670, 1512, 'CYCLE(ms):30']]
    })
  );
})();
