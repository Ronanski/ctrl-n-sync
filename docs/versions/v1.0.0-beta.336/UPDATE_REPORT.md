# LMYP OTS 1.0.0-beta.336 (LEADER : JENNIE, 2026-11-23)

## Ano ang inayos (buong boiler model, hindi patch)

**Damper travel ng RH/SH biasing dampers: 15 - 90 deg.** Ang dalawang vendor curve (K1AU3-D1-0-015 p15 RH pass, p16 SH pass) ay nagsisimula sa 15 deg. Ang apat na design case nila (Normal, BMCR, 70 % gas sa RH, 60 % gas sa SH) ay nagbibigay ng control range na 40 - 70 % gas sa RH. Dati, 0 - 90 deg (NO-SOURCE), kaya 13 - 88 % ang range sa 150 MW, lampas sa sukat ng vendor. Ngayon, 28 - 73 % na. Sa planta (150 MW, RH 11 % / SH 89 %), 37 % ng gas ang napupunta sa RH; 40 % ayon sa heat balance ng planta. Dati, 22 %.

Hindi pa nito naitataas ang MST sa mababang load. Ibinabalik ng RH temperature loop ang dampers sa parehong hati ng gas.

## Epekto sa operator

| | Planta | beta.334 | beta.336 |
|---|---|---|---|
| 150 MW: MST / RHT | 538 - 542 / 542 | 541 / 538 | 541 / 538 |
| 150 MW: spray 1 + 2 | 65.7 T/H | 10 + 4 | 10 + 4 |
| 150 MW: RH / SH damper | 11 / 89 % | 54 / 52 % | 57 / 48 % |
| 150 MW: gas papunta sa air heater | 313 - 317 | 305 | 305 |
| 90 MW: MST | 522 - 529 (FHI 541) | 525 | 527 |
| 72 MW: MST | 531 | 511 | 508 |

Sa 150 MW, walang nagbago sa nakikita ng operator. Sa 72 MW, mga 20 C pa ring mababa ang MST.

## Findings

| # | Finding | Recommendation |
|---|---|---|
| F1 | Sa 72 MW, mga 20 C pa ring mababa ang MST (508 vs 531) | Nasubukan ang walls sa gilid ng banks (RH-1 inlet 864 C sa planta, halos walang lamig bago ang unang bank). Umakyat ang MST sa 72 MW sa 524, pero sa 150 MW tumaas ang MST nang 540 → 550 sa 20 min (gate FAIL). Kaya hindi ito isinama. Naka-save ang study patch sa PC. |
| F2 | Kulang ang init na nakukuha ng backpass walls: 9 - 12 MW sa app. Sa planta, mga 28 MW (TT-BR1110 371 C, mula sa drum na ~331 C) | Kulang ang wall area sa model (1,130 m2 lang). Hindi kasama ang gas inlet ring at roof (S-7, S-8), ang screen tubes sa upper cavity (53 bawat row, P2S5) at ang inlet cavity. Kunin ang upper backpass dimensions sa GA K1AU3A-001, saka isama ang walls sa gilid ng banks. |
| F3 | Sa 150 MW, 14 T/H ang spray ng app; 65.7 T/H sa planta (FHI design 12.4) | Kasama sa F2: kapag tama na ang wall heat, mas mainit ang panel #1 inlet at lalaki ang spray 1. |
| F4 | Mabagal ang MST outer loop (TICMS1004 kp 1.6, Ti 1,371 s, ABC-012): sa 25 min, 73.7 → 71.2 % lang ang MV | Logic ito ng drawing, hindi ginalaw. Kailangang steady ang start state ng "At 150 MW" sa sarili nitong model. |

Buong table at mga probe: `team-files/plant-study/15-boiler-balance-2026-11-23.md` (PC lang).

## Mga test

| Test | Resulta |
|---|---|
| check | SAME |
| gate behaviour 20 min | ALL PASS (MST 540.4 → 541.4, band 6) |
| feedwater | ALL PASS (pinatakbo sa walls study build; hindi ginagalaw ng damper travel ang feedwater) |
| ms_page_values | ALL PASS: inilipat sa HX pages (Drum and steam, Feedwater, Reheat steam, Overview, Turbine) at sa "At 150 MW" start |
| unit_load | inilipat sa "At 150 MW" start: 9 FAIL (dati 17). 60 MW: MW 71.8, MSF 222.7, RHP 16.7; pabalik sa 150 MW nag-trip (drum level 260 mm) |
| sootblower_steam | 2 FAIL, pareho sa main (T2) |

## Bukas na test findings

| # | Finding | Recommendation |
|---|---|---|
| T1 | unit_load: humihinto ang load sa ~72 MW (target 60) at nag-trip pabalik sa 150 MW | Tingnan ang turbine master / EIC-TM handling ng test sa ilalim ng 220 T/H gamit ang UDBG log |
| T2 | sootblower_steam: panel #1 outlet 397.5 C (planta TT-BR1120 456) at header steam 333 C sa 120 s | Kasama sa F2 |
