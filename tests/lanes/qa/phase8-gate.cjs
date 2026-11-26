/* Phase 8 TAPOS gate (communications; user OPLAN TRANSLATED, phases in order). From the 150 MW start (tools/trace/world.cjs, the app's
   own engine headless) every named Modbus row is read through its end: the turbine list (src/data/tcs-dcs.json modbus, TCE_IO mbRead) and
   the package PLC lists (src/ui/plant/modbus.js fly ash / ESP / CTCS, AN.pkgRead). docs/PHASES.md row 8 may say TAPOS only when:
   - every row with no value is in docs/phase8/open.json, and every row there still has no value (the list is exact);
   - every group has its reason, and none is of type open (b = correct with no value, c = NO-SOURCE after every doc was read,
     m = the link works and the value needs the plant model, owner Phase 11).
   It also checks, on every run, the rows that have a value against their documents (the audit): the address arithmetic (DI / DO word and
   bit, AI word), the direction against the type, the TCS table row (kind, tag) at the end of a turbine row, the TCS range against the
   range of the DCS loop that shows the word (STN10x_LOOP,USERTAG.xls, src/ui/plant/dcslists.js), the value at 150 MW inside that range,
   and a digital value of 0 or 1; and the link list docs/phase8/link.json (held by tests/lanes/qa/phase8-link.cjs).
   While row 8 is not TAPOS the gate passes and prints what is left; an audit mismatch always fails. */
'use strict';
const fs = require('fs'),
  path = require('path');
const { load, root } = require(path.join(__dirname, '..', '..', '..', 'tools', 'trace', 'world.cjs'));
let bad = 0;
const fail = m => (bad++, console.log('FAIL', m));
(async () => {
  const O = JSON.parse(fs.readFileSync(path.join(root, 'docs/phase8/open.json'), 'utf8')),
    tapos = /^\|\s*8\s*\|[^|]*\|[^|]*\|\s*TAPOS\s*\|/m.test(fs.readFileSync(path.join(root, 'docs/PHASES.md'), 'utf8'));
  const E = load();
  E.ctx.__io = JSON.parse(fs.readFileSync(path.join(root, 'src/data/tcs-io.json'), 'utf8'));
  E.ctx.__mb = JSON.parse(fs.readFileSync(path.join(root, 'src/data/tcs-dcs.json'), 'utf8')).modbus;
  const w = {};
  new Function('window', fs.readFileSync(path.join(root, 'src/ui/plant/modbus.js'), 'utf8'))(w);
  E.ctx.__pk = w.DCS_MODBUS.filter(r => ['fa', 'esp', 'ctcs'].includes(r[0])).map(r => [r[0], r[1]]);
  E.js('window.TCE_IO_LIVE = TCE_IO.make(__io)');
  await E.start('150');
  E.step(20);
  const L = JSON.parse(
    E.js(`(()=>{const U=AN.unit,o={turbine:[],fa:[],esp:[],ctcs:[]},n={turbine:0,fa:0,esp:0,ctcs:0};
      for(const m of __mb){if(!m.tag&&!m.d)continue;n.turbine++;if(!isFinite(TCE_IO_LIVE.mbRead(U,m.to)))o.turbine.push(String(m.ma))}
      for(const [s,a] of __pk){n[s]++;if(!isFinite(AN.pkgRead(s,a)))o[s].push(String(a))}
      return JSON.stringify({o,n})})()`)
  );
  /* the audit of the rows with a value */
  const V = JSON.parse(
    E.js(`JSON.stringify({t:__mb.map(m=>{const v=TCE_IO_LIVE.mbRead(AN.unit,m.to);return isFinite(v)?+v:null}),
      p:__pk.map(([s,a])=>{const v=AN.pkgRead(s,a);return isFinite(v)?+v:null})})`)
  );
  const io = {};
  for (const r of E.ctx.__io.rows) io[r.id] = r;
  const dl = {};
  new Function('window', fs.readFileSync(path.join(root, 'src/ui/plant/dcslists.js'), 'utf8'))(dl);
  const LP = {};
  for (const l of dl.DCS_LOOPS)
    for (const a of String(l[4]).split(/\s+/)) {
      /* STN102: the turbine words have three copies (SI11xx / SI14xx / SI17xx, SI12xx / SI15xx / SI18xx); the loop reads one */
      if (l[0] === '2' && /^SI1[1-8]\d\d$/.test(a)) LP['2:SI' + (1100 + ((+a.slice(2) - 1100) % 300))] = l;
      else if (a) LP[l[0] + ':' + a] = l;
    }
  let au = 0,
    inR = 0;
  const mis = m => (au++, fail('audit: ' + m));
  for (let i = 0; i < E.ctx.__mb.length; i++) {
    const m = E.ctx.__mb[i],
      v = V.t[i];
    if (m.ty === 'DI' && (m.word !== 'SI' + (1000 + Math.floor((m.ma - 10001) / 16)) || m.bit !== (m.ma - 10001) % 16)) mis(m.ma + ' DI word / bit ' + m.word + '.' + m.bit);
    if (m.ty === 'AI' && m.word !== 'SI' + (1100 + m.ma - 30001)) mis(m.ma + ' AI word ' + m.word);
    if (m.ty === 'DO' && (m.word !== 'WM0' + (210 + Math.floor((m.ma - 1) / 16)) || m.bit !== (m.ma - 1) % 16)) mis(m.ma + ' DO word / bit ' + m.word + '.' + m.bit);
    if ((m.sh === 'PLC to DCS') !== (m.ty !== 'DO')) mis(m.ma + ' direction ' + m.sh + ' with type ' + m.ty);
    const r = io[m.to];
    if (r) {
      if (m.ty === 'DI' && !/^D[IO]$/.test(r.kind)) mis(m.ma + ' DI row ends at ' + r.id + ' ' + r.kind);
      if (m.ty === 'AI' && /^D[IO]$/.test(r.kind)) mis(m.ma + ' AI row ends at ' + r.id + ' ' + r.kind);
      if (m.tag && r.tag && m.tag !== r.tag) mis(m.ma + ' tag ' + m.tag + ', TCS row ' + r.id + ' ' + r.tag);
    }
    if (v === null) continue;
    if (m.ty !== 'AI' && v !== 0 && v !== 1) mis(m.ma + ' digital value ' + v);
    const l = m.ty === 'AI' && LP['2:' + m.word];
    if (!l) continue;
    if (r && r.range && (+r.range[0] !== +l[7] || +r.range[1] !== +l[8])) mis(m.ma + ' TCS ' + r.id + ' range ' + r.range.join(' ') + ', DCS loop ' + l[1] + ' ' + l[7] + ' ~ ' + l[8]);
    if (v < +l[7] || v > +l[8]) mis(m.ma + ' ' + m.d + ' = ' + v + ' outside the DCS loop ' + l[1] + ' ' + l[7] + ' ~ ' + l[8] + ' ' + l[9]);
    else inR++;
  }
  for (let i = 0; i < w.DCS_MODBUS.length; i++) {
    const r = w.DCS_MODBUS[i];
    if (!['fa', 'esp', 'ctcs'].includes(r[0])) continue;
    const j = E.ctx.__pk.findIndex(x => x[0] === r[0] && x[1] === r[1]),
      v = V.p[j],
      bit = r[1].includes('.');
    if (bit && /^A[IO]$/.test(r[4])) mis(r[0] + ' ' + r[1] + ' analog on a bit');
    if (r[6] === 'DCS' && r[0] !== 'ctcs' && !/^4/.test(r[1])) mis(r[0] + ' ' + r[1] + ' DCS to PLC not a holding register');
    if (v === null) continue;
    if (/^D[IO]$/.test(r[4]) && v !== 0 && v !== 1) mis(r[0] + ' ' + r[1] + ' digital value ' + v);
    const l = /^A[IO]$/.test(r[4]) && r[5].split(' ').map(a => LP['4:' + a]).find(Boolean);
    if (l && (v < +l[7] || v > +l[8])) mis(r[0] + ' ' + r[1] + ' = ' + v + ' outside the DCS loop ' + l[1]);
    else if (l) inR++;
  }
  console.log('  audit: ' + (au ? au + ' mismatches' : 'no mismatch') + '; ' + inR + ' analog values inside the range of their DCS loop at 150 MW');
  const LK = JSON.parse(fs.readFileSync(path.join(root, 'docs/phase8/link.json'), 'utf8'));
  if (!fs.existsSync(path.join(__dirname, 'phase8-link.cjs')) || !LK.tested.length) fail('no link test / docs/phase8/link.json');
  for (const x of LK.nosource) if (!x.why || x.why.length < 30) fail('link ' + x.id + ' with no reason');
  console.log('  link: ' + LK.tested.length + ' link signals tested (phase8-link.cjs), ' + LK.nosource.length + ' behaviours with no document: ' + LK.nosource.map(x => x.id).join(' '));
  const types = {};
  for (const g of O.groups) {
    if (!/^(b|c|m|open)$/.test(g.type)) fail(g.sys + ' group type ' + g.type + ' (b, c, m or open)');
    if (!g.why || g.why.length < 30) fail(g.sys + ' group with no reason: ' + (g.names || [])[0]);
    if (g.type === 'open' && !g.owner) fail(g.sys + ' open group with no owner');
    types[g.type] = (types[g.type] || 0) + g.rows.length;
  }
  let unlisted = 0,
    gone = 0;
  for (const s of Object.keys(L.o)) {
    const listed = new Set(O.groups.filter(g => g.sys === s).flatMap(g => g.rows)),
      live = new Set(L.o[s]);
    const u = L.o[s].filter(a => !listed.has(a)),
      x = [...listed].filter(a => !live.has(a));
    unlisted += u.length;
    gone += x.length;
    console.log(
      '  ' + s + ': ' + (L.n[s] - L.o[s].length) + ' of ' + L.n[s] + ' rows with a value; no value ' + L.o[s].length +
        (u.length ? ', NOT LISTED ' + u.slice(0, 8).join(' ') : '') + (x.length ? ', listed but has a value now ' + x.slice(0, 8).join(' ') : '')
    );
  }
  console.log('  no-value rows by type: ' + JSON.stringify(types));
  const left = [];
  if (unlisted) left.push(unlisted + ' rows with no value not in docs/phase8/open.json');
  if (gone) left.push(gone + ' rows in docs/phase8/open.json have a value now (remove them)');
  if (types.open) left.push(types.open + ' rows still open');
  if (tapos) for (const m of left) fail('row 8 is TAPOS but ' + m);
  else console.log(left.length ? 'row 8 BAHAGI, left: ' + left.join('; ') : 'row 8 BAHAGI: every condition met, it may be marked TAPOS');
  console.log(bad ? 'FAIL phase8-gate: ' + bad : 'PASS phase8-gate' + (tapos ? ': row 8 TAPOS, every condition met' : ''));
  process.exit(bad ? 1 : 0);
})().catch(e => {
  console.error(e);
  process.exit(1);
});
