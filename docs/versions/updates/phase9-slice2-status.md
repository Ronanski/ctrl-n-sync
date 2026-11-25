# Phase 9 slice 2: mga status na salita ng HMI na walang laman (2026-11-26)

Sinukat: ang mga status box (ON / OFF, OPEN / CLOSED, RUNNING / STOPPED) ng 33 HX page sa 150 MW: 170; '-----' bago 32, ngayon 17.

## Naayos (15)
- Utos ng DCS sa turbine (2): TCS-DO1001 gland steam drain valve AUTO at TCS-DO1006 auto synchronize start = ang output ng DITL-115 na may parehong pangalan (`tce-io.js` ditlOut). Ito rin ang natatanggap na ngayon ng TCS (TCA905-24, TCE901-8).
- Electric trouble ng industrial water pump A / B, waste water pump A / B, transformer pit pump (5): walang electrical fault sa physics, normal = walang trouble.
- Fire water tank level low: normal = puno (pinupuno ng water treatment plant, gaya ng LS-IW0714; INFERRED).
- Waste water pit high high, transformer pit pump running, hypochlorite unloading pump B running (3): normal = wala (INFERRED: walang model ng ulan, tagas at truck).
- BFWP A / B suction manual valve open (2): normal = bukas (hindi tatakbo ang pump kapag sarado ang suction).
- GCB 52G1 REMOTE (lumalabas nang 2 beses sa generator page): normal = REMOTE (INFERRED: ang DCS ang nagsasara nito sa auto synchronizing).

## Walang value pa (17), may dahilan
- Utos ng TCS sa drain valve (4): IBD TE-1 / TE-6 na hindi pa nakakabit (TE-6 may reader error, D18-1). Gagawin sa Phase 6 TCS kasama ang HIACS backup.
- Modbus line A / B duty (2): wala sa dokumentong nabasa ang link program ng TCS.
- Condensate polisher train ready (1): naka-bypass ang polisher sa 150 MW at wala sa docs ang ready logic nito.
- Flash pipe level H / L (2): walang model ng level ng flash pipe.
- Deaerator level LL switch 4 (1): "LL 177mm" ang alarm list, pero hindi nakasulat kung saan sinusukat ang 177 mm.
- Ready to synchronize 52G / 52L at DCS generator trip output (3): walang drawn logic.
- Gland steam valves na wala sa gland model (4).

## Test
`tests/regress/hx_values.js` (nasa Checks) ay sumasaklaw na rin sa status box: 842 box, 43 walang value, lahat may dahilan. Pumasa. Pumasa rin ang lane test ng tcs-io, bop, integrator at qa/tag-db.
