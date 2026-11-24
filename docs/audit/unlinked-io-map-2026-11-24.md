# Unlinked I/O tags and missing alarms: where each one belongs (2026-11-24, main a9570cd)

Made by AUDIT FIX : LISA (user GO START), docs only, read in the cloud. For LEADER : JENNIE (engine side) and HMI : ROSÉ (UI side). Rule 0 applies: a link comes from a drawing or the I/O list, never a made-up value.

## How the list was made

1. DCS I/O list in the app (`src/data/ades.txt`, 2,702 points, stations 1 ~ 5).
2. A point counts as linked when its tag name OR its station address is found in an ABC / DITL sheet of the app (`apre.txt`, `pre.txt`), or its tag name in the app code (engine, world, pages; the copies of the whole list in `src/ui/plant/wiring.js` and the mockup are left out).
3. 609 points had neither. 133 are the sootblowers N-1012 ~ N-1038: the app makes them from the N-1011 sheet at run time (`src/world/world.js` line 87), so they are linked. 13 more are now in the code of main a9570cd. **Left: 463.**
4. Caveat: the address match does not check the station, so a point can count as linked when another station uses the same address. 463 is the lowest sure count of the unlinked; the true number can be a little higher. A runtime check (the Values / tag trace of the app) confirms each one.

## Who does what

- **ENGINE (Jennie): 205.** Of them 182 have a linked twin: the same point of unit A (pump A, burner A, feeder A) is on a sheet, the B / C / D copy is not. Fix: read the drawing set; if the A sheet is typical, clone it per unit as the app does for the sootblowers; if the B / C / D sheets exist, import them. The other ENGINE rows are DCS outputs (commands) with no driving sheet in the app: find the logic in the drawing named in the group.

- **ENGINE + UI (both): 205.** Field measurements and status switches: the plant model gives the value (Jennie), the page shows it (Rosé). Jennie first, then Rosé.

- **UI (Rosé): 53.** Lamps, push buttons, the operator console annunciator (OPC-ANN), the DCS system alarms. No physics.


## Summary by system

| System | Points | ENGINE | ENGINE + UI | UI | Twin linked | Drawing to read |
|---|---|---|---|---|---|---|
| Furnace temperature control dampers / air | 68 | 10 | 58 | 0 | 10 | P&ID K1AU3-A1-0-001 (furnace temperature control dampers) + DCS I/O list (PC) |
| Start-up burners B / C / D (oil, purge, atomizing, panel lamps and push buttons) | 58 | 58 | 0 | 0 | 58 | M&S BMS 1612 13-4-105; DITL-02 / 03 / 07 (burner A sheet is DITL-07) |
| Pumps (VCB, remote, pits) | 35 | 26 | 9 | 0 | 26 | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Operator console annunciator | 34 | 0 | 0 | 34 | 0 | DCS hardware wiring (dcs-hardware-wiring.zip, ARP / IRP) (PC) |
| Feedwater / BFWP | 32 | 18 | 14 | 0 | 13 | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Coal feeder clean-out conveyors and silo valves | 29 | 23 | 6 | 0 | 18 | coal feeder DITL (DITL-16 ~ 21A hold feeder A) and coal handling PLC (PC) |
| Condensate and desuperheater spray valves | 23 | 8 | 15 | 0 | 8 | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| TCS digital inputs | 17 | 0 | 15 | 2 | 0 | TCE / TCA sheets and IBD (Hitachi TCS) |
| Bottom ash screw coolers | 14 | 14 | 0 | 0 | 14 | bottomash-limestone-logic.zip (HD600 BA-01 ~ 74) (PC) |
| DCS system diagnostics (FCS / SER / PDP alarms, buzzer) | 14 | 0 | 0 | 14 | 0 | DCS hardware wiring (dcs-hardware-wiring.zip) (PC) |
| Air dryers | 13 | 13 | 0 | 0 | 13 | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Flue gas / seal pots | 10 | 0 | 10 | 0 | 0 | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Heater drain valves | 10 | 0 | 10 | 0 | 0 | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Generator panel / TCS analog inputs | 9 | 0 | 9 | 0 | 0 | generator panel GAE-2013-0136 / TCS I/O list (PC) |
| Generator / TCS analog outputs | 9 | 9 | 0 | 0 | 1 | generator panel GAE-2013-0136 / TCS I/O list (PC) |
| Compressor motor temperatures | 9 | 0 | 9 | 0 | 0 | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Main steam valves | 7 | 2 | 5 | 0 | 0 | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Lube oil (BFWP-B, PAF) | 7 | 3 | 4 | 0 | 3 | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Coal feeder air tanks | 7 | 1 | 6 | 0 | 1 | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Dosing pumps | 7 | 0 | 7 | 0 | 0 | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Chemical tanks | 6 | 0 | 6 | 0 | 0 | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Sea water | 6 | 6 | 0 | 0 | 6 | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Bottom ash cooler inlet valves | 6 | 0 | 6 | 0 | 0 | bottomash-limestone-logic.zip (PC) |
| Air compressors | 5 | 3 | 2 | 0 | 3 | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Fly ash PLC alarms | 4 | 0 | 4 | 0 | 0 | fly ash PLC: vendor panel, alarms only (PC) |
| Blowdown valves | 3 | 3 | 0 | 0 | 3 | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Cooling water switches | 3 | 2 | 1 | 0 | 2 | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Annunciator | 3 | 0 | 0 | 3 | 0 | DCS hardware wiring (PC) |
| Sootblower steam supply | 2 | 0 | 2 | 0 | 0 | sand-sootblower-logic.zip DITL-80x (PC) |
| Cold reheat drain pot | 2 | 0 | 2 | 0 | 0 | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Aux / gland steam | 2 | 2 | 0 | 0 | 0 | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Make-up water | 2 | 0 | 2 | 0 | 0 | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| FA blower | 2 | 2 | 0 | 0 | 2 | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Industrial water | 2 | 1 | 1 | 0 | 1 | P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC) |
| Flue gas CEMS | 1 | 0 | 1 | 0 | 0 | CEMS vendor panel, alarm only (PC) |
| Generator trip | 1 | 1 | 0 | 0 | 0 | Hitachi generator protection / breaker logic 310SD03-743 (PC) |
| Turbine emergency trip push button | 1 | 0 | 1 | 0 | 0 | IBD trip sheets / TCE (TCS) |
| **Total** | **463** | **205** | **205** | **53** | **182** | |

## Missing alarms (116)

The 116 come from Audit 3 #13: 286 of the 717 tags of the plant alarm list (Alarm List _20160912) had no exact name in the app; 170 of them are in the app under the transmitter name, so 116 are truly missing, most of them motor winding temperatures. **The alarm list itself is on the PC only** (`document-references/alarm-list.zip`), and Audit 3 did not save the 116 names, so the per-alarm map cannot be made in the cloud. What the cloud can show:

- 43 of the unlinked I/O points above are motor winding / bearing temperatures or vibrations (groups "Compressor motor temperatures", "Sea water" and others). Their alarms cannot exist until the point has a value, so they are part of the 116. They are marked ENGINE + UI: Jennie gives the value (motor heat from the motor current, physics), Rosé the alarm row; the H / HH set points come from the alarm list.
- Next step on the PC (one sitting): open Alarm List _20160912, list the 116 names with their set points, and match each to this table by tag. The engine side is the same as for its I/O point; an alarm whose point is linked only needs its row in the alarm scan (`src/ui/hmi/events.js` almScan, UI) with the list set point.

## Every point

Side: E = ENGINE, E+U = ENGINE + UI, U = UI. Twin = the linked tag of the A unit.

### Furnace temperature control dampers / air (68)

Drawing: P&ID K1AU3-A1-0-001 (furnace temperature control dampers) + DCS I/O list (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 3 | AI0400 | TA-FA1052-6 | AI-Wet | #1 Air preheater hot end bearing oil temp. | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 3 | AI0401 | TA-FA1052-7 | AI-Wet | #1 Air preheater cold end bearing oil temp. | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 3 | AI0402 | TI-FA1052 | AI-Dry | #1 Air preheater average measured SA outlet gas temp. | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 3 | AI0532 | VT-FA1055-B2 | AI-Wet | #1 FA blower-B drive end of bearing vibration | E | twin VT-FA1055-A2 |
| 3 | AI0704 | TT-FA1055-BU | AI-Wet | #1 FA blower-B motor winding temperature (U phase) | E | twin TT-FA1055-AU |
| 3 | AI0705 | TT-FA1055-BV | AI-Wet | #1 FA blower-B motor winding temperature (V phase) | E | twin TT-FA1055-AV |
| 3 | AI0706 | TT-FA1055-BW | AI-Wet | #1 FA blower-B motor winding temperature (W phase) | E | twin TT-FA1055-AW |
| 3 | AI0707 | TT-FA1055-B3 | AI-Wet | #1 FA blower-B motor side drive end bearing temp. | E | twin TT-FA1055-A3 |
| 3 | AI0708 | TT-FA1055-B4 | AI-Wet | #1 FA blower-B motor side non drive end bearing temp. | E | twin TT-FA1055-A4 |
| 3 | AI0709 | TT-FA1055-B2 | AI-Wet | #1 FA blower-B drive end bearing temp. | E | twin TT-FA1055-A2 |
| 3 | AI0710 | TT-FA1055-B1 | AI-Wet | #1 FA blower-B non drive end bearing temp. | E | twin TT-FA1055-A1 |
| 3 | I.0333 | MIL-FA1005 | DI | #1 Furnace temp. front wall motor control damper FA1005 remote | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0334 | TS-FA1005 | DI | #1 Furnace temp. front wall motor control damper FA1005 torque | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0720 | ZSO-FA1008 | DI | #1 Furnace temp. front wall motor control damper FA1008 open | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0721 | ZSC-FA1008 | DI | #1 Furnace temp. front wall motor control damper FA1008 close | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0722 | MIT-FA1008 | DI | #1 Furnace temp. front wall motor control damper FA1008 trip | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0723 | MIL-FA1008 | DI | #1 Furnace temp. front wall motor control damper FA1008 remote | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0724 | TS-FA1008 | DI | #1 Furnace temp. front wall motor control damper FA1008 torque | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0725 | ZSO-FA1009 | DI | #1 Furnace temp. front wall motor control damper FA1009 open | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0726 | ZSC-FA1009 | DI | #1 Furnace temp. front wall motor control damper FA1009 close | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0727 | MIT-FA1009 | DI | #1 Furnace temp. front wall motor control damper FA1009 trip | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0728 | MIL-FA1009 | DI | #1 Furnace temp. front wall motor control damper FA1009 remote | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0729 | TS-FA1009 | DI | #1 Furnace temp. front wall motor control damper FA1009 torque | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.072A | ZSO-FA1010 | DI | #1 Furnace temp. front wall motor control damper FA1010 open | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.072B | ZSC-FA1010 | DI | #1 Furnace temp. front wall motor control damper FA1010 close | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.072C | MIT-FA1010 | DI | #1 Furnace temp. front wall motor control damper FA1010 trip | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.072D | MIL-FA1010 | DI | #1 Furnace temp. front wall motor control damper FA1010 remote | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.072E | TS-FA1010 | DI | #1 Furnace temp. front wall motor control damper FA1010 torque | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0730 | ZSO-FA1011 | DI | #1 Furnace temp. front wall motor control damper FA1011 open | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0731 | ZSC-FA1011 | DI | #1 Furnace temp. front wall motor control damper FA1011 close | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0732 | MIT-FA1011 | DI | #1 Furnace temp. front wall motor control damper FA1011 trip | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0733 | MIL-FA1011 | DI | #1 Furnace temp. front wall motor control damper FA1011 remote | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0735 | ZSO-FA1012 | DI | #1 Furnace temp. front wall motor control damper FA1012 open | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0737 | MIT-FA1012 | DI | #1 Furnace temp. front wall motor control damper FA1012 trip | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0738 | MIL-FA1012 | DI | #1 Furnace temp. front wall motor control damper FA1012 remote | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0739 | TS-FA1012 | DI | #1 Furnace temp. front wall motor control damper FA1012 torque | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.073B | ZSC-FA1013 | DI | #1 Furnace temp. front wall motor control damper FA1013 close | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.073C | MIT-FA1013 | DI | #1 Furnace temp. front wall motor control damper FA1013 trip | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0800 | ZSO-FA1014 | DI | #1 Furnace temp. front wall motor control damper FA1014 open | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0801 | ZSC-FA1014 | DI | #1 Furnace temp. front wall motor control damper FA1014 close | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0802 | MIT-FA1014 | DI | #1 Furnace temp. front wall motor control damper FA1014 trip | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0803 | MIL-FA1014 | DI | #1 Furnace temp. front wall motor control damper FA1014 remote | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0804 | TS-FA1014 | DI | #1 Furnace temp. front wall motor control damper FA1014 torque | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0805 | ZSO-FA1015 | DI | #1 Furnace temp. front wall motor control damper FA1015 open | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0806 | ZSC-FA1015 | DI | #1 Furnace temp. front wall motor control damper FA1015 close | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0807 | MIT-FA1015 | DI | #1 Furnace temp. front wall motor control damper FA1015 trip | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0808 | MIL-FA1015 | DI | #1 Furnace temp. front wall motor control damper FA1015 remote | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0809 | TS-FA1015 | DI | #1 Furnace temp. front wall motor control damper FA1015 torque | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.080A | ZSO-FA1016 | DI | #1 Furnace temp. front wall motor control damper FA1016 open | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.080B | ZSC-FA1016 | DI | #1 Furnace temp. front wall motor control damper FA1016 close | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.080C | MIT-FA1016 | DI | #1 Furnace temp. front wall motor control damper FA1016 trip | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.080D | MIL-FA1016 | DI | #1 Furnace temp. front wall motor control damper FA1016 remote | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.080E | TS-FA1016 | DI | #1 Furnace temp. front wall motor control damper FA1016 torque | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0810 | ZSO-FA1017 | DI | #1 Furnace temp. front wall motor control damper FA1017 open | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0811 | ZSC-FA1017 | DI | #1 Furnace temp. front wall motor control damper FA1017 close | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0812 | MIT-FA1017 | DI | #1 Furnace temp. front wall motor control damper FA1017 trip | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0813 | MIL-FA1017 | DI | #1 Furnace temp. front wall motor control damper FA1017 remote | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0814 | TS-FA1017 | DI | #1 Furnace temp. front wall motor control damper FA1017 torque | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0815 | ZSO-FA1018 | DI | #1 Furnace temp. front wall motor control damper FA1018 open | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0816 | ZSC-FA1018 | DI | #1 Furnace temp. front wall motor control damper FA1018 close | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0817 | MIT-FA1018 | DI | #1 Furnace temp. front wall motor control damper FA1018 trip | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0818 | MIL-FA1018 | DI | #1 Furnace temp. front wall motor control damper FA1018 remote | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0819 | TS-FA1018 | DI | #1 Furnace temp. front wall motor control damper FA1018 torque | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 4 | I.0976 | ZSO-FA1043-D | DI | #1 Burner-D hot secondary air flow control damper open | E | twin ZSO-FA1043-A |
| 4 | I.0977 | ZSC-FA1043-D | DI | #1 Burner-D hot secondary air flow control damper close | E | twin ZSC-FA1043-A |
| 4 | I.0978 | MIT-FA1043-D | DI | #1 Burner-D hot secondary air flow control damper trip | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 4 | I.0979 | MIL-FA1043-D | DI | #1 Burner-D hot secondary air flow control damper remote | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 4 | I.097A | TS-FA1043-D | DI | #1 Burner-D hot secondary air flow control damper torque | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |

### Start-up burners B / C / D (oil, purge, atomizing, panel lamps and push buttons) (58)

Drawing: M&S BMS 1612 13-4-105; DITL-02 / 03 / 07 (burner A sheet is DITL-07)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 4 | I.0333 | ZSR-DO1043-B4 | DI | #1 Boiler start up burner-B Igniter retract | E | twin ZSR-DO1043-A4 |
| 4 | I.0641 | ZSC-DO1043-C1 | DI | #1 Boiler start up burner-C oil supply line valve(1) close | E | twin ZSC-DO1043-A1 |
| 4 | I.064C | ZSO-PA1043-C3 | DI | #1 Boiler start up burner-C purge valve open | E | twin ZSO-PA1043-A3 |
| 4 | I.064D | ZSC-PA1043-C3 | DI | #1 Boiler start up burner-C purge valve close | E | twin ZSC-PA1043-A3 |
| 4 | I.0684 | BI2-DO1043-C | DI | #1 Burner-C oil gun not off/purge P.B. signal | E | twin BI2-DO1043-A |
| 4 | I.0685 | BI1-DO1043-C | DI | #1 Burner-C cleaning on | E | twin BI1-DO1043-A |
| 4 | I.0687 | BI4-DO1043-C | DI | #1 Igniter-C not off P.B. signal | E | twin BI4-DO1043-A |
| 4 | I.068C | PSH-DO1043-C1 | DI | #1 Boiler start up burner-C supply oil pressure switch not high | E | twin PSH-DO1043-A1 |
| 4 | I.068D | PSL-PA1043-C1 | DI | #1 Boiler start up burner-C atomizing air pressure switch not low | E | twin PSL-PA1043-A1 |
| 4 | I.0960 | ZSO-DO1043-D1 | DI | #1 Boiler start up burner-D oil supply line valve(1) open | E | twin ZSO-DO1043-A1 |
| 4 | I.0961 | ZSC-DO1043-D1 | DI | #1 Boiler start up burner-D oil supply line valve(1) close | E | twin ZSC-DO1043-A1 |
| 4 | I.0962 | ZSO-DO1043-D2 | DI | #1 Boiler start up burner-D oil supply line valve(2) open | E | twin ZSO-DO1043-A2 |
| 4 | I.0963 | ZSC-DO1043-D2 | DI | #1 Boiler start up burner-D oil supply line valve(2) close | E | twin ZSC-DO1043-A2 |
| 4 | I.0968 | ZSO-PA1043-D2 | DI | #1 Boiler start up burner-D atomizing air valve open | E | twin ZSO-PA1043-A2 |
| 4 | I.0969 | ZSC-PA1043-D2 | DI | #1 Boiler start up burner-D atomizing air valve close | E | twin ZSC-PA1043-A2 |
| 4 | I.096C | ZSO-PA1043-D3 | DI | #1 Boiler start up burner-D purge valve open | E | twin ZSO-PA1043-A3 |
| 4 | I.096D | ZSC-PA1043-D3 | DI | #1 Boiler start up burner-D purge valve close | E | twin ZSC-PA1043-A3 |
| 4 | I.0970 | ZSE-DO1043-D5 | DI | #1 Boiler start up burner-D oil gun extend | E | twin ZSE-DO1043-A5 |
| 4 | I.0971 | ZSR-DO1043-D5 | DI | #1 Boiler start up burner-D oil gun retract | E | twin ZSR-DO1043-A5 |
| 4 | I.0973 | ZSR-DO1043-D4 | DI | #1 Boiler start up burner-D Igniter retract | E | twin ZSR-DO1043-A4 |
| 4 | I.1001 | BI7-DO1043-D | DI | #1 Burner-D lamp test | E | twin BI7-DO1043-A |
| 4 | I.1002 | BI6-DO1043-D | DI | #1 Burner-D not remote | E | twin BI6-DO1043-A |
| 4 | I.1003 | BI3-DO1043-D | DI | #1 Burner-D oil gun on P.B. signal | E | twin BI3-DO1043-A |
| 4 | I.1004 | BI2-DO1043-D | DI | #1 Burner-D oil gun not off/purge P.B. signal | E | twin BI2-DO1043-A |
| 4 | I.1005 | BI1-DO1043-D | DI | #1 Burner-D cleaning on | E | twin BI1-DO1043-A |
| 4 | I.1006 | BI5-DO1043-D | DI | #1 Igniter-D on P.B. signal | E | twin BI5-DO1043-A |
| 4 | I.1007 | BI4-DO1043-D | DI | #1 Igniter-D not off P.B. signal | E | twin BI4-DO1043-A |
| 4 | I.1008 | BI8-DO1043-D | DI | #1 Spark Igniter-D flame on | E | twin BI8-DO1043-A |
| 4 | I.1009 | BI10-DO1043-D | DI | #1 Start up burner-D flame detector ready | E | twin BI10-DO1043-A |
| 4 | I.100A | BI9-DO1043-D | DI | #1 Start up burner-D flame detector on | E | twin BI9-DO1043-A |
| 4 | I.100C | PSH-DO1043-D1 | DI | #1 Boiler start up burner-D supply oil pressure switch not high | E | twin PSH-DO1043-A1 |
| 4 | I.100D | PSL-PA1043-D1 | DI | #1 Boiler start up burner-D atomizing air pressure switch not low | E | twin PSL-PA1043-A1 |
| 4 | O.0400 | SV-DO1043-B1 | DO-Wet | #1 Boiler start up burner-B oil supply line valve(1) open command | E | twin SV-DO1043-A1 |
| 4 | O.0401 | SV-DO1043-B2 | DO-Wet | #1 Boiler start up burner-B oil supply line valve(2) open command | E | twin SV-DO1043-A2 |
| 4 | O.0404 | SV-PA1043-B2 | DO-Wet | #1 Boiler start up burner-B atomizing air valve open command | E | twin SV-PA1043-A2 |
| 4 | O.0406 | SV-PA1043-B3 | DO-Wet | #1 Boiler start up burner-B purge valve open command | E | twin SV-PA1043-A3 |
| 4 | O.0407 | SVE-DO1043-B5 | DO-Wet | #1 Boiler start up burner-B oil gun cylinder insert command | E | twin SVE-DO1043-A5 |
| 4 | O.0408 | SVR-DO1043-B5 | DO-Wet | #1 Boiler start up burner-B oil gun cylinder retract command | E | twin SVR-DO1043-A5 |
| 4 | O.0409 | SVE-DO1043-B4 | DO-Wet | #1 Boiler start up burner-B Igniter cylinder insert command | E | twin SVE-DO1043-A4 |
| 4 | O.0410 | BO6-DO1043-B | DO-Wet | #1 Spark-B on command | E | twin BO6-DO1043-A |
| 4 | O.0411 | BO4-DO1043-B | DO-Wet | #1 Igniter-B off lamp indicator | E | twin BO4-DO1043-A |
| 4 | O.0412 | BO5-DO1043-B | DO-Wet | #1 Igniter-B in operation lamp indicator | E | twin BO5-DO1043-A |
| 4 | O.0413 | BO1-DO1043-B | DO-Wet | #1 Burner-B cleaning running lamp indicator | E | twin BO1-DO1043-A |
| 4 | O.0414 | BO2-DO1043-B | DO-Wet | #1 Burner-B off lamp indicator | E | twin BO2-DO1043-A |
| 4 | O.0415 | BO3-DO1043-B | DO-Wet | #1 Burner-B in operation lamp indicator | E | twin BO3-DO1043-A |
| 4 | O.1040 | SV-DO1043-D1 | DO-Wet | #1 Boiler start up burner-D oil supply line valve(1) open command | E | twin SV-DO1043-A1 |
| 4 | O.1041 | SV-DO1043-D2 | DO-Wet | #1 Boiler start up burner-D oil supply line valve(2) open command | E | twin SV-DO1043-A2 |
| 4 | O.1044 | SV-PA1043-D2 | DO-Wet | #1 Boiler start up burner-D atomizing air valve open command | E | twin SV-PA1043-A2 |
| 4 | O.1046 | SV-PA1043-D3 | DO-Wet | #1 Boiler start up burner-D purge valve open command | E | twin SV-PA1043-A3 |
| 4 | O.1047 | SVE-DO1043-D5 | DO-Wet | #1 Boiler start up burner-D oil gun cylinder insert command | E | twin SVE-DO1043-A5 |
| 4 | O.1048 | SVR-DO1043-D5 | DO-Wet | #1 Boiler start up burner-D oil gun cylinder retract command | E | twin SVR-DO1043-A5 |
| 4 | O.1049 | SVE-DO1043-D4 | DO-Wet | #1 Boiler start up burner-D Igniter cylinder insert command | E | twin SVE-DO1043-A4 |
| 4 | O.1050 | BO6-DO1043-D | DO-Wet | #1 Spark-D on command | E | twin BO6-DO1043-A |
| 4 | O.1051 | BO4-DO1043-D | DO-Wet | #1 Igniter-D off lamp indicator | E | twin BO4-DO1043-A |
| 4 | O.1052 | BO5-DO1043-D | DO-Wet | #1 Igniter-D in operation lamp indicator | E | twin BO5-DO1043-A |
| 4 | O.1053 | BO1-DO1043-D | DO-Wet | #1 Burner-D cleaning running lamp indicator | E | twin BO1-DO1043-A |
| 4 | O.1054 | BO2-DO1043-D | DO-Wet | #1 Burner-D off lamp indicator | E | twin BO2-DO1043-A |
| 4 | O.1055 | BO3-DO1043-D | DO-Wet | #1 Burner-D in operation lamp indicator | E | twin BO3-DO1043-A |

### Pumps (VCB, remote, pits) (35)

Drawing: P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 3 | AI0434 | IT-P1503B | AI-Dry | #1 Seawater booster pump-B current | E | twin IT-P1503A |
| 3 | AI0435 | IT-P1503C | AI-Dry | #1 Seawater booster pump-C current | E | twin IT-P1503A |
| 3 | AI0465 | IT-P1116B | AI-Dry | #1 Condensate pump-B current | E | twin IT-P1116A |
| 3 | I.017F | LSHH-P1127 | DI | #1 Transformer area pit level switch high high | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.032E | MIV-P1501A1 | DI | #1 Seawater pump-A VCB on | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.032F | MIV-P1501A2 | DI | #1 Seawater pump-A VCB off | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0402 | MIL-P1116B | DI | #1 Condensate pump-B remote | E | twin MIL-P1116A |
| 3 | I.0404 | MIV-P1116B1 | DI | #1 Condensate pump-B VCB on | E | twin MIV-P1116A1 |
| 3 | I.0405 | MIV-P1116B2 | DI | #1 Condensate pump-B VCB off | E | twin MIV-P1116A2 |
| 3 | I.052A | MIV-P1501B1 | DI | #1 Seawater pump-B VCB on | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.052B | MIV-P1501B2 | DI | #1 Seawater pump-B VCB off | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.081C | MIL-P1501C | DI | #1 Seawater pump-C remote | E | twin MIL-P1501A |
| 3 | I.081E | MIV-P1501C1 | DI | #1 Seawater pump-C VCB on | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.081F | MIV-P1501C2 | DI | #1 Seawater pump-C VCB off | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | O.044C | MOR-P1501B | DO-Dry | #1 Seawater pump-B start command | E | twin MOR-P1501A |
| 3 | O.044D | MOS-P1501B | DO-Dry | #1 Seawater pump-B stop command | E | twin MOS-P1501A |
| 3 | O.044E | MOR-P1503B | DO-Dry | #1 Seawater booster pump-B start command | E | twin MOR-P1503A |
| 3 | O.0456 | MOP-P1116B | DO-Dry | #1 Condensate pump-B start permission signal | E | twin MOP-P1116A |
| 3 | O.0457 | MOT-P1116B | DO-Dry | #1 Condensate pump-B trip command | E | twin MOT-P1116A |
| 3 | O.045A | MOP-P1501B | DO-Dry | #1 Seawater pump-B start permission signal | E | twin MOP-P1501A |
| 3 | O.045B | MOT-P1501B | DO-Dry | #1 Seawater pump-B trip command | E | twin MOT-P1501A |
| 3 | O.045D | MOP-P1503B | DO-Dry | #1 Seawater booster pump-B start permission signal | E | twin MOP-P1503A |
| 3 | O.0763 | MOS-P1501C | DO-Dry | #1 Seawater pump-C stop command | E | twin MOS-P1501A |
| 3 | O.076F | MOR-P1503C | DO-Dry | #1 Seawater booster pump-C start command | E | twin MOR-P1503A |
| 3 | O.0772 | MOP-P1501C | DO-Dry | #1 Seawater pump-C start permission signal | E | twin MOP-P1501A |
| 3 | O.0773 | MOT-P1501C | DO-Dry | #1 Seawater pump-C trip command | E | twin MOT-P1501A |
| 3 | O.0774 | MOP-P1503C | DO-Dry | #1 Seawater booster pump-C start permission signal | E | twin MOP-P1503A |
| 5 | I.0121 | MIT-P0761B | DI | Hypo-chlorinated dosing system unloading pump-B overload | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 5 | I.032E | MIT-P0761A | DI | Hypo-chlorinated dosing system unloading pump-A overload | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 5 | O.0360 | MOR-P0702B | DO-Dry | Diesel oil pump-B start command | E | twin MOR-P0702A |
| 5 | O.0361 | MOR-P0709B | DO-Dry | Make-up water pump-B start command | E | twin MOR-P0709A |
| 5 | O.0362 | MOR-P0715B | DO-Dry | Industrial water pump-B start command | E | twin MOR-P0715A |
| 5 | O.0363 | MOR-P0709C | DO-Dry | Make-up water pump-C start command | E | twin MOR-P0709A |
| 5 | O.0364 | MOP-P0058B | DO-Dry | Waste water pump-B start permission signal | E | twin MOP-P0058A |
| 5 | O.037E | MOP-P0709B | DO-Dry | Make-up water pump-B start permission signal | E | twin MOP-P0709A |

### Operator console annunciator (34)

Drawing: DCS hardware wiring (dcs-hardware-wiring.zip, ARP / IRP) (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 4 | O.1325 | OPC-ANN-A6 | DO-Dry | #1 B-FA BLOWER STOPPED | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.1327 | OPC-ANN-A8 | DO-Dry | #1 B-COAL FEEDER STOPPED | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.133A | OPC-ANN-C7 | DO-Dry | #1 B-BFWP STOPPED | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.133B | OPC-ANN-C8 | DO-Dry | #1 B-FA BLOWER BEARING TEMPERATURE H.H. | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.133D | OPC-ANN-C10 | DO-Dry | (blank in the I/O list) | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.1364 | OPC-ANN-D7 | DO-Dry | #1 B-FA BLOWER BEARING TEMPERATURE HIGH | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.1366 | OPC-ANN-D9 | DO-Dry | #1 B-COAL FEEDER OUTLET TEMPERATURE HIGH | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.1367 | OPC-ANN-D10 | DO-Dry | #1 C-COAL FEEDER OUTLET TEMPERATURE HIGH | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.137D | OPC-ANN-G2 | DO-Dry | #1 B-BOTTOM ASH SCREW COOLER STOPPED | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.137E | OPC-ANN-G3 | DO-Dry | #1 C-BOTTOM ASH SCREW COOLER STOPPED | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.137F | OPC-ANN-G4 | DO-Dry | #1 D-BOTTOM ASH SCREW COOLER STOPPED | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.1403 | OPC-ANN-G8 | DO-Dry | (blank in the I/O list) | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.1404 | OPC-ANN-G9 | DO-Dry | (blank in the I/O list) | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.1405 | OPC-ANN-G10 | DO-Dry | (blank in the I/O list) | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.1407 | OPC-ANN-H2 | DO-Dry | B-MAKE UP PUMP STOPPED | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.1408 | OPC-ANN-H3 | DO-Dry | C-MAKE UP PUMP STOPPED | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.1411 | OPC-ANN-I2 | DO-Dry | B-DIESEL OIL PUMP STOPPED | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.1413 | OPC-ANN-I4 | DO-Dry | (blank in the I/O list) | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.1414 | OPC-ANN-I5 | DO-Dry | (blank in the I/O list) | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.1415 | OPC-ANN-I6 | DO-Dry | (blank in the I/O list) | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.1416 | OPC-ANN-I7 | DO-Dry | (blank in the I/O list) | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.1417 | OPC-ANN-I8 | DO-Dry | (blank in the I/O list) | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.1418 | OPC-ANN-I9 | DO-Dry | (blank in the I/O list) | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.1419 | OPC-ANN-I10 | DO-Dry | (blank in the I/O list) | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.141A | OPC-ANN-J1 | DO-Dry | (blank in the I/O list) | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.141B | OPC-ANN-J2 | DO-Dry | (blank in the I/O list) | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.141C | OPC-ANN-J3 | DO-Dry | (blank in the I/O list) | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.141D | OPC-ANN-J4 | DO-Dry | (blank in the I/O list) | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.141E | OPC-ANN-J5 | DO-Dry | (blank in the I/O list) | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.141F | OPC-ANN-J6 | DO-Dry | (blank in the I/O list) | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.1440 | OPC-ANN-J7 | DO-Dry | (blank in the I/O list) | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.1441 | OPC-ANN-J8 | DO-Dry | (blank in the I/O list) | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.1442 | OPC-ANN-J9 | DO-Dry | (blank in the I/O list) | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.1443 | OPC-ANN-J10 | DO-Dry | (blank in the I/O list) | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |

### Feedwater / BFWP (32)

Drawing: P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 1 | AI0180 | ZT-FW1130-1 | AI-Wet | #1 Boiler drum level control valve position | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 1 | AI0195 | ZT-FW1130-2 | AI-Wet | #1 Boiler feed water flow control valve position for start-up | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | AI0694 | ZT-FW1060 | AI-Wet | #1 HP turbine bypass desuperheater spray water control valve position | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | AI0704 | ZT-FW1150 | AI-Wet | #1 Reheater inlet desuperheater spray water control valve position | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | AI0768 | ZT-FW1001 | AI-Wet | #1 BFWP-A outlet motor valve position | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | AI0784 | ZT-FW1002 | AI-Wet | #1 BFWP-B outlet motor valve position | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | AI0785 | ZT-FW1392 | AI-Wet | #1 BFWP-B outlet bypass motor valve position | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | AI0901 | TT-FW1010 | AI-Wet | #1 BFWP inlet feed water temperature | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | I.0299 | LS-FW1115-A | DI | #1 BFWP-A motor cooling water leakage detector | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 2 | I.029A | LS-FW1115-B | DI | #1 BFWP-B motor cooling water leakage detector | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 2 | I.0898 | ZSO-FW1060 | DI | #1 HP turbine bypass desuperheater spray water control valve open | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 2 | I.0899 | ZSC-FW1060 | DI | #1 HP turbine bypass desuperheater spray water control valve close | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 2 | I.089A | ZSO-FW1150 | DI | #1 Reheater inlet desuperheater spray water control valve open | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 2 | I.089B | ZSC-FW1150 | DI | #1 Reheater inlet desuperheater spray water control valve close | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 2 | O.0131 | MOS-FW1001 | DO-Dry | #1 BFWP-A outlet motor valve close command | E | DCS output with no driving sheet in the app: find the logic (drawing at right); the field device must answer it |
| 2 | O.044C | MOR-FW1002 | DO-Dry | #1 BFWP-B outlet motor valve open command | E | DCS output with no driving sheet in the app: find the logic (drawing at right); the field device must answer it |
| 2 | O.044D | MOS-FW1002 | DO-Dry | #1 BFWP-B outlet motor valve close command | E | DCS output with no driving sheet in the app: find the logic (drawing at right); the field device must answer it |
| 2 | O.044E | MOR-FW1392 | DO-Dry | #1 BFWP-B outlet bypass motor valve open command | E | DCS output with no driving sheet in the app: find the logic (drawing at right); the field device must answer it |
| 2 | O.044F | MOS-FW1392 | DO-Dry | #1 BFWP-B outlet bypass motor valve close command | E | DCS output with no driving sheet in the app: find the logic (drawing at right); the field device must answer it |
| 3 | AI0658 | TT-FW1115-BW | AI-Wet | #1 BFWP-B motor winding temperature (W phase) | E | twin TT-FW1115-AW |
| 3 | AI0659 | TT-FW1115-B3 | AI-Wet | #1 BFWP-B motor side drive end bearing temp. | E | twin TT-FW1115-A3 |
| 3 | AI0660 | TT-FW1115-B4 | AI-Wet | #1 BFWP-B motor side non drive end bearing temp. | E | twin TT-FW1115-A4 |
| 3 | AI0661 | TT-FW1115-B2 | AI-Wet | #1 BFWP-B pump side drive end bearing temp. | E | twin TT-FW1115-A2 |
| 3 | AI0662 | TT-FW1115-B1 | AI-Wet | #1 BFWP-B pump side non drive end bearing temp. | E | twin TT-FW1115-A1 |
| 3 | AI1008 | VT-FW1115-B11 | AI-Wet | #1 BFWP-B pump non drive end of casing vibration (X) | E | twin VT-FW1115-A11 |
| 3 | AI1009 | VT-FW1115-B12 | AI-Wet | #1 BFWP-B pump non drive end of casing vibration (Y) | E | twin VT-FW1115-A12 |
| 3 | AI1010 | VT-FW1115-B21 | AI-Wet | #1 BFWP-B pump drive end of casing vibration (X) | E | twin VT-FW1115-A21 |
| 3 | AI1011 | VT-FW1115-B22 | AI-Wet | #1 BFWP-B pump drive end of casing vibration (Y) | E | twin VT-FW1115-A22 |
| 3 | AI1012 | VT-FW1115-B41 | AI-Wet | #1 BFWP-B motor non drive end of casing vibration (X) | E | twin VT-FW1115-A41 |
| 3 | AI1013 | VT-FW1115-B42 | AI-Wet | #1 BFWP-B motor non drive end of casing vibration (Y) | E | twin VT-FW1115-A42 |
| 3 | AI1014 | VT-FW1115-B31 | AI-Wet | #1 BFWP-B motor drive end of casing vibration (X) | E | twin VT-FW1115-A31 |
| 3 | AI1015 | VT-FW1115-B32 | AI-Wet | #1 BFWP-B motor drive end of casing vibration (Y) | E | twin VT-FW1115-A32 |

### Coal feeder clean-out conveyors and silo valves (29)

Drawing: coal feeder DITL (DITL-16 ~ 21A hold feeder A) and coal handling PLC (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 4 | I.0133 | MIR-CL1061-A1 | DI | #1 Coal feeder-A clean out conveyor running | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 4 | I.0134 | MIT-CL1061-A1 | DI | #1 Coal feeder-A clean out conveyor fault | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 4 | I.0135 | YSR-CL1061-A7 | DI | #1 Coal feeder-A outlet discharge isolation valve remote | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 4 | I.0440 | ZSO-CL1061-B1 | DI | #1 Coal silo outlet valve-1 of coal feeder-B open | E | twin ZSO-CL1061-A1 |
| 4 | I.0441 | ZSC-CL1061-B1 | DI | #1 Coal silo outlet valve-1 of coal feeder-B close | E | twin ZSC-CL1061-A1 |
| 4 | I.0442 | ZSO-CL1061-B2 | DI | #1 Coal silo outlet valve-2 of coal feeder-B open | E | twin ZSO-CL1061-A2 |
| 4 | I.0443 | ZSC-CL1061-B2 | DI | #1 Coal silo outlet valve-2 of coal feeder-B close | E | twin ZSC-CL1061-A2 |
| 4 | I.0444 | ZSO-CL1061-B7 | DI | #1 Coal feeder-B outlet discharge isolation valve open | E | twin ZSO-CL1061-A7 |
| 4 | I.0448 | MIA-CL1061-B2 | DI | #1 Coal feeder-B volumertic signal | E | twin MIA-CL1061-A2 |
| 4 | I.0449 | MIA-CL1061-B3 | DI | #1 Coal feeder-B inlet plugging | E | twin MIA-CL1061-A3 |
| 4 | I.044A | MIA-CL1061-B4 | DI | #1 Coal feeder-B discharge plugging | E | twin MIA-CL1061-A4 |
| 4 | I.044B | MIA-CL1061-B5 | DI | #1 Coal feeder-B no coal on belt | E | twin MIA-CL1061-A5 |
| 4 | I.044C | MIA-CL1061-B6 | DI | #1 Coal feeder-B outlet temperature high | E | twin MIA-CL1061-A6 |
| 4 | I.044D | MIA-CL1061-B7 | DI | #1 Coal feeder-B belt tracking | E | twin MIA-CL1061-A7 |
| 4 | I.044E | MIA-CL1061-B8 | DI | #1 Coal feeder-B clean out conveyor auto mode | E | twin MIA-CL1061-A8 |
| 4 | I.0451 | MIT-CL1061-B | DI | #1 Coal feeder-B fault | E | twin MIT-CL1061-A |
| 4 | I.0453 | MIR-CL1061-B1 | DI | #1 Coal feeder-B clean out conveyor running | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 4 | I.0454 | MIT-CL1061-B1 | DI | #1 Coal feeder-B clean out conveyor fault | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 4 | I.0455 | YSR-CL1061-B7 | DI | #1 Coal feeder-B outlet discharge isolation valve remote | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 4 | I.0480 | ZSO-CL1061-C1 | DI | #1 Coal silo outlet valve-1 of coal feeder-C open | E | twin ZSO-CL1061-A1 |
| 4 | I.0481 | ZSC-CL1061-C1 | DI | #1 Coal silo outlet valve-1 of coal feeder-C close | E | twin ZSC-CL1061-A1 |
| 4 | I.048C | MIA-CL1061-C6 | DI | #1 Coal feeder-C outlet temperature high | E | twin MIA-CL1061-A6 |
| 4 | O.060E | MOR-CL1061-B | DO-Dry | #1 Coal feeder-B start command | E | twin MOR-CL1061-A |
| 4 | O.060F | MFT-CL1061-B | DO-Dry | #1 NO MFT to Coal feeder-B outlet discharge isolation valve | E | twin MFT-CL1061-A |
| 4 | O.0772 | LAH-CL1008-B | DO-Dry | #1 Boiler coal silo-B level switch high | E | DCS output with no driving sheet in the app: find the logic (drawing at right); the field device must answer it |
| 4 | O.0774 | LAH-CL1008-C | DO-Dry | #1 Boiler coal silo-C level switch high | E | DCS output with no driving sheet in the app: find the logic (drawing at right); the field device must answer it |
| 4 | O.0776 | DOR-CL1061-A | DO-Dry | #1 Coal feeder-A running | E | DCS output with no driving sheet in the app: find the logic (drawing at right); the field device must answer it |
| 4 | O.0777 | DOR-CL1061-B | DO-Dry | #1 Coal feeder-B running | E | DCS output with no driving sheet in the app: find the logic (drawing at right); the field device must answer it |
| 4 | O.0778 | DOR-CL1061-C | DO-Dry | #1 Coal feeder-C running | E | DCS output with no driving sheet in the app: find the logic (drawing at right); the field device must answer it |

### Condensate and desuperheater spray valves (23)

Drawing: P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 2 | AI0389 | ZT-CD1121 | AI-Wet | #1 Condensate polisher flow control valve position | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | AI0390 | ZT-CD1115 | AI-Wet | #1 LP turbine bypass desuperheater spray water control valve position | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | AI0688 | ZT-CD1124 | AI-Wet | #1 Main steam to aux. steam desuperheater spray water control valve position | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | AI0689 | ZT-CD1126 | AI-Wet | #1 Gland steam desuperheater spray water control valve position | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | AI0690 | ZT-CD1120 | AI-Wet | #1 Condensate system minimum flow recirculation control valve position | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | AI0691 | ZT-CD1110 | AI-Wet | #1 Condenser dumping to raw pit level control valve position | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | AI0692 | ZT-CD1104 | AI-Wet | #1 Deaerator storage tank level control valve position | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | AI0854 | TT-CD1110-2 | AI-Wet | #1 Condenser hot well water temperature (2) | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | AI0869 | TT-CD1110-3 | AI-Wet | #1 Condenser neck temperature | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | I.0291 | LSHH-CD1110 | DI | #1 Condenser hot well water level switch high high | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 2 | I.0893 | ZSC-CD1115 | DI | #1 LP turbine bypass desuperheater spray water control valve close | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 2 | I.0894 | ZSO-CD1124 | DI | #1 Main steam to aux. steam desuperheater spray water control valve open | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 2 | I.0895 | ZSC-CD1124 | DI | #1 Main steam to aux. steam desuperheater spray water control valve close | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 2 | I.0896 | ZSO-CD1126 | DI | #1 Gland steam desuperheater spray water control valve open | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 2 | I.0897 | ZSC-CD1126 | DI | #1 Gland steam desuperheater spray water control valve close | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | AI0869 | VT-CD1116-B3 | AI-Wet | #1 Condensate pump-B motor drive end of bearing vibration | E | twin VT-CD1116-A3 |
| 3 | AI0870 | VT-CD1116-B4 | AI-Wet | #1 Condensate pump-B motor non drive end of bearing vibration | E | twin VT-CD1116-A4 |
| 3 | AI0976 | TT-CD1116-BU | AI-Wet | #1 Condensate pump-B motor winding temperature (U phase) | E | twin TT-CD1116-AU |
| 3 | AI0977 | TT-CD1116-BV | AI-Wet | #1 Condensate pump-B motor winding temperature (V phase) | E | twin TT-CD1116-AV |
| 3 | AI0978 | TT-CD1116-BW | AI-Wet | #1 Condensate pump-B motor winding temperature (W phase) | E | twin TT-CD1116-AW |
| 3 | AI0979 | TT-CD1116-B3 | AI-Wet | #1 Condensate pump-B motor bearing temperature (1) | E | twin TT-CD1116-A3 |
| 3 | AI0980 | TT-CD1116-B4 | AI-Wet | #1 Condensate pump-B motor bearing temperature (2) | E | twin TT-CD1116-A4 |
| 3 | AI0981 | TT-CD1116-B1 | AI-Wet | #1 Condensate pump-B coupling temperature | E | twin TT-CD1116-A1 |

### TCS digital inputs (17)

Drawing: TCE / TCA sheets and IBD (Hitachi TCS)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 2 | I.0402 | TCS-DI1025 | DI | #1 RSV / ICV fully closed 2 | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 2 | I.0403 | TCS-DI1026 | DI | #1 MSV / HPCV fully closed and TCS major trouble 1 | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 2 | I.0404 | TCS-DI1027 | DI | #1 MSV / HPCV fully closed and TCS major trouble 2 | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 2 | I.0405 | TCS-DI1028 | DI | #1 CV & ICV full closed by PLU activation | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 2 | I.040D | TCS-DI1048 | DI | #1 MODBUS line-A duty | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 2 | I.040E | TCS-DI1049 | DI | #1 MODBUS line-B duty | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 2 | I.0410 | TCS-DI1039 | DI | #1 Turbine start-up ambient cold mode | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 2 | I.0411 | TCS-DI1040 | DI | #1 Turbine start-up cold 1 mode | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 2 | I.0412 | TCS-DI1041 | DI | #1 Turbine start-up cold 2 mode | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 2 | I.0416 | TCS-DI1055 | DI | #1 Turbine trip-2 | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 2 | I.0419 | TCS-DI1032 | DI | #1 Steam seal feed inlet valve closed | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 2 | I.041D | TCS-DI1050 | DI | #1 HP-CV full close | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 2 | I.089C | TCS-DI1057 | DI | #1 AMB. Cold mode temp. | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 2 | I.089D | TCS-DI1058 | DI | #1 Mode judgement instrument normal | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 2 | I.0939 | TCS-DI1052 | DI | #1 41 CLOSE | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 2 | I.093A | TCS-DI1053 | DI | #1 GEN. LOCK OUT RY86GA OPERATED | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 2 | I.093B | TCS-DI1054 | DI | #1 GEN. LOCK OUT RY86GB OPERATED | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |

### Bottom ash screw coolers (14)

Drawing: bottomash-limestone-logic.zip (HD600 BA-01 ~ 74) (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 3 | AI0804 | IT-L1060C | AI-Dry | #1 Bottom ash screw cooler-C current | E | twin IT-L1060A |
| 3 | I.0641 | MIR-L1060C | DI | #1 Bottom ash screw cooler-C reverse running | E | twin MIR-L1060A |
| 3 | I.0646 | LIS3-L1060C | DI | #1 Bottom ash screw cooler-C not local emergency stop command | E | twin LIS3-L1060A |
| 3 | I.0684 | LIS1-L1060D | DI | #1 Bottom ash screw cooler-D local reverse command | E | twin LIS1-L1060A |
| 3 | I.0685 | LIS2-L1060D | DI | #1 Bottom ash screw cooler-D not local stop command | E | twin LIS2-L1060A |
| 3 | I.0687 | LIS4-L1060D | DI | #1 Bottom ash screw cooler-D local forward command | E | twin LIS4-L1060A |
| 3 | O.020E | MOR-L1060B | DO-Dry | #1 Bottom ash screw cooler-B start / forward command | E | twin MOR-L1060A |
| 3 | O.020F | MOS-L1060B | DO-Dry | #1 Bottom ash screw cooler-B reverse command | E | twin MOS-L1060A |
| 3 | O.0296 | LOR-L1060B | DO-Wet | #1 Bottom ash screw cooler-B running (indicator lamp) | E | twin LOR-L1060A |
| 3 | O.0297 | LOS-L1060B | DO-Wet | #1 Bottom ash screw cooler-B stop (indicator lamp) | E | twin LOS-L1060A |
| 3 | O.060E | MOR-L1060D | DO-Dry | #1 Bottom ash screw cooler-D start / forward command | E | twin MOR-L1060A |
| 3 | O.060F | MOS-L1060D | DO-Dry | #1 Bottom ash screw cooler-D reverse command | E | twin MOS-L1060A |
| 3 | O.0616 | LOR-L1060D | DO-Wet | #1 Bottom ash screw cooler-D running (indicator lamp) | E | twin LOR-L1060A |
| 3 | O.0617 | LOS-L1060D | DO-Wet | #1 Bottom ash screw cooler-D stop (indicator lamp) | E | twin LOS-L1060A |

### DCS system diagnostics (FCS / SER / PDP alarms, buzzer) (14)

Drawing: DCS hardware wiring (dcs-hardware-wiring.zip) (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 1 | I.005F | 1023-SYSERR | DI | #1 FCS1023 alarm at DCS | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 2 | I.093C | SER1-SYSERR | DI | #1 SER1-System alarm | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 2 | I.093D | 1031-SYSERR | DI | #1 FCS1031 alarm at DCS | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 2 | I.093E | 1032-SYSERR | DI | #1 FCS1032 alarm at DCS | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 2 | I.093F | 1033-SYSERR | DI | #1 FCS1033 alarm at DCS | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 3 | I.069D | 1041-SYSERR | DI | #1 FCS1041 alarm at DCS | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 3 | I.069E | 1042-SYSERR | DI | #1 FCS1042 alarm at DCS | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 3 | I.069F | PDP-PLOSS | DI | #1 PDP power supply fault at DCS | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | I.057B | GCS10F-SYSERR | DI | #1 GCS10F alarm at DCS | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | I.057C | 1051-SYSERR | DI | FCS1051 alarm at DCS | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | I.057D | 1011-SYSERR | DI | #1 FCS1011 alarm at DCS | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | I.057E | 1012-SYSERR | DI | #1 FCS1012 alarm at DCS | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | I.057F | 1013-SYSERR | DI | #1 FCS1013 alarm at DCS | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | O.145F | BUZZER-OUT | DO-Dry | #1 BUZZER OUTPUT | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |

### Air dryers (13)

Drawing: P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 5 | AI0099 | FI-D0703B | AI-Dry | Plant air dryer-B outlet flow | E | twin FI-D0703A |
| 5 | AI0100 | FI-D0704B | AI-Dry | Instrument air dryer-B outlet flow | E | twin FI-D0704A |
| 5 | AI0115 | FI-D0703C | AI-Dry | Plant air dryer-C outlet flow | E | twin FI-D0703A |
| 5 | AI0116 | FI-D0704C | AI-Dry | Instrument air dryer-C outlet flow | E | twin FI-D0704A |
| 5 | I.009F | MIL-D0704C | DI | Instrument air dryer-C remote | E | twin MIL-D0704A |
| 5 | O.004C | MOR-D0703B | DO-Dry | Plant air dryer-B start command | E | twin MOR-D0703A |
| 5 | O.004D | MOS-D0703B | DO-Dry | Plant air dryer-B stop command | E | twin MOS-D0703A |
| 5 | O.004E | MOR-D0703C | DO-Dry | Plant air dryer-C start command | E | twin MOR-D0703A |
| 5 | O.004F | MOS-D0703C | DO-Dry | Plant air dryer-C stop command | E | twin MOS-D0703A |
| 5 | O.036C | MOR-D0704B | DO-Dry | Instrument air dryer-B start command | E | twin MOR-D0704A |
| 5 | O.036D | MOS-D0704B | DO-Dry | Instrument air dryer-B stop command | E | twin MOS-D0704A |
| 5 | O.036E | MOR-D0704C | DO-Dry | Instrument air dryer-C start command | E | twin MOR-C0704C |
| 5 | O.036F | MOS-D0704C | DO-Dry | Instrument air dryer-C stop command | E | twin MOS-D0704A |

### Flue gas / seal pots (10)

Drawing: P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 1 | AI0146 | PT-FG1009-A1 | AI-Wet | #1 Boiler cyclone-A seal pot fluidized pressure (1) | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 1 | AI0147 | PT-FG1009-B1 | AI-Wet | #1 Boiler cyclone-B seal pot fluidized pressure (1) | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 1 | AI0659 | TT-FG1092-A | AI-Wet | #1 Boiler cyclone-A inlet flue gas temperature | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 4 | AI0449 | TT-FG1102 | AI-Wet | #1 Reheater-2 inlet flue gas temperature | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 4 | AI0450 | TT-FG1108 | AI-Wet | #1 ECO. #2R inlet flue gas temperature | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 4 | AI0451 | TT-FG1111 | AI-Wet | #1 ECO. #2S inlet flue gas temperature | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 4 | AI0464 | TT-FG1104 | AI-Wet | #1 Reheater-3 inlet flue gas temperature | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 4 | AI0465 | TT-FG1106 | AI-Wet | #1 Reheater-4 inlet flue gas temperature | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 4 | AI0468 | TT-FG1109 | AI-Wet | #1 ECO. #3 lower inlet flue gas temperature | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 4 | AI0469 | TT-FG1105 | AI-Wet | #1 Finishing S/H-3 inlet flue gas temperature | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |

### Heater drain valves (10)

Drawing: P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 2 | AI0707 | ZT-HD1101-1 | AI-Wet | #1 NO.1 LPH primary drain level control valve position | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | AI0708 | ZT-HD1102-1 | AI-Wet | #1 NO.2 LPH primary drain level control valve position | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | AI0709 | ZT-HD1103-1 | AI-Wet | #1 NO.3 LPH primary drain level control valve position | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | AI0710 | ZT-HD1105-1 | AI-Wet | #1 NO.1 HPH primary drain level control valve position | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | AI0721 | ZT-HD1101-2 | AI-Wet | #1 NO.1 LPH alternate drain level control valve position | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | AI0722 | ZT-HD1102-2 | AI-Wet | #1 NO.2 LPH alternate drain level control valve position | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | AI0723 | ZT-HD1103-2 | AI-Wet | #1 NO.3 LPH alternate drain level control valve position | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | AI0724 | ZT-HD1106-1 | AI-Wet | #1 NO.2 HPH primary drain level control valve position | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | AI0725 | ZT-HD1105-2 | AI-Wet | #1 NO.1 HPH alternate drain level control valve position | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | AI0726 | ZT-HD1106-2 | AI-Wet | #1 NO.2 HPH alternate drain level control valve position | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |

### Generator panel / TCS analog inputs (9)

Drawing: generator panel GAE-2013-0136 / TCS I/O list (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 1 | AI0694 | GCP-AI1003 | PI | #1 Generator watt-hour | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 1 | AI0696 | GCP-AI1006 | PI | #1 Generator var-hour | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | AI0791 | TCS-AI1006 | AI-Dry | #1 GEN. current(A) | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | AI0807 | GCP-AI1005 | AI-Dry | #1 GEN. voltage (A\B) | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | AI0823 | TCS-AI1009 | AI-Dry | #1 GEN. power factor | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | AI0839 | TCS-AI1010 | AI-Dry | #1 GEN. frequency | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | AI0871 | TCS-AI1008 | AI-Dry | #1 GEN. voltage (B-C) | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | AI0887 | TCS-AI1011 | AI-Dry | #1 GEN. current(C) | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | AI0903 | TCS-AI1012 | AI-Dry | #1 GEN. voltage (C-A) | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |

### Generator / TCS analog outputs (9)

Drawing: generator panel GAE-2013-0136 / TCS I/O list (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 2 | AO0405 | TCS-AO1006 | AO | #1 Generator current (A) | E | twin TCS-DO1006 |
| 2 | AO0407 | TCS-AO1011 | AO | #1 Generator current (C) | E | DCS output with no driving sheet in the app: find the logic (drawing at right); the field device must answer it |
| 2 | AO0470 | GCP-AO1003 | AO | #1 Generator MVAR | E | DCS output with no driving sheet in the app: find the logic (drawing at right); the field device must answer it |
| 2 | AO0486 | GCP-AO1004 | AO | #1 Generator voltage (A-B) | E | DCS output with no driving sheet in the app: find the logic (drawing at right); the field device must answer it |
| 2 | AO0487 | GCP-AO1002 | AO | #1 Generator MW (D) | E | DCS output with no driving sheet in the app: find the logic (drawing at right); the field device must answer it |
| 3 | AO0582 | GCP-AO1005 | AO | #1 Generator voltage (B-C) | E | DCS output with no driving sheet in the app: find the logic (drawing at right); the field device must answer it |
| 3 | AO0583 | GCP-AO1006 | AO | #1 Generator voltage (C-A) | E | DCS output with no driving sheet in the app: find the logic (drawing at right); the field device must answer it |
| 3 | AO0886 | GCP-AO1007 | AO | #1 Generator power factor | E | DCS output with no driving sheet in the app: find the logic (drawing at right); the field device must answer it |
| 3 | AO0887 | GCP-AO1008 | AO | #1 Generator frequency | E | DCS output with no driving sheet in the app: find the logic (drawing at right); the field device must answer it |

### Compressor motor temperatures (9)

Drawing: P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 5 | AI0085 | TE-M0703-A1 | AI-Dry | Plant air compressor-A motor winding temperature (U phase) | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 5 | AI0086 | TE-M0703-A2 | AI-Dry | Plant air compressor-A motor winding temperature (V phase) | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 5 | AI0087 | TE-M0703-A3 | AI-Dry | Plant air compressor-A motor winding temperature (W phase) | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 5 | AI0101 | TE-M0703-B1 | AI-Dry | Plant air compressor-B motor winding temperature (U phase) | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 5 | AI0102 | TE-M0703-B2 | AI-Dry | Plant air compressor-B motor winding temperature (V phase) | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 5 | AI0103 | TE-M0703-B3 | AI-Dry | Plant air compressor-B motor winding temperature (W phase) | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 5 | AI0117 | TE-M0703-C1 | AI-Dry | Plant air compressor-C motor winding temperature (U phase) | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 5 | AI0118 | TE-M0703-C2 | AI-Dry | Plant air compressor-C motor winding temperature (V phase) | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 5 | AI0119 | TE-M0703-C3 | AI-Dry | Plant air compressor-C motor winding temperature (W phase) | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |

### Main steam valves (7)

Drawing: P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 1 | AI0179 | ZT-MS1001 | AI-Wet | #1 Boiler main steam blow off pressure control valve position | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | AI0736 | ZT-MS1391 | AI-Wet | #1 Main steam line motor valve position | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | I.032E | TS-MS1391 | DI | #1 Main steam line motor valve torque | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 2 | I.0333 | MIL-MS1392 | DI | #1 Main steam bypass motor valve remote | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 2 | I.0334 | TS-MS1392 | DI | #1 Main steam bypass motor valve torque | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 2 | O.016C | MOR-MS1392 | DO-Dry | #1 Main steam bypass motor valve open command | E | DCS output with no driving sheet in the app: find the logic (drawing at right); the field device must answer it |
| 2 | O.016D | MOS-MS1392 | DO-Dry | #1 Main steam bypass motor valve close command | E | DCS output with no driving sheet in the app: find the logic (drawing at right); the field device must answer it |

### Lube oil (BFWP-B, PAF) (7)

Drawing: P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 3 | I.0410 | PS-LO1115-B1 | DI | #1 Lube oil of BFWP-B pressure switch (1) ( < 1.5Kg/cm2 ) | E | twin PS-LO1115-A1 |
| 3 | I.0411 | PS-LO1115-B2 | DI | #1 Lube oil of BFWP-B pressure switch (2) ( > 2.0Kg/cm2 ) | E | twin PS-LO1115-A2 |
| 3 | I.065B | MIA-LO1753-1 | DI | #1 PAF circulating oil system control power auxiliary switch off | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.065C | MIA-LO1753-2 | DI | #1 PAF circulating oil system NFB2 auxiliary switch not off | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.065D | MIA-LO1753-3 | DI | #1 PAF circulating oil system NFB1 auxiliary switch not off | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.0699 | LSLL-LO1753 | DI | #1 PAF lube oil tank level low low | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | O.044F | MOR-LO1753-B | DO-Dry | #1 LOP B of PAF start command | E | twin MOR-LO1753-A |

### Coal feeder air tanks (7)

Drawing: P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 4 | AI0470 | PT-IA1064-B | AI-Wet | #1 Air buffer tank of biasing damper-B pressure | E | twin PT-IA1064-A |
| 4 | I.013E | PS-IA1061-A1 | DI | #1 Coal feeder-A air tank pressure switch high | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 4 | I.013F | PS-IA1061-A2 | DI | #1 Coal feeder-A air tank pressure switch low | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 4 | I.045E | PS-IA1061-B1 | DI | #1 Coal feeder-B air tank pressure switch high | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 4 | I.045F | PS-IA1061-B2 | DI | #1 Coal feeder-B air tank pressure switch low | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 4 | I.049E | PS-IA1061-C1 | DI | #1 Coal feeder-C air tank pressure switch high | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 4 | I.049F | PS-IA1061-C2 | DI | #1 Coal feeder-C air tank pressure switch low | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |

### Dosing pumps (7)

Drawing: P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 1 | I.0121 | MIT-Z1107A | DI | #1 Tri-sodium phosphate dosing pump-A trip | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 1 | I.0123 | MIT-Z1107B | DI | #1 Tri-sodium phosphate dosing pump-B trip | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 1 | I.0129 | MIT-Z1109A | DI | #1 Carbon hydraride dosing pump-A trip | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 1 | I.012B | MIT-Z1109B | DI | #1 Carbon hydraride dosing pump-B trip | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 1 | I.012D | MIT-Z1101A | DI | #1 Tri-sodium phosphate agitator trip | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 1 | I.012E | SIA-CDS01 | DI | #1 Dosing system AC mian power normal | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 5 | I.032F | MIA-HC0001 | DI | Hypo-chlorinated dosing system AC main power not fail | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |

### Chemical tanks (6)

Drawing: P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 1 | I.0133 | LSLL-CH1103 | DI | #1 Neutral amine solution tank level switch low low | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 1 | I.0134 | LSL-CH1103 | DI | #1 Neutral amine solution tank level switch low | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 1 | I.0135 | LSH-CH1103 | DI | #1 Neutral amine solution tank level switch high | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 1 | I.0136 | LSLL-CH1105 | DI | #1 Carbon hydraride solution tank level switch low low | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 1 | I.0137 | LSL-CH1105 | DI | #1 Carbon hydraride solution tank level switch low | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 1 | I.0138 | LSH-CH1105 | DI | #1 Carbon hydraride solution tank level switch high | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |

### Sea water (6)

Drawing: P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 2 | AI0800 | PT-SW1110-B1 | AI-Wet | #1 Condenser inlet seawater pressure(B) | E | twin PT-SW1110-A1 |
| 2 | AI0801 | PT-SW1110-B2 | AI-Wet | #1 Condenser outlet seawater pressure(B) | E | twin PT-SW1110-A2 |
| 2 | AI0933 | TT-SW1110-B1 | AI-Wet | #1 Condenser inlet seawater temperature (B) | E | twin TT-SW1110-A1 |
| 2 | AI0934 | TT-SW1110-B2 | AI-Wet | #1 Condenser outlet seawater temperature (B) | E | twin TT-SW1110-A2 |
| 3 | AI0736 | TT-SW1501-BU | AI-Wet | #1 Seawater pump-B motor winding temperature (U phase) | E | twin TT-SW1501-AU |
| 3 | AI0758 | VT-SW1501-C2 | AI-Wet | #1 Seawater pump-C motor bearing vibration (2) | E | twin VT-SW1501-A2 |

### Bottom ash cooler inlet valves (6)

Drawing: bottomash-limestone-logic.zip (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 3 | I.053B | ZSO-BH1060-B | DI | #1 Bottom ash cooler (B) inlet valve open position switch | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.053C | ZSC-BH1060-B | DI | #1 Bottom ash cooler (B) inlet valve close position switch | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.064B | ZSO-BH1060-C | DI | #1 Bottom ash cooler (C) inlet valve open position switch | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.064C | ZSC-BH1060-C | DI | #1 Bottom ash cooler (C) inlet valve close position switch | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.068B | ZSO-BH1060-D | DI | #1 Bottom ash cooler (D) inlet valve open position switch | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.068C | ZSC-BH1060-D | DI | #1 Bottom ash cooler (D) inlet valve close position switch | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |

### Air compressors (5)

Drawing: P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 5 | AI0195 | IT-C0703B | AI-Dry | Plant air compressor-B current | E | twin IT-C0703A |
| 5 | AI0211 | IT-C0703C | AI-Dry | Plant air compressor-C current | E | twin IT-C0703A |
| 5 | AI0212 | IT-C0704C | AI-Dry | Instrument air compressor-C current | E | twin IT-C0704A |
| 5 | I.0333 | MIV-C0703C1 | DI | Plant air compressor-C VCB on | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 5 | I.0334 | MIV-C0703C2 | DI | Plant air compressor-C VCB off | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |

### Fly ash PLC alarms (4)

Drawing: fly ash PLC: vendor panel, alarms only (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 3 | I.057B | XA-FH1701 | DI | #1 Fly ash common alarm | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.057C | XA-FH1702 | DI | #1 Fly ash PLC fault alarm | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.057D | XA-FH1703 | DI | #1 Fly ash communication fault alarm | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 3 | I.057E | XA-FH1704 | DI | #1 Fly ash main control panel no power alarm | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |

### Blowdown valves (3)

Drawing: P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 1 | AI0177 | ZT-BD1001 | AI-Wet | #1 Mass blow down motor valve position | E | twin ZT-CD1001 |
| 1 | AI0178 | ZT-BD1002 | AI-Wet | #1 Continuous blow down motor valve position | E | twin ZT-CD1002 |
| 1 | O.0212 | MOR-BD1002 | DO-Dry | #1 Continuous blow down motor valve open command | E | twin MOR-CD1002 |

### Cooling water switches (3)

Drawing: P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 2 | AI0705 | ZT-CW1201 | AI-Wet | #1 Turbine lube oil temperature control valve position | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 3 | I.053A | FS-CW1060-B2 | DI | #1 Boiler bottom ash cooler-B shaft outlet cooling water flow switch low | E | twin FS-CW1060-A2 |
| 3 | I.064A | FS-CW1060-C2 | DI | #1 Boiler bottom ash cooler-C shaft outlet cooling water flow switch low | E | twin FS-CW1060-A2 |

### Annunciator (3)

Drawing: DCS hardware wiring (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 4 | I.1281 | ANN-TEST | DI | #1 ANN-TEST | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | I.1282 | ANN-ACK | DI | #1 ANN-ACK | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |
| 4 | I.1283 | ANN-RESET | DI | #1 Not ANN-RESET | U | annunciator / DCS system point: show on the alarm panel (no plant physics) |

### Sootblower steam supply (2)

Drawing: sand-sootblower-logic.zip DITL-80x (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 2 | AI0770 | ZT-SB1001 | AI-Wet | #1 Sootblower steam supply motor valve position | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 2 | I.024B | ZSC-SB1001 | DI | #1 Sootblower steam supply motor valve close | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |

### Cold reheat drain pot (2)

Drawing: P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 2 | I.0292 | LS-CR1003-1 | DI | #1 Cold reheat drain pot DP-CR03 level switch high (not used) | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |
| 2 | I.0293 | LS-CR1003-2 | DI | #1 Cold reheat drain pot DP-CR03 level switch high high (not used) | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |

### Aux / gland steam (2)

Drawing: P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 2 | AO0404 | TCS-AS1004 | AO | #1 Aux. steam header pressure (lower) | E | DCS output with no driving sheet in the app: find the logic (drawing at right); the field device must answer it |
| 2 | AO0471 | TT-AS1017-1 | AO | #1 Gland steam turbine side temperature | E | DCS output with no driving sheet in the app: find the logic (drawing at right); the field device must answer it |

### Make-up water (2)

Drawing: P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 2 | AI0693 | ZT-MU1110 | AI-Wet | #1 Condenser make-up water level control valve position | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |
| 5 | AI0064 | FT-MU0001 | AI-Wet | Phase 1 make-up water flow | E+U | field measurement: the plant model gives the value (engine), the page shows it (UI) |

### FA blower (2)

Drawing: P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 3 | O.0452 | MOP-F1055B | DO-Dry | #1 FA Blower-B start permission signal | E | twin MOP-F1055A |
| 3 | O.0453 | MOT-F1055B | DO-Dry | #1 FA Blower-B trip command | E | twin MOT-F1055A |

### Industrial water (2)

Drawing: P&ID K1AU3-A1-0-001 + DCS I/O list; motor DITL of the twin if any (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 5 | AI0242 | DPT-IW0715-B | AI-Wet | Industrial water pump-B suction strainer diff. pressure | E | twin DPT-IW0715-A |
| 5 | I.001F | LS-IW0714 | DI | Industrial water tank level switch low | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |

### Flue gas CEMS (1)

Drawing: CEMS vendor panel, alarm only (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 1 | I.001F | LI1-FG1057 | DI | #1 CEMS common alarm | E+U | field status / switch: the plant model sets it (engine), the page shows it (UI) |

### Generator trip (1)

Drawing: Hitachi generator protection / breaker logic 310SD03-743 (PC)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 2 | O.045F | MIT-GENS | DO-Dry | #1 Generator trip | E | generator trip output to the TCS: drive it from the generator protection (310SD03-743) in the engine |

### Turbine emergency trip push button (1)

Drawing: IBD trip sheets / TCE (TCS)

| Stn | Address | Tag | Type | Description | Side | Why / twin |
|---|---|---|---|---|---|---|
| 4 | I.1280 | TBN-TRIP-OPC | DI | #1 Turbine emergency trip P.B. on (OPC) | E+U | turbine emergency trip push button of the operator console: the TCS trip must take it (engine), the console shows it (UI) |

