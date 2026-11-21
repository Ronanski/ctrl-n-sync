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
     sw = the SW side input where the block has one; a block drawn without a SW wire runs as SW=1 (the macro list: SW selects the
     normal mode; with no wire the HIACS default is the normal mode). */
  const K = {
    /* ML 1 ADD Y = X1 + X2 + .. + Xn */
    ADD: x => [x.reduce((a, v) => a + v, 0)],
    /* ML 2 SUB Y = X1 - X2 - .. - Xn */
    SUB: x => [x.slice(1).reduce((a, v) => a - v, x[0] || 0)],
    /* ML 3 MLT Y = X1 * X2 */
    MLT: x => [(x[0] || 0) * (x[1] || 0)],
    /* ML 4 DIV Y = X1 / X2 (a zero divisor holds the last value: the macro list gives no rule, HIACS keeps Y(j-1)) */
    DIV: (x, n, st) => [(st.y = x[1] ? x[0] / x[1] : st.y || 0)],
    /* ML 9 I integral: SW=1 Y = (1/TI) * integral X dt + F; SW=0 Y = Z; LL <= Y <= HL */
    I: (x, n, st, dt, sw = 1) => {
      const [X = 0, F = 0, Z = 0] = x,
        TI = par(n, 'TI', 1),
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
      const T = par(n, 'T', 0);
      st.y = !sw || st.y === undefined || !T ? x[0] : st.y + ((x[0] - st.y) * dt) / Math.max(T, dt);
      return [st.y];
    },
    /* ML 12 PIF PI with feedforward: SW=1 Y = G X + (1/TI) integral X dt + F; SW=0 (tie-back) Y = Z; LL <= Y <= HL */
    PIF: (x, n, st, dt, sw = 1) => {
      const [X = 0, F = 0, Z = 0] = x,
        G = par(n, 'G', 1),
        TI = par(n, 'TI', 1),
        HL = par(n, 'HL', Infinity),
        LL = par(n, 'LL', -Infinity);
      if (!sw) st.i = Z - G * X - F;
      else st.i = (st.i ?? Z - G * X - F) + (X * dt) / TI;
      const y = clamp(G * X + st.i + F, LL, HL);
      st.i = y - G * X - F;
      return [y];
    },
    /* ML 13 PIV velocity PI: SW=1 Y = G1 (X(j) - X(j-1)) + G2 (TS/TI) X(j) + F (incremental: added to Y(j-1)); SW=0 Y = 0 */
    PIV: (x, n, st, dt, sw = 1) => {
      const [X = 0, F = 0] = x,
        G1 = par(n, 'G1', 1),
        G2 = par(n, 'G2', 1),
        TI = par(n, 'TI', 1);
      if (!sw) {
        st.x = X;
        return [0];
      }
      const y = G1 * (X - (st.x ?? X)) + (G2 * dt * X) / TI + F;
      st.x = X;
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
    SG: (x, n) => [par(n, 'K', 0)],
    SGW: (x, n) => [par(n, 'K', 0)],
    /* ML 21 AM analog memory: SW=0 Y = Z (tracking); SW=1 Y up / down by the binary I / D at the rate R, LL <= Y <= HL */
    AM: (x, n, st, dt, sw = 1) => {
      const [I = 0, D = 0, Z = 0] = x,
        R = par(n, 'R', 0),
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
    /* ML 27 G Y = K X */
    G: (x, n) => [par(n, 'K', 1) * x[0]],
    /* ML 28 MR monitor relay: Y = 1 when X1 - X2 > HL or < LL */
    MR: (x, n) => {
      const d = x[0] - (x[1] || 0);
      return [b01(d > par(n, 'HL', Infinity) || d < par(n, 'LL', -Infinity))];
    },
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
      const N = par(n, 'N', 2);
      st.h = sw ? (st.h || []).concat(x[0]).slice(-N) : [x[0]];
      return [st.h.reduce((a, v) => a + v, 0) / st.h.length];
    },
    /* ML 35 GRD gradient: Y = (2 X(j) + X(j-1) - X(j-3) - 2 X(j-4)) K / (10 TS); SW=0 Y = 0 */
    GRD: (x, n, st, dt, sw = 1) => {
      st.h = (st.h || []).concat(x[0]).slice(-5);
      if (!sw || st.h.length < 5) return [0];
      const h = st.h;
      return [((2 * h[4] + h[3] - h[1] - 2 * h[0]) * par(n, 'K', 1)) / (10 * dt)];
    },
    /* ML 37 PD pure delay: SW=1 the input of N K cycles before; SW=0 Y = X */
    PD: (x, n, st, dt, sw = 1) => {
      const L = Math.max(1, par(n, 'N', 1) * par(n, 'K', 1));
      st.h = sw ? (st.h || []).concat(x[0]).slice(-(L + 1)) : [x[0]];
      return [st.h[0]];
    },
    /* ML 39 LIN Y = K X + B */
    LIN: (x, n) => [par(n, 'K', 1) * x[0] + par(n, 'B', 0)],
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
      return [b01(sw && x[0] && st.t >= par(n, 'TP', 0) - 1e-9)];
    },
    /* ML 48 TD drop-out delay: X 0 -> 1, Y = 1 at once; X 1 -> 0, Y = 0 after TD; SW=0 Y = 0 */
    TD: (x, n, st, dt, sw = 1) => {
      if (!sw) return [(st.t = 0)];
      if (x[0]) st.t = par(n, 'TD', 0) + 1e-9;
      else st.t = Math.max(0, (st.t || 0) - dt);
      return [b01(x[0] || st.t > 0)];
    },
    /* ML 49 TW wipe-out: X 0 -> 1, Y = 1 for TW, then 0 until X goes 0 -> 1 again; SW=0 Y = 0 */
    TW: (x, n, st, dt, sw = 1) => {
      if (!sw) return [(st.t = 0)];
      if (x[0] && !st.x) st.t = par(n, 'TW', 0);
      else st.t = Math.max(0, (st.t || 0) - dt);
      st.x = x[0];
      return [b01(st.t > 0)];
    },
    /* ML 50 FFR / FFS flip flop, S = X1, R = X2: 0 0 holds, 0 1 -> 0, 1 0 -> 1, 1 1 -> 0 (FFR, reset priority) or 1 (FFS, set priority) */
    FFR: (x, n, st) => [(st.y = x[0] && !x[1] ? 1 : x[1] ? 0 : st.y || 0)],
    FFS: (x, n, st) => [(st.y = x[0] ? 1 : x[1] ? 0 : st.y || 0)],
    /* ML 51 CMP comparator with hysteresis: from 1 it drops at X <= LL, from 0 it picks up at X >= HL; SW=0 Y = (X >= HL) */
    CMP: (x, n, st, dt, sw = 1) => {
      const HL = par(n, 'HL', 0),
        LL = par(n, 'LL', HL);
      st.y = !sw ? b01(x[0] >= HL) : st.y ? b01(x[0] > LL) : b01(x[0] >= HL);
      return [st.y];
    },
    /* ML 52 CPL comparator for a low value: from 1 it drops at X >= HL, from 0 it picks up at X <= LL */
    CPL: (x, n, st) => {
      const HL = par(n, 'HL', 0),
        LL = par(n, 'LL', HL);
      st.y = st.y ? b01(x[0] < HL) : b01(x[0] <= LL);
      return [st.y];
    },
    /* ML 54 CNT counts X 0 -> 1, Y = 1 at count >= N; SW=0 Y = 0 and the count clears */
    CNT: (x, n, st, dt, sw = 1) => {
      if (!sw) st.c = 0;
      else if (x[0] && !st.x) st.c = (st.c || 0) + 1;
      st.x = x[0];
      return [b01(sw && (st.c || 0) >= par(n, 'N', 1))];
    },
    /* ML 56 FLK flicker: while X = 1, Y = 1 for T1 then 0 for T2, repeated; SW=0 Y = 0 */
    FLK: (x, n, st, dt, sw = 1) => {
      if (!sw || !x[0]) return [(st.t = 0)];
      const T1 = par(n, 'T1', 0.5),
        T2 = par(n, 'T2', 0.5);
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
    LCK: (x, n) => [b01(x[0] < par(n, 'K', 0))],
    UCK: (x, n) => [b01(x[0] > par(n, 'K', 0))],
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
    /* ML 59 TB tie-back: primary flag (SW) = 1 Y = X, else Y = the tie-back value X2 */
    TB: (x, n, st, dt, sw = 1) => [sw ? x[0] : x[1]],
    /* ML 62 PA* parameter modify: the new value X is taken while its condition (SW) is met, else the previous value is kept */
    PA: (x, n, st, dt, sw = 1) => [(st.y = sw || st.y === undefined ? x[0] : st.y)],
    /* SUM: the sheets' name for ML 1 ADD drawn with its limiter printed under it (HL / LL, as ML 5 AW) */
    SUM: (x, n) => [clamp(x.reduce((a, v) => a + v, 0), par(n, 'LL', -Infinity), par(n, 'HL', Infinity))]
  };
  /* the drawing's other names for the same kinds: a gate box typed "G:OR" / "G:A" is the OR / AND of ML 45 / 44; PA1 ~ PA4 are
     ML 62 with 1 ~ 4 inputs; the circles on a wire ("o:BTR", "o:FTR") are ML 58 / 57 (TCA018: 008 / 005). */
  const ALIAS = { 'G:OR': 'OR', 'G:A': 'A', PA1: 'PA', PA2: 'PA', PA3: 'PA', PA4: 'PA', 'o:BTR': 'BTR', 'o:FTR': 'FTR' };
  /* marks that are not blocks: X inverts the wire it sits on (the netlist sets inv), NC is a pin drawn not connected */
  const MARK = { X: 1, NC: 1 };
  const kind = t => K[t] || K[ALIAS[t]] || null;
  const KINDS = Object.keys(K);
  root.TCE_RUN = { K, par, KINDS, ALIAS, MARK, kind };
})(typeof window !== 'undefined' ? window : globalThis);
