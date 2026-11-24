# LMYP OTS 1.0.0-beta.459 (AUDIT FIX : SORA, lane 9, 2026-11-25)

Sumunod sa beta.422. Annunciator lang (src/station/station.js). Walang pagbabago sa logic, sa plant model at sa ibang page.

## Ano ang bago

| # | Nakikita ng operator | Detalye | Pinagmulan |
|---|---|---|---|
| 1 | Gumagana na ang window A5 (A-FA BLOWER STOPPED) at A6 (B-FA BLOWER STOPPED) ng annunciator | Ang address text ng drawing ("S4 O.1324/1325") ay ibinibigay na lang sa pinakamalapit na output row na papunta sa OPC (ANN). Dati ay napupunta ito sa row 29, na 2.35 unit ang layo pero walang annunciator output, imbes na sa row 28 (FAB A STOPPED, 4.92 unit ang layo). Kaya madilim ang A5 at A6. Ngayon: A5 = DITL-28A output row 28, A6 = DITL-28A #B output row 28 | DITL-28A row 28; ANP1PB-03 legend; DCS I/O list O.1324 / O.1325 |

## Sinubok (headless, station page sa 150 MW)

- Windows na may signal: 74 sa 79 bago, **76 sa 79** pagkatapos. Pareho ang source ng ibang 74 (ikinumpara ang title ng bawat window bago at pagkatapos: A5 at A6 lang ang nagbago).
- `node tests/regress/ann_rows.cjs`: 4 PASS (bagong test).
- `node tests/regress/station_annunciator.js`: ALL PASS (H1 sequence, Test 79 sa 79, walang page error).

## Hindi sinubok / natitira

- G2 / G3 / G4 (B / C / D bottom ash screw cooler stopped) ay madilim pa. Ang DITL-21D row 22 ay iisang row para sa 4 na cooler: AND ng common net at ng input "21A-70" ng bawat cooler, at ang output ay O.137C / 137D / 137E / 137F at M.3319 ~ 331C. Kailangan ng row-level unit sa world.js, na hawak ng integrator. Ang buong-sheet na kopya ay mali dahil ang DITL-21D ay common sheet ng lahat ng cooler.

## Susunod

Ang row-level unit ng DITL-21D row 22 (integrator).
