# TCS model (tcs.js): the last SNAPSHOT-TO-REPLACE lines removed (lane 1, MARIA, 2026-11-28)

User rule 2026-11-28: no snapshot, trend or SOP number in the plant model, not even as a check.

- Header: the PR-OPE-5002 line (gland sealing, vacuum up, rolling, heat soak table and hood numbers) is gone. The hood limits 80 / 52 C,
  rub check, critical speeds and aux steam minimum now cite the TG Operation Manual STIE-14747 (vendor design document).
- Heat soak modes: the comment now cites 310SC90-775 Fig. 1 / 2 only (was the procedure table 8437).
- Rolling steam per mode (TCS.steam, the Training guide value ats.steam): the SOP numbers (60 / 400, 81.6, 110 / 455, RH 7.0 / 415 / 485)
  are replaced by the set points of the ATS criteria 1.3 ~ 1.6 on the TCS drawings (TCA536 / TCA532, TCS.cri): cold 58.12 / 304, warm
  78.01 / 323, hot 107.38 / 345 kg/cm2g / C, reheat 7.14 kg/cm2g / 201 C. The criteria logic is unchanged (it already read TCS.cri).

No SNAPSHOT-TO-REPLACE mark is left in tcs.js.

Tests: tcs-motors, heat-soak-ibd PASS.
