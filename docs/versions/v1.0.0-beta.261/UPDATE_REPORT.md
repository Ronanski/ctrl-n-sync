# v1.0.0-beta.261 Update report

## Changed
- Audit 3 #8, one faceplate look: the title of the controller faceplate in the Operator view now shows the name the page gives the loop first (for example "Coal master") and its tag under it in small grey numbers (HS-COAL), the same order as the small faceplate of the measurements and motors. A loop with no name on its page keeps the tag as its title (src/ui/plant/plant.js, src/ui/shellc/shellc-compact.css).

## Tested
- Build, build --check, version-check, operator-text-check.
- Real-click retest of beta.259 (2026-11-22): the Coal master faceplate in the Operator view is 236 px, 11 px labels, grey tag line, nothing overflows.
- This change waits for its real-click retest when the PC is free.

## Findings
- None new.
