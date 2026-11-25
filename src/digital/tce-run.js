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
    SUM: (x, n) => [clamp(x.reduce((a, v) => a + v, 0), par(n, 'LL', -Infinity), par(n, 'HL', Infinity))]
  };
  /* the drawing's other names for the same kinds: a gate box typed "G:OR" / "G:A" is the OR / AND of ML 45 / 44; PA1 ~ PA4 are
     ML 62 with 1 ~ 4 inputs; the circles on a wire ("o:BTR", "o:FTR") are ML 58 / 57 (TCA018: 008 / 005). */
  /* the parameters a block cannot run without (macro list TCA013 ~ TCA020: each is named in the definition of its ML). A block that
     misses one, prints one the definition does not have, or has a SW input with no wire is OPEN: its sheet does not count as running
     (QA : SAORI review 2026-11-25: a missing parameter is an open item, never a default). */
  const REQ = {
    MODE: ['L1', 'L2', 'L3', 'L4', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6'],
    I: ['TI'], LG: ['T'], PIF: ['G', 'TI'], PIV: ['G1', 'G2', 'TI'], SG: ['K'], SGW: ['K'], AM: ['R'], G: ['K'], FLT: ['N'], GRD: ['K'],
    PD: ['N', 'K'], LIN: ['K', 'B'], TP: ['TP'], TD: ['TD'], TW: ['TW'], CMP: ['HL'], CPL: ['HL'], CNT: ['N'], FLK: ['T1', 'T2'],
    LCK: ['K'], UCK: ['K']
  };
  /* printed parameters that the definition of the ML does not have: their meaning is open until a document gives it */
  const EXTRA = { AM: ['M'] };
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
        }
    }
    return W.map(w => (key.has(w) ? [key.get(w)].concat(w.slice(1)) : w));
  }
  function net(s) {
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
    const inputs = (s.c || []).filter(c => c[1] === 'in').map(c => ({ key: c[0], letter: c[2], name: c[5], from: (c[6] || []).map(f => (f === '*' ? s.id : f)) }));
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
        blocks.push({ key, type: m || st ? 'TP' : 'TP?', no: '', notes, pins: {}, ex: x, ys: [y, y + h], ins: [] });
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
      if (!hit || depth > 40) r = port('UNK:' + mk);
      else {
        const [t, x] = hit;
        if (t === 'b' || t === 'm') r = slot(mk);
        else if (t === 'M') r = slot(sid + ':' + x.key + '.' + (key.includes('.') ? key.slice(base.length + 1) : x.R.find(Boolean) || 'OUT'));
        else if (t === 'c') {
          if (x.src) {
            const T = x.src.slice(0, x.src.indexOf(':')),
              ok = x.src.slice(T.length + 1),
              o = nb[T].outputs.find(o => o.key === ok);
            r = o ? res(T, o.net, depth + 1) : port('CON:' + sid + '.' + x.letter);
          } else {
            const f = x.from.filter(f => /^[A-Z]/.test(f));
            r = port('CON:' + (f.length ? f.join('/') : sid) + '.' + x.letter);
          }
        } else if (t === 'k') {
          const [, , , text, note] = x,
            v = numConst(/^ON\(1\)$/.test(text) ? '1' : /^OFF\(0\)$/.test(text) ? '0' : text);
          if (/ref$/.test(note) && note !== 'sys.ref') {
            const d = defs[sh[sid].ctl + '|' + text] || defs['|' + text];
            r = d && d.length ? res(d[0][0], d[0][1], depth + 1) : port('REF:' + text);
          } else if (v !== null) r = slot('CONST:' + v, v);
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
          /* a G sheet (310SD03-743) is a relay diagram, not a HIACS macro: its time relays have no SW input */
          open: need(b.type, notes, !!side || !!S.dwg),
          st: {}
        });
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
        const name = M.type.slice(2),
          f = MACRO[name] || null;
        if (!f) unknown[M.type] = (unknown[M.type] || 0) + 1;
        const outs = {};
        M.R.forEach(p => p && (outs[p] = slot(n.id + ':' + M.key + '.' + p)));
        const ins = {};
        for (const i of M.ins) if (i.name) ins[i.name] = res(n.id, i.net);
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
      mText = 0;
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
    return { sheets: prog.plan.length, run, runText, notRun, open, blocks, bOk, macros, mOk, mText, ports: prog.ports.length, portKinds: kinds };
  }
  root.TCE_RUN = { crt, read, outs, K, par, REQ, EXTRA, need, KINDS, ALIAS, MARK, kind, net, gnet, join, compile, step, scan, set, get, stats, MACRO, TEXT };
})(typeof window !== 'undefined' ? window : globalThis);
