# Plan: split `unit.js` (Full Audit 3 #11)

AUDIT FIX : LISA, 2026-11-24 00:25 PHT. Plan only. Runs ONLY in a window the coordinator gives, when no open branch edits `src/analog/engine/unit.js`.

## Why

`src/analog/engine/unit.js` is 6,244 lines (main ae7e227), the whole plant model outside the boiler gas side. Audit 3 ranking 11.

## How (zero behaviour change, provable)

The build joins the files of `src/analog/order.list` with no separator (`tools/build/build.js`: `fileList(l).map(rd).join('')`), and the Worker bundle reads the same list (`tools/build/engine-bundle.js`). So cutting `unit.js` at line boundaries into files listed in the same place, in the same order, gives a **byte-identical** `dist/logic-sim-v*.html`. Proof in the PR: sha256 of the built html before and after (with the same version), and `npm run check` SAME.

New files (in `order.list` in place of `engine/unit.js`, this order; line ranges of main ae7e227, re-cut on the newest main at the window):

1. `engine/unit-core.js` 1-1314: AN_STORE, AN_UNIT, start / stop / cold / restart, turbine commands, DITL links.
2. `engine/unit-water.js` 1315-2153: sea water, make-up, auxiliary cooling water, bottom ash coolers.
3. `engine/unit-gas-bed.js` 2154-2511: condenser constants, furnace gas, back pass, bed.
4. `engine/unit-cycle.js` 2512-3192: stop valves, condenser, feedwater, turbine work, HP / LP heaters, drains.
5. `engine/unit-aux.js` 3193-4697: plant tags, auxiliary steam, lube coolers, motors, air, start-up feedwater, coal, tube leak, air valves.
6. `engine/unit-gen.js` 4698-5213: turbine flow, grid, generator, chemistry, sootblowers, reheat warming.
7. `engine/unit-step.js` 5214-6244: the unit step.

Cuts only between top-level declarations (no function or object is cut). Every new file starts with the first line of its first declaration, so no comment is moved away from its value.

## Other files that change

- `src/analog/order.list` (the 7 names).
- `tools/data/instrument_coverage.js` line 174: the only tool that reads `unit.js` by path; it reads the 7 files.
- Comments that say "unit.js X" stay true enough (the names start with `unit-`); `HANDOFF.md` 5 and `src/README.md` list the new files.
- `tests/**`: 28 files name `unit.js` in comments only; none reads it by path. No test changes.

## Version

A code PR: version number from the coordinator (Jennie's even series), `docs/versions/v<ver>/UPDATE_REPORT.md`, new `dist`.
