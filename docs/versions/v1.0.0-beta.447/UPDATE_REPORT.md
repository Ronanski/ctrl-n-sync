# v1.0.0-beta.447 — Industrial at waste water page (lane 7, HMI turbine)

## Ano ang bago (nakikita ng operator)
- Bagong page sa Plant > Cooling and utilities: **Industrial and waste water**.
  - Dalawang industrial at fire water tank (T-0714A / B) na may level at level low, at ang tank connecting motor valve MV-IW0391 (open, closed, posisyon).
  - Industrial water pump A / B (P-0715A / B): running, remote, electric trouble, strainer dP; header pressure PT-IW0715 papunta sa mga user ng planta.
  - Fire pumps P-0718 (diesel), P-0719 (motor), P-0720 (jockey): running state lang (ang fire fighting system ay wala sa DCS).
  - Waste water sump T-0050 na may pump A / B (P-0058A / B), level high high, papunta sa buffer basin; transformer area pit na may submerge pump P-1127 at level high high.

## Batayan
- K1AU3-PD-025 Rev D (industrial water), K1AU3-PD-040 Rev C (waste water), I/O list (station 5), DITL-87, DITL-111, DITL-120.
- Ang tank A level = LT-IW0714 ("industrial water tank level"), tank B level = LT-IW0724 ("fire water tank level") ayon sa I/O list; sa drawing ay LT-IW0714-A / -B.

## Hindi pa
- Lahat ng state at value ay naka-bind sa tunay na address pero `-----` pa dahil walang field model ang mga input na ito (lane 4 links).
- Wala pang start / stop at open / close faceplate: kailangan ng machine na nakarehistro (P-0715A / B DITL-111, P-0058A / B DITL-120, MV-IW0391 DITL-87). Hiniling sa HMI lead.

## Sinubok
- `tests/lanes/hmi-turbine/pages-bound.cjs`: 2 pages, 53 elemento, 0 problema. Headless app sa 150 MW RUN: bukas ang page, walang error, larawan sinuri.
