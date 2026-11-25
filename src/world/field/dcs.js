/* Lane 6 HMI (EIMI), field signals of the station DCS itself (src/world/field/README.md): the system alarm contact of every control
   cabinet and panel, wired to a digital input of another station. The app has no model of the cabinet hardware (power units, fans,
   hubs), so each contact is a field state: normal in service, the instructor sets the fault (Plant menu).
   THE CONTACTS, from the hardware drawings of the station (LMYP-1 DCS TCS, 04.FCS, 08.ANP, 10.GCS and the SER / PDP sheets):
   - controller, input / output and gateway cabinets: the SYSTEM ALM output of the alarm unit HALMA-12 (terminal TB2 1, 2). Its inputs are
     the main power unit, the network hubs, the fuse board, the fan unit and the temperature alarm: K1AU3-E2-0-109 sheets 6, 12, 18 ~,
     K1AU3-E2-0-115 sheets 4, 10, K1AU3-E2-0-112 sheet 5. The drawing gives the name, not the rest position; it is read as made on alarm,
     like the two relay panels below whose rest position is drawn.
   - alarm relay panel ARP1 and interlock relay panel IRP1: b contacts (normally closed) of the power fail relays, energized in service,
     so the contact is open in service and closes on a fault: K1AU3-E2-0-114 sheets 6, 7; DITL-42 input row 7 takes IRP1-POWALM as 1 =
     power supply fault.
   - power distribution panel PDP1: the healthy contacts of its two power supplies in series (TB5-3, 1-2 and 3-4 through the link 2-3):
     K1AU3-E2-0-111 sheet 7. The same contact of this power unit is an input of the alarm units, whose unused inputs are bridged
     (bridged = healthy), so it is closed while healthy: the input is 1 in service and 0 on a fault, although its name is "fault". */
const NAME = 'Electrical and generator';
const HW = 'K1AU3-E2-0-109 (control station cabinets), alarm unit HALMA-12 SYSTEM ALM, TB2 1, 2';
const GW = 'K1AU3-E2-0-115 (gateway cabinets), alarm unit HALMA-12 SYSTEM ALM, TB2 1, 2';
/* [station, address, tag, the fault in words, drawing, normal] */
const P = [
  [1, 'I.005B', 'ARP1-SYSERR', 'Alarm relay panel ARP1: power or fuse fault', 'K1AU3-E2-0-114 sheet 6, ALMTB1 1, 2'],
  [1, 'I.005C', 'IRP1-POWALM', 'Interlock relay panel IRP1: power supply fault', 'K1AU3-E2-0-114 sheet 7, ALMTB2 1, 2; DITL-42 input row 7'],
  [1, 'I.005D', '1021-SYSERR', 'Control cabinet FCS1021 system alarm', HW],
  [1, 'I.005E', '1022-SYSERR', 'Control cabinet FCS1022 system alarm', HW],
  [1, 'I.005F', '1023-SYSERR', 'Control cabinet FCS1023 system alarm', HW],
  [2, 'I.093C', 'SER1-SYSERR', 'Sequence of events recorder SER1 system alarm', 'K1AU3-E2-0-112 sheet 5, TB2 1, 2'],
  [2, 'I.093D', '1031-SYSERR', 'Control cabinet FCS1031 system alarm', HW],
  [2, 'I.093E', '1032-SYSERR', 'Control cabinet FCS1032 system alarm', HW],
  [2, 'I.093F', '1033-SYSERR', 'Control cabinet FCS1033 system alarm', HW],
  [3, 'I.069D', '1041-SYSERR', 'Control cabinet FCS1041 system alarm', HW],
  [3, 'I.069E', '1042-SYSERR', 'Control cabinet FCS1042 system alarm', HW],
  [3, 'I.069F', 'PDP-PLOSS', 'Power distribution panel PDP1: power supply fault', 'K1AU3-E2-0-111 sheet 7, TB5-3', 1],
  [4, 'I.057A', 'GCS10DE-SYSERR', 'Gateway cabinet GCS10D / 10E system alarm', GW],
  [4, 'I.057B', 'GCS10F-SYSERR', 'Gateway cabinet GCS10F system alarm', GW],
  [4, 'I.057C', '1051-SYSERR', 'Control cabinet FCS1051 system alarm', HW],
  [4, 'I.057D', '1011-SYSERR', 'Control cabinet FCS1011 system alarm', HW],
  [4, 'I.057E', '1012-SYSERR', 'Control cabinet FCS1012 system alarm', HW],
  [4, 'I.057F', '1013-SYSERR', 'Control cabinet FCS1013 system alarm', HW]
];
FIELD.state(
  lane,
  P.map(([s, a, tag, t, src, n]) => ({ id: 'dcs.' + tag, tag, normal: n ? 1 : 0, t, g: NAME, src: 'IO list STN10' + s + ' ' + a + '; ' + src }))
);
FIELD.add(
  lane,
  P.map(([s, a, tag, t, src, n]) => ({
    stn: s,
    di: 1,
    tag,
    v: (U, X) => X.state('dcs.' + tag),
    rel: n ? 'healthy contacts in series: 1 in service, 0 on a fault' : 'alarm contact: 0 in service, 1 on an alarm',
    src: 'IO list STN10' + s + ' ' + a + '; ' + src
  }))
);
/* the two relay panel inputs on DITL-42 (annunciator): its input rows 6 "ARP SYSTEM ALARM" and 7 "IRP POWER SUPPLY FAULT" carry no tag,
   so the row is found by its first word on that sheet. 1 = alarm, the same contact as above */
FIELD.add(
  lane,
  [
    ['ARP', 'ARP1-SYSERR', 'input row 6 "ARP SYSTEM ALARM"'],
    ['IRP', 'IRP1-POWALM', 'input row 7 "IRP POWER SUPPLY FAULT"']
  ].map(([tag, id, row]) => ({
    stn: 1,
    di: 1,
    tag,
    sheet: 'DITL-42',
    v: (U, X) => X.state('dcs.' + id),
    rel: 'the contact ' + id,
    src: 'DITL-42 ' + row + '; K1AU3-E2-0-114'
  }))
);
