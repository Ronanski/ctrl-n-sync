/* init for tools/steady150/settle.cjs (Phase 11 SUZU fix 25, 2026-11-28): the condenser outlet valves V-SW1009 / 1010 of the start
   state at the DERIVED opening of the design point (unit.js AN_SW_V0 = cooling.js swCal c.oDes, read through AN.swV0); the old state
   holds the old opening. The settle minutes then bring the seawater flow and the condenser to the new line-up. Run once per state. */
(() => {
  const v = AN.swV0();
  AN.swValve('V-SW1009', v['V-SW1009']);
  AN.swValve('V-SW1010', v['V-SW1010']);
})();
