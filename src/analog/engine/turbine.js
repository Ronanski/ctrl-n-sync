/* Phase 11 (plant model, MODEL TURBINE REHEAT : RIN, 2026-11-27; user "Ok sinisimulan naba plant model? Gawin nio na", ownership
   /mnt/project-files/phase11/ownership-2026-11-27.md). THE STEAM TURBINE of the one plant model, MOVED here from unit.js unchanged
   (step B: the move only, the same code and the same numbers; the old copy in unit.js is deleted in the same change, so there is one
   turbine). Step C (below) replaced the per-load heat balance tables AN_TBW / AN_HB with the Stodola stage law and the section efficiencies
   of the design point (rule 0, RULES.md 3.12). The reheat / bypass part of anUnitStep stays in unit.js (its own section). Joined into
   the one analog script before unit.js (src/analog/order.list). */
/* 2.2.0-beta.17 (M4 step 4): the operator on the TCS panel (outside the DCS): 'roll' (open the stop valves, IP start mode, rpm up
   by the ATS), 'sync' (at 3600 rpm: GCB closed, initial load MWinit), 'loadup' (target MW at rateUp MW/min; default 45 = NORMAL
   OPERATION). Returns the state or a reason ('' = done) */
/* 3.2.3-beta.152 S149-3 / S149-4 (Mina, beta.149 normal shutdown): ATS SHUT-DOWN was refused ("Finish step 7 NORMAL OPERATION") and the
   answer went only to the status bar (the TCS / Field menu, the Training buttons), so the press looked silent; a Turbine trip that was not
   taken said nothing either. The engine writes every refused TCS command to the Event log with its reason (the engine only: a mirror
   page gets the line from the worker, like the trip lines of tcs-trip.js) */
const AN_TCS_CMD = {
  roll: 'ROLL',
  sync: 'SYNC',
  loadup: 'LOAD UP',
  shutdown: 'SHUT-DOWN',
  holdoff: 'HOLD OFF',
  trip: 'TURBINE TRIP',
  tripreset: 'TURBINE RESET',
  normal: 'NORMAL OPERATION',
  gov: 'GOV SET',
  llm: 'LOAD LIMIT',
  vtest: 'VALVE TEST',
  ostmain: 'OVERSPEED TEST (MAIN)',
  ostbk: 'OVERSPEED TEST (BK-UP)'
};
function anTurbine(cmd, arg) {
  const r = anTurbine0(cmd, arg);
  if (
    typeof r === 'string' &&
    r &&
    AN_TCS_CMD[cmd] &&
    typeof window !== 'undefined' &&
    window.lsEventAdd &&
    !(window.ENG && ENG.mode === 'mirror')
  )
    lsEventAdd('TCS', 'TCS', AN_TCS_CMD[cmd] + ' not taken: ' + r);
  return r;
}
function anTurbine0(cmd, arg) {
  const U = AN_UNIT;
  if (!U.on || !U.tb) return 'No unit model: start from Cold first';
  const tb = U.tb;
  /* Phase 8: both Modbus lines to the TCS dead = the DCS commands are OFF at the TCS (tcs.js tcsLinkRefuse, TCT090A) */
  const lk = typeof tcsLinkRefuse === 'function' ? tcsLinkRefuse(U, cmd, arg) : '';
  if (lk) return lk;
  /* live run 2026-11-19 (F-CP): LOAD UP with the TCS panel target load and load-up rate { mw, rate %/min }. The rate is the TCS load-up
     rate setting, 0 ~ 5 %/min of 150 MW (rateUp, PR-OPE-5002 LOAD UP 5 %/min); a plain number stays the target MW alone */
  if (cmd === 'loadup' && arg && typeof arg === 'object') {
    const rt = +arg.rate;
    if (isFinite(rt) && rt > 0) U.rateUp = (Math.min(5, rt) * 150) / 100;
    arg = arg.mw;
  }
  /* 3.2.0-beta.66: the 036 TURBINE OIL pumps at the 150 MW snapshot (no TCS model): the oil-only state of tcs.js */
  if (cmd === 'trip') return tcsTripManual(U);
  /* the generator control panel (gen-panel.js): SYN AUTO / MAN, AVR AUTO / MAN, 7-90R, 7-65, 52G CLOSE, lockout reset */
  if (cmd === 'gen') return tcsGenCmd(U, arg || {});
  /* plan c4: the line breaker 52L1 (instructor): 0 = open (house load operation), 1 = close (elec.js) */
  if (cmd === '52l') return anElecL52(U, arg);
  if (cmd === 'tripreset') return tcsTripReset(U);
  if (cmd === 'fault') return tcsTripFault(U, arg);
  /* LMYP OTS: GOV RAISE / LOWER and the LOAD LIMITER of the TCS CRT (tcs.js tcsGovCmd, TCE196 / TCE205) */
  if (cmd === 'gov' || cmd === 'llm') return tcsGovCmd(U, cmd, arg);
  /* LMYP OTS: the MSV / CV valve tests of the TCS CRT (tcs.js tcsVtCmd, TCE220 / TCE222 / TCE224) */
  if (cmd === 'vtest') return tcsVtCmd(U, arg);
  /* TCE176 / 177: without the ATS model (a starting point on load) the overspeed test is refused by its own permissive */
  if (!U.tc && (cmd === 'ostmain' || cmd === 'ostbk'))
    return 'OVERSPEED TEST not permitted: ' + (tb.st === 'sync' || tb.st === 'load' ? '52G CLOSE' : 'not in GOVERNING MODE at rated speed (TCE167)');
  if (!U.tc && cmd === 'oil') return tcsOilCmd(tcsOilState(U), arg || {});
  /* 3.2.0-beta.38 (CHECKLIST 0.6): the TCS / ATS model (tcs.js): the auxiliaries and the ATS step push buttons. 'roll' = ATS AUTO
     from the next step up to ACCELERATION (3600 rpm), 'sync' = EXCITATION + SYNCH. & INITIAL LOAD, 'loadup' = LOAD UP to the target */
  /* Mina 2026-11-09 (re-shell step 3): ROLL was accepted while the turbine was tripped and said "rolling" while the speed fell. A trip is
     latched in the TCS (IBD TA-1: the trip stays until TURBINE RESET P.B. and the gates allow it): ROLL, SYNC and LOAD UP are refused
     until the turbine is reset */
  /* Mina, load run of 3.2.2: a TCS target was taken and did nothing while the DCS control mode is ON (the TCS follows the turbine master,
     anUnitStep0: the same test as there) */
  if (cmd === 'loadup' && (U.dcs < 0 || +(U.S && U.S.rt && U.S.rt.v[U.dcs]) > 0.5))
    return 'DCS control mode is ON: the turbine follows the unit load demand of the DCS. Change the load with Unit load demand (HIC-ULD, ABC-001A)';
  if (cmd === 'roll' || cmd === 'sync' || cmd === 'loadup') {
    let tr = '';
    try {
      tr = tcsOilState(U).trip || '';
    } catch (e) {}
    if (tr) return 'The turbine is tripped (' + tr + '): press TURBINE RESET first';
  }
  /* Mina S163-2 (beta.163 shutdown from the 150 MW state): NORMAL OPERATION answered "Unknown command: normal". The 150 MW state runs the
     oil TCS model (no U.tc); 'shutdown' changed it to the step model, 'normal' did not and fell to the oil commands. Both now do */
  if ((cmd === 'shutdown' || cmd === 'normal') && !U.tc) tcsFromOil(U);
  if (cmd === 'normal' && U.tc && U.tc.step >= 7 && U.tc.cur < 0) return '';
  if (U.tc) {
    const c = U.tc;
    if (cmd === 'roll') {
      if (tb.st === 'sync' || tb.st === 'load') return 'Already synchronised';
      if (c.step >= 3) return 'The turbine is already at 3600 rpm';
      let nx = c.cur >= 0 ? c.cur : c.step + 1;
      if (nx === 0 && c.Thp > 150) nx = 1;
      if (nx === 2 && !(c.mode === 'amb' || c.mode === 'c1')) nx = 3;
      const r = c.cur >= 0 ? '' : tcsStepIn(U, nx);
      if (r) return r;
      c.auto = true;
      c.autoTo = 3;
      return '';
    }
    if (cmd === 'sync') {
      if (tb.st === 'sync' || tb.st === 'load') return 'Already synchronised';
      /* plan c5: G-1B closes 52G1 only with 52L1 closed (elec.js): an open 52L1 timed the synchronizing out after 5 min with no word */
      if (U.el && U.el.l52 === false) return 'Line breaker 52L1 is open: close 52L1 first (Plant menu, Trips)';
      if (c.step >= 1 && c.step < 3 && tb.rpm > 3550) c.step = 3;
      if (c.step < 3)
        return c.step < 1
          ? 'Roll the turbine first'
          : 'Not at 3600 rpm / ACCELERATION not finished (' + tb.rpm.toFixed(0) + ' rpm)';
      /* live Cold start 2026-11-14 (3.2.3-beta.235, user: "excitation muna bago sync"): EXCITATION is its own step and push button
         (310SC90-775 page 23, "EXCITATION" PB ON); SYNCH. & INITIAL LOAD needs EXCITATION FINISHED (page 24 program actuation 8). Before,
         this button ran both steps */
      if (c.step < 4)
        return c.cur === 4
          ? 'Excitation still running: generator voltage ' +
              (13.8 * ((U.gen && U.gen.V) || 0)).toFixed(1) +
              ' of 13.8 kV'
          : 'Press EXCITATION first (ATS step 4, generator voltage up to 13.8 kV)';
      const r = c.cur >= 0 ? '' : tcsStepIn(U, 5);
      if (r) return r;
      c.auto = true;
      c.autoTo = 5;
      return '';
    }
    if (cmd === 'loadup') {
      if (tb.st !== 'sync' && tb.st !== 'load') return 'Synchronise the generator first';
      if (c.step < 5)
        return (
          'Waiting for the initial load hold (SYNCH. & INITIAL LOAD, ' +
          (c.tm / 60).toFixed(0) +
          ' / ' +
          (c.holdMin || 0) +
          ' min)'
        );
      return tcsStepIn(U, 6, arg);
    }
    const r = tcsCmd(U, cmd, arg);
    return r == null ? 'Unknown command: ' + cmd : r;
  }
  if (cmd === 'roll') {
    if (tb.st !== 'off') return 'The turbine is already turning (' + tb.st + ')';
    if (!(U.vac >= 0.9))
      return (
        'No condenser vacuum (' +
        Math.round(100 * (U.vac || 0)) +
        ' %): start the seawater pumps (SWP) and a condensate pump (CEP); VACUUM UP (ejectors, gland sealing) needs aux steam: main steam > 12 kg/cm2'
      );
    Object.assign(tb, { st: 'roll', xfer: false, tgt: 0, aim: 0 });
    return '';
  }
  if (cmd === 'sync') {
    if (tb.st !== 'roll') return tb.st === 'off' ? 'Roll the turbine first' : 'Already synchronised';
    if (tb.rpm < 3599) return 'Not at 3600 rpm yet (' + tb.rpm.toFixed(0) + ')';
    Object.assign(tb, { st: 'sync', tgt: 0, aim: U.MWinit });
    const dirt = (l, x) => {
      if (l && l.S.rt.force[l.n] === undefined && l.S.ext.includes(l.n)) l.S.rt.ext[l.n] = x;
    };
    dirt(U.di.gcbOn, 1);
    dirt(U.di.gcbOff, 0);
    return '';
  }
  if (cmd === 'loadup') {
    if (tb.st !== 'sync' && tb.st !== 'load') return 'Synchronise the generator first';
    tb.st = 'load';
    tb.aim = isFinite(+arg) ? +arg : 45;
    return '';
  }
  return 'Unknown command: ' + cmd;
}
/* Phase 11 C (RIN, 2026-11-27, rule 0 RULES.md 3.12): THE STEAM PATH OF THE TURBINE BY PHYSICS. Replaces the per-load tables AN_TBW
   (work per T/H at the 7 heat balance loads) and the stage pressure rows of AN_HB (interpolated between the 7 loads), and the
   temperature factor anTbT. Now each stage pressure, each enthalpy and the shaft work come from two laws:
     STODOLA (A. Stodola, Steam and Gas Turbines, 1927, the cone law; Cooke, J. Eng. Gas Turbines Power 107, 1985): a stage group
       passes m = K sqrt((p1^2 - p2^2) / (p1 v1)) (m kg/s, p MPa, v m3/kg). K is the flow area of the group: a property of the blades.
     EXPANSION: the group takes h1 - h2 = eta (h1 - h2s(p2, s1)), IAPWS-IF97 (steam.js), eta the isentropic efficiency of its blades.
   K and eta of every group are read ONCE from the design geometry, the Hitachi / MHPS heat balance PPE-14-0725 R1 (YUA PC read
   2026-11-27, /mnt/project-files/turbine-hb-read-2026-11-27.md): case 1 (100 %, 310SD07-485 R4) for all groups, and the HP group flow
   area K from case 9 (VWO, valves wide open, 310SD09-061 R3: the blades with nothing throttling them). Never per load: the other six
   cases (85 / 70 / 60 / 50 / 40 / 30 %) are the TEST (tests/lanes/model/turbine-hb.cjs): stage pressures within 0.5 % (HRH) to 6 %
   (No.1 LP at 30 %), CRH temperature within 0.6 C, LP exhaust enthalpy within 3.3 kcal/kg, shaft within 0.6 %.
   HP: the control valves throttle the main steam (constant enthalpy) down to the pressure the HP blades pass the flow at (Stodola from
   the cold reheat pressure); at VWO that is the inlet 126 ata. The first stage pressure is not printed on the HB (NOT IN DOCS, YUA):
   this p1 is the CALC pressure in front of the HP blading.
   Leaks (HB case 1, kg/h, labyrinths pass a flow in line with the pressure in front of them, choked: m = c p / sqrt(p v); c from
   case 1): HP inlet gland to the steam seal regulator 403 and the N2 packing to the IP / LP crossover 4650 (H 818.3) at p1; the valve
   stem leak-off to the crossover 1205 at the inlet (main steam); the HP exhaust glands to the deaerator line 4561 (B) and to the steam
   seal regulator 1417 at the cold reheat. Checked on the 7 other cases: B / C at the CRH within 1.5 %, N2 / HP inlet within 4 %; the
   stem leak-off rises to 1461 kg/h at 40 % on the HB (a leak-off between two seals whose pressures the HB does not print), here 1205 x
   inlet pressure ratio: up to 260 kg/h (0.15 % of the flow) apart.
   Reheater: cold reheat 38.64 ata 446091 kg/h (incl. No.6 extraction 45147) to hot reheat 34.77 ata 400944 kg/h: the drop goes with
   m^2 v (pipe and tube friction), its coefficient from case 1.
   The heater draws: the steam the heaters condense (ports ext.w_hp NANA, ext.w_lp MEI). The LP heater draws are the port ext.w_lp
   (MEI anLphStep, Phase 11 rank 6: the shell first law with the drain cascade). Until NANA's ext.w_hp lands the HP draws are read from
   the heater model as it stands: No.2 / No.1 HP heater U.hpF2 / U.hpF1 - U.hpF2, the deaerator in line with the No.1 HP heater draw
   (HB case 1 22225 / 24200).
   Units in AN_TB: kg/h, ata, C, kcal/kg as printed (x 4.1868 = kJ/kg). DESIGN-SRC: HB PPE-14-0725 R1 cases 1 / 9 */
const AN_TB = {
  c1: {
    ms: 458327, Pms: 126, Tms: 538, Hms: 823.2, crh: 446091, Pcr: 38.64, Hcr: 751.7, hrh: 400944, Phr: 34.77, Thr: 538, Hhr: 845.2,
    P5: 14.87, H5: 787.1, x5: 24200, Pda: 6.369, Hda: 736.3, xda: 22225, P3: 1.914, H3: 676.7, x3: 15246, P2: 0.826, H2: 642.6,
    x2: 12270, P1: 0.373, H1: 614.6, x1: 16834, Pc: 0.07, Hx: 570.1, x6: 45147,
    lkC: 403, lkN2: 4650, Hn2: 818.3, lkA: 1205, lkB: 4561, lkC2: 1417
  },
  vwo: { ms: 472460, Pms: 126, Tms: 538, Hms: 823.2, Pcr: 39.78, lkC: 415, lkN2: 4798, lkA: 1193 },
  /* the steam seal header C (gland steam seal regulator SSR), HB PPE-14-0725 R1 "Gland and leak flows" (turbine-hb-read-2026-11-27.md):
     in = HP inlet leak C (lkC) + HP exhaust gland leak C (lkC2); out = the gland steam condenser 421 kg/h and the LP gland seals 372 kg/h
     (the same in every case 1 ~ 9). The rest spills over to the No.1 LP heater shell (SSR_to_LP1): case 1 403 + 1417 - 421 - 372 = 1027,
     case 5 209 + 751 - 793 = 167, case 6 173 + 624 - 793 = 4 kg/h, as printed; below that the header takes main steam (case 7 MS_line_to_C
     166 = 793 - 136 - 491), the supply side (gs.supply). The spill enthalpy is the mix of the two leaks (case 1 767.5 vs printed 767.6) */
  ssr: { gsc: 421, lps: 372 },
  /* (lo / kq, the HB lumped mechanical + generator loss, deleted 2026-11-27: the generator losses are YUI's anGenW / anGenTemp from
     the machine data, the turbine keeps only AN_TB.mech below; the test turbine-hb.cjs holds the lumped HB loss to read the HB kW) */
};
const TB_A = 0.0980665; /* MPa per ata */
/* the upstream pressure (ata) a group needs to pass m (kg/h) to p2 (ata) with inlet enthalpy h (kJ/kg): Stodola solved for p1 */
function tbP1(K, m, p2, h, p0, ec) {
  const q = Math.max(0, m) / 3600 / K,
    b = p2 * TB_A;
  let p = Math.max(b * 1.001, (p0 || p2 * 1.5) * TB_A);
  if (ec > 0) {
    /* the general ellipse (tbPsi) of a group with a critical pressure ratio: solve m = K sqrt(p / v) psi(p2 / p) by bisection on p */
    let lo = b * 1.0001,
      hi = Math.max(p * 4, b * 50);
    const w = x => K * Math.sqrt(x / steamVhM(x, h)) * tbPsi(b / x, ec);
    for (let i = 0; i < 50; i++) {
      const x = 0.5 * (lo + hi);
      if (w(x) > m / 3600) hi = x;
      else lo = x;
    }
    return (0.5 * (lo + hi)) / TB_A;
  }
  for (let i = 0; i < 6; i++) p = Math.sqrt(b * b + q * q * p * steamVhM(p, h));
  return p / TB_A;
}
/* Phase 11 RIN 2026-11-28: the general Stodola ellipse (Stodola 1922; Cooke, "On prediction of off-design multistage turbine pressures
   by Stodola's ellipse", ASME J. Eng. Gas Turbines Power 1985; Traupel, Thermische Turbomaschinen): flow ~ sqrt(p1 / v1) psi,
   psi = sqrt(1 - ((r - ec) / (1 - ec))^2) above the critical ratio ec, 1 below it (the group is choked). The cone law (ec 0) holds for
   many stages; the last LP group is ONE stage (stage 24 after the No.6 extraction: 310PK03-994, LP diaphragms 22 / 23 / 24), whose
   critical ratio is Traupel's 0.85 / sqrt(z + 1.5) = 0.54 for z = 1. At HB case 1 (0.07 / 0.373 = 0.19) and case 7 (0.053 / 0.133 = 0.40)
   it is choked: the No.6 stage pressure follows the flow, not the condenser (the cone law gave case 7 0.141 vs HB 0.133) */
function tbPsi(r, ec) {
  return r <= ec ? 1 : Math.sqrt(Math.max(0, 1 - ((r - ec) / (1 - ec)) ** 2));
}
AN_TB.ecLp4 = 0.85 / Math.sqrt(1 + 1.5);
/* the end enthalpy of a group of efficiency eta from p1 / h1 to p2 (ata, kJ/kg) */
function tbEx(eta, p1, h1, p2) {
  return h1 - eta * Math.max(0, h1 - steamHsM(p2 * TB_A, steamPhM(p1 * TB_A, h1).s));
}
function tbGroup(m, p1, h1, p2, h2) {
  const P1 = p1 * TB_A,
    P2 = p2 * TB_A;
  return {
    K: m / 3600 / Math.sqrt((P1 * P1 - P2 * P2) / (P1 * steamVhM(P1, h1))),
    eta: (h1 - h2) / (h1 - steamHsM(P2, steamPhM(P1, h1).s))
  };
}
/* Phase 11 RIN 2026-11-28: the LEAVING (exhaust) LOSS of the last LP stage, kJ/kg = c^2 / 2 of the steam leaving the blades, c = the
   volume flow / the annulus area (c = m v / A). A = the annulus of stage 24 (single flow SF-33.5): tip 3176 / root 1457 mm read by scale
   from the cross section 310PK03-994 (YUA 2026-11-28, /mnt/project-files/rin-turbine-section-2026-11-28.md; the blade height 860 mm
   against the printed 33.5 in = 851 mm checks the scale), pi / 4 (3.176^2 - 1.457^2) = 6.25 m2. At HB case 1 (87.8 kg/s, 0.07 ata):
   about 270 m/s, 36 kJ/kg (8.6 kcal/kg). The loss falls with the volume flow at part load, as the steam path of a real turbine */
AN_TB.Aex = (Math.PI / 4) * (3.176 * 3.176 - 1.457 * 1.457);
function tbEL(m, Pc, h) {
  const c = ((Math.max(0, m) / 3600) * steamVhM(Pc * TB_A, h)) / AN_TB.Aex;
  return (c * c) / 2 / 1000;
}
const tbHt = (P, T) => steamH(P - 1.0332, T); /* kJ/kg of steam at P ata, T C */
/* the design geometry (K, eta, leak and drop coefficients), once */
function tbGeo() {
  if (AN_TB.G) return AN_TB.G;
  const d = AN_TB.c1,
    v = AN_TB.vwo,
    k = 4.1868,
    hpF = c => c.ms - c.lkC - c.lkN2 - c.lkA /* the steam through the HP blades */,
    vhp = hpF(v),
    /* HP flow area: VWO, the blades behind the two CVs at full lift (tbCvFs: 126 -> 124.4 ata, the velocity head of the seat throat,
       AN_CV above; before 2026-11-28 the blades were taken at the full 126 ata, no valve drop) */
    Khp = tbGroup(vhp, tbCvFs(2 * tbCvA(1), v.ms - v.lkA, v.Pms, v.Hms * k), v.Hms * k, v.Pcr, 751.8 * k).K,
    p1 = tbP1(Khp, hpF(d), d.Pcr, d.Hms * k),
    ip2 = d.hrh - d.x5,
    lp0 = ip2 - d.xda + d.lkN2 + d.lkA,
    hm = ((ip2 - d.xda) * d.Hda + d.lkN2 * d.Hn2 + d.lkA * d.Hms) / lp0,
    G = {
      hp: { K: Khp, eta: tbGroup(hpF(d), p1, d.Hms * k, d.Pcr, d.Hcr * k).eta },
      ip1: tbGroup(d.hrh, d.Phr, d.Hhr * k, d.P5, d.H5 * k),
      ip2: tbGroup(ip2, d.P5, d.H5 * k, d.Pda, d.Hda * k),
      lp1: tbGroup(lp0, d.Pda, hm * k, d.P3, d.H3 * k),
      lp2: tbGroup(lp0 - d.x3, d.P3, d.H3 * k, d.P2, d.H2 * k),
      lp3: tbGroup(lp0 - d.x3 - d.x2, d.P2, d.H2 * k, d.P1, d.H1 * k),
      /* the last group expands to the expansion line end point (ELEP); the HB exhaust enthalpy 570.1 is the used energy end point
         (UEEP) = ELEP + the leaving loss of the last stage (tbEL) */
      lp4: (() => {
        const m4 = lp0 - d.x3 - d.x2 - d.x1,
          g = tbGroup(m4, d.P1, d.H1 * k, d.Pc, d.Hx * k - tbEL(m4, d.Pc, d.Hx * k)),
          P1 = d.P1 * TB_A;
        /* K of the general ellipse (tbPsi) at case 1, in place of the cone law K */
        g.K = m4 / 3600 / (Math.sqrt(P1 / steamVhM(P1, d.H1 * k)) * tbPsi(d.Pc / d.P1, AN_TB.ecLp4));
        return g;
      })()
    },
    sv = (P, h) => Math.sqrt(P * steamVhM(P * TB_A, h)) /* p / sqrt(p v) ~ the choked labyrinth flow */,
    vcr = steamVhM(d.Pcr * TB_A, d.Hcr * k);
  G.c = {
    lkC: (d.lkC * sv(p1, d.Hms * k)) / p1,
    lkN2: (d.lkN2 * sv(p1, d.Hms * k)) / p1,
    lkA: (d.lkA * sv(d.Pms, d.Hms * k)) / d.Pms,
    lkB: (d.lkB * sv(d.Pcr, d.Hcr * k)) / d.Pcr,
    lkC2: (d.lkC2 * sv(d.Pcr, d.Hcr * k)) / d.Pcr,
    rh: (d.Pcr - d.Phr) / (d.hrh * d.hrh * vcr) /* ata per (kg/h)^2 m3/kg */
  };
  return (AN_TB.G = G);
}
/* ONE pass of the steam path. I: ms (T/H through the CVs), Pin (ata in front of the CVs), Tms (C), qip (T/H through the ICVs), Thr (C),
   Pc (ata, condenser), w = { hp6, hp5, da, lp3, lp2, lp1 } T/H drawn, o = the result of the last pass (start values). Returns pressures
   ata, enthalpies kJ/kg, Whp / Wip MW (shaft work of the HP and of the IP / LP blading), the LP exhaust and the leaks kg/h */
function tbPath(I, o) {
  const G = tbGeo(),
    C = G.c,
    k = 4.1868,
    ms = Math.max(0, +I.ms || 0) * 1000,
    qip = Math.max(0, +I.qip || 0) * 1000,
    w = I.w || {},
    Pc = Math.max(0.02, +I.Pc || 1.0332),
    Pin = Math.max(Pc, +I.Pin || 0),
    hms = tbHt(Pin, isFinite(I.Tms) ? I.Tms : 538),
    o0 = o && o.P ? o : null,
    P = Object.assign({ fs: Pin, crh: Pc, hrh: Pc, x5: Pc, da: Pc, l3: Pc, l2: Pc, l1: Pc }, o0 ? o0.P : {}),
    H = Object.assign({ x5: 787.1 * k, da: 736.3 * k, l3: 676.7 * k, l2: 642.6 * k, l1: 614.6 * k, x: 570.1 * k }, o0 ? o0.H : {}),
    sv = (p, h) => Math.sqrt(Math.max(1e-9, p * steamVhM(p * TB_A, h)));
  P.c = Pc;
  const hhr = tbHt(Math.max(Pc, P.hrh), isFinite(I.Thr) ? I.Thr : 538),
    /* a draw is signed: below 0 the heater shell sends steam BACK into the turbine (Phase 11 RIN 2026-11-28: the shell and its
       saturated water flash when the stage pressure falls, through the extraction line until its non-return valve shuts; the heater
       parts NANA / MEI write it in ext.w_hp / ext.w_lp). The back steam enters at the saturated vapour enthalpy of the stage pressure */
    dr = x => (+(w[x] || 0) || 0) * 1000,
    hg = p => steamSatM(Math.max(Pc, p) * TB_A).hg,
    mix = (f, h, x, p) => (dr(x) < 0 && f - dr(x) > 0 ? (f * h - dr(x) * hg(p)) / (f - dr(x)) : h);
  /* leaks at the pressures of the last pass */
  const L = {
    C: (C.lkC * P.fs) / sv(P.fs, hms),
    N2: (C.lkN2 * P.fs) / sv(P.fs, hms),
    A: ms > 0 ? (C.lkA * Pin) / sv(Pin, hms) : 0,
    B: (C.lkB * P.crh) / sv(P.crh, H.crh || 751.7 * k),
    C2: (C.lkC2 * P.crh) / sv(P.crh, H.crh || 751.7 * k)
  };
  for (const x in L) L[x] = Math.min(L[x], ms * 0.02);
  /* flows through each group (kg/h) */
  const fhp = Math.max(0, ms - L.C - L.N2 - L.A),
    f1 = qip,
    f2 = Math.max(0, f1 - dr('hp5')),
    flp = Math.max(0, f2 - dr('da') + (ms > 0 ? L.N2 + L.A : 0)),
    f3 = Math.max(0, flp - dr('lp3')),
    f4 = Math.max(0, f3 - dr('lp2')),
    f5 = Math.max(0, f4 - dr('lp1'));
  /* pressures from the condenser up (Stodola), with the enthalpies of the last pass */
  P.l1 = tbP1(G.lp4.K, f5, Pc, H.l1i || H.l1, P.l1, AN_TB.ecLp4);
  P.l2 = tbP1(G.lp3.K, f4, P.l1, H.l2i || H.l2, P.l2);
  P.l3 = tbP1(G.lp2.K, f3, P.l2, H.l3i || H.l3, P.l3);
  P.da = tbP1(G.lp1.K, flp, P.l3, H.lm || H.da, P.da);
  P.x5 = tbP1(G.ip2.K, f2, P.da, H.x5i || H.x5, P.x5);
  P.hrh = tbP1(G.ip1.K, f1, P.x5, hhr, P.hrh);
  /* the cold reheat: the hot reheat + the reheater drop of the steam through it (CRH less the No.6 extraction) */
  const frh = Math.max(0, fhp - L.B - L.C2 - dr('hp6') + (+I.hpb || 0) * 1000);
  /* the specific volume at the cold reheat of the last pass, not below the hot reheat (the CRH is never below it): from a cold start
     (P.crh = the condenser) the volume at 0.07 ata gave a CRH of 1840 ata and a NaN path (2026-11-28, found at 87.5 % of VWO) */
  P.crh = P.hrh + C.rh * frh * frh * steamVhM(Math.max(Pc, P.hrh, P.crh) * TB_A, H.crh || 751.7 * k);
  P.fs = Math.min(Pin, tbP1(G.hp.K, fhp, P.crh, hms, P.fs));
  /* enthalpies from the inlets down */
  H.crh = fhp > 0 ? tbEx(G.hp.eta, P.fs, hms, P.crh) : H.crh || 751.7 * k;
  H.hrh = hhr;
  H.x5 = f1 > 0 ? tbEx(G.ip1.eta, P.hrh, hhr, P.x5) : H.x5;
  H.x5i = mix(f1, H.x5, 'hp5', P.x5);
  H.da = f2 > 0 ? tbEx(G.ip2.eta, P.x5, H.x5i, P.da) : H.da;
  const fda = Math.max(0, f2 - Math.max(0, dr('da')));
  H.lm = flp > 0 ? (fda * H.da + Math.max(0, -dr('da')) * hg(P.da) + (ms > 0 ? L.N2 * AN_TB.c1.Hn2 * k * (hms / (823.2 * k)) + L.A * hms : 0)) / flp : H.da;
  H.l3 = flp > 0 ? tbEx(G.lp1.eta, P.da, H.lm, P.l3) : H.l3;
  H.l3i = mix(flp, H.l3, 'lp3', P.l3);
  H.l2 = f3 > 0 ? tbEx(G.lp2.eta, P.l3, H.l3i, P.l2) : H.l2;
  H.l2i = mix(f3, H.l2, 'lp2', P.l2);
  H.l1 = f4 > 0 ? tbEx(G.lp3.eta, P.l2, H.l2i, P.l1) : H.l1;
  H.l1i = mix(f4, H.l1, 'lp1', P.l1);
  H.xe = f5 > 0 ? tbEx(G.lp4.eta, P.l1, H.l1i, Pc) : H.xe || H.x;
  H.x = f5 > 0 ? H.xe + tbEL(f5, Pc, H.x) : H.x;
  const kW = (f, a, b) => (f / 3600) * (a - b);
  return {
    P,
    H,
    L,
    f: { hp: fhp, ip1: f1, ip2: f2, lp: flp, lp2: f3, lp3: f4, lp4: f5, rh: frh },
    Whp: kW(fhp, hms, H.crh) / 1000,
    Wip: (kW(f1, hhr, H.x5) + kW(f2, H.x5i, H.da) + kW(flp, H.lm, H.l3) + kW(f3, H.l3i, H.l2) + kW(f4, H.l2i, H.l1) + kW(f5, H.l1i, H.x)) / 1000,
    exh: { m: f5 / 1000, h: H.x },
    /* the SSR spill-over to the No.1 LP heater (AN_TB.ssr): kg/h, kJ/kg */
    gs: (() => {
      const lc = L.C + L.C2,
        m = Math.max(0, lc - AN_TB.ssr.gsc - AN_TB.ssr.lps);
      return { m, h: lc > 0 ? (L.C * hms + L.C2 * H.crh) / lc : hms };
    })()
  };
}
/* the heater draws (T/H) the steam path takes this step; see the head of this block (ports when written) */
function tbDraws(U, ms) {
  const pt = U.pt || {},
    hp = pt['ext.w_hp'] && pt['ext.w_hp'].x,
    lp = pt['ext.w_lp'] && pt['ext.w_lp'].x,
    lb = lp || { lp3: 0, lp2: 0, lp1: 0 } /* no port yet (the first scan): nothing drawn */;
  return {
    /* the HP heater and deaerator draws: the port of the feedwater part (ext.w_hp, NANA fw.js anDeaStep); not written = none */
    hp6: hp ? hp.hp2 : 0,
    hp5: hp ? hp.hp1 : 0,
    da: hp ? hp.da : 0,
    lp3: lb.lp3,
    lp2: lb.lp2,
    lp1: lb.lp1
  };
}
/* anTbPx(k): the stage pressure of the steam path NOW (AN_UNIT.tbS, tbPath) over its 100 % design pressure, for the heater shells
   (the callers multiply it by the design heater pressure): 'x6' cold reheat (No.6 = No.2 HP heater), 'x5', 'xd' deaerator, 'x3',
   'x2', 'x1' LP heaters. Replaces anHb (the per-load AN_HB table) */
function anTbPx(k) {
  const S = typeof AN_UNIT !== 'undefined' && AN_UNIT.tbS,
    d = AN_TB.c1,
    key = { x6: ['crh', d.Pcr], x5: ['x5', d.P5], xd: ['da', d.Pda], x3: ['l3', d.P3], x2: ['l2', d.P2], x1: ['l1', d.P1] }[k];
  if (!key) return 0;
  return S && S.P && isFinite(S.P[key[0]]) ? Math.max(0, S.P[key[0]] / key[1]) : 0;
}
/* Phase 11 rank 1: the turbine ports (ports.js; one writer: this file). Units ata, C, kJ/kg, T/H, MW.
   shaft.W = the steam work on the blades less the turbine bearing / mechanical loss (YUI subtracts the generator losses from it, agreed
   2026-11-27). The mechanical loss: the HB lumped loss at 100 % (2.565 + 3.295e-5 shaft^2 = 3.34 MW, turbine-hb.cjs) less the generator losses at 150 MW (YUI PR 700:
   1.794 MW, unit.js anGenTemp U.genT.L from the generator type test LM-GEE-2014-0822 R0 p31, 2,032 kW at the rating) = 1.55 MW, constant with load (bearing
   friction goes with the speed, not the load). NO-SOURCE: the MHPS turbine bearing loss itself (not in the TG manuals, YUA) */
AN_TB.mech = 1.55;
/* Phase 11 RIN 2026-11-28: CLOSING TIMES OF THE TURBINE VALVES, seconds for a full stroke (the model moves the lift linearly:
   lift -= dt / t). DERIVED by physics from the actuator and trip oil data (YUA PC reads /mnt/project-files/rin-actuators-2026-11-28*.md,
   rin-ets-2026-11-28.md; derivation /mnt/project-files/phase11/rin-valve-close-derivation-2026-11-28.md):
   TRIP (ETS lost): t = MTSV + ETS + dump.
     MTSV: the master trip solenoid valves, Tokyo Keiki DG5S4 "response within 0.25 s" (TEQ-17-241 p864, p870): 0.25 s.
     ETS: after the spool shifts, the ETS header gives up the 8 cartridge control chambers (8 x A3 10.18 cm2 x 1.4 cm = 0.11 L,
       TEQ p639) plus the oil compression of the 1" line, against the Ø5.0 feed orifice (~160 L/min, TEQ p79 / p81); the
       accumulator sits behind a Ø1.6 orifice (TEQ p861, about 10 L/min) and cannot hold the header: about 0.05 s.
     dump: the cartridge LC32 A40E7X empties the cylinder, Q = 385 sqrt(dp) L/min (the vendor curve TEQ p640, mean of the 2 / 4 /
       6 / 8.6 bar points). dp = spring force / piston area: the spring is not printed, so its LOWEST physical value, the 4 bar
       cracking of the cartridge, is taken (the slowest closing: the conservative side for overspeed; the fastest, at the 112 kg/cm2
       low-oil-trip bound, is 5 x quicker). Oil volume = piston area x valve stroke (TEQ p511-518): MSV 94.4 cm2 x 112 mm = 1.06 L
       -> 0.082 s; CV B 316.5 x 43 = 1.36 L -> 0.106 s (CV A 0.042 s; the model has one CV lift, the slower B is taken); RSV
       125.7 x 140 = 1.76 L -> 0.137 s; ICV 172.8 x 127 = 2.19 L -> 0.171 s.
     The end cushion (VD orifice, MSV 18 / CV 12 / CV B 6 mm) slows the last mm; its orifice size is not printed, so it is not added.
   FAST ACTING (OPC on PLU / the valve test): the actuator NG6 4WE6D (110 V AC, switching 15 ~ 40 ms ISO 6403, TEQ p723) vents the
     control chamber straight to tank (Y port, no orifice, TEQ p511): t = 0.04 + dump: CV 0.15 s, ICV 0.21 s.
   SERVO (house-load governing): the servo valve 4WS2EM10-5X/60 (60 L/min at 70 bar valve drop, TEQ p511) at the 160 bar supply:
     60 sqrt(160 / 70) = 91 L/min; CV B 1.36 L -> 0.90 s for a full stroke. */
/* Phase 11 RIN 2026-11-28: THE STEAM LEFT IN THE TURBINE after the valves close, as the time constant of each part, T = M / m: the steam
   mass held between the valves and the blading over the steam flow through it at HB case 1 (an ideal-gas volume that empties through a
   Stodola section, m ~ p, empties with T = V rho / m). Volumes from the cross section 310PK03-994 and the outline 310PK02-353 (YUA
   2026-11-28, /mnt/project-files/rin-turbine-section-2026-11-28.md, rin-turbine-volumes-2026-11-28.md; tip / root read by scale):
   HP (behind the CVs): the nozzle chamber 0.15 m3 (0.1 ~ 0.2) at the first-stage pressure 122.3 ata (34.9 kg/m3) + the HP blading
   annulus, stages 1 (920 / 810 mm) to 11 (985 / 860 mm) x 1.1 m = 0.18 m3 at the mean state (21.6 kg/m3): 9.2 kg / 125.7 kg/s = 0.073 s.
   IP / LP (behind the ICVs): the CRV-to-IP leads 1.1 m3 + the IP inlet chamber 0.4 m3 at the hot reheat (9.3 kg/m3) + the IP blading,
   stages 12 (1270 / 1100) to 21 (1890 / 1295) x 1.35 m = 1.22 m3 (4.6 kg/m3) + the IP-LP passage 0.5 m3 (2.35 kg/m3) + the LP
   blading, stages 22 (2180 / 1457) to 24 (3176 / 1457) x 0.85 m = 3.54 m3 (0.36 kg/m3): 22.0 kg / 111.4 kg/s = 0.198 s.
   (The CRH / reheater / HRH steam, 60 m3, sits behind the ICVs and does not reach the blades once they close.) */
AN_TB.tSc = 0.073;
AN_TB.tXo = 0.198;
const AN_TBV = { msv: 0.38, rsv: 0.44, cv: 0.41, icv: 0.47, cvOpc: 0.15, icvOpc: 0.21, cvServo: 0.9 };
/* Phase 11 RIN 2026-11-28: THE MAIN STEAM FLOW = THE TWO HP CONTROL VALVES IN SERIES WITH THE HP BLADING, solved each scan (tbMsFlow).
   It replaces m = Kt x gv x MSP with Kt = m0 / P0 read off the save-point snapshot (a fitted constant), under which the blading never
   limited the flow: at 121.7 ata in front of the turbine the app passed 459.8 T/H through blades that pass 448 T/H there (Stodola, K of
   HB PPE-14-0725 VWO), so 150 MW was reached with 7.9 T/H more steam than HB case 1.
   VALVE: the sleeve CV, seat throat 165.1 mm, main stroke 43 mm (CVU parts drawing, YUA /mnt/project-files/rin-turbine-section-
   2026-11-28.md (3); nominal bore 165.1 mm, MT p473 STIE-14598). Flow area = the curtain pi d x lift, up to the seat pi d^2 / 4 (the
   curtain at full stroke, 0.0223 m2, is just over the seat, 0.0214 m2: the seat limits above 96 % lift). The steam expands to the
   first-stage pressure in the throat by the nozzle law of a perfect gas, kappa 1.3 (superheated steam), choked below r* = 0.546. No
   discharge coefficient or diffuser recovery is printed, so the throat takes the whole velocity head (coefficient 1): at VWO the valves
   then drop 1.3 % of the inlet pressure (126 -> 124.4 ata at 82 m/s); at HB case 1 (lift about 50 %) the drop the blading asks for,
   126 -> 122.3 ata, is passed at about 93 % flow demand, inside the flat part of the TCS curves below, as on the drawing.
   LIFT: the TCS position demand of each CV from the flow demand, FG 003 (CV A) and FG 036 (CV B) of TCE212 (macro LME010, HIACS backup;
   YUA /mnt/project-files/rin-doc-reads.md 1a), flat at 105 % past 100 % demand. The flow demand = the CV OPENING BIAS + (1 - bias) x the
   CV share U.gv (TCE207, anTbFlow). */
const AN_CV = {
  d: 0.1651,
  S: 0.043,
  kap: 1.3,
  fgA: [[0, 0], [20, 0], [24, 11.4], [25, 12.143], [29, 13.7], [42, 22.33], [52, 27.88], [60, 29.896], [72, 37], [76, 39], [82, 42.5], [84, 44], [87, 45.2], [89, 46.2], [91, 48], [92, 49.7], [93, 52.2], [94, 55.5], [95, 60.6], [97, 79.618], [100, 105]],
  fgB: [[0, 0], [20, 0], [29, 4.85], [31, 6.42], [43, 15.2], [51, 20.4], [60, 25.3], [69, 29.5], [74, 32], [78, 34.35], [84, 38.8], [87, 40.2], [89, 41.35], [92, 45.3], [93, 48.07], [94, 51.8], [95, 57.35], [97, 78.9], [100, 105]]
};
function tbFg(t, x) {
  if (x <= t[0][0]) return t[0][1];
  for (let i = 1; i < t.length; i++)
    if (x <= t[i][0]) return t[i - 1][1] + ((t[i][1] - t[i - 1][1]) * (x - t[i - 1][0])) / (t[i][0] - t[i - 1][0]);
  return t[t.length - 1][1];
}
/* the lift (0 ~ 1.05) of CV s ('A' / 'B') at the CV share g (U.gv units, 0 = shut) */
function tbCvLift(U, s, g) {
  if (!(g > 0)) return 0;
  const B = U.cvBias || 0.2;
  return tbFg(s === 'B' ? AN_CV.fgB : AN_CV.fgA, 100 * (B + (1 - B) * g)) / 100;
}
/* the CV EFFECTIVE AREA against lift (2026-11-28, replaces the pure curtain pi d x lift, which at choked flow passed 58 % of VWO at
   16 % lift where the TCS curves FG 003 / 036 give 33 % flow demand: the sleeve valve with its pilot and plug passes less at low lift).
   The TCS's own lift-to-flow table, TCE500 FG A011 (the CV A + CV B position sum, % : the flow, % of VWO, the flow check of the speed
   reference; YUA /mnt/project-files/rin-control-stage-2026-11-27.md), read as the flow the two valves pass at the rated inlet (HB VWO
   126 ata / 538 C) into the HP blading: for each point the steam path (tbPath) gives the first-stage pressure at that flow, and the area
   that passes it (tbCvFs inverse) is the effective area at that lift sum. At the sum 200 (both full lift) it is the seat area of AN_CV */
AN_CV.a011 = [[0, 0], [11.07, 6.25], [15.36, 11.25], [55.89, 46.25], [66.12, 63.75], [92.69, 87.5], [115.06, 93.75], [200, 100]];
function tbCvTab() {
  if (AN_CV.tab) return AN_CV.tab;
  const v = AN_TB.vwo,
    c = AN_TB.c1,
    k = 4.1868,
    h = v.Hms * k,
    Aful = 2 * tbCvA(1),
    t = [[0, 0]];
  for (const [S, F] of AN_CV.a011.slice(1)) {
    const f = F / 100,
      w = { hp6: (c.x6 * f) / 1000, hp5: (c.x5 * f) / 1000, da: (c.xda * f) / 1000, lp3: (c.x3 * f) / 1000, lp2: (c.x2 * f) / 1000, lp1: (c.x1 * f) / 1000 },
      I = { ms: (v.ms * f) / 1000, Pin: v.Pms, Tms: v.Tms, qip: (c.hrh * (v.ms / c.ms) * f) / 1000, Thr: v.Tms, Pc: c.Pc, w };
    let o = null;
    for (let i = 0; i < 12; i++) o = tbPath(I, o);
    const m = v.ms * f - o.L.A;
    let lo = 0,
      hi = Aful;
    if (S >= 200) lo = hi;
    else
      for (let i = 0; i < 50; i++) {
        const a = (lo + hi) / 2;
        if (tbCvW(a, v.Pms, h, o.P.fs) > m) hi = a;
        else lo = a;
      }
    t.push([S, (lo + hi) / 2]);
  }
  return (AN_CV.tab = t);
}
/* the effective flow area (m2) of the two CVs at the lifts lA, lB (0 ~ 1.05) */
function tbCvAs(lA, lB) {
  return tbFg(tbCvTab(), Math.max(0, Math.min(200, 100 * ((+lA || 0) + (+lB || 0)))));
}
/* the seat-limited curtain area (m2) of one CV at lift l: the full-lift area of AN_CV (VWO, tbGeo) */
function tbCvA(l) {
  const d = AN_CV.d;
  return Math.max(0, Math.min(Math.PI * d * AN_CV.S * Math.min(1, l), (Math.PI * d * d) / 4));
}
/* the steam (kg/h) through the area A (m2) from Pin (ata, enthalpy h kJ/kg) to the outlet pressure fs (ata) */
function tbCvW(A, Pin, h, fs) {
  if (!(A > 0) || !(Pin > 0)) return 0;
  const k = AN_CV.kap,
    rc = Math.pow(2 / (k + 1), k / (k - 1)),
    r = Math.max(rc, Math.min(1, fs / Pin)),
    P = Pin * TB_A * 1e6;
  return 3600 * A * Math.sqrt(Math.max(0, ((2 * k) / (k - 1)) * (P / steamVhM(Pin * TB_A, h)) * (Math.pow(r, 2 / k) - Math.pow(r, (k + 1) / k))));
}
/* the outlet pressure (ata) at which the area A passes m (kg/h) from Pin; r* x Pin when it cannot */
function tbCvFs(A, m, Pin, h) {
  const k = AN_CV.kap;
  let lo = Math.pow(2 / (k + 1), k / (k - 1)),
    hi = 1;
  if (tbCvW(A, Pin, h, lo * Pin) <= m) return lo * Pin;
  for (let i = 0; i < 50; i++) {
    const r = (lo + hi) / 2;
    if (tbCvW(A, Pin, h, r * Pin) > m) lo = r;
    else hi = r;
  }
  return ((lo + hi) / 2) * Pin;
}
/* the main steam (T/H) that the CVs (total area Av, m2) and the HP blading pass together, from the drum pressure U.Pd (kg/cm2 g) through
   the SH drop (U.kdp, on the whole SH outlet flow m + mo; mo T/H, the other SH outlets of the last scan, U.mso: HP bypass, blow-off,
   SH safety valves) and the main steam line drops (unit.js anMsDrop: the 18" run with the HP bypass steam of the last scan U.mhp, the
   12" leads with the turbine steam) in front of the CVs, at the steam temperature T (C), against
   the cold reheat pressure of the steam path (the last scan, U.tbS). The CV passes the main steam less the stem leak A, the blades also
   less the packing leaks C and N2 (the shares of the last scan, HB case 1 at the start). Solved by regula falsi (Illinois) on [0, mHi] */
function tbMsFlow(U, Av, T, mo) {
  const Pd = +U.Pd || 0,
    kd = Math.max(0, (+U.kdp || 0) + (+U.kln || 0)),
    mhp = Math.max(0, +U.mhp || 0),
    mO = mo > 0 ? mo : 0;
  if (!(Av > 0) || !(Pd > 0)) return 0;
  const G = tbGeo(),
    c = AN_TB.c1,
    S = U.tbS,
    m1 = S && S.f && S.L && U.ms > 1 ? U.ms * 1000 : 0,
    rv = m1 > 0 ? 1 - S.L.A / m1 : 1 - c.lkA / c.ms,
    rb = m1 > 0 ? S.f.hp / m1 : (c.ms - c.lkC - c.lkN2 - c.lkA) / c.ms,
    Pcr = S && S.P && isFinite(S.P.crh) && S.P.crh > 0 ? S.P.crh : 1.0332,
    g = m => {
      const Pin = Pd - (+U.kdp || 0) * (m + mO) * (m + mO) - anMsDrop(U, m, mhp).msv + 1.0332;
      if (Pin <= 1.0332) return -m;
      const h = tbHt(Pin, isFinite(T) ? T : steamTsat(Pin - 1.0332)),
        fb = m > 0 ? tbP1(G.hp.K, m * 1000 * rb, Math.min(Pcr, Pin * 0.999), h) : Math.min(Pcr, Pin);
      return tbCvW(Av, Pin, h, Math.min(fb, Pin)) / 1000 - m * rv;
    };
  const top = kd > 0 ? Math.sqrt(Pd / kd) : 2000; /* with mo the root is below this */
  /* the bracket: 1 % around the flow of the last scan (the flow moves little in one scan), else [0, top] */
  let a = 0,
    b = top,
    fa,
    fb,
    side = 0;
  if (U.ms > 1 && U.ms * 1.01 < top) {
    const fl = g(U.ms * 0.99),
      fh = g(U.ms * 1.01);
    if (fl > 0 && fh < 0) {
      a = U.ms * 0.99;
      b = U.ms * 1.01;
      fa = fl;
      fb = fh;
    }
  }
  if (fa === undefined) {
    fa = g(a);
    fb = g(b);
    if (fa <= 0) return 0;
    if (fb >= 0) return b;
  }
  for (let i = 0; i < 60 && b - a > 1e-3; i++) {
    const m = (a * fb - b * fa) / (fb - fa),
      fm = g(m);
    if (fm > 0) {
      a = m;
      fa = fm;
      if (side === 1) fb /= 2;
      side = 1;
    } else {
      b = m;
      fb = fm;
      if (side === -1) fa /= 2;
      side = -1;
    }
    if (Math.abs(fm) < 1e-3) return m;
  }
  return (a + b) / 2;
}
/* Phase 11 rank 9 (RIN, 2026-11-27): THE BYPASS AND BLOW-OFF VALVES BY THE CONTROL VALVE FLOW LAW of IEC 60534-2-1 (compressible fluid),
   in place of "share x anchor flow x opening x pressure / anchor pressure" (U.hpb / U.blo / U.lpb, scaled on the 150 MW start).
     W = N6 Fp Cv(lift) Y sqrt(x p1 rho1)   kg/h, N6 = 27.3 (p bar, rho kg/m3), x = (p1 - p2) / p1 held at the choked limit Fg xT,
     Y = 1 - x / (3 Fg xT), Fg = k / 1.40 with k = 1.3 (superheated steam), rho1 from IAPWS-IF97 (steam.js) at p1 / T1.
   Cv(lift): the vendor lift curve (SPX Copes-Vulcan, %Cv against % lift, read by YUA 2026-11-27, /mnt/project-files/rin-valve-reads.md):
     hpb PCV-MS1020 HP bypass, DSCV-SA Hush II: Cv 215, K1AU3-D1-0-043 R0 PDF p26 (curve), p11 (sizing)
     lpb PCV-HR1010 LP bypass, DSCV-SA Hush III: Cv 1700, same document PDF p24 / p9
     blo PCV-MS1001 main steam blow-off, one stage Hush curve #4: Cv 232, K1AU3-E2-0-123 R1 PDF p5 / p6
   xT (the pressure drop ratio factor) is not printed (NOT IN DOCS): DERIVED from the vendor's own sizing cases (flow, p1, T1, p2 and the
   steam Cv required as printed), solving the law above for xT: MS1020 0.859 / 0.862 / 0.924 (cases 1 / 2 / 3), HR1010 0.851 / 0.814 /
   1.132, MS1001 0.668 / 0.668 (case 1 printed "outlet restricted by sonic velocity"). Each valve takes the median of its cases (one
   number per valve, from the design sheet only). Fp = 1 (the sheets size the valve at its own body / line size).
   Test: tests/lanes/model/bypass-valves.cjs (the 8 vendor cases: flow at the printed lift within 6 %). DESIGN-SRC: IEC 60534-2-1,
   vendor sheets above */
const AN_VLV = {
  N6: 27.3,
  Fg: 1.3 / 1.4,
  hpb: { Cv: 215, xT: 0.862, L: [0, 10, 19, 30, 40, 50, 60, 70, 80, 90, 100], C: [0, 3, 4.5, 20, 33, 46, 60, 72, 84, 92.5, 100] },
  lpb: { Cv: 1700, xT: 0.851, L: [0, 10, 19, 30, 40, 50, 60, 70, 80, 90, 100], C: [0, 1.2, 1.8, 12.5, 25, 38.5, 50, 62, 74.5, 87, 100] },
  blo: { Cv: 232, xT: 0.668, L: [0, 10, 14, 20, 30, 40, 50, 60, 70, 76, 80, 90, 100], C: [0, 1, 4, 11, 24, 37, 50, 62, 74, 83, 87, 95, 100] },
  /* the RH blow-off MV-HR1391: a motor valve with no valve sheet (Cv NOT IN DOCS, YUA 2026-11-27); its silencer Z-1006 is rated 200 T/H
     (Equipment List p2): kept as that flow x opening x hot reheat pressure / 150 MW reheat pressure, NO-SOURCE (was U.rhb 0.42 x m0) */
  rhbT: 200,
  /* the reheater + reheat piping steam storage, (T/H) x s per kg/cm2 of hot reheat pressure (was U.Crh; the FHI reheater 60 m3 and a
     piping volume NO-SOURCE about 200 m3: audit B5, piping ISO volumes from YUA next) */
  Crh: 400
};
/* the full stroke times of the bypass valves (s): PCV-MS1020 and PCV-HR1010 sheets (K1AU3-D1-0-043 R0 p11 / p9, rev 01 / 02): "< 2 s"
   trip open on the 24 VDC solenoid (energise to open), "< 5 s" on the 4-20 mA positioner. The vendor gives upper limits only: the
   valve here takes the full limit (the slowest the sheet allows), NO-SOURCE for the actual commissioning time */
AN_VLV.tQ = 2;
AN_VLV.tA = 5;
/* the lift (%) of bypass valve k moving to the command c (%) at its stroke rate: the solenoid trip open (q) at 100 % / tQ, the
   positioner at 100 % / tA, both ways; state U.vp (plant state; a save point without it starts at the command) */
function anVlvStroke(U, k, c, q, dt) {
  const P = U.vp || (U.vp = {}),
    x = isFinite(P[k]) ? P[k] : c,
    r = (100 / (q ? AN_VLV.tQ : AN_VLV.tA)) * Math.max(0, +dt || 0);
  return (P[k] = x + Math.max(-r, Math.min(r, c - x)));
}
/* the Cv share (0 ~ 1) of a valve at lift o (%) */
function anVlvCv(v, o) {
  const L = v.L,
    C = v.C,
    x = Math.max(0, Math.min(100, +o || 0));
  let i = 1;
  while (i < L.length - 1 && L[i] < x) i++;
  return (C[i - 1] + ((C[i] - C[i - 1]) * (x - L[i - 1])) / (L[i] - L[i - 1])) / 100;
}
/* the steam (T/H) through valve v at lift o (%), inlet p1 (ata) and T1 (C), outlet p2 (ata) */
function anVlvW(v, o, p1, T1, p2) {
  const P1 = Math.max(0, +p1 || 0),
    c = anVlvCv(v, o);
  if (!(c > 0) || !(P1 > 0.05)) return 0;
  const K = AN_VLV,
    pM = P1 * TB_A /* MPa */,
    Ts = steamTsatK(pM),
    T = Math.max(Ts + 0.01, (isFinite(T1) ? +T1 : Ts - 273.15) + 273.15),
    rho = 1 / steamV2(pM, T),
    xc = K.Fg * v.xT,
    x = Math.max(0, Math.min(xc, (P1 - Math.max(0, +p2 || 0)) / P1)),
    Y = 1 - x / (3 * xc);
  return (K.N6 * v.Cv * c * Y * Math.sqrt(x * pM * 10 * rho)) / 1000;
}
function anTbPorts(U, rpm, hpb) {
  const S = U.tbS;
  if (!S || !S.P) return;
  const T = (P, h) => (isFinite(P) && isFinite(h) && P > 0 ? steamPhM(P * TB_A, h).T - 273.15 : null),
    st = k => ({ P: S.P[k], h: S.H[k], T: T(S.P[k], S.H[k]) });
  anPortSet(U, 'ms.draw', { m: (+U.ms || 0) + (+hpb || 0), x: { tb: +U.ms || 0, hpb: +hpb || 0 } });
  anPortSet(U, 'crh.rh_in', Object.assign({ m: S.f.rh / 1000 }, st('crh')));
  anPortSet(U, 'hrh', { m: S.f.ip1 / 1000, P: S.P.hrh });
  anPortSet(U, 'ext.hp2', st('crh'));
  anPortSet(U, 'ext.hp1', st('x5'));
  anPortSet(U, 'ext.da', st('da'));
  anPortSet(U, 'ext.lp3', st('l3'));
  anPortSet(U, 'ext.lp2', st('l2'));
  anPortSet(U, 'ext.lp1', st('l1'));
  anPortSet(U, 'lp.exh', { m: S.exh.m, h: S.exh.h });
  /* leak B: taken from the cold reheat in tbPath (L.B); HB PPE-14-0725 note "B joins the deaerator extraction line" (case 1: DEA
     heater 26786 = line 22225 + 4561 kg/h), so the deaerator (NANA anDeaStep) gets it */
  anPortSet(U, 'lk.b', { m: S.L && isFinite(S.L.B) ? S.L.B / 1000 : 0, h: S.H && isFinite(S.H.crh) ? S.H.crh : null });
  /* the LP bypass PCV-HR1010 steam (anVlvW, the step before) at the hot reheat enthalpy (a throttle keeps h); its spray TCV-CD1115 is
     condensate the condenser part adds (x.spray: not written here) */
  /* the steam seal regulator spill-over to the No.1 LP heater shell (MEI): tbPath S.gs, HB SSR_to_LP1 */
  anPortSet(U, 'gs.spill', { m: S.gs ? S.gs.m / 1000 : 0, h: S.gs ? S.gs.h : null });
  anPortSet(U, 'lp.bypass', { m: +U.qlp || 0, h: S.H && isFinite(S.H.hrh) ? S.H.hrh : null });
  anPortSet(U, 'shaft', { W: S.Whp + S.Wip > 0 ? S.Whp + S.Wip - AN_TB.mech : 0, n: isFinite(rpm) ? rpm : null });
}
/* 3.2.3-beta.240 (live Cold start, ICV to CV transfer; user 2026-11-14: per the TCS drawings, the normal ATS load up, no GOV manual):
   the TCS load loop on the grid. FLOW DEMAND (TCE206 p.140: GOV.SET through the low select with LLM SET, which the ATS has at its upper
   limit) = the TCS target load as a share of the rating (feedforward, the target MW of TCE195) + the integral of the MW error (TCE195 GOV
   CONTROL PI on TARGET MW - GEN. MW, AN_TCE195 below), moved at most 1 %/s (TCE207 A007 RI / RD). TCE207: ICV demand =
   flow demand / CV OPENING BIAS (full open at 20 %), CV demand = (flow demand - 20 %) / 80 % (the CV share U.gv; each CV's lift is then
   the TCE212 UNT-FG 003 / 036 of the flow demand, tbCvLift). The valves follow at 10 %/s (TCE214 SG C007, TCE211 SG A035). TRANSFER (ICV TO CV TRANSFER COMPLETE I.0418) =
   the CV demand over 0.5 % (TCE207 CV OPEN CMP C004). So the CVs open as the demand rises past the ICV range, the same demand that
   opened the ICV: no step at the transfer (was: the ICV integrator, then a switch to a slow CV integrator from 2 %, beta.239) */
/* 1.0.0-beta.304 (JENNIE, user 2026-11-22: "s totoong planta, hnd static mga values kht na attain mo ang target mw mo"): the MW loop
   gains of the TCS drawing. TCE195 GOVERNOR CONTROL(1) (331DM09784 PDF p.137, sheet page 135): SUB001 TARGET MW DEMAND - GEN. MW (TCE070,
   in MW: TMR AI HL 244.8 MW / LL -12.0 MW, PDF p.38) -> G021 K 1 -> PIV022 G1 0.05, G2 1.0, TI 5.0 s, HL 110 %, LL -5 % = GOV CONTROL
   SIGNAL in % flow demand. So 1 MW of error gives 0.05 % at once and 0.05 x 1.0 / 5.0 = 0.01 %/s more. Before, the integral was 1 / (U.tcs
   20 s x 150 MW) = 0.033 %/s per MW (NO-SOURCE), 3.3 times the drawing: the MW was held to +-0.02 MW at 150 MW while the main steam
   pressure swings as on the plant (plant trend SCENARIO 1 A, 150 MW hold: MW sd 0.43, MW / MSF correlation 0.86, MW / MSP 0.40). With the
   drawing the loop closes in about 100 / (0.01 x 150) = 67 s, so the steam pressure swings of the boiler reach the MW as on the plant.
   Kept: the feedforward D / M0 of the model (the drawing has none: X tracks GOV SET, the target enters only through the error; finding) */
const AN_TCE195 = { g1: 0.05, g2: 1.0, ti: 5.0 };
function anTbFlow(U, tb, D, dt, dirt) {
  const B = U.cvBias || 0.2,
    M0 = U.MW0 || 150,
    L = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
  if (!isFinite(tb.fd)) {
    tb.fd = tb.xfer ? B + (1 - B) * L(+U.gv || 0, 0, 1.4) : B * L(+tb.icv || 0, 0, 1);
    tb.fi = tb.fd - D / M0;
  }
  if (!isFinite(tb.fi)) tb.fi = tb.fd - D / M0;
  const P = AN_TCE195,
    eMW = D - U.MW;
  tb.fi = L(tb.fi + (dt * eMW * P.g1 * P.g2) / (100 * P.ti), -0.5, 0.5);
  /* 3.2.4 (JENNIE): the speed path of TCE206 (p.140, ADD008 with GOV.SET) acts on the grid too: flow span x (rpm - 3600, less the dead
     band) / (droop x 3600), the same law as on house load. The MW error integral (TCE195) then takes the MW back to its target. It is
     added after the rate limit (the FILTER LME240 T 0.3 s is shorter than the scan of the model): the droop answers at once */
  const r = (U.fdRate || 0.01) * dt,
    dr = tb.st === 'load' ? (U.flowSpan * anDb((tb.rpm || 3600) - 3600, U.dbRpm || 0)) / ((U.droop || 0.06) * 3600) : 0;
  /* TCS GOV. MANUAL (tcs.js tcsGovCmd, TCE196): the flow demand goes to the operator's GOV SET at the same rate; the MW error integral and
     the target load follow it, so the return to MW CONTROL is bumpless (TCE195 PIV022 X tracks GOV SET) */
  if (tb.govMan && isFinite(tb.gov)) {
    tb.fd = L(tb.fd + L(L(tb.gov / (tb.gk || 1), 0, 1.4) - tb.fd, -r, r), 0, 1.4);
    tb.fi = L(tb.fd - D / M0, -0.5, 0.5);
    if (isFinite(U.MW)) tb.aim = tb.tgt = U.MW;
  } else tb.fd = L(tb.fd + L(L(D / M0 + tb.fi + (eMW * P.g1) / 100, 0, 1.4) - tb.fd, -r, r), 0, 1.4);
  tb.fdD = dr;
  const s = (U.vRate || 0.1) * dt,
    /* TCE206: FLOW DEMAND = low select of GOV SET and LLM SET (tcs.js tcsGovLlm), then the speed path */
    fdT = L(tcsGovLlm(U, tb, tb.fd, dt) - dr, 0, 1.4),
    icvD = L(fdT / B, 0, 1),
    cvD = L((fdT - B) / (1 - B), 0, 1.4),
    i0 = tb.icv == null ? icvD : tb.icv;
  tb.icv = L(i0 + L(icvD - i0, -s, s), 0, 1);
  U.gv = L((+U.gv || 0) + L(cvD - (+U.gv || 0), -s, s), 0, 1.4);
  /* the MW error integral follows the GOV SET held by the LLM (tcs.js tcsGovLlm, TCE196 GOV follow): no wind-up while limiting */
  if (tb.lim && !tb.govMan) tb.fi = L(tb.fd - D / M0, -0.5, 0.5);
  if (!tb.xfer && cvD > 0.005) {
    tb.xfer = true;
    dirt(U.di.xfer, 1);
  }
}
/* 3.2.3 house load (52L1 open, 52G1 closed): the turbine generator speed from the swing equation 2 H w dw/dt = Pm - Pe (per unit on
   AN_GEN.S): Pm = the turbine steam power MWss (no tauMW lag: the CV / ICV cut the steam at once, the lag of U.MW stands for the reheater
   and the 60 s averages of the plant trends), Pe = the house load (elec.js). On the grid (52L1 closed) the grid holds 3600 rpm (the
   sync check relay 25 closes 52L1 at once in the model, elec.js) */
function anTbSpeed(U, tb, dt, on, Pm, Pe) {
  const hz = anGridHz(U, dt);
  if (!(U.el && U.el.l52 === false) && !tb.rej) {
    /* on the grid the shaft turns with the grid (2-pole, 60 Hz = 3600 rpm) */
    if (tb.st === 'sync' || tb.st === 'load') tb.rpm = hz * 60;
    return;
  }
  if (!on || !isFinite(Pe) || !(U.Hgen > 0)) return;
  const w = Math.max(0.5, (tb.rpm || 3600) / 3600);
  tb.rpm = Math.max(0, (w + (dt * (Pm - Pe)) / (2 * U.Hgen * AN_GEN.S * w)) * 3600);
}
/* 3.2.3 (SOHEE): the LP turbine bypass warming valve XV-HR1010-1 (DITL-83, I/O list STN102 O.0846 "LP turbine bypass steam pressure
   warming solenoid valve open command") and the LP bypass valve outlet temperature TT-HR1010 (STN102 AI0870, 0 ~ 600 C), which DITL-83
   reads: in AUTO (M.0632) the valve opens after an ON DELAY with TT-HR1010 < 250 C and closes at > 330 C (or the CLOSE PB). Flow
   diagram PD-012: the warming line passes hot reheat steam around PCV-HR1010 into the LP bypass line to the condenser. TT-HR1010
   (CALC): the hot reheat steam (PV of TICHR1002, RH outlet; pressure U.Prh) throttled at constant enthalpy to the condenser pressure
   (steam.js IAPWS-IF97 region 2), the share of it as the existing TICHR1012 rule (full with the warming valve open or with the LP bypass
   passing 3 % of the MCR flow, source.js). Without steam the line goes to its rest value: snapshot (150 MW, XV-HR1010-1 closed in
   MANUAL, PCV-HR1010 1.3 %), TT-HR1010 228 C (5.png 005 REHEATER STEAM, 152.5 MW), scaled to the ambient with the boiler water
   temperature as the sootblower drains (AN_SB.dr).
   NO-SOURCE: the warming line size (its flow), the warm-up lag tauH 300 s and the cooling lag tauC 1800 s, the rest-value scaling */
const AN_HRW = { rest: 228, tauH: 300, tauC: 1800 };
function anHrWarm(U, dt) {
  const K = AN_HRW,
    Ta = isFinite(U.Tamb) ? U.Tamb : 30,
    Prh = Math.max(0, +U.Prh || 0),
    Trh = typeof srcPv === 'function' ? srcPv('ABC-019', 'TICHR1002') : NaN,
    op = typeof anDitlRun === 'function' && anDitlRun('DITL-83@22') === 1,
    m0 = U.m0 > 0 ? U.m0 : 474,
    f = op ? 1 : Math.max(0, Math.min(1, (+U.qlp || 0) / (0.03 * m0))),
    Pc = isFinite(U.cdP) ? U.cdP - 1.033 : 0;
  U.hrW = op ? 1 : 0;
  const Tw = isFinite(U.Tw) ? U.Tw : Ta,
    rest = Ta + (K.rest - Ta) * Math.max(0, Math.min(1, (Tw - Ta) / (steamTsat(AN_SB.dr.P0) - Ta)));
  let tg = rest;
  if (f > 0 && Prh > 0.5 && isFinite(Trh)) tg = rest + Math.max(0, steamTph(Pc, steamH(Prh, Trh)) - rest) * f;
  if (!isFinite(U.hrT10)) U.hrT10 = rest;
  U.hrT10 += (tg - U.hrT10) * Math.min(1, dt / (tg > U.hrT10 ? K.tauH : K.tauC));
}
