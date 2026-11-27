# Phase 11 part 7+8 (SUZU), fix 12: gland unloading to the No.1 LP heater pressure (2026-11-28, GO FIX 11)

Binago (`src/analog/engine/unit.js` anAuxStep; binura ang dalawang load law ng 29.PNG sa parehong commit):
- PV-GS1034 (unloading): ang back pressure ay ang shell ng No.1 LP heater (HB case 1: ang spill ay papunta sa No.1 LPH sa pamamagitan ng FV-GS1036) = extraction VI pressure ng port na `ext.lp1` ni RIN (ata), hindi bababa sa condenser. Dati ito ay max(Pc, 0.366 x MW / 150). Ang steam ay sa temperatura ng gland header (TEGS1002), dati 364 C ng 29.PNG.
- Ang simula ng gland PI ay 0 (dati -42.6 % x MW / 150 ng 29.PNG); ang save (st150) ang nagdadala ng estado nito.
- ports.js: idinagdag ang SUZU sa `to` ng `ext.lp1`.

Sinubok (headless, 150 MW 20 min, walang trip, MW 151.0):
- gland header 0.320 kg/cm2, PV-GS1034 64.8 %, spill 1,083 kg/h (HB 1,027), ext.lp1 0.366 ata (HB 0.354).
- as_page_values ALL PASS (TEGS1002 / 1003 355 C, TT-AS1015 248 C).
- no-fit 26 (2 inalis, 0 bago), one-path, ports at u-const PASS.
Hindi sinubok: live app; ang diverter FV-GS1036 papunta sa flash chamber (hindi modelled).
