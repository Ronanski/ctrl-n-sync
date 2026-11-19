# HANDOFF — iisang file ng estado (para sa kahit sinong Claude o account)

Huling update: **2026-11-19 PHT** (ROSÉ: bagong repo na `Ronanski/ctrl-n-sync`, app na LMYP OTS, unang EA 1.0.0-beta.1).

Patakaran: palitan ang luma, huwag magtambak ng kasaysayan. Ang kasaysayan bago ang 2026-11-19 ay nasa lumang repo na `Ronanski/icms-master-tool` (reference lang, hindi na ginagalaw) at sa git log nito.

## 1. Basahin sa ganitong ayos
1. `CLAUDE.md` — ang COMMANDMENTS (iisang rules), sino ka, at ang 10 DCS kaalaman na hindi nagbabago.
2. **Ang file na ito** — estado, bukas na PR, bukas na findings, susunod.
3. `PROJECT_RULES.md` — source of truth, Beta (EA) / Stable (Final), version, lean test policy.
4. `docs/SPEC.md` — ang gusto ng user (S1 ~ S9).
5. `README.md` — mapa ng repo, build, version, release.
6. Tunay na estado: `git log --oneline -10 origin/main`, `delivery/app/app.json` (version ng app), `src/version.txt` (version ng simulator), bukas na PR. Kapag iba ang repo sa file na ito, ang repo ang tama; ayusin ang file na ito.

## 2. Kasalukuyang estado (2026-11-19 PHT)
- **BAGONG REPO AT BAGONG APP (user 2026-11-19: "Dito mo lalagay ang repo", "dito na lilipat buong team pero pwede pa rin reference ang old repo and local working folder"):** ang buong team ay dito na nagtatrabaho. Ang lumang repo at ang lumang local folder (`projects/icms-master-tool`) ay reference lang: huwag burahin, huwag nang i-merge doon.
- **Ang app: LMYP OTS** (pangalan at icon na pinili ng user 2026-11-19: NOT gate + `_SYNC`, itim at puti na may kaunting asul). Ito ay ang station frame (`src/station`) sa ibabaw ng simulator (ABC + DITL + TCS, engine, plant model, HX pages). Ang lumang shell ay nasa loob pa ng html pero nakatago; ang frame ay pumipindot ng sariling kontrol ng app, walang sariling logic.
- **Limang rule ng user sa disenyo ng app (2026-11-18):** faceplate, permissive at alarm list ay mini popups; minimalist ang logic sheets; ang sidebar ay makitid at naitatago; tanging ang relevant na pindutan at setting; hindi nakasandal sa itsura ng lumang app.
- **Dalawang version (tingnan ang `README.md`, "Versions"):** app = `delivery/app/app.json` (`1.0.0-beta.N` = EA, `1.0.0` = Final); simulator = `src/version.txt` (ito ang binabasa ng save point). Bawat pagbabagong papasok sa `main` ay nagtataas ng version ng app; ang version ng simulator ay tumataas lang kapag binago ang `src/` ng simulator.
- **Nailabas:** EA `v1.0.0-beta.1` (2026-11-19, user "go ea"): `LMYP-OTS-1.0.0-beta.1-Windows.exe`, `.apk`, `.html` sa Releases. Laman ng simulator: 3.2.4-beta.70 ng lumang repo + HX overview page.
- **Repo ay PRIVATE (2026-11-19):** ang `site.yml` ay hindi tumatakbo habang private (walang GitHub Pages sa libreng plano), kaya wala pang site at wala pang auto update. Kusa itong aandar kapag ginawang public ng user; desisyon niya iyon.
- **Sa `main` (2026-11-19 8 AM PHT):** app 1.0.0-beta.7, simulator 3.2.5-beta.8 (mga ayos ng live test ni JENNIE, kasama ang 3.2.4 Stable ng lumang repo), at ang Linis 1 ng repo. Bukas na PR: tingnan sa GitHub (`gh pr list`).
- **Merge:** sa PC na ito, hinaharang ng auto mode ang merge hangga't walang nakasulat na pahintulot ng user sa mismong thread (hal. "GO MERGE EVERYTHING", 2026-11-19). Huwag itong lusutan; hingin ang pahintulot.

## 3. Team (2026-11-19)
- **JENNIE** (lead): engine, logic, plant model, HX pages, at ang live test sa bagong app (pinapanood ng user). **ROSÉ**: frame ng app (`src/station`), `delivery/`, site, release, linis ng repo.
- **Isang clone bawat thread.** Ang `projects/ctrl-n-sync` ay ang folder ng lead; ang ibang thread ay may sariling clone sa `projects/ctrl-n-sync-clones/<pangalan>`. Huwag magpalit ng branch sa folder ng iba. Sa Windows, i-clone gamit ang `-c core.autocrlf=false`; kung hindi, sasabihin ng `node tools/build/build.js --check` na DIFFERENT.
- Mabigat na takbo (headless browser): isa-isa, gamit ang `projects/icms-master-tool/team-files/TEST_LOCK`.

## 4. Bukas na findings (dala mula sa lumang repo, 2026-11-10 ~ 11-18)
- (CHAEWON 2026-11-11 11 PM) Training automatic run mula sa save sa step 49 (beta.90): pumapasa na ang step 57 (3 sa 3), pero drum LOW-LOW MFT pa rin sa steps 68 ~ 81 sa 4 sa 6 run (level swing +107 / -150 mm habang isinasara ang blow-off at binubuksan ang HP bypass). Diesel tank T-0701: area 23.8 m2 NO-SOURCE (EQ list p29 300 m3 = hanggang 40 m2), walang refill sa model, walang alarm / event ng tank LL at ng diesel pump stop. `tools/training/guide_fullrun.js` hindi lumalampas sa step 40 (PA damper ▲, kamay ng trainee).
- Ang orasan ng Cold at 150 MW ay nagsisimula sa oras ng pag-load ng estado (11:29, 10:37), hindi sa 0:00. (Sarado na ang re-shell: Stable 3.2.1 ay inilabas 2026-11-10 mula sa beta.281; mula 11-15, si Jennie lang ang nagla-live test.)
- Plant: MST sa load up (beta.30: hugis tugma na sa plant trend, peak 547 sa dulo ng ramp, planta 548); hotwell -300 sa feedwater surge; RHT 512.7 sa 90 MW; Instructor turbine trip sa t = 0 (engine, naka-hold); Single Line Diagram wala sa PC.
- Detalye: `docs/handoff/HANDOVER_2026-11-10.md` seksyon 4; ebidensya `team-files/findings-2026-11-09-reshell.md` (PC lang).

## 5. Kulang pa
- Ng bagong app: "Update now" mula sa tunay na site, palit ng Stable / Beta channel, pag-install ng apk sa tablet at pagbukas ng exe (unang subok ay ng user); pindot ng Start / Stop sa faceplate, Turbine trip at Load ng save point sa frame (para sa live test); pagmamarka ng kulang na kondisyon sa Conditions popup (mula sa logic, hindi pa gawa).
- Linis 2 ng repo: mga tool at test na hindi na gamit, at ang lumang shell sa `src/ui` kapag napatunayang hindi na kailangan ng frame.
- History ng public repo: nilinis 2026-11-07 (bagong commit IDs). Ang lumang PR refs (`refs/pull/*`) ay hawak pa ng GitHub at may plant documents pa; GitHub Support lang ang makakapag-alis. Lumang Windows / apk links ay hindi apektado; ang lokal na lumang history ay nasa `refs/backup/2026-11-07/*`.
- Ikabit sa model ang drum 32 t (DATA_ANSWERS item 7); ikumpara sa app ang BFP motor, generator at compressor data (`document-references/INDEX.md`).
- Live loop check at function test ng natitirang equipment (`docs/versions/v3.2.1/MOTOR_LOOP_CHECK.md` pagkatapos ng CW; lahat ng MOV / control valve at analog instrument gamit ang split view); page 07 test; debris filters, hypochlorite, manual valves.
- Gaps: ID fan cold start; Sampling page: silica, make-up conductivity at tank levels NO-SOURCE pa (SOHEE beta.113); per-signal ABC / DITL tracing; AI range / alarm / IO checks; DITL 9 sa 31 hindi pa na-verify.
- Plant model: transmitter root valves; ESP; header pressure drop ng sootblower sa flow (PCV-SB1053 Cv NO-SOURCE). Ang LP heater isolation / bypass ay nasa `anHtrPath` na (DITL-69 / 70 / 71). Hatian 2026-11-12 (SOHEE): SOHEE = sampling / dosing (tapos), pneumatic dampers sa instrument air loss, motor temperature mula sa closed cooling; JENNIE = fuel, ESP, ID fan; CHAEWON = boiler / Training.
- Cold commissioning at ISANG integrated Cold → 150 MW start, saka shutdown / trip.
- Full HMI art (pagkatapos ng lahat ng loop check; mockup muna). DCS library (goal 3). Stable v3.2.1 (GO STABLE lang).

## 6. Mga utos ng user na umiiral (bukod sa COMMANDMENTS)
- **Bagong app, magdamag na utos (2026-11-19 2:49 AM PHT):** tuloy-tuloy ang trabaho nang hindi siya ginigising; paggising: gumaganang bagong app at napapanood na live testing; tunay na pindot ng operator; walang patch, walang pansamantalang code o ayos; iisang plant model at physics; organized at malinis; walang daya; walang code na pumapalit sa kontrol, pindot o scenario.
- **Live test (2026-11-19):** sa bagong app na LMYP OTS ginagawa, live, at napapanood ng user.
- **Shell lang ang frame (2026-11-18):** ang trabaho sa `src/station` ay hindi gumagalaw ng engine, logic, plant model o drawing ng HX page.
- **PLANT RUN GATE (2026-11-13, user "Hnd n ata matapos ito", leader rule):** bago mag-merge ang KAHIT ANONG Beta PR, patakbuhin sa Worker mode: `npm run build; node tests/plant_runs/gate.cjs cold,hot,warm,shutdown` (Cold → 150 MW, Hot → 90 MW, Warm → 90 MW, Normal shutdown; walang MFT maliban sa sariling MFT ng shutdown sa 30 MW). Ilagay ang 4 na PASS line sa PR body; huwag i-arm ang auto-merge hangga't hindi lahat PASS. Isang mabigat na run lang sa PC (CPU ≤ 85 %).
- **Plano (#84):** Design → DCS → HMI + plant model → loop check bawat system (SOP order, CW muna) → cold commissioning → isang beses na integrated Cold start.
- **Plant model (11-04):** "Gawin nio lng ng gawin, basta tama connection, flow, at plant model, at dapat may communication sya sa logic na ABC DITL." Bawat system: ang model ay nagbibigay ng AI / DI sa ABC / DITL, at ang output ng logic ang nagpapagalaw sa model. Saklaw (#91): main plant (SG + TG), cross-system links (`docs/versions/v3.2.1/CROSS_SYSTEM_LINKS.md`), kapaki-pakinabang na manual isolation valves lang.
- **Loop check standard (11-04, 11-05):** LOOP CHECK = signal path lang (breaker TEST): REMOTE / LOCAL DI, START / STOP DO, RUN / STOP feedback DI, TRIP DI + alarm, current AI; kasama ang analog. FUNCTION TEST = logic: block sa LOCAL / TRIP, MAN start / stop, AUTO standby, auto cut-in sa trip, LOCAL start / stop + E-STOP sa FIELD buttons. Gumagana kahit shutdown. ISANG buong ulat, iisang sagot.
- **12 CHECK bawat hakbang ng live test (10-31):** (1) HMI page at popup na faceplate; (2) UI ng frame: listahan ng page, top bar, Instructor (JENNIE 2026-11-19: dati "Training at dock", na sa lumang app); (3) header at alarm laban sa alarm list; (4) logic at permissive: bawat control ay itinutugma sa address sa logic at I/O / memory list; (5) HMI kumpleto laban sa snapshot at IO list; (6) iisang value sa top bar, HMI, faceplate at logic; (7) HMI UI buo at nababasa; (8) faceplate / pop-out kumpleto; (9) buong app UI; (10) status bar version at build; (11) events; (12) SOP at lumang findings. Tala: PASA / BAGSAK / BAHAGYA / HINDI NAGAWA. Basahin ang logic pagkalipas ng ≥ 30 s bago tawaging bug. Pindot gaya ng operator; walang FORCE at walang shortcut.
- **App UI:** text ng app English lang; paglalarawan ang pangunahing label, ang tag ay maliit na reference. Malinis, organized, malinaw. Huwag tanggalin ang control na gamit ng user nang walang kapalit. Thread names: `NAME : ROLE`, ALL CAPS, babaeng pangalan, hindi inuulit (nagamit na: LISA, MINA, WINTER, YUNA, NINGNING, ROSÉ, KARINA, GISELLE, LIA, JISOO, IRENE, HAEWON, YERI, SANA, JENNIE, SEULGI, WENDY, TZUYU).
- **Live run (user 2026-11-13 ~ 11-17; JENNIE 2026-11-19):** nakikitang pindot lang, ang JS ay pambasa lang; ang mga loop ay AUTO / REMOTE ayon sa logic, manual lang kapag may nakasulat na dahilan; walang hakbang mula sa Training guide: ang pasya ay mula sa P&ID, logic at physics; SAVE bago ang bawat malaking hakbang, at pagkatapos ng ayos sa model ay LOAD ng save point bago ang trip (walang buong ulit ng Cold); i-pause ang planta bago magbasa ng code; physics, hindi fit sa kurba; isulat ang NO-SOURCE kapag walang pinagmulan.
- **Training:** Cold → 150 MW lang. Walang coach, walang FORCE, FIELD lang para sa digital field item, process values galing sa plant model. Per-loop, Warm at Hot ay tinanggal (beta.39); huwag ibalik nang walang utos.
- **Plant at logic:** ang drawing ang batayan; utilities (seawater, ACW, air, make-up, DO pump) ay hindi laging handa (sinisimulan, may trip). ABC design base (100 %): MSF 460, coal 81, 4450 kcal/kg, total air 606, PA 380, SA 200, FA 26 T/H. Golden reference ng start-up: https://claude.ai/artifact/D2EXiHjLsiJf12RBPniT39 (Cold start ayon sa FHI Fig. 2: coal PAGKATAPOS ng sync; sa hot restart ay maaaring mauna ang coal: bed > 700 °C, DITL-03F; JENNIE 2026-11-19, live hot start). Ang hindi karaniwan sa SOP / logic / curves ay "UNUSUAL"; ang user ang magpapasya.

## 7. Saan ang mga bagay
- References: `document-references/INDEX.md` (laman ng bawat file at zip, at ang PC-only folders; ang mga dokumento mismo ay nasa PC ng user at sa private repo na Ronanski/icms-plant-documents, hindi kailanman sa repo na ito). P&ID = `flow-diagram-K1AU3-A1-0-001.zip` (RB kung mayroon, kung wala RA).
- Rules: `CLAUDE.md` (COMMANDMENTS), kopya para sa hook `docs/handoff/COMMANDMENTS.md`; `PROJECT_RULES.md`.
- Ang app: frame `src/station/` (`station.js`, `station.css`, `station-frame.css`); build ng page `tools/station/build.js`; icon `delivery/app/icon.svg` → `node tools/station/icons.js <playwright> <chrome>`; pangalan, version, id at site `delivery/app/app.json`.
- Simulator: HX pages `src/ui/plant/hx/` (`README.md` muna); plant model `src/analog/engine/` (`plant.js`, `unit.js`, `boiler.js`, `tcs.js`); switch list `src/world/plantsw.js`; mundo ABC + DITL `src/world/world.js`; DITL `src/digital/`.
- HMI docs: `docs/hmi/`. TCS: `docs/tcs/`. ABC audit: `docs/abc-audit/`. Lumang live test ng Training: `docs/handoff/LIVE_TEST_FINDINGS.md`.
- Build at test: `npm run build` (iisang html sa `dist/`, huwag i-edit), `npm run check`, `node tools/station/build.js dist/logic-sim-v<ver>.html out` (page ng app sa `out/`, hindi kino-commit), `tests/regress/` (README sa loob).
- Workflows: `.github/workflows/` (`checks.yml` bawat push; `sim-tests.yml` sa `main`; `site.yml` kusa pagkatapos ng Checks kapag public ang repo; `release.yml` = sa GO ng user lang).
- Ulat ng bawat Beta mula ngayon: `docs/versions/v<version ng app>/UPDATE_REPORT.md`. Ang mga ulat hanggang 3.2.4, ang mga turnover, ang archive at ang Plant Tools ay nasa lumang repo.

## 8. Paano i-update ang file na ito (bawat thread, sa katapusan ng gawain)
1. "Huling update": oras sa PHT, pangalan ng thread, isang pangungusap.
2. Seksyon 2: version ng app at ng simulator, huling release, bukas na PR.
3. Seksyon 3 ~ 5: kalagayan ng thread, bukas na findings, kulang. Tanggalin ang naayos na.
4. Seksyon 6: bagong utos ng user, may petsa; tanggalin ang napalitan. Kapag rule ito, sa COMMANDMENTS ng `CLAUDE.md` at sa `docs/handoff/COMMANDMENTS.md` din.
5. Isama sa parehong PR ng gawain.

## 9. Release (LANG sa GO ng user sa mismong mensahe)
- **EA (Beta):** version ng app na `X.Y.Z-beta.N` sa `main`; `release.yml` (manual): `go` = `GO v<version>` eksakto, `dry_run` = `true` muna, saka `false`. Lalabas bilang pre-release na "(EA)" na may exe, apk at html.
- **Final (Stable), sa "GO STABLE" lang:** sa working branch: `delivery/app/app.json` version = `X.Y.Z` (walang `-beta`); kung binago ang simulator, `src/version.txt` din; `npm run build`, `npm run check`, mabigat na test isang beses (PROJECT_RULES 5.3), `docs/versions/vX.Y.Z/UPDATE_REPORT.md`. PR → merge → berdeng Checks → `release.yml` gaya ng sa itaas. Kusang lilipat ang Stable page ng site sa bagong tag kapag public ang repo.
- Sabihin sa user ang panganib bago ang GO: ano ang hindi pa live-tested. I-update ang seksyon 2.
