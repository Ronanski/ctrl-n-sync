# LMYP OTS 1.0.0-beta.328 (LEADER : JENNIE, 2026-11-23)

## Ano ang inayos

Dalawang regress test na pumapalya rin sa main. Walang binago sa planta o sa logic, test lang.

1. **cd_page_values**: hinahanap pa nito ang lumang page 05 CONDENSATE, na tinanggal na noong Audit 3 #6. Ngayon binubuksan ng test ang mga HX page na gaya ng ginagawa ng operator at doon binabasa ang anim na value:
   - Condensate: TT-CD1110-4, TT-CD1119, FT-CD1122, PT-CD1122
   - Reheat steam: FT-CD1115
   - Feedwater: TT-CD1104
2. **extraction_warming** at **cd_page_values**: dati, ang start sa 150 MW ay `AN.plantLoad150()` + `DITL150.apply()` lang, kaya walang steady state.
   - Bumabagsak sa MAN ang CCS pagkalipas ng mga 4 min.
   - Nagti-trip ang boiler sa DRUM LEVEL L.L. sa mga 20 min.
   - Pagkatapos ng trip, pinainit ng LP bypass steam ang TT-HR1010 hanggang 449 C.
   
   Ngayon pinipindot na ng test ang "At 150 MW", ang parehong start na ginagamit ng operator (AN.loadStart + DITL + steady state st150).

## Resulta

| Test | Bago | Ngayon |
|---|---|---|
| cd_page_values | error (walang MK05 button) | ALL PASS: 38.5 / 37.1 / 0 / 362.5 / 7 / 160.8 |
| extraction_warming | FAILED 3 (peak 448.9 C) | ALL PASS: bumubukas sa 228.3 C, sumasara sa 330.1 C, bumubukas ulit sa 249.9 C |

## Findings

| # | Finding | Rekomendasyon |
|---|---|---|
| F1 | Walang steady state ang `AN.plantLoad150()` + `DITL150.apply()`. Nagda-drift ito at nagti-trip sa mga 20 min. Ginagamit pa ito ng ibang test (air_model, air_valves, ashcool, as_page_values, mga audit230 test, hist), ng src/ui/uat/check.js at scen.js, at ng hmi-op.js. Maikli ang takbo ng karamihan, kaya pumapasa pa sila. | Ilipat ang mga test sa "At 150 MW" start sa susunod na beta, isa-isa at may takbo bawat isa. Kay Rosé ang check.js at scen.js (UI). |
