# Phase 11 part 7+8 (SUZU), fix 8: bottom ash silo T-1090 level from a mass balance (2026-11-27, GO FIX 11)

Binago (`src/analog/engine/model/cooling.js` anBacStep; ang lumang fixed value ay binura sa parehong commit):
- Dati: LT-BH1750 = 15.8 % palagi (galing sa 16.PNG, hindi gumagalaw).
- Ngayon: ang level ay tumataas sa abo ng mga screw cooler na tumatakbo, kapag tumatakbo ang chain conveyor L-1090 (DITL-BA68, U.baConv) at ang two-way L-1094 ay papunta sa silo (U.ba.tw sarado). Ang labas (pag-unload sa trak) ay lokal, walang DCS signal, kaya wala rito.
- V 200 m3: JAT layout 130225A-LAYOUT-01 rev 0, equipment table item 7 (basa ni YUA, suzu-leftovers-doc-reads.md 3a). DUDA: malabo ang unang digit, 200 o 700.
- Bulk density 1,000 kg/m3: NO-SOURCE (walang bulk density ng bottom ash sa L6 / L13 / DITL).
- Ang simula ay ang state (st150 15.8 %).

Sinubok (headless): ashcool.js ALL PASS (sa 150 MW nakatigil ang 4 cooler, kaya 15.8 % ang hawak); no-fit 36 (0 bago); one-path PASS.
Hindi sinubok: pagpuno habang tumatakbo ang cooler sa live app.
Bukas: tamang volume (200 o 700 m3), bulk density, unloading.
