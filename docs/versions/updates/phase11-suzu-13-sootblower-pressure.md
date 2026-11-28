# Phase 11 part 7+8 (SUZU), fix 13: sootblower steam pressure from the SH drop law (2026-11-28, GO FIX 11)

Binago (`src/analog/engine/unit.js` anSbDrain; binura ang lumang formula sa parehong commit):
- Ang pressure ng steam na kinukuha ng sootblower (S/H panel #1 outlet, PT-BR1130 tap) ay galing na sa SH pressure drop law ni KANA (anShTap: FHI design drop 16 kg/cm2 sa 460 T/H, kasama ang steam density). Ito rin ang ginagamit ng PT-BR1130 at ng spray ni NANA.
- Dati: drum - 6.4 x (MSF / 474.1)^2, isang basa ng planta (hindi design).

Sinubok (headless, 150 MW 20 min, walang trip, MW 151.0): aux header 10.20 kg/cm2, gland 0.320 kg/cm2. no-fit 26 (0 bago), one-path PASS.
Hindi sinubok: live app. Ang tap share ng PT-BR1130 ay bukas na item ni KANA.
