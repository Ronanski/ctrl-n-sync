# LMYP OTS 1.0.0-beta.344 (LEADER : JENNIE, 2026-11-24)

Unang beta sa ilalim ng "GO DESIGN" ng user. Design documents na ang target: FHI P2S7 curves, Tab 3, heat balance PPE-14-0725. Ang plant snapshots at trends ay sanity check na lang.

## Ano ang inayos (model, hindi patch)

1. **SH panels, bumalik sa design CALC (D1).** Ang beta.342 ay naka-tono sa plant snapshot (panel 1 UA 117, panel 2 63). Bumalik na ang dalawa sa 65 kW/K, ang CALC mula sa design panel heat na 62.5 MW at ang FHI Fig 10 spray na 12.4 T/H sa 150 MW.
2. **Sumusunod na ang turbine MW per T/H sa temperatura ng steam (T1).** May sariling design MST / RHT ang bawat heat balance case: 505 C sa 30 %, 520 sa 40 %, 529 sa 50 %, at 538 mula 60 % pataas (PPE-14-0725, binasa bawat sheet). Sinusunod ng trabaho ng HP ang MST, at ng IP / LP ang RHT, sa ratio ng absolute temperature laban sa case sa parehong flow: dh = cp T1 (1 - (p2 / p1)^((k - 1) / k)). Kapag nasa design temperature, 1 ang factor, kaya eksaktong HB ang MW. Kalkulasyon ito, hindi curve fit.
3. **Design na ang mga test target (D6).**
   - unit_load: MSF galing sa HB, MST / RHT galing sa Fig 6, coal galing sa Fig 13.
   - feedwater: HB main steam 458.3 + design CBD 15 T/H (MB-019) = 473.3 T/H.
   - sootblower panel #1: ang design CALC ng panels (metal 412.7 C).
4. **st150 rebuilt (D2)** sa bagong model: 150.95 MW, MST 541.0, RHT 538.1, steam 462.6 T/H.

## App vs design sa bawat load (load sweep, 45 plant min bawat hakbang)

| Load | % MCR | Steam flow app / HB | MST app / Fig 6 | RHT app / Fig 6 | SH spray T/H app / Fig 10 | Furnace app / Fig 8 | Coal app / Fig 13 | O2 app / Fig 7 |
|---|---|---|---|---|---|---|---|---|
| 151.1 MW | 100.7 | 463 / 458 | 541 / 541 | 538 / 541 | 13.9 / 12.5 | 866 / 840 | 91.5 / 89.5 | 3.3 / 3.6 |
| 131.5 MW | 87.1 | 401 / 400 | 540 / 541 | 537 / 541 | 8.1 / 8.2 | 841 / 812 | 79.9 / 78.7 | 3.8 / 3.6 |
| 111.5 MW | 73.4 | 338 / 339 | 539 / 541 | 538 / 541 | 1.9 / 4.4 | 787 / 785 | 68.7 / 66.9 | 5.7 / 3.6 |
| 91.5 MW | 61.1 | 281 / 278 | 523 / 541 | 528 / 541 | 0.0 / 0.3 | 726 / 757 | 55.6 / 56.9 | 7.3 / 3.6 |
| 76.5 MW | 52.0 | 239 / 236 | 504 / 535 | 520 / 535 | 0.0 / 0.0 | 673 / 729 | 46.7 / 48.8 | 8.9 / 4.4 |

Ano ang ibig sabihin para sa operator:

- **Mula 150 hanggang 110 MW:** halos design na ang steam flow, MST, spray at coal.
- **Sa 90 MW pababa:**
  - Kulang ang init ng steam: MST 523 / 504 C, design 541 / 535.
  - Malamig ang furnace.
  - Sobra ang hangin: O2 7.3 / 8.9 %, design 3.6 / 4.4.
- Ang mga ito ang D9, D3 at D4 sa susunod na mga beta. Nakasulat na ang derivation, galing lahat sa design.

## Findings

| # | Finding | Recommendation |
|---|---|---|
| D9 | Ang bed anchor (937 / 955 C) ay galing sa plant trend. Ang design ay 850 - 900 C (P2S4), at hold 850 - 870 (SU:10198). App 945 C sa 150 MW. | Ilipat ang anchor sa 860 C. I-derive ulit ang uaS / cSol sa design 150 MW inputs. |
| D3 | Ang kKL 9.2 (solids sa part load) ay galing sa plant scenario. Sa design inputs (Fig 7 / 8 / 12 / 13), 2 - 3.5 ito, kaya masyadong kaunti ang solids sa part load. Ito ang dahilan ng malamig na MST at furnace sa 90 MW pababa. | I-solve ang cSol / kKL mula sa 2 design points (Fig 8 sa 100 % at 60 %). I-check lang sa 4 na natitirang Fig 8 points, ±15 C. |
| D4 | Ang height law (xW / xP) ay geometry, kaya mananatili. | Husgahan sa Fig 6 (±5 C) at Fig 10 pagkatapos ng D9 + D3. |
| D5 | Ang fouling tau 56 h ay galing sa plant trend. | tau 8 h (PR P3S3, blow kada shift / araw). Ang start states ay nasa design fouling (AH gas in 322 C). |
| B4 | Sa full-load start, naka-Manual 0 % ang DPICFG108 (galing sa plant snapshot), kaya nakatigil ang ash coolers. | AUTO ayon sa ABC-009A, SV galing sa FHI Fig 9. Kasama sa D9 beta. |
| A1 | Nakatayo ang PIST10013 alarm sa full load. Ang H 62.5 ay galing sa "DCS temporary values" list (2016-09-12). | Kunin ang design first-stage pressure mula sa ABC-052 LN12. Ilagay ang H sa itaas ng VWO. Kasama sa D9 beta. |

Buong derivation: `team-files/plant-study/15-boiler-balance-2026-11-23.md`, section "D3 / D4 / D5 (+ D9)" (PC lang).

## Mga test

| Test | Resulta |
|---|---|
| check | SAME |
| gate behaviour 20 min | ALL PASS (MW 150.95 → 151.08) |
| ms_page_values | ALL PASS |
| feedwater, sootblower_steam | tingnan sa ibaba |
| unit_load | 2 FAIL sa 60 MW, na totoong design gap: coal 34.1 vs Fig 13 40.0, at O2 12.2 % vs Fig 7. Kasama sa D3 (sobra ang hangin at kulang ang solids sa mababang load). Hindi ito tinono para pumasa. |
