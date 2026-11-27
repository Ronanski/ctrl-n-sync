# Phase 11 MEI: cd, cd.out and store.MEI ports (for SUZU / NANA / RIN); dead vacLoss deleted

- `unit.js` `anCondStep` writes port `cd` {P abs, T, Q kW, x {QA, QB}}. The heat each water box path takes from the condensing steam is the same NTU law as the condenser, split into its two paths using the SUZU path flows U.swQcA / B. Unrounded, as agreed with SUZU, so SUZU can delete its own steam estimate.
- `unit.js` `anLphStep` writes `cd.out` {m = anDaQ flow, P = LCV-CD1104 outlet (deaerator + z2 + kN m^2), T = No.3 LPH outlet, h IF97}. It also writes `store.MEI`, the hotwell water mass and energy (68.8 m2 x (0.6 m + level), K2MC3A). The LP heater water is not in the store yet (rank 6).
- `plant.js` `AN_CYC.vacLoss` deleted: it had no caller and was a second copy of the anVacMW law.
- Nothing reads the new ports yet, so the plant numbers do not change and the sweep is the same as main (no physics change). Tested: no-fit 0 new, one-path PASS, ports test PASS, behaviour gate (see PR).
- Next (rank 6, after RIN PR 669): condenser duty from lp.exh / lp.bypass, LP heaters by NTU from ext.lp*, ext.w_lp, anVacMW deleted.
