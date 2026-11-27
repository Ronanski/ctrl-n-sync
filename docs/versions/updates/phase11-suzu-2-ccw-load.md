# Phase 11 part 7+8 (SUZU), slice 2: closed cooling water heat = sum of its coolers, CCWHE and lube oil cooler at their design (2026-11-27)

Binago (Rule 0: tinanggal ang 2 lumang fit, baseline 44 -> 42):
- Init na dinadala ng closed cooling water: dati 3,480 kW x (0.4 + 0.6 x MW / 150), fit sa snapshot 27.PNG. Ngayon = suma ng bawat cooler ng mass balance K1AU3-MB-021 (A2-0-001 RA p 13, basa ni YUA), bawat isa sa sariling sanhi: BFP set 414 kW bawat tumatakbong BFWP; ID fan oil + bearing 617 kW at GAH 3 kW habang tumatakbo ang IDF; SA fan 21, PA fan 7 kW; air compressor = shaft power ng bawat tumatakbong compressor; air dryer 42 (IA) / 126 (PA) kW bawat isa; sampling rack 319 kW x (sample saturation - supply) / (Tsat 145 kg/cm2 - 34); lube oil cooler = ang tinatanggal ng lube oil model; bottom ash screw coolers = ang tinatanggal ng ash cooler model; generator air coolers = generator losses ni YUI (U.genQ, PR 665).
- CCWHE: UA = design point ng Hisaka D1-0-041 (13,830 kW sa LMTD 5.72 K = 2,418 kW/K); dati 7.2 % nito (fit sa 27.PNG). Walang fouling factor sa sheet. Inilabas sa AN_ACW dahil dinadala ng save ang AN_ACW (ibabalik sana ng 150 MW start ang lumang 174.8).
- Sea water ng CCWHE: 30 C (MB-020, dati 28.5 C ng snapshot).
- Lube oil cooler: bearing heat 1,300 kW at oil flow 76.5 kW/K (vendor O&M L2 TG 2-3: 1,300 kW, oil 63 -> 46 C); dati 1,032 kW / 64.5 kW/K fit sa 36.PNG.

Sinubok (headless, 150 MW, 20 plant min):
- Behaviour gate ALL PASS (MW 151.93 -> 150.93, MSP 122.36 -> 122.23, MST 539.70 -> 537.96).
- Closed cooling sa 150 MW (bago dumating ang generator share): load 3.4 MW, supply 30.4 C, return 32.3 C; lube oil out 45.8 C (TICLO1002 hawak), oil in 62.3 C.

Pansin: ang snapshot 27.PNG (supply 38 / return 40 C) ay mas mainit kaysa design; pang-check lang ito. Kapag pumasok ang generator losses (2.85 MW sa 150 MW), aakyat ang supply ng mga 1 C.
Hindi sinubok: buong Cold run; trip ng SWBP (chain: walang sea water -> mainit ang supply).
Susunod: sea water outlet ng condenser mula sa duty ni MEI; diesel oil (MB-022, valve sheets); fly ash blow tank cycle (L5-1).
