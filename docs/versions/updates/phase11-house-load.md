# Phase 11 electrical: house load from each motor's own model (YUI, 2026-11-28)

## What
- Before: elec.js multiplied every 6.6 kV motor current by a fixed ETAP power factor (K1AU3-E1-0-307). A part-loaded motor's magnetizing current was counted as active power.
- Now: each part publishes the electrical input of its own motors, worked out from the same numbers as their current. The port is q.motor.<part>, in kW / kvar. elec.js sums the ports through the UAT.
  - AOI, boiler.js anFdEl / anFabEl: PAF / SAF / IDF on the TECO curves (efficiency and pf vs load), and the FA blowers. AOI OK.
  - NANA, fw.js anFwEl: BFWP A / B on the TECO AEZW-S2 sheet, eff 0.962, magnetizing 147 A. NANA OK.
  - MEI, unit.js anCepI: CEP A / B, the P / Q of the same fixed point as the current. MEI OK. The cep-motor test regex now accepts the new optional argument.
  - SUZU: SWP, ACWP and the PA compressors stay on current x ETAP pf until SUZU writes q.motor.SUZU in its own PR. That PR also deletes those rows.
- The bus 1AM current is now S / (sqrt 3 x 6.6 kV). Before, it was the arithmetic sum of the motor currents.

## Result at 150 MW
- House load 16.53 MW (was 17.31). AOI 5.99, NANA 3.03, MEI 0.26 MW.
- The SUZU motors are still on the old rows, and the 460 V lump and the ESP are unchanged.
- 230 kV export 134.1 MW.

## Check against the design (yui-reads-4.md)
- No document gives the auxiliary power or the net output by load. The HB PPE-14-0725 outputs are gross.
- The only total is the load list E1-0-302 p6: bus 1AM normal running 26,547 kW, built with demand factors. About 5.35 MW of that is common plant load (coal yard, ship unloader, conveyor), so the unit's own share is about 21.2 MW. That is a demand-factor estimate (an upper bound), not an operating target. 16.5 MW is under it.
- SWP data now read: pf 0.72 at 100 % (D1-0-064 p26), against the 0.927 used today. SUZU's port will lower the house load by about 1.1 MW.

## Test
- gen-electrical (port aux.power = the house load), cep-motor, ports, u-const, one-path, no-fit: PASS.
- lanes run-all and the 20 min hold: see the PR.
