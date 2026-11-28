# Phase 11 part 7+8 (SUZU), fix 20: the make-up water port 'mu' (2026-11-28)

Binago (`src/analog/engine/model/cooling.js` anMakeupStep): isinusulat na ng SUZU ang port `mu` (SUZU -> MEI, ports.js): ang make-up water papasok sa hotwell, T/H = ang make-up ng cycle model (LCV-MU1110 + MV-MU1001) habang may MWP na nagpapakain sa header; 0 kapag walang pump. T = ambient (AN_UNIT.Tamb, demi tanks sa labas; ang temperatura ng MB-016 ay hindi pa nababasa). Dati ay "missing" ito sa whole-plant water balance.
Sinubok (headless, 150 MW 120 s): mu = 0 T/H (walang make-up sa steady 150 MW), T 30 C; ports PASS.
Hindi sinubok: live app.
