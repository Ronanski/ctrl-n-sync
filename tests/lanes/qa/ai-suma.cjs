/* Phase 5 BLOCK LIBRARY, AI (transmitter input) and SUMA (totalizer) (2026-11-26): every AI and SUMA block of every ABC sheet,
   each alone in its own sheet (only that sheet scans), PLANT MODEL OFF, headless in every Checks run.
   - AI with a position feedback (valve / damper ZT): the value is the position scaled on the range of the block, lo + (hi - lo) x pos / 100
     (a linear 0 ~ 100 % signal on the range printed at the block; ABC-AUDIT "AI ranges against the workbooks").
   - AI with no feedback (a transmitter): the value typed by the user (PLANT MODEL OFF) reaches the output, inside the range.
   - SUMA: a flow of 12 per hour for one hour gives 12 (ABC-AUDIT.md "SUMA integration: 12 / h for 1 h = 12", batch 28).
   - AI on SIG.AB (YUA PC read 2026-11-26, FCS2000 Function Edition p.2-189 and p.2-186): with the flag forced (card / channel error) the
     AI still sends its input value and the flag is 1; a value of 115 % of the range (112.5 % or more) sets the flag by itself.
   - SUMA CUT and RSTS (FE p.2-110): a PV below CUT counts as 0; the total clears to 0 when it goes above RSTS.
   Fails on any FAIL or fewer blocks than the floor. Usage: node tests/lanes/qa/ai-suma.cjs */
'use strict';
const path = require('path');
const root = path.resolve(__dirname, '..', '..', '..');
const { load } = require(path.join(root, 'tools/trace/world.cjs'));
const FLOOR = { ai: +(process.env.AI_FLOOR || 198), suma: +(process.env.SUMA_FLOOR || 7) }; /* first run 2026-11-26: 136 + 62 AI, 7 SUMA */
const E = load(),
  AN = E.AN,
  anStep = E.js('ENGINE.E.anStep'),
  clone = E.js('x => structuredClone(x)');
const t0 = Date.now();
AN.reset();
AN.plantOn = false; /* PLANT MODEL OFF as the app's switch (plant-window.js plantSwitch): also the coal feeder load cells of ABC-004A ~ C */
for (const x of AN.sheets) if (x.S) for (const b of x.S.procs || []) b.proc.on = false;
const bad = [],
  n = { ai: 0, aiFb: 0, suma: 0, sig: 0, flag: 0, skip: {} };
const skip = w => (n.skip[w] = (n.skip[w] || 0) + 1);
for (const sh of AN.sheets) {
  if (/ABC-000/.test(sh.name)) continue;
  let S;
  try {
    S = AN.ensure(sh);
  } catch (e) {
    continue;
  }
  for (const b of S.procs || []) b.proc.on = false;
  for (let i = 0; i < 6; i++) anStep(S, 0);
  const base = clone(S.rt),
    lab = b => (S.lab[(b.o || [])[0]] || {}).t || '';
  for (const b of S.blk) {
    if (b.k === 'AI') {
      const o = (b.o || [])[0];
      if (o == null || o < 0) {
        skip('AI with no output net');
        continue;
      }
      if (b.sig && S.rt.st[b.sig.id] && S.rt.st[b.sig.id].val > 0.5) {
        skip('AI on SIG.AB at the start (NO-SOURCE value)');
        continue;
      }
      const r = b.rng || { lo: 0, hi: 100 },
        sp = r.hi - r.lo;
      S.rt = clone(base);
      if (b.fb) {
        const fs = (S.rt.st[b.fb.id] = S.rt.st[b.fb.id] || {});
        let ok = true;
        for (const pos of [0, 25, 100]) {
          fs.pos = pos;
          /* the actuator moves its position at its stroke rate toward its own command: step until the position holds, then compare */
          let last = NaN;
          for (let k = 0; k < 400 && fs.pos !== last; k++) {
            last = fs.pos;
            for (let i = 0; i < 5; i++) anStep(S, 0.2);
          }
          const want = r.lo + (sp * fs.pos) / 100; /* the actuator moves its position at its stroke rate: the value follows the position it has now */
          if (Math.abs(S.rt.v[o] - want) > 1e-6 * Math.max(1, Math.abs(sp))) ok = false;
        }
        n.aiFb++;
        if (!ok) bad.push(sh.name + ' AI#' + b.id + ' ' + lab(b) + ' position feedback: the value is not lo + (hi - lo) x pos / 100');
      } else {
        const st = (S.rt.st[b.id] = S.rt.st[b.id] || {}),
          want = r.lo + 0.37 * sp;
        st.val = want;
        for (let i = 0; i < 200; i++) anStep(S, 0.5);
        n.ai++;
        if (!(Math.abs(S.rt.v[o] - want) <= 1e-6 * Math.max(1, Math.abs(sp)))) bad.push(sh.name + ' AI#' + b.id + ' ' + lab(b) + ': set ' + want + ', output ' + S.rt.v[o]);
        if (b.sig && S.rt.st[b.sig.id]) {
          const g = S.rt.st[b.sig.id],
            fo = (S.blk.find(q => q.id === b.sig.id).o || [])[0];
          g.val = 1;
          for (let i = 0; i < 4; i++) anStep(S, 0.5);
          n.sig++;
          if (fo != null && fo >= 0) n.flag++;
          if (!(Math.abs(S.rt.v[o] - want) <= 1e-6 * Math.max(1, Math.abs(sp)))) bad.push(sh.name + ' AI#' + b.id + ' ' + lab(b) + ' SIG.AB forced: the output ' + S.rt.v[o] + ' is not the input value ' + want);
          if (fo != null && fo >= 0 && S.rt.v[fo] !== 1) bad.push(sh.name + ' AI#' + b.id + ' ' + lab(b) + ' SIG.AB forced: the flag is ' + S.rt.v[fo]);
          g.val = 0;
          st.val = r.lo + 1.15 * sp;
          for (let i = 0; i < 200; i++) anStep(S, 0.5);
          if (fo != null && fo >= 0 && S.rt.v[fo] !== 1) bad.push(sh.name + ' AI#' + b.id + ' ' + lab(b) + ' at 115 % of the range: the SIG.AB flag is ' + S.rt.v[fo] + ', not 1 (FE p.2-186)');
          if (!(Math.abs(S.rt.v[o] - st.val) <= 1e-6 * Math.max(1, Math.abs(sp)))) bad.push(sh.name + ' AI#' + b.id + ' ' + lab(b) + ' at 115 %: the output ' + S.rt.v[o] + ' is not the input value');
        }
      }
    } else if (b.k === 'SUMA') {
      const i = (b.i || [])[0],
        o = (b.o || [])[0];
      if (i == null || i < 0 || o == null || o < 0) {
        skip('SUMA with no input or output net');
        continue;
      }
      S.rt = clone(base);
      S.rt.st[b.id] = {};
      S.rt.force[i] = 12;
      for (let k = 0; k < 3600; k++) anStep(S, 1);
      const got = S.rt.st[b.id].tot;
      n.suma++;
      if (!(Math.abs(got - 12) < 1e-6)) bad.push(sh.name + ' SUMA#' + b.id + ' ' + (b.txt || []).join('/') + ': 12 / h for 1 h gives ' + got + ', not 12');
      const P = b.p,
        p0 = { cut: P.cut, rsts: P.rsts };
      S.rt = clone(base);
      S.rt.st[b.id] = {};
      P.cut = 10; /* 10 % of the 100 % input (K x the last digit of RSTS) */
      S.rt.force[i] = (0.05 * P.kk) / Math.pow(10, (String(p0.rsts).split('.')[1] || '').length);
      for (let k = 0; k < 600; k++) anStep(S, 1);
      if (S.rt.st[b.id].tot !== 0) bad.push(sh.name + ' SUMA#' + b.id + ': a PV of 5 % under CUT 10 % adds ' + S.rt.st[b.id].tot + ', not 0');
      P.cut = p0.cut;
      P.rsts = 5;
      S.rt.st[b.id] = { tot: 4.9 };
      S.rt.force[i] = 3600;
      anStep(S, 1);
      anStep(S, 1);
      if (!(S.rt.st[b.id].tot < 4.9)) bad.push(sh.name + ' SUMA#' + b.id + ': above RSTS 5 the total is ' + S.rt.st[b.id].tot + ', not cleared');
      P.rsts = p0.rsts;
    }
  }
  S.rt = base;
}
bad.forEach(x => console.log('FAIL', x));
const ok = !bad.length && n.ai + n.aiFb >= FLOOR.ai && n.suma >= FLOOR.suma;
console.log((ok ? 'PASS' : 'FAIL') + ' AI / SUMA headless: AI transmitter ' + n.ai + ', AI position feedback ' + n.aiFb + ', SIG.AB ' + n.sig + ' (flag wire read ' + n.flag + '), SUMA ' + n.suma + ' (floor AI ' + FLOOR.ai + ', SUMA ' + FLOOR.suma + '); skipped ' + JSON.stringify(n.skip) + '; ' + ((Date.now() - t0) / 1000).toFixed(0) + ' s');
process.exit(ok ? 0 : 1);
