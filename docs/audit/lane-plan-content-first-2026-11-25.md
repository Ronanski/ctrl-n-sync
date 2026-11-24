# Lane plan: complete the logic, every link, then the HMI (2026-11-25 01:10 PHT)

User 2026-11-25 00:52 PHT: complete ALL logic first, link every address to every signal, then complete the HMI. No more plant model fixes while content is incomplete. Up to ten threads, double or triple the speed, same quality. Made by AUDIT FIX : SORA from the content inventory (scoreboard page, section "Kumpleto na ba ang laman ng app?", main dd75748, beta.374).

## 0. What changes now

- **Plant model work stops** (P1, kKL, fouling, bed inventory, st150 rebuilds, Rule 0 items 1-17). The derivations stay as docs for later. Exception: a link may read a plant model value **that already exists**. If a signal needs a model value that does not exist yet, the lane writes it on its "needs model" list and moves on. It never invents a value.
- **Order in every lane:** (1) logic present and running, (2) every address of that logic linked to its signal (sheet, I/O, memory, HMI), (3) HMI for that system bound to the same addresses. A lane starts (2) for a system only when (1) of that system is done, and (3) only when (2) is done. Different systems move at their own pace.
- Excluded from the HMI and from the link work (user): water treatment (WTP), coal handling, air compressors (and air dryers, part of compressed air). Demin water, coal, compressed air, sand and limestone are unlimited supply at the boundary.

## 1. Method from the old app (icms-master-tool): reuse it, do not rebuild it

The linking engine of the old app is **the same code that runs in this app**. `src/analog/engine/links.js` is byte-identical in both repos (650 lines). It holds ABC to ABC by numbered circle and signal tag, with stepSet / stepTier. `src/world/world.js` is the one ABC + DITL world. It reads the drawing references: DITL "28A-77", ABC "FROM DITL 26A-55" / "TO DITL 26A-05", bottom ash "BA01-11", limestone "SHEET 214 - LINE21". The HMI binds to the same nets through `AN.modeNetsBy` (tag to .MAN / .LOC / .REM nets, `src/analog/engine/ctrls.js`). So the 90 % that worked in the old app is here already. The 463 unlinked points are not a method failure. They fall in three kinds (docs/audit/unlinked-io-map-2026-11-24.md):
1. **Missing unit instances** (182 have a linked twin): the A sheet is in the app, the B / C / D copy is not. Reuse the sootblower clone pattern (`world.js` sbMap: one sheet, an address map per unit, from the I/O list `WIRING` rows). Do not hand-copy sheets.
2. **Field signals with no model value yet** (205 ENGINE + UI): the link is the I/O address to an existing model variable. Where none exists, the point goes on the "needs model" list.
3. **Panel and system points** (53 UI): lamps, push buttons, annunciator, DCS diagnostics. Bind them on the page by address.

Rules for every lane: one logic (the sheets), one link path (links.js / world.js reference parsers, extended for a new reference format, never a second linker), one HMI binding (by tag and address through the engine, never HMI-only state), no scripted sequences, native live sheets. TCE / TCA win over IBD where they overlap: trips from the IBD, speed / load / ATS / thermal stress from TCE / TCA only (RULES 3.8).

## 2. Prep PR 0 (YUA, first, about 1 hour): split the shared files so lanes do not queue

Today these files are shared by many lanes: `src/world/world.js`, `src/analog/engine/links.js`, `unit.js`, `tcs.js`, `src/ui/plant/wiring.js`, `src/ui/plant/hx/hx-pages.js`, `src/data/pre.txt`, `.github/workflows/checks.yml`, `delivery/app/app.json`. PR 0 makes them read lane-owned files, so a lane never edits them:
1. `src/world/bind/` folder: one JSON per lane (`<lane>.json`: rows `{stn, addr, tag, to, src}`, where `src` is the drawing or list row). world.js loads every file in the folder at start-up. These rows are extra references for the same linker: no new link code.
2. `src/world/inst/` folder: one JSON per unit-instance set (`{sheet, units, addrMap}`). This is the sootblower clone made generic from data.
3. `src/ui/plant/hx/`: pages register themselves (`hx-pages.js` globs `hx-page-*.js`), so a new page is a new file only.
4. `tests/lanes/<lane>/*.cjs`: checks.yml runs every file in the folder, so a lane adds its tests without editing CI.
5. Alarms: `src/data/alarms/<group>.json` loaded by `alarm-pri.js` (one file per alarm group).
6. Version: each lane PR raises only the version line of `delivery/app/app.json` and writes its own `docs/versions/v<ver>/UPDATE_REPORT.md`. Beta numbers end in the lane digit (lane 0 ends in 0, lane 1 in 1, ...), so two lanes never take the same number. On a conflict in app.json, the lane merges main and takes the next number with its own digit.

**Integrator: LEADER : YUA.** YUA alone writes world.js, links.js, unit.js, tcs.js, the engine core, the build, checks.yml and st150. A lane that needs one of these changed sends YUA the exact change (through the coordinator, or message_thread). YUA lands it in her next PR within the hour. The lane carries on with work that does not depend on it.

## 3. The lanes

| # | Lane (thread) | Scope | Owns (writes) | Reads only | PC documents needed | Done-check |
|---|---|---|---|---|---|---|
| 0 | **YUA : INTEGRATOR** (PC) | PR 0; lands the shared-file changes asked by lanes; TCS swap step 5 in tcs.js; the "needs model" list kept, not worked | world.js, links.js, src/analog/engine/** (except files given below), tcs*.js, tools/build/**, tools/steady150/**, .github/**, st150 / sthot / stwarm | all | PC fetch sitting 1 (list below), shared with EIMI | checks.yml green; each lane change lands within 1 h |
| 1 | **TCS LOGIC : MARIA** (cloud) | TCE / TCA 407 sheets running as the logic: block meanings and macros (TCS plan step 2), shadow run (step 4) per controller COM, then EHG, then TPC; G-1A to G-9 14 sheets the same | src/digital/tce-run.js, src/digital/tce/** (data fixes from the PDF), tools/data/tce_*.mjs, tests/tce/** | tcs.js, tcs-ibd-data.js | TCA / TCE SOFT LOGIC DIAGRAM OF TCS.pdf (pages TCA013 to 020 macro list, unclear sheets); TC-14-116 manual | shadow run: the 281 live reads agree at 150 MW, Cold, a turbine trip and ATS from S68; 0 differences unexplained |
| 2 | **TCS IO : TSUBASA** (cloud) | TCS I/O list into the app (EHG / TPC / COM), the 10 TCE9xx PI/O tables bound to the plant (plan step 3), TCS Modbus to DCS (21 missing), the 35 TCS points in the DCS I/O list, generator panel AI / AO | src/data/tcs-io.json (new), src/digital/tce-io.js (new), src/world/bind/tcs.json | tce-run.js, tcs.js, ades.txt | iolist-tcs.zip (XSMM_IO_List_R1), turbine Modbus list (230 + 28), GAE-2013-0136 | every TCS I/O row has a sheet pin and a model or HMI end; Modbus 258 of 258; 35 of 35 linked |
| 3 | **DCS LINKS BOILER : KIRARA** (cloud) | Unlinked I/O of furnace dampers (68), start-up burners B / C / D (58), coal feeders and silo valves (29), flue gas / seal pots (10), bottom ash coolers (14 + 6), sootblower steam (2), fly ash PLC (4), CEMS (1); the 14 B / C / D unit instances (annunciator windows) | src/world/bind/boiler.json, src/world/inst/boiler-*.json | world.js, ades.txt, pre.txt, apre.txt | M&S BMS 1612 13-4-105 (burners); bottomash zip; DITL index for B / C / D sheets | QA trace: every point of the lane list linked and moving in a fast-forward run; "needs model" list written |
| 4 | **DCS LINKS BOP : RARA** (cloud) | Unlinked I/O of feedwater / BFWP (32), condensate and spray valves (23), heater drains (10), main steam valves (7), lube oil (7), pumps (35), blowdown (3), aux / gland (2), cold reheat drain (2), sea water (6), cooling water (3), make-up (2), dosing pumps (7), chemical tanks (6), industrial water (2). Excluded with the air compressors: air compressors (5), air dryers (13), compressor motor temperatures (9) | src/world/bind/bop.json, src/world/inst/bop-*.json | as lane 3 | P&ID K1AU3-A1-0-001 pages per system; motor DITL of the twin | as lane 3 |
| 5 | **ALARMS AND CURVES : AKIHO** (cloud) | 116 missing alarms with priority; 129 F(X) patterns not wired; subsystem sheet gaps (BA-30 / 31 / 32 / 35 / 57 / 58 / 70, DITL-80H / I / J / L, sand 770): import if they exist on the drawing, else record "not on drawing"; SCADA Modbus (up to 172) | src/data/alarms/**, src/analog/engine/alarm-pri.js (given from lane 0), src/data/aln.json, src/ui/fx/** (given from EIMI), tools/data/ditl_import.js, ls_import.js, sand_*.py (import only, appends to pre.txt through the import tool) | pre.txt layout, world.js | alarm list 20160912; linear-curves-fx.xls; the subsystem zip indexes; Subsystem PLC IO lists | alarms 717 of 717 with priority, 0 standing at steady 150 MW; every named PTN either wired or "not used on any sheet" with proof |
| 6 | **EIMI : HMI BOILER** (PC) | Pages and faceplates of the boiler side: overview, combustion air, furnace gas, oil burners, purge / trip, coal (feeders only), boiler steam, reheat, ash, sootblowers, limestone / sand (to the boiler only), annunciator panel (100 windows) | src/ui/hmi/**, src/station/**, src/analog/ui/**, src/ui/plant/hx/hx-page-{overview,combustion-air,furnace-gas,oil-burners,purge-trip,coal,boiler-steam,reheat,ash,sootblowers,limestone-sand}.js, hx-core / hx-cards*.js | engine, bind files | DCS graphic design K1AU3-E2 (equipment per page); P&ID pages of these systems | every P&ID equipment of the system on its page; every control element bound by tag / address; click test headless; your approval per page |
| 7 | **HMI TURBINE : MINAMI** (cloud) | Pages of feedwater, condensate, extraction, aux steam, make-up / cooling, sea water, sampling, turbine, turbine oil, generator; electrical one-line if on the drawings | src/ui/plant/hx/hx-page-{feedwater,condensate,extraction,aux-steam,makeup-cooling,sea-water,sampling,turbine,turbine-oil,generator}.js and new hx-page-*.js of these systems | hx-core.js (EIMI owns; asks her for changes) | P&ID pages; TCS HMI lists (iolist-tcs.zip) | as lane 6 |
| 8 | **QA : SAORI** (cloud) | The runtime trace tool and the lane done-checks: per address (station-aware) is it on a sheet, driven, read, on a page, moving, in a fast-forward run (headless, st150, Cold, x10); reviews each lane PR's evidence (the builder does not test its own work) | tools/trace/** (new), tests/lanes/qa/** | everything | none | the trace runs in under 5 min headless and prints one row per I/O, memory and alarm address; numbers feed the scoreboard |
| 9 | **SORA : DOCS AND SCOREBOARD** (cloud) | The source register per lane (drawing, list and row for every item before the lane starts, so no lane reads a document twice); the PC fetch list; ACCEPTANCE Bilang; scoreboard and tracker numbers from the QA trace after each merge | docs/audit/**, docs/ACCEPTANCE.md (Bilang), docs/lanes/** (new) | everything | none (writes the fetch list) | register ready for lanes 3, 4, 5 before they start their second hour |

The compressed-air page (`hx-page-compressed-air.js`) is excluded by the user. It stays as it is: no new work.

## 4. PC fetch sitting (one sitting, YUA or EIMI, at the start)

Plant documents never go into the public repo. The PC thread extracts the data the lane needs (rows, not the document) into the lane's own data file, or into the private repo Ronanski/icms-plant-documents, and names the source and page next to every row.
1. TCS: iolist-tcs.zip (XSMM_IO_List_R1, EHG / TPC / COM); the TCA / TCE PDF page list (which pages are logic, which are legend); the turbine Modbus list. Lanes 1 and 2.
2. Alarm list 20160912 (116 missing rows, with priority) and the alarm list CSV of the live test. Lane 5.
3. linear-curves-fx.xls (the 220 named patterns, which sheet each one is on). Lane 5.
4. Index of sand-sootblower-logic.zip and bottomash-limestone-logic.zip (does BA-30 / 31 / 32 / 35 / 57 / 58 / 70, DITL-80H / I / J / L, sand 770 exist?). Lane 5.
5. M&S BMS 1612 13-4-105 burner pages; DITL sheets for burner / feeder B / C / D if they exist. Lane 3.
6. DCS graphic design K1AU3-E2 (equipment per screen) and the equipment list K1AU3-L1-0-002 (173). Lanes 6, 7, 9.
7. Subsystem PLC IO lists (SCADA 371, fly ash, ESP, CEMS). Lane 5.

## 5. Timeline

- Hour 0 to 1: PR 0 (YUA); PC sitting; QA trace tool first version; SORA source register for lanes 3 to 5. Lanes 1, 2, 6 start at once (their files are not shared).
- Hour 1 onward: lanes 3, 4, 5, 7 start on PR 0. Every lane merges small PRs (one system or one sheet group each) when Checks pass. The scoreboard updates from the QA trace after each merge.
- Content complete = QA trace: 0 unlinked I/O (except the excluded systems, listed), 717 of 717 alarms, 407 + 14 TCS sheets running, TCS I/O complete, every page approved by you. Only then does the plant model work restart (P1 order of docs/audit/rule0-fit-list-2026-11-24.md).
