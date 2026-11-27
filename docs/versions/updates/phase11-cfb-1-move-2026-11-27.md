# Phase 11 part 1 (combustion + CFB furnace), step 1: own file, dead bed laws out

AOI (MODEL COMBUSTION CFB), 2026-11-27 PHT. User 11:05 AM: "Ok sinisimulan naba plant model? Gawin nio na".

## Ano ang binago
- Bagong file `src/analog/engine/cfb.js`: ang physics ng furnace (fuel heat, bed at lower refractory, circulating solids at upper furnace, bed inventory at cyclone / seal pot loop, gas na lumalabas ng furnace). Inilipat mula sa `unit.js` nang walang binagong numero; isinama sa `src/analog/order.list` bago ang `engine/unit.js`.
- Tinanggal ang patay na lumang bed law (rule-0 list 2026-11-24 item 5): table na `AN_BED` at `anBedSS` (per-load table), `kBedSU`, `tauBc` at `uaW` ng `AN_UNIT` (walang bumabasa mula beta.256), ang `AN.bedSS` ng api at ang lumang test `tests/regress/bed_fig8.js` na iyon lang ang sinusubok.
- `tools/check/no-fit-baseline.json`: 44 -> 41 na lumang fit (3 ang nawala kasama ng patay na code; ang iba ay lumipat lang ng file, walang bago).
- `tools/steady150/make.cjs` at `tests/lanes/hmi-turbine/pages-bound.cjs`: binabasa na rin ang `cfb.js`.

## Sinubok
- `node tools/check/no-fit.cjs`: 41 luma, 0 bago.
- Behaviour gate (150 MW, 5 plant min) sa main at sa branch: parehong numero (tingnan ang PR).
- `tests/lanes/hmi-turbine/pages-bound.cjs`: 0 problema.

## Susunod
- Step 2: bed inventory sa design, FHI P2S7 Fig 9 1630 mmH2O = 194.2 t (ngayon ay plant trend 1465 = 174.3 t).
- Step 3: solids sa part load (kKL) mula sa FHI 60 % MCR point, hindi sa plant trend.
