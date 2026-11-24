# 1.0.0-beta.322 (LEADER : JENNIE, 2026-11-23)

## Ano ang inayos

Test lang ang inayos dito (`tests/regress/sootblower_steam.js`). Walang binago sa planta, sa logic o sa screen.

1. **Air heater sootblower.** Sa programa ng sootblower, dalawang hakbang ang air heater. Sa hakbang 29 (DITL-80F row 25 OPERATING), ang COLD end na N-1042 ang unang hinihipan. Sa hakbang 30 (DITL-80 output row 19), ang HOT end na N-1040. Ayon sa L20 manual, sunod-sunod ito, 19 min 40 s bawat isa. Ang test ay nagbibigay lang ng hakbang 29, kaya isang dulo lang ang dapat hipan. Tama ang app. Ang mali ay ang inaasahan ng test (hot end muna, 2360 s). Ngayon, cold end ang hinihintay ng test: 1180 s, 1278 kg.
2. **Singaw na kinukuha sa drum.** Sa 10 s pagkatapos magsimula ang blower, gumagalaw din ang ibang singaw ng drum (main steam at ang mga spray). Ngayon, ibinabawas ng test ang galaw na iyon. Ang band ay 1 T/H, gaya ng sa N-1011 sa parehong test. Ang dahilan: binabasa ng planta ang singaw ng drum bilang main steam + blowdown, at sumusunod ang main steam sa pressure ng drum. Kaya lumalabas ang singaw ng blower sa pamamagitan ng pressure na kinukuha nito, hindi isa-sa-isa sa loob ng 10 s (150 MW: +3.55 T/H para sa 3.9).

## Resulta ng test

| Test | beta.320 | Ngayon |
|---|---|---|
| sootblower_steam | 4 FAIL | 2 FAIL: ang dalawang natitira ay galing sa temperatura ng S/H panel #1 (F2 sa ibaba) |
| build / check | SAME | SAME |

## Findings

| # | Nakita | Rekomendasyon |
|---|---|---|
| F1 | Sarado na ang F3 ng beta.320 (isang dulo lang ang hinipan). Tama ang app: cold end muna sa hakbang 29, hot end sa hakbang 30. Hindi ito binabawi; may paliwanag na. | Wala nang gagawin sa modelo. |
| F2 | S/H panel #1 outlet sa 150 MW: 397.9 C sa app, 458 / 454 C sa planta (03.png TT-BR1120). Ang dahilan: sa app, ang mga wall ng backpass ay kumukuha ng mga 15 MW BAGO pa ang mga bank (gas 864 papuntang 799 C). Sa planta, katabi ng mga bank ang mga wall. | Ilipat ang wall heat sa tabi ng bawat bank. Nasubukan na ito (hiwalay na branch). Pero kailangan munang ayusin ang F3, dahil lumalabas pa sa band ang main steam (546 C). |
| F3 | Ayon sa FHI manual (L1 Part 4 Sect 1 SUPERHEATER), ang bare thermocouple ng gas ay nagbabasa nang mas mababa dahil sa radiation: mga 28 C na mababa sa 535 C. Sa full load, ang tunay na gas na lumalabas sa furnace ay mas mainit kaysa sa basa (tantiya 920 - 950 C, CALC). Ang app ay kinopya ang basa (864 C) bilang tunay na gas. Kaya sobra ang init na kinukuha ng furnace walls sa app (166 MW na evaporation, 150.5 MW sa planta). | Gumawa ng modelo ng basa ng thermocouple. Saka i-anchor muli ang hati ng init ng furnace, para mas mainit ang gas na lumalabas. Dapat tumugma pa rin sa FHI Fig 8 sa mababang load (90 MW: 755 C). |
| F4 | Ang data sheet ng biasing damper (K1AU3-D1-0-015) ay scan lang. Walang mabasang stroke time o characteristic. | Manatiling NO-SOURCE ang linear na damper characteristic hanggang may mabasang kopya. |
