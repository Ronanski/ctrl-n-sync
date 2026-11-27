/* TCS soft logic block meanings (Full Audit 3 #4, step 2, docs/tcs/SHEETS_AS_LOGIC_PLAN.md).
   Source of every meaning: the HIACS macro list of the TCA soft logic set, sheets TCA013 ~ TCA020 "MACRO LIST (1) ~ (8)"
   (Hitachi 331DM09788, 2014-04-18; TCA PDF pages 8 ~ 15, PC only), item numbers 1 ~ 73 given as "ML n" at each block.
   Parameters are the ones printed under each block on the sheet (notes "K:3600.0rpm", "TP:10.0S", "HL:123degc" ...).
   The step time dt is plant seconds (the sheet cycle). Each block keeps its own memory in st (one object per block).
   Read only of the plant: nothing here touches the plant model; step 4 (shadow run) wires it beside tcs.js. */
(function (root) {
  'use strict';
  /* a printed parameter: "TP:10.0S" -> 10, "R :0.5degC/s" -> 0.5, "K:-5.0%" -> -5 (the unit stays on the drawing) */
  function par(notes, key, dflt) {
    for (const n of notes || []) {
      const m = /^\s*([A-Z][A-Z0-9]*)\s*:\s*([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)/.exec(n);
      if (m && m[1] === key) return +m[2];
    }
    return dflt;
  }
  const b01 = v => (v ? 1 : 0);
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  /* each kind: f(inputs [ordered as on the drawing: left edge top first, then the side inputs], notes, st, dt) -> outputs [Y, Y1, Y2 ...].
     sw = the SW side input where the block has one. A block drawn without a SW wire runs as SW=1, but the macro list (TCA013 ~ TCA020)
     does not say what HIACS does with an unwired SW: such a block is an OPEN item (need()) until TC-14-116 says it. */
  const K = {
    /* ML 1 ADD Y = X1 + X2 + .. + Xn */
    ADD: x => [x.reduce((a, v) => a + v, 0)],
    /* ML 2 SUB Y = X1 - X2 - .. - Xn */
    SUB: x => [x.slice(1).reduce((a, v) => a - v, x[0] || 0)],
    /* ML 3 MLT Y = X1 * X2 */
    MLT: x => [(x[0] || 0) * (x[1] || 0)],
    /* ML 4 DIV Y = X1 / X2. The macro list (TCA013 p 8) gives no rule for a zero divisor: the app holds the last value (OPEN item,
       listed in OPEN_RULES until TC-14-116 says what HIACS does) */
    DIV: (x, n, st) => [(st.y = x[1] ? x[0] / x[1] : st.y || 0)],
    /* ML 7 ML multiplier with compensate (TCA013 MACRO LIST(1), lane 0 read phase5-ml-dv-blocks-2026-11-26.md): Y = (X1 - X0) (C + G X2) + Y0,
       record values X0 C G Y0; no limits. ML 8 DV divider with compensate: Y = G (X1 - X0) / (X2 + XC) + Y0, values X0 XC G Y0; a zero
       divisor holds the last value, as DIV (ML 4) */
    ML: (x, n) => [((x[0] || 0) - par(n, 'X0')) * (par(n, 'C') + par(n, 'G') * (x[1] || 0)) + par(n, 'Y0')],
    DV: (x, n, st) => {
      const d = (x[1] || 0) + par(n, 'XC');
      return [(st.y = d ? (par(n, 'G') * ((x[0] || 0) - par(n, 'X0'))) / d + par(n, 'Y0') : st.y || 0)];
    },
    /* ML 9 I integral: SW=1 Y = (1/TI) * integral X dt + F; SW=0 Y = Z; LL <= Y <= HL */
    I: (x, n, st, dt, sw = 1) => {
      const [X = 0, F = 0, Z = 0] = x,
        TI = par(n, 'TI'),
        HL = par(n, 'HL', Infinity),
        LL = par(n, 'LL', -Infinity);
      if (!sw) st.i = Z - F;
      else st.i = (st.i ?? Z - F) + (X * dt) / TI;
      const y = clamp(st.i + F, LL, HL);
      st.i = y - F; /* the limit stops the integral (no wind-up) */
      return [y];
    },
    /* ML 11 LG first order lag: SW=1 Y = X / (1 + T s); SW=0 Y = X */
    LG: (x, n, st, dt, sw = 1) => {
      const T = par(n, 'T');
      st.y = !sw || st.y === undefined || !T ? x[0] : st.y + ((x[0] - st.y) * dt) / Math.max(T, dt);
      return [st.y];
    },
    /* ML 12 PIF PI with feedforward: SW=1 Y = G X + (1/TI) integral X dt + F; SW=0 (tie-back) Y = Z; LL <= Y <= HL */
    PIF: (x, n, st, dt, sw = 1) => {
      const [X = 0, F = 0, Z = 0] = x,
        G = par(n, 'G'),
        TI = par(n, 'TI'),
        HL = par(n, 'HL', Infinity),
        LL = par(n, 'LL', -Infinity);
      if (!sw) st.i = Z - G * X - F;
      else st.i = (st.i ?? Z - G * X - F) + (X * dt) / TI;
      const y = clamp(G * X + st.i + F, LL, HL);
      st.i = y - G * X - F;
      return [y];
    },
    /* ML 13 PIV velocity PI (TCA014 p 9, "PI CONTROLLER (VELOCITY TYPE)", pins SW, X, F, Z -> Y): SW=1 Y = G1 (X(j) - X(j-1)) +
       G2 (TS/TI) X(j) + F; SW=0 Y = 0. Y is the increment itself (the macro list adds no Y(j-1)).
       HL / LL (printed under every PIV, not in the ML 13 text): HL = upper limit, LL = lower limit, as the macro list words them for
       PIF No. 12, INTEGRAL No. 9, ANALOG MEMORY No. 21 ("with limitter LL<=Y<=HL") and LMS No. 41, and TCA022 (7) "Set Values ... the
       upper limit, the lower limit". DERIVED from the sheets (not printed in a definition): the limit is on the position Z + Y, not on
       the increment: Z = GOV.SET (I 005 of TCE196, which adds Y each cycle), so Y = clamp(Z + Y, LL, HL) - Z. Reason: TCE191 C022 / C027
       print LL 0.00 % (a limit on Y would never let the load go down) and TCE195 prints -5.0 .. 110.0 against GOV.SET -67.7 .. 107.0;
       the reading fits all PIVs (TCE168, TCE169, TCE191, TCE195). ML: printed equal to HL on every PIV, on no page of the macro list or
       TC-14-116: its meaning is OPEN, not read (it does not block the sheet). Source lookup: EIMI on the PC, 2026-11-25. */
    PIV: (x, n, st, dt, sw = 1) => {
      const [X = 0, F = 0, Z = 0] = x,
        G1 = par(n, 'G1'),
        G2 = par(n, 'G2'),
        TI = par(n, 'TI'),
        HL = par(n, 'HL'),
        LL = par(n, 'LL');
      if (!sw) {
        st.x = X;
        return [0];
      }
      let y = G1 * (X - (st.x ?? X)) + (G2 * dt * X) / TI + F;
      st.x = X;
      if (HL !== undefined && LL !== undefined) y = clamp(Z + y, LL, HL) - Z;
      return [y];
    },
    /* ML 15 HS Y = max(X1..X3), Yi = 1 at the maximum; ML 16 LS the minimum */
    HS: x => {
      const y = Math.max(...x);
      return [y, ...x.map(v => b01(v === y))];
    },
    LS: x => {
      const y = Math.min(...x);
      return [y, ...x.map(v => b01(v === y))];
    },
    /* ML 17 SG / ML 18 SGW Y = K */
    SG: (x, n) => [par(n, 'K')],
    SGW: (x, n) => [par(n, 'K')],
    /* ML 21 AM analog memory: SW=0 Y = Z (tracking); SW=1 Y up / down by the binary I / D at the rate R, LL <= Y <= HL */
    AM: (x, n, st, dt, sw = 1) => {
      const [I = 0, D = 0, Z = 0] = x,
        R = par(n, 'R'),
        HL = par(n, 'HL', Infinity),
        LL = par(n, 'LL', -Infinity);
      if (!sw || st.y === undefined) st.y = Z;
      else st.y += (b01(I) - b01(D)) * R * dt;
      st.y = clamp(st.y, LL, HL);
      return [st.y];
    },
    /* ML 22 RL rate limiter: SW=0 Y = X; SW=1 Y follows X at RI up / RD down (the rates printed under the block) */
    RL: (x, n, st, dt, sw = 1) => {
      const RI = par(n, 'RI', Infinity),
        RD = par(n, 'RD', Infinity);
      if (!sw || st.y === undefined) st.y = x[0];
      else st.y = clamp(x[0], st.y - RD * dt, st.y + RI * dt);
      return [st.y];
    },
    /* ML 24 LIM: X > HL Y = HL, Y1 = 1; LL <= X <= HL Y = X; X < LL Y = LL, Y2 = 1 */
    LIM: (x, n) => {
      const HL = par(n, 'HL', Infinity),
        LL = par(n, 'LL', -Infinity);
      return [clamp(x[0], LL, HL), b01(x[0] > HL), b01(x[0] < LL)];
    },
    /* ML 25 ASW / ML 53 DSW: SW=1 Y = X1, SW=0 Y = X2 */
    ASW: (x, n, st, dt, sw = 1) => [sw ? x[0] : x[1]],
    DSW: (x, n, st, dt, sw = 1) => [sw ? x[0] : x[1]],
    /* ML 26 ASWW word-type analog switch (lane 0 read of TCA015, tcs-phase5-blocks-2026-11-26.md 1): SW = 1 Y = X1, SW = 0 Y = X2 */
    ASWW: (x, n, st, dt, sw = 1) => [sw ? x[0] : x[1]],
    /* ML 71 MJL 2 out of 3 select (TCA019, tcs-phase5-blocks-2026-11-26.md 2): X1 X2 X3, error flags E1 E2 E3 (1 = abnormal), SW; values
       S (mode) and M (largest allowed difference). The good inputs sorted A > B (> C): S 0 = A, S 1 = the lowest, S 2 with SW 1 = the one
       closest to the last output, else the average; with a difference above M the output does not change (the list writes it for 3
       inputs; for 2 the same rule, lane 0 "likely"); 1 good input = that one; none = the output holds. Outputs Y, Z1, Z2, Z3.
       DERIVED (the list draws Z but does not define it): Zi = 1 when the block does not use input i (abnormal, or left out by the M rule),
       which is how DUAL INPUT DIAGNOSTICS uses it (Zi OR Di = quality bad of input i) */
    MJL: (x, n, st, dt, sw = 0) => {
      const S = par(n, 'S', 0),
        M = par(n, 'M', Infinity),
        g = [0, 1, 2].filter(i => !x[3 + i] && isFinite(x[i])),
        last = st.y;
      let y = last,
        used = g;
      const vs = g.map(i => x[i]).sort((a, b) => b - a);
      if (g.length === 1) y = vs[0];
      else if (g.length > 1) {
        const ok = vs.every((v, i) => !i || Math.abs(vs[i - 1] - v) <= M);
        if (!ok) used = [];
        else if (S === 0) y = vs[0];
        else if (S === 1) y = vs[vs.length - 1];
        else if (S === 2 && sw && isFinite(last)) y = vs.reduce((a, v) => (Math.abs(v - last) < Math.abs(a - last) ? v : a), vs[0]);
        else y = vs.reduce((a, v) => a + v, 0) / vs.length;
      }
      st.y = y;
      return [y === undefined ? NaN : y, b01(!used.includes(0)), b01(!used.includes(1)), b01(!used.includes(2))];
    },
    /* ML 27 G Y = K X (TCA015 MACRO LIST(3) No. 27 GAIN: "Input signal is multiplied by gain. Y=K*X. K:Gain").
       KA: TCE190 G C014 prints only "KA:1.0" (EIMI read the PC drawing 2026-11-25, 331DM09784 p 132 = PDF p 134, 2x crop: no other K
       anywhere, not a misread); the macro list has no KA. DERIVED: GAIN has one parameter and the block prints one value, so KA is its
       gain (at 1.0, Y = X). Taken only where no K is printed. */
    G: (x, n) => [par(n, 'K', par(n, 'KA')) * x[0]],
    /* ML 28 MR monitor relay: Y = 1 when X1 - X2 > HL or < LL */
    MR: (x, n) => {
      const d = x[0] - (x[1] || 0);
      return [b01(d > par(n, 'HL', Infinity) || d < par(n, 'LL', -Infinity))];
    },
    /* SC sign change Y = -X: not in the macro list TCA013 ~ TCA021 (73 kinds); DERIVED from the backup wiring (lane 0 slice D): TCE060
       LME111 gives HL = DEV and LL = SC(DEV) to three limit blocks; CRT OPE INC/DEC passes +step on INC and SC(step) on DEC */
    SC: x => [0 - (x[0] || 0)],
    /* ML 30 ABS Y = |X| */
    ABS: x => [Math.abs(x[0])],
    /* ML 32 BP1 bumpless transfer: SW=1 Y -> X1, SW=0 Y -> X2, a step at the switch is taken out at the rate R */
    BP1: (x, n, st, dt, sw = 1) => {
      const t = sw ? x[0] : x[1],
        R = par(n, 'R', Infinity);
      st.y = st.y === undefined ? t : clamp(t, st.y - R * dt, st.y + R * dt);
      return [st.y];
    },
    /* ML 33 FLT mean of the last N samples (2 <= N <= 10); SW=0 Y = X */
    FLT: (x, n, st, dt, sw = 1) => {
      const N = par(n, 'N');
      st.h = sw ? (st.h || []).concat(x[0]).slice(-N) : [x[0]];
      return [st.h.reduce((a, v) => a + v, 0) / st.h.length];
    },
    /* ML 35 GRD gradient: Y = (2 X(j) + X(j-1) - X(j-3) - 2 X(j-4)) K / (10 TS); SW=0 Y = 0 */
    GRD: (x, n, st, dt, sw = 1) => {
      st.h = (st.h || []).concat(x[0]).slice(-5);
      if (!sw || st.h.length < 5) return [0];
      const h = st.h;
      return [((2 * h[4] + h[3] - h[1] - 2 * h[0]) * par(n, 'K')) / (10 * dt)];
    },
    /* ML 37 PD pure delay: SW=1 the input of N K cycles before; SW=0 Y = X */
    PD: (x, n, st, dt, sw = 1) => {
      const L = Math.max(1, par(n, 'N') * par(n, 'K'));
      st.h = sw ? (st.h || []).concat(x[0]).slice(-(L + 1)) : [x[0]];
      return [st.h[0]];
    },
    /* ML 39 LIN Y = K X + B */
    LIN: (x, n) => [par(n, 'K') * x[0] + par(n, 'B')],
    /* TINV inverse time pick-up of a protection relay element (the generator 24 V/Hz 2nd step of the Beckwith M-3425A, G-5A / G-6A
       d24b; lane 0 read phase5-24-vhz-curve1-2026-11-26.md): x = [pick-up contact, M (V/Hz %)]. Curve #1: t = 1800 TD / (M - 100)^2 s
       (= 0.18 TD / (M/100 - 1)^2), operating at M >= PU. The FORM is fitted to the vendor's own expected values (LM-GEE-2015-0059 p.22
       rows 9 - 10, curve #1 TD 2: 110 % -> 36.00 s, 115 % -> 16.00 s, both exact); the M-3425A instruction book (Appendix D) is not on
       the PC, so the scaling with TD is assumed (TD 2 is the plant setting). The time is integrated (1 / t per second); reset linear in
       RST s from the trip threshold (report p.21: 30 s). Y = 1 when the integral reaches 1 */
    TINV: (x, n, st, dt) => {
      const M = +x[1],
        TD = par(n, 'TD'),
        PU = par(n, 'PU'),
        RST = par(n, 'RST');
      const on = !!(x[0] > 0.5) && isFinite(M) && M >= PU && M > 100;
      st.a = st.a || 0;
      if (on) st.a = Math.min(1, st.a + dt / ((1800 * TD) / Math.pow(M - 100, 2)));
      else st.a = Math.max(0, st.a - (RST > 0 ? dt / RST : 1));
      return [b01(st.a >= 1)];
    },
    /* ML 5 AW add with weight (TCA013 No. 5, tcs-macros-layout-2026-11-26.md: values G1 G2 G3 B): Y = G1 X1 + G2 X2 + G3 X3 + B */
    AW: (x, n) => [par(n, 'G1') * (x[0] || 0) + par(n, 'G2') * (x[1] || 0) + par(n, 'G3') * (x[2] || 0) + par(n, 'B')],
    /* ML 41 LMS limiter LL <= Y <= HL */
    LMS: (x, n) => [clamp(x[0], par(n, 'LL', -Infinity), par(n, 'HL', Infinity))],
    /* ML 42 HSG / ML 43 LSG the maximum / minimum of the inputs */
    HSG: x => [Math.max(...x)],
    LSG: x => [Math.min(...x)],
    /* ML 44 AND, ML 45 OR (up to 16 inputs), ML 46 NOT, ML 55 EOR */
    A: x => [b01(x.length && x.every(v => v))],
    AND: x => [b01(x.length && x.every(v => v))],
    OR: x => [b01(x.some(v => v))],
    NOT: x => [b01(!x[0])],
    EOR: x => [b01(!!x[0] !== !!x[1])],
    /* ML 47 TP pick-up delay: X 0 -> 1, Y = 1 after TP; X 1 -> 0, Y = 0 at once; SW=0 Y = 0 */
    TP: (x, n, st, dt, sw = 1) => {
      st.t = sw && x[0] ? (st.t || 0) + dt : 0;
      return [b01(sw && x[0] && st.t >= par(n, 'TP') - 1e-9)];
    },
    /* ML 48 TD drop-out delay: X 0 -> 1, Y = 1 at once; X 1 -> 0, Y = 0 after TD; SW=0 Y = 0 */
    TD: (x, n, st, dt, sw = 1) => {
      if (!sw) return [(st.t = 0)];
      if (x[0]) st.t = par(n, 'TD') + 1e-9;
      else st.t = Math.max(0, (st.t || 0) - dt);
      return [b01(x[0] || st.t > 0)];
    },
    /* ML 49 TW wipe-out: X 0 -> 1, Y = 1 for TW, then 0 until X goes 0 -> 1 again; SW=0 Y = 0 */
    TW: (x, n, st, dt, sw = 1) => {
      if (!sw) return [(st.t = 0)];
      if (x[0] && !st.x) st.t = par(n, 'TW');
      else st.t = Math.max(0, (st.t || 0) - dt);
      st.x = x[0];
      return [b01(st.t > 0)];
    },
    /* ML 50 FFR / FFS flip flop, S = X1, R = X2: 0 0 holds, 0 1 -> 0, 1 0 -> 1, 1 1 -> 0 (FFR, reset priority) or 1 (FFS, set priority) */
    FFR: (x, n, st) => [(st.y = x[0] && !x[1] ? 1 : x[1] ? 0 : st.y || 0)],
    FFS: (x, n, st) => [(st.y = x[0] ? 1 : x[1] ? 0 : st.y || 0)],
    /* ML 51 CMP comparator with hysteresis: from 1 it drops at X <= LL, from 0 it picks up at X >= HL; SW=0 Y = (X >= HL) */
    CMP: (x, n, st, dt, sw = 1) => {
      const HL = par(n, 'HL'),
        LL = par(n, 'LL', HL);
      st.y = !sw ? b01(x[0] >= HL) : st.y ? b01(x[0] > LL) : b01(x[0] >= HL);
      return [st.y];
    },
    /* ML 52 CPL comparator for a low value: from 1 it drops at X >= HL, from 0 it picks up at X <= LL */
    CPL: (x, n, st) => {
      const HL = par(n, 'HL'),
        LL = par(n, 'LL', HL);
      st.y = st.y ? b01(x[0] < HL) : b01(x[0] <= LL);
      return [st.y];
    },
    /* ML 54 CNT counts X 0 -> 1, Y = 1 at count >= N; SW=0 Y = 0 and the count clears */
    CNT: (x, n, st, dt, sw = 1) => {
      if (!sw) st.c = 0;
      else if (x[0] && !st.x) st.c = (st.c || 0) + 1;
      st.x = x[0];
      return [b01(sw && (st.c || 0) >= par(n, 'N'))];
    },
    /* ML 56 FLK flicker: while X = 1, Y = 1 for T1 then 0 for T2, repeated; SW=0 Y = 0 */
    FLK: (x, n, st, dt, sw = 1) => {
      if (!sw || !x[0]) return [(st.t = 0)];
      const T1 = par(n, 'T1'),
        T2 = par(n, 'T2');
      st.t = ((st.t || 0) + dt) % (T1 + T2);
      return [b01(st.t < T1)];
    },
    /* ML 57 FTR / ML 58 BTR data transfer Y = X (a box, or the circle on a wire) */
    FTR: x => [x[0]],
    BTR: x => [x[0]],
    /* ML 61 AVE Y = (X1 + .. + Xn) / n */
    AVE: x => [x.reduce((a, v) => a + v, 0) / (x.length || 1)],
    /* ML 63 HLD: SW 0 -> 1 holds the output while SW = 1; SW=0 Y = X */
    HLD: (x, n, st, dt, sw = 0) => {
      if (!sw || st.y === undefined) st.y = x[0];
      return [st.y];
    },
    /* ML 66 LCK Y = (X < K); ML 67 UCK Y = (X > K) */
    LCK: (x, n) => [b01(x[0] < par(n, 'K'))],
    UCK: (x, n) => [b01(x[0] > par(n, 'K'))],
    /* ML 68 TWF 2 out of 4 (more than one input = 1); ML 69 THF 3 out of 4 (more than two) */
    TWF: x => [b01(x.filter(Boolean).length > 1)],
    THF: x => [b01(x.filter(Boolean).length > 2)],
    /* ML 70 PDF positive differential: Y = 1 for one cycle when X goes 0 -> 1 (SW=1), or when SW goes 0 -> 1 with X = 1; SW=0 Y = 0 */
    PDF: (x, n, st, dt, sw = 1) => {
      const y = b01(sw && x[0] && (!st.x || !st.sw));
      st.x = x[0];
      st.sw = sw;
      return [y];
    },
    /* ML 73 WCM Y = 1 when X > HL or X < LL */
    WCM: (x, n) => [b01(x[0] > par(n, 'HL', Infinity) || x[0] < par(n, 'LL', -Infinity))],
    /* ML 19 FG diode function generator, at most 7 sections: Y = f(X) on the break points printed under the block
       ("X1:..", "Y1:.." up to X8 / Y8), straight between them, held flat outside. A block with no points printed gives NaN:
       the curve is not on the sheet, and no curve is made up here (the coverage test lists these blocks). */
    FG: (x, n) => {
      const P = [];
      for (let i = 1; i <= 8; i++) {
        const a = par(n, 'X' + i), b = par(n, 'Y' + i);
        if (a !== undefined && b !== undefined) P.push([a, b]);
      }
      if (P.length < 2) return [NaN];
      P.sort((p, q) => p[0] - q[0]);
      const X = x[0];
      if (X <= P[0][0]) return [P[0][1]];
      for (let i = 1; i < P.length; i++)
        if (X <= P[i][0]) return [P[i - 1][1] + ((P[i][1] - P[i - 1][1]) * (X - P[i - 1][0])) / (P[i][0] - P[i - 1][0])];
      return [P[P.length - 1][1]];
    },
    /* MODE (LMA810, TCA768A, one block per start-up mode): the load up rate (%/min) of the generator load L (MW). The tables printed
       beside each block: four MW points (L1 .. L4 = 90 / 60 / 33 / 22.5) and six rates R1 .. R6. EIMI (PDF, 2026-11-25): PPE-14-0726 R1
       p 3 / Att-2 / 3, 310SC90-775 p 26 *2, STIE-14811 p 147: until the IP -> HP transfer is complete (T = TCA535 E CRI 2.6 = 0) the
       rate is 5.0 %/min (R6) in every mode; with T = 1 the band rate: L > 90 R1, > 60 R2, > 33 R3, > 22.5 R4, else R5 (bands from the
       order printed; checked by EIMI against the FHI start-up curves PART-2 SECT 7). Derived: the 0 / 1 sense of T, and "> " at each
       boundary (> or >= and any dead band are not printed). */
    MODE: (x, n) => {
      const L = x[0];
      if (!b01(x[1])) return [par(n, 'R6', NaN)];
      for (let i = 1; i <= 4; i++) if (L > par(n, 'L' + i, NaN)) return [par(n, 'R' + i, NaN)];
      return [par(n, 'R5', NaN)];
    },
    /* UNT-FG (unit function generator, LMA010 on TCA762 / TCA763 "FG-1(LCFI)"): Y = f(X) on the table printed beside it on the page
       (Xn / Yn No. 0 .. 19, read as "Xi:" / "Yi:"), straight between the points, held flat outside, as the ML 19 FG. Check of the printed
       table (EIMI, LM2-TEQ-17-240 R0 p 158, STIE-14852: log10 LCFI % = -11.658 + 0.69142 s - 1.7930E-2 s^2 + 2.4745E-4 s^3 - 1.7267E-6 s^4
       + 4.6895E-9 s^5, s in kg/mm2): 500 N/mm2 = 50.99 kg/mm2 gives 0.536 %, the table 0.5381 %. No table on the page (TCE212 003 / 036):
       NaN, the curve is open. */
    'UNT-FG': (x, n) => {
      const P = [];
      for (let i = 0; i < 50; i++) {
        const a = par(n, 'X' + i), b = par(n, 'Y' + i);
        if (a !== undefined && b !== undefined) P.push([a, b]);
      }
      if (P.length < 2) return [NaN];
      P.sort((p, q) => p[0] - q[0]);
      const X = x[0];
      if (X <= P[0][0]) return [P[0][1]];
      for (let i = 1; i < P.length; i++)
        if (X <= P[i][0]) return [P[i - 1][1] + ((P[i][1] - P[i - 1][1]) * (X - P[i - 1][0])) / (P[i][0] - P[i - 1][0])];
      return [P[P.length - 1][1]];
    },
    /* ML 59 TB tie-back: primary flag (SW) = 1 Y = X, else Y = the tie-back value X2 */
    TB: (x, n, st, dt, sw = 1) => [sw ? x[0] : x[1]],
    /* ML 62 PA* parameter modify: the new value X is taken while its condition (SW) is met, else the previous value is kept */
    PA: (x, n, st, dt, sw = 1) => [(st.y = sw || st.y === undefined ? x[0] : st.y)],
    /* SUM: the sheets' name for ML 1 ADD drawn with its limiter printed under it (HL / LL, as ML 5 AW) */
    /* SW (record "SUM el Y X1 X2 SW HL LL"): NOT IN DOCS (not in macro list No. 1 ~ 73, no record comment; lane 0 read, phase6-tcs-
       companions-2026-11-26.md item 5). DERIVED from the wiring of all 13 SUM records: SW = 1 Y = X1 + X2 within LL .. HL, SW = 0 Y = X2.
       In LMA578A / LMA710 X2 is the block's own last output (0 on reset), so SUM accumulates while SW = 1, holds at SW = 0 and goes
       to 0 on reset; only SW = 0 -> X2 lets those resets act. TCA765 / 766 (X2 = 0.0, SW = INITIAL: 0 for the first 10 s, then 1):
       Y = 0 during the start, then X1. */
    SUM: (x, n, st, dt, sw = 1) =>
      sw ? [clamp(x.reduce((a, v) => a + v, 0), par(n, 'LL', -Infinity), par(n, 'HL', Infinity))] : [x[1] || 0]
  };
  /* the drawing's other names for the same kinds: a gate box typed "G:OR" / "G:A" is the OR / AND of ML 45 / 44; PA1 ~ PA4 are
     ML 62 with 1 ~ 4 inputs; the circles on a wire ("o:BTR", "o:FTR") are ML 58 / 57 (TCA018: 008 / 005). */
  /* the parameters a block cannot run without (macro list TCA013 ~ TCA020: each is named in the definition of its ML). A block that
     misses one, prints one the definition does not have, or has a SW input with no wire is OPEN: its sheet does not count as running
     (QA : SAORI review 2026-11-25: a missing parameter is an open item, never a default). */
  const REQ = {
    MODE: ['L1', 'L2', 'L3', 'L4', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6'],
    I: ['TI'], LG: ['T'], TINV: ['TD', 'PU', 'RST'], PIF: ['G', 'TI'], PIV: ['G1', 'G2', 'TI'], SG: ['K'], SGW: ['K'], AM: ['R'], G: ['K'], FLT: ['N'], GRD: ['K'],
    PD: ['N', 'K'], LIN: ['K', 'B'], TP: ['TP'], TD: ['TD'], TW: ['TW'], CMP: ['HL'], CPL: ['HL'], CNT: ['N'], FLK: ['T1', 'T2'],
    LCK: ['K'], UCK: ['K']
  };
  /* printed parameters that the definition of the ML does not have: their meaning is open until a document gives it.
     AM M (TCA777 / TCE503 "M:10"): NOT IN DOCS. Searched 2026-11-26 by lane 0 on the PC (/mnt/project-files/phase6-am-m-2026-11-26.md),
     14 document groups: TCA.pdf 331DM09788 MACRO LIST (1)-(8) + TCA021 / TCA022, TCE.pdf 331DM09784 TCE015 / TCE016, TCS LOGIC
     SYMBOL.pdf, LOGIC LEGEND.pdf, TCA / TCE SOFT LOGIC DIAGRAM OF TCS, ML-331DM07730 Functional Block Diagram, 2-2 TURBINE CONTROL
     SYSTEM_R1 (TC-14-116), 331DM10701 Specification of HMI, ML-310SC90-778 Setpoint List / Generator Protection / IO List and IBD,
     TC-13-101 Turbine Control System Specification, TCS LOGIC OPENING PROCEDURE, the TCS backup tool files, the DCS manuals and
     textbook, and the file lists of D:/LPDSI, OneDrive and the repo. Backup fact: M is a whole number (1 or 10, PA46 can feed it);
     M = 10 only on operator raise / lower setters (LMA040 / 043 / 584B, LME043, TCA777 / TCE503), M = 1 only on logic-driven AMs.
     INFERRED (not applied): M is a speed-up factor, up to R x M while the button is held. Team decision 2026-11-26 (coordinator,
     after every doc was searched): K.AM moves at R with the LL .. HL clamp, exact for M = 1 and the slow, safe case for M = 10.
     M is read nowhere; it stays an OPEN item until the Hitachi R600 macro function manual is found. */
  const EXTRA = {};
  const keysOf = n => new Set((n || []).map(q => (/^\s*([A-Z][A-Z0-9]*)\s*:/.exec(q) || [])[1]).filter(Boolean));
  const INTL_SW = { TP: 1, TD: 1, TW: 1 };
  function need(type, notes, swWired) {
    const t = K[type] ? type : ALIAS[type] || type,
      f = K[t],
      k = keysOf(notes),
      out = [];
    if (!f) return out;
    for (const p of REQ[t] || []) if (!k.has(p) && !(t === 'G' && p === 'K' && k.has('KA'))) out.push(t + ' ' + p + ' not on the sheet');
    for (const p of EXTRA[t] || []) if (k.has(p)) out.push(t + ' ' + p + ' printed, not in the macro list definition');
    if (t === 'FG') {
      let c = 0;
      for (let i = 1; i <= 8; i++) if (k.has('X' + i) && k.has('Y' + i)) c++;
      if (c < 2) out.push('FG curve not on the sheet');
    }
    if (t === 'UNT-FG' && ![...k].filter(q => /^X\d+$/.test(q)).length) out.push('UNT-FG curve not on the sheet');
    /* ML 62 PA (parameter modify) has no SW in its symbol: its side input is the condition of the parameter, drawn or not */
    /* SW not wired: the timer macros take INTL (SYSDEF No. 3, TCE p 16: "0 at initial start, and 1 after then. This condition is used for
       the default of the switch input of the Timer macros"); a CMP with no hysteresis (LL not printed or LL = HL) gives the same Y with
       SW = 1 or 0 (ML 51), so its SW does not matter */
    const noHys = t === 'CMP' && (par(notes, 'LL') === undefined || par(notes, 'LL') === par(notes, 'HL'));
    if (!swWired && t !== 'PA' && !INTL_SW[t] && !noHys && /\bsw\s*=/.test(String(f))) out.push(t + ' SW not wired (HIACS default not in the macro list)');
    return out;
  }
  const ALIAS = { 'G:OR': 'OR', 'G:A': 'A', PA1: 'PA', PA2: 'PA', PA3: 'PA', PA4: 'PA', 'o:BTR': 'BTR', 'o:FTR': 'FTR' };
  /* marks that are not blocks: X = the loop mark (below, net()), NC is a pin drawn not connected */
  const MARK = { X: 1, NC: 1 };
  const kind = t => K[t] || K[ALIAS[t]] || null;
  const KINDS = Object.keys(K);

  /* ---------- step 1: a typed sheet (src/digital/tce/*.js, format: src/digital/parts/02d-tce.js) as a netlist, from the drawing itself.
     One reader for the tool (tools/data/tce_net.mjs) and the app. The key of a wire piece is the part that gives its signal, so the key IS the
     net. What the net feeds is read from the last point of each piece, as on the drawing:
       - on the left edge of a small block: an input of that block (ordered by height, top first); on its top or bottom edge: the side input
         the drawing gives there (its SW, below);
       - on a mark on the wire (BTR / FTR transfer, X crossed circle = loop mark, NC circle of a NOT): the input of that mark;
       - on the left edge of a macro block: the input pin at that height (the pin heights the sheet gives, or the drawing's even spacing);
       - on an output connector, a CRT lamp, a definition (constant of kind 'def') or a PI/O box: an output of the sheet;
       - at the start of, or on, another piece of the same key: the same net goes on (a gap for a mark of the drawing, or a junction).
     Anything else is "not named" (open), printed by the tool with its sheet, key and point. ---------- */
  const MARKRE = /^(o:BTR|o:FTR|X|NC)$/;
  const near = (a, b, d) => Math.abs(a - b) <= d;
  function macroPins(s, macros, u, tol) {
    const W = s.w || [],
      by = new Map(macros.filter(M => M.R.length).map(M => [M.key, M]));
    if (!W.some(w => by.has(w[0]))) return W;
    const key = new Map(),
      on = (p, v) =>
        v[1].some((a, i) => {
          if (!i) return false;
          const b = v[1][i - 1];
          return p[0] >= Math.min(a[0], b[0]) - tol && p[0] <= Math.max(a[0], b[0]) + tol && p[1] >= Math.min(a[1], b[1]) - tol && p[1] <= Math.max(a[1], b[1]) + tol;
        });
    for (const w of W) {
      const M = by.get(w[0]),
        p = w[1][0];
      if (!M || Math.abs(p[0] - M.x1) > tol) continue;
      const n = M.R.length,
        i =
          M.ry && M.ry.length
            ? M.ry.reduce((a, y, j) => (Math.abs(y - p[1]) < Math.abs(M.ry[a] - p[1]) ? j : a), 0)
            : Math.max(0, Math.min(n - 1, Math.floor(((p[1] - M.y0 - 15 * u) / (M.y1 - M.y0 - 30 * u)) * n)));
      if (M.R[i]) key.set(w, M.key + '.' + M.R[i]);
    }
    for (let k = 0, ch = true; ch && k < 20; k++) {
      ch = false;
      for (const w of W)
        if (by.has(w[0]) && !key.has(w)) {
          const v = W.find(v => v !== w && String(v[0]).split('.')[0] === w[0] && (key.has(v) || v[0] !== w[0]) && on(w[1][0], v));
          if (v) key.set(w, key.get(v) || v[0]), (ch = true);
          /* or a keyed wire ends on this one (a T joint in the middle of a riser: TCE212 mt012 D.TEST at 1472,912) */
          const e = !v && W.find(v => v !== w && key.has(v) && String(key.get(v)).split('.')[0] === w[0] && on(v[1][v[1].length - 1], w));
          if (e) key.set(w, key.get(e)), (ch = true);
        }
    }
    return W.map(w => (key.has(w) ? [key.get(w)].concat(w.slice(1)) : w));
  }
  /* a macro typed as a block with named pins (VALVE CONTROL MT1 on TCE210 / 211 / 212 / 214) whose inside comes from the HIACS backup:
     run it as a macro (s.m) so each pin keeps its own wire; the pins sit at the middle of equal slots down the box (the typed pins of
     TCE210 meet the wire ends at slots 1.0, 2.0 ... within 0.1). The typed sheet itself is not changed. */
  function bkBlocks(s) {
    const cv = (s.b || []).filter(b => b[6] && b[6].l && b[6].r && b[7] && !MARKRE.test(b[1]) && (bkMacro(s.id, b[2]) || { pins: [] }).pins.length > 1);
    if (!cv.length) return s;
    const m = cv.map(([key, type, no, x, y, notes, pins, size]) => {
      const [w, h] = size,
        y0 = y - h / 2,
        at = P => P.map((q, i) => y0 + ((i + 0.5) * h) / P.length);
      return [key, type, no, x - w / 2, y0, w, h, pins.l, pins.r, no, notes || [], [at(pins.l), at(pins.r)]];
    });
    return Object.assign({}, s, { b: s.b.filter(b => !cv.includes(b)), m: (s.m || []).concat(m) });
  }
  function net(s) {
    s = bkBlocks(s);
    const u = (s.f[2] - s.f[0]) / 1000,
      tol = 2.2 * u;
    const blocks = [],
      marks = [];
    for (const b of s.b || []) {
      const [key, type, no, x, y, notes, pins, size] = b;
      if (MARKRE.test(type)) marks.push({ key, type, x, y, r: size ? size[0] : 5.25 * u });
      else {
        const w = size ? size[0] / 2 : 14 * u,
          h = size ? size[1] / 2 : 10.5 * u;
        blocks.push({ key, type, no, notes: notes || [], pins: pins || {}, x0: x - w, x1: x + w, y0: y - h, y1: y + h, ins: [] });
      }
    }
    const macros = (s.m || []).map(([key, name, tag, x, y, w, h, L, R, foot, notes, plain]) => ({
      key,
      no: foot,
      type: 'M:' + name,
      tag,
      notes: notes || [],
      L: L || [],
      R: R || [],
      ly: plain ? plain[0] : null,
      ry: plain ? plain[1] : null,
      x0: x,
      x1: x + w,
      y0: y,
      y1: y + h,
      ins: []
    }));
    const outs = [
      ...(s.c || []).filter(c => c[1] === 'out').map(c => ({ key: c[0], kind: 'c', letter: c[2], sheets: c[6] || [], what: 'connector ' + c[2] + ' to ' + (c[6] || []).join(' '), x: c[3], y: c[4], d: 40 * u })),
      ...(s.d || []).filter(d => d[3] === 'out').map(d => ({ key: d[0], kind: 'd', text: d[4] || '', what: 'CRT lamp ' + (d[4] || ''), x: d[1], y: d[2], d: 40 * u })),
      ...(s.k || []).filter(k => /def$/.test(k[5] || '')).map(k => ({ key: k[0], kind: 'def', text: k[3], what: 'definition ' + k[3], x: k[1], y: k[2], d: 12 * u }))
    ];
    /* the PI/O table row printed at the box or just right of it on its top line ("(TCA980-17)"), the same rule as the input boxes of compile */
    /* an OUTPUT box of the COMM / EHG output sheets (TCA830 .. TCE610) prints its row over the PI/O mark, ~185 px left of the box: looked for
       only when nothing is printed at the box itself */
    const pioRow = (x0, y0, x1, y1) => pioAt(x0 - 6, y0, x1, y1) || pioAt(x0 - 200, y0, x1, y1);
    const pioAt = (xa, y0, x1, y1) => {
      const h = (s.t || [])
        .filter(w => w[0] >= xa && w[0] <= x1 + 120 && w[1] >= y0 - 16 && w[1] <= y1 + 6 && /\(T[A-Z]{2}\d+[A-Z]?-\d+\)/.test(w[2]))
        .sort((a, b) => Math.hypot(a[0] - x1, a[1] - y0) - Math.hypot(b[0] - x1, b[1] - y0))[0];
      return h ? /\((T[A-Z]{2}\d+[A-Z]?-\d+)\)/.exec(h[2])[1] : undefined;
    };
    const pio = (s.r || []).map(r => ({ key: r[0], x0: r[1], x1: r[1] + r[3], y0: r[2], y1: r[2] + r[4], row: pioRow(r[1], r[2], r[1] + r[3], r[2] + r[4]) }));
    /* a wire keyed by a macro with no pin (TCE300 'b007') starts at an output pin of its right edge (the height gives the pin, the same
       spacing rule as the input pins) or on another piece of the same key: it takes that piece's pin. Without this every such wire read
       the first pin: MOP(A) RUNNING and MOP(A),(B) FAULT of TCE300 read STS (2026-11-25, YUA) */
    const W = macroPins(s, macros, u, tol);
    /* "(*)" beside a connector = this same sheet (TCE300 B3 MOP (B) RUNNING: the output B3 of TCE300) */
    /* a connector typed with no sheet list: its sheet is the one printed as a free text under it, "(TCA358)" (TCA370 A1 REHEAT BOWL INNER WALL
       METAL TEMP., TCA510 D STEP n COMPLETED); without it the 33 such inputs were ports with no end, read as 0 (2026-11-25, YUA) */
    const under = c =>
      (s.t || [])
        .filter(w => Math.abs(w[0] - c[3]) <= 150 && w[1] > c[4] && w[1] - c[4] <= 36 && /^\([A-Z]{3}\d+[A-Z]?\)$/.test(w[2]))
        .sort((x, y) => x[1] - y[1])
        .slice(0, 1)
        .map(w => w[2].slice(1, -1));
    /* Phase 6 TCS (2026-11-26): a sheet with several input connectors printed "-" (no letter) under different names (TCE100: PLU(1) ~ (3)
       OPERATED, EOS(1) ~ (3) OPERATED) gave them one port CON:sheet.-, six signals on one net. Each such input is its own port, "-" + its
       name; a single "-" input (TCE250) keeps CON:sheet.- */
    const dash = (s.c || []).filter(c => c[1] === 'in' && c[2] === '-' && c[5]),
      dashN = new Set(dash.map(c => c[5])).size > 1;
    const inputs = (s.c || [])
      .filter(c => c[1] === 'in')
      .map(c => ({
        key: c[0],
        letter: c[2],
        pin: dashN && c[2] === '-' && c[5] ? '-' + c[5] : c[2],
        name: c[5],
        from: ((c[6] || []).length ? c[6] : under(c)).map(f => (f === '*' ? s.id : f))
      }));
    const outc = (s.c || []).filter(c => c[1] === 'out').map(c => ({ key: c[0], letter: c[2], sheets: c[6] || [] }));
    const res = { id: s.id, inputs, outc, blocks, macros, marks: marks.map(m => ({ key: m.key, type: m.type, in: null })), outputs: [], open: [] };
    const mk = Object.fromEntries(res.marks.map(m => [m.key, m]));
    const onSeg = (p, v) =>
      v[1].some((a, i) => {
        if (!i) return false;
        const b = v[1][i - 1];
        return (
          (a[0] === b[0] && near(a[0], p[0], 0.6) && p[1] >= Math.min(a[1], b[1]) - 0.6 && p[1] <= Math.max(a[1], b[1]) + 0.6) ||
          (a[1] === b[1] && near(a[1], p[1], 0.6) && p[0] >= Math.min(a[0], b[0]) - 0.6 && p[0] <= Math.max(a[0], b[0]) + 0.6)
        );
      });
    for (const w of W) {
      const nt = w[0],
        p = w[1][w[1].length - 1],
        q = w[1][w[1].length - 2];
      const left = q[0] < p[0],
        down = q[1] < p[1];
      let b = blocks.find(b => near(p[0], b.x0, tol) && p[1] >= b.y0 - tol && p[1] <= b.y1 + tol && left);
      if (b) {
        b.ins.push({ net: nt, y: p[1], side: 'l' });
        continue;
      }
      b = blocks.find(b => p[0] >= b.x0 - tol && p[0] <= b.x1 + tol && ((down && near(p[1], b.y0, tol)) || (!down && near(p[1], b.y1, tol))));
      if (b) {
        b.ins.push({ net: nt, x: p[0], side: down ? 't' : 'b' });
        continue;
      }
      const m = marks.find(m => Math.hypot(m.x - p[0], m.y - p[1]) <= m.r + tol);
      if (m) {
        mk[m.key].in = nt;
        continue;
      }
      const M = macros.find(M => near(p[0], M.x0, tol) && p[1] >= M.y0 - tol && p[1] <= M.y1 + tol);
      if (M) {
        let pin = null;
        if (M.ly) {
          let best = 1e9;
          M.ly.forEach((y, i) => {
            if (Math.abs(y - p[1]) < best) (best = Math.abs(y - p[1])), (pin = i);
          });
        } else if (M.L.length) {
          const n = M.L.length,
            i = Math.floor(((p[1] - M.y0 - 15 * u) / (M.y1 - M.y0 - 30 * u)) * n);
          pin = Math.max(0, Math.min(n - 1, i));
        }
        M.ins.push({ net: nt, y: p[1], pin, name: pin != null ? M.L[pin] : null });
        continue;
      }
      /* the NEAREST output connector within its radius (two connectors ~60 px apart both reach a wire end: TCE168 C1 / C) */
      let o = null,
        od = Infinity;
      for (const c of outs) {
        const dd = Math.hypot(c.x - p[0], c.y - p[1]);
        if (dd <= c.d && dd < od) (o = c), (od = dd);
      }
      if (o) {
        res.outputs.push({ net: nt, to: o.what, key: o.key, kind: o.kind, text: o.text, letter: o.letter, sheets: o.sheets });
        continue;
      }
      const r = pio.find(r => p[0] >= r.x0 - tol && p[0] <= r.x1 + tol && p[1] >= r.y0 - tol && p[1] <= r.y1 + tol);
      if (r) {
        res.outputs.push({ net: nt, to: 'PI/O ' + (r.row || r.key), key: r.key, kind: 'r', row: r.row });
        continue;
      }
      if (W.some(v => v !== w && v[0] === nt && (Math.hypot(v[1][0][0] - p[0], v[1][0][1] - p[1]) <= 20 * u || onSeg(p, v)))) continue;
      res.open.push({ net: nt, at: p });
    }
    /* an X (crossed circle) marks a line that comes back from a block scanned later (a loop: the value of the last scan); it does NOT
       invert it (2026-11-25, YUA; was read as inverted). On the drawings: TCE227 OR 005 -> X -> A 004 is the seal-in of the CRV(A) test;
       TCE300 B3 (*) MOP (B) RUNNING -> X -> TP A001 is the mirror of MOP (A) RUNNING -> TP A015, drawn with no X, and IBD TB-1 takes MOP (B)
       RUNNING itself; on analog lines (TCA763 HSG 010 back to ASW 013) there is nothing to invert. All of the 61 inputs with an X are fed
       back from the same page or a later one. */
    for (const b of blocks) {
      b.ins.sort((a, c) => (a.side === c.side ? (a.y ?? a.x) - (c.y ?? c.x) : a.side < c.side ? -1 : 1));
      delete b.x0, delete b.x1, delete b.y0, delete b.y1;
    }
    for (const M of macros) {
      M.ins.sort((a, c) => a.y - c.y);
      delete M.x0, delete M.x1, delete M.y0, delete M.y1, delete M.ly, delete M.ry;
    }
    return res;
  }
  /* ---------- a sheet of the Generator Protection / Breaker Logic Diagram 310SD03-743 (SH-G-1A ~ SH-G-9, typed in the IBD form, `dwg`):
     the same netlist shape as net(), read from the parts these sheets use:
       - gate G:OR / G:A: its input edge is the bar (size[2], or the plain vertical line drawn beside its left side); a wire ending on that
         edge is an input; NC = the NOT circle on a line;
       - r box with a key and "DI" + time printed in it: a pick-up delay (ML 47 TP; the relay drawing's DI = delayed in); a box with a key
         and no DI is a signal of the equipment (selector, switch position: a port); a box with no key is a panel the signal goes to;
       - s source with a continuation circle in it: an input from the sheet printed beside it ("SH-G-1B"), joined by the circle number to the
         circle of the same number on that sheet; an s source with no circle: a contact of the equipment or a relay (a port, named by
         the words in it);
       - a wire ending at a continuation circle: an output to the sheet printed beside the circle ("SH-G-*" = to the sheets that read it).
     ---------- */
  function gnet(s) {
    const u = (s.f[2] - s.f[0]) / 1000,
      tol = 2.2 * u,
      T = s.t || [],
      L = (s.l || []).filter(l => l[0][0] === l[1][0]);
    const words = (x0, y0, x1, y1) => T.filter(t => t[0] >= x0 && t[0] <= x1 && t[1] >= y0 && t[1] <= y1);
    const circles = (s.o || []).map(([x, y, r]) => {
      const n = T.find(t => Math.abs(t[0] - x) < 2 && Math.abs(t[1] - y) < 2),
        sh = T.filter(t => /^SH-G-/.test(t[2]) && t[0] > x && t[0] < x + 60 && t[1] - y > -10 && t[1] - y < 25).sort((a, b) => Math.abs(a[1] - y - 5) - Math.abs(b[1] - y - 5))[0];
      return { x, y, r, n: n ? String(n[2]) : '', sh: sh ? sh[2].replace(/^SH-/, '') : '' };
    });
    const blocks = [],
      marks = [],
      res = { id: s.id, inputs: [], outc: [], blocks, macros: [], marks: [], outputs: [], open: [], ports: {} };
    for (const b of s.b || []) {
      const [key, type, no, x, y, notes, pins, size] = b;
      if (type === 'NC') {
        marks.push({ key, type, x, y, r: size ? size[0] : 11 });
        continue;
      }
      const [w, h, bar] = size || [20, 20, 0],
        ex = x - w / 2,
        bl = L.find(l => Math.abs(l[0][0] - ex) <= tol && Math.min(l[0][1], l[1][1]) <= y && Math.max(l[0][1], l[1][1]) >= y),
        ys = bar ? [y - bar / 2, y + bar / 2] : bl ? [Math.min(bl[0][1], bl[1][1]), Math.max(bl[0][1], bl[1][1])] : [y - h / 2, y + h / 2];
      blocks.push({ key, type, no, notes: notes || [], pins: pins || {}, ex, ys, ins: [] });
    }
    for (const r of s.r || []) {
      const [key, x, y, w, h, text] = r;
      if (!key) continue;
      const z = words(x, y, x + w, y + h).map(t => String(t[2]));
      if (z[0] === 'DI') {
        /* the time printed in the box; a box that prints only "t" takes the relay's as-set time from the sheet's `set` (with its source) */
        const m = /^([\d.]+)\s*(s|min)$/i.exec(z[1] || ''),
          st = (s.set || {})[key];
        const notes = m ? ['TP:' + +m[1] * (/min/i.test(m[2]) ? 60 : 1)] : st ? st : ['time "' + (z[1] || '') + '" not printed'];
        /* an inverse time element (TINV, the sheet's `set` gives TD / PU): its second input is the operating quantity of the relay
           (V/Hz % for the 24 element), a PLANT port of the sheet; the first is the pick-up contact drawn into the box */
        const inv = !m && st && /^TINV/.test(st[0]);
        if (inv) res.ports[key + '.M'] = 'PLANT:' + s.id + '.' + key + '.M operating quantity (V/Hz %)';
        blocks.push({ key, type: inv ? 'TINV' : m || st ? 'TP' : 'TP?', no: '', notes: inv ? st.slice(1) : notes, pins: {}, ex: x, ys: [y, y + h], ins: inv ? [{ net: key + '.M', y: y + h + 1, side: 'l' }] : [] });
      } else res.ports[key] = 'PLANT:' + s.id + '.' + key + ' ' + (text || z.join(' ') || '').trim();
    }
    for (const x of s.s || []) {
      const [key, x0, y0, x1, y1] = x,
        c = circles.find(c => c.x >= x0 - 1 && c.x <= x1 + 1 && c.y >= y0 - 1 && c.y <= y1 + 1);
      const shw = T.find(t => /^SH-G-/.test(t[2]) && t[0] >= x0 && t[0] <= x1 + 60 && t[1] >= y0 && t[1] <= y1 + 30);
      if (c && (c.sh || shw)) res.inputs.push({ key, letter: c.n, name: '', from: [(c.sh || shw[2]).replace(/^SH-/, '')] });
      else {
        /* named by its words and the words of its row to the left (the relay or switch it is a contact of) */
        const z = words(x0 - 400, y0 - 12, x0 - 2, y1 + 2)
          .concat(words(x0 - 2, y0 - 2, x1 + 2, y1 + 2))
          .map(t => String(t[2]));
        res.ports[key] = 'PLANT:' + s.id + '.' + key + (z.length ? ' ' + z.join(' ') : '');
      }
    }
    res.marks = marks.map(m => ({ key: m.key, type: m.type, in: null }));
    const mk = Object.fromEntries(res.marks.map(m => [m.key, m]));
    const W = s.w || [];
    const onSeg = (p, v) =>
      v[1].some((a, i) => {
        if (!i) return false;
        const b = v[1][i - 1];
        return (
          (a[0] === b[0] && near(a[0], p[0], 0.6) && p[1] >= Math.min(a[1], b[1]) - 0.6 && p[1] <= Math.max(a[1], b[1]) + 0.6) ||
          (a[1] === b[1] && near(a[1], p[1], 0.6) && p[0] >= Math.min(a[0], b[0]) - 0.6 && p[0] <= Math.max(a[0], b[0]) + 0.6)
        );
      });
    const outSeen = new Set();
    for (const w of W) {
      const nt = w[0],
        p = w[1][w[1].length - 1];
      const b = blocks.find(b => near(p[0], b.ex, tol) && p[1] >= b.ys[0] - tol && p[1] <= b.ys[1] + tol);
      if (b) {
        b.ins.push({ net: nt, y: p[1], side: 'l' });
        continue;
      }
      const m = marks.find(m => Math.hypot(m.x - p[0], m.y - p[1]) <= m.r + tol);
      if (m) {
        mk[m.key].in = nt;
        continue;
      }
      const c = circles.find(c => Math.hypot(c.x - p[0], c.y - p[1]) <= c.r + tol);
      if (c) {
        const k = 'o:' + c.x + ',' + c.y;
        if (!outSeen.has(k)) {
          outSeen.add(k);
          res.outc.push({ key: k, letter: c.n, sheets: c.sh ? [c.sh] : [] });
          res.outputs.push({ net: nt, to: 'circle ' + c.n + ' to ' + (c.sh || '(this sheet)'), key: k, kind: 'c', letter: c.n, sheets: c.sh ? [c.sh] : [] });
        }
        continue;
      }
      const r = (s.r || []).find(r => p[0] >= r[1] - tol && p[0] <= r[1] + r[3] + tol && p[1] >= r[2] - tol && p[1] <= r[2] + r[4] + tol);
      if (r) {
        res.outputs.push({ net: nt, to: 'panel ' + (r[5] || r[0]), key: r[0] || 'panel', kind: 'r' });
        continue;
      }
      if (W.some(v => v !== w && v[0] === nt && (Math.hypot(v[1][0][0] - p[0], v[1][0][1] - p[1]) <= 20 * u || onSeg(p, v)))) continue;
      res.open.push({ net: nt, at: p });
    }
    for (const b of blocks) {
      b.ins.sort((a, c) => a.y - c.y);
      delete b.ex, delete b.ys;
    }
    return res;
  }
  /* an input connector [letter, from sheets] is fed by the output connector of the same letter on the sheet it names: the in-connector names
     both the sheet and the letter, so that is the link. The sheet list printed at the output connector is the drawing's cross reference only;
     where it is empty (not typed) or leaves this sheet out, the link still holds and the gap is listed as "list". No output of that letter on the
     named sheet, or two of them, is "bad": the link cannot be made. Sets c.src = 'SHEET:outkey' on each joined input. */
  function join(all) {
    const by = Object.fromEntries(all.map(n => [n.id, n]));
    let ok = 0,
      ext = 0;
    const bad = [],
      list = [];
    for (const n of all)
      for (const c of n.inputs) {
        const src = c.from.filter(f => by[f]);
        if (!src.length) {
          ext++;
          continue;
        }
        const hit = src.flatMap(f => by[f].outc.filter(o => o.letter === c.letter).map(o => [f, o]));
        const back = hit.filter(h => h[1].sheets.includes(n.id) || h[1].sheets.includes('G-*'));
        const use = back.length ? back : hit;
        if (use.length !== 1) {
          bad.push(n.id + ' ' + c.letter + ' <- ' + src.join(' ') + (hit.length ? ' (' + hit.length + ' outputs of that letter)' : ' (no output of that letter)'));
          continue;
        }
        c.src = use[0][0] + ':' + use[0][1].key;
        ok++;
        if (!back.length) list.push(n.id + ' ' + c.letter + ' <- ' + use[0][0] + (use[0][1].sheets.length ? ' (its list: ' + use[0][1].sheets.join(' ') + ')' : ' (its list is not typed)'));
      }
    return { ok, ext, bad, list };
  }

  /* ---------- the sheets as ONE running program (plan step 2 / 4). Nothing here reads or writes the plant: everything that enters from
     outside the TCE / TCA set is a PORT, named by what the drawing prints there, and the I/O binding (plan step 3, lane TCS I/O) sets the
     ports; the outputs to the plant are read back by the same names. Ports:
       PIO:<text of the PI/O box>        a PI/O table row (field input of the controller)
       CON:<sheet>.<letter>              an input connector from a part that is not a TCE / TCA sheet (TCP = TPC tables, TCT = CRT tables,
                                         IBD, DCS); several sheets reading the same connector share the port
       CRT:<sheet>.<tag>                 an operator push button of the TCS HMI (CRT diamond 'in')
       SYS:<text>                        a controller system reference (MYCTL-A, CPU_SIMU_ON, slot errors ...)
       REF:<text>                        a reference to a definition that no typed sheet gives out
     Constants: ON(1) = 1, OFF(0) = 0, a printed number = that number.
     Order: every sheet runs at its own cycle (q.cycle, ms), in the order of the set (sheet number), as the controller scans its pages; inside a
     sheet every block runs after the blocks that feed it (a loop of the drawing, a flip-flop seal-in, takes the value of the last scan). ---------- */
  /* the side input of a block (top or bottom edge) is its SW of the macro list (SW = 1 the normal rule, SW = 0 the block's SW = 0 rule).
     TCA100 / TCE050 show why: INITIAL is TP A001 of ON(1) with its own SW at ON(1), so it is 0 for the first 10 s of the controller and 1
     after; it feeds the top of the timers and comparators of every sheet, which therefore hold their SW = 0 output (Y = 0) for those
     10 s: "INITIAL clears every timer". */
  const MACRO = {}; /* macro meanings, by name ('TRIPPLE INPUT DIAGNOSTICS' ...): f(inputs by pin name, notes, st, dt) -> outputs by pin name */
  /* ---------- macro (MD) meanings FROM THE MANUAL TEXT: the inside of these macros is NOT drawn in any document we have (lane 2 spec
     /mnt/project-files/lanes/tcs-macros/01, 02, 04: the TCE / TCA sets, TCA.pdf / TCE.pdf and TC-14-116 were searched page by page; the
     inside lives in the EWS project, "Logic Monitor", TC-14-116 p 1359). What IS drawn: the pins, the macro number, the parameters printed
     beside each block and the wiring. Each meaning below is the reading of those plus what TC-14-116 writes about the function; every
     such function carries src = TEXT, and stats() counts the sheets that run only with them apart (QA column "from manual text, not
     drawing-complete") until the user decides. A Logic Monitor print, if found, replaces the reading. */
  const TEXT = 'from manual text, inside not drawn';
  /* a printed parameter of a macro, "LABEL:value" (value without its unit: "306.0degC", "0.18S"); undefined if not printed */
  const mpar = (notes, label) => {
    for (const n of notes || []) {
      const z = String(Array.isArray(n) ? n[2] : n).trim();
      if (z.startsWith(label + ':')) return parseFloat(z.slice(label.length + 1));
    }
  };
  /* on-delay: 1 once cond has held T seconds */
  const onDelay = (st, k, cond, T, dt) => ((st[k] = cond ? (st[k] || 0) + dt : 0), st[k] >= T - 1e-9 ? 1 : 0);
  /* need(notes): the printed parameters the reading uses that are missing (a missing one keeps the block open, never a default) */
  const textMacro = (need, f) => ((f.src = TEXT), (f.need = typeof need === 'function' ? need : notes => need.filter(k => mpar(notes, k) === undefined)), f);
  /* 01 TRIPPLE INPUT DIAGNOSTICS (LME105, 146 blocks on TCE075 ~ TCE119A, TCE145; pins IN1 IN2 IN3 / OUT, DEV E; printed TP:3.0).
     TC-14-116 p 85: "2/3 : contact 2 out of 3 combination logic"; p 1298 No. 9 "Input Channel Error": "deviations between signals when
     inputs such as field sensors are multiplexed". Reading: OUT = 2 out of 3 of IN1..IN3; DEV E = the three not all equal for TP s. */
  MACRO['TRIPPLE INPUT DIAGNOSTICS'] = textMacro(['TP'], (I, notes, st, dt) => {
    const a = b01(I.IN1),
      b = b01(I.IN2),
      c = b01(I.IN3);
    return { OUT: a + b + c >= 2 ? 1 : 0, 'DEV E': onDelay(st, 'd', !(a === b && b === c), mpar(notes, 'TP'), dt) };
  });
  /* 02 AI DIAG.MD (LMA510 / LME510, 96 blocks on TCA310 ~ TCA443, TCE102 ~ TCE104; pins IN ERR SIM / OUT ABN). Printed in two groups:
     left "DEF N, K, H/L HL, LL, DEF TP" (HL / LL = about 102 % and -2 ~ -15 % of the AI range: the range check), right "DEV HL, LL,
     DEF TP, DEF N, K" (the rate check). TC-14-116 p 1298 No. 4 "Analog Input Signal Abnormal": "a deviation from the upper or lower
     limit or an excessively large rate of signal change) or an abnormal input module function". Reading: each group samples IN every
     DEF TP (at least once a scan); a sample is bad when IN is outside [LL, HL] (range) or its change from the last sample is outside
     [DEV LL, DEV HL] (rate); ABN = ERR, or DEF N bad samples in a row in either group. OUT = IN, and SIM on ABN (SIM is the drawn
     substitute: an SG or the value of another sheet, e.g. TCA322 valve positions from TCA740 / TCA741). K (printed 1) is not read:
     the manual does not say what it is. */
  const aiGroups = notes => {
    const h = (notes || []).find(n => /^H\/L HL:/.test(n[2])),
      d = (notes || []).find(n => /^DEV HL:/.test(n[2]));
    if (!h || !d) return null;
    const g = { hl: parseFloat(h[2].split(':')[1]) },
      e = { hl: parseFloat(d[2].split(':')[1]) };
    /* each label stands under the HL of its group ("LL:" 20 px in): it belongs to the nearer HL */
    const near = (n, x0, x1) => Math.abs(n[0] - x0) < Math.abs(n[0] - x1);
    for (const [o, x0, x1] of [[g, h[0], d[0]], [e, d[0], h[0]]])
      for (const [k, re] of [['LL', /^LL:/], ['TP', /^DEF TP:/], ['N', /^DEF N:/]]) {
        const n = (notes || []).filter(n => re.test(n[2]) && near(n, x0 + (k === 'LL' ? 20 : 0), x1 + (k === 'LL' ? 20 : 0)))[0];
        o[k] = n ? parseFloat(String(n[2]).split(':')[1]) : undefined;
      }
    return { g, e };
  };
  const aiNeed = notes => {
    const G = aiGroups(notes);
    if (!G) return ['H/L HL', 'DEV HL'].filter(k => mpar(notes, k) === undefined);
    const miss = [];
    for (const [o, w] of [[G.g, 'H/L'], [G.e, 'DEV']]) for (const k of ['LL', 'TP', 'N']) if (!Number.isFinite(o[k])) miss.push(w + ' ' + k);
    return miss;
  };
  MACRO['AI DIAG.MD'] = textMacro(aiNeed, (I, notes, st, dt) => {
    const G = st.G || (st.G = aiGroups(notes)),
      x = I.IN;
    if (!G) return {};
    const chk = (o, k, bad) => {
      st[k + 't'] = (st[k + 't'] || 0) + dt;
      if (st[k + 't'] >= Math.max(o.TP, dt) - 1e-9) {
        st[k + 't'] = 0;
        st[k + 'n'] = bad() ? (st[k + 'n'] || 0) + 1 : 0;
      }
      return (st[k + 'n'] || 0) >= o.N;
    };
    const range = chk(G.g, 'r', () => x > G.g.hl || x < G.g.LL);
    const rate = chk(G.e, 'v', () => {
      const d = st.last === undefined ? 0 : x - st.last;
      st.last = x;
      return d > G.e.hl || d < G.e.LL;
    });
    const abn = b01(I.ERR) || range || rate ? 1 : 0;
    return { OUT: abn ? I.SIM : x, ABN: abn };
  });
  /* 04 TMR AI DIAGNOSTICS (LME111 + LME111A, 42 blocks on TCE060 ~ TCE073, TCA372; pins SIG1 ERR1 SIG2 ERR2 SIG3 ERR3 HL LL DEV SIM /
     OUT ABN DEV E ERR; printed TP:1.0 three times and DELAY TP:3.0s three times: one of each per channel). TC-14-116 p 1308 No. 6
     "Discrepancy Error": "when ... TPC(A) data only has deviated greatly from TPC(B) and (C) data"; p 1298 No. 4 and No. 9 as for 01 / 02.
     Reading: channel i is bad when ERRi, or SIGi outside [LL, HL], for TP s; it deviates when it differs from the middle of the three by
     more than DEV for DELAY TP s. OUT = the middle of the three good channels (two good: their mean); ABN = fewer than two good channels
     (the 2 out of 3 is lost), then OUT = SIM; DEV E = a channel deviates; ERR = a channel is bad. */
  const mid3 = (a, b, c) => Math.max(Math.min(a, b), Math.min(Math.max(a, b), c));
  MACRO['TMR AI DIAGNOSTICS'] = textMacro(['TP', 'DELAY TP'], (I, notes, st, dt) => {
    const T = mpar(notes, 'TP'),
      D = mpar(notes, 'DELAY TP'),
      S = [I.SIG1, I.SIG2, I.SIG3],
      m = mid3(...S),
      good = [],
      bad = [];
    let dev = 0;
    for (let i = 0; i < 3; i++) {
      const e = b01(I['ERR' + (i + 1)]) || S[i] > I.HL || S[i] < I.LL;
      (onDelay(st, 'b' + i, e, T, dt) ? bad : good).push(S[i]);
      dev |= onDelay(st, 'd' + i, Math.abs(S[i] - m) > I.DEV, D, dt);
    }
    const abn = good.length < 2 ? 1 : 0,
      out = abn ? I.SIM : good.length === 3 ? mid3(...good) : (good[0] + good[1]) / 2;
    return { OUT: out, ABN: abn, 'DEV E': dev, ERR: bad.length ? 1 : 0 };
  });
  /* DUAL INPUT DIAGNOSTICS (LMA110 / LME110, TCA370, TCA371, TCE101) and DUP AI DIAGNOSTICS (LME114, TCE070): two values of one quantity
     (each already through AI DIAG.MD), their abnormal (I-ERR1 / 2 or ERR1 / 2), HL / LL / DEV from SG, S / M, SIM; printed TP:3.0,
     DELAY TP:3.0s x2, K:-0.01, K:2. TC-14-116 p 1298 No. 9 "deviations between signals when inputs ... are multiplexed", No. 4 (range).
     Reading: a value is bad when its abnormal is set, or it is outside [LL, HL] for TP s; DEV E = the two differ by more than DEV for
     DELAY TP s; OUT = the mean of the good values (one good: that one), ABN = none good, then OUT = SIM; ERR1 / ERR2 = each bad, ERR =
     either, I-ERR = either abnormal in, QT1 / QT2 = each good. S, M and the two K are not read (the manual does not say what they do). */
  const dualDiag = (e1, e2) => (I, notes, st, dt) => {
    const T = mpar(notes, 'TP'),
      D = mpar(notes, 'DELAY TP'),
      S = [I.SIG1, I.SIG2],
      ie = [b01(I[e1]), b01(I[e2])],
      bad = S.map((x, i) => (ie[i] ? 1 : onDelay(st, 'b' + i, x > I.HL || x < I.LL, T, dt))),
      good = S.filter((x, i) => !bad[i]),
      dev = onDelay(st, 'd', Math.abs(S[0] - S[1]) > I.DEV, D, dt),
      abn = good.length ? 0 : 1;
    return {
      OUT: abn ? I.SIM : good.reduce((a, b) => a + b, 0) / good.length,
      ABN: abn,
      ERR1: bad[0],
      ERR2: bad[1],
      QT1: 1 - bad[0],
      QT2: 1 - bad[1],
      ERR: bad[0] || bad[1] ? 1 : 0,
      'DEV E': dev,
      'I-ERR': ie[0] || ie[1] ? 1 : 0
    };
  };
  MACRO['DUAL INPUT DIAGNOSTICS'] = textMacro(['TP', 'DELAY TP'], dualDiag('I-ERR1', 'I-ERR2'));
  MACRO['DUP AI DIAGNOSTICS'] = textMacro(['TP', 'DELAY TP'], dualDiag('ERR1', 'ERR2'));
  /* DUP AI DIAGNOSTICSV (LME100 / LME101, TCE143) and PTI ERROR DETECT (LME102, TCE143): the turbine speed of the three pickups.
     TC-14-116 5.3.2.2 "Turbine Speed Input" (pdf pp 93-94, printed 5-58 / 5-59): "three speed pickups ... the Pulse Train Input (PTI)
     modules ... directly count the number of pulses"; its figure: COUNTER(1) of the three cards -> MJL -> "Turbine Speed (2oo3) (For
     Control)" (MJL = majority: the middle of three). The PTI card LYT000A (same manual, CHAPTER 1): "low-speed and high-speed counters".
     DUP AI DIAGNOSTICSV, reading (as TMR AI DIAGNOSTICS):
       speed i (SPA / SPB / SPC) is bad when its counter is abnormal (IOEA / B / C, COUNTER nX ABN) for DELAY-S K s (0.15 s printed), or it
       differs from the middle of the three by more than the H-CNT ABN band (HL 500 / LL -500 rpm printed) for its DELAY TP (5.0 s);
       Y = the middle of the good speeds (two good: their mean, one good: that one; none: the last Y), ABN = fewer than two good (the 2oo3
       is lost); ERR A / B / C = speed bad, QT1 / 2 / 3 = speed good, ERR = any bad; DEV = a speed off the middle by more than the DEV band
       (HL 10 / LL -10 rpm) for DELAY-L K s (5.0 s).
       Not read (the manual does not say how the low counter is used): LCA / LCB / LCC, TCH (HIGH COUNTER EFFECTIVE), L-CNT ABN K 50 rpm.
     PTI ERROR DETECT: out H-CNT MODE (line HIGH COUNTER EFFECTIVE to TCE140 ~ 142, TCE168, and back to TCH) = the turbine speed (in SPEED)
       at or over the counter mode switch speed (in H-L CNT SW SPD, SG A016 "CNT MODE SW SPEED" 3000 rpm) for TD TD s (2.0 s printed); off
       at once under it (derived: the SG name; the card has a low-speed and a high-speed counter). Out PTI SW (line PTI SWITCH, read by no
       sheet) not given; DEV 1 ~ 3, LCK K, DELAY TP, L-CNT / H FLAG / ABN inputs not read (the PTI error check is not in the manual). */
  const dupV = notes => {
    const nt = (notes || []).map(n => String(Array.isArray(n) ? n[2] : n)),
      num = re => nt.filter(z => re.test(z)).map(z => parseFloat(z.split(':').pop())),
      tp = num(/^DELAY TP:/),
      hl = num(/^H-CNT ABN HL:/),
      dv = num(/^DEV HL:/);
    return { tp, hl: hl[0], ll: -(hl[0] || 0), dev: dv[0], s: mpar(notes, 'DELAY-S K'), l: mpar(notes, 'DELAY-L K') };
  };
  MACRO['DUP AI DIAGNOSTICSV'] = textMacro(
    notes => {
      const c = dupV(notes);
      return c.tp.length < 3 || !Number.isFinite(c.hl) || !Number.isFinite(c.dev) || c.s === undefined || c.l === undefined ? ['DELAY TP x3 / H-CNT ABN / DEV / DELAY-S / DELAY-L'] : [];
    },
    (I, notes, st, dt) => {
      const c = st.c || (st.c = dupV(notes)),
        S = [+I.SPA, +I.SPB, +I.SPC],
        E = [I.IOEA, I.IOEB, I.IOEC],
        m = mid3(...S),
        bad = [],
        good = [];
      let dev = 0;
      for (let i = 0; i < 3; i++) {
        const e = onDelay(st, 'e' + i, !!b01(E[i]), c.s, dt) || onDelay(st, 'b' + i, !(S[i] - m <= c.hl && S[i] - m >= -c.hl), c.tp[i], dt);
        bad.push(e ? 1 : 0);
        if (!e) good.push(S[i]);
        dev |= onDelay(st, 'd' + i, Math.abs(S[i] - m) > c.dev, c.l, dt);
      }
      if (good.length) st.y = good.length === 3 ? mid3(...good) : good.reduce((a, b) => a + b, 0) / good.length;
      const y = st.y === undefined ? 0 : st.y;
      return {
        Y: y,
        ABN: good.length < 2 ? 1 : 0,
        'ERR A': bad[0],
        'ERR B': bad[1],
        'ERR C': bad[2],
        QT1: 1 - bad[0],
        QT2: 1 - bad[1],
        QT3: 1 - bad[2],
        ERR: bad.some(b => b) ? 1 : 0,
        DEV: dev ? 1 : 0
      };
    }
  );
  MACRO['PTI ERROR DETECT'] = textMacro(['TD TD'], (I, notes, st, dt) => ({
    'H-CNT MODE': onDelay(st, 'h', +I.SPEED >= +I['H-L CNT SW SPD'], mpar(notes, 'TD TD'), dt) ? 1 : 0
  }));
  /* TMR LVDT DIAGNOSIS (LME124, 8 blocks on TCE121 ~ TCE135): the three LVDT positions of one valve, DEV, ANN SW (ANN ENABLE); printed
     HL:1.0, LL:-1.0, DELAY TP:3.0s once per channel. TC-14-116 p 1298 No. 9. Reading: channel i is in error when SIGi minus the middle
     of the three is outside [LL, HL] (its own group) for DELAY TP s, and the alarm is enabled (ANN SW); OUT = the middle of the good
     channels (two: their mean; none or one good: the middle of the three); ERR = a channel in error, QUAi = channel i good. The DEV pin
     is not read: the limits printed per channel are. */
  MACRO['TMR LVDT DIAGNOSIS'] = textMacro(
    notes => ((notes || []).filter(n => /^HL:/.test(n[2])).length < 3 || (notes || []).filter(n => /^DELAY TP:/.test(n[2])).length < 3 ? ['HL / LL / DELAY TP x3'] : []),
    (I, notes, st, dt) => {
      const nt = (notes || []).slice().sort((a, b) => a[1] - b[1]),
        HL = nt.filter(n => /^HL:/.test(n[2])).map(n => parseFloat(n[2].slice(3))),
        LL = nt.filter(n => /^LL:/.test(n[2])).map(n => parseFloat(n[2].slice(3))),
        DT = nt.filter(n => /^DELAY TP:/.test(n[2])).map(n => parseFloat(n[2].slice(9))),
        S = [I.SIG1, I.SIG2, I.SIG3],
        m = mid3(...S),
        en = I['ANN SW'] === undefined ? 1 : b01(I['ANN SW']),
        e = S.map((x, i) => (en ? onDelay(st, 'e' + i, x - m > HL[i] || x - m < LL[i], DT[i], dt) : ((st['e' + i] = 0), 0))),
        good = S.filter((x, i) => !e[i]);
      return {
        OUT: good.length === 3 ? mid3(...good) : good.length === 2 ? (good[0] + good[1]) / 2 : m,
        ERR: e.some(Boolean) ? 1 : 0,
        ERR1: e[0],
        ERR2: e[1],
        ERR3: e[2],
        QUA1: 1 - e[0],
        QUA2: 1 - e[1],
        QUA3: 1 - e[2]
      };
    }
  );
  /* VALVE DIAGNOSIS (LME122 + LME123, 24 blocks on TCE120 ~ TCE135): POS. (LVDT position), AMP (servo amplifier output), DEMAND (position
     demand), S.POS., ANN SW, POS.OT, ANN.EN; printed in two columns, left (LME122): RATE HL / LL, DEF N, K, H/L HL / LL, DEF TP, HL / LL,
     DEV HL / LL; right (LME123): DEF TP, DEF HL / LL (three times), DEF TP, K. TC-14-116 p 1298 No. 4 (range, rate of change) and the
     servo follow-up. Reading: ABN.O = POS. outside H/L [LL, HL], or its change in one DEF TP outside [RATE LL, RATE HL], DEF N samples
     in a row; ABN.M = POS. - DEMAND outside [DEV LL, DEV HL] for the right DEF TP (5 s), with the alarm enabled (ANN.EN, else ANN SW);
     ABN.A = AMP outside the first right DEF HL / LL (102.4 %); POS. out = POS.; QUA = not ABN.O. The left HL / LL (100 / -5 %), the
     other two right DEF HL / LL pairs, K and S.POS. / POS.OT are not read: which check they belong to is not written. */
  const valveCols = notes => {
    const a = (notes || []).find(n => /^\(LME123\)/.test(n[2]));
    if (!a) return null;
    const by = right =>
      (notes || [])
        .filter(n => /:/.test(n[2]) && (n[0] >= a[0] - 40) === right)
        .sort((p, q) => p[1] - q[1])
        .map(n => [String(n[2]).split(':')[0].trim(), parseFloat(String(n[2]).split(':')[1])]);
    return { L: by(false), R: by(true) };
  };
  const vNeed = notes => {
    const c = valveCols(notes);
    return c && c.L.length >= 11 && c.R.length >= 3 && c.L.every(x => Number.isFinite(x[1])) ? [] : ['the two columns of settings'];
  };
  MACRO['VALVE DIAGNOSIS'] = textMacro(vNeed, (I, notes, st, dt) => {
    const c = st.c || (st.c = valveCols(notes)),
      L = c.L.map(x => x[1]),
      R = c.R.map(x => x[1]),
      x = I['POS.'],
      en = I['ANN.EN'] !== undefined ? b01(I['ANN.EN']) : I['ANN SW'] !== undefined ? b01(I['ANN SW']) : 1;
    st.t = (st.t || 0) + dt;
    if (st.t >= Math.max(L[6], dt) - 1e-9) {
      st.t = 0;
      const d = st.last === undefined ? 0 : x - st.last;
      st.last = x;
      st.n = x > L[4] || x < L[5] || d > L[0] || d < L[1] ? (st.n || 0) + 1 : 0;
    }
    const o = (st.n || 0) >= L[2] ? 1 : 0,
      m = I.DEMAND === undefined ? 0 : onDelay(st, 'm', en && (x - I.DEMAND > L[9] || x - I.DEMAND < L[10]), R[0], dt),
      amp = I.AMP > R[1] || I.AMP < R[2] ? 1 : 0;
    return { 'POS.': x, 'ABN.O': o, 'ABN.A': amp, 'ABN.M': m, QUA: 1 - o };
  });
  /* TRIPLE DETECTOR2 (LME113, TCE060 ~ TCE069): the values of three transmitters of one quantity (each from its TMR AI DIAGNOSTICS) and
     DEV from SG; printed TP:1.0 three times. 2OO3 (LME120): the three abnormal signals. TC-14-116 p 85 "2/3 : contact 2 out of 3
     combination logic"; p 1308 No. 6 (one of three deviates). Reading: TRIPLE DETECTOR2 OUT = the middle of the three, DEV = one of
     them differs from the middle by more than DEV for TP s (its own TP); 2OO3 OUT = two or three of IN1 ~ IN3. */
  MACRO['TRIPLE DETECTOR2'] = textMacro(
    notes => ((notes || []).filter(n => /^TP:/.test(n[2])).length < 3 ? ['TP x3'] : []),
    (I, notes, st, dt) => {
      const T = (notes || []).filter(n => /^TP:/.test(n[2])).map(n => parseFloat(n[2].slice(3))),
        S = [I['IN A'], I['IN B'], I['IN C']],
        m = mid3(...S);
      let d = 0;
      S.forEach((x, i) => (d |= onDelay(st, 'd' + i, Math.abs(x - m) > I.DEV, T[i], dt)));
      return { OUT: m, DEV: d };
    }
  );
  MACRO['2OO3'] = textMacro([], I => ({ OUT: b01(I.IN1) + b01(I.IN2) + b01(I.IN3) >= 2 ? 1 : 0 }));
  /* ---------- macro (MD) meanings FROM A DRAWING ---------- */
  /* MOTOR STANDARD (LMA580A ~ D, 8 blocks on TCA655, TCA680, TCA700, TCE300 ~ TCE310; pins ASRT ASTP TRP EF RUN / STS, OUT or SPS, RUN,
     STP, AUTO, ABN; printed TD:1.0s, TP:3.0s, TP:3.0s, TP:0.5s). Drawn: MHPS TYPICAL LOGIC FOR MOTOR, Interlock Block Diagram 310SC90-794
     Rev 2 sheet 14 ("Turbine Control System (book)" p 30); the pins are its condition hexagons (AUTO START, AUTO STOP, STOP ABSOLUTE,
     MOTOR ELECTRICAL TROUBLE) and the MCC answer, the operator push buttons START / STOP / AUTO / MANUAL / RESET are inside (CRT ports).
     The MCC command flip-flop of sheet 14 is outside the macro on the TCS sheets (TCA655: STS sets and OUT resets FFR 015 = START COMMAND),
     so STS / OUT are the start / stop commands of sheet 14 into that flip-flop.
       AUTO / MANUAL: FF set by PB AUTO, reset (priority) by PB MANUAL; lamp W (AUTO) = AUTO.
       start = AUTO START and AUTO, or PB START and MANUAL; stop = PB STOP and MANUAL, or AUTO STOP and AUTO, or STOP ABSOLUTE.
       start FF: set by start, reset by stop or a trouble; stop FF: set by stop, reset by start or a trouble (trouble = MOTOR ELECTRICAL
       TROUBLE, START FAULT, TRIPPED: the hexagons fed back over circles 1 / 2 "SH-*").
       START FAULT (ANN 2): start FF for DI 3 s (printed TP 3.0 s) and no MCC answer; STOP FAULT (ANN 3): stop FF for DI 3 s (TP 3.0 s)
       and the answer still there; TRIPPED (ANN 4): the answer seen DT 1 s (TD 1.0 s) after the start FF, then lost while the start FF is
       set. MOTOR ELECTRICAL TROUBLE = ANN 1. Each fault is held until PB RESET or the next command of the other kind.
       STS = start FF; OUT / SPS = stop FF or a trouble (the reset OR of the MCC command of sheet 14); RUN = the answer, STP = not the
       answer (R / G lamps); ABN = any of ANN 1 ~ 4.
     Not on sheet 14: the printed TP 0.5 s (not read). */
  const pulseUp = (st, k, x) => {
    const r = x && !st[k];
    st[k] = x;
    return r;
  };
  MACRO['MOTOR STANDARD'] = Object.assign(
    (I, notes, st, dt) => {
      const tms = (notes || []).filter(n => /^TP:/.test(String(n[2]))).map(n => parseFloat(String(n[2]).slice(3))),
        TD = mpar(notes, 'TD'),
        [T1, T2] = tms,
        run = b01(I.RUN);
      if (b01(I['PB MANUAL'])) st.auto = 0;
      else if (b01(I['PB AUTO'])) st.auto = 1;
      const auto = st.auto ? 1 : 0,
        start = (b01(I.ASRT) && auto) || (pulseUp(st, 'pS', b01(I['PB START'])) && !auto),
        stop = (pulseUp(st, 'pT', b01(I['PB STOP'])) && !auto) || (b01(I.ASTP) && auto) || b01(I.TRP),
        reset = b01(I['PB RESET']),
        ef = b01(I.EF);
      const trouble = ef || st.sf || st.tr;
      if (stop || trouble) st.on = 0;
      else if (start) st.on = 1;
      if (start || trouble) st.off = 0;
      if (stop) st.off = 1;
      if (reset || stop) (st.sf = 0), (st.tr = 0);
      if (reset || start) st.stf = 0;
      if (onDelay(st, 'd1', !!st.on, T1, dt) && !run) st.sf = 1;
      if (onDelay(st, 'd2', !!st.off, T2, dt) && run) st.stf = 1;
      if (onDelay(st, 'd0', !!st.on, TD, dt) && run) st.seen = 1;
      if (!st.on) st.seen = 0;
      if (st.seen && !run && st.on) (st.tr = 1), (st.on = 0);
      const stopOut = st.off || ef || st.sf || st.tr ? 1 : 0;
      return {
        STS: st.on ? 1 : 0,
        OUT: stopOut,
        SPS: stopOut,
        RUN: run,
        STP: run ? 0 : 1,
        AUTO: auto,
        ABN: ef || st.sf || st.stf || st.tr ? 1 : 0
      };
    },
    {
      src: 'drawing: IBD 310SC90-794 Rev 2 sheet 14',
      pb: ['START', 'STOP', 'AUTO', 'MANUAL', 'RESET'],
      need: notes => (mpar(notes, 'TD') === undefined ? ['TD'] : []).concat((notes || []).filter(n => /^TP:/.test(String(n[2]))).length < 2 ? ['TP x2'] : [])
    }
  );
  /* TORQUE (SEAL-IN), drawing: IBD 310SC90-794 Rev 2 sheet 16 "TORQUE SEAT (SEAL-IN)", typical logic for motor operated valve (torque
       seating, seal-in type), book p 32. Pins of the TCA sheets (C021): AOP / ACL = AUTO OPEN / CLOSE CONDITION, EF = MOTOR ELECTRICAL
       TROUBLE, LTOP / LTCL = LIMIT SWITCH OF FULL OPEN / CLOSE SIDE, TROP / TRCL = TORQUE SWITCH OF FULL OPEN / CLOSE SIDE.
       AUTO / MANUAL: FF set by PB AUTO, reset by PB MANUAL (R circled = reset first).
       open command = AUTO OPEN CONDITION and AUTO, or PB OPEN and MANUAL; close command the same with CLOSE.
       open stop (OR into the S of the open-stop FF) = EF, OPEN FAULT (circle 6), LIMIT FULL OPEN, TORQUE FULL OPEN and not LIMIT FULL CLOSE;
       the open FF is set by the open command and not the open stop (A with the NOT circle), and is reset by the open stop or by the close
       command (seal-in: the FF holds the MCC OPEN until the stop). Close side the same with circle 7.
       OPEN FAULT (ANN 2): open FF for DI t1 and not LIMIT FULL OPEN; CLOSE FAULT (ANN 3): close FF for DI t2 and not LIMIT FULL CLOSE
       (NOTE t1 / t2 = VALVE OPENING TIME + 5 sec = the printed TP 35.0 s x2). Each fault is held until PB RESET, EF or the other command.
       ANN 1 = EF; ANN 4 = TORQUE SWITCH OPEN = torque full open and not limit full close; ANN 5 = TORQUE SWITCH CLOSE = torque full close
       and not limit full open and not limit full close (A with circle 2).
       OPS / CLS = open / close FF (to MCC); LTOP / LTCL = the limit switches (R (OPEN) / G (CLOSE) lamps); ABN = any of ANN 1 ~ 5.
     Not on sheet 16 (printed beside the TCA blocks, not read): TD 5.0 s x2, R, M, HL, LL, K, the third TP 5.0 s. */
  /* POSITION (SEAL-IN), drawing: IBD 310SC90-794 Rev 2 sheet 18 "POSITION SEAT (SEAL-IN)" (book p 34): the same logic as sheet 16 but the
       valve seats on its LIMIT switches at both ends: the close stops on LIMIT FULL CLOSE, and a TORQUE SWITCH OF FULL CLOSE SIDE before
       LIMIT FULL OPEN is a torque trip (ANN 5) and a stop, like the open side. */
  const sealIn = pos =>
    (I, notes, st, dt) => {
      const [T1, T2] = (notes || []).filter(n => /^TP:/.test(String(n[2]))).map(n => parseFloat(String(n[2]).slice(3))),
        lo = b01(I.LTOP),
        lc = b01(I.LTCL),
        ef = b01(I.EF);
      if (b01(I['PB MANUAL'])) st.auto = 0;
      else if (b01(I['PB AUTO'])) st.auto = 1;
      const auto = st.auto ? 1 : 0,
        oCmd = (b01(I.AOP) && auto) || (pulseUp(st, 'pO', b01(I['PB OPEN'])) && !auto),
        cCmd = (b01(I.ACL) && auto) || (pulseUp(st, 'pC', b01(I['PB CLOSE'])) && !auto),
        tsO = b01(I.TROP) && !lc ? 1 : 0,
        tsC = b01(I.TRCL) && !lo && (pos || !lc) ? 1 : 0;
      if (b01(I['PB RESET']) || ef) (st.of = 0), (st.cf = 0);
      if (cCmd) st.of = 0;
      if (oCmd) st.cf = 0;
      const oStop = ef || st.of || lo || tsO,
        cStop = ef || st.cf || lc || (pos ? tsC : b01(I.TRCL));
      if (oStop || cCmd) st.o = 0;
      else if (oCmd) st.o = 1;
      if (cStop || oCmd) st.c = 0;
      else if (cCmd) st.c = 1;
      if (onDelay(st, 'd1', !!st.o, T1, dt) && !lo) (st.of = 1), (st.o = 0);
      if (onDelay(st, 'd2', !!st.c, T2, dt) && !lc) (st.cf = 1), (st.c = 0);
      return {
        OPS: st.o ? 1 : 0,
        CLS: st.c ? 1 : 0,
        LTOP: lo,
        LTCL: lc,
        AUTO: auto,
        ABN: ef || st.of || st.cf || tsO || tsC ? 1 : 0
      };
    };
  const sealOpt = sheet => ({
      src: 'drawing: IBD 310SC90-794 Rev 2 sheet ' + sheet,
      pb: ['OPEN', 'CLOSE', 'AUTO', 'MANUAL', 'RESET'],
      need: notes => ((notes || []).filter(n => /^TP:/.test(String(n[2]))).length < 2 ? ['TP x2 (t1 / t2)'] : [])
  });
  MACRO['TORQUE (SEAL-IN)'] = Object.assign(sealIn(false), sealOpt(16));
  MACRO['POSITION (SEAL-IN)'] = Object.assign(sealIn(true), sealOpt(18));
  /* TORQUE (INCHING), drawing: IBD 310SC90-794 Rev 2 sheet 20 "TORQUE SEAT (INCHING)", typical logic for motor operated valve (torque
       seating, inching type), book p 36 (sheet 21, book p 37, is its simplified form). No seal-in flip-flop: the valve moves only while
       the command stands.
       open command = AUTO OPEN CONDITION and AUTO, or PB OPEN and MANUAL; close command the same with CLOSE (AUTO FF: S = PB AUTO,
       R = PB MANUAL, reset first).
       TCS side: open = open command and not OR(LIMIT FULL OPEN (the return loop, connector 1), EF, TORQUE FULL OPEN and not LIMIT FULL
       CLOSE, the close command); close = close command and not OR(the open command, EF, TORQUE FULL CLOSE and not LIMIT FULL OPEN).
       MOV side (the part the sheet draws simplified): OPEN out also needs not OR(TORQUE OPEN and not LIMIT FULL CLOSE, EF, LIMIT FULL
       OPEN) and not CLOSE; CLOSE out also needs not OR(EF, TORQUE CLOSE and not LIMIT FULL OPEN) and not OPEN (last scan, the drawn
       cross loop). The close side stops on the torque switch (torque seating), not on the limit switch.
       ANN 1 = EF, ANN 2 = TORQUE FULL OPEN and not LIMIT FULL CLOSE, ANN 3 = TORQUE FULL CLOSE and not LIMIT FULL OPEN and not LIMIT
       FULL CLOSE; ABN = any of them. LTOP / LTCL = the limit switches (lamps G = not LTOP, R = not LTCL).
     Not on sheet 20 (printed beside the TCA block, not read): R, M, HL, LL, K x3 and the POS / POS.S position pins; POS.S is not given. */
  MACRO['TORQUE (INCHING)'] = Object.assign(
    (I, notes, st) => {
      const lo = b01(I.LTOP),
        lc = b01(I.LTCL),
        ef = b01(I.EF),
        tqO = b01(I.TROP) && !lc ? 1 : 0,
        tqC = b01(I.TRCL) && !lo ? 1 : 0;
      if (b01(I['PB MANUAL'])) st.auto = 0;
      else if (b01(I['PB AUTO'])) st.auto = 1;
      const auto = st.auto ? 1 : 0,
        oCmd = (b01(I.AOP) && auto) || (b01(I['PB OPEN']) && !auto),
        cCmd = (b01(I.ACL) && auto) || (b01(I['PB CLOSE']) && !auto),
        a1 = oCmd && !(lo || ef || tqO || cCmd),
        a2 = cCmd && !(oCmd || ef || tqC),
        op = a1 && !(tqO || ef || lo) && !st.c ? 1 : 0,
        cl = a2 && !(ef || tqC) && !st.o ? 1 : 0;
      st.o = op;
      st.c = cl;
      return { OPS: op, CLS: cl, LTOP: lo, LTCL: lc, AUTO: auto, ABN: ef || tqO || (tqC && !lc) ? 1 : 0 };
    },
    { src: 'drawing: IBD 310SC90-794 Rev 2 sheet 20', pb: ['OPEN', 'CLOSE', 'AUTO', 'MANUAL'] }
  );
  /* STEP CONTROL MD, drawing: ATS program 310SC90-795 Rev 2 sheet 8 "ATS CONTROL START UP STEP TRANSITION LOGIC" (book p 132), sheet 9
       (shutdown step, p 133) and sheet 10 "CRITERIA CHECK LOGIC" (p 134: A = start, B = during, D = end criteria). The pins as the TCA520 ..
       TCA528 sheets print them at the block: TMG = STEP n-1 COMPLETED (criteria Dn-1), IN CR = STEP n IN CONDITION OK (criteria An),
       OUT CR = STEP n OUT CONDITION OK (criteria Dn), BYPS = STEP n BYPASS, PERM = STEP n SEL PERMISSIVE, EXE = upper STEP EXECUTING,
       FINISH = upper STEP COMPLETED, EX1 / EX2 = ANOTHER STEP PB SELECT / ANOTHER STEP SELECT (OTHER STEP SELECTED), ORDER = STEP UP ORDER,
       FORCE = STEP n SELECT (the CRT PB STEP n ON); APS A / APS S are wired to OFF(0) on every sheet.
       SELECTED (S/R): set by PB STEP n and the permissive (ATS AUTO MODE), not criteria Dn, not STEP n EXECUTED; reset (R first) by the
         pulse (PO) of OTHER STEP SELECTED, STEP n EXECUTED, or an UPPER STEP EXECUTING.
       EXECUTED (S/R): set by criteria Dn-1 and criteria An and (STEP n SELECTED or UPPER STEP SELECTED = STEP UP ORDER, PAGE 7 OR gate);
         reset by an UPPER STEP EXECUTING. (Until 2026-11-25 PM the ORDER pin set SELECTED; PAGE 7 puts UPPER STEP SELECTED only in the
         EXECUTED set, and a lower step marked SELECTED would pulse OTHER STEP SELECTED and drop the upper step the operator picked.)
       COMPLETED (S/R): set by criteria Dn with the step executed; reset by the upper step's criteria D (upper STEP COMPLETED).
       BYPS (STEP n BYPASS, sheet 11 CRITERIA BYPASS: the criteria taken as ON) stands for criteria An and Dn.
       Outs: SEL = STEP n SELECT(ED), PB ON = selected by the PB, ORDER = STEP IN n
       ORDER (selected or upper step selected, not yet executed: the step whose A criteria are checked, sheet 10 takes both), EXEC = STEP n EXECUTING, FINISH = COMPLETED, START = the scan EXECUTED sets; ORDER1 / EXEC1 / FINI1 = the same to the DCS.
       RESET (right pin) is wired on no sheet: not given. STEP S (line STEP n STEP SELECT, to ANOTHER SELECT MT1 = OTHER STEP SELECTED of
       the other steps) is not given: PAGE 7 selects a step only by its PB, and a step asked by STEP UP ORDER must not drop the upper step
       the operator selected (it would, through OTHER STEP SELECTED); what else selects a step is not drawn. */
  /* ANOTHER SELECT MT1 (LMA535, TCA514), drawing: 310SC90-795 PAGE 7 note *3 "---- indicates the collective signals for OTHER STEP":
       STEP n = SELECT m of any other step m (0 ~ 7). */
  MACRO['ANOTHER SELECT MT1'] = Object.assign(
    I => {
      const o = {};
      for (let n = 0; n < 8; n++) {
        let u = 0;
        for (let m = 0; m < 8; m++) if (m !== n) u = u || b01(I['SELECT' + m]);
        o['STEP' + n] = u;
      }
      return o;
    },
    { src: 'drawing: ATS program 310SC90-795 Rev 2 PAGE 7 note *3' }
  );
  /* (end of ANOTHER SELECT)
     Not on the transition logic (printed DEF timers beside the block, roles not drawn, not read): TD 3.0 s x3, TP 0.2 s, TP 1.0 s. */
  MACRO['STEP CONTROL MD'] = Object.assign(
    (I, notes, st) => {
      const by = b01(I.BYPS),
        an = b01(I['IN CR']) || by,
        dn = b01(I['OUT CR']) || by,
        up = b01(I.EXE),
        other = pulseUp(st, 'pX', b01(I.EX1) || b01(I.EX2)),
        ord = b01(I.ORDER),
        pb = pulseUp(st, 'pF', b01(I.FORCE));
      if (other || st.ex || up) st.sel = 0;
      else if (pb && b01(I.PERM) && !dn && !st.ex) st.sel = 1;
      const was = st.ex;
      if (up) st.ex = 0;
      else if (b01(I.TMG) && an && (st.sel || ord)) (st.ex = 1), (st.sel = 0);
      if (b01(I.FINISH)) st.done = 0;
      else if (dn && st.ex) st.done = 1;
      const sel = st.sel ? 1 : 0,
        ex = st.ex ? 1 : 0,
        done = st.done ? 1 : 0;
      const inOrd = sel || (ord && !ex && !done) ? 1 : 0;
      return {
        SEL: sel,

        'PB ON': sel,
        ORDER: inOrd,
        ORDER1: inOrd,
        EXEC: ex,
        EXEC1: ex,
        FINISH: done,
        FINI1: done,
        START: ex && !was ? 1 : 0
      };
    },
    { src: 'drawing: ATS program 310SC90-795 Rev 2 sheets 8 ~ 11' }
  );
  /* CRI MONT.MD, drawing: ATS program 310SC90-795 Rev 2 sheet 10 "CRITERIA CHECK LOGIC" (book p 134) and sheet 11 "CRITERIA BYPASS
       LOGIC" (p 135), with the criteria table 310SC90-796 (p 159: A = step in, B = step execution, D = step end, per step 0 .. 8). One block
       per criterion: IN = the criterion OK; the K tables printed in the block, IN0 .. IN8 (column A) and EX0 .. EX8 (column B), say in which
       steps it is asked. The steps come by their definitions on the step sheets (TCA520 .. TCA528): STEP IN n ORDER and STEP n EXECUTING.
       STPIN = criterion not OK while a step that asks it at step in is in order (sheet 10: CRITERIA An not satisfied with STEP n SELECTED);
       EX = criterion not OK while a step that asks it in execution is executing (STEP n EXECUTED and CRITERIA Bn not satisfied).
       BYPASS (sheet 11): the CRT PB CRITERIA BYPASS of this criterion while it is not satisfied = INDIVIDUAL CRITERIA ON: STPIN / EX are
       taken as OK and BYPASS is 1, until the criterion is OK or no step asks it.
     The right pins FAIL / USE and the left MB / MB2 / MODE are wired on no sheet: not given / not read. */
  const STEPS = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const criK = (notes, p) =>
    STEPS.map(i => {
      const n = (notes || []).find(n => new RegExp('^' + p + i + ' K:').test(String(n[2])));
      return n ? +String(n[2]).split('K:')[1] : undefined;
    });
  MACRO['CRI MONT.MD'] = Object.assign(
    (I, notes, st) => {
      const kin = st.kin || (st.kin = criK(notes, 'IN')),
        kex = st.kex || (st.kex = criK(notes, 'EX')),
        ok = b01(I.IN),
        askIn = STEPS.some(i => kin[i] && b01(I['DEF STEP IN ' + i + ' ORDER'])),
        askEx = STEPS.some(i => kex[i] && b01(I['DEF STEP ' + i + ' EXECUTING'])),
        bad = !ok && (askIn || askEx);
      if (!bad) st.byp = 0;
      else if (pulseUp(st, 'pB', b01(I['PB BYPASS']))) st.byp = 1;
      if (!bad) st.pB = b01(I['PB BYPASS']);
      return {
        STPIN: !ok && askIn && !st.byp ? 1 : 0,
        EX: !ok && askEx && !st.byp ? 1 : 0,
        BYPASS: st.byp ? 1 : 0
      };
    },
    {
      src: 'drawing: ATS program 310SC90-795 Rev 2 sheets 10 ~ 11, criteria table 310SC90-796 sheet 3',
      pb: ['BYPASS'],
      inBox: true,
      defs: STEPS.flatMap(i => ['STEP IN ' + i + ' ORDER', 'STEP ' + i + ' EXECUTING']),
      need: notes => ['IN', 'EX'].filter(p => criK(notes, p).some(v => v === undefined)).map(p => p + '0 .. ' + p + '8 K')
    }
  );
  /* AIR OPERAT VALVE, drawing: IBD 310SC90-794 Rev 2 sheet 22 "TYPICAL LOGIC FOR AIR OPERATED VALVE" (book p 38). The sheets (TCA605,
       TCA690, TCA711 .. 715, TCA738, TCE365) draw the AUTO / MANUAL and command part outside the block and give it SVE (energize = open)
       and SVD (de-energize = close); the block holds the solenoid FF and the faults of the typical:
       SV FF (S/R, R first): set by SVE, reset by SVD or OPEN FAULT (circle 1 into the reset OR); SVE out = the FF (to the solenoid).
       OPEN FAULT (ANN 1): the FF for DI t1 and not LIMIT FULL OPEN; CLOSE FAULT (ANN 2): not the FF for DI t2 and not LIMIT FULL CLOSE;
       each held until PB RESET or the other command (NOTE t1 = valve opening time + 5 s, t2 = valve closing time + 5 s: the two TP printed
       without a unit beside the block, TP:10.0 / TP:20.0 on TCA711). LTOP / LTCL = the limit switches (R (OPEN) / G (CLOSE) lamps);
       ABN = OPEN or CLOSE FAULT.
     FFP is OFF(0) on every sheet (its role is not drawn). Not on sheet 22 (printed beside the block, not read): R, M, HL, LL, K, TP 5.0 s. */
  const aovT = notes => (notes || []).filter(n => /^TP:\s*[\d.]+$/.test(String(n[2]))).map(n => parseFloat(String(n[2]).slice(3)));
  MACRO['AIR OPERAT VALVE'] = Object.assign(
    (I, notes, st, dt) => {
      const [T1, T2] = st.T || (st.T = aovT(notes)),
        lo = b01(I.LTOP),
        lc = b01(I.LTCL),
        on = b01(I.SVE),
        off = b01(I.SVD);
      if (b01(I.RESET) || off) st.of = 0;
      if (b01(I.RESET) || on) st.cf = 0;
      if (off || st.of) st.sv = 0;
      else if (on) st.sv = 1;
      if (onDelay(st, 'd1', !!st.sv, T1, dt) && !lo) (st.of = 1), (st.sv = 0);
      if (onDelay(st, 'd2', !st.sv, T2, dt) && !lc) st.cf = 1;
      return { SVE: st.sv ? 1 : 0, LTOP: lo, LTCL: lc, ABN: st.of || st.cf ? 1 : 0 };
    },
    {
      src: 'drawing: IBD 310SC90-794 Rev 2 sheet 22',
      need: notes => (aovT(notes).length === 2 ? [] : ['t1 / t2 (two TP without a unit)'])
    }
  );
  /* ---------- ATS step macros (TCA500, TCA515, TCA582 ~ TCA586). Sources: ATS program 310SC90-795 Rev 2 (book pp 125-156; "PAGE n" below
       is the page printed in its title block) and the TCA sheets of 331DM09788 Aug 2017 (the words on the lines into and out of each block).
     START-UP MODE MT1 (LMA531), drawing: 310SC90-795 PAGE 12 "START-UP MODE TYPICAL CALCULATING FUNCTION" (the dashed box = this block):
       per mode, SUB (TEMP. - mode temperature) and CMP ON<0 = TEMP. below that mode temperature; the mode is the lowest one the temperature
       is below (A of its CMP and NOT the CMP of the mode under it); its S/R flip-flop is set by that A with the timing condition (TIMIG) and
       reset by the set of any other mode. The timing condition itself (turbine trip FF, 52L / 52G / sync step PO) is drawn outside the box
       and is on TCA500. Outs as the lines of TCA500 name them: WARMHOT = WARM OR HOT MODE, REQUEST = HEAT SOAK REQUEST (PAGE 19 / 22:
       heat soak is asked in AMBIENT COLD, COLD 1 or COLD 2 mode), HEAT = MEMORIZED TEMP. FOR HEAT SOAK TIMER (PAGE 20 / 22 / 25: "one of
       lower value in A and B is selected at the first steam-in of turbine": TEMP. taken while the mode is taken, held after).
       VERYHOT (line VERY HOT MODE to (-)): no very hot mode on PAGE 12, not given. */
  const MODES = ['AMB.', 'COLD1', 'COLD2', 'WARM', 'HOT'];
  MACRO['START-UP MODE MT1'] = Object.assign(
    (I, notes, st) => {
      const T = +I['TEMP.'] || 0,
        below = MODES.map(m => T - (+I[m] || 0) < 0);
      if (b01(I.TIMIG)) {
        const k = below.findIndex(b => b);
        if (k >= 0) st.m = k;
        st.t = T;
      }
      const o = Object.fromEntries(MODES.map((m, i) => [m, st.m === i ? 1 : 0]));
      return { ...o, WARMHOT: o.WARM || o.HOT ? 1 : 0, REQUEST: o['AMB.'] || o.COLD1 || o.COLD2 ? 1 : 0, HEAT: st.t === undefined ? 0 : st.t };
    },
    { src: 'drawing: ATS program 310SC90-795 Rev 2 PAGE 12 (start-up mode calculating function)' }
  );
  /* STEP UP ORDER MT1 (LMA537), drawing: 310SC90-795 PAGE 7 (sheet 8) note *2 "UPPER STEP means an upper level step than the present
       step": ORDER n = STEP m SELECT of any m > n among the steps 0 ~ 7 (note *1: STEP 7 NORMAL OPERATION has no upper step).
       ORDER n goes to the ORDER pin of the STEP CONTROL MD of step n (UPPER STEP SELECTED of PAGE 7). */
  MACRO['STEP UP ORDER MT1'] = Object.assign(
    I => {
      const o = {};
      for (let n = 0; n < 8; n++) {
        let u = 0;
        for (let m = n + 1; m < 8; m++) u = u || b01(I['SELECT' + m]);
        o['ORDER' + n] = u;
      }
      return o;
    },
    { src: 'drawing: ATS program 310SC90-795 Rev 2 PAGE 7 note *2' }
  );
  /* RUB CHECK CONTROL MT1 (LMA560), TCA582: inside not drawn; the sequence is the TURBINE RUB CHECK step, 310SC90-795 PAGE 17 / 18:
       step executed -> SET ACCELERATION RATE (line 100RPM/M(RUB CHECK) = out ACC.) and SET TARGET SPEED (line 200RPM(ATS) = out TARGET1);
       TURBINE SPEED = 200 RPM (the sheet gives RUB CHECK SPEED SG 190 rpm = in RUBCHK) -> SET CV, ICV CLOSE (line ALL VALVE CLOSED(ATS) =
       out TARGET2, held); TURBINE SPEED < RPM (RUB CHECK COMPLETION SPEED SG 100 rpm = in COMP.) -> criteria D2 (line STEP 2 COMPLETE =
       out COMP). Out SPEED = line TURBINE SPEED<100RPM. Cleared when step 2 is not executing or STEP 2 COMPLETED (in FINISH).
       Not read (role not in the documents): in UPPER (CRI 1.23 LLM UPPER), in ACC. (120RPM/M SELECTED), DEF TP 1.0 s, DEF K 0.0 rpm x2;
       out UPPER (line to nowhere) not given. */
  MACRO['RUB CHECK CONTROL MT1'] = textMacro([], (I, notes, st) => {
    const ex = b01(I.EXECUT) && !b01(I.FINISH),
      sp = +I.SPEED || 0;
    if (!ex) st.cl = 0;
    else if (sp >= (+I.RUBCHK || 0)) st.cl = 1;
    const cl = ex && st.cl ? 1 : 0,
      low = sp < (+I['COMP.'] || 0) ? 1 : 0;
    return { 'ACC.': ex && !cl ? 1 : 0, TARGET1: ex && !cl ? 1 : 0, TARGET2: cl, COMP: cl && low ? 1 : 0, SPEED: low };
  });
  /* ACC.CONTROL MT1 (LMA563A), TCA582: inside not drawn; the sequence is the ACCELERATION step, 310SC90-795 PAGE 19 ~ 22:
       AMBIENT COLD / COLD 1 / COLD 2 (in COLD): HEAT SOAK ON (out SET), SET TARGET SPEED TO 1800 RPM (out TARGET1); at TURBINE SPEED = 1800
       the 1800 rpm heat soak timer runs (out HEAT1 = line 1800RPM HEAT SOAK TIMER START) until 1800RPM HEAT SOAK TIME ELAPSED (in HEAT1);
       QUESTION 1 "HP TURBINE 1ST STAGE INNER WALL METAL TEMP. > 170 C" (in TEMP.1 = CMP of that temperature, 170 degC on the sheet) and
       QUESTION 2 "TURBINE SHELL EXPANSION > 3 mm" (in SHELL = CRI2.1 SHELL EXPANSION OK) are waited for. Then (and at once in WARM / HOT)
       SPEED SET 3600 RPM (out TARGET3) until TURBINE SPEED > 3550 RPM (DEF K 3550.0 rpm printed), then the 3600 rpm heat soak timer runs
       (out HEAT3) until 3600RPM HEAT SOAK TIME ELAPSED (in HEAT3); in the cold modes HEAT SOAK OFF (out RESET = line HEAT SOAK RESET(ATS));
       then criteria D3 (out COMP = line STEP 3 COMPLETE). Out SHELL = line SHELL EXPANSION NOT OK.
       "Speed = 1800 RPM" is read as the speed within the printed deviation band DEF HL -50.0 rpm under the set speed (HEATA SG 1800 rpm):
       speed >= HEATA - 50 (derived: the four printed DEF HL / LL pairs are bands of speed minus target, the -50 rpm edge is the reached one).
       2700 rpm: PAGE 19 ~ 22 draw no 2700 rpm hold (in TEMP.2 is wired ON(1)); out TARGET2 / HEAT2 stay 0 as in the program.
       Not read: in HEAT2, HEATB (3600 SG, the 3600 target is TCE161's own), the other DEF HL / LL, TW 5 s, DEF K 1490 rpm, DEF TD 2.0 s,
       HL 1490 / LL 690 rpm (critical speed band, PAGE 11 is drawn outside this block); out SPEED (line TURBINE SPEED>2950RPM to (-)) not given. */
  MACRO['ACC.CONTROL MT1'] = textMacro([], (I, notes, st) => {
    const ex = b01(I.EXECUT),
      sp = +I.SPEED || 0,
      cold = b01(I.COLD),
      k3 = (notes || []).map(n => String(n[2])).filter(z => /^DEF K:/.test(z)).map(z => parseFloat(z.slice(6))),
      top = k3.length ? Math.max(...k3) : undefined;
    if (!ex) st.ph = 0;
    else if (!st.ph) st.ph = cold ? 1 : 3;
    const o = { TARGET1: 0, TARGET2: 0, TARGET3: 0, HEAT1: 0, HEAT2: 0, HEAT3: 0, SET: 0, COMP: 0, RESET: 0, SHELL: b01(I.SHELL) ? 0 : 1 };
    if (!ex) return o;
    if (st.ph === 1) {
      o.SET = o.TARGET1 = 1;
      if (sp >= (+I.HEATA || 0) - 50) (o.HEAT1 = 1), b01(I.HEAT1) && b01(I['TEMP.1']) && b01(I.SHELL) && (st.ph = 3);
    }
    if (st.ph === 3) {
      o.SET = cold ? 1 : 0;
      o.TARGET3 = 1;
      if (top !== undefined && sp > top) (o.HEAT3 = 1), b01(I.HEAT3) && (st.ph = 4);
    }
    if (st.ph === 4) (o.TARGET3 = 1), (o.RESET = cold ? 1 : 0), (o.COMP = 1);
    return o;
  });
  MACRO['ACC.CONTROL MT1'].need = notes => ((notes || []).some(n => /^DEF K:/.test(String(n[2]))) ? [] : ['DEF K (3550 rpm)']);
  /* ACC.RATE SELECT MT1 (LMA575), TCA584: inside not drawn. 310SC90-795 PAGE 19 / 21 note: "MAXIMUM SELECTABLE ACCELERATION RATE DEPENDS
       ON START UP MODE: AMBIENT 120, COLD 1 120, COLD 2 120, WARM 180, HOT 360 RPM/MIN" while the ACCELERATION step executes (in EXECUT):
       out RATE2 = 120RPM/M(ATS), RATE3 = 180RPM/M(ATS), RATE4 = 360RPM/M(ATS) (lines to TCE160), by in AMB.C / COLD / WARM / HOT.
       A request on in RATE n gives out RATE n (in RATE2 = 100RPM/M(RUB CHECK) of the rub check step; derived: the pins pair by name and
       the rub check reads 120RPM/M SELECTED back from TCE160). HOLD (PAGE 19 HOLD CONTROL ITEM 1 ~ 6, PAGE 11 "HOLD SPEED/LOAD"): the
       hold inputs VACUUM .. BEARING (all SPEED HOLD of TCA768): in the acceleration step it is a speed hold (out SPEED = SPEED HOLD(ATS),
       out RATE1 = 0RPM/M(ATS)), out of it a load hold (out LOAD = LOAD HOLD); derived from PAGE 11 (one hold signal, speed or load).
       Not read: in RATE5 / RATE6 (OFF(0)); out RESET (line RESET(ATS) to (-)) not given. */
  MACRO['ACC.RATE SELECT MT1'] = textMacro([], I => {
    const ex = b01(I.EXECUT),
      hold = ['VACUUM', 'LPEXH.', 'VIB.', 'EXPAN.', 'BEARING'].some(k => b01(I[k])) ? 1 : 0;
    return {
      RATE1: b01(I.RATE1) || (ex && hold) ? 1 : 0,
      RATE2: b01(I.RATE2) || (ex && (b01(I['AMB.C']) || b01(I.COLD))) ? 1 : 0,
      RATE3: b01(I.RATE3) || (ex && b01(I.WARM)) ? 1 : 0,
      RATE4: b01(I.RATE4) || (ex && b01(I.HOT)) ? 1 : 0,
      SPEED: ex && hold ? 1 : 0,
      LOAD: !ex && hold ? 1 : 0
    };
  });
  /* EXCI./SYNC./LOADUPMT1 (LMA566), TCA583: inside not drawn; the sequence is 310SC90-795 PAGE 23 (EXCITATION), 24 / 25 (SYNCH. & INITIAL
       LOAD), 26 / 27 (LOAD UP), with the lines of TCA583:
       out START1 = EXCITATION START: step 4 executing (in EXECUT1) and field breaker 41 not closed (in FIELD) (PAGE 23 then criteria D4).
       out START2 = ASD START: step 5 executing (in EXECUT2), ASD in use (in ASS = CRI 1.46 ASD IN USE) and 52G not closed (in GCB); the
         sheet takes it with HOUSE LOAD to ASD2 (52L) or ASD1 (52G) (PAGE 24).
       out INIT = SET INITIAL LOAD: step 5 executing and 52G closed (CRI 1.48 GCB CLOSED, PAGE 25).
       out START3 = INITIAL LOAD HOLD TIMER START: that and GEN.LOAD>INIT.LOAD (in LOAD, CRI 2.5) (PAGE 25).
       out LOADUP = LOAD UP START (ICV TO CV TRANSFER): step 6 executing (in EXECUT3) (PAGE 26). */
  MACRO['EXCI./SYNC./LOADUPMT1'] = textMacro([], I => {
    const e2 = b01(I.EXECUT2),
      g = b01(I.GCB);
    return {
      START1: b01(I.EXECUT1) && !b01(I.FIELD) ? 1 : 0,
      START2: e2 && b01(I.ASS) && !g ? 1 : 0,
      INIT: e2 && g ? 1 : 0,
      START3: e2 && g && b01(I.LOAD) ? 1 : 0,
      LOADUP: b01(I.EXECUT3) ? 1 : 0
    };
  });
  /* LOAD SET MT1 (LMA569), TCA583A: inside not drawn; the words printed by each SG on the sheet pair the loads with the modes:
       LOAD1 (0.0%L) none; initial load LOAD2 HOT, LOAD3 WARM, LOAD4 COLD1, LOAD5 COLD2, LOAD6 A.COLD, LOAD7 V.HOT; load up load LOAD8 HOT,
       LOAD9 WARM, LOAD10 COLD1, LOAD11 COLD2, LOAD12 A.COLD, LOAD13 V.HOT. 310SC90-795 PAGE 25 *2 "SET INITIAL LOAD AMBIENT COLD 3 %,
       COLD 1 3 %, COLD 2 3 %, WARM 3 %, HOT 5 %" (the same as the SG words). INITIAL / LOADUP = the load of the mode in (HOT .. AMB.C);
       no mode = LOAD1. V.HOT has no mode input on the block (LOAD7 / LOAD13 not used). */
  const LSET = [['HOT', 2, 8], ['WARM', 3, 9], ['COLD1', 4, 10], ['COLD2', 5, 11], ['AMB.C', 6, 12]];
  MACRO['LOAD SET MT1'] = textMacro([], I => {
    const m = LSET.find(([k]) => b01(I[k]));
    return { INITIAL: +I[m ? 'LOAD' + m[1] : 'LOAD1'] || 0, LOADUP: +I[m ? 'LOAD' + m[2] : 'LOAD1'] || 0 };
  });
  /* HEAT SOAK TIMER MT1 (LMA578A), TCA585 / TCA586: inside not drawn; 310SC90-795 PAGE 20 / 22 / 25 (1800 rpm, 3600 rpm heat soak timer,
       initial load hold timer, minutes from the memorized metal temperature = the FG on the sheet into TIME n). Timer n runs while its
       start is on (in MODE n) and is cleared when it goes off: out COMP n (lines ... HEAT SOAK ELAPSED) when it has run TIME n minutes;
       out TIME n = the minutes left (lines LOW / MED / RATED / INITIAL SPD HLD REMAIN), limited to the printed HL 500.0 / LL 0.0;
       out RATED = RATED TIMER ON (timer 3 runs), INIT = INITIAL TIMER ON (timer 4 runs). Not read: DEF TW 1 s, DEF K 0.0 %. */
  MACRO['HEAT SOAK TIMER MT1'] = textMacro([], (I, notes, st, dt) => {
    const o = {};
    for (let n = 1; n <= 4; n++) {
      const on = b01(I['MODE' + n]),
        need = +I['TIME' + n] || 0;
      st['t' + n] = on ? (st['t' + n] || 0) + dt / 60 : 0;
      o['COMP' + n] = on && st['t' + n] >= need ? 1 : 0;
      o['TIME' + n] = clamp(need - st['t' + n], 0, 500);
    }
    o.RATED = b01(I.MODE3);
    o.INIT = b01(I.MODE4);
    return o;
  });
  const numConst = t => {
    const m = /^\s*(?:ON|OFF)?\s*\(?\s*([-+]?\d*\.?\d+)\s*\)?\s*$/.exec(t || '');
    return m ? +m[1] : null;
  };
  /* ---------- macro insides FROM THE HIACS BACKUP (2026-11-26). Source: the controller backup of the TCS (TCE station EHG + MD,
     2018-07-14), decoded on the PC by lane 0 (team-files/tcs-decoded; table /mnt/project-files/tcs-macros.json, user 2026-11-26 7:00 AM
     "Gamitin", values allowed in this repository). The drawings show only the outside of these macros; the backup holds the inside as
     blocks of this same library (K) and their parameters in record order. Each entry: pi = input pins, po = output pin <- inside block,
     b = [op, block number, inputs, values], at = the instances (sheet + macro number) with the values that differ from the first one.
     Inputs: "pin X" = the macro pin X, "REF X" = the controller definition X (INITIAL, ANN RESET ...), "OP n" = inside block, "SW:" = side
     input. Only macros whose every inside block and wire reads plainly are here; the others (DENSO receive pairs with no block number,
     JOINT with no input, PA / SYSREF parameter words, pins the drawing does not draw) stay as they were: phase6-tcs-backup-slice-b.md.
     Record order of the values (lane 0 table, tcs-backup-tables "Order of numbers"): TP / TD / TW seconds, LCK / UCK / G / GRD K, LG T,
     FG x1 y1 x2 y2 ... */
  const BK = 'from the HIACS backup (macro inside)';
  const BKM = {
    LME125: { name: "HMI INDI FOR VALVE", pi: ["POS", "POS1", "POS2", "POS3", "QUA1", "QUAA", "QUA2", "QUAB", "QUA3", "QUAC", "ABN1", "ABNA", "ABN2", "ABNB", "ABN3", "ABNC"], po: {"ABN.O": "OR 033"},
      b: [["FTR", "001", ["pin POS"], []], ["DENSO", "", ["FTR 001"], [3]], ["FTR", "003", ["pin POS1"], []], ["DENSO", "", ["FTR 003"], [3]], ["FTR", "005", ["pin POS2"], []], ["DENSO", "", ["FTR 005"], [3]], ["FTR", "007", ["pin POS3"], []], ["DENSO", "", ["FTR 007"], [3]], ["OR", "009", ["pin QUA1", "pin QUAA"], []], ["BTR", "010", ["OR 009"], []], ["DENSO", "", ["BTR 010"], [3]], ["OR", "017", ["pin QUA2", "pin QUAB"], []], ["A", "011", ["OR 009", "OR 017"], []], ["OR", "021", ["pin QUA3", "pin QUAC"], []], ["A", "016", ["OR 021", "OR 017"], []], ["A", "019", ["OR 009", "OR 021"], []], ["OR", "012", ["A 011", "A 016", "A 019"], []], ["BTR", "013", ["OR 012"], []], ["DENSO", "", ["BTR 013"], [3]], ["BTR", "018", ["OR 017"], []], ["DENSO", "", ["BTR 018"], [3]], ["BTR", "022", ["OR 021"], []], ["DENSO", "", ["BTR 022"], [3]], ["OR", "024", ["pin ABN1", "pin ABNA"], []], ["BTR", "025", ["OR 024"], []], ["DENSO", "", ["BTR 025"], [3]], ["OR", "027", ["pin ABN2", "pin ABNB"], []], ["OR", "030", ["pin ABN3", "pin ABNC"], []], ["OR", "033", ["OR 024", "OR 027", "OR 030"], []], ["BTR", "034", ["OR 033"], []], ["DENSO", "", ["BTR 034"], [3]], ["BTR", "028", ["OR 027"], []], ["DENSO", "", ["BTR 028"], [3]], ["BTR", "031", ["OR 030"], []], ["DENSO", "", ["BTR 031"], [3]]],
      at: {"TCE450 002": {}, "TCE450 004": {}, "TCE450 036": {}, "TCE450 038": {}, "TCE451 002": {}, "TCE451 004": {}, "TCE451 036": {}, "TCE451 038": {}} },
    LME286: { name: "(not named on the drawing)", pi: ["SET"], po: {"OUT": "LG 013"},
      b: [["LG", "013", ["pin SET", "SW:REF SIMULATIONUSE"], [5]]],
      at: {"TCE500 016": {}, "TCE500 023": {"LG 013": [2.5]}, "TCE500 033": {}, "TCE500 036": {}, "TCE502 014": {}, "TCE502 017": {}, "TCE502 020": {}} },
    LME010: { name: "UNT-FG", pi: ["X"], po: {"Y": "ASW 011"},
      b: [["FG", "010", ["pin X"], [89, 46.2, 91, 48, 92, 49.7, 93, 52.2, 94, 55.5, 95, 60.6, 97, 79.618, 100, 105]], ["FG", "012", ["pin X"], [52, 27.88, 60, 29.896, 72, 37, 76, 39, 82, 42.5, 84, 44, 87, 45.2, 89, 46.2]], ["FG", "014", ["pin X"], [-5, -5, 0, 0, 20, 0, 24, 11.4, 25, 12.143, 29, 13.7, 42, 22.33, 52, 27.88]], ["UCK", "009", ["pin X"], [52]], ["ASW", "013", ["FG 012", "FG 014", "SW:UCK 009"], []], ["UCK", "008", ["pin X"], [89]], ["ASW", "011", ["FG 010", "ASW 013", "SW:UCK 008"], []]],
      at: {"TCE212 003": {}, "TCE212 036": {"FG 010": [92, 45.3, 93, 48.07, 94, 51.8, 95, 57.35, 97, 78.9, 100, 105, 102, 105, 103, 105], "FG 012": [60, 25.3, 69, 29.5, 74, 32, 78, 34.35, 84, 38.8, 87, 40.2, 89, 41.35, 92, 45.3], "FG 014": [-5, -5, 0, 0, 20, 0, 29, 4.85, 31, 6.42, 43, 15.2, 51, 20.4, 60, 25.3], "UCK 009": [60], "UCK 008": [92]}} },
    LME105: { name: "TRIPPLE INPUT DIAGNOSTICS", pi: ["IN1", "IN2", "IN3"], po: {"OUT": "OR 002", "DEVE": "FFS 008"},
      b: [["A", "001", ["pin IN1", "pin IN2"], []], ["A", "003", ["pin IN2", "pin IN3"], []], ["A", "004", ["pin IN3", "pin IN1"], []], ["OR", "002", ["A 001", "A 003", "A 004"], []], ["OR", "014", ["pin IN1", "pin IN2", "pin IN3"], []], ["A", "010", ["pin IN1", "pin IN2", "pin IN3"], []], ["NOT", "016", ["A 010"], []], ["A", "015", ["OR 014", "NOT 016"], []], ["TP", "007", ["A 015", "SW:REF INITIAL"], [3]], ["FFS", "008", ["TP 007", "REF ANNRESET"], []]],
      at: {"TCE145 005": {}} },
    LME133: { name: "HEAT SOAK SELECT", pi: ["IP.ST", "SET", "RESET", "SPEED", "TB.T", "52G.C", "HP.ST", "200RPM", "ALL.VC"], po: {"CRT.P": "BTR 001", "SELECT": "FFR 005", "H.S.R": "NOT 010", "CONT": "FFR 013"},
      b: [["BTR", "001", ["REF INITIAL"], []], ["A", "002", ["pin IP.ST", "pin SET"], []], ["NOT", "007", ["pin RESET"], []], ["A", "003", ["A 002", "NOT 007"], []], ["LCK", "018", ["pin SPEED"], [100]], ["A", "004", ["A 003", "LCK 018"], []], ["NOT", "006", ["A 002"], []], ["A", "008", ["pin RESET", "NOT 006"], []], ["TW", "011", ["pin TB.T", "SW:REF INITIAL"], [1]], ["OR", "009", ["A 008", "TW 011", "pin 52G.C", "pin HP.ST"], []], ["FFR", "005", ["A 004", "OR 009"], []], ["NOT", "010", ["FFR 005"], []], ["OR", "014", ["pin 200RPM", "pin ALL.VC"], []], ["NOT", "015", ["OR 014"], []], ["A", "012", ["FFR 005", "NOT 015"], []], ["NOT", "016", ["FFR 005"], []], ["OR", "017", ["NOT 016", "pin ALL.VC"], []], ["FFR", "013", ["A 012", "OR 017"], []]],
      at: {"TCE163 001": {}} },
    LME249: { name: "ACCELERATION RELAY", pi: ["SPEED", "ACC.S", "RATEDS", "OPE.S", "CLOSE", "HPMODE", "BACK.S"], po: {"OPE": "A 006"},
      b: [["GRD", "001", ["pin SPEED", "SW:REF INITIAL"], [1]], ["SUB", "002", ["GRD 001", "pin ACC.S"], []], ["UCK", "003", ["SUB 002"], [0]], ["LCK", "014", ["GRD 001"], [0]], ["G", "018", ["pin RATEDS"], [1.005]], ["SUB", "016", ["pin SPEED", "G 018"], []], ["LCK", "017", ["SUB 016"], [0]], ["OR", "015", ["LCK 014", "LCK 017"], []], ["FFR", "005", ["UCK 003", "OR 015"], []], ["SUB", "008", ["pin SPEED", "pin OPE.S"], []], ["UCK", "009", ["SUB 008"], [0]], ["TP", "024", ["pin CLOSE", "SW:REF INITIAL"], [10]], ["NOT", "012", ["TP 024"], []], ["OR", "013", ["NOT 012", "pin HPMODE"], []], ["A", "010", ["UCK 009", "OR 013"], []], ["SUB", "019", ["pin SPEED", "pin BACK.S"], []], ["UCK", "020", ["SUB 019"], [0]], ["A", "021", ["UCK 020", "TP 024"], []], ["NOT", "023", ["pin HPMODE"], []], ["A", "022", ["A 021", "NOT 023"], []], ["OR", "011", ["A 010", "A 022"], []], ["A", "006", ["FFR 005", "OR 011"], []]],
      at: {"TCE166 001": {}} }
,
    LME244: { name: "VALVE CONTROL MT1", pi: ["CL.POS.", "DEMAND", "TEST", "CLOSE", "WARM", "TO.SPD", "OP.SPD", "TC.SPD", "CL.SPD"], po: {"DEMAND": "RL 023", "D.TEST": "FFS 026"},
      b: [["ASW", "024", ["pin CL.POS.", "pin DEMAND", "SW:pin TEST"], []], ["ASW", "021", ["pin CL.POS.", "ASW 024", "SW:pin CLOSE"], []], ["NOT", "015", ["pin CLOSE"], []], ["OR", "016", ["NOT 015", "pin WARM"], []], ["A", "017", ["OR 016", "REF INITIAL"], []], ["BTR", "033", ["REF FORCEDCLOSE"], []], ["MR", "029", ["pin DEMAND", "RL 023"], [0.1, -0.1]], ["NOT", "030", ["MR 029"], []], ["OR", "034", ["BTR 033", "NOT 030"], []], ["FFS", "026", ["pin TEST", "OR 034"], []], ["ASW", "031", ["pin TO.SPD", "pin OP.SPD", "SW:FFS 026"], []], ["ASW", "032", ["pin TC.SPD", "pin CL.SPD", "SW:pin TEST"], []], ["PA24", "023", ["ASW 031", "ASW 032"], []], ["RL", "023", ["ASW 021", "SW:A 017"], []]],
      /* TCE212 004 / 012: the drawing prints VALVE CONTROL MT1 (LME244) there; the backup has LME244A (pins EXCLSN, M.C.VT more) at TCE212
         074 / 077, one of the wiring differences where the drawing wins */
      at: {"TCE210 003": {}, "TCE211 003": {}, "TCE214 003": {}, "TCE214 013": {}, "TCE212 004": {}, "TCE212 012": {}} },
    /* TURNING GEAR (LME030) at TCE350 010: each DENSO 2 (a button of the operator screen) read by name from lane 0's per-instance table
       (tcs-macros-layout-2026-11-26.md question 3): A 001 = START, A 005 = AUTO, A 008 = MANUAL, A 010 = STOP, each AND CRT AVAILABLE;
       "pb X" = the screen port CRT:<sheet>.<macro>.<X> */
    LME030: { name: "TURNING GEAR", pi: ["EL"], po: {"STS": "A 002", "MANU": "NOT 003", "AUTO": "FFR 006", "STOP": "A 009"}, pb: ["START", "AUTO", "MANUAL", "STOP", "CRT AVAILABLE"],
      b: [["A", "001", ["pb START", "pb CRT AVAILABLE"], []], ["A", "005", ["pb AUTO", "pb CRT AVAILABLE"], []], ["A", "008", ["pb MANUAL", "pb CRT AVAILABLE"], []], ["FFR", "006", ["A 005", "A 008"], []], ["NOT", "003", ["FFR 006"], []], ["A", "002", ["A 001", "NOT 003"], []], ["BTR", "004", ["FFR 006"], []], ["DENSO", "", ["BTR 004"], [3]], ["BTR", "007", ["NOT 003"], []], ["DENSO", "", ["BTR 007"], [3]], ["A", "010", ["pb STOP", "pb CRT AVAILABLE"], []], ["A", "009", ["NOT 003", "A 010"], []], ["BTR", "011", ["pin EL"], []], ["DENSO", "", ["BTR 011"], [3]], ["BTR", "012", ["REF CRTOPEPERM"], []], ["DENSO", "", ["BTR 012"], [3]]],
      at: {"TCE350 010": {}} },
    /* slice D (lane 0 re-export tcs-macros-20261126T021103-0cc9.json + tcs-macros-slice-d-2026-11-26.md): SCREEN <code> "<word>" = a
       button or set value from the operator screen (DENSO 2) -> "pb <word>"; SYS OFF(0) / 0.0 / ON(1) = system constants -> "const".
       TCE196 004 (CRT OPE INC/DEC) is marked "other wiring" in the backup with no detail: not taken. AM M (word 1 / 10, not in the macro
       list): CV WARMING SET has M = 1 (SGW 011) and in L-RATE the I / D inputs are OFF, so M does not act in either */
    LME131: { name: "CV WARMING SET", pi: ["FOPN", "CL.POS", "FCLS", "RATE", "OP.POS"], po: {"SET": "RL 007", "UPPER": "UCK 014", "LOWER": "LCK 016"}, pb: [],
      b: [["FTR", "021", ["pin CL.POS"], []], ["NOT", "008", ["REF TURBINETRIP"], []], ["A", "001", ["pin FCLS", "NOT 008"], []], ["OR", "022", ["A 001", "REF TURBINETRIP"], []], ["ASW", "017", ["FTR 021", "AM 006", "SW:OR 022"], []], ["TD", "004", ["pin FOPN", "SW:REF INITIAL"], [0.03]], ["FTR", "019", ["pin RATE"], []], ["SGW", "011", [], [1]], ["FTR", "020", ["pin OP.POS"], []], ["PA46", "006", ["FTR 019", "SGW 011", "FTR 020", "FTR 021"], []], ["AM", "006", ["pin FOPN", "const 0", "ASW 017", "SW:TD 004"], []], ["UCK", "005", ["RL 007"], [-0.1]], ["A", "002", ["OR 022", "UCK 005"], []], ["PA24", "007", ["FTR 019", "FTR 019"], []], ["RL", "007", ["AM 006", "SW:A 002"], []], ["SUB", "013", ["RL 007", "FTR 020"], []], ["UCK", "014", ["SUB 013"], [-0.01]], ["SUB", "015", ["RL 007", "FTR 021"], []], ["LCK", "016", ["SUB 015"], [0.01]]],
      at: {"TCE155 002": {}, "TCE155 011": {}} },
    LME025: { name: "CRT OPE INC/DEC", pi: ["PERM", "Z", "RATE", "X", "INC", "DEC", "HSS", "LSS"], po: {"MANU": "A 003", "OUT": "ASW 008"}, pb: ["SV-C", "SYNCHRO"],
      b: [["A", "003", ["pb SYNCHRO", "pin PERM"], []], ["BTR", "023", ["pin PERM"], []], ["ASW", "005", ["pb SV-C", "pin Z", "SW:A 003"], []], ["SUB", "006", ["ASW 005", "pin Z"], []], ["LMS", "007", ["SUB 006"], [1, -1]], ["SG", "015", [], [0.03]], ["MLT", "014", ["pin RATE", "SG 015"], []], ["SC", "010", ["MLT 014"], []], ["ASW", "013", ["MLT 014", "pin X", "SW:pin LSS"], []], ["ASW", "011", ["SC 010", "ASW 013", "SW:pin LSS"], []], ["ASW", "008", ["LMS 007", "ASW 011", "SW:A 003"], []], ["FTR", "009", ["pin Z"], []], ["BTR", "019", ["pin LSS"], []], ["BTR", "021", ["pin LSS"], []]],
      /* TCE196 004: the lane 0 read of 2026-11-26 3 PM (phase5-tcs-macros-17) reads it with the same wiring (slice D had "other wiring") */
      at: {"TCE194 001": {}, "TCE196 004": {}} },
    LME026: { name: "CRT OPE INC/DEC", pi: ["PERM", "Z", "RATE", "X", "INC", "DEC", "LIMIT"], po: {"MANU": "A 003", "OUT": "ASW 008"}, pb: ["SV-C", "SYNCHRO"],
      b: [["A", "003", ["pb SYNCHRO", "pin PERM"], []], ["ASW", "005", ["pb SV-C", "pin Z", "SW:A 003"], []], ["SUB", "006", ["ASW 005", "pin Z"], []], ["LMS", "007", ["SUB 006"], [1, -1]], ["SG", "015", [], [0.03]], ["MLT", "014", ["pin RATE", "SG 015"], []], ["SC", "010", ["MLT 014"], []], ["ASW", "013", ["MLT 014", "pin X", "SW:pin INC"], []], ["ASW", "011", ["SC 010", "ASW 013", "SW:pin DEC"], []], ["ASW", "008", ["LMS 007", "ASW 011", "SW:A 003"], []], ["FTR", "009", ["pin Z"], []], ["BTR", "016", ["pin PERM"], []], ["BTR", "017", ["pin LIMIT"], []]],
      at: {"TCE205 006": {}} },
    LME043: { name: "L-RATE", pi: ["PER", "TR", "SW"], po: {"OUT": "FTR 008"}, pb: ["SV-C", "SYNCH"],
      b: [["BTR", "021", ["pin PER"], []], ["BTR", "027", ["const 0"], []], ["BTR", "028", ["const 0"], []], ["A", "024", ["pb SYNCH", "pin SW"], []], ["ASW", "023", ["pb SV-C", "pin TR", "SW:A 024"], []], ["NOT", "026", ["pb SYNCH"], []], ["A", "025", ["pin SW", "NOT 026"], []], ["AM", "007", ["BTR 027", "BTR 028", "ASW 023", "SW:A 025"], [1, 10, 100, 0]], ["FTR", "008", ["AM 007"], []], ["FTR", "029", ["FTR 008"], []]],
      at: {"TCE185 003": {}} },
    /* slice F: macros on two backup files (two pages of one macro; tcs-macros-layout-2026-11-26.md: "JOINT X from LMEy" = the page
       connector, same label, same signal). The second file (LME301, LME243) has its numbers written B<no> so the two pages do not mix;
       a JOINT reads the block named in the other file's jointsOut. Every value matched to the drawing block notes (TCE172 A8, TCE207 A007). */
    LME300: { name: "CHANGE OVER", pi: ["GS","LS","TEST","PERM","GOV","LLM","USE","GM","LM","LIMIT"], po: {"GC":"FFR 027","LC":"FFR 032","LP":"A 021","GP":"A 018","FIN":"FFR 041","LLM":"FFR B014","GOV":"NOT B015","LF":"OR B005","GF":"OR B013"}, pb: ["GOV","CRT AVAILABLE","LLM"],
      b: [["BTR", "001",["REF CRTOPEPERM"], []], ["A", "034",["pb GOV", "pb CRT AVAILABLE"], []], ["OR", "004",["A 034", "pin GS", "pin GS"], []], ["A", "035",["pb LLM", "pb CRT AVAILABLE"], []], ["OR", "007",["A 035", "pin LS", "pin LS"], []], ["NOT", "017",["OR 007"], []], ["NOT", "008",["pin TEST"], []], ["NOT", "009",["REF 52GCLOSE"], []], ["OR", "010",["REF TURBINETRIP", "REF ALLVALVECLOSED", "NOT 009"], []], ["NOT", "011",["OR 010"], []], ["SUB", "012",["pin GOV", "pin LLM"], []], ["UCK", "013",["SUB 012"], [0.1]], ["A", "018",["FFR B014", "NOT 008", "NOT 011", "pin PERM", "UCK 013"], []], ["A", "019",["OR 004", "NOT 017", "A 018"], []], ["NOT", "020",["OR 004"], []], ["LCK", "014",["SUB 012"], [-0.1]], ["A", "021",["NOT B015", "NOT 008", "NOT 011", "pin PERM", "LCK 014"], []], ["A", "022",["OR 007", "NOT 020", "A 021"], []], ["LCK", "015",["SUB 012"], [-0.1]], ["OR", "026",["A 022", "OR 010", "LCK 015"], []], ["FFR", "027",["A 019", "OR 026"], []], ["UCK", "016",["SUB 012"], [0.1]], ["OR", "031",["A 019", "OR 010", "UCK 016"], []], ["FFR", "032",["A 022", "OR 031"], []], ["OR", "033",["FFR 027", "FFR 032"], []], ["SUB", "042",["pin LLM", "pin GOV"], []], ["CPL", "039",["SUB 042"], [5,5]], ["A", "040",["pin USE", "CPL 039"], []], ["NOT", "036",["pin USE"], []], ["A", "037",["NOT 036", "NOT B015"], []], ["OR", "038",["A 037", "OR 010"], []], ["FFR", "041",["A 040", "OR 038"], []], ["TD", "B001",["FFR 032", "SW:REF INITIAL"], [1]], ["NOT", "B002",["FFR 032"], []], ["A", "B003",["TD B001", "NOT B002", "UCK 016"], []], ["A", "B004",["A 035", "pin LM", "pin LM", "pin LIMIT"], []], ["OR", "B005",["A B003", "A B004"], []], ["TD", "B009",["FFR 027", "SW:REF INITIAL"], [1]], ["NOT", "B010",["FFR 027"], []], ["A", "B011",["TD B009", "NOT B010", "LCK 015"], []], ["A", "B012",["A 034", "pin LM", "pin LM", "pin LIMIT"], []], ["OR", "B013",["A B011", "A B012", "OR 010"], []], ["FFR", "B014",["OR B005", "OR B013"], []], ["NOT", "B015",["FFR B014"], []]],
      at: {"TCE172 8":{}} },
    LME242: { name: "HEAT SOAK CONTROL", pi: ["CVHLD","S.SEL1","S.SEL2","CONT","HOLD","S.TARG","OPEN1","DEMAND","RESET","OPEN2"], po: {"ICV":"ASW 027","BIAS.C":"LCK B013","CV":"ADD B011","RESET":"A B015"}, pb: [],
      b: [["A", "002",["REF HEATSOAKCONTROL", "pin CVHLD"], []], ["BTR", "001",["REF HEATSOAKCONTROL"], []], ["TD", "003",["A 002", "SW:REF INITIAL"], [0.05]], ["TP", "005",["A 002", "SW:REF INITIAL"], [1]], ["OR", "028",["pin S.SEL1", "pin S.SEL2"], []], ["NOT", "014",["pin HOLD"], []], ["A", "012",["OR 028", "pin CONT", "NOT 014"], []], ["A", "006",["TP 005", "A 012"], []], ["TP", "007",["A 006", "SW:REF INITIAL"], [180]], ["NOT", "019",["TP 005"], []], ["A", "020",["NOT 019", "LCK B013"], []], ["OR", "018",["REF ALLVALVECLOSED", "A 020"], []], ["FFR", "008",["TP 007", "OR 018"], []], ["TD", "013",["A 012", "SW:REF INITIAL"], [1]], ["A", "030",["pin S.TARG", "TP 007"], []], ["A", "009",["FFR 008", "TD 013", "TP 005", "A 030"], []], ["TW", "010",["A 009", "SW:REF INITIAL"], [0.03]], ["NOT", "011",["TW 010"], []], ["A", "004",["TD 003", "NOT 011"], []], ["A", "029",["FFR 008", "TP 007"], []], ["TD", "015",["TP 007", "SW:REF INITIAL"], [2]], ["OR", "022",["REF HEATSOAKCONTROL", "NOT B014"], []], ["ASW", "025",["pin OPEN1", "const 0", "SW:OR 022"], []], ["NOT", "023",["REF ALLVALVECLOSED"], []], ["ASW", "026",["ASW 025", "const 0", "SW:NOT 023"], []], ["ASW", "027",["HSG B018", "const 0", "SW:NOT 023"], []], ["ASW", "B012",["ADD B005", "pin DEMAND", "SW:TD 015"], []], ["HLD", "B007",["ASW B012", "SW:A 004"], []], ["ASW", "B008",["HLD B007", "const 0", "SW:BTR 001"], []], ["NOT", "B001",["BTR 001"], []], ["A", "B002",["NOT B001", "pin RESET"], []], ["RL", "B009",["ASW B008", "SW:A B002"], [0.03,0.03]], ["LCK", "B013",["RL B009"], [0.1]], ["ADD", "B005",["RL B009", "LSG B022"], []], ["ADD", "B010",["RL B009", "ASW 026"], []], ["ADD", "B011",["ADD B010", "LSG B022"], []], ["SUB", "B017",["pin DEMAND", "RL B009"], []], ["HLD", "B019",["SUB B017", "SW:A 029"], []], ["SUB", "B023",["ADD B011", "ASW 026"], []], ["LSG", "B024",["SUB B023", "const 0", "const 0"], []], ["ASW", "B025",["LSG B024", "const 0", "SW:A 029"], []], ["ADD", "B026",["ASW B025", "pin OPEN2"], []], ["ADD", "B020",["HLD B019", "ADD B026"], []], ["HSG", "B018",["SUB B017", "ADD B020", "ADD B020"], []], ["SUB", "B021",["SUB B017", "HSG B018"], []], ["LSG", "B022",["SUB B021", "HSG B018", "const 0"], []], ["NOT", "B014",["LCK B013"], []], ["NOT", "B016",["A 002"], []], ["A", "B015",["NOT B014", "NOT B016"], []]],
      at: {"TCE207 007":{}} },
    /* Phase 5 (lane 0 read 2026-11-26 12:08 ~ 12:12 PM, tcs-phase5-blocks-2026-11-26.md): DUAL INPUT DIAGNOSTICS (LME110 + LME110A, two
       pages, TCE101 001, the main steam pressure pair) with the new blocks ASWW and MJL; VALVE TEST LME250 (TCE226), LME252 (TCE220), LME253
       (TCE222). ASTA / TSTF are wired in the backup and blank on the 2017 drawing: the drawing wins, they stay open (0), logged.
       The drawing (2017) wins on the timer values (per sheet below): TCE226 TP 024 60 s (backup 90); TCE222 TP 012 200 s (backup 60);
       TCE220 TP 019 (partial) 200 s, TP 018 (full) 300 s (backup 70 / 210; DERIVED: the two drawn TPs matched to partial / full by size,
       as in the backup). TCE220 TD 028 / TP 029 (the TSTF path) are not drawn and stay with the backup values */
    LME110: { name: "DUAL INPUT DIAGNOSTICS", pi: ["SIM","SIG1","I-ERR1","HL","LL","SIG2","I-ERR2","M","DEV","S"], po: {"DEVE":"FFS 036","I-ERR":"OR 018","OUT":"MJL B001","ERR":"OR B021","ERR1":"FFS B006","QT1":"A B004","ERR2":"FFS B010","QT2":"A B008","ABN":"A B011"}, pb: [],
      b: [["DSW", "011",["const 0", "REF SIMULATIONUSE", "SW:REF OUTSIDESIMULATION"], []], ["ASW", "044",["pin SIM", "pin SIG1", "SW:DSW 011"], []], ["FTR", "038",["pin HL"], []], ["FTR", "039",["pin LL"], []], ["PA21", "022",["FTR 038", "FTR 039"], []], ["WCM", "022",["ASW 044"], []], ["A", "023",["WCM 022", "REF ANNENABLE"], []], ["OR", "021",["pin I-ERR1", "A 023"], []], ["ASW", "045",["pin SIM", "pin SIG2", "SW:DSW 011"], []], ["FTR", "040",["pin HL"], []], ["FTR", "041",["pin LL"], []], ["PA21", "026",["FTR 040", "FTR 041"], []], ["WCM", "026",["ASW 045"], []], ["A", "027",["WCM 026", "REF ANNENABLE"], []], ["OR", "025",["pin I-ERR2", "A 027"], []], ["SUB", "028",["ASW 044", "ASW 045"], []], ["ABS", "029",["SUB 028"], []], ["SUB", "030",["ABS 029", "pin M"], []], ["UCK", "031",["SUB 030"], [-0.01]], ["SC", "037",["pin DEV"], []], ["PA21", "034",["pin DEV", "SC 037"], []], ["MR", "034",["ASW 045", "ASW 044"], []], ["TP", "035",["MR 034", "SW:REF INITIAL"], [3]], ["FFS", "036",["TP 035", "REF ANNRESET"], []], ["BTR", "042",["FFS 036"], []], ["OR", "018",["pin I-ERR1", "pin I-ERR2", "pin I-ERR2"], []], ["SGW", "B014", [], [2]], ["ASWW", "B015",["SGW B014", "pin S", "SW:UCK 031"], []], ["FTR", "B013",["pin M"], []], ["PA25", "B001",["ASWW B015", "FTR B013"], []], ["MJL", "B001",["ASW 044", "ASW 045", "const 0", "OR 021", "OR 025", "const 1", "SW:const 0"], []], ["FTR", "B016",["MJL B001"], []], ["OR", "B003",["MJL B001 out2", "OR 021"], []], ["A", "B004",["OR B003", "REF ANNENABLE"], []], ["TP", "B005",["A B004", "SW:REF INITIAL"], [3]], ["FFS", "B006",["TP B005", "REF ANNRESET"], []], ["OR", "B007",["MJL B001 out3", "OR 025"], []], ["A", "B008",["OR B007", "REF ANNENABLE"], []], ["TP", "B009",["A B008", "SW:REF INITIAL"], [3]], ["FFS", "B010",["TP B009", "REF ANNRESET"], []], ["OR", "B021",["BTR 042", "FFS B006", "FFS B010"], []], ["BTR", "B020",["OR B021"], []], ["A", "B018",["A B004", "A B008"], []], ["A", "B011",["FFS B010", "FFS B006"], []]],
      at: {"TCE101 001":{}} },
    LME250: { name: "VALVE TEST", pi: ["TEST.C","PERM","COMP","REST.C","ASTA","OPEN","CLS"], po: {"TEST":"FFR 008"}, blank: ["ASTA"], pb: ["TEST","CRT AVAILABLE","CANCEL"],
      b: [["A", "003",["pb TEST", "pb CRT AVAILABLE"], []], ["A", "011",["pb CANCEL", "pb CRT AVAILABLE"], []], ["NOT", "010",["A 011"], []], ["A", "007",["A 003", "NOT 010", "pin TEST.C", "pin PERM"], []], ["NOT", "017",["pin COMP"], []], ["TP", "023",["pin REST.C", "SW:REF INITIAL"], [5]], ["TP", "024",["FFR 008", "SW:REF INITIAL"], [90]], ["BTR", "031",["pin ASTA"], []], ["OR", "015",["A 011", "NOT 017", "TP 023", "TP 024", "BTR 031"], []], ["FFR", "008",["A 007", "OR 015"], []], ["BTR", "001",["FFR 008"], []], ["BTR", "018",["A 011"], []], ["TD", "019",["BTR 018", "SW:REF INITIAL"], [5]], ["TW", "020",["TD 019", "SW:REF INITIAL"], [3]], ["BTR", "021",["TW 020"], []], ["BTR", "025",["pin OPEN"], []], ["BTR", "027",["pin CLS"], []], ["BTR", "029",["REF CRTOPEPERM"], []]],
      at: {"TCE226 036":{"TP 024":[60]},"TCE226 037":{"TP 024":[60]}} },
    LME252: { name: "VALVE TEST", pi: ["PPERM","COMP","PPOS","ASTA","FPERM","CLOSE","TSTF"], po: {"PTEST":"FFR 006","CNCL":"BTR 012","FTEST":"FFR 015","TSTFE":"OR 033"}, blank: ["ASTA", "TSTF"], pb: ["PARTIAL TEST","CRT AVAILABLE","CANCEL","FULL TEST"],
      b: [["BTR", "001",["REF CRTOPEPERM"], []], ["A", "004",["pb PARTIAL TEST", "pb CRT AVAILABLE"], []], ["A", "005",["A 004", "pin PPERM"], []], ["A", "008",["pb CANCEL", "pb CRT AVAILABLE"], []], ["NOT", "017",["pin COMP"], []], ["TP", "019",["FFR 006", "SW:REF INITIAL"], [70]], ["OR", "026",["A 008", "NOT 017", "TP 019", "pin PPOS", "pin ASTA"], []], ["FFR", "006",["A 005", "OR 026"], []], ["BTR", "002",["FFR 006"], []], ["A", "007",["pb FULL TEST", "pb CRT AVAILABLE"], []], ["A", "014",["A 007", "pin FPERM"], []], ["TP", "018",["FFR 015", "SW:REF INITIAL"], [210]], ["TP", "023",["pin CLOSE", "SW:REF INITIAL"], [5]], ["OR", "016",["A 008", "pin ASTA", "NOT 017", "TP 018", "TP 023"], []], ["FFR", "015",["A 014", "OR 016"], []], ["BTR", "003",["FFR 015"], []], ["TD", "009",["A 008", "SW:REF INITIAL"], [5]], ["TW", "010",["TD 009", "SW:REF INITIAL"], [3]], ["BTR", "011",["TW 010"], []], ["BTR", "012",["TW 010"], []], ["BTR", "034",["pin TSTF"], []], ["OR", "032",["BTR 034", "TW 010"], []], ["TD", "028",["OR 032", "SW:REF INITIAL"], [15]], ["TP", "029",["TD 028", "SW:REF INITIAL"], [10]], ["OR", "033",["TP 029", "pin ASTA"], []], ["A", "024",["pin PPERM", "pin COMP"], []], ["BTR", "020",["A 024"], []], ["BTR", "022",["pin FPERM"], []]],
      at: {"TCE220 002":{"TP 019":[200],"TP 018":[300]},"TCE220 021":{"TP 019":[200],"TP 018":[300]}} },
    LME253: { name: "VALVE TEST(1)", pi: ["PPERM","COMP","PPOS","ASTA"], po: {"PTEST":"FFR 005"}, blank: ["ASTA"], pb: ["PARTIAL TEST","CRT AVAILABLE","CANCEL"],
      b: [["BTR", "001",["REF CRTOPEPERM"], []], ["A", "003",["pb PARTIAL TEST", "pb CRT AVAILABLE"], []], ["A", "004",["A 003", "pin PPERM"], []], ["A", "009",["pb CANCEL", "pb CRT AVAILABLE"], []], ["NOT", "011",["pin COMP"], []], ["TP", "012",["FFR 005", "SW:REF INITIAL"], [60]], ["BTR", "015",["pin ASTA"], []], ["OR", "010",["A 009", "NOT 011", "TP 012", "pin PPOS", "BTR 015"], []], ["FFR", "005",["A 004", "OR 010"], []], ["BTR", "002",["FFR 005"], []], ["TD", "007",["A 009", "SW:REF INITIAL"], [5]], ["TW", "008",["TD 007", "SW:REF INITIAL"], [3]]],
      at: {"TCE222 005":{"TP 012":[200]},"TCE222 027":{"TP 012":[200]}} },
    /* Phase 5 (lane 0 read 2026-11-26 3:03 ~ 3:20 PM, /mnt/project-files/phase5-tcs-macros-17-2026-11-26.md / .json, from the decoded
       HIACS backup): the TCS macro types that ran with no meaning. Every instance of a type is wired the same in the backup. THSC
       INITIAL (LMA626 + LMA626A) and AUXILIARY TYPE 15 (LMA584A + LMA584B) are two pages of one box: the second page has its numbers
       written B<no>, each JOINT is read from the block the first page names. SCREEN <code> "<word>" = pb <word>; SYS 0.0 / OFF(0) /
       ON(1) = const. DISTRIBUTION (LMA627) and THERMAL STRESS (LMA628), with the blocks ML 7 / ML 8, are at the end. Pins the backup wires and the 2017 drawing leaves blank (the "As drawn" lists of TCA775 / TCA780 /
       TCA781): PI CNT IN1, PLU/BUG TEST MT1 TEST1 ~ TEST3 (inputs), PLU/BUG DIAGNOSIS MT1 OP: the drawing wins, they stay open (0). */
    LME271: { name: "SIMCV", pi: ["X1","X2","SW"], po: {"Y1":"I 017","Y2":"LIN 016"}, pb: [],
      b: [["SUB","015",["pin X1","pin X2"],[]], ["LIN","016",["SUB 015"],[20,0]], ["A","018",["REF SIMULATIONUSE","pin SW"],[]], ["I","017",["LIN 016","const 0","const 0","SW:A 018"],[2,100,0]]],
      at: {"TCE501 002":{},"TCE501 007":{},"TCE501 014":{},"TCE501 022":{},"TCE502 002":{},"TCE502 007":{}} },
    LMA710: { name: "PI CNT", pi: ["IN1","PI"], po: {"OUT":"G 006"}, blank: ["IN1"], pb: [],
      b: [["SG","004",[],[1]], ["SG","007",[],[0]], ["TB","009",["SUM 005"],[]], ["OR","001",["const 0","UCK 010"],[]], ["ASW","008",["SG 007","TB 009","SW:OR 001"],[]], ["TW","003",["pin PI","SW:REF INITIAL"],[1]], ["DSW","002",["const 0","TW 003","SW:OR 001"],[]], ["SUM","005",["SG 004","ASW 008","SW:DSW 002"],[1000000,0]], ["G","006",["SUM 005"],[1]], ["UCK","010",["SUM 005"],[999999]]],
      at: {"TCA775 002":{},"TCA775 007":{},"TCA775 012":{}} },
    LMA040: { name: "SET", pi: ["ABN","TR","POS"], po: {"AUT":"BTR 002","MAN":"NOT 005","OUT":"FTR 008","OPN":"UCK 011","CLS":"LCK 015"}, pb: ["AUTO","CRT AVAILABLE","MAN","SYNCH","MV-C"],
      b: [["BTR","019",["REF CRTOPEPERM"],[]], ["A","018",["pb AUTO","pb CRT AVAILABLE"],[]], ["A","003",["pb MAN","pb CRT AVAILABLE"],[]], ["NOT","026",["pb AUTO"],[]], ["A","025",["pb CRT AVAILABLE","NOT 026"],[]], ["OR","024",["A 003","pin ABN","A 025"],[]], ["A","047",["REF INITIAL","pb SYNCH"],[]], ["OR","046",["OR 024","A 047"],[]], ["FFR","023",["A 018","OR 046"],[]], ["BTR","002",["FFR 023"],[]], ["BTR","031",["BTR 002"],[]], ["NOT","005",["FFR 023"],[]], ["BTR","033",["NOT 005"],[]], ["BTR","036",["const 0"],[]], ["BTR","037",["const 0"],[]], ["MR","028",["pb MV-C","pin TR"],[2,-2]], ["NOT","029",["MR 028"],[]], ["A","027",["NOT 005","NOT 029"],[]], ["ASW","020",["pb MV-C","pin TR","SW:A 027"],[]], ["NOT","022",["pb SYNCH"],[]], ["A","021",["REF INITIAL","NOT 022","NOT 005"],[]], ["AM","007",["BTR 036","BTR 037","ASW 020","SW:A 021"],[2.5,10,100,0]], ["FTR","008",["AM 007"],[]], ["FTR","038",["FTR 008"],[]], ["UCK","011",["pin POS"],[99]], ["BTR","041",["UCK 011"],[]], ["FTR","048",["pin POS"],[]], ["LCK","015",["pin POS"],[1]], ["BTR","043",["LCK 015"],[]]],
      at: {"TCA740 030":{},"TCA741 031":{}} },
    LMA043: { name: "SET", pi: ["TR","PV"], po: {"OUT":"FTR 008"}, pb: ["SYNCH","SV-C"],
      b: [["BTR","021",["REF CRTOPEPERM"],[]], ["BTR","027",["const 0"],[]], ["BTR","028",["const 0"],[]], ["A","024",["pb SYNCH","REF INITIAL"],[]], ["ASW","023",["pb SV-C","pin TR","SW:A 024"],[]], ["NOT","026",["pb SYNCH"],[]], ["A","025",["REF INITIAL","NOT 026"],[]], ["AM","007",["BTR 027","BTR 028","ASW 023","SW:A 025"],[2.5,10,100,-100]], ["FTR","008",["AM 007"],[]], ["FTR","029",["FTR 008"],[]], ["FTR","033",["pin PV"],[]]],
      at: {"TCA740 031":{},"TCA741 030":{"AM 007":[2.5,10,100,0]}} },
    LMA291: { name: "PLU/BUG DIAGNOSIS MT1", pi: ["OP1","OP3","OP2","TEST","OP"], po: {"AB1":"FFS 036","AB2":"FFS 044","AB3":"FFS 052","AB":"OR 056"}, blank: ["OP"], pb: [],
      b: [["A","030",["pin OP3","pin OP1"],[]], ["A","040",["pin OP1","pin OP2"],[]], ["A","048",["pin OP2","pin OP3"],[]], ["OR","031",["A 030","A 040","A 048"],[]], ["NOT","032",["OR 031"],[]], ["NOT","057",["pin TEST"],[]], ["A","033",["pin OP1","NOT 032","NOT 057"],[]], ["NOT","038",["pin OP1"],[]], ["A","039",["NOT 038","OR 031","NOT 057"],[]], ["OR","034",["A 033","A 039"],[]], ["TP","035",["OR 034","SW:REF INITIAL"],[15]], ["FFS","036",["TP 035","REF ANNRESET"],[]], ["BTR","037",["FFS 036"],[]], ["A","041",["pin OP2","NOT 032","NOT 057"],[]], ["NOT","045",["pin OP2"],[]], ["A","046",["NOT 045","OR 031","NOT 057"],[]], ["OR","042",["A 041","A 046"],[]], ["TP","043",["OR 042","SW:REF INITIAL"],[15]], ["FFS","044",["TP 043","REF ANNRESET"],[]], ["BTR","047",["FFS 044"],[]], ["A","049",["pin OP3","NOT 032","NOT 057"],[]], ["NOT","054",["pin OP3"],[]], ["A","055",["NOT 054","OR 031","NOT 057"],[]], ["OR","050",["A 049","A 055"],[]], ["TP","051",["OR 050","SW:REF INITIAL"],[15]], ["FFS","052",["TP 051","REF ANNRESET"],[]], ["BTR","053",["FFS 052"],[]], ["OR","056",["FFS 036","FFS 044","FFS 052"],[]], ["TD","058",["pin OP1","SW:REF INITIAL"],[2]], ["TD","059",["pin OP2","SW:REF INITIAL"],[2]], ["TD","060",["pin OP3","SW:REF INITIAL"],[2]], ["TD","061",["pin OP","SW:REF INITIAL"],[2]]],
      at: {"TCA780 004":{},"TCA781 004":{}} },
    LMA290: { name: "PLU/BUG TEST MT1", pi: ["SET","SIG","PERM","TEST1","TEST2","TEST3"], po: {"TEST1":"TD 026","TEST2":"TD 033","TEST3":"TD 040","TEST":"OR 045"}, blank: ["TEST1","TEST2","TEST3"], pb: ["TEST(A)","CRT AVAILABLE","TEST(B)","TEST(C)"],
      b: [["SUB","046",["pin SET","pin SIG"],[]], ["LCK","047",["SUB 046"],[0]], ["A","023",["REF CRTOPEPERM","LCK 047"],[]], ["A","024",["pb TEST(A)","const 1","pb CRT AVAILABLE","pin PERM","LCK 047"],[]], ["A","049",["pin TEST3","pin PERM","LCK 047"],[]], ["OR","048",["A 024","A 049"],[]], ["OR","027",["TD 037","TD 044"],[]], ["NOT","028",["OR 027"],[]], ["A","025",["OR 048","NOT 028"],[]], ["TD","026",["A 025","SW:REF INITIAL"],[2]], ["A","031",["pb TEST(B)","const 1","pb CRT AVAILABLE","pin PERM","LCK 047"],[]], ["A","051",["pin TEST3","pin PERM","LCK 047"],[]], ["OR","050",["A 031","A 051"],[]], ["OR","034",["TD 044","TD 030"],[]], ["NOT","035",["OR 034"],[]], ["A","032",["OR 050","NOT 035"],[]], ["TD","037",["A 032","SW:REF INITIAL"],[5]], ["BTR","029",["TD 026"],[]], ["A","038",["pb TEST(C)","const 1","pb CRT AVAILABLE","pin PERM","LCK 047"],[]], ["A","053",["pin TEST3","pin PERM","LCK 047"],[]], ["OR","052",["A 038","A 053"],[]], ["OR","041",["TD 030","TD 037"],[]], ["NOT","042",["OR 041"],[]], ["A","039",["OR 052","NOT 042"],[]], ["TD","044",["A 039","SW:REF INITIAL"],[5]], ["TD","033",["A 032","SW:REF INITIAL"],[2]], ["BTR","036",["TD 033"],[]], ["TD","030",["A 025","SW:REF INITIAL"],[5]], ["TD","040",["A 039","SW:REF INITIAL"],[2]], ["BTR","043",["TD 040"],[]], ["OR","045",["TD 044","TD 037","TD 030"],[]]],
      at: {"TCA780 033":{},"TCA781 033":{}} },
    LMA626: { name: "THSC INITIAL", pi: ["INT1","INT3","INT2","MTOUT","MTIN","T1IN","T2IN","T3IN","T4IN","T5IN"], po: {"TS":"LG 009","T1":"LG B002","T2":"LG B008","T3":"LG B013","T4":"LG B018","T5":"LG B023"}, pb: [],
      b: [["OR","001",["pin INT1","pin INT3"],[]], ["SUB","007",["pin MTIN","pin MTOUT"],[]], ["G","008",["SUB 007"],[0.5]], ["ADD","005",["pin MTOUT","G 008"],[]], ["ASW","006",["ADD 005","ASW 002","SW:pin INT3"],[]], ["ASW","004",["pin MTIN","ASW 006","SW:pin INT2"],[]], ["ASW","002",["pin MTOUT","ASW 004","SW:pin INT1"],[]], ["LG","003",["ASW 002","SW:REF LAG_ON"],[60]], ["LG","009",["pin MTIN","SW:REF LAG_ON"],[60]], ["SUB","B005",["LG 009","LG 003"],[]], ["G","B006",["SUB B005"],[0.9]], ["ADD","B003",["LG 003","G B006"],[]], ["ASW","B004",["ADD B003","pin T1IN","SW:OR 001"],[]], ["ASW","B001",["pin MTIN","ASW B004","SW:pin INT2"],[]], ["LG","B002",["ASW B001","SW:REF LAG_ON"],[60]], ["G","B011",["SUB B005"],[0.7]], ["ADD","B009",["LG 003","G B011"],[]], ["ASW","B010",["ADD B009","pin T2IN","SW:OR 001"],[]], ["ASW","B007",["pin MTIN","ASW B010","SW:pin INT2"],[]], ["LG","B008",["ASW B007","SW:REF LAG_ON"],[60]], ["G","B016",["SUB B005"],[0.5]], ["ADD","B014",["LG 003","G B016"],[]], ["ASW","B015",["ADD B014","pin T3IN","SW:OR 001"],[]], ["ASW","B012",["pin MTIN","ASW B015","SW:pin INT2"],[]], ["LG","B013",["ASW B012","SW:REF LAG_ON"],[60]], ["G","B021",["SUB B005"],[0.3]], ["ADD","B019",["LG 003","G B021"],[]], ["ASW","B020",["ADD B019","pin T4IN","SW:OR 001"],[]], ["ASW","B017",["pin MTIN","ASW B020","SW:pin INT2"],[]], ["LG","B018",["ASW B017","SW:REF LAG_ON"],[60]], ["G","B026",["SUB B005"],[0.1]], ["ADD","B024",["LG 003","G B026"],[]], ["ASW","B025",["ADD B024","pin T5IN","SW:OR 001"],[]], ["ASW","B022",["pin MTIN","ASW B025","SW:pin INT2"],[]], ["LG","B023",["ASW B022","SW:REF LAG_ON"],[60]]],
      at: {"TCA751 015":{},"TCA755 015":{}} },
    LMA560: { name: "RUB CHECK CONTROL MT1", pi: ["EXECUT","UPPER","ACC.","SPEED","RUBCHK","FINISH","COMP."], po: {"UPPER":"A 015","ACC.":"A 016","TARGET1":"A 019","TARGET2":"A 023","COMP.":"A 028","SPEED":"LCK 030"}, pb: [],
      b: [["A","015",["pin EXECUT","REF STEPINCRITERIAOK"],[]], ["A","016",["pin EXECUT","REF STEPCRITERIAOK","pin UPPER"],[]], ["A","020",["A 016","pin ACC."],[]], ["SUB","024",["pin SPEED","pin RUBCHK"],[]], ["UCK","025",["SUB 024"],[0]], ["A","021",["A 020","UCK 025"],[]], ["OR","026",["pin FINISH","REF ATSOFF"],[]], ["FFR","022",["A 021","OR 026"],[]], ["NOT","017",["FFR 022"],[]], ["TP","018",["NOT 017","SW:REF INITIAL"],[1]], ["NOT","027",["REF ATSOFF"],[]], ["A","019",["TP 018","A 020","NOT 027"],[]], ["A","023",["FFR 022","REF ATSAUTO"],[]], ["SUB","029",["pin SPEED","pin COMP."],[]], ["LCK","030",["SUB 029"],[0]], ["A","028",["FFR 022","REF ALLVALVECLOSED","LCK 030"],[]]],
      at: {"TCA582 002":{}} },
    LMA563A: { name: "ACC.CONTROL MT1", pi: ["COLD","SPEED","HEATA","EXECUT","HEATB","HEAT1","SHELL","TEMP.1","TEMP.2","HEAT3","HEAT2"], po: {"TARGET1":"A 001","HEAT1":"A 003","TARGET3":"A 018","SET":"A 037","HEAT3":"A 023","COMP.":"A 025","SPEED":"MR 024","SHELL":"A 038","RESET":"TD 031","HEAT2":"BTR 041","TARGET2":"BTR 040"}, pb: [],
      b: [["MR","009",["pin SPEED","pin HEATA"],[3000,-50]], ["A","001",["pin COLD","MR 009","pin EXECUT","REF STEPCRITERIAOK"],[]], ["MR","002",["pin SPEED","pin HEATA"],[-50,-3000]], ["A","003",["pin COLD","MR 002","pin EXECUT"],[]], ["MR","004",["pin SPEED","pin HEATB"],[-50,-3000]], ["A","005",["pin COLD","MR 004","pin EXECUT"],[]], ["A","034",["pin HEAT1","pin SHELL","pin TEMP.1","pin TEMP.2"],[]], ["NOT","010",["MR 009"],[]], ["TW","019",["pin EXECUT","SW:REF INITIAL"],[5]], ["A","011",["NOT 010","TW 019"],[]], ["OR","035",["A 034","A 011"],[]], ["WCM","032",["pin SPEED"],[1490,690]], ["NOT","033",["WCM 032"],[]], ["A","008",["OR 035","pin EXECUT","REF STEPCRITERIAOK","pin COLD","NOT 033"],[]], ["NOT","012",["pin COLD"],[]], ["MR","014",["pin SPEED","pin HEATB"],[3000,-50]], ["NOT","015",["MR 014"],[]], ["A","016",["NOT 015","TW 019"],[]], ["OR","036",["NOT 012","A 034","A 016"],[]], ["A","018",["OR 036","pin EXECUT","REF STEPCRITERIAOK"],[]], ["A","037",["pin EXECUT","pin COLD"],[]], ["MR","024",["pin SPEED","REF RATEDSPEED"],[-50,-3600]], ["A","023",["pin EXECUT","MR 024"],[]], ["A","025",["A 023","pin HEAT3"],[]], ["NOT","027",["pin SHELL"],[]], ["UCK","026",["pin SPEED"],[1490]], ["A","038",["NOT 027","UCK 026"],[]], ["UCK","029",["pin SPEED"],[3550]], ["A","030",["A 037","pin HEAT3","UCK 029"],[]], ["TD","031",["A 030","SW:REF INITIAL"],[2]], ["BTR","041",["const 0"],[]], ["BTR","040",["const 0"],[]], ["BTR","039",["pin HEAT2"],[]]],
      at: {"TCA582 017":{}} },
    LME281: { name: "TURBINE SIM.MT2", pi: ["R.S","CV","ICV"], po: {"SPEED":"RL 063","OUT":"LMS 083"}, pb: [],
      b: [["LG","068",["pin CV","SW:REF INITIAL"],[0.3]], ["LIM","074",["pin ICV"],[100,0]], ["LG","075",["LIM 074","SW:REF INITIAL"],[0.3]], ["AW","069",["LG 068","LG 075","const 0"],[1,1,0,0]], ["SG","077",[],[0]], ["ASW","078",["SG 077","const 0","SW:REF 52GCLOSE"],[]], ["G","080",["I 072"],[0.0033]], ["ADD","079",["ASW 078","G 080"],[]], ["SUB","070",["AW 069","ADD 079"],[]], ["G","071",["SUB 070"],[300]], ["ASW","076",["pin R.S","const 0","SW:REF 52GCLOSE"],[]], ["NOT","066",["REF 52GCLOSE"],[]], ["A","067",["NOT 066","REF SIMULATIONUSE"],[]], ["I","072",["G 071","const 0","ASW 076","SW:A 067"],[200,5000,0]], ["ASW","062",["pin R.S","I 072","SW:REF 52GCLOSE"],[]], ["TW","061",["REF 52GCLOSE","SW:REF INITIAL"],[5]], ["RL","063",["ASW 062","SW:TW 061"],[1,1]], ["A","060",["REF 52GCLOSE","REF SIMULATIONUSE"],[]], ["HLD","085",["AW 069","SW:A 060"],[]], ["SUB","081",["AW 069","HLD 085"],[]], ["G","086",["SUB 081"],[1]], ["ASW","082",["G 086","const 0","SW:REF 52GCLOSE"],[]], ["LMS","083",["ASW 082"],[100,0]]],
      at: {"TCE500 004":{}} },
    LME280: { name: "TURBINE SIM.MT1", pi: ["R.S","CV","ICV"], po: {"SPEED":"RL 063","OUT":"LMS 087"}, pb: [],
      b: [["LG","068",["pin CV","SW:REF INITIAL"],[0.3]], ["LIM","077",["pin ICV"],[100,0]], ["MLT","078",["LIM 077","I 074"],[]], ["LG","079",["MLT 078","SW:REF INITIAL"],[0.3]], ["AW","069",["LG 068","LG 079","const 0"],[0.8,0.2,0,0]], ["SG","081",[],[0]], ["ASW","082",["SG 081","const 0","SW:REF 52GCLOSE"],[]], ["G","084",["I 072"],[0.0033]], ["ADD","083",["ASW 082","G 084"],[]], ["SUB","070",["AW 069","ADD 083"],[]], ["G","071",["SUB 070"],[300]], ["ASW","080",["pin R.S","const 0","SW:REF 52GCLOSE"],[]], ["NOT","066",["REF 52GCLOSE"],[]], ["A","067",["NOT 066","REF SIMULATIONUSE"],[]], ["I","072",["G 071","const 0","ASW 080","SW:A 067"],[200,5000,0]], ["ASW","062",["pin R.S","I 072","SW:REF 52GCLOSE"],[]], ["TW","061",["REF 52GCLOSE","SW:REF INITIAL"],[5]], ["RL","063",["ASW 062","SW:TW 061"],[1,1]], ["AW","073",["LG 068","MLT 078","const 0"],[1,-1,0,0]], ["I","074",["AW 073","const 0","const 0","SW:REF SIMULATIONUSE"],[5,100,0]], ["A","060",["REF 52GCLOSE","REF SIMULATIONUSE"],[]], ["HLD","089",["LG 068","SW:A 060"],[]], ["SUB","085",["LG 068","HLD 089"],[]], ["G","090",["SUB 085"],[1]], ["ASW","086",["G 090","const 0","SW:REF 52GCLOSE"],[]], ["LMS","087",["ASW 086"],[100,0]]],
      at: {"TCE500 020":{}} },
    LME285: { name: "CCS SIM.MT1", pi: ["SET","FB","AUTO"], po: {"DEMAND":"RL 017"}, pb: [],
      b: [["ASW","018",["pin SET","pin FB","SW:pin AUTO"],[]], ["A","014",["REF SIMULATIONUSE","pin AUTO"],[]], ["RL","017",["ASW 018","SW:A 014"],[0.2,0.2]]],
      at: {"TCE500 028":{}} },
    LMA584A: { name: "AUXILIARY TYPE 15", pi: ["PIN15","PIN01","PIN02","PIN03","PIN04","PIN05","PIN06","PIN21","PIN13","OPEN.S","CLSE.S","PIN12","PIN14","PIN11","POS"], po: {"OUT1":"FFR 005","OUT2":"FFR 023","OPEN":"OR 026","CLOSE":"OR 028","ABN":"OR B001","E.TR":"BTR B003","TSO":"A B006","PIN61":"NOT B009","PIN62":"NOT B015","TSC":"A B033","PIN64":"DSW B014","PIN65":"DSW B008","PIN66":"AM B023"}, pb: ["AUTO","CRT AVAILABLE","MANUAL","PROGRAM CONTROL","OPEN","CLOSE"],
      b: [["A","003",["pb AUTO","pb CRT AVAILABLE"],[]], ["A","009",["pb MANUAL","pb CRT AVAILABLE"],[]], ["NOT","013",["pin PIN15"],[]], ["OR","011",["A 009","NOT 013"],[]], ["FFR","005",["A 003","OR 011"],[]], ["BTR","001",["FFR 005"],[]], ["NOT","006",["FFR 005"],[]], ["BTR","007",["NOT 006"],[]], ["BTR","012",["NOT 013"],[]], ["BTR","015",["pin PIN15"],[]], ["A","019",["pb CRT AVAILABLE","pb PROGRAM CONTROL"],[]], ["NOT","024",["pin PIN02"],[]], ["A","021",["A 019","pin PIN01","NOT 024"],[]], ["OR","022",["A 021","pin PIN03"],[]], ["NOT","029",["pin PIN01"],[]], ["NOT","031",["pin PIN06"],[]], ["OR","025",["NOT 006","pin PIN02","pin PIN04","NOT 029","pin PIN05","NOT 031"],[]], ["FFR","023",["OR 022","OR 025"],[]], ["BTR","016",["FFR 023"],[]], ["A","037",["pb OPEN","pb CRT AVAILABLE"],[]], ["A","033",["A 037","NOT 006"],[]], ["A","027",["FFR 005","pin PIN04"],[]], ["OR","026",["A 033","A 027"],[]], ["A","038",["pb CLOSE","pb CRT AVAILABLE"],[]], ["A","035",["A 038","NOT 006"],[]], ["A","030",["FFR 005","pin PIN05"],[]], ["OR","028",["A 035","NOT 029","A 030","NOT 031"],[]], ["BTR","036",["REF CRTOPEPERM"],[]], ["BTR","B003",["pin PIN21"],[]], ["A","B030",["pin OPEN.S","pin PIN15"],[]], ["A","B031",["pin CLSE.S","pin PIN15"],[]], ["SG","B025",[],[0]], ["BTR","B021",["REF AUXSIM"],[]], ["AM","B023",["A B030","A B031","SG B025","SW:BTR B021"],[1,10,100,0]], ["LCK","B024",["AM B023"],[1]], ["DSW","B008",["LCK B024","pin PIN12","SW:BTR B021"],[]], ["NOT","B009",["DSW B008"],[]], ["A","B006",["pin PIN13","NOT B009"],[]], ["UCK","B022",["AM B023"],[99]], ["DSW","B014",["UCK B022","pin PIN11","SW:BTR B021"],[]], ["NOT","B015",["DSW B014"],[]], ["A","B033",["pin PIN14","NOT B015"],[]], ["A","B017",["A B033","NOT B009"],[]], ["OR","B001",["BTR B003","A B006","A B017"],[]], ["BTR","B004",["BTR B003"],[]], ["BTR","B007",["A B006"],[]], ["BTR","B018",["A B017"],[]], ["BTR","B010",["DSW B014"],[]], ["BTR","B016",["DSW B008"],[]], ["BTR","B026",["A B030"],[]], ["BTR","B028",["A B031"],[]], ["FTR","B032",["pin POS"],[]]],
      at: {"TCA685 002":{}} },
    LME240: { name: "FILTER", pi: ["IN","BYP"], po: {"OUT":"LG 005"}, pb: [],
      b: [["NOT","006",["pin BYP"],[]], ["SUB","002",["pin IN","LG 005"],[]], ["ABS","003",["SUB 002"],[]], ["LCK","004",["ABS 003"],[0.1]], ["A","001",["NOT 006","LCK 004"],[]], ["LG","005",["pin IN","SW:A 001"],[0.3]]],
      at: {"TCE206 006":{}} },
    LME237: { name: "PRESS COMPENSATE MT1", pi: ["DEV","R-MP","R-HP","MAINPS","R-NLOAD","CRCTG","TEST"], po: {"VALUE":"RL 007"}, pb: [],
      b: [["DIV","002",["pin DEV","pin MAINPS"],[]], ["LMS","009",["pin MAINPS"],[10000,1]], ["DIV","008",["pin R-HP","LMS 009"],[]], ["MLT","003",["DIV 002","DIV 008"],[]], ["MLT","010",["pin R-NLOAD","pin CRCTG"],[]], ["MLT","004",["MLT 003","MLT 010"],[]], ["LMS","011",["MLT 004"],[40,-40]], ["RL","005",["LMS 011","SW:pin TEST"],[999999.9,999999.9]], ["ASW","006",["RL 005","const 0","SW:pin TEST"],[]], ["NOT","001",["pin TEST"],[]], ["RL","007",["ASW 006","SW:NOT 001"],[1,1]]],
      at: {"TCE206 030":{}} },
    /* ML 7 / ML 8 read (lane 0, phase5-ml-dv-blocks-2026-11-26.md): DISTRIBUTION QOUT = 60 (TP-1 - TP) SGB, TOUT = TP + (QOUT - Q+1) / SGA.
       THERMAL STRESS: the backup has it at TCA754 001 only; TCA758 001 (IP) prints the same library number LMA628 on the drawing, so
       it runs the same inside (DERIVED from the printed number) with its own SG A002 ~ A006 and inputs */
    LMA627: { name: "DISTRIBUTION", pi: ["TP-1","TP","SGB","Q+1","SGA"], po: {"QOUT":"ML 003","TOUT":"ADD 004"}, pb: [],
      b: [["SUB","001",["pin TP-1","pin TP"],[]], ["G","002",["SUB 001"],[60]], ["ML","003",["G 002","pin SGB"],[0,0,1,0]], ["SUB","005",["ML 003","pin Q+1"],[]], ["DV","006",["SUB 005","pin SGA"],[0,0,1,0]], ["ADD","004",["pin TP","DV 006"],[]]],
      at: {"TCA752 001":{},"TCA752 004":{},"TCA752 007":{},"TCA753 004":{},"TCA753 007":{},"TCA756 001":{},"TCA756 004":{},"TCA756 007":{},"TCA757 004":{},"TCA757 007":{}} },
    LMA628: { name: "THERMAL STRESS", pi: ["SG1","T1","SG2","T2","SG3","T3","SG4","T4","SG5","T5","TS"], po: {"SURF":"G 005","BORE":"G 008","TB":"G 012"}, pb: [],
      b: [["ML","001",["pin SG1","pin T1"],[0,0,1,0]], ["ML","006",["pin SG2","pin T2"],[0,0,1,0]], ["ML","009",["pin SG3","pin T3"],[0,0,1,0]], ["ML","010",["pin SG4","pin T4"],[0,0,1,0]], ["ML","013",["pin SG5","pin T5"],[0,0,1,0]], ["ADD","002",["ML 001","ML 006","ML 009","ML 010","ML 013"],[]], ["ADD","015",["pin SG1","pin SG2","pin SG3","pin SG4","pin SG5"],[]], ["DV","003",["ADD 002","ADD 015"],[0,0,1,0]], ["SUB","004",["DV 003","pin TS"],[]], ["G","005",["SUB 004"],[3.989]], ["G","014",["pin T5"],[9]], ["SUB","011",["G 014","pin T4"],[]], ["G","012",["SUB 011"],[0.125]], ["SUB","007",["DV 003","G 012"],[]], ["G","008",["SUB 007"],[3.989]]],
      at: {"TCA754 001":{},"TCA758 001":{}} },
    /* TCA782 A002: the 2 out of 3 select MJL (ML 71) drawn as a box with no name (backup record MJL 002, S 0, M 30.0). SW is not drawn
       (the T of INITIAL at its top is not a pin of ML 71); with S = 0 the select does not read SW, so it is OFF here */
    MJL: { name: "MJL (2 OUT OF 3 SELECT, ML 71)", pi: ["X1","X2","X3","E1","E2","E3"], po: {"Y":"MJL 002","Z1":"MJL 002 out2","Z2":"MJL 002 out3","Z3":"MJL 002 out4"}, pb: [],
      b: [["MJL", "002", ["pin X1", "pin X2", "pin X3", "pin E1", "pin E2", "pin E3", "SW:const 0"], [0, 30]]],
      at: {"TCA782 002": {}} },
    /* Phase 6 TCS 2026-11-26: the 16 diagnosis and MT1 macros of the backup (lane 0, /mnt/project-files/phase6-tcs-macro-insides-2026-11-26
       .md / .json: 201 instances on 69 sheets). "SYS 0.0" / "SYS OFF(0)" = const 0, "SYS ON(1)" = const 1. at[instance] gives the
       values that differ (e.g. LMA510 WCM 006 / MR 013 limits) and, under _b, the inside of an instance the backup wires differently
       (LME111 on TCE067 / 068 / 069: channels 1 and 2 read SIG3 / ERR3; LME122 on TCE132 / 134 002 / 006: ASW 022 takes 0.0 for AMP;
       TCE133 / 135 002: also LMS 010 takes 0.0 for DEMAND). Built as the backup holds them, not normalised.
       comp: the companion program file of the same box (same sheet and number, phase6-tcs-companions-2026-11-26.md: LME111A, LMA111A,
       LME123, LMA110A, LME114A, LME101); its blocks are joined in with the number marked "~" (OR ~017 is the companion's OR 017) and
       each "JOINT x from / to" line is the block the other file sends on that joint. */
    LMA510: {"name":"AI DIAG.MD","pi":["SIM","IN","ERR"],"po":{"OUT":"ASW 005","ABN":"FFS 010"},"b":[["DSW","011",["const 0","REF SIMULATIONUSE","SW:REF OUTSIDESIMULATION"],[]],["ASW","002",["pin SIM","pin IN","SW:DSW 011"],[]],["PD","003",["ASW 002","SW:REF INITIAL"],[3,1]],["WCM","006",["ASW 002"],[2.06,-1.15]],["A","007",["WCM 006","REF ANNENABLE"],[]],["PD","016",["ASW 002","SW:REF INITIAL"],[3,1]],["MR","013",["ASW 002","PD 016"],[0.6,-0.6]],["A","014",["MR 013","REF ANNENABLE"],[]],["TP","008",["A 007","SW:REF INITIAL"],[0.18]],["TP","015",["A 014","SW:REF INITIAL"],[0.03]],["OR","009",["TP 008","TP 015","pin ERR"],[]],["FFS","010",["OR 009","REF ANNRESET"],[]],["OR","001",["A 007","A 014","FFS 010"],[]],["HLD","004",["PD 003","SW:OR 001"],[]],["ASW","005",["HLD 004","ASW 002","SW:OR 001"],[]],["FTR","012",["ASW 002"],[]],["OR","029",["A 007","A 014","pin ERR"],[]],["FFS","017",["A 007","REF ANNRESET"],[]],["FFS","018",["A 014","REF ANNRESET"],[]],["SUB","019",["ASW 002","PD 016"],[]],["ABS","020",["SUB 019"],[]],["ASW","022",["const 0","HSG 021","SW:REF ANNRESET"],[]],["HSG","021",["ABS 020","ABS 020","ASW 022"],[]],["ASW","024",["const 0","HSG 023","SW:REF ANNRESET"],[]],["HSG","023",["ASW 002","ASW 002","ASW 024"],[]],["ASW","026",["const 0","LSG 025","SW:REF ANNRESET"],[]],["LSG","025",["ASW 002","ASW 002","ASW 026"],[]]],"at":{"TCA310 002":{},"TCA310 007":{"WCM 006":[18.36,-0.9],"MR 013":[3.6,-3.6]},"TCA310 012":{"WCM 006":[10.2,-0.5],"MR 013":[2,-2]},"TCA311 007":{"WCM 006":[51,-2.5],"MR 013":[10,-10]},"TCA311 012":{"WCM 006":[51,-2.5],"MR 013":[10,-10]},"TCA311 017":{"WCM 006":[51,-2.5],"MR 013":[10,-10]},"TCA312 002":{},"TCA312 007":{"WCM 006":[18.36,-0.9],"MR 013":[3.6,-3.6]},"TCA312 012":{"WCM 006":[10.2,-0.5],"MR 013":[2,-2]},"TCA312 017":{"WCM 006":[200,-200],"MR 013":[120,-120]},"TCA313 002":{"WCM 006":[100,-100],"MR 013":[40,-40]},"TCA314 002":{"WCM 006":[122.4,-6],"MR 013":[24,-24]},"TCA314 007":{"WCM 006":[18.36,-0.9],"MR 013":[3.6,-3.6]},"TCA314 012":{"WCM 006":[999,-999],"MR 013":[999,-999]},"TCA314 017":{"WCM 006":[999,-999],"MR 013":[999,-999]},"TCA316 002":{"WCM 006":[999,-999],"MR 013":[999,-999]},"TCA316 007":{"WCM 006":[15.3,-0.75],"MR 013":[3,-3]},"TCA316 030":{"WCM 006":[306,-15],"MR 013":[60,-60]},"TCA318 002":{"WCM 006":[14.5,-12.25],"MR 013":[5,-5]},"TCA318 007":{"WCM 006":[51,-2.5],"MR 013":[10,-10]},"TCA318 012":{"WCM 006":[0.51,-0.1],"MR 013":[0.1,-0.1]},"TCA320 002":{"WCM 006":[249.6,-264],"MR 013":[96,-96]},"TCA320 007":{"WCM 006":[1.05,-1.05],"MR 013":[10,-10]},"TCA320 012":{"WCM 006":[999,-999],"MR 013":[999,-999]},"TCA320 017":{"WCM 006":[999,-999],"MR 013":[999,-999]},"TCA321 002":{"WCM 006":[65.2,54.5],"MR 013":[10,-10]},"TCA322 002":{"WCM 006":[102,-5],"MR 013":[20,-20]},"TCA322 007":{"WCM 006":[102,-5],"MR 013":[20,-20]},"TCA322 012":{"WCM 006":[102,-5],"MR 013":[20,-20]},"TCA322 017":{"WCM 006":[102,-5],"MR 013":[20,-20],"TP 015":[0.1]},"TCA353 017":{"WCM 006":[999,-999],"MR 013":[999,-999]},"TCA354 002":{"WCM 006":[153,-7.5],"MR 013":[30,-30]},"TCA354 007":{"WCM 006":[153,-7.5],"MR 013":[30,-30]},"TCA354 012":{"WCM 006":[153,-7.5],"MR 013":[30,-30]},"TCA354 017":{"WCM 006":[153,-7.5],"MR 013":[30,-30]},"TCA355 012":{"WCM 006":[510,-25],"MR 013":[100,-100]},"TCA355 017":{"WCM 006":[510,-25],"MR 013":[100,-100]},"TCA356 002":{"WCM 006":[714,-35],"MR 013":[140,-140]},"TCA356 007":{"WCM 006":[714,-35],"MR 013":[140,-140]},"TCA356 012":{"WCM 006":[714,-35],"MR 013":[140,-140]},"TCA356 017":{"WCM 006":[408,-20],"MR 013":[80,-80]},"TCA357 002":{"WCM 006":[714,-35],"MR 013":[140,-140]},"TCA357 007":{"WCM 006":[510,-25],"MR 013":[100,-100]},"TCA357 012":{"WCM 006":[153,-7.5],"MR 013":[30,-30]},"TCA357 017":{"WCM 006":[100,-100],"MR 013":[100,-100]},"TCA358 002":{"WCM 006":[714,-35],"MR 013":[140,-140]},"TCA358 007":{"WCM 006":[510,-25],"MR 013":[100,-100]},"TCA358 012":{"WCM 006":[510,-25],"MR 013":[100,-100]},"TCA358 017":{"WCM 006":[153,-7.5],"MR 013":[30,-30]},"TCA359 002":{"WCM 006":[153,-7.5],"MR 013":[30,-30]},"TCA359 007":{"WCM 006":[714,-35],"MR 013":[140,-140]},"TCA359 012":{"WCM 006":[714,-35],"MR 013":[140,-140]},"TCA359 017":{"WCM 006":[510,-25],"MR 013":[100,-100]},"TCA360 002":{"WCM 006":[714,-35],"MR 013":[140,-140]},"TCA360 007":{"WCM 006":[306,-15],"MR 013":[60,-60]},"TCA360 012":{"WCM 006":[306,-15],"MR 013":[60,-60]},"TCA361 002":{"WCM 006":[714,-35],"MR 013":[140,-140]},"TCA361 007":{"WCM 006":[510,-25],"MR 013":[100,-100]},"TCA361 012":{"WCM 006":[153,-7.5],"MR 013":[30,-30]},"TCA361 017":{"WCM 006":[100,-100],"MR 013":[100,-100]},"TCA362 002":{"WCM 006":[714,-35],"MR 013":[140,-140]},"TCA362 007":{"WCM 006":[510,-25],"MR 013":[100,-100]},"TCA362 012":{"WCM 006":[510,-25],"MR 013":[100,-100]},"TCA362 017":{"WCM 006":[153,-7.5],"MR 013":[30,-30]},"TCA363 002":{"WCM 006":[153,-7.5],"MR 013":[30,-30]},"TCA363 007":{"WCM 006":[714,-35],"MR 013":[140,-140]},"TCA363 012":{"WCM 006":[714,-35],"MR 013":[140,-140]},"TCA363 017":{"WCM 006":[510,-25],"MR 013":[100,-100]},"TCA364 002":{"WCM 006":[714,-35],"MR 013":[140,-140]},"TCA364 007":{"WCM 006":[153,-7.5],"MR 013":[30,-30]},"TCA364 012":{"WCM 006":[153,-7.5],"MR 013":[30,-30]},"TCA365 002":{"WCM 006":[714,-35],"MR 013":[140,-140]},"TCA365 007":{"WCM 006":[510,-25],"MR 013":[100,-100]},"TCA365 012":{"WCM 006":[153,-4.5],"MR 013":[30,-30]},"TCA365 017":{"WCM 006":[100,-100],"MR 013":[100,-100]},"TCA440 002":{"WCM 006":[102,-5],"MR 013":[20,-20]},"TCA440 007":{"WCM 006":[102,-5],"MR 013":[20,-20]},"TCA440 012":{"WCM 006":[102,-5],"MR 013":[20,-20]},"TCA440 017":{"WCM 006":[122.4,-6],"MR 013":[24,-24]},"TCA441 002":{"WCM 006":[122.4,-6],"MR 013":[24,-24]},"TCA441 007":{"WCM 006":[122.4,-6],"MR 013":[24,-24]},"TCA441 012":{"WCM 006":[122.4,-6],"MR 013":[24,-24]},"TCA441 017":{"WCM 006":[122.4,-6],"MR 013":[24,-24]},"TCA442 002":{"WCM 006":[204,-10],"MR 013":[40,-40]},"TCA442 007":{"WCM 006":[204,-10],"MR 013":[40,-40]},"TCA442 012":{"WCM 006":[204,-10],"MR 013":[40,-40]},"TCA442 017":{"WCM 006":[204,-10],"MR 013":[40,-40]},"TCA443 002":{"WCM 006":[153,-7.5],"MR 013":[30,-30]},"TCA443 007":{"WCM 006":[122.4,-6],"MR 013":[24,-24]}}},
    LME510: {"name":"AI DIAG.MD","pi":["SIM","IN","ERR"],"po":{"OUT":"ASW 005","ABN":"FFS 010"},"b":[["DSW","011",["const 0","REF SIMULATIONUSE","SW:REF OUTSIDESIMULATION"],[]],["ASW","002",["pin SIM","pin IN","SW:DSW 011"],[]],["PD","003",["ASW 002","SW:REF INITIAL"],[3,1]],["WCM","006",["ASW 002"],[10.2,-0.5]],["A","007",["WCM 006","REF ANNENABLE"],[]],["PD","016",["ASW 002","SW:REF INITIAL"],[3,1]],["MR","013",["ASW 002","PD 016"],[2,-2]],["A","014",["MR 013","REF ANNENABLE"],[]],["TP","008",["A 007","SW:REF INITIAL"],[0.18]],["TP","015",["A 014","SW:REF INITIAL"],[0.03]],["OR","009",["TP 008","TP 015","pin ERR"],[]],["FFS","010",["OR 009","REF ANNRESET"],[]],["OR","001",["A 007","A 014","FFS 010"],[]],["HLD","004",["PD 003","SW:OR 001"],[]],["ASW","005",["HLD 004","ASW 002","SW:OR 001"],[]],["FTR","012",["ASW 002"],[]],["OR","029",["A 007","A 014","pin ERR"],[]],["FFS","017",["A 007","REF ANNRESET"],[]],["FFS","018",["A 014","REF ANNRESET"],[]],["SUB","019",["ASW 002","PD 016"],[]],["ABS","020",["SUB 019"],[]],["ASW","022",["const 0","HSG 021","SW:REF ANNRESET"],[]],["HSG","021",["ABS 020","ABS 020","ASW 022"],[]],["ASW","024",["const 0","HSG 023","SW:REF ANNRESET"],[]],["HSG","023",["ASW 002","ASW 002","ASW 024"],[]],["ASW","026",["const 0","LSG 025","SW:REF ANNRESET"],[]],["LSG","025",["ASW 002","ASW 002","ASW 026"],[]]],"at":{"TCE102 002":{},"TCE102 007":{"WCM 006":[255,-12.5],"MR 013":[50,-50]},"TCE102 012":{"WCM 006":[51,-2.5],"MR 013":[10,-10]},"TCE103 002":{"WCM 006":[204,-10],"MR 013":[40,-40]},"TCE104 002":{},"TCE104 007":{"WCM 006":[255,-12.5],"MR 013":[50,-50]},"TCE104 012":{"WCM 006":[5.1,-0.25],"MR 013":[1,-1]}}},
    LME111: {"name":"TMR AI DIAGNOSTICS","pi":["SIM","SIG1","ERR1","HL","LL","SIG2","ERR2","SIG3","ERR3","DEV"],"po":{"DEVE":"OR 017","OUT":"LS ~024","ERR":"OR ~002","ABN":"OR ~017"},"b":[["DSW","034",["const 0","REF SIMULATIONUSE","SW:REF OUTSIDESIMULATION"],[]],["ASW","002",["pin SIM","pin SIG1","SW:DSW 034"],[]],["FTR","026",["pin HL"],[]],["FTR","027",["pin LL"],[]],["PA21","028",["FTR 026","FTR 027"],[]],["WCM","028",["ASW 002"],[]],["A","005",["WCM 028","REF ANNENABLE"],[]],["OR","003",["pin ERR1","A 005"],[]],["ASW","006",["pin SIM","pin SIG2","SW:DSW 034"],[]],["PA21","029",["FTR 026","FTR 027"],[]],["WCM","029",["ASW 006"],[]],["A","009",["WCM 029","REF ANNENABLE"],[]],["OR","007",["pin ERR2","A 009"],[]],["ASW","010",["pin SIM","pin SIG3","SW:DSW 034"],[]],["PA21","030",["FTR 026","FTR 027"],[]],["WCM","030",["ASW 010"],[]],["A","013",["WCM 030","REF ANNENABLE"],[]],["OR","011",["pin ERR3","A 013"],[]],["SC","025",["pin DEV"],[]],["PA21","031",["pin DEV","SC 025"],[]],["MR","031",["ASW 002","ASW 006"],[]],["TP","015",["MR 031","SW:REF INITIAL"],[1]],["FFS","016",["TP 015","REF ANNRESET"],[]],["PA21","032",["pin DEV","SC 025"],[]],["MR","032",["ASW 002","ASW 010"],[]],["TP","020",["MR 032","SW:REF INITIAL"],[1]],["FFS","021",["TP 020","REF ANNRESET"],[]],["PA21","033",["pin DEV","SC 025"],[]],["MR","033",["ASW 006","ASW 010"],[]],["TP","023",["MR 033","SW:REF INITIAL"],[1]],["FFS","024",["TP 023","REF ANNRESET"],[]],["OR","017",["FFS 016","FFS 021","FFS 024"],[]],["HS","~023",["ASW 002","ASW 006","ASW 006"],[]],["HS","~025",["ASW 002","ASW 002","ASW 010"],[]],["HS","~026",["ASW 006","ASW 010","ASW 010"],[]],["LS","~024",["HS ~023","HS ~025","HS ~026"],[]],["FTR","~027",["LS ~024"],[]],["A","~004",["OR 003","REF ANNENABLE"],[]],["TP","~005",["A ~004","SW:REF INITIAL"],[3]],["FFS","~006",["TP ~005","REF ANNRESET"],[]],["A","~008",["OR 007","REF ANNENABLE"],[]],["TP","~009",["A ~008","SW:REF INITIAL"],[3]],["FFS","~010",["TP ~009","REF ANNRESET"],[]],["A","~012",["OR 011","REF ANNENABLE"],[]],["TP","~013",["A ~012","SW:REF INITIAL"],[3]],["FFS","~014",["TP ~013","REF ANNRESET"],[]],["OR","~002",["FFS ~006","FFS ~010","FFS ~014"],[]],["BTR","~034",["OR ~002"],[]],["A","~029",["A ~004","A ~008"],[]],["A","~032",["A ~004","A ~012"],[]],["A","~033",["A ~008","A ~012"],[]],["OR","~030",["A ~029","A ~032","A ~033"],[]],["A","~015",["FFS ~006","FFS ~010"],[]],["A","~016",["FFS ~006","FFS ~014"],[]],["A","~018",["FFS ~010","FFS ~014"],[]],["OR","~017",["A ~015","A ~016","A ~018"],[]]],"at":{"TCE060 002":{},"TCE060 020":{},"TCE060 030":{},"TCE061 002":{},"TCE061 020":{},"TCE061 030":{},"TCE062 002":{},"TCE062 020":{},"TCE062 030":{},"TCE063 002":{},"TCE063 020":{},"TCE063 030":{},"TCE064 002":{},"TCE064 020":{},"TCE064 030":{},"TCE065 002":{},"TCE065 020":{},"TCE065 030":{},"TCE066 002":{},"TCE066 020":{},"TCE066 030":{},"TCE067 002":{"_b":[["DSW","034",["const 0","REF SIMULATIONUSE","SW:REF OUTSIDESIMULATION"],[]],["ASW","002",["pin SIM","pin SIG3","SW:DSW 034"],[]],["FTR","026",["pin HL"],[]],["FTR","027",["pin LL"],[]],["PA21","028",["FTR 026","FTR 027"],[]],["WCM","028",["ASW 002"],[]],["A","005",["WCM 028","REF ANNENABLE"],[]],["OR","003",["pin ERR3","A 005"],[]],["ASW","006",["pin SIM","pin SIG3","SW:DSW 034"],[]],["PA21","029",["FTR 026","FTR 027"],[]],["WCM","029",["ASW 006"],[]],["A","009",["WCM 029","REF ANNENABLE"],[]],["OR","007",["pin ERR3","A 009"],[]],["ASW","010",["pin SIM","pin SIG3","SW:DSW 034"],[]],["PA21","030",["FTR 026","FTR 027"],[]],["WCM","030",["ASW 010"],[]],["A","013",["WCM 030","REF ANNENABLE"],[]],["OR","011",["pin ERR3","A 013"],[]],["SC","025",["pin DEV"],[]],["PA21","031",["pin DEV","SC 025"],[]],["MR","031",["ASW 002","ASW 006"],[]],["TP","015",["MR 031","SW:REF INITIAL"],[1]],["FFS","016",["TP 015","REF ANNRESET"],[]],["PA21","032",["pin DEV","SC 025"],[]],["MR","032",["ASW 002","ASW 010"],[]],["TP","020",["MR 032","SW:REF INITIAL"],[1]],["FFS","021",["TP 020","REF ANNRESET"],[]],["PA21","033",["pin DEV","SC 025"],[]],["MR","033",["ASW 006","ASW 010"],[]],["TP","023",["MR 033","SW:REF INITIAL"],[1]],["FFS","024",["TP 023","REF ANNRESET"],[]],["OR","017",["FFS 016","FFS 021","FFS 024"],[]],["HS","~023",["ASW 002","ASW 006","ASW 006"],[]],["HS","~025",["ASW 002","ASW 002","ASW 010"],[]],["HS","~026",["ASW 006","ASW 010","ASW 010"],[]],["LS","~024",["HS ~023","HS ~025","HS ~026"],[]],["FTR","~027",["LS ~024"],[]],["A","~004",["OR 003","REF ANNENABLE"],[]],["TP","~005",["A ~004","SW:REF INITIAL"],[3]],["FFS","~006",["TP ~005","REF ANNRESET"],[]],["A","~008",["OR 007","REF ANNENABLE"],[]],["TP","~009",["A ~008","SW:REF INITIAL"],[3]],["FFS","~010",["TP ~009","REF ANNRESET"],[]],["A","~012",["OR 011","REF ANNENABLE"],[]],["TP","~013",["A ~012","SW:REF INITIAL"],[3]],["FFS","~014",["TP ~013","REF ANNRESET"],[]],["OR","~002",["FFS ~006","FFS ~010","FFS ~014"],[]],["BTR","~034",["OR ~002"],[]],["A","~029",["A ~004","A ~008"],[]],["A","~032",["A ~004","A ~012"],[]],["A","~033",["A ~008","A ~012"],[]],["OR","~030",["A ~029","A ~032","A ~033"],[]],["A","~015",["FFS ~006","FFS ~010"],[]],["A","~016",["FFS ~006","FFS ~014"],[]],["A","~018",["FFS ~010","FFS ~014"],[]],["OR","~017",["A ~015","A ~016","A ~018"],[]]]},"TCE067 020":{"_b":[["DSW","034",["const 0","REF SIMULATIONUSE","SW:REF OUTSIDESIMULATION"],[]],["ASW","002",["pin SIM","pin SIG3","SW:DSW 034"],[]],["FTR","026",["pin HL"],[]],["FTR","027",["pin LL"],[]],["PA21","028",["FTR 026","FTR 027"],[]],["WCM","028",["ASW 002"],[]],["A","005",["WCM 028","REF ANNENABLE"],[]],["OR","003",["pin ERR3","A 005"],[]],["ASW","006",["pin SIM","pin SIG3","SW:DSW 034"],[]],["PA21","029",["FTR 026","FTR 027"],[]],["WCM","029",["ASW 006"],[]],["A","009",["WCM 029","REF ANNENABLE"],[]],["OR","007",["pin ERR3","A 009"],[]],["ASW","010",["pin SIM","pin SIG3","SW:DSW 034"],[]],["PA21","030",["FTR 026","FTR 027"],[]],["WCM","030",["ASW 010"],[]],["A","013",["WCM 030","REF ANNENABLE"],[]],["OR","011",["pin ERR3","A 013"],[]],["SC","025",["pin DEV"],[]],["PA21","031",["pin DEV","SC 025"],[]],["MR","031",["ASW 002","ASW 006"],[]],["TP","015",["MR 031","SW:REF INITIAL"],[1]],["FFS","016",["TP 015","REF ANNRESET"],[]],["PA21","032",["pin DEV","SC 025"],[]],["MR","032",["ASW 002","ASW 010"],[]],["TP","020",["MR 032","SW:REF INITIAL"],[1]],["FFS","021",["TP 020","REF ANNRESET"],[]],["PA21","033",["pin DEV","SC 025"],[]],["MR","033",["ASW 006","ASW 010"],[]],["TP","023",["MR 033","SW:REF INITIAL"],[1]],["FFS","024",["TP 023","REF ANNRESET"],[]],["OR","017",["FFS 016","FFS 021","FFS 024"],[]],["HS","~023",["ASW 002","ASW 006","ASW 006"],[]],["HS","~025",["ASW 002","ASW 002","ASW 010"],[]],["HS","~026",["ASW 006","ASW 010","ASW 010"],[]],["LS","~024",["HS ~023","HS ~025","HS ~026"],[]],["FTR","~027",["LS ~024"],[]],["A","~004",["OR 003","REF ANNENABLE"],[]],["TP","~005",["A ~004","SW:REF INITIAL"],[3]],["FFS","~006",["TP ~005","REF ANNRESET"],[]],["A","~008",["OR 007","REF ANNENABLE"],[]],["TP","~009",["A ~008","SW:REF INITIAL"],[3]],["FFS","~010",["TP ~009","REF ANNRESET"],[]],["A","~012",["OR 011","REF ANNENABLE"],[]],["TP","~013",["A ~012","SW:REF INITIAL"],[3]],["FFS","~014",["TP ~013","REF ANNRESET"],[]],["OR","~002",["FFS ~006","FFS ~010","FFS ~014"],[]],["BTR","~034",["OR ~002"],[]],["A","~029",["A ~004","A ~008"],[]],["A","~032",["A ~004","A ~012"],[]],["A","~033",["A ~008","A ~012"],[]],["OR","~030",["A ~029","A ~032","A ~033"],[]],["A","~015",["FFS ~006","FFS ~010"],[]],["A","~016",["FFS ~006","FFS ~014"],[]],["A","~018",["FFS ~010","FFS ~014"],[]],["OR","~017",["A ~015","A ~016","A ~018"],[]]]},"TCE067 030":{"_b":[["DSW","034",["const 0","REF SIMULATIONUSE","SW:REF OUTSIDESIMULATION"],[]],["ASW","002",["pin SIM","pin SIG3","SW:DSW 034"],[]],["FTR","026",["pin HL"],[]],["FTR","027",["pin LL"],[]],["PA21","028",["FTR 026","FTR 027"],[]],["WCM","028",["ASW 002"],[]],["A","005",["WCM 028","REF ANNENABLE"],[]],["OR","003",["pin ERR3","A 005"],[]],["ASW","006",["pin SIM","pin SIG3","SW:DSW 034"],[]],["PA21","029",["FTR 026","FTR 027"],[]],["WCM","029",["ASW 006"],[]],["A","009",["WCM 029","REF ANNENABLE"],[]],["OR","007",["pin ERR3","A 009"],[]],["ASW","010",["pin SIM","pin SIG3","SW:DSW 034"],[]],["PA21","030",["FTR 026","FTR 027"],[]],["WCM","030",["ASW 010"],[]],["A","013",["WCM 030","REF ANNENABLE"],[]],["OR","011",["pin ERR3","A 013"],[]],["SC","025",["pin DEV"],[]],["PA21","031",["pin DEV","SC 025"],[]],["MR","031",["ASW 002","ASW 006"],[]],["TP","015",["MR 031","SW:REF INITIAL"],[1]],["FFS","016",["TP 015","REF ANNRESET"],[]],["PA21","032",["pin DEV","SC 025"],[]],["MR","032",["ASW 002","ASW 010"],[]],["TP","020",["MR 032","SW:REF INITIAL"],[1]],["FFS","021",["TP 020","REF ANNRESET"],[]],["PA21","033",["pin DEV","SC 025"],[]],["MR","033",["ASW 006","ASW 010"],[]],["TP","023",["MR 033","SW:REF INITIAL"],[1]],["FFS","024",["TP 023","REF ANNRESET"],[]],["OR","017",["FFS 016","FFS 021","FFS 024"],[]],["HS","~023",["ASW 002","ASW 006","ASW 006"],[]],["HS","~025",["ASW 002","ASW 002","ASW 010"],[]],["HS","~026",["ASW 006","ASW 010","ASW 010"],[]],["LS","~024",["HS ~023","HS ~025","HS ~026"],[]],["FTR","~027",["LS ~024"],[]],["A","~004",["OR 003","REF ANNENABLE"],[]],["TP","~005",["A ~004","SW:REF INITIAL"],[3]],["FFS","~006",["TP ~005","REF ANNRESET"],[]],["A","~008",["OR 007","REF ANNENABLE"],[]],["TP","~009",["A ~008","SW:REF INITIAL"],[3]],["FFS","~010",["TP ~009","REF ANNRESET"],[]],["A","~012",["OR 011","REF ANNENABLE"],[]],["TP","~013",["A ~012","SW:REF INITIAL"],[3]],["FFS","~014",["TP ~013","REF ANNRESET"],[]],["OR","~002",["FFS ~006","FFS ~010","FFS ~014"],[]],["BTR","~034",["OR ~002"],[]],["A","~029",["A ~004","A ~008"],[]],["A","~032",["A ~004","A ~012"],[]],["A","~033",["A ~008","A ~012"],[]],["OR","~030",["A ~029","A ~032","A ~033"],[]],["A","~015",["FFS ~006","FFS ~010"],[]],["A","~016",["FFS ~006","FFS ~014"],[]],["A","~018",["FFS ~010","FFS ~014"],[]],["OR","~017",["A ~015","A ~016","A ~018"],[]]]},"TCE068 002":{"_b":[["DSW","034",["const 0","REF SIMULATIONUSE","SW:REF OUTSIDESIMULATION"],[]],["ASW","002",["pin SIM","pin SIG3","SW:DSW 034"],[]],["FTR","026",["pin HL"],[]],["FTR","027",["pin LL"],[]],["PA21","028",["FTR 026","FTR 027"],[]],["WCM","028",["ASW 002"],[]],["A","005",["WCM 028","REF ANNENABLE"],[]],["OR","003",["pin ERR3","A 005"],[]],["ASW","006",["pin SIM","pin SIG3","SW:DSW 034"],[]],["PA21","029",["FTR 026","FTR 027"],[]],["WCM","029",["ASW 006"],[]],["A","009",["WCM 029","REF ANNENABLE"],[]],["OR","007",["pin ERR3","A 009"],[]],["ASW","010",["pin SIM","pin SIG3","SW:DSW 034"],[]],["PA21","030",["FTR 026","FTR 027"],[]],["WCM","030",["ASW 010"],[]],["A","013",["WCM 030","REF ANNENABLE"],[]],["OR","011",["pin ERR3","A 013"],[]],["SC","025",["pin DEV"],[]],["PA21","031",["pin DEV","SC 025"],[]],["MR","031",["ASW 002","ASW 006"],[]],["TP","015",["MR 031","SW:REF INITIAL"],[1]],["FFS","016",["TP 015","REF ANNRESET"],[]],["PA21","032",["pin DEV","SC 025"],[]],["MR","032",["ASW 002","ASW 010"],[]],["TP","020",["MR 032","SW:REF INITIAL"],[1]],["FFS","021",["TP 020","REF ANNRESET"],[]],["PA21","033",["pin DEV","SC 025"],[]],["MR","033",["ASW 006","ASW 010"],[]],["TP","023",["MR 033","SW:REF INITIAL"],[1]],["FFS","024",["TP 023","REF ANNRESET"],[]],["OR","017",["FFS 016","FFS 021","FFS 024"],[]],["HS","~023",["ASW 002","ASW 006","ASW 006"],[]],["HS","~025",["ASW 002","ASW 002","ASW 010"],[]],["HS","~026",["ASW 006","ASW 010","ASW 010"],[]],["LS","~024",["HS ~023","HS ~025","HS ~026"],[]],["FTR","~027",["LS ~024"],[]],["A","~004",["OR 003","REF ANNENABLE"],[]],["TP","~005",["A ~004","SW:REF INITIAL"],[3]],["FFS","~006",["TP ~005","REF ANNRESET"],[]],["A","~008",["OR 007","REF ANNENABLE"],[]],["TP","~009",["A ~008","SW:REF INITIAL"],[3]],["FFS","~010",["TP ~009","REF ANNRESET"],[]],["A","~012",["OR 011","REF ANNENABLE"],[]],["TP","~013",["A ~012","SW:REF INITIAL"],[3]],["FFS","~014",["TP ~013","REF ANNRESET"],[]],["OR","~002",["FFS ~006","FFS ~010","FFS ~014"],[]],["BTR","~034",["OR ~002"],[]],["A","~029",["A ~004","A ~008"],[]],["A","~032",["A ~004","A ~012"],[]],["A","~033",["A ~008","A ~012"],[]],["OR","~030",["A ~029","A ~032","A ~033"],[]],["A","~015",["FFS ~006","FFS ~010"],[]],["A","~016",["FFS ~006","FFS ~014"],[]],["A","~018",["FFS ~010","FFS ~014"],[]],["OR","~017",["A ~015","A ~016","A ~018"],[]]]},"TCE068 020":{"_b":[["DSW","034",["const 0","REF SIMULATIONUSE","SW:REF OUTSIDESIMULATION"],[]],["ASW","002",["pin SIM","pin SIG3","SW:DSW 034"],[]],["FTR","026",["pin HL"],[]],["FTR","027",["pin LL"],[]],["PA21","028",["FTR 026","FTR 027"],[]],["WCM","028",["ASW 002"],[]],["A","005",["WCM 028","REF ANNENABLE"],[]],["OR","003",["pin ERR3","A 005"],[]],["ASW","006",["pin SIM","pin SIG3","SW:DSW 034"],[]],["PA21","029",["FTR 026","FTR 027"],[]],["WCM","029",["ASW 006"],[]],["A","009",["WCM 029","REF ANNENABLE"],[]],["OR","007",["pin ERR3","A 009"],[]],["ASW","010",["pin SIM","pin SIG3","SW:DSW 034"],[]],["PA21","030",["FTR 026","FTR 027"],[]],["WCM","030",["ASW 010"],[]],["A","013",["WCM 030","REF ANNENABLE"],[]],["OR","011",["pin ERR3","A 013"],[]],["SC","025",["pin DEV"],[]],["PA21","031",["pin DEV","SC 025"],[]],["MR","031",["ASW 002","ASW 006"],[]],["TP","015",["MR 031","SW:REF INITIAL"],[1]],["FFS","016",["TP 015","REF ANNRESET"],[]],["PA21","032",["pin DEV","SC 025"],[]],["MR","032",["ASW 002","ASW 010"],[]],["TP","020",["MR 032","SW:REF INITIAL"],[1]],["FFS","021",["TP 020","REF ANNRESET"],[]],["PA21","033",["pin DEV","SC 025"],[]],["MR","033",["ASW 006","ASW 010"],[]],["TP","023",["MR 033","SW:REF INITIAL"],[1]],["FFS","024",["TP 023","REF ANNRESET"],[]],["OR","017",["FFS 016","FFS 021","FFS 024"],[]],["HS","~023",["ASW 002","ASW 006","ASW 006"],[]],["HS","~025",["ASW 002","ASW 002","ASW 010"],[]],["HS","~026",["ASW 006","ASW 010","ASW 010"],[]],["LS","~024",["HS ~023","HS ~025","HS ~026"],[]],["FTR","~027",["LS ~024"],[]],["A","~004",["OR 003","REF ANNENABLE"],[]],["TP","~005",["A ~004","SW:REF INITIAL"],[3]],["FFS","~006",["TP ~005","REF ANNRESET"],[]],["A","~008",["OR 007","REF ANNENABLE"],[]],["TP","~009",["A ~008","SW:REF INITIAL"],[3]],["FFS","~010",["TP ~009","REF ANNRESET"],[]],["A","~012",["OR 011","REF ANNENABLE"],[]],["TP","~013",["A ~012","SW:REF INITIAL"],[3]],["FFS","~014",["TP ~013","REF ANNRESET"],[]],["OR","~002",["FFS ~006","FFS ~010","FFS ~014"],[]],["BTR","~034",["OR ~002"],[]],["A","~029",["A ~004","A ~008"],[]],["A","~032",["A ~004","A ~012"],[]],["A","~033",["A ~008","A ~012"],[]],["OR","~030",["A ~029","A ~032","A ~033"],[]],["A","~015",["FFS ~006","FFS ~010"],[]],["A","~016",["FFS ~006","FFS ~014"],[]],["A","~018",["FFS ~010","FFS ~014"],[]],["OR","~017",["A ~015","A ~016","A ~018"],[]]]},"TCE068 030":{"_b":[["DSW","034",["const 0","REF SIMULATIONUSE","SW:REF OUTSIDESIMULATION"],[]],["ASW","002",["pin SIM","pin SIG3","SW:DSW 034"],[]],["FTR","026",["pin HL"],[]],["FTR","027",["pin LL"],[]],["PA21","028",["FTR 026","FTR 027"],[]],["WCM","028",["ASW 002"],[]],["A","005",["WCM 028","REF ANNENABLE"],[]],["OR","003",["pin ERR3","A 005"],[]],["ASW","006",["pin SIM","pin SIG3","SW:DSW 034"],[]],["PA21","029",["FTR 026","FTR 027"],[]],["WCM","029",["ASW 006"],[]],["A","009",["WCM 029","REF ANNENABLE"],[]],["OR","007",["pin ERR3","A 009"],[]],["ASW","010",["pin SIM","pin SIG3","SW:DSW 034"],[]],["PA21","030",["FTR 026","FTR 027"],[]],["WCM","030",["ASW 010"],[]],["A","013",["WCM 030","REF ANNENABLE"],[]],["OR","011",["pin ERR3","A 013"],[]],["SC","025",["pin DEV"],[]],["PA21","031",["pin DEV","SC 025"],[]],["MR","031",["ASW 002","ASW 006"],[]],["TP","015",["MR 031","SW:REF INITIAL"],[1]],["FFS","016",["TP 015","REF ANNRESET"],[]],["PA21","032",["pin DEV","SC 025"],[]],["MR","032",["ASW 002","ASW 010"],[]],["TP","020",["MR 032","SW:REF INITIAL"],[1]],["FFS","021",["TP 020","REF ANNRESET"],[]],["PA21","033",["pin DEV","SC 025"],[]],["MR","033",["ASW 006","ASW 010"],[]],["TP","023",["MR 033","SW:REF INITIAL"],[1]],["FFS","024",["TP 023","REF ANNRESET"],[]],["OR","017",["FFS 016","FFS 021","FFS 024"],[]],["HS","~023",["ASW 002","ASW 006","ASW 006"],[]],["HS","~025",["ASW 002","ASW 002","ASW 010"],[]],["HS","~026",["ASW 006","ASW 010","ASW 010"],[]],["LS","~024",["HS ~023","HS ~025","HS ~026"],[]],["FTR","~027",["LS ~024"],[]],["A","~004",["OR 003","REF ANNENABLE"],[]],["TP","~005",["A ~004","SW:REF INITIAL"],[3]],["FFS","~006",["TP ~005","REF ANNRESET"],[]],["A","~008",["OR 007","REF ANNENABLE"],[]],["TP","~009",["A ~008","SW:REF INITIAL"],[3]],["FFS","~010",["TP ~009","REF ANNRESET"],[]],["A","~012",["OR 011","REF ANNENABLE"],[]],["TP","~013",["A ~012","SW:REF INITIAL"],[3]],["FFS","~014",["TP ~013","REF ANNRESET"],[]],["OR","~002",["FFS ~006","FFS ~010","FFS ~014"],[]],["BTR","~034",["OR ~002"],[]],["A","~029",["A ~004","A ~008"],[]],["A","~032",["A ~004","A ~012"],[]],["A","~033",["A ~008","A ~012"],[]],["OR","~030",["A ~029","A ~032","A ~033"],[]],["A","~015",["FFS ~006","FFS ~010"],[]],["A","~016",["FFS ~006","FFS ~014"],[]],["A","~018",["FFS ~010","FFS ~014"],[]],["OR","~017",["A ~015","A ~016","A ~018"],[]]]},"TCE069 002":{"_b":[["DSW","034",["const 0","REF SIMULATIONUSE","SW:REF OUTSIDESIMULATION"],[]],["ASW","002",["pin SIM","pin SIG3","SW:DSW 034"],[]],["FTR","026",["pin HL"],[]],["FTR","027",["pin LL"],[]],["PA21","028",["FTR 026","FTR 027"],[]],["WCM","028",["ASW 002"],[]],["A","005",["WCM 028","REF ANNENABLE"],[]],["OR","003",["pin ERR3","A 005"],[]],["ASW","006",["pin SIM","pin SIG3","SW:DSW 034"],[]],["PA21","029",["FTR 026","FTR 027"],[]],["WCM","029",["ASW 006"],[]],["A","009",["WCM 029","REF ANNENABLE"],[]],["OR","007",["pin ERR3","A 009"],[]],["ASW","010",["pin SIM","pin SIG3","SW:DSW 034"],[]],["PA21","030",["FTR 026","FTR 027"],[]],["WCM","030",["ASW 010"],[]],["A","013",["WCM 030","REF ANNENABLE"],[]],["OR","011",["pin ERR3","A 013"],[]],["SC","025",["pin DEV"],[]],["PA21","031",["pin DEV","SC 025"],[]],["MR","031",["ASW 002","ASW 006"],[]],["TP","015",["MR 031","SW:REF INITIAL"],[1]],["FFS","016",["TP 015","REF ANNRESET"],[]],["PA21","032",["pin DEV","SC 025"],[]],["MR","032",["ASW 002","ASW 010"],[]],["TP","020",["MR 032","SW:REF INITIAL"],[1]],["FFS","021",["TP 020","REF ANNRESET"],[]],["PA21","033",["pin DEV","SC 025"],[]],["MR","033",["ASW 006","ASW 010"],[]],["TP","023",["MR 033","SW:REF INITIAL"],[1]],["FFS","024",["TP 023","REF ANNRESET"],[]],["OR","017",["FFS 016","FFS 021","FFS 024"],[]],["HS","~023",["ASW 002","ASW 006","ASW 006"],[]],["HS","~025",["ASW 002","ASW 002","ASW 010"],[]],["HS","~026",["ASW 006","ASW 010","ASW 010"],[]],["LS","~024",["HS ~023","HS ~025","HS ~026"],[]],["FTR","~027",["LS ~024"],[]],["A","~004",["OR 003","REF ANNENABLE"],[]],["TP","~005",["A ~004","SW:REF INITIAL"],[3]],["FFS","~006",["TP ~005","REF ANNRESET"],[]],["A","~008",["OR 007","REF ANNENABLE"],[]],["TP","~009",["A ~008","SW:REF INITIAL"],[3]],["FFS","~010",["TP ~009","REF ANNRESET"],[]],["A","~012",["OR 011","REF ANNENABLE"],[]],["TP","~013",["A ~012","SW:REF INITIAL"],[3]],["FFS","~014",["TP ~013","REF ANNRESET"],[]],["OR","~002",["FFS ~006","FFS ~010","FFS ~014"],[]],["BTR","~034",["OR ~002"],[]],["A","~029",["A ~004","A ~008"],[]],["A","~032",["A ~004","A ~012"],[]],["A","~033",["A ~008","A ~012"],[]],["OR","~030",["A ~029","A ~032","A ~033"],[]],["A","~015",["FFS ~006","FFS ~010"],[]],["A","~016",["FFS ~006","FFS ~014"],[]],["A","~018",["FFS ~010","FFS ~014"],[]],["OR","~017",["A ~015","A ~016","A ~018"],[]]]},"TCE069 020":{"_b":[["DSW","034",["const 0","REF SIMULATIONUSE","SW:REF OUTSIDESIMULATION"],[]],["ASW","002",["pin SIM","pin SIG3","SW:DSW 034"],[]],["FTR","026",["pin HL"],[]],["FTR","027",["pin LL"],[]],["PA21","028",["FTR 026","FTR 027"],[]],["WCM","028",["ASW 002"],[]],["A","005",["WCM 028","REF ANNENABLE"],[]],["OR","003",["pin ERR3","A 005"],[]],["ASW","006",["pin SIM","pin SIG3","SW:DSW 034"],[]],["PA21","029",["FTR 026","FTR 027"],[]],["WCM","029",["ASW 006"],[]],["A","009",["WCM 029","REF ANNENABLE"],[]],["OR","007",["pin ERR3","A 009"],[]],["ASW","010",["pin SIM","pin SIG3","SW:DSW 034"],[]],["PA21","030",["FTR 026","FTR 027"],[]],["WCM","030",["ASW 010"],[]],["A","013",["WCM 030","REF ANNENABLE"],[]],["OR","011",["pin ERR3","A 013"],[]],["SC","025",["pin DEV"],[]],["PA21","031",["pin DEV","SC 025"],[]],["MR","031",["ASW 002","ASW 006"],[]],["TP","015",["MR 031","SW:REF INITIAL"],[1]],["FFS","016",["TP 015","REF ANNRESET"],[]],["PA21","032",["pin DEV","SC 025"],[]],["MR","032",["ASW 002","ASW 010"],[]],["TP","020",["MR 032","SW:REF INITIAL"],[1]],["FFS","021",["TP 020","REF ANNRESET"],[]],["PA21","033",["pin DEV","SC 025"],[]],["MR","033",["ASW 006","ASW 010"],[]],["TP","023",["MR 033","SW:REF INITIAL"],[1]],["FFS","024",["TP 023","REF ANNRESET"],[]],["OR","017",["FFS 016","FFS 021","FFS 024"],[]],["HS","~023",["ASW 002","ASW 006","ASW 006"],[]],["HS","~025",["ASW 002","ASW 002","ASW 010"],[]],["HS","~026",["ASW 006","ASW 010","ASW 010"],[]],["LS","~024",["HS ~023","HS ~025","HS ~026"],[]],["FTR","~027",["LS ~024"],[]],["A","~004",["OR 003","REF ANNENABLE"],[]],["TP","~005",["A ~004","SW:REF INITIAL"],[3]],["FFS","~006",["TP ~005","REF ANNRESET"],[]],["A","~008",["OR 007","REF ANNENABLE"],[]],["TP","~009",["A ~008","SW:REF INITIAL"],[3]],["FFS","~010",["TP ~009","REF ANNRESET"],[]],["A","~012",["OR 011","REF ANNENABLE"],[]],["TP","~013",["A ~012","SW:REF INITIAL"],[3]],["FFS","~014",["TP ~013","REF ANNRESET"],[]],["OR","~002",["FFS ~006","FFS ~010","FFS ~014"],[]],["BTR","~034",["OR ~002"],[]],["A","~029",["A ~004","A ~008"],[]],["A","~032",["A ~004","A ~012"],[]],["A","~033",["A ~008","A ~012"],[]],["OR","~030",["A ~029","A ~032","A ~033"],[]],["A","~015",["FFS ~006","FFS ~010"],[]],["A","~016",["FFS ~006","FFS ~014"],[]],["A","~018",["FFS ~010","FFS ~014"],[]],["OR","~017",["A ~015","A ~016","A ~018"],[]]]},"TCE069 030":{"_b":[["DSW","034",["const 0","REF SIMULATIONUSE","SW:REF OUTSIDESIMULATION"],[]],["ASW","002",["pin SIM","pin SIG3","SW:DSW 034"],[]],["FTR","026",["pin HL"],[]],["FTR","027",["pin LL"],[]],["PA21","028",["FTR 026","FTR 027"],[]],["WCM","028",["ASW 002"],[]],["A","005",["WCM 028","REF ANNENABLE"],[]],["OR","003",["pin ERR3","A 005"],[]],["ASW","006",["pin SIM","pin SIG3","SW:DSW 034"],[]],["PA21","029",["FTR 026","FTR 027"],[]],["WCM","029",["ASW 006"],[]],["A","009",["WCM 029","REF ANNENABLE"],[]],["OR","007",["pin ERR3","A 009"],[]],["ASW","010",["pin SIM","pin SIG3","SW:DSW 034"],[]],["PA21","030",["FTR 026","FTR 027"],[]],["WCM","030",["ASW 010"],[]],["A","013",["WCM 030","REF ANNENABLE"],[]],["OR","011",["pin ERR3","A 013"],[]],["SC","025",["pin DEV"],[]],["PA21","031",["pin DEV","SC 025"],[]],["MR","031",["ASW 002","ASW 006"],[]],["TP","015",["MR 031","SW:REF INITIAL"],[1]],["FFS","016",["TP 015","REF ANNRESET"],[]],["PA21","032",["pin DEV","SC 025"],[]],["MR","032",["ASW 002","ASW 010"],[]],["TP","020",["MR 032","SW:REF INITIAL"],[1]],["FFS","021",["TP 020","REF ANNRESET"],[]],["PA21","033",["pin DEV","SC 025"],[]],["MR","033",["ASW 006","ASW 010"],[]],["TP","023",["MR 033","SW:REF INITIAL"],[1]],["FFS","024",["TP 023","REF ANNRESET"],[]],["OR","017",["FFS 016","FFS 021","FFS 024"],[]],["HS","~023",["ASW 002","ASW 006","ASW 006"],[]],["HS","~025",["ASW 002","ASW 002","ASW 010"],[]],["HS","~026",["ASW 006","ASW 010","ASW 010"],[]],["LS","~024",["HS ~023","HS ~025","HS ~026"],[]],["FTR","~027",["LS ~024"],[]],["A","~004",["OR 003","REF ANNENABLE"],[]],["TP","~005",["A ~004","SW:REF INITIAL"],[3]],["FFS","~006",["TP ~005","REF ANNRESET"],[]],["A","~008",["OR 007","REF ANNENABLE"],[]],["TP","~009",["A ~008","SW:REF INITIAL"],[3]],["FFS","~010",["TP ~009","REF ANNRESET"],[]],["A","~012",["OR 011","REF ANNENABLE"],[]],["TP","~013",["A ~012","SW:REF INITIAL"],[3]],["FFS","~014",["TP ~013","REF ANNRESET"],[]],["OR","~002",["FFS ~006","FFS ~010","FFS ~014"],[]],["BTR","~034",["OR ~002"],[]],["A","~029",["A ~004","A ~008"],[]],["A","~032",["A ~004","A ~012"],[]],["A","~033",["A ~008","A ~012"],[]],["OR","~030",["A ~029","A ~032","A ~033"],[]],["A","~015",["FFS ~006","FFS ~010"],[]],["A","~016",["FFS ~006","FFS ~014"],[]],["A","~018",["FFS ~010","FFS ~014"],[]],["OR","~017",["A ~015","A ~016","A ~018"],[]]]},"TCE070 002":{},"TCE070 020":{},"TCE071 002":{},"TCE071 020":{},"TCE071 030":{},"TCE072 002":{},"TCE072 020":{},"TCE072 030":{},"TCE073 002":{},"TCE073 020":{},"TCE073 030":{}},"comp":"LME111A"},
    LMA111: {"name":"TMR AI DIAGNOSTICS","pi":["SIM","SIG1","ERR1","HL","LL","SIG2","ERR2","SIG3","ERR3","DEV"],"po":{"DEVE":"OR 017","OUT":"LS ~024","ERR":"OR ~002","ABN":"OR ~017"},"b":[["DSW","034",["const 0","REF SIMULATIONUSE","SW:REF OUTSIDESIMULATION"],[]],["ASW","002",["pin SIM","pin SIG1","SW:DSW 034"],[]],["FTR","026",["pin HL"],[]],["FTR","027",["pin LL"],[]],["PA21","028",["FTR 026","FTR 027"],[]],["WCM","028",["ASW 002"],[]],["A","005",["WCM 028","REF ANNENABLE"],[]],["OR","003",["pin ERR1","A 005"],[]],["ASW","006",["pin SIM","pin SIG2","SW:DSW 034"],[]],["PA21","029",["FTR 026","FTR 027"],[]],["WCM","029",["ASW 006"],[]],["A","009",["WCM 029","REF ANNENABLE"],[]],["OR","007",["pin ERR2","A 009"],[]],["ASW","010",["pin SIM","pin SIG3","SW:DSW 034"],[]],["PA21","030",["FTR 026","FTR 027"],[]],["WCM","030",["ASW 010"],[]],["A","013",["WCM 030","REF ANNENABLE"],[]],["OR","011",["pin ERR3","A 013"],[]],["SC","025",["pin DEV"],[]],["PA21","031",["pin DEV","SC 025"],[]],["MR","031",["ASW 002","ASW 006"],[]],["TP","015",["MR 031","SW:REF INITIAL"],[1]],["FFS","016",["TP 015","REF ANNRESET"],[]],["PA21","032",["pin DEV","SC 025"],[]],["MR","032",["ASW 002","ASW 010"],[]],["TP","020",["MR 032","SW:REF INITIAL"],[1]],["FFS","021",["TP 020","REF ANNRESET"],[]],["PA21","033",["pin DEV","SC 025"],[]],["MR","033",["ASW 006","ASW 010"],[]],["TP","023",["MR 033","SW:REF INITIAL"],[1]],["FFS","024",["TP 023","REF ANNRESET"],[]],["OR","017",["FFS 016","FFS 021","FFS 024"],[]],["HS","~023",["ASW 002","ASW 006","ASW 006"],[]],["HS","~025",["ASW 002","ASW 002","ASW 010"],[]],["HS","~026",["ASW 006","ASW 010","ASW 010"],[]],["LS","~024",["HS ~023","HS ~025","HS ~026"],[]],["FTR","~027",["LS ~024"],[]],["A","~004",["OR 003","REF ANNENABLE"],[]],["TP","~005",["A ~004","SW:REF INITIAL"],[3]],["FFS","~006",["TP ~005","REF ANNRESET"],[]],["A","~008",["OR 007","REF ANNENABLE"],[]],["TP","~009",["A ~008","SW:REF INITIAL"],[3]],["FFS","~010",["TP ~009","REF ANNRESET"],[]],["A","~012",["OR 011","REF ANNENABLE"],[]],["TP","~013",["A ~012","SW:REF INITIAL"],[3]],["FFS","~014",["TP ~013","REF ANNRESET"],[]],["OR","~002",["FFS ~006","FFS ~010","FFS ~014"],[]],["BTR","~034",["OR ~002"],[]],["A","~029",["A ~004","A ~008"],[]],["A","~032",["A ~004","A ~012"],[]],["A","~033",["A ~008","A ~012"],[]],["OR","~030",["A ~029","A ~032","A ~033"],[]],["A","~015",["FFS ~006","FFS ~010"],[]],["A","~016",["FFS ~006","FFS ~014"],[]],["A","~018",["FFS ~010","FFS ~014"],[]],["OR","~017",["A ~015","A ~016","A ~018"],[]]],"at":{"TCA372 002":{}},"comp":"LMA111A"},
    LME122: {"name":"VALVE DIAGNOSIS","pi":["S.POS.","POS.","ANNSW","DEMAND","AMP","POS.OT","ANN.EN"],"po":{"ABN.M":"FFS ~005","POS.":"FTR ~010","ABN.O":"BTR ~013","ABN.A":"FFS ~015","QUA":"OR ~014"},"b":[["BTR","033",["REF VALVESIMULATIONUSE"],[]],["ASW","003",["pin S.POS.","pin POS.","SW:BTR 033"],[]],["PD","005",["ASW 003","SW:REF INITIAL"],[1,1]],["MR","001",["ASW 003","PD 005"],[10,-50]],["A","002",["MR 001","pin ANNSW"],[]],["FFS","004",["A 002","REF ANNRESET"],[]],["MR","006",["ASW 003","const 0"],[105,-5]],["A","007",["MR 006","pin ANNSW"],[]],["TP","008",["A 007","SW:REF INITIAL"],[0.1]],["FFS","009",["TP 008","REF ANNRESET"],[]],["LMS","010",["pin DEMAND"],[100,-5]],["SUB","011",["LMS 010","ASW 003"],[]],["MR","012",["SUB 011","const 0"],[20,-20]],["A","013",["MR 012","pin ANNSW"],[]],["TP","014",["A 013","SW:REF INITIAL"],[5]],["FFS","015",["TP 014","REF ANNRESET"],[]],["SG","034",[],[0]],["MLT","016",["SUB 011","SG 034"],[]],["LMS","017",["MLT 016"],[102.4,-102.4]],["ASW","022",["MLT 016","pin AMP","SW:BTR 033"],[]],["MR","018",["LMS 017","ASW 022"],[200,-200]],["MR","023",["ASW 022","const 0"],[100,-100]],["A","019",["MR 018","MR 023","pin ANNSW"],[]],["TP","020",["A 019","SW:REF INITIAL"],[0.1]],["FFS","021",["TP 020","REF ANNRESET"],[]],["SUB","024",["ASW 003","PD 005"],[]],["ABS","025",["SUB 024"],[]],["ASW","027",["const 0","HSG 026","SW:REF ANNRESET"],[]],["HSG","026",["ABS 025","ABS 025","ASW 027"],[]],["ASW","029",["const 0","HSG 028","SW:REF ANNRESET"],[]],["HSG","028",["ASW 003","ASW 003","ASW 029"],[]],["ASW","031",["const 0","LSG 030","SW:REF ANNRESET"],[]],["LSG","030",["ASW 003","ASW 003","ASW 031"],[]],["FTR","~001",["ASW 003"],[]],["MR","~002",["FTR ~001","pin POS.OT"],[999999,-999999]],["MR","~006",["LMS 010","FTR ~001"],[999999,-999999]],["MR","~007",["LMS 010","pin POS.OT"],[999999,-999999]],["NOT","~008",["MR ~007"],[]],["TD","~009",["NOT ~008","SW:REF INITIAL"],[5]],["A","~003",["MR ~002","MR ~006","TD ~009","pin ANN.EN"],[]],["TP","~004",["A ~003","SW:REF INITIAL"],[0.2]],["FFS","~005",["TP ~004","REF ANNRESET"],[]],["FTR","~010",["FTR ~001"],[]],["OR","~011",["TP ~004","A 002","TP 008","TP 020"],[]],["FFR","~012",["OR ~011","REF ANNRESET"],[]],["BTR","~013",["FFR ~012"],[]],["OR","~014",["TP ~004","A 002","TP 008","TP 014","TP 020"],[]],["FFS","~015",["OR ~014","REF ANNRESET"],[]]],"at":{"TCE120 002":{},"TCE120 007":{},"TCE121 002":{},"TCE122 002":{},"TCE122 007":{},"TCE123 002":{},"TCE124 002":{},"TCE124 007":{},"TCE125 002":{},"TCE126 002":{},"TCE126 007":{},"TCE127 002":{},"TCE128 002":{"MR 012":[105,-105]},"TCE128 007":{"MR 012":[105,-105]},"TCE129 002":{"MR 012":[105,-105]},"TCE130 002":{"MR 012":[105,-105]},"TCE130 007":{"MR 012":[105,-105]},"TCE131 002":{"MR 012":[105,-105]},"TCE132 002":{"MR 012":[200,-200],"_b":[["BTR","033",["REF VALVESIMULATIONUSE"],[]],["ASW","003",["pin S.POS.","pin POS.","SW:BTR 033"],[]],["PD","005",["ASW 003","SW:REF INITIAL"],[1,1]],["MR","001",["ASW 003","PD 005"],[10,-50]],["A","002",["MR 001","pin ANNSW"],[]],["FFS","004",["A 002","REF ANNRESET"],[]],["MR","006",["ASW 003","const 0"],[105,-5]],["A","007",["MR 006","pin ANNSW"],[]],["TP","008",["A 007","SW:REF INITIAL"],[0.1]],["FFS","009",["TP 008","REF ANNRESET"],[]],["LMS","010",["pin DEMAND"],[100,-5]],["SUB","011",["LMS 010","ASW 003"],[]],["MR","012",["SUB 011","const 0"],[200,-200]],["A","013",["MR 012","pin ANNSW"],[]],["TP","014",["A 013","SW:REF INITIAL"],[5]],["FFS","015",["TP 014","REF ANNRESET"],[]],["SG","034",[],[0]],["MLT","016",["SUB 011","SG 034"],[]],["LMS","017",["MLT 016"],[102.4,-102.4]],["ASW","022",["MLT 016","const 0","SW:BTR 033"],[]],["MR","018",["LMS 017","ASW 022"],[200,-200]],["MR","023",["ASW 022","const 0"],[100,-100]],["A","019",["MR 018","MR 023","pin ANNSW"],[]],["TP","020",["A 019","SW:REF INITIAL"],[0.1]],["FFS","021",["TP 020","REF ANNRESET"],[]],["SUB","024",["ASW 003","PD 005"],[]],["ABS","025",["SUB 024"],[]],["ASW","027",["const 0","HSG 026","SW:REF ANNRESET"],[]],["HSG","026",["ABS 025","ABS 025","ASW 027"],[]],["ASW","029",["const 0","HSG 028","SW:REF ANNRESET"],[]],["HSG","028",["ASW 003","ASW 003","ASW 029"],[]],["ASW","031",["const 0","LSG 030","SW:REF ANNRESET"],[]],["LSG","030",["ASW 003","ASW 003","ASW 031"],[]],["FTR","~001",["ASW 003"],[]],["MR","~002",["FTR ~001","pin POS.OT"],[999999,-999999]],["MR","~006",["LMS 010","FTR ~001"],[999999,-999999]],["MR","~007",["LMS 010","pin POS.OT"],[999999,-999999]],["NOT","~008",["MR ~007"],[]],["TD","~009",["NOT ~008","SW:REF INITIAL"],[5]],["A","~003",["MR ~002","MR ~006","TD ~009","pin ANN.EN"],[]],["TP","~004",["A ~003","SW:REF INITIAL"],[0.2]],["FFS","~005",["TP ~004","REF ANNRESET"],[]],["FTR","~010",["FTR ~001"],[]],["OR","~011",["TP ~004","A 002","TP 008","TP 020"],[]],["FFR","~012",["OR ~011","REF ANNRESET"],[]],["BTR","~013",["FFR ~012"],[]],["OR","~014",["TP ~004","A 002","TP 008","TP 014","TP 020"],[]],["FFS","~015",["OR ~014","REF ANNRESET"],[]]]},"TCE132 006":{"MR 012":[200,-200],"_b":[["BTR","033",["REF VALVESIMULATIONUSE"],[]],["ASW","003",["pin S.POS.","pin POS.","SW:BTR 033"],[]],["PD","005",["ASW 003","SW:REF INITIAL"],[1,1]],["MR","001",["ASW 003","PD 005"],[10,-50]],["A","002",["MR 001","pin ANNSW"],[]],["FFS","004",["A 002","REF ANNRESET"],[]],["MR","006",["ASW 003","const 0"],[105,-5]],["A","007",["MR 006","pin ANNSW"],[]],["TP","008",["A 007","SW:REF INITIAL"],[0.1]],["FFS","009",["TP 008","REF ANNRESET"],[]],["LMS","010",["pin DEMAND"],[100,-5]],["SUB","011",["LMS 010","ASW 003"],[]],["MR","012",["SUB 011","const 0"],[200,-200]],["A","013",["MR 012","pin ANNSW"],[]],["TP","014",["A 013","SW:REF INITIAL"],[5]],["FFS","015",["TP 014","REF ANNRESET"],[]],["SG","034",[],[0]],["MLT","016",["SUB 011","SG 034"],[]],["LMS","017",["MLT 016"],[102.4,-102.4]],["ASW","022",["MLT 016","const 0","SW:BTR 033"],[]],["MR","018",["LMS 017","ASW 022"],[200,-200]],["MR","023",["ASW 022","const 0"],[100,-100]],["A","019",["MR 018","MR 023","pin ANNSW"],[]],["TP","020",["A 019","SW:REF INITIAL"],[0.1]],["FFS","021",["TP 020","REF ANNRESET"],[]],["SUB","024",["ASW 003","PD 005"],[]],["ABS","025",["SUB 024"],[]],["ASW","027",["const 0","HSG 026","SW:REF ANNRESET"],[]],["HSG","026",["ABS 025","ABS 025","ASW 027"],[]],["ASW","029",["const 0","HSG 028","SW:REF ANNRESET"],[]],["HSG","028",["ASW 003","ASW 003","ASW 029"],[]],["ASW","031",["const 0","LSG 030","SW:REF ANNRESET"],[]],["LSG","030",["ASW 003","ASW 003","ASW 031"],[]],["FTR","~001",["ASW 003"],[]],["MR","~002",["FTR ~001","pin POS.OT"],[999999,-999999]],["MR","~006",["LMS 010","FTR ~001"],[999999,-999999]],["MR","~007",["LMS 010","pin POS.OT"],[999999,-999999]],["NOT","~008",["MR ~007"],[]],["TD","~009",["NOT ~008","SW:REF INITIAL"],[5]],["A","~003",["MR ~002","MR ~006","TD ~009","pin ANN.EN"],[]],["TP","~004",["A ~003","SW:REF INITIAL"],[0.2]],["FFS","~005",["TP ~004","REF ANNRESET"],[]],["FTR","~010",["FTR ~001"],[]],["OR","~011",["TP ~004","A 002","TP 008","TP 020"],[]],["FFR","~012",["OR ~011","REF ANNRESET"],[]],["BTR","~013",["FFR ~012"],[]],["OR","~014",["TP ~004","A 002","TP 008","TP 014","TP 020"],[]],["FFS","~015",["OR ~014","REF ANNRESET"],[]]]},"TCE133 002":{"MR 012":[200,-200],"_b":[["BTR","033",["REF VALVESIMULATIONUSE"],[]],["ASW","003",["pin S.POS.","pin POS.","SW:BTR 033"],[]],["PD","005",["ASW 003","SW:REF INITIAL"],[1,1]],["MR","001",["ASW 003","PD 005"],[10,-50]],["A","002",["MR 001","pin ANNSW"],[]],["FFS","004",["A 002","REF ANNRESET"],[]],["MR","006",["ASW 003","const 0"],[105,-5]],["A","007",["MR 006","pin ANNSW"],[]],["TP","008",["A 007","SW:REF INITIAL"],[0.1]],["FFS","009",["TP 008","REF ANNRESET"],[]],["LMS","010",["const 0"],[100,-5]],["SUB","011",["LMS 010","ASW 003"],[]],["MR","012",["SUB 011","const 0"],[200,-200]],["A","013",["MR 012","pin ANNSW"],[]],["TP","014",["A 013","SW:REF INITIAL"],[5]],["FFS","015",["TP 014","REF ANNRESET"],[]],["SG","034",[],[0]],["MLT","016",["SUB 011","SG 034"],[]],["LMS","017",["MLT 016"],[102.4,-102.4]],["ASW","022",["MLT 016","const 0","SW:BTR 033"],[]],["MR","018",["LMS 017","ASW 022"],[200,-200]],["MR","023",["ASW 022","const 0"],[100,-100]],["A","019",["MR 018","MR 023","pin ANNSW"],[]],["TP","020",["A 019","SW:REF INITIAL"],[0.1]],["FFS","021",["TP 020","REF ANNRESET"],[]],["SUB","024",["ASW 003","PD 005"],[]],["ABS","025",["SUB 024"],[]],["ASW","027",["const 0","HSG 026","SW:REF ANNRESET"],[]],["HSG","026",["ABS 025","ABS 025","ASW 027"],[]],["ASW","029",["const 0","HSG 028","SW:REF ANNRESET"],[]],["HSG","028",["ASW 003","ASW 003","ASW 029"],[]],["ASW","031",["const 0","LSG 030","SW:REF ANNRESET"],[]],["LSG","030",["ASW 003","ASW 003","ASW 031"],[]],["FTR","~001",["ASW 003"],[]],["MR","~002",["FTR ~001","pin POS.OT"],[999999,-999999]],["MR","~006",["LMS 010","FTR ~001"],[999999,-999999]],["MR","~007",["LMS 010","pin POS.OT"],[999999,-999999]],["NOT","~008",["MR ~007"],[]],["TD","~009",["NOT ~008","SW:REF INITIAL"],[5]],["A","~003",["MR ~002","MR ~006","TD ~009","pin ANN.EN"],[]],["TP","~004",["A ~003","SW:REF INITIAL"],[0.2]],["FFS","~005",["TP ~004","REF ANNRESET"],[]],["FTR","~010",["FTR ~001"],[]],["OR","~011",["TP ~004","A 002","TP 008","TP 020"],[]],["FFR","~012",["OR ~011","REF ANNRESET"],[]],["BTR","~013",["FFR ~012"],[]],["OR","~014",["TP ~004","A 002","TP 008","TP 014","TP 020"],[]],["FFS","~015",["OR ~014","REF ANNRESET"],[]]]},"TCE134 002":{"MR 012":[200,-200],"_b":[["BTR","033",["REF VALVESIMULATIONUSE"],[]],["ASW","003",["pin S.POS.","pin POS.","SW:BTR 033"],[]],["PD","005",["ASW 003","SW:REF INITIAL"],[1,1]],["MR","001",["ASW 003","PD 005"],[10,-50]],["A","002",["MR 001","pin ANNSW"],[]],["FFS","004",["A 002","REF ANNRESET"],[]],["MR","006",["ASW 003","const 0"],[105,-5]],["A","007",["MR 006","pin ANNSW"],[]],["TP","008",["A 007","SW:REF INITIAL"],[0.1]],["FFS","009",["TP 008","REF ANNRESET"],[]],["LMS","010",["pin DEMAND"],[100,-5]],["SUB","011",["LMS 010","ASW 003"],[]],["MR","012",["SUB 011","const 0"],[200,-200]],["A","013",["MR 012","pin ANNSW"],[]],["TP","014",["A 013","SW:REF INITIAL"],[5]],["FFS","015",["TP 014","REF ANNRESET"],[]],["SG","034",[],[0]],["MLT","016",["SUB 011","SG 034"],[]],["LMS","017",["MLT 016"],[102.4,-102.4]],["ASW","022",["MLT 016","const 0","SW:BTR 033"],[]],["MR","018",["LMS 017","ASW 022"],[200,-200]],["MR","023",["ASW 022","const 0"],[100,-100]],["A","019",["MR 018","MR 023","pin ANNSW"],[]],["TP","020",["A 019","SW:REF INITIAL"],[0.1]],["FFS","021",["TP 020","REF ANNRESET"],[]],["SUB","024",["ASW 003","PD 005"],[]],["ABS","025",["SUB 024"],[]],["ASW","027",["const 0","HSG 026","SW:REF ANNRESET"],[]],["HSG","026",["ABS 025","ABS 025","ASW 027"],[]],["ASW","029",["const 0","HSG 028","SW:REF ANNRESET"],[]],["HSG","028",["ASW 003","ASW 003","ASW 029"],[]],["ASW","031",["const 0","LSG 030","SW:REF ANNRESET"],[]],["LSG","030",["ASW 003","ASW 003","ASW 031"],[]],["FTR","~001",["ASW 003"],[]],["MR","~002",["FTR ~001","pin POS.OT"],[999999,-999999]],["MR","~006",["LMS 010","FTR ~001"],[999999,-999999]],["MR","~007",["LMS 010","pin POS.OT"],[999999,-999999]],["NOT","~008",["MR ~007"],[]],["TD","~009",["NOT ~008","SW:REF INITIAL"],[5]],["A","~003",["MR ~002","MR ~006","TD ~009","pin ANN.EN"],[]],["TP","~004",["A ~003","SW:REF INITIAL"],[0.2]],["FFS","~005",["TP ~004","REF ANNRESET"],[]],["FTR","~010",["FTR ~001"],[]],["OR","~011",["TP ~004","A 002","TP 008","TP 020"],[]],["FFR","~012",["OR ~011","REF ANNRESET"],[]],["BTR","~013",["FFR ~012"],[]],["OR","~014",["TP ~004","A 002","TP 008","TP 014","TP 020"],[]],["FFS","~015",["OR ~014","REF ANNRESET"],[]]]},"TCE134 006":{"MR 012":[200,-200],"_b":[["BTR","033",["REF VALVESIMULATIONUSE"],[]],["ASW","003",["pin S.POS.","pin POS.","SW:BTR 033"],[]],["PD","005",["ASW 003","SW:REF INITIAL"],[1,1]],["MR","001",["ASW 003","PD 005"],[10,-50]],["A","002",["MR 001","pin ANNSW"],[]],["FFS","004",["A 002","REF ANNRESET"],[]],["MR","006",["ASW 003","const 0"],[105,-5]],["A","007",["MR 006","pin ANNSW"],[]],["TP","008",["A 007","SW:REF INITIAL"],[0.1]],["FFS","009",["TP 008","REF ANNRESET"],[]],["LMS","010",["pin DEMAND"],[100,-5]],["SUB","011",["LMS 010","ASW 003"],[]],["MR","012",["SUB 011","const 0"],[200,-200]],["A","013",["MR 012","pin ANNSW"],[]],["TP","014",["A 013","SW:REF INITIAL"],[5]],["FFS","015",["TP 014","REF ANNRESET"],[]],["SG","034",[],[0]],["MLT","016",["SUB 011","SG 034"],[]],["LMS","017",["MLT 016"],[102.4,-102.4]],["ASW","022",["MLT 016","const 0","SW:BTR 033"],[]],["MR","018",["LMS 017","ASW 022"],[200,-200]],["MR","023",["ASW 022","const 0"],[100,-100]],["A","019",["MR 018","MR 023","pin ANNSW"],[]],["TP","020",["A 019","SW:REF INITIAL"],[0.1]],["FFS","021",["TP 020","REF ANNRESET"],[]],["SUB","024",["ASW 003","PD 005"],[]],["ABS","025",["SUB 024"],[]],["ASW","027",["const 0","HSG 026","SW:REF ANNRESET"],[]],["HSG","026",["ABS 025","ABS 025","ASW 027"],[]],["ASW","029",["const 0","HSG 028","SW:REF ANNRESET"],[]],["HSG","028",["ASW 003","ASW 003","ASW 029"],[]],["ASW","031",["const 0","LSG 030","SW:REF ANNRESET"],[]],["LSG","030",["ASW 003","ASW 003","ASW 031"],[]],["FTR","~001",["ASW 003"],[]],["MR","~002",["FTR ~001","pin POS.OT"],[999999,-999999]],["MR","~006",["LMS 010","FTR ~001"],[999999,-999999]],["MR","~007",["LMS 010","pin POS.OT"],[999999,-999999]],["NOT","~008",["MR ~007"],[]],["TD","~009",["NOT ~008","SW:REF INITIAL"],[5]],["A","~003",["MR ~002","MR ~006","TD ~009","pin ANN.EN"],[]],["TP","~004",["A ~003","SW:REF INITIAL"],[0.2]],["FFS","~005",["TP ~004","REF ANNRESET"],[]],["FTR","~010",["FTR ~001"],[]],["OR","~011",["TP ~004","A 002","TP 008","TP 020"],[]],["FFR","~012",["OR ~011","REF ANNRESET"],[]],["BTR","~013",["FFR ~012"],[]],["OR","~014",["TP ~004","A 002","TP 008","TP 014","TP 020"],[]],["FFS","~015",["OR ~014","REF ANNRESET"],[]]]},"TCE135 002":{"MR 012":[200,-200],"_b":[["BTR","033",["REF VALVESIMULATIONUSE"],[]],["ASW","003",["pin S.POS.","pin POS.","SW:BTR 033"],[]],["PD","005",["ASW 003","SW:REF INITIAL"],[1,1]],["MR","001",["ASW 003","PD 005"],[10,-50]],["A","002",["MR 001","pin ANNSW"],[]],["FFS","004",["A 002","REF ANNRESET"],[]],["MR","006",["ASW 003","const 0"],[105,-5]],["A","007",["MR 006","pin ANNSW"],[]],["TP","008",["A 007","SW:REF INITIAL"],[0.1]],["FFS","009",["TP 008","REF ANNRESET"],[]],["LMS","010",["const 0"],[100,-5]],["SUB","011",["LMS 010","ASW 003"],[]],["MR","012",["SUB 011","const 0"],[200,-200]],["A","013",["MR 012","pin ANNSW"],[]],["TP","014",["A 013","SW:REF INITIAL"],[5]],["FFS","015",["TP 014","REF ANNRESET"],[]],["SG","034",[],[0]],["MLT","016",["SUB 011","SG 034"],[]],["LMS","017",["MLT 016"],[102.4,-102.4]],["ASW","022",["MLT 016","const 0","SW:BTR 033"],[]],["MR","018",["LMS 017","ASW 022"],[200,-200]],["MR","023",["ASW 022","const 0"],[100,-100]],["A","019",["MR 018","MR 023","pin ANNSW"],[]],["TP","020",["A 019","SW:REF INITIAL"],[0.1]],["FFS","021",["TP 020","REF ANNRESET"],[]],["SUB","024",["ASW 003","PD 005"],[]],["ABS","025",["SUB 024"],[]],["ASW","027",["const 0","HSG 026","SW:REF ANNRESET"],[]],["HSG","026",["ABS 025","ABS 025","ASW 027"],[]],["ASW","029",["const 0","HSG 028","SW:REF ANNRESET"],[]],["HSG","028",["ASW 003","ASW 003","ASW 029"],[]],["ASW","031",["const 0","LSG 030","SW:REF ANNRESET"],[]],["LSG","030",["ASW 003","ASW 003","ASW 031"],[]],["FTR","~001",["ASW 003"],[]],["MR","~002",["FTR ~001","pin POS.OT"],[999999,-999999]],["MR","~006",["LMS 010","FTR ~001"],[999999,-999999]],["MR","~007",["LMS 010","pin POS.OT"],[999999,-999999]],["NOT","~008",["MR ~007"],[]],["TD","~009",["NOT ~008","SW:REF INITIAL"],[5]],["A","~003",["MR ~002","MR ~006","TD ~009","pin ANN.EN"],[]],["TP","~004",["A ~003","SW:REF INITIAL"],[0.2]],["FFS","~005",["TP ~004","REF ANNRESET"],[]],["FTR","~010",["FTR ~001"],[]],["OR","~011",["TP ~004","A 002","TP 008","TP 020"],[]],["FFR","~012",["OR ~011","REF ANNRESET"],[]],["BTR","~013",["FFR ~012"],[]],["OR","~014",["TP ~004","A 002","TP 008","TP 014","TP 020"],[]],["FFS","~015",["OR ~014","REF ANNRESET"],[]]]}},"comp":"LME123"},
    LME113: {"name":"TRIPLE DETECTOR2","pi":["INA","INB","INC","DEV"],"po":{"OUT":"LS 027","DEV":"OR 017"},"b":[["HS","026",["pin INA","pin INB","pin INB"],[]],["HS","028",["pin INA","pin INA","pin INC"],[]],["HS","029",["pin INB","pin INC","pin INC"],[]],["LS","027",["HS 026","HS 028","HS 029"],[]],["SC","025",["pin DEV"],[]],["PA21","014",["pin DEV","SC 025"],[]],["MR","014",["pin INA","pin INB"],[]],["BTR","001",["REF SIMULATIONUSE"],[]],["TP","015",["MR 014","SW:BTR 001"],[1]],["FFS","016",["TP 015","REF ANNRESET"],[]],["PA21","019",["pin DEV","SC 025"],[]],["MR","019",["pin INA","pin INC"],[]],["TP","020",["MR 019","SW:BTR 001"],[1]],["FFS","021",["TP 020","REF ANNRESET"],[]],["PA21","022",["pin DEV","SC 025"],[]],["MR","022",["pin INB","pin INC"],[]],["TP","023",["MR 022","SW:BTR 001"],[1]],["FFS","024",["TP 023","REF ANNRESET"],[]],["OR","017",["FFS 016","FFS 021","FFS 024"],[]]],"at":{"TCE060 003":{},"TCE061 003":{},"TCE062 003":{},"TCE063 003":{},"TCE064 003":{},"TCE065 003":{},"TCE066 003":{},"TCE067 003":{},"TCE068 003":{},"TCE069 003":{}}},
    LME120: {"name":"2OO3","pi":["IN1","IN2","IN3"],"po":{"OUT":"OR 002"},"b":[["A","001",["pin IN1","pin IN2"],[]],["A","003",["pin IN2","pin IN3"],[]],["A","004",["pin IN3","pin IN1"],[]],["OR","002",["A 001","A 003","A 004"],[]]],"at":{"TCE060 014":{},"TCE061 014":{},"TCE062 014":{},"TCE063 014":{},"TCE064 014":{},"TCE065 014":{},"TCE066 014":{},"TCE067 014":{},"TCE068 014":{},"TCE069 014":{}}},
    LME124: {"name":"TMR LVDT DIAGNOSIS","pi":["SIG1","SIG2","SIG3","DEV","ANNSW"],"po":{"OUT":"LS 003","ERR":"OR 004","ERR1":"FFS 009","QUA1":"TP 008","ERR2":"FFS 014","QUA2":"TP 013","ERR3":"FFS 018","QUA3":"TP 017"},"b":[["HS","002",["pin SIG1","pin SIG2","pin SIG2"],[]],["HS","005",["pin SIG1","pin SIG1","pin SIG3"],[]],["HS","010",["pin SIG2","pin SIG3","pin SIG3"],[]],["LS","003",["HS 002","HS 005","HS 010"],[]],["SC","020",["pin DEV"],[]],["PA21","006",["pin DEV","SC 020"],[]],["MR","006",["LS 003","pin SIG1"],[]],["A","007",["MR 006","pin ANNSW"],[]],["TP","008",["A 007","SW:REF INITIAL"],[3]],["FFS","009",["TP 008","REF ANNRESET"],[]],["PA21","011",["pin DEV","SC 020"],[]],["MR","011",["LS 003","pin SIG2"],[]],["A","012",["MR 011","pin ANNSW"],[]],["TP","013",["A 012","SW:REF INITIAL"],[3]],["FFS","014",["TP 013","REF ANNRESET"],[]],["PA21","015",["pin DEV","SC 020"],[]],["MR","015",["LS 003","pin SIG3"],[]],["A","016",["MR 015","pin ANNSW"],[]],["TP","017",["A 016","SW:REF INITIAL"],[3]],["FFS","018",["TP 017","REF ANNRESET"],[]],["OR","004",["FFS 009","FFS 014","FFS 018"],[]]],"at":{"TCE121 012":{},"TCE123 012":{},"TCE125 010":{},"TCE127 010":{},"TCE129 008":{},"TCE131 008":{},"TCE133 006":{},"TCE135 006":{}}},
    LMA110: {"name":"DUAL INPUT DIAGNOSTICS","pi":["SIM","SIG1","I-ERR1","HL","LL","SIG2","I-ERR2","M","DEV","S"],"po":{"DEVE":"FFS 036","I-ERR":"OR 018","OUT":"MJL ~001","ERR":"OR ~021","ERR1":"FFS ~006","QT1":"A ~004","ERR2":"FFS ~010","QT2":"A ~008","ABN":"A ~011"},"b":[["DSW","011",["const 0","REF SIMULATIONUSE","SW:REF OUTSIDESIMULATION"],[]],["ASW","044",["pin SIM","pin SIG1","SW:DSW 011"],[]],["FTR","038",["pin HL"],[]],["FTR","039",["pin LL"],[]],["PA21","022",["FTR 038","FTR 039"],[]],["WCM","022",["ASW 044"],[]],["A","023",["WCM 022","REF ANNENABLE"],[]],["OR","021",["pin I-ERR1","A 023"],[]],["ASW","045",["pin SIM","pin SIG2","SW:DSW 011"],[]],["FTR","040",["pin HL"],[]],["FTR","041",["pin LL"],[]],["PA21","026",["FTR 040","FTR 041"],[]],["WCM","026",["ASW 045"],[]],["A","027",["WCM 026","REF ANNENABLE"],[]],["OR","025",["pin I-ERR2","A 027"],[]],["SUB","028",["ASW 044","ASW 045"],[]],["ABS","029",["SUB 028"],[]],["SUB","030",["ABS 029","pin M"],[]],["UCK","031",["SUB 030"],[-0.01]],["SC","037",["pin DEV"],[]],["PA21","034",["pin DEV","SC 037"],[]],["MR","034",["ASW 045","ASW 044"],[]],["TP","035",["MR 034","SW:REF INITIAL"],[3]],["FFS","036",["TP 035","REF ANNRESET"],[]],["BTR","042",["FFS 036"],[]],["OR","018",["pin I-ERR1","pin I-ERR2","pin I-ERR2"],[]],["SGW","~014",[],[2]],["ASWW","~015",["SGW ~014","pin S","SW:UCK 031"],[]],["FTR","~013",["pin M"],[]],["PA25","~001",["ASWW ~015","FTR ~013"],[]],["MJL","~001",["ASW 044","ASW 045","const 0","OR 021","OR 025","const 1","SW:const 0"],[]],["FTR","~016",["MJL ~001"],[]],["OR","~003",["MJL ~001 out2","OR 021"],[]],["A","~004",["OR ~003","REF ANNENABLE"],[]],["TP","~005",["A ~004","SW:REF INITIAL"],[3]],["FFS","~006",["TP ~005","REF ANNRESET"],[]],["OR","~007",["MJL ~001 out3","OR 025"],[]],["A","~008",["OR ~007","REF ANNENABLE"],[]],["TP","~009",["A ~008","SW:REF INITIAL"],[3]],["FFS","~010",["TP ~009","REF ANNRESET"],[]],["OR","~021",["BTR 042","FFS ~006","FFS ~010"],[]],["BTR","~020",["OR ~021"],[]],["A","~018",["A ~004","A ~008"],[]],["A","~011",["FFS ~010","FFS ~006"],[]]],"at":{"TCA370 001":{},"TCA371 001":{}},"comp":"LMA110A"},
    LME114: {"name":"DUP AI DIAGNOSTICS","pi":["SIM","SIG1","ERR1","HL","LL","SIG2","ERR2","M","DEV","S"],"po":{"DEVE":"FFS 036","I-ERR":"OR 018","OUT":"MJL ~001","ERR":"OR ~002","ABN":"A ~011"},"b":[["DSW","011",["const 0","REF SIMULATIONUSE","SW:REF OUTSIDESIMULATION"],[]],["ASW","020",["pin SIM","pin SIG1","SW:DSW 011"],[]],["FTR","038",["pin HL"],[]],["FTR","039",["pin LL"],[]],["PA21","022",["FTR 038","FTR 039"],[]],["WCM","022",["ASW 020"],[]],["A","023",["WCM 022","REF ANNENABLE"],[]],["OR","021",["pin ERR1","A 023"],[]],["ASW","024",["pin SIM","pin SIG2","SW:DSW 011"],[]],["FTR","040",["pin HL"],[]],["FTR","041",["pin LL"],[]],["PA21","026",["FTR 040","FTR 041"],[]],["WCM","026",["ASW 024"],[]],["A","027",["WCM 026","REF ANNENABLE"],[]],["OR","025",["pin ERR2","A 027"],[]],["SUB","028",["ASW 020","ASW 024"],[]],["ABS","029",["SUB 028"],[]],["SUB","030",["ABS 029","pin M"],[]],["UCK","031",["SUB 030"],[-0.01]],["SC","037",["pin DEV"],[]],["PA21","034",["pin DEV","SC 037"],[]],["MR","034",["ASW 024","ASW 020"],[]],["TP","035",["MR 034","SW:REF INITIAL"],[3]],["FFS","036",["TP 035","REF ANNRESET"],[]],["OR","018",["pin ERR1","pin ERR2","pin ERR2"],[]],["SGW","~014",[],[2]],["ASWW","~015",["SGW ~014","pin S","SW:UCK 031"],[]],["FTR","~013",["pin M"],[]],["PA25","~001",["ASWW ~015","FTR ~013"],[]],["MJL","~001",["ASW 020","ASW 024","const 0","OR 021","OR 025","const 1","SW:const 0"],[]],["FTR","~016",["MJL ~001"],[]],["OR","~003",["MJL ~001 out2","OR 021"],[]],["A","~004",["OR ~003","REF ANNENABLE"],[]],["TP","~005",["A ~004","SW:REF INITIAL"],[3]],["FFS","~006",["TP ~005","REF ANNRESET"],[]],["OR","~007",["MJL ~001 out3","OR 025"],[]],["A","~008",["OR ~007","REF ANNENABLE"],[]],["TP","~009",["A ~008","SW:REF INITIAL"],[3]],["FFS","~010",["TP ~009","REF ANNRESET"],[]],["OR","~002",["FFS ~006","FFS ~010"],[]],["BTR","~020",["OR ~002"],[]],["A","~018",["A ~004","A ~008"],[]],["A","~011",["FFS ~010","FFS ~006"],[]]],"at":{"TCE070 044":{}},"comp":"LME114A"},
    LME100: {"name":"DUP AI DIAGNOSTICSV","pi":["SPA","SPB","SPC","LCA","LCC","LCB","IOEA","TCH","IOEB","IOEC"],"po":{"QT1":"A 042","QT2":"A 052","QT3":"A 062","Y":"MJL ~002","DEV":"OR ~009","ABN":"OR ~014","ERR":"OR ~017","ERRA":"FFS ~018","ERRB":"FFS ~019","ERRC":"FFS ~020"},"b":[["MR","044",["pin SPA","pin SPB"],[10,-10]],["MR","063",["pin SPC","pin SPA"],[10,-10]],["A","045",["MR 044","MR 063"],[]],["A","039",["TP 001","A 045"],[]],["MR","046",["pin SPA","pin LCA"],[500,-500]],["LCK","047",["pin LCA"],[50]],["HS","072",["pin LCC","pin LCB","pin LCA"],[]],["UCK","073",["HS 072"],[100]],["TD","074",["UCK 073","SW:REF INITIAL"],[2]],["A","048",["LCK 047","TD 074"],[]],["OR","040",["A 039","MR 046","A 048","pin IOEA"],[]],["OR","041",["OR 040","MJL ~002 out2"],[]],["A","042",["OR 041","REF ANNENABLE"],[]],["SG","069",[],[0.15]],["SG","071",[],[5]],["ASW","070",["SG 069","SG 071","SW:pin TCH"],[]],["PA15","001",["ASW 070"],[]],["TP","001",["A 042","SW:REF INITIAL"],[]],["FTR","043",["pin SPA"],[]],["MR","053",["pin SPB","pin SPC"],[10,-10]],["A","054",["MR 053","MR 044"],[]],["A","049",["TP 002","A 054"],[]],["MR","056",["pin SPB","pin LCB"],[500,-500]],["LCK","057",["pin LCB"],[50]],["A","058",["LCK 057","TD 074"],[]],["OR","050",["A 049","MR 056","A 058","pin IOEB"],[]],["OR","051",["OR 050","MJL ~002 out3"],[]],["A","052",["OR 051","REF ANNENABLE"],[]],["PA15","002",["ASW 070"],[]],["TP","002",["A 052","SW:REF INITIAL"],[]],["FTR","055",["pin SPB"],[]],["A","064",["MR 063","MR 053"],[]],["A","059",["TP 003","A 064"],[]],["MR","066",["pin SPC","pin LCC"],[500,-500]],["LCK","067",["pin LCC"],[50]],["A","068",["LCK 067","TD 074"],[]],["OR","060",["A 059","MR 066","A 068","pin IOEC"],[]],["OR","061",["OR 060","MJL ~002 out4"],[]],["A","062",["OR 061","REF ANNENABLE"],[]],["PA15","003",["ASW 070"],[]],["TP","003",["A 062","SW:REF INITIAL"],[]],["FTR","065",["pin SPC"],[]],["MJL","~002",["FTR 043","FTR 055","FTR 065","OR 040","OR 050","OR 060","SW:REF INITIAL"],[0,10]],["MR","~003",["FTR 043","FTR 055"],[1,-1]],["TP","~004",["MR ~003","SW:REF INITIAL"],[10]],["FFS","~005",["TP ~004","REF ANNRESET"],[]],["MR","~006",["FTR 055","FTR 065"],[1,-1]],["TP","~007",["MR ~006","SW:REF INITIAL"],[10]],["FFS","~008",["TP ~007","REF ANNRESET"],[]],["MR","~010",["FTR 043","FTR 065"],[1,-1]],["TP","~011",["MR ~010","SW:REF INITIAL"],[10]],["FFS","~012",["TP ~011","REF ANNRESET"],[]],["OR","~009",["FFS ~005","FFS ~008","FFS ~012"],[]],["FFS","~018",["TP 001","REF ANNRESET"],[]],["FFS","~019",["TP 002","REF ANNRESET"],[]],["A","~013",["FFS ~018","FFS ~019"],[]],["FFS","~020",["TP 003","REF ANNRESET"],[]],["A","~015",["FFS ~019","FFS ~020"],[]],["A","~016",["FFS ~018","FFS ~020"],[]],["OR","~014",["A ~013","A ~015","A ~016"],[]],["OR","~017",["FFS ~018","FFS ~019","FFS ~020"],[]]],"at":{"TCE143 002":{}},"comp":"LME101"},
    LME102: {"name":"PTI ERROR DETECT","pi":["ABNA","ABNB","ABNC","SPEED","L-CNTA","H-LCNTSWSPD","L-CNTB","L-CNTC","HFLAGA","HFLAGB","HFLAGC"],"po":{"PTISW":"A 018","H-CNTMODE":"OR 035"},"b":[["TP","017",["const 1","SW:const 1"],[2]],["A","022",["pin ABNA","pin ABNB","pin ABNC"],[]],["MR","024",["pin SPEED","pin L-CNTA"],[10,-10]],["NOT","025",["MR 024"],[]],["SUB","033",["pin SPEED","pin H-LCNTSWSPD"],[]],["LCK","034",["SUB 033"],[0]],["A","026",["NOT 025","pin ABNA","LCK 034"],[]],["MR","027",["pin SPEED","pin L-CNTB"],[10,-10]],["NOT","028",["MR 027"],[]],["A","029",["NOT 028","pin ABNB","LCK 034"],[]],["MR","030",["pin SPEED","pin L-CNTC"],[10,-10]],["NOT","031",["MR 030"],[]],["A","032",["NOT 031","pin ABNC","LCK 034"],[]],["OR","023",["A 022","A 026","A 029","A 032"],[]],["A","019",["REF ANNRESET","OR 023"],[]],["TD","020",["A 019","SW:TP 017"],[2]],["NOT","021",["TD 020"],[]],["A","018",["TP 017","NOT 021"],[]],["OR","035",["pin HFLAGA","pin HFLAGB","pin HFLAGC"],[]]],"at":{"TCE143 013":{}}},
    LMA566: {"name":"EXCI./SYNC./LOADUP MT1","pi":["EXECUT1","FIELD","EXECUT2","ASS","GCB","LOAD","EXECUT3"],"po":{"START1":"A 002","START2":"A 006","START3":"A 009","LOADUP":"A 011","INIT":"A 013"},"b":[["NOT","003",["pin FIELD"],[]],["A","001",["pin EXECUT1","NOT 003"],[]],["A","002",["A 001","REF ATSAUTO"],[]],["A","004",["pin EXECUT2","REF STEPINCRITERIAOK","pin ASS"],[]],["A","006",["A 004","REF ATSAUTO"],[]],["A","008",["pin EXECUT2","REF STEPINCRITERIAOK","pin GCB","pin LOAD"],[]],["A","009",["A 008","REF ATSAUTO"],[]],["A","015",["pin EXECUT3","REF STEPINCRITERIAOK"],[]],["A","011",["A 015","REF ATSAUTO"],[]],["NOT","014",["pin LOAD"],[]],["A","012",["pin EXECUT2","REF STEPINCRITERIAOK","pin GCB","NOT 014"],[]],["A","013",["A 012","REF ATSAUTO"],[]]],"at":{"TCA583 002":{}}},
    LMA569: {"name":"LOAD SET MT1","pi":["LOAD1","LOAD2","LOAD3","LOAD4","LOAD5","LOAD6","LOAD7","AMB.C","COLD2","COLD1","WARM","HOT","LOAD8","LOAD9","LOAD10","LOAD11","LOAD12","LOAD13"],"po":{"INITIAL":"ASW 002","LOADUP":"ASW 006"},"b":[["ASW","008",["pin LOAD6","pin LOAD7","SW:pin AMB.C"],[]],["ASW","007",["pin LOAD5","ASW 008","SW:pin COLD2"],[]],["ASW","005",["pin LOAD4","ASW 007","SW:pin COLD1"],[]],["ASW","004",["pin LOAD3","ASW 005","SW:pin WARM"],[]],["ASW","003",["pin LOAD2","ASW 004","SW:pin HOT"],[]],["NOT","001",["REF ATSAUTO"],[]],["ASW","002",["pin LOAD1","ASW 003","SW:NOT 001"],[]],["ASW","013",["pin LOAD12","pin LOAD13","SW:pin AMB.C"],[]],["ASW","012",["pin LOAD11","ASW 013","SW:pin COLD2"],[]],["ASW","011",["pin LOAD10","ASW 012","SW:pin COLD1"],[]],["ASW","010",["pin LOAD9","ASW 011","SW:pin WARM"],[]],["ASW","009",["pin LOAD8","ASW 010","SW:pin HOT"],[]],["ASW","006",["pin LOAD1","ASW 009","SW:NOT 001"],[]]],"at":{"TCA583A 003":{},"TCA583A 034":{}}},
    LMA575: {"name":"ACC.RATE SELECT MT1","pi":["RATE3","RATE4","RATE5","RATE6","AMB.C","COLD","RATE2","EXECUT","WARM","HOT","RATE1","VACUUM","LPEXH.","VIB.","EXPAN.","BEARING"],"po":{"RATE2":"OR 003","RATE3":"A 007","RATE4":"A 012","RATE1":"A 013","SPEED":"A 016","LOAD":"A 019","RESET":"A 022"},"b":[["OR","011",["pin RATE5","pin RATE6"],[]],["OR","004",["pin RATE4","OR 011"],[]],["OR","030",["pin AMB.C","pin COLD"],[]],["OR","029",["pin RATE3","OR 004","OR 030"],[]],["NOT","014",["pin RATE2"],[]],["A","015",["NOT 014","const 1","pin EXECUT"],[]],["A","002",["OR 029","A 015"],[]],["OR","003",["A 002","pin RATE2"],[]],["OR","006",["pin RATE4","OR 011","pin WARM"],[]],["NOT","010",["OR 030"],[]],["A","007",["OR 006","A 015","NOT 010"],[]],["A","012",["pin HOT","A 015","const 1"],[]],["A","013",["pin RATE1","A 015"],[]],["NOT","017",["pin VACUUM"],[]],["NOT","020",["pin LPEXH."],[]],["NOT","023",["pin VIB."],[]],["NOT","025",["pin EXPAN."],[]],["NOT","027",["pin BEARING"],[]],["OR","026",["NOT 017","NOT 020","NOT 023","NOT 025","NOT 027"],[]],["OR","028",["OR 026","A 013"],[]],["A","016",["OR 028","pin EXECUT","REF ATSAUTO"],[]],["A","019",["OR 028","REF ATSAUTO"],[]],["NOT","021",["A 016"],[]],["NOT","024",["A 019"],[]],["A","022",["NOT 021","NOT 024"],[]]],"at":{"TCA584 002":{}}},
    LMA578A: {"name":"HEAT SOAK TIMER MT1","pi":["MODE3","MODE4","MODE1","TIME1","MODE2","TIME2","TIME3","TIME4"],"po":{"RATED":"FFR 018","INIT":"FFR 026","COMP1":"UCK 006","TIME1":"LMS 008","COMP2":"UCK 014","TIME2":"LMS 016","COMP3":"UCK 022","TIME3":"LMS 024","COMP4":"UCK 030","TIME4":"LMS 032"},"b":[["TW","017",["pin MODE3","SW:REF INITIAL"],[1]],["FFR","018",["TW 017","REF ATSOFF"],[]],["TW","025",["pin MODE4","SW:REF INITIAL"],[1]],["FFR","026",["TW 025","REF ATSOFF"],[]],["SG","043",[],[0.00167]],["FTR","034",["SG 043"],[]],["FTR","033",["const 0"],[]],["ASW","036",["FTR 033","SUM 035","SW:REF TURBINETRIP"],[]],["TW","001",["pin MODE1","SW:REF INITIAL"],[1]],["FFR","002",["TW 001","REF ATSOFF"],[]],["SUM","035",["FTR 034","ASW 036","SW:FFR 002"],[500,0]],["SUB","005",["SUM 035","pin TIME1"],[]],["UCK","006",["SUB 005"],[0]],["SC","007",["SUB 005"],[]],["LMS","008",["SC 007"],[500,0]],["ASW","038",["FTR 033","SUM 037","SW:REF TURBINETRIP"],[]],["TW","009",["pin MODE2","SW:REF INITIAL"],[1]],["FFR","010",["TW 009","REF ATSOFF"],[]],["SUM","037",["FTR 034","ASW 038","SW:FFR 010"],[500,0]],["SUB","013",["SUM 037","pin TIME2"],[]],["UCK","014",["SUB 013"],[0]],["SC","015",["SUB 013"],[]],["LMS","016",["SC 015"],[500,0]],["ASW","040",["FTR 033","SUM 039","SW:REF TURBINETRIP"],[]],["SUM","039",["FTR 034","ASW 040","SW:FFR 018"],[500,0]],["SUB","021",["SUM 039","pin TIME3"],[]],["UCK","022",["SUB 021"],[0]],["SC","023",["SUB 021"],[]],["LMS","024",["SC 023"],[500,0]],["ASW","042",["FTR 033","SUM 041","SW:REF TURBINETRIP"],[]],["SUM","041",["FTR 034","ASW 042","SW:FFR 026"],[500,0]],["SUB","029",["SUM 041","pin TIME4"],[]],["UCK","030",["SUB 029"],[0]],["SC","031",["SUB 029"],[]],["LMS","032",["SC 031"],[500,0]]],"at":{"TCA585 008":{},"TCA586 006":{}}},
    /* TCA582 (lane 0, phase6-tcs-last8-2026-11-26.md 3): RUB CHECK CONTROL MT1 = LMA560 002, ACC.CONTROL MT1 = LMA563A 017 (which name goes
       with which macro INFERRED from the pin names; the record has no title). In LMA563A HEAT2 / TARGET2 are BTR of SYS OFF(0). */
    LMA560: {"name":"RUB CHECK CONTROL MT1","pi":["EXECUT","UPPER","ACC.","SPEED","RUBCHK","FINISH","COMP."],"po":{"UPPER":"A 015","ACC.":"A 016","TARGET1":"A 019","TARGET2":"A 023","COMP.":"A 028","SPEED":"LCK 030"},"b":[["A","015",["pin EXECUT","REF STEPINCRITERIAOK"],[]],["A","016",["pin EXECUT","REF STEPCRITERIAOK","pin UPPER"],[]],["A","020",["A 016","pin ACC."],[]],["SUB","024",["pin SPEED","pin RUBCHK"],[]],["UCK","025",["SUB 024"],[0]],["A","021",["A 020","UCK 025"],[]],["OR","026",["pin FINISH","REF ATSOFF"],[]],["FFR","022",["A 021","OR 026"],[]],["NOT","017",["FFR 022"],[]],["TP","018",["NOT 017","SW:REF INITIAL"],[1]],["NOT","027",["REF ATSOFF"],[]],["A","019",["TP 018","A 020","NOT 027"],[]],["A","023",["FFR 022","REF ATSAUTO"],[]],["SUB","029",["pin SPEED","pin COMP."],[]],["LCK","030",["SUB 029"],[0]],["A","028",["FFR 022","REF ALLVALVECLOSED","LCK 030"],[]]],"at":{"TCA582 002":{}}},
    LMA563A: {"name":"ACC.CONTROL MT1","pi":["COLD","SPEED","HEATA","EXECUT","HEATB","HEAT1","SHELL","TEMP.1","TEMP.2","HEAT3","HEAT2"],"po":{"TARGET1":"A 001","HEAT1":"A 003","TARGET3":"A 018","SET":"A 037","HEAT3":"A 023","COMP.":"A 025","SPEED":"MR 024","SHELL":"A 038","RESET":"TD 031","HEAT2":"BTR 041","TARGET2":"BTR 040"},"b":[["MR","009",["pin SPEED","pin HEATA"],[3000,-50]],["A","001",["pin COLD","MR 009","pin EXECUT","REF STEPCRITERIAOK"],[]],["MR","002",["pin SPEED","pin HEATA"],[-50,-3000]],["A","003",["pin COLD","MR 002","pin EXECUT"],[]],["MR","004",["pin SPEED","pin HEATB"],[-50,-3000]],["A","005",["pin COLD","MR 004","pin EXECUT"],[]],["A","034",["pin HEAT1","pin SHELL","pin TEMP.1","pin TEMP.2"],[]],["NOT","010",["MR 009"],[]],["TW","019",["pin EXECUT","SW:REF INITIAL"],[5]],["A","011",["NOT 010","TW 019"],[]],["OR","035",["A 034","A 011"],[]],["WCM","032",["pin SPEED"],[1490,690]],["NOT","033",["WCM 032"],[]],["A","008",["OR 035","pin EXECUT","REF STEPCRITERIAOK","pin COLD","NOT 033"],[]],["NOT","012",["pin COLD"],[]],["MR","014",["pin SPEED","pin HEATB"],[3000,-50]],["NOT","015",["MR 014"],[]],["A","016",["NOT 015","TW 019"],[]],["OR","036",["NOT 012","A 034","A 016"],[]],["A","018",["OR 036","pin EXECUT","REF STEPCRITERIAOK"],[]],["A","037",["pin EXECUT","pin COLD"],[]],["MR","024",["pin SPEED","REF RATEDSPEED"],[-50,-3600]],["A","023",["pin EXECUT","MR 024"],[]],["A","025",["A 023","pin HEAT3"],[]],["NOT","027",["pin SHELL"],[]],["UCK","026",["pin SPEED"],[1490]],["A","038",["NOT 027","UCK 026"],[]],["UCK","029",["pin SPEED"],[3550]],["A","030",["A 037","pin HEAT3","UCK 029"],[]],["TD","031",["A 030","SW:REF INITIAL"],[2]],["BTR","041",["const 0"],[]],["BTR","040",["const 0"],[]],["BTR","039",["pin HEAT2"],[]]],"at":{"TCA582 017":{}}}
  };
  /* record order of the values (lane 0, tcs-macros-layout-2026-11-26.md question 1: each matched against the drawing blocks of the same
     number, e.g. MR n = 18 of 18, LMS 44 of 44, I 4 of 4, AM 4 of 4) */
  const BKPAR = {
    TP: ['TP'], TD: ['TD'], TW: ['TW'], LCK: ['K'], UCK: ['K'], G: ['K'], GRD: ['K'], LG: ['T'], SG: ['K'], I: ['TI', 'HL', 'LL'],
    RL: ['RI', 'RD'], LIN: ['K', 'B'], LMS: ['HL', 'LL'], MR: ['HL', 'LL'], LIM: ['HL', 'LL'], CMP: ['HL', 'LL'], CPL: ['HL', 'LL'],
    WCM: ['HL', 'LL'], AM: ['R', 'M', 'HL', 'LL'], PD: ['N', 'K'], SUM: ['HL', 'LL'], MJL: ['S', 'M'], SGW: ['K'], AW: ['G1', 'G2', 'G3', 'B'], ML: ['X0', 'C', 'G', 'Y0'], DV: ['X0', 'XC', 'G', 'Y0']
  };
  const BKAT = {};
  for (const lme in BKM) for (const at in BKM[lme].at) BKAT[at] = lme;
  /* the macro of the backup at this sheet + number ("TCE212", "A003" -> "TCE212 003"), or null */
  /* lmeOf: the macro number the drawing prints under the box ("(LME105)", _lib.js TID), when the backup gives that macro's inside and
     the name matches and every value printed beside the box equals the backup's value for that parameter (the drawing wins: a printed
     value that differs keeps the manual-text reading). The backup lists one instance of LME105 (TCE145 005); the drawing names the
     other 145 TRIPPLE INPUT DIAGNOSTICS boxes LME105 with the same TP:3.0, so they are the same library macro. */
  function lmeOf(name, notes) {
    const t = (notes || []).map(q => String(Array.isArray(q) ? q[2] : q));
    const m = t.map(q => /^\((LM[A-Z]\d+[A-Z]?)\)$/.exec(q.trim())).find(Boolean);
    const M = m && BKM[m[1]];
    if (!M || M.name !== name) return null;
    for (const q of t) {
      const kv = /^([A-Z][A-Z0-9]*):\s*(-?[\d.]+)/.exec(q.trim());
      if (!kv) continue;
      for (const [op, , , val] of M.b) {
        const i = (BKPAR[op] || []).indexOf(kv[1]);
        if (i >= 0 && val[i] !== undefined && Math.abs(val[i] - parseFloat(kv[2])) > 1e-9) return null;
      }
    }
    return m[1];
  }
  function bkMacro(sheet, no, hint) {
    const d = /(\d+)\s*$/.exec(String(no || ''));
    if (!d) return null;
    const at = sheet + ' ' + d[1].padStart(3, '0'),
      lme = BKAT[at] || BKAT[sheet + ' ' + d[1]] || hint;
    if (!lme) return null;
    const M = BKM[lme],
      ov = M.at[at] || M.at[sheet + ' ' + d[1]] || {};
    const MB = ov._b || M.b;
    /* an input this engine cannot read keeps the macro on its manual-text reading (open, not guessed): a JOINT from another macro
       (LME100 "JOINT A1 from LME101"), or a side input on a kind whose definition has no SW (SUM with SW in LMA578A / LMA710: the
       macro list gives no SW for ADD / SUM) */
    if (MB.some(([op, , ins]) => ins.some(q => /^JOINT /.test(q)) || (ins.some(q => /^SW:/.test(q)) && K[op] && !/\bsw\b/.test(String(K[op])))))
      return null;
    const bl = MB
      .filter(([op, el, ins, val]) => !(op === 'DENSO' && val[0] === 3)) /* DENSO 3 = sent to the operator screen only */
      .map(([op, el, ins, val]) => {
        const id = op + ' ' + el,
          vals = ov[id] || val,
          notes = op === 'FG' ? vals.map((v, i) => (i % 2 ? 'Y' : 'X') + (((i / 2) | 0) + 1) + ':' + v) : (BKPAR[op] || []).filter((k, i) => vals[i] !== undefined).map((k, i) => k + ':' + vals[i]);
        const L = ins.filter(s => !/^SW:/.test(s)),
          S = ins.find(s => /^SW:/.test(s));
        return { id, op, el, f: /^PA\d\d$/.test(op) ? 'PA' : K[op], notes, L, S: S ? S.slice(3) : null };
      });
    /* PAnm (ML 62, lane 0 question 2): its n inputs give values 1 .. n of the block of the same number, in record order, on line (no
       condition input inside these macros, so always) */
    for (const pa of bl.filter(b => b.f === 'PA')) {
      const tg = bl.find(b => b.f !== 'PA' && b.el === pa.el);
      if (!tg || !BKPAR[tg.op] || pa.L.length > BKPAR[tg.op].length) return null;
      tg.pa = pa.L;
    }
    for (let i = bl.length - 1; i >= 0; i--) if (bl[i].f === 'PA') bl.splice(i, 1);
    if (bl.some(b => !b.f)) return null;
    const refs = [...new Set(MB.flatMap(b => b[2]).map(s => s.replace(/^SW:/, '')).filter(s => /^REF /.test(s)).map(s => s.slice(4)))];
    /* order: a block after the inside blocks that feed it (a loop reads the last scan's value) */
    const by = new Map(bl.map(b => [b.id, b])),
      order = [],
      seen = new Set();
    const visit = b => {
      if (seen.has(b.id)) return;
      seen.add(b.id);
      for (const s of b.L.concat(b.S ? [b.S] : [], b.pa || [])) if (by.has(s)) visit(by.get(s));
      order.push(b);
    };
    bl.forEach(visit);
    const f = (I, notes, st, dt) => {
      const v = (st.v = st.v || {});
      const rd = s => (/^pin /.test(s) ? +I[s.slice(4).replace(/\s+/g, '')] || 0 : /^pb /.test(s) ? +I['PB ' + s.slice(3)] || 0 : /^const /.test(s) ? +s.slice(6) : /^REF /.test(s) ? I['DEF ' + f.map[s.slice(4)]] : v[s] || 0);
      for (const b of order) {
        const bs = (st[b.id] = st[b.id] || {});
        let sw;
        if (b.S) sw = b01(rd(b.S));
        else if (INTL_SW[b.op]) (sw = bs.intl ? 1 : 0), (bs.intl = 1);
        const nt = b.pa ? b.pa.map((s, i) => BKPAR[b.op][i] + ':' + rd(s)).concat(b.notes) : b.notes;
        const y = b.f(b.L.map(rd), nt, bs, dt, sw);
        v[b.id] = y[0];
        for (let k = 1; k < y.length; k++) v[b.id + ' out' + (k + 1)] = y[k]; /* "MJL 001 out2" = the second output (Z1) */
      }
      const O = {};
      for (const p in M.po) O[p.replace(/\s+/g, '')] = v[M.po[p]];
      return O;
    };
    f.src = BK;
    f.lme = lme;
    f.pins = M.pi;
    f.refs = refs;
    f.map = {};
    f.pb = M.pb || [];
    f.need = () => [];
    f.blank = M.blank || [] /* pins of the backup that the drawing leaves blank on purpose (drawing wins): open, not a defect */;
    return f;
  }
  function compile(sheets) {
    /* an explanation sheet (TCE022 LOGIC EXPLANATION, TCE023 PI/O TABLE EXPLANATION) draws examples of the symbols, not logic */
    sheets = sheets.filter(s => !s.legend);
    const nets = sheets.map(s => (s.dwg ? gnet(s) : net(s)));
    /* SH-G-*: a circle "to SH-G-*" goes to every sheet that reads that number "from SH-G-*" */
    for (const n of nets)
      for (const c of n.inputs)
        if (c.from.length === 1 && c.from[0] === 'G-*') c.from = nets.filter(m => m.outc.some(o => o.letter === c.letter && o.sheets.includes('G-*'))).map(m => m.id);
    const J = join(nets);
    const sh = Object.fromEntries(sheets.map(s => [s.id, s])),
      nb = Object.fromEntries(nets.map(n => [n.id, n]));
    const names = [],
      idx = new Map(),
      init = [];
    const slot = (k, v = 0) => {
      if (!idx.has(k)) idx.set(k, names.length), names.push(k), init.push(v);
      return idx.get(k);
    };
    const ports = new Set();
    const port = k => (ports.add(k), slot(k));
    /* definitions by name: the same controller first, then any (a definition is the drawing's name of a signal of the controller) */
    const defs = {};
    for (const n of nets)
      for (const o of n.outputs)
        if (o.kind === 'def') {
          (defs[sh[n.id].ctl + '|' + o.text] = defs[sh[n.id].ctl + '|' + o.text] || []).push([n.id, o.net]);
          (defs['|' + o.text] = defs['|' + o.text] || []).push([n.id, o.net]);
        }
    const part = {};
    for (const n of nets) {
      const S = sh[n.id],
        P = (part[n.id] = new Map());
      for (const b of n.blocks) P.set(b.key, ['b', b]);
      for (const m of n.marks) P.set(m.key, ['m', m]);
      for (const M of n.macros) P.set(M.key, ['M', M]);
      for (const c of n.inputs) P.set(c.key, ['c', c]);
      for (const k of S.k || []) P.set(k[0], ['k', k]);
      for (const r of S.r || []) if (!P.has(r[0])) P.set(r[0], ['r', r]); /* a box that is also a block / macro (G "DI" time relay, TRIPLE DETECTOR) is the block */
      for (const d of S.d || []) if (d[3] === 'in') P.set(d[0], ['d', d]);
      for (const x of S.s || []) if (!P.has(x[0])) P.set(x[0], ['s', x]); /* a G sheet's s source with a circle is its input connector */
    }
    const memo = new Map();
    /* the slot that holds the value of net `key` of sheet `sid` */
    function res(sid, key, depth) {
      const mk = sid + ':' + key;
      if (memo.has(mk)) return memo.get(mk);
      depth = depth || 0;
      const base = key.split('.')[0],
        hit = part[sid].get(key) || part[sid].get(base);
      let r;
      /* Phase 11 (lane 1, YUI PR 682): an input net of a block that no drawn element drives but the sheet names as a port (the operating
         quantity d24b.M of the TINV element, G-5A / G-6A: res.ports['d24b.M'] = 'PLANT:G-5A.d24b.M ...') is that port. Before, the base
         name hit the TINV block itself and the net was a plain slot nobody wrote, so the plant could not feed it */
      if (key.includes('.') && !part[sid].get(key) && nb[sid] && nb[sid].ports && nb[sid].ports[key]) r = port(nb[sid].ports[key]);
      else if (!hit || depth > 40) r = port('UNK:' + mk);
      else {
        const [t, x] = hit;
        if (t === 'b' || t === 'm') r = slot(mk);
        else if (t === 'M') r = slot(sid + ':' + x.key + '.' + (key.includes('.') ? key.slice(base.length + 1) : x.R.find(Boolean) || 'OUT'));
        else if (t === 'c') {
          if (x.src) {
            const T = x.src.slice(0, x.src.indexOf(':')),
              ok = x.src.slice(T.length + 1),
              o = nb[T].outputs.find(o => o.key === ok);
            r = o ? res(T, o.net, depth + 1) : port('CON:' + sid + '.' + (x.pin || x.letter));
          } else {
            const f = x.from.filter(f => /^[A-Z]/.test(f));
            r = port('CON:' + (f.length ? f.join('/') : sid) + '.' + (x.pin || x.letter));
          }
        } else if (t === 'k') {
          const [, , , text, note] = x,
            v = numConst(/^ON\(1\)$/.test(text) ? '1' : /^OFF\(0\)$/.test(text) ? '0' : text);
          if (/ref$/.test(note) && note !== 'sys.ref') {
            const d = defs[sh[sid].ctl + '|' + text] || defs['|' + text];
            r = d && d.length ? res(d[0][0], d[0][1], depth + 1) : port('REF:' + text);
          } else if (v !== null) r = slot('CONST:' + v, v);
          /* MAX (sys.ref, SYSREF AA00006): the largest value of the controller; used only as CL.SPD of VALVE CONTROL MT1 (TCE210 / 211 /
             214), the closing rate when not testing = no limit. INFERRED from the name (lane 0: its number is not printed in the backup) */
          else if (text === 'MAX') r = slot('CONST:MAX', Number.MAX_VALUE);
          else r = port('SYS:' + text);
        } else if (t === 'r' && x[6] === 'fn') r = slot(mk); /* a function box: its node (no meaning yet) holds the value */
        else if ((t === 'r' || t === 's') && nb[sid].ports && nb[sid].ports[x[0]]) r = port(nb[sid].ports[x[0]]);
        else if (t === 'r' || t === 's') {
          /* a PI/O box (r) or a source drawn by its lines (s): named by the table and order printed in it, "(TCA900-1)" = table TCA900
             row 1 (unique in the set); a source that prints ON(1) / OFF(0) is that constant */
          const [x0, y0, x1, y1] = t === 'r' ? [x[1], x[2], x[1] + x[3], x[2] + x[4]] : [Math.min(x[1], x[3]), Math.min(x[2], x[4]), Math.max(x[1], x[3]), Math.max(x[2], x[4])],
            m = 6,
            tx = (sh[sid].t || []).filter(w => w[0] >= x0 - m && w[0] <= x1 + m && w[1] >= y0 - m && w[1] <= y1 + m).map(w => String(w[2]).trim()),
            /* the table / order is printed at the box or just right of it, on its top line (TCE_LIB.di: 350 right, 6 over the top) */
            io = (sh[sid].t || [])
              .filter(w => w[0] >= x0 - m && w[0] <= x1 + 120 && w[1] >= y0 - 16 && w[1] <= y1 + m && /\(T[A-Z]{2}\d+[A-Z]?-\d+\)/.test(w[2]))
              .sort((a, b) => Math.hypot(a[0] - x1, a[1] - y0) - Math.hypot(b[0] - x1, b[1] - y0))
              .map(w => /\((T[A-Z]{2}\d+[A-Z]?-\d+)\)/.exec(w[2]))[0],
            on = tx.find(w => /^(ON\(1\)|OFF\(0\))$/.test(w)),
            /* a PI/O error box prints the table / order of its card or channel, the same words as the value of that row ("(TCA900-1)" on
               TCA040 is DI 1 and the card error; "(TCA932-3)" on TCA322 is the AI and its error): the error is its own signal, "<row> ERR" */
            err = t === 'r' && x[5] === 'PI/O error' ? ' ERR' : '';
          r = io ? port('PIO:' + io[1] + err) : on ? slot('CONST:' + +/\((\d)\)/.exec(on)[1], +/\((\d)\)/.exec(on)[1]) : port('PIO:' + sid + '.' + x[0] + (tx.length ? ' ' + tx.join(' ') : ''));
        } else if (t === 'd') r = port('CRT:' + sid + '.' + (x[4] || x[0]));
        else r = port('SRC:' + mk);
      }
      memo.set(mk, r);
      return r;
    }
    const plan = [],
      unknown = {};
    for (const n of nets) {
      const S = sh[n.id],
        nodes = [];
      for (const m of n.marks)
        nodes.push({ t: 'm', out: slot(n.id + ':' + m.key), ins: m.in ? [res(n.id, m.in)] : [], inv: m.type === 'NC' });
      for (const b of n.blocks) {
        /* pr: the parameters printed on the page beside the block (or in its FG table) that the typed drawing keeps as text only */
        const notes = S.pr && S.pr[b.key] ? (b.notes || []).concat(S.pr[b.key]) : b.notes,
          f = kind(b.type),
          L = b.ins.filter(i => i.side === 'l'),
          side = b.ins.find(i => i.side !== 'l');
        if (!f) unknown[b.type] = (unknown[b.type] || 0) + 1;
        nodes.push({
          t: 'b',
          f,
          key: b.key,
          type: b.type,
          notes,
          out: slot(n.id + ':' + b.key),
          ins: L.map(i => res(n.id, i.net)),
          inv: L.map(i => !!i.inv),
          sw: side ? res(n.id, side.net) : -1,
          /* swc: the SW the drawing leaves unwired, read from the block's HIACS backup record (sheet field swc, key -> value; source
             in the sheet's comment): 102_DD00001 = the constant ON(1) (phase6-tcs-records-2026-11-26.md) */
          swc: !side && S.swc && S.swc[b.key] !== undefined ? S.swc[b.key] : undefined,
          /* a G sheet (310SD03-743) is a relay diagram, not a HIACS macro: its time relays have no SW input */
          open: need(b.type, notes, !!side || !!S.dwg || !!(S.swc && S.swc[b.key] !== undefined)),
          st: {}
        });
        /* UNT-FG with no table on the page (TCE212 003 / 036): the inside of the backup macro (LME010, three FG and their selection) */
        const ub = b.type === 'UNT-FG' && bkMacro(n.id, b.no);
        if (ub && ub.pins.length === 1 && L.length === 1) {
          const x = nodes[nodes.length - 1],
            po = Object.keys(BKM[ub.lme].po)[0];
          x.f = (xs, nt, st, dt) => [ub({ [ub.pins[0]]: xs[0] }, nt, st, dt)[po]];
          x.open = [];
          x.src = BK;
        }
      }
      /* ML 62 PA (parameter modify, TCA019): PA<n> number N gives on line the parameters of the block N of the sheet (drawn beside
         it: TCE196 PA3 005 -> I 005, TCA533 PA2 010 -> CMP 010). Which parameter each input gives is the name printed at the input
         ("(TI)", "HL"), or, where none is printed, the sheet's own pa list (with its reason); an input with no name stays open. */
      for (const b of n.blocks) {
        if (!/^PA\d$/.test(b.type)) continue;
        const sb = (S.b || []).find(x => x[0] === b.key),
          dg = z => (/\d+$/.exec(String(z)) || [''])[0],
          /* the block of the same number (the drawing may print the PA without the letter: PA2 013 -> RL C013), the nearest one */
          tb =
            sb &&
            (S.b || [])
              .filter(x => x[0] !== b.key && !/^PA/.test(x[1]) && (x[2] === sb[2] || (dg(x[2]) && dg(x[2]) === dg(sb[2]))))
              .sort((a, c) => Math.hypot(a[3] - sb[3], a[4] - sb[4]) - Math.hypot(c[3] - sb[3], c[4] - sb[4]))[0],
          tn = tb && nodes.find(x => x.key === tb[0]);
        if (!tn) continue;
        const L = sb[3] - ((sb[7] && sb[7][0]) || 59) / 2,
          given = (S.pa && S.pa[b.key]) || [];
        tn.pa = tn.pa || {};
        b.ins
          .filter(i => i.side === 'l')
          .sort((a, c) => a.y - c.y)
          .forEach((i, k) => {
            /* the name is printed at the pin or along the wire of that input ("(LL)" of TCE195 sits on the riser of G 029) */
            const segs = (S.w || []).filter(x => x[0] === i.net).flatMap(x => x[1].slice(1).map((q, j) => [x[1][j], q])),
              dseg = (P0, [A, B]) => {
                const dx = B[0] - A[0],
                  dy = B[1] - A[1],
                  t = dx || dy ? Math.max(0, Math.min(1, ((P0[0] - A[0]) * dx + (P0[1] - A[1]) * dy) / (dx * dx + dy * dy))) : 0;
                return Math.hypot(P0[0] - A[0] - t * dx, P0[1] - A[1] - t * dy);
              },
              near = w => (w[0] > L - 90 && w[0] < L + 5 && Math.abs(w[1] - i.y) < 14) || segs.some(g => dseg(w, g) < 22),
              lab = (S.t || [])
                .filter(w => /^\(?[A-Z][A-Z0-9]{0,3}\)?$/.test(String(w[2]).trim()) && near(w))
                .sort((a, c) => Math.abs(a[1] - i.y) - Math.abs(c[1] - i.y))[0],
              name = lab ? /[A-Z][A-Z0-9]*/.exec(lab[2])[0] : given[k];
            if (name) tn.pa[name] = res(n.id, i.net);
          });
        const has = Object.keys(tn.pa).map(k => k + ':0');
        tn.open = need(tn.type, has.concat(tn.notes || []), tn.sw >= 0 || !!S.dwg);
      }
      /* a function box drawn as a plain box ('fn': TRIPLE DETECTOR2, 2OO3): a block with no meaning yet, so its sheet does not run */
      for (const x of S.r || [])
        if (x[6] === 'fn') {
          const [x0, y0] = [x[1], x[2]],
            name = (S.t || []).filter(w => w[0] >= x0 && w[0] <= x0 + x[3] && w[1] >= y0 && w[1] <= y0 + 30).map(w => String(w[2]).trim())[0] || x[0];
          unknown['BOX ' + name] = (unknown['BOX ' + name] || 0) + 1;
          nodes.push({ t: 'b', f: null, type: 'BOX ' + name, notes: [], out: slot(n.id + ':' + x[0]), ins: [], inv: [], sw: -1, open: [], st: {} });
        }
      for (const M of n.macros) {
        /* the inside from the HIACS backup comes first (it is the program itself); the manual-text reading stays for the others */
        const name = M.type.slice(2),
          bk0 = bkMacro(n.id, M.no, lmeOf(name, M.notes)),
          /* a backup macro that gives only part of the outputs the drawing draws (the rest come from a companion macro through JOINT,
             e.g. LME111 -> LME111A, LME122 -> LME123, not read yet) keeps the manual-text reading: no drawn output is left unfed */
          /* a drawn pin name is the backup's when they match without spaces, or also without dots where the drawing drops the
             backup's last dot (TCA582 "COMP" = backup "COMP.") */
          bkN = bk0 ? [...new Set(Object.keys(BKM[bk0.lme].po).concat(bk0.pins).map(k => k.replace(/\s+/g, '')))] : [],
          nzb = q => {
            const z = String(q).replace(/\s+/g, '');
            return bkN.includes(z) ? z : bkN.find(k => k.replace(/\./g, '') === z.replace(/\./g, '')) || z;
          },
          poN = bk0 ? new Set(Object.keys(BKM[bk0.lme].po).map(k => k.replace(/\s+/g, ''))) : new Set(),
          drawnIn = new Set(M.ins.filter(i => i.name).map(i => nzb(i.name))),
          /* ... and so does one with an input pin the drawing leaves undrawn while a manual-text reading exists (what the record
             feeds there is not read) */
          bk =
            bk0 &&
            M.R.every(p => !p || poN.has(nzb(p))) &&
            !(MACRO[name] && bk0.pins.some(q => !drawnIn.has(q.replace(/\s+/g, '')) && !bk0.blank.includes(q)))
              ? bk0
              : null,
          f = bk || MACRO[name] || null;
        if (!f) unknown[M.type] = (unknown[M.type] || 0) + 1;
        const nz = q => (bk ? nzb(q) : q);
        const outs = {};
        M.R.forEach(p => p && (outs[nz(p)] = slot(n.id + ':' + M.key + '.' + p)));
        const ins = {};
        for (const i of M.ins) if (i.name) ins[nz(i.name)] = res(n.id, i.net);
        if (bk) {
          for (const r of bk.refs) {
            const t = Object.keys(defs).filter(k => k[0] === '|' && k.slice(1).replace(/\s+/g, '') === r).map(k => k.slice(1))[0];
            bk.map[r] = t || r;
            const dd = t && (defs[S.ctl + '|' + t] || defs['|' + t]);
            /* no definition of that name on any sheet: the sheet connector that carries a signal of the same name (FORCED CLOSE = TCE053 E,
               received under that name by TCE180 / 183 / 184 / 206); one signal, one name (INFERRED from the name, logged in slice C) */
            const cn = !(dd && dd.length) && sheets.flatMap(q => (q.c || []).filter(c => c[1] === 'in' && String(c[5]).replace(/\s+/g, '') === r).map(c => [q.id, c[0]]))[0];
            ins['DEF ' + (t || r)] = dd && dd.length ? res(dd[0][0], dd[0][1]) : cn ? res(cn[0], cn[1]) : port('REF:' + (t || r));
          }
          /* a pin of the backup macro that the drawing does not draw stays open (its value in HIACS is not known) */
          const miss = bk.pins.filter(q => !(nz(q) in ins) && !bk.blank.includes(q));
          bk.need = () => miss.map(q => 'pin ' + q + ' not drawn');
        }
        /* push buttons of the operator station that the macro holds inside (MOTOR STANDARD: START / STOP / AUTO / MANUAL / RESET of the
           typical, IBD 310SC90-794 sheet 14): a CRT port of the block, "CRT:<sheet>.<block>.<button>" */
        for (const k of (f && f.pb) || []) ins['PB ' + k] = port('CRT:' + n.id + '.' + M.key + '.' + k);
        /* signals the macro reads by their definition name (CRI MONT.MD: "STEP IN n ORDER" / "STEP n EXECUTING" of the step sheets),
           as "DEF <name>"; one no sheet gives stays a REF port */
        for (const d of (f && f.defs) || []) {
          const dd = defs[S.ctl + '|' + d] || defs['|' + d];
          ins['DEF ' + d] = dd && dd.length ? res(dd[0][0], dd[0][1]) : port('REF:' + d);
        }
        /* parameters printed INSIDE the block (CRI MONT.MD: the K tables IN0 .. IN8 / EX0 .. EX8) are its notes too */
        const box = f && f.inBox && (S.m || []).find(e => e[0] === M.key),
          notes = box ? M.notes.concat((S.t || []).filter(w => w[0] >= box[3] && w[0] <= box[3] + box[5] && w[1] >= box[4] && w[1] <= box[4] + box[6])) : M.notes;
        const open = f && f.need ? f.need(notes).map(k => name + ' needs ' + k) : [];
        nodes.push({ t: 'M', f, name, notes, ins, outs, st: {}, open, src: f && f.src });
      }
      /* order: a node after the nodes of this sheet that feed it (depth first; a loop keeps the last scan's value) */
      const by = new Map();
      nodes.forEach(x => (x.t === 'M' ? Object.values(x.outs) : [x.out]).forEach(o => by.set(o, x)));
      const done = new Set(),
        busy = new Set(),
        order = [];
      const visit = x => {
        if (done.has(x) || busy.has(x)) return;
        busy.add(x);
        const deps = x.t === 'M' ? Object.values(x.ins) : x.ins.concat(x.sw >= 0 ? [x.sw] : []);
        for (const d of deps) if (by.has(d)) visit(by.get(d));
        busy.delete(x);
        done.add(x);
        order.push(x);
      };
      nodes.forEach(visit);
      plan.push({ id: n.id, ctl: S.ctl, cyc: (S.cycle || 100) / 1000, acc: 0, nodes: order, blocks: n.blocks.length, macros: n.macros.length });
    }
    const v = Float64Array.from(init);
    const prog = { names, idx, v, ports: [...ports].sort(), plan, nets, parts: part, join: J, unknown, res, t: 0 };
    return prog;
  }
  /* one scan of one sheet at its cycle dt */
  function scan(prog, p, dt) {
    const v = prog.v;
    for (const x of p.nodes) {
      if (x.t === 'm') v[x.out] = x.ins.length ? (x.inv ? b01(!v[x.ins[0]]) : v[x.ins[0]]) : NaN;
      else if (x.t === 'b') {
        if (!x.f) {
          v[x.out] = NaN;
          continue;
        }
        const xs = x.ins.map((s, i) => (x.inv[i] ? b01(!v[s]) : v[s]));
        let sw;
        if (x.sw >= 0) sw = b01(v[x.sw]);
        else if (x.swc !== undefined) sw = x.swc;
        else if (INTL_SW[x.type]) (sw = x.st.intl ? 1 : 0), (x.st.intl = 1);
        const nt = x.pa ? Object.keys(x.pa).map(k => k + ':' + v[x.pa[k]]).concat(x.notes || []) : x.notes;
        v[x.out] = x.f(xs, nt, x.st, dt, sw)[0];
      } else {
        if (!x.f) {
          for (const k in x.outs) v[x.outs[k]] = NaN;
          continue;
        }
        const I = {};
        for (const k in x.ins) I[k] = v[x.ins[k]];
        const O = x.f(I, x.notes, x.st, dt) || {};
        for (const k in x.outs) v[x.outs[k]] = k in O ? +O[k] : NaN;
      }
    }
  }
  /* advance the whole set by dt plant seconds: each sheet scans as many times as its cycle fits */
  function step(prog, dt) {
    for (const p of prog.plan) {
      p.acc += dt;
      while (p.acc >= p.cyc - 1e-9) {
        scan(prog, p, p.cyc);
        p.acc -= p.cyc;
      }
    }
    prog.t += dt;
  }
  const set = (prog, name, val) => {
    const i = prog.idx.get(name);
    if (i === undefined || !prog.ports.includes(name)) return false;
    prog.v[i] = +val;
    return true;
  };
  /* the value of the net `key` of sheet `sid` (the live reads of a sheet name these keys) */
  const get = (prog, sid, key) => prog.v[prog.res(sid, key)];
  /* the operator station side (HMI, lane 9): every CRT push button (a port to force) and every CRT lamp (an output to read) */
  function crt(prog) {
    const buttons = prog.ports.filter(n => /^CRT:/.test(n)).map(port => {
        const r = port.slice(4),
          i = r.indexOf('.');
        return { port, sheet: r.slice(0, i), tag: r.slice(i + 1) };
      }),
      lamps = [];
    for (const n of prog.nets) for (const o of n.outputs) if (o.kind === 'd') lamps.push({ sheet: n.id, key: o.key, tag: o.text });
    return { buttons, lamps };
  }
  /* what the program WRITES (every prog.ports entry is an input it only reads): each output of a sheet with where it goes. kind 'crt' = a
     CRT lamp, 'pio' = a PI/O output box (to the field / DCS), 'con' = a connector to a sheet outside the TCE / TCA set, 'spare' = a connector printed "(-)" */
  function outs(prog) {
    const ids = new Set(prog.nets.map(n => n.id)),
      L = [];
    for (const n of prog.nets)
      for (const o of n.outputs) {
        const inside = (o.sheets || []).some(x => ids.has(x)) || /^circle .* to (G-|\(this sheet\))/.test(o.to || ''),
          kind = o.kind === 'd' ? 'crt' : o.kind === 'r' ? 'pio' : o.kind === 'c' && !inside ? ((o.sheets || []).every(x => x === '-') ? 'spare' : 'con') : null;
        if (kind) L.push({ sheet: n.id, key: o.key, kind, to: o.to, row: o.row, slot: prog.res(n.id, o.net) });
      }
    return L;
  }
  /* read with no side effect: a net or part key of the sheet, a CRT lamp by key or tag, a CRT button by tag; undefined if unknown */
  function read(prog, sid, key) {
    const n = prog.nets.find(x => x.id === sid);
    if (!n) return undefined;
    const lamp = n.outputs.find(o => o.kind === 'd' && (o.key === key || o.text === key));
    if (lamp) return prog.v[prog.res(sid, lamp.net)];
    const btn = prog.idx.get('CRT:' + sid + '.' + key);
    if (btn !== undefined) return prog.v[btn];
    const known = prog.names.indexOf(sid + ':' + key);
    if (known >= 0) return prog.v[known];
    const P = prog.parts && prog.parts[sid];
    return P && (P.has(key) || P.has(key.split('.')[0])) ? prog.v[prog.res(sid, key)] : undefined;
  }
  /* what runs: per sheet, every block and macro with a meaning = the sheet runs as its logic */
  function stats(prog) {
    let run = 0,
      blocks = 0,
      bOk = 0,
      macros = 0,
      mOk = 0,
      mText = 0,
      mBk = 0 /* macros and UNT-FG run from the inside of the HIACS backup */;
    const notRun = [],
      runText = [] /* sheets that run with a macro meaning from the manual text (inside not drawn): QA counts them apart */,
      open = {};
    for (const p of prog.plan) {
      let ok = true,
        text = false;
      for (const x of p.nodes) {
        if (x.t === 'b') (blocks++, x.f ? bOk++ : (ok = false));
        if (x.t === 'b' && x.open && x.open.length) {
          ok = false;
          for (const w of x.open) (open[w] = open[w] || new Set()).add(p.id);
        }
        if (x.t === 'M') (macros++, x.f ? mOk++ : (ok = false), x.src === TEXT && (mText++, (text = true)));
        if (x.src === BK) mBk++;
        if (x.t === 'M' && x.open && x.open.length) {
          ok = false;
          for (const w of x.open) (open[w] = open[w] || new Set()).add(p.id);
        }
      }
      ok ? (run++, text && runText.push(p.id)) : notRun.push(p.id);
    }
    const kinds = {};
    for (const n of prog.ports) {
      const k = n.split(':')[0];
      kinds[k] = (kinds[k] || 0) + 1;
    }
    for (const w in open) open[w] = [...open[w]].sort();
    return { sheets: prog.plan.length, run, runText, notRun, open, blocks, bOk, macros, mOk, mText, mBk, ports: prog.ports.length, portKinds: kinds };
  }
  root.TCE_RUN = { crt, read, outs, K, par, REQ, EXTRA, need, KINDS, ALIAS, MARK, kind, net, gnet, join, compile, step, scan, set, get, stats, MACRO, TEXT, BK, BKM, bkMacro };
})(typeof window !== 'undefined' ? window : globalThis);
