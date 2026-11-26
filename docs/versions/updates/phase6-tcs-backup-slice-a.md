# Phase 6 TCS slice A: HIACS backup curves and values (2026-11-26 PHT)

Source: the HIACS controller backup of the TCS (TCE backup 2018-07-14, newer than the Aug 2017 drawings), read on the PC by lane 0
(table `tcs-backup-tables-2026-11-26.md`). User 2026-11-26 7:00 AM: "Gamitin" and the values may go into this public repo
(no network addresses or access codes are copied).

## Rule
- The drawing (TCE / TCA / G sheet) wins. A backup value is used only where the drawing prints nothing for that block.
- An FG curve is taken whole: if the drawing prints any point of the curve, no backup point is mixed in (guard test
  `tests/lanes/qa/tcs-curves.cjs` fails on a mix).
- Each backup value carries the mark "(HIACS)" in the block notes, so the faceplate shows where it came from.
- Code: `src/digital/tce/_lib.js` `TCE_BACKUP` (111 entries on 29 sheets), applied as each sheet registers.

## Result
- FG curves with points: 36 -> 56 of 58 (20 from the backup: TCA777 x6, TCA825 x3, TCE101 B024, TCE214 C002 / C012,
  TCE500 C040 / C041, TCE503 x6). Still none: TCE212 003 and 036 (the UNT-FG inside the valve macro, next slice).
- Backup values equal to the drawing: 71 (the drawing is confirmed by the backup).
- TCS sheets COMPLETE: 256 -> 257 of 419 (floor raised to 257).
- App bug fixed: TCE212 `sg048` held the -5.0 % gain of `sgA017`; the drawing prints sgA017 K = -5.0 % and sg048 K = 7.51 %
  (the backup has the same two values).

## Backup differs from the drawing (drawing used, logged)
20 FG blocks. Format: point drawing / backup.
- TCA530 A005 FG: X1 200/0, X2 565.6/200, Y2 78.9/127.8, X3 drawing - backup 565.6, Y3 drawing - backup 78.9, X4 drawing - backup 570, Y4 drawing - backup 78.9, X5 drawing - backup 580, Y5 drawing - backup 78.9, X6 drawing - backup 590, Y6 drawing - backup 78.9, X7 drawing - backup 600, Y7 drawing - backup 78.9, X8 drawing - backup 610, Y8 drawing - backup 78.9
- TCA530 A022 FG: X1 200/0, X2 565.6/200, Y2 112.2/156.1, X3 drawing - backup 565.5, Y3 drawing - backup 112.2, X4 drawing - backup 570, Y4 drawing - backup 112.2, X5 drawing - backup 580, Y5 drawing - backup 112.2, X6 drawing - backup 590, Y6 drawing - backup 112.2, X7 drawing - backup 600, Y7 drawing - backup 112.2, X8 drawing - backup 610, Y8 drawing - backup 112.2
- TCA531 A001 FG: Y1 184/180, X2 100/30, Y2 172/180, X3 200/600, Y3 161/117, X4 250/610, Y4 155/117, X5 300/620, Y5 149.5/117, X6 400/630, Y6 138.5/117, X7 500/640, Y7 127/117, X8 600/650, Y8 116/117
- TCA531 A009 FG: Y1 184/208, X2 100/20, Y2 172/208, X3 200/600, Y3 161/176.7, X4 250/610, Y4 155/176.7, X5 300/620, Y5 149.5/176.7, X6 400/630, Y6 138.5/176.7, X7 500/640, Y7 127/176.7, X8 600/650, Y8 116/176.7
- TCA548 A005 FG: Y1 400/420, X2 111.4/180, Y2 400/420, X3 288.1/314
- TCA548 A012 FG: Y1 345/380, X2 293.2/407, Y2 345/380, X3 323.2/538, Y3 345/471, X4 355/540, Y4 370/471, X5 483/600, Y5 470/471, X6 531.9/610, Y6 508/471, X7 538/620, Y7 512.8/471, X8 538.01/630.01, Y8 538/471
- TCA548 A024 FG: Y1 330/425, X2 150.6/251, Y2 330/425, X3 365.7/366
- TCA548 A031 FG: Y1 290/395, X2 302.6/425, Y2 290/395, X3 352.6/496, Y3 290/465, X4 445.6/538, Y4 380/465, X5 538/540, Y5 469.2/465, X6 588.4/550, Y6 518/465, X7 588.41/560, Y7 538/465, Y8 538/465
- TCA548 A040 FG: X4 drawing - backup 540, Y4 drawing - backup 471, X5 drawing - backup 600, Y5 drawing - backup 471, X6 drawing - backup 610, Y6 drawing - backup 471, X7 drawing - backup 620, Y7 drawing - backup 471, X8 drawing - backup 630.01, Y8 drawing - backup 471
- TCA548 A042 FG: X4 drawing - backup 540, Y4 drawing - backup 430, X5 drawing - backup 545, Y5 drawing - backup 430, X6 drawing - backup 550, Y6 drawing - backup 430, X7 drawing - backup 560, Y7 drawing - backup 430, X8 drawing - backup 600, Y8 drawing - backup 430
- TCA585 A019 FG: X5 230/280
- TCA770 B003 FG: Y1 466/150, X2 8/90, Y2 454/168.01, X3 16/360, Y3 410/233.6, X4 22/410, Y4 406/245.33, X5 26/440, Y5 390/335.13, X6 50/550, Y6 446/494.66, X7 75/650, Y7 482/514.62, X8 102/750, Y8 502/514.65
- TCA770 B005 FG: Y1 466/150, X2 8/90, Y2 466/168.48, X3 16/360, Y3 466/223.91, X4 22/410, Y4 466/236.26, X5 26/440, Y5 466/265.23, X6 50/550, Y6 466/451.61, X7 75/650, Y7 466/511.66, X8 102/750, Y8 466/514.57
- TCA770 B009 FG: Y1 503/80, X2 8/34, Y2 497/134.53, X3 16/190, Y3 460/243.78, X4 22/202, Y4 458/277.93, X5 26/360, Y5 450/340.04, X6 37/480, Y6 462/436.63, X7 63/580, Y7 512/537.43, X8 109/750, Y8 563/538
- TCA770 B010 FG: Y1 503/80, X2 8/34, Y2 503/89.51, X3 16/190, Y3 503/222.57, X4 22/202, Y4 503/230.04, X5 26/360, Y5 503/332.91, X6 37/480, Y6 503/390.67, X7 63/580, Y7 503/515.22, X8 109/750, Y8 503/537.96
- TCE202 C001 FG: X5 97.9/100
- TCE206 C003 FG: X1 -648/-540, Y1 -261.9/-201.6, X2 -432/-360, Y2 -174.6/-134.4, X3 -216/-180, Y3 -87.3/-67.2, X7 216/180, Y7 87.3/67.2, X8 432/360, Y8 174.6/134.4
- TCE500 A003 FG: X4 20/25, Y4 20/25, X5 30/50, Y5 30/50, X6 40/75, Y6 40/75, X7 50/100, Y7 50/100, X8 100/150
- TCE500 A007 FG: X1 0/-5, Y1 0/-5, X2 11/0, Y2 6/0, X3 15.6/10.24, Y3 9.9/4, X4 19.19/17, Y4 12/21, X5 30/76.77, Y5 16/24, X6 110/100, Y6 22/25, X7 130/105, Y7 24/25, X8 140/110
- TCE500 A011 FG: X2 10/11.07, Y2 14/6.25, X3 20/15.36, Y3 24/11.25, X4 30/55.89, Y4 34/46.25, X5 40/66.12, Y5 44/63.75, X6 50/92.69, Y6 54/87.5, X7 60/115.06, Y7 64/93.75, X8 140/200, Y8 140/100

Notes: TCA770 B003 / B005 / B009 / B010 differ in every point (the backup block number likely maps to another block of the
sheet); TCA530 / TCA548 backup curves end at the last drawing point and repeat it (same curve shape, padded). These are
(c) findings: the drawing is read, the backup copy disagrees; the drawing stays.

## Tested
`tests/lanes/qa/tcs-curves.cjs`, `tests/lanes/qa/tce-complete.cjs`, `tests/tce/run.cjs`, `tests/tce/sheets.cjs`, tce_check,
TCS IO lanes. Not tested: a live run of the new curves in the browser (they feed TCA777 / TCA825 / TCE503 at loads below 150 MW).

## Next
Slice B: the macro insides from the backup (valve control, heat soak, diagnostics), so sheets now run on manual text become
drawing-and-backup complete. Then TCP / TCT.
