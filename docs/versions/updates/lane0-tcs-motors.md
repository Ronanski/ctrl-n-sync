# TCS motors: sariling TCE / TCA sheet na ang nagpapatakbo (lane 0, YUA)

## Ano ang nagbago
- MOP-A/B (TCE300), COP-A/B (TCE305), EOP (TCE310), vapour extractor (TCA655), gland steam exhauster (TCA680) at oil purifier (TCA700): ang drawing mismo ang tumatakbo sa engine. Dating may sariling START/STOP rule ang model; tinanggal na iyon.
- Isang source lang bawat signal: contactor at MCC trouble galing sa electrical model, discharge pressure galing sa lube oil model, TCP1120 / 2120 / 3120 galing sa IBD TA-13 / TA-14.
- Ang IBD TB-1 / TB-2 / TB-12 / TB-21 / TB-22 / TC-28 faceplate ay pindutan at display lang ng sheet na iyon. Pareho ang pindutan sa TCE page.
- Ang TCE page ay hindi na nag-i-scan ng sariling kopya ng mga sheet na ito. Net ng engine ang ipinapakita.
- Ang memory ng sheet (AUTO, timer, latch) ay kasama sa SAVE at LOAD. Ang lumang save ay tatakbo pa rin.

## Iba sa dati
- START at STOP ay sa MANUAL lang (MOTOR STANDARD, IBD 310SC90-794 sheet 14). Sa AUTO, tatanggihan ito.
- Sa Cold, MANUAL ang EOP. Ang operator ang pipindot ng AUTO.
- Ang STOP ng tumatakbong MOP-A ay hindi nagpapaandar ng MOP-B. Ang standby ay umaandar sa mababang discharge pressure o electrical fault ng tumatakbo, gaya ng TCE300.

## Wala pa
- TCA636 / TCA638 B1 (gland seal group): 0 hanggang maikabit ang ATS steps.
- Turning gear (TCE350): IBD TB-9 pa.

## Sinuri
- 150 MW, 20 minuto, luma laban sa bago: parehong value, walang nadagdag o nawalang event.
- Bagong test: tests/lanes/integrator/tcs-motors.cjs. Pasado rin ang tcs_ibd_desk, tcs_ibd_b3_desk, tcs_ibd_devices, tcs_faceplates.
- build, build --check, version-check, no-fit, tests/lanes/run-all.cjs: pasado.

YUA
