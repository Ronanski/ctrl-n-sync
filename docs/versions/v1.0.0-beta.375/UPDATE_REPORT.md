# LMYP OTS 1.0.0-beta.375 (ROSÉ, 2026-11-25)

Sumunod sa beta.374 (Jennie). UI lang (station), walang engine change.

## Ano ang bago

| # | Finding | Ano ang nangyari | Ayos | Rekomendasyon |
|---|---|---|---|---|
| 1 | Unlinked I/O map 2026-11-24: "Operator console annunciator" | Ang 100 window ng OPC annunciator (OPC-ANN-A1 ~ J10, DO O.1320 ~ O.1443) ay walang panel sa app | Bagong button na "Annunciator" sa alarm bar; popup na 10 x 10 ayon sa ANP1PB-03 (K1AU3-E2-0-113): pula rows A ~ C, dilaw rows D ~ J, 21 spare. Text at address galing sa I/O list ng app | Tapos |
| 2 | Saan galing ang ilaw | Bawat window ay sinusundan ang DITL output na papunta sa "OPC (ANN)" na may parehong address ("S4 O.xxxx"). "O.1330/133A" = machine A / B ng shared drawing | Basa mula sa drawing cells at mga label sa tabi ng output arrow | Tapos |
| 3 | Push buttons at buzzer | ANP1PB-04/07: TEST / ACK / RESET (I.1281 ~ 1283), buzzer RY1 sa O.145F (OPC1ANN-05) | Sequence ISA-18.1 M: bagong alarm = kumikislap + horn; Acknowledge = steady, tahimik; nananatiling ilaw hanggang Reset kahit clear na; Test = lahat ng ilaw habang hawak. Sa load ng start state, ang nakailaw na ay acknowledged | Tapos |
| 4 | 5 window na walang signal: A5, A6 (A/B-FA blower stopped), G2, G3, G4 (B/C/D bottom ash screw cooler stopped) | Walang DITL output sa app na papunta sa address nila (kulang ang B/C/D copy o ang sheet) | Naka-dashed border at "no signal" sa tooltip; hindi nagkukunwaring ilaw | Jennie: idagdag ang instance / output ng FA blower A/B at bottom ash screw cooler B/C/D para mabuhay ang 5 window |

## Tests

- tests/regress/station_annunciator.js (bago): 100 window, 30 pula, 21 spare, 74 of 79 may signal, walang kislap pagka-load ng 150 MW, make-up pump A STOP (DITL-112) -> H1 kislap + horn -> Acknowledge -> START -> "waiting for Reset" -> Reset -> dark, Test 79 of 79: ALL PASS
- station_warm_hot.js: ALL PASS
- build --check SAME, operator-text ok, no-fit 44 lumang fit, 0 bago

## Susunod

Ang natitirang UI-only tags sa unlinked I/O map (DCS diagnostics FCS / SER / PDP, lamps at buttons).
