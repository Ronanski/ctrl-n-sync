# TCS turbine speed: DUP AI DIAGNOSTICSV + PTI ERROR DETECT (TCS LOGIC : MARIA, 2026-11-25 PHT)

Bilang: 357 → 358 of 419 TCS sheets (TCE143; nasa column na "from manual text", 105 → 106).

## Ano ang nakikita ng operator
- May TURBINE SPEED na ang buong TCS program. Dati ay walang halaga (NaN) ang lumalabas sa TCE143, kaya walang speed ang lahat ng sumusunod, pati ang governor chain.
- Ang speed ay ang gitna ng tatlong pickup (2 out of 3). Kapag nawala ang isang pickup, minamarkahan itong bad pagkalipas ng 5 s, at ang speed ay galing pa rin sa dalawang natitira.

## Source
- TC-14-116 5.3.2.2 "Turbine Speed Input" (pdf pp 93-94): tatlong pickup, binibilang ng PTI module ang pulses. Sa figure: COUNTER(1) → MJL → "Turbine Speed (2oo3) (For Control)".
- Ang PTI card LYT000A ay may low-speed at high-speed counter.
- Mga value na naka-print sa TCE143:
  - DELAY TP 5.0 s, DELAY-S 0.15 s, DELAY-L 5.0 s
  - H-CNT ABN ±500 rpm, DEV ±10 rpm
  - CNT MODE SW SPEED 3000 rpm, TD 2.0 s
- Ang pagbasa ay nakasulat sa tabi ng code (tce-run.js).

## Ayos sa sheet
- Ang TCE143 low counter A / B / C ay hindi nakakabit sa LCA / LCB / LCC: nagsisimula ang wire sa pin ng macro, kaya hindi ito nababasa bilang input. Hinati ang wire sa riser, gaya ng drawing.

## Sinubok
- tests/tce/sheets.cjs, kasama ang bagong test na tumatakbo sa TCE140 ~ TCE143:
  - Tatlong pickup sa 3599 rpm: speed 3599 at HIGH COUNTER EFFECTIVE.
  - Nawala ang pickup B: bad pagkalipas ng 5 s, speed 3599 pa rin.
- Pasado rin ang tests/tce/run.cjs, qa/tce-complete at integrator/tce-loop-mark.

## Hindi binasa (c)
- Wala sa manual kung paano ginagamit ang low counter, kaya hindi ito binasa:
  - DUP AI DIAGNOSTICSV: LCA / LCB / LCC, TCH, L-CNT ABN K 50 rpm.
  - PTI ERROR DETECT: PTI SW (walang sheet na bumabasa), DEV 1 ~ 3, LCK K, DELAY TP, at ang H FLAG / L-CNT / ABN na inputs.
