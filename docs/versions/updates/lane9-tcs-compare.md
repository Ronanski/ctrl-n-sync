# TCS compare report (lane 9, AUDIT FIX)

## Ano ang bago
- `TCE.compare()` (src/digital/tce-live.js): bawat PI/O output ng live TCS program ay may isang estado. Ang mga estado ay same / differs, walang engine value, builder box na walang row, reader box, generator panel, at walang row. May dahilan din ang bawat isa (ang text ng end sa tce-io.js).
- `TCE.outs()`: ang lahat ng output ng program at ang value nito ngayon (para sa HMI at QA).
- Report: docs/audit/tcs-compare-2026-11-25.md (bilang galing sa app na tumatakbo, 150 MW).

## Nakita
- 376 PI/O output. Wala pang maikukumpara ngayon. 187 ay nasa builder sheet na walang pangalan ang box: hihingin kay MARIA ang `row` sa outs(). Doon din nakatira ang 38 na may engine value na. 36 ay servo coil na wala pang engine value: hihingin kay TSUBASA. 70 ay reader box at 83 ay generator panel.

## Test
- tests/regress/tce_live.cjs (headless, station page 150 MW): idinagdag ang check na ready ang compare at buo ang bilang ng mga estado (376).

SORA
