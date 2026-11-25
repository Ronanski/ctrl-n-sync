// Lane plan 2026-11-25 (ten lanes merge in parallel): a PR carries no version number and no built html.
//   1. the built html is not in git (dist/ is ignored; the Checks, the site and the release build it from the sources)
//   2. delivery/app/app.json keeps "X.Y.Z-beta": the beta number is counted by git (tools/app-version.js); the Final X.Y.Z only on GO STABLE
//   3. a branch that changes the app (src, tools, tests, delivery, .github) adds a short report of its own:
//      docs/versions/updates/<lane>-<topic>.md (or, on a PR opened before, docs/versions/v<version>/UPDATE_REPORT.md)
// Needs the history (checkout fetch-depth 0) and origin/main.
const fs = require('fs'),
  { execSync } = require('child_process');
const sh = c => execSync(c, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const bad = m => (console.error('VERSION CHECK: ' + m), process.exit(1));
const html = sh('git ls-files dist');
if (html) bad('the built html is in git (' + html + '): git rm --cached it, the build makes it');
const V = JSON.parse(fs.readFileSync('delivery/app/app.json', 'utf8')).version;
if (!/^\d+\.\d+\.\d+(-beta)?$/.test(V)) bad('delivery/app/app.json version is ' + V + ': keep the one of main, "X.Y.Z-beta" (the number is counted by git)');
const appV = require('./app-version.js')();
const br = process.env.GITHUB_REF_NAME || sh('git rev-parse --abbrev-ref HEAD');
if (br === 'main') {
  console.log('app version ' + appV);
  process.exit(0);
}
let ch;
try {
  ch = sh('git diff --name-only origin/main...HEAD').split('\n').filter(Boolean);
} catch (e) {
  bad('no common history with origin/main (checkout with fetch-depth 0, git fetch origin main)');
}
const app = ch.filter(f => /^(src|tools|tests|delivery|\.github)\//.test(f));
if (!app.length) {
  console.log('no app change against main');
  process.exit(0);
}
const rep = sh('git diff --name-only --diff-filter=AR origin/main...HEAD -- docs/versions')
  .split('\n')
  .filter(f => /^docs\/versions\/(updates\/(?!README)[^/]+\.md|v[^/]+\/UPDATE_REPORT\.md)$/.test(f) && fs.existsSync(f) && fs.readFileSync(f, 'utf8').trim());
if (!rep.length) bad('the branch changes the app (' + app.length + ' files) and adds no report: write docs/versions/updates/<lane>-<topic>.md');
console.log(app.length + ' app files changed, report ' + rep.join(', ') + '; this build is labelled ' + appV);
