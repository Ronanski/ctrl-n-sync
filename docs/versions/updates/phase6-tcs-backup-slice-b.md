# Phase 6 TCS slice B: macro insides from the HIACS backup (2026-11-26 PHT)

Source: the HIACS controller backup of the TCS (TCE station 2018-07-14), macro insides decoded on the PC by lane 0
(`tcs-macros.json` / `tcs-macros-2026-11-26.md`: 28 macro types, 56 instances on 49 sheets, 587 blocks). User 2026-11-26 7:00 AM
"Gamitin", values allowed in this repository.

## What was coded
- `src/digital/tce-run.js` `BKM` + `bkMacro()`: the inside of a macro is run as its own blocks of the same block library (K), in
  feed order, with the backup parameters in record order (TP / TD / TW seconds, LCK / UCK / G / GRD K, LG T, FG x1 y1 x2 y2 ...).
  "REF X" inside the macro reads the controller definition of the same name (INITIAL from TCE050, ANN RESET, SIMULATION USE from
  TCE052). The backup inside comes before the manual-text reading where both exist. Mark: src "from the HIACS backup".
- A pin of the backup macro that the drawing does not draw keeps the macro open ("pin X not drawn"): its value in HIACS is not known.

| Macro (LME) | Instances | Sheets |
|---|---|---|
| HMI INDI FOR VALVE (LME125) | 8 | TCE450, TCE451 |
| HEAT SOAK SELECT (LME133) | 1 | TCE163 |
| ACCELERATION RELAY (LME249) | 1 | TCE166 |
| TRIPPLE INPUT DIAGNOSTICS (LME105) | 1 | TCE145 (backup inside replaces the manual-text reading here) |
| UNT-FG (LME010) | 2 | TCE212 003 / 036 (three FG joined at 52 and 89, own curve each) |
| LME286 (one LG, SW = SIMULATION USE) | 7 | TCE500, TCE502 |

## Result
- Macros / UNT-FG running from the backup: 0 -> 20.
- TCS sheets not running: 49 -> 45 (TCE163, TCE166, TCE450, TCE451 now run).
- TCS sheets COMPLETE: 257 -> 261 of 419 (floor raised to 261).
- TCS curves with points: 56 -> 58 of 58 (the two UNT-FG of TCE212).
- Guard test `tests/lanes/qa/tcs-macro-backup.cjs`: each inside against its own backup numbers, and the count may not fall.

## Not coded yet (the backup reading is not plain; reason per macro)
- DENSO receive blocks (operator screen inputs) with no block number, read in pairs by AND blocks: TURNING GEAR (LME030),
  VALVE TEST (LME250 / 252 / 253). Which screen button each one is cannot be told from the table.
- Pins in the backup that the app drawing does not draw: ASTA (TCE220, TCE222, TCE226), TSTF (TCE220).
- Parameter words (PA14 / 21 / 24 / 25 / 46) that feed limits of RL / MR / LMS from wires, and SYSREF constants ("2, 0"):
  VALVE CONTROL MT1 (LME244 / 244A), CV WARMING SET, CRT OPE INC/DEC (also SC), DUAL INPUT DIAGNOSTICS, L-RATE,
  PRESS COMPENSATE MT1, HEAT SOAK CONTROL, LME271 / 280 / 281 / 285.
- Blocks with no number or JOINT with no input: CHANGE OVER (LME300 / 301), HEAT SOAK CONTROL (LME242 / 243), DUAL INPUT
  DIAGNOSTICS (LME110A).
- The value order of multi-value blocks other than CMP / CPL / SG / TD / TW / FG (I, RL, LIN, LMS, MR, LIM, AM, AW) is not written
  in the decoded table.
These are (c) findings: the part of the backup table is named; the next slice asks lane 0 for the record layout of PA / SYSREF / DENSO.

## Tested
`tests/lanes/qa/tcs-macro-backup.cjs`, `tests/lanes/qa/tce-complete.cjs`, `tests/tce/run.cjs`, tce_check, all lanes, build.
Not tested: the new macros live in the browser (TCE163 heat soak select and TCE166 acceleration relay act in the start-up, not at
150 MW).
