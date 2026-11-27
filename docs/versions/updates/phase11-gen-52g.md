# Phase 11 generator: 52G trip (full load rejection) (YUI, 2026-11-28)

## What
- Plant-menu fault **'gen.52g'**: "Generator breaker 52G trips open (breaker trip, turbine not tripped)". Code: world.js, elec.js anElec52gTrip.
  - 52G opens through the same TCS breaker inputs as the shutdown step (tcsGcb GCB ON / OFF).
  - The turbine stays latched and the field breaker 41 stays closed.
  - The breaker is trip-free: it will not stay closed while the trip stands.
  - 86G-A / 86G-B were not changed. They still open 52G and trip the turbine (gen-panel.js), so they are not a load rejection.
- **Voltage at the opening** (tcs-gen.js). The rotor flux linkage is constant at the instant of opening. So the open circuit voltage starts at the transient EMF |E'q, E'd| of the last on-line scan, with E'd dying out at T'qo 1.0 s (Hitachi GDR). Before, the model kept the EMF behind Xd, which gave 1.9 pu at 150 MW. Now the voltage stays between 0.935 and 1.005 pu, and the AVR holds it.

## Found for RIN (turbine, not in this PR)
After the 52G trip at 150 MW, the model does not reproduce the full load rejection of the TG manual (about 106 % in about 1 s):
- The speed stays at 3600 rpm: the peak is 100.0 % and Pm goes to 0 within 0.5 s.
- PLU (unit.js) operates only on 52L1 open (house load), not on 52G open.
- BOILER MFT trips the unit 104 s after the opening. The main steam flow is 0 from the opening, and nothing takes the steam.

## Test
- gen-electrical has a new case: 52G opens, the turbine is not tripped, the field stays on, V 0.935 to 1.005 pu, the house load comes from the grid, and there is no reclose while the trip stands.
- tcs_gen_desk ALL PASS. The guards pass.
