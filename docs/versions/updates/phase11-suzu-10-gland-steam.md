# Phase 11 part 7+8 (SUZU), fix 10: gland steam header from the Hitachi heat balance (2026-11-27, GO FIX 11)

Binago (`src/analog/engine/unit.js` AN_AS, anAuxStep, anAsTagStep; ang lumang code ay binura sa parehong commit):
- HP packing leak papunta sa gland header: Whp0 2694 kg/h (FIT sa 29.PNG) -> 1,820 kg/h = 403 (HP inlet end, main steam) + 1,417 (HP exhaust end, cold reheat), Hitachi HB PPE-14-0725 R1 case 1 (150 MW). Ang enthalpy ay halo ng dalawa.
- Seal users on load: ang LP / outer glands lang (793 kg/h sa HB: 421 sa gland steam condenser + 372 sa condenser); off load ay kasama ang HP packings (feed valve sheet NOR 2,170 kg/h). Kaya ang spill sa No.1 LPH ay mga 1,027 kg/h (HB).
- Warm-up orifice 5 mm sa paligid ng PV-GS1031 (Hitachi 310PK01-852 R1 as-built): Cv 0.70 (Cd 0.61, DERIVED), mga 67 kg/h. MV-GSn030 ay itinuring na bukas habang naka-service ang gland sealing.
- TEGS1002 / 1003: energy balance ng header (dati TT-AS1015 + 107 C x MW / 150). TT-AS1015: ang steam bago ang PV-GS1031 (PD-014 line order), dumadaloy sa warm-up orifice (dati TT-AS1003 + 21 C x MW / 150).
- Binura ang fallback na PTGS 0.32 at PV-GS1034 42.6 % x MW / 150.

Ano ang nakikita ng operator sa 150 MW: header 0.32 kg/cm2, PV-GS1034 64.7 %, TEGS1002 / 1003 349 C (29.PNG 364 / 362), TT-AS1015 238 C = aux header (29.PNG 257). Sarado ang PV-GS1031 (self-sealing, gaya ng HB).

Sinubok (headless): as_page_values.js ALL PASS; no-fit 0 bago; one-path PASS; ports PASS.
Hindi sinubok: live app; ang drain ROs (V-GS1033, V-GS1050) hindi pa modelled (estado ng valve NOT IN DOCS).
Bukas: ang No.1 LPH pressure ng unloading (MEI port), header volume, pipe loss.
