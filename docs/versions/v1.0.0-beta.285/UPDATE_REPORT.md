# v1.0.0-beta.285 (Rosé): Whole sheet shows the DESIGN BASE table (UI audit D2), and proof of the frame bugs

## Fix
UI audit D2: in Engineer, ABC-001A opened with the top of the sheet cut. The DESIGN BASE (100 % LOAD) table at the upper right of every ABC sheet is drawn by the app (it is not in the DXF), but Fit and Whole sheet measured the DXF parts only. On ABC-001A the table sat above the view (8 texts, y -185 px at 1920).
`src/analog/ui/links-canvas.js`: when the table is drawn, its box is added to the sheet extent (`sh.bb`), which both Fit paths use (`fitView`, `src/ui/shell/view.js`).

## Proof (station build, 150 MW, mouse clicks, headless at 1920x1080 and 1280x800)
The browser pane was hidden (the user was away), so the clicks ran in a headless Chrome with screenshots. Visible real-click checks still wait for the user.

| Bug | Check | 1920 | 1280 |
|---|---|---|---|
| D1 | click a wire on ABC-000: Signal popup open, Readable and Whole sheet still free | PASS | PASS |
| D2 | ABC-001A: texts inside the view (before: 94 %) | PASS 100 % | PASS 100 % |
| D3 | search "zzzz": "No sheet found." | PASS | PASS |
| D4 | TCS-15 title tooltip: name · title · description | PASS | PASS |
| D5 | 29 sidebar group names on one line, full name on hover | PASS | PASS |
| D6 | Instructor buttons keep their text inside the panel | PASS | PASS |
| D7 | Instructor after loading 150 MW: no "18 of 18 steps done" | PASS | PASS |
| D8 | Generator panel at 150 MW: Close 52G and Close 41 off, Open 41 on | PASS | PASS |
| D9 | alarm line opens the list, a press on the plant closes it | PASS | PASS |
| D10 | under First out the plant page is inert and hidden; back on the overview it is live | PASS | PASS |
| A4 | faceplates of Air heater, BFWP-A, FA blower B, SWP-C, MV-BD1001 cover 0 % of the clicked item | PASS | PASS |

Checks: `build.js --check` SAME, version check, operator text check.
