# v1.0.0-beta.530 (LEADER : YUA, lane 0): field state, DITL-80L links, CEP winding

## Ano ang nagbago
- **Field state** (hiling nina KIRARA at RARA): may paraan na ang mga lane para sa field device na walang physics sa model (knife gate, belt tracking, pit switch). Nakatayo ito sa normal na posisyon ayon sa dokumento, at ang instructor lang ang nakakapagbago (Plant menu). Kasama sa save.
- **Bagong reader ng field row**: X.ftrip (field trip ng motor drawing), X.fault (trainer fault, pati black-out el.1am), X.state (field state).
- **s.src** (AKIHO): may marka na ang bawat point na sinusulat ng model o ng field row, para makilala sa 150 MW snapshot.
- **DITL-80L** (sootblower): ang M.4008, M.4232, M.4240 hanggang 4243, 4246, 4247 at ang reset ng N-1040 / N-1042 ay galing na sa drawing papunta sa 80 / 80A / 80G (14 na kopya) / 80K / 80S / 80O. Tinanggal ang mga pansamantalang switch. Ang 60 limit switch ng 80L ay binabasa ang posisyon ng lance at ng APH sootblower ng model.
- **Condensate pump A / B**: temperatura ng winding U / V / W (DITL-61B row 12 hanggang 14) mula sa TECO data sheet (35.2 A, 80 C sa rated; K1AU3-D1-0-044 R0 p24). Walang value ang coupling, bearing at vibration: wala sa dokumento, kaya walang inilagay.
- **Save**: hindi na kasama sa save ang table ng mga motor (AN_MT, puro design data); natatakpan ng lumang save ang bagong motor. Ang tumatakbong temperatura ay nasa AN_UNIT.mt pa rin.
- **DITL-120 #B** (RARA): row 13 ay IWP A (I.0006) at row 14 ay IWP B (I.0326), gaya ng drawing. Dati ay baligtad.
- **PS-LO1115-A1~A3 at B1~B3** (AKIHO): may source na sa DITL-23B at #B (dati sa address lang ng DITL-23A).
- tests/lanes/integrator/lane-data.cjs (RARA): naitama ang dalawang regex na tumatanggi sa tamang text row.
- Bagong test: tests/lanes/integrator/field-state.cjs. README ng src/world/field.

## Sinuri
- Luma laban sa bago, 10 minuto sa 150 MW (Node): iba lang ang DITL-80L (dati patay) at ang row 8 ng DITL-23B at #B (lube oil > 2.0, tumatakbo ang LOP). Pareho ang lahat ng iba.
- DITL link: idinagdag lang ang 80L at naituwid ang DITL-120 #B; walang ibang nagbago.
- build at check: SAME; no-fit: 0 bago; tests/lanes/run-all.cjs: pasado

YUA
