/* Lane 0 (YUA): the TCS motors are driven by their own sheets TCE300 / 305 / 310, TCA655 / 680 / 700 (src/analog/engine/tcs-sheets.js), in the
   whole engine at 150 MW: the line-up stays, START / STOP need MANUAL, the standby in AUTO starts on the low discharge of the running pump, the
   emergency oil pump on both main oil pumps stopped, and the memory of the sheets goes with the state. */
const path = require('path');
const { load } = require(path.join(__dirname, '../../../tools/trace/world.cjs'));
(async () => {
  const E = load();
  await E.start('150');
  const U = () => E.AN.unit,
    c = () => U().tc || U().tco,
    bad = [],
    ok = (x, t) => x || bad.push(t),
    sec = s => E.step(s * 2),
    op = (p, o) => E.AN.turbine('oil', { p, op: o }),
    btn = (port, ms) => E.AN.turbine('tce', { port, ms });
  sec(6);
  let x = c();
  ok(x.mop + '' === 'true,false' && x.mopAu + '' === 'false,true' && x.cop + '' === 'true,false' && x.copAu + '' === 'false,true', 'line-up: A running, B in AUTO');
  ok(!x.eop && x.eopAu && x.vex && x.gse, 'EOP stopped in AUTO, extractor and exhauster running');
  ok(x.sm.ids.length === 14 && x.sm.v['TCE300:b007.STS'] === 1 && x.sm.v['TCE305:b031.STS'] === 1, 'the nets of the sheets');
  ok(/AUTO/.test(op('mopB', 'stop')) && /AUTO/.test(op('copB', 'start')), 'START / STOP in AUTO refused');
  ok(/^No TCS push button/.test(btn('CRT:TCE300.b007.TRIP')), 'an unknown button');
  /* the vapour extractor and the exhauster: the buttons of the IBD faceplates and of the TCE page are the same buttons */
  E.AN.turbine('ibd', { id: 'TB-12', pb: 'STOP' });
  sec(2);
  ok(!c().vex, 'TB-12 STOP = TCA655 STOP');
  btn('CRT:TCA655.mtr.START');
  sec(2);
  ok(c().vex, 'TCA655 START');
  E.AN.turbine('ibd', { id: 'TC-28', pb: 'AUTO' });
  sec(4);
  ok(c().gseAu && c().gse && /AUTO/.test(E.AN.turbine('ibd', { id: 'TC-28', pb: 'STOP' })), 'TC-28 AUTO: STOP refused');
  E.AN.turbine('ibd', { id: 'TC-28', pb: 'MANUAL' });
  sec(4);
  /* COP-B standby: both running, then the operator stops COP-B in MANUAL */
  op('copB', 'man');
  sec(1);
  op('copB', 'start');
  sec(4);
  ok(c().cop[1], 'COP-B START');
  op('copB', 'stop');
  sec(4);
  ok(!c().cop[1], 'COP-B STOP');
  /* the discharge of MOP-A falls under 5.6 while it runs: the standby in AUTO starts (TCE300, after the 10 s of A running) */
  const keep = JSON.parse(JSON.stringify(c().sm));
  ok(keep.n > 20 && keep.st['TCE300.b021'].auto === 1 && keep.st['TCE300.b007'].on === 1, 'the memory is plain data');
  const q = U();
  for (let i = 0; i < 8; i++) {
    q.loPa = 3;
    E.step(1);
  }
  ok(c().mop[1], 'MOP-B standby start on the low discharge of MOP-A');
  /* both main oil pumps stopped: the emergency oil pump (TCE310, 1 s) */
  op('mopB', 'man');
  sec(1);
  op('mopB', 'stop');
  op('mopA', 'stop');
  sec(5);
  ok(!c().mop[0] && !c().mop[1] && c().eop, 'both MOP stopped: EOP running ' + JSON.stringify([c().mop, c().eop]));
  console.log(bad.length ? 'FAIL ' + bad.join(' | ') : 'OK: TCS motors by TCE300 / 305 / 310, TCA655 / 680');
  process.exit(bad.length ? 1 : 0);
})();
