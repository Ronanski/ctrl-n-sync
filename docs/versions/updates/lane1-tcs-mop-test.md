# TCS test: MOP-B standby start, physical fall of MOP-A discharge (lane 1, MARIA, 2026-11-27)

`tests/lanes/integrator/tcs-motors.cjs` "MOP-B standby start on the low discharge of MOP-A": test input only, logic and expected result unchanged.

- Before: `U.loPa` stepped 6.63 -> 3 kg/cm2g in one scan. TCE102 m1 AI DIAG.MD (LME510, PT-LOn922-A) drawn settings DEV HL 2.0 / LL -2.0
  kg/cm2g, DEF TP 0.03 S, DEF N 3 (`src/digital/tce/TCE102.js` row 1) = the rate check of TC-14-116 p 1298 No. 4. With the TCS macro
  inner state in the 150 MW start (st150 of branch 3f08k3) the jump flags the transmitter: m1.ABN = 1, OUT holds 6.63, CPL A030 (TCE300
  LL 5.6) never sees low, MOP-B does not start.
- Now: the discharge falls 0.5 kg/cm2g a scan (1 kg/cm2g/s) to 3, under the rate limit.
- Tested: PASS with the st150 of main, 3f08k3 (FAIL before) and p2sh7g.
