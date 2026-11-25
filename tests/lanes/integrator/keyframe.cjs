/* Lane 0 (YUA): the keyframe (SAVE / LOAD, the hand-over to the Web Worker) carries the whole plant. A world at 150 MW is saved and put into
   a Cold world; then both run on. Every value of the unit model, of every ABC sheet, of the DITL outputs and of the TCS program is the same, at
   once and after 60 scans. Found by SAORI: the load made 66 values again (anTagsNow at the end of anStateApply). */
const path = require('path');
const { load } = require(path.join(__dirname, '../../../tools/trace/world.cjs'));
(async () => {
  const A = load();
  await A.start('150');
  A.step(20);
  const kf = JSON.stringify(A.AN.engState.capture()),
    kd = JSON.stringify(A.DITL.ditlCapture());
  const B = load();
  await B.start('cold');
  B.AN.engState.apply(JSON.parse(kf));
  B.DITL.ditlApply(JSON.parse(kd));
  let bad = 0;
  const same = t => {
    const D = [],
      seen = new Set();
    const walk = (x, y, p, d) => {
      if (D.length > 200 || d > 8 || typeof x === 'function' || typeof y === 'function') return;
      if (x && typeof x === 'object') {
        if (seen.has(x) || (x.blk && x.nets)) return;
        seen.add(x);
        if (!y || typeof y !== 'object') return void D.push(p);
        /* _dr / _dv: the DITL sheets the unit model reads (compared by their outputs below) */
        for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) if (k !== '_dr' && k !== '_dv') walk(x[k], y[k], p + '.' + k, d + 1);
      } else if (!Object.is(x, y)) D.push(p + ' ' + x + ' / ' + y);
    };
    walk(A.AN.unit, B.AN.unit, 'U', 0);
    A.AN.sheets.forEach((s, i) => s.S.rt.v.forEach((x, j) => Object.is(x, B.AN.sheets[i].S.rt.v[j]) || D.push(s.name + ' net ' + j)));
    for (const n of Object.keys(A.WORLD.out))
      if ([...A.WORLD.out[n]].sort().join() !== [...(B.WORLD.out[n] || [])].sort().join()) D.push('outputs of ' + n);
    const p = A.AN.tce(),
      q = B.AN.tce();
    p.v.forEach((x, i) => Object.is(x, q.v[i]) || D.push('TCS ' + i));
    bad += D.length;
    console.log((D.length ? 'FAIL ' : 'ok ') + t + ': ' + D.length + ' differences' + (D.length ? ': ' + D.slice(0, 8).join(' | ') : ''));
  };
  same('after the load');
  A.step(60);
  B.step(60);
  same('after 60 scans');
  console.log(bad ? 'FAIL' : 'OK: the keyframe carries the whole plant');
  process.exit(bad ? 1 : 0);
})();
