# Phase 11 part 7+8 (SUZU), fix 17: walang snapshot, trend o SOP sa plant model (user rule 0, 2026-11-28 5:18 AM PHT)

Binago (cooling.js, unit.js aux steam / gland / air / chemical / sootblower / motor temps, boiler.js diesel oil, pkg.js CTCS, mga test):
- Sootblower drain TT-SB1056 / 1057: kapag sarado ang MV-SB1001, lumalamig papuntang ambient (first principles: walang steam sa likod ng saradong MOV). Dati 107 / 105 C na basa sa planta, scaled sa boiler water.
- Gland steam header set point: 1.31 kg/cm2 A = 0.277 G (PV-GS1031 valve sheet NOR outlet). Dati 0.32 na basa sa planta.
- Chemical pH target 9.0: gitna ng FHI 2-8-TAB_3 (8.8 ~ 9.2), hindi na SOP.
- Debris filter backwash 80 mbar: vendor O&M L18-4 p36, hindi na SOP.
- Binura ang lahat ng paghahambing sa planta sa mga komento at test (as_page_values: gland check ay set point + superheat physics na; sootblower test: drains = ambient physics).
- Ang mga value na wala pang design source ay naka-marka sa code na SNAPSHOT-TO-REPLACE (hindi na binabanggit ang picture o SOP): SWP soft-start 500 A; SWBP current point 90 A; seawater line point (forebay -4 m, water box 1.05, condenser drop 0.4, SWBP 2.35 kg/cm2); make-up strainer 0.03 at demi tank level; expansion tank fill 6 kg/cm2 at NL 1.7 m; ACW strainer 0.27; aux header UA3 at gland pipe G17; MV-AS1011 40 % (dapat galing sa TCS warming logic); plant air 7.0 kg/cm2; diesel oil strainer 0.029 at tank level 4.978 m.

Sinubok (headless): 150 MW 20 min walang trip (MW 150.9, gland 0.277 kg/cm2); as_page_values ALL PASS; sootblower lane test (tingnan ang PR); no-fit, one-path, u-const, ports PASS.
Hindi sinubok: live app. Ang regress tests na hindi sa Checks (mu_ccw_model, lube_oil, diesel_oil, air_model, ashcool, bottom_ash, chem_page, field_valves) ay may lumang paghahambing pa sa planta: susunod na slice.
Kailangan ng basa (YUA): MB-020 header pressures, condenser D1-0-039 water side drop, intake forebay civil level, strainer sheets (MU, ACW, DO), Solcon SWP starter current limit, SWBP motor load curve, D1-0-059 compressor set pressure, line insulation spec, TCS MV-AS1011 warming opening.
