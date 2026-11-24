# Design target curves (for the curve-sweep check)

Made 2026-11-24 by AUDIT FIX : LISA (user GO START, rule 0). Machine-readable file: `curves.json` (same data). Use: Jennie's sweep check of Part 1 (`tools/accept/part1.cjs`) at every load, not only 45 / 90 / 150 MW.

**Rule 0.** Every point below is from a design document (FHI CFB boiler manual P2S7, Hitachi heat balance PPE-14-0725 R1, Howden APH L20). No plant trend or snapshot. Between two printed points: a straight line. Outside the printed range a curve is **not** a target (FHI prints 40 ~ 100 % MCR; the 45 MW HB case is 149.95 T/H = 32.6 % MCR, below the FHI range: its boiler targets need a physics calculation, written beside the value, as `docs/ACCEPTANCE.md` already does).

**Load basis.** FHI: % MCR = main steam flow / 460 T/H. HB: % load = MW / 150. They are not the same (90 MW = 273.4 T/H = 59.4 % MCR).

## FHI boiler curves (x = % MCR)

| Curve | 40 | 50 | 60 | 70 | 80 / 85 | 100 | Source in repo | Missing (read on PC) |
|---|---|---|---|---|---|---|---|---|
| Fig 6 SH and RH outlet, °C | 524 | 534 | 541 | 541 | 541 | 541 | DRAWING_TRACE (icms-master-tool v2.2.0) l.186, tests/regress/unit_load.js l.76 | - |
| Fig 7 O2, % | 8.8 | 4.6 | 3.6 | 3.6 | 3.6 | 3.6 | GAS_PATH.md (v3.2.1), gas_path.js | - |
| Fig 8 furnace average, °C | 660 | - | 755 | - | - | 840 | unit.js l.2186 / 2309 / 2274, boiler.js l.649 | 50, 70, 85 % |
| Fig 9 furnace DP normal, mmH2O | 1380 | 1380 | 1380 | 1440 | 1550 (85) | 1630 | ACCEPTANCE.md, hmi-op.js l.330 | low limit 60 ~ 100 % (1150 at 40 ~ 60, 1450 at 100; high 2100) |
| Fig 10 SH spray, % of MSF | - | - | 0 | 1.1 | 1.95 (85) | 2.7 (12.4 T/H) | unit.js l.57, hx.js l.96 | not printed below 60 % |
| Fig 11 SH outlet pressure, kg/cm²g | - | - | - | - | - | 129 | Tab 3 | **all points** (ACCEPTANCE 100.0 / 126.5 came from Jennie's PC table) |
| Fig 12 total air, T/H | 365 | 332 | 371 | 427 | ~485 (80) | 596 | GAS_PATH.md, DRAWING_TRACE | 85 / 90 % |
| Fig 12 PA · SA, T/H | 245 · 96 | - | 236 · 111 | - | - | 354 · 218 | ACCEPTANCE.md | 50, 70, 80, 85 % |
| Fig 13 coal, T/H | 38.5 | 47.0 | 56.0 | 64.0 | 77.0 (85) | 89.5 | unit.js l.2184, boiler.js l.1124 | - |
| Fig 13 limestone, T/H | 5.0 | 6.0 | 7.1 | 8.0 | 9.6 (85) | 12.0 | boiler.js l.1124 | - (logic cap 4.9 T/H, ABC-005: logic, not a model fault) |
| L20 APH gas in, °C | 272 | - | 285 | - | - | 322 | boiler.js l.649 | - |

Fig 12 100 % total 596 = PA 354 + SA 218 + fluidizing air ~24. DRAWING_TRACE reads 595 / 425 / 370 / 330 (within 2 T/H of GAS_PATH).

**Tab 3 at 100 % MCR** (page 2-7-TAB_3-1): steam 460 T/H; SH out 129 kg/cm²g, 541 °C, SH DP 16; RH 401 T/H, in 36.6 / 370, out 35.1 / 541; feedwater 245.4 °C; economizer out water 303 °C; APH gas 322 → 135 °C; PA 45 → 285.8, SA 39 → 301.6 °C; ambient 35 °C; coal 89.0 T/H; excess air 20 %; efficiency 90.9 % LHV.

**Start-up and shutdown:** Fig 1 rise ≤ 110 °C/h (83 at high pressure). Fig 2 cold start: roll ~6.0 h, sync ~7.0 h, full load ~12.5 h from light-off (full hourly table: PC). Fig 3 warm restart: furnace 360 °C, SH / RH 315 °C, SH 40 kg/cm². Fig 4 hot: 700 °C, 430 °C, 100 kg/cm². Fig 5 cold shutdown: PC only.

## Hitachi heat balance PPE-14-0725 R1 (x = % load)

| Row | 30 % | 40 % | 50 % | 60 % | 70 % | 85 % | 100 % |
|---|---|---|---|---|---|---|---|
| Generator MW | 45 | 60 | 75 | 90 | 105 | 127.5 | 150 |
| Main steam, T/H | 149.954 | 190.769 | 231.94 | 273.36 | 318.817 | 387.587 | 458.327 |
| MST = RHT, °C | 505 | 520 | 529 | 538 | 538 | 538 | 538 |
| Main steam pressure, ata | 98.9 | PC | PC | 126.0 | 126.0 | 126.0 | 126.0 |
| HP exhaust = No.6 extraction (cold reheat), ata | 12.79 | 16.35 | 19.9 | 23.48 | 27.25 | 32.89 | 38.64 |
| No.5 extraction, ata | 5.0 | 6.38 | 7.75 | 9.13 | 10.56 | 12.7 | 14.87 |
| Deaerator extraction, ata | 2.173 | 2.769 | 3.355 | 3.943 | 4.553 | 5.457 | 6.369 |
| No.3 / No.2 / No.1 LPH extraction, ata | 0.658 / 0.286 / 0.133 | 0.837 / 0.364 / 0.167 | 1.014 / 0.44 / 0.201 | 1.19 / 0.516 / 0.234 | 1.373 / 0.594 / 0.269 | 1.643 / 0.71 / 0.321 | 1.914 / 0.826 / 0.373 |
| No.3 / No.2 / No.1 LPH flow, kg/h | 4251 / 3426 / 2243 | 5603 / 4525 / 4184 | 6963 / 5685 / 6060 | 8422 / 6871 / 7935 | 10009 / 8190 / 10093 | 12531 / 10192 / 13357 | 15246 / 12270 / 16834 |
| Cold reheat T/H · °C | 145.0 · 328.8 | PC | PC | 265.4 · 358.1 | PC | PC | 446.1 · 370.2 |
| Hot reheat T/H · ata | 134.8 · 11.51 | PC | PC | 243.1 · 21.13 | PC | PC | 400.9 · 34.77 |
| Final feedwater °C · T/H | 188.6 · 150.3 | PC | PC | 218.0 · 273.7 | PC | PC | 245.4 · 458.7 |
| Turbine heat rate, kcal/kWh | 2331 | PC | PC | 2079 | PC | PC | 1989 |

Source in repo: `src/analog/engine/unit.js` AN_TBW / AN_HB (l.2713 ~ 2790), `tools/accept/part1.cjs`, `docs/ACCEPTANCE.md`. MW check: the shaft work of AN_TBW less the losses gives 45.00 / 59.99 / 74.99 / 89.99 / 104.97 / 127.46 / 150.00 MW, so the table and the engine agree. Note: the cold reheat pressure row is ata at the HP exhaust; HB has no MW case below 30 %.

## To read on the PC (one sitting, for whoever holds the PC)

1. FHI P2S7 Fig 11: all points of the SH outlet pressure curve.
2. FHI P2S7 Fig 8: furnace average at 50, 70, 85 %.
3. FHI P2S7 Fig 12: PA and SA at 50, 70, 80, 85 %; total at 85 / 90 %.
4. FHI P2S7 Fig 9: low limit between 60 and 100 %.
5. FHI P2S7 Fig 2 / 3 / 4 hourly tables; Fig 5 cold shutdown.
6. PPE-14-0725 R1 pages 7, 8, 10, 11 (40 / 50 / 70 / 85 %): main steam pressure, cold / hot reheat flow, temperature and pressure, final feedwater, heat rate.
7. PPE-14-0728 R1: the ten bypass cases (only the LP bypass point 5 ratio is in the repo).
