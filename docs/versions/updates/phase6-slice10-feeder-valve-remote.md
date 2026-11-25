# Phase 6 slice 10: REMOTE selector ng outlet valve ng coal feeder A / B / C (2026-11-26 PHT)

Ano ang nakikita ng operator: ang YSR-CL1061-A7 / B7 / C7 ("REMOTE" ng outlet discharge isolation valve, ibig sabihin ang DCS ang
nagpapatakbo ng valve at hindi ang lokal na panel) ay 1 na sa normal na serbisyo. Maaaring ilipat ng trainer sa LOCAL mula sa Plant menu.

- Source: IO list STN104 I.0135 / I.0455 / I.0495; ang DCS ang nagbubukas ng valve sa serbisyo (XV-CL1061-x open command, DITL-20 kasama ang
  ZSO / ZSC-CL1061-x7). Walang logic row na bumabasa nito (CRT lang).
- Bilang: hindi nakakabit na I/O 96 -> 93; may value 2191 -> 2194; B2 38 -> 35.
- Hindi ginawa (walang drawing na nagpapakita kung saan galing): LAH-CL1008-A / B / C (O.0770 / 0772 / 0774) at DOR-CL1061-A / B / C
  (O.0776 ~ 0778), mga output ng DCS papunta sa ibang panel. Kailangan ng basa ng wiring o ng coal handling drawing sa PC.
- Hindi sinubok: sa browser (live app).
