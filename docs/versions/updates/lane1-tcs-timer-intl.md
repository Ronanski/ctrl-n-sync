# TCS timers with no SW wire take INTL (TCS LOGIC : MARIA, 2026-11-25 PHT)

Bilang: 361 → 363 of 419 TCS sheets (TCA549, TCA633; drawing-complete 255 → 257).

## Source
- TCE soft logic 331DM09784 p 16, SYSDEF No. 3 INTL: "Creates and defines the condition, 0 at initial start, and 1 after then. This condition is used for the default of the switch input of the Timer macros."

## Binago
- **TP / TD / TW na walang wire sa SW:** INTL ang SW, kaya 0 sa unang scan at 1 pagkatapos. Dati ay bukas (open) ang mga ito.
- **CMP na walang wire sa SW at walang hysteresis** (walang LL na naka-print, o LL = HL): pareho ang Y kapag SW = 1 o 0 (ML 51), kaya hindi na ito bukas.
- **CMP na may hysteresis at walang SW wire:** bukas pa rin. Ang default ng SW nito ay wala sa macro list (ang SYSDEF ay para lang sa timer).
  - Ito ang pumipigil sa TCA530A, TCA534, TCE145, TCE227 at TCE228.
  - Ang TB na walang SW ang pumipigil sa TCA767.
- Pinalitan ang lumang test na "TP with no SW wire must be open", dahil may dokumento na ngayon para sa default nito.

## Sinubok
- tests/tce/sheets.cjs: pasado, kasama ang mga bagong test para sa need() ng TP at CMP, at para sa TP na SW = 0 sa unang scan.
