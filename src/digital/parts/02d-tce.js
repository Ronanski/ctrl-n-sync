/* DITL (digital logic) - TCS soft logic sheets (Hitachi logic diagram 331DM09784, sheets TCE... / TCA...) as sheets of the Logic page, in the same
   viewer, sheet list and panel as the DITL and the TCS (IBD) sheets.
   The drawing itself is a scan and never comes with the app: every sheet is typed as data (src/digital/tce/<sheet>.js, list TCE_SHEETS) and drawn here with the
   app's own lines and words. Each block, connector and wire corner stands where the drawing has it, so the layout and the direction of every signal are the
   ones of the drawing; a wire is made of horizontal and vertical pieces only (tools/data/tce_check.mjs refuses anything else).

   One sheet:
     id, title, page, ctl (controller), cycle (ms)
     f: [x0, y0, x1, y1]   the inner frame of the drawing, in the units the sheet is typed in (any: the pixels of a rendered page are fine)
     c: [key, 'in' | 'out', letter, x, y, name, [sheets], dbl, under] off-page connector (oval), x y = its centre; dbl 1 = drawn with a double line;
                                                                     under 1 = the sheets stand under the connector (2 = in one row under an output connector,
                                                                     3 = the first beside an output connector, the others two in a row under it,
                                                                     4 = two in a row under it, the next rows under them)
     k: [key, x, y, text, note, kind]                                constant / system reference (pentagon), x y = its left middle; kind 'def' =
                                                                     a definition the sheet gives out
     r: [key, x, y, w, h, text]                                      PI/O table box; g: [x, y, 'l' | 'r'] PI/O connection mark on a line;
     a: [[x1, y1], [x2, y2]]                                         note arrow of the drawing (open head at the second point)
     l: [[x1, y1], [x2, y2]]                                         plain line with no signal (the rules of a table), horizontal or vertical;
                                                                     e: the same, dashed; o: [x, y, r, dbl] circle of a part (a summing point,
                                                                     dbl 1 = a servo valve coil); p: [[x, y], ...] closed outline (an amplifier)
     d: [key, x, y, 'in' | 'out', tag, letter, note]                 CRT diamond (operator push button in / lamp out), x y = its centre; letter 'R' | 'S'
                                                                     under it, note ('#1C') over it; an 'in' diamond is a wire source
     b: [key, type, no, x, y, [notes], {l: [...], r: [...]}, [w, h]] small block, x y = its centre; no = the block number printed in it; notes = the
                                                                     parameters printed under it ('^DEF' = over it); l / r = the marks of its pins;
                                                                     type 'o:BTR' = a mark on the wire, type 'X' = the crossed circle (inverted input)
     m: [key, name, tag, x, y, w, h, [left pins], [right pins], foot, [notes], plain]   macro block, x y = top left; plain = [[y of each left
                                                                     pin], [y of each right pin]]: a block printed without cells
     tri: [x, y, s]                                                  the filled triangle of an analog PI/O connection on a line
     w: [source key, [[x, y], ...], thick, arw, dash]                wire piece: every corner from one end to the other; thick 1 = analog signal;
                                                                     dash 1 = drawn dashed (an analog line of an IBD sheet)
     t: [x, y, text, align, size, rot]                               other words of the sheet (align 0 left, 1 centre, 2 right); rot = the turn of
                                                                     the words in degrees (90 = read from the bottom up)
     live: { source key: 'engine read' | ['engine read', 'unit'] }   the state of every wire of that source (with a unit: an analog value, shown
                                                                     as a number); none = the sheet is shown without states. An engine read
                                                                     is a name of AN.tceRead() (tcs.js tcsLiveRead): 'trip', '!trip' (inverted),
                                                                     'tsel=1800' (that value). Only values the engine holds: the page runs no
                                                                     gate of the sheet, so a wire with no read stays without a state

   A sheet of the Interlock Block Diagram 310SC90-794 (TCS IBD, typicals and TA / TB ...) typed in the same format takes the place of the sheet the app
   builds from the IBD netlist (02c-tcs.js): same gates, same net numbers, so the logic, the trace and the values of the engine stay; only the picture is
   the typed one. More fields for it:
     ibd: '15' | 'TA-9'                                              the IBD sheet it replaces (no ctl / cycle needed)
     nets: { source key: net number of the IBD netlist }             the net of every source; a source without one gets a free number
     fs: 1.1                                                         the size of the words (1 = the size of the TCE sheets)
     ar: 1                                                           every wire ends in an open arrow head (w[3] = 0: this one not); ah = its length
                                                                     in thousandths of the frame width (also the head of a note arrow), default 9
     h: [key, x, y, w, hh, [lines]]                                  condition label (a hexagon pointed at both ends), x y = its left tip, w its width,
                                                                     hh half its height; the lines stand left inside it; key '' = no signal
     b types: 'G:A' / 'G:OR' ...                                     gate of the IBD: a box with its letter, size [w, h, bar] (bar = the height of its
                                                                     input edge, longer than the box); 'SR' = the flip-flop (S over a circled R), size
                                                                     [w, h]; 'NC' = the circle of a NOT on a line, size [r]
     r key '': a box that gives no signal (an annunciator window); t: [x, y, text, align, size]
     s: [key, x1, y1, x2, y2]                                        a source with no symbol of its own (the input switch of a row, drawn by its
                                                                     lines): only its place on the sheet
     v: [[x, y], ...]                                                open outline with slanted pieces (a mark of the drawing that carries no signal)
     j: [[x, y], ...]                                                junction dot of the drawing (the net is the one of the wire through it) */
const TCE_SHEETS = typeof window !== 'undefined' && window.TCE_SHEETS ? window.TCE_SHEETS : [];
const tceDesc = q => (typeof TCS_DESC !== 'undefined' && TCS_DESC[q.ibd ? 'IBD-' + q.ibd : q.id]) || '';
const tceCat = id => (/^TCA/.test(id) ? 'START-UP SOFT LOGIC (TCA)' : 'GOVERNOR SOFT LOGIC (TCE)');
function tceSheet(q) {
  const K = 0.32,
    [fx0, fy0, fx1, fy1] = q.f,
    /* the frame of a sheet of the viewer (the same as a TCS sheet: 18 .. 1173 wide, 18 .. 796 under the title line) */
    sx = 1155 / (fx1 - fx0),
    sy = 778 / (fy1 - fy0),
    X = x => +((18 + (x - fx0) * sx) * K).toFixed(2),
    Y = y => +(-(18 + (y - fy0) * sy) * K).toFixed(2),
    W = w => w * sx * K,
    ln = [],
    seg = [],
    pl = [],
    ci = [],
    tx = [],
    heavy = [],
    lk = [],
    src = {};
  /* align: 0 left, 1 centre, 2 right (on the base line); 3 left, 4 centre, 5 right (on the middle line) */
  const fs = q.fs || 1,
    hk = (q.ah || 9) * ((fx1 - fx0) / 1000);
  const text = (t, x, y, h, a) => ({
    t: String(t),
    ix: X(x),
    iy: Y(y),
    x: X(x),
    y: Y(y),
    h: (h || 2.05) * fs,
    r: 0,
    a: a === 3 ? 0 : a === 5 ? 2 : a || 0,
    b: a === 3 || a === 5 ? 2 : 0,
    l: 'TXT1'
  });
  const poly = (P, closed) => pl.push([P.map(p => [X(p[0]), Y(p[1])]), closed ? 1 : 0, 'SYM']);
  const net = k => (k === '' ? -1 : k in src ? src[k] : (src[k] = Object.keys(src).length)),
    box = {},
    /* the place of a source on the sheet (the viewer's units): an IBD sheet puts its input switches and its gates there */
    at = (k, x0, y0, x1, y1) => k !== '' && (box[k] = { x1: X(x0), x2: X(x1), y1: Y(y1), y2: Y(y0) }),
    /* an open arrow head at b, coming from a */
    head = (a, b) => {
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1,
        ux = (b[0] - a[0]) / L,
        uy = (b[1] - a[1]) / L,
        k = hk;
      poly(
        [
          [b[0] - ux * k - uy * k * 0.42, b[1] - uy * k + ux * k * 0.42],
          b,
          [b[0] - ux * k + uy * k * 0.42, b[1] - uy * k - ux * k * 0.42]
        ],
        0
      );
    };
  /* the frame and the title line of the sheet (the viewer's own, as on the TCS sheets) */
  [
    [
      [18, 18],
      [1173, 18]
    ],
    [
      [1173, 18],
      [1173, 824]
    ],
    [
      [1173, 824],
      [18, 824]
    ],
    [
      [18, 824],
      [18, 18]
    ],
    [
      [18, 796],
      [1173, 796]
    ]
  ].forEach(([a, b]) => {
    ln.push([+(a[0] * K).toFixed(2), +(-a[1] * K).toFixed(2), +(b[0] * K).toFixed(2), +(-b[1] * K).toFixed(2), 'SYM']);
    seg.push(undefined);
  });
  const T = (t, x, y, h, a) => ({
    t,
    ix: +(x * K).toFixed(2),
    iy: +(-y * K).toFixed(2),
    x: +(x * K).toFixed(2),
    y: +(-y * K).toFixed(2),
    h,
    r: 0,
    a,
    b: 0,
    l: 'TXT1'
  });
  /* an IBD sheet keeps the title line of the IBD sheets */
  if (q.ibd)
    tx.push(
      T((/^\d/.test(q.ibd) ? 'TYPICAL ' : '') + q.ibd + '  ' + q.title, 30, 815, 2.6, 0),
      T('TCS SHEET ' + q.page + ' OF 99', 1160, 815, 2.05, 2)
    );
  else
    tx.push(
      T(q.id + '  ' + q.title, 30, 815, 2.6, 0),
      T(
        'CONTROLLER ' + (q.ctl || '') + '   CYCLE ' + (q.cycle || '') + ' ms   PAGE ' + (q.page || ''),
        1160,
        815,
        2.05,
        2
      )
    );
  /* a half circle as short straight pieces (the ends of a connector) */
  const arc = (cx, cy, r, a0, a1) => {
    const P = [];
    for (let i = 0; i <= 8; i++) {
      const a = a0 + ((a1 - a0) * i) / 8;
      P.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    return P;
  };
  const u = (fx1 - fx0) / 1000; /* one thousandth of the width of the frame, for the sizes of the symbols */
  /* off-page connectors: an oval with its letter; the name on the wire side, the sheets it goes to / comes from on the outer side */
  for (const [key, dir, letter, x, y, name, refs, dbl, under] of q.c || []) {
    const w = 13 * u,
      r = 9 * u;
    poly(
      [...arc(x + w - r, y, r, -Math.PI / 2, Math.PI / 2), ...arc(x - w + r, y, r, Math.PI / 2, (3 * Math.PI) / 2)],
      1
    );
    /* a connector drawn with a double line in the drawing */
    if (dbl)
      poly(
        [
          ...arc(x + w - r, y, r - 2 * u, -Math.PI / 2, Math.PI / 2),
          ...arc(x - w + r, y, r - 2 * u, Math.PI / 2, (3 * Math.PI) / 2)
        ],
        1
      );
    tx.push(text(letter, x, y, 1.9, 4));
    at(key, x - w, y - r, x + w, y + r);
    const R = (refs || []).map(s => '(' + s + ')'),
      /* more than four sheets: columns of three, side by side, as the drawing packs them */
      per = R.length > 4 ? 3 : 4,
      col = i => Math.floor(i / per) * 34 * u;
    if (dir === 'in') {
      if (name) tx.push(text(name, x + w + 3 * u, y - 5 * u, 2.05, 0));
      /* under 1: the sheets stand under the connector (a connector in the middle of the sheet, with a block at its left) */
      if (under) R.forEach((s, i) => tx.push(text(s, x - 19 * u, y + (17 + 8 * i) * u, 1.7, 0)));
      else R.forEach((s, i) => tx.push(text(s, x - w - 3 * u - col(i), y + (5 + 8 * (i % per)) * u, 1.7, 2)));
    } else {
      if (name) tx.push(text(name, x - w - 4 * u, y - 5 * u, 2.05, 2));
      /* near the right edge of the frame there is no room for a second column: the drawing puts the sheets over four on the left of the
         column, on its last rows (TCE166 A: TCE602 left of TCE601) */
      /* under 1: the drawing prints the sheets under the connector, not beside it */
      if (under === 2) R.forEach((s, i) => tx.push(text(s, x + (i - (R.length - 1) / 2) * 44 * u, y + 17 * u, 1.7, 1)));
      /* under 4: two in a row under the connector, the next rows under the first (TCA543 B) */
      else if (under === 4)
        R.forEach((s, i) =>
          tx.push(text(s, x + ((i % 2) - 0.5) * 44 * u, y + (17 + 8 * Math.floor(i / 2)) * u, 1.7, 1))
        );
      else if (under === 3)
        /* under 3: the first sheet beside the connector, the others two in a row under it (TCE152 B) */
        R.forEach((s, i) =>
          tx.push(
            i % 2
              ? text(s, x + w + 1 * u, y + (5 + 8 * ((i + 1) / 2)) * u, 1.7, 2)
              : text(s, x + w + 3 * u, y + (5 + 8 * (i / 2)) * u, 1.7, 0)
          )
        );
      else if (under) R.forEach((s, i) => tx.push(text(s, x + 6 * u, y + (17 + 8 * i) * u, 1.7, 0)));
      else if (R.length > 4 && x + w + 37 * u + 34 * u > fx1)
        R.forEach((s, i) =>
          tx.push(
            i < 4
              ? text(s, x + w + 3 * u, y + (5 + 8 * i) * u, 1.7, 0)
              : text(s, x + w + 1 * u, y + (5 + 8 * (3 - (i - 4))) * u, 1.7, 2)
          )
        );
      else R.forEach((s, i) => tx.push(text(s, x + w + 3 * u + col(i), y + (5 + 8 * (i % per)) * u, 1.7, 0)));
    }
    /* sheet links (as the FROM / TO page links of the DITL): a click on the connector offers every sheet it names, a click on one
       sheet name opens that sheet (src/ui/shell/ditl.js D.sheetLink) */
    if ((refs || []).length) {
      lk.push({ x1: X(x - w), x2: X(x + w), y1: Y(y + r), y2: Y(y - r), refs: refs.slice() });
      /* the sheet names are the last words pushed for this connector, in the order of refs */
      tx.slice(tx.length - refs.length).forEach((e, i) => {
        const L = e.t.length * e.h * 0.62,
          x1 = e.a === 1 ? e.x - L / 2 : e.a === 2 ? e.x - L : e.x,
          y1 = e.b === 2 ? e.y - e.h / 2 : e.y - e.h * 0.25;
        if (refs[i]) lk.push({ x1: x1 - 0.3, x2: x1 + L + 0.3, y1: y1 - 0.3, y2: y1 + e.h + 0.3, refs: [refs[i]] });
      });
    }
    net(key);
  }
  /* constants / system references: a pentagon pointing to the right */
  for (const [key, x, y, t, note, kind] of q.k || []) {
    const w = 114 * u,
      h = 8 * u;
    /* kind 'def': a definition the sheet gives out (the left end is notched, the signal comes in there) */
    if (kind === 'def')
      poly(
        [
          [x, y - h],
          [x + w - h, y - h],
          [x + w, y],
          [x + w - h, y + h],
          [x, y + h],
          [x + h, y]
        ],
        1
      );
    else
      poly(
        [
          [x, y - h],
          [x + w - h, y - h],
          [x + w, y],
          [x + w - h, y + h],
          [x, y + h]
        ],
        1
      );
    tx.push(text(t, x + w / 2, y, 2.05, 4));
    if (note)
      tx.push(
        text('(' + note + ')', kind === 'def' ? x + w / 2 : x + 30 * u, y - h - 5 * u, 1.7, kind === 'def' ? 1 : 0)
      );
    at(key, x, y - h, x + w, y + h);
    net(key);
  }
  /* condition labels of the IBD: a hexagon pointed at both ends, its lines left inside it */
  for (const [key, x, y, w, hh, L] of q.h || []) {
    const e = hh * 0.92;
    poly(
      [
        [x, y],
        [x + e, y - hh],
        [x + w - e, y - hh],
        [x + w, y],
        [x + w - e, y + hh],
        [x + e, y + hh]
      ],
      1
    );
    (L || []).forEach((t, i) => tx.push(text(t, x + e, y + (i - (L.length - 1) / 2) * hh * 0.84, 2.05, 3)));
    at(key, x, y - hh, x + w, y + hh);
    net(key);
  }
  /* PI/O table boxes: a plain box with its words (the place of an input / output of the PI/O table) */
  for (const [key, x, y, w, h, t] of q.r || []) {
    poly(
      [
        [x, y],
        [x + w, y],
        [x + w, y + h],
        [x, y + h]
      ],
      1
    );
    if (t) tx.push(text(t, x + w / 2, y + h / 2, 2.05, 4));
    at(key, x, y, x + w, y + h);
    net(key);
  }
  /* PI/O connection marks: a small triangle on the line, pointing left ('l') or right ('r') */
  for (const [x, y, d] of q.g || []) {
    const k = 7 * u * (d === 'l' ? -1 : 1);
    poly(
      [
        [x - k / 2, y - 4.5 * u],
        [x + k / 2, y],
        [x - k / 2, y + 4.5 * u]
      ],
      1
    );
  }
  /* CRT diamonds: a push button of the operator station coming in ('in', tag at the left) or a lamp of it going out ('out', tag at the right) */
  for (const [key, x, y, dir, tag, letter, note] of q.d || []) {
    const w = 17 * u,
      h = 11 * u;
    poly(
      [
        [x - w, y],
        [x, y - h],
        [x + w, y],
        [x, y + h]
      ],
      1
    );
    tx.push(text('CRT', x, y, 1.6, 4));
    /* the letter and the note stand at the wire side of the diamond, as in the drawing (two diamonds can stand close under each other) */
    const sd = dir === 'in' ? 1 : -1;
    if (letter) tx.push(text(letter, x + sd * 9 * u, y + 10 * u, 1.7, 1));
    if (note) tx.push(text('(' + note + ')', x + sd * 7 * u, y - 9 * u, 1.7, dir === 'in' ? 0 : 2));
    if (tag) tx.push(text(tag, dir === 'in' ? x - w - 4 * u : x + w + 4 * u, y, 1.9, dir === 'in' ? 5 : 3));
    at(key, x - w, y - h, x + w, y + h);
    net(key);
  }
  /* plain lines of the drawing that carry no signal (the rules of a table) */
  for (const [a, b] of q.l || []) poly([a, b], 0);
  /* the same, dashed (the border of a field part such as the servo valve), horizontal or vertical */
  for (const [a, b] of q.e || []) {
    const L = Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]),
      sx = Math.sign(b[0] - a[0]),
      sy = Math.sign(b[1] - a[1]),
      on = 4 * u,
      off = 3 * u;
    for (let s = 0; s < L; s += on + off) {
      const t = Math.min(s + on, L);
      poly(
        [
          [a[0] + sx * s, a[1] + sy * s],
          [a[0] + sx * t, a[1] + sy * t]
        ],
        0
      );
    }
  }
  /* part symbols that carry no signal of the sheet: o = a circle (a summing point; dbl 1 = a servo valve coil), p = a closed outline (an amplifier) */
  for (const [x, y, r, dbl] of q.o || []) {
    ci.push([X(x), Y(y), W(r), 'SYM']);
    if (dbl) ci.push([X(x), Y(y), W(r * 0.65), 'SYM']);
  }
  for (const P of q.p || []) poly(P, 1);
  for (const P of q.v || []) poly(P, 0);
  /* sources drawn by plain lines (the input switch of an IBD row): only the place */
  for (const [key, x1, y1, x2, y2] of q.s || []) {
    at(key, x1, y1, x2, y2);
    net(key);
  }
  /* the filled triangle of an analog PI/O connection on a line, pointing left: [x, y, s] = its middle and half its size */
  for (const [x, y, s] of q.tri || []) {
    poly(
      [
        [x + s, y - s],
        [x - s, y],
        [x + s, y + s]
      ],
      1
    );
    for (let i = 1.5; i < 2 * s; i += 1.5)
      poly(
        [
          [x - s + i, y - i / 2],
          [x - s + i, y + i / 2]
        ],
        0
      );
  }
  /* note arrows of the drawing (an explanation pointing at a part): a line with an open head at its end */
  for (const [a, b] of q.a || []) {
    poly([a, b], 0);
    head(a, b);
  }
  /* small blocks: the type over the block number */
  for (const [key, type, no, x, y, notes, pins, size] of q.b || []) {
    if (type === 'X') {
      /* the crossed circle of the drawing on an input line (the signal taken inverted), type 'X': no name, no number; with a size [r] it is the
         larger crossed circle of a field transmitter */
      const r = size ? size[0] : 3.4 * u,
        e = r * 0.7071;
      ci.push([X(x), Y(y), W(r), 'SYM']);
      poly(
        [
          [x - e, y - e],
          [x + e, y + e]
        ],
        0
      );
      poly(
        [
          [x - e, y + e],
          [x + e, y - e]
        ],
        0
      );
      continue;
    }
    if (/^G:/.test(type)) {
      /* a gate of the IBD: a box with its letter, the input edge longer than the box */
      const [w, h, bar] = size;
      poly(
        [
          [x - w / 2, y - h / 2],
          [x + w / 2, y - h / 2],
          [x + w / 2, y + h / 2],
          [x - w / 2, y + h / 2]
        ],
        1
      );
      if (bar > h)
        poly(
          [
            [x - w / 2, y - bar / 2],
            [x - w / 2, y + bar / 2]
          ],
          0
        );
      tx.push(text(type.slice(2), x, y, 2.05, 4));
      at(key, x - w / 2, y - Math.max(h, bar) / 2, x + w / 2, y + Math.max(h, bar) / 2);
      net(key);
      continue;
    }
    if (type === 'SR') {
      /* the flip-flop of the IBD: S over a circled R, the output at the S side */
      const [w, h] = size;
      poly(
        [
          [x - w / 2, y - h / 2],
          [x + w / 2, y - h / 2],
          [x + w / 2, y + h / 2],
          [x - w / 2, y + h / 2]
        ],
        1
      );
      poly(
        [
          [x - w / 2, y],
          [x + w / 2, y]
        ],
        0
      );
      ci.push([X(x), Y(y + h / 4), W(Math.min(w, h / 2) * 0.47), 'SYM']);
      tx.push(text('S', x, y - h / 4, 2.05, 4), text('R', x, y + h / 4, 2.05, 4));
      at(key, x - w / 2, y - h / 2, x + w / 2, y + h / 2);
      net(key);
      continue;
    }
    if (type === 'NC') {
      /* the circle of a NOT on a line */
      const r = size ? size[0] : 5.25 * u;
      ci.push([X(x), Y(y), W(r), 'SYM']);
      at(key, x - r, y - r, x + r, y + r);
      net(key);
      continue;
    }
    if (/^o:/.test(type)) {
      /* a mark on the wire (a small circle with its name over it and its number under it), type 'o:BTR' */
      ci.push([X(x), Y(y), W(2.2 * u), 'SYM']);
      tx.push(text(type.slice(2), x, y - 6 * u, 1.7, 1), text(no, x + 8 * u, y + 9 * u, 1.7, 0));
      continue;
    }
    /* size [w, h]: a block the drawing makes wider or taller than the usual one (an OR with many inputs, a flip-flop); its type stays at the top, its number at the bottom */
    const w = size ? size[0] / 2 : 14 * u,
      h = size ? size[1] / 2 : 10.5 * u;
    poly(
      [
        [x - w, y - h],
        [x + w, y - h],
        [x + w, y + h],
        [x - w, y + h]
      ],
      1
    );
    tx.push(text(type, x, y - h + 5.25 * u, 1.9, 4), text(no, x, y + h - 5.25 * u, 1.7, 4));
    /* the parameters printed under the block ('TD:30.0S', 'K:36.0'); a note that starts with ^ stands over it (a DEF / DFE tag) */
    let below = 0;
    for (const n of notes || [])
      if (n[0] === '^') tx.push(text(n.slice(1), x, y - h - 5 * u, 1.7, 1));
      else tx.push(text(n, x, y + h + (6 + 8 * below++) * u, 1.7, 1));
    /* the marks of its pins, inside the block: { l: ['S', 'R'], r: ['T'] } top to bottom */
    for (const [side, L] of Object.entries(pins || {}))
      L.forEach(
        (p, i) =>
          p &&
          tx.push(
            text(
              p,
              side === 'l' ? x - w + 2.5 * u : x + w - 2.5 * u,
              y - h + ((i + 0.5) * 2 * h) / L.length,
              1.5,
              side === 'l' ? 3 : 5
            )
          )
      );
    at(key, x - w, y - h, x + w, y + h);
    net(key);
  }
  /* macro blocks: title bar, pins on both sides, foot bar, the parameter lines under it */
  for (const [key, name, tag, x, y, w, h, L, R, foot, notes, plain] of q.m || []) {
    if (plain) {
      /* a block the drawing prints without cells: its name at the top left, the names of its pins inside at the heights given
         (plain = [[y of each left pin], [y of each right pin]]), its number at the bottom */
      poly(
        [
          [x, y],
          [x + w, y],
          [x + w, y + h],
          [x, y + h]
        ],
        1
      );
      tx.push(
        text(name, x + 3 * u, y + 7 * u, 2.05, 3),
        text(tag, x + w / 2, y - 4 * u, 1.7, 1),
        text(foot || '', x + w / 2, y + h - 3.5 * u, 1.7, 4)
      );
      L.forEach((p, i) => tx.push(text(p, x + 3 * u, plain[0][i], 2.05, 3)));
      R.forEach((p, i) => {
        tx.push(text(p, x + w - 2 * u, plain[1][i], 2.05, 5));
        net(key + '.' + p);
      });
      (notes || []).forEach(n => tx.push(text(n[2], n[0], n[1], 1.9, 0)));
      continue;
    }
    const bar = 15 * u,
      pw = 36 * u;
    poly(
      [
        [x, y],
        [x + w, y],
        [x + w, y + h],
        [x, y + h]
      ],
      1
    );
    poly(
      [
        [x, y + bar],
        [x + w, y + bar]
      ],
      0
    );
    poly(
      [
        [x, y + h - bar],
        [x + w, y + h - bar]
      ],
      0
    );
    poly(
      [
        [x + pw, y + bar],
        [x + pw, y + h - bar]
      ],
      0
    );
    poly(
      [
        [x + w - pw, y + bar],
        [x + w - pw, y + h - bar]
      ],
      0
    );
    tx.push(
      text(name, x + w / 2, y + bar / 2, 2.05, 4),
      text(tag, x + w / 2, y - 4 * u, 1.7, 1),
      text(foot || '', x + w / 2, y + h - bar / 2, 1.7, 4)
    );
    const step = (h - 2 * bar) / Math.max(L.length, R.length);
    L.forEach((p, i) => {
      if (i)
        poly(
          [
            [x, y + bar + i * step],
            [x + pw, y + bar + i * step]
          ],
          0
        );
      tx.push(text(p, x + 3 * u, y + bar + (i + 0.5) * step, 1.9, 3));
    });
    R.forEach((p, i) => {
      if (i)
        poly(
          [
            [x + w - pw, y + bar + i * step],
            [x + w, y + bar + i * step]
          ],
          0
        );
      tx.push(text(p, x + w - pw + 3 * u, y + bar + (i + 0.5) * step, 1.9, 3));
      net(key + '.' + p);
    });
    (notes || []).forEach(n => tx.push(text(n[2], n[0], n[1], 1.9, 0)));
  }
  /* wires: straight pieces, each with the net of its source */
  for (const [from, P, thick, arw, dash] of q.w || []) {
    const n = net(from);
    if (arw === 1 || (q.ar && arw !== 0)) head(P[P.length - 2], P[P.length - 1]);
    for (let i = 1; i < P.length; i++) {
      const a = P[i - 1],
        b = P[i];
      /* a dashed wire: the same net in short pieces (the gaps carry it too) */
      const L = dash ? Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]) : 0,
        sx = Math.sign(b[0] - a[0]),
        sy = Math.sign(b[1] - a[1]),
        on = 4 * u,
        off = 3 * u;
      const parts = [];
      if (dash) for (let s = 0; s < L; s += on + off) parts.push([s, Math.min(s + on, L)]);
      else parts.push(null);
      for (const p of parts) {
        const c = p ? [a[0] + sx * p[0], a[1] + sy * p[0]] : a,
          d = p ? [a[0] + sx * p[1], a[1] + sy * p[1]] : b;
        ln.push([X(c[0]), Y(c[1]), X(d[0]), Y(d[1]), 'CON']);
        seg.push(n);
      }
      if (thick) heavy.push([a, b, n]);
    }
  }
  for (const [x, y, t, a, h, rot] of q.t || []) {
    const e = text(t, x, y, h || 2.05, a || 0);
    if (rot) e.r = rot;
    tx.push(e);
  }
  /* junction dots: a wire end on the middle of another wire of the same net */
  const dots = [];
  /* (a sheet that lists its dots (j) shows only those: the ends of its short wire pieces are no junctions) */
  ln.forEach((a, i) => {
    if (seg[i] === undefined || q.j) return;
    [
      [a[0], a[1]],
      [a[2], a[3]]
    ].forEach(p =>
      ln.some((b, j) => {
        if (j === i || seg[j] !== seg[i]) return false;
        const on =
          Math.abs(p[1] - b[1]) < 0.01 && Math.abs(b[1] - b[3]) < 0.01
            ? p[0] > Math.min(b[0], b[2]) + 0.05 && p[0] < Math.max(b[0], b[2]) - 0.05
            : Math.abs(p[0] - b[0]) < 0.01 &&
              Math.abs(b[0] - b[2]) < 0.01 &&
              p[1] > Math.min(b[1], b[3]) + 0.05 &&
              p[1] < Math.max(b[1], b[3]) - 0.05;
        if (on && !dots.some(d => d.x === p[0] && d.y === p[1])) dots.push({ x: p[0], y: p[1], n: seg[i] });
        return on;
      })
    );
  });
  /* the junction dots the drawing shows (an IBD sheet): the net of the wire through the point */
  for (const [x, y] of q.j || []) {
    const px = X(x),
      py = Y(y);
    const i = ln.findIndex(
      (b, i) =>
        seg[i] !== undefined &&
        px >= Math.min(b[0], b[2]) - 0.15 &&
        px <= Math.max(b[0], b[2]) + 0.15 &&
        py >= Math.min(b[1], b[3]) - 0.15 &&
        py <= Math.max(b[1], b[3]) + 0.15
    );
    if (i >= 0) dots.push({ x: px, y: py, n: seg[i] });
  }
  /* an analog signal: a second line close beside the first, as the heavy line of the drawing (after the junction dots are found) */
  for (const [a, b, n] of heavy) {
    const dx = a[1] === b[1] ? 0 : 0.3,
      dy = dx ? 0 : 0.3;
    ln.push([X(a[0]) + dx, Y(a[1]) + dy, X(b[0]) + dx, Y(b[1]) + dy, 'CON']);
    seg.push(n);
  }
  /* live reads (q.live): the net, the engine read and the place of the value of each (the start of its first wire, else the right of its symbol);
     every other net of the sheet has no state */
  const live = [];
  for (const k in q.live || {}) {
    if (!(k in src)) continue;
    const r = q.live[k],
      w = (q.w || []).find(z => z[0] === k),
      b = box[k];
    if (!w && !b) continue;
    live.push({
      key: k,
      n: src[k],
      rd: Array.isArray(r) ? r[0] : r,
      unit: Array.isArray(r) ? r[1] : null,
      x: w ? X(w[1][0][0]) : b.x2,
      y: w ? Y(w[1][0][1]) : (b.y1 + b.y2) / 2
    });
  }
  const nst = Object.values(src).filter(n => !live.some(L => L.n === n));
  const NO = [0, 0],
    no = (/(\d+)/.exec(q.id) || [])[1] || '';
  return {
    name: 'TCS-' + q.id.replace(/^(TC[AE])0*/, '$1-'),
    title: q.title,
    desc: tceDesc(q),
    tcs: q.id,
    tce: q,
    cat: tceCat(q.id),
    meta: { dwg: q.id, title: q.title, no: +no || 0 },
    raw: { ln, pl, ci, ar: [], so: [], lamp: [] },
    tx,
    rows: [],
    rng: { F: NO, L: NO, T: NO, S: NO, RS: NO, RL: NO, RT: NO },
    vr: { F: NO, L: NO, T: NO, S: NO, RS: NO, RL: NO, RT: NO },
    rb: [],
    cells: {},
    sig: {},
    syms: [],
    lyr: '',
    bv: BV,
    sd: {
      tcs: 1,
      tce: src,
      box,
      n: Object.keys(src).length,
      seg,
      gates: [],
      src: [],
      outs: [],
      term: [],
      dots,
      xcon: [],
      an: [],
      anl: [],
      live,
      nst,
      lk
    }
  };
}
