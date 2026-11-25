# TCS ATS CRI MONT.MD (criteria monitor) mula sa ATS program drawing (TCS LOGIC : MARIA, 2026-11-25 PHT)

## Binago
- `src/digital/tce-run.js`: bagong macro `CRI MONT.MD`. Isang block bawat criterion, 72 block sa 18 sheet (TCA550 ~ TCA567).
- Mga batayan:
  - ATS program 310SC90-795 Rev 2, sheet 10 "CRITERIA CHECK LOGIC" (book p 134)
  - sheet 11 "CRITERIA BYPASS LOGIC" (p 135)
  - criteria table 310SC90-796 sheet 3 (p 159)
- Ang K table na naka-print sa loob ng block ang nagsasabi kung saang step tinitingnan ang criterion: IN0 ~ IN8 = column A (step in), EX0 ~ EX8 = column B (execution).
- Mga output:
  - STPIN: hindi OK ang criterion habang naka-order ang step na nagtatanong nito.
  - EX: hindi OK ang criterion habang tumatakbo ang step na nagtatanong nito.
  - BYPASS: ang CRT PB CRITERIA BYPASS habang hindi OK ang criterion. Itinuturing itong OK hanggang maging OK ito.
- Ang step ay binabasa sa definition ng step sheet ("STEP IN n ORDER", "STEP n EXECUTING"). Bagong kakayahan ng compile:
  - `f.defs` = input mula sa definition.
  - `f.inBox` = parameter na naka-print sa loob ng block.
- Inayos ang `STEP CONTROL MD`: ang ORDER (STEP IN n ORDER) ay SELECTED na lang. Ayon sa sheet 10, ang A criteria ay tinitingnan habang SELECTED, at ang B ay habang EXECUTED.
- Hindi nakakabit sa anumang sheet: FAIL, USE, MB, MB2, MODE. Hindi ibinigay.

## Bilang
- Drawing-complete: 217 → 235.
- Lahat: 316 → 334 sa 419.
- Ang 9 na step at 18 na criteria monitor ng ATS ay tumatakbo na.

## Test
- `tests/tce/sheets.cjs`:
  - TCA550 CRI 1.1 ay kinukuha ang STEP IN 2 ORDER mula sa TCA522.
  - Step in / execution ayon sa K table.
  - Bypass.
  - FLOOR = 235.
