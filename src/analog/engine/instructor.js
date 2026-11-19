/* ===== INSTRUCTOR TOOLS (user "go all" 2026-11-19, item 6: grouped malfunctions, freeze) =====
   Nothing here makes a fault or a result. The faults stay those of engine/faults.js (AN.fault) and world.js (WORLD.ftrip); this file only
   sorts them by the plant system they belong to, so the instructor finds them by system, and gives the instructor a FREEZE.
   AN.faultGroups() -> [{ g: 'Air and flue gas', items: [{ id, t, on, src: 'an' | 'world' }] }, ...], the groups in the order of the plant
                       (fuel, air and gas, water and steam, turbine side, electrical, then instruments and valves); every fault of the two
                       lists is in exactly one group ('Other' only for a fault added later without a group here).
                       A fault is put on / cleared as before: src 'an' -> AN.fault(id, on), src 'world' -> WORLD.ftrip(id, on).
   AN.freeze(on, why) -> the plant time stops (the Pause of the app) and Run is refused until the instructor takes the freeze off
                       (trace.js Run checks AN.frz). '' or the reason it was refused. AN.freeze() -> { on, at (plant s), why }.
                       The freeze of a training simulator: the instructor holds the plant to explain, the trainee cannot run it on. */
const AN_FG_ORDER = [
  'Coal and limestone',
  'Air and flue gas',
  'Boiler',
  'Feedwater and condensate',
  'Turbine and condenser',
  'Seawater cooling',
  'Electrical and generator',
  'Instruments (transmitters)',
  'Control valves',
  'Interlock bypass (I&C)',
  'Other'
];
/* the system of each fault, by its id (the machine tags of the fault texts: P1115 feedwater, F105x fans, CL1061 coal feeder,
   P1116 condensate, P1501 seawater) */
function anFaultGroup(id, g) {
  id = String(id);
  if (/^cf\./.test(id) || id === 'mt.cfa') return 'Coal and limestone';
  if (/^mt\.(paf|saf|idf|faa)$/.test(id) || /^aph\./.test(id)) return 'Air and flue gas';
  if (/^tl\./.test(id)) return 'Boiler';
  if (/^mt\.(bfwp|cep)/.test(id) || /^hl\./.test(id)) return 'Feedwater and condensate';
  if (id === 'cd.air') return 'Turbine and condenser';
  if (/^mt\.swp/.test(id)) return 'Seawater cooling';
  if (/^el\./.test(id) || id === 'grid.lo' || /^gen\./.test(id)) return 'Electrical and generator';
  if (/^ai\./.test(id) || g === 'ai') return 'Instruments (transmitters)';
  if (/^cv\./.test(id) || g === 'cv') return 'Control valves';
  if (/^ib\./.test(id) || g === 'ib') return 'Interlock bypass (I&C)';
  return 'Other';
}
AN.faultGroups = () => {
  const call = (f, d) => {
    try {
      return f() || d;
    } catch (e) {
      return d;
    }
  };
  const A = call(() => AN.fault(), []).map(f => Object.assign({}, f, { src: 'an' })),
    B = call(() => (typeof WORLD !== 'undefined' && WORLD.ftrip ? WORLD.ftrip() : []), []).map(f => Object.assign({}, f, { src: 'world' })),
    M = {};
  for (const f of A.concat(B)) {
    const k = anFaultGroup(f.id, f.g);
    (M[k] = M[k] || []).push({ id: f.id, t: f.t, on: !!f.on, src: f.src });
  }
  return AN_FG_ORDER.filter(k => M[k]).map(k => ({ g: k, items: M[k] }));
};
AN.frz = null;
AN.freeze = (on, why) => {
  if (on === undefined) return AN.frz ? Object.assign({}, AN.frz) : { on: false, at: null, why: '' };
  const ev = m => {
    try {
      if (window.lsEventAdd) lsEventAdd('INSTRUCTOR', 'INSTRUCTOR', m);
    } catch (e) {}
  };
  if (on) {
    if (AN.frz) return '';
    if (!(AN.unit && AN.unit.on)) return 'FREEZE: no plant is running (pick a starting point first)';
    AN.frz = { on: true, at: Math.round(anPlantT() * 10) / 10, why: String(why || '') };
    if (AN.pauseOn) AN.pauseOn();
    ev('Instructor: FREEZE' + (why ? ' (' + why + ')' : '') + ': the plant is held');
    return '';
  }
  if (!AN.frz) return '';
  AN.frz = null;
  ev('Instructor: FREEZE off: press Run to go on');
  return '';
};
