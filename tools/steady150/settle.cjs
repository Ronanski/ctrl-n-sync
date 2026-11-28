/* SETTLE THE 150 MW START STATE ON NEW CODE (Phase 11 rule, 2026-11-27): remake src/data/st150.txt from the start state of main, not
   from scratch (make.cjs runs the plant from the snapshot line-up in the browser and loses WORLD.live and the line-ups other lanes put on
   the start state since). Headless (tools/trace/world.cjs): the start "At 150 MW" WITHOUT its first scans, an optional init script run
   in the page before the first scan (tools/steady150/init/<name>.js: a state change the new code needs, e.g. the drum on a new law),
   MIN plant minutes of the whole world, then the keyframe and the DITL state are written back (WORLD.live of the start kept).
   Usage: node tools/steady150/settle.cjs [MIN=10] [init name]   e.g. node tools/steady150/settle.cjs 30 drum-law */
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
  const INIT = process.argv[3];
  if (INIT) E.js(fs.readFileSync(path.join(__dirname, 'init', INIT + '.js'), 'utf8'));
  for (let m = 0; m < MIN; m++) {
    E.step(120);
    E.js('typeof __settleMinute === "function" && __settleMinute(' + (m + 1) + ')') /* an init may move a set point at an operator's rate (one call a plant minute) */;
    console.log(m + 1, E.js('JSON.stringify({ MW: +AN.unit.MW.toFixed(2), Pd: +AN.unit.Pd.toFixed(2), Pms: +AN.unit.Pms.toFixed(2), ms: +AN.unit.ms.toFixed(1) })'));
  }
  if (!/"tw"/.test(JSON.stringify(o.kf))) E.js('delete AN.unit.ba.tw');
  o.kf = E.js('AN.engState.capture()');
  const live = o.kd && o.kd.W ? o.kd.W.live : undefined;
  o.kd = E.js("(typeof ditlCapture === 'function' ? ditlCapture : window.DITL.ditlCapture)()");
  if (live !== undefined && o.kd.W) o.kd.W.live = live; /* the headless world does not run live: the start keeps its own flag */
  o.ver = (o.ver || 'st150') + ' + settle ' + MIN + ' min' + (INIT ? ' ' + INIT : '');
  fs.writeFileSync(path.join(root, 'src', 'data', 'st150.txt'), zlib.gzipSync(JSON.stringify(o), { level: 9 }).toString('base64'));
  console.log('before', before, 'written src/data/st150.txt', o.ver);
  process.exit(0);
})();
