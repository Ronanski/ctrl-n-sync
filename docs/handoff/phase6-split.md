# Phase 6 split (GO HATI, user 2026-11-26 4:40 PM PHT): who owns which files

Two threads work on Phase 6 at the same time. Each thread edits only its own files. A shared file is edited only in its own sentence or row, and is read again just before the edit.

## DCS side: phase thread (this thread)
Work: the 5 DCS I/O with no source.
- BUZZER-OUT: no drawing of the annunciator sequence.
- MOF / MOR-N1040 / N1042: air heater sootblower; when the motor returns within the 19 min 40 s is not written.

Owns:
- `src/analog/**` (except `src/analog/engine/tcs-tpc.js`, `tcs-trip.js` and one line of `tcs-sheets.js`, MARIA since 2026-11-26 6:20 PM PHT), `src/world/**` (except `src/world/field/ditl.js` and the machine copy address mapping of `world.js`, MARIA), `src/digital/order.list`
- `src/data/io-*.json`, `src/data/st150.txt`
- `tests/lanes/qa/trace-gate.cjs`, `tests/lanes/boiler/**`, `tests/lanes/qa/ai-suma.cjs`, `pid-*.cjs`, `man-station.cjs`, `force-manual.cjs`, `switches.cjs`
- `tools/trace/**`, `tools/steady150/**`
- `docs/versions/updates/phase6-dcs-*.md`

## TCS side: MARIA (lane 1)
Work: the TCE / TCA / G sheets that do not run yet. 407 of 419 run as logic on main after Phase 5, so 12 are left. The reasons are listed by `tests/tce/sheets.cjs`:
- CMP / PIF / TB SW not wired (HIACS default);
- PIF G / TI not on TCA740;
- AM M printed.
(The G-5A / G-6A 24 V/Hz curve is done in Phase 5, PR 638.)

Owns:
- `src/digital/tce/**`, `src/analog/engine/tcs-tpc.js`, `src/analog/engine/tcs-trip.js` (TPC inputs, IBD TC-17 net 5 to TCE163), `src/digital/tce-run.js`, `src/digital/tce-io.js`, `src/digital/tce-live.js`
- `tests/tce/**`, `tests/lanes/qa/tce-complete.cjs`, `tcs-*.cjs`
- `docs/versions/updates/phase6-tcs-*.md`

## Shared (own sentence only, re-read before the edit)
- `docs/PHASES.md` row 6: the DCS sentence belongs to the phase thread, the TCS sentence to MARIA. The status column is changed only after both sides agree.
- `HANDOFF.md`.

## DITL half of the Phase 6 audit: MARIA (from 2026-11-26, 7:05 PM PHT)
Work: the 109 DITL inputs with no source and the 19 machine copy address clashes of the QA trace. List and how it is made:
`/mnt/project-files/phase6/phase6-ditl-handoff-2026-11-26.md`.

Owns:
- `src/digital/parts/**`;
- a new field file `src/world/field/ditl.js`, for the field values those rows need (the shape is in `src/world/field/README.md`);
- the machine copy address mapping in `src/world/world.js` (only that section, for the 19 copy clashes);
- `tests/lanes/ditl/**`;
- `docs/versions/updates/phase6-ditl-*.md`.

A value already made by `src/world/plantsw.js` or another field file stays there (one source per tag): ask the phase thread.

The phase thread keeps the ABC half and the Phase 6 TAPOS gate. In `tools/trace/baseline.json` MARIA lowers only `breaks.B1_ditlInputNoSource`, `io.copyClash` (and any count her PR makes better); the phase thread lowers the rest.
