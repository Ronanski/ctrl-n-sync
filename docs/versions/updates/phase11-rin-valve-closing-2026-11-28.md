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
