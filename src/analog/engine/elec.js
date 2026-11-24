/* 3.2.3 plan c4: a simple electrical model of the unit from the Single Line Diagram (as built):
   - K1AU3E1-0003 rev 2 KEY ONE LINE DIAGRAM: generator G1 176.5 MVA 13.8 kV 0.85 pf -> GMCB G1 10000 A (= 52G1) -> main transformer
     TR 2310 180 / 225 MVA (ONAN / ONFA) 13.8 / 230 kV Z 14 % -> GCB 2310 (SYN, 245 kV 4000 A = 52L1) -> 230 kV line. The unit auxiliary
     transformer TR-1A1 13.8 / 6.6 kV 34 / 44 MVA Z 10 % is tapped between the GMCB and the main transformer and feeds 6.6 kV BUS 1AM
     (4000 A) through VCB1AM; TR-1B1 / TR-1B2 6.6 kV / 460 V 2500 kVA feed the 460 V buses.
   - K1AU3E1-0008: the 6.6 kV motors of bus 1A (ACWP, CEP A / B, BFP A / B, IDF, PAF, SAF, FA blower A / B, PA compressor, seawater pump),
     all with soft starters. Their currents are the plant model currents below (the same values the HMI pages show).
   The house load = the 6.6 kV motors: P = 1.732 x 6.6 kV x I x pf of each motor.
   1.0.0-beta.330 (JENNIE, Audit 3 #5, was "pf 0.85 NO-SOURCE"): the pf of each motor is its MW / Mvar in the ETAP load flow of
   K1AU3-E1-0-307 RA (voltage dip of large motor starting, 2014-02-20), Bus Input Data p A.3 with Branch Connections p A.12 (cable
   C M-xxxx from Bus 1AM to the motor bus): M-1004 PAF 3.919 / 1.545, M-1115A BFP 3.761 / 1.485, M-1220 IDF 3.498 / 1.385 (pf 0.930);
   M-1005 SAF 1.967 / 0.793, M-1501A / B seawater 1.702 / 0.690 (0.927); M-1007A / B FA blower 0.514 / 0.216, M-0703A plant air
   compressor 0.559 / 0.234 (0.922); M-1108A aux cooling water 0.237 / 0.102, M-1116A condensate 0.269 / 0.115 (0.919). A standby
   motor (B / C, no load in the study) has the pf of its running twin.
   1.0.0-beta.332 (JENNIE, Audit 3 #5, was "460 V loads NOT counted, NO-SOURCE for their sum"): the 460 V load of the unit is the
   load flow through its two 6.6 kV / 460 V transformers in the same ETAP study (LOAD FLOW REPORT p A.14, Bus 1AM): TR-1B1 (Bus21)
   0.413 MW / 0.263 Mvar and TR-1B2 (Bus49) 1.218 MW / 0.257 Mvar. Bus49 carries the precipitator (C EP11-2 to Bus51, 0.910 MW /
   0.024 Mvar, pf 1.00, the T/R sets), counted only while the field state says the ESP is in service (AN_SRC.field.esp); the rest,
   0.721 MW / 0.496 Mvar (MCCs, compressors, lighting, UPS), is counted while the unit is on. The coal yard (CY-M), coal unloading
   (CSU), conveyor (CNVR) and water treatment (WT-M) buses hang on Bus 1AM too (7.9 MW in the study) but are common plant loads
   not modelled here.
   Before 52G1 closes the house load comes back from the 230 kV grid through the main transformer and TR-1A1 (back-feed, 52L1 closed).
   House load operation (52L1 open while 52G1 is closed, the ABC-050 input I.0937 "52L1 OPEN FOR HOUSE OPERATION"): the turbine
   carries the house load only (the TCS speed control keeps 3600 rpm; the load swing itself is NO-SOURCE, the model goes to the house
   load at the TCS valve rate; the 106 % speed peak of a load rejection (SU) is not modelled). The relays 78 / 81 open 52L1 in the plant
   (generator protection relay settings, plant study 05); here the instructor opens it. 52L1 closes again from the instructor command:
   the plant synchronizes it with ASD2 (sync check relay 25), the model closes it at once; then the operator raises the load again.
   3.2.4: the unit black-out (BUS 1AM lost, DG1 and EMP-11) is at the end of this file. Not modelled: the 6.6 kV bus transfer HBT12. */
const AN_EL = {
  kV: 6.6,
  mt: 180 /* MVA, TR 2310 ONAN */,
  uat: 34 /* MVA, TR-1A1 ONAN */,
  bus: 4000 /* A, BUS 1AM */,
  /* 460 V load of the unit through TR-1B1 + TR-1B2 (K1AU3-E1-0-307 p A.14): MW, Mvar; ESP T/R sets separately */
  lv: [0.721, 0.496],
  esp: [0.91, 0.024],
  /* plant model currents of the 6.6 kV motors of K1AU3E1-0008, with the pf of each (K1AU3-E1-0-307, see above) */
  mot: [
    ['swIa0', 'Seawater pump A', 0.927],
    ['swIa1', 'Seawater pump B', 0.927],
    ['swIa2', 'Seawater pump C', 0.927],
    ['fnPafI', 'Primary air fan', 0.93],
    ['fnSafI', 'Secondary air fan', 0.927],
    ['fnIdfI', 'Induced draft fan', 0.93],
    ['fnIa', 'Fluidizing air blower A', 0.922],
    ['fnIb', 'Fluidizing air blower B', 0.922],
    ['fwI0', 'Boiler feed water pump A', 0.93],
    ['fwI1', 'Boiler feed water pump B', 0.93],
    ['cdI0', 'Condensate pump A', 0.919],
    ['cdI1', 'Condensate pump B', 0.919],
    ['acI0', 'Auxiliary cooling water pump A', 0.919],
    ['acI1', 'Auxiliary cooling water pump B', 0.919],
    ['paI0', 'Plant air compressor A', 0.922],
    ['paI1', 'Plant air compressor B', 0.922],
    ['paI2', 'Plant air compressor C', 0.922]
  ]
};
function anElec(U) {
  U = U || AN_UNIT;
  if (!U || !U.on) return null;
  /* beta.277: a read only; the panels call it on the page mirror, where it made U.el the Worker does not have (the step makes it) */
  const e = U.el || { l52: true },
    tb = U.tb || {},
    g52 = tb.st === 'sync' || tb.st === 'load',
    G = typeof anGenEl === 'function' ? anGenEl() : null,
    I = AN_EL.mot.reduce((a, [k]) => a + Math.max(0, +U[k] || 0), 0),
    /* the 460 V buses are dead with BUS 1AM in a black-out (U.el.bo; EMP-11 on DG1 is not the unit transformer) */
    LV = e.bo ? 0 : 1,
    ESP = LV && typeof AN_SRC !== 'undefined' && AN_SRC.field && AN_SRC.field.esp ? 1 : 0,
    Pa =
      AN_EL.mot.reduce((a, [k, , pf]) => a + (Math.sqrt(3) * AN_EL.kV * Math.max(0, +U[k] || 0) * pf) / 1000, 0) + LV * AN_EL.lv[0] + ESP * AN_EL.esp[0],
    Qa =
      AN_EL.mot.reduce((a, [k, , pf]) => a + ((Math.sqrt(3) * AN_EL.kV * Math.max(0, +U[k] || 0) * pf) / 1000) * Math.tan(Math.acos(pf)), 0) +
      LV * AN_EL.lv[1] +
      ESP * AN_EL.esp[1],
    Pg = g52 && G ? +U.MW || 0 : 0 /* beta.240: negative = reverse power from the grid */,
    Qg = g52 && G ? G.MVAr || 0 : 0,
    /* the main transformer carries the generator minus the house load (export), or the house load from the grid (back-feed) */
    Pt = e.l52 ? Pg - Pa : 0,
    Qt = e.l52 ? Qg - Qa : 0,
    St = Math.hypot(Pt, Qt),
    Su = Math.hypot(Pa, Qa);
  return {
    l52: e.l52 ? 1 : 0,
    g52: g52 ? 1 : 0,
    house: !e.l52 && g52 ? 1 : 0,
    /* the 6.6 kV side current of the 460 V transformers (beta.332) adds to the motor currents */
    busA: I + (1000 * Math.hypot(LV * AN_EL.lv[0] + ESP * AN_EL.esp[0], LV * AN_EL.lv[1] + ESP * AN_EL.esp[1])) / (Math.sqrt(3) * AN_EL.kV),
    busPct: (100 * (I + (1000 * Math.hypot(LV * AN_EL.lv[0] + ESP * AN_EL.esp[0], LV * AN_EL.lv[1] + ESP * AN_EL.esp[1])) / (Math.sqrt(3) * AN_EL.kV))) / AN_EL.bus,
    aux: Pa,
    auxMVAr: Qa,
    gen: Pg,
    exp: Pt,
    mtMVA: St,
    mtPct: (100 * St) / AN_EL.mt,
    uatMVA: Su,
    uatPct: (100 * Su) / AN_EL.uat,
    src: g52 ? 'generator' : e.l52 ? 'grid (back-feed)' : 'none'
  };
}
/* the line breaker 52L1 as an ABC input (I.0937) and the turbine target on house load; called by the unit step */
function anElecStep(U) {
  const e = U.el || (U.el = { l52: true }),
    tb = U.tb || {},
    g52 = tb.st === 'sync' || tb.st === 'load',
    l = U.di && U.di.l52;
  if (l && l.S.rt.force[l.n] === undefined && l.S.ext.includes(l.n)) l.S.rt.ext[l.n] = e.l52 ? 0 : 1;
  if (!e.l52 && g52) {
    const x = anElec(U);
    if (x) U.tcsT = x.aux;
    /* the turbine is on speed control: the DCS control mode (TCS-DI I.0082 DCS CONTROL MODE ON) drops, so that the TCS does not take the
       turbine master demand of the DCS when 52L1 closes again (NO-SOURCE: the TCS drawings read here do not show this release) */
    const m = U.di && U.di.on;
    if (m && m.S.rt.force[m.n] === undefined && m.S.ext.includes(m.n)) m.S.rt.ext[m.n] = 0;
  }
}
/* instructor command: 0 = open 52L1 (house load operation), 1 = close it */
function anElecL52(U, on) {
  const e = U.el || (U.el = { l52: true }),
    tb = U.tb || {},
    g52 = tb.st === 'sync' || tb.st === 'load';
  on = on !== 0 && on !== false && on !== '0';
  if (on === e.l52) return on ? '52L1 is already closed' : '52L1 is already open';
  if (!on && !g52)
    return 'Open 52L1 only with the generator on line (52G1 closed): before it the house load comes from the grid through 52L1';
  e.l52 = on;
  if (on && g52) {
    /* back on the grid: the TCS keeps the house load as its target, the operator raises the load again */
    tb.tgt = tb.aim = +U.MW || 0;
  }
  return '';
}
/* 3.2.4: the unit black-out (world.js WORLD.ftrip 'el.1am'). 6.6 kV BUS 1AM dead; the 460 V emergency panel EMP-11 comes back on the
   diesel generator DG1 (750 kW, 460 V) through ATS-11 (K1AU3E1-0040: N-BUS from 1B2-M, E-BUS from DG1). The time from the loss to EMP-11
   live again (DG1 start + ATS-11 transfer): 10 s = NO-SOURCE for this unit (no DG1 / ATS-11 setting sheet read); 10 s is the Type 10
   class of NFPA 110 for an emergency power supply. U.el.bo = { t: s since the loss } while the bus is dead */
const AN_EL_BO = { emp: 10 /* s, NO-SOURCE (NFPA 110 Type 10) */ };
function anElecBo(U, on) {
  const e = U.el || (U.el = { l52: true });
  if (on) e.bo = e.bo || { t: 0 };
  else delete e.bo;
}
/* the state for this step: dead = BUS 1AM and the normal 460 V buses dead; emp = EMP-11 live (on DG1 during the black-out) */
function anElecBoStep(U, dt) {
  const b = U.el && U.el.bo;
  if (!b) return { dead: false, emp: true };
  b.t += dt;
  if (b.t >= AN_EL_BO.emp && !b.e) {
    b.e = 1;
    if (typeof window !== 'undefined' && window.WORLD && WORLD.boEmp) WORLD.boEmp();
  }
  return { dead: true, emp: b.t >= AN_EL_BO.emp };
}
