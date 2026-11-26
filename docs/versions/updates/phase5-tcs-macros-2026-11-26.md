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

- Nothing of Phase 5. The 11 sheets still not running belong to Phase 6.

## Slice 3 (2026-11-26, 6 PM PHT): the last 3 boxes

- TCA782 A002, the unnamed "M:" box = MJL (2 out of 3 select, macro list ML 71), from the backup record MJL 002.
  Pins X1 ~ X3, E1 ~ E3 in; Y, Z1 ~ Z3 out.
- G-5A and G-6A d24b, the "TP?" boxes = 24 V/Hz 2nd step, an inverse time element (TINV).
  - Settings: time dial 2, pickup 107 %, reset 30 s (LM-GEE-2015-0059 p.21 for 24A, p.49 for 24B).
  - Curve: t = 1800 x TD / (M - 100)^2 s. The form is DERIVED from the vendor test points on p.22 (110 % = 36 s, 115 % = 16 s at time dial 2); the scaling with time dial is INFERRED.
  - Its V/Hz % input is a plant port (G-5A.d24b.M), not yet bound to the generator model (Phase 6 / 11).
- Test: `tests/tce/sheets.cjs` checks both boxes are TINV and the curve at 105 / 110 / 115 %.
- Result: 3,540 of 3,540 blocks have a meaning, 537 of 537 macros, COMPLETE 295.
- The 11 sheets still not running have other defects: CMP / PIF / TB SW not wired (HIACS default), and the PIF G / TI not on TCA740.
