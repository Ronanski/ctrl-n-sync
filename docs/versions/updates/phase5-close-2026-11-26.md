# Phase 5 closed (2026-11-26, 6 PM PHT)

- TCA782 A002, the unnamed "M:" box = MJL (2 out of 3 select, macro list ML 71), from the HIACS backup record MJL 002.
- G-5A / G-6A d24b ("TP?") = 24 V/Hz 2nd step, inverse time element TINV.
  - Settings: time dial 2, pickup 107 %, reset 30 s (LM-GEE-2015-0059 p.21 24A, p.49 24B).
  - Curve t = 1800 x TD / (M - 100)^2 s: DERIVED from the vendor test points p.22 (110 % = 36 s, 115 % = 16 s at TD 2); the TD scaling is INFERRED.
  - Its V/Hz % input is a plant port (G-5A.d24b.M), not yet bound to the generator model.
- MAN station headless test `tests/lanes/qa/man-station.cjs`: 45 MANUAL, 2 AUTO leg, 11 tracked by the drawing.
- TCS: 3,540 / 3,540 blocks with a meaning, 537 / 537 macros, COMPLETE 295.
- PHASES row 5 = TAPOS. Phase 6 file split: `docs/handoff/phase6-split.md`.
- Tested: the full lane run, 42 tests, 0 failed. Not tested: the live app.
