/* 3.2.3-beta.104 / beta.106 (JENNIE): ID fan speed ST-LO1756 against the hydraulic coupling PICFG108 MV: 0 % 350 / 46.1 % 872 / 100 % 1140 rpm */
const AN_IDF_CRV = [
  [0, 350],
  [46.1, 872],
  [100, 1140]
];
function anIdfN(m) {
  const c = AN_IDF_CRV,
    x = Math.max(0, Math.min(100, +m || 0)),
    i = x <= c[1][0] ? 0 : 1;
  return c[i][1] + ((c[i + 1][1] - c[i][1]) * (x - c[i][0])) / (c[i + 1][0] - c[i][0]);
}
/* 2.2.0-beta.9 (M2, user: "sundin ang plant physics"): UNIT MODEL. The boiler and the turbine as ONE plant, so that a load change
   moves the plant and not only the demands of the drawing:
     coal (feeder feedrate transmitters, ABC-004A / B / C) -> firing (lag) -> steam made in the drum -> stored energy = drum
     pressure -> turbine valves of the TCS -> main steam flow -> MW.
   The TCS (turbine control system) is outside the DCS drawings: it opens the turbine valves until the generator MW equals the
   turbine master demand of ABC-001C (EIC-TM, MAN station: MW demand + pressure correction LN55). The boiler master of ABC-001C
   (feedforward LN54 + pressure PID PIC-COBM) answers the main steam pressure of this model.
   It runs only while the plant is in service ("Start at 150 MW"): Reset = cold boiler, as before.
   Numbers (docs/versions/v2.2.0/DRAWING_TRACE.md beta.9):
     - anchor: the plant at "Start at 150 MW" (MSF 474.1 T/H, drum 134.2, MSP 122.6 kg/cm2, MW of the transmitters);
     - steam per coal a and MW per steam c: the two loads of the snapshots (4.PNG / 03.png about 150 MW: coal 88.6 T/H,
       MSF 474.1 T/H, 150.5 MW; 02.png: coal 41.8 T/H, MSF 203.7 T/H, 60.3 MW);
     - superheater pressure drop: drum 134.2 - MSP 122.6 at 474.1 T/H, proportional to the flow squared;
     - storage C, firing lag, MW lag and the TCS speed: not in the repository; typical values of a 150 MW drum boiler (ASSUMED,
       written here so they can be changed) */
/* 1.0.0-beta (JENNIE, heat balance study 2026-11-21): THE STEAM SPACE STORAGE of the drum pressure. Before, AN_UNIT.C was 1500
   (T/H) x s per kg/cm2, ASSUMED from the tuning of the plant, added to the storage of the water and steel (Cw, T8 Tab 2 + B-0-001):
   the flash of the boiler water when the pressure falls was counted twice (effective 2,800 at 75 MW). The steam itself only stores
   its own mass: d(rho) / dP x volume (IAPWS-IF97 at 116 bar):
   - drum steam space at the normal level: half of 1.676 m ID x 12.48 m tangent + heads (K1AU3-B-0-004) = 15 m3, saturated steam
     0.88 kg/m3 per kg/cm2 = 13 kg;
   - superheaters 75.8 m3 (T8 Tab 2 HYD less the water parts), superheated about 450 C, 0.42 kg/m3 per kg/cm2 = 32 kg;
   - main steam line to the stop valves: NO-SOURCE, about 20 m3 (8 kg).
   53 kg per kg/cm2 = 190 (T/H) x s per kg/cm2 (CALC). The old field C of a save is not read */
/* Phase 11 (KANA, 2026-11-27): THE SUPERHEATER PRESSURE DROP, drum to SH outlet. Turbulent flow in the SH tubes at a Reynolds number
   far above the transition (the friction factor nearly constant): dP = f (L / D) rho V^2 / 2 = k m^2 / rho, the mass flow m and the
   mean steam density rho of the superheaters. k from the one design point, DESIGN-SRC: FHI P2S7 Tab 3 (page 2-7-TAB_3-1) at MCR:
   460 T/H, SH outlet 129 kg/cm2 G and 541 C, "Superheater Pressure Drop 16 kg/cm2" (drum 145 kg/cm2 G). rho = the mean of the
   saturated steam at the drum and the steam at the SH outlet (IF97, steam.js). Same law at every load and state; the flow is the steam
   through the SH (main steam to the turbine; the other outlets are taken after the SH outlet, as the drawing PD-012 shows).
   Before: kdp = (drum - MSP) / MSF^2 of the plant snapshot at 150 MW (134.2 - 122.6 at 474.1 T/H), a constant fitted to one plant (NO-FIT-OK: history note)
   reading with no density term (no-fit baseline, Audit 3 ranking 5). U.kdp is kept as the name the valve flow solve reads. */
/* The tap pressures inside the chain, PT-BR1130 (after SH panel #1 = spray 1 point) and PT-BR1150 (finishing SH inlet = spray 2
   point), are the drum less the share s1 / s2 of this drop. The shares are where the taps sit along the drop, read on the plant
   transmitters of 03.png (150.5 MW: drum 134.2, PIBR1130 127.8, PIBR1150 124.9, MSP 122.6: 6.4 / 11.6 and 9.3 / 11.6). OPEN (Phase 11,
   KANA): the share from the tube geometry needs the panel SH drawings (C series, not in the documents; hx.js); until then the shares
   stay and the size of the drop is the design law. Before, the taps took 6.4 / 9.3 kg/cm2 x (MSF / 474.1)^2 by themselves. */
const AN_SHDP = { dp0: 16, m0: 460, Po: 129, To: 541, s1: 6.4 / 11.6, s2: 9.3 / 11.6 };
/* the pressure at the share s of the SH drop (kg/cm2 G), drum Pd, steam through the SH m (T/H) */
function anShTap(U, s, Pd, m) {
  const k = isFinite(U && U.kdp) ? U.kdp : AN_SHDP.dp0 / (AN_SHDP.m0 * AN_SHDP.m0);
  return Pd - s * k * m * m;
}
function anShRho(Pd, Po, To) {
  return (steamRho(Pd, steamTsat(Pd)) + steamRho(Po, Math.max(steamTsat(Po), To))) / 2;
}
function anShKdp(U) {
  const D = AN_SHDP,
    k0 = D.dp0 / (D.m0 * D.m0);
  if (!AN_SHDP.rho0) AN_SHDP.rho0 = anShRho(D.Po + D.dp0, D.Po, D.To);
  if (!U || !isFinite(U.Pd) || U.Pd <= 0) return k0;
  const To = U.hxO && isFinite(U.hxO.ms) ? U.hxO.ms : steamTsat(U.Pd),
    Po = isFinite(U.Pms) && U.Pms > 0 ? U.Pms : U.Pd,
    rho = anShRho(U.Pd, Po, To);
  return isFinite(rho) && rho > 0 ? (k0 * AN_SHDP.rho0) / rho : k0;
}
const AN_STORE = { cs: 190 };
const AN_UNIT = {
  on: false,
  /* sweep 34 (Mina beta.175: AN.unit.MW read NaN once right after a chip load): a load begins with the Reset (anStateInPlace back to
     this object), which had no MW, so MW was undefined until the starting state set it (MW0 / 0). The generator gives 0 MW until then */
  MW: 0,

  tcs: 20 /* s, not used since 1.0.0-beta.304 (the MW loop takes the TCE195 gains, AN_TCE195); kept for the save points */,
  /* other steam outlets of the main steam line, flow at 100 % open and the anchor pressure, as a share of the anchor flow (the valve
     sizes: valve sheets below): ABC-050 PICMS1006 HP turbine bypass PCV-MS1020 (main steam -> cold reheat) and
     ABC-013 PICMS1002 main steam blow-off PCV-MS1001 (start-up vent to the silencer) */
  /* the HP bypass PCV-MS1020 and the blow-off PCV-MS1001: their flow by the valve law and the vendor Cv (turbine.js AN_VLV, anVlvW;
     Phase 11 rank 9, was the shares hpb 0.48 / blo 0.46 of the anchor flow) */
  /* 2.2.0-beta.11 (M2 steps 1 ~ 3): reheat, temperatures, O2.
     - Reheat pressure (ABC-052 PT-HR1003-1 / -2, ABC-019 PT-CR1006 cold reheat, ABC-052 PT-ST1001 first stage): the IP / LP turbine
       is a fixed nozzle, so its inlet pressure is proportional to the steam through it (design: RH 401 T/H, MHPS HB PPE-14-0725 p6 HRH 400,944 kg/h, MB-012; the FHI "181.9 T/H" is lb/h read as kg/h; at 36.6 / 35.1 kg/cm2
       at MCR; 02.png: 15.0 kg/cm2 at 203.7 T/H, 4.PNG 34.0 at 474 T/H: 34.0 x 203.7 / 474 = 14.6). The HP bypass PCV-MS1020
       (ABC-050) adds steam to the cold reheat; the LP bypass PCV-HR1003 (ABC-052) takes steam out of the hot reheat (size as the
       valve sheet L21, lpb below). Reheater volume lag tauRH (NO-SOURCE).
     - SH / RH temperature versus load (boiler manual SECT_7 Fig 6 "SH & RH steam temperature versus load": 541 C from 100 to 60 %
       MCR; Fig 10 "SH spray versus load": spray 2.7 % of MSF at 100 %, 1.95 at 85, 1.1 at 70, 0 at 60 % MCR). The spray loops
       (ABC-011 TICBR1130, ABC-012 TICBR1150, ABC-019 TICHR1002) see a load disturbance: at 60 % MCR the spray of the snapshot is
       all closed and the temperature is still at the set point; below 60 % the temperature falls, by the slope of the snapshots
       (02.png at 203.7 T/H = 44 % MCR: MST 517 C, RHT 499 C; 4.PNG 542 / 542): the drop is linear in load (ASSUMED).
       The headers after the spray (ABC-011 TT-BR1140 SH no.2 outlet, ABC-012 TT-MS1004 finishing SH outlet) are the spray outlet
       plus the heat pickup of the next superheater, taken at the anchor (ASSUMED constant), with the metal lag tauT (ASSUMED).
     - O2 (ABC-002 AT-FG1122 / 1123): O2 = 21 x (1 - stoichiometric air / total air), total air = PA + SA + FA of ABC-006 (FT-FA1071,
       FT-FA1081, FT-FA1055), stoichiometric air per T/H of coal AN_GAS.afs (boiler.js, FHI Tab 3); it replaced the anchor (O2 4.3 % at the snapshot air and coal: excess air
       about 26 %; design 20 %). Analyzer lag tauO2 (ASSUMED). PA to the furnace FT-FA1079 (ABC-006 indicator) follows the PAF flow */
  /* the LP bypass PCV-HR1010: turbine.js AN_VLV.lpb (Cv 1700, Phase 11 rank 9; was lpb 1.05 of the anchor flow). tauRH (10 s) deleted:
     read nowhere (audit B6) */
  /* 2.2.0-beta.16 (M4 step 3, bypass system and pressure raise): while the turbine is shut (cold start, before the roll) the reheater
     is a closed volume: the HP bypass fills it, the LP bypass (ABC-052 PCV-HR1003) and the RH blow-off (ABC-054 PICHR1391, PR-OPE-5002
     "Reheat blow-off MVHR1391 open" for warming, closed when the LP bypass is in service) empty it. Crh = steam stored per kg/cm2 of
     hot reheat pressure ((T/H) x s per kg/cm2; the reheater alone is 60 m3 (FHI T8T2 60,068 kg of water, hydro test 60 m3; RH alone Crh = 120), the piping volume is NO-SOURCE, about 200 m3 in all kept: steam at
     7.6 kg/cm2 is about 4 kg/m3, so about 110 kg per kg/cm2 = 400 (T/H) x s; 40 T/H through the HP bypass fills 0 -> 7.6 kg/cm2 in
     about 75 s); rhb = size of the RH blow-off as a share of the anchor flow at the anchor reheat pressure (silencer, below) */
  /* Crh (the reheater steam storage) and rhb (RH blow-off) are turbine.js AN_VLV.Crh / rhbT (engine constants, Phase 11 rank 9) */
  /* 2.2.0-beta.17 (M4 step 4, turbine roll / sync / load up; PR-OPE-5002 4.4 ~ 4.6): the turbine and its TCS are a black box outside
     the DCS drawings (the DCS only sees the TCS digital inputs of the I/O list and the TARGET MW feedback AI0420). State U.tb:
     st 'off' (stop valves shut) -> 'roll' (rpm ramps at rollRate, IP START MODE: the ICV lets roll steam from the hot reheat, icvRoll)
     -> 'sync' (3600 rpm, the TCS closes the GCB: I.0931 = 1 / I.0932 = 0, INITIAL LOAD 4.5 MW on the ICV) -> 'load' (LOAD UP
     at rate MW/min = 5 % of 150 MW per minute; the HP control valves open as the flow demand passes the CV opening bias (anTbFlow), ICV -> CV
     TRANSFER COMPLETE I.0418 = 1, "transfer at 20 MW or HP bypass closed"). While the generator is on the grid the MW is the HP
     steam and the IP / LP steam, each x its enthalpy drop (turbine.js tbPath, Stodola + IF97, Phase 11), less the losses (anTbGen). Before the transfer the IP / LP steam comes from the HP bypass through the
     reheater (U.rr integrator of beta.16, with the ICV flow out). DCS CONTROL MODE PERMISSIVE I.0081 (3.2.3-beta.135, TCS soft logic
     TCE 331DM09784 p.127 TCE180, read 2026-11-12 on the PC): the NOT of the reset group of DCS CONTROL MODE = 52G closed, no TURBINE
     TRIP, no FORCED CLOSE (HOUSE LOAD OPERATION), and in IP START the TRANSFER REGION COMPLETE(IP); was MWperm 45 MW (the NORMAL
     OPERATION select of PR-OPE-5002, an operator step of the ATS, not this permissive). Not modelled from that group: GOV. MANUAL, LLM
     MANUAL, GEN. MW ABN., TARGET MW DEMAND ABN., IP LIMITING (the operator does not select them here). DCS CONTROL MODE ON I.0082 set by
     the pulse O.0178 of ABC-001C while I.0081, reset by O.0179 or by the reset group (permissive lost); while ON the TCS target load
     tracks GEN. MW (TCE p.134), so at OFF the TCS holds the load it has. These inputs are written by the model in every plant state (3.2.5-beta.8; before only in a start-up, U.cold); the snapshot of
     "Start at 150 MW" gives the first values only. */
  rollRate: 120 /* rpm/min, PR-OPE-5002 cold start (the holds at 1800 / 3600 rpm of the procedure are the operator's; not modelled) */,
  icvRoll: 0.13 /* ICV opening for the roll steam (about 14 T/H at 7.6 kg/cm2 reheat, NO-SOURCE: the SOP gives CV 10 / 3 % at 400 rpm, no ICV opening) */,
  /* 3.2.3-beta.240 (live Cold start Load up): the TCS flow demand splits to the ICV and the CVs (TCE 331DM09784 p.141 TCE207 FLOW
     CONTROL(2), A007 HEAT SOAK CONTROL: CV OPENING BIAS SG C008 K:20.0 %, ICV MIN OPENING K:-0.5 %, RI / RD 0.03 % per 30 ms cycle = 1 %/s;
     p.144 TCE212 / p.145 TCE214: CV and ICV demand through FG (PARA-LIST, NO-SOURCE) to the VALVE CONTROL MT1, ICV opening speed SG C007
     K:10.0 %/s). cvBias = the flow demand where the CVs start to open (IP START); fdRate = 1 %/s; vRate = 10 %/s (CV taken the same, NO-SOURCE) */
  cvBias: 0.2,
  fdRate: 0.01,
  vRate: 0.1,
  MWinit: 4.5 /* PR-OPE-5002: initial load 4.5 MW */,
  rateUp: 7.5 /* MW/min = 5 % / min (PR-OPE-5002 LOAD UP), AI0421 max load-up rate 0 ~ 5 %/min */,
  tauT: 362 /* metal over steam: SH steel 232 t (B-0-001) x 0.5 kJ/kg K = 116 MJ/K, over 128 kg/s x 2.5 kJ/kg K = 0.32 MW/K */,
  tauO2: 20,
  mcr: 460 /* T/H, boiler MCR (SECT_7) */,
  /* 2.2.0-beta.12 (M3, trips). The DCS drawings give the LOGIC of a trip (force manual, BU-CMD, interlock); the plant answers:
     - TURBINE TRIP (STN102 I.0400 TCS-DI1003 "#1 Turbine trip", FROM ARP; memory list STN101 M.3200 "T/B TRIP (BC FROM S2)" and
       M.3220 "52G1 OPENED (BC FROM S2)" <- I.0932 "GCB 52G1 off"): the station wiring broadcasts the S2 inputs to S1 (bcast below,
       so one input of the operator trips the whole DCS). The TCS closes the turbine valves (tauTrip 1 s, NO-SOURCE: the valve closing time is in the PC-only TG valve scans, asked of Jennie): no steam to the
       turbine, MW 0; the HP bypass (ABC-050) and the blow-off (ABC-013) take the steam. TURBINE TRIP is an MFT first out of the
       DITL (STN104 memory list M.053F / B.125F "TURBINE TRIP FIRST OUT"; PR-OPE-5003: the alarm is bypassed only for a normal
       shutdown), so the boiler trips with the turbine and cools down through the bypass; the pulse M.0124 / M.0256 of ABC-050 is
       also for HOUSE LOAD / 52G OPEN (I.0932 / I.0937), where the boiler keeps running (not in the trip test).
     - NO BFWP RUNNING (ABC-010 M.3343 / M.3344 <- STN103): the feedwater flow is 0 whatever the valve (FICFW1007 and the start-up
       valve LICBR1001B: plant.js pr.mul); the drum level falls at the steam flow (plant.js integrating level) to the low low
       (ABC-010 M.0170 ~ M.0172, -254 mm) where the DITL trips the boiler (STN104 M.3407 DRUM LEVEL L.L.).
     - FAN STOPPED (ABC-007 M.3302 PAF / M.3303 SAF, ABC-008 M.3304 IDF <- STN103): the air flow of a stopped fan is 0 (pr.mul on
       FICFA1071 / FICFA1081); the furnace pressure (ABC-008 PICFG108 / 108A, PT-FG1085 / 1086 / 1087) is air in minus flue gas
       out: more air in than the ID fan takes out raises it (kfp mmH2O at twice the air of the anchor, ASSUMED: the range of the
       instrument is +-600 mmH2O, FURNACE PRESSURE HIGH > 30 mmH2O M.3107), a stopped ID fan takes nothing out (plant.js pr.uf = 0
       on the IDF command).
     - MFT (I.000F "MFT FROM IRP" on every station, STN101 M.0341 MFT TPs, coal feeders stopped M.3400 ~ M.3402): the coal is 0
       (plant.js feeder model), the steam made decays with tauF, the pressure falls to MAIN STEAM PRESSURE LOW LOW (M.310D, 72.9).
     The DITL consequences (fan trip -> MFT, drum level L.L. -> MFT, MFT -> turbine trip) are the DITL's: with the one world OFF the
     operator forces them (CLAUDE.md 7, user 2026-10-16) */
  tauTrip: 1,
  /* 3.2.3 house load speed (SAKURA): TCE 331DM09784 p.140 TCE206 FLOW CONTROL: rated 3600.0 rpm, droop 6.0 %, flow span 87.3 (read:
     6 % speed = 87.3 % flow demand); the FG*1 table of the same sheet gives 0.0 % at -7.2 / 0.0 / 7.2 rpm: dead band +-7.2 rpm (the
     table points beyond it not read: linear outside the band). Hgen = inertia constant of the whole machine (turbine + generator +
     exciter): GAE-2013-0136 R2 GENERATOR DATA SHEET (as built) p.2 "Inertia constant @ rated kVA, H (kW sec/kVA) 4.01" (GD2 turbine /
     generator + exciter 23,700 / 16,200 kgm2: CALC J = 39,900 / 4 = 9,975 kgm2, 0.5 J (377 rad/s)^2 = 709 MJ / 176.5 MVA = 4.0 s).
     Check: full load rejection "about 106 percent in about one second" (TG operator manual tg-2-1-1 p.137, STIE-14788); the EOS
     110.5 % (IBD SC90794 sheet 35) is the IBD logic of the app (tcs-ibd-data.js) */
  droop: 0.06,
  flowSpan: 0.873,
  /* 3.2.4-beta.11 (priority list: load rejection): the steam between the valves and the blading still drives the shaft after the valves
     close. HP part (behind the CVs): steam chest tSc; IP / LP part (behind the ICVs): the crossover pipe to the LP turbine tXo. Textbook
     typical values of the IEEE steam turbine model (Kundur, Power System Stability and Control, ch. 9: T_CH 0.2 ~ 0.3 s, T_CO 0.4 ~ 0.6 s);
     NO-SOURCE for this unit. The HP / IP-LP split is the steam path of turbine.js tbPath (HP about 25 %, IP / LP about 75 % of the shaft) */
  tSc: 0.3,
  tXo: 0.5,
  Hgen: 4.01,
  dbRpm: 7.2,
  /* GOVERNOR RUNBACK (TCE p.128 TCE182: TW 60 s of HOUSE LOAD OPERATION, or PLU OPERATED): GOV.SET = the runback position (TCE p.136
     TCE196: HP START 24.3 %, IP START 4.2 %; the model has the IP start only, TCE p.27 default) */
  rbIP: 0.042,
  rbT: 60,
  kfp: 150 /* fallback; the authority of the ID fan of the anchored loop model is used when known (anUnitStart) */,
  /* 2.2.0-beta.14 (M4 step 1, PR-OPE-5002 / boiler manual SECT_7 Fig 1 / 2): COLD START. "Start cold" (hmi-op.js anPlantCold) keeps
     the anchors of "Start at 150 MW" (the gains of every loop model) and puts the plant cold: drum 0 kg/cm2, water and bed at the
     ambient, no coal, turbine valves shut (U.turb false until the turbine is rolled, M4 step 4). The physics added here:
     - FIRING = coal + oil of the four start-up burners (ABC-003A ~ D FICDO1043A ~ D, PV SI0070 / 0380 / 0460 / 0480 = AI0515 / 0546 /
       0517 / 0548 0 ~ 3.5 T/H after the gate of the SUPPLY OIL VALVE CLOSE M.3410 / 3411 / 3416 / 3417). One T/H of oil makes ao
       times the steam of one T/H of coal (ao = 2.55: PR-OPE-5002 "2.55 TPH coal = 1 TPH diesel"; the heating values of the design
       data Tab_1 are an image without text); the offset of the firing line (m0 - a x F0) fades out below
       30 % of the anchor coal so that a small fire makes a small steam flow and the anchored behaviour above stays the same.
     - WATER HEAT-UP: below the saturation temperature of the drum pressure the firing heats the water (no steam): Cw (T/H) x s of
       steam-equivalent per C of the boiler water (ASSUMED 200 t of water: 200 t x 4.19 MJ/t/C / 2000 MJ/t x 3600 = 1508); at
       saturation the pressure rises against C + Cw x dTsat/dP (dTsat/dP of the steam table, steam.js; 3.2.0-beta.15), so the saturation
       temperature rises at firing / Cw: 2 burners about 45 T/H steam-equivalent = 107 C/h, the limit of Fig 1 (110 C/h) is the
       operator's duty (firing), as on the plant.
     - BED TEMPERATURE (no DCS transmitter: the bed thermocouples are on the DITL / local; model state U.Tb): first order (tauB) to
       Tamb + (Tb0 - Tamb) x (fuel share / air share) ^ 0.45 (Fig 8: furnace about 850 C at full load; two start-up burners at the
       light-off air give about 450 C = the coal batch permissive of PR-OPE-5002, 400 ~ 450 C; 600 C continuous).
     - STEAM TEMPERATURE while cold: the superheaters cannot give more than the gas (plant.js pr.tcap = the SH / RH tube metal, F11) and not
       less than saturation (pr.tsat); TAB_9: SH outlet <= 535 C before synchronisation */
  Tamb: 30,
  /* F11 (user 2026-11-13: the ratio of beta.206 / 207 was a curve fit, not a model). Superheater and reheater tube metal, heated by the flue
     gas, cooled by the steam that flows (anUnitStep0, U.cold only):
     - metal mass: GA p6 K1AU3A-201 rev 1 "PRESSURE PARTS EMPTY WEIGHT" (13-thermal-masses): SH = backpass walls 121.01 + in-furnace SH
       80.58 + finishing SH 151.67 = 353.26 t; RH = 243.10 t. Steel specific heat 0.5 kJ/kg K (textbook carbon / low-alloy steel).
     - gas side UA at MCR, CALC from the design heat balance (T1 / T3 / Fig 8): SH 460 T/H, drum 145 kg/cm2 g saturated vapour (h about
       2,625 kJ/kg) to 541 C at 129 kg/cm2 g (h about 3,443): 104.5 MW; gas = furnace outlet 840 C (Fig 8, 100 %), metal about the mean
       steam (340 + 541) / 2 = 440 C: UA = 104.5 MW / 400 K = 261 kW/K. RH 401 T/H (MB-012), 370 C / 36.6 (h about 3,145) to 541 C / 35.1
       (h about 3,545): 44.6 MW, metal about 455 C: UA = 44.6 MW / 385 K = 116 kW/K.
     - UA moves with the gas flow ^ 0.6 (forced convection over tube banks, Colburn / Grimison exponent, textbook); gas flow = the total
       air (the fuel is under 10 % of the gas mass). The gas cannot give more than it carries: Q <= gas x 1.15 kJ/kg K (flue gas, textbook)
       x (gas - metal). The gas temperature: the bed, less the upper furnace walls, then the cyclone refractory (AN_FG, beta.230).
     - steam side: the steam leaves at the metal temperature (film coefficient far above the gas side); it takes steam x 2.2 kJ/kg K x
       (metal - inlet), inlet = saturation (SH) / the cold reheat temperature, HP bypass outlet and HP exhaust mixed (RH, beta.227).
       No steam flow: the metal and the stagnant steam heat from the gas alone. */
  shM: 353.26e3 * 0.5 /* kJ/K */,
  rhM: 243.1e3 * 0.5 /* kJ/K */,
  shUA: 261 /* kW/K at the anchor air, CALC above */,
  rhUA: 116 /* kW/K at the anchor air, CALC above */,
  /* reheater outlet pipe at TT-HR1002 (outlet header and hot reheat pipe to the thermowell): 20 t steel x 0.5 kJ/kg K (NO-SOURCE: no
     pipe weight in the docs), lagging loss 0.02 kW/K (NO-SOURCE, about 6 days to cool) */
  rhPipeM: 10000 /* kJ/K */,
  rhPipeUA: 0.02 /* kW/K */,
  ao: 2.55 /* PR-OPE-5002 4.3.x: "Approximately: 2.55 TPH coal = 1 TPH diesel" (2.2.0-beta.15; beta.14 had 2 ASSUMED) */,
  /* 2.2.0-beta.15 (M4 step 2, coal transfer): the coal burns only in a hot bed: burnt share 0 at 350 C, 1 at 600 C; the rest leaves
     unburnt. 3.2.3-beta.91 sources: Tburn1 600 = PR-OPE-5002 continuous feeding above 600 C. Tburn0 is bounded, not given: below 400 C,
     because PR-OPE-5002 (start-up 6.x b / c) batch-fires at 400 ~ 450 C and checks the CO, SOx and lower furnace temperature rise of
     each batch (so coal burns at 400 C); the ignition temperature of the coal is not in the docs (FHI T9 p5: the coal permissive is
     coal-dependent, set at commissioning). 350 and the straight line between are NO-SOURCE inside that bound. */
  Tburn0: 350,
  Tburn1: 600,
  Cw: 1726 /* water 175.6 t (T8 Tab 2) x 4.18 + evaporative steel 437.7 t (B-0-001) x 0.5 kJ/kg K = 953 MJ/K, in units of 0.554 MW */,
  kcool: 60 /* 2.2.0-beta.21: cooling of the unfired boiler by the air, T/H steam-equivalent at the anchor air and 300 C (ASSUMED, Fig. 5) */,
  kamb: 1 /* 2.2.0-beta.21: bottled boiler loss to the ambient, T/H steam-equivalent at 300 C (ASSUMED) */,
  tauB: 900,
  Tb0: 850,
  /* 3.2.0-beta.15 (phase B, utilities): CONDENSER VACUUM. The turbine exhausts to the condenser, cooled by the seawater pumps (SWP-A ~ C
     M.3353 ~ M.3355) with the condensate pumps (CP-A / B M.3350 / M.3351) taking the water out (PR-OPE-5002: SWP, CEP and VACUUM UP
     before the turbine is rolled). The vacuum (share 0 ~ 1) rises in vacUp s once a SWP and a CEP run (vacUp below, ED 066 p15) and is
     lost in vacDn s when they stop (1 min, NO-SOURCE: no vacuum decay curve in the docs). The turbine cannot be rolled below 90 %; a
     turning or loaded turbine is tripped by the TCS below 60 % (LOW VACUUM TRIP -> ABC-050 I.0400 TURBINE TRIP) */
  vacUp: 1846 /* ED 066 p15: starting ejector 0.345 kg/cm2 A at 20 min, 65 % of full vacuum */,
  vacDn: 60
};
/* the AI blocks of one address on every sheet (station | address, like "Start at 150 MW") */
function anUnitAIs(key) {
  const out = [];
  for (const sh of AN.sheets) {
    if (/^ABC-000/.test(sh.name) || !sh.S) continue;
    let st = null;
    try {
      st = shStn(sh);
    } catch (e) {}
    const S = sh.S;
    for (const b of S.blk) {
      if (b.k !== 'AI' || !b.o || b.o[0] == null) continue;
      const m = /^(?:S(\d)\s*)?(AI\d{4})$/.exec((AN.nm(S, b.o[0]) || '').trim());
      if (m && (m[1] || st) + '|' + m[2] === key) out.push([S, b]);
    }
  }
  return out;
}
function anUnitVal(list) {
  for (const [S, b] of list) {
    const s = S.rt.st[b.id];
    if (s && isFinite(s.val)) return +s.val;
  }
  return NaN;
}
/* x: one value for every block, or a function of the index (2.2.0-beta.11: each transmitter keeps its own offset of the snapshot) */
function anUnitWrite(list, x) {
  list.forEach(([S, b], i) => {
    const s = S.rt.st[b.id];
    if (!s || b.pins.some(p => p.role === 'out' && S.rt.force[p.n] !== undefined)) return;
    const xi = typeof x === 'function' ? x(i) : x;
    if (!isFinite(xi)) return;
    const r = b.rng,
      y = r ? Math.max(r.lo, Math.min(r.hi, xi)) : xi;
    s.val = s.act = y;
    s.src = 1; /* beta.530 (AKIHO): the model writes this point: it is live (the 150 MW snapshot seed sets s.snap only) */
  });
}
/* the value of every block of the list now (anchor of "Start at 150 MW"), kept on the list */
function anUnitAnchor(list) {
  list.a0 = list.map(([S, b]) => {
    const s = S.rt.st[b.id];
    return s && isFinite(s.val) ? +s.val : NaN;
  });
  return list;
}
/* the unit model stops (Reset = cold boiler): the load disturbance of the spray loops goes too */
function anUnitStop() {
  const U = AN_UNIT;
  AN_SRC.t = -1; /* 3.2.0-beta.14: a new plant state, the source of the loops again (source.js) */
  for (const e of U.ld || [])
    if (e.pr) {
      e.pr.ld = 0;
      e.pr.fr = e.pr.tsat = e.pr.tcap = e.pr.hx = undefined;
    }
  U.cold = false;
  U.turb = true;
  U.etLvl = NaN; /* 3.2.0-beta.63: the expansion tank starts again at its level of 27.PNG (AN_MU) */
  U.cwPrime = NaN; /* live test #50: the closed cooling loop primed as V-CW1001 of the start state (AN_MU) */
  U.mt = {};
  U.iaP = U.paP = NaN; /* 3.2.0-beta.68: the air tanks are set again by the start state (AN_AIR) */
  U.avH = {}; /* 3.2.1 the positions held by the airlocks (AN_AV) */
  U.lpT = undefined; /* 3.2.1 the LP heater temperatures start again at their steady value (AN_LP) */
  U.iaRun = U.paRun = null; /* 3.2.1: the compressors are read again from the DITL (anAirStep) */
  U.acT1 = U.acT2 = NaN; /* 3.2.0-beta.69: the aux cooling water temperatures start again (AN_ACW) */
  for (const m of U.mul || []) for (const p of m.pr) p.mul = undefined;
  for (const z of U.spr || []) z.pr.uf = z.pr.hx = undefined;
  U.lpbSp = null; /* 3.2.1 anCdTagStep: the LP bypass spray controller is found again */
  U.fwC = null; /* 3.2.1 anFwTagStep: its controllers and F(X) are found again */
  U.hxtC = null; /* audit 2026-11-21 anHxTagStep: its transmitters are found again */
  U.asC = null; /* 3.2.1 anAsTagStep: page 08 values */
  U.asT15 = U.asTgs = undefined;
  if (U.fwp && U.fwp.pr) U.fwp.pr.op = U.fwp.pr.hx = undefined; /* 3.2.4-beta.6: hx = the main valve flow (anMainFw) */
  for (const p of U.fp || []) {
    p.pr.uf = undefined;
    p.pr.ld = 0;
    if (!p.pr.src) p.pr.smul = p.pr.sbase = undefined;
  }
  U.on = false;
}
/* start: the plant as it is now (end of "Start at 150 MW") is the steady state */
/* 3.2.3-beta.244: the T/G Modbus valve position inputs of ABC-050 / ABC-051 (CV SI1812 ~ SI1817, ICV SI1821 ~ SI1823, SI1827 ~ SI1829) */
function anVposOf() {
  const lab = (k, t) => {
    const x = AN.sheets.find(y => y.name === k);
    if (!x || !x.S) return null;
    const n = x.S.lab.findIndex(z => z && String(z.t).trim() === t);
    return n >= 0 ? { S: x.S, n } : null;
  };
  const of = ts => ts.flatMap(t => [lab('ABC-050', t), lab('ABC-051', t)]).filter(Boolean);
  /* LMYP OTS valve tests: CV(A) SI1812 ~ SI1814 and CV(B) SI1815 ~ SI1817 apart (a CV test moves one group) */
  return { cvA: of(['SI1812', 'SI1813', 'SI1814']), cvB: of(['SI1815', 'SI1816', 'SI1817']), icvA: of(['SI1821', 'SI1822', 'SI1823']), icvB: of(['SI1827', 'SI1828', 'SI1829']) };
}
/* Phase 6 DCS audit (2026-11-26, QA trace B1): more ABC inputs of the I/O list STN102 that nothing wrote. Kept apart from U.di: the
   150 MW start state (src/data/st150.txt) carries U.di as it was saved, so a new entry there would be lost on that start; a save
   without U.diX makes it on its first scan (as U.vpos).
   - ABC-036 / ABC-037 read their heater's H.H. switch too (I.029F LS-HD1106 No.2 HPH, I.029B LS-HD1101 No.1 LPH; the same switches
     as DITL-41, plantsw.js, alarm list 150 mm); they read 0.
   - the condenser pressure switches PS-CD1110-1 / 2 / 3 (I.004D / I.004E / I.004F, ABC-052), "#1 CONDENSER PRESSURE SWITCH", alarm
     list 2016-09-12 sheet PS: set H -0.86 kg/cm2 (gauge), alarm on 1; flow diagram PD-016. Made while the model condenser pressure
     U.cdP (kg/cm2 abs) is at or above -0.86 + 1.033 = 0.173; they read 0 (good vacuum) even with the condenser at atmosphere */
function anDiXOf() {
  const lab = (k, t) => {
    const x = AN.sheets.find(y => y.name === k);
    if (!x || !x.S) return null;
    const n = x.S.lab.findIndex(z => z && String(z.t).trim() === t);
    return n >= 0 ? { S: x.S, n } : null;
  };
  return {
    hd: [
      [lab('ABC-036', 'I.029F'), 'H6', 150],
      [lab('ABC-037', 'I.029B'), 'H1', 150]
    ].filter(x => x[0]),
    cdps: [lab('ABC-052', 'I.004D'), lab('ABC-052', 'I.004E'), lab('ABC-052', 'I.004F')].filter(Boolean)
  };
}
function anUnitStart() {
  const U = AN_UNIT;
  anUnitStop();
  const sh = AN.sheets.find(x => x.name === 'ABC-001C');
  if (!sh || !sh.S) return;
  const S = sh.S;
  U.S = S;
  /* coal feeder feedrate transmitters (station of each sheet) */
  U.fuel = [
    ['ABC-004A', 'AI0480'],
    ['ABC-004B', 'AI0512'],
    ['ABC-004C', 'AI0544']
  ].map(([k, ai]) => {
    const s4 = AN.sheets.find(x => x.name === k);
    return s4 && s4.S ? anUnitAIs(shStn(s4) + '|' + ai) : [];
  });
  const s1 = shStn(sh);
  U.msp = anUnitAIs(s1 + '|AI0131');
  U.drum = anUnitAIs(s1 + '|AI0128');
  U.msf = anUnitAIs(s1 + '|AI0129');
  U.mw = [s1 + '|AI0419', s1 + '|AI0774'].map(anUnitAIs);
  /* the TCS: TARGET MW SETPOINT FROM TCS (AI0420) and DCS CONTROL MODE ON FROM TCS (I.0082) */
  U.tgt = anUnitAIs(s1 + '|AI0420');
  U.dcs = S.lab.findIndex(l => l && String(l.t).trim() === 'I.0082');
  U.tm = S.blk.find(b => b.k === 'MAN' && b.tag === 'EIC-TM');
  /* the turbine inlet pressure (ABC-050 PT-MS1006-1 / -2, the PV of the HP bypass): the same steam, after the main steam line */
  const s50 = AN.sheets.find(x => x.name === 'ABC-050');
  U.tin = s50 && s50.S ? [anUnitAIs(shStn(s50) + '|AI0416'), anUnitAIs(shStn(s50) + '|AI0512')] : [];
  /* 3.2.1 the lube oil cooler outlet TE-LO1002-1 / -2 (STN102 AI0452 / AI0516, the PV of ABC-053 TICLO1002): AN_LO writes them */
  const s53 = AN.sheets.find(x => x.name === 'ABC-053');
  U.lo = s53 && s53.S ? [anUnitAIs(shStn(s53) + '|AI0452'), anUnitAIs(shStn(s53) + '|AI0516')] : [];
  /* 3.2.1 the hotwell level LT-CD1110 (STN102 AI0640, ABC-031): AN_CD reads it (the suction head of the condensate pumps). PT-CD1117
     (STN102 AI0564) is on no ABC sheet (ABC-015 AI0564 is STN103 ZT-FA1016): the DITL-61B row reads the model (plantsw.js) */
  const s31 = AN.sheets.find(x => x.name === 'ABC-031');
  U.cdHwL = s31 && s31.S ? anUnitAIs(shStn(s31) + '|AI0640') : [];
  /* 3.2.1 (IRENE: HEATER LEVELS): the level transmitters of the five feedwater heaters (STN102 LT-HD110x-1 / -2) and the outputs of
     their primary / alternate drain level controllers (ABC-035 ~ 039): AN_HD writes the levels and reads the valves */
  U.hd = AN_HD.h
    .map(([k, sh, ais, c1, c2]) => {
      const s = AN.sheets.find(x => x.name === sh);
      if (!s || !s.S) return null;
      const L = ais.map(ai => anUnitAIs(shStn(s) + '|' + ai)).filter(l => l.length);
      return { k, L, v1: null, v2: null, c1, c2, sh, y: NaN };
    })
    .filter(Boolean);
  /* the valve commands of the other outlets (output of their A / M station after the interlocks) */
  const ctlOut = (k, t) => {
    const x = AN.sheets.find(y => y.name === k),
      c = x && x.S && AN.hmiCtrls ? (AN.hmiCtrls(x.S) || []).find(q => q.tag === t) : null;
    return c && c.out != null ? { S: x.S, n: c.out, c, t } : null;
  };
  U.vlv = [
    ['ABC-050', 'PICMS1006', 1 /* to the cold reheat: AN_VLV.hpb */],
    ['ABC-013', 'PICMS1002', 0 /* to the silencer: AN_VLV.blo */]
  ]
    .map(([k, t, rh]) => {
      const o = ctlOut(k, t);
      return o ? { S: o.S, n: o.n, rh, t } : null;
    })
    .filter(Boolean);
  /* 2.2.0-beta.14: the oil flow of the four start-up burners (PV of FICDO1043A ~ D after the gate of the drawing) */
  U.oilN = ['ABC-003A', 'ABC-003B', 'ABC-003C', 'ABC-003D']
    .map((k, i) => ctlOut(k, 'FICDO1043' + 'ABCD'[i]))
    .filter(o => o && o.c.q && o.c.q.pv != null)
    .map(o => ({ S: o.S, n: o.c.q.pv }));
  /* the demand to the TCS: SI0236 = MW demand + pressure correction LN55 (ABC-001C). On the snapshots the turbine master EIC-TM is
     MANUAL (M.2016 = 1, output 0: DCS CONTROL MODE OFF, the TCS holds the load); the TCS set point itself is not in the
     repository, so the TCS follows the unit demand of the DCS */
  U.dem = S.lab.findIndex(l => l && String(l.t).trim() === 'SI0236');
  U.cn = anCompNet(S, 'AI0129');
  if (!U.msp.length || !U.drum.length || !U.msf.length || U.dem < 0 || U.cn < 0) return;
  const F0 = U.fuel.reduce((a, l) => a + (anUnitVal(l) || 0), 0),
    m0 = +S.rt.v[U.cn],
    P0 = anUnitVal(U.msp),
    Pd0 = anUnitVal(U.drum),
    mwv = U.mw.map(anUnitVal).filter(isFinite),
    MW0 = mwv.length ? mwv.slice(0, 2).reduce((a, x) => a + x, 0) / Math.min(2, mwv.length) : NaN,
    Ptin = U.tin.length ? anUnitVal(U.tin[0]) : NaN;
  if (![F0, m0, P0, Pd0, MW0].every(isFinite) || m0 <= 0 || P0 <= 0 || Pd0 <= P0) return;
  Object.assign(U, {
    F0,
    m0,
    P0,
    Pd0,
    MW0,
    /* Phase 11 (KANA, 2026-11-27): the S/H pressure drop is the physics law of anShKdp (design FHI P2S7 Tab 3), no longer the plant
       150 MW anchor (Pd0 - P0) / m0^2 (no-fit finding: a constant taken from the snapshot). NO-FIT-OK: history note */
    kdp: anShKdp(null),
    kln: isFinite(Ptin) && Ptin <= P0 ? (P0 - Ptin) / (m0 * m0) : 0 /* main steam line drop to the turbine inlet */,
    Kt: m0 / P0 /* valve opening 1 = the opening at the anchor */,
    gv: 1,
    Pd: Pd0,
    Qs: m0,
    ms: m0,
    MW: MW0,
    tcsT: NaN,
    t: 0,
    cold: false,
    turb: true,
    tb: { st: 'load', rpm: 3600, icv: 1, xfer: true, tgt: NaN, aim: NaN },
    Tb: U.Tb0,
    Trf: NaN /* beta.263: refractory lump, set from the bed and water on the first step */,
    Tw: steamTsat(Pd0),
    oilF: 0,
    cbed: 0,
    /* 3.2.0-beta.14: the sources of the loops at the anchor (source.js), before the first step */
    Pms: P0,
    Fc: F0,
    unb: 0,
    rpm: 3600,
    mhp: 0,
    qlp: 0
  });
  /* 2.2.0-beta.11 (M2 steps 1 ~ 3, see AN_UNIT): reheat, SH / RH temperatures, O2 */
  const shOf = k => AN.sheets.find(y => y.name === k),
    stOf = k => {
      const x = shOf(k);
      try {
        return x && x.S ? shStn(x) : null;
      } catch (e) {
        return null;
      }
    },
    ais = (k, a) => {
      const st = stOf(k);
      return anUnitAnchor(st != null ? anUnitAIs(st + '|' + a) : []);
    },
    netOf = (S2, nm) => {
      for (let n = 0; n < S2.lab.length; n++) if ((AN.nm(S2, n) || '').trim() === nm) return n;
      return -1;
    },
    procOf = (k, t) => {
      const x = shOf(k),
        b = x && x.S && x.S.procs ? x.S.procs.find(z => (z.txt || [])[1] === t) : null;
      return b && b.proc ? { S: x.S, b, pr: b.proc } : null;
    };
  /* reheat: hot reheat pressure PT-HR1003-1 / -2 (PV of the LP bypass PICHR1003), cold reheat PT-CR1006 (ABC-019), first stage
     pressure PT-ST1001-1 / -2 / -3 (the set point of the LP bypass is LN12 of it + 5.1); the LP bypass valve command */
  U.rhp = [ais('ABC-052', 'AI0421'), ais('ABC-052', 'AI0513'), ais('ABC-019', 'AI0529')];
  U.pist = [ais('ABC-052', 'AI0883'), ais('ABC-052', 'AI0884'), ais('ABC-052', 'AI0885')];
  U.lpv = ctlOut('ABC-052', 'PICHR1003');
  U.rr = 1;
  U.mhp = 0;
  U.Prh = U.rhp.length && U.rhp[0].a0 && U.rhp[0].a0[0] > 0 ? U.rhp[0].a0[0] : 34;
  /* 2.2.0-beta.16 (M4 step 3): the RH blow-off PICHR1391 (ABC-054) takes steam out of the hot reheat while the turbine is shut. Its PV
     is the hot reheat pressure of ABC-052 (drawing ABC-054: "HOT REHEAT STEAM PRESSURE HRP 052 S2 SI0180" -> STN102017), a link
     between stations that the reader leaves as an input of the sheet: written here every step, like the station wiring (one address =
     one signal, CLAUDE.md 1), unless the user forces it */
  U.rhbv = ctlOut('ABC-054', 'PICHR1391');
  U.alink = [];
  {
    const s52 = shOf('ABC-052'),
      s54 = shOf('ABC-054');
    if (s52 && s52.S && s54 && s54.S) {
      const a = netOf(s52.S, 'SI0180'),
        b = netOf(s54.S, 'STN102017');
      if (a >= 0 && b >= 0 && s54.S.ext.includes(b))
        U.alink.push([
          { S: s52.S, n: a },
          { S: s54.S, n: b }
        ]);
      /* 2.2.0-beta.20 (bug, fixed): ABC-054 has no drawn link to the set of ABC-001C (its PV comes through this alink), so the run
         loop never stepped it: the RH blow-off stayed at the value it had when the sheet was loaded (0 %) whatever the operator or
         the PIDV did, and the unit model read that 0 (CHECK bypass stage: "RH blow-off 0 %" in every run). The sheets the unit
         model reads are stepped with the set (links.js actSet, like AN.plantSheets) */
      AN.unitSheets = ['ABC-054'];
    }
  }
  /* 3.2.0-beta.14 (bug, fixed): the headers that are the SOURCE of other loops (source.js: ABC-028 diesel oil header after the pump
     for the burners ABC-003A ~ D, ABC-030 aux steam header) have no drawn link to the set of ABC-001C either: unstepped, their PV
     stayed at the Cold value (0) after the diesel oil pump was started and the burners got no oil (CHECK cold start: drum 0 kg/cm2) */
  AN.unitSheets = [...new Set((AN.unitSheets || []).concat(['ABC-028', 'ABC-030']))];
  /* the spray loops and the fall of the temperature below 60 % MCR (C per unit of load share) */
  /* 3.2.0-beta.39 (roadmap 2) (roadmap 2, MST 555 C > H alarm 548): the SH is one chain, spray 1 outlet (TICBR1130) + SH no.2 pickup = SH no.2
     outlet (TICBR1140) - spray 2 = finishing SH inlet (TICBR1150) + finishing SH pickup = main steam (TICMS1004). Before, the fall of
     the temperature at low load was all on TICBR1150 while TICBR1140 stayed at its anchor: 389 C after a SHUT spray 2 with 458 C
     before it, so DITL-33 (finishing SH inlet > 440 C, M.2543 of ABC-012 SI0381) opened the spray 2 shut-off valve only near 80 MW
     and the main steam overshot. Now TICBR1150 with its spray shut reads TICBR1140 (up: the shift of the SH no.2 outlet), the fall
     dn is shared along the chain (fsh, ASSUMED by the superheat of each stage at the anchor: 394 / 462 / 542 C over 333 C saturation
     at 129 kg/cm2), and the spray 2 need of the load (Fig 10) is the finishing SH pickup growing with the load (122 C at the anchor,
     less the spray 2 authority at <= 60 % MCR): the main steam with the sprays shut is the same as before */
  U.ld = [
    [procOf('ABC-011', 'TICBR1130'), 0, 'sh1'],
    [procOf('ABC-012', 'TICBR1150'), 0, 'up'],
    [procOf('ABC-019', 'TICHR1002'), 0]
  ]
    .filter(([p]) => p)
    .map(([p, s, r]) => Object.assign({ s, r }, p));
  /* the headers after the spray: SH no.2 outlet TT-BR1140-1 / -2 (PV of TICBR1140) = spray 1 outlet (PV of TICBR1130) + pickup;
     finishing SH outlet TT-MS1004-1 / -2 (PV of TICMS1004) = spray 2 outlet (PV of TICBR1150) + pickup */
  U.sh = [
    ['ABC-011', 'TICBR1130', ['AI0610', 'AI0642'], 'sh2'],
    ['ABC-012', 'TICBR1150', ['AI0612', 'AI0644'], 'fsh']
  ]
    .map(([k, t, aa, r]) => {
      const o = ctlOut(k, t);
      if (!o || !o.c.q || o.c.q.pv == null) return null;
      const pv0 = +o.S.rt.v[o.c.q.pv],
        L = aa.map(a => ais(k, a)).filter(l => l.length);
      return isFinite(pv0) && L.length ? { S: o.S, n: o.c.q.pv, L, pv0, x: pv0, r, pk0: L[0].a0[0] - pv0 } : null;
    })
    .filter(Boolean);
  /* O2: total air of ABC-006 (PA + SA + FA flow), the two analyzers of ABC-002, PA to the furnace FT-FA1079 */
  const s6 = shOf('ABC-006');
  U.tafS = s6 && s6.S ? s6.S : null;
  U.taf = U.tafS ? ['FIFA1071.PV', 'FIFA1081.PV', 'FIFA1055.PV'].map(nm => netOf(U.tafS, nm)).filter(n => n >= 0) : [];
  U.o2 = [ais('ABC-002', 'AI0273'), ais('ABC-002', 'AI0433')].filter(l => l.length);
  const taf0 = U.taf.reduce((a, n) => a + (+U.tafS.rt.v[n] || 0), 0),
    o2a = U.o2.map(anUnitVal).filter(isFinite),
    O20 = o2a.length ? o2a.reduce((a, q) => a + q, 0) / o2a.length : NaN;
  U.afs = 0;
  if (U.taf.length === 3 && isFinite(O20) && O20 > 0 && O20 < 21 && taf0 > 0 && F0 > 0) {
    U.afs = AN_GAS.afs; /* T/H of air per T/H of coal, stoichiometric, boiler.js */
    U.O20 = U.o2v = O20;
    U.taf0 = taf0;
  }
  U.pa = ais('ABC-006', 'AI0166');
  U.bedDp = [
    /* 3.2.3-beta.265: the plant trend ~1465 (AN_BI), the two transmitters 6 mmH2O apart as on the snapshot (1426 / 1432) */
    [ais('ABC-006', 'AI0134'), 1462],
    [ais('ABC-006', 'AI0262'), 1468]
  ];
  U.soxAI = anUnitAIs('1|AI0466'); /* stack SOx, boiler.js anSoxStep */
  U.bedSc = [
    ['ABC-009A', 'SICL1060A'],
    ['ABC-009A', 'SICL1060B'],
    ['ABC-009A', 'SICL1060C'],
    ['ABC-009B', 'SICL1060D']
  ]
    .map(([k, t]) => {
      /* MAN stations, in rpm (compile-step.js): their output pin */
      const x = shOf(k),
        b = x && x.S ? x.S.blk.find(q => q.k === 'MAN' && (q.txt || []).includes(t)) : null,
        p = b && (b.pins || []).find(q => q.role === 'out');
      return p ? { S: x.S, n: p.n } : null;
    })
    .filter(Boolean);
  U.paNet = U.tafS ? netOf(U.tafS, 'FIFA1071.PV') : -1;
  U.pa0 = U.paNet >= 0 ? +U.tafS.rt.v[U.paNet] : NaN;
  /* ---- 2.2.0-beta.12 (M3): trips ---- */
  const labOf = (k, l) => {
      const x = shOf(k);
      if (!x || !x.S) return null;
      const n = x.S.lab.findIndex(z => z && String(z.t).trim() === l);
      return n >= 0 ? { S: x.S, n } : null;
    },
    procsOf = (k, tags) => tags.map(t => procOf(k, t)).filter(Boolean);
  /* 3.2.1 d2 (LISA): station wiring S1 -> S2. ABC-020 reads S2 M.3154 "BOILER STEAM FLOW < 15% MCR (69T/H) (BC FROM S1)" (memory list 102);
     memory list 101 gives the same name to M.2002, the comparator of ABC-001C (and M.3154 "STN101 STATION WIRING"). Nothing wrote it: 0 */
  {
    const a = labOf('ABC-001C', 'M.2002'),
      t = labOf('ABC-020', 'S2 M.3154') || labOf('ABC-020', 'M.3154');
    if (a && t && t.S.ext.includes(t.n) && !a.S.ext.includes(a.n)) U.alink.push([a, t]);
  }
  /* station wiring: STN102 digital inputs broadcast to STN101 (memory list "BC FROM S2"); written only on nets that are inputs of
     the drawing (S.ext) and not forced by the user */
  U.bcast = [
    /* 2.3.0-beta.1 (ABC-013-1): the house operation OR of ABC-013 reads them too ("TURBINE TRIP M.3200 (FROM S2 L0400)", "52G1 OPEN
       M.3220 (FROM S2 L0932)", "52L1 OPEN FOR HOUSE OPERATION M.3221 (FROM S2 L0937)") */
    [labOf('ABC-050', 'I.0400'), [labOf('ABC-001C', 'M.3200'), labOf('ABC-010', 'M.3200'), labOf('ABC-013', 'M.3200')]],
    [labOf('ABC-050', 'I.0932'), [labOf('ABC-010', 'M.3220'), labOf('ABC-013', 'M.3220')]],
    [labOf('ABC-050', 'I.0937'), [labOf('ABC-013', 'M.3221')]]
  ]
    .filter(([a, b]) => a && a.S.ext.includes(a.n))
    .map(([a, b]) => [a, b.filter(x => x && x.S.ext.includes(x.n))]);
  /* 3.2.3-beta.74 (Mina B72-1, MSP HH after the load rejection): the quick-open solenoids of the bypass control valves. ABC-050:
     M.0124 (turbine trip / 52G1 open / house operation) -> TPS 3 s TR236 -> O.0842 "HP BYPASS PRESSURE SOLENOID VALVE FOR CONTROL VALVE
     OPEN" (PCV-MS1020) and the timed pulse TR237 -> O.0843 "LP BYPASS PRESSURE SOLENOID VALVE FOR CONTROL VALVE OPEN" (PCV-HR1010).
     The logic drove them, the plant did not read them: while the solenoid is on, the valve is fully open whatever its positioner says */
  const foutOf = (k, t) => {
    const x = shOf(k),
      b = x && x.S && x.S.blk.find(y => y.k === 'FOUT' && y.tag === t);
    return b && b.i && b.i.length ? { S: x.S, n: b.i[0] } : null;
  };
  U.qo = { hp: foutOf('ABC-050', 'O.0842'), lp: foutOf('ABC-050', 'O.0843') };
  U.trip = [labOf('ABC-050', 'I.0400'), labOf('ABC-001C', 'M.3200')].filter(Boolean);
  U.vtrip = labOf('ABC-050', 'I.0400');
  U.vac = 1; /* 3.2.0-beta.15: a plant in service has its condenser vacuum (Cold puts it to 0) */
  /* 2.2.0-beta.17: the TCS inputs of the I/O list this black box writes in a start-up (ABC-050 STN102: GCB 52G1 on / off, ICV -> CV
     transfer complete; ABC-001C STN101: DCS control mode permissive / on feedback), the DCS mode commands it reads (O.0178 / O.0179),
     and the turbine speed TCSAI1004 (ABC-053 AI0534, lag -> SI0261 -> ABC-010 SI0246 while the GCB is open) */
  U.di = {
    gcbOn: labOf('ABC-050', 'I.0931'),
    gcbOff: labOf('ABC-050', 'I.0932'),
    /* plan c4 (elec.js): 52L1 OPEN FOR HOUSE OPERATION (I/O list STN102), read by ABC-013 M.3221 through U.bcast */
    l52: labOf('ABC-050', 'I.0937'),
    xfer: labOf('ABC-050', 'I.0418'),
    perm: labOf('ABC-001C', 'I.0081'),
    on: labOf('ABC-001C', 'I.0082'),
    onCmd: netOf(S, 'O.0178'),
    offCmd: netOf(S, 'O.0179'),
    /* 3.2.1 d1 (LISA): ABC inputs of the I/O list STN102 with no writer before: TCS-DI1042 / 1043 turbine start-up warm / hot mode (I.0413 / I.0414, ABC-050 and ABC-051),
       TCS-DI1030 turning gear engaged (I.0417, ABC-053), LS-HD1105 / 1102 / 1103 heater level H.H. (I.029E / I.029C / I.029D, ABC-035 / 038 / 039) */
    warm: [labOf('ABC-050', 'I.0413'), labOf('ABC-051', 'I.0413')].filter(Boolean),
    hot: [labOf('ABC-050', 'I.0414'), labOf('ABC-051', 'I.0414')].filter(Boolean),
    tg: labOf('ABC-053', 'I.0417'),
    /* Phase 6 (lane 1, 2026-11-26): TCS-DI1051-1 / -2 MSV(A) / (B) TEST (I.041E / I.041F STN102, ABC-050 FROM TCS -> OR B95 -> M.0705):
       the EHG DO TABLE(1) outputs TCE960-27 / 28 MSV/CV(A) / (B) SEQUENTIAL FULL CLOSE TEST EXECUTING (src/data/tcs-dcs.json) */
    msvA: labOf('ABC-050', 'I.041E'),
    msvB: labOf('ABC-050', 'I.041F'),
    /* ZSO-CD1115 LP turbine bypass desuperheater spray water control valve open (STN102 I.0892, ABC-052): the valve TCV-CD1115 at full stroke */
    lpbZso: labOf('ABC-052', 'I.0892'),
    /* memory list STN101 / 104 M.0001 ALWAYS "1" (ABC-029, ABC-001B): nothing wrote it, it read 0 */
    one: [labOf('ABC-029', 'M.0001'), labOf('ABC-001B', 'M.0001')].filter(Boolean),
    hd: [
      [labOf('ABC-035', 'I.029E'), 'H5', 140],
      [labOf('ABC-038', 'I.029C'), 'H2', 150],
      [labOf('ABC-039', 'I.029D'), 'H3', 140]
    ]
  };
  /* 3.2.3-beta.244 (live Cold start 90 MW, user 2026-11-14 "DBA MORE THAN 2% NA OPENING NG CV"): the turbine valve positions of the
     T/G Modbus (ABC-050: CONTROL VALVE(A) POSITION(A ~ C) SI1812 ~ SI1814 (30113 ~ 30115), CONTROL VALVE(B) SI1815 ~ SI1817
     (30116 ~ 30118), INTERCEPT VALVE(A) SI1821 ~ SI1823 (30122 ~ 30124), INTERCEPT VALVE(B) SI1827 ~ SI1829 (30128 ~ 30130)) had no
     writer and read 0: the CV average SI0226 / SI0227 never reached ">= 2 %" (M.070C), so the HP bypass close of ABC-050 (M.070D / M.070E,
     PICMS1006 MV to 0 % after the ICV -> CV transfer with 52G1 closed) never came and the HP bypass stayed 69 % open at 90 MW. The
     turbine model writes its valve positions there (three transmitters of one valve read the same) */
  U.diX = anDiXOf();
  U.vpos = anVposOf();
  {
    const st2 = stOf('ABC-053');
    U.spd = st2 != null ? anUnitAIs(st2 + '|AI0534') : [];
  }
  /* flows that need a machine running: feedwater (BFWP A / B), primary air (PAF), secondary air (SAF) */
  U.mul = [
    {
      pr: procsOf('ABC-010', ['FICFW1007', 'LICBR1001B']).map(p => p.pr),
      run: [labOf('ABC-010', 'M.3343'), labOf('ABC-010', 'M.3344')]
    },
    { pr: procsOf('ABC-007', ['FICFA1071']).map(p => p.pr), run: [labOf('ABC-007', 'M.3302')] },
    { pr: procsOf('ABC-007', ['FICFA1081']).map(p => p.pr), run: [labOf('ABC-007', 'M.3303')] }
  ].map(m => Object.assign(m, { run: m.run.filter(Boolean) }));
  /* 3.2.1 (IRENE: FEEDWATER): the motor of the DITL drawing too (BFWP A / B = DITL-23A / #B): a FIELD TRIP (protection relay) stops the
     water although ABC-010 M.3343 (DITL-23A output 55 RUNNING) still reads 1 */
  U.mul[0].drw = U.mul[0].run.length === 2 ? ['DITL-23A', 'DITL-23A #B'] : null;
  U.mul[0].dis =
    U.mul[0].run.length === 2
      ? [
          ['DITL-38 #MV-FW1001', 'DITL-38 #MV-FW1391'],
          ['DITL-38 #MV-FW1002', 'DITL-38 #MV-FW1392']
        ]
      : null;
  /* 2.2.0-beta.15 (M4 step 2): the start-up feedwater valve (ABC-010 LICBR1001B, single-element drum level control for the start-up,
     FCV-FW1060) is a second line into the drum beside the main valve of FICFW1007: its flow is added to the feedwater flow
     transmitter (plant.js pr.op of the FICFW1007 loop), its flow is from the valve sheet (anSuFw below, K1AU3-E2-0-123 p147);
     the snapshots show it at 0.1 % M at 150 MW */
  U.suv = ctlOut('ABC-010', 'LICBR1001B');
  U.fwp = procOf('ABC-010', 'FICFW1007');
  U.fwv = ctlOut('ABC-010', 'FICFW1007'); /* 3.2.4-beta.6: the command of the main feedwater valve FCV-FW1130-1 (anMainFw) */
  U.ksu = 0.3; /* 3.2.3: no longer used for the flow (anSuFw, the valve sheet); kept for the probes that read it */
  /* furnace pressure: the two IDF actuators in series (hydraulic coupling PICFG108, inlet damper PICFG108A) take the flue gas out */
  U.fp = procsOf('ABC-008', ['PICFG108', 'PICFG108A']);
  U.idf = labOf('ABC-008', 'M.3304');
  U.kfpA =
    null; /* the pressure rise when the ID fan takes nothing out, from the loop model (so that no air and no ID fan = the anchor) */
  /* 3.2.0-beta.23: the furnace / cyclone thermocouples (the bed temperature, see the step) */
  U.tbed = Object.keys(AN_HMI_AI)
    .filter(k => /^TIFG(1090|1091|1095|1096|1009)[A-Z]?$/.test(AN_HMI_AI[k][1]))
    .map(k => anUnitAnchor(anUnitAIs(k)))
    .filter(l => l.length);
  /* 3.2.0-beta.39 (roadmap 2, HMI thread: in Cold, all fans stopped, the air preheater outlet kept the 150 MW snapshot): the air
     preheater outlet air temperatures TT-FA1086 / 1087 (SA, ABC-003A) and TT-FA1076 / 1077 (PA, ABC-006) follow the hot gas like
     the bed thermocouples; the SA pressures PT-FA1085 (SAF outlet, ABC-057) and PT-FA1088 (hot SA, ABC-003A) go with the square
     of the SA flow FT-FA1081 (fan law). The ID fan speed ST-LO1756 (ABC-008 AI0481, no value in the snapshots) is the hydraulic
     coupling PICFG108 over the speed range of the fan manual (I.D. fan 350 ~ 1140 rpm), 0 with the fan stopped.
     3.2.3-beta.104 (plan b3, ID fan cold start): the curve goes through the 150 MW snapshot 7.PNG "HYDRAULIC COUPLING (IDF) 46.1 % /
     872 rpm" (OPERATING_POINTS.md), two straight pieces 0 % 350 / 46.1 % 872 / 100 % 1140 rpm. Before: one straight line 350 ~ 1140
     (ASSUMED), which read 714 rpm at the snapshot MV */
  const aiList = re =>
    Object.keys(AN_HMI_AI)
      .filter(k => re.test(AN_HMI_AI[k][1]))
      .map(k => anUnitAnchor(anUnitAIs(k)))
      .filter(l => l.length);
  U.aphT = aiList(/^TIFA(1086|1087|1076|1077)$/);
  U.aphL = { pa: aiList(/^TIFA(1076|1077)$/).flat(), sa: aiList(/^TIFA(1086|1087)$/).flat() }; /* boiler.js anAphStep */
  U.saP = aiList(/^PIFA(1085|1088)$/);
  U.saN = U.tafS ? netOf(U.tafS, 'FIFA1081.PV') : -1;
  U.sa0 = U.saN >= 0 ? +U.tafS.rt.v[U.saN] : NaN;
  U.idfS = ais('ABC-008', 'AI0481');
  U.idfV = ctlOut('ABC-008', 'PICFG108');
  /* 3.2.3-beta.108: the curve is a module function (anIdfN, below), not a function on U: a save keeps U as JSON, so a save loaded
     into this build had no U.idfN and the Worker engine stopped at each scan (TypeError U.idfN is not a function, plant frozen) */
  U.idfRpm = [350, 1140];
  U.idfCrv = AN_IDF_CRV;
  /* ---- 3.2.0 roadmap 3 (starting points: Cold = a cold plant, not the 150 MW snapshot) and the P1 fix queue of
     docs/versions/v3.2.0/INSTRUMENT_VALVE_COVERAGE.md ---- */
  /* P2 #14: the second drum pressure transmitter PT-BR1001-2 (ABC-010 AI0385) reads the drum too (it kept 134.1 kg/cm2 in a cold plant) */
  U.drum = U.drum.concat(anUnitAIs(s1 + '|AI0385'));
  /* the cold reheat pressure PT-CR1003 and the HP bypass outlet pressure PT-MS1021 (ABC-051) are the reheater inlet: the same steam as
     PT-CR1006, scaled with it (35.3 / 35.0 kg/cm2 at the anchor; they kept 35 kg/cm2 in a cold plant) */
  U.rhp = U.rhp.concat([ais('ABC-051', 'AI0528'), ais('ABC-051', 'AI0566')].filter(l => l.length));
  /* the first stage pressure of the turbine is not the only pressure that goes with the turbine steam: extraction no.4 PT-TS1022 (ABC-056,
     deaerator heating steam) too */
  U.pist = U.pist.concat([ais('ABC-056', 'AI0562')].filter(l => l.length));
  /* temperatures that kept the 150 MW snapshot in a cold plant (roadmap 3), each written from the model with the metal lag:
     - TT-CR1004 cold reheat (ABC-051): the HP turbine exhaust (the anchor 370 C moves with the main steam) and the HP bypass outlet
       TT-MS1022 (after its spray), mixed by their steam; no steam = it cools to the ambient
     - TT-CR1005-1 / -2 (ABC-019, after the RH spray): the cold reheat less the cooling of the RH spray (39 C at the anchor spray)
     - TT-HR1004 hot reheat (ABC-052): the reheater outlet, PV of TICHR1002 (TT-HR1002), with its own offset of the snapshot
     - TT-AS1003 aux steam header (ABC-034): 236 C with the header in service (PT-AS1004 source of ABC-030), ambient without it
     - TT-FW1160 economizer inlet (ABC-010): the deaerator water (saturation of PT-CD1104, ambient while it is not heated) plus the HP
       heaters, whose extraction steam goes with the turbine load (244 C at the anchor)
     - TT-FA1055-A / -B FA blower outlet (ABC-006): the heat of compression while the blowers run (81 / 76 C at the anchor) */
  U.xt = {
    cr: ais('ABC-051', 'AI0900'),
    byo: ais('ABC-051', 'AI0865'),
    rhi: [ais('ABC-019', 'AI0866'), ais('ABC-019', 'AI0898')].filter(l => l.length),
    hr: ais('ABC-052', 'AI0868'),
    rhPv: ctlOut('ABC-019', 'TICHR1002'),
    mst: ctlOut('ABC-012', 'TICMS1004'),
    aux: ais('ABC-034', 'AI0642'),
    auxP: ais('ABC-030', 'AI0514'),
    fw: ais('ABC-010', 'AI0592'),
    dea: ais('ABC-056', 'AI0417'),
    fab: [ais('ABC-006', 'AI0579'), ais('ABC-006', 'AI0627')].filter(l => l.length),
    faF: ais('ABC-006', 'AI0545'),
    /* P2 #14: the drum level transmitter LT-BR1001-2 (ABC-010 AI0258) is not one the level model writes (the PV of LICBR1001 does not
       move with it: plant.js anProbe), so it kept its value while the drum filled or emptied, and its level switches never acted.
       It reads the same water: the mean of LT-BR1001-1 / -3 with its own offset of the snapshot (2 mm against 0 / 8 mm) */
    lt2: ais('ABC-010', 'AI0258'),
    lt13: [ais('ABC-010', 'AI0130'), ais('ABC-010', 'AI0386')].filter(l => l.length)
  };
  {
    const X = U.xt,
      a = L => (L && L.a0 && isFinite(L.a0[0]) ? L.a0[0] : NaN);
    X.cr0 = a(X.cr);
    /* TT-MS1022 at the anchor: the HMI snapshot TIMS10221 359 C (bypass shut: the HP exhaust it sees); the a0 of the start state is
       the old snapshot loop, not a plant reading */
    {
      const q = typeof AN_HMI_AI !== 'undefined' ? Object.values(AN_HMI_AI).find(x => x[1] === 'TIMS10221') : null;
      X.byo0 = q && isFinite(+q[0]) ? +q[0] : a(X.byo);
    }
    X.rhi0 = X.rhi.map(L => a(L));
    X.rhv0 = X.rhPv && X.rhPv.c.q ? +X.rhPv.S.rt.v[X.rhPv.n] : NaN; /* RH spray MV at the anchor */
    X.hrOff = X.rhPv && X.rhPv.c.q && X.rhPv.c.q.pv != null ? a(X.hr) - +X.rhPv.S.rt.v[X.rhPv.c.q.pv] : 0;
    X.fw0 = a(X.fw);
    X.dea0 = a(X.dea);
    X.faF0 = a(X.faF);
    X.lt2Off = X.lt13.length ? a(X.lt2) - X.lt13.reduce((s, L) => s + a(L), 0) / X.lt13.length : NaN;
    X.T = {};
  }
  /* P1 #1: VALVE POSITION = VALVE COMMAND. The position transmitter (ZT) of a damper / control valve follows the command of its station
     (actuator lag tauZT, ASSUMED 3 s); before, it kept the snapshot (ZT-FA1053-1 35 % with the damper shut in a cold plant) */
  U.tauZT = 3;
  const manOut = (k, t) => {
    const x = shOf(k),
      b = x && x.S ? x.S.blk.find(z => z.k === 'MAN' && (z.tag === t || (z.txt || []).includes(t))) : null;
    return b && b.o && b.o[0] != null && b.o[0] >= 0 ? { S: x.S, n: b.o[0] } : null;
  };
  const ztMap = [
    ['ABC-003A', 'FICFA1043A', 'AI0291'],
    ['ABC-003B', 'FICFA1043B', 'AI0437'],
    ['ABC-003C', 'FICFA1043C', 'AI0582'],
    ['ABC-003D', 'FICFA1043D', 'AI0629'],
    ['ABC-007', 'FICFA1071', 'AI0192'],
    ['ABC-007', 'FICFA1081', 'AI0193'],
    ['ABC-008', 'PICFG108A', 'AI0194'],
    ['ABC-008', 'PICFG108', 'AI0482'],
    ['ABC-014', 'FICFA1055A', 'AI0176'],
    ['ABC-014', 'FICFA1055B', 'AI0196']
  ];
  for (let i = 5; i <= 26; i++) {
    const t = 'HICFA10' + String(i).padStart(2, '0');
    ztMap.push([i <= 16 ? 'ABC-015' : 'ABC-016', t, null]);
  }
  ztMap.push(
    ['ABC-020', 'HICHR1002A', 'S4 AI0368'],
    ['ABC-020', 'HICHR1002A', 'S4 AI0369'],
    ['ABC-020', 'HICHR1002A', 'S4 AI0370'],
    ['ABC-020', 'HICHR1002A', 'S4 AI0371']
  );
  ztMap.push(
    ['ABC-020', 'HICHR1002B', 'S4 AI0372'],
    ['ABC-020', 'HICHR1002B', 'S4 AI0373'],
    ['ABC-020', 'HICHR1002B', 'S4 AI0374'],
    ['ABC-020', 'HICHR1002B', 'S4 AI0375']
  );
  U.zt = [];
  for (const [k, t, ai] of ztMap) {
    const x = shOf(k);
    if (!x || !x.S) continue;
    const S2 = x.S,
      src = ctlOut(k, t) || manOut(k, t);
    if (!src) continue;
    /* the AI block of the ZT on that sheet: by its address, or (furnace wall dampers) the ZT whose tag number is the station's */
    const L = [];
    for (const b of S2.blk) {
      if (b.k !== 'AI' || !b.o || b.o[0] == null) continue;
      const nm = (AN.nm(S2, b.o[0]) || '').trim();
      if (ai ? nm === ai : (AN.descOf ? AN.descOf(x, nm) || '' : '').startsWith('ZT-FA' + t.slice(5) + ' '))
        L.push([S2, b]);
    }
    if (L.length) U.zt.push({ src, L, y: NaN, t });
  }
  /* P1 #5 SPRAY BLOCK VALVES (DITL shut-off valves; positions of the DITL valve model while the one world runs): no spray water with
     the block valve shut, whatever the control valve (plant.js pr.uf = the share of the command that reaches the process).
     ABC-011 TICBR1130 <- XV-FW1111-1 / -2 (DITL-32, #B), ABC-012 TICBR1150 <- XV-FW1121-1 / -2 (DITL-33, #B), ABC-019 TICHR1002 <-
     XV-FW1151 (DITL-35), ABC-051 TICMS1022 <- XV-FW1061 (DITL-79, HP bypass), ABC-052 TICHR1012 <- XV-CD1114 (DITL-66, LP bypass) */
  U.spr = [
    ['ABC-011', 'TICBR1130', ['DITL-32', 'DITL-32 #B']],
    ['ABC-012', 'TICBR1150', ['DITL-33', 'DITL-33 #B']],
    ['ABC-019', 'TICHR1002', ['DITL-35']],
    ['ABC-051', 'TICMS1022', ['DITL-79']],
    ['ABC-052', 'TICHR1012', ['DITL-66']]
  ]
    .map(([k, t, v]) => {
      const p = procOf(k, t);
      return p ? { pr: p.pr, v } : null;
    })
    .filter(Boolean);
  /* P1 #6 COAL FEEDER OUTLET DISCHARGE VALVE (DITL-20, #B, #C = feeder A / B / C: M.0478 / 0488 / 0498 OPEN P.B. of the memory list
     STN104): the coal of a feeder reaches the furnace only through its open outlet valve */
  U.cfo = ['DITL-20', 'DITL-20 #B', 'DITL-20 #C'];
  /* 3.2.1 the MV of TICLO1002 = TCV-CW1201 (STN102 AO0469), cooling water to the lube oil cooler (AN_LO) */
  U.loMv = ctlOut('ABC-053', 'TICLO1002') || manOut('ABC-053', 'TICLO1002');
  /* the transmitters this model writes: the plant model of a loop on them stops writing (ABC-001C PIC-COBM: main steam pressure) */
  /* 3.2.3 live Cold start (AN_AS): the aux steam header PT-AS1004 / PT-AS1005 (ABC-030 AI0514 / AI0515) and the steam seal feed valve
     PV-GS1031 to the DCS (ABC-034 AI0886) are written by the aux steam model */
  U.asAI = [ais('ABC-030', 'AI0514'), ais('ABC-030', 'AI0515')].filter(l => l.length);
  U.gsAI = ais('ABC-034', 'AI0886');
  const own = new Set();
  const lists = [U.msp, U.drum, U.msf, U.spd || []]
    .concat(
      U.mw,
      U.tin,
      U.rhp,
      U.pist,
      U.o2,
      [U.pa],
      U.tbed,
      U.aphT,
      U.saP,
      U.idfS.length ? [U.idfS] : [],
      (U.bedDp || []).map(x => x[0]),
      [U.soxAI]
    )
    .concat(...U.sh.map(h => h.L))
    .concat(
      [U.xt.cr, U.xt.hr, U.xt.aux, U.xt.fw, U.xt.lt2],
      U.xt.rhi,
      U.xt.fab,
      U.zt.map(z => z.L),
      U.lo || [],
      U.asAI,
      [U.gsAI]
    )
    .concat(...(U.hd || []).map(h => h.L));
  for (const l of lists) for (const [S2, b] of l) own.add(S2.rt.st[b.id]);
  U.own = own;
  anFwStart(U); /* Phase 11 (NANA): PT-CD1104 is written by the deaerator model */
  anBoilerStart(U); /* 3.2.1 SEULGI: the boiler-side plant model (boiler.js) */
  U.on = true;
  /* 3.2.0-beta.68: "Start at 150 MW" = the air compressors in service, the tanks at their pressure (AN_AIR, 39.PNG 7.0 kg/cm2) */
  U.iaP = U.paP = AN_AIR.P;
  U.avH = {};
  U.iaRun = U.paRun = null; /* 3.2.1: the compressors as the DITL of the scenario (anAirStep, first step) */
  U.paW0 = U.paW1 = U.paW2 = NaN;
  U.mt = {}; /* live test #54: the running motors start at their steady temperature (AN_MT) */
  for (const h of U.hd || []) h.y = NaN; /* 3.2.1: the heater levels start again from the transmitters (AN_HD) */
  U.hdSeed = true; /* 3.2.1: the drain valves of the heaters start at their steady opening at 150 MW (AN_HD) */
  U.hdSeedN = 0;
  for (const h of U.hd || []) h.w0 = NaN;
  U.frT = undefined;
  U.hxM = null; /* beta.258: the heat transfer chain (hx.js) starts at the design metal, settled on the plant */
  U.hxT0 = NaN;
  /* 3.2.3 live Cold start: the aux steam / gland / condenser air volumes (AN_AS) start from their transmitters */
  U.asP = U.gsP = U.gsY = U.cdAirP = NaN;
  U.asT1 = U.asT3 = U.asT17 = NaN;
  U.asTAI = null;
  U.tco = null; /* 3.2.0-beta.66: the oil-only state of the snapshot (tcs.js tcsOilState) starts again */
  U.tc =
    null; /* 3.2.0-beta.38: the snapshot of "Start at 150 MW": the TCS model only in a start-up / shutdown (Cold, warm, hot, live) */
  /* 3.2.0-beta.14: the snapshot plant has its diesel oil pump in service (source.js field equipment) */
  AN_SRC.field.hypo = true;
  AN_SRC.field.hypoB = false; /* live test 2026-11-04: dosing pump B standby, unloading pump stopped (field, HCDSP) */
  AN_SRC.field.hypoU = false;
  AN_SRC.field.pur = true;
  AN_SRC.field.mu1033 = false;
  AN_SRC.field.cw1001 = true; /* live test #50: the expansion tank outlet open, the closed cooling loop primed */
  U.loTr = NaN; /* 3.2.1 AN_LO: the lube oil starts at its steady value */
  U.cdTs = NaN; /* 3.2.1 AN_CD: the condenser starts at its steady value */
  U.lpT = undefined; /* 3.2.1 AN_LP: the LP heaters too */
  U.bedI = NaN; /* the bed inventory starts again (anBedStep) */
  U.svOpen = {}; /* 3.2.4-beta.1: the safety valves start seated (AN_SV) */
  U.soxZ = NaN; /* the lime in the bed too (boiler.js anSoxStep) */
  U.bedLeg = 0;
  if (AN_SRC.valve)
    for (const k in AN_FV0) delete AN_SRC.valve[k]; /* 3.2.1: the field valves at their normal line-up */
  AN_SRC.field.lhd = false; /* Mina H1: the lower ring header drains (PD-019) closed while steaming */
  AN_SRC.lhdPct = 0;
  U.cwPrime = 1;
  AN_SRC.field.esp = true;
  /* 3.2.3 SOHEE: the dosing pumps A in service, B standby, agitator stopped (PR-OPE-5002 one pump each); the chemistry at its target */
  Object.assign(AN_SRC.field, {
    tspA: true,
    tspB: false,
    amnA: true,
    amnB: false,
    chzA: true,
    chzB: false,
    agt: false
  });
  U.chC = U.chP = U.chS = U.chO = U.sp1006 = NaN;
  U.sbTa =
    U.sbTb =
    U.hrT10 =
      NaN; /* SOHEE: the sootblower drains and TT-HR1010 start at their rest value (AN_SB.dr, AN_HRW) */
  U.chCold = 0;
  AN.unit = U;
}
/* 2.2.0-beta.14 (M4 step 1): the plant cold, with the anchors of "Start at 150 MW" kept (called by hmi-op.js anPlantCold after
   anPlantLoad150): drum 0 kg/cm2, water and bed at the ambient, no steam, turbine shut, MW 0 */
function anUnitCold() {
  const U = AN_UNIT;
  if (!U.on) return false;
  Object.assign(U, {
    cold: true,
    turb: false,
    tb: { st: 'off', rpm: 0, icv: 0, xfer: false, tgt: 0, aim: 0 },
    vac: 0,
    Pd: 0,
    Qs: 0,
    ms: 0,
    mb: 0,
    mhp: 0,
    MW: 0,
    gv: 0,
    tcsT: 0,
    rr: 0,
    Tw: U.Tamb,
    Tb: U.Tamb,
    Trf: U.Tamb,
    oilF: 0,
    burn: 0,
    unb: 0,
    cbed: 0,
    t: 0
  });
  U.o2v = 21;
  U.frT = undefined;
  U.hxM = null; /* beta.258: every bank of the heat transfer chain (hx.js) at the room */
  U.hxT0 = U.Tamb;
  U.TpR = U.Tamb;
  /* 3.2.3 live Cold start (AN_AS): aux steam and gland headers empty at the atmosphere, the condenser full of air */
  U.asP = U.gsP = U.gsY = 0;
  U.asT1 = U.asT3 = U.asT17 = U.Tamb;
  U.cdAirP = NaN;
  /* 3.2.0 roadmap 3: the temperatures of anUnitStepX start at their cold value (no lag from the 150 MW anchor) */
  if (U.xt) U.xt.T = {};
  U.Pmsv = 0; /* the main steam pipe after the stop MOV: no pressure in a cold plant */
  for (const z of U.zt || []) z.y = NaN;
  for (const h of U.sh) h.x = U.Tamb;
  for (const L of U.tbed || []) anUnitWrite(L, U.Tamb);
  /* 3.2.0-beta.14: cold = the field equipment stopped too (diesel oil pump, source.js) */
  AN_SRC.field.hypo = false;
  AN_SRC.field.hypoB = false;
  AN_SRC.field.hypoU = false;
  AN_SRC.field.pur = false;
  AN_SRC.field.mu1033 = false;
  AN_SRC.field.cw1001 = false; /* live test #50: the expansion tank outlet closed, the closed cooling loop not primed */
  U.loTr = NaN; /* 3.2.1 AN_LO: the lube oil starts at its steady value */
  U.cdTs = NaN; /* 3.2.1 AN_CD: the condenser starts at its steady value */
  U.lpT = undefined; /* 3.2.1 AN_LP: the LP heaters too */
  U.bedI = NaN; /* the bed inventory starts again (anBedStep) */
  U.svOpen = {}; /* 3.2.4-beta.1: the safety valves start seated (AN_SV) */
  U.soxZ = NaN; /* the lime in the bed too (boiler.js anSoxStep) */
  if (AN_SRC.valve)
    for (const k in AN_FV0) delete AN_SRC.valve[k]; /* 3.2.1: the field valves at their normal line-up */
  AN_SRC.field.lhd = false; /* Mina H1: the lower ring header drains (PD-019) closed */
  AN_SRC.lhdPct = 0;
  U.cwPrime = 0;
  AN_SRC.field.esp = false;
  /* 3.2.3 SOHEE: cold = the dosing pumps stopped (PR-OPE-5002 starts them in the start-up); no phosphate yet, the cycle water conditioned */
  Object.assign(AN_SRC.field, {
    tspA: false,
    tspB: false,
    amnA: false,
    amnB: false,
    chzA: false,
    chzB: false,
    agt: false
  });
  U.chC = U.chP = U.chS = U.chO = U.sp1006 = NaN;
  U.sbTa =
    U.sbTb =
    U.hrT10 =
      NaN; /* SOHEE: the sootblower drains and TT-HR1010 start at their rest value (AN_SB.dr, AN_HRW) */
  U.chCold = 2; /* the water filled cold is not deaerated (air-saturated) until the deaerator is first pressurized (2 = until the transmitter reads the cold deaerator) */
  AN_SRC.t = -1;
  /* 3.2.0-beta.68: cold = the air compressors stopped, the air tanks empty (AN_AIR) */
  U.iaP = U.paP = 0;
  U.avH = {};
  U.iaRun = U.paRun = null; /* 3.2.1: the compressors as the DITL of the scenario (anAirStep, first step) */
  U.paW0 = U.paW1 = U.paW2 = NaN;
  U.mt = {}; /* live test #54: the motors start again from the ambient (AN_MT) */
  for (const h of U.hd || []) h.y = NaN; /* 3.2.1: the heater levels start again from the transmitters (AN_HD) */
  U.hdSeed = false;
  anBoilerCold(U); /* 3.2.1 SEULGI: the boiler-side plant model (boiler.js) */
  tcsInit(U, 'cold');
  return true;
}
/* 2.2.0-beta.21 (M5 shutdown): the plant at 150 MW WITH the start-up / shutdown physics on (U.cold: the water heat storage of the
   drum, the steam temperature capped by the gas, the oil of the start-up burners, the bed temperature, a turbine trip = machine off
   and GCB open, the TCS inputs of the DCS written by the model). The anchors of "Start at 150 MW" stay as they are: the plant is at
   full load, on the grid, DCS control mode ON. Called after anPlantLoad150 (hmi-op.js anPlantLive, CHECK M5) */
function anUnitLive() {
  const U = AN_UNIT;
  if (!U.on) return false;
  U.cold = true;
  U.turb = true;
  U.tb = { st: 'load', rpm: 3600, icv: 1, xfer: true, tgt: NaN, aim: NaN, perm: true };
  U.Tw = steamTsat(U.Pd);
  tcsInit(U, 'load');
  return true;
}
/* 3.2.0 roadmap 3: the position (0 ~ 100 %) of a valve of the DITL valve model (MOV / solenoid) by sheet ("DITL-32", an instance "DITL-32 #B",
   a template valve "DITL-38 MV-MS1391"), while the one world is built (beta.245: also paused); null without it (the engine alone, the
   DITL state is the operator's) */
function anDitlPos(name, j) {
  try {
    /* beta.245: the world built (WORLD.on + idx), as anDitlRun; before: only while it scans (WORLD.live), so a paused plant read no
       valve: the spray flows FT-FW1109 / 1119 / 1149 / 1059 were empty at a load until the plant ran. The positions (MST) are the state */
    if (typeof S === 'undefined' || !window.WORLD || !WORLD.on || !WORLD.idx || typeof MST === 'undefined') return null;
    const C = AN_UNIT._dv || (AN_UNIT._dv = {});
    let s = C[name];
    if (!s) {
      const re = new RegExp('\\)' + name.replace(/[.*+?^${}()|[\]\\#]/g, '\\$&') + '$');
      s = S.sheets.concat(WORLD.inst || []).find(x => re.test(x.name)) || null;
      if (s) C[name] = s; /* not kept while the world has not made its machine instances yet */
    }
    if (!s || !s.nl || !(s.nl.mv || []).length) return null;
    const r = MST[s.name];
    if (!r || !r[j || 0]) return s.nl.mv[j || 0].sv && s.nl.mv[j || 0].dir === 'close' ? 100 : 0;
    return Math.max(0, Math.min(100, +r[j || 0].pos || 0));
  } catch (e) {
    return null;
  }
}
/* 3.2.0-beta.59 (#116, user 2026-10-29 "DAPAT S PLANT MODEL GALING"): the run state of a DITL motor drawing (1 RUN, 0 STOP / TRIP), or
   of one output row of a drawing of two machines ("DITL-39@3" = DEBRIS FILTER S-1502 IN OPERATION); null while the one world is not
   built. The same reading as the lamps of the Training dock and the HMI (DUI.motState of src/digital/parts/03c-read.js, dock.js mst) */
function anDitlRun(addr, last) {
  try {
    if (typeof S === 'undefined' || !S.sheets || !window.WORLD || !WORLD.on || !WORLD.idx || !window.DUI) return null;
    const m = /^(.*?)(?:@(\d+))?$/.exec(String(addr)),
      C = AN_UNIT._dr || (AN_UNIT._dr = {});
    let s = C[m[1]];
    if (!s) {
      s = S.sheets.concat(WORLD.inst || []).find(x => x.name.endsWith(m[1])) || null;
      if (s) C[m[1]] = s;
    }
    if (!s) return null;
    if (!s.nl) s.nl = netlist(s);
    if (m[2] != null) {
      /* beta.314 (JENNIE): last = the output rows of the world's last scan (what the HMI shows). DUI.outVal reads the net values
         (nl._v), which miss a row driven by a field panel input (DITL-39 IN OPERATION rows 3 / 14 read 0 while the world had them 1:
         the debris filters never flushed). Only the filters ask for it: the other readers keep their timing */
      const wo = last && WORLD.out && WORLD.out[s.name];
      if (wo instanceof Set) return wo.has(+m[2]) ? 1 : 0;
      const v = DUI.outVal(s, +m[2]);
      return v == null ? null : v === 1 ? 1 : 0;
    }
    const st = DUI.motState ? DUI.motState(s) : null;
    return st == null ? null : st === 'RUN' ? 1 : 0;
  } catch (e) {
    return null;
  }
}
/* 3.2.1 (IRENE: PLANT MODEL, user 2026-11-04 "Kung ano lng ang mapapakinabangan ntn s simulation"): the useful manual valves of the
   closed cooling, make-up and air systems (field valves, no DCS signal; opening in %, normal line-up at 150 MW):
     closed cooling (PD-021 Rev D, hmi-cw.js): ACWP suction V-CW1002 / 1004, discharge V-CW1007 / 1009 (SOP: 5 % at start, then open to
       PG-CW1108 7 kg/cm2), CCWHE H-1107A / B / C inlet V-CW1010 / 1011 / 1012, outlet V-CW1013 / 1014 / 1015 (2 of 3 in service, MB-021:
       2 x 750 T/H; C standby = closed, NO-SOURCE which one stands by);
     make-up (PD-024 Rev D): demi tank outlets V-MU0001 / 0002, MWP suction V-MU0003 / 4 / 5, discharge V-MU0007 / 9 / 11, recirculation
       V-MU0013 / 15 / 17 (SOP: OPEN);
     air (PD-023 Rev C): unit 1 header isolation V-IA1101 (IA) / V-PA1087 (PA), cross-tie PA -> IA tanks V-PA0013 (normally closed). */
const AN_FV0 = {
  /* the water side of the feedwater heaters (PD-017, team-files/plant-study/11-heater-valves.md): manual gear valves, no DCS signal */
  'V-FW1009': 100,
  'V-FW1010': 100,
  'V-FW1011': 0,
  'V-FW1012': 100,
  'V-FW1013': 100,
  'V-FW1014': 0,
  'V-CD1026': 100,
  'V-CD1027': 100,
  'V-CD1028': 0,
  'V-CD1029': 100,
  'V-CD1030': 100,
  'V-CD1031': 0,
  'V-CW1002': 100,
  'V-CW1004': 100,
  'V-CW1007': 100,
  'V-CW1009': 100,
  'V-CW1010': 100,
  'V-CW1011': 100,
  'V-CW1012': 0,
  'V-CW1013': 100,
  'V-CW1014': 100,
  'V-CW1015': 0,
  'V-MU0001': 100,
  'V-MU0002': 100,
  'V-MU0003': 100,
  'V-MU0004': 100,
  'V-MU0005': 100,
  'V-MU0007': 100,
  'V-MU0009': 100,
  'V-MU0011': 100,
  'V-MU0013': 100,
  'V-MU0015': 100,
  'V-MU0017': 100,
  /* the line to T-1109 MU-1-021 (PD-024): V-MU1031, XV-MU1109 with its bypass V-MU1033, V-MU1032. PR-OPE-5002 section 7 "Ensure Expansion
     tank inlet valve is open (V-MU1031 and V-MU1032)". XV-MU1109 is spring opening: with no instrument air these are the only way to stop the fill (Mina F33) */
  'V-MU1031': 100,
  'V-MU1032': 100,
  'V-IA1101': 100,
  'V-PA1087': 100,
  'V-PA0013': 0,
  /* 3.2.1 (IRENE: FEEDWATER): the BFWP suction manual valves, PR-OPE-5002 19.16 "Fully OPEN BFPs suction (V-FW1002/V-FW1001) ...
     Check if the limit switch is touched" (IO list STN102 I.028F ZSO-FW1031 BFWP-A / I.032F ZSO-FW1032 BFWP-B suction manual valve
     open; V-FW1001 = A, V-FW1002 = B by the number order of the discharge MOVs MV-FW1001 A / MV-FW1002 B). Normal line-up: both open
     (the standby pump lined up for its auto start) */
  'V-FW1001': 100,
  'V-FW1002': 100
};
/* the water of a heater: inlet, outlet, bypass openings (%) -> share through the tubes (s) and whether the line passes at all (p).
   The split between the tubes and the bypass by opening: bypass hydraulics NO-SOURCE */
function anHtrPath(i, o, b) {
  const th = p => Math.max(0, Math.min(1, p / 20)),
    w = Math.min(th(i), th(o)),
    y = th(b);
  return { s: w + y > 0 ? w / (w + y) : 1, p: Math.min(1, w + y) };
}
/* the opening of a field valve (0 ~ 100 %), the normal line-up while the field operator has not turned it */
const anFv = tag => {
  const V = (typeof AN_SRC !== 'undefined' && AN_SRC.valve) || {};
  return isFinite(V[tag]) ? V[tag] : tag in AN_FV0 ? AN_FV0[tag] : AN_SW_V0[tag];
};
const AN_SW_V0 = {
  'V-SW1002': 100,
  'V-SW1004': 100,
  'V-SW1006': 100,
  'V-SW1007': 100,
  'V-SW1008': 100,
  'V-SW1009': 40,
  'V-SW1010': 40,
  'V-SW1016': 100,
  'V-SW1018': 100,
  'V-SW1020': 100
};
/* 3.2.1 (IRENE: PLANT MODEL, TURBINE OIL; user 2026-11-04 cross-system: "Kung mag adjust ka dito, mag aadjust din doon ang effect").
   The lube oil cooler H-1921A (B standby) on the closed cooling water: oil from the bearings (main oil tank) -> cooler -> bearings; cooling
   water from the ACW supply (TT-CW1153, AN_ACW) through TCV-CW1201 (ABC-053 TICLO1002 MV) -> return. Sources:
     cooler       O&M L2 TG 2-3 LUBE OIL COOLER R2 (H-n921A / B, plate type, 146.94 m2, 2 x 100 %): oil 2,660 L/min max, cooling water
                  170,000 kg/h max, water inlet 37 C max, oil outlet 46 C, 1,300 kW max -> clean UA 95.8 kW/K (counter flow, oil
                  63.0 -> 46 C, water 37 -> 43.6 C); Mass Balance K1AU3-MB-021 items 12 / 13: 170 T/H, 34 -> 41 C;
     snapshot     36.PNG (149 MW): oil in TILO1001 62 C, out 46 C; 27.PNG: TCV-CW1201 53.1 %, ACW supply 38 C;
     heat         Phase 11 (SUZU 2026-11-27, NO-FIT-OK: history, was oil 64.5 kW/K and 1,032 kW fitted on snapshot 36.PNG): the vendor
                  design point of the cooler itself (O&M L2 TG 2-3): 1,300 kW with the oil 63.0 -> 46 C, so the oil flow is 1,300 / 17 =
                  76.5 kW/K (2,670 L/min of ISO VG 32 at 0.86 kg/L x 2.0 kJ/kg K = the 2,660 L/min maximum of the sheet); the bearing
                  heat 1,300 kW at 3600 rpm x speed / 3600 while the lube oil flows (bearing oil pressure above 1.05 kg/cm2, tcs.js),
                  linear in speed NO-SOURCE (as the 16 C x speed of tcs.js). MB-021 items 12 / 13 (170 T/H 34 -> 41 C = 1,384 kW) is
                  the water side sizing of the same cooler, 6 % above the vendor duty;
     oil tank     one temperature node (the return oil), 25,800 kJ/K (about 15 m3 of oil, NO-SOURCE: the tank volume is not in the docs);
     cooler node  3.2.5 (JENNIE): the oil and the plates inside the cooler are a second node, Ch = 730 kJ/K (CALC from the vendor area
                  146.94 m2: oil channels = half of a 3 mm plate gap -> 0.22 m3 x 0.86 kg/L x 2.0 kJ/kg K = 379 kJ/K; plates 0.6 mm
                  stainless -> 0.088 m3 x 7,900 kg/m3 x 0.5 kJ/kg K = 348 kJ/K; gap and plate thickness NO-SOURCE, the usual values of a
                  plate cooler): Ch dTo/dt = Co (Treturn - To) - q, the tank takes back Co (Treturn - To) - its bearing heat. Before, the
                  outlet was the return - q / Co at once: a valve move reached TE-LO1002 in the same scan, and TICLO1002 in AUTO swung
                  the outlet 44.5 <-> 49.8 C on every scan (headless S68 3600 rpm soak, 2026-11-20), which the ATS 1.16 then read;
                  the steady outlet stays the return - heat removed / oil flow. TE-LO1002-1 / -2 = the outlet: the PV of TICLO1002, so
                  the logic, tcs.js (TILO1001, the bearing outlets TIGE1007 / 1008, the bearing metal) and the HMI read the same value.
   Chain: SWBP trip -> CCWHE no seawater -> ACW supply hot (AN_ACW) -> TCV-CW1201 opens (TICLO1002 in AUTO) -> at 100 % the oil gets
   hot -> the bearings get hot (tcs.js). */
/* 3.2.1 (IRENE: CONDENSATE plant model; docs/versions/v3.2.1/CONDENSATE_PLANT_MODEL.md). The condenser and the condensate pumps
   P-1116A / B (CEP) of flow diagram PD-016.
   Sources:
     condenser    O&M L15-1 (K2MC3A, section 1.1.2): thermal load 195.7 MW at the exhaust 87.78 kg/s (316.0 T/H, = AN_SW cSt), seawater
                  31,500 T/H 30 -> 35.6 C, 68.6 mbar abs (saturation 38.65 C), cleanliness 0.85, 6898 m2, hotwell 61.9 m3, normal level
                  FL+1814 mm (HHL +2114, LLL +1514);
     alarm list   "Alarm List _20160912": TE-CD1110-1 ~ 4 normal 38.6 C (H 50, L 27); PT-CD1110 range -1 ~ 5 kg/cm2, normal -0.86;
                  PT-CD1117 normal 15.5, L 14.0, LL 13.0 kg/cm2; LT-CD1110 H 150 / HH 300, L -150 / LL -300 mm;
     CEP          KSB WKTB 6/1+2 (O&M L10-1 A01 data sheet, A02 curve Q43495D, 1780 rpm, sp. gr. 0.9926): 400 m3/h at 180 m, shut-off
                  210 m, 160 m at 480 m3/h; shaft power 123 kW at 50, 252 kW at 400, 283 kW at 480 m3/h; min flow 100 m3/h; first stage
                  impeller GL-4.322 m, hotwell low level GL+1700 = FL+1500 mm (so the normal level is 6.34 m above the impeller);
     snapshot     28.png CP-A 28.1 A at 150 MW, PICD1117 16.9 kg/cm2; 4.PNG PICD1110 0.057 kg/cm2A, TICD11101 40.0 C;
     DITL-61B     row 19 PT-CD1117 < 14.0 kg/cm2 (1 s) = M.3217 CONDENSATE PUMPS OUTLET PRESSURE LOW -> DITL-61A row 10: the standby
                  pump in AUTO starts; DITL-61A rows 24 / 27 strainer DP > 0.1 / 0.08 kg/cm2.
   How it works:
     heat         Q = 195.7 MW x steam to the condenser / 316.0 T/H (the same steam as AN_SW: main steam share + LP bypass);
     condenser    the seawater of both water boxes (AN_SW swQc) at its inlet temperature: Ts = Tin + Q / (C (1 - exp(-UA / C))),
                  UA = 36,430 kW/K at the design flow (from the O&M point: NTU = ln(8.65 / 3.05)), x (flow / design)^0.5 (NO-SOURCE:
                  the usual water velocity factor); Ts follows with tau 30 s (NO-SOURCE); no seawater = no condensing: Ts goes to 100 C;
     pressure     PT-CD1110 = saturation of Ts, and the air of a condenser not in vacuum (U.vac, the ejectors) takes it to the atmosphere;
                  hotwell temperature = Ts (alarm list normal 38.6 = saturation of the design 68.6 mbar);
     turbine      the TCS LOW VACUUM trip at 0.26 kg/cm2 abs (IBD 310SC90-794 rev 2 sheet TA-10: 2 of 3, ON >= 0.26, OFF <= 0.22; LOW alarm 0.14);
     CEP          flow of a running pump = (condensate to the deaerator + recirculation) / running pumps (plant.js AN_CYC); head from the
                  curve; outlet PT-CD1117 = the discharge flange (plant.js anCdPdis): suction at the flange (condenser pressure + the
                  water from the hotwell surface down to the flanges, zS) + the head of the curve. Phase 11 (MEI): KSB GA drawing
                  F30157 A rev 3 (L10-1 A05): suction N1 / discharge N2 flange centre line 336 mm above the installation floor (GL),
                  first stage impeller 4,322 mm below it; the KSB head is flange to flange (the can and the column are inside the pump).
                  Hotwell normal level FL+1814 = GL+2014 mm (K2MC3A, FL = GL+200: data sheet "GL+1700 = FL+1500"), so zS = 2.014 -
                  0.336 = 1.678 m. Before: zS 6.336 m (down to the impeller, which the flange-to-flange head already counts) and a
                  kz 0.96 kg/cm2 taken off to meet the snapshot 16.9 (28.png); both are gone.
     current      Phase 11 rank 10 (MEI): the motor current from the shaft power of the pump curve through the induction motor balance
                  (anCepI, AN_CD_M below), in place of the old fixed ratio 28.1 A per 245.7 kW (deleted). */
const AN_CD = {
  Qd: 195700,
  Wd: 316.024,
  UA: 36430,
  Cd: 31500,
  cp: 3.994,
  tau: 30,
  Ptrip: 0.26,
  Tref: 38.65 /* C, condenser design steam side, K2MC3A */,
  qQ: [0, 100, 200, 300, 400, 450, 480, 560],
  qH: [210, 209, 205, 196, 180, 170, 160, 130],
  pQ: [0, 50, 400, 480],
  pP: [105, 123, 252, 283],
  zS: 2.014 - 0.336 /* m, GA F30157 A + K2MC3A hotwell normal level, see above */,
  dp0: 0.019,
  q0: 383
};
/* Phase 11 rank 10 (MEI): the condensate pump motor M-1116A / B (6.6 kV induction motor, KSB pump P-1116A / B).
   Design point, FHI load schedule K1AU3-E1-0-302 Rev A p4 (bus 1AM, items 6 / 7; YUA PC read 2026-11-27, project file
   mei-cep-motor-2026-11-27.md): 6600 V, 298.4 kW shaft, eff 0.94, pf 0.88, F.L.A. 31.56 A (= 298.4 / (sqrt3 x 6.6 x 0.94 x 0.88)),
   input 317.45 kW, 171.34 kvar, 360.74 kVA. The TECO data sheet 4A040Y856 (no-load current, part load eff / pf) is NOT IN DOCS, so the
   part load comes from the per-phase balance of an induction motor (equivalent circuit, the slip small):
     P_in = P_shaft + P_fix + P_cu,fl x (I / I_fl)^2      (fixed core + friction losses; copper losses with the square of the current)
     Q    = Q_0 + Q_L,fl x (I / I_fl)^2                    (magnetising kvar at rated voltage; leakage reactance kvar with I^2)
     I    = sqrt(P_in^2 + Q^2) / (sqrt3 x V)
   solved by a fixed point (4 passes, it moves < 0.01 A after 3). The two splits:
     i0   0.30 pu no-load (magnetising) current: Q_0 = sqrt3 x 6.6 x 0.30 x 31.56 = 108.2 kvar, so Q_L,fl = 171.34 - 108.2 = 63.1 kvar =
          0.175 pu leakage reactance, inside the usual 0.15 ~ 0.20 pu of a 4-pole MV motor (the check that the split holds);
          NO-SOURCE: 0.30 pu is the usual value of a 6.6 kV 4-pole motor of 300 kW (the range 0.25 ~ 0.35 of the PC read, general motor
          knowledge, not a plant document);
     fix  0.36 of the full-load losses (19.05 kW) are fixed: the efficiency is highest where copper = fixed losses, at 75 % load for a
          motor of this class (0.75^2 = 0.5625 = fixed / copper -> fixed = 0.5625 / 1.5625 = 0.36); NO-SOURCE: the 75 % maximum, the usual
          design of a standard induction motor.
   At the design point the balance gives 31.56 A exactly; at the KSB duty 252 kW 27.0 A; at shut-off (105 kW) 14.6 A. Snapshot check only
   (28.png CP-A 28.1 A at 150 MW). DESIGN-SRC: K1AU3-E1-0-302 Rev A, induction motor equivalent circuit */
const AN_CD_M = { V: 6.6, P: 298.4, eff: 0.94, pf: 0.88, i0: 0.3, fix: 0.36 };
function anCepI(Ps) {
  const M = AN_CD_M,
    r3 = Math.sqrt(3),
    Pin = M.P / M.eff,
    Ifl = Pin / M.pf / (r3 * M.V),
    Qfl = Pin * Math.tan(Math.acos(M.pf)),
    Pl = Pin - M.P,
    Q0 = r3 * M.V * M.i0 * Ifl;
  let I = Ifl;
  for (let k = 0; k < 4; k++) {
    const u = (I / Ifl) * (I / Ifl),
      P = Math.max(0, Ps) + M.fix * Pl + (1 - M.fix) * Pl * u,
      Q = Q0 + (Qfl - Q0) * u;
    I = Math.sqrt(P * P + Q * Q) / (r3 * M.V);
  }
  return I;
}
/* MW lost to the back pressure. docs/versions/v3.2.1/HEAT_BALANCE.md: calculated from the mass balance (exhaust quality 0.92 closes the
   balance at 150 MW). At constant entropy dh/dT = x hfg / T = 7.1 kJ/kg per C at 38.65 C; with 0.85 LP efficiency (NO-SOURCE) 6 kJ/kg per C,
   on the exhaust steam, 0.70 of the main steam (309.7 / 446 T/H, MB-013). A better vacuum gives a small gain, capped at 1 C. */
/* 3.2.4-beta.1 (Jennie, user 2026-11-17 "unahin mo nlng ang mga pinakamahalaga sa operation"): THE BOILER SAFETY VALVES. Before: none,
   so an over-pressure had no relief. Source: K1AU3-D1-0-011 RA Engineering Data of Safety Valve for Section I (FHI master documents
   D1, Consolidated / Dresser 1700 series, Fluids Control approval Rev. E): set pressure kg/cm2 G and rated capacity kg/h of Unit 1:
     drum      ZV-BR1001 153.5 / 174,207 (3" 1749WB), ZV-BR1002 158.0 / 180,344
     SH outlet ZV-MS1001 137.0 / 115,836 (3" 1749WE, 541 C; set below the low drum valve, P4S1 p4-1-3: it opens first so the
               superheater keeps a flow)
     reheater  ZV-HR1001 42.0 / 120,785, ZV-HR1002 43.0 / 122,174 (6" 1785WE), ZV-HR1003 44.5 / 197,548 (6" 1705RRWE)
   Pop action: full lift at the set pressure; the rated capacity is at 3 % accumulation (ASME Section I PG-67.2 / PG-69.2) and the
   steam flow of an open valve goes with the absolute pressure (critical flow, CALC). Reseat at the set less 4 % blowdown (ASME Section
   I PG-72.1: 2 to 4 %, the upper value; the data sheet has no blowdown). The drum and SH valves take the steam between the drum and
   FT-MS1031 as the sootblowers (U.msb): the drum loses it and the cycle needs it back as make-up. The reheater valves take it from the
   reheater mass balance. U.msv (drum + SH, T/H), U.msvR (reheater, T/H), U.svOpen holds { tag: 1 } for each valve open */
const AN_SV = {
  bd: 0.04,
  acc: 0.03,
  d: [
    { t: 'ZV-BR1001', p: 153.5, q: 174.207 },
    { t: 'ZV-BR1002', p: 158.0, q: 180.344 }
  ],
  s: [{ t: 'ZV-MS1001', p: 137.0, q: 115.836 }],
  r: [
    { t: 'ZV-HR1001', p: 42.0, q: 120.785 },
    { t: 'ZV-HR1002', p: 43.0, q: 122.174 },
    { t: 'ZV-HR1003', p: 44.5, q: 197.548 }
  ]
};
function anSvFlow(U, list, P) {
  if (!U.svOpen || typeof U.svOpen !== 'object') U.svOpen = {};
  let q = 0;
  if (!isFinite(P)) return 0;
  for (const v of list) {
    const o = U.svOpen[v.t] ? P > v.p * (1 - AN_SV.bd) : P >= v.p;
    if (o) {
      U.svOpen[v.t] = 1;
      q += (v.q * (P + 1.033)) / (v.p * (1 + AN_SV.acc) + 1.033);
    } else delete U.svOpen[v.t];
  }
  return q;
}
function anVacMW(U) {
  if (!isFinite(U.cdT) || !(U.ms > 0)) return 0;
  /* 3.2.4 (JENNIE): the LP exhaust sees the whole condenser pressure, the steam and the air in it (U.cdP = steam + U.cdAirP): the
     temperature of the back pressure is the saturation of U.cdP when the air raises it above the steam side (an air leak, the
     ejectors short); before, only the cooling water side (U.cdT) moved the power */
  const Tb = isFinite(U.cdP) ? anTsatA(U.cdP) : -Infinity,
    dT = Math.max(-1, Math.max(U.cdT, Tb) - AN_CD.Tref);
  U.dMWv = (6 * dT * 0.7 * U.ms) / 3600;
  return U.dMWv;
}
/* beta.362 (JENNIE, D21, design K2MC3A-100: 0.07 kg/cm2 A with the steam side at 38.65 C, Psat(38.65) = 0.0700): the air in the condenser
   collects in the air cooling zone at the ejector suction, where the air-steam mixture is cooled below the steam side. HEI Standards for
   Steam Surface Condensers (air removal): the suction mixture is 7.5 F = 4.17 K below the saturation of the condensing steam. The
   condenser pressure is the higher of the steam side saturation and the suction mixture (steam saturated at Ts - 4.17 plus the air):
   at the design air in-leakage the air does not raise the neck pressure (it read 0.0736 = steam 0.0617 + air 0.0115 before); with more
   air (leak, ejector short) the suction mixture lifts it, as before. ED 066 p6 design point 25.5 kg/h air + 61.3 steam at 0.055 abs is
   the ejector rating (a lower suction), it gives the air partial 0.0113, the same as the model air at 150 MW */
const AN_CD_SUB = 4.17;
function anCdP(Ts, pA) {
  const P1 = Math.min(1.033, anPsat(Ts)),
    P2 = Math.min(1.033, anPsat(Ts - AN_CD_SUB)) + Math.max(0, pA || 0);
  return Math.min(1.033, Math.max(P1, P2));
}
const anPsat = T =>
  (Math.pow(10, 8.07131 - 1730.63 / (233.426 + T)) * 1.33322) / 980.665; /* kg/cm2A, Antoine (water) */
function anCondStep(U, dt) {
  const K = AN_CD,
    sw = AN_SW,
    ws = Math.max(0, ((U.ms || 0) * sw.cSt) / sw.mcr + (U.qlp || 0) + (U.xtra || 0)),
    Q = (K.Qd * ws) / K.Wd,
    Tin = isFinite(U.swTiA) ? (U.swTiA + U.swTiB) / 2 : AN_SW_TIN[0],
    W = Math.max(0, (U.swQc || 0) * 1.02),
    C = (W / 3.6) * K.cp,
    UA = K.UA * Math.sqrt(W / K.Cd);
  let Tss = Tin;
  if (Q > 0) Tss = C > 1 ? Tin + Q / (C * (1 - Math.exp(-UA / C))) : 100;
  Tss = Math.min(100, Tss);
  if (!isFinite(U.cdTs)) U.cdTs = Tss;
  U.cdTs += (Tss - U.cdTs) * Math.min(1, dt / K.tau);
  const vac = isFinite(U.vac) ? Math.max(0, Math.min(1, U.vac)) : 1,
    Ps = Math.min(1.033, anPsat(U.cdTs));
  U.cdQ = Math.round(Q / 100) / 10; /* MW */
  U.cdT = U.cdTs;
  /* Phase 11 (MEI): the cd port (ports.js) for the turbine (RIN, back pressure) and the sea water (SUZU, CW outlet temperature).
     The heat each water box path takes NOW from the condensing steam at U.cdTs: Q_i = C_i (1 - exp(-UA_i / C_i)) (Ts - Tin_i), with
     the path flow U.swQcA / B (SUZU), UA_i = UA / 2 x sqrt(W_i / (Cd / 2)) (the same exchanger law as above, split in its two
     halves: K2MC3A is a two-pass, two-path condenser, PD-020). In a steady state QA + QB = Q; while Ts lags they differ (the stored
     heat of the steam side). kW, unrounded (agreed with SUZU). The pressure is set below (U.cdP), the port is written there. */
  const qBox = (Wt, Ti) => {
    const Wi = Math.max(0, (Wt || 0) * 1.02),
      Ci = (Wi / 3.6) * K.cp,
      UAi = (K.UA / 2) * Math.sqrt(Wi / (K.Cd / 2));
    return Ci > 1 && isFinite(Ti) ? Ci * (1 - Math.exp(-UAi / Ci)) * Math.max(0, U.cdTs - Ti) : 0;
  },
    QA = qBox(U.swQcA, isFinite(U.swTiA) ? U.swTiA : Tin),
    QB = qBox(U.swQcB, isFinite(U.swTiB) ? U.swTiB : Tin);
  /* 3.2.3 live Cold start: the air in the condenser is its own mass balance (anAuxStep U.cdAirP); the vacuum share is what is left of the
     room between the saturation and the atmosphere (the screens and the hood model read it) */
  if (isFinite(U.cdAirP)) {
    U.cdP = anCdP(U.cdTs, U.cdAirP);
    U.vac = Math.max(0, Math.min(1, (1.033 - U.cdP) / Math.max(1e-3, 1.033 - Ps)));
  } else U.cdP = Ps + (1.033 - Ps) * (1 - vac);
  anPortSet(U, 'cd', { P: U.cdP, T: U.cdTs, Q: QA + QB, x: { QA, QB } });
  /* the condensate pumps */
  const run = [srcBit(['M.3350']) > 0.5 ? 1 : 0, srcBit(['M.3351']) > 0.5 ? 1 : 0],
    n = run[0] + run[1],
    u = (typeof AN_CYC !== 'undefined' && AN_CYC.u) || {},
    wr = 2.23 * Math.max(0, Math.min(100, u.cf || 0)) /* FCV-CD1120, valve sheet p96, 223 T/H (as plant.js anCycFlows) */,
    Qt = n ? (anDaQ(u.da, wr) + wr) / 0.9926 : 0,
    q = n ? Qt / n : 0,
    hw = anUnitVal(U.cdHwL || []);
  U.cdQp = Math.round(q);
  U.cdQt = Math.round(Qt); /* Mina F28: FT-CD1120 of DITL-64 row 28 reads the plant, it stood at the default 75 T/H */
  U.cdHw = hw;
  U.cdRun = run;
  U.cdPd = Math.max(0, Math.min(25, anCdPdis(Qt, n, U.cdP, hw)));
  run.forEach((r, i) => {
    U['cdI' + i] = r ? Math.round(10 * anCepI(swInterp(K.pQ, K.pP, q))) / 10 : 0;
    U['cdDp' + i] = r ? Math.round(1000 * K.dp0 * (q / K.q0) * (q / K.q0)) / 1000 : 0;
  });
}
/* Phase 11 (NANA, 2026-11-27): moved to engine/fw.js (feedwater part of the plant model) */
/* Phase 11 (NANA, 2026-11-27): moved to engine/fw.js (feedwater part of the plant model) */
/* 3.2.1 (IRENE: LP HEATERS, docs/versions/v3.2.1/LP_HEATERS_PLANT_MODEL.md). The condensate temperatures through the No.1 / 2 / 3 LP heaters
   and their drain temperatures (no ABC or DITL sheet reads them: the values are for the plant pages, AN.unit.tt).
   Sources: FHI heater O&M (PC, o&m-package-phase-1 L15-5 / L15-6 / L15-7, PDF p14 "Nominal thermal characteristics", condensate 362.594 t/h):
     No.1 LPH  extraction 0.354 kgf/cm2A (sat 72.52 C), condensate 40 -> 70.8 C, TTD 1.72, DCA 5.62 (drain out 45.62 C)
     No.2 LPH  extraction 0.785 kgf/cm2A (sat 92.48 C), condensate 70.8 -> 90.7 C, TTD 1.78, DCA 5.61 (drain out 76.41 C)
     No.3 LPH  extraction 1.818 kgf/cm2A (sat 116.64 C), condensate 90.7 -> 114.9 C, TTD 1.74, DCA 5.62 (drain out 96.3 C)
     condenser O&M L15-1 p16: 68.6 mbar abs, saturation 38.65 C = the hotwell (AN_CD); the gland steam condenser and the ejector condenser
               between the hotwell and the No.1 LPH inlet: 40 - 38.65 = 1.35 C at the design point.
   Tags (IO list STN102): TT-CD1101 No.1 LPH inlet, TT-CD1102 No.2 LPH inlet, TT-CD1103-1 No.3 LPH inlet, TT-CD1103-2 No.3 LPH outlet,
   TT-CD1122 deaerator inlet, TT-HD1102 / 1103 No.2 / 3 LPH drain, TT-HD1105 / 1106 No.1 / 2 HPH drain (AN_HP hpD1 / hpD2).
   How it works: the shell pressure (abs) = design x main steam / 458.684 x the extraction MOV (DITL-97 No.3, DITL-98 No.2; the No.1 LPH has
   none), as AN_HP / AN_HD; condensate out = saturation of the shell - TTD, never below the water that comes in; drain out = condensate in
   + DCA while the heater drains (else the shell saturation); lag 120 s (NO-SOURCE, as AN_HP). NO-SOURCE: the 1.35 C rise taken with
   the load share; no pipe loss to the deaerator (02.png 94 / 93 C). */
const AN_LP = {
  F0: 458.684,
  /* key, design shell kgf/cm2A, TTD, DCA, extraction MOV */
  h: [
    ['H1', 0.354, 1.72, 5.62, null],
    ['H2', 0.785, 1.78, 5.61, 'DITL-98'],
    ['H3', 1.818, 1.74, 5.62, 'DITL-97']
  ],
  rise: 40 - 38.65,
  tau: 120
};
/* saturation temperature (C) of a pressure in kg/cm2A: the Antoine inverse of anPsat */
const anTsatA = P => (P > 0.005 ? 1730.63 / (8.07131 - Math.log10((P * 980.665) / 1.33322)) - 233.426 : -Infinity);
function anLphStep(U, dt) {
  const K = AN_LP,
    ms = Math.max(0, +U.ms || 0),
    ld = ms / K.F0,
    pos = n => {
      if (!n) return 100;
      const p = typeof anDitlPos === 'function' ? anDitlPos(n, 0) : null;
      return p == null ? 100 : p;
    },
    thr = p => Math.max(0, Math.min(1, p / 20)),
    L = U.lpT || (U.lpT = {}),
    lag = (k, x) => (L[k] = isFinite(L[k]) && dt > 0 ? L[k] + ((x - L[k]) * Math.min(dt, K.tau)) / K.tau : x),
    hw = isFinite(U.cdT) ? U.cdT : isFinite(U.Tamb) ? U.Tamb : 30,
    r1 = x => Math.round(10 * x) / 10,
    hd = U.hd || [];
  /* No.1 LPH: motor valves MV-CD1001 / 1002 / bypass 1003 (DITL-69 / 70 / 71); No.2, No.3: gear valves */
  const dp = (n, d) => {
      const p = typeof anDitlPos === 'function' ? anDitlPos(n, 0) : null;
      return p == null ? d : p;
    },
    wL = {
      H1: anHtrPath(dp('DITL-69', 100), dp('DITL-70', 100), dp('DITL-71', 0)),
      H2: anHtrPath(anFv('V-CD1026'), anFv('V-CD1027'), anFv('V-CD1028')),
      H3: anHtrPath(anFv('V-CD1029'), anFv('V-CD1030'), anFv('V-CD1031'))
    };
  U.lpS = { H1: wL.H1.s, H2: wL.H2.s, H3: wL.H3.s };
  U.cdPath = Math.min(wL.H1.p, wL.H2.p, wL.H3.p); /* both the tubes and the bypass of a heater shut = no condensate */
  /* 3.2.3 SOHEE: the condensate polisher (PD-016; MK05 page): inlet MOV MV-CD1007 (DITL-64), outlet MOV MV-CD1008 (DITL-65) and the
     polisher bypass FCV-CD1121 (ABC-032 FICCD1121, airlock item 11) in parallel on the condensate line after FT-CD1120 and before the
     min-flow recirculation take-off. 28.png (150 MW): both MOVs 0.0 %, FCV-CD1121 100.6 % M, FIQCD1121 0.0 T/H (polisher bypassed).
     The split by opening is that of the heaters (anHtrPath, bypass hydraulics NO-SOURCE); the polisher and the bypass both shut = no
     condensate (plant.js anCycFlows), the polisher flow FT-CD1121 = the condensate flow x the polisher share (source.js) */
  const pmv = typeof doOut === 'function' ? doOut('ABC-032', 'FICCD1121') : null,
    pol = anHtrPath(dp('DITL-64', 0), dp('DITL-65', 0), typeof doX === 'function' ? doX(pmv, 1) * 100 : 100);
  U.polS = pol.s;
  U.polP = pol.p;
  let tin = lag('in', hw + K.rise * Math.max(0, Math.min(1, ld)));
  const t = { in1: tin };
  for (const [k, P0, ttd, dca, mov] of K.h) {
    const Ps = P0 * anTbPx('x' + k.slice(1)) * thr(pos(mov)),
      ts = anTsatA(Ps),
      tout = lag(k, tin + (wL[k] ? wL[k].s : 1) * Math.max(0, ts - ttd - tin)),
      h = hd.find(x => x.k === k),
      drains = h && h.win > 0.5;
    t[k] = { in: tin, out: tout, Ps, dr: lag(k + 'd', drains ? tin + dca : Math.max(tin, ts)) };
    tin = tout;
  }
  U.lpHt = t;
  /* Phase 11 (MEI): the cd.out port (ports.js) for the deaerator (NANA): the condensate after the No.3 LP heater through LCV-CD1104.
     m = the flow anDaQ solves (plant.js anCycFlows fda); P = the valve outlet P2 = deaerator PT-CD1104 + z2 + kN m^2 (plant.js
     anCdHydK, LCV-CD1104 sheet + deaerator O&M L15-2), absolute; T = the No.3 LP heater outlet; h = IAPWS-IF97 region 1 (steamR1).
     And the store of this part (ports.js rule 4): the hotwell water, 61.9 / 0.9 = 68.8 m2 (AN_CYC.kgmm.hw, K2MC3A) x (600 mm normal
     water over the hotwell bottom: HHL is 900 mm over the bottom and 300 mm over the normal level FL+1814 / HHL FL+2114, K2MC3A O&M
     1.1.2) + the level LT-CD1110; E = m x h of water at the hotwell temperature. The LP heater water boxes and shells are not in the
     store yet (no water volume in the model: rank 6) */
  {
    const fl = typeof anCycFlows === 'function' ? anCycFlows(0) : null,
      mo = fl ? Math.max(0, fl.fda) : 0,
      pd = U.xt && U.xt.dea ? anUnitVal(U.xt.dea) : NaN,
      k = anCdHydK(),
      Po = isFinite(pd) ? pd + 1.0332 + (mo > 0 ? k.z2 + k.kN * mo * mo : 0) : null,
      To = t.H3.out,
      hw = isFinite(U.cdHw) ? U.cdHw : 0,
      Tw = isFinite(U.cdT) ? U.cdT : 30,
      mw = (AN_CYC.kgmm.hw() * (0.6 + hw / 1000) * anWaterRho(Tw)) / 1000;
    anPortSet(U, 'cd.out', {
      m: mo,
      P: Po,
      T: To,
      h: Po != null && isFinite(To) ? steamR1(Po * 0.0980665, To + 273.15).h : null
    });
    anPortSet(U, 'store.MEI', { mw, E: mw * steamR1(0.0980665 * Math.max(0.01, +U.cdP || 1.0332), Tw + 273.15).h });
  }
  U.tt = Object.assign(U.tt || {}, {
    'TT-CD1101': r1(t.H1.in),
    'TT-CD1102': r1(t.H2.in),
    'TT-CD1103-1': r1(t.H3.in),
    'TT-CD1103-2': r1(t.H3.out),
    'TT-CD1122': r1(t.H3.out),
    'TT-HD1102': r1(t.H2.dr),
    'TT-HD1103': r1(t.H3.dr),
    'TT-HD1105': U.hpD1,
    'TT-HD1106': U.hpD2
  });
  anCdTagStep(U, ld);
  anFwTagStep(U);
  anAsTagStep(U, dt);
  anHxTagStep(U, dt);
}
/* audit 2026-11-21 B1 (HX pages: transmitters that no logic sheet reads showed '-----'). Each value from the model, anchored on the
   HMI snapshot of the plant at 150 MW (hmi-op.js AN_HMI_AI) where a share is needed:
     TT-MS1007    turbine main steam = finishing S/H outlet TT-MS1004 (AI0612) less the heat the main steam line loses. A lagged pipe
                  loses about the same heat at any flow, so the drop goes with 1 / flow: 542 - 538 = 4 C at MCR 472.7 T/H (snapshot),
                  never below the ambient; under 5 % flow it is held at the 5 % drop (the line cools with no steam: not modelled).
                  Design beside it (Audit 3 ranking 5, user Q4 "close to the DCS 150 MW data, tuned from design, small tolerance"):
                  FHI P2S7 Tab 3 S/H outlet 541 C less the heat balance 150 MW turbine inlet 538.0 C (Hitachi 310SD07-485, 458.3 T/H)
                  = 3 C. The plant reads 4 C: inside the tolerance, so the plant value stays.
     PT-HR1001    reheat outlet header = hot reheat at the turbine PT-HR1003-1 (AI0421) + the line DP, flow squared: 35.0 - 34.3 =
                  0.7 kg/cm2 at MCR (snapshot), the reheat flow = HP exhaust + HP bypass (U.ms + U.mhp). Design beside it: FHI Tab 3
                  R/H outlet 35.1 kg/cm2 g = 36.1 ata less the heat balance IP inlet 34.77 ata = 1.3 kg/cm2 at 400.9 T/H, a design
                  upper bound (piping margin); the plant reads 0.7 and stays (Q4).
     TT-BR1020    No.1 economizer outlet water, TT-BR1030 No.2 (R + S), TT-BR1040 No.3 = the water into the drum: the heat transfer
                  chain (hx.js); TT-BR1110 S/H No.1 inlet = the steam leaving the wall (hx.js wl).
     TT-BR1120-1 / -2  S/H No.1 outlet header: the steam leaving panel 1 of the chain (hx.js p1o), both thermocouples.
     PT-BR1130    No.2 S/H panel inlet and PT-BR1150 finishing S/H inlet = drum PT-BR1001-1 (AI0128) less the S/H DP to there, flow
                  squared: 134.2 - 127.8 = 6.4 and 134.2 - 124.9 = 9.3 kg/cm2 at MCR, the same as the spray water DP of anFwTagStep.
     PT-FG1009-A2 / B2  seal pot fluidizing pressure (2), the lower tap: tap (1) (AI0146 / AI0147) + the solids column between the
                  taps, its weight a share of the bed inventory (U.bedI / AN_BI.t0): 533 + 82 = 615 and 308 + 84 = 392 mmH2O (snapshot).
     LT-CL1008-A ~ C  coal bunker level: the bunkers stand (simulator scope 2026-11-07, the coal yard is outside the model, like the
                  ash silos): the snapshot 4.56 / 3.65 / 3.89 m.
     MIA-CL1061-x1  coal feeder totalized coal (t): the feeder feedrate (ABC-004x AI0480 / 0512 / 0544, T/H) summed in time since
                  the start of the simulator. */
/* beta.241 (Rosé, real-click test of beta.240: the Reheat page showed '-----' on first open while paused). The display transmitters that
   only the model writes (U.tt: TT-MS1007, PICR19011 ~ 13 ...) are made by the tag steps at the end of anLphStep, so a starting state or
   save point captured before a key existed had no value for it until the first step. A load runs the tag steps once with dt 0: they
   read the plant as it stands and write the display values only (their lags and sums hold at dt 0). Called by anStateApply (state.js) */
function anTagsNow(U) {
  if (!U || !U.on) return;
  const ld = Math.max(0, +U.ms || 0) / AN_LP.F0;
  anCdTagStep(U, ld);
  anFwTagStep(U);
  anAsTagStep(U, 0);
  if (U.hxM && isFinite(U.hxM.wl) && typeof steamTsat === 'function') anHxRun(U, 0, steamTsat(U.Pd)); /* beta.245: the chain outputs of the loaded plant (no settle: a loaded metal only) */
  anHxTagStep(U, 0);
}
function anHxTagStep(U, dt) {
  const C = U.hxtC || (U.hxtC = {}),
    ai = k => anUnitVal(C[k] || (C[k] = anUnitAIs(k))),
    /* a transmitter on no sheet reads the snapshot value of the HMI (hmi-op.js), as its own page shows it */
    aiH = k => {
      const v = ai(k),
        h = typeof AN_HMI_AI !== 'undefined' ? AN_HMI_AI[k] : null;
      return isFinite(v) ? v : h ? +h[0] : NaN;
    },
    r1 = x => (isFinite(x) ? Math.round(10 * x) / 10 : null),
    ms0 = AN_FWT.ms0,
    ms = Math.max(0, +U.ms || 0),
    Ta = isFinite(U.Tamb) ? U.Tamb : 30,
    H = U.hxO || {},
    t1004 = ai('1|AI0612'),
    pd = ai('1|AI0128'),
    lf = (ms / ms0) * (ms / ms0),
    mr = ms + Math.max(0, +U.mhp || 0),
    fr = U.bedI > 0 ? U.bedI / AN_BI.t0 : 0,
    T = U.tt || (U.tt = {});
  Object.assign(T, {
    'TT-MS1007': r1(isFinite(t1004) ? Math.max(Ta, t1004 - Math.min(t1004 - Ta, (4 * ms0) / Math.max(ms, 0.05 * ms0))) : NaN),
    'PT-HR1001': r1(ai('2|AI0421') + 0.7 * (mr / ms0) * (mr / ms0)),
    'TT-BR1020': r1(H.e1o),
    'TT-BR1030': r1(H.e2o),
    'TT-BR1040': r1(H.tEco),
    'TT-BR1110': r1(H.wl),
    'TT-BR1120-1': r1(H.p1o),
    'TT-BR1120-2': r1(H.p1o),
    'PT-BR1130': r1(anShTap(U, AN_SHDP.s1, pd, ms)),
    'PT-BR1150': r1(anShTap(U, AN_SHDP.s2, pd, ms)),
    'PT-FG1009-A2': Math.round(aiH('1|AI0146') + 615 * fr),
    'PT-FG1009-B2': Math.round(aiH('1|AI0147') + 392 * fr),
    'LT-CL1008-A': 4.56,
    'LT-CL1008-B': 3.65,
    'LT-CL1008-C': 3.89
  });
  /* IT-SB01 (I/O list STN2 AI0804 "#1 Sootblower system current", MCC --> DCS): the current of the Unit 1 460 V sootblower MCC SB-11.
     Source: LV MCC drawing K1AU3-E1-0-107 (ABB/Xiamen LV, 1TNR003746D1007 SLD for UNIT 1 460V SYSTEM SB-11): incomer 3P MCCB with CT 75/5 A,
     31 reversing DOL starters (RD1.x, MO325 + TA25DU), 29 with the overload relay TA25DU-2.4M (1.7-2.4 A) = the lance drives and 2 with
     1.3-1.8 A = the air heater blowers. The relay is set at the motor full load current, so one running motor draws the middle of its band:
     2.05 A per lance, 1.55 A per air heater blower. Check by engineering: a 1.1 kW 4-pole lance motor at 460 V, PF 0.78, eff 0.83 gives
     I = P/(sqrt3*V*PF*eff) = 1100/(1.732*460*0.78*0.83) = 2.13 A, inside the 1.7-2.4 A band. A lance motor runs while it travels in or out
     (world.js sbLance: _lance.dir != 0); an air heater blower while its phase runs (U.sbA.ph). Nothing running = 0 A (the 120 V control
     supply is external UPS, not on the bus). */
  {
    const W = typeof window !== 'undefined' ? window.WORLD : null,
      L = W && W.sbLances ? W.sbLances() : [];
    let i = 0;
    for (const s of L) if (s._lance && s._lance.dir) i += 2.05;
    if (U.sbA && U.sbA.ph) i += 1.55;
    T['IT-SB01'] = Math.round(i * 10) / 10;
  }
  (U.fuel || []).forEach((l, i) => {
    const k = 'MIA-CL1061-' + 'ABC'[i] + '1',
      q = Math.max(0, anUnitVal(l) || 0);
    T[k] = (isFinite(T[k]) ? T[k] : 0) + (q * Math.max(0, dt || 0)) / 3600;
  });
}
/* 3.2.1 (IRENE, page 05 CONDENSATE): the other condensate transmitters of the page that no sheet reads (AN.unit.tt).
   Sources: 28.png (151.3 MW, MSF 480.3 T/H): hotwell TT-CD1110-1 / -2 40, flash chamber TT-CD1110-4 42, TT-CD1118 40, ejector condenser
   outlet TT-CD1119 41, gland steam condenser outlet TT-CD1120 42 C, LP bypass spray FT-CD1115 0.0 (XV-CD1114 closed, TCV-CD1115 0.2 %
   MANUAL); 02.png (60 MW): FT-CD1122 165.4 T/H, PT-CD1122 3.8 with PT-CD1104 2.2 kg/cm2, TT-CD1104 131 C; IO list FT-CD1115 0 ~ 46 T/H.
     TT-CD1119     hotwell + half of the ejector / gland steam condenser rise of AN_LP (28.png: 40 -> 41 -> 42 C, half each);
     TT-CD1110-4   hotwell + 2 C x load share (28.png 42 vs 40 C: the heater drains that flash in the chamber; NO-SOURCE: the load shape);
     FT-CD1122     the condensate that the deaerator level valve passes (plant.js anCycFlows fda, without the recirculation of FT-CD1120);
     PT-CD1122     deaerator pressure PT-CD1104 + 1.6 kg/cm2 (02.png 3.8 - 2.2; NO-SOURCE: kept the same at every flow, the water column to
                   the deaerator inlet; no CEP = no flow, the column stays);
     TT-CD1104     the storage tank water at the saturation of the deaerator pressure PT-CD1104 (02.png 131 C with 2.2 kg/cm2 = sat 135.6 C:
                   4.6 C under, not modelled);
     FT-CD1115     LP bypass spray: TCV-CD1115 opening (ABC-052 TICHR1012 MV, its airlock AN_AV) x the share of the block valve XV-CD1114
                   (DITL-66) x 46 T/H (NO-SOURCE: the valve capacity taken as the transmitter range of the IO list). */
function anCdTagStep(U, ld) {
  const hw = isFinite(U.cdT) ? U.cdT : isFinite(U.Tamb) ? U.Tamb : 30,
    r1 = x => (isFinite(x) ? Math.round(10 * x) / 10 : null),
    L = Math.max(0, Math.min(1, ld)),
    Pda = U.xt && U.xt.dea ? anUnitVal(U.xt.dea) : NaN,
    f = typeof anCycFlows === 'function' ? anCycFlows(0) : null;
  if (!U.lpbSp) {
    const x = AN.sheets.find(y => y.name === 'ABC-052'),
      c = x && x.S && AN.hmiCtrls ? (AN.hmiCtrls(x.S) || []).find(q => q.tag === 'TICHR1012') : null;
    U.lpbSp = c && c.out != null ? { S: x.S, n: c.out } : { n: null };
  }
  const mv = U.lpbSp.n != null ? Math.max(0, Math.min(100, +U.lpbSp.S.rt.v[U.lpbSp.n] || 0)) : NaN,
    sp = (U.spr || []).find(z => z.v[0] === 'DITL-66'),
    uf = sp && sp.pr.uf != null ? sp.pr.uf : NaN;
  /* F6 2026-11-22: U.tt may not exist yet (the Web Worker engine runs this first at 'go', before any other tag step made it): the same
     guard as the other tag steps; without it the Worker stopped at start and the page ran the engine on its own thread */
  Object.assign(U.tt || (U.tt = {}), {
    'TT-CD1119': r1(hw + (AN_LP.rise * L) / 2),
    'TT-CD1110-4': r1(hw + 2 * L),
    'FT-CD1122': f ? r1(f.fda) : null,
    'PT-CD1122': isFinite(Pda) ? r1(Pda + 1.6) : null,
    'TT-CD1104':
      isFinite(Pda) && Pda > 0.05 ? r1(steamTsat(Pda)) : isFinite(Pda) ? r1(isFinite(U.Tamb) ? U.Tamb : 30) : null,
    'FT-CD1115': isFinite(mv) && isFinite(uf) ? r1((68 * anAv('TICHR1012', mv) * uf) / 100) : null
  });
}
/* 3.2.1 (IRENE, page 06 FEEDWATER): the turbine extraction, feedwater and spray transmitters of the page that no sheet reads (AN.unit.tt).
   Sources:
     4.PNG (004 EXTRACTION STEAM, 148.8 MW, MSF 472.7 T/H): PT-TS1013 (No.2 extraction) 14.07, PT-TS1017 (No.3 extraction) 5.30 kg/cm2,
       TT-TS1011 (cold reheat to the No.2 HPH) 371 C, FT-FW1059 1.8 T/H with TCV-FW1060 0.1 % MANUAL and XV-FW1061 closed;
     03.png (003 MAIN WATER / STEAM, 150.5 MW, MSF 474.1): PIFW1011 165.4, drum PIBR10011 134.2, PIBR1130 (after SH panel #1) 127.8,
       PIBR1150 (finishing SH inlet) 124.9, PIFW1160 137.7 kg/cm2, TIFW1011 162 C, PIFW1115A / B 6.7 / 7.1 with DPIFW1115A 0.29,
       TICBR1130 MV 57.6 -> TCV-FW1110-1 45.5 / -2 100.7 %, FIQFW1109 37.5; TICBR1150 MV 30.2 -> TCV-FW1120-1 14.9 / -2 99.7 %, FIQFW1119 28.2;
     5.png (005 REHEATER STEAM, 152.5 MW, MSF 482.2): TCV-FW1150 66.0 % AUTO, XV-FW1151 open, FIQFW1149 14.8 T/H;
     control valve data sheets K1AU3-E2-0-123 R1 (PC), items 19 / 20 / 23 / 24 (Copes-Vulcan): TCV-FW1110-1 linear, Cv 0.17 / 3.29 /
       9.49 / 14 at 2 / 25 / 68 / 100 % travel, 35000 kg/h at 165.3 -> 142.2 kg/cm2 g; TCV-FW1110-2 cascade 0.05 / 0.99 / 1.67 at
       6 / 59 / 100 %; TCV-FW1120-1 equal % 0.17 / 2.46 / 8.84 / 15 at 10 / 48 / 75 / 100 %; TCV-FW1120-2 equal % 0.05 / 0.99 / 1.5 at
       19 / 90 / 100 %; the start-up valves (-2) in parallel with the main (-1), each behind its block valve XV-FW1111-1 / -2 (DITL-32 /
       #B), XV-FW1121-1 / -2 (DITL-33 / #B);
     ABC-011 / 012 F(X) LN47 / LN46, LN49 / LN48: the controller MV to valve (1) / (2) (MV 57.6 -> 45.6 / 100, MV 30.2 -> 14.9 / 100).
   How it works:
     PT-TS1013 / 1017   the snapshot pressure x main steam / 472.7 (absolute, a turbine stage, as AN_HP);
     TT-TS1011          the cold reheat temperature of the unit model (anUnitStepX X.T.cr);
     PT-TS1026          (beta.33) the same stage law from 0.25 kg/cm2 g (4.PNG PITS1026, STN102 AI0563, range -1 ~ 5);
     TT-TS1014 / 1018 / 1023 / 1027  (beta.33) 4.PNG 426 / 314 / 188 / 91 C: with the stage pressure ratios fixed (Stodola), the
                        absolute temperature of an extraction keeps its ratio to the hot reheat (TT-HR1004, X.hr against TIHR1004 540 C of the snapshot);
                        below 5 % main steam it goes to the ambient (NO-SOURCE, no flow through the turbine);
     PICR19011 / 12 / 13 (beta.33) HP turbine exhaust steam pressure A / B / C (DCS loop list STN2 SI1700-1702, 0 ~ 50): the hot
                        reheat pressure x 36.6 / 35.1, the Pcr of the bypass model (snapshots 35.4 ~ 36.1 at 150 MW);
     PT-FW1115-A / B    the suction header (plantsw.js sucP) minus the loss of a running pump's branch = its strainer DP (AN_FW fwDp)
                        x 0.4 / 0.29 (03.png: running A 6.7 = idle B 7.1 - 0.4 at strainer DP 0.29; low load check: DP 0.07 -> 4.0 - 0.1
                        = 3.9, PIFW1115A 3.9);
     TT-FW1011          the deaerator water: saturation of PT-CD1104 (the pump heating not modelled; 03.png 162 C);
     PT-FW1160          drum pressure + 3.5 kg/cm2 x (feedwater / 499.1)^2 (03.png 137.7 - 134.2);
     ZT-FW1110 / 1120   the F(X) of the controller MV (its airlock AN_AV: the MV is held without air);
     FT-FW1109 / 1119   0.7674 T/H x (Cv(-1) x XV-1 + Cv(-2) x XV-2) x sqrt(PT-FW1011 - spray point), Cv from the travel by the sheet
                        points; spray point = drum - 6.4 / 9.3 kg/cm2 x (main steam / 474.1)^2 (03.png); 0.7674 from item 19 COND 1. The
                        No.1 spray gives 37.3 T/H at the 03.png point (37.5). The No.2 spray gives 9.6 T/H by its sheet against 28.2 in
                        03.png: UNUSUAL (the equal % curve at 14.9 % travel is far below what flows); beta.259: the x 2.94 snapshot calibration is removed (no patches: the Cv of the data sheet only);
     FT-FW1149          14.8 x TCV-FW1150 (TICHR1002 MV) / 66.0 x XV-FW1151 (DITL-35) x sqrt(dp / 130.5) (NO-SOURCE: linear valve, the tap
                        at the pump discharge, dp to the reheat inlet 165.4 - 34.9);
     FT-FW1059          40 T/H x TCV-FW1060 (TICMS1022 MV) x XV-FW1061 (DITL-79) x sqrt(dp / 130.5) (NO-SOURCE: no data sheet, the
                        capacity taken as the IO range; 4.PNG 1.8 T/H at 0.1 % with the block valve closed is not modelled).
   Not on any DCS sheet: XV-TS1700 / 1710 (NO-SOURCE, not modelled). */
/* 3.2.1 (IRENE: page 08 AUX STEAM AND VACUUM; docs/versions/v3.2.1/AUX_STEAM_PLANT_MODEL.md). The values of page 08 that no ABC / DITL
   sheet reads, in AN.unit.tt for the plant page.
   Sources:
     TCS IO list   iolist-tcs HMI_AI: PTST11101 ~ 3 "LP TURBINE EXHAUST HOOD STEAM PRESS. (CONDENSER VACUUM) (A / B / C)" kg/cm2 abs,
                   TEST11101 ~ 3 "LP TURBINE EXHAUST HOOD STEAM TEMP." 0 ~ 150 C, PTGS10011 / 2 "GLAND STEAM SEAL HEADER PRESS." -1 ~ 2
                   kg/cm2g, TEGS1002 "GLAND STEAM SEAL HEADER TEMP.", TEGS1003 "GLAND STEAM SEAL LP INLET TEMP.", ZTGS1034 "STEAM
                   PACKING UNLOADING VALVE POSITION", ZTAS1011 / MVAS1011 "HP TURBINE WARMING VALVE POSITION";
     DCS IO list   STN102 AI0643 TT-AS1015 gland steam desuperheater outlet, AI0706 / AI0720 ZT-AS1020-1 / -2;
     ABC-030       PIC-AS1005 MV -> F(X) LN17 (valve 1) / LN16 (valve 2) (29.PNG MV 4.2 -> 0.1 / 32.2 %; the F(X) gives 0 / 32.3);
     29.PNG 150 MW condenser 0.056 / 0.053 / 0.053 kg/cm2A, hood 38 / 38 / 37 C (= the saturation of the condenser: wet steam on load);
                   gland header 0.32 kg/cm2, TEGS1002 / 1003 364 / 362 C, TT-AS1015 257 C, aux header TT-AS1003 236 C, PV-GS1034
                   42.6 % (the unloading valve spills the HP packing leak-off on load to the No.1 LPH: the plant self-seals);
     PR-OPE-5002   GLAND SEALING: TIAS1015 220 C (cold 150 ~ 260); HP TURBINE WARMING: TCS opens MV-AS1011 to 40 ~ 42 %, closes it at the end.
   How it works:
     PTST11101 ~ 3 = PT-CD1110 (the model condenser U.cdP); TEST11101 ~ 3 = the LP exhaust hood of the TCS model (tcs.js c.Tx, start-up),
     the condenser saturation without it (Start at 150 MW);
     ZT-AS1020-1 / -2 = the F(X) of the PIC-AS1005 MV (held by the airlock without air, AN_AV);
     gland header (in service: the TCS gland sealing, or a turbine on load): 0.32 kg/cm2 = 29.PNG; the steam seal feed valve
     sheet (TG maintenance manual p2500 ~ 2501) gives a set point of about 0.3 kg/cm2 g (CALC), the LOW alarm is 0.10 kg/cm2 (ATS 1.10);
     out of service 0;
     NO-SOURCE (no load curve in the docs): from no load (fed from the aux steam header, TT-AS1015 = TT-AS1003) to 150 MW (self-sealing, 29.PNG)
     linear in the load: TT-AS1015 + 21 C, TEGS1002 + 107 C over TT-AS1015, TEGS1003 = TEGS1002 - 2, PV-GS1034 42.6 %; the temperatures
     follow with 300 s;
     MV-AS1011 = 40 % while the TCS is in HP TURBINE WARMING (step 0, phase warm), else 0. */
function anAsTagStep(U, dt) {
  const r1 = x => (isFinite(x) ? Math.round(10 * x) / 10 : null),
    r3 = x => (isFinite(x) ? Math.round(1000 * x) / 1000 : null),
    C = U.asC || (U.asC = {}),
    c = U.tc,
    Ta = isFinite(U.Tamb) ? U.Tamb : 30,
    L = Math.max(0, Math.min(1, (+U.MW || 0) / 150)),
    gland = isFinite(U.gsP) ? U.gsP >= 0.1 : c ? !!c.gland : (U.tb && U.tb.rpm > 100) || (+U.MW || 0) > 0,
    Ps = isFinite(U.cdP) ? anTsatA(U.cdP) : NaN,
    hood = c && isFinite(c.Tx) ? c.Tx : isFinite(Ps) ? Ps : Ta;
  /* PIC-AS1005 MV -> the two valves (ABC-030 F(X)) */
  if (C.S === undefined) {
    const x = AN.sheets.find(y => y.name === 'ABC-030'),
      k = x && x.S && AN.hmiCtrls ? (AN.hmiCtrls(x.S) || []).find(q => q.tag === 'PICAS1005') : null;
    C.S = k && k.out != null ? x.S : null;
    C.n = k ? k.out : null;
    C.f1 = C.S ? C.S.blk.find(b => b.k === 'FX' && b.p && b.p.ln === 'LN17') || null : null;
    C.f2 = C.S ? C.S.blk.find(b => b.k === 'FX' && b.p && b.p.ln === 'LN16') || null : null;
    C.taux = anUnitAIs('2|AI0642');
  }
  let mv = C.S ? Math.max(0, Math.min(100, +C.S.rt.v[C.n] || 0)) : NaN;
  if (AN_AV.hold.PICAS1005) {
    const H = U.avH || (U.avH = {}),
      P = anAvP();
    if (!isFinite(P) || P >= AN_AV.lock || !isFinite(mv)) H['mv:PICAS1005'] = mv;
    else if (H['mv:PICAS1005'] == null || !isFinite(H['mv:PICAS1005'])) H['mv:PICAS1005'] = mv;
    mv = H['mv:PICAS1005'];
  }
  const fx = b => (b && isFinite(mv) ? Math.max(0, Math.min(100, anFXs(b.p, mv).y)) : NaN),
    Taux = anUnitVal(C.taux || []),
    t15 = gland ? (isFinite(Taux) ? Taux : Ta) + 21 * L : Ta,
    tgs = gland ? t15 + 107 * L : Ta,
    lag = (k, x) => (U[k] = !isFinite(U[k]) ? x : dt > 0 ? U[k] + ((x - U[k]) * Math.min(dt, 300)) / 300 : U[k]); /* beta.241: dt 0 (anTagsNow at a load) holds the lag */
  lag('asT15', t15);
  lag('asTgs', tgs);
  Object.assign(U.tt || (U.tt = {}), {
    PTST11101: r3(U.cdP),
    PTST11102: r3(U.cdP),
    PTST11103: r3(U.cdP),
    TEST11101: r1(hood),
    TEST11102: r1(hood),
    TEST11103: r1(hood),
    'ZT-AS1020-1': r1(fx(C.f1)),
    'ZT-AS1020-2': r1(fx(C.f2)),
    'TT-AS1015': r1(U.asT15),
    PTGS10011: isFinite(U.gsP) ? r3(U.gsP) : gland ? 0.32 : 0,
    PTGS10012: isFinite(U.gsP) ? r3(U.gsP) : gland ? 0.32 : 0,
    TEGS1002: r1(U.asTgs),
    TEGS1003: r1(U.asTgs - 2 * L),
    'PV-GS1034': isFinite(U.gsV34) ? r1(U.gsV34) : gland ? r1(42.6 * L) : 0,
    'PV-GS1031': isFinite(U.gsV31) ? r1(U.gsV31) : 0,
    'ZT-AS1011': c && c.cur === 0 && c.ph === 'warm' ? 40 : 0
  });
}
/* 3.2.3 live Cold start (user 2026-11-14 "Bkt patch lng? Code ang gawin. Hnd temporary fix!"): the auxiliary steam header, the gland
   steam seal header and the air in the condenser as mass balances. Before: the header pressure was a first-order lag toward
   min(10.5, drum - 1) (tcs.js TCS.tauAux), the gland seal a switch (tcs.js c.gland) with its header written 0.32 / 0, and the vacuum a
   share that rose at a fixed rate (AN_UNIT vacUp) once the TCS flags said so. Now each one is the pressure of its own volume, from the
   flows of the valves and machines that are on it.
   Sources (document-references, read 2026-11-14):
     valve flow       ISA-75.01 compressible: W = 27.3 Cv Y sqrt(x P1 rho1) kg/h (P bar a, rho kg/m3), x = dP / P1 not above Fk xT
                      (Fk = 1.3 / 1.4, xT 0.7 globe), Y = 1 - x / (3 Fk xT); rho1 = IF97 region 2 (steam.js steamRho). Checked against the
                      valve sheets: PV-GS1031 NOR 2170 kg/h at Cv 17.4 (model 2136), MAX 3600 at Cv 47.9 (3554); PCV-AS1020-1 COND 1
                      10000 kg/h at Cv 255 (10042); PV-GS1034 NOR 460 kg/h at Cv 38.5 (451); PCV-AS1030 COND 1 22059 kg/h at Cv 190
                      (18900: Raven trim, its xT is not on the sheet);
     aux header       in: PCV-AS1010 (PICAS1004 MV, ABC-030) from the main steam through the MOV MV-AS1391 (DITL-51), Cv 93 (plant study
                      04 from the L21 sheet: 45,500 kg/h, 60.2 -> 11.4 kg/cm2 G); PCV-AS1020-1 Cv 341.5 linear and PCV-AS1020-2 Cv 9 linear
                      (E2-0-123 p32 / p37) from the cold reheat, their openings = F(X) LN17 / LN16 of the PICAS1005 MV (ABC-030);
                      out: deaerator pegging PCV-AS1030 (PICCD1104 MV, ABC-056) Cv 253.7 (E2-0-123 p42, linear: NO-SOURCE characteristic)
                      to the deaerator pressure PT-CD1104; the steam jet air ejector MV-AS1396 (DITL-55) 223 + 202 = 425 kg/h and the
                      start-up ejector MV-AS1395 (DITL-54) 1477 kg/h at 11 kg/cm2 G (ED 066 p6 / p9), a choked nozzle: x (P / 12.03 abs);
                      the steam seal feed valve PV-GS1031; the volume 6 m3 is NO-SOURCE (the 12-inch header and branches are only on
                      the scanned P&ID PD-014); the header steam at 350 C (MB-014 items 2 / 5 operating 11 kg/cm2 G, 350 C);
     gland header     PV-GS1031 Cv 75 linear DN80 (TG maintenance manual p2385 ~ 2394) from the aux header, PV-GS1034 unloading Cv 375
                      equal % (p2395 ~ 2404) to the No.1 LP heater; one PI on PT-GS1001 (p103: feed at vacuum up / low load, unloading
                      spills the surplus on load), split at 0; set point 0.32 kg/cm2 G (29.PNG 150 MW; the feed valve sheet NOR outlet
                      1.31 kg/cm2 A = 0.28 G); PI gains NO-SOURCE; the glands take K sqrt(P^2 - Pc^2) (labyrinth), K from the NOR case
                      2170 kg/h at 1.31 abs into a condenser at 0.07 abs; on load the HP / IP packing leaks into the header with the cold
                      reheat pressure (CALC: 2694 kg/h at 150 MW = the glands 2243 + the unloading valve 451 at 42.6 %, 29.PNG); volume
                      1.5 m3 NO-SOURCE; "in service" (ATS 1.10) = header >= 0.10 kg/cm2 G (IBD TD-3 LOW alarm);
     condenser air    the evacuated volume 338 m3 (ED 066 p15) at the condenser temperature; in: the air in-leakage, an orifice that passes
                      the design 25.5 kg/h (ED 066 p6) at the design 0.055 kg/cm2 A, the LP glands while their steam is below the
                      atmosphere (orifice CdA 0.00072 m2, NO-SOURCE: 610 kg/h into full vacuum, the gland clearances are not in the docs),
                      the vacuum breaker MV-AV1391 (DITL-56, CdA 0.0195 m2 = an 8-inch valve, NO-SOURCE size); out: the ejectors as
                      volume pumps, S(P) m3/h from their curves (start-up ejector ED 066 p16 air kg/h / air density; steam jet air
                      ejector p14 total kg/h / mixture density of the design point 25.5 air + 61.3 steam), the air taken = S x the air
                      density at its partial pressure; the capacity goes with the motive steam (choked nozzle: P / 12.03 abs); the steam
                      jet air ejector needs its inter / after condenser cooled by the condensate (a condensate pump running);
                      condenser pressure = air partial pressure + saturation of the condensing temperature (anCondStep).
     Check: the start-up ejector alone takes the condenser from 1.03 to 0.345 kg/cm2 A in about 14 min in this model; ED 066 p15 gives
     20 min (its p16 capacity curve, read from the plot, is higher than the p15 pump-down needs). */
const AN_AS = {
  Va: 6 /* m3, NO-SOURCE */,
  Vg: 1.5 /* m3, NO-SOURCE */,
  Ta: 350,
  Tg: 260 /* PV-GS1031 sheet 260 C */,
  cv1010: 93,
  cv1020: [341.5, 9],
  cv1030: 253.7,
  cvGf: 75,
  cvGu: 375,
  ej: { sjae: 425, start: 1477, Pm: 12.0332 },
  gSv: 0.32,
  gKp: 60 /* % per kg/cm2, NO-SOURCE */,
  gTi: 15 /* s, NO-SOURCE */,
  Kseal: 2170 / Math.sqrt(1.31 * 1.31 - 0.07 * 0.07),
  Whp0: 2694,
  Vc: 338,
  cdaLeak: 25.5 / 3600 / 235 /* m2, the orifice that passes 25.5 kg/h into the design vacuum */,
  cdaGl: 0.00072,
  cdaVb: 0.0195,
  /* P abs kg/cm2 -> S m3/h (see the head) */
  sStart: [
    [0.1, 0],
    [0.1767, 1204],
    [0.2175, 1631],
    [0.2474, 1792],
    [0.2787, 1909],
    [0.3331, 1863],
    [0.4011, 1769],
    [0.4758, 1677],
    [0.5574, 1591],
    [0.6295, 1549]
  ],
  sSjae: [
    [0.015, 0],
    [0.0272, 1027],
    [0.0551, 2003],
    [0.0816, 2177],
    [0.0952, 2133],
    [0.1319, 1925],
    [0.1496, 1867]
  ],
  /* 3.2.3-beta.223 (live Cold start F37 / F38): the steam temperatures of the aux and gland lines are energy balances of the pipe
     metal, M c dT/dt = w cp (T steam in - T) + G (T neighbour - T) - UA (T - T ambient), with the steam in from the IF97 enthalpy:
     PCV-AS1010 throttles the main steam at constant enthalpy, the spray TCV-CD1124 (MV of TICAS1001) mixes condensate into it
     (TT-AS1001, IO list S2 AI0641 "main steam desuperheater downstream"); the header TT-AS1003 (S2 AI0642) mixes that steam with
     the cold reheat through PCV-AS1020-1 / -2; TT-AS1017 (S2 AI0902 "gland steam turbine side") is fed by PV-GS1031 from the
     header and the gland desuperheater spray (MV of TICAS1017). Spray capacities, metal heat capacities and losses: NO-SOURCE
     (not in the docs). Two numbers are set by 29.PNG at 150 MW (not a fit of a curve, the one unknown of each balance):
     UA3 gives TT-AS1003 236 C with the header steam of that load; with PV-GS1031 shut (self-sealing) the TT-AS1017 pipe sits
     between the gland header (TEGS1002 364 C) and the room, 185 C = G17 about UA17 */
  sprA: 1000 /* kg/h TCV-CD1124 full open, NO-SOURCE */,
  sprG: 300 /* kg/h gland desuperheater spray full open, NO-SOURCE */,
  cps: 2.2 /* kJ/kg K steam */,
  Mc1: 300 /* kJ/K, NO-SOURCE */,
  UA1: 0.05 /* kW/K, NO-SOURCE */,
  Mc3: 2000 /* kJ/K, NO-SOURCE */,
  UA3: 0.131 /* kW/K, 29.PNG: the SJAE steam 397 kg/h of cold reheat at 347 C after PCV-AS1020 holds 236 C (the other header users are not modelled yet) */,
  Mc17: 300 /* kJ/K, NO-SOURCE */,
  UA17: 0.05 /* kW/K, NO-SOURCE */,
  G17: 0.0433 /* kW/K, 29.PNG (see above) */,
  k: { sh: null }
};
/* steam through a control valve, kg/h (ISA-75.01, see AN_AS): P kg/cm2 G, T C */
function anStmW(Cv, P1, P2, T1) {
  if (!(Cv > 0) || !(P1 > P2)) return 0;
  const p1 = (P1 + 1.0332) * 0.980665,
    p2 = Math.max(0, (P2 + 1.0332) * 0.980665),
    xc = (1.3 / 1.4) * 0.7,
    x = Math.min(xc, (p1 - p2) / p1),
    Y = 1 - x / (3 * xc);
  return 27.3 * Cv * Y * Math.sqrt(x * p1 * steamRho(P1, T1));
}
/* air through an orifice (isentropic nozzle), kg/s from the side at P1 to the side at P2 (Pa abs); negative = the other way */
function anAirOr(CdA, P1, P2, T) {
  if (!(CdA > 0) || P1 === P2) return 0;
  const s = P1 > P2 ? 1 : -1,
    Pu = Math.max(P1, P2),
    r = Math.max(Math.min(P1, P2) / Pu, 0.5283),
    g = 1.4;
  return (
    s *
    CdA *
    Pu *
    Math.sqrt(((2 * g) / ((g - 1) * 287 * (T + 273.15))) * (Math.pow(r, 2 / g) - Math.pow(r, (g + 1) / g)))
  );
}
function anAsTab(L, x) {
  if (!(x > L[0][0])) return L[0][1];
  for (let i = 1; i < L.length; i++)
    if (x <= L[i][0]) return L[i - 1][1] + ((L[i][1] - L[i - 1][1]) * (x - L[i - 1][0])) / (L[i][0] - L[i - 1][0]);
  return L[L.length - 1][1];
}
/* the output of the A / M station of a controller (sheet links kept out of the unit state: no functions or sheets on U) */
function anAsCtl(sheet, tag) {
  const K = AN_AS.k;
  if (K.sh !== AN.sheets) {
    K.sh = AN.sheets;
    K.c = {};
  }
  if (!(tag in K.c)) {
    const x = AN.sheets.find(y => y.name === sheet),
      c = x && x.S && AN.hmiCtrls ? (AN.hmiCtrls(x.S) || []).find(q => q.tag === tag) : null;
    K.c[tag] = c && c.out != null ? { S: x.S, n: c.out } : null;
  }
  const o = K.c[tag];
  return o ? +o.S.rt.v[o.n] : NaN;
}
/* the AI blocks of one address on one sheet (as anUnitStart's ais) */
function anAsAIs(k, a) {
  const x = AN.sheets.find(y => y.name === k);
  let st = null;
  try {
    st = x && x.S ? shStn(x) : null;
  } catch (e) {}
  return anUnitAnchor(st != null ? anUnitAIs(st + '|' + a) : []);
}
function anAuxStep(U, dt) {
  /* 3.2.3-beta.223 (live Cold start): a save point made before beta.222 has no transmitter lists of this model and its U.own does
     not hold them, so the loop model kept writing PT-AS1004 / 1005 (PICAS1004 PV frozen at 9.57 while the header drained): the lists
     are made here once and owned */
  if (!U.asAI || !U.gsAI) {
    U.asAI = [anAsAIs('ABC-030', 'AI0514'), anAsAIs('ABC-030', 'AI0515')].filter(l => l.length);
    U.gsAI = anAsAIs('ABC-034', 'AI0886');
    if (U.own) for (const l of U.asAI.concat([U.gsAI])) for (const [S2, b] of l) U.own.add(S2.rt.st[b.id]);
  }
  const K = AN_AS,
    c = U.tc,
    pos = (d, dflt) => {
      const p = typeof anDitlPos === 'function' ? anDitlPos(d, 0) : null;
      return Math.max(0, Math.min(1, (p != null && isFinite(p) ? p : dflt) / 100));
    },
    cl = x => (isFinite(x) ? Math.max(0, Math.min(100, x)) / 100 : 0),
    onLoad = (U.tb && U.tb.rpm > 100) || (+U.MW || 0) > 0;
  /* the state of a save made before this model: from the transmitters */
  if (!isFinite(U.asP)) {
    const a = anUnitVal(U.asAI && U.asAI[0] ? U.asAI[0] : []);
    U.asP = isFinite(a) ? a : c && isFinite(c.Pa) ? c.Pa : 0;
  }
  const gsOn = c ? (c.gsOn != null ? !!c.gsOn : !!c.gland || !!c.fromLoad) : onLoad;
  if (c && c.gsOn == null) c.gsOn = gsOn;
  if (!isFinite(U.gsP)) U.gsP = gsOn ? K.gSv : 0;
  if (!isFinite(U.gsY)) U.gsY = gsOn && onLoad ? -42.6 * Math.max(0, Math.min(1, (+U.MW || 0) / 150)) : 0;
  const Tc = isFinite(U.cdTs) ? U.cdTs : isFinite(U.Tamb) ? U.Tamb : 30,
    Psc = Math.min(1.033, anPsat(Tc));
  if (!isFinite(U.cdAirP))
    U.cdAirP = Math.max(0, (1.033 - Psc) * (1 - (isFinite(U.vac) ? Math.max(0, Math.min(1, U.vac)) : 1)));
  /* sources and valve openings */
  const Pms = isFinite(U.Pms) ? U.Pms : 0,
    X = U.xt || {},
    mst = X.mst && X.mst.c && X.mst.c.q && X.mst.c.q.pv != null ? +X.mst.S.rt.v[X.mst.c.q.pv] : NaN,
    Tms = isFinite(mst) ? mst : 538,
    Pcr = (isFinite(U.Prh) ? U.Prh : 0) * (36.6 / 35.1),
    tcr = anUnitVal(X.cr || []),
    Tcr = isFinite(tcr) ? tcr : 370,
    pdea = anUnitVal(X.dea || []),
    Pdea = isFinite(pdea) ? pdea : 0,
    o1004 = cl(anAsCtl('ABC-030', 'PICAS1004')),
    o1030 = cl(anAsCtl('ABC-056', 'PICCD1104')),
    tt = U.tt || {},
    o1020 = [cl(tt['ZT-AS1020-1']), cl(tt['ZT-AS1020-2'])],
    m1391 = pos('DITL-51', c ? (c.asv ? 100 : 0) : 100),
    m1395 = pos('DITL-54', 0),
    m1396 = pos('DITL-55', onLoad ? 100 : 0),
    mVb = pos('DITL-56', 0),
    cep = srcBit(['M.3350', 'M.3351']) ? 1 : 0,
    L = Math.max(0, Math.min(1, (+U.MW || 0) / 150)),
    Pcr0 = 34.4 * (36.6 / 35.1) + 1.033,
    Patm = 1.033;
  const n = Math.max(1, Math.ceil(dt / 0.1)),
    h = dt / n,
    F = {};
  for (let i = 0; i < n; i++) {
    const Pa = U.asP,
      Pg = U.gsP,
      fm = Math.max(0, Math.min(1, (Pa + 1.0332) / K.ej.Pm)),
      /* MV-AS1391 in series with PCV-AS1010: the MOV is a shut-off, its stroke opens the gate area (1 / Cv^2 in series, gate Cv
         1500 for a 6-inch gate, NO-SOURCE: it only matters near its closed seat) */
      cvA =
        m1391 > 0 && o1004 > 0 ? 1 / Math.sqrt(1 / Math.pow(K.cv1010 * o1004, 2) + 1 / Math.pow(1500 * m1391, 2)) : 0,
      w1010 = anStmW(cvA, Pms, Pa, Tms),
      w1020 = anStmW(K.cv1020[0] * o1020[0] + K.cv1020[1] * o1020[1], Pcr, Pa, Tcr),
      w1030 = anStmW(K.cv1030 * o1030, Pa, Pdea, K.Ta),
      wej = (K.ej.sjae * m1396 + K.ej.start * m1395) * fm,
      /* gland PI (split range at 0: + opens the feed valve, - opens the unloading valve) */
      e = K.gSv - Pg;
    if (gsOn) U.gsY = Math.max(-100, Math.min(100, U.gsY + (K.gKp * e * h) / K.gTi));
    else U.gsY = 0;
    const yP = gsOn ? Math.max(-100, Math.min(100, U.gsY + K.gKp * e)) : 0,
      oF = Math.max(0, yP) / 100,
      oU = Math.max(0, -yP) / 100,
      wGf = anStmW(K.cvGf * oF, Pa, Pg, K.Tg),
      Pga = Pg + 1.0332,
      Pc = anCdP(Tc, U.cdAirP),
      wSeal = Pga > Pc ? K.Kseal * Math.sqrt(Pga * Pga - Pc * Pc) : 0,
      Pcra = Pcr + 1.0332,
      wHp =
        onLoad && Pcra > Pga
          ? (K.Whp0 * Math.sqrt(Pcra * Pcra - Pga * Pga)) / Math.sqrt(Pcr0 * Pcr0 - 1.353 * 1.353)
          : 0,
      wGu = oU > 0 ? anStmW(K.cvGu * Math.pow(50, oU - 1), Pg, Math.max(Pc, 0.366 * L) - 1.0332, 364) : 0;
    /* header pressures: dm = V drho/dP dP (drho/dP of IF97 at the header state) */
    const dRa = Math.max(0.05, (steamRho(Pa + 0.05, K.Ta) - steamRho(Pa - 0.05, K.Ta)) / 0.1),
      dRg = Math.max(0.05, (steamRho(Pg + 0.05, K.Tg) - steamRho(Pg - 0.05, K.Tg)) / 0.1);
    U.asP = Math.max(-1, Pa + ((w1010 + w1020 - w1030 - wej - wGf) / 3600) * (h / (K.Va * dRa)));
    U.gsP = Math.max(Pc - 1.0332, Pg + ((wGf + wHp - wSeal - wGu) / 3600) * (h / (K.Vg * dRg)));
    /* condenser air */
    /* 3.2.4 (JENNIE): trainer fault cd.air "Condenser air in-leakage (grows)": a crack at a flange or an expansion joint under
       vacuum. The in-leakage orifice (25.5 kg/h design, ED 066 p6) opens: x2 every 10 min (NO-SOURCE trainer rate) up to x64
       (about 1,600 kg/h, NO-SOURCE). The ejectors take more air only at a higher condenser pressure (their curves), so the back
       pressure rises until the leak and the ejectors meet; the turbine logic acts on the vacuum. Clear = back to the design orifice */
    {
      const W = typeof window !== 'undefined' ? window.WORLD : null,
        on = !!(W && W.ft && W.ft.has('cd.air'));
      U.cdLk = on ? Math.min(64, (U.cdLk > 1 ? U.cdLk : 1) * Math.pow(2, h / 600)) : 1;
    }
    const PaP = Patm * 98066.5,
      PcP = Pc * 98066.5,
      Pin = Math.max(Pc, Pga) * 98066.5,
      ain =
        anAirOr(K.cdaLeak * (U.cdLk > 1 ? U.cdLk : 1), PaP, PcP, Tc) +
        (Pga < Patm ? anAirOr(K.cdaGl, PaP, Pin, Tc) : 0) +
        anAirOr(K.cdaVb * mVb, PaP, PcP, Tc),
      rhoA = (U.cdAirP * 98066.5) / (287 * (Tc + 273.15)),
      sS = anAsTab(K.sStart, Pc) * m1395 * fm,
      sJ = anAsTab(K.sSjae, Pc) * m1396 * fm * cep,
      aout = ((sS + sJ) * rhoA) / 3600;
    U.cdAirP = Math.max(0, U.cdAirP + ((ain - aout) * h * 287 * (Tc + 273.15)) / K.Vc / 98066.5);
    Object.assign(F, { w1010, w1020, w1030, wej, wGf, wSeal, wHp, wGu, ain: ain * 3600, aout: aout * 3600, oF, oU });
  }
  for (const k in F) F[k] = Math.round(F[k] * 1000) / 1000;
  U.asF = F;
  U.gsV31 = F.oF * 100;
  U.gsV34 = F.oU * 100;
  /* pipe and header steam temperatures (AN_AS sprA ...): one step of dt, the flows of the last substep */
  {
    /* the transmitters of these temperatures (made once; a save before beta.223 has none) and the start of a run or of an old
       save: the metal at the reading of its transmitter */
    if (!U.asTAI) {
      U.asTAI = [anAsAIs('ABC-033', 'AI0641'), anAsAIs('ABC-034', 'AI0902')];
      if (U.own) for (const l of U.asTAI) for (const [S2, b] of l) U.own.add(S2.rt.st[b.id]);
    }
    if (!isFinite(U.asT1)) U.asT1 = anUnitVal(U.asTAI[0]);
    if (!isFinite(U.asT17)) U.asT17 = anUnitVal(U.asTAI[1]);
    if (!isFinite(U.asT3)) U.asT3 = anUnitVal((U.xt && U.xt.aux) || []);
    const Ta0 = isFinite(U.Tamb) ? U.Tamb : 30,
      Tw = Math.max(Ta0, Tc) /* spray water: the condensate */,
      hw = 4.19 * Tw,
      Pa = U.asP,
      Pg = U.gsP,
      tsA = Pa > -0.9 ? steamTsat(Pa) : Ta0,
      tsG = Pg > -0.9 ? steamTsat(Pg) : Ta0,
      /* steam in -> temperature at the pipe pressure, not below its saturation (wet steam) */
      tOf = (P, hm, ts) => Math.max(ts, steamTph(P, hm)),
      metal = (k, Tin, w, Mc, UA, G, Tn) => {
        let T = isFinite(U[k]) ? U[k] : Ta0;
        const n = Math.max(1, Math.ceil(dt / 1));
        for (let i = 0; i < n; i++) {
          const q = (w / 3600) * K.cps * ((isFinite(Tin) ? Tin : T) - T) + G * (Tn - T) - UA * (T - Ta0);
          T += (q * (dt / n)) / Mc;
        }
        U[k] = T;
        return T;
      },
      wA = F.w1010 || 0,
      sA =
        cl(anAsCtl('ABC-033', 'TICAS1001')) *
        K.sprA *
        (wA > 0 ? 1 : 0) /* no steam = no spray (it would flood the pipe) */,
      h1 = steamH(Pms, Tms),
      T1in = wA > 0 ? tOf(Pa, (wA * h1 + sA * hw) / (wA + sA), tsA) : NaN,
      T1 = metal('asT1', T1in, wA + sA, K.Mc1, K.UA1, 0, Ta0),
      wR = F.w1020 || 0,
      hR = steamH(Pcr, Tcr),
      hA = wA > 0 ? steamH(Pa, T1in) : 0,
      T3in = wA + sA + wR > 0 ? tOf(Pa, ((wA + sA) * hA + wR * hR) / (wA + sA + wR), tsA) : NaN,
      T3 = metal('asT3', T3in, wA + sA + wR, K.Mc3, K.UA3, 0, Ta0),
      wG = F.wGf || 0,
      sG = cl(anAsCtl('ABC-034', 'TICAS1017')) * K.sprG * (wG > 0 ? 1 : 0),
      hG = steamH(Pa, Math.max(tsA, T3)),
      T17in = wG > 0 ? tOf(Pg, (wG * hG + sG * hw) / (wG + sG), tsG) : NaN,
      Tgs = isFinite(U.asTgs) ? U.asTgs : Ta0;
    metal('asT17', T17in, wG + sG, K.Mc17, K.UA17, K.G17, Tgs);
    U.asT1 = T1;
    U.asT3 = T3;
    anUnitWrite(U.asTAI[0], U.asT1);
    anUnitWrite(U.asTAI[1], U.asT17);
  }
  if (U.asAI) for (const l of U.asAI) anUnitWrite(l, U.asP);
  if (U.gsAI) anUnitWrite(U.gsAI, U.gsV31);
}
/* Phase 11 (NANA, 2026-11-27): moved to engine/fw.js (feedwater part of the plant model) */
const AN_LO = { UA: 95.8, Co: 1300 / (63.0 - 46), Qb: 1300, Wmax: 170, M: 25800, Ch: 730, Tamb: 30 } /* DESIGN-SRC: O&M L2 TG 2-3 */;
function anLubeCoolStep(U, dt) {
  const K = AN_LO,
    sp = Math.max(0, Math.min(1, (U.tb ? U.tb.rpm : 0) / 3600)),
    flow = (+U.loBrg || 0) > 1.05,
    mv = U.loMv ? Math.max(0, Math.min(100, anAv('TICLO1002', +U.loMv.S.rt.v[U.loMv.n] || 0))) : 53.1,
    acw = Math.max(0, Math.min(1, (+U.acQ || 0) / 1500)),
    W = (K.Wmax * mv * acw) / 100 /* T/H */,
    Cw = (W * 1000 * 4.18) / 3600,
    Tw = isFinite(U.acT2) ? U.acT2 : K.Tamb,
    Qb = flow ? K.Qb * sp : 0;
  let q = 0;
  const hx = Ti => {
    if (!flow || !(Cw > 0)) return 0;
    const cmin = Math.min(K.Co, Cw),
      cr = cmin / Math.max(K.Co, Cw),
      ntu = K.UA / cmin,
      e =
        Math.abs(1 - cr) > 1e-6
          ? (1 - Math.exp(-ntu * (1 - cr))) / (1 - cr * Math.exp(-ntu * (1 - cr)))
          : ntu / (1 + ntu);
    return Math.max(0, e * cmin * (Ti - Tw));
  };
  /* the first step after a starting state: at its steady value (bisection on the return temperature) */
  if (!isFinite(U.loTr)) {
    let a = Tw,
      b = 120;
    if (Qb > 0 && hx(b) > Qb)
      for (let i = 0; i < 40; i++) {
        const m = (a + b) / 2;
        if (hx(m) < Qb) a = m;
        else b = m;
      }
    U.loTr = Qb > 0 && Cw > 0 ? (a + b) / 2 : Math.max(Tw, K.Tamb);
    U.loCoolOut = NaN;
  }
  q = hx(U.loTr);
  /* the cooler node (see the notes above): a starting state or an older save point starts it at its steady value */
  if (!isFinite(U.loCoolOut)) U.loCoolOut = flow ? U.loTr - q / K.Co : U.loTr;
  if (flow) {
    const To = U.loCoolOut;
    U.loTr += ((Qb - K.Co * (U.loTr - To)) * dt) / K.M;
    /* exact for any step: the node goes to its steady outlet with the time constant Ch / Co (11 s) */
    U.loCoolOut = U.loTr - q / K.Co + (To - (U.loTr - q / K.Co)) * Math.exp((-K.Co * dt) / K.Ch);
  } else {
    U.loTr += ((K.Tamb - U.loTr) * Math.min(dt, 3600)) / 3600; /* no circulation: the tank goes to the room */
    U.loCoolOut = U.loTr;
  }
  U.loTr = Math.max(0, Math.min(99, U.loTr));
  U.loCwF = Math.round(W);
  U.loCwOut = Cw > 0 ? Tw + q / Cw : Tw;
  U.loQ = Math.round(q);
  for (const L of U.lo || []) anUnitWrite(L, U.loCoolOut);
}
/* 3.2.0 live test #54: MOTOR BEARING / WINDING TEMPERATURE AND VIBRATION of the seawater pumps P-1501A / B / C, the aux. cooling water
   pumps P-1108A / B and the ID fan (I/O list STN103: TT-SW1501-x3 / x4 / xU / xV / xW AI0720 ~ 0758, VT-SW1501-x1 / x2; TT-CW1108-x3 /
   x4 / xU / xV / xW AI0912 ~ 0932; TT-FG1056-1 ~ 4 / U / V / W AI0672 ~ 0678, VT-FG1056-1 ~ 4 AI0528 ~ 0531). PR-OPE-5002 2.19 / 2.21
   / 2.27 (TI SW1501A3 / A4, VI SW1501A1 / A2) and 22.13 ~ 22.15 ask the operator to read them. No curve of the motors in the repository:
     running      bearing to 55 C (NO-SOURCE) with a 30 min time constant, winding to 85 C (NO-SOURCE) with 15 min; vibration 1.8 mm/s (pumps)
                  / 2.2 mm/s (IDF) (NO-SOURCE; the alarm list and the SOP give limits only) at once;
     stopped      back to the ambient 30 C with twice the time constant, vibration 0.1 mm/s;
     each element +0 ~ 2.5 C / +0 ~ 0.3 mm/s of its own (NO-SOURCE) so that two elements are not one number.
   Limits (alarm list "Alarm List _20160912" TE / VT): SWP bearing H 95 / HH 100, winding H 145 / HH 155, vibration H 7.6 / HH 11.9;
   ACWP bearing H 95 / HH 100, winding H 155 / HH 165 (DITL-76 / 77 rows 13 ~ 17 "> 100" / "> 165 C", plantsw.js); IDF bearing H 90 /
   HH 95 (< 80 / 82 start permissive), winding H 140 / HH 145 (< 130), vibration H 8 / HH 11 mm/s (< 8). U.mt = { tag: value } */
const AN_MT = {
  m: [
    ['SWP-A', 'M.3353', 'SW1501-A', ['3', '4'], ['1', '2'], 1.8],
    ['SWP-B', 'M.3354', 'SW1501-B', ['3', '4'], ['1', '2'], 1.8],
    ['SWP-C', 'M.3355', 'SW1501-C', ['3', '4'], ['1', '2'], 1.8],
    ['ACWP-A', 'DITL-76', 'CW1108-A', ['3', '4'], [], 1.8],
    ['ACWP-B', 'DITL-77', 'CW1108-B', ['3', '4'], [], 1.8],
    ['IDF', 'IDF', 'FG1056-', ['1', '2', '3', '4'], ['1', '2', '3', '4'], 2.2],
    /* 3.2.1 (IRENE, SEULGI finding): PAF / SAF (DITL-26B / 27B rows 5 ~ 15) and the FA blowers A / B (DITL-28B and its #B, rows 1 ~ 14):
       motor and fan bearings 1 ~ 4, windings U / V / W, vibration 1 ~ 4; the same NO-SOURCE running values as the IDF (no snapshot or
       vendor value of these temperatures in the repository; the DITL comparators: bearing 90 / 95, winding 145 C, FA blower 110 / 120 /
       155 C) */
    ['PAF', 'DITL-26A', 'FA1053-', ['1', '2', '3', '4'], ['1', '2', '3', '4'], 2.2],
    ['SAF', 'DITL-27A', 'FA1054-', ['1', '2', '3', '4'], ['1', '2', '3', '4'], 2.2],
    ['FAB-A', 'DITL-28A', 'FA1055-A', ['1', '2', '3', '4'], ['1', '2', '3', '4'], 2.2],
    ['FAB-B', 'DITL-28A #B', 'FA1055-B', ['1', '2', '3', '4'], ['1', '2', '3', '4'], 2.2],
    /* 3.2.3-beta.178 (SOHEE): the BFWP P-1115A / B (DITL-23A and its #B; DITL-23B rows 9 ~ 23): pump bearings 1 / 2, motor bearings 3 / 4
       (forced oil, KSB LOS: the running value Tb stays NO-SOURCE; KSB "List of measuring points" PR73686-00D: pump bearing alarm
       >= 90 C, DITL-23B > 100 C), winding U / V / W from the closed cooling water (AN_MT.cw below), vibration x1 / x2 (NO-SOURCE 1.8 mm/s;
       TECO data sheet: below 2.5 mm/s 0-P at no load) */
    ['BFWP-A', 'DITL-23A', 'FW1115-A', ['1', '2', '3', '4'], ['11', '12', '21', '22', '31', '32', '41', '42'], 1.8],
    ['BFWP-B', 'DITL-23A #B', 'FW1115-B', ['1', '2', '3', '4'], ['11', '12', '21', '22', '31', '32', '41', '42'], 1.8],
    /* beta.530 (RARA): the condensate pumps P-1116A / B (DITL-61A and its #B; DITL-61B rows 12 ~ 14): the three windings only. The coupling
       (A1), the grease lubricated motor bearings (A3 / A4) and the vibration (VT-CD1116) have no running value in the documents: no row */
    ['CEP-A', 'DITL-61A', 'CD1116-A', [], [], 0],
    ['CEP-B', 'DITL-61A #B', 'CD1116-B', [], [], 0]
  ],
  Tb: 55,
  Tw: 85,
  tauB: 1800,
  tauW: 900,
  vib0: 0.1,
  /* 3.2.3 (SOHEE): the motors of the PAF / SAF / IDF from their TECO data (o&m-package-phase-1 L16 FANS "LMYP-1 Fan Instruction
     Manual" 6.5 motor data sheets; fan spec sheets 2 of 5 give the kW of each fan): SAF 1850 kW 4 P 192 A (AECK-S2, spec table p 319 of the manual, sleeve
     bearings VG32), PAF 3700 kW 4 P 373 A (AEZK-S2, FE14A701B1), IDF 3300 kW 6 P 350 A (AEZK-S2, FE14A702B1, 3A057H186-72068); all Ins.
     Class F, "Temp. Rise Limit (Res.) Stator 90 C at S.F. 1.15", cooling IC611 (fan cooled, built-in AIR cooler: the winding does not
     see the closed cooling water). The I/O list names the elements: 1 / 2 = fan non drive / drive end, 3 / 4 = motor drive / non drive
     end bearing, U / V / W = motor winding.
       winding        T = ambient + 90 x (I / (I rated x 1.15))^2: the rise limit at the S.F. current, with the square of the current
                      (the copper loss), as the PA compressor motor (AN_AIR.Tw); I = the fan motor current of boiler.js (U.fnPafI / fnSafI /
                      fnIdfI); time constant tauW (NO-SOURCE).
       motor bearing  TECO motor manual 4.2.8 (sleeve, self-lube): a rise of 11 ~ 14 C in the first 10 min and about 22 C at 30 min,
                      stable below 1 C per half hour: first order through 12.5 C at 10 min and 22 C at 30 min = rise 25.3 C, time constant
                      14.7 min (CALC).
       fan bearing    the fan manual gives only the limit (4.9 / 5.4.3: ambient + 40 C; vibration 6 mm/s): the running value Tb stays
                      NO-SOURCE. */
  mot: { PAF: [373, 'fnPafI'], SAF: [192, 'fnSafI'], IDF: [350, 'fnIdfI'], 'CEP-A': [35.2, 'cdI0', 80, 1], 'CEP-B': [35.2, 'cdI1', 80, 1] },
  sf: 1.15,
  rise: 90,
  /* beta.530 (RARA): CEP motor TECO AEJG-WT 325 kW 4 P 6600 V 35.2 A, IC411 fan cooled, Ins. Class F, "Temp. Rise Limit (Res.) Stator
     80 C at S.F. 1.0" (data sheet 3A057H186-74341 REV.05, KSB contract document K1AU3-D1-0-044 R0 p 24): the same form with its own rise and S.F. (the 3rd and 4th
     number of mot): T = ambient + 80 x (I / 35.2)^2, I = U.cdI0 / cdI1 */
  rB: 25.3,
  tauMB: 882,
  /* 3.2.3-beta.178 (SOHEE): MOTOR WINDING ON THE CLOSED COOLING WATER. The BFWP motor (TECO AEZW-S2, 3550 kW 2 P 6600 V, data sheet
     3A057H186-71069 REV.05 and outline 3A040S670 REV.06, document-references "Boiler Feed Water Pump MOTOR DATA SHEET.pdf"): cooling
     IC81W (totally enclosed, water-to-air cooler: the winding sees the cooling water, not the room), Ins. Class F, 355 A and eff. 96.2 %
     at 100 % load, "Temp. Rise Limit (Res.) Stator 80 C at S.F. 1.0"; heat exchanger water inlet 5 ~ 37 C, 430 ~ 470 L/min, 2.5 ~ 5
     kgf/cm2. The water is the ACW supply (unit.js AN_ACW U.acT2 = TT-CW1153; the BFP is one of its users).
       winding   T = water inlet + 80 x (I / 355)^2 (the rise limit at the rated current, with the square of the current: the copper loss)
                 + the extra warming of the water when its flow is below the design: loss x (1 / Cw(flow) - 1 / Cw(design)), where
                 loss = 3550 x (1 / 0.962 - 1) = 140.3 kW x (I / 355)^2 (CALC) and Cw(design) = 450 L/min (the middle of 430 ~ 470) x
                 0.991 kg/L x 4.18 / 60 = 31.07 kW/K (CALC: 4.5 C through the cooler at full load); the water flow of the motor =
                 450 L/min x ACW flow / 1500 m3/h (the same share rule as the turbine oil cooler, NO-SOURCE: the branch flow is not
                 measured), at least 2 % (a closed loop still moves a little by convection, NO-SOURCE) and at most 250 C;
                 I = the BFWP current of the model (U.fwI0 / fwI1); time constant tauW (NO-SOURCE).
     Chain: ACWP trip (no standby) -> no cooling water -> BFWP winding rises -> DITL-23B row 13 ~ 15 > 150 C (alarm / trip of DITL-23A).
     The CEP motor (TECO AEJG-WT 325 kW 4 P, KSB GA drawing F 30157 A) is a finned, fan cooled motor: not on the closed cooling water. */
  cw: { 'BFWP-A': [355, 'fwI0'], 'BFWP-B': [355, 'fwI1'] },
  cwRise: 80,
  cwLoss: 140.3,
  cwC: 31.07,
  cwMin: 0.02,
  cwMax: 250,
  /* 3.2.3-beta.179 (SOHEE): BFWP BEARINGS FROM THE LUBE OIL SYSTEM (KSB "30 LPM LUBE OIL SYSTEM", L7 BFP D-5 LOS O&M manual, SLPL
     SL/WO/2142: data sheet and "DATA SHEET LUBE OIL COOLER"): one LOS per pump feeds the pump bearings 1 / 2 and the motor bearings
     3 / 4 (TECO outline 3A040S670 note 9: forced oil, VG46, oil inlet 25 ~ 49 C). Oil 30 L/min ISO VG 46 (s.g. 0.87), cooler oil
     65 -> 50 C (supply 50 C), cooling water 37 -> 39 C ~98 L/min, 13.65 kW, shell and tube; KSB list of measuring points PR73686-01D:
     cooler inlet < 65 C, outlet < 50 C. The cooler water is the closed cooling water (the BFP is an ACW user, AN_ACW).
       heat      13.65 kW while the pump runs (the design duty, NO-SOURCE: no curve of the bearing loss);
       cooler    Coil = 13.65 / 15 = 0.910 kW/K, Cw = 13.65 / 2 = 6.825 kW/K x ACW flow / 1500 (at least 2 %, as cw above), UA = 13.65
                 / LMTD (65 - 39 = 26, 50 - 37 = 13: 18.76 C) = 0.7277 kW/K (all CALC); effectiveness-NTU, counter flow;
       oil       return (cooler inlet) = water inlet + 13.65 / (eff x Cmin), supply = return - 13.65 / Coil: at the design water 37 C this
                 gives 65 / 50 C (the data sheet);
       bearings  the RTD = the oil leaving the bearing = the return (NO-SOURCE: the metal above the drain oil is not in the docs), +0.5 C
                 per element so that two elements are not one number; time constant tauB (the reservoir, NO-SOURCE);
       stopped   no heat: the oil goes to the water (ACW flowing) or to the room. */
  los: { 'BFWP-A': 1, 'BFWP-B': 1 },
  losQ: 13.65,
  losCo: 0.91,
  losCw: 6.825,
  losUA: 0.7277,
  losMax: 150
};
/* the oil leaving the bearings of a running pump on its LOS (AN_MT.los); water inlet Tc, ACW flow share fq */
function anLosRet(Tc, fq) {
  const K = AN_MT,
    co = K.losCo,
    cw = K.losCw * fq,
    cmin = Math.min(co, cw),
    cr = cmin / Math.max(co, cw),
    ntu = K.losUA / cmin,
    e = cr < 0.999 ? (1 - Math.exp(-ntu * (1 - cr))) / (1 - cr * Math.exp(-ntu * (1 - cr))) : ntu / (1 + ntu);
  return Math.min(K.losMax, Tc + K.losQ / (e * cmin));
}
function anMotorStep(U, dt) {
  const K = AN_MT,
    T0 = isFinite(U.Tamb) ? U.Tamb : 30,
    mt = U.mt || (U.mt = {}),
    lag = (k, x, tau) => (mt[k] = isFinite(mt[k]) ? mt[k] + ((x - mt[k]) * Math.min(dt, tau)) / tau : x);
  for (const [id, ad, base, brg, vib, v1] of K.m) {
    const run =
        ad === 'IDF'
          ? !U.idf || +U.idf.S.rt.v[U.idf.n] > 0.5
          : /^DITL/.test(ad)
            ? anDitlRun(ad) === 1
            : srcBit([ad]) > 0.5,
      mo = K.mot[id],
      I = mo ? +U[mo[1]] : NaN,
      cw = K.cw[id],
      Ic = cw ? Math.max(0, +U[cw[1]] || 0) : 0,
      Tc = isFinite(U.acT2) ? U.acT2 : T0,
      fq = Math.max(K.cwMin, Math.min(1.2, (+U.acQ || 0) / 1500)),
      x2 = cw ? Math.pow(Ic / cw[0], 2) : 0,
      wT = cw
        ? Math.min(K.cwMax, Tc + K.cwRise * x2 + K.cwLoss * x2 * (1 / (K.cwC * fq) - 1 / K.cwC))
        : mo && isFinite(I)
          ? T0 + (mo[2] || K.rise) * Math.pow(Math.max(0, I) / (mo[0] * (mo[3] || K.sf)), 2)
          : K.Tw;
    brg.forEach((e, i) =>
      K.los[id]
        ? lag('TT-' + base + e, (run ? anLosRet(Tc, fq) : (+U.acQ || 0) > 0 ? Tc : T0) + 0.5 * i, K.tauB)
        : mo && i >= 2
          ? lag('TT-' + base + e, run ? T0 + K.rB + 1.2 * (i - 2) : T0, run ? K.tauMB : 2 * K.tauMB)
          : lag('TT-' + base + e, run ? K.Tb + 1.2 * i : T0, run ? K.tauB : 2 * K.tauB)
    );
    ['U', 'V', 'W'].forEach((e, i) =>
      lag('TT-' + base + e, run ? wT + 1.0 * i : cw ? Tc : T0, run ? K.tauW : 2 * K.tauW)
    ); /* a stopped IC81W motor goes to its water */
    vib.forEach((e, i) => (mt['VT-' + base + e] = run ? v1 + 0.1 * i : K.vib0));
  }
}
/* 3.2.1 (IRENE: INSTRUMENT AND PLANT AIR plant model from the vendor data; docs/versions/v3.2.1/AIR_PLANT_MODEL.md; replaces the
   3.2.0-beta.68 fixed rates). The compressed air systems of flow diagram K1AU3-PD-023 Rev C sheet 1/6 (plant air) and 2/6 (instrument
   air): compressors C-0703A / B / C (PA) or C-0704A / B / C (IA) -> dryers D-0703A ~ C / D-0704A ~ C (DITL-45 and its machine instances
   #B / #C) -> air tanks T-0705A / B or T-0706A / B -> unit 1 (PT-PA1705 / PT-IA1706), unit 2 and the utility area.
   Sources:
     compressors  K1AU3-D1-0-059 (IHI): turbo compressors with the constant pressure control loop (PIC, inlet guide vane), the anti-surge
                  loop (blow-off valve) and the motor overload loop (flow sheets HT225374 PA "TRE60-600kW TURBO COMPRESSOR", HT225405 IA
                  "T2A TYPE TURBO COMP."); discharge transmitter PT-1DA 0 ~ 1.5 MPa;
     PA motor     TECO 3A057H186-74409: 900 HP, 2 pole, 6600 V, 69.9 A at 100 % load, LRC 560 A, soft start; winding RTD alarm 145 /
                  trip 155 C, temperature rise limit 80 C (class F);
     IA motor     TECO-YASKAWA FELA-8T 190 kW CONT 460 V 2 P (outline P1309238 RATINGS; the thermal sheet says 165 kW): 286 A at 190 kW; starting current with a reactor 80 % tap
                  532 % (the torque / current curve);
     tanks        D1-0-059 document index and PD-023: T-0705A / B 10 m3 (PA), T-0706A / B 5 m3 (IA), max. working pressure 0.98 MPa;
     pressure     PR-OPE-5002 "Ensure Plant Air Compressor is running and compressed air pressure is up to 7 Kg/cm2"; 39.PNG 7.0;
     alarm list   tanks and unit header L 5.0, IA LL 3.5, PSL-IA1706 / PSL-PA1705 2.8 kg/cm2;
     I/O list     ranges 0 ~ 10 kg/cm2, dryer outlet flow 0 ~ 2700 (IA) / 0 ~ 5800 (PA) m3/h, compressor current 0 ~ 500 (IA) / 0 ~ 140
                  (PA) A (the transmitter holds its range top).
   How it works (per system):
     compressor   runs when the logic gives its START COMMAND (DITL-113 / 114 output rows 56 / 63 / 70 = M.0300 / M.0310 AND NOT
                  RUNNING AND NOT TRIP, 5 s pulse; the local panel starts it when it is in REMOTE) or when the field operator starts it at
                  the local panel; it stops on its TRIP contact (rows 7 / 14 / 21, a field trip of the test tool). The model owns the RUNNING
                  contact (rows 6 / 13 / 20, I.0015 / I.0095 / I.0335 IA, I.0010 / I.0090 / I.0330 PA): the logic reads it (DITL-42
                  "COMPRESSOR STOPPED", the auto start). The state of the scenario (Start at 150 MW, Cold) is taken at its first step;
     tanks        one header: dP/dt = (Q in - Q use) x 1.033 / V / 3600 (isothermal, free air m3/h, V of both tanks); the PIC holds 7.0:
                  at 7.0 the compressors give only the use, below it each gives its capacity;
     use          the consumption at 7.0 (NO-SOURCE: IA 1200, PA 1500 m3/h, as 3.2.0-beta.68) through fixed openings: proportional to the
                  absolute pressure;
     capacity     Mass Balance Diagram K1AU3-MB-023 (A2-0-001 Rev A) sheets 1/2 and 2/2, items 2 / 4 / 6: PA 5100 Nm3/h, IA 1500 Nm3/h
                  per compressor (the MB operating point has 2 running: 10200 / 3000; the SOP and the snapshot have 1); IA power at full
                  flow 176 kW = 1500 m3/h at the PA ratio 600 kW / 85 m3/min (NO-SOURCE ratio, the IA compressor power is not in the docs);
     power        proportional to the compressor flow, not below the surge flow (the anti-surge loop blows off the rest): 70 % of the
                  capacity (NO-SOURCE); 100 % = PA 600 kW (TRE60-600kW), IA 176 kW (above);
     current      the motor current at 100 % times kW / kW 100 % (PA 69.9 A at 671 kW = 900 HP; IA 286 A at 190 kW); start: PA soft start
                  3 x 69.9 A for 10 s (NO-SOURCE: the current limit of the soft starter), IA 532 % x 286 A for 3 s (NO-SOURCE: the time);
     winding T    PA motor (TE-M0703-x1, I/O list): 30 C + 80 C x (I / 69.9)^2 (the rise limit of the spec at full load), 10 min;
     unit header  the tank pressure less 0.2 kg/cm2 at the design use (NO-SOURCE), with the use squared;
     dryer outlet the tank pressure plus 0.15 kg/cm2 at the design use (NO-SOURCE), with the flow squared; flow over the dryers in
                  service, over the three while none is (their inlet valves stay open). */
const AN_AIR = {
  P: 7.0,
  Pa: 1.033,
  loss: 0.2,
  dD: 0.15,
  fs: 0.7,
  fU: 0.5 /* NO-SOURCE: the share of unit 1 in the use (unit 1, unit 2, utility area; no consumption list in the docs) */,
  Kx: 1500 /* free air m3/h at 1 kg/cm2 difference, V-PA0013 6" fully open (NO-SOURCE) */,
  sys: {
    ia: {
      c: 'DITL-113',
      d: '@14',
      iso: 'V-IA1101',
      V: 10,
      Qc: 1500,
      Qd: 1200,
      kW: 176,
      I100: 286,
      kW100: 190,
      Ist: 286 * 5.32,
      tSt: 3,
      Imax: 500
    },
    pa: {
      c: 'DITL-114',
      d: '@3',
      iso: 'V-PA1087',
      V: 20,
      Qc: 5100,
      Qd: 1500,
      kW: 600,
      I100: 69.9,
      kW100: 671,
      Ist: 3 * 69.9,
      tSt: 10,
      Imax: 140
    }
  },
  rows: [5, 12, 19],
  dry: ['DITL-45', 'DITL-45 #B', 'DITL-45 #C'],
  Tw: [30, 80, 600],
  tauI: 1
};
/* 3.2.1 (IRENE): the pneumatic valves on the instrument air of unit 1 (U.iaPU = PT-IA1706). Source: FHI control valve package
   K1AU3-E2-0-123 R1 "Drawing of Control valve" (as built, on the user's PC: instrument-engineer-data-asbuilt), one specification
   sheet per valve (Actuator: Action, Air Pressure Available / Required, Spring Precompression, Pressure @ Full Valve Travel;
   Accessories: Airlock, Solenoid Valve):
     modulating valves with an airlock (RK 2-8 kg/cm2G; the Siemens sheets of LCV-MU1110, FCV-CD1120, LCV-HD1101 ~ 1103 add "Air fail
     fixed at 3.5 kg/cm2g"), a lock-up valve (TCV-FW1110-1 / -2: SMC IL-201) or a double acting piston "Fail in Place"
     (LCV-CD1104, FCV-FW1130-1) STAY WHERE THEY ARE below the lock pressure: the command of the DCS still moves (the PID winds up),
     the valve does not. The lock pressure 3.5 kg/cm2g is the one printed on the Siemens sheets; the Copes sheets give the
     airlock RK 2-8 (the adjustable range) without the set point, and the SMC IL-201 sheet none: 3.5 is used for them too (NO-SOURCE
     set point, same airlock model).
     on / off valves (XV, a solenoid that vents the actuator, no airlock) go to their SPRING position as the air goes: "Spring
     Opening (Direct)" = open without air, "Spring Closing (Reverse)" = closed without air. The actuator gets the header through
     the filter regulator SMC AW40 set to 3.5 kg/cm2g ("Air Pressure Available"): its travel away from the spring position is
     (pressure - spring precompression) / (pressure at full travel - precompression), the two pressures of each sheet (bar g).
     The DITL netlist agrees with every sheet: the coil is inverted (energised = closed) exactly on the spring opening valves.
     XV-FW1111-1 / XV-FW1121-1 have an airlock (SMC VSA 3-way): they stay in place (3.5, NO-SOURCE set point).
   Not in the package (no sheet: they keep following their command): PCV-MS1020 / PCV-HR1010 bypass, TCV-FW1060 / FW1150,
   PCV-AS1010, TCV-CD1115 / 1124 / 1126, XV-FW1151, XV-HR1010-1, XV-CR1013, the flue gas biasing dampers TCV-FG1116 / 1117 (their
   O&M manual, L16 FANS / L14-7 Promax, covers the Festo DAPS double acting R and spring return RS both and names neither for them). */
/* Phase 11 (NANA, 2026-11-27): moved to engine/fw.js (feedwater part of the plant model) */
/* 3.2.4-beta.7 (JENNIE, priority list item: tube leak): a trainer fault 'tl.ww' (furnace water wall tube leak) or 'tl.eco' (economizer
   tube leak), world.js WORLD.ftrip. FHI manual (plant-study 03, T9 p29): a tube leak is heard or shows as rising make-up; it erodes the
   tubes next to it and its water plugs the hoppers and the air heater. The DCS has no leak detector (no tag in the IO list); the
   operator sees it as feedwater (FT-FW1007) above main steam (FT-MS1031) plus blowdown, the drum level and make-up, the furnace draft.
   The hole: one opening of 10 mm (NO-SOURCE, a trainer setting: a small leak, about 11 T/H at 150 MW, that the plant can run with).
   Flow: the drum water through a sharp hole to the furnace, liquid to its saturation pressure, then the choked flashing flow (plant.js
   anFlashG, the IF97 HEM table of the blowdowns). Water wall: the drum pressure and water. Economizer: the feedwater at the economizer
   inlet (HP heater outlet U.hpT2) at the drum pressure plus the economizer drop 3.5 kg/cm2 at MCR (FHI T3) with the square of the flow.
   Where it goes: the drum loses the water (plant.js drum balance; an economizer leak is lost before the drum, after FT-FW1007); the
   water wall leak boils in the bed (the bed balance takes it from saturated water to steam at the bed temperature, IF97) and the steam
   joins the flue gas (U.mG, the ID fan sees it as gas volume, 28.9 / 18 per kg against air). The economizer leak flashes in the
   backpass and cools the gas ahead of the No.1 economizer (hx.js, I.mL). U.tlW / U.tlE T/H */
const AN_TL = { d: 0.01 /* m, NO-SOURCE */, dpE: 3.5 /* kg/cm2 at MCR, FHI T3 */, mcr: 460, t2: 600 /* s, NO-SOURCE */, tw: 0.006 /* m, NO-SOURCE */, odW: 0.0635, odE: 0.0572 };
/* 3.2.4-beta.16 (JENNIE, tube leak grows): FHI T9 p29 (plant-study 03): the leak erodes the tubes next to it. The jet of steam and water
   cuts the next tube, which leaks too, so the open area grows with itself: the area of the hole doubles each t2 = 10 min of plant time
   (NO-SOURCE, a trainer setting: headless 150 MW, the leak 11 T/H, 22 after 10 min, 44 after 20 min, 78 at 28 min when the feedwater, 627 T/H against a transmitter span of 550, overfills the drum to +270 mm and the logic trips the boiler).
   It stops at a rupture: one tube cut through, both ends open. Tubes: water wall 63.5 mm OD (FHI P2S5 p2-5-2, plant-study 03 C-4 / C-9 /
   C-12), economizer 57.2 mm OD (Eco 2, E-7 / E-10); wall thickness 6 mm (NO-SOURCE): water wall bore 51.5 mm, 2 ends = 53 x the 10 mm
   hole. At a rupture the feedwater cannot keep up, the drum level falls and the logic trips the boiler. Clearing the fault (the tube
   repaired) puts the hole back to 10 mm. U.tlAw / U.tlAe = the open area / the 10 mm hole */
/* 3.2.4-beta.13 (JENNIE, priority list item: coal quality): the trainer fault 'cf.wet' (world.js): wet coal. Performance coal, FHI P2S7
   Tab 2 / Tab 3: H 2.75 %, water 33.96 %, HHV 4,008 / LHV 3,662 kcal/kg. The two heating values differ by the heat of the water that leaves
   as vapour, 9 H + water = 0.5871 kg per kg of coal: 346 / 0.5871 = 589.3 kcal per kg of water (CALC from Tab 2, the textbook latent
   heat 2,442 kJ/kg = 583 is the check). With the moisture m the dry share of each kg is r = (1 - m) / (1 - 0.3396): HHV r x 4,008, water
   9 H r + m, LHV = HHV - 589.3 x water. At 40 % (NO-SOURCE, a trainer setting: at 42 % the 150 MW coal is 100 T/H, the feeder MV high limit 83.3 % of ABC-004A, and the logic puts the masters to MANUAL): r 0.909, LHV 3,274 kcal/kg (89 % of the design). The
   combustibles, ash and sulphur of each kg go with r: the stoichiometric air (AN_GAS.afs), the ash of the fuel gas, the Ca / S ratio.
   coalR is r, coalK is LHV / 3,662 (anCoalWet) */
/* beta.304 (JENNIE, user 2026-11-22 "sa totoong planta, hnd static mga values kht na attain mo ang target mw"): the coal is not the same
   from one load of the feeder to the next. Plant DCS trend scenario 1 (team-files/plant-study/14-plant-trends, 60 s values, 150 MW held
   0 ~ 6 h, CCS in AUTO): coal flow 89.80 sd 0.45 T/H (zero crossings every 4 ~ 6 min), MSP 120.80 sd 0.75 kg/cm2 (every 19 min),
   MW 149.85 sd 0.43, MSF sd 1.9 T/H; the same at the 90 MW hold. The model kept them flat (gate run: MW moved 0.02 in 20 min).
   The two causes in the coal stream, each a sequence of coal lots per feeder (A / B / C = ABC-004A / B / C):
   - belt load: the feed rate of the gravimetric feeder is belt load x belt speed (Yamato GM-BSC22-36, CFC-201, Final Drawing P4 / P8).
     A lot of coal with another bulk density (lump size, fines) loads the belt more or less; the load cells see it at once
     (AI0480 / 0512 / 0544 = the coal that really falls) and the feeder speed loop trims the speed back to the demand in about clTs.
     Lots of clLd t, belt load spread clSd (share). The bunker draw-down mixes the coal, so a lot follows the last over the belt
     transit clTb.
   - moisture: the coal comes from the stockpile in layers that were rained on or dried; the reclaimer run of one layer fills the three
     bunkers together, so one layer of clLm t goes to all three feeders (the feed of the three counts it down); moisture spread clSm
     (absolute share) around the performance coal 33.96 % (FHI P2S7 Tab 2). The heating value and the dry share
     follow anCoalWet (below). The fuel line gives the change to the bed at the burnt coal, the CCS answers through the pressure.
   The lots come from a fixed sequence (a linear congruential generator, state U.clS saved with the plant), so a run is the same on
   every PC and SAVE / LOAD gives the same plant; a lot only moves on while coal is fed (a stopped feeder keeps its lot).
   The spreads are set from the plant trend above, which measures them: clSd so the coal flow (the load cells) moves sd 0.45 T/H (headless
   120 min at 150 MW: 0.52), clSm small enough that the coal stays there (0.025 gave coal sd 2.0 and bed sd 5.9 against 1.4 ~ 3). The lot
   sizes and the speed loop time are NO-SOURCE (the feeder manual gives the accuracy +/- 0.5 % of the totalized coal, not the speed loop) */
const AN_CLOT = { clLd: 1.25, clSd: 0.021, clTb: 20, clTs: 60, clLm: 30, clSm: 0.006, clTm: 300 };
function anClRnd(U) {
  /* two normal deviates (Box-Muller) from the generator; U.clS is an integer below 2^31 */
  const nx = () => ((U.clS = (Math.imul(U.clS, 1103515245) + 12345) & 0x7fffffff), (U.clS + 0.5) / 2147483648);
  const a = nx(),
    b = nx();
  return Math.sqrt(-2 * Math.log(a)) * Math.cos(2 * Math.PI * b);
}
function anCoalLots(U, dt) {
  const K = AN_CLOT;
  if (!(U.clS > 0) || !Array.isArray(U.clD) || U.clD.length !== 3 || !isFinite(U.clM)) {
    U.clS = 20221122;
    U.clD = [0, 0, 0] /* belt load of the lot on the belt, share */;
    U.clDt = [0, 0, 0] /* belt load of the lot coming down from the bunker */;
    U.clLd = [0, 0, 0] /* t left of that lot */;
    U.clC = [0, 0, 0] /* the speed trim of the feeder loop */;
    U.clM = 0 /* moisture of the layer, share above the performance coal */;
    U.clMf = 0 /* the same mixed in the three bunkers and on the belts (first order, clTm: the bunker draw-down mixes the layers) */;
    U.clLm = 0 /* t left of that layer */;
  }
  const f = (U.fuel || []).map(l => Math.max(0, anUnitVal(l) || 0)),
    t = dt > 0 ? dt : 0;
  for (let i = 0; i < 3; i++) {
    const q = ((f[i] || 0) * t) / 3600 /* t of coal fed in this step */;
    if (!(q > 0)) continue;
    U.clLd[i] -= q;
    if (U.clLd[i] <= 0) {
      U.clLd[i] += K.clLd;
      U.clDt[i] = K.clSd * anClRnd(U);
    }
    U.clD[i] += ((U.clDt[i] - U.clD[i]) * Math.min(t, K.clTb)) / K.clTb;
    U.clC[i] += ((U.clD[i] - U.clC[i]) * Math.min(t, K.clTs)) / K.clTs;
  }
  /* the feed rate over the demand of each feeder, read by plant.js anFeederStep */
  U.clF = U.clD.map((d, i) => Math.max(0, 1 + d - U.clC[i]));
  /* the moisture layer: counted down by the coal of the three feeders */
  const qa = (f.reduce((a, b) => a + b, 0) * t) / 3600;
  if (qa > 0) {
    U.clLm -= qa;
    if (U.clLm <= 0) {
      U.clLm += K.clLm;
      U.clM = K.clSm * anClRnd(U);
    }
    U.clMf += ((U.clM - U.clMf) * Math.min(t, K.clTm)) / K.clTm;
  }
  U.clMm = U.clMf;
}
const AN_COAL = { m0: 0.3396, mW: 0.4, h: 0.0275, hhv: 4008, lhv: 3662, lat: 346 / (9 * 0.0275 + 0.3396) };
function anCoalWet(U) {
  const W = typeof window !== 'undefined' ? window.WORLD : null,
    K = AN_COAL,
    m = (W && W.ft && W.ft.has('cf.wet') ? K.mW : K.m0) + (isFinite(U.clMm) ? U.clMm : 0) /* beta.296: the layer of the coal lots */,
    r = (1 - m) / (1 - K.m0);
  U.coalR = r;
  U.coalK = (K.hhv * r - K.lat * (9 * K.h * r + m)) / K.lhv;
}
function anTubeLeak(U, dt) {
  const W = typeof window !== 'undefined' ? window.WORLD : null,
    on = k => !!(W && W.ft && W.ft.has(k)),
    K = AN_TL,
    cap = od => (2 * Math.pow(od - 2 * K.tw, 2)) / (K.d * K.d),
    grow = (k, f, od) => (U[k] = f ? Math.min(cap(od), (U[k] > 1 ? U[k] : 1) * Math.pow(2, (dt > 0 ? dt : 0) / K.t2)) : 1);
  grow('tlAw', on('tl.ww'), K.odW);
  grow('tlAe', on('tl.eco'), K.odE);
  const A = (Math.PI * K.d * K.d) / 4,
    G = (P, T) => (typeof anFlashG === 'function' ? anFlashG(P, T, 0) : 0);
  U.tlW = on('tl.ww') && U.Pd > 0 ? (G(U.Pd, U.Tw) * A * U.tlAw * 3600) / 1000 : 0;
  const fw = typeof AN_CYC !== 'undefined' && isFinite(AN_CYC.ffw) ? AN_CYC.ffw : 0,
    Te = isFinite(U.hpT2) ? U.hpT2 : U.Tw;
  U.tlE = on('tl.eco') && U.Pd > 0 && fw > 0 ? (G(U.Pd + AN_TL.dpE * Math.pow(fw / AN_TL.mcr, 2), Te) * A * U.tlAe * 3600) / 1000 : 0;
  U.tlE = Math.min(U.tlE, fw);
}
/* the output (MV) net of a controller of an ABC sheet, as ctlOut of anUnitStart */
function anCtlOutOf(k, t) {
  const x = AN.sheets.find(y => y.name === k),
    c = x && x.S && AN.hmiCtrls ? (AN.hmiCtrls(x.S) || []).find(q => q.tag === t) : null;
  return c && c.out != null ? { S: x.S, n: c.out, c, t } : null;
}
/* Phase 11 (NANA, 2026-11-27): moved to engine/fw.js (feedwater part of the plant model) */
const AN_AV = {
  lock: 3.5,
  reg: 3.5,
  bar: 0.980665 /* bar per kg/cm2 */,
  /* controller (its MV is the valve command) -> the valve and its sheet (item of the package index) */
  hold: {
    LICCD1110A: 'LCV-MU1110 (item 17, airlock RK 2-8, fail fixed 3.5)',
    FICCD1120: 'FCV-CD1120 (item 18, airlock RK 2-8, fail fixed 3.5)',
    LICCD1104: 'LCV-CD1104 (item 14, double acting, fail in place, airlock RK 2-8 x2)',
    LICCD1110B: 'LCV-CD1110 (item 15, airlock RK 2-8)',
    FICCD1121: 'FCV-CD1121 (item 11, airlock RK 2-8)',
    PICCD1104: 'PCV-AS1030 (item 8, airlock RK 2-8)',
    PICAS1005: 'PCV-AS1020-1 / -2 (items 6 / 7, airlock RK 2-8)',
    PICMS1002: 'PCV-MS1001 (item 1, fail fixed, airlock Fisher 167DA, air fail fixed at 3.5)',
    PICSB1052: 'PCV-SB1053 (item 9, airlock RK 2-8)',
    TICBR1130: 'TCV-FW1110-1 / -2 (items 19 / 20, lock-up valve SMC IL-201)',
    TICBR1150: 'TCV-FW1120-1 / -2 (items 23 / 24, airlock RK 2-8)',
    FICFW1007: 'FCV-FW1130-1 (item 27, double acting, fail in place, airlock RK 2-8 x2)',
    LICBR1001B: 'FCV-FW1130-2 (item 28, airlock RK 2-8)',
    LICHD11011: 'LCV-HD1101-1 (item 29, airlock RK 2-8, fail fixed 3.5)',
    LICHD11012: 'LCV-HD1101-2 (item 30, airlock RK 2-8, fail fixed 3.5)',
    LICHD11021: 'LCV-HD1102-1 (item 31, airlock RK 2-8, fail fixed 3.5)',
    LICHD11022: 'LCV-HD1102-2 (item 32, airlock RK 2-8, fail fixed 3.5)',
    LICHD11031: 'LCV-HD1103-1 (item 33, airlock RK 2-8, fail fixed 3.5)',
    LICHD11032: 'LCV-HD1103-2 (item 34, airlock RK 2-8, fail fixed 3.5)',
    LICHD11051: 'LCV-HD1105-1 (item 35, airlock RK 2-8)',
    LICHD11052: 'LCV-HD1105-2 (item 36, airlock RK 2-8)',
    LICHD11061: 'LCV-HD1106-1 (item 37, airlock RK 2-8)',
    LICHD11062: 'LCV-HD1106-2 (item 38, airlock RK 2-8)',
    TICLO1002: 'TCV-CW1201 (item 40, airlock RK 2-8)',
    PICDO0005: 'PCV-DO0002 (item 41, airlock RK 2-8)',
    PICDO1008: 'PCV-DO1009 (item 42, airlock RK 2-8)',
    HICDO1012: 'FCV-DO1012 (item 43, airlock RK 2-8)',
    /* 3.2.3 (SOHEE): the ID fan damper PCD-FG1056-1 (I/O list "PNEUMATIC CONTROL DAMPER", PD-051, AO0226 by PICFG108A). Source:
       o&m-package-phase-1 L16 FANS "LMYP-1 Fan Instruction Manual", 4.1 Pneumatic Actuator Data Sheet For I.D.Fan (RF2-0582-DOC-3,
       STI CMV datasheet 133486SC01 rev 1): line 18 DOUBLE ACTING, line 58 air lock (lock up + 2 x 3 way valves) set 2.5 bar /
       kg/cm2, line 29 air failure mode IN PLACE, filter regulator NORGREN B73 set 4, supply 4 / 6; operation table: air FAIL/LOSS =
       lever IN PLACE; Fan Specification Sheet 4 of 5, 3.3.1: FAILURE = LOCK POSITION */
    PICFG108A: 'PCD-FG1056-1 (ID fan damper, STI CMV double acting, airlock set 2.5, air failure in place)'
  },
  /* 3.2.3-beta.180 (SOHEE): modulating valves with a SPRING (single acting, no airlock): controller -> [spring position, travel
     start, full travel (bar g)]. FA blower inlet valves FCV-FA1055-A1 / B1 (ABC-014 FICFA1055A / B): Continental P&ID 500-0ds REV03
     (o&m-package-phase-1 L10-5 Fluidizing air blower) "Modulated Valve PNEUMATIC - DN500 4-20 mA - Single acting", NO (normally
     open); TECOFI assembly "PNEUMATIC ACTUATOR SR200 ON VP LUG DN500" (spring return) + SIPART PS2 positioner + filter regulator.
     The spring pressures are not in the docs: 0.6 / 2.0 bar = the median precompression / full travel of the package sheets below
     (NO-SOURCE) */
  spr: { FICFA1055A: [100, 0.6, 2.0], FICFA1055B: [100, 0.6, 2.0] },
  /* the lock pressure of a valve whose own sheet gives its set point (kg/cm2); the others AN_AV.lock */
  lk: { PICFG108A: 2.5 },
  /* on / off valves by the tag of the DITL solenoid: spring position (100 open / 0 closed, or 'hold'), precompression and full
     travel pressures (bar g; the psig of the Siemens sheets x 0.0689) */
  sv: {
    MS1011: [100, 1.586, 2.62] /* item 2: 23 / 38 psig */,
    MS1023: [100, 0.6, 1.1] /* item 3 */,
    CR1011: [100, 0.4, 2.1] /* item 4 */,
    CR1012: [100, 0.4, 2.1],
    HR1021: [100, 2.0, 3.1] /* item 5 */,
    HR1022: [100, 2.0, 3.1],
    SB1054: [0, 2.2, 3.0] /* item 10, spring closing */,
    SB1059: [0, 2.2, 3.0],
    CD1005: [100, 0.276, 0.896] /* item 12: 4 / 13 psig */,
    CD1006: [100, 0.276, 1.103] /* item 13: 4 / 16 psig */,
    'CD1104-2': [100, 0.621, 1.448] /* item 16: 9 / 21 psig */,
    'FW1111-1': ['hold'] /* item 21, airlock SMC VSA 3-way */,
    'FW1121-1': ['hold'] /* item 25 */,
    MU1109: [100, 1.0, 1.9] /* item 39 */,
    FS1005: [100, 0.6, 1.7] /* item 44 */,
    CD1004: [100, 0.276, 1.931] /* item 45: 4 / 28 psig */,
    /* 3.2.3-beta.180 (SOHEE): FA blower surge (to silencer) and outlet SOVs XV-FA1055-A2 / A3 (B2 / B3 on DITL-28C #B, same drawing
       tag): Continental P&ID 500-0ds REV03, single acting, NO (normally open); TECOFI "PNEUMATIC ACTUATOR SR115 ON VP DN150" /
       "SPRING RETURN PNEUMATIC ACTUATOR SR200 ON VP LUG DN450". Spring pressures NO-SOURCE (as spr above) */
    'FA1055-A2': [100, 0.6, 2.0],
    'FA1055-A3': [100, 0.6, 2.0]
  }
};
/* the unit header pressure the valves see (kg/cm2), NaN while the plant model is OFF or the air model has not run */
function anAvP() {
  if (typeof AN_UNIT === 'undefined' || !AN_UNIT.on) return NaN;
  const P = +AN_UNIT.iaPU;
  return isFinite(P) ? P : NaN;
}
/* the opening that reaches the process for the command x of controller tag: held below the lock pressure */
function anAv(tag, x) {
  /* 3.2.1 e5 (LISA, engine/faults.js): a control valve stuck in the field stays where it was when it stuck, whatever the command */
  if (tag && typeof anFaultStuck === 'function') {
    const s = anFaultStuck(tag, x);
    if (s != null) return s;
  }
  const sp = tag && AN_AV.spr[tag];
  if (sp) {
    const P = anAvP();
    if (!isFinite(P) || !isFinite(x)) return x;
    const f = Math.max(0, Math.min(1, (Math.min(P, AN_AV.reg) * AN_AV.bar - sp[1]) / (sp[2] - sp[1])));
    return sp[0] + (x - sp[0]) * f;
  }
  if (!tag || !AN_AV.hold[tag]) return x;
  const P = anAvP(),
    H = AN_UNIT.avH || (AN_UNIT.avH = {});
  if (!isFinite(P) || P >= (AN_AV.lk[tag] || AN_AV.lock) || !isFinite(x)) {
    H[tag] = x;
    return x;
  }
  if (H[tag] == null || !isFinite(H[tag])) H[tag] = x;
  return H[tag];
}
/* the target position (0 ~ 100) of the DITL solenoid valve tag commanded open (want) at position pos; null = not an air valve of the package */
function anAvSv(tag, want, pos) {
  const d = tag && AN_AV.sv[tag];
  if (!d) return null;
  const P = anAvP(),
    cmd = want ? 100 : 0;
  if (!isFinite(P)) return cmd;
  if (d[0] === 'hold') return P >= AN_AV.lock ? cmd : pos;
  const pb = Math.min(P, AN_AV.reg) * AN_AV.bar,
    f = Math.max(0, Math.min(1, (pb - d[1]) / (d[2] - d[1])));
  return d[0] + (cmd - d[0]) * f;
}
/* an input row of a DITL drawing (a field contact: the RUNNING / TRIP of a compressor set at its local panel); null while no world */
function anDitlIn(name, row) {
  try {
    if (typeof S === 'undefined' || !S.sheets || !window.WORLD || !WORLD.on || !window.DUI) return null;
    const C = AN_UNIT._dr || (AN_UNIT._dr = {});
    let s = C[name];
    if (!s) {
      s = S.sheets.concat(WORLD.inst || []).find(x => x.name.endsWith(name)) || null;
      if (s) C[name] = s;
    }
    return s ? (DUI.rowVal(s, row) ? 1 : 0) : null;
  } catch (e) {
    return null;
  }
}
/* 3.2.1: the sheet of a DITL drawing (or machine instance) by its name, for the contacts the plant model owns */
function anDitlSheet(name) {
  try {
    if (typeof S === 'undefined' || !S.sheets || !window.WORLD || !WORLD.on || !window.DUI) return null;
    const C = AN_UNIT._dr || (AN_UNIT._dr = {});
    let s = C[name];
    if (!s) {
      s = S.sheets.concat(WORLD.inst || []).find(x => x.name.endsWith(name)) || null;
      if (s) C[name] = s;
    }
    return s;
  } catch (e) {
    return null;
  }
}
function anAirStep(U, dt) {
  const K = AN_AIR,
    lag = (k, x, tau) => (U[k] = isFinite(U[k]) ? U[k] + ((x - U[k]) * Math.min(dt, tau)) / tau : x);
  /* 3.2.1 the cross-tie PA -> IA tanks V-PA0013 (PD-023, field valve, normally closed): free air = Kx x opening x sqrt(PA - IA) while the
     PA tanks are higher (check valve), the pressures of the step before */
  const dX = (+U.paP || 0) - (+U.iaP || 0),
    qx = anFv('V-PA0013') > 0 && dX > 0 ? (K.Kx * anFv('V-PA0013') * Math.sqrt(dX)) / 100 : 0;
  U.xQ = Math.round(qx);
  for (const k in K.sys) {
    const Y = K.sys[k],
      xin = k === 'ia' ? qx : -qx,
      iso = anFv(Y.iso) > 0,
      s = anDitlSheet(Y.c),
      trip = K.rows.map(r => anDitlIn(Y.c, r + 1) || 0),
      dry = K.dry.map(d => anDitlRun(d + Y.d) || 0),
      nd = dry.reduce((a, b) => a + b, 0);
    /* the compressors: the state of the scenario at the first step, then the START COMMAND of the logic (only a compressor whose
       local panel is in REMOTE), its TRIP contact, and a start / stop at the local panel (the field operator writes the RUNNING
       contact: guide.js LS_OP.fieldRow, PR-OPE-5002 "Ensure the compressor is in Local Position ... Initiate RUN") */
    let run = U[k + 'Run'];
    if (!Array.isArray(run)) {
      if (!s) continue;
      run = U[k + 'Run'] = K.rows.map(r => anDitlIn(Y.c, r) || 0);
      U[k + 'Ts'] = K.rows.map(() => 1e9);
      U[k + 'Wr'] = run.slice();
      /* the control location of the local panel is not a DCS signal (D1-0-059 Modbus flag "Control Location", NO-SOURCE): in
         service = the running compressor and the next one in REMOTE (the standby of the auto start); Cold = all in LOCAL */
      const j = run.indexOf(1),
        sb = j < 0 ? -1 : [1, 2].map(d => (j + d) % run.length).find(i => !run[i]);
      U[k + 'Rem'] = run.map((r, i) => (r || i === sb ? 1 : 0));
    }
    const ts = U[k + 'Ts'] || (U[k + 'Ts'] = K.rows.map(() => 1e9)),
      wr = U[k + 'Wr'] || (U[k + 'Wr'] = run.slice()),
      rem = U[k + 'Rem'] || (U[k + 'Rem'] = K.rows.map(() => 0));
    /* Phase 11 (SUZU 2026-11-27, YUI read): the plant air compressors are 6.6 kV motors on BUS 1AM (M-0703A, ETAP K1AU3-E1-0-307 RA
       p A.3 / A.12, elec.js AN_EL.mot): a unit black-out (U.el.bo) leaves them with no supply, so they stop and no start (logic or
       local) holds until the bus is back. The instrument air compressors are 460 V motors: elec.js (anElStep LV) has every 460 V bus
       dead with BUS 1AM in a black-out, so they stop too */
    const dead = !!(U.el && U.el.bo);
    K.rows.forEach((r, i) => {
      const fld = s ? (s.sig[r + ':S'] ? 1 : 0) : wr[i];
      if (fld !== wr[i]) {
        run[i] = fld; /* the field operator at the local panel */
        if (fld) ts[i] = 0;
      }
      if (trip[i] || dead) run[i] = 0;
      else if (!run[i] && rem[i] && s && DUI.outVal(s, r) === 1) {
        run[i] = 1;
        ts[i] = 0;
      }
      if (run[i]) ts[i] += dt;
      wr[i] = run[i];
      if (s) s.sig[r + ':S'] = !!run[i]; /* the RUNNING contact of the local panel */
    });
    const on = run.map((r, i) => (r && ts[i] >= Y.tSt ? 1 : 0)),
      n = on.reduce((a, b) => a + b, 0);
    U[k + 'N'] = run.reduce((a, b) => a + b, 0);
    run.forEach((r, i) => (U[k + 'R' + i] = r));
    trip.forEach((r, i) => (U[k + 'T' + i] = r));
    dry.forEach((r, i) => (U[k + 'D' + i] = r));
    /* the tanks */
    const P0 = isFinite(U[k + 'P']) ? Math.max(0, U[k + 'P']) : 0,
      use = ((Y.Qd * (P0 + K.Pa)) / (K.P + K.Pa)) * (iso ? 1 : 1 - K.fU);
    let P = P0 + (((n * Y.Qc + xin - use) * K.Pa) / Y.V / 3600) * dt,
      qin = n * Y.Qc;
    if (n && P >= K.P) {
      P = K.P; /* the constant pressure loop of the compressor panel */
      qin = Math.max(0, use - xin);
    }
    P = Math.max(0, P);
    U[k + 'P'] = P;
    U[k + 'PA'] = U[k + 'PB'] = P;
    U[k + 'Q'] = qin;
    U[k + 'Use'] = use;
    /* the unit 1 header: through its isolation valve (V-IA1101 / V-PA1087); closed = the unit users bleed it down (NO-SOURCE: 60 s) */
    if (iso) U[k + 'PU'] = Math.max(0, P - K.loss * (use / Y.Qd) ** 2);
    else lag(k + 'PU', 0, 60);
    U[k + 'Iso'] = iso ? 1 : 0;
    U[k + 'PD'] = P + K.dD * (qin / Y.Qd) ** 2;
    dry.forEach((r, i) => lag(k + 'F' + i, qin && (nd ? r : 1) ? qin / (nd || dry.length) : 0, 3));
    /* the motors */
    run.forEach((r, i) => {
      const f = on[i] ? Math.max(K.fs, qin / n / Y.Qc) : 0,
        kW = f * Y.kW,
        I = !r ? 0 : ts[i] < Y.tSt ? Y.Ist : (Y.I100 * kW) / Y.kW100;
      U[k + 'Kw' + i] = Math.round(kW * 10) / 10;
      lag(k + 'Im' + i, I, K.tauI);
      U[k + 'I' + i] = Math.min(Y.Imax, U[k + 'Im' + i]); /* IT-C070xx: the range of the transmitter */
      if (k === 'pa') lag('paW' + i, K.Tw[0] + K.Tw[1] * (I / Y.I100) ** 2, K.Tw[2]);
    });
  }
}
function anUnitOwns(T, ids) {
  const U = AN_UNIT;
  return U.on && ids && ids.length && ids.some(id => U.own.has(T.rt.st[id]));
}
/* 2.2.0-beta.16: a PV that is an input of the sheet and that the unit model links from another sheet (ABC-054 PICHR1391 <- ABC-052
   SI0180): the loop model of that controller does not write it */
function anUnitOwnsPv(S, n) {
  const U = AN_UNIT;
  return U.on && n != null && (U.alink || []).some(([a, t]) => t.S === S && t.n === n);
}
/* one step of dt seconds (called by the plant step of ABC-001C) */
/* 3.2.1 c4: the generator electrical values of page 17 (GENERATOR), data sheet GAE-2013-0136 R2 (Mitsubishi Hitachi TFLQQ-KD, 176.5 MVA,
   0.85 lag, 13.8 kV, 60 Hz, 3600 rpm). Phase 11 (2026-11-27): read from the one field / phasor model of tcs-gen.js (anGenEl below); the
   AVR holds the terminal voltage at its set 90R (AUTO), so the Mvar follows the voltage set and the load, not a fixed power factor. */
function anDb(x, b) {
  return x > b ? x - b : x < -b ? x + b : 0;
}
/* 3.2.4 (JENNIE, priority list: grid events): the grid frequency the generator is locked to on the grid. Trainer fault 'grid.lo' (world.js):
   59.5 Hz, reached at 0.1 Hz/s (a unit lost elsewhere; NO-SOURCE trainer setting, the Philippine Grid Code normal band is 59.7 ~ 60.3 Hz),
   back to 60.0 at 0.02 Hz/s when cleared. Not modelled: the motors of the plant slow with the frequency (about 0.8 % at 59.5 Hz) */
const AN_GRID = { lo: 59.5, down: 0.1, up: 0.02 };
function anGridHz(U, dt) {
  const W = typeof window !== 'undefined' ? window.WORLD : null,
    /* one grid for the whole model (Rosé, manual sync from S68: on the line the panel read 60.00 for the machine and 60.02 for the grid):
       the slow drift of the synchronizing (tcs-gen.js tcsGridHz) is this frequency too, so the shaft turns with the grid the ASD and the 25
       relay see */
    drift = typeof tcsGridHz === 'function' ? tcsGridHz(isFinite(U.t) ? U.t : 0) - 60 : 0,
    aim = (W && W.ft && W.ft.has('grid.lo') ? AN_GRID.lo : 60) + drift,
    f = isFinite(U.gridHz) ? U.gridHz : 60;
  U.gridHz = aim < f ? Math.max(aim, f - AN_GRID.down * dt) : Math.min(aim, f + AN_GRID.up * dt);
  return U.gridHz;
}
/* the rating of the machine (GAE-2013-0136 R2: 176.5 MVA, 13.8 kV, 60 Hz) and the page 17 energy meters, which start at the meter
   reading of snapshot 37.PNG (a meter reading, not a physics value; the GCP meters of tcs-dev.js count from 0) */
const AN_GEN = {
  kV: 13.8,
  Hz: 60,
  S: 176.5,
  MWh: 7266257,
  MVArh: 882996
};
function anGenEl() {
  const U = AN.unit;
  if (!U || !U.on) return null;
  const tb = U.tb || {},
    c = U.tc,
    syn = tb.st === 'sync' || tb.st === 'load',
    fcb = syn || !!(c && c.exc),
    /* Phase 11 (MODEL GENERATOR ELECTRICAL : YUI, 2026-11-27): ONE generator model. The terminal voltage, stator current, Mvar, power
       factor and field are the ones of the field and on-line phasor model of tcs-gen.js (tcsGenStep / tcsGenPh: EMF behind Xd 1.92 pu,
       TR 2310 Xt 0.137 pu, stiff 230 kV bus; GEE-2015-0152 R1 p6, GAE-2013-0136 R2, K1AU3E1-0003 rev 2; checked against the V curves
       310SD23-270 R1 within 1.5 %), the same values the TCS I/O, the Modbus list and the var-hour meter read. Before, this page computed
       its own Mvar with a fixed power factor 0.977 (screen 37.PNG) and its own field scaled on that screen: two answers for one machine
       (150 MW: 33.1 Mvar here, 8.8 Mvar in the TCS). Read only: the mirror page does not make U.gen (beta.277) */
    g = U.gen || {},
    G = TCS_GEN,
    /* beta.240: P negative = reverse power (motoring) */
    P = syn ? +U.MW || 0 : 0,
    on = syn && !!g.f41,
    Q = on && isFinite(g.Q) ? g.Q * G.sb : 0,
    /* terminal voltage: on line the phasor |Vt|; off line the open circuit voltage, flux x speed (tcsGenStep g.V = eq x n already) */
    vt = fcb && isFinite(g.V) ? g.V : 0,
    kA = on && isFinite(g.I) ? g.I * G.ib : 0,
    /* the exciter field (brushless machine, UNITROL 6080): 4.5 A per pu of field (no load, GEE-2015-0152 p6), voltage = current x the
       exciter field resistance 6.14 ohm at 100 C (GAE-2015-0004 R1) */
    If = fcb && isFinite(g.efd) ? Math.max(0, g.efd) * G.ifo : 0,
    m = U.genE || (U.genE = { MWh: AN_GEN.MWh, MVArh: AN_GEN.MVArh });
  return {
    fcb: fcb ? 1 : 0,
    kV: vt * AN_GEN.kV,
    Hz: syn && !(U.el && U.el.l52 === false) ? AN_GEN.Hz : ((tb.rpm || 0) / 3600) * AN_GEN.Hz,
    MVAr: Q,
    /* the sign of the Mvar tells lag (export) or lead (import) */
    pf: on && P > 0 && isFinite(g.pf) ? g.pf : null,
    lead: on && Q < 0 ? 1 : 0,
    kA,
    Vf: If * G.rf,
    If,
    MWh: m.MWh,
    MVArh: m.MVArh,
    ta: (U.genT && U.genT.ta) || null,
    tAir: U.genT ? U.genT.ta.reduce((a, b) => a + b, 0) / 4 : null,
    ts: (U.genT && U.genT.ts) || null,
    tsMax: U.genT ? Math.max(...U.genT.ts) : null,
    tex: U.genT ? U.genT.ex : null
  };
}
/* Phase 11 (MODEL GENERATOR ELECTRICAL : YUI, 2026-11-27): the generator temperatures of pages 13 / 17 and of TCS GD-5 from the design of
   the machine (was: the readings of screen P35SHAFT at 130 MW scaled with the current squared).
   - cooling gas after the four air coolers H-1971A ~ D (TIGE10041 ~ 44): the cooler water is the closed (auxiliary) cooling water supply
     (AN_ACW, U.acT2). DESIGN-SRC: nameplate 310SD18-613 (generator O&M GAE-2014-0791 R0 PDF p180, read by YUA 2026-11-27) "cold air
     45 C", with GAE-2013-0136 R2 p1 "Temperatures Cooling Water Max. 37 C": the coolers hold 45 C gas with 37 C water, approach
     45 - 37 = 8 K (was 40 C, the IEC 60034-1 reference coolant, before the nameplate was read). The cooler duty itself changes by about a
     third between no load and rated (the friction, windage and core loss are there at no load too); the 8 K is held at every load.
   - stator coil (TIGE10061 ~ 66, six RTD in the slots): stator rise class B, indirectly air cooled (GAE-2013-0136 R2), total limit
     123 C by RTD at the rating (GEE-2014-0322 R2 p4; O&M GAE-2014-0791 p35 "stator <= 123 C") over the 45 C cold air of the nameplate:
     78 K at the rated current 7,384 A; the rise is the I2R loss of the armature (3 I^2 Ra, Ra 0.001051 ohm at 95 C, GAE-2013-0136 R2;
     GEE-2014-0322 5.6.2 c), so rise = 78 K x (I / 7.384 kA)^2.
     The six RTD read one value: the docs give no difference between the slots. The TCS alarm GD-5 HIGH 123 C is the same limit.
   - AC exciter outlet air (TIGE1005): its rise follows the exciter field squared; its rated rise is not in the docs, so it stays on the
     old reading 80 C at 7.85 A (screen P35SHAFT, a check value; finding for the PC lookup).
   At rest all go to the ambient. Lag 600 s (NO-SOURCE: the thermal time of the winding is not in the docs).
   The heat the air coolers give to the closed cooling water (port q.ccw.YUI, kW, written by anGenInt) = the generator losses:
     stator copper 3 I^2 Ra (Ra 0.001051 ohm at 95 C, GAE-2013-0136 R2; 172 kW at 7,384 A),
     main field I^2 Rf (Rf 0.2188 ohm at 95 C, GAE-2013-0136 R2; main field = exciter field x 463 / 4.5 A: 463 A main = 4.5 A exciter =
       1 pu field, 310SD23-268 R1 / GEE-2015-0152 p6; 1,218 A = 325 kW at the rating, 310SD23-270 R1),
     the rest (core, friction and windage, stray) at rated speed: DERIVED = the heat duty of the four coolers 2,120 kW (generator O&M
       GAE-2015-0063 R0 p36 "total cooler heat duty 2120 kW, water 400 m3/h, supply max 37 C"; Kitashiba sheets PLH10293 / PLH10294,
       PDF p221 / p222: main A, B 810 kW each, air (78.1) -> 45.0 C, sub C, D 250 kW each, air (76.7) -> 45.0 C; read by YUA,
       /mnt/project-files/suzu-leftovers-doc-reads.md) less the two above at the rating (176.5 MVA 0.85 lag, the machine the coolers are
       rated for) = 1,623 kW, with the cube of the speed (the windage; the split of core and windage is not in the docs: NO-SOURCE form).
       The bearing friction is not in it: it goes to the lube oil (same O&M p36: generator bearings 600 L/min, 240 kW). The 3,041 kW of
       mass balance K1AU3-MB-021 items 14 ~ 21 (290.5 t/h, 34 -> 42 C) is the cooling water line sizing, not the cooler duty (was used
       here before the O&M was read). No load table: one design point closes the balance. */
const AN_GENT = {
  tCold: 45 /* C, cold air of the nameplate 310SD18-613 (GAE-2014-0791 R0 PDF p180) */,
  tCw: 37 /* C, cooling water max (GAE-2013-0136 R2) */,
  tLim: 123 /* C, stator winding total limit by RTD (GEE-2014-0322 R2 p4) */,
  In: 7.384 /* kA rated (GAE-2013-0136 R2) */,
  ex: 80,
  tA: 41,
  If: 7.85,
  tau: 600,
  Ra: 0.001051 /* ohm, armature 1 phase at 95 C */,
  Rf: 0.2188 /* ohm, main field at 95 C */,
  ifMain: 463 / 4.5 /* A main field per A exciter field */,
  qD: 2120 /* kW, total heat duty of the four air coolers at the rating (GAE-2015-0063 R0 p36) */,
  ifD: 1218 /* A main field at the rating (310SD23-270 R1) */
};
AN_GENT.q0 = AN_GENT.qD - (3 * (AN_GENT.In * 1000) ** 2 * AN_GENT.Ra + AN_GENT.ifD ** 2 * AN_GENT.Rf) / 1000;
function anGenTemp(U, G, dt) {
  const K = AN_GENT,
    Ta = U.Tamb || 30,
    turn = U.tb && U.tb.rpm > 100,
    T = U.genT || (U.genT = { ta: [Ta, Ta, Ta, Ta], ts: [Ta, Ta, Ta, Ta, Ta, Ta], ex: Ta }),
    a = Math.min(1, dt / K.tau),
    cw = isFinite(U.acT2) ? U.acT2 : Ta,
    air = turn ? cw + (K.tCold - K.tCw) : Ta,
    rise = (K.tLim - K.tCold) * (G.kA / K.In) ** 2,
    rf = (G.If / K.If) ** 2;
  T.ta.forEach((v, i) => (T.ta[i] += (air - v) * a));
  T.ts.forEach((v, i) => (T.ts[i] += (air + rise - v) * a));
  T.ex += (air + (K.ex - K.tA) * rf - T.ex) * a;
  const n = Math.max(0, Math.min(1.2, ((U.tb && U.tb.rpm) || 0) / 3600));
  return (3 * (G.kA * 1000) ** 2 * K.Ra + (G.If * K.ifMain) ** 2 * K.Rf) / 1000 + K.q0 * n ** 3;
}
/* Phase 11 (YUI): THE GENERATOR ELECTRICAL OUTPUT U.MW (the one writer; port gen.W = it, anGenInt).
   - 52G closed on the grid: the shaft power less the generator losses, P = Pm - L. Pm = the blade work less the turbine mechanical loss
     (U.Pm above, turbine.js AN_TB.mech); L = the losses of the generator (anGenTemp: stator copper 3 I^2 Ra, main field I^2 Rf, core /
     windage / stray at speed, all to the air coolers, port q.ccw.YUI, GAE-2015-0063 R0 p36 2,120 kW at the rating), of the last step.
     With the steam cut (turbine trip, 52G still closed) P goes below 0: the machine motors on the grid, the 32 reverse power relay sees it.
     Before: the turbine side lumped all the losses (AN_TB lo + kq, the HB loss) and tripped P lagged 10 s behind it (tauMW, NO-SOURCE).
   - house load (52L1 open, the transfer done): the generator gives what the house load takes (D = the TCS target = the house load,
     elec.js), at once (3.2.4-beta.11).
   - 52G open: 0. */
function anGenW(U, onGrid, trip, D) {
  const tb = U.tb || {};
  if (!onGrid) return 0;
  if (U.el && U.el.l52 === false && tb.xfer && !trip && isFinite(D)) return D;
  const q = typeof anPortGet === 'function' ? anPortGet(U, 'q.ccw.YUI') : null,
    L = q && isFinite(q.Q) ? q.Q / 1000 : 0;
  return isFinite(U.Pm) ? U.Pm - L : 0;
}
/* the energy meters of page 17 count the sim time while synchronised */
function anGenInt(dt) {
  const U = AN.unit;
  if (!U || !U.on || !(dt > 0)) return;
  const G = anGenEl();
  if (!G) return;
  const Q = anGenTemp(U, G, dt),
    P = G.kA * Math.sqrt(3) * AN_GEN.kV * (G.pf || 0);
  U.genE.MWh += (P * dt) / 3600;
  U.genE.MVArh += (G.MVAr * dt) / 3600;
  /* Phase 11 ports (ports.js, YUI): the generator output, the unit auxiliary power, the cooler duty and the store of this part, once per
     plant step. gen.W = U.MW = the shaft power less the generator losses (anGenW).
     store.YUI E = the kinetic energy of the generator + exciter rotor: H 4.01 s x 176.5 MVA is the whole machine, and the generator +
     exciter share of its GD2 is 16,200 / (23,700 + 16,200) (GAE-2013-0136 R2), x (speed / 3600)^2 */
  const g52 = !!U.tb && (U.tb.st === 'sync' || U.tb.st === 'load'),
    el = typeof anElec === 'function' ? anElec(U) : null,
    n = Math.max(0, ((U.tb && U.tb.rpm) || 0) / 3600);
  anPortSet(U, 'gen', { W: g52 ? +U.MW || 0 : 0, x: { b52g: g52 ? 1 : 0 } }); /* = anGenW */
  anPortSet(U, 'aux.power', { W: el ? el.aux : null });
  anPortSet(U, 'q.ccw.YUI', { Q });
  anPortSet(U, 'store.YUI', { mw: 0, E: U.Hgen * AN_GEN.S * (16200 / (23700 + 16200)) * n * n });
  /* the pick-up contacts of the generator protection relay (A) for the TCS sheets SH-G-5A / 5B (elec.js anGenRelay) */
  anPortSet(U, 'relay.gen', { x: anGenRelay(U) });
}
/* 3.2.3 (SOHEE : PLANT MODEL HELPER, plan task a7 note): SAMPLING AND CHEMICAL DOSING (page "SAMPLING AND DOSING"). Before: no model,
   every analyzer '-----'. docs/versions/v3.2.1/SAMPLING_DOSING_PLANT_MODEL.md has the full source list.
   Dosing (flow diagram K1AU3-PD-042 Rev D, A1-0-001 RA PDF p 36): three skids, each a solution tank and two dosing pumps A / B.
     Z-1107A/B tri-sodium phosphate 200 ml/min -> economizer inlet (PD-017); Z-1108A/B neutral amine 250 ml/min -> condensate;
     Z-1109A/B carbon hydraride (carbohydrazide) 100 ml/min -> deaerator; agitator Z-1101. No DCS command: the I/O list has the
     RUNNING / ELECTRIC TROUBLE DI only (I.0120 ~ I.012D), so the pumps are FIELD equipment (AN.field tspA ... agt, the local panel).
     PR-OPE-5002: amine at the hotwell (3534 ~ 3569), carbohydrazide at the deaerator (3770 ~ 3781), phosphate after the drum fill
     (4200 "OPEN V-CH1007 and Start Phosphate Dosing pump"): one pump each (A), B standby.
   Water and steam (all CALC from the documents below, no fitted number):
     amine     the neutral amine stays in the cycle (volatile: it leaves the drum with the steam and comes back with the condensate);
               it leaves only with the blowdown (CBD + MBD of the drum model, AN_CYC.cbd / mbd) and is replaced by make-up without
               amine. Concentration c (1 = the target) : dc/dt = (dose - c x Fbd) / Mcyc. The dose is the one that holds the target
               at the design blowdown, CBD 15 T/H (mass balance K1AU3-MB-019 item 22, PDF p 11). Mcyc = hotwell 61.9 m3 (condenser
               O&M section 1 p 2) + feedwater tank 140.4 - 40 = 100.4 t and deaerator 13.37 - 9.83 = 3.54 t of water (DA O&M section 1
               p 2, operating minus empty) + the boiler 252 m3 (hydrostatic test procedure K1AU3-R3-0-101 p 8, includes the
               superheater: an upper bound) at the density of the drum water.
     pH        target 9.0 (PR-OPE-5002 3929 "PH level = 9.0"; FHI 2-8-TAB_3 p 2 amines 8.8 ~ 9.2). A weak base: [OH-] grows with the
               square root of its concentration, pH = 9.0 + 0.5 log10(c), not below the make-up water pH 7.5 (alarm list AT-SP1006
               normal). Feedwater AT-SP1001 / 1003 / 1009 and main steam AT-SP1016 (the amine goes with the steam).
     phosphate stays in the boiler water: dP/dt = (dose - P x Fbd) / Mb, Mb = the boiler 252 m3 above. The dose holds 2 ppm PO4 at the
               design CBD 15 T/H. 3.2.4-beta.71 (JENNIE, Rosé: AL2-SP01 stood in ALARM at 150 MW): was 5 ppm, the low end of the FHI band
               (Figure 2-8-TAB_3-2: PO4 5 ~ 10 ppm, pH 9.1 ~ 9.8), but there the drum water of this curve is pH 9.50 and 19.1 uS/cm,
               over the plant alarm list (AT-SP1011 H 9.5, AT-SP1012 H 10 uS/cm; snapshot AISP1012 4.6 uS/cm). The plant runs its
               phosphate inside its own alarm limits: 2 ppm = pH 9.08, 7.6 uS/cm (NO-SOURCE: the plant PO4 is not in a snapshot; the
               snapshot pair pH 9.5 / 4.6 uS/cm cannot be one water: OH- alone at pH 9.5 and 25 C is 6.3 uS/cm).
     drum pH   AT-SP1011: FHI Figure 2-8-TAB_3-3, curve Na/PO4 = 2.6 (FHI: maintain Na/PO4 <= 2.6), read at 1 / 2.5 / 5 / 7.5 / 10 / 15 /
               20 ppm (the curve is the phosphate water; no phosphate = the feedwater pH, never below it).
     drum cond AT-SP1012 specific conductivity of the phosphate water at 25 C: Na+ = 2.6 PO4, HPO4-- / PO4--- from the charge balance,
               OH- from the pH; limiting ionic conductivities (CRC, a property like the steam table) Na+ 50.1, OH- 198.0, 1/2 HPO4--
               57, 1/3 PO4--- 69 S cm2/mol.
     cation    AT-SP1002 / 1005 / 1018 / 1019 / 1021: the cation column takes the amine out; the model has no condenser leak, so the water
     cond.     is pure water: 0.055 uS/cm at 25 C (H+ 349.8 + OH- 198.0 S cm2/mol x 1.0E-7 mol/L). Sodium AT-SP1020: 0 (no leak).
     oxygen    AT-SP1004: the deaerator holds the dissolved oxygen below 0.01 ppm = 10 ppb while it is pressurized to 0.7 kg/cm2 or more
               (FHI 2-8-TAB_3 p 2); below that the water is not deaerated: air-saturated water (mg/l, far above the 0 ~ 100 ppb
               range: the transmitter reads its range top 100; Cold = this water until the deaerator is first pressurized). First order with the residence of the feedwater tank (100.4 t /
               feedwater flow).
               AT-SP1010 economizer inlet: the carbohydrazide takes the oxygen (fed in excess: all of it, 0 ppb); without it the
               oxygen of the deaerator reaches the economizer. The scavenger in the tank fades with the same residence.
     make-up   AT-SP1006 pH 7.5 (alarm list normal) while a make-up water pump feeds (AN_MU muFeed).
   audit 2026-11-21 B1 (was '-----' on the page):
     make-up   AT-SP1007 specific conductivity: demineralized water at its pH 7.5: H+ 10^-7.5, OH- 10^-6.5 with Na+ for the balance
               (lam above): 0.09 uS/cm.
     steam     AT-SP1014 saturated steam specific conductivity: the amine is volatile and goes with the steam (only the phosphate
               stays in the drum): NH4+ 73.5 (Kohlrausch, 25 C) + OH- 198.0 S cm2/mol x 10^(pH - 14) at the feedwater pH: 2.7 uS/cm at
               pH 9.0 (snapshot 3.8 = pH 9.15).
     silica    AT-SP1008 / 1013 / 1015 / 1017: 0, like the sodium: the model has no silica source (no demineralizer slip, no leak).
   Not modelled (kept '-----' on the page): the tank
   levels (the tank height is not in PD-042: the level switches LSH / LSL / LSLL 0.48 / 0.12 / 0.09 m of the alarm list cannot be
   tied to the 200 L). Alarm AL2-SP01 (analyzer common alarm) = a modelled analyzer beyond its H / L of the alarm list; AL1-SP01, AL3-SP01,
   AL-Z1110 = 0 (no fault in the model). Only numbers on U (the save is JSON: no function on U, Chaewon beta.108). */
const AN_CHEM = {
  pumps: {
    tspA: 'Z1107A',
    tspB: 'Z1107B',
    amnA: 'Z1108A',
    amnB: 'Z1108B',
    chzA: 'Z1109A',
    chzB: 'Z1109B',
    agt: 'Z1101A'
  },
  Fbd0: 15,
  pH0: 9.0,
  pHmu: 7.5,
  P0: 2,
  hw: 61.9,
  fwt: 100.4,
  da: 3.54,
  boil: 252,
  Pda: 0.7,
  o2da: 10,
  o2air: 100,
  po4: [
    [0, 0],
    [1, 8.85],
    [2.5, 9.2],
    [5, 9.5],
    [7.5, 9.65],
    [10, 9.77],
    [15, 9.93],
    [20, 10.0]
  ],
  lam: { na: 50.1, oh: 198.0, hpo4: 114, po4: 207, h: 349.8 },
  /* alarm list "Alarm List _20160912" sheet AT, H / L (dcs) */
  al: {
    sp1004: [20, null],
    sp1009: [9.6, 8.8],
    sp1010: [4.2, null],
    sp1011: [9.5, 8.8],
    sp1012: [10, null],
    sp1016: [null, 7.0],
    sp1020: [10, null]
  }
};
/* 3.2.3 (SOHEE): the steam the sootblowers take. Diamond Power N11639-SC1 "Sootblower steam data" (IK4M manual N11639 - IK4M-EL-,
   o&m-package-phase-1 L10-2, page 93), one row per location: head pressure (kg/cm2 g, set by the poppet valve of the blower), blowing
   time and unit operation time (s), steam flow per unit (kg/s):
     Above SH Upper, Above RH Upper (IK4M, 2 + 2)                      12.9   230 / 244   1.2
     the other 5 IK4M locations (2 each)                              8.0    230 / 244   0.6
     the IK4M-PT locations (#3 Eco, RH Int Lower ~ #2 Eco, 2/2/2/4)    8.7    116 / 120   0.9
     Above #1 Common Eco (IK4M-PT, 4)                                  8.7     98 / 102   0.9
   Total 3882 kg of steam for one cycle of the whole set. The tags by location: page MK15 (snapshot 18.PNG) draws N-1011 / 1012 above
   the RH upper and N-1013 / 1014 above the SH upper (the 4 of 1.2 kg/s); N-1015 ~ 1022, 1025, 1026 are the other IK4M (DITL-80O group
   M.4246); N-1023, 24, 27 ~ 34 the IK4M-PT and N-1035 ~ 38 the common economizer (M.4240 / M.4242), as the lance travel of world.js.
   The steam blows while the poppet valve is open: blowing time / unit operation time of the table, so from (oper - blow) / 2 s of
   travel out (50.8 mm/s) to the same point back: 356 mm (IK4M), 102 mm (IK4M-PT). The source is the sootblower header (S/H panel #1
   outlet through MV-SB1001 and PCV-SB1053, 18.PNG): no header pressure, no steam. Below its head pressure a blower passes less: critical
   flow through the nozzles, proportional to the absolute pressure before them (CALC). The steam leaves the boiler between the drum and
   the main steam flow transmitter FT-MS1031 (boiler outlet), so FT-MS1031 does not see it: the drum (pressure and level) loses it and
   the cycle needs it back as make-up (plant.js AN_CYC.dl). U.msb (T/H), U.sbN (blowers blowing). No blower moves unless the operator
   starts it (the lances start retracted, 18.PNG). NO-SOURCE: the header pressure drop under the flow (PCV-SB1053 has no Cv in the docs);
   the air heater blowers N-1040 / 1042 (no data in the table) */
const AN_SB = {
  head: { a: 12.9, b: 8.0, c: 8.7 },
  q: { a: 1.2, b: 0.6, c: 0.9 },
  open: { a: (50.8 * (244 - 230)) / 2, b: (50.8 * (244 - 230)) / 2, c: (50.8 * (120 - 116)) / 2 },
  kind: n => (n >= 1011 && n <= 1014 ? 'a' : (n >= 1015 && n <= 1022) || n === 1025 || n === 1026 ? 'b' : 'c'),
  /* 3.2.3 (SOHEE): the air heater blowers N-1040 (hot end) / N-1042 (cold end). L20 Gas air heater O&M manual (o&m-package-phase-1
     L20, OMM Rev0, 2.x data sheet "Sootblowers"): semi-retractable lance, hot & cold end SEQUENTIAL operation, steam (compressed air on
     boiler start-up), operating condition 10.5 kg/cm2, supply 16 kg/cm2 / 305 C, quantity per lance 3900 kg/hour, blowing time per lance
     19 minutes 40 seconds (total sootblowing time 40 minutes); the local panel moves the lance (3.2.16). Flow diagram K1AU3-PD-015: both
     on the sootblower header (SB-1-034 / SB-1-036). The DCS starts them: DITL-80F row 25 AIR PREHEATER SOOTBLOWER OPERATING (the start
     command of the DITL-80 program, count 29); a rise of it runs the cold end; DITL-80 output 19 (count 30) the hot end (3.2.4-beta.8). The medium: DITL-80K row 19 PLANT AIR / STEAM
     SELECT (M.4212, 1 = plant air: no steam taken). While a lance blows: its RESET POSITION is 0 (plantsw.js) and its pressure PT-SB1040 /
     PT-SB1042 (I/O list STN102 AI0549 / AI0550, 0 ~ 16) is the header pressure (at most 16). NO-SOURCE: the steps of the lance (one
     rotor turn each), the plant air pressure at the blower */
  /* Phase 6 DCS (2026-11-26, YUA PC read /mnt/project-files/phase6-dcs-5-signals-2026-11-26.md): the lance travel of the air heater
     blowers, Clyde Bergemann Mk VX-AB semi-retractable (L20 SCM: VX-AB manual p.11, drawing 110460/29/1 'F', control panel manual
     contract 110460 p.7 / p.9 / p.12): stroke 750 mm; forward in one continuous run to the reverse limit switch, no dwell at full stroke
     (p.11: the reverse limit reverses the motor); reverse in steps of 38 mm (panel timer T-on) with a dwell of 55 s (T-off, factory
     value = one rotor turn, rotor 1.10 rpm OMM p.17 / p.35); the poppet valve opens mechanically after the first 50 mm, so steam blows
     both ways beyond 50 mm (drawing 110460/29/1; 3900 kg/h x 19 min 40 s = 1278 kg = the OMM total, p.15). The travel speed is printed
     nowhere: DERIVED from the cycle, 20 steps (750 / 38 = 19.7) with 19 dwells = 1045 s, the 1500 mm of travel in the other 135 s at one
     speed both ways (11.1 mm/s): forward about 68 s, each step about 3.4 s, reverse about 18 min 32 s */
  aph: { q: 3.9, head: 10.5, tB: 19 * 60 + 40, rng: 16, L: 750, stp: 38, dw: 55, poppet: 50 },
  /* 3.2.3 (SOHEE): the drain temperatures TT-SB1056 (A, middle riser SB-1-046) / TT-SB1057 (B, right riser SB-1-039), I/O list STN102
     AI0916 / AI0917 0 ~ 600 C; DITL-80P rows 2 / 3 -> DITL-80A rows 22 / 23 (> 220 C = BLOWING PERMISSIVE with MV-SB1001 open 600 s)
     and rows 18 / 19 (> 250 C = the drain SOVs XV-SB1054 / 1059 close by themselves). Flow diagram PD-015: the steam comes from the
     S/H panel #1 outlet. Its temperature (CALC): the heat balance of the No.1 spray, steam in = (steam out x h(spray 1 outlet) - spray x
     h(water)) / (steam out - spray), steam out = main steam - No.2 spray (FT-FW1119), spray FT-FW1109 at TT-FW1011, h(water) = 4.19 x T
     (liquid, within 2 % of the steam table), pressure = drum - 6.4 x (main steam / 474.1)^2 (03.png PIBR1130). Check at 03.png (150.5 MW:
     MSF 474.1, spray 37.5 / 28.2 T/H, TICBR1130 394 C, PIBR1130 127.8, TIFW1011 162 C): 460 C against TT-BR1120-1 / -2 458 / 454 C.
     Through MV-SB1001 and PCV-SB1053 the steam is throttled at constant enthalpy to the header pressure (PICSB1052): steam.js steamTph
     (IAPWS-IF97 region 2). With steam in the header (above 0.5 kg/cm2: 18.PNG reads 0.4 with MV-SB1001 shut) the drains go to that
     temperature with the lag tauH; without steam they go back to their rest value with tauC. Rest: 18.PNG (149.8 MW, MV-SB1001 shut)
     107 / 105 C, scaled down to the ambient with the boiler water temperature (ambient at Cold). NO-SOURCE: tauH, tauC (the warm-up and
     the cooling of the drain lines) and the scaling of the rest value; the dead leg with its drain SOV shut is not modelled (the trap
     passes the condensate) */
  dr: { rest: [107, 105], Pon: 0.5, tauH: 120, tauC: 1800, P0: 134.2 }
};
/* U.sbT = S/H panel #1 outlet steam (C), U.sbTh = header steam (C, NaN without steam), U.sbTa / U.sbTb = TT-SB1056 / TT-SB1057 */
function anSbDrain(U, dt, P) {
  const K = AN_SB.dr,
    Ta = isFinite(U.Tamb) ? U.Tamb : 30,
    Pd = Math.max(0, +U.Pd || 0),
    tt = U.tt || {},
    T1 = typeof srcPv === 'function' ? srcPv('ABC-011', 'TICBR1130') : NaN,
    ms = Math.max(0, +U.ms || 0),
    w1 = Math.max(0, +tt['FT-FW1109'] || 0),
    w2 = Math.max(0, +tt['FT-FW1119'] || 0),
    Tf = tt['TT-FW1011'] != null && isFinite(tt['TT-FW1011']) ? +tt['TT-FW1011'] : Ta;
  let Ts = NaN;
  if (isFinite(T1) && Pd > 0) {
    const P1 = Math.max(0, Pd - 6.4 * (ms / 474.1) * (ms / 474.1)),
      mo = ms - w2;
    Ts = Math.max(T1, steamTsat(P1));
    if (w1 > 0 && mo - w1 > 1) Ts = steamTph(P1, (mo * steamH(P1, Ts) - w1 * 4.19 * Tf) / (mo - w1));
    U.sbTh = isFinite(P) && P > K.Pon ? steamTph(P, steamH(P1, Ts)) : NaN;
  } else U.sbTh = NaN;
  U.sbT = isFinite(Ts) ? Math.round(Ts * 10) / 10 : NaN;
  const Tw = isFinite(U.Tw) ? U.Tw : Ta,
    f = Math.max(0, Math.min(1, (Tw - Ta) / (steamTsat(K.P0) - Ta)));
  ['sbTa', 'sbTb'].forEach((k, i) => {
    const rest = Ta + (K.rest[i] - Ta) * f,
      tg = isFinite(U.sbTh) ? Math.max(rest, U.sbTh) : rest;
    if (!isFinite(U[k])) U[k] = rest;
    const tau = tg > U[k] ? K.tauH : K.tauC;
    U[k] += (tg - U[k]) * Math.min(1, dt / tau);
  });
}
function anSbStep(U, dt) {
  U.msb = 0;
  U.sbN = 0;
  const W = typeof window !== 'undefined' ? window.WORLD : null,
    L = W && W.sbLances ? W.sbLances() : [];
  const P = typeof srcPv === 'function' ? srcPv('ABC-017', 'PICSB1052') : NaN;
  anSbAph(U, dt, P);
  anSbDrain(U, dt, P);
  if (!L.length) return;
  if (!(P > 0)) return;
  for (const s of L) {
    const x = s._lance,
      k = AN_SB.kind(x.n);
    if (!(x.x > AN_SB.open[k])) continue;
    U.sbN++;
    U.msb += AN_SB.q[k] * 3.6 * Math.min(1, (P + 1.033) / (AN_SB.head[k] + 1.033));
  }
}
/* the air heater blowers (AN_SB.aph): U.sbA = { op: last OPERATING, ph: 0 rest / 1 hot end / 2 cold end, t: s in the phase, p40, p42,
   x: lance mm from park, mv: 1 forward / -1 reverse / 0 still } */
function anSbAph(U, dt, P) {
  const K = AN_SB.aph,
    A = U.sbA || (U.sbA = { op: 0, ph: 0, t: 0, p40: 0, p42: 0 }),
    op = typeof anDitlRun === 'function' ? anDitlRun('DITL-80F@25') : null,
    /* 3.2.4-beta.8 (the program stood at count 30): the DITL-80 (S3) program starts the two air heater blowers in two steps of its
       counter: count 29 = DITL-80F row 25 AIR PREHEATER SOOTBLOWER START COMMAND / OPERATING (80K), count 30 = DITL-80 output row 19 AIR
       PREHEATER HOT END SOOTBLOWER START COMMAND (to the local panel). The L20 OMM gives hot & cold end SEQUENTIAL, 19 min 40 s each: the
       first step runs the cold end N-1042, the second the hot end N-1040 (the order of the counter). Before: one rise ran both, so the
       second step had no blower to wait for and the program never reached PROGRAM END */
    hot = typeof anDitlRun === 'function' ? anDitlRun('(S3)DITL-80@19') : null;
  if (op === 1 && !A.op && !A.ph) {
    A.ph = 2;
    A.t = 0;
  }
  if (hot === 1 && !A.hot && !A.ph) {
    A.ph = 1;
    A.t = 0;
  }
  A.op = op === 1 ? 1 : 0;
  A.hot = hot === 1 ? 1 : 0;
  if (A.ph && dt > 0) {
    A.t += dt;
    if (A.t >= K.tB) {
      A.ph = 0;
      A.t = 0;
    }
  }
  /* the lance of the running blower (AN_SB.aph, DERIVED travel): A.x mm from park, A.mv 1 forward (MOF), -1 reverse step (MOR), 0 dwell
     or at rest. Steps: (L / stp) rounded up = 20, dwells one fewer = 19, speed = 2 L / (tB - dwells x dw) */
  {
    const n = Math.ceil(K.L / K.stp),
      v = (2 * K.L) / (K.tB - (n - 1) * K.dw),
      tf = K.L / v,
      ts = K.stp / v;
    let x = 0,
      mv = 0;
    if (A.ph) {
      if (A.t < tf) (x = v * A.t), (mv = 1);
      else {
        const r = A.t - tf,
          k = Math.floor(r / (ts + K.dw)),
          w = r - k * (ts + K.dw);
        if (w < ts) (x = K.L - k * K.stp - v * w), (mv = -1);
        else x = K.L - (k + 1) * K.stp;
        if (x <= 0) (x = 0), (mv = 0);
      }
    }
    A.x = x;
    A.mv = mv;
  }
  let air = false;
  try {
    const k = typeof S !== 'undefined' && S.sheets ? S.sheets.find(x => /\)DITL-80K$/.test(x.name)) : null;
    air = !!(k && k.sig && k.sig['19:S']);
  } catch (e) {}
  const Ph = isFinite(P) && P > 0 ? Math.min(K.rng, P) : 0;
  A.p40 = A.ph === 1 && !air ? Ph : 0;
  A.p42 = A.ph === 2 && !air ? Ph : 0;
  if (A.ph && !air && Ph > 0 && A.x > K.poppet) {
    U.sbN++;
    U.msb += K.q * Math.min(1, (Ph + 1.033) / (K.head + 1.033));
  }
}
function anChemStep(U, dt) {
  const K = AN_CHEM,
    f = typeof AN_SRC !== 'undefined' && AN_SRC.field ? AN_SRC.field : {},
    on = (a, b) => (f[a] || f[b] ? 1 : 0),
    cyc = typeof AN_CYC !== 'undefined' ? AN_CYC : {},
    Fbd = Math.max(0, (+cyc.cbd || 0) + (+cyc.mbd || 0)),
    ffw = Math.max(0, +cyc.ffw || 0),
    rho = typeof anWaterRho === 'function' && isFinite(U.Tw) ? anWaterRho(U.Tw) / 1000 : 1,
    Mb = K.boil * rho,
    Mcyc = K.hw + K.fwt + K.da + Mb,
    h = Math.min(dt, 60) / 3600;
  for (const k in K.pumps) U['ch_' + k] = f[k] ? 1 : 0;
  const amn = on('amnA', 'amnB'),
    tsp = on('tspA', 'tspB'),
    chz = on('chzA', 'chzB');
  if (!isFinite(U.chC)) U.chC = 1; /* the water of the cycle was conditioned before the fill (PR-OPE-5002 3284) */
  if (!isFinite(U.chP)) U.chP = tsp ? K.P0 : 0;
  if (!isFinite(U.chS)) U.chS = chz;
  for (let t = 0; t < dt; t += 60) {
    const s = Math.min(60, dt - t) / 3600;
    U.chC = Math.max(0, U.chC + (s * (amn * K.Fbd0 - U.chC * Fbd)) / Mcyc);
    U.chP = Math.max(0, U.chP + (s * (tsp * K.Fbd0 * K.P0 - U.chP * Fbd)) / Mb);
  }
  /* the feedwater tank residence (h): water mass / feedwater flow; no flow = nothing moves */
  const res = ffw > 1 ? K.fwt / ffw : Infinity,
    lag = (x, y) => (res === Infinity ? x : x + (y - x) * Math.min(1, h / res)),
    Pda = U.xt && U.xt.dea ? anUnitVal(U.xt.dea) : NaN,
    o2t = isFinite(Pda) && Pda >= K.Pda ? K.o2da : K.o2air;
  U.chPda = isFinite(Pda) ? Math.round(Pda * 100) / 100 : null;
  U.chS = lag(U.chS, chz);
  if (U.chCold === 2 && isFinite(Pda) && Pda < K.Pda) U.chCold = 1;
  else if (U.chCold === 1 && isFinite(Pda) && Pda >= K.Pda) U.chCold = 0;
  U.chO = U.chCold ? K.o2air : isFinite(U.chO) ? lag(U.chO, o2t) : o2t;
  const pHfw = Math.max(K.pHmu, K.pH0 + 0.5 * Math.log10(Math.max(1e-9, U.chC))),
    P = U.chP,
    pc = (() => {
      const T = K.po4;
      if (P <= T[1][0]) return null;
      for (let i = 2; i < T.length; i++)
        if (P <= T[i][0]) return T[i - 1][1] + ((T[i][1] - T[i - 1][1]) * (P - T[i - 1][0])) / (T[i][0] - T[i - 1][0]);
      return T[T.length - 1][1];
    })(),
    ohP = pc == null ? 0 : Math.pow(10, pc - 14),
    pHd = pc == null ? pHfw : Math.max(pc, pHfw),
    L = K.lam,
    C = P / 1000 / 94.97 /* mol/L of PO4 */,
    oh = Math.pow(10, pHd - 14),
    x = Math.max(0, Math.min(C, 0.6 * C - ohP)) /* PO4--- */,
    kd = 1000 * (L.na * 2.6 * C + L.hpo4 * (C - x) + L.po4 * x + L.oh * oh),
    cat = 1000 * (L.h + L.oh) * 1e-7,
    r = (v, d) => Math.round(v * d) / d;
  U.sp1001 = U.sp1003 = U.sp1009 = U.sp1016 = r(pHfw, 100);
  U.sp1002 = U.sp1005 = U.sp1018 = U.sp1019 = U.sp1021 = r(cat, 1000);
  U.sp1020 = 0;
  U.sp1008 = U.sp1013 = U.sp1015 = U.sp1017 = 0;
  {
    const h = Math.pow(10, -K.pHmu),
      o = Math.pow(10, K.pHmu - 14);
    U.sp1007 = r(1000 * (L.h * h + L.oh * o + L.na * Math.max(0, o - h)), 1000);
    U.sp1014 = r(1000 * (73.5 + L.oh) * Math.pow(10, pHfw - 14), 100);
  }
  U.sp1004 = r(Math.min(K.o2air, U.chO), 10);
  U.sp1010 = r(Math.min(K.o2air, U.chO * (1 - Math.max(0, Math.min(1, U.chS)))), 10);
  U.sp1011 = r(pHd, 100);
  U.sp1012 = r(kd, 10);
  U.chPO4 = r(P, 100);
  if ((U.muFeed || 0) > 0) U.sp1006 = K.pHmu;
  else if (!isFinite(U.sp1006)) U.sp1006 = K.pHmu;
  let al = 0;
  for (const k in K.al) {
    const v = U[k],
      [hi, lo] = K.al[k];
    if (isFinite(v) && ((hi != null && v > hi) || (lo != null && v < lo))) al = 1;
  }
  U.spAL2 = al;
  U.spAL1 = U.spAL3 = U.spALZ = 0;
}
/* beta.470 (lane plan 2026-11-25): the field signals of the lanes (src/world/field/<lane>.js, FIELD.add): a row { stn, ai: "AI0128", tag,
   src, rel, v(U, X) } writes v(AN_UNIT, X) on the AI blocks of that address once a scan, after the unit model step, as the unit model writes
   its own transmitters (anUnitWrite: a forced output is left alone, the range clamps). v reads the engine state only (X: anFieldX below). A row whose
   value is not a number writes nothing. The block lists are made again when the sheets with a running engine change. */
let AN_FLD = null;
/* the reader a field row gets as its second argument (v(U, X)): the engine readers that live inside the engine closure, read only.
   av(tag, x)    the opening that reaches the process for the command x of control valve tag (anAv: air lock, stuck fault); the hold
                 memory anAv keeps is put back after the call, so a field row never moves it
   ditlPos(n, j) the position 0 ~ 100 % of valve j of DITL drawing n ("DITL-32", "DITL-32 #B"), null while the world is not built
   ditlRun(a)    1 RUN / 0 STOP of DITL drawing a ("DITL-23A", "DITL-39@3" = output row 3), null while the world is not built
   ai(key)       the value on the AI blocks of "stn|AI0128" (the first block with a number), NaN when no running sheet has it
   ftrip(n)      1 while drawing n ("DITL-19 #B") stands on a field trip (the protection relay or the undervoltage relay opened its
                 breaker: s._ftrip of WORLD.ftrip / the black-out), else 0; null while the world is not built
   fault(id)     1 while the trainer fault id stands (AN.fault or WORLD.ftrip list, 'cf.jamA', 'cv.fw'), else 0; null when the id is in no list
   state(id)     the value 1 / 0 of a field state (FIELD.state, faults.js): its documented normal, the other one while the instructor
                 holds it out of normal; null = no such id */
const anFieldKey = () => AN.sheets.reduce((n, s) => n + (s.S ? 1 : 0), 0);
function anFieldX() {
  let C = {},
    ck = -1;
  return Object.freeze({
    av: (tag, x) => {
      const H = AN_UNIT.avH,
        had = !!H && tag in H,
        h = had ? H[tag] : undefined,
        fs = typeof AN_FAULT_STUCK !== 'undefined' && tag in AN_FAULT_STUCK,
        f = fs ? AN_FAULT_STUCK[tag] : undefined;
      try {
        return anAv(tag, x);
      } finally {
        if (AN_UNIT.avH) {
          if (had) AN_UNIT.avH[tag] = h;
          else delete AN_UNIT.avH[tag];
          if (!H) delete AN_UNIT.avH;
        }
        if (fs) AN_FAULT_STUCK[tag] = f;
      }
    },
    ditlPos: (n, j) => anDitlPos(n, j),
    ditlRun: (a, last) => anDitlRun(a, last),
    ftrip: n => {
      const s = anDitlSheet(')' + n);
      return s ? (s._ftrip ? 1 : 0) : null;
    },
    fault: id => {
      const L = anFault().concat(typeof window !== 'undefined' && window.WORLD && WORLD.ftrip ? WORLD.ftrip() : []),
        f = L.find(q => q.id === id);
      return f ? (f.on ? 1 : 0) : null;
    },
    state: id => anFieldStateVal(String(id)),
    ai: key => {
      const k = anFieldKey();
      if (k !== ck) (C = {}), (ck = k); /* the block lists again when the sheets with a running engine change */
      return anUnitVal(C[key] || (C[key] = anUnitAIs(String(key))));
    }
  });
}
const anFieldN = t => String(t || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
const AN_FLD_X = anFieldX();
const anFieldRows = () => (((typeof window !== 'undefined' ? window : globalThis).FIELD || {}).rows || []).filter(r => typeof (r.v || r.get) === 'function');
/* the values of all rows now: [row, number] (a row whose value is not a number, or that fails, is left out) */
function anFieldVals() {
  const out = [];
  for (const r of anFieldRows()) {
    let v;
    try {
      v = (r.v || r.get)(AN_UNIT, AN_FLD_X);
    } catch (e) {
      continue;
    }
    v = v === true ? 1 : v === false ? 0 : v == null ? NaN : +v;
    if (isFinite(v)) out.push([r, v]);
  }
  return out;
}
function anFieldMap(L) {
  const V = {};
  for (const [r, v] of L) {
    if (r.ai) V[String(r.stn) + '|' + r.ai] = v;
    if (r.tag) V[anFieldN(r.tag)] = v;
  }
  return V;
}
/* the value of a field row for the HMI, by "stn|AI0128" or by the tag without signs (PTIA1064A). AN.unit.fld is the map of the last scan
   (in the keyframe: the mirror page of the Worker has it). A plant that is loaded and not yet run has none (the state just loaded takes
   the key away): then the rows are read now, at most twice a second of the PC clock */
let AN_FLD_NOW = null;
const anFieldRead = key => {
  let V = AN_UNIT.fld;
  if (!V) {
    const t = Date.now();
    if (!AN_FLD_NOW || t - AN_FLD_NOW.t > 500 || t < AN_FLD_NOW.t) AN_FLD_NOW = { t, V: anFieldMap(anFieldVals()) };
    V = AN_FLD_NOW.V;
  }
  const v = V[key];
  return v === undefined ? null : v;
};
function anFieldStep() {
  const F = anFieldRows();
  if (!F.length) return;
  const key = anFieldKey() + '/' + F.length;
  if (!AN_FLD || AN_FLD.key !== key) {
    AN_FLD = { key, L: new Map(F.filter(r => r.ai).map(r => [r, anUnitAIs(String(r.stn) + '|' + r.ai)])) };
    /* for the lanes and QA: each AI row and the number of blocks it writes (0 = the address is on no running sheet) */
    AN.fieldStat = [...AN_FLD.L].map(([r, l]) => ({ lane: r.lane, stn: r.stn, ai: r.ai, tag: r.tag, blocks: l.length }));
  }
  const L = anFieldVals();
  for (const [r, v] of L) {
    const l = AN_FLD.L.get(r);
    if (l && l.length) anUnitWrite(l, v);
  }
  AN_UNIT.fld = anFieldMap(L);
}
function anUnitStep(dt) {
  const M = (typeof globalThis !== 'undefined' ? globalThis : window).LS_SIMM;
  if (M) M.on = ++M.n;
  try {
    anUnitStep0(dt);
    anFieldStep();
    anGenInt(dt);
    anHistStep(dt); /* hist.js: the faceplate trend history, one sample a simulated second */
    anSoeStep(); /* soe.js: the sequence of events of the MFT and the turbine trip, one look per step */
  } finally {
    if (M) M.on = 0;
  }
}
/* 3.2.3-beta.212 (F16): snapshot values of the furnace / cyclone / seal pot thermocouples (hmi-op.js AN_HMI_AI), kept off U */
let AN_GAS_A0 = null;
function anGasA0() {
  if (AN_GAS_A0) return AN_GAS_A0;
  const by = re =>
      Object.values(AN_HMI_AI)
        .filter(x => re.test(x[1]))
        .map(x => +x[0]),
    avg = a => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : NaN),
    one = tg => avg(by(new RegExp('^' + tg + '$')));
  return (AN_GAS_A0 = {
    u: avg(by(/^TIFG1091[A-I]$/)),
    l: avg(by(/^TIFG1090[A-I]$/)),
    cy: [one('TIFG1095A'), one('TIFG1095B')],
    sp: [one('TIFG1009A'), one('TIFG1009B')]
  });
}
/* the cyclone refractory, the heat transfer chain (hx.js anHxStep) and the reheat outlet pipe, one scan; U.hxO = its outputs.
   Beta.245 (Jennie, Rosé real-click test at 150 MW: values "-----" while paused): it ran only inside the unit step, so a state saved
   by an older engine (src/data/st150.txt, 11-19: U.hxO without p1o / e1o / e2o of audit 2026-11-21 B1) showed TT-BR1020 / 1030 /
   1120-1 / -2 empty until the plant ran. A load runs it at dt 0 (anTagsNow): every metal, lining and pipe temperature stays (each
   moves by x dt), the outputs are those of the loaded plant */
function anHxRun(U, dt, tsat) {
  /* the cyclone refractory (AN_FG): the gas touches only the hot face (U.Tcy) through the film hA (effectiveness 1 - exp(-hA / gas
     cp)); the hot face conducts into the back of the lining (U.TcyB) */
  const K = AN_FG,
    gcp = isFinite(U.gcp) ? U.gcp : 0;
  if (!isFinite(U.tgF)) U.tgF = U.Tb;
  if (!isFinite(U.Tcy)) U.Tcy = U.tgF;
  if (!isFinite(U.TcyB)) U.TcyB = U.Tcy;
  const eCy = gcp > 0.01 ? 1 - Math.exp(-K.hA / gcp) : 1,
    qCy = gcp * eCy * (U.tgF - U.Tcy) /* kW, gas to the hot face */,
    qCyB = K.kAB * (U.Tcy - U.TcyB); /* kW, hot face to the back */
  U.Tcy += ((qCy - qCyB) * dt) / K.mF;
  U.TcyB += (qCyB * dt) / K.mB;
  const tG = gcp > 0.01 ? U.tgF - qCy / gcp : U.Tcy; /* gas into the backpass */
  U.tgB = tG;
  /* the cyclone outlet thermocouples TT-FG1095-A / B read the gas leaving the cyclones */
  U.gCy = [tG, tG];
  const tcr = U.xt && U.xt.T && isFinite(U.xt.T.cr) ? U.xt.T.cr : tsat,
    /* the reheater steam: the HP turbine exhaust less the No.2 HP heater extraction (U.hpF2, its drain) and the HP gland leak-off
       (2.7 % of the HP steam: HEAT_BALANCE.md 458.7 T/H to the turbine, 401 T/H to the reheater, 45.15 T/H No.2 HPH), plus the HP
       bypass */
    mRh = Math.max(0, (U.mhp || 0) + Math.max(0, U.ms * 0.973 - (isFinite(U.hpF2) ? U.hpF2 : 0)));
  const H = anHxStep(
    U,
    {
      Tg: tG,
      mG: isFinite(U.mG) ? U.mG : 0,
      Tb: isFinite(U.Tu) ? U.Tu : U.Tb /* beta.256: the panels see the upper furnace mean (AN_BB) */,
      phi: isFinite(U.phi) ? U.phi : 0,
      Tamb: U.Tamb,
      Tm0: U.hxT0,
      Pd: U.Pd,
      Pms: U.Pms,
      mOut: U.ms + U.mb + (U.msb || 0) + (U.msv || 0),
      w1: U.w1s,
      w2: U.w2s,
      wrh: U.wrhs,
      Tsp: U.tSp,
      Tsr: U.tSr,
      Prh: U.Prh,
      mRh,
      Tcr: tcr,
      mEco: U.mEco,
      mL: (U.tlE || 0) / 3.6 /* an economizer tube leak, kg/s (hx.js) */,
      Tfw: U.hpT2,
      dR: isFinite(U.dmpR) ? U.dmpR : 1 /* no position read: open */,
      dS: isFinite(U.dmpS) ? U.dmpS : 1
    },
    dt
  );
  U.hxT0 = NaN;
  U.hxQp = H.qP;
  U.hxHe = H.hEco;
  U.hxO = H;
  /* TT-HR1002 is on the reheater outlet pipe, outside the gas path (live Cold start 2026-11-14): heated by the steam that flows out of
     the last reheater bank, losing to the room through its lagging (rhPipeUA). No steam: the pipe cools */
  const wR = mRh + Math.max(0, U.wrhs || 0);
  if (!isFinite(U.TpR)) U.TpR = H.rh;
  U.TpR +=
    (((wR / 3.6) * 2.2 * (H.rh - U.TpR) - (U.rhPipeUA || 0.02) * (U.TpR - U.Tamb)) * dt) / (U.rhPipeM || 10000);
  U.TpR = Math.max(U.Tamb, U.TpR);
  U.wR = wR;
  return H;
}
function anUnitStep0(dt) {
  const U = AN_UNIT;
  if (!U.on || !(dt > 0)) return;
  const S = U.S,
    v = S.rt.v;
  /* coal of the three feeders (T/H) -> steam made in the drum (T/H), first order */
  /* 2.2.0-beta.14: + the oil of the start-up burners (ao x coal); the offset of the firing line fades out below 30 % of the anchor coal */
  /* 3.2.0 P1 #6: the coal of a feeder through its outlet discharge valve (DITL-20) */
  /* 3.2.4: a trainer fault 'cf.jamA / B / C' (world.js WORLD.ftrip): the discharge chute of the feeder is plugged. The feed rate of the
     feeder is the belt load times the belt speed (Yamato GM-BSC22-36, CFC-201, Final Drawing P4 / P8): the coal stays on the running belt,
     so the load cells and the feed rate signal AI0480 / 0512 / 0544 read as before while no coal reaches the furnace */
  const jam = i => {
    const W = typeof window !== 'undefined' ? window.WORLD : null;
    return !!(W && W.ft && W.ft.has('cf.jam' + 'ABC'[i]));
  };
  anTubeLeak(U, dt);
  anCoalLots(U, dt);
  anCoalWet(U);
  const F = U.fuel.reduce((a, l, i) => {
      const o = U.cfo ? anDitlPos(U.cfo[i], 0) : null;
      return jam(i) ? a : a + (anUnitVal(l) || 0) * (o == null ? 1 : o / 100);
    }, 0),
    oil = (U.oilN || []).reduce((a, x) => a + Math.max(0, +x.S.rt.v[x.n] || 0), 0),
    bf = Math.max(0, Math.min(1, (U.Tb - U.Tburn0) / (U.Tburn1 - U.Tburn0))),
    cb0 = isFinite(U.cbed) && U.cbed > 0 ? U.cbed : 0,
    cbB = (bf * cb0 * 3600) / AN_CBED.tau /* T/H of the held coal that burns */,
    Fb = bf * F + cbB /* coal burnt, T/H */,
    Fe = Fb + U.ao * oil;
  U.oilF = oil;
  U.burn = bf;
  U.cbn = Fb;
  U.cbed = Math.max(0, cb0 + (((1 - bf) * F - cbB) * dt) / 3600);
  U.unb = F - Fb; /* fed minus burnt: negative while held coal burns out */
  U.Fc = F; /* 3.2.0-beta.14: coal of the feeders (source.js: SOx) */
  /* beta.261: the steam made (U.Qs) is the bed / wall heat balance below over the boiling heat; the fuel line a x coal (a fitted on the
     2026-11-08 plant trends) and its lag tauF are gone */
  /* ---- 2.2.0-beta.12 (M3): station wiring S2 -> S1, turbine trip ---- */
  for (const [a, tg] of U.bcast || []) {
    const x = a.S.rt.force[a.n] !== undefined ? a.S.rt.force[a.n] : a.S.rt.ext[a.n];
    if (x === undefined) continue;
    for (const t of tg) if (t.S.rt.force[t.n] === undefined && t.S.rt.ext[t.n] !== x) t.S.rt.ext[t.n] = x;
  }
  for (const [a, t] of U.alink || []) {
    const x = +a.S.rt.v[a.n];
    if (isFinite(x) && t.S.rt.force[t.n] === undefined) t.S.rt.ext[t.n] = x;
  }
  /* 3.2.0-beta.15: condenser vacuum (see AN_UNIT vacUp): with no seawater or condensate pump the TCS trips the turbine on LOW VACUUM */
  {
    if (!isFinite(U.vac)) U.vac = 1;
    /* raised by the vacuum pumps at a steady rate, lost first order. 3.2.0-beta.37 (CHECKLIST 0.5, user 2026-10-25 "bakit wala ang
       vacuum up at gland steam at auxiliary steam"): PR-OPE-5002 VACUUM UP needs the steam ejectors and the gland sealing, both on
       the auxiliary steam ("Auxiliary steam pressure is > 10 Kg/cm2"), and the aux steam is taken from the main steam ("AUXILLIARY
       WARMING UP, REQUIREMENT: MS Pressure > 12 Kg/cm2", MV-AS1391). No aux steam: the vacuum does not rise (it is held, not lost) */
    /* 3.2.0-beta.38: with the TCS model (tcs.js) the ejectors raise the vacuum: aux steam > 10, gland sealing in service, vacuum breaker
       MV-AV1391 closed (PR-OPE-5002 6545); an open vacuum breaker breaks it */
    /* an ATS program that began at a trip from Start 150 MW: the snapshot keeps the vacuum as at load, not through the start-up ejector line-up */
    const tcx = U.tc && !U.tc.fromLoad ? U.tc : null;
    /* P2 #13 (INSTRUMENT_VALVE_COVERAGE.md): with the one world the ejectors and the vacuum breaker are the DITL MOVs, not a separate
       panel state: start-up ejector MV-AS1395 (DITL-54), steam jet air ejector MV-AS1396 (DITL-55), vacuum breaker MV-AV1391 (DITL-56).
       The TCS VACUUM UP command presses them (tcs.js tcsDitl); a breaker opened on the DITL breaks the vacuum */
    if (tcx) {
      const p54 = anDitlPos('DITL-54', 0),
        p55 = anDitlPos('DITL-55', 0),
        p56 = anDitlPos('DITL-56', 0);
      if (p54 != null && p55 != null && p56 != null) {
        tcx.vb = p56 > 5;
        tcx.ej = p54 > 50 || p55 > 50;
      }
    }
    /* 3.2.3 live Cold start (user 2026-11-14 "Code ang gawin"): the aux steam header, the gland header and the air in the condenser are
       mass balances (AN_AS, anAuxStep); the condenser pressure is its air plus the saturation of the condensing temperature (anCondStep).
       Before: the vacuum share rose at dt / vacUp while the TCS flags said ejector + gland + aux > 10, and fell in vacDn */
    anAuxStep(U, dt);
    U.aux = U.asF && U.asF.aout > 0 ? 1 : 0;
    /* Mina beta.136 (CEP-A stopped at 47 MW): the steam jet air ejector needs a condensate pump (its inter / after condensers, ED 066
       p2); the air in-leakage then raises the condenser pressure (anAuxStep), no fixed decay time any more */
    const tb0 = U.tb,
      l = U.vtrip;
    /* I.0400 follows the valves (IBD TA-6, tcsI0400); a model without a vacuum value keeps its own rule */
    if (
      tb0 &&
      tb0.st !== 'off' &&
      !isFinite(U.cdP) &&
      U.vac < 0.6 &&
      l &&
      l.S.rt.force[l.n] === undefined &&
      l.S.ext.includes(l.n) &&
      l.S.rt.ext[l.n] !== 1
    ) {
      l.S.rt.ext[l.n] = 1;
    }
  }
  /* 3.2.0-beta.59: the seawater system (030 SEAWATER HMI), see AN_SW */
  anSeawaterStep(U, dt);
  /* 3.2.0-beta.63: the make-up water system and the expansion tank (MAKE-UP WATER HMI), see AN_MU */
  anMakeupStep(U, dt);
  /* 3.2.0-beta.66: the turbine lube and control oil (036 TURBINE OIL HMI), see TCS_OIL (tcs.js) */
  tcsOil(U, dt);
  /* the TCS field devices with no state before: drain MOVs, non return valves, hood spray valve (tcs-dev.js, U.dev) */
  tcsDev(U, dt);
  /* 3.2.0-beta.68: the instrument and plant air systems (INSTRUMENT & PLANT AIR HMI), see AN_AIR */
  anAirStep(U, dt);
  /* 3.2.1 SEULGI: the boiler-side systems (boiler.js: diesel oil) */
  anBoilerStep(U, dt);
  /* 3.2.0-beta.69: the aux cooling water loop (027 CLOSED COOLING WATER HMI), see AN_ACW */
  anAcwStep(U, dt);
  /* 3.2.1: the turbine lube oil cooler on the closed cooling water (AN_LO) */
  anLubeCoolStep(U, dt);
  /* 3.2.1: the condenser (pressure, hotwell temperature) and the condensate pumps (AN_CD) */
  anCondStep(U, dt);
  /* 3.2.1: the boiler feed water pumps (AN_FW) */
  anFwStep(U, dt);
  anHphStep(U, dt);
  anHdStep(U, dt);
  /* 3.2.1: the LP heater temperatures (AN_LP) */
  anLphStep(U, dt);
  /* Phase 11 (NANA): the deaerator pressure / temperature from its energy balance (AN_DA) */
  anDeaStep(U, dt);
  /* live test #54: motor bearing / winding temperature and vibration (AN_MT) */
  anMotorStep(U, dt);
  /* 3.2.3 SOHEE: sampling and chemical dosing (AN_CHEM) */
  anChemStep(U, dt);
  /* 3.2.3 SOHEE: the steam of the sootblowers (AN_SB) */
  anSbStep(U, dt);
  /* Phase 8: the package PLCs on the Modbus link (engine/pkg.js) */
  if (typeof pkgStep === 'function') pkgStep(U, dt);
  /* Phase 8: the Modbus link DCS <-> TCS, alive bit and the 10 s dead line of TCT090A (tcs.js) */
  if (typeof tcsLinkStep === 'function') tcsLinkStep(U, dt);
  anHrWarm(U, dt); /* 3.2.3 SOHEE: LP bypass warming valve XV-HR1010-1, TT-HR1010 */
  const trip = (U.trip || []).some(t => +t.S.rt.v[t.n] > 0.5);
  /* ---- 2.2.0-beta.17 (M4 step 4): the turbine black box (see AN_UNIT rollRate ...) ---- */
  const tb = U.tb || (U.tb = { st: 'load', rpm: 3600, icv: 1, xfer: true, tgt: NaN, aim: NaN }),
    dirt = (l, x) => {
      if (l && l.S.rt.force[l.n] === undefined && l.S.ext.includes(l.n) && l.S.rt.ext[l.n] !== x) l.S.rt.ext[l.n] = x;
    };
  /* the TCS is always there on the real unit (Hitachi HIACS, its own controllers): at the Start at 150 MW snapshot / its save points the
     TCS state is the in-service one (oil pumps of the snapshot carried over, ATS step 7 NORMAL OPERATION), so AN.tcs(), the governor and
     the tests read and command the same TCS as after a start-up (checked: MW / drum pressure the same after 120 s with or without it) */
  if (!U.tc && U.turb && !trip && tb.st === 'load') tcsFromOil(U);
  /* 3.2.0-beta.38: the turbine auxiliaries and the ATS program (tcs.js) */
  if (U.tc && !trip) tcsStep(U, dt);
  else if (U.tc) {
    tcsTripHold(U, dt);
    tcsAux(U, dt); /* beta.240 metal, beta.243 all the auxiliaries (tcs.js tcsAux): the plant goes on while the trip is held */
    if (U.tc.cur < 0) tcsMode(U); /* beta.370 (JENNIE): the start-up mode band follows the metal while the trip is held (tcs.js tcsStep) */
  }
  /* Start at 150 MW: no ATS program, the trip logic of the IBD runs all the same (tcs-trip.js) */
  else if (!trip) tcsTripScan(U, dt);
  else tcsTripHold(U, dt);
  if (trip && tb.st !== 'off') {
    /* the machine is lost at any start: stop valves shut, 52G open by ST TRIP (IBD TA-6, 310SD03-743 sheet 4 E-1), no transfer, no DCS mode, the ATS off (310SC90-775
       page 6). Coming back is the ATS again, there is no reload on reset: at Start 150 MW the ATS program starts here */
    tb.icv = Math.max(0, tb.icv - dt / U.tauTrip);
    if (!U.tc) tcsFromOil(U);
    Object.assign(tb, { st: 'off', xfer: false, tgt: 0, aim: 0 });
    tcsTrip(U);
    dirt(U.di.gcbOn, 0);
    dirt(U.di.gcbOff, 1);
    dirt(U.di.xfer, 0);
    dirt(U.di.perm, 0);
    dirt(U.di.on, 0);
  }
  {
    /* d1: the TCS mode, the turning gear and the heater level switches as the ABC inputs (U.di above); the heater set points as the DITL rows (plantsw.js, alarm list LS-HD110x) */
    const w = (l, x) => {
        if (l && l.S.rt.force[l.n] === undefined && l.S.ext.includes(l.n) && l.S.rt.ext[l.n] !== x) l.S.rt.ext[l.n] = x;
      },
      c = U.tc,
      m = c && c.mode,
      H = U.hdLvl || {};
    for (const l of U.di.one || []) w(l, 1);
    /* I.0413 / I.0414 / I.0417: the TCS outputs TCA980-21 / TCA980-20 / TCE960-8 of the program (tcs-dcs.js); before it runs, the state */
    const hw = (id, x) => {
      const y = tcsHw(U, id);
      return y === undefined ? x : y > 0.5 ? 1 : 0;
    };
    for (const l of U.di.warm || []) w(l, hw('TCA980-21', m === 'warm' ? 1 : 0));
    for (const l of U.di.hot || []) w(l, hw('TCA980-20', m === 'hot' ? 1 : 0));
    w(U.di.tg, hw('TCE960-8', c && c.tg && tb.rpm < 4 ? 1 : 0));
    /* the MSV / CV test executing outputs of the TCS (TCE960-27 / 28): the PI/O row of the program, else its end in tce-io.js (the valve
       test selected on TCE220 / TCE224, L.vtSel); one source, the TCS */
    const io = window.TCE_IO_LIVE,
      mb = id => {
        const y = io && io.mbRead ? io.mbRead(U, id) : NaN;
        return isFinite(y) ? (y > 0.5 ? 1 : 0) : 0;
      };
    /* a save made before these two links has no U.di.msvA / msvB: found once here (the same label read as anUnitStart) */
    if (!('msvA' in U.di)) {
      const x = AN.sheets.find(y => y.name === 'ABC-050'),
        L1 = t => {
          const n = x && x.S ? x.S.lab.findIndex(z => z && String(z.t).trim() === t) : -1;
          return n >= 0 ? { S: x.S, n } : null;
        };
      U.di.msvA = L1('I.041E');
      U.di.msvB = L1('I.041F');
    }
    if (U.di.msvA) w(U.di.msvA, mb('TCE960-27'));
    if (U.di.msvB) w(U.di.msvB, mb('TCE960-28'));
    const eb = window.WORLD && WORLD.endBand; /* open limit switch: the one rule of plantsw.js (the engine alone, ABC only, has no field switches) */
    if (eb && U.lpbSp && U.lpbSp.n != null)
      w(U.di.lpbZso, anAv('TICHR1012', Math.max(0, Math.min(100, +U.lpbSp.S.rt.v[U.lpbSp.n] || 0))) >= eb.open ? 1 : 0);
    for (const [l, k, sp] of U.di.hd || []) if (isFinite(H[k])) w(l, H[k] >= sp ? 1 : 0);
    if (U.diX === undefined) U.diX = anDiXOf(); /* a save point from before Phase 6 (2026-11-26) */
    const X = U.diX || {};
    for (const [l, k, sp] of X.hd || []) if (isFinite(H[k])) w(l, H[k] >= sp ? 1 : 0);
    if (isFinite(U.cdP)) for (const l of X.cdps || []) w(l, U.cdP - 1.033 >= -0.86 ? 1 : 0);
  }
  U.turb = tb.st !== 'off';
  const onGrid = tb.st === 'sync' || tb.st === 'load';
  if (U.tc) {
    /* the ATS sets the speed and the ICV (tcs.js); a stopped machine coasts down to the turning gear */
    if (!U.turb && tb.rpm > 4) tb.rpm = Math.max(0, tb.rpm - (3600 * dt) / 600);
  } else if (tb.st === 'roll') {
    tb.rpm = Math.min(3600, tb.rpm + (U.rollRate * dt) / 60);
    tb.icv = Math.min(U.icvRoll, tb.icv + (U.icvRoll * dt) / 60);
  } else if (!U.turb) tb.rpm = Math.max(0, tb.rpm - (3600 * dt) / 600);
  /* turbine valves (TCS): MW to the turbine master demand */
  /* DCS control mode ON (CCS, 33.PNG): the TCS follows the turbine master of the DCS (EIC-TM output, AO0359 TO TCS; in AUTO it is
     the unit load demand of HIC-ULD + the pressure correction; in MANUAL the operator's MW). OFF: the TCS keeps its own target
     (2.2.0-beta.17: the operator's target on the TCS panel, tb.aim, reached at rateUp MW/min: INITIAL LOAD, LOAD UP) */
  const on = U.dcs < 0 || +v[U.dcs] > 0.5,
    tmo = U.tm && U.tm.o && U.tm.o[0] != null ? +v[U.tm.o[0]] : NaN,
    ds = U.dem >= 0 ? +v[U.dem] : NaN;
  /* Phase 9: the analog output itself (STN101 AO0359 TCS-AO1001, TARGET MW DEMAND to TCE930-5), whatever the DCS control mode */
  U.aoTM = isFinite(tmo) ? tmo : NaN;
  if (on) {
    U.tcsT = isFinite(tmo) ? tmo : isFinite(ds) ? ds : U.MW;
    /* TCE p.134: while DCS CONTROL MODE is ON the TCS target load tracks GEN. MW */
    if (onGrid && isFinite(U.MW)) tb.tgt = tb.aim = U.MW;
  } else if (onGrid && isFinite(tb.aim)) {
    if (!isFinite(tb.tgt)) tb.tgt = U.MW;
    tb.tgt += Math.max(-(U.rateUp * dt) / 60, Math.min((U.rateUp * dt) / 60, tb.aim - tb.tgt));
    U.tcsT = tb.tgt;
  } else if (!isFinite(U.tcsT)) U.tcsT = U.MW;
  /* plan c4: 52L1 as the ABC input, and on house load the turbine carries the house load only (elec.js) */
  if (typeof anElecStep === 'function') anElecStep(U);
  const D = U.tcsT;
  /* LMYP OTS 1.0.0-beta.3 (JENNIE, live Hot roll 2026-11-19, F-CN): the load loop of the TCS (TCE207 flow demand tb.fd, MW error integral
     tb.fi) works only with 52G closed. Off the grid (turbine stopped, tripped or under speed control) it starts again from the valves at
     the next 52G close (anTbFlow: tb.fd = CV OPENING BIAS x ICV opening). Before, the flow demand of the last loaded run stayed in the
     plant and in every save point after it (0.82 at S68, 3600 rpm no load): at the 52G close the CVs went to 77 % in seconds, the main
     steam flow 187 -> 418 T/H at 0 MW and the turbine tripped on HP TURBINE INLET / EXHAUST DIFF. PRESS. VERY HIGH (IBD TA-21) */
  if (!onGrid) tb.fd = tb.fi = NaN;
  if (U.turb === false) {
    /* 2.2.0-beta.14: cold start, the turbine is not rolled yet: the stop valves are shut (M4 step 4 opens them) */
    U.gv = 0;
    U.tcsT = 0;
    tb.icv = 0;
  } else if (trip) {
    /* turbine trip: the TCS closes the valves; the load set point is gone */
    U.gv = Math.max(0, U.gv - dt / U.tauTrip);
    U.tcsT = 0;
  } else if (tb.st === 'roll') {
    U.gv = 0;
    U.tcsT = 0;
  } else if (!tb.xfer) {
    /* IP start mode (TCE207): the one flow demand opens the ICV first; the CVs stay shut until it passes the CV OPENING BIAS (20 %) */
    anTbFlow(U, tb, D, dt, dirt);
  } else {
    /* 3.2.3 PLU (POWER LOAD UNBALANCE, TG manual 2-2 TURBINE CONTROL SYSTEM_R1 5.3.2.4): the fast acting solenoid valves of the CVs and
       ICVs are energized when the generator current falls faster than 40 % / 10 ms and the power (reheat bowl pressure) minus the load
       (generator current) is over 40 % of the rating, 2 out of 3 modules. Here: 52L1 opened on load (the load drops at once to the house
       load, elec.js) and the turbine power U.MW minus that load over 40 % of U.MW0. The valves close at the trip rate (U.tauTrip, the same
       fast acting dump; NO-SOURCE: the PLU closing time) until the unbalance is under 40 %, then the speed control opens them again.
       Not modelled: the speed peak, the 2 out of 3 voting (one value) */
    const ld = U.el && U.el.l52 === false ? D : U.MW,
      /* 3.2.3 house load speed: the power side is the steam power of the last step (U.Pm, no tauMW lag: the reheat bowl pressure falls
         as soon as the ICV closes); before, the lagged U.MW kept the valves shut about 7 s and the speed fell to 95.8 % */
      plu = U.el && U.el.l52 === false && ((isFinite(U.Pm) ? U.Pm : U.MW) - ld) / U.MW0 > 0.4;
    if (plu && !tb.plu && typeof window !== 'undefined' && window.lsEventAdd && !(window.ENG && ENG.mode === 'mirror'))
      lsEventAdd(
        'TCS',
        'TCS',
        'PLU (power load unbalance): CV and ICV fast closing, turbine ' +
          Math.round(U.MW) +
          ' MW against ' +
          Math.round(ld) +
          ' MW load'
      );
    tb.plu = plu;
    if (plu || (U.el && U.el.l52 === false)) tb.fd = NaN;
    if (plu) {
      U.gv = Math.max(0.02, U.gv - dt / U.tauTrip);
      tb.icv = Math.max(0, tb.icv - dt / U.tauTrip);
      tb.gs = U.rbIP;
      tb.hlT = (tb.hlT || 0) + dt;
    } else if (U.el && U.el.l52 === false) {
      /* 3.2.3 house load: the speed governor (TCE p.140 TCE206): flow demand = GOV.SET - flow span x (rpm - 3600) / (droop x 3600), the
         HP CV opening U.gv taken as the flow demand (1 = the anchor flow). GOV.SET (tb.gs) starts at the CV opening after the PLU and is
         trimmed by the TCS load loop toward the house load (elec.js, as before). The CV moves at the trip rate (U.tauTrip, NO-SOURCE).
         Not yet: the GOVERNOR RUNBACK (TCE p.128 / 136: GOV.SET 24.3 % HP / 4.2 % IP start for 60 s), the low droop 16 % */
      /* GOVERNOR RUNBACK (rbIP, rbT above): GOV.SET held at the runback position (integral I005 SW = 0, Y = Z) for the 60 s pulse of the
         house load, then the integral goes on from there (TCE p.136), trimmed by the TCS load loop toward the house load (NO-SOURCE:
         the input of I005 after the runback is not printed on the sheets read) */
      tb.hlT = (tb.hlT || 0) + dt;
      /* 3.2.4-beta.12 (live beta.11: the speed stayed at 3585 rpm, 59.75 Hz, and no operator action moved it): the speed / load changer.
         TG manual STIE-14752 (plant study 05): after a load rejection the machine "stays at no-load speed until changed by the speed /
         load changer". The changer is the TCS load target of the panel (LOAD UP, tb.aim, ramped as tb.tgt at the load rate): during the
         runback pulse the target follows GOV.SET (the runback position as MW), after it GOV.SET moves toward the target (as a share of
         the rating) at the flow demand rate (TCE207 A007 RI / RD, U.fdRate). With 6 % droop a higher target is a higher speed. Before,
         GOV.SET was trimmed by the house load minus the generator MW, which is 0 on house load (the generator gives what the load takes) */
      if (tb.hlT <= U.rbT || !isFinite(tb.gs)) {
        tb.gs = U.rbIP;
        tb.aim = tb.tgt = U.rbIP * U.MW0;
      } else {
        const r = (U.fdRate || 0.01) * dt,
          g = Math.max(0, Math.min(1.4, (isFinite(tb.tgt) ? tb.tgt : U.rbIP * U.MW0) / U.MW0));
        tb.gs = Math.max(0, Math.min(1.4, tb.gs + Math.max(-r, Math.min(r, g - tb.gs))));
      }
      const dem = Math.max(
          0,
          Math.min(1.4, tb.gs - (U.flowSpan * anDb((tb.rpm || 3600) - 3600, U.dbRpm || 0)) / ((U.droop || 0.06) * 3600))
        ),
        r = dt / U.tauTrip,
        B = U.cvBias || 0.2,
        cvD = Math.max(0, Math.min(1.4, (dem - B) / (1 - B))),
        icvD = Math.max(0, Math.min(1, dem / B)),
        i0 = tb.icv == null ? 1 : tb.icv;
      /* 3.2.4-beta.11: the CV and ICV demands from the one flow demand as on the grid (TCE p.141 TCE207, anTbFlow): ICV = demand / CV
         OPENING BIAS, CV = (demand - bias) / (1 - bias). Before, both took the demand itself: at the house load demand (under the 20 % bias)
         the CVs stayed open and the ICVs nearly shut. Now the CVs stay shut and the ICVs pass the no-load flow from the reheater, which the
         HP bypass feeds (TG manual STIE-14752: "at about 102 % speed the ICVs open to pass no-load flow") */
      U.gv += Math.max(-r, Math.min(r, cvD - U.gv));
      tb.icv = Math.max(0, Math.min(1, i0 + Math.max(-r, Math.min(r, icvD - i0))));
    } else {
      tb.gs = NaN;
      tb.hlT = 0;
      anTbFlow(U, tb, D, dt, dirt);
    }
  }
  /* steam flow through the valves: m = Kt x gv x MSP, MSP = drum - kdp x m^2 */
  /* 3.2.0 P1 #3: the steam reaches the turbine through the main steam stop MOV MV-MS1391 (or its warming bypass, anUnitStepX) */
  /* LMYP OTS valve tests (tcs.js tcsVtStep / tcsVtLift, TCE220 / 222): the two CV groups in series with their MSV, half the steam each */
  tcsVtStep(U, dt);
  U.kdp = anShKdp(U); /* Phase 11: the SH pressure drop law at the density of this scan (anShKdp) */
  const k = U.Kt * tcsVtLift(U) * (U.msG == null ? 1 : U.msG),
    a2 = U.kdp * k,
    ms = a2 > 0 ? (-1 + Math.sqrt(1 + 4 * a2 * k * Math.max(0, U.Pd))) / (2 * a2) : k * U.Pd;
  U.ms = Math.max(0, ms);
  /* the other outlets: flow = share x anchor flow x opening x MSP / anchor MSP */
  const P1 = Math.max(0, U.Pd - U.kdp * U.ms * U.ms);
  U.mb = 0;
  U.mhp = 0;
  const qOn = l => !!(l && l.S && l.S.rt && +l.S.rt.v[l.n] > 0.5),
    qHp = qOn(U.qo && U.qo.hp);
  for (const x of U.vlv) {
    const o = x.rh
        ? anVlvStroke(U, 'hpb', qHp ? 100 : Math.max(0, Math.min(100, anAv(x.t, +x.S.rt.v[x.n] || 0))), qHp, dt)
        : Math.max(0, Math.min(100, anAv(x.t, +x.S.rt.v[x.n] || 0))) /* PCV-MS1001: stroke time NOT IN DOCS (positioner only, no solenoid): as commanded */,
      /* Phase 11 rank 9: the valve law of the vendor Cv (turbine.js anVlvW): main steam at the SH outlet (P1, the finishing SH steam
         temperature) to the reheater (its pressure, the step before: the cold reheat line is the reheater inlet; with the turbine
         tripped the steam path has no HP exhaust pressure of its own) or to the silencer (atmosphere; the blow-off is choked at every
         pressure above 3 ata) */
      q = anVlvW(
        x.rh ? AN_VLV.hpb : AN_VLV.blo /* by the outlet, not a field of U.vlv: a save point restores U.vlv as it was saved */,
        o,
        P1 + 1.0332,
        U.hxO && isFinite(U.hxO.ms) ? U.hxO.ms : steamTsat(P1),
        x.rh ? Math.max(0, +U.Prh || 0) + 1.0332 : 1.0332
      );
    U.mb += q;
    if (x.rh) {
      U.mhp += q;
      /* the opening of PCV-MS1020 (%), read by its limit switch ZSC-MS1020 (plantsw.js, DITL-115 row 15 HP BYPASS VALVE FULL CLOSE) */
      U.hpbO = o;
    }
  }
  /* 3.2.4-beta.1: the safety valves of the drum (drum pressure) and of the SH outlet (main steam pressure P1), AN_SV */
  U.msv = anSvFlow(U, AN_SV.d, U.Pd) + anSvFlow(U, AN_SV.s, P1);
  /* drum: stored energy. 2.2.0-beta.14 (cold start): the firing heats the water first (U.Tw), then the pressure rises against the
     storage of the steam AND of the saturated water (C + Cw x dTsat/dP) */
  const tsatOf = steamTsat; /* 3.2.0-beta.15: IF97 steam table (steam.js), was the fit 100 + 47.1 x ln(P + 1) */
  /* air share (total air over the anchor), used by the cooling below and by the bed temperature */
  const taf = U.taf.reduce((a, n) => a + (+U.tafS.rt.v[n] || 0), 0),
    as = U.taf0 > 0 ? Math.max(0.05, taf / U.taf0) : 1;
  /* beta.258: the cooling of an unfired boiler by the draft and the room is inside the bed / wall heat balance below (one model) */
  /* 3.2.3-beta.258 (user 2026-11-15 "isang unit lng naman yan"): ONE model for every state. The bed heat balance below runs at every load
     (before: Cold only; "Start at 150 MW" had the curve anBedSS and a steam made from a fuel line) */
  {
    /* the bed heat balance (AN_BB above): the bed, the furnace exit gas and the heat of the water walls, no fitted law */
    const B = AN_BB,
      ts = tsatOf(U.Pd),
      lkA = (U.aphLk || 0) * (typeof AN_APK !== 'undefined' ? [AN_APK.pa, AN_APK.sa, 0] : [0, 0, 0]),
      /* beta.21: the air heater seal leak (boiler.js AN_APK) goes round the furnace: the bed gets the measured air less it */
      av = (U.tafS && U.taf.length === 3 ? U.taf.map(n => Math.max(0, +U.tafS.rt.v[n] || 0)) : [taf, 0, 0]).map((x, i) => Math.max(0, x - (lkA[i] || 0))),
      tPa = isFinite(U.aphPa) ? U.aphPa : U.Tamb,
      tSa = isFinite(U.aphSa) ? U.aphSa : U.Tamb,
      dW = U.Tb - U.Tw /* bed over the wall water, both signs */,
      fg = (Fb * (1 - AN_FG.ash * (U.coalR || 1)) + oil) / 3.6 /* fuel gas, kg/s (beta.13: the ash share with the wet coal) */,
      /* beta.261: cp(T). Air: Incropera Table A.4 (300 K 1.007, 700 K 1.075, 1100 K 1.159 kJ/kg K) as cp = 1.0 + 0.000155 T(C), CALC;
         flue gas: anHxCp (hx.js, FHI Tab 2 fuel at 20 % excess air). The heat to bring the air in and the fuel to the bed is the enthalpy
         of the flue gas at the bed less that of the air as it comes in (preheated by the air heater), both from the room */
      hAir = T => 1.0 * T + 0.0000775 * T * T,
      hFg = T => 1.08 * T + 0.0001065 * T * T,
      mAir = (av[0] + av[1] + av[2]) / 3.6,
      gcp = (mAir + fg) * anHxCp(U.Tb) /* kW/K, flue gas at the bed */,
      /* 3.2.4-beta.16 (user "Physics nga"): the gas that lifts the solids is the air AND the steam of a water wall tube leak, which boils in
         the bed: per kg 28.9 / 18 times the volume of air (ideal gas, same temperature and pressure) */
      /* beta.256: the velocity share is to the gas of the 150 MW anchor, which leaves the bed at the anchor bed tbA (AN_BB), not Tb0 */
      uRel = U.taf0 > 0 ? ((av[0] + av[1] + av[2] + ((U.tlW || 0) * 28.9) / 18) / U.taf0) * ((U.Tb + 273) / (B.tbA + 273)) : 0,
      phi = Math.min(1.2, Math.max(0, isFinite(U.bedI) ? U.bedI / AN_BI.t0 : 1)) * anBbPhiV(uRel) /* beta.282: Kunii & Levenspiel (AN_BB kKL) */,
      /* beta.263: the lower furnace refractory is its own lump. 25 mm castable k 1.5 W/m K over the tubes (13-thermal-masses), bed film
         300 W/m2 K (textbook), 359 m2: bed -> refractory centre 1 / (1/300 + 0.0125/1.5) = 85.7 W/m2 K = 30.8 kW/K, centre -> water
         1.5 / 0.0125 = 120 W/m2 K = 43.1 kW/K (in series 17.9 = uaL). Its time constant L2 / alpha (alpha = 1.5 / (2300 x 1000)) is
         16 min; with the 204.65 t lumped AT the bed temperature the bed answered the coal 2.4 times slower than its solids allow (75 MW:
         coal 39 ~ 54 T/H and pressure 120.4 ~ 123.9 kg/cm2 every 20 min, the plant tuning of PIC-COBM on that lag) */
      Trf = isFinite(U.Trf) ? U.Trf : (B.uaBR * U.Tb + B.uaRW * U.Tw) / (B.uaBR + B.uaRW),
      qBR = B.uaBR * (U.Tb - Trf) /* kW, bed -> refractory */,
      qRW = B.uaRW * (Trf - U.Tw) /* kW, refractory -> wall water */,
      /* 3.2.4-beta.24 (JENNIE, energy balance): the heat the upper furnace gas gives to the bare upper walls (qGas) went all to the
         water, but the bed and the gas paid only the share 1 - phi (the gas exit temperature): the share phi came from nowhere,
         about 15 MW at 150 MW. Now the suspension pays it: the circulating solids the share phi (the bed loses it), the gas alone the
         share 1 - phi; the solids add the rest of the design wall conductance ua0w. Result (headless, scenario 1 of the plant DCS
         trend): coal at 150 MW 85.9 -> 89.0 T/H (plant 89.7), 105 MW 64.6 (64.3), 90 MW 57.7 (55.4); 75 MW 2 h: no trip.
         Open (not in this Beta): uag stays 32 kW/K (27 W/m2 K, NO-SOURCE). The WSGG gas radiation of hx.js at the upper furnace beam
         length 3.6 V / A = 7.7 m (T2 15.507 x 7.684 m grate, 25.85 m upper walls) gives ~111 kW/K at 850 C and matches the plant
         cyclone out TIFG1095 (scenario 2: 867 C at ~140 MW, 726 C at 90 MW; model 869 / 742) and FHI Fig 10 spray 0 at 60 %, but the
         75 MW hold then swings into an MFT at ~107 min (also with 111 fixed): another low load lag of the model is missing first */
      /* 1.0.0-beta.256 (JENNIE, Full Audit 3, live 150 MW 2026-11-22: bed 856 C, plant TIFG1090 ~955 C): THE UPPER FURNACE SUSPENSION.
         The bed (the dense lower furnace, U.Tb) and the furnace exit gas are two temperatures on the plant: the eighteen lower layer
         thermocouples TT-FG1090 / 1091 A ~ I average 937 C at 150 MW (HMI snapshot, hmi-op.js; trend scenario 1 TIFG1090 952 ~ 962 C),
         while the gas leaving the furnace is 850 C (FHI design data / Fig 8 "furnace", the gas the backpass UAs shUA / rhUA and the
         chain of hx.js are built on; plant cyclone outlet TIFG1095 867 C at ~140 MW). Before, the model held the gas at the bed up to
         the exit (share phi) and took all the solids' wall heat at the bed temperature: one 856 C for both, 80 C under the bed.
         Now the gas and the circulating solids (heat capacity flow Cs = gas + phi x cSol) rise from the bed at Tb and give heat on
         their way up to the upper walls (Uw = gas radiation uag + phi x uaS, sink the water Tw) and to the in-furnace SH panels
         (Up = 2 x uaP x phi of hx.js, sink their metal): one stream, two sinks in parallel, so along the height
           T(x) = Ts + (Tb - Ts) e^(-N x), Ts = (Uw Tw + Up Tp) / (Uw + Up), N = (Uw + Up) / Cs,
         exit tgF = T(1), mean Tu = Ts + (Tb - Ts) (1 - e^-N) / N; walls qWu = Uw (Tu - Tw), panels Up (Tu - Tp) (hx.js, from Tu),
         and Cs (Tb - tgF) = qWu + panels exactly. Anchor constants: AN_BB tbA / cSol / uaS (CALC there) */
      up = (() => {
        const hm = U.hxM || {},
          uaP = typeof AN_HX !== 'undefined' ? (AN_HX.uaP1 + AN_HX.uaP2) / 2 : 0 /* beta.342: the mean of the two panels (F13) */,
          p = [hm.p1, hm.p2].filter(isFinite);
        /* beta.342: the metal is weighted by each panel conductance (uaP1 / uaP2 of hx.js) */
        const Tp = p.length === 2 && typeof AN_HX !== 'undefined' ? (AN_HX.uaP1 * p[0] + AN_HX.uaP2 * p[1]) / (AN_HX.uaP1 + AN_HX.uaP2) : p.length ? p.reduce((a, v) => a + v, 0) / p.length : U.Tw;
        return { U: p.length ? p.length * uaP * anBbPanF(isFinite(U.Tu) ? U.Tu : U.Tb, Tp, phi) : 0 /* beta.286: gas + solids (AN_BB fgP) */, T: Tp };
      })() /* the SH panels: conductance and metal of the last scan */,
      sus = anBbSus(U.Tb, U.Tw, gcp, phi, up, U.Tu) /* the suspension above (uag at the mean Tu of the last scan) */,
      qWu = sus.qW /* kW, the suspension to the upper walls (both signs) */,
      qSol = qWu + qRW /* kW, to the furnace walls: the upper walls + through the lower refractory */,
      qPan = isFinite(U.hxQp) ? U.hxQp : 0 /* kW, to the in-furnace SH panels (hx.js, last scan, from Tu) */,
      qFuel = Fb * B.lhvC * (U.coalK || 1) * (1 - B.fUC) + oil * B.lhvO,
      qAirG =
        (mAir + fg) * (hFg(U.Tb) - hFg(U.Tamb)) -
        (av[0] / 3.6) * (hAir(tPa) - hAir(U.Tamb)) -
        (av[1] / 3.6) * (hAir(tSa) - hAir(U.Tamb)),
      Cb = Math.max(0, isFinite(U.bedI) ? U.bedI : AN_BI.tCold) * 1000 * B.cpS;
    /* 3.2.4 (JENNIE): the limestone in the bed (U.lmQ T/H, boiler.js). Thermochemistry from the standard heats of formation (NIST:
       CaCO3 -1207.6, CaO -634.9, CO2 -393.5, SO2 -296.8, CaSO4 -1434.5 kJ/mol):
       - calcination CaCO3 -> CaO + CO2 takes 179.2 kJ/mol = 1790 kJ/kg CaCO3 (93.66 % CaCO3, FHI P2S7 Tab 3 page 2);
       - sulphation CaO + SO2 + 1/2 O2 -> CaSO4 gives 502.8 kJ/mol = 15,680 kJ/kg of S captured; the S of the coal that burns
         (1.49 %, Tab 2) times the capture 1 - U.soxF (anSoxStep). The coal heating value counts S to SO2 only;
       - the stone heated from the room to the bed: cp 1.0 kJ/kg K, NO-SOURCE (mean of calcite 25 - 850 C, NIST-JANAF ~ 0.9 - 1.1).
       At MCR (12 T/H, 89 T/H coal, 200 ppm) that is 5.6 MW + 2.8 MW taken, 5.1 MW given: ~ 3.3 MW net out of the bed, 0.9 % of the fuel
       heat. Before: no limestone term. */
    const qLm = (() => {
      const m = Math.max(0, U.lmQ || 0) / 3.6,
        cap = isFinite(U.soxF) ? Math.max(0, 1 - U.soxF) : 0;
      return m * 0.9366 * 1790 + m * 1.0 * Math.max(0, U.Tb - U.Tamb) - ((Fb * 0.0149) / 3.6) * cap * 15680;
    })();
    U.qLm = qLm;
    /* the water wall leak boils in the bed: saturated water at the drum (anHxHw) to steam at the bed (IF97, near the furnace pressure) */
    const qTl = U.tlW > 0 ? (U.tlW / 3.6) * Math.max(0, steamH(0, U.Tb) - anHxHw(ts)) : 0;
    U.qTl = qTl;
    /* the suspension gives qWu + qPan = Cs (Tb - tgF) on its way up; of it the gas share gcp (Tb - tgF) is the gas cooling from the bed to
       the exit, already in qAirG (the gas heated to Tb): the bed pays the solids share only, and the gas leaves at tgF (beta.256) */
    /* 1.0.0-beta.366 (JENNIE, D31): the terms of this balance, kW and kJ/K, for the energy check of tests/regress/bed_heatup.js */
    U.bbQ = { fuel: qFuel, lm: qLm, tl: qTl, airG: qAirG, sus: qWu + qPan - gcp * (U.Tb - sus.tgF), br: qBR, Cb };
    U.Tb = Math.max(U.Tamb, U.Tb + ((qFuel - qLm - qTl - qAirG - (qWu + qPan - gcp * (U.Tb - sus.tgF)) - qBR) * dt) / Cb);
    U.Trf = Trf + ((qBR - qRW) * dt) / B.mRef;
    /* the furnace exit gas and the mean of the upper furnace (the panels of hx.js take Tu): the suspension above */
    U.tgF = sus.tgF;
    U.Tu = sus.Tu;
    U.gcp = gcp;
    /* 1.0.0-beta.14 (JENNIE, live test F-t): only the water wall leak leaves the furnace with the gas. The economizer leak enters the
       gas at the No.1 economizer (hx.js, I.mL), after the superheaters and reheaters: adding it here sent its mass through the SH / RH
       banks at the furnace exit temperature and the hot reheat went HIGH-HIGH (live run S87, 75 MW, 63 T/H leak) */
    U.mG = (av[0] + av[1] + av[2]) / 3.6 + fg + (U.tlW || 0) / 3.6 /* flue gas kg/s, to the backpass (hx.js), with a water wall leak */;
    U.phi = phi;
    /* water walls, T/H of steam-equivalent (the unit of Cw / C): both ways, a bed under the water cools it. The air cooling of the
       unfired boiler (kcool) is inside this balance now; the loss to the room (kamb) stays */
    const qW = qSol / B.kW,
      qL = U.kamb * Math.max(0, (U.Tw - U.Tamb) / 300);
    U.qW = qW;
    /* beta.258: boiling, one T/H of steam made takes the heat from the water of the economizer outlet to saturated vapour (kWe kW per
       T/H; hx.js gives the economizer outlet), not the 554 kW of the old lump that carried the superheat too. The storage of the water
       and the steel (Cw, in units of 554 kW) and the room loss go by 554 / kWe. The drum gives the steam leaving the boiler less the
       spray water that joins it in the superheater (FT-FW1109 / 1119) */
    const hg = anHxHs(U.Pd, ts),
      he = isFinite(U.hxHe) ? Math.min(U.hxHe, hg - 1) : anHxHw(Math.min(ts, isFinite(U.hpT2) ? U.hpT2 : ts)),
      kWe = Math.max(100, (hg - he) / 3.6),
      r = B.kW / kWe,
      mDr = Math.max(0, U.ms + U.mb + (U.msb || 0) + (U.msv || 0) - (U.w1s || 0) - (U.w2s || 0)) + ((U.tlW || 0) * Math.max(0, anHxHw(ts) - he)) / Math.max(1, hg - he) /* a water wall leak: its water, replaced by feedwater, is heated to saturation */;
    U.kWe = kWe;
    if (U.Tw < ts - 0.01) {
      U.Qs = 0;
      U.Tw = Math.max(U.Tamb, Math.min(ts, U.Tw + ((qW - qL) * dt) / U.Cw));
      U.Pd = Math.max(0, U.Pd - (mDr * dt) / AN_STORE.cs);
    } else {
      U.Qs = Math.max(0, qSol / kWe); /* the steam made, T/H */
      U.Pd = Math.max(0, U.Pd + ((qSol / kWe - qL * r - mDr) * dt) / (AN_STORE.cs + U.Cw * r * steamDTsat(U.Pd)));
      U.Tw = tsatOf(U.Pd);
    }
  }
  /* 3.2.0-beta.23: the furnace and cyclone thermocouples (TIFG1090 / 1091 lower layer under / above, TIFG1095 / 1096 cyclone,
     TIFG1009 furnace) follow the bed: ambient + (snapshot - ambient) x bed rise / anchor bed rise. Before, they kept the 150 MW
     snapshot (933 C) in Cold: ABC-027 SI0122 > 700 C = M.2504 "ADEQUATE FOR COAL FIRING (PURGE BY-PASS)" was 1 on a cold boiler,
     DITL-02 completed the purge by itself and reset the MFT before the operator could press FURNACE PURGE START */
  /* 3.2.3-beta.273 (live run beta.272: the 150 MW start showed bed 881 C on the overview and TIFG1090 / 1091 HIGH-HIGH 980 C on every
     thermocouple): the anchor of the thermocouples is the bed the snapshot thermocouples read (the average of the eighteen lower layer
     TT-FG1090 / 1091 A ~ I, 937 C), not the model anchor Tb0 850 C. Their average is now the bed temperature U.Tb, each with its own
     snapshot spread; one bed for the overview, the logic (ABC-026 alarms 950 / 980 / 820) and the pages */
  const tbA = (() => { const a0 = anGasA0(); return isFinite(a0.u) && isFinite(a0.l) ? (a0.u + a0.l) / 2 : U.Tb0; })();
  if (U.tbed && U.tbed.length) {
    const k = Math.max(0, (U.Tb - U.Tamb) / Math.max(1, tbA - U.Tamb));
    for (const L of U.tbed) anUnitWrite(L, i => U.Tamb + (L.a0[i] - U.Tamb) * k);
  }
  /* 3.2.3-beta.212 (live Cold sweep F16: AIR AND FLUE GAS page '-----' for the furnace, cyclone outlet and seal pot temperatures with
     the bed at 220 C): the cyclone outlet TT-FG1095-A / B (I/O list 1|AI0660 / 0661) and the seal pots TT-FG1009-A / B (1|AI0594 /
     0662) are read by no sheet of the logic, so the line above never reached them. They are the same solids loop as the bed (the gas
     and the circulating ash leave the furnace through the cyclone and come back through the seal pot): the same rule as the bed
     thermocouples, each on its own snapshot value (hmi-op.js AN_HMI_AI). U.gFu / U.gFl = the average of the nine lower layer above /
     under thermocouples TT-FG1091-A ~ I / TT-FG1090-A ~ I the page shows as one value. Numbers only on U (SAVE keeps U as JSON) */
  {
    const k = Math.max(0, (U.Tb - U.Tamb) / Math.max(1, tbA - U.Tamb)),
      a0 = anGasA0(),
      t = x => (isFinite(x) ? U.Tamb + (x - U.Tamb) * k : NaN);
    U.gFu = t(a0.u);
    U.gFl = t(a0.l);
    U.gCy = a0.cy.map(t);
    U.gSp = a0.sp.map(t);
  }
  /* 3.2.1 (LISA, Mina Normal shutdown on beta.115: PIFA1085 LOW-LOW at 65 MW, SA 160 T/H): the SA pressures are the bed back pressure at
     the SA ports plus the duct / air preheater / nozzle drop. Before, all of it went with the square of the SA flow (805 mmH2O at 160 T/H).
     Split 600 / 827 of the 1427 anchor from the SAF start procedure ("SAF pressure above 1200 mmH2O with bed, above 600 mmH2O without bed",
     SU 4954-5090): 600 = the bed back pressure at the anchor bed DP (DPIFG1081 1426 mmH2O, 7.PNG), read from the bed model (U.bedK = bed DP
     / 1426, read only); the rest with the square of the SA flow. PIFA1088 the same with its own anchor (1273). The SA port dampers that
     ABC-057 closes with load (S3-LN1 ~ 22) are not in it: damper characteristic NO-SOURCE */
  if (U.saP && U.saP.length && U.sa0 > 0) {
    const r = Math.max(0, +U.tafS.rt.v[U.saN] || 0) / U.sa0,
      bk = 600 * Math.max(0, isFinite(U.bedK) ? U.bedK : 1);
    for (const L of U.saP) anUnitWrite(L, i => bk + Math.max(0, L.a0[i] - 600) * r * r);
  }
  if (U.idfS && U.idfS.length) {
    const on = !U.idf || +U.idf.S.rt.v[U.idf.n] > 0.5,
      m = U.idfV ? Math.max(0, Math.min(100, +U.idfV.S.rt.v[U.idfV.n] || 0)) : 0;
    anUnitWrite(U.idfS, () => (on ? anIdfN(m) : 0));
  }
  const Pms = Math.max(0, U.Pd - U.kdp * U.ms * U.ms);
  U.Pms = Pms; /* 3.2.0-beta.14: source of the reducing stations (source.js) */
  /* generator: the shaft work of the steam path less the mechanical and generator losses (anTbGen, turbine.js); qip = the reheat
     pressure x the ICV opening, = the HP steam when the bypass is shut and the ICV full open; 0 off the grid */
  /* 3.2.3-beta.240 (user 2026-11-14, reverse power): on the grid the MW is not held at 0 or above. With too little steam the generator
     takes power from the grid to keep the shaft at 3600 rpm (motoring): the losses of anTbGen stay when the steam is gone. The 32 relay
     (anRp32) sees the negative power */
  /* Phase 11 C (RIN): the steam the IP turbine takes from the reheater (T/H) = its Stodola swallowing capacity at the reheater pressure
     (the IP / LP blading of turbine.js from the condenser up: m = Kip sqrt(Prh^2 - Pc^2), Kip read off the last pass of the steam path,
     at the start the design point HB case 1 400944 kg/h at 34.77 ata), x the ICV opening, x the CRV test of tcs.js (TCE226 / 227: one
     RSV / ICV side shut). Before: m0 x rr (main steam anchor x reheater pressure share), which gave the IP the whole main steam flow */
  const tbPc = isFinite(U.cdP) ? U.cdP : 1.0332,
    tbPr = Math.max(0, U.rr * (U.rhp.length && U.rhp[0].a0.length && U.rhp[0].a0[0] > 0 ? U.rhp[0].a0[0] : 34)) + 1.0332,
    tbK =
      U.tbS && U.tbS.f.ip1 > 1000 && U.tbS.P.hrh > tbPc * 1.01
        ? U.tbS.f.ip1 / 1000 / Math.sqrt(U.tbS.P.hrh * U.tbS.P.hrh - tbPc * tbPc)
        : AN_TB.c1.hrh / 1000 / Math.sqrt(AN_TB.c1.Phr * AN_TB.c1.Phr - AN_TB.c1.Pc * AN_TB.c1.Pc),
    qip = tbK * Math.sqrt(Math.max(0, tbPr * tbPr - tbPc * tbPc)) * tb.icv * tcsVtIcvF(U);
  /* Phase 11 C (RIN): the steam path of the turbine by physics (turbine.js tbPath: Stodola stage pressures, IF97 expansion of each
     group, the design geometry of HB PPE-14-0725 R1 case 1 / VWO only). In: the steam through the CVs (U.ms) at the turbine inlet
     pressure and the main steam temperature, the steam through the ICVs (qip) at the reheat temperature, the condenser pressure
     (U.cdP, ata) and the steam the heaters draw (tbDraws). The vacuum and the heaters out of service are in the expansion itself (the
     exhaust pressure, the extraction left in the turbine), so the old corrections anVacMW and U.dMWx are no longer added: one path */
  U.tbS = tbPath(
    {
      ms: U.ms,
      Pin: Math.max(0, Pms - U.kln * U.ms * U.ms) + 1.0332,
      Tms: U.hxO && U.hxO.ms,
      qip,
      Thr: U.hxO && U.hxO.rh,
      Pc: isFinite(U.cdP) ? U.cdP : 1.0332,
      hpb: U.mhp || 0,
      w: tbDraws(U, U.ms)
    },
    U.tbS
  );
  anTbPorts(U, tb.rpm, U.mhp);
  /* 3.2.4-beta.11: the shaft power on the swing equation (U.Pm): the HP and IP / LP parts of the steam path, each behind its steam
     volume (tSc, tXo above; exact first order for the step dt), so the steam left behind the closed valves still drives the shaft.
     Before, Pm fell with the valves at once and a load rejection from 150 MW peaked at 102.2 % (TG manual STIE-14752: about 106 % within
     about 1 s) */
  {
    const hp = onGrid ? Math.max(0, U.tbS.Whp) : 0,
      ip = onGrid ? Math.max(0, U.tbS.Wip) : 0,
      f = T => 1 - Math.exp(-dt / Math.max(0.01, T));
    tb.pH = isFinite(tb.pH) ? tb.pH + (hp - tb.pH) * f(U.tSc || 0.3) : hp;
    tb.pI = isFinite(tb.pI) ? tb.pI + (ip - tb.pI) * f(U.tXo || 0.5) : ip;
    /* Phase 11 (RIN / YUI): the shaft side of the swing equation = the blade work less the mechanical loss of the turbine (AN_TB.mech,
       turbine.js); the generator losses are on the electrical side (anGenW) */
    U.Pm = onGrid ? tb.pH + tb.pI - AN_TB.mech : 0;
  }
  U.MW = anGenW(U, onGrid, trip, D);
  anRp32(U, onGrid && !trip, dt);
  anTbSpeed(U, tb, dt, onGrid && !trip && tb.xfer, U.Pm, D);
  U.rpm = tb.rpm;
  U.icvp = 100 * tb.icv;
  if (U.vpos === undefined || (U.vpos && !U.vpos.icvA)) U.vpos = anVposOf(); /* a save point from before 3.2.3-beta.244 / the A, B split */
  if (U.vpos) {
    /* T/G Modbus valve positions (U.vpos above): CV = the governor valve lift U.gv (0 ~ 100 %), ICV = tb.icv; a tripped or stopped
       machine has its valves shut */
    const run = tb.st !== 'off',
      cvp = s => (run ? Math.max(0, Math.min(100, 100 * tcsVtCv(U, s))) : 0),
      icp = Math.max(0, Math.min(100, 100 * (+tb.icv || 0)));
    for (const l of U.vpos.cvA) dirt(l, cvp('A'));
    for (const l of U.vpos.cvB) dirt(l, cvp('B'));
    for (const l of U.vpos.icvA) dirt(l, icp * tcsVtIcvS(U, 'A'));
    for (const l of U.vpos.icvB) dirt(l, icp * tcsVtIcvS(U, 'B'));
  }
  U.tbn ={ off: 0, roll: 1, sync: 2, load: 3 }[tb.st];
  /* the TCS inputs of the DCS, one plant model: 3.2.5-beta.8 (live 75 MW run from a restart of "At 150 MW"): written only in a start-up
     (U.cold), a plant started at 150 MW (U.cold false, kept by its save points and by a restart after a trip) never wrote DCS CONTROL MODE
     PERMISSIVE I.0081 nor TRANSFER COMPLETE again: the turbine master could not go AUTO after the restart. The model writes them always */
  {
    dirt(U.di.xfer, tb.xfer ? 1 : 0);
    /* TCE p.127 TCE180: permissive = NOT (52G not closed, TURBINE TRIP, FORCED CLOSE by HOUSE LOAD OPERATION, IP START before the
       TRANSFER REGION COMPLETE(IP)); the reset group also resets DCS CONTROL MODE ON */
    /* LMYP OTS: + GOV. MANUAL and LLM MANUAL of the TCS CRT (TCE180 reset group, tcs.js tcsGovCmd) */
    tb.perm = onGrid && !trip && !(U.tc && U.tc.trip) && tb.xfer && !(U.el && U.el.l52 === false) && !tb.govMan && !tb.llmMan;
    dirt(U.di.perm, tb.perm ? 1 : 0);
    if (U.di.onCmd >= 0 && +v[U.di.onCmd] > 0.5 && tb.perm) dirt(U.di.on, 1);
    if ((U.di.offCmd >= 0 && +v[U.di.offCmd] > 0.5) || !tb.perm) dirt(U.di.on, 0);
  }
  /* AI0534 turbine speed: the TCS output TCE970-6 (TCE610); before the program runs, the shaft */
  if (U.spd && U.spd.length) anUnitWrite(U.spd, tcsHw(U, 'TCE970-6') ?? tb.rpm);
  U.t += dt;
  /* transmitters */
  anUnitWrite(U.msp, Pms);
  /* live Cold start sweep (user 2026-11-13): written as exactly 0 the SELECT CIRCUIT of ABC-050 took PT-MS1006-1 / -2 as lost and held
     122.0 kg/cm2 on the HP bypass PV with the main steam at 0. A live transmitter at 0 kg/cm2 is a healthy 4 mA signal: not exactly 0 */
  for (const l of U.tin) anUnitWrite(l, Math.max(1e-3, Pms - U.kln * U.ms * U.ms));
  anUnitWrite(U.drum, U.Pd);
  /* 1.0.0-beta.370 (JENNIE, Rosé: Warm / Hot saves, EIC-TM PV 151 MW at 0 MW): the generator MW transmitters GCPAI1001 / 1002 at 0 MW are a live
     4 mA signal, written a hair above 0 as the turbine inlet pressure above; exactly 0 made the AVERAGE SELECT of ABC-001C hold the 151 MW of the trip */
  for (const l of U.mw) anUnitWrite(l, Math.max(1e-3, U.MW));
  anUnitWrite(U.tgt, U.tcsT);
  /* main steam flow: the RAW transmitter, so that the compensation of the drawing (SQRT(LN31(p) x LN32(T) x raw)) gives U.ms: the
     compensated flow is proportional to the raw value at a given pressure and temperature (SQRT block: out = in, in units of
     flow), so raw = U.ms x raw / compensated of the last scan */
  /* 2.2.0-beta.12: FT-MS1031 is at the boiler outlet: it sees the steam to the turbine AND to the HP bypass / blow-off (U.mb) */
  const mso = U.ms + U.mb,
    raw = anUnitVal(U.msf),
    cmp = +v[U.cn];
  if (isFinite(raw) && raw > 0 && isFinite(cmp) && cmp > 1) anUnitWrite(U.msf, (mso * raw) / cmp);
  else anUnitWrite(U.msf, mso);
  /* ---- 2.2.0-beta.11 (M2 steps 1 ~ 3) ---- */
  const scaled = (L, r) => anUnitWrite(L, i => L.a0[i] * r),
    shifted = (L, d) => anUnitWrite(L, i => L.a0[i] + d);
  /* reheat pressure: proportional to the steam through the IP / LP turbine = turbine steam + HP bypass, less what the LP bypass
     takes (its size lpb x the anchor flow at the anchor pressure); first stage pressure: proportional to the turbine steam */
  const qLp = qOn(U.qo && U.qo.lp),
    olp = anVlvStroke(U, 'lpb', qLp ? 100 : U.lpv ? Math.max(0, Math.min(100, +U.lpv.S.rt.v[U.lpv.n] || 0)) : 0, qLp, dt);
  /* 3.2.3-beta.239: one mass balance of the reheater at every load (was: this balance until the ICV to CV transfer, then a steady
     state law (ms + mhp) / (m0 (1 + LP bypass)) with a 10 s lag that took the reheater pressure from 19 to 5.7 kg/cm2 at the transfer
     while the ICV was thrown open). In = HP turbine exhaust (the CV steam U.ms) + HP bypass; out = ICV (qip) + LP bypass + RH blow-off.
     Its steady state is the old law with the ICV full open: the 150 MW point does not move */
  {
    /* 2.2.0-beta.16 (M4 step 3): turbine shut (no IP / LP turbine flow): the hot reheat pressure is the steam stored in the
       reheater: in = HP bypass (U.mhp), out = LP bypass + RH blow-off, each = size x anchor flow x opening x pressure / anchor
       pressure (as the outlets of the main steam line). 2.2.0-beta.17: + the ICV flow (roll steam, initial load) until the transfer */
    const Prh0 = U.rhp.length && U.rhp[0].a0.length && U.rhp[0].a0[0] > 0 ? U.rhp[0].a0[0] : 34,
      orb = U.rhbv ? Math.max(0, Math.min(100, +U.rhbv.S.rt.v[U.rhbv.n] || 0)) : 0,
      /* Phase 11 rank 9: the LP bypass PCV-HR1010 by the valve law of its vendor Cv (turbine.js anVlvW): hot reheat (this pressure,
         the reheater outlet temperature) to the condenser; the RH blow-off MV-HR1391 at its silencer rating (AN_VLV.rhbT) */
      qlp = anVlvW(AN_VLV.lpb, olp, U.rr * Prh0 + 1.0332, U.hxO && isFinite(U.hxO.rh) ? U.hxO.rh : steamTsat(U.rr * Prh0), isFinite(U.cdP) ? U.cdP : 1.0332),
      qout = qlp + (AN_VLV.rhbT * U.rr * orb) / 100 + qip + (U.msvR = anSvFlow(U, AN_SV.r, U.rr * Prh0)); /* 3.2.4-beta.1 RH safety valves */
    U.qlp = qlp;
    /* in: the HP exhaust to the reheater (turbine.js tbPath f.rh: HP blade flow less the HP exhaust glands and the No.6 extraction) + the
       HP bypass; before: the whole main steam U.ms + U.mhp */
    U.rr = Math.max(0, U.rr + ((U.tbS.f.rh / 1000 - qout) * dt) / (AN_VLV.Crh * Prh0));
  }
  /* live Cold start F12 (user 2026-11-13 "may steam naba sa reheat line?"): an empty reheater reads 0 kg/cm2 on PT-HR1003-1 / -2, a live
     4 mA signal. Written as exactly 0 the SELECT CIRCUIT of ABC-052 (SI0180) took both as lost and held its last value 0.6 kg/cm2 on
     the hot reheat pressure. Not exactly 0, as the first stage pressure below */
  for (const L of U.rhp) scaled(L, Math.max(1e-3, U.rr));
  /* 3.2.0-beta.14 (source.js): hot reheat pressure and LP bypass flow, the source of the LP bypass desuperheater */
  {
    const Prh0 = U.rhp.length && U.rhp[0].a0.length && U.rhp[0].a0[0] > 0 ? U.rhp[0].a0[0] : 34;
    U.Prh = U.rr * Prh0;
    /* Audit 3 (blank HMI values): PT-HR1011 (STN102 AI0531, "LP turbine bypass outlet pressure", 0 ~ 50 kg/cm2) sits after the LP
       bypass desuperheater, ahead of the condenser energy damper (point 5 of PPE-14-0728 p2). The ten cases of that sheet give
       P5 = 0.0538 ata per T/H of F5 (11.7 / 216.9, 3.2 / 59.9, 1.8 / 33.2, 13.3 / 247.2: a choked damper, pressure in line with flow),
       and F5 = 1.263 x the steam F4 (spray from the CP outlet, 216949 / 171756). Gauge = ata - 1.033; shut, the line is at condenser
       vacuum and the 0 ~ 50 transmitter reads 0 (snapshot 0.0 at 150 MW) */
    U.Plpo = Math.max(0, 0.0538 * 1.263 * U.qlp - 1.033);
    /* Phase 11 rank 9b (RIN, for MEI's spray TCV-CD1115): the PCV-HR1010 BODY outlet, where the spray nozzle No. 84 of the DSCV injects
       (K1AU3-D1-0-043 R0 p9): the sheet P2 4.0 / 2.02 / 0.58 kg/cm2a at 217.1 / 111.8 / 33.2 T/H outlet flow = 0.0184 ata per T/H
       (cond 1; the line after it is choked, pressure in line with flow, as PT-HR1011 above), never below the condenser. ata (abs).
       The outlet flow = the steam x 217102 / 171756 (the spray of cond 1). DESIGN-SRC: vendor sheet K1AU3-D1-0-043 R0 p9 */
    U.Pvlo = Math.max(isFinite(U.cdP) ? U.cdP : 1.0332, (4.0 / 217.102) * U.qlp * (217102 / 171756));
  }
  /* PT-ST1002-1 / -2 / -3 (after reheat valve A, the IP turbine inlet): the IP turbine passes steam in line with its inlet pressure
     (Stodola, the same law as qip above), so the absolute pressure = 150 MW value x qip / m0. 150 MW anchor: PIST10021 / 2 / 3 =
     33.0 / 33.2 / 33.2 kg/cm2 g (OPERATING_POINTS), mean 33.13 g = 34.16 ata. ICV shut or the turbine off: 0 */
  U.Pip = Math.max(0, (34.16 * qip) / Math.max(1, U.m0) - 1.033);
  /* 2.2.0-beta.17: not exactly 0 while the HP valves are shut: the SELECT CIRCUIT of ABC-052 (SI0181) reads 0 as a lost transmitter
     (SIG.AB) and would hold the 150 MW value, so the LP bypass REMOTE set point (LN12 of the first stage + 5.1) would stay at 30.9 */
  for (const L of U.pist) scaled(L, Math.max(1e-3, U.ms / U.m0));
  /* 3.2.3-beta.258 (user 2026-11-15 "isang unit lng naman yan.. isang dcs.. isang planta"): THE STEAM TEMPERATURES, ONE MODEL. Gas, tube
     metal and steam of every bank (hx.js anHxStep) at every load and state: the spray outlets TICBR1130 / TICBR1150, the SH no.2 outlet
     TT-BR1140, the main steam TT-MS1004 and the reheat TT-HR1002 come from the heat they get and the spray water they take. Removed:
     the curves of the old load path (sprayCurve, natSH / natRH, suCurve, slopeSH / RH, the lag tauQ and the firing ratio), which were
     design and trend curves, and the two-lump SH / RH metal of the Cold path */
  const tsat = tsatOf(U.Pd);
  const H = anHxRun(U, dt, tsat);
  for (const e of U.ld) {
    const pr = e.pr;
    pr.ld = 0;
    pr.nsat = 0;
    pr.fr = pr.tsat = pr.tcap = undefined;
    pr.hx = e.r === 'sh1' ? H.d1 : e.r === 'up' ? H.d2 : U.TpR;
  }
  /* the headers: SH no.2 outlet TT-BR1140-1 / -2 and the finishing SH outlet TT-MS1004-1 / -2 (PV of TICBR1140 / TICMS1004) */
  for (const h of U.sh) {
    const T = h.r === 'sh2' ? H.s2 : H.ms;
    if (!isFinite(T)) continue;
    h.x = T;
    for (const L of h.L) anUnitWrite(L, T);
  }
  /* O2 of the flue gas: 21 x (1 - stoichiometric air / total air), analyzer lag. Both analyzers read it: FHI gives one curve (Fig 7) and
     the 6.4 / 2.2 % of one snapshot has no source, it stood the B side on LOW-LOW at 150 MW */
  if (U.afs > 0) {
    const taf = Math.max(0, U.taf.reduce((a, n) => a + (+U.tafS.rt.v[n] || 0), 0) - (U.aphLk || 0) * (typeof AN_APK !== 'undefined' ? AN_APK.pa + AN_APK.sa : 0)) /* beta.21: less the air heater seal leak, which joins after the analyzer */,
      o2a = Math.max(0, Math.min(21, 21 * (1 - ((Fe - Fb * (1 - (U.coalR || 1))) * U.afs) / Math.max(1, taf)))),
      /* 3.2.4 (JENNIE): the analyzers sit at the air heater gas inlet (plant service reports "AT-FG3122 / 3123 GAH INLET O2
         ANALYZER", unit 3 of the same design) and read the gas as it is, wet (the stack design O2 of K1AU3-E2-0-005 sheet 2 is
         "4.22 % Vol, wet base"). A tube leak (water wall U.tlW, economizer U.tlE) adds steam that brings no oxygen: the same O2 in
         more moles, O2 x n / (n + leak). Moles of the gas: the air, 28.9 kg/kmol; the leak, 18. The air does not change */
      nA = taf / 28.9,
      nL = ((U.tlW || 0) + (U.tlE || 0)) / 18,
      o2s = nA > 0 ? (o2a * nA) / (nA + nL) : o2a;
    /* audit 2026-11-21 B1: the air needed over the air given (above 1 = short of air: the stack CO of boiler.js anAphStep) */
    U.airR = taf > 1 ? ((Fe - Fb * (1 - (U.coalR || 1))) * U.afs) / taf : 0;
    U.o2v += ((o2s - U.o2v) * dt) / U.tauO2;
    for (const L of U.o2) anUnitWrite(L, U.o2v);
  }
  /* bed inventory and the furnace pressure drop */
  if (U.paNet >= 0) {
    /* only a running cooler takes ash out (DITL-21A and its instances); 16.PNG: all four stopped at 150 MW */
    const rpm = (U.bedSc || []).reduce(
        (a, o, i) =>
          a +
          (typeof anDitlRun === 'function' &&
          anDitlRun(['DITL-21A', 'DITL-21A #B', 'DITL-21A #C', 'DITL-21A #D'][i]) === 1
            ? Math.max(0, Math.min(5, +o.S.rt.v[o.n] || 0))
            : 0),
        0
      ),
      k = anBedStep(
        U,
        dt,
        rpm,
        Math.max(0, +U.tafS.rt.v[U.paNet]),
        U.taf && U.taf.length === 3 ? Math.max(0, +U.tafS.rt.v[U.taf[2]]) : null
      );
    for (const [L, a] of U.bedDp || []) if (L.length) anUnitWrite(L, a * k);
    /* 3.2.4-beta.16 (user "Physics nga"): the split of the bed DP. Plenum / upper (DPT-FG1081 / 1082, above) = the weight of all the
       solids in the furnace. Of them, the upper furnace holds the solids the gas lifts: its density is the share phi of the bed balance
       (the same suspension that carries the heat to the walls, AN_BB.nU), so lower / upper (DPT-FG1083 / 1183) = its anchor x phi, and
       plenum / lower (DPT-FG1084 / 1184) loses what is lifted. Anchors: the HMI snapshot 1016 / 1014 and 70 / 41 mmH2O (hmi-op.js).
       More gas (load up, more air, a tube leak's steam) lifts more: the upper DP rises, the bed DP falls, the total stays. Not on any
       DCS logic sheet (display only): U.dpLo / U.dpUp, read by the HMI page (hmi2.js) */
    {
      const kq = U.bedK > 0 && U.bedI > 0 ? k / (U.bedI / AN_BI.t0) : 0,
        fr = U.bedI / AN_BI.t0,
        ph = isFinite(U.phi) ? U.phi : fr;
      U.dpUp = [70, 41].map(a => a * kq * ph);
      U.dpLo = [[1016, 70], [1014, 41]].map(([b, a]) => Math.max(0, b * k - a * kq * (ph - fr)));
    }
  }
  /* PA to the furnace follows the PAF flow */
  if (U.paNet >= 0 && U.pa.length) anUnitWrite(U.pa, Math.max(0, +U.tafS.rt.v[U.paNet]) * AN_PA_FURN);
  /* ---- 2.2.0-beta.15 (M4 step 2): the start-up feedwater valve adds to the feedwater flow ---- */
  if (U.suv && U.fwp && U.fwp.pr) {
    const o = Math.max(0, Math.min(100, anAv('LICBR1001B', +U.suv.S.rt.v[U.suv.n] || 0)));
    U.fwp.pr.op = anSuFw(o, U.Pd, U.fwPd);
  }
  /* 3.2.4-beta.6: the main feedwater valve FCV-FW1130-1 by its Cv and dP (anMainFw); the PV of FICFW1007 shows it up to the top of
     its range, the drum gets all of it (plant.js, the drum balance). pr.mul: the pumps that give water (0 = none) */
  /* a save point (and the st150 of the build) from before beta.6 has no U.fwv: the state load deletes the keys it does not carry
     (state.js anStateInto), so the valve is found again here */
  if (!U.fwv) U.fwv = anCtlOutOf('ABC-010', 'FICFW1007');
  if (U.fwv && U.fwp && U.fwp.pr && isFinite(U.fwPd)) {
    const pr = U.fwp.pr,
      o = Math.max(0, Math.min(100, anAv('FICFW1007', +U.fwv.S.rt.v[U.fwv.n] || 0))),
      m = pr.mul == null ? 1 : pr.mul;
    /* the pump and the valve on one flow: the BFWP discharge falls along the KSB curve as the flow rises, so the flow is where the
       valve law and the pump curve meet (anFwPdAt, bisection) and not the valve at the head of the last step */
    const su = pr.op || 0,
      sp = (U.w1s || 0) + (U.w2s || 0) /* beta.374: the pumps also give the SH spray (PD-017) */,
      g = w => anMainFw(o, U.Pd, anFwPdAt(U, w + su + sp)) - w;
    let lo = 0,
      hi = 1500;
    if (g(0) <= 0) hi = 0;
    else for (let i = 0; i < 40; i++) g((lo + hi) / 2) > 0 ? (lo = (lo + hi) / 2) : (hi = (lo + hi) / 2);
    U.fwMain = (lo + hi) / 2;
    pr.hx = m * (U.fwMain + (pr.op || 0) + sp); /* FE-FW1007: the valves plus the SH spray tapped after it (beta.374) */
  }
  /* ---- 2.2.0-beta.12 (M3): machines stopped, furnace pressure ---- */
  for (const m of U.mul || []) {
    /* 3.2.0 P1 #4: a feedwater pump gives water only through its discharge MOV (MV-FW1001 / 1002) or the bypass MOV of it
       (MV-FW1391 / 1392, the filling line: ASSUMED 30 % of the flow), positions of the DITL-38 valves while the one world runs */
    const run = !m.run.length
      ? 1
      : Math.min(
          1,
          m.run.reduce((a, r, i) => {
            if (!(+r.S.rt.v[r.n] > 0.5)) return a;
            if (m.drw && anDitlRun(m.drw[i]) === 0) return a;
            /* 3.2.1 (IRENE): no water through a BFWP whose suction manual valve is closed (V-FW1001 / 1002) */
            if (m.drw && anFv(['V-FW1001', 'V-FW1002'][i]) < 5) return a;
            const d = m.dis && m.dis[i];
            if (!d) return a + 1;
            const pm = anDitlPos(d[0], 0),
              pb = anDitlPos(d[1], 0);
            return a + (pm == null || pb == null ? 1 : Math.min(1, pm / 100 + (0.3 * pb) / 100));
          }, 0)
        );
    for (const p of m.pr) p.mul = run;
  }
  if (U.fp && U.fp.length) {
    if (U.kfpA == null)
      for (const p of U.fp) {
        const pr = p.pr,
          pp = p.b.p || {};
        if (pr.hop && pr.Ka > 0) {
          U.kfpA = (pr.Ka * Math.max(0, pr.hop.mv - (pp.lo == null ? 0 : pp.lo)) * (pp.span > 0 ? pp.span : 100)) / 100;
          break;
        }
      }
    const idf = !U.idf || +U.idf.S.rt.v[U.idf.n] > 0.5,
      taf = U.taf.reduce((a, n) => a + (+U.tafS.rt.v[n] || 0), 0),
      ld = U.taf0 > 0 ? (U.kfpA > 0 ? U.kfpA : U.kfp) * ((taf + (((U.tlW || 0) + (U.tlE || 0)) * 28.9) / 18) / U.taf0 - 1) : 0;
    /* 3.2.0-beta.19 (VIEW / TRACE audit, Cold): no ID fan and no air = the furnace open to the stack, 0 mmH2O. Before, a cold plant
       read about +200 mmH2O (the loop model with the ID fan taking nothing out and the air term). With air and no ID fan the
       pressure still rises (as before); with the ID fan running the model is unchanged. */
    const nair = !idf && U.taf0 > 0 ? Math.min(1, taf / (0.1 * U.taf0)) : null;
    for (const p of U.fp) {
      /* an air heater plugged on the gas side (boiler.js AN_APL): the fan moves less gas at the same opening */
      p.pr.uf = idf ? 1 / Math.sqrt(1 + (AN_APL.dp * (U.aphPl || 0)) / 442) : 0;
      p.pr.ld = ld;
      if (!p.pr.src) {
        p.pr.smul = nair == null ? undefined : nair;
        p.pr.sbase = nair == null ? undefined : 0;
      }
      /* the open furnace empties in seconds, not with the time constant of the draft loop (65 s) */
      const q = nair != null && nair < 1 && U.idf && U.idf.S.rt.pm ? U.idf.S.rt.pm[p.b.id] : null;
      if (q && isFinite(q.y)) q.y -= (1 - nair) * q.y * (1 - Math.exp(-dt / 5));
      /* 3.2.0-beta.51 (#99) / live check #105 #107 (PR-OPE-5002 IDF / PAF START-UP: "Hydraulic Coupling Furnace Pressure Control at
         13 %", "Adjust manually (commonly reduce) ... maintaining -15 mmH2O", "Once the Hydraulic Coupling is at 16 % MV and Furnace
         Pressure is Stable at around -15 mmH2O, set the HC Control in AUTO"): the cold furnace (no fire) is a gas path, the ID fan
         suction against the loss of the air pushed through it: fp = -A * speed^2 + Kq * (total air / 406 T/H)^2, speed of the fan
         manual (350 ~ 1140 rpm on the coupling, linear ASSUMED). A = 124: the IDF alone at 13 % = about -19.5 mmH2O (the operator
         reduces it, SOP); Kq: the purge air of the SOP (PA 180 + SA 200 + FA 26 = 406 T/H) at 16 % = -15 mmH2O. As the bed heats
         (100 ~ 300 C) the loop model of the hot plant (anchored at 150 MW) takes over. Before: the cold model was blended out at 10 %
         of the design air, and the loop model wanted 27 % at 348 T/H */
      const tb = isFinite(+U.Tb) ? +U.Tb : 30,
        /* Jennie beta.192 (headless Hot restart, beta.191: the ID fan at 13 % before any air read -172 mmH2O for 4 minutes, steps 33 ~ 36;
           PR-OPE-5002 IDF START-UP: about -15 at 13 %). A hot bed with no fire and no air is the same gas path as the cold furnace: the
           loop model anchored at 150 MW (its air term taf / taf0 - 1 = -1 with no air) takes over only with the air too, fully from half
           the purge air of the SOP (203 of 406 T/H), so the Hot / Warm restart starts the fans like the Cold one */
        ia =
          idf && U.idf && U.idf.S.rt.pm
            ? Math.max(0, Math.min(1, (tb - 100) / 200)) * Math.max(0, Math.min(1, taf / 203))
            : 1;
      if (ia < 1 && !p.pr.src) {
        const m = U.idfV ? Math.max(0, Math.min(100, +U.idfV.S.rt.v[U.idfV.n] || 0)) : 0,
          sp = anIdfN(m) / AN_IDF_CRV[2][1],
          sp13 = anIdfN(13) / AN_IDF_CRV[2][1],
          sp16 = anIdfN(16) / AN_IDF_CRV[2][1],
          /* 3.2.3-beta.104: A from the same target as before (the IDF alone at 13 % = -19.5 mmH2O) on the new speed curve, so the
             cold start of the SOP reads as before at 13 % and 16 % (before: A = 124 fixed on the straight line) */
          A = 19.5 / (sp13 * sp13),
          Kq = A * sp16 * sp16 - 15,
          ylo = -A * sp * sp + Kq * Math.pow(taf / 406, 2);
        /* the target of the loop model (plant.js ss: y = smul * y + (1 - smul) * sbase); its own lag (<= 5 s) makes the response. Before
           (beta.51 ~ 53) the state was overwritten here and the loop model pulled it back each scan to its own value */
        p.pr.smul = ia;
        p.pr.sbase = ylo;
      }
    }
  }
  anUnitStepX(dt, mso);
}
/* 3.2.0 roadmap 3 / P1: the transmitters of the cold plant, valve positions, spray block valves (see anUnitStart) */
function anUnitStepX(dt, mso) {
  const U = AN_UNIT,
    X = U.xt,
    lag = (k, x, tau) => {
      const T = X.T;
      if (!isFinite(x)) return T[k];
      T[k] = !isFinite(T[k]) ? x : T[k] + ((x - T[k]) * Math.min(dt, tau)) / tau;
      return T[k];
    },
    val = L => anUnitVal(L || []),
    pvOf = o => (o && o.c && o.c.q && o.c.q.pv != null ? +o.S.rt.v[o.c.q.pv] : NaN);
  if (X) {
    /* cold reheat: the HP turbine exhaust and the HP bypass outlet, mixed by their steam */
    const mst = pvOf(X.mst),
      /* Phase 11 rank 1 (RIN): the HP exhaust temperature of the steam path (turbine.js tbPath, Stodola + IF97: port crh.rh_in T), in
         place of the snapshot anchor 370 C moved by the main steam temperature (X.cr0 + mst - X.MST0, which held the part load CRH
         temperature at the full load value: HB case 7 30 % 338 C) */
      crT = typeof anPortGet === 'function' && anPortGet(U, 'crh.rh_in') ? anPortGet(U, 'crh.rh_in').T : null,
      thx = isFinite(crT) && crT != null ? crT : U.Tamb,
      w = (U.ms || 0) + (U.mhp || 0);
    /* 3.2.4 (live Cold start F-T: HP bypass outlet TT-MS1022 64 C with the bypass 8 % open at 60 kg/cm2): the outlet of the HP bypass
       is an energy balance, not the snapshot loop gated by 3 % of the MCR flow (source.js R.TICMS1022). The main steam (PT-MS1006
       pressure U.Pms, SH outlet TICMS1004 PV) is throttled at constant enthalpy to the cold reheat pressure and mixed with the spray
       water of TCV-FW1060 (U.whps, 67 T/H at 100 %, L21) at the deaerator water temperature (the spray comes from the BFP discharge,
       before the HP heaters); IF97 steam table (steam.js), wet = saturation. TT-MS1022 sits on the cold reheat side: it also sees the
       HP exhaust (snapshot 359 C at 150 MW with the bypass shut), mixed by their steam; no steam = the pipe cools to the room */
    const mhp = U.mhp || 0,
      whp = U.whps || 0,
      Pms = isFinite(U.Pms) ? U.Pms : NaN,
      Prh = isFinite(U.Prh) ? Math.max(0, U.Prh) : 0;
    let tby = val(X.byo);
    if (mhp > 0.05 && isFinite(Pms) && isFinite(mst)) {
      const hs = steamH(Pms, mst),
        hw = 4.19 * (isFinite(U.tSr) ? U.tSr : U.Tamb),
        h = (mhp * hs + whp * hw) / (mhp + whp);
      tby = steamTph(Prh, h);
    }
    const spB = U.spr && U.spr.find(z => z.v[0] === 'DITL-79');
    if (spB) {
      const tex = isFinite(thx) && isFinite(X.byo0) && isFinite(X.cr0) ? thx + X.byo0 - X.cr0 : thx,
        t1022 = lag(
          'by',
          w > 1
            ? ((U.ms || 0) * Math.max(U.Tamb, isFinite(tex) ? tex : U.Tamb) + mhp * (isFinite(tby) ? tby : U.Tamb)) / w
            : X.T.by != null
              ? X.T.by + ((U.Tamb - X.T.by) * dt) / (20 * U.tauT)
              : U.Tamb,
          U.tauT
        );
      if (isFinite(t1022)) spB.pr.hx = Math.max(U.Tamb, t1022);
    }
    const tcr = lag(
      'cr',
      w > 1
        ? ((U.ms || 0) * Math.max(U.Tamb, thx) + (U.mhp || 0) * (isFinite(tby) ? tby : U.Tamb)) / w
        : X.T.cr != null
          ? X.T.cr + ((U.Tamb - X.T.cr) * dt) / (20 * U.tauT)
          : U.Tamb,
      U.tauT
    );
    if (isFinite(tcr)) {
      anUnitWrite(X.cr, tcr);
      /* after the RH spray: the cooling of the anchor spray, in the share of the spray MV that reaches the water (block valve) */
      const mv = X.rhPv ? Math.max(0, +X.rhPv.S.rt.v[X.rhPv.n] || 0) : 0,
        sp = U.spr && U.spr.find(z => z.v[0] === 'DITL-35'),
        uf = sp && sp.pr.uf != null ? sp.pr.uf : 1,
        k = X.rhv0 > 1 ? Math.min(2, (mv * uf) / X.rhv0) : 0;
      X.rhi.forEach((L, i) =>
        anUnitWrite(
          L,
          Math.max(
            U.Tamb,
            tcr - (isFinite(X.rhi0[i]) && isFinite(X.cr0) ? (X.cr0 - X.rhi0[i]) * k * (w > 1 ? 1 : 0) : 0)
          )
        )
      );
    }
    /* hot reheat temperature: the reheater outlet */
    const rht = pvOf(X.rhPv);
    if (isFinite(rht)) anUnitWrite(X.hr, rht + X.hrOff * Math.max(0, Math.min(1, (rht - U.Tamb) / 300)));
    /* aux steam header TT-AS1003: the header metal of the aux steam model (anAuxStep, AN_AS UA3; it was a lag to 236 C scaled by
       the header pressure before beta.223) */
    if (X.aux && X.aux.length && isFinite(U.asT3)) anUnitWrite(X.aux, U.asT3);
    /* feedwater to the economizer: deaerator water + HP heaters (with the turbine load) */
    if (X.fw && X.fw.length && isFinite(X.fw0)) {
      const pd = val(X.dea),
        tdea = isFinite(pd) && pd > 0.05 ? steamTsat(pd) : U.Tamb,
        tdea0 = isFinite(X.dea0) && X.dea0 > 0.05 ? steamTsat(X.dea0) : 120,
        ld = U.MW0 > 0 ? Math.max(0, Math.min(1.1, (U.MW || 0) / U.MW0)) : 0;
      /* 3.2.1 (IRENE: HP HEATERS): the outlet of the No.2 HPH of the heater model (anHphStep), 03.png TIFW1106 243 / TIFW1160 244 C */
      anUnitWrite(X.fw, isFinite(U.hpT2) ? U.hpT2 : lag('fw', tdea + Math.max(0, X.fw0 - tdea0) * ld, 600));
    }
    /* the second drum level transmitter: the same water as the other two */
    if (isFinite(X.lt2Off) && X.lt2.length) {
      const m = X.lt13.map(L => val(L)).filter(isFinite);
      if (m.length) anUnitWrite(X.lt2, m.reduce((s, x) => s + x, 0) / m.length + X.lt2Off);
    }
    /* FA blowers: heat of compression while the air flows */
    if (X.fab.length && X.faF0 > 0) {
      const r = Math.max(0, Math.min(1.2, (val(X.faF) || 0) / X.faF0));
      X.fab.forEach((L, i) => anUnitWrite(L, lag('fab' + i, U.Tamb + (L.a0[0] - U.Tamb) * r, 120)));
    }
  }
  /* P1 #3 MAIN STEAM STOP MOV MV-MS1391 and its warming bypass MV-MS1392 (DITL-38): the share of the turbine steam that passes
     (bypass 10 %, NO-SOURCE: the MV-MS1392 line size on PD-011 gives no flow; its closing time 6 s is Limitorque 1/21 ~ 21/21), and the pressure at the MSV inlet that the ATS reads (tcs.js tcsSteam): it follows the main steam
     pressure through the open MOV (30 s), slowly through the bypass alone (the warming of the pipe, 600 s), and falls with both shut
     (the steam in the pipe condenses, 1800 s). The HP bypass takes its steam before the MOV (PD-011) */
  {
    const pm = anDitlPos('DITL-38 #MV-MS1391', 0),
      pb = anDitlPos('DITL-38 #MV-MS1392', 0);
    if (pm == null || pb == null) {
      U.msG = undefined;
      U.Pmsv = undefined;
    } else {
      U.msG = Math.min(1, pm / 100 + (0.1 * pb) / 100);
      const P = isFinite(U.Pms) ? U.Pms : 0,
        tau = pm > 5 ? 30 : pb > 5 ? 600 : 1800,
        x = pm > 5 || pb > 5 ? P : 0;
      U.Pmsv = !isFinite(U.Pmsv) ? x : U.Pmsv + ((x - U.Pmsv) * Math.min(dt, tau)) / tau;
    }
  }
  /* valve position = valve command */
  for (const z of U.zt || []) {
    const c = Math.max(0, Math.min(100, anAv(z.t, +z.src.S.rt.v[z.src.n] || 0)));
    z.y = !isFinite(z.y) ? c : z.y + ((c - z.y) * Math.min(dt, U.tauZT)) / U.tauZT;
    anUnitWrite(z.L, z.y);
  }
  /* spray block valves: the share of the spray command that reaches the water */
  for (const z of U.spr || []) {
    const ps = z.v.map(n => anDitlPos(n, 0));
    z.pr.uf = ps.some(x => x == null) ? undefined : ps.reduce((a, x) => a + x, 0) / (100 * ps.length);
  }
}
