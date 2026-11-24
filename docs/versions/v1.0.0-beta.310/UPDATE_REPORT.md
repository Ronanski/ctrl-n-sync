# LMYP OTS 1.0.0-beta.310 (LEADER : JENNIE, 2026-11-23)

## What changed for the operator

Two values that were guesses now come from plant papers.

| Value | Before | Now | Source |
| --- | --- | --- | --- |
| ID fan efficiency, used for the heat the fan adds to the flue gas (stack gas temperature TT-FG1152) | 0.80 (guess) | 0.87 | ID fan specification sheet RF2-0582-DOC-6-0, K1AU3-D1-0-003 R0: total efficiency 87 %, static 84 % at design |
| Air heater gas side pressure drop when clean (base of the "air heater plugged" trainer fault) | 110 mmH2O (guess) | 113 mmH2O | Air heater gas DP transmitter DPT-FG1052-5 on the 150 MW HMI snapshot |

What it means: the stack gas reads about 1 C lower at full load (the fan adds about 9 C to the gas, not 10 C). The plugged air heater fault starts from the real clean pressure drop, so each step of plugging adds 113 mmH2O.

## Why total efficiency

All the shaft work of the fan ends up as heat in the gas. The heat added is the pressure rise divided by the efficiency, so the
total efficiency (87 %) is the one that turns the pressure rise back into shaft work.

## Findings

| # | Finding | Recommendation |
| --- | --- | --- |
| F1 | The fan sheet's design point is 17,621 m3/min at 150 C and 858 mmH2O rise; the model's ID fan is anchored on the 151 MW snapshot (-442 / -450 suction, -7 outlet). The two are consistent (design point is above MCR) but the fan curve is not used for the suction pressure. | Use the ID fan curve (speed lines 350 to 1141 rpm) if the suction pressure at part load is questioned. |

## Tests

See the PR.
