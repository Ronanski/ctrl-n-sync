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
   and priority (the line names the ABC sheet of the transmitter, so the group suppression of that sheet applies). Analog rows only:
   the point's value is the output of the AI blocks of its station and address (anUnitAIs, as "Start at 150 MW" writes them).
   A row raises only from a LIVE value: the value has changed while the plant time runs since the load. An I/O point that nothing
   writes stays at its first value (an unlinked transmitter reads 0, not "no value"; a 150 MW snapshot seed keeps its number) and
   stays silent; a point the plant model or a link drives moves
   and its rows come in. A point already alarmed on the same side (HIGH / HIGH-HIGH or LOW / LOW-LOW) by another alarm of the scan
   with the tag in its name (an ALM block, the comparator alarms of a drawing) adds no second line. Set points are the list's own (row sp); none is changed here. */
const anLaneLive = { base: null, k: new Map() };
AN.laneAlm = (now, t) => {
  const L = (typeof window !== 'undefined' && window.LANE_ALARMS) || globalThis.LANE_ALARMS || [],
    out = [];
  if (!L.length || !AN.sheets || typeof anUnitAIs !== 'function') return out;
  /* a plant loaded again (another start, time back, sheets compiled again): the first values again */
  const s0 = AN.sheets[0] && AN.sheets[0].S;
  if (anLaneLive.base !== AN.startState || anLaneLive.s0 !== s0 || !(t >= anLaneLive.t)) {
    anLaneLive.base = AN.startState;
    anLaneLive.s0 = s0;
    anLaneLive.k.clear();
  }
  anLaneLive.t = t;
  const names = [...now.values()].map(x => [String(x.nm || '').toUpperCase(), String(x.lv || '').toUpperCase()]);
  for (const r of L) {
    if (r.on || typeof r.sp !== 'number' || !/^AI\d{4}$/.test(r.addr || '')) continue;
    const key = r.stn - 100 + '|' + r.addr;
    let e = anLaneLive.k.get(key);
    if (!e) {
      const list = anUnitAIs(key),
        sh = list.length ? AN.sheets.find(z => z.S === list[0][0]) : null;
      e = { list, sh: sh ? sh.name : 'ALARM LIST', v0: NaN, live: false };
      anLaneLive.k.set(key, e);
    }
    let x = NaN;
    for (const [S, b] of e.list) {
      const v = S.rt && b.o && b.o.length ? +S.rt.v[b.o[0]] : NaN;
      if (isFinite(v)) {
        x = v;
        break;
      }
    }
    if (!isFinite(x)) continue;
    /* the first value is the one of the loaded plant while its time stands (a paused plant, the patches of the load); live = it
       changes once the plant time runs (a seed of the 150 MW snapshot that nothing writes keeps its number and stays silent) */
    if (!isFinite(e.v0) || !(t > e.t0)) {
      if (!isFinite(e.v0)) e.t0 = t;
      e.v0 = x;
    } else if (!e.live && Math.abs(x - e.v0) > 1e-9) e.live = true;
    if (!e.live) continue;
    const hit = r.lv === 'HIGH-HIGH' || r.lv === 'HIGH' ? x > r.sp : x < r.sp;
    if (!hit) continue;
    const T = String(r.tag).toUpperCase(),
      I = String(r.io || '').toUpperCase();
    const up = /HIGH/.test(r.lv);
    if (names.some(([n, lv]) => /HIGH|LOW/.test(lv) && /HIGH/.test(lv) === up && (n.indexOf(T) >= 0 || (I && n.indexOf(I) >= 0)))) continue;
    out.push(['L|' + r.tag + '|' + r.lv, { sh: e.sh, kind: 'ALM', nm: r.tag + ' ' + r.d, lv: r.lv }]);
  }
  /* a point with HIGH-HIGH and HIGH both over: one line, the higher level (as an ALM block gives one level) */
  const top = new Map();
  for (const [k, x] of out) {
    const tg = k.split('|')[1],
      o = top.get(tg);
    if (!o || /-/.test(x.lv)) top.set(tg, [k, x]);
  }
  return [...top.values()];
};
