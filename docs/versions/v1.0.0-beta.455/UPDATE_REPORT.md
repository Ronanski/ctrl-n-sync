# v1.0.0-beta.455 (ALARMS AND CURVES : AKIHO, lane 5): alarm list rows at DITL-80L

## Ano ang nagbago
- **Alarm list sa app (src/data/alarms, 24 group file):** 371 points mula sa "Alarm List _20160912" na may I/O address at set point o switch, pero wala pang ABC alarm block: 705 row (isang row bawat level: HIGH-HIGH, HIGH, LOW, LOW-LOW, switch). Bawat row ay may sheet at PD page ng list, station at address ng I/O list.
- **DITL-80L (STN102, SOOTBLOWER CONTROL LOGIC DIAGRAM (13)) ay nasa app na**, binuo mula sa drawing (tools/data/ditl80l_build.py): ALL RETRACT M.4008, ANY EXTEND M.4232, at ang tatlong group summary M.4246 / M.4247, M.4240 / M.4241, M.4242 / M.4243. Ang 48 lance input na nasa drawing bilang "(SAME AS ABOVE)" ay hidden rows na may address mula sa I/O list.

## Epekto sa app
- Ang priority ng alarm na may tag ng row ay galing na sa row (parehong rule ng alarm-pri.js).
- **Alarm line mula sa row:** lumalabas lang kapag LIVE ang value ng transmitter (gumagalaw habang tumatakbo ang oras ng planta). Ang point na walang nagsusulat (0 ng hindi naka-link, o seed ng 150 MW snapshot) ay tahimik. Hindi dinodoble ang alarm na nasa scan na (ALM block o comparator ng drawing, parehong panig). Isang tawag lang sa alarm scan (src/ui/hmi/events.js), ang lohika ay nasa src/analog/engine/alarm-pri.js AN.laneAlm.
- Sa 150 MW (5 min, walang ginalaw): 14 ng 371 points ang may value; FT-MS1031 main steam flow HIGH 472.5 ay lumalabas-nawawala (472.8 sa 3 min). Listahan: lane 5 standing-alarms-150MW-2026-11-25.md.
- Bagong sheet sa DITL list: (S15)DITL-80L. Ang JS stand-in ng plantsw.js para sa M.4008 / 4232 / 4240 ~ 4247 ay hindi pa inaalis (LEADER : YUA, kapag naka-link na ang rows).

## Sinuri
- tests/lanes/lane5/alarm-rows.cjs: 705 row, 0 problema (src, level / priority, walang doble, address at tag tugma sa I/O list, HH >= H, LL <= L).
- tests/lanes/lane5/alarm-live.cjs: paused = walang line; gumagalaw na PT-MS1002 > 134 = isang HIGH-HIGH line; nakatayong 0 = wala; nasa scan na = walang doble.
- Station page sa 150 MW, Worker engine, 3 at 5 plant min: walang page error.
- tests/lanes/lane5/ditl80l.cjs: 16 gate, 60 input, 10 output; lahat retracted, N-1020 / N-1030 / N-1036 extended, APH away: tama ang 8 output.

## Hindi pa nasubok
- Ang switch rows (digital input, 100 row) ay priority lang pa; ang alarm line nila ay kasunod.
- Ang point na may model value pero hindi gumagalaw (FT-CD1121 0.2 sa 150 MW) ay hindi pa lumalabas hanggang gumalaw.
- Ang hitsura ng 80L sa Engineer pane laban sa PDF.

AKIHO
