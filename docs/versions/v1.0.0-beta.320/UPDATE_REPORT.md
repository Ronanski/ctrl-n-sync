# 1.0.0-beta.320 (LEADER : JENNIE, 2026-11-23)

## Ano ang inayos

Mga headless test lang ang inayos dito. Walang binago sa planta, sa logic o sa screen.

Mula beta.275, sa Worker na tumatakbo ang engine ng app bilang default. Ang mga lumang test, gayundin ang tool na gumagawa ng 150 MW save point, ay nagbubukas ng app nang hindi pinipili ang engine. Kaya ang page ay nagiging "salamin" (mirror) lang. Ang bawat scan na pinapatakbo ng test sa page ay ibinabalik ang resulta pero hindi ito tinatandaan.

Dahil dito, hindi natatandaan ng DITL logic ang mga "memory" (flip-flop). Halimbawa: kapag nag-trip ang CEP A, pinaandar ng logic ang standby na CEP B. Pero pagkalipas ng 2 segundo, natapos ang start pulse at huminto ang B, dahil hindi naitandaan ang start.

Ang ayos: binubuksan na ngayon ng `tests/regress/lib.js` ang app na may `?worker=0`. Ito ang page engine, at ito rin ang ginagamit ng CI gate (`tests/gate/behaviour.cjs`). Ang test na para sa Worker ay pumupunta pa rin sa `?worker=1`.

Inayos din ang `tests/regress/condensate.js`:
- nagsisimula na ito sa sariling "At 150 MW" ng app (reset, save point st150, unit start);
- ang lumang daan (AN.reset + plantLoad150 + DITL150.apply) ay walang unit model.

## Resulta ng test

| Test | Dati (main) | Ngayon |
|---|---|---|
| condensate | sira (walang unit model; pagkatapos, huminto ang CEP B) | ALL PASS: nag-trip ang A, sumalo ang B pagkalipas ng 2 s, 367 m3/h, 17.1 kg/cm2 |
| mu_ccw_model | 3 FAIL | ALL PASS: sumalo ang ACWP-B; walang SWBP = 51.7 C; Cold make-up header 2.51 kg/cm2 |
| fans | 1 FAIL | ALL PASS |
| sootblower_steam | 8 FAIL | 4 FAIL; ang N-1011 ay 230.5 s, 276.6 kg (tugma sa table: 230 s, 276 kg) |
| fab_current_ll_cause | 3 FAIL | SKIP: wala sa PC na ito ang save file (b142) |
| gate (behaviour) | ALL PASS | ALL PASS |

## Findings

| # | Nakita | Rekomendasyon |
|---|---|---|
| F1 | Lahat ng regress test na gumamit ng `lib.js` mula beta.275 hanggang beta.318 ay tumakbo nang walang DITL memory. Hindi maaasahan ang pasa o bagsak nila sa panahong iyon. | Patakbuhin muli ang mga test na ginamit bilang batayan ng isang fix sa panahong iyon. |
| F2 | Ang `tools/steady150/make.cjs` (gumagawa ng st150) ay gumagamit din ng `lib.js`. Ang st150 na ginawa mula beta.275 ay ginawa nang walang DITL memory sa settling run. | Gawing muli ang st150 sa susunod na steady-state na trabaho, gamit ang page engine. Ihambing ang drift. |
| F3 | Sootblower: ang air heater blower A ay nasa cold end na (phase 2) pagkalipas ng 9.5 s, at isang dulo lang ang hinipan (1180 s, 1278 kg; inaasahan 2360 s, 2556 kg). | Suriin ang DITL-80 air heater sequence (hot end, saka cold end) gamit ang page engine. |
| F4 | Sootblower: ang S/H panel #1 outlet sa 150 MW ay 397.9 C (03.png TT-BR1120 458 / 454 C), kaya ang header pagkatapos ng MV-SB1001 ay 329.8 C (inaasahan > 370). | Suriin ang superheater panel temperature ng plant model laban sa 03.png at sa heat balance. |
| F5 | Ang beta.314 F5 (N-1011 189 / 148 / 114 kg laban sa 276 kg) ay galing sa test na walang memory. Sa page engine, 276.6 kg ito. | Wala nang gagawin sa modelo. Sarado na ang F5 ng beta.314 (hindi binabawi, may paliwanag na). |
