# v1.0.0-beta.494 — Field signals ng BOP (lane 4, DCS LINKS BOP : RARA)

## Ano ang bago
- Bagong file `src/world/field/bop.js`: 77 field signal ng balance of plant na dati ay walang value sa app. Bawat isa ay binabasa lang ang engine state na mayroon na, at may nakasulat na source.
  - **24 posisyon ng control valve (ZT):** ang opening na umaabot sa proseso = `X.av(controller, MV)` (positioner at air lock, valve package K1AU3-E2-0-123 R1). Feedwater (FW1130-1 / -2), HP / RH / LP bypass spray, aux at gland steam spray, condensate (CD1121, CD1120, CD1110, CD1104, MU1110), blow off PCV-MS1001, lube oil TCV-CW1201, at ang 10 heater drain valve (primary = split-range F(X) ng drawing, ABC-035 ~ 039, tulad ng AN_HD).
  - **9 limit switch (ZSO / ZSC)** ng FW1060, FW1150, CD1115, CD1124, CD1126: end of travel (OMRON D4A-2502N), bukas = 100 %, sarado = 0 %.
  - **6 posisyon ng motor valve:** BD1001 / 1002, FW1001 / 1002 / 1392, MS1391 mula sa kopya nila ng DITL-38.
  - **Model value na mayroon na:** BFWP-B bearing / winding temp at vibration (13), SWP-B winding U at SWP-C vibration, condenser sea water B (4), current ng booster B / C at CEP-B, hotwell at neck temp, BFWP inlet temp (saturation ng deaerator), No.2 / No.3 LPH drain temp at flow, No.1 LPH steam pressure, make-up water flow FT-MU0001 (suma ng make-up pumps).
  - **LSHH-CD1110:** hotwell level >= +300 mm (HHL 900 mm, K1AU3-D1-0-039), dead band 10 mm tulad ng ibang level switch.
  - **SWP VCB ON / OFF (A, B, C):** ON = tumatakbo ang pump sa DITL-29A (o kopya nito), OFF = hindi ON; bumabagsak kasama ng trip.
- Inalis ang 7 fixed snapshot number sa `hmi-op.js` para sa mga address na ito (FT-MU0001 28.6, sea water B, hotwell / neck temp). Isa na lang ang source bawat tag.

## Batayan
- `lanes/bop/lane4-field-values-paper-2026-11-25.md` (QA : SAORI pass), DCS I/O list (`src/ui/plant/wiring.js`), K1AU3-E2-0-123 R1, K1AU3-D1-0-039 R1, K1AU3E1-0008, PPE-14-0725.
- Tala: ang I/O list row STN105 AI0064 ay may tag na FT-MU0001 pero ang description ay ulit ng fire pump text ng AI0065. Ang tag ang sinunod.

## Test
- `tests/lanes/bop/field.cjs`: hugis ng row, may src at rel, isang row bawat address at tag, tugma sa I/O list, walang natitirang fixed value sa hmi-op.js.
- Headless sa 150 MW (Run): 138 value sa `AN.unit.fld` at sa `AN.fieldRead`, walang page error. Bago ang unang Run, null ang mga value na hindi pa nagagawa ng model (U.tSr, U.muQ, heater drains); lumalabas sila sa unang scan. Mga value: FW1130-1 61 %, HD drains 52 ~ 78 %, BFWP inlet 160.8 °C, hotwell 36.5 °C, make-up 34.9 t/h, SWP B / C VCB ON at A OFF (A naka-standby).

## Hindi pa / bukas
- Ang mga address na ito ay wala sa anumang tumatakbong sheet (CRT / HMI point lang), kaya ang value ay nasa `AN.unit.fld` para sa HMI; walang AI block na sinusulatan.
- `hmi-sw.js` page map (TISW1110B1 ...) at ang "VCB ON" ng sea water page: lane ng HMI ang maglilipat sa field row.
- Needs model / PC document: CEP motor temps, chemical tank levels, pit / leak switches, PAF oil panel, IW strainer DP.

RARA
