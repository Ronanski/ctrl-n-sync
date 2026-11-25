# TCS AIR OPERAT VALVE mula sa drawing (TCS LOGIC : MARIA, 2026-11-25 PHT)

## Binago
- `src/digital/tce-run.js`: bagong macro `AIR OPERAT VALVE`. Batayan: drawing IBD 310SC90-794 Rev 2 sheet 22, "TYPICAL LOGIC FOR AIR OPERATED VALVE" (book p 38).
- Solenoid:
  - Ang SVE (utos na energize = open) ang nagse-set ng solenoid, at nananatili ito.
  - Ang SVD o ang OPEN FAULT ang nagre-reset nito.
- Mga fault:
  - OPEN FAULT: walang full open sa loob ng t1.
  - CLOSE FAULT: walang full close sa loob ng t2.
  - Nananatili ang fault hanggang RESET.
  - Ayon sa NOTE ng drawing, ang t1 / t2 = oras ng bukas / sara + 5 s. Ito ang dalawang TP na walang unit sa tabi ng block.
- Ang FFP ay OFF(0) sa bawat sheet.
- Hindi nasa sheet 22, kaya hindi binasa: R, M, HL, LL, K, TP 5 s.
- Tumatakbo na ang 9 na valve:
  - TCA605 steam seal diverting
  - TCA690 cold reheat non-return
  - TCA711 ~ 715 extraction non-return
  - TCA738 LP exhaust hood spray
  - TCE365 blow down

## Bilang
- Drawing-complete: 236 → 245.
- Lahat: 335 → 344 sa 419.

## Test
- Sa `tests/tce/sheets.cjs`: energize at hold, open fault sa t1, RESET, close fault sa t2.
- FLOOR = 245.
