# src/data/alarms: alarm rows with priority (PR 0, lane plan 2026-11-25)

One JSON per alarm group (lane 5 owns the folder). Built into `window.LANE_ALARMS`; `AN.almPri` (src/analog/engine/alarm-pri.js) uses
the row's priority for an alarm whose name holds the tag (and whose level matches, when `lv` is given); every other alarm keeps the
derived ISA-18.2 priority.

    [ { "tag": "PT-MS1002", "lv": "HIGH-HIGH", "p": 2, "src": "Alarm List 20160912 row 123" } ]

`p`: 1 EMERGENCY, 2 HIGH, 3 MEDIUM, 4 LOW. Every row has `src`.

## Lane 5 rows (2026-11-25, beta.425)

The group files hold the points of "Alarm List _20160912-DCS temporary value updating.xls" (15 sheets, 717 tags) that have an I/O
address in the app and a set point or a switch, and that no ABC alarm block alarms yet: 371 points, one row per level (705 rows).

    { "tag": "PT-MS1002", "lv": "HIGH", "p": 3, "sp": 130, "d": "...", "stn": 101, "addr": "AI0131", "src": "Alarm List _20160912 sheet PT, PD-011" }
    { "tag": "LSL-CH1101", "lv": "LOW", "p": 3, "on": 1, "d": "...", "stn": 101, "addr": "I.0131", "src": "Alarm List _20160912 sheet LS, PD-042" }

- `sp`: the list's DCS set point (the last line of the cell, the "(x-dcs)" value). `on: 1`: a switch, the alarm is the input at 1.
- `io`: the I/O list tag when the list names the element (TE-FA1053-U1 = TT-FA1053-U).
- `p` follows the rule of alarm-pri.js (HH / LL 2, H / L 3, a switch ALARM 4); the list has no priority column.
- Not in the files: 94 points already alarmed by an ABC alarm block, 55 switches already on DITL logic, 146 points with no set point in
  the list, 34 excluded (compressor house, WTP, coal handling), 17 tags not in the DCS I/O list. Work list: lane 5, 2026-11-25.
- Analog rows raise their alarm line (src/analog/engine/alarm-pri.js AN.laneAlm, one call in the alarm scan) only from a LIVE value:
  it changes while the plant time runs. A point nothing writes stays silent. The switch rows give the priority only for now.

Tests: tests/lanes/lane5/alarm-rows.cjs, alarm-live.cjs.
