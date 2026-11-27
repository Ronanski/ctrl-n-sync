/* Phase 11 (plant model, MODEL TURBINE REHEAT : RIN, 2026-11-27). THE STEAM TURBINE AND THE REHEATER STEAM SIDE, first principles only
   (RULES.md 3.12, rule 0: no per-load table, no interpolation between heat balance cases, no constant taken from plant data, NO-FIT-OK: rule text).
   Part A (this block): the steam properties the expansion needs, IAPWS-IF97 (the industrial standard steam table, the release
   "Revised Release on the IAPWS Industrial Formulation 1997", IAPWS 2007): region 1 (compressed / saturated water, Table 2, the 34
   coefficients) and the entropy of region 2 (the same Gibbs equation as steam.js steamH2, Tables 10 / 11). Units here: p MPa absolute,
   T K, h kJ/kg, s kJ/kg K. Checked by tests/lanes/model/turbine-steam.cjs against the IF97 verification tables 5 and 15.
   DESIGN-SRC: IAPWS-IF97 */
const TB_R = 0.461526; /* kJ/kg K, specific gas constant of water, IF97 eq. 1 */
const TB_R1 = [
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
function tbR1(p, T) {
  const pi = p / 16.53,
    tau = 1386 / T,
    a = 7.1 - pi,
    b = tau - 1.222;
  let g = 0,
    gt = 0;
  for (const [I, J, n] of TB_R1) {
    const x = n * Math.pow(a, I);
    g += x * Math.pow(b, J);
    gt += x * J * Math.pow(b, J - 1);
  }
  return { h: TB_R * T * tau * gt, s: TB_R * (tau * gt - g) };
}
/* region 2: h and s of steam, p MPa, T K (IF97 Table 12; coefficients STEAM_R2_0 / STEAM_R2_R of steam.js) */
function tbR2(p, T) {
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
  return { h: TB_R * T * tau * (g0t + grt), s: TB_R * (tau * (g0t + grt) - (g0 + gr)) };
}
/* saturation temperature K of p MPa (IF97 region 4, through steam.js steamTsat in kg/cm2 G) */
const tbTsat = p => steamTsat(p / 0.0980665 - 1.0332) + 273.15;
/* saturated liquid / vapour at p MPa */
function tbSat(p) {
  const T = tbTsat(p),
    f = tbR1(p, T),
    g = tbR2(p, T);
  return { T, hf: f.h, sf: f.s, hg: g.h, sg: g.s };
}
/* steam state at p MPa and h kJ/kg: superheated (T by bisection in region 2) or wet (quality x); returns { T, s, x } */
function tbPh(p, h) {
  const S = tbSat(p);
  if (h <= S.hg) {
    const x = Math.max(0, (h - S.hf) / (S.hg - S.hf));
    return { T: S.T, s: S.sf + x * (S.sg - S.sf), x };
  }
  let a = S.T,
    b = 1073.15;
  for (let i = 0; i < 50; i++) {
    const m = (a + b) / 2;
    if (tbR2(p, m).h < h) a = m;
    else b = m;
  }
  const T = (a + b) / 2;
  return { T, s: tbR2(p, T).s, x: 1 };
}
/* the isentropic end enthalpy at p MPa of entropy s */
function tbHs(p, s) {
  const S = tbSat(p);
  if (s <= S.sg) {
    const x = Math.max(0, (s - S.sf) / (S.sg - S.sf));
    return S.hf + x * (S.hg - S.hf);
  }
  let a = S.T,
    b = 1073.15;
  for (let i = 0; i < 50; i++) {
    const m = (a + b) / 2;
    if (tbR2(p, m).s < s) a = m;
    else b = m;
  }
  return tbR2(p, (a + b) / 2).h;
}
/* specific volume m3/kg of superheated or wet steam at p MPa, h kJ/kg (region 2 at the state temperature; wet: x vg, the liquid share
   is below 0.1 % of the volume at turbine pressures) */
function tbV(p, h) {
  const st = tbPh(p, h);
  return (st.x < 1 ? st.x : 1) * steamV2(p, st.T);
}
