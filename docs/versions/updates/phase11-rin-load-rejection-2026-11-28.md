# Phase 11 RIN: full load rejection (52G open on load, turbine not tripped), 2026-11-28

## What was wrong
- After YUI's 52G trip (PR 708), the state 'roll' shut the CVs at once.
- The TCS speed hold (tcs-gen.js) and the roll ramp then set the speed kinematically.
- Result: no overspeed, and no PLU or governor action.

## The change
- **unit.js tb.rej**: set when the machine leaves sync / load for roll without a trip (52G open). It is cleared on trip, stop or resync.
- **While tb.rej is set**:
  - The steam drives the shaft (U.Pm from tbPath behind tSc / tXo).
  - The speed is the swing equation (anTbSpeed). Pe is the generator no-load losses, U.genT.L at 0 kA (LM-GEE-2014-0822 R0 p31).
  - The PLU closes the CV and ICV at the fast-acting rate (power minus 0 load > 40 %).
  - The speed governor of the house-load branch then takes the speed (GOV.SET runback rbIP, droop).
- **tcs-gen.js / tcs.js**: the pre-sync speed hold and the CRT target speed do not act while tb.rej is set.

## Tests (cloud, 150 MW save point of main + PR 703)
- **52G trip from 150 MW**:
  - PLU at once.
  - Speed peak 3659 rpm (101.6 %) at 0.7 s (with the A011 CV area).
  - Governor speed 3615 rpm (droop at GOV.SET runback 4.2 %), ICV 4 ~ 6 %.
  - No turbine trip from the turbine side.
- **House load**: peak 101.4 % (unchanged).
- **Regression**: gen-electrical, tpc-valve-test and dash-inputs pass.

## Open
- The TG manual gives about 106 % in about 1 s for a full rejection. The model peaks at 101.6 % with the derived closing times and steam volumes. This is not fitted.
- At 56 s the boiler trips on DRUM LEVEL L.L. (DITL-03E LALL-BR1001-1/2/3 -> DITL-03A MFT).
  - Cause: after the CVs shut, the SH outlet pressure is computed as drum - kdp x (turbine flow)^2 with turbine flow 0. It goes to the drum pressure (139.8), so the SH safety valve ZV-MS1001 (set 137.0) lifts at 115 T/H.
  - This happens even though the HP bypass is passing 286 T/H through the same superheater.
  - The SV steam is not seen by FT-MS1031, so the feedwater falls short and the level drops.
  - The SH drop should use the whole SH flow (turbine + bypass + blow-off). That belongs to KANA (anShKdp / Pms).
- During tb.rej the ASD 15R / 15L speed pulses do not yet move GOV.SET (the speed / load changer for resync).
