# Phase 11 part 7+8 (SUZU), fix 25: condenser outlet valve opening DERIVED at the design flow (2026-11-28)

Desisyon ng team (2026-11-28): ang mga pump ay nananatili sa EBARA curve, ang MB-020 ang design flow (2 x 17,900 t/h sa condenser). Ang opening ng outlet valve ay kinukuha sa physics, hindi na ang lumang 40 % (SNAPSHOT-TO-REPLACE).

Binago:
- `src/analog/engine/model/cooling.js` swCal: ang loss ng outlet valve V-SW1009 / 1010 ay butterfly na kapareho ng inlet valve (Crane TP-410 fT 25, `ki100`), `c.ko = ki100 / q^2`. Ang opening sa design point `c.oDes` = ang opening na nagbibigay ng natitirang pressure (inlet pressure ng condenser na galing sa pump curve, bawas ang vendor tube drop) sa MB-020 flow. DERIVED = 30 %. Ang discharge line papunta sa siphon pit ay NO-SOURCE (hindi kasama).
- `src/analog/engine/unit.js` AN_SW_V0: V-SW1009 / 1010 = `swCal().oDes` (dati 40).
- `src/analog/engine/api.js`: `AN.swV0()` read-only (ang start line-up ng seawater valves lamang).
- `tools/steady150/init/sw-outlet.js`: init ng re-settle; ang valve ay gumagalaw nang 2 % bawat plant minute (bilis ng operator), hindi biglang hakbang.
- `src/data/st150.txt`: re-settle 30 min sa ibabaw ng st150 ng main gamit ang `sw-outlet` (isang beses na exception na inaprubahan ng phase thread 2026-11-28, dahil hindi pwedeng magkahiwalay ang code at ang state: sa 40 % at sa bagong valve law ay gumalaw ang MW nang 3.98 sa Checks gate, band 2).
- `src/analog/engine/model/cooling.js` (bug, naayos): ang naka-save na sagot ng sea water network (U._swR, U._swK) ay ginamit pa rin pagkatapos magbago ang model, dahil ang key ay valve at bilis lang. Kasama na sa key ang mga constant ng network (swCal), kaya kinukuwenta ulit kapag iba ang model.

Sinubok (headless, 150 MW start, 120 s):
- Sa 30 %: 17,812 t/h bawat condenser path (design 17,900), PG-SW1501 1.86, condenser inlet 1.48 / outlet 0.85 kg/cm2 G, SWBP 1,029 m3/h.
- Sa lumang 40 % (st150 ngayon): 19,944 t/h bawat path, inlet 1.14: kaya kailangan ang re-settle ng phase thread pagka-merge.
- Guards: no-snapshot (cooling.js 4 -> 3), no-fit, one-path, u-const, ports: PASS.

Re-settle (30 plant min, sa ibabaw ng st150 ng main pagkatapos ng PR 736):
- Bago: MW 150.85, drum 142.93, main steam 126.37 kg/cm2, steam flow 464.2 T/H, outlet valve 40 %.
- Pagkatapos: MW 151.09, drum 143.41, main steam 126.74, steam flow 466.8 T/H, outlet valve 30 %, condenser flow 17,848 t/h bawat path.
- AUTO pa rin: PIC-COBM, AICFG112, FIC-CM, HS-COAL.
- Behaviour gate 20 min: ALL PASS (MW max move 0.42, main steam 0.29, walang trip). cw_model: ALL PASS.

Hindi sinubok: live app. Ang vacuum laban sa condenser vendor curve ay sa phase thread at MEI.
