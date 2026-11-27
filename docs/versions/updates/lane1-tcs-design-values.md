# TCS model (tcs.js): design values replace the SNAPSHOT-TO-REPLACE numbers (lane 1, MARIA, 2026-11-28)

Follow-up of lane1-tcs-no-snapshot.md (PR 715). User rule 2026-11-28: no snapshot, trend or SOP number in the plant model.

Design values (design values read by YUA from the TG documents, tcs-design-values-2026-11-28):
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
