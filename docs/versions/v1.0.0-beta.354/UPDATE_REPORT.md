# LMYP OTS 1.0.0-beta.354 (LEADER : JENNIE, 2026-11-24)

Sumunod sa beta.352. Trabaho: D10 (hindi umaabot sa 45 MW) at D11 (patay ang limestone sa 150 MW start).

## Ano ang inayos

1. **D10: hindi model fault. Logic ito ng planta.**
   - Sa ilalim ng 220 T/H main steam (mga 72 MW), MAN nang kusa ang HIC-BM at EIC-TM. Ito ang BU-CMD M.2013 / M.2016 ng ABC-001C (PR-OPE-5002 "At 230 T/H MSF put Boiler Master to Auto"; OPERATOR_GUIDE 7.2).
   - OFF din ang DCS CONTROL MODE (M.0101 = 0). Kaya sinusundan ng EIC-TM ang target ng TCS, at sa TCS panel na ibinababa ang load.
   - Walang binago sa logic o sa model.
2. **Operator sa Part 1 tool (tools/accept/part1.cjs) sa ilalim ng 220 T/H**, ayon sa OPERATOR_GUIDE 5.3, 7.2, 7.3, 7.7 at PR-OPE-5003:
   - TCS LOAD UP 45 MW, 0.4 %/min (0.6 MW/min). Ito ang tawag ng button ng Turbine page.
   - HIC-BM: isang pindot ng ▲ / ▼ (1 %) bawat minuto, ayon sa error ng pressure at sa trend nito.
   - 1 ELEMENT ng drum level (ABC-010 M.054F) sa 230 T/H.
   - O2 trim AICFG112 sa 50 % (neutral).
   - HIC-TADBS (PA flow bias) mula -26.7 papuntang 0 T/H sa faceplate. Kung hindi ito gagawin, pinuputol ng total air cross limit LN40 ang coal (446 T/H = 35 %, 414 = 0). Dahil dito, umuugoy ang coal sa 23 ↔ 45 T/H.
3. **D11: tumatakbo na ang limestone sa st150.**
   - Sa make.cjs, ang operator start ng Limestone page, sa unang scans: isolating valves OPEN (DITL-LS212), feeder START (DITL-LS110), system START (DITL-LS10). SOx control AICFG10571 AUTO SV 200 (19.PNG).
   - Ang bed lime ay nasa design Ca/S 2.71 (FHI Fig 13). Ubos ito sa lumang start dahil matagal na patay ang feeding.
   - st150 rebuilt: 90 min, walang trip. 151.0 MW, coal 89.9 T/H, limestone 4.9 T/H, bed 869.8 C, drum 133.4, MST 539.7, RHT 537.8.

## Part 1 resulta (headless, 60 min settle, 30 min window)

| | beta.352 | beta.354 |
|---|---|---|
| PASS / FAIL (lahat ng cell) | 34 / 52 | **46 / 40** |
| "45 MW" column, totoong MW | 72 | **44.6 - 45.6** |
| Bed 45 / 90 / 150, C | 821 (sa 72 MW) / 863 / 870 | 765 / **862** / 870 |
| Coal 45 / 90 / 150, T/H (design 32.3 / 56 / 89.5) | - | **32.3 / 55.4 / 89.9** |
| Limestone 45 / 90 / 150, T/H (design 4.3 / 7.1 / 12) | 0 / 0 / 0 | 2.8 / 4.9 / 4.9 |

Buong table: tools/accept/results/part1-beta354.md.

Pasado sa lahat ng tatlong load: main steam temperature (row lang), CRH flow, HRH flow, final feedwater °C at T/H, RH spray, coal.

## Findings (bago, may rekomendasyon)

| # | Finding | Rekomendasyon |
|---|---|---|
| D10 (dagdag) | Ang MAN sa 220 T/H ay logic ng planta (M.2013 / M.2016), hindi model fault. Ang 45 MW ay kamay ng operator. | Tapos ito sa tool. Ganito rin dapat sa live test: TCS LOAD UP, HIC-BM sa pressure, TADBS 0, O2 trim 50 %. |
| D11 (dagdag) | Tumatakbo na ang limestone, pero 4.9 T/H ang max. Ang MH ng AICFG10571 ay 35 % (parameter workbook), at 35 % × 14 T/H = 4.9. Ang design ay 12 T/H (FHI Fig 13), at 270 - 280 ppm ang SOx laban sa SV 200. | Suriin ang AO range ng SOx output papunta sa rotofeeder speed (DITL-LS240 "0~14 T/H") laban sa MH 35 % at sa FHI Fig 13. Huwag galawin ang limit hangga't walang document. |
| D14 | Bed 765 C (724 - 799) sa 45 MW, design 850 - 870. Ang total air ay nasa logic minimum na 446 T/H (FHI 365), kaya O2 12.8 % (FHI 10.9). Malamig ang bed dahil sa sobrang hangin. | Ihambing ang air minimum ng logic (ABC-006 LN5 446 T/H) sa FHI Fig 12 sa 30 % load. Physics ng bed sa part load (kasama ang D3). |
| D15 | Main steam pressure 121.9 sa 45 MW. Ang HB case 7 ay 98.9 ata (sliding). Hawak ng operator ang PIC-COBM SV 122.3 (PR-OPE-5003 "Maintain MS Pressure 123 ~ 126 ksc"). | Sumasalungat ang procedure sa HB. Itala ang dalawa. Ang procedure ang sinusunod ng operator. |

## Test

| Test | Resulta |
|---|---|
| npm run -s build, npm run -s check | SAME |
| st150 rebuild | 90 min, walang trip, limestone 4.9 T/H, bed 869.8 C |
| Part 1 (part1.cjs, 60 / 30 min) | 46 PASS / 40 FAIL, walang trip, 0 page errors, totoong 45 MW |
