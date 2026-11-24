# v1.0.0-beta.535 (ALARMS AND CURVES : AKIHO, lane 5): alarm line mula lang sa point na may tunay na source, at ang switch alarms

## Ano ang nagbago
- **Alarm line ng alarm list (src/analog/engine/alarm-pri.js AN.laneAlm):** lumalabas lang kapag may NAKAREHISTRONG SOURCE ang point (isang signal, isang source; src/world/field/README.md):
  - analog: may field row ang station / address o tag (AN.fieldRead), o ang AI ay sinusulatan ng plant model (`s.src`, idadagdag ng LEADER : YUA sa unit.js at plant.js). Ang seed ng 150 MW snapshot at ang hindi naka-link na transmitter ay hindi source.
  - switch (68 row): ang switch ng tag na pinapagalaw ng plant model o ng DI field row (WORLD.plantSw). Alarm kapag nasa estado ng alarm ang switch.
  - Inalis ang lumang "gumalaw ba ang value" na stop-gap ng beta.515.
- **4 switch row na `on: 0`** (alarm kapag OFF ang switch, dahil ang ON ay normal): SS-BH1060-B / C / D (speed switch ng ash cooler, ON habang umiikot, DITL-21A "SPEED NOT LOW"), PS-LO1115-B2 ("> 2.0 kg/cm2", ON kapag may lube oil pressure). Source: I/O list description at src/world/plantsw.js.

## Epekto sa app
- Sa 150 MW (station page, Worker, 3 plant min, walang ginalaw), may `s.src` na ni YUA (beta.530): line mula sa alarm list: 1 (main beta.530) -> 10:
  - FT-MS1031 HIGH (main steam flow 472.x > 472.5; ang snapshot ng planta ay 472.7), PT-SW1110-B1 LOW (list 3.0; ang A1 / A2 / B2 ay 0.3, tanong sa user).
  - PT-DO1043-A2 / B2 / C2 / D2 LOW (gun oil pressure 0 < 0.8: nakapatay ang burners sa 150 MW), FT-CD1121 LOW (polisher inlet flow, bypass bukas).
  - SS-BH1060-B / C / D ALARM: nakatigil ang bottom ash cooler B ~ D sa 150 MW na save (pati A). Tunay na estado ng switch.
- Lalabas ang alarm ng isang point sa sandaling idagdag ng isang lane ang field row nito; walang babaguhin sa src/data/alarms.

## Sinuri
- tests/lanes/lane5/alarm-live.cjs (7 kaso): walang source = walang line; may model source = isang HIGH-HIGH; snapshot seed = wala; field row = isang LOW; nasa scan na = walang doble; switch 1 / 0 / walang source; speed switch OFF = alarm, ON = wala.
- tests/lanes/lane5/alarm-rows.cjs: 705 row, 0 problema.
- Station page 150 MW, 3 plant min: walang page error.

## Hindi pa nasubok
- Ang DITL-07 machine #B ~ #D ay may tag na "-A1" sa plantsw (hindi pinapalitan ang letra), kaya ang PSL-PA1043-C1 / D1 at PSL-DO1043-C1 / D1 ay walang source pa.

AKIHO
