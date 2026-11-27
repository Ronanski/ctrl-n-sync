# Phase 11 part 7+8 (SUZU), fix 14: aux steam volumes and the PCV-AS1030 curve (2026-11-28, GO FIX 11)

Binago (`src/analog/engine/unit.js` AN_AS, anAuxStep):
- Volume ng aux steam header 5.5 m3 (dati 6 m3 NO-SOURCE): kabuuan ng lahat ng aux steam line ng isometrics K1AU3-MM-2304 (haba x bore ng B36.10; ang 12" header AS-1-005 33.2 m = 2.40 m3). DERIVED, basa ni YUA `suzu-aux-steam-2026-11-28.md`.
- Volume ng gland seal header 0.45 m3 (dati 1.5 m3 NO-SOURCE): MHPS 310QK05-228 / 229 as built (DN200 header 8.7 m 0.28 m3 + feed / dump piping 0.165 m3). DERIVED; wala sa docs ang packing chambers.
- PCV-AS1030 (deaerator pegging): ang valve curve ay RAVEN curve #50 ng E2-0-123 R1 p43 (lift % papuntang Cv share), dati linear NO-SOURCE. Tugma sa p42: COND 1 Cv 190 sa 73 %, COND 2 Cv 17.9 sa 15 %.
- Komento ng gland header: HB case 1 1,820 kg/h (AN_AS.Whp0).

Sinubok (headless, 150 MW 20 min, walang trip, MW 151.0): aux header 10.20 kg/cm2 248 C, gland 0.320 kg/cm2, PV-GS1034 64.8 %, spill 1,083 kg/h. no-fit 26 (0 bago), one-path PASS.
Hindi sinubok: live app; ang start-up (pegging habang mababa ang load) ay sa sweep ng phase thread.
