# P1 step 5: kKL 3.80 and the heat storage of the bed (derivation for JENNIE)

Made 2026-11-25 ~00:40 PHT by AUDIT FIX : LISA, docs only (coordinator ask, Rule 0). Main 9834ee0+. Everything below is design data, textbook physics or plant logic; no plant trend, no snapshot. What is still open is said so.

## 0. The problem in one paragraph
With kKL 3.80 (the FHI 60 % point) the boiler loses the fast answer of the steam to the firing that 9.2 gave, and on the way 150 -> 90 MW (run j11) the boiler master PIC-COBM cut the coal on the high drum pressure, the bed fell to 688 C, and **ABC-027 "FURNACE LOWER LAYER UNDER TEMP. > 700 C ADEQUATE FOR COAL FIRING" (to DITL-03F row 16, MFT) dropped**: MFT. Two things are missing from the physics, not from kKL: (A) the fuel that is already in the bed (char) and keeps burning when the feeders slow, and (B) where the volatile part of the coal burns. Plus (C) the bed inventory must be the design Fig 9 one (P1 step 2) before kKL is solved, because phi carries the inventory share.

## 1. What the code does today (unit.js, beta.374)
- Bed lump (line ~5764): `Cb dTb/dt = qFuel - qLm - qTl - qAirG - (qWu + qPan - gcp (Tb - tgF)) - qBR`, `Cb = bedI x 0.84 kJ/kg K` (bed solids only; the lower refractory is its own lump Trf, uaBR 30.8 / uaRW 43.1 kW/K, 204.65 t).
- Fuel: `qFuel = Fb x lhvC x coalK x (1 - fUC)`. `Fb = bf F + cbB` (line 5373): at a hot bed (bf = 1, Tb > Tburn1 600 C) **all fed coal burns in the same scan**; U.cbed holds only coal fed into a bed too cold to burn it (tau 60 s).
- Solids up the furnace: `phi = (bedI / 174.3) x e^(-kKL (1/uRel - 1))`, `uRel = air / taf0 x (Tb + 273) / (tbA + 273)`; walls `uaS x sqrt(mean phi)`, panels `uaP x panel factor`, solids heat `cSol x phi`; anchor tbA 860 / tgF 840 (Fig 8), cSol 10,211 kW/K, uaS 185.8 kW/K.
- So a coal cut reaches the bed at once and in full. Bed time constant at 90 MW: Cb = 164.3 t x 0.84 = 138 MJ/K (Fig 9 inventory, see C) over the self-regulation dQout/dTb ~ 285 kW/K (air 140 kg/s x 1.1 + walls / refractory, CALC) = **tau_b ~ 480 s**.
- Check of j11 by hand: 20 T/H coal under the need for 10 min = 20 x 4,259 x 0.968 = 82.5 MW; bed drop = (82.5 MW / 285 kW/K) (1 - e^(-600/480)) = **206 C: 860 -> 654 C**, the same size as j11 (688 C). The model is doing what its equations say; the equations miss the storage below.

## 2. (A) Char in the bed: the fuel store that is missing
Coal in a CFB burns in two steps: the volatiles leave in seconds, the char (fixed carbon) burns over minutes and is a store of fuel in the bed. When the feeders slow, the char store keeps burning and the heat to the bed falls with the char time constant, not at once.

**Equations** (replace the hot-bed part of `Fb`; reuse U.cbed as the char store in t of coal-equivalent):
```
fV  = volatile share of the coal heat              (fV = 0.39, below)
qV  = bf x F x fV                                  T/H coal-eq burnt at once (volatiles)
dCb/dt = bf x F x (1 - fV) + (1 - bf) x F - Cb_burn    t/h (U.cbed, char + unburnt coal)
Cb_burn = bf x U.cbed / tauC                        T/H coal-eq
Fb  = qV + Cb_burn                                  T/H coal-eq, into qFuel as today
```
At steady Fb = F (all fed coal burns); the store at MCR is `U.cbed = 0.61 x 89 x tauC / 3600`.

**Constants and sources**
- fV: coal crusher spec K1AU3-D2-0-102 R0 p4 (already cited in unit.js line 2168): VM 30.56 %, FC 28.67 % as received, char 61 % of the LHV -> **fV = 0.39**.
- tauC, char burnout, diffusion controlled (shrinking particle, textbook: Basu, Combustion and Gasification in Fluidized Beds, ch. 4; Field et al.):
  `tauC = rho_c d0^2 / (4 Sh D C_O2 M_C)`, Sh = 2 (fine particle in a fast bed), D_O2 = 2.0e-5 x (T/298)^1.75 = 2.04e-4 m2/s at 850 C, C_O2 = p / (R T) x y = 10.85 mol/m3 x y, M_C 0.012 kg/mol, rho_c ~ 800 kg/m3 (char of a 34 % moisture sub-bituminous, textbook).
  | d0 | y O2 3 % | 5 % | 8 % |
  |---|---|---|---|
  | 1 mm | 126 s | 75 s | 47 s |
  | 2 mm | 502 s | 301 s | 188 s |
  | 3 mm | 1130 s | 678 s | 424 s |
  With the design O2 at the furnace (Fig 7 3.6 % at the exit, more in the lower furnace) and d50 ~ 2 mm: **tauC ~ 300 s**. Carbon in the bed at MCR then = 89 x 0.2867 / 3.6 x 300 = 2.1 t = 1.1 % of the 194 t bed (CFB textbook range 0.5 ~ 3 %: plausible).
- **PC page needed:** the coal size of the design (crusher spec K1AU3-D2-0-102 PSD, or FHI P2S7 Tab 2 coal size) to fix d50. Until then 300 s is a CALC with d50 2 mm, written NO-SOURCE on d50 only.

**Effect on the j11 case** (same 82.5 MW deficit, 10 min, CALC): bed drop 206 C without char; 184 C with tauC 150 s; **161 C with tauC 300 s (860 -> 699 C)**; 134 C with 600 s. Char helps but does not, alone, keep the bed above 700 C if the coal is held 20 T/H under the need for 10 min. So the coal cut itself must be checked too (section 5).

## 3. (B) Where the volatiles burn: the fast answer of the steam
The volatiles leave the coal in the dense bed but burn where the oxygen is. The dense lower furnace gets the PA only; the SA comes in above it. Oxygen in the PA against the demand of the fuel (design, FHI Fig 12 / 13, Tab 2 stoichiometric air 5.43 kg / kg):

| % MCR | PA T/H | coal T/H | air needed 5.43 x coal | PA / need |
|---|---|---|---|---|
| 100 | 354 | 89.5 | 486 | 0.73 |
| 60 | 236 | 56.0 | 304 | 0.78 |
| 40 | 245 | 38.5 | 209 | 1.17 |

So at 60 ~ 100 % the zone under the SA ports burns only 73 ~ 78 % of the fuel; the rest burns above the SA ports. If the SA ports are above the lower-furnace lump of the model (the refractory zone, grate FL +6,400 to FL +14,264.6), that heat goes into the suspension (to the upper walls and the SH panels) at once, which is the fast steam answer the plant has, and the bed is not charged with it.
```
fUp = max(0, 1 - PA / (afs x Fb))    share of the burnt heat released above the SA ports (capped at fV: only volatiles and CO leave the bed)
qBed = (1 - fUp) x qFuel ;  qSus = fUp x qFuel   (qSus adds to the suspension stream: Cs (Tb - tgF) = qWu + qPan - qSus)
```
- **PC page needed:** the SA port elevation (FHI furnace GA, K1AU3-B-0-001 or the SA nozzle drawing). If the SA ports are inside the refractory zone (below FL 14,264.6), (B) changes nothing in the model and only (A) applies. Do not code (B) before this is read.
- Note: P2S4 of the FHI manual describes staged combustion (PA under-stoichiometric, SA above): the split above is that design, worked out with the design flows.

## 4. (C) Solve the anchors again, then kKL
Order, because each changes the next:
1. **Bed inventory to Fig 9** (P1 step 2): t0 = 1630 x 119.1 m2 = **194.2 t** at 100 %; at 40 ~ 60 % the design DP is 1380 = 164.3 t, so the inventory share in phi is 1380 / 1630 = **0.847** at 60 %. (The DPICFG108 SV must follow Fig 9 with the load: logic / operator set point; check the ABC-009A SV source: if the drawing has no load curve, the operator sets it, per Fig 9, as a procedure step.)
2. **Anchor at 150 MW** (tbA 860, tgF 840, walls 146.45 MW, panels 62.5 MW, drum 338.5 C), same CALC as beta.348 but with qBed = (1 - fUp) qFuel if (B) applies: `Cs = (qWu + qPan - qSus) / (tbA - tgF)`, `cSol = Cs - gcp`, `uaS` from the profile. With (A) only, the anchor does not move (steady Fb = F).
3. **kKL at the FHI 60 % point** (Fig 12 air 371 T/H, Fig 13 coal 56.0, Fig 8 furnace 755 C, bed 860 held, inventory share 0.847):
   `phi60 = (solids heat flow needed) / cSol`, from the bed balance at those flows (Jennie's d3solve.cjs, the app's laws);
   `uRel60 = 371 / 596 = 0.6225` (same Tb); `kKL = -ln(phi60 / 0.847) / (1 / uRel60 - 1)`.
   If d3solve used inventory share 1, the 3.80 becomes **~3.5** with 0.847 (CALC: phi60 = e^(-3.80 x 0.6064) = 0.0999; 0.0999 / 0.847 = 0.118; -ln 0.118 / 0.6064 = 3.52). Check which one d3solve used; the physics is the second.
4. Check c = kKL U0 / H = kKL x 5.4 / 36.13: 0.53 ~ 0.57 s^-1, inside Kunii & Levenspiel 0.5 ~ 10 s^-1 (sand d50 0.15 ~ 0.30 mm, Tab 3). Write it as `DESIGN-SRC: FHI P2S7 Fig 8 / 9 / 12 / 13 at 60 % MCR`.

## 5. The coal cut on the way down (why j11 tripped) and what to check
The bed falls when the coal is held under the need. That depth and time come from the boiler master and the steam storage, so check these before blaming the bed:
- **The pressure set point on the way down.** HB: main steam 126 ata from 60 % up, sliding below (98.9 ata at 30 %). If the PIC-COBM SV follows the logic MW -> pressure curve, the pressure does not have to fall on the way 150 -> 90, and the stored steam does not push the BM down. Read the SV source of PIC-COBM (ABC-001C) and the load rate HIC-MWRL 3 MW/min: the coal answer must stay inside the CCS feedforward (BM demand from the MW demand) plus a small trim.
- **The coal low limits of the logic** (ABC-004A feeder MV limits, FIC-CF): they bound the undershoot. A drawing limit counts; a new limit in code does not (no patch).
- **The pass test:** with (A) and kKL solved, a ramp 150 -> 90 -> 45 MW at the logic rate with every loop in AUTO: the coal stays within -10 T/H of its steady need, and the bed stays **above 820 C** (ABC-026 LOW alarm) at 90 MW and **above 700 C with margin** at 45 MW. If the coal still dips deeper, the fault is in the steam storage or the BM path, not the bed: report it as its own finding.

## 6. Expected curve (targets for the test)
Load basis: HB MW -> main steam -> % MCR (MSF / 460). Values from `docs/accept/curves/curves.json`.

| MW (HB case) | MSF T/H | % MCR | air T/H (Fig 12) | coal T/H (Fig 13) | furnace avg C (Fig 8) | furnace DP mmH2O (Fig 9) | bed C |
|---|---|---|---|---|---|---|---|
| 150 (100 %) | 458.3 | 99.6 | 596 | 89.5 | 840 | 1630 | 850 ~ 870 (SU:10198) |
| 127.5 (85 %) | 387.6 | 84.3 | ~485 (80 %) | 77.0 | PC | 1550 | 850 ~ 870 |
| 105 (70 %) | 318.8 | 69.3 | 427 | 64.0 | PC | 1440 | 850 ~ 870 |
| 90 (60 %) | 273.4 | 59.4 | 371 | 56.0 | 755 | 1380 | 850 ~ 870 |
| 75 (50 %) | 231.9 | 50.4 | 332 | 47.0 | PC | 1380 | calculated by the model, > 820 |
| 60 (40 %) | 190.8 | 41.5 | 365 | 38.5 | 660 | 1380 | calculated, > 820 |
| 45 (30 %) | 149.95 | 32.6 | logic floor 446 (FHI 365 at 40 %) | 32.3 (Fig 13 slope) | 610 (Fig 2 table) | 1380 | 745 +/- 25 (ACCEPTANCE CALC, logic air), MFT limit 700 |

At 45 MW the margin to the 700 C coal-firing permissive is only ~45 C with the logic air floor (446 T/H, ABC-002 LN5 / ABC-006). That is the plant logic, not a model fault; the operator procedure at low load (burners in service = mix firing permissive > 450 C, ABC-027 -> DITL-19 row 17) is the protection. The test at 45 MW should be run both ways: on coal only, and with the start-up burners in service as the procedure says.

## 7. Tests (fast, headless)
1. `tests/regress/bed_heatup.js` (energy check U.bbQ, beta.366): must still close within 3 % with the char store.
2. New, steady: at the 7 HB cases with the FHI air and coal, the bed, Fig 8 furnace and Fig 9 DP of the table above (`tools/accept/part1.cjs` rows + a sweep of `docs/accept/curves`).
3. New, dynamic: 150 MW, a 5 MW step down and up: no drum level HH (the reason 3.8 was held); then the ramp 150 -> 90 -> 45 at the logic rate (section 5 pass test). Headless, settle 20 / window 10 while working; the full run once for the PR.
4. Char store at MCR: U.cbed ~ 0.61 x 89 x tauC / 3600 = 4.5 t coal-eq at 300 s (2.1 t of carbon): check it reads that.

## 8. PC pages (one sitting)
1. Coal size: crusher spec K1AU3-D2-0-102 R0 (PSD) or FHI P2S7 Tab 2 coal size (tauC).
2. SA port elevation: FHI furnace GA / SA nozzle drawing (decides if (B) applies).
3. ABC-001C PIC-COBM SV source and the MW -> pressure curve; ABC-004A feeder MV limits (already in the app sheets: read in the app, no PC needed).
4. ABC-009A DPICFG108 SV: fixed or load curve (in the app sheets).
