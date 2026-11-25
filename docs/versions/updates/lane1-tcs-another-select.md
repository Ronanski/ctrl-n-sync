# Lane 1 (TCS LOGIC, MARIA): ANOTHER SELECT MT1 (TCA514), 363 -> 364

Source: ATS program 310SC90-795 Rev 2, PAGE 7 (step transition), note *3 "OTHER STEP" is collective.

- ANOTHER SELECT MT1: STEP n = OR of SELECT m for every m other than n (0-7). Drawn on PAGE 7; src is the drawing.
  TCA514 block 1 (PB ON of TCA520-527) gives ANOTHER STEP PB SELECT (EX1); block 2 (STEP S of TCA520-526 and OR034) gives ANOTHER STEP SELECT (EX2).
- STEP CONTROL MD no longer gives the STEP S output. PAGE 7 draws no other line that selects a step besides the PB, and a step asked
  by STEP UP ORDER must not drop the upper step the operator selected through OTHER STEP SELECTED. EX2 on TCA514 now comes from OR034 only.
- Tests: tests/tce/sheets.cjs (new ANOTHER SELECT test, STEP CONTROL test now checks STEP S is not given), tests/tce/run.cjs,
  tests/lanes/qa/tce-complete.cjs, tests/lanes/integrator/tce-loop-mark.cjs: all pass. Drawing-complete floor 257 -> 258.
- Not tested: a full ATS run through all steps in the app (the ATS chain still waits on the FG curves of TCA530 / TCA548).
