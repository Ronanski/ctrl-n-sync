/* init for tools/steady150/settle.cjs (phase thread, 2026-11-28): the PA flow bias station HIC-TADBS (ABC-002, MAN station) at its start
   value of hmi-op.js AN_HMI_MAN, -50 % = PAF FLOW BIAS -30.0 T/H on snapshot 7.PNG (AOI PR 674). The start state carried the old plant-trend
   value -26.7 in its keyframe, which the load restores over the table. Run once on the state. */
(() => {
  const sh = AN.sheets.find(s => s.name === 'ABC-002'),
    S = sh && sh.S,
    b = S && S.blk.find(x => x.k === 'MAN' && (x.tag === 'HIC-TADBS' || (x.txt || []).includes('HIC-TADBS')));
  if (!b || !S.rt.st[b.id]) throw new Error('no HIC-TADBS station on ABC-002');
  const P = b.p || {};
  S.rt.st[b.id].val = Math.max(P.lo != null ? P.lo : 0, Math.min(P.hi != null ? P.hi : 100, -50));
  console.log('HIC-TADBS', S.rt.st[b.id].val);
})();
