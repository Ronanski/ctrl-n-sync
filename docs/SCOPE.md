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
| Equipment list | K1AU3-L1-0-002 | **R0 (2016-08)** laban sa RA (2014-03); tingnan ang seksyon 4 | Seksyon 4 |
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

**Paano sinuri (2026-11-25 ~7:20 PM PHT):** binasa ang dalawang file sa PC (`document-references/Equipment List/`). Ang **R0 (2016-08-17, 35 pahina) ang mas bago at masusunod**, pero scan ito na walang text layer: walang OCR tool sa cloud, kaya hindi pa nababasa nang isa-isa. Ang listahan sa ibaba ay mula sa text layer ng **RA (2014-03-21, 37 pahina, "For Information")**; inayos ng kamay ang mga tag na nasira ng OCR (hal. "l" na dapat "1").

**Bilang:** **182 equipment tag** sa RA (hindi 173: ang dating "173" ay walang source at hindi tugma sa dokumento). PASOK 126, LABAS 56 (38 air compressor / dryer at WTP, 18 mechanical / civil). Ang listahan ay ng FHI scope lamang: ang turbine, generator at TCS (MHPS / Hitachi) ay wala rito at nasa seksyon 2.

**Kulang pa (para sa Phase 1 na TAPOS):** (a) basahin ang R0 pahina por pahina at itala ang pagkakaiba sa RA; (b) ang "Page sa app" ay sistema ng page; hindi pa nasusuri na may sariling simbolo ang bawat equipment sa page (Phase 9).

| # | Tag (Unit 1 / Unit 2) | Equipment | Sistema | Saklaw | Page sa app |
|---|---|---|---|---|---|
| 1 | B-1043A/2043A | START-UP BURNER A | Start-up burners | PASOK | oil-burners |
| 2 | B-1043B/2043B | START-UP BURNER B | Start-up burners | PASOK | oil-burners |
| 3 | B-1043C/2043C | START-UP BURNER C | Start-up burners | PASOK | oil-burners |
| 4 | B-1043D/2043D | START-UP BURNER D | Start-up burners | PASOK | oil-burners |
| 5 | C-0703A | PLANT AIR COMPRESSOR A | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 6 | C-0703B | PLANT AIR COMPRESSOR B | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 7 | C-0703C | PLANT AIR COMPRESSOR C | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 8 | C-0704A | INSTRUMENT AIR COMPRESSOR A | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 9 | C-0704B | INSTRUMENT AIR COMPRESSOR B | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 10 | C-0704C | INSTRUMENT AIR COMPRESSOR C | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 11 | C-0707 | START-UP COMPRESSOR | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 12 | D-0703A | PLANT AIR DRYER A | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 13 | D-0703B | PLANT AIR DRYER B | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 14 | D-0703C | PLANT AIR DRYER C | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 15 | D-0704A | INSTRUMENT AIR DRYER A | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 16 | D-0704B | INSTRUMENT AIR DRYER B | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 17 | D-0704C | INSTRUMENT AIR DRYER C | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 18 | F-1053/2053 | PRIMARY AIR FAN | Air (fans, blowers, air heater) | PASOK | combustion-air |
| 19 | F-1054/2054 | SECONDARY AIR FAN | Air (fans, blowers, air heater) | PASOK | combustion-air |
| 20 | F-1055A/2055A | FLUIDIZING AIR BLOWER A | Air (fans, blowers, air heater) | PASOK | combustion-air |
| 21 | F-1055B/2055B | FLUIDIZING AIR BLOWER B | Air (fans, blowers, air heater) | PASOK | combustion-air |
| 22 | F-1056/2056 | INDUCED DRAFT FAN | Flue gas (ID fan, ESP, stack) | PASOK | furnace-gas |
| 23 | F-1119A/2119A | STEAM EJECTOR EXHAUSTER A | Condenser and vacuum | PASOK | condensate |
| 24 | F-1119B/2119B | STEAM EJECTOR EXHAUSTER B | Condenser and vacuum | PASOK | condensate |
| 25 | H-1001/2001 | BOILER | Boiler (furnace, drum, cyclones, seal pots) | PASOK | boiler-steam, furnace-gas |
| 26 | H-1052/2052 | GAS AIR HEATER | Air (fans, blowers, air heater) | PASOK | combustion-air |
| 27 | H-1101/2101 | #1 LOW PRESSURE HEATER | LP heaters | PASOK | condensate, heater-drains |
| 28 | H-1102/2102 | #2 LOW PRESSURE HEATER | LP heaters | PASOK | condensate, heater-drains |
| 29 | H-1103/2103 | #3 LOW PRESSURE HEATER | LP heaters | PASOK | condensate, heater-drains |
| 30 | H-1104/2104 | DEAERATOR | Deaerator | PASOK | feedwater |
| 31 | H-1105/2105 | #1 HIGH PRESSURE HEATER | HP heaters | PASOK | feedwater, heater-drains |
| 32 | H-1106/2106 | #2 HIGH PRESSURE HEATER | HP heaters | PASOK | feedwater, heater-drains |
| 33 | H-1107A/2107A | CLOSED CIRCUIT COOLING WATER HEAT EXCHANGER A | Closed cooling water | PASOK | makeup-cooling |
| 34 | H-1107B/2107B | CLOSED CIRCUIT COOLING WATER HEAT EXCHANGER B | Closed cooling water | PASOK | makeup-cooling |
| 35 | H-1110/2110 | CONDENSER | Condenser and vacuum | PASOK | condensate |
| 36 | H-1119/2119 | STEAM JET AIR EJECTOR CONDENSER | Condenser and vacuum | PASOK | condensate |
| 37 | L-0062 | ELEVATOR (BOILER HOUSE) | Plant services (crane, elevator, pits) | LABAS: mechanical / civil, walang DCS signal | — |
| 38 | L-0063 | OILY WATER SEPARATOR | Plant services (crane, elevator, pits) | LABAS: mechanical / civil, walang DCS signal | — |
| 39 | L-0129 | TURBINE BUILDING OVERHEAD CRANE | Plant services (crane, elevator, pits) | LABAS: mechanical / civil, walang DCS signal | — |
| 40 | L-0503 | CRANE FOR SEAWATER PUMP | Plant services (crane, elevator, pits) | LABAS: mechanical / civil, walang DCS signal | — |
| 41 | L-1060A/2060A | BOTTOM ASH SCREW CONVEYOR A | Bottom ash | PASOK | ash |
| 42 | L-1060B/2060B | BOTTOM ASH SCREW CONVEYOR B | Bottom ash | PASOK | ash |
| 43 | L-1060C/2060C | BOTTOM ASH SCREW CONVEYOR C | Bottom ash | PASOK | ash |
| 44 | L-1060D/2060D | BOTTOM ASH SCREW CONVEYOR D | Bottom ash | PASOK | ash |
| 45 | L-1061A/2061A | COAL FEEDER A | Coal feeders | PASOK | coal |
| 46 | L-1061B/2061B | COAL FEEDER B | Coal feeders | PASOK | coal |
| 47 | L-1061C/2061C | COAL FEEDER C | Coal feeders | PASOK | coal |
| 48 | L-1121A/2121A | TUBE CLEANING SYSTEM - BALL SEPARATOR A | Condenser tube cleaning | PASOK | sea-water |
| 49 | L-1121B/2121B | TUBE CLEANING SYSTEM - BALL SEPARATOR B | Condenser tube cleaning | PASOK | sea-water |
| 50 | N-1011/2011 | SOOT BLOWER- RH+ ECO. PASS | Sootblowers | PASOK | sootblowers |
| 51 | N-1012/2012 | SOOT BLOWER - RH+ ECO. PASS | Sootblowers | PASOK | sootblowers |
| 52 | N-1013/2013 | SOOT BLOWER - SH+ ECO. PASS | Sootblowers | PASOK | sootblowers |
| 53 | N-1014/2014 | SOOT BLOWER - SH+ ECO. PASS | Sootblowers | PASOK | sootblowers |
| 54 | N-1015/2015 | SOOT BLOWER - RH+ ECO. PASS | Sootblowers | PASOK | sootblowers |
| 55 | N-1016/2016 | SOOT BLOWER - RH+ ECO. PASS | Sootblowers | PASOK | sootblowers |
| 56 | N-1017/2017 | SOOT BLOWER - SH+ ECO. PASS | Sootblowers | PASOK | sootblowers |
| 57 | N-1018/2018 | SOOT BLOWER - SH+ ECO. PASS | Sootblowers | PASOK | sootblowers |
| 58 | N-1019/2019 | SOOT BLOWER - RH+ ECO. PASS | Sootblowers | PASOK | sootblowers |
| 59 | N-1020/2020 | SOOT BLOWER - RH+ ECO. PASS | Sootblowers | PASOK | sootblowers |
| 60 | N-1021/2021 | SOOT BLOWER - SH+ ECO. PASS | Sootblowers | PASOK | sootblowers |
| 61 | N-1022/2022 | SOOT BLOWER - SH + ECO. PASS | Sootblowers | PASOK | sootblowers |
| 62 | N-1023/2023 | SOOT BLOWER - RH+ ECO. PASS | Sootblowers | PASOK | sootblowers |
| 63 | N-1024/2024 | SOOT BLOWER - RH+ ECO. PASS | Sootblowers | PASOK | sootblowers |
| 64 | N-1025/2025 | SOOT BLOWER - SH+ ECO. PASS | Sootblowers | PASOK | sootblowers |
| 65 | N-1026/2026 | SOOT BLOWER - SH+ ECO. PASS | Sootblowers | PASOK | sootblowers |
| 66 | N-1027/2027 | SOOT BLOWER - RH+ ECO. PASS | Sootblowers | PASOK | sootblowers |
| 67 | N-1028/2028 | SOOT BLOWER - RH+ ECO. PASS | Sootblowers | PASOK | sootblowers |
| 68 | N-1029/2029 | SOOT BLOWER - SH+ ECO. PASS | Sootblowers | PASOK | sootblowers |
| 69 | N-1030/2030 | SOOT BLOWER - SH+ ECO. PASS | Sootblowers | PASOK | sootblowers |
| 70 | N-1031/2031 | SOOT BLOWER - RH+ ECO. PASS | Sootblowers | PASOK | sootblowers |
| 71 | N-1032/2032 | SOOT BLOWER - RH+ ECO. PASS | Sootblowers | PASOK | sootblowers |
| 72 | N-1033/2033 | SOOT BLOWER - SH+ ECO. PASS | Sootblowers | PASOK | sootblowers |
| 73 | N-1034/2034 | SOOT BLOWER - SH+ ECO. PASS | Sootblowers | PASOK | sootblowers |
| 74 | N-1035/2035 | SOOT BLOWER - COMMON ECO. | Sootblowers | PASOK | sootblowers |
| 75 | N-1036/2036 | SOOT BLOWER - COMMON ECO. | Sootblowers | PASOK | sootblowers |
| 76 | N-1037/2037 | SOOT BLOWER- COMMON ECO. | Sootblowers | PASOK | sootblowers |
| 77 | N-1038/2038 | SOOT BLOWER - COMMON ECO. | Sootblowers | PASOK | sootblowers |
| 78 | N-1040/2040 | SOOT BLOWER - GAS AIR HEATER | Sootblowers | PASOK | sootblowers |
| 79 | N-1042/2042 | SOOT BLOWER-GAS AIR HEATER | Sootblowers | PASOK | sootblowers |
| 80 | P-0058A | WASTEWATER PUMP A | Plant services (crane, elevator, pits) | LABAS: mechanical / civil, walang DCS signal | — |
| 81 | P-0058B | WASTEWATER PUMP B | Plant services (crane, elevator, pits) | LABAS: mechanical / civil, walang DCS signal | — |
| 82 | P-0702A | DIESEL OIL PUMP A | Diesel oil | PASOK | oil-burners |
| 83 | P-0702B | DIESEL OIL PUMP B | Diesel oil | PASOK | oil-burners |
| 84 | P-0709A | MAKE-UP WATER PUMP A | Make-up / industrial water | PASOK | makeup-cooling, industrial-water |
| 85 | P-0709B | MAKE-UP WATER PUMP B | Make-up / industrial water | PASOK | makeup-cooling, industrial-water |
| 86 | P-0709C | MAKE-UP WATER PUMP C | Make-up / industrial water | PASOK | makeup-cooling, industrial-water |
| 87 | P-0715A | INDUSTRIAL WATER PUMP A | Make-up / industrial water | PASOK | makeup-cooling, industrial-water |
| 88 | P-0715B | INDUSTRIAL WATER PUMP B | Make-up / industrial water | PASOK | makeup-cooling, industrial-water |
| 89 | P-0718 | DIESEL ENGINE DRIVEN FIRE PUMP | Fire fighting | LABAS: mechanical / civil, walang DCS signal | — |
| 90 | P-0719 | MOTOR DRIVEN FIRE PUMP | Fire fighting | LABAS: mechanical / civil, walang DCS signal | — |
| 91 | P-0720 | MOTOR DRIVEN JOCKEY PUMP | Fire fighting | LABAS: mechanical / civil, walang DCS signal | — |
| 92 | P-1108A/2108A | AUXILIARY COOLING WATER PUMP A | Closed cooling water | PASOK | makeup-cooling |
| 93 | P-1108B/2108B | AUXILIARY COOLING WATER PUMP B | Closed cooling water | PASOK | makeup-cooling |
| 94 | P-1111A/2111A | SEAWATER BOOSTER PUMP A | Sea water | PASOK | sea-water |
| 95 | P-1111B/2111B | SEAWATER BOOSTER PUMP B | Sea water | PASOK | sea-water |
| 96 | P-1111C/2111C | SEAWATER BOOSTER PUMP C | Sea water | PASOK | sea-water |
| 97 | P-1115A/2115A | BOILER FEEDWATER PUMP A | Boiler feedwater pumps | PASOK | feedwater |
| 98 | P-1115B/2115B | BOILER FEEDWATER PUMP B | Boiler feedwater pumps | PASOK | feedwater |
| 99 | P-1116A/2116A | CONDENSATE PUMP A | Condensate and polisher | PASOK | condensate |
| 100 | P-1116B/2116B | CONDENSATE PUMP B | Condensate and polisher | PASOK | condensate |
| 101 | P-1122A/2122A | TUBE CLEANING SYSTEM - BALL RECIRCULATING PUMP A | Condenser tube cleaning | PASOK | sea-water |
| 102 | P-1122B/2122B | TUBE CLEANING SYSTEM - BALL RECIRCULATING PUMP B | Condenser tube cleaning | PASOK | sea-water |
| 103 | P-1127A/2127A | SUBMERGE PUMP A (TRANSFORMER AREA PIT A) | Plant services (crane, elevator, pits) | LABAS: mechanical / civil, walang DCS signal | — |
| 104 | P-1127B/2127B | SUBMERGE PUMP B (TRANSFORMER AREA PIT B) | Plant services (crane, elevator, pits) | LABAS: mechanical / civil, walang DCS signal | — |
| 105 | P-1501A/2501A | SEAWATER PUMP A | Sea water | PASOK | sea-water |
| 106 | P-1501B/2501B | SEAWATER PUMP B | Sea water | PASOK | sea-water |
| 107 | P-1501C/2501C | SEAWATER PUMP C | Sea water | PASOK | sea-water |
| 108 | P-1716A/2716A | CONDENSATE POLISHER BOOSTER PUMP A | Condensate and polisher | PASOK | condensate |
| 109 | P-1716B/2716B | CONDENSATE POLISHER BOOSTER PUMP B | Condensate and polisher | PASOK | condensate |
| 110 | S-1009A/2009A | CYCLONE A | Boiler (furnace, drum, cyclones, seal pots) | PASOK | boiler-steam, furnace-gas |
| 111 | S-1009B/2009B | CYCLONE B | Boiler (furnace, drum, cyclones, seal pots) | PASOK | boiler-steam, furnace-gas |
| 112 | S-1055A/2055A | FILTER SILENCER - FLUIDIZING AIR BLOWER A | Air (fans, blowers, air heater) | PASOK | combustion-air |
| 113 | S-1055B/2055B | FILTER SILENCER - FLUIDIZING AIR BLOWER B | Air (fans, blowers, air heater) | PASOK | combustion-air |
| 114 | S-1112/2112 | DEBRIS FILTER FOR SEAWATER INLET OF CCCW HEAT EXCHANGERS | Sea water | PASOK | sea-water |
| 115 | S-1502/2502 | SEAWATER DEBRIS FILTER | Sea water | PASOK | sea-water |
| 116 | T-0113 | PLUMBING WATER TANK | Water treatment / potable | LABAS: WTP (user 11-25) | — |
| 117 | T-0114 | TURBINE BUILDING POTABLE WATER TANK | Make-up / industrial water | PASOK | makeup-cooling, industrial-water |
| 118 | T-0701 | OIL SERVICE TANK | Diesel oil | PASOK | oil-burners |
| 119 | T-0705A | PLANT AIR RECEIVER A | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 120 | T-0705B | PLANT AIR RECEIVER B | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 121 | T-0706A | INSTRUMENT AIR RECEIVER A | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 122 | T-0706B | INSTRUMENT AIR RECEIVER B | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 123 | T-0708A | DEMINERALIZED WATER TANK A | Demin water storage | PASOK (demin = walang hanggang supply) | makeup-cooling |
| 124 | T-0708B | DEMINERALIZED WATER TANK B | Demin water storage | PASOK (demin = walang hanggang supply) | makeup-cooling |
| 125 | T-0714A | INDUSTRIAL WATER TANK A | Make-up / industrial water | PASOK | makeup-cooling, industrial-water |
| 126 | T-0714B | INDUSTRIAL WATER TANK B | Make-up / industrial water | PASOK | makeup-cooling, industrial-water |
| 127 | T-0717 | RAW WATER PIT | Water treatment / potable | LABAS: WTP (user 11-25) | — |
| 128 | T-0721 | WATER TREATMENT PLANT POTABLE WATER TANK | Water treatment / potable | LABAS: WTP (user 11-25) | — |
| 129 | T-1001/2001 | STEAM DRUM | Boiler (furnace, drum, cyclones, seal pots) | PASOK | boiler-steam, furnace-gas |
| 130 | T-1008A/2008A | COAL BUNKER A | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal |
| 131 | T-1008B/2008B | COAL BUNKER B | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal |
| 132 | T-1008C/2008C | COAL BUNKER C | Coal bunkers | PASOK (coal = walang hanggang supply; coal handling labas) | coal |
| 133 | T-1009A/2009A | CYCLONE SEAL POT A | Boiler (furnace, drum, cyclones, seal pots) | PASOK | boiler-steam, furnace-gas |
| 134 | T-1009B/2009B | CYCLONE SEAL POT B | Boiler (furnace, drum, cyclones, seal pots) | PASOK | boiler-steam, furnace-gas |
| 135 | T-1050/2050 | FLASH TANK | Boiler blowdown | PASOK | boiler-steam |
| 136 | T-1051/2051 | BLOWDOWN TANK | Boiler blowdown | PASOK | boiler-steam |
| 137 | T-1104/2104 | DEAERATOR STORAGE TANK | Deaerator | PASOK | feedwater |
| 138 | T-1109/2109 | EXPANSION TANK | Closed cooling water | PASOK | makeup-cooling |
| 139 | T-1123A/2123A | TUBE CLEANING SYSTEM-BALL VESSEL A | Condenser tube cleaning | PASOK | sea-water |
| 140 | T-1123B/2123B | TUBE CLEANING SYSTEM-BALL VESSEL B | Condenser tube cleaning | PASOK | sea-water |
| 141 | T-1125/2125 | DRAIN SEPARATOR | Turbine auxiliaries | PASOK | turbine-oil, extraction |
| 142 | T-1128 | TURNING GEAR / BUFFER TANK | Turbine auxiliaries | PASOK | turbine-oil, extraction |
| 143 | Z-0701 | FLAME ARRESTER | Diesel oil | PASOK | oil-burners |
| 144 | Z-0703A | LUBE OIL - PLANT AIR COMPRESSOR A | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 145 | Z-0703B | LUBE OIL - PLANT AIR COMPRESSOR B | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 146 | Z-0703C | LUBE OIL - PLANT AIR COMPRESSOR C | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 147 | Z-0704A | LUBE OIL - INSTRUMENT AIR COMPRESSOR A | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 148 | Z-0704B | LUBE OIL - INSTRUMENT AIR COMPRESSOR B | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 149 | Z-0704C | LUBE OIL - INSTRUMENT AIR COMPRESSOR C | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 150 | Z-0710A | AIR INTAKE FILTER-SILENCER FOR PLANT AIR COMPRESSOR A | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 151 | Z-0710B | AIR INTAKE FILTER-SILENCER FOR PLANT AIR COMPRESSOR B | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 152 | Z-0710C | AIR INTAKE FILTER-SILENCER FOR PLANT AIR COMPRESSOR C | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 153 | Z-0711A | RELIEF VALVE FOR PLANT AIR A | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 154 | Z-0711B | RELIEF VALVE FOR PLANT AIR B | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 155 | Z-0711C | RELIEF VALVE FOR PLANT AIR C | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 156 | Z-0712A | AIR INTAKE FILTER-SILENCER FOR INSTRUMENT AIR COMPRESSOR A | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 157 | Z-0712B | AIR INTAKE FILTER-SILENCER FOR INSTRUMENT AIR COMPRESSOR B | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 158 | Z-0712C | AIR INTAKE FILTER-SILENCER FOR INSTRUMENT AIR COMPRESSOR C | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 159 | Z-0713A | RELIEF VALVE FOR INSTRUMENT AIR A | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 160 | Z-0713B | RELIEF VALVE FOR INSTRUMENT AIR B | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 161 | Z-0713C | RELIEF VALVE FOR INSTRUMENT AIR C | Compressed air | LABAS: air compressors / dryers (user 11-25) | compressed-air (tingin lang) |
| 162 | Z-1001/2001 | SILENCER - BOILER DRUM & SOOT BLOWING SYSTEM | Steam silencers | LABAS: mechanical / civil, walang DCS signal | — |
| 163 | Z-1002/2002 | SILENCER - BOILER DRUM | Steam silencers | LABAS: mechanical / civil, walang DCS signal | — |
| 164 | Z-1003/2003 | SILENCER - MAIN STEAM PIPE & BLOW-OFF VALVE | Steam silencers | LABAS: mechanical / civil, walang DCS signal | — |
| 165 | Z-1004/2004 | SILENCER - HOT REHEAT STEAM PIPE | Steam silencers | LABAS: mechanical / civil, walang DCS signal | — |
| 166 | Z-1005/2005 | SILENCER - HOT REHEAT STEAM PIPE & BLOW-OFF VALVE | Steam silencers | LABAS: mechanical / civil, walang DCS signal | — |
| 167 | Z-1006/2006 | SILENCER - HOT REHEAT STEAM PIPE | Steam silencers | LABAS: mechanical / civil, walang DCS signal | — |
| 168 | Z-1007/2007 | SILENCER - AUXILIARY STEAM HEADER | Steam silencers | LABAS: mechanical / civil, walang DCS signal | — |
| 169 | Z-1010/2010 | ESP (ELECTROSTATIC PRECIPITATOR) | Flue gas (ID fan, ESP, stack) | PASOK | furnace-gas |
| 170 | Z-1053/2053 | SILENCER-PRIMARY AIR FAN AIR INLET | Air (fans, blowers, air heater) | PASOK | combustion-air |
| 171 | Z-1054/2054 | SILENCER - SECONDARY AIR FAN AIR INLET | Air (fans, blowers, air heater) | PASOK | combustion-air |
| 172 | Z-1055A/2055A | DISCHARGE SILENCER - FLUIDIZING AIR BLOWER A | Air (fans, blowers, air heater) | PASOK | combustion-air |
| 173 | Z-1055B/2055B | DISCHARGE SILENCER - FLUIDIZING AIR BLOWER B | Air (fans, blowers, air heater) | PASOK | combustion-air |
| 174 | Z-1056/2056 | SILENCER - INDUCED DRAFT FAN (NAME UNREADABLE IN RA TEXT LAYER) | Flue gas (ID fan, ESP, stack) | PASOK | furnace-gas |
| 175 | Z-1057/2057 | STACK | Flue gas (ID fan, ESP, stack) | PASOK | furnace-gas |
| 176 | Z-1104/2104 | SILENCER - DEAERATOR CONTINUOUS AIR VENT | Deaerator | PASOK | feedwater |
| 177 | Z-1119/2119 | STEAM JET AIR EJECTOR | Condenser and vacuum | PASOK | condensate |
| 178 | Z-1120/2120 | START-UP EJECTOR | Condenser and vacuum | PASOK | condensate |
| 179 | Z-1124A/2124A | TUBE CLEANING SYSTEM-V-PIECE A | Condenser tube cleaning | PASOK | sea-water |
| 180 | Z-1124B/2124B | TUBE CLEANING SYSTEM-V-PIECE B | Condenser tube cleaning | PASOK | sea-water |
| 181 | Z-1124C/2124C | TUBE CLEANING SYSTEM-V-PIECE C | Condenser tube cleaning | PASOK | sea-water |
| 182 | Z-1124D/2124D | TUBE CLEANING SYSTEM-V-PIECE D | Condenser tube cleaning | PASOK | sea-water |

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
