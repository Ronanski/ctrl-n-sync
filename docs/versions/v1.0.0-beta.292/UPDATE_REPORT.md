# v1.0.0-beta.292 (JENNIE, 2026-11-22)

Full Audit 3 #5: NO-SOURCE values in the engine, now from the plant documents.

## Changed

- `src/analog/engine/hx.js` economizer metal: 112.2 MJ/K (was 120 MJ/K, NO-SOURCE). Source: the economizer weights of the GA table (team-files/plant-study/13-thermal-masses): loop 189.00 t + common link 15.83 t + headers 19.59 t = 224.42 t, x 0.5 kJ/kg K. The split over the banks e1 / e2r / e2s / e3 is kept, each x 112.21 / 120.
- `src/analog/engine/boiler.js` AN_DO.A, the diesel oil service tank area: 35.69 m2 (was 23.8 m2, NO-SOURCE). Source: "Limay Project Diesel Oil Tank Inventory Table" 2016-08-16 (O&M V28, PC only): 0.5 m = 43.0 m3 ... 7.7 m = 300.0 m3, linear. Area = (300.0 - 43.0) / (7.7 - 0.5). It is inside the bound 300 m3 / 7.5 m = 40 m2 (Equipment List K1AU3-L1-0-002 p 29). The tank level falls 1.5 times slower than before for the same oil burnt.
- `tests/regress/diesel_oil.js`:
  - runs the page with the Worker off (`?worker=0`), as reset_worker.js. Since beta.275 the Worker is on by default and the test crashed (`iaPU` of undefined).
  - the tank check starts 1 m above the 150 MW level. Since 3.2.3-beta.233 the tank never falls below its starting level (unlimited supply), so the check could not see a fall.
  - the pump A trip check: DITL-31 #B row 8 (TR2/12, MIR-P0702A) starts pump B when pump A stops running, one scan after the trip. The header dips 13.5 to 8.4 kg/cm2 and is back in 2 s; it does not reach the L.L. 5 kg/cm2 of row 28. The check is now a dip of more than 3 kg/cm2 and B running.

## Result

- diesel_oil.js: ALL PASS (four burners 4 x 0.95 T/H, tank -0.02 m in 10 min = the new area; pump A trip, B up, header back 13.15).
- Behaviour gate on the station page: ALL PASS.
- At 150 MW the economizer change moves no steady value (metal mass only sets how fast it warms).

## Findings

| # | Finding | Recommendation |
|---|---|---|
| F1 | Oil density 0.85 is still NO-SOURCE (no diesel spec sheet found on the PC). | Keep 0.85 (typical diesel) until a fuel spec is found; next Audit 3 #5 pass. |
| F2 | Standby pump B starts on pump A stop (row 8), not on header L.L. (row 28). Row 28 is a second start path that only acts if B did not start. | As drawn. No change. |
| F3 | Open from 290: MST / RHT above plant at 90 MW; start-up bed hotter than 280; Cold run is the user's call. | Unchanged. |

## Tested

- `node tests/regress/diesel_oil.js` (headless, TEST_LOCK held).
- `node tests/gate/behaviour.cjs` on the station page.
- `npm run build`, `npm run check` SAME.
