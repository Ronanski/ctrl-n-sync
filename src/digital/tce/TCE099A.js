/* TCE099A DIGITAL INPUT SIGNAL DIAGNOSTICS(26) (331DM09784 page 67, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the
   digital input diagnostics sheets (tce/_lib.js, TCE_LIB.did); the places are those of the page set straight, as on TCE075.
   The energize commands of the fast acting solenoid valves of ICV(A) and ICV(B): two blocks only, OUT of each to its connector only, and no OR of
   the input errors. The title block of this page prints PAGE 65, as the page before it does; it is page 67 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  const F = s => {
      const L = [s + ' FAST ACTING SOLENOID', 'VALVE ENERGIZE COMMAND'];
      return { in: [L, L, L], out: [L, L, ['INPUT ERROR']] };
    },
    O = { conn: 1 };
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.did({
      id: 'TCE099A',
      title: 'DIGITAL INPUT SIGNAL DIAGNOSTICS(26)',
      page: 67,
      f: [180, 75, 2232, 1535],
      tops: [103, 391],
      line2: '',
      noOr: 1,
      g: [
        [F('ICV(A)'), 'C1', 'A', ['001', '004', '032'], ['003', '005', '007'], '031', '', ['TCE214'], ['TCP1230', 'TCP2230', 'TCP3230'], O],
        [F('ICV(B)'), 'C1', 'B', ['008', '011', '033'], ['010', '012', '014'], '009', '', ['TCE214'], ['TCP1231', 'TCP2231', 'TCP3231'], O]
      ],
      foot: [[247, 1512, 'CONTROLLER:'], [408, 1512, 'EHG+MD'], [670, 1485, 'TRIGGER  :'], [670, 1512, 'CYCLE(ms):30']]
    })
  );
})();
