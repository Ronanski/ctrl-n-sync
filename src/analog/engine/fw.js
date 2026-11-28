/* Phase 11 part 5 (MODEL FEEDWATER : NANA, user 2026-11-27 11:05 AM PHT "Ok sinisimulan naba plant model? Gawin nio na").
   The feedwater part of the ONE plant model, the EXISTING code moved here from unit.js and repaired in place (user 2026-11-27 "Baka
   naman may existing na plant model na"; ownership /mnt/project-files/phase11/ownership-2026-11-27.md): the feed pumps (AN_FW), the
   HP heaters and drains (AN_HP, AN_HD, AN_HL), the feedwater / spray tags (AN_FWT), the feedwater valves (AN_SUFW, AN_MFW). New: the
   deaerator energy balance (AN_DA) below. It replaces the
   loop model of PICCD1104 (plant.js, MEI + source.js R.PICCD1104 cap / floor) and the 25 % split of the turbine
   steam to the deaerator (plant.js anCycFlows daIn); both are removed. Boundary (ports.js, Phase 11 port thread): condensate at the deaerator inlet -> economizer inlet.
   RULES.md 3.12 / rule 0: first principles + design data only; no per-load table, no constant fitted to a snapshot or a trend. NO-FIT-OK: rule text
   Design data (read on the PC 2026-11-27, /mnt/project-files/phase11/fw/pc-reads-2026-11-27.md):
     K1AU3-D1-0-038 R0 p3, K2MC2F-001 rev 1 deaerator H-1104: operating 5.05 kg/cm2 G, water 158.4 C, steam in 310.3 C; inlet steam
       26.79 t/h, water 362.59 t/h, outlet 458.73 t/h (the HP heater drains 69.35 t/h enter by the flash inlet N6: 362.59 + 26.79 +
       69.35 = 458.73); empty 9,830 kg, operating 13,370 kg (water 3.54 t).
     same doc p8, K2MC2G-001 rev 3 storage tank T-1104: 158.4 C, 5.05 kg/cm2 G, empty 40,000 kg, operating 140,400 kg (water 100.4 t),
       volume 120.9 m3, ID 3338.
     Hitachi heat balance PPE-14-0725 R1 case 1 (turbine.js AN_TB c1): deaerator extraction stage 6.369 ata at 458,327 kg/h main steam. */

/* Phase 11 NANA 2026-11-28: specific heat of the vessel steel, kJ/kg K, at T C. The heater and deaerator shells are SA516-70 (plain
   C-Mn steel) with SA387-11 CL2 (1.25Cr-0.5Mo) courses on the HP heater shells (YUA PC read 2026-11-28). DESIGN-SRC (material property):
   Incropera & DeWitt, Fundamentals of Heat and Mass Transfer, Table A.1, plain carbon steel: 434 J/kg K at 300 K, 487 at 400 K,
   559 at 600 K, 685 at 800 K; a straight line between the printed points. The Cr-Mo courses are taken at the same line (the alloy is
   1.75 % by mass; their share of each shell is not printed). Was a fixed 0.49 (textbook, no temperature). */
function anSteelCp(T) {
  const x = [26.85, 126.85, 326.85, 526.85],
    y = [0.434, 0.487, 0.559, 0.685],
    t = Math.max(x[0], Math.min(x[3], isFinite(T) ? T : x[0]));
  for (let i = 1; i < 4; i++) if (t <= x[i]) return y[i - 1] + ((y[i] - y[i - 1]) * (t - x[i - 1])) / (x[i] - x[i - 1]);
  return y[3];
}
/* water enthalpy kJ/kg at P kg/cm2 G (at least its saturation pressure) and T C */
function fwHw(P, T) {
  const Tc = Math.max(0.01, Math.min(350, +T || 0)),
    Pg = Math.max(+P || 0, typeof steamPsat === 'function' ? steamPsat(Tc) : 0);
  return steamR1((Pg + 1.0332) * 0.0980665, Tc + 273.15).h; /* IAPWS-IF97 region 1, steam.js (one copy) */
}

/* THE DEAERATOR (H-1104 + storage tank T-1104): one well mixed body of saturated water with its metal.
   Energy: (M cw + Mm cm) dT/dt = sum of m_i (h_i - hf(T)) over what comes in (the feedwater leaves at hf(T), it changes no
   temperature); the steam that condenses and the cold condensate are both in the sum. Pressure = saturation of T (IF97 region 4,
   steam.js), not below the atmosphere: below 100 C the vessel holds air through its vents (the start-up vent and the air
   extraction N4 are open to the atmosphere while it is cold), so PT-CD1104 reads 0 kg/cm2 G, never a vacuum.
     M   the water: 100.4 + 3.54 = 103.94 t at the normal level (operating less empty weight, K2MC2G-001 / K2MC2F-001), plus the level
         read from normal x the storage tank kg per mm of plant.js AN_CYC.kgmm.da;
     Mm  the metal: 40,000 + 9,830 = 49,830 kg (empty weights), SA516-70 (deaerator 12t, storage tank 19t; YUA PC read 2026-11-28,
         /mnt/project-files/nana-heater-material-reads-2026-11-28.md), cm = anSteelCp(T) (plain carbon steel, see there);
     cw  dhf/dT of the water at T (IF97, numerical);
   In:
     extraction no. 3 (heat balance "deaerator" stage, PD-013) through MV-TS1003 (DITL-96) and its two non-return valves (XV-TS1710 /
     1740, tcs-dev.js positions): steam flows from the higher pressure side, both ways (anDaLine, compressible; reverse = the deaerator
     steam back to the turbine until the NRVs close); k from the design point: 26.79 t/h at the stage 6.369 ata against the deaerator
     5.05 + 1.0332 = 6.083 ata (dP 0.286), rho of the steam at the deaerator inlet 310.3 C (IF97).
     The stage pressure, temperature and enthalpy are the port ext.da of the turbine part (RIN, turbine.js anTbPorts); not written =
     no steam (ports.js rule 3); a port without h: IF97 at its P and T;
     pegging steam PCV-AS1030 from the auxiliary steam header: the port aux.peg {m t/h, h kJ/kg} of the aux steam part (SUZU, the valve
     in its header substeps; Phase 11 2026-11-27, was U.asF.w1030 and IF97 at U.asP and a fixed 350 C); not written = no steam;
     the No.1 HP heater normal drain (primary valve LCV-HD1105-1 of unit.js anHdStep, which carries the No.2 cascade and a tube leak)
     at its drain temperature (U.hpD1);
     the condensate after the No.3 LP heater (port cd.out when written, else plant.js anCycFlows fda at the LP heater outlet U.lpHt.H3).
   Out: the feedwater to the pumps (plant.js AN_CYC.ffw) at hf(T). Vent steam: not modelled (no flow in the design data).
   Mass: the steam, the pegging steam and the drain join the storage water: U.daIn (plant.js anCycFlows adds it to the deaerator
   level and takes the turbine part of it from the condenser).
   Check at the design point (tests/lanes/fw/deaerator.cjs): 362.59 t/h at 114.9 C + 69.35 at 166.3 + steam at 310.3 C and
   6.083 ata balance at 158.4 C with 26.8 t/h of steam. */
const AN_DA = {
  M0: 103.94 /* t water at the normal level, DESIGN-SRC: K2MC2G-001 + K2MC2F-001 operating - empty weight */,
  Mm: 49.83 /* t metal, DESIGN-SRC: K2MC2G-001 40,000 + K2MC2F-001 9,830 kg empty */,
  w0: 26.79 /* t/h DESIGN-SRC: K2MC2F-001 steam inlet */,
  Px0: 6.369 /* ata DESIGN-SRC: HB PPE-14-0725 case 1 deaerator stage */,
  Pd0: 5.05 + 1.0332 /* ata DESIGN-SRC: K2MC2F-001 operating 5.05 kg/cm2 G */,
  Tx0: 310.3 /* C DESIGN-SRC: K2MC2F-001 steam in */,
};
/* the extraction line as a compressible flow (ISA-75.01 gas form, as unit.js anStmW): w = k Y sqrt(rho1 x P1), x = min(xc, dP / P1),
   Y = 1 - x / (3 xc), xc = (1.3 / 1.4) 0.7; from the higher pressure side (forward: the stage, reverse: the deaerator steam space);
   k from the design point (26.79 t/h, 6.369 -> 6.083 ata, 310.3 C) */
function anDaLine(P1, P2, rho1) {
  const xc = (1.3 / 1.4) * 0.7,
    x = Math.min(xc, Math.max(0, (P1 - P2) / P1));
  return P1 > P2 && rho1 > 0 ? (1 - x / (3 * xc)) * Math.sqrt(rho1 * x * P1) : 0;
}
AN_DA.k = AN_DA.w0 / anDaLine(AN_DA.Px0, AN_DA.Pd0, steamRho(AN_DA.Px0 - 1.0332, AN_DA.Tx0));
/* the deaerator pressure transmitter PT-CD1104 (ABC-056 AI0417, U.xt.dea) is written by this model: it is not a loop model any more */
function anFwStart(U) {
  if (U.own && U.xt && U.xt.dea) for (const [S2, b] of U.xt.dea) U.own.add(S2.rt.st[b.id]);
  U.da = null; /* a new start: the water is read again from the transmitter of the state */
}
function anDeaStep(U, dt) {
  /* a save point made before this model has a U.own without PT-CD1104 (as anAuxStep for the aux steam transmitters) */
  if (U.own && U.xt && U.xt.dea && U.xt.dea.some(([S2, b]) => !U.own.has(S2.rt.st[b.id]))) anFwStart(U);
  const K = AN_DA,
    pg = id => anPortGet(U, id),
    fin = x => (x != null && isFinite(x) ? +x : NaN),
    Ta = isFinite(U.Tamb) ? U.Tamb : 30,
    lvl = typeof AN_CYC !== 'undefined' && AN_CYC.y && isFinite(AN_CYC.y.da) ? AN_CYC.y.da : 0,
    kgmm = typeof AN_CYC !== 'undefined' && AN_CYC.kgmm ? AN_CYC.kgmm.da() : 39.4,
    M = Math.max(5, K.M0 + (lvl * kgmm) / 1000);
  if (!U.da || !isFinite(U.da.T)) {
    /* start: the water at the saturation of the transmitter as the state holds it (a vented cold tank: its own temperature) */
    const p0 = U.xt && U.xt.dea ? anUnitVal(U.xt.dea) : NaN;
    U.da = { T: isFinite(p0) && p0 > 0.02 ? steamTsat(p0) : Ta };
  }
  const T = U.da.T,
    Pd = Math.max(0, steamPsat(T)) /* kg/cm2 G; vented below 100 C */,
    hf = fwHw(Pd, T),
    cw = (fwHw(Pd, T + 0.5) - fwHw(Pd, T - 0.5)) / 1,
    /* extraction no. 3: the port of the turbine (ext.da, RIN: stage pressure ata, h, T); not written = no steam (ports.js rule 3) */
    pX = pg('ext.da'),
    Pxa = isFinite(fin(pX && pX.P)) ? fin(pX.P) : 0,
    mov = typeof anDitlPos === 'function' ? anDitlPos('DITL-96', 0) : null,
    /* the No.3 extraction NRVs XV-TS1710 (primary) and XV-TS1740 (secondary) in series with MV-TS1003: the positions of the TCS
       device model (tcs-dev.js U.dev.nrv ex3p / ex3s: open on load, closed by the cylinder on a trip or off line) */
    nv = U.dev && U.dev.nrv ? U.dev.nrv : {},
    nrv = Math.min(nv.ex3p ? +nv.ex3p.p || 0 : 0, nv.ex3s ? +nv.ex3s.p || 0 : 0) / 100,
    open = (mov == null ? 1 : Math.max(0, Math.min(1, mov / 100))) * nrv,
    Pda = Pd + 1.0332,
    TxC = Pxa > 0.05 ? Math.max(steamTsat(Pxa - 1.0332), isFinite(fin(pX.T)) ? fin(pX.T) : 0) : Ta,
    /* signed: + the stage steam into the deaerator; - (RIN 2026-11-28, load rejection) the deaerator steam space and the flash of its
       saturated water back into the turbine while the stage pressure falls below the deaerator, until the NRVs close (2 s on the air
       dump, KARATU VCL-5101-H, /mnt/project-files/rin-extraction-2026-11-28.md), at the saturated steam of the deaerator */
    wx =
      open > 0
        ? Pxa >= Pda
          ? open * K.k * anDaLine(Pxa, Pda, steamRho(Pxa - 1.0332, TxC))
          : -open * K.k * anDaLine(Pda, Math.max(0.01, Pxa), steamRho(Pd, steamTsat(Pd)))
        : 0,
    hx =
      wx < 0
        ? steamH(Pd, steamTsat(Pd) + 0.01) /* the saturated steam of the deaerator going back */
        : isFinite(fin(pX && pX.h))
          ? fin(pX.h)
          : Pxa > 0.05
            ? steamH(Pxa - 1.0332, TxC) /* h of the port P and T */
            : 0,
    /* pegging steam: the port aux.peg of the aux steam part (SUZU) */
    pP = pg('aux.peg'),
    wp = isFinite(fin(pP && pP.m)) ? Math.max(0, fin(pP.m)) : 0,
    hp = isFinite(fin(pP && pP.h)) ? fin(pP.h) : 0,
    /* HP gland leak B: the port lk.b of the turbine (RIN), it joins the extraction line to the deaerator (HB PPE-14-0725 note B,
       DEA heater G 26786 = line 22225 + 4561 kg/h); not written = none (ports.js rule 3) */
    pB = pg('lk.b'),
    wb = isFinite(fin(pB && pB.m)) ? Math.max(0, fin(pB.m)) : 0,
    hb = isFinite(fin(pB && pB.h)) ? fin(pB.h) : 0,
    /* HP heater normal drain */
    h5 = (U.hd || []).find(h => h.k === 'H5'),
    wd = h5 && isFinite(h5.w1) ? Math.max(0, h5.w1) : 0,
    td = isFinite(U.hpD1) ? U.hpD1 : T,
    /* condensate */
    pC = pg('cd.out'),
    /* condensate: the port of the condensate part (cd.out, MEI); not written = none (ports.js rule 3) */
    wc = isFinite(fin(pC && pC.m)) ? fin(pC.m) : 0,
    tc = isFinite(fin(pC && pC.T)) ? fin(pC.T) : Ta,
    hc = isFinite(fin(pC && pC.h)) ? fin(pC.h) : fwHw(Pd, tc),
    Q = (wx * (hx - hf) + wb * (hb - hf) + wp * (hp - hf) + wd * (fwHw(Pd, td) - hf) + wc * (hc - hf)) / 3.6 /* kW */,
    C = M * 1000 * cw + K.Mm * 1000 * anSteelCp(T) /* kJ/K */;
  if (dt > 0) U.da.T = Math.max(Ta - 5, Math.min(200, T + (Q * dt) / C));
  const Pn = Math.max(0, steamPsat(U.da.T));
  Object.assign(U.da, { P: Pn, M, wx, wb, wp, wd, wc, hx, Q, Pxa, rho: anWaterRho(U.da.T), rhoL: anWaterRho(isFinite(U.Tamb) ? U.Tamb : 30) }); /* rho / rhoL: the BFWP suction PT-FW1115 (plantsw.js W.sucP) */
  U.daIn = wx + wb + wp + wd; /* T/H into the storage water besides the condensate */
  U.daTb = wx; /* the turbine steam taken by the deaerator (the condenser does not get it) */
  if (U.xt && U.xt.dea) anUnitWrite(U.xt.dea, Pn);
  anPortSet(U, 'dea', { P: Pn + 1.0332, T: U.da.T, L: lvl });
  /* the extraction steam the heaters draw (T/H), for the turbine steam path (RIN tbDraws) */
  const e2 = isFinite(U.hpF2) ? U.hpF2 : 0,
    e1 = isFinite(U.hpF1) ? Math.max(0, U.hpF1 - e2) : 0;
  anPortSet(U, 'ext.w_hp', { m: e2 + e1 + wx, x: { hp2: e2, hp1: e1, da: wx } });
}
/* 3.2.1 (IRENE: FEEDWATER plant model; docs/versions/v3.2.1/FEEDWATER_PLANT_MODEL.md). The boiler feed water pumps P-1115A / B
   (BFWP) of flow diagram PD-016 / 003.
   Sources:
     BFWP         KSB HGC 5/1+6 (O&M L7 BFP, sheet 1 / 2 of the data sheet, curve Q43446D at 3580 rpm, 158.4 C, sp. gr. 0.9093):
                  491.04 T/H at 1750 m, shut-off 2254.6 m, discharge 165.1 kg/cm2g at suction 6.0, 2946 kW (motor 3550 kW),
                  minimum recirculation 151 m3/h (ARC valve); curve 2250 m at 100, 2140 at 300, 2010 at 400, 1620 at 600 m3/h; power
                  1700 kW at 150, 2230 at 300, 2580 at 400, 3100 at 600 m3/h;
     DITL-23B     row 25 PT-FW1011 < 155 kg/cm2 = M.3210 BFWP OUTLET PRESSURE LOW (the standby BFWP in AUTO starts, DITL-22 / 23A);
                  row 26 DPT-FW1115-A strainer DP > 0.8 / 0.9 kg/cm2, alarm > 0.6.
   How it works: flow of a running pump = the feedwater to the drum (plant.js AN_CYC.ffw) / running pumps, at least the ARC minimum
   flow 151 m3/h; outlet PT-FW1011 = suction (plantsw.js sucP) + head of the curve (the data sheet: 6.0 + 1750 m x 0.9093 / 10 =
   165.1 kg/cm2g; kz 0); running = the DITL-23A machine (A) / #B (B);
   current (Phase 11 NANA 2026-11-27, was a plant screen current x shaft power ratio, no design source): the motor of the pump, NO-FIT-OK: history note
   TECO AEZW-S2 "Boiler Feed Water Pump MOTOR DATA SHEET" p1 (DESIGN-SRC): 3550 kW, 2 pole, 6600 V, 60 Hz, direct coupling (fixed
   speed 3580 rpm: no hydraulic coupling or scoop), at 100 % load 355 A, efficiency 96.2 %, power factor 91.0 % (355 = 3550 / (0.962
   x 0.91 x sqrt3 x 6.6), the sheet closes). Induction motor: the active current = shaft power / (efficiency x sqrt3 x V), the
   magnetizing (reactive) current = 355 x sin(acos 0.91) = 147 A, held at rated voltage; I = sqrt(Ia^2 + Ir^2). Part load (Phase 11
   NANA 2026-11-28; the TECO A-2 motor document prints the 100 % point only, YUA PC read /mnt/project-files/nana-fw-reads-2-2026-11-28.md):
   the textbook induction motor loss split from the rated point, losses = fixed (core, friction, windage) + load^2 x variable (I^2 R),
   rated losses 3550 (1 / 0.962 - 1) = 140.2 kW, split so that the efficiency is highest at 75 % load (fixed = variable x 0.75^2, the
   textbook design point): fixed 50.5, variable 89.7 kW; input = shaft + fixed + variable (shaft / 3550)^2. Was the rated 96.2 % at
   every load.
   suction strainer (Phase 11 NANA 2026-11-27, was a plant screen DP and a 0.4 branch loss with no design
   source): KSB Y strainer, Filteration Engineers FE/KSB/GAD/YST/FR-3453-02 rev 03 (O&M V7 BFP, "14 Y TYPE STRAINER" p2; YUA PC read
   2026-11-27, /mnt/project-files/nana-doc-reads.md): 250 NB, 40 mesh, design 563.5 m3/h at 158.4 C, maximum allowable pressure drop
   0.10 kg/cm2 clean (0.15 at 50 % clogged). Turbulent flow through a screen: dP = k Q^2 (the square law), k from the clean point. The
   pump inlet PT-FW1115 = suction header - strainer DP; the suction pipe loss between the header and the strainer is not modelled:
   FW-1-001 / 002 / 003 are 12" SCH 40 (line list K1AU3-L1-0-011 R0 sheet 21, 481.7 t/h; PD-017 R2), the length and fittings are
   NOT IN DOCS (YUA PC read 2026-11-28). At 481.7 t/h in 12" SCH 40 the velocity is about 1.8 m/s (0.017 kg/cm2 per 10 m of pipe,
   Darcy f 0.013): small against the strainer 0.1. */
const AN_FW = {
  sg: 0.9093 /* DESIGN-SRC: KSB data sheet sp. gr. at 158.4 C: the curves pP below are at this density; the pumped water uses anFwSg */,
  qQ: [0, 100, 200, 300, 400, 500, 540, 600, 700],
  qH: [2254.6, 2250, 2215, 2140, 2010, 1840, 1750, 1620, 1380],
  pQ: [0, 150, 300, 400, 540, 600],
  pP: [1170, 1700, 2230, 2580, 2946, 3100],
  qMin: 151,
  kz: 0,
  mkW: 3550 /* DESIGN-SRC: TECO AEZW-S2 data sheet */,
  mA: 355 /* A at 100 %, DESIGN-SRC: TECO AEZW-S2 data sheet */,
  mPf: 0.91 /* DESIGN-SRC: TECO AEZW-S2 data sheet */,
  mLf: (3550 * (1 / 0.962 - 1) * 0.5625) / 1.5625 /* kW fixed losses (TECO 3550 kW at 96.2 %), DERIVED: rated losses split for the highest efficiency at 75 % load */,
  mLv: (3550 * (1 / 0.962 - 1)) / 1.5625 /* kW load losses at rated load, DERIVED as mLf */,
  mV: 6.6 /* kV */,
  stK: 0.1 / (563.5 * 563.5) /* kg/cm2 per (m3/h)^2, clean strainer, DESIGN-SRC: KSB FE/KSB/GAD/YST/FR-3453-02 r03 */
};
/* Phase 11 NANA (2026-11-27): THE RH AND HP BYPASS SPRAY WATER from the BFWP 3rd stage, in place of 29.5 / 67 T/H x MV x
   sqrt((BFWP discharge - RH pressure) / (165.4 - 34.9)) (a design flow scaled from the pump DISCHARGE, which the spray line does not
   see).
   Sources (YUA PC read 2026-11-27, /mnt/project-files/nana-bfp-interstage-2026-11-27.md; RIN valve read /mnt/project-files/rin-valve-reads.md):
     the line     PD-017 Rev 1 D-7: each BFWP interstage nozzle (FW-1-025 / 026, 3", checks V-FW1003 / 1005) -> FW-1-016 -> FE-FW1059 ->
                  V-FW1047 -> XV-FW1061 (DITL-79) -> STR-FW1008 -> TCV-FW1060 -> check V-FW1050 -> FW-1-020 to the HP bypass
                  desuperheater (PD-011); the RH branch the same (XV-FW1151, TCV-FW1150). No orifice is drawn. Hitachi bypass diagram
                  488 Table 1 point 3 "HP spray (BFP interstage)".
     the pump     KSB HGC 5/1+6, 7 stages, tap-off at the 3rd stage (curve Q43446D, read about +-10 m): 894 m at 0, 857 at 300, 816 at
                  400, 722 at 540 (design), 661 at 600 m3/h; data sheet 997274702 item 8 bleeding stage pressure 69.4 kg/cm2 g at
                  turbine trip. Tap pressure = suction - strainer DP + head x 0.9093 / 10 (the same law as the discharge, anFwStep).
     TCV-FW1060   E2-0-123 R1 A PDF p15: Cv 10.3 at 1.25 in, modified equal %, air fail closed; sizing (Cv % at travel %):
                  Cv 0.68 / 24, 1.70 / 34 (COND 2; COND 3 prints Cv 1.30 at the same 34 %, taken as a misprint), 6.88 / 73 %
                  travel (the printed Cv over 10.3: 6.6, 16.5, 66.8 %).
     TCV-FW1150   Copes-Vulcan, Cv 6.2, modified linear, air fail closed (L21 sheet, YUA PC read 2026-11-28,
                  /mnt/project-files/nana-fw-reads-2-2026-11-28.md): sizing COND 1 21 t/h 68.9 -> 45.9, Cv 5.37 at 87 % travel;
                  COND 2 1 t/h 83.2 -> 9.03, Cv 0.14 at 5 %: the printed points with 0 and 100 % (was linear, NO-SOURCE).
     flow         liquid, IEC 60534: W kg/h = 27.3 Cv sqrt(dP bar x rho); the line from the tap to the valve inlet: dP = k W^2, k from
                  the turbine trip case of both sheets: tap 69.4 kg/cm2 g (KSB item 8) against the TCV-FW1060 COND 1 inlet 68.34 kg/cm2 a
                  at 30.019 t/h: k = (69.4 - 67.31) / 30.019^2. With P1 = tap - k W^2 the flow is W = a sqrt(dP / (1 + a^2 k)),
                  a = 0.0273 Cv sqrt(0.980665 rho) t/h, dP = tap - outlet (kg/cm2).
     outlet       the cold reheat pressure (HP bypass) and the RH pressure (RH spray), as before. */
const AN_BYS = {
  tQ: [0, 300, 400, 540, 600] /* m3/h, DESIGN-SRC: KSB curve Q43446D 3rd-stage tap-off */,
  tH: [894, 857, 816, 722, 661] /* m */,
  kL: (69.4 - (68.34 - 1.0332)) / (30.019 * 30.019) /* kg/cm2 per (t/h)^2, DESIGN-SRC: KSB 997274702 item 8 + E2-0-123 TCV-FW1060 COND 1 */,
  hp: { cv: 10.3, x: [0, 24, 34, 73, 100], y: [0, 6.6, 16.5, 66.8, 100] } /* travel %, Cv % = printed Cv / 10.3, DESIGN-SRC: E2-0-123 R1 TCV-FW1060 */,
  rh: { cv: 6.2, x: [0, 5, 87, 100], y: [0, (0.14 / 6.2) * 100, (5.37 / 6.2) * 100, 100] } /* travel %, Cv %, DESIGN-SRC: L21 TCV-FW1150 sizing COND 2 / COND 1 */
};
/* spray water t/h through a valve of Cv (at its opening) from the tap at Pis to the outlet P2 (kg/cm2 g), water density rho kg/m3 */
function anSprW(Cv, Pis, P2, rho) {
  const dP = Pis - P2,
    a = 0.0273 * Cv * Math.sqrt(0.980665 * rho);
  return Cv > 0 && dP > 0 && rho > 0 ? a * Math.sqrt(dP / (1 + a * a * AN_BYS.kL)) : 0;
}
/* Phase 11 NANA 2026-11-28: the specific gravity of the pumped water = the deaerator water (IF97 saturated water, plant.js anWaterRho, at
   U.da.T; ambient water before the deaerator has a state). The pump head in metres does not change with the density; the pressure it
   gives does (dp = rho g H) and the volume flow is the mass flow / rho. Was the data sheet 0.9093 (158.4 C) at every load: at part load
   the deaerator water is colder and denser, so the discharge read low (45 MW about 4 % of the head) */
function anFwSg(U) {
  return anWaterRho(U.da && isFinite(U.da.T) ? U.da.T : isFinite(U.Tamb) ? U.Tamb : 30) / 1000;
}
/* the BFWP discharge (kg/cm2 g) at a total feedwater flow w (T/H), with the pumps that run now: the same law as anFwStep */
function anFwPdAt(U, w) {
  const K = AN_FW,
    sg = anFwSg(U),
    n = (U.fwRun || []).reduce((a, r) => a + (r ? 1 : 0), 0),
    ps = typeof window !== 'undefined' && window.WORLD && WORLD.sucP ? WORLD.sucP() : NaN,
    Ps = isFinite(ps) ? ps : 0;
  if (!n) return Ps;
  const q = Math.max(K.qMin, Math.max(0, w) / sg / n);
  return Math.max(0, Math.min(250, Ps - K.stK * q * q + (sg / 10) * swInterp(K.qQ, K.qH, q) - K.kz));
}
/* a BFWP motor at a shaft power kW (TECO data sheet, see AN_FW): current I (A), electrical input P (kW) and Q (kvar) from the same
   numbers (Phase 11 YUI: P / Q go to the house load, port q.motor.NANA) */
function anFwEl(kW) {
  const K = AN_FW,
    V = Math.sqrt(3) * K.mV,
    Ir = K.mA * Math.sqrt(1 - K.mPf * K.mPf),
    L = Math.max(0, kW) / K.mkW,
    Ia = kW > 0 ? (Math.max(0, kW) + K.mLf + K.mLv * L * L) / V : 0;
  return { I: Math.sqrt(Ia * Ia + Ir * Ir), P: V * Ia, Q: V * Ir };
}
function anFwStep(U, dt) {
  const K = AN_FW,
    sg = anFwSg(U),
    dr = d => (typeof anDitlRun === 'function' ? anDitlRun(d) : null),
    /* a running pump with its suction manual valve closed (V-FW1001 / 1002) gives no head (dry: the motor protection is not modelled) */
    run = [
      ['DITL-23A', 'M.3343', 'V-FW1001'],
      ['DITL-23A #B', 'M.3344', 'V-FW1002']
    ].map(([d, m, v]) => (anFv(v) < 5 ? 0 : dr(d) != null ? (dr(d) === 1 ? 1 : 0) : srcBit([m]) > 0.5 ? 1 : 0)),
    n = run[0] + run[1],
    ffw = typeof AN_CYC !== 'undefined' && isFinite(AN_CYC.ffw) ? Math.max(0, AN_CYC.ffw) : 0,
    /* an HP heater tube leak passes the pumps too (anHpLeak, last step) */
    q = n ? Math.max(K.qMin, (ffw + (U.hlW ? U.hlW[0] + U.hlW[1] : 0)) / sg / n) : 0,
    ps = typeof window !== 'undefined' && window.WORLD && WORLD.sucP ? WORLD.sucP() : NaN,
    Ps = isFinite(ps) ? ps : 0;
  U.fwRun = run;
  U.fwQp = Math.round(q);
  /* the 3rd-stage tap-off (KSB curve Q43446D lower curve): the RH and HP bypass spray water (PD-017 FW-1-025 / 026 -> FW-1-016) */
  U.fwPis = Math.max(0, Math.min(250, n ? Ps - K.stK * q * q + (sg / 10) * swInterp(AN_BYS.tQ, AN_BYS.tH, q) : Ps));
  /* the pump inlet = the suction header less the strainer DP (stK, KSB strainer drawing) */
  U.fwPd = Math.max(
    0,
    Math.min(250, n ? Ps - K.stK * q * q + (sg / 10) * swInterp(K.qQ, K.qH, q) - K.kz : Ps)
  );
  /* shaft power at this density: the data sheet curve x sg / 0.9093 (the power of a pump goes with rho at the same Q and H) */
  const Ph = n ? (swInterp(K.pQ, K.pP, q) * sg) / K.sg : 0,
    el = run.map(r => (r ? anFwEl(Ph) : null));
  anPortSet(U, 'q.motor.NANA', { P: el.reduce((a, x) => a + (x ? x.P : 0), 0), Q: el.reduce((a, x) => a + (x ? x.Q : 0), 0) });
  run.forEach((r, i) => {
    U['fwI' + i] = r ? Math.round(10 * el[i].I) / 10 : 0;
    U['fwDp' + i] = r ? Math.round(1000 * K.stK * q * q) / 1000 : 0; /* DPT-FW1115-A / B */
  });
  /* 3.2.4-beta.21: PUMP HEAT. All the shaft power goes into the water: dh = P / m (KSB curve Q43446D shaft power pP and head qH at
     the pump flow q). Of the useful part rho g Q H only (1 - T beta) warms the water (isentropic compression of a liquid:
     dT_s = T beta v dp / cp); the losses (P - rho g Q H) warm it in full. dT = (P - (1 - T beta) rho g Q H) / (m cp), with
     T beta = 0.45 and cp 4.33 kJ/kg K at 158.4 C (IAPWS-IF97 water properties). 150 MW (549 m3/h): about 2.8 C; at the ARC minimum
     151 m3/h about 7.5 C. The water to No.1 HPH is the deaerator saturation + dT (anHphStep). */
  const Hy = n ? (sg * 1000 * 9.81 * (q / 3600) * swInterp(K.qQ, K.qH, q)) / 1000 : 0,
    mk = (sg * 1000 * q) / 3600;
  U.fwDT = n && mk > 0 ? Math.max(0, (Ph - 0.55 * Hy) / (mk * 4.33)) : 0;
}
/* Phase 11 rank 5 (NANA, user 2026-11-27 "Go fix 11"): THE HP HEATERS by energy balance and heat transfer, in place of the old
   model (3.2.1 IRENE: FW out = saturation + a fixed TTD, extraction = design flow x feedwater / 458.684 x rise / design rise, shell
   pressure = design x anHb, a MOV under 20 % open = a linear throttle, a 120 s lag; all deleted here).
   Feedwater: deaerator -> No.1 HPH H-1105 (extraction II, MV-TS1002 DITL-95) -> No.2 HPH H-1106 (extraction I = cold reheat,
   MV-TS1001 DITL-94) -> economizer inlet.
   DESIGN-SRC: K1AU3-D1-0-036 R0 heater specifications (PC 2026-11-27, /mnt/project-files/phase11/fw/pc-reads-2026-11-27.md):
     No.1 HPH (PDF p3): shell 14.12 ata, steam in 417.8 C, drain out 166.3 C, 69.347 t/h out (own + the No.2 cascade 45.147 = own
       24.2 t/h, as HB PPE-14-0725 case 1 No.5 24,200 kg/h); tubes 160.7 -> 195.7 C, 458.684 t/h; area 515.5 m2; fabricated 22,200 kg,
       operating 29,300 kg.
     No.2 HPH (PDF p6): steam in 370.2 C, drain out 201.3 C, 45.147 t/h; tubes 195.7 -> 245.4 C, 458.684 t/h; area 516 m2; fabricated
       25,700 kg, operating 29,000 kg. Shell 37.48 ata of the FHI heater O&M L15-4 p14 nominal thermal characteristics (sat 245.37 C,
       TTD -0.05; the spec sheet prints 36.48, which gives no condensing temperature for 245.4 C out: the O&M value is the heat balance
       one). At the turbine (HB case 1): cold reheat 38.64 ata, No.5 14.87 ata: the line drop to the shell 1.16 / 0.75 kg/cm2.
   Check of the design data with IF97 (steam.js): No.2 duty 28.70 MW = 45.11 t/h x (h 370.2 C - h 201.3 C), sheet 45.147;
   No.1 19.37 MW = 24.18 t/h with the cascade flash, sheet 24.2. The data close to 0.1 %.
   THE MODEL, each heater, each step (steady state of the step, the metal as a lag):
     shell pressure  Ps = P port (ext.hp2 / ext.hp1 of the turbine, RIN) - line drop dP0 (e / e0)^2 (P0 / P) / a^2: the drop of a gas
                     line goes with m^2 v (v ~ 1 / P), a = MOV opening (a gate valve: flow area in line with the stroke).
     three zones in counterflow (the heater layout of the O&M: drain cooler, condensing, desuperheating):
       drain cooler  the drain (own + cascade) from saturation Ts down, the feedwater from in to Ta, e-NTU counterflow;
       condensing    Tb = Ts - (Ts - Ta) exp(-UAc / Cfw);
       desuperheat   the steam from its port temperature down to Ts, the feedwater from Tb to out, e-NTU counterflow, at most
                     e (h steam - hg).
     UA of each zone: from the design point above (zone duties from IF97, LMTD), times (feedwater / design)^0.8 off design (the tube side
     film controls, Dittus-Boelter Nu ~ Re^0.8; the condensing shell film is several times higher). No other constant.
     extraction e   from the energy balance of the heater: e (h steam - h drain) + cascade (h cascade - h drain) = feedwater duty.
     metal / water  the outlet follows its steady value with tau = (metal x anSteelCp + water x cp) / (feedwater x cp), metal = the
                    fabricated weight (D1-036: H-1105 22,200 kg, operating 29,300 kg, the heater alone; the 16,900 / 22,320 of the
                    support table is one saddle of two), water = operating - fabricated weight; shells SA516-70 + SA387-11 CL2, heads
                    SA516-70 (YUA PC read 2026-11-28); the water cp is IF97 at the tube pressure and the outlet temperature; no
                    feedwater = no change. */
const AN_HP = {
  m0: 458.684 /* t/h feedwater, DESIGN-SRC: K1AU3-D1-0-036 */,
  nRe: 0.8 /* Dittus-Boelter exponent, DESIGN-SRC: textbook (Incropera 8.60) */,
  /* No.1 HPH (H5, extraction II, port ext.hp1), No.2 HPH (H6, cold reheat, port ext.hp2); DESIGN-SRC: K1AU3-D1-0-036, HB case 1 */
  h: [
    { k: 'H5', port: 'ext.hp1', mov: 'DITL-95', Ps: 14.12, Px: 14.87, Tx: 417.8, Td: 166.3, Ti: 160.7, To: 195.7, e: 24.2, cas: 45.147, Tc: 201.3, Mm: 22200, Mw: 7100 },
    { k: 'H6', port: 'ext.hp2', mov: 'DITL-94', Ps: 37.48, Px: 38.64, Tx: 370.2, Td: 201.3, Ti: 195.7, To: 245.4, e: 45.147, cas: 0, Tc: 0, Mm: 25700, Mw: 3300 }
  ]
};
const HP_A = 0.0980665; /* MPa per ata */
/* water h kJ/kg at P ata, T C (IF97 region 1) and steam h at P ata, T C (region 2) */
const hpHw = (P, T) => steamR1(P * HP_A, T + 273.15).h,
  hpHs = (P, T) => steamR2(P * HP_A, T + 273.15).h;
/* the design UA of the three zones (kW/K), once, from the design data and IF97 */
function anHpGeo() {
  if (AN_HP.g) return AN_HP.g;
  const lm = (a, b) => (Math.abs(a - b) < 1e-6 ? a : (a - b) / Math.log(a / b));
  AN_HP.g = AN_HP.h.map(d => {
    const S = steamSatM(d.Ps * HP_A),
      Ts = S.T - 273.15,
      m = (AN_HP.m0 * 1000) / 3600,
      cp = (hpHw(160, d.To) - hpHw(160, d.Ti)) / (d.To - d.Ti),
      hd = hpHw(d.Ps + 5, d.Td),
      Qdc = (((d.e + d.cas) * 1000) / 3600) * (S.hf - hd),
      Qds = ((d.e * 1000) / 3600) * (hpHs(d.Ps, d.Tx) - S.hg),
      Ta = d.Ti + Qdc / (m * cp),
      Tb = d.To - Qds / (m * cp);
    return {
      dc: Qdc / lm(Ts - Ta, d.Td - d.Ti),
      c: m * cp * Math.log((Ts - Ta) / (Ts - Tb)),
      ds: Qds / lm(d.Tx - d.To, Ts - Tb),
      dP: d.Px - d.Ps
    };
  });
  return AN_HP.g;
}
/* counterflow effectiveness of NTU and Cmin / Cmax */
function anHpEff(ntu, cr) {
  if (!(ntu > 0)) return 0;
  if (cr > 0.999) return ntu / (1 + ntu);
  const x = Math.exp(-ntu * (1 - cr));
  return (1 - x) / (1 - cr * x);
}
/* one heater at steady state. m feedwater t/h through the tubes, Ti C, Pt tube ata, Px / hx extraction port (ata, kJ/kg), a MOV 0 ~ 1,
   cas cascade drain t/h at hc kJ/kg, e guess t/h. Returns { e, To, Td, Ps } (Ps ata) */
function anHpSolve(i, m, Ti, Pt, Px, hx, a, cas, hc, eg) {
  const d = AN_HP.h[i],
    G = anHpGeo()[i],
    ms = (m * 1000) / 3600,
    cs = (Math.max(0, cas) * 1000) / 3600,
    cp = ms > 0 ? (hpHw(Pt, Ti + 20) - hpHw(Pt, Ti)) / 20 : 4.3,
    Cc = ms * cp,
    f = Math.pow(Math.max(0, m) / AN_HP.m0, AN_HP.nRe);
  let e = Math.max(0, isFinite(eg) ? eg : d.e),
    r = { e: 0, To: Ti, Td: Ti, Ps: Math.max(0.05, Px || 0) };
  if (!(ms > 0) || !(Px > 0) || !(a > 0.005) || !isFinite(hx)) {
    /* no steam or no water: the cascade alone flashes into the shell and leaves at its saturation */
    if (cs > 0 && Px > 0 && a > 0.005) r.Td = steamTsatK(r.Ps * HP_A) - 273.15;
    return r;
  }
  for (let it = 0; it < 30; it++) {
    const es = (e * 1000) / 3600,
      Ps = Math.max(0.05, Px - (G.dP * (e / d.e) * (e / d.e) * (d.Px / Px)) / (a * a)),
      S = steamSatM(Ps * HP_A),
      Ts = S.T - 273.15;
    if (Ts <= Ti + 0.01) {
      r = { e: 0, To: Ti, Td: Ti, Ps };
      break;
    }
    /* drain cooler: drain (own + cascade) at Ts, liquid cp from IF97 */
    const cpl = (S.hf - hpHw(Ps + 5, Ts - 20)) / 20,
      Ch = (es + cs) * cpl,
      Cmin = Math.min(Ch, Cc),
      Qdc = Ch > 0 ? anHpEff((G.dc * f) / Cmin, Cmin / Math.max(Ch, Cc)) * Cmin * (Ts - Ti) : 0,
      Td = Ch > 0 ? Ts - Qdc / Ch : Ts,
      Ta = Ti + Qdc / Cc,
      /* condensing */
      Tb = Ts - (Ts - Ta) * Math.exp(-(G.c * f) / Cc),
      /* desuperheater: the steam from its port temperature down to Ts */
      Tx = steamPhM(Px * HP_A, hx).T - 273.15,
      cps = Tx > Ts + 0.1 ? (hx - S.hg) / (Tx - Ts) : 0,
      Cs = es * cps,
      Cm2 = Math.min(Cs, Cc),
      Qds = Cs > 0 ? Math.min(es * (hx - S.hg), anHpEff((G.ds * f) / Cm2, Cm2 / Math.max(Cs, Cc)) * Cm2 * (Tx - Tb)) : 0,
      To = Tb + Qds / Cc,
      hd = hpHw(Ps + 5, Td),
      en = Math.max(0, ((Cc * (To - Ti) - cs * (hc - hd)) / Math.max(1, hx - hd)) * 3.6);
    r = { e: en, To, Td, Ps };
    if (Math.abs(en - e) < 1e-4) break;
    e = 0.5 * (e + en);
  }
  return r;
}
/* the feedwater pumped now (T/H): pump heat only while water moves through the heaters */
function ffwIn() {
  return typeof AN_CYC !== 'undefined' && isFinite(AN_CYC.ffw) ? Math.max(0, AN_CYC.ffw) : 0;
}
function anHphStep(U, dt) {
  const K = AN_HP,
    pos = n => {
      const p = typeof anDitlPos === 'function' ? anDitlPos(n, 0) : null;
      return p == null ? 100 : p;
    },
    ffw = ffwIn(),
    /* the water to the BFWP is the deaerator water (anDeaStep), the pump heat on top (anFwStep) */
    Tda = U.da && isFinite(U.da.T) ? U.da.T : isFinite(U.Tamb) ? U.Tamb : 30,
    Tin = Tda + (ffw > 1 ? U.fwDT || 0 : 0),
    Pt = (isFinite(U.fwPd) ? Math.max(0, U.fwPd) : 0) + 1.0332,
    w = [anHtrPath(anFv('V-FW1009'), anFv('V-FW1010'), anFv('V-FW1011')), anHtrPath(anFv('V-FW1012'), anFv('V-FW1013'), anFv('V-FW1014'))],
    port = i => anPortGet(U, K.h[i].port) || {},
    nvH = U.dev && U.dev.nrv ? U.dev.nrv.ex2 : null,
    hpNrv = nvH ? Math.max(0, Math.min(1, (+nvH.p || 0) / 100)) : 0,
    st = U.hpS || (U.hpS = [{}, {}]),
    /* the cascade into No.1: the No.2 primary drain (LCV-HD1106-1, anHdStep, the last step) at its temperature */
    h6 = (U.hd || []).find(h => h.k === 'H6'),
    cas = h6 && isFinite(h6.w1) ? h6.w1 : 0,
    out = [],
    open = [];
  U.fwPath = Math.min(w[0].p, w[1].p); /* both the tubes and the bypass of a heater shut = no feedwater */
  let T = Tin,
    To = Tin;
  for (let i = 0; i < 2; i++) {
    const p = port(i),
      /* Phase 11 NANA 2026-11-28 (YUI / RIN): No.1 HPH extraction II line has the No.2 extraction NRV (TC-41, swing check VCL-5101-H,
         tcs-dev.js U.dev.nrv.ex2): it shuts on a trip or a reverse flow, so the heater opening is the MOV x the NRV, as the deaerator
         (ex3p / ex3s, anDeaStep). The No.2 HPH draws from the cold reheat line before its check (TC-19 crv): no NRV of its own */
      a = (pos(K.h[i].mov) / 100) * (i === 0 ? hpNrv : 1),
      mt = ffw * w[i].s,
      c = i === 0 ? cas : 0,
      hc = i === 0 && isFinite(U.hpD2) && isFinite(U.hpPs && U.hpPs[1]) ? hpHw(U.hpPs[1] + 1.0332, U.hpD2) : 0,
      r = anHpSolve(i, mt, T, Pt, +p.P || 0, +p.h, a, c, hc, st[i].e),
      /* the same heater with its MOV open (the feedwater the boiler would get with both heaters in: U.fwDrop) */
      ro = a >= 0.999 ? r : anHpSolve(i, mt, To, Pt, +p.P || 0, +p.h, 1, c, hc, st[i].eo);
    st[i].e = r.e;
    st[i].eo = ro.e;
    const ss = T + w[i].s * (r.To - T),
      /* water cp from IF97 region 1 at the tube pressure and the outlet temperature (dh/dT over 1 C; was a fixed 4.4) */
      Tc = isFinite(st[i].T) ? st[i].T : ss,
      cw = isFinite(Tc) ? hpHw(Pt, Tc + 0.5) - hpHw(Pt, Tc - 0.5) : NaN,
      C = K.h[i].Mm * anSteelCp(Tc) + K.h[i].Mw * cw,
      k = ffw > 0 && dt > 0 && isFinite(cw) && cw > 0 ? Math.min(1, (dt * ((ffw * 1000) / 3600) * cw) / C) : 0;
    /* a start (Start at a load, a save point without this state): the heater at the steady state of the first step that has its
       extraction port and the deaerator water; before that the outlet is the steady value */
    if (isFinite(st[i].T)) st[i].T += (ss - st[i].T) * k;
    else if ((p.P > 0 && U.da) || !(+U.ms > 0)) st[i].T = ss;
    const Tl = isFinite(st[i].T) ? st[i].T : ss;
    out.push(r);
    open.push(ss);
    T = Tl;
    To = To + w[i].s * (ro.To - To);
  }
  const [r1, r2] = out;
  U.hpT1 = Math.round(10 * (isFinite(st[0].T) ? st[0].T : open[0])) / 10;
  U.hpT2 = Math.round(10 * (isFinite(st[1].T) ? st[1].T : open[1])) / 10;
  U.hpF2 = Math.round(10 * r2.e) / 10; /* FT-HD1106: No.2 HPH drain = its extraction */
  U.hpF1 = Math.round(10 * (r1.e + r2.e)) / 10; /* FT-HD1105: No.1 HPH drain = its extraction + the No.2 drain (cascade) */
  U.hpD2 = Math.round(10 * (r2.e > 0.5 ? r2.Td : U.hpT2)) / 10; /* TT-HD1106 */
  U.hpD1 = Math.round(10 * (r1.e + cas > 0.5 ? r1.Td : U.hpT1)) / 10; /* TT-HD1105 */
  U.hpPs = [r1.Ps - 1.0332, r2.Ps - 1.0332]; /* kg/cm2 g */
  U.hpMov = [pos('DITL-95'), pos('DITL-94')]; /* MV-TS1002 / MV-TS1001 position % */
  U.fwDrop = Math.max(0, To - open[1]); /* colder than with both MOVs open: boiler.js anAphIn */
}
/* 3.2.1 (IRENE: HEATER LEVELS, docs/versions/v3.2.1/HEATER_LEVELS_PLANT_MODEL.md). The shell (drain) level of the No.2 / No.1 HP and
   No.3 / No.2 / No.1 LP heaters and their drain valves.
   Sources:
     drains       FHI heater O&M (PC, o&m-package-phase-1 L15-3 ~ L15-7, section 1.1.2 "Nominal thermal characteristics"): extraction
                  (= its condensate) No.2 HPH 45.147, No.1 HPH 25.33 (+ the No.2 drain), No.3 LPH 15.246, No.2 LPH 12.27 (+ 15.246 =
                  27.516 out), No.1 LPH 17.861 (+ 27.516 = 45.377 out) t/h at the design feedwater (HP 458.684, LP 362.594 t/h);
     cascade      PD-018 / IO list: No.2 HPH -> No.1 HPH (LCV-HD1106-1) -> deaerator (LCV-HD1105-1); No.3 LPH -> No.2 -> No.1 LPH
                  (LCV-HD1103-1 / 1102-1) -> condenser (LCV-HD1101-1); the alternate valves LCV-HD110x-2 to the condenser / flash chamber;
     shell        section 1.1.1 "Physical characteristics": horizontal; inside diameter / overall length No.1 HPH 1156 / 9595 (K2MC2A-001),
                  No.2 HPH 1250 / 9138.5, No.1 LPH 1130 / 13612, No.2 LPH 1080 / 10679, No.3 LPH 1030 / 10674 mm;
     levels       alarm list (LT-HD110x, from the normal level, mm): H.H. No.1 HPH / No.3 LPH 140, the others 150 (the LS-HD110x level
                  switch, DITL-41; ABC-036 M.0203 = No.2 HPH HI-HI -> DITL-94 closes MV-TS1001); H 40 / 50, L -40 / -50;
     valves       the opening follows the level controller of the DCS logic (ABC-035 ~ 039); at a steady start the MV is the one whose
                  valves pass the design drain (below), no plant screen value.
   How it works (each heater, each step):
     in           its extraction (the HP heaters: AN_HP, with its MOV; the LP heaters: design x main steam / 458.684 x the MOV of DITL-97
                  (MV-TS1004, No.3 LPH) / DITL-98 (MV-TS1005, No.2 LPH)) + the primary drain of the heater before it;
     out          primary + alternate valve: the HP heaters by their valve sheets (AN_HDV, anHdW, Phase 11 NANA 2026-11-27); the LP
                  heaters (MEI) capacity at 100 % x MV / 100 x sqrt(main steam / 458.684); an empty shell (below -300 mm) passes no
                  more than it gets;
     level        d(level) / dt = (in - out) / (water density x surface), surface = diameter x length x 0.7 (NO-SOURCE: the tube bundle
                  and the heads take the rest); the water density of the design drain temperature (steam table).
   NO-SOURCE: 0.7 (the LP heaters; the HP heaters use the shell chord at the level, AN_HD.wl, 2026-11-28). */
const AN_HD = {
  /* key, ABC sheet, level AIs, primary / alternate controller, design extraction t/h, heater before (cascade), H.H. mm, shell ID m,
     length m, water kg/m3, primary capacity t/h at 100 % (150 MW), extraction MOV (DITL) */
  h: [
    [
      'H6',
      'ABC-036',
      ['AI0677', 'AI0853'],
      'LICHD11061',
      'LICHD11062',
      45.147,
      null,
      140,
      1.25,
      9.1385,
      864,
      null /* AN_HDV */,
      'DITL-94'
    ],
    [
      'H5',
      'ABC-035',
      ['AI0676', 'AI0852'],
      'LICHD11051',
      'LICHD11052',
      25.33,
      'H6',
      140,
      1.156,
      9.595,
      900,
      null /* AN_HDV */,
      'DITL-95'
    ],
    [
      'H3',
      'ABC-039',
      ['AI0675', 'AI0851'],
      'LICHD11031',
      'LICHD11032',
      15.246,
      null,
      140,
      1.03,
      10.674,
      961,
      21.3 /* LCV sheet, E2-0-123 */,
      'DITL-97'
    ],
    [
      'H2',
      'ABC-038',
      ['AI0674', 'AI0850'],
      'LICHD11021',
      'LICHD11022',
      12.27,
      'H3',
      140,
      1.08,
      10.679,
      974,
      35.3 /* LCV sheet, E2-0-123 */,
      'DITL-98'
    ],
    [
      'H1',
      'ABC-037',
      ['AI0673', 'AI0849'],
      'LICHD11011',
      'LICHD11012',
      17.861,
      'H2',
      140,
      1.13,
      13.612,
      990,
      69.9 /* LCV sheet, E2-0-123 */,
      null
    ]
  ],
  F0: 458.684,
  fA: 0.7 /* the LP heaters (MEI): NO-SOURCE, see the head of this block */,
  /* the HP heaters (Phase 11 NANA 2026-11-28): the water surface is the chord of the shell at the level, the normal water level
     0.480 (No.2) / 0.455 (No.1) m below the shell CL, K1AU3-D1-0-036 p6 / p3 (YUA PC read 2026-11-28); the tubes through the surface
     are not taken off (NO-SOURCE: the tube layout was not read) */
  wl: { H6: 0.48, H5: 0.455 },
  /* the LP alternates from their valve sheets, E2-0-123 (team-files/plant-study/12-assumptions.md); the HP drains: AN_HDV */
  alt: { H3: 27.0, H2: 37.5, H1: 57.3 }
};
/* Phase 11 NANA (2026-11-27): THE HP HEATER DRAIN VALVES by their valve sheets, in place of a capacity at 100 % x opening x
   sqrt(main steam / 458.684) (LCV-HD1106 45.147 / 0.5 and its alternate 142 t/h were NO-SOURCE; LCV-HD1105 91 t/h).
   Source: K1AU3-E2-0-123 R1 (Copes-Vulcan), YUA PC read 2026-11-27, /mnt/project-files/nana-bfp-interstage-2026-11-27.md section 3:
     valve          to                 Cv      trim            sizing cases (t/h, P1 -> P2 kg/cm2 g, T C, Cv, travel %)
     LCV-HD1106-1   No.1 HP heater     25      CAV-B9          45.147 37.48 -> 14.48 201.3 12.9 57; 9.482 / 4.5 12.17 -> 4.67 155.3 4.54 32 / 2.15 20
     LCV-HD1106-2   condenser          40      CAV-B9          45.147 38.08 -> 0.28 201.3 12.7 43; 9.482 / 4.5 12.77 -> 0.17 155.3 4.38 24 / 2.08 14
     LCV-HD1105-1   deaerator          50      CAV-B9          69.347 12.62 -> 7.62 166.3 38.2 75; 15.144 / 6.9 3.17 -> 2.97 127.7 40.9 80 / 18.6 46
     LCV-HD1105-2   condenser          69.27   one stage Hush  69.347 14.72 -> 0.72 166.3 31.5 65; 15.144 / 6.9 5.27 -> 0.27 127.7 10.3 41 / 4.68 24
   Cv against travel: the three printed points of each sheet (Cv / rated) with 0 and 100 % (the curve pages were not tabulated).
   Flow: IEC 60534 liquid, W kg/h = 27.3 Cv sqrt(dP rho), dP the smaller of P1 - P2 and the choked limit FL^2 (P1 - FF Pv),
   FF = 0.96 - 0.28 sqrt(Pv / Pc) (Pc 220.64 bar, IEC), Pv the saturation of the drain temperature (steam.js), bar absolute.
   FL 0.90: the sheets do not print it; their flashing / cavitating cases (all 9 choked cases of the four valves) give FL 0.897 ~
   0.904 by the same law, and the one liquid case (LCV-HD1105-1 COND 1, 4.90 bar < 0.81 x 6.81) is not choked: one FL closes them all.
   P1 / P2 at the valve (Phase 11 NANA 2026-11-28, was a sheet dz held at every flow, the heater elevations NOT IN DOCS then):
     the sheet P1 / P2 are the HB PPE-14-0725 heater numbers (ata) carried as "kg/cm2 g" (LCV-HD1106-1 P1 37.48 = the No.2 HPH
     shell 37.48 ata); the sheet's own arithmetic (FL 0.90 above) reads them as gauge, so the sizing check keeps that reading, and
     the plant model uses the true absolute pressure with the same trim FL.
     inlet  = shell + static head of the drain water from the shell water level down to the valve - the inlet line loss;
     outlet = the place it drains to + the outlet line loss (the flashing two-phase line: its static head is in this loss; the
              loss goes with W^2 x the mixture specific volume, homogeneous flash at the place pressure, IF97, anHdVm);
     a line loss goes with flow^2 (turbulent), its size from the COND 1 case of the sheet less its static head.
   Elevations (YUA PC read 2026-11-28, /mnt/project-files/pc-reads-npsh-elev-2026-11-28.md): No.1 / No.2 HPH shell CL GL.+17300
   (DERIVED: supports 1600 on the mezzanine GL.+15700, K1AU3-D1-0-036 p3 / p6; fits LT-HD1105 / 1106 taps GL.+17755 / +17630,
   E2-0-102 p18), normal water level 455 / 480 below the CL (D1-036 printed) = GL.+16845 / +16820; valves (E2-0-102 as-built):
   LCV-HD1106-1 GL.+16050 (p18), LCV-HD1105-1 GL.+27850 (p37, roof), LCV-HD1105-2 / 1106-2 GL.+9948 / +9900 (p3).
   Check of the static head on the sheets: LCV-HD1106-2 P1 38.08 - 37.48 = 0.60 kg/cm2 = 6.92 m x 865 kg/m3 (0.599) and
   LCV-HD1105-2 14.72 - 14.12 = 0.60 = 6.90 m x 901 kg/m3 (0.622): the sheets carry the as-built heads.
     valve          z (m, water level - valve)  inlet loss at W0 (sheet dP1 - head)   outlet loss at W0 (sheet P2 - place)
     LCV-HD1106-1   16.820 - 16.050 = 0.770     0.067                                  14.48 - 14.12 = 0.36
     LCV-HD1106-2   16.820 -  9.900 = 6.920     0 (0.60 - 0.599)                        0.28 - 0.07 = 0.21
     LCV-HD1105-1   16.845 - 27.850 = -11.005   0.511 (-1.50 + 0.989)                   7.62 - 6.083 = 1.537
     LCV-HD1105-2   16.845 -  9.948 = 6.897     0 (0.60 - 0.622)                        0.72 - 0.07 = 0.65
   LCV-HD1105-1 lifts its drain to the deaerator on the roof frame (H-1104 CL GL.+35600, E2-0-102 p37 / A3-0-002 Section A-A, YUA
   2026-11-28, nana-da-elevation-2026-11-28.md): at COND 1 its outlet 7.62 is above the saturation of the 166.3 C drain (7.41), so the
   riser is liquid: outlet static z2 = 35.6 - 27.85 = 7.75 m (0.698 kg/cm2 at 901 kg/m3), its loss 1.537 - 0.698 = 0.839. The
   others flash at the outlet (two-phase): z2 0, all in the loss, which goes with W^2 v_m / v_m0 (Phase 11 NANA 2026-11-28, was W^2 at
   one density, the mixture density NO-SOURCE then): v_m the homogeneous mixture after an isenthalpic flash of the drain (saturated
   water at its temperature) to the place pressure, v_m0 the same at the sheet COND 1 (T0 drain C, pp0 place ata).
   (W0 = the COND 1 flow: 45.147 / 69.347 t/h; place: No.1 HPH 14.12 ata, deaerator 6.083 ata K2MC2F-001, condenser 0.07 ata HB.)
   Water density: IF97 saturated water (plant.js anWaterRho). */
const AN_HDV = {
  FL: 0.9 /* DESIGN-SRC: E2-0-123 R1 HD1105 / HD1106 sizing cases (derived, see above) */,
  H6: {
    p: { cv: 25, x: [0, 20, 32, 57, 100], y: [0, 8.6, 18.16, 51.6, 100], w0: 45.147, z: 16.82 - 16.05, l1: 0.067, z2: 0, l2: 14.48 - 14.12, T0: 201.3, pp0: 14.12 },
    a: { cv: 40, x: [0, 14, 24, 43, 100], y: [0, 5.2, 10.95, 31.75, 100], w0: 45.147, z: 16.82 - 9.9, l1: 0, z2: 0, l2: 0.28 - 0.07, T0: 201.3, pp0: 0.07 }
  },
  H5: {
    p: { cv: 50, x: [0, 46, 75, 80, 100], y: [0, 37.2, 76.4, 81.8, 100], w0: 69.347, z: 16.845 - 27.85, l1: 0.511, z2: 35.6 - 27.85, l2: 7.62 - 6.083 - 0.698 },
    a: { cv: 69.27, x: [0, 24, 41, 65, 100], y: [0, 6.76, 14.87, 45.47, 100], w0: 69.347, z: 16.845 - 9.948, l1: 0, z2: 0, l2: 0.72 - 0.07, T0: 166.3, pp0: 0.07 }
  }
};
/* the valve alone: t/h through valve V at opening x % between p1 and p2 bar a at the valve, drain T C (IEC 60534 liquid, choked) */
function anHdV(V, x, p1, p2, T) {
  const Cv = (V.cv * swInterp(V.x, V.y, Math.max(0, Math.min(100, +x || 0)))) / 100,
    pv = (steamPsat(T) + 1.0332) * 0.980665,
    FF = 0.96 - 0.28 * Math.sqrt(Math.max(0, pv) / 220.64),
    dP = Math.max(0, Math.min(p1 - p2, AN_HDV.FL * AN_HDV.FL * (p1 - FF * pv))),
    rho = anWaterRho(T);
  return Cv > 0 && isFinite(dP) ? 0.0273 * Cv * Math.sqrt(dP * rho) : 0;
}
/* m3/kg of the drain (saturated water at T C) flashed at constant enthalpy to the place at P ata: homogeneous mixture, IF97 */
function anHdVm(P, T) {
  const p = Math.max(0.002, P * 0.0980665),
    S = steamSatM(p),
    hl = steamR1(Math.max(p, (steamPsat(T) + 1.0332) * 0.0980665), T + 273.15).h,
    x = Math.max(0, Math.min(1, (hl - S.hf) / (S.hg - S.hf)));
  return (1 - x) * steamR1(p, S.T).v + x * steamV2(p, S.T);
}
/* drain t/h from the shell at P1 to the place at P2 (kg/cm2 g), drain T C: the valve with the static head and the line losses of
   AN_HDV (loss = l (W / w0)^2). W = a sqrt(dP) with dP = dP0 - k W^2 solves to W = a sqrt(dP0 / (1 + a^2 k)), for the liquid
   (p1 - p2) and for the choked limit FL^2 (p1 - FF pv) alike: no iteration */
function anHdW(V, x, P1, P2, T) {
  const Cv = (V.cv * swInterp(V.x, V.y, Math.max(0, Math.min(100, +x || 0)))) / 100,
    rho = anWaterRho(T),
    a = 0.0273 * Cv * Math.sqrt(rho),
    b = 0.980665 /* kg/cm2 -> bar */,
    p1 = (P1 + 1.0332 + (rho * V.z) / 10000) * b /* bar a at the valve before the inlet loss */,
    p2 = (P2 + 1.0332 + (rho * V.z2) / 10000) * b /* bar a at the valve outlet before the outlet loss */,
    k1 = (V.l1 * b) / (V.w0 * V.w0),
    k2 = ((V.l2 * b) / (V.w0 * V.w0)) * (V.T0 ? anHdVm(P2 + 1.0332, T) / anHdVm(V.pp0, V.T0) : 1) /* flashing outlet: W^2 v_m */,
    pv = (steamPsat(T) + 1.0332) * b,
    FF = 0.96 - 0.28 * Math.sqrt(Math.max(0, pv) / 220.64),
    F2 = AN_HDV.FL * AN_HDV.FL,
    wl = p1 > p2 ? a * Math.sqrt((p1 - p2) / (1 + a * a * (k1 + k2))) : 0,
    wc = p1 > FF * pv ? a * Math.sqrt((F2 * (p1 - FF * pv)) / (1 + a * a * F2 * k1)) : 0;
  return Cv > 0 && isFinite(wl) && isFinite(wc) ? Math.min(wl, wc) : 0;
}
/* 3.2.4 (JENNIE, priority list: HP heater tube leak): trainer faults 'hl.1' / 'hl.2' (world.js), a tube of the No.1 / No.2 HP heater
   leaks feedwater into the shell. Physics: the feedwater (BFWP discharge U.fwPd, PT-FW1011) is far below its saturation at the shell
   pressure (No.2 HPH tube 195.7 ~ 245.4 C, shell 36.48 kg/cm2 A sat 245 C; No.1 HPH tube 160.7 ~ 195.7 C, shell 14.12 sat 196 C, plant-study
   09 section 5), so it does not flash in the hole: a sharp orifice, w = Cd A sqrt(2 rho dP), Cd 0.61 (textbook), rho of the tube water.
   The hole: 3 mm (TRAINER-SET: the size of the fault the instructor starts, not a plant value); like the boiler tube leak (AN_TL) its jet cuts the next tubes and the open area doubles
   every 10 min (TRAINER-SET, as AN_TL), with no cap: "a tube which bursts will cause the surrounding tubes to burst" (HP heater O&M, FHI 2015, Sect 2 p2), so it keeps failing until the operator takes it out; the pump curve (anFwStep) limits the flow. The tubes leak only while they are
   pressurised: the inlet or the outlet valve open (V-FW1012 / 1013 No.2, V-FW1009 / 1010 No.1); bypassed and isolated = no leak.
   Where it goes: into the shell with the condensate of the extraction (anHdStep): the drain valves open, the alternate to the condenser
   takes the rest, then LEVEL HIGH-HIGH (LS-HD1106 / 1105, DITL-94 / 95 close the extraction MOV). The BFWP passes it too (anFwStep).
   The water comes back by the drains, so the cycle inventory does not change; the heat to bring the leak water to the shell saturation
   (about 1 % of the extraction per 26 T/H) is left out. U.hlW = [No.1, No.2] T/H, U.hlA = area / 3 mm hole */
const AN_HL = { d: 0.003 /* m, TRAINER-SET */, cd: 0.61, t2: 600 /* s, TRAINER-SET, as AN_TL */, rho: [880, 840] /* kg/m3, tube water ~178 / ~220 C, AN_WATER_RHO */ };
function anHpLeak(U, dt) {
  const W = typeof window !== 'undefined' ? window.WORLD : null,
    K = AN_HL,
    th = p => Math.max(0, Math.min(1, p / 20)),
    A0 = (Math.PI * K.d * K.d) / 4,
    Ps = U.hpPs || [0, 0],
    pz = [Math.max(th(anFv('V-FW1009')), th(anFv('V-FW1010'))), Math.max(th(anFv('V-FW1012')), th(anFv('V-FW1013')))];
  U.hlA = U.hlA || [1, 1];
  U.hlW = [0, 1].map(i => {
    const on = !!(W && W.ft && W.ft.has('hl.' + (i + 1)));
    U.hlA[i] = on ? (U.hlA[i] > 1 ? U.hlA[i] : 1) * Math.pow(2, (dt > 0 ? dt : 0) / K.t2) : 1;
    const dP = Math.max(0, ((isFinite(U.fwPd) ? U.fwPd : 0) * pz[i] - Math.max(0, +Ps[i] || 0)) * 98066.5);
    return on ? (K.cd * A0 * U.hlA[i] * Math.sqrt(2 * K.rho[i] * dP) * 3600) / 1000 : 0;
  });
}
function anHdStep(U, dt) {
  anHpLeak(U, dt);
  if (!U.hd || !U.hd.length) return;
  const K = AN_HD,
    ms = Math.max(0, +U.ms || 0),
    ld = ms / K.F0,
    sq = Math.sqrt(Math.max(0, ld)),
    pos = n => {
      if (!n) return 100;
      const p = typeof anDitlPos === 'function' ? anDitlPos(n, 0) : null;
      return p == null ? 100 : p;
    },
    thr = p => Math.max(0, Math.min(1, p / 20)),
    mv = o => (o ? Math.max(0, Math.min(100, +o.S.rt.v[o.n] || 0)) : 0),
    out = {};
  const ctl = (k, t) => {
    const x = AN.sheets.find(y => y.name === k),
      c = x && x.S && AN.hmiCtrls ? (AN.hmiCtrls(x.S) || []).find(q => q.tag === t) : null;
    return c && c.out != null ? { S: x.S, n: c.out } : null;
  };
  for (const h of U.hd) {
    const d = K.h.find(x => x[0] === h.k);
    if (!d) continue;
    const [k, , , , , ext, from, hh, D, Ls, rho, cap1, mov] = d;
    if (!h.v1) h.v1 = ctl(h.sh, h.c1);
    if (!h.v2) h.v2 = ctl(h.sh, h.c2);
    if (!isFinite(h.y)) {
      const v = anUnitVal(h.L[0]);
      h.y = isFinite(v) ? v : 0;
      h.off = h.L.map(l => (isFinite(anUnitVal(l)) ? anUnitVal(l) - h.y : 0));
      /* 3.2.1-beta.148 (LISA, Mina fresh 150 MW: NO.1 / NO.2 LPH level HIGH): "Start at 150 MW" is a steady state, so the level stands at
         the SV of its primary controller (the DCS set point, ABC-035 ~ 039). Before, it started from the transmitter, which the loop model
         moved at the end of the load while a part-load valve opening was still on it: LPH2 -5 -> -97 mm, then the controller refilled it
         past HIGH (alarm list LT-HD1102 H 10 mm) */
      if (U.hdSeed && h.v1) {
        const c = (AN.hmiCtrls(h.v1.S) || []).find(q => q.out === h.v1.n),
          sv = c && c.q && c.q.sv != null ? +h.v1.S.rt.v[c.q.sv] : NaN;
        if (isFinite(sv)) h.y = sv;
      }
    }
    /* in: the condensate of its extraction + the cascade */
    let ein;
    if (k === 'H6') ein = isFinite(U.hpF2) ? U.hpF2 : 0;
    else if (k === 'H5') ein = isFinite(U.hpF1) && isFinite(U.hpF2) ? U.hpF1 - U.hpF2 : 0;
    else ein = U.lpW && isFinite(U.lpW['lp' + k.slice(1)]) ? U.lpW['lp' + k.slice(1)] : 0; /* Phase 11 rank 6: the steam the LP heater condenses (unit.js anLphStep U.lpW, the port ext.w_lp; the shell MOV and the tubes in it through the shell pressure and the NTU) */
    /* an HP heater tube leak (anHpLeak) joins the condensate in the shell */
    const hl = U.hlW ? (k === 'H5' ? U.hlW[0] : k === 'H6' ? U.hlW[1] : 0) : 0;
    const win = ein + hl + (from && out[from] ? out[from] : 0);
    const c2 = (K.alt[k] != null ? K.alt[k] : cap1) * sq;
    /* the HP drains by their valve sheets (AN_HDV): shell, the place each valve drains to, the drain temperature */
    const hv = AN_HDV[k],
      Pcd = U.pt.cd.P - 1.0332 /* the condenser port of MEI (ata), written every scan */,
      Psh = hv ? +(U.hpPs || [])[k === 'H6' ? 1 : 0] || 0 : 0,
      Pto = hv ? (k === 'H6' ? +(U.hpPs || [])[0] || 0 : U.da && isFinite(U.da.P) ? U.da.P : 0) : 0,
      Tdr = hv ? (k === 'H6' ? U.hpD2 : U.hpD1) : 0,
      wv = (x1, x2) =>
        hv
          ? [anHdW(hv.p, x1, Psh, Pto, Tdr), anHdW(hv.a, x2, Psh, Pcd, Tdr)]
          : [cap1 * sq * (x1 / 100), c2 * (x2 / 100)];
    /* the split range of the drawing (ABC-035 ~ 039): the primary controller MV goes to the primary valve by an F(X) (LN38 ...) and,
       while the primary is AUTO (M.0236 ... = NOT .MAN), to the alternate station by a second F(X) (LN39 ..., EX-MV); the valve
       opening is that F(X) output (the AO is 100 % minus it: the valve opens on a falling signal) */
    if (h.v1 && !h.fx) {
      const S2 = h.v1.S,
        fxs = S2.blk.filter(b => b.k === 'FX' && b.pins.some(p => p.role === 'in' && p.n === h.v1.n)),
        outOf = b => (b.pins.find(p => p.role === 'out') || {}).n,
        toSub = b => S2.blk.some(q => q.k === 'SUB' && q.pins.some(p => p.role === 'in' && p.n === outOf(b)));
      h.fx = { p: fxs.find(toSub) || null, a: fxs.find(b => !toSub(b)) || null };
    }
    const fxv = (b, x) => (b && typeof anFXs === 'function' ? Math.max(0, Math.min(100, anFXs(b.p, x).y)) : x);
    /* "Start at 150 MW" is a steady state: the primary controller starts at the MV whose two valves pass the drain of the load (the
       valve law below, the design drain flow), so no level moves at the first step */
    if (U.hdSeed && sq > 0 && h.v1 && h.fx) {
      const flow = x => {
        const f = wv(fxv(h.fx.p, x), h.fx.a ? fxv(h.fx.a, x) : 0);
        return f[0] + f[1];
      };
      let a = 0,
        b = 100;
      for (let i = 0; i < 30; i++) {
        const m = (a + b) / 2;
        if (flow(m) < win) a = m;
        else b = m;
      }
      const x = (a + b) / 2,
        c = (AN.hmiCtrls(h.v1.S) || []).find(q => q.out === h.v1.n);
      if (c) {
        if (h.v1.S.rt.st[c.b.id] && typeof hmiPidSet === 'function') hmiPidSet(h.v1.S.rt.st[c.b.id], c.b, x);
        h.v1.S.rt.v[h.v1.n] = x;
      }
      /* Mina F14: the alternate starts where the primary puts it. Before, it kept a part-load opening: the No.2 LP heater drained at
         once and stood LOW-LOW, then the controller came back over 5 minutes */
      if (h.v2 && h.fx.a) {
        const x2 = fxv(h.fx.a, x),
          c3 = (AN.hmiCtrls(h.v2.S) || []).find(q => q.out === h.v2.n);
        if (c3 && h.v2.S.rt.st[c3.b.id] && typeof hmiPidSet === 'function') hmiPidSet(h.v2.S.rt.st[c3.b.id], c3.b, x2);
        h.v2.S.rt.v[h.v2.n] = x2;
      }
    }
    /* 3.2.1 the drain valves have an airlock (AN_AV): below 3.5 kg/cm2 of instrument air they stay where they are */
    let [w1, w2] = wv(anAv(h.c1, h.fx && h.fx.p ? fxv(h.fx.p, mv(h.v1)) : mv(h.v1)), anAv(h.c2, mv(h.v2)));
    const yc = K.wl[k] != null ? h.y / 1000 - K.wl[k] : null /* m from the shell CL */,
      wS = yc != null ? 2 * Math.sqrt(Math.max(0.0001, (D / 2) * (D / 2) - yc * yc)) : D * K.fA /* surface width m */,
      M = (rho * wS * Ls) / 1000; /* kg per mm */
    if (h.y <= -300 && w1 + w2 > win) {
      const f = w1 + w2 > 0 ? win / (w1 + w2) : 0;
      w1 *= f;
      w2 *= f;
    }
    h.y = Math.max(-320, Math.min(350, h.y + ((((win - w1 - w2) * 1000) / 3600) * dt) / M));
    h.win = win;
    h.w1 = w1;
    h.w2 = w2;
    h.hh = h.y >= hh;
    out[k] = w1;
    h.L.forEach((l, i) => anUnitWrite(l, h.y + (h.off[i] || 0)));
  }
  /* 3.2.1-beta.148 (LISA, Mina: NO.1 HPH level (2) LOW-LOW at 150 MW): the inflow of the first step is not steady (HPH1 108 t/h, then 79 t/h
     one step later: the extraction and the HPH2 cascade start), so a seed on that step left out 109 t/h against in 79 t/h. The drains are
     seeded again on each step until every inflow holds (within 0.5 t/h of the last step), 50 steps at most */
  if (U.hdSeed && sq > 0) {
    const st = U.hd.every(h => isFinite(h.w0) && Math.abs(h.win - h.w0) < 0.5);
    for (const h of U.hd) h.w0 = h.win;
    U.hdSeedN = (U.hdSeedN || 0) + 1;
    if (st || U.hdSeedN >= 50) U.hdSeed = false;
  }
  U.hdLvl = Object.fromEntries(U.hd.map(h => [h.k, Math.round(h.y * 10) / 10]));
  U.hdHH = Object.fromEntries(U.hd.map(h => [h.k, h.hh ? 1 : 0]));
}
const AN_FWT = {
  ms0: 472.7 /* SNAPSHOT-TO-REPLACE (audit-NANA): main steam scale still read by unit.js anUnitTagStep; no feedwater use left */,
  crP: 36.6 / 35.1 /* HP exhaust PICR1901x over the hot reheat pressure, as Pcr of the bypass model */,
  K: 35000 / (9.49 * Math.sqrt(165.3 - 142.2)) / 1000,
  cv: {
    a1: [
      [0, 0],
      [2, 0.17],
      [25, 3.29],
      [68, 9.49],
      [100, 14]
    ],
    a2: [
      [0, 0],
      [6, 0.05],
      [59, 0.99],
      [100, 1.67]
    ],
    b1: [
      [0, 0],
      [10, 0.17],
      [48, 2.46],
      [75, 8.84],
      [100, 15]
    ],
    b2: [
      [0, 0],
      [19, 0.05],
      [90, 0.99],
      [100, 1.5]
    ]
  }
};
function anFwTagStep(U) {
  const K = AN_FWT,
    r1 = x => (isFinite(x) ? Math.round(10 * x) / 10 : null),
    r2 = x => (isFinite(x) ? Math.round(100 * x) / 100 : null),
    ms = Math.max(0, +U.ms || 0),
    /* the extraction transmitters read the turbine stage the turbine model computes (RIN anTbPorts, ports ext.*, P kg/cm2 a, T C):
       PT/TT-TS1013 / 1014 extraction II, PT/TT-TS1017 / 1018 extraction III, TT-TS1023 extraction IV, PT/TT-TS1026 / 1027 extraction V.
       A port not written yet gives no value (no stand-in). Was: fixed plant screen values scaled with the main steam */
    xP = id => {
      const p = anPortGet(U, id);
      return p && isFinite(p.P) && p.P !== null ? r2(Math.max(-1, p.P - 1.0332)) : null;
    },
    xT = id => {
      const p = anPortGet(U, id);
      return p && isFinite(p.T) && p.T !== null ? r1(p.T) : null;
    },
    C = U.fwC || (U.fwC = {}),
    sh = n => AN.sheets.find(y => y.name === n),
    ctl = (n, t) => {
      if (C[t] !== undefined) return C[t];
      const x = sh(n),
        c = x && x.S && AN.hmiCtrls ? (AN.hmiCtrls(x.S) || []).find(q => q.tag === t) : null;
      if (c && c.out != null) return (C[t] = { S: x.S, n: c.out });
      /* a hand station (MAN block, ABC-020 HICHR1002A / B biasing dampers) is not in the controller list: its output net */
      const b = x && x.S ? x.S.blk.find(z => z.k === 'MAN' && (z.tag === t || (z.txt || []).includes(t))) : null;
      return (C[t] = b && b.o && b.o[0] != null && b.o[0] >= 0 ? { S: x.S, n: b.o[0] } : null);
    },
    mvOf = (n, t) => {
      const c = ctl(n, t);
      return c ? Math.max(0, Math.min(100, +c.S.rt.v[c.n] || 0)) : NaN;
    },
    fxs = (n, t, ln) => {
      const k = n + ln;
      if (C[k] === undefined) {
        const x = sh(n),
          c = ctl(n, t);
        C[k] = x && c ? x.S.blk.find(b => b.k === 'FX' && b.p && b.p.ln === ln) || null : null;
      }
      return C[k];
    },
    fx = (n, t, ln, m) => {
      const b = fxs(n, t, ln);
      return b && typeof anFXs === 'function' ? Math.max(0, Math.min(100, anFXs(b.p, m).y)) : NaN;
    },
    pos = n => {
      const p = typeof anDitlPos === 'function' ? anDitlPos(n, 0) : null;
      return p == null ? NaN : p / 100;
    },
    cv = (L, x) => {
      if (!isFinite(x)) return NaN;
      for (let i = 1; i < L.length; i++)
        if (x <= L[i][0]) return L[i - 1][1] + ((L[i][1] - L[i - 1][1]) * (x - L[i - 1][0])) / (L[i][0] - L[i - 1][0]);
      return L[L.length - 1][1];
    },
    drum = (() => {
      const L = C.drum || (C.drum = anUnitAIs('1|AI0128'));
      return anUnitVal(L);
    })(),
    Pda = U.xt && U.xt.dea ? anUnitVal(U.xt.dea) : NaN,
    ps = typeof window !== 'undefined' && window.WORLD && WORLD.sucP ? WORLD.sucP() : NaN,
    pd = isFinite(U.fwPd) ? U.fwPd : NaN,
    ffw = typeof AN_CYC !== 'undefined' && isFinite(AN_CYC.ffw) ? Math.max(0, AN_CYC.ffw) : 0,
    fdr = typeof AN_CYC !== 'undefined' && isFinite(AN_CYC.fdr) ? Math.max(0, AN_CYC.fdr) : 0 /* the drum feed through the economizer */,
    sq = P => (isFinite(pd) && isFinite(P) ? Math.sqrt(Math.max(0, pd - P)) : NaN);
  /* the spray valves follow their controller MV, held by the airlock without air (AN_AV) */
  const H = U.avH || (U.avH = {}),
    held = (t, m) => {
      /* 3.2.1 e5 (engine/faults.js): a spray valve stuck in the field */
      const sk = typeof anFaultStuck === 'function' ? anFaultStuck(t, m) : null;
      if (sk != null) return sk;
      if (!AN_AV.hold[t]) return m;
      const P = anAvP();
      if (!isFinite(P) || P >= AN_AV.lock || !isFinite(m)) return (H['mv:' + t] = m);
      if (H['mv:' + t] == null || !isFinite(H['mv:' + t])) H['mv:' + t] = m;
      return H['mv:' + t];
    },
    m1 = held('TICBR1130', mvOf('ABC-011', 'TICBR1130')),
    m2 = held('TICBR1150', mvOf('ABC-012', 'TICBR1150')),
    z11 = fx('ABC-011', 'TICBR1130', 'LN47', m1),
    z12 = fx('ABC-011', 'TICBR1130', 'LN46', m1),
    z21 = fx('ABC-012', 'TICBR1150', 'LN49', m2),
    z22 = fx('ABC-012', 'TICBR1150', 'LN48', m2),
    w1 = K.K * (cv(K.cv.a1, z11) * pos('DITL-32') + cv(K.cv.a2, z12) * pos('DITL-32 #B')) * sq(anShTap(U, AN_SHDP.s1, drum, ms)) /* the spray goes in at the SH tap 1 (KANA anShTap: the design SH drop law); was a fixed drum - 6.4 square law with no design source */,
    w2 = K.K * (cv(K.cv.b1, z21) * pos('DITL-33') + cv(K.cv.b2, z22) * pos('DITL-33 #B')) * sq(anShTap(U, AN_SHDP.s2, drum, ms)) /* SH tap 2 */,
    Prh = isFinite(U.Prh) ? U.Prh : 0,
    /* the RH and HP bypass spray from the BFWP 3rd stage (AN_BYS, anSprW), at the deaerator water (U.tSr of the last step) */
    Pis = isFinite(U.fwPis) ? U.fwPis : NaN,
    rSp = anWaterRho(isFinite(U.tSr) ? U.tSr : 30) /* IF97 saturated water (plant.js anWaterRho) */,
    cvOf = (V, m) => (isFinite(m) ? (V.cv * swInterp(V.x, V.y, Math.max(0, Math.min(100, m)))) / 100 : NaN),
    wrh = anSprW(cvOf(AN_BYS.rh, held('TICHR1002', mvOf('ABC-019', 'TICHR1002'))), Pis, Prh, rSp) * pos('DITL-35') /* TCV-FW1150, XV-FW1151 */,
    whp = anSprW(cvOf(AN_BYS.hp, held('TICMS1022', mvOf('ABC-051', 'TICMS1022'))), Pis, Prh * K.crP, rSp) * pos('DITL-79') /* TCV-FW1060, XV-FW1061 */,
    cr = U.xt && U.xt.T ? U.xt.T.cr : NaN,
    pcr = Prh * K.crP;
  /* beta.258: the spray water, the feedwater and the flue gas biasing dampers (ABC-020 HICHR1002A RH / HICHR1002B SH) for the heat
     transfer chain (hx.js); numbers only on U */
  U.w1s = isFinite(w1) ? Math.max(0, w1) : 0;
  U.w2s = isFinite(w2) ? Math.max(0, w2) : 0;
  U.wrhs = isFinite(wrh) ? Math.max(0, wrh) : 0;
  U.whps = isFinite(whp) ? Math.max(0, whp) : 0; /* 3.2.4: HP bypass spray water, T/H (TT-MS1022 below, anUnitStepX) */
  /* beta.374 (D30, flow diagram K1AU3-PD-017): the economizer gets the drum feed (AN_CYC.fdr), not the SH spray; the SH spray water is
     the final feedwater after the No.2 HP heater (U.hpT2, FW-1-011 tapped after FE-FW1007), the RH and HP bypass spray water
     (FW-1-016) comes from the BFWP discharge before the HP heaters (deaerator water, U.tSr) */
  U.mEco = typeof AN_CYC !== 'undefined' && isFinite(AN_CYC.fdr) ? Math.max(0, AN_CYC.fdr) : ffw;
  U.tSr = isFinite(Pda) && Pda > 0.05 ? steamTsat(Pda) : isFinite(U.Tamb) ? U.Tamb : 30;
  U.tSp = isFinite(U.hpT2) && U.hpT2 > U.tSr ? U.hpT2 : U.tSr;
  const dA = mvOf('ABC-020', 'HICHR1002A'),
    dB = mvOf('ABC-020', 'HICHR1002B');
  U.dmpR = isFinite(dA) ? dA / 100 : NaN;
  U.dmpS = isFinite(dB) ? dB / 100 : NaN;
  Object.assign(U.tt || (U.tt = {}), {
    'PT-TS1013': xP('ext.hp1'),
    'PT-TS1017': xP('ext.da'),
    'TT-TS1011': r1(cr),
    'PT-TS1026': xP('ext.lp2'),
    'TT-TS1014': xT('ext.hp1'),
    'TT-TS1018': xT('ext.da'),
    'TT-TS1023': xT('ext.lp3'),
    'TT-TS1027': xT('ext.lp2'),
    PICR19011: r2(pcr),
    PICR19012: r2(pcr),
    PICR19013: r2(pcr),
    'PT-FW1115-A': isFinite(ps) ? r1(ps - (U.fwDp0 || 0)) : null /* pump inlet = header - strainer DP */,
    'PT-FW1115-B': isFinite(ps) ? r1(ps - (U.fwDp1 || 0)) : null,
    'TT-FW1011': isFinite(Pda) ? r1(Pda > 0.05 ? steamTsat(Pda) : isFinite(U.Tamb) ? U.Tamb : 30) : null,
    /* Phase 11 NANA: the economizer inlet = drum + the drop from the feedwater valve outlet to the drum at the economizer flow, the
       same law as the valve (AN_MFW kDn 2.2 kg/cm2 at 480 T/H: Raven sheet P2 147.2 against the FHI P2S7 drum 145.0 at MCR); was
       a fixed drum + 3.5 square law with no design source */
    'PT-FW1160': isFinite(drum) ? r1(drum + AN_MFW.kDn * (fdr / AN_MFW.w0) * (fdr / AN_MFW.w0)) : null,
    'ZT-FW1110-1': r1(z11),
    'ZT-FW1110-2': r1(z12),
    'ZT-FW1120-1': r1(z21),
    'ZT-FW1120-2': r1(z22),
    'FT-FW1109': r1(w1),
    'FT-FW1119': r1(w2),
    'FT-FW1149': r1(wrh),
    'FT-FW1059': r1(whp)
  });
}
/* 3.2.3 (boiler model thread, drum level swings on the start-up level control): the start-up feedwater valve FCV-FW1130-2 (ABC-010
   LICBR1001B) from its valve sheet, K1AU3-E2-0-123 p147 (plant-study 12-assumptions #10): Cv max 15.58 at 100 % travel, 120,000 kg/h at
   76 % travel (Cv 11.7) with P1 214.5 and P2 64.6 kg/cm2 (dP 149.9), 6,000 kg/h at 10 % travel (Cv 0.585 at the same dP). Between the
   points of the sheet the Cv is interpolated on a log scale (an equal percentage trim; the sheet gives no curve), below 10 % straight
   to 0. The flow of a liquid goes with the square root of the dP: W = 120 T/H x Cv(x) / 11.7 x sqrt((214.5 - drum pressure) / 149.9),
   P1 = the inlet pressure of the sheet. Before: 30 % of the anchor feedwater at 100 %, linear, no dP (150 T/H full, 15 T/H at 10 %,
   75 T/H at 50 % against the sheet 6 and about 36 T/H) */
const AN_SUFW = {
  pts: [
    [10, 0.585],
    [76, 11.7],
    [100, 15.58]
  ],
  cv76: 11.7,
  w76: 120,
  p1: 214.5,
  dp76: 149.9
};
function anSuFwCv(x) {
  const P = AN_SUFW.pts;
  if (!(x > 0)) return 0;
  if (x <= P[0][0]) return (P[0][1] * x) / P[0][0];
  for (let i = 1; i < P.length; i++)
    if (x <= P[i][0]) {
      const [x0, c0] = P[i - 1],
        [x1, c1] = P[i];
      return c0 * Math.pow(c1 / c0, (x - x0) / (x1 - x0));
    }
  return P[P.length - 1][1];
}
/* 3.2.3-beta.268 (SOHEE): P1 = the BFWP discharge of the plant model (U.fwPd = PT-FW1011, anFwStep: suction + KSB curve head at
   the pump flow) when it is known, as the main feedwater path; the sheet P1 214.5 only before the first pump step. At the Cold hold
   (one pump at the ARC minimum 151 m3/h, head about 2245 m) P1 is about 206 kg/cm2 instead of 214.5 (2 ~ 3 % less flow at drum 37).
   The loss of the line between the pump and the valve is not modelled (NO-SOURCE; at start-up flows it is small). */
function anSuFw(x, pd, p1) {
  const P1 = isFinite(p1) && p1 > 0 ? p1 : AN_SUFW.p1,
    dp = Math.max(0, P1 - Math.max(0, +pd || 0));
  return ((AN_SUFW.w76 * anSuFwCv(x)) / AN_SUFW.cv76) * Math.sqrt(dp / AN_SUFW.dp76);
}
/* 3.2.4-beta.6 (live test of beta.4, 2026-11-17: after a feeder jam with no operator action the MS blow-off opened 130 T/H at 135
   kg/cm2, steam out 612 T/H, and the feedwater stopped at 550 T/H with both BFWPs running: drum level LOW-LOW, MFT). The feedwater was
   the valve opening x the span of the FICFW1007 PV (0 ~ 550 T/H), so it could never pass the top of the transmitter range. Now the
   main feedwater valve FCV-FW1130-1 passes what its trim and its dP let through. Source: K1AU3-E2-0-123 R1 Drawing of Control valve
   p142, Copes-Vulcan control valve metric specification sheet, FHIC item 27 / CV item 32, 8" CL1500 SD-16 Raven trim: COND 1 480,000
   kg/h, P1 163.6, P2 147.2 kg/cm2 g, Cv 154 at 80 % travel; COND 2 450,900 kg/h, 168.1 / 147.2, Cv 129 at 71 %; COND 3 46,000 kg/h,
   214.7 / 64.6, Cv 4.49 at 6 %; max Cv 208.8 at full travel. The Cv is taken straight between the points of the sheet (71 -> 80 ->
   100 % give 2.8 and 2.7 Cv per %, one straight line; the Raven is a staged trim, the sheet gives no curve), below 6 % straight to 0.
   Flow of a liquid: W = 480 T/H x Cv / 154 x sqrt(dP / 16.4) (COND 2 by this law: 454 T/H, sheet 450.9). The dP of the valve is the
   BFWP discharge (U.fwPd, PT-FW1011) less the drum (U.Pd) less the line on each side, both with the square of the flow: pump to valve
   1.5 kg/cm2 at 480 T/H (KSB data sheet discharge 165.1 at 491 T/H against the valve P1 163.6, COND 1), valve to drum 2.2 kg/cm2 at
   480 T/H (P2 147.2 against the drum at MCR 145.0 = SH outlet 129 + SH pressure drop 16, FHI P2S7 design data). Check at 150 MW
   (Start at 150 MW: drum 133.3, BFWP 165.6): 475 T/H at about 64 % travel */
const AN_MFW = {
  pts: [
    [6, 4.49],
    [71, 129],
    [80, 154],
    [100, 208.8]
  ],
  w0: 480,
  cv0: 154,
  dp0: 16.4,
  kUp: 1.5 /* kg/cm2 at w0, pump discharge to the valve */,
  kDn: 2.2 /* kg/cm2 at w0, valve to the drum */
};
function anMainFwCv(x) {
  const P = AN_MFW.pts;
  if (!(x > 0)) return 0;
  if (x <= P[0][0]) return (P[0][1] * x) / P[0][0];
  for (let i = 1; i < P.length; i++)
    if (x <= P[i][0]) {
      const [x0, c0] = P[i - 1],
        [x1, c1] = P[i];
      return c0 + ((c1 - c0) * (x - x0)) / (x1 - x0);
    }
  return P[P.length - 1][1];
}
/* T/H through the main valve at travel x (%), drum pressure pd and BFWP discharge p1 (kg/cm2 g). W^2 = a (p1 - pd - k W^2 / w0^2)
   with a = w0^2 (Cv / cv0)^2 / dp0 and k = kUp + kDn, so W = sqrt(a D / (1 + k a / w0^2)) */
function anMainFw(x, pd, p1) {
  const K = AN_MFW,
    D = Math.max(0, (+p1 || 0) - Math.max(0, +pd || 0)),
    r = anMainFwCv(x) / K.cv0,
    a = (K.w0 * K.w0 * r * r) / K.dp0;
  return a > 0 && D > 0 ? Math.sqrt((a * D) / (1 + ((K.kUp + K.kDn) * a) / (K.w0 * K.w0))) : 0;
}
