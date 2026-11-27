# Phase 11 generator batch 2 (YUI, 2026-11-28)

## 1. Generator T'do 8.6 s (tcs-gen.js TCS_GEN.tdo, MARIA OK)
- The two manufacturer documents disagree:
  - GAE-2013-0136 R2 generator data sheet p.2: T'do 7.69 s (this value is replaced).
  - Hitachi reply to the FHI-SMC generator data request (2013-04-08), Annex A p1 item 15a: T'do 8.6 s (this value is used).
- The tie-break is the machine's own sudden short-circuit test, LM-GEE-2014-0822 R0 p27, which measured Td' = 0.92 s. At the terminals, Td' = T'do x X'd / Xd. With this model's Xd 1.92 and X'd 0.21:
  - 7.69 s gives 0.84 s.
  - 8.6 s gives 0.94 s.
- So this is a choice between two sources, not a fitted value. The on-line lag of the model adds Xt, so that value is not the test value.
- Effect: the no-load voltage build-up to 95 % takes 3.5 s (was 3.0 s), with 0.3 % overshoot. The tcs_gen_desk test (sync, ASD, 5 min timeout) passes 15 / 15.

## 2. Lockout event text (MARIA note): no change
- On SH-G-5A / 6A, 24a goes to g3 and 59a to d59a ("59A #1 (Alarm)", LM-GEE-2015-0059 p33). Both end in the alarm column, not in gor. So tcsGprWhy lists the tripping steps correctly.

## 3. Still NO-SOURCE, and not derivable
- The AVR gains kp / ki and the exciter time constant te are UNITROL tuning settings and an exciter-field L / R. No document prints them; the E33 site pages are blank.
- The exciter air rise needs the air flow. The 29 kW loss alone gives no temperature. TIGE1005 stays on its snapshot check value, marked.

## Test
- tcs_gen_desk 15 / 15, gen-electrical 28 PASS, tce sheets 0 open.
- Guards and the 20 min hold: see the PR.
