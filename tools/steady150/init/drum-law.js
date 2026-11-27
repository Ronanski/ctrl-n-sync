/* init for tools/steady150/settle.cjs (Phase 11 KANA, 2026-11-27): the drum on the superheater pressure drop law of unit.js anShKdp
   (FHI P2S7 Tab 3, 16 kg/cm2 at 460 T/H). The main steam pressure the state was made with = its drum less the old drop of that state,
   (134.2 - 122.6) / 474.1^2 x m^2 (the snapshot kdp deleted from unit.js; used here only to read the state back). New drum = that main
   steam pressure + the drop of the law at its design density (engine functions are not page globals; the scans then take the density
   of the state, anShKdp, and the settle minutes do the rest). The boiler water at its saturation temperature. Run once per state. */
(() => {
  const U = AN.unit,
    P = U.Pd - ((134.2 - 122.6) / (474.1 * 474.1)) * U.ms * U.ms;
  U.kdp = 16 / (460 * 460);
  U.Pd = P + U.kdp * U.ms * U.ms;
  U.Tw = AN.tsat(U.Pd);
})();
