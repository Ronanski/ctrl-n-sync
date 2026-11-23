# LMYP OTS 1.0.0-beta.338 (LEADER : JENNIE, 2026-11-23)

## Ano ang inayos (test lang, walang binago sa engine o logic)

**unit_load: ang test operator ay nagpapatakbo na tulad ng totoong operator kapag MANUAL ang turbine master.** Kapag pinindot ang BU-CMD sa ilalim ng 220 T/H, bumabagsak din ang DCS CONTROL MODE (I.0082 = 0, TCE180 p.127). Sa ABC-001C, ang AMT M.2017 = NOT I.0082, kaya ang EIC-TM ay sumusunod (tracking) sa TCS target AI0420. Ibig sabihin, walang epekto ang EIC-TM na isinusulat ng test. Dati, dito humihinto ang load sa 71.7 MW, at pag-akyat ay walang turbine na kumukuha ng dagdag na apoy (bukas ang bypass, nag-trip).

Ngayon, sa TCS panel target load (TCS CRT TARGET LOAD) nagpapalit ng load ang test operator:
- pababa: 0.8 %/min (1.2 MW/min) hanggang 60 MW;
- pataas: apoy muna (HIC-BM), saka sinusundan ng TCS target ang pressure.

## Epekto sa operator

| | Planta (02.png / 4.PNG) | beta.336 | beta.338 |
|---|---|---|---|
| 60 MW: MW | 60.3 | 71.8 (huminto) | 59.9 |
| 60 MW: main steam flow | 203.7 T/H | 222.7 | 190.0 |
| 60 MW: coal | 41.8 T/H | - | 38.6 |
| 60 MW: MST / RHT | 517 / 499 | - | 511 / 520 |
| 60 MW: hot reheat pressure | 15.0 | 16.7 | 14.3 |
| Pabalik sa 150 MW | walang trip | trip (drum level 260 mm) | walang trip, MW 150.1, MST 544, RHT 540 |

## Findings

| # | Finding | Recommendation |
|---|---|---|
| F1 | 60 MW: 190 T/H ang steam flow ng app; 203.7 sa trend ng planta. Tugma ang app sa heat balance ng turbine (PPE-14-0725, 60 MW case: 190.8 T/H sa 126 ata / 520 C) | Mas mataas ang flow sa planta nang mga 7 %. Tingnan sa turbine model kung ang 60 MW ng trend ay may bukas na extraction o mas mababang vacuum kaysa sa heat balance case. Huwag galawin ang test limit. |
| F2 | 60 MW: 38.6 T/H ang coal; 41.8 sa planta | Kasunod ng F1: kung tama na ang steam flow, aakyat din ang coal. Pagkatapos, tingnan ang boiler efficiency sa mababang load (94.8 % sa app sa 72 MW; masyadong mataas). |
| F3 | 60 MW: ang turbine demand SI0236 ay 57.8 - 58.7 habang 60 ang MW (TCS local) | Ang check ng test (MW malapit sa SI0236) ay para sa DCS mode. Sa TCS local, ang AI0420 ang target. Pag-aralan kung bakit gumagalaw pa ang SI0236 habang tracking ang EIC-TM (ABC-001C LAG/correction path). |
| F4 | Pag-akyat ng pressure sa 129 sa 60 MW, saglit na bumukas ang bypass (hanggang 31 T/H) habang MANUAL ang boiler master | Tama ito sa logic (pressure protection). Sa totoong operation, ibababa ng operator ang HIC-BM. Ilagay ito sa training note. |

Bukas pa rin mula sa beta.336: kulang ang wall heat ng backpass (F2 doon), mababa ang MST sa 72 MW, maliit ang spray sa 150 MW.

## Mga test

| Test | Resulta |
|---|---|
| check | SAME |
| unit_load | 3 FAIL (dati 9): MW, steam flow, coal sa 60 MW (F1 - F3). Pass na ang pagbabalik sa 150 MW, boiler master AUTO, O2 trim AUTO, BU-CMD latch, walang trip |

## Bukas na test findings

| # | Finding | Recommendation |
|---|---|---|
| T1 | unit_load: 3 FAIL sa 60 MW | F1 - F3 sa itaas |
| T2 | sootblower_steam: panel #1 outlet 397.5 C (planta 456) | Kasama sa wall heat finding ng beta.336 |
