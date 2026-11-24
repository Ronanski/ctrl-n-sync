# v1.0.0-beta.524 — Class D links ng BOP (lane 4, DCS LINKS BOP : RARA)

## Ano ang bago
- `src/world/bind/bop.json`: 10 bind row gamit ang text-row ng beta.520 (PR 549).
  - DITL-38 MOTOR CONTROL VALVE: ang MCV OPEN / CLOSE COMMAND ng kopya ng bawat valve ay may sariling I/O address na: MOR-BD1002 O.0212 (STN101); MOS-FW1001 O.0131, MOR / MOS-FW1002 O.044C / D, MOR / MOS-FW1392 O.044E / F, MOR / MOS-MS1392 O.016C / D (STN102). Ang MCV REMOTE MODE SELECTED ng MV-MS1392 = MIL-MS1392 I.0333.
  - DITL-112 #C: make-up water pump C start permission MOP-P0709C O.037F (ang B ay O.037E na, sa "0." to "O." parse ng beta.520).
- `src/world/field/bop.js`: ang FT-HD1102 / FT-HD1103 ay hindi lumalampas sa range ng transmitter (alarm list FT.csv 12-13: 0-27.5 / 0-15 t/h); wala sa anumang sheet ang AI, kaya walang AI block na nagka-clamp. Source ng lokasyon: PD-018 rev D (RB p12), normal drain bago ang LCV-...-1.
- `tests/lanes/integrator/lane-data.cjs`: dalawang nawawalang backslash sa format check ng text row (`/ #\S/`, `/^AI\d{4}$/`); dati ay tinatanggihan ang bawat text row na tama ayon sa README.

## Batayan
- DCS I/O list STN101 / 102 / 105 (`src/ui/plant/wiring.js`), DITL-38 (text ng drawing: MCV OPEN COMMAND, MCV CLOSE COMMAND, MCV REMOTE MODE SELECTED), DITL-112 "O.0044/0.037E/ O.037F".
- Hindi naka-bind: TS-MS1391 I.032E / TS-MS1392 I.0334 (torque). Walang torque input row ang DITL-38; ang "MCV CLOSE TORQUE" ay nasa output side (RS row 10, CRT).

## Test
- Headless 150 MW: bawat address ay nasa sarili nitong kopya lang ("MCV OPEN COMMAND MOR-FW1002 O.044C" sa #MV-FW1002), ang DITL-112 #C ay "O.037F/ MOP-P0709C". Walang page error.
- QA trace (main tool, 10 min): ang 147 BOP points LINKED 24 -> 51, UNLINKED 64 -> 25 (kasama ang TAGA rule ng beta.520). Ang 7 STN102 output at I.0333 ng DITL-38 ay "on drawing, not on a row" pa sa trace: binabasa ng trace ang "STATION 101 & 102" ng DITL-38 bilang 101 (para sa QA).
- Lanes tests, build check, no-fit, version check.

RARA
