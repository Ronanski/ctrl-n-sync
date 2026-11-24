# HMI gap list: Unit 1 equipment of the DCS I/O list against the HX pages (EIMI, 2026-11-25)

Made by `node tools/audit/hmi-gap.cjs --md`. An equipment counts as ON a page when its tag number is named in the page file, or in the registry bind of a machine the page names. Text match only, so a row can be on a page under another name: the page that takes it checks it in the running app. Left out by the user's order: water treatment (PW, HC, IW), coal handling (conveyors), air compressors and dryers (C, D).

**Total: 1067 equipment, 814 on a page, 253 missing.**

## Summary by page

| Lane | Page (proposed) | System code | Equipment | On a page | Missing |
|---|---|---|---|---|---|
| 6 | annunciator (station) | ANN | 104 | 104 | 0 |
| 6 | ash | BH | 19 | 13 | 6 |
| 6 | ash | L | 5 | 5 | 0 |
| 6 | ash | FH | 4 | 0 | 4 |
| 6 | ash | S | 2 | 2 | 0 |
| 6 | boiler-steam | BR | 20 | 20 | 0 |
| 6 | boiler-steam | MS | 17 | 17 | 0 |
| 6 | boiler-steam | FS | 3 | 3 | 0 |
| 6 | boiler-steam | BD | 2 | 2 | 0 |
| 6 | coal | CL | 27 | 27 | 0 |
| 6 | coal | IA | 16 | 7 | 9 |
| 6 | combustion-air | FA | 85 | 52 | 33 |
| 6 | combustion-air | PA | 32 | 22 | 10 |
| 6 | combustion-air | LO | 19 | 2 | 17 |
| 6 | dcs-diagnostics (station, new) | DIAG | 18 | 0 | 18 |
| 6 | furnace-gas | FG | 95 | 81 | 14 |
| 6 | furnace-gas | F | 18 | 18 | 0 |
| 6 | limestone-sand | LM | 16 | 14 | 2 |
| 6 | limestone-sand | M | 12 | 1 | 11 |
| 6 | limestone-sand | SD | 9 | 6 | 3 |
| 6 | purge-trip | ? | 69 | 13 | 56 |
| 6 | sampling | SP | 21 | 21 | 0 |
| 6 | sampling | Z | 8 | 8 | 0 |
| 6 | sampling | CH | 3 | 3 | 0 |
| 6 | sootblowers | N | 30 | 30 | 0 |
| 6 | sootblowers | SB | 9 | 9 | 0 |
| 7 | aux-steam | AS | 19 | 18 | 1 |
| 7 | aux-steam | AV | 2 | 2 | 0 |
| 7 | aux-steam | GS | 1 | 1 | 0 |
| 7 | condensate | CD | 46 | 34 | 12 |
| 7 | extraction | TS | 26 | 26 | 0 |
| 7 | extraction | HD | 15 | 15 | 0 |
| 7 | feedwater | FW | 63 | 63 | 0 |
| 7 | generator | DO | 35 | 31 | 4 |
| 7 | generator | DI | 33 | 0 | 33 |
| 7 | generator | AI | 12 | 2 | 10 |
| 7 | generator | AO | 9 | 0 | 9 |
| 7 | makeup-cooling | P | 48 | 48 | 0 |
| 7 | makeup-cooling | CW | 25 | 25 | 0 |
| 7 | makeup-cooling | MU | 10 | 10 | 0 |
| 7 | reheat | HR | 15 | 15 | 0 |
| 7 | reheat | CR | 12 | 11 | 1 |
| 7 | sea-water | SW | 26 | 26 | 0 |
| 7 | sea-water | DF | 2 | 2 | 0 |
| 7 | sea-water | CTCS | 2 | 2 | 0 |
| 7 | turbine | ST | 3 | 3 | 0 |

## Missing equipment, with the addresses each one binds to

### ash (lane 6)

**BH** (6)

| Equipment | What | Signals (tag · address · type) |
|---|---|---|
| BH1751 | Bottom ash transmitter 3-way valve open solenoid | SV-BH1751 · S3 O.0216 · DO-Wet<br>SS-BH1751 · S3 I.0241 · DI<br>ZS-BH1751 · S3 I.0244 · DI<br>LS-BH1751 · S3 I.048E · DI |
| BH1752 | Boiler bottom ash transmitter outlet valve open solenoid | SV-BH1752 · S3 O.0215 · DO-Wet<br>ZS-BH1752 · S3 I.0245 · DI<br>ZSO-BH1752 · S3 I.0484 · DI<br>ZSC-BH1752 · S3 I.0485 · DI<br>LS-BH1752 · S3 I.0498 · DI |
| BH1753 | Boiler bottom ash transmitter venting valve open solenoid | SV-BH1753 · S3 O.0214 · DO-Wet<br>LS-BH1753 · S3 I.0249 · DI<br>ZSO-BH1753 · S3 I.0486 · DI<br>ZSC-BH1753 · S3 I.0487 · DI |
| BH1754 | Boiler bottom ash two-way separator inlet shut-off valve | ZSO-BH1754 · S3 I.0173 · DI<br>ZSC-BH1754 · S3 I.0174 · DI<br>SVO-BH1754 · S3 O.0210 · DO-Wet<br>SVC-BH1754 · S3 O.0211 · DO-Wet<br>LS-BH1754 · S3 I.0248 · DI |
| BH1758 | Bottom ash dedust bag filter purge air unit | SV-BH1758 · S3 O.021E · DO-Wet |
| BH1759 | Boiler bottom ash transmitter inlet gate valve open solenoid | SV-BH1759 · S3 O.0213 · DO-Wet<br>ZSO-BH1759 · S3 I.0482 · DI<br>ZSC-BH1759 · S3 I.0483 · DI |

**FH** (4)

| Equipment | What | Signals (tag · address · type) |
|---|---|---|
| FH1701 | Fly ash common | XA-FH1701 · S3 I.057B · DI |
| FH1702 | Fly ash PLC fault | XA-FH1702 · S3 I.057C · DI |
| FH1703 | Fly ash communication fault | XA-FH1703 · S3 I.057D · DI |
| FH1704 | Fly ash main control panel no power | XA-FH1704 · S3 I.057E · DI |

### coal (lane 6)

**IA** (9)

| Equipment | What | Signals (tag · address · type) |
|---|---|---|
| IA1061-A1 | Coal feeder-A air tank pressure switch | PS-IA1061-A1 · S4 I.013E · DI |
| IA1061-A2 | Coal feeder-A air tank pressure switch | PS-IA1061-A2 · S4 I.013F · DI |
| IA1061-B1 | Coal feeder-B air tank pressure switch | PS-IA1061-B1 · S4 I.045E · DI |
| IA1061-B2 | Coal feeder-B air tank pressure switch | PS-IA1061-B2 · S4 I.045F · DI |
| IA1061-C1 | Coal feeder-C air tank pressure switch | PS-IA1061-C1 · S4 I.049E · DI |
| IA1061-C2 | Coal feeder-C air tank pressure switch | PS-IA1061-C2 · S4 I.049F · DI |
| IA1064-A | Air buffer tank of biasing damper-A pressure | PT-IA1064-A · S4 AI0438 · AI-Wet |
| IA1064-B | Air buffer tank of biasing damper-B pressure | PT-IA1064-B · S4 AI0470 · AI-Wet |
| IA1128 | Air buffer tank of turning gear pressure | PT-IA1128 · S4 AI0437 · AI-Wet |

### combustion-air (lane 6)

**FA** (33)

| Equipment | What | Signals (tag · address · type) |
|---|---|---|
| FA1005 | Furnace temp. front wall motor control damper FA1005 | ZSO-FA1005 · S3 I.0330 · DI<br>ZSC-FA1005 · S3 I.0331 · DI<br>MIT-FA1005 · S3 I.0332 · DI<br>MIL-FA1005 · S3 I.0333 · DI<br>TS-FA1005 · S3 I.0334 · DI<br>ZT-FA1005 · S3 AI0544 · AI-Dry<br>MCV-FA1005 · S3 AO0592 · AO |
| FA1006 | Furnace temp. front wall motor control damper FA1006 | ZSO-FA1006 · S3 I.0335 · DI<br>ZSC-FA1006 · S3 I.0336 · DI<br>MIT-FA1006 · S3 I.0337 · DI<br>MIL-FA1006 · S3 I.0338 · DI<br>TS-FA1006 · S3 I.0339 · DI<br>ZT-FA1006 · S3 AI0545 · AI-Dry<br>MCV-FA1006 · S3 AO0944 · AO |
| FA1007 | Furnace temp. front wall motor control damper FA1007 | ZSO-FA1007 · S3 I.033A · DI<br>ZSC-FA1007 · S3 I.033B · DI<br>MIT-FA1007 · S3 I.033C · DI<br>MIL-FA1007 · S3 I.033D · DI<br>TS-FA1007 · S3 I.033E · DI<br>ZT-FA1007 · S3 AI0546 · AI-Dry<br>MCV-FA1007 · S3 AO0593 · AO |
| FA1008 | Furnace temp. front wall motor control damper FA1008 | ZSO-FA1008 · S3 I.0720 · DI<br>ZSC-FA1008 · S3 I.0721 · DI<br>MIT-FA1008 · S3 I.0722 · DI<br>MIL-FA1008 · S3 I.0723 · DI<br>TS-FA1008 · S3 I.0724 · DI<br>ZT-FA1008 · S3 AI0547 · AI-Dry<br>MCV-FA1008 · S3 AO0945 · AO |
| FA1009 | Furnace temp. front wall motor control damper FA1009 | ZSO-FA1009 · S3 I.0725 · DI<br>ZSC-FA1009 · S3 I.0726 · DI<br>MIT-FA1009 · S3 I.0727 · DI<br>MIL-FA1009 · S3 I.0728 · DI<br>TS-FA1009 · S3 I.0729 · DI<br>ZT-FA1009 · S3 AI0548 · AI-Dry<br>MCV-FA1009 · S3 AO0594 · AO |
| FA1010 | Furnace temp. front wall motor control damper FA1010 | ZSO-FA1010 · S3 I.072A · DI<br>ZSC-FA1010 · S3 I.072B · DI<br>MIT-FA1010 · S3 I.072C · DI<br>MIL-FA1010 · S3 I.072D · DI<br>TS-FA1010 · S3 I.072E · DI<br>ZT-FA1010 · S3 AI0549 · AI-Dry<br>MCV-FA1010 · S3 AO0946 · AO |
| FA1011 | Furnace temp. front wall motor control damper FA1011 | ZSO-FA1011 · S3 I.0730 · DI<br>ZSC-FA1011 · S3 I.0731 · DI<br>MIT-FA1011 · S3 I.0732 · DI<br>MIL-FA1011 · S3 I.0733 · DI<br>TS-FA1011 · S3 I.0734 · DI<br>ZT-FA1011 · S3 AI0550 · AI-Dry<br>MCV-FA1011 · S3 AO0595 · AO |
| FA1012 | Furnace temp. front wall motor control damper FA1012 | ZSO-FA1012 · S3 I.0735 · DI<br>ZSC-FA1012 · S3 I.0736 · DI<br>MIT-FA1012 · S3 I.0737 · DI<br>MIL-FA1012 · S3 I.0738 · DI<br>TS-FA1012 · S3 I.0739 · DI<br>ZT-FA1012 · S3 AI0560 · AI-Dry<br>MCV-FA1012 · S3 AO0947 · AO |
| FA1013 | Furnace temp. front wall motor control damper FA1013 | ZSO-FA1013 · S3 I.073A · DI<br>ZSC-FA1013 · S3 I.073B · DI<br>MIT-FA1013 · S3 I.073C · DI<br>MIL-FA1013 · S3 I.073D · DI<br>TS-FA1013 · S3 I.073E · DI<br>ZT-FA1013 · S3 AI0561 · AI-Dry<br>MCV-FA1013 · S3 AO0596 · AO |
| FA1014 | Furnace temp. front wall motor control damper FA1014 | ZSO-FA1014 · S3 I.0800 · DI<br>ZSC-FA1014 · S3 I.0801 · DI<br>MIT-FA1014 · S3 I.0802 · DI<br>MIL-FA1014 · S3 I.0803 · DI<br>TS-FA1014 · S3 I.0804 · DI<br>ZT-FA1014 · S3 AI0562 · AI-Dry<br>MCV-FA1014 · S3 AO0948 · AO |
| FA1015 | Furnace temp. front wall motor control damper FA1015 | ZSO-FA1015 · S3 I.0805 · DI<br>ZSC-FA1015 · S3 I.0806 · DI<br>MIT-FA1015 · S3 I.0807 · DI<br>MIL-FA1015 · S3 I.0808 · DI<br>TS-FA1015 · S3 I.0809 · DI<br>ZT-FA1015 · S3 AI0563 · AI-Dry<br>MCV-FA1015 · S3 AO0597 · AO |
| FA1016 | Furnace temp. front wall motor control damper FA1016 | ZSO-FA1016 · S3 I.080A · DI<br>ZSC-FA1016 · S3 I.080B · DI<br>MIT-FA1016 · S3 I.080C · DI<br>MIL-FA1016 · S3 I.080D · DI<br>TS-FA1016 · S3 I.080E · DI<br>ZT-FA1016 · S3 AI0564 · AI-Dry<br>MCV-FA1016 · S3 AO0949 · AO |
| FA1017 | Furnace temp. front wall motor control damper FA1017 | ZSO-FA1017 · S3 I.0810 · DI<br>ZSC-FA1017 · S3 I.0811 · DI<br>MIT-FA1017 · S3 I.0812 · DI<br>MIL-FA1017 · S3 I.0813 · DI<br>TS-FA1017 · S3 I.0814 · DI<br>ZT-FA1017 · S3 AI0565 · AI-Dry<br>MCV-FA1017 · S3 AO0598 · AO |
| FA1018 | Furnace temp. front wall motor control damper FA1018 | ZSO-FA1018 · S3 I.0815 · DI<br>ZSC-FA1018 · S3 I.0816 · DI<br>MIT-FA1018 · S3 I.0817 · DI<br>MIL-FA1018 · S3 I.0818 · DI<br>TS-FA1018 · S3 I.0819 · DI<br>ZT-FA1018 · S3 AI0566 · AI-Dry<br>MCV-FA1018 · S3 AO0950 · AO |
| FA1019 | Furnace temp. rear wall motor control damper FA1019 | ZSO-FA1019 · S3 I.0000 · DI<br>ZSC-FA1019 · S3 I.0001 · DI<br>MIT-FA1019 · S3 I.0002 · DI<br>MIL-FA1019 · S3 I.0003 · DI<br>TS-FA1019 · S3 I.0004 · DI<br>ZT-FA1019 · S3 AI0416 · AI-Dry<br>MCV-FA1019 · S3 AO0576 · AO |
| FA1020 | Furnace temp. rear wall motor control damper FA1020 | ZSO-FA1020 · S3 I.0005 · DI<br>ZSC-FA1020 · S3 I.0006 · DI<br>MIT-FA1020 · S3 I.0007 · DI<br>MIL-FA1020 · S3 I.0008 · DI<br>TS-FA1020 · S3 I.0009 · DI<br>ZT-FA1020 · S3 AI0417 · AI-Dry<br>MCV-FA1020 · S3 AO0880 · AO |
| FA1021 | Furnace temp. rear wall motor control damper FA1021 | ZSO-FA1021 · S3 I.000A · DI<br>ZSC-FA1021 · S3 I.000B · DI<br>MIT-FA1021 · S3 I.000C · DI<br>MIL-FA1021 · S3 I.000D · DI<br>TS-FA1021 · S3 I.000E · DI<br>ZT-FA1021 · S3 AI0418 · AI-Dry<br>MCV-FA1021 · S3 AO0577 · AO |
| FA1022 | Furnace temp. rear wall motor control damper FA1022 | ZSO-FA1022 · S3 I.0010 · DI<br>ZSC-FA1022 · S3 I.0011 · DI<br>MIT-FA1022 · S3 I.0012 · DI<br>MIL-FA1022 · S3 I.0013 · DI<br>TS-FA1022 · S3 I.0014 · DI<br>ZT-FA1022 · S3 AI0419 · AI-Dry<br>MCV-FA1022 · S3 AO0881 · AO |
| FA1023 | Furnace temp. rear wall motor control damper FA1023 | ZSO-FA1023 · S3 I.0015 · DI<br>ZSC-FA1023 · S3 I.0016 · DI<br>MIT-FA1023 · S3 I.0017 · DI<br>MIL-FA1023 · S3 I.0018 · DI<br>TS-FA1023 · S3 I.0019 · DI<br>ZT-FA1023 · S3 AI0420 · AI-Dry<br>MCV-FA1023 · S3 AO0578 · AO |
| FA1024 | Furnace temp. rear wall motor control damper FA1024 | ZSO-FA1024 · S3 I.001A · DI<br>ZSC-FA1024 · S3 I.001B · DI<br>MIT-FA1024 · S3 I.001C · DI<br>MIL-FA1024 · S3 I.001D · DI<br>TS-FA1024 · S3 I.001E · DI<br>ZT-FA1024 · S3 AI0421 · AI-Dry<br>MCV-FA1024 · S3 AO0882 · AO |
| FA1025 | Furnace temp. rear wall motor control damper FA1025 | ZSO-FA1025 · S3 I.0320 · DI<br>ZSC-FA1025 · S3 I.0321 · DI<br>MIT-FA1025 · S3 I.0322 · DI<br>MIL-FA1025 · S3 I.0323 · DI<br>TS-FA1025 · S3 I.0324 · DI<br>ZT-FA1025 · S3 AI0422 · AI-Dry<br>MCV-FA1025 · S3 AO0579 · AO |
| FA1026 | Furnace temp. rear wall motor control damper FA1026 | ZSO-FA1026 · S3 I.0325 · DI<br>ZSC-FA1026 · S3 I.0326 · DI<br>MIT-FA1026 · S3 I.0327 · DI<br>MIL-FA1026 · S3 I.0328 · DI<br>TS-FA1026 · S3 I.0329 · DI<br>ZT-FA1026 · S3 AI0423 · AI-Dry<br>MCV-FA1026 · S3 AO0883 · AO |
| FA1052 | Air preheater emergency push button operated | ES-FA1052 · S3 I.065E · DI<br>TI-FA1052 · S3 AI0402 · AI-Dry |
| FA1052-1 | Air preheater fire detect system not | XA-FA1052-1 · S3 I.0655 · DI |
| FA1052-2 | Air preheater fire detect sensor not open circuit | XA-FA1052-2 · S3 I.0656 · DI |
| FA1052-3 | Air preheater not fire | XA-FA1052-3 · S3 I.0657 · DI |
| FA1052-4 | Air preheater speed sensor not | XA-FA1052-4 · S3 I.0658 · DI |
| FA1052-5 | Air preheater speed not | SALL-FA1052-5 · S3 I.0654 · DI<br>XA-FA1052-5 · S3 I.0659 · DI |
| FA1052-6 | Air preheater speed not | SAL-FA1052-6 · S3 I.0653 · DI<br>XA-FA1052-6 · S3 I.065A · DI<br>TA-FA1052-6 · S3 AI0400 · AI-Wet |
| FA1052-7 | Air preheater cold end bearing oil temp. | TA-FA1052-7 · S3 AI0401 · AI-Wet |
| FA1052M1 | Air preheater | YS-FA1052M1 · S3 I.0650 · DI<br>XA-FA1052M1 · S3 I.0651 · DI<br>YSR-FA1052M1 · S3 I.0652 · DI<br>IT-FA1052M1 · S3 AI0470 · AI-Wet |
| FA1052M1-1 | Air preheater | CSC-FA1052M1-1 · S3 O.0206 · DO-Dry<br>CSO-FA1052M1-1 · S3 O.0207 · DO-Dry |
| FA1052M1-2 | Air preheater low speed select | CSC-FA1052M1-2 · S3 O.0208 · DO-Dry |

**PA** (10)

| Equipment | What | Signals (tag · address · type) |
|---|---|---|
| PA1805A | Boiler sand by-pass air valve open solenoid | SV-PA1805A · S3 O.0605 · DO-Dry |
| PA1805B | Boiler sand density stablizer valve open solenoid | SV-PA1805B · S3 O.0606 · DO-Dry |
| PA1806A | Boiler sand silo fluidizing solenoid valve(1) | SV-PA1806A · S3 O.0602 · DO-Dry |
| PA1806B | Boiler sand silo fluidizing solenoid valve(2) | SV-PA1806B · S3 O.0603 · DO-Dry |
| PA1807 | Boiler sand isolating bypass air valve open solenoid | SV-PA1807 · S3 O.0612 · DO-Wet |
| PA1811 | Boiler air receiver tank of limestone system pressure switch | PS-PA1811 · S4 I.016A · DI |
| PA1812A | Limestone silo isolating bypass valve(A) open solenoid | SV-PA1812A · S4 O.0250 · DO-Wet |
| PA1812B | Limestone silo isolating bypass valve(B) open solenoid | SV-PA1812B · S4 O.0251 · DO-Wet |
| PA1813A | Limestone silo fluidizing solenoid valve(1) | SV-PA1813A · S4 O.0245 · DO-Dry |
| PA1813B | Limestone silo fluidizing solenoid valve(2) | SV-PA1813B · S4 O.0246 · DO-Dry |

**LO** (17)

| Equipment | What | Signals (tag · address · type) |
|---|---|---|
| LO1115-A | Lube oil of BFWP-A level switch | LS-LO1115-A · S3 I.0093 · DI |
| LO1115-A1 | Lube oil of BFWP-A pressure switch (1) ( < 1.5Kg/cm2 ) | PS-LO1115-A1 · S3 I.0090 · DI |
| LO1115-A2 | Lube oil of BFWP-A pressure switch (2) ( > 2.0Kg/cm2 ) | PS-LO1115-A2 · S3 I.0091 · DI |
| LO1115-A3 | Lube oil of BFWP-A pressure switch (3) ( < 1Kg/cm2 ) | PS-LO1115-A3 · S3 I.0092 · DI |
| LO1115-B | Lube oil of BFWP-B level switch | LS-LO1115-B · S3 I.0413 · DI |
| LO1115-B1 | Lube oil of BFWP-B pressure switch (1) ( < 1.5Kg/cm2 ) | PS-LO1115-B1 · S3 I.0410 · DI |
| LO1115-B2 | Lube oil of BFWP-B pressure switch (2) ( > 2.0Kg/cm2 ) | PS-LO1115-B2 · S3 I.0411 · DI |
| LO1115-B3 | Lube oil of BFWP-B pressure switch (3) ( < 1Kg/cm2 ) | PS-LO1115-B3 · S3 I.0412 · DI |
| LO1753 | PAF lube oil pressure | PSL-LO1753 · S3 I.0695 · DI<br>PSLL-LO1753 · S3 I.0696 · DI<br>DPS-LO1753 · S3 I.0697 · DI<br>LSL-LO1753 · S3 I.0698 · DI<br>LSLL-LO1753 · S3 I.0699 · DI<br>TS-LO1753 · S3 I.069A · DI |
| LO1753-1 | PAF circulating oil system control power auxiliary switch | MIA-LO1753-1 · S3 I.065B · DI |
| LO1753-2 | PAF circulating oil system NFB2 auxiliary switch not | MIA-LO1753-2 · S3 I.065C · DI |
| LO1753-3 | PAF circulating oil system NFB1 auxiliary switch not | MIA-LO1753-3 · S3 I.065D · DI |
| LO1753-A | LOP A of PAF | MIR-LO1753-A · S3 I.005C · DI<br>MIT-LO1753-A · S3 I.005D · DI<br>MIL-LO1753-A · S3 I.005E · DI<br>MOR-LO1753-A · S3 O.012F · DO-Dry |
| LO1753-B | LOP B of PAF | MIR-LO1753-B · S3 I.037C · DI<br>MIT-LO1753-B · S3 I.037D · DI<br>MIL-LO1753-B · S3 I.037E · DI<br>MOR-LO1753-B · S3 O.044F · DO-Dry |
| LO1756 | Hydraulic coupling of IDF scoop tube | ZSO-LO1756 · S1 I.0083 · DI<br>ZSC-LO1756 · S1 I.0084 · DI<br>ST-LO1756 · S1 AI0481 · AI-D(D)<br>ZT-LO1756 · S1 AI0482 · AI-D(D)<br>SC-LO1756 · S1 AO0801 · AO(D)<br>PSL-LO1756 · S3 I.0690 · DI<br>PSLL-LO1756 · S3 I.0691 · DI<br>DPS-LO1756 · S3 I.0692 · DI |
| LO1756-1 | H/C working oil of IDF temp. | TS-LO1756-1 · S3 I.0693 · DI |
| LO1756-2 | H/C working oil of IDF temp. | TS-LO1756-2 · S3 I.0694 · DI |

### dcs-diagnostics (station, new) (lane 6)

**DIAG** (18)

| Equipment | What | Signals (tag · address · type) |
|---|---|---|
| 1011-SYSERR | FCS1011 alarm at DCS | 1011-SYSERR · S4 I.057D · DI |
| 1012-SYSERR | FCS1012 alarm at DCS | 1012-SYSERR · S4 I.057E · DI |
| 1013-SYSERR | FCS1013 alarm at DCS | 1013-SYSERR · S4 I.057F · DI |
| 1021-SYSERR | FCS1021 alarm at DCS | 1021-SYSERR · S1 I.005D · DI |
| 1022-SYSERR | FCS1022 alarm at DCS | 1022-SYSERR · S1 I.005E · DI |
| 1023-SYSERR | FCS1023 alarm at DCS | 1023-SYSERR · S1 I.005F · DI |
| 1031-SYSERR | FCS1031 alarm at DCS | 1031-SYSERR · S2 I.093D · DI |
| 1032-SYSERR | FCS1032 alarm at DCS | 1032-SYSERR · S2 I.093E · DI |
| 1033-SYSERR | FCS1033 alarm at DCS | 1033-SYSERR · S2 I.093F · DI |
| 1041-SYSERR | FCS1041 alarm at DCS | 1041-SYSERR · S3 I.069D · DI |
| 1042-SYSERR | FCS1042 alarm at DCS | 1042-SYSERR · S3 I.069E · DI |
| 1051-SYSERR | FCS1051 alarm at DCS | 1051-SYSERR · S4 I.057C · DI |
| ARP1-SYSERR | ARP1 system | ARP1-SYSERR · S1 I.005B · DI |
| GCS10DE-SYSERR | GCS10D/10E alarm at DCS | GCS10DE-SYSERR · S4 I.057A · DI |
| GCS10F-SYSERR | GCS10F alarm at DCS | GCS10F-SYSERR · S4 I.057B · DI |
| IRP1-POWALM | IRP1 power supply | IRP1-POWALM · S1 I.005C · DI |
| PDP-PLOSS | PDP power supply fault at DCS | PDP-PLOSS · S3 I.069F · DI |
| SER1-SYSERR | SER1-System | SER1-SYSERR · S2 I.093C · DI |

### furnace-gas (lane 6)

**FG** (14)

| Equipment | What | Signals (tag · address · type) |
|---|---|---|
| FG1092-A | Boiler cyclone-A inlet flue gas temperature | TT-FG1092-A · S1 AI0659 · AI-Wet |
| FG1092-B | Boiler cyclone-B inlet flue gas temperature | TT-FG1092-B · S1 AI0675 · AI-Wet |
| FG1096-A | Boiler cyclone-A outlet flue gas temperature (2) | TT-FG1096-A · S1 AI0676 · AI-Wet |
| FG1096-B | Boiler cyclone-B outlet flue gas temperature (2) | TT-FG1096-B · S1 AI0677 · AI-Wet |
| FG1101 | Finishing S/H-1 inlet flue gas temperature | TT-FG1101 · S4 AI0453 · AI-Wet |
| FG1102 | Reheater-2 inlet flue gas temperature | TT-FG1102 · S4 AI0449 · AI-Wet |
| FG1103 | Finishing S/H-2 inlet flue gas temperature | TT-FG1103 · S4 AI0454 · AI-Wet |
| FG1104 | Reheater-3 inlet flue gas temperature | TT-FG1104 · S4 AI0464 · AI-Wet |
| FG1105 | Finishing S/H-3 inlet flue gas temperature | TT-FG1105 · S4 AI0469 · AI-Wet |
| FG1106 | Reheater-4 inlet flue gas temperature | TT-FG1106 · S4 AI0465 · AI-Wet |
| FG1107 | ECO. #3 upper inlet flue gas temperature | TT-FG1107 · S4 AI0452 · AI-Wet |
| FG1108 | ECO. #2R inlet flue gas temperature | TT-FG1108 · S4 AI0450 · AI-Wet |
| FG1109 | ECO. #3 lower inlet flue gas temperature | TT-FG1109 · S4 AI0468 · AI-Wet |
| FG1111 | ECO. #2S inlet flue gas temperature | TT-FG1111 · S4 AI0451 · AI-Wet |

### limestone-sand (lane 6)

**LM** (2)

| Equipment | What | Signals (tag · address · type) |
|---|---|---|
| LM1311 | Boiler limestone injection system | SIL-LM1311 · S4 I.0176 · DI<br>SOR-LM1311 · S4 O.024B · DO-Dry |
| LM1313 | Limestone silo vent fan | MIR-LM1313 · S4 I.0173 · DI<br>MIT-LM1313 · S4 I.0174 · DI<br>MIL-LM1313 · S4 I.0175 · DI<br>POR-LM1313 · S4 O.024D · DO-Dry |

**M** (11)

| Equipment | What | Signals (tag · address · type) |
|---|---|---|
| M0703-A1 | Plant air compressor-A motor winding temperature (U phase) | TE-M0703-A1 · S5 AI0085 · AI-Dry |
| M0703-A2 | Plant air compressor-A motor winding temperature (V phase) | TE-M0703-A2 · S5 AI0086 · AI-Dry |
| M0703-A3 | Plant air compressor-A motor winding temperature (W phase) | TE-M0703-A3 · S5 AI0087 · AI-Dry |
| M0703-B1 | Plant air compressor-B motor winding temperature (U phase) | TE-M0703-B1 · S5 AI0101 · AI-Dry |
| M0703-B2 | Plant air compressor-B motor winding temperature (V phase) | TE-M0703-B2 · S5 AI0102 · AI-Dry |
| M0703-B3 | Plant air compressor-B motor winding temperature (W phase) | TE-M0703-B3 · S5 AI0103 · AI-Dry |
| M0703-C1 | Plant air compressor-C motor winding temperature (U phase) | TE-M0703-C1 · S5 AI0117 · AI-Dry |
| M0703-C2 | Plant air compressor-C motor winding temperature (V phase) | TE-M0703-C2 · S5 AI0118 · AI-Dry |
| M0703-C3 | Plant air compressor-C motor winding temperature (W phase) | TE-M0703-C3 · S5 AI0119 · AI-Dry |
| M1301 | Boiler sand silo vent filter fan | MIR-M1301 · S3 I.0570 · DI<br>MIT-M1301 · S3 I.0571 · DI<br>MIL-M1301 · S3 I.0572 · DI<br>MOR-M1301 · S3 O.060A · DO-Dry |
| M1313 | Limestone silo vent fan | MOR-M1313 · S4 O.024E · DO-Dry |

**SD** (3)

| Equipment | What | Signals (tag · address · type) |
|---|---|---|
| SD1300 | Boiler sand injection system | SIL-SD1300 · S3 I.057A · DI |
| SD1300A | Boiler sand silo vent filter purge | SOR-SD1300A · S3 O.0609 · DO-Dry |
| SD1300B | Boiler sand injection system running (indicator lamp) | SOR-SD1300B · S3 O.0608 · DO-Dry |

### purge-trip (lane 6)

**?** (56)

| Equipment | What | Signals (tag · address · type) |
|---|---|---|
| ALL-FAB-STOP | All FA Blowers stopped (From IRP) | ALL-FAB-STOP · S4 I.0569 · DI |
| BOILER-TRIP-OPC | Boiler emergency trip P.B. on (OPC) | BOILER-TRIP-OPC · S4 I.0562 · DI |
| CYCLONE-HH | Cyclone outlet gas temp. high high (no reheater steam) (TO IRP) | CYCLONE-HH · S1 O.0175 · DO-Dry |
| DR-LVL-LL | Drum level low low (PAF stop command) | DR-LVL-LL · S4 O.0604 · DO-Dry |
| DRUM-LVL-HH | Drum level high high (From IRP) | DRUM-LVL-HH · S4 I.0563 · DI |
| DRUM-LVL-LL | Drum level low low (From IRP) | DRUM-LVL-LL · S4 I.0564 · DI |
| FAB-STOP-CMD | FA blower stop command (From IRP) | FAB-STOP-CMD · S4 I.056B · DI |
| FP-CPL | Furnace purge complete (TO IRP) | FP-CPL · S4 O.0600 · DO-Dry |
| FURNACE-HH | Furnace pressure high high (From IRP) | FURNACE-HH · S4 I.0567 · DI |
| FURNACE-HHH | Furnace pressure high high high (From IRP) | FURNACE-HHH · S4 I.0566 · DI |
| FURNACE-LL | Furnace pressure low low (From IRP) | FURNACE-LL · S4 I.0568 · DI |
| IDF-STOP-CMD | IDF stop command (From IRP) | IDF-STOP-CMD · S4 I.056A · DI |
| INS-PRESS-LL | Instrument air pressure low low (From IRP) | INS-PRESS-LL · S4 I.0565 · DI |
| LI1-L-1093 | Boiler bottom ash unloading discharging valve | LI1-L-1093 · S3 I.0175 · DI |
| LI1-S-1090 | Boiler bottom ash transmitter local charging | LI1-S-1090 · S3 I.0490 · DI |
| LI2-S-1090 | Boiler bottom ash transmitter local convoying | LI2-S-1090 · S3 I.0491 · DI |
| LI3-S-1090 | Boiler bottom ash transmitter local cleaning | LI3-S-1090 · S3 I.0492 · DI |
| LI4-S-1090 | Boiler bottom ash transmitter local | LI4-S-1090 · S3 I.0493 · DI |
| LI5-S-1090 | Boiler bottom ash transmitter local reset | LI5-S-1090 · S3 I.0494 · DI |
| LI6-S-1090 | Boiler bottom ash transmitter local buzzer | LI6-S-1090 · S3 I.0496 · DI |
| LI7-S-1090 | Boiler bottom ash transmitter local emergency | LI7-S-1090 · S3 I.0495 · DI |
| LI8-S-1090 | Boiler bottom ash transmitter auto select | LI8-S-1090 · S3 I.0497 · DI |
| LO1-S-1090 | Boiler bottom ash transmitter in charging LCP lamp | LO1-S-1090 · S3 O.0290 · DO-Wet |
| LO2-S-1090 | Boiler bottom ash transmitter in conveying LCP lamp | LO2-S-1090 · S3 O.0291 · DO-Wet |
| LO3-S-1090 | Boiler bottom ash transmitter in cleaning LCP lamp | LO3-S-1090 · S3 O.0292 · DO-Wet |
| LO4-S-1090 | Boiler bottom ash transmitter LCP buzzer | LO4-S-1090 · S3 O.0293 · DO-Wet |
| LO5-S-1090 | Boiler bottom ash transmitter failure LCP lamp | LO5-S-1090 · S3 O.0294 · DO-Wet |
| MFT-IRP | MFT FROM IRP | MFT-IRP · S1 I.000F · DI |
| MFT-PB | Boiler emergency trip P.B. (CRT) | MFT-PB · S4 O.0601 · DO-Dry |
| MFTS-IRP | MFT from IRP | MFTS-IRP · S4 I.0560 · DI |
| MFTT-IRP | MFT FROM IRP | MFTT-IRP · S2 I.000F · DI |
| MFTTT-IRP | MFT FROM IRP | MFTTT-IRP · S3 I.000F · DI |
| MIG-52G1-1 | GCB 52G1 | MIG-52G1-1 · S2 I.0931 · DI |
| MIG-52G1-2 | GCB 52G1 | MIG-52G1-2 · S2 I.0932 · DI |
| MIG-52L1 | GCB 52L1 open for house load operation | MIG-52L1 · S2 I.0937 · DI |
| MIL-SB-APH01 | Sootblower local for air preheater | MIL-SB-APH01 · S2 I.073E · DI |
| MIL-SB01 | Sootblower | MIL-SB01 · S2 I.073F · DI |
| MIT-GENS | Generator | MIT-GENS · S2 O.045F · DO-Dry |
| MIT-SB-APH01 | Sootblower trip for air preheater | MIT-SB-APH01 · S2 I.073D · DI |
| MOP-SB-APH01 | Sootblower cleaning device enable for air preheater | MOP-SB-APH01 · S2 O.077E · DO-Dry |
| MOR-SB-APH01 | Sootblower start command for air preheater | MOR-SB-APH01 · S2 O.077C · DO-Dry |
| MOS-SB-APH01 | Sootblower stop command for air preheater | MOS-SB-APH01 · S2 O.077D · DO-Dry |
| NOT-MFTCP | No boiler trip command (From IRP) | NOT-MFTCP · S4 I.0561 · DI |
| PAF-LL | Primary air flow low low (TO IRP) | PAF-LL · S4 O.0605 · DO-Dry |
| PAF-STOP-CMD | PAF stop command (From IRP) | PAF-STOP-CMD · S4 I.056D · DI |
| PDS_H-BH1750 | Boiler bag filter of bottom ash silo diff. pressure switch | PDS_H-BH1750 · S3 I.0246 · DI |
| PDS_L-BH1750 | Boiler bag filter of bottom ash silo diff. pressure switch | PDS_L-BH1750 · S3 I.0247 · DI |
| S-APAFLOPS | All P.A.F. lube oil pump | S-APAFLOPS · S3 O.077F · DO-Dry |
| S-FBTHH | Furnace bed temperature H.H. | S-FBTHH · S3 O.077E · DO-Dry |
| S-MSPHH | Main steam pressure H.H. | S-MSPHH · S1 O.0177 · DO-Dry |
| SAF-STOP-CMD | SAF stop command (From IRP) | SAF-STOP-CMD · S4 I.056C · DI |
| SIA-CDS01 | Dosing system AC mian power normal | SIA-CDS01 · S1 I.012E · DI |
| TAF-LOW | Total air flow < 25% MCR (TO IRP) | TAF-LOW · S1 O.0170 · DO-Dry |
| TBN-TRIP-OPC | Turbine emergency trip P.B. on (OPC) | TBN-TRIP-OPC · S4 I.1280 · DI |
| TEMP-INDQUATE | Furnace temp. indquate for coal firing (TO IRP) | TEMP-INDQUATE · S4 O.0606 · DO-Dry |
| XA-AFL | Loss of all fuel (TO IRP) | XA-AFL · S4 O.0602 · DO-Dry |

### aux-steam (lane 7)

**AS** (1)

| Equipment | What | Signals (tag · address · type) |
|---|---|---|
| AS1397 | Turbine gland steam line drain motor valve MV-AS1397 | MOR-AS1397 · S2 O.016A · DO-Dry<br>MOS-AS1397 · S2 O.016B · DO-Dry<br>ZSO-AS1397 · S2 I.0250 · DI<br>ZSC-AS1397 · S2 I.0251 · DI<br>MIT-AS1397 · S2 I.0252 · DI<br>MIL-AS1397 · S2 I.0253 · DI<br>TS-AS1397 · S2 I.0254 · DI<br>ZT-AS1397 · S2 AI0743 · AI-Wet |

### condensate (lane 7)

**CD** (12)

| Equipment | What | Signals (tag · address · type) |
|---|---|---|
| CD1116-A1 | Condensate pump-A coupling temperature | TT-CD1116-A1 · S3 AI0965 · AI-Wet |
| CD1116-A3 | Condensate pump-A motor drive end of bearing vibration | VT-CD1116-A3 · S3 AI0853 · AI-Wet<br>TT-CD1116-A3 · S3 AI0963 · AI-Wet |
| CD1116-A4 | Condensate pump-A motor non drive end of bearing vibration | VT-CD1116-A4 · S3 AI0854 · AI-Wet<br>TT-CD1116-A4 · S3 AI0964 · AI-Wet |
| CD1116-AU | Condensate pump-A motor winding temperature (U phase) | TT-CD1116-AU · S3 AI0960 · AI-Wet |
| CD1116-AV | Condensate pump-A motor winding temperature (V phase) | TT-CD1116-AV · S3 AI0961 · AI-Wet |
| CD1116-AW | Condensate pump-A motor winding temperature (W phase) | TT-CD1116-AW · S3 AI0962 · AI-Wet |
| CD1116-B1 | Condensate pump-B coupling temperature | TT-CD1116-B1 · S3 AI0981 · AI-Wet |
| CD1116-B3 | Condensate pump-B motor drive end of bearing vibration | VT-CD1116-B3 · S3 AI0869 · AI-Wet<br>TT-CD1116-B3 · S3 AI0979 · AI-Wet |
| CD1116-B4 | Condensate pump-B motor non drive end of bearing vibration | VT-CD1116-B4 · S3 AI0870 · AI-Wet<br>TT-CD1116-B4 · S3 AI0980 · AI-Wet |
| CD1116-BU | Condensate pump-B motor winding temperature (U phase) | TT-CD1116-BU · S3 AI0976 · AI-Wet |
| CD1116-BV | Condensate pump-B motor winding temperature (V phase) | TT-CD1116-BV · S3 AI0977 · AI-Wet |
| CD1116-BW | Condensate pump-B motor winding temperature (W phase) | TT-CD1116-BW · S3 AI0978 · AI-Wet |

### generator (lane 7)

**DO** (4)

| Equipment | What | Signals (tag · address · type) |
|---|---|---|
| DO1001 | Turbine gland steam line drain valve auto | TCS-DO1001 · S2 O.048F · DO-Dry |
| DO1002 | DCS control mode | TCS-DO1002 · S1 O.0178 · DO-Dry |
| DO1003 | DCS control mode | TCS-DO1003 · S1 O.0179 · DO-Dry |
| DO1006 | Auto synchro. | TCS-DO1006 · S2 O.0492 · DO-Dry |

**DI** (33)

| Equipment | What | Signals (tag · address · type) |
|---|---|---|
| DI1003 | Turbine | TCS-DI1003 · S2 I.0400 · DI |
| DI1024 | RSV / ICV fully closed 1 | TCS-DI1024 · S2 I.0401 · DI |
| DI1025 | RSV / ICV fully closed 2 | TCS-DI1025 · S2 I.0402 · DI |
| DI1026 | MSV / HPCV fully closed and TCS major trouble 1 | TCS-DI1026 · S2 I.0403 · DI |
| DI1027 | MSV / HPCV fully closed and TCS major trouble 2 | TCS-DI1027 · S2 I.0404 · DI |
| DI1028 | CV & ICV full closed by PLU activation | TCS-DI1028 · S2 I.0405 · DI |
| DI1029 | Turbine speed under 2400 RPM | TCS-DI1029 · S2 I.0406 · DI |
| DI1030 | Turning gear engaged | TCS-DI1030 · S2 I.0417 · DI |
| DI1031 | ICV to CV transfer complete | TCS-DI1031 · S2 I.0418 · DI |
| DI1032 | Steam seal feed inlet valve | TCS-DI1032 · S2 I.0419 · DI |
| DI1033 | HP turbine warming line drain valve | TCS-DI1033 · S2 I.0407 · DI |
| DI1034 | HP turbine warming line drain valve | TCS-DI1034 · S2 I.0408 · DI |
| DI1037 | Turbine gland steam line drain valve | TCS-DI1037 · S2 I.040B · DI |
| DI1038 | Turbine gland steam line drain valve | TCS-DI1038 · S2 I.040C · DI |
| DI1039 | Turbine start-up ambient cold mode | TCS-DI1039 · S2 I.0410 · DI |
| DI1040 | Turbine start-up cold 1 mode | TCS-DI1040 · S2 I.0411 · DI |
| DI1041 | Turbine start-up cold 2 mode | TCS-DI1041 · S2 I.0412 · DI |
| DI1042 | Turbine start-up warm mode | TCS-DI1042 · S2 I.0413 · DI |
| DI1043 | Turbine start-up hot mode | TCS-DI1043 · S2 I.0414 · DI |
| DI1044 | Turbine load hold | TCS-DI1044 · S2 I.0415 · DI |
| DI1046 | DCS control mode permissive | TCS-DI1046 · S1 I.0081 · DI |
| DI1047 | DCS control mode on feedback | TCS-DI1047 · S1 I.0082 · DI |
| DI1048 | MODBUS line-A duty | TCS-DI1048 · S2 I.040D · DI |
| DI1049 | MODBUS line-B duty | TCS-DI1049 · S2 I.040E · DI |
| DI1050 | HP-CV | TCS-DI1050 · S2 I.041D · DI |
| DI1051-1 | MSV(A) test | TCS-DI1051-1 · S2 I.041E · DI |
| DI1051-2 | MSV(B) test | TCS-DI1051-2 · S2 I.041F · DI |
| DI1052 | 41 | TCS-DI1052 · S2 I.0939 · DI |
| DI1053 | GEN. LOCK OUT RY86GA OPERATED | TCS-DI1053 · S2 I.093A · DI |
| DI1054 | GEN. LOCK OUT RY86GB OPERATED | TCS-DI1054 · S2 I.093B · DI |
| DI1055 | Turbine trip-2 | TCS-DI1055 · S2 I.0416 · DI |
| DI1057 | AMB. Cold mode temp. | TCS-DI1057 · S2 I.089C · DI |
| DI1058 | Mode judgement instrument normal | TCS-DI1058 · S2 I.089D · DI |

**AI** (10)

| Equipment | What | Signals (tag · address · type) |
|---|---|---|
| AI1003 | Generator watt-hour | GCP-AI1003 · S1 AI0694 · PI |
| AI1004 | Turbine rated speed | TCS-AI1004 · S2 AI0534 · AI-Dry<br>GCP-AI1004 · S2 AI0775 · AI-Dry |
| AI1005 | Max turbine load up rate set point | TCS-AI1005 · S1 AI0421 · AI-Dry<br>GCP-AI1005 · S2 AI0807 · AI-Dry |
| AI1006 | Generator var-hour | GCP-AI1006 · S1 AI0696 · PI<br>TCS-AI1006 · S2 AI0791 · AI-Dry |
| AI1007 | GEN. current (B) | TCS-AI1007 · S2 AI0855 · AI-Dry |
| AI1008 | GEN. voltage (B-C) | TCS-AI1008 · S2 AI0871 · AI-Dry |
| AI1009 | GEN. power factor | TCS-AI1009 · S2 AI0823 · AI-Dry |
| AI1010 | GEN. frequency | TCS-AI1010 · S2 AI0839 · AI-Dry |
| AI1011 | GEN. current(C) | TCS-AI1011 · S2 AI0887 · AI-Dry |
| AI1012 | GEN. voltage (C-A) | TCS-AI1012 · S2 AI0903 · AI-Dry |

**AO** (9)

| Equipment | What | Signals (tag · address · type) |
|---|---|---|
| AO1001 | Target MW for coordination control load demand | TCS-AO1001 · S1 AO0359 · AO(D) |
| AO1002 | Generator MW (D) | GCP-AO1002 · S2 AO0487 · AO |
| AO1003 | Generator MVAR | GCP-AO1003 · S2 AO0470 · AO |
| AO1004 | Generator voltage (A-B) | GCP-AO1004 · S2 AO0486 · AO |
| AO1005 | Generator voltage (B-C) | GCP-AO1005 · S3 AO0582 · AO |
| AO1006 | Generator current (A) | TCS-AO1006 · S2 AO0405 · AO<br>GCP-AO1006 · S3 AO0583 · AO |
| AO1007 | Generator current (B) | TCS-AO1007 · S2 AO0406 · AO<br>GCP-AO1007 · S3 AO0886 · AO |
| AO1008 | Generator frequency | GCP-AO1008 · S3 AO0887 · AO |
| AO1011 | Generator current (C) | TCS-AO1011 · S2 AO0407 · AO |

### reheat (lane 7)

**CR** (1)

| Equipment | What | Signals (tag · address · type) |
|---|---|---|
| CR1013 | Cold reheat drain pot DP-CR03 drain valve close solenoid (not used) | XV-CR1013 · S2 O.012F · DO-Wet<br>ZSO-CR1013 · S2 I.089E · DI<br>ZSC-CR1013 · S2 I.089F · DI |
