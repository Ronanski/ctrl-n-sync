/* TOP: the operator actions the regress tests use (test-only, NOT shipped in the app). GO NO SOP 2026-11-21 removed the guided Training
   (LS_GUIDE) whose action table these tests called as LS_GUIDE.A; this is the same table, writing what the faceplates write:
   CHECK.H (src/ui/uat/check.js) for a PID controller, the MAN block of a hand station (AN.latchMode / AN.stVal / AN.modeNets),
   LS_OP.dmotor for a DITL motor (its START / STOP pushbutton, the interlock decides). Loaded by lib.js open() as an init script. */
window.TOP = (function () {
  let HH = null, HOf = null, HRt = null;
  const rtNow = () => {
    const sh = AN.sheets && AN.sheets.find(x => x.name === 'ABC-001C');
    return sh && sh.S ? sh.S.rt : null;
  };
  const h = () => {
    const rt = rtNow();
    if (!HH || HOf !== AN.sheets || HRt !== rt) (HH = CHECK.H()), (HOf = AN.sheets), (HRt = rt);
    return HH;
  };
  const ctlTag = t => (window.LS_LIVE && LS_LIVE.ctlTag && LS_LIVE.ctlTag(t)) || t;
  const shOf = t => {
    try {
      return AN.fpFind(t);
    } catch (e) {
      return null;
    }
  };
  const station = t => {
    const k = shOf(t),
      sh = k && AN.sheets.find(s => s.name === k),
      T = sh && sh.S,
      b = T && T.blk.find(b => b.k === 'MAN' && (b.tag === t || (b.txt || []).includes(t)));
    return b ? { T, b } : null;
  };
  return {
    motor: (a, on) => (window.LS_OP && LS_OP.dmotor && LS_OP.dmotor(a, on) ? '' : (h().setx(null, a, on ? 1 : 0), '')),
    man(t, x) {
      t = ctlTag(t);
      const k = shOf(t);
      if (!k) return 'no faceplate ' + t;
      if (AN.opSheet) AN.opSheet(k);
      if (h().ctl(k, t)) return h().man(k, t, x), '';
      const s = station(t);
      if (!s) return 'no station ' + t;
      AN.latchMode(t, 'MAN');
      AN.stVal(k, s.b.id, x, (s.b.i || []).filter((n, i, L) => n >= 0 && L.indexOf(n) === i && s.T.ext.includes(n) && !(s.T.xlk && s.T.xlk[n]) && (AN.nm(s.T, n) || '').trim() === t + '.MV'));
      return '';
    },
    auto(t, sv) {
      t = ctlTag(t);
      const k = shOf(t);
      if (!k) return 'no faceplate ' + t;
      if (AN.opSheet) AN.opSheet(k);
      if (h().ctl(k, t)) return h().autoSv(k, t, sv), '';
      for (const [S2, n] of AN.modeNets(t) || []) S2.rt.ext[n] = 0;
      return '';
    },
    rem(t) {
      t = ctlTag(t);
      const k = shOf(t);
      if (!k) return 'no faceplate ' + t;
      if (AN.opSheet) AN.opSheet(k);
      return h().rem(k, t), '';
    },
    loc: t => (h().mode(ctlTag(t), 'LOC'), ''),
    tcs: (cmd, arg) => AN.turbine(cmd, arg) || '',
    h
  };
})();
