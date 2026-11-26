/* ===== FAULT GROUPS (user "go all" 2026-11-19, item 6: grouped malfunctions; audit #6 2026-11-24: the instructor hold is gone, Pause
   holds the plant, and the Instructor button is now the Plant menu of the station)
   Nothing here makes a fault or a result. The faults stay those of engine/faults.js (AN.fault) and world.js (WORLD.ftrip); this file only
   sorts them by the plant system they belong to, so the Plant menu lists them by system.
   AN.faultGroups() -> [{ g: 'Air and flue gas', items: [{ id, t, on, src: 'an' | 'world' }] }, ...], the groups in the order of the plant
                       (fuel, air and gas, water and steam, turbine side, electrical, then instruments and valves); every fault of the two
                       lists is in exactly one group ('Other' only for a fault added later without a group here).
                       A fault is put on / cleared as before: src 'an' -> AN.fault(id, on), src 'world' -> WORLD.ftrip(id, on). */
const AN_FG_ORDER = [
  'Coal and limestone',
  'Air and flue gas',
  'Boiler',
  'Feedwater and condensate',
  'Turbine and condenser',
  'Seawater cooling',
  /* 2026-11-27: the field states of the BOP packages (src/world/field/bop.js, ditl.js) had no group and sat in Other */
  'Chemical dosing',
  'Water, waste water and fire',
  'Compressed air',
  'Electrical and generator',
  'Instruments (transmitters)',
  'Control valves',
  'Interlock bypass (I&C)',
  'Other'
];
/* the system of each fault, by its id (the machine tags of the fault texts: P1115 feedwater, F105x fans, CL1061 coal feeder,
   P1116 condensate, P1501 seawater) */
function anFaultGroup(id, g, fg) {
  id = String(id);
  if (g === 'fs') return AN_FG_ORDER.includes(fg) ? fg : 'Other'; /* a field state names its own group (src/world/field) */
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
    const k = anFaultGroup(f.id, f.g, f.fg);
    (M[k] = M[k] || []).push({ id: f.id, t: f.t, on: !!f.on, src: f.src });
  }
  return AN_FG_ORDER.filter(k => M[k]).map(k => ({ g: k, items: M[k] }));
};
