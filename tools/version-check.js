// Full Audit 3 ranking 7: every merge raises the app version (delivery/app/app.json) and carries a short report,
// docs/versions/v<version>/UPDATE_REPORT.md. Run on a branch with origin/main fetched: when the branch changes the app
// (src, tools, tests, dist, delivery, .github), its version must be higher than the one on main and its report must be there.
// On main itself (the merge is done) it only checks that the report of the version on main is there.
const fs = require('fs'),
  { execSync } = require('child_process');
const sh = c => execSync(c, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const parse = v => {
  const m = /^(\d+)\.(\d+)\.(\d+)(?:-beta\.(\d+))?$/.exec(v || '');
  if (!m) throw new Error('not a version: ' + v);
  /* a final (no -beta) is above every beta of the same X.Y.Z */
  return [+m[1], +m[2], +m[3], m[4] === undefined ? Infinity : +m[4]];
};
const cmp = (a, b) => {
  for (let i = 0; i < 4; i++) if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  return 0;
};
const V = JSON.parse(fs.readFileSync('delivery/app/app.json', 'utf8')).version;
const rep = 'docs/versions/v' + V + '/UPDATE_REPORT.md';
const bad = m => (console.error('VERSION CHECK: ' + m), process.exit(1));
if (!fs.existsSync(rep) || !fs.readFileSync(rep, 'utf8').trim()) bad('no update report for v' + V + ' (' + rep + ')');
const br = process.env.GITHUB_REF_NAME || sh('git rev-parse --abbrev-ref HEAD');
if (br === 'main') {
  console.log('version v' + V + ' on main, report ' + rep);
  process.exit(0);
}
let mv;
try {
  mv = JSON.parse(sh('git show origin/main:delivery/app/app.json')).version;
} catch (e) {
  bad('origin/main not fetched (git fetch origin main)');
}
const ch = sh('git diff --name-only origin/main HEAD -- src tools tests dist delivery .github')
  .split('\n')
  .filter(Boolean);
if (!ch.length) {
  console.log('no app change against main: v' + V);
  process.exit(0);
}
if (cmp(parse(V), parse(mv)) <= 0) bad('the branch changes the app (' + ch.length + ' files) but its version v' + V + ' is not above main v' + mv + ': raise delivery/app/app.json and write ' + 'docs/versions/v<new>/UPDATE_REPORT.md');
console.log('version v' + mv + ' (main) -> v' + V + ', report ' + rep);
