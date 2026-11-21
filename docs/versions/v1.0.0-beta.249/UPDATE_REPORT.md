# v1.0.0-beta.249 Update report

## Changed
- Audit 3 #8, one faceplate look: the controller faceplate (61 items) now uses the frame of the small faceplate of the measurements and motors: 236 px wide, steel edge, 3 px corners, blue title band, 13 px title, 20 px close mark, 22 px buttons, 11 px row labels (src/station/station.css).
- Audit 3 #6: the Light paper drawing colours are removed (theme.js list, theme.css and app.css rules). A saved Light paper choice opens as Dark.

## Checked in the code (no change needed here)
- #9, #14, #16, #20 were coded in the earlier Audit 3 batch (11 px floor and Furnace at 1280, click areas and popups placed off their item, TCA532 search and first sheet, Purge page and load demand words). They still need the real-click proof.
- #6, the 21 hmi-mock files: no old HMI page can be opened by the user any more. The files are the hidden resolver the HX pages click through for every valve, Y / N square and faceplate (hx-app.js pq / open). Deleting them would break every faceplate, so they stay until their maps are moved into the HX pages.

## Tested
- Build, build --check, version-check, operator-text-check.
- Real-click test waits for the PC.

## Findings
- None new.
