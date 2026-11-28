/* init for tools/steady150/settle.cjs (Phase 11 SUZU fix 25, 2026-11-28): the condenser outlet valves V-SW1009 / 1010 of the start
   state to the DERIVED opening of the design point (unit.js AN_SW_V0 = cooling.js swCal c.oDes, read through AN.swV0); the old state
   holds the old opening. The valves move at an operator's rate, 2 % a plant minute (settle.cjs calls __settleMinute once a plant
   minute), not as a step; the settle minutes then bring the seawater flow and the condenser to the new line-up. Run once per state. */
(() => {
  const tgt = AN.swV0(),
    tags = ['V-SW1009', 'V-SW1010'];
  globalThis.__settleMinute = () => {
    const now = AN.swValves();
    for (const t of tags) {
      const d = tgt[t] - now[t];
      if (Math.abs(d) > 1e-9) AN.swValve(t, now[t] + Math.sign(d) * Math.min(2, Math.abs(d)));
    }
  };
})();
