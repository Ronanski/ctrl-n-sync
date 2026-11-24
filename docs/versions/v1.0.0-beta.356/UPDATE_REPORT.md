# LMYP OTS 1.0.0-beta.356 (LEADER : JENNIE, 2026-11-24)

Sumunod sa beta.355. Trabaho: D14 (bed sa 45 MW) at D15 (main steam pressure sa 45 MW laban sa HB).

## Ano ang inayos

1. **D15: ang 45 MW ay nasa HB sliding pressure na 98.9 na.**
   - Ang HB case 7 (PPE-14-0725) ay sliding: 98.9 sa 45 MW. Ang PR-OPE-5003 ay 123 ~ 126. Ang design ang masusunod (user 2026-11-24).
   - Sa Part 1 tool, ibinababa ng operator ang SV ng PIC-COBM nang 0.5 kg/cm2 bawat minuto sa faceplate hanggang 98.9.
   - Hindi biglaan. Ang biglang SV na 98.9 ay nagbaba ng coal sa 17 T/H at nag-MFT sa FURNACE TEMP. INADEQUATE FOR COAL FIRING.
   - Sa 98.9, steady ang planta: pressure 98.4 ~ 100, coal 31 ~ 33 T/H. Sa 122.3, umuugoy ito: pressure 117 ~ 128, coal 26 ~ 36, mga 45 min bawat ugoy.
2. **Mas mahinahong operator sa ilalim ng 220 T/H.** Isang pindot ng HIC-BM, tapos 3 min na pagtingin sa 3-min trend ng pressure bago ang susunod na pindot. Mga 10 min bago sumagot ang bed. Ang pindot bawat minuto ay nagpapaugoy ng coal (23 ↔ 41 T/H).
3. **TCS LOAD UP inuulit kapag tinanggihan.** ON pa ang DCS CONTROL MODE nang 2 ~ 3 s pagkatapos ng M.2016. Ang isang pindot na tinanggihan ay nag-iwan sa planta sa 72.7 MW.
4. Walang binago sa model, logic o gains. Tool lang (tools/accept/part1.cjs).

## Part 1 resulta (headless, 60 min settle, 30 min window)

| | beta.354 | beta.356 |
|---|---|---|
| PASS / FAIL (lahat ng cell) | 46 / 40 | **50 / 36** |
| MSP 45 MW (design 98.9) | 121.9 | **99.0** |
| MST / SH out 45 MW (505 / 507) | 500.0 | **502.0** |
| Heat rate 45 MW (2331) | 2299 | **2323.6** |
| Bed 45 MW (850 ~ 870) | 765 (724 - 799) | 769 (756 - 781) |

Buong table: tools/accept/results/part1-beta356.md. Pasado sa lahat ng tatlong load: 6 item.

## Findings (may rekomendasyon)

| # | Finding | Rekomendasyon |
|---|---|---|
| D14 (dagdag) | Logic ng planta ang 446 T/H na air minimum (ABC-002 LN40 / ABC-006). FHI Fig 12 sa 30 %: 365. Kaya O2 12.8 % (FHI 10.9) at bed 769 C. Ang lumang 765 C ay bahagi ring average ng ugoy ng operator; ngayon 756 ~ 781 na lang. | Huwag galawin ang logic. Itala ang layo sa FHI. Physics ng bed sa part load kasama ang D3. |
| D15 (dagdag) | Steady ang 45 MW sa HB 98.9, umuugoy sa procedure na 122.3. | Sa live test, i-slide ang SV papuntang 98.9 nang 0.5 bawat minuto. |
| D16 | RH outlet 489 C sa 45 MW, design 507. | Suriin ang RH bias damper (ABC-019) sa mababang load. |

## Test

| Test | Resulta |
|---|---|
| npm run -s build, npm run -s check | SAME |
| Part 1 (part1.cjs, 60 / 30 min) | 50 PASS / 36 FAIL, walang trip, 0 page errors |
