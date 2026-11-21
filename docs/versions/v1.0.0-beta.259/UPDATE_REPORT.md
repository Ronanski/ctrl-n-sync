# v1.0.0-beta.259 Update report

## Changed
- Audit 3 #8 in the Operator view: the controller faceplate (for example the Coal master) now has the same frame as the small faceplate of the measurements and motors. It is 236 px wide (was 268 px), its row labels are 11 px (were 10 px), and its tag strip is a plain line of grey text instead of a green band (src/ui/shellc/shellc-compact.css). Beta.249 only changed the station view.

## Tested
- Build, build --check, version-check, operator-text-check.
- Real-click test of beta.249 and beta.253 (2026-11-22): 30 of 30 sootblowers open their own faceplate with the right DITL sheet; all 21 HX pages have every machine and valve linked; Engineer opens on a sheet and TCA532 finds the TCS-TCA-53x sheets; Purge and Unit overview pages are filled.
- This change waits for its real-click retest when the PC is free.

## Findings
- From the real-click test: the controller faceplate in the Operator view still had the old look (fixed here).
