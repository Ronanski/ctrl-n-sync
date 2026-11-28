/* Phase 5 (2026-11-26): puts loops of the 150 MW start state (src/data/st150.txt) in AUTO without making the whole state again
   (the old make.cjs, deleted 2026-11-28, remade it from a screen line-up). Headless
   (tools/trace/world.cjs): the start "At 150 MW", the A press of each loop below as the faceplate does it (check.js autoSv: the A / M
   switch on its auto leg, mode status LOC), 10 s of the whole world, then the keyframe is written back.
   Loops and their source (YUA PC read 2026-11-26, /mnt/project-files/phase5-pc-reads-2026-11-26.md):
   - FICFA1055A: PR-OPE-5003-01 "The unit is operating at full load on automatic control"; PR-OPE-5002-02 Fluidizing Air Blower
     start-up "Set FAB Inlet Damper to AUTO. FCVFA1055A1"; snapshot 9.png 150.3 MW: A. (The standby damper FICFA1055B stays MANUAL
     25 %, ditl150.js faLineup, 9.png M 24.9 %.)
   Usage: node tools/steady150/modes.cjs */
const fs = require('fs'),
  path = require('path'),
  zlib = require('zlib');
const { load, gz, root } = require(path.join(__dirname, '..', 'trace', 'world.cjs'));
const LOOPS = [['ABC-014', 'FICFA1055A']];
(async () => {
  const E = load();
  await E.start('150');
  const AN = E.AN;
  for (const [k, t] of LOOPS) {
    const T = AN.sheets.find(s => s.name === k).S,
      c = AN.hmiCtrls(T).find(z => z.tag === t);
    if (!c || !c.amt) throw new Error('no A / M station for ' + t);
    if (c.svSw && T.rt.st[c.svSw.id]) {
      T.rt.st[c.svSw.id].al = 'A';
      T.rt.st[c.svSw.id].fm = 'B';
    }
    T.rt.st[c.amt.id].fm = c.autoLeg;
    AN.latchMode(t, 'LOC');
  }
  E.step(50, 0.2);
  for (const [k, t] of LOOPS) {
    const T = AN.sheets.find(s => s.name === k).S,
      c = AN.hmiCtrls(T).find(z => z.tag === t);
    if (T.rt.st[c.amt.id].pk !== c.autoLeg) throw new Error(t + ' did not go to AUTO');
    console.log(t, 'AUTO, output', (+T.rt.v[c.out]).toFixed(1));
  }
  /* the start state of main has no separator position (U.ba.tw): it is set on each load by ditl150.js D.baSave, the upgrade of a save
     made before beta.563. Kept so: only the modes of the loops above change */
  const o = JSON.parse(gz('st150.txt'));
  if (!/"tw"/.test(JSON.stringify(o.kf))) E.js('delete AN.unit.ba.tw');
  o.kf = E.js('AN.engState.capture()');
  o.kd = E.js("(typeof ditlCapture === 'function' ? ditlCapture : window.DITL.ditlCapture)()");
  o.ver = (o.ver || 'st150') + ' + modes ' + LOOPS.map(x => x[1]).join(' ');
  fs.writeFileSync(path.join(root, 'src', 'data', 'st150.txt'), zlib.gzipSync(JSON.stringify(o), { level: 9 }).toString('base64'));
  console.log('written src/data/st150.txt', o.ver);
  process.exit(0);
})();
