# Phase 11: 150 MW start state on the design throttle pressure, O2 trim in AUTO (phase thread, 2026-11-28)

## What changed
- `src/data/st150.txt` re-settled 60 plant minutes on main code (tools/steady150/settle.cjs 60 lineup-logic).
- `tools/steady150/init/lineup-logic.js`: on top of CBD MV-BD1002 shut and HIC-TADBS 0:
  - AICFG112 (ABC-002 O2 trim) in AUTO: at full load the logic runs it in AUTO (M.0103 / M.0102 = NOT FICFA1081.REM = 0, SA flow in REMOTE); SV stays the station's 3.5 %.
  - PIC-COBM (ABC-001C) SV = the design throttle pressure: Hitachi HB PPE-14-0725 cases 1 ~ 6, 126 ata at the MSVs, minus 1.0332, plus the model's main steam line drop at this flow (PT-MS1002 is the SH outlet) = 126.58 kg/cm2 g. Raised at 0.2 kg/cm2 a minute: a 4.3 kg/cm2 step at once overshot to 134 and tripped the unit (settle G).
- `tools/steady150/settle.cjs`: calls the init's `__settleMinute` once a plant minute (an init may move a set point at an operator's rate).

## Result (headless settle)
- Before: MW 149.1, PT-MS1002 122.37 kg/cm2, main steam 456.7 T/H.
- After 60 min: MW 151.1, PT-MS1002 126.73, main steam 461.7 T/H; minutes 50 ~ 60 within 126.37 ~ 126.75.
- Modes on the new start after 2 min: PIC-COBM AUTO (SV 126.58), AICFG112 AUTO, FIC-CM AUTO, HS-COAL AUTO.

## Not in this state
- AOI's design air heater seal leak (OMM sheet 16): added as a step on a settled state it took 53 T/H from the furnace at once, the three coal feeder demands passed 83.3 % (M.014F / 015F / 016F), ABC-004A TON 30 s AND M.3405 forced FIC-CM and then the boiler master to MANUAL, and pressure ran to 134. AOI agrees: the leak goes in with a settle where the O2 trim raises the SA from the start.

## Tested
- Behaviour gate 20 min on the station build: ALL PASS (MW 151.06 -> 150.92, PT-MS1002 126.73 -> 126.52, drum level max move 7 mm, SAVE / LOAD and repeat runs equal).

## Also in this PR
- Sweep tool (tools/accept/part1.cjs): the Pms sample is at the MSVs (PT-MS1002 less the main steam line drop anMsDrop(U, ms, mhp).msv, RIN 721), the HB row's own point; MSTt is the turbine inlet U.Tt (anMsT, RIN 721).
- no-snapshot guard: the RULE 0 VIOLATION tags have a ceiling in the baseline (`_rule0`, 4 on main after AOI's 725: cfb.js kKL, boiler.js opacity, stack velocity, FA flow / header). More tags = FAIL; `--update` refuses an increase. Tested: a 5th tag FAILs, removed it PASSes.
