# LMYP OTS 1.0.0-beta.373 (HMI : ROSÉ, 2026-11-24)

Sumunod sa beta.372. Tinapos ang natitirang label fixes mula sa HMI approval page (https://claude.ai/artifact/YCAQwvCn7cVwfzVYNjX5Wn) at isang bug sa station na nakita sa mga bagong screenshot. Walang binagong value o logic.

## Mga ayos

| Dati | Ngayon | File |
|---|---|---|
| Generator: may maliit na pin sa ilalim ng bawat value sa table, walang tinuturo | Ang value sa table (`free: true`) ay walang stalk at ulo | `hx-core.js`, `hx-page-generator.js` |
| Purge and trip: "Auto 72.7 %" ng reheater pass damper nakapatong sa back pass | Pangalan, mode at output nasa kaliwa, naka-stack (`mvb`), labas ng back pass | `hx-page-purge-trip.js` |
| Diesel oil: "Manual 100.0 %" ng supply valve umaabot sa burner header, tapos sa Y ng pump B | Label nasa ibabaw ng valve, naka-stack | `hx-page-oil-burners.js` |
| Make-up water: "Make-up pump A / B / C" nakapatong sa outlet pipe | Itinaas ng 13 ang outlet line at ang V-MU0007 / 09 / 11 | `hx-page-makeup-cooling.js` |
| Auxiliary steam: "Closed 0 %" ng block valve dumidikit sa "Manual" ng spray valve (dalawang spray valve) | Mode at output ng spray valve naka-stack | `hx-page-aux-steam.js` |
| Coal: "rear side" natatakpan ng sand silo ("rea") | Nasa ilalim ng sand line, sa pagitan ng furnace at silo | `hx-page-coal.js` |
| Station: kapag may bagong Beta, may putol na "-beta.N" sa taas-kaliwa ng bawat page (ang update bar ng app ay pinipilit makita ng shellc-ui.css) | Hindi na iginuguhit ang bar sa ilalim ng station; ang station popup na "New version" ang nagtatanong | `src/station/station.css` |

## Mga test

- PASADO: 22 pages muling kinunan sa station build (1600 x 900, 150 MW), 0 page error; tiningnan isa-isa ang generator, purge, oil, make-up, aux at coal.
- PASADO: Warm / Hot load sa station (drum 108.5 / 96.1 kg/cm², HP metal 403 / 487 °C).
- PASADO: `tests/regress/station_warm_hot.js`.

## Findings

| # | Nakita | Rekomendasyon |
|---|---|---|
| L1 | Generator pins | Ayos sa beta.373 |
| L2 | Make-up pump labels | Ayos sa beta.373 |
| L3 | Oil supply valve at purge damper values | Ayos sa beta.373 |
| L4 | Pagka-load ng Warm / Hot: turbine master SP 0, PV 151 MW sa 0 MW | Jennie: engine (CCS), bukas pa |
| L5 | Update bar ng app lumalabas sa station | Ayos sa beta.373 |

## Susunod

Ang 53 UI-only tags ni Lisa (annunciator A1~J10, DCS system diagnostics, mga lamp at push button).
