# Phase 6 TCS: link audit, JOINT links, Modbus, TPC inputs (MARIA, 2026-11-26)

The audit checks that each signal has one source, that no input is left dangling, and that no signal has a duplicate driver. It is kept by a new test, `tests/tce/links.cjs` (run-all runs it in Checks).

## 1. Cross-sheet JOINT links (TCE / TCA / G sheets)

- **2190 links joined. 0 cannot be made.** None has no output of that letter, and none has two outputs of it.
- **0 duplicate drivers.** On G-1A the letter "1" goes out twice, once to G-6A and once to G-9. Each reader takes the connector that names it, so this is not a duplicate. G-4 has two out connectors with no letter and no sheet, as drawn; they drive nothing.
- **0 outputs to a TCS sheet that the sheet does not read.**
- **669 inputs come from outside the set:**
  - TCP (the three TPC protection controllers): 606
  - TCT (CRT tables): 31
  - Inputs where the drawing prints "-" as the source sheet: TCA782 Z1-3, TCE073, TCE100, TCE116 B11 / B12, TCE153 B3, TCE164 A, TCE195 C, TCE250, TCE472 C. These are CON ports (0).
- **110 links** where the cross-reference list printed at the output does not name the reading sheet. The link itself holds (the input names sheet and letter). This is a gap in the drawing's list only.

## 2. TCS-DCS Modbus (src/data/tcs-dcs.json, 237 named rows)

- **0 rows with no end. 0 addresses used twice. 0 ends used twice in one direction.**
- Ends by kind:
  - model 190
  - out (DCS to PLC commands) 16
  - fault 5
  - ibd 2
  - sys 2
  - needs 22
- **The 22 "needs" are plant-model gaps, not link faults** (phase 11). Each end says what is missing:
  - 13 HP / IP / MSV metal temperatures (TE-STn001-2 ... TE-STn903-B2)
  - the gland valve limit switches ZSC-GS1017 / 1018 / 1031 / 1032
  - TSI: differential expansion ZE-ST1002-1/2, rotor position ZE-ST1003-1/2/3, eccentricity ZE-ST1004
  - the generator power-factor transducer form

## 3. TPC inputs (CON:TCP ports, fed by src/analog/engine/tcs-tpc.js)

- **606 ports. 282 have one source (276 before this branch):** the Modbus row or the IBD net, the same for all three controllers.
- **330 are unfed and read 0:**
  - **174 SPARE** channels. Correct.
  - **93 input errors E1 ~ E7.** Correct: the model has no card fault (tcs-tpc.js header).
  - **63 named inputs.** Most are already listed in the tcs-tpc.js header:
    - rotor POSITION(A/B/C) on TCE066
    - CRT OPE. PERM. of TCE118 / 119
    - the VALVE ENERGIZE COMMANDs of TCE099 / 099A / 116
    - TPC I/O HARD ERROR / INPUT ERROR
    - BOILER MFT 1 AND 2 NOT SYN.
    - TCP500 / 501 / 503 A
  - **Not in that list, and readable from the TPC backup** (tcs-tcp-tct-2026-11-26.md: TCPn052 / 054 TP of the field DI cards):
    - PROTECTION OPERATED 2 / 5 (TCP1052 B5 / B6)
    - FOR GEN. PROTECTION A / B (TCP1054 B5 / B6)
    - VALVE TEST / DURING VALVE TEST (TCP1230 / 1231 / 2230 E)
- **tcs-tpc.js is now owned by this lane (coordinator, 2026-11-26).** Lane 0 read the PI/O cards TCPn901 / n902 from the backup (/mnt/project-files/phase6-tcs-tpc-sources-2026-11-26.md):
  - **TCPn052 B5 / B6** = TCPn901-5 / -6, UNIT TRANSF. PROTECTION OPERATED A / B (87T, 51N). **TCPn054 B5 / B6** = TCPn902-5 / -6, 50BF-86BF FOR GEN. PROTECTION A / B. Both come from CUSTOMER (the generator protection panel). There is no card TCPn903.
  - **The model has only the 32 reverse power relay of that panel** (86G-A). The 87T / 51N and 50BF relays are not modelled, so these 4 inputs stay 0 (no relay operated). This is a plant-model gap, listed for the phase thread.
  - **ICV(A) / (B) FAST ACTING DURING VALVE TEST (TCPn230 / n231 E to TCE116 E) is fed now (6 ports).** It is not a field input: the TPC makes it with its own logic, written in tcs-tpc.js as the backup record has it. TD 004 2 s of (CRV TEST COMMAND and ICV TEST POSITION), blocked during and 2 s (B: 2.5 s) after PLU or ACCELERATION RELAY, then held 8 s while the RSV is not full open. The inputs are the TCE226 / 227 / 228 / 043 / 166 outputs that the drawings send to TCP1230 / 1231. The timers take the slice of the program step (tcs-sheets.js passes h). Test: tests/tce/tpc-valve-test.cjs.
  - The test holds 282 as a floor.

## 4. TCE / TCA against the IBD (overlap)

- **The trip logic runs from the IBD** (tcs-ibd-data.js, run by tcs-trip.js). The TCE060 ~ 119A input sheets read it through tcs-tpc.js, so there is one source and no copy.
- **The logged differences and the IBD inputs with no source** are in docs/tcs/IBD_UNBOUND.md, kept by the phase side.
- **A link to make, from this lane's side:** IBD TC-17 net 5 "HP TURBINE HEAT SOAK EXECUTE" is unbound in IBD_UNBOUND.md because the signal "comes from the TCS soft logic TCE163". TCE163 now runs, from the backup inside (HEAT SOAK SELECT LME133, phase 6 slice B). **Done in this branch:** tcs-trip.js TCS_IBD_NET TC-17 net 5 = TCE163 output A1 HEAT SOAK SET. A1 is the SELECT of the macro, the same net as HEAT SOAK MODE and the CRT lamp TCE163_1. It is read through a new tcsTceOut() (it follows the tcsHw rule and reads 0 while the program does not run). INFERRED: the PI/O card that carries A1 to the hard-wired logic is not decoded. Test: tests/tce/heat-soak-ibd.cjs.

## 5. The "(-)" inputs

- **Lane 0 checked every FNC record of the six stations and the PI/O card lists.** None of the "(-)" inputs has a writer: all are NOT IN BACKUP. TCE116 B11 / B12 are SPARE by their own label.
- **They stay 0** and stay in the OPEN list of tests/lanes/integrator/tcs-dcs.cjs.
- **INFERRED hints for a later binding (not bound here):**
  - TCE153 B3 CV(UPPER) INNER / OUTER TEMP: the sister sheets TCE152 / TCE154 get theirs from TCA359 / TCA363.
  - TCA782 Z1 ~ Z3 EOS TURBINE SPEED and TCE100 PLU / EOS OPERATED: the three overspeed channels of the TPC.
  - TCE250 TCMS MAJOR TROUBLE and TCE472 CPU STOP: controller self-diagnostics.
