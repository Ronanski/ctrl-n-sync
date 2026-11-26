# Phase 6 DITL: rows bound from the PC drawing read (lane 1, MARIA, 2026-11-26)

Source: YUA's read of the drawings, the I/O list and the memory list (groups A ~ D of the DITL sources request). DITL inputs with no
source at 150 MW: **83 -> 33** (copy clash count 1 -> 0). No trip at 150 MW (trace run.trip 0).

## What the operator sees

- Bottom ash, limestone and sand field switches (bag filter DP, ash silo high / low, chain conveyor and bucket elevator block switches,
  rotofeeder fault, vent filter trip and purge fault, silo LSH / LSL, sand venting fan trip, screw cooler inverter trips) read their
  normal service value. The instructor can change each one from the Plant menu (field states).
- Sand silo high level on DITL-BA02 follows the sand model, the same switch as DITL-774.
- DITL-LS240 AIR TANK PRESSURE reads the limestone air receiver of the model (the sheet prints 1 = P > 4 kg/cm2).
- The two DCS flashers M.133F (1 s / 0.5 s) and M.135F (300 ms / 6 s) blink.
- The screw cooler ash temperatures (DITL-21A rows 11 / 12, all four coolers) and the air heater sootblower steam pressures (DITL-80K rows
  16 / 17) take the model value. FURNACE DP LOW M.3122 reaches all four coolers (one station wiring bit).
- DITL-21A row 5 AUTO SEQUENCE MODE SELECTED is linked to DITL-21B output 52, the same as row 26.
- DITL-LS230 rows 6 / 9 hold the set points 2.5 / 0.5 kg/cm2.

## Code

- `src/world/field/ditl.js` sections 4 ~ 6; `src/world/bind/ditl.json` (new, lane 1).
- `src/world/plantsw.js` FIELD rows: optional `row` (drawn row number with `sheet`, for a row whose text has no tag word) and `an: 1`
  (an analog row of the drawing). Agreed with the phase thread.
- `src/world/world.js` FROM ABC linker: a row "(FROM STATION WIRING)" is common to every machine copy.
- `tests/ditl/yua-field.cjs` (41 checks).

## Left (33)

- BA04 ~ BA18 STEP>=n (15): the step register SI0130 is not computed in the app yet (each step sheet writes "n --> SI0130"). Needs
  the register in the engine.
- DITL-43 rows 5 / 10 / 12 / 13 (4): APH running / not trip / speed contacts. The APH inverter reads row 5 in the first scan; binding
  needs the start order checked so the APH does not trip at load (field/boiler.js note).
- DITL-61A row 27 (A and #B, 2): AUTO STARTING M.1183 / M.1193 is an internal gate of the other copy, not an output row.
- Sand operator controls (4): DITL-771 OVERRIDE M.0803, DITL-772 / 777 EMERGENT STOP M.0882, DITL-776 ISO VALVE M.0870. They are DCS
  graphic push buttons / switches; they need the HMI binding. The trace also has no station for DITL-777.
- Analog values drawn on digital rows (7): LS214 r9 LT-LM1800, LS240 r1 / r2 / r3, DITL-774 r1 / r2, BA60 r21.
- DITL-BA74 row 5: SPARE (the phase thread's trace rule).
