# src/data/alarms: alarm rows with priority (PR 0, lane plan 2026-11-25)

One JSON per alarm group (lane 5 owns the folder). Built into `window.LANE_ALARMS`; `AN.almPri` (src/analog/engine/alarm-pri.js) uses
the row's priority for an alarm whose name holds the tag (and whose level matches, when `lv` is given); every other alarm keeps the
derived ISA-18.2 priority.

    [ { "tag": "PT-MS1002", "lv": "HIGH-HIGH", "p": 2, "src": "Alarm List 20160912 row 123" } ]

`p`: 1 EMERGENCY, 2 HIGH, 3 MEDIUM, 4 LOW. Every row has `src`.
