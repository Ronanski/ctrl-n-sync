# Field contact na iisa ang pinanggagalingan (lane 0, YUA)

## Ano ang nagbago
- **ELECTRICAL TROUBLE ng motor (DITL-22, 24, 30, 31, 61A, 76, 77, 111, 112 at mga kopya, 20 drawing)**: ang relay ng MCC ay nasa wire ng output, at ang input row na may parehong address (I.0054 sa DITL-22 row 15) ay iyon ding contact. Dati, umiilaw ang output pero hindi nakikita ng logic ng row (ang trip). Ngayon, pareho na sila, at bumabalik sa 0 pag-RESET ng relay.
- **DITL-43 (air preheater inverter)**: binabasa ang NOT TRIP I.0651 gaya ng sa logic (field bit o automatic row). Dati, field bit lang.
- **Field bit sa save**: alam na ng save kung aling switch row ang hawak na ng plant model. Ang row na wala roon (bago lang sa model) ay nililinis ang lumang bit sa unang value; ang pinili ng operator sa iba ay naiiwan.
- **Field row ng lane**: tugma ang tag kahit saan sa text ng row (DITL-87 row 24 / 26, MIR-P0719 / P0718), hindi lang sa unang tatlong salita.
- **I.0081 DCS CONTROL MODE PERMISSIVE**: bumabagsak sa mismong TURBINE TRIP ng TCS (TCE180), hindi na naghihintay ng 52G.

## Sinuri
- 150 MW, luma laban sa bago: parehong plant switch at parehong output ng lahat ng DITL.
- Bagong test: tests/lanes/integrator/field-contact.cjs (20 drawing, save list).
- build, build --check, version-check, no-fit: pasado; tests/lanes/run-all.cjs: pasado.

YUA
