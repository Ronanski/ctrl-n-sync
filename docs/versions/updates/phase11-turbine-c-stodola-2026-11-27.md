# Phase 11 turbine C: ang turbine sa physics, wala nang per-load table (RIN, 2026-11-27)

- Binago (sa kasalukuyang turbine ng plant model, `turbine.js` at ang turbine / reheat na bahagi ng `unit.js`):
  - Tinanggal ang AN_TBW (trabaho bawat T/H sa 7 load ng heat balance, pinagdudugtong) at ang temperature factor anTbT, at ang stage pressure rows ng AN_HB (x6, x5, xd, x3, x2, x1).
  - Pumalit: ang steam path `tbPath`: bawat grupo ng stage ng HP, IP at LP ay may flow area K (Stodola: ang daloy ay ayon sa pressure bago at pagkatapos) at efficiency, parehong kinuha MINSAN sa design: heat balance PPE-14-0725 R1 case 1 (100 %) at VWO (para sa HP, bukas na bukas ang valves). Ang expansion ay sa IF97 steam table. Ang pressure ng bawat extraction, ang cold reheat temperature, ang enthalpy ng LP exhaust at ang MW ay lumalabas dito.
  - Ang daloy sa IP turbine ay ang kaya ng IP blades sa reheater pressure (Stodola), hindi na ang buong main steam (m0 x rr). Ang pumapasok sa reheater ay ang HP exhaust bawas ang gland leak at ang No.6 extraction.
  - Ang vacuum at ang heater na naka-off ay nasa expansion na mismo (exhaust pressure, extraction na naiwan sa turbine), kaya hindi na idinadagdag ang anVacMW at U.dMWx sa MW (iisang daan).
- Source: Hitachi / MHPS PPE-14-0725 R1 (basa ni YUA 2026-11-27, `/mnt/project-files/turbine-hb-read-2026-11-27.md`), IAPWS-IF97, Stodola cone law.
- Sinubok:
  - `tests/lanes/model/turbine-hb.cjs`: lahat ng 8 case ng heat balance (100, 85, 70, 60, 50, 40, 30 %, VWO), ang 6 na hindi ginamit sa design ang tunay na test: HRH pressure 0.0 ~ 0.5 %, No.5 / deaerator / No.3 0 ~ 1.4 %, No.2 LP hanggang 2.8 % at No.1 LP hanggang 6.2 % sa 30 %, CRH temperature hanggang 1.0 C, LP exhaust hanggang 3.3 kcal/kg, MW hanggang 0.9 MW.
  - 150 MW headless, 8 plant min: 150.8 MW sa 458.7 T/H main steam (HB 458.3), hot reheat 33.66 kg/cm2 g = 34.69 ata (HB 34.77), cold reheat 38.57 ata (HB 38.64), No.5 14.91 (HB 14.87), No.1 LP 0.375 (HB 0.373). Bilis ng takbo: pareho sa `main` (149 s laban sa 145 s para sa 8 plant min).
- Hindi pa sinubok: load sweep 45 ~ 150 MW sa buong planta, trip at start-up.
- Natitira (pansamantala, may may-ari): ang draw ng LP heaters ay galing pa sa AN_HB f rows ni MEI, at ang deaerator draw ay sumusunod sa No.1 HP heater, hanggang isulat nina MEI / NANA ang ports `ext.w_lp` / `ext.w_hp` (napagkasunduan 11:25 AM). Ang losses ng generator (lo + kq x shaft^2) ay para kay YUI.
- Susunod: cold reheat temperature at extraction temperature mula sa steam path, bypass, gland, metal temperature, ports.
