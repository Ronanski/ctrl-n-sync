# LMYP OTS 1.0.0-beta.496 (EIMI, lane 6, 2026-11-25)

Shared HMI core, hiling ni MINAMI para sa Industrial and waste water page, at ang listahan ng kulang sa HMI (dating PR 523).

## Ano ang nabago
- Motor o valve na may hook na walang value: grey na, hindi na green.
- Tank na walang level key o walang value: grey at puno, hindi na pekeng level.
- Anim na bagong faceplate: MV-AS1397 (DITL-116), MV-IW0391 (DITL-87), P-0715A / B (DITL-111 at #B), P-0058A / B (DITL-120 at #B). Nasa system files sila; idinadagdag ng hx-app.js sa registry sa pagbukas ng app ang wala pa roon.
- Drawing na walang DCS START / STOP button: sarado ang button at sinasabi ng faceplate. DITL-120 lang ang ganito sa lahat ng motor ng registry.
- HMI gap list: 1067 equipment, 814 on a page, 253 missing (`docs/audit/hmi-gap-list-2026-11-25.md`, gawa ng `tools/audit/hmi-gap.cjs`).
- Bagong test sa CI: `tests/regress/hx_unknown.js`.

## Findings
| # | Finding | Rekomendasyon |
|---|---------|---------------|
| 1 | Green (stopped) ang motor kahit walang signal | Inayos dito: grey kapag walang alam na value |
| 2 | May 40 ~ 70 % na level ang tank na walang level signal | Inayos dito: grey at puno |
| 3 | Walang DCS START / STOP push button sa DITL-120 (waste water pumps); MOP-P0058A / B lang ang DCS output sa I/O list | Huwag mag-imbento ng button; nakasara at may paliwanag sa faceplate |
| 4 | Ang I/O list ay may kulang pang equipment sa HMI pages | Lane 6 at 7, page by page ayon sa listahan; patakbuhin ulit ang tool pagkatapos ng bawat page |
| 5 | 18 DIAG point (station diagnostics) ang walang page | Station DCS diagnostics panel ng lane 6, kasunod nito |

## Checks
- hx_unknown.js at hx_fp_mon.js: ALL PASS (headless, 150 MW); build.js --check, operator-text-check, no-fit, version-check
- Hindi sinubukan: Android at tablet
