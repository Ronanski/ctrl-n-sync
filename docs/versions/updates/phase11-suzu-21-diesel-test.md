# Phase 11 part 7+8 (SUZU), fix 21: diesel oil test on the app's one 150 MW start path (2026-11-28)

Binago (`tests/regress/diesel_oil.js`, walang binago sa model):
- Ang simula ng test ay ang "At 150 MW" ng app (st150 steady save, kagaya ng feedwater / sootblower), hindi ang lumang AN.plantLoad150. Sa lumang simula ay malayo ang PICDO0005 / PICDO1008 sa set point (13.9 / 9.7). Sa tamang simula, ang header ay 12.8 at ang ring ay 11.0, eksakto sa set point.
- Cold start: ang daloy ng pump ay ang vendor ALLWEILER SNH660 na 33.9 m3/h x 0.87 = 29.5 T/H (K1AU3-D1-0-060 R0, boiler.js AN_DO.Qp, screw pump). Ang lumang 25 ay ang system flow ng MB-022, hindi ang sa makina.
Sinubok: diesel_oil ALL PASS (dati 2 FAIL, pareho sa main).
Hindi sinubok: live app.
