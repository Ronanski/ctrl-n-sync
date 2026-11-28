# Phase 11 RIN: the roll without the ATS deleted (2026-11-28)

- Deleted from unit.js: the `!U.tc` roll branch (rpm at `rollRate` 120 rpm/min, ICV at `icvRoll` 0.13, NO-SOURCE) and both constants (AN_UNIT, AN_UNIT_K).
- Why it is not a value to derive: `U.tc` is set on every load (tcsInit 'cold' / 'load'), and the roll comes only from the ATS (tcs.js TURBINE PREPARATION sets 'roll'; the ATS sets the speed and the ICV). Without `U.tc` (`U.tco`, the oil-only state) 'roll' is reached only by a load rejection, which the swing equation drives (`!tb.rej`). So the branch never ran.
- Operator view: nothing changes in the turbine start; one path for the roll.
- Tested: u-const, one-path, no-fit, no-snapshot (baseline 588 -> 587), turbine-rejection, tcs_gen_desk. tcs_ibd_desk / tcs_cmd_refused / tcs_ibd_b3_desk fail the same on main without this change (not in Checks).
- cfb.js stored-heat sum (AOI store port): the reheat pipe term now reads AN_RHPIPE.M (17.9e3 kJ/K, BOM), not the deleted U.rhPipeM || 10000 (KANA finding).
