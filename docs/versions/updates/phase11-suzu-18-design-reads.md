# Phase 11 part 7+8 (SUZU), fix 18: design reads in the model, aux steam pipes and plant air set pressure (2026-11-28)

Source: basa ni YUA (`suzu-design-reads-2026-11-28.md`, `suzu-aux-steam-2026-11-28.md`). Walang snapshot, trend o SOP (user rule 0).

Binago:
- `src/analog/engine/unit.js` AN_AS (aux steam header TT-AS1003 at gland TT-AS1017), DERIVED mula sa design data:
  - Metal ng header Mc3 2000 -> 2818 kJ/K: haba ng main lines AS-1-002 ~ 036 sa isometrics K1AU3-MM-2304 (sister unit #2, pipe lang) x ASME B36.10 S40 / STD kg/m = 5,751 kg x cp 0.49.
  - Heat loss ng header UA3 0.131 (SNAPSHOT-TO-REPLACE) -> 0.106 kW/K: loss per metre ng MHPS TDA-15-046 R2 Att-2 (3" 95.3 W/m sa 260 C, 6" 197.6 sa 337, 8" 244.8 sa 369; ambient 35 C), linear sa outside diameter para sa ibang size, x haba ng bawat line = 105.9 W/K. Ang kapal ng insulation ng FHI aux steam lines ay NOT IN DOCS (blangko ang field sa isometric): ginamit ang parehong MHPS design basis (surface <= 60 C).
  - Gland Mc17 300 -> 447 kJ/K at UA17 0.05 -> 0.018 kW/K: GS-n-001 8" 10.1 m, GS-n-040 6" 13.7 m, GS-n-010 ~ 025 8" 2.2 m (TDA-15-046 R2), parehong paraan.
  - G17 (coupling ng TT-AS1017 sa gland header habang sarado ang PV-GS1031): SNAPSHOT-TO-REPLACE pa rin, walang design source.
- `unit.js` plant air: bagong `AN_AIR_SP` (hiwalay sa AN_AIR dahil dala ng save ang AN_AIR): PA set pressure = IHI TRE set point list PIC1 0.800 MPa = 8.16 kg/cm2 G (dati 7.0). IA 7.0 = SNAPSHOT-TO-REPLACE. `AN_AIR.P` binura; `boiler.js` baTank ay bumabasa ng AN_AIR_SP.pa.
- MV-AS1011 (HP turbine warming) comment: source TCA686 (40 % inching habang HP exhaust < 5.0) at TCA685; walang binago sa code.

Hindi pa: seawater line sa MB-020 (susunod na fix), expansion tank fill sa DITL-78, strainers, SWP soft-start current, SWBP part-load current, tank levels.
Hindi sinubok: live app.
