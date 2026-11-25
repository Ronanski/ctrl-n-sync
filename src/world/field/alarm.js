/* src/world/field/alarm.js: LANE 5 ALARMS AND CURVES (AKIHO). The alarm list points whose I/O address had no live value while the engine
   already computes the value (src/world/field/README.md, one signal, one source).
   Each row is a transmitter of the alarm list (src/data/alarms) that is on no ABC / DITL sheet: the plant model writes its value only into
   its display map U.tt or a plant model key (the HMI pages read it there, src/ui/plant/hx "tt:<tag>" / "ux:<key>" / key). The row gives that same value to the DCS I/O
   address, so the address, its alarm row and the page read one source. Nothing is computed here: the physics and its document are at the
   engine line named in rel (unit.js anLphStep / anHxTagStep / anCdTagStep / anFwTagStep, boiler.js anDieselOilStep / anFanStep /
   anAphStep). A key the engine has not written yet gives NaN, which writes nothing.
   Not here (QA count 2026-11-25 11:10, 97 alarm points with no live value): the points with no engine value; their list is in
   /mnt/project-files/lanes/lane5/alarm-no-live-2026-11-25.md (for lane 0 model values, lanes 3 / 4 field rows, or no document). */
const num = v => (typeof v === 'number' && isFinite(v) ? v : NaN);
const tt = (U, k) => {
  const v = U && U.tt ? U.tt[k] : NaN;
  return typeof v === 'number' && isFinite(v) ? v : NaN;
};
FIELD.add(lane, [
  { stn: 1, ai: 'AI0161', tag: 'PT-FA1078', v: U => tt(U, 'PT-FA1078'), rel: 'engine display transmitter U.tt[\'PT-FA1078\'] (boiler.js anFanStep)', src: 'IO list stn 1 AI0161 PT-FA1078; alarm list group air' },
  { stn: 1, ai: 'AI0144', tag: 'LT-CL1008-A', v: U => tt(U, 'LT-CL1008-A'), rel: 'engine display transmitter U.tt[\'LT-CL1008-A\'] (unit.js anHxTagStep)', src: 'IO list stn 1 AI0144 LT-CL1008-A; alarm list group coal' },
  { stn: 1, ai: 'AI0272', tag: 'LT-CL1008-B', v: U => tt(U, 'LT-CL1008-B'), rel: 'engine display transmitter U.tt[\'LT-CL1008-B\'] (unit.js anHxTagStep)', src: 'IO list stn 1 AI0272 LT-CL1008-B; alarm list group coal' },
  { stn: 1, ai: 'AI0400', tag: 'LT-CL1008-C', v: U => tt(U, 'LT-CL1008-C'), rel: 'engine display transmitter U.tt[\'LT-CL1008-C\'] (unit.js anHxTagStep)', src: 'IO list stn 1 AI0400 LT-CL1008-C; alarm list group coal' },
  { stn: 2, ai: 'AI0422', tag: 'PT-CD1122', v: U => tt(U, 'PT-CD1122'), rel: 'engine display transmitter U.tt[\'PT-CD1122\'] (unit.js anCdTagStep)', src: 'IO list stn 2 AI0422 PT-CD1122; alarm list group condensate' },
  { stn: 2, ai: 'AI0544', tag: 'FT-CD1115', v: U => tt(U, 'FT-CD1115'), rel: 'engine display transmitter U.tt[\'FT-CD1115\'] (unit.js anCdTagStep)', src: 'IO list stn 2 AI0544 FT-CD1115; alarm list group condensate' },
  { stn: 2, ai: 'AI0545', tag: 'FT-CD1122', v: U => tt(U, 'FT-CD1122'), rel: 'engine display transmitter U.tt[\'FT-CD1122\'] (unit.js anCdTagStep)', src: 'IO list stn 2 AI0545 FT-CD1122; alarm list group condensate' },
  { stn: 2, ai: 'AI0833', tag: 'TT-CD1101', v: U => tt(U, 'TT-CD1101'), rel: 'engine display transmitter U.tt[\'TT-CD1101\'] (unit.js anLphStep)', src: 'IO list stn 2 AI0833 TT-CD1101; alarm list group condensate' },
  { stn: 2, ai: 'AI0834', tag: 'TT-CD1102', v: U => tt(U, 'TT-CD1102'), rel: 'engine display transmitter U.tt[\'TT-CD1102\'] (unit.js anLphStep)', src: 'IO list stn 2 AI0834 TT-CD1102; alarm list group condensate' },
  { stn: 2, ai: 'AI0835', tag: 'TT-CD1103-1', v: U => tt(U, 'TT-CD1103-1'), rel: 'engine display transmitter U.tt[\'TT-CD1103-1\'] (unit.js anLphStep)', src: 'IO list stn 2 AI0835 TT-CD1103-1; alarm list group condensate' },
  { stn: 2, ai: 'AI0836', tag: 'TT-CD1103-2', v: U => tt(U, 'TT-CD1103-2'), rel: 'engine display transmitter U.tt[\'TT-CD1103-2\'] (unit.js anLphStep)', src: 'IO list stn 2 AI0836 TT-CD1103-2; alarm list group condensate' },
  { stn: 2, ai: 'AI0822', tag: 'TT-CD1104', v: U => tt(U, 'TT-CD1104'), rel: 'engine display transmitter U.tt[\'TT-CD1104\'] (unit.js anCdTagStep)', src: 'IO list stn 2 AI0822 TT-CD1104; alarm list group condensate' },
  { stn: 2, ai: 'AI0838', tag: 'TT-CD1119', v: U => tt(U, 'TT-CD1119'), rel: 'engine display transmitter U.tt[\'TT-CD1119\'] (unit.js anCdTagStep)', src: 'IO list stn 2 AI0838 TT-CD1119; alarm list group condensate' },
  { stn: 2, ai: 'AI0821', tag: 'TT-CD1122', v: U => tt(U, 'TT-CD1122'), rel: 'engine display transmitter U.tt[\'TT-CD1122\'] (unit.js anLphStep)', src: 'IO list stn 2 AI0821 TT-CD1122; alarm list group condensate' },
  { stn: 1, ai: 'AI0274', tag: 'BT-DO1043-A', v: U => tt(U, 'BT-DO1043-A'), rel: 'engine display transmitter U.tt[\'BT-DO1043-A\'] (boiler.js anDieselOilStep)', src: 'IO list stn 1 AI0274 BT-DO1043-A; alarm list group diesel-oil' },
  { stn: 1, ai: 'AI0435', tag: 'BT-DO1043-B', v: U => tt(U, 'BT-DO1043-B'), rel: 'engine display transmitter U.tt[\'BT-DO1043-B\'] (boiler.js anDieselOilStep)', src: 'IO list stn 1 AI0435 BT-DO1043-B; alarm list group diesel-oil' },
  { stn: 1, ai: 'AI0145', tag: 'PT-BR1130', v: U => tt(U, 'PT-BR1130'), rel: 'engine display transmitter U.tt[\'PT-BR1130\'] (unit.js anHxTagStep)', src: 'IO list stn 1 AI0145 PT-BR1130; alarm list group drum' },
  { stn: 1, ai: 'AI0275', tag: 'PT-BR1150', v: U => tt(U, 'PT-BR1150'), rel: 'engine display transmitter U.tt[\'PT-BR1150\'] (unit.js anHxTagStep)', src: 'IO list stn 1 AI0275 PT-BR1150; alarm list group drum' },
  { stn: 1, ai: 'AI0645', tag: 'TT-BR1040', v: U => tt(U, 'TT-BR1040'), rel: 'engine display transmitter U.tt[\'TT-BR1040\'] (unit.js anHxTagStep)', src: 'IO list stn 1 AI0645 TT-BR1040; alarm list group drum' },
  { stn: 1, ai: 'AI0646', tag: 'TT-BR1110', v: U => tt(U, 'TT-BR1110'), rel: 'engine display transmitter U.tt[\'TT-BR1110\'] (unit.js anHxTagStep)', src: 'IO list stn 1 AI0646 TT-BR1110; alarm list group drum' },
  { stn: 1, ai: 'AI0608', tag: 'TT-BR1120-1', v: U => tt(U, 'TT-BR1120-1'), rel: 'engine display transmitter U.tt[\'TT-BR1120-1\'] (unit.js anHxTagStep)', src: 'IO list stn 1 AI0608 TT-BR1120-1; alarm list group drum' },
  { stn: 1, ai: 'AI0640', tag: 'TT-BR1120-2', v: U => tt(U, 'TT-BR1120-2'), rel: 'engine display transmitter U.tt[\'TT-BR1120-2\'] (unit.js anHxTagStep)', src: 'IO list stn 1 AI0640 TT-BR1120-2; alarm list group drum' },
  { stn: 2, ai: 'AI0560', tag: 'PT-TS1013', v: U => tt(U, 'PT-TS1013'), rel: 'engine display transmitter U.tt[\'PT-TS1013\'] (unit.js anFwTagStep)', src: 'IO list stn 2 AI0560 PT-TS1013; alarm list group extraction' },
  { stn: 2, ai: 'AI0561', tag: 'PT-TS1017', v: U => tt(U, 'PT-TS1017'), rel: 'engine display transmitter U.tt[\'PT-TS1017\'] (unit.js anFwTagStep)', src: 'IO list stn 2 AI0561 PT-TS1017; alarm list group extraction' },
  { stn: 2, ai: 'AI0563', tag: 'PT-TS1026', v: U => tt(U, 'PT-TS1026'), rel: 'engine display transmitter U.tt[\'PT-TS1026\'] (unit.js anFwTagStep)', src: 'IO list stn 2 AI0563 PT-TS1026; alarm list group extraction' },
  { stn: 2, ai: 'AI0816', tag: 'TT-TS1011', v: U => tt(U, 'TT-TS1011'), rel: 'engine display transmitter U.tt[\'TT-TS1011\'] (unit.js anFwTagStep)', src: 'IO list stn 2 AI0816 TT-TS1011; alarm list group extraction' },
  { stn: 2, ai: 'AI0817', tag: 'TT-TS1014', v: U => tt(U, 'TT-TS1014'), rel: 'engine display transmitter U.tt[\'TT-TS1014\'] (unit.js anFwTagStep)', src: 'IO list stn 2 AI0817 TT-TS1014; alarm list group extraction' },
  { stn: 2, ai: 'AI0818', tag: 'TT-TS1018', v: U => tt(U, 'TT-TS1018'), rel: 'engine display transmitter U.tt[\'TT-TS1018\'] (unit.js anFwTagStep)', src: 'IO list stn 2 AI0818 TT-TS1018; alarm list group extraction' },
  { stn: 2, ai: 'AI0819', tag: 'TT-TS1023', v: U => tt(U, 'TT-TS1023'), rel: 'engine display transmitter U.tt[\'TT-TS1023\'] (unit.js anFwTagStep)', src: 'IO list stn 2 AI0819 TT-TS1023; alarm list group extraction' },
  { stn: 2, ai: 'AI0820', tag: 'TT-TS1027', v: U => tt(U, 'TT-TS1027'), rel: 'engine display transmitter U.tt[\'TT-TS1027\'] (unit.js anFwTagStep)', src: 'IO list stn 2 AI0820 TT-TS1027; alarm list group extraction' },
  { stn: 1, ai: 'AI0259', tag: 'PT-FW1160', v: U => tt(U, 'PT-FW1160'), rel: 'engine display transmitter U.tt[\'PT-FW1160\'] (unit.js anFwTagStep)', src: 'IO list stn 1 AI0259 PT-FW1160; alarm list group feedwater' },
  { stn: 1, ai: 'AI0401', tag: 'PT-FG1009-A2', v: U => tt(U, 'PT-FG1009-A2'), rel: 'engine display transmitter U.tt[\'PT-FG1009-A2\'] (unit.js anHxTagStep)', src: 'IO list stn 1 AI0401 PT-FG1009-A2; alarm list group flue-gas' },
  { stn: 1, ai: 'AI0402', tag: 'PT-FG1009-B2', v: U => tt(U, 'PT-FG1009-B2'), rel: 'engine display transmitter U.tt[\'PT-FG1009-B2\'] (unit.js anHxTagStep)', src: 'IO list stn 1 AI0402 PT-FG1009-B2; alarm list group flue-gas' },
  { stn: 1, ai: 'AI0162', tag: 'PT-FG1121', v: U => tt(U, 'PT-FG1121'), rel: 'engine display transmitter U.tt[\'PT-FG1121\'] (boiler.js anFanStep)', src: 'IO list stn 1 AI0162 PT-FG1121; alarm list group flue-gas' },
  { stn: 1, ai: 'AI0163', tag: 'PT-FG1134', v: U => tt(U, 'PT-FG1134'), rel: 'engine display transmitter U.tt[\'PT-FG1134\'] (boiler.js anFanStep)', src: 'IO list stn 1 AI0163 PT-FG1134; alarm list group flue-gas' },
  { stn: 1, ai: 'AI0768', tag: 'DPT-FG1052-5', v: U => tt(U, 'DPT-FG1052-5'), rel: 'engine display transmitter U.tt[\'DPT-FG1052-5\'] (boiler.js anFanStep)', src: 'IO list stn 1 AI0768 DPT-FG1052-5; alarm list group flue-gas' },
  { stn: 1, ai: 'AI0471', tag: 'FT-FG1057-7', v: U => tt(U, 'FT-FG1057-7'), rel: 'engine display transmitter U.tt[\'FT-FG1057-7\'] (boiler.js anAphStep)', src: 'IO list stn 1 AI0471 FT-FG1057-7; alarm list group flue-gas' },
  { stn: 1, ai: 'AI0469', tag: 'AT-FG1057-4', v: U => tt(U, 'AT-FG1057-4'), rel: 'engine display transmitter U.tt[\'AT-FG1057-4\'] (boiler.js anAphStep)', src: 'IO list stn 1 AI0469 AT-FG1057-4; alarm list group flue-gas' },
  { stn: 1, ai: 'AI0455', tag: 'AT-FG1131', v: U => tt(U, 'AT-FG1131'), rel: 'engine display transmitter U.tt[\'AT-FG1131\'] (boiler.js anAphStep)', src: 'IO list stn 1 AI0455 AT-FG1131; alarm list group flue-gas' },
  { stn: 2, ai: 'AI0918', tag: 'TT-MS1007', v: U => tt(U, 'TT-MS1007'), rel: 'engine display transmitter U.tt[\'TT-MS1007\'] (unit.js anHxTagStep)', src: 'IO list stn 2 AI0918 TT-MS1007; alarm list group main-steam' },
  { stn: 2, ai: 'AI0530', tag: 'PT-HR1001', v: U => tt(U, 'PT-HR1001'), rel: 'engine display transmitter U.tt[\'PT-HR1001\'] (unit.js anHxTagStep)', src: 'IO list stn 2 AI0530 PT-HR1001; alarm list group reheat' },
  /* the same engine values read by their plant model key (the key the HMI page shows for the tag) */
  { stn: 1, ai: 'AI0160', tag: 'PT-FA1075', v: U => num(U.fnPaP), rel: 'U.fnPaP (boiler.js anFanStep)', src: 'IO list stn 1 AI0160 PT-FA1075; alarm list group air' },
  { stn: 3, ai: 'AI0386', tag: 'LT-BH1750', v: U => num(U.bhSilo), rel: 'U.bhSilo (unit.js bottom ash silo)', src: 'IO list stn 3 AI0386 LT-BH1750; alarm list group bottom-ash' },
  { stn: 2, ai: 'AI0678', tag: 'TT-CD1110-1', v: U => num(U.cdT), rel: 'U.cdT (unit.js AN_CD condenser saturation (hotwell steam))', src: 'IO list stn 2 AI0678 TT-CD1110-1; alarm list group condensate' },
  { stn: 2, ai: 'AI0837', tag: 'TT-CD1118', v: U => num(U.cdT), rel: 'U.cdT (unit.js AN_CD condenser saturation (condensate after the pumps))', src: 'IO list stn 2 AI0837 TT-CD1118; alarm list group condensate' },
  { stn: 2, ai: 'AI0832', tag: 'TT-CD1120', v: U => num(U.tt['TT-CD1101']), rel: 'U.tt[\'TT-CD1101\'] (unit.js anLphStep: gland steam condenser outlet = No.1 LP heater inlet (hx-sys-cd.js note))', src: 'IO list stn 2 AI0832 TT-CD1120; alarm list group condensate' },
  { stn: 1, ai: 'AI0416', tag: 'PT-FG1141-A', v: U => num((U.fnGi || [])[0]), rel: 'U.fnGi[0] (boiler.js anFanStep)', src: 'IO list stn 1 AI0416 PT-FG1141-A; alarm list group flue-gas' },
  { stn: 1, ai: 'AI0772', tag: 'PT-FG1141-B', v: U => num((U.fnGi || [])[1]), rel: 'U.fnGi[1] (boiler.js anFanStep)', src: 'IO list stn 1 AI0772 PT-FG1141-B; alarm list group flue-gas' },
  { stn: 1, ai: 'AI0432', tag: 'PT-FG1151', v: U => num(U.fnGo), rel: 'U.fnGo (boiler.js anFanStep)', src: 'IO list stn 1 AI0432 PT-FG1151; alarm list group flue-gas' },
  { stn: 1, ai: 'AI0389', tag: 'DPT-FG1083', v: U => num((U.dpUp || [])[0]), rel: 'U.dpUp[0] (unit.js furnace DP)', src: 'IO list stn 1 AI0389 DPT-FG1083; alarm list group flue-gas' },
  { stn: 1, ai: 'AI0390', tag: 'DPT-FG1084', v: U => num((U.dpLo || [])[0]), rel: 'U.dpLo[0] (unit.js furnace DP)', src: 'IO list stn 1 AI0390 DPT-FG1084; alarm list group flue-gas' },
  { stn: 1, ai: 'AI0448', tag: 'DPT-FG1183', v: U => num((U.dpUp || [])[1]), rel: 'U.dpUp[1] (unit.js furnace DP)', src: 'IO list stn 1 AI0448 DPT-FG1183; alarm list group flue-gas' },
  { stn: 1, ai: 'AI0449', tag: 'DPT-FG1184', v: U => num((U.dpLo || [])[1]), rel: 'U.dpLo[1] (unit.js furnace DP)', src: 'IO list stn 1 AI0449 DPT-FG1184; alarm list group flue-gas' },
  { stn: 4, ai: 'AI0434', tag: 'PT-LM1811', v: U => num(U.lmPl), rel: 'U.lmPl (boiler.js limestone conveying)', src: 'IO list stn 4 AI0434 PT-LM1811; alarm list group limestone' },
  { stn: 4, ai: 'AI0433', tag: 'PT-LM1812', v: U => num(U.lmPd), rel: 'U.lmPd (boiler.js limestone conveying)', src: 'IO list stn 4 AI0433 PT-LM1812; alarm list group limestone' },
  { stn: 4, ai: 'AI0432', tag: 'LT-LM1800', v: U => num(U.lmSilo), rel: 'U.lmSilo (boiler.js limestone conveying)', src: 'IO list stn 4 AI0432 LT-LM1800; alarm list group limestone' },
  { stn: 2, ai: 'AI0531', tag: 'PT-HR1011', v: U => num(U.Plpo), rel: 'U.Plpo (unit.js LP bypass outlet, PPE-14-0728 p2 point 5)', src: 'IO list stn 2 AI0531 PT-HR1011; alarm list group reheat' },
  { stn: 4, ai: 'AI0326', tag: 'AT-SP1007', v: U => num(U.sp1007), rel: 'U.sp1007 (unit.js water chemistry)', src: 'IO list stn 4 AI0326 AT-SP1007; alarm list group sampling' },
  { stn: 4, ai: 'AI0336', tag: 'AT-SP1008', v: U => num(U.sp1008), rel: 'U.sp1008 (unit.js water chemistry)', src: 'IO list stn 4 AI0336 AT-SP1008; alarm list group sampling' },
  { stn: 4, ai: 'AI0337', tag: 'AT-SP1009', v: U => num(U.sp1009), rel: 'U.sp1009 (unit.js water chemistry)', src: 'IO list stn 4 AI0337 AT-SP1009; alarm list group sampling' },
  { stn: 4, ai: 'AI0338', tag: 'AT-SP1010', v: U => num(U.sp1010), rel: 'U.sp1010 (unit.js water chemistry)', src: 'IO list stn 4 AI0338 AT-SP1010; alarm list group sampling' },
  { stn: 4, ai: 'AI0339', tag: 'AT-SP1011', v: U => num(U.sp1011), rel: 'U.sp1011 (unit.js water chemistry)', src: 'IO list stn 4 AI0339 AT-SP1011; alarm list group sampling' },
  { stn: 4, ai: 'AI0340', tag: 'AT-SP1012', v: U => num(U.sp1012), rel: 'U.sp1012 (unit.js water chemistry)', src: 'IO list stn 4 AI0340 AT-SP1012; alarm list group sampling' },
  { stn: 4, ai: 'AI0352', tag: 'AT-SP1015', v: U => num(U.sp1015), rel: 'U.sp1015 (unit.js water chemistry)', src: 'IO list stn 4 AI0352 AT-SP1015; alarm list group sampling' },
  { stn: 4, ai: 'AI0353', tag: 'AT-SP1016', v: U => num(U.sp1016), rel: 'U.sp1016 (unit.js water chemistry)', src: 'IO list stn 4 AI0353 AT-SP1016; alarm list group sampling' },
  { stn: 4, ai: 'AI0354', tag: 'AT-SP1017', v: U => num(U.sp1017), rel: 'U.sp1017 (unit.js water chemistry)', src: 'IO list stn 4 AI0354 AT-SP1017; alarm list group sampling' },
  { stn: 4, ai: 'AI0357', tag: 'AT-SP1020', v: U => num(U.sp1020), rel: 'U.sp1020 (unit.js water chemistry)', src: 'IO list stn 4 AI0357 AT-SP1020; alarm list group sampling' },
  { stn: 3, ai: 'AI0432', tag: 'PT-SD1800', v: U => num(U.sdP), rel: 'U.sdP (boiler.js sand conveying)', src: 'IO list stn 3 AI0432 PT-SD1800; alarm list group sand' },
  { stn: 3, ai: 'AI0387', tag: 'LT-SD1800', v: U => num(U.sdSilo), rel: 'U.sdSilo (boiler.js sand conveying)', src: 'IO list stn 3 AI0387 LT-SD1800; alarm list group sand' },
  { stn: 2, ai: 'AI0549', tag: 'PT-SB1040', v: U => num(U.sbA && U.sbA.p40), rel: 'U.sbA && U.sbA.p40 (unit.js air heater sootblowers AN_SB.aph)', src: 'IO list stn 2 AI0549 PT-SB1040; alarm list group sootblow' },
  { stn: 2, ai: 'AI0550', tag: 'PT-SB1042', v: U => num(U.sbA && U.sbA.p42), rel: 'U.sbA && U.sbA.p42 (unit.js air heater sootblowers AN_SB.aph)', src: 'IO list stn 2 AI0550 PT-SB1042; alarm list group sootblow' }
]);
