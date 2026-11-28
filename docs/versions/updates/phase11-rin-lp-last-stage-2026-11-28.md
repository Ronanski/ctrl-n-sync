# Phase 11 RIN: the last LP stage as a choked stage (general Stodola ellipse), 2026-11-28

What the operator sees: at low load the LP extraction pressures (No.6 / No.5 / No.4 heaters) now follow the heat balance; before, they ran high at 30 % load (No.6 +6 %), so the No.1 LP heater took too much steam.

- Before: every turbine group used the cone law (flow ~ sqrt((p1^2 - p2^2) / (p1 v1))). That law is for many stages. The last LP group is ONE stage (stage 24, after the No.6 extraction; 310PK03-994, LP diaphragms 22 / 23 / 24), and at the low condenser pressure it is choked.
- Now (turbine.js tbP1 / tbPsi): the general Stodola ellipse with a critical pressure ratio (Stodola; Cooke, ASME J. Eng. Gas Turbines Power 1985; Traupel, Thermische Turbomaschinen): flow ~ sqrt(p1 / v1) x psi(p2 / p1), psi = 1 below the critical ratio. Critical ratio of one stage = Traupel 0.85 / sqrt(z + 1.5) = 0.54. K from HB case 1 only (no per-load value).
- Result against all 8 HB PPE-14-0725 cases (tests/lanes/model/turbine-hb.cjs): No.6 stage within 0.4 % everywhere (case 7: 0.133 vs HB 0.133; was 0.141, +6.2 %); No.5 / No.4 within 1.3 %. The test limit is now 2 % on every stage of every case (was 4 / 8 % at cases 6 / 7).
- Left: the exhaust enthalpy at 30 % load is 3.6 kcal/kg under the HB (the last stage works better in the model than the real one at low volume flow; +0.4 MW, inside the 1 MW tolerance). The fix is the exhaust-loss curve with its low-velocity turn-up (not in the plant documents read; asked).
- Tested: turbine-hb, turbine-rejection, vacuum-mw, ports, bypass-valves, u-const, one-path, no-fit, no-snapshot; 150 MW 20 min: 148.9 ~ 149.4 MW, no trip (main ff4e960 + this).
