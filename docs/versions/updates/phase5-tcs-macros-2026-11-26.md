# Phase 5: the TCS macros with no meaning, from the HIACS backup (2026-11-26, 3 PM PHT)

Source: YUA PC read from the decoded HIACS backup and the macro list TCA013 (TCA.pdf p.8). Files:
- `/mnt/project-files/phase5-tcs-macros-17-2026-11-26.md` / `.json`: 23 types, 52 instances on 21 sheets, 395 blocks. Every instance of a type is wired the same.
- `/mnt/project-files/phase5-ml-dv-blocks-2026-11-26.md`: the ML and DV blocks.

## New blocks (src/digital/tce-run.js K)
- **ML 5 AW** (add with weight): Y = G1 X1 + G2 X2 + G3 X3 + B. Values G1 G2 G3 B.
- **ML 7 ML** (multiplier with compensate): Y = (X1 - X0)(C + G X2) + Y0. Values X0 C G Y0. No limits.
- **ML 8 DV** (divider with compensate): Y = G (X1 - X0) / (X2 + XC) + Y0. Values X0 XC G Y0.
  - A zero divisor holds the last value, the same as DIV (ML 4).
- The backup values of every ML and DV are 0, 0, 1, 0, so they give Y = X1 X2 and Y = X1 / X2.

## New backup macros (BKM)

| Type | Library no. | Instances |
|---|---|---|
| DISTRIBUTION | LMA627 | 10 |
| THERMAL STRESS | LMA628 | TCA754; TCA758 is DERIVED: it prints the same LMA628 |
| SIMCV | LME271 | 6 |
| PI CNT | LMA710 | 3 |
| SET | LMA040 / LMA043 | 4 |
| PLU/BUG TEST MT1 | LMA290 | 2 |
| PLU/BUG DIAGNOSIS MT1 | LMA291 | 2 |
| THSC INITIAL | LMA626 + 626A, two pages | 2 |
| AUXILIARY TYPE 15 | LMA584A + B, two pages | 1 |
| RUB CHECK CONTROL MT1 | LMA560 | 1 |
| ACC.CONTROL MT1 | LMA563A | 1 |
| TURBINE SIM.MT1 / MT2 | LME280 / 281 | 2 |
| CCS SIM.MT1 | LME285 | 1 |
| FILTER | LME240 | 1 |
| PRESS COMPENSATE MT1 | LME237 | 1 |

CRT OPE INC/DEC at TCE196 004 (LME025) is added. The read now gives it the same wiring as TCE194.

## Drawing wins

Pins that the backup wires and the 2017 drawing leaves blank stay open (0). The evidence is the "As drawn" lists of TCA775, TCA780 and TCA781. The pins are:
- PI CNT IN1;
- PLU/BUG TEST MT1 TEST1 ~ TEST3 (inputs);
- PLU/BUG DIAGNOSIS MT1 OP.

## Result

| Count | Before | After |
|---|---|---|
| Macros with a meaning | 498 of 535 | 536 of 537 |
| Sheets running as logic | 388 of 419 | 404 of 419 |
| COMPLETE | 275 | 292 |
| Macros run from the backup | 41 | 81 |

Floors are raised to match: `tests/lanes/qa/tce-complete.cjs` 292 and `tests/lanes/qa/tcs-macro-backup.cjs` 81. AW, ML and DV are checked against their formulas.

## Still open

- 3 boxes that are not macros in the backup: TP? x2 and one unnamed "M:". These need a drawing read.
- The 11 sheets still not running have other defects: CMP / PIF / TB SW not wired (HIACS default), and the PIF G / TI not on TCA740.
