# Phase 11 turbine A: steam properties for the turbine expansion (RIN, 2026-11-27)

- Binago: bagong `src/analog/engine/turbine.js` (sa `order.list` pagkatapos ng `steam.js`): IAPWS-IF97 region 1 (tubig) at entropy ng region 2 (steam), saturation, estado sa (P, h), isentropic na dulo sa (P, s), volume. Ito ang kailangan ng expansion ng HP / IP / LP turbine (efficiency ng bawat bahagi mula sa design point, at Stodola para sa pressure ng bawat stage). Wala pang binabago sa takbo ng planta.
- Source: IAPWS-IF97 release (tables 2, 3, 5, 10 ~ 12, 15).
- Sinubok: `tests/lanes/model/turbine-steam.cjs`: 12 / 12 value tugma sa verification table ng IF97 (1e-6).
- Hindi sinubok: wala pang gamit sa app (susunod na hakbang).
- Susunod: turbine sections (Stodola + efficiency sa 100 % HB lang), test laban sa 7 HB case, pagkabasa ni YUA ng buong HB.
