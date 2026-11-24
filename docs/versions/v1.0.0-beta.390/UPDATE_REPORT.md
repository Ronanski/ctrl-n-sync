# v1.0.0-beta.390 (LEADER : YUA, lane 0 integrator): PR 0, hiwalay na folder ng bawat lane

## Ano ang nagbago
- **src/world/bind/<lane>.json**: dito isusulat ng bawat lane ang mga dagdag na I/O row (stn, addr, tag) at dagdag na FROM reference (to, row, from). Binabasa ito ng world.js gamit ang parehong linker ng mga drawing. Walang bagong link code.
- **src/world/inst/<set>.json**: mga unit instance mula sa data (sheet, units, addrMap, textMap). Ito ang paraan ng sootblower copy ng DITL-80G, ginawang pangkalahatan.
- **src/data/alarms/<group>.json**: mga alarm row na may priority. Ginagamit ito ng AN.almPri bago ang derived priority.
- **HX pages**: lahat ng hx-page-*.js sa folder ay kasama na sa build. Pareho pa rin ang pagkakasunod ng mga lumang page; ang bagong page ay bagong file lang.
- **tests/lanes/<lane>/*.cjs** at **tests/tce/*.cjs**: pinapatakbo lahat sa Checks ng tests/lanes/run-all.cjs. Hindi na kailangang galawin ang checks.yml.
- Ang mga beta number ay nagtatapos sa digit ng lane (sa lane 0, 0 ang dulo).

## Epekto sa app
Walang laman pa ang mga folder kaya walang nagbago sa takbo ng planta. Tinitingnan ng tests/lanes/integrator/lane-data.cjs ang format at ang `src` ng bawat row.

## Sinuri
- `npm run -s build` at `npm run -s check` ay SAME
- `node tools/check/no-fit.cjs` pasado
- `node tests/lanes/run-all.cjs`: 2 tests, 0 failed

YUA
