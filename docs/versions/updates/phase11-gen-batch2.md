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

## 3. AVR from the ABB model (tcs-gen.js, MARIA OK)
- Source: ABB 3BHS823069 E62 "Computer Models Excitation System" (407_DBE-15-0115 R1) p8. These are ABB's PROPOSED settings. The as-set values are NO-SOURCE: the E33 site pages are blank and LM-GEE-2015-0152 R0 is a procedure only.
- Regulator: KR1 200 x (1 + s 1) / (1 + s 5) on (Vref - V). It replaces the PI kp 6 / ki 0.6, which was NO-SOURCE.
- Left out, with the reason:
  - TC21 = TB21: the stage is flat.
  - TR 0.01 s: shorter than the sub-step.
  - KIR, PSS2B (proposed off) and the limiters: not modelled.
- Limits: 0 to 3.9 pu, the E33 brushless exciter field forcing. VAmax 6 / VAmin -5.1 belong to the static exciter the report proposes and do not apply to Unit 1. Flag: the report is in the Phase 2 set.
- Anti-windup: at a limit, the state follows the limited output. Without it, the no-load build-up overshot to 1.26 pu.
- The finite gain is a real droop: no load settles at 0.995 pu with the set at 1.0.
- With no state on line (old save points, st150), the regulator starts from its steady state. At 150 MW: V 1.0000, 8.8 Mvar, the same as main.
- New tests in tcs_gen_desk (MARIA review):
  - a save made mid build-up steps the same as the original;
  - AVR MANUAL -> AUTO on line gives no kick.

## 4. Transformer losses (elec.js AN_EL.tr / anTrLoss)
- Source: Shihlin K1AU3-E1-0-113, the guaranteed values at 85 C. Measured factory losses are not in the docs.
  - TR 2310: no-load 100 kW, load 512 kW at 180 MVA, Z 13.9 % (nameplate). Which serial is Unit 1 is not printed.
  - TR-1A1: no-load 25 kW, load 180 kW at 34 MVA, Z 10.69 %.
- 230 kV export = generator - house load - TR-1A1 loss - TR 2310 loss. At 150 MW: 150.3 - 17.3 - 0.08 - 0.38 = 132.6 MW.

## 5. EDG (elec.js AN_EL_BO): still 10 s
- No start time in the EDG specification XZ-FEB444. The DSE crank disconnect is 21.0 Hz / 600 rpm.
- The 10 s now comes from the ASCO Group 5 manual's printed typical, "usually about 10 seconds" (381333-126 p21). Before, it came from the NFPA 110 class.

## 3. Still NO-SOURCE, and not derivable
- The exciter time constant te ("Project related, N.A." in the ABB report) and the AVR set rate vrr.
- The exciter air rise needs the air flow. The 29 kW loss alone gives no temperature. TIGE1005 stays on its snapshot check value, marked.

## Test
- tcs_gen_desk 18 / 18, gen-electrical 28 PASS, tce sheets 0 open, lanes run-all 74 / 74.
- u-const, one-path, no-fit, ports: PASS.
- 150 MW loaded start held 20 min: 150.94 MW, no trip.
- Not tested: the full 45-150 MW sweep (phase thread). st150 not changed.
