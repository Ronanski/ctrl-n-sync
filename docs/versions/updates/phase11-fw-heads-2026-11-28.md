# Phase 11 FW: HP drain heads and HP heater level surface from the as-built elevations (NANA, 2026-11-28)

Source: YUA PC read 2026-11-28, /mnt/project-files/pc-reads-npsh-elev-2026-11-28.md. The documents are K1AU3-D1-0-036 (HP heaters), D1-0-038 (DA tank), E2-0-102 as-built (instrument location plan) and the KSB data sheet / GA.

1. HP heater drain valves (fw.js AN_HDV, anHdW). Before, one sheet offset (dz) was held at every flow. Now:
   - Valve inlet = shell + the static head from the shell water level to the valve - the inlet line loss.
   - Valve outlet = the place it drains to + the outlet line loss.
   - The losses go with flow^2, sized from the COND 1 case of each sheet less its static head.
   - The sheets carry the as-built heads: LCV-HD1106-2 / 1105-2 P1 - shell = 0.60 kg/cm2, which is 6.9 m of drain water.
   - The sheet pressures are the HB ata numbers carried as "g", so the model uses true absolute pressure with the sheet's FL 0.90.
   - Effect: at 30 % load (HB case 7 shells), LCV-HD1105-1 at 100 % passed 0 t/h before (the fixed 3.0 kg/cm2 offset was more than the 2.7 shell difference). So the No.1 HP heater drain could only go to the condenser. Now it passes 40 t/h, against 16.4 needed. At 150 MW, the primaries carry the drains and the alternates are shut (levels within 10 mm).
2. HP heater level surface (AN_HD.wl). The water surface is now the chord of the shell at the level, with the normal level 480 / 455 mm below the CL (D1-036). This replaces D x 0.7. The tubes through the surface are not taken off (NO-SOURCE: tube layout not read). The LP heaters keep 0.7 (MEI).
3. BFWP NPSH: no model change.
   - Derived NPSHa at the KSB rated suction is 10.7 m, against NPSHr 7.7 / 9.0 m.
   - The model has no suction-line transport delay, so it cannot make the load-rejection NPSH dip. A flag would never act.
4. Finding for the BFWP suction pressure (plantsw.js W.sucP, not changed here; it is the DITL-23A START permissive):
   - The head is a snapshot 1.8 kg/cm2.
   - The as-built geometry gives about 1.1 at the tap GL.+12500: DA water level GL.+24324, 11.8 m of 909 kg/m3. With the 1.9 m impulse line down to the transmitter at GL.+10600, it is about 1.3.
   - Changing it moves the cold start permissive (> 1.5 kg/cm2), so it is left for a decision.

Checked:
- hp-drains: the 12 sizing cases on the sheet arithmetic, plus 4 shell-to-place cases within 7 %. The choked cases are lower by up to 5.8 % because the sheet's P1 is 1 atm high.
- hp-heaters, deaerator, bypass-spray, ports, no-fit, one-path and u-const: PASS.
- 150 MW held 20 min with no trip: MW within 0.42, Pms within 0.29.

Not checked: the 45-150 MW sweep (phase thread, on main).
