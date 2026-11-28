# Checks speed + sweep tool minute samples + air judge on the fan side (phase thread, 2026-11-28 PHT)

Changed
- Checks: the lane tests run as 6 parallel jobs (checks.yml `lanes` matrix, tests/lanes/run-all.cjs LANE_SHARD=i/6). The two slowest
  tests (sootblower-steam ~46 min, aph-blower ~33 min, marked "alone" in tests/lanes/first.txt) get one job each; the other 73 split
  round-robin over 4 jobs. Every test runs in exactly one job (checked with LANE_DRY=1: 1 + 1 + 19 + 18 + 18 + 18 = 75). The job
  `checks` is the one result: it passes only when `core` and all 6 lane jobs pass. No gate removed.
- Sweep tool (tools/accept/part1.cjs): run() steps one plant minute at a time, so run(SETTLE) takes a sample every minute. Before, a
  run(60) gave ONE sample after 60 min: the 150 -> 90 MW ramp read as a one-minute 64 MW drop and the windows had too few points.
- Judge (tools/model/sweep-judge.cjs): PA / SA / total air are compared on the fan side (FICFA1071 / 1081 are before the air heater):
  FHI Fig 12 furnace air + the air heater seal leak (Howden L20 OMM sheet 16: PA 34.0, SA 19.0 T/H at MCR, in proportion; FHI MB-052
  PAF outlet 388 = 354 + 34). Logged difference, AOI finding.
- Also carries YUI's PR 724 (gen-electrical fix) and the no-snapshot fix of PR 722 (merged in).

Tested
- LANE_DRY partition: 75 tests, none twice, none missing.
- Sweep on main + 724 with minute samples: 2 / 22 (/mnt/project-files/phase11/sweep-main724-2026-11-28.md). It shows a sustained
  pressure swing at 90 MW in CCS (119 ~ 128, ~11 min) and the scripted operator below 220 T/H losing the pressure (39 ~ 131): next fix.

Not tested
- The new matrix timing: this PR's own Checks run is the first measurement. The floor is the sootblower-steam test (~46 min) until it is
  made faster (SUZU asked).
