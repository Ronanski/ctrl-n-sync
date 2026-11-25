# Phase 8 slice 4: fly ash package PLC (2026-11-26 ~6:15 AM PHT)

Batayan: fly ash O&M L5-1 section 4 at drawings E10209-3, basa ni YUA sa PC.

## Ano ang ginawa (`src/analog/engine/pkg.js`)
- PS-PA1700 plant air tank pressure low: 1 kapag mas mababa sa 4 bar (manual), mula sa plant air model ng unit 1. Sa 150 MW: 0.
- Pressurized fail at transported fail ng 11 tank, at ang fault / trip bits ng silo, vent filter at unloader: 0, dahil wala pang fault model.
- Utos ng DCS (start / stop PB ng 11 tank, alarm reset / ack): 0, dahil wala pang screen na nagpapadala.

## NO-SOURCE (walang value)
- Ang tank cycle. Alam ang ayos ng mga hakbang, pero wala sa docs ang filling time, ang oras ng pressurized / transported fail at ang delay t. Kaya walang value pa ang valve, level, vibrator at purge valve.
- Ang laki ng silo at ang unloading, kaya walang value ang silo level at ang mga switch nito.
- Ang wet unloader sequence, ang REMOTE mode at ang Level / L+T mode.

## Bilang
- Package Modbus na may value: 214 -> 270 sa 562 (fly ash 58).

## Sinubok
- `tests/lanes/pkg/pkg-modbus.cjs`: pasado (18).
- Hindi sinubok sa live app.
