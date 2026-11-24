# LMYP OTS 1.0.0-beta.422 (TCS IO : TSUBASA, lane 2, 2026-11-25)

Sumunod sa beta.418. Data, binding at test lang (headless). Walang pagbabago sa plant model, sa HMI at sa tumatakbong app: ang mga bagong file ay hindi pa naka-load sa page (gagawin ng engine owner).

## Ano ang bago

| # | Ano | Detalye | Pinagmulan |
|---|---|---|---|
| 1 | TCS I/O list sa app | `src/data/tcs-io.json`: 27 PI/O table (TCE9xx EHG, TCA9xx COMM), 784 channel, 507 gamit, 277 spare. Bawat gamit na channel ay may sheet pin (ang logic sheet na may PI/O box nito). Gawa ng `tools/data/tcs_io.mjs` (`--check` sa test) | 331DM09784 / 09788 (typed sheets), XSMM_IO_List_R1 "IO LIST R.1 (3)" (279 channel may XSMM row) |
| 2 | Dulo ng bawat channel | `src/digital/tce-io.js`: model 117, out 137, sys 39, DCS 19, fault 20, needs 175. Ang "needs" ay may nakasulat kung anong model ang kulang (drain MOV, NRV, generator Mvar / current / pf / field, AVR, TSI setting, rotor position, diff expansion, TCS cabinet) | tcs.js, tcs-trip.js, tcs-gen.js (basa lang) |
| 3 | DCS point na TCS / GCP | `src/data/tcs-dcs.json` rows: 68 ng 68 point ng DCS I/O list na may tag na TCS- / GCP- / TBN-TRIP / MIT-GEN, bawat isa may TCS end (PI/O row, IBD net, Modbus o generator panel) | ades.txt, XSMM, IBD 310SC90-794 |
| 4 | Modbus TCS <-> DCS | `src/data/tcs-dcs.json` modbus: 252 row (PLC to DCS 227, DCS to PLC 25). 237 may pangalan, lahat may end; 15 blangko (walang tag at walang description sa listahan) = spare. Ang "258" ng lumang bilang ay ang 230 + 28 row ng dalawang sheet kasama ang 3 heading row bawat isa | LMYP-1 #1-MODBUS Communication list between DCS and turbine system.xls |
| 5 | Ports ng TCS sheet program | 436 ng 474 PIO port nasa table row. Ang 38 ay hindi PI/O: 28 delay timer "DI" ng G sheets, 9 TRIPLE DETECTOR / 2OO3 block ng TCE060 ~ 069, 1 halimbawa "(TCS400-1)" sa LOGIC EXPLANATION SHEET TCE022 (reader ng lane 1) | tests/tce/sheets.cjs --list |

Hindi ito `src/world/bind/` file: ang rows doon ay FROM reference ng DITL / ABC drawing (README ng PR 0); ang TCS links ay ibang hugis.

## Sinubok

- `node tests/lanes/tcs-io/io.cjs`: 14 PASS (list = sheets, pin at end ng bawat row, 68 DCS point, Modbus 227 + 25, ports, reads).
- Live, headless sa tunay na page sa 150 MW (Normal operation at full load, 151 MW): 208 ng 214 table value at 152 ng 161 Modbus value may numero (hal. MSV inlet 122.3 kg/cm2, speed 3598 rpm, CV 97.5 %, ATS step 7 completed, ventilator valve sarado, blowdown valve sarado).

## Hindi sinubok / natitira

- Ang 9 na value na walang numero sa page (MSV inlet temp A ~ D, hot reheat temp at press, HP exhaust press A ~ C): kailangan ng `AN.tceSteam` at `AN.tceCrp` sa api.js (engine owner).
- Hindi pa naka-load sa app; walang shadow run laban sa tcs.js. 175 channel "needs".

## Susunod

Engine owner: i-load ang tce-io.js at tcs-io.json, ang dalawang export. Lane 1: ang 38 kahon na hindi PI/O.
