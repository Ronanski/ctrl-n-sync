# Phase 2: ang finish line ay data na, hindi na puwedeng magkaiba ang listahan at ang panukat (thread "Verify the 15 phases")

## Ano ang nagbago
- Bagong `docs/accept/part1-targets.json`: ang 31 target ng Part 1 (45 / 90 / 150 MW) bilang data, parehong numero ng table sa `docs/ACCEPTANCE.md`.
- `tools/accept/part1.cjs` ay binabasa na ang JSON. Dati ay may sariling table ito na luma na: 7 target na iba sa inaprubahang listahan (RH outlet 45 MW 507 laban sa 488, bed 45 MW 850-870 laban sa 745 ±25, limestone 90 / 150 MW 7.1 / 12.0 laban sa 4.9 / 4.9, total air 45 MW 365 laban sa 446, O2 45 MW 10.9 laban sa 12.7).
- Hot reheat temperature (HB 505 / 538 / 538) ay nasa listahan pero walang basa ang tool: "not measured" ang lumalabas, hindi pasado.
- Bagong `tests/lanes/qa/acceptance.cjs` (Checks): bagsak kapag magkaiba ang table at ang data, kapag may target na walang source o tolerance, kapag may sariling table ulit ang tool, kapag may Part 2 row na walang source / estado / "pasado kapag", o kapag hindi tugma ang Bilang.
- `docs/PHASES.md` Phase 2: ang kulang ayon sa ANS-3.5 (pasya ng user).

## Test
- Pasado sa kasalukuyang listahan. Sinubok na bumabagsak: 273.36 ginawang 273.30 sa table -> FAIL.
- Walang binago sa app mismo.
