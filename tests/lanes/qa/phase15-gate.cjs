/* Phase 15 gate: Configuration management / MOC (user "Go 10 13 15", 2026-11-27 7:00 AM PHT). docs/MOC.md says the rules; this test
   fails when one breaks:
     A. MOC: every logic sheet, tag table, alarm group and link file equals docs/moc/baseline.json, and every item's version (rev) and
        last change match docs/moc/changes (tools/moc/moc.cjs); every change names its source document; a merged change file is never
        edited or deleted.
     B. Version: delivery/app/app.json "X.Y.Z-beta" (the beta number = the commit count of main, tools/app-version.js) or a Final
        "X.Y.Z" that only a release change with the user's own "GO STABLE" may set; the workflows check out the whole history.
     C. Release: only release.yml makes a GitHub Release or a tag, only by hand (workflow_dispatch) and only with "GO v<version>".
     D. Clean repo: no built html, no junk or key files, no file over 6 MB, no plant IP address, no password / token / private key. */
const fs = require('fs'),
  path = require('path'),
  { execFileSync } = require('child_process');
const root = path.resolve(__dirname, '..', '..', '..');
const rd = f => fs.readFileSync(path.join(root, f), 'utf8');
const git = (...a) => execFileSync('git', ['-C', root, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1 << 28 }).trim();
let bad = 0;
const fail = m => (console.log('FAIL ' + m), bad++);
const moc = require(path.join(root, 'tools', 'moc', 'moc.cjs'));

// A. MOC
const r = moc.check();
for (const m of r.bad) fail(m);
let hasMain = true;
try {
  git('rev-parse', '--verify', 'origin/main');
} catch (e) {
  hasMain = false;
}
const br = process.env.GITHUB_REF_NAME || git('rev-parse', '--abbrev-ref', 'HEAD');
if (hasMain && br !== 'main') {
  const ed = git('diff', '--name-only', '--diff-filter=MDR', 'origin/main...HEAD', '--', 'docs/moc/changes').split('\n').filter(Boolean);
  for (const f of ed) fail(f + ': a merged change file is edited or deleted; write a new change instead (tools/moc/moc.cjs --record)');
}

// B. Version
const V = JSON.parse(rd('delivery/app/app.json')).version;
if (!/^\d+\.\d+\.\d+(-beta)?$/.test(V)) fail('delivery/app/app.json version "' + V + '" is not X.Y.Z-beta or X.Y.Z');
if (!/^\d+\.\d+\.\d+(?:-beta\.\d+)?$/.test(rd('src/version.txt').trim())) fail('src/version.txt is not a version');
const av = rd('tools/app-version.js');
if (!/'rev-list', '--count', 'HEAD'/.test(av)) fail('tools/app-version.js does not count the commits of main (git rev-list --count HEAD)');
for (const w of ['checks.yml', 'release.yml', 'site.yml']) if (!/fetch-depth: 0/.test(rd('.github/workflows/' + w))) fail(w + ' does not check out the whole history (fetch-depth: 0)');
if (!/node tools\/version-check\.js/.test(rd('.github/workflows/checks.yml'))) fail('checks.yml does not run tools/version-check.js');
let shallow = 'true';
try {
  shallow = git('rev-parse', '--is-shallow-repository');
} catch (e) {}
if (/-beta$/.test(V) && shallow === 'false') {
  const got = require(path.join(root, 'tools', 'app-version.js'))(),
    want = V + '.' + git('rev-list', '--count', 'HEAD');
  if (got !== want) fail('app version ' + got + ', the commit count gives ' + want);
}
if (/^\d+\.\d+\.\d+$/.test(V) && !moc.readChanges().some(c => c.kind === 'release' && c.version === V && /GO STABLE/.test(c.user || '')))
  fail('app.json is the Final ' + V + ' with no release change (docs/moc/changes, kind "release") holding the user\'s own "GO STABLE"');

// C. Release
const wf = fs.readdirSync(path.join(root, '.github', 'workflows')).filter(f => /\.ya?ml$/.test(f));
const rel = rd('.github/workflows/release.yml');
const on = (/^on:\n((?:  .*\n)+)/m.exec(rel) || [])[1] || '';
const trig = [...on.matchAll(/^  (\w+):/gm)].map(m => m[1]);
if (trig.join() !== 'workflow_dispatch') fail('release.yml runs on ' + (trig.join(', ') || '?') + ': it must run only by hand (workflow_dispatch)');
if (!/\[ "\$\{\{ inputs\.go \}\}" = "GO v\$V" \]/.test(rel)) fail('release.yml does not stop unless the input is exactly "GO v<version>"');
for (const w of wf) {
  if (w === 'release.yml') continue;
  const t = rd('.github/workflows/' + w);
  if (/gh release (create|upload|edit)|action-gh-release|git tag\s|git push[^\n]*--tags|contents: write/.test(t)) fail(w + ' can make a release or a tag: only release.yml may');
}
const rules = rd('RULES.md');
for (const k of ['GO EA', 'GO STABLE']) if (!rules.includes(k)) fail('RULES.md does not state the release word ' + k);
const M = rd('docs/MOC.md');
for (const h of ['## 1. Ano ang kontrolado', '## 2. Daan ng pagbabago', '## 3. Version', '## 4. Release', '## 5. Malinis na repo'])
  if (!M.includes(h)) fail('docs/MOC.md has no section "' + h + '"');

// D. Clean repo
const files = git('ls-files').split('\n').filter(Boolean);
const ROOT_OK = new Set(['.claude', '.gitattributes', '.github', '.gitignore', '.prettierignore', '.prettierrc', 'CLAUDE.md', 'HANDOFF.md', 'README.md', 'RULES.md',
  'delivery', 'docs', 'document-references', 'package-lock.json', 'package.json', 'src', 'tests', 'tools', 'vite.config.mjs']);
for (const top of new Set(files.map(f => f.split('/')[0]))) if (!ROOT_OK.has(top)) fail('"' + top + '" at the top of the repo: put it in its folder (docs, tools, tests, src, delivery)');
for (const f of files) {
  if (/^dist\//.test(f) || /logic-sim-v[^/]*\.html$/.test(f)) fail(f + ': the built html is not kept in git');
  if (/\.(log|tmp|orig|rej|bak|swp)$|(^|\/)(\.DS_Store|Thumbs\.db|desktop\.ini)$|(^|\/)node_modules\//i.test(f)) fail(f + ': a junk file');
  if (/\.(jks|keystore|p12|pfx|pem|key)$|(^|\/)\.env(\.|$)/i.test(f)) fail(f + ': a key or secret file (keys live in the GitHub secrets)');
  let st;
  try {
    st = fs.statSync(path.join(root, f));
  } catch (e) {
    continue;
  }
  if (st.size > 6 * 1024 * 1024) fail(f + ': ' + (st.size / 1048576).toFixed(1) + ' MB, over 6 MB');
}
const grep = re => {
  try {
    return git('grep', '-nIE', '-e', re).split('\n').filter(Boolean);
  } catch (e) {
    return []; // no match
  }
};
// an IPv4 address of a network: a private range, or any part over 99 (a section number such as 5.3.2.2 is not one); loopback is fine
for (const l of grep('\\b([0-9]{1,3}\\.){3}[0-9]{1,3}\\b')) {
  const ips = l.slice(l.indexOf(':', l.indexOf(':') + 1) + 1).match(/(?<![\d.])(\d{1,3}\.){3}\d{1,3}(?![\d.])/g) || [];
  for (const ip of ips) {
    const o = ip.split('.').map(Number);
    if (ip === '127.0.0.1' || ip === '0.0.0.0' || o.some(x => x > 255)) continue;
    if (o[0] === 10 || (o[0] === 172 && o[1] >= 16 && o[1] <= 31) || (o[0] === 192 && o[1] === 168) || o.some(x => x > 99))
      fail(l.split(':').slice(0, 2).join(':') + ': an IP address (' + ip + '): plant network addresses never go into this public repo');
  }
}
for (const l of grep('-----BEGIN [A-Z ]*PRIVATE KEY-----|ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|AKIA[0-9A-Z]{16}|(password|passwd|pwd)[[:space:]]*[:=][[:space:]]*["\'][^"\'$ ]{4,}'))
  fail(l.split(':').slice(0, 2).join(':') + ': looks like a password, token or private key');

// the phase row names this gate
if (!/^\| 15 \|.*tests\/lanes\/qa\/phase15-gate\.cjs/m.test(rd('docs/PHASES.md'))) fail('docs/PHASES.md row 15 does not name tests/lanes/qa/phase15-gate.cjs');

console.log((bad ? 'FAIL' : 'PASS') + ' phase15-gate: ' + r.n + ' controlled items, ' + r.changes + ' changes, version ' + V + ', ' + wf.length + ' workflows, ' + files.length + ' files');
process.exit(bad ? 1 : 0);
