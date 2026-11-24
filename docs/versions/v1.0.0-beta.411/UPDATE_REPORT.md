# v1.0.0-beta.411: TCS sheets: binibilang lang na tumatakbo ang sheet kapag kumpleto ang bawat parameter (TCS LOGIC : MARIA, 2026-11-25 PHT)

## Binago
- Bagong patakaran (QA : SAORI review, coordinator 2026-11-25): ang kulang na parameter ay bukas na item, hindi default. Ang sheet ay tumatakbo lang kapag ang bawat block ay may function AT nakasulat sa sheet ang bawat parameter na kailangan ng definition nito.
- Batayan ng bawat kailangang parameter: HIACS macro list TCA013 ~ TCA020 (331DM09788, 2014-04-18, TCA.pdf pahina 8 ~ 15, nasa PC lang). Halimbawa: ML 17 SG "Y=K, K:Parameter"; ML 27 G "Y=K*X, K:Gain"; ML 21 AM "SW=1 ... I at D, LL<=Y<=HL" (walang M).
- Inalis ang mga default na hindi galing sa drawing (SG K 0, G K 1, TP/TD/TW 0 s, FLK 0.5 s, LIN K 1 / B 0, PIV / PIF / I gain at TI 1, CMP / CPL HL 0, CNT N 1, LCK / UCK K 0, FLT / PD / GRD).
- PIV (ML 13, TCA014 p 9): ang Y ay ang increment mismo, Y = G1 (X(j) - X(j-1)) + G2 (TS/TI) X(j) + F; walang Y(j-1) at walang output limit sa definition. Tama ang code; mali ang lumang comment (inayos). Ang HL / LL / ML na nakasulat sa ilalim ng PIV (TCE168, 169, 191, 195) ay bukas na item.
- Ang block na may SW input pero walang SW wire: hindi sinasabi ng macro list kung ano ang default ng HIACS. Bukas na item hanggang TC-14-116. Ang G sheets (310SD03-743) ay relay diagram, walang SW, kaya hindi kasama rito.
- DIV na zero ang divisor: walang patakaran sa ML 4 (TCA013 p 8); hawak ng app ang huling value, nakatala bilang bukas na item.

## Bilang (bago -> ngayon)
- Lahat: 216 -> 185 ng 421. TCE / TCA: 204 -> 173 ng 407 (COMM 108 ng 229, EHG 65 ng 178). G: 12 ng 14 (walang bago).
- Ang checker ng SAORI (tce-run-check.cjs) sa code na ito: 185 tumatakbo, 0 depekto. Iisa na ang bilang.
- Mas mababa ito sa 194 ng SAORI dahil kasama na rin ang SW na walang wire at ang CMP / CPL / PIF / I / LCK na walang parameter.

## Bukas na items (28 dahilan, 108 sheet-dahilan): `node tests/tce/sheets.cjs --list`
- Karamihan: walang nakasulat na value sa typed sheet (notes = []). Susunod: tingnan sa PDF kung nakasulat ito at hindi lang na-type; kung nakasulat, i-type na may pahina.

## Sinubok
- tests/tce/sheets.cjs (bagong open-item checks), tests/tce/run.cjs, checker ng SAORI. Headless.

## Hindi sinubok
- Walang binago sa app na nakikita ng operator (hindi pa naka-load ang tce-run.js sa app).

## Listahan
- CPL HL not on the sheet: TCA500 TCA639 TCA686 TCE121 TCE123 TCE125 TCE127 TCE129 TCE131 TCE143
- FG curve not on the sheet: TCA530 TCA531 TCA548 TCA585 TCA586 TCA634 TCA760 TCA769 TCA770 TCA777 TCA825 TCE101 TCE202 TCE206 TCE214 TCE500 TCE503
- CMP SW not wired (HIACS default not in the macro list): TCA530A TCA534 TCE145 TCE206 TCE226 TCE227 TCE228
- CMP HL not on the sheet: TCA533 TCA639 TCA685 TCA686 TCA767 TCE068 TCE121 TCE123 TCE133 TCE135 TCE143 TCE350
- PA SW not wired (HIACS default not in the macro list): TCA533 TCA536 TCA634 TCA740 TCE176 TCE177 TCE190 TCE195 TCE196 TCE202
- SG K not on the sheet: TCA536 TCA754 TCA758 TCE155 TCE166 TCE179 TCE195 TCE206 TCE212 TCE214
- TW SW not wired (HIACS default not in the macro list): TCA549
- TW TW not on the sheet: TCA582 TCE212
- TP SW not wired (HIACS default not in the macro list): TCA633
- TP TP not on the sheet: TCA634 TCA690 TCA711 TCA712 TCA713 TCA714 TCA715 TCA738
- FLK T1 not on the sheet: TCA686
- FLK T2 not on the sheet: TCA686
- PIF G not on the sheet: TCA740
- PIF TI not on the sheet: TCA740
- PIF SW not wired (HIACS default not in the macro list): TCA740 TCA741
- TB SW not wired (HIACS default not in the macro list): TCA767
- AM M printed, not in the macro list definition: TCA777 TCE503
- RL SW not wired (HIACS default not in the macro list): TCA777 TCE503
- TD TD not on the sheet: TCE053
- LCK K not on the sheet: TCE143
- PIV HL printed, not in the macro list definition: TCE168 TCE169 TCE191 TCE195
- PIV LL printed, not in the macro list definition: TCE168 TCE169 TCE191 TCE195
- PIV ML printed, not in the macro list definition: TCE168 TCE169 TCE191 TCE195
- G K not on the sheet: TCE190
- G KA printed, not in the macro list definition: TCE190
- I TI not on the sheet: TCE196
- LIN K not on the sheet: TCE202
- LIN B not on the sheet: TCE202
