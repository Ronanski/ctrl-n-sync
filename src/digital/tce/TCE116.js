/* TCE116 TPC SIGNAL DIAGNOSTICS(6) (331DM09784 page 80, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the digital
   input diagnostics sheets (tce/_lib.js, TCE_LIB.did); the places are those of the page set straight, as on TCE075.
   ICV(A) and ICV(B) fast acting during valve test, each read from the three protection controllers, and two spare signals. The names are typed
   as the drawing prints them: it breaks the word VALVE over two lines ("DURING V" / "ALVE TEST") on most lines and not on others, and it
   writes "DICREPANCY" on the first two blocks. The title block of this page prints PAGE 78; it is page 80 of the document. */
(function () {
  if (typeof window === 'undefined') return;
  const V = s => ['ICV(' + s + ') FAST ACTING DURING V', 'ALVE TEST'],
    W = s => ['ICV(' + s + ') FAST ACTING', 'DURING VALVE TEST'],
    S = ['(SPARE)'],
    N = { in: [S, S, S], out: [S, S, ['DISCREPANCY']] },
    NR = ['-', '-', '-'];
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.did({
      id: 'TCE116',
      title: 'TPC SIGNAL DIAGNOSTICS(6)',
      page: 80,
      f: [180, 75, 2232, 1535],
      tops: [103, 391, 668, 976],
      line2: '',
      orName: 'DISCREPANCY',
      g: [
        [{ in: [V('A'), W('A'), V('A')], out: [V('A'), V('A'), [V('A')[0], 'ALVE TEST DICREPANCY']] }, 'E', 'A', ['001', '004', '032'], ['003', '005', '007'], '031', 'TCE116_1', ['TCE227'], ['TCP1230', 'TCP2230', 'TCP3230']],
        [{ in: [V('B'), V('B'), V('B')], out: [W('B'), W('B'), [W('B')[0], 'DURING VALVE TEST DICREPANCY']] }, 'E', 'B', ['008', '011', '033'], ['010', '012', '014'], '009', 'TCE116_3', ['TCE228'], ['TCP1231', 'TCP2231', 'TCP3231']],
        [N, 'B11', 'C', ['015', '018', '034'], ['017', '019', '021'], '016', 'TCE116_5', null, NR],
        [N, 'B12', 'D', ['022', '025', '035'], ['024', '026', '030'], '023', 'TCE116_7', null, NR]
      ],
      or: ['027', '028'],
      e: ['E', ['-']],
      foot: [[247, 1512, 'CONTROLLER:'], [408, 1512, 'EHG+MD'], [670, 1485, 'TRIGGER  :'], [670, 1512, 'CYCLE(ms):30']]
    })
  );
})();
