# Phase 11 (AOI) 2026-11-28: AN.storedE, the heat the plant holds

- What: `AN.storedE()` (engine api) and `LS_FG.storedE()` (page) give the heat held in the plant, kJ, from the engine's own stores (cfb.js `anStoredE`): bed, lining, drum water and evaporator steel (U.Cw), drum steam space and flash (AN_STORE.cs), reheat pipe, every tube-metal bank of hx.js (U.hxM), and the char store (U.cbed). Read only; no plant state changes.
- Why: the phase thread judges the FHI Fig 13 coal row on ramp minutes with the stored heat taken out (dF = dE/dt / (4259 x eta)). The sweep showed that the coal row misses only on load-down, where stored heat leaves the plant (efficiency 95 - 106 %), while the steady holds match FHI (150 / 90 / 45 MW: 90.2 / 90-91 / 88.4 % vs 90.9 / 91.0 / 88.5 %).
- Tested: headless st150, 787.8 GJ, then -0.24 GJ in 2 plant min (about 2 MW of noise). no-fit, one-path and u-const pass.
- Not tested: the judge wiring (the phase thread does it).
