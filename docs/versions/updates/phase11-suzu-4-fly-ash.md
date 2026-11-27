# Phase 11 part 7+8 (SUZU), fix 4: fly ash conveying and silo from the design data (2026-11-27, GO FIX 11)

Binago (bagong process model sa loob ng package PLC, `src/analog/engine/pkg.js` pkgFaStep; walang lumang model na pinalitan, ang dating bits ay walang value):
- Abo papasok: ang fly ash ng bed balance (U.flyA; magiging port `ash.fly` ng AOI). A/H hoppers 575 sa 11,500 kg/h (L5-1 Sec 1 A.1), ang natitira sa ESP; ang hati sa 5 field ay DERIVED (pare-parehong field, Deutsch): 72 / 20 / 5.5 / 1.5 / 0.4 %.
- 11 blow tank (AH-A ~ D 100 L, EP-1 / EP-2 1000 L, EP-3 600 L, EP-4 200 L, EP-5 100 L; L5-1 Sec 1 p 3, E10209-3-750 ~ 754), bulk density 721 kg/m3. Siklo ng PLC (L5-1 Sec 3 4): puno -> hintay ng hangin -> pressurize hanggang 2.5 bar g -> convey sa 16,100 kg/h -> blow-down hanggang 0.4 bar g -> discharge sara 5 s -> inlet bukas 3 s + vibrator 3 s.
- Isang conveying air bawat unit, 20 Nm3/min sa 7 kg/cm2 (L5-1 Sec 1): isang tank lang ang nagko-convey sa isang oras (DERIVED). Linya 130 m ng 3" sch40 (L5-1 Sec 1 A.3).
- Silo T-1251: 1,600 m3, 10 m dia; LSL 9.6 m, LSH 30.52 m, LSHH 31.55 m (D1-0-017 p 60). Start state 50 %. LT-FH1700 0 ~ 100 % = 0 ~ 1,600 m3 (INFERRED: hindi nakalimbag ang span).
- Modbus read (pkg read fa): level high, inlet / discharge / air valve, vibrators, silo HH / H / L, vent filter, 40021 silo level sa %.

Sinubok (headless, 150 MW): flyA 7.1 T/H, EP-1 napupuno sa mga 16 min, umiikot ang siklo ng tank; Phase 8 gate PASS; no-fit 40 (0 bago, ceiling 45); one-path PASS; ports PASS. Sweep bago / pagkatapos: nasa PR.
Hindi sinubok: fault (pressurized / transported fail), unloader ng trak, purge valves.
Bukas (NOT IN DOCS): fill timer, fail timers, delay t, purge time, unloader schedule.
