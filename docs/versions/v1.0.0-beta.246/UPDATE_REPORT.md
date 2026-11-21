# Update report v1.0.0-beta.246

Engine fix for Rosé's real-click finding at 150 MW: plant values showed `-----` after a load while the plant was paused.

## Changes

| # | What changed | Why | Where |
|---|---|---|---|
| 1 | `anDitlPos` reads a field valve position while the one world is built (`WORLD.on` + `WORLD.idx`), the same as `anDitlRun` | Before, it read the positions only while the world scans (`WORLD.live`), so a paused plant read no valve. The spray flows FT-FW1109 / 1119 / 1149 / 1059 were empty after a load until the plant ran. The positions (MST) are part of the world state. | unit.js anDitlPos |
| 2 | The cyclone lining, the heat transfer chain and the reheat outlet pipe are now one function, `anHxRun`. The unit step calls it, and a load calls it at dt 0 (`anTagsNow`). | U.hxO (the chain outputs) was written only by a plant step. A state from an older engine had no TT-BR1020 / 1030 / 1120-1 / -2 outputs until the plant ran. At dt 0 every metal, lining and pipe temperature stays where it is (each moves by x dt); only the outputs are worked out. | unit.js anHxRun, anTagsNow |
| 3 | `src/data/st150.txt` (the "Normal operation at full load" start) rebuilt by `tools/steady150/make.cjs` with this engine | The old one (11-19) was older than the model values added since, such as furnace gas, air, ash coolers, sampling, oil burners and shell expansion. Those stayed `-----` while paused. It is steady after 10 plant min: 151 MW, coal 89.8 T/H, bed 863 C, drum 133.4 kg/cm2, MST 540.05 C, RH 537.8 C, drum level -0.09 mm. | src/data/st150.txt |

## Findings

| # | Finding | Recommendation |
|---|---|---|
| F1 | After switching Engineer to Operator, the page froze for about 3.7 s and the first paint (`-----`) stayed on the screen. CDP profile: draw ran twice (lsPlant, then lsPlantFit), 3.8 s; HX.mount minText getClientRects took 2.1 s and plates getBBox 1.4 s. | UI, not the engine. Sent to Rosé (beta.247): draw once per open, and measure the texts once per page. |
| F2 | A start state made by the steady150 tool goes out of date when the model gains display values | Rebuild `st150.txt` with `tools/steady150/make.cjs` in the same Beta that adds a plant model value. The load-time pass (`anTagsNow`) covers old user save points. |
| F6 | (beta.243) The drum falls about 32 mm per plant hour in the WARM hold | Resolved, physics. All drum outflows were 0 in the hold (probe). The fall is the thermal shrink of the cooling water: Tw -1.2 C/h x d(rho) 2.65 kg/m3/C x 147 m3 / 14.05 kg/mm = 33 mm/h, against 32 measured. PR-OPE-5004-01 bottle-up step 4 "fill the drum to +200 mm" is the reserve for it. |

## Checks

- Paused scan, station build, 150 MW start, all 22 HX pages: beta.244 had `-----` on 8 pages (Reheat, Drum, furnace gas, air, ash, sampling, oil burners, turbine); beta.246 has none. 0 page errors.
- Running scan on all 22 pages: no `-----`.
- Gate (behaviour.cjs): result in the PR.
