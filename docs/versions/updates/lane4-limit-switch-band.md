# Lane 4 (RARA): limit switches of the BOP control valves use the one app end-of-travel rule

What changed
- `src/world/plantsw.js`: the end band that the fan vane and HP bypass switches already used (closed <= 2 %, opened >= 98 %) is now one
  named rule, `WORLD.endBand = { closed: 2, open: 98 }`, used by those rows (same numbers, no behaviour change there).
- `src/world/field/bop.js`: the 11 limit switch rows (ZSO / ZSC of FW1060, FW1150, CD1115, CD1124, CD1126, AS1010) read that rule instead
  of their own 0 / 100 %. All 11 are air-operated valves with a positioner (lever switch OMRON D4A-2502N, K1AU3-E2-0-123 R1). Motor
  valves keep their 0 / 100 % stroke ends.

Why: PICAS1004 sits at 0.0001 % with the integral held at the limit (position form, as the real block); a valve at 0.0001 % is closed,
so `ZSC-AS1010` must make. The 0 % rule left it open-circuit.

Before / after (150 MW save, headless page, AN.fieldRead)
- ZSC-FW1150: 0 -> 1
- ZSC-CD1124: 0 -> 1
- ZSC-AS1010: 0 -> 1
- the other 8 rows: unchanged (ZSC-FW1060 1, ZSC-CD1115 1, ZSC-CD1126 1, all ZSO 0)

Tests: tests/lanes/bop/field.cjs 138 rows, 0 problems. Not tested: a sweep with the valves stroked open (no 150 MW valve is near 98 %).
