# LMYP OTS 1.0.0-beta.428 (QA : SAORI, lane 8, 2026-11-25)

Sumunod sa beta.422. Test lang; walang binago sa app, sa plant model, sa logic o sa HMI.

## Ano ang bago

`tests/lanes/qa/tce-complete.cjs`: dalawang bagong rule mula sa pagsuri laban sa Aug 2017 TCE / TCA PDFs (331DM09784; PDF page = drawing page + 2):

1. Ang LOGIC / PI/O EXPLANATION sheet (TCE022, TCE023) ay legend ng drawing, hindi logic ng controller: hindi binibilang.
2. Ang kabit mula sa ibang sheet na nakasulat sa drawing (source sheet + letra) pero naging CON: port (= 0) sa compile ay putol na kable ng sheet na nagbabasa. Halimbawa: TCE169 (PDF p 121), ang HEAT SOAK MODE mula TCE168 C ay laging 0.

Parehong code (main 502e57f): lumang rule 196 (real logic 140 + tables 56), bagong rule 141 (real logic 90 + tables 51). Floor 194 -> 141.

## Sinubok

`node tests/lanes/qa/tce-complete.cjs` = COMPLETE 141 (floor 141, exit 0).

## Hindi sinubok

Ang ayos sa `src/digital/tce-run.js` (lane 1): hindi ko ito binago. Sa kopya sa labas ng repo, ang "pinakamalapit na connector" sa halip na "unang connector sa radius" ay nagbabalik ng 290 sa 292 na nawalang kabit (bilang 192).
