# Phase 5 TCS blocks: ASWW, MJL, DUAL INPUT DIAGNOSTICS, VALVE TEST (2026-11-26 PHT)

Source: lane 0 (YUA) PC read 12:08 ~ 12:12 PM, `/mnt/project-files/tcs-phase5-blocks-2026-11-26.md` (macro list TCA013 ~ TCA021: ML 26
ASWW TCA015, ML 71 MJL TCA019; decoded backup), and `tcs-macros-20261126T021103-0cc9.json`.

## Block library (src/digital/tce-run.js K)
- ASWW (ML 26): SW 1 = X1, SW 0 = X2.
- MJL (ML 71): 2 out of 3 select by S (0 high, 1 low, 2 + SW closest to the last output, else average) with the M difference rule; one
  good input = that one, none = hold. Outputs Y, Z1, Z2, Z3. DERIVED: Zi = input i not used (the list draws Z, does not define it).
- A backup block with more than one output is read as "OP el outN" (MJL 001 out2 = Z1).

## Macros from the backup
- DUAL INPUT DIAGNOSTICS (LME110 + LME110A) TCE101 001, the main steam pressure pair: drawing values K -0.01, TP 3.0, DELAY TP 3.0 x2,
  K 2 = the backup. TCE101.js: the line to the SIM pin was typed starting at the pin; the reader reads a wire's last point as its end, so
  the pin had no signal. Typed again as two pieces from the dot (same drawing).
- VALVE TEST LME250 (TCE226 036 / 037), LME252 (TCE220 002 / 021), LME253 (TCE222 005 / 027).
  - ASTA (and TSTF on LME252) are wired in the backup and blank on the 2017 drawing: the drawing wins, the pins stay open (0). They are
    marked "blank" in BKM so the sheet is not held as a defect for them.
  - The drawing wins on the timer values: TCE226 TP 024 = 60 s (backup 90); TCE222 TP 012 = 200 s (backup 60); TCE220 TP 019 (partial)
    = 200 s, TP 018 (full) = 300 s (backup 70 / 210). DERIVED: the two drawn TPs of TCE220 matched to partial / full by size, as in the
    backup. TCE220 TD 028 / TP 029 (the TSTF path, not drawn) keep the backup values.

## Result
- Macros from the backup 34 -> 41 (17 kinds); COMPLETE 272 -> 275 (TCE101, TCE220, TCE222). TCE226 still does not run: CMP SW not wired
  (HIACS default not in the macro list, an open item from before).
- Guard tests/lanes/qa/tcs-macro-backup.cjs (from the wiring, not the engine): two good = the lower; one over HL = the other at once,
  ERR1 / DEV E after 3 s; both bad = hold + ABN; ANN RESET clears; SIMULATION USE = SIM; VALVE TEST set / hold / timer stop / NOT COMP /
  no CRT AVAILABLE / CLOSE 5 s / cancel pulse.

## Also in this PR: AI and SUMA headless (`tests/lanes/qa/ai-suma.cjs`, 4 s)
- Each AI / SUMA alone in its sheet, PLANT MODEL OFF (AN.plantOn = false as the app's switch, so the coal feeder load cells of
  ABC-004A ~ C do not write the AI). AI transmitter: the value set reaches the output (136); AI with position feedback: the value =
  lo + (hi - lo) x position / 100 once the actuator holds (62); SUMA: 12 / h for 1 h = 12 (7; ABC-AUDIT batch 28).
- NO-SOURCE, asked of lane 0: the value an AI gives on SIG.AB; SUMA KK, CUT, RSTS.
