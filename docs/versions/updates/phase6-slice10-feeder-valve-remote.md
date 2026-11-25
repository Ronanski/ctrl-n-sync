# Phase 6 slice 10: REMOTE selector ng outlet valve ng coal feeder A / B / C (2026-11-26 PHT)

Ano ang nakikita ng operator: ang YSR-CL1061-A7 / B7 / C7 ("REMOTE" ng outlet discharge isolation valve, ibig sabihin ang DCS ang
nagpapatakbo ng valve at hindi ang lokal na panel) ay 1 na sa normal na serbisyo. Maaaring ilipat ng trainer sa LOCAL mula sa Plant menu.

- Source: IO list STN104 I.0135 / I.0455 / I.0495; ang DCS ang nagbubukas ng valve sa serbisyo (XV-CL1061-x open command, DITL-20 kasama ang
  ZSO / ZSC-CL1061-x7). Walang logic row na bumabasa nito (CRT lang).
- Bilang: hindi nakakabit na I/O 96 -> 93; may value 2191 -> 2194; B2 38 -> 35.
- Hindi ginawa (walang drawing na nagpapakita kung saan galing): LAH-CL1008-A / B / C (O.0770 / 0772 / 0774) at DOR-CL1061-A / B / C
  (O.0776 ~ 0778), mga output ng DCS papunta sa ibang panel. Kailangan ng basa ng wiring o ng coal handling drawing sa PC.
- Hindi sinubok: sa browser (live app).

## Dagdag: furnace pressure C-2 (slice 11)

- PT-FG1087-2 (STN101 AI0773, pangalawang transmitter ng furnace pressure C) ay may value na: ang parehong furnace pressure na binabasa ng
  C-1 (PT-FG1087-1 AI0388, ABC-008). Snapshot 150 MW: C-1 -15, C-2 -14 mmH2O. Hindi nakakabit 93 -> 92.
- Hindi ginawa (walang source ng value): PT-FG1009-A1 / B1 (seal pot, snapshot lang ang mayroon), IT-L1060A ~ D (current ng ash cooler
  kapag tumatakbo), TI-FA1052; plant air compressor at dryer (STN105): labas sa saklaw ng HMI (rule ng user).
