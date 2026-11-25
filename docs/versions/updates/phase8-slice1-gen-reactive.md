# Phase 8 slice 1: generator current, Mvar at field sa turbine Modbus (2026-11-26 ~4:55 AM PHT)

## Ano ang ginawa
- `src/analog/engine/tcs-gen.js`: kapag nakakabit sa grid (52G sarado), may sariling kuryente na ang generator.
  - Ginamit ang isang EMF sa likod ng Xd 1.92 (setting ng AVR, GEE-2015-0152 p6) at ang main transformer Xt 0.137 (14 % ng 180 MVA, K1AU3E1-0003). Ang grid ay matatag na bus.
  - Bago: laging 1.0 ang voltage sa grid at walang current, Mvar o power factor. Ngayon, binabantayan ng AVR ang tunay na terminal voltage.
  - On line, ang field ay sumusunod sa T'd 1.30 s.
  - Ang lumang save point ay nagsisimula sa field na tama para sa load nito, kaya walang biglang talon.
  - Papel ng derivation: project files `lanes/tcs-io/gen-reactive-model.md` (TSUBASA). Tumutugma sa V curves 310SD23-270 R1 sa loob ng 1.5 %, walang fitting.
- `src/digital/tce-io.js`: may value na ang generator current A / B / C (kA), Mvar, field current at field voltage sa TCS I/O at sa Modbus (Mvar 30133, at ang mga current ng DCS AI0791 / AI0855 / AI0887 at AI0775).
- Bagong test `tests/lanes/tcs-io/modbus-values.cjs`: binibilang ang Modbus rows na may value sa 150 MW (hindi puwedeng bumaba sa 213). Sinusuri rin na physical ang generator: current = P / (sqrt3 V pf), nasa loob ng rating, field nasa pagitan ng no load at ceiling.

## Sa 150 MW
- 6.37 kA, mga 9 Mvar, pf 0.998, field 8.9 A, 13.8 kV.
- Ang snapshot ng planta ay pf 0.977. Ang pagkakaiba ay galing sa voltage ng 230 kV grid, na NO-SOURCE (1.0 pu ang gamit). Hindi ito tinono.

## Bilang
- Turbine Modbus na may value sa 150 MW: 207 -> 213 sa 237.

## Natitira
- Power factor: hindi pa nabasa ang scale ng transducer (0.5 ~ 1.5, lag / lead).
- 16 metal temperature, expansion at rotor position ng turbine: walang model.
- 4 gland seal valve switch: wala sa gland model.
- 2 utos ng DCS (gland seal group start / stop): nasa "walang utos".
- Fly ash, ESP, CTCS, SCADA: address lang, walang value. Kailangan ng logic ng package (sa PC).

## Sinubok
- tcs-io, modbus-values, trace-gate, no-fit, build check: pasado.
- Browser tests gen_panel (14) at tcs_gen_desk (14): pasado.
- Hindi sinubok sa live app.
