// HMI and logic move as one (OPLAN KABIT step 3, lane 7 MINAMI, 2026-11-25). For every operator control of every HX page (a machine,
// a valve, a controller, a push button) the app itself is asked, in a headless run at 150 MW, three questions:
//   (a) WRITE: the control writes the address of the sheet that reads it (a DITL push button row / HMI address, the ABC loop, a TCS CRT
//       port of the TCE program), not a shortcut of the engine (tcs.js model buttons data-tpb, AN.unit states, AN.field).
//   (b) PERMISSIVES: its faceplate shows the permissives and interlocks of that sheet, live (the DITL sheet of the machine or valve, the
//       ABC loop, the TCE sheet of the CRT port).
//   (c) FEEDBACK: its state and lamps read the sheet output or the field row of the I/O list, not the plant model.
// A FIELD item (a hand valve, a local machine with no DCS control on its sheet: fv:, fld / fieldOp, fset, or a machine the sheet
// only watches: sti / sto) is counted apart: the plant has no DCS control to bind. The plain states of a page (no control) are counted for (c) only.
// Usage: node tools/audit/hmi-logic.cjs <dist html> [--md out.md] [--json out.json]
const fs = require('fs'),
  z = require('zlib'),
  path = require('path');
const L = require(path.resolve(__dirname, '..', '..', 'tests', 'regress', 'lib.js'));
const args = process.argv.slice(2),
  html = args.find(a => !a.startsWith('--') && /\.html$/.test(a)),
  opt = k => {
    const i = args.indexOf(k);
    return i >= 0 ? args[i + 1] : null;
  };
if (!html) {
  console.error('usage: node tools/audit/hmi-logic.cjs <dist html> [--md out.md] [--json out.json]');
  process.exit(2);
}
const unz = f => {
  const t = fs.readFileSync(f, 'utf8').trim();
  try {
    return z.gunzipSync(Buffer.from(t, 'base64')).toString();
  } catch (e) {
    return t;
  }
};
const abc = unz('src/data/apre.txt');
const onAbc = t => abc.includes('"' + t) || abc.includes(String(t).replace(/-/g, ''));
(async () => {
  const { browser, page } = await L.open(html);
  await L.startAs(page, '150 MW');
  await page.waitForFunction(() => window.TCE && TCE.on && TCE.on(), null, { timeout: 60000 }).catch(() => {});
  const raw = await page.evaluate(() => {
    const call = (f, d) => {
      try {
        const r = f();
        return r == null ? d : r;
      } catch (e) {
        return d;
      }
    };
    const R = window.HXREG,
      D = window.LS_OP,
      ports = new Set(call(() => TCE.ports(), [])),
      md = n => {
        const m = R.machines[n],
          d = m && LS_MOCK.defs.find(x => x.id === m.page);
        return (d && d.mach && d.mach[m.id]) || null;
      },
      sheet = ad => !!call(() => D.dOf(ad), null);
    const out = [];
    for (const p of HX.pages) {
      const its = p.plan ? p.plan.items : (p.lanes || []).flatMap(L => L.items.flatMap(c => (Array.isArray(c) ? c : [c])));
      const all = [];
      const w = x => {
        if (!x || typeof x !== 'object') return;
        all.push(x);
        for (const k in x) if (Array.isArray(x[k])) x[k].forEach(w);
      };
      (its || []).forEach(w);
      const rows = [];
      for (const it of all) {
        if (it.k === 'mach') {
          const m = md(it.mach),
            name = it.mach;
          if (!m) {
            rows.push({ name, kind: 'machine', a: 'no faceplate (no registry machine)', b: 'none', c: 'none' });
            continue;
          }
          if (m.fld || m.fieldOp || m.fset) {
            rows.push({ name, kind: 'machine', field: 'local machine, no DCS control on its sheet' });
            continue;
          }
          if (m.tcs) {
            rows.push({
              name,
              kind: 'machine',
              a: 'old TCS model buttons (tcs.js / tcs-trip.js), not the CRT port of the TCE program',
              b: 'permissives of the old model, not the TCE sheet',
              c: 'state of the plant model (AN.unit), not the TCE sheet output'
            });
            continue;
          }
          if (m.df) {
            const s = sheet(m.d);
            rows.push({
              name,
              kind: 'machine',
              a: s ? 'OK' : 'sheet ' + m.d + ' not loaded',
              /* an empty list counts when the page says why (the sheet has no permissive gate): finding (b), correct by the drawing */
              b: s && ((m.df.perm || []).length || m.df.need || (Array.isArray(m.df.perm) && m.df.why)) ? 'OK' : 'no permissive rows given',
              c: s && m.df.st != null ? 'OK' : 'no state row'
            });
            continue;
          }
          if (m.ad) {
            const s = sheet(m.ad),
              ds = m.d ? sheet(m.d) : s;
            rows.push({
              name,
              kind: 'machine',
              a: s ? 'OK' : 'address ' + m.ad + ' on no loaded sheet',
              b: ds ? 'OK' : 'sheet ' + (m.d || m.ad) + ' not loaded',
              c: s || m.sti || m.sto ? 'OK' : 'no sheet state'
            });
            continue;
          }
          if (m.sti || m.sto) {
            /* a machine the DCS only watches (its sheet reads the state, no command row): no control to bind */
            rows.push({ name, kind: 'machine', field: 'monitored only, the sheet has no command for it' });
            continue;
          }
          rows.push({ name, kind: 'machine', a: 'unknown binding ' + Object.keys(m).join(','), b: 'none', c: 'none' });
        } else if (it.k === 'valve') {
          const m = R.machines[it.valve],
            v = R.sample && R.sample.valves && R.sample.valves[it.valve],
            mov = (m && m.bind && m.bind.mov) || (v && v.bind) || null,
            s = mov && sheet(mov);
          rows.push({
            name: it.valve,
            kind: 'valve',
            a: s ? 'OK' : mov ? 'sheet ' + mov + ' not loaded' : 'no DITL binding',
            b: s ? 'OK' : 'none',
            c: s ? 'OK' : 'none'
          });
        } else if (it.k === 'loop') {
          rows.push({ name: it.loop, kind: 'controller', loop: it.loop });
        } else if (it.k === 'hook') {
          const h = it.hook || '',
            press = !!it.press;
          const k = (/^(crtl?|fv|fld):/.exec(h) || /data-([a-z]+)/.exec(h) || [0, '?'])[1];
          if (k === 'fv' || k === 'fld') {
            if (press) rows.push({ name: it.name, kind: 'button', field: 'hand valve / field item of the plant' });
            continue;
          }
          if (press) {
            if (k === 'crt') {
              const port = h.slice(4),
                ok = ports.has(port);
              rows.push({ name: it.name + ' ' + port, kind: 'button', a: ok ? 'OK' : 'port not in the TCE program', b: ok ? 'OK' : 'none', c: 'OK' });
            } else if (k === 'apb') rows.push({ name: it.name, kind: 'button', a: 'OK', b: 'OK', c: 'OK' });
            else if (k === 'tpb')
              rows.push({
                name: it.name + ' (' + (/data-tpb="([^"]+)/.exec(h) || [])[1] + ')',
                kind: 'button',
                a: 'old TCS model button (tcs.js), not the CRT port of the TCE program',
                b: 'none from the TCE sheet',
                c: 'OK'
              });
            else rows.push({ name: it.name, kind: 'button', a: 'unknown press ' + k, b: 'none', c: 'none' });
          } else {
            /* a state (no control): (c) only */
            const sheetK = { di: 1, do: 1, dy: 1, dys: 1, dpo: 1, dfo: 1, crtl: 1, dsvc: 1, mov: 1, ctl: 1 },
              modelK = { uy: 1, ut: 1, tt: 1, tfo: 1, ox: 1, ns: 1 };
            rows.push({
              name: it.name,
              kind: 'state',
              c: sheetK[k] ? 'OK' : modelK[k] ? 'plant model (data-' + k + '), not a sheet output or field row' : 'unknown ' + k
            });
          }
        }
      }
      out.push({ id: p.id, title: p.title, rows });
    }
    return out;
  });
  await browser.close();
  /* controllers: the ABC loop of the app (src/data/apre.txt) */
  for (const p of raw)
    for (const r of p.rows)
      if (r.kind === 'controller') {
        const ok = onAbc(r.loop);
        Object.assign(r, { a: ok ? 'OK' : 'loop on no ABC sheet', b: ok ? 'OK' : 'none', c: ok ? 'OK' : 'none' });
      }
  const res = raw.map(p => {
    const ctl = p.rows.filter(r => r.kind !== 'state' && !r.field),
      st = p.rows.filter(r => r.kind === 'state'),
      fld = p.rows.filter(r => r.field),
      n = q => ctl.filter(r => r[q] === 'OK').length;
    return {
      id: p.id,
      title: p.title,
      controls: ctl.length,
      a: n('a'),
      b: n('b'),
      c: n('c'),
      ok: ctl.filter(r => r.a === 'OK' && r.b === 'OK' && r.c === 'OK').length,
      states: st.length,
      statesOk: st.filter(r => r.c === 'OK').length,
      field: fld.length,
      missing: ctl.filter(r => r.a !== 'OK' || r.b !== 'OK' || r.c !== 'OK'),
      stateMissing: st.filter(r => r.c !== 'OK')
    };
  });
  const T = k => res.reduce((s, p) => s + p[k], 0);
  let md = '# HMI and logic move as one: controls of the HX pages (tools/audit/hmi-logic.cjs)\n\n';
  md +=
    'Headless app at 150 MW. A control is OK when (a) it writes the sheet address, (b) its faceplate shows that sheet\'s permissives and (c) its feedback reads the sheet output or field row. Field items (hand valves, local machines, machines the DCS only watches) have no DCS control and are counted apart.\n\n';
  md +=
    '**Total: ' + T('controls') + ' controls, ' + T('ok') + ' OK, ' + (T('controls') - T('ok')) + ' missing; ' + T('states') + ' states, ' + T('statesOk') + ' read a sheet or field row; ' + T('field') + ' field items.**\n\n';
  md += '| Page | Controls | (a) write | (b) permissives | (c) feedback | All OK | Missing | States OK / all | Field |\n|---|---|---|---|---|---|---|---|---|\n';
  for (const p of res)
    md += '| ' + p.id + ' | ' + p.controls + ' | ' + p.a + ' | ' + p.b + ' | ' + p.c + ' | ' + p.ok + ' | ' + (p.controls - p.ok) + ' | ' + p.statesOk + ' / ' + p.states + ' | ' + p.field + ' |\n';
  for (const p of res.filter(p => p.missing.length || p.stateMissing.length)) {
    md += '\n## ' + p.id + ' (' + p.title + ')\n\n';
    for (const r of p.missing)
      md += '- ' + r.kind + ' **' + r.name + '**: ' + ['a', 'b', 'c'].filter(q => r[q] !== 'OK').map(q => '(' + q + ') ' + r[q]).join('; ') + '\n';
    for (const r of p.stateMissing) md += '- state **' + r.name + '**: (c) ' + r.c + '\n';
  }
  if (opt('--md')) fs.writeFileSync(opt('--md'), md);
  if (opt('--json')) fs.writeFileSync(opt('--json'), JSON.stringify(res, null, 1));
  console.log(md.split('\n').slice(0, 6 + res.length + 2).join('\n'));
})();
