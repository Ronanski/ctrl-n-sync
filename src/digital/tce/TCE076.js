/* TCE076 DIGITAL INPUT SIGNAL DIAGNOSTICS(2) (331DM09784 page 43, controller EHG+MD, cycle 30 ms). Typed from the drawing with the builder of the
   digital input diagnostics sheets (tce/_lib.js, TCE_LIB.did); the scan is turned a little, as on TCE075, and the places are those of the page set
   straight. The names are typed as the drawing prints them, also where it breaks a word ("OPERATE" / "D FOR GEN.") or cuts a name short
   ("FOR GEN. PROTEC"). */
(function () {
  if (typeof window === 'undefined') return;
  const T = 'GEN TRANSF. PROTECTION OPERATED',
    A = [T, 'FOR GEN. PROTECTION A (86T)'],
    A2 = ['GEN TRANSF. PROTECTION OPERATE', 'D FOR GEN. PROTECTION A (86T)'],
    B = [T, 'FOR GEN. PROTECTION B (86T)'],
    M = ['BOILER MFT 1'],
    G = ['86G-A GEN LOCK OUT RELAY A', 'OPERATED'];
  (window.TCE_SHEETS = window.TCE_SHEETS || []).push(
    window.TCE_LIB.did({
      id: 'TCE076',
      title: 'DIGITAL INPUT SIGNAL DIAGNOSTICS(2)',
      page: 43,
      f: [180, 75, 2232, 1535],
      tops: [103, 391, 668, 976],
      line2: '',
      g: [
        [{ in: [A, A2, A2], out: [A, A, [T, 'FOR GEN. PROTEC', 'INPUT ERROR']] }, 'B5', 'A', ['001', '004', '032'], ['003', '005', '007'], '031', 'TCE076_1'],
        [{ in: [B, B, B], out: [B, B, [T, 'PROTECTION B INPUT ERROR']] }, 'B6', 'B', ['008', '011', '033'], ['010', '012', '014'], '009', 'TCE076_3'],
        [{ in: [M, M, M], out: [M, M, [...M, 'INPUT ERROR']] }, 'B7', 'C', ['015', '018', '034'], ['017', '019', '021'], '016', 'TCE076_5'],
        [{ in: [G, G, G], out: [G, G, [...G, 'INPUT ERROR']] }, 'B8', 'D', ['022', '025', '035'], ['024', '026', '030'], '023', 'TCE076_7', ['TCE601']]
      ],
      or: ['027', '028'],
      e: ['E', ['TCE471']],
      foot: [[247, 1512, 'CONTROLLER:'], [408, 1512, 'EHG+MD'], [670, 1485, 'TRIGGER  :'], [670, 1512, 'CYCLE(ms):30']]
    })
  );
})();
