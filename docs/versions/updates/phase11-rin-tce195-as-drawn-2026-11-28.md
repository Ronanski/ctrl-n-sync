# Phase 11 RIN: TCE195 MW control as drawn (2026-11-28)

## Binago
- `src/analog/engine/turbine.js` anTbFlow:
  - The GOV CONTROL SIGNAL is now the PIV022 output alone (TCE195 p.135: G1 0.05, G2 1.0, TI 5.0 s, HL 110 % / LL -5 %, on TARGET MW DEMAND - GEN. MW in MW).
  - Its integral (`tb.fy`) is set to GOV SET (`tb.fd`) in INITIAL, GOV MANUAL and LLM limiting, so the change over is bumpless, as drawn (X tracks GOV SET).
  - Deleted: the feedforward D / M0, which is not on the drawing, and the offset integral `tb.fi`.
- `unit.js` / `tcs.js`: comments and the off-grid reset follow the new name.
- Effect for the operator:
  - At a load hold, nothing changes: the feedforward was a constant.
  - On a load ramp, the MW now trails the target by rate / (150 MW x 0.0001 /s). That is 3.3 MW at 3 MW/min, the drawn PI.
- Not coded: LMS027, the limits on the MW error (HL / LL from PA2 027 = the load up / down rate, or 0.06 in runback, x 2.5, G028 / G029). The unit of LOAD UP RATE cannot be read from TCE185 p.131 (L-RATE x 0.025), nor whether PA2 027 sets values or rates. Exact parts: TCE195 LMS027 / PA2 027, TCE185 G (x 0.025). PC read asked.
- MOC: no controlled item changed (`tools/moc/moc.cjs --diff` empty: engine code, no sheet / tag / alarm / link).

## Sinubok
- 150 MW held 20 min: MW 150.9 to 151.1, no trip, MSP 126.6.
- Load rejection (turbine-rejection): PASS.
- tcs-dcs links: PASS.
- TCS backup macros: PASS.

## Hindi sinubok
- The full sweep and the cold start-up load up. Checks runs gen-electrical; it timed out locally before.
