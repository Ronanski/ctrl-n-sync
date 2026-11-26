# Phase 6 DCS audit and the TAPOS gate (2026-11-26, 8 PM PHT)

The ask (coordinator): audit the DCS side against Phase 6. Every ABC / DITL cross-sheet link should have one source, with no dangling or duplicate links. Fix what is found, and add the Phase 6 TAPOS gate.

## QA trace counts (150 MW, 2 plant min; `tools/trace/baseline.json`)

| Count | Before | After |
|---|---|---|
| ABC inputs with no source (B1) | 48 | 5 |
| memory with no source | 10 | 2 |
| DITL inputs with no source | 109 | 107 (MARIA's PR 644 takes it further) |

DITL changes in this PR:
- The SPARE row of BA74 is no longer counted.
- DITL-777 now belongs to station 103.

## Already linked (finding type b): the trace now sees them
- **"BOILER MASTER / TURBINE MASTER / BOILER PRESSURE CONTROL / SETTER IN MANUAL"** (ABC-001A / B / C, 15 wires). The drawing writes HIC-BM.MAN, EIC-TM.MAN, PIC-COBM.MAN and HIC-ULD.MAN over each wire, and engine/ctrls.js modeNetsRaw links them by that text. Tested: HIC-BM to MANUAL turns all 5 BOILER MASTER wires to 1.
- **Unit model writers:**
  - the turbine trip (U.trip / U.vtrip);
  - the station broadcast "BC FROM S2" (U.bcast: M.3200, M.3220, M.3221);
  - the station links (U.alink);
  - the turbine valve positions SI1812 ~ SI1829 (U.vpos).
- **ABC-054 "S2 I.0400 ( M.3200 )":** the address with a note. The engine's one-address link joins it: I.0400 held at 1 on ABC-050 reads 1 on ABC-054.

## Bugs fixed (finding type a)
- **ABC-036 I.029F (No.2 HPH) and ABC-037 I.029B (No.1 LPH) level H.H.**
  - What was wrong: nothing wrote them, so they read 0. They are the same switches as DITL-41 (alarm list 150 mm).
  - Tested: the No.2 HPH level at 200 mm sets ABC-036 I.029F to 1.
- **ABC-052 I.004D / E / F, the condenser pressure switches PS-CD1110-1 / 2 / 3.**
  - Set point: H -0.86 kg/cm2 gauge (alarm list 2016-09-12, sheet PS).
  - What was wrong: they read 0 even with no vacuum.
  - Now: they are made at a condenser pressure of 0.173 kg/cm2 abs or more.
  - Tested: 0.6 abs gives 111, 0.15 abs gives 000.
- These links are kept in U.diX (unit.js anDiXOf), not in U.di. The reason is that the 150 MW start state carries the old U.di. A save without U.diX builds it on its first scan, the same way as U.vpos.

## Left: `docs/phase6/open.json`
- **ABC-003E "→ SW (digital)": b.** The select wire of the 4-leg switch. Its conditions M.009A ~ D are read as signals.
- **ABC-005 M.3403: c.** LIMESTONE FEEDER TRIP (BC FROM S4). The STN104 sender is on no drawing in the app.
- **ABC-009A "SELECT TO b": open** (phase thread).
  - The switch selects by A ~ D-ASH COOLER AUTO (M.021A ~ D, memory list 101). No sheet makes those signals.
  - Wiring them to the coolers' AUTO was tried and NOT kept: the switch is evaluated only when its own wires change, so it gave stale legs. The next slice makes the switch evaluate every scan, checks the other block types for the same fault, then wires M.021A ~ D.
- **ABC-050 I.041E / F, MSV(A) / (B) test from the TCS: open** (MARIA). A TCS output to the DCS.

## Not changed
- **PS-PA1811 I.016A polarity:** 1 = air tank pressure LOW. Sources: I/O list stn 104 row 142, LS10 row 7, LS110 row 3, YUA. LS240 "P > 4" is the set point.

## Gate: `tests/lanes/qa/phase6-gate.cjs`
PHASES row 6 may say TAPOS only when all of these hold:
- TCS: 419 of 419 sheets are complete, and 0 macros are on the manual text;
- DCS: 0 unlinked I/O, 0 copy clashes, and NaN and F(X) are held at 0;
- every B1 ABC / DITL input is a b or c entry in open.json, and no entry is open.

Today the gate passes with row 6 BAHAGI. Left before TAPOS:
- the copy clash (MARIA, PR 644);
- the 3 open ABC entries;
- the 107 DITL inputs (MARIA).

## Tested
- trace-gate;
- the headless checks above;
- the full lane run (48 tests, 0 failed).

Not tested: the live app.
