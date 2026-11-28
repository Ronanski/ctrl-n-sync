# Phase 11 part 7+8 (SUZU), fix 19: sea water design point from design data (2026-11-28)

Source: basa ni YUA (`suzu-design-reads-2026-11-28.md` items 1, 2, 3, 9). Walang snapshot, trend o SOP (user rule 0).

Binago (`src/analog/engine/model/cooling.js`):
- Bagong `AN_SW_DP` (hiwalay sa AN_SW dahil dala ng save ang AN_SW; ang line constants ay kinukuwenta na rin sa labas ng AN_SW, `swCalC`):
  - Forebay level -4 m (SNAPSHOT-TO-REPLACE) -> GL -8.08 m, DERIVED: gitna ng HWL GL -6.37 at LWL GL -9.78 (K1AU3-D1-0-105 R8 p10, CV030 Section A). Hindi naka-print ang normal level.
  - Ang presyon ay nagsisimula sa pump: EBARA curve (28 m sa 18,900 m3/h) + forebay = SWP header 1.80 kg/cm2 G (PG-SW1501 1.85). Mula roon, ang mga BAWAS ng MB-020 (kg/cm2 G, naka-print sa heading ng table, basa ni YUA): header -> labas ng debris filter 0.3 (2.8 -> 2.5) = node N = condenser inlet at SWBP suction; SWBP rise 1.5 (4.0 - 2.5) -> PACO curve 1,029 m3/h bawat pump (MB-020 1,000).
  - Condenser inlet water box 1.05 (SOP) -> 1.49 kg/cm2 G; SWBP discharge 2.35 (SOP) -> 3.0.
  - UNUSUAL: hindi kayang abutin ng EBARA pump ang mismong MB-020 na 2.8 G (kailangan ng 37 m na head; 28 m ang rated). Kaya ang pump curve at ang civil level ang nagtatakda ng antas ng presyon, at ang MB-020 ang nagbibigay ng bawas sa pagitan ng mga punto.
  - Condenser tube loss 0.4 (SOP) -> vendor FHI condenser O&M 1.1.2: 0.47 bar sa 31,500 t/h, k ~ flow^2. UNUSUAL: ang MB-020 ay 17,900 t/h bawat path sa 0.5.
- Expansion tank AN_ACW_MB.Lv 1.7 m: hindi nagbago ang value, ang source ay DITL-78 (XV-MU1109 sarado sa > 85 % ng 0 ~ 2 m = 1.7 m). Ang normal level ay NOT IN DOCS.
- Expansion tank fill: dati 6 kg/cm2 (SOP) -> AN_MU_ETP 2.0 kg/cm2 sa PT-MU0709, DERIVED mula sa CW isometrics K1AU3-P3-2-101 R3: tank bottom GL +28.386, itaas GL +30.386 (tugma sa LT-CW1109 0 ~ 2 m); 0.1 x (30.386 - 10.400).
- `tests/regress/cw_model.js`: tinanggal ang SOP checks; ang mga check ay galing na sa design: PG-SW1501 = EBARA curve + forebay (1.85), inlet = pump header - MB-020 drop, ang drop = condenser vendor, ang start current ay nasa pagitan ng 260 A full load at HRVS-DN 400 % FLA.

Resulta sa 150 MW (headless world): PG-SW1501 1.85, condenser in 1.494 / out 0.854 kg/cm2, 17,846 m3/h bawat path, SWBP 1,029 m3/h, seawater out 34.8 C.
Sinubok: cw_model ALL PASS; no-fit, one-path, u-const, ports PASS.
Natitira (SNAPSHOT-TO-REPLACE pa): SWP soft-start 500 A (walang plant setting sa docs), SWBP part-load current, strainers, demi tank levels, IA 7.0.
Hindi sinubok: live app.
