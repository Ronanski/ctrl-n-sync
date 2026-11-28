/* init for tools/steady150/settle.cjs (phase thread, 2026-11-28, user rule of 5:18 AM PHT: start values from design and DCS logic, never
   from a plant screen). Puts on the start state the two line-up values that src/world/ditl150.js and hmi-op.js AN_HMI_MAN now give:
   - the continuous blowdown MOV MV-BD1002 (DITL-38) shut (HB PPE-14-0725 case 1: no make-up, no blowdown at 150 MW);
   - the PA flow bias station HIC-TADBS (ABC-002) at 0 = the neutral point of S1-LN14 (0 T/H bias);
   - the O2 trim AICFG112 (ABC-002) in AUTO: at full load the logic runs it in AUTO (M.0103 / M.0102 = NOT FICFA1081.REM = 0, the SA
     flow FICFA1081 is in REMOTE); its SV stays the station's 3.5 %;
   - the main steam pressure SV of PIC-COBM (ABC-001C; no REMOTE leg on the drawing, so an operator-local SV) at the design throttle
     pressure: Hitachi HB PPE-14-0725 cases 1 ~ 6, 126 ata at the MSVs, plus the main steam line drop of the model at this flow
     (PT-MS1002 is the SH outlet, upstream of the line): SV = 126 - 1.0332 + U.kln x ms^2 kg/cm2 g, raised at 0.2 kg/cm2 a minute.
   The start state carries the old values in its keyframe, which the load restores over the tables. Run once on the state. */
(() => {
  let n = 0;
  for (const s of DITL.S.sheets.concat(WORLD.inst || [])) {
    const lbl = s._inst && s._inst.lbl;
    if (lbl !== 'MV-BD1002' || !s.nl || !(s.nl.mv || []).length) continue;
    const r = mvRT(s);
    r[0].pos = 0;
    r[0].run = 0;
    n++;
  }
  if (!n) throw new Error('no MV-BD1002 on DITL-38');
  const sh = AN.sheets.find(x => x.name === 'ABC-002'),
    S = sh && sh.S,
    b = S && S.blk.find(x => x.k === 'MAN' && (x.tag === 'HIC-TADBS' || (x.txt || []).includes('HIC-TADBS')));
  if (!b || !S.rt.st[b.id]) throw new Error('no HIC-TADBS station on ABC-002');
  S.rt.st[b.id].val = 0;
  const A = AN.sheets.find(x => x.name === 'ABC-002').S,
    o2 = AN.hmiCtrls(A).find(z => z.tag === 'AICFG112');
  if (!o2 || !o2.amt) throw new Error('no AICFG112 on ABC-002');
  A.rt.st[o2.amt.id].fm = o2.autoLeg;
  AN.latchMode('AICFG112', 'LOC');
  const C = AN.sheets.find(x => x.name === 'ABC-001C').S,
    pc = AN.hmiCtrls(C).find(z => z.tag === 'PIC-COBM'),
    U = AN.unit,
    sv = 126 - 1.0332 + U.kln * U.ms * U.ms;
  if (!pc || pc.q.sv == null || !C.ext.includes(pc.q.sv)) throw new Error('no PIC-COBM SV input on ABC-001C');
  /* the operator raises the SV at 0.2 kg/cm2 a minute (a 4.3 kg/cm2 step at once overshot to 134 and tripped the unit at 13 min,
     2026-11-28): settle.cjs calls __settleMinute once a plant minute */
  const goal = +sv.toFixed(2);
  globalThis.__settleMinute = () => {
    const v = +C.rt.ext[pc.q.sv];
    if (Math.abs(goal - v) > 1e-6) C.rt.ext[pc.q.sv] = +(v + Math.max(-0.2, Math.min(0.2, goal - v))).toFixed(2);
  };
})();
