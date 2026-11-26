# Phase 6 DCS: the last 5 I/O with no source (2026-11-26, 7:45 PM PHT)

Source: YUA PC read `/mnt/project-files/phase6-dcs-5-signals-2026-11-26.md`.

## 1. BUZZER-OUT (STN104 O.145F)
- One buzzer for the whole OPC annunciator, through relay RY1 at 24 VDC (K1AU3-E2-0-113 as-built, sheet OP11(5)).
- Memory list 104 gives "BUZZER KEEP" per window (M.4001, odd) and "BUZZER FOR OPC-ANN-A ~ J" (M.4130 ~ M.4139). It gives no buzzer timer and no silence button.
- The app (`src/station/station.js`) sounds the buzzer:
  - while any window is new and not yet acknowledged;
  - while TEST is held.
- ACK stops it. A new alarm after ACK sounds it again.
- The chain is INFERRED, because the gate sheet is not readable in the docs. The TEST horn is also INFERRED.

## 2. MOF / MOR-N1040 / N1042 (STN102 I.0737 / I.0738 / I.073B / I.073C)
The blowers are Clyde Bergemann Mk VX-AB, stroke 750 mm.

How the lance moves (`src/analog/engine/unit.js` AN_SB.aph, U.sbA.x / mv):
- **Forward:** one continuous run to full stroke, with no dwell at the end.
- **Reverse:** 20 steps of 38 mm, with a 55 s dwell between steps (one rotor turn).
- **Speed:** DERIVED as 11.1 mm/s, so the whole cycle takes exactly 19 min 40 s (OMM p.15). That gives forward 67.5 s and each step 3.4 s.
- **Steam:** counted only beyond 50 mm (the poppet valve).

What the DCS contacts show:
- MOF is on while the lance goes forward.
- MOR is on only while a reverse step moves.
- N-1040 = hot end and N-1042 = cold end. This is INFERRED from drawing 110460/29/1.
- The order stays as the DITL-80 program has it: cold end at count 29, then hot end at count 30. This matches the control panel manual ("cold end first").

Limit switches on DITL-80L:
- ZSR "NOT ON" = the lance is off park.
- ZSE "NOT ON" = the lance is short of full stroke.

## Counts (QA trace, 150 MW, 2 plant min)
- I/O with no link: 5 -> 0.
- I/O with a value: 2,257 -> 2,269.
- Input I/O nowhere: 10 -> 6.

## Tested
- New test `tests/lanes/boiler/aph-blower.cjs` runs one cold end cycle headless. Results:
  - forward 67.4 s;
  - 20 steps, 58.4 s apart;
  - cycle 1180.0 s;
  - back at park;
  - MOF and MOR are never on together.
- `tests/lanes/qa/trace-gate.cjs`: pass.

## Not tested
- The live app (the annunciator horn label and the TEST button).
