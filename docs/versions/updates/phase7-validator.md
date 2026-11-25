# Phase 7: ang bilang ng QA ay kusang tumatakbo sa Checks (thread "Verify the 15 phases")

## Ano ang nagbago
- Bagong `tests/lanes/qa/trace-gate.cjs` (tumatakbo sa Checks sa `tests/lanes/run-all.cjs`, ~50 s): pinapatakbo ang QA trace (150 MW, 2 plant min) at hinahawakan ang 22 bilang laban sa `tools/trace/baseline.json`. Hindi puwedeng bumaba ang nakakabit (1,787), may value (2,139), memory sa sheet, sheets na tumatakbo; hindi puwedeng tumaas ang walang kabit (145), walang source, B1 ~ B5; dapat 0 ang NaN, F(X) na hindi nahanap, nawawalang IBD at trip.
- Ang PR na nagpabuti ng bilang ang naglilipat ng number sa baseline.json; ang PR na nagpalala ay kailangang may dahilan sa "why".
- `tests/lanes/qa/tce-complete.cjs` floor 196 -> 256 (ang bilang ng main ngayon).
- `tools/trace/RULES.md`: seksyon ng gate. `docs/PHASES.md`: Phase 7 = TAPOS.

## Test
- Parehong bilang sa dalawang takbo (deterministic).
- Sinubok na bumabagsak: baseline linked 1,800 at B2 70 -> FAIL sa dalawa.
- run-all, no-fit, scope-doc: pasado.
