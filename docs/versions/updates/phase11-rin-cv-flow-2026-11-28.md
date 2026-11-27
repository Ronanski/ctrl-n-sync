# Phase 11 RIN: main steam flow = the CVs in series with the HP blading (2026-11-28)

## What was wrong
- The steam flow to the turbine was m = Kt x gv x MSP, with Kt = m0 / P0 taken from the save-point snapshot (a fitted constant, Rule 0).
- The HP blading never limited the flow: tbPath clipped the first-stage pressure at the inlet pressure.
- At the 150 MW save point (main 299f1d2) the turbine inlet was at 121.65 ata. The HP blading passes 448 T/H there (Stodola, K from HB PPE-14-0725 VWO), but the app pushed 459.8 T/H through it. That flow needs 124.4 ata at the first stage.
- So 151.0 MW was made with 466.2 T/H of main steam, against HB case 1 at 458.3 T/H.

## Split of the +7.9 T/H (main 299f1d2, 150 MW)
- The steam path at the HB case 1 inputs gives 150.03 MW: the turbine itself is right.
- About 6 T/H: the heaters draw 13.9 T/H more than HB. The draws are HP2 47.0 / 45.1, HP1 25.1 / 24.2, DA 28.6 / 22.2, LP3 16.1 / 15.2, LP2 13.0 / 12.3 and LP1 19.0 / 16.8. This costs 1.57 MW. It is the extra cycle water, not the turbine.
- About 3 T/H: the extra 1 MW (151.0 vs 150.0).
- About -1 T/H: the better vacuum (0.066 vs 0.07 ata).

## The change
- **turbine.js AN_CV, tbCvLift, tbCvA, tbCvW, tbCvFs, tbMsFlow**
  - The two sleeve CVs have a seat throat of 165.1 mm and a 43 mm stroke (CVU, YUA rin-turbine-section-2026-11-28.md (3)).
  - The flow area is the curtain pi d x lift, up to the seat area.
  - The flow is the perfect-gas nozzle law with kappa 1.3, choked below r* 0.546.
  - The lift comes from the TCS FG 003 (CV A) and FG 036 (CV B) of TCE212 (LME010, HIACS backup).
  - The flow is solved each scan against the Stodola HP blading and the SH and main steam line drops.
- **tbGeo**: the HP K now comes from VWO behind the full-lift valve drop (126 -> 124.4 ata), not from the full 126 ata.
- **unit.js**
  - Kt is deleted from anUnitStart.
  - The flow law at the CVs now calls tbMsFlow.
- **tcs.js**
  - tcsVtCv (the CV position on the T/G Modbus, the ZT tags and the full-close contacts) is now the TCS lift of the FG curves.
  - tcsVtLift is deleted; it was only used by the old law.
  - The LLM pressure compensation comment is updated.
- st150 is not changed; the phase thread re-settles it.

## Tests (cloud)
- **turbine-hb**: all 8 HB cases, the same as before (case 1 150.0 / 150, VWO 154.5 / 154.5).
- **Checks**: u-const, one-path, no-fit (no new fit), turbine-steam and vacuum-mw pass.
- **150 MW save point of main, 40 min**: no trip. The MW settles at 148.0 ~ 148.6.
  - The CVs are wide open (gv 1.03 = flow demand 102 %, lift 105 % = full).
  - Main steam is 455 T/H at MSP 122.0 ~ 122.6.
- **Scan time**: +11 % (the flow solve).

## Open
- To make 150 MW the pressure at the turbine has to rise toward the HB 126 ata. The DCS pressure set point decides this; it is not adjusted to hit 150 MW.
- The extra heater draws belong to KANA (CBD), NANA and MEI.
- U.P0 (the TCS pressure compensation base) still comes from the save point. It is the rated pressure of LME237, which is not yet read from the backup.

## Follow-up: CV effective area from TCE500 FG A011 (2026-11-28)
- **What was wrong**: the pure curtain area passed too much steam at low lift. HB case 4 (58 % flow) needed only 33 % flow demand (lift A 16 %), while the TCS curves FG 003 / 036 make demand about equal to flow.
- **The change**: the effective area of the two CVs against the lift sum is now read from the TCS lift-to-flow table TCE500 FG A011. Each point is the area that passes that share of VWO at 126 ata into the HP blading, with the first-stage pressure from tbPath (tbCvTab). The sum of 200 is the seat area.
- **HB cases now need these flow demands**:
  - 95.8 % at 97 % flow
  - 83.9 % at 82 %
  - 72.5 % at 67.5 %
  - 66.7 % at 58 %
  - 61.9 % at 49 %
  - 51.6 % at 40 %
  - 99.4 % at VWO
- **Bug fixed in tbPath**: from a cold start (no last pass) the CRH volume was taken at the condenser pressure. At 87.5 % of VWO that gave 1840 ata and a NaN path. The volume is now taken at no less than the hot reheat pressure.
- **Tests**:
  - turbine-hb: 8 cases pass.
  - u-const / one-path / no-fit pass.
  - 150 MW 20 min: no trip, 147.8 ~ 150.2 MW (old st150).
  - House load peak 101.1 %, 52G rejection peak 101.6 %.
