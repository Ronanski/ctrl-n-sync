# Phase 3: nakasulat na ang scan, ayos ng takbo, timing at DCS-TCS link (thread "Verify the 15 phases")

## Ano ang nagbago
- Bagong `docs/ARCHITECTURE.md`: dalawang orasan (operator clock: real time x speed, step 0.5 s, max 1 s; fixed clock: eksaktong 0.5 s, deterministic), ayos ng takbo (ABC -> plant model -> DITL world -> TCS sheets), cycle ng TCS sheets mula sa drawing (100 / 30 / 10 ms), DCS-TCS link (69 hardwired, 252 Modbus rows).
- Bagong `tests/lanes/qa/architecture.cjs` (Checks): binabasa ang 14 na numero ng doc at hinahanap sa code; bagsak kapag magkaiba.
- `docs/PHASES.md` Phase 3: ang bukas na item (scan period ng totoong DCS, TCS 10 / 30 ms sheets, lumang tcs.js).

## Test
- Pasado. Sinubok na bumabagsak: tatlong numero ng doc binago -> FAIL sa tatlo.
- Walang binago sa app mismo.
