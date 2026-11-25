# Phase 8 slice 2: package PLC, CTCS at watchdog (2026-11-26 ~5:40 AM PHT)

Batayan: basa ni YUA sa PC ng mga manual ng package (CTCS control philosophy GI 3862 106 09 014 Rev 0, fly ash O&M L5-1, ESP O&M L19-1) at ng Modbus lists. Walang program backup na binuksan. Walang ladder, kaya ang hindi nakasulat ay NO-SOURCE.

## Ano ang ginawa
- Bagong `src/analog/engine/pkg.js`: ang mga package PLC ay tumatakbo bilang sariling maliit na programa. Binabasa ng DCS ang value nila ayon sa Modbus address.
- Address: sa listahan ay numero ang address, kaya ang 40001.1 ay bit 10 at ang 40001.01 ay bit 1.
- CTCS A at B (condenser tube cleaning), buong sequence:
  - Magsisimula lang kapag ready: REMOTE AUTO, walang fail o backwash, at may permiso ang DCS na may tumatakbong seawater pump (DITL-119 DOP-CTCS100x).
  - Ang AUTO START / STOP ng DCS ay galing sa DITL-119.
  - Ang sequence: bubukas ang N01 kasabay ng ball pump F01, watering 5 min sa unang start, bubukas ang N02 (umiikot na ang mga bola), run 8 oras, magsasara ang N02, collection 30 min, magsasara ang N01, papatay ang F01, idle 16 oras, saka uulit nang walang watering.
  - Sa 150 MW ay naka-STOP ito, tulad sa snapshot ng planta.
- Ang watchdog (heartbeat) ng fly ash, ESP at CTCS ay nagbabago bawat palitan.

## Hinuha (may marka sa code)
- AUTO STOP: ang detalye bawat phase (CT-CP 5.1 ~ 5.4) ay wala sa buod. Ang stop habang tumatakbo ay sumusunod sa ayos ng pagtatapos ng cycle.
- Ang permiso ng CTCS-B: walang pin ang reader para sa O.0289, kaya kinukuha nito ang permiso ng A. Pareho silang galing sa M.079C. Finding ito para sa reader.

## NO-SOURCE
- Kung gaano kadalas ang palitan ng watchdog: isang beses bawat scan.
- Walang model ng dumi ng screen. Malinis na 30 mbar, kaya walang kusang backwash.
- Walang model pa ng failure (overload, torque).

## Bilang
- Package Modbus na may value: 0 -> 22 sa 562 (CTCS 18, fly ash 2, ESP 2).

## Sinubok
- `tests/lanes/pkg/pkg-modbus.cjs`: pasado (12). Kasama rito ang address bits, ang estado sa 150 MW, ang ayos at oras ng cycle, ang stop at ang watchdog.
- trace-gate, architecture, scope-doc, no-fit at build: pasado.
- gen_panel (browser): pasado.
- Page check: ready = 1, naka-init sa 150 MW, walang error.
- Hindi sinubok: ang pindot ng AUTO START mula sa HMI hanggang sa CTCS sa live app.

## Susunod
- ESP (start / stop order, rapping 2 min on at 7 ~ 31 min off, TR protection), saka fly ash (tank cycle at limits).
