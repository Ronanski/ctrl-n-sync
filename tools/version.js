// prints the version of the simulator (src/version.txt); the html is dist/logic-sim-v<version>.html (node tools/build/build.js makes it, it is
// not in git); --github writes version/tag/html to $GITHUB_OUTPUT
const fs = require('fs'),
  path = require('path');
const v = fs.readFileSync(path.join(__dirname, '..', 'src', 'version.txt'), 'utf8').trim();
if (!/^\d+\.\d+\.\d+(?:-beta\.\d+)?$/.test(v)) {
  console.error('src/version.txt is not a version: ' + v);
  process.exit(1);
}
if (process.argv.includes('--github') && process.env.GITHUB_OUTPUT)
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `version=${v}\ntag=v${v}\nhtml=logic-sim-v${v}.html\n`);
console.log(v);
