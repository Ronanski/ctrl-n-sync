# TCS PIV (velocity PI) HL / LL: tumatakbo na ang speed / load PI (TCS LOGIC : MARIA, 2026-11-25 PHT)

## Binago
- `src/digital/tce-run.js`: ang PIV (ML 13, "PI CONTROLLER (VELOCITY TYPE)", TCA014 p 9) ay gumagamit na ng naka-print na HL at LL.
- **Batayan (hinanap ni EIMI sa PC):**
  - Sa macro list, ang HL = upper limit at LL = lower limit. Ganito ang salita nito para sa PIF No. 12, INTEGRAL No. 9, ANALOG MEMORY No. 21 ("with limitter LL<=Y<=HL") at LMS No. 41.
  - Sa TCA022 item (7): "Set Values ... the upper limit, the lower limit".
- **Hinango (derived), wala sa definition:**
  - Ang limit ay nasa posisyon na Z + Y, hindi sa dagdag na Y. Ang Z ay ang GOV.SET (I 005 ng TCE196), kaya Y = clamp(Z + Y, LL, HL) - Z.
  - Dahilan 1: ang TCE191 ay may LL 0.00 %. Kung nasa Y ang limit, hindi kailanman bababa ang load.
  - Dahilan 2: ang TCE195 ay -5.0 ~ 110.0, laban sa GOV.SET -67.7 ~ 107.0.
- **ML:** naka-print at kapareho ng HL sa bawat PIV, pero wala sa anumang pahina. BUKAS ang kahulugan nito, hindi binasa, at hindi nito pinipigilan ang sheet.

## Bilang
- Tumatakbo na: TCE168 speed up control, TCE169 speed control, TCE191 load control (2), TCE195 governor control (1).
- Drawing-complete: 245 → 249.
- Lahat: 344 → 348 sa 419.

## Test
- `tests/tce/sheets.cjs`: tumatakbo ang PIV na may HL / LL / ML. Hinahawakan ang Z + Y sa HL at sa LL.
- Ang dating test na "PIV with HL printed must be open" ay pinalitan, dahil may batayan na ang HL / LL.
- FLOOR = 249.
