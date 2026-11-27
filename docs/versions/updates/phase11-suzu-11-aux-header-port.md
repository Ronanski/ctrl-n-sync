# Phase 11 part 7+8 (SUZU), port aux.hdr (2026-11-27)

Binago: isinusulat na ng `anAuxStep` (`src/analog/engine/unit.js`) ang port na `aux.hdr` (ports.js, by SUZU, to NANA / RIN / MEI). Laman nito:
- P: pressure ng aux steam header, kg/cm2 g.
- T: TT-AS1003.
- h: IF97 enthalpy.

Kailangan ito ni NANA para sa pegging steam ng deaerator, para mabura niya ang sariling Tpeg 350 C. Walang physics na nagbago.

Sinubok (headless, 150 MW 120 s):
- aux.hdr: P 10.19 kg/cm2 g, T 235.2 C, h 2906 kJ/kg; 0 page error.
- one-path, ports, no-fit, u-const: PASS.

Susunod: ang pegging flow sa iisang lugar. Isusulat ito ni NANA sa aux.peg, at buburahin ko ang sarili kong w1030.
