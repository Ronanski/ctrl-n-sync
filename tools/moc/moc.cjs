/* Phase 15 (Configuration management / MOC = Management of Change; user "Go 10 13 15", 2026-11-27 7:00 AM PHT).
   The controlled configuration of the app is every logic sheet, every tag table, every alarm group and every address link file:
     abc:<sheet>     one ABC sheet of src/data/apre.txt (one JSON line per sheet)
     ditl:<sheet>    one DITL sheet of src/data/pre.txt (one JSON line per sheet; the unit sheets are built from these at run time)
     tcs:<sheet>     one TCS sheet src/digital/tce/<sheet>.js (_lib = the TCS block library, _desc = the block texts)
     tag:<table>     the tag database: station-1 ~ station-5 of src/data/ades.txt, tcs-io, tcs-dcs, io-excluded, io-spare, aln (linear curves)
     alarm:<group>   one alarm group src/data/alarms/<group>.json
     link:<file>     an address link file src/world/bind/*.json, src/world/inst/*.json
   docs/moc/baseline.json holds, per item, its version (rev), the hash of its content (sha) and the change that made it (change).
   docs/moc/changes/<id>.json is one change: what, the source document, the items. A change file is never edited after it is merged.
   Usage:
     node tools/moc/moc.cjs                       check: every item equals the baseline, every rev / change matches the change files
     node tools/moc/moc.cjs --diff                list the items that differ from the baseline
     node tools/moc/moc.cjs --record --what "<what changed>" --source "<document, page / sheet / row>" [--by "<thread>"] [--slug <word>]
                                                  writes one change file for every item that differs and updates the baseline
   Exit 1 on a check failure. */
const fs = require('fs'),
  path = require('path'),
  zlib = require('zlib'),
  crypto = require('crypto');
const root = path.resolve(__dirname, '..', '..');
const R = (...p) => path.join(root, ...p);
const BASE = R('docs', 'moc', 'baseline.json'),
  CH = R('docs', 'moc', 'changes');
const sha = t => crypto.createHash('sha256').update(t.replace(/\r\n/g, '\n')).digest('hex').slice(0, 16);
const txt = f => fs.readFileSync(f, 'utf8');
const gz = f => zlib.gunzipSync(Buffer.from(txt(f).trim(), 'base64')).toString('utf8');

// the current content of every controlled item: key -> sha
function current() {
  const o = {};
  const sheets = (k, f) => {
    for (const l of gz(R('src', 'data', f)).split('\n').filter(Boolean)) {
      const n = JSON.parse(l).name;
      if (o[k + ':' + n]) throw new Error(f + ': sheet ' + n + ' twice');
      o[k + ':' + n] = sha(l);
    }
  };
  sheets('abc', 'apre.txt');
  sheets('ditl', 'pre.txt');
  for (const f of fs.readdirSync(R('src', 'digital', 'tce')).sort()) if (/\.js$/.test(f)) o['tcs:' + f.slice(0, -3)] = sha(txt(R('src', 'digital', 'tce', f)));
  const ades = JSON.parse(gz(R('src', 'data', 'ades.txt')));
  for (const s of Object.keys(ades).sort()) o['tag:station-' + s] = sha(JSON.stringify(ades[s]));
  for (const t of ['tcs-io', 'tcs-dcs', 'io-excluded', 'io-spare', 'aln']) o['tag:' + t] = sha(txt(R('src', 'data', t + '.json')));
  for (const f of fs.readdirSync(R('src', 'data', 'alarms')).sort()) if (/\.json$/.test(f)) o['alarm:' + f.slice(0, -5)] = sha(txt(R('src', 'data', 'alarms', f)));
  for (const d of ['bind', 'inst'])
    for (const f of fs.readdirSync(R('src', 'world', d)).sort()) if (/\.json$/.test(f)) o['link:' + d + '-' + f.slice(0, -5)] = sha(txt(R('src', 'world', d, f)));
  return o;
}

function readBase() {
  return fs.existsSync(BASE) ? JSON.parse(txt(BASE)) : { items: {} };
}
// one item per line, sorted: two changes of different items never touch the same line (parallel threads merge cleanly)
function writeBase(b) {
  const keys = Object.keys(b.items).sort();
  const lines = keys.map(k => '    ' + JSON.stringify(k) + ': ' + JSON.stringify(b.items[k]));
  fs.mkdirSync(path.dirname(BASE), { recursive: true });
  fs.writeFileSync(BASE, '{\n  "about": ' + JSON.stringify(b.about) + ',\n  "items": {\n' + lines.join(',\n') + '\n  }\n}\n');
}
function readChanges() {
  if (!fs.existsSync(CH)) return [];
  return fs
    .readdirSync(CH)
    .filter(f => /\.json$/.test(f))
    .sort()
    .map(f => Object.assign({ file: f }, JSON.parse(txt(path.join(CH, f)))))
    .sort((a, b) => (a.kind === 'baseline' ? -1 : b.kind === 'baseline' ? 1 : a.id < b.id ? -1 : 1)); // the baseline is first
}
function diff(cur, base) {
  const d = [];
  for (const k of Object.keys(cur)) if (!base.items[k]) d.push({ k, op: 'add' });
    else if (base.items[k].sha !== cur[k]) d.push({ k, op: 'change' });
  for (const k of Object.keys(base.items)) if (!(k in cur)) d.push({ k, op: 'remove' });
  return d.sort((a, b) => (a.k < b.k ? -1 : 1));
}
// a source names a document (a number such as PR-OPE-5002, K1AU3-A1-0-001, ABC-010, TCE143), a repo file, or the user's dated words
const SOURCE_OK = /[A-Z]{2,}[-\s]?\d|\d{6,}|\bp\.\s?\d|\bpage \d|[\w-]+\/[\w./-]+|user \d{4}-\d{2}-\d{2}/i;
const SOURCE_BAD = /\b(assum\w*|hula|guess\w*|NO-SOURCE)\b/i;

function check() {
  const bad = [];
  const cur = current(),
    base = readBase(),
    ch = readChanges();
  const ids = new Map();
  for (const c of ch) {
    const where = 'docs/moc/changes/' + c.file;
    if (c.file !== c.id + '.json') bad.push(where + ': id "' + c.id + '" is not the file name');
    if (!/^\d{8}-\d{4}-[a-z0-9-]+$/.test(c.id || '')) bad.push(where + ': id must be YYYYMMDD-HHMM-<word> (PHT)');
    if (!c.what || c.what.length < 10) bad.push(where + ': "what" is empty or too short');
    if (!c.source || !SOURCE_OK.test(c.source)) bad.push(where + ': "source" must name the document (number, page / sheet / row), a repo file, or "user YYYY-MM-DD ..."');
    if (c.source && SOURCE_BAD.test(c.source)) bad.push(where + ': "source" says assumed / guess / NO-SOURCE: find the document first');
    if (c.kind === 'baseline' ? c.items !== 'all' : !Array.isArray(c.items) || !c.items.length) bad.push(where + ': items missing');
    if (c.kind === 'release' && !/GO STABLE|GO EA/.test(c.user || '')) bad.push(where + ': a release change carries the user\'s own words "GO EA" / "GO STABLE"');
    ids.set(c.id, c);
  }
  const bl = ch.filter(c => c.kind === 'baseline');
  if (bl.length !== 1) bad.push('there must be exactly one baseline change, found ' + bl.length);
  // per item: rev = the number of changes that touched it (baseline counts 1), change = the latest of them
  const touch = {};
  for (const c of ch) {
    if (c.kind === 'baseline' && Array.isArray(c.keys)) for (const k of c.keys) (touch[k] = touch[k] || []).push({ id: c.id, op: 'add' });
    if (Array.isArray(c.items)) for (const it of c.items) (touch[it.k] = touch[it.k] || []).push({ id: c.id, op: it.op });
  }
  for (const [k, v] of Object.entries(base.items)) {
    const t = touch[k] || [];
    const live = t.filter(x => x.op !== 'remove').length;
    const last = t[t.length - 1];
    if (!last) bad.push(k + ': in the baseline, no change file names it');
    else if (last.op === 'remove') bad.push(k + ': in the baseline, its last change ' + last.id + ' removes it');
    else {
      if (v.change !== last.id) bad.push(k + ': baseline change ' + v.change + ', the latest change file naming it is ' + last.id);
      if (v.rev !== live) bad.push(k + ': baseline rev ' + v.rev + ', ' + live + ' change files name it');
    }
  }
  const d = diff(cur, base);
  for (const x of d) bad.push(x.k + ' ' + (x.op === 'add' ? 'is new' : x.op === 'remove' ? 'is gone' : 'changed') + ' and is not recorded');
  if (d.length)
    bad.push('record it with its source: node tools/moc/moc.cjs --record --what "<what changed>" --source "<document, page / sheet / row>" --by "<thread>"');
  return { bad, n: Object.keys(cur).length, changes: ch.length, d };
}

function record(a) {
  const cur = current(),
    base = readBase(),
    d = diff(cur, base);
  if (!d.length) throw new Error('nothing differs from the baseline');
  const pht = new Date(Date.now() + 8 * 3600e3).toISOString();
  const id = pht.slice(0, 10).replace(/-/g, '') + '-' + pht.slice(11, 16).replace(':', '') + '-' + (a.slug || 'change').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const c = { id, date: pht.slice(0, 10) + ' ' + pht.slice(11, 16) + ' PHT', what: a.what, source: a.source, by: a.by || '', items: d };
  if (!c.what || !c.source) throw new Error('--what and --source are needed');
  if (!SOURCE_OK.test(c.source) || SOURCE_BAD.test(c.source)) throw new Error('--source must name the document (number, page / sheet / row), a repo file or the user\'s dated words');
  fs.mkdirSync(CH, { recursive: true });
  if (fs.existsSync(path.join(CH, id + '.json'))) throw new Error(id + ' exists: give another --slug');
  fs.writeFileSync(path.join(CH, id + '.json'), JSON.stringify(c, null, 2) + '\n');
  for (const x of d) {
    if (x.op === 'remove') delete base.items[x.k];
    else base.items[x.k] = { rev: (base.items[x.k] ? base.items[x.k].rev : 0) + 1, sha: cur[x.k], change: id };
  }
  writeBase(base);
  console.log('recorded ' + id + ': ' + d.length + ' items (' + d.map(x => x.op + ' ' + x.k).join(', ') + ')');
}

module.exports = { current, check, readBase, readChanges, writeBase, SOURCE_OK };
if (require.main === module) {
  const argv = process.argv.slice(2),
    arg = n => {
      const i = argv.indexOf('--' + n);
      return i < 0 ? undefined : argv[i + 1];
    };
  if (argv.includes('--record'))
    try {
      record({ what: arg('what'), source: arg('source'), by: arg('by'), slug: arg('slug') });
    } catch (e) {
      console.log('MOC: ' + e.message);
      process.exit(1);
    }
  else if (argv.includes('--diff')) for (const x of diff(current(), readBase())) console.log(x.op + ' ' + x.k);
  else {
    const r = check();
    for (const m of r.bad) console.log('FAIL ' + m);
    console.log((r.bad.length ? 'FAIL' : 'PASS') + ' moc: ' + r.n + ' controlled items, ' + r.changes + ' change files');
    process.exit(r.bad.length ? 1 : 0);
  }
}
