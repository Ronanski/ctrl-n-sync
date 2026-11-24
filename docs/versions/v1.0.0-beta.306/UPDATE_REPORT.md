# v1.0.0-beta.306 (JENNIE, 2026-11-23)

NO-SOURCE cleanup: the diesel oil pump current at no load (`AN_DO.fI`, src/analog/engine/boiler.js) was 0.45 with no source.

## Derivation

Source: K1AU3-D1-0-060 R0 "Engineering Data of Diesel Oil Pump" (PC only).

| Item | Value | Page |
|---|---|---|
| Pump shaft power | 2.6 kW at 0 bar + 1.09 kW/bar (19.5 kW at 15.5 bar) | p7 curve, p8 data sheet |
| Motor | TECO 40 HP, 460 V, FLA 46.0 A, eff 92.5 %, PF 0.88 | p9 |
| Snapshot current | P-0702A 25.4 A at 12.8 kg/cm2 | 6.PNG |

1. Active current Ia = P / (eff x sqrt3 x 460 V): 22.5 A at 12.8 bar, 3.5 A at 0 bar.
2. The sheet has no magnetizing current Im. From the snapshot, 25.4 A = sqrt(Im^2 + 22.5^2), so Im = 11.9 A. That is 0.26 x FLA and under the full-load reactive current 46 x sin(acos 0.88) = 21.8 A, so it is plausible.
3. At no load, sqrt(11.9^2 + 3.5^2) = 12.4 A = 0.49 x 25.4 A. New value: `fI: 0.49`.

The snapshot point does not move (25.4 A at 12.8 kg/cm2).

## Tests

- tests/regress/diesel_oil.js: ALL PASS (snapshot 25.4 A, burner A 24.78 A, pump trip, Cold SOP 20).

## Findings

| # | Finding | Recommendation |
|---|---|---|
| 1 | The motor magnetizing current is taken from one plant point (the snapshot), not a test sheet. | If the TECO motor test report (no-load current) is found, put it in place of the snapshot value. |
