# TCS model (tcs.js): no snapshot, trend or SOP number (lane 1, MARIA, 2026-11-28)

User rule 2026-11-28 5:18 AM PHT: plant snapshots, trends and SOP are not used in the plant model, not even as a check. Source of truth =
first principles + design data; set points = the DCS / TCS logic (HIACS backup counts as logic).

`src/analog/engine/tcs.js` had 38 lines citing a snapshot (36.PNG, 29.PNG, P35SHAFT), the SOP (PR-OPE-5002) or both.

Re-sourced to TCS logic or design (value kept or changed):
- critical speed zone 1372 ~ 1723 rpm: TCE164 TARGET SPEED HOLD MR A023 / A025 (was PR-OPE 8561).
- MOP AUTO start 5.6 kg/cm2g: TCE300 CPL A030 LL; COP AUTO start 133: TCE305 CPL A005 LL; EOP start 1.05: IBD TB-5.
- hood spray below 15 % load: IBD TC-35 GEN. LOAD < 15 % (was PR-OPE 9195 / 6307).
- holds: ATS sequence 310SC90-775 p.19 (was PR-OPE 8570).
- bearing oil 3.3 -> 1.84 kg/cm2g: design BEARING OIL 0.18 MPa(g), TG lube oil system 310SD14-354 (3.3 was a snapshot value).
- standby line-up (A running, B AUTO): the standby start of TCE300 / TCE305; pump CRT operation: the MOTOR STANDARD of the sheet.

Marked SNAPSHOT-TO-REPLACE (number kept until a design / logic source is read; 21 marks):
- rub check target 200 rpm (read ATS 310SC90-775 p.17 ~ 18 / TCA511).
- COP discharge 163.2 kg/cm2g and filter drop 0.6 (TG EHC control oil design pressure).
- oil purifier discharge 2.96.
- cooler inlet rise 16 C, bearing oil outlet rise 9 / 10 C, bearing metal rises 45 / 56 / 34 / 32 C, thrust 8.5 / 15.5 C, shaft
  vibration amplitudes (TG maintenance manual bearing design, vendor vibration data).
- turning gear 3 rpm / disengage 4 rpm (TG maintenance manual).
- aux steam PCV 10 kg/cm2 (aux steam drawing or DCS logic).
- LP exhaust hood 52 C before load up (only 80 C, criterion 1.12, is in 310SC90-776).
- gland sealing / vacuum up / rolling steam numbers of the header and the guide table (guide text, not used by the criteria).
- COP suction from the lube oil header (310SD14-354 to confirm).

Tests: tcs-motors, field-state, alarm-live, gen-electrical, heat-soak-ibd PASS.
