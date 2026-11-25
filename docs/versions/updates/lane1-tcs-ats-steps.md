# TCS ATS step macros (TCS LOGIC : MARIA, 2026-11-25 PHT)

Bilang: 349 → 357 of 419 TCS sheets run as their logic (drawing-complete 250 → 252, manual-text column 99 → 105).

## Ano ang binago
- **START-UP MODE MT1 (TCA500):** drawn sa ATS program 310SC90-795 PAGE 12 (ang dashed box). Ang mode ay ang pinakamababang mode na mas mababa ang metal temperature (150 / 170 / 230 / 420 / 999 degC), kinukuha sa timing (turbine trip) at hawak pagkatapos. HEAT = ang memorized temperature para sa heat soak timer.
- **STEP UP ORDER MT1 (TCA515):** PAGE 7 note *2: ORDER n = may napiling step na mas mataas sa n.
- **STEP CONTROL MD, ayos:** ayon sa PAGE 7, ang UPPER STEP SELECTED ay nasa EXECUTED set lang. Dati ay ginagawa nitong SELECTED ang mas mababang step, kaya ang pulse na OTHER STEP SELECTED ay nag-aalis sa step na pinili ng operator. Pinalitan ang lumang test na umaasa sa maling basa (may paliwanag sa test).
- **RUB CHECK CONTROL, ACC.CONTROL, ACC.RATE SELECT, EXCI./SYNC./LOADUP, LOAD SET, HEAT SOAK TIMER (TCA582 ~ TCA586):** hindi drawn ang loob. Ang sequence ay galing sa ATS program PAGE 17 ~ 27 at sa mga pangalan ng linya sa sheet. Nasa column na "from manual text".
  - Rub check: target 200 rpm, CV / ICV close sa 190 rpm, complete kapag < 100 rpm.
  - Acceleration: sa cold, 1800 rpm heat soak, saka ang dalawang tanong (1st stage > 170 C, shell expansion), saka 3600 rpm; sa warm / hot, diretso sa 3600 rpm. Ang 3600 rpm heat soak ay sinusundan ng heat soak off (cold).
  - Rate: 120 / 180 / 360 rpm/min ayon sa mode.
  - Excitation start, ASD start (52L o 52G), initial load, load up.
  - Initial load: 3 % o 5 % ayon sa SG sa sheet; load up 20 %.
  - Timers: ilang minuto mula sa FG ng sheet.
- May derivation sa code ang bawat basa (tce-run.js, tabi ng bawat macro).

## Sinubok
- tests/tce/sheets.cjs: pasado. Bawat bagong macro ay may behavior test, kasama ang LOAD SET sa totoong TCA583A (WARM 4.5 / 30 MW, HOT 7.5 MW).
- Pasado rin ang tests/tce/run.cjs, tests/lanes/qa/tce-complete.cjs at tests/lanes/integrator/tce-loop-mark.cjs.

## Hindi nasubok
- Ang buong ATS chain (step 0 → 7) sa engine. Kailangan pa ang criteria ports at ang swap ni YUA.

## (c) Hindi mabasa sa docs (kailangan ng PDF search ni EIMI)
- HEAT SOAK SELECT, TCE163 (LME133): in SPEED, SET, RESET, IP.ST, HP.ST, TB.T, 52G.C, 200RPM, ALL.VC; out SELECT, CONT, CRT.P, H.S.R.
- HEAT SOAK CONTROL, TCE207 (LME242 / 243): in DEMAND, OPEN1, OPEN2, CV HLD, CONT, HOLD, RESET, S.SEL1, S.SEL2, S.TARG; out BIAS.C, CV, ICV, RESET.
- THERMAL STRESS, TCA754 / TCA758 (LMA628): in T1-T5, SG1-SG5, TS; out SURF, BORE, TB.
- MODE x5, TCA768A (LMA810): in L, T; out M.
- UNT-FG: TCA762 / TCA763 011 (FG-1 LCFI, LMA010) at TCE212 003 / 036 (CV demand). Walang curve points sa sheet.
- Bahagi ng mga bagong macro na wala sa ATS program, at hindi binasa:
  - RUB CHECK: in UPPER (CRI 1.23), in ACC. (120RPM/M SELECTED), at out UPPER (walang tinutungo).
  - ACC.CONTROL: 2700 rpm path (TARGET2 / HEAT2 = 0, dahil walang 2700 rpm hold sa program) at out SPEED (line > 2950 rpm, papuntang (-)).
  - ACC.RATE SELECT: out RESET (papuntang (-)).
  - START-UP MODE: out VERYHOT (papuntang (-)).
