/* init for tools/steady150/settle.cjs (MEI, Phase 11 Rule 0, 2026-11-28; user rule of 5:18 AM PHT: no plant screen in the plant model).
   The operator set points that st150 still carries from the old screen line-up, put to their design or logic value. Read on the PC
   by YUA from design documents only (/mnt/project-files/mei-sv-design-reads-2026-11-28.md):
   - PIC-COBM 129.0 kg/cm2G: FHI P2 Sect 7 Fig 11 boiler pressure vs load, 100 % MCR (126.0 at 50 %). Ramped 0.5 kg/cm2 a plant minute
     (an operator's SV move; a step would force the masters to MANUAL by BU-CMD).
   - PICFG108 -5.1 mmWG: FHI 2-8-TAB_7-4 lower furnace "slightly negative".
   - FICFA1055A / B 26 T/H: ABC sheet design base box (FA 26 t/h at 100 % load).
   - PICAS1005 11 kg/cm2g: line list K1AU3-L1-0-011 AS-1-005 operating pressure.
   - TICAS1001 350 C: ABC-033 logic preset (line list AS header 350 C operating).
   - FICCD1120 99 T/H: KSB WKTB 6/1+2 data sheet row 15, CEP minimum recirculation 100 m3/h (DERIVED reading, x 0.99 t/m3 at 45 C).
   - LICCD1104, LICHD11011 / 11012 / 11021 / 11022 / 11031 / 11032 / 11051 / 11052 / 11061 / 11062 0 mm: design normal water level
     (DERIVED, D1-037 vessel data; the old -3 / -6 / -0.5 / 65.3 were screen values).
   Already at their logic preset in st150 (no change): TICHR1012 136.5 (ABC-052), PICHR1391 35.5 (ABC-054), HICBR1391 0 (ABC-055).
   NO-SOURCE (left as they are; no design or logic number in the documents): AICFG10571 200, TICBR1140 462, PICDO0005 12.8,
   TICAS1017 259, PICSB1052 normal SV, PICDO1008 normal SV, PICAS1004 normal SV, PICFG108A.
   Chains onto a __settleMinute set by an init run before it. */
(() => {
  const prev = typeof globalThis.__settleMinute === 'function' ? globalThis.__settleMinute : null;
  const find = tag => {
    for (const sh of AN.sheets) {
      const S = sh.S;
      if (!S || /^ABC-000/.test(sh.name)) continue;
      const c = (AN.hmiCtrls(S) || []).find(z => z.tag === tag);
      if (c && c.q && c.q.sv != null && S.ext.includes(c.q.sv)) return { S, n: c.q.sv };
    }
    throw new Error('no operator SV for ' + tag);
  };
  const put = (tag, v) => {
    const x = find(tag);
    x.S.rt.ext[x.n] = v;
  };
  for (const [t, v] of [
    ['PICFG108', -5.1],
    ['FICFA1055A', 26],
    ['FICFA1055B', 26],
    ['PICAS1005', 11],
    ['TICAS1001', 350],
    ['FICCD1120', 99],
    ['LICCD1104', 0],
    ['LICHD11011', 0],
    ['LICHD11012', 0],
    ['LICHD11021', 0],
    ['LICHD11022', 0],
    ['LICHD11031', 0],
    ['LICHD11032', 0],
    ['LICHD11051', 0],
    ['LICHD11052', 0],
    ['LICHD11061', 0],
    ['LICHD11062', 0]
  ])
    put(t, v);
  const cobm = find('PIC-COBM');
  globalThis.__settleMinute = m => {
    if (prev) prev(m);
    const now = cobm.S.rt.ext[cobm.n],
      d = 129.0 - now;
    if (Math.abs(d) > 1e-9) cobm.S.rt.ext[cobm.n] = now + Math.sign(d) * Math.min(0.5, Math.abs(d));
  };
})();
