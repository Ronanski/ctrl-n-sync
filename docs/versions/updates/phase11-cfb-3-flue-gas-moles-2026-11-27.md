# Phase 11 part 1 (AOI), rank 3: flue gas mole balance from FHI Tab 2

AOI, 2026-11-27 PHT, user "Go fix 11" (12:37 PM).

## Ano ang binago (lumang code tinanggal sa parehong PR)
- Bago sa `src/analog/engine/cfb.js`: `AN_FUEL` (FHI P2S7 Tab 2 performance coal; diesel C 86.5 / H 13.5 % textbook, NO-SOURCE sa plant docs) at `anFgMol` (mole balance bawat oras: CO2, H2O, SO2, N2, O2, wet at dry, mass, air needed, airR). Kasama ang CO2 ng limestone (CaCO3 93.66 %, Tab 3 p2), ang S na nahuli ng limestone (kumukuha ng O2), at ang steam ng wall tube leak.
- O2 ng analyzer (ABC-002 AT-FG1122 / 1123): **dry basis** mula sa mole balance. Tinanggal ang lumang `21 x (1 - air needed / air)` at ang paggamit sa diesel bilang "2.55 t coal" para sa hangin (heat ratio iyon ng PR-OPE-5002, hindi air ratio). Batayan ng dry: FHI Fig 7 y-axis "flue gas volume oxygen level dry base" (basa ni YUA, `/mnt/project-files/aoi-doc-reads.md` C); L20 APH O&M p18 wet 2.954 % = dry 3.53 %.
- Stoichiometric air `U.afs` = 5.46 kg / kg coal, kinukuwenta mula sa Tab 2 (`AN_FUEL.afs`); tinanggal ang literal na `AN_GAS.afs` sa boiler.js.
- Gas papunta sa backpass `U.mG` = mass ng mole balance (sarado ang mass: 596 air + 89.5 coal - ash = 679.40 T/H, pareho). `U.fgM` = ang buong gas (para sa port gas.fe).
- Gas velocity share ng solids (`uRel`): dami ng gas (moles x temperatura ng bed) laban sa DESIGN gas ng 100 % MCR (`AN_FG0`: Fig 13 coal 89.5 + limestone 12, Fig 12 air 596). Dati ay air lang laban sa air ng "Start at 150 MW" (U.taf0). Ang U.taf0 ay natitira lang sa draft (furnace pressure) loop model, na sa fans fix (rank 10) aalisin.
- Ginawa ulit ang 150 MW na simula (`src/data/st150.txt`).

## Sinubok
- Sa bagong 150 MW: O2 3.58 % dry (Fig 7 3.6), air needed / air 0.834 = excess air 19.9 % (Tab 3: 20 %), coal 90.1 T/H (Fig 13 89.5), bed 873 C, solids share 0.994.
- Behaviour gate 150 MW 20 plant min: ALL PASS (MW galaw 0.26, pressure 0.31, level 7 mm, MST 1.1 C).
- no-fit 0 bago; one-path PASS; ports PASS; build OK.
