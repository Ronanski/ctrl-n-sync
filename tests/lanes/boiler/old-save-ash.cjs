/* Lane 3 (beta.563): a save made before beta.563 (no separator position; the ON COMMAND latches of the bottom ash conveyors never set,
   the running bits of DITL-BA59 seeded) loads with its chain conveyor running (ditl150.js D.baSave): baConv 1, the latches of DITL-BA66 ~ 68
   set, the separator closed; the chain then stops on its STOP button (the plant follows the command). Headless world, no browser. */
const { load, gz } = require('../../../tools/trace/world.cjs');
const bad = [];
const ok = (c, m) => c || bad.push(m);
(async () => {
  const E = load();
  await new Promise(r => setTimeout(r, 300));
  await E.start('150');
  /* the old save: the start state as main had it before beta.563 (src/data/st150.txt of main 79c27fe, compared net by net with this one):
     the latch nets of DITL-BA66 ~ 69, the TWO-WAY CLOSE of BA60 and the motor outputs of BA71 at 0, the RUNNING bits of BA59 seeded */
  const sv = JSON.parse(gz('st150.txt')),
    NETS = { BA60: [7], BA66: [2, 23, 27, 32, 33, 34], BA67: [31, 32], BA68: [5, 29], BA69: [17, 19], BA71: [3, 4, 5] },
    OUT = { BA60: [0, 2, 5], BA66: [], BA67: [], BA68: [], BA69: [4], BA71: [10] };
  for (const x of sv.kd.sh) {
    const k = (/\)DITL-(BA\d+)$/.exec(x.name) || [])[1];
    if (NETS[k]) for (const i of NETS[k]) x.nl._v[i] = 0;
    if (k === 'BA59') for (const r of [7, 8, 9, 13]) x.s.sig[r + ':S'] = true;
  }
  for (const w of ['out', '_o'])
    for (const nm of Object.keys(sv.kd.W[w] || {})) {
      const k = (/\)DITL-(BA\d+)$/.exec(nm) || [])[1];
      if (OUT[k]) sv.kd.W[w][nm] = { $set: OUT[k] };
    }
  E.ctx.__old = sv;
  await E.js('DITL150.savePut({ kf: __old.kf, kd: __old.kd, ver: "save before beta.563" })');
  const W = E.WORLD,
    L = E.DITL.S.sheets.concat(W.inst || []),
    sh = n => L.find(x => x.name.endsWith(')' + n)),
    on = (n, r) => (W.out[sh(n).name] ? W.out[sh(n).name].has(r) : false);
  E.step(60);
  const U = E.AN.unit;
  ok(U.baConv === 1, 'old save: chain conveyor running (baConv ' + U.baConv + ')');
  ok(on('DITL-BA68', 4) && on('DITL-BA67', 4) && on('DITL-BA66', 5) && on('DITL-BA69', 4), 'old save: the ON COMMAND latches of BA66 ~ 69');
  ok(on('DITL-BA71', 7) && on('DITL-BA71', 8) && on('DITL-BA71', 9), 'old save: the motor outputs of screw, elevator, chain');
  ok(U.ba.tw === 0 && U.ba.sw.twC === 1 && U.ba.sw.twO === 0, 'old save: separator closed (' + U.ba.tw + ')');
  W.dpress('DITL-BA61', 1);
  E.step(20);
  ok(U.baConv === 0 && !on('DITL-BA68', 4), 'chain STOP: the chain follows its command (baConv ' + U.baConv + ')');
  console.log('old save bottom ash: problems ' + bad.length);
  for (const b of bad) console.log('  ' + b);
  process.exit(bad.length ? 1 : 0);
})();
