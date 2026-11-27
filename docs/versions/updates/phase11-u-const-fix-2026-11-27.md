# Fix main: AN_UNIT_K after the turbine keys moved out of AN_UNIT (2026-11-27)

- PR 689 (AN_UNIT_K) and RIN's turbine PR (tauMW, hpb, blo, lpb, tauRH, Crh and rhb moved out of AN_UNIT into the turbine constants of
  turbine.js) were in Checks at the same time.
- On main, tools/check/u-const.cjs then failed: "AN_UNIT_K lists ... which is not a key of the AN_UNIT literal".
- The 7 moved keys are removed from AN_UNIT_K. Their new home is an engine constant that the save does not carry, so they need no
  restore.
- Tested: u-const PASS (40 AN_UNIT keys, 36 constants), one-path PASS.
