# TCS papuntang DCS: galing na sa TCE / TCA sheets (lane 0, YUA)

## Ano ang nagbago
- Ang DCS address na hardwired mula sa TCS (TCS I/O list 310SC90-773) ay kumukuha na sa output ng TCE / TCA sheet na nagdo-drawing nito. 25 output ang nakakabit: turning gear, RSV / ICV closed, trip 2, speed, first stage pressure, start-up mode, governor at generator signal.
- Iisang value na ang nababasa ng DITL / ABC, ng Modbus at ng TCS page para sa mga output na iyon.
- Start-up mode (ambient, cold 1, cold 2, warm, hot): galing na sa memory ng TCA500, hindi na hiwalay na kuwenta.
- EHG inputs: ang 92 signal ng tatlong protection controller (TPC) ay may sarili nang A, B, C. Dating 12 lang.
- MSV at RSV position: sumusunod sa trip oil at sa valve test, kaya tama ang I.0401 / I.0402 / I.0416 pagkatapos ng trip.
- AI0534 (turbine speed): galing sa TCE970-6. I.0406: galing sa TCE960-18.

## Test
- tests/lanes/integrator/tcs-dcs.cjs: bawat hardwired output ay nakakabit o may nakasulat na dahilan. Bawat connector ng program ay may pinanggagalingan o nasa listahan ng wala.
- Sinubukan din sa save points: cold (turning gear, ATS step 1), warm, 3600 rpm at synchronized.

## Wala pa
- 18 output ang hindi pa nakakabit, kasama ang dahilan sa test: governor chain (blocks ng lane 1), AUXILIARY TYPE 15, reactive power, at ATS load hold.
- Fast acting solenoid (IBD TA-31 ~ TA-38), CRT operation permissive at TPC hardware status.
- DCS papuntang TCS commands ng ATS.

YUA
