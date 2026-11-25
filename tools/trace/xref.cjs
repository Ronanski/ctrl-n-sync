/* QA XREF (lane 8, user 2026-11-25 "Interconnected din dapat ang mga logic: DITL ABC TCS"): every input row of a DITL drawing whose FROM
   column names another logic sheet (DITL "25A-55" = DITL-25A row 55, ABC-0xx, TCS), read from the running app (tools/trace/world.cjs),
   and what feeds it in the run (WORLD.idx.din):
     WIRED     a source of the named sheet (the drawing itself or one of its machine copies);
     OTHER     wired, but only from another sheet than the one the drawing names;
     MODEL     no sheet source: the plant model / a plant switch / the valve-motor model gives the value instead;
     MISSING   nothing writes it.
   Plus the ABC side: ABC inputs fed by a DITL output (WORLD.idx.ain) and the TCS side (src/data/tcs-dcs.json bindings, TCE_RUN join).
   Usage: node tools/trace/xref.cjs [--start 150|cold] [--out <dir>]  (exit 0 always: a count, not a gate) */
const fs = require('fs'),
  path = require('path'),
  os = require('os');
const { load, root } = require('./world.cjs');
const arg = (k, d) => {
  const i = process.argv.indexOf('--' + k);
  return i > 0 ? process.argv[i + 1] : d;
};
const OUT = arg('out', path.join(os.tmpdir(), 'qa-xref'));
(async () => {
  const E = load();
  const { DITL, WORLD } = E;
  await E.start(arg('start', '150'));
  E.step(20);
  const din = (WORLD.idx && WORLD.idx.din) || new Map();
  const psw = new Set((WORLD.plantSw ? WORLD.plantSw() : []).map(p => p.sheet + '|' + p.row));
  const allD = DITL.S.sheets.concat(WORLD.inst || []);
  const cellT = (s, i, col) => {
    const b = (s._inst && s._inst.base) || s,
      r = b.rows[i];
    const t = r ? (b.cells[i + ':' + col] || []).map(x => x.t).join(' ') : '';
    return s._inst && WORLD.showText ? WORLD.showText(s, t) : t;
  };
  const code = n => (/DITL-([A-Z0-9]+)/.exec(n) || [])[1] || '';
  const named = f => {
    const s = f.replace(/[()]/g, ' ').trim().toUpperCase();
    let m = /^(?:DITL-?)?(\d{1,3}[A-Z]?)\s*-\s*(\d+)\b/.exec(s);
    if (m) return { kind: 'DITL', code: m[1].replace(/^0+(?=\d)/, ''), row: +m[2] };
    m = /\bABC-?(\d{3}[A-Z]?)\b/.exec(s);
    if (m) return { kind: 'ABC', code: m[1] };
    if (/\b(TCS|T\/G|EHC|TCA\d|TCE\d)\b/.test(s)) return { kind: 'TCS' };
    return null;
  };
  const norm = c => c.replace(/^0+(?=\d)/, '');
  const rows = [],
    cnt = {};
  for (const s of allD) {
    const b = (s._inst && s._inst.base) || s;
    if (!b.rows || !b.cells) continue;
    const only = s._inst && s._inst.only instanceof Set ? s._inst.only : null;
    const srcRows = new Set((s.nl && s.nl.src ? s.nl.src : []).map(q => q.row));
    const own = new Set();
    for (const v of (s.nl && s.nl.mv) || []) for (const f of v.fb || []) own.add(f.row);
    const dm = din.get(s);
    b.rows.forEach((r, i) => {
      if ((only && !only.has(i)) || !srcRows.has(i)) return;
      const F = cellT(s, i, 'F'),
        N = named(F);
      if (!N) return;
      const srcs = (dm && dm.get(i)) || [];
      /* q.d = the DITL sheet of the source row; q.cs = the counter sheet of a sootblower count (k 'c') */
      const dsrc = srcs.filter(q => q && (q.d || q.cs) && (q.d || q.cs).name).map(q => (q.d ? q : Object.assign({}, q, { d: q.cs })));
      let st;
      if (N.kind === 'DITL') {
        /* a drawn code with no letter ("12-70") names the drawing set 12A / 12B / 12C as well */
        const same = c => (c = norm(c)) === N.code || (/^\d+$/.test(N.code) && new RegExp('^' + N.code + '[A-Z]$').test(c));
        const hit = dsrc.some(q => same(code(q.d.name)) || same(code(((q.d._inst || {}).base || {}).name || '')));
        /* the source row names the reader on its own TO side ("TO DITL80G": DITL-80B ~ 80F give each sootblower its own copy of DITL-80G,
           YUA 2026-11-25): the drawing of the source says where it goes, so it is wired as drawn */
        const me = norm(code(((s._inst || {}).base || s).name));
        const toMe = q => {
          if (typeof q.row !== 'number') return false;
          const t = ['RS', 'RT', 'RL', 'R'].map(c => cellT(q.d, q.row, c)).join(' ').toUpperCase().replace(/\s+/g, '');
          return new RegExp('(TO)?DITL-?0*' + me + '(?![0-9A-Z])').test(t);
        };
        st = hit ? 'WIRED' : dsrc.some(toMe) ? 'WIRED (TO side)' : srcs.length ? 'OTHER' : null;
      } else st = srcs.length ? 'WIRED' : null;
      if (!st) st = psw.has(s.name + '|' + (i + 1)) || own.has(i) || (s.avw && Object.keys(s.avw).length && (s.nl.an || []).some(a => a.row === i)) ? 'MODEL' : 'MISSING';
      const k = N.kind + ' ' + (st === 'WIRED (TO side)' ? 'WIRED' : st);
      if (st === 'WIRED (TO side)') cnt[N.kind + ' TOSIDE'] = (cnt[N.kind + ' TOSIDE'] || 0) + 1;
      cnt[k] = (cnt[k] || 0) + 1;
      const nm = q => (q && (q.d || q.cs) && (q.d || q.cs).name ? (q.d || q.cs).name + (q.cs ? ' count' : ':' + ((q.row | 0) + 1)) : 'k=' + (q && q.k));
      rows.push([s.name, r.n, F.trim(), N.kind, st, srcs.map(nm).join(' ')]);
    });
  }
  /* ABC inputs fed by a DITL output, and the TCS bindings */
  const ain = (WORLD.idx && WORLD.idx.ain) || [];
  let tcsDcs = 0,
    tcsMod = 0;
  try {
    const J = JSON.parse(fs.readFileSync(path.join(root, 'src', 'data', 'tcs-dcs.json'), 'utf8'));
    tcsDcs = (J.rows || []).length;
    tcsMod = (J.modbus || []).length;
  } catch (e) {}
  fs.mkdirSync(OUT, { recursive: true });
  const q = x => '"' + String(x).replace(/"/g, '""') + '"';
  fs.writeFileSync(path.join(OUT, 'xref-ditl.csv'), 'sheet,row,from,kind,status,sources\n' + rows.map(r => r.map(q).join(',')).join('\n') + '\n');
  const tot = k => Object.entries(cnt).filter(([x]) => x.startsWith(k + ' ')).reduce((a, [, v]) => a + v, 0);
  console.log('# QA xref ' + new Date().toISOString().slice(0, 16) + ' UTC');
  for (const k of ['DITL', 'ABC', 'TCS'])
    console.log(
      '- DITL rows whose FROM names a ' + k + ' sheet: ' + tot(k) + '; wired ' + (cnt[k + ' WIRED'] || 0) + (cnt[k + ' TOSIDE'] ? ' (of these by the TO side of the source ' + cnt[k + ' TOSIDE'] + ')' : '') + ', from another sheet ' + (cnt[k + ' OTHER'] || 0) +
        ', model instead ' + (cnt[k + ' MODEL'] || 0) + ', missing ' + (cnt[k + ' MISSING'] || 0)
    );
  const st = WORLD.stat || {},
    n = v => (Array.isArray(v) ? v.length : +v || 0);
  console.log('- ABC inputs fed by a DITL output (WORLD.idx.ain): ' + ain.length);
  console.log(
    '- world link table (WORLD.stat): ABC FROM DITL wired ' + n(st.fromDitl) + ', on an ABC net its logic computes ' + n(st.logic) +
      ', from a PLC not in the app ' + n(st.plc) + ', no match ' + n(st.lost) + '; DITL fed by ABC ' + n(st.fromAbc) + ', ABC TO DITL ' + n(st.toDitl) +
      ', ABC miss ' + n(st.abcMiss) + '; TCS in ' + n(st.tcsIn) + ', TCS out ' + n(st.tcsOut)
  );
  fs.writeFileSync(path.join(OUT, 'xref-lost.txt'), [].concat(st.lost || [], ['--- plc'], st.plc || [], ['--- abcMiss'], (st.abcMiss || []).map(String)).join('\n') + '\n');
  console.log('- TCS bindings (tcs-dcs.json): DCS points ' + tcsDcs + ', Modbus rows ' + tcsMod);
  console.log('rows: ' + OUT);
  process.exit(0);
})();
