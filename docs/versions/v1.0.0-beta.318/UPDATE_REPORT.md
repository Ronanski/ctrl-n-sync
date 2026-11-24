# LMYP OTS 1.0.0-beta.318 (LEADER : JENNIE, 2026-11-23)

Audit #5: four more motor valve closing times from the plant documents.

## What changed for the operator

The motor valve drawing K1AU3-E2-0-122 (Drawing of Motor Valve) has four Limitorque "Confirmation Sheet For Valve Actuator" pages after
the 21 already used (PDF pages 72 ~ 75, NIPPON GEAR, 2014-10-27). Before, these valves took 10 s for a full stroke (no source).

| Valve | Size and type | Closing time now | Sheet |
| --- | --- | --- | --- |
| MV-IW0391 | 150# 6" gate | 32 s | PDF p 72, order L34028A |
| MV-AS1394 | 800# 2" globe | 10 s (same as before, now sourced) | PDF p 73, L34028B |
| MV-AS1395 | 300# 3" gate | 20 s | PDF p 74, L34028C |
| MV-AS1396 | 800# 2" gate | 13 s | PDF p 75, L34028D |

The open time is taken equal to the closing time, as for the other sheets (the sheets print only "closing time approx.").

## Findings

| # | Finding | Recommendation |
| --- | --- | --- |
| F1 | MV-AS1397 and MV-TS1400 are on the logic sheets but not in the valve list of the drawing (PDF p 3, 33 items, 81 valves). They keep 10 s (NO-SOURCE). | Time one full stroke of each in the field, or find their actuator sheets. |
| F2 | The valve list row 31 reads "MV-AS1304 / 2394"; the actuator sheet (p 73) says MV-AS1394 / 2394, so 1304 is a typing error in the list. | None for the app (it uses AS1394). |
| F3 | The solenoid (on / off) valves keep 3 s; their stroke times are not in this drawing. | Look in the instrument data sheets of each valve. |

## Tests

- New closing times read back in the app: IW0391 32, AS1394 10, AS1395 20, AS1396 13 s; AS1397 and TS1400 10 s.
- `tests/regress/ditl_timer_tags.js`: ALL PASS.
- Behaviour gate (20 plant min at 150 MW): ALL PASS.
