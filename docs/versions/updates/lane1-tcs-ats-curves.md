# Lane 1 (TCS LOGIC, MARIA): ATS curves for TCA530 and TCA548, 364 -> 366

Source: ATS criteria list 310SC90-796 Rev 2 (MHPS, 2016-07-18), VARIABLE SET POINT sheets 21 and 22 (Turbine Control System book p 181, 182).

- TCA530 (CRI 1.32 MSV chest / CRI 1.33 CV chest temperature difference OK): FG A005 = FIG. 4 (main stop valve casing, 127.8 degC at
  200 degC inner surface to 78.9 at 565.6), FG A022 = FIG. 5 (control valve casing, 156.1 at 200 to 112.2 at 565.6). Straight line,
  flat outside.
- TCA548 (CRI 1.71 / 1.72 steam to metal mismatch): the page prints tables FG *1-*4 (upper limit and target, used as printed; they
  differ from 796 FIG. 2 / 3, the page wins). The LOWER LIMIT FG A040 / A042 has no table on the page: taken from 796 FIG. 2
  (0,305) (318,305) (538,471) and FIG. 3 (0,205) (309,205) (538,430).
- Tests: new curve test in tests/tce/sheets.cjs; the four TCS tests pass. Drawing-complete floor 258 -> 260.
- Not tested: an ATS start in the app that passes these criteria (needs the metal temperature model).
