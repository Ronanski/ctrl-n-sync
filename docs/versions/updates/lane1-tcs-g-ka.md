# TCS TCE190 G C014 "KA:1.0" = gain (TCS LOGIC : MARIA, 2026-11-25 PHT)

## Binago
- **Ano ang nasa drawing:** ang G C014 ng TCE190 LOAD CONTROL(1) ay may naka-print na "KA:1.0" lang. Binasa ito ni EIMI sa PC: 331DM09784 p 132 = PDF p 134, malinaw sa 2x crop, walang ibang K.
- **Ano ang nasa macro list:** walang KA. Ang No. 27 GAIN (TCA015) ay "Y=K*X. K:Gain".
- **Hinango:** iisa ang parameter ng GAIN at iisang value ang naka-print, kaya ang KA ang gain. Sa 1.0, Y = X. Ginagamit lang ito kapag walang naka-print na K.

## Bilang
- Tumatakbo na ang TCE190.
- Drawing-complete: 249 → 250.
- Lahat: 348 → 349 sa 419.

## Test
- `tests/tce/sheets.cjs`:
  - G na may KA lang: ang KA ang gain.
  - G na may K at KA: ang K ang gamit.
  - G na walang K at walang KA: bukas.
- FLOOR = 250.
