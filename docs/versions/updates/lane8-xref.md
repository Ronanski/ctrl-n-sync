# Lane 8 (QA : SAORI): bilang ng kabit ng logic sa ibang sheet (DITL, ABC, TCS)

## Ano ang nagbago
- **`tools/trace/xref.cjs`** (bago): ang bawat input na sinasabi ng drawing na galing sa ibang logic sheet (FROM ng DITL, FROM DITL ng ABC, LOCATION TCS) ay binibilang mula sa tumatakbong app. Ang bilang ay: nakakabit sa tamang sheet, sa ibang sheet, model ang nagbibigay, o walang kabit (hiling ng user, "Interconnected din dapat ang mga logic").
- **`tools/trace/RULES.md`**: nakatala ang rule.

## Sinuri (main e7827ce, 150 MW)
- DITL na nagbabasa ng DITL: 1,717 / 1,888 (54 sa ibang sheet, 4 model, 113 wala).
- DITL na nagbabasa ng ABC: 159 / 162.
- ABC na nagbabasa ng DITL: 131 / 131.
- DITL LOCATION TCS: 37, wala pang galing sa TCS sheet. Ang turbine model ang nagbibigay.

## Hindi nasubok
- Walang binago sa app; tool lang ng QA.

SAORI
