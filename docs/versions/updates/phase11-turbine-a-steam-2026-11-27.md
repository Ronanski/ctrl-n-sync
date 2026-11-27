# Phase 11 turbine A: steam table para sa turbine expansion (RIN, 2026-11-27)

- Binago: dinagdagan ang KASALUKUYANG steam table `src/analog/engine/steam.js` (walang bagong model, walang bagong file sa engine): IAPWS-IF97 region 1 (tubig) at entropy ng region 2 (steam), saturation, estado sa (P, h), isentropic na dulo sa (P, s), volume. Ito ang kailangan ng turbine ng `unit.js` para palitan sa parehong lugar ang per-load table AN_TBW / AN_HB (susunod na hakbang). Wala pang binabago sa takbo ng planta.
- Source: IAPWS-IF97 release (tables 2, 3, 5, 10 ~ 12, 15).
- Sinubok: `tests/lanes/model/turbine-steam.cjs`: 12 / 12 value tugma sa verification table ng IF97 (1e-6).
- Hindi sinubok: wala pang gamit sa app.
- Susunod: ang turbine sa `unit.js` mismo: Stodola + efficiency sa 100 % HB lang, at aalisin ang AN_TBW / AN_HB sa parehong PR.
