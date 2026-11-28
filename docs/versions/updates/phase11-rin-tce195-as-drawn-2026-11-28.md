# Phase 11 RIN: TCE195 MW control as drawn (2026-11-28)

## Binago (`src/analog/engine/turbine.js` anTbFlow; sources TCE195 p.135, TCE185 p.131, TCS macro list 331DM09788 TCA014 / TCA017, YUA read /mnt/project-files/rin-lms027-reads-2026-11-28.md)
- **PIV022 is the velocity PI of the macro list (ML 13):** Y = G1 (X(j) - X(j-1)) + G2 TS / TI X(j). Its output is the change of GOV SET each cycle.
  - So GOV SET moves 0.05 % per MW of error at once, plus 0.2 %/s per MW.
  - Before, the integral was G1 G2 / TI = 0.01 %/s per MW (the ISA form, not the macro list), so the loop was 20 times slower.
- **LMS027 is a value clamp on the MW error (ML 41):** HL = -LL = 2.5 x LOAD UP RATE.
  - LOAD UP RATE = L-RATE %/min x 0.025 (TCE185 G010), so HL = 0.0625 x L-RATE. At 5 %/min (U.rateUp 7.5 MW/min) it is 0.3125 MW.
  - A clamped error moves GOV SET at 0.75 x L-RATE %/min (3.75 %/min at 5 %/min).
  - Error unit MW (DERIVED: SUB001 takes TARGET MW DEMAND and GEN. MW in MW, TCE070; G021 K 1, no MW-to-% gain on the sheet).
  - The RUNBACK COMMAND input (+/-0.06 x 2.5) has no source in the model (drawn '-'), so the load rates hold.
- **Deleted:** the feedforward D / M0 (not drawn) and the offset integral `tb.fi`.
- `tb.fy` = GOV SET of MW control (TCE196), limited 110 / -5 % (PIV022 HL / LL). It is set to the flow demand in INITIAL, GOV MANUAL and LLM limiting.
- **For the operator:**
  - At a load hold, MW is held tighter: 151.0 flat over 20 min (was 150.9 to 151.1).
  - On a load ramp, GOV SET follows at most 0.75 x the load rate. A ramp faster than that trails until the target stops.
- MOC: no controlled item changed (`tools/moc/moc.cjs --diff` empty: engine code, no sheet, tag, alarm or link).

## Sinubok
- 150 MW held 20 min: MW 151.0 to 151.0, no trip, MSP 126.6.
- turbine-rejection (peak and latch): PASS.
- tcs-dcs links: PASS.
- TCS backup macros: PASS.

## Hindi sinubok
- The full sweep (150 -> 45 MW ramps).
- The cold start-up load up.
- gen-electrical (it runs in Checks).
