# Phase 11 part 6 (generator): reverse power 32 and the lockouts 86G-A / 86G-B through the TCS sheets

MODEL GENERATOR ELECTRICAL : YUI, 2026-11-27 PHT.

- Binago: ang reverse power relay 32 ay nasa TCS sheets na, iisang daan.
  - Ang contact ay galing sa model (elec.js anGenRelay, port relay.gen): MW / 176.5 MVA <= -0.008 pu (1st step) at <= -0.013 pu (2nd step), ayon sa GEE-2015-0173 p.16.
  - Ang 10 s ay ang timer d32 ng SH-G-5A / SH-G-6A.
  - Ang coil ng lockout relay 86G-A / 86G-B (gen-panel.js tcsLo86) ay ang OR ng SH-G-5A / SH-G-6A (gor).
- Binura: `turbine.js anRp32` at `AN_RP32` (ang sariling timer at latch sa tabi ng sheet), ang `U.rp32`, at ang reset nito sa `tcs-trip.js`.
- Dagdag na kabit: ang auxiliary contacts ng breaker 52G sa SH-G-1A (CLOSE / OPEN) ay galing na sa port gen x.b52g.
  - Dati ay 0 ang mga ito, kaya laging 0 ang "52G CLOSED" ng mga sheet. Walang relay na may 52G gating ang umaandar.
  - Ang "52G CLOSED" ay papunta sa SH-G-5A / 6A / 8A / 4 / 2B / 1B.
- Sinubok (`gen-electrical.cjs`): GOV SET 0 sa 150 MW, naka-sync at walang turbine trip.
  - Bumaba ang MW hanggang -2.9 ~ -3.1 MW (ang generator ay umaandar na parang motor, katumbas ng losses).
  - 10 s pagkatapos ng -2.3 MW: 86G-A at 86G-B operated, turbine trip, at bukas ang 52G.
  - Pumapayag ang reset kapag nawala na ang dahilan.
- Hindi sinubok: ang 1st step alarm (5 s, hindi nakaguhit sa sheet).
