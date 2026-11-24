# v1.0.0-beta.471: TCS MOTOR STANDARD mula sa drawing (TCS LOGIC : MARIA, 2026-11-25 PHT)

## Binago
- `src/digital/tce-run.js`: ang macro **MOTOR STANDARD** (LMA580A ~ D, 8 block: TCA655 vapour extractor, TCA680, TCA700, TCE300 main oil pump A / B, TCE305 control oil pump A / B, TCE310 DC emergency oil pump) ay may kahulugan na mula sa **drawing**: MHPS TYPICAL LOGIC FOR MOTOR, IBD 310SC90-794 Rev 2 sheet 14 ("Turbine Control System (book)" p 30).
  - AUTO / MANUAL (PB AUTO / PB MANUAL, W lamp); start = AUTO START sa AUTO o PB START sa MANUAL; stop = PB STOP sa MANUAL, AUTO STOP sa AUTO, o STOP ABSOLUTE.
  - START FAULT: walang sagot ng MCC 3 s pagkatapos ng start (printed TP 3.0 s); STOP FAULT: may sagot pa 3 s pagkatapos ng stop; TRIPPED: nakita ang sagot (TD 1.0 s) tapos nawala habang naka-start; MOTOR ELECTRICAL TROUBLE. Hawak ang fault hanggang PB RESET. ABN = alinman sa apat (ANN 1 ~ 4).
  - Ang PB START / STOP / AUTO / MANUAL / RESET ay nasa loob ng macro: bagong CRT button ng bawat block (`CRT:<sheet>.<block>.START` ...), 40 button.
  - Ang printed TP 0.5 s ay wala sa sheet 14: hindi binabasa.
- TCE300 / TCE305 / TCE310: idinagdag ang mga parameter na naka-print sa ilalim ng bawat MOTOR STANDARD (TD 1.0 s, TP 3.0 s x2, TP 0.5 s, LME580A / B o C / D), na hindi pa na-type.

## Bilang
- Drawing-complete: 196 → 202. Manual text: 70 (walang pagbabago). Lahat: 266 → 272 ng 419.

## Sinubok
- tests/tce/sheets.cjs (headless): START PB sa MANUAL, start fault sa 3 s at RESET, AUTO START sa MANUAL ay walang epekto, AUTO START sa AUTO, TRIPPED kapag nawala ang sagot, open kapag walang TD / TP.

## Hindi sinubok
- Ang wiring sa loob ng sheet 14 na hindi malinaw (ang mga input ng reset OR ng fault flip-flop, ang mask ng R / G lamp) ay binasa bilang: fault reset = PB RESET o ang sunod na utos ng kabila; R / G = sagot ng MCC.
- Wala pang nakikita ang operator sa app.
