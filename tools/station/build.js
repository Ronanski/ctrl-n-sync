// Builds the page of the app: the built simulator html plus the station frame (src/station).
// The simulator html itself is not changed.
// usage: node tools/station/build.js <built logic-sim html> <out dir | out file .html>
//        node tools/station/build.js --version          prints the version of the app (delivery/app/app.json)
//        node tools/station/build.js --file             prints the file name stem of a release, e.g. LMYP-OTS-1.0.0-beta.1
//   out dir  -> <out dir>/<NAME>-<version>.html
//   out file -> that file (the site and the apk / exe use index.html)
// The app has its own version (delivery/app/app.json "version": 1.0.0-beta.1, 1.0.0-beta.2, ..., 1.0.0, then 1.0.1-beta.1 ...);
// the simulator inside keeps its own (src/version.txt), which a save point is checked against.
// What differs from the simulator html, besides the frame:
//   - the <title> says "Logic Sim v<version of the app>": the update check of the page reads the installed version, and tells a
//     complete download, from this exact form, so the words "Logic Sim" stay; the name the user sees is set by the frame at start;
//   - the address the update check and the channel switch ask becomes the site of this app, so it updates from its own pages
//     (/ Stable, /beta/ Beta);
//   - the tab icon and the theme colour are the app's.
const fs = require('fs'),
  path = require('path');
const APP = require('../../delivery/app/app.json'),
  NAME = APP.display || APP.name,
  VER = APP.version,
  STEM = APP.name.replace(/[^A-Za-z0-9]+/g, '-') + '-' + VER,
  SITE = "'https://ronanski.github.io/icms-master-tool/'";
if (!/^\d+\.\d+\.\d+(-beta\.\d+)?$/.test(VER || ''))
  throw new Error('delivery/app/app.json: version must be X.Y.Z or X.Y.Z-beta.N, found ' + VER);
if (process.argv[2] === '--version') {
  console.log(VER);
  process.exit(0);
}
if (process.argv[2] === '--file') {
  console.log(STEM);
  process.exit(0);
}
const root = path.resolve(__dirname, '..', '..'),
  src = process.argv[2],
  out = path.resolve(process.argv[3] || '.');
if (!src) throw new Error('usage: node tools/station/build.js <built logic-sim html> <out dir | out file .html>');
let h = fs.readFileSync(src, 'utf8');
const css = fs.readFileSync(path.join(root, 'src/station/station.css'), 'utf8'),
  frame = fs.readFileSync(path.join(root, 'src/station/station-frame.css'), 'utf8'),
  js = fs.readFileSync(path.join(root, 'src/station/station.js'), 'utf8'),
  png = n =>
    'data:image/png;base64,' +
    fs.readFileSync(path.join(root, 'delivery/app/icons/png/icon-' + n + '.png')).toString('base64');
const swap = (re, to, what) => {
  if (!re.test(h)) throw new Error(what + ' not found in ' + src);
  h = h.replace(re, to);
};
const sim = (h.match(/<title>Logic Sim v(\d+(?:\.\d+)+(?:-beta\.\d+)?)<\/title>/) || [])[1];
if (!sim) throw new Error('<title>Logic Sim v...</title> not found in ' + src);
/* an EA build inside the apk / exe (file: or https://localhost) starts on the Beta channel: without this the update check of the
   page would ask for a Stable only, and an EA install would never hear of the next EA. The user's own choice, once made, stays. */
const EA =
  '<script>try{if(/-beta\\./.test(document.title)&&(location.protocol==="file:"||(location.protocol==="https:"&&location.hostname==="localhost"&&!location.port))&&!localStorage.getItem("logic.channel"))localStorage.setItem("logic.channel","beta")}catch(e){}</script>';
/* the station flag before any script of the simulator: the old shell (cr.js) builds its layout on every width under the station */
swap(/<title>Logic Sim v[^<]*<\/title>/, '<title>Logic Sim v' + VER + '</title>' + EA + '<script>window.LS_STATION=1</script>', 'title');
const i = h.lastIndexOf('</body>');
if (i < 0) throw new Error('no </body> in ' + src);
h =
  h.slice(0, i) +
  '<style id="stationcss">' +
  css +
  '</style><script id="stationjs">window.LS_STATION=1;window.LS_STATION_NAME=' +
  JSON.stringify(NAME) +
  ';window.LS_STATION_VER=' +
  JSON.stringify('v' + VER) +
  ';window.LS_STATION_SIM=' +
  JSON.stringify('v' + sim) +
  ';window.LS_STATION_CSS=' +
  JSON.stringify(frame).split('</').join('<\\/') +
  ';' +
  js.split('</script').join('<\\/script') +
  '</script>' +
  h.slice(i);
const n = h.split(SITE).length - 1;
if (!n) throw new Error('the site address of the update check was not found in ' + src);
h = h.split(SITE).join("'" + APP.site + "'");
swap(/<link rel="icon"[^>]*>/, '<link rel="icon" type="image/png" sizes="64x64" href="' + png(64) + '">', 'tab icon');
swap(/<link rel="apple-touch-icon"[^>]*>/, '<link rel="apple-touch-icon" href="' + png(192) + '">', 'touch icon');
swap(/<meta name="theme-color"[^>]*>/, '<meta name="theme-color" content="#0a0a0b">', 'theme colour');
const f = /\.html$/i.test(out) ? out : path.join(out, STEM + '.html');
fs.mkdirSync(path.dirname(f), { recursive: true });
fs.writeFileSync(f, h);
console.log('built', f, h.length, '| app v' + VER, '| simulator v' + sim, '| site address changed in', n, 'places');
