# Phase 11 part 7+8 (SUZU), fix 15: the sootblower steam test in Checks (2026-11-28)

Binago:
- Ang test ng sootblower steam ay inilipat sa `tests/lanes/model/sootblower-steam.cjs` at tumatakbo na sa headless world (tools/trace/world.cjs, walang browser), kaya kasama na ito sa Checks (hindi na mabubulok nang hindi napapansin). Ang world run: ALL PASS, 26 min, kasabay ng ibang lane.
- Ang reset position ng air heater blowers N-1040 / N-1042 ay binabasa na sa DITL-80L limit switch rows ZSR-N1040 / ZSR-N1042 (mula Phase 6 DCS 4076f568); dati DITL-80K rows 22 / 24, na wala nang switch (null ang basa).
- Ang steam ng air heater blower ay binibilang mula sa start command, at ang inaasahan ay steam habang bukas ang poppet (lance > 50 mm, Mk VX-AB manual): cycle 1180 s (L20 OMM), steam 1116 s, 1209 kg. Ang inaasahan ay kinuwenta mula sa docs (stroke 750 mm, step 38 mm, dwell 55 s), hindi mula sa model. Dati 1180 s / 1278 kg (steam sa buong cycle, bago ang poppet).

Sinubok (headless): ALL PASS (N-1042 3.9 T/H, 1115.5 s, 1208 kg; parehong bumalik sa reset).
Hindi sinubok: live app; ang hot end N-1040 (kailangan ng DITL-80 program step).
