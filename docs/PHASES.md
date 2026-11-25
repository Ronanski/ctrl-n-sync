# PHASES: ang 15 phase ng simulator at ang estado

Paraan: translated simulator (ang logic ng planta ay isinalin sa app; hindi stimulated, hindi emulated). Ang order ng trabaho ay OPLAN KABIT (`RULES.md` 3.0A): logic, kabit ng bawat address, HMI, saka plant model.

Patakaran ng estado: **TAPOS** lang kapag kumpleto ang "tapos kapag" AT may automated test sa Checks (`.github/workflows/checks.yml`) na nagbabantay, para hindi ito tahimik na masira. **BAHAGI** = nasimulan, may kulang. **HINDI PA** = wala pa.

Huling suri: 2026-11-25 ~7:30 PM PHT (verify mula sa repo, main 5ea1c1e; ulat `/mnt/project-files/audits/phases-verify-2026-11-25.md`). Ang thread na nagbago ng estado ng phase ang nag-a-update ng row nito sa parehong PR.

| # | Phase | Tapos kapag | Estado | Bantay sa Checks | Kulang |
|---|---|---|---|---|---|
| 1 | Saklaw at docs | Isang listahan ng lahat ng docs, aling revision ang masusunod, aling sistema ang pasok at labas, equipment list nasuri | BAHAGI | `tests/lanes/qa/scope-doc.cjs` | Basahin ang equipment list R0 (scan) laban sa RA; simbolo bawat equipment sa page |
| 2 | Pasado / bagsak na sukat (ANSI/ANS-3.5) | Nakasulat muna ang pass / fail ng bawat item, may tolerance at source | BAHAGI | `tests/lanes/qa/acceptance.cjs` (table = data `docs/accept/part1-targets.json` = tool `tools/accept/part1.cjs`; Bilang tugma) | ANS-3.5 items nakasulat na (user IDAGDAG 2026-11-25: 11 row sa Part 2: trip, malfunction, steady 60 min, real time, repeatability, instructor). Kulang: walang numero ang tolerance ng RH spray; kopya ng ANS-3.5 wala sa repo (±2 % / ±1 % ay basa ng team); 2 / 57 pasado |
| 3 | Arkitektura | Scan rate, ayos ng takbo, deterministic timing, DCS-TCS link, nakasulat at sinubok | BAHAGI | `tests/lanes/qa/architecture.cjs` (doc = code), `tests/gate/behaviour.cjs` (fixed 0.5 s, parehong numero 2x) | Nakasulat na sa `docs/ARCHITECTURE.md`. Kulang: scan period ng totoong DCS (wala sa repo, nasa PC: K1AU3-E2-0-001 / textbook); lumang `tcs.js` tumatakbo pa (mawawala group por group); TCS sheets sa sariling cycle TAPOS 2026-11-25 |
| 4 | Tag database | I/O list bilang iisang table, iisang source of truth | BAHAGI | `tests/lanes/qa/tag-db.cjs` (alarms, bind, tcs-dcs, field, loop list laban sa `src/data/ades.txt`), `tests/lanes/tcs-io/io.cjs` | Nakasulat na sa `docs/TAGS.md`. Kulang: 1 kilalang pagkakaiba (SI9990, kailangan ang loop list sa PC; 9 naayos 2026-11-25 8:40 PM); ang tag sa DITL / ABC sheets at HMI pages ay binibilang pa lang ng QA trace (walang kabit 145) |
| 5 | Block library | Bawat vendor block (ABC / DITL, HIACS TCE / TCA macro) isang beses ginawa at sinubok laban sa block manual | BAHAGI | `tests/tce/run.cjs` (TCS macros), `tests/lanes/qa/blocks.cjs` (bawat ABC block: 51 sheet, 1,671 block, 34 uri, laban sa legend ABC-000, 2026-11-25) | 54 TCS curve walang punto; PID / PIDV, MAN, A/M, AI, totalizer (1,858 block) at DITL gates ay browser test pa lang (`sim-tests.yml`, main lang) |
| 6 | Logic bilang data (netlist) | Bawat sheet = blocks + wires, kabit ayon sa tag sa lahat ng sheet | BAHAGI | `tests/tce/sheets.cjs`, `tests/lanes/qa/tce-complete.cjs` | TCS 368 / 419 tumatakbo; DCS link 1,787 / 2,613 |
| 7 | Validator | Kusang bilang at check (walang kabit na pin, hindi kilalang tag, NaN) sa bawat takbo | TAPOS | `tests/lanes/qa/trace-gate.cjs` (22 bilang laban sa `tools/trace/baseline.json`), `tests/lanes/qa/tce-complete.cjs` (floor 256), `tools/check/no-fit.cjs`, `tools/data/tce_check.mjs` | Tapos 2026-11-25 ("Go 7"). Ang mga bilang mismo (hal. 145 walang kabit) ay trabaho ng Phase 4 at 6 |
| 8 | Komunikasyon | Modbus at package PLC emulation | BAHAGI | `tests/lanes/tcs-io/io.cjs` (Modbus TCS 237 / 237) | Fly ash / ESP / CTCS address lang, walang value; walang PLC emulation |
| 9 | HMI | Generic faceplate bawat uri, mimic nakakabit sa tag | BAHAGI | `tests/lanes/hmi-turbine/pages-bound.cjs`, `tests/regress/hx_fp_mon.js`, `hx_unknown.js` | 1,045 / 1,067; approval ng user bawat page |
| 10 | Alarms at events | Priority, ack, shelving, SOE, historian, trends | BAHAGI | `tests/lanes/lane5/alarm-rows.cjs`, `alarm-live.cjs` | Walang shelving at historian; 222 / 371 |
| 11 | Plant model | Component library mula sa P&ID / datasheets, walang per-load tuning, pasado sa buong design curve | BAHAGI | `tools/check/no-fit.cjs` | Part 1 0 / 24 sa buong curve (huli sa order) |
| 12 | Scenario tests | Trip, interlock at permissive tests, automated | BAHAGI | behaviour gate; `sim-tests.yml` (main lang) | Hindi kumpleto ang trip / interlock ng IBD at DITL; `tests/scenarios/` wala sa CI |
| 13 | Instructor station | Freeze, snapshot / save, backtrack, speed, malfunctions, field actions | BAHAGI | behaviour gate (SAVE / LOAD) | Walang backtrack; Warm / Hot wala sa start screen; field actions kulang |
| 14 | V&V | Operator review laban sa plant / design data | HINDI PA | wala | Live run Cold hanggang 150 MW (ang user ang nagpapasya kung kailan) |
| 15 | Config management | Version bawat sheet at daan ng MOC update | BAHAGI | `tools/version-check.js` | Walang version bawat sheet; walang MOC na daan |

**Bilang: 1 TAPOS, 13 BAHAGI, 1 HINDI PA.**
