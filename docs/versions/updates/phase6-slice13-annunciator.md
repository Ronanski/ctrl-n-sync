# Phase 6 slice 13: annunciator ng operator console (2026-11-26 PHT)

Ano ang nakikita ng operator: walang bagong ilaw. Inayos ang talaan at ang bilang ng annunciator (ang panel ng alarm lamp sa control room).

- **21 window na SPARE (ekstra):** OPC-ANN-C10, G8 ~ G10, I4 ~ I10, J1 ~ J10 (STN104 O.133D, O.1403 ~ 1405, O.1413 ~ 141F, O.1440 ~ 1443).
  Sa I/O list at sa wiring list ay may address at pangalan ng channel pero walang serbisyo; walang drawing, alarm list o memory list na
  nagbibigay ng gawain. Nakatala sa `src/data/io-spare.json` kasama ang source. Hindi sila binigyan ng gawain sa app. Binabantayan ng
  `tests/lanes/qa/tag-db.cjs`: bagsak kapag may serbisyo na sa I/O list ang isang point na tinawag na spare.
- **Window C1 "DEAERATOR TANK LEVEL L.L."** (O.1334, sa DITL-23B "S4 O.1334"): nakakabit na. Napagkamalan ng bilang na ang "C1" ay
  "machine C"; ang pangalan ng window ay puwesto sa panel (row C, window 1), hindi makina.
- **ANN-TEST / ANN-ACK / ANN-RESET** (STN104 I.1281 ~ 1283, wiring list "FROM OPC ANN", ANP1 TB111): push button, field state, normal =
  hindi pinindot (TEST 0, ACK 0; ang RESET ay "Not ANN-RESET" sa I/O list kaya 1 habang hindi pinindot).
- Hindi ginawa: BUZZER-OUT (O.145F, "TO OPC ANN"): ang sequence ng annunciator (kailan tumutunog) ay wala sa drawing.
- Bilang: hindi nakakabit na I/O 49 -> 24 (21 spare, 4 nakakabit / may value); B2 26 -> 23.
- Natitira 24: BUZZER-OUT at 23 na kailangan ng docs sa PC (ipinasa kay YUA ng coordinator).
