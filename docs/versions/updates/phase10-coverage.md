# Phase 10 (alarms at events), slice 1: ang 717 alarm ng planta, saan nasa app (HIKARU, 2026-11-27 7:30 AM PHT)

Utos: user "Go 10 13 15" (2026-11-27 7:00 AM PHT), kasabay ng #9.

- Isinulat ang "tapos kapag" ng Phase 10 sa `docs/PHASES.md` (3 item: bawat alarm ng list nakatala; bawat alarm row lumalabas at nawawala; mga gawi ng alarm ayon sa DCS ng planta, Fuji MICREX-VieW XX).
- `docs/phase10/coverage.json` (gawa ng `tools/alarms/coverage.cjs` mula sa work list ng Alarm List _20160912 na nasa PC): 717 / 717 tag. 371 may sariling alarm row, 94 ALM block ng ABC drawing, 153 walang set point sa list, 34 LABAS (SCOPE.md 3: compressors at dryers, WTP, fire pump, pits), 15 wala sa DCS I/O list, 50 switch na DITL logic lang ang bumabasa (kulang pa).
- Bantay: `tests/lanes/qa/phase10-gate.cjs` (sa Checks sa `tests/lanes/run-all.cjs`): bawat tag isang beses, bawat row nasa `src/data/alarms`, bawat ALM block nakita sa compiled ABC sheet (94 / 94), bawat dahilan nakasulat; ang 50 ay hindi puwedeng tumaas (`docs/phase10/baseline.json`); TAPOS lang kapag 0.
- Walang binago sa app mismo. Hindi pa nasubok: force test ng 371 row sa Checks (item 2), test ng bawat gawi (item 3).

## Slice 2 (8:00 AM PHT): ang 50 switch
- 48 switch ng list na DITL logic lang ang bumabasa ay may sariling alarm row na (`src/data/alarms`, 13 group file). Level at estado ng alarm ay kapareho ng kapatid na row na nasa app na (hal. PSHH-FG1085 = PSHH-FG1086; PS-LO1115-A1 ~ A3 = B1 ~ B3; SS-BH1060-A = DITL-21A "SPEED LOW" gaya ng B ~ D); ang wala pang kapatid: level mula sa pangalan ng switch (SH = HIGH, SL = LOW, SLL = LOW-LOW, iba = ALARM) at ang set ng list.
- 2 hindi row: LS-IW0724 (fire water tank T-0724, LABAS sa SCOPE.md 4) at BT-DO1043-C (walang set point sa list, gaya ng D).
- Sa 150 MW (headless, 4 s): walang bagong nakatayong alarm mula sa 48.

## Slice 3 (8:40 AM PHT): force test ng bawat alarm row (item 2)
- `tools/alarms/force.cjs` + `tests/lanes/qa/phase10-force.cjs` (Checks, mga 35 s): mula 150 MW, sabay-sabay na pinipilit ang lahat ng point sa isang level bawat pasada (H, HH, L, LL, switch), saka ibinabalik. 753 row: 723 may linya at tamang priority; 753 nawawala pagbalik.
- Ayos sa app (`src/analog/engine/alarm-pri.js`): (1) iisang linya bawat DCS point: ang list ay may element 1 at 2 ng iisang RTD (TE-CD1116-AU1 / AU2) pero iisa ang I/O (TT-CD1116-AU, STN103 AI0960), kaya dati 2 linya; (2) ang switch na ang source ay DI field row ng lane (field state na sine-set ng instructor) o ABC input na sinusulat ng model (PS-CD1110-1 ~ 3) ay nababasa na; dati hindi lumalabas ang alarm nito.
- 30 walang linya, nakasulat sa `docs/phase10/open.json`: b 9, m 21 (Phase 11).
- Sa 150 MW: 17 nakatayong alarm, pareho sa dati (walang bago).
