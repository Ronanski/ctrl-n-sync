# LMYP OTS 1.0.0-beta.446 (EIMI, lane 6, 2026-11-25)

Shared HMI core para sa dalawang HMI lane (boiler at turbine). Hiningi ng MINAMI at ng TCS lane.

## Ano ang idinagdag
- **Monitor rows ng machine.** `HX.M(..., { mon: [V(...)] })`. Ang bearing, winding, vibration at heater ay lumalabas sa PERMISSIVE · TREND · MONITOR faceplate, sa ilalim ng heading na MONITOR, hindi sa drawing. Ito ang standard ng user (2026-10-31): dalawang faceplate, nasa pangalawa ang monitor. Nakasulat din ito sa README rule 6. May `words` para sa on / off point.
- **VCB point.** `HX.M(..., { vcb: key })`. Ang VCB lamp ng CONTROL faceplate ay bumabasa na sa I/O point. Kapag walang key, sumusunod pa rin ito sa motor state gaya ng dati.
- **'an:' dotted path.** Halimbawa, ang `'an:lpHt.H2.dr'` ay `AN.unit.lpHt.H2.dr`.
- **TCS CRT buttons at lamps.** Ang `crt:<port>` ay press na naka-hold nang 3000 ms. Ang `crtl:<sheet>|<key>` ay lamp na ON / OFF. Pareho silang ----- habang hindi tumatakbo ang TCS program. Nasa isang lugar lang ang API names (hx-app.js `CRT`), para pangalan lang ang papalitan pag nag-merge ang API ng lane 9.

## Findings
| # | Finding | Rekomendasyon |
|---|---------|---------------|
| 1 | Sa compact shell, nakatago ang lahat ng row pagkatapos ng FIELD block (VCB, CURRENT, monitor) hanggang buksan ang FIELD. Kaya hindi lumalabas kahit kailan ang monitor rows ng mga lumang page. | Inayos na: ang mga row lang ng FIELD block ang tumitiklop (class `fld`) |
| 2 | Wala pa ang live API ng TCS program (TCE.press / TCE.read) | Palitan ang pangalan sa hx-app.js `CRT` pag ibinigay ng lane 9. Stand-in lang ang ginamit ng test. |

## Test
- tests/regress/hx_fp_mon.js ALL PASS (16 checks). Bago na ring CI step: HX SHARED CORE.
- Screenshot ng monitor faceplate: tama ang heading, unit at decimals, at ON ang word ng heater.
