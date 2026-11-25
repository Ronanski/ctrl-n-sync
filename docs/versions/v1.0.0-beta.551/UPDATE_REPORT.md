# LMYP OTS 1.0.0-beta.551 (QA : SAORI, lane 8, 2026-11-25)

Sumunod sa beta.550. Tool lang; walang binago sa app, sa plant model, sa logic o sa HMI.

## Ano ang bago (`tools/trace/trace.cjs`)

1. Field contact sa kable ng output row (`WORLD.plantUsw`, hal. DITL-19 MIA-CL1061-A2): nakaguhit sa sheet at ang field ang nagpapagalaw, kaya LINKED (ayon sa station ng sheet at tag).
2. Field state (`FIELD.states`, beta.530): ang tag nito ay value source tulad ng field row.
3. DITL-38 "STATION 101 & 102": ang bawat copy ay kumukuha ng station mula sa I/O tags ng sariling device (#MV-FW1001 = 102).
4. DITL-38 copy: ang valve model ng copy ang sumasagot sa contacts ng sariling device (MIL / MIT / ZSO / ZSC / TS-FW1001).

## Sinubok (main 6683666, 150 MW, 5 plant min, lumang tool -> bagong tool)

LINKED 1,607 -> 1,687; on sheet walang source 115 -> 103; model / page 376 -> 357; nasa drawing hindi sa row 189 -> 138; wala kahit saan 296 -> 298 (S1 MIT / MIL-FA1054-1: dating naitugma sa DITL-38 copy ng ibang station); may live value 1,812 -> 1,864.
