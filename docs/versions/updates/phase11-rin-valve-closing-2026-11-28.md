# Phase 11 (RIN): MSV / CV / RSV / ICV closing times derived from the actuator and trip oil data

- Before: one closing time for every turbine valve, U.tauTrip 1 s, NO-SOURCE.
- Now: AN_TBV in turbine.js, each derived beside the value from TEQ-17-241 (Rexroth circuits p511-518, LC32 cartridge curve p640, NG6
  p723, MTSV p864 / p870, ETS feed orifice p79 / p81, accumulator p861) and the TATUNG actuator sheets:
  trip (ETS lost) = MTSV 0.25 s + ETS header 0.05 s + cylinder dump through the LC32 at the 4 bar cracking dp:
  MSV 0.38, CV 0.41 (CV B, the slower), RSV 0.44, ICV 0.47 s. Fast acting (OPC on PLU, valve test): NG6 0.04 s + dump: CV 0.15,
  ICV 0.21 s. House-load governing: the CV servo rate 0.90 s (4WS2EM10-5X/60 at 160 bar).
  The end cushion (VD orifice size not printed) is not added.
- Test: turbine trip from 150 MW (valves shut in under 0.5 s), house load from 150 MW: speed peak 102.9 % at 1.0 s (before 106.5 %
  at 1.4 s). The TG manual (tg-2-1-1 p137) gives "about 106 % in about one second" for a FULL load rejection (52G open, no house load).
  The lower peak points at the steam left in the turbine after the valves close (U.tSc / U.tXo, textbook values today): that is
  RIN's next item, from the HP chest and crossover volumes.
- Checks: turbine-hb, ports, bypass-valves, tcs-dcs, gen-electrical, bypass-spray, tce tpc-valve-test, heat-soak-ibd, sheets,
  dash-inputs, one-path, no-fit, u-const. Not run: 150 MW 20 min hold (the closing times do not act in steady load).

## Added in the same PR (2026-11-28 ~1:40 AM PHT)
- LP leaving loss: tbEL = c^2 / 2, c = m v / A, A = 6.25 m2 (stage 24 tip 3176 / root 1457 mm from the cross section 310PK03-994,
  YUA read). The last LP group now expands to the ELEP; the HB exhaust 570.1 is the UEEP = ELEP + leaving loss. turbine-hb: the
  part-load MW gap is now -0.2 to -0.4 MW (was -0.5 to -0.9); exhaust H within 0.7 kcal/kg at 85 ~ 40 %, -3.6 at 30 % (low volume flow).
- Steam left in the turbine after the valves close: AN_TB.tSc 0.073 s (HP), AN_TB.tXo 0.198 s (IP / LP), T = M / m from the casing
  volumes of 310PK03-994 / 310PK02-353 at HB case 1 (derivation beside the values). The textbook U.tSc 0.3 / U.tXo 0.5 are deleted.
- House load from 150 MW now peaks at 101.0 % at 0.4 s. The TG manual (tg-2-1-1 p137) says "about 106 % in about one second" for a full
  load rejection: OPEN, not fitted. Physics check: 106 % needs about 88 MJ into the rotor (H 4.01 s x 176.5 MVA); the entrained steam is
  22 MJ (IP / LP) + 0.7 MJ (HP), the valve ramps about 10 to 15 MJ.
- 150 MW held 20 min: 150.0 to 151.7 MW, no trip.
- Signed heater draws in tbPath: a draw below 0 is steam the heater shell sends back into the turbine (shell flash on a load
  rejection, through the extraction line until its NRV shuts), entering at the saturated vapour enthalpy of the stage. No change
  while the draws are positive (turbine-hb unchanged); the heater parts (NANA ext.w_hp, MEI ext.w_lp) write the back flow next.
