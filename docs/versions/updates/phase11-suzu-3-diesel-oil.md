# Phase 11 part 7+8 (SUZU), slice 3: diesel oil from the design documents, no 6.PNG calibration (2026-11-27)

Binago (Rule 0: tinanggal ang 3 lumang fit, baseline 42 -> 39):
- Pump P-0702A / B: 29.5 T/H (ALLWEILER SNH660 data D1-0-060: 33.9 m3/h, oil 0.87); dati 25 T/H (MB-022 system flow). Relief 16.5 bar.
- Valves PCV-DO0002, FCV-DO1012, PCV-DO1009: Cv mula sa valve sheets E2-0-123 R1 (17.4 / 17.1 / 6.1), ISA liquid formula (0.799 T/H bawat Cv sa sqrt kg/cm2), at ang hugis ng valve mula sa dalawang sizing point na nakalimbag sa bawat sheet (modified parabolic / cascade); dati linear at ang laki ay fit sa 6.PNG.
- Linya mula header papuntang FCV-DO1012: 2 kg/cm2 sa 12.5 T/H (MB-022 item 3 = 15, item 6 / 7 = 13); dati fit sa 6.PNG.
- Pump motor current: sqrt(active^2 + magnetizing^2); active mula sa pump power curve (2.6 kW + 1.09 kW/bar) at motor eff 92.5 %; magnetizing = reactive current sa full load 46 A x sin(acos 0.88) = 21.8 A (TECO data D1-0-060); dati fit sa 25.4 A ng 6.PNG.

Sinubok (headless, 150 MW, 10 plant min, burners off): PI-DO0005 12.83 kg/cm2, PI-DO1008 10.95 kg/cm2 (hawak ng PICDO0005 / PICDO1008), PCV-DO0002 44.7 %, PCV-DO1009 61.8 %, FCV-DO1012 100 %, pump A 31.1 A. Pang-check: 6.PNG 12.8 / 11.0 kg/cm2, 25.4 A; SOP 12.5 / 10.4.
Hindi sinubok: oil firing (burners A ~ D bukas) at standby pump auto start.
Bukas: strainer DP 0.029 kg/cm2 (walang strainer sheet na nabasa).
