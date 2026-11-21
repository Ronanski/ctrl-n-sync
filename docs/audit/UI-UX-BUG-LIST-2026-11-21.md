# LMYP OTS v1.0.0-beta.232: UI / UX / graphics bug list (audit, 2026-11-21)

Phase mapping (AUDIT : FULL APP plan): A, B1, B4, B5, C = Phase 2 (values) and Phase 6 (HMI pages, Jennie); D7 Instructor = Phase 1 (removed); D1-D6, D8-D10, A4 = Phase 6 frame (Rosé).

Method: headless Chrome, used like an operator, engineer and instructor at 1920x1080 and 1280x800, with video.
State 150 MW, simulation running. Nothing was fixed (merge freeze). Owner: R = Rosé (station frame), J = Jennie (HX plant pages, engine).
Evidence (pictures, logs, videos; too big for the repo) is kept on the team PC in Rosé's audit scratch folder ux/. Each fix PR re-measures its own items.
(pg-1920-*.png / pg-1280-* = page pictures, c61/c62/v63-v66 *.log = measured results, video-1920, video-1280, video62-1920, video62-1280, video64, video66 = recordings.)
Standards: ISA-101 (HMI), ISA-18.2 (alarms), WCAG 2.2 (size, contrast), Nielsen heuristics.

## A. Clicks that do nothing or are hard to hit (operator)

| # | Bug | Repeat | Evidence | Owner | Sev |
|---|---|---|---|---|---|
| A1 | 174 items show the hand cursor but a click does nothing: every measurement tag (pressure, temperature, flow, level, current, power), also Strainer, Condenser tube cleaning A/B, Hot primary/secondary air, Generator frequency/energy/vibration/stator coils. Operator expects a trend or a detail. | Any page, click a value such as "Header pressure" | v63.log (lines "NOTHING") | J | Major |
| A2 | Red "Y" badge beside pumps/fans: hand cursor, no tooltip, a click opens nothing. Meaning of Y is not explained on screen (old #59 still open). | Feedwater, click the Y beside BFWP-A | v66.log, v66-y.png | J | Major |
| A3 | 13 valves/pumps answer on less than 25 % of their own box; the drawing layer (svg.hx-real) sits over the rest, so a normal click on the symbol often does nothing. MV-BD1001/1002, V-BD1005~1021, Main steam stop, Main steam to aux, PICAS1005, Steam seal feed, Aux Condenser, MV-TS1003, Extraction 1/2 valve, MV-MU1001, ACWP-A. | Drum page, click the middle of MV-BD1001 | v65.log | J | Major |
| A4 | 12 faceplates open on top of the item that was clicked (cannot see the symbol while operating it): AIR PREHEATER, BFWP-A (overview), COAL FEEDER A (limestone page), FA BLOWER-B, PAF (purge), TICBR1130, SWP-C, SWBP-B, MV-BD1001/1002, main stop valve. | Combustion air, click FA BLOWER-B | c61-1920.log "coversItem":true | R (faceplate placement) | Minor |

## B. Values missing or wrong on screen

| # | Bug | Where | Evidence | Owner | Sev |
|---|---|---|---|---|---|
| B1 | "-----" (no value) at 150 MW on many tags: coal bunker A/B/C level, feeder total; PT-FA1078, TT-FA1073/74, TT-FA1083/84; PT-HR1001, TT-MS1007, after-bypass pressure, PT-ST1002; panel 1 in/out, PT-BR1130/1150, economizer 1/2/3 outlet; furnace pressure 3, plenum and bed dP, stack O2/NOx/CO/opacity/dust; seal pot pressures; burner flame; sampling conductivity/silica; condenser tube cleaning; sootblower system current. | Coal, Combustion air, Reheat, Drum, Furnace, Sampling, Sootblowers | pg-1920-*.png | J | Major |
| B2 | Value and "%" overlap when the value is 100.0: "100.0%" glyphs collide in the fixed box. | Condensate polisher bypass, Diesel supply valve, Furnace fan inlet damper | pg-1920-Condensate.png, -Diesel..., -Furnace... | J | Minor |
| B3 | Controller box: the PV number runs into the "SET POINT" label. | Coal (boiler pressure 122.3), Ash (1483), Diesel oil master, Furnace O2 | pg-1920-Coal..., -Ash... | J | Minor |
| B4 | Ash coolers: all in/out temperatures 38 °C and all 4 coolers stopped at 150 MW; screw speed 0.0 with set point 0.6 rpm. Looks like no ash flow model. | Ash and precipitator | pg-1920-Ash_and_precipitator.png | J (engine) | Check |
| B5 | Sea water pump discharge pressure not shown anywhere (old #35 still open). | Circulating sea water | v64.log | J | Minor |

## C. Labels, overlaps, layout (plant pages)

| # | Bug | Where | Evidence | Owner | Sev |
|---|---|---|---|---|---|
| C1 | Labels and tags sit on pipes or are crossed by lines: V-FW1009..1013, start-up feedwater valve; air heater / "Running"; outlet valve B; PT-FA1075; condensate pump A state line; level labels on tanks; "AUXILIARY STEAM HEADER" first letter cut by a pipe; debris filter; inlet/outlet temperature A/B on sea water; drain separator; vibrating screens; bucket elevator. | Feedwater, Combustion air, Condensate, Sea water, Aux steam, Ash | pg-1920-*.png | J | Minor |
| C2 | Text runs into other text: two "flash chamber" labels stacked (Reheat); "Turbine exhaust pressure" into "Extraction 1 shut-off valve"; "Make-up pump A/C" under the V-MU0007 / V-MU0011 boxes; "Dispensing vessel" into a pipe; "Finishing superheater" / "REHEATER PASS" over tube art; "Oxygen control" tag under its title. | Reheat, Extraction, Make-up, Coal, Drum, Furnace | pg-1920-*.png | J | Minor |
| C3 | "Furnace purge start" panel is cut at the left edge ("ırnace purge start", "en push button"). | Purge and trip | pg-1920-Purge_and_trip.png | J | Major |
| C4 | Empty sections: heading "BREAKER STATUS AND PROTECTION · Y = true" (Generator) and "SEQUENCE, PERMISSIVES, ALARMS" (Sootblowers) have nothing under them. "Y = true" is code wording. | Generator, Sootblowers | v64.log, pg-1920-Generator.png, -Sootblowers.png | J | Major |
| C5 | Sootblowers: legend says "Red tag = blower is blowing" but no blower tags are drawn; steam line has a gap near the top; an unconnected bracket at left. | Sootblowers | pg-1920-Sootblowers.png | J | Minor |
| C6 | Valves show "Running" (Steam seal feed valve, Exhaust hood spray valve) instead of Open/Closed; Steam seal feed shows "Running" and "Position 0.0 %" together. | Aux steam | pg-1920-Auxiliary... | J | Minor |
| C7 | Inconsistent buttons on pages: "HYDRAULIC CONTROL" filled blue next to dark "DAMPER CONTROL" (and it overlaps the precipitator); "NOT USE" filled blue under "OIL MASTER USE"; duplicate name "Burner A / Burner A". | Furnace, Diesel | pg-1920-Furnace..., -Diesel... | J | Minor |
| C8 | Names wrap with one character on a line: "Low pressure heater / 2", "Closed cooling pump / A", "Hypochlorite dosing pump / A"; overview "Unit load demand, MW" wraps. | Extraction, Make-up, Sea water, Overview | pg-1920-*.png | J | Minor |
| C9 | Big empty areas on most pages (drawing uses 50-60 % of the screen); Purge page links grouped far bottom-right away from the drawing; Sampling middle third empty; Chiller unit floating with no line. | Most pages | pg-1920-*.png | J | Minor |
| C10 | Tablet 1280x800: plant drawing text about 7-8 px, too small to read (Reheat, Drum, Feedwater). | All HX pages at 1280 | pg-1280-*.png | J + R | Major |

## D. Station frame (operator, engineer, instructor)

| # | Bug | Repeat | Evidence | Owner | Sev |
|---|---|---|---|---|---|
| D1 | Engineer: the Signal popup opens top-right exactly over the sheet toolbar (Back, -, +, Readable, Whole sheet). While it is open those buttons cannot be pressed. | Engineer > Analog > ABC-000, click a wire, then press "Whole sheet" | c62-1920.log "BLOCKED", "signalOverToolbar":true; eng-1920-ABC_001A.png; video62-1920 | R | Major |
| D2 | Engineer: some sheets open at a wrong view: ABC-001A shows 2/3 empty dark space and the drawing cut at the bottom and right edge. | Engineer > Analog > ABC-001A | eng-1920-ABC_001A.png | R | Major |
| D3 | Engineer: a search with no result shows an empty list with no "No sheet found" text. | Find a sheet: "zzzz" | c62 logs "EMPTY SEARCH", eng-*-empty-*.png | R | Minor |
| D4 | Engineer: sheet title and description are joined with no space in the title text ("...FOR MOTORTypical motor logic"); on screen the description line is cut with "…" and cannot be read in full. | Turbine > TCS-15, TCS-TCA-500 | c62 logs, ins-1280.png (header) | R | Minor |
| D5 | Engineer sidebar at 1280: group names wrap to 2-3 lines in capitals ("GOVERNOR SPEED / CONTROL"), list becomes long. | Engineer > Turbine at 1280 | ins-1280.png | R | Minor |
| D6 | Instructor at 1280: fault button text runs past the panel edge ("Coal feeder A discharge chute plugged (no coal to the furnace)"). | Instructor at 1280x800 | ins-1280.png | R | Minor |
| D7 | Instructor: "TRAINEE SCORE 100.0 of 100 · 18 of 18 steps done" right after loading 150 MW, before the trainee did anything. Misleading. | Load 150 MW, open Instructor | c62 logs INSTRUCTOR | R | Major |
| D8 | Generator panel: buttons stay active for the state the plant is already in ("Close 52G", "Close 41" while closed); 60 % of the page is empty below the cards; big monospace numbers next to sans text. | Generator panel | pg-1920-Generator_panel.png | R | Minor |
| D9 | Alarm list popup does not close on a click outside (Escape and ✕ work). The alarm line square opens the list but does not look like a button. | Click "Alarm list", click the plant | v66.log | R | Minor |
| D10 | Station frame pages (First out, Generator panel) keep the previous HX page alive under the frame (hidden faceplate targets under a DIV); no user effect seen but it is extra DOM and can catch clicks. | Open First out and events | v63.log "covered by station", v65.log | R | Check |

## E. Old findings re-checked

| Old # | Result |
|---|---|
| #14 motor faceplate partial | FIXED: status, selector REMOTE/LOCAL/FIELD, mode AUTO/MAN, START/STOP, trend, rule text (v64.log BFWP-A) |
| #23 expansion tank no OPEN/CLOSE | FIXED: XV-MU1109 faceplate with AUTO/MAN, OPEN/CLOSE and the 40 % / 85 % rule; V-MU1033 local valve faceplate (v64.log) |
| #29 dock too long, #30 stage name twice, #33 dock pop-out top-left, #38 banner | Not applicable: the new frame has no Training dock. |
| #35 SWP discharge pressure | STILL OPEN (B5) |
| #59 two faceplates / Y button | STILL OPEN: Y badge drawn but does nothing (A2) |

## F. Working well (measured)

0 JS errors on all runs. Page switch 1.3-1.8 s. Faceplates open in 30-160 ms, never off-screen, values live. MAN to AUTO mode press works. Faceplate stays on screen after a resize 1920 to 1280. Alarm list opens, Escape closes it. Engineer sheets open in 70-1000 ms. Instructor closes by Escape and ✕. No theme switch exists in the new frame (dark only), so theme could not be tested.
