# Lane 4 (RARA): aux steam valve positions and limit switches (2026-11-25)

- ZT-AS1030 (STN102 AI0386, deaerator pegging steam PCV-AS1030): the opening of PICCD1104 (ABC-056, AO0403) through the airlock (X.av),
  as the other control valve ZT rows. 150 MW: 0 % (PICCD1104 MV 0).
- ZSO-AS1010 / ZSC-AS1010 (I.0042 / I.0043, main steam to aux steam PCV-AS1010): end of travel (>= 100 / <= 0 %) of the PICAS1004 opening
  (ABC-030, AO0580). ZT-AS1010 itself is already written on ABC-030, so there is no second ZT row.
- Finding (lane 0): at 150 MW the PICAS1004 MV stands at 0.0001 %, not 0, so ZSC-AS1010 reads "not closed" under the frozen end-of-travel
  rule (<= 0 %). The same holds for TCV-CD1124 at 0.1 %. Either the PID output at its low limit must reach 0, or QA sets the switch
  resolution; nothing is changed here.
- Not in lane 4 files: SV-CD1115 (O.0845, on no sheet), PCV-AS1020-1 / 2 (AO on the drawing, not on a row), TCS-AS1004 (AO0404 to the
  TCS: lane 2), ZSO-CD1115 (the engine writes it on ABC-052: the trace does not see that writer, QA).
