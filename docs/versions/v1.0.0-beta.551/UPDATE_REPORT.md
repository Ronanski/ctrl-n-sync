# LMYP OTS 1.0.0-beta.551 (QA : SAORI, lane 8, 2026-11-25)

Sumunod sa beta.550. Tool lang; walang binago sa app, sa plant model, sa logic o sa HMI.

## Ano ang bago (`tools/trace/trace.cjs`)

1. Field contact sa kable ng output row (`WORLD.plantUsw`, hal. DITL-19 MIA-CL1061-A2): nakaguhit sa sheet at ang field ang nagpapagalaw, kaya LINKED (ayon sa station ng sheet at tag).
2. Field state (`FIELD.states`, beta.530): ang tag nito ay value source tulad ng field row.
3. DITL-38 "STATION 101 & 102": ang bawat copy ay kumukuha ng station mula sa I/O tags ng sariling device (#MV-FW1001 = 102).

## Sinubok (150 MW, 5 plant min, lumang tool -> bagong tool)

- main 736a935: LINKED 1,604 -> 1,616; drawing-not-on-row 195 -> 186; model / page 306 -> 303; value 1,726 -> 1,734. Ang 12: 8 sa DITL-38 (S2 MOS-FW1001, MOR/MOS-MS1392, MIL-MS1392, MOR/MOS-FW1002, MOR/MOS-FW1392) at ZSC-FA1043-A ~ D (S4).
- PR 555 (195c397): LINKED 1,604 -> 1,640; drawing 195 -> 178; model / page 376 -> 357; value 1,809 -> 1,817. Dagdag na 24: ZSO / ZSC / MIA-CL1061-A / B / C (DITL-19 copies).
