# Phase 11 rank 10 (MEI): condensate pump motor current from the motor balance

GO FIX 11 (user 2026-11-27 12:37 PM PHT), rank 10 of /mnt/project-files/phase11/audit-existing-model.md. One fix, old code deleted.

## Changed (src/analog/engine/unit.js)
- `AN_CD.kI = 28.1 / 245.7` (the 150 MW HMI picture current over the shaft power) deleted. IT-P1116A / B (U.cdI0 / cdI1) = `anCepI`
  (shaft power of the KSB curve), the per-phase balance of the induction motor: P_in = P_shaft + fixed + copper x (I/I_fl)^2,
  Q = magnetising + leakage x (I/I_fl)^2, I = S / (sqrt3 V).
- Design point `AN_CD_M`: FHI load schedule K1AU3-E1-0-302 Rev A p4 (M-1116A / B 6600 V, 298.4 kW, eff 0.94, pf 0.88, F.L.A. 31.56 A),
  YUA PC read 2026-11-27 (project file mei-cep-motor-2026-11-27.md). The TECO data sheet 4A040Y856 is NOT IN DOCS.
- Two splits, written beside the values: no-load current 0.30 pu (NO-SOURCE, usual for a 6.6 kV 4-pole 300 kW motor; it leaves a
  leakage reactance of 0.175 pu, inside the usual 0.15 ~ 0.20, the check); fixed losses 0.36 of the full-load losses (maximum efficiency
  at 75 % load, NO-SOURCE, usual design).
- New lane test tests/lanes/model/cep-motor.cjs (reads anCepI from unit.js).

## Tested
- cep-motor PASS: 31.556 A at 298.4 kW, 27.1 A at the KSB duty 252 kW, 14.6 A at shut-off 105 kW, 10.1 A no load.
- 150 MW start, 2 plant min: CEP-A 21.1 A at 221 m3/h (the deaerator level valve of the current st150 holds the flow low; rank 6).
  The old ratio gave 21.3 A at the same flow.
- no-fit 0 new (1 baseline line removed, --update), one-path PASS.

## Not tested / left
- tests/regress/condensate.js (not in Checks) still compares with the HMI picture 28.1 A within 1 A; at the 150 MW flow of rank 6
  (~395 m3/h, ~249 kW) the law gives ~26.8 A: 4.6 % under the picture, which is a check, not a target. Not changed.
- elec.js (YUI) uses a fixed pf 0.919 for the CEP kW / kvar; the motor balance has its own pf (0.88 at full load). Told YUI.
- anMotorStep winding temperature uses 35.2 A as the rated current; the load schedule gives 31.56 A (34.4 A at the 325 kW nameplate).
