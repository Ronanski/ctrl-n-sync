# LMYP OTS 1.0.0-beta.340 (LEADER : JENNIE, 2026-11-23)

## Ano ang inayos (test lang, walang binago sa engine o logic)

**unit_load: ang 60 MW check ng MW ay sumusunod na sa demand na sinusunod talaga ng turbine.** Kapag nasa DCS CONTROL MODE (I.0082 = 1), ang SI0236 ang sinusunod ng TCS. Kapag nasa TCS local (I.0082 = 0, turbine master MANUAL dahil sa BU-CMD), ang TCS target ang sinusunod. Sa TCS local, may dagdag na LN55 "MSP vs T/B Override MW" ang SI0236 (ABC-001C, ±2 MW kapag lampas ±3 kg/cm2 ang pressure error), pero hindi ito binabasa ng TCS. Sa 60 MW, MSP 125.7 vs SV 122.3, kaya 60 - 2 = 58 ang SI0236. Tama iyon sa drawing, kaya mali ang dating paghahambing ng test.

Natapos nito ang finding F3 ng beta.338: ipinaliliwanag ng drawing ang galaw ng SI0236.

## Epekto sa operator

Walang nagbago sa app. Sa 60 MW, ang MW ay 59.9 at ang TCS target ay 60.0.

## Findings

| # | Finding | Recommendation |
|---|---|---|
| F1 | 60 MW: 190 T/H ang steam flow ng app (heat balance 190.8); 203.7 sa trend | Bukas pa (beta.338 F1). Tandaan: sa 150 MW, 482 T/H ang MSF meter ng planta vs 458.3 sa heat balance (+5 %); maaaring ganito rin ang meter sa 60 MW. Ihambing muna ang meter error bago galawin ang turbine model. |
| F2 | 60 MW: 38.6 T/H ang coal; 41.8 sa planta | Bukas pa (beta.338 F2): tingnan ang boiler efficiency sa mababang load. |
| F3 | Sa 150 MW, hindi nagsasara ang heat balance ng planta sa backpass: mga 141 MW ang nakuha ng steam pero mga 124 MW lang ang ibinigay ng gas | Huwag pilitin ang walls sa 371 C. Kumuha muna ng pangalawang plant reading ng TT-BR1110, TT-BR1120 at ng spray flows sa 150 MW. Nasa study file sa PC. |

## Mga test

| Test | Resulta |
|---|---|
| check | SAME |
| unit_load | 2 FAIL (dati 3): steam flow at coal sa 60 MW (F1, F2). PASS ang MW (59.9, TCS target 60.0), ang pagbabalik sa 150 MW, at walang trip |

## Bukas na test findings

| # | Finding | Recommendation |
|---|---|---|
| T1 | unit_load: 2 FAIL sa 60 MW | F1, F2 |
| T2 | sootblower_steam: panel #1 outlet 397.5 C (planta 456) | Kasama sa F3 |
