/* ===== GENERATOR CONTROL PANEL (user "go all" 2026-11-19, item 5: the generator panel engine) =====
   The model of the field, the AVR and the ASD is tcs-gen.js; this file is what the operator presses and reads on the panel, and the
   generator lockout relays.
   Sources (local notes document-references/_notes/gen-sync-llm-2026-11-14.txt; GEE-2015-0141 R2 SITE TEST PROCEDURE FOR GEN. CONTROL PANEL,
   GEE-2015-0173 R1 SITE TEST PROCEDURE OF GEN. PROTECTION RELAY PANEL, Generator Logic.pdf):
   - MANUAL synchronizing (GEE-2015-0141 PDF p.7): SYN 7-90R voltage RAISE / LOWER to the AVR, 7-65 speed RAISE / LOWER to the TCS (GOV),
     and the 52G CLOSE switch; "SYN. CHECK 25 ON" is needed for the close (Generator Logic.pdf p.4 1.3: 52G can be closed only while the
     synchronizing check relay 25 is operated: dV 5 %, dF 0.15 Hz, d-theta 10 deg, CSY-96-S2, GEE-2015-0141 p.26). The meters of the
     panel (D-2): voltmeter, frequency meter, synchroscope.
   - AVR AUTO / MANUAL (Generator Logic.pdf SH-G-4, AVR signals).
   - Lockout relays (GEE-2015-0173 2-3 Sequence Test, Trip Interlock and Alarm, Group A rows 1 ~ 35, Group B rows 38 ~ 68): 86G-A takes the
     protections of relay (A), 86G-B those of relay (B); each opens 52G, 52L and 41 and trips the turbine (TA-9 inputs 17 / 19, GEN./UNIT
     TRANS. PROTECTION A / B & GEN. LOCKOUT RELAY A / B). "GEN. TRANSF. LOCKOUT RELAY (86T) Operated" is an input of both groups (rows
     33 / 66). Modelled causes: the 2nd REVERSE POWER (32) of both relays (rows 13 / 50, unit.js anRp32) and 86T (the transformer
     protections behind it are not in these papers: the instructor operates 86T, world.js 'gen.86t'). The other relays of the panel
     (87G, 40, 24, 46, 59, 64, 81 ...) are not modelled.
   - The lockout relays are hand reset (RESET of the relay, here AN.turbine('gen', { op: 'reset86' })), refused while the cause stands.
     The TURBINE RESET also resets them, as before (NO-SOURCE, kept: the panel reset is not on every page yet).
   AN.turbine('gen', { op, v }): op 'syn' v 'AUTO' | 'MAN'; 'avr' v 'AUTO' | 'MAN'; 'v+' / 'v-' (7-90R); 'n+' / 'n-' (7-65); 'close52g';
   'reset86'. Returns '' or why it was refused.
   AN.genPanel() -> the panel (AN.gen() is the meters of the generator, api.js): syn, avr, f41, c52g, kV, hz, gridHz, slip (Hz), dv (%), th (deg, the synchroscope), r25 (25 operated now),
   x84 (generator voltage established), asd (ASD1 in use), efd (pu field), fr (MANUAL set point), lo86 { a, b, t, why }, msg. */
function tcsLo86(U) {
  const L = U.lo86 || (U.lo86 = { a: false, b: false, t: false, why: '' }),
    W = typeof window !== 'undefined' ? window.WORLD : null,
    ev = m => {
      if (typeof window !== 'undefined' && window.lsEventAdd && !(window.ENG && ENG.mode === 'mirror')) lsEventAdd('GEN', 'GEN', m);
    },
    op = (why, m) => {
      if (L.a && L.b) return;
      if (!L.a) ev('GEN. LOCKOUT RELAY (86G-A) OPERATED: ' + m);
      if (!L.b) ev('GEN. LOCKOUT RELAY (86G-B) OPERATED: ' + m);
      L.a = L.b = true;
      L.why = why;
    };
  if (W && W.ft && W.ft.has('gen.86t') && !L.t) {
    L.t = true;
    ev('GEN. TRANSF. LOCKOUT RELAY (86T) OPERATED');
  }
  if (L.t) op('86T', 'GEN. TRANSF. LOCKOUT RELAY (86T)');
  if (U.rp32 && U.rp32.lo) op('32', '2nd REVERSE POWER (32)');
  return L;
}
/* the reset of the lockout relays: 86T first (its cause is the instructor's fault), then 86G-A / B (no cause standing) */
function tcsLo86Reset(U) {
  const L = U.lo86;
  if (!L || !(L.a || L.b || L.t)) return '';
  const W = typeof window !== 'undefined' ? window.WORLD : null;
  if (L.t && W && W.ft && W.ft.has('gen.86t')) return 'RESET refused: 86T is still operated by the transformer protection';
  L.t = false;
  if (U.rp32 && U.rp32.t2 >= AN_RP32.t2) return 'RESET refused: the 2nd REVERSE POWER (32) is still operated';
  if (U.rp32) U.rp32.lo = false;
  L.a = L.b = false;
  L.why = '';
  if (typeof window !== 'undefined' && window.lsEventAdd && !(window.ENG && ENG.mode === 'mirror'))
    lsEventAdd('GEN', 'GEN', 'Generator lockout relays 86G-A / 86G-B / 86T reset');
  return '';
}
function tcsGenCmd(U, a) {
  if (typeof tcsMirror === 'function' && tcsMirror()) return '';
  const g = tcsGen(U),
    K = TCS_GEN,
    tb = U.tb || {},
    c = U.tc,
    g52 = tb.st === 'sync' || tb.st === 'load',
    op = a && a.op,
    v = a && String(a.v || '').toUpperCase();
  if (op === 'syn') {
    if (v !== 'AUTO' && v !== 'MAN') return 'SYN: AUTO or MAN';
    g.syn = v;
    if (v === 'MAN') g.x25 = false;
    return '';
  }
  if (op === 'avr') {
    if (v !== 'AUTO' && v !== 'MAN') return 'AVR: AUTO or MAN';
    if (v === g.avr) return '';
    /* bumpless both ways: MANUAL starts from the field of the moment; AUTO starts from the voltage of the moment (off the grid) */
    if (v === 'MAN') g.fr = g.f41 ? g.efd : NaN;
    else if (!g52 && g.f41) g.vr = Math.max(0.9, Math.min(1.1, g.V / Math.max(0.01, (tb.rpm || 0) / 3600)));
    g.avr = v;
    return '';
  }
  if (op === 'v+' || op === 'v-') {
    if (!g.f41) return 'VOLTAGE RAISE / LOWER: the field switch 41 is open';
    g.oV = K.vpw;
    g.oVs = op === 'v+' ? 1 : -1;
    return '';
  }
  if (op === 'n+' || op === 'n-') {
    if (g52) return 'SPEED RAISE / LOWER: 52G is closed, the load is set on the TCS';
    if (!(c && c.step >= 3 && c.cur !== 3 && tb.rpm > 3500 && !c.trip)) return 'SPEED RAISE / LOWER: the turbine is not held at rated speed by the TCS';
    if (op === 'n+') g.pR = K.fpw;
    else g.pL = K.fpw;
    return '';
  }
  if (op === 'close52g') {
    if (g52) return '52G is already closed';
    if (g.syn !== 'MAN') return '52G CLOSE: put SYN on MANUAL (AUTO: the ASD closes 52G)';
    if (!g.f41 || g.V < K.v84) return '52G CLOSE refused: generator voltage not established (84GI)';
    if (U.el && U.el.l52 === false) return '52G CLOSE refused: 52L is open';
    if (!(c && c.cur === 5 && c.ph === 'in')) return '52G CLOSE refused: the ATS is not at SYNCH. & INITIAL LOAD';
    /* 25 at the contact: the angle the breaker meets after its closing time */
    const thc = tcsWrap(g.th + 360 * g.slip * K.tcb),
      r = K.r25,
      why = [];
    if (Math.abs(g.dv) > r.dV) why.push('voltage difference ' + (g.dv * 100).toFixed(1) + ' %');
    if (Math.abs(g.slip) > r.dF) why.push('frequency difference ' + g.slip.toFixed(2) + ' Hz');
    if (Math.abs(thc) > r.dTh) why.push('phase angle ' + thc.toFixed(0) + ' deg');
    if (why.length) {
      g.last = '52G CLOSE refused: SYN. CHECK 25 not operated (' + why.join(', ') + ')';
      return g.last;
    }
    g.mc = true;
    g.thC = thc;
    g.last = '52G closed by hand at ' + thc.toFixed(0) + ' deg';
    return '';
  }
  if (op === 'reset86') return tcsLo86Reset(U);
  return 'unknown generator panel command';
}
AN.genPanel = () => {
  const U = AN.unit;
  if (!U || !U.on || !U.tb) return null;
  const g = tcsGen(U),
    K = TCS_GEN,
    tb = U.tb,
    g52 = tb.st === 'sync' || tb.st === 'load',
    L = U.lo86 || {},
    r = K.r25,
    f = x => (isFinite(x) ? Math.round(x * 1000) / 1000 : null);
  return {
    syn: g.syn || 'AUTO',
    avr: g.avr || 'AUTO',
    f41: !!g.f41,
    c52g: g52,
    kV: f(13.8 * (g.V || 0)),
    hz: f(g.fg),
    gridHz: f(g.fgr),
    slip: f(g.slip),
    dv: f((g.dv || 0) * 100),
    th: f(g.th),
    r25: !g52 && !!g.f41 && Math.abs(g.dv) <= r.dV && Math.abs(g.slip) <= r.dF && Math.abs(g.th) <= r.dTh,
    x84: (g.V || 0) >= K.v84,
    asd: !!g.x25,
    efd: f(g.efd),
    fr: f(g.fr),
    lo86: { a: !!L.a, b: !!L.b, t: !!L.t, why: L.why || '' },
    msg: g.last || ''
  };
};
