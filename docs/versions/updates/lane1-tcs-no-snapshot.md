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

Second pass (design values read by YUA from the TG documents, tcs-design-values-2026-11-28):
- rub check 200 rpm: Operation Manual STIE-14747 p.40 (rub check 200 r/min, 120 r/min/min, go on below 100 r/min).
- COP 163 kg/cm2g, 60 L/min x 2: 310PB64-455 specification of equipments; the COPs draw from the main oil tank (not the lube header).
- turning gear 3 rpm: maintenance manual p.35 (about 2 / 3 r/min); disengage 4 rpm = gear speed + 1 (DERIVED, clash gear, no number in the docs).
- LP hood 52 C before load up / 80 C before sync: Operation Manual STIE-14747 p.43 / 45 / 52 / 59.
- aux steam: vendor minimum 7.0 kg/cm2g (Operation Manual p.32 / 87), the header pressure is unit.js AN_AS (no fixed 10).
- oil rise: one source with the lube oil cooler model unit.js AN_LO: 1,300 kW at rated, oil 63 -> 46 C (O&M L2 TG 2-3), heat ~ speed^2;
  17 C at rated.

DERIVED (not in the docs; physics or vendor practice, each written beside the value in tcs.js):
- control oil filter drop 0.5 (clean high pressure element), oil purifier discharge 3.0.
- bearing metal = bearing oil outlet + 25 C x speed, thrust = + 10 C x speed (babbitt film rise).
- shaft vibration 0.04 mm (half the ISO 7919-2 zone A / B boundary), a bump at the critical speeds 1510 / 1550 rpm (Operation Manual p.42).

Still SNAPSHOT-TO-REPLACE (3 lines): the gland sealing / vacuum / rolling steam guide text in the header and the guide table; these
numbers are text only, not used by the model or the criteria.

Tests: tcs-motors, field-state, alarm-live, gen-electrical, heat-soak-ibd PASS.
