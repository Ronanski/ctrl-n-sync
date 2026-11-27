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

## Not tested / left
- st150 settled from main after PR 669 merges; behaviour gate; sweep before / after.
