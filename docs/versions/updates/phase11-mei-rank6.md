# Phase 11 rank 6 (MEI): condenser duty from the turbine exhaust, LP heaters by NTU

GO FIX 11 (user 2026-11-27 12:37 PM PHT), rank 6 of /mnt/project-files/phase11/audit-existing-model.md. One fix, old code deleted.

## Changed (src/analog/engine/unit.js)
- Condenser duty `anCdDuty`: first law on what comes in, Q = sum m/3.6 (h - h_f(Ts)): the LP exhaust (port lp.exh, RIN), the No.1 LP
  heater drain (U.lpW), the HP heater emergency drains (port hph.emerg, NANA) and the LP bypass U.qlp at the design drop (until RIN writes
  lp.bypass). Deleted: the main steam share `ms x cSt / mcr` and `U.xtra` (a shut extraction now stays in the turbine and arrives in
  lp.exh). Check at HB case 1: 195.3 + 0.4 = 195.7 MW = AN_CD.Qd.
- LP heaters: shell pressure = extraction port pressure less the line drop (dPd (w/wd)^2 Pd/P, HB case 1), condensate by
  effectiveness-NTU with UA fixed from the O&M design point, the draws by the shell first law with the drain cascade, written to the
  port ext.w_lp (RIN drops tbLpDraws). The gland steam / ejector condenser rise = the design duty 568 kW on the CEP flow while the
  condenser holds vacuum, in place of 1.35 C x load share. AN_LP.rise deleted.
- `anVacMW` and `U.dMWv` deleted (dead since RIN's steam path). tests/regress/vacuum_mw.js (it read AN_CYC.vacLoss, deleted in
  PR 673, and anVacMW) is replaced by tests/lanes/model/vacuum-mw.cjs: HB case 1 at condenser 0.07 -> 0.26 ata (design -> trip),
  150.0 -> 137.1 MW, each step the lost MW = exhaust flow x enthalpy rise within 1.4 %.
- turbine.js `tbLpDraws` deleted (RIN approved, 2026-11-27 3:22 PM PHT): tbDraws reads only ext.w_lp; anHdStep (LP heater levels)
  reads U.lpW in place of U.tbD.

## Tested (150 MW start, 2 plant min, on top of PR 669)
- Condenser 194.0 MW, 0.0667 ata, 37.8 C (design 195.7 MW, 0.07 ata, 38.65 C); LP exhaust 313.4 T/H (HB 316.0).
- LP heaters 39.1 -> 70.0 -> 90.2 -> 114.6 C (O&M 40 -> 70.8 -> 90.7 -> 114.9); draws No.3 16.5, No.2 13.5, No.1 19.6 T/H
  (HB 15.2 / 12.3 / 16.8) at 392 T/H condensate (design 362.6: the deaerator level valve is open wide from the old st150).
- no-fit 0 new, one-path PASS (baseline lost cdP / anVacMW), model ports PASS.

- st150 settled FROM main's st150 (KANA's settle.cjs, headless, 20 + 40 + 40 + 40 plant min). The old start had the deaerator at
  -218 mm with LCV-CD1104 wide open (the start was made on the old condensate law); the level loops recover with a slow damped swing
  (deaerator +161 -> +5 -> +107 -> +76 mm, LCV 72 ~ 86 %, hotwell within +-50 mm at the end). At the end 151.06 MW, MSP 122.4.
- Behaviour gate 20 min on the new start: ALL PASS (MW 151.06 -> 150.96, Pms max move 0.26, drum level max move 5.5 mm, no trip).
- tests/lanes/integrator/tcs-motors.cjs PASS on the new start.

- st150 rule 2026-11-27 7:02 PM PHT (phase thread): part PRs do not commit st150; this PR keeps main's file. Behaviour gate 20 min
  on main's start with both fixes: ALL PASS (MW 150.88 -> 150.97, Pms max move 0.24, level max move 10.6 mm, no trip).
- (Earlier, not committed) settled on main's new start after KANA PR 672 (settle 140 plant min): 150.95 MW, MSP 122.4, drum 139.4, deaerator +43 mm
  with LCV-CD1104 81 %, hotwell +17 mm. Behaviour gate 20 min on it with both fixes: ALL PASS (MW 150.95 -> 151.26, Pms max move
  0.49, level max move 5.3 mm, no trip). tcs-motors and field-state PASS. The 45-150 MW sweep is run by the phase thread on main
  (test split rule 2026-11-27 6:35 PM PHT).

## Left
- The deaerator needs ~392 T/H of condensate (design 362.6): the model HP heater drains to the deaerator are ~46 T/H against HB 69
  (NANA, told by the phase thread). With that fixed the LCV comes back down from ~80 %.

## Second fix in this PR (batch rule, phase thread 2026-11-27 6:34 PM PHT): LP bypass into the condenser, FT-CD1115 by its valve sheet
- Condenser duty takes the lp.bypass port (RIN, on main) + the spray water TCV-CD1115 at the condensate enthalpy, in place of
  U.qlp x Qd / Wd (deleted).
- FT-CD1115 (anLpbSpray): TCV-CD1115 vendor sheet K1AU3-D1-0-043 R0 p12, Cv 25.4 modified equal %, ISA liquid sizing between the CEP
  discharge and the LP bypass outlet. Sheet case 1 check: 46.2 T/H at 76 % travel (sheet 45.3 T/H). Before: travel x 68 T/H (NO-SOURCE).
- At 150 MW the LP bypass is shut: no change to the start.
