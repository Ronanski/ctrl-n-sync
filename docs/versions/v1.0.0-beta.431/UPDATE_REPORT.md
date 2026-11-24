# v1.0.0-beta.431: TCS sheets: ang mga value na nakasulat sa drawing pero hindi na-type, nabasa na sa buong PDF (TCS LOGIC : MARIA, 2026-11-25 PHT)

## Binago
- Binasa ang 173 bukas na block sa buong "TCA / TCE - SOFT LOGIC DIAGRAM OF TCS.pdf" (331DM09788 / 331DM09784, 2014-04-18; nasa PC lang, team-files\tcs-docs). Marami ang may nakasulat na value sa tabi ng block (HL / LL, K, TP / TD / TW, T1 / T2) o FG table (*1 ~ *4) sa ibaba ng page, na naka-type lang bilang text. Ngayon nasa `pr` ng bawat sheet (45 sheets), may pahina.
- Hindi isinulat ang anumang value na wala sa page: TCA530 FG A005 / A022, TCA548 FG A040 / A042, TCA777 / TCE503 FG, TCA825, TCE101, TCE214, TCE500 FG C040 / C041 ay walang curve sa page; nanatiling bukas.
- TCA777 / TCE503 RL B038: may SW wire sa drawing (kasama ng LG B016) na hindi nababasa dahil nagsimula ang linya sa block; inayos ang data.
- ML 62 PA (parameter modify) ay walang SW sa symbol nito (TCA019): hindi na bukas na item.
- Mula kay TSUBASA (lane 2), 38 maling PIO port:
  - 28 G-sheet "DI" time relay (G-1B, 2B, 5A, 5B, 6A, 6B): binabasa bilang PI/O kahit timer block ito. Bug ito: ang kumukuha ng output ay nakakuha ng 0, hindi ng timer. Naayos: ang box na block din ay block.
  - 9 TRIPLE DETECTOR2 / 2OO3 (TCE060 ~ 069): function box, hindi PI/O. Block na walang meaning pa (hindi pa tumatakbo ang mga sheet na iyon, gaya ng dati).
  - "(TCS400-1)" ng TCE022: halimbawa lang sa explanation sheet. Ang TCE022 at TCE023 (LOGIC / PI/O TABLE EXPLANATION SHEET) ay hindi logic: tinanggal sa programa (dati ay nabibilang na "tumatakbo").

## Bilang (bago -> ngayon)
- Lahat: 185 ng 421 -> 195 ng 419. TCE / TCA: 173 ng 407 -> 183 ng 405 (2 explanation sheets tinanggal; +12 na tumatakbo dahil sa nabasang value). G: 12 ng 14.
- Checker ng SAORI: 195, 0 depekto.
- Bukas na items: 108 -> 43. PIO ports: 474 -> 436.

## Sinubok
- tests/tce/sheets.cjs, tests/tce/run.cjs, tce_check, build --check, checker ng SAORI. Headless.

## Hindi sinubok
- Walang nakikitang pagbabago sa app para sa operator (hindi pa naka-load ang tce-run.js sa app). Ang dist ay binuo ulit dahil kasama ang sheet files.

## Dagdag (QA : SAORI, Aug 2017 PDF check)
- Ang sheet-to-sheet link: pinipili na ng reader ang PINAKAMALAPIT na output connector, hindi ang una na abot ng radius. 290 link na dati ay laging 0 ay bumalik (hal. TCE169 HEAT SOAK MODE mula sa TCE168 C). Ang 2 natitira (TCE151.C mula TCE150, TCA541.Z1 mula TCE152) ay umaabot sa connector sa page 107 / 109; ang linya ay na-type mula sa connector kaya hindi nabasa: inayos ang data.
- INITIAL: dati ay galing sa TCE022 (explanation sheet). Ngayon: EHG = TCE050 TP 002, COMM = TCA100 TP A001, ayon sa "(TCE050)" / "(TCA100)" na nakasulat sa ilalim ng ref. 5 TCA ref ang may "(TCA050)" na wala sa set: COMM INITIAL ay TCA100 lang.
- Bagong test: lahat ng 2141 joined link ay umaabot sa output ng pinanggalingan (0 nawawala; sa lumang reader 290 ang nawawala), at TCE169 input C ay sumusunod sa TCE168 C kapag pinilit.
- Checker ng QA (tests/lanes/qa/tce-complete.cjs): COMPLETE 195 ng 419 (logic 140, tables 55), 0 depekto.

## Dagdag: parameter mula sa PA (ML 62 PARAMETER MODIFY, TCA019)
- Ang PA<n> na may numerong N ay nagbibigay ng parameter sa block N ng sheet (hal. TCE196 PA3 005 -> I 005: TI / HL / LL; TCA533 PA2 010 -> CMP 010 HL / LL; TCE195 PA2 027 -> LMS 027 HL / LL; TCE190 PA2 013 -> RL C013 RI / RD; TCA634 PA1 005 -> TP A005). Ang pangalan ng parameter ay ang nakasulat sa input o sa wire nito. Kung walang nakasulat, bukas pa rin (TCA740 PA4 009 -> PIF 009, TCE202 PA2 004 -> LIN 004), maliban sa TCA536 PA2 003 / 007: iisang wire ang dalawang input kaya pareho ang HL at LL.
- Bilang: 195 -> 196 ng 419 (checker ng QA: COMPLETE 196).

## Natitirang bukas (`node tests/tce/sheets.cjs --list`)
- FG curve not on the sheet: TCA530 TCA548 TCA777 TCA825 TCE101 TCE214 TCE500 TCE503
- CMP SW not wired (HIACS default not in the macro list): TCA530A TCA534 TCE145 TCE206 TCE226 TCE227 TCE228
- CMP HL not on the sheet: TCA533
- TW SW not wired (HIACS default not in the macro list): TCA549
- TP SW not wired (HIACS default not in the macro list): TCA633
- PIF G not on the sheet: TCA740
- PIF TI not on the sheet: TCA740
- PIF SW not wired (HIACS default not in the macro list): TCA740 TCA741
- TB SW not wired (HIACS default not in the macro list): TCA767
- AM M printed, not in the macro list definition: TCA777 TCE503
- PIV HL printed, not in the macro list definition: TCE168 TCE169 TCE191 TCE195
- PIV LL printed, not in the macro list definition: TCE168 TCE169 TCE191 TCE195
- PIV ML printed, not in the macro list definition: TCE168 TCE169 TCE191 TCE195
- G K not on the sheet: TCE190
- G KA printed, not in the macro list definition: TCE190
- I TI not on the sheet: TCE196
- LIN K not on the sheet: TCE202
- LIN B not on the sheet: TCE202
- SG K not on the sheet: TCE212
