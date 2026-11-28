/* init for tools/steady150/settle.cjs (phase thread, 2026-11-28): the line-up items that came after the lineup-leak settle, on the
   settled start (lineup-logic / lineup-leak are NOT re-run: the start already holds them, and lineup-leak would step the APH leak
   back to 0). Each part chains onto the __settleMinute before it. */
/* + SUZU fix 25: condenser outlet valves (sw-outlet.js), chained */
(() => { const prev0 = typeof globalThis.__settleMinute === 'function' ? globalThis.__settleMinute : null;
(() => {
  const tgt = AN.swV0(),
    tags = ['V-SW1009', 'V-SW1010'];
  globalThis.__settleMinute = () => {
    const now = AN.swValves();
    for (const t of tags) {
      const d = tgt[t] - now[t];
      if (Math.abs(d) > 1e-9) AN.swValve(t, now[t] + Math.sign(d) * Math.min(2, Math.abs(d)));
    }
  };
})();
  const sw = globalThis.__settleMinute; globalThis.__settleMinute = m => { if (prev0) prev0(m); sw(m); }; })();

/* init for tools/steady150/settle.cjs (AOI, Phase 11, 2026-11-28 v2; user rule of 5:18 AM PHT: start values from design and DCS logic,
   never from a plant screen). The bed drain at 150 MW: the bottom ash screw coolers L-1060A ~ D run by THEIR LOGIC, the operator's
   line-up of the drawing (KIRARA trace of DITL-21B ~ 21E, 2026-11-28):
   - DITL-21B #B / #C / #D row 1 "SCREW COOLER B / C / D AUTO SELECTED" (M.2178 / M.2188 / M.2198): arms B ~ D for the duty rotation
     of DITL-21E (one cooler at a time);
   - DITL-21C row 7 "AUTO SEQUENCE MODE" (M.2120 > M.2122 USED AUTO SEQUENCE): DITL-21D CYCLE SEQUENCE MODE M.2127 = M.2122 AND furnace
     DP normal AND DP > 1500 (M.3135) then starts the duty cooler. Above DP 1900 the speed control AUTO of DITL-21D (M.3134) adds speed.
   Speed: NOT set here. The SICL1060A ~ D MAN stations (ABC-009A A ~ C, ABC-009B D) are TRACKED by the logic (plant.js MAN: val =
   trk), so an operator speed does not hold; the logic's speed (0.6 ~ 0.8 rpm) takes 0.48 T/H per cooler (0.8 T/H per rpm, DESIGN-SRC
   Rauma E130122B: 2 T/H normal, 4 T/H at 5 rpm) against the 1.79 T/H that comes in (cfb.js AN_BI). One cooler holds 1.79 T/H only at
   1.79 / 0.8 = 2.25 rpm (CALC), which the drawing gives through the speed control AUTO of DITL-21D (M.3134) above furnace DP 1900.
   Was v1: DITL-21C MANUAL SEQUENCE MODE + two START pushes + a speed write.
   Chains onto a __settleMinute set by an init run before it. */
(() => {
  const sh = n => DITL.S.sheets.concat(WORLD.inst || []).find(x => x.name.endsWith(')' + n) || x.name.endsWith(n));
  const press = (n, r, want) => {
    const s = sh(n);
    if (!s) throw new Error('no ' + n);
    if (!s.nl) s.nl = netlist(s);
    const v = DUI.rowInfo(s, r).svc || '';
    if (!v.includes(want)) throw new Error(n + ' row ' + r + ' is "' + v + '", not ' + want);
    const live = WORLD.live;
    WORLD.live = true;
    const ok = WORLD.dpress(s.name, r);
    WORLD.live = live;
    if (!ok) throw new Error(n + ' row ' + r + ' press not taken');
  };
  press('DITL-21B #B', 1, 'COOLER B AUTO SELECTED');
  press('DITL-21B #C', 1, 'COOLER C AUTO SELECTED');
  press('DITL-21B #D', 1, 'COOLER D AUTO SELECTED');
  press('DITL-21C', 7, 'AUTO SEQUENCE MODE');
})();
// PICCD1104 (ABC-056) deaerator pegging start SV 0.2 kg/cm2g.
// Source: PCV-AS1030 spec sheet K1AU3-E2-0-123 R1 p42 COND 2 (P2 0.2 kg/cm2g); normal SV = operator COS (ABC-056 sh53, no value).
// 0.2 G is below HB PPE-14-0725 R1 case 7 DA 1.03 G, so pegging stays closed 45-150 MW. M.0124 preset 3.5 (S.pre[7]) untouched. (SUZU 2026-11-28)
(() => { const S = AN.sheets.find(x => x.name === 'ABC-056').S, c = AN.hmiCtrls(S).find(z => z.tag === 'PICCD1104'); S.rt.ext[c.q.sv] = 0.2; })();
/* hotwell level set points (ABC-031, both loops on LT-CD1110). LICCD1110A make-up SV 0 mm = the design normal level (O&M K2MC3A,
   FL+1814). LICCD1110B dump SV +150 mm = the HIGH alarm of the alarm list; NO-SOURCE for the SV itself (no logic or design value).
   The old 3.0 / 0.0 came from a screen (rule of 2026-11-28 5:18 AM PHT). */
(() => {
  for (const [tag, v] of [['LICCD1110A', 0], ['LICCD1110B', 150]]) {
    let done = false;
    for (const sh of AN.sheets) {
      const c = (AN.hmiCtrls(sh.S) || []).find(z => z.tag === tag);
      if (c && c.q && c.q.sv != null) { sh.S.rt.ext[c.q.sv] = v; done = true; }
    }
    if (!done) throw new Error('no SV for ' + tag);
  }
})();
