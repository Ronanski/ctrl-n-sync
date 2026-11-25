# Phase 1: iisang file ng saklaw at docs (thread "Verify the 15 phases")

## Ano ang nagbago
- Bagong `docs/SCOPE.md`: lahat ng plant document at kung aling revision ang masusunod (TCE / TCA Aug 2017 > IBD, Feb 2017 hindi ginagamit, alarm list 20160912, P&ID RB > RA, wiring original 2023-10-03, design docs para sa physics, HIACS backup values hindi ginagamit), mga sistemang pasok at labas (WTP, coal handling, air compressors / dryers labas; demin, coal, hangin, sand, limestone = walang hanggang supply), at ang equipment list K1AU3-L1-0-002.
- Equipment list sinuri mula sa PC: 182 tag sa RA (hindi 173); PASOK 126, LABAS 56. Ang R0 (2016, mas bago) ay scan na walang text: babasahin pa.
- Ang laman ng `docs/DOCUMENT_INDEX.md` at `docs/HARDWARE_DOC_INVENTORY.md` ay nasa SCOPE.md na (Appendix A at B); tumuturo na lang doon ang dalawang file.
- Bagong `docs/PHASES.md`: 15 phase, "tapos kapag", estado (0 TAPOS, 14 BAHAGI, 1 HINDI PA) at bantay na test.

## Test
- Bagong `tests/lanes/qa/scope-doc.cjs` (tumatakbo sa Checks sa `tests/lanes/run-all.cjs`): bagsak kapag may kulang na seksyon o revision rule, kapag may page o alarm group ang app na wala sa saklaw, kapag mali ang bilang ng equipment, o kapag kulang ang 15 phase. Sinubok din na bumabagsak ito kapag tinanggal ang isang page.
- Walang binago sa app mismo (docs at test lang).
