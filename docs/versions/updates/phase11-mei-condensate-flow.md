# Phase 11 part 4 (MEI): condensate flow to the deaerator from physics

- Changed in place: `plant.js` `anDaQ`. Before, a line fitted to the HMI snapshot (LCV-CD1104 17.5 % = 380 T/H). Now the condensate pump curve (KSB Q43495D) is solved against the LCV-CD1104 Cv vs lift (K1AU3-E2-0-123 R1 item 14: linear, Cv 340), the line to the valve and the deaerator back pressure. The constants come from the two sizing conditions on the valve sheet plus deaerator O&M L15-2 (6.05 ata design; tank filled before steam).
- `unit.js` `anCondStep`: the CEP flow uses the same anDaQ plus the FCV-CD1120 recirculation (223 T/H valve sheet). The old 2.5 T/H per % path is gone.
- Tested: no-fit 0 new; behaviour gate 150 MW 20 min ALL PASS.
- Not tested: 45 ~ 150 MW sweep (phase gate).
