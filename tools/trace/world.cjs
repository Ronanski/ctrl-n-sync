/* QA TRACE (lane 8): the one world of the app (ABC + DITL + plant model), headless in Node, from the SAME src/ files the Worker runs
   (tools/build/engine-bundle.js worldBundle, as tests/regress/eng_world.js). Nothing of the app is changed: the trace only reads.
   start(kind): '150' = the "Normal operation at full load" start of the app (AN.loadStart 150, DITL150.apply, then the #st150 save point
   made by tools/steady150/make.cjs, as src/ui/shell/app.js st150()); 'cold' = Reset (AN.reset + ditlStates). */
const fs = require('fs'),
  vm = require('vm'),
  zlib = require('zlib'),
  path = require('path');
const root = path.resolve(__dirname, '..', '..');
const { worldBundle } = require(path.join(root, 'tools', 'build', 'engine-bundle.js'));
const gz = f =>
  zlib.gunzipSync(Buffer.from(fs.readFileSync(path.join(root, 'src', 'data', f), 'utf8').trim(), 'base64')).toString();
function load() {
  const quiet = { log() {}, warn() {}, error() {} };
  const ctx = {
    console: quiet,
    structuredClone,
    setTimeout,
    clearTimeout,
    setInterval() {},
    clearInterval() {},
    performance: { now: () => Date.now() },
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    addEventListener() {},
    msg() {},
    atob: s => Buffer.from(s, 'base64').toString('binary')
  };
  ctx.globalThis = ctx;
  ctx.window = ctx;
  ctx.self = ctx;
  vm.createContext(ctx);
  vm.runInContext(worldBundle(), ctx, { filename: 'world-bundle.js' });
  const { AN, DITL, WORLD } = ctx;
  AN.sheets = gz('apre.txt')
    .split('\n')
    .filter(Boolean)
    .map(l => JSON.parse(l));
  AN.plantOn = true;
  for (const sh of AN.sheets) ctx.ENGINE.E.ensure(sh);
  const ADES = JSON.parse(gz('ades.txt'));
  AN.adesPut(ADES);
  DITL.S = {
    sheets: gz('pre.txt')
      .split('\n')
      .filter(Boolean)
      .map(l => JSON.parse(l)),
    cur: 0
  };
  WORLD.set(true);
  const C1 = AN.sheets.find(s => s.name === 'ABC-001C');
  const E = {
    ctx,
    AN,
    DITL,
    WORLD,
    ADES,
    js: code => vm.runInContext(code, ctx),
    /* one scan of the app: ABC-001C step (its tier steps the joined sheets) + one scan of the world, 0.5 s as the behaviour gate */
    step(n, dt = 0.5) {
      for (let k = 0; k < n; k++) {
        ctx.ENGINE.E.stepSet(C1, dt);
        WORLD.tick(dt);
      }
    },
    async start(kind) {
      if (kind === 'cold') {
        AN.reset();
        DITL.ditlStates();
        E.step(4);
        return;
      }
      await AN.loadStart('150', true);
      AN.settle();
      vm.runInContext('DITL150.apply()', ctx);
      ctx.__st150 = JSON.parse(gz('st150.txt'));
      await vm.runInContext('DITL150.savePut({kf:__st150.kf,kd:__st150.kd,ver:__st150.ver||"st150"})', ctx);
      E.step(4);
    }
  };
  return E;
}
module.exports = { load, gz, root };
