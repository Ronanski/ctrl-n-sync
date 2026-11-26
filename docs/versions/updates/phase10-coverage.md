# Phase 10 (alarms at events), slice 1: ang 717 alarm ng planta, saan nasa app (HIKARU, 2026-11-27 7:30 AM PHT)

Utos: user "Go 10 13 15" (2026-11-27 7:00 AM PHT), kasabay ng #9.

- Isinulat ang "tapos kapag" ng Phase 10 sa `docs/PHASES.md` (3 item: bawat alarm ng list nakatala; bawat alarm row lumalabas at nawawala; mga gawi ng alarm ayon sa DCS ng planta, Fuji MICREX-VieW XX).
- `docs/phase10/coverage.json` (gawa ng `tools/alarms/coverage.cjs` mula sa work list ng Alarm List _20160912 na nasa PC): 717 / 717 tag. 371 may sariling alarm row, 94 ALM block ng ABC drawing, 153 walang set point sa list, 34 LABAS (SCOPE.md 3: compressors at dryers, WTP, fire pump, pits), 15 wala sa DCS I/O list, 50 switch na DITL logic lang ang bumabasa (kulang pa).
- Bantay: `tests/lanes/qa/phase10-gate.cjs` (sa Checks sa `tests/lanes/run-all.cjs`): bawat tag isang beses, bawat row nasa `src/data/alarms`, bawat ALM block nakita sa compiled ABC sheet (94 / 94), bawat dahilan nakasulat; ang 50 ay hindi puwedeng tumaas (`docs/phase10/baseline.json`); TAPOS lang kapag 0.
- Walang binago sa app mismo. Hindi pa nasubok: force test ng 371 row sa Checks (item 2), test ng bawat gawi (item 3).
