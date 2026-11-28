# Phase 11 part 7+8 (SUZU), fix 22: mas mabilis na sootblower lane test (2026-11-28)

Binago (`tests/lanes/model/sootblower-steam.cjs`, walang binago sa model, walang tinanggal na check):
- Ang bawat case ay may pinakamahabang oras pa rin, pero natatapos ito kapag naabot na ang dulo: ang air heater program kapag tapos na ito (ph 0, walang steam), at ang paglamig ng drains kapag bumaba na ng 50 C at patay na ang blowing permissive (sa loob ng 30 min; 605 s ngayon).
- Ang settle bago ang Cold at ang 150 MW case ay 120 s na (dati 300 s); pareho ang resulta.
- Ang dalawang lance blow ay 270 s pa rin: kailangan ito ng program bago ang air heater start.
Sinubok: ALL PASS. 14 min 42 s sa cloud (dati mga 26 min; 46 min sa Checks).
