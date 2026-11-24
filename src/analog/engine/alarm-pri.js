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
