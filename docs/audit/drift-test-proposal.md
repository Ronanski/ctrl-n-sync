# Proposal: 8-hour drift test (Full Audit 3 #3)

AUDIT FIX : LISA, 2026-11-24 00:25 PHT. A proposal only: no workflow or test is changed (`.github/**` and `tests/**` are LEADER : JENNIE's).

## Why

Audit 3 #3: in 8 plant hours at 150 MW with nothing touched, main steam temperature fell 540.1 -> 531.3 C and bed temperature 864 -> 849 C. ISA-77.20: a steady plant must not drift. The Checks gate (`tests/gate/behaviour.cjs`) runs only 20 plant minutes, so a slow drift (the audit saw the MST hold 2.5 h, then fall 1.9 C/h) passes the gate.

## What

1. A nightly job on `main` (schedule, about 02:00 PHT) plus `workflow_dispatch`, NOT a PR gate: 8 plant hours is too long for every push.
2. It runs the same gate: `node tests/gate/behaviour.cjs <station.html> --mins 480`. Same fixed 0.5 s step, same page, same bands (MW 2, main steam pressure 2 kg/cm2, drum level 60 mm, MST 6 C). No second code path.
3. One addition to the gate read: bed temperature (the audit saw it drift), band to be set by Jennie from the plant 150 MW trend (no number invented here).
4. Cost: the gate steps at about 20 ms per 0.5 s step, so 480 plant min = 57,600 steps, about 20 min wall time per run; the gate runs twice (determinism), about 40 min. Fits the 60 min timeout of `sim-tests.yml`; a separate job with a 90 min timeout is safer.
5. A red nightly run does not block merges; it opens or updates one tracker line (Audit 3 #3) and the next fix PR must make it green.

## Decision

Team decision (RULES 1.7): Jennie or the coordinator approves; then Jennie (owner of `.github` and `tests`) adds it, or gives LISA the window.
