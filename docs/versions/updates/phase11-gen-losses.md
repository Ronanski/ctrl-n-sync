# Phase 11 generator: losses from the type test, EDG start sequence (YUI, 2026-11-27)

Source reads: /mnt/project-files/yui-reads-2.md (YUA, PC, 2026-11-27 10:36 to 11:00 PM PHT).

## 1. Generator losses (unit.js AN_GENT / anGenTemp)
- Was: the rated heat duty of the four air coolers, 2,120 kW (GAE-2015-0063 R0 p36), less the copper losses. That is a cooler rating with margin, not the machine loss.
- Now: the segregated loss table of the type test of this machine, LM-GEE-2014-0822 R0 p31: 2,032 kW at 176.5 MVA 0.85 pf. Each term follows its own physics:
  - armature 3 I^2 Ra (172 kW, the same number as the data sheet Ra gives)
  - field If^2 Rf (285 kW at 1,141 A)
  - exciter 29 kW x (If / 1,141)^2 (p31 gives four loads; all four fit this within 0.5 kW)
  - stray 283 kW x (I / In)^2
  - core 388 kW x V^2
  - friction and windage 875 kW x n^3
- All of it comes off the shaft (U.MW = Pm - L). The air coolers get L less the generator bearing friction, 240 kW x n^3 to the lube oil (same O&M p36).
- At 150 MW: L 1,794 kW (was 1,933), coolers 1,554 kW. U.MW is about 0.14 MW higher at the same steam.
- Hand-off to RIN: AN_TB.mech 1.40 MW was the HB lumped loss 3.34 MW less the old 1.94 MW. With the new 1.79 MW it would be 1.55 MW. That is RIN's constant to change.

## 2. EMP-11 back on DG1 (elec.js AN_EL_BO)
- Was: 10 s, the NFPA 110 Type 10 class (NO-SOURCE).
- Now: the sum of the sequence:
  - ATS-11 1C 1 s + 2B 0 s (ASCO factory defaults, 381333-126 p7)
  - DSE7320 remote start 5 s, delay crank 0.5 s, warm-up 1 s, load delay 0.7 s (p10)
  - crank until the engine fires: NO-SOURCE, 1.8 s (the rest of the 10 s class)
- The total is still 10 s, so there is no behaviour change; every part is now traced. Flag: the DSE table is filed under Phase 2 (680 kW base).

## 3. AVR and exciter: checked, no change
- The ceiling 109.8 V / 17.6 A and the no-load 28 V / 4.5 A (E33 p6) are already the values in tcs-gen.js.
- T'do: the as-built data sheet GAE-2013-0136 R2 gives 7.69 s, kept. The 2013 Hitachi reply gives 8.6 s. The measured Td' 0.92 s (GEN p27) agrees with both within the spread of Xd (1.92 vs 2.1).
- Still NOT IN DOCS: the AVR gains and step test (the E33 site pages are blank), the exciter T'do, the exciter air flow and its rise. TIGE1005 reads the generator cold air, with the rise NO-SOURCE (phase11-gen-reverse-power.md).

## Test
- gen-electrical: the loss terms sum to 2,032 kW at the rating; L and the cooler duty match the formula at 150 MW; reverse power -2.5 MW, 86G-A / B 11 s after, turbine off.
- u-const, one-path, no-fit, ports: PASS. 150 MW loaded start held 20 min: 150.95 MW, no trip.
- Not tested: the full 45-150 MW sweep (phase thread, per batch). st150 not changed.
