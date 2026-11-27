# Phase 11 part 1 (combustion + CFB furnace), step 2: bed inventory from the design

AOI, 2026-11-27 PHT. Rule-0 list 2026-11-24 item 2 (D29).

## Ano ang binago
- Ang laman ng bed sa full load (`AN_BI.t0`, `src/analog/engine/cfb.js`) ay galing na sa design. Ito ay FHI P2S7 Fig 9, kung saan ang furnace DP ay 1630 mmH2O sa 100 % MCR. Ang grate ay 15.507 x 7.684 m (T2), kaya 1630 x 119.1 m2 = **194.2 t**. Dati ito ay isang basa sa plant trend, 1465 mmH2O = 174.3 t.
- Ang dalawang furnace DP transmitter (ABC-006 AI0134 / AI0262) ay iisang DP na 1630 ang binabasa. Ang 6 mmH2O na agwat ay basa lang sa snapshot at walang source.
- Bakit: hawak na ng logic ang DP sa 1630 (DPICFG108 SV 1630, ABC-009A / B, bottom ash coolers AUTO). Kaya ang dating 150 MW ay may 194.5 t na sa bed, pero ang solids share ay 1.14 imbes na 1. Ngayon 1.02 na ito, malapit sa design anchor ng bed balance.
- Ayos sa ikalawang commit: ang save ng 150 MW na simula (st150) ay may dalang lumang anchor ng DP (1426 / 1432, snapshot), kaya ang DP na nakikita ng operator ay 1457 pa rin at hindi umabot ang 1630. Ngayon ang DP ay galing sa engine constant `AN_BI.dp0` (1630), hindi sa save.
- Ang 150 MW na simula (`src/data/st150.txt`) ay mula sa st150 ng main, pinatakbo ng 30 plant min sa bagong code (phase rule: huwag gawin mula sa wala, dahil nawawala ang line-up ng ibang lane).
- `tools/check/no-fit-baseline.json`: 42 -> 40.

## Sinubok
- Behaviour gate, 150 MW, 20 plant min: ALL PASS. Ang galaw ng MW ay 0.13 MW na lang (dati 1.05), ng pressure 0.17, ng level 3 mm, at ng MST 0.5 C.
- Bagong 150 MW na simula: bed 876.7 C, coal 88.8 T/H, bed 195.4 t, MW 151.1. Behaviour gate ulit: ALL PASS, MW galaw 0.21. Bottom ash lumang save test: 0 problema.
- Hindi pa nasusubok sa bagong ayos: ang SWEEP 150 -> 45 MW (ang naunang sweep ay tumakbo pa sa lumang DP).
- Alam na problema na hindi sa PR na ito: tcs-motors MOP-B (TCS macro state ng bagong st150, may owner na).

## Hindi pa tapos (tapat)
- Ang bed ay 873 C laban sa design band na 850 ~ 870 (SU:10198); dati ay 869.7 C dahil lang sa fitted na solids share. Ang natitirang 3 ~ 13 C ay galing sa ibang bahagi ng balance (drum 133 vs 145 kg/cm2 ng anchor), hindi sa laman ng bed. Susunod: ang solids sa part load (kKL) at ang anchor ng bed balance.
