# v1.0.0-beta.493 (DCS LINKS BOILER : KIRARA, lane 3): field signals ng boiler

## Ano ang nagbago
- **`src/world/field/boiler.js`** (bago, lane 3): 50 I/O point ng boiler na walang logic sheet ay may halaga na mula sa engine state. Bawat row ay may `rel` at `src` (I/O list, drawing):
  - Sootblower steam supply valve MV-SB1001: ZSC-SB1001 (closed limit) at ZT-SB1001 (posisyon), mula sa posisyon ng MOV ng DITL-80S.
  - 14 furnace temperature control damper FA1005 ~ FA1018: ZSO / ZSC mula sa sariling ZT (ABC-015 / 016), sa end-of-travel rule ng app (bukas = 100 %, sarado = 0 %).
  - Burner hot SA damper FA1043-A ~ D: ZSC mula sa ZT sa STN101.
  - PT-IA1064-A / B (air buffer tank ng biasing damper): presyon ng instrument air header ng unit 1 (walang daloy palabas = walang pressure drop; P&ID PD-023 6/6).
  - TT-FG1092-A (cyclone-A inlet gas) = furnace exit gas (P&ID PD-051).
  - 13 backpass gas thermocouple TT-FG1100 ~ 1113 sa gas ng bawat bank (`U.hxO.gBank`, P&ID PD-051 RA p 42).
- **`tests/lanes/boiler/field-rows.cjs`**: bawat row ay may tamang hugis, src at rel, at ang tag, station at address ay tugma sa I/O list ng app.

## Sinuri
- Headless sa full load (151 MW): lahat ng 50 ay may halaga sa `AN.fieldRead`, walang duplicate (`FIELD.dup` wala), 0 page error. Bumababa ang gas temperature bank sa bank: RH pass 788 / 652 / 541 / 469 / 422 / 361 C, SH pass 788 / 640 / 565 / 519 / 416 / 361 / 338 C. Sarado ang MV-SB1001 (ZSC 1, ZT 0). Nasa 25 % ang mga damper, kaya parehong 0 ang limit nila.
- Lane test: 50 row, 0 problema.
- QA trace (`tools/trace/trace.cjs --start 150 --mins 5`): sa 50 tag, dati 45 UNLINKED, 4 MODEL / HMI ONLY, 1 ON DRAWING. Ngayon 31 UNLINKED, 18 MODEL / HMI ONLY, 1 ON DRAWING. Hindi pa binabasa ng trace tool ang `FIELD.rows`, kaya 14 tag lang ang nakita nito. Hiniling sa QA na basahin ito.

## Hindi nasubok
- Ang pagpapakita sa HMI pages (lane 6 / 7). Ang lumang fallback ng PT-IA1064 sa `hmi-bias.js` (file ng lane 6) ay hindi ko ginalaw.

KIRARA
