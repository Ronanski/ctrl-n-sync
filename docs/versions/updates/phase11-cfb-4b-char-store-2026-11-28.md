# Phase 11 part 1 (AOI), rank 4b: char store sa kama ng furnace (kKL nananatiling 9.2)

AOI, 2026-11-28 PHT, user "Go fix 11".

## Ano ang binago (lumang code tinanggal sa parehong PR)
- `src/analog/engine/cfb.js` `AN_CBED` at `anCharTau`: ang coal ay nahahati sa volatiles (nasusunog agad) at char (nasusunog sa loob ng minuto, naiipon sa kama). fV 0.39 mula sa coal crusher spec K1AU3-D2-0-102 R0 p4 (VM 30.56 %, FC 28.67 %). Ang burnout time ng char ay galing sa diffusion law ng d50 1.1 mm (D2-0-102 2-4-4), buhay sa temperatura ng kama at sa O2: mga 127 s sa 850 C / 3.6 %. Tinanggal: ang lumang `tau 60 s` (NO-SOURCE).
- `src/analog/engine/unit.js`: `U.cbed` ang char store, `Fb` = volatiles + char na nasusunog; ang lumang save (walang `U.cbV`) ay nagsisimula sa steady store.
- kKL ay nananatiling 9.2 (dahilan sa ibaba). Ang tala sa cfb.js ay nagsasabi ng bagong ebidensya.

## Sinubok (st150 ng main, PR 705, headless 60 plant min)
- main lang: hawak ang 150 MW (Pms 122.1 ~ 122.6).
- char store lang (itong PR): hawak ang 150 MW (Pms 122.1 ~ 122.6, coal 89.4 ~ 91.9, char store 1.9 t).
- kKL 3.80 lang: lumalaking swing (coal 85 ~ 95 T/H pagdating ng 55 min).
- kKL 3.80 + char store: trip sa mga 52 min.
- Behaviour gate 150 MW 20 min, guards at lane tests: tingnan ang PR.

## Hindi pa nagawa / susunod
- kKL 3.80 (FHI 60 % design point) ay naka-hold pa rin: ito ang ayos ng mababang main steam temperature sa 45 MW, pero pinapagalaw nito ang 150 MW pressure loop. Hinahanap pa ang kulang na mabilis na sagot ng steam sa coal.
- Hindi kasama ang st150.
