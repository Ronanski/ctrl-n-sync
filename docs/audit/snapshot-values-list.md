# Values that stand on a plant snapshot or trend (Full Audit 3 #5, part 2)

AUDIT FIX : LISA, 2026-11-24 00:36 PHT, main 4fdc967. Read-only: no code changed.

**User rule 2026-11-24 00:35 PHT ("GO DESIGN"):** the design is the model. Design documents (heat balance, FHI manual design data and curves, vendor data sheets and curves, P&ID, logic) are the only target of the plant model; a value that has none is derived from physics and the derivation is written beside it. A plant HMI snapshot (NN.PNG) or a plant trend is a sanity check only, never the source of a value. Every associated logic is followed as drawn. No patch, no fit.

Search: `grep -rniE "[0-9]+\\.png|snapshot|plant trend|calibrat"` in `src/analog/engine`, `src/world`, `src/digital/parts` = 524 lines.

First sort by the words of each comment (to be checked by hand when each file is fixed):

- **VALUE 24**: the comment says the value is calibrated on, taken from or held at a snapshot / trend. These must move to a design doc or a physics derivation. This is the work list.
- **START 211**: `src/world/ditl150.js` and `src/analog/engine/hmi-op.js`: which machines run, valve positions and modes at the 150 MW start. A starting STATE (what the operator had on), not a model parameter; the plant model must reach the same state from the design by itself. Each is checked when the 150 MW start is rebuilt from the design (`tools/steady150`).
- **CHECK 27**: the snapshot is cited as a comparison only (allowed).
- **READ 262**: the comment cites a snapshot without saying how; read the code at fix time.

The "Doc" column is the design document to use instead (by the system the line names). Many need a PC read; the coordinator batches those.

## VALUE (work list)

| # | Where | Design doc to use | Comment |
|---|---|---|---|
| 1 | `src/analog/engine/api.js:101` | design doc by system (document-references/INDEX.md); else mass / energy balance | out and the station outputs), as the snapshot load does (hmi-op.js, 2.2.0-beta.9) */ |
| 2 | `src/analog/engine/unit.js:1304` | pump data sheets + curves (vendor), P&ID line sizes | Calibration      the design point = the two vendor documents that agree: 2 SWP at 18,900 m3/h = 37,800 m3/h = the S-1502 normal |
| 3 | `src/analog/engine/unit.js:1359` | design doc by system (document-references/INDEX.md); else mass / energy balance | /* design point (calibration) */ |
| 4 | `src/analog/engine/unit.js:1735` | design doc by system (document-references/INDEX.md); else mass / energy balance | z = 11.3 m CALIBRATED on the HMI snapshot 28.png (2 MWP running at their recirculation flow, levels 13.8 / 13.7 m, |
| 5 | `src/analog/engine/unit.js:1878` | design doc by system (document-references/INDEX.md); else mass / energy balance | within 5 %): suction static = 6.4 - 4.955 = 1.445 kg/cm2 (tank level + its height, CALIBRATED: the height is not in |
| 6 | `src/analog/engine/unit.js:1884` | pump data sheets + curves (vendor), P&ID line sizes | 750). The UA in service is CALIBRATED on 27.PNG (return 40 C, supply 38 C at 1500 m3/h = 3,452 kW, seawater |
| 7 | `src/analog/engine/unit.js:1919` | design doc by system (document-references/INDEX.md); else mass / energy balance | UA: 174.8 /* kW/K per CCWHE in service, CALIBRATED (see above): NTU 0.2025 at 27.PNG with 2 SWBP (2,450 m3/h of the CW model) */, |
| 8 | `src/analog/engine/unit.js:1987` | design doc by system (document-references/INDEX.md); else mass / energy balance | ) /* 100 % = the calibration (27.PNG) */, |
| 9 | `src/analog/engine/unit.js:2114` | diesel oil package data (ALLWEILER curves, M&S BMS) | calibrated   with the vendor UA and a linear valve (170 T/H x MV, NO-SOURCE: no valve curve), the snapshot gives an oil flow of 64.5 kW/K |
| 10 | `src/analog/engine/unit.js:2153` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | the transmitter elevation, calibrated to 16.9 at 150 MW); current = 28.1 A x shaft power / 245.7 kW (snapshot ratio). */ |
| 11 | `src/analog/engine/unit.js:2215` | FHI CFB manual P2S7 design data + curves vs load; P5; mass balance K1AU3-A2-0-001 | order to a law fitted on the plant trend (start-up exponent kBedSU 0.168 and the AN_BED table), and the water walls took |
| 12 | `src/analog/engine/unit.js:2686` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | /* 3.2.3 (SAKURA, coordinator / Jennie 2026-11-15: the MW line MW = c x steam - mwK was fitted on the plant trends of 2026-11-08, which |
| 13 | `src/analog/engine/unit.js:3205` | design doc by system (document-references/INDEX.md); else mass / energy balance | /* a transmitter on no sheet reads the snapshot value of the HMI (hmi-op.js), as its own page shows it */ |
| 14 | `src/analog/engine/unit.js:3332` | design doc by system (document-references/INDEX.md); else mass / energy balance | 03.png: UNUSUAL (the equal % curve at 14.9 % travel is far below what flows); beta.259: the x 2.94 snapshot calibration is removed (no patches: the Cv of the data sheet only); |
| 15 | `src/analog/engine/unit.js:4672` | generator data sheet GAE-2013-0136 R2, ETAP load flow | factor of the snapshot (0.977) while synchronised; current = MVA / (1.732 x 13.8 kV); the exciter field follows the internal |
| 16 | `src/analog/engine/unit.js:4852` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | 130 MW). The cooler outlet air stays at the snapshot while the shaft turns (NO-SOURCE: its change with the cooling water); at rest |
| 17 | `src/analog/engine/unit.js:5226` | FHI CFB manual P2S7 design data + curves vs load; P5; mass balance K1AU3-A2-0-001 | /* 3.2.3-beta.212 (F16): snapshot values of the furnace / cyclone / seal pot thermocouples (hmi-op.js AN_HMI_AI), kept off U */ |
| 18 | `src/analog/engine/unit.js:5778` | design doc by system (document-references/INDEX.md); else mass / energy balance | thermocouples, each on its own snapshot value (hmi-op.js AN_HMI_AI). U.gFu / U.gFl = the average of the nine lower layer above / |
| 19 | `src/analog/engine/boiler.js:24` | design doc by system (document-references/INDEX.md); else mass / energy balance | The valve sizes (K) are CALIBRATED on 6.PNG with that split; linear valves (NO-SOURCE: no valve curve). Check: PCV-DO0002 |
| 20 | `src/analog/engine/boiler.js:29` | design doc by system (document-references/INDEX.md); else mass / energy balance | open gives the MAX at that ring pressure (CALIBRATED). |
| 21 | `src/analog/engine/boiler.js:44` | design doc by system (document-references/INDEX.md); else mass / energy balance | (CALIBRATED on 6.PNG; the pipe itself is NO-SOURCE). The return PCV-DO1009 passes the same 13.9 T/H at 85.7 % and 11.0. */ |
| 22 | `src/analog/engine/boiler.js:62` | plant air compressor manual, dryer data | Ia = P / (eff x sqrt3 x 460 V): 22.5 A at 12.8 bar, 3.5 A at 0 bar. The magnetizing current Im is not on the sheet; from the snapshot |
| 23 | `src/analog/engine/boiler.js:308` | plant air compressor manual, dryer data | of the snapshot times (no-load share fI + the rest x air power / air power of the snapshot), air power = flow x pressure rise |
| 24 | `src/analog/engine/boiler.js:1129` | design doc by system (document-references/INDEX.md); else mass / energy balance | 3.2.3-beta.91 (SAKURA, user 2026-11-11 "reverse engineer o calibrate, wag lng assumed"): |

## READ (sort at fix time)

| Where | Design doc to use | Comment |
|---|---|---|
| `src/analog/engine/plant.js:258` | design doc by system (document-references/INDEX.md); else mass / energy balance | /* 2.0.0 (user tip): OPERATING POINTS of the real plant, from the control-room HMI snapshots (docs/hmi/operating-points.json, |
| `src/analog/engine/plant.js:259` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | about 150 MW). The plant model is ANCHORED there: with the snapshot MV the PV settles at the snapshot PV; the slope (K) and |
| `src/analog/engine/plant.js:260` | design doc by system (document-references/INDEX.md); else mass / energy balance | the direction (ACT) stay as before. Only loops that run in AUTO / REMOTE on the snapshot with their own valve; cascade |
| `src/analog/engine/plant.js:264` | design doc by system (document-references/INDEX.md); else mass / energy balance | hop / Ka: the HMI snapshot anchor of a loop is made once at the first scan (ABC-019 TICHR1002: 39.PNG 541 C; made again after a run it |
| `src/analog/engine/plant.js:292` | design doc by system (document-references/INDEX.md); else mass / energy balance | TICBR1140: { mv: 65.6, pv: 462.0, src: '03.png' }, |
| `src/analog/engine/plant.js:293` | design doc by system (document-references/INDEX.md); else mass / energy balance | TICBR1130: { mv: 57.6, pv: 394.0, src: '03.png' }, |
| `src/analog/engine/plant.js:294` | design doc by system (document-references/INDEX.md); else mass / energy balance | TICMS1004: { mv: 69.7, pv: 542.0, src: '03.png' }, |
| `src/analog/engine/plant.js:295` | design doc by system (document-references/INDEX.md); else mass / energy balance | TICBR1150: { mv: 30.2, pv: 420.0, src: '03.png' }, |
| `src/analog/engine/plant.js:296` | design doc by system (document-references/INDEX.md); else mass / energy balance | LICBR1001A: { mv: 56.0, pv: 3.0, src: '03.png' }, |
| `src/analog/engine/plant.js:297` | design doc by system (document-references/INDEX.md); else mass / energy balance | FICFW1007: { mv: 56.0, pv: 499.1, src: '03.png' }, |
| `src/analog/engine/plant.js:298` | design doc by system (document-references/INDEX.md); else mass / energy balance | FICCL1061A: { mv: 72.8, pv: 29.0, src: '11.png' }, |
| `src/analog/engine/plant.js:299` | design doc by system (document-references/INDEX.md); else mass / energy balance | FICCL1061B: { mv: 72.8, pv: 29.1, src: '11.png' }, |
| `src/analog/engine/plant.js:300` | design doc by system (document-references/INDEX.md); else mass / energy balance | FICCL1061C: { mv: 72.8, pv: 28.9, src: '11.png' }, |
| `src/analog/engine/plant.js:301` | design doc by system (document-references/INDEX.md); else mass / energy balance | TICHR1002A: { mv: 36.0, pv: 541.0, src: '39.PNG' }, |
| `src/analog/engine/plant.js:302` | design doc by system (document-references/INDEX.md); else mass / energy balance | TICHR1002: { mv: 79.4, pv: 541.0, src: '39.PNG' }, |
| `src/analog/engine/plant.js:303` | design doc by system (document-references/INDEX.md); else mass / energy balance | HICHR1002A: { mv: 11.0, pv: 11.0, src: '39.PNG' }, |
| `src/analog/engine/plant.js:304` | design doc by system (document-references/INDEX.md); else mass / energy balance | HICHR1002B: { mv: 89.0, pv: 89.0, src: '39.PNG' }, |
| `src/analog/engine/plant.js:305` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | /* 3.2.0 (Rosé, FA blower B at 150 MW): the fluidizing air flow, 9.png FIFA1055 26.3 T/H with FCVFA1055A1 42.8 % (blower A alone, |
| `src/analog/engine/plant.js:306` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | B standby; OPERATING_POINTS.md). Its PV comes from ABC-006 (a remote PV, links.js procRemote): the 150 MW load found no snapshot |
| `src/analog/engine/plant.js:309` | design doc by system (document-references/INDEX.md); else mass / energy balance | FICFA1055A: { mv: 42.8, pv: 26.3, src: '9.png' } |
| `src/analog/engine/plant.js:327` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | FCV-CD1120) and deaerator (ABC-031 LICCD1104 level valve LCV-CD1104). Before: three separate loops anchored at the 150 MW snapshot |
| `src/analog/engine/plant.js:330` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | Anchored at the 150 MW snapshot (hmi-op.js, 28.png / 03.png): deaerator valve 17.5 % = condensate 380 T/H (21.7 T/H per %, |
| `src/analog/engine/plant.js:341` | design doc by system (document-references/INDEX.md); else mass / energy balance | snapshot (17.5 % = 380 T/H, hmi-op.js 28.png / 03.png), straight lines between; above 17.5 % the slope of before (21.7 T/H per %). |
| `src/analog/engine/plant.js:342` | design doc by system (document-references/INDEX.md); else mass / energy balance | Was 21.7 T/H per % from 0 (linear, no source). The sheet's 362 T/H at 68 % and the snapshot cannot both hold: still open */ |
| `src/analog/engine/plant.js:550` | design doc by system (document-references/INDEX.md); else mass / energy balance | product of the two openings (7.PNG: 46.1 % x 99.1 %), not their sum */ |
| `src/analog/engine/plant.js:581` | fan spec + FLOW CURVE (fan-instruction-manual-SAF-PAF-IDF.pdf); FHI P5 air & flue gas | PV by half (spray 0 -> 100 % = -33 C instead of -67 C), and the anchor at the snapshot was taken with the damper of THAT |
| `src/analog/engine/plant.js:582` | fan spec + FLOW CURVE (fan-instruction-manual-SAF-PAF-IDF.pdf); FHI P5 air & flue gas | moment, so a damper move was cancelled by the anchor in the steady state. Now the anchor is the snapshot command of every |
| `src/analog/engine/plant.js:615` | design doc by system (document-references/INDEX.md); else mass / energy balance | /* anchored measurement: the other actuator, from its snapshot command to either end (0 or 100 %), keeps the PV inside the |
| `src/analog/engine/plant.js:635` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | /* 2.1.0-beta.6: "Start at 150 MW" (hmi-op.js) gave the PV of the snapshot transmitters (pr.hopReq): a loop without a static |
| `src/analog/engine/plant.js:636` | design doc by system (document-references/INDEX.md); else mass / energy balance | anchor is anchored NOW at (the command that goes to the valve now -> that PV), so the plant model keeps the snapshot |
| `src/analog/engine/plant.js:637` | FHI P2S7 (SH / RH temp, spray curves), P4 SH/RH; K1AU3-B-0-004 | value instead of its own steady state. Not for: a static anchor, the drum level (integrating), a flow loop whose valve is closed or whose flow is 0 on the snapshot. Reset removes it (anReset |
| `src/analog/engine/plant.js:662` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | span) /* a flow at 0 with the valve open = an isolation valve is shut (oil burner out of service): not the control valve. 2.2.0-beta.7: a valve almost shut with flow through it is anchored t |
| `src/analog/engine/plant.js:669` | design doc by system (document-references/INDEX.md); else mass / energy balance | }; /* the MV of the snapshot when known, else the command now */ |
| `src/analog/engine/plant.js:693` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | /* 2.2.0-beta.7: a flow with its valve almost shut (< 2 %) is not made by that valve alone (28.png: 380 T/H of condensate |
| `src/analog/engine/plant.js:695` | design doc by system (document-references/INDEX.md); else mass / energy balance | adds to the flow of the snapshot (offset, gain K), instead of a flow proportional to a 0.1 % opening */ |
| `src/analog/engine/plant.js:697` | fan spec + FLOW CURVE (fan-instruction-manual-SAF-PAF-IDF.pdf); FHI P5 air & flue gas | of the snapshot are at their minimum stop (12.PNG MCVFA1043A 2.5 % with the burner air flowing): the same offset case */ |
| `src/analog/engine/plant.js:702` | FHI P2S7 (SH / RH temp, spray curves), P4 SH/RH; K1AU3-B-0-004 | outlet at the snapshot (03.png: SH no.2 outlet TICBR1140 462 C, spray 2 outlet TICBR1150 420 C at MV 30.2 %: 42 C, about 139 C at |
| `src/analog/engine/plant.js:721` | FHI P2S7 (SH / RH temp, spray curves), P4 SH/RH; K1AU3-B-0-004 | through the spray water it lets into the steam (no snapshot gain, no load curve) */ |
| `src/analog/engine/plant.js:792` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | /* 2.2.0-beta.3: pr.y0 (Start at 150 MW): the model starts from the PV of the snapshot, then follows the valve with its own |
| `src/analog/engine/plant.js:891` | pump data sheets + curves (vendor), P&ID line sizes | 03.png feedwater 499.1 - main steam 474.1 = 25.0 T/H (pr.integLoss, removed by Reset) */ |
| `src/analog/engine/plant.js:948` | design doc by system (document-references/INDEX.md); else mass / energy balance | (hmi-op.js AN_CBD_DESIGN); before it was the 25 T/H snapshot difference, of which 10 T/H had no outlet on MB-019. integLoss stays the setting of the |
| `src/analog/engine/plant.js:1088` | design doc by system (document-references/INDEX.md); else mass / energy balance | 2.2 %, PV = their average 4.3 %, 7.PNG) keep their own reading around the model: each keeps its offset from their mean at |
| `src/analog/engine/plant.js:1193` | FHI CFB manual P2S7 design data + curves vs load; P5; mass balance K1AU3-A2-0-001 | stopped. 11.png: SV 29.1 T/H, PV 29.0 / 29.1 / 28.9 T/H. Before: the feedrate stayed at its value, so the coal master |
| `src/analog/engine/plant.js:1587` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | "Set biasing damper and RH to Remote-Auto") and 39.PNG (both A at 150 MW). The signal is still computed and shown */ |
| `src/analog/engine/plant.js:2083` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | /* 2.2.0-beta.7: not while "Start at 150 MW" loads the plant (AN.steady): the snapshot is a steady state, a signal that the load |
| `src/analog/engine/face-defaults.js:333` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | basis: 'ABC-026 FURNACE TEMPERATURE (1): bed temp HIGH > 950 C (M.3334), H.H. > 980 C (M.3333), LOW < 820 C (M.3335) into the annunciator DITL-40; per thermocouple: the alarm list says FHI ( |
| `src/analog/engine/face-defaults.js:361` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | basis: 'ABC-026 FURNACE TEMPERATURE (1): bed temp HIGH > 950 C (M.3334), H.H. > 980 C (M.3333), LOW < 820 C (M.3335) into the annunciator DITL-40; per thermocouple: the alarm list says FHI ( |
| `src/analog/engine/face-defaults.js:566` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | basis: 'alarm list 2016-09-12 (DCS temporary values), PT sheet item 85 PT-ST1001-2: HH (105-dcs), H (93.8-dcs); the 2015-12-24 and 2016-02-01 lists have none. Stands at 150 MW: the first sta |
| `src/analog/engine/tcs-trip.js:193` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | Y = -2; VE-ST1001 No.1 / VE-ST1002 No.2 turbine, VE-GE1001 No.3 / VE-GE1002 No.4 generator = loVx1..4 / loVy1..4 of tcsOil (snapshot |
| `src/analog/engine/tcs-trip.js:215` | diesel oil package data (ALLWEILER curves, M&S BMS) | 1002 No.3 / 4 = loM1..4; TE-ST1011-1 / -2 thrust front = loThF, TE-ST1012-1 / -2 thrust rear = loThR (tcsOil, snapshot 035) */ |
| `src/analog/engine/tcs-trip.js:237` | plant air compressor manual, dryer data | AC EXCITER OUTLET AIR (ON >= 95 C) = the generator temperatures of unit.js anGenTemp (U.genT ts / ta / ex, snapshot 035 SHAFT MONITOR) */ |
| `src/analog/engine/hx.js:23` | design doc by system (document-references/INDEX.md); else mass / energy balance | SOURCES (no fit to a plant snapshot or trend): |
| `src/analog/engine/hx.js:111` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | /* beta.342 (JENNIE, F13): one conductance per panel, anchored on the plant at 150 MW (03.png and the HMI snapshot). The whole boiler closes |
| `src/analog/engine/hx.js:193` | design doc by system (document-references/INDEX.md); else mass / energy balance | const AN_FOUL = { rInf: 0.0042 /* m2K/W, CALC (see above) */, tau: 56 * 3600 /* s, CALC from the plant trend (see above) */, e: 0.8 /* NO-SOURCE */, mcr: 89 }, |
| `src/analog/engine/tcs.js:154` | design doc by system (document-references/INDEX.md); else mass / energy balance | MANUAL; 1P1923 EOP; 1F1937 vapour extractor). In service = the 36.PNG / SOP 2620 line-up: A running, B standby in AUTO */ |
| `src/analog/engine/tcs.js:713` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | /* 3.2.1 (IRENE, 29.PNG 151 MW: TEST11101 ~ 3 38 / 38 / 37 C = the saturation of the condenser 0.056 kg/cm2A): on load the steam |
| `src/analog/engine/tcs.js:930` | diesel oil package data (ALLWEILER curves, M&S BMS) | COP P-1931A / B   control oil (the suction is the lube oil header, 36.PNG); AUTO start at the discharge (1PTLO1931A / B) <= 133; |
| `src/analog/engine/tcs.js:934` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | Values (36.PNG at 149 MW, SOP limits; the rest NO-SOURCE and marked): |
| `src/analog/engine/tcs.js:938` | design doc by system (document-references/INDEX.md); else mass / energy balance | datasheet is a scan). 36.PNG shows 6.9, SOP 5.6 ~ 6.6. beta.212 had 6.1, the SOP mid value: IBD TB-1 / TB-2 resets the |
| `src/analog/engine/tcs.js:940` | diesel oil package data (ALLWEILER curves, M&S BMS) | bearing oil       3.3 (36.PNG PILO10031 ~ 33) with a MOP; 1.6 with the EOP only (NO-SOURCE, above its 1.05 start); else 0; |
| `src/analog/engine/tcs.js:942` | diesel oil package data (ALLWEILER curves, M&S BMS) | COP discharge     163.2 while running (SOP "163.2 ksc"; 36.PNG 164.2); control oil header = discharge - 0.6 (the filter, 36.PNG |
| `src/analog/engine/tcs.js:943` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | 164.2 -> 163.6); trip oil (PILO10071 ~ 73) = the control oil while the turbine is reset (36.PNG 163.2 ~ 163.7), 0 tripped; |
| `src/analog/engine/tcs.js:944` | diesel oil package data (ALLWEILER curves, M&S BMS) | cooler inlet      TILO1001 = the cooler outlet (TICLO1002 PV, ABC-053) + 16 C x speed / 3600 (36.PNG 62 / 46 C) with lube oil; |
| `src/analog/engine/tcs.js:945` | design doc by system (document-references/INDEX.md); else mass / energy balance | bearing outlet    TIGE1007 / 1008 = the cooler outlet + 9 / 10 C x speed / 3600 (36.PNG 55 / 56 C); |
| `src/analog/engine/tcs.js:1058` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | /* the oil state: the TCS model (U.tc, start-up / shutdown) or, at the "Start at 150 MW" snapshot (no TCS model, U.tc null), an oil-only |
| `src/analog/engine/tcs.js:1059` | pump data sheets + curves (vendor), P&ID line sizes | state in service (36.PNG: MOP-A / COP-A running, B in AUTO, vapour extractor running) so the 036 page and its pumps work there too */ |
| `src/analog/engine/tcs.js:1126` | diesel oil package data (ALLWEILER curves, M&S BMS) | /* COP suction = the lube oil header (36.PNG): no lube oil, no control oil */ |
| `src/analog/engine/tcs.js:1154` | design doc by system (document-references/INDEX.md); else mass / energy balance | 1VEST10011 / 12, 10021 / 22, 1VEGE10011 / 12, 10021 / 22 (X / Y), 0 ~ 0.4 mm. 3.2.1: the values at speed from snapshot P35SHAFT |
| `src/analog/engine/tcs.js:1155` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | (035 SHAFT MONITOR, 3596 rpm, 130 MW) with the lube oil after the cooler 46 C (36.PNG TILO10021 / 22): bearing metal No.1 / 2 / 3 / 4 |
| `src/analog/engine/compile-step.js:68` | design doc by system (document-references/INDEX.md); else mass / energy balance | taken as 10 % OF the SV span (10 + 0.1 x 90 = 19 %): the operator could not go below 19 %, while the HMI snapshot |
| `src/analog/engine/compile-step.js:69` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | 39.PNG shows 11.0 % and PR-OPE-5003 puts the RH damper to 10 % after the turbine trip. A bias station in % with a |
| `src/analog/engine/compile-step.js:307` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | = 67.5 %, 4.PNG 68.3). Before, the T/H value went in as %: at 45 MW the boiler master read 33.6 % for 36 T/H of coal, its |
| `src/analog/engine/compile-step.js:1151` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | turbine master PV EIC-TM.PV was 0 MW (33.PNG: 148.6 MW) */ |
| `src/analog/engine/source.js:3` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | middle of the range + effect of the MV, anchored at the 150 MW snapshot), so a loop whose process medium is not there still |
| `src/analog/engine/source.js:100` | design doc by system (document-references/INDEX.md); else mass / energy balance | pressure (it was 4.5 kg/cm2 there, the heat balance gives 0.88 g). Its transmitter PT-TS1022 (ABC-056 AI0562, snapshot 1.29) keeps |
| `src/analog/engine/source.js:102` | design doc by system (document-references/INDEX.md); else mass / energy balance | steam through the stages below it, Stodola), less the atmosphere 1.033: 5.34 kg/cm2 g at 458.3 T/H (snapshot PITS1017 5.3 at |
| `src/analog/engine/source.js:105` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | /* 3.2.3 SOHEE: through the extraction no. 3 shut-off MOV MV-TS1003 (DITL-96; flow diagram PD-013 extraction 3 -> deaerator; 02.png ZT-TS1003 100.4 % |
| `src/analog/engine/source.js:127` | fan spec + FLOW CURVE (fan-instruction-manual-SAF-PAF-IDF.pdf); FHI P5 air & flue gas | so it follows the SA flow (the purge SA 25 % gives less than the full-load SA of the snapshot), not only the SA fan running */ |
| `src/analog/engine/source.js:133` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | curve goes through the 150 MW snapshot (7.PNG: FIFA1081 213.0 T/H at PIFA1085 1427, FIFA1071 354.0 at PIFA1075 1551) with the square |
| `src/analog/engine/source.js:150` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | /* TT-MS1022 is on the cold reheat side of the HP bypass: it also sees the HP turbine exhaust (03.png: 357.5 C at 150 MW with the |
| `src/analog/engine/source.js:152` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | snapshot 136 C with the LP bypass shut) */ |
| `src/analog/engine/source.js:156` | design doc by system (document-references/INDEX.md); else mass / energy balance | /* 3.2.3 SOHEE: the sootblower header is fed from the S/H panel #1 outlet through the shut-off MOV MV-SB1001 (DITL-80S, 18.PNG: 0 %, |
| `src/analog/engine/source.js:175` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | deaerator", 4.PNG 100 %): its pressure is not below the extraction pressure, whatever the pegging steam valve does (the pegging |
| `src/analog/engine/source.js:176` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | PIC holds SV 1.5 only at low load). Extraction no. 3 pressure 5.30 kg/cm2 at 148.8 MW (4.PNG PITS1017), proportional to the turbine |
| `src/analog/engine/source.js:177` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | steam (beta.326: the heat balance line above); 5.png DEAERATOR PV 5.9 */ |
| `src/analog/engine/state.js:32` | design doc by system (document-references/INDEX.md); else mass / energy balance | /* an entry of a table of the HMI snapshot (a plant model points at its anchor AN_HMI_OP[tag]) and the FROM of a DITL link of the |
| `src/analog/engine/state.js:113` | design doc by system (document-references/INDEX.md); else mass / energy balance | /* an array may carry named fields too (unit.js: a list of transmitters with its snapshot a0) */ |
| `src/analog/engine/unit.js:23` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | - steam per coal a and MW per steam c: the two loads of the snapshots (4.PNG / 03.png about 150 MW: coal 88.6 T/H, |
| `src/analog/engine/unit.js:24` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | MSF 474.1 T/H, 150.5 MW; 02.png: coal 41.8 T/H, MSF 203.7 T/H, 60.3 MW); |
| `src/analog/engine/unit.js:44` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | tauMW: 10 /* s, steam flow -> MW (reheater, NO-SOURCE: the plant trends are 60 s averages, too slow to fit it) */, |
| `src/analog/engine/unit.js:54` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | at MCR; 02.png: 15.0 kg/cm2 at 203.7 T/H, 4.PNG 34.0 at 474 T/H: 34.0 x 203.7 / 474 = 14.6). The HP bypass PCV-MS1020 |
| `src/analog/engine/unit.js:59` | FHI P2S7 (SH / RH temp, spray curves), P4 SH/RH; K1AU3-B-0-004 | (ABC-011 TICBR1130, ABC-012 TICBR1150, ABC-019 TICHR1002) see a load disturbance: at 60 % MCR the spray of the snapshot is |
| `src/analog/engine/unit.js:60` | design doc by system (document-references/INDEX.md); else mass / energy balance | all closed and the temperature is still at the set point; below 60 % the temperature falls, by the slope of the snapshots |
| `src/analog/engine/unit.js:61` | FHI P2S7 (SH / RH temp, spray curves), P4 SH/RH; K1AU3-B-0-004 | (02.png at 203.7 T/H = 44 % MCR: MST 517 C, RHT 499 C; 4.PNG 542 / 542): the drop is linear in load (ASSUMED). |
| `src/analog/engine/unit.js:65` | FHI CFB manual P2S7 design data + curves vs load; P5; mass balance K1AU3-A2-0-001 | FT-FA1081, FT-FA1055), stoichiometric air per T/H of coal AN_GAS.afs (boiler.js, FHI Tab 3); it replaced the anchor (O2 4.3 % at the snapshot air and coal: excess air |
| `src/analog/engine/unit.js:92` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | tracks GEN. MW (TCE p.134), so at OFF the TCS holds the load it has. These inputs are written by the model in every plant state (3.2.5-beta.8; before only in a start-up, U.cold); the snapsho |
| `src/analog/engine/unit.js:204` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | could not make more than about 300 T/H (about 113 MW). CALC: steam made at 150 MW = 484 T/H main steam (plant trends 2026-11-08, |
| `src/analog/engine/unit.js:214` | design doc by system (document-references/INDEX.md); else mass / energy balance | (Tb - 30), the 954 / 850 snapshot ratio): lag 1.9 h at 1.5 h, 2.6 h at 4 h -> 9000 s; the trend outranks the design curve */ |
| `src/analog/engine/unit.js:253` | design doc by system (document-references/INDEX.md); else mass / energy balance | /* x: one value for every block, or a function of the index (2.2.0-beta.11: each transmitter keeps its own offset of the snapshot) */ |
| `src/analog/engine/unit.js:284` | design doc by system (document-references/INDEX.md); else mass / energy balance | U.etLvl = NaN; /* 3.2.0-beta.63: the expansion tank starts again at its level of 27.PNG (AN_MU) */ |
| `src/analog/engine/unit.js:385` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | /* the demand to the TCS: SI0236 = MW demand + pressure correction LN55 (ABC-001C). On the snapshots the turbine master EIC-TM is |
| `src/analog/engine/unit.js:540` | design doc by system (document-references/INDEX.md); else mass / energy balance | /* 3.2.3-beta.265: the plant trend ~1465 (AN_BI), the two transmitters 6 mmH2O apart as on the snapshot (1426 / 1432) */ |
| `src/analog/engine/unit.js:661` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | the snapshots show it at 0.1 % M at 150 MW */ |
| `src/analog/engine/unit.js:676` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | /* 3.2.0-beta.39 (roadmap 2, HMI thread: in Cold, all fans stopped, the air preheater outlet kept the 150 MW snapshot): the air |
| `src/analog/engine/unit.js:679` | fan spec + FLOW CURVE (fan-instruction-manual-SAF-PAF-IDF.pdf); FHI P5 air & flue gas | of the SA flow FT-FA1081 (fan law). The ID fan speed ST-LO1756 (ABC-008 AI0481, no value in the snapshots) is the hydraulic |
| `src/analog/engine/unit.js:681` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | 3.2.3-beta.104 (plan b3, ID fan cold start): the curve goes through the 150 MW snapshot 7.PNG "HYDRAULIC COUPLING (IDF) 46.1 % / |
| `src/analog/engine/unit.js:683` | design doc by system (document-references/INDEX.md); else mass / energy balance | (ASSUMED), which read 714 rpm at the snapshot MV */ |
| `src/analog/engine/unit.js:700` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | /* ---- 3.2.0 roadmap 3 (starting points: Cold = a cold plant, not the 150 MW snapshot) and the P1 fix queue of |
| `src/analog/engine/unit.js:710` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | /* temperatures that kept the 150 MW snapshot in a cold plant (roadmap 3), each written from the model with the metal lag: |
| `src/analog/engine/unit.js:714` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | - TT-HR1004 hot reheat (ABC-052): the reheater outlet, PV of TICHR1002 (TT-HR1002), with its own offset of the snapshot |
| `src/analog/engine/unit.js:742` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | /* TT-MS1022 at the anchor: the HMI snapshot TIMS10221 359 C (bypass shut: the HP exhaust it sees); the a0 of the start state is |
| `src/analog/engine/unit.js:743` | design doc by system (document-references/INDEX.md); else mass / energy balance | the old snapshot loop, not a plant reading */ |
| `src/analog/engine/unit.js:759` | fan spec + FLOW CURVE (fan-instruction-manual-SAF-PAF-IDF.pdf); FHI P5 air & flue gas | (actuator lag tauZT, ASSUMED 3 s); before, it kept the snapshot (ZT-FA1053-1 35 % with the damper shut in a cold plant) */ |
| `src/analog/engine/unit.js:868` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | /* 3.2.0-beta.68: "Start at 150 MW" = the air compressors in service, the tanks at their pressure (AN_AIR, 39.PNG 7.0 kg/cm2) */ |
| `src/analog/engine/unit.js:885` | diesel oil package data (ALLWEILER curves, M&S BMS) | U.tco = null; /* 3.2.0-beta.66: the oil-only state of the snapshot (tcs.js tcsOilState) starts again */ |
| `src/analog/engine/unit.js:887` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | null; /* 3.2.0-beta.38: the snapshot of "Start at 150 MW": the TCS model only in a start-up / shutdown (Cold, warm, hot, live) */ |
| `src/analog/engine/unit.js:888` | pump data sheets + curves (vendor), P&ID line sizes | /* 3.2.0-beta.14: the snapshot plant has its diesel oil pump in service (source.js field equipment) */ |
| `src/analog/engine/unit.js:1104` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | /* 3.2.0-beta.66: the 036 TURBINE OIL pumps at the 150 MW snapshot (no TCS model): the oil-only state of tcs.js */ |
| `src/analog/engine/unit.js:1311` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | Condenser water  in: 28.5 / 28.6 C (snapshot 30.PNG); rise = 5.6 C x (condenser steam / 316 T/H) x (31,500 T/H / seawater flow) |
| `src/analog/engine/unit.js:1425` | design doc by system (document-references/INDEX.md); else mass / energy balance | /* SWBP efficiency: a plain function, a function kept in K.c does not cross the Worker snapshot (Mina beta.103, c.eb is not a function) */ |
| `src/analog/engine/unit.js:1739` | pump data sheets + curves (vendor), P&ID line sizes | strainer DP  0.03 kg/cm2 while its pump runs (28.png DPIMU0709A / B / C 0.029 / 0.042 / 0.001; no strainer curve: NO-SOURCE shape); |
| `src/analog/engine/unit.js:1740` | design doc by system (document-references/INDEX.md); else mass / energy balance | demi tanks   the snapshot level, constant (the water treatment refills them; not modelled); LS-MU0708-A / B (alarm list 0.2 m, |
| `src/analog/engine/unit.js:1759` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | /* UNUSUAL (docs/versions/v3.2.1/DATA_ANSWERS.md item 6): the vendor BHP curve gives ~26 A at the recirculation flow, the snapshot |
| `src/analog/engine/unit.js:1876` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | line         ONE design point = HMI snapshot 27.PNG (148 MW, ACWP-A): PICW1152 6.4, PICW1153 5.2 kg/cm2, expansion tank 0.80 m, at |
| `src/analog/engine/unit.js:1877` | pump data sheets + curves (vendor), P&ID line sizes | the rated 1500 m3/h (= 2 CCWHE x 750 m3/h of D1-0-041; the ACWP current there, 26.8 A, is the snapshot's 28.2 A |
| `src/analog/engine/unit.js:1881` | design doc by system (document-references/INDEX.md); else mass / energy balance | strainer DP  0.27 kg/cm2 at 1500 m3/h (27.PNG), x (Q / 1500)^2; |
| `src/analog/engine/unit.js:1885` | design doc by system (document-references/INDEX.md); else mass / energy balance | 28.5 C, 2 SWBP): 7.2 % of the clean UA (UNUSUAL: fouled plates, or the snapshot heat load is not the design one); |
| `src/analog/engine/unit.js:1887` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | heat load    3,480 kW x (0.4 + 0.6 x load / 150 MW) (27.PNG 3,452 kW at 148 MW; the 40 / 60 split NO-SOURCE, as 3.2.0-beta.69); |
| `src/analog/engine/unit.js:2061` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | stopped (NO-SOURCE: the metal mass is not in the spec). 16.PNG (all four stopped at 150 MW): ash 31 ~ 55 C, water 36 ~ 38 C. |
| `src/analog/engine/unit.js:2064` | FHI P2S7 (SH / RH temp, spray curves), P4 SH/RH; K1AU3-B-0-004 | temperature for both (NO-SOURCE: the shell / shaft split of the 3 kg/s is not in the spec); the inlet is TT-CW1156. LT-BH1750 bottom ash silo: silos stand in this simulator (scope 2026-11-07 |
| `src/analog/engine/unit.js:2113` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | snapshot     36.PNG (149 MW): oil in TILO1001 62 C, out 46 C; 27.PNG: TCV-CW1201 53.1 %, ACW supply 38 C; |
| `src/analog/engine/unit.js:2140` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | snapshot     28.png CP-A 28.1 A at 150 MW, PICD1117 16.9 kg/cm2; 4.PNG PICD1110 0.057 kg/cm2A, TICD11101 40.0 C; |
| `src/analog/engine/unit.js:2193` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | burning over tau): at 75 MW the PIC-COBM swing grew to an MFT in 110 min (the plant runs there with coal 47 ~ 51 T/H, plant trend). |
| `src/analog/engine/unit.js:2249` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | the plant (snapshot FIC-CM 87.0 T/H at 150 MW, model 83.5) */ |
| `src/analog/engine/unit.js:2257` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | - tbA 937 C: the bed, the average of the eighteen lower layer thermocouples TT-FG1090 / 1091 A ~ I of the HMI snapshot at 150 MW |
| `src/analog/engine/unit.js:2466` | FHI CFB manual P2S7 design data + curves vs load; P5; mass balance K1AU3-A2-0-001 | ~1630 at 100 %, low limit ~1450) and the HMI snapshot DPIFG1081 1426 / DPIFG1082 1432 (hmi-op.js). Before 265 the snapshot 1426 = 170 t. In: ash of the coal 6.82 % (T3), limestone less its C |
| `src/analog/engine/unit.js:2604` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | snapshot     03.png (150.5 MW): BFWP-A 289.4 A, PIFW1011 165.4 kg/cm2, DPIFW1115A 0.29 kg/cm2, feedwater 499.1 T/H; |
| `src/analog/engine/unit.js:2610` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | current = 289.4 A x shaft power / its power at 150 MW (snapshot ratio); strainer DP = 0.29 x (flow / 549)^2. */ |
| `src/analog/engine/unit.js:2650` | pump data sheets + curves (vendor), P&ID line sizes | /* the pump inlet = the suction header less its branch loss (strainer + line, 0.4 kg/cm2 at q0: 03.png, see anFwTagStep) */ |
| `src/analog/engine/unit.js:2838` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | valves       02.png (60 MW): No.3 LPH primary 32.4 % at FIQHD1103 7.7 T/H; No.2 LPH primary 99.9 % at FIQHD1102 3.4 T/H with its |
| `src/analog/engine/unit.js:2839` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | alternate 53.7 %; No.1 LPH primary 13.6 %. The HP valves have no snapshot in service (02.png: manual, 0.1 %). |
| `src/analog/engine/unit.js:2991` | design doc by system (document-references/INDEX.md); else mass / energy balance | the SV of its primary controller (snapshot SV, ABC-035 ~ 039). Before, it started from the transmitter, which the loop model of |
| `src/analog/engine/unit.js:2992` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | the drawing moved at the end of the load while the snapshot MV of 02.png (60 MW, LCV-HD1102 99.9 %) was on it: LPH2 -5 -> -97 mm, |
| `src/analog/engine/unit.js:3020` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | /* "Start at 150 MW": the snapshot has no drain valve opening at full load (02.png is 60 MW), so the primary controller starts at the |
| `src/analog/engine/unit.js:3037` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | /* Mina F14: the alternate starts where the primary puts it. It kept its 60 MW snapshot opening (02.png 53.7 %): the No.2 LP heater drained at |
| `src/analog/engine/unit.js:3088` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | the load share; no pipe loss to the deaerator (02.png 94 / 93 C). */ |
| `src/analog/engine/unit.js:3167` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | HMI snapshot of the plant at 150 MW (hmi-op.js AN_HMI_AI) where a share is needed: |
| `src/analog/engine/unit.js:3169` | design doc by system (document-references/INDEX.md); else mass / energy balance | loses about the same heat at any flow, so the drop goes with 1 / flow: 542 - 538 = 4 C at MCR 472.7 T/H (snapshot), |
| `src/analog/engine/unit.js:3175` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | 0.7 kg/cm2 at MCR (snapshot), the reheat flow = HP exhaust + HP bypass (U.ms + U.mhp). Design beside it: FHI Tab 3 |
| `src/analog/engine/unit.js:3184` | FHI CFB manual P2S7 design data + curves vs load; P5; mass balance K1AU3-A2-0-001 | taps, its weight a share of the bed inventory (U.bedI / AN_BI.t0): 533 + 82 = 615 and 308 + 84 = 392 mmH2O (snapshot). |
| `src/analog/engine/unit.js:3186` | FHI P2S7 (SH / RH temp, spray curves), P4 SH/RH; K1AU3-B-0-004 | ash silos): the snapshot 4.56 / 3.65 / 3.89 m. |
| `src/analog/engine/unit.js:3262` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | Sources: 28.png (151.3 MW, MSF 480.3 T/H): hotwell TT-CD1110-1 / -2 40, flash chamber TT-CD1110-4 42, TT-CD1118 40, ejector condenser |
| `src/analog/engine/unit.js:3264` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | MANUAL); 02.png (60 MW): FT-CD1122 165.4 T/H, PT-CD1122 3.8 with PT-CD1104 2.2 kg/cm2, TT-CD1104 131 C; IO list FT-CD1115 0 ~ 46 T/H. |
| `src/analog/engine/unit.js:3265` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | TT-CD1119     hotwell + half of the ejector / gland steam condenser rise of AN_LP (28.png: 40 -> 41 -> 42 C, half each); |
| `src/analog/engine/unit.js:3268` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | PT-CD1122     deaerator pressure PT-CD1104 + 1.6 kg/cm2 (02.png 3.8 - 2.2; NO-SOURCE: kept the same at every flow, the water column to |
| `src/analog/engine/unit.js:3270` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | TT-CD1104     the storage tank water at the saturation of the deaerator pressure PT-CD1104 (02.png 131 C with 2.2 kg/cm2 = sat 135.6 C: |
| `src/analog/engine/unit.js:3302` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | 4.PNG (004 EXTRACTION STEAM, 148.8 MW, MSF 472.7 T/H): PT-TS1013 (No.2 extraction) 14.07, PT-TS1017 (No.3 extraction) 5.30 kg/cm2, |
| `src/analog/engine/unit.js:3304` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | 03.png (003 MAIN WATER / STEAM, 150.5 MW, MSF 474.1): PIFW1011 165.4, drum PIBR10011 134.2, PIBR1130 (after SH panel #1) 127.8, |
| `src/analog/engine/unit.js:3307` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | 5.png (005 REHEATER STEAM, 152.5 MW, MSF 482.2): TCV-FW1150 66.0 % AUTO, XV-FW1151 open, FIQFW1149 14.8 T/H; |
| `src/analog/engine/unit.js:3315` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | PT-TS1013 / 1017   the snapshot pressure x main steam / 472.7 (absolute, a turbine stage, as AN_HP); |
| `src/analog/engine/unit.js:3317` | design doc by system (document-references/INDEX.md); else mass / energy balance | PT-TS1026          (beta.33) the same stage law from 0.25 kg/cm2 g (4.PNG PITS1026, STN102 AI0563, range -1 ~ 5); |
| `src/analog/engine/unit.js:3318` | design doc by system (document-references/INDEX.md); else mass / energy balance | TT-TS1014 / 1018 / 1023 / 1027  (beta.33) 4.PNG 426 / 314 / 188 / 91 C: with the stage pressure ratios fixed (Stodola), the |
| `src/analog/engine/unit.js:3322` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | reheat pressure x 36.6 / 35.1, the Pcr of the bypass model (snapshots 35.4 ~ 36.1 at 150 MW); |
| `src/analog/engine/unit.js:3326` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | TT-FW1011          the deaerator water: saturation of PT-CD1104 (the pump heating not modelled; 03.png 162 C); |
| `src/analog/engine/unit.js:3327` | FHI P2S7 (SH / RH temp, spray curves), P4 SH/RH; K1AU3-B-0-004 | PT-FW1160          drum pressure + 3.5 kg/cm2 x (feedwater / 499.1)^2 (03.png 137.7 - 134.2); |
| `src/analog/engine/unit.js:3330` | FHI P2S7 (SH / RH temp, spray curves), P4 SH/RH; K1AU3-B-0-004 | points; spray point = drum - 6.4 / 9.3 kg/cm2 x (main steam / 474.1)^2 (03.png); 0.7674 from item 19 COND 1. The |
| `src/analog/engine/unit.js:3336` | design doc by system (document-references/INDEX.md); else mass / energy balance | capacity taken as the IO range; 4.PNG 1.8 T/H at 0.1 % with the block valve closed is not modelled). |
| `src/analog/engine/unit.js:3346` | design doc by system (document-references/INDEX.md); else mass / energy balance | ABC-030       PIC-AS1005 MV -> F(X) LN17 (valve 1) / LN16 (valve 2) (29.PNG MV 4.2 -> 0.1 / 32.2 %; the F(X) gives 0 / 32.3); |
| `src/analog/engine/unit.js:3347` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | 29.PNG 150 MW condenser 0.056 / 0.053 / 0.053 kg/cm2A, hood 38 / 38 / 37 C (= the saturation of the condenser: wet steam on load); |
| `src/analog/engine/unit.js:3355` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | gland header (in service: the TCS gland sealing, or a turbine on load): 0.32 kg/cm2 = 29.PNG; the steam seal feed valve |
| `src/analog/engine/unit.js:3358` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | NO-SOURCE (no load curve in the docs): from no load (fed from the aux steam header, TT-AS1015 = TT-AS1003) to 150 MW (self-sealing, 29.PNG) |
| `src/analog/engine/unit.js:3437` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | spills the surplus on load), split at 0; set point 0.32 kg/cm2 G (29.PNG 150 MW; the feed valve sheet NOR outlet |
| `src/analog/engine/unit.js:3440` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | reheat pressure (CALC: 2694 kg/h at 150 MW = the glands 2243 + the unloading valve 451 at 42.6 %, 29.PNG); volume |
| `src/analog/engine/unit.js:3501` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | (not in the docs). Two numbers are set by 29.PNG at 150 MW (not a fit of a curve, the one unknown of each balance): |
| `src/analog/engine/unit.js:3510` | FHI P2S7 (SH / RH temp, spray curves), P4 SH/RH; K1AU3-B-0-004 | UA3: 0.131 /* kW/K, 29.PNG: the SJAE steam 397 kg/h of cold reheat at 347 C after PCV-AS1020 holds 236 C (the other header users are not modelled yet) */, |
| `src/analog/engine/unit.js:3513` | design doc by system (document-references/INDEX.md); else mass / energy balance | G17: 0.0433 /* kW/K, 29.PNG (see above) */, |
| `src/analog/engine/unit.js:3748` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | ts26: 0.25 /* PT-TS1026 No.5 extraction, 4.PNG */, |
| `src/analog/engine/unit.js:3749` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | ext: { "TT-TS1014": 426, "TT-TS1018": 314, "TT-TS1023": 188, "TT-TS1027": 91 } /* 4.PNG at 148.8 MW, C */, |
| `src/analog/engine/unit.js:3750` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | hr0: 540 /* TIHR1004 hot reheat of the same snapshots (OPERATING_POINTS.md), the anchor of the extraction temperatures */, |
| `src/analog/engine/unit.js:3988` | fan spec + FLOW CURVE (fan-instruction-manual-SAF-PAF-IDF.pdf); FHI P5 air & flue gas | motor and fan bearings 1 ~ 4, windings U / V / W, vibration 1 ~ 4; the same NO-SOURCE running values as the IDF (no snapshot or |
| `src/analog/engine/unit.js:4127` | plant air compressor manual, dryer data | pressure     PR-OPE-5002 "Ensure Plant Air Compressor is running and compressed air pressure is up to 7 Kg/cm2"; 39.PNG 7.0; |
| `src/analog/engine/unit.js:4142` | plant air compressor manual, dryer data | per compressor (the MB operating point has 2 running: 10200 / 3000; the SOP and the snapshot have 1); IA power at full |
| `src/analog/engine/unit.js:4670` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | 176.5 MVA, 0.85 lag, 13.8 kV, 60 Hz, 3600 rpm, Xd unsaturated 1.99 pu) and snapshot 37.PNG (151.1 MW: 33.1 MVar, power factor 0.977, |
| `src/analog/engine/unit.js:4673` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | voltage E = \|1 + j Xd I\| (calculated with the data sheet Xd, no saturation), scaled to the snapshot point (E = 2.19 pu at 151.1 MW |
| `src/analog/engine/unit.js:4677` | design doc by system (document-references/INDEX.md); else mass / energy balance | and the 60 s averages of the plant trends), Pe = the house load (elec.js). On the grid (52L1 closed) the grid holds 3600 rpm (the |
| `src/analog/engine/unit.js:4695` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | pressure swings as on the plant (plant trend SCENARIO 1 A, 150 MW hold: MW sd 0.43, MW / MSF correlation 0.86, MW / MSP 0.40). With the |
| `src/analog/engine/unit.js:4848` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | /* 3.2.1: the generator temperatures of pages 13 / 17 from snapshot P35SHAFT (035 SHAFT MONITOR, 130 MW, 3596 rpm): air cooler outlet |
| `src/analog/engine/unit.js:4850` | plant air compressor manual, dryer data | The stator copper loss goes with the current squared: stator = cooler air (mean 41) + its snapshot rise x (kA / 5.57)^2, 5.57 kA = |
| `src/analog/engine/unit.js:4901` | design doc by system (document-references/INDEX.md); else mass / energy balance | over the plant alarm list (AT-SP1011 H 9.5, AT-SP1012 H 10 uS/cm; snapshot AISP1012 4.6 uS/cm). The plant runs its |
| `src/analog/engine/unit.js:4902` | design doc by system (document-references/INDEX.md); else mass / energy balance | phosphate inside its own alarm limits: 2 ppm = pH 9.08, 7.6 uS/cm (NO-SOURCE: the plant PO4 is not in a snapshot; the |
| `src/analog/engine/unit.js:4903` | plant air compressor manual, dryer data | snapshot pair pH 9.5 / 4.6 uS/cm cannot be one water: OH- alone at pH 9.5 and 25 C is 6.3 uS/cm). |
| `src/analog/engine/unit.js:4923` | design doc by system (document-references/INDEX.md); else mass / energy balance | pH 9.0 (snapshot 3.8 = pH 9.15). |
| `src/analog/engine/unit.js:4979` | design doc by system (document-references/INDEX.md); else mass / energy balance | Total 3882 kg of steam for one cycle of the whole set. The tags by location: page MK15 (snapshot 18.PNG) draws N-1011 / 1012 above |
| `src/analog/engine/unit.js:4984` | design doc by system (document-references/INDEX.md); else mass / energy balance | outlet through MV-SB1001 and PCV-SB1053, 18.PNG): no header pressure, no steam. Below its head pressure a blower passes less: critical |
| `src/analog/engine/unit.js:4988` | design doc by system (document-references/INDEX.md); else mass / energy balance | starts it (the lances start retracted, 18.PNG). NO-SOURCE: the header pressure drop under the flow (PCV-SB1053 has no Cv in the docs); |
| `src/analog/engine/unit.js:5014` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | temperature with the lag tauH; without steam they go back to their rest value with tauC. Rest: 18.PNG (149.8 MW, MV-SB1001 shut) |
| `src/analog/engine/unit.js:5115` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | passing 3 % of the MCR flow, source.js). Without steam the line goes to its rest value: snapshot (150 MW, XV-HR1010-1 closed in |
| `src/analog/engine/unit.js:5116` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | MANUAL, PCV-HR1010 1.3 %), TT-HR1010 228 C (5.png 005 REHEATER STEAM, 152.5 MW), scaled to the ambient with the boiler water |
| `src/analog/engine/unit.js:5346` | design doc by system (document-references/INDEX.md); else mass / energy balance | 2026-11-08 plant trends) and its lag tauF are gone */ |
| `src/analog/engine/unit.js:5366` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | /* an ATS program that began at a trip from Start 150 MW: the snapshot keeps the vacuum as at load, not through the start-up ejector line-up */ |
| `src/analog/engine/unit.js:5438` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | /* the TCS is always there on the real unit (Hitachi HIACS, its own controllers): at the Start at 150 MW snapshot / its save points the |
| `src/analog/engine/unit.js:5439` | pump data sheets + curves (vendor), P&ID line sizes | TCS state is the in-service one (oil pumps of the snapshot carried over, ATS step 7 NORMAL OPERATION), so AN.tcs(), the governor and |
| `src/analog/engine/unit.js:5490` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | /* DCS control mode ON (CCS, 33.PNG): the TCS follows the turbine master of the DCS (EIC-TM output, AO0359 TO TCS; in AUTO it is |
| `src/analog/engine/unit.js:5678` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | thermocouples TT-FG1090 / 1091 A ~ I average 937 C at 150 MW (HMI snapshot, hmi-op.js; trend scenario 1 TIFG1090 952 ~ 962 C), |
| `src/analog/engine/unit.js:5762` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | TIFG1009 furnace) follow the bed: ambient + (snapshot - ambient) x bed rise / anchor bed rise. Before, they kept the 150 MW |
| `src/analog/engine/unit.js:5763` | FHI CFB manual P2S7 design data + curves vs load; P5; mass balance K1AU3-A2-0-001 | snapshot (933 C) in Cold: ABC-027 SI0122 > 700 C = M.2504 "ADEQUATE FOR COAL FIRING (PURGE BY-PASS)" was 1 on a cold boiler, |
| `src/analog/engine/unit.js:5766` | FHI CFB manual P2S7 design data + curves vs load; P5; mass balance K1AU3-A2-0-001 | thermocouple): the anchor of the thermocouples is the bed the snapshot thermocouples read (the average of the eighteen lower layer |
| `src/analog/engine/unit.js:5768` | FHI CFB manual P2S7 design data + curves vs load; P5; mass balance K1AU3-A2-0-001 | snapshot spread; one bed for the overview, the logic (ABC-026 alarms 950 / 980 / 820) and the pages */ |
| `src/analog/engine/unit.js:5792` | FHI CFB manual P2S7 design data + curves vs load; P5; mass balance K1AU3-A2-0-001 | SU 4954-5090): 600 = the bed back pressure at the anchor bed DP (DPIFG1081 1426 mmH2O, 7.PNG), read from the bed model (U.bedK = bed DP |
| `src/analog/engine/unit.js:5952` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | the 6.4 / 2.2 % of one snapshot has no source, it stood the B side on LOW-LOW at 150 MW */ |
| `src/analog/engine/unit.js:5970` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | /* only a running cooler takes ash out (DITL-21A and its instances); 16.PNG: all four stopped at 150 MW */ |
| `src/analog/engine/unit.js:5991` | design doc by system (document-references/INDEX.md); else mass / energy balance | plenum / lower (DPT-FG1084 / 1184) loses what is lifted. Anchors: the HMI snapshot 1016 / 1014 and 70 / 41 mmH2O (hmi-op.js). |
| `src/analog/engine/unit.js:6133` | design doc by system (document-references/INDEX.md); else mass / energy balance | is an energy balance, not the snapshot loop gated by 3 % of the MCR flow (source.js R.TICMS1022). The main steam (PT-MS1006 |
| `src/analog/engine/unit.js:6137` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | HP exhaust (snapshot 359 C at 150 MW with the bypass shut), mixed by their steam; no steam = the pipe cools to the room */ |
| `src/analog/engine/unit.js:6201` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | /* 3.2.1 (IRENE: HP HEATERS): the outlet of the No.2 HPH of the heater model (anHphStep), 03.png TIFW1106 243 / TIFW1160 244 C */ |
| `src/analog/engine/boiler.js:20` | design doc by system (document-references/INDEX.md); else mass / energy balance | header   snapshot 6.PNG: PIDO0005 12.8 kg/cm2 with PCV-DO0002 24.2 %, PIDO1008 11.0 with FCV-DO1012 100.1 % and PCV-DO1009 85.7 %, |
| `src/analog/engine/boiler.js:40` | design doc by system (document-references/INDEX.md); else mass / energy balance | /* 3.2.3: the split at 6.PNG from the two valve sheets (K1AU3-E2-0-123 p218 PCV-DO0002 Cv 17.4 full open = 12.8, p228 FCV-DO1012 |
| `src/analog/engine/boiler.js:50` | design doc by system (document-references/INDEX.md); else mass / energy balance | return this.q6 / (0.857 * Math.sqrt(11.0)); /* PCV-DO1009, 6.PNG */ |
| `src/analog/engine/boiler.js:58` | design doc by system (document-references/INDEX.md); else mass / energy balance | dp0: 0.029 /* kg/cm2 strainer at 25 T/H, 6.PNG */, |
| `src/analog/engine/boiler.js:59` | design doc by system (document-references/INDEX.md); else mass / energy balance | I0: 25.4 /* A, P-0702A at 25 T/H x 12.8 kg/cm2, 6.PNG */, |
| `src/analog/engine/boiler.js:75` | design doc by system (document-references/INDEX.md); else mass / energy balance | L0: 4.978 /* m, 6.PNG */, |
| `src/analog/engine/boiler.js:191` | design doc by system (document-references/INDEX.md); else mass / energy balance | /* the tank: the level of the starting state (6.PNG 4.978 m) */ |
| `src/analog/engine/boiler.js:279` | design doc by system (document-references/INDEX.md); else mass / energy balance | /* the motors: current = no-load share + hydraulic share (Q x P), 25.4 A at 25 T/H and 12.8 kg/cm2 (6.PNG) */ |
| `src/analog/engine/boiler.js:312` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | Anchors: 7.PNG (151 MW) PAF 253.6 A, SAF 134.0 A, IDF 199.6 A, PIFA1075 1551 at FIFA1071 354.0, PIFA1085 1427 at FIFA1081 213.0, |
| `src/analog/engine/boiler.js:313` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | PIFG1141A / B -442 / -450, PIFG1151 -7, TAF 592.1 T/H; 9.png (150 MW) FA BLOWER-A 37.3 A, FIFA1055 26.3 T/H, PIFA1055A 3257 / |
| `src/analog/engine/boiler.js:315` | design doc by system (document-references/INDEX.md); else mass / energy balance | snapshot). */ |
| `src/analog/engine/boiler.js:318` | fan spec + FLOW CURVE (fan-instruction-manual-SAF-PAF-IDF.pdf); FHI P5 air & flue gas | /* beta.308 (JENNIE, Audit #5, PAF / SAF / IDF were fI 0.45 NO-SOURCE): the current at no air power, as a share of the snapshot current |
| `src/analog/engine/boiler.js:370` | design doc by system (document-references/INDEX.md); else mass / energy balance | current is anchored to the snapshot: I = 37.3 x I(m, p2) / I(26.3 T/H, 3,257). |
| `src/analog/engine/boiler.js:410` | fan spec + FLOW CURVE (fan-instruction-manual-SAF-PAF-IDF.pdf); FHI P5 air & flue gas | /* motor current: no-load share + the rest x air power over the snapshot one. Same law on the HMI (api.js fanI); the HMI fallback |
| `src/analog/engine/boiler.js:411` | design doc by system (document-references/INDEX.md); else mass / energy balance | passes only the snapshot current, so the share is found by it */ |
| `src/analog/engine/boiler.js:492` | fan spec + FLOW CURVE (fan-instruction-manual-SAF-PAF-IDF.pdf); FHI P5 air & flue gas | values the model already stands on (fan flows of the snapshot); the fault adds +1 x the design leak every 30 min (NO-SOURCE trainer |
| `src/analog/engine/boiler.js:503` | FHI CFB manual P2S7 design data + curves vs load; P5; mass balance K1AU3-A2-0-001 | the model gives a few mg/Nm3, the plant read 2.9 mg/m3 (7.PNG). The 6 % O2 dry correction of the guarantee is not applied (the |
| `src/analog/engine/boiler.js:547` | fan spec + FLOW CURVE (fan-instruction-manual-SAF-PAF-IDF.pdf); FHI P5 air & flue gas | the flow of the snapshot at the damper of the snapshot (9.png 26.3 T/H at 42.8 %), linear in the opening (NO-SOURCE) */ |
| `src/analog/engine/boiler.js:568` | fan spec + FLOW CURVE (fan-instruction-manual-SAF-PAF-IDF.pdf); FHI P5 air & flue gas | (snapshot flow at the snapshot damper, linear as the loop target above) with the 5 s of an air flow; the blower that just |
| `src/analog/engine/boiler.js:580` | plant air compressor manual, dryer data | the rest, so its air power follows its own flow at the head of the snapshot (9.png 37.3 A at 26.3 T/H). (beta.324: the blower |
| `src/analog/engine/boiler.js:583` | design doc by system (document-references/INDEX.md); else mass / energy balance | /* 3.2.3-beta.183 (SOHEE): the blower on its open silencer follows the same rule (own flow at the head of the snapshot). The cube of |
| `src/analog/engine/boiler.js:606` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | a share of the flow squared (the same rg as the ID fan suction), anchored on the HMI snapshot (hmi-op.js): air heater gas inlet |
| `src/analog/engine/boiler.js:609` | design doc by system (document-references/INDEX.md); else mass / energy balance | same system curve, 1444 / 1551 of it (snapshot / AN_FN.pa.P0) */ |
| `src/analog/engine/boiler.js:632` | FHI CFB manual P2S7 design data + curves vs load; P5; mass balance K1AU3-A2-0-001 | eco       colder feedwater takes more from the gas: the economizer cools the gas 43 C of the 120 C between gas in (365, snapshot |
| `src/analog/engine/boiler.js:709` | design doc by system (document-references/INDEX.md); else mass / energy balance | 1651 ppm if all of it became NO; the snapshot 7.PNG stack 69 ppm gives the conversion 69 / 1651 = 4.2 %, held |
| `src/analog/engine/boiler.js:716` | design doc by system (document-references/INDEX.md); else mass / energy balance | AT-FG1057-6  opacity by Beer-Lambert, b from the one plant reading 12.5 % at 2.9 mg/m3 (7.PNG). |
| `src/analog/engine/boiler.js:717` | FHI CFB manual P2S7 design data + curves vs load; P5; mass balance K1AU3-A2-0-001 | FT-FG1057-7  stack gas velocity: 21.5 m/s at the MCR wet gas 509,000 Nm3/h and 148 C (7.PNG, AN_SOX note), the actual volume |
| `src/analog/engine/boiler.js:750` | design doc by system (document-references/INDEX.md); else mass / energy balance | MCR (snapshot 148 - 146 = 2 C after the precipitator losses, which are not modelled). */ |
| `src/analog/engine/boiler.js:790` | FHI CFB manual P2S7 design data + curves vs load; P5; mass balance K1AU3-A2-0-001 | At rest 0.0 / 0.1 (snapshot 19.PNG, limestone feeding STOP, conveying air closed). Conveying air on: 0.8 kg/cm2 + |
| `src/analog/engine/boiler.js:822` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | 0.6; /* NO-SOURCE: the dispensing vessel above its LSL at the 150 MW start (19.PNG: feeding STOP, no filling) */ |
| `src/analog/engine/boiler.js:827` | design doc by system (document-references/INDEX.md); else mass / energy balance | L.silo = 69.4; /* 19.PNG LILM1800 69.4 % */ |
| `src/analog/engine/boiler.js:925` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | ("Peak Air Duration 55 seconds"); silo 50.1 % at 150 MW (20.PNG). Fill of the vessel 20 s (3.2.3-beta.58, was 15 s NO-SOURCE): the inlet |
| `src/analog/engine/boiler.js:949` | design doc by system (document-references/INDEX.md); else mass / energy balance | U.sd = { v: {}, sw: {}, m: 0, p: 0, silo: 50.1 /* 20.PNG LISD1800 */ }; |
| `src/analog/engine/boiler.js:1017` | generator data sheet GAE-2013-0136 R2, ETAP load flow | Mechanical conveyors (DITL-BA59 / BA60 rows by tag, no address): remote selectors MIL-x at REMOTE (16.PNG "R"), local emergency stop |
| `src/analog/engine/boiler.js:1024` | plant air compressor manual, dryer data | model (U.paP, 39.PNG 7.0 kg/cm2), ASSUMED: the transmitter's own air tank is charged at rest with no flow, so it stands at the |
| `src/analog/engine/boiler.js:1061` | design doc by system (document-references/INDEX.md); else mass / energy balance | /* chain conveyor L-1090: runs at load (16.PNG); from Cold on its ON COMMAND, DITL-BA68 output 5 */ |
| `src/analog/engine/boiler.js:1127` | FHI CFB manual P2S7 design data + curves vs load; P5; mass balance K1AU3-A2-0-001 | of the SOx control, 200 ppm (HMI snapshot 19.PNG ABC-005 AICFG10571 SV 200): k = ln(1822 / 200) / 2.715 = 0.814 (CALC). The bed lime |
| `src/analog/engine/boiler.js:1128` | FHI CFB manual P2S7 design data + curves vs load; P5; mass balance K1AU3-A2-0-001 | starts at the design Ca/S (z0). Was k 11 and z0 0.346, a fit to the snapshot 41 ppm with limestone STOP (not a document). |
| `src/world/world.js:1225` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | /* Mina beta.170: "Seawater pump A trip" tripped a pump that stands STOPPED at 150 MW (snapshot: SWP-A stopped R M, SWP-B 242.5 A and |
| `src/world/plantsw.js:258` | fan spec + FLOW CURVE (fan-instruction-manual-SAF-PAF-IDF.pdf); FHI P5 air & flue gas | waits for the sand silo venting fan F-1301 running, the same field contact as the sand drawings (boiler.js AN_SD fan; 20.PNG: stopped) */ |
| `src/world/plantsw.js:262` | fan spec + FLOW CURVE (fan-instruction-manual-SAF-PAF-IDF.pdf); FHI P5 air & flue gas | at REMOTE as the other local selectors of the ash handling (20.PNG F-1301 VENTING FAN "R") |
| `src/world/plantsw.js:264` | diesel oil package data (ALLWEILER curves, M&S BMS) | rows: < 60 %, > 80 %): the silo of the sand model (boiler.js AN_SD, LT-SD1800, 20.PNG 50.1 %) |
| `src/world/plantsw.js:273` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | /* 3.2.1 d1 (LISA): the sootblower positions from the lance travel of world.js (sbLance; Diamond Power N11639-SC1). 18.PNG (150 MW): all |
| `src/world/plantsw.js:278` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | heater blowers N-1040 / N-1042 (DITL-80K) have no travel data in the table: their reset positions stand at rest (18.PNG) */ |
| `src/world/plantsw.js:391` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | 1 = in service): 1.033 kg/cm2A (atmosphere) to 0.057 kg/cm2A (4.PNG PICD1110 at 150 MW) */ |
| `src/world/plantsw.js:472` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | the deaerator pressure plus the static head: low load PICD1104 2.2, PIFW1115B 4.0 (head 1.8 kg/cm2); 03.png 150 MW PIFW1115B 7.1 = |
| `src/digital/parts/03b-sim.js:242` | heat balance PPE-14-0725 / 0728 R1; HP/LP heater and condenser data sheets | /* 2.2.0-beta.3: the analog values of the sheet: what the user typed, over the 150 MW values of the HMI snapshots (s.av150, |

## CHECK and START (no action now)

- CHECK `src/analog/engine/plant.js:1168`
- CHECK `src/analog/engine/face-defaults.js:410`
- START `src/analog/engine/hmi-op.js:1`
- START `src/analog/engine/hmi-op.js:6`
- START `src/analog/engine/hmi-op.js:7`
- START `src/analog/engine/hmi-op.js:9`
- START `src/analog/engine/hmi-op.js:10`
- START `src/analog/engine/hmi-op.js:11`
- START `src/analog/engine/hmi-op.js:12`
- START `src/analog/engine/hmi-op.js:13`
- START `src/analog/engine/hmi-op.js:14`
- START `src/analog/engine/hmi-op.js:15`
- START `src/analog/engine/hmi-op.js:16`
- START `src/analog/engine/hmi-op.js:17`
- START `src/analog/engine/hmi-op.js:20`
- START `src/analog/engine/hmi-op.js:70`
- START `src/analog/engine/hmi-op.js:71`
- START `src/analog/engine/hmi-op.js:73`
- START `src/analog/engine/hmi-op.js:74`
- START `src/analog/engine/hmi-op.js:131`
- START `src/analog/engine/hmi-op.js:314`
- START `src/analog/engine/hmi-op.js:316`
- START `src/analog/engine/hmi-op.js:324`
- START `src/analog/engine/hmi-op.js:326`
- START `src/analog/engine/hmi-op.js:339`
- START `src/analog/engine/hmi-op.js:340`
- START `src/analog/engine/hmi-op.js:356`
- START `src/analog/engine/hmi-op.js:357`
- START `src/analog/engine/hmi-op.js:358`
- START `src/analog/engine/hmi-op.js:359`
- START `src/analog/engine/hmi-op.js:360`
- START `src/analog/engine/hmi-op.js:361`
- START `src/analog/engine/hmi-op.js:362`
- START `src/analog/engine/hmi-op.js:363`
- START `src/analog/engine/hmi-op.js:364`
- START `src/analog/engine/hmi-op.js:365`
- START `src/analog/engine/hmi-op.js:366`
- START `src/analog/engine/hmi-op.js:367`
- START `src/analog/engine/hmi-op.js:368`
- START `src/analog/engine/hmi-op.js:369`
- START `src/analog/engine/hmi-op.js:370`
- START `src/analog/engine/hmi-op.js:371`
- START `src/analog/engine/hmi-op.js:372`
- START `src/analog/engine/hmi-op.js:373`
- START `src/analog/engine/hmi-op.js:374`
- START `src/analog/engine/hmi-op.js:375`
- START `src/analog/engine/hmi-op.js:376`
- START `src/analog/engine/hmi-op.js:377`
- START `src/analog/engine/hmi-op.js:378`
- START `src/analog/engine/hmi-op.js:379`
- START `src/analog/engine/hmi-op.js:380`
- START `src/analog/engine/hmi-op.js:381`
- START `src/analog/engine/hmi-op.js:382`
- START `src/analog/engine/hmi-op.js:383`
- START `src/analog/engine/hmi-op.js:384`
- START `src/analog/engine/hmi-op.js:385`
- START `src/analog/engine/hmi-op.js:386`
- START `src/analog/engine/hmi-op.js:387`
- START `src/analog/engine/hmi-op.js:388`
- START `src/analog/engine/hmi-op.js:389`
- START `src/analog/engine/hmi-op.js:390`
- START `src/analog/engine/hmi-op.js:391`
- START `src/analog/engine/hmi-op.js:392`
- START `src/analog/engine/hmi-op.js:393`
- START `src/analog/engine/hmi-op.js:394`
- START `src/analog/engine/hmi-op.js:395`
- START `src/analog/engine/hmi-op.js:396`
- START `src/analog/engine/hmi-op.js:397`
- START `src/analog/engine/hmi-op.js:416`
- START `src/analog/engine/hmi-op.js:417`
- START `src/analog/engine/hmi-op.js:419`
- START `src/analog/engine/hmi-op.js:421`
- START `src/analog/engine/hmi-op.js:424`
- START `src/analog/engine/hmi-op.js:425`
- START `src/analog/engine/hmi-op.js:426`
- START `src/analog/engine/hmi-op.js:428`
- START `src/analog/engine/hmi-op.js:429`
- START `src/analog/engine/hmi-op.js:434`
- START `src/analog/engine/hmi-op.js:460`
- START `src/analog/engine/hmi-op.js:462`
- START `src/analog/engine/hmi-op.js:467`
- START `src/analog/engine/hmi-op.js:470`
- START `src/analog/engine/hmi-op.js:476`
- START `src/analog/engine/hmi-op.js:477`
- START `src/analog/engine/hmi-op.js:478`
- START `src/analog/engine/hmi-op.js:479`
- START `src/analog/engine/hmi-op.js:480`
- START `src/analog/engine/hmi-op.js:481`
- START `src/analog/engine/hmi-op.js:482`
- START `src/analog/engine/hmi-op.js:483`
- START `src/analog/engine/hmi-op.js:484`
- START `src/analog/engine/hmi-op.js:485`
- START `src/analog/engine/hmi-op.js:486`
- START `src/analog/engine/hmi-op.js:487`
- START `src/analog/engine/hmi-op.js:488`
- START `src/analog/engine/hmi-op.js:489`
- START `src/analog/engine/hmi-op.js:490`
- START `src/analog/engine/hmi-op.js:491`
- START `src/analog/engine/hmi-op.js:494`
- START `src/analog/engine/hmi-op.js:496`
- START `src/analog/engine/hmi-op.js:497`
- START `src/analog/engine/hmi-op.js:498`
- START `src/analog/engine/hmi-op.js:501`
- START `src/analog/engine/hmi-op.js:502`
- START `src/analog/engine/hmi-op.js:504`
- START `src/analog/engine/hmi-op.js:563`
- START `src/analog/engine/hmi-op.js:565`
- START `src/analog/engine/hmi-op.js:611`
- START `src/analog/engine/hmi-op.js:659`
- START `src/analog/engine/hmi-op.js:666`
- START `src/analog/engine/hmi-op.js:676`
- START `src/analog/engine/hmi-op.js:701`
- START `src/analog/engine/hmi-op.js:720`
- START `src/analog/engine/hmi-op.js:721`
- START `src/analog/engine/hmi-op.js:743`
- START `src/analog/engine/hmi-op.js:753`
- START `src/analog/engine/hmi-op.js:754`
- START `src/analog/engine/hmi-op.js:763`
- START `src/analog/engine/hmi-op.js:767`
- START `src/analog/engine/hmi-op.js:783`
- START `src/analog/engine/hmi-op.js:784`
- START `src/analog/engine/hmi-op.js:785`
- START `src/analog/engine/hmi-op.js:808`
- START `src/analog/engine/hmi-op.js:809`
- START `src/analog/engine/hmi-op.js:824`
- START `src/analog/engine/hmi-op.js:839`
- START `src/analog/engine/hmi-op.js:885`
- START `src/analog/engine/hmi-op.js:886`
- START `src/analog/engine/hmi-op.js:896`
- START `src/analog/engine/hmi-op.js:901`
- START `src/analog/engine/hmi-op.js:902`
- START `src/analog/engine/hmi-op.js:942`
- START `src/analog/engine/hmi-op.js:954`
- START `src/analog/engine/hmi-op.js:964`
- START `src/analog/engine/hmi-op.js:980`
- START `src/analog/engine/hmi-op.js:986`
- START `src/analog/engine/hmi-op.js:1092`
- START `src/analog/engine/hmi-op.js:1100`
- START `src/analog/engine/hmi-op.js:1104`
- START `src/analog/engine/hmi-op.js:1111`
- START `src/analog/engine/hmi-op.js:1135`
- CHECK `src/analog/engine/source.js:82`
- CHECK `src/analog/engine/unit.js:734`
- CHECK `src/analog/engine/unit.js:1760`
- CHECK `src/analog/engine/unit.js:1891`
- CHECK `src/analog/engine/unit.js:2176`
- CHECK `src/analog/engine/unit.js:3131`
- CHECK `src/analog/engine/unit.js:3266`
- CHECK `src/analog/engine/unit.js:3319`
- CHECK `src/analog/engine/unit.js:3324`
- CHECK `src/analog/engine/unit.js:3331`
- CHECK `src/analog/engine/unit.js:4265`
- CHECK `src/analog/engine/unit.js:4322`
- CHECK `src/analog/engine/unit.js:5010`
- CHECK `src/analog/engine/unit.js:5013`
- CHECK `src/analog/engine/unit.js:5920`
- CHECK `src/analog/engine/boiler.js:42`
- CHECK `src/analog/engine/boiler.js:332`
- CHECK `src/analog/engine/boiler.js:365`
- CHECK `src/analog/engine/boiler.js:369`
- CHECK `src/analog/engine/boiler.js:482`
- CHECK `src/analog/engine/boiler.js:705`
- CHECK `src/analog/engine/boiler.js:744`
- CHECK `src/analog/engine/sheets.js:214`
- CHECK `src/world/plantsw.js:271`
- CHECK `src/world/plantsw.js:471`
- START `src/world/ditl150.js:3`
- START `src/world/ditl150.js:5`
- START `src/world/ditl150.js:11`
- START `src/world/ditl150.js:13`
- START `src/world/ditl150.js:14`
- START `src/world/ditl150.js:16`
- START `src/world/ditl150.js:17`
- START `src/world/ditl150.js:19`
- START `src/world/ditl150.js:20`
- START `src/world/ditl150.js:21`
- START `src/world/ditl150.js:22`
- START `src/world/ditl150.js:23`
- START `src/world/ditl150.js:24`
- START `src/world/ditl150.js:35`
- START `src/world/ditl150.js:36`
- START `src/world/ditl150.js:40`
- START `src/world/ditl150.js:41`
- START `src/world/ditl150.js:42`
- START `src/world/ditl150.js:48`
- START `src/world/ditl150.js:53`
- START `src/world/ditl150.js:54`
- START `src/world/ditl150.js:55`
- START `src/world/ditl150.js:56`
- START `src/world/ditl150.js:57`
- START `src/world/ditl150.js:60`
- START `src/world/ditl150.js:61`
- START `src/world/ditl150.js:62`
- START `src/world/ditl150.js:63`
- START `src/world/ditl150.js:64`
- START `src/world/ditl150.js:65`
- START `src/world/ditl150.js:69`
- START `src/world/ditl150.js:71`
- START `src/world/ditl150.js:72`
- START `src/world/ditl150.js:73`
- START `src/world/ditl150.js:74`
- START `src/world/ditl150.js:75`
- START `src/world/ditl150.js:76`
- START `src/world/ditl150.js:77`
- START `src/world/ditl150.js:78`
- START `src/world/ditl150.js:79`
- START `src/world/ditl150.js:80`
- START `src/world/ditl150.js:81`
- START `src/world/ditl150.js:82`
- START `src/world/ditl150.js:84`
- START `src/world/ditl150.js:85`
- START `src/world/ditl150.js:86`
- START `src/world/ditl150.js:88`
- START `src/world/ditl150.js:89`
- START `src/world/ditl150.js:91`
- START `src/world/ditl150.js:92`
- START `src/world/ditl150.js:93`
- START `src/world/ditl150.js:95`
- START `src/world/ditl150.js:97`
- START `src/world/ditl150.js:98`
- START `src/world/ditl150.js:99`
- START `src/world/ditl150.js:100`
- START `src/world/ditl150.js:101`
- START `src/world/ditl150.js:102`
- START `src/world/ditl150.js:103`
- START `src/world/ditl150.js:104`
- START `src/world/ditl150.js:105`
- START `src/world/ditl150.js:106`
- START `src/world/ditl150.js:126`
- START `src/world/ditl150.js:132`
- START `src/world/ditl150.js:167`
- START `src/world/ditl150.js:185`
- START `src/world/ditl150.js:241`
- START `src/world/ditl150.js:242`
- START `src/world/ditl150.js:317`
- START `src/world/ditl150.js:458`
- START `src/world/ditl150.js:473`
- START `src/world/ditl150.js:601`
