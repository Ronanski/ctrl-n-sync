/* ACCEPTANCE Part 1 measurement (docs/ACCEPTANCE.md, user GO LIST 2026-11-24 06:06 PHT): steady 150, 90 and 45 MW, every loop as the
   plant leaves it (AUTO), nothing else touched. Start "At 150 MW" (the st150 of the build), measure 30 plant min; then the unit load
   demand HIC-ULD down by its faceplate (the operator's ▼▼ button, -5 MW a press) to 90 MW, settle SETTLE min, measure 30 min; then 45 MW
   the same. Each row: the mean over the window, and the min / max where the band matters. Targets and tolerances: ACCEPTANCE.md
   (design documents only: HB PPE-14-0725 cases 1 / 4 / 7, FHI P2S7 Figs and Tab 3, L20).
   Usage: PLAYWRIGHT_MODULE=... CHROMIUM=... node tools/accept/part1.cjs <station or dist html> [SETTLE=60] [WIN=30] */
const fs = require('fs'),
  path = require('path');
const root = path.resolve(__dirname, '..', '..');
const { open } = require(path.join(root, 'tests/regress/lib.js'));
const html = path.resolve(process.argv[2] || ''),
  SETTLE = +process.argv[3] || 60,
  WIN = +process.argv[4] || 30;
/* [key, label, target 45 / 90 / 150, tol, kind] kind: 'a' absolute, 'p' percent, 'band' [lo, hi]. The targets come from
   docs/accept/part1-targets.json (Phase 2, 2026-11-25): the same numbers as the Part 1 table of docs/ACCEPTANCE.md, held equal by
   tests/lanes/qa/acceptance.cjs. Rows with measured: false have no reading in this tool yet and are listed as not measured. */
const PT = JSON.parse(fs.readFileSync(path.join(root, 'docs/accept/part1-targets.json'), 'utf8'));
const T = PT.rows.filter(r => r.measured !== false).map(r => [r.key, r.label, r.t, r.tol, r.kind]);
const NOT_MEASURED = PT.rows.filter(r => r.measured === false).map(r => r.label);
if (NOT_MEASURED.length) console.log('not measured by this tool yet: ' + NOT_MEASURED.join(', '));
const judge = (v, tg, tol, kind) => {
  if (tg == null || !isFinite(v)) return tg == null ? 'n/a' : 'FAIL';
  if (kind === 'band') return v >= tg[0] && v <= tg[1] ? 'PASS' : 'FAIL';
  const d = kind === 'p' ? (Math.abs(v / tg - 1) * 100) : Math.abs(v - tg);
  return d <= tol ? 'PASS' : 'FAIL';
};
(async () => {
  const { browser, page, errs } = await open(html);
  try {
    await page.setViewportSize({ width: 1400, height: 900 });
    const SRC = fs.readFileSync(path.join(root, 'src/analog/engine/steam.js'), 'utf8') + '\n' + fs.readFileSync(path.join(root, 'src/analog/engine/hx.js'), 'utf8');
    await page.waitForFunction(() => AN.sheets && AN.sheets.length >= 54 && window.WORLD && WORLD.idx, null, { timeout: 180000 });
    await page.waitForTimeout(1500);
    await page.addScriptTag({ content: '(function(){' + SRC + ';window.BAL={hs:anHxHs,hw:anHxHw,tsat:steamTsat}})()' });
    await page.evaluate(async () => {
      await AN.ades();
      WORLD.set(true);
      document.getElementById('load150').click();
      await AN._startP;
    });
    const run1 = m => page.evaluate(async mins => {
      const C = AN.sheets.find(s => s.name === 'ABC-001C');
      for (let j = 0; j < mins * 120; j++) {
        WORLD.live = true;
        AN.stepSet(C, 0.5);
        WORLD.tick(0.5);
        if (j % 200 === 199) await new Promise(r => setTimeout(r, 0));
      }
    }, m);
    /* Phase 11 SWEEP=1 (2026-11-27): one snap each plant minute the whole way 150 -> 90 -> 45 MW (ramps and settles included); the
       samples go to OUT_SWEEP and are judged against the design curves at every load by tools/model/sweep-judge.cjs */
    const SWEEP = !!process.env.SWEEP, SW = [];
    let swAcc = 0;
    /* the bed inventory by hand along FHI P2S7 Fig 9 (furnace DP versus % MCR; AOI 2026-11-28). The plant holds the bed DP by operator
       action (16.PNG 150 MW: FURNACE DIFF. PRESS. CTL DPICFG108 MANUAL, MV 0, coolers stopped; PR-OPE-5002 "Bottom ash screw cooler
       normal operation": the operator watches the bed temperature and DP), so the sweep operator holds Fig 9 with DPICFG108 (ABC-009A):
       once a plant minute it puts the SV on Fig 9 at the main steam flow of that minute (x = MSF / 460 T/H, FHI Tab 3 MCR; held at the
       end points outside 40 ~ 100 %), within the ABC-009A SV limits 1450 ~ 2100 (the DCS limit is never changed for a design curve:
       below about 45 % MCR the SV stays 1450, sweep-judge.cjs DPMIN). In MANUAL with the MV under 14 % the station is forced MANUAL
       (CLAUDE.md: PICFG108 MV < 14 % = force manual, raise the MV first), so the operator first puts the MV at 14 %, then A at the SV */
    const FIG9 = JSON.parse(fs.readFileSync(path.join(root, 'docs/accept/curves/curves.json'), 'utf8')).fhi.fig9_furnace_dp_mmH2O.pts;
    let dpAcc = 0;
    const bedDp = async () => {
      const s = await page.evaluate(() => { const L = window.LS_LIVE, f = L.fp('DPICFG108'); return { md: L.modeOf(f), sv: +L.svOf(f), mv: +L.mvOf(f), msf: AN.unit.ms }; });
      const x = Math.min(FIG9[FIG9.length - 1][0], Math.max(FIG9[0][0], (s.msf / 460) * 100));
      let y = FIG9[FIG9.length - 1][1];
      for (let i = 1; i < FIG9.length; i++) if (x <= FIG9[i][0]) { const [x0, y0] = FIG9[i - 1], [x1, y1] = FIG9[i]; y = x1 === x0 ? y1 : y0 + ((y1 - y0) * (x - x0)) / (x1 - x0); break; }
      y = Math.round(Math.min(2100, Math.max(1450, y)));
      if (s.md !== 'AUTO') {
        if (!(s.mv >= 14)) { await page.evaluate(() => TOP.man('DPICFG108', 14)); return; }
        await page.evaluate(v => TOP.auto('DPICFG108', v), y); return;
      }
      if (Math.abs(y - s.sv) >= 1) await page.evaluate(v => TOP.auto('DPICFG108', v), y);
    };
    const run = async m => {
      await run1(m);
      dpAcc += m;
      if (dpAcc >= 1) { dpAcc = 0; await bedDp(); }
      if (!SWEEP) return;
      swAcc += m;
      if (swAcc >= 1) {
        swAcc = 0;
        SW.push(await snap());
      }
    };
    const snap = () => page.evaluate(() => {
      const U = AN.unit, H = U.hxO || {}, hs = BAL.hs, hw = BAL.hw, L = window.LS_LIVE;
      const pv = t => { try { const f = L.fp(t); return +f.S.rt.v[f.c.q.pv]; } catch (e) { return NaN; } };
      const sv = t => { try { return +L.svOf(L.fp(t)); } catch (e) { return NaN; } };
      const nv = n => (U.tafS && U.tafS.rt && n >= 0 ? +U.tafS.rt.v[n] : NaN);
      const air = (U.taf || []).map(nv);
      const w1 = U.w1s || 0, w2 = U.w2s || 0;
      /* cold reheat = the HP turbine exhaust (HB 446.1 T/H at 150 MW, before the No.2 HP heater extraction); hot reheat = that less the
         extraction U.hpF2 plus the HP bypass (unit.js mRh, HB 400.9 T/H) */
      const crh = Math.max(0, U.ms * 0.973 + (U.mhp || 0));
      const hrh = Math.max(0, (U.mhp || 0) + U.ms * 0.973 - (isFinite(U.hpF2) ? U.hpF2 : 0));
      /* the HB final feedwater is the turbine side flow; the boiler feedwater of the model also carries the drum blowdown (CBD + MBD) */
      const bd = typeof AN_CYC !== 'undefined' ? Math.max(0, (+AN_CYC.cbd || 0) + (+AN_CYC.mbd || 0)) : 0;
      const tcr = U.xt && U.xt.T && isFinite(U.xt.T.cr) ? U.xt.T.cr : NaN;
      const tfw = U.tt && isFinite(U.tt['TT-FW1160']) ? U.tt['TT-FW1160'] : U.hpT2;
      /* turbine heat rate: heat to the cycle (main steam over the final feedwater + reheat) per kWh, kcal/kWh */
      const qT = (U.ms / 3.6) * (hs(U.Pms, H.ms) - hw(tfw)) + (hrh / 3.6) * (hs(U.Prh, H.rh) - hs(U.Prh + 1.5, tcr));
      const fuel = U.Fc * 3662 * 4.1868 / 3600 + (U.oilF || 0) * 42700 / 3.6 / 1000; /* MW, LHV Tab 2 */
      const mOut = U.ms + (U.mb || 0) + (U.msb || 0) + (U.msv || 0), mDr = mOut - w1 - w2, ts = BAL.tsat(U.Pd), hg = hs(U.Pd, ts + 0.01);
      const MWq = (m, dh) => m / 3.6 * dh / 1000;
      const steam = MWq(U.mEco || 0, (H.hEco || 0) - hw(tfw)) + MWq(mDr, hg - (H.hEco || 0)) + MWq(mOut, hs(U.Pms, H.ms) - hg) + MWq(hrh, hs(U.Prh, H.rh) - hs(U.Prh + 1.5, tcr));
      return {
        /* RIN 2026-11-27: the HB rows are ATA (U.Pms / U.Prh are gauge kg/cm2: + 1.0332), and the reheat rows read the turbine's own
           ports (src/analog/engine/ports.js crh.rh_in, hrh; written by RIN since PR 669). Before 669 the ports are empty: the old
           estimate is used, marked by pt: 0 in the sample */
        ...(() => {
          const pt = U.pt || {}, cr = pt['crh.rh_in'], hr = pt['hrh'], ok = x => x && isFinite(x.m) && isFinite(x.P);
          return {
            pt: ok(cr) && ok(hr) ? 1 : 0,
            /* HB 'cold reheat' 446.1 T/H is the HP exhaust BEFORE the No.6 extraction; crh.rh_in is the steam into the reheater (400.9):
               + the No.2 HP heater draw (ext.w_hp x.hp2 by NANA; until it is written, the model draw U.hpF2) */
            CRHf: ok(cr) ? cr.m + (pt['ext.w_hp'] && pt['ext.w_hp'].x && isFinite(pt['ext.w_hp'].x.hp2) ? pt['ext.w_hp'].x.hp2 : isFinite(U.hpF2) ? U.hpF2 : 0) : crh, Pcr: ok(cr) ? cr.P : U.Prh + 1.5 + 1.0332, Tcr: ok(cr) && isFinite(cr.T) ? cr.T : tcr,
            HRHf: ok(hr) ? hr.m : hrh, Prh: ok(hr) ? hr.P : U.Prh + 1.0332
          };
        })(),
        MSF: U.ms, Pms: U.Pms + 1.0332, MSTt: H.ms, Psh: U.Pms, MST: H.ms, RHT: H.rh,
        tEco: H.tEco, Tfw: tfw, FWf: U.fwMain + w1 + w2 - bd /* FE-FW1007 is before the SH spray tap (PD-017, beta.374) */, sp: w1 + w2, rsp: U.rhSp || 0, MW: U.MW, HR: U.MW > 1 ? (qT * 3600) / 4.1868 / (U.MW * 1000) * 1000 / 1000 : NaN,
        bed: U.Tb, Tu: U.Tu, dp: pv('DPICFG108'), ahGi: U.aphGi, ahGo: U.aphGo, coal: U.Fc, lime: U.lm ? U.lm.q : NaN, air: air.reduce((a, b) => a + (b || 0), 0), PA: air[0], SA: air[1],
        Psv: sv('PIC-COBM') + 1.0332 /* the main steam pressure SV, ata */, dpSv: sv('DPICFG108'), drum: (() => { let q = null; for (const sh of AN.sheets) for (const b of (sh.S && sh.S.procs) || []) if ((b.txt || [])[1] === 'LICBR1001' && sh.S.rt.pm && sh.S.rt.pm[b.id]) q = sh.S.rt.pm[b.id]; return q && typeof AN_CYC !== 'undefined' ? { y: +q.y, kgmm: +AN_CYC.kgmm.dr(q.y) } : null; })() /* KANA: the boiler water inventory as drum level q.y (mm, the mass integrator; the swell q.sw moves no mass) and kg per mm */, dpMd: (() => { try { return L.modeOf(L.fp('DPICFG108')); } catch (e) { return null; } })(), cdP: U.cdP /* condenser pressure, kg/cm2 abs (RIN: the heat rate split) */, hr: { W: U.pt && U.pt.shaft ? U.pt.shaft.W : NaN, Pm: U.Pm, xhp: U.pt && U.pt['ext.w_hp'] ? U.pt['ext.w_hp'].x : null, xlp: U.pt && U.pt['ext.w_lp'] ? U.pt['ext.w_lp'].x : null, Qgen: U.pt && U.pt['q.ccw.YUI'] ? U.pt['q.ccw.YUI'].Q : NaN, pH: U.tb && U.tb.pH, pI: U.tb && U.tb.pI } /* RIN: the steam path to U.MW split */, PAsv: sv('FICFA1071'), SAsv: sv('FICFA1081') /* the DCS air demands: PA = S1-LN12 + LN14, SA = the rest of LN5 (AOI 2026-11-27; FICFA1071 / FICFA1081 both REMOTE on the ABC-006 LN5 air demand, OPERATOR_GUIDE 1.2 and 5.4) */, O2: U.o2v, O2bal: window.LS_FG && typeof LS_FG.o2dry === 'function' ? LS_FG.o2dry(U.Fc, air.reduce((a, b) => a + (b || 0), 0)) : NaN /* AOI: the dry O2 the FHI Tab 2 mole balance gives at this coal and air (the judge below the DCS minimum air) */, eff: fuel > 0 ? (100 * steam) / fuel : NaN, trip: !!(AN.soeTrip && AN.soeTrip().mft.on)
      };
    });
    const win = async () => {
      const S = [];
      for (let m = 0; m < WIN; m++) { await run(1); await operate(); S.push(await snap()); }
      const o = {};
      for (const k of Object.keys(S[0])) {
        const v = S.map(x => x[k]).filter(x => typeof x === 'number' && isFinite(x));
        o[k] = v.length ? { m: v.reduce((a, b) => a + b, 0) / v.length, lo: Math.min(...v), hi: Math.max(...v) } : { m: NaN, lo: NaN, hi: NaN };
      }
      o.trip = S.some(x => x.trip);
      return o;
    };
    await page.evaluate(() => {
      AN.viewSet(false);
      AN.go(AN.sheets.findIndex(s => s.name === 'ABC-001A'));
      [...document.querySelectorAll('button')].filter(b => b.textContent.trim() === 'Faceplate').forEach(b => b.click());
    });
    await page.waitForSelector('#opp .fpman', { timeout: 20000 });
    /* the operator presses ▼▼ (-5 MW) / ▼ / ▲ while watching the TARGET MW (COS SI0243 of ABC-001A) until it reads the aim */
    const tgt = () => page.evaluate(() => {
      const S = LS_LIVE.fp('HIC-ULD').S;
      for (let i = 0; i < S.rt.v.length; i++) if ((AN.nm(S, i) || '') === 'COS manual ▸ SI0243') return +S.rt.v[i];
      return NaN;
    });
    const press = async aim => {
      for (let k = 0; k < 80; k++) {
        const t = await tgt(), d = t - aim;
        if (!isFinite(t) || Math.abs(d) < 0.5) return t;
        const lab = d >= 5 ? '▼▼' : d > 0 ? '▼' : '▲';
        await page.evaluate(lab => {
          const f = [...document.querySelectorAll('#opp .fpman')].find(x => x.dataset.tag === 'HIC-ULD');
          const b = [...f.querySelectorAll('button')].find(e => e.textContent === lab);
          b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
          b.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
          b.click();
        }, lab);
        await page.waitForTimeout(150);
        await run(2 / 120); /* two scans: the station takes the press on its scan */
      }
      return tgt();
    };
    /* Below 220 T/H main steam flow the drawing forces HIC-BM and EIC-TM to MANUAL (ABC-001C BU-CMD M.2013 / M.2016, PR-OPE-5002
       "At 230 T/H MSF put Boiler Master to Auto"; OPERATOR_GUIDE 7.2). From there the operator does the load by hand, on the faceplates:
       EIC-TM ▼ toward the aim at no more than 3 MW a minute (guide 7.1), HIC-BM ▲ / ▼ 1 % a minute while the main steam pressure is
       off the PIC-COBM SV by more than 1 kg/cm2 (guide 7.2), and at 230 T/H the 1 ELEMENT push button of the Feedwater page (ABC-010
       M.054F, pressed for 2.5 s plant time like the page button; PR-OPE-5003 "put level control to 1 element", guide 7.3). */
    const fpOpen = sheet => page.evaluate(sh => {
      AN.go(AN.sheets.findIndex(s => s.name === sh));
      [...document.querySelectorAll('button')].filter(b => b.textContent.trim() === 'Faceplate').forEach(b => b.click());
    }, sheet);
    const fpBtn = async (sheet, tag, lab) => {
      const has = () => page.evaluate(t => !![...document.querySelectorAll('#opp .fpman')].find(x => x.dataset.tag === t), tag);
      if (!(await has())) { await fpOpen(sheet); await page.waitForTimeout(400); }
      const ok = await page.evaluate(([t, lab]) => {
        const f = [...document.querySelectorAll('#opp .fpman')].find(x => x.dataset.tag === t);
        const b = f && [...f.querySelectorAll('button')].find(e => e.textContent === lab);
        if (!b) return false;
        b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        b.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
        b.click();
        return true;
      }, [tag, lab]);
      await page.waitForTimeout(150);
      await run(2 / 120);
      return ok;
    };
    const st = () => page.evaluate(() => {
      const L = window.LS_LIVE, f = t => L.fp(t);
      return { bm: L.modeOf(f('HIC-BM')), tm: L.modeOf(f('EIC-TM')), bmMv: +L.mvOf(f('HIC-BM')), tmMv: +L.mvOf(f('EIC-TM')),
        P: AN.unit.Pms, sv: +L.svOf(f('PIC-COBM')), msf: AN.unit.ms, MW: AN.unit.MW };
    });
    const OP = { aim: null, e1: false, log: [] };
    const operate = async () => {
      if (OP.aim == null) return;
      let s = await st();
      if (!OP.e1 && s.msf <= 230) {
        await page.evaluate(x => { const T = AN.sheets.find(q => q.name === 'ABC-010').S; for (const n of T.ext) { const t = T.lab[n] && String(T.lab[n].t).trim(); if (t === 'M.054F' && T.rt.force[n] === undefined) T.rt.ext[n] = x; } AN.settle(); }, 1);
        await run(2.5 / 60);
        await page.evaluate(x => { const T = AN.sheets.find(q => q.name === 'ABC-010').S; for (const n of T.ext) { const t = T.lab[n] && String(T.lab[n].t).trim(); if (t === 'M.054F' && T.rt.force[n] === undefined) T.rt.ext[n] = x; } AN.settle(); }, 0);
        OP.e1 = true; OP.log.push('1 ELEMENT at MSF ' + s.msf.toFixed(0));
      }
      /* DCS CONTROL MODE OFF with the BU-CMD (ABC-001C M.0101 = 0, I.0082): EIC-TM in MANUAL tracks the TCS target (AMT T of M.2017,
         AI0420), so the load is set on the TCS panel: LOAD UP, target MW and rate (Turbine page, AN.turbine loadup { mw, rate }, the
         call of the page button). Rate 0.4 %/min = 0.6 MW/min, PR-OPE-5003 load down 90 to 45 MW (uat check M5). */
      if (s.tm === 'MAN' && !OP.tcs) {
        const r = await page.evaluate(a => AN.turbine('loadup', { mw: a, rate: 0.4 }), OP.aim);
        /* refused while DCS CONTROL MODE is still ON (I.0082 drops 2 ~ 3 s after M.2016): press again next minute */
        OP.tcs = !r;
        OP.log.push('TCS LOAD UP ' + OP.aim + ' MW at 0.4 %/min at MSF ' + s.msf.toFixed(0) + (r ? ' (' + r + ')' : ''));
      }
      /* the firing by hand (guide 7.2): one HIC-BM press of 1 %, then 3 min watching the 3-min MSP trend before the next (the bed
         answers a firing change in ~10 min; a press every minute overshoots and swings the coal 23 <-> 41 T/H, D15 study 2026-11-24).
         KANA 2026-11-27: with 0.3 x error - 1.0 x the 3-min trend the operator limit-cycled against the bed lag at 45 MW (MSP 94 <-> 106
         ata, ~57 min period, coal 26.6 <-> 38.7 T/H); 3.0 x the trend (looks ~9 min ahead, the bed lag) stops the swing. 0.5 x the error with 3.0 x the trend
         swung again at 45 MW in the main sweep (MSP 91 <-> 130 ata, phase thread 2026-11-27), so the error gain stays 0.3.
         Phase thread 2026-11-27: the 3-min trend of the ERROR (SV - MSP) followed the slide better (107 ata at the end of the ramp, was
         119) but undershot to 93 ata at 45 MW and held fewer samples in band (24 of 121, was 36 of 112): the trend of the MSP stays */
      if (s.bm === 'MAN') {
        OP.h = OP.h || []; OP.h.push(s.P); OP.n = (OP.n || 0) + 1;
        const dP3 = OP.h.length > 3 ? s.P - OP.h[OP.h.length - 4] : 0, d = 0.3 * (s.sv - s.P) - 3.0 * dP3;
        if (OP.n - (OP.last || -9) >= 3 && Math.abs(d) >= 0.5 && (OP.last = OP.n)) await fpBtn('ABC-001C', 'HIC-BM', d > 0 ? '▲' : '▼');
      }
      /* the O2 trim AICFG112 (ABC-002) is forced MANUAL below 220 T/H (M.0102 / M.0103); the operator puts it at 50 % = neutral
         (OPERATOR_GUIDE 5.4 / 7.7, uat check M5). Left at its last MV the trim holds the air off its demand, and the total air cross
         limit of the coal demand (ABC-002 LN40: 414 T/H air = 0 coal, 446 T/H = 35 T/H) cuts the coal. */
      const o2 = await page.evaluate(() => { const L = window.LS_LIVE, g = L.fp('AICFG112'); return { m: L.modeOf(g), mv: +L.mvOf(g) }; });
      if (o2.m === 'MAN') {
        if (!OP.o2) { OP.o2 = true; OP.log.push('O2 trim AICFG112 MAN ' + o2.mv.toFixed(1) + ' % to 50 % at MSF ' + s.msf.toFixed(0)); }
        /* the PID faceplate of the trim is not a station (.fpman) of the page: TOP.man = the MANUAL MV entry of its faceplate */
        if (Math.abs(o2.mv - 50) >= 0.5) await page.evaluate(() => TOP.man('AICFG112', 50));
      }
      /* the PA flow bias HIC-TADBS (ABC-002) at 0 near the minimum air (OPERATOR_GUIDE 5.3 / "Kung may mali": the -26.7 T/H trim of the
         150 MW line-up takes the total air of the fuel cross limit LN40 from 446 to ~420 T/H, and LN40 cuts the coal demand). Its
         faceplate ▲▲ +5 T/H, ▲ +1 T/H */
      if (s.bm === 'MAN') {
        let b = await page.evaluate(() => +LS_LIVE.mvOf(LS_LIVE.fp('HIC-TADBS')));
        if (b < -0.5 && !OP.tad) { OP.tad = true; OP.log.push('HIC-TADBS ' + b.toFixed(1) + ' to 0 T/H at MSF ' + s.msf.toFixed(0)); }
        for (let k = 0; k < 20 && b < -0.5; k++) {
          await fpBtn('ABC-002', 'HIC-TADBS', b <= -5 ? '▲▲' : '▲');
          b = await page.evaluate(() => +LS_LIVE.mvOf(LS_LIVE.fp('HIC-TADBS')));
        }
      }
      OP.pP = s.P;
    };
    const runOp = async mins => { for (let m = 0; m < mins; m++) { await run(1); await operate(); } };
    const R = {};
    await run(5);
    R[150] = await win();
    R.t90 = await press(90);
    await run(SETTLE);
    R[90] = await win();
    R.t45 = await press(45);
    OP.aim = 45;
    /* the TCS ramp to the aim first (0.6 MW/min below 220 T/H), then the settle time */
    /* the operator slides the PIC-COBM SV with the load on the HB sliding pressure line (PPE-14-0725: 126 ata from 60 % load down to
       98.9 ata at 30 %), 0.5 kg/cm2 a minute at most, during the ramp too (the sweep judges every minute). HB is ATA, the SV is gauge
       (- 1.0332); before 2026-11-27 the SV went to 98.9 gauge after the ramp */
    const SJ0 = require(path.join(root, 'tools/model/sweep-judge.cjs')), PMS = SJ0.CURVES.find(c => c[1] === 'Pms')[2];
    const slide = async () => {
      const s = await st(), y = SJ0.at(PMS, Math.max(PMS[0][0], (s.MW / 150) * 100));
      if (y == null || !isFinite(s.sv)) return true;
      const goal = y - 1.0332, sv = s.sv > goal ? Math.max(goal, s.sv - 0.5) : s.sv;
      if (sv < s.sv) await page.evaluate(v => TOP.auto('PIC-COBM', v), sv);
      return sv <= goal + 1e-6;
    };
    for (let m = 0; m < 120 && Math.abs((await st()).MW - OP.aim) > 1; m++) { await slide(); await runOp(1); }
    /* 1.0.0-beta.356 (D15, user 2026-11-24 "Ang design ang masusunod"): the design main steam pressure of the 45 MW point is the HB
       case 7 sliding pressure (PPE-14-0725, 98.9, the Pms target of this column), not the 123 ~ 126 of PR-OPE-5003. The operator slides
       the PIC-COBM SV down 0.5 kg/cm2 a minute on its faceplate (no step: a step to 98.9 cut the coal to 17 T/H and tripped on
       FURNACE TEMP. INADEQUATE FOR COAL FIRING) */
    for (let m = 0; m < 80 && !(await slide()); m++) await runOp(1);
    await runOp(SETTLE);
    R[45] = await win();
    const f = x => (isFinite(x) ? (Math.abs(x) >= 100 ? x.toFixed(1) : x.toFixed(2)) : '-');
    const out = ['| Item | 45 MW app / design | 90 MW app / design | 150 MW app / design |', '|---|---|---|---|'];
    let pass = 0, fail = 0;
    for (const [k, lab, tg, tol, kind] of T) {
      const cells = [45, 90, 150].map((L, i) => {
        const r = R[L][k], t = tg[i], j = judge(kind === 'band' ? r.m : r.m, t, tol, kind);
        const jj = kind === 'band' && j === 'PASS' && (r.lo < t[0] || r.hi > t[1]) ? 'FAIL' : j;
        if (jj === 'PASS') pass++; else if (jj === 'FAIL') fail++;
        const ts = t == null ? '-' : Array.isArray(t) ? t.join('-') : t;
        return `${f(r.m)}${kind === 'band' ? ` (${f(r.lo)}-${f(r.hi)})` : ''} / ${ts} ${jj}`;
      });
      out.push(`| ${lab} | ${cells.join(' | ')} |`);
    }
    out.push('', `Window ${WIN} min each, settle ${SETTLE} min after each load step. MW range 45 / 90 / 150: ${[45, 90, 150].map(L => f(R[L].MW.lo) + '-' + f(R[L].MW.hi)).join(' / ')}. Trip: ${[45, 90, 150].map(L => R[L].trip).join(' / ')}. Target MW set by the presses: ${f(R.t90)} / ${f(R.t45)}. Operator by hand below 220 T/H: ${OP.log.join(", ") || "-"}. Limestone and FW from the model fields U.lm.q and U.fwMain less the blowdown. PASS ${pass}, FAIL ${fail}. Page errors: ${errs.length}`);
    console.log(out.join('\n'));
    fs.writeFileSync(process.env.OUT || 'part1.json', JSON.stringify(R));
    if (SWEEP) {
      const SJ = require(path.join(root, 'tools/model/sweep-judge.cjs')), J = SJ.judge(SW);
      /* the ports of src/analog/engine/ports.js that no part writes yet, and the whole-plant water / steam balance (Phase 11 gate) */
      const PB = await page.evaluate(() => {
        const P = window.LS_PORTS, U = AN.unit;
        if (!P) return { missingPorts: null, balance: null };
        const ids = Object.keys(P.AN_PORTS.list).concat(P.AN_PORTS.stores);
        return { missingPorts: ids.filter(id => !P.anPortGet(U, id)), balance: P.anPortBalance(U) };
      });
      console.log('\nSWEEP (every plant minute, 150 -> 45 MW, design curves):\n' + SJ.md(J));
      console.log('ports not written: ' + (PB.missingPorts ? PB.missingPorts.length : 'n/a') + '; balance ' + JSON.stringify(PB.balance));
      fs.writeFileSync(process.env.OUT_SWEEP || 'sweep.json', JSON.stringify({ date: new Date().toISOString().slice(0, 10), SW, J, missingPorts: PB.missingPorts, balance: PB.balance }));
    }
  } finally {
    await browser.close();
  }
})();
