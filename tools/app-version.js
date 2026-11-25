// The version of the app (lane plan 2026-11-25: no PR carries a version number). delivery/app/app.json says:
//   "X.Y.Z-beta" -> X.Y.Z-beta.N, N = the commit count of main (git rev-list --count): every merge raises it by itself (above 1250, the last written one was 587),
//                   so a PR never renumbers because another one was merged before it. On a branch it is only a label of a test build.
//   "X.Y.Z"      -> that Final (Stable), exactly as written
// No git (a copy of the files) -> N = 0. A shallow clone would count wrong: an error (checkout with fetch-depth 0).
const { execFileSync } = require('child_process'),
  path = require('path');
const root = path.resolve(__dirname, '..');
module.exports = function appVersion() {
  const v = require('../delivery/app/app.json').version;
  if (/^\d+\.\d+\.\d+$/.test(v || '')) return v;
  if (!/^\d+\.\d+\.\d+-beta$/.test(v || '')) throw new Error('delivery/app/app.json: version must be X.Y.Z-beta (the number comes from git) or X.Y.Z, found ' + v);
  const git = (...a) => execFileSync('git', ['-C', root, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  let shallow;
  try {
    shallow = git('rev-parse', '--is-shallow-repository');
  } catch (e) {
    return v + '.0';
  }
  if (shallow === 'true') throw new Error('app version: a shallow clone has no commit count (actions/checkout with fetch-depth: 0)');
  return v + '.' + git('rev-list', '--count', 'HEAD');
};
