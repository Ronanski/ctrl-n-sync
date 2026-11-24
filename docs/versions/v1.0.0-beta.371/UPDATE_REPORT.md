# LMYP OTS 1.0.0-beta.371 (HMI : ROSÉ, 2026-11-24)

Sumunod sa beta.369. Mga layout fix mula sa HMI approval page (https://claude.ai/artifact/YCAQwvCn7cVwfzVYNjX5Wn). Walang binagong value o logic.

## Mga ayos

| Dati | Ngayon | File |
|---|---|---|
| Naputol ang pangalan ng page sa top bar ng station sa 13 pages ("Gen...", "Coal, ...", "Turbi...") | Buo na: ang limang numero ay naka-stack (pangalan sa ibabaw ng value) hanggang 1700 px, at ang pangalan ng page ay may 10em at puwedeng dalawang linya | `src/station/station-frame.css` |
| "HYDRAULIC CONTROL" lampas sa box | Mas malapad ang box ng label na puro capital (buong klase ng push button sa HX pages) | `src/ui/plant/hx/hx-core.js` |
| "BEFORE THE AIR HEATER" nakapatong sa pipe | "AIR HEATER INLET" / "AIR HEATER OUTLET" | `hx-page-furnace-gas.js` |
| "Gland steam condenser H-1903" nakapatong sa pipe | Itinaas sa linya ng exhauster | `hx-page-aux-steam.js` |

## Mga test

- PASADO: 22 pages muling kinunan sa station build, 0 page error, Warm / Hot load tama.
- PASADO: `tests/regress/station_warm_hot.js`.

## Findings

| # | Nakita | Rekomendasyon |
|---|---|---|
| L1 | Generator page: may maliit na pin sa ilalim ng bawat value na walang tinuturo | Rosé: tanggalin sa susunod na beta |
| L2 | "Make-up pump A / B / C" dumidikit sa pipe sa itaas | Rosé: ibaba ang label sa susunod na beta |
| L3 | Oil burners "100.0 %" ng supply valve at purge "Auto 72.7 %" dumidikit sa linya | Rosé: ilipat sa susunod na beta |
| L4 | Pagka-load ng Warm / Hot: turbine master SP 0, PV 151 MW sa 0 MW | Jennie: engine (CCS) |

## Susunod

Ang 53 UI-only tags ni Lisa.
