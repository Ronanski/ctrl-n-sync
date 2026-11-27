/* init for tools/steady150/settle.cjs (phase thread, 2026-11-28, user rule of 5:18 AM PHT: start values from design and DCS logic, never
   from a plant screen). Puts on the start state the two line-up values that src/world/ditl150.js and hmi-op.js AN_HMI_MAN now give:
   - the continuous blowdown MOV MV-BD1002 (DITL-38) shut (HB PPE-14-0725 case 1: no make-up, no blowdown at 150 MW);
   - the PA flow bias station HIC-TADBS (ABC-002) at 0 = the neutral point of S1-LN14 (0 T/H bias).
   The start state carries the old values in its keyframe, which the load restores over the tables. Run once on the state. */
(() => {
  let n = 0;
  for (const s of DITL.S.sheets.concat(WORLD.inst || [])) {
    const lbl = s._inst && s._inst.lbl;
    if (lbl !== 'MV-BD1002' || !s.nl || !(s.nl.mv || []).length) continue;
    const r = mvRT(s);
    r[0].pos = 0;
    r[0].run = 0;
    n++;
  }
  if (!n) throw new Error('no MV-BD1002 on DITL-38');
  const sh = AN.sheets.find(x => x.name === 'ABC-002'),
    S = sh && sh.S,
    b = S && S.blk.find(x => x.k === 'MAN' && (x.tag === 'HIC-TADBS' || (x.txt || []).includes('HIC-TADBS')));
  if (!b || !S.rt.st[b.id]) throw new Error('no HIC-TADBS station on ABC-002');
  S.rt.st[b.id].val = 0;
})();
