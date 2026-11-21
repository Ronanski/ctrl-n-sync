/* BEHAVIOUR GATE (Full Audit 3, Phase 0, ranking 2): a merge is held when the plant does not behave. Runs in the Checks job on every
   push, headless, on the Operator Station page. The plant is stepped by the test itself at a FIXED 0.5 s step (AN.runFixed of sched.js:
   the same steps and DITL world chunks as the scheduler, without the clock of the PC), so the same build gives the same numbers on every PC and on GitHub.
     1. steady 150 MW ("Normal operation at full load"), 20 plant min, nothing touched: no trip, no MFT, no page error;
        MW, main steam pressure, drum level and main steam temperature stay inside the bands below (ISA-77.20: no drift at steady state).
     2. the same run again in a fresh page gives the same numbers (determinism).
     3. SAVE then LOAD of a save point at the end of run 1 gives back the same plant (U fields, sheet times).
   Usage: node tests/gate/behaviour.cjs <station.html> [--mins 20]. Exit 0 = pass. PLAYWRIGHT_MODULE / CHROMIUM env as the other tools. */
const fs = require('fs'),
  url = require('url');
const pw = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const html = process.argv[2],
  mi = process.argv.indexOf('--mins'),
  MINS = mi > 0 ? +process.argv[mi + 1] : 20;
const BAND = { MW: 2, Pms: 2, lvl: 60, mst: 6 } /* allowed move from the start value over the run; MW, kg/cm2, mm, C */;
if (!html || !fs.existsSync(html)) {
  console.log('LOAD ERROR: no station html', html);
  process.exit(2);
}
const read = () => {
  const U = AN.unit,
    L = window.LS_LIVE,
    pv = t => {
      try {
        const f = L.fp(t);
        return +f.S.rt.v[f.c.q.pv];
      } catch (e) {
        return NaN;
      }
    };
  return { t: +U.t, MW: +U.MW, Pms: +U.Pms, Pd: +U.Pd, lvl: pv('LICBR1001'), mst: pv('TICMS1004'), Tb: +U.Tb, coal: +U.cbn, trip: (AN.tceRead() || {}).trip ? 1 : 0 };
};
async function run(b, mins, withSave) {
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  const errs = [];
  p.on('pageerror', e => errs.push(String(e.message)));
  await p.addInitScript(() => {
    window.open = () => null;
  });
  await p.goto(url.pathToFileURL(html).href);
  await p.waitForFunction(() => window.AN && window.lsSaves, null, { timeout: 240000 });
  await p.waitForTimeout(3000);
  await p.getByRole('button', { name: 'Later' }).click({ timeout: 5000 }).catch(() => {});
  await p.getByText('Normal operation at full load').click({ timeout: 120000 });
  await p.waitForFunction(() => AN.sheets && AN.sheets.length >= 54 && AN.unit && isFinite(AN.unit.MW) && AN.unit.MW > 140 && !AN._loading, null, { timeout: 240000 });
  /* the starting state pauses the plant once it is settled: wait until Run sticks (the operator's Run, then the fixed clock) */
  await p.waitForTimeout(15000);
  await p.waitForFunction(() => { AN.extClock = true; AN.run = true; return AN.run; }, null, { timeout: 60000, polling: 1000 });
  await p.waitForTimeout(3000);
  await p.evaluate(() => {
    AN.extClock = true; /* the test steps the plant (AN.runFixed, sched.js), not the clock of the PC; AN.run stays on so the DITL world scans */
    AN.run = true;
  });
  await p.waitForTimeout(500);
  const s0 = await p.evaluate(read);
  let mx = { MW: 0, Pms: 0, lvl: 0, mst: 0 },
    last = s0,
    trip = 0;
  for (let k = 0; k < mins * 2; k++) {
    /* 30 plant s per call: 60 steps of 0.5 s, the world every 6 steps (3 s) */
    last = await p.evaluate(read_ => {
      if (!AN.runFixed(30, 0.5)) throw new Error('AN.runFixed refused (no set, loading or mirror)');
      return new Function('return (' + read_ + ')()')();
    }, read.toString());
    for (const q of Object.keys(mx)) if (isFinite(last[q]) && isFinite(s0[q])) mx[q] = Math.max(mx[q], Math.abs(last[q] - s0[q]));
    trip = trip || last.trip;
    if (trip) break;
  }
  let save = null;
  if (withSave) {
    save = await p.evaluate(async () => {
      const pick = () => JSON.stringify([AN.unit.MW, AN.unit.Pd, AN.unit.Tb, AN.unit.Tw, AN.unit.bedI, AN.sheets.map(s => (s.S && s.S.rt ? s.S.rt.t : null))]);
      const before = pick();
      await lsSaves.save('gate');
      const e = (await lsSaves.list()).filter(x => x.name === 'gate').sort((x, y) => (y.at || 0) - (x.at || 0))[0];
      if (!e) return { same: false, err: 'no save point gate' };
      AN.unit.Pd += 5; /* move the plant, then load the save point back */
      await lsSaves.load(await lsSaves.imp(lsSaves.exp(e))); /* through the file text, as the menu's file save does */
      await new Promise(r => setTimeout(r, 3000));
      AN.extClock = true;
      AN.run = true;
      return { same: pick() === before, before, after: pick() };
    }).catch(e => ({ same: false, err: String(e) }));
  }
  await p.close();
  return { s0, last, mx, trip, errs, save };
}
(async () => {
  const b = await pw.chromium.launch({ executablePath: process.env.CHROMIUM || undefined, headless: true });
  let bad = 0;
  const ok = (c, m) => {
    console.log((c ? 'PASS ' : 'FAIL ') + m);
    if (!c) bad++;
  };
  try {
    const a = await run(b, MINS, true);
    const f = x => (isFinite(x) ? (+x).toFixed(2) : 'NaN');
    ok(!a.trip, `steady 150 MW ${MINS} plant min: no trip / MFT`);
    ok(!a.errs.length, 'no page error' + (a.errs.length ? ': ' + a.errs.slice(0, 3).join(' | ') : ''));
    for (const q of Object.keys(BAND)) ok(isFinite(a.s0[q]) && a.mx[q] <= BAND[q], `${q} start ${f(a.s0[q])} end ${f(a.last[q])} max move ${f(a.mx[q])} (band ${BAND[q]})`);
    ok(a.save && a.save.same, 'SAVE then LOAD gives back the same plant' + (a.save && !a.save.same ? ' ' + JSON.stringify(a.save).slice(0, 300) : ''));
    const c = await run(b, MINS, false);
    const keys = ['t', 'MW', 'Pms', 'Pd', 'Tb', 'coal', 'mst'];
    const same = keys.every(k => (isNaN(a.last[k]) && isNaN(c.last[k])) || a.last[k] === c.last[k]);
    ok(same, 'the same run twice gives the same numbers' + (same ? '' : ' ' + JSON.stringify({ a: a.last, b: c.last })));
  } catch (e) {
    ok(false, 'ERROR ' + e.message);
  }
  await b.close();
  console.log(bad ? 'FAILED ' + bad : 'ALL PASS');
  process.exit(bad ? 1 : 0);
})();
