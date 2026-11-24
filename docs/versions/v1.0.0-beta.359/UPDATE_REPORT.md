# v1.0.0-beta.359 (ROSÉ, 2026-11-24)

## What was wrong
Lisa's Part 2 check listed tests that fail because they look for the old plant pages (MK05, MK07, MK08, MK14, CWN, the old "Plant view" with `#plsvg`). Those pages were removed when the HX pages became the HMI, so the tests crashed or found nothing. The app was not wrong; the tests were. They are fixed on the test side only, so the app keeps one page path.

While reading the Auxiliary steam and vacuum page, the three exhaust hood pressures PT-ST1110-1 ~ 3 showed no unit and 1 decimal, so 0.056 kg/cm² A read as "0.1".

## Fix
1. `tests/regress/lib.js`: three shared steps the click tests use, the same way the operator works:
   - `startAs(page, state)`: the start screen of the app, START STATE chip, then the Operator card.
   - `pressRun(page)`: the RUN button of the top bar.
   - `openHx(page, page id)`: the page picker of the Plant view (`lsShellC.openPage`).
2. `as_page_values`: reads the values from HX Auxiliary steam and vacuum (MV-AS1011 from HX Reheat steam). The two checks against the old 29.PNG plant snapshot are replaced by design / logic checks: hood temperature = saturation at the hood pressure; PCV-AS1020-1 / -2 = the ABC-030 F(X) of the PIC-AS1005 output.
3. `cep_auto`: Cold by the start screen, RUN, then MV-MU1001 on HX Condensate (`data-open="valve:MV-MU1001"`).
4. `field_ctl`: SWP-A permissive on HX Sea water, ring header drains V-BD1005 ~ V-BD1021 on HX Drum and steam, ESP on HX Ash.
5. `plant_click`: every visible item of HX Condensate and HX Sea water, real mouse click and real touch tap, plus the drag check.
6. HX Auxiliary steam and vacuum (`hx-page-aux-steam.js`): Hood pressure 1 ~ 3 in kg/cm² abs with 3 decimals, like PT-CD1110.

## Test (PC, headless Chrome)
- cep_auto: ALL PASS (MV-MU1001 LOCAL, REMOTE, OPEN, FULLY OPEN lamp).
- field_ctl: ALL PASS.
- plant_click: ALL PASS. Mouse 23 / 23 and 17 / 17, touch 23 / 23 and 15 / 15, drag opens nothing, no page error.
- as_page_values: every value is read from the HX pages; results in the PR.
- `build.js --check` SAME, operator text check, version check.

## Not changed
- `values_layout` is not a stale test. It is the logic-sheet label check: 957 value labels cover text or wires on 52 of the 54 ABC sheets. That is the next job (fix the overlaps, then put the test in CI).
