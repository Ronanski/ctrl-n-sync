/* PHASE 11 PART 1: COMBUSTION AND THE CFB FURNACE (AOI, 2026-11-27; user 2026-11-27 11:05 AM PHT "Ok sinisimulan naba plant model?
   Gawin nio na"). One file for the physics of the furnace: the fuel heat, the bed and the lower refractory, the circulating solids and
   the upper furnace suspension, the bed inventory and the cyclone / seal pot loop, the gas that leaves the furnace. Called by the unit
   step (unit.js anUnitStep0); the drum, superheater and backpass stay in their own files. Joined right before engine/unit.js
   (order.list). The blocks below were moved here unchanged from unit.js (1.0.0-beta of main ae440be), so the numbers of the plant do
   not change with this move; the dead bed laws (AN_BED / anBedSS, the start-up exponent kBedSU, tauBc and uaW of AN_UNIT: no reader
   since beta.256, rule-0 list 2026-11-24 item 5) are deleted.
   Rule 0 (RULES.md 3.12): physics from first principles and the design data only; the open fits of this file are on
   docs/audit/rule0-fit-list-2026-11-24.md items 1 (kKL) and 2 (bed inventory anchor) and go away in the next steps of Phase 11. */
/* FIFA1079 (hot PA to the grate plenum) over FIFA1071 (the PA fan flow). Phase 11 AOI 2026-11-28: DESIGN-SRC
   the FHI mass balance at 100 % BMCR, PA sheet (YUA read, /mnt/project-files/aoi-design-reads-2026-11-28.md): PAF outlet 388 t/h, of it
   325 to the grate plenum (4 x 81.25), 27 to the coal pipes, 3 cold to the feeder seals, 33 lost in the air heater. The loop seals and
   cyclones are on the FA blowers (not PA). */
const AN_PA_FURN = 325 / 388;
/* bed temperature at steady firing. FHI Fig 8 (furnace temperature) on the coal share of Fig 13, scaled to the bed of the anchor; more air than
   Fig 12 gives at that firing cools it with the same exponent 0.45. Below 40 % load no curve is printed: the start-up law of beta.15 (a small
   fire with the light-off air, 450 C with two burners) stays, and the lower of the two holds. Before: the start-up law alone, 95 C too hot at
   60 % load. Fuel share at 40, 50, 60, 70, 85, 100 % load: 38.5, 47, 56, 64, 77, 89.5 T/H of 89.5 */
/* 3.2.1 b6: plant DCS trends 2026-11-08 (team-files/plant-study/14): TIFG1090 952 to 962 C from 90 to 150 MW with the plant air, 855 C at 40 MW
   against 909 C at 150 MW the same day. The Fig 8 fall (660 to 840) and the extra air cooling are not seen on this plant: t follows the trend ratios,
   the air term has exponent 0 */
/* 3.2.3 plan b5 (fuel): coal that does not burn stays in the bed (the cyclone sends the fines back) and burns when the bed is hot
   enough (U.cbed, below). 3.2.4-beta.21 tried a char split with a guessed burnout time and dropped it (PIC-COBM swing to an MFT at 75 MW);
   step 4 below puts it back with the burnout time from the design coal size. */
/* Phase 11 AOI step 4 (rank 4b, docs/audit/kkl-bed-storage-derivation.md (A)): THE CHAR IN THE BED. Coal burns in two steps: the
   volatiles leave and burn in seconds, the char (fixed carbon) burns over minutes and is a store of fuel in the bed. U.cbed holds that
   store (t of coal-equivalent: char of the hot bed + coal fed into a bed too cold to burn it). Burnt coal Fb = bf F fV (volatiles, at
   once) + bf U.cbed / tauC (char). At steady Fb = F; the store at MCR is (1 - fV) F tauC / 3600 = 1.9 t of coal-equivalent = 0.9 t of fixed
   carbon (0.5 % of the bed, the low end of the 0.5 ~ 3 % of the CFB textbooks, as a diffusion-only time gives).
   fV 0.39: DESIGN-SRC coal crusher spec K1AU3-D2-0-102 R0 p4, VM 30.56 % / FC 28.67 % as received: the char carries 61 % of the LHV.
   tauC: CALC, diffusion-controlled burnout of a shrinking char particle (Basu, Combustion and Gasification in Fluidized Beds, ch. 4):
   tauC = rhoC d0^2 / (4 Sh D CO2 MC), d0 = the design d50 1.1 mm (DESIGN-SRC K1AU3-D2-0-102 R0 2-4-4, d50 0.7 ~ 1.5 mm; feeder sheet D1
   d50 0.7 ~ 1.5 mm), Sh 2 (fine particle), D = 2.0e-5 (T / 298)^1.75 m2/s at the bed 850 C, CO2 = p / (R T) x the design exit O2 3.6 %
   (FHI P2S7 Fig 7), MC 0.012 kg/mol, rhoC 800 kg/m3 (textbook char of a 34 % moisture sub-bituminous coal). The kinetic resistance of
   the char is not added: no design char reactivity (NO-SOURCE on that term only; it could only make tauC longer).
   Replaces tau 60 s (NO-SOURCE, bounded by the PR-OPE-5002 6.4 batch firing): a batch fired at 400 ~ 450 C now burns its volatiles at
   once and its char over tauC, inside the "wait 5 min if a batch does not burn" of the procedure. */
const AN_CBED = { fV: 0.39, rhoC: 800, d0: 1.1e-3, Sh: 2 };
/* the char burnout time at the bed temperature T (C) and the O2 the char sees (dry %, the furnace O2 of the mole balance): the
   diffusion law above, live. More air gives more O2 at the char and a faster burn: the fast answer of the fire to the air of the boiler
   master that a fixed time does not have. 3.6 % at 850 C = 127 s; floor 0.3 % O2 (a bed short of air keeps a store, it does not stop) */
function anCharTau(T, o2) {
  const K = AN_CBED,
    Tk = (isFinite(T) ? Math.max(500, T) : 850) + 273.15,
    D = 2.0e-5 * Math.pow(Tk / 298, 1.75),
    cO2 = (101325 / (8.314 * Tk)) * (Math.max(0.3, isFinite(o2) ? o2 : 3.6) / 100);
  return (K.rhoC * K.d0 * K.d0) / (4 * K.Sh * D * cO2 * 0.012);
}
/* live Cold start 2026-11-14 (user: "Code ang gawin ... WALANG DAYAIN"): THE GAS THAT REACHES THE SUPERHEATER / REHEATER (Cold path).
   The furnace exit gas U.tgF comes from the bed heat balance (AN_BB below). It then crosses the refractory of the cyclone inlet ducts,
   the cyclones and their outlet ducts before the backpass (03-boiler; P2S4): inlet ducts 98.8 ~ 118.3 t + cyclones 373.7 ~ 450.2 t +
   outlet ducts 214.4 ~ 303.9 t (13-thermal-masses A6, K1AU3-C-0-007), centre 780 t x 1.0 kJ/kg K (textbook refractory) = 780 MJ/K,
   one lump the gas heats or cools on its way. The gas leaves the cyclones at the lining temperature (exchange effectiveness 1:
   NO-SOURCE, the lining area and film coefficient are not in the documents). Flue gas cp 1.15 kJ/kg K (textbook), coal ash 6.82 % (T3).
   live Cold start 2026-11-14 (beta.243, MS 439 C and RH 381 C flat from 45 to 70 MW, cyclone outlet 544 C under a furnace of 800 C):
   one 780 t lump with effectiveness 1 made the gas leave at the temperature of the WHOLE lining, so the backpass saw the lining that
   heats in tens of hours. A refractory heats from its hot face and conducts inward (textbook, semi-infinite wall: about 75 mm in 1 h
   at 5e-7 m2/s), and the gas only touches the hot face through its film. Two layers:
   - lining area A 1,200 m2: two cyclones ID 7.89 m x about 24.5 m high (03-boiler, P2S4 p2-4-10: cylinder, cone and roof about 520 m2
     each, CALC) + outlet ducts (about 160 m2, ASSUMED: duct size not in the docs).
   - gas film h 0.1 kW/m2 K (NO-SOURCE, textbook dusty gas at 800 C, convection + radiation 50 ~ 200 W/m2 K): hA 120 kW/K.
   - hot face layer 50 mm (the depth that follows the gas within about an hour): 1,200 m2 x 0.05 m x 2.3 t/m3 x 1.0 kJ/kg K = 138 MJ/K;
     the back of the lining = the rest of the 780 MJ/K (642 MJ/K).
   - face to back: fireclay k 1.2 W/m K (textbook) over 0.15 m between the layer centres: 1.2 x 1,200 / 0.15 = 9.6 kW/K.
   Lining fully soaked: the gas leaves at the furnace exit temperature (no loss term: 75 mm calcium silicate behind, P4S1) */
const AN_FG = { cpG: 1.15, ash: 0.0682, mCy: 780e3, hA: 120, mF: 138e3, mB: 642e3, kAB: 9.6 };
/* live Cold start 2026-11-14 (user: "WALANG DAYAIN", no curve fits): THE BED HEAT BALANCE of the Cold path. Before, the bed went first
   order to a law fitted on the plant trend (start-up exponent kBedSU 0.168 and the AN_BED table), and the water walls took
   min(firing line, uaW x (bed - water)): a patch. Now one lump of the lower furnace (bed solids + the refractory of the lower furnace)
   takes the fuel heat and gives it to the gas that crosses it and to the water walls:
     Cb dTb/dt = fuel heat - air x cp x (Tb - air in) - fuel gas x cp x (Tb - ambient) - wall heat (solids + lower refractory walls)
   - fuel heat: coal burnt x LHV 3,662 kcal/kg (T3) + oil x the diesel LHV 42.7 MJ/kg (textbook; the design data Tab_1 heating values
     are an image without text). Check: 42.7 / 15.33 = 2.79 t of coal per t of oil, against the plant figure 2.55 (PR-OPE-5002).
   - air in: PA / SA at the hot air temperatures of the air heater model (boiler.js anAphStep), FA at the ambient; air cp 1.005
     kJ/kg K (textbook). All the air crosses the bed zone (PA grate, SA nozzles of the lower furnace, FA through the seal pots; P2S4).
   - Cb: bed solids (U.bedI, t, the bed inventory model) x 0.84 kJ/kg K (sand / ash, textbook) + the lower furnace refractory 191.1 ~
     218.2 t, centre 204.65 t x 1.0 kJ/kg K (13-thermal-masses A6, textbook refractory).
   - wall heat by the circulating solids: (ua0 - uag) x phi x (Tb - water). ua0 = the design wall conductance uaW 0.976 T/H per K
     (AN_UNIT, CALC from the design heat balance) x 554 kW per T/H (the unit of Cw / Qs) = 541 kW/K. phi = the solids that the gas
     carries up the furnace relative to full load = bed inventory share x (gas velocity share)^2: the entrainment rises with the
     gas velocity (P2S6, qualitative; P2S4: the solids density falls up the furnace). 3.2.3-beta.269 (Jennie): the exponent nU 3.5 is set
     by the plant DCS trend, scenario 1 (14-plant-trends): bed TIFG1090 flat 952 ~ 962 C from 150 to 90 MW with PA + SA 610 -> 505 T/H.
     With 2 (NO-SOURCE) the model bed fell 828 -> 775 C at 90 MW and coal / pressure swung 48 ~ 56.5 T/H, 121.1 ~ 123.4 kg/cm2 every
     ~18 min; with 3.5 the bed is 816 C, coal 53.0 ~ 54.6 T/H (plant 55.4), pressure 122.1 ~ 122.4, O2 9.1 % (plant 9.1). The
     circulation rate itself is not in the documents (03-boiler). The gas
     velocity share = total air / anchor air x (Tb + 273) / (Tb0 + 273) (the gas expands with its temperature).
   - wall heat through the refractory of the lower furnace: 25 mm refractory over the tubes (13-thermal-masses), k 1.5 W/m K
     (textbook castable) = 60 W/m2 K, in series with a dense bed film 300 W/m2 K (textbook) = 50 W/m2 K, over the lower walls 46.38 m
     perimeter x 7.75 m = 359 m2 (T2, P2S4) = 18 kW/K.
   - upper furnace, gas alone: the gas leaves the bed at Tb and gives heat to the bare upper walls with uag = 27 W/m2 K (textbook gas
     radiation about 17 + convection about 10, NO-SOURCE) x 1,199 m2 (upper walls 46.38 x 25.85 m) = 32 kW/K; the gas cools
     exponentially along the walls: q = gas x cp x (Tb - water) x (1 - e^(-uag / (gas x cp))). The circulating solids hold the gas at
     the bed temperature in the share phi (capped 1).
   Steady check at the anchor (coal 87.5 T/H, air 593 T/H, hot air about 285 C, drum 145 kg/cm2): bed about 820 C, steam about
   470 T/H, against the design 850 C (FHI design data) and 476 T/H: not fitted, the result of the balance. */
/* Phase 11 AOI 2026-11-28 (user "FULL FORCE", the backpass gas of KANA's hx check): POST-COMBUSTION IN THE CYCLONES. Part of the coal
   leaves the furnace still burning (fine char carried up past the dense bed, the CO and volatiles that meet the secondary air at the top)
   and gives its heat in the cyclones (refractory lined, no tubes) to the gas on its way to the backpass (Basu, Circulating Fluidized Bed
   Boilers, the cyclone temperature rise). Its size is DERIVED from the FHI Tab 3 heat balance at MCR (first principles, no plant data):
   the backpass absorbs SH 110.8 + RH 43.0 + eco 36.2 MW less the furnace share = 127.5 MW from 184.2 kg/s of gas cooled to the air
   heater inlet 322 C (Tab 3), which needs the gas at 894 C into the backpass; the gas leaves the furnace at the design 840 C (FHI
   Fig 8 furnace at 100 % MCR, the exit tgF of the bed balance), so 184.2 x (hFg(894) - hFg(840)) = 184.2 x 68.3 kJ/kg = 12.58 MW
   must be released after the furnace exit: 12.58 / (89 T/H x lhvC 4,259 kW per T/H x (1 - fUC) = 366.9 MW) = 3.43 % of the coal
   heat released (CALC, KANA
   /mnt/project-files/phase11/kana-sh-rh-outlet-2026-11-28.md). The same share at every load (one design point; the part-load
   curves of the sweep judge it). It is the same coal: this share leaves the bed balance and goes to the cyclone gas (anHxRun). */
const AN_PC = { f: 0.0343 /* DERIVED: FHI P2S7 Tab 3 heat balance at MCR, see above */ };
const AN_BB = {
  lhvC: (3662 * 4.1868) / 3.6,
  /* 3.2.3-beta.271 (Jennie, physics audit 2026-11-15 MISSING item): the coal heat that never reaches the bed, gas or water: carbon
     left unburnt in the fly and bottom ash, ash heat, CO. FHI Tab 3: efficiency 90.9 % LHV at MCR. The model at 150 MW without it:
     input 83.5 T/H x 4,259 kW = 355.4 MW, stack 194.2 kg/s from 125 to 30 C = 20.3 MW (5.7 %), room loss kamb 0.6 MW (0.2 %):
     94.1 %, so these losses are 3.2 % of the LHV (CALC, the split between them is not in the documents). Coal per MW was 4 % under
     the plant (snapshot FIC-CM 87.0 T/H at 150 MW, model 83.5) */
  fUC: 0.032,
  lhvO: 42700 / 3.6,
  cpA: 1.005,
  cpS: 0.84,
  mRef: 204650,
  /* 1.0.0-beta.256 (JENNIE): the upper furnace suspension (the bed balance, unit step). Was ua0w 289.3 kW/K, CALC with the bed AND the
     furnace exit both at 850 C. CALC of the 150 MW anchor (phi 1, drum 145 kg/cm2 g = 338.5 C, IF97):
     - tbA 937 C: the bed, the average of the eighteen lower layer thermocouples TT-FG1090 / 1091 A ~ I of the HMI snapshot at 150 MW
       (the anchor the thermocouples are written from, anGasA0; trend scenario 1 TIFG1090 952 ~ 962 C);
     - furnace exit 850 C: FHI design data / Fig 8 (the gas the backpass chain of hx.js is built on);
     - evaporator 157.2 MW (design heat balance, as before): the lower refractory 17.96 kW/K x (937 - 338.5) = 10.75 MW, the upper
       walls 146.45 MW;
     - SH panels 62.5 MW: the panel heat of uaP 75 at the 150 MW state of the model (bed 856 C, metals p1 412.7 / p2 465.8 C, save
       "150 MW bed AUTO 2 coolers" 2026-11-22), held: the panels now see Tu, uaP is CALC again in hx.js;
     - Cs = (146.45 + 62.5) MW / (937 - 850) K = 2,402 kW/K; less the flue gas 237 kW/K (anHxCp, 188 kg/s): cSol 2,165 kW/K, that is
       2,577 kg/s of solids at 0.84 kJ/kg K = 21.7 kg/m2 s over the 119 m2 grate (check: CFB circulation flux 10 ~ 100 kg/m2 s, Basu,
       Circulating Fluidized Bed Boilers, ch. 2; the rate itself is not in the documents);
     - the profile of the bed balance with these sinks gives Tu 892.3 C; Uw = 146.45 MW / (892.3 - 338.5) = 264.5 kW/K, of it the gas
       radiation uag(892 C) 106.9 (WSGG, upper walls): uaS 157.6 kW/K by the solids. */
  /* 1.0.0-beta.348 (JENNIE, D9 of user 2026-11-24 "GO DESIGN"): THE ANCHOR IS THE DESIGN, NOT THE PLANT. tbA 937 above was the HMI
     snapshot thermocouples (plant trend 952 ~ 962 C). The design bed: P2S4 p2-4-8 850 ~ 900 C normal (above 900 C call FHI), the
     procedure holds 850 ~ 870 C (SU:10198); FHI P2S7 Fig 8 furnace average 840 C at 100 %. tbA = 860 C (the middle of the held band),
     furnace exit 840 C (Fig 8 at 100 %, was 850 FHI design data). Same CALC as beta.256, same sinks (upper walls 146.45 MW, SH panels
     62.5 MW, drum 338.5 C, flue gas 237 kW/K):
     - Cs = (146.45 + 62.5) MW / (860 - 840) K = 10,448 kW/K, less the gas 237: cSol 10,211 kW/K (12,156 kg/s of solids at 0.84 kJ/kg K =
       102 kg/m2 s over the 119 m2 grate: the top of the CFB range 10 ~ 100 kg/m2 s, Basu ch. 2; an isothermal furnace at MCR is what
       the design curve says, bed 860 and exit 840);
     - the profile (anBbSus) at these: Tu 849.9 C, Uw = 146.45 MW / (849.9 - 338.5) = 286.4 kW/K, gas radiation uag(849.9) 100.6 (WSGG):
       uaS 185.8 kW/K. Checked by anBbSus itself: tgF 840.0, walls 146.47, panels 62.51 MW (scratchpad d3solve.cjs, the app's laws) */
  tbA: 860,
  cSol: 10211,
  uaS: 185.8,
  uaL: 18,
  uaBR: 30.8 /* kW/K, bed -> refractory centre (beta.263, see the bed balance) */,
  uaRW: 43.1 /* kW/K, refractory centre -> water */,
  /* 1.0.0-beta (JENNIE, heat balance study 2026-11-21): the upper furnace gas to the bare upper walls is gas radiation + convection,
     no longer the fixed 32 kW/K (NO-SOURCE). Radiation: WSGG emissivity of the CO2 + H2O gas (hx.js anHxEps, the same model as the
     backpass) at the beam length 3.6 V / A of the upper furnace (T2: 15.507 x 7.684 m grate, 25.85 m upper walls) = 7.7 m, gray wall
     factor (1 + 0.8) / 2 = 0.9 (Hottel, oxidised steel 0.8, textbook), area 46.38 x 25.85 = 1,199 m2 (T2), convection 10 W/m2 K
     (textbook). At bed 830 C, drum 322 C: eps 0.51, h 70 + 10 W/m2 K = 96 kW/K. uag stays the fallback for a cold gas */
  uag: 32 /* kW/K, fallback below 200 C gas */,
  aUp: 1199 /* m2, upper furnace walls (T2) */,
  lUp: 7.7 /* m, beam length 3.6 V / A */,
  fwUp: 0.9 /* gray wall factor */,
  hcUp: 0.01 /* kW/m2 K, convection (textbook) */,
  kW: 554,
  nU: 3.5 /* the law before 1.0.0-beta.282 (phi = velocity share ^ 3.5): only to read a save point of an older engine (anBedMigrate) */,
  /* 1.0.0-beta.282 (JENNIE, part load: furnace exit gas +30 ~ +55 C over FHI P2S7 Tab 4 Fig 8 and SH spray 3x Fig 10 at 70 ~ 50 %
     load, with the operator, while the bed held). THE CIRCULATING SOLIDS AT PART LOAD, two textbook laws instead of one power law:
     (1) the solids flux that the gas carries to the top of the furnace decays with the height as Kunii & Levenspiel (Fluidization
         Engineering, 2nd ed., ch. 7, the freeboard): flux(H) = flux(0) e^(-a H) with a U = c (constant for a bed material). Against the
         150 MW anchor: phi = e^(-c H / U0 (1 / uRel - 1)) = e^(-kKL (1 / uRel - 1)), uRel = the gas velocity share (unit step).
     (2) the heat transfer coefficient of the suspension to the walls and the panels grows with the square root of its density
         (Basu & Nag, h = 40 rho^0.5 W/m2 K; Basu, Circulating Fluidized Bed Boilers, ch. 6), while the heat it carries up grows with
         the flux: walls uaS x phi^0.5, panels uaP x phi^0.5 (hx.js), solids cSol x phi. At phi 1 (the anchor) nothing changes.
     kKL, CALC from the plant at 90 MW: scenario 1 of the plant DCS trend (14-plant-trends: coal 55.4 T/H, PA 318 + SA 187 T/H,
     bed TIFG1090 955 C; anchor PA + SA 610 T/H) and the furnace exit of FHI Fig 8 at 60 % MCR (755 C):
       coal 55.4 T/H x lhvC 4,259 kW per T/H x (1 - fUC 0.032) = 228 MW, less the gas heated to the bed (qAirG) ~138 MW, less the
       lower refractory and the limestone ~14 MW (the bed balance below at those flows) = 76 MW that the solids carry up;
       solids heat capacity flow = 76,000 / (955 - 755) = 380 kW/K = phi x cSol 2,165 -> phi 0.175;
       uRel = 505 / 610 x (955 + 273) / (937 + 273) = 0.840; kKL = -ln 0.175 / (1 / 0.840 - 1) = 9.2.
     Check against (1): U0 = the flue gas at 150 MW (188 kg/s, density 0.29 kg/m3 at 937 C) over the 119 m2 grate = 5.4 m/s, furnace
     height 7.75 + 25.85 = 33.6 m (T2): c = 9.2 x 5.4 / 33.6 = 1.5 s^-1, inside the range Kunii & Levenspiel give for a U (0.5 ~ 10
     s^-1, larger for coarser solids; the sand of P2S7 Tab 3 d50 0.15 ~ 0.30 mm). The circulation rate itself is not in the documents */
  /* 1.0.0-beta.350 (JENNIE, D3 of "GO DESIGN", held): the FHI 60 % point (air 371 T/H Fig 12, coal 56.0 Fig 13, furnace 755 C Fig 8,
     bed 860 held) asks for kKL 3.80 (CALC, scratchpad d3solve.cjs). Measured 2026-11-24 (team-files/plant-study/
     15-boiler-balance-2026-11-24-damping.md points 7 - 9): kKL 3.8 takes most of the fast answer of the steam to the coal away (gas
     velocity -> solids circulation, the lead of the PIC-COBM loop) and the 150 MW pressure loop swings into DRUM LEVEL H.H. (with the
     plant anchor and with the design anchor). With 9.2 the design anchor (tbA 860 below) is damped at 150 MW. So 9.2 stays until the
     part-load bed is solved in the physics (the FHI 60 % point says the solids profile at part load is not the 150 MW one with a
     lower velocity only); 9.2 itself is the plant trend value of beta.282 (finding D3 stays open) */
  /* Phase 11 AOI 2026-11-28 (new st150 of PR 705, 60 plant min headless): main and the char store alone (AN_CBED) hold 150 MW
     (Pms 122.1 ~ 122.6); kKL 3.80 alone swings and grows (coal 85 ~ 95 T/H by 55 min); both together trip at about 52 min. So the
     char store is not the missing fast answer and 3.80 stays held (rank 4b, the 45 MW panel heat with it) */
  /* The Rule 0 tag is on the kKL line below (team decision 2026-11-28 6:00 AM PHT, TEMPORARY placeholder): 9.2 is a fitted value,
     not a design value. FHI P2S7 Fig 9 (furnace DP vs load, with Fig 12 / 13 / 8) gives kKL about 1.7 ~ 3 (rms 4 ~ 8 mmH2O; 9.2 gives
     rms 32, 1,427 at 60 % against 1,380) and the FHI 60 % thermal point gives 3.80 (/mnt/project-files/phase11/aoi-kkl-from-fig9-
     2026-11-28.md). It stays only because the design value leaves the 150 MW pressure loop (PIC-COBM as the manual) under-damped:
     the steam answers the firing in ~6 min (bed lag) against the 165 s integral time. Goes out when the fast-answer physics is found. */
  kKL: 9.2 /* RULE 0 VIOLATION, fit, contradicts FHI Fig 9 (temporary placeholder, see above) */,
  /* 1.0.0-beta.286 (JENNIE, F3 of report 282: start-up save points S10 / S12 / S29): beta.282 gave the SH panels only the solids part
     (uaP x phi^0.5), so at the low air of a start-up (phi ~ 1e-4) they took no heat at all (S12: 0.0 ~ 0.4 MW, was 1.3 ~ 2.0; the panel
     outlet steam 156 C after 30 min, was 176) and the bed rose 40 C faster. The gas in the upper furnace radiates to the panels as it
     does to the walls (Uw = gas uag + solids uaS x phi^0.5 above). The panels take the same split: at the 150 MW anchor the walls have
     gas 106.9 of 264.5 kW/K (CALC above, Tu 892.3 C) = fgP 0.404. Panel factor = fgP x uag(Tu, metal) / uag(892.3, metal) +
     (1 - fgP) x phi^0.5 (anBbPanF): 1 at the anchor, the gas part follows the WSGG radiation of the gas temperature. Why the same split:
     the panels hang in the same suspension at the same temperatures as the upper walls, so they take the same coefficient per m2; their
     area is read from the anchor: 2 x uaP 65 = 130 kW/K / (264.5 / 1,199 m2) = 589 m2
     of wall-equivalent surface, of it gas 589 x 106.9 / 1,199 = 52.5 kW/K = 40.4 % (CALC). Check at start-up air (save S12, bed 500 C):
     WSGG gas at Tu 434 ~ 499 C to metal ~200 C gives 6.3 ~ 7.2 MW, a gray-gas hand check 0.3 x 5.67e-8 x (773^4 - 473^4) x 589 m2 = 3 MW, the same order (eps 0.3 assumed for the check only).
     Check against the drawing (FHI K1AU3C-201 "Vert. superheater arrangement", in K1AU3-B-0-003 as built): 14 rows across the furnace
     at 622.3 mm pitch, each row one #1 and one #2 panel, 609.6 mm deep, straight from FL 27,774 to FL 42,527 (14.75 m) = 28 x 2 sides
     x 0.6096 x 14.75 = 503 m2, plus the lower bent legs: the 589 m2 of the anchor (CALC). The lanes between the panels (gap 622.3 -
     50.8 = 571 mm, 1.8 x gap = 1.03 m beam, Hottel) take the gas share down by the same 0.83 at 700 ~ 892 C (view factor to the next
     panel 0.43, WSGG 0.31 vs 0.50 at 7.7 m), so the shading changes the size of fgP, already set by the anchor, not its part-load slope */
  /* 1.0.0-beta.290 (JENNIE, report 288 F1: at 90 MW MST 543 / RHT 540 held with sprays 6.6 + 6.5 T/H, plant 522 / 521 with the 2nd
     spray at 0; backpass deposits clean or full give MST 544 both: the extra heat is in these panels, upstream of the 1st spray).
     The gas share of the panels is no longer the wall split above. The gas between two panels is a lane, not the furnace: the lane
     beam is 1.8 x gap 571 mm = 1.03 m (Hottel, K1AU3C-201: 622.3 mm pitch, 50.8 mm tubes), and the WSGG emissivity there is 0.305
     against 0.504 at the furnace beam 7.7 m (hx.js anHxEps, 892 C). Panel faces from the drawing: 28 panels x 2 sides x 0.6096 m x
     (14.75 m straight + 3.126 m lower legs) = 610 m2 (CALC). Gas to the panels at the anchor (Tu 892.3 C, panel metal ~440 C, save
     "150 MW bed AUTO 2 coolers"): 610 m2 x (WSGG lane radiation 54.5 W/m2 K, gray wall factor 0.9 in it, + convection 10) = 39.4
     kW/K, of the anchor panel conductance 2 x uaP 65 = 130 kW/K: fgP 0.303 (CALC). beta.348 (D9): at the design anchor Tu 849.9 C the
     lane radiation is 51.4 W/m2 K and the panels 2 x 76.1 kW/K (hx.js uaP): fgP = 610 x (0.0514 + 0.01) / 152.2 = 0.246 (CALC). The solids take the rest (0.697 x phi^0.5), so the
     panels lose heat faster at part load than the walls do; at the anchor (phi 1) the panel heat is the same as before. Hand check at
     90 MW (Tu 850, phi 0.2): panel factor 0.65 -> 0.60, about 3 MW less to the SH. Was fgP 106.9 / 264.5 = 0.404 (beta.286, the wall
     split; the 17:35 note of report 286 said the lane changes only the size of fgP, not its part-load slope: wrong, the size IS the
     slope, because the solids part falls with phi^0.5 and the gas part does not) */
  fgP: (610 * (0.0514 + 0.01)) / 152.2,
  aPan: 610 /* m2, panel faces (K1AU3C-201, CALC above) */,
  lPan: 1.03 /* m, lane beam between two panels */,
  tuA: 849.9 /* beta.348: the design anchor (D9 above) */,
  /* 1.0.0-beta.334 (JENNIE, whole boiler balance 2026-11-23, plant-study/15-boiler-balance-2026-11-23.md): THE SOLIDS DENSITY ALONG
     THE HEIGHT. The law of beta.282 (Kunii & Levenspiel) makes the density fall with the height as e^(-a h), a = c / U, and phi is its
     share at the furnace top. The walls and the panels gave both phi (the top), but they do not sit at the top: the upper walls run
     from the refractory top to the roof and the SH panels hang in the upper part only. Each now takes the mean density over its own
     height (anBbMeanH): at the anchor (phi 1) every mean is 1, nothing changes at 150 MW; at part load the walls keep more solids
     than the panels. Heights (sourced): grate FL +6,400 and refractory top FL +14,264.6 (thermal masses 01.01), SH panels FL 27,774 to
     42,527 = the furnace top (K1AU3C-201): H = 36.13 m, upper walls from x = 7.865 / 36.13 = 0.218, panels from 21.374 / 36.13 =
     0.592 (CALC). The solids that carry the heat up (Cs = gas + phi x cSol) stay the top flux.
     Check against the plant (scenario 2 trend A, the load-up day, coal only, cyclone out TIFG1095 median by load): 40 / 50 / 60 / 70
     / 90 / 150 MW = 556 / 596 / 634 / 661 / 711 / 875 C. App before: 45 MW 600, 72 MW 702, 90 MW 769, 150 MW 865; now 557, 667, 720,
     864. Scenario 1 at 90 MW (MST 522, 2nd spray 0): before MST 541 with sprays 3 + 5 T/H, now 525 with no spray. */
  xW: 0.218 /* upper walls start, share of the furnace height (CALC above) */,
  xP: 0.592 /* SH panels start (CALC above) */
};
/* 1.0.0-beta.334: the mean of the solids density share between the heights a and b (shares of H), phi = the share at the top:
   the density at x is phi^x of the anchor (e^(-k x), k = -ln phi) */
function anBbMeanH(phi, a, b) {
  const k = -Math.log(Math.max(1e-12, phi));
  return Math.abs(k) < 1e-6 ? 1 : (Math.exp(-k * a) - Math.exp(-k * b)) / (k * (b - a));
}
/* gas radiation (WSGG) + convection of the upper furnace gas at tg to the walls at tw, kW/K (AN_BB above) */
function anBbUag(tg, tw) {
  const B = AN_BB;
  if (!(tg > 200) || !(tg - tw > 1) || typeof anHxEps !== 'function') return B.uag;
  const K1 = tg + 273.15, K2 = tw + 273.15;
  return B.aUp * (B.hcUp + (B.fwUp * anHxEps(tg, B.lUp) * 5.67e-11 * (K1 ** 4 - K2 ** 4)) / (tg - tw));
}
/* 1.0.0-beta.282: the circulating solids share phi at the gas velocity share u (AN_BB kKL above; u capped 1.2 as before) */
function anBbPhiV(u) {
  return u > 0.05 ? Math.exp(-AN_BB.kKL * (1 / Math.min(1.2, u) - 1)) : 0;
}
/* beta.286: the share of the anchor conductance of an SH panel at the suspension tu, panel metal tm, solids share phi (AN_BB fgP) */
function anBbPanF(tu, tm, phi) {
  const B = AN_BB,
    /* beta.290: the gas of the lane between two panels (beam lPan), per m2 of panel face, kW/m2 K */
    hL = tg => {
      if (!(tg > 200) || !(tg - tm > 1) || typeof anHxEps !== 'function') return 0;
      const K1 = tg + 273.15, K2 = tm + 273.15;
      return B.hcUp + (B.fwUp * anHxEps(tg, B.lPan) * 5.67e-11 * (K1 ** 4 - K2 ** 4)) / (tg - tm);
    },
    gA = hL(B.tuA);
  return B.fgP * (gA > 0 && isFinite(tu) ? hL(tu) / gA : 0) + (1 - B.fgP) * Math.sqrt(anBbMeanH(phi, B.xP, 1)) /* beta.334: the panels' own height */;
}
/* the upper furnace suspension of the bed balance (unit step): exit tgF and mean Tu of the gas + circulating solids that leave the bed
   at Tb, with the walls (Uw, sink Tw) and the SH panels (Up, sink Tp) in parallel; uag at the mean of the last scan (tu0) */
function anBbSus(Tb, Tw, gcp, phi, up, tu0) {
  const B = AN_BB,
    Uw = anBbUag(isFinite(tu0) ? tu0 : Tb, Tw) + Math.sqrt(anBbMeanH(phi, B.xW, 1)) * B.uaS /* beta.282: h ~ rho^0.5 (AN_BB); beta.334: over the walls' height */,
    Cs = gcp + phi * B.cSol,
    Ut = Uw + up.U;
  if (!(Cs > 0.01) || !(Ut > 0)) return { tgF: Tb, Tu: Tb, Uw, qW: 0, qP: 0 };
  const Ts = (Uw * Tw + up.U * up.T) / Ut,
    N = Ut / Cs,
    e = Math.exp(-N),
    Tu = Ts + ((Tb - Ts) * (1 - e)) / N;
  return { tgF: Ts + (Tb - Ts) * e, Tu, Uw, qW: Uw * (Tu - Tw), qP: up.U * (Tu - up.T) };
}
/* 1.0.0-beta.256 (JENNIE; coordinator 2026-11-22: every save point must load and run without a trip): A SAVE POINT OF AN OLDER ENGINE.
   Its bed was solved by the one-temperature model (the bed and the furnace exit both at Tb, walls ua0w 289.3 kW/K, panels uaP 75 at Tb).
   Loaded as it is, the new balance takes less heat from that bed: the bed heats ~60 C in 10 min while the steam made falls, the boiler
   master runs the coal to its top and the unit trips (headless, save "150 MW bed AUTO 2 coolers", 2026-11-22). The saved plant is a
   steady heat balance, so the bed is moved to the temperature at which the NEW model takes the SAME heat out of the bed as the old one
   did at the saved state: walls + lower refractory + SH panels + the gas that leaves the furnace (gcp x its exit change). Same fuel, same
   total out: the loaded plant starts in balance. Gate: a state without U.Tu (saved before beta.256). One scan of arithmetic, no fit. */
function anBedMigrate(U) {
  if (!U || isFinite(U.Tu) || !isFinite(U.Tb) || !isFinite(U.Tw)) return;
  const B = AN_BB,
    Tb = U.Tb,
    Tw = U.Tw,
    gcp = isFinite(U.gcp) ? U.gcp : 0,
    phi = isFinite(U.phi) ? U.phi : 0,
    hm = U.hxM || {},
    pm = [hm.p1, hm.p2].filter(isFinite),
    Tp = pm.length ? pm.reduce((a, v) => a + v, 0) / pm.length : Tw,
    Trf = isFinite(U.Trf) ? U.Trf : (B.uaBR * Tb + B.uaRW * Tw) / (B.uaBR + B.uaRW),
    dW = Tb - Tw,
    tg0 = isFinite(U.tgF) ? U.tgF : Tb /* the old exit gas */;
  /* the old balance at the saved state (the code of 1.0.0-beta.254) */
  const ug = anBbUag(Tb, Tw),
    qG = gcp > 0.01 ? gcp * dW * (1 - Math.exp(-ug / gcp)) : 0,
    qS = phi * (Math.sign(dW) * Math.max(0, Math.abs(289.3 * dW) - Math.abs(qG))),
    qOld = qS + Math.min(1, phi) * qG + B.uaBR * (Tb - Trf) + 75 * phi * pm.reduce((a, p) => a + (Tb - p), 0);
  /* the new balance at a bed T: phi moves with the gas velocity (Tb + 273) / (tbA + 273), the old one used Tb0. beta.282: the saved phi is
     of the old law (velocity share ^ nU on the Tb0 basis): its velocity share is read back from it, then the law of today (anBbPhiV) */
  const u0 = Math.pow(Math.max(1e-9, phi), 1 / B.nU) * ((U.Tb0 + 273) / (B.tbA + 273)),
    out = T => {
    const ph = anBbPhiV((u0 * (T + 273)) / (Tb + 273)),
      uaP = typeof AN_HX !== 'undefined' ? (AN_HX.uaP1 + AN_HX.uaP2) / 2 : 0 /* beta.342: mean of the two panels (F13) */,
      s = anBbSus(T, Tw, gcp, ph, { U: pm.length * uaP * anBbPanF(T, Tp, ph), T: Tp }, T);
    return { q: s.qW + s.qP + B.uaBR * (T - Trf) + gcp * (s.tgF - tg0), s, ph };
  };
  let lo = Math.min(Tb, Tw) - 50,
    hi = Math.max(Tb, Tw) + 400;
  for (let i = 0; i < 60; i++) {
    const m = (lo + hi) / 2;
    if (out(m).q > qOld) hi = m;
    else lo = m;
  }
  const T = (lo + hi) / 2,
    r = out(T);
  U.Tb = T;
  U.Tu = r.s.Tu;
  U.tgF = r.s.tgF;
  U.phi = r.ph;
}
/* bed inventory (t of solids in the furnace). The overall furnace pressure drop is its weight on the grate: 15.51 x 7.68 m = 119 m2 (T2), so
   1 mmH2O = 1 kg/m2 = 0.119 t. Phase 11 (AOI, 2026-11-27, rule-0 list item 2 / D29): the full load inventory t0 is the DESIGN, FHI P2S7
   Fig 9 normal overall furnace DP 1630 mmH2O at 100 % MCR x 119.1 m2 = 194.2 t (DESIGN-SRC: FHI P2S7 Fig 9). It is also the set point the
   plant logic holds (DPICFG108 SV 1630, ABC-009A / B, bottom ash coolers in AUTO): the steady 150 MW of the model already sat at 194.5 t
   by that controller, so the old anchor (a plant reading 1465 mmH2O = 174.3 t, beta.265) put the solids share phi at 1.14 at full load,
   off the design anchor of the bed balance (AN_BB cSol / uaS, CALC at phi 1). Now phi = 1 at the design inventory. In: ash of the coal 6.82 % (T3), limestone less its CO2 (93.66 % CaCO3,
   T3: 0.59 stays), sand. Of the ash and limestone 20 % stays as bottom ash (ASH L5-1, scanned page, read with care), the rest leaves as fly ash.
   Out: the four screw coolers, 2 T/H at normal, 4 T/H at 5 rpm (BAC E130122B): 0.8 T/H per rpm. The fan flow that fluidizes: NO-SOURCE, full
   reading above 30 % of the anchor primary air. Initial charge at Cold 100 t (T9 p3). */
/* The loop: the cyclones catch the solids and the seal pots give them back while the fluidizing air blows. Below the FA blower flow low low of ABC-006
   (20 T/H) the seal pots stop passing: the solids stay in the cyclone legs and the bed empties, and they come back with the air. The rate is
   NO-SOURCE: the circulation rate is not in the documents. */
const AN_BI = { dp0: 1630 /* mmH2O, FHI P2S7 Fig 9, the overall furnace DP at t0 */, t0: (1630 * 15.507 * 7.684) / 1000 /* t, FHI P2S7 Fig 9 x grate (T2), see above */, tCold: 100, kA: 0.0682, kL: 0.59, kB: 0.2, q: 0.8, faLL: 20, loop: 60 };
function anBedStep(U, dt, rpm, pa, fa) {
  const K = AN_BI;
  if (!isFinite(U.bedI)) U.bedI = U.cold ? K.tCold : K.t0;
  const sol = K.kA * (U.coalR || 1) * (isFinite(U.cbn) ? U.cbn : (U.Fc || 0) * (U.burn || 0)) + K.kL * (U.lmQ || 0);
  U.bedIn = K.kB * sol + (U.sdQ || 0);
  /* beta.21: the rest of the solids leaves the cyclones as fly ash (T/H), to the air heater hoppers and the ESP (boiler.js anAphStep) */
  U.flyA = (1 - K.kB) * sol;
  U.bedOut = K.q * rpm;
  U.bedI = Math.max(0, U.bedI + ((U.bedIn - U.bedOut) * dt) / 3600);
  /* the solids held in the cyclone legs (t) */
  U.bedLeg = U.bedLeg || 0;
  const mv = (K.loop * (pa > 106 ? 1 : 0) * dt) / 3600,
    seal = fa == null || fa >= K.faLL;
  U.bedSeal = seal ? 1 : 0;
  if (!seal) {
    const d = Math.min(mv, U.bedI);
    U.bedI -= d;
    U.bedLeg += d;
  } else {
    const d = Math.min(mv * 4, U.bedLeg);
    U.bedI += d;
    U.bedLeg -= d;
  }
  U.bedK = Math.max(0, Math.min(1, pa / 106)) * (U.bedI / K.t0);
  return U.bedK;
}
/* Phase 11 rank 3 (AOI, 2026-11-27, user "Go fix 11"): THE FLUE GAS MOLE BALANCE. The gas the furnace makes, mole by mole, from the
   fuel analysis, in place of the law O2 = 21 x (1 - air needed / air) (which takes the gas moles = the air moles) and the oil counted
   as 2.55 t of coal for its air (PR-OPE-5002 4.3.x is a HEAT ratio, not an air ratio).
   Coal as fired (DESIGN-SRC: FHI P2S7 Tab 2, performance coal): C 42.97, H 2.75, O 11.42, N 0.59, S 1.49, ash 6.82, moisture 33.96 %
   (sum 100.00). A wetter coal (anCoalWet: U.coalR holds r) keeps the dry analysis: combustibles x r, moisture 1 - r (1 - 0.3396).
   Diesel oil: C 86.5, H 13.5 % (NO-SOURCE in the plant documents: the diesel analysis is not in them; textbook light fuel oil).
   Dry air: O2 20.95 %, M 28.965 (textbook). Limestone: CaCO3 93.66 % (DESIGN-SRC: FHI P2S7 Tab 3 p2) calcines to CaO + CO2; the S taken
   up (CaO + SO2 + 1/2 O2 -> CaSO4, share cap = 1 - U.soxF of anSoxStep) leaves the gas and takes its O2. A water wall leak (KANA, T/H)
   is steam in the gas.
   O2 of the analyzers: DRY basis. The design is self-consistent only on the dry basis: FHI P2S7 Fig 7 O2 against the Fig 12 air and
   Fig 13 coal gives, dry / wet: 40 % MCR 8.97 / 8.15 (Fig 7 8.8), 50 % 4.82 / 4.24 (4.6), 60 % 3.73 / 3.26 (3.6), 100 % 3.82 / 3.34
   (3.6); and Tab 3 "excess air 20 %" is dry 3.54 / wet 3.09 against Fig 7 3.6 (CALC, scratchpad fg.js). The data sheet of AT-FG1122 /
   1123 (in situ or extractive) is a PC read; until it is read the design basis is used. Short of air the O2 is 0 and airR > 1 (CO). */
const AN_FUEL = (() => {
  const c = { C: 0.4297, H: 0.0275, O: 0.1142, N: 0.0059, S: 0.0149, A: 0.0682, M: 0.3396 } /* DESIGN-SRC: FHI P2S7 Tab 2 */,
    o = { C: 0.865, H: 0.135 } /* diesel, textbook (NO-SOURCE in the plant documents) */,
    W = { C: 12.011, H2: 2.016, O2: 31.998, N2: 28.013, S: 32.06, H2O: 18.015, CO2: 44.009, SO2: 64.064, air: 28.965, CaCO3: 100.086, N2a: (28.965 - 0.2095 * 31.998) / 0.7905 /* atmospheric N2 with its argon, 28.16 */ },
    xO2 = 0.2095;
  /* O2 needed, kmol per kg of fuel */
  const nCoal = r => ({ C: (c.C * r) / W.C, H2: (c.H * r) / W.H2, S: (c.S * r) / W.S, O2: (c.O * r) / W.O2, N2: (c.N * r) / W.N2, W: (1 - r * (1 - c.M)) / W.H2O }),
    need = n => n.C + n.H2 / 2 + n.S - (n.O2 || 0),
    c1 = nCoal(1),
    o1 = { C: o.C / W.C, H2: o.H / W.H2, S: 0, O2: 0, N2: 0, W: 0 };
  return { c, o, W, xO2, nCoal, need, o1, afs: (need(c1) / xO2) * W.air /* 5.46 kg air per kg coal (CALC, Tab 2) */, afo: (need(o1) / xO2) * W.air /* 14.4 */ };
})();
/* the gas of the furnace, per hour: cb coal burnt T/H, r coal dry share (U.coalR), oil T/H, air T/H into the furnace (dry), lm limestone
   T/H, cap S taken up (share), stm steam of a wall leak T/H. Out: kmol/h of each gas, wet / dry total, O2 % wet and dry, mass T/H, the
   air needed T/H and airR = air needed / air given */
function anFgMol(cb, r, oil, air, lm, cap, stm) {
  const F = AN_FUEL,
    W = F.W,
    k = Math.max(0, cb) * 1000,
    q = Math.max(0, oil) * 1000,
    nc = F.nCoal(isFinite(r) && r > 0 ? r : 1),
    nS = k * nc.S,
    cp = Math.max(0, Math.min(1, cap || 0)),
    o2n = k * F.need(nc) + q * F.need(F.o1) + (cp * nS) / 2 /* kmol/h of O2 the fuel and the sulphation take */,
    nA = (Math.max(0, air) * 1000) / W.air,
    n = {
      CO2: k * nc.C + q * F.o1.C + (Math.max(0, lm) * 1000 * 0.9366) / W.CaCO3 /* calcination, DESIGN-SRC: FHI P2S7 Tab 3 p2 */,
      H2O: k * (nc.H2 + nc.W) + q * F.o1.H2 + (Math.max(0, stm) * 1000) / W.H2O,
      SO2: nS * (1 - cp),
      N2: nA * (1 - F.xO2) + k * nc.N2 /* the air part at N2a (argon in it) */,
      O2: Math.max(0, nA * F.xO2 - o2n)
    },
    wet = n.CO2 + n.H2O + n.SO2 + n.N2 + n.O2,
    dry = wet - n.H2O,
    m = (n.CO2 * W.CO2 + n.H2O * W.H2O + n.SO2 * W.SO2 + nA * (1 - F.xO2) * W.N2a + k * nc.N2 * W.N2 + n.O2 * W.O2) / 1000;
  return {
    n,
    wet,
    dry,
    o2w: wet > 0 ? (100 * n.O2) / wet : 20.95,
    o2d: dry > 0 ? (100 * n.O2) / dry : 20.95,
    m,
    airN: (o2n / F.xO2) * W.air / 1000,
    airR: nA > 0 ? o2n / (nA * F.xO2) : 0
  };
}
/* the design gas of the furnace at 100 % MCR, the base of the gas velocity share uRel (DESIGN-SRC: FHI P2S7 Fig 13 coal 89.5 T/H and
   limestone 12 T/H, Fig 12 total air 596 T/H, design coal r 1, the S taken up at the design 200 ppm of 1822: 0.89) */
const AN_FG0 = anFgMol(89.5, 1, 0, 596, 12, 1 - 200 / 1822, 0);

/* Phase 11 AOI 2026-11-28 (phase thread ask, the coal row of the sweep judge): the heat the plant holds, kJ, from the engine's own
   stores, so a judge of a steady design curve on a ramp minute can take out the stored heat that leaves or enters (dE/dt). Read only,
   changes no plant state. Only dE/dt has a meaning (absolute temperatures, no reference state). The terms are the same capacities the
   scan integrates, nothing new:
   - bed: inventory U.bedI t x AN_BB.cpS x U.Tb (unit.js bed balance Cb);
   - lining: AN_BB.mRef kJ/K x U.Trf;
   - drum water and evaporative steel: U.Cw (T/H s per K) x AN_BB.kW x U.Tw (unit.js drum law, r = B.kW / kWe);
   - drum steam space and flash: AN_STORE.cs (T/H s per kg/cm2) x U.kWe x U.Pd (the same drum law);
   - reheat pipe: AN_RHPIPE.M kJ/K (unit.js, BOM K1AU3-MM-102 R3) x U.TpR;
   - tube metal of every bank: AN_HX [metal kJ/K] x U.hxM (hx.js; U.shM / U.rhM are not used by the scan and are not counted);
   - coal held in the bed (char store): U.cbed t x AN_BB.lhvC x 3600 x (1 - AN_BB.fUC), the heat it gives when it burns. */
function anStoredE(U) {
  if (!U) return NaN;
  const B = AN_BB,
    n = x => (isFinite(x) ? x : 0),
    M = U.hxM,
    K = AN_HX;
  let hx = 0;
  if (M)
    for (const k of Object.keys(K.m0)) {
      const m = M[k];
      if (Array.isArray(m)) m.forEach((t, i) => (hx += n(K[k][i][0]) * n(t)));
      else hx += n(K[k][0]) * n(m);
    }
  return (
    n(U.bedI) * 1000 * B.cpS * n(U.Tb) +
    B.mRef * n(U.Trf) +
    n(U.Cw) * B.kW * n(U.Tw) +
    AN_STORE.cs * n(U.kWe) * n(U.Pd) +
    AN_RHPIPE.M * n(U.TpR) +
    hx +
    n(U.cbed) * B.lhvC * 3600 * (1 - B.fUC)
  );
}
