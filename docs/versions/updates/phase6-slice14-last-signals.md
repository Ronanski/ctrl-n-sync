# Phase 6 slice 14: ang huling signal na walang kabit (2026-11-26 ~4:00 AM PHT)

Batayan: basa ni YUA sa PC (I/O list Rev. 1, wiring list, loop test report 2016-10-13, loop at screen message sheets ng DCS, limestone sheets 160 / 190 at O&M). Walang HIACS backup value, walang plant IP address.

## Ano ang ginawa
- 7 analog (seal pot PT-FG1009-A1 / B1, TI-FA1052, ash cooler current IT-L1060A ~ D): ang bawat isa ay PV ng indicator loop sa loop list ng DCS (`src/ui/plant/dcslists.js`). Binibilang na ito ng QA trace bilang gamit sa display. Walang interlock.
- MIR-P0720 jockey pump running (STN105 I.033C): field state, normal = tumatakbo (ang screen ay nag-a-alarm kapag huminto). Ang instructor ang nagpapatay.
- LI1-FG1057 CEMS common alarm (STN101 I.001F): field state, normal = walang alarm.
- PS-LM1814A / B (STN104 I.016B / I.016C): seal pressure ng vent at balance dome valve = sarado ang valve (O&M: > 5 bar = sarado). Display lang; ang fault logic ng as-built sheets ay ZSO / ZSC pa rin.
- LS-CR1003-1 / 2 (STN102 I.0292 / I.0293): spare. Sabi ng I/O list "not used", walang wire, walang loop test.
- 6 output (LAH-CL1008-A ~ C, DOR-CL1061-A ~ C, STN104): papunta sa coal handling (excluded na system). Nasa `src/data/io-excluded.json`; walang ladder na drawing, kaya walang ginawang logic.

## Bilang
- I/O na walang kabit: 24 -> 5. I/O na may value: 2,253 -> 2,257.

## Natitira
- BUZZER-OUT: walang drawing ng annunciator sequence.
- MOF / MOR-N1040 / N1042: NO-SOURCE. Ang motor ay pasulong hanggang dulo at pabalik (SCM manual), pero hindi nakasulat kung kailan sa 19 min 40 s ito bumabalik.

## Sinubok
- tag-db, field-rows, field (lane 4), field-loader, field-state, field-contact, trace-gate: pasado.
- Hindi sinubok sa live app.
