# v1.0.0-beta.593 (DCS LINKS BOILER : KIRARA, lane 3): bottom ash conveyors sa 150 MW, two-way separator, XA-FA1052-5

## Ano ang nagbago (nakikita ng operator)
- **Sa 150 MW start** (Normal operation at full load), tumatakbo na sa sariling ON COMMAND ang chain conveyor L-1090, bucket elevator L-1091, screw conveyor L-1092 at bag filter venting fan F-1091, gaya ng HMI snapshot 16. Patay ang dalawang vibrating screen. Ang two-way separator L-1094 ay nasa daan papuntang ash silo (CLOSE; ayon sa DITL-BA66, OPEN = papunta sa vibrating screens).
- **Sumusunod na sa utos ang chain conveyor** (`src/analog/engine/boiler.js`): kapag pinindot ang STOP, titigil ito. Dati, mali ang row na binabasa (row 5 sa halip na row 4, ang CHAIN CONVEYOR ON COMMAND ng DITL-BA68) at may "hindi Cold = tumatakbo" na shortcut.
- **Two-way separator**: may tunay na posisyon na. Ang paglipat ay 2 s, batay sa K1AU3-D1-0-010 RA pdf p 22 (130225A-TW-01: air cylinder na 190 mm ang stroke; ang MCQ ay 50 ~ 500 mm/s; ang DITL-BA65 TR29 ay nag-a-ABNORMAL kapag lampas 5 s). Ang ZSO / ZSC-BH1754 ay sarado lang sa dulo ng travel.
- **I/O point na nakakabit na** (`src/world/field/boiler.js`, I/O list STN103): MIR-L1090 I.0163, MIR-L1091 I.0166, MIR-L1092 I.0169, MIR-F1091 I.016C, ZSO-BH1754 I.0173, ZSC-BH1754 I.0174, at XA-FA1052-5 I.0659 (air preheater secure power supply; field state, normal = OK, DITL-43 output 12).
- **Mga save bago ang bersyong ito**: tumatakbo pa rin ang conveyors pag-load. Ang `ditl150.js` D.baSave ay nagse-set ng mga latch; walang pinipindot na button.
- `src/data/st150.txt`: ang mga DITL-BA sheet lang ng start state ang pinalitan.

## Sinuri
- 10 minuto sa 150 MW, luma laban sa bago: pareho ang lahat ng value ng planta bawat minuto. Ang nagbago lang ay ang DITL-BA60 / 66 / 67 / 68 / 71 at ang DITL-43 output 12.
- STOP ng chain: 0 ang utos, ang baConv at ang running contact. OPEN ng separator: umabot sa dulo bago ang 5 s, walang ABNORMAL.
- Bagong test `tests/lanes/boiler/old-save-ash.cjs`: pumapasa, at bumabagsak kapag tinanggal ang migration. Lane tests at no-fit (0 bago) pumasa.

## Hindi nasubok
- Ang HMI page ng bottom ash at ang Training mula Cold.

KIRARA
