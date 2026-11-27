/* Phase 11 (KANA, 2026-11-27): puts the drum pressure of the 150 MW start state (src/data/st150.txt) on the superheater pressure drop
   law of unit.js anShKdp (FHI P2S7 Tab 3, 16 kg/cm2 at 460 T/H) without making the whole state again (make.cjs runs the plant in the
   browser and loses the line-ups other lanes put on the start state since). Headless (tools/trace/world.cjs): the start "At 150 MW",
   the drum pressure set to the main steam pressure + the drop of the law at the steam flow of the state (the main steam pressure,
   and so every controller that reads it, stays where it was), the boiler water at its saturation temperature, MIN plant minutes of the
   whole world, then the keyframe is written back. Usage: node tools/steady150/drum-law.cjs [MIN=10] */
const fs = require('fs'),
  path = require('path'),
  zlib = require('zlib');
const { load, gz, root } = require(path.join(__dirname, '..', 'trace', 'world.cjs'));
const MIN = +process.argv[2] || 10;
(async () => {
  const E = load();
  /* the start of world.cjs E.start('150') without its 4 scans: one scan with the old drum and the new law reads a 7 kg/cm2 dip of the
     main steam pressure, which forces the boiler and turbine masters to MANUAL (BU-CMD, held) */
  const AN = E.AN;
  await AN.loadStart('150', true);
  AN.settle();
  E.js('DITL150.apply()');
  const o = JSON.parse(gz('st150.txt'));
  E.ctx.__st150 = o;
  await E.js('DITL150.savePut({kf:__st150.kf,kd:__st150.kd,ver:__st150.ver||"st150"})');
  const before = E.js('JSON.stringify({ Pd: AN.unit.Pd, Pms: AN.unit.Pms, ms: AN.unit.ms })');
  /* the main steam pressure the state was made with: its drum less the old drop of the state, (134.2 - 122.6) / 474.1^2 x m^2 (the
     snapshot kdp the state was made with, deleted from unit.js; used here only to read the state back). The new drum: that main steam
     pressure + the drop of the law at its design density (the engine functions are not globals of the page; the scans then take the
     density of the state, anShKdp, and the minutes below settle the rest) */
  E.js('(() => { const U = AN.unit, P = U.Pd - ((134.2 - 122.6) / (474.1 * 474.1)) * U.ms * U.ms; U.kdp = 16 / (460 * 460); U.Pd = P + U.kdp * U.ms * U.ms; U.Tw = AN.tsat(U.Pd); })()');
  for (let m = 0; m < MIN; m++) {
    E.step(120);
    console.log(m + 1, E.js('JSON.stringify({ MW: +AN.unit.MW.toFixed(2), Pd: +AN.unit.Pd.toFixed(2), Pms: +AN.unit.Pms.toFixed(2), ms: +AN.unit.ms.toFixed(1) })'));
  }
  if (!/"tw"/.test(JSON.stringify(o.kf))) E.js('delete AN.unit.ba.tw');
  o.kf = E.js('AN.engState.capture()');
  const live = o.kd && o.kd.W ? o.kd.W.live : undefined;
  o.kd = E.js("(typeof ditlCapture === 'function' ? ditlCapture : window.DITL.ditlCapture)()");
  if (live !== undefined && o.kd.W) o.kd.W.live = live; /* the headless world does not run live: the start keeps its own flag */
  o.ver = (o.ver || 'st150') + ' + drum-law ' + MIN + ' min';
  fs.writeFileSync(path.join(root, 'src', 'data', 'st150.txt'), zlib.gzipSync(JSON.stringify(o), { level: 9 }).toString('base64'));
  console.log('before', before, 'written src/data/st150.txt', o.ver);
  process.exit(0);
})();
