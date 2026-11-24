/* beta.540 (lane 0): DITL-38 is drawn once for eight valves: each copy shows the seven I/O points of its own valve, as the I/O list gives them. */
const { load } = require('../../../tools/trace/world.cjs');
const bad = [];
(async () => {
  const E = load();
  await new Promise(r => setTimeout(r, 300));
  const W = E.WORLD,
    L = E.DITL.S.sheets.concat(W.inst).filter(s => s.name.startsWith('(62)DITL-38')),
    TY = { MIL: 'MIL', MIT: 'MIT', ZSO: 'ZSO', ZSC: 'ZSC', TSC: 'TS', 'MCV OPEN COMMAND': 'MOR', 'MCV CLOSE COMMAND': 'MOS' };
  if (L.length !== 8) bad.push('8 valves, found ' + L.length);
  for (const s of L) {
    const dev = s._inst.lbl.replace('MV-', '');
    for (const t in TY) {
      const w = E.ctx.window.WIRING.filter(q => q[3] === TY[t] + '-' + dev),
        x = W.showText(s, t);
      if (!w.length || !x.endsWith(' ' + w[0][3] + ' ' + w[0][2])) bad.push(s.name + ' ' + t + ': ' + x);
      if (x.split(TY[t] + '-' + dev).length !== 2) bad.push(s.name + ' ' + t + ' names its point twice: ' + x);
    }
  }
  console.log('DITL-38 points: ' + L.length * 7 + ', problems ' + bad.length);
  for (const x of bad.slice(0, 20)) console.log('  ' + x);
  process.exit(bad.length ? 1 : 0);
})();
