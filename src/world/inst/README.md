# src/world/inst: unit instances from data (PR 0, lane plan 2026-11-25)

The sootblower copy of DITL-80G (N-1012 ~ N-1038) made generic. One JSON per instance set (`boiler-burners.json`, `bop-pumps.json`, ...),
owned by the lane that writes it. Built into `window.LANE_INST`; `world.js` makes one copy of the sheet per unit.

    { "sheet": "DITL-xx", "src": "drawing that shows the units",
      "units": [ { "lbl": "B", "addrMap": { "M.1234": "M.1240", "I.0012": "I.0020" },
                   "textMap": [["FEEDER A", "FEEDER B"]], "src": "IO list rows / ABC lines of unit B" } ] }

`sheet` is the sheet code as drawn (`DITL-21A`, without the `(35)` prefix of the sheet list). In the copy every address of the
base sheet named in `addrMap` reads the unit's own address; each `textMap` pair turns the row text of the drawing into the unit's text,
so the FROM links of that row find the unit's own sheets. A label that already exists on the sheet (a machine letter the drawing gives)
is not made twice. Every unit has `src` (or the set has).
