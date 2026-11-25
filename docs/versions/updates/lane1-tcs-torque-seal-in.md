# TCS motor valve TORQUE (SEAL-IN) mula sa drawing (TCS LOGIC : MARIA, 2026-11-25 PHT)

## Binago
- `src/digital/tce-run.js`: bagong macro `TORQUE (SEAL-IN)`. Batayan: drawing IBD 310SC90-794 Rev 2 sheet 16 "TORQUE SEAT (SEAL-IN)" (book p 32).
- **AUTO / MANUAL:**
  - Sa MANUAL, ang PB OPEN / CLOSE ang nag-uutos.
  - Sa AUTO, ang AUTO OPEN / CLOSE CONDITION ang nag-uutos.
- **Seal-in:** ang utos na OPEN ay nananatili hanggang LIMIT FULL OPEN. Tumitigil din ito sa:
  - electrical trouble,
  - open fault,
  - torque open bago ang full close limit,
  - o utos na CLOSE.
  - Ang CLOSE ay pareho, at tumitigil sa torque switch ng close (torque seating).
- **OPEN / CLOSE FAULT:**
  - Kapag walang full limit sa loob ng t1 / t2, nagiging fault (ANN 2 / 3).
  - Ayon sa NOTE ng drawing, ang t1 / t2 = valve opening time + 5 s. Ito ang nakalimbag na TP 35 s.
  - Nananatili ang fault hanggang RESET.
- **ANN 4 / 5:** ang torque switch na umandar bago ang limit.
- **Hindi nasa sheet 16 (hindi binasa):** TD 5 s, R, M, HL, LL, K at ang ikatlong TP 5 s na nakalimbag sa tabi ng block.
- **Tumatakbo na ang 6 na drain valve:** MSV(A)/(B) abv seat, CV(A)/(B) abv seat, CRV(A)/(B) bel seat (TCA610, 611, 615, 616, 625, 626).

## Bilang
- Drawing-complete: 202 → 208.
- Lahat ng sheet: 301 → 307 sa 419.
- Manual text: 99, hindi nagbago.

## Test
- Ang `tests/tce/sheets.cjs` ay may bagong behaviour test: seal-in, limit stop, open fault sa t1, RESET, AUTO lang sa AUTO, at close torque bago ang limit.
- FLOOR = 208.
