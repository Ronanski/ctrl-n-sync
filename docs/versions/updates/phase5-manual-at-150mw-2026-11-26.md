# Phase 5: the 30 controllers not in AUTO at the 150 MW start, against the HMI snapshots (2026-11-26 PHT)

From `tests/lanes/qa/pid-auto.cjs` (status MAN = the PID tracks), compared with `docs/hmi/operating-points.json` (control room
snapshots; a check, not the highest source, CLAUDE.md HINDI NAGBABAGO 4). Per controller: what the app does at the 150 MW start, what
the snapshot shows.

## Result
- 21 agree: MANUAL in the app and M in the snapshot (the coal feeder / PA damper groups ABC-003A ~ 003D, DPICFG108, LICBR1001B,
  FICFA1055B, PICSB1052, FICCD1121, TICAS1001, LICHD11062, TICMS1022, TICHR1012). Correct (finding type b, evidence: snapshot).
- 7 differ: the snapshot shows A, the app is on the manual leg or tracks. Fix candidates (Phase 5 / 6, next slice):
  - ABC-010 LICBR1001A (drum level 3-element): the station is on the PID leg but the PID tracks a selector further on; snapshot
    03.png 150.5 MW: A, MV 56 %.
  - ABC-014 FICFA1055A: manual leg; snapshot 9.png 150.3 MW: A.
  - ABC-031 LICCD1110B (hotwell dump valve): manual leg; snapshot 28.png 151.3 MW: A.
  - ABC-035 LICHD11052, ABC-037 LICHD11012, ABC-038 LICHD11022, ABC-039 LICHD11032 (HP / LP heater drain levels): manual leg; snapshot
    02.png 60.3 MW: A (no 150 MW snapshot of these).
- 2 not in any snapshot: ABC-003E FIC-OM, ABC-009A PIC-BASC (manual leg in the app): to check against the procedure PR-OPE-5002 and the
  drawing (finding type c until read).

## Detail
- ABC-003B FICFA1043B: app station on the manual leg; snapshot 13.PNG 149.7 MW: M (R shown, R-SV 26.0)
- ABC-003B PICDO1043B: app station on the manual leg; snapshot 13.PNG 149.7 MW: M
- ABC-003B FICDO1043B: app station on the manual leg; snapshot 13.PNG 149.7 MW: -, 13.PNG 149.7 MW: M, 6.PNG 149.8 MW: -
- ABC-003C FICFA1043C: app station on the manual leg; snapshot 14.PNG 149.9 MW: M (L shown, R-SV 26.0)
- ABC-003C PICDO1043C: app station on the manual leg; snapshot 14.PNG 149.9 MW: M
- ABC-003C FICDO1043C: app station on the manual leg; snapshot 14.PNG 149.9 MW: -, 14.PNG 149.9 MW: M, 6.PNG 149.8 MW: -
- ABC-003D FICFA1043D: app station on the manual leg; snapshot 15.PNG 149.9 MW: M (L shown, R-SV 26.0)
- ABC-003D PICDO1043D: app station on the manual leg; snapshot 15.PNG 149.9 MW: M
- ABC-003D FICDO1043D: app station on the manual leg; snapshot 15.PNG 149.9 MW: -, 15.PNG 149.9 MW: M, 6.PNG 149.8 MW: -
- ABC-003E FIC-OM: app station on the manual leg; snapshot not in the snapshots
- ABC-009A DPICFG108: app station on the manual leg; snapshot 16.PNG 149.8 MW: M
- ABC-009A PIC-BASC: app station on the manual leg; snapshot not in the snapshots
- ABC-010 LICBR1001A: app station on the PID leg (tracks a selector further on); snapshot 03.png 150.5 MW: A
- ABC-010 LICBR1001B: app station on the manual leg; snapshot 03.png 150.5 MW: M
- ABC-014 FICFA1055A: app station on the manual leg; snapshot 9.png 150.3 MW: A
- ABC-014 FICFA1055B: app station on the manual leg; snapshot 9.png 150.3 MW: M
- ABC-017 PICSB1052: app station on the manual leg; snapshot 18.PNG 149.8 MW: M
- ABC-031 LICCD1110B: app station on the manual leg; snapshot 02.png 60.3 MW: A, 28.png 151.3 MW: A
- ABC-032 FICCD1121: app station on the manual leg; snapshot 28.png 151.3 MW: M
- ABC-033 TICAS1001: app station on the manual leg; snapshot 29.PNG 151.3 MW: M
- ABC-035 LICHD11052: app station on the manual leg; snapshot 02.png 60.3 MW: A
- ABC-036 LICHD11062: app station on the manual leg; snapshot 02.png 60.3 MW: M
- ABC-037 LICHD11012: app station on the manual leg; snapshot 02.png 60.3 MW: A
- ABC-038 LICHD11022: app station on the manual leg; snapshot 02.png 60.3 MW: A
- ABC-039 LICHD11032: app station on the manual leg; snapshot 02.png 60.3 MW: A
- ABC-051 TICMS1022: app station on the manual leg; snapshot 4.PNG 148.8 MW: M, 5.png 152.5 MW: M, 5.png 152.5 MW: M
- ABC-052 TICHR1012: app station on the manual leg; snapshot 5.png 152.5 MW: M, 5.png 152.5 MW: M
- ABC-003A FICFA1043A: app station on the manual leg; snapshot 12.PNG 149.7 MW: M (L shown, R-SV 26.0)
- ABC-003A PICDO1043A: app station on the manual leg; snapshot 12.PNG 149.7 MW: M; 6.PNG 149.8 MW: M
- ABC-003A FICDO1043A: app station on the manual leg; snapshot 12.PNG 149.7 MW: -, 12.PNG 149.7 MW: M, 6.PNG 149.8 MW: -; 6.PNG 149.8 MW: M
