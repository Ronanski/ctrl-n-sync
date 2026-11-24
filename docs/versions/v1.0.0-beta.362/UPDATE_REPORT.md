# LMYP OTS 1.0.0-beta.362 (LEADER : JENNIE, 2026-11-24)

Sumunod sa beta.361. Dalawang item: D18 (wala nang screen shortcut sa turbine auxiliaries) at D21 (condenser vacuum sa design).

## Ano ang inayos

1. **D18: tinanggal ang screen shortcuts na lop, eh, vex, tg, gland at hood (user "Go ayos").**
   - Wala nang `AN.turbine('lop' | 'eh' | 'vex' | 'tg' | 'gland' | 'hood')`. Walang TCS sheet sa likod ng mga ito.
   - Bawat makina ay pinapatakbo ng sarili nitong IBD sheet (TCS soft logic 331DM09784), gaya ng oil pumps TB-1 / 2 / 21 / 22. Ang pindot ay `AN.turbine('ibd', { id, pb })`, isang 1.5 s na pulse sa net ng push button.

   | Makina | Sheet | Push buttons (net) |
   |---|---|---|
   | Turning gear motor | TB-9 (page 58, TCE350 ~ 352) | START 20, AUTO 16, MANUAL 18, STOP 22, JOG 9 |
   | Main oil tank vapour extractor F-1937 | TB-12 (TCA655) | START 7, STOP 11 |
   | Gland steam exhauster | TC-28 (TCA680) | START 7, AUTO 3, MANUAL 5, STOP 9 |
   | Steam seal feed inlet valve | TC-31 (TCA650) | OPEN 4, AUTO 0, MANUAL 2, CLOSE 6 |
   | LP exhaust hood spray FV-CD1904 | TC-35 | OPEN 10, AUTO 0, MANUAL 9 |

   - Ang mga permissive ay galing sa gates ng sheet. Halimbawa, ang TB-9 START ay hindi tatakbo kung walang bearing oil (net 3) o hindi sarado ang MSV / ICV (net 0 / 1).
   - Ang TC-31 OPEN ang naglalagay sa PV-GS1031 sa serbisyo (gland seal). Ang hood spray sa AUTO ay bumubukas 3 s matapos ang GSE START at kapag mababa sa 15 % ang load (TC-35 net 3).
   - Ang black-out ng MCC-EMP11 ay ELECTRICAL TROUBLE na ng vapour extractor (TB-12 net 10).
   - Tinanggal ang `if (!c.brgOk) c.tg = false` (walang sheet). Sa TB-9, ang bearing oil ay start permissive lang. Iikot lang ang shaft kapag may bearing oil.
   - Ang mga pindot sa oil pumps ay ang dating `AN.turbine('oil', { p, op })` (MOP A / B, COP A / B, EOP).
   - Inayos din ang mga tumatawag: UAT check (src/ui/uat/check.js), ang turbine oil page (src/ui/plant/hmi-to.js) at ang HX faceplates (src/ui/plant/hmi-mock.js). Sinabihan si Rosé.
2. **D21: condenser vacuum sa design.**
   - Ang seawater inlet ay 30 / 30 °C na, ang design ng K1AU3-D1-0-039 R1 sheet K2MC3A-100 (in / out 30 / 35.6 °C). Dati ay 28.5 / 28.6 °C (galing sa snapshot 30.PNG, walang source).
   - Root cause kung bakit hindi nagbago kahit binago ang code: nasa `AN_SW` ang Tin, at dala ito ng save file ng Cold / 150 MW start (state.js `AN_STATE_OBJ`). Kaya inilabas ito sa `AN_SW_TIN`, gaya ng `AN_MU_QMV`.
   - Condenser pressure: ang mas mataas sa saturation ng steam at sa saturation ng air suction (HEI: 4.17 K na mas malamig kaysa steam) dagdag ang air partial pressure (`anCdP`). Dati ay saturation + air sa buong neck, at hindi iyon pisikal.
   - Sa 150 MW: cdP 0.067 kg/cm2 A, steam 37.9 °C (design 0.07 / 38.65 °C sa 195.7 MW). Hood ≈ 38 °C (Tsat ng condenser), dating 39.6 / 42 °C.

## Tests

- Bagong `tests/regress/tcs_ibd_devices.js`: **ALL PASS** (10 checks: TB-9 refused na walang oil, START / STOP; TB-12; TC-31 OPEN / CLOSE at gsOn; TC-28; TC-35 AUTO bukas; walang CLOSE ang TC-35; 150 MW AUTO at sarado).
- `tests/regress/plant_utilities.js` (totoong pindot): **ALL PASS**. Ang 150 MW SWP stop ay nag-trip pa rin sa CONDENSER VACUUM VERY LOW.
- build at check: SAME.

## Bilang

Walang nagbago sa ACCEPTANCE: 8 pasado, 38 natitira (sukat ng beta.356, Batas 5).

## Findings (may rekomendasyon)

| # | Finding | Rekomendasyon |
|---|---|---|
| D18-1 | Hindi naka-bind ang TE-6 / TE-7 (gland seal start / stop group). May reader errors ang netlist (FF output −1, sirang names). | I-retype ang TE-6 / TE-7 mula sa drawing, saka i-bind ang group START / STOP sa TC-28 net 13 / 11 at TC-31 net 11 / 8. |
| D18-2 | Walang CLOSE push button ang TC-35 sa netlist; ang MANUAL at OPEN lang ang nabasa. | Silipin ang drawing ng TC-35. Kung may CLOSE, idagdag sa typed sheet at sa TCS_IBD_PBN. |
| D18-3 | Walang ginagawa sa planta ang gland steam exhauster (c.gse) maliban sa hood spray AUTO. | I-model ang gland condenser vacuum (exhauster) sa anAuxStep kapag may source na. |
| D21-1 | Ang CCWHE seawater (AN_ACW Tsw 28.5) at ang UA nito ay naka-calibrate pa sa snapshot 27.PNG. | Ilipat sa design ng CCWHE datasheet (Batas 5) at sa AN_SW_TIN. |
| D21-2 | Ang ibang design constants na nasa AN_SW / AN_MU / AN_ACW ay dala rin ng save files. | Ilabas sa save object ang mga constant, maiwan lang ang state. |

## Para kay Rosé (HX / TCS pages)

Ilagay ang mga faceplate na ito na may tamang push buttons (gamitin ang `AN.turbine('ibd', { id, pb })`):

- **TB-9 Turning gear motor (ZS-LO1906):** START / STOP / AUTO / MANUAL / JOG. Status: `AN.tcs().aux.tg`, `aux.tgAu`.
- **TB-12 Vapour extractor F-1937:** START / STOP. Status: `aux.vex`.
- **TC-28 Gland steam exhauster:** START / STOP / AUTO / MANUAL. Status: `aux.gse`.
- **TC-31 Steam seal feed inlet valve (PV-GS1031 in service):** OPEN / CLOSE / AUTO / MANUAL. Status: `aux.ssfv`.
- **TC-35 LP exhaust hood spray FV-CD1904:** OPEN / AUTO / MANUAL. Status: `aux.hso` (bukas), `aux.hsp` (AUTO).
- **Oil pumps MOP A / B, COP A / B, EOP:** ang dating `AN.turbine('oil', { p, op })`.
