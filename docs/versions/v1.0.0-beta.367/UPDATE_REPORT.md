# LMYP OTS 1.0.0-beta.367 (HMI : ROSÉ, 2026-11-24)

Sumunod sa beta.365. Isang bahagi: ang Warm at Hot sa start screen ay galing na sa totoong trip na pinalamig ng physics (RULES Q3, rule 0).

## Warm at Hot

- **Dati:** Cold load, tapos isinusulat ang mga numero ng FHI Fig 3 / 4 (drum 40 / 100, bed 360 / 700, metal 350 / 460; `unit.js AN_RESTART`). Fixed na estado ito, labag sa Q3 at rule 0.
- **Ngayon:** Cold load, tapos ang save point ng trip sa 150 MW na ginawa ni Jennie sa totoong click (bottle up, hinintay ng operator hanggang lumamig ang turbine metal). Nakapaloob sa app gaya ng "At 150 MW" (`src/data/stwarm.txt`, `src/data/sthot.txt`, gawa ng `tools/startsaves/make.cjs` mula sa `team-files/saves`).

| Start | Galing sa | HP turbine metal | Drum | Bed |
|---|---|---|---|---|
| Warm | WARM bottled up, CBD closed (mga 13 h pagka-trip) | 403.5 C (WARM band 230 ~ 420) | 108.5 kg/cm² | 323 C |
| Hot | HOT bottled up after turbine trip | 486.5 C (HOT band, lampas 420) | 96.1 kg/cm² | 736 C |

- Ang unit chip ay "Unit · Warm restart" / "Unit · Hot restart". Ang tooltip ng start screen ay sinasabi na kung saan galing.
- UI lang: `src/ui/shell/app.js`, `src/ui/shellc/shellc-home.js`, `src/index.template.html`. Walang binago sa engine.

## Mga test

- PASADO: bagong `tests/regress/warm_hot_start.js` (start screen > Warm / Hot > Operator > RUN 60 s, totoong click; walang page error, tuloy ang physics).

## Findings

| # | Nakita | Rekomendasyon |
|---|---|---|
| W1 | Hindi na tinatawag ng UI ang `AN_RESTART` / `anUnitRestart` (fixed Fig 3 / 4 state) | Jennie: tanggalin sa engine (rule 0) |
| W2 | Pagka-load ng Warm, ang TCS mode ay 'hot' kahit 403 C ang HP metal (warm band 230 ~ 420) | Jennie: tingnan kung naka-latch ang mode mula sa trip |
| W3 | Ang dalawang save ay gawa sa beta.240 / 241 | Gawin ulit sa bagong physics kapag binago ang boiler model, gamit ang parehong tool |

## Susunod

Screenshot ng bawat HMI page para sa approval, tapos ang 53 UI-only tags ni Lisa.
