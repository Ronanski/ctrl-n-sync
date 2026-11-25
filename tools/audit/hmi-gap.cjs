// HMI gap list (EIMI, 2026-11-25): every Unit 1 piece of equipment of the DCS I/O list in the app (src/data/ades.txt) against the HX
// pages (src/ui/plant/hx/hx-page-*.js). An equipment = the part of a tag after its signal prefix (ZSO-FW1111-1 -> FW1111-1); it is ON a
// page when its number (FW1111) is named in a page file, or in the bind of a registry machine (hx-registry.js) that a page names.
// Left out by the user's order (2026-11-25): water treatment (PW, HC, IW), coal handling (conveyors), air compressors and dryers (C, D).
// Text match only: a page that binds a machine by a DITL sheet with no tag text counts as not on the page. The runtime check of each
// bound element is the job of the page that takes it.
// Usage: node tools/audit/hmi-gap.cjs [--md out.md] [--json out.json]
const fs = require('fs'),
  z = require('zlib'),
  path = require('path');
const J = JSON.parse(z.gunzipSync(Buffer.from(fs.readFileSync('src/data/ades.txt', 'utf8').replace(/\s/g, ''), 'base64')).toString());
const HX = 'src/ui/plant/hx/';
const pages = fs.readdirSync(HX).filter(f => /^hx-page-.*\.js$/.test(f));
const ptxt = Object.fromEntries(pages.map(f => [f.replace(/^hx-page-|\.js$/g, ''), fs.readFileSync(HX + f, 'utf8')]));
/* registry machines a page names: their bind (tag, DITL) counts for that page */
const reg = (() => {
  const s = fs.readFileSync(HX + 'hx-registry.js', 'utf8');
  return JSON.parse(s.slice(s.indexOf('{'), s.lastIndexOf('}') + 1));
})();
for (const k in reg.machines || {}) {
  const m = reg.machines[k],
    q = "'" + k + "'";
  for (const p in ptxt) if (ptxt[p].includes(q)) ptxt[p] += '\n' + JSON.stringify(m);
}
/* beta of 2026-11-25 (MINAMI): a page may build its tags in a loop (n + '-SYSERR'): run the page file with a stand-in HX that keeps
   every text it gets, and search that too. A file the stand-in cannot run keeps its text match */
const vm = require('vm');
for (const f of pages) {
  const p = f.replace(/^hx-page-|\.js$/g, ''),
    got = [];
  const keep = x => {
    if (typeof x === 'string') got.push(x);
    else if (x && typeof x === 'object') for (const k of Object.keys(x)) keep(x[k]);
  };
  const HXs = new Proxy(
    { CALC: {}, PKG: {}, MON: {} },
    {
      get: (o, k) =>
        k in o
          ? o[k]
          : (...a) => {
              a.forEach(keep);
              return typeof a[a.length - 1] === 'object' && k !== 'page' ? Object.assign({}, a[a.length - 1], { a }) : { a };
            }
    }
  );
  try {
    vm.runInNewContext(fs.readFileSync(HX + f, 'utf8'), { HX: HXs, window: { HX: HXs }, document: {}, console });
  } catch (e) {
    if (process.argv.includes('-v')) console.error(f + ': ' + e.message);
  }
  ptxt[p] += '\n' + got.join('\n');
}
const OUT = { PW: 'water treatment', HC: 'water treatment', IW: 'water treatment', C: 'air compressors', D: 'air dryers' };
/* proposed page for each system code: lane 6 = boiler (EIMI), lane 7 = water / steam / turbine (RIN) */
const PAGE = {
  FA: ['combustion-air', 6], PA: ['combustion-air', 6], F: ['furnace-gas', 6], FG: ['furnace-gas', 6], LO: ['combustion-air', 6],
  CL: ['coal', 6], IA: ['coal', 6], L: ['ash', 6], BH: ['ash', 6], S: ['ash', 6], FH: ['ash', 6], LM: ['limestone-sand', 6],
  M: ['limestone-sand', 6], SD: ['limestone-sand', 6], N: ['sootblowers', 6], SB: ['sootblowers', 6], BR: ['boiler-steam', 6],
  BD: ['boiler-steam', 6], MS: ['boiler-steam', 6], FS: ['boiler-steam', 6], Z: ['sampling', 6], CH: ['sampling', 6], SP: ['sampling', 6],
  FW: ['feedwater', 7], CD: ['condensate', 7], HD: ['extraction', 7], TS: ['extraction', 7], AS: ['aux-steam', 7], GS: ['aux-steam', 7],
  AV: ['aux-steam', 7], HR: ['reheat', 7], CR: ['reheat', 7], ST: ['turbine', 7], CW: ['makeup-cooling', 7], MU: ['makeup-cooling', 7],
  P: ['makeup-cooling', 7], SW: ['sea-water', 7], DF: ['sea-water', 7], CTCS: ['sea-water', 7], AI: ['generator', 7], AO: ['generator', 7],
  DO: ['generator', 7], DI: ['generator', 7], '?': ['purge-trip', 6],
  ANN: ['annunciator (station)', 6], DIAG: ['dcs-diagnostics (station, new)', 6]
};
const SIG = /\s+(open|close|closed|running|stop|stopped|trip|remote|local|torque|start|command|fully open|full open|full close|fail|fault|alarm|on|off|position.*|in operation|not fail|high|low|high high|low low|abnormal)(\s+command)?$/i;
const E = {};
for (const st in J)
  for (const a in J[st]) {
    const p = J[st][a];
    if (p.k !== 'io' || !p.tag) continue;
    const u = /^#(\d)/.exec(p.d || '');
    if (u && u[1] !== '1') continue; /* Unit 1 only (4 units identical) */
    const m = /^[A-Z0-9]+-([A-Z]{1,4})(\d{3,4})([A-Z]?)(-[A-Z0-9]+)?/.exec(p.tag);
    /* no system code in the tag: the console annunciator (on the station panel since beta.375), the DCS self-diagnostics, the rest
       (IRP / OPC trip signals) on the purge and trip page */
    const sys = m ? m[1] : /^(OPC-ANN-|ANN-|BUZZER-OUT)/.test(p.tag) ? 'ANN' : /SYSERR|PDP-|POWALM/.test(p.tag) ? 'DIAG' : '?',
      num = m ? m[1] + m[2] : p.tag,
      key = m ? p.tag.slice(p.tag.indexOf('-') + 1) : p.tag;
    if (OUT[sys] || /conveyor|crusher|stacker|reclaim|air compressor/i.test(p.d) || /^TE-M0703-/.test(p.tag)) continue; /* TE-M0703: the windings of the plant air compressors A / B / C */
    const e = (E[key] = E[key] || { key, sys, num, d: String(p.d).replace(/^#1\s*/, '').replace(SIG, ''), sig: [] });
    e.sig.push({ tag: p.tag, adr: 'S' + st + ' ' + a, t: p.t, d: String(p.d).replace(/^#1\s*/, '') });
  }
const on = e => {
  if (e.sys === 'ANN') return ['annunciator']; /* the station panel draws every OPC-ANN window and the Test / Ack / Reset / horn */
  const re = new RegExp('(^|[^0-9A-Z])' + e.num.replace(/([A-Z]+)(\d+)/, '$1-?$2') + '(?![0-9])');
  return Object.keys(ptxt).filter(p => re.test(ptxt[p]));
};
const S = {};
for (const e of Object.values(E)) {
  e.pages = on(e);
  const s = (S[e.sys] = S[e.sys] || { sys: e.sys, page: (PAGE[e.sys] || ['?', 0])[0], lane: (PAGE[e.sys] || ['?', 0])[1], all: 0, on: 0, miss: [] });
  s.all++;
  if (e.pages.length) s.on++;
  else s.miss.push(e);
}
const L = Object.values(S).sort((a, b) => a.lane - b.lane || a.page.localeCompare(b.page) || b.all - a.all);
const tot = L.reduce((t, s) => [t[0] + s.all, t[1] + s.on], [0, 0]);
console.log('equipment', tot[0], 'on a page', tot[1], 'missing', tot[0] - tot[1]);
for (const s of L) console.log(s.lane, s.page, s.sys, s.all, 'on', s.on, 'missing', s.miss.length);
const a = process.argv.indexOf('--md');
if (a > 0) {
  let o =
    '# HMI gap list: Unit 1 equipment of the DCS I/O list against the HX pages (EIMI, 2026-11-25)\n\nMade by `node tools/audit/hmi-gap.cjs --md`. ' +
    'An equipment counts as ON a page when its tag number is named in the page file, or in the registry bind of a machine the page names. Text match only, ' +
    'so a row can be on a page under another name: the page that takes it checks it in the running app. Left out by the user\'s order: water treatment ' +
    '(PW, HC, IW), coal handling (conveyors), air compressors and dryers (C, D).\n\n' +
    `**Total: ${tot[0]} equipment, ${tot[1]} on a page, ${tot[0] - tot[1]} missing.**\n\n## Summary by page\n\n| Lane | Page (proposed) | System code | Equipment | On a page | Missing |\n|---|---|---|---|---|---|\n`;
  for (const s of L) o += `| ${s.lane} | ${s.page} | ${s.sys} | ${s.all} | ${s.on} | ${s.miss.length} |\n`;
  o += '\n## Missing equipment, with the addresses each one binds to\n';
  let pg = '';
  for (const s of L) {
    if (!s.miss.length) continue;
    if (s.page !== pg) o += `\n### ${(pg = s.page)} (lane ${s.lane})\n`;
    o += `\n**${s.sys}** (${s.miss.length})\n\n| Equipment | What | Signals (tag · address · type) |\n|---|---|---|\n`;
    for (const e of s.miss.sort((x, y) => x.key.localeCompare(y.key)))
      o += `| ${e.key} | ${e.d.replace(/\|/g, '/')} | ${e.sig.map(x => x.tag + ' · ' + x.adr + ' · ' + x.t).join('<br>')} |\n`;
  }
  fs.mkdirSync(path.dirname(process.argv[a + 1]), { recursive: true });
  fs.writeFileSync(process.argv[a + 1], o);
}
const j = process.argv.indexOf('--json');
if (j > 0) fs.writeFileSync(process.argv[j + 1], JSON.stringify(L, null, 1));
