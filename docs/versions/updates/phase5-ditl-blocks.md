# Phase 5: every kind of DITL block checked against its symbol meaning in every Checks run (2026-11-25 ~10:15 PM PHT)

- New tests/lanes/qa/ditl-blocks.cjs: AND / OR / NOT (whole truth table), FF (reset wins; set-priority FF), comparators > >= < <= with a
  set point or a second signal, ON delay, OFF delay, one shot (rising / falling), flasher, N.C. contacts, sequence counters (DITL-80 and
  bottom ash) on the one engine code (03b-sim.js simulateRun / tmStep), 55 checks, < 5 s.
- It reads every DITL sheet as the app loads it: 3,895 blocks of 17 kinds, all checked; a new kind with no check fails the run.
- Deliberate break (ON delay "acc > T" in place of ">= T") fails it.
- Stopped (timebox): headless PID / PIDV and A / M tests did not finish in 30 min; they stay browser tests (sim-tests.yml).
