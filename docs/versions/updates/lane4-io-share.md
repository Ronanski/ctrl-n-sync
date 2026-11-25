# Lane 4 (RARA): BOP share of the DCS I/O not linked (QA count 11:50 AM PHT 2026-11-25)

Before (trace on main, 150 MW, BOP systems CD / FW / HD / SW / CW / MU / IW / AS / DO / LO / Z / CH / HC / P-07xx / P-11xx / P-15xx):
252 not LINKED = MODEL / HMI ONLY 169, ON SHEET NO SOURCE 54, UNLINKED 15, ON DRAWING NOT ON A ROW 8, COPY ADDRESS CLASH 4,
STATION UNSURE 2. Burner oil / flame (DO1043, stn 104) and SH spray (FW11xx, stn 101) are boiler: lane 3.

## Field rows added (src/world/field/bop.js)

- BFWP-A / B 6.6 kV VCB on / off (STN103 I.005A / 5B, I.037A / 37B): DITL-23A copy running, no field trip, bus 1AM alive.
- Sea water booster pump A current IT-P1503A (AI0433): U.swIb0 (B and C were bound already). 150 MW: 90.0 A.
- Field states: TSP solution tank LSLL / LSL / LSH-CH1101 (I.0130 ~ 0132), BFWP lube oil level low LS-LO1115-A / B (I.0093 / 0413),
  NaOCl dosing pump overload MIT-P0762A / B (I.032A / 32C). Normal = no alarm; the instructor sets them in the Plant menu.

Headless 150 MW: BFWP-A VCB on 1 / off 0, BFWP-B (standby) on 0 / off 1; switches 0; CH1101 low low on -> LSLL 1 and LSL 1.

## For QA (trace rule), not a missing link

The drawings of the motor sheets put the DCS input address of the MCC / local panel contact on the OUTPUT row of the MCC side (text at
x 290 ~ 315 beside the output): DITL-22 out "LOP A REMOTE MODE SELECTED" I.0052/372 I.0055/375, DITL-61A out "REMOTE SELECTED"
I.0082/402, "RUNNING" I.0080/400, "VCB ON" I.0084/404, DITL-76 "RUNNING" I.0086, "REMOTE SELECTED" I.0088, DITL-29A I.032A/526/81A. The
output net is the panel contact (row from LOP / LCP / MCC), so the address has a source; the trace counts only input rows for an input
point, so these show ON SHEET NO SOURCE (MIL-P1115x, MIL-P1503x, MIL-LO1753-x, MIL-P0702x, MIL-P0709x, MIL-P0715x, MIS-P1115x, MIS-P1116x,
MIS-P1108x, MIS-P1501x, MIV-P1108x) and COPY ADDRESS CLASH (MIR / MIT-P1116A / B). 

## Left

- ZT-FW1001 / 1002 / 1391 / 1392 (MOV positions, DITL-38 table): lane 0 beta.540 (DITL-38 I/O by type and device).
- O.0447 MOR-P1115B2 (DITL-22 #D): copy D reads no address from "O.0127/447" (lane 0 copy address split).
- MIR-P0720 fire jockey pump: no single normal state (K1AU3-M0-159 not read).
- ZSO / ZSC-AS1010, ZT-AS1030, SV-CD1115, ZSO-CD1115, PCV-AS1020-1 / 2, TCS-AS1004: next (aux steam and LP bypass spray, need the
  aux steam model keys).
- CEP motor K1AU3-D1-0-044 p24-30 (read on the PC by lane 6): no running value and no limit of the bearings, coupling or vibration;
  they stay with no running value. TECO OM limits (bearing 90 / 95 C, winding 155 / 165 C) are a finding only: the alarm list rules.

## AKIHO alarm switches (added in the same change)

- PSL-PA1705 (STN104 I.052A): U.paPU < 2.8 kg/cm2 (alarm list PS). 150 MW: 6.8, switch 0.
- LSLL-CW1109 (STN103 I.053F): U.etLvl <= 0.3 m (alarm list LS 300 mm). 150 MW: 0.8 m, switch 0.
- Field states, normal = no alarm: PS-IA1061-A1 / A2 / B1 / B2 / C1 / C2 (coal feeder air tanks, instrument air unlimited), DPSH-FA1055-A / B
  (FA blower inlet filters, on no sheet), LS-IW0714 (industrial water tank, fed by the excluded water treatment plant).
- LSL-CH1101 and LS-LO1115-B: field states above.
