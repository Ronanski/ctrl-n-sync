# Source register for the link lanes (2026-11-25, main 3005d0a+)

Made by AUDIT FIX : SORA for the lane plan (docs/audit/lane-plan-content-first-2026-11-25.md). Each lane reads this register before it opens a document, so no document is read twice. Full rows in `source-register-2026-11-25.json`: station, address, tag, description, type, side, system, drawing to read, twin tag, and the app sheets where the twin is already linked.

## How to use it

1. **Twin points (182, 170 with a twin sheet found).** The A unit is linked on the sheet named in `twin_sheets`. Open that sheet in the app. If the drawing set has a B / C / D sheet, import it (lane AKIHO, import tools). If the drawing says the A sheet is typical, write the unit instance in `src/world/inst/<lane>-*.json`, which is the generic form of the sootblower clone (lane plan section 2). Map the A address to the B / C / D address with the I/O list rows of the same equipment. Never hand-copy a sheet.
2. **Field points with no twin (side ENGINE + UI).** The binding is the I/O address to an existing plant model value (`src/world/bind/<lane>.json`). If no model value exists, the point goes on the lane's "needs model" list and the lane moves on (no invented value).
3. **Panel points (side UI).** Bind on the page by address (lane EIMI).
4. The QA trace (lane SAORI) gives the done-check: the point is linked and moves in a fast-forward run.

## Counts per lane

- **3 DCS LINKS BOILER : KIRARA**: 201 points (103 with a linked twin).
- **4 DCS LINKS BOP : RARA**: 147 points (62 with a linked twin).
- **2 TCS IO : TSUBASA**: 37 points (1 with a linked twin).
- **6 HMI : EIMI (panel points)**: 51 points (0 with a linked twin).
- **Excluded by the user (air compressors / dryers)**: 27 points (16 with a linked twin).

## 3 DCS LINKS BOILER : KIRARA

| System | Points | Twin | Twin linked on (sheet: points) | Drawing to read |
|---|---|---|---|---|
| Furnace temperature control dampers / air | 68 | 10 | DITL-28B: 8, DITL-16: 2, DITL-95: 2, ABC-053: 1 | P&ID K1AU3-A1-0-001 (furnace temperature control dampers) + DCS I/O list (PC) |
| Start-up burners B / C / D (oil, purge, atomizing, panel lamps and push buttons) | 58 | 58 | DITL-16: 19, DITL-18: 16, DITL-17: 10, DITL-09: 9 | M&S BMS 1612 13-4-105; DITL-02 / 03 / 07 (burner A sheet is DITL-07) |
| Coal feeder clean-out conveyors and silo valves | 29 | 18 | DITL-19: 16, DITL-20: 2 | coal feeder DITL (DITL-16 ~ 21A hold feeder A) and coal handling PLC (PC) |
| Bottom ash screw coolers | 14 | 14 | DITL-21A: 14, DITL-64: 3, DITL-116: 2, DITL-65: 2 | bottomash-limestone-logic.zip (HD600 BA-01 ~ 74) (PC) |
| Flue gas / seal pots | 10 | 0 | — | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Coal feeder air tanks | 7 | 1 | — | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Bottom ash cooler inlet valves | 6 | 0 | — | bottomash-limestone-logic.zip (PC) |
| Fly ash PLC alarms | 4 | 0 | — | fly ash PLC: vendor panel, alarms only (PC) |
| Sootblower steam supply | 2 | 0 | — | sand-sootblower-logic.zip DITL-80x (PC) |
| FA blower | 2 | 2 | DITL-28A: 2 | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Flue gas CEMS | 1 | 0 | — | CEMS vendor panel, alarm only (PC) |

## 4 DCS LINKS BOP : RARA

| System | Points | Twin | Twin linked on (sheet: points) | Drawing to read |
|---|---|---|---|---|
| Pumps (VCB, remote, pits) | 35 | 26 | DITL-29A: 8, DITL-61A: 6, DITL-30: 6, DITL-97: 4 | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Feedwater / BFWP | 32 | 13 | DITL-23B: 13, ABC-012: 2, ABC-011: 1, ABC-034: 1 | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Condensate and desuperheater spray valves | 23 | 8 | DITL-61B: 8, ABC-036: 1 | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Heater drain valves | 10 | 0 | — | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Main steam valves | 7 | 0 | — | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Lube oil (BFWP-B, PAF) | 7 | 3 | DITL-23B: 2, DITL-99: 2, DITL-114: 2, DITL-42: 1 | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Dosing pumps | 7 | 0 | — | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Chemical tanks | 6 | 0 | — | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Sea water | 6 | 6 | DITL-29B: 2 | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Blowdown valves | 3 | 3 | DITL-70: 2, DITL-69: 1 | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Cooling water switches | 3 | 2 | DITL-21B: 2, DITL-64: 2, DITL-65: 2 | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Cold reheat drain pot | 2 | 0 | — | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Aux / gland steam | 2 | 0 | — | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Make-up water | 2 | 0 | — | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Industrial water | 2 | 1 | DITL-111: 1 | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |

## 2 TCS IO : TSUBASA

| System | Points | Twin | Twin linked on (sheet: points) | Drawing to read |
|---|---|---|---|---|
| TCS digital inputs | 17 | 0 | — | TCE / TCA sheets and IBD (Hitachi TCS) |
| Generator panel / TCS analog inputs | 9 | 0 | — | generator panel GAE-2013-0136 / TCS I/O list (PC) |
| Generator / TCS analog outputs | 9 | 1 | DITL-115: 1 | generator panel GAE-2013-0136 / TCS I/O list (PC) |
| Generator trip | 1 | 0 | — | Hitachi generator protection / breaker logic 310SD03-743 (PC) |
| Turbine emergency trip push button | 1 | 0 | — | IBD trip sheets / TCE (TCS) |

## 6 HMI : EIMI (panel points)

| System | Points | Twin | Twin linked on (sheet: points) | Drawing to read |
|---|---|---|---|---|
| Operator console annunciator | 34 | 0 | — | DCS hardware wiring (dcs-hardware-wiring.zip, ARP / IRP) (PC) |
| DCS system diagnostics (FCS / SER / PDP alarms, buzzer) | 14 | 0 | — | DCS hardware wiring (dcs-hardware-wiring.zip) (PC) |
| Annunciator | 3 | 0 | — | DCS hardware wiring (PC) |

## Lane AKIHO (alarms, curves, subsystem sheets): sources

- **116 missing alarms.** Source: Alarm List _20160912 (PC). Of them, 43 are motor winding / bearing temperatures or vibrations of points in this register. Their alarm can exist only after the point is linked (KIRARA / RARA first). PC sitting item 2 lists the 116 names with set points. Then match each one by tag to this register.
- **F(X): 220 named patterns in the memory list, 91 wired.** Source: linear-curves-fx.xls (PC sitting item 3). For each pattern, write the sheet that uses it, or "not on any sheet" with the sheet search as proof.
- **Subsystem sheet gaps** (BA-30, 31, 32, 35, 57, 58, 70; DITL-80H, 80I, 80J, 80L; sand 770). Source: index of sand-sootblower-logic.zip and bottomash-limestone-logic.zip (PC sitting item 4). Import if the drawing exists. Otherwise record "not in the drawing set".
- **SCADA Modbus** (199 of 371 in the app). Source: Subsystem PLC IO lists (PC sitting item 7). Count the spares first.

## 1 TCS LOGIC : MARIA: macro (MD) meanings and their source

| Macro | Source | Status |
|---|---|---|
| TRIPPLE INPUT DIAGNOSTICS (LME105) | TC-14-116 p 85, p 1298 No. 9; printed TP:3.0 | from manual text, inside not drawn (beta.461) |
| AI DIAG.MD (LMA510 / LME510) | TC-14-116 p 1298 No. 4; printed H/L HL, LL, DEV HL, LL, DEF TP, DEF N, K | from manual text, inside not drawn (beta.461) |
| TMR AI DIAGNOSTICS (LME111 / LME111A) | TC-14-116 p 1308 No. 6, p 1298 No. 4 / 9; printed TP:1.0, DELAY TP:3.0s | from manual text, inside not drawn (beta.461) |
| MOTOR STANDARD (LMA580A ~ D) | IBD 310SC90-794 Rev 2 sheet 14 TYPICAL LOGIC FOR MOTOR (Turbine Control System book p 30); printed TD 1.0 s, TP 3.0 s x2 | drawing (beta.471); TP 0.5 s not on sheet 14 |

Specs: /mnt/project-files/lanes/tcs-macros/01, 02, 04 (lane 2). QA counts the sheets that run with these apart (`TCE_RUN.stats().runText`) until the user decides; a Logic Monitor print replaces the reading.
