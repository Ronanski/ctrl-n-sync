# TCS motor valve POSITION (SEAL-IN) mula sa drawing (TCS LOGIC : MARIA, 2026-11-25 PHT)

## Binago
- `src/digital/tce-run.js`: bagong macro `POSITION (SEAL-IN)`.
  - Batayan: drawing IBD 310SC90-794 Rev 2 sheet 18 "POSITION SEAT (SEAL-IN)" (book p 34).
  - Pareho ito ng TORQUE (SEAL-IN) ng sheet 16, maliban sa isang bagay. Sa magkabilang dulo, sa LIMIT switch humihinto ang valve.
  - Ang torque switch ng close bago ang full open limit ay torque trip (ANN 5), at humihinto ang valve.
  - Iisang code na lang ang dalawang macro (`sealIn`).
- Tumatakbo na ang TCA650, ang steam seal feed inlet valve (TC-31).

## Bilang
- Drawing-complete: 235 → 236.
- Lahat: 334 → 335 sa 419.

## Test
- Sa `tests/tce/sheets.cjs`:
  - Humihinto ang close sa LIMIT FULL CLOSE at walang alarm.
  - Ang close torque bago ang limit ay humihinto at may alarm.
- FLOOR = 236.
