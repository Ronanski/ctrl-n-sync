# Phase 11: the port file and the three model gates (2026-11-27)

Source: user 2026-11-27 11:05 AM PHT "Ok sinisimulan naba plant model? Gawin nio na" (start Phase 11) and 11:13 AM "Baka naman may
existing na plant model na. Baka gumawa p ng bago at patungan ito?" (repair the existing model, no second model on top).

- `src/analog/engine/ports.js` (joined right after engine/steam.js): THE ONE list of what flows between the 7 model parts (AOI
  combustion, KANA drum / backpass, RIN turbine / reheat steam, MEI condenser, NANA feedwater, YUI generator, SUZU balance of plant):
  59 ports, one writer each, one unit set (T/H, kg/cm2 abs, C, kJ/kg, kW, MW), design values at 150 MW only from HB PPE-14-0725 /
  FHI / L20 with the document named. anPortSet / anPortGet; anPortBalance = whole-plant water and steam mass in - out - d(store)/dt,
  with every port or store not written yet listed (never filled with a guess). Nothing writes a port yet: the parts do, as they repair
  their code.
- `tests/lanes/model/ports.cjs` (Checks, lane tests): every port has a writer and readers that are parts, variables with units, a
  document for each design value; the design values equal the Part 1 / HB numbers; ports.js loads before the parts.
- `tools/check/one-path.cjs` (Checks): fails when a name is defined twice in the one analog script, or when a plant value U.<field>
  gets a second function that computes it (the 35 fields with more than one writer on 2026-11-27 are the baseline; it only shrinks;
  start / cold / reset functions are left out). Limit: a function is found by its "function name(" line at the start of a line;
  code inside an object or a nested function is counted under the last such name.
- `tools/check/no-fit.cjs` (Rule 0): a flagged line that moves to another file keeps its baseline entry (moves need no --update);
  new pattern on code only: a value divided by the MCR (/ 460, / U.mcr); a ceiling of 45 flagged lines that only goes down
  (--update refuses to grow the baseline). The one new line it found (hx.js anHxSettle gas mass pro rata on the steam) is in the
  baseline.
- `tools/model/sweep-judge.cjs` and `tools/accept/part1.cjs SWEEP=1`: one snap every plant minute on the whole way 150 -> 90 -> 45 MW,
  each judged against the design curve at its own load (docs/accept/curves/curves.json; FHI x = MSF / 460, HB x = MW / 150; no
  target outside the printed range; tolerance = docs/accept/part1-targets.json).

Not done yet: the energy balance (needs the parts' ports), the first sweep result (running), the Phase 11 gate in PHASES.
