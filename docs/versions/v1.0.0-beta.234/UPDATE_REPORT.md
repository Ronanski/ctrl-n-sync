# LMYP OTS 1.0.0-beta.234

21 Nov 2026. HMI fixes from Full Audit 3 (Rosé).

## Changed

| Area | What changed for the operator |
|---|---|
| Sootblowers | The steam supply valve MV-SB1001 and the sootblower sequence open their faceplates from the Process view; each blower label opens its faceplate |
| Sootblowers | Blower START / RETRACT now press the control room push buttons of the drawing: DITL-80M rows 2 / 7 (N-1011), row 4 (N-1012), the blower's own copy of DITL-80G rows 5 / 10 (N-1013 ~ N-1038), DITL-80M rows 5 / 8 (air preheater). Before, START wrote the AUTO program step DITL-80A M.4011 |
| All realistic pages | The drawing keeps at least 0.8 scale on the screen (1400 px minimum, more when the window or the open page menu makes the frame smaller); the page scrolls instead of words crossing each other at 1280 |
| Faceplates | A long name in the faceplate head wraps as a line, not one word per line |
| Sootblowers | The blower faceplate STATUS shows OPERATING while the lance is out (DITL-80G row 11 retract limit ZSR-N1011 off), also in MANUAL. Before, it read only the AUTO program lamp DITL-80A out 25, so a manual run showed STOPPED |
| Interlock squares | Y / N squares grow with their letter |
| Feedwater | Split-range notes at TCV-FW1110-1 and -2 |

## Tested

Real clicks at 150 MW, 1280 x 800: MV-SB1001 OPEN opened the valve; the sequence AUTO MODE + SEQUENCE START ran N-1011; in MANUAL, N-1011 START reached DITL-80M row 2 → 80M out 2 (2 s pulse) → DITL-80G row 5 REMOTE START COMMAND; with the drains heated (PICSB1052 at 20 %, blowing permissive on) the lance ran out at 2.1 A and the faceplate showed OPERATING; RETRACT ran the backward motor until the retract limit, then STOPPED. Feedwater at 1280: the drawing stays at 0.80 scale with the page menu open.

## Not tested / open

The red blower tags on the Sootblowers page still read the AUTO program lamp, so a manual run does not turn the tag red. Typing a value and Enter in the PICSB1052 output box does nothing (the ▲▲ buttons work). The mouse wheel over a drawing zooms instead of scrolling the page. Cold start-up and load changes were not run for this version.
