# Phase 11 part 7+8 (SUZU), fix 7: turbine lube oil tank and bearing heat (2026-11-27, GO FIX 11)

Binago:
- Main oil tank T-n920 13,200 L normal (YUA read, project file suzu-leftovers-doc-reads.md) x 0.86 kg/L x 2.0 kJ/kg K = 22,704 kJ/K; dati 25,800 NO-SOURCE.
- Init ng bearings: 1,300 kW sa 3600 rpm x (speed / 3600)^2 (journal bearing friction, Petroff, DERIVED); dati linear, NO-SOURCE.
- Tinanggal ang 53.1 % (27.PNG) na pamalit kapag walang TICLO1002 output: walang utos = sarado ang TCV-CW1201.

Sinubok (headless, 150 MW start): TICLO1002 sa AUTO ay dinadala ang outlet papuntang 46 C (42.5 -> 45.6 C sa 13 min). Ang lube_oil.js ay FAIL sa 120 s (42.9 C vs 36.PNG 46 C): ang start state ay gawa sa lumang model; kailangang i-settle ang 150 MW start sa bagong code (tools/steady150 settle, PR 672 ng KANA) bago ang PR na ito.
Hindi sinubok: turning gear at coast down.
