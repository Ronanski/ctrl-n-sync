# LMYP OTS 1.0.0-beta.334 (LEADER : JENNIE, 2026-11-23)

## Ano ang inayos (buong boiler model, hindi patch)

**Iisang batas na ngayon ang nagbibigay ng solids sa furnace ayon sa taas.** Sa CFB, siksik ang solids sa ibaba at numinipis sa itaas. Mas mabilis itong numinipis kapag mababa ang load, dahil mabagal ang hangin. Dati, iisang density ang nakikita ng furnace walls at ng SH panels: ang density sa pinakaitaas ng furnace. Ngayon, kinukuha ng bawat isa ang average na density sa sarili nitong taas:
- Upper walls: mula sa itaas ng refractory (FL +14,264.6) hanggang sa bubong.
- SH panels: mula FL 27,774 hanggang 42,527 (drawing K1AU3C-201).
- Grate: FL +6,400.

Walang binagong constant na para lang sa isang load. Pareho pa rin ang anchor sa 150 MW. Sa mas mababang load, mas maraming solids ang natitira sa walls kaysa sa panels. Ganito rin ang nangyayari sa planta.

## Epekto sa operator: cyclone out gas temperature (TIFG1095)

| Load | Planta (scenario 2, load-up day) | App beta.332 | App beta.334 |
|---|---|---|---|
| 45 MW | 556 - 596 | 600 | 557 |
| 70 MW | 661 | 702 | 667 |
| 90 MW | 711 (scenario 1: 726) | 769 | 720 |
| 150 MW | 875 | 865 | 864 |

Sa 90 MW (scenario 1 ng planta: MST 522, walang 2nd spray):

| | Planta | beta.332 | beta.334 |
|---|---|---|---|
| MST | 522 | 541 | 525 |
| Sprays | 0 | 3 + 5 T/H | 0 |
| SH duty | 55 MW | 65 MW | 57 MW |

Walang nagbago sa 150 MW.

## Findings

| # | Finding | Recommendation |
|---|---|---|
| F1 | Sa 150 MW, 65 T/H ang spray ng planta at RH damper 11 %. Ang app ay nasa FHI design: 14 T/H, damper 53 %. Kapag pinilit ang app na sumunod sa planta sa 150 MW, nasisira ang 90 MW (bumabalik ang spray, sobrang init ng bed). Hindi rin nagtutugma ang mga reading ng planta sa 150 MW: boiler efficiency 95.5 %, FW 520 vs MSF 484. | Iwan muna ang app sa FHI design sa 150 MW. Tingnan ang ikalawang 150 MW snapshot ng planta (spray flows, TT-BR1120, gas TCs) bago galawin. |
| F2 | Sa 45 - 72 MW, ang MST ng app ay mga 20 C na mas mababa kaysa sa planta. Halimbawa, sa 72 MW: 511 sa app, 531 sa planta habang nag-lo-load up. | Sukatin ulit sa steady na 45 / 70 MW na run. Ang data ng planta ay mula sa ramp ng load-up day, hindi steady. |
| F3 | Mas mataas ang bed sa 90 MW (979 C) kaysa sa planta (955 C, scenario 1; 884 C sa load-up day). | Pasok sa 50 C na pagitan ng mga araw ng planta. Bantayan. |
| F4 | Mas mataas ang boiler efficiency ng app (92 - 93 %) kaysa sa FHI (90.9 %). | Ihambing ang stack, unburnt at radiation losses ng app sa FHI Tab 3. |

Buong table (app vs FHI design vs planta, start-up hanggang 150 MW): `team-files/plant-study/15-boiler-balance-2026-11-23.md` (PC lang).

## Mga test

| Test | Resulta |
|---|---|
| check | SAME |
| gate (behaviour) | ALL PASS |
| feedwater | ALL PASS |
| unit_load | 17 FAIL, pareho sa main beta.332 (17 FAIL): luma ang simula ng test (bare plantLoad150, walang steady state). Hindi dahil sa beta na ito. |
| sootblower_steam | 2 FAIL, pareho ang bilang sa main beta.332 (2 FAIL: panel #1 outlet 398 vs 458, header steam throttled). Hindi dahil sa beta na ito. |
| ms_page_values | error: wala na ang lumang MK page (gaya ng cd_page_values bago ang beta.328). Hindi dahil sa beta na ito. |

## Bukas na test findings (hindi sa beta na ito)

| # | Finding | Recommendation |
|---|---|---|
| T1 | unit_load: bare plantLoad150 start | Ilipat sa "At 150 MW" start (load150 + st150), gaya ng beta.328 |
| T2 | ms_page_values: hinahanap pa ang lumang MK page | Basahin sa HX pages gaya ng cd_page_values beta.328 |
| T3 | sootblower_steam: header steam 330 C, drains 241 C sa 120 s | Tingnan ang test band laban sa planta bago galawin ang model |
