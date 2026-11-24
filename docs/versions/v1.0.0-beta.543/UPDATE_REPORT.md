# v1.0.0-beta.543 (DCS LINKS BOILER : KIRARA, lane 3): field states ng boiler

## Ano ang nagbago
- **`src/world/field/boiler.js`** (seksyon 7): may 84 bagong I/O point ng boiler, at ang halaga nila ay galing sa field state na nasa normal na estado ng serbisyo. Mababago ito ng instructor sa Plant menu (75 state).
  - Coal feeder A / B / C:
    - Knife gate 1 / 2 sa pagitan ng bunker at feeder (ZSO / ZSC-CL1061-x1 / x2). Normal: bukas. Batayan: P&ID K1AU3-PD-061 Rev A, RA p 48.
    - Volumetric mode, inlet plugging, no coal on belt, belt tracking (MIA-CL1061-x2 / x3 / x5 / x7). Normal: wala. Batayan: Yamato L12 P8.
    - Clean-out conveyor trip (MIT-CL1061-x1).
    - Feeder fault (MIT-CL1061-x): sumusunod sa field trip ng DITL-19 / #B / #C.
  - 18 motor damper (FA1005 ~ FA1018, FA1043-A ~ D): trip, torque, remote (MIT / TS / MIL). Normal: REMOTE at walang fault, dahil ang ABC-015 / 016 at ABC-003A ~ D ang nagpo-posisyon sa damper mula sa DCS.
  - Sinadyang hindi isinama para iisa lang ang source ng bawat tag:
    - MIA-CL1061-x4 (trainer fault na cf.jam ang nagpapatakbo).
    - MIA-x6 at ZSO / ZSC-x7 (naka-link na).
    - MIA-x1 (unit.js ang sumusulat).
    - MIA-x8 clean-out conveyor AUTO: wala pa sa mga dokumentong nabasa ang normal mode nito.

## Sinuri
- Headless sa full load (151 MW):
  - Normal na estado: bukas ang mga gate, walang fault, REMOTE ang mga damper.
  - 24 contact sa DITL-19 / #B / #C ang pinapatakbo ng field rows (`WORLD.plantUsw`).
  - "Coal silo A outlet gate 1 closed" (Plant menu, `AN.fault`): ZSO-CL1061-A1 = 0 at ZSC-CL1061-A1 = 1 sa DITL-19.
  - "Damper FA1005 in LOCAL": MIL-FA1005 = 0.
  - Walang duplicate, 0 page error.
- `tests/lanes/run-all.cjs` 13 / 13. `npm run check` SAME.
- QA trace sa 84 tag:
  - Dati: 70 UNLINKED, 8 nasa drawing pero wala sa row, 3 walang source, 3 station unsure.
  - Ngayon: 70 MODEL / HMI ONLY, 1 LINKED, 8 nasa drawing pero wala sa row, 2 walang source, 3 station unsure.
  - Ang 8 contact sa DITL-19 at ang MIT-CL1061-B / C ay pinapatakbo na (plantUsw, field trip), pero hindi pa ito binabasa ng trace tool.
- Buong bilang ng QA trace: LINKED 1604, UNLINKED 305.

## Hindi nasubok
- Ang mga button sa Plant menu sa UI (sa `AN.fault` lang sinubok).
- Ang pagpapakita sa HMI.

KIRARA
