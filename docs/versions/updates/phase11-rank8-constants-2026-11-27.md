# Phase 11 rank 8, step 1: the unit constants come from the code on every load (2026-11-27)

Finding (AOI): "At 150 MW" (src/data/st150.txt) and every save point restore the whole unit object AN_UNIT, constants
included (state.js anStateApply). So a constant changed in code never reached the plant; the old saved number won.

Change:
- `src/analog/engine/unit.js`: `AN_UNIT_K` lists the 43 keys of the AN_UNIT literal that no function writes (the constants: time
  constants, valve sizes, metal masses, Hgen, mcr ...).
- `src/analog/engine/state.js` anStateApply: after the save is loaded, these 43 keys are put back from the code (AN_STATE_INIT).
- `tools/check/u-const.cjs` (in Checks): fails when a key no function writes is not in AN_UNIT_K, when a key of AN_UNIT_K is written
  by any function (start and stop included), or when AN_UNIT_K names a key that is not there.

Tested (headless tools/trace/world.cjs, "At 150 MW" start):
- Today the 43 saved values equal the code, so no plant number moves with this PR.
- Hgen set to 4.5 in the code: with this change the loaded plant reads 4.5; without it, 4.01 (the old saved number).
- u-const PASS, one-path PASS, model lanes PASS.

Not done yet (rank 8 step 2): the values that anUnitStart DERIVES from the start state (kdp, Kt, taf0 / pa0 / sa0, the transmitter
offsets U.xt) and the nested anchors of the parts (e.g. AOI's bed DP anchor, the AI lists' a0) are still state in the save.

## Faster Checks (user 2026-11-27 "Bat antagal")

- `tests/lanes/run-all.cjs` now runs the lane and TCS tests in parallel, as many at a time as the runner has CPUs
  (LANES_J; LANES_J=1 = one after the other as before). Each test's output is printed whole when it ends, with its time.
- A test that must run alone goes in `tests/lanes/serial.txt`; the file is empty today.
- On 2026-11-27 these tests took 42 of the 62 minutes of Checks, one after the other.
- `tests/lanes/first.txt`: the slowest tests start first. aph-blower takes about 26 min alone and sets the floor.
- Local run, 4 at a time, while 2 sweeps were running on the same machine: 69 tests, 0 failed, 28 min. One after the other they take
  about 68 min of CPU.

## Sweep tool: the operator's pressure law below 220 T/H (KANA 2026-11-27)

- Below 220 T/H the boiler master is MANUAL (M.2013), so the scripted operator in tools/accept/part1.cjs closes the pressure loop.
- With 0.3 x error - 1.0 x the 3-min trend it limit-cycled against the bed lag at 45 MW: MSP 94 to 106 ata, about a 57 min period.
- KANA probe: 3.0 x the trend stops the swing (coal 30.5 to 33.4 T/H), but the pressure then comes in slowly (tau about 30 min).
- Now 0.5 x error - 3.0 x the trend: tau about 18 min, and it still looks about 9 min ahead (the bed lag). It is still at most one
  1 % press every 3 min, reading only what the operator sees.
- The sweep with this law is running. Its result comes with the st150 re-settle PR.

## Judge: the DCS minimum air (logged difference, team decision 2026-11-27)

- The DCS keeps a minimum total air of 446 T/H, which keeps the bed fluidized. Sources:
  - ABC-006 LN5 floor and ABC-002 LN40 cross limit;
  - OPERATOR_GUIDE 5.3 / 5.4: PA 285 + SA 161 at minimum air.
- DCS limits are plant sheets and are not changed. So where FHI Fig 12 total air is below 446 T/H, the judge
  (tools/model/sweep-judge.cjs) reads the air rows against that floor. O2 is read against the dry O2 the flue gas balance gives at the
  air actually given (s.O2bal, from LS_FG.o2dry of AOI's mole balance). Above that point FHI Fig 12 / Fig 7 hold as printed.
- A derived target that a sample cannot give (no O2bal yet) counts as a miss, never a skip.
- On the 3:00 PM main sweep, the floor zone now shows the real gaps:
  - total air 473 vs 446 (6 %);
  - PA 314 vs 285;
  - SA 123 vs 161.
