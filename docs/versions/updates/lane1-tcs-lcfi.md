# TCS LCFI curve (UNT-FG) and the PDF results for the 5 open macros (TCS LOGIC : MARIA, 2026-11-25 PHT)

Bilang: 358 → 360 of 419 TCS sheets (TCA762 HP LCFI, TCA763 IP LCFI; drawing-complete 252 → 254).

## Binago
- **UNT-FG (FG-1(LCFI), LMA010):** binabasa na ang Xn / Yn table (No. 0 ~ 19) na naka-print sa tabi nito sa TCA762 / TCA763. Diretso ang linya sa pagitan ng mga punto, at flat sa labas ng table, gaya ng FG.
  - Check laban sa formula ng EIMI (LM2-TEQ-17-240 R0 p 158, STIE-14852): sa 500 N/mm2 (= 50.99 kg/mm2), 0.536 % ang formula at 0.5381 % ang table.
  - Wala pa ring curve ang TCE212 UNT-FG 003 / 036 (CV demand), kaya nananatiling bukas.

## Ang 5 macro, ayon sa resulta ng PDF
- **MODE (TCA768A, LMA810):** hindi ito ang start-up mode select. Ang input ay GEN.LOAD (L) at T-R COMP (T). Sa sheet ay may naka-print na apat na MW (90 / 60 / 33 / 22.5) at anim na %/min bawat mode, at ito ay load-up rate. Hindi alam kung aling rate ang para sa aling load band, at ano ang papel ng T. (c)
- **HEAT SOAK SELECT (TCE163) / HEAT SOAK CONTROL (TCE207):** nasa DOC A p 20-23 at DOC B p 41 / 44 / 50 ang sequence, pero wala sa anumang PDF ang locked CV value sa loob ng block. (c)
- **THERMAL STRESS (TCA754 / 758):** may limits na ngayon (Table 1.2), pero wala sa PDFs ang surface / bore / TB equations at ang rotor geometry. (c)
- **Heat soak timers:** naka-print na sa TCA585 / 586 ang FG points, at tugma sa DOC A. Walang binago.
- **Cold 2 heat soak off:** sa DOC A (775 R1) ay A-Cold / Cold 1 lang. Ang ATS program na ginamit sa ACC.CONTROL ay 310SC90-795 **Rev 2** PAGE 22, na "AMBIENT COLD OR COLD 1 (OR COLD 2)", kaya kasama ang Cold 2. Mas bago ang Rev 2 kaya ito ang sinusunod. Itinala dito, hindi binago.

## Sinubok
- tests/tce/sheets.cjs: pasado. Bagong test para sa TCA762 / 763: 500 → 0.5381; 175 → nasa pagitan ng 0.0001 at 0.0002; 600 → 0.5381.
