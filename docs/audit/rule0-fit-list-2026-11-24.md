# Rule 0: the 44 legacy fitted lines, what replaces each (2026-11-24, main 9834ee0)

Made by AUDIT FIX : LISA (user "Yung 44", 2026-11-25 00:10 PHT). Docs and desk only: no engine or UI change. The engine work stays with LEADER : JENNIE (src/analog/engine), the screen with HMI : ROSÉ. Source list: `tools/check/no-fit-baseline.json` (RULES.md 3.12, guard `tools/check/no-fit.cjs`: 44 old, 0 new). Line numbers are main 9834ee0.

## What the 44 really are

The guard flags words ("plant trend", "snapshot ratio", "calibrated on") and `MW / 150`. Read one by one, the 44 lines are four kinds:

| Kind | Lines | What to do |
|---|---|---|
| A. A value still fitted to a plant trend or an HMI snapshot (or with no source) | 21 | Replace with the design source or a physics calculation (items 1 ~ 4, 6 ~ 8, 10 ~ 17) |
| B. Physics keyed on the load (`MW / 150`) | 4 | Key it on the physical cause (flow, pressure, heat) from the design (items 8, 9) |
| C. Dead: the fitted law is no longer used by the physics | 4 | Delete the constant and its comment (item 5) |
| D. History note or a false hit: the fit was already removed, or the line says "no fit" | 15 | No physics change: tag the line `NO-FIT-OK: <why>` (item 18) |

So 29 lines need real work (17 items), 15 need only a tag.

## Ranked list (impact first: bed and solids, then fouling)

Each item: what it is · where · what it was fitted to · design source that replaces it · physics note ready for the code comment · PC page needed (if any).

### 1. Solids carried up the furnace at part load, kKL 9.2 (D3 / D27) · HIGHEST
- **Where:** `src/analog/engine/unit.js:2281`, `:2296` (`AN_BB.kKL`, line 2297).
- **Fitted to:** the plant DCS trend scenario 1 at 90 MW (coal 55.4 T/H, PA 318 + SA 187 T/H, bed 955 C).
- **Design source:** FHI P2S7 at 60 % MCR, the same calculation as in the code: air 371 T/H (Fig 12), coal 56.0 T/H (Fig 13), furnace average 755 C (Fig 8), bed 860 C (SU:10198 band, design anchor tbA). This gives **kKL = 3.80** (Jennie's CALC, beta.350 note).
- **Physics note:** `kKL = c H / U0` (Kunii & Levenspiel, freeboard decay a = c / U). H = 36.13 m (grate FL +6,400 to the panel top FL 42,527, K1AU3C-201), U0 = 5.4 m/s at MCR (flue gas 188 kg/s, 0.29 kg/m3 at 937 C, grate 119 m2, T2). kKL 3.80 means c = 3.80 x 5.4 / 36.13 = **0.57 s^-1**, inside the K&L range 0.5 ~ 10 s^-1 for sand d50 0.15 ~ 0.30 mm (Tab 3). So the design value is physically sound. DESIGN-SRC: FHI P2S7 Fig 7 / 8 / 12 / 13 at 60 % MCR.
- **Why it was held:** with 3.8 the 150 MW pressure loop swung into drum level HH (study 15). That swing is a separate fault: the fast answer of the steam to the coal must then come from the physics that is missing, not from kKL. Candidates to check, in this order: (a) the heat stored in the bed and the lower refractory (AN_BB uaBR / uaRW, FHI masses), (b) the drum and riser storage (Cw, T8 Tab 2), (c) the coal held in the bed (AN_CBED tau 60 s, NO-SOURCE). The PIC-COBM and drum level gains are logic and stay.
- **PC page:** none for kKL itself. For (c): coal burnout or char data of the FHI combustion design, if any.

### 2. Bed inventory at 150 MW: 1465 mmH2O = 174.3 t (D29) · HIGH
- **Where:** `unit.js:2458` (the bed inventory anchor) and `unit.js:540` (the start values of the two transmitters 1462 / 1468, and their 6 mmH2O split).
- **Fitted to:** the plant trend scenario 1 (overall furnace DP 1440 ~ 1490) and the snapshot DPIFG1081 / 1082 1426 / 1432.
- **Design source:** FHI P2S7 Fig 9, normal overall furnace DP 1630 mmH2O at 100 % (low limit 1450, high 2100). The controller set point is already 1630 (hmi-op.js line 330, beta.348), so the plant model and its own controller disagree today.
- **Physics note:** the DP is the weight of the bed on the grate: 1 mmH2O = 1 kg/m2; grate 15.51 x 7.68 = 119.1 m2 (T2): **1630 mmH2O = 194.2 t**. Both transmitters read the same DP: no split (the 6 mmH2O was a snapshot reading, no source). DESIGN-SRC: FHI P2S7 Fig 9.
- **Knock-on:** the lime lag tau in boiler.js line 1130 uses "about 100 t" (P2S8 Tab 9); keep the two consistent (one is the bed charge, one the running inventory: say which in the comment).
- **PC page:** none.

### 3. Fouling of the backpass banks: tau 56 h, every start clean, one deposit for all banks (D30) · HIGH
- **Where:** `src/analog/engine/hx.js:177`, `:191` (`AN_FOUL.tau`).
- **Fitted to:** the plant trend scenario 1 trend B (the creep of the 2nd SH spray, -0.83 %/h).
- **Design source:** (a) the design fouled state: FHI P2S7 Tab 3 is a fouled boiler (APH gas in 322 C); rInf 0.0042 m2K/W is already CALC from it (keep). (b) the cleaning: FHI P3S3 and P5S2 sootblowing schedule ("economizer once per shift, then once a day"). (c) per bank: beta.364 found that one deposit for all banks gives RH 530 vs 540 C.
- **Physics note:** Kern-Seaton `R = rInf (1 - e^(-t / tau))` between two blows. The design keeps the boiler at its Tab 3 duty with the sootblowers on their schedule, so the deposit reaches its design level within one blowing interval Tb: tau = Tb / 3 (95 % of rInf in Tb). For the backpass banks blown once a day, Tb 24 h gives **tau = 8 h**. The 8 h test of 2026-11-21 crept too fast because every start state starts clean and no sootblower ran: start the states at the design fouled state (R = rInf at 150 MW, Tab 3) and run the blowing schedule, then 8 h is the design. Per bank: rInf per bank from the FHI thermal design if it exists; otherwise one rInf per bank solved so each bank gives its Tab 3 outlet temperatures (SH, RH, eco), the same CALC as now but per bank. e 0.8 (lance removal) stays NO-SOURCE, not a fit.
- **PC page:** FHI P3S3 and P5S2 (sootblowing schedule per bank); FHI thermal design or cleanliness factors per bank, if any.

### 4. PA flow bias HIC-TADBS -26.7 (D12) · HIGH (PA and bed at part load)
- **Where:** `src/analog/engine/hmi-op.js:433` (start value of the bias station).
- **Fitted to:** the plant trends of 2026-11-08 (PA 16 ~ 21 T/H above the model).
- **Design source:** the logic. ABC-002 HIC-TADBS station 0 ~ 100 % into F(X) S1-LN14 "PA FLOW BIAS" (0 % = -30, 50 % = 0, 100 % = +30 T/H). A design start state has the operator bias at neutral: **station 50 % = 0 T/H**. LOGIC-SRC: ABC-002 S1-LN14.
- **Physics note:** none: the PA demand is then the logic curve S1-LN12 (coal to PA). Where it differs from FHI Fig 12 (90 MW: logic 313 vs FHI 236 T/H) that is a finding about the plant logic, recorded, not tuned.
- **PC page:** none.

### 5. Dead bed laws: AN_BED / anBedSS / kBedSU / tauBc / uaW · MEDIUM (cleanup, removes 4 flags)
- **Where:** `unit.js:2158` (AN_BED table and anBedSS, plant trend ratios, air exponent 0), `:213`, `:214` (tauBc 9000 s, fitted on the plant cold start trend), `:204` (uaW 0.976 from 484 T/H plant main steam).
- **Fitted to:** plant trends 2026-11-08, scenario 2, snapshot ratio 954 / 850.
- **Finding:** none of these is read by the physics any more. anBedSS is only reached through `AN.bedSS` (api.js line 125), used by the stale test `tests/regress/bed_fig8.js`; tauBc and uaW have no reader (grep of src). The bed is now the heat balance AN_BB (beta.256 / 282 / 348).
- **Action:** delete AN_BED, anBedSS, kBedSU, tauBc, uaW and the api entry; retire or rewrite bed_fig8 (Jennie, tests/**). If uaW must stay for old save points, mark it `NO-FIT-OK: read only by old saves`. For the record, the design value would be uaW = (460 + 15 CBD) / (860 - 338.5) = 0.911 T/H per K (Tab 3, MB-019, design bed 860).
- **PC page:** none.

### 6. Coal lot spreads clSd 0.021 / clSm 0.006 · MEDIUM (the 8 h behaviour gate)
- **Where:** `unit.js:4342`, `:4357` (AN_CLOT line 4360).
- **Fitted to:** the plant trend sd: coal 0.45 T/H, MSP 0.75, MW 0.43 at 150 MW.
- **Design source:** the feeder and the coal specification: Yamato gravimetric feeder accuracy +/- 0.5 % of the totalized coal (CFC-201, already cited); the coal moisture and heating value range of FHI P2S7 Tab 2 (design coal and range coal).
- **Physics note:** belt-load spread: the accuracy band +/- 0.5 % taken as 2 sigma gives sigma = 0.25 % of the feed per lot (clSd 0.0025, against 0.021 now). Moisture spread: sigma = (range of the moisture in Tab 2) / 4 (the range read as +/- 2 sigma). The MW and pressure swing then follow from the physics, not from a target sd.
- **Note:** this makes the plant quieter than the trend. The user asked for a plant that is not static (2026-11-22); the design spread keeps it moving, just less. If the user wants more, that is a training setting (a named, visible scenario), not physics.
- **PC page:** FHI P2S7 Tab 2 range coal columns; Yamato CFC-201 accuracy statement (page number).

### 7. The 150 MW start seeded from the HMI snapshot · MEDIUM
- **Where:** `hmi-op.js:724`, `:828` (anPlantLoad150G: every loop PV from AN_HMI_AI, the snapshot, then hopReq).
- **Fitted to:** the snapshot transmitters (not a fit of a constant, a start state).
- **Design source:** the steady state the model itself reaches at the design point, `#st150` built by `tools/steady150/make.cjs` (app.js line 1836). Today the snapshot is the seed and st150 overwrites it; with no st150 in the build "the snapshot alone, as before" (app.js line 1839): a fallback path.
- **Action:** make st150 required in the build (fail the build without it), seed the loops from st150, drop AN_HMI_AI as a start source. The snapshot stays a check (Rule 0).
- **PC page:** none.

### 8. Closed cooling water heat exchanger UA 7.2 % of clean, heat load x (0.4 + 0.6 x MW / 150) · MEDIUM
- **Where:** `unit.js:1860` (UA calibrated on 27.PNG), `:1988` (heat load keyed on MW).
- **Fitted to:** 27.PNG (return 40 C, supply 38 C, 3,452 kW at 148 MW).
- **Design source:** Hisaka CCWHE sheet D1-0-041: 13,830 kW, ACW 750 m3/h 50 -> 34 C, sea water 1000 m3/h 30 -> 42.12 C, 357.5 m2, clean UA 2,418 kW/K (already in the code), and the fouling factor printed on the same sheet. Heat load: the list of the CCW users and their duties (the closed cooling water system description or the P&ID heat-load table).
- **Physics note:** UA in service = 1 / (1 / UA_clean + R_f / A) with the sheet R_f. Heat load = the sum of the users: generator air / hydrogen coolers = generator losses (copper losses go with the stator current squared, the rest constant), lube oil coolers = bearing losses (constant at 3600 rpm), pump and fan motor coolers = their motor losses (current squared). No MW / 150.
- **PC page:** D1-0-041 (fouling factor line); CCW user heat-load list.

### 9. Aux / gland steam keyed on MW / 150 · MEDIUM-LOW
- **Where:** `unit.js:3399` (gland and aux steam temperatures t15 / tgs, PV-GS1034 42.6 x L), `:3650` (`Math.max(Pc, 0.366 x L)`), `:3626` (gland seal valve start MV -42.6 x MW / 150).
- **Fitted to:** the load (not a trend; flagged as load-keyed physics).
- **Design source:** Hitachi HB PPE-14-0725 R1: the gland leak flows and enthalpies of each case (front gland to crossover A, HP exhaust gland to B / C), already partly read for AN_TBW.
- **Physics note:** a labyrinth leak goes with its upstream pressure (Martin: m = k A p1 / sqrt(T1), at a fixed pressure ratio), so key the leak flow and its temperature on the HP exhaust / crossover pressure the model already has (anHb, which is a design table on steam flow), not on MW. The start MV of the seal valve comes from the controller's own steady state (item 7), not from MW.
- **PC page:** PPE-14-0725 R1 gland steam rows per case (pages 6 ~ 12).

### 10. Reheat lag tauMW 10 s (NO-SOURCE) · LOW
- **Where:** `unit.js:44`. Since 3.2.4 it is used only off the grid or after a trip (line 5877).
- **Fitted to:** nothing (the note only says the trends were too slow to fit it), but no source.
- **Physics note:** the reheater storage is already modelled (Crh, U.rr, line 5948: 20 ~ 30 s). Off the grid use the same U.Pm path and delete tauMW, or derive it: tau = stored steam / flow = V rho / m: RH 60 m3 (FHI T8 Tab 2) + piping, steam 10.3 kg/m3 at 35 kg/cm2 / 541 C (IF97), 401 T/H = 111 kg/s: 60 x 10.3 / 111 = 5.6 s for the reheater alone. DESIGN-SRC: FHI T8 Tab 2, IF97.
- **PC page:** the reheat piping volume (piping isometrics), only if tauMW is kept.

### 11. SOx capture constant k from the snapshot set point 200 ppm · LOW
- **Where:** `boiler.js:1128` (history of the old fit; the line itself is a history note) and line 1127 (k = ln(1822 / 200) / 2.715).
- **Fitted to:** the AICFG10571 SV 200 of snapshot 19.PNG.
- **Design source:** the FHI SO2 emission guarantee at the design Ca/S 2.71 (P2S7 Tab 3 or the performance guarantee). If it is 200 ppm, only the source changes.
- **PC page:** FHI performance guarantee / Tab 3 emission line.

### 12. Main steam line temperature drop 4 C and reheat line DP 0.7 kg/cm2 from the snapshot · LOW
- **Where:** `unit.js:3202` (and the PT-HR1001 lines after it).
- **Fitted to:** the 150 MW snapshot (542 - 538 C; 35.0 - 34.3 kg/cm2).
- **Design source:** FHI Tab 3 SH outlet 541 C less HB 150 MW turbine inlet 538.0 C = **3 C** at 458.3 T/H; reheat: FHI Tab 3 RH outlet 35.1 kg/cm2 less HB hot reheat at the turbine 34.77 ata (33.74 kg/cm2 g) = **1.36 kg/cm2** at 400.9 T/H, if Tab 3 is gauge.
- **Physics note:** heat loss of a lagged line is constant, so the drop goes with 1 / flow (as now); a line DP goes with the flow squared (as now). Only the anchor values change.
- **PC page:** FHI Tab 3: is the RH outlet 35.1 gauge or absolute.

### 13. Diesel oil header valve sizes and line resistance calibrated on 6.PNG · LOW
- **Where:** `boiler.js:24`, `:44`.
- **Fitted to:** snapshot 6.PNG (12.8 -> 11.0 kg/cm2 with the valve openings).
- **Design source:** the valve sheets already in the code (K1AU3-E2-0-123 p218 PCV-DO0002 Cv 17.4, p228 FCV-DO1012 Cv 17.1) and the MB-022 design split 12.5 / 12.5 T/H at 25 T/H, 2 kg/cm2.
- **Physics note:** valve Q = 0.865 Cv sqrt(dP / SG) (m3/h, bar); the pipe from the header to the ring dP = f (L / D) rho v^2 / 2 from its length, size and fittings.
- **PC page:** diesel oil piping isometric, header to the unit 1 burner ring (length, size, fittings); valve characteristic curves if not linear.

### 14. Diesel oil pump magnetizing current from the snapshot · LOW
- **Where:** `boiler.js:62`.
- **Fitted to:** 6.PNG P-0702A 25.4 A.
- **Design source:** the motor test report of the TECO 40 HP 460 V motor (no-load current).
- **Physics note:** I = sqrt(Ia^2 + Im^2), Ia = P / (eff sqrt3 V) (as now); Im = the test-report no-load current.
- **PC page:** TECO motor test report (K1AU3-D1-0-060 or the motor data book).

### 15. BFWP motor current by the snapshot ratio 289.4 A · LOW
- **Where:** `unit.js:2617`.
- **Design source:** BFWP motor data sheet (rated kW, kV, efficiency, power factor).
- **Physics note:** I = P_shaft / (eff x sqrt3 x V x pf), shaft power from the pump curve already in AN_FW (qQ / qH and the efficiency curve).
- **PC page:** BFWP motor data sheet.

### 16. Condensate pump outlet offset kz 0.96 and current by the snapshot ratio · LOW
- **Where:** `unit.js:2129`.
- **Design source:** CEP motor data sheet; the elevation of the outlet transmitter against the pump (P&ID / GA).
- **Physics note:** kz = rho g dz (10 m of water = 1 kg/cm2); current as item 15.
- **PC page:** CEP motor data sheet; elevation of PT on the CEP discharge.

### 17. Make-up water pump header z 11.3 m calibrated on 28.png · LOW
- **Where:** `unit.js:1711`.
- **Design source:** the elevations of the make-up water tank bottom and of PT-MU0709 (P&ID / GA).
- **Physics note:** header pressure = 0.1 kg/cm2 per m x (tank level + elevation difference + pump head), as now, with the drawn elevation.
- **PC page:** GA or P&ID elevation of the make-up tanks and PT-MU0709.

### 18. Tag only, no physics change (15 lines)
These lines describe a fit that is already gone, or a value that comes from the logic, or say "no fit". Tag each one `NO-FIT-OK: <why>` so the guard reads them as notes; the baseline then shrinks by 15 with no risk to the app.

| Line | Why it is only a note |
|---|---|
| hmi-op.js:326 | AICFG112 SV 3.5 is the logic set point (LN16): `LOGIC-SRC: ABC-002 LN16` |
| hmi-op.js:1119 | describes the hold of the MW select; no value set |
| hx.js:23 | the line says "no fit" |
| hx.js:112 | history: the beta.342 panel fit was removed in beta.346 |
| unit.js:170 | history: the F11 ratio fit was removed |
| unit.js:2169 | history: the char split was tried and not used |
| unit.js:2190, 2191 | history: the start-up law fit was replaced by the bed heat balance |
| unit.js:2205 | nU 3.5 is read only to migrate old save points (line 2272) |
| unit.js:2246 | history: tbA moved from the snapshot to the design 860 C |
| unit.js:2693 | history: the MW line fit was replaced by the HB |
| unit.js:4712 | explains why tauMW is not used on house load |
| unit.js:4730 | history: the old MW integral replaced by the TCE195 gains |
| unit.js:5381, 5382 | history: the fuel line fit is gone |

(boiler.js:1128 is also a history line; it is kept in item 11 because the k beside it still rests on a snapshot set point.)

### 19. Found by QA : SAORI after the list: 10 lines the no-fit guard does not see (2026-11-25, list only, model on hold)

Plant model work is on hold (lane plan 2026-11-25). These lines go in the model phase with the rest. Each one gives a value with a number taken from the HMI snapshot or fitted to it, which RULES 3.12 / 3.5 forbid. None of them is in `tools/check/no-fit-baseline.json`.

| Where | Line | What is wrong | Design / physics source for the fix |
|---|---|---|---|
| unit.js 3237 | `aiH = k => ... AN_HMI_AI[k]` | A transmitter on no sheet falls back to the snapshot value (RULES 3.5: no snapshot fallback). Lane KIRARA found it on seal pot pressure (1). | Compute the point from the model it measures: for the seal pot, the FA blower head on its curve minus the distributor and nozzle loss. If no model exists, show "-----" (no signal) and put the point on the "needs model" list. |
| unit.js 3264 / 3265 | `PT-FG1009-A2 = aiH(AI0146) + 615 x fr`, `B2 = aiH(AI0147) + 392 x fr` | The base is the snapshot (through aiH). The column gains 615 / 392 differ A to B and are fitted. | Tap (1) as above. The column is rho_bulk x g x h of the seal pot leg solids (K1AU3-C-0-002 seal pot drawing for h, bed sand bulk density from FHI Tab 3 sand data). It is the same law for A and B. |
| unit.js 3266 ~ 3268 | `LT-CL1008-A/B/C = 4.56 / 3.65 / 3.89` | Fixed snapshot levels. | Coal is unlimited by design (user). The level is a boundary value: one design normal level for all three from the bunker drawing, tagged `NO-FIT-OK: boundary, unlimited coal (user 2026-11-24)`. It is not three snapshot numbers. |
| unit.js 3262 / 3263 | `PT-BR1130 = pd - 6.4 x lf`, `PT-BR1150 = pd - 9.3 x lf` | The section pressure drops are fitted to the snapshot. lf = (ms / ms0)^2 is a load key. | FHI P2S7 Tab 3: SH pressure drop 16 kg/cm2 at MCR, drum to SH outlet. Split it across the sections by their flow resistance from the SH geometry (K1AU3-B-0-003, PC). It scales with flow^2 and specific volume. Same work as item 12. |
| unit.js 3255 | `PT-HR1001 = AI0421 + 0.7 x (mr / ms0)^2` | The reheat line DP 0.7 is a snapshot fit. | FHI Tab 3: RH 36.6 to 35.1 kg/cm2 = 1.5 at 181.9 T/H, plus the HB cold / hot reheat pressures (PPE-14-0725). Same work as item 12. |
| hmi-op.js 303 | `'5|AI0064': [28.6, 'FIMU0001']` | Make-up flow fixed at the snapshot value. | The make-up flow is the cycle loss (blowdown, sampling, vents, sootblowing steam) taken from the model, through the make-up pump on its curve. Same work as item 17. |

**Why the guard missed them** (`tools/check/no-fit.cjs`):
1. It looks for words (plant trend, fitted, calibrated, snapshot ratio, from the snapshot) and for MW / 150. These lines carry no such word. The comment at aiH says "the snapshot value of the HMI", which none of the patterns matches.
2. The load key here is the steam flow (lf = (ms / ms0)^2, (mr / ms0)^2) or the bed share (fr), not MW / 150.
3. The snapshot comes in through a function (aiH) and a data table (AN_HMI_AI in hmi-op.js). The guard reads text, so a value is never traced back to the snapshot.

**Tightening for the model phase** (YUA owns tools/check):
- Flag every read of `AN_HMI_AI` or `aiH(` in src/analog/engine and src/world, unless the line is display-only with the plant model OFF and is tagged.
- Flag the word "snapshot" anywhere in engine physics without a source tag.
- Flag a tag map entry whose value is a bare number (`'XX-NNNN': 4.56`).
- Flag a bare numeric coefficient times a load proxy (`ms / ms0`, `mr / ms0`, `lf`, `fr`, `MW`) without a source tag.
- Add these 10 lines to the baseline in the same PR, so the guard fails on any new one from day one.

New total: 44 + 10 = **54 lines** to clear in the model phase.

## PC pages to read (one sitting, for Jennie)

1. FHI P3S3 and P5S2: sootblowing schedule per bank (item 3).
2. FHI thermal design or cleanliness factors per backpass bank, if they exist (item 3).
3. FHI P2S7 Tab 2: range coal columns (moisture, LHV) (item 6).
4. Yamato CFC-201: the accuracy statement, page number (item 6).
5. Hisaka D1-0-041: fouling factor line; the CCW user heat-load list (item 8).
6. PPE-14-0725 R1 pages 6 ~ 12: gland steam rows (item 9).
7. FHI performance guarantee / Tab 3: SO2 emission at design Ca/S; RH outlet pressure unit (items 11, 12).
8. Diesel oil piping isometric header to burner ring (item 13).
9. Motor data: TECO 40 HP test report, BFWP motor, CEP motor (items 14 ~ 16).
10. Elevations: PT-MU0709 and make-up tanks, PT on the CEP discharge (items 16, 17).

Items 1, 2, 4, 5, 7 need no PC page: the design numbers are already in the repository.

## Suggested order for Jennie
Item 18 first (15 tags, no risk). Then 5 (dead code), 2 (bed inventory 1630), 4 (PA bias neutral), 7 (st150 required). Then the big one, 1 (kKL 3.8 with the missing storage physics), then 3 (fouling with the sootblowing schedule). The rest as the PC pages come.

## Fix order and work packages (user 2026-11-25 00:21 PHT: order, split for other threads, fast tests)

### What decides the order
- **st150 is the shared baseline.** Any change that moves the 150 MW steady state (items 2, 3, 4, 12) needs `src/data/st150.txt` rebuilt (`tools/steady150/make.cjs`), and then the start saves (`tools/startsaves/make.cjs`). Two threads rebuilding it in parallel conflict and each one's tests run on the other's plant. **Rule: only Jennie rebuilds st150, once per batch, after every 150 MW change of that batch has landed.**
- **kKL (item 1) changes part load only** (phi = 1 at the 150 MW anchor), so it does not move st150, but its proof is the part-load sweep, which needs the 150 MW batch settled first.
- **The 8 h behaviour gate** judges the whole plant, so the coal lot spread (item 6) goes after the boiler batch, or the two cannot be told apart.
- **The guard baseline** (`tools/check/no-fit-baseline.json`) is one file for all. A removed line only shows as "removed" and never fails the Checks, so no package edits it; the last PR of all runs `node tools/check/no-fit.cjs --update` once.
- **unit.js is one file**, but the items sit far apart (lines 44 ~ 5382). Different regions merge cleanly; the only rule is that each package stays in its own lines below.

### Order with dependencies
1. **P0 cleanup** (no behaviour change) first: it touches comment lines all over unit.js / hx.js / hmi-op.js, so landing it first avoids conflicts with everyone.
2. Then in parallel: **P1 boiler core** (Jennie) and **P2 auxiliaries** (second engine thread). P2 item 12 must land **before** Jennie's st150 rebuild (it moves the 150 MW MW by a little), or it waits for the next rebuild.
3. **P1 step 4 (kKL)** after P1 steps 1 ~ 3 and the st150 rebuild.
4. **P3 start state** any time after P0; its app.js part is Rosé's (src/ui).
5. **P4 coal lots** last, after P1.
6. Last PR of all: baseline `--update`.

### P0 · Cleanup: tags and dead code (anyone, first) · size S (~1 h)
- Lines: the 15 of item 18 (tag `NO-FIT-OK:` / `LOGIC-SRC:`) and item 5 (delete AN_BED, anBedSS, kBedSU, tauBc, uaW: unit.js 204 ~ 218, 2154 ~ 2160, 2435 ~ 2456; api.js 125).
- Files: src/analog/engine/unit.js, hx.js, hmi-op.js, api.js; tests/regress/bed_fig8.js retired (Jennie's tests/**: so P0 is done by Jennie or with her OK).
- Source: none needed (comments and unread code).
- Proof: `node tools/check/no-fit.cjs` shows 19 removed, 0 new; `npm run check` green; grep shows no reader of the deleted names; hold150 unchanged (the physics did not move). No long run.

### P1 · Boiler core: JENNIE keeps it · size L (1 ~ 2 days)
Order inside, one PR each:
1. **Item 4, PA bias to neutral** (hmi-op.js 433). S. Proof: 150 MW start, PA = logic S1-LN12 at the coal, bias 0; part1 PA / SA rows.
2. **Item 2, bed inventory to Fig 9** (unit.js 540, 2458). M. Proof: bed_inv rewritten to 1630 mmH2O / 194.2 t; the furnace DP controller (SV 1630) holds with the coolers in AUTO 30 plant min; part1 "Bed inventory" row at 45 / 90 / 150 (1380 / 1380 / 1630).
3. **Item 3, fouling** (hx.js 173 ~ 191): fouled start states, tau 8 h from the sootblowing interval, rInf per bank. M ~ L. Needs PC: FHI P3S3 / P5S2 (blowing per bank), per-bank fouling if any. Proof: gas_path (APH gas in 322 at design fouling), RH 541 not 530, 8 h hold at 150 MW with the sootblowers on schedule (fast forward, see below): spray and MST stay in band, no creep.
4. **st150 rebuild + start saves** (after 1 ~ 3 and P2 item 12). M (mostly machine time).
5. **Item 1, kKL 3.80 + the missing storage physics** (unit.js 2281 ~ 2297, AN_BB). L. Proof: the part-load sweep against `docs/accept/curves` (Fig 7 O2, Fig 8 furnace, Fig 10 spray, Fig 12 air, Fig 13 coal at 40 ~ 100 %); the 150 MW pressure loop with a 5 MW step: no drum level HH; part1 all three loads.

### P2 · Auxiliaries: SECOND ENGINE THREAD · size M (~1 day, most of it waiting for PC pages)
Each item its own small PR; none moves the boiler; only item 12 moves st150.
- **Item 12** MS line drop 3 C, RH line DP 1.36 (unit.js 3198 ~ 3210). S. Proof: hold150 TT-MS1007 = MST - 3; part1 MSTt / Prh rows. **Land before P1 step 4.** Needs PC: Tab 3 RH pressure gauge or absolute.
- **Item 8** CCW HX from the Hisaka sheet, heat load as the sum of the users (unit.js 1840 ~ 2000). M. Needs PC: D1-0-041 fouling line, CCW user list. Proof: mu_ccw_model, bfwp_motor_ccw, lube_oil; CCW supply / return at 45 / 90 / 150 MW from the user duties.
- **Item 9** gland / aux steam on pressure from the HB (unit.js 3395 ~ 3410, 3620 ~ 3660). M. Needs PC: PPE-14-0725 gland rows. Proof: as_page_values, plant_utilities, tcs_ibd_devices; gland values at the three HB cases.
- **Item 10** tauMW: delete and use U.Pm off the grid, or derive (unit.js 44, 5877). S. Proof: unit_trip, gcb (house load).
- **Item 11** SOx k from the FHI guarantee (boiler.js 1120 ~ 1128). S. Needs PC: FHI guarantee. Proof: limestone.
- **Items 13 ~ 17** oil header and pump, BFWP and CEP current, CEP and make-up elevations (boiler.js 20 ~ 65, unit.js 1705 ~ 1715, 2125 ~ 2130, 2610 ~ 2620). S each. Needs PC: piping iso, motor data sheets, elevations. Proof: diesel_oil, feedwater, condensate, cep_auto, mu_ccw_model, field_valves.
- P2 does not touch AN_BB, AN_FOUL, the bed, st150 or the start saves.
- PC rule: only one thread on the PC at a time, so P2 reads all its pages in one sitting when Jennie hands the PC over.

### P3 · Start state from st150 only · size S (~1 h)
- Item 7: hmi-op.js 724 ~ 830 (engine: seed the loops from st150, drop AN_HMI_AI as a start source; second engine thread) + src/ui/shell/app.js 1836 ~ 1840 (Rosé: no "snapshot alone" fallback) + tools/build (fail without st150).
- Proof: build fails with no st150; "Start at 150 MW" equals st150 at 0:00 (reset_clean, hold150).

### P4 · Coal lot spread from the feeder accuracy · size S + one 8 h run
- Item 6: unit.js 4341 ~ 4400 (AN_CLOT). After P1. Needs PC: Tab 2 range coal, Yamato CFC-201 accuracy. Proof: the 8 h behaviour gate at 150 MW (MW +/- 2, MSP +/- 2, drum +/- 60 mm, MST +/- 6, bed 850 ~ 870) with the design spread.

### Fast tests (time matters)
- **Headless runs are already fast forward:** the regress tests and `tools/accept/part1.cjs` step the plant (AN.stepSet + WORLD.tick, 0.5 s scans) as fast as the CPU goes, not in real time. Run only the tests listed for the package, not the whole suite (PROJECT lean test policy).
- **part1 while working:** `node tools/accept/part1.cjs <html> 20 10` (settle 20, window 10 plant min) to see the direction; the full `60 30` only once for the PR that changes an item's state.
- **8 h holds:** headless in chunks with a save point between chunks (as tools/steady150 does), never in the live app.
- **Live app checks** (Rule: real clicks, screenshot before and after): maximize the app window and use the x10 speed of the app (world.js runs the DITL timers at x10 without skipping them, 3.2.1) for the settling parts; real time only for the step the operator does.
- **One st150 rebuild per batch**, not per PR.
