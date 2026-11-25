/* Phase 1 (user "Go 1" 2026-11-25): docs/SCOPE.md is the one scope file. Fails when a required section is missing, when an HMI page
   (src/ui/plant/hx/hx-page-<id>.js) or an alarm group (src/data/alarms/<group>.json) of the app is not named in section 3, when the
   equipment list of section 4 does not have the count it states, or when docs/PHASES.md does not list the 15 phases. */
const fs = require('fs'),
  path = require('path');
const root = path.resolve(__dirname, '..', '..', '..');
const rd = f => fs.readFileSync(path.join(root, f), 'utf8');
let bad = 0;
const fail = m => (console.log('FAIL ' + m), bad++);
const S = rd('docs/SCOPE.md');
const need = ['## 1. Mga patakaran ng saklaw', '## 2. Mga dokumento at aling revision ang masusunod', '## 3. Mga sistema: pasok at labas',
  '## 4. Equipment list (K1AU3-L1-0-002), sinuri', '## Appendix A:', '## Appendix B:'];
for (const h of need) if (!S.includes(h)) fail('SCOPE.md has no section "' + h + '"');
const sec = (a, b) => {
  const i = S.indexOf(a), j = b ? S.indexOf(b, i + 1) : S.length;
  return i < 0 ? '' : S.slice(i, j < 0 ? S.length : j);
};
// the revision rules the user gave must stay written
const s2 = sec('## 2.', '## 3.');
for (const k of ['TCE / TCA Aug 2017', 'Feb 2017', '20160912', 'RB kung mayroon', 'PPE-14-0725', 'HINDI ginagamit'])
  if (!s2.includes(k)) fail('section 2 does not state the revision rule "' + k + '"');
// every system of the app is in section 3
const s3 = sec('## 3.', '## 4.');
const named = new Set([...s3.matchAll(/`([a-z0-9-]+)`/g)].map(m => m[1]));
const pages = fs.readdirSync(path.join(root, 'src/ui/plant/hx')).map(f => (/^hx-page-(.+)\.js$/.exec(f) || [])[1]).filter(Boolean);
const groups = fs.readdirSync(path.join(root, 'src/data/alarms')).map(f => (/^(.+)\.json$/.exec(f) || [])[1]).filter(Boolean);
for (const p of pages) if (!named.has(p)) fail('HMI page "' + p + '" is not in SCOPE.md section 3');
for (const g of groups) if (!named.has(g)) fail('alarm group "' + g + '" is not in SCOPE.md section 3');
for (const k of ['WTP', 'Coal handling', 'compressors at dryers']) if (!s3.includes(k)) fail('section 3 does not say "' + k + '" is out');
// the equipment list: rows numbered 1..N and N is the count written in the text
const s4 = sec('## 4.', '## 5.');
const rows = [...s4.matchAll(/^\| (\d+) \| ([A-Z]{1,3}-[A-Z]{0,2}\d{4}[A-Z]?(?:\/\d{4}[A-Z]?)?) \|[^|]+\|[^|]+\| (PASOK|LABAS)/gm)];
const said = +((/\*\*(\d+) equipment tag\*\*/.exec(s4) || [])[1] || 0);
if (!rows.length || rows.length !== said) fail('equipment rows ' + rows.length + ', the text says ' + said);
rows.forEach((r, i) => +r[1] !== i + 1 && fail('equipment row ' + r[1] + ' out of order'));
const tags = rows.map(r => r[2]);
if (new Set(tags).size !== tags.length) fail('an equipment tag is listed twice');
if (!s4.includes('35 pahina ng **R0')) fail('section 4 is not the R0 equipment list');
if ((/PASOK (\d+), LABAS (\d+)/.exec(s4) || []).slice(1).join() !== [rows.filter(r => r[3] === 'PASOK').length, rows.filter(r => r[3] === 'LABAS').length].join()) fail('PASOK / LABAS counts of section 4');
// docs/PHASES.md: the 15 phases, each with a status
const P = rd('docs/PHASES.md');
const ph = [...P.matchAll(/^\| (\d+) \| [^|]+\|[^|]+\| (TAPOS|BAHAGI|HINDI PA) \|/gm)].map(m => +m[1]);
if (ph.join() !== Array.from({ length: 15 }, (_, i) => i + 1).join()) fail('PHASES.md does not list phases 1 ~ 15 with a status (' + ph.join() + ')');
// no plant IP address in the scope files (public repo)
for (const [f, t] of [['docs/SCOPE.md', S], ['docs/PHASES.md', P]]) if (/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/.test(t)) fail(f + ' has an IP address');
console.log((bad ? 'FAIL' : 'PASS') + ' scope-doc: ' + need.length + ' sections, ' + pages.length + ' pages + ' + groups.length + ' alarm groups in scope, ' + rows.length + ' equipment, ' + ph.length + ' phases');
process.exit(bad ? 1 : 0);
