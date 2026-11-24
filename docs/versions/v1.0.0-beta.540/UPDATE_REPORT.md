# v1.0.0-beta.540 (LEADER : YUA, lane 0): I/O address ng 8 valve ng DITL-38

## Ano ang nagbago
- **DITL-38** (SAORI): iisang drawing ito para sa 8 motor valve (MV-BD1001, BD1002, FW1001, FW1391, FW1002, FW1392, MS1391, MS1392) at walang address sa drawing. Ngayon, nakalagay na sa kopya ng bawat valve ang sarili nitong 7 point mula sa I/O list: MIL, MIT, ZSO, ZSC, TSC (TS), open command (MOR) at close command (MOS). 56 point lahat. Halimbawa: MV-FW1001 ay ZSO-FW1001 I.0000, MOR-FW1001 O.0130.
- Kapag nag-bind din ang isang lane sa parehong text, isang beses lang lalabas ang point.
- Walang ZT (analog position) sa I/O list ang 8 valve na ito, kaya walang inilagay.
- Sinuri ang ibang drawing: DITL-38 lang ang typical na walang tag; ang ibang MOV drawing ay tig-isang valve.
- Bagong test: tests/lanes/integrator/ditl38-points.cjs.

## Sinuri
- Luma laban sa bago, 5 minuto sa 150 MW: walang nagbago sa takbo. Text at link ng ibang drawing: pareho.
- Tiningnan ang drawing: kasya ang mga text sa tabi ng wire.
- build at check: SAME; no-fit: 0 bago; tests/lanes/run-all.cjs: pasado

YUA
