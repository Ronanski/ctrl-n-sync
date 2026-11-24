# ACCEPTANCE — Finish Line ng LMYP OTS

Inaprubahan ng user: **GO LIST, 2026-11-24 06:06 PHT** (GO FINISH LINE 2026-11-24 00:37 PHT). Ito ang IISANG depinisyon ng "tapos". Ang wala rito ay hindi hinahabol; ang user lang ang nagdadagdag o nagbabawas ng item. Page na inaprubahan: https://claude.ai/artifact/WpPERCH8eojG4XHgjeeSCb (v3). Gawa ng AUDIT FIX : LISA; design values mula kay LEADER : JENNIE (design table, study file 15).
## Batas

1. Tapos ang app kapag pasado ang lahat ng item ng Part 1, 2 at 3.
2. Bawat target ay galing sa design document (HB = Hitachi heat balance PPE-14-0725 R1; FHI = CFB boiler manual P2S7 curves at Tab 3; L20 = Howden APH OMM; L21 = TCV-FW1150 valve sheet; vendor data, I/O list, P&ID, logic). Walang curve = kuwenta ng physics, nakasulat sa tabi ng value ("kinuwenta"). Ang snapshot at trend ng planta ay pang-check lang.
3. Iisang model para sa lahat ng load; walang constant na para lang sa isang load; walang patch.
4. Bawat merge na nagbabago ng estado ng isang item ay nag-a-update ng seksyon "Bilang" dito at ng tracker.
5. Logic ang masusunod sa setpoint, limit at FX (ABC sheets, parameter workbook); design (FHI / HB) ang masusunod sa physics. Kapag logic input ang dahilan ng agwat sa FHI, ang target ay kinukuwenta sa design physics gamit ang logic input, at nakasulat ang sheet at ang FHI value (user 2026-11-24 ~15:14 PHT, "Ok").

## Bilang (2026-11-24 15:18 PHT, beta.360; sukat ng beta.356, Batas 5)

- Part 1 (process): 24 na item × bawat load. Sukat ng beta.356 (tools/accept/part1.cjs, results/part1-beta356.md; 45 MW sa HB sliding pressure 98.9): 56 PASS / 30 FAIL na cell (dati 50 / 36; +6 dahil sa Batas 5: RH outlet 45, bed 45, limestone 90 at 150, total air 45, O2 45). Pasado sa lahat ng tatlong load: 7 (main steam flow, SH outlet temperature, RH outlet temperature, final feedwater, RH spray, turbine heat rate, coal flow). Natitira: 17. (Pagtatama sa bilang ng beta.354: 4 dapat iyon, hindi 3; pasado na rin noon ang main steam flow sa tatlong load.)
- Part 2 (kumpleto): 21 na item. Pasado (TAMA): 1. Natitira: 20 (KULANG: 17; hindi nasuri sa cloud: 3). Detalye: docs/audit/part2-check-2026-11-24.md.
- Part 3 (live run): 1 item. Natitira: 1 (ang user ang nagpapasya kung kailan).
- **Kabuuan: 8 pasado, 38 natitira.**

## Part 1 · Process bawat load

Steady na takbo, 30 min na walang ginagalaw, naka-AUTO ang lahat ng loop. 45 / 90 / 150 MW = HB cases 7 / 4 / 1 (32.7 / 59.6 / 100 %).

| Sukat | 45 MW | 90 MW | 150 MW | Tolerance | Design source | Estado |
|---|---|---|---|---|---|---|
| **Steam at tubig** | | | | | | |
| Main steam flow, T/H | 149.95 | 273.36 | 458.33 | ±3 % | HB PPE-14-0725 cases 7 / 4 / 1 (32.7 / 59.6 / 100 %) | hindi pa nasusukat |
| Main steam sa turbine: pressure ata · temperature °C | 98.9 · 505 (sliding) | 126.0 · 538 | 126 · 538 | ±1.5 · ±5 | HB PPE-14-0725 | hindi pa nasusukat |
| SH outlet pressure, kg/cm²g | 100.0 | 126.5 | 129 | ±1.5 | FHI Fig 11 (SH outlet pressure vs load), Tab 3 | hindi pa nasusukat |
| SH outlet temperature, °C | 507 | 541 | 541 | ±5 °C | FHI Fig 6; 45 MW: Fig 2 cold start table (9.2 h point) | hindi pa nasusukat |
| Cold reheat: flow T/H · ata · °C | 145.0 · 12.79 · 328.8 | 265.4 · 23.48 · 358.1 | 446.1 · 38.64 · 370.2 | ±3 % · ±1 · ±5 | HB PPE-14-0725 | hindi pa nasusukat |
| Hot reheat: flow T/H · ata · °C | 134.8 · 11.51 · 505 | 243.1 · 21.13 · 538 | 400.9 · 34.77 · 538 | ±3 % · ±1 · ±5 | HB PPE-14-0725 | hindi pa nasusukat |
| RH outlet temperature, °C | 488 (logic) | 541 | 541 | ±5 °C | FHI Fig 6, Tab 3 (RH in 370 °C / 36.6, out 541 °C / 35.1); 45 MW: logic SV ABC-020 S2-LN6 (MW vs RH outlet) = 488 sa 45 MW (FHI Fig 2 table 507) | hindi pa nasusukat |
| Economizer outlet water, °C | — kinuwenta (susunod) | — kinuwenta (susunod) | 303 | ±3 °C | FHI Tab 3 (245.4 pasok, 303 labas); part load: kukuwentahin mula sa HB feedwater at sa duty ng economizer | hindi pa nasusukat |
| Final feedwater: °C · T/H | 188.6 · 150.3 | 218.0 · 273.7 | 245.4 · 458.7 | ±3 °C · ±3 % | HB PPE-14-0725, FHI Tab 3 | hindi pa nasusukat |
| SH spray, T/H | 0 | 0 | 12.4 (2.70 %) | ±3 T/H | FHI Fig 10 (60 ~ 100 % lang; 0 sa 60 %) | hindi pa nasusukat |
| RH spray, T/H | 0 | 0 | 0 | ≈ 0 | kinuwenta: HB HRH = CRH bawas ang No.6 HP heater extraction, eksakto, kaya walang spray sa design; RHT hawak ng bias dampers (ABC-019); TCV-FW1150 trim lang, max 21 T/H (L21) | hindi pa nasusukat |
| Generator output, MW | 45 | 90 | 150 | ±1 MW | HB PPE-14-0725 | hindi pa nasusukat |
| Turbine heat rate, kcal/kWh | 2331 (36.88 %) | 2079 (41.35 %) | 1989 (43.23 %) | ±1 % | HB PPE-14-0725 | hindi pa nasusukat |
| **Gas, bed at hangin** | | | | | | |
| Bed temperature, °C | 745 ±25 (kinuwenta, logic air) | 850 ~ 870 | 850 ~ 870 | sa band | SU:10198; normal 850 ~ 900, hanggang 950 sa mahabang takbo, lampas 900 tawag sa FHI (P2S4 p2-4-8); 45 MW kinuwenta: energy balance ng bed sa logic air 446 T/H (team-files/plant-study/16-part-load-bed-2026-11-24.md, D14), sa FHI air 365 nasa band | hindi pa nasusukat |
| Furnace average temperature, °C | 610 | 755 | 840 | ±15 °C | FHI Fig 8 (average, hindi exit); 45 MW: Fig 2 table (halos pantay ang riser ng CFB) | hindi pa nasusukat |
| Bed inventory (furnace DP), mmH2O | 1380 (low 1150) | 1380 (low 1150) | 1630 (low 1450) | low ~ 2100, basa ±20 | FHI Fig 9: 1380 sa 40 ~ 60 %, 1440 sa 70, 1550 sa 85, 1630 sa 100; high limit 2100 | hindi pa nasusukat |
| Economizer outlet gas = air heater gas in, °C | 265 | 285 | 322 | ±10 °C | L20 Howden APH duties 322 / 285 / 272 sa 100 / 60 / 40 %; 45 MW kinuwenta: L20 line pinahaba | hindi pa nasusukat |
| Air heater gas out, °C | — | — | 135 (128.4 corrected) | ±10 °C | FHI Tab 3, L20 | hindi pa nasusukat |
| Coal flow, T/H | 32.3 | 56.0 | 89.5 | ±3 % | FHI Fig 13; 45 MW kinuwenta: slope ng Fig 13 pinahaba | hindi pa nasusukat |
| Limestone flow, T/H | 4.3 | 4.9 (logic cap) | 4.9 (logic cap) | ±10 % | FHI Fig 13 (7.1 / 12.0); 90 / 150 MW: logic cap AICFG10571 MH 35 % × 14 T/H = 4.9 (ABC-005, DITL-LS240); 45 MW kinuwenta: pareho ang Ca/S, SO2 control pa ang susukatin | hindi pa nasusukat |
| Total air · PA · SA, T/H | 446 (logic) · 245 · 96 | 371 · 236 · 111 | 596 · 354 · 218 | ±3 % | FHI Fig 12; 45 MW total air: logic minimum ABC-002 S1-LN5 floor 446 T/H (FHI Fig 12 365); PA / SA kinuwenta: hawak sa 40 % value (PA 245 = minimum fluidization) | hindi pa nasusukat |
| O2, % | 12.7 (kinuwenta, logic air) | 3.6 | 3.6 | ±0.5 | FHI Fig 7; 45 MW kinuwenta: stoichiometric 5.43 kg air / kg coal (Tab 2) sa hangin ng 40 %; parehong paraan sa 40 % = 9.0 laban sa Fig 7 8.8; 45 MW sa logic air 446: coal 32.3 × 5.43 = 175.4 T/H stoich, EA 2.543, O2 ≈ 20.95 × 1.543 / 2.543 = 12.7 (sa FHI air 365: 10.9) | hindi pa nasusukat |
| Boiler efficiency (LHV), % | 88.5 | 91 | 90.9 | ±1 | FHI Tab 3 sa 150 MW; 45 / 90 MW kinuwenta: parehong losses, iba ang excess air at exit gas | hindi pa nasusukat |
| **Steady (lahat ng load)** | | | | | | |
| Galaw sa 8 oras na walang ginagalaw | MW ±2 · MSP ±2 · drum level ±60 mm · MST ±6 °C · bed sa 850 ~ 870 °C | | | sa loob ng band | ISA-77.20; bands ng behaviour gate; bed SU:10198 | hindi pa nasusukat |

Cold start-up (FHI Fig 1, 2): pagtaas ≤ 110 °C/h (pababa 83 °C/h); turbine roll ~6.0 h, sync ~7.0 h, full load ~12.5 h mula light-off. Cold shutdown: Fig 5. Turbine roll, soak at sync: TCE / TCA ATS criteria (heat soak Fig 1 / 2, hold timer Fig 3). Warm (8 ~ 56 h) at Hot (< 8 h): FHI Fig 3 / 4 (furnace 360 / 700 °C, SH 40 / 100 kg/cm² sa restart).

## Part 2 · Kumpleto ang planta

TAMA = nasa app at may patunay; MAY = nasa app, hindi pa nasusuri ang galaw; KULANG = wala pa.

| Grupo | Source | Estado (2026-11-24) | Pasado kapag |
|---|---|---|---|
| **Boiler** | | | |
| Furnace, bed, cyclone, backpass, sootblowers | P&ID K1AU3-A1-0-001, FHI P2 ~ P5, DITL-80x | KULANG (Part 2 check 11-24: bed heat-up 747 °C/h vs 110; 80 tag walang kabit) | Part 1 pasado at bawat page tugma sa P&ID |
| Drum, SH, RH, sprays, drains, vents | P&ID, FHI P4, ABC-010 ~ 013 | KULANG (MST tumataas pagka-trip; 12 tag walang kabit) | Part 1 pasado; bawat valve gumagalaw ayon sa logic |
| Coal, limestone, sand, bottom ash, fly ash | P&ID, PLC logic zips, DITL | KULANG (ash cooler outlet; 49 tag walang kabit) | Bawat feeder, cooler, conveyor sumusunod sa PLC / DITL sheet |
| Fans, air, flue gas, air heater, ESP | Fan curves (Cheng Chen), FHI P5 | KULANG (ESP walang signal; fan motor temp) | Fan flow at current sa fan curve; ESP sa I/O list |
| Diesel oil, burners, purge, MFT | M&S BMS 1612 13-4-105, DITL-02 / 03 / 07 | KULANG (58 burner / purge signal walang kabit) | Bawat MFT input ng DITL-03A nagti-trip; purge 300 s |
| **Tubig at steam cycle** | | | |
| Feedwater, BFWPs, HP heaters | P&ID, heat balance, pump data | KULANG (HP heater No.2 drain; 42 tag) | Part 1 FW temperature; pump curve |
| Condensate, LP heaters, deaerator, hotwell | P&ID, K2MC3A-100, heat balance | KULANG (J6 hotwell; CEP auto; 23 tag) | Level stable sa load change |
| Extraction, aux steam, gland, vacuum | Heat balance, P&ID | KULANG (extraction ±3 % hindi pa sukat) | Extraction pressures sa heat balance ±3 % |
| Sea water, make-up, closed cooling, air compressors, sampling | P&ID, vendor data | KULANG (lahat ng SWP patay sa 150 MW: walang turbine trip; 102 tag) | Bawat pump at valve sa page, may value |
| **Turbine at generator (TCS)** | | | |
| TCS logic: speed, load, ATS, thermal stress | TCE / TCA sheets (499) | KULANG tumatakbo pa ang tcs.js, hindi ang sheets (Audit 3 #4) | Ang TCE / TCA sheets mismo ang tumatakbong logic |
| Turbine trips | IBD trip sheets | KULANG (low vacuum trip hindi kumilos; 19 tag) | Bawat trip ng IBD nagti-trip sa tamang kondisyon |
| Turbine oil, generator, excitation, electrical | MHPS / Hitachi manuals, GAE-2013-0136, UNITROL 6080, ETAP | KULANG (AVR gains walang source; 29 tag) | Sync at load sa data sheet; NO-SOURCE = 0 |
| **Control system** | | | |
| Control loops (PID / MAN / SUMA) | Parameter list, 65 na loop | KULANG (MAN station hold ramp; MOV travel) | Bawat loop: A / M / R, SV, MV, tracking at force manual ayon sa ABC sheet |
| ABC at DITL sheets | 54 ABC, 134 DITL na drawing | TAMA live, 1:1 sa PDF | Walang sheet na hindi tumatakbo |
| I/O tags na nakakabit | DCS I/O list 2,702 tag | KULANG hanggang 476 walang kabit (bilang 11-24, kumpirmahin sa takbo) | 0 tag na walang kabit (sheet, model o page) |
| Equipment | Equipment list K1AU3-L1-0-002, 173 | HINDI NASURI SA CLOUD (equipment list nasa PC lang) | Lahat ng 173 nasa app |
| Alarms at priority | Alarm list 20160912, 717 | KULANG 116 tag wala pa; 0 nakatayong alarm sa 150 MW | Lahat ng 717 nasa app, may priority; 0 nakatayong alarm sa steady 150 MW |
| Values na walang design source | docs/audit/no-source-list.md, snapshot-values-list.md | KULANG 217 NO-SOURCE, 24 mula sa snapshot | 0 at 0 |
| **Operator** | | | |
| HMI pages at faceplates | 22 plant pages + turbine / generator | HINDI NASURI SA CLOUD (kailangan ng totoong click) | Bawat page aprubado mo; bawat item sumasagot sa click |
| Starting points | Cold, Warm, Hot, 150 MW (Q3) | KULANG Warm / Hot wala sa start screen | Apat na simula sa start screen, gawa ng physics |
| Bilis | Q6: 60 FPS pataas | HINDI NASURI SA CLOUD | ≥ 60 FPS sa PC at tablet sa bawat page |

## Part 3 · Huling patunay: isang live run

Sa tunay na app, totoong pindot na napapanood ng user, screenshot bago at pagkatapos ng bawat hakbang, hinuhusgahan ng physics at ng Part 1. Ang user ang nagsasabi kung kailan.

1. Cold start: utilities, fans, purge, light-off; heat-up ≤ 110 °C/h (FHI Fig 1).
2. Coal sa bed; pressure at temperature para sa roll.
3. Turbine roll, rub check, soak, 3600 rpm (ATS criteria).
4. Sync at initial load (FHI Fig 2: roll ~6.0 h, sync ~7.0 h).
5. Load up 45, 90, 150 MW; 30 min hold at basa ng Part 1 sa bawat isa.
6. Load down 150 hanggang 45 MW.

Pasado kapag: walang trip o MFT na hindi sinadya, bawat aksyon ay pindot sa HMI, pasado ang Part 1 sa bawat hold.
