# Phase 6 split (GO HATI, user 2026-11-26 4:40 PM PHT): who owns which files

Two threads work on Phase 6 at the same time. Each thread edits only its own files. A shared file is edited only in its own sentence or row, and is read again just before the edit.

## DCS side: phase thread (this thread)
Work: the 5 DCS I/O with no source.
- BUZZER-OUT: no drawing of the annunciator sequence.
- MOF / MOR-N1040 / N1042: air heater sootblower; when the motor returns within the 19 min 40 s is not written.

Owns:
- `src/analog/**`, `src/world/**`, `src/digital/parts/**`, `src/digital/order.list`
- `src/data/io-*.json`, `src/data/st150.txt`
- `tests/lanes/qa/trace-gate.cjs`, `tests/lanes/boiler/**`, `tests/lanes/qa/ai-suma.cjs`, `pid-*.cjs`, `man-station.cjs`, `force-manual.cjs`, `switches.cjs`
- `tools/trace/**`, `tools/steady150/**`
- `docs/versions/updates/phase6-dcs-*.md`

## TCS side: MARIA (lane 1)
Work: the TCE / TCA / G sheets that do not run yet. 405 of 419 run as logic on main after Phase 5, so 14 are left. The reasons are listed by `tests/tce/sheets.cjs`:
- CMP / PIF / TB SW not wired (HIACS default);
- PIF G / TI not on TCA740;
- AM M printed;
- the G-5A / G-6A 24 V/Hz curve.

Owns:
- `src/digital/tce/**`, `src/digital/tce-run.js`, `src/digital/tce-io.js`, `src/digital/tce-live.js`
- `tests/tce/**`, `tests/lanes/qa/tce-complete.cjs`, `tcs-*.cjs`
- `docs/versions/updates/phase6-tcs-*.md`

## Shared (own sentence only, re-read before the edit)
- `docs/PHASES.md` row 6: the DCS sentence belongs to the phase thread, the TCS sentence to MARIA. The status column is changed only after both sides agree.
- `HANDOFF.md`.
