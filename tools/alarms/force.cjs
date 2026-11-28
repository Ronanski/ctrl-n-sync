/* Phase 10 item 2: every alarm row of src/data/alarms forced past its list set point, from the 150 MW start of the app, headless
   (tools/trace/world.cjs = the same src the Worker runs). Not one plant per row: the points are forced together, one level at a time
   (pass H: each analog point just past its HIGH and under its HIGH-HIGH; pass HH; pass L; pass LL; pass S: each switch in its alarm
   state), so one run is a few plant seconds. A row passes when its own line comes (AN.laneAlm, the call of the alarm scan) with the
   row's priority (AN.almPri), and every line is gone after the forces are taken off and the 150 MW save is put back.
   Forcing: the AI block output nets of the point on the ABC sheets (S.rt.force), the field value (AN.fieldRead), the DITL analog value
   (s.avw) of a row that names the tag, the switch (WORLD.plantSwSet); a row whose point has no registered source gets no line, as in
   the app, and is listed as "no source".
   Usage: node tools/alarms/force.cjs [out.json]   (prints the counts; tests/lanes/qa/phase10-force.cjs checks them) */
const W = require('../trace/world.cjs'),
  fs = require('fs');
const N = t => String(t || '').replace(/[^A-Z0-9]/gi, '').toUpperCase();
async function run() {
  const E = W.load();
  await E.start('150');
  E.step(4);
  const AN = E.AN,
    c = E.ctx,
    DS = E.js('S');
  const L = c.LANE_ALARMS || c.window.LANE_ALARMS || [];
  const lines = () => new Map(AN.laneAlm(new Map()));
  const restore = async () => {
    await E.js('DITL150.savePut({kf:AN.st150.kf,kd:AN.st150.kd,ver:AN.st150.ver||"st150"})');
    E.step(4);
  };
  const base = new Set(lines().keys());
  /* the points */
  const P = new Map();
  for (const r of L) {
    const k = r.stn - 100 + '|' + r.addr;
    if (!P.has(k)) P.set(k, { key: k, tag: r.tag, io: r.io, rows: [] });
    P.get(k).rows.push(r);
  }
  const AIs = key => {
    const o = [];
    for (const sh of AN.sheets) {
      if (/^ABC-000/.test(sh.name) || !sh.S) continue;
      const S = sh.S;
      for (const b of S.blk) {
        if (b.k !== 'AI' || !b.o || b.o[0] == null) continue;
        const m = /^(?:S(\d)\s*)?(AI\d{4})$/.exec((AN.nm(S, b.o[0]) || '').trim());
        if (m && (m[1] || sh.stn) + '|' + m[2] === key) o.push([S, b.o[0]]);
      }
    }
    return o;
  };
  const dsh = DS.sheets.concat(E.WORLD.inst || []);
  const DL = p => {
    const o = [];
    for (const s of dsh)
      for (const a of (s.nl && s.nl.an) || []) {
        const tt = N((String(a.label || '').match(/^\S+/) || [])[0]);
        if (tt && (tt === N(p.tag) || (p.io && tt === N(p.io)))) o.push([s, a.key]);
      }
    return o;
  };
  const fr0 = AN.fieldRead,
    pin0 = E.WORLD.plantIn;
  const res = new Map(); /* 'tag|lv' -> { ok, pri, why } */
  for (const r of L) res.set(r.tag + '|' + r.lv, { tag: r.tag, lv: r.lv, sys: '', line: false, pri: null, clear: null });
  /* a line of a point counts for every row of that point and level (the list's element 1 / 2 of one RTD = one DCS point, one line) */
  const pk = r => r.stn + '|' + r.addr + '|' + r.lv;
  const check = () => {
    const ln = lines();
    for (const [k, x] of ln) {
      const r0 = L.find(q => 'L|' + q.tag + '|' + q.lv === k);
      if (!r0) continue;
      for (const r of L.filter(q => pk(q) === pk(r0))) {
        const e = res.get(r.tag + '|' + r.lv);
        e.line = true;
        e.pri = AN.almPri(x).p === r.p;
      }
    }
  };
  /* analog passes */
  const an = [...P.values()].filter(p => p.rows.every(r => typeof r.sp === 'number'));
  for (const pass of ['HIGH', 'HIGH-HIGH', 'LOW', 'LOW-LOW']) {
    const up = /HIGH/.test(pass),
      F = new Map(),
      fld = new Map(),
      want = [];
    const nets = [],
      dls = [];
    for (const p of an) {
      const r = p.rows.find(q => q.lv === pass);
      if (!r) continue;
      const hh = p.rows.find(q => q.lv === (up ? 'HIGH-HIGH' : 'LOW-LOW'));
      let v;
      if (pass === (up ? 'HIGH' : 'LOW') && hh && hh.sp !== r.sp) v = (r.sp + hh.sp) / 2;
      else {
        const d = Math.max(Math.abs(r.sp) * 0.05, 0.5);
        v = up ? r.sp + d : r.sp - d;
      }
      /* the level the alarm gives at v: the most severe row of the side over / under v (the list's H = HH quirks give HH) */
      const hit = p.rows.filter(q => /HIGH/.test(q.lv) === up && (up ? v > q.sp : v < q.sp));
      const top = hit.find(q => /-/.test(q.lv)) || hit[0];
      if (top) want.push(top.tag + '|' + top.lv);
      for (const k of [p.key, N(p.tag)].concat(p.io ? [N(p.io)] : [])) fld.set(k, v);
      for (const [S, n] of AIs(p.key)) nets.push([S, n, v]);
      for (const [s, k] of DL(p)) dls.push([s, k, v]);
    }
    for (const [S, n, v] of nets) S.rt.force[n] = v;
    AN.fieldRead = k => (fld.has(k) ? fld.get(k) : fr0(k));
    E.WORLD.plantIn = A => {
      pin0(A);
      for (const [s, k, v] of dls) if (s.avw && s.avw[k] != null) s.avw[k] = v;
    };
    E.step(2);
    check();
    for (const [S, n] of nets) delete S.rt.force[n];
    AN.fieldRead = fr0;
    E.WORLD.plantIn = pin0;
    await restore();
  }
  /* switch pass (rows with on; a DITL-output row is put in its alarm by its switch input like the field would) */
  const sw = E.WORLD.plantSw();
  const swR = L.filter(r => (r.on === 0 || r.on === 1) && !r.ditl);
  const set = [];
  for (const r of swR) for (const m of sw) if (N(m.tag) === N(r.tag) || (r.io && N(m.tag) === N(r.io))) set.push({ sheet: m.sheet, row: m.row, tag: m.tag, on: r.on === 1 });
  E.WORLD.plantSwSet(set);
  /* a switch with no plant-model switch: its DI field row (src/world/field) read by tag */
  const swk = new Map();
  for (const r of swR) if (!set.some(q => N(q.tag) === N(r.tag) || (r.io && N(q.tag) === N(r.io)))) for (const k of [N(r.tag)].concat(r.io ? [N(r.io)] : [])) if (fr0(k) != null) swk.set(k, r.on);
  AN.fieldRead = k => (swk.has(k) ? swk.get(k) : fr0(k));
  check();
  /* a switch the plant model writes on an ABC digital input (unit.js U.diX: PS-CD1110-1 ~ 3, ABC-052): the label forced */
  const dif = [];
  for (const r of swR)
    for (const sh of AN.sheets) {
      if (!sh.S || String(sh.stn) !== String(r.stn - 100)) continue;
      sh.S.lab.forEach((z, n) => {
        if (z && String(z.t || '').trim() === r.addr) dif.push([sh.S, n, r.on]);
      });
    }
  for (const [S, n, v] of dif) S.rt.force[n] = v;
  E.step(1); /* the step puts the plant-model switches back to their process value: their check is above */
  check();
  for (const [S, n] of dif) delete S.rt.force[n];
  AN.fieldRead = fr0;
  await restore();
  const after = [...lines().keys()].filter(k => !base.has(k));
  const R = [...res.values()];
  for (const e of R) e.clear = !after.includes('L|' + e.tag + '|' + e.lv);
  const ditl = L.filter(r => r.ditl).map(r => r.tag + '|' + r.lv);
  return { rows: R.length, line: R.filter(e => e.line).length, pri: R.filter(e => e.line && e.pri).length, clear: R.filter(e => e.clear).length, standing150: [...base].sort(), ditl, noLine: R.filter(e => !e.line).map(e => e.tag + '|' + e.lv).sort() };
}
module.exports = { run };
if (require.main === module)
  run().then(o => {
    if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify(o, null, 1));
    console.log('rows ' + o.rows + ', line when forced ' + o.line + ', priority ok ' + o.pri + ', clear after ' + o.clear + ', standing at 150 MW ' + o.standing150.length + ', no line ' + o.noLine.length);
    process.exit(0);
  });
