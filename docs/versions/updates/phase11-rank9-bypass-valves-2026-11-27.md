# Phase 11 rank 9 (RIN, 2026-11-27): bypass and blow-off valves by the IEC 60534 flow law and the vendor Cv

- turbine.js AN_VLV / anVlvCv / anVlvW: W = 27.3 Cv(lift) Y sqrt(x p1 rho1), x held at the choked limit Fg xT, rho1 IAPWS-IF97.
  Cv and the lift curves from the SPX Copes-Vulcan sheets (K1AU3-D1-0-043 R0 p9 / p11 / p24 / p26, K1AU3-E2-0-123 R1 p5 / p6; YUA read
  /mnt/project-files/rin-valve-reads.md): PCV-MS1020 HP bypass Cv 215, PCV-HR1010 LP bypass Cv 1700, PCV-MS1001 blow-off Cv 232.
  xT NOT IN DOCS: DERIVED from the vendor sizing cases (median per valve: 0.862 / 0.851 / 0.668).
- unit.js: the HP bypass and blow-off (U.vlv loop) and the LP bypass (reheater balance) use anVlvW. Deleted the U-field constants
  hpb 0.48, blo 0.46, lpb 1.05 (shares of the 150 MW anchor flow), tauRH (read nowhere), and moved Crh / rhb to AN_VLV (engine
  constants; st150 restores U, so constants may not live there).
- Port lp.bypass {m, h} (turbine.js anTbPorts).
- RH blow-off MV-HR1391: Cv NOT IN DOCS (motor valve, no sheet): silencer rating 200 T/H x opening x reheat pressure ratio, NO-SOURCE.
- Tests: tests/lanes/model/bypass-valves.cjs, the 8 vendor sizing cases at the printed lift: 7 within 3 %, HR1010 cond 3 -11 % (that
  case alone needs xT 1.13 > 1: the vendor numbers do not close with its other two cases; held to 12 %, said here); HP bypass full
  open passes 231 T/H at 126 -> 39.8 ata (PPE-14-0728 case 2 needs 161.8).
- 150 MW start unchanged (bypasses shut): 150.5 MW at 456 T/H. Turbine trip from 150 MW, 30 plant s ~ 20 min: HP bypass 249 -> 234 ->
  17 T/H, LP bypass, blow-off and reheat pressure within a few % of the old law (which was sized on the same sheets); main steam
  pressure 133.7 -> 99.7 kg/cm2 g.
- Not done: the closing / opening stroke times (anAv actuator as it was; vendor < 2 s digital, < 5 s analogue); HP / LP spray valves
  TCV-FW1060 / TCV-CD1115 (Cv 10.3 / 25.4) not yet on this law; tests/regress/unit_trip.js (not in Checks) still reads U.hpb.
- Follow-up (same day): bypass stroke times from the vendor sheets: PCV-MS1020 / PCV-HR1010 move at 100 % / 2 s on the trip-open
  solenoid and 100 % / 5 s on the 4-20 mA positioner (turbine.js anVlvStroke, AN_VLV.tQ / tA; vendor upper limits, taken as is).
  Before: the opening followed the controller at once. Trip from 150 MW: the HP bypass reaches 32 T/H after 2 s (was full at once).
  The blow-off PCV-MS1001 has no stroke time in the docs (no solenoid, positioner only): as commanded.
- Spray valves TCV-FW1060 / TCV-CD1115 (water, Cv 10.3 / 25.4): handed to NANA (fw.js) and MEI (anCdTagStep), their files.
