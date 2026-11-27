# Phase 11 NANA fix: SH spray flow from KANA's SH tap pressure, 2026-11-27 PHT

**Binago:**
- Dati ay sinusukat ang SH spray (FT-FW1109 / FT-FW1119) laban sa presyon na drum - 6.4 / 9.3 x (ms / 474.1)^2. Ang 474.1 at ang 6.4 / 9.3 ay galing sa snapshot 03.png.
- Ngayon ay ginagamit na ang presyon sa SH tap 1 at 2 mula sa design SH drop law ni KANA (anShTap, AN_SHDP: 16 kg/cm2 sa 460 T/H, FHI Part 2 Sect 7).
- Binura na ang lumang lf.
- Kasama ito sa PR ng HP heater (iisang batch), at ang 150 MW start ay inayos ulit (settle 20 min mula sa start ng main).

**Sinubok:** fw lane tests, ports, no-fit, at one-path, at ang loaded start sa 150 MW.

**Hindi sinubok:** ang live app at ang buong 45 hanggang 150 MW sweep (ang phase thread ang nagpapatakbo nito sa main).
