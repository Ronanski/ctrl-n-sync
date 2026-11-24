# LMYP OTS 1.0.0-beta.316 (LEADER : JENNIE, 2026-11-23)

Audit #5: three more values that had no source now come from the plant documents.

## What changed for the operator

| Equipment | Before | Now | Source and how |
| --- | --- | --- | --- |
| Make-up water pump P-0709A / B / C, time to full speed (direct on line) | 2 s, no source | 0.5 s | TECO motor sheet (K1AU3-D1-0-032 p8): 50 HP 2 pole 3555 rpm, GD2 0.905 kg m2, starting torque 160 %, breakdown torque 270 %. Inertia = GD2 / 4 = 0.226 kg m2; mean motor torque 215 N m less the pump on its recirculation (about 10 N m) = 205 N m; time = inertia x speed / torque = 0.226 x 372.3 / 205 = 0.41 s, rounded up to 0.5 s for the impeller. |
| ACWP P-1108A / B soft starter ramp | 10 s, "as the SWP", no source | 10 s, sourced | The 6.6 kV soft starter drawing (K1AU3-E1-0-131 p4, panel S-1A2 "M-1108A Aux. CW PUMP A 300KW") shows a Solcon HRVS-DN 140 A, the same type as the SWP. ACC. TIME 10 s is the vendor set value (O&M L23-3 manual 7.8). |
| ACWP discharge valve V-CW1007 / 1009, loss when fully open | 0.05 kg/cm2, no source | 0.05 kg/cm2, derived | Same method as Beta 312 (Crane TP-410): discharge flange DN350 (K1AU3-D1-0-033 p6, PACO KP14153 outline), 1500 m3/h, velocity 4.69 m/s; a 14" butterfly 35 fT = 0.445 x 1.12 m = 0.50 m = 0.049 kg/cm2. |

The make-up pump now reaches full speed in one scan, as a direct on line 50 HP motor does. The ACWP numbers do not change; they now have their source.

## Findings

| # | Finding | Recommendation |
| --- | --- | --- |
| F1 | The ACWP discharge valve type is not in the docs. The SOP throttles it to 5 % at start, so a butterfly is taken (Crane 10 ~ 14"). | Confirm the valve type on the P&ID K1AU3-PD-021 or in the field. |
| F2 | The ACWP check valves V-CW1006 / 1008 are on the HMI but their loss is not modelled (type not in the docs; a swing check would add about 0.07 kg/cm2, already inside the 27.PNG calibration of the users' loss). | Model it when the type is known. |
| F3 | The make-up pump impeller inertia is not in the docs (motor rotor only used). | Ask the pump vendor (KAO HONG KEW-65/200) for the impeller WR2, or measure the run-up time on site. |
| F4 | The ACWP soft starter setting is the vendor default; the plant setting may differ (as the SWP, Beta 314 F3). | Read the HRVS-DN START PARAMETERS page on panel S-1A2 / S-1A3. |
| F5 | Tests failing on main too (before this Beta, same results): `tests/regress/mu_ccw_model.js` 3 FAIL (ACWP-B auto start, CCWHE with no SWBP, Cold make-up header); `tests/regress/condensate.js` stops with an error (`cdHw` undefined). | Separate fix. |

## Tests

- Behaviour gate (20 plant min at 150 MW): ALL PASS.
- `tests/regress/mu_ccw_model.js`: the same 3 FAIL as main (F5).
- `tests/regress/condensate.js`: the same error as main (F5).
