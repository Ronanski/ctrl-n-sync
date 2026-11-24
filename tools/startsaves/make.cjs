// Makes src/data/stwarm.txt and src/data/sthot.txt: the starts "Warm" and "Hot" of the start screen (RULES Q3: Warm and Hot come from a
// trip at 150 MW that the physics cooled, not from fixed numbers). Each is a save point made by real clicks on the app (team-files/saves):
// the unit tripped at 150 MW, bottled up and held by the operator until the HP turbine metal reached the band of the ATS (TCS) mode.
// Usage: node tools/startsaves/make.cjs <warm save .json> <hot save .json>
const fs = require('fs'), zlib = require('zlib');
const [warm, hot] = process.argv.slice(2);
if (!warm || !hot) throw new Error('usage: node tools/startsaves/make.cjs <warm.json> <hot.json>');
for (const [k, f] of [['warm', warm], ['hot', hot]]) {
  const s = JSON.parse(fs.readFileSync(f, 'utf8'));
  if (!s.kf || !s.kd) throw new Error(f + ' is not a save point');
  const o = { kf: s.kf, kd: s.kd, ver: s.ver || '', name: s.name, at: s.at, flt: s.flt || { an: [], w: [] } };
  const txt = zlib.gzipSync(JSON.stringify(o), { level: 9 }).toString('base64');
  fs.writeFileSync('src/data/st' + k + '.txt', txt);
  console.log('written src/data/st' + k + '.txt', txt.length, 'chars,', s.name, s.ver);
}
