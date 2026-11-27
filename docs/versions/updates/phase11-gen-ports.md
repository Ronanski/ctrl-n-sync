# Phase 11 part 6 (generator): ports

MODEL GENERATOR ELECTRICAL : YUI, 2026-11-27 PHT.

- Binago: isinusulat na ng generator part ang mga port nito sa `ports.js` bawat plant step (`unit.js anGenInt`): `gen` (MW, 52G), `aux.power` (house load ng `elec.js`), `q.ccw.YUI` (init ng generator coolers papunta sa closed cooling water, mula sa losses: 2,853 kW sa 150 MW) at `store.YUI` (kinetic energy ng rotor ng generator + exciter: H 4.01 s x 176.5 MVA x 16,200 / 39,900 ng GD2, GAE-2013-0136 R2 = 287 MJ sa 3600 rpm). Tinanggal ang `U.genQ` (ang port na ang iisang daan; nabasa ito ni SUZU).
- Walang nagbago sa numero ng planta: bagong sulat lang ito, walang ibang bahagi na bumabasa pa ng mga port na ito maliban kay SUZU (cooler duty, susunod niyang PR). Sweep: pareho sa bago at pagkatapos (walang binago sa physics).
- Sinubok: `tests/lanes/gen/gen-electrical.cjs` (port gen = U.MW, aux.power = house load, store.YUI 287 MJ, q.ccw.YUI), `ports.cjs`, `one-path.cjs`, `no-fit.cjs` pasado.
- Susunod: gen.W = shaft.W (RIN PR 669) bawas ang generator losses, kapalit ng pinagsamang loss ng turbine (AN_TBW lo / kq).
