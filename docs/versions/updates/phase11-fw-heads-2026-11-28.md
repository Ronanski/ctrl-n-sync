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
   - NPSHa is about 18 to 20 m with the as-built DA height (section 5), against NPSHr 7.7 / 9.0 m.
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

## 5. BFWP suction pressure PT-FW1115-A / B by physics (coordinator decision 2026-11-28: the snapshot head was a Rule 0 break)
- **Was:** plantsw.js W.sucP = deaerator pressure + 1.8 kg/cm2. The 1.8 was a snapshot head from 02.png / 03.png.
- **Now:** deaerator PT-CD1104 + the storage water from its level down to the tap GL.+12500 + the 1.9 m impulse line down to the transmitter GL.+10600. The densities are IF97, written by fw.js as U.da.rho / rhoL.
- **Deaerator height** (/mnt/project-files/nana-da-elevation-2026-11-28.md):
  - The storage tank CL is GL.+32300, on the steel frame TOS GL.+30300 above the roof. Sources: E2-0-102 as-built p37 I0-362 and A3-0-002 as-built Section A-A p8.
  - The D1-0-038 "GL.+23400" is a rev-3 cloud with no datum, so the as-built drawings win.
  - Normal water level is GL.+33224, and LT-CD1104 reads 0 at NWL.
- **Calibration** (nana-pt-calibration-2026-11-28.md): EJA430E gauge, 0-10 kg/cm2, no suppression and no wet leg.
- **Line loss:** not modelled. The line size and routing are NO-SOURCE, and the KSB 6.00 kg/cm2 g rated suction is the pump design basis, below the static head.
- **Result (headless):**
  - 150 MW: 7.07 (03.png idle pump B 7.1, a check only).
  - Cold start: 2.25, so the DITL-23A row 12 comparator (> 1.5) = 1.
  - The BFWP can start in "STEAM DRUM FILLING" before "DEAERATOR WARMING UP", as PR-OPE-5002 does.
- **Design check:** HB PPE-14-0725 p3 gives "BFP suction = DTR press. + 2.0, considering DTR level and piping loss" (YUA 2026-11-28). The law gives +2.04 at the pump CL (22.4 m x 909 kg/m3, before the line loss) and +2.07 at the transmitter. So the line loss the HB allows is small, which is why it is not modelled.
- **DITL-23A START (netlist trace):** row 12 > 1.5 AND row 11 suction valve open AND row 17 lube oil, OR row 14 running through a 2 s OFF DELAY. There is no bypass.
- **tests/regress/fw_page_values.js:** PT-FW1115-B is now judged against the as-built head, and A against B less its strainer DP. It was the 03.png 6.7 / 7.1 +- 0.3. NOT RUN to the end: the test stops earlier at its page navigation (`#pllist button[data-id="MK06"]` is no longer on the page since the HX pages; sim-tests, not Checks). That stale navigation is not changed here.
- **NPSH:** the static head from the DA normal level to the BFP CL is 22.4 m, so NPSHa is about 18 to 20 m against NPSHr 7.7 / 9.0.
- **LCV-HD1105-1 (No.1 HPH to the deaerator):** it lifts its drain to the DA on the roof frame. At COND 1 the outlet is above the drain saturation, so the riser is liquid: outlet static 7.75 m (0.698 kg/cm2), and the loss is 1.537 - 0.698 = 0.839.
- **MOC:** plantsw.js is not a controlled item of tools/moc/moc.cjs (logic sheets, tag tables, alarm groups, link files). This section is the change record.
