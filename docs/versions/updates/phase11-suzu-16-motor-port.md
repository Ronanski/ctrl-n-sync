# Phase 11 part 7+8 (SUZU), fix 16: the house load of the SUZU motors as a port (2026-11-28)

Binago (`src/analog/engine/model/cooling.js` anSuzuMotorPort):
- Bagong port `q.motor.SUZU` {P kW, Q kvar} para sa house load ni YUI: ang kuryente ng seawater pumps A / B / C, ACWP A / B at plant air compressors A / B / C. P = shaft kW / eff, Q = P x tan(acos pf).
- SWP: eff / pf ng TECO motor table D1-0-064 p26 sa 50 / 75 / 100 % (basa ni YUA, yui-reads-4.md). ACWP: 95.0 %, pf 0.86 (D1-0-033 p10). PA compressor: 95.5 %, pf 0.88 (D1-0-059 p7). Ang 100 % point lang ang naka-print sa ACWP at compressor (DERIVED: hawak sa lahat ng load).

Sinubok (headless, 150 MW 60 s): dalawang SWP 1,700 kW shaft bawat isa (1,776 kW / 230 A, tugma sa motor current 229.9 A), ACWP 250 kW, PA compressor 420 kW: port P 4,255 kW, Q 4,305 kvar. ports, no-fit (0 bago), one-path PASS.
- `src/analog/engine/elec.js` (OK ni YUI): binura ang 8 lumang row ng AN_EL.mot (swIa0-2, acI0-1, paI0-2: current x ETAP pf 0.927 / 0.919 / 0.922) at ang gamit nila sa Pa / Qa, sa parehong commit; ang house load ay galing na sa q.motor.SUZU (PR 712 ni YUI ang nagsusuma). Mas mababa ang house load nang mga 1.1 MW sa 150 MW (ang SWP ay binilang dati sa pf 0.927, ang table ay 0.72).
Hindi sinubok: live app.
