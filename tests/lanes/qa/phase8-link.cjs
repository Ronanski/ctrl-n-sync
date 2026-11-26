/* Phase 8 (communications): the Modbus link signals that the documents give, at 150 MW (docs/phase8/link.json 'tested'):
   the three package watch dogs change every DCS cycle and the DCS sends what the PLC returns, the TR communication errors are 0,
   the DCS alive bit changes every cycle and the TCS returns it, a line is dead after 10 s with no change and both dead = the DCS commands
   are OFF at the TCS (TCT090A), the Modbus I/F of the TCS is normal, and the gateway cabinet system alarm is 0 in service and 1
   when the instructor sets it. What the DCS itself does on a lost link (its timer) is not in the documents (link.json 'nosource'). */
'use strict';
const fs = require('fs'),
  path = require('path');
const { load, root } = require(path.join(__dirname, '..', '..', '..', 'tools', 'trace', 'world.cjs'));
let bad = 0;
const ok = (c, m) => c || (bad++, console.log('FAIL', m));
(async () => {
  const E = load(),
    AN = E.AN;
  E.ctx.__io = JSON.parse(fs.readFileSync(path.join(root, 'src/data/tcs-io.json'), 'utf8'));
  E.js('window.TCE_IO_LIVE = TCE_IO.make(__io)');
  await E.start('150');
  E.step(4);
  const mb = to => +E.js('TCE_IO_LIVE.mbRead(AN.unit, ' + JSON.stringify(to) + ')');
  /* [system, PLC back, DCS out] */
  const WD = [
    ['fa', '40009.15', '40052.15'],
    ['esp', '30018.15', '40026.1'],
    ['ctcs', '15', '18']
  ];
  const seen = WD.map(() => []);
  for (let i = 0; i < 6; i++) {
    E.step(1);
    WD.forEach(([s, back, out], k) => {
      const b = AN.pkgRead(s, back),
        o = AN.pkgRead(s, out);
      ok((b === 0 || b === 1) && b === o, s + ' watch dog step ' + i + ': back ' + b + ', out ' + o);
      seen[k].push(b);
    });
  }
  WD.forEach(([s], k) => ok(seen[k].every((v, i) => !i || v !== seen[k][i - 1]), s + ' watch dog does not change every cycle: ' + seen[k].join('')));
  for (let b = 0; b <= 4; b++) ok(AN.pkgRead('esp', b ? '30019.0' + b : '30019') === 0, 'TR0' + (b + 1) + ' communication error');
  /* the alive bit DCS -> TCS (DO25) changes every DCS cycle and the TCS sends it straight back (10068, TCT081D) */
  const al = [];
  for (let i = 0; i < 4; i++) {
    E.step(1);
    al.push([mb('MB:DO25'), mb('MB:10068')]);
  }
  ok(al.every(([o, b], i) => (o === 0 || o === 1) && b === o && (!i || o !== al[i - 1][0])), 'alive DO25 / echo 10068: ' + JSON.stringify(al));
  /* TCT090A: one line cut = still healthy on the other; after 10 s both dead = the DCS commands are OFF at the TCS, the TCS CRT still works */
  const T = (c, a) => E.js('AN.turbine(' + JSON.stringify(c) + ', ' + JSON.stringify(a) + ')');
  const lk = () => AN.unit.tlk;
  AN.fault('fs.tcs.linkA', true);
  E.step(18); /* one step = 0.5 s */
  ok(lk().A.dead === 0, 'line A dead before 10 s ' + JSON.stringify(lk()));
  E.step(4);
  ok(lk().A.dead === 1 && lk().B.dead === 0 && lk().off === 0, 'line A cut 12 s: A dead, B healthy ' + JSON.stringify(lk()));
  ok(!/Modbus/.test(T('auto', 1) || ''), 'DCS command refused with line B healthy');
  AN.fault('fs.tcs.linkB', true);
  E.step(22);
  ok(lk().off === 1, 'both lines cut: DCS commands OFF ' + JSON.stringify(lk()));
  ok(/TCT090A/.test(T('auto', 0) || '') && /TCT090A/.test(T('ibd', { id: 'TC-31', pb: 'START' }) || ''), 'ATS OFF / gland seal start refused with both lines dead');
  ok(!/TCT090A/.test(T('hold', 0) || ''), 'TCS CRT command still taken with both lines dead');
  const e1 = mb('MB:10068');
  E.step(2);
  ok(mb('MB:10068') === e1, 'echo 10068 held on a cut line');
  AN.fault('fs.tcs.linkA', false);
  AN.fault('fs.tcs.linkB', false);
  E.step(2);
  ok(lk().off === 0 && lk().A.dead === 0 && lk().B.dead === 0, 'lines back: healthy ' + JSON.stringify(lk()));
  ok(mb('TCA906-14') === 1 && mb('TCA906-15') === 1 && mb('TCA906-12') === 0 && mb('TCA906-13') === 0,
    'TCS Modbus I/F: CPU(A) / (B) normal, P.S.(A) / (B) abnormal ' + ['TCA906-14', 'TCA906-15', 'TCA906-12', 'TCA906-13'].map(mb));
  const fld = k => AN.unit.fld[k];
  ok(fld('GCS10FSYSERR') === 0 && fld('GCS10DESYSERR') === 0, 'gateway system alarms in service');
  AN.fault('fs.dcs.GCS10F-SYSERR', true);
  E.step(3);
  ok(fld('GCS10FSYSERR') === 1, 'GCS10F-SYSERR set by the instructor: ' + fld('GCS10FSYSERR'));
  AN.fault('fs.dcs.GCS10F-SYSERR', false);
  E.step(3);
  ok(fld('GCS10FSYSERR') === 0, 'GCS10F-SYSERR cleared');
  const L = JSON.parse(fs.readFileSync(path.join(root, 'docs/phase8/link.json'), 'utf8'));
  ok(L.tested.length >= 9 && L.nosource.every(x => x.why && x.why.length >= 30), 'docs/phase8/link.json');
  console.log(bad ? 'FAIL phase8-link: ' + bad : 'PASS phase8-link: ' + L.tested.length + ' link signals from the documents hold at 150 MW; ' + L.nosource.length + ' link behaviours have no document (link.json)');
  process.exit(bad ? 1 : 0);
})().catch(e => {
  console.error(e);
  process.exit(1);
});
