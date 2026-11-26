/* Phase 6 unit sheets (lane 1 MARIA, 2026-11-26, user "dapat hiwalay na sheet"): an independent check of what each unit sheet SHOWS.
   Every drawing written for several machines (WORLD.instOf: 41 drawings) is one sheet per unit in the app. For every unit and every row
   text of its drawing (cells and free texts) the text the unit shows (WORLD.showText) must:
   (1) address list ("M.1150/1160 M.1170" = A / B / C): show the unit's own address of the list only (the k-th, expanded here by this
       test's own reading of the list, not the app's), none of the other units' addresses;
   (2) unit from data (src/world/inst) / sootblower copy: no address of the drawing that the unit's map gives another address is left;
   (3) machine letter: a row that names machine A ("BURNER A", "FEEDER A") on unit B ~ D shows that unit's letter, unless the row also
       names the other units (a list "A/B/C", "A~D") or the drawing names A as the other machine of a pair (cross reference, kept and
       listed: allowed only where the base sheet itself names the other unit);
   (4) title: where the drawing title names machine A, the unit's title names its own letter.
   Usage: node tests/lanes/ditl/unit-sheet-text.cjs [--list] */
const path = require('path');
const { load } = require(path.join(__dirname, '../../../tools/trace/world.cjs'));
const LIST = process.argv.includes('--list');
(async () => {
  const E = load();
  await E.start('150');
  const R = JSON.parse(
    E.js(`JSON.stringify((() => {
  const W = WORLD, LET = 'ABCD', out = { drawings: 0, units: 0, rows: 0, lists: 0, letterRows: 0, common: [], addr: [], amap: [], letter: [], xref: 0, title: [], titleOk: 0 };
  /* this test's own reading of an address list: "M.0143/243" = M.0143, M.0243; "I.0085/88/8B" = I.0085, I.0088, I.008B */
  const GRP = /\\b([IMOB])\\.([0-9A-F]{4})((?:\\s*\\/\\s*(?:[IMOB]\\.)?[0-9A-F]{2,4}(?![0-9A-F]))*)/gi;
  const list = t => {
    const L = [];
    for (const m of String(t || '').matchAll(GRP)) {
      const p = m[1].toUpperCase(), h = m[2].toUpperCase();
      L.push(p + '.' + h);
      for (const e of m[3].split('/').map(x => x.trim()).filter(Boolean)) {
        const q = e.replace(/^[IMOB]\\./i, '').toUpperCase();
        L.push((/^[IMOB]\\./i.test(e) ? e[0].toUpperCase() : p) + '.' + h.slice(0, 4 - q.length) + q);
      }
    }
    return L;
  };
  const ADR = /\\b[IMOB]\\.[0-9A-F]{4}\\b/gi;
  const FAM = 'BURNER|IGNITER|FEEDER|COOLER|COLLER|PUMP|BFWP|BLOWER|FAN|DRYER|VALVE|LOP';
  const famA = new RegExp('\\\\b(' + FAM + ')\\\\s*-?\\\\(?A\\\\b(?!\\\\s*[/~&,]\\\\s*[B-D]\\\\b)', 'i');
  const cellsOf = s => {
    const T = [];
    for (const k in s.cells || {}) {
      const c = s.cells[k], t = Array.isArray(c) ? c.map(x => (x && x.t) || '').join(' ') : typeof c === 'string' ? c : (c && c.t) || '';
      if (t) T.push({ at: 'r' + k, row: k.split(':')[0], col: k.split(':')[1], t: String(t) });
    }
    for (const x of Array.isArray(s.tx) ? s.tx : []) if (x && x.t) T.push({ at: 'tx', t: String(x.t) });
    return T;
  };
  for (const [b, L] of W.instOf) {
    if (L.length < 2) continue;
    out.drawings++;
    const T = cellsOf(b), bt = String(b.title || '');
    /* the address written on the same drawn row as the text (column T / L of the row) */
    const rowAdr = {};
    for (const c of T) if (c.row && /^(T|L|RT)$/.test(c.col)) rowAdr[c.row] = (rowAdr[c.row] || '') + ' ' + c.t;
    L.forEach((u, k) => {
      out.units++;
      const I = u._inst || {}, map = (I.data || I.sb) && I.amap;
      for (const { at, t, row } of T) {
        out.rows++;
        const shown = String(W.showText(u, t) || ''), got = (shown.match(ADR) || []).map(x => x.toUpperCase()), la = list(t);
        if (map) {
          for (const a of (t.match(ADR) || []).map(x => x.toUpperCase()))
            if (k && map[a] && map[a] !== a && got.includes(a) && !got.includes(map[a])) out.amap.push([u.name, at, t, shown]);
          continue;
        }
        if (I.lbl) continue;
        const lop4 = /\\)DITL-22$/.test(b.name);
        if (la.length < 2) {
          if (!k) continue;
        }
        if (la.length >= 2 && la.length >= L.length) {
          out.lists++;
          const lop = /\\)DITL-22$/.test(b.name);
          const others = la.filter(a => got.includes(a));
          const want = la[k];
          if (lop ? others.length !== 1 : !(got.includes(want) && others.length === 1)) out.addr.push([u.name, at, t, shown, lop ? 'one of the list' : want]);
        }
        if (k) {
          const ma = famA.exec(t);
          if (ma) out.letterRows++;
          if (ma && !lop4 && famA.test(shown)) {
            /* kept as A on unit B ~ D: a cross reference only if the drawing names another machine on the same row */
            const ra = rowAdr[row] || '';
            if (/\\b[B-D]\\b/.test(t.replace(ma[0], ''))) out.xref++;
            /* one address on the drawn row, no list: the same signal on every unit (DITL-19 row 17 "BURNER A IN SERVICE" M.0139 FROM 12-70,
               DITL-120 row 12 "INDUSTRIAL WATER PUMP A RUNNING" I.0006 FROM 111-58): the drawing names that other machine on purpose */
            else if ((ra.match(ADR) || []).length === 1 && list(ra).length === 1) out.common.push([u.name, at, t, ra.trim()]);
            else out.letter.push([u.name, at, t, shown]);
          }
        }
      }
      if (k && /\\b(BURNER|IGNITER|FEEDER|COOLER|COLLER|PUMP|BFWP|BLOWER|DRYER)\\s*-?\\s*A\\b(?!\\s*\\/)/i.test(bt)) {
        const name = typeof unitTitle === 'function' ? String(unitTitle(u) || '') : String(W.remap(u, bt) || '');
        /* DITL-22: four units = BFWP A LOP 1 / 2, BFWP B LOP 1 / 2 */
        const L2 = I.lbl || (/\\)DITL-22$/.test(b.name) ? 'AABB'[k] : LET[k]);
        if (new RegExp('\\\\b' + L2 + '\\\\b').test(name) && !/\\b(BURNER|IGNITER|FEEDER|COOLER|COLLER|PUMP|BFWP|BLOWER|DRYER)\\s*-?\\s*A\\b(?!\\s*\\/)/i.test(name.replace(new RegExp('\\\\b' + L2 + '\\\\b'), ''))) out.titleOk++;
        else out.title.push([u.name, bt, name]);
      }
    });
  }
  /* (5) the viewer's list: every unit is one entry (unitNav), with its own name (unitName) */
  if (typeof unitNav === 'function') {
    const N = unitNav(false).filter(([i, k, u]) => (W.instOf.get(S.sheets[i]) || []).length > 1);
    const names = N.map(([i, k, u]) => unitName(u, k));
    out.nav = N.length;
    out.navDup = names.filter((x, j) => names.indexOf(x) !== j);
  }
  return out;
})())`)
  );
  /* the I/O-list rule (this test's own reading of src/ui/plant/wiring.js): a pure address list whose addresses, at one station, carry the
     same tag stem with different machine letters ("I.0377/057" DITL-23A: stn 3 MIT-P1115B / MIT-P1115A) is read by the letter of the
     tag, not by the order of the list: unit A shows the address whose tag ends in A */
  const w = {};
  require('vm').runInNewContext(require('fs').readFileSync(path.join(__dirname, '../../../src/ui/plant/wiring.js'), 'utf8'), { window: w });
  const io = new Map();
  for (const r of w.WIRING || []) if (/^[IO]\.[0-9A-F]{4}$/.test(r[2]) && r[3]) (io.get(r[2]) || io.set(r[2], []).get(r[2])).push([r[1], String(r[3])]);
  const byTag = (la, letter) => {
    const st = new Set(la.flatMap(a => (io.get(a) || []).map(x => x[0])));
    for (const n of st) {
      const q = la.map(a => ((io.get(a) || []).find(x => x[0] === n) || [])[1] || '').map(t => /^(.*?)-?([A-D])(\d?)$/.exec(t));
      if (q.some(m => !m) || new Set(q.map(m => m[1] + '*' + m[3])).size !== 1 || new Set(q.map(m => m[2])).size !== la.length) continue;
      const j = q.findIndex(m => m[2] === letter);
      if (j >= 0) return la[j];
    }
    return null;
  };
  R.addrIo = 0;
  R.addr = R.addr.filter(([u, at, t, shown, want]) => {
    const k = (/ #([B-D])$/.exec(u) || [0, 'A'])[1], la = (t.match(/\b[IMOB]\.[0-9A-F]{4}[0-9A-F/\s.IMOB]*/gi) || [])[0];
    const L = la ? la.split('/').map(x => x.trim()) : [];
    const full = L.map(e => (/^[IMOB]\./i.test(e) ? e.toUpperCase() : L[0].slice(0, 2 + 4 - e.length).toUpperCase() + e.toUpperCase()));
    const e = byTag(full, k), got = (shown.match(/\b[IMOB]\.[0-9A-F]{4}\b/gi) || []).map(x => x.toUpperCase());
    if (e && got.includes(e) && full.filter(a => got.includes(a)).length === 1) return (R.addrIo++, false);
    return true;
  });
  let bad = 0;
  const show = (k, L) => {
    console.log((L.length ? 'FAIL ' : 'PASS ') + k + ': ' + L.length);
    if (L.length) bad++;
    for (const x of LIST ? L : L.slice(0, 12)) console.log('   ', x.map(y => String(y).slice(0, 90)).join(' | '));
  };
  console.log('drawings ' + R.drawings + ', units ' + R.units + ', row texts checked ' + R.rows + ', address lists checked ' + R.lists);
  show('address list: a unit shows another unit\'s address, or not its own', R.addr);
  console.log('     (lists read by the I/O-list tag letter of the unit, not by the order: ' + R.addrIo + ')');
  show('unit from data / sootblower: the drawing address left where the unit has its own', R.amap);
  show('machine letter: unit B ~ D still names machine A (no other machine on the row)', R.letter);
  console.log('     (rows that name A beside another machine, kept as cross reference: ' + R.xref + ')');
  console.log('     (rows that name machine A of another drawing with one address, the same signal on every unit: ' + R.common.length + ')');
  for (const x of LIST ? R.common : []) console.log('   ', x.join(' | '));
  show('title: unit B ~ D title does not name its own letter', R.title);
  console.log('     titles naming their unit: ' + R.titleOk);
  console.log('     rows naming machine A checked on units B ~ D: ' + R.letterRows);
  if (R.nav === undefined) console.log('     (viewer list unitNav not in this build: not checked)');
  else {
    console.log((R.nav === R.units ? 'PASS ' : 'FAIL ') + 'viewer list: unit sheets ' + R.nav + ' (units ' + R.units + ')');
    if (R.nav !== R.units) bad++;
    show('viewer list: two unit sheets with the same name', R.navDup.map(x => [x]));
  }
  console.log(bad ? 'FAIL unit-sheet-text ' + bad : 'PASS unit-sheet-text');
  process.exit(bad ? 1 : 0);
})();
