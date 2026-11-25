# SCOPE: saklaw ng LMYP OTS at ng mga dokumento (Phase 1)

Ito ang iisang file ng Phase 1 (saklaw at docs). Pinagsama rito ang dating `docs/DOCUMENT_INDEX.md` at `docs/HARDWARE_DOC_INVENTORY.md` (Appendix A at B, buo ang laman). Ang `document-references/INDEX.md` ay nananatiling listahan ng mga file sa PC folder at tumuturo rito. Ang `docs/audit/source-register-2026-11-25.md` ay worklist ng mga lane, hindi saklaw: nananatili ito.

Ginawa 2026-11-25 ~7:30 PM PHT (user "Go 1"). Bantay sa Checks: `tests/lanes/qa/scope-doc.cjs` (bagsak kapag may kulang na seksyon, o kapag may page o alarm group ang app na wala rito).

**Babala:** public ang repo. Pangalan, numero at path lang ng dokumento ang nakasulat dito, walang kopya ng laman. Walang plant IP address at walang value mula sa HIACS backup.

## 1. Mga patakaran ng saklaw

1. Isang planta: LMYP #1, 460 T/H CFB boiler, 150 MW (Unit 1, code K1AU3). DCS = Formosa DCS (ABC at DITL) sa STN101 ~ STN105; TCS = Hitachi HIACS (turbine MHPS).
2. Physics = design documents (seksyon 2, "Physics"). Set point, limit at curve = logic ng planta (DCS / TCS sheets at parameter workbooks). Ang HMI snapshot at trend ng planta ay pang-check lang, hindi target (user 2026-11-24).
3. Kapag walang dokumento: kinukuwenta mula sa physics (mass / energy balance) at isinusulat ang derivation sa tabi ng value. Hindi pinapayagan ang "NO-SOURCE" na walang hanap sa lahat ng docs.
4. Ang Phase 2 (Unit 3 at 4, code K3AU2) ay kakambal ng Unit 1 (user 2026-11-14): source para sa sukat at equipment data lang. Tag, address at sheet number ay laging galing sa K1AU3 at sa DCS ng LMYP #1.
5. Hindi kailanman naka-commit ang plant documents. Nasa PC ng user (`document-references/`, SMGP OneDrive, `D:\LPDSI Documents\`) at sa private repo na Ronanski/icms-plant-documents.

## 2. Mga dokumento at aling revision ang masusunod

| Paksa | Dokumento | Aling revision ang masusunod | Gamit sa app |
|---|---|---|---|
| **Logic ng DCS** | | | |
| Analog logic | ABC sheets (`analog-logic-abc-pdf.zip`, DWG `analog-logic-abc.zip`), 54 sheet | As-built set sa repo; `ABC-FLAME.dwg` walang PDF (hindi mabasa) | ABC sheets na tumatakbo |
| Digital logic | DITL sheets (`digital-logic-ditl.zip`), 134 drawing; subsystem PLC: `sand-sootblower-logic.zip`, `bottomash-limestone-logic.zip` | As-built set sa repo | DITL sheets na tumatakbo |
| Kahulugan ng block | `analog logic symbols legend.pdf`, `digital logic symbols legend.pdf`, `dcs-training-textbook.pdf` | Isa lang ang bersyon | Block library ng ABC / DITL |
| **Logic ng TCS** | | | |
| Soft logic | TCE / TCA SOFT LOGIC DIAGRAM OF TCS (Aug 2017, PC lang) | **TCE / TCA Aug 2017 ang masusunod** kapag nagsasapawan sa IBD; Feb 2017 TCA / TCE ay HINDI ginagamit | Speed, load, ATS, thermal stress: TCE / TCA lang |
| Trip logic | IBD SC90794-R2-S99 (Jul 2016) | IBD para sa trip logic; itala ang pagkakaiba sa TCE / TCA | Turbine trips |
| Macro na hindi drawn | HIACS macro list TC-14-116 | Mula sa text ng manual, may marka (user "Go" 2026-11-25 7:19 AM) | TCS macros |
| HIACS backup (PC team-files/tcs-decoded) | Backup TCE 2018-07-14, TCA 2017-02-23 | **Value HINDI ginagamit** ("Gamitin TCE"); pang-compare ng wiring lang; huwag i-commit habang public ang repo | Wala sa app |
| ATS | 310SC90-775 (sequence), 310SC90-776 (criteria; FIG. 2 ~ 5 mula sa criteria list 310SC90-796 Rev 2) | Pinakabagong Rev | ATS curves |
| TCS I/O | LM-310SC90-793 R2 Input / Output List, `iolist-tcs.zip` | R2 | `src/data/tcs-io.json` |
| Hindi gagamitin | `Trip interlock test 2X650MW.pdf` (ibang planta); mga file na "ML-" (Malita project, check lang); `Generator Logic.pdf` = kapareho ng `Generator Protection.pdf` | — | — |
| **Listahan at parameter** | | | |
| DCS I/O | `dcs-io-list.xls`, K1AU3-E2-0-118 DCS Input Output List | As-built 2017 | Tags at address |
| Memory | `memory-list-101.xls` ~ `105.xls` | Isa lang | M. / B. address |
| Loop at user tag | `STN101~105_LOOP,USERTAG.xls` (LPDSI) | "(new)" folder | Library > All signals |
| Controller parameters | `summary-of-pid-pidv-suma-man-parameters.xlsx` | Isa lang | PID / MAN / SUMA |
| Curves | `linear-curves-fx.xls`, `flow-compensation.xls`, `drum-level-calculation.xls` | Isa lang | F(X) |
| Alarm list | `alarm-list.zip` (20151224, 20160201, 20160912) | **Pinakabago: 20160912**; alarm limit = alarm list LANG | Alarms at priority |
| Instrument list | `over-all-instrument-list.xlsx` | Isa lang | Ranges |
| Wiring | `LMYP-1(#1) WIRING.xls` | **Original 2023-10-03**; ang "Copy of ..." (2022-08-23) ay luma | I/O channels |
| Modbus | Subsystem PLC IO lists (LPDSI `LMYP-1 #1-DOCUMENT\Subsystem PLC\`) | Isa lang | Modbus rows (walang IP address sa repo) |
| Equipment list | K1AU3-L1-0-002 | **R0 (2016-08-17)**; ang RA (2014-03) ay luma; tingnan ang seksyon 4 | Seksyon 4 |
| **Planta at proseso (physics)** | | | |
| P&ID | `flow-diagram-K1AU3-A1-0-001.zip` | **RB kung mayroon, kung wala RA**; AS BUILT kung mayroon (SMGP PHASE 1 `A1 FLOW DIAGRAM`) | Flow, lokasyon, HMI pages |
| Mass balance | K1AU3-A2-0-001 RA | RA (walang enthalpy) | Check ng flows |
| Boiler design | FHI CFB boiler manual (`boiler-cfb-design-operation-manual.zip`): P2S7 design data, Tab 3, curves Fig 1 ~ 13 | Isa lang | Physics target ng boiler |
| Turbine heat balance | Hitachi PPE-14-0725 R1 (heat balance), PPE-14-0728 R1 (bypass) | R1 | Physics target ng turbine |
| Fans | `fan-instruction-manual-SAF-PAF-IDF.pdf` (Cheng Chen) | Isa lang | Fan curves |
| Vendor data | O&M L1 ~ L37 (SMGP E-LIBRARY, mas buo kaysa sa repo), FHI D1 engineering data, BFP / CEP curves, Howden APH L20, valve TCV-FW1150 L21 | Pinaka-buong kopya | Component data |
| Generator | GAE-2013-0136, UNITROL 6080, GSE-2013-0109 | Isa lang | Generator, excitation |
| Procedures | PR-OPE-5002-02 (start-up), 5003-01 (shutdown), 5004-01 (bottle up) | Pinakabago | Gabay lang ng operator; hindi nagpapatakbo ng app |
| HMI snapshot | `hmi-snapshot-sample.zip` (35 larawan) | — | Pang-check lang |
| Wala kahit saan | Historian / trend data; sectional drawing ng turbine casing | — | — |

Buong lokasyon ng bawat file: Appendix A (planta) at Appendix B (hardware). Listahan ng file sa repo folder: `document-references/INDEX.md`.

## 3. Mga sistema: pasok at labas

Pasok = nasa app (logic, signal, HMI at physics). Ang "walang hanggang supply" ay nasa app bilang source na laging may laman; hindi minomodelo ang planta na gumagawa nito.

| Sistema | Saklaw | Page at alarm group sa app |
|---|---|---|
| Boiler: furnace, bed, cyclones, seal pots, drum, SH, RH | PASOK | `overview` `boiler-steam` `reheat` `furnace-gas` `wall-dampers` `ash-recycle` · alarms `drum` `main-steam` `reheat` |
| Combustion air: PA / SA fans, fluidizing air blowers, air heater | PASOK | `combustion-air` · alarms `air` |
| Flue gas: ID fan, ESP, stack | PASOK | `furnace-gas` · alarms `flue-gas` |
| Start-up burners, diesel oil, purge, MFT | PASOK | `oil-burners` `purge-trip` · alarms `diesel-oil` |
| Coal bunkers at feeders | PASOK (coal = walang hanggang supply) | `coal` · alarms `coal` |
| Coal handling (yard, conveyors papuntang bunker) | **LABAS** (user 2026-11-25) | — |
| Limestone at sand | PASOK; supply = walang hanggan | `limestone-sand` · alarms `limestone` `sand` |
| Bottom ash at fly ash | PASOK | `ash` · alarms `bottom-ash` |
| Sootblowers | PASOK | `sootblowers` · alarms `sootblow` |
| Feedwater, BFWPs, deaerator, HP heaters | PASOK | `feedwater` `heater-drains` · alarms `feedwater` `heater-drain` |
| Condensate, LP heaters, condenser, vacuum, polisher | PASOK | `condensate` · alarms `condensate` |
| Extraction, aux steam, gland | PASOK | `extraction` `aux-steam` · alarms `extraction` |
| Sea water, condenser tube cleaning | PASOK | `sea-water` · alarms `sea-water` |
| Closed cooling water, make-up water | PASOK; demin water = walang hanggang supply | `makeup-cooling` · alarms `cooling-water` `makeup` |
| Industrial water | PASOK | `industrial-water` · alarms `industrial-water` |
| Chemical dosing at sampling | PASOK | `sampling` · alarms `chemical` `sampling` |
| Compressed air (plant at instrument air) | **LABAS ang compressors at dryers**; ang hangin = walang hanggang supply, page = tingin lang sa supply | `compressed-air` · alarms `air-supply` |
| Water treatment plant (WTP, demin plant, potable) | **LABAS** (user 2026-11-25) | — |
| Turbine at TCS (speed, load, ATS, thermal stress, valves, trips) | PASOK (TCS = priority) | `turbine` `turbine-operation` `turbine-valves` `turbine-states` `turbine-readings` `turbine-motors` `turbine-interface` · alarms `lube-oil` |
| Turbine oil | PASOK | `turbine-oil` · alarms `lube-oil` |
| Generator, excitation, breaker | PASOK | `generator` |
| DCS system (stations, diagnostics, annunciator) | PASOK | `control-system` |
| Fire fighting, cranes, elevator, pits, silencers | LABAS (mechanical / civil, walang DCS signal) | — |

## 4. Equipment list (K1AU3-L1-0-002), sinuri

**Paano sinuri (2026-11-25, 7:39 ~ 7:47 PM PHT, sa PC):** binasa ng mata ang lahat ng 35 pahina ng **R0 (2016-08-17, "Issue for Final", scan), ang masusunod**, at ikinumpara sa 37 pahina ng RA (2014-03-21, ang mga pahina ay may tatak na "Rev.B"). Pinalaki ang mga malabong tag. Ang mga file ay nasa PC lang.

**Bilang:** **553 equipment tag** sa R0: PASOK 349, LABAS 204 (150 WTP, 35 air compressor / dryer, 19 mechanical / civil). Ang RA ay **183** tag (hindi 182: naiwan ang H-1107C). Hindi tulad ng RA, **kasama sa R0 ang turbine, generator, langis ng turbine, mga safety / control valve, strainer at orifice.**

**R0 laban sa RA:** 151 tag ang nasa dalawa; 375 ang bagong tag; 27 tag ng R0 ang kapalit ng ibang tag sa RA (4.1); 7 tag ng RA ang wala na sa R0 (4.2).

**Walang tag sa R0 (28 item):** economizer #1 ~ #3, SH panel #1 / #2, finishing SH (3), evaporator panel, RH panel (4), 1st / 2nd stage desuperheater, flash chamber, BFWP lube oil MOP / AOP / cooler / filter, oil skimmer, diaphragm pump, storage tank ng oil separator, agitator, eye washer, splitters (3). Ang SH / RH / economizer ay PASOK (`boiler-steam`, `reheat`). Seksyon 58 (boiler hoist) at 62 (coal conveying, LABAS) ay pamagat lang.

**Saan ito ginagamit:** ang "Page sa app" ay sistema ng page. Ang bilang kung may sariling simbolo ang bawat equipment sa page ay trabaho ng **Phase 9**, hindi ng Phase 1.

### 4.1 Nag-iba ang tag

| RA | R0 | Equipment | Susundin |
|---|---|---|---|
| P-1111A/B/C | P-1503A/B/C | Seawater booster pump | R0 (P-1503 ang nasa DCS at app) |
| S-1112 | S-1504 | Debris filter bago ang CCW heat exchanger | R0 (S-1504 ang nasa app) |
| L-1121A/B | L-1111, L-1112 | Ball separator | R0 |
| P-1122A/B | P-1113, P-1114 | Ball circulating pump | R0 |
| T-1123A/B | T-1115, T-1116 | Ball vessel | R0 |
| T-1008A/B/C | T-1108A/B/C | Coal bunker | App = T-1008 (DCS alarm list 20160912) |
| T-0714A/B | T-0714 | Industrial water tank (2 naging 1) | R0 |
| P-1127A/B | P-1127 | Submerge pump, transformer area | R0 (LABAS) |
| Z-0710A/B/C | S-0710A/B/C | Suction filter ng plant air compressor | R0 (LABAS) |
| Z-0712A/B/C | S-0712A/B/C | Suction filter ng instrument air compressor | R0 (LABAS) |
| Z-1119 | Z-1119A/B/C/D | Steam jet air ejector (1st + 2nd stage) | R0 |
| Z-1053 (silencer) | S-1053; Z-1053 = PAF lube oil cooler na | PAF suction silencer | R0 |
| Z-1054 (silencer) | S-1054 (nakasulat S-1504) | SAF suction silencer | Tingnan ang mga mali sa R0 |
| T-1128 | T-1128 / T-2128 | Turning gear IA buffer tank, may Unit 2 na | R0 |
| Z-1057 / 2057 | Z-1057 lang | Stack (isa para sa dalawang unit) | R0 |

Parehong tag, linaw ng pangalan: Z-1056 = hydraulic coupling ng ID fan (hindi silencer; ganito rin sa RA scan); H-1001 = FURNACE (dating BOILER); L-1060 = ASH COOLER (dating BOTTOM ASH SCREW CONVEYOR).

### 4.2 Inalis (nasa RA, wala sa R0)

| RA | Equipment | Estado |
|---|---|---|
| F-1119A/B | Steam ejector exhauster | Wala sa R0 |
| T-1125 | Drain separator | Wala sa R0; may banggit pa sa app, susuriin laban sa P&ID sa Phase 9 |
| Z-1124A/B/C/D | Tube cleaning V-piece | Wala sa R0 |

### 4.3 Bago sa R0 (375 tag)

| Sistema | Bilang | Tag (Unit 1) |
|---|---|---|
| Air (fans, blowers, air heater) | 4 | V-FA1001, V-FA1002, V-FA1003, V-FA1004 |
| Boiler feedwater pumps | 10 | M-1115, OR-FW1001, OR-FW1002, OR-FW1003, OR-FW1004, STR-FW1001, STR-FW1002, Z-1115 |
| Bottom ash | 12 | F-1091, L-1090, L-1091, L-1092, L-1903, L-1904, S-1090, S-1091, S-1092, T-1090, T-1091, T-1092 |
| Chemical dosing (sea water) | 6 | P-0761, P-0762, T-0761, T-0762 |
| Chemical dosing at sampling | 12 | Z-1101, Z-1102, Z-1103, Z-1105, Z-1106, Z-1107, Z-1108, Z-1109, Z-1140 |
| Coal bunkers | 27 | T-1066, T-1067, T-1068 |
| Coal feeders | 3 | T-1065 |
| Condensate and polisher | 11 | OR-CD1001, OR-CD1002, OR-MU1002, STR-CD1002, STR-CD1003, STR-CD1004, STR-CD1005, STR-CD1006, STR-CD1007, STR-CD1008, STR-CD1011 |
| Condenser and vacuum | 5 | T-1135, Z-1110, Z-1113, Z-1130 |
| Deaerator | 1 | ZV-TS1104 |
| Desuperheaters | 2 | DSH-CD1126, DSH-FW1150 |
| Diesel oil | 2 | STR-DO0001, STR-DO0002 |
| Feedwater | 6 | STR-FW1003, STR-FW1004, STR-FW1005, STR-FW1006, STR-FW1007, STR-FW1008 |
| Fire fighting | 1 | T-0724 |
| Flue gas (ID fan, ESP, stack) | 10 | T-1064, TCV-FG1116, TCV-FG1117 |
| Fly ash | 19 | F-1250, L-1250, S-1250, S-1251, S-1252, S-1253, S-1254, S-1255, S-1256, T-1250, T-1251 |
| Gland steam | 4 | F-1911, H-1911, M-1911, Z-1912 |
| Limestone at sand | 12 | F-1301, F-1313, L-1311, S-1300, S-1301, S-1311, S-1312, S-1313, T-1300, T-1301, T-1311, T-1312 |
| Main steam | 2 | OR-MS1001, OR-MS1002 |
| Make-up / industrial water | 10 | RO-IW0715, RO-MU0709, STR-IW0001, STR-IW0002, STR-MU0001, STR-MU0002, STR-MU0003 |
| Safety valves | 12 | ZV-AS1001, ZV-BR1001, ZV-BR1002, ZV-DO1001, ZV-FS1001, ZV-FW1001, ZV-FW1002, ZV-HR1001, ZV-HR1002, ZV-HR1003, ZV-MS1001, ZV-SB1001 |
| Turbine at generator | 16 | E-1907, G-1901, G-1970, H-1971, L-1906, M-1906, S-1960, Z-1094, Z-1095, Z-1903 |
| Turbine bypass at control valves | 8 | PCV-AS1010, PCV-HR1010, PCV-MS1020, TCV-CD1115, TCV-CD1124, TCV-CD1126, TCV-FW1060, TCV-FW1150 |
| Turbine oil | 33 | F-1937, H-1921, M-1922, M-1923, M-1931, M-1937, M-1941, OR-CW1001, P-1922, P-1923, P-1931, P-1941, S-1932, S-1933, S-1936, S-1942, S-1943, T-1395, T-1920, T-1934, T-1938, Z-1930, Z-1940 |
| Water treatment / potable | 147 | item 61.1 ~ 61.90 at 54A.17 ~ 54A.19 (LABAS) |

### 4.4 Mga mali sa sulat ng R0 at ang tag na ginamit sa listahan

| R0 | Problema | Nakalista bilang | Bakit |
|---|---|---|---|
| 52.1 L-1060C dalawang beses | Ang ikaapat ay dapat D | L-1060D | RA at DCS |
| 45.2 S-1504 | Pareho ng debris filter (19.2) | S-1054 | Hinuha mula sa fan F-1054 at sa S-1053 ng PAF |
| 34.4 Z-1104 | Pareho ng deaerator silencer (14.4) | Isang row, dalawang gamit | R0 |
| 34.2 Z-1102 / Z-2101 | Unit 2 | Z-1102/2102 | Kapareho ng ibang row |
| 44.3 Z-1053 / Z-2054 | Unit 2 | Z-1053/2053 | Kapareho ng ibang row |
| 61.18 F-0850 | Kulang ang B | F-0850B | Kapares ng F-0850A |
| 2.9 G1903 (H-1911) | Dalawang tag | H-1911 | R0, nasa panaklong |
| 2.4 Z-1094, 2.5 Z-1095, 2.19.6 T-1395 | Hindi ayon sa serye (Z-19xx, T-19xx) | Ayon sa R0 | Iiwan hangga't walang P&ID na nagsasabing iba |
| 12.2 STR-CD1011 | Kapares ay STR-CD1002 | Ayon sa R0 | Pareho |

### 4.5 Buong listahan (R0)

| # | Tag (Unit 1 / Unit 2) | Equipment | Sistema | Saklaw | Page sa app | R0 item |
|---|---|---|---|---|---|---|
| 1 | B-1043A/2043A | START-UP DIESEL OIL BURNER A | Start-up burners | PASOK | oil-burners | 25.1 |
| 2 | B-1043B/2043B | START-UP DIESEL OIL BURNER B | Start-up burners | PASOK | oil-burners | 25.1 |
| 3 | B-1043C/2043C | START-UP DIESEL OIL BURNER C | Start-up burners | PASOK | oil-burners | 25.1 |
| 4 | B-1043D/2043D | START-UP DIESEL OIL BURNER D | Start-up burners | PASOK | oil-burners | 25.1 |
| 5 | C-0703A | PLANT AIR COMPRESSOR & COOLER A | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 26.2 |
| 6 | C-0703B | PLANT AIR COMPRESSOR & COOLER B | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 26.2 |
| 7 | C-0703C | PLANT AIR COMPRESSOR & COOLER C | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 26.2 |
| 8 | C-0704A | INSTRUMENT AIR COMPRESSOR & COOLER A | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 27.2 |
| 9 | C-0704B | INSTRUMENT AIR COMPRESSOR & COOLER B | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 27.2 |
| 10 | C-0704C | INSTRUMENT AIR COMPRESSOR & COOLER C | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 27.2 |
| 11 | C-0707 | START-UP COMPRESSOR | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 28.1 |
| 12 | C-0850 | AIR COMPRESSOR UNIT | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.10 |
| 13 | D-0703A | PLANT AIR DRYER A | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 29.1 |
| 14 | D-0703B | PLANT AIR DRYER B | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 29.1 |
| 15 | D-0703C | PLANT AIR DRYER C | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 29.1 |
| 16 | D-0704A | INSTRUMENT AIR DRYER A | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 29.2 |
| 17 | D-0704B | INSTRUMENT AIR DRYER B | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 29.2 |
| 18 | D-0704C | INSTRUMENT AIR DRYER C | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 29.2 |
| 19 | DSH-CD1126/2126 | GLAND STEAM DESUPERHEATER | Desuperheaters | PASOK | reheat, extraction | 9A.2 |
| 20 | DSH-FW1150/2150 | REHEATER INLET DESUPERHEATER | Desuperheaters | PASOK | reheat, extraction | 9A.1 |
| 21 | E-1907/2907 | TURNING BOLT HEATER | Turbine at generator | LABAS: mechanical / civil, walang DCS signal | — | 2.8 |
| 22 | F-0850A | MMF BLOWER A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.18 |
| 23 | F-0850B | MMF BLOWER B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.18 |
| 24 | F-0851A | MIXING BLOWER A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.17 |
| 25 | F-0851B | MIXING BLOWER B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.17 |
| 26 | F-1053/2053 | PRIMARY AIR FAN | Air (fans, blowers, air heater) | PASOK | combustion-air | 44.1 |
| 27 | F-1054/2054 | SECONDARY AIR FAN | Air (fans, blowers, air heater) | PASOK | combustion-air | 45.1 |
| 28 | F-1055A/2055A | FLUIDIZING AIR BLOWER A | Air (fans, blowers, air heater) | PASOK | combustion-air | 46.1 |
| 29 | F-1055B/2055B | FLUIDIZING AIR BLOWER B | Air (fans, blowers, air heater) | PASOK | combustion-air | 46.1 |
| 30 | F-1056/2056 | I.D. FAN | Flue gas (ID fan, ESP, stack) | PASOK | furnace-gas | 43.1 |
| 31 | F-1091/2091 | DEDUST VENTING FAN | Bottom ash | PASOK | ash | 51.4 |
| 32 | F-1250/2250 | DEDUST VENTING FAN | Fly ash | PASOK | ash | 53.8 |
| 33 | F-1301/2301 | DEDUST VENTING FAN (SAND) | Limestone at sand | PASOK | limestone-sand | 50.3 |
| 34 | F-1313/2313 | DEDUST VENTING FAN (LIMESTONE) | Limestone at sand | PASOK | limestone-sand | 49.4 |
| 35 | F-1911/2911 | GLAND STEAM EXHAUSTER | Gland steam | PASOK | turbine-readings, extraction | 2.10 |
| 36 | F-1937/2937 | VAPOUR EXTRACTOR (VX) | Turbine oil | PASOK | turbine-oil | 2.19.8 |
| 37 | G-1901/2901 | STEAM TURBINE | Turbine at generator | PASOK | turbine, turbine-valves, generator | 2.1 |
| 38 | G-1970/2970 | STEAM TURBINE GENERATOR | Turbine at generator | PASOK | turbine, turbine-valves, generator | 2.2 |
| 39 | H-0869 | HEATER | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.61 |
| 40 | H-1001/2001 | FURNACE | Boiler (furnace, drum, cyclones, seal pots) | PASOK | boiler-steam, furnace-gas | 1.1 |
| 41 | H-1052/2052 | AIR PREHEATER (ROTARY GAS AIR HEATER) | Air (fans, blowers, air heater) | PASOK | combustion-air | 38.1 |
| 42 | H-1101/2101 | #1 LOW PRESSURE HEATER | LP heaters | PASOK | condensate, heater-drains | 13.1 |
| 43 | H-1102/2102 | #2 LOW PRESSURE HEATER | LP heaters | PASOK | condensate, heater-drains | 13.2 |
| 44 | H-1103/2103 | #3 LOW PRESSURE HEATER | LP heaters | PASOK | condensate, heater-drains | 13.3 |
| 45 | H-1104/2104 | DEAERATOR | Deaerator | PASOK | feedwater | 14.1 |
| 46 | H-1105/2105 | #1 HIGH PRESSURE HEATER | HP heaters | PASOK | feedwater, heater-drains | 13.4 |
| 47 | H-1106/2106 | #2 HIGH PRESSURE HEATER | HP heaters | PASOK | feedwater, heater-drains | 13.5 |
| 48 | H-1107A/2107A | PLATE HEAT EXCHANGER (CLOSED CIRCUIT COOLING WATER) A | Closed cooling water | PASOK | makeup-cooling | 18.1 |
| 49 | H-1107B/2107B | PLATE HEAT EXCHANGER (CLOSED CIRCUIT COOLING WATER) B | Closed cooling water | PASOK | makeup-cooling | 18.1 |
| 50 | H-1107C/2107C | PLATE HEAT EXCHANGER (CLOSED CIRCUIT COOLING WATER) C | Closed cooling water | PASOK | makeup-cooling | 18.1 |
| 51 | H-1110/2110 | CONDENSER | Condenser and vacuum | PASOK | condensate | 11.1 |
| 52 | H-1119/2119 | STEAM JET AIR EJECTOR CONDENSER | Condenser and vacuum | PASOK | condensate | 3.2 |
| 53 | H-1911/2911 | GLAND STEAM CONDENSER (G-1903) | Gland steam | PASOK | turbine-readings, extraction | 2.9 |
| 54 | H-1921A/2921A | LUBE OIL COOLER A | Turbine oil | PASOK | turbine-oil | 2.14 |
| 55 | H-1921B/2921B | LUBE OIL COOLER B | Turbine oil | PASOK | turbine-oil | 2.14 |
| 56 | H-1971A/2971A | GENERATOR AIR COOLER A | Turbine at generator | PASOK | turbine, turbine-valves, generator | 2.22 |
| 57 | H-1971B/2971B | GENERATOR AIR COOLER B | Turbine at generator | PASOK | turbine, turbine-valves, generator | 2.22 |
| 58 | H-1971C/2971C | GENERATOR AIR COOLER C | Turbine at generator | PASOK | turbine, turbine-valves, generator | 2.22 |
| 59 | H-1971D/2971D | GENERATOR AIR COOLER D | Turbine at generator | PASOK | turbine, turbine-valves, generator | 2.22 |
| 60 | L-0062 | ELEVATOR (BOILER HOUSE) | Plant services (crane, elevator, pits) | LABAS: mechanical / civil, walang DCS signal | — | 56.1 |
| 61 | L-0063 | OIL WATER SEPARATOR | Plant services (crane, elevator, pits) | LABAS: mechanical / civil, walang DCS signal | — | 33.1 |
| 62 | L-0129 | TURBINE BUILDING OVERHEAD CRANE | Plant services (crane, elevator, pits) | LABAS: mechanical / civil, walang DCS signal | — | 57.1 |
| 63 | L-0503 | CRANE FOR SEA WATER PUMP STATION | Plant services (crane, elevator, pits) | LABAS: mechanical / civil, walang DCS signal | — | 59.1 |
| 64 | L-1060A/2060A | ASH COOLER (BOTTOM ASH SCREW COOLER) A | Bottom ash | PASOK | ash | 52.1 |
| 65 | L-1060B/2060B | ASH COOLER (BOTTOM ASH SCREW COOLER) B | Bottom ash | PASOK | ash | 52.1 |
| 66 | L-1060C/2060C | ASH COOLER (BOTTOM ASH SCREW COOLER) C | Bottom ash | PASOK | ash | 52.1 |
| 67 | L-1060D/2060D | ASH COOLER (BOTTOM ASH SCREW COOLER) D | Bottom ash | PASOK | ash | 52.1 |
| 68 | L-1061A/2061A | COAL FEEDER A | Coal feeders | PASOK | coal | 47.1 |
| 69 | L-1061B/2061B | COAL FEEDER B | Coal feeders | PASOK | coal | 47.1 |
| 70 | L-1061C/2061C | COAL FEEDER C | Coal feeders | PASOK | coal | 47.1 |
| 71 | L-1090/2090 | CHAIN CONVEYOR | Bottom ash | PASOK | ash | 51.1 |
| 72 | L-1091/2091 | BUCKET ELEVATOR | Bottom ash | PASOK | ash | 51.2 |
| 73 | L-1092/2092 | SCREW CONVEYOR | Bottom ash | PASOK | ash | 51.3 |
| 74 | L-1111/2111 | BALL SEPARATOR | Condenser tube cleaning | PASOK | sea-water | 20.1 |
| 75 | L-1112/2112 | BALL SEPARATOR | Condenser tube cleaning | PASOK | sea-water | 20.1 |
| 76 | L-1250/2250 | DRY UNLOADER | Fly ash | PASOK | ash | 53.6 |
| 77 | L-1311/2311 | LIMESTONE FEEDER | Limestone at sand | PASOK | limestone-sand | 49.5 |
| 78 | L-1903/2903 | LOADING SPOUT | Bottom ash | PASOK | ash | 51.8 |
| 79 | L-1904/2904 | TWO WAY SEPARATOR | Bottom ash | PASOK | ash | 51.6 |
| 80 | L-1906/2906 | TURNING GEAR | Turbine at generator | PASOK | turbine-motors, turbine | 2.6 |
| 81 | M-0850 | SLUDGE THICKENER SCRAPER | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.23 |
| 82 | M-1115A/2115A | BFWP MAIN MOTOR / COOLER A | Boiler feedwater pumps | PASOK | feedwater | 15.2 |
| 83 | M-1115B/2115B | BFWP MAIN MOTOR / COOLER B | Boiler feedwater pumps | PASOK | feedwater | 15.2 |
| 84 | M-1906/2906 | TURNING GEAR MOTOR | Turbine at generator | PASOK | turbine-motors, turbine | 2.7 |
| 85 | M-1911/2911 | GLAND STEAM EXHAUSTER MOTOR | Gland steam | PASOK | turbine-readings, extraction | 2.11 |
| 86 | M-1922A/2922A | MAIN OIL PUMP MOTOR A | Turbine oil | PASOK | turbine-oil | 2.16 |
| 87 | M-1922B/2922B | MAIN OIL PUMP MOTOR B | Turbine oil | PASOK | turbine-oil | 2.16 |
| 88 | M-1923/2923 | EMERGENCY OIL PUMP MOTOR | Turbine oil | PASOK | turbine-oil | 2.18 |
| 89 | M-1931A/2931A | CONTROL OIL PUMP MOTOR A | Turbine oil | PASOK | turbine-oil | 2.19.2 |
| 90 | M-1931B/2931B | CONTROL OIL PUMP MOTOR B | Turbine oil | PASOK | turbine-oil | 2.19.2 |
| 91 | M-1937/2937 | VAPOUR EXTRACTOR MOTOR | Turbine oil | PASOK | turbine-oil | 2.19.9 |
| 92 | M-1941/2941 | OIL PURIFIER PUMP MOTOR | Turbine oil | PASOK | turbine-oil | 2.20.2 |
| 93 | N-1011/2011 | SOOTBLOWER - RH+ ECO. PASS | Sootblowers | PASOK | sootblowers | 10A |
| 94 | N-1012/2012 | SOOTBLOWER - RH+ ECO. PASS | Sootblowers | PASOK | sootblowers | 10A |
| 95 | N-1013/2013 | SOOTBLOWER - SH+ ECO. PASS | Sootblowers | PASOK | sootblowers | 10A |
| 96 | N-1014/2014 | SOOTBLOWER - SH+ ECO. PASS | Sootblowers | PASOK | sootblowers | 10A |
| 97 | N-1015/2015 | SOOTBLOWER - RH+ ECO. PASS | Sootblowers | PASOK | sootblowers | 10A |
| 98 | N-1016/2016 | SOOTBLOWER - RH+ ECO. PASS | Sootblowers | PASOK | sootblowers | 10A |
| 99 | N-1017/2017 | SOOTBLOWER - SH+ ECO. PASS | Sootblowers | PASOK | sootblowers | 10A |
| 100 | N-1018/2018 | SOOTBLOWER - SH+ ECO. PASS | Sootblowers | PASOK | sootblowers | 10A |
| 101 | N-1019/2019 | SOOTBLOWER - RH+ ECO. PASS | Sootblowers | PASOK | sootblowers | 10A |
| 102 | N-1020/2020 | SOOTBLOWER - RH+ ECO. PASS | Sootblowers | PASOK | sootblowers | 10A |
| 103 | N-1021/2021 | SOOTBLOWER - SH+ ECO. PASS | Sootblowers | PASOK | sootblowers | 10A |
| 104 | N-1022/2022 | SOOTBLOWER - SH+ ECO. PASS | Sootblowers | PASOK | sootblowers | 10A |
| 105 | N-1023/2023 | SOOTBLOWER - RH+ ECO. PASS | Sootblowers | PASOK | sootblowers | 10A |
| 106 | N-1024/2024 | SOOTBLOWER - RH+ ECO. PASS | Sootblowers | PASOK | sootblowers | 10A |
| 107 | N-1025/2025 | SOOTBLOWER - SH+ ECO. PASS | Sootblowers | PASOK | sootblowers | 10A |
| 108 | N-1026/2026 | SOOTBLOWER - SH+ ECO. PASS | Sootblowers | PASOK | sootblowers | 10A |
| 109 | N-1027/2027 | SOOTBLOWER - RH+ ECO. PASS | Sootblowers | PASOK | sootblowers | 10A |
| 110 | N-1028/2028 | SOOTBLOWER - RH+ ECO. PASS | Sootblowers | PASOK | sootblowers | 10A |
| 111 | N-1029/2029 | SOOTBLOWER - SH+ ECO. PASS | Sootblowers | PASOK | sootblowers | 10A |
| 112 | N-1030/2030 | SOOTBLOWER - SH+ ECO. PASS | Sootblowers | PASOK | sootblowers | 10A |
| 113 | N-1031/2031 | SOOTBLOWER - RH+ ECO. PASS | Sootblowers | PASOK | sootblowers | 10A |
| 114 | N-1032/2032 | SOOTBLOWER - RH+ ECO. PASS | Sootblowers | PASOK | sootblowers | 10A |
| 115 | N-1033/2033 | SOOTBLOWER - SH+ ECO. PASS | Sootblowers | PASOK | sootblowers | 10A |
| 116 | N-1034/2034 | SOOTBLOWER - SH+ ECO. PASS | Sootblowers | PASOK | sootblowers | 10A |
| 117 | N-1035/2035 | SOOTBLOWER - COMMON ECO. | Sootblowers | PASOK | sootblowers | 10A |
| 118 | N-1036/2036 | SOOTBLOWER - COMMON ECO. | Sootblowers | PASOK | sootblowers | 10A |
| 119 | N-1037/2037 | SOOTBLOWER - COMMON ECO. | Sootblowers | PASOK | sootblowers | 10A |
| 120 | N-1038/2038 | SOOTBLOWER - COMMON ECO. | Sootblowers | PASOK | sootblowers | 10A |
| 121 | N-1040/2040 | SOOTBLOWER - GAS AIR HEATER | Sootblowers | PASOK | sootblowers | 10B.1 |
| 122 | N-1042/2042 | SOOTBLOWER - GAS AIR HEATER | Sootblowers | PASOK | sootblowers | 10B.1 |
| 123 | OR-CD1001/2001 | ORIFICE - CONDENSATE MINIMUM FLOW RECIRCULATION | Condensate and polisher | PASOK | condensate | ORI |
| 124 | OR-CD1002/2002 | ORIFICE - FLASH CHAMBER SPRAY | Condensate and polisher | PASOK | condensate | ORI |
| 125 | OR-CW1001A/2001A | ORIFICE - COOLING WATER OUTLET OF TURBINE OIL COOLER A | Turbine oil | PASOK | turbine-oil | ORI |
| 126 | OR-CW1001B/2001B | ORIFICE - COOLING WATER OUTLET OF TURBINE OIL COOLER B | Turbine oil | PASOK | turbine-oil | ORI |
| 127 | OR-FW1001/2001 | ORIFICE - MIN. FLOW | Boiler feedwater pumps | PASOK | feedwater | 15.4 |
| 128 | OR-FW1002/2002 | ORIFICE - MIN. FLOW | Boiler feedwater pumps | PASOK | feedwater | 15.4 |
| 129 | OR-FW1003/2003 | ORIFICE - BALANCE FLOW | Boiler feedwater pumps | PASOK | feedwater | 15.5 |
| 130 | OR-FW1004/2004 | ORIFICE - BALANCE FLOW | Boiler feedwater pumps | PASOK | feedwater | 15.5 |
| 131 | OR-MS1001/2001 | ORIFICE - MAIN STEAM CONTINUOUS DRAIN BEFORE PCV-MS1020 | Main steam | PASOK | boiler-steam | ORI |
| 132 | OR-MS1002/2002 | ORIFICE - MAIN STEAM CONTINUOUS DRAIN BEFORE PCV-MS1010 | Main steam | PASOK | boiler-steam | ORI |
| 133 | OR-MU1002/2002 | ORIFICE - MAKE-UP WATER TO CONDENSER, DOWNSTREAM LCV-MU1110 | Condensate and polisher | PASOK | condensate | ORI |
| 134 | P-0058A | WASTE WATER PUMP A | Plant services (crane, elevator, pits) | LABAS: mechanical / civil, walang DCS signal | — | 32.1 |
| 135 | P-0058B | WASTE WATER PUMP B | Plant services (crane, elevator, pits) | LABAS: mechanical / civil, walang DCS signal | — | 32.1 |
| 136 | P-0702A | DIESEL OIL PUMP A | Diesel oil | PASOK | oil-burners | 24.1 |
| 137 | P-0702B | DIESEL OIL PUMP B | Diesel oil | PASOK | oil-burners | 24.1 |
| 138 | P-0709A | MAKE-UP WATER PUMP A | Make-up / industrial water | PASOK | makeup-cooling, industrial-water | 30.1 |
| 139 | P-0709B | MAKE-UP WATER PUMP B | Make-up / industrial water | PASOK | makeup-cooling, industrial-water | 30.1 |
| 140 | P-0709C | MAKE-UP WATER PUMP C | Make-up / industrial water | PASOK | makeup-cooling, industrial-water | 30.1 |
| 141 | P-0715A | INDUSTRIAL WATER PUMP A | Make-up / industrial water | PASOK | makeup-cooling, industrial-water | 31.1 |
| 142 | P-0715B | INDUSTRIAL WATER PUMP B | Make-up / industrial water | PASOK | makeup-cooling, industrial-water | 31.1 |
| 143 | P-0718 | FIRE PUMP DIESEL DRIVEN | Fire fighting | LABAS: mechanical / civil, walang DCS signal | — | 60.1 |
| 144 | P-0719 | FIRE PUMP MOTOR DRIVEN | Fire fighting | LABAS: mechanical / civil, walang DCS signal | — | 60.2 |
| 145 | P-0720 | JOCKEY PUMP MOTOR DRIVEN | Fire fighting | LABAS: mechanical / civil, walang DCS signal | — | 60.3 |
| 146 | P-0761A | NAOCL DOSING PUMP A | Chemical dosing (sea water) | PASOK | sea-water | 35.1 |
| 147 | P-0761B | NAOCL DOSING PUMP B | Chemical dosing (sea water) | PASOK | sea-water | 35.1 |
| 148 | P-0762A | HYPO-CHLORINATED DOSING PUMP A | Chemical dosing (sea water) | PASOK | sea-water | 35.3 |
| 149 | P-0762B | HYPO-CHLORINATED DOSING PUMP B | Chemical dosing (sea water) | PASOK | sea-water | 35.3 |
| 150 | P-0808A | FILTER WATER PUMP A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.30 |
| 151 | P-0808B | FILTER WATER PUMP B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.30 |
| 152 | P-0809A | BACK WASH PUMP A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.24 |
| 153 | P-0809B | BACK WASH PUMP B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.24 |
| 154 | P-0850A | RAW WATER TRANSFER PUMP A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.35 |
| 155 | P-0850B | RAW WATER TRANSFER PUMP B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.35 |
| 156 | P-0851A | MMF FEED PUMP A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.33 |
| 157 | P-0851B | MMF FEED PUMP B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.33 |
| 158 | P-0855A | HIGH PRESSURE PUMP A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.31 |
| 159 | P-0855B | HIGH PRESSURE PUMP B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.31 |
| 160 | P-0856A | CEDI TRANSFER PUMP A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.26 |
| 161 | P-0856B | CEDI TRANSFER PUMP B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.26 |
| 162 | P-0857 | POTABLE WATER TRANSFER PUMP | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.34 |
| 163 | P-0858A | REGENERATION PUMP A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.36 |
| 164 | P-0858B | REGENERATION PUMP B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.36 |
| 165 | P-0858C | REGENERATION PUMP C | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.36 |
| 166 | P-0859A | WASTE WATER PUMP 1 A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.44 |
| 167 | P-0859B | WASTE WATER PUMP 1 B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.44 |
| 168 | P-0860 | NEUTRALIZATION TANK AGITATOR | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.20 |
| 169 | P-0861A | WASTE WATER FEED PUMP A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.43 |
| 170 | P-0861B | WASTE WATER FEED PUMP B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.43 |
| 171 | P-0862 | PH ADJUST TANK AGITATOR 2 | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.22 |
| 172 | P-0863A | EFFLUENT PUMP A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.29 |
| 173 | P-0863B | EFFLUENT PUMP B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.29 |
| 174 | P-0864A | WASTE WATER PUMP 2 A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.45 |
| 175 | P-0864B | WASTE WATER PUMP 2 B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.45 |
| 176 | P-0865 | PH ADJUST TANK AGITATOR 1 | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.21 |
| 177 | P-0866A | COOLING PUMP A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.28 |
| 178 | P-0866B | COOLING PUMP B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.28 |
| 179 | P-0867A | HOT WATER PUMP A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.32 |
| 180 | P-0867B | HOT WATER PUMP B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.32 |
| 181 | P-0868A | SLUDGE PUMP 1 A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.38 |
| 182 | P-0868B | SLUDGE PUMP 1 B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.38 |
| 183 | P-0869A | SLUDGE PUMP 2 A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.39 |
| 184 | P-0869B | SLUDGE PUMP 2 B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.39 |
| 185 | P-0870A | CIP PUMP A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.27 |
| 186 | P-0870B | CIP PUMP B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.27 |
| 187 | P-0871A | POLYMER DOSING PUMP 1 A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.56 |
| 188 | P-0871B | POLYMER DOSING PUMP 1 B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.56 |
| 189 | P-0871C | POLYMER DOSING PUMP 1 C | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.56 |
| 190 | P-0872A | NAOCL DOSING PUMP 1 A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.49 |
| 191 | P-0872B | NAOCL DOSING PUMP 1 B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.49 |
| 192 | P-0872C | NAOCL DOSING PUMP 1 C | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.49 |
| 193 | P-0873A | NAOCL DOSING PUMP 2 A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.51 |
| 194 | P-0873B | NAOCL DOSING PUMP 2 B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.51 |
| 195 | P-0874A | UNLOADING PUMP 1 A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.40 |
| 196 | P-0874B | UNLOADING PUMP 1 B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.40 |
| 197 | P-0875A | H2SO4 DOSING PUMP A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.48 |
| 198 | P-0875B | H2SO4 DOSING PUMP B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.48 |
| 199 | P-0875C | H2SO4 DOSING PUMP C | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.48 |
| 200 | P-0875D | H2SO4 DOSING PUMP D | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.48 |
| 201 | P-0875E | H2SO4 DOSING PUMP E | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.48 |
| 202 | P-0875F | H2SO4 DOSING PUMP F | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.48 |
| 203 | P-0876A | UNLOADING PUMP 2 A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.41 |
| 204 | P-0876B | UNLOADING PUMP 2 B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.41 |
| 205 | P-0877A | NAOH DOSING PUMP 1 A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.52 |
| 206 | P-0877B | NAOH DOSING PUMP 1 B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.52 |
| 207 | P-0877C | NAOH DOSING PUMP 1 C | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.52 |
| 208 | P-0878A | NAOH DOSING PUMP 2 A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.53 |
| 209 | P-0878B | NAOH DOSING PUMP 2 B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.53 |
| 210 | P-0879A | NAOH DOSING PUMP 3 A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.54 |
| 211 | P-0879B | NAOH DOSING PUMP 3 B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.54 |
| 212 | P-0879C | NAOH DOSING PUMP 3 C | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.54 |
| 213 | P-0879D | NAOH DOSING PUMP 3 D | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.54 |
| 214 | P-0879E | NAOH DOSING PUMP 3 E | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.54 |
| 215 | P-0879F | NAOH DOSING PUMP 3 F | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.54 |
| 216 | P-0880A | ANTI-SCALANT DOSING PUMP A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.46 |
| 217 | P-0880B | ANTI-SCALANT DOSING PUMP B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.46 |
| 218 | P-0881A | PAC DOSING PUMP A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.55 |
| 219 | P-0881B | PAC DOSING PUMP B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.55 |
| 220 | P-0881C | PAC DOSING PUMP C | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.55 |
| 221 | P-0882A | POLYMER DOSING PUMP 2 A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.57 |
| 222 | P-0882B | POLYMER DOSING PUMP 2 B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.57 |
| 223 | P-0883A | FECL3 DOSING PUMP A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.47 |
| 224 | P-0883B | FECL3 DOSING PUMP B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.47 |
| 225 | P-0884 | CARBON TANK AGITATOR | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.19 |
| 226 | P-0885A | CARBON FEED PUMP A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.25 |
| 227 | P-0885B | CARBON FEED PUMP B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.25 |
| 228 | P-0894 | WASH PUMP | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.42 |
| 229 | P-0895A | UTILITY WATER PUMP A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.37 |
| 230 | P-0895B | UTILITY WATER PUMP B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.37 |
| 231 | P-1108A/2108A | AUXILIARY COOLING WATER PUMP A | Closed cooling water | PASOK | makeup-cooling | 22.1 |
| 232 | P-1108B/2108B | AUXILIARY COOLING WATER PUMP B | Closed cooling water | PASOK | makeup-cooling | 22.1 |
| 233 | P-1113/2113 | BALL CIRCULATING PUMP | Condenser tube cleaning | PASOK | sea-water | 20.2 |
| 234 | P-1114/2114 | BALL CIRCULATING PUMP | Condenser tube cleaning | PASOK | sea-water | 20.2 |
| 235 | P-1115A/2115A | BOILER FEED WATER PUMP / COOLER A | Boiler feedwater pumps | PASOK | feedwater | 15.1 |
| 236 | P-1115B/2115B | BOILER FEED WATER PUMP / COOLER B | Boiler feedwater pumps | PASOK | feedwater | 15.1 |
| 237 | P-1116A/2116A | CONDENSATE PUMP A | Condensate and polisher | PASOK | condensate | 12.1 |
| 238 | P-1116B/2116B | CONDENSATE PUMP B | Condensate and polisher | PASOK | condensate | 12.1 |
| 239 | P-1127/2127 | SUBMERGE PUMP (TRANSFORMER AREA) | Plant services (crane, elevator, pits) | LABAS: mechanical / civil, walang DCS signal | — | 55.1 |
| 240 | P-1501A/2501A | SEA WATER PUMP A | Sea water | PASOK | sea-water | 16.1 |
| 241 | P-1501B/2501B | SEA WATER PUMP B | Sea water | PASOK | sea-water | 16.1 |
| 242 | P-1501C/2501C | SEA WATER PUMP C | Sea water | PASOK | sea-water | 16.1 |
| 243 | P-1503A/2503A | SEA WATER BOOSTER PUMP A | Sea water | PASOK | sea-water | 17.1 |
| 244 | P-1503B/2503B | SEA WATER BOOSTER PUMP B | Sea water | PASOK | sea-water | 17.1 |
| 245 | P-1503C/2503C | SEA WATER BOOSTER PUMP C | Sea water | PASOK | sea-water | 17.1 |
| 246 | P-1716A/2716A | CONDENSATE POLISHER BOOSTER PUMP A | Condensate and polisher | PASOK | condensate | 37.1 |
| 247 | P-1716B/2716B | CONDENSATE POLISHER BOOSTER PUMP B | Condensate and polisher | PASOK | condensate | 37.1 |
| 248 | P-1922A/2922A | MAIN OIL PUMP (MOP) A | Turbine oil | PASOK | turbine-oil | 2.15 |
| 249 | P-1922B/2922B | MAIN OIL PUMP (MOP) B | Turbine oil | PASOK | turbine-oil | 2.15 |
| 250 | P-1923/2923 | EMERGENCY OIL PUMP (EOP) | Turbine oil | PASOK | turbine-oil | 2.17 |
| 251 | P-1931A/2931A | CONTROL OIL PUMP (COP) A | Turbine oil | PASOK | turbine-oil | 2.19.1 |
| 252 | P-1931B/2931B | CONTROL OIL PUMP (COP) B | Turbine oil | PASOK | turbine-oil | 2.19.1 |
| 253 | P-1941/2941 | OIL PURIFIER PUMP | Turbine oil | PASOK | turbine-oil | 2.20.1 |
| 254 | PCV-AS1010/2010 | PRESSURE CONTROL VALVE - TO AUX. STEAM | Turbine bypass at control valves | PASOK | boiler-steam, reheat, aux-steam | 7.3 |
| 255 | PCV-HR1010/2010 | PRESSURE CONTROL VALVE - LP TURBINE BYPASS | Turbine bypass at control valves | PASOK | boiler-steam, reheat, aux-steam | 7.2 |
| 256 | PCV-MS1020/2020 | PRESSURE CONTROL VALVE - HP TURBINE BYPASS | Turbine bypass at control valves | PASOK | boiler-steam, reheat, aux-steam | 7.1 |
| 257 | RO-IW0715A | ORIFICE (INDUSTRIAL WATER PUMP) A | Make-up / industrial water | PASOK | makeup-cooling, industrial-water | 31.2 |
| 258 | RO-IW0715B | ORIFICE (INDUSTRIAL WATER PUMP) B | Make-up / industrial water | PASOK | makeup-cooling, industrial-water | 31.2 |
| 259 | RO-MU0709A | ORIFICE (MAKE-UP WATER PUMP) A | Make-up / industrial water | PASOK | makeup-cooling, industrial-water | 30.2 |
| 260 | RO-MU0709B | ORIFICE (MAKE-UP WATER PUMP) B | Make-up / industrial water | PASOK | makeup-cooling, industrial-water | 30.2 |
| 261 | RO-MU0709C | ORIFICE (MAKE-UP WATER PUMP) C | Make-up / industrial water | PASOK | makeup-cooling, industrial-water | 30.2 |
| 262 | S-0710A | SUCTION FILTER (PLANT AIR) A | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 26.4 |
| 263 | S-0710B | SUCTION FILTER (PLANT AIR) B | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 26.4 |
| 264 | S-0710C | SUCTION FILTER (PLANT AIR) C | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 26.4 |
| 265 | S-0712A | SUCTION FILTER (INSTRUMENT AIR) A | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 27.4 |
| 266 | S-0712B | SUCTION FILTER (INSTRUMENT AIR) B | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 27.4 |
| 267 | S-0712C | SUCTION FILTER (INSTRUMENT AIR) C | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 27.4 |
| 268 | S-0850A | RO PRE FILTER A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.16 |
| 269 | S-0850B | RO PRE FILTER B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.16 |
| 270 | S-0851 | CIP FILTER | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.15 |
| 271 | S-1009A/2009A | CYCLONE A | Boiler (furnace, drum, cyclones, seal pots) | PASOK | boiler-steam, furnace-gas | 1.2 |
| 272 | S-1009B/2009B | CYCLONE B | Boiler (furnace, drum, cyclones, seal pots) | PASOK | boiler-steam, furnace-gas | 1.2 |
| 273 | S-1053/2053 | PAF SUCTION SILENCER | Air (fans, blowers, air heater) | PASOK | combustion-air | 44.2 |
| 274 | S-1054/2054 | SAF SUCTION SILENCER (nakasulat S-1504 / 2504 sa R0) | Air (fans, blowers, air heater) | PASOK | combustion-air | 45.2 |
| 275 | S-1055A/2055A | FILTER SILENCER - FLUIDIZING AIR BLOWER A | Air (fans, blowers, air heater) | PASOK | combustion-air | 46.2 |
| 276 | S-1055B/2055B | FILTER SILENCER - FLUIDIZING AIR BLOWER B | Air (fans, blowers, air heater) | PASOK | combustion-air | 46.2 |
| 277 | S-1090/2090 | TRANSMITTER | Bottom ash | PASOK | ash | 51.10 |
| 278 | S-1091/2091 | BAG FILTER | Bottom ash | PASOK | ash | 51.5 |
| 279 | S-1092/2092 | VIBRATION SCREEN | Bottom ash | PASOK | ash | 51.7 |
| 280 | S-1250A/2250A | FLY ASH TRANSMITTER A | Fly ash | PASOK | ash | 53.2 |
| 281 | S-1250B/2250B | FLY ASH TRANSMITTER B | Fly ash | PASOK | ash | 53.2 |
| 282 | S-1251A/2251A | FLY ASH TRANSMITTER A | Fly ash | PASOK | ash | 53.2 |
| 283 | S-1251B/2251B | FLY ASH TRANSMITTER B | Fly ash | PASOK | ash | 53.2 |
| 284 | S-1252A/2252A | FLY ASH TRANSMITTER A | Fly ash | PASOK | ash | 53.3 |
| 285 | S-1252B/2252B | FLY ASH TRANSMITTER B | Fly ash | PASOK | ash | 53.3 |
| 286 | S-1253A/2253A | FLY ASH TRANSMITTER A | Fly ash | PASOK | ash | 53.4 |
| 287 | S-1253B/2253B | FLY ASH TRANSMITTER B | Fly ash | PASOK | ash | 53.4 |
| 288 | S-1254A/2254A | FLY ASH TRANSMITTER A | Fly ash | PASOK | ash | 53.5 |
| 289 | S-1254B/2254B | FLY ASH TRANSMITTER B | Fly ash | PASOK | ash | 53.5 |
| 290 | S-1255A/2255A | FLY ASH TRANSMITTER A | Fly ash | PASOK | ash | 53.5 |
| 291 | S-1255B/2255B | FLY ASH TRANSMITTER B | Fly ash | PASOK | ash | 53.5 |
| 292 | S-1255C/2255C | FLY ASH TRANSMITTER C | Fly ash | PASOK | ash | 53.5 |
| 293 | S-1255D/2255D | FLY ASH TRANSMITTER D | Fly ash | PASOK | ash | 53.5 |
| 294 | S-1256/2256 | DEDUST VENTING FILTER | Fly ash | PASOK | ash | 53.7 |
| 295 | S-1300/2300 | DENSE PHASE VESSEL (SAND) | Limestone at sand | PASOK | limestone-sand | 50.1 |
| 296 | S-1301/2301 | BAG FILTER (SAND) | Limestone at sand | PASOK | limestone-sand | 50.4 |
| 297 | S-1311/2311 | LIMESTONE LOCK VESSEL | Limestone at sand | PASOK | limestone-sand | 49.1 |
| 298 | S-1312/2312 | LIMESTONE DISPENSING VESSEL | Limestone at sand | PASOK | limestone-sand | 49.2 |
| 299 | S-1313/2313 | BAG FILTER (LIMESTONE) | Limestone at sand | PASOK | limestone-sand | 49.6 |
| 300 | S-1502/2502 | DEBRIS FILTER - SEA WATER PUMP STATION | Sea water | PASOK | sea-water | 19.1 |
| 301 | S-1504/2504 | DEBRIS FILTER - BEFORE CCWHE | Sea water | PASOK | sea-water | 19.2 |
| 302 | S-1932A/2932A | DUPLEX OIL FILTER A | Turbine oil | PASOK | turbine-oil | 2.19.3 |
| 303 | S-1932B/2932B | DUPLEX OIL FILTER B | Turbine oil | PASOK | turbine-oil | 2.19.3 |
| 304 | S-1933A/2933A | CONTROL OIL FILTER A | Turbine oil | PASOK | turbine-oil | 2.19.4 |
| 305 | S-1933B/2933B | CONTROL OIL FILTER B | Turbine oil | PASOK | turbine-oil | 2.19.4 |
| 306 | S-1936/2936 | MIST ELIMINATOR | Turbine oil | PASOK | turbine-oil | 2.19.7 |
| 307 | S-1942/2942 | COALESCER FILTER | Turbine oil | PASOK | turbine-oil | 2.20.3 |
| 308 | S-1943/2943 | OIL PURIFIER PUMP SUCTION STRAINER | Turbine oil | PASOK | turbine-oil | 2.20.4 |
| 309 | S-1960/2960 | LP EXHAUST HOOD WATER SPRAY STRAINER | Turbine at generator | PASOK | turbine, turbine-valves, generator | 2.21 |
| 310 | STR-CD1002/2002 | CONDENSATE PUMP STRAINER | Condensate and polisher | PASOK | condensate | 12.2 |
| 311 | STR-CD1003/2003 | STRAINER - CONDENSER CURTAIN SPRAY BLOCK VALVE (XV-CD1006) INLET | Condensate and polisher | PASOK | condensate | STR |
| 312 | STR-CD1004/2004 | STRAINER - FLASH CHAMBER SPRAY BLOCK VALVE (XV-CD1005) INLET | Condensate and polisher | PASOK | condensate | STR |
| 313 | STR-CD1005/2005 | STRAINER - LP TURBINE BYPASS DSH TCV-CD1115 INLET | Condensate and polisher | PASOK | condensate | STR |
| 314 | STR-CD1006/2006 | STRAINER - AUX. STEAM DSH TCV-CD1124 INLET | Condensate and polisher | PASOK | condensate | STR |
| 315 | STR-CD1007/2007 | STRAINER - GLAND STEAM DSH TCV-CD1126 INLET | Condensate and polisher | PASOK | condensate | STR |
| 316 | STR-CD1008/2008 | STRAINER - CONDENSATE DEAERATOR INLET | Condensate and polisher | PASOK | condensate | STR |
| 317 | STR-CD1011/2011 | CONDENSATE PUMP STRAINER | Condensate and polisher | PASOK | condensate | 12.2 |
| 318 | STR-DO0001 | STRAINER - DIESEL OIL TANK TRUCK INLET | Diesel oil | PASOK | oil-burners | STR |
| 319 | STR-DO0002 | DIESEL OIL STRAINER | Diesel oil | PASOK | oil-burners | 24.2 |
| 320 | STR-FW1001/2001 | BFP SUCTION STRAINER | Boiler feedwater pumps | PASOK | feedwater | 15.3 |
| 321 | STR-FW1002/2002 | BFP SUCTION STRAINER | Boiler feedwater pumps | PASOK | feedwater | 15.3 |
| 322 | STR-FW1003/2003 | STRAINER - SH PANEL #2 OUTLET DSH TCV-FW1120-1 INLET | Feedwater | PASOK | feedwater, boiler-steam | STR |
| 323 | STR-FW1004/2004 | STRAINER - SH PANEL #2 OUTLET DSH TCV-FW1120-2 INLET | Feedwater | PASOK | feedwater, boiler-steam | STR |
| 324 | STR-FW1005/2005 | STRAINER - SH PANEL #1 OUTLET DSH TCV-FW1110-1 INLET | Feedwater | PASOK | feedwater, boiler-steam | STR |
| 325 | STR-FW1006/2006 | STRAINER - SH PANEL #1 OUTLET DSH TCV-FW1110-2 INLET | Feedwater | PASOK | feedwater, boiler-steam | STR |
| 326 | STR-FW1007/2007 | STRAINER - RH INLET DSH TCV-FW1150 INLET | Feedwater | PASOK | feedwater, boiler-steam | STR |
| 327 | STR-FW1008/2008 | STRAINER - HP TURBINE BYPASS DSH TCV-FW1060 INLET | Feedwater | PASOK | feedwater, boiler-steam | STR |
| 328 | STR-IW0001 | STRAINER (INDUSTRIAL WATER PUMP) | Make-up / industrial water | PASOK | makeup-cooling, industrial-water | 31.3 |
| 329 | STR-IW0002 | STRAINER (INDUSTRIAL WATER PUMP) | Make-up / industrial water | PASOK | makeup-cooling, industrial-water | 31.3 |
| 330 | STR-MU0001 | STRAINER (MAKE-UP WATER PUMP) | Make-up / industrial water | PASOK | makeup-cooling, industrial-water | 30.3 |
| 331 | STR-MU0002 | STRAINER (MAKE-UP WATER PUMP) | Make-up / industrial water | PASOK | makeup-cooling, industrial-water | 30.3 |
| 332 | STR-MU0003 | STRAINER (MAKE-UP WATER PUMP) | Make-up / industrial water | PASOK | makeup-cooling, industrial-water | 30.3 |
| 333 | T-0113 | PLUMBING WATER TANK - TURBINE BUILDING | Water treatment / potable | LABAS: WTP (user 11-25) | — | 54A.9 |
| 334 | T-0114 | POTABLE WATER TANK - TURBINE BUILDING | Make-up / industrial water | PASOK | makeup-cooling, industrial-water | 54A.10 |
| 335 | T-0701 | OIL SERVICE TANK | Diesel oil | PASOK | oil-burners | 54A.4 |
| 336 | T-0705A | PLANT AIR RECEIVER (TANK) A | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 26.1 |
| 337 | T-0705B | PLANT AIR RECEIVER (TANK) B | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 26.1 |
| 338 | T-0706A | INSTRUMENT AIR RECEIVER (TANK) A | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 27.1 |
| 339 | T-0706B | INSTRUMENT AIR RECEIVER (TANK) B | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 27.1 |
| 340 | T-0708A | DEMINERALIZED WATER TANK A | Demin water storage | PASOK (demin = walang hanggang supply) | makeup-cooling | 54A.5 |
| 341 | T-0708B | DEMINERALIZED WATER TANK B | Demin water storage | PASOK (demin = walang hanggang supply) | makeup-cooling | 54A.5 |
| 342 | T-0714 | INDUSTRIAL WATER TANK | Make-up / industrial water | PASOK | makeup-cooling, industrial-water | 54A.6 |
| 343 | T-0717 | RAW WATER TANK (RAW WATER PIT) | Water treatment / potable | LABAS: WTP (user 11-25) | — | 54A.16 |
| 344 | T-0721 | STORAGE TANK - WATER TREATMENT AREA | Water treatment / potable | LABAS: WTP (user 11-25) | — | 54A.8 |
| 345 | T-0724 | FIRE WATER TANK | Fire fighting | LABAS: mechanical / civil, walang DCS signal | — | 54A.7 |
| 346 | T-0761 | NAOCL STORAGE TANK | Chemical dosing (sea water) | PASOK | sea-water | 35.2 |
| 347 | T-0762 | NAOCL STORAGE TANK | Chemical dosing (sea water) | PASOK | sea-water | 35.2 |
| 348 | T-0851A | CLEAR WATER TANK A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.69 |
| 349 | T-0851B | CLEAR WATER TANK B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.69 |
| 350 | T-0852A | MMF A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.62 |
| 351 | T-0852B | MMF B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.62 |
| 352 | T-0852C | MMF C | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.62 |
| 353 | T-0854A | CARBON FILTER A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.59 |
| 354 | T-0854B | CARBON FILTER B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.59 |
| 355 | T-0854C | CARBON FILTER C | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.59 |
| 356 | T-0855 | RO PERMEATE WATER TANK | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.77 |
| 357 | T-0858A | ANTHRACITE FILTER A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.58 |
| 358 | T-0858B | ANTHRACITE FILTER B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.58 |
| 359 | T-0859A | POLISHER MB A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.63 |
| 360 | T-0859B | POLISHER MB B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.63 |
| 361 | T-0860 | REGENERATION WASTE WATER POOL 1 | Water treatment / potable | LABAS: WTP (user 11-25) | — | 54A.17 |
| 362 | T-0861 | NEUTRALIZATION TANK | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.74 |
| 363 | T-0862 | WASTE WATER BUFFER POOL | Water treatment / potable | LABAS: WTP (user 11-25) | — | 54A.18 |
| 364 | T-0863 | PH ADJUST TANK 2 | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.76 |
| 365 | T-0864 | EFFLUENT TANK | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.73 |
| 366 | T-0865 | REGENERATION WASTE WATER POOL 2 | Water treatment / potable | LABAS: WTP (user 11-25) | — | 54A.19 |
| 367 | T-0866 | PH ADJUST TANK 1 | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.75 |
| 368 | T-0867 | CONCENTRATE WATER TANK | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.71 |
| 369 | T-0868 | COOLING TOWER | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.72 |
| 370 | T-0869 | HEATING TANK | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.60 |
| 371 | T-0870 | SLUDGE BUFFER TANK | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.78 |
| 372 | T-0871 | SLUDGE THICKENER | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.66 |
| 373 | T-0872 | CIP TANK | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.68 |
| 374 | T-0873 | NAOCL STORAGE TANK | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.84 |
| 375 | T-0874 | H2SO4 STORAGE TANK | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.82 |
| 376 | T-0875 | POLISHER MB H2SO4 MEASURING TANK | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.89 |
| 377 | T-0876 | H2SO4 DOSING TANK | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.83 |
| 378 | T-0877 | NAOH STORAGE TANK | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.87 |
| 379 | T-0878 | POLISHER MB NAOH MEASURING TANK | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.90 |
| 380 | T-0879 | NAOH DOSING TANK 1 | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.85 |
| 381 | T-0880 | NAOH DOSING TANK 2 | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.86 |
| 382 | T-0881 | ANTI-SCALANT STORAGE TANK | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.80 |
| 383 | T-0882 | PAC STORAGE TANK | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.88 |
| 384 | T-0883 | FECL3 STORAGE TANK | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.81 |
| 385 | T-0884 | CARBON STORAGE TANK | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.67 |
| 386 | T-0893 | WASH TANK | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.79 |
| 387 | T-0895 | SLUDGE CAKE HOPPER 1 | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.64 |
| 388 | T-0896 | SLUDGE CAKE HOPPER 2 | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.65 |
| 389 | T-1001/2001 | STEAM DRUM | Boiler (furnace, drum, cyclones, seal pots) | PASOK | boiler-steam, furnace-gas | 1.4 |
| 390 | T-1009A/2009A | SEAL POT A | Boiler (furnace, drum, cyclones, seal pots) | PASOK | boiler-steam, furnace-gas | 1.3 |
| 391 | T-1009B/2009B | SEAL POT B | Boiler (furnace, drum, cyclones, seal pots) | PASOK | boiler-steam, furnace-gas | 1.3 |
| 392 | T-1050/2050 | FLASH TANK | Boiler blowdown | PASOK | boiler-steam | 54A.1 |
| 393 | T-1051/2051 | BLOWDOWN TANK | Boiler blowdown | PASOK | boiler-steam | 54A.2 |
| 394 | T-1064A/2064A | BIASING DAMPER IA BUFFER TANK A | Flue gas (ID fan, ESP, stack) | PASOK | furnace-gas | 54B.2 |
| 395 | T-1064B/2064B | BIASING DAMPER IA BUFFER TANK B | Flue gas (ID fan, ESP, stack) | PASOK | furnace-gas | 54B.2 |
| 396 | T-1065A/2065A | AIR BUFFER TANK (COAL FEEDER) A | Coal feeders | PASOK | coal | 47.2 |
| 397 | T-1065B/2065B | AIR BUFFER TANK (COAL FEEDER) B | Coal feeders | PASOK | coal | 47.2 |
| 398 | T-1065C/2065C | AIR BUFFER TANK (COAL FEEDER) C | Coal feeders | PASOK | coal | 47.2 |
| 399 | T-1066A/2066A | AIR CANNON A | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal | 48.1 |
| 400 | T-1066B/2066B | AIR CANNON B | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal | 48.1 |
| 401 | T-1066C/2066C | AIR CANNON C | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal | 48.1 |
| 402 | T-1066D/2066D | AIR CANNON D | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal | 48.1 |
| 403 | T-1066E/2066E | AIR CANNON E | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal | 48.1 |
| 404 | T-1066F/2066F | AIR CANNON F | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal | 48.1 |
| 405 | T-1066G/2066G | AIR CANNON G | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal | 48.1 |
| 406 | T-1066H/2066H | AIR CANNON H | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal | 48.1 |
| 407 | T-1066I/2066I | AIR CANNON I | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal | 48.1 |
| 408 | T-1067A/2067A | AIR CANNON A | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal | 48.1 |
| 409 | T-1067B/2067B | AIR CANNON B | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal | 48.1 |
| 410 | T-1067C/2067C | AIR CANNON C | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal | 48.1 |
| 411 | T-1067D/2067D | AIR CANNON D | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal | 48.1 |
| 412 | T-1067E/2067E | AIR CANNON E | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal | 48.1 |
| 413 | T-1067F/2067F | AIR CANNON F | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal | 48.1 |
| 414 | T-1067G/2067G | AIR CANNON G | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal | 48.1 |
| 415 | T-1067H/2067H | AIR CANNON H | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal | 48.1 |
| 416 | T-1067I/2067I | AIR CANNON I | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal | 48.1 |
| 417 | T-1068A/2068A | AIR CANNON A | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal | 48.1 |
| 418 | T-1068B/2068B | AIR CANNON B | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal | 48.1 |
| 419 | T-1068C/2068C | AIR CANNON C | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal | 48.1 |
| 420 | T-1068D/2068D | AIR CANNON D | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal | 48.1 |
| 421 | T-1068E/2068E | AIR CANNON E | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal | 48.1 |
| 422 | T-1068F/2068F | AIR CANNON F | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal | 48.1 |
| 423 | T-1068G/2068G | AIR CANNON G | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal | 48.1 |
| 424 | T-1068H/2068H | AIR CANNON H | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal | 48.1 |
| 425 | T-1068I/2068I | AIR CANNON I | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal | 48.1 |
| 426 | T-1090/2090 | BOTTOM ASH SILO | Bottom ash | PASOK | ash | 54A.14 |
| 427 | T-1091/2091 | RECYCLE BUFFER TANK | Bottom ash | PASOK | ash | 51.9 |
| 428 | T-1092/2092 | AIR TANK | Bottom ash | PASOK | ash | 51.11 |
| 429 | T-1104/2104 | DEAERATOR STORAGE TANK | Deaerator | PASOK | feedwater | 14.2 |
| 430 | T-1108A/2108A | COAL BUNKER / COAL SILO (DCS alarm list: T-1008) A | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal | 54A.11 |
| 431 | T-1108B/2108B | COAL BUNKER / COAL SILO (DCS alarm list: T-1008) B | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal | 54A.11 |
| 432 | T-1108C/2108C | COAL BUNKER / COAL SILO (DCS alarm list: T-1008) C | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal | 54A.11 |
| 433 | T-1109/2109 | EXPANSION TANK | Closed cooling water | PASOK | makeup-cooling | 54A.3 |
| 434 | T-1115/2115 | BALL VESSEL | Condenser tube cleaning | PASOK | sea-water | 20.3 |
| 435 | T-1116/2116 | BALL VESSEL | Condenser tube cleaning | PASOK | sea-water | 20.3 |
| 436 | T-1128/2128 | TURNING GEAR IA BUFFER TANK | Turbine at generator | PASOK | turbine-motors, turbine | 54B.1 |
| 437 | T-1135/2135 | FLASH PIPE | Condenser and vacuum | PASOK | condensate | 11.4 |
| 438 | T-1250/2250 | AIR TANK (AIR RECEIVER) | Fly ash | PASOK | ash | 53.1 |
| 439 | T-1251/2251 | FLY ASH SILO | Fly ash | PASOK | ash | 54A.15 |
| 440 | T-1300/2300 | SAND SILO | Limestone at sand | PASOK | limestone-sand | 54A.13 |
| 441 | T-1301/2301 | AIR RECEIVER (SAND) | Limestone at sand | PASOK | limestone-sand | 50.2 |
| 442 | T-1311/2311 | LIMESTONE SILO | Limestone at sand | PASOK | limestone-sand | 54A.12 |
| 443 | T-1312/2312 | AIR RECEIVER (LIMESTONE) | Limestone at sand | PASOK | limestone-sand | 49.3 |
| 444 | T-1395/2395 | CONTROL OIL ACCUMULATOR | Turbine oil | PASOK | turbine-oil | 2.19.6 |
| 445 | T-1920/2920 | MAIN OIL TANK (MOT) | Turbine oil | PASOK | turbine-oil | 2.13 |
| 446 | T-1934A/2934A | LUBE OIL ACCUMULATOR A | Turbine oil | PASOK | turbine-oil | 2.19.5 |
| 447 | T-1934B/2934B | LUBE OIL ACCUMULATOR B | Turbine oil | PASOK | turbine-oil | 2.19.5 |
| 448 | T-1934C/2934C | LUBE OIL ACCUMULATOR C | Turbine oil | PASOK | turbine-oil | 2.19.5 |
| 449 | T-1938/2938 | TRIP OIL ACCUMULATOR | Turbine oil | PASOK | turbine-oil | 2.19.10 |
| 450 | TCV-CD1115/2115 | TEMPERATURE CONTROL VALVE - LP TURBINE BYPASS | Turbine bypass at control valves | PASOK | boiler-steam, reheat, aux-steam | 8.1 |
| 451 | TCV-CD1124/2124 | TEMPERATURE CONTROL VALVE - TO AUX. STEAM PCV | Turbine bypass at control valves | PASOK | boiler-steam, reheat, aux-steam | 8.2 |
| 452 | TCV-CD1126/2126 | TEMPERATURE CONTROL VALVE - TO GLAND STEAM DSH | Turbine bypass at control valves | PASOK | boiler-steam, reheat, aux-steam | 8.3 |
| 453 | TCV-FG1116A/2116A | FLUE GAS BIASING DAMPER (RH PASS) A | Flue gas (ID fan, ESP, stack) | PASOK | furnace-gas | 41.1 |
| 454 | TCV-FG1116B/2116B | FLUE GAS BIASING DAMPER (RH PASS) B | Flue gas (ID fan, ESP, stack) | PASOK | furnace-gas | 41.1 |
| 455 | TCV-FG1116C/2116C | FLUE GAS BIASING DAMPER (RH PASS) C | Flue gas (ID fan, ESP, stack) | PASOK | furnace-gas | 41.1 |
| 456 | TCV-FG1116D/2116D | FLUE GAS BIASING DAMPER (RH PASS) D | Flue gas (ID fan, ESP, stack) | PASOK | furnace-gas | 41.1 |
| 457 | TCV-FG1117A/2117A | FLUE GAS BIASING DAMPER (SH PASS) A | Flue gas (ID fan, ESP, stack) | PASOK | furnace-gas | 41.2 |
| 458 | TCV-FG1117B/2117B | FLUE GAS BIASING DAMPER (SH PASS) B | Flue gas (ID fan, ESP, stack) | PASOK | furnace-gas | 41.2 |
| 459 | TCV-FG1117C/2117C | FLUE GAS BIASING DAMPER (SH PASS) C | Flue gas (ID fan, ESP, stack) | PASOK | furnace-gas | 41.2 |
| 460 | TCV-FG1117D/2117D | FLUE GAS BIASING DAMPER (SH PASS) D | Flue gas (ID fan, ESP, stack) | PASOK | furnace-gas | 41.2 |
| 461 | TCV-FW1060/2060 | TEMPERATURE CONTROL VALVE - HP TURBINE BYPASS | Turbine bypass at control valves | PASOK | boiler-steam, reheat, aux-steam | 8.4 |
| 462 | TCV-FW1150/2150 | TEMPERATURE CONTROL VALVE - REHEATER DSH | Turbine bypass at control valves | PASOK | boiler-steam, reheat, aux-steam | 8.5 |
| 463 | V-FA1001/2001 | PRIMARY AIR MANUAL DAMPER | Air (fans, blowers, air heater) | PASOK | combustion-air | 42.1 |
| 464 | V-FA1002/2002 | PRIMARY AIR MANUAL DAMPER | Air (fans, blowers, air heater) | PASOK | combustion-air | 42.1 |
| 465 | V-FA1003/2003 | PRIMARY AIR MANUAL DAMPER | Air (fans, blowers, air heater) | PASOK | combustion-air | 42.1 |
| 466 | V-FA1004/2004 | PRIMARY AIR MANUAL DAMPER | Air (fans, blowers, air heater) | PASOK | combustion-air | 42.1 |
| 467 | Z-0701 | FLAME ARRESTER | Diesel oil | PASOK | oil-burners | 23.1 |
| 468 | Z-0703A | LUBE OIL & OIL COOLER (PLANT AIR) A | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 26.3 |
| 469 | Z-0703B | LUBE OIL & OIL COOLER (PLANT AIR) B | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 26.3 |
| 470 | Z-0703C | LUBE OIL & OIL COOLER (PLANT AIR) C | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 26.3 |
| 471 | Z-0704A | LUBE OIL & OIL COOLER (INSTRUMENT AIR) A | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 27.3 |
| 472 | Z-0704B | LUBE OIL & OIL COOLER (INSTRUMENT AIR) B | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 27.3 |
| 473 | Z-0704C | LUBE OIL & OIL COOLER (INSTRUMENT AIR) C | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 27.3 |
| 474 | Z-0711A | BLOW-OFF SILENCER (PLANT AIR) A | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 26.5 |
| 475 | Z-0711B | BLOW-OFF SILENCER (PLANT AIR) B | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 26.5 |
| 476 | Z-0711C | BLOW-OFF SILENCER (PLANT AIR) C | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 26.5 |
| 477 | Z-0713A | BLOW-OFF SILENCER (INSTRUMENT AIR) A | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 27.5 |
| 478 | Z-0713B | BLOW-OFF SILENCER (INSTRUMENT AIR) B | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 27.5 |
| 479 | Z-0713C | BLOW-OFF SILENCER (INSTRUMENT AIR) C | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) | 27.5 |
| 480 | Z-0850A | ACTIFLO UNIT 1A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.1 |
| 481 | Z-0850B | ACTIFLO UNIT 1B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.2 |
| 482 | Z-0851A | RO UNIT A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.8 |
| 483 | Z-0851B | RO UNIT B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.8 |
| 484 | Z-0852A | CEDI A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.4 |
| 485 | Z-0852B | CEDI B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.4 |
| 486 | Z-0853 | ACTIFLO UNIT 2 | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.3 |
| 487 | Z-0854A | EVAPORATOR PACKAGE A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.6 |
| 488 | Z-0854B | EVAPORATOR PACKAGE B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.6 |
| 489 | Z-0855 | CRYSTALLIZATION PACKAGE | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.5 |
| 490 | Z-0856 | FILTER PRESS | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.12 |
| 491 | Z-0857 | POLYMER FEEDER UNIT 1 | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.13 |
| 492 | Z-0858 | POLYMER FEEDER UNIT 2 | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.14 |
| 493 | Z-0859A | EYE SHOWER A | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.11 |
| 494 | Z-0859B | EYE SHOWER B | Water treatment / potable | LABAS: WTP (user 11-25) | — | 61.11 |
| 495 | Z-1001/2001 | SILENCER - BOILER DRUM & SOOT BLOWING SYSTEM | Steam silencers | LABAS: mechanical / civil, walang DCS signal | — | 4.6 |
| 496 | Z-1002/2002 | SILENCER - BOILER DRUM | Steam silencers | LABAS: mechanical / civil, walang DCS signal | — | 4.7 |
| 497 | Z-1003/2003 | SILENCER - MAIN STEAM PIPE & BLOW-OFF VALVE | Steam silencers | LABAS: mechanical / civil, walang DCS signal | — | 4.1 |
| 498 | Z-1004/2004 | SILENCER - HOT REHEAT STEAM PIPE | Steam silencers | LABAS: mechanical / civil, walang DCS signal | — | 4.2 |
| 499 | Z-1005/2005 | SILENCER - HOT REHEAT STEAM PIPE & BLOW-OFF VALVE | Steam silencers | LABAS: mechanical / civil, walang DCS signal | — | 4.3 |
| 500 | Z-1006/2006 | SILENCER - HOT REHEAT STEAM PIPE | Steam silencers | LABAS: mechanical / civil, walang DCS signal | — | 4.4 |
| 501 | Z-1007/2007 | SILENCER - AUXILIARY STEAM HEADER | Steam silencers | LABAS: mechanical / civil, walang DCS signal | — | 4.5 |
| 502 | Z-1010/2010 | ESP (ELECTROSTATIC PRECIPITATOR) | Flue gas (ID fan, ESP, stack) | PASOK | furnace-gas | 39.1 |
| 503 | Z-1053/2053 | PAF LUBE OIL COOLER | Air (fans, blowers, air heater) | PASOK | combustion-air | 44.3 |
| 504 | Z-1055A/2055A | DISCHARGE SILENCER - FLUIDIZING AIR BLOWER A | Air (fans, blowers, air heater) | PASOK | combustion-air | 46.3 |
| 505 | Z-1055B/2055B | DISCHARGE SILENCER - FLUIDIZING AIR BLOWER B | Air (fans, blowers, air heater) | PASOK | combustion-air | 46.3 |
| 506 | Z-1056/2056 | HYDRAULIC COUPLING FOR ID FAN | Flue gas (ID fan, ESP, stack) | PASOK | furnace-gas | 43.2 |
| 507 | Z-1057 | STACK (CHIMNEY) | Flue gas (ID fan, ESP, stack) | PASOK | furnace-gas | 40.1 |
| 508 | Z-1094A/2094A | CONTROL VALVE (CV) A | Turbine at generator | PASOK | turbine, turbine-valves, generator | 2.4 |
| 509 | Z-1094B/2094B | CONTROL VALVE (CV) B | Turbine at generator | PASOK | turbine, turbine-valves, generator | 2.4 |
| 510 | Z-1095A/2095A | COMBINED REHEAT VALVE (CRV) A | Turbine at generator | PASOK | turbine, turbine-valves, generator | 2.5 |
| 511 | Z-1095B/2095B | COMBINED REHEAT VALVE (CRV) B | Turbine at generator | PASOK | turbine, turbine-valves, generator | 2.5 |
| 512 | Z-1101/2101 | PHOSPHATE STORAGE TANK | Chemical dosing at sampling | PASOK | sampling | 34.1 |
| 513 | Z-1102/2102 | PHOSPHATE MEASURING VESSEL | Chemical dosing at sampling | PASOK | sampling | 34.2 |
| 514 | Z-1103/2103 | NEUTRAL AMINE STORAGE TANK | Chemical dosing at sampling | PASOK | sampling | 34.3 |
| 515 | Z-1104/2104 | DEAERATOR SILENCER; NEUTRAL AMINE MEASURING VESSEL (item 34.4, parehong tag) | Deaerator | PASOK | feedwater | 14.4 |
| 516 | Z-1105/2105 | HYDRAZINE STORAGE TANK | Chemical dosing at sampling | PASOK | sampling | 34.5 |
| 517 | Z-1106/2106 | HYDRAZINE MEASURING VESSEL | Chemical dosing at sampling | PASOK | sampling | 34.6 |
| 518 | Z-1107A/2107A | PHOSPHATE DOSING PUMP A | Chemical dosing at sampling | PASOK | sampling | 34.8 |
| 519 | Z-1107B/2107B | PHOSPHATE DOSING PUMP B | Chemical dosing at sampling | PASOK | sampling | 34.8 |
| 520 | Z-1108A/2108A | AMINE DOSING PUMP A | Chemical dosing at sampling | PASOK | sampling | 34.9 |
| 521 | Z-1108B/2108B | AMINE DOSING PUMP B | Chemical dosing at sampling | PASOK | sampling | 34.9 |
| 522 | Z-1109A/2109A | HYDRAZINE DOSING PUMP A | Chemical dosing at sampling | PASOK | sampling | 34.10 |
| 523 | Z-1109B/2109B | HYDRAZINE DOSING PUMP B | Chemical dosing at sampling | PASOK | sampling | 34.10 |
| 524 | Z-1110/2110 | LPBV SPARGER (CONDENSER) | Condenser and vacuum | PASOK | condensate | 11.2 |
| 525 | Z-1113A/2113A | CONDENSER WATER BOX VACUUM PRIMING AIR EJECTOR A | Condenser and vacuum | PASOK | condensate | 21.1 |
| 526 | Z-1113B/2113B | CONDENSER WATER BOX VACUUM PRIMING AIR EJECTOR B | Condenser and vacuum | PASOK | condensate | 21.1 |
| 527 | Z-1115A/2115A | BFWP LUBE OIL UNIT A | Boiler feedwater pumps | PASOK | feedwater | 15.6 |
| 528 | Z-1115B/2115B | BFWP LUBE OIL UNIT B | Boiler feedwater pumps | PASOK | feedwater | 15.6 |
| 529 | Z-1119A/2119A | STEAM JET AIR EJECTOR (1ST + 2ND) A | Condenser and vacuum | PASOK | condensate | 3.3 |
| 530 | Z-1119B/2119B | STEAM JET AIR EJECTOR (1ST + 2ND) B | Condenser and vacuum | PASOK | condensate | 3.3 |
| 531 | Z-1119C/2119C | STEAM JET AIR EJECTOR (1ST + 2ND) C | Condenser and vacuum | PASOK | condensate | 3.3 |
| 532 | Z-1119D/2119D | STEAM JET AIR EJECTOR (1ST + 2ND) D | Condenser and vacuum | PASOK | condensate | 3.3 |
| 533 | Z-1120/2120 | START-UP EJECTOR | Condenser and vacuum | PASOK | condensate | 3.1 |
| 534 | Z-1130/2130 | SPARGER (FLASH PIPE) | Condenser and vacuum | PASOK | condensate | 11.5 |
| 535 | Z-1140/2140 | SAMPLING RACK (analyzers at chiller) | Chemical dosing at sampling | PASOK | sampling | 36.1 |
| 536 | Z-1903A/2903A | MAIN STEAM STOP VALVE (MSV) A | Turbine at generator | PASOK | turbine, turbine-valves, generator | 2.3 |
| 537 | Z-1903B/2903B | MAIN STEAM STOP VALVE (MSV) B | Turbine at generator | PASOK | turbine, turbine-valves, generator | 2.3 |
| 538 | Z-1912/2912 | GLAND STEAM CONDENSER DRAIN TRAP | Gland steam | PASOK | turbine-readings, extraction | 2.12 |
| 539 | Z-1930/2930 | DUPLEX OIL FILTER UNIT | Turbine oil | PASOK | turbine-oil | 2.19 |
| 540 | Z-1940/2940 | OIL PURIFIER UNIT | Turbine oil | PASOK | turbine-oil | 2.20 |
| 541 | ZV-AS1001/2001 | SAFETY VALVE - AUXILIARY STEAM TO D/A | Safety valves | PASOK | aux-steam, sootblowers | 6.1 |
| 542 | ZV-BR1001/2001 | SAFETY VALVE - DRUM | Safety valves | PASOK | boiler-steam, reheat | 5.5 |
| 543 | ZV-BR1002/2002 | SAFETY VALVE - DRUM | Safety valves | PASOK | boiler-steam, reheat | 5.6 |
| 544 | ZV-DO1001/2001 | SAFETY VALVE - DIESEL OIL SUPPLY | Safety valves | PASOK | feedwater, oil-burners | 6.5 |
| 545 | ZV-FS1001/2001 | SAFETY VALVE - FLASH TANK | Safety valves | PASOK | feedwater, oil-burners | 6.4 |
| 546 | ZV-FW1001/2001 | SAFETY VALVE - BFP SUCTION | Safety valves | PASOK | feedwater, oil-burners | 6.3 |
| 547 | ZV-FW1002/2002 | SAFETY VALVE - BFP SUCTION | Safety valves | PASOK | feedwater, oil-burners | 6.3 |
| 548 | ZV-HR1001/2001 | SAFETY VALVE - REHEATER OUTLET | Safety valves | PASOK | boiler-steam, reheat | 5.2 |
| 549 | ZV-HR1002/2002 | SAFETY VALVE - REHEATER OUTLET | Safety valves | PASOK | boiler-steam, reheat | 5.3 |
| 550 | ZV-HR1003/2003 | SAFETY VALVE - REHEATER OUTLET | Safety valves | PASOK | boiler-steam, reheat | 5.4 |
| 551 | ZV-MS1001/2001 | SAFETY VALVE - MAIN STEAM LINE | Safety valves | PASOK | boiler-steam, reheat | 5.1 |
| 552 | ZV-SB1001/2001 | SAFETY VALVE - SOOTBLOWER | Safety valves | PASOK | aux-steam, sootblowers | 6.2 |
| 553 | ZV-TS1104/2104 | DEAERATOR SAFETY VALVE | Deaerator | PASOK | feedwater | 14.3 |

## 5. Mga kaugnay na file

- `docs/ACCEPTANCE.md`: ang finish line (Phase 2).
- `docs/PHASES.md`: ang 15 phase at ang estado ng bawat isa.
- `RULES.md`: rules ng user.
- `docs/audit/source-register-2026-11-25.md`: aling drawing ang babasahin ng bawat lane.
- `docs/audit/no-source-list.md`, `docs/audit/snapshot-values-list.md`: mga value na kulang pa ang source.

## Appendix A: Lokasyon ng plant documents (dating docs/DOCUMENT_INDEX.md)


Index ito ng mga pangalan, path at uri lang. **Walang kopya ng plant document dito** (FHI / MHPS / vendor property). Ang mga file ay nasa PC ng user lang. Read-only: huwag ilipat, palitan ang pangalan o burahin ang file ng user.

Ang buong file list (bawat file, may laki) ay nasa PC lang, hindi naka-commit: `document-references/_notes/file-lists/` (`sm-plant.tsv`, `lpdsi-plant.tsv`, `repo-plant.tsv`). Hanapin doon gamit ang grep bago sabihing "wala".

Ang OneDrive ay Files On-Demand: ang pagbukas ng file ay nagda-download nito. Isang file lang bawat bukas; sabihin muna sa user kung malaki (higit 50 MB).

### Mga pinagmulan (roots)

- **REPO** = `icms-master-tool\document-references\` (6,395 file). Detalye: `document-references/INDEX.md`.
- **SMGP** = `C:\Users\Ronanski\OneDrive - San Miguel Global Power\` (109,306 file, company OneDrive). Pinakamalaking source.
- **LPDSI** = `D:\LPDSI Documents\` (40,780 file).
- **OD** = `C:\Users\Ronanski\OneDrive\` (personal OneDrive, nagsi-sync pa: folders pa lang, 1 file noong 2026-11-14 8:30 PM PHT). Plant-related na folder: `Desktop\PDF\TCS Logic`, `Desktop\PDF\NUS` (walang laman pa).

Phase 1 = Unit 1 at 2 (code K1AU3, ito ang LMYP #1). Phase 2 = Unit 3 at 4 (code K3AU2). **Ayon sa user (2026-11-14): pisikal na identical ang Phase 2 sa Unit 1, tag number lang ang iba.** Kaya source din ang Phase 2 para sa sukat, design data, curves at drawing ng equipment; ang tag number, address at logic sheet number ay laging galing sa Phase 1 (K1AU3) at sa LMYP #1 DCS. Ang mga file na may "ML-" sa unahan (folder MHPS EI) ay mukhang Malita / Davao project ng MHPS: gamitin lang bilang check, ang "LM-" ang Limay.

### Pinakamahalagang folder (SMGP)

- `USBTRANSFER\FHI Drawing\PHASE 1\` (2,333 file): buong FHI drawing set ng Unit 1 at 2, ayon sa code:
  - `A1 FLOW DIAGRAM`: K1AU3-A1-0-001 (R0 ~ R5, RA, RB, AS BUILT) at 28 hiwalay na system PDF (01 Main Steam ~ 28 Secondary Air).
  - `A2 Mass Balance`, `A3 Plot Plan & General Arrangement`, `A4 Master Documents` (K1AU3-A4-0-001 master drawing list R0 ~ R41).
  - `B BOILER PRESSURE PARTS` (K1AU3-B-0-001 ~ 008, kasama ang B-0-004 Steam Drum R0 ~ R4), `C BOILER NON PRESSURE PARTS`.
  - `D1 Engineering Data of Mechanical Equipment` (225), `D2 Procuring Specification` (129), `D1-0-105` sea water intake at discharge (233).
  - `E1 Engineer data of electrical equipment` (404, kasama ang **K1AU3-E1-0-102 RD Single Line Diagram**), `E2 Engineering Data of instrument` (85).
  - `P1` piping at manual valve spec, `P2.0 / P2.1 Piping Arrangement` (K1AU3-P2-0-002 R1 ~ R11 Boiler, TG, Utility; P2-0-001 underground sea water; P2-1-001 Unit 1 boiler area), `P3.1 Piping ISO drawing` (Unit 1: P3-1-001 Main Steam R0 ~ R7, P3-1-002 Hot Reheat R0 ~ R7, P3-1-003 Cold Reheat, P3-1-004 HP Feedwater R1 ~ R10, P3-1-005 welding at NDE, P3-1-101 isometrics R0 ~ R13), `P3.2` (pareho para sa Unit 2, kasama ang P3-2-101 R3 Cooling Water Piping), `P4.x` pipe support at stress analysis.
  - `R1` O&M manual K1AU3-R1-0-001 (R0 ~ R14), `R3` procedures (performance test, reliability test, hydrostatic, commissioning guideline K1AU3-R3-0-110, synchronization test).
  - `S1 ~ S4` structural steel (boiler, turbine, pipe rack), `T Tank_Vessel_Silo`, `F / S0` civil at piling, `G / H / K / Z` architecture, HVAC, fire, admin.
  - `Factory Acceptance Results TSI (UNIT 1 & 2).pdf` (252 MB: sabihin muna bago buksan).
- `USBTRANSFER\FHI Drawing\Other AS builts\`:
  - `HITACHI Turbine-Generator\MHPS EI\` (37): turbine steam, gland steam, lube at control oil P&ID; turbine protection logic; TG interlock block diagram 310SC90-774; ATS 775 / 776; setpoint list 778; instrument list 779; one line diagram generator main circuit 310SD03-741; **Generator Protection / Breaker Logic Diagram 310SD03-743**; excitation interlock block diagram GSE-2013-0109; AVR wiring; TCS functional block diagram at elementary diagram. (Prefix "ML-": tingnan ang babala sa itaas.)
  - `HITACHI Turbine-Generator\MHPS Site Test Procedure\` (14), kasama ang excitation system test GEE-2015-0151.
  - `LMYP-1 Complete (From Edmaru)\`: commissioning guideline (46), training documents (45: L01 CFB introduction, L06 boiler pressure / non-pressure parts, L11 TG, L13 bottom ash, L15 SCADA, sea water cooling), MHPS TG shop test at site test reports, generator data sheet, TG installation manual, `Turbine\` (oil accumulators), `MHPS TG RH Training Data\` (plant start-up at shut-down curve XSM-CO-PRJ-187, steam turbine start-up control XSM-CO-PRJ-188, emergency trip device).
- `USBTRANSFER\FHI Drawing\Autocad P&ID\` (1,416 DWG), `Asset Registry\` (valve lists LM-310SD14-322 at 353), at mga folder na FOR APPROVAL / FOR CONSTRUCTION / FOR FINAL / FOR INFORMATION / FOR REVIEW / OTHER EXTERNAL DOCUMENTS (luma o ibang yugto; `Davao Drawing Reference` = ibang planta).
- `USBTRANSFER\something\` (10,047): halos kopya ng FHI Drawing (Autocad P&ID, PHASE 1, FOR ...), dagdag ang General Arrangement, Mass Balance, Engineering Data of Electrical Equipment.
- `USBTRANSFER\transfer\` (997): mga as-built na pinili ng user (boiler pressure / non-pressure parts, structural steel, hydrostatic, asset registry, 2017 IC AS BUILT, general arrangement at plant layout, electrical engineering drawing, cable tray, civil, electrical test procedure, SIGNED AP).
- `E-LIBRARY\` (11,564):
  - `Operation and Maintenance Manuals\PHASE 1\` (9,736 file, 8.2 GB): vendor O&M L1 ~ L37 (mas buo kaysa sa `o&m-package-phase-1` ng REPO). Halimbawa: L7 BFP (performance curve, cross section), L10-1 condensate pump (CEP curve), L16 fans at L14-7 biasing damper, L24-2 auxiliary transformer AVR, L28 motor control damper at emergency diesel generator AVR, gland steam condenser O&M.
  - `Single Line Diagram\` (2 file), `Flow Diagram\` (2), `Turbine Generator\` (12, kasama ang GEE-2015-0152 excitation site test), `Engineering Data of Turbine & Generator\` (74, kasama ang K1AU3-D1-0-015 biasing damper, `valves\`).
  - `CFB\` line tracing (BOP, SG, TG; 1 GB ang TG), `DCS PLC\LMYP-1 #1-DOCUMENT` (650) at `(Hardware)`, `INSTRUMENT LIST`, `INSTRUMENT MAPPING` (boiler, tg, sootblower SLD), `Instrument Conduit Layout`, `Standard Logic Diagram of Breaker`, `Typical Schematic Control Wiring Diagram`, `MH REFERENCES` (coal handling, labas sa scope; may K1AU3E1 / E2 Single Line Diagram sa `MH files\Single Line Diagram\`).
- `PROJECT DCS VIBE\` (486): `LMYP-1 #1-DOCUMENT\Logic Diagram` (407), IO List, Subsystem PLC, hardware 01 ~ 12, `LMYP1 LOOP&USERTAG(new)`.
- `ARCHIVES\DCS TCS\` (969): DCS reference (532), TCS IO LIST, PI PROJECT (kasama ang P39 RH-SH Biasing Damper tags), RTS, AXIS turnover docs.
- `LAPTOP_BACKUP_02062026\DESKTOP\TURN OVER FILES\DCS TCS\TCS\TCS\`: **TCA at TCE SOFT LOGIC DIAGRAM OF TCS.pdf**, `TCS Logic\Soft Logic\TCA.pdf, TCE.pdf`, Generator Logic.pdf, `TCS Logic\Generator Protection.pdf`, LM-310SC90-793 IO list. Malaki rin ang `TCS BACKUP` (27,655) at `DCS Files` (653, DCS procedures, reports gaya ng LPBV trends).
- `LAPTOP_BACKUP_02062026\DESKTOP\E-LIBRARY\` (8,231, 18 GB): lumang kopya ng E-LIBRARY.
- `LAPTOP_BACKUP_02062026\DOCUMENTS\Technical Documentations and Procedures\` (197): procedures, PI graphics (eDNA), U2 biasing damper presentation.

### LPDSI (D drive)

- `LMYP-1 DCS TCS\` (454): loop at user tag lists, `LMYP-1 #1-DOCUMENT\Subsystem PLC\` Modbus lists (nasa app na).
- `LMYP-1 MANUALS\` (10,418) at `DCS FEIL\IC\PLANT REFERENCES\O&M Package\` (V-numbered na kopya ng O&M L-package).
- `DCS FEIL\DCS & TCS\` (DCS 659, TCS 22 na 1 GB), `DCS FEIL\IC\DCS` (3,555), `LMYP-1 PLC` (922), `LMYP PNEUMATICS` (64).

### Hanap ayon sa kailangan (pinakabagong revision muna)

- Single Line Diagram Unit 1: SMGP `USBTRANSFER\FHI Drawing\PHASE 1\E1 ...\E1\K1AU3-E1-0-102 RD Single Line Diagram .pdf`; 460 V SB-11: `E-LIBRARY\INSTRUMENT MAPPING\sootblower diagram\`. Generator main circuit: MHPS EI 310SD03-741.
- Main steam, hot reheat, cold reheat, HP feedwater route (3D): PHASE 1 `P3.1 Piping ISO drawing\` K1AU3-P3-1-001 R7, -002 R7, -003 R0, -004 R10; layout `P2.0` K1AU3-P2-0-002 R11.
- Cooling water / sea water pipe route: `P2.0` K1AU3-P2-0-001 R6 underground sea water; `P3.2 ...\P3\K1AU3-P3-2-101 R3 (2) Cooling Water Piping.pdf` (Unit 2); `D1-0-105` sea water intake; training `01 LIMAY Sea Water Intake & Discharge Cooling System.pdf`.
- Steam drum: PHASE 1 `B BOILER PRESSURE PARTS (B)\K1AU3-B-0-004 R4 Steam Drum.pdf`; as-built sa `transfer\Boiler Pressure Parts\`.
- Biasing damper: `E-LIBRARY\Engineering Data of Turbine & Generator\K1AU3-D1-0-015 R1`, O&M `L16 FANS\L14-7 Biasing damper\`.
- Condensate pump (CEP): O&M `L10-1 Condensate pump\` (performance curve A02, cross section A03 sa LPDSI kopya).
- BFP: O&M `L7 BFP\A Technical Documents\` (performance curve, cross section).
- Excitation / AVR: MHPS EI GSE-2013-0109 (interlock), GSE-2013-0080 (AVR wiring); `E-LIBRARY\Turbine Generator\GEE-2015-0152 R1`; LM-GEE-2015-0152 sa Edmaru site test.
- Turbine start-up: `MHPS TG RH Training Data\XSM-CO-PRJ-187` at `-188`.
- TCS soft logic TCA / TCE: `TURN OVER FILES\DCS TCS\TCS\TCS\`.

### Turbine heat balance at generator data (na-update 2026-11-14)

- Turbine heat balance (MHPS, identical na turbine): Phase 2 `PHASE 2\DRWG FOR PHASE 2\Drawings\486_PPE-14-0725_R1 Heat Balance Diagram.pdf` at `488_PPE-14-0728_R1 Heat Balance Turbine Bypass Operation.pdf`. Sa parehong folder: 487 STG start-up information, 489 heater out of service, 492 ~ 494 aux power / CW / aux steam consumption, 498 CRH at extraction NRV design conditions. Kapareho ng Davao set (`OTHER EXTERNAL DOCUMENTS\Davao Drawing Reference\` PPE-13-0138 R4, TAQ-14-216 correction curves, TAQ-13-252 thermal kit). I-check pa rin laban sa Unit 1 mass balance K1AU3-A2-0-001.
- Generator at exciter (Phase 2 `Drawings\`): 186 brushless exciter outline 310QK06-564, 276 excitation V curves 310SD23-270, 279 / 280 winding thermal capability, 399 description of excitation system DBE-15-0021, 423 brushless exciter curve GAE-2015-0004.
- Wala talaga (user 2026-11-14: ito na ang buong document set): historian / trend data (may LPBV trend PNG lang sa DCS Files\Reports), sectional drawing ng turbine casing.
- Ang personal OneDrive (OD) ay hindi pa tapos mag-sync: hanapin ulit kapag dumating na ang mga file.

## Appendix B: Hardware, instrument at network documents (dating docs/HARDWARE_DOC_INVENTORY.md)


Para sa plant data core ni HANNI (source, path, destination, logic, document ng bawat tag). **Pangalan at path lang, walang kopya.** Lahat ng file ay nasa PC ng user. Buong file list: `document-references/_notes/file-lists/` (PC lang). Pangkalahatang index: `docs/DOCUMENT_INDEX.md`.

Paano basahin:
- Roots: **SMGP** = `C:\Users\Ronanski\OneDrive - San Miguel Global Power\`, **LPDSI** = `D:\LPDSI Documents\`, **REPO** = `icms-master-tool\document-references\`. **FHI1** = `SMGP\USBTRANSFER\FHI Drawing\PHASE 1\`, **FHI2** = `SMGP\USBTRANSFER\FHI Drawing\PHASE 2\`, **MHPS** = `SMGP\USBTRANSFER\FHI Drawing\Other AS builts\HITACHI Turbine-Generator\MHPS EI\`, **HW** = `SMGP\ARCHIVES\DCS TCS\DCS REFERENCE\LMYP-1 #1-DOCUMENT(Hardware)\` (kopya rin sa `SMGP\E-LIBRARY\DCS PLC\` at `SMGP\PROJECT DCS VIBE\`).
- Unit: "U1" = Unit 1, "U1+U2" = isang drawing para sa dalawa, "P2" = Phase 2 (Unit 3 at 4: kakambal ng Unit 1, tag lang ang iba; equipment data lang, hindi tag).
- Revision: galing sa pangalan ng file. Ang pahina ay **hindi pa nabibilang**: ang pagbukas ng OneDrive file ay nagda-download nito, kaya bibilangin lang kapag may thread na kailangan ang file.
- Maraming kopya ang parehong drawing (AUDIT, TURN OVER FILES\DIAGRAMS, `USBTRANSFER\transfer\2017 IC AS BUILT`, `REPO\onedrive-2026-11-07\2017 IC AS BUILT`). Ang nakalista ay ang pinaka-buong kopya; ang "2017 IC AS BUILT" ang may sheet range sa pangalan (hal. "I1-600~671").

### 1. DCS (Formosa) system, cabinets at wiring: K1AU3-E2-0-106 ~ 118 (U1, as-built 2017-10-03)

- `HW\01.System\K1AU3-E2-0-106_20171003.pdf`: DCS system configuration (network ng FCS, COS, GCS). Kopya: FHI1 `E2 ...\AS BUILT\K1AU3-E2-0-106 DCS System Configuration.pdf`, at `K1AU3-E2-0-106~116 Drawing of DCS.pdf` (isang PDF ng 106 ~ 116).
- `HW\02.Layout\K1AU3-E2-0-107_20171003.pdf`: control room at rack room layout (kasama ang FHI1 `AS BUILT\K1AU3-E2-0-107 DCS Control Room Rack Room Layout.pdf`).
- `HW\03.Ground\K1AU3-E2-0-108_20171003.pdf`: DCS grounding.
- `HW\04.FCS\K1AU3-E2-0-109_20171003.pdf`: FCS cabinet layout.
- `HW\05.COS\K1AU3-E2-0-110_20171003.pdf`: operator station (COS).
- `HW\06.PDP\K1AU3-E2-0-111_20171012.pdf`: power distribution panel (DCS power, 24 VDC / 110 VAC feed).
- `HW\07.SER\K1AU3-E2-0-112_20171003.pdf`: sequence of events recorder.
- `HW\08.ANP\K1AU3-E2-0-113_20171003.pdf`: annunciator panel.
- `HW\09.ARPIRP\K1AU3-E2-0-114_20171003.pdf`: ARP / IRP (auxiliary at interposing relay panels).
- `HW\10.GCS\K1AU3-E2-0-115_20171003.pdf`: gateway (GCS) sa package PLC.
- `HW\11.MPL\K1AU3-E2-0-116_20171003.pdf`: marshalling (MPL).
- `HW\12.Wiring\`: `K1AU3-E2-0-117 FCS WIRING_20171003.pdf`, `K1AU3-E2-0-117 IRP_ARP_SER_20171003.pdf`, `LMYP-1(#1) WIRING.xls` (original, ang kasalukuyan), `LMYP-1(#1) IRP_ARP_SER.xls`, `LMYP WIRING.xls`, `Copy of LMYP-1(#1) WIRING.xls` (luma, 2022-08-23).
- K1AU3-E2-0-118 DCS IO Assignment / Input Output List: FHI1 `E2 ...\AS BUILT\K1AU3-E2-0-118 DCS Input Output List.pdf` (2017 copy: "(I0-003)"). Excel: `REPO\dcs-io-list.xls`, TCS: `REPO\iolist-tcs.zip`.
- Specification ng DCS: FHI1 `E2 ...\E2 NON AS-BUILTS\K1AU3-E2-0-001-RA Specification of DCS.pdf`.
- Wiring sa repo: `REPO\dcs-hardware-wiring.zip` (system, PDP, SER, ARP / IRP, MPL, FCS).
- P2: **walang** K3AU2-E2-0-106 ~ 118 set sa PC (may E2-0-107 rack room layout lang, FHI2 `(E2) ...\E2 K3AU2-E2-0-107 ...`, 5 file).

### 2. I/O card list at module

- `SMGP\LAPTOP_BACKUP_02062026\DESKTOP\TURN OVER FILES\DCS TCS\DCS Files\DCS References\IO Card.xlsx`.
- `REPO\other-references.zip` → `io-card-hardware.xlsx`, `dcs-reference-others.xls`.
- `IO Module SOP.pdf`, `DCS IO Module SOP.pdf`, `IPU3 IO Module Test SOP.ppt` (DCS Files at REPO tcs-references).
- Memory list ng STN101 ~ 105: `REPO\memory-list-101.xls` ~ `105.xls`. Loop / user tag: `LPDSI\LMYP-1 DCS TCS\LMYP1 LOOP&USERTAG(new)\`.

### 3. Instrument loop diagrams

- K1AU3-E2-0-104 #1 at #2 Instrument Loop Diagram (U1, U2): FHI1 `E2 Engineering Data of instrument\AS BUILT\K1AU3-E2-0-104 #1 Instrument Loop Diagram.pdf` (2017 copy: "(I1-020A)").
- Package loop diagram (CEMS / analyzer package K1AU3-D1-0-062): `LPDSI\DCS FEIL\IC\DCS\DCS\FHI MASTER DOCUMENTS\D1 ...\K1AU3-D1-0-062 R0\...\6.EICA\139LMYP-1-R3-001 Instrument Loop Diagram-Rev.0.pdf`.
- P2: FHI2 `(E2) ...\E2 K3AU2-E2-0-104 Instrument Loop Diagram\` (2 file: cover at drawing list lang, walang drawing). Water treatment P2: FHI2 `Water Treatment Drawing\145. LMYP-2-R3-001~014-r2 Instrument Loop Diagram.pdf`.

### 4. Instrument wiring at termination (JB schedule)

- K1AU3-E2-0-202 #1 / #2 Instrument Wiring Diagram (U1, U2): FHI1 `E2 ...\AS BUILT\K1AU3-E2-0-202 #1Instrument Wiring Diagram.pdf` (2017 copy: "(I1-010A)").
- P2: FHI2 `(E2) ...\E2 K3AU2-E2-0-202 Instrument Wiring Diagram\` (2 file).
- JB termination schedule halimbawa (U2 lang, training): `LPDSI\DCS FEIL\IC\PLANT REFERENCES\Metrologyx Training\...\4.4. Junction Box Wiring Termination Schedule\` (9 file, U2-JBAI-001 ...).

### 5. Hook-up at installation

- K1AU3-E2-0-101 Instrument Hook-Up Drawing: FHI1 `E2 ...\AS BUILT\K1AU3-E2-0-101 Instrument Hook-Up Drawing.pdf`; R0 sa `E2 NON AS-BUILTS\`.
- Package hook-up: `...\K1AU3-D1-0-062 R0\...\6.EICA\135LMYP-1-R7-001~027_Instrument Hook-Up Drawing_Rev_0.pdf` (LPDSI).
- P2: FHI2 `(E2) ...\E2 K3AU2-E2-0-101 Instrument Hook-Up Drawing\PDF\01-K3AU2-E2-0-101 Instrument Hook-Up Drawing.pdf`.

### 6. Junction box, stanchion, local control panel

- K1AU3-E1-0-108 Instrument Stanchion & Junction Box Drawing: FHI1 `E2 ...\` at `E1 ...\06-K1AU3-E1-0-108 Instrument Stanchion & Junction Box Drawing\` (LCP / JB detail). 2017 copy: "(IO-099~098) Junction Box Installation Drawing".
- Turbine JB list (P2, MHPS): FHI2 `DRWG FOR PHASE 2\Drawings\397_7M2WA04-372_R2 Local Junction Box List (Turbine Portion).pdf`, `370_3244R845001_R1 Terminal Box.pdf`.
- P2: FHI2 `(E2) ...\E2 K3AU2-E1-0-108 Instrument Stanchion & JB Drawing\` (9), `(E1) ...\02_K3AU2-E1-0-108_Maintenance Panel & Local Control Panel Drawing\` (15 CAD). U1 maintenance / local panel: `SMGP\E-LIBRARY\Maintetance Panel & Local Control Panel Drawing\` (1).
- Vendor JB: BFP `L7 BFP\B Junction Box Drawing & Manual\`, fluidizing air blower `L10-5 ...\500-0dv - Junction box REV03`.

### 7. Cable schedules at cable lists

- TCS: MHPS `(ML-TEQ-14-197 RB)-Cable from_ to List for Turbine Control System (FR).pdf` ("ML-" = Malita, kambal na MHPS project; check lang).
- Connection wiring (cable from / to) ng FHI, U1 + U2: `SMGP\E-LIBRARY\MH REFERENCES\MH files\Electrical Connection Wiring Diagram\` at FHI1 `E1 ...\`: `K1AU3E1-6003A-1 HV`, `6003B-1 LV`, `6003C-1 TG Connection Wiring Diagram.xlsb` (Unit 1), `K1AU3E2-6003A/B/C-1` (Unit 2), `K1AU3E0-6003-1 RCP`, `6003B-1 Water Treatment`, `6003C-1 Coal Handling`.
- Coal handling: `K1AU3U02-D-I03 Instrument cable schedule.pdf`, `D-E09 Power Cable Schedule.pdf` (`SMGP\E-LIBRARY\MH REFERENCES\CHS Drawings of Limay Power Plant\`; labas sa scope).
- Cable tray: FHI1 `E1 ...\K1AU3-E1-0-123 R2 Cable Tray Layout Drawing.pdf`, `141.LMYP-1-R2-001_r1_Instruments Wiring & Cable Tray Layout.pdf`; P2 `(E1) ...\06_K3AU2-E1-0-123_Cable Tray Layout Drawing\` (241 CAD).
- **Wala:** hiwalay na instrument cable schedule ng main plant DCS (K1AU3-E2) bilang listahan. Ang cable data ay nasa E2-0-202 wiring diagram at sa `LMYP-1(#1) WIRING.xls`.

### 8. Instrument list at data sheets

- K1AU3-E2-0-201 Instrument List: FHI1 `E2 ...\AS BUILT\K1AU3-E2-0-201 Instrument List.pdf`; Excel `REPO\over-all-instrument-list.xlsx`; calibration list `SMGP\E-LIBRARY\INSTRUMENT LIST\` (4).
- Specifications K1AU3-E2-0-001 ~ 020 (DCS, MOV, control valve, CEMS at O2, flow nozzle, pitot / orifice, drum level gauge, transmitter, TE / TT, gauges, switches, level, solenoid, condensate pot, butterfly CV, purge set): FHI1 `E2 ...\E2 NON AS-BUILTS\`.
- Drawings K1AU3-E2-0-122 ~ 143 (MOV, CV, CEMS, sampling rack, pitot, orifice, CCTV, drum level gauge, radar LT, electrode LS, reflex LG, PG, PS, TG, thermocouple, transmitter, sight glass, solenoid, condensate pot, control damper, purge set): FHI1 `E2 ...\`. Mas detalyado: `REPO\instrument-engineer-data-asbuilt\`.
- Turbine: MHPS `(ML-310SC90-779 R0)-Instrument List For Turbine And Generator`, `(ML-310SC90-771 R0)-Measuring List`, `(ML-310SC90-778 R0)-Setpoint List`.
- P2: FHI2 `(E2) ...\E2 K3AU2-E2-0-201 Instrument List\` (4).

### 9. Instrument location at conduit layout

- K1AU3-E2-0-102 Instrument Location Plan: #1 Boiler, #2 Boiler, TG, Utility (FHI1 `E2 ...\AS BUILT\`; 2017 copy may sheet range).
- K1AU3-E2-0-103 Instrument Conduit Layout (FHI1 `E2 ...\`), at `SMGP\E-LIBRARY\Instrument Conduit Layout\` (58: k1au3e1-2301 index, 2304a/b Turbine House Unit 1 ground floor ...).
- K1AU3-E2-0-105 Instrument Air System.
- Turbine: MHPS `(ML-7M2DA30-533 / 534 / 535 R1)-Arrangement Of Measuring Point And Instrument` (ground, mezzanine, operating floor).
- `SMGP\E-LIBRARY\INSTRUMENT MAPPING\` (boiler, tg, pdf, sootblower: 62).
- P2: FHI2 `(E2) ...\E2 K3AU2-E2-0-102 Instrument Location Plan\` (154), `E2-0-105` (3).

### 10. Power para sa control system (UPS, DC, 24 VDC, 110 VAC)

- UPS: FHI1 `E1 ...\E1\K1AU3-E1-0-110 RC Drawing of of UPS System.pdf`; spec `K1AU3-E1-0-004-RA Specification of UPS system.pdf`.
- DC charger at battery: `K1AU3-E1-0-111 R0 Drawing of DC Charge System.pdf`; spec `K1AU3-E1-0-005-RA`.
- DCS power distribution: `HW\06.PDP\K1AU3-E2-0-111_20171012.pdf`.
- 125 VDC EOP starter: `SMGP\E-LIBRARY\Turbine Generator\` / FHI1 E1 `GSE-2013-0091 R1 WIRING DIAGRAM OF 125V DC MOTOR STARTER FOR EOP.pdf`.
- Single line diagram: FHI1 `E1 ...\E1\K1AU3-E1-0-102 RD Single Line Diagram .pdf`.
- **Wala:** hiwalay na 24 VDC / 110 VAC distribution schedule bukod sa PDP drawing.

### 11. MCC interface at motor control schematics

- FHI1 `E1 ...\E1\K1AU3-E1-0-120 RA Elementary & Schematic Drawing.pdf` (U1 + U2).
- `SMGP\E-LIBRARY\Typical Schematic Control Wiring Diagram\` (1), `SMGP\E-LIBRARY\Standard Logic Diagram of Breaker\` (1).
- LV MCC: FHI1 `E1 ...\AS BUILT\K1AU3-E1-0-107 Drawing of LVMCC panel.pdf`; spec `K1AU3-E1-0-003-RA Specification of HVLV MCC.pdf`. HBT panel `K1AU3-E1-0-109`, 230 kV RCP `K1AU3-E1-0-105`.
- P2: FHI2 `(E1) ...\04_K3AU2-E1-0-120_Typical Schematic Control Wiring Diagram\` (53 CAD), `10_K3AU2-E1-0-128_Standard Logic Diagram of Breaker\` (24 CAD).

### 12. TCS, TSI, generator panels (GCP / GPP), AVR

- TCS (MHPS, prefix ML- = Malita twin): `(ML-TC-13-100 R0)-Basic Configuration of TCS`, `(ML-TC-13-163 R0)-Wiring Configuration of TCS Cabinet`, `(ML-TEQ-14-193 R1)-Elementary Diagram of TCS`, `(ML-331DM07730 R0)-Functional Block Diagram of TCS`, `(ML-331DM07737 R0)-Communication List`, `(ML-PCE-13-0104 R0)-Main Control System Configuration`, `(ML-PEE-13-0191 R0)-Typical Schematic Diagram for Interface`, `(ML-310SC90-773 R1)-IO List Between Customer And MHPS`, `(ML-310SD14-370 R3)-Turbine Wiring Diagram`, `(ML-310SD14-314 R2)-Turbine Local Control Diagram`. Limay version: `REPO\tcs-references\` (`LM-310SC90-793 R2` IO list, `TCS Elementary Diagram(TC).pdf`, `New Turbine Wiring Diagrams SD14370-R4.pdf`, IBD SC90794-R2).
- TSI: MHPS `(ML-TEQ-14-195 R3)-Elementary Diagram Of TSI`; FHI1 `Factory Acceptance Results TSI (UNIT 1 & 2).pdf` (252 MB: sabihin muna bago buksan); P2 `Drawings\375_331DM10713_R1 Elementary Diagram of TSI`.
- Generator panels: `SMGP\E-LIBRARY\Turbine Generator\GSE-2013-0068 R1 OUTLINE OF GEN. PROTECTION PANEL, GEN CONTROL AND METERING PANEL.pdf`, `GSE-2013-0083 R3 WIRING DIAGRAM ...`, `GSE-2013-0085 R2 WIRING DIAGRAM OF VT & SA CUBICLE.pdf`; site tests `GEE-2015-0141` (GCP), `-0143` (neutral grounding), `-0173` (protection relay panel). MHPS: `(ML-GSE-2014-0018 R0)-Setting List of Gen. Protection Panel, Gen. Control Panel`, `(ML-310SD03-743 R1)-Generator Protection_Breaker Logic Diagram`, `(ML-310SD18-193 R4)-Generator Wiring Diagram`.
- AVR / excitation: MHPS `(ML-GSE-2013-0080 R0)-Wiring Diagram Of AVR Cubicle`, `(ML-GSE-2013-0109 R1)-Interlock Block Diagram For Excitation System`.
- Babala: ang `3862-O&M-LYMP-TCS.pdf` sa O&M V18-3 ay **Tube Cleaning System** ng condenser, hindi turbine control.

### 13. SCADA at package PLC (Modbus)

- `SMGP\ARCHIVES\DCS TCS\DCS REFERENCE\LMYP-1 #1-DOCUMENT\Subsystem PLC\`: `LMYP-1 #1-Communication list between DCS and package.xls` (IP ng GCS) at bawat package: Turbine, SCADA, ESP, Fly Ash, CTCS, Coal Handling, Water Treatment, Air Compressor (IA / PA), Air Dryer (IA / PA). Bawat isa: `DVOP_LMYP-MODBUS_TCPIP COMMUNICATION For <package>.doc` + `IO List\...MODBUS Communication list ....xls` + communication test PDF. Kopya: `LPDSI\DCS FEIL\DCS & TCS\DCS\Subsystem PLC\`.
- Package PLC hardware: `LPDSI\LMYP-1 PLC\` (922: MH, SU hopper electrical manual at cable list), `LPDSI\DCS FEIL\IC\MH\MH PLC wiring diagram and Network\`, `SMGP\E-LIBRARY\MH REFERENCES\MH PLC wiring diagram and Network\` (10). Vendor O&M (sa `SMGP\E-LIBRARY\Operation and Maintenance Manuals\PHASE 1\`): L15 SCADA (training `L15 SCADA.pdf`), ESP, ash, air compressor.
- SCADA system drawing: FHI1 `E1 ...\K1AU3-E1-0-112 Drawing of SCADA System.pdf`, spec `K1AU3-E1-0-006`; vendor O&M `L23-2 & L23-3`.

### 14. Network at communication

- DCS network: `HW\01.System\K1AU3-E2-0-106` (system configuration), `HW\10.GCS\K1AU3-E2-0-115` (gateways).
- K1AU3-E2-0-204 Office Information Network (FHI1 `E2 ...\AS BUILT\`; 2017 copy "(I0-401~413)").
- P2: FHI2 `(E2) ...\E2 K3AU2-E2-0-204 Communication System Layout Diagram\` (5).
- CCTV, IP PBX, door access (K1AU3-E1-0-129), fire alarm (E1-0-118): FHI1 `E2 ...\`.
- TCS ↔ DCS: MHPS `(ML-331DM07737 R0)-Communication List`.
- **Wala bilang hiwalay na drawing:** FL-NET, V-net o "Information LAN" diagram; ang DCS network ay nasa E2-0-106 at E2-0-115 lang.

### 15. Grounding at earthing

- DCS: `HW\03.Ground\K1AU3-E2-0-108_20171003.pdf`.
- Plant: FHI1 `E1 ...\E1\K1AU3-E1-0-119-RB Grounding And Lightning Layout Drawing.pdf`, calculation `K1AU3-E1-0-301 RB`, index `k1au3e0-1001-9 Drawing Index for Grounding.pdf`.
- Generator neutral grounding cubicle: `GEE-2015-0143 R2` site test.
- P2: FHI2 `(E1) ...\03_K3AU2-E1-0-119_Grounding & Lightning System Drawing\` (41 CAD).

### 16. Electrical power system: switchgear, MCC, transformers, protection, metering (U1 + U2)

Lahat sa FHI1 `E1 Engineer data of electrical equipment\` (`E1\` o `AS BUILT\`), pinakabagong revision muna:
- K1AU3-E1-0-102 Single Line Diagram (RD), K1AU3-E1-0-104 230 kV one bay breaker, -105 230 kV RCP panel, -106 6.9 kV power system (MV switchgear), -107 LV MCC panel, -109 HBT high speed transfer panel, -110 UPS, -111 DC charger, -112 SCADA system, -113 transformer, -114 bus duct, -115 generator main circuit breaker (GMCB), -116 real time record (fault recorder), -120 elementary at schematic, -131 6.6 kV soft starter, -103 emergency diesel generator.
- Specifications: -003 HV / LV MCC, -004 UPS, -005 DC, -006 SCADA, -007 transformer, -008 bus duct.
- 460 V sootblower bus: `SMGP\E-LIBRARY\INSTRUMENT MAPPING\sootblower diagram\1TNR003746D1006 SLD for UNIT 1 460V SYSTEM SB-11.pdf`.
- Generator protection at metering: tingnan ang seksiyon 12 (GSE-2013-0068 / 0083 / 0085, ML-GSE-2014-0018 setting list, ML-310SD03-741 one line, -743 protection / breaker logic).
- Vendor O&M (`SMGP\E-LIBRARY\Operation and Maintenance Manuals\PHASE 1\`): `L23-1 AIS, BUS DUCT, GMCB, MV & LV, RCP & TR & VFD`, `L23-2 & L23-3 UPS, HBT, FTR, SCADA, SOFT STARTER, CTTS`, `L24-1 Main transformer`, `L24-2 Auxiliary transformer` (AVR), `L28 Motor control damper, EDG` (ABB Emax ACB), `L22 DCS`, `L27 Instrument` (14 vendor), `L26 CEMS`.
- P2 relay settings: FHI1 `E1 ...\K3AU2-E0-7010A-0 U3 Protection Relay Setting Table For 460V.pdf` (at 7010B U4).
- **Meron (Units 1-4 magkakambal):** K3AU2-E0-7010A/B 460 V relay setting, 7011A/B MV calculation, 7012A/B; tingnan ang "Ikalawang hanap".

### Hop by hop: alin ang may dokumento

- Field device: oo (E2-0-201 instrument list, E2-0-001 ~ 020 spec, E2-0-122 ~ 143 drawing, MHPS 310SC90-779).
- Lokasyon at conduit: oo (E2-0-102, E2-0-103, E-LIBRARY Instrument Conduit Layout, MHPS 7M2DA30-533 ~ 535).
- JB / LCP / stanchion: oo (E1-0-108); turbine JB list P2 lang (7M2WA04-372).
- Cable: bahagi (E2-0-202 wiring, E1 / E2 6003 connection wiring xlsb para sa HV, LV, TG, RCP; ML-TEQ-14-197 TCS cable list). Walang hiwalay na DCS instrument cable schedule.
- Marshalling / IRP / ARP / SER: oo (E2-0-114, -116, -117 at mga WIRING.xls).
- Cabinet / card / channel: oo (E2-0-109 FCS, E2-0-117 FCS wiring, IO Card.xlsx, io-card-hardware.xlsx).
- Address / tag: oo (E2-0-118 IO list, dcs-io-list.xls, memory lists, LOOP / USERTAG, TCS IO list LM-310SC90-793).
- Tumatanggap na system: DCS (E2-0-106), TCS / TSI (MHPS TC-13-100, TEQ-14-193 / 195), GCP / GPP (GSE-2013-0068 / 0083), AVR (GSE-2013-0080), SCADA (E1-0-112, Modbus list), package PLC (Modbus lists bawat package), switchgear at MCC (E1-0-106 / 107 / 120).
- Power ng control system: oo (E1-0-110 UPS, -111 DC, E2-0-111 PDP).
- Network: bahagi (E2-0-106, E2-0-115, E2-0-204, ML-331DM07737). Walang hiwalay na FL-NET / V-net drawing.
- Grounding: oo (E2-0-108 DCS, E1-0-119 plant).

### Ikalawang hanap (2026-11-14 gabi): nakita na ang 5 dating "wala"

Batayan: magkakambal ang Units 1, 2, 3 at 4 (user 2026-11-14). Valid ang dokumento ng kahit anong unit para sa Unit 1 hardware; tag at address laging galing sa Unit 1. Hinanap ang buong `SMGP\LAPTOP_BACKUP_02062026` (55,227 files, nag-iisang laptop backup sa OneDrive), Teams Chat Files, at loob ng 1,833 zip sa `LPDSI`.

#### 1. Relay setting table (MV / LV)

- `SMGP\USBTRANSFER\FHI Drawing\PHASE 1\E1 Engineer data of electrical equipment\Electrical Engineering Drawing\`: K3AU2-E0-7010A-0 U3 Protection Relay Setting Table For 460V, K3AU2-E0-7010B-0 (U4), K3AU2-E0-7011A-0 U3 Calculation Sheets For MV System, K3AU2-E0-7011B-0, K3AU2-E0-7012A-0, K3AU2-E0-7012B-0
- Generator protection: `Other AS builts\HITACHI Turbine-Generator\MHPS EI\(ML-GSE-2014-0018 R0)-Setting List of Gen. Protection Panel, Gen. Control Panel (FF).pdf`; P2 `419_DBE-16-0138_R1`
- Unit 1 suporta: `E1\K1AU3-E1-0-304 RA Calculation for short circuit`, `-307 RA voltage dip of large motor starting`, `-302 RA load schedule`
- Tala: walang K1AU3 file na "relay setting" ang pangalan (wala ang E1-0-305 / 306 sa set). Binuksan ang `L23-1 ...\4.MV\LIMAY MV OPERATION & MAINTENANCE GUIDE-20141209.docx`: maintenance lang, walang setting.

#### 2. Instrument at power cable schedule

- `SMGP\E-LIBRARY\MH REFERENCES\CHS Drawings of Limay Power Plant\`: K1AU3U02-D-I03 Instrument cable schedule, K1AU3U02-D-I05 Instrument Connection List, K1AU3U02-D-E09 Power Cable Schedule
- `SMGP\E-LIBRARY\MH REFERENCES\MH Phase 2\`: instrument\K3AU2U02-D-I03 R0 Instrument Cable Schedule, electrical\K3AU2U02-D-E06 R0 Power Cable Schedule
- `SMGP\USBTRANSFER\FHI Drawing\PHASE 2\DRWG FOR PHASE 2\Drawings\572_TRE-16-006_R6 Cable List for Limay Phase 2.pdf` (TG)
- `SMGP\LAPTOP_BACKUP_02062026\DESKTOP\TURN OVER FILES\DIAGRAMS\K1AU3U02-D-I05 Instrument  Connection List (Wiring List).pdf`
- U2 JB at marshalling termination schedule: `LPDSI\DCS FEIL\IC\PLANT REFERENCES\Metrologyx Training\FOR METROLOGYX TRAINEES (NC-II Module-2)\4. LOOP CHECKING\4.4 Junction Box Wiring Termination Schedule\` at `\4.5 Marshalling Cabinet Wiring Termination Schedule\`

#### 2b. DCS instrument cable schedule (boiler + TG): nasa WIRING workbook

Ang `LMYP-1(#1) WIRING.xls` mismo ang cable schedule. May column na CABLE NO, CABLE SPEC, CABLE CORD1 / 2, CROSS CABLE, CROSS CABLE SPEC, JB-NO., MJB-NO., MJB-PAN, IO TBNO, TBNO2, EBTB (field device, JB, MJB / marshalling, IO terminal). Binuksan ang local copy sa D (walang download).

- `LPDSI\DCS FEIL\IC\DCS\DCS\PLC\LMYP-1 #1-DOCUMENT(Hardware)\12.Wiring\Copy of LMYP-1(#1) WIRING.xls`
- `LPDSI\DCS FEIL\DCS & TCS\DCS\Wiring Diagrams\LMYP-1\#1\LMYP-1(#1) WIRING_v0_20161121(曾至豪修改).xls` (U1)
- `LPDSI\DCS FEIL\DCS & TCS\DCS\Wiring Diagrams\LMYP-1\#2\LMYP-1(u2) WIRING_v0_20161107.xls` (U2)
- `...\#1\試車期間吹管結線資料(試車完刪除)\LMYP-1(#1) WIRING_v0_for吹管用` AI / DI / DO pdf at xls (pansamantalang wiring sa blow-out)
- OneDrive: `SMGP\ARCHIVES\DCS TCS\DCS REFERENCE\LMYP-1 #1-DOCUMENT(Hardware)\` at `SMGP\LAPTOP_BACKUP_02062026\DESKTOP\TURN OVER FILES\DCS TCS\DCS Files\Wiring Diagrams\LMYP-1\`

#### 2c. Electrical to DCS / TCS / GCP cable schedule: 6003 set

Header ng sheet: Equipment, Tag No., Terminal No., Cable Code, TB Strip, Function, Type, CWD Type (hal. #1 TCS-7, #1 GCP-I8-1, M-1941-C6).

- U1: K1AU3E1-6003A-1 HV, K1AU3E1-6003B-1 LV, K1AU3E1-6003C-1 TG. U2: K1AU3E2-6003A / B / C-1. Common: K1AU3E0-6003-1 RCP / HBT, -6003B-1 water treatment, -6003C-1 coal handling
- `SMGP\USBTRANSFER\FHI Drawing\PHASE 1\E1 Engineer data of electrical equipment\Electrical Connection Wiring Diagram\` at `LPDSI\LMYP-1 PLC\PLC References\MH\MH1 Drawings and Layouts\Electrical Connection Wiring Diagram\`
- TCS: MHPS EI `(ML-TEQ-14-197 RB)-Cable from_ to List for Turbine Control System`; TG: `(ML-TRE-14-010 R4)-Cable List For Malita` (kambal), P2 `572_TRE-16-006_R6`
- Water treatment package: `LPDSI\...\K1AU3-D1-0-062 R0\Document for Construction Rev. 0\6.EICA\140LMYP-1-E2-001 Cable Connection List-Rev_0.pdf`; P2 `146. LMYP-2-E2-001-r2_Cable Connection List.pdf`

#### 3. 24 VDC / 110 VAC distribution

- `SMGP\LAPTOP_BACKUP_02062026\DESKTOP\E-LIBRARY\DCS PLC\LMYP-1 #1-DOCUMENT(Hardware)\06.PDP\K1AU3-E2-0-111_20171012.pdf`
- `SMGP\USBTRANSFER\something\♠FOR INFORMATION♠\Engineering Data of Instrument\K1AU3-E2-0-106~117 Hardware\07.PDP\PDP_20150626.pdf`
- `SMGP\ARCHIVES\DCS TCS\RTS\ASSET POLICY\Asset Policy DCS\11. Power Distribution Panel (RED).xlsx`
- `...\TURN OVER FILES\INVENTORY\DCS & HMI\DCS FCS\PDP.xlsx`
- MH: K1AU3U02-D-E07 Power distribution panel; P2 K3AU2U02-D-E11 R0 Power Distribution System of Local Panel
- UPS / DC: `E-LIBRARY\Operation and Maintenance Manuals\PHASE 1\L23-2 & L23-3 ...\1.UPS`, `\3.DC Charger`; E1-0-302 load schedule

#### 4. Control network / LAN

- `SMGP\LAPTOP_BACKUP_02062026\DOCUMENTS\Technical Documentations and Procedures\LIMAY1 DCS - Updated Network Diagram.pdf` at `LIMAY2 DCS - Updated Network Diagram.pdf` (kopya rin sa `SMGP\Microsoft Teams Chat Files\`)
- `...\K1AU3-E2-0-106~117 Hardware\02.UTILITY\System_Ethernet_Layout_20150626.pdf`
- `...\TURN OVER FILES\DIAGRAMS\K1AU3-E2-0-204(I0-401~413) Office Information Network.pdf`
- `...\TURN OVER FILES\DCS TCS\XSML#2 Network Diagram.pdf`
- `SMGP\E-LIBRARY\DCS PLC\Fiber Optic Network Limay-1-2 asbuild.xlsx`
- E1-0-129 Communication System Layout Diagram
- FL-net card firmware at driver: `LPDSI\DCS FEIL\IC\PLANT REFERENCES\CX產品使用之FLnet PCI更新\`

#### 5. DCS hardware set E2-0-106 ~ 118

- Unit 1 as-built 2017: `SMGP\LAPTOP_BACKUP_02062026\DESKTOP\E-LIBRARY\DCS PLC\LMYP-1 #1-DOCUMENT(Hardware)\01.System ... 12.Wiring\` (E2-0-106 System, -107 Layout, -108 Ground, -109 FCS, -110 COS, -111 PDP, -112 SER, -113 ANP, -114 ARPIRP, -115 GCS, -116 MPL, -117 FCS WIRING at IRP_ARP_SER). Kopya sa `DESKTOP\E-LIBRARY\DCS Reference\` at sa zip `LPDSI\LMYP-1 DCS TCS\LMYP-1 #1-DOCUMENT.zip`
- Unit 1 2015 set: `SMGP\USBTRANSFER\something\♠FOR INFORMATION♠\Engineering Data of Instrument\K1AU3-E2-0-106~117 Hardware\01.BASE ... 13.Wiring\`
- P2: `...\TURN OVER FILES\DCS TCS\K3AU2-E2-0-114_20190128 SECURED.pdf`, P2 E2-0-107 rack layout, P2 E2-0-118 DCS IO list folder (sa ilalim ng `E2 K3AU2-E2-0-119 Analog Control Logic Diagram\`), Unit 2 CES config backup `...\DCS TCS\UNIT 2 CES BACKUP\LMP2-101 ~ 104`

#### Bago rin galing sa laptop backup

- `...\DESKTOP\TURN OVER FILES\DIAGRAMS\`: E2-0-101 hook-up, E2-0-102 location plans, E2-0-104 loop diagram #1 / #2, E2-0-105 instrument air, E2-0-107 rack room, E2-0-118 IO list, E2-0-201 instrument list, E2-0-202 wiring #1 / #2, E1-0-108 JB installation, MPW34021 LIMAY_SCADA_C1-20150610, Instrument List.xlsx, Instrument Conduit Layout (U2 as-built k1au3e2-2304 ~ 2324)
- `...\TURN OVER FILES\DCS TCS\DCS Files\`: IO Card.xlsx, IO List\LMYP-1 #1_IO_Rev.1, Loop Test Report, DIGITAL INTERLOCK LIST-20160111.xls, GCS\LMYP-1 #1-Memory for Sub_System PLC MODBUS.xls, DCS References\DCS Hardware (英文).pdf
- `...\TURN OVER FILES\INVENTORY\DCS & HMI\` at `DCS Inventory Compilation\`: FCS, PDP, SER, ARPIRP, GCS, DCS ROOM xlsx; SCADA IO.xlsx, SCADA RTU Material Specs

### Natitirang tala

- Bilang ng pahina ng bawat PDF: hindi binuksan (nagda-download ang OneDrive file).
- Personal OneDrive (`C:\Users\Ronanski\OneDrive\`) 1 file pa lang ang naka-sync: i-scan ulit pag tapos na.
