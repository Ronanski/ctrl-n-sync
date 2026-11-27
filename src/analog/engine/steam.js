/* 3.2.0-beta.15 (plan "per-loop at unit plant model", phase B): STEAM TABLE. The unit model had a fit of the saturation temperature,
   Tsat = 100 + 47.1 x ln(P + 1) (P in kg/cm2 G), right at 0 and at 130 kg/cm2 but about 30 C too high between 5 and 40 kg/cm2
   (fit 213 C at 10 kg/cm2, steam table 183 C; fit 262 C at 30, steam table 235 C): the water heat-up and the pressure raise of a
   cold start-up, and the floor of the steam temperatures, were off there. Here the saturation line of IAPWS-IF97 (region 4, the
   backward equation Ts(p)), the industrial standard steam table, with P in kg/cm2 G (1 kg/cm2 = 0.0980665 MPa, atmosphere 1.0332
   kg/cm2). Checked: 100.0 C at 0, 183.3 C at 10, 275.4 C at 60, 330.0 C at 130 kg/cm2 G. */
const STEAM_N = [
  0.11670521452767e4, -0.72421316703206e6, -0.17073846940092e2, 0.12020824702470e5, -0.32325550322333e7, 0.14915108613530e2,
  -0.48232657361591e4, 0.40511340542057e6, -0.23855557567849, 0.65017534844798e3
];
/* saturation temperature (C) of a pressure in kg/cm2 G */
function steamTsat(P) {
  const n = STEAM_N,
    p = Math.min(22.064, Math.max(0.0006117, ((Math.max(-1, +P || 0) + 1.0332) * 0.0980665))),
    b = Math.pow(p, 0.25),
    E = b * b + n[2] * b + n[5],
    F = n[0] * b * b + n[3] * b + n[6],
    G = n[1] * b * b + n[4] * b + n[7],
    D = (2 * G) / (-F - Math.sqrt(F * F - 4 * E * G)),
    x = n[9] + D;
  return (x - Math.sqrt(x * x - 4 * (n[8] + n[9] * D))) / 2 - 273.15;
}
/* 3.2.3 (F29, drum drains): the saturation pressure (kg/cm2 G) of a temperature in C, IF97 region 4, the basic equation ps(T) (same
   coefficients). Checked: 0.0 at 100 C, 10.0 at 183.3 C, 60.0 at 275.4 C kg/cm2 G */
function steamPsat(Tc) {
  const n = STEAM_N,
    T = Math.min(647.096, Math.max(273.16, (+Tc || 0) + 273.15)),
    th = T + n[8] / (T - n[9]),
    A = th * th + n[0] * th + n[1],
    B = n[2] * th * th + n[3] * th + n[4],
    C = n[5] * th * th + n[6] * th + n[7],
    p = Math.pow((2 * C) / (-B + Math.sqrt(B * B - 4 * A * C)), 4); /* MPa */
  return p / 0.0980665 - 1.0332;
}
/* slope of the saturation line, C per kg/cm2 */
function steamDTsat(P) {
  const p = Math.max(0, +P || 0);
  return (steamTsat(p + 0.05) - steamTsat(p)) / 0.05;
}
/* 3.2.3 (SOHEE, sootblower drain temperatures TT-SB1056 / 1057): the superheated steam of IAPWS-IF97 region 2 (the basic equation, the
   dimensionless Gibbs free energy: ideal-gas part n0 / J0 and residual part I / J / n, Tables 10 and 11 of the IF97 release). Used for
   the enthalpy of superheated steam h(P, T) and its inverse T(P, h) (bisection): the throttling of the S/H panel #1 outlet steam to the
   sootblower header is at constant enthalpy. Checked with the IF97 verification values (Table 15): 300 K / 0.0035 MPa 2549.91 kJ/kg,
   700 K / 0.0035 MPa 3335.68, 700 K / 30 MPa 2631.49. P in kg/cm2 G, T in C, h in kJ/kg. Liquid (below saturation) is not covered: the
   callers keep the steam at or above saturation */
const STEAM_R2_0 = [
  [0, -0.96927686500217e1], [1, 0.10086655968018e2], [-5, -0.5608791128302e-2], [-4, 0.71452738081455e-1], [-3, -0.40710498223928],
  [-2, 0.14240819171444e1], [-1, -0.4383951131945e1], [2, -0.28408632460772], [3, 0.21268463753307e-1]
];
const STEAM_R2_R = [
  [1, 0, -0.17731742473213e-2], [1, 1, -0.17834862292358e-1], [1, 2, -0.45996013696365e-1], [1, 3, -0.57581259083432e-1],
  [1, 6, -0.5032527872793e-1], [2, 1, -0.33032641670203e-4], [2, 2, -0.18948987516315e-3], [2, 4, -0.39392777243355e-2],
  [2, 7, -0.43797295650573e-1], [2, 36, -0.26674547914087e-4], [3, 0, 0.20481737692309e-7], [3, 1, 0.43870667284435e-6],
  [3, 3, -0.3227767723857e-4], [3, 6, -0.15033924542148e-2], [3, 35, -0.40668253562649e-1], [4, 1, -0.78847309559367e-9],
  [4, 2, 0.12790717852285e-7], [4, 3, 0.48225372718507e-6], [5, 7, 0.22922076337661e-5], [6, 3, -0.16714766451061e-10],
  [6, 16, -0.21171472321355e-2], [6, 35, -0.23895741934104e2], [7, 0, -0.5905956432427e-17], [7, 11, -0.12621808899101e-5],
  [7, 25, -0.38946842435739e-1], [8, 8, 0.11256211360459e-10], [8, 36, -0.82311340897998e1], [9, 13, 0.19809712802088e-7],
  [10, 4, 0.10406965210174e-18], [10, 10, -0.10234747095929e-12], [10, 14, -0.10018179379511e-8], [16, 29, -0.80882908646985e-10],
  [16, 50, 0.10693031879409], [18, 57, -0.33662250574171], [20, 20, 0.89185845355421e-24], [20, 35, 0.30629316876232e-12],
  [20, 48, -0.42002467698208e-5], [21, 21, -0.59056029685639e-25], [22, 53, 0.37826947613457e-5], [23, 39, -0.12768608934681e-14],
  [24, 26, 0.73087610595061e-28], [24, 40, 0.55414715350778e-16], [24, 58, -0.9436970724121e-6]
];
/* region 2 enthalpy, kJ/kg, of p in MPa (absolute) and T in K */
function steamH2(p, T) {
  const t = 540 / T;
  let g0 = 0,
    gr = 0;
  for (const [J, n] of STEAM_R2_0) g0 += n * J * Math.pow(t, J - 1);
  for (const [I, J, n] of STEAM_R2_R) gr += n * Math.pow(p, I) * J * Math.pow(t - 0.5, J - 1);
  return 0.461526 * T * t * (g0 + gr);
}
/* superheated steam enthalpy (kJ/kg) of a pressure in kg/cm2 G and a temperature in C (at least saturation) */
function steamH(P, T) {
  const Ps = Math.max(-1, +P || 0);
  return steamH2((Ps + 1.0332) * 0.0980665, Math.max(steamTsat(Ps), +T || 0) + 273.15);
}
/* the temperature (C) of steam of enthalpy h (kJ/kg) at a pressure in kg/cm2 G; wet steam (h at or below saturated vapour) = saturation */
function steamTph(P, h) {
  const Ts = steamTsat(P);
  if (!(h > steamH(P, Ts))) return Ts;
  let a = Ts,
    b = 800;
  for (let i = 0; i < 40; i++) {
    const m = (a + b) / 2;
    if (steamH(P, m) < h) a = m;
    else b = m;
  }
  return (a + b) / 2;
}
/* 3.2.3 (live Cold start, user 2026-11-14 "Code ang gawin. Hnd temporary fix!"): the density of superheated steam, IAPWS-IF97 region 2
   (the same Gibbs equation as steamH2): v = R T / p x pi x (1 / pi + d(gamma_r) / d(pi)), Table 12 of the IF97 release. Checked with the
   IF97 verification values (Table 15): 300 K / 0.0035 MPa 39.4913866 m3/kg, 700 K / 0.0035 MPa 92.3015898, 700 K / 30 MPa 0.00542946619.
   P in kg/cm2 G, T in C (at least saturation), result kg/m3 */
function steamV2(p, T) {
  const t = 540 / T;
  let gp = 0;
  for (const [I, J, n] of STEAM_R2_R) gp += n * I * Math.pow(p, I - 1) * Math.pow(t - 0.5, J);
  return ((0.461526 * T) / p) * (1 + p * gp) / 1000;
}
function steamRho(P, T) {
  const Ps = Math.max(-1, +P || 0);
  return 1 / steamV2((Ps + 1.0332) * 0.0980665, Math.max(steamTsat(Ps), +T || 0) + 273.15);
}
/* Phase 11 (plant model, MODEL TURBINE REHEAT : RIN, 2026-11-27): the rest of IAPWS-IF97 that the turbine expansion of unit.js needs
   (the Stodola stage pressures and the section efficiencies replace the per-load tables AN_TBW / AN_HB there): region 1 (water h, s,
   Table 2, the 34 coefficients, Table 3) and the entropy of region 2 (the same Gibbs equation as steamH2 above, Table 12). Units in
   these functions: p MPa absolute, T K, h kJ/kg, s kJ/kg K. Checked by tests/lanes/model/turbine-steam.cjs against the IF97
   verification tables 5 and 15. DESIGN-SRC: IAPWS-IF97 */
const STEAM_RW = 0.461526; /* kJ/kg K, specific gas constant of water, IF97 eq. 1 */
const STEAM_R1 = [
  [0, -2, 0.14632971213167], [0, -1, -0.84548187169114], [0, 0, -0.3756360367204e1], [0, 1, 0.33855169168385e1],
  [0, 2, -0.95791963387872], [0, 3, 0.15772038513228], [0, 4, -0.16616417199501e-1], [0, 5, 0.81214629983568e-3],
  [1, -9, 0.28319080123804e-3], [1, -7, -0.60706301565874e-3], [1, -1, -0.18990068218419e-1], [1, 0, -0.32529748770505e-1],
  [1, 1, -0.21841717175414e-1], [1, 3, -0.5283835796993e-4], [2, -3, -0.47184321073267e-3], [2, 0, -0.30001780793026e-3],
  [2, 1, 0.47661393906987e-4], [2, 3, -0.44141845330846e-5], [2, 17, -0.72694996297594e-15], [3, -4, -0.31679644845054e-4],
  [3, 0, -0.28270797985312e-5], [3, 6, -0.85205128120103e-9], [4, -5, -0.22425281908e-5], [4, -2, -0.65171222895601e-6],
  [4, 10, -0.14341729937924e-12], [5, -8, -0.40516996860117e-6], [8, -11, -0.12734301741641e-8], [8, -6, -0.17424871230634e-9],
  [21, -29, -0.68762131295531e-18], [23, -31, 0.14478307828521e-19], [29, -38, 0.26335781662795e-22],
  [30, -39, -0.11947622640071e-22], [31, -40, 0.18228094581404e-23], [32, -41, -0.93537087292458e-25]
];
/* region 1: h and s of water, p MPa, T K (IF97 Table 3) */
function steamR1(p, T) {
  const pi = p / 16.53,
    tau = 1386 / T,
    a = 7.1 - pi,
    b = tau - 1.222;
  let g = 0,
    gt = 0;
  for (const [I, J, n] of STEAM_R1) {
    const x = n * Math.pow(a, I);
    g += x * Math.pow(b, J);
    gt += x * J * Math.pow(b, J - 1);
  }
  return { h: STEAM_RW * T * tau * gt, s: STEAM_RW * (tau * gt - g) };
}
/* region 2: h and s of steam, p MPa, T K (IF97 Table 12; coefficients STEAM_R2_0 / STEAM_R2_R of steam.js) */
function steamR2(p, T) {
  const tau = 540 / T;
  let g0 = Math.log(p),
    g0t = 0,
    gr = 0,
    grt = 0;
  for (const [J, n] of STEAM_R2_0) {
    g0 += n * Math.pow(tau, J);
    g0t += n * J * Math.pow(tau, J - 1);
  }
  for (const [I, J, n] of STEAM_R2_R) {
    const x = n * Math.pow(p, I);
    gr += x * Math.pow(tau - 0.5, J);
    grt += x * J * Math.pow(tau - 0.5, J - 1);
  }
  return { h: STEAM_RW * T * tau * (g0t + grt), s: STEAM_RW * (tau * (g0t + grt) - (g0 + gr)) };
}
/* saturation temperature K of p MPa (IF97 region 4, through steam.js steamTsat in kg/cm2 G) */
const steamTsatK = p => steamTsat(p / 0.0980665 - 1.0332) + 273.15;
/* saturated liquid / vapour at p MPa */
function steamSatM(p) {
  const T = steamTsatK(p),
    f = steamR1(p, T),
    g = steamR2(p, T);
  return { T, hf: f.h, sf: f.s, hg: g.h, sg: g.s };
}
/* steam state at p MPa and h kJ/kg: superheated (T by bisection in region 2) or wet (quality x); returns { T, s, x } */
function steamPhM(p, h) {
  const S = steamSatM(p);
  if (h <= S.hg) {
    const x = Math.max(0, (h - S.hf) / (S.hg - S.hf));
    return { T: S.T, s: S.sf + x * (S.sg - S.sf), x };
  }
  let a = S.T,
    b = 1073.15;
  for (let i = 0; i < 50; i++) {
    const m = (a + b) / 2;
    if (steamR2(p, m).h < h) a = m;
    else b = m;
  }
  const T = (a + b) / 2;
  return { T, s: steamR2(p, T).s, x: 1 };
}
/* the isentropic end enthalpy at p MPa of entropy s */
function steamHsM(p, s) {
  const S = steamSatM(p);
  if (s <= S.sg) {
    const x = Math.max(0, (s - S.sf) / (S.sg - S.sf));
    return S.hf + x * (S.hg - S.hf);
  }
  let a = S.T,
    b = 1073.15;
  for (let i = 0; i < 50; i++) {
    const m = (a + b) / 2;
    if (steamR2(p, m).s < s) a = m;
    else b = m;
  }
  return steamR2(p, (a + b) / 2).h;
}
/* specific volume m3/kg of superheated or wet steam at p MPa, h kJ/kg (region 2 at the state temperature; wet: x vg, the liquid share
   is below 0.1 % of the volume at turbine pressures) */
function steamVhM(p, h) {
  const st = steamPhM(p, h);
  return (st.x < 1 ? st.x : 1) * steamV2(p, st.T);
}
