# Phase 13: instructor station TAPOS (2026-11-27, 8 AM PHT, PHASE 13 INSTRUCTOR : MIRU)

Labas ng user "Go 10 13 15" (2026-11-27 7:00 AM PHT). Walang hiwalay na instructor console (RULES.md 3.2, audit #6): ang Plant menu ng
station at ang Run / Pause / Speed ang mga gamit ng instructor.

## Binago (nakikita ng operator)
- Plant menu, bagong seksyon **Backtrack**: ang app mismo ang nagtatabi ng buong planta bawat 2 min ng plant time habang tumatakbo (huling
  30 = 1 oras sa x1, sa memory lang; ang reload ng page ay nagbubura nito, ang Save now ang pangmatagalan). Bawat hilera: "Plant time h:mm:ss"
  (parehong orasan ng event log) at ilang fault ang naka-on; Back (dalawang pindot) = ibinabalik ang planta doon at naka-Pause. Ang mga punto
  pagkatapos nito ay nawawala. Hindi mas madalas sa 20 s ng totoong oras (x60 / x300). Bagong simula o LOAD ng save point = bagong listahan.
- Plant menu, Starting point: dagdag ang **Warm** at **Hot** (dati 150 MW at Cold lang; nasa start screen na sila dati).
- Pangalan (user "Instructor kasi di tugma sa mga laman na menus?"): ang 2 natirang text na "Instructor" ay "Plant menu" na (event log ng
  52L1, at ang "no save point yet" ng start screen). Bantay: phase13-gate bagsak kapag may text ng app na "Instructor" ulit.
- Speed: dagdag ang **x0.5** (mabagal). Ang listahan: x0.5, x1, x5, x10, x60, x300.

## Sinubok (headless, Worker engine, 150 MW; `tests/gate/instructor.cjs`, 31 PASS)
- Plant menu: lahat ng seksyon at button (4 simula, Save now, Turbine trip, 52L1).
- Pause: plant time nakatayo. x1 = 1.01, x0.5 = 0.50, x5 = 5.04 plant s bawat s.
- Backtrack: 3 punto; fault ng PT-MS1002 inilagay; Back sa una = plant time bumalik (72612.0), fault off, 1 punto na lang, naka-Pause.
- Malfunction sa Plant menu (dalawang pindot) on; Clear all faults = wala nang on.
- Field action: ring header drains V-BD1005 ~ 1021 bukas 25 % at sarado ulit.
- Warm (drum 108.5 kg/cm2) at Hot (96.3 kg/cm2) mula sa Plant menu naglo-load. Walang page error.
- Bantay sa Checks: bagong step na INSTRUCTOR GATE; `tests/lanes/qa/phase13-gate.cjs` (bagsak kapag natanggal ang step, kapag may function na
  hindi na sinusubok, o kapag bumalik ang instructor console / scoring).

## Hindi sinubok / natitira
- Hindi sinubok ng live na pindot ng tao sa PC (headless lang).
- Ang 2 min x 30 ay piling numero ng team: walang kopya ng ANS-3.5 sa repo.
- Ang galaw ng bawat malfunction laban sa logic at physics ay item ng Phase 12 (ACCEPTANCE "Malfunctions"), hindi ng Phase 13.
- Ang "◀ Back" sa toolbar ng Engineer (isang ABC sheet, ilang segundo) ay hiwalay na gamit ng engineer, hindi ang backtrack ng buong planta.
