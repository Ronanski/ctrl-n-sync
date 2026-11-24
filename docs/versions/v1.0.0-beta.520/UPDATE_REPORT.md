# v1.0.0-beta.520 (LEADER : YUA, lane 0): linker ng mga kopya ng makina (hiling ng lane 3 at 4)

## Ano ang nagbago
- **Tag ng sariling makina sa kopya** (RARA): ang kopya ng drawing para sa pump B, C o D ay tag at address na ng sariling pump ang ipinapakita at binabasa, kapag nasa I/O list ang tag ng lahat ng makina at hindi pinangalanan ng drawing ang iba. Hal. DITL-23B #B row 5 PS-LO1115-B3 I.0412, DITL-29B #C TT-SW1501-CU AI0752, DITL-21A #D TT-BH1060-D1 AI0896. Dati, tag ng makina A ang nasa 346 na row at text ng mga kopya.
- **DITL-112** "O.0044/0.037E/": nababasa na ang numerong 0 na iginuhit sa lugar ng letrang O.
- **DITL-38 at iba pang drawing na walang address** (RARA): puwede nang bigyan ng bind row ang isang text ng isang kopya (`to` "DITL-38 #MV-FW1002", `text` "MCV OPEN COMMAND"). Puwede ring sa isang kopya lang ang dagdag na FROM.
- **DITL-21D row 22** (STATION 103): may kopya na ang "BOTTOM ASH SCREW COOLER A STOPPED" para sa B, C at D (O.0297 / O.0615 / O.0617, OPC-ANN-G2~G4 O.137D/E/F). Bawat isa ay binabasa ang sariling DITL-21A. Dati, A lang ang may hilera.
- **Field contact sa wire ng output** (KIRARA, "side R", DITL-19 MIA-CL1061-A2): ang ordinaryong DI row ng lane ang nagpapatakbo nito.
- **Lumang fallback na tinanggal**: 14 gas temperature sa hmi2.js (TIFG1092A at TIFG1100 hanggang 1113, tantiya mula sa 150 MW snapshot) at PT-IA1064-A/B sa hmi-bias.js. Field row na ng lane 3 ang tanging pinagmulan.
- README ng bind, inst at field; bagong test `tests/lanes/integrator/copy-tags.cjs`.

## Sinuri
- Luma laban sa bago, 10 minuto sa 150 MW (Node): pareho ang 2171 na output, 3 lang ang dagdag (DITL-21D B/C/D). Pareho ang lahat ng plant switch.
- DITL link: 2591 ang dati at walang nagbago; idinagdag lang ang sa DITL-21D B/C/D.
- build at check: SAME; no-fit: 0 bago; tests/lanes/run-all.cjs: pasado

YUA
