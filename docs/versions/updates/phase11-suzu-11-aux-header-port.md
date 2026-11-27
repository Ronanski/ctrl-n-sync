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

## Dagdag: aux.peg (kasunduan kay NANA, inaprubahan ng phase thread)
- Ang `aux.peg` sa ports.js ay by SUZU, to NANA, v m (t/h) at h. Isinusulat ito ng `anAuxStep`, kung saan bahagi ang PCV-AS1030 ng 0.1 s substeps ng header balance.
- Binura ang linyang `anPortSet(U, 'aux.peg', ...)` sa fw.js (payag si NANA).
- Ang Pdea ng PCV-AS1030 ay galing na sa port na `dea` ni NANA (P ata - 1.0332), hindi na sa sariling basa ng transmitter. Idinagdag ang SUZU sa `to` ng `dea`.
- Sinubok, 150 MW 20 min: walang trip (MW 150.5 ~ 151.6); aux.peg m 0 (sarado sa load, gaya ng HB); as_page_values ALL PASS.
- Ang 2 FAIL ng feedwater.js (BFWP-A 523 m3/h, strainer DP 0.086) ay pareho sa main bago ang PR na ito.
