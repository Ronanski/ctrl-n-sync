# Phase 11 FEEDWATER batch 2 (NANA, 2026-11-28 PHT)

Source of truth: first principles + design data (KSB HGC 5/1+6 data sheet and curve Q43446D, HB PPE-14-0725, IAPWS-IF97) and the DCS logic. No plant screen, trend or procedure value.

## What the operator sees
- BFWP discharge PT-FW1011 at part load now reads the KSB curve at the real water density. The deaerator water is colder at low load (125.6 C at 45 MW, against the data sheet 158.4 C), so it is denser, and the same head in metres gives more pressure:
  - 45 MW: 205.3 -> 211.9 kg/cm2 g.
  - 90 MW: 197.4 -> 201.6.
  - 150 MW: 169.2 -> 168.9 (unchanged).
- The feedwater code and the BFWP lube oil / suction valve rows no longer cite plant screens or PR-OPE. The no-snapshot baseline goes down: fw.js 18 -> 2, plantsw.js 12 -> 7, fw_page_values.js 6 -> 0.

## Changes
1. `anFwSg(U)` = IF97 `anWaterRho(U.da.T)` / 1000, used for the pump pressure (dp = rho g H), the volume flow (mass / rho), the 3rd-stage tap, the pump heat and the shaft power (data sheet pP x sg / 0.9093). `AN_FW.sg` 0.9093 stays only as the data sheet density of the pP curve.
2. Comment text only, no value change: fw.js LP drain start (DCS controller SV and the design drain), the BFWP motor / strainer / SH spray / economizer inlet history, plantsw.js DITL-23A rows 11 / 17.

## Tested (headless)
- fw lanes: deaerator, hp-drains, hp-heaters and bypass-spray pass.
- Guards: ports, one-path, no-fit and u-const pass.
- part1.cjs 150 -> 90 -> 45 MW (30 min settle, 5 min window), no trip:
  - final FW temperature 190.0 / 220.5 / 246.0 C against HB 188.6 / 218.0 / 245.4: PASS;
  - FW flow at 90 / 150 MW: PASS.

## Open
- FW flow at 45 MW is 160.4 against HB 150.3 (main steam 153.9). The extra 6.5 T/H leaves the drum outside the feedwater part; it is with KANA.
- AN_FWT.ms0 is read by unit.js only (phase thread list).
