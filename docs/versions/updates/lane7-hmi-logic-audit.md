# Lane 7: audit "HMI and logic move as one" (tools/audit/hmi-logic.cjs)

## Ano ang bago
- Bagong audit tool: `node tools/audit/hmi-logic.cjs <dist html> --md out.md`. Binubuksan ang app sa 150 MW at sinusuri ang bawat control ng bawat HX page (machine, valve, controller, push button):
  (a) sumusulat ba ito sa address ng sheet (DITL push button row / HMI address, ABC loop, CRT port ng TCE program), hindi sa shortcut ng engine;
  (b) ipinapakita ba ng faceplate ang permissive at interlock ng sheet na iyon;
  (c) ang feedback ba ay galing sa output ng sheet o sa field row ng I/O list, hindi sa plant model.
- Ang hand valve, local na makina at makinang binabantayan lang ng DCS ay hiwalay na bilang (walang DCS control na maikakabit).

## Bilang (main, 2026-11-25)
- 433 control: 397 OK, 36 kulang. 411 state: 384 bumabasa ng sheet o field row. 49 field item.
- Kulang sa lane 7: turbine (9 lumang TCS button at 27 state ng plant model), turbine oil (7 TCS pump ng lumang model), auxiliary steam (3 TCS machine ng lumang model), sea water (CTCS-A / B walang state row sa DITL-119, nasa local panel; S-1504 walang permissive row).
- Ang mga TCS item ay naghihintay sa engine: ang TCE program ay nagpapakita at nagkukumpara lang ng output (src/digital/tce-live.js); ang plant ay pinapaandar pa ng lumang tcs.js. Kapag ang TCE output na ang nagpapaandar ng plant, ang mga ito ay ililipat sa mga CRT port na nasa Turbine operation at Turbine oil pumps and motors page.

## Sinubok
- Pinatakbo ang tool sa main (headless, 150 MW): ang buong report ay nasa project files `lanes/hmi-water-steam-turbine/hmi-logic-audit-2026-11-25.md`.

Lane 7, HMI TURBINE : MINAMI
