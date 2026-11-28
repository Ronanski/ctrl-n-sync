# TCS model (tcs.js): the last SNAPSHOT-TO-REPLACE lines removed (lane 1, MARIA, 2026-11-28)

User rule 2026-11-28: no snapshot, trend or SOP number in the plant model, not even as a check.

- Header: the hood limits 80 / 52 C, rub check, critical speeds and aux steam minimum cite the TG Operation Manual STIE-14747 (vendor
  design document); the gland sealing / vacuum up guide numbers are deleted (not used by the model or the criteria).
- Heat soak modes: the comment cites 310SC90-775 Fig. 1 / 2.
- Rolling steam per mode (TCS.steam, the Training guide value ats.steam) = the set points of the ATS criteria 1.3 ~ 1.6 on the TCS
  drawings (TCA536 / TCA532, TCS.cri): cold 58.12 / 304, warm 78.01 / 323, hot 107.38 / 345 kg/cm2g / C, reheat 7.14 kg/cm2g / 201 C.
  The criteria logic is unchanged (it already read TCS.cri).
- Comments state the design source only; the no-snapshot ratchet baseline of tcs.js goes to 0 (tools/check/no-snapshot.cjs --update).

No SNAPSHOT-TO-REPLACE mark is left in tcs.js.

Tests: tcs-motors, heat-soak-ibd PASS.
