/* init for tools/steady150/settle.cjs (phase thread, 2026-11-28): the continuous blowdown MOV MV-BD1002 (DITL-38) at the plant position
   2.1 % (ZT-BD1002 at 150 MW, docs/hmi/OPERATING_POINTS.md), the line-up of src/world/ditl150.js; the start state carried it 100 % open
   (14.8 T/H, the sizing flow of MB-019 item 22). Run once on the state. */
(() => {
  let n = 0;
  for (const s of DITL.S.sheets.concat(WORLD.inst || [])) {
    const lbl = s._inst && s._inst.lbl;
    if (lbl !== 'MV-BD1002' || !s.nl || !(s.nl.mv || []).length) continue;
    const r = mvRT(s);
    r[0].pos = 2.1;
    r[0].run = 0;
    n++;
  }
  if (!n) throw new Error('no MV-BD1002 on DITL-38');
})();
