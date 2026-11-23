# LMYP OTS 1.0.0-beta.342 (LEADER : JENNIE, 2026-11-23)

## Ano ang inayos (buong boiler model, hindi patch)

**F13: may sariling lakas ang SH panel #1 at #2 sa furnace (uaP1 117, uaP2 63 kW/K; dati pareho, 65).** Nagsasara ang buong boiler sa mga meter ng planta sa 150 MW: 382 MW na coal, 349.6 MW sa steam (91.5 %), kasama ang sprays na 37.5 at 28.2 T/H. Isang reading lang ang sumisira sa balance ng backpass: ang TT-BR1110, mga 30 C na mataas. Kaya kinuha ko ang init ng bawat panel mula sa planta:

- panel #1: 392.6 T/H, mula 341 C hanggang TT-BR1120 456 C = 51.7 MW (sa app dati, 33.1 MW)
- panel #2: 431.5 T/H, mula TIBR1130 394 C hanggang TIBR1140 462 C = 27.0 MW (sa app dati, 29.4 MW)

Iisang set ito para sa lahat ng load, hindi bawat load. Ginawa ulit ang 150 MW na simula (`src/data/st150.txt`).

## Epekto sa operator

| | Planta | beta.340 | beta.342 |
|---|---|---|---|
| 150 MW: panel #1 / #2 heat | 51.7 / 27.0 MW | 33.1 / 29.4 | 50.8 / 27.0 |
| 150 MW: spray 1 / 2 | 37.5 / 28.2 T/H | 10.4 / 3.9 | 34.9 / 0 |
| 150 MW: MST / RHT | 538 - 542 / 542 | 541 / 538 | 540 / 538 |
| 90 MW: MST | 522 - 529 | 527 | 519 |
| 72 MW: MST | ~530 (FHI) | 505 | 515 |

Sa 150 MW, mas malapit na sa planta ang spray 1 na nakikita ng operator. Sa 72 MW, umakyat ng 10 C ang MST. Sa 90 MW, bumaba ito ng 8 C.

## Findings

| # | Finding | Recommendation |
|---|---|---|
| F13 | Sarado sa 150 MW: tugma na ang init ng panel #1 at #2 sa planta | Bantayan sa 90, 72 at 45 MW kasabay ng F14. |
| F14 | 0 ang spray 2 sa app (28.2 T/H sa planta). Mga 30 MW ang kinukuha ng finishing SH (sa planta ~44.6 MW, 420 → 541 C). Sa RH pass napupunta ang mas maraming gas sa app (RH damper 72 %, sa planta 11 %). Dahil hawak ng spray 1 sa ~462 C ang labas ng panel #2, ang finishing SH ang nagtatakda ng MST sa mababang load. | Suriin ang gas share law ng RH / SH pass (vendor curves p15 / p16) at ang lakas ng finishing SH laban sa planta sa 150 MW. Iisang set, saka 90 at 72 MW. |
| F15 | Sa 90 MW, may spray 1 na 11.7 T/H at MST 519; sa planta, walang spray at 522 - 529 | Kasama sa F14. |

Buong kwenta: `team-files/plant-study/15-boiler-balance-2026-11-23.md` (PC lang).

## Mga test

| Test | Resulta |
|---|---|
| check | SAME |
| gate behaviour 20 min | ALL PASS (MST 540.0 → 539.8, band 6) |
| sootblower_steam | ALL PASS (dati 2 FAIL) |
| ms_page_values | ALL PASS |
| feedwater | ALL PASS |
| unit_load | 1 FAIL (dati 2): 60 MW main steam flow 191.1 T/H (02.png 203.7). Pasado na ang coal. |

## Bukas na test findings

| # | Finding | Recommendation |
|---|---|---|
| T1 | unit_load: 191 T/H ang steam flow sa 60 MW (203.7 sa planta) | Kasama sa F14: susunod ang steam flow sa init ng boiler sa mababang load. |
