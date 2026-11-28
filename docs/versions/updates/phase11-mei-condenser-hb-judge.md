# Phase 11 (MEI): condenser back pressure judged against all 8 heat balance cases

Asked by the phase thread: a vendor-curve judge for the condenser vacuum, next to the turbine-hb test.

## Added (tests/lanes/model/condenser-hb.cjs)
- The condenser vendor has no back pressure curve: K2MC3A O&M, D1-039 R0 / R1 and D1-066 have NOT IN DOCS (mei-condenser-vendor-reads-2026-11-28.md). The design curve is the condenser pressure of HB PPE-14-0725 R1 per case, at the design sea water (O&M Sect 1 p3: 30 C, 31,500 t/h). At case 1, HB 0.070 ata matches the O&M 68.6 mbar.
- For each case:
  - The steam coming in is what the turbine model gives with the HB inputs (turbine.js tbPath, the same way as turbine-hb.cjs): the LP exhaust flow and enthalpy.
  - The LP heater drains are added: the HB No.3 + No.2 + No.1 extractions plus the SSR spill-over, at 6.95 C above the shell (D1-039 R1 p4: LPH drain 45.6 C at the 38.65 C shell, DERIVED).
  - The pressure is the model's steady law, from the unit.js functions read out by name (AN_CD, AN_CDU, anPsat, anCdHw2, anCdUA; no copy). It uses the anCondStep exchanger law Ts = Tin + Q / (C (1 - exp(-UA / C))), with UA from the tube law at the mean water temperature.
  - The test fails beyond 0.003 ata, which is half the HB step between two cases.
- The HB cases are read from the table in turbine-hb.cjs, so the test data has one copy.

## Tested
- The model condenser pressure vs the HB pressure, in ata:

| Case | Model | HB | Error |
|---|---|---|---|
| 1 | 0.0698 | 0.070 | -0.0002 |
| 2 | 0.0656 | 0.065 | +0.0006 |
| 3 | 0.0616 | 0.060 | +0.0016 |
| 4 | 0.0590 | 0.057 | +0.0020 |
| 5 | 0.0566 | 0.055 | +0.0016 |
| 6 | 0.0543 | 0.054 | +0.0003 |
| 7 | 0.0520 | 0.053 | -0.0010 |
| VWO | 0.0706 | 0.071 | -0.0004 |

- At case 1 the duty is 195.7 MW, which is the O&M thermal load.
- No model file changed. phase11-gate: PASS.
