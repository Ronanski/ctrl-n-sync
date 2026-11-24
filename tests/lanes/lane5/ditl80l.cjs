/* Lane 5 (2026-11-25): DITL-80L (SOOTBLOWER CONTROL LOGIC DIAGRAM (13), STN102), built from the drawing by tools/data/ditl80l_build.py.
   The sheet loads in the real DITL code (node engine, no browser) and its gates give the drawing's outputs:
   all lances retracted -> M.4008 (ALL RETRACT) 1, M.4232 (ANY EXTEND) 0, the three group summaries M.4246 / M.4240 / M.4242 = 1;
   one lance out in a group -> that group's retract summary 0 and its extend summary 1, the others stay; the APH blower away from
   its reset position -> M.4008 0 (the APH rows are in the ALL RETRACT AND on the drawing), M.4232 stays 0 (not a lance). */
const { loadEngine } = require('../../../tools/engine/node-engine.js');
const fs = require('fs'),
  zlib = require('zlib'),
  vm = require('vm');
(async () => {
  const { win } = await loadEngine();
  const pre = zlib.gunzipSync(Buffer.from(fs.readFileSync('src/data/pre.txt', 'utf8').trim(), 'base64')).toString().split('\n').filter(Boolean).map(l => JSON.parse(l));
  const sh = pre.find(p => p.name === '(S15)DITL-80L');
  if (!sh) { console.log('FAIL DITL-80L is not in src/data/pre.txt'); process.exit(1); }
  win.__sh = sh;
  const r = vm.runInContext(`(() => {
    const s = __sh; s.sig = {}; s.nl = netlist(s);
    const hr = s.sd.hrow, ix = t => hr.find(h => h.tag === t).row,
      outRow = m => s.rows.findIndex((r, i) => (s.cells[i + ':RS'] || []).some(t => t.t === m)),
      M = ['M.4008', 'M.4232', 'M.4246', 'M.4247', 'M.4240', 'M.4241', 'M.4242', 'M.4243'],
      set = (t, v) => { s.sig[ix(t) + ':S'] = v; },
      st = () => { s.nl = netlist(s); const o = simSheet(s).outOn; return M.map(m => (o.has(outRow(m)) ? 1 : 0)).join(''); },
      res = { gates: s.nl.gates.length, src: s.nl.src.length, outs: s.nl.outs.length };
    for (const h of hr) set(h.tag, /^ZSR-N10[1-3]\\d$/.test(h.tag) || /^ZSE-N104[02]$/.test(h.tag));
    res.allRet = st();
    set('ZSR-N1020', false); set('ZSE-N1020', true); res.n1020 = st();
    set('ZSR-N1020', true); set('ZSE-N1020', false); set('ZSR-N1030', false); set('ZSE-N1030', true); res.n1030 = st();
    set('ZSR-N1030', true); set('ZSE-N1030', false); set('ZSR-N1036', false); set('ZSE-N1036', true); res.n1036 = st();
    set('ZSR-N1036', true); set('ZSE-N1036', false); set('ZSR-N1040', true); res.aph = st();
    return res; })()`, win);
  /* order: M.4008 M.4232 M.4246 M.4247 M.4240 M.4241 M.4242 M.4243 */
  const want = { gates: 16, src: 60, outs: 10, allRet: '10101010', n1020: '01011010', n1030: '01100110', n1036: '01101001', aph: '00101010' };
  const bad = Object.keys(want).filter(k => String(r[k]) !== String(want[k]));
  console.log('DITL-80L ' + JSON.stringify(r) + (bad.length ? ' FAIL ' + bad.join(',') : ' ok'));
  process.exit(bad.length ? 1 : 0);
})().catch(e => { console.log('FAIL ' + e.message); process.exit(1); });
