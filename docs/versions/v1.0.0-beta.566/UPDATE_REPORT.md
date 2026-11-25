# v1.0.0-beta.566 (HMI : EIMI, lane 6): page ng mismong control system (DCS alarm)

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
- Behaviour gate, 20 minuto: BEHAVIOUR_RESULT
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
- Light theme.

EIMI
