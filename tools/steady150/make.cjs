// Makes src/data/st150.txt: the steady state of the plant model at 150 MW (every loop in AUTO), the start "At 150 MW".
// It opens the built html (dist/), presses "At 150 MW" (the snapshot line-up, or the st150 of the build), then runs the
// whole plant (ABC + DITL + plant model, 0.5 s scans) in chunks of CHUNK plant minutes. Between the chunks the page is
// reopened and the plant is put back by a save point (the browser runs out of memory on long runs). It stops when the
// last 3 minutes moved less than the limits below, or at MAX minutes. Then: node tools/build/build.js.
// Usage: PLAYWRIGHT_MODULE=... CHROMIUM=... node tools/steady150/make.cjs [MAX=120] [CHUNK=10]
// One scan = one step of the ABC-001C set (the set of linked sheets, as the app does) + one DITL tick, 0.5 s. About 7 s of computer time per plant minute.
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const root = path.resolve(__dirname, '..', '..');
process.chdir(root);
const { open } = require(path.join(root, 'tests/regress/lib.js'));
const html = 'dist/' + fs.readdirSync('dist').find(x => /^logic-sim-v[\d.]+(?:-beta\.\d+)?\.html$/.test(x));
const MAX = +process.argv[2] || 120, CHUNK = +process.argv[3] || 10;
/* 3.2.3-beta.272: loops the snapshot line-up leaves in MANUAL that the logic runs in AUTO at full load: the O2 trim (ABC-002 M.0103 / M.0102 = 0 at 150 MW, SV 3.5 = LN16) */
/* 1.0.0-beta.348 (JENNIE, B4 of user 2026-11-24 "GO DESIGN"): the bed ash. The snapshot line-up held the furnace differential pressure
   controller DPICFG108 in MANUAL 0 % and the four bottom ash screw coolers SICL1060A ~ D in MANUAL, so the coolers stood still at full
   load. ABC-009A / B: DPICFG108 in AUTO drives the cooler master PIC-BASC and the four cooler stations in AUTO; its set point is the FHI
   P2S7 Fig 9 normal overall furnace pressure drop at 100 % load, 1630 mmH2O (hmi-op.js AN_HMI_CTL) */
const AUTO = { AICFG112: 3.5, DPICFG108: 1630, SICL1060A: undefined, SICL1060B: undefined, SICL1060C: undefined, SICL1060D: undefined };
/* 3.2.4-beta.8: the drum level too (the feedwater valve law of beta.6 swings the three-element loop ~10 min; a start taken mid-swing dipped to -34 mm) */
/* the design bed anchor AN_BB.tbA of the engine source (the engine constants are not globals of the page) */
const TBA = +(/\btbA:\s*([\d.]+)/.exec(fs.readFileSync('src/analog/engine/unit.js', 'utf8')) || [])[1];
const LIM = { MW: 0.3, Tb: 1, Pd: 0.3, msT: 1, rh: 1, F: 0.5, lvl: 1 };
async function chunk(sv, min, log) {
  const { browser, page } = await open(html);
  try {
    await page.waitForFunction(() => AN.sheets && AN.sheets.length >= 54 && window.WORLD && WORLD.idx && S.sheets.length >= PRE_N, null, { timeout: 120000 });
    await page.waitForTimeout(1500);
    await page.evaluate(async ([sv, AUTO, TBA]) => {
      await AN.ades();
      WORLD.set(true);
      document.getElementById('load150').click();
      await AN._startP;
      if (sv) { const o = JSON.parse(sv); await DITL150.savePut({ kf: o.kf, kd: o.kd, ver: 'st150' }); }
      else for (const [t, v] of Object.entries(AUTO)) TOP.auto(t, v);
      /* 1.0.0-beta.350 (user 2026-11-24 "GO DESIGN"): the first chunk starts the bed at the design anchor of the model (AN_BB.tbA, 860 C,
         FHI SU:10198 hold 850 - 870 C), not at the bed of the start state made by an older model: a 60 - 80 C step of the bed swings the
         boiler master to the feeder limit and the drum level out (a start transient, not the plant at 150 MW) */
      if (!sv && isFinite(TBA)) AN.unit.Tb = TBA;
      window.__h = { C: AN.sheets.find(s => s.name === 'ABC-001C') };
    }, [sv, AUTO, TBA]);
    for (let m = 0; m < min; m++) {
      const e = await page.evaluate(() => {
        const h = window.__h, U = AN.unit;
        for (let k = 0; k < 120; k++) { WORLD.live = true; AN.stepSet(h.C, 0.5); WORLD.tick(0.5); }
        const pv = (sh, t) => { const x = AN.sheets.find(y => y.name === sh); const b = x.S.procs.find(z => (z.txt || [])[1] === t); return b ? +x.S.rt.v[b.proc.pv] : NaN; };
        const f = x => (isFinite(x) ? +(+x).toFixed(2) : null);
        return { MW: f(U.MW), F: f(U.Fc), Tb: f(U.Tb), Pd: f(U.Pd), ms: f(U.ms), msT: f(pv('ABC-012', 'TICMS1004')), rh: f(pv('ABC-019', 'TICHR1002')), lvl: f(pv('ABC-010', 'LICBR1001B')) };
      });
      log.push(e);
      console.log(log.length, JSON.stringify(e));
    }
    return await page.evaluate(() => JSON.stringify({ kf: AN.engState.capture(), kd: (typeof ditlCapture === 'function' ? ditlCapture : window.DITL.ditlCapture)() }));
  } finally { await browser.close(); }
}
(async () => {
  const log = [];
  let sv = null;
  while (log.length < MAX) {
    sv = await chunk(sv, CHUNK, log);
    if (log.length >= 6) {
      const a = log[log.length - 4], b = log[log.length - 1];
      if (b.MW < 140) { console.error('not at 150 MW (trip?): nothing written'); process.exit(1); }
      const c = log[Math.max(0, log.length - 7)]; /* 6 min too: a slow swing turns round within 3 min */
      if (log.length >= 7 && Object.keys(LIM).every(k => Math.abs(b[k] - a[k]) <= LIM[k] && Math.abs(b[k] - c[k]) <= LIM[k])) { console.log('steady after', log.length, 'min'); break; }
    }
  }
  const o = JSON.parse(sv);
  o.ver = 'st150 ' + fs.readFileSync('src/version.txt', 'utf8').trim() + ' ' + log.length + ' min';
  o.end = log[log.length - 1];
  const txt = zlib.gzipSync(JSON.stringify(o), { level: 9 }).toString('base64');
  fs.writeFileSync('src/data/st150.txt', txt);
  console.log('written src/data/st150.txt', txt.length, 'chars', JSON.stringify(o.end));
})();
