# Phase 11 (MEI): the 150 MW start is the physics state only (rule 0, user 2026-11-28)

Rule 0 (user 2026-11-28 5:18 AM PHT): plant snapshots, trends and SOP are not used in the plant model, not even as a check.

## Changed
- src/analog/engine/hmi-op.js:
  - The control-room screen tables are deleted: AN_HMI_CTL, AN_HMI_FF, AN_HMI_MAN, AN_HMI_TXT, hmiNearNet, hmiSvWrite.
  - The 400-line screen line-up of anPlantLoad150G is deleted too. It wrote the controller PV / SV / MV and modes, MAN stations,
    running bits and flip-flops.
  - "At 150 MW" is now one path. AN.loadStart('150') reads src/data/st150.txt (the physics-settled save; anSt150Ready) and
    applies it whole (ABC and DITL keyframes, DITL150.savePut).
  - The Cold start builds on the ABC half of the same state.
  - AN_HMI_COMP now holds only the drum (offset 0, one drum).
  - AN_HMI_AI and AN_HMI_DI stay only until SUZU's PR 750 removes the last reads in unit.js / ditl150.js.
- The st150 data reaches every place that starts the plant:
  - the Web Worker: eng-page.js init and eng-host.js;
  - the headless world: tools/trace/world.cjs;
  - tools/steady150/settle.cjs and tools/alarms/force.cjs.
- src/ui/shell/app.js: the "At 150 MW" button no longer runs DITL150.apply + st150 after the load, and no longer says "transmitters
  from the HMI snapshots".
- state.js anStateTabs: the deleted tables are removed. st150 references only AN_HMI_OP.
- tools/steady150/make.cjs is deleted. It made st150 from the screen line-up in the browser. settle.cjs is the one way to remake it.
- tools/steady150/init/sv-design.js (new): for the next re-settle, it puts the operator SVs that st150 still carries from the old
  screens to their design or logic value. The sources are read by YUA from design documents only
  (/mnt/project-files/mei-sv-design-reads-2026-11-28.md):
  - PIC-COBM 129.0, from FHI Fig 11, ramped 0.5 / plant min;
  - PICFG108 -5.1, from FHI 2-8-TAB_7-4;
  - FICFA1055A / B 26, from the ABC design base;
  - PICAS1005 11, from line list AS-1-005;
  - TICAS1001 350, an ABC-033 preset;
  - FICCD1120 99 T/H, from KSB row 15, DERIVED;
  - the heater, DA and hotwell levels 0 mm, from D1-037, DERIVED.
  - NO-SOURCE: AICFG10571, TICBR1140, PICDO0005, TICAS1017, PICSB1052, PICDO1008, PICAS1004 (normal SV) and PICFG108A.
  - This script is not run here. The phase thread runs it in the combined re-settle.
- no-snapshot baseline: 577 -> 480 lines.

## Tested
- 150 MW start, headless:
  - The state matches main exactly at 0 and after 20 plant min (MW, MSP, MST, drum pressure, vacuum, coal, and the MV / SV of
    every PID).
  - Before, the screen line-up was written and then overwritten whole by st150.
- Lane tests: all PASS. phase10-force first failed on the old `__st150` global of world.cjs. tools/alarms/force.cjs now reads
  AN.st150, and the test then passed.
- no-fit, one-path, u-const, no-snapshot PASS.
- The sv-design init applies on the start without error.
- Not tested here: a settle with sv-design.js. That is the phase thread's re-settle.
