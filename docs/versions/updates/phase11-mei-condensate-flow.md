# Phase 11 part 4 (MEI): condensate flow to the deaerator from physics

- Changed in place: `plant.js` `anDaQ`. Before, a line fitted to the HMI snapshot (LCV-CD1104 17.5 % = 380 T/H). Now the condensate pump curve (KSB Q43495D) is solved against the LCV-CD1104 Cv vs lift (K1AU3-E2-0-123 R1 item 14: linear, Cv 340), the line to the valve and the deaerator back pressure. The constants come from the two sizing conditions on the valve sheet plus deaerator O&M L15-2 (6.05 ata design; tank filled before steam).
- `unit.js` `anCondStep`: the CEP flow uses the same anDaQ plus the FCV-CD1120 recirculation (223 T/H valve sheet). The old 2.5 T/H per % path is gone.
- Tested: no-fit 0 new; behaviour gate 150 MW 20 min ALL PASS.
- Not tested: 45 ~ 150 MW sweep (phase gate).

## Item 2: CEP outlet pressure PT-CD1117
- `unit.js` `AN_CD.zS` was 6.336 m (down to the 1st-stage impeller) and the snapshot calibration kz 0.96 kg/cm2 sat beside it. Now zS = 1.678 m, from the hotwell surface (GL+2014) to the suction / discharge flanges (GL+336, KSB GA F30157 A rev 3). The KSB head is measured flange to flange. kz is removed.
- `anCondStep` reads PT-CD1117 from `anCdPdis`, the same law as the deaerator flow, so there is one path.
- Still open: the CEP motor current law is still the snapshot ratio (28.1 A x shaft power / 245.7 kW). The TECO motor data sheet (eff / pf, drawing 4A040Y856) is not on the PC. The baseline line was swapped one-for-one with the phase thread's OK.
- Tested: no-fit 0 new; behaviour gate 150 MW 20 min ALL PASS.
