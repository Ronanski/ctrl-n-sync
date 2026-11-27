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
  const P = () => E.AN.tce(),
    net = n => P().v[P().idx.get(n)];
  ok(P().drv.length === 14 && P().plan.length > 400 && net('TCE300:b007.STS') === 1 && net('TCE305:b031.STS') === 1, 'the nets of the sheets');
  ok(net('TCE050:tp002') === 1 && net('TCA100:tpA001') === 1, 'INITIAL is over: the controllers are in service');
  ok(P().fed > 200, 'the inputs of the TCS I/O list ' + P().fed);
  ok(/AUTO/.test(op('mopB', 'stop')) && /AUTO/.test(op('copB', 'start')), 'START / STOP in AUTO refused');
  ok(/^No TCS push button/.test(btn('CRT:TCE300.b007.TRIP')), 'an unknown button');
  ok(btn('CRT:TCA501.TCA501_1_IYS') === '', 'a button of a sheet that does not drive yet');
  sec(1);
  ok(net('CRT:TCA501.TCA501_1_IYS') === 1, 'its port is on');
  sec(5);
  ok(net('CRT:TCA501.TCA501_1_IYS') === 0, 'and off after 3 s');
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
  ok(keep.n > 20 && keep.mot['TCE300.b021'].auto === 1 && keep.mot['TCE300.b007'].on === 1, 'the memory is plain data');
  /* the keyframe carries the whole program: every net the same after it is put in */
  const kf = JSON.stringify(E.AN.engState.capture()),
    v1 = P().v.slice();
  sec(3);
  E.AN.engState.apply(JSON.parse(kf));
  ok(P().v.every((q, i) => Object.is(q, v1[i])), 'keyframe: the nets come back');
  E.step(1);
  ok(c().mop[0] && c().sm.n === keep.n + 1, 'and the program goes on from it');
  /* the discharge falls at a physical rate: TCE102 m1 AI DIAG.MD (LME510, PT-LOn922-A, drawn settings DEV HL 2.0 / LL -2.0 kg/cm2g,
     DEF TP 0.03 S, DEF N 3; src/digital/tce/TCE102.js row 1, src/digital/tce/_lib.js aid) is the rate check of TC-14-116 p 1298 No. 4
     ("an excessively large rate of signal change"): a fall of more than 2.0 kg/cm2g between two samples is a bad transmitter, the
     block holds the last good value and the low pressure never reaches CPL A030 (TCE300, LL 5.6). A step 6.63 -> 3 in one scan is such
     a jump (it failed whenever the 150 MW start carried the inner state of the TCS macros). 0.5 kg/cm2g a scan (1 kg/cm2g/s) is a pump
     losing its discharge, under the rate limit, and reaches 3 in about 4 s */
  const q = U();
  let p = q.loPa;
  for (let i = 0; i < 16; i++) {
    p = Math.max(3, p - 0.5);
    q.loPa = p;
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
