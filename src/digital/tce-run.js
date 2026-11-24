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
    /* ML 13 PIV velocity PI (TCA014 p 9): SW=1 Y = G1 (X(j) - X(j-1)) + G2 (TS/TI) X(j) + F; SW=0 Y = 0. Y is the increment itself (the
       macro list adds no Y(j-1)); it gives no output limit, so HL / LL / ML printed under a PIV are an OPEN item (see need()) */
    PIV: (x, n, st, dt, sw = 1) => {
      const [X = 0, F = 0] = x,
        G1 = par(n, 'G1'),
        G2 = par(n, 'G2'),
        TI = par(n, 'TI');
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
    /* ML 27 G Y = K X */
    G: (x, n) => [par(n, 'K') * x[0]],
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
    I: ['TI'], LG: ['T'], PIF: ['G', 'TI'], PIV: ['G1', 'G2', 'TI'], SG: ['K'], SGW: ['K'], AM: ['R'], G: ['K'], FLT: ['N'], GRD: ['K'],
    PD: ['N', 'K'], LIN: ['K', 'B'], TP: ['TP'], TD: ['TD'], TW: ['TW'], CMP: ['HL'], CPL: ['HL'], CNT: ['N'], FLK: ['T1', 'T2'],
    LCK: ['K'], UCK: ['K']
  };
  /* printed parameters that the definition of the ML does not have: their meaning is open until a document gives it */
  const EXTRA = { PIV: ['HL', 'LL', 'ML'], AM: ['M'], G: ['KA'] };
  const keysOf = n => new Set((n || []).map(q => (/^\s*([A-Z][A-Z0-9]*)\s*:/.exec(q) || [])[1]).filter(Boolean));
  function need(type, notes, swWired) {
    const t = K[type] ? type : ALIAS[type] || type,
      f = K[t],
      k = keysOf(notes),
      out = [];
    if (!f) return out;
    for (const p of REQ[t] || []) if (!k.has(p)) out.push(t + ' ' + p + ' not on the sheet');
    for (const p of EXTRA[t] || []) if (k.has(p)) out.push(t + ' ' + p + ' printed, not in the macro list definition');
    if (t === 'FG') {
      let c = 0;
      for (let i = 1; i <= 8; i++) if (k.has('X' + i) && k.has('Y' + i)) c++;
      if (c < 2) out.push('FG curve not on the sheet');
    }
    /* ML 62 PA (parameter modify) has no SW in its symbol: its side input is the condition of the parameter, drawn or not */
    if (!swWired && t !== 'PA' && /\bsw\s*=/.test(String(f))) out.push(t + ' SW not wired (HIACS default not in the macro list)');
    return out;
  }
  const ALIAS = { 'G:OR': 'OR', 'G:A': 'A', PA1: 'PA', PA2: 'PA', PA3: 'PA', PA4: 'PA', 'o:BTR': 'BTR', 'o:FTR': 'FTR' };
  /* marks that are not blocks: X inverts the wire it sits on (the netlist sets inv), NC is a pin drawn not connected */
  const MARK = { X: 1, NC: 1 };
  const kind = t => K[t] || K[ALIAS[t]] || null;
  const KINDS = Object.keys(K);

  /* ---------- step 1: a typed sheet (src/digital/tce/*.js, format: src/digital/parts/02d-tce.js) as a netlist, from the drawing itself.
     One reader for the tool (tools/data/tce_net.mjs) and the app. The key of a wire piece is the part that gives its signal, so the key IS the
     net. What the net feeds is read from the last point of each piece, as on the drawing:
       - on the left edge of a small block: an input of that block (ordered by height, top first); on its top or bottom edge: the side input
         the drawing gives there (its SW, below);
       - on a mark on the wire (BTR / FTR transfer, X crossed circle = inverted, NC circle of a NOT): the input of that mark;
       - on the left edge of a macro block: the input pin at that height (the pin heights the sheet gives, or the drawing's even spacing);
       - on an output connector, a CRT lamp, a definition (constant of kind 'def') or a PI/O box: an output of the sheet;
       - at the start of, or on, another piece of the same key: the same net goes on (a gap for a mark of the drawing, or a junction).
     Anything else is "not named" (open), printed by the tool with its sheet, key and point. ---------- */
  const MARKRE = /^(o:BTR|o:FTR|X|NC)$/;
  const near = (a, b, d) => Math.abs(a - b) <= d;
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
    const pio = (s.r || []).map(r => ({ key: r[0], x0: r[1], x1: r[1] + r[3], y0: r[2], y1: r[2] + r[4] }));
    const W = s.w || [];
    const inputs = (s.c || []).filter(c => c[1] === 'in').map(c => ({ key: c[0], letter: c[2], name: c[5], from: c[6] || [] }));
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
      const o = outs.find(o => Math.hypot(o.x - p[0], o.y - p[1]) <= o.d);
      if (o) {
        res.outputs.push({ net: nt, to: o.what, key: o.key, kind: o.kind, text: o.text, letter: o.letter, sheets: o.sheets });
        continue;
      }
      const r = pio.find(r => p[0] >= r.x0 - tol && p[0] <= r.x1 + tol && p[1] >= r.y0 - tol && p[1] <= r.y1 + tol);
      if (r) {
        res.outputs.push({ net: nt, to: 'PI/O ' + r.key, key: r.key, kind: 'r' });
        continue;
      }
      if (W.some(v => v !== w && v[0] === nt && (Math.hypot(v[1][0][0] - p[0], v[1][0][1] - p[1]) <= 20 * u || onSeg(p, v)))) continue;
      res.open.push({ net: nt, at: p });
    }
    /* an X (crossed circle) on the last piece of a wire into a block: that input is taken inverted */
    for (const w of W) {
      const p = w[1][w[1].length - 1];
      for (const m of marks)
        if (m.type === 'X' && onSeg([m.x, m.y], w))
          for (const b of blocks) for (const i of b.ins) if (i.net === w[0] && i.y === p[1] && near(p[0], b.x0, tol)) i.inv = true;
    }
    for (const b of blocks) {
      b.ins.sort((a, c) => (a.side === c.side ? (a.y ?? a.x) - (c.y ?? c.x) : a.side < c.side ? -1 : 1));
      delete b.x0, delete b.x1, delete b.y0, delete b.y1;
    }
    for (const M of macros) {
      M.ins.sort((a, c) => a.y - c.y);
      delete M.x0, delete M.x1, delete M.y0, delete M.y1, delete M.ly;
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
            on = tx.find(w => /^(ON\(1\)|OFF\(0\))$/.test(w));
          r = io ? port('PIO:' + io[1]) : on ? slot('CONST:' + +/\((\d)\)/.exec(on)[1], +/\((\d)\)/.exec(on)[1]) : port('PIO:' + sid + '.' + x[0] + (tx.length ? ' ' + tx.join(' ') : ''));
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
        nodes.push({ t: 'm', out: slot(n.id + ':' + m.key), ins: m.in ? [res(n.id, m.in)] : [], inv: m.type === 'X' || m.type === 'NC' });
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
        nodes.push({ t: 'M', f, name, notes: M.notes, ins, outs, st: {} });
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
    const prog = { names, idx, v, ports: [...ports].sort(), plan, nets, join: J, unknown, res, t: 0 };
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
        v[x.out] = x.f(xs, x.notes, x.st, dt, sw)[0];
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
  /* what runs: per sheet, every block and macro with a meaning = the sheet runs as its logic */
  function stats(prog) {
    let run = 0,
      blocks = 0,
      bOk = 0,
      macros = 0,
      mOk = 0;
    const notRun = [],
      open = {};
    for (const p of prog.plan) {
      let ok = true;
      for (const x of p.nodes) {
        if (x.t === 'b') (blocks++, x.f ? bOk++ : (ok = false));
        if (x.t === 'b' && x.open && x.open.length) {
          ok = false;
          for (const w of x.open) (open[w] = open[w] || new Set()).add(p.id);
        }
        if (x.t === 'M') (macros++, x.f ? mOk++ : (ok = false));
      }
      ok ? run++ : notRun.push(p.id);
    }
    const kinds = {};
    for (const n of prog.ports) {
      const k = n.split(':')[0];
      kinds[k] = (kinds[k] || 0) + 1;
    }
    for (const w in open) open[w] = [...open[w]].sort();
    return { sheets: prog.plan.length, run, notRun, open, blocks, bOk, macros, mOk, ports: prog.ports.length, portKinds: kinds };
  }
  root.TCE_RUN = { K, par, REQ, EXTRA, need, KINDS, ALIAS, MARK, kind, net, gnet, join, compile, step, scan, set, get, stats, MACRO };
})(typeof window !== 'undefined' ? window : globalThis);
