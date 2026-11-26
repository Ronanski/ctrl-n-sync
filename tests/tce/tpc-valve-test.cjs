/* Phase 6 TCS (lane 1, 2026-11-26): ICV(A) / (B) FAST ACTING DURING VALVE TEST, output E of TCPn230 / n231 to TCE116 E (engine/tcs-tpc.js),
   the TPC logic of the HIACS backup (FNCTCP1230 / 1231, lane 0 read phase6-tcs-tpc-sources-2026-11-26.md part A):
     E = A005 or (TD007 8 s of A005 and not RSV FULL OPEN),  A005 = TD004 2 s of (CRV TEST COMMAND and ICV TEST POSITION) and not TD 2 s
     (B: 2.5 s) of (PLU or ACCELERATION RELAY).
   The TCE outputs it reads are given by a probe (the program itself is not changed). Usage: node tests/tce/tpc-valve-test.cjs */
const { loadEngine } = require('../../tools/engine/node-engine.js');
(async () => {
  const { win } = await loadEngine({
    patch: c =>
      c
        .replace('/* the ports of the program: [[slots', 'globalThis.__tpc = TCS_TPC;\n/* the ports of the program: [[slots')
        .replace('const tceOn = (U, sh, k) =>', 'const tceOn = (U, sh, k) => globalThis.__in ? (globalThis.__in[sh + ":" + k] ? 1 : 0) : ')
  });
  let bad = 0;
  const ok = (c, m) => (c || bad++, console.log((c ? 'PASS ' : 'FAIL ') + m));
  const T = win.__tpc;
  ok(T && T['230.E'] && T['231.E'], 'TCP230.E and TCP231.E are fed');
  if (!T) process.exit(1);
  const c = {},
    I = (win.__in = {}),
    run = (key, s, h = 0.1) => {
      let y = 0;
      for (let t = 0; t < s - 1e-9; t += h) y = T[key]({}, c, h);
      return y;
    };
  const A = '230.E',
    B = '231.E';
  ok(run(A, 1) === 0, 'A: no test: 0');
  Object.assign(I, { 'TCE226:oB1': 1, 'TCE227:oB1': 1 });
  ok(run(A, 0.1) === 1, 'A: CRV(A) TEST COMMAND and ICV(A) TEST POSITION: 1');
  Object.assign(I, { 'TCE226:oB1': 0, 'TCE227:oB1': 0 });
  ok(run(A, 1.9) === 1, 'A: held 2 s (TD 004) after the test ends');
  ok(run(A, 6) === 1, 'A: then held to 8 s (TD 007) while RSV(A) is not full open');
  ok(run(A, 3) === 0, 'A: off after the 8 s hold');
  Object.assign(I, { 'TCE226:oB1': 1, 'TCE227:oB1': 1 });
  run(A, 0.5);
  I['TCE227:oC1'] = 1;
  Object.assign(I, { 'TCE226:oB1': 0, 'TCE227:oB1': 0 });
  ok(run(A, 2.2) === 0, 'A: RSV(A) FULL OPEN ends the hold after TD 004');
  ok(run(A, 9) === 0, 'A: rest');
  I['TCE227:oC1'] = 0;
  /* PLU blocks; its 2 s (A) / 2.5 s (B) hold too */
  Object.assign(I, { 'TCE043:b15': 1 });
  Object.assign(I, { 'TCE226:oB1': 1, 'TCE227:oB1': 1, 'TCE226:oE1': 1, 'TCE228:oB1': 1 });
  const a = run(A, 0.5),
    b = run(B, 0.5);
  ok(a === 0 && b === 0, 'PLU OPERATED blocks A and B');
  I['TCE043:b15'] = 0;
  ok(run(A, 2.1) === 1, 'A: free 2 s after PLU');
  ok(run(B, 2.1) === 0 && run(B, 0.5) === 1, 'B: free 2.5 s after PLU (TD 011)');
  process.exit(bad ? 1 : 0);
})();
