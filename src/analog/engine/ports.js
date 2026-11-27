/* PHASE 11 PORT FILE (user 2026-11-27 11:05 AM PHT "Ok sinisimulan naba plant model? Gawin nio na"): THE ONE list of what flows
   between the 7 parts of the plant model. Owner of this file: the Phase 11 port / balance thread. A part never edits it: it asks.

   THE RULES
   1. One writer per port. The part named in `by` writes U.pt[id] once per plant step; every other part only reads it. A value that
      goes the other way is its own port (example: the spray water conditions go NANA -> KANA, the spray flow taken goes KANA -> NANA).
   2. Units, the same on every port (no other unit on a port; a part converts inside itself):
        m  mass flow, T/H            P  pressure, kg/cm2 ABSOLUTE (ata) = gauge + 1.0332 (HB PPE-14-0725 is in ata; the
        T  temperature, C                condenser and the deaerator are absolute anyway; one rule, no sign mistakes)
        h  specific enthalpy, kJ/kg  Q  heat, kW          W  power, MW          L  level, mm from normal      n  speed, rpm
      A gas port also carries cp (kJ/kg/K) and the volume shares x = {O2, CO2, H2O, SO2, N2}.
   3. A port that is not written yet reads null (never 0, never a guess). The balance test counts it as "not written", not as a pass.
   4. Each part also writes its STORE: U.pt['store.<part>'] = { mw: water + steam mass in t, E: stored energy in MJ (water, steam,
      metal, gas, bed) } so the whole-plant test can check in = out + d(store)/dt.
   5. Design value at 150 MW (`d150`): only from a design document (HB = Hitachi heat balance PPE-14-0725 R1 case 1; FHI = CFB boiler
      manual P2S7 Tab 3 / Figs; L20 = Howden air heater OMM), the same numbers as docs/accept/part1-targets.json. No value = null.
      These are TARGETS for the tests, never constants of the model (RULES 3.12: no per-load table, no fitted constant).

   THE PARTS (Phase 11 threads)
     AOI  combustion: coal / limestone / sand / oil feed into the furnace, bed, furnace, cyclones, fans, AIR HEATER (gas and air side)
     KANA drum, evaporator, the whole BACKPASS heat chain (superheaters, reheater tube banks, economizer: gas side and metal), SH sprays,
          drum / SH safety valves, main steam blow-off, blowdown out of the drum
     RIN  turbine (HP, IP, LP), main stop / control valves, REHEAT STEAM SIDE (cold reheat -> hot reheat mass and pressure, RH safety
          valves), HP / LP bypass, extractions, gland leak-off, shaft
     MEI  condenser, hotwell, condensate pumps, polisher, gland steam condenser, ejectors, LP heaters 1 ~ 3 and their drains
     NANA deaerator, boiler feed pumps, HP heaters 1 ~ 2 and their drains, feedwater valves (main and start-up), spray water source
     YUI  generator, excitation, grid, unit auxiliary power
     SUZU sea water, closed cooling water, make-up water, auxiliary steam header, ash coolers and fly ash removal, diesel oil supply,
          lube / control oil, compressed air, sootblower steam (the balance of plant)
   Boundaries chosen where the proposals overlapped (2026-11-27): the economizer and the reheater TUBE banks are KANA (one gas-side
   chain, hx.js anHxRun today); the reheat STEAM mass and pressure are RIN; the air heater is AOI; the auxiliary steam header is SUZU. */
const AN_PORTS = {
  units: { m: 'T/H', P: 'kg/cm2 abs', T: 'C', h: 'kJ/kg', Q: 'kW', W: 'MW', L: 'mm', n: 'rpm', cp: 'kJ/kg/K' },
  parts: {
    AOI: 'combustion and CFB furnace, fans, air heater',
    KANA: 'drum, evaporator, backpass heat chain (SH, RH banks, economizer), sprays',
    RIN: 'turbine, reheat steam side, bypasses, extractions',
    MEI: 'condenser, condensate, LP heaters',
    NANA: 'deaerator, feed pumps, HP heaters, feedwater valves',
    YUI: 'generator, electrical, auxiliary power',
    SUZU: 'sea water, cooling water, make-up, auxiliary steam, ash, oil, BOP'
  },
  /* id: { by: writer, to: readers, v: variables, kind: 'water' | 'steam' | 'gas' | 'air' | 'solid' | 'heat' | 'power' | 'signal',
     io: 'in' / 'out' = crosses the plant boundary (counts in the whole-plant balance), d150: design at 150 MW, src: its document } */
  list: {
    /* ---- fuel, air and gas ---- */
    'coal.feed': { by: 'AOI', to: [], kind: 'solid', v: ['m'], io: 'in', d150: { m: 89.5 }, src: 'FHI Fig 13' },
    'lime.feed': { by: 'SUZU', to: ['AOI'], kind: 'solid', v: ['m'], io: 'in', d150: { m: 4.9 }, src: 'logic cap AICFG10571 (ABC-005), ACCEPTANCE Part 1' },
    'sand.feed': { by: 'SUZU', to: ['AOI'], kind: 'solid', v: ['m'], io: 'in', d150: { m: null } },
    'oil.guns': { by: 'SUZU', to: ['AOI'], kind: 'water', v: ['m'], io: 'in', note: 'diesel oil to burners A ~ D, sum; per gun in x = {A, B, C, D}', d150: { m: 0 }, src: 'HB PPE-14-0725 case 1 has no such flow: closed at load' },
    'air.pa': { by: 'AOI', to: ['KANA'], kind: 'air', v: ['m', 'T', 'P'], io: 'in', note: 'hot primary air after the air heater', d150: { m: 354 }, src: 'FHI Fig 12' },
    'air.sa': { by: 'AOI', to: ['KANA'], kind: 'air', v: ['m', 'T', 'P'], io: 'in', note: 'hot secondary air after the air heater', d150: { m: 218 }, src: 'FHI Fig 12' },
    'air.fa': { by: 'AOI', to: [], kind: 'air', v: ['m', 'T'], io: 'in', note: 'fluidizing (seal pot) blower air', d150: { m: null } },
    'gas.fe': { by: 'AOI', to: ['KANA'], kind: 'gas', v: ['m', 'T', 'cp', 'x'], note: 'gas at the cyclone outlet into the backpass', d150: { T: null } },
    'q.wall': { by: 'AOI', to: ['KANA'], kind: 'heat', v: ['Q'], note: 'heat into the furnace water walls (makes the steam)', d150: { Q: null } },
    'q.panel': { by: 'AOI', to: ['KANA'], kind: 'heat', v: ['Q', 'T'], note: 'heat into the in-furnace SH panels; T = furnace gas / bed temperature they see', d150: { Q: null } },
    'wall.T': { by: 'KANA', to: ['AOI'], kind: 'signal', v: ['T'], note: 'water wall water temperature (saturation)', d150: { T: null } },
    'panel.T': { by: 'KANA', to: ['AOI'], kind: 'signal', v: ['T'], note: 'in-furnace SH panel metal, mean of panel 1 and 2', d150: { T: null } },
    'gas.eco_out': { by: 'KANA', to: ['AOI'], kind: 'gas', v: ['m', 'T', 'cp', 'x'], note: 'economizer outlet = air heater gas inlet', d150: { T: 322 }, src: 'L20 Howden APH duty at 100 %' },
    'gas.stack': { by: 'AOI', to: [], kind: 'gas', v: ['m', 'T', 'cp', 'x'], io: 'out', note: 'after the air heater, ESP and ID fan', d150: { T: 135 }, src: 'FHI Tab 3, L20 (air heater gas out)' },
    'ash.bed': { by: 'AOI', to: ['SUZU'], kind: 'solid', v: ['m', 'T'], note: 'bottom ash out of the furnace to the ash coolers', d150: { m: null } },
    'ash.fly': { by: 'AOI', to: ['SUZU'], kind: 'solid', v: ['m'], note: 'fly ash in the gas to the air heater hoppers and the ESP', d150: { m: null } },
    'ash.out': { by: 'SUZU', to: [], kind: 'solid', v: ['m', 'T'], io: 'out', note: 'bottom ash leaving the coolers + fly ash removed', d150: { m: null } },
    /* ---- feedwater, boiler water and main steam ---- */
    'fw.eco_in': { by: 'NANA', to: ['KANA'], kind: 'water', v: ['m', 'P', 'T', 'h'], note: 'final feedwater after the feedwater valves (TT-FW1160, PT-FW1160)', d150: { m: 458.7, T: 245.4 }, src: 'HB case 1, FHI Tab 3' },
    'fw.spray_src': { by: 'NANA', to: ['KANA', 'RIN'], kind: 'water', v: ['P', 'T', 'h'], note: 'spray water conditions: SH spray after No.2 HP heater (T, h); RH and HP bypass spray from the feed pump discharge (x.Tbp, x.hbp)', d150: {} },
    'spray.sh': { by: 'KANA', to: ['NANA'], kind: 'water', v: ['m'], note: 'SH spray 1 + 2 taken (x = {sh1, sh2})', d150: { m: 12.4 }, src: 'FHI Fig 10 (2.70 % at 100 %)' },
    'spray.rh': { by: 'RIN', to: ['NANA'], kind: 'water', v: ['m'], note: 'reheat spray TCV-FW1150 taken', d150: { m: 0 }, src: 'HB case 1 (HRH = CRH - No.6 extraction)' },
    'spray.hpb': { by: 'RIN', to: ['NANA'], kind: 'water', v: ['m'], note: 'HP bypass spray taken', d150: { m: 0 }, src: 'HB PPE-14-0725 case 1 has no such flow: closed at load' },
    'drum': { by: 'KANA', to: ['NANA', 'AOI'], kind: 'signal', v: ['P', 'T', 'L'], note: 'drum pressure, saturation, level', d150: {} },
    'ms.sh_out': { by: 'KANA', to: ['RIN'], kind: 'steam', v: ['P', 'T', 'h'], note: 'finishing SH outlet; the flow is the turbine + bypass draw (ms.draw)', d150: { P: 130.03, T: 541 }, src: 'FHI Fig 11, Fig 6, Tab 3 (129 kg/cm2 g)' },
    'ms.draw': { by: 'RIN', to: ['KANA'], kind: 'steam', v: ['m'], note: 'main steam taken: x = {tb: turbine stop / control valves, hpb: HP bypass}', d150: { m: 458.33 }, src: 'HB case 1' },
    'ms.aux': { by: 'SUZU', to: ['KANA'], kind: 'steam', v: ['m'], note: 'main steam to the auxiliary steam header MV-AS1391 and to the sootblowers', d150: { m: 0 }, src: 'HB PPE-14-0725 case 1 has no such flow: closed at load' },
    'ms.vent': { by: 'KANA', to: [], kind: 'steam', v: ['m', 'h'], io: 'out', note: 'main steam blow-off PCV-MS1001 + drum / SH safety valves + vents', d150: { m: 0 }, src: 'HB PPE-14-0725 case 1 has no such flow: closed at load' },
    'bd.out': { by: 'KANA', to: ['SUZU'], kind: 'water', v: ['m', 'h'], note: 'continuous / intermittent blowdown and boiler drains to the flash / blowdown tank', d150: { m: null } },
    /* ---- reheat ---- */
    'crh.rh_in': { by: 'RIN', to: ['KANA'], kind: 'steam', v: ['m', 'P', 'T', 'h'], note: 'cold reheat after the RH spray into the reheater banks', d150: { m: 446.1, P: 38.64, T: 370.2 }, src: 'HB case 1 (cold reheat)' },
    'hrh.rh_out': { by: 'KANA', to: ['RIN'], kind: 'steam', v: ['T', 'h'], note: 'reheater outlet temperature from the bank heat; mass and pressure are RIN', d150: { T: 541 }, src: 'FHI Fig 6, Tab 3' },
    'hrh': { by: 'RIN', to: ['KANA'], kind: 'steam', v: ['m', 'P'], note: 'hot reheat flow and pressure at the IP inlet', d150: { m: 400.9, P: 34.77 }, src: 'HB case 1 (hot reheat)' },
    'crh.aux': { by: 'SUZU', to: ['RIN'], kind: 'steam', v: ['m'], note: 'cold reheat to the auxiliary steam header PICAS1005', d150: { m: null } },
    'rh.vent': { by: 'RIN', to: [], kind: 'steam', v: ['m', 'h'], io: 'out', note: 'RH safety valves + RH blow-off', d150: { m: 0 }, src: 'HB PPE-14-0725 case 1 has no such flow: closed at load' },
    /* ---- turbine extractions and exhaust ---- */
    'ext.hp2': { by: 'RIN', to: ['NANA'], kind: 'steam', v: ['P', 'T', 'h'], note: 'No.1 extraction (cold reheat) to No.2 HP heater H-1106', d150: {} },
    'ext.hp1': { by: 'RIN', to: ['NANA'], kind: 'steam', v: ['P', 'T', 'h'], note: 'extraction II PT-TS1013 to No.1 HP heater H-1105', d150: {} },
    'ext.da': { by: 'RIN', to: ['NANA'], kind: 'steam', v: ['P', 'T', 'h'], note: 'extraction III PT-TS1017 to the deaerator', d150: {} },
    'ext.lp3': { by: 'RIN', to: ['MEI'], kind: 'steam', v: ['P', 'T', 'h'], note: 'extraction IV PT-TS1022 to No.3 LP heater H-1103', d150: {} },
    'ext.lp2': { by: 'RIN', to: ['MEI'], kind: 'steam', v: ['P', 'T', 'h'], note: 'extraction V PT-TS1026 to No.2 LP heater H-1102', d150: {} },
    'ext.lp1': { by: 'RIN', to: ['MEI'], kind: 'steam', v: ['P', 'T', 'h'], note: 'extraction VI to No.1 LP heater', d150: {} },
    'ext.w_hp': { by: 'NANA', to: ['RIN'], kind: 'steam', v: ['m'], note: 'extraction flows drawn: x = {hp2, hp1, da}', d150: {} },
    'ext.w_lp': { by: 'MEI', to: ['RIN'], kind: 'steam', v: ['m'], note: 'extraction flows drawn: x = {lp3, lp2, lp1}', d150: {} },
    'lp.exh': { by: 'RIN', to: ['MEI'], kind: 'steam', v: ['m', 'h'], note: 'LP turbine exhaust into the condenser', d150: {} },
    'lp.bypass': { by: 'RIN', to: ['MEI'], kind: 'steam', v: ['m', 'h'], note: 'LP bypass after its spray into the condenser', d150: { m: 0 }, src: 'HB PPE-14-0725 case 1 has no such flow: closed at load' },
    'gs.leak': { by: 'RIN', to: ['MEI'], kind: 'steam', v: ['m', 'h'], note: 'gland leak-off to the gland steam condenser', d150: {} },
    'gs.supply': { by: 'SUZU', to: ['RIN'], kind: 'steam', v: ['m', 'P', 'T', 'h'], note: 'gland steam seal supply from the auxiliary steam', d150: {} },
    /* ---- condenser, condensate, deaerator ---- */
    'cd': { by: 'MEI', to: ['RIN', 'SUZU'], kind: 'signal', v: ['P', 'T', 'Q'], note: 'condenser pressure, saturation, heat to sea water (x = {QA, QB})', d150: {} },
    'cd.out': { by: 'MEI', to: ['NANA'], kind: 'water', v: ['m', 'P', 'T', 'h'], note: 'condensate at the deaerator inlet after LCV-CD1104', d150: {} },
    'dea': { by: 'NANA', to: ['MEI'], kind: 'signal', v: ['P', 'T', 'L'], note: 'deaerator pressure, saturation, storage level', d150: {} },
    'hph.emerg': { by: 'NANA', to: ['MEI'], kind: 'water', v: ['m', 'h'], note: 'HP heater emergency drains to the condenser', d150: { m: 0 }, src: 'HB PPE-14-0725 case 1 has no such flow: closed at load' },
    'ej.steam': { by: 'SUZU', to: ['MEI'], kind: 'steam', v: ['m', 'h'], note: 'ejector / start-up ejector motive steam from the auxiliary steam', d150: {} },
    'aux.peg': { by: 'NANA', to: ['SUZU'], kind: 'steam', v: ['m'], note: 'deaerator pegging steam taken PCV-AS1030', d150: { m: 0 }, src: 'HB PPE-14-0725 case 1 has no such flow: closed at load' },
    'aux.hdr': { by: 'SUZU', to: ['NANA', 'RIN', 'MEI'], kind: 'signal', v: ['P', 'T', 'h'], note: 'auxiliary steam header', d150: {} },
    'mu': { by: 'SUZU', to: ['MEI'], kind: 'water', v: ['m', 'T'], io: 'in', note: 'make-up water into the hotwell', d150: {} },
    /* ---- cooling ---- */
    'cw': { by: 'SUZU', to: ['MEI'], kind: 'water', v: ['m', 'T'], note: 'sea water to the condenser, per water box x = {mA, mB, TA, TB}', d150: {} },
    'ccw': { by: 'SUZU', to: ['RIN', 'YUI', 'NANA', 'MEI', 'AOI'], kind: 'signal', v: ['m', 'T'], note: 'closed cooling water supply', d150: {} },
    'ccw.q': { by: 'SUZU', to: [], kind: 'heat', v: ['Q'], note: 'sum of the cooler duties it carries; each user writes its own cooler duty as q.ccw.<part>', d150: {} },
    /* ---- power ---- */
    'shaft': { by: 'RIN', to: ['YUI'], kind: 'power', v: ['W', 'n'], note: 'turbine mechanical power and speed', d150: {} },
    'gen': { by: 'YUI', to: ['RIN'], kind: 'power', v: ['W'], io: 'out', note: 'generator electrical output (x.b52g = breaker closed 1 / 0)', d150: { W: 150 }, src: 'HB case 1' },
    'aux.power': { by: 'YUI', to: [], kind: 'power', v: ['W'], note: 'unit auxiliary power, sum of the motor loads (each part writes q.motor.<part> in kW)', d150: {} },
    'relay.gen': { by: 'YUI', to: [], kind: 'signal', v: ['x'], note: 'pick-up contacts of the generator protection relays (A) and (B), read by the TCS sheets SH-G-5A / 5B / 6A / 6B (tcs-sheets.js TCS_SH_IN): x = {r24a, r24b, r24c, vhz (V/Hz %), r59a, r59b, r27, r81l1, r81l2, r81h1, r81h2}, 1 = picked up', d150: { x: { r24a: 0, r24b: 0, r24c: 0, r59a: 0, r59b: 0, r27: 0, r81l1: 0, r81l2: 0, r81h1: 0, r81h2: 0 } }, src: 'GEE-2015-0173 R1 pickups (YUA read): all open at 13.8 kV 60 Hz' }
  },
  /* the stores each part keeps (rule 4) */
  stores: ['store.AOI', 'store.KANA', 'store.RIN', 'store.MEI', 'store.NANA', 'store.YUI', 'store.SUZU']
};

/* a port value: what the writer puts in U.pt[id] (rule 1); a field it does not write stays null (rule 3) */
function anPortSet(U, id, o) {
  if (!AN_PORTS.list[id] && !/^(store|q)\./.test(id)) throw new Error('port ' + id + ' is not in ports.js');
  const pt = U.pt || (U.pt = {});
  pt[id] = Object.assign({ m: null, P: null, T: null, h: null }, o, { by: (AN_PORTS.list[id] || {}).by || null });
  return pt[id];
}
function anPortGet(U, id) {
  return (U.pt && U.pt[id]) || null;
}

/* THE WHOLE-PLANT WATER / STEAM MASS BALANCE (Phase 11 balance test): T/H in minus T/H out minus the rate of change of the water and
   steam the parts hold. ok: |res| <= tol T/H. missing: ports or stores not written yet (rule 3: they are reported, never filled) */
function anPortBalance(U, prev, dt) {
  const g = id => anPortGet(U, id),
    m = id => (g(id) && isFinite(g(id).m) ? +g(id).m : null),
    missing = [];
  const need = (id, v) => {
    if (v == null) missing.push(id);
    return v || 0;
  };
  /* the water and steam that enter and leave the cycle */
  const IN = ['mu'],
    OUT = ['ms.vent', 'rh.vent', 'bd.out'];
  let mi = 0,
    mo = 0;
  for (const id of IN) mi += need(id, m(id));
  for (const id of OUT) mo += need(id, m(id));
  let dS = 0;
  if (prev && dt > 0)
    for (const s of AN_PORTS.stores) {
      const a = g(s),
        b = prev[s];
      if (!a || !b || !isFinite(a.mw) || !isFinite(b.mw)) missing.push(s);
      else dS += ((a.mw - b.mw) / dt) * 3600; /* t per s -> T/H */
    }
  return {
    in: +mi.toFixed(3),
    out: +mo.toFixed(3),
    dStore: +dS.toFixed(3),
    res: +(mi - mo - dS).toFixed(3),
    missing: [...new Set(missing)]
  };
}

/* the balance and sweep tools read the ports in the page */
if (typeof window !== 'undefined') window.LS_PORTS = { AN_PORTS, anPortGet, anPortBalance };
if (typeof module !== 'undefined' && module.exports) module.exports = { AN_PORTS, anPortSet, anPortGet, anPortBalance };
