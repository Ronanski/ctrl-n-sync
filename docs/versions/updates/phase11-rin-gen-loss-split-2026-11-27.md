# Phase 11 (RIN): anTbGen and AN_TB lo / kq deleted

- What: the lumped HB mechanical + generator loss (AN_TB.lo 2.565 MW + kq 3.295e-5 x shaft^2, turbine.js anTbGen) is deleted. Since PR 682 the generator losses are YUI's anGenW / anGenTemp; the turbine keeps only its own mechanical loss AN_TB.mech 1.40 MW (HB lumped 3.34 MW at 150 MW less YUI's 1.94 MW). One path for the loss, no duplicate.
- Test: tests/lanes/model/turbine-hb.cjs holds the HB lumped loss itself (HBGEN) only to read the HB gross kW of the 8 heat balance cases; all 8 pass. bypass-valves 9/9, ports, one-path, no-fit (0 new) pass.
- Not tested here: full 45-150 MW sweep (phase thread, on main).
