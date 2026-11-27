# Phase 11 part 7+8 (SUZU), slice 1: cooling water code in its own file, air compressors stop in a black-out (2026-11-27)

Binago:
- Ang sea water, make-up water, closed cooling water at bottom ash cooler ng plant model ay inilipat mula `src/analog/engine/unit.js` papunta sa `src/analog/engine/model/cooling.js` (ownership file ng Phase 11: SUZU). Walang numero o formula na binago; binura ang lumang kopya sa unit.js (iisang daan pa rin). `order.list`: bago ang `engine/unit.js`.
- `tools/check/no-fit-baseline.json`: ang 3 lumang fit (make-up z 28.png, CCWHE UA 27.PNG, heat load x MW / 150) ay lumipat ng file; susunod na slice ang papalit sa kanila ng design data (MB-021, D1-0-041, hinihintay ang basa sa PC).
- `anAirStep`: sa black-out ng unit (U.el.bo) humihinto ang plant air compressors (6.6 kV, BUS 1AM, ETAP K1AU3-E1-0-307 RA p A.3 / A.12, basa ni YUI) at ang instrument air compressors (460 V; elec.js: lahat ng 460 V bus patay kasama ng BUS 1AM), at walang start hanggang bumalik ang bus.

Sinubok:
- Behaviour gate 5 plant min sa 150 MW, bago at pagkatapos ng lipat: magkaparehong numero (MW 151.93 -> 150.87, MSP 122.36 -> 122.52, level 0.30 -> 11.62, MST 539.70 -> 539.41), ALL PASS.
- Black-out probe (headless, 150 MW, `WORLD.ftrip('el.1am')` 60 s): plant air A 43.8 A -> 0, instrument air A 211.9 A -> 0, lahat ng compressor STOP.

Hindi sinubok: buong Cold run; pagbalik ng bus (restart ng operator).
Susunod: closed cooling heat load bilang suma ng bawat cooler (MB-021) at CCWHE fouling (D1-0-041); sea water outlet temperature mula sa duty ng condenser (port `cd` ni MEI).
