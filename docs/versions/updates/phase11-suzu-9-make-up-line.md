# Phase 11 part 7+8 (SUZU), fix 9: make-up water header and pump power from the design (2026-11-27, GO FIX 11)

Binago (`src/analog/engine/model/cooling.js` AN_MU, anMakeupStep; ang dalawang fit ay binura sa parehong commit):
- AN_MU.z 11.3 m (FIT sa 28.png) -> -0.20 m: as-built instrument location plan K1AU3-E2-0-102 p11 / 12 (basa ni YUA, suzu-mu-elevations-2026-11-27.md). Zero ng LT-MU0708-A / B sa tap +10.200, katawan ng PT-MU0709 sa +10.400 (puno ng tubig ang impulse line). Ang friction ng header sa recirculation flow ay hindi isinama (NO-SOURCE).
- AN_MU.pCal 0.74 (FIT sa 28.png) -> wala: ang power ng pump ay ang vendor BHP curve na nakalimbag (KEW102066C).

Ano ang nakikita ng operator: ang PT-MU0709 sa 150 MW (2 MWP, recirculation) ay mga 7.85 kg/cm2 (dati 9.0, ang 28.png); ang current ng MWP ay mga 26 A (dati 20.5, ang 28.png). Ang pagkakaiba ay plant vs design, nakasulat at hindi fitted. Ang 7.85 ay mas mataas pa rin sa 5.5 L.L. (M.2506) at sa 6 kg/cm2 ng pagpuno ng expansion tank, kaya pareho ang logic.

Sinubok (headless): mu_ccw_model.js make-up rows PASS (7.846, Cold static 1.36); field_valves.js ALL PASS; no-fit 35 (1 inalis, 0 bago); one-path PASS.
Hindi sinubok: live app.
Bukas: DCS range / zero elevation ng PT-MU0709 (hook-up E2-0-101 hindi pa nabubuksan), line loss ng header.
