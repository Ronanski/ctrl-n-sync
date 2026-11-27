# Phase 11 part 6 (generator): MW of the generator = shaft power less the generator losses

MODEL GENERATOR ELECTRICAL : YUI, with RIN (turbine), 2026-11-27 PHT.

- Binago: ang MW ng generator (U.MW, port gen.W) ay iisa na lang ang sumusulat, ang `unit.js anGenW`.
  - Naka-sync sa grid: MW = ang lakas ng shaft (U.Pm) bawas ang losses ng generator (port q.ccw.YUI, mga 1.94 MW sa 150 MW).
  - U.Pm = ang trabaho ng blades bawas ang mechanical loss ng turbine (AN_TB.mech 1.40 MW, kay RIN). Inaprubahan ni RIN ang linyang ito.
  - Sa house load (bukas ang 52L1): MW = ang house load, tulad ng dati.
  - Bukas ang 52G: 0.
- Dati, iisang bunton ang losses sa turbine side (AN_TB lo + kq). Pagkatapos ng trip, sumusunod ang MW nang 10 s (tauMW, NO-SOURCE).
- Binura: ang `MWss`, ang `tauMW` at ang pangalawang `U.MW = 0` sa 52G open. Buburahin ni RIN ang `anTbGen`, `AN_TB.lo` at `kq`.
- Halos hindi nagbago ang MW sa 150 MW: 153.29 MW, at 153.27 MW bago ang pagbabago, sa 10 s ng loaded start. Ang lumang bunton na 3.37 MW ay halos kapareho ng bago: 1.40 + 1.93 = 3.33 MW.
- Sinubok: `tests/lanes/run-all.cjs` 68 / 68, `one-path.cjs`, `no-fit.cjs`, `ports.cjs`.
