# Phase 11 rule 0 cleanup (SUZU), batch 1: the 150 MW start line-up and the old screen table reads (2026-11-28)

Rule 0 (user 2026-11-28): walang plant screen, trend o SOP sa plant model. Ang source ay design data, logic at physics.

Binago:
- `src/world/ditl150.js` (78 -> 0 na screen reference):
  - Ang line-up ng equipment at valve sa full load ay galing na sa HB PPE-14-0725 case 1, FHI, IHI, P&ID (YUA read `suzu-lineup-design-reads-2026-11-28.md`) at sa logic (standby sa AUTO para sa auto start).
  - Ang duty na walang design document ay may markang NO-SOURCE: BFWP duty count, PAF lube oil pump, MWP, air compressor / dryer duty, polisher, gland desuperheater.
  - Ang analog seeds ng DITL comparators ay galing sa design: condenser 0.071 ata (HB case 1), HP / LP bypass 0 % (HB case 1, walang bypass flow), extraction MOV 100 %, RH outlet 541 C (FHI), IA 0.700 MPa (IHI, AN_AIR_SP).
  - Ang mga FA blower save-migration line-up ay galing na sa DITL-28A / 28C start permissive (dati PR-OPE).
  - Tinanggal ang pagbasa ng old screen bit table (AN.hmiDI): ang logic na ang nagbibigay ng estado.
- `src/analog/engine/unit.js` (103 -> 90):
  - Ang bed thermocouples TT-FG1090 / 1091 A ~ I ay hinahanap na sa DCS I/O list address (AN_IO_T), hindi sa screen table. Ang basa nila ay ang bed temperature U.Tb (well-mixed bed; ang spread ng bawat thermocouple ay NO-SOURCE). Ang seal pot = bed. Ang cyclone outlet = gas na lumalabas sa cyclone (anHxRun, physics na).
  - Ang APH air temperatures at SA pressures ay hinahanap sa I/O list address.
  - TT-MS1022 anchor = ang start state (hindi na ang screen 359 C).
  - Ang transmitter na wala sa sheet ay wala nang screen value (aiH).
  - Ang anGasA0 (screen values ng thermocouples) ay binura.

Hindi nakakabit (bug para sa link lane, nananatili sa design seed): DITL-03H r10 / r11 TIHR10021 / 10022.PV, r17 ZT-MS1020, r23 ZT-HR1010; DITL-94 ~ 98 r27 extraction MOV position AI0738 ~ 0742.

Sinubok (headless): 150 MW start: bed thermocouples = U.Tb 873.9, 151 MW. Cold: bed 30 C, cyclone / seal pot 30 C. Guards PASS. tests/regress/ditl150.js ay bumabagsak din sa main (MFT pagkatapos ng 60 s), hindi galing dito.

Susunod (batch 2): ang mga value ng start-up model na galing sa operating procedure (coal / diesel 2.55, unang load 4.5 MW, load rate, burn temperature) at ang natitirang history comments sa unit.js.
