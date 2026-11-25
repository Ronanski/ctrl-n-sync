# Lane 1 (TCS LOGIC, MARIA): TORQUE (INCHING) on TCA618, 366 -> 367

Source: Interlock Block Diagram 310SC90-794 Rev 2 sheet 20 "TORQUE SEAT (INCHING)" (Turbine Control System book p 36) and its
simplified form sheet 21 (p 37).

- Inching type: no seal-in. The valve opens or closes only while the command stands (AUTO condition in AUTO, or the operator push
  button in MANUAL).
- Open stops on the full open limit, on motor electrical trouble, on the open torque switch away from the close end, or on a close command.
- Close stops on the torque switch (torque seating), on motor electrical trouble, or on an open command.
- Alarms: motor electrical trouble, torque switch open, torque switch close in mid travel.
- Not given: the POS.S position output and the printed R / M / HL / LL / K (not on sheet 20).
- Tests: new TORQUE (INCHING) test in tests/tce/sheets.cjs; the four TCS tests pass.
