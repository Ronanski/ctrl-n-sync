# 1.0.0-beta.324 (LEADER : JENNIE, 2026-11-23)

## Ano ang inayos

**FA blower A, na-trip sa low current kapag sabay ang B** (`src/analog/engine/boiler.js`, bagong test `tests/regress/fab_curve_current.js`).

1. **Tunay na sanhi ng trip.** Pagka-start ng B, hinati agad ng app ang FA flow reading sa dalawang blower ayon sa damper. Pero ilang segundo pa bago tumaas ang FIFA1055 reading. Kaya sa mga segundong iyon, kalahati lang ng lumang flow ang naibigay sa A (mga 9 T/H). Bumaba ang current nito sa 22 A, mas mababa sa L.L. na 24.6 A (DITL-28B row 12), kaya pinahinto ito ng DITL-28A row 17. Hindi naman gumalaw ang damper ng A. Ngayon, sariling flow na ang bawat blower: sumusunod ito sa sarili nitong damper, sa loob ng mga 5 s, na karaniwang bilis ng air flow. Nagsisimula sa 0 ang flow ng bagong start na blower, at hindi nagbabago ang flow ng tumatakbo na.
2. **Current ng blower mula sa tunay na curve** (dati ay hulang 0.45, NO-SOURCE). Mga pinagkunan (nasa PC lang):
   - Continental 500.04 performance curve, K1AU3-D1-0-004 p.7: ang power at ang outlet pressure ayon sa flow.
   - FE-FA1055, K1AU3-E2-0-007 p.4: 0-35 T/H, max 28 T/H sa 5,230 mmAq. Tugma ito sa gitnang curve, kaya ito ang flow ng FIFA1055.
   - TECO 480 kW motor: FLA 49.4 A, eff 95.5 %, PF 0.89.

   Kapag sinasakal ng damper sa inlet ang blower, numinipis ang hangin na pumapasok. Kaya mas mababa ang power nito sa parehong T/H.

   | Blower (header 3,257 mmH2O) | Current |
   |---|---|
   | Isa sa 26.3 T/H | 37.3 A (snapshot 9.png) |
   | Isa sa 20 T/H | 33.2 A |
   | Dalawang hati sa 26.3 T/H (13.2 T/H bawat isa) | 26.5 A |
   | Isa sa 10 T/H | 22.5 A |

   Ang L.L. na 24.6 A ay nasa mga 11.5 T/H ng isang blower.

## Resulta ng test

| Test | Dati | Ngayon |
|---|---|---|
| fab_curve_current (bago) | A na-trip pagka-start ng B | PASS lahat: A mag-isa 37.0 A; A at B sabay, tig-26.4 A nang 120 s, walang trip; A sa mababang damper ay na-trip sa CURRENT L.L. (tama) |
| fab_standby_current / fab_current_ll_cause | SKIP (wala ang b142 save) | SKIP pa rin |
| fab_air_loss, fa_standby_150, fans | PASS | PASS |
| fa_old_save | 1 FAIL (screen) | parehong 1 FAIL (F4), PASS lahat ng planta |
| build / check | SAME | SAME |

## Findings

| # | Nakita | Rekomendasyon |
|---|---|---|
| F1 | Kapag sabay ang dalawang FA blower sa normal na flow ng 150 MW (mga 26 T/H), mga 26.5 A lang ang bawat isa. Dalawang ampere lang iyon sa itaas ng trip na 24.6 A. | Kapag dalawa ang tumatakbo, panatilihing pantay ang damper ng A at B. Huwag hayaang bumaba ang isang blower sa mga 12 T/H. Kung isa lang ang kailangan, patayin na ang isa. |
| F2 | Linear pa rin ang flow ng blower ayon sa damper (26.3 T/H sa 42.8 %). Wala sa docs ang damper curve. | Kunin sa plant trend ang FIFA1055 at ang damper ng A/B sa ilang load, at ihambing. |
| F3 | Kailangan pa rin ng b142 save ng fab_standby_current at fab_current_ll_cause, kaya SKIP sila. | Gawin silang 150 MW start gaya ng fab_curve_current, o ibalik ang save sa team-files/saves. |
| F4 | Ang `fa_old_save` ay FAIL sa isang check ng screen: ang FICFA1055A / B faceplate at ang IT-F1055B sa Air and flue gas page. FAIL din ito sa main bago ang beta na ito, kaya hindi ito galing sa pagbabagong ito. Pumasa ang lahat ng check niya sa planta. | Kay Rosé (screen): ilagay ulit sa page ang dalawang damper faceplate at ang IT-F1055B, o itama ang test kung lumipat na sila sa ibang page. |
