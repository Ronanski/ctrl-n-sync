# Phase 11 RIN: ramp check on the minute sweep (main c57d763), 2026-11-28

## Binago
- `docs/accept/curves/curves.json` `hb.ms_press_ata`: the HB main steam pressure at the turbine is 126 ata at 40, 50, 60, 70, 85 and 100 % (HB PPE-14-0725 R1 cases 6 ~ 1) and 98.9 ata at 30 % (case 7). The curve slid from 60 % (the 40 / 50 % values had not been read); now it slides between 30 and 40 % only. Source: `/mnt/project-files/turbine-hb-read-2026-11-27.md`, the same numbers as `tests/lanes/model/turbine-hb.cjs`.
- Effect on the c57d763 samples (sweep-judge): main steam pressure at the turbine 50 -> 104 of 162 judged samples within 1.5 ata. The rest: the pressure control swing of 2 ~ 4 ata on the ramps and the pressure lag on the 40 -> 30 % slide (the boiler pressure set point of the logic).

## Sinuri (no model change)
The turbine steam path (turbine.js tbPath) at the sample inputs (flow, pressure, temperature at the turbine, hot reheat, draws, condenser) gives the sample MW within 0.3 MW and the sample cold reheat temperature exactly (45 MW and 90 MW holds). At the HB case 7 inputs it gives 329.4 C (HB 328.8). So the turbine rows that miss follow their inputs:
- **Heat rate swing at the 90 MW hold (±3 %, MW ±2.5 MW at a constant 276 T/H):** the deaerator draw (ext.w_hp x.da) swings from -11 to +23 T/H minute to minute (HB case 4: 11.9) and the LP heater draws from -1.6 to +16 T/H (HB 6.9 ~ 8.4). A steady hold should have steady draws; a negative draw is steam back from the heater into the turbine. Owners: deaerator (NANA, fw.js anDeaStep), LP heaters (MEI, unit.js anLphStep).
- **Heat rate -1.5 % at the 45 MW hold:** the deaerator draw is 0 (HB case 7: 5.8 T/H); the deaerator is on the pegging steam (PCV-AS1030, aux header from the main steam / cold reheat), whose heat is not in the heat rate sum of the sampler (tools/accept/part1.cjs: main steam over the final feedwater + reheat, the HB TGHR formula). Owners: NANA / SUZU (why the extraction is shut at 30 %: deaerator pressure set point PICCD1104 against the stage pressure 2.173 ata).
- **Main steam / cold / hot reheat flow high on the ramps, cold reheat temperature low:** the main steam at the turbine is 9 C low at 150 MW (529 vs 538) and 24 C low at 45 MW (481 vs 505), the reheat outlet 33 C low at 45 MW (472 vs 505). A colder inlet needs more steam per MW and gives a colder HP exhaust (the path at case 7 inputs with 481 / 472 C gives Tcr 305.8 C, the sample 305 ~ 307). Owner: SH / RH outlet temperature (KANA / AOI).
- **150 MW: 466 T/H for 151 MW (HB 458.7 for 150):** +0.9 % steam per MW, from the 9 C low main steam and 6 ~ 10 C low reheat. Same owner.

## Hindi sinubok
- No new sweep run (the curve change only re-judges the same samples).
