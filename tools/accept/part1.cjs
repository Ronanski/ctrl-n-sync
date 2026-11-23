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
/* [key, label, target 45 / 90 / 150, tol, kind] kind: 'a' absolute, 'p' percent, 'band' [lo, hi] */
const T = [
  ['MSF', 'Main steam flow T/H', [149.95, 273.36, 458.33], 3, 'p'],
  ['Pms', 'Main steam pressure kg/cm2 (HB ata)', [98.9, 126.0, 126.0], 1.5, 'a'],
  ['MSTt', 'Main steam temperature C (HB)', [505, 538, 538], 5, 'a'],
  ['Psh', 'SH outlet pressure kg/cm2g (Fig 11)', [100.0, 126.5, 129], 1.5, 'a'],
  ['MST', 'SH outlet temperature C (Fig 6)', [507, 541, 541], 5, 'a'],
  ['CRHf', 'Cold reheat flow T/H', [145.0, 265.4, 446.1], 3, 'p'],
  ['Pcr', 'Cold reheat pressure ata', [12.79, 23.48, 38.64], 1, 'a'],
  ['Tcr', 'Cold reheat temperature C', [328.8, 358.1, 370.2], 5, 'a'],
  ['HRHf', 'Hot reheat flow T/H', [134.8, 243.1, 400.9], 3, 'p'],
  ['Prh', 'Hot reheat pressure ata', [11.51, 21.13, 34.77], 1, 'a'],
  ['RHT', 'RH outlet temperature C', [507, 541, 541], 5, 'a'],
  ['tEco', 'Economizer outlet water C', [null, null, 303], 3, 'a'],
  ['Tfw', 'Final feedwater C', [188.6, 218.0, 245.4], 3, 'a'],
  ['FWf', 'Final feedwater T/H', [150.3, 273.7, 458.7], 3, 'p'],
  ['sp', 'SH spray T/H', [0, 0, 12.4], 3, 'a'],
  ['rsp', 'RH spray T/H', [0, 0, 0], 1, 'a'],
  ['MW', 'Generator MW', [45, 90, 150], 1, 'a'],
  ['HR', 'Turbine heat rate kcal/kWh', [2331, 2079, 1989], 1, 'p'],
  ['bed', 'Bed temperature C', [[850, 870], [850, 870], [850, 870]], 0, 'band'],
  ['Tu', 'Furnace average temperature C', [610, 755, 840], 15, 'a'],
  ['dp', 'Furnace DP mmH2O', [1380, 1380, 1630], 20, 'a'],
  ['ahGi', 'Air heater gas in C', [265, 285, 322], 10, 'a'],
  ['ahGo', 'Air heater gas out C', [null, null, 135], 10, 'a'],
  ['coal', 'Coal T/H', [32.3, 56.0, 89.5], 3, 'p'],
  ['lime', 'Limestone T/H', [4.3, 7.1, 12.0], 10, 'p'],
  ['air', 'Total air T/H', [365, 371, 596], 3, 'p'],
  ['PA', 'PA T/H', [245, 236, 354], 3, 'p'],
  ['SA', 'SA T/H', [96, 111, 218], 3, 'p'],
  ['O2', 'O2 %', [10.9, 3.6, 3.6], 0.5, 'a'],
  ['eff', 'Boiler efficiency LHV %', [88.5, 91, 90.9], 1, 'a']
];
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
    const run = m => page.evaluate(async mins => {
      const C = AN.sheets.find(s => s.name === 'ABC-001C');
      for (let j = 0; j < mins * 120; j++) {
        WORLD.live = true;
        AN.stepSet(C, 0.5);
        WORLD.tick(0.5);
        if (j % 200 === 199) await new Promise(r => setTimeout(r, 0));
      }
    }, m);
    const snap = () => page.evaluate(() => {
      const U = AN.unit, H = U.hxO || {}, hs = BAL.hs, hw = BAL.hw, L = window.LS_LIVE;
      const pv = t => { try { const f = L.fp(t); return +f.S.rt.v[f.c.q.pv]; } catch (e) { return NaN; } };
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
        MSF: U.ms, Pms: U.Pms, MSTt: H.ms, Psh: U.Pms, MST: H.ms, CRHf: crh, Pcr: U.Prh + 1.5, Tcr: tcr, HRHf: hrh, Prh: U.Prh, RHT: H.rh,
        tEco: H.tEco, Tfw: tfw, FWf: U.fwMain - bd, sp: w1 + w2, rsp: U.rhSp || 0, MW: U.MW, HR: U.MW > 1 ? (qT * 3600) / 4.1868 / (U.MW * 1000) * 1000 / 1000 : NaN,
        bed: U.Tb, Tu: U.Tu, dp: pv('DPICFG108'), ahGi: U.aphGi, ahGo: U.aphGo, coal: U.Fc, lime: U.lm ? U.lm.q : NaN, air: air.reduce((a, b) => a + (b || 0), 0), PA: air[0], SA: air[1],
        O2: U.o2v, eff: fuel > 0 ? (100 * steam) / fuel : NaN, trip: !!(AN.soeTrip && AN.soeTrip().mft.on)
      };
    });
    const win = async () => {
      const S = [];
      for (let m = 0; m < WIN; m++) { await run(1); S.push(await snap()); }
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
    const R = {};
    await run(5);
    R[150] = await win();
    R.t90 = await press(90);
    await run(SETTLE);
    R[90] = await win();
    R.t45 = await press(45);
    await run(SETTLE);
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
    out.push('', `Window ${WIN} min each, settle ${SETTLE} min after each load step. MW range 45 / 90 / 150: ${[45, 90, 150].map(L => f(R[L].MW.lo) + '-' + f(R[L].MW.hi)).join(' / ')}. Trip: ${[45, 90, 150].map(L => R[L].trip).join(' / ')}. Target MW set by the presses: ${f(R.t90)} / ${f(R.t45)}. Limestone and FW from the model fields U.lm.q and U.fwMain less the blowdown. PASS ${pass}, FAIL ${fail}. Page errors: ${errs.length}`);
    console.log(out.join('\n'));
    fs.writeFileSync(process.env.OUT || 'part1.json', JSON.stringify(R));
  } finally {
    await browser.close();
  }
})();
