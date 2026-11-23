# NO-SOURCE list (Full Audit 3 #5, step 1)

Made by AUDIT FIX : LISA, 2026-11-24 00:22 PHT, from main ae7e227 (app 1.0.0-beta.343). Read-only: no code changed.

Count: `grep -rn NO-SOURCE src --include=*.js` = 264 marks.

- **Open: 217** (a value in the code that still has no source)
- History: 22 (comment says the value WAS NO-SOURCE and is now sourced; nothing to do, the word can go at the next edit of that line)
- UI note: 22 (page comment that lists a signal the page does not show; not a value; listed at the end)
- Definition: 3 (the comment that explains the word itself)

Some open marks are two lines of one comment, so the number of values is a little lower than 217.

**User rule 2026-11-24 00:35 PHT (GO DESIGN):** the route of every mark is a design document or a physics derivation, never a plant snapshot (NN.PNG) or trend; those are a sanity check only. Where an open comment below cites a snapshot (for example "CALIBRATED on 6.PNG"), the snapshot is what must be replaced, not kept. The values that stand on a snapshot without the NO-SOURCE word are listed in `docs/audit/snapshot-values-list.md`.

## Open, by file

- `src/analog/engine/unit.js`: 146
- `src/analog/engine/boiler.js`: 24
- `src/analog/engine/tcs.js`: 11
- `src/analog/engine/tcs-gen.js`: 11
- `src/world/plantsw.js`: 7
- `src/analog/engine/plant.js`: 5
- `src/analog/engine/elec.js`: 4
- `src/analog/engine/hx.js`: 3
- `src/analog/engine/source.js`: 2
- `src/world/world.js`: 1
- `src/digital/parts/03b-sim.js`: 1
- `src/analog/engine/hmi-op.js`: 1
- `src/analog/engine/compile-step.js`: 1

Owner (HANDOFF 3): all of these except `src/world/plantsw.js` and `src/digital/parts/03b-sim.js` are engine files of LEADER : JENNIE; `unit.js`, `boiler.js`, `tcs*.js` stay locked until the coordinator gives a window.

## Open, by route

- **#6**: 11
- **PC doc**: 129
- **review**: 46
- **physics**: 31

- physics = derive from mass / energy balance or a textbook property and write the calculation beside the value (RULES 3.4, Q10).
- PC doc = needs a document that is only on the user PC (the coordinator batches these reads to the thread that holds the PC).
- #6 = fault rates of the Instructor faults; settled together with the Instructor decision.
- review = the comment alone does not say which; read the code at fix time.

Kind (first sort by the words of the comment; checked by hand when each batch is fixed): TRAINER 11, SETTING 7, OTHER 93, VOLUME 23, TIME 49, CURVE 26, SPLIT 8.

## Fix order (one engine file per PR, in the coordinator window)

1. `src/world/plantsw.js`, `src/digital/parts/03b-sim.js` (not locked).
2. physics items of `unit.js` and `boiler.js` (no PC needed).
3. PC doc items, after the PC reads come back.
4. `tcs.js`, `tcs-gen.js` with Jennie (TCS, #4).

## Open marks

| # | Where | Kind | Route | Doc to search / how | Comment (cut at 200 chars) |
|---|---|---|---|---|---|
| 1 | `src/world/world.js:1284` | TRAINER | #6 | fault rate of the Instructor faults; decided with the Instructor card | performance coal, FHI P2S7 Tab 2, rises to 40 %, NO-SOURCE trainer setting: rain on the coal yard). No DITL contact: the DCS has no |
| 2 | `src/world/plantsw.js:11` | SETTING | PC doc | instrument list / switch data sheets (set point, dead band) | (NO-SOURCE: no switch data sheet in the docs searched). */ |
| 3 | `src/world/plantsw.js:37` | SETTING | PC doc | instrument list / switch data sheets (set point, dead band) | the burner's regulator. Dead band 0.2 kg/cm2 (NO-SOURCE) */ |
| 4 | `src/world/plantsw.js:56` | OTHER | review | read the code block at fix time; pick physics or doc | 2 C / 0.5 mm/s (NO-SOURCE) */ |
| 5 | `src/world/plantsw.js:64` | OTHER | review | read the code block at fix time; pick physics or doc | NO-SOURCE). DITL-21B rows 27 / 28 (machine instances #B ~ #D for coolers B ~ D) FS-CW1060-x1 / x2 "BOTTOM ASH SCREW COOLER ... |
| 6 | `src/world/plantsw.js:65` | VOLUME | physics | volume / mass from pipe size and length (P&ID line list, piping isometric = PC doc) | COOLING WATER FLOW LOW" = the flow of the closed cooling loop below 150 m3/h (10 % of the 1,500 m3/h design: NO-SOURCE, the |
| 7 | `src/world/plantsw.js:121` | SETTING | PC doc | instrument list / switch data sheets (set point, dead band) | points are NO-SOURCE: no limit switch setting in the docs searched; the names say fully closed / fully opened) */ |
| 8 | `src/world/plantsw.js:266` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | command is on (DITL-BA63 outputs VIBRATING SCREEN-A / -B ON COMMAND); the delay of the motor contact is NO-SOURCE (none) */ |
| 9 | `src/digital/parts/03b-sim.js:692` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | 13 s. MV-AS1397 and MV-TS1400 are not in the valve list of the drawing (PDF p 3, 33 items): they keep 10 s (NO-SOURCE) */ |
| 10 | `src/analog/engine/plant.js:71` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | point fell. Feedwater flow loops (FICFW) take at most 5 s (NO-SOURCE for the exact time: the valve stroke is not in the docs) */ |
| 11 | `src/analog/engine/plant.js:331` | CURVE | PC doc | valve characteristic (Cv curve) or vendor curve; else derive (state the law) | linear up to the CEP capacity 520 T/H, NO-SOURCE above the valve sheet point, see 3.2.3-beta.25 below), make-up 14 % = the 25 T/H that leaves the drum (1.8 T/H per %), the deaerator |
| 12 | `src/analog/engine/plant.js:375` | VOLUME | physics | volume / mass from pipe size and length (P&ID line list, piping isometric = PC doc) | Hotwell: its plan area is not printed on K2MC3A-100, NO-SOURCE, the old rate is kept. */ |
| 13 | `src/analog/engine/plant.js:986` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | dP/dt = 600 mm per kg/cm2/s, the flash 204 x tr: the two agree for a riser transit time tr of about 3 s, which is NO-SOURCE |
| 14 | `src/analog/engine/plant.js:1025` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | its flow through the valve as it stands with the start-up time of the machine, 5 s (NO-SOURCE), not with the lag of the loop |
| 15 | `src/analog/engine/hx.js:191` | OTHER | review | read the code block at fix time; pick physics or doc | removes e = 0.8 (NO-SOURCE) of the deposit over its half: one full blow of a pair, in and out, leaves (1 - 0.4)^4 = 13 %. |
| 16 | `src/analog/engine/hx.js:193` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | const AN_FOUL = { rInf: 0.0042 /* m2K/W, CALC (see above) */, tau: 56 * 3600 /* s, CALC from the plant trend (see above) */, e: 0.8 /* NO-SOURCE */, mcr: 89 }, |
| 17 | `src/analog/engine/hx.js:423` | OTHER | review | read the code block at fix time; pick physics or doc | no fit. The bank where the tube breaks is not known (NO-SOURCE): the gas mixed ahead of the No.1 economizer is used */ |
| 18 | `src/analog/engine/hmi-op.js:1310` | OTHER | review | read the code block at fix time; pick physics or doc | (plant.js: a new model state takes q.y = PV). The level the drum loses while it stands (cooling, blowdown) is not in the docs: NO-SOURCE */ |
| 19 | `src/analog/engine/tcs.js:645` | CURVE | PC doc | valve characteristic (Cv curve) or vendor curve; else derive (state the law) | /* shell expansion (HP side), mm: 3 mm at about 180 C (page 20 question 2 > 3 mm after the 1800 rpm soak; IBD TD-4 3 mm ON / 2.5 OFF; the linear law is NO-SOURCE) */ |
| 20 | `src/analog/engine/tcs.js:701` | CURVE | PC doc | valve characteristic (Cv curve) or vendor curve; else derive (state the law) | (NO-SOURCE law, limits 80 / 52 C sourced, ambient 30 C: with the spray about 56 C at 3600 rpm with no load, about 49 C at the initial load 4.5 MW, about 58 C on load: under the 80 C of 1.12) */ |
| 21 | `src/analog/engine/tcs.js:706` | SPLIT | PC doc | P&ID and O&M operation philosophy (which unit runs, the split) | MW, 9195) and takes 70 % of the windage heat (NO-SOURCE share; the spray itself is sourced: FV-CD1904 full open below 15 % load, IBD TC-28, 5226 kg/h, TG maintenance manual p104 and p2520 ~ 2521). Wit |
| 22 | `src/analog/engine/tcs.js:714` | CURVE | PC doc | valve characteristic (Cv curve) or vendor curve; else derive (state the law) | carries the windage away and the hood is wet steam at the condenser saturation. NO-SOURCE blend: from the windage value at 7.5 MW to the |
| 23 | `src/analog/engine/tcs.js:934` | OTHER | review | read the code block at fix time; pick physics or doc | Values (36.PNG at 149 MW, SOP limits; the rest NO-SOURCE and marked): |
| 24 | `src/analog/engine/tcs.js:940` | OTHER | PC doc | motor / fan / pump vendor test reports (FAT, KSB / TECO / Cheng Chen data sheets) | bearing oil       3.3 (36.PNG PILO10031 ~ 33) with a MOP; 1.6 with the EOP only (NO-SOURCE, above its 1.05 start); else 0; |
| 25 | `src/analog/engine/tcs.js:941` | OTHER | PC doc | TG lube oil system manual (MHPS), TCS I/O list | EOP discharge     1.6 while running (NO-SOURCE); |
| 26 | `src/analog/engine/tcs.js:946` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | pressures follow with a lag of 1.5 s (NO-SOURCE), so a stopped running pump lets the header fall and the standby in AUTO start. */ |
| 27 | `src/analog/engine/tcs.js:950` | OTHER | PC doc | TG lube oil system manual (MHPS), TCS I/O list | brgEop: 1.6 /* kg/cm2, NO-SOURCE inside sourced bounds: above the EOP LOW OFF 1.33 and below the 5.0 design (V-LOn005) */, |
| 28 | `src/analog/engine/tcs.js:1012` | SETTING | PC doc | instrument list / switch data sheets (set point, dead band) | below the auto start of the SOP NOTE (<= 133 kg/cm2g) while that pump runs (NO-SOURCE: which contact drives the auto start is not in the docs; the LOW contact is taken). |
| 29 | `src/analog/engine/tcs.js:1159` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | rpm: SU 8561 band 1372 ~ 1723 rpm, the peak height NO-SOURCE). Without oil + 60 C (NO-SOURCE) x speed / 3600 (no film); a lag of 20 s. */ |
| 30 | `src/analog/engine/compile-step.js:450` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | stroke in seconds (NO-SOURCE unit; a time constant per the curve title: close fast when the pressure is at or under the set |
| 31 | `src/analog/engine/elec.js:24` | OTHER | PC doc | TCS TCE / TCA sheets, generator protection relay settings (plant study 05) | carries the house load only (the TCS speed control keeps 3600 rpm; the load swing itself is NO-SOURCE, the model goes to the house |
| 32 | `src/analog/engine/elec.js:111` | OTHER | PC doc | PID / MAN parameter list; UNITROL 6080 AVR settings (GEE-2015-0152) | turbine master demand of the DCS when 52L1 closes again (NO-SOURCE: the TCS drawings read here do not show this release) */ |
| 33 | `src/analog/engine/elec.js:134` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | live again (DG1 start + ATS-11 transfer): 10 s = NO-SOURCE for this unit (no DG1 / ATS-11 setting sheet read); 10 s is the Type 10 |
| 34 | `src/analog/engine/elec.js:136` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | const AN_EL_BO = { emp: 10 /* s, NO-SOURCE (NFPA 110 Type 10) */ }; |
| 35 | `src/analog/engine/source.js:136` | CURVE | PC doc | valve characteristic (Cv curve) or vendor curve; else derive (state the law) | pressure, NO-SOURCE for its slope: the real limit is a little higher, never above the design capacity 281 / 460 T/H at 40 C). |
| 36 | `src/analog/engine/source.js:157` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | header PISB1052 0.4 kg/cm2 at 150 MW): MV-SB1001 shut = no steam to the reducing station. The stroke curve of the MOV is NO-SOURCE: |
| 37 | `src/analog/engine/tcs-gen.js:6` | CURVE | PC doc | valve characteristic (Cv curve) or vendor curve; else derive (state the law) | curve is not in the docs: NO-SOURCE, linear). Brushless exciter fed by the UNITROL 6080 (GEE-2015-0152 p.7): exciter field no load |
| 38 | `src/analog/engine/tcs-gen.js:8` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | NO-SOURCE: the exciter time constant (te), the AVR gains (kp, ki), the AVR set point rate during a raise / lower pulse (vrr). |
| 39 | `src/analog/engine/tcs-gen.js:13` | OTHER | PC doc | TCS TCE / TCA sheets, generator protection relay settings (plant study 05) | NO-SOURCE: the grid frequency drift (tcsGridHz, about +-0.04 Hz), the grid voltage 1.0 pu, the speed set rate during a pulse (nrr), |
| 40 | `src/analog/engine/tcs-gen.js:20` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | te: 0.4 /* s, NO-SOURCE */, |
| 41 | `src/analog/engine/tcs-gen.js:21` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | kp: 6 /* NO-SOURCE: picked for no overshoot, 98 % in about 4 s at x1 */, |
| 42 | `src/analog/engine/tcs-gen.js:22` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | ki: 0.6 /* 1/s, NO-SOURCE */, |
| 43 | `src/analog/engine/tcs-gen.js:23` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | vrr: 0.01 /* pu/s, NO-SOURCE */, |
| 44 | `src/analog/engine/tcs-gen.js:33` | OTHER | review | read the code block at fix time; pick physics or doc | nrr: 3.6 /* rpm/s while a speed pulse is on, NO-SOURCE */, |
| 45 | `src/analog/engine/tcs-gen.js:34` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | tn: 1.0 /* s, NO-SOURCE */, |
| 46 | `src/analog/engine/tcs-gen.js:35` | OTHER | review | read the code block at fix time; pick physics or doc | v84: 0.95 /* NO-SOURCE */, |
| 47 | `src/analog/engine/tcs-gen.js:46` | OTHER | PC doc | TCS TCE / TCA sheets, generator protection relay settings (plant study 05) | /* the grid frequency, Hz (NO-SOURCE: a slow drift, so the slip and the phase angle move as on a real grid) */ |
| 48 | `src/analog/engine/unit.js:35` | VOLUME | physics | volume / mass from pipe size and length (P&ID line list, piping isometric = PC doc) | - main steam line to the stop valves: NO-SOURCE, about 20 m3 (8 kg). |
| 49 | `src/analog/engine/unit.js:44` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | tauMW: 10 /* s, steam flow -> MW (reheater, NO-SOURCE: the plant trends are 60 s averages, too slow to fit it) */, |
| 50 | `src/analog/engine/unit.js:56` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | valve sheet L21, lpb below). Reheater volume lag tauRH (NO-SOURCE). |
| 51 | `src/analog/engine/unit.js:74` | VOLUME | physics | volume / mass from pipe size and length (P&ID line list, piping isometric = PC doc) | hot reheat pressure ((T/H) x s per kg/cm2; the reheater alone is 60 m3 (FHI T8T2 60,068 kg of water, hydro test 60 m3; RH alone Crh = 120), the piping volume is NO-SOURCE, about 200 m3 in all kept: st |
| 52 | `src/analog/engine/unit.js:95` | OTHER | PC doc | control valve data sheets (Cv, size) in the instrument list / valve spec | icvRoll: 0.13 /* ICV opening for the roll steam (about 14 T/H at 7.6 kg/cm2 reheat, NO-SOURCE: the SOP gives CV 10 / 3 % at 400 rpm, no ICV opening) */, |
| 53 | `src/analog/engine/unit.js:98` | OTHER | PC doc | control valve data sheets (Cv, size) in the instrument list / valve spec | p.144 TCE212 / p.145 TCE214: CV and ICV demand through FG (PARA-LIST, NO-SOURCE) to the VALVE CONTROL MT1, ICV opening speed SG C007 |
| 54 | `src/analog/engine/unit.js:99` | OTHER | PC doc | control valve data sheets (Cv, size) in the instrument list / valve spec | K:10.0 %/s). cvBias = the flow demand where the CVs start to open (IP START); fdRate = 1 %/s; vRate = 10 %/s (CV taken the same, NO-SOURCE) */ |
| 55 | `src/analog/engine/unit.js:111` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | so one input of the operator trips the whole DCS). The TCS closes the turbine valves (tauTrip 1 s, NO-SOURCE: the valve closing time is in the PC-only TG valve scans, asked of Jennie): no steam to the |
| 56 | `src/analog/engine/unit.js:141` | SPLIT | PC doc | P&ID and O&M operation philosophy (which unit runs, the split) | NO-SOURCE for this unit. The HP / IP-LP split is the heat balance of AN_TBW (HP about 25 %, IP / LP about 75 % of the shaft) */ |
| 57 | `src/analog/engine/unit.js:188` | OTHER | review | read the code block at fix time; pick physics or doc | /* reheater outlet pipe at TT-HR1002 (outlet header and hot reheat pipe to the thermowell): 20 t steel x 0.5 kJ/kg K (NO-SOURCE: no |
| 58 | `src/analog/engine/unit.js:189` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | pipe weight in the docs), lagging loss 0.02 kW/K (NO-SOURCE, about 6 days to cool) */ |
| 59 | `src/analog/engine/unit.js:197` | OTHER | review | read the code block at fix time; pick physics or doc | coal-dependent, set at commissioning). 350 and the straight line between are NO-SOURCE inside that bound. */ |
| 60 | `src/analog/engine/unit.js:223` | CURVE | PC doc | valve characteristic (Cv curve) or vendor curve; else derive (state the law) | lost in vacDn s when they stop (1 min, NO-SOURCE: no vacuum decay curve in the docs). The turbine cannot be rolled below 90 %; a |
| 61 | `src/analog/engine/unit.js:1021` | VOLUME | physics | volume / mass from pipe size and length (P&ID line list, piping isometric = PC doc) | the TCS mode band (tcs.js modes: warm 230 ~ 420 C, hot above 420 C), 350 / 460 C (exact metal NO-SOURCE; the steam of Fig 3 / 4 at |
| 62 | `src/analog/engine/unit.js:1282` | OTHER | review | read the code block at fix time; pick physics or doc | Every number has its source; the ones with none are NO-SOURCE (docs/versions/v3.2.1/CW_PLANT_MODEL.md lists them). |
| 63 | `src/analog/engine/unit.js:1310` | VOLUME | physics | volume / mass from pipe size and length (P&ID line list, piping isometric = PC doc) | / (opening)^4, flow area = opening^2 (NO-SOURCE: no valve data in the repository); closed = no flow. |
| 64 | `src/analog/engine/unit.js:1365` | OTHER | PC doc | control valve data sheets (Cv, size) in the instrument list / valve spec | /* beta.312 (JENNIE, Audit #5, the three valve losses were NO-SOURCE): loss = K x v^2 / 2g, K of the open valve from the Crane TP-410 |
| 65 | `src/analog/engine/unit.js:1383` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | bRamp: 5 /* s, NO-SOURCE: Y / delta change-over of the SWBP */, |
| 66 | `src/analog/engine/unit.js:1422` | CURVE | PC doc | valve characteristic (Cv curve) or vendor curve; else derive (state the law) | little area at a small opening; NO-SOURCE: no valve curve in the repository) */ |
| 67 | `src/analog/engine/unit.js:1448` | OTHER | PC doc | water chemistry spec, FHI manual Part 3 | c.kup = (Ph - dpF - PN) / (Qt * Qt); /* header -> node N (pipes, NO-SOURCE elevation lumped in) */ |
| 68 | `src/analog/engine/unit.js:1506` | SPLIT | PC doc | P&ID and O&M operation philosophy (which unit runs, the split) | 2 x 750 T/H; C standby = closed, NO-SOURCE which one stands by); |
| 69 | `src/analog/engine/unit.js:1560` | SPLIT | PC doc | P&ID and O&M operation philosophy (which unit runs, the split) | The split between the tubes and the bypass by opening: bypass hydraulics NO-SOURCE */ |
| 70 | `src/analog/engine/unit.js:1711` | OTHER | review | read the code block at fix time; pick physics or doc | : 0; /* floor 40 % of the rated 50.87 kW at low flow: NO-SOURCE */ |
| 71 | `src/analog/engine/unit.js:1739` | TRAINER | #6 | fault rate of the Instructor faults; decided with the Instructor card | strainer DP  0.03 kg/cm2 while its pump runs (28.png DPIMU0709A / B / C 0.029 / 0.042 / 0.001; no strainer curve: NO-SOURCE shape); |
| 72 | `src/analog/engine/unit.js:1743` | VOLUME | physics | volume / mass from pipe size and length (P&ID line list, piping isometric = PC doc) | 6 kg/cm2 (SOP 7) at 0.003 m/s (NO-SOURCE), primes the closed loop at the first opening of V-CW1001 (NO-SOURCE volume). |
| 73 | `src/analog/engine/unit.js:1778` | OTHER | review | read the code block at fix time; pick physics or doc | etPrime: 0.4 /* m of tank level that the priming of the closed loop takes (NO-SOURCE) */, |
| 74 | `src/analog/engine/unit.js:1779` | OTHER | review | read the code block at fix time; pick physics or doc | etPrimeT: 120 /* s (NO-SOURCE) */, |
| 75 | `src/analog/engine/unit.js:1784` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | tauH: 1 /* s, the header pressure: a full water line answers at once (NO-SOURCE number). DITL-112 gives the first pump only TR25 3 s to clear M.2506 before the AUTO pumps start (Mina F21) */, |
| 76 | `src/analog/engine/unit.js:1823` | CURVE | PC doc | valve characteristic (Cv curve) or vendor curve; else derive (state the law) | no flow on the drawings); the flow follows the travel (NO-SOURCE: the shape of the MOV) */ |
| 77 | `src/analog/engine/unit.js:1853` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | from the tank (K.etPrime m of tank level over K.etPrimeT s, NO-SOURCE: the loop volume is not in the repository); then the level stays */ |
| 78 | `src/analog/engine/unit.js:1883` | OTHER | review | read the code block at fix time; pick physics or doc | 357.5 m2: clean UA = 13830 / LMTD 5.72 = 2418 kW/K. 2 of the 3 in service (NO-SOURCE: the design flow 1500 = 2 x |
| 79 | `src/analog/engine/unit.js:1887` | SPLIT | PC doc | P&ID and O&M operation philosophy (which unit runs, the split) | heat load    3,480 kW x (0.4 + 0.6 x load / 150 MW) (27.PNG 3,452 kW at 148 MW; the 40 / 60 split NO-SOURCE, as 3.2.0-beta.69); |
| 80 | `src/analog/engine/unit.js:1888` | VOLUME | physics | volume / mass from pipe size and length (P&ID line list, piping isometric = PC doc) | temperature  one node for the water of the loop, 180,000 kJ/K (about 43 m3, NO-SOURCE: the loop volume is not in the repository; |
| 81 | `src/analog/engine/unit.js:1890` | OTHER | review | read the code block at fix time; pick physics or doc | room temperature 30 C (NO-SOURCE) in 30 min; the bottom ash cooler outlets TT-CW1060 = the supply + 1 C while an |
| 82 | `src/analog/engine/unit.js:1891` | OTHER | review | read the code block at fix time; pick physics or doc | ACWP runs (NO-SOURCE, the ash heat is not modelled; the snapshot reads 36 ~ 38 C at 37 C). |
| 83 | `src/analog/engine/unit.js:2058` | OTHER | physics | textbook property or heat-transfer derivation; write the formula beside the value | temperature, at most the 920 C of the spec; cp 0.84 kJ/kgK (NO-SOURCE, textbook value of ash). |
| 84 | `src/analog/engine/unit.js:2061` | VOLUME | physics | volume / mass from pipe size and length (P&ID line list, piping isometric = PC doc) | stopped (NO-SOURCE: the metal mass is not in the spec). 16.PNG (all four stopped at 150 MW): ash 31 ~ 55 C, water 36 ~ 38 C. |
| 85 | `src/analog/engine/unit.js:2064` | SPLIT | PC doc | P&ID and O&M operation philosophy (which unit runs, the split) | temperature for both (NO-SOURCE: the shell / shaft split of the 3 kg/s is not in the spec); the inlet is TT-CW1156. LT-BH1750 bottom ash silo: silos stand in this simulator (scope 2026-11-07), 15.8 %  |
| 86 | `src/analog/engine/unit.js:2114` | CURVE | PC doc | valve characteristic (Cv curve) or vendor curve; else derive (state the law) | calibrated   with the vendor UA and a linear valve (170 T/H x MV, NO-SOURCE: no valve curve), the snapshot gives an oil flow of 64.5 kW/K |
| 87 | `src/analog/engine/unit.js:2116` | CURVE | PC doc | valve characteristic (Cv curve) or vendor curve; else derive (state the law) | heat         1,032 kW x speed / 3600 while the lube oil flows (bearing oil pressure above 1.05 kg/cm2, tcs.js), NO-SOURCE shape (as the |
| 88 | `src/analog/engine/unit.js:2118` | VOLUME | physics | volume / mass from pipe size and length (P&ID line list, piping isometric = PC doc) | oil tank     one temperature node (the return oil), 25,800 kJ/K (about 15 m3 of oil, NO-SOURCE: the tank volume is not in the docs); |
| 89 | `src/analog/engine/unit.js:2121` | VOLUME | physics | volume / mass from pipe size and length (P&ID line list, piping isometric = PC doc) | stainless -> 0.088 m3 x 7,900 kg/m3 x 0.5 kJ/kg K = 348 kJ/K; gap and plate thickness NO-SOURCE, the usual values of a |
| 90 | `src/analog/engine/unit.js:2146` | OTHER | review | read the code block at fix time; pick physics or doc | UA = 36,430 kW/K at the design flow (from the O&M point: NTU = ln(8.65 / 3.05)), x (flow / design)^0.5 (NO-SOURCE: |
| 91 | `src/analog/engine/unit.js:2147` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | the usual water velocity factor); Ts follows with tau 30 s (NO-SOURCE); no seawater = no condensing: Ts goes to 100 C; |
| 92 | `src/analog/engine/unit.js:2152` | CURVE | PC doc | valve characteristic (Cv curve) or vendor curve; else derive (state the law) | curve; outlet = suction (condenser pressure + the water above the impeller) + head - kz (kz 0.96 kg/cm2, NO-SOURCE: |
| 93 | `src/analog/engine/unit.js:2174` | OTHER | physics | textbook property or heat-transfer derivation; write the formula beside the value | balance at 150 MW). At constant entropy dh/dT = x hfg / T = 7.1 kJ/kg per C at 38.65 C; with 0.85 LP efficiency (NO-SOURCE) 6 kJ/kg per C, |
| 94 | `src/analog/engine/unit.js:2190` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | carry-over gives. tau itself is NO-SOURCE inside that bound. At a hot bed (bf = 1) with no coal held, the burn is the fed coal, as |
| 95 | `src/analog/engine/unit.js:2194` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | The burnout time of the char is NO-SOURCE; the bed / refractory lumps already give the lag the plant tuning stands on. Not used. */ |
| 96 | `src/analog/engine/unit.js:2201` | VOLUME | physics | volume / mass from pipe size and length (P&ID line list, piping isometric = PC doc) | NO-SOURCE, the lining area and film coefficient are not in the documents). Flue gas cp 1.15 kJ/kg K (textbook), coal ash 6.82 % (T3). |
| 97 | `src/analog/engine/unit.js:2208` | OTHER | physics | textbook property or heat-transfer derivation; write the formula beside the value | - gas film h 0.1 kW/m2 K (NO-SOURCE, textbook dusty gas at 800 C, convection + radiation 50 ~ 200 W/m2 K): hA 120 kW/K. |
| 98 | `src/analog/engine/unit.js:2230` | OTHER | review | read the code block at fix time; pick physics or doc | With 2 (NO-SOURCE) the model bed fell 828 -> 775 C at 90 MW and coal / pressure swung 48 ~ 56.5 T/H, 121.1 ~ 123.4 kg/cm2 every |
| 99 | `src/analog/engine/unit.js:2238` | OTHER | physics | textbook property or heat-transfer derivation; write the formula beside the value | radiation about 17 + convection about 10, NO-SOURCE) x 1,199 m2 (upper walls 46.38 x 25.85 m) = 32 kW/K; the gas cools |
| 100 | `src/analog/engine/unit.js:2276` | OTHER | physics | textbook property or heat-transfer derivation; write the formula beside the value | no longer the fixed 32 kW/K (NO-SOURCE). Radiation: WSGG emissivity of the CO2 + H2O gas (hx.js anHxEps, the same model as the |
| 101 | `src/analog/engine/unit.js:2468` | OTHER | review | read the code block at fix time; pick physics or doc | Out: the four screw coolers, 2 T/H at normal, 4 T/H at 5 rpm (BAC E130122B): 0.8 T/H per rpm. The fan flow that fluidizes: NO-SOURCE, full |
| 102 | `src/analog/engine/unit.js:2472` | OTHER | review | read the code block at fix time; pick physics or doc | NO-SOURCE: the circulation rate is not in the documents. */ |
| 103 | `src/analog/engine/unit.js:2677` | OTHER | PC doc | control valve data sheets (Cv, size) in the instrument list / valve spec | (NO-SOURCE). The water side valves: AN_FV0, anHtrPath. */ |
| 104 | `src/analog/engine/unit.js:2684` | CURVE | PC doc | valve characteristic (Cv curve) or vendor curve; else derive (state the law) | (NO-SOURCE shape); the HB gives that ratio within 1 ~ 3 % at the HP end and up to 9 % low at 30 % load at the LP end (No.1: 0.357, flow 0.133). |
| 105 | `src/analog/engine/unit.js:2701` | OTHER | review | read the code block at fix time; pick physics or doc | without steam is NO-SOURCE) */ |
| 106 | `src/analog/engine/unit.js:2845` | OTHER | review | read the code block at fix time; pick physics or doc | level        d(level) / dt = (in - out) / (water density x surface), surface = diameter x length x 0.7 (NO-SOURCE: the tube bundle |
| 107 | `src/analog/engine/unit.js:2847` | OTHER | PC doc | control valve data sheets (Cv, size) in the instrument list / valve spec | NO-SOURCE: the capacity of the HP valves (the design flow at 50 %) and of every alternate valve (= its primary); 0.7. */ |
| 108 | `src/analog/engine/unit.js:2937` | TRAINER | #6 | fault rate of the Instructor faults; decided with the Instructor card | The hole: 3 mm (NO-SOURCE, trainer setting); like the boiler tube leak (AN_TL) its jet cuts the next tubes and the open area doubles |
| 109 | `src/analog/engine/unit.js:2938` | CURVE | PC doc | valve characteristic (Cv curve) or vendor curve; else derive (state the law) | every 10 min (NO-SOURCE), with no cap: "a tube which bursts will cause the surrounding tubes to burst" (HP heater O&M, FHI 2015, Sect 2 p2), so it keeps failing until the operator takes it out; the pu |
| 110 | `src/analog/engine/unit.js:2944` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | const AN_HL = { d: 0.003 /* m, NO-SOURCE */, cd: 0.61, t2: 600 /* s, NO-SOURCE, as AN_TL */, rho: [880, 840] /* kg/m3, tube water ~178 / ~220 C, AN_WATER_RHO */ }; |
| 111 | `src/analog/engine/unit.js:3087` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | + DCA while the heater drains (else the shell saturation); lag 120 s (NO-SOURCE, as AN_HP). NO-SOURCE: the 1.35 C rise taken with |
| 112 | `src/analog/engine/unit.js:3132` | SPLIT | PC doc | P&ID and O&M operation philosophy (which unit runs, the split) | The split by opening is that of the heaters (anHtrPath, bypass hydraulics NO-SOURCE); the polisher and the bypass both shut = no |
| 113 | `src/analog/engine/unit.js:3266` | CURVE | PC doc | valve characteristic (Cv curve) or vendor curve; else derive (state the law) | TT-CD1110-4   hotwell + 2 C x load share (28.png 42 vs 40 C: the heater drains that flash in the chamber; NO-SOURCE: the load shape); |
| 114 | `src/analog/engine/unit.js:3268` | OTHER | review | read the code block at fix time; pick physics or doc | PT-CD1122     deaerator pressure PT-CD1104 + 1.6 kg/cm2 (02.png 3.8 - 2.2; NO-SOURCE: kept the same at every flow, the water column to |
| 115 | `src/analog/engine/unit.js:3273` | OTHER | PC doc | control valve data sheets (Cv, size) in the instrument list / valve spec | (DITL-66) x 46 T/H (NO-SOURCE: the valve capacity taken as the transmitter range of the IO list). */ |
| 116 | `src/analog/engine/unit.js:3320` | OTHER | review | read the code block at fix time; pick physics or doc | below 5 % main steam it goes to the ambient (NO-SOURCE, no flow through the turbine); |
| 117 | `src/analog/engine/unit.js:3333` | CURVE | PC doc | valve characteristic (Cv curve) or vendor curve; else derive (state the law) | FT-FW1149          14.8 x TCV-FW1150 (TICHR1002 MV) / 66.0 x XV-FW1151 (DITL-35) x sqrt(dp / 130.5) (NO-SOURCE: linear valve, the tap |
| 118 | `src/analog/engine/unit.js:3335` | OTHER | PC doc | control valve data sheets (Cv, size) in the instrument list / valve spec | FT-FW1059          40 T/H x TCV-FW1060 (TICMS1022 MV) x XV-FW1061 (DITL-79) x sqrt(dp / 130.5) (NO-SOURCE: no data sheet, the |
| 119 | `src/analog/engine/unit.js:3337` | OTHER | review | read the code block at fix time; pick physics or doc | Not on any DCS sheet: XV-TS1700 / 1710 (NO-SOURCE, not modelled). */ |
| 120 | `src/analog/engine/unit.js:3358` | CURVE | PC doc | valve characteristic (Cv curve) or vendor curve; else derive (state the law) | NO-SOURCE (no load curve in the docs): from no load (fed from the aux steam header, TT-AS1015 = TT-AS1003) to 150 MW (self-sealing, 29.PNG) |
| 121 | `src/analog/engine/unit.js:3430` | CURVE | PC doc | valve characteristic (Cv curve) or vendor curve; else derive (state the law) | out: deaerator pegging PCV-AS1030 (PICCD1104 MV, ABC-056) Cv 253.7 (E2-0-123 p42, linear: NO-SOURCE characteristic) |
| 122 | `src/analog/engine/unit.js:3433` | VOLUME | physics | volume / mass from pipe size and length (P&ID line list, piping isometric = PC doc) | the steam seal feed valve PV-GS1031; the volume 6 m3 is NO-SOURCE (the 12-inch header and branches are only on |
| 123 | `src/analog/engine/unit.js:3438` | OTHER | PC doc | PID / MAN parameter list; UNITROL 6080 AVR settings (GEE-2015-0152) | 1.31 kg/cm2 A = 0.28 G); PI gains NO-SOURCE; the glands take K sqrt(P^2 - Pc^2) (labyrinth), K from the NOR case |
| 124 | `src/analog/engine/unit.js:3441` | VOLUME | physics | volume / mass from pipe size and length (P&ID line list, piping isometric = PC doc) | 1.5 m3 NO-SOURCE; "in service" (ATS 1.10) = header >= 0.10 kg/cm2 G (IBD TD-3 LOW alarm); |
| 125 | `src/analog/engine/unit.js:3444` | OTHER | PC doc | control valve data sheets (Cv, size) in the instrument list / valve spec | atmosphere (orifice CdA 0.00072 m2, NO-SOURCE: 610 kg/h into full vacuum, the gland clearances are not in the docs), |
| 126 | `src/analog/engine/unit.js:3445` | OTHER | PC doc | control valve data sheets (Cv, size) in the instrument list / valve spec | the vacuum breaker MV-AV1391 (DITL-56, CdA 0.0195 m2 = an 8-inch valve, NO-SOURCE size); out: the ejectors as |
| 127 | `src/analog/engine/unit.js:3454` | VOLUME | physics | volume / mass from pipe size and length (P&ID line list, piping isometric = PC doc) | Va: 6 /* m3, NO-SOURCE */, |
| 128 | `src/analog/engine/unit.js:3455` | VOLUME | physics | volume / mass from pipe size and length (P&ID line list, piping isometric = PC doc) | Vg: 1.5 /* m3, NO-SOURCE */, |
| 129 | `src/analog/engine/unit.js:3465` | OTHER | PC doc | PID / MAN parameter list; UNITROL 6080 AVR settings (GEE-2015-0152) | gKp: 60 /* % per kg/cm2, NO-SOURCE */, |
| 130 | `src/analog/engine/unit.js:3466` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | gTi: 15 /* s, NO-SOURCE */, |
| 131 | `src/analog/engine/unit.js:3500` | VOLUME | physics | volume / mass from pipe size and length (P&ID line list, piping isometric = PC doc) | header and the gland desuperheater spray (MV of TICAS1017). Spray capacities, metal heat capacities and losses: NO-SOURCE |
| 132 | `src/analog/engine/unit.js:3504` | OTHER | PC doc | control valve data sheets (Cv, size) in the instrument list / valve spec | sprA: 1000 /* kg/h TCV-CD1124 full open, NO-SOURCE */, |
| 133 | `src/analog/engine/unit.js:3505` | OTHER | PC doc | control valve data sheets (Cv, size) in the instrument list / valve spec | sprG: 300 /* kg/h gland desuperheater spray full open, NO-SOURCE */, |
| 134 | `src/analog/engine/unit.js:3507` | OTHER | review | read the code block at fix time; pick physics or doc | Mc1: 300 /* kJ/K, NO-SOURCE */, |
| 135 | `src/analog/engine/unit.js:3508` | OTHER | review | read the code block at fix time; pick physics or doc | UA1: 0.05 /* kW/K, NO-SOURCE */, |
| 136 | `src/analog/engine/unit.js:3509` | OTHER | review | read the code block at fix time; pick physics or doc | Mc3: 2000 /* kJ/K, NO-SOURCE */, |
| 137 | `src/analog/engine/unit.js:3511` | OTHER | review | read the code block at fix time; pick physics or doc | Mc17: 300 /* kJ/K, NO-SOURCE */, |
| 138 | `src/analog/engine/unit.js:3512` | OTHER | review | read the code block at fix time; pick physics or doc | UA17: 0.05 /* kW/K, NO-SOURCE */, |
| 139 | `src/analog/engine/unit.js:3630` | OTHER | PC doc | control valve data sheets (Cv, size) in the instrument list / valve spec | 1500 for a 6-inch gate, NO-SOURCE: it only matters near its closed seat) */ |
| 140 | `src/analog/engine/unit.js:3661` | TRAINER | #6 | fault rate of the Instructor faults; decided with the Instructor card | vacuum. The in-leakage orifice (25.5 kg/h design, ED 066 p6) opens: x2 every 10 min (NO-SOURCE trainer rate) up to x64 |
| 141 | `src/analog/engine/unit.js:3662` | CURVE | PC doc | valve characteristic (Cv curve) or vendor curve; else derive (state the law) | (about 1,600 kg/h, NO-SOURCE). The ejectors take more air only at a higher condenser pressure (their curves), so the back |
| 142 | `src/analog/engine/unit.js:3972` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | running      bearing to 55 C (NO-SOURCE) with a 30 min time constant, winding to 85 C (NO-SOURCE) with 15 min; vibration 1.8 mm/s (pumps) |
| 143 | `src/analog/engine/unit.js:3973` | OTHER | review | read the code block at fix time; pick physics or doc | / 2.2 mm/s (IDF) (NO-SOURCE; the alarm list and the SOP give limits only) at once; |
| 144 | `src/analog/engine/unit.js:3975` | OTHER | review | read the code block at fix time; pick physics or doc | each element +0 ~ 2.5 C / +0 ~ 0.3 mm/s of its own (NO-SOURCE) so that two elements are not one number. |
| 145 | `src/analog/engine/unit.js:3988` | OTHER | PC doc | motor / fan / pump vendor test reports (FAT, KSB / TECO / Cheng Chen data sheets) | motor and fan bearings 1 ~ 4, windings U / V / W, vibration 1 ~ 4; the same NO-SOURCE running values as the IDF (no snapshot or |
| 146 | `src/analog/engine/unit.js:3996` | OTHER | PC doc | motor / fan / pump vendor test reports (FAT, KSB / TECO / Cheng Chen data sheets) | (forced oil, KSB LOS: the running value Tb stays NO-SOURCE; KSB "List of measuring points" PR73686-00D: pump bearing alarm |
| 147 | `src/analog/engine/unit.js:3997` | OTHER | PC doc | motor / fan / pump vendor test reports (FAT, KSB / TECO / Cheng Chen data sheets) | >= 90 C, DITL-23B > 100 C), winding U / V / W from the closed cooling water (AN_MT.cw below), vibration x1 / x2 (NO-SOURCE 1.8 mm/s; |
| 148 | `src/analog/engine/unit.js:4015` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | fnIdfI); time constant tauW (NO-SOURCE). |
| 149 | `src/analog/engine/unit.js:4020` | OTHER | review | read the code block at fix time; pick physics or doc | NO-SOURCE. */ |
| 150 | `src/analog/engine/unit.js:4035` | VOLUME | physics | volume / mass from pipe size and length (P&ID line list, piping isometric = PC doc) | 450 L/min x ACW flow / 1500 m3/h (the same share rule as the turbine oil cooler, NO-SOURCE: the branch flow is not |
| 151 | `src/analog/engine/unit.js:4036` | OTHER | physics | textbook property or heat-transfer derivation; write the formula beside the value | measured), at least 2 % (a closed loop still moves a little by convection, NO-SOURCE) and at most 250 C; |
| 152 | `src/analog/engine/unit.js:4037` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | I = the BFWP current of the model (U.fwI0 / fwI1); time constant tauW (NO-SOURCE). |
| 153 | `src/analog/engine/unit.js:4051` | CURVE | PC doc | valve characteristic (Cv curve) or vendor curve; else derive (state the law) | heat      13.65 kW while the pump runs (the design duty, NO-SOURCE: no curve of the bearing loss); |
| 154 | `src/analog/engine/unit.js:4056` | VOLUME | physics | volume / mass from pipe size and length (P&ID line list, piping isometric = PC doc) | bearings  the RTD = the oil leaving the bearing = the return (NO-SOURCE: the metal above the drain oil is not in the docs), +0.5 C |
| 155 | `src/analog/engine/unit.js:4057` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | per element so that two elements are not one number; time constant tauB (the reservoir, NO-SOURCE); |
| 156 | `src/analog/engine/unit.js:4139` | VOLUME | physics | volume / mass from pipe size and length (P&ID line list, piping isometric = PC doc) | use          the consumption at 7.0 (NO-SOURCE: IA 1200, PA 1500 m3/h, as 3.2.0-beta.68) through fixed openings: proportional to the |
| 157 | `src/analog/engine/unit.js:4143` | VOLUME | physics | volume / mass from pipe size and length (P&ID line list, piping isometric = PC doc) | flow 176 kW = 1500 m3/h at the PA ratio 600 kW / 85 m3/min (NO-SOURCE ratio, the IA compressor power is not in the docs); |
| 158 | `src/analog/engine/unit.js:4145` | OTHER | PC doc | control valve data sheets (Cv, size) in the instrument list / valve spec | capacity (NO-SOURCE); 100 % = PA 600 kW (TRE60-600kW), IA 176 kW (above); |
| 159 | `src/analog/engine/unit.js:4147` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | 3 x 69.9 A for 10 s (NO-SOURCE: the current limit of the soft starter), IA 532 % x 286 A for 3 s (NO-SOURCE: the time); |
| 160 | `src/analog/engine/unit.js:4149` | OTHER | review | read the code block at fix time; pick physics or doc | unit header  the tank pressure less 0.2 kg/cm2 at the design use (NO-SOURCE), with the use squared; |
| 161 | `src/analog/engine/unit.js:4150` | OTHER | review | read the code block at fix time; pick physics or doc | dryer outlet the tank pressure plus 0.15 kg/cm2 at the design use (NO-SOURCE), with the flow squared; flow over the dryers in |
| 162 | `src/analog/engine/unit.js:4158` | VOLUME | physics | volume / mass from pipe size and length (P&ID line list, piping isometric = PC doc) | fU: 0.5 /* NO-SOURCE: the share of unit 1 in the use (unit 1, unit 2, utility area; no consumption list in the docs) */, |
| 163 | `src/analog/engine/unit.js:4159` | VOLUME | physics | volume / mass from pipe size and length (P&ID line list, piping isometric = PC doc) | Kx: 1500 /* free air m3/h at 1 kg/cm2 difference, V-PA0013 6" fully open (NO-SOURCE) */, |
| 164 | `src/analog/engine/unit.js:4203` | SETTING | PC doc | instrument list / switch data sheets (set point, dead band) | airlock RK 2-8 (the adjustable range) without the set point, and the SMC IL-201 sheet none: 3.5 is used for them too (NO-SOURCE |
| 165 | `src/analog/engine/unit.js:4210` | SETTING | PC doc | instrument list / switch data sheets (set point, dead band) | XV-FW1111-1 / XV-FW1121-1 have an airlock (SMC VSA 3-way): they stay in place (3.5, NO-SOURCE set point). |
| 166 | `src/analog/engine/unit.js:4247` | OTHER | PC doc | control valve data sheets (Cv, size) in the instrument list / valve spec | The loss of the line between the pump and the valve is not modelled (NO-SOURCE; at start-up flows it is small). */ |
| 167 | `src/analog/engine/unit.js:4283` | TRAINER | #6 | fault rate of the Instructor faults; decided with the Instructor card | The hole: one opening of 10 mm (NO-SOURCE, a trainer setting: a small leak, about 11 T/H at 150 MW, that the plant can run with). |
| 168 | `src/analog/engine/unit.js:4291` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | const AN_TL = { d: 0.01 /* m, NO-SOURCE */, dpE: 3.5 /* kg/cm2 at MCR, FHI T3 */, mcr: 460, t2: 600 /* s, NO-SOURCE */, tw: 0.006 /* m, NO-SOURCE */, odW: 0.0635, odE: 0.0572 }; |
| 169 | `src/analog/engine/unit.js:4294` | TRAINER | #6 | fault rate of the Instructor faults; decided with the Instructor card | (NO-SOURCE, a trainer setting: headless 150 MW, the leak 11 T/H, 22 after 10 min, 44 after 20 min, 78 at 28 min when the feedwater, 627 T/H against a transmitter span of 550, overfills the drum to +27 |
| 170 | `src/analog/engine/unit.js:4296` | OTHER | review | read the code block at fix time; pick physics or doc | C-12), economizer 57.2 mm OD (Eco 2, E-7 / E-10); wall thickness 6 mm (NO-SOURCE): water wall bore 51.5 mm, 2 ends = 53 x the 10 mm |
| 171 | `src/analog/engine/unit.js:4303` | TRAINER | #6 | fault rate of the Instructor faults; decided with the Instructor card | 9 H r + m, LHV = HHV - 589.3 x water. At 40 % (NO-SOURCE, a trainer setting: at 42 % the 150 MW coal is 100 T/H, the feeder MV high limit 83.3 % of ABC-004A, and the logic puts the masters to MANUAL): |
| 172 | `src/analog/engine/unit.js:4324` | OTHER | review | read the code block at fix time; pick physics or doc | sizes and the speed loop time are NO-SOURCE (the feeder manual gives the accuracy +/- 0.5 % of the totalized coal, not the speed loop) */ |
| 173 | `src/analog/engine/unit.js:4469` | OTHER | review | read the code block at fix time; pick physics or doc | (NO-SOURCE) */ |
| 174 | `src/analog/engine/unit.js:4494` | OTHER | review | read the code block at fix time; pick physics or doc | "SPRING RETURN PNEUMATIC ACTUATOR SR200 ON VP LUG DN450". Spring pressures NO-SOURCE (as spr above) */ |
| 175 | `src/analog/engine/unit.js:4596` | OTHER | review | read the code block at fix time; pick physics or doc | /* the control location of the local panel is not a DCS signal (D1-0-059 Modbus flag "Control Location", NO-SOURCE): in |
| 176 | `src/analog/engine/unit.js:4640` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | /* the unit 1 header: through its isolation valve (V-IA1101 / V-PA1087); closed = the unit users bleed it down (NO-SOURCE: 60 s) */ |
| 177 | `src/analog/engine/unit.js:4687` | CURVE | PC doc | valve characteristic (Cv curve) or vendor curve; else derive (state the law) | PARA-LIST, NO-SOURCE: linear here). The valves follow at 10 %/s (TCE214 SG C007). TRANSFER (ICV TO CV TRANSFER COMPLETE I.0418) = |
| 178 | `src/analog/engine/unit.js:4694` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | 20 s x 150 MW) = 0.033 %/s per MW (NO-SOURCE), 3.3 times the drawing: the MW was held to +-0.02 MW at 150 MW while the main steam |
| 179 | `src/analog/engine/unit.js:4745` | OTHER | PC doc | TCS TCE / TCA sheets, generator protection relay settings (plant study 05) | trip opens 52G and 41 (tcsGenTrip). The 86G-A is reset with the TURBINE RESET (NO-SOURCE: the hand reset of the lockout relay is on the |
| 180 | `src/analog/engine/unit.js:4767` | TRAINER | #6 | fault rate of the Instructor faults; decided with the Instructor card | 59.5 Hz, reached at 0.1 Hz/s (a unit lost elsewhere; NO-SOURCE trainer setting, the Philippine Grid Code normal band is 59.7 ~ 60.3 Hz), |
| 181 | `src/analog/engine/unit.js:4852` | OTHER | review | read the code block at fix time; pick physics or doc | 130 MW). The cooler outlet air stays at the snapshot while the shaft turns (NO-SOURCE: its change with the cooling water); at rest |
| 182 | `src/analog/engine/unit.js:4853` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | all go to the ambient. Lag 600 s (NO-SOURCE: the thermal time of the winding) */ |
| 183 | `src/analog/engine/unit.js:4902` | OTHER | PC doc | water chemistry spec, FHI manual Part 3 | phosphate inside its own alarm limits: 2 ppm = pH 9.08, 7.6 uS/cm (NO-SOURCE: the plant PO4 is not in a snapshot; the |
| 184 | `src/analog/engine/unit.js:4988` | OTHER | PC doc | control valve data sheets (Cv, size) in the instrument list / valve spec | starts it (the lances start retracted, 18.PNG). NO-SOURCE: the header pressure drop under the flow (PCV-SB1053 has no Cv in the docs); |
| 185 | `src/analog/engine/unit.js:5002` | OTHER | review | read the code block at fix time; pick physics or doc | PT-SB1042 (I/O list STN102 AI0549 / AI0550, 0 ~ 16) is the header pressure (at most 16). NO-SOURCE: the steps of the lance (one |
| 186 | `src/analog/engine/unit.js:5015` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | 107 / 105 C, scaled down to the ambient with the boiler water temperature (ambient at Cold). NO-SOURCE: tauH, tauC (the warm-up and |
| 187 | `src/analog/engine/unit.js:5118` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | NO-SOURCE: the warming line size (its flow), the warm-up lag tauH 300 s and the cooling lag tauC 1800 s, the rest-value scaling */ |
| 188 | `src/analog/engine/unit.js:5534` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | fast acting dump; NO-SOURCE: the PLU closing time) until the unbalance is under 40 %, then the speed control opens them again. |
| 189 | `src/analog/engine/unit.js:5563` | OTHER | PC doc | TCS TCE / TCA sheets, generator protection relay settings (plant study 05) | house load, then the integral goes on from there (TCE p.136), trimmed by the TCS load loop toward the house load (NO-SOURCE: |
| 190 | `src/analog/engine/unit.js:5672` | OTHER | physics | textbook property or heat-transfer derivation; write the formula beside the value | Open (not in this Beta): uag stays 32 kW/K (27 W/m2 K, NO-SOURCE). The WSGG gas radiation of hx.js at the upper furnace beam |
| 191 | `src/analog/engine/unit.js:5711` | OTHER | physics | textbook property or heat-transfer derivation; write the formula beside the value | - the stone heated from the room to the bed: cp 1.0 kJ/kg K, NO-SOURCE (mean of calcite 25 - 850 C, NIST-JANAF ~ 0.9 - 1.1). |
| 192 | `src/analog/engine/unit.js:5794` | CURVE | PC doc | valve characteristic (Cv curve) or vendor curve; else derive (state the law) | ABC-057 closes with load (S3-LN1 ~ 22) are not in it: damper characteristic NO-SOURCE */ |
| 193 | `src/analog/engine/unit.js:6216` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | (bypass 10 %, NO-SOURCE: the MV-MS1392 line size on PD-011 gives no flow; its closing time 6 s is Limitorque 1/21 ~ 21/21), and the pressure at the MSV inlet that the ATS reads (tcs.js tcsSteam): it f |
| 194 | `src/analog/engine/boiler.js:24` | CURVE | PC doc | valve characteristic (Cv curve) or vendor curve; else derive (state the law) | The valve sizes (K) are CALIBRATED on 6.PNG with that split; linear valves (NO-SOURCE: no valve curve). Check: PCV-DO0002 |
| 195 | `src/analog/engine/boiler.js:44` | OTHER | PC doc | control valve data sheets (Cv, size) in the instrument list / valve spec | (CALIBRATED on 6.PNG; the pipe itself is NO-SOURCE). The return PCV-DO1009 passes the same 13.9 T/H at 85.7 % and 11.0. */ |
| 196 | `src/analog/engine/boiler.js:211` | OTHER | PC doc | limestone / sand O&M (JAT 130225-OMM-01), limestone_logic.xls | anLmStart(U); /* limestone: at rest, the vessels keep the start content (NO-SOURCE) */ |
| 197 | `src/analog/engine/boiler.js:229` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | ); /* screw pump: up to speed in about 1 s (NO-SOURCE) */ |
| 198 | `src/analog/engine/boiler.js:305` | CURVE | PC doc | valve characteristic (Cv curve) or vendor curve; else derive (state the law) | Each blower gives flow by its inlet damper (FCV-FA1055-A1 / B1, ABC-014 FICFA1055A / B MV; linear, NO-SOURCE), 26.3 T/H at 42.8 %. |
| 199 | `src/analog/engine/boiler.js:318` | SPLIT | PC doc | P&ID and O&M operation philosophy (which unit runs, the split) | /* beta.308 (JENNIE, Audit #5, PAF / SAF / IDF were fI 0.45 NO-SOURCE): the current at no air power, as a share of the snapshot current |
| 200 | `src/analog/engine/boiler.js:483` | TRAINER | #6 | fault rate of the Instructor faults; decided with the Instructor card | The plugging adds to that loss: +1 x dp every 30 min (NO-SOURCE trainer rate), up to +3 x. The same gas then needs a deeper ID |
| 201 | `src/analog/engine/boiler.js:492` | TRAINER | #6 | fault rate of the Instructor faults; decided with the Instructor card | values the model already stands on (fan flows of the snapshot); the fault adds +1 x the design leak every 30 min (NO-SOURCE trainer |
| 202 | `src/analog/engine/boiler.js:528` | OTHER | PC doc | water chemistry spec, FHI manual Part 3 | SOVs open is NO-SOURCE: the open vent takes it all (the header is at about 3300 mmH2O, the silencer at the atmosphere) */ |
| 203 | `src/analog/engine/boiler.js:533` | CURVE | PC doc | valve characteristic (Cv curve) or vendor curve; else derive (state the law) | that share through, the silencer vents that share (linear, NO-SOURCE) */ |
| 204 | `src/analog/engine/boiler.js:547` | CURVE | PC doc | valve characteristic (Cv curve) or vendor curve; else derive (state the law) | the flow of the snapshot at the damper of the snapshot (9.png 26.3 T/H at 42.8 %), linear in the opening (NO-SOURCE) */ |
| 205 | `src/analog/engine/boiler.js:562` | OTHER | PC doc | water chemistry spec, FHI manual Part 3 | atmosphere is NO-SOURCE; a centrifugal blower takes more flow there, not less, so no current drop is made up) */ |
| 206 | `src/analog/engine/boiler.js:628` | OTHER | review | read the code block at fix time; pick physics or doc | all loads: the change with flow is NO-SOURCE. |
| 207 | `src/analog/engine/boiler.js:773` | TRAINER | #6 | fault rate of the Instructor faults; decided with the Instructor card | open = seal deflated (< 5 bar). Stroke 2 s, seal inflation 1 s: NO-SOURCE (O&M 2.8 only gives the 5 s fault timer: |
| 208 | `src/analog/engine/boiler.js:777` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | O.0259 -> I.0200 ~ I.020F), stroke 3 s NO-SOURCE. |
| 209 | `src/analog/engine/boiler.js:780` | SETTING | PC doc | instrument list / switch data sheets (set point, dead band) | OUT3 = enabled AND I.0169) at 30 % of the dispensing vessel: NO-SOURCE (the probe heights are not in the O&M). |
| 210 | `src/analog/engine/boiler.js:784` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | 20 / 20 NO-SOURCE. Conflict noted: the VENT TIMER is 3 s in the O&M 2.8 and 6 s in the as-built PLC (xls sheet 30); the |
| 211 | `src/analog/engine/boiler.js:791` | OTHER | PC doc | limestone / sand O&M (JAT 130225-OMM-01), limestone_logic.xls | 0.05 per T/H of limestone: NO-SOURCE (between the DITL-LS230 LOW 0.5 and the O&M 2.5 blockage 1.5 bar; design |
| 212 | `src/analog/engine/boiler.js:792` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | back pressure 1020 mmAq at the boiler). Time constants 1 s (vent), 4 s (equalising), 3 s (conveying): NO-SOURCE. |
| 213 | `src/analog/engine/boiler.js:822` | OTHER | PC doc | limestone / sand O&M (JAT 130225-OMM-01), limestone_logic.xls | 0.6; /* NO-SOURCE: the dispensing vessel above its LSL at the 150 MW start (19.PNG: feeding STOP, no filling) */ |
| 214 | `src/analog/engine/boiler.js:927` | TIME | PC doc | valve / MOV / motor data sheets (stroke, run-up), DITL timers | 4.2.1). NO-SOURCE: valve stroke 2 s, seal 1 s, vessel pressure while conveying 2.0 kg/cm2 (L5-2 gives only the end of conveying, |
| 215 | `src/analog/engine/boiler.js:1020` | OTHER | PC doc | limestone / sand O&M (JAT 130225-OMM-01), limestone_logic.xls | NO-SOURCE (O&M L6 JAT 130225-OMM-01 p 4 ~ 10 searched 2026-11-11: charging ends at the high level or the charging time, not printed; |
| 216 | `src/analog/engine/boiler.js:1025` | OTHER | review | read the code block at fix time; pick physics or doc | supply pressure, not at the unit header under full plant use (U.paPU 6.8, whose 0.2 drop is NO-SOURCE); decided by SEULGI 2026-11-04 |
| 217 | `src/analog/engine/boiler.js:1139` | OTHER | review | read the code block at fix time; pick physics or doc | NO-SOURCE, the diesel analysis is not in the docs). */ |

## History marks (already sourced)

- `src/digital/parts/03b-sim.js:684`
- `src/analog/engine/face-defaults.js:803`
- `src/analog/engine/face-defaults.js:818`
- `src/analog/engine/hx.js:57`
- `src/analog/engine/tcs.js:91`
- `src/analog/engine/tcs.js:107`
- `src/analog/engine/gen-panel.js:18`
- `src/analog/engine/elec.js:9`
- `src/analog/engine/elec.js:15`
- `src/analog/engine/source.js:96`
- `src/analog/engine/unit.js:1766`
- `src/analog/engine/unit.js:1913`
- `src/analog/engine/unit.js:2675`
- `src/analog/engine/unit.js:5560`
- `src/analog/engine/boiler.js:60`
- `src/analog/engine/boiler.js:66`
- `src/analog/engine/boiler.js:71`
- `src/analog/engine/boiler.js:481`
- `src/analog/engine/boiler.js:747`
- `src/analog/engine/boiler.js:925`
- `src/analog/engine/boiler.js:1134`
- `src/analog/engine/boiler.js:1135`

## UI notes (signals a page does not show)

- `src/ui/plant/hmi-mock.js:12`: - [data-ns]      NO-SOURCE in the app (no signal and no plant model): '-----' grey, never a snapshot number;
- `src/ui/plant/hmi-mock.js:140`: /* NO-SOURCE */
- `src/ui/plant/hx/hx-page-limestone-sand.js:27`: NO-SOURCE in the app: the speed of the limestone feeder (ST-M1311 has no signal in hx-registry.js). */
- `src/ui/plant/hx/hx-page-sootblowers.js:23`: NO-SOURCE in the app: number of blowers blowing, forward / reverse and warm-up timers, MV-SB1001 position in %. */
- `src/ui/plant/hx/sys/hx-sys-ts.js:8`: oil pumps and pressures = tcs.js (the same numbers as the 036 TURBINE OIL page). NO-SOURCE: MSV / RSV positions, DS, 52L1, field and
- `src/ui/plant/hx/sys/hx-sys-cls.js:9`: sand PLC sheets DITL-771 ~ 777 and boiler.js AN_SD. NO-SOURCE: coal calorie correction, coal / power ratio, rotary feeder speed,
- `src/ui/plant/hx/sys/hx-sys-ov.js:8`: cdP, turbine speed rpm); the CCS controllers HIC-ULD, EIC-TM, PIC-COBM, HIC-BM, FIC-CM open their faceplate. total air flow = ABC-006 SI0060. NO-SOURCE: load ra
- `src/ui/plant/hx/sys/hx-sys-sb.js:9`: logic tag; the mockup writes PIC-SB1053). NO-SOURCE: number of blowers blowing, forward / reverse and warm-up timers, MV-SB1001
- `src/ui/plant/hx/sys/hx-sys-ea.js:8`: transmitters of the I/O list. NO-SOURCE: the ESP (no snapshot, no signal), fly ash silo, cooler inlet valves XV-BH1060A ~ D, cooler
- `src/ui/plant/hx/sys/hx-sys-sp.js:11`: (NO-SOURCE): make-up conductivity / silica, saturated steam conductivity, the silica analyzers, the tank level switches. */
- `src/ui/plant/hx/sys/hx-sys-ms.js:9`: turbine speed of the plant model (AN.unit.rpm). NO-SOURCE: turbine stop / control / reheat valves, XV-CR1901, FV-CR1902. */
- `src/ui/plant/hx/sys/hx-sys-pt.js:8`: fan faceplates (DITL-25A / 26A / 27A / 28A). NO-SOURCE: the purge time (the 300 s ON-DELAY of DITL-02 has no readout). */
- `src/ui/plant/hx/sys/hx-sys-fg.js:7`: air preheater DITL-43, controllers of the logic, transmitters of the logic else the plant model (boiler.js AN_FN). NO-SOURCE: gas
- `src/ui/plant/hx/sys/hx-sys-gn.js:10`: (unit.js anGenEl: data sheet GAE-2013-0136 R2 + snapshot 37.PNG). NO-SOURCE: the TCS-only values, cooling air, stator coil, 86G-A / B,
- `src/ui/plant/hx/sys/hx-sys-ex.js:8`: extraction values = the logic transmitters, else the plant model (unit.js anFwTagStep). NO-SOURCE: air-assisted check valves
- `src/ui/plant/hx/sys/hx-sys-db.js:9`: #D, atomizing air valve DITL-07 / #B ~ #D. NO-SOURCE: flame detectors BT-DO1043-x, oil master ON / OFF, total diesel oil used, the purge air valves XV-PA1043-x3
- `src/ui/plant/hx/hx-page-extraction.js:17`: Drawn simpler: the air assisted check valves XV-TS1700 ~ 1740 are not drawn (NO-SOURCE: not in the DCS input / output
- `src/ui/plant/hx/hx-real.js:18`: shape of the casings, the condenser inside and the foundation are a picture only (NO-SOURCE: no turbine section drawing in
- `src/ui/plant/hx/hx-page-turbine.js:20`: NO-SOURCE in the app, as on page 13 (not shown): disconnecting switch, differential expansion, rotor position, thermal
- `src/ui/plant/hx/hx-page-purge-trip.js:18`: NO-SOURCE in the app (as on page 10): the purge time (the 300 s on-delay of DITL-02 has no readout).
- `src/ui/plant/hx/hx-page-generator.js:15`: NO-SOURCE in the app (as on page 17): generator lockout 86G-A / 86G-B, water and oil leakage. The three phase voltages and
- `src/ui/shellc/shellc-pages.js:397`: auto synchronizing (25X1), sync check 25 permit (dV 5 %, dF 0.15 Hz, dTheta 10 deg), close command. The grid is 13.8 kV (1.0 pu, NO-SOURCE). */
- `src/analog/engine/source.js:14`: Numbers marked NO-SOURCE are not in the documents searched (user 2026-11-11: no ASSUMED). */
- `src/analog/engine/source.js:149`: /* loop 11, bypass desuperheaters: the outlet temperature needs steam through the bypass (full from 3 % of the MCR flow, NO-SOURCE; the L21 sheets give the mini
- `src/analog/engine/boiler.js:3`: anUnitStep: one line each). Every number has its source here and in docs/versions/v3.2.1/DIESEL_OIL_PLANT_MODEL.md; NO-SOURCE =

## Batch 1 result: `src/world/plantsw.js` and `src/digital/parts/03b-sim.js` (2026-11-24 00:35 PHT)

Checked by hand. None of these is a value that physics gives: a switch dead band (reset differential), a package switch set point and a valve closing time are properties of the device, written on its data sheet. A number made up "so it behaves" would be a new ASSUMED, so **no code was changed**. Each one waits for one PC read (the coordinator batches them):

1. `plantsw.js:11` dead band 10 mm / 10 mmH2O of the drum level, furnace pressure, deaerator and hotwell switches (LSL / LSH / LSHH / LSLL-BR1001, PSHHH / PSHH / PSLL-FG1085 ~ 1087, LSLL-CD1104-4, LSLL-CD1110). Read: `over-all-instrument-list.xlsx` (set / reset or differential column of these tags), then `alarm-list.zip` 20160912 sheets LS / PS (reset value), then the switch vendor data sheet if neither has it.
2. `plantsw.js:30` (ASSUMED) and `:37` dead band 0.2 kg/cm2 of PSL-IA1706 and of PSH-DO1043-x1 / PSL-PA1043-x1. Read: the same two lists; for the burner switches the M&S BMS package (1612 13-4-105) instrument list.
3. `plantsw.js:46` (ASSUMED) and `:56` dead band 2 C / 0.5 mm/s of the ACWP and SWP motor temperature and vibration rows. Read: alarm list 20160912 (TE-CW1108, TE-SW1501, VT-SW1501 reset); else the motor RTD / vibration monitor setting sheet of the pump vendor.
4. `plantsw.js:64 ~ 65` LS-MU0708-A / B dead band 0.05 m, and FS-CW1060-x1 / x2 set point 150 m3/h with dead band 50. Read: alarm list for LS-MU0708; bottom ash screw cooler O&M (BAC E130122B) for the FS-CW1060 package flow switch set point.
5. `plantsw.js:121` fan inlet vane end switches ZSC <= 2 % / ZSO >= 98 % (FG1056-1, FA1053-1, FA1054-1). Read: Cheng Chen fan instruction manual (`fan-instruction-manual-SAF-PAF-IDF.pdf`, actuator / limit switch section) and the actuator data sheet.
6. `plantsw.js:266` delay of the vibrating screen S-1092-A / B running contact (none now). Read: bottom ash PLC logic (`bottomash-limestone-logic.zip`, DITL-BA59 / BA63) for a timer on the running feedback.
7. `03b-sim.js:692` closing time of MV-AS1397 and MV-TS1400 (10 s kept): not in the valve list of K1AU3-E2-0-122 RA (33 items). Read: P&ID (`flow-diagram-K1AU3-A1-0-001.zip`, RB first) for their size and class; then the actuator sheet of the same size and class in K1AU3-E2-0-122, or the MOV vendor list.
