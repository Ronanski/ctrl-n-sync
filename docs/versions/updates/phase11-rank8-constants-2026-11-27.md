# Phase 11 rank 8, step 1: the unit constants come from the code on every load (2026-11-27)

Finding (AOI): "At 150 MW" (src/data/st150.txt) and every save point restore the whole unit object AN_UNIT, constants
included (state.js anStateApply). So a constant changed in code never reached the plant; the old saved number won.

Change:
- `src/analog/engine/unit.js`: `AN_UNIT_K` lists the 43 keys of the AN_UNIT literal that no function writes (the constants: time
  constants, valve sizes, metal masses, Hgen, mcr ...).
- `src/analog/engine/state.js` anStateApply: after the save is loaded, these 43 keys are put back from the code (AN_STATE_INIT).
- `tools/check/u-const.cjs` (in Checks): fails when a key no function writes is not in AN_UNIT_K, when a key of AN_UNIT_K is written
  by any function (start and stop included), or when AN_UNIT_K names a key that is not there.

Tested (headless tools/trace/world.cjs, "At 150 MW" start):
- Today the 43 saved values equal the code, so no plant number moves with this PR.
- Hgen set to 4.5 in the code: with this change the loaded plant reads 4.5; without it, 4.01 (the old saved number).
- u-const PASS, one-path PASS, model lanes PASS.

Not done yet (rank 8 step 2): the values that anUnitStart DERIVES from the start state (kdp, Kt, taf0 / pa0 / sa0, the transmitter
offsets U.xt) and the nested anchors of the parts (e.g. AOI's bed DP anchor, the AI lists' a0) are still state in the save.
