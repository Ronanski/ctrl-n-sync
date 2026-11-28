# Phase 11 part 7+8 (SUZU), fix 24: IA set pressure and SWP start current from the docs (2026-11-28)

Source: basa ni YUA, `suzu-reads-batch-2026-11-28.md`.

Binago:
- `src/analog/engine/unit.js` AN_AIR_SP.ia: instrument air set pressure = IHI T2A panel IXE-00037 ~ 39 (O&M L17-3 sheet 10-45) PIC1 0.700 MPa = 7.14 kg/cm2 G (constant pressure mode). Dati 7.0, walang design source.
- `src/analog/engine/model/cooling.js` AN_SWP_SS: ang kuryente ng SWP habang nag-ra-ramp ang soft starter = HRVS-DN factory default current limit 400 % FLA (manual 27.03.2012 p52) x 260 A (TECO 100 % load) = 1,040 A. Ang site setting ay NOT IN DOCS (E1-0-131 ay walang setting sheet). Dati 500 A, walang design source.
- `tests/regress/air_model.js`: ang IA set pressure ay mula na sa parehong dokumento.

Hindi pa (NOT IN DOCS, naka-marka pa rin): strainer DP (MU, ACW, DO), demi tank level (T-0708A/B: ID 11,400 mm, overflow 14,791 mm, walang normal level), DO tank level (T-0701 300 m3, walang normal level).
Hindi sinubok: live app.
