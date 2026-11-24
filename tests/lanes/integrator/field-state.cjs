/* beta.530 (lane 0): the field states (FIELD.state, faults.js), the readers X.ftrip / X.fault / X.state, the model write mark s.src, the DITL-80L
   links (src/world/bind/integrator.json) with its 60 limit switches, the CEP windings and the lube oil switches of DITL-23B, in the one
   headless world of the app at 150 MW (tools/trace/world.cjs, no browser). */
const { load } = require('../../../tools/trace/world.cjs');
const bad = [];
const ok = (c, m) => c || bad.push(m);
(async () => {
  const E = load();
  await new Promise(r => setTimeout(r, 300));
  const W = E.WORLD,
    AN = E.AN,
    F = E.ctx.window.FIELD;
  for (const f of F.states) ok(f.tag && f.t && f.src && (f.normal === 0 || f.normal === 1), 'state ' + f.lane + ' ' + f.id + ': tag, t, src, normal 0 / 1');
  ok(new Set(F.states.map(f => f.id)).size === F.states.length, 'a field state id is used twice');
  F.state('t', [{ id: 't.gate', tag: 'ZSO-T', normal: 1, t: 'Test gate closed', g: 'Coal and limestone', src: 'test' }]);
  F.add('t', [
    { tag: 'T-ST', v: (U, X) => X.state('t.gate') },
    { tag: 'T-FT', v: (U, X) => X.ftrip('DITL-29A #B') },
    { tag: 'T-FA', v: (U, X) => X.fault('mt.swpb') },
    { tag: 'T-NO', v: (U, X) => X.fault('no.such') }
  ]);
  await E.start('150');
  E.step(10);
  const fld = k => AN.unit.fld[k];
  ok(fld('TST') === 1 && fld('TFT') === 0 && fld('TFA') === 0 && !('TNO' in AN.unit.fld), 'normal: ' + [fld('TST'), fld('TFT'), fld('TFA')]);
  const g = AN.faultGroups().find(q => q.g === 'Coal and limestone');
  ok(g && g.items.some(q => q.id === 'fs.t.gate' && !q.on), 'the state is in the Plant menu, in its own group');
  AN.fault('fs.t.gate', true);
  W.ftrip('mt.swpb', true);
  E.step(10);
  ok(fld('TST') === 0 && fld('TFT') === 1 && fld('TFA') === 1, 'instructor: ' + [fld('TST'), fld('TFT'), fld('TFA')]);
  AN.fault('fs.t.gate', false);
  W.ftrip('mt.swpb', false);
  E.step(4);
  ok(fld('TST') === 1 && fld('TFT') === 0 && fld('TFA') === 0, 'cleared');
  let src = 0;
  for (const s of AN.sheets) for (const q of Object.values((s.S && s.S.rt && s.S.rt.st) || {})) if (q && q.src) src++;
  ok(src > 100, 'the model write mark s.src: ' + src);
  /* DITL-80L: the normal state of 150 MW and the links */
  const all = E.DITL.S.sheets.concat(W.inst),
    l = all.find(s => s.name.endsWith(')DITL-80L')),
    on = i => (W.out[l.name] && W.out[l.name].has(i) ? 1 : 0);
  ok(W.plantSw().filter(q => /DITL-80L$/.test(q.sheet)).length === 60, '60 limit switch rows of DITL-80L');
  ok([60, 62, 64, 66].map(on).join('') === '1111' && [61, 63, 65, 67].map(on).join('') === '0000', 'DITL-80L at 150 MW: ' + [60, 61, 62, 63, 64, 65, 66, 67].map(on));
  const n14 = all.find(s => s.name.endsWith(')DITL-80G #N-1014'));
  n14._lance.x = n14._lance.len;
  n14._lance.dir = -1;
  E.step(1); /* the limit switch at the end of the stroke, before the lance comes back */
  ok(on(60) === 0 && on(61) === 1 && on(63) === 1, 'lance N-1014 out: ' + [60, 61, 62, 63].map(on));
  const din = c => {
    const s = all.find(x => x.name.endsWith(')' + c)),
      m = W.idx.din.get(s);
    return [...(m || [])].map(([r, q]) => r + 1 + ':' + q.map(x => (x.d ? x.d.name.replace(/^.*\)/, '') + '/' + x.row : '')).join(','));
  };
  ok(din('DITL-80').includes('14:DITL-80L/60'), 'DITL-80 row 14');
  ok(din('DITL-80G #N-1014').includes('10:DITL-80L/61'), 'DITL-80G #N-1014 row 10');
  ok(din('DITL-120 #B').includes('13:DITL-111/7') && din('DITL-120 #B').includes('14:DITL-111 #B/7'), 'DITL-120 #B rows 13 / 14: ' + din('DITL-120 #B'));
  /* the CEP windings: above the room with the pump running, at the room with it stopped */
  const t = AN.unit.mt || {};
  const run = 'AB'.split('').map(k => (AN.unit['cdI' + 'AB'.indexOf(k)] > 1 ? 1 : 0));
  ok(run[0] + run[1] > 0 && 'AB'.split('').every((k, i) => isFinite(t['TT-CD1116-' + k + 'U']) && (run[i] ? t['TT-CD1116-' + k + 'U'] > 50 : t['TT-CD1116-' + k + 'U'] < 50)), 'CEP windings ' + JSON.stringify([run, t['TT-CD1116-AU'], t['TT-CD1116-BU']]));
  const sw = W.plantSw();
  ok('AB'.split('').every(k => ['1', '2', '3'].every(n => sw.some(q => q.tag === 'PS-LO1115-' + k + n))), 'PS-LO1115 switches of DITL-23B');
  console.log('field state: lane states ' + (F.states.length - 1) + ', src ' + src + ', problems ' + bad.length);
  for (const x of bad.slice(0, 40)) console.log('  ' + x);
  process.exit(bad.length ? 1 : 0);
})().catch(e => {
  console.log('FAIL ' + e.stack);
  process.exit(1);
});
