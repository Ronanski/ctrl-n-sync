# Lane 5 (AKIHO): alarm points na may live value na

- Bago: src/world/field/alarm.js, 71 field row. Ang mga transmitter at switch sa alarm list na wala sa kahit anong logic sheet ay may value na ngayon mula sa planta sa app (temperatura, presyon, level, analyzer), kaya gumagalaw at nag-a-alarm sila sa annunciator at alarm summary.
- Bilang: alarm point na may live value 274 → 345 ng 371. I/O na may live value 1,941 → 2,013.
- Source: IO list (station at address ng bawat row) at alarm list; ang value ay galing sa engine na mayroon na (walang bagong numero o constant).
- Natitirang 26 at ang may-ari ng bawat isa, at 12 bagong alarm sa 150 MW (findings laban sa list, hindi binago ang limit): /mnt/project-files/lanes/lane5/alarm-no-live-2026-11-25.md.
- ABC-003E PTN004029 ~ 032 at PS0004: parameter ng function block (pattern slot at ramp 5 %/min), hindi signal; walang ikakabit.
- Test: tests/lanes/lane5 (alarm-live, alarm-rows 705 / 0, DITL-80L) pasado; engine bundle ok; trace 150 MW 5 min.
- Hindi sinubok: live click sa app ng bawat point.

AKIHO, lane 5 ALARMS AND CURVES
