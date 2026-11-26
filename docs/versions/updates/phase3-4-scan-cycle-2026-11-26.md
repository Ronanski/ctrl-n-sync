# Phase 3 scan cycle of the ABC, Phase 4 closed (2026-11-26 PHT)

User 2026-11-26 10:53 AM "Bkt ung 1 to 5 hndi tapos?": phases closed strictly in order.

## Phase 3: the ABC control blocks at the real DCS cycle
- Source: docs/ARCHITECTURE.md 3a (K1AU3-E2-0-001 Rev. A: execution cycle 1 s; loop list STN101 ~ 105 LOOP_AX "Cyl": 1,154 loops at
  1.0 s, 11 at 0.2 s).
- `src/analog/engine/plant.js` anStep: the blocks of a sheet run once per cycle (1.0 s; 0.2 s on ABC-007, 008, 014, 050, 051, 052, 054,
  055, the sheets of the 11 fast loops); between scans the outputs hold; inputs and the plant model move every step.
- Plant step 0.5 -> 0.2 s (sched.js anSteps, AN.runFixed default, the Worker eng-host.js, world.js), so a 0.2 s sheet really scans at
  0.2 s. The behaviour gate keeps its own 0.5 s step (shorter run); there the 0.2 s sheets scan every step.
- DERIVED: the DCS sets the cycle per loop, the app scans per sheet (a sheet with a 0.2 s loop is all 0.2 s).
- Tested headless: 150 MW 20 min untouched, MW 150.84 ~ 151.08, main steam 121.9 ~ 122.6 kg/cm2, no trip (0.5 s before: 150.89 ~ 151.06).
  Full lanes 37 / 37. Cost headless 176 -> 289 ms per plant second.
- The block library check (tests/regress/blocks_io.js) sets AN.scanEvery: it tests each block's function at each step, not the cycle;
  its expected values are unchanged. The cycle is held by tests/lanes/qa/architecture.cjs (17 numbers).
- NOT tested: the app in the browser (60 FPS, speed x10 and above on the PC of the user). A slower PC gets longer steps (at most 1 s), as
  before.

## Phase 4: TAPOS
- One table `src/data/ades.txt`; tests/lanes/qa/tag-db.cjs 0 differences. Linking each tag on the sheets and HMI is Phase 6 / 9
  (trace-gate: unlinked 5, cannot rise).

## Phase 2: stays BAHAGI with HADLANG (owner: user)
- The pass band of the RH spray (ACCEPTANCE.md "about 0" with no number) is the user's acceptance criterion; the team cannot set it.
