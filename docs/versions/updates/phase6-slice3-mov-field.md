# Phase 6 slice 3: field contacts of the motor valves MV-BR1391 / MV-HR1391 (2026-11-26 ~2:15 AM PHT)

Source: YUA PDF read /mnt/project-files/phase6-mov-damper-wiring-2026-11-26.md (sections B and C).
- src/world/field/boiler.js 3b: ZSO / ZSC-HR1391 (STN102 I.000A / I.000B) from ZT-HR1391 (STN102 AI0737, ABC-054), the MOV rule
  (open = 100 %, closed = 0 %). Memory list 102 M.3222 / M.3223 name them "valve open / close"; no logic sheet reads them.
- 7b: MIT / MIL / TS of MV-BR1391 (STN101 I.000C ~ E) and MV-HR1391 (STN102 I.000C ~ E) as field states in normal service (no trip,
  remote, no torque); the trainer can set the abnormal state from the Plant menu. Monitor points only: no interlock is made from them.
- QA trace: I/O unlinked 141 -> 133, I/O inputs nowhere (B2) 79 -> 71, I/O with a value 2,145 -> 2,153. baseline.json moved.
- Not done (stopped at the timebox): the open / close commands AO0704 / 0705 / 0708 / 0709 (PO1 / PO2 of the PO block on ABC-054 / 055).
  The PO block keeps its pulses inside the block; making them addresses is an engine change, sized for its own slice.

## Slice 4 (same branch, ~2:25 AM)
- 3c: ZSO-MS1020 (I.0080) from ZT-MS1020 AI0384, ZSO / ZSC-HR1010 (I.0082 / I.0083) from ZT-HR1010 AI0385 (end-of-travel rule).
- 7c: PAF inlet damper MIT / TS (I.0048 / I.004A), SAF inlet damper MIT / MIL / TS (I.0058 / 59 / 5A) as field states, no interlock.
- QA trace: unlinked 133 -> 125, B2 71 -> 63, value 2,153 -> 2,161.
