/* 3.2.3-beta.258 (user 2026-11-15 "isang unit lng naman yan.. isang dcs.. isang planta"): ONE heat transfer model of the boiler for every
   plant state (Cold, Warm, Hot, Start at 150 MW, load up / down, trips). Before, "Start at 150 MW" ran the steam temperatures on design
   curves (natSH / sprayCurve / suCurve) and only the Cold path had a two-lump tube metal model. Now the gas path, the tube metal and the
   steam / water side are one chain, the same equations at every load:

     bed (Tb) --radiation--> in-furnace SH panels P1, P2 (wing walls)
     cyclone outlet gas (U.tgB) -> backpass walls (full stream) -> damper split (HICHR1002A RH pass / HICHR1002B SH pass)
         RH pass: reheater R4 R3 R2 R1 (counterflow) -> No.2 economizer R half
         SH pass: finishing SH F3 F2 F1 (counterflow) -> No.3 economizer -> No.2 economizer S half
       -> mixed -> No.1 economizer -> air heater (boiler.js anAphStep)
     steam: drum -> backpass walls -> P1 -> spray 1 (TICBR1130) -> P2 (TT-BR1140) -> spray 2 (TICBR1150) -> F1 F2 F3 (TT-MS1004)
            cold reheat + RH spray -> R1 .. R4 (TT-HR1002)
     water: No.2 HP heater outlet (U.hpT2) -> No.1 eco -> No.2 eco (two halves) -> No.3 eco -> drum

   Each bank is a metal node: gas film q = Cg (1 - exp(-UA / Cg)) (Tgas - Tm), Cg = gas kg/s x cp(T) of the flue gas, and UA = A x
   (hc + hr) worked out every scan from the as-built tube geometry: hc = Zukauskas in-line tube bank, Nu = 0.27 Re^0.63 Pr^0.36 at the
   gas velocity between the tubes (gas kg/s, IDEAL gas density at the local temperature, free area = width x pass depth x (St - D) / St);
   hr = non-luminous gas radiation (CO2 + H2O, weighted-sum-of-gray-gases, Smith-Shen-Friedman 1982, Pw/Pc = 1) at the mean beam length
   of the bank 3.6 (St Sl - pi D^2 / 4) / (pi D). A panel takes uaP x phi x (Tb - Tm) from the bed (phi = the circulating solids share of
   the bed model, AN_BB); the steam leaves at Tin + eps (Tm - Tin), eps = 1 - exp(-NTU), NTU = 3 x (m / m0)^-0.2 (steam film ~ m^0.8);
   metal M dTm/dt = q gas - q steam. No flow: the stagnant steam is at the metal. A spray mixes by enthalpy (IF97 steam.js).

   SOURCES (no fit to a plant snapshot or trend):
   - Tube banks, as-built FHI drawings: reheater K1AU3-B-0-008 (R-001, R-002 A-A): 4 banks R-3 .. R-6 of 106 elements, OD 57.15 mm
     (2.25 in), 114.3 mm both ways, legs per element counted on R-001 (R-3, R-4, R-5 24, R-6 18), RH pass depth 3,371.9 mm, backpass
     width 12,242.8 mm. Finishing SH K1AU3-B-0-003 (C-001): S-35, S-36, S-37 of 106 elements, OD 50.8 mm, 114.3 x 101.6 mm, legs
     20 / 20 / 24, SH pass depth 3,028.9 mm. Economizer K1AU3-B-0-005 (E-001): No.1 E-2 115 elements OD 50.8 mm, 20 legs, 5,500 mm
     (1,858.4 + 1,783.2 + 1,858.4); No.2 R E-10 106 x OD 57.15, 16 legs (RH pass); No.2 S E-7 106 x OD 50.8, 10 legs; No.3 E-14 + E-15
     106 x OD 50.8, 20 + 20 legs (SH pass). Leg = pass depth - 0.2 m of bends. Gas path order: GA K1AU3A-001.
   - Gas: FHI Tab 2 fuel (C 42.97, H 2.75, O 11.42, N 0.59, S 1.49, ash 6.82, water 33.96 %) at 20 % excess air (Tab 3): 7.45 kg gas
     per kg coal, x CO2 0.140, x H2O 0.128, M 29.2; cp = 1.08 + 0.000213 T kJ/kg K (mass-weighted N2 / CO2 / H2O / O2).
   - Steam-cooled backpass walls (side, front, rear, division, roof): 1,130 m2 from the GA (12.24 m x (3.37 + 3.03) m pass, FL 25,200 to
     43,650), h = 5.5 W/m2K along the wall + the same gas radiation.
   - In-furnace SH panels #1 and #2 (7 each, P4S1, equal size): their drawing (C series) is not in the documents, so uaP is CALC from the
     FHI MCR balance (Tab 3: 460 T/H, feedwater 245.4 C, SH out 541 C 129 kg/cm2, RH 401 T/H 370 -> 541 C 36.6 kg/cm2), the whole
     chain of this file at a 875 C bed (middle of FHI 850 - 900 C, P2S4 p2-4-8), both biasing dampers full open (the vendor normal
     split, p8 / p11), no spray: the panel UA that gives SH out 541 C = 59 kW/K each (uaP 55 -> 534.5 C, 65 -> 550.9 C). The same run
     gives RH out 539 C, economizer out 298 C (Tab 3 303), air heater gas in 299 C (Tab 3 322). (The 41.2 of the first pass had the
     backpass gas at the bed temperature, without the backpass walls.)
   - Check of the geometry against FHI Tab 3 at MCR, clean tubes, 875 C gas, damper share for RH 541 C: eco out 298 C (Tab 3 303),
     air heater gas in 286 C (Tab 3 322): the banks take 6 % more than the design. Not adjusted; NOT modelled: steam-side film, tube
     wall and ash deposit resistance (tube wall thickness not read).
   - Pass split: both passes see the same pressure drop (they join under the economizers). Each pass = its tube banks + its biasing
     damper. Banks: Jakob 1938 in-line bank friction, f = (0.044 + 0.08 (Sl/D) / (St/D - 1)^(0.43 + 1.13 D/Sl)) Re^-0.15,
     dP = 4 f N rho Vmax^2 / 2, geometry above. Damper: FHI K1AU3-D1-0-015 R1 (Promax, PO XZ-EPNR63): louver opposed blade, RH pass
     duct 12,185 x 3,343 mm, SH pass 12,185 x 3,000 mm, 624,680 / 648,000 m3/h at 376 C, resistance coefficient 0.4 full open
     (calculation sheet p10), "Pressure loss vs blade position (RH pass)" p15 Normal condition V 4.2 m/s, gamma 0.53: zeta read from
     the curve (15 deg 275 mmAq ... 50 deg 3 mmAq; zeta = dP 2g / (V^2 gamma)); under 15 deg the curve is extended on the same log
     slope (CALC). Blade travel: MV 0 - 100 % (4 - 20 mA positioner, linear) = 15 - 90 deg open (th0 below; beta.336).
     Source of the 15 deg: both vendor curves (p15 RH pass, p16 SH pass) are drawn from 15 deg; their four design cases (Normal, BMCR,
     70 % gas to RH, 60 % gas to SH) give the control range the damper pair was sized for: RH share 40 - 70 %. With 0 - 90 deg the
     chain gave 13 - 88 % at 150 MW (RH 0 % / SH 100 % and back), far past it; with 15 - 90 deg it gives 28 - 73 %. Check against
     the plant at 150 MW (scenario 1: RH 11 % / SH 89 %): RH share 37 % (heat balance CALC of the plant: 40 %); 0 - 90 deg gave 22 %.
     Check: both dampers full open -> RH pass 48.6 % of the gas; the vendor design flows give 49.1 % (p8 / p11).
   - Tube metal: GA p6 K1AU3A-201 (SH 353.26 t, RH 243.1 t, steel 0.5 kJ/kg K); economizer metal 112.2 MJ/K:
     the economizer of the same GA table (team-files/plant-study/13-thermal-masses: loop 189.00 t + common link 15.83 t + headers
     19.59 t = 224.42 t) x 0.5 kJ/kg K (beta.292, JENNIE, was 120 MJ/K NO-SOURCE; the bank split below kept, each x 112.21 / 120). */
const AN_HX = {
  /* damper zeta vs blade angle (deg open), K1AU3-D1-0-015 p15 / p10 */
  th0: 15 /* deg open at MV 0 % (see the note above) */,
  dz: [
    [0, 4350],
    [15, 577],
    [20, 294],
    [25, 136],
    [30, 69],
    [35, 36],
    [40, 19],
    [45, 10.5],
    [50, 6.3],
    [90, 0.4]
  ],
  aDR: 12.185 * 3.343 /* RH pass damper duct, m2 */,
  aDS: 12.185 * 3.0 /* SH pass damper duct, m2 */,
  ntu0: 3,
  W: 12.2428 /* backpass width, m */,
  sig: 5.67e-8,
  pC: 0.268 /* atm, CO2 + H2O partial pressure */,
  /* bank geometry: OD m, St m, Sl m, legs, elements, pass depth m */
  gR: [
    [0.05715, 0.1143, 0.1143, 24, 106, 3.3719],
    [0.05715, 0.1143, 0.1143, 24, 106, 3.3719],
    [0.05715, 0.1143, 0.1143, 24, 106, 3.3719],
    [0.05715, 0.1143, 0.1143, 18, 106, 3.3719]
  ] /* R-3 (steam in), R-4, R-5, R-6 (gas in) */,
  gF: [
    [0.0508, 0.1143, 0.1016, 20, 106, 3.0289],
    [0.0508, 0.1143, 0.1016, 20, 106, 3.0289],
    [0.0508, 0.1143, 0.1016, 24, 106, 3.0289]
  ] /* S-35 (steam in), S-36, S-37 (gas in) */,
  gE1: [0.0508, 12.2428 / 115, 0.1016, 20, 115, 5.5],
  gE2r: [0.05715, 0.1143, 0.1143, 16, 106, 3.3719],
  gE2s: [0.0508, 0.1143, 0.1016, 10, 106, 3.0289],
  gE3: [0.0508, 0.1143, 0.1016, 40, 106, 3.0289],
  wA: 1130 /* m2, steam-cooled backpass walls */,
  /* beta.262: the CALC above had NO spray, but the FHI design (02 Fig 10, P4S1) has 2.7 % SH spray at MCR = 12.4 T/H (0 at 60 %,
     1.1 % at 70, 1.95 % at 85): with 59 the 150 MW steady of the model took no spray (541 C only by the outer loop tracking at 0) and
     every load change had no spray margin. CALC in the app at the 150 MW steady of the plant model (bed 830 C from its heat balance,
     460 T/H, both dampers as the logic sets them): uaP 59 -> 0 T/H, 70 -> 7.3, 75 -> 11.5 ~ 12.9 T/H; 75 = the FHI design spray */
  /* 1.0.0-beta.256 (JENNIE): the panels sit in the upper furnace and now see its mean suspension temperature I.Tb = U.Tu (unit.js,
     AN_BB tbA), not the bed. Their heat at the 150 MW state of the model is held (the design spray of the CALC above): there they took
     75 x (856 - 412.7) + 75 x (856 - 465.8) = 62.5 MW from the 856 C bed; at the new anchor Tu 892.3 C the same heat needs
     33.25 MW / (892.3 - 412.7) = 69.3 and 29.27 MW / (892.3 - 465.8) = 68.6 kW/K: 69 (CALC) */
  /* beta.284 (JENNIE): the same rule (hold the design heat of the panels, 62.5 MW at 150 MW) after beta.282 (the suspension heat by
     the square root of its density, unit.js AN_BB kKL): at the 150 MW steady of beta.282 (save 150MW-bed-AUTO-2-coolers, operator
     probe) the two panels took 65.4 MW and the SH sprays 15.2 + 2.2 = 17.4 T/H, FHI Fig 10 12.4 T/H. The 5 T/H more spray carried
     1.39 kg/s x (3150 - 1085) kJ/kg (spray water to the steam at the spray, IF97 near 133 bar 450 C) = 2.9 MW: 65.4 - 2.9 = 62.5 MW,
     the design heat. 69 x 62.5 / 65.4 = 65.9; with 66 the same probe gave 63.2 MW (the panel metal follows): 66 x 62.5 / 63.2 = 65.3:
     65 (CALC) */
  uaP: 76.1 /* kW/K each SH panel (beta.348 design anchor, uaP1 / uaP2 below); was 65, CALC above (the design panel heat 62.5 MW and the FHI Fig 10 spray 12.4 T/H at 150 MW) */,
  /* 1.0.0-beta.346 (JENNIE, user 2026-11-24 "GO DESIGN": the design documents are the only targets). beta.342 had scaled the two panels
     to the plant 150 MW readings (117 / 63 kW/K, spray 1 34.9 T/H); that was a fit to one plant day, not the design. Back to the design
     CALC above for both panels. The two keys stay so a panel can be taken alone (unit.js reads both) */
  /* 1.0.0-beta.348 (JENNIE, D9): the same rule again (hold the design panel heat 62.5 MW at 150 MW) at the design anchor of unit.js
     AN_BB (bed 860, Tu 849.9 C): 33.25 MW / (849.9 - 412.7) = 76.0 and 29.27 MW / (849.9 - 465.8) = 76.2 kW/K: 76.1 each (CALC) */
  uaP1: 76.1 /* kW/K SH panel #1 */,
  uaP2: 76.1 /* kW/K SH panel #2 */,
  /* [metal kJ/K, design steam / water flow T/H] */
  wl: [17663, 447.6],
  p1: [70652, 447.6],
  p2: [56522, 454.7],
  fsh: [
    [15006, 460],
    [9682, 460],
    [7182, 460]
  ],
  rh: [
    [54434, 401],
    [29843, 401],
    [21009, 401],
    [16264, 401]
  ],
  e1: [34411, 447.6],
  e2r: [24237, 223.8],
  e2s: [8977, 223.8],
  e3: [44585, 447.6],
  /* design metal temperatures (geometry check above), the start of "Start at 150 MW" before the settle below */
  m0: {
    wl: 360,
    p1: 375,
    p2: 410,
    fsh: [420, 465, 515],
    rh: [345, 380, 430, 500],
    e1: 265,
    e2r: 275,
    e2s: 270,
    e3: 290
  }
};
/* flue gas cp (kJ/kg K) at T C */
function anHxCp(T) {
  return 1.08 + 0.000213 * Math.max(0, T);
}
/* WSGG emissivity of the CO2 + H2O gas at T C, path L m */
const AN_HX_WS = [
  [0.4201, 6.508e-1, -5.551e-4, 3.029e-7, -5.353e-11],
  [6.516, -0.2504e-1, 6.112e-4, -3.882e-7, 6.528e-11],
  [131.9, 2.718e-1, -3.118e-4, 1.221e-7, -1.612e-11]
];
function anHxEps(T, L) {
  const K = T + 273.15;
  let e = 0;
  for (const w of AN_HX_WS) e += (w[1] + w[2] * K + w[3] * K * K + w[4] * K * K * K) * (1 - Math.exp(-w[0] * AN_HX.pC * L));
  return Math.max(0, e);
}
/* outside tube area (m2) of a bank g */
function anHxA(g) {
  const [D, , , N, n, dep] = g;
  return N * n * Math.PI * D * (dep - 0.2);
}
/* ASH DEPOSITS ON THE BACKPASS BANKS (Phase 11 KANA, Rule 0). Clean banks give the air heater gas in 298 C at 150 MW (headless, 3.2.4);
   the design (FHI P2S7 Tab 3) has 322: the design is a fouled boiler. Every bank carries the design deposit resistance
   rInf (m2K/W) at all loads and in every start state:
   - rInf 0.0042: CALC, the value that takes the air heater gas in from 298 to the design 322 C at 150 MW with every bank at the
     same deposit (headless 2026-11-17: 321.2 C at 0.0042).
   The deposit does not grow or get blown off: no document gives a fouling rate, a blowing interval or a lance effectiveness
   (Diamond Power N11639-SC1 gives 28 blowers, 84 min, 3,882 kg only; PC read kana-sh-tubes-sootblow-2026-11-28.md). The growth
   time and the lance effectiveness that were here had no design source; both are deleted. The soot
   blowers still run in the logic; they do not change the heat transfer until a document gives those numbers. */
const AN_FOUL = { rInf: 0.0042 /* m2K/W, CALC (see above) */ },
  AN_FOUL_R = { r0: AN_FOUL.rInf, r1: AN_FOUL.rInf, r2: AN_FOUL.rInf, r3: AN_FOUL.rInf, f0: AN_FOUL.rInf, f1: AN_FOUL.rInf, f2: AN_FOUL.rInf, e1: AN_FOUL.rInf, e2r: AN_FOUL.rInf, e2s: AN_FOUL.rInf, e3: AN_FOUL.rInf };
/* UA (kW/K) of a bank g = [D, St, Sl, legs, elements, depth] at gas m kg/s, gas T, metal Tm */
function anHxUA(g, m, T, Tm) {
  const [D, St, Sl, N, n, dep] = g,
    A = N * n * Math.PI * D * (dep - 0.2),
    K = T + 273.15,
    mu = (1.716e-5 * Math.pow(K / 273.15, 1.5) * 384.15) / (K + 111),
    k = 0.0253 * Math.pow(K / 273.15, 0.81),
    Re = (Math.max(0, m) / (AN_HX.W * dep * (St - D) / St)) * D / mu,
    hc = Re > 1 ? (0.27 * Math.pow(Re, 0.63) * 0.879 * (N < 16 ? 0.95 : 1) * k) / D : 0,
    Lb = (3.6 * (St * Sl - (Math.PI * D * D) / 4)) / (Math.PI * D),
    dT = T - Tm,
    hr = Math.abs(dT) > 1 ? (AN_HX.sig * anHxEps(T, Lb) * (Math.pow(K, 4) - Math.pow(Tm + 273.15, 4))) / dT : 4 * AN_HX.sig * anHxEps(T, Lb) * K * K * K;
  return (A * (hc + Math.max(0, hr))) / 1e3;
}
/* flue gas density, kg/m3 (M 29.2, backpass ~ 98.6 kPa abs: damper data sheet -282 mmAq) */
function anHxRho(T) {
  return (98600 * 29.2) / (8314 * (Math.max(0, T) + 273.15));
}
/* pressure drop of one in-line bank, Pa (Jakob 1938) */
function anHxDp(g, m, T) {
  if (!(m > 0)) return 0;
  const [D, St, Sl, N, , dep] = g,
    K = T + 273.15,
    mu = (1.716e-5 * Math.pow(K / 273.15, 1.5) * 384.15) / (K + 111),
    r = anHxRho(T),
    V = m / (r * AN_HX.W * dep * (St - D) / St),
    Re = Math.max(10, (r * V * D) / mu),
    f = (0.044 + (0.08 * (Sl / D)) / Math.pow(St / D - 1, 0.43 + (1.13 * D) / Sl)) * Math.pow(Re, -0.15);
  return 4 * f * N * r * V * V / 2;
}
/* damper zeta at an opening x (0 - 1): log interpolation of the vendor curve */
function anHxZeta(x) {
  const L = AN_HX.dz,
    a = AN_HX.th0 + (90 - AN_HX.th0) * Math.max(0, Math.min(1, isFinite(x) ? x : 1));
  for (let i = 1; i < L.length; i++)
    if (a <= L[i][0]) return Math.exp(Math.log(L[i - 1][1]) + ((Math.log(L[i][1]) - Math.log(L[i - 1][1])) * (a - L[i - 1][0])) / (L[i][0] - L[i - 1][0]));
  return L[L.length - 1][1];
}
/* saturated liquid enthalpy, kJ/kg, at T C: IF97 region 1 at the saturation pressure (steam.js steamR1 / steamPsat). Phase 11
   (KANA 2026-11-27): in place of the 19-point table AN_HX_HF (one water property source). Region 1 holds to 350 C (IF97 Table 1) */
function anHxHw(T) {
  if (!(T > 0)) return 0;
  const Tc = Math.min(350, T);
  return steamR1(Math.max(0.006117, (steamPsat(Tc) + 1.0332) * 0.0980665), Tc + 273.15).h;
}
/* its inverse, T C of a saturated liquid enthalpy: secant on anHxHw, from h / 4.2 and h / 4.6 (about 4 evaluations to 0.01 kJ/kg) */
function anHxTw(h) {
  if (!(h > 0)) return 0;
  let T0 = Math.min(350, h / 4.6),
    f0 = anHxHw(T0) - h,
    T1 = Math.min(350, h / 4.2),
    f1 = anHxHw(T1) - h;
  for (let k = 0; k < 8 && Math.abs(f1) > 0.01 && f1 !== f0; k++) {
    const T2 = Math.min(350, Math.max(0.01, T1 - (f1 * (T1 - T0)) / (f1 - f0)));
    (T0 = T1), (f0 = f1), (T1 = T2), (f1 = anHxHw(T1) - h);
  }
  return T1;
}
/* steam enthalpy at P (kg/cm2 g) and T, never under saturated vapour */
function anHxHs(P, T) {
  const ts = steamTsat(Math.max(0, P));
  return steamH(Math.max(0, P), Math.max(ts + 0.01, T));
}
/* temperature of steam of enthalpy h at P: under the saturated vapour it is wet steam at saturation */
function anHxTs(P, h) {
  const p = Math.max(0, P),
    ts = steamTsat(p),
    hg = steamH(p, ts + 0.01);
  return h <= hg ? ts : steamTph(p, h);
}
/* one metal node, steam / water side: m T/H, m0 design T/H, hin kJ/kg, water = economizer. Returns the heat to the medium (kW) and hout */
function anHxSide(Tm, m, m0, P, hin, water) {
  if (!(m > 0.5) || !isFinite(hin)) return { q: 0, h: NaN, T: Tm };
  const Tin = water ? anHxTw(hin) : anHxTs(P, hin),
    eps = 1 - Math.exp(-AN_HX.ntu0 * Math.pow(m / m0, -0.2));
  let To = Tin + eps * (Tm - Tin);
  const tsat = steamTsat(Math.max(0, P));
  if (water) To = Math.min(To, tsat - 0.1);
  const ho = water ? anHxHw(To) : anHxHs(P, To);
  return { q: (m / 3.6) * (ho - hin), h: ho, T: water ? To : anHxTs(P, ho) };
}
/* gas side of a bank g (geometry) or of the walls (g = null): gas m kg/s at Tg; the heat the gas gives (kW) and the gas out. The UA
   and the cp are taken at the mean gas temperature (one correction pass) */
function anHxGas(Tm, g, m, Tg, rf) {
  if (!(m > 0.01) || !isFinite(Tg)) return { q: 0, Tg };
  /* 3.2.4: the ash deposit (rf m2K/W on the bank's outside area) in series with the clean gas film: 1 / UA = 1 / UA0 + rf / A */
  const rA = g && rf > 0 ? (1000 * rf) / anHxA(g) : 0;
  let Tgm = Tg,
    q = 0,
    Cg = 0;
  for (let i = 0; i < 2; i++) {
    Cg = m * anHxCp(Tgm);
    const UA = g
      ? 1 / (1 / Math.max(1e-6, anHxUA(g, m, Tgm, Tm)) + rA)
      : (AN_HX.wA * (5.5 + (Math.abs(Tgm - Tm) > 1 ? (AN_HX.sig * anHxEps(Tgm, 0.21) * (Math.pow(Tgm + 273.15, 4) - Math.pow(Tm + 273.15, 4))) / (Tgm - Tm) : 0))) / 1e3;
    q = Cg * (1 - Math.exp(-Math.max(0, UA) / Cg)) * (Tg - Tm);
    Tgm = Tg - q / Cg / 2;
  }
  return { q, Tg: Tg - q / Cg };
}
/* the whole chain, one scan. I = inputs (numbers), U.hxM = the metal temperatures (numbers only: SAVE keeps U as JSON) */
function anHxStep(U, I, dt) {
  const K = AN_HX;
  let M = U.hxM;
  if (!M || !isFinite(M.wl)) {
    /* a cold boiler: every bank at the water (or the room); a loaded boiler: the design metal, then settled on the inputs */
    const c = isFinite(I.Tm0) ? I.Tm0 : null,
      d = x => (c == null ? x : Array.isArray(x) ? x.map(() => c) : c);
    M = U.hxM = {};
    for (const k of Object.keys(K.m0)) M[k] = d(K.m0[k]);
    /* settled on the design flows where a first scan has not got them yet */
    const J = Object.assign({}, I, {
      settle: 1 /* no ash deposit in the settle */,
      w1: isFinite(I.w1) ? I.w1 : 7.1,
      w2: isFinite(I.w2) ? I.w2 : 5.3,
      mEco: isFinite(I.mEco) && I.mEco > 0 ? I.mEco : Math.max(0, (I.mOut || 0) - 12.4),
      phi: I.phi > 0 ? I.phi : 1,
      /* FHI Tab 2 fuel at 20 % excess air: 7.45 kg gas / kg coal x 89 T/H = 184.2 kg/s at MCR 460 T/H, pro rata on the steam */
      mG: I.mG > 0 ? I.mG : (184.2 * Math.max(0, I.mOut || 0)) / 460
    });
    /* one hour of plant at 5 s steps: the slowest banks (RH R-3 54 MJ/K on ~100 kW/K, economizer 48 MJ/K) settle in ~10 min */
    if (c == null) for (let i = 0; i < 720; i++) anHxStep(U, J, 5);
  }
  const mG = Math.max(0, I.mG || 0) /* flue gas kg/s */,
    /* the pass split: the same pressure drop over both passes, banks at last scan's gas temperatures (numbers on U.hxM) */
    tg = M.tg && M.tg.length === 12 ? M.tg : null,
    tgi = (i, d) => (tg && isFinite(tg[i]) ? tg[i] : d),
    zR = anHxZeta(I.dR),
    zS = anHxZeta(I.dS),
    dpR = m => {
      let p = 0;
      for (let i = 0; i < 4; i++) p += anHxDp(K.gR[i], m, tgi(i, I.Tg));
      const r = anHxRho(tgi(10, 376)),
        v = m / (r * K.aDR);
      return p + anHxDp(K.gE2r, m, tgi(4, 400)) + (zR * r * v * v) / 2;
    },
    dpS = m => {
      let p = 0;
      for (let i = 0; i < 3; i++) p += anHxDp(K.gF[i], m, tgi(5 + i, I.Tg));
      const r = anHxRho(tgi(11, 376)),
        v = m / (r * K.aDS);
      return p + anHxDp(K.gE3, m, tgi(8, 450)) + anHxDp(K.gE2s, m, tgi(9, 390)) + (zS * r * v * v) / 2;
    };
  let lo = 0,
    hi = mG;
  if (mG > 0.01)
    for (let i = 0; i < 24; i++) {
      const c = (lo + hi) / 2;
      if (dpR(c) > dpS(mG - c)) hi = c;
      else lo = c;
    }
  const mGR = (lo + hi) / 2,
    mGS = mG - mGR;
  /* ---- gas side ---- */
  const Rf = AN_FOUL_R;
  const gWl = anHxGas(M.wl, null, mG, I.Tg);
  const gR4 = [];
  let tR = gWl.Tg;
  for (let i = 3; i >= 0; i--) {
    gR4[i] = anHxGas(M.rh[i], K.gR[i], mGR, tR, Rf['r' + i]);
    tR = gR4[i].Tg;
  }
  const gE2r = anHxGas(M.e2r, K.gE2r, mGR, tR, Rf.e2r);
  const gF = [];
  let tS = gWl.Tg;
  for (let i = 2; i >= 0; i--) {
    gF[i] = anHxGas(M.fsh[i], K.gF[i], mGS, tS, Rf['f' + i]);
    tS = gF[i].Tg;
  }
  const gE3 = anHxGas(M.e3, K.gE3, mGS, tS, Rf.e3),
    gE2s = anHxGas(M.e2s, K.gE2s, mGS, gE3.Tg, Rf.e2s),
    tMix = mG > 0.01 ? (mGR * anHxCp(gE2r.Tg) * gE2r.Tg + mGS * anHxCp(gE2s.Tg) * gE2s.Tg) / (mGR * anHxCp(gE2r.Tg) + mGS * anHxCp(gE2s.Tg)) : I.Tg,
    /* 3.2.4 (JENNIE): an economizer tube leak (unit.js anTubeLeak, U.tlE) sprays the feedwater into the gas ahead of the No.1
       economizer: the water (liquid at the No.2 HP heater outlet temperature) flashes and is heated to steam at the gas temperature
       (IF97 steamH at the backpass, about 0 kg/cm2 G), and the gas gives that heat: mG cp dT = mL (h steam - h water). Energy balance,
       no fit. The bank where the tube breaks is not known (NO-SOURCE): the gas mixed ahead of the No.1 economizer is used */
    mL = Math.max(0, +I.mL || 0),
    tE1 = mL > 0 && mG > 0.01 ? Math.max(+I.Tfw > 0 ? +I.Tfw : 0, tMix - (mL * Math.max(0, steamH(0, tMix) - anHxHw(+I.Tfw || 0))) / (mG * anHxCp(tMix))) : tMix,
    /* 1.0.0-beta.14: the flashed leak water is gas from here on: the No.1 economizer carries the flue gas plus the leak */
    gE1 = anHxGas(M.e1, K.gE1, mG + mL, tE1, Rf.e1);
  /* each bank's mean gas temperature, for the next scan's pass split */
  {
    const mean = (a, b) => (a + b) / 2;
    let tIn = gWl.Tg;
    const t = [];
    for (let i = 3; i >= 0; i--) {
      t[i] = mean(tIn, gR4[i].Tg);
      tIn = gR4[i].Tg;
    }
    t[4] = mean(tIn, gE2r.Tg);
    tIn = gWl.Tg;
    for (let i = 2; i >= 0; i--) {
      t[5 + i] = mean(tIn, gF[i].Tg);
      tIn = gF[i].Tg;
    }
    t[8] = mean(tIn, gE3.Tg);
    t[9] = mean(gE3.Tg, gE2s.Tg);
    t[10] = gE2r.Tg;
    t[11] = gE2s.Tg;
    M.tg = t.map(x => (isFinite(x) ? x : I.Tg));
  }
  /* panels in the furnace: radiation / solids from the bed */
  /* beta.282 (JENNIE): the suspension coefficient grows with the square root of its density (Basu & Nag, unit.js AN_BB kKL) */
  /* beta.286: plus the gas radiation (unit.js AN_BB fgP, anBbPanF; beta.290: the gas of the lane between the panels) */
  const pf = Tm => (typeof anBbPanF === 'function' ? anBbPanF(I.Tb, Tm, I.phi || 0) : Math.sqrt(Math.max(0, I.phi || 0))),
    qP1 = K.uaP1 * pf(M.p1) * (I.Tb - M.p1),
    qP2 = K.uaP2 * pf(M.p2) * (I.Tb - M.p2);
  /* ---- steam side ---- */
  const Pd = Math.max(0, I.Pd),
    Pm = Math.max(0, isFinite(I.Pms) ? I.Pms : Pd),
    ts = steamTsat(Pd),
    hg = anHxHs(Pd, ts),
    w1 = Math.max(0, I.w1 || 0),
    w2 = Math.max(0, I.w2 || 0),
    mOut = Math.max(0, I.mOut || 0) /* steam leaving the boiler (FT-MS1031) */,
    mDr = Math.max(0, mOut - w1 - w2),
    hsp = anHxHw(isFinite(I.Tsp) ? I.Tsp : 170),
    hsr = anHxHw(isFinite(I.Tsr) ? I.Tsr : isFinite(I.Tsp) ? I.Tsp : 170) /* beta.374: RH spray, BFWP discharge (PD-017 FW-1-016) */;
  const sWl = anHxSide(M.wl, mDr, K.wl[1], Pd, hg, false),
    sP1 = anHxSide(M.p1, mDr, K.p1[1], Pd, sWl.h, false);
  const mix = (m, h, w) => (m + w > 0.5 && isFinite(h) ? (m * h + w * hsp) / (m + w) : h);
  const hD1 = mix(mDr, sP1.h, w1),
    m2 = mDr + w1,
    sP2 = anHxSide(M.p2, m2, K.p2[1], Pd, hD1, false),
    hD2 = mix(m2, sP2.h, w2),
    sF = [];
  let hF = hD2;
  for (let i = 0; i < 3; i++) {
    sF[i] = anHxSide(M.fsh[i], mOut, K.fsh[i][1], Pm + ((2 - i) * (Pd - Pm)) / 3, hF, false);
    if (isFinite(sF[i].h)) hF = sF[i].h;
  }
  /* reheater: cold reheat + RH spray at its inlet */
  const Prh = Math.max(0, I.Prh || 0),
    wrh = Math.max(0, I.wrh || 0),
    mcr = Math.max(0, I.mRh || 0),
    hcr = anHxHs(Prh, isFinite(I.Tcr) ? I.Tcr : steamTsat(Prh)),
    mR = mcr + wrh,
    sR = [];
  let hR = mR > 0.5 ? (mcr * hcr + wrh * hsr) / mR : hcr;
  for (let i = 0; i < 4; i++) {
    sR[i] = anHxSide(M.rh[i], mR, K.rh[i][1], Prh, hR, false);
    if (isFinite(sR[i].h)) hR = sR[i].h;
  }
  /* economizer water */
  const mW = Math.max(0, I.mEco || 0),
    hW0 = anHxHw(isFinite(I.Tfw) ? I.Tfw : I.Tamb),
    Pe = Pd + 10,
    sE1 = anHxSide(M.e1, mW, K.e1[1], Pe, hW0, true),
    h1 = isFinite(sE1.h) ? sE1.h : hW0,
    sE2r = anHxSide(M.e2r, mW / 2, K.e2r[1], Pe, h1, true),
    sE2s = anHxSide(M.e2s, mW / 2, K.e2s[1], Pe, h1, true),
    h2 = mW > 0.5 ? ((isFinite(sE2r.h) ? sE2r.h : h1) + (isFinite(sE2s.h) ? sE2s.h : h1)) / 2 : h1,
    sE3 = anHxSide(M.e3, mW, K.e3[1], Pe, h2, true),
    hEco = isFinite(sE3.h) ? sE3.h : anHxHw(M.e3);
  /* ---- metal ---- */
  const up = (T, qg, qs, Mk) => Math.max(I.Tamb, T + ((qg - qs) * dt) / Mk);
  M.wl = up(M.wl, gWl.q, sWl.q, K.wl[0]);
  M.p1 = up(M.p1, qP1, sP1.q, K.p1[0]);
  M.p2 = up(M.p2, qP2, sP2.q, K.p2[0]);
  for (let i = 0; i < 3; i++) M.fsh[i] = up(M.fsh[i], gF[i].q, sF[i].q, K.fsh[i][0]);
  for (let i = 0; i < 4; i++) M.rh[i] = up(M.rh[i], gR4[i].q, sR[i].q, K.rh[i][0]);
  M.e1 = up(M.e1, gE1.q, sE1.q, K.e1[0]);
  M.e2r = up(M.e2r, gE2r.q, sE2r.q, K.e2r[0]);
  M.e2s = up(M.e2s, gE2s.q, sE2s.q, K.e2s[0]);
  M.e3 = up(M.e3, gE3.q, sE3.q, K.e3[0]);
  /* ---- outputs (numbers) ---- */
  const T = h => (isFinite(h) ? h : NaN);
  return {
    qP: qP1 + qP2 /* kW out of the bed */,
    d1: mDr + w1 > 0.5 ? anHxTs(Pd, hD1) : sP1.T /* spray 1 outlet, TICBR1130 */,
    s2: sP2.T /* SH no.2 outlet, TT-BR1140 */,
    d2: m2 + w2 > 0.5 ? anHxTs(Pd, hD2) : sP2.T /* spray 2 outlet, TICBR1150 */,
    ms: sF[2].T /* finishing SH outlet, TT-MS1004 */,
    rh: sR[3].T /* reheater outlet */,
    wl: sWl.T,
    hEco: T(hEco),
    tEco: mW > 0.5 ? anHxTw(hEco) : M.e3 /* water into the drum */,
    p1o: sP1.T /* S/H No.1 (panel 1) outlet header, TT-BR1120-1 / -2 (audit 2026-11-21 B1) */,
    e1o: sE1.T /* water leaving the No.1 economizer, TT-BR1020 (audit 2026-11-21 B1) */,
    e2o: mW > 0.5 && isFinite(sE2r.T) && isFinite(sE2s.T) ? (sE2r.T + sE2s.T) / 2 : (M.e2r + M.e2s) / 2 /* No.2 R + S, TT-BR1030 */,
    gWl: gWl.Tg,
    gRo: gE2r.Tg /* gas leaving the No.2 eco R side (TT-FG1110) */,
    gSo: gE2s.Tg /* S side (TT-FG1113) */,
    gEo: gE1.Tg /* gas to the air heater */,
    /* beta.490 (lane 3 KIRARA, P&ID PD-051 TT-FG1100 ~ 1111 at the bank boundaries): the gas leaving each backpass bank, an export of
       the same chain (no change to the run). Gas path: furnace -> wall (cyclone outlet / roof) -> R pass: RH bank 3, 2, 1, 0 -> No.2 eco
       R; S pass: finishing SH bank 2, 1, 0 -> No.3 eco -> No.2 eco S; the two passes mix (mix; e1In = after an economizer tube leak, if
       any) -> No.1 eco (e1) -> air heater. On U as U.hxO.gBank. The gas
       into a bank is the gas leaving the bank before it (into RH 3 and FSH 2: wl). */
    gBank: {
      wl: gWl.Tg,
      rh: gR4.map(g => g.Tg),
      e2r: gE2r.Tg,
      fsh: gF.map(g => g.Tg),
      e3: gE3.Tg,
      /* TT-FG1109, No.3 eco lower inlet (between its upper and lower half): the gas of the same bank solution at half the surface. One
         metal temperature M.e3 per bank, so the gas falls as (Tg - Tm) = (Tin - Tm) e^-n and the half point is the geometric mean of the
         two ends above the metal. Two halves of equal surface (the split is not in the documents found so far) */
      e3m: (tS - M.e3) * (gE3.Tg - M.e3) > 0 ? M.e3 + Math.sign(tS - M.e3) * Math.sqrt((tS - M.e3) * (gE3.Tg - M.e3)) : (tS + gE3.Tg) / 2,
      e2s: gE2s.Tg,
      mix: tMix,
      e1In: tE1,
      e1: gE1.Tg
    },
    gRh: tR,
    gFs: tS,
    mGR,
    mGS
  };
}
