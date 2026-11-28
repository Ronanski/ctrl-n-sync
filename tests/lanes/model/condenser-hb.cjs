/* Phase 11 condenser (MEI, 2026-11-28, rule 0): the condenser back pressure of unit.js (the tube law anCdUA + the exchanger law of
   anCondStep + anPsat) against the condenser pressure of ALL 8 cases of the turbine heat balance HB PPE-14-0725 R1 (YUA PC read
   2026-11-27, /mnt/project-files/turbine-hb-read-2026-11-27.md). The condenser vendor has no back pressure curve (K2MC3A O&M, D1-039 R0 /
   R1, D1-066: NOT IN DOCS, mei-condenser-vendor-reads-2026-11-28.md), so the HB condenser pressure per case is the design curve
   the turbine vendor set for this condenser at the design sea water (K2MC3A O&M Sect 1 p3: 30 C, 31,500 t/h; at case 1 the HB 0.070
   ata = the O&M 68.6 mbar). For each case the steam that comes in is what the turbine model gives (turbine.js tbPath with the HB
   inputs, as tests/lanes/model/turbine-hb.cjs): the LP exhaust flow and enthalpy, plus the LP heater drains (the HB No.3 + No.2 +
   No.1 LP extractions + the SSR spill-over, which cascade to the No.1 LP heater and go to the condenser) at 6.95 C above the condenser
   saturation (DERIVED, D1-039 R1 p4: LPH drain 45.6 C at the 38.65 C shell). The model's own functions are read out of unit.js (no
   copy). Fails beyond 0.003 ata (4 % of case 1, about 1.2 C of saturation: half the HB step between two cases). */
const fs = require('fs'),
  path = require('path'),
  vm = require('vm');
const root = path.resolve(__dirname, '..', '..', '..');
const ctx = {};
vm.createContext(ctx);
for (const f of ['steam.js', 'turbine.js']) vm.runInContext(fs.readFileSync(path.join(root, 'src/analog/engine', f), 'utf8'), ctx);
/* the top-level declarations of unit.js the condenser pressure is made of, taken out by name: from "const NAME" / "function NAME"
   to its end at depth 0 (a ";" for a const, the closing brace for a function), strings and comments skipped */
const UNIT = fs.readFileSync(path.join(root, 'src/analog/engine/unit.js'), 'utf8');
const take = name => {
  const m = new RegExp('^(const|function) ' + name + '\\b', 'm').exec(UNIT);
  if (!m) throw new Error('condenser-hb: ' + name + ' not found in unit.js');
  const fn = m[1] === 'function';
  let d = 0, i = m.index;
  for (; i < UNIT.length; i++) {
    const c = UNIT[i], n = UNIT[i + 1];
    if (c === '/' && n === '*') { i = UNIT.indexOf('*/', i + 2) + 1; continue; }
    if (c === '/' && n === '/') { i = UNIT.indexOf('\n', i); continue; }
    if (c === "'" || c === '"' || c === '`') { let j = i + 1; while (UNIT[j] !== c) j += UNIT[j] === '\\' ? 2 : 1; i = j; continue; }
    if ('([{'.includes(c)) d++;
    else if (')]}'.includes(c)) { d--; if (fn && d === 0 && c === '}') break; }
    else if (!fn && d === 0 && c === ';') break;
  }
  return UNIT.slice(m.index, i + 1).replace(/^const /, 'var ');
};
vm.runInContext(['AN_CD', 'AN_CDU', 'anPsat', 'anCdHw2', 'anCdUA'].map(take).join('\n'), ctx);
/* the HB cases as printed: the table of tests/lanes/model/turbine-hb.cjs (one copy of the test data) */
const HB = vm.runInNewContext('(' + /const HB = (\{[\s\S]*?\n\});/.exec(fs.readFileSync(path.join(__dirname, 'turbine-hb.cjs'), 'utf8'))[1] + ')');
const SSR = { 1: 1027, 2: 764, 3: 503, 4: 328, 5: 167, 6: 4, 7: 0, VWO: 1079 };
const TIN = 30,
  CW = 31500 /* K2MC3A O&M Sect 1 p3: design sea water */,
  DT_DR = 45.6 - 38.65 /* D1-039 R1 p4 */;
let bad = 0;
for (const k of Object.keys(HB)) {
  const [ms, Pms, Tms, hrh, Phr, Thr, Pcr, Tcr, x, Ps, Pc] = HB[k];
  ctx.I = { ms: ms / 1000, Pin: Pms, Tms, qip: hrh / 1000, Thr, Pc, w: { hp6: x[0] / 1000, hp5: x[1] / 1000, da: x[2] / 1000, lp3: x[3] / 1000, lp2: x[4] / 1000, lp1: x[5] / 1000 } };
  ctx.MD = (x[3] + x[4] + x[5] + SSR[k]) / 1000;
  ctx.TIN = TIN;
  ctx.CW = CW;
  ctx.DT = DT_DR;
  /* anCondStep at steady state: C = W / 3.6 cp, UA at the mean water temperature, Ts = Tin + Q / (C (1 - exp(-UA / C))); the
     duty first law as anCdDuty (h_f at Ts) */
  const r = vm.runInContext(`(()=>{let o=null;for(let i=0;i<12;i++)o=tbPath(I,o);
    const hf=T=>steamR1(0.0980665*1.0332,T+273.15).h, C=CW/3.6*AN_CD.cp;let Ts=AN_CD.Tref,Q=0;
    for(let i=0;i<30;i++){Q=o.exh.m/3.6*(o.exh.h-hf(Ts))+MD/3.6*(hf(Ts+DT)-hf(Ts));const UA=anCdUA(1,CW,TIN+Q/(2*C));Ts=TIN+Q/(C*(1-Math.exp(-UA/C)));}
    return {Ts,Q,P:anPsat(Ts),m:o.exh.m}})()`, ctx);
  const e = r.P - Pc,
    ok = Math.abs(e) <= 0.003;
  if (!ok) bad++;
  console.log(`${k.padEnd(4)}exhaust ${r.m.toFixed(1)} T/H, duty ${(r.Q / 1000).toFixed(1)} MW, Ts ${r.Ts.toFixed(2)} C, P ${r.P.toFixed(4)} / HB ${Pc} ata ${e >= 0 ? '+' : ''}${e.toFixed(4)}${ok ? '' : ' FAIL'}`);
}
console.log(bad ? 'condenser-hb: ' + bad + ' cases off the heat balance condenser pressure' : 'condenser-hb: the condenser gives the HB condenser pressure in all 8 cases');
process.exit(bad ? 1 : 0);
