/* init for tools/steady150/settle.cjs (phase thread 2026-11-28, user rule of 5:18 AM PHT): the ABC-001A / 001B load limit stations of the
   start to their design / logic values (hmi-op.js AN_HMI_MAN; HIC-MWRL was 3.0 MW/min from a screen). At a hold the rate and the limits
   move nothing (the unit load demand sits at its target), so this is a value change, not a line-up move. A station whose set input is
   its own output through an AMT (HIC-MWRL) takes the value on that loop too, as hmi-op.js does, else the next scan reads the old one back. */
(() => {
  for (const [sh, tag, v] of [['ABC-001A', 'HIC-MWHL', 151.0], ['ABC-001A', 'HIC-MWLL', 0.0], ['ABC-001B', 'HIC-MWRL', 1.2]]) {
    const S = AN.sheets.find(x => x.name === sh).S,
      b = S.blk.find(x => x.k === 'MAN' && x.tag === tag);
    if (!b || !S.rt.st[b.id]) throw new Error('no ' + tag);
    S.rt.st[b.id].val = v;
    if (S.rt.st[b.id].trk != null) S.rt.st[b.id].trk = v;
    if ('op' in S.rt.st[b.id]) S.rt.st[b.id].op = v; /* plant.js MAN: the operator's value of a station on its own AUTO loop */
    const si = b.svI >= 0 ? b.i[b.svI] : null,
      dr = si != null ? (S.drv[si] || []).find(z => z.k === 'AMT') : null;
    if (dr && dr.o && dr.o[0] != null && !S.ext.includes(dr.a)) S.rt.v[dr.o[0]] = v;
    for (const n of b.o || []) if (n != null && n >= 0) S.rt.v[n] = v;
    /* and the operator COS that feeds the station's manual leg (ABC-001B 'COS manual > MAN HIC-MWRL', an ext of the sheet) */
    for (const n of S.ext) if ((AN.nm(S, n) || '') === 'COS manual \u25b8 MAN ' + tag) S.rt.ext[n] = v;
  }
})();
