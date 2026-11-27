# Phase 11 rank 9b (RIN, 2026-11-27): bypass valve stroke times

- Follow-up (same day): bypass stroke times from the vendor sheets: PCV-MS1020 / PCV-HR1010 move at 100 % / 2 s on the trip-open
  solenoid and 100 % / 5 s on the 4-20 mA positioner (turbine.js anVlvStroke, AN_VLV.tQ / tA; vendor upper limits, taken as is).
  Before: the opening followed the controller at once. Trip from 150 MW: the HP bypass reaches 32 T/H after 2 s (was full at once).
  The blow-off PCV-MS1001 has no stroke time in the docs (no solenoid, positioner only): as commanded.
- Spray valves TCV-FW1060 / TCV-CD1115 (water, Cv 10.3 / 25.4): handed to NANA (fw.js) and MEI (anCdTagStep), their files.
