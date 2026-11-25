/* beta.560 (lane 0): the I/O address a machine copy shows and reads is the address of its own machine (QA trace B5), a copy row with no signal
   name takes no address of another row, and the DITL-BA rows that name a field switch by its tag alone read that switch. Node only. */
const { load } = require('../../../tools/trace/world.cjs');
const bad = [];
const ok = (c, m) => c || bad.push(m);
(async () => {
  const E = load();
  await new Promise(r => setTimeout(r, 300));
  const W = E.WORLD,
    all = E.DITL.S.sheets.concat(W.inst),
    copies = c => all.filter(s => s.name.endsWith(')' + c) || s.name.replace(/ #.*$/, '').endsWith(')' + c)),
    io = new Map();
  for (const r of E.ctx.window.WIRING) (io.get(r[2]) || io.set(r[2], []).get(r[2])).push(String(r[3]));
  let n = 0;
  /* every address text of these drawings: no copy shows an address whose I/O list tag is another machine's */
  for (const [c, re] of [
    ['DITL-13', /-([A-D])$/],
    ['DITL-18', /^B[IO]\d+-DO1043-([A-D])$/],
    ['DITL-117', /^SV[OC]-BH1060-([A-D])$/],
    ['DITL-21A', /^(?:M[OI][A-Z]|LO[SR])-L1060([A-D])$/]
  ])
    for (const s of copies(c)) {
      const L = (/ #([A-D])$/.exec(s.name) || [0, 'A'])[1],
        b = (s._inst && s._inst.base) || s,
        T = [...b.tx, ...Object.values(b.cells).flat()].map(t => t.t.trim()).filter(t => /^[\s/-]*[IO]\.[0-9A-F]{4}(?:[\s/]*(?:[IO]\.)?[0-9A-F]{2,4}(?![0-9A-F]))*$/.test(t));
      for (const t of new Set(T))
        for (const a of W.showText(s, t).match(/[IO]\.[0-9A-F]{4}/g) || []) {
          const m = (io.get(a) || []).map(q => re.exec(q)).filter(Boolean);
          if (!m.length) continue;
          n++;
          ok(m.some(q => q[1] === L), s.name + ' "' + t + '" shows ' + a + ' ' + (io.get(a) || []).join(' / '));
        }
    }
  ok(n > 60, 'address texts checked: ' + n);
  /* DITL-22 (#A ~ #D = LOP 1 / 2 of BFWP A, LOP 1 / 2 of BFWP B): the one address of the own LOP */
  const own = copies('DITL-22').map(s => ['O.0126/446', 'O.0127/447'].map(t => W.showText(s, t)).join(''));
  ok(own.join() === 'O.0126,O.0446,O.0127,O.0447', 'DITL-22 start command: ' + own);
  /* a row with no signal name */
  const at = (c, r) => W.addrK(all.find(s => s.name.endsWith(')' + c)), r - 1);
  ok(at('DITL-61A #B', 27) === 'M.1193' && at('DITL-61A #B', 25) === null, 'DITL-61A #B rows 27 / 25: ' + [at('DITL-61A #B', 27), at('DITL-61A #B', 25)]);
  for (const k of 'BCD') ok(at('DITL-117 #' + k, 2) === 'M.0861' && at('DITL-117 #' + k, 4) === 'M.0862', 'DITL-117 #' + k + ' rows 2 / 4');
  ok(at('DITL-24 #B', 25) === 'I.037C' && at('DITL-24 #B', 26) === 'I.005C', 'DITL-24 #B rows 25 / 26');
  /* DITL-BA01 / BA02 */
  await E.start('150');
  E.step(10);
  const sw = W.plantSw().filter(q => /DITL-BA0[12]$/.test(q.sheet)),
    on = (c, r) => (sw.find(q => q.sheet.endsWith(c) && q.row === r) || {}).on;
  ok(sw.length === 12, 'DITL-BA01 / BA02 switch rows: ' + sw.length);
  ok(on('BA01', 11) === true && on('BA01', 10) === false && on('BA01', 14) === true, 'DITL-BA01 rows 11 / 10 / 14');
  console.log('copy addresses: ' + n + ' texts, problems ' + bad.length);
  for (const x of bad.slice(0, 30)) console.log('  ' + x);
  process.exit(bad.length ? 1 : 0);
})().catch(e => {
  console.log('FAIL ' + e.stack);
  process.exit(1);
});
