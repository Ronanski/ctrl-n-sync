/* Lane 6 (EIMI): the condenser tube cleaning sequence of src/analog/engine/pkg.js against the vendor control philosophy
   (GI 3862 106 09 014): whole sequences with the train alone (1 s steps), then the DCS buttons of DITL-119 in the world at 150 MW. */
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, '../../../src/analog/engine/pkg.js'), 'utf8');
const a = src.indexOf('const AN_CTC'),
  b = src.indexOf('/* level of a hopper');
const C = new Function(
  'anDlOut',
  src.slice(a, b) + ';return {K: AN_CTC, train: anCtcTrain, step: anCtcTrainStep, op: anCtcOp, start: anCtcStart, stop: anCtcStop};'
)(() => 0);
const bad = [];
let n = 0;
const ok = (c, m) => (n++, c || bad.push(m));
const Q = 15750;
/* a bench: one train with its inputs; run(sec) steps it, until(f, max) gives the seconds it took */
const bench = on => {
  const r = C.train(on ? 1 : 0),
    X = { r, pw: 1, per: 1, q: Q, p: [0, 0], c: null };
  X.run = s => {
    for (let i = 0; i < s; i++) C.step(r, X.pw, X.per, X.q, X.p, 1);
    return X;
  };
  X.until = (f, max) => {
    for (let i = 0; i <= max; i++) {
      if (f(r)) return i;
      C.step(r, X.pw, X.per, X.q, X.p, 1);
    }
    return -1;
  };
  X.op = (o, v, d) => C.op({ A: r, B: r, per: X.per }, 'A' + (d ? '-' + d : ''), o, v);
  X.pulse = i => {
    X.p[i] = 1;
    X.run(2);
    X.p[i] = 0;
    X.run(1);
  };
  X.run(3);
  return X;
};
const near = (x, v, t) => Math.abs(x - v) <= t;

/* 1 the whole cycle: start -> initial -> watering 300 s -> cleaning 8 h -> collection 30 min -> inlet valve -> idle 16 h -> new cycle */
let X = bench(0);
ok(X.r.rdy === 1 && X.r.st === 0, '1 ready');
X.pulse(0);
ok(X.r.st === 2, '1 watering after AUTO START, st ' + X.r.st);
ok(X.r.f1 && X.r.d.N02.c === 0, '1 watering: pump runs, outlet valve closed');
ok(near(X.until(r => r.st === 3, 400), C.K.wat, 10), '1 watering time');
X.run(30);
ok(X.r.op === 1, '1 in operation');
ok(near(X.until(r => r.st === 4, 40000), C.K.run, 60), '1 cleaning time 8 h');
X.run(40);
ok(X.r.f1 && X.r.d.N02.p === 0 && X.r.d.N01.p === 1 && !X.r.op, '1 collection: outlet valve closed, pump on');
ok(near(X.until(r => r.st === 5, 3000), C.K.col - 40, 5), '1 collection 30 min');
ok(near(X.until(r => r.st === 6, 60), C.K.vlv, 3) && !X.r.f1, '1 idle, pump off');
ok(near(X.until(r => r.st === 3, 70000), C.K.idle, 60), '1 new cycle after 16 h idle');

/* 2 AUTO STOP in the cleaning cycle: 30 min collection, then stopped; in watering: at once */
X = bench(1);
X.pulse(1);
ok(X.r.st === 4, '2 collection after AUTO STOP');
const ts = X.until(r => r.st === 0, 3000);
ok(near(ts, C.K.col + C.K.vlv, 10), '2 stopped after ' + ts + ' s');
X = bench(0);
X.pulse(0);
X.run(60);
X.pulse(1);
ok(X.until(r => r.st === 0, 60) >= 0 && !X.r.f1, '2 AUTO STOP in watering');

/* 3 normal backwash from each step, back to the right step */
X = bench(1);
X.op('dirt', 1.45);
ok(near(X.until(r => r.nb, 60), C.K.lead, 3), '3 request 30 s above 40 mbar');
ok(X.r.st === 4, '3 from the cycle: collection first');
ok(X.until(r => r.st === 7, 2000) > 1700 && !X.r.f1, '3 backwash after the collection, pump off');
X.run(40);
ok(X.r.d.T11.p === 1 && X.r.d.T12.p === 1 && X.r.dp === 0, '3 screens in BACKWASH');
ok(X.r.rdy === 0, '3 not ready while backwashing');
ok(near(X.until(r => r.st === 8, 2000), C.K.bw - 40, 5), '3 backwash 30 min');
ok(X.until(r => r.st !== 8, 400) > C.K.stab && X.r.st === 3 && !X.r.nb, '3 DP stabilizing 120 s, then the cycle, st ' + X.r.st);
X = bench(1);
X.until(r => r.st === 6, 40000);
X.run(600);
X.op('dirt', 1.45);
X.until(r => r.st === 7, 100);
ok(X.r.st === 7, '3 from idle: backwash at once');
X.until(r => r.st === 6, 3000);
ok(X.r.st === 6 && X.r.ti > 2000, '3 back to idle, idle time kept');
/* stop while backwashing: the backwash is completed, then stopped */
X = bench(1);
X.until(r => r.st === 6, 40000);
X.op('dirt', 1.45);
X.until(r => r.st === 7, 100);
X.pulse(1);
ok(X.r.st === 7, '3 AUTO STOP does not break the backwash');
ok(X.until(r => r.st === 0, 3000) > 0, '3 stopped after the backwash');

/* 4 still high after the backwash: held, hooter, FAULT RESET ends it when the dirt is gone */
X = bench(1);
X.op('dirt', 1.5);
X.until(r => r.st === 7, 3000);
X.until(r => r.st === 8, 3000);
X.op('dirt', 1.6);
ok(X.until(r => r.st === 9, 400) >= 0 && X.r.hld && X.r.hoot, '4 held by normal backwash');
X.run(60);
ok(X.r.d.T11.p === 1, '4 screens back to BACKWASH');
X.op('dirt', 1);
ok(X.op('reset') === '' && X.r.st === 0 && !X.r.nb, '4 FAULT RESET');

/* 5 emergency backwash: 5 min collection, then held */
X = bench(1);
X.op('dirt', 2);
ok(near(X.until(r => r.eb, 60), C.K.lead, 3), '5 request 30 s above 50 mbar');
ok(near(X.until(r => r.st === 10, 600), C.K.colE + C.K.vlv, 10) && X.r.hld, '5 held after a 5 min collection');
ok(!X.r.f1, '5 pump off');

/* 6 drive failures: valve 16 s, screen 25 s, pump trip; then everything to the initial position, no start until FAULT RESET */
X = bench(0);
X.op('fault', 1, 'N01');
X.pulse(0);
const tv = X.until(r => r.sf, 60);
ok(near(tv, C.K.vF, 4) && X.r.st === 11, '6 inlet valve stuck: sequence failure after ' + tv + ' s');
ok(X.op('reset') !== '', '6 reset refused while the fault is there');
X.op('fault', 0, 'N01');
ok(X.op('reset') === '' && X.r.st === 0 && X.run(2).r.rdy === 1, '6 reset, ready again');
X = bench(1);
X.until(r => r.st === 6, 40000);
X.op('fault', 1, 'T11');
X.op('dirt', 1.45);
X.until(r => r.st === 7, 100);
const tc = X.until(r => r.sf, 60);
ok(near(tc, C.K.sF, 3), '6 screen stuck: failure after ' + tc + ' s');
X = bench(1);
X.op('fault', 1, 'F01');
X.run(2);
ok(X.r.ms && !X.r.f1 && X.r.st === 11, '6 pump trip: summary failure');

/* 7 power failure: the drives stay, the pump stops; on return to the initial position, a new start is needed */
X = bench(1);
X.pw = 0;
X.run(60);
ok(!X.r.f1 && X.r.d.N01.p === 1 && !X.r.rdy, '7 power fails: valves stay, pump off');
X.pw = 1;
X.run(60);
ok(X.r.st === 0 && X.r.d.N01.p === 0 && X.r.d.N02.p === 0, '7 power back: initial position');
X.pulse(0);
ok(X.r.st === 2, '7 starts again by a new start');

/* 8 modes: MANUAL by hand only; LOCAL AUTO from the panel only; REMOTE AUTO from the DCS only */
X = bench(0);
ok(X.op('start') !== '', '8 panel start refused in REMOTE AUTO');
ok(X.op('start', 0, 'F01') !== '', '8 hand start refused in AUTO');
X.op('loc');
X.pulse(0);
ok(X.r.st === 0, '8 DCS start without effect in LOCAL AUTO');
ok(X.op('start') === '' && X.run(1).r.st > 0, '8 panel start in LOCAL AUTO');
ok(X.op('man') !== '', '8 no MANUAL while the sequence runs');
ok(X.op('seq') === '' && X.run(40).r.st === 0, '8 SEQUENCE STOP AND RESET');
ok(X.op('man') === '' && X.run(1).r.rdy === 0, '8 MANUAL: not ready');
X.op('start', 0, 'N01');
X.op('start', 0, 'F01');
X.run(20);
ok(X.r.d.N01.p === 1 && X.r.f1 && X.r.st === 0, '8 valve and pump by hand');
X.op('stop', 0, 'N01');
X.run(20);
ok(X.r.d.N01.p === 0, '8 valve closed by hand');
/* no start permissive */
X = bench(0);
X.per = 0;
X.run(1);
X.pulse(0);
ok(X.r.rdy === 0 && X.r.st === 0, '8 no start without the permissive of DITL-119');

/* 9 in the world: the two buttons of DITL-119 at 150 MW */
(async () => {
  const { load } = require('../../../tools/trace/world.cjs');
  const E = load();
  await new Promise(r => setTimeout(r, 300));
  await E.start('150');
  E.step(10);
  const c = E.AN.unit.pkg.ctcs;
  ok(c.per === 1 && c.A.op === 1 && c.A.rdy === 1 && c.B.op === 1, '9 in service at 150 MW');
  const dp = c.A.dp;
  ok(near(dp, C.K.dp * Math.pow(E.AN.unit.swQcA / C.K.q, 2), 0.5), '9 DP follows the sea water flow: ' + dp);
  console.log('condenser tube cleaning: ' + n + ' checks, problems ' + bad.length);
  for (const x of bad) console.log('  ' + x);
  process.exit(bad.length ? 1 : 0);
})().catch(e => {
  console.log('FAIL ' + e.stack);
  process.exit(1);
});
