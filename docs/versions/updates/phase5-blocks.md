# Phase 5: every ABC block checked against its legend function in every Checks run (2026-11-25 ~9:10 PM PHT)

- New tests/lanes/qa/blocks.cjs: the block check of tests/regress/blocks_io.js (read from that file, one source) runs headless in the
  tools/trace world, PLANT MODEL OFF: 51 sheets, 1,671 blocks, 12,021 checks, 34 kinds (ADD SUB DEV SUM MUL DIV ABS SQRT HS LS HLIM LLIM
  HLLIM FX HC LC CMPK DCMP PVSV AND OR NOT FF TON TOF TP TPS TPV LAG RATE RAMPB CTK SEL ACT), 0 wrong, ~100 s.
- Before: this check ran only in sim-tests.yml (browser, main only, report only: a wrong block did not stop a merge).
- Floors (sheets 51, blocks 1671, checks 12021, kinds 34) fail the run when coverage drops. A deliberate break (MUL output x1.01 in
  plant.js) failed it on ABC-003B MUL#57 (500 expected, 505 got).
- Still open: PID / PIDV, MAN, A/M, AI, totalizers ("own test", 1,858 blocks) are checked only in their browser tests; DITL gates; the
  54 TCS FG curves with no break points.
