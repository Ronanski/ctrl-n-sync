# Phase 6 DITL half (lane 1 MARIA, 2026-11-26): DITL inputs with no source 109 -> 83

**Source:** the phase thread's audit (/mnt/project-files/phase6/phase6-ditl-handoff-2026-11-26.md): B1 DITL inputs with no source, and B5 machine copy clashes. Both come from `tools/trace/trace.cjs --start 150 --mins 2`.

## Fixed (26 rows), new field file src/world/field/ditl.js
- **DITL-42 rows 1 ~ 6, PLANT / INSTRUMENT AIR COMPRESSOR A ~ C RUNNING** (MIR-C0703A ~ C, MIR-C0704A ~ C): 6 rows.
  - They read the run state of the air model (unit.js anAirStep, U.paR / U.iaR).
  - The model also writes the same contact on DITL-114 / DITL-113, so there is one source.
- **DITL-45 A / #B / #C, PLANT / INSTRUMENT AIR DRYER REMOTE and PLANT AIR DRYER ALARM:** 15 rows.
  - The FROM column (45-55 / 56 / 66) names an output of the same sheet. That is the CRT repeat of the field contact, not its source (the same reading as field/boiler.js item 10).
  - Each is a field state, set to its normal service state:
    - REMOTE = 1 (the dryer is started from the CRT on the same sheet). DERIVED.
    - ALARM = 0.
- **The sootblower panel contacts:** 5 rows. Field states, normal 0:
  - DITL-80Q rows 11 / 12 / 38: N-1011 / 1012 / 1038 SOOTBLOWER TRIP.
  - DITL-80K row 10 (I.073D): AIR PREHEATER SOOTBLOWER TRIP.
  - DITL-80M row 2 (I.073E): AIR PREHEATER SOOTBLOWER SYSTEM LOCAL SELECTED. The sootblowing runs from the DCS. DERIVED.
- **Test:** tests/ditl/air-field.cjs. It covers the values at 150 MW and an instructor trip of N-1011.
- **Baseline** (tools/trace/baseline.json):
  - B1_ditlInputNoSource 109 -> 83
  - io.linked 1854 -> 1855
  - io.value 2257 -> 2266
  - io.noSource 30 -> 29

## Left (83 rows)
- **Needs the linker (src/world/world.js, the phase thread's file):** DITL-80Q row 39, AIR PREHEATER SOOTBLOWER TRIP. It is the same contact as DITL-80K row 10, but it has no tag or address word that a field row can match.
- **SPARE by its own text:** DITL-BA74 row 5. It stays in the count until the trace skips a row printed SPARE (phase thread).
- **Drawing reads asked of lane 0** (/mnt/project-files/phase6/phase6-ditl-sources-request-2026-11-26.md):
  - DITL-21A A ~ D rows 5 / 7 / 11 / 12 / 17: 19 rows.
  - DITL-43: 4 rows.
  - DITL-61A A / #B row 27: 2 rows.
  - DITL-80K rows 16 / 17: 2 rows.
  - The bottom ash PLC BA sheets: 29 rows, which include 16 STEP>=n and 2 FLASHER.
  - The limestone PLC LS sheets: 14 rows.
  - The sand PLC 771 ~ 777: 9 rows.
- **B5 machine copy clashes (19):** not yet sorted. Most are DITL-21D / 21E / 23B / 61A / 112 rows whose address list is shared by the copies. That is the copy mapping of the linker.
