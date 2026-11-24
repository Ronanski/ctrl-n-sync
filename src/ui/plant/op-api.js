/* ===== Operator DITL API, window.LS_OP (3.2.5, user 2026-11-21 'GO NO SOP': the SOP scoring and the guided training are removed; the
   Instructor station stays). The calls the HMI, the faceplates and the engine use to read and press the DITL drawings of the one world:
   the drawing of a motor (dOf), its run state (mst), REMOTE / AUTO (modeOf, amRow), its outputs (dout, pout, runOut), the push buttons
   and selections of the control room (dpress, dset, dsel, dmotor), the field operator actions (fieldRow, fieldSet, fieldOf, dremote), the
   start permissives read from the netlist (interlock, permOf, pbBlock, needNet, leaves) and openD (a drawing at a row). Moved as they were
   from the Training dock (src/ui/training/dock.js, removed); only the repaint of the dock after a press is gone (the faceplates repaint on
   their own tick). Reads and presses go through the same engine actions as before (WORLD.dpress / WORLD.dset); nothing here decides for
   the plant. ===== */
(function () {
  const call = (f, d) => {
    try {
      const x = f();
      return x == null ? d : x;
    } catch (e) {
      return d;
    }
  };
  /* the simulation runs (a paused world gets one scan after a field action, pscan) */
  const isRun = () =>
    !!(window.AN && ((AN.cat === 'an' && AN.run && !AN.view) || (AN.cat !== 'an' && typeof SIM !== 'undefined' && SIM && !(typeof DPAUSE !== 'undefined' && DPAUSE))));
  /* a service text without its address / equipment tag, and the equipment word of it (the REMOTE rows of one machine) */
  const svcN = x =>
    String(x || '')
      .replace(/^\(FROM STATION WIRING\)\s*/, '')
      .replace(/^[\w./]*\d\S*\s+/, '')
      .trim();
  const eqW = x =>
    svcN(String(x || '').replace(/^Output row \d+ · /, '').replace(/\s*·.*$/, ''))
      .replace(/\b(REMOTE|RUNNING|LOCAL)\b.*$/, '')
      .trim();
  const MOTOR0 = { 'M.3304': 'DITL-25A', 'M.3302': 'DITL-26A', 'M.3303': 'DITL-27A', 'M.3308': 'DITL-28A', 'M.3343': 'DITL-23A', 'M.3353': 'DITL-29A', 'M.3350': 'DITL-61A' };
  /* a DITL drawing by name ("DITL-24"), a machine instance of the one world ("DITL-09 #B"); "DITL-12@7" = output row 7 of it (the
     target of the interlock and the running state: BURNER A READY) */
  const dSheet = nm =>
    typeof S !== 'undefined' && S.sheets ? S.sheets.concat((window.WORLD && WORLD.inst) || []).find(x => x.name.endsWith(String(nm).split('@')[0])) : null;
  const atRow = a => (/@(\d+)$/.test(String(a)) ? +/@(\d+)$/.exec(a)[1] : null);
  const DOF = {};
  /* 3.2.0 retest #28: the one world is built (its last scan is shown while PAUSED: the interlock, the field contacts, the lamps) */
  const wlOn = () => !!(window.WORLD && WORLD.on && WORLD.idx);
  /* one scan of the one world while PAUSED (dt 0: no timer runs), so a field contact set by the field operator shows at once */
  const pscan = () => {
    if (isRun() || !wlOn() || !WORLD.tick) return;
    for (let k = 0; k < 3; k++)
      try {
        WORLD.tick(0);
      } catch (e) {}
  };
  /* 3.2.0 retest #25 #29 #34: the state of a motor: 'RUN' / 'STOP' / 'TRIP' (its drawing: RUNNING and "... TRIP · CRT (ANN)" outputs,
     events.js lsAlarms); a drawing of two machines named with its output row ("DITL-45@14" = INSTRUMENT AIR DRYER-A RUNNING) */
  function mst(ad) {
    if (!ad || !wlOn()) return null;
    if (atRow(ad) != null) {
      const v = dout(ad, atRow(ad));
      return v == null ? null : v === 1 ? 'RUN' : 'STOP';
    }
    return call(() => (window.lsAlarms ? lsAlarms.motState(dOf(ad)) : null), null);
  }
  /* a TRIP not acknowledged yet (the alarm list of events.js) */
  const tripNew = ad => call(() => {
    const s = dOf(ad);
    return !!(s && window.lsAlarms && lsAlarms.list().some(x => x.k === 'D|' + s.name && !x.ack));
  }, false);
  const tripAck = ad => call(() => {
    const s = dOf(ad);
    if (s && window.lsAlarms) lsAlarms.ack('D|' + s.name);
  }, null);
  function dOf(addr) {
    if (!addr) return null;
    /* a drawing named by the step (a pump with no running memory on the ABC sheets: DITL-24 PAF lube oil pump) */
    if (/^DITL-/.test(addr)) return dSheet(addr);
    const ain = window.WORLD && WORLD.idx && WORLD.idx.ain;
    if (ain) {
      if (DOF[addr] && DOF[addr].ain === ain) return DOF[addr].d;
      let d = null;
      for (const a of ain)
        try {
          if (a.sh.S && String(AN.nm(a.sh.S, a.n) || '').replace(/^S\d\s*/, '').trim() === addr) {
            d = a.d;
            break;
          }
        } catch (e) {}
      DOF[addr] = { ain, d };
      if (d) return d;
    }
    return MOTOR0[addr] ? dSheet(MOTOR0[addr]) : null;
  }
  const dName = s => String((s && s.name) || '').replace(/^\(\d+\)/, '');
  const MOTOR = new Proxy({}, { get: (_, a) => (typeof a === 'string' && dOf(a) ? dName(dOf(a)) : undefined) });
  const REM = /\bREMOTE\b( MODE)?( SELECTED)?\s*$|REMOTE (MODE )?SELECTED/;
  const PERM = {}; /* the rows seen in the interlock of a motor: shown with their live value (green / red) */
  /* the start permissives of a motor drawing, read from its netlist (the same logic the one world runs): from what the START P.B.
     sets (the flip-flop that holds the start, or the start command output MOR) back to the input rows. On the path of the START
     P.B. every AND input must be 1; an OR off that path is satisfied by one input (the one without the motor's own RUNNING
     feedback); a comparator is an analog limit (its row and set point); an off-sheet connector "(n) FROM DITL-xx" is followed on
     that sheet. A row is { s (sheet), row, want } */
  const CX = new WeakMap();
  function ctx(s) {
    let c = CX.get(s);
    if (c && c.nl === s.nl) return c;
    const nl = s.nl;
    const drv = new Map();
    for (const g of nl.gates || []) for (const n of [].concat(g.out == null ? [] : g.out)) drv.set(n, g);
    const rowOf = new Map();
    for (let r = 0; r < 60; r++) for (const n of DUI.rowNets(s, r, 'L') || []) if (!rowOf.has(n)) rowOf.set(n, r);
    c = { nl, drv, rowOf };
    CX.set(s, c);
    return c;
  }
  const runRow = (s, r) => /RUNNING|RUN\b/.test(rowInfo(s, r).svc);
  /* what net n of sheet s needs to become `want`; stN / onSt: the START P.B. path of the motor sheet (else none) */
  function needNet(s, n, want, P, d, seen, out) {
    if (!s.nl) s.nl = netlist(s);
    const C = ctx(s),
      v = simRead(s).v /* Mina F62: in the Worker simSheet computes the sheet again on the page, without the engine's inputs, and writes over the mirror */,
      k = s.name + ':' + n + ':' + want,
      st = P && P.s === s;
    if (st && P.stN.has(n)) return out;
    /* back to a net already on the way: a loop (the seal-in of the start), no way through it */
    if ((PATH.has(k) || d > 80) && !(v[n] ? 1 : 0) === !!want) out.unk = true;
    if (d > 80 || seen.has(k)) return out;
    seen.add(k);
    PATH.add(k);
    try {
      return needNet0(s, n, want, P, d, seen, out, C, v, st);
    } finally {
      PATH.delete(k);
    }
  }
  const PATH = new Set();
  function needNet0(s, n, want, P, d, seen, out, C, v, st) {
    const val = v[n] ? 1 : 0,
      on = st && P.onSt(n);
    if (val === want && !on) return out;
    const add = x => {
      if (!out.some(y => y.s === x.s && y.row === x.row)) out.push(x);
    };
    const g = C.drv.get(n);
    if (!g) {
      const r = C.rowOf.get(n);
      if (r !== undefined) {
        if (val !== want) add({ s, row: r, want });
        return out;
      }
      const xc = (C.nl.xcon || []).find(x => x.dir === 'in' && x.n === n),
        pr = xc && xconPeer(s, xc);
      if (pr) needNet(pr.sh, pr.c.n, want, P, d + 1, seen, out);
      /* a net with nothing behind it (a connector not read): no way known through it */ else if (val !== want) out.unk = true;
      return out;
    }
    const nx = (m, w) => needNet(s, m, w, P, d + 1, seen, out);
    /* the cheapest of several ways (one input of an OR to 1, one input of an AND to 0) */
    const best = (list, w) => {
      let b = null;
      for (const m of list) {
        const o = needNet(s, m, w, P, d + 1, new Set(seen), []);
        const bad = !!o.unk || o.some(x => runRow(x.s, x.row));
        if (!b || (b.bad && !bad) || (b.bad === bad && o.length < b.o.length)) b = { o, bad };
      }
      /* live test 2026-11-04 (SWBP DITL-30 rows 17-19): the cheapest way is only one of several; the row keeps its group (this net and
         the value it needs), so a later scan sees the group met by another input (SWP-A or C running instead of B) and does not list
         the row as missing */
      if (b) b.o.forEach(x => add({ ...x, alts: (x.alts || []).concat({ s, n, want }) }));
      return out;
    };
    if (g.t === 'NOT') return nx(g.ins[0], 1 - want);
    if (g.t === 'TMR') return nx(g.ins[0], want);
    if (g.t === 'FF') {
      /* set: the SET input 1 and the RESET 0 (a trip / stop that holds the reset blocks the start) */
      if (want) {
        for (const m of g.s || []) nx(m, 1);
        for (const m of g.r || []) nx(m, 0);
      } else for (const m of g.r || []) nx(m, 1);
      return out;
    }
    if (g.t === 'CMP') {
      const r = C.rowOf.get(g.ins[0]);
      if (val !== want && r !== undefined) add({ s, row: r, want: 1, cmp: (want ? '' : 'NOT ') + (g.sptxt || g.cmp + ' ' + g.sp) });
      return out;
    }
    const pth = st ? g.ins.find(m => P.onSt(m)) : undefined;
    if (g.t === 'AND') {
      if (want) g.ins.forEach(m => nx(m, 1));
      else if (!g.ins.some(m => !v[m])) best(g.ins, 0);
      return out;
    }
    if (g.t === 'OR') {
      if (!want) g.ins.forEach(m => nx(m, 0));
      else if (pth !== undefined) nx(pth, 1);
      else if (!g.ins.some(m => v[m])) best(g.ins, 1);
      return out;
    }
    return out;
  }
  /* live test 2026-11-05: stR0 = another push button row (a valve OPEN / CLOSE P.B.), noRun = do not aim at a RUNNING output */
  function permOf(s, stR0, noRun) {
    const nl = s.nl,
      stR = stR0 != null ? stR0 : pbRow(s, /\bSTART\b|\bST$/);
    if (stR < 0) return null;
    const C = ctx(s),
      stN = new Set(DUI.rowNets(s, stR, 'L') || []);
    /* a flip-flop output is a memory (the seal-in of the start): the START path does not run back through it */
    const ins = g => (g.t === 'FF' ? [] : g.ins || []);
    const cone = new Map();
    const onSt = (n, d) => {
      if (cone.has(n)) return cone.get(n);
      cone.set(n, false);
      const g = C.drv.get(n);
      const r = stN.has(n) || (!!g && (d || 0) < 60 && ins(g).some(m => onSt(m, (d || 0) + 1)));
      cone.set(n, r);
      return r;
    };
    const P = { s, stN, onSt };
    /* reach of the START P.B. through the seal-in too (to find the target) */
    const cone2 = new Map();
    const reach = (n, d) => {
      if (cone2.has(n)) return cone2.get(n);
      cone2.set(n, false);
      const g = C.drv.get(n);
      const r = stN.has(n) || (!!g && (d || 0) < 80 && (g.t === 'FF' ? g.s || [] : g.ins || []).some(m => reach(m, (d || 0) + 1)));
      cone2.set(n, r);
      return r;
    };
    /* the target: the RUNNING output of the motor (what the start must reach, through its trips), else the flip-flop set by the
       START P.B., else the first start command output */
    let t = null;
    if (!noRun)
    try {
      const ro = DUI.outs(s).find(o => /RUNNING/.test(o.name) && !/NOT RUNNING|STOP/.test(o.name)),
        on = ro && (nl.outs || []).find(o => o.row === ro.row);
      if (on && reach(on.n)) t = on.n;
    } catch (e) {}
    if (t == null)
    for (const g of nl.gates || [])
      if (g.t === 'FF' && (g.s || []).some(m => reach(m))) {
        /* a valve push button (noRun): the flip-flop OUTPUT, so a RESET that holds it (DITL-32: MFT, steam flow < 10 %) is listed */
        t = noRun && g.out && g.out.length ? g.out[0] : g.s.find(m => reach(m));
        break;
      }
    if (t == null) {
      const po = (nl.pout || []).find(q => reach(q.n));
      if (po) t = po.n;
    }
    if (t == null) return null;
    return needNet(s, t, 1, P, 0, new Set(), []);
  }
  /* live test 2026-11-05 (XV-FW1111-1 OPEN did nothing at Cold, the faceplate said EXECUTED): the input rows that keep the command of
     a push button row from going through, [{ svc, want, now, other }] (empty = nothing blocks it) */
  function pbBlock(addr, row) {
    const s = dOf(addr);
    if (!s || !window.DUI) return null;
    try {
      if (!s.nl) s.nl = netlist(s);
      const L = permOf(s, row, true) || [];
      return L.filter(r => r.row !== undefined)
        .map(r => {
          const rs = r.s || s;
          return { svc: rowInfo(rs, r.row).svc, want: r.want, now: DUI.rowVal(rs, r.row), other: rs !== s ? dName(rs) : '' };
        })
        .filter(x => x.now !== x.want);
    } catch (e) {
      return null;
    }
  }
  function interlock(addr) {
    const s = dOf(addr),
      nm = dName(s);
    if (!s || !window.DUI || !DUI.need) return null;
    const live = wlOn(); /* 3.2.0 retest #28: PAUSED too (the last scan) */
    let L = null;
    try {
      if (!s.nl) s.nl = netlist(s);
      /* the start command to the motor (the first physical output, MOR); a drawing without one: the RUNNING output row 5 */
      const ar = atRow(addr),
        on = ar != null ? (s.nl.outs || []).find(o => o.row === ar) : null;
      L = on ? needNet(s, on.n, 1, null, 0, new Set(), []) : permOf(s);
      /* Mina F46: a MOV has no START: its permissive is no trip (DITL-60 row 4 goes through a NOT, normal 0) and REMOTE, added below. The fall-back read
         output row 4 of a motor drawing, on a MOV that row is TRIP or TORQUE, shown as "must be 1" */
      if (!L && (s.nl.mv || []).length) {
        L = [];
        for (let r = 0; r < 40; r++) if (/\bTRIP\b/.test(rowInfo(s, r).svc) && !/P\.?B\b/.test(rowInfo(s, r).svc)) L.push({ row: r, want: 0 });
      }
      if (!L) L = (DUI.need(s, 4) || []).map(r => (r.row !== undefined ? { row: r.row, want: r.want } : { txt: r.txt }));
    } catch (e) {
      return null;
    }
    /* the LOCAL / REMOTE selector of the motor: REMOTE for a start from the DCS (a start through a pulse timer and a flip-flop does
       not list it) */
    /* R9 #76: an output row of a drawing with two machines (DITL-45 PLANT / INSTRUMENT AIR DRYER-A): only the selector of that machine
       (the IA dryer asked for the PA dryer REMOTE too, its START was blocked) */
    let eq0 = '';
    try {
      const ar = atRow(addr),
        o = ar != null ? (DUI.outs(s) || []).find(q => q.row === ar) : null;
      eq0 = o ? eqW(o.name) : '';
      /* no REMOTE row of that machine (BURNER A READY): every REMOTE row, as before */
      let any = false;
      for (let r = 0; r < 40; r++) if (REM.test(rowInfo(s, r).svc) && eqW(rowInfo(s, r).svc) === eq0) any = true;
      if (!any) eq0 = '';
    } catch (e) {}
    for (let r = 0; r < 40; r++) if (REM.test(rowInfo(s, r).svc) && (!eq0 || eqW(rowInfo(s, r).svc) === eq0) && !L.some(x => (x.s || s) === s && x.row === r)) L.push({ s, row: r, want: 1 });
    const P = PERM[addr] || (PERM[addr] = new Map());
    let pb = false;
    for (const r of L) {
      if (r.row === undefined) {
        pb = true;
        continue;
      }
      const rs = r.s || s,
        k = rs.name + ':' + r.row + ':' + r.want;
      if (!P.has(k)) P.set(k, { ...r, s: rs });
    }
    const rows = [...P.values()].map(r => {
      const info = rowInfo(r.s, r.row),
        v = DUI.rowVal(r.s, r.row);
      /* one of several ways (an OR to 1, an AND to 0): met when its group net already has the value it needs */
      const grp = (r.alts || []).some(a => {
        try {
          return (simRead(a.s).v[a.n] ? 1 : 0) === a.want;
        } catch (e) {
          return false;
        }
      });
      return { ...info, s: r.s, other: r.s !== s ? dName(r.s) : '', cmp: r.cmp || '', want: r.want, ok: v === r.want || grp, start: r.s === s && /\bSTART\b/.test(info.svc) && !/PERMI/.test(info.svc) };
    });
    const miss = rows.filter(r => !r.ok && !r.start);
    return { sheet: nm, rows: rows.filter(r => !r.start), miss, pb: pb || rows.some(r => r.start), live, eq: eq0 };
  }
  /* where a missing row comes from (the one world links, src/world/world.js W.idx.din): the output of another DITL sheet is followed
     to what that output needs, down to a row with no source = a field contact (limit switch ZSO / ZSC, LOCAL / REMOTE selector) that
     the field operator sets; a row fed by an ABC sheet is shown with its sheet (an operator action there) */
  function leaves(s, row, want, d, seen, out) {
    const k = s.name + ':' + row;
    if (seen.has(k) || d > 4) return;
    seen.add(k);
    const m = window.WORLD && WORLD.idx && WORLD.idx.din.get(s),
      srcs = m && m.get(row);
    /* 3.2.0 P1: the REMOTE selector of a MOV at its MCC (DITL-38 row 2, DITL-54 row 12): the valve model mirrors the row into its REMOTE
       output and the output feeds the row back; the row itself is the field contact */
    const mir = ((s.nl && s.nl.mv) || []).some(b => (b.fb || []).some(f => f.ty === 'MIL' && f.mir === row));
    if (mir) {
      if (!out.field.some(x => x.s === s && x.row === row)) out.field.push({ s, row, want, av: null, ...rowInfo(s, row) });
      return;
    }
    if (!srcs || !srcs.length) {
      /* a push button (START / STOP P.B.) is an operator action of another step, not a field contact */
      if (/P\.\s*B\.?|\bPB\b|PUSH/.test(rowInfo(s, row).svc)) return;
      if (!out.field.some(x => x.s === s && x.row === row)) {
        /* an analog row (a transmitter into a comparator): the field value that makes the comparator give `want` */
        const a = (s.nl.an || []).find(x => x.row === row),
          nets = DUI.rowNets(s, row, 'L') || [],
          g = a && (s.nl.gates || []).find(x => x.t === 'CMP' && nets.includes(x.ins[0]) && x.sp != null);
        let av = null;
        if (a && g) {
          const hi = g.cmp === '>' ? want : !want,
            sp = +g.sp;
          av = { key: a.key, x: hi ? sp + Math.max(0.5, Math.abs(sp) * 0.5) : sp - Math.max(0.5, Math.abs(sp) * 0.5), txt: g.sptxt || g.cmp + ' ' + sp + (g.unit || '') };
        }
        out.field.push({ s, row, want, av, ...rowInfo(s, row) });
      }
      return;
    }
    for (const q of srcs) {
      if (q.k === 'd') {
        if (!q.d.nl) q.d.nl = netlist(q.d);
        /* 3.2.1 d2: a wire with a TO reference (world.js wireTo): row "n<net>" */
        const on = (q.d.nl.outs || []).find(x => x.row === q.row) || (/^n\d+$/.test(q.row) ? { n: +q.row.slice(1) } : null);
        const L = on ? needNet(q.d, on.n, want ? 1 : 0, null, 0, new Set(), []) : [];
        for (const r of L) leaves(r.s, r.row, r.want, d + 1, seen, out);
      } else if (q.sh && !out.abc.includes(q.sh.name)) out.abc.push(q.sh.name);
    }
  }
  function fieldOf(addr) {
    const s = dOf(addr),
      I = s && interlock(addr),
      out = { field: [], abc: [], by: {} };
    if (!I || !I.live) return out;
    /* the LOCAL / REMOTE selector of the motor at the switchgear: REMOTE for a start from the DCS (a drawing that starts the motor
       through a pulse timer and a flip-flop does not list it in its interlock) */
    for (let r = 0; r < 40; r++)
      if (REM.test(rowInfo(s, r).svc) && (!I.eq || eqW(rowInfo(s, r).svc) === I.eq) && DUI.rowVal(s, r) !== 1) {
        const o = { field: [], abc: [] };
        try {
          leaves(s, r, 1, 0, new Set(), o);
        } catch (e) {}
        for (const f of o.field) if (!out.field.some(x => x.s === f.s && x.row === f.row)) out.field.push(f);
      }
    for (const r of I.miss) {
      const o = { field: [], abc: [] };
      try {
        leaves(r.s || s, r.row, r.want, 0, new Set(), o);
      } catch (e) {}
      out.by[(r.s || s).name + ':' + r.row] = o;
      for (const f of o.field) if (!out.field.some(x => x.s === f.s && x.row === f.row)) out.field.push(f);
      for (const a of o.abc) if (!out.abc.includes(a)) out.abc.push(a);
    }
    return out;
  }
  /* START / STOP of a motor from its DITL drawing (one world ON): the pushbutton input row of the drawing (CRT, no source) pressed
     for 1.5 s, the same as the PRESS of the Inputs tab; the motor runs only when the interlock of the drawing allows it */
  const pbRow = (s, re) => {
    const m = WORLD.idx && WORLD.idx.din.get(s);
    for (let r = 0; r < 40; r++) {
      const v = (rowInfo(s, r).svc || '').replace(/^[\w./ ]*?\d{4}\S*\s+/, '');
      if (re.test(v) && !/LOCAL|PERMI|COMMAND|AUTO/.test(v) && !(m && m.get(r))) return r;
    }
    return -1;
  };
  /* a push button row of a DITL drawing (by name, machine A, or an instance "DITL-09 #B"), pressed (held for two scans, then released), and
     a maintained selection of an input row: engine actions of the one world (src/world/dock-eng.js WORLD.dpress / WORLD.dset, 3.2.0 Web
     Worker: the hold runs where the scans run); dout = an output row of a drawing (1 / 0, null without the one world) */
  const dpress = (nm, row) => !!(window.WORLD && WORLD.dpress && WORLD.dpress(nm, row));
  const dset = (nm, row, v) => !!(window.WORLD && WORLD.dset && WORLD.dset(nm, row, v));
  function dout(nm, row) {
    const s = dSheet(nm);
    if (!s || !wlOn()) return null;
    try {
      if (!s.nl) s.nl = netlist(s);
      return DUI.outVal(s, row);
    } catch (e) {
      return null;
    }
  }
  /* an output that the drawing writes at a DO address in the logic area, not on an output row (netlist pout): DITL-44 O.029F, the
     open command of the APH air motor solenoid valve SV-PA1052 (I/O list: DO, "Logic DITL44", PICT 38); 1 / 0, null = no such output */
  function pout(nm, adr) {
    const s = dSheet(nm);
    if (!s || !wlOn()) return null;
    try {
      if (!s.nl) s.nl = netlist(s);
      const o = (s.nl.pout || []).find(q => q.adr === adr);
      return o ? (simRead(s).v[o.n] ? 1 : 0) : null;
    } catch (e) {
      return null;
    }
  }
  /* the RUNNING output of a drawing */
  function runOut(nm) {
    const s = dSheet(nm);
    if (!s) return null;
    try {
      const ro = DUI.outs(s).find(o => /RUNNING/.test(o.name) && !/NOT RUNNING|STOP/.test(o.name));
      return ro ? dout(nm, ro.row) : null;
    } catch (e) {
      return null;
    }
  }
  /* beta.496 (EIMI): has the drawing a DCS START / STOP push button at all (null = no drawing)? DITL-120 (waste water pumps) has none */
  const hasPb = (addr, on) => {
    const s = dOf(addr);
    return s ? pbRow(s, on ? /\bSTART\b|\bST$/ : /\bSTOP\b/) >= 0 : null;
  };
  function dmotor(addr, on) {
    const s = dOf(addr);
    if (!s || !(window.WORLD && WORLD.on && WORLD.live)) return false;
    try {
      if (!s.nl) s.nl = netlist(s);
    } catch (e) {
      return false;
    }
    const r = pbRow(s, on ? /\bSTART\b|\bST$/ : /\bSTOP\b/);
    if (r < 0) return false;
    const ok = dpress(s.name, r);
    if (ok && on) startWhy(s, addr);
    return ok;
  }
  /* 3.2.3-beta.145 (Mina B139-CF2, beta.139 step 55: START feeder A did nothing, "all stopped", no reason shown). DITL-19: the START
     needs COAL FEEDER A REMOTE SELECTED (row 6, I.0132, the field selector), the discharge valve OPENED (row 14), no MFT / fault, and
     (lower layer > 450 C AND a burner in service) OR lower layer > 700 C (rows 16 ~ 21, held by a timer: lost = the feeder stops). A START
     that the drawing does not take now says why in the Event log: the selector LOCAL at once, any other missing permissive after 3 s */
  function startWhy(s, addr) {
    const nm = dName(s),
      say = t => call(() => window.lsEventAdd && lsEventAdd(nm, 'DCS', t));
    const m = call(() => modeOf(addr), null);
    if (m && m.rem === false) {
      const R = (s._mrows || {}).rem || [];
      say('START not taken: the field LOCAL / REMOTE selector is LOCAL (row ' + R.map(x => x + 1).join(', ') + ' REMOTE SELECTED = 0). The field operator sets it to REMOTE first.');
      return;
    }
    setTimeout(() => {
      if (call(() => runOut(s.name), null) !== 0) return;
      /* DITL-19: (> 450 C AND any burner IN SERVICE) OR > 700 C. A burner row is named only when no burner is in service, a furnace
         temperature row only when that path is the missing one */
      const rows = [];
      for (let q = 0; q < 40; q++) {
        const v = rowInfo(s, q).svc;
        if (!/OPENED|ADEQUATE|IN SERVICE|REMOTE SELECTED/.test(v) || /COAL FEEDER [B-C]\b/.test(v)) continue;
        rows.push({ v, x: call(() => DUI.rowVal(s, q), null), t: 'row ' + (q + 1) + ' ' + v.replace(/^\(FROM STATION WIRING\)\s*/, '') });
      }
      const on = re => rows.some(z => re.test(z.v) && z.x === 1),
        hot = on(/>\s*700/),
        fire = on(/>\s*450/) && on(/IN SERVICE/),
        miss = rows.filter(z => z.x === 0 && !(/ADEQUATE|IN SERVICE/.test(z.v) && (hot || fire || (/IN SERVICE/.test(z.v) && on(/IN SERVICE/)))));
      say('START not taken: the drawing holds the motor stopped' + (miss.length ? '. Inputs at 0: ' + miss.slice(0, 6).map(z => z.t).join('; ') : '') + '. Open ' + nm + ' for the permissive.');
    }, 3000);
  }
  /* the field operator sets the contacts (the switch of the input row on its DITL sheet, the same as the Inputs tab) */
  function fieldSet(L) {
    for (const f of L) {
      if (f.av) {
        f.s.av = f.s.av || {};
        f.s.av[f.av.key] = f.av.x;
        try {
          f.s.nl.avk = avOf(f.s);
        } catch (e) {}
        continue;
      }
      f.s.sig[f.row + ':S'] = !!f.want;
      /* R9 #76: one address = one signal (CLAUDE.md 1): DITL-45 rows 5 and 9 are both I.0085 PLANT AIR DRYER-A REMOTE (the START and
         the STOP gate); setting one row left the other 0, shown red as missing */
      {
        for (const r of twinRows(f.s, f.row)) f.s.sig[r + ':S'] = !!f.want;
      }
      /* the other limit switch of the same vane / damper: OPENED <-> CLOSED */
      const tw = f.svc.replace(/\bOPENED\b|\bOPEN\b|\bCLOSED\b/, w => (w === 'CLOSED' ? 'OPENED' : 'CLOSED'));
      if (tw !== f.svc)
        for (let r = 0; r < 40; r++) {
          const v = rowInfo(f.s, r).svc;
          if (r !== f.row && (v === tw || v === tw.replace('OPENED', 'OPEN'))) f.s.sig[r + ':S'] = !f.want;
        }
    }
    pscan();
    try {
      render();
    } catch (e) {}
  }
  /* Mina B67-1 (beta.67 step 150): the AUTO MODE SELECTED of BFWP A (DITL-23A row 18) written only on the page was put under by the
     next patch of the Worker (its copy still 0) before the page's write went out: the first press logged but did not latch, a second
     press did. The same row is now also written by the engine action WORLD.dset (src/world/dock-eng.js, runs in the Worker at once);
     the page write stays for a paused world (dset needs the world running, and no patch comes while paused) */
  function engSet(s, row, v) {
    if (!(window.WORLD && WORLD.dset)) return;
    for (const r of [row].concat(twinRows(s, row)))
      try {
        WORLD.dset(s.name, r, !!v);
      } catch (e) {}
  }
  /* retest #47: a maintained CRT selection of a DITL input row (SEAWATER PUMP x AUTO MODE SELECTED, DITL-29A row 4), logged; PAUSED too */
  function dsel(nm, row, v, txt) {
    const s = dSheet(nm);
    if (!s) return false;
    s.sig[row + ':S'] = !!v;
    {
      /* one address = one signal (CLAUDE.md 1): DITL-29A rows 4 and 19 are both M.1152 */
      for (const r of twinRows(s, row)) s.sig[r + ':S'] = !!v;
    }
    engSet(s, row, v);
    if (WORLD.live) WORLD.busy = true;
    pscan();
    try {
      if (window.lsEventAdd) lsEventAdd(dName(s), 'DCS', 'Operator: ' + (txt || rowInfo(s, row).svc) + ' = ' + (v ? 1 : 0) + ' (row ' + (row + 1) + ')');
    } catch (e) {}
    return true;
  }
  /* 3.2.0 retest #33: a field action on one input row of a drawing (a compressor started at its local panel: DITL-113 row 5 RUNNING),
     logged in the Event log; PAUSED too */
  function fieldRow(nm, row, on, txt) {
    const s = dSheet(nm);
    if (!s) return false;
    s.sig[row + ':S'] = !!on;
    {
      /* R9 #76: the other rows of the same address */
      for (const r of twinRows(s, row)) s.sig[r + ':S'] = !!on;
    }
    if (WORLD.live) WORLD.busy = true;
    pscan();
    try {
      if (window.lsEventAdd) lsEventAdd(dName(s), 'FIELD', 'Field operator: ' + (txt || rowInfo(s, row).svc) + ' (row ' + (row + 1) + ')');
    } catch (e) {}
    return true;
  }
  /* live test 2026-10-30 #12: the field operator turns the LOCAL / REMOTE selector of a motor to REMOTE (every REMOTE MODE SELECTED row of
     its drawing: DITL-29A rows 5, 18, 22; DITL-30 row 22; DITL-112 row 22), logged; PAUSED too */
  function dremote(ad, l) {
    const s = dOf(ad);
    if (!s || modeOf(ad) == null) return false;
    const R = (s._mrows || {}).rem || [];
    if (!R.length) return false;
    for (const r of R) s.sig[r + ':S'] = true;
    if (WORLD.live) WORLD.busy = true;
    pscan();
    try {
      if (window.lsEventAdd) lsEventAdd(dName(s), 'FIELD', 'Field operator: ' + (l || dName(s)) + ' LOCAL / REMOTE selector to REMOTE (row ' + R.map(r => r + 1).join(', ') + ')');
    } catch (e) {}
    return true;
  }
  /* the other input rows of the same address on a drawing (one address = one signal, CLAUDE.md 1): the same service text with an address
     (DITL-29A rows 4 and 19 M.1152), or live test #51 the same TAG NO. (DITL-77 row 1 "B-AUX. CW PUMP AUTO PB" and row 4 "B-AUX. CW PUMP
     AUTO SELECTED" are both M.1242 B-AUX. COOLING WATER PUMP AUTO MODE (CRT), memory list STN103: the AUTO of the faceplate set row 1
     only and the dock read row 4 as missing) */
  function twinRows(s, row) {
    const I = rowInfo(s, row),
      sv = I.svc,
      tg = /^[IM]\.[0-9A-F]{4}$/.test(I.tag || '') ? I.tag : '',
      o = [];
    for (let r = 0; r < 40; r++) {
      if (r === row) continue;
      const J = rowInfo(s, r);
      if ((tg && J.tag === tg) || (/\b[IM]\.[0-9A-F]{4}/.test(sv) && J.svc === sv)) o.push(r);
    }
    return o;
  }
  const rowInfo = (s, row) => {
    let tag = '',
      svc = '';
    try {
      const I = DUI.rowInfo ? DUI.rowInfo(s, row) : null;
      if (I) ({ tag, svc } = I);
    } catch (e) {}
    return { row, no: row + 1, tag, svc: svc || 'Input row ' + (row + 1) };
  };

  /* live test 2026-10-30 #5 (#121, HMI 030 as snapshot 30.PNG: R / M / A at each pump): the REMOTE and the AUTO selection of a motor, read on
     its drawing (DITL-29A row 5 / 22 REMOTE MODE SELECTED, row 4 AUTO MODE SELECTED; DITL-30 row 22, row 4); null when the drawing has none */
  function modeOf(ad) {
    const s = dOf(ad);
    if (!s) return null;
    if (!s._mrows) {
      const R = { rem: [], au: [] };
      for (let r = 0; r < 60; r++) {
        const v = rowInfo(s, r).svc;
        /* Mina #3 (beta.87): the ACW pumps write it "A-AUX. CW PUMP REMOTE SELECTED" (DITL-76 / 77 row 5 I.0088, rows 19 / 20), no "MODE":
           the dock saw no selector there, so ACWP-B stayed LOCAL */
        if (/REMOTE (MODE )?SELECTED/.test(v) && !/\b(AUTO|NOT)\b/.test(v)) R.rem.push(r);
        else if (/\bAUTO MODE SELECTED\b/.test(v)) R.au.push(r);
      }
      /* live Cold start beta.241 (coal feeder B would not start, its faceplate said REMOTE): DITL-19 rows 22 ~ 27 read the REMOTE of all
         three feeders (I.0132 / I.0452 / I.0492) for "ALL IN REMOTE AND RUNNING" (ABC-004A/B/C). Feeder B showed the REMOTE of feeder A
         and its REMOTE / LOCAL press set the selectors of A and C too. One address = one signal (CLAUDE.md 1): the selector of this motor
         is the address of its first REMOTE row; the rows of other addresses belong to other motors */
      const t0 = R.rem.length ? rowInfo(s, R.rem[0]).tag : '';
      /* 3.2.4-beta.71 (JENNIE, live Cold start 2026-11-17: SWP-A START not taken, "the drawing holds the motor stopped", since beta.242):
         DITL-29A row 22 "SEAWATER PUMP A REMOTE MODE SELECTED" has no address (the local panel row) and the filter above dropped it, so
         REMOTE set rows 5 / 18 only. A row with no address stays when its text names the same motor as the first row */
      /* 3.2.4-beta.72 (JENNIE, live Cold start on Stable 3.2.4: CEP-A START not taken): DITL-61A row 5 reads "MIL-P1116A CONDENSATE PUMP A
         I.0082 REMOTE SELECTED" and the local panel row 20 "CONDENSATE PUMP A REMOTE SELECTED": the text is compared without the equipment
         tag (MIL-P1116A) and the address (I.0082 / M.1183), wherever they stand */
      const txN = r =>
        String(rowInfo(s, r).svc || '')
          .replace(/\b[IMB]\.[0-9A-F]{4}(\/\d+)?/g, ' ')
          .replace(/\b[A-Z]{2,4}-[A-Z]{0,3}\d{3,5}[A-Z0-9]*\b/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      if (/^[IM]\.[0-9A-F]{4}$/.test(t0 || '')) {
        const x0 = txN(R.rem[0]);
        R.rem = R.rem.filter(r => rowInfo(s, r).tag === t0 || (!rowInfo(s, r).tag && txN(r) === x0));
      }
      if (R.au.length > 1) {
        const a0 = rowInfo(s, R.au[0]).tag;
        if (/^[IM]\.[0-9A-F]{4}$/.test(a0 || '')) R.au = R.au.filter(r => rowInfo(s, r).tag === a0);
      }
      /* live test 2026-11-05 (CEP-A / B, DITL-61A rows 4 / 14 "CONDENSATE PUMP A M.1182 AUTO SELECTED", no "MODE"): the faceplate AUTO
         stayed grey (mode unknown) although amRow finds the CRT row; the mode is read from that row too */
      if (!R.au.length) {
        const a = call(() => amRow(s), null);
        if (a) R.au.push(a.row);
      }
      s._mrows = R;
    }
    const val = r => call(() => DUI.rowVal(s, r), null) === 1 || !!(s.sig && s.sig[r + ':S']),
      R = s._mrows;
    return { rem: R.rem.length ? R.rem.some(val) : null, au: R.au.length ? R.au.some(val) : null };
  }
  /* retest #69: the AUTO MODE SELECTED input row of a motor drawing (a maintained CRT selection), or null */
  function amRow(ds) {
    if (!ds) return null;
    if (ds._amr !== undefined) return ds._amr;
    let o = null;
    for (let r = 0; r < 60 && !o; r++) {
      const v = rowInfo(ds, r).svc;
      if (/\bAUTO MODE SELECTED\b/.test(v) && !/REMOTE/.test(v)) o = { s: ds, row: r, svc: svcN(v) };
    }
    /* live test #51: the ACW pumps write it "B-AUX. CW PUMP AUTO SELECTED" (DITL-77 row 4, M.1242 AUTO MODE (CRT), memory list STN103):
       a CRT memory row of a motor drawing only (the drain valves DITL-73 / 80 / 88 ... have their own AUTO SELECTED) */
    /* a motor drawing: a RUNNING output, or a START push button row (Mina #M28: DITL-76, ACWP-A, had no AUTO chip: its outputs do not say
       RUNNING); the drain valves (DITL-73 / 80 / 88) have OPEN / CLOSE push buttons, not START */
    const motor =
      !o && (call(() => DUI.outs(ds).some(q => /RUNNING/.test(q.name) && !/NOT RUNNING/.test(q.name)), false) || call(() => pbRow(ds, /\bSTART\b/) >= 0, false));
    for (let r = 0; r < 60 && !o && motor; r++) {
      const I = rowInfo(ds, r);
      if (/\bAUTO SELECTED\b/.test(I.svc) && !/REMOTE|START/.test(I.svc) && /^M\.[0-9A-F]{4}$/.test(I.tag || '')) o = { s: ds, row: r, svc: svcN(I.svc) };
    }
    return (ds._amr = o);
  }
  /* 3.2.0-beta.35 (CHECKLIST 0.2): open a DITL drawing by name, machine B ~ D on its own page ("DITL-29A #B" = SWP-B, the B chip of the
     sheet header); before, the drawing of machine A was opened for B ~ D */
  function openD(nm, row, zoom, rows) {
    const m = /\s*#([B-D])$/.exec(String(nm));
    document.body.classList.remove('lsfield');
    /* opening a drawing never changes RUN: setCat alone carries it over (Mina #M10 / #M20). Mina #M26 / #M27: a second RUN press here,
       at another moment than setCat's, toggled the run (RUN / PAUSED / "RUN (ABC)"), the DITL stopped scanning and the DCS START /
       FIELD REMOTE of the SWP did nothing */
    AN.xrefGo({ d: String(nm).replace(/\s*#\w+$/, '') });
    setTimeout(() => {
      try {
        if (window.DUI && DUI.setMach) DUI.setMach(m ? 'ABCD'.indexOf(m[1]) : 0);
        /* retest #39: from the Training, the row of the step zoomed in (row 0 = the top of the sheet when no row is named) */
        if ((row != null || zoom) && DUI.goItem)
          DUI.goItem(S.cur, undefined, null, { side: 'L', i: row != null ? row : 0, zoom: zoom || 0, rows });
      } catch (e) {}
      /* retest #38: the sheet the guide opens leaves no "Opened DITL-xx - use the ABC button ..." in the status bar (the dock says
         which sheet and row) */
      document.body.classList.remove('hasmsg');
    }, 80);
  }
  /* the equipment lamp groups (the strip of the old Training dock): events.js suppresses the shutdown alarms of a group until all of its
     machines run (grpOn) */
  const LV = () => window.LS_LIVE;
  const bit = a => call(() => LV().val(a), 0) > 0.5;
  /* a lamp address: M.xxxx (ABC memory), DITL-xx[@out row] (a drawing of the one world), F:key (a field state), L:DITL-xx@row (a local input),
     T:key (an auxiliary of the TCS panel: lop = MOP, eh = COP) */
  const lampOn = a => {
    if (/^F:/.test(a)) return call(() => !!AN.fieldState()[a.slice(2)], false);
    if (/^T:/.test(a))
      return call(() => {
        const x = AN.tcs();
        return x ? !!x.aux[a.slice(2)] : !!(AN.unit && AN.unit.on); /* no TCS model = the 150 MW snapshot: the oil pumps run */
      }, false);
    if (/^L:/.test(a)) return call(() => DUI.rowVal(dOf(a.slice(2)), atRow(a)) === 1, false);
    if (/^DITL-/.test(a)) return call(() => (atRow(a) != null ? dout(a, atRow(a)) === 1 : runOut(a) === 1), false);
    return bit(a);
  };
  const any = L => L.some(lampOn);
  const LAMPS = [
    ['SWP', ['M.3353', 'M.3354', 'M.3355'], 'Seawater pumps A / B / C'],
    ['CEP', ['M.3350', 'M.3351'], 'Condensate pumps A / B'],
    ['BFWP', ['M.3343', 'M.3344'], 'Boiler feedwater pumps A / B'],
    ['IDF', ['M.3304'], 'ID fan'],
    ['FAB', ['M.3308', 'M.3309'], 'Fluidizing air blowers A / B'],
    ['SAF', ['M.3303'], 'Secondary air fan'],
    ['PAF', ['M.3302'], 'Primary air fan'],
    /* R9 #77: OIL = the turbine oil pumps (MOP lube oil, COP control oil, TCS); the start-up burners (diesel oil) are BRNR */
    ['BRNR', ['M.3412', 'M.3413', 'M.3418', 'M.3419'], 'Start-up burners (diesel oil) A / B / C / D in service'],
    ['COAL', ['M.3400', 'M.3401', 'M.3402'], 'Coal feeders A / B / C'],
    /* retest #33 #51: the equipment of the utilities (sections 3 ~ 17): a DITL drawing, an output row of one, or a local field state */
    ['HYPO', ['F:hypo'], 'Hypochlorite pump (local)'],
    ['DF', ['DITL-39@3', 'DITL-39@14'], 'Debris filters SWP / SWBP outlet in operation'],
    ['SWBP', ['DITL-30', 'DITL-30 #B', 'DITL-30 #C'], 'Seawater booster pumps A / B / C'],
    ['MWP', ['DITL-112', 'DITL-112 #B', 'DITL-112 #C'], 'Make-up water pumps A / B / C'],
    ['ACW', ['DITL-76', 'DITL-77'], 'Aux. cooling water pumps A / B'],
    ['AIR', ['DITL-45@14', 'DITL-45@3', 'L:DITL-113@5', 'L:DITL-114@5'], 'IA / PA dryers and compressors'],
    ['OIL', ['T:lop', 'T:eh'], 'Turbine oil pumps (TCS): main oil pump MOP (lube oil), control oil pump COP'],
    ['RAH', ['DITL-43'], 'Rotary air preheater']
  ];
  /* retest #62: one lamp group of the strip running (all of its machines for the fans: events.js shutdown alarm suppression) */
  const grpOn = k => {
    const L = LAMPS.find(x => x[0] === k);
    return !!L && any(L[1]);
  };
  window.LS_OP = { dOf, dName, dout, pout, runOut, dpress, dset, dsel, dmotor, hasPb, dremote, mst, tripNew, tripAck, grpOn, modeOf, amRow, fieldRow, fieldSet, fieldOf, interlock, needNet, leaves, permOf, pbBlock, openD };
})();
