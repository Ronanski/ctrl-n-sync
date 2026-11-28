# Phase 11 RIN: rule 0 cleanup of the turbine values in unit.js (2026-11-28, SUZU list)

## Binago
- `MWinit` 4.5 MW: the source is now TCE190 LOAD CONTROL(1) p.132, initial load set 4.5 MW (3 %) outside hot mode. In hot mode it is 7.5 MW (5 %), which the ATS sets from TCS.init in tcs.js. It was a procedure reference. The value is the same.
- PT-ST1002-1 / -2 / -3 (IP turbine inlet, `U.Pip`): now the IP blading inlet pressure of the steam path, tbPath `P.hrh` (Stodola, HB PPE-14-0725 geometry), in gauge. It was 34.16 ata x qip / m0 from a plant screen mean. At 150 MW it now reads 33.9 kg/cm2 g (HB case 1: 34.77 ata = 33.7 g).
- Turbine roll / sync / load up note: the TCS ATS (tcs.js, TCE / TCA 331DM09784) instead of a procedure reference. The RH blow-off note now cites ABC-054 PICHR1391 / MV-HR1391. The load-up rate note in turbine.js cites TCE185 L-RATE / AO TCE970-2, 0 ~ 5 %/MIN.
- no-snapshot baseline: 577 -> 570 lines (`--update`).

## Sinubok
- 150 MW held 20 min: 151.0 MW, no trip.
- turbine-rejection: PASS.
- tcs-dcs: PASS.
- PT-ST1002 at 150 MW: 33.88 kg/cm2 g.

## Natitira (RULE 0, mine)
- turbine.js AN_HRW rest 228 C (TT-HR1010 with no warming steam) is from a plant screen. It needs a heat balance of the idle line.
- unit.js PT-TS1013 / 1017 extraction pressures are anchored to screen values. They should take the tbPath stage ports.
