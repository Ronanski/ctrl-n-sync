# LMYP OTS 1.0.0-beta.236

21 Nov 2026. Alarm priority from Full Audit 3 ranking 13 (Jennie).

## Changed

| Area | What changed for the operator |
|---|---|
| Alarms | Each alarm row has a priority (ISA-18.2), derived from the alarm list's own set points: 1 EMERGENCY = a trip has happened, 2 HIGH = HH / LL (where the logic trips or stops a machine), 3 MEDIUM = H / L or a transmitter deviation, 4 LOW = field status and DCS notes. The engine gives AN.almPri; the alarm screens read it |

## Tested

Build, `npm run check`, and the 150 MW behaviour gate (20 plant minutes, SAVE / LOAD, same run twice) headless.

## Not tested / open

No live clicks on this version. The alarm screens show the priority only after the UI side reads AN.almPri. Cold start-up and load changes were not run.
