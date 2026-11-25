// The analog ENGINE alone as one script (3.2.0 Web Worker, stage a): the reader and engine files of src/analog/order.list in their order
// (the scheduler engine/sched.js is the page's), inside one closure like the page bundle, with the few page hooks the engine calls, in
// their engine form: AN.lnSrc (the LINEAR data), AN.reset (anResetAll + 6 scans of the current sheet, loader.js reset), AN.settle
// (6 scans of the current sheet, panel.js settle), AN.plantSwitch (plant-window.js, engine part). No DOM.
// bundle({aln}) -> code; the code defines globalThis.ENGINE = { AN, E: { ensure, stepSet, ... } }. Used by the worker build (stage d)
// and by tests/regress/eng_headless.js.
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..', '..'), A = path.join(root, 'src', 'analog');
function files() {
  return fs.readFileSync(path.join(A, 'order.list'), 'utf8').split(/\r?\n/).map(s => s.trim())
    .filter(s => s && s[0] !== '#' && /^(reader|engine)\//.test(s) && s !== 'engine/sched.js');
}
/* the TCE / TCA sheets and their reader (the sheets that drive: engine/tcs-sheets.js). In the page they are in the digital script and the
   template; the world bundle has the sheets in the digital files */
const tceRun = () => '/* ---- src/digital/tce-run.js ---- */\n' + fs.readFileSync(path.join(root, 'src', 'digital', 'tce-run.js'), 'utf8') + '\n';
function tceAlone() {
  const D = path.join(root, 'src', 'digital');
  return fs.readFileSync(path.join(D, 'order.list'), 'utf8').split(/\r?\n/).map(s => s.trim()).filter(s => /^tce\//.test(s))
    .map(f => fs.readFileSync(path.join(D, f), 'utf8')).join('\n') + '\n' + tceRun();
}
function bundle(o) {
  o = o || {};
  const aln = o.aln != null ? o.aln : fs.readFileSync(path.join(root, 'src', 'data', 'aln.json'), 'utf8').trim();
  const body = files().map(f => {
    let s = fs.readFileSync(path.join(A, f), 'utf8');
    /* the page bundle opens its closure in the first file (reader/dxf.js) and closes it in boot.js */
    if (f === 'reader/dxf.js') s = s.replace(/^\(function\(\)\{/, '');
    return '/* ---- ' + f + ' ---- */\n' + s;
  }).join('\n');
  /* the AN of the page (ui/main.js), the fields the engine reads */
  const core = 'const AN={cat:"an",sheets:[],i:-1,run:false,spd:1,ramp:0,sv:{},lne:{},av:{},ws:{},plantUi:{}};\n' +
    'Object.defineProperty(AN,"ln",{get:()=>globalThis.ANLN||{},set:v=>{globalThis.ANLN=v}});\n';
  const hooks = 'Object.assign(AN,anEngAPI());\n' +
    'AN.lnSrc=()=>(' + aln + ');\n' +
    /* the descriptions (engine/ds.js ADES): the host puts them in (the page: data/loader.js adesLoad from its #ades data) */
    'AN.ades=()=>Promise.resolve(ADES||{});AN.adesPut=d=>{ADES=d};\n' +
    'const anCur=()=>AN.sheets[AN.i]||AN.sheets.find(x=>/057/.test(x.name));\n' +
    'AN.reset=()=>{anResetRun();const c=anCur();if(c&&c.S)for(let i=0;i<6;i++)stepSet(c,0)};\n' +
    'AN.settle=()=>{const c=anCur();if(c&&c.S)for(let i=0;i<6;i++)stepSet(c,0)};\n' +
    'AN.plantSwitch=on=>{AN.plantOn=!!on;for(const sh of AN.sheets){if(!sh.S)continue;for(const b of sh.S.procs||[])if(b.proc)b.proc.on=!!on;if(!on){sh.S.rt.pm={};sh.S.plantT=null;sh.S._rem=0}}};\n' +
    'globalThis.ENGINE={AN,E:{ensure,stepSet,anResetAll,anPlantLoad150,anPlantCold}};\n';
  return (o.world ? '' : tceAlone()) + '(function(){\n' + core + body + '\n;\n' + hooks + '})();\n';
}
/* 3.2.0 Web Worker, stage b: the whole engine, the one world: the DITL engine parts of src/digital/order.list (up to 03e-user.js:
   parse, netlist, models, simulation, reader, keyframe, panel settings; one global script as in the page), the analog engine above (its AN on globalThis, as
   ui/main.js puts it on window), then src/world/world.js, plantsw.js, ditl150.js, eng.js (the radio) and dock-eng.js (the dock press). The host gives msg (the page: the toast). */
function dFiles() {
  const D = path.join(root, 'src', 'digital');
  const l = fs.readFileSync(path.join(D, 'order.list'), 'utf8').split(/\r?\n/).map(s => s.trim()).filter(s => s && s[0] !== '#');
  return l.slice(0, l.indexOf('parts/03e-user.js') + 1).map(f => path.join(D, f));
}
function wiringSlim() {
  const vm = require('vm'), w = {};
  vm.runInNewContext(fs.readFileSync(path.join(root, 'src', 'ui', 'plant', 'wiring.js'), 'utf8'), { window: w });
  const rows = (w.WIRING || []).filter(x => /^[IO]\.[0-9A-F]{4}$/.test(x[2]) && x[3]).map(x => [x[0], x[1], x[2], x[3]]);
  return '/* ---- src/ui/plant/wiring.js (slim: I/O rows, station, address, tag) ---- */\nwindow.WIRING=' + JSON.stringify(rows) + ';\n';
}
/* PR 0 (lane plan 2026-11-25, docs/audit/lane-plan-content-first-2026-11-25.md): the lane-owned data, one JSON per lane or group, read
   at build time in file-name order: src/world/bind/*.json (LANE_BIND: extra I/O rows and extra FROM references for the same linker),
   src/world/inst/*.json (LANE_INST: unit instances of a sheet from data), src/data/alarms/*.json (LANE_ALARMS: alarm rows with
   priority). An empty folder gives empty lists: the app runs as before. See the README.md in each folder for the row format. */
function laneData() {
  const rdDir = (d, f) => {
    const D = path.join(root, ...d.split('/'));
    if (!fs.existsSync(D)) return [];
    return fs.readdirSync(D).filter(x => /\.json$/.test(x)).sort().map(x => {
      let j;
      try { j = JSON.parse(fs.readFileSync(path.join(D, x), 'utf8')); } catch (err) { throw new Error(d + '/' + x + ': ' + err.message); }
      return f(x.replace(/\.json$/, ''), j);
    });
  };
  const bind = [].concat(...rdDir('src/world/bind', (lane, j) => (Array.isArray(j) ? j : j.rows || []).map(r => Object.assign({ lane }, r))));
  const inst = [].concat(...rdDir('src/world/inst', (set, j) => (Array.isArray(j) ? j : [j]).map(r => Object.assign({ set }, r))));
  const alarms = [].concat(...rdDir('src/data/alarms', (group, j) => (Array.isArray(j) ? j : j.rows || []).map(r => Object.assign({ group }, r))));
  /* beta.470: the field signal modules, src/world/field/<lane>.js (read-only getters of the engine state, src/world/field/README.md) */
  const FD = path.join(root, 'src', 'world', 'field');
  const field = fs.existsSync(FD)
    ? fs.readdirSync(FD).filter(x => /\.js$/.test(x)).sort().map(x => '/* ---- src/world/field/' + x + ' ---- */\n(function (lane, FIELD) {\n' + fs.readFileSync(path.join(FD, x), 'utf8') + '\n})(' + JSON.stringify(x.replace(/\.js$/, '')) + ', window.FIELD);\n').join('')
    : '';
  return (
    '/* ---- lane data (src/world/bind, src/world/inst, src/data/alarms, src/world/field) ---- */\nwindow.LANE_BIND=' + JSON.stringify(bind) + ';window.LANE_INST=' + JSON.stringify(inst) + ';window.LANE_ALARMS=' + JSON.stringify(alarms) + ';\n' +
    'window.FIELD={rows:[],states:[],add:function(lane,rows){for(const r of rows||[])this.rows.push(Object.assign({lane:lane},r))},state:function(lane,rows){for(const r of rows||[])this.states.push(Object.assign({lane:lane},r,{id:"fs."+r.id}))}};\n' +
    field
  );
}
function worldBundle(o) {
  const rd = f => fs.readFileSync(f, 'utf8');
  const an = bundle(Object.assign({}, o, { world: 1 })).replace('globalThis.ENGINE=', 'globalThis.AN=AN;globalThis.ENGINE=');
  return (
    /* the file name with / on every OS (built on Windows it was src\digital\..., another html than the Linux build of the CI) */
    dFiles().map(f => '/* ---- ' + path.relative(root, f).split(path.sep).join('/') + ' ---- */\n' + rd(f)).join('\n') +
    '\n;globalThis.DITL={get S(){return S},set S(v){S=v},get SIM(){return SIM},set SIM(v){SIM=v},get MST(){return MST},get MS(){return MS},get DREG(){return DREG},ditlStates,ditlCapture,ditlApply,simSheet,netlist};\n' +
    tceRun() +
    an +
    /* 3.2.1 (Mina beta.170: page 17 '52G1 off' stayed N in Worker mode): world.js links rows by the tag of the I/O list (window.WIRING:
       DITL-03H row 18 MIG-52G1-2 = I.0932, the sootblower starters MOR / MOS). The page list (src/ui/plant/wiring.js, 0.9 MB) is not in the
       worker: a slim copy with the station, the address and the tag of the I/O rows (the only columns world.js reads) */
    wiringSlim() +
    laneData() +
    ['world.js', 'plantsw.js', 'ditl150.js', 'eng.js', 'dock-eng.js'].map(f => '/* ---- src/world/' + f + ' ---- */\n' + rd(path.join(root, 'src', 'world', f))).join('\n')
  );
}
module.exports = { bundle, files, worldBundle, laneData };
if (require.main === module) process.stdout.write(bundle());
