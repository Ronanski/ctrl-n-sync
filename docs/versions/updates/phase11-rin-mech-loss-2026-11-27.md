# Phase 11 (RIN): turbine mechanical loss AN_TB.mech 1.40 -> 1.55 MW

- Why: YUI PR 700 takes the generator losses from the machine's type test (LM-GEE-2014-0822 R0 p31, 2,032 kW at the rating): 1.794 MW at
  150 MW (was 1.933 MW from the air cooler duty). AN_TB.mech = HB PPE-14-0725 lumped loss at 100 % (3.34 MW) less the generator loss at
  150 MW = 1.55 MW, so the 150 MW output of the HB stays the same. The MHPS bearing loss itself stays NO-SOURCE.
- Test: turbine-hb (8 HB cases), ports, one-path, no-fit, u-const.
