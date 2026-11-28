# Phase 11 part 7+8 (SUZU), fix 25: condenser outlet valve opening DERIVED at the design flow (2026-11-28)

Desisyon ng team (2026-11-28): ang mga pump ay nananatili sa EBARA curve, ang MB-020 ang design flow (2 x 17,900 t/h sa condenser). Ang opening ng outlet valve ay kinukuha sa physics, hindi na ang lumang 40 % (SNAPSHOT-TO-REPLACE).

Binago:
- `src/analog/engine/model/cooling.js` swCal: ang loss ng outlet valve V-SW1009 / 1010 ay butterfly na kapareho ng inlet valve (Crane TP-410 fT 25, `ki100`), `c.ko = ki100 / q^2`. Ang opening sa design point `c.oDes` = ang opening na nagbibigay ng natitirang pressure (inlet pressure ng condenser na galing sa pump curve, bawas ang vendor tube drop) sa MB-020 flow. DERIVED = 30 %. Ang discharge line papunta sa siphon pit ay NO-SOURCE (hindi kasama).
- `src/analog/engine/unit.js` AN_SW_V0: V-SW1009 / 1010 = `swCal().oDes` (dati 40).
- `src/analog/engine/api.js`: `AN.swV0()` read-only (ang start line-up ng seawater valves lamang).
- `tools/steady150/init/sw-outlet.js`: init para sa re-settle ng st150 (`node tools/steady150/settle.cjs <MIN> sw-outlet`); ang st150 ay may 40 % pa.

Sinubok (headless, 150 MW start, 120 s):
- Sa 30 %: 17,812 t/h bawat condenser path (design 17,900), PG-SW1501 1.86, condenser inlet 1.48 / outlet 0.85 kg/cm2 G, SWBP 1,029 m3/h.
- Sa lumang 40 % (st150 ngayon): 19,944 t/h bawat path, inlet 1.14: kaya kailangan ang re-settle ng phase thread pagka-merge.
- Guards: no-snapshot (cooling.js 4 -> 3), no-fit, one-path, u-const, ports: PASS.

Hindi sinubok: live app. Ang vacuum laban sa condenser vendor curve ay sa phase thread at MEI.
