# Lane 4 (RARA): BOP DITL inputs with a FROM that does not link (2026-11-25)

Source: QA trace (tools/trace/trace.cjs, 150 MW) trace-ditl-inputs.csv, QA SAORI xref-ditl-2026-11-25-1130.csv, and a headless probe of the
running world (netlist, link table WORLD.idx.din, DUI.rowNets).

## 1. Motor trip input fed back from the sheet's own trip output (18 rows): linker, lane 0

| Sheet (copies) | Input row | Printed FROM | Output it names | What drives that output |
|---|---|---|---|---|
| DITL-22, #B ~ #D | 15 BFWP aux. LOP TRIP (I.0051 / 371 / 054 / 374) | 22-64 | out 64 LOP TRIP (CRT ANN), TO 22-15 | user switch ELECTRICAL TROUBLE |
| DITL-24, #B | 11 PAF lub. oil pump TRIP (I.005D / 37D) | 24-64 | out 64 | ELECTRICAL TROUBLE |
| DITL-30, #B, #C | 3 SWBP TRIP (I.004D / 36D / 25E) | 30-64 | out 64 | ELECTRICAL TROUBLE |
| DITL-31, #B | 11 DOP TRIP (I.0004 / 324) | 31-64 | out 64 | ELECTRICAL TROUBLE |
| DITL-76 / 77 | 3 ACWP TRIP (I.0087 / I.0407) | 76-67 / 77-67 | out 67 | ELECTRICAL TROUBLE |
| DITL-111, #B | 11 IWP TRIP (I.0007 / 327) | 111-64 | out 64 | ELECTRICAL TROUBLE |
| DITL-112, #B, #C | 16 MWP TRIP (I.0001 / 081 / 321) | 112-64 | out 64 | ELECTRICAL TROUBLE |

The drawing draws the protection relay of the MCC (the ELECTRICAL TROUBLE flag) on the wire of the input row, and that wire is also the
output. world.js `selfDep` (3.2.0-beta.23, DITL-43 row 12) drops a same-sheet link when the output net is on the row's own wire, because
there the output was only a copy of the row. Here the output net has its own driver, the ELECTRICAL TROUBLE user switch (the field relay,
set by the motor field trip and the black-out `boRelay`), so it is not a copy. Fix asked of lane 0: keep the link when the output net is
driven by a user switch (nl.usr) or a gate. The same case: DITL-61A row 3 (61A-67, lane 0's sheet). No field row is added here (one source:
the relay flag).

## 2. Fire fighting pumps, DITL-87 rows 24 / 26 (no FROM, LOCATION FFS): field state added

MIR-P0719 (I.0338) and MIR-P0718 (I.033A), STN105. Field states `P0719.run` / `P0718.run`, normal 0, group Other (src/world/field/bop.js).
The tag is the 5th word of the row text ("FIRE FIGHTING PUMP P-0719 MIR-P0719 RUNNING"); the field switch match of plantsw.js reads the
first 3 words only, so the DI row reaches the HMI and the Plant menu but not yet the DITL-87 row. Asked of lane 0: match the tag anywhere
in the row text when the row has it. The jockey pump P-0720 (I.033C) has no fixed normal state: not added.

## 3. Not lane 4 files

- DITL-121 rows 1 / 5 / 19 (M.0652 / 0650 / 0651, CRH drain pot DP-CR03 drain valve AUTO / OPEN / CLOSE PB, LOCATION LCD): operator push
  buttons. They need the HMI faceplate of that valve (HMI lane) and the trace should count LCD as operator (QA).
- DITL-50 (sheet 70): the app has no row text for this sheet (0 cells, only the row numbers and the column heads). Inputs 4 / 6 / 9 / 11 /
  12 cannot be traced until the sheet text is imported from the PDF (lane 0).
- M.0230 (ABC-011 S/H no. 2 outlet temp. control FORCE MANUAL) and M.0240 (ABC-012 main steam temp. control FORCE MANUAL), STN101: no DITL
  sheet of the app (cells and wire text) has them on station 101. The same numbers on DITL-11 / 14 are station 104 burner memories. The
  writer must be found in the DITL / ABC PDFs on the PC (lane 3 with lane 0).

## 4. Also in this change (lane 5 AKIHO alarm points with no value)

- Condenser sea water side A: PT-SW1110-A1 / A2 (STN102 AI0448 / AI0449), TT-SW1110-A1 / A2 (AI0805 / AI0806) now read the model
  (U.swPiA / swPoA / swTiA / swToA), as side B already did. Their fixed page numbers in hmi-op.js (1.0 / 0.4 kg/cm2, 28.5 / 35.3 C) are removed
  (one source per tag). Headless 150 MW: 1.05 / 0.65 kg/cm2, 28.5 / 33.4 C.
- PS-CD1117 (condensate water pressure low switch): station 102 I.0049 in both the I/O list and the alarm list (set L 15.5 kg/cm2). The
  trace put it on DITL-03B by the address only; that I.0049 is station 103 (MIS-F1055A FA blower A stopped). Field DI row: made while
  U.cdPd < 15.5. Headless 150 MW: cdPd 17.1, switch 0.
- Fire pump state P0719.run checked: Plant menu fault on = MIR-P0719 reads 1.
