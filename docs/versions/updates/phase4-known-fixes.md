# Phase 4: 9 of the 10 known tag differences closed (2026-11-25 ~8:40 PM PHT)

- Field rows MIR-L-1090 / 1091 / 1092, MIR-F-1091 (boiler.js) and ARP / IRP (dcs.js) keep the drawing's name as `tag` (it finds the
  row on the sheet) and now carry `io` = the I/O list name (MIR-L1090 STN103 I.0163, ... ARP1-SYSERR / IRP1-POWALM STN101 I.005B / I.005C).
- Alarm rows PSL-DO1043-A1 / C1 / D1 already carry `io` PSH-DO1043-x1 (the alarm list 20160912 writes PSL for the HIGH switch).
- tests/lanes/qa/tag-db.cjs checks `io` when a row has it. tag-db-known.json: 10 -> 1 (SI9990, loop list vs STN105 broadcast note; PC).
- No behaviour change: `io` is a new field nothing else reads; `tag` is unchanged.
