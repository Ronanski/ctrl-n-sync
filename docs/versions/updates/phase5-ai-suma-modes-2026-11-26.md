# Phase 5: AI on SIG.AB, SUMA parameters, loop modes at 150 MW (2026-11-26 PHT)

Source: YUA PC read `/mnt/project-files/phase5-pc-reads-2026-11-26.md`. In it:
- FE = FCS2000 Function Edition.
- TB = the textbook.
- The procedures are PR-OPE-5002-02 and PR-OPE-5003-01.

## 1. AI on SIG.AB (fixed)

Before: the AI sent 0 (or the top of the range) while its SIG.AB flag was on. This had no source.

Now (FE p.2-189: "The input signal (input IV value) is output when any error is detected"):
- The AI always sends its input value. The error only sets the flag.
- The flag is on in two cases (FE p.2-186):
  - The trainer forces it: a card or channel error, set with the SIG.AB button.
  - The value is 112.5 % of the range or more, or -12.5 % or less.
- The drawn logic reacts to the flag: the select circuits, the PID FAULT hold (TB p.73) and force manual.

Changes to the screens:
- The SIG.AB button in the sheet window now has two states, OFF and BAD. The old "reads 0" and "reads FULL SCALE" states are gone.
- A transmitter that fails to the end of its range stays in the instructor Faults list. That fault forces both the value and the flag.

Check: at the 150 MW start and the Cold start, no AI is outside the -12.5 ~ 112.5 % band, so no flag turns on by itself.

## 2. SUMA (fixed)

- **K (KK):** the counts added in one hour at 100 % input (FE p.2-110).
  - In plant units, the 100 % input is K x the last digit of RSTS.
  - Example: FIQDO1043A has K 350 and RSTS 9999999.99, which gives 3.50 T/H. That is its AI range, 0 ~ 3.5 T/H.
  - So the total still adds PV x time, as before.
- **CUT (new):** a PV below CUT % of that 100 % input counts as 0.
  - All 10 SUMA rows of FORM 2 have CUT 0. So a negative flow no longer subtracts from the total.
- **RSTS (new):** when the total goes above RSTS, it clears to 0.
- **RES:** no SUMA on the ABC sheets has a reset pin drawn (finding type b).

Test: `tests/lanes/qa/ai-suma.cjs`. It checks:
- With SIG.AB forced, the value still passes and the flag is 1 (read on 107 flag wires).
- A value of 115 % of the range sets the flag.
- CUT.
- RSTS.

## 3. Loop modes at 150 MW (read, not changed yet)

PR-OPE-5003 says: "The unit is operating at full load on automatic control". What the app does, read headless from the 150 MW start:

### Matches the drawing and the snapshot (finding type b)

- **Heater alternate drains** (LICHD11052, 11012, 11022, 11032) and **condenser dumping to raw pit** (LICCD1110B): the station is on its AUTO leg.
  - The output is the EX-MV (0 %) because the drawing's EX-CMD is on:
    - M.0196, M.0186, M.0216 and M.0236 = NOT .MAN of the primary drain controller. These are LICHD11051, 11011, 11021 and 11031, all in AUTO.
    - M.0165 = an AND on ABC-031.
  - So the alternate valve stays closed while the primary drain controls. This matches the snapshot: 02.png shows LCVHD11012 at 0.1 %, A.
  - The PID AUTO test counts these 5 as "MAN" because the PID tracks. The next slice gives them their own count (EX-CMD), with this evidence. The expected results stay the same.
- **FIC-OM:** MANUAL 0 %. This is DERIVED: all oil burners are retracted above 750 C lower furnace (PR-OPE-5002, coal firing). The app agrees.

### Still to fix (next slice)

The 150 MW start state is made again by `tools/steady150/make.cjs`.
- **FICFA1055A:** on its manual leg at the start. Tried headless: a press of A puts it in AUTO and the PID stops tracking.
- **PIC-BASC** (AUTO is DERIVED): the station stays on its B leg after a press of A. Traced on ABC-009A: n108 = NOT M.0211
  (ASH SCREW COOLER CONTROL FORCE AUTO & REMOTE, TON 2 s of NOT M.0212); M.0212 = ALL ASH SCREW COOLER SPEED CONTROL IN MANUAL = 1,
  because the four cooler stations SICL1060A ~ D are MANUAL in the 150 MW start state. The drawing is right: the fix is the start
  state (the coolers in AUTO, as `tools/steady150/make.cjs` already asks).
- **LICBR1001A: correct, finding type b** (YUA PC read 2026-11-26, ABC-010 sheet 23 as-built 2017/10/03, zone D-E/6-7,
  `/mnt/project-files/abc010-m0224-inputs-2026-11-26.md`): M.0224 = NOT M.0222 ("1 ELEMENT SELECTED" S/R), no other gate, and it is
  the BU-CMD of the LICBR1001A output switch (B = RB-MV from FICFW1007.MV). At 150 MW the 3-element control runs (M.0222 = 0), so
  the 1-element controller LICBR1001A follows FICFW1007.MV by its BU-CMD while its mode stays A (snapshot 03.png: A). Same as the
  heater drains: the drawing holds the output, the mode is AUTO. So 6 of the 7 are right; only FICFA1055A (and PIC-BASC through the
  coolers) need the new start state.

## Found, not changed

- Headless, from the 150 MW start with nothing pressed, the drum level goes from 0.5 to -53 mm in 10 plant minutes. The code before this change does the same.
- The 150 MW start state was made with the 0.5 s step. The step is now 0.2 s (Phase 3).
- The start state will be made again in the next slice.

## 4. Slice 2 (2026-11-26, 2:30 PM PHT)
- FICFA1055A: AUTO in the 150 MW start state. `tools/steady150/modes.cjs` loads the start, presses A as the faceplate does
  (check.js autoSv), runs 10 s and writes `src/data/st150.txt` back; nothing else of the start state is made again. A full remake by
  `tools/steady150/make.cjs` (60 plant minutes) was tried and NOT kept: it lost the bottom ash conveyor line-up and the sootblower
  push button state that lanes put on the start state since (3 tests failed: ash-cooler-inlet, old-save-ash, sootblower-pb).
- PIC-BASC: stays MANUAL. Snapshot 16.PNG (149.8 MW) shows the four ash cooler speed controls SICL1060A ~ D in M (screws stopped,
  cycle mode timers) and DPICFG108 in M; the drawing holds PIC-BASC on its manual leg while all four coolers are MANUAL (M.0212).
  The snapshot is direct evidence; the AUTO of the PC read was derived. Finding type b.
- Result: the 9 loops match the procedure, the drawing or the snapshot.
