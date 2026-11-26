/* ===== ALARM PRIORITY (Full Audit 3 ranking 13, ISA-18.2) =====
   AN.almPri(a) -> { p: 1 ~ 4, name } for one row of the alarm list: { kind, lv } as the alarm scan makes it (src/ui/hmi/events.js
   almScan: kind 'ALM' / 'TRIP' / 'DCS', lv 'HIGH-HIGH' / 'HIGH' / 'LOW' / 'LOW-LOW' / 'DEVIATION' / 'ALARM' / 'TRIP').
   The plant alarm list ("Alarm List _20160912") has no priority column, so the priority is derived the way ISA-18.2 asks:
   from the consequence if the operator does nothing and the time there is to act. The alarm list itself gives that order through its
   set points: the HH / LL set point is where the logic acts or the machine is at its limit, the H / L one is the warning before it.
   Checked on the list and the drawings:
     ACWP winding H 155 / HH 165 C: DITL-76 / 77 rows 13 ~ 17 trip the pump at "> 165 C";
     IDF / PAF / SAF winding H 140 / HH 145 C, remark "< 130 for start permissive"; IDF bearing H 90 / HH 95 (DITL comparators 90 / 95);
     PT-MS1002 HH 134 / LL 72.9 kg/cm2 = DITL-40 MAIN STEAM PRESSURE H.H. / LOW LOW; LT-CD1110 LL -300 mm = the condensate pump stop
     (ABC-031 M.3211, DITL-61A row 13).
   So:
     1 EMERGENCY  a trip of the unit or of a machine has happened (kind TRIP): act now, the plant has already moved;
     2 HIGH       HH / LL: at the point where the logic trips or stops a machine; minutes to act;
     3 MEDIUM     H / L: the warning before HH / LL, or a deviation between redundant transmitters (DEVIATION) that blinds a control loop;
     4 LOW        a status alarm of the field (ALARM: a switch, a local panel) and the DCS notes of a machine stop by its logic (DCS). */
const AN_ALM_PRI = ['', 'EMERGENCY', 'HIGH', 'MEDIUM', 'LOW'];
/* PR 0 (lane plan 2026-11-25): src/data/alarms/<group>.json rows { tag, lv, p, src } (window.LANE_ALARMS, built in by
   tools/build/engine-bundle.js laneData). A row whose tag is in the alarm name (and whose lv matches, when given) sets the priority
   from the alarm list row it names (src); every other alarm keeps the derived priority below. */
const anLaneAlm = a => {
  const L = (typeof window !== 'undefined' && window.LANE_ALARMS) || globalThis.LANE_ALARMS || [];
  if (!L.length) return 0;
  const nm = String((a && a.nm) || '').toUpperCase(),
    lv = String((a && a.lv) || '').toUpperCase();
  for (const r of L) {
    const t = String(r.tag || '').toUpperCase();
    if (!t || nm.indexOf(t) < 0) continue;
    if (r.lv && String(r.lv).toUpperCase() !== lv) continue;
    if (r.p >= 1 && r.p <= 4) return r.p | 0;
  }
  return 0;
};
AN.almPri = a => {
  const lp = anLaneAlm(a);
  if (lp) return { p: lp, name: AN_ALM_PRI[lp] };
  const k = String((a && a.kind) || ''),
    lv = String((a && a.lv) || '').toUpperCase();
  let p = 4;
  if (k === 'TRIP' || lv === 'TRIP') p = 1;
  else if (/HIGH-HIGH|HI-HI|LOW-LOW|LO-LO|\bHH\b|\bLL\b/.test(lv)) p = 2;
  else if (/HIGH|LOW|DEVIATION/.test(lv)) p = 3;
  return { p, name: AN_ALM_PRI[p] };
};
/* Lane 5 (2026-11-25): the alarm lines of the alarm list rows (src/data/alarms, window.LANE_ALARMS). One call of the alarm scan
   (src/ui/hmi/events.js almScan) puts them in its table with the other alarms, so they get the same acknowledge, group suppression
   and priority (the line names the ABC sheet of the transmitter, so the group suppression of that sheet applies).
   A row raises only when its point has a REGISTERED SOURCE (one signal, one source; src/world/field/README.md):
   - analog row: a field row of a lane for its station and address or its tag (AN.fieldRead), or an AI state the plant model writes
     (s.src, set by the model writers: unit.js anUnitWrite, plant.js loop transmitters). A 150 MW snapshot seed (s.snap) and an
     unlinked transmitter (reads 0) are not a source and stay silent. The value is the AI block output (what the DCS sees); a field row
     whose address is on no running sheet gives its own value.
   - switch row: the switch of the tag driven by the plant model or a DI field row (WORLD.plantSw, src/world/plantsw.js); its on is the
     switch in its state (level low, pressure high, ...). The row's on is the state that is the alarm: 1, or 0 for a switch whose made
     state is the normal one ("> 2.0 kg/cm2" oil pressure established).
   - switch row with ditl / out: the plant's own alarm output of a DITL drawing (the ash cooler SPEED LOW of DITL-21A #B ~ #D). A row that the operator sets by hand has no source and raises nothing.
   A point already alarmed on the same side (HIGH / HIGH-HIGH or LOW / LOW-LOW) by another alarm of the scan with the tag in its name
   (an ALM block, the comparator alarms of a drawing) adds no second line. Set points are the list's own (row sp); none is changed here. */
const anLaneN = t => String(t || '').replace(/[^A-Z0-9]/gi, '').toUpperCase();
const anLaneK = { s0: null, k: new Map() };
const anLaneFld = key => {
  const v = typeof AN.fieldRead === 'function' ? AN.fieldRead(key) : null;
  return v != null && isFinite(v) ? +v : null;
};
/* the value of output "r.out" of DITL drawing r.ditl ("DITL-21A #B": machine instance B), 1 / 0, or null when the world is not built */
const anLaneOut = r => {
  try {
    if (typeof S === 'undefined' || !S.sheets || typeof DUI === 'undefined' || !DUI.outs) return null;
    const W = (typeof window !== 'undefined' && window.WORLD) || {},
      L = S.sheets.concat(W.inst || []),
      sh = L.find(z => String(z.name || '').replace(/^\(\w+\)/, '') === r.ditl);
    if (!sh) return null;
    const o = (DUI.outs(sh) || []).find(x => String(x.name || '').replace(/^Output row \d+ · /, '').indexOf(r.out) >= 0 && !/\bNOT\b/.test(x.name));
    return o ? DUI.outVal(sh, o.row) : null;
  } catch (e) {
    return null;
  }
};
AN.laneAlm = now => {
  const L = (typeof window !== 'undefined' && window.LANE_ALARMS) || globalThis.LANE_ALARMS || [],
    out = [];
  if (!L.length || !AN.sheets || typeof anUnitAIs !== 'function') return out;
  /* sheets compiled again: the AI block lists again */
  const s0 = AN.sheets[0] && AN.sheets[0].S;
  if (anLaneK.s0 !== s0) {
    anLaneK.s0 = s0;
    anLaneK.k.clear();
  }
  const W = (typeof window !== 'undefined' && window.WORLD) || globalThis.WORLD,
    sw = W && typeof W.plantSw === 'function' ? W.plantSw() || [] : [],
    swOn = new Map();
  /* one signal: the input is 1 when any of its rows (sheet instances) is 1 */
  for (const m of sw) if (m && m.tag) swOn.set(anLaneN(m.tag), !!(swOn.get(anLaneN(m.tag)) || m.on));
  const names = [...now.values()].map(x => [String(x.nm || '').toUpperCase(), String(x.lv || '').toUpperCase()]);
  for (const r of L) {
    const key = r.stn - 100 + '|' + r.addr;
    let e = anLaneK.k.get(key);
    if (!e) {
      const list = /^AI\d{4}$/.test(r.addr || '') ? anUnitAIs(key) : [],
        sh = list.length ? AN.sheets.find(z => z.S === list[0][0]) : null;
      e = { list, sh: sh ? sh.name : 'ALARM LIST' };
      anLaneK.k.set(key, e);
    }
    let hit = false;
    if (r.ditl) {
      /* the plant's own alarm of the switch: an output of its DITL drawing (CRT, ANN), e.g. DITL-21A "SPEED LOW" = FORWARD RUNNING
         (on delay) AND NOT the speed switch (off delay): a stopped machine gives no line */
      const v = anLaneOut(r);
      if (v == null) continue;
      hit = v === r.on;
    } else if (r.on === 0 || r.on === 1) {
      let v = swOn.get(anLaneN(r.tag));
      if (v === undefined && r.io) v = swOn.get(anLaneN(r.io));
      /* Phase 10 (2026-11-27): a DI field row of a lane (src/world/field, FIELD.add di / a field state the instructor sets: the chemical
         tank level switches, the BFWP lube oil level, the coal feeder air tank pressure) is the switch's registered source too; it is read
         by its tag (AN.fieldRead, 1 / 0). Before, only WORLD.plantSw was read and these rows never raised */
      if (v === undefined) {
        let f = anLaneFld(anLaneN(r.tag));
        if (f == null && r.io) f = anLaneFld(anLaneN(r.io));
        if (f != null) v = f > 0.5;
      }
      if (v === undefined) continue;
      hit = (v ? 1 : 0) === r.on;
    } else {
      if (typeof r.sp !== 'number' || !/^AI\d{4}$/.test(r.addr || '')) continue;
      let f = anLaneFld(key);
      if (f == null) f = anLaneFld(anLaneN(r.tag));
      if (f == null && r.io) f = anLaneFld(anLaneN(r.io));
      let x = NaN,
        src = f != null;
      for (const [S, b] of e.list) {
        const v = S.rt && b.o && b.o.length ? +S.rt.v[b.o[0]] : NaN,
          st = S.rt && S.rt.st ? S.rt.st[b.id] : null;
        if (st && st.src) src = true;
        if (!isFinite(x) && isFinite(v)) x = v;
      }
      if (!src) continue;
      if (!isFinite(x)) x = f;
      if (x == null || !isFinite(x)) continue;
      hit = r.lv === 'HIGH-HIGH' || r.lv === 'HIGH' ? x > r.sp : x < r.sp;
    }
    if (!hit) continue;
    const T = String(r.tag).toUpperCase(),
      I = String(r.io || '').toUpperCase();
    const up = /HIGH/.test(r.lv);
    if (/HIGH|LOW/.test(r.lv) && names.some(([n, lv]) => /HIGH|LOW/.test(lv) && /HIGH/.test(lv) === up && (n.indexOf(T) >= 0 || (I && n.indexOf(I) >= 0)))) continue;
    if (!/HIGH|LOW/.test(r.lv) && names.some(([n]) => n.indexOf(T) >= 0)) continue;
    out.push(['L|' + r.tag + '|' + r.lv, { sh: e.sh, kind: 'ALM', nm: r.tag + ' ' + r.d, lv: r.lv }, key]);
  }
  /* a point with HIGH-HIGH and HIGH both over: one line, the higher level (as an ALM block gives one level).
     Phase 10 (2026-11-27): one line per DCS point (station and address), not per list tag. The list names both elements of a
     dual-element winding / bearing RTD (TE-CD1116-AU1 and -AU2) and the I/O list wires one, TT-CD1116-AU (STN103 AI0960): one signal,
     one alarm, under the first row of the point (element 1) */
  const top = new Map();
  for (const [k, x, key] of out) {
    const o = top.get(key);
    if (!o || (/-/.test(x.lv) && !/-/.test(o[1].lv))) top.set(key, [k, x]);
  }
  return [...top.values()];
};
