# HANDOFF — iisang file ng estado

Huling update: **2026-11-25 02:05 PHT** (LEADER : YUA, lane 0, beta.450: field loader `src/world/field/<lane>.js`, row `{ stn, ai | di, tag, v(U, X), rel, src }`, value sa `AN.unit.fld` para sa HMI, isang source bawat tag).

Patakaran: palitan ang luma, huwag magtambak ng kasaysayan. Ang kasaysayan ay nasa `docs/versions/v<ver>/UPDATE_REPORT.md` at sa git log. Kapag iba ang repo sa file na ito, ang repo ang tama; ayusin ang file na ito sa parehong PR.

**UNANG BASAHIN (user 2026-11-24, permanente): walang per-load na ayos.** Walang per-load na table, interpolation o constant na ikinabit sa trend o snapshot ng planta sa physics. Physics mula sa first principles at design geometry; set point mula lang sa logic curve ng planta. Sinusukat sa buong FHI / HB curve. RULES.md 3.12, bantay sa Checks: `tools/check/no-fit.cjs`.

## 1. Basahin sa ganitong ayos

1. `RULES.md` — ang iisang listahan ng rules ng user.
2. **Ang file na ito** — estado, team, bukas na gawain.
3. `docs/DCS_KNOWLEDGE.md` — kaalaman sa DCS ng planta (tag, mode, BU-CMD, mga dokumento).
4. `README.md` — mapa ng repo, build, version, release.
5. Tunay na estado: `git log --oneline -10 origin/main`, `delivery/app/app.json`, `src/version.txt`, `gh pr list`.

## 2. Estado (2026-11-22)

- App **LMYP OTS 1.0.0-beta.450**, simulator 3.2.5-beta.10. Huling EA release: 1.0.0-beta.1 (2026-11-19). Stable: wala pa.
- Merge: kusa kapag pasado ang Checks (auto-merge, user 2026-11-21 "Go auto"). Ang Checks (`.github/workflows/checks.yml`) ay may **behaviour gate** (`tests/gate/behaviour.cjs`): 20 plant min sa 150 MW sa fixed 0.5 s step, walang drift, parehong numero sa dalawang takbo, SAVE / LOAD, save point na binabasa ayon sa pangalan ng sheet.
- Version: Jennie = even na beta, Rosé = odd na beta. Bawat merge ay may `docs/versions/v<ver>/UPDATE_REPORT.md` at bagong `dist`.
- Simula: 150 MW at Cold sa start screen. HOT at WARM save points na ginawa sa tunay na pindot (turbine trip, bottle up) ay nasa `team-files/saves/` (PC lang).

## 3. Team

- **LEADER : JENNIE** — engine, plant model, logic, physics, TCS (TCE / TCA), build, CI, tools, tests, `src/digital`, `src/world`.
- **ROSÉ** — `src/ui/**`, `src/station/**`, `src/analog/ui/**`, `delivery/`, site.
- Isang clone bawat thread; huwag magpalit ng branch sa folder ng iba. Sa Windows: `git clone -c core.autocrlf=false`, kung hindi ay DIFFERENT ang `npm run check`.
- Mabigat na takbo: isa-isa, `team-files/TEST_LOCK`.

## 4. Bukas na gawain

**Finish line: `docs/ACCEPTANCE.md`** (user GO LIST 2026-11-24 06:06 PHT). Ito lang ang saklaw ng "tapos". Bilang ngayon: 1 pasado, 45 natitira. Bawat merge na nagbabago ng estado ng item: i-update ang "Bilang" doon.
 (Full Audit 3, bilang 2026-11-22)

Tapos: #1 Android key (GitHub secret), #2 behaviour gate, #7 version at ulat bawat merge, #10 save point ayon sa pangalan ng sheet, #15, #17 orasan ng planta mula 0:00, #18 rules (ito).

Jennie, bahagi o bukas:
- #3 init sa mahabang takbo: bed naka-anchor sa TT-FG1090 (256). Bukas pa: 150 → 90 MW ramp at RH spray sa 75 MW (ulat 256 F2, F3).
- #4 TCE / TCA sheets bilang tumatakbong logic, kapalit ng `tcs.js`. Tapos: step 1 (netlist, 254), step 2 unang bahagi (block meanings, 258). Susunod: ang 9 na macro, ang FG points, step 3 I/O.
- #5 NO-SOURCE sa engine (251).
- #11 ayos ng code (modules, hatiin ang `unit.js`).
- #12 Warm / Hot sa start screen (mula sa trip sa 150 MW, physics).
- #13 116 na alarm tag na wala sa app, at alarm priority.
- #19 sootblower 80H ~ 80L.
- Part load (ulat 290, plant trend 90 MW, O2 trim naka-hold gaya sa plant): bed 959 laban sa 955 at exit gas 760 laban sa FHI 755 (tama). MST 543 laban sa 522: may spray pa rin 3.6 + 5.7 t/h (plant 2nd spray 0), RHT 539 laban sa 521 (F1). Hindi fouling ang sanhi (ulat 290). Start-up bed 35-90 °C mas mainit kaysa 280 (F2). Cold run ng user (F3). Jennie.
- Worker = page mirror: `$id` ng `AN_UNIT.asF` (ulat 276 F2, Rosé beta.277). Reset sa page = Reset sa Worker (ulat 288, ayos na).

AUDIT FIX : LISA (2026-11-24): #5 listahan `docs/audit/no-source-list.md` (217 bukas), #11 plano `docs/audit/unit-split-plan.md` (hintay ng window mula sa coordinator), #3 mungkahi `docs/audit/drift-test-proposal.md`. GO DESIGN (user 2026-11-24 00:35 PHT): design docs lang ang target ng model; snapshot at trend = pang-check lang. Listahan ng value na nakasandal sa snapshot: `docs/audit/snapshot-values-list.md`. #6: pinili ng user (2026-11-24 00:21 PHT) na gawing "Plant" menu ang Instructor button at alisin ang Freeze.

TCS IO : TSUBASA (lane 2, 2026-11-25): TCS I/O list `src/data/tcs-io.json` (gawa ng `tools/data/tcs_io.mjs`), dulo ng bawat channel `src/digital/tce-io.js`, DCS + Modbus binding `src/data/tcs-dcs.json`, test `tests/lanes/tcs-io/io.cjs`. Bukas: (a) i-load sa app ng engine owner (world.js, `AN.tceSteam` / `AN.tceCrp` sa api.js), (b) 175 channel na "needs" (walang model value pa: drain MOV, NRV, generator Mvar / current / pf, AVR, TSI setting, rotor position, diff expansion), (c) 38 kahon na maling basa ng reader ng lane 1 bilang PI/O (G sheet delay timer, TRIPLE DETECTOR, legend ng TCE022).

Rosé, bahagi: #6, #8, #9, #14, #16, #20 (HMI, faceplate, text size, click, Engineer).

## 5. Saan ang mga bagay

- Plant docs: `document-references/INDEX.md` (ang mga dokumento ay nasa PC ng user at sa private repo na `Ronanski/icms-plant-documents`, hindi kailanman sa repo na ito).
- Frame ng app: `src/station/`; build ng page: `tools/station/build.js`; pangalan, version at site: `delivery/app/app.json`.
- Simulator: HX pages `src/ui/plant/hx/`; plant model `src/analog/engine/` (`unit.js`, `boiler.js`, `tcs.js`, `tcs-trip.js`); mundo ABC + DITL `src/world/world.js`; DITL `src/digital/`; 150 MW na simula `src/data/st150.txt` (gawa ng `tools/steady150/make.cjs`; gawin ulit kapag may bagong value ang model).
- QA trace (bilang ng kabit, lane 8): `node tools/trace/trace.cjs [--start 150|cold] [--mins 10] [--tag <tag>]`; TCE / TCA kumpleto: `node tests/lanes/qa/tce-complete.cjs`.
- Build at test: `npm run build`, `npm run check` (dapat SAME), `node tests/gate/behaviour.cjs <page> --mins 20`, `tests/regress/`.
- Workflows: `checks.yml` (bawat PR), `sim-tests.yml` (sa `main`), `site.yml` (kusa pagkatapos ng Checks), `release.yml` (GO ng user lang).
- Lumang rules, handoff, spec at live test findings: `docs/archive/rules-2026-11-22/`.

## 6. Paano i-update (bawat thread, sa katapusan ng gawain, sa parehong PR)

1. "Huling update": oras sa PHT, pangalan ng thread, isang pangungusap.
2. Seksyon 2: version ng app at simulator, release.
3. Seksyon 4: tanggalin ang tapos, idagdag ang bago.
4. Bagong utos ng user: sa `RULES.md`, hindi dito.
