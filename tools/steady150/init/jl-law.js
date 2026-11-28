/* init for tools/steady150/settle.cjs (AOI, Phase 11, 2026-11-28): the upper furnace solids law of Johnsson & Leckner (cfb.js AN_BB jl,
   KANA /mnt/project-files/phase11/kana-furnace-solids-law-2026-11-28.md) replaces the fitted kKL 9.2. The start state was settled on
   the old law, and a one-scan switch moves the part-load solids share and the heat to the walls at once. So the law comes in over 30
   plant minutes (AN.jlShare 0 -> 1) while the plant follows; the plant model itself always runs at 1. Chains onto a __settleMinute set by
   an init run before it. */
(() => {
  AN.jlShare = 0;
  const prev = globalThis.__settleMinute;
  globalThis.__settleMinute = m => {
    if (prev) prev(m);
    AN.jlShare = Math.min(1, +((m || 0) / 30).toFixed(4));
  };
})();
