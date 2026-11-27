# Phase 11 rank 1 (RIN, GO FIX 11 2026-11-27 12:37 PM PHT): the AN_HB tables deleted, turbine ports written

- turbine.js: the per-load table AN_HB (f3 / f2 / f1 LP heater extraction rows at the 7 HB loads) and anHb are deleted.
  - LP heater draws: tbLpDraws, the first-law heat balance of each LP heater (condensate rise = extraction x (h_ext - h_drain) + the
    cascaded drain), water by IAPWS-IF97 region 1, steam enthalpy from the Stodola steam path. At HB case 1 temperatures: No.3 15.1
    (HB 15.2), No.2 12.2 (12.3), No.1 18.1 T/H (16.8).
  - anTbPx: the heater shell pressure share = the Stodola stage pressure now / design (was anHb 'x..').
  - anTbPorts: ms.draw, crh.rh_in, hrh, ext.hp2 / hp1 / da / lp3 / lp2 / lp1 {P, T, h}, lp.exh, shaft {W, n} by anPortSet.
    shaft.W = blade work - turbine mechanical loss 0.49 MW (HB lumped 3.34 MW - YUI generator losses 2.85 MW; MHPS bearing loss
    itself NO-SOURCE).
- unit.js: the LP heater drain model reads the heat balance draw (U.tbD); heater shells read anTbPx.
- Seen in the 150 MW start: the condensate flow of the start rises 111 -> 384 T/H in 20 plant min (start / anchor, rank 8 MEI /
  PORTS), so the LP draws follow it and the LP heater levels dip to -44 mm then come back (alarm list: HH only). Not a turbine item.
- Tests: turbine-hb (8 HB cases), turbine-steam, model ports, one-path, no-fit (44 left, 0 new) pass. 150 MW for 16 plant min: 150.5 ~
  151.3 MW at 455 ~ 458 T/H.
