/* Phase 5 BLOCK LIBRARY, DITL part (2026-11-25): every kind of DITL block is coded once (src/digital/parts/03b-sim.js simulateRun for
   the gates, tmStep for the timers) and is checked here against the meaning of its symbol, written here and not taken from the engine:
     AND = 1 when all inputs are 1; OR = 1 when any input is 1; NOT = 1 when its input is 0;
     FF = S sets, R resets, R wins when both are 1 (the set-priority FF, drawn with the mark on S, lets S win);
     comparator > / >= / < / <= against a set point or a second signal;
     ON delay = 1 after the input has been 1 for T, 0 at once when it drops; OFF delay = 1 at once, 0 after the input has been 0 for T;
     one shot = a pulse of T on the input 0 -> 1 (npulse: on 1 -> 0); flasher = ON / OFF times while the input is 1;
     sequence counter = +1 on each input edge (DITL-80 on 1 -> 0; bottom ash on 0 -> 1, its RESET on the next scan), RESET = 0.
   It also reads every DITL sheet as the app loads it (tools/trace world) and fails when a sheet uses a kind of block that has no check
   here, so a new kind cannot come in untested. */
'use strict';
const path = require('path');
const root = path.resolve(__dirname, '..', '..', '..');
const { load } = require(path.join(root, 'tools/trace/world.cjs'));
const E = load();
let bad = 0,
  n = 0;
const ok = (name, got, want) => {
  n++;
  if (got !== want) bad++, console.log('FAIL', name, 'got', got, 'expected', want);
};
/* a netlist of input rows 0..k-1 on nets 0..k-1 and one gate; act = the rows that are 1 */
const run = (g, k, on, extra) => {
  const nl = Object.assign({ n: k + 1, src: [...Array(k)].map((_, i) => ({ row: i, n: i })), gates: [g] }, extra || {});
  return E.ctx.simulateRun(nl, new Set(on))[k] ? 1 : 0;
};
const tt = (t, k, f) => {
  for (let m = 0; m < 1 << k; m++) {
    const on = [...Array(k).keys()].filter(i => m & (1 << i));
    ok(t + ' ' + m.toString(2).padStart(k, '0'), run({ t, ins: [...Array(k).keys()], out: [k] }, k, on), f(on.length, k));
  }
};
tt('AND', 3, (c, k) => (c === k ? 1 : 0));
tt('OR', 3, c => (c ? 1 : 0));
tt('NOT', 1, c => (c ? 0 : 1));
/* FF: nets 0 = S, 1 = R, output net 2; the memory stays in the gate between scans */
for (const spri of [false, true]) {
  const g = { t: 'FF', s: [0], r: [1], out: [2], q: 0, spri },
    nl = { n: 3, src: [{ row: 0, n: 0 }, { row: 1, n: 1 }], gates: [g] },
    q = on => (E.ctx.simulateRun(nl, new Set(on))[2] ? 1 : 0),
    nm = spri ? 'FF set-priority' : 'FF';
  ok(nm + ' start', q([]), 0);
  ok(nm + ' S', q([0]), 1);
  ok(nm + ' hold', q([]), 1);
  ok(nm + ' R', q([1]), 0);
  ok(nm + ' hold 0', q([]), 0);
  ok(nm + ' S and R', q([0, 1]), spri ? 1 : 0);
}
/* comparators: analog net 0 (key a), set point 5 or the second signal (key b) */
for (const [cmp, eq, pv, sp, want] of [['>', 0, 6, 5, 1], ['>', 0, 5, 5, 0], ['>', 1, 5, 5, 1], ['>', 1, 4.9, 5, 0],
  ['<', 0, 4, 5, 1], ['<', 0, 5, 5, 0], ['<', 1, 5, 5, 1], ['<', 1, 5.1, 5, 0]])
  for (const net of [false, true]) {
    const g = Object.assign({ t: 'CMP', ins: [0], out: [2], cmp, eq: !!eq }, net ? { spNet: 1 } : { sp }),
      nl = { n: 3, src: [], gates: [g], an: [{ net: 0, key: 'a', def: 0 }, { net: 1, key: 'b', def: 0 }], avk: { a: pv, b: sp } };
    ok('CMP ' + pv + ' ' + cmp + (eq ? '=' : '') + ' ' + (net ? 'signal ' : '') + sp, E.ctx.simulateRun(nl, new Set())[2] ? 1 : 0, want);
  }
/* timers: T = 2 s, steps of 0.5 s; inputs per step and the output wanted after each step */
const tm = (k, ins, want, x) => {
  const g = Object.assign({ k, tm: { fv: { v: 2, u: 'SEC' } }, st: { acc: 0, out: 0, pre: 0, run: 0 } }, x || {});
  const got = ins.map(i => (E.ctx.tmStep(g, i, 0.5), g.st.out)).join('');
  ok('timer ' + k + (x && x.nc ? ' nc' : x && x.ncp ? ' ncp' : '') + ' ' + ins.join(''), got, want);
};
tm('on', [1, 1, 1, 1, 1, 0, 1], '0001100');
tm('off', [1, 0, 0, 0, 0, 0, 1], '1111001');
tm('pulse', [0, 1, 1, 1, 1, 1, 1, 0, 1], '011110001');
tm('npulse', [1, 1, 0, 0, 0, 0, 0, 1], '00111100');
tm('flash', [1, 1, 1, 1, 0], '10010', { fl: [1, 1] });
tm('pulse', [0, 1, 0], '010', { nc: 1 });
tm('pulse', [0, 1, 0], '101', { ncp: 1 });
/* sequence counter on DITL-80 (down edge, g.up 0) and the bottom ash one (up edge, g.up 1): outputs at counts 1 and 2 */
for (const up of [0, 1]) {
  const g = { t: 'CNT', ins: [0], r: [1], out: [2, 3], ks: [1, 2], N: 0, up },
    nl = { n: 4, src: [{ row: 0, n: 0 }, { row: 1, n: 1 }], gates: [g] },
    s = on => {
      E.ctx.simulateRun(nl, new Set(on));
      return g.N;
    };
  const seq = [[0], [], [0], [], [1], [], [0], []].map(s).join('');
  ok('counter ' + (up ? 'up edge' : 'down edge'), seq, up ? '11222011' : '01120001');
}
/* every kind used on a DITL sheet has a check above */
const kindOf = g =>
  g.t + (g.t === 'TMR' ? ':' + (g.nc ? 'nc' : g.ncp ? 'ncp' : g.k) : g.t === 'CMP' ? ':' + g.cmp + (g.eq ? '=' : '') + (g.spNet !== undefined ? 'net' : '') : g.spri ? ':spri' : '');
const CHECKED = new Set('AND OR NOT FF FF:spri CNT TMR:on TMR:off TMR:pulse TMR:npulse TMR:flash TMR:nc TMR:ncp CMP:> CMP:>= CMP:< CMP:<= CMP:>net CMP:>=net CMP:<net CMP:<=net'.split(' '));
const used = E.js(
  '(()=>{const c={};for(const s of DITL.S.sheets){if(!s.nl)try{s.nl=netlist(s)}catch(e){continue};for(const g of s.nl.gates||[]){const k=(' +
    kindOf.toString() + ')(g);c[k]=(c[k]||0)+1}}return c})()'
);
for (const k of Object.keys(used)) if (!CHECKED.has(k)) bad++, console.log('FAIL kind ' + k + ' (' + used[k] + ' blocks) is used on a DITL sheet and has no check');
const total = Object.values(used).reduce((a, b) => a + b, 0);
console.log((bad ? 'FAIL' : 'PASS') + ' ditl-blocks: ' + n + ' checks of ' + CHECKED.size + ' kinds; sheets use ' + Object.keys(used).length + ' kinds, ' + total + ' blocks; wrong ' + bad);
process.exit(bad ? 1 : 0);
