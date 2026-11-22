# v1.0.0-beta.294 (JENNIE, 2026-11-22)

Full Audit 3 #5: the diesel oil density, the last NO-SOURCE of the diesel oil model (the 292 report F1).

## Changed

- `src/analog/engine/boiler.js` AN_DO.rho: 0.87 t/m3 (was 0.85, NO-SOURCE). Source: ALLWEILER characteristic curves for the screw pump SN 660 / 40, offer XZ-EPPA31 2014-02-21, in K1AU3-D1-0-060 R0 Engineering Data of Diesel Oil Pump p 7 (PC only): "Liquid pumped Diesel Oil, Density 0,87 kg/dm3" at 40 C. The scanned page was read as an image (pdf.js, headless). The density is used only for the tank level, so the level falls 2.3 % slower for the same oil burnt.
- `tests/regress/diesel_oil.js`: the expected tank fall uses 0.87.

## Result

- diesel_oil.js ALL PASS (four burners 4 x 0.95 T/H, tank -0.02 m in 10 min).
- Behaviour gate on the station page ALL PASS. No other model value changes.

## Findings

| # | Finding | Recommendation |
|---|---|---|
| F1 | The same pump sheet gives 33.9 m3/h at 15.5 bar, 1.8 mm2/s (= 29.5 T/H at 0.87). The model pump makes 25 T/H (MB-022 items 2-1 / 2-2), which matches the plant snapshot 6.PNG (25 T/H). | Keep 25 T/H: the plant snapshot outranks the vendor curve. The vendor figure is the curve at 15.5 bar, not the plant line-up. |
| F2 | The pump sheet power (19.5 kW at 15.5 bar) could replace the NO-SOURCE current split (45 % at no load). | Next pass of Audit 3 #5. |

## Tested

- `node tests/regress/diesel_oil.js`, `node tests/gate/behaviour.cjs` on the station page (TEST_LOCK held).
- `npm run build`, `npm run check` SAME.
