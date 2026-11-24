# LMYP OTS 1.0.0-beta.314 (LEADER : JENNIE, 2026-11-23)

## What changed for the operator

The seawater debris filters S-1502 (DN2400, after the SW pumps) and S-1504 (DN600, after the SW booster pumps) now clean themselves
the way their own panel does, from the vendor manual (O&M L18-4 p36 "Timer setting" and p47 "DF operation by DP mode"; L18-5 the same):

| Panel timer | Value | What it does |
| --- | --- | --- |
| System cycle timer | 4 h | A flush every 4 hours from the end of the last one, even if the DP is low |
| DP high sequence lead timer | 30 s | DP above 80 mbar (800 mmH2O) for 30 s starts a flush (a short surge does not) |
| Flushing timer | 3 min | Length of one flush |

At the start "At 150 MW" both filters are now IN OPERATION (DITL-39), as the manual requires while the cooling water runs (L18-4 p40
"System must be in operation when main cooling water is running"). Before, both showed NOT IN OPERATION and S-1502 started at a DP of
1,227 mmH2O (above its 1,000 maximum) and never flushed.

The SWP soft starter ramp (10 s) now names its source: the ACC. TIME of the Solcon HRVS-DN soft starter (O&M L23-3 manual 7.8).

## Why the filters never flushed

The plant model asked the DITL-39 drawing "is the filter in operation?" by reading its wires, and a row driven by the filter panel
input read 0 even when the panel was in operation. The model now reads that row as the control system shows it.

## Findings

| # | Finding | Recommendation |
| --- | --- | --- |
| F1 | The fouling rate of the seawater (how fast the DP climbs) is not in the docs and no plant trend has the S-1502 / S-1504 DP. The model keeps clean to 800 mmH2O in 4 h, the same as the vendor's cycle timer, so in normal water the timer flush comes first. | Get a day of PDT-SW1502 / 1504 trend from the plant DCS and set the rate from it. |
| F2 | The SW booster pump star-delta change-over (5 s) is still not from a document. From the TECO motor sheet (D1-0-034 p10: GD2 7.694 kg m2, LRT 185 %, BDT 260 %), in star the pump reaches about 86 % speed in under 1 s and cannot go higher, so the change-over time is set by the starter timer, which is not in the docs. | Read the timer setting at the MCC of P-1503A / B / C. |
| F3 | The SWP soft starter: the manual value is the vendor's set value (ACC. TIME 10 s, current limit 400 % of FLA), but the SOP gives 500 A starting current (about 190 % of the motor's 260 A). The plant's own setting differs from the vendor value. | Read the HRVS-DN settings at the panel (MAIN & PROTECT / START PARAMETERS pages). |
| F4 | The start "At 150 MW" (src/data/st150.txt) was changed by `tools/steady150/df-on.cjs`: only the two filter panels (in operation) and the filter dirt (0, just flushed). | Next time st150 is rebuilt with tools/steady150/make.cjs, the filters will already be in operation. |
| F5 | `tests/regress/sootblower_steam.js` fails 8 checks on main too (before this Beta). Its numbers move with the seawater side: steam used by one N-1011 operation was 189 kg on main, 148 kg with the filter timers on the old start (filters not in operation, DP stays high), 114 kg with this Beta (header 0.27 kg/cm2 as main). The table value is 276 kg, so all three are off. | Separate fix: find which plant value links the sootblower steam to the seawater side, then fix the sootblower model to the table. |

## Tests

- New `tests/regress/df_timers.js`: ALL PASS (both filters IN OPERATION at 150 MW, DP high for 25 s = no flush, 35 s = flush, DP back near 500, 4 h timer flush).
- `tests/regress/cw_model.js`: ALL PASS.
- Behaviour gate (`tests/gate/behaviour.cjs`, 20 plant min at 150 MW): ALL PASS.
- `tests/regress/sootblower_steam.js`: still failing as on main; numbers in F5.
