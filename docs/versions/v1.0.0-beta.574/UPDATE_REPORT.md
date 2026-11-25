# v1.0.0-beta.574 — BOP batch 3: CEP VCB, dosing power at trips (lane 4, DCS LINKS BOP : RARA)

## Ano ang bago (`src/world/field/bop.js`)
- **Condensate pump A / B VCB ON / OFF** (STN103 I.0084 / 0085, I.0404 / 0405): ON = tumatakbo ang pump sa DITL-61A (o #B) at walang field trip o black-out (`X.ftrip`); OFF = hindi ON. Nakadrawing ang mga tag na ito sa MCC side ng DITL-61A, kaya ang field row ang nagpapagalaw sa contact (`WORLD.plantUsw`).
- **SIA-CDS01** (dosing AC main power normal, STN101 I.012E): 1 habang buhay ang unit 460 V bus; 0 sa black-out (K1AU3-E1-0-307 p A.14, elec.js).
- **12 bagong field state** (Plant menu ng instructor):
  - 9 trip / electric trouble ng dosing pumps: MIT-Z1107A / B, Z1108A / B, Z1109A / B, Z1101A (agitator), MIT-P0761A / B (hypochlorite unloading). Normal = walang trip.
  - 3 breaker ng PAF circulating oil panel: MIA-LO1753-1 (control power switch off, normal 0), -2 / -3 (NFB2 / NFB1 not off, normal 1).
- **MIA-HC0001** (hypochlorite AC main power not fail, STN105 I.032F): 1 habang buhay ang 6.6 kV bus WTX (WTX-B feeder CD-PS, K1AU3E1-0052 rev 2; WTX <- 1A23 sa WTX1M N.C., K1AU3E1-0014 / 0009 / 0010); 0 sa black-out ng bus 1A hanggang isara sa kamay ang WTX2M (wala sa model). Ang CD-PS bilang panel ay derived (walang drawing na may HC0001; hanap ni YUA).

## Test
- Headless 150 MW: CEP-A ON / OFF = 1 / 0, CEP-B (standby) = 0 / 1; SIA-CDS01 = 1; lahat ng trip = 0, NFB = 1. Ang fs.Z1107A.trip ay nagpa-1 sa MIT-Z1107A lang; ang fs.LO1753.nfb2 ay nagpa-0 sa MIA-LO1753-2; bumalik nang alisin. Walang page error.
- Hindi sinubok: black-out ng bus 1AM.
- QA trace (main tool, 10 min), 147 BOP points: LINKED 61 -> 63 (CEP-A / B VCB, 4 point), UNLINKED 16 -> 4; buong planta LINKED 1,687 -> 1,691, UNLINKED 256 -> 242.
- Lanes tests, build check, no-fit, version check.

RARA
