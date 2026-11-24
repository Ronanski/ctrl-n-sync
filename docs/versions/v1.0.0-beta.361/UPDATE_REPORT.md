# v1.0.0-beta.361 (ROSÉ, 2026-11-24)

## What was wrong
`as_page_values` still started from the old snapshot path (`AN.plantLoad150` + `DITL150.apply`, which gave 39 MW) and compared two values with the old 29.PNG plant snapshot. A plant snapshot is no test target: the design is the model.

## Fix (test side only)
1. The start is the app's own 150 MW start (start screen, 150 MW, Operator: `lib.js startAs`), then 1800 s of scan, three times the 600 s lag of the exhaust hood (`tcs.js` `TCS.tauX`).
2. Hood temperature 1 ~ 3 = saturation at the hood (= condenser) pressure, within 1.5 C.
3. PCV-AS1020-1 / -2 on the page = the ABC-030 F(X) of the PIC-AS1005 output (the model tags), within 0.11 %.
4. PV-GS1034 throttles (between 1 and 99 %) and MV-AS1011 is shut on load, in place of the snapshot numbers.

## Test (PC, headless Chrome)
- as_page_values: ALL PASS (hood 40 C, saturation 39.6 C at 0.074 kg/cm2 A).
- `build.js --check` SAME, version check.
