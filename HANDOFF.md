# HANDOFF — iisang file ng estado

Huling update: **2026-11-23 16:04 PHT** (LEADER : JENNIE, beta.328: cd_page_values sa HX pages at extraction_warming sa "At 150 MW" start; test lang, walang binago sa planta).

Patakaran: palitan ang luma, huwag magtambak ng kasaysayan. Ang kasaysayan ay nasa `docs/versions/v<ver>/UPDATE_REPORT.md` at sa git log. Kapag iba ang repo sa file na ito, ang repo ang tama; ayusin ang file na ito sa parehong PR.

## 1. Basahin sa ganitong ayos

1. `RULES.md` — ang iisang listahan ng rules ng user.
2. **Ang file na ito** — estado, team, bukas na gawain.
3. `docs/DCS_KNOWLEDGE.md` — kaalaman sa DCS ng planta (tag, mode, BU-CMD, mga dokumento).
4. `README.md` — mapa ng repo, build, version, release.
5. Tunay na estado: `git log --oneline -10 origin/main`, `delivery/app/app.json`, `src/version.txt`, `gh pr list`.

## 2. Estado (2026-11-22)

- App **LMYP OTS 1.0.0-beta.328**, simulator 3.2.5-beta.10. Huling EA release: 1.0.0-beta.1 (2026-11-19). Stable: wala pa.
- Merge: kusa kapag pasado ang Checks (auto-merge, user 2026-11-21 "Go auto"). Ang Checks (`.github/workflows/checks.yml`) ay may **behaviour gate** (`tests/gate/behaviour.cjs`): 20 plant min sa 150 MW sa fixed 0.5 s step, walang drift, parehong numero sa dalawang takbo, SAVE / LOAD, save point na binabasa ayon sa pangalan ng sheet.
- Version: Jennie = even na beta, Rosé = odd na beta. Bawat merge ay may `docs/versions/v<ver>/UPDATE_REPORT.md` at bagong `dist`.
- Simula: 150 MW at Cold sa start screen. HOT at WARM save points na ginawa sa tunay na pindot (turbine trip, bottle up) ay nasa `team-files/saves/` (PC lang).

## 3. Team

- **LEADER : JENNIE** — engine, plant model, logic, physics, TCS (TCE / TCA), build, CI, tools, tests, `src/digital`, `src/world`.
- **ROSÉ** — `src/ui/**`, `src/station/**`, `src/analog/ui/**`, `delivery/`, site.
- Isang clone bawat thread; huwag magpalit ng branch sa folder ng iba. Sa Windows: `git clone -c core.autocrlf=false`, kung hindi ay DIFFERENT ang `npm run check`.
- Mabigat na takbo: isa-isa, `team-files/TEST_LOCK`.

## 4. Bukas na gawain (Full Audit 3, bilang 2026-11-22)

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

Rosé, bahagi: #6, #8, #9, #14, #16, #20 (HMI, faceplate, text size, click, Engineer).

## 5. Saan ang mga bagay

- Plant docs: `document-references/INDEX.md` (ang mga dokumento ay nasa PC ng user at sa private repo na `Ronanski/icms-plant-documents`, hindi kailanman sa repo na ito).
- Frame ng app: `src/station/`; build ng page: `tools/station/build.js`; pangalan, version at site: `delivery/app/app.json`.
- Simulator: HX pages `src/ui/plant/hx/`; plant model `src/analog/engine/` (`unit.js`, `boiler.js`, `tcs.js`, `tcs-trip.js`); mundo ABC + DITL `src/world/world.js`; DITL `src/digital/`; 150 MW na simula `src/data/st150.txt` (gawa ng `tools/steady150/make.cjs`; gawin ulit kapag may bagong value ang model).
- Build at test: `npm run build`, `npm run check` (dapat SAME), `node tests/gate/behaviour.cjs <page> --mins 20`, `tests/regress/`.
- Workflows: `checks.yml` (bawat PR), `sim-tests.yml` (sa `main`), `site.yml` (kusa pagkatapos ng Checks), `release.yml` (GO ng user lang).
- Lumang rules, handoff, spec at live test findings: `docs/archive/rules-2026-11-22/`.

## 6. Paano i-update (bawat thread, sa katapusan ng gawain, sa parehong PR)

1. "Huling update": oras sa PHT, pangalan ng thread, isang pangungusap.
2. Seksyon 2: version ng app at simulator, release.
3. Seksyon 4: tanggalin ang tapos, idagdag ang bago.
4. Bagong utos ng user: sa `RULES.md`, hindi dito.
