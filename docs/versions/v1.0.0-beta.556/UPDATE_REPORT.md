# v1.0.0-beta.556 (HMI : EIMI, lane 6): lahat ng boiler point ng I/O list, nasa HMI na

## Ano ang nagbago
- **Dalawang bagong page:** "Wall dampers" (22 hangin na damper ng furnace: controller, posisyon, limit, trip, torque, REMOTE / LOCAL) at "Bottom ash recycle" (P&ID K1AU3-PD-071 sheet 2: buffer tank, ash transmitter, mga valve, 15 hakbang ng sequence, local panel).
- **Ash page:** may START / STOP na ang chain conveyor, bucket elevator, screw conveyor, vibrating screen, bag filter fan; OPEN / CLOSE ang two-way separator; RESET / EMERGENCY STOP ang conveyors; START / STOP / RESET / EMERGENCY STOP ang ash transmitter. Ang mga button ay ang CRT push button ng DITL-BA61 at DITL-BA02. May pangalawang faceplate (permissive, monitor) ang bawat isa, at bawat row ay nakaturo sa row ng DITL.
- **Iba pang boiler page:** idinagdag ang natitirang point ng combustion air, furnace at flue gas, purge at trip, limestone at sand, coal feeder, at sootblower bilang row ng pangalawang faceplate o state block.
- **Shared core:** ang controller, kagamitan at makina ay maaaring may sariling permissive at monitor row (PERMISSIVE · TREND · MONITOR). Ang halaga na walang pinanggagalingan ay `-----`.
- **Ayos ng mali:**
  - Ang valve na may tag number ay nagsasabing "In service" (XV-LM1811A ~ H, two-way separator). Ngayon: Open / Closed.
  - Ang LT-BH1750 ay nakasulat na metro; porsyento ito (alarm list HIGH 90, LOW 40). Puno ang guhit ng silo; ngayon 15.8 %.
  - Natakpan ang pangalan ng SOx controller; inilipat.
  - Masikip ang monitor rows ng pangalawang faceplate; ngayon isang linya ang pangalan at nasa iisang hanay ang halaga.
  - DITL-43 O.0206 at O.0208: naitama ang address sa netlist.
- **Bagong test:** `tests/regress/hx_ash_press.js`.

## Sinuri (headless, sariling clone, 150 MW)
- Gap tool laban sa I/O list at alarm list: 0 ang kulang sa mga boiler page. Natitira at hindi akin: PS / LS-LO1115 at MIG / MIT-GENS (lane 7), PT-IA1128, M0703 air compressors (wala sa saklaw).
- `hx_ash_press`: 8 makina; bawat pindot ay umabot sa DITL-BA61 / BA02, bukas ang dalawang faceplate, walang page error.
- `hx_unknown`, `hx_fp_mon`, `values_layout`, `bottom_ash`, `ditl_ba`: PASS.
- Siyam na page: tiningnan ang screenshot.
- build `--check` SAME; version-check, operator-text-check, no-fit: PASS.

## Mga nakita

| # | Nakita | Rekomendasyon |
|---|---|---|
| 1 | Sa 150 MW, RUNNING ang chain conveyor, elevator at screw habang 0 ang ON command nila; ang limit ng two-way separator ay 0 pareho sa simula, kaya N ang permissive ng screw | Plant model (lane 3): ang simulang estado ng bottom ash ay dapat galing sa utos ng logic |
| 2 | Apat na ash cooler ay stopped sa 150 MW habang tumatakbo ang conveyor | Lane 3: alamin kung tama ito sa PR-OPE-5002 (cycle mode 15 minuto) |
| 3 | Air heater secure power supply, DITL-43 out row 12, ay 0 sa 150 MW | Lane 3: i-link ang field contact |
| 4 | ZSO / ZSC-FA1019 ~ FA1026 walang field row | Lane 3: idagdag sa `src/world/field/boiler.js` (ang ZT ay AI0416 ~ 0423) |
| 5 | Ang PS-IA1061 (air tank ng coal feeder) ay walang drawing na bumabasa | Iwan na `-----` hanggang may makitang drawing |
| 6 | Ang `ash_fp` at `ashcool` ay bumabagsak; pareho rin sa main (beta.550). Ang una ay bumubukas ng lumang page na wala na; ang pangalawa ay sa tubig ng stopped cooler | Ayusin ang `ash_fp` sa HX page (lane 6, susunod); lane 3 para sa `ashcool` |
| 7 | Ang V-BH1758 at ZV-BH1750 ay dalawang beses sa P&ID; ang inlet gate valve ay XV-BH1751 sa P&ID at BH1759 sa I/O list | Iwan; nakasulat sa page ang dalawang pangalan |

## Hindi nasubok
- Pindot ng tao sa totoong browser at sa tablet.
- Buong pag-ikot ng ash recycle mula START sa HMI (may sariling test ang logic: `bottom_ash`).

EIMI
