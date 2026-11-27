/* Phase 11 (plant model, MODEL TURBINE REHEAT : RIN, 2026-11-27; user "Ok sinisimulan naba plant model? Gawin nio na", ownership
   /mnt/project-files/phase11/ownership-2026-11-27.md). THE STEAM TURBINE of the one plant model, MOVED here from unit.js unchanged
   (step B: the move only, the same code and the same numbers; the old copy in unit.js is deleted in the same change, so there is one
   turbine). Next steps replace the per-load heat balance tables AN_TBW / AN_HB with the Stodola stage law and the section efficiencies
   of the design point (rule 0, RULES.md 3.12). The reheat / bypass part of anUnitStep stays in unit.js (its own section). Joined into
   the one analog script before unit.js (src/analog/order.list). */
/* 2.2.0-beta.17 (M4 step 4): the operator on the TCS panel (outside the DCS): 'roll' (open the stop valves, IP start mode, rpm up
   at rollRate), 'sync' (at 3600 rpm: GCB closed, initial load MWinit), 'loadup' (target MW at rateUp MW/min; default 45 = NORMAL
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
/* 3.2.3 SAKURA (user 2026-11-14: the turbine is MHPS, Phase 2 design data are valid for Unit 1): the turbine heat balance, MHPS
   PPE-14-0725 Rev.1 "Heat Balance Diagram" (SMC Limay Phase II 2 x 150 MW, As Build 2019-01-16; the same Hitachi HB set as SMC Davao
   PPE-13-0138 R4, read on the PC, not in the repository), pages 6 ~ 12: 30 / 40 / 50 / 60 / 70 / 85 / 100 % load. Main steam kg/h, the
   stage (extraction) pressures ata and the LP extraction flows kg/h. Cross-check with the repository (mass balance / HEAT_BALANCE.md /
   FHI heater O&M): 100 % MS 458,327 kg/h, final FW 245.4 C 458,684 kg/h, No.6 45,147, No.3 15,246, No.2 12,270 kg/h, No.5 enthalpy
   787.1 kcal/kg = 3295.5 kJ/kg, No.3 676.7 = 2833.2, the same as the app. Before, every stage pressure and flow went with main steam / 458.684
   (NO-SOURCE shape); the HB gives that ratio within 1 ~ 3 % at the HP end and up to 9 % low at 30 % load at the LP end (No.1: 0.357, flow 0.133).
   anHb(k, ms) = the value of row k at ms over its 100 % value; below 30 % load straight to 0 at no flow, above 100 % on the 85 -> 100 % slope */
/* 3.2.3 (SAKURA, coordinator / Jennie 2026-11-15: the MW line MW = c x steam - mwK was fitted on the plant trends of 2026-11-08, which
   the user forbids as a basis): the generator MW from the enthalpy drop of the turbine sections, MHPS Heat Balance Diagram of Unit 1:
   PPE-13-0106 Rev.2 (SMC Limay Power Plant Project 2 x 150 MW, SMC Consolidated Power Corp., contract XZ-DPC566 = Phase I), pages 5 ~ 11
   (100 / 85 / 70 / 60 / 50 / 40 / 30 %) and the VWO sheet 310SD09-061 R3 (in pages 12 ~ 20); the same Hitachi sheets 310SD07-485 R4, 310SD09-053 ~ 061 with the same numbers
   as PPE-14-0725 R1 (Limay Phase II, as built 2019) pages 6 ~ 12 / 14, compared page by page on the PC 2026-11-15. CALC per case,
   kcal/h / 860 = kW:
     HP  = (MS - front gland - HP to IP leak) x (H main steam - H HP exhaust); the HP exhaust end gland (to B / C) leaves after the blading.
     IP / LP = HRH x H HRH + leak x its H + front gland to the crossover (A) x H main steam - (No.5, deaerator, No.3, No.2, No.1
           extraction x their stage H) - LP exhaust x H exhaust: the mass of each case closes to 0 kg/h. The extractions to the heaters
           are in it (design line-up; a heater out of service: U.dMWx, below).
   Per T/H of main steam (kW): wh = HP, wi = IP / LP, with the IP / LP taken on the main steam equivalent (qip = the steam through the
   ICV, = the main steam with the bypasses shut). Below 30 % the 30 % values are held (no case below 30 % in the HB).
   Shaft - generator kW of the cases 30 ~ 100 % (power factor 0.85) = 2.64 ~ 3.34 MW: the mechanical and generator losses (not printed in
   the HB; kW printed after the excitation power), CALC as L = lo + kq x shaft^2 (lo 2.565 MW, kq 3.295e-5 / MW): the 8 cases come back
   within 0.1 % of the printed kW. With no steam on the grid the same lo is taken from the grid (motoring; the windage of the blading
   without steam is NO-SOURCE) */
const AN_TBW = {
  ms: [149.954, 190.769, 231.94, 273.36, 318.817, 387.587, 458.327, 472.46],
  wh: [77.49, 77.72, 79.79, 81.25, 81.2, 81.96, 82.0, 81.9],
  wi: [240.2, 250.85, 255.46, 258.39, 257.31, 254.96, 252.56, 252.04],
  lo: 2.565,
  kq: 3.295e-5
};
function anTbW(k, m) {
  const X = AN_TBW.ms,
    Y = AN_TBW[k],
    n = X.length;
  if (!(m > X[0])) return Y[0];
  if (m >= X[n - 1]) return Y[n - 1];
  let i = 1;
  while (X[i] < m) i++;
  return Y[i - 1] + ((Y[i] - Y[i - 1]) * (m - X[i - 1])) / (X[i] - X[i - 1]);
}
/* 1.0.0-beta.346 (JENNIE, T1, user 2026-11-24 "GO DESIGN"): each heat balance case is at its own design steam temperature, the MST /
   RHT characteristic of the turbine (PPE-14-0725, read per sheet): 30 % 505 / 505 C (98.9 ata, sliding), 40 % 520 / 520, 50 % 529 / 529
   (Rev. 4, "MST RST corrected according to MST / RST characteristics"), 60 % and up 538 / 538 at 126 ata. So wh / wi of AN_TBW hold only
   at that temperature. The work per kg of a turbine section at a fixed pressure ratio goes with its inlet temperature (isentropic drop
   dh = cp T1 (1 - (p2 / p1)^((k - 1) / k)), ideal gas form of the superheated steam expansion): wh x (MST + 273.15) / (Tc + 273.15) and
   wi x (RHT + 273.15) / (Tc + 273.15), Tc = the case temperature at the same flow (AN_TBW.T, linear in flow like wh / wi). At the design
   temperature the factor is 1 and the HB MW comes back exactly; hotter or colder steam than the design gives more or less MW per T/H.
   CALC, no fit. U.hxO.ms / .rh = the SH / RH outlet (hx.js) */
AN_TBW.T = [505, 520, 529, 538, 538, 538, 538, 538];
function anTbT(T, m) {
  const Tc = anTbW("T", Math.max(0, +m || 0)) + 273.15;
  return isFinite(T) && T > 200 ? Math.max(0.6, Math.min(1.1, (T + 273.15) / Tc)) : 1;
}
/* ms = HP turbine steam, qip = IP / LP steam (main steam equivalent), T/H; kh / ki = anTbT of the main / reheat steam; returns the
   generator MW (negative = motoring) */
function anTbGen(ms, qip, kh, ki) {
  const m = Math.max(0, +ms || 0),
    q = Math.max(0, +qip || 0),
    sh = (m * anTbW('wh', m) * (kh || 1) + q * anTbW('wi', q) * (ki || 1)) / 1000;
  return sh - AN_TBW.lo - AN_TBW.kq * sh * sh;
}
const AN_HB = {
  ms: [149954, 190769, 231940, 273360, 318817, 387587, 458327],
  x6: [12.79, 16.35, 19.9, 23.48, 27.25, 32.89, 38.64] /* HP exhaust = No.6 (No.2 HPH) extraction */,
  x5: [5.0, 6.38, 7.75, 9.13, 10.56, 12.7, 14.87] /* No.5 (No.1 HPH) */,
  xd: [2.173, 2.769, 3.355, 3.943, 4.553, 5.457, 6.369] /* deaerator */,
  x3: [0.658, 0.837, 1.014, 1.19, 1.373, 1.643, 1.914] /* No.3 LPH */,
  x2: [0.286, 0.364, 0.44, 0.516, 0.594, 0.71, 0.826] /* No.2 LPH */,
  x1: [0.133, 0.167, 0.201, 0.234, 0.269, 0.321, 0.373] /* No.1 LPH */,
  f3: [4251, 5603, 6963, 8422, 10009, 12531, 15246],
  f2: [3426, 4525, 5685, 6871, 8190, 10192, 12270],
  f1: [2243, 4184, 6060, 7935, 10093, 13357, 16834]
};
function anHb(k, msT) {
  const X = AN_HB.ms,
    Y = AN_HB[k],
    n = X.length - 1,
    m = Math.max(0, +msT || 0) * 1000,
    y = m <= X[0] ? (Y[0] * m) / X[0] : m >= X[n] ? Y[n] + ((Y[n] - Y[n - 1]) * (m - X[n])) / (X[n] - X[n - 1]) : (() => {
      let i = 1;
      while (X[i] < m) i++;
      return Y[i - 1] + ((Y[i] - Y[i - 1]) * (m - X[i - 1])) / (X[i] - X[i - 1]);
    })();
  return Math.max(0, y / Y[n]);
}
/* 3.2.3-beta.240 (live Cold start, ICV to CV transfer; user 2026-11-14: per the TCS drawings, the normal ATS load up, no GOV manual):
   the TCS load loop on the grid. FLOW DEMAND (TCE206 p.140: GOV.SET through the low select with LLM SET, which the ATS has at its upper
   limit) = the TCS target load as a share of the rating (feedforward, the target MW of TCE195) + the integral of the MW error (TCE195 GOV
   CONTROL PI on TARGET MW - GEN. MW, AN_TCE195 below), moved at most 1 %/s (TCE207 A007 RI / RD). TCE207: ICV demand =
   flow demand / CV OPENING BIAS (full open at 20 %), CV demand = (flow demand - 20 %) / 80 % (the FG curves of TCE212 / TCE214 are
   PARA-LIST, NO-SOURCE: linear here). The valves follow at 10 %/s (TCE214 SG C007). TRANSFER (ICV TO CV TRANSFER COMPLETE I.0418) =
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
/* 3.2.3-beta.240 (user 2026-11-14): the 32 REVERSE POWER relay of the generator protection panel (Beckwith M-3425A, GEE-2015-0173 R1
   SITE TEST PROCEDURE OF GEN. PROTECTION RELAY PANEL, PDF p.16 (PAGE 14) 32A: #1 (Alarm) pickup -0.008 pu, delay 300 cycles (5.0 s); #2
   (Trip) pickup -0.013 pu, delay 600 cycles (10.0 s); over / under power "Over"; 1 pu = 115 V / 3.69 A secondary, taken as the generator
   rating 176.5 MVA (AN_GEN.S): alarm at -1.4 MW, trip at -2.3 MW. Sequence test PDF p.7 (P.5) rows 12 / 13: both with 52G closed; #1 =
   "1st REVERSE POWER (32) OPERATED"; #2 = "2nd REVERSE POWER (32) OPERATED", lockout relay 86G-A: 52G and 41 open and the turbine trips
   (ANN & ST TRIP). Here the 86G-A drives the TA-9 input GEN./UNIT TRANS. PROTECTION A & GEN. LOCKOUT RELAY A (tcs-trip.js); the turbine
   trip opens 52G and 41 (tcsGenTrip). The 86G-A is reset with the TURBINE RESET (NO-SOURCE: the hand reset of the lockout relay is on the
   protection panel, not on the app). Other relays of the panel are not modelled */
const AN_RP32 = { a: -0.008, t1: 5, b: -0.013, t2: 10 };
function anRp32(U, on, dt) {
  const r = U.rp32 || (U.rp32 = { t1: 0, t2: 0, al: false, lo: false }),
    p = on ? (+U.MW || 0) / AN_GEN.S : 0,
    ev = m => {
      if (typeof window !== 'undefined' && window.lsEventAdd && !(window.ENG && ENG.mode === 'mirror'))
        lsEventAdd('GEN', 'GEN', m);
    };
  r.t1 = on && p <= AN_RP32.a ? r.t1 + dt : 0;
  r.t2 = on && p <= AN_RP32.b ? r.t2 + dt : 0;
  const al = r.t1 >= AN_RP32.t1;
  if (al && !r.al) ev('1st REVERSE POWER (32) OPERATED: ' + (+U.MW).toFixed(1) + ' MW');
  r.al = al;
  if (r.t2 >= AN_RP32.t2 && !r.lo) {
    r.lo = true;
    ev('2nd REVERSE POWER (32) OPERATED: generator lockout relays 86G-A / 86G-B, turbine trip');
  }
  tcsLo86(U); /* gen-panel.js: the lockout relays 86G-A / 86G-B / 86T */
}
/* 3.2.3 house load (52L1 open, 52G1 closed): the turbine generator speed from the swing equation 2 H w dw/dt = Pm - Pe (per unit on
   AN_GEN.S): Pm = the turbine steam power MWss (no tauMW lag: the CV / ICV cut the steam at once, the lag of U.MW stands for the reheater
   and the 60 s averages of the plant trends), Pe = the house load (elec.js). On the grid (52L1 closed) the grid holds 3600 rpm (the
   sync check relay 25 closes 52L1 at once in the model, elec.js) */
function anTbSpeed(U, tb, dt, on, Pm, Pe) {
  const hz = anGridHz(U, dt);
  if (!(U.el && U.el.l52 === false)) {
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
