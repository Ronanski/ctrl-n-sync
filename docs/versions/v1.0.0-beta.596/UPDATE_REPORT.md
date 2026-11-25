# v1.0.0-beta.596 (HMI : EIMI, lane 6): page ng control system, at lahat ng boiler point ng I/O list

# Bahagi 1: page ng mismong control system (DCS alarm)

## Ano ang nagbago
- **Bagong page: "Control system"** (grupo Unit). Nasa isang drawing ang operator station, dalawang control network, 12 control cabinet, relay panel, sequence of events recorder, power panel at gateway (K1AU3-E2-0-106). Nakasulat sa bawat cabinet kung NORMAL o ALARM; umiilaw ang lamp kapag may alarm. Ipinapakita ng putol-putol na linya kung aling station ang bumabasa ng alarm.
- **18 alarm contact ng I/O list, may pinanggagalingan na** (`src/world/field/dcs.js`). Puwedeng itakda ng instructor ang bawat fault sa Plant menu, grupo "Electrical and generator".
- **DITL-42 (annunciator):** ang row 6 "ARP SYSTEM ALARM" at row 7 "IRP POWER SUPPLY FAULT" ay nakakabit na sa dalawang contact na iyon. Dati, laging 0.
- **Shared core:** ang value na on / off ay puwedeng salita sa mismong drawing (`V` na may `words`; `warn` = ang halagang alarm). May tuldok na sa dugtungan ng signal line. Bagong simbolo: cabinet, operator station, server.
- **Bagong test:** `tests/regress/hx_dcs_alarm.js`.

## Saan galing ang normal na estado ng contact

| Contact | Sa normal | Pinagmulan |
|---|---|---|
| ARP1, IRP1 | 0 | K1AU3-E2-0-114 sheet 6 at 7: normally closed contact ng power fail relay na laging may kuryente |
| PDP1 | 1 (fault = 0) | K1AU3-E2-0-111 sheet 7: healthy contact ng dalawang power supply, naka-series |
| FCS, GCS, SER cabinet | 0 | K1AU3-E2-0-109, 112, 115: SYSTEM ALM output ng alarm unit HALMA-12; ang uri ng contact ay hinango (tingnan ang nakita 2) |

## Sinuri (headless, sariling clone, 150 MW)
- `hx_dcs_alarm`: 18 fault, isa-isa; tamang cabinet lang ang nag-ALARM; umabot sa DITL-42 ang ARP at IRP; bumukas ang pangalawang faceplate; walang page error.
- `hx_unknown`, `hx_fp_mon`, `values_layout`, 14 na lane test, operator-text, no-fit: PASS. Build `--check`: SAME.
- Behaviour gate, 20 minuto: PASS (pareho ang dalawang takbo; pareho pagkatapos ng save / load).
- Tiningnan ang screenshot ng page, ng ALARM at ng faceplate.

## Mga nakita

| # | Nakita | Rekomendasyon |
|---|---|---|
| 1 | PDP-PLOSS (I.069F): "fault" ang pangalan pero 1 ang normal ayon sa wiring | Panatilihin ang wiring; kumpirmahin sa planta kung may makuhang DCS point view |
| 2 | Hindi nakasulat sa drawing kung normally open ang SYSTEM ALM ng HALMA-12. Ginamit ang "gumagawa kapag may alarm", gaya ng ARP at IRP | Palitan ang `normal` sa `dcs.js` kapag nakuha ang HALMA-12 manual |
| 3 | Walang modelo ang hardware ng cabinet: hindi tumitigil ang controller kapag may alarm | Tama ito para sa alarm; kung gusto ng controller failure training, hiwalay na trabaho ng engine (lane 0) |
| 4 | Ang lamp na "#1 ARP SYSTEM ALARM" (annunciator G6, O.1401) ay hindi pa sinusundan mula DITL-42 hanggang lamp | Lane 6, sa susunod na pag-ikot ng annunciator |

## Hindi nasubok
- Pindot ng tao sa totoong browser at tablet.
- Light theme ng Control system page.


# Bahagi 2: lahat ng boiler point ng I/O list, nasa HMI na (dating beta.556)

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
| 4 | ZSO / ZSC-FA1019 ~ FA1026: may field row na mula sa beta.553 (lane 3) | Tapos |
| 5 | Ang PS-IA1061 (air tank ng coal feeder) ay walang drawing na bumabasa | Iwan na `-----` hanggang may makitang drawing |
| 6 | Ang `ash_fp` at `ashcool` ay bumabagsak; pareho rin sa main (beta.550). Ang una ay bumubukas ng lumang page na wala na; ang pangalawa ay sa tubig ng stopped cooler | Ayusin ang `ash_fp` sa HX page (lane 6, susunod); lane 3 para sa `ashcool` |
| 7 | Ang V-BH1758 at ZV-BH1750 ay dalawang beses sa P&ID; ang inlet gate valve ay XV-BH1751 sa P&ID at BH1759 sa I/O list | Iwan; nakasulat sa page ang dalawang pangalan |

## Hindi nasubok
- Pindot ng tao sa totoong browser at sa tablet.
- Buong pag-ikot ng ash recycle mula START sa HMI (may sariling test ang logic: `bottom_ash`).

EIMI
