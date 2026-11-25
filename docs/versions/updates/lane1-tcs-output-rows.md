# TCS: bawat PI/O output ay may pangalan ng table row (TCS LOGIC : MARIA, 2026-11-25 PHT)

## Binago
- Sa `TCE_RUN.outs()`, may `row` na ang bawat PI/O output, halimbawa `TCA980-17`. Ito ang "(TCxxxx-n)" na naka-print sa box. Sa mga output sheet (TCA830 ~ 850, TCE600 ~ 610), naka-print ito sa ibabaw ng PI/O mark sa kaliwa ng box.
- Hiling ito ni SORA (lane 9) para sa TCS compare: 38 output ng TCS I/O list ang may engine value na.

## Bilang
- PI/O output na may row: 39 → 223 sa 306.
- Ang 83 na wala ay G sheets, na walang naka-print na table row.

## Test
- Sa `tests/tce/sheets.cjs`: ang TCA831 ay TCA980-17 ~ 32, ang TCE610 ay may TCE970-6, at walang TCE/TCA output na walang row.
