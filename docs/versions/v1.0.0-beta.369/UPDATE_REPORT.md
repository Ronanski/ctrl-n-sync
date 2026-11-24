# LMYP OTS 1.0.0-beta.369 (HMI : ROSÉ, 2026-11-24)

Sumunod sa beta.367. Isang bahagi: ang Warm at Hot ay nasa start screen na rin ng LMYP OTS station (RULES.md 7, Q3).

## Warm at Hot sa station

- **Dati:** ang station start screen ay 150 MW at Cold lang.
- **Ngayon:** 150 MW, Cold, Warm, Hot. Ang Warm at Hot ay parehong save point ng beta.367 (trip sa 150 MW, bottle up, pinalamig ng physics). Hinihintay ng station na tapos ang load bago ipakita ang plant (`window.lsRestartKind`).
- UI lang: `src/station/station.js`. Walang binago sa engine.

| Start | HP turbine metal | Drum | Bed |
|---|---|---|---|
| Warm | 403.5 C (WARM band 230 ~ 420) | 108.5 kg/cm² | 323 C |
| Hot | 486.5 C (HOT band, lampas 420) | 96.0 kg/cm² | 736 C |

## Mga test

- PASADO: bagong `tests/regress/station_warm_hot.js` (binubuo ang station page, apat na state sa start screen, `?state=Warm` / `?state=Hot` naglo-load ng tamang save, walang page error).
- PASADO: `tests/regress/warm_hot_start.js` (desktop start screen).

## Findings

| # | Nakita | Rekomendasyon |
|---|---|---|
| S1 | Pagka-load ng Warm sa station, ang coordinated control panel ay Manual na may turbine master SP 0 at pressure SP 122 | Normal sa bottled-up na unit; ang operator ang magse-set bago mag-roll. Bantayan sa live test |
| S2 | Ang W1 / W2 ng beta.367 (`AN_RESTART`, TCS mode 'hot' sa 403 C) bukas pa | Jennie: engine side |

## Susunod

Screenshot ng bawat HMI page para sa approval, tapos ang 53 UI-only tags ni Lisa.
