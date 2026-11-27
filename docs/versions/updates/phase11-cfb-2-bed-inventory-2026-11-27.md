# Phase 11 part 1 (combustion + CFB furnace), step 2: bed inventory from the design

AOI, 2026-11-27 PHT. Rule-0 list 2026-11-24 item 2 (D29).

## Ano ang binago
- Ang laman ng bed sa full load (`AN_BI.t0`, `src/analog/engine/cfb.js`) ay galing na sa design. Ito ay FHI P2S7 Fig 9, kung saan ang furnace DP ay 1630 mmH2O sa 100 % MCR. Ang grate ay 15.507 x 7.684 m (T2), kaya 1630 x 119.1 m2 = **194.2 t**. Dati ito ay isang basa sa plant trend, 1465 mmH2O = 174.3 t.
- Ang dalawang furnace DP transmitter (ABC-006 AI0134 / AI0262) ay iisang DP na 1630 ang binabasa. Ang 6 mmH2O na agwat ay basa lang sa snapshot at walang source.
- Bakit: hawak na ng logic ang DP sa 1630 (DPICFG108 SV 1630, ABC-009A / B, bottom ash coolers AUTO). Kaya ang dating 150 MW ay may 194.5 t na sa bed, pero ang solids share ay 1.14 imbes na 1. Ngayon 1.02 na ito, malapit sa design anchor ng bed balance.
- Ginawa ulit ang 150 MW na simula (`src/data/st150.txt`, `tools/steady150/make.cjs`, 120 plant min).
- `tools/check/no-fit-baseline.json`: 41 -> 39.

## Sinubok
- Behaviour gate, 150 MW, 20 plant min: ALL PASS. Ang galaw ng MW ay 0.13 MW na lang (dati 1.05), ng pressure 0.17, ng level 3 mm, at ng MST 0.5 C.
- Ang bagong 150 MW: bed 873 C, furnace exit gas 853 C, coal 89.2 T/H, O2 3.64 %, bed 198 t.

## Hindi pa tapos (tapat)
- Ang bed ay 873 C laban sa design band na 850 ~ 870 (SU:10198); dati ay 869.7 C dahil lang sa fitted na solids share. Ang natitirang 3 ~ 13 C ay galing sa ibang bahagi ng balance (drum 133 vs 145 kg/cm2 ng anchor), hindi sa laman ng bed. Susunod: ang solids sa part load (kKL) at ang anchor ng bed balance.
