# Phase 6 slice 12: address na may station sa drawing ("S4 O.1322") (2026-11-26 PHT)

Ano ang nakikita ng operator: walang bagong ilaw sa screen. Ang naayos ay ang bilang (QA trace, ang awtomatikong bilang ng pagkakabit):
ang mga window ng annunciator (ang panel ng alarm lamp sa control room, station 104) na isinusulat ng logic ng ibang station ay kinikilala
na. Halimbawa: ang DITL-26A (PAF, station 103) ay may output na "PAF STOPPED" na isinulat ng drawing bilang "S4 O.1322", ibig sabihin
address O.1322 ng station 104 (OPC-ANN-A3). Dati binabasa ito ng bilang bilang O.1322 ng station 103, kaya "walang kabit".

- Patakaran: ang I/O address na may "S<n>" ay sa station na iyon lang. Ang memory (M. / B.) na may "S<n>" ay broadcast (parehong numero
  sa dalawang station, hal. DITL-12 station 104 "STATION WIRING TO: S1 M.3412"), kaya nasa sheet ito para sa dalawa.
- Nagbago: 39 I/O point (33 annunciator window at 6 alarm output na dati ay "model / HMI only" lang), 25 memory address na ngayon ay nasa
  sheet. Walang point na bumaba ang estado (sinuri isa-isa laban sa bilang bago ang ayos).
- Ikalawang ayos: ang station ay binabasa sa harap mismo ng address kahit may ibang salita bago nito sa parehong cell ("PAF BEARING
  TEMP HIGH S4 O.1361"): 15 window pa (bearing temperature ng fan, BFWP stopped / auto start, make-up pump, diesel oil pump). Dahil dito,
  5 MIS contact (stopped) ng fan sa DITL-03B na dati "station unsure" ay station 103 na (nakakabit), at ang MIL-FA1053-1 (PAF inlet
  damper remote, STN101 I.0049) ay lumabas na tunay na walang kabit: ginawang field state, normal 1 (remote), kagaya ng SAF damper.
- Bilang: nakakabit 1800 -> 1853; may value 2195 -> 2249; memory nasa sheet 3046 -> 3072; hindi nakakabit 92 -> 49; B2 34 -> 26.
- Natitira sa annunciator: ANN-TEST / ACK / RESET (I.1281 ~ 1283), BUZZER-OUT, OPC-ANN-C1 (deaerator level L.L.), at ang 26 window na
  walang pangalan sa I/O list (spare).
- Hindi sinubok: sa browser (walang nagbago sa app mismo; tools/trace lang).
