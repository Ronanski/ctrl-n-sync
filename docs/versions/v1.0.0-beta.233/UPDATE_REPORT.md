# LMYP OTS 1.0.0-beta.233

21 Nov 2026. The first version raise after 1.0.0-beta.232. It covers the 11 merges made since (Full Audit 3 fix plan).

## Changed

| PR | What changed for the plant or the operator |
|---|---|
| 403 | TCS: ATS criteria set points corrected; bypass signals come from the DCS |
| 406 | Reheat after sync: a 0 % turbine valve position from Modbus is read as good (ABC-050 average select) |
| 407 | HMI: blank values filled, IT-SB01, label overlaps, tablet frame |
| 408 | Upper furnace gas heat from radiation (WSGG) and convection, part-load superheat |
| 409 | Drum pressure storage: steam space only, no double count |
| 411 | Android signing key out of the repo (GitHub secret) |
| 412 | Behaviour gate in Checks: steady 150 MW at a fixed 0.5 s step, same numbers twice, SAVE / LOAD |
| 413 | Engine values for two blank HMI fields: LP bypass outlet and IP inlet pressure |
| 414 | Plant clock starts at 0:00 at a starting state |
| 415 | Backpass fouling time constant from the plant trend: 8 h to 56 h |
| 416 | Save points read by sheet name (format 2 with a sheet map): a save stays good when the sheet order changes |

## Tested

Each PR passed Checks (build, sheet check, behaviour gate). PR 415 and 416 were also run headless at 150 MW. The operator long test (8.07 h at 150 MW, real clicks) ran no trip.

## Not tested

Cold start-up and load changes were not run for this version.

## From now on

Checks fail on a branch that changes the app without raising `delivery/app/app.json` above main and adding `docs/versions/v<version>/UPDATE_REPORT.md` (`tools/version-check.js`).
