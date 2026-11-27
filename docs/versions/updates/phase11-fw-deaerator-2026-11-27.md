# Phase 11 part 5 (MODEL FEEDWATER : NANA): deaerator sa energy balance, BFWP current sa motor data (2026-11-27)

Batayan: user 2026-11-27 11:05 AM PHT "Ok sinisimulan naba plant model? Gawin nio na" at "Baka naman may existing na plant model na"
(ayusin ang lumang model sa lugar, walang bagong kopya). Hati ng code: /mnt/project-files/phase11/ownership-2026-11-27.md.
Design data na binasa sa PC (read-only): /mnt/project-files/phase11/fw/pc-reads-2026-11-27.md.

## Binago (nakikita ng operator)
- Deaerator pressure (PT-CD1104) at temperatura: galing na sa init na pumapasok at lumalabas (extraction steam, pegging steam, drain
  ng No.1 HP heater, condensate; feedwater palabas), hindi na sa lumang loop na naka-anchor sa snapshot. Sa design point ng
  K2MC2F-001 (5.05 kg/cm2 G, 158.4 C, steam 26.79 t/h) ang model ay 158.6 C at 27.1 t/h; walang constant na inayos para tumugma.
  Kapag nag-trip ang turbine, nawawala ang extraction at bumababa ang deaerator pressure ayon sa physics; ang pegging steam (PICCD1104)
  ang humahawak nito.
- Tubig papasok sa deaerator: extraction + pegging + drain ng HP heater (dati: 25 % ng turbine steam). Ang condenser ay hindi na
  tumatanggap ng steam na napunta sa deaerator at HP heaters.
- BFWP motor current: mula sa TECO AEZW-S2 data sheet (3550 kW, 6600 V, 355 A, eff 96.2 %, pf 0.91), hindi na ratio ng snapshot.
  Direct coupling: fixed speed 3580 rpm, walang scoop.

## Code
- Ang lumang feedwater code (BFWP, HP heaters, heater drains, spray / feedwater tags, feedwater valves) ay inilipat mula `unit.js`
  papunta sa `src/analog/engine/fw.js` (binura ang lumang kopya). Bago: AN_DA / anDeaStep, IF97 region 1 (tubig).
- Tinanggal: `source.js` R.PICCD1104 (cap / floor ng loop model) at ang Pex3 line; `plant.js` anCycFlows 25 % split.

## Sinubok
- `tests/lanes/fw/deaerator.cjs`: IF97 region 1 laban sa verification table; design point; 30 ~ 100 % sweep (tumataas nang tuloy-tuloy,
  laging mas mababa sa extraction stage).

## Hindi pa / susunod
- HP heater: energy balance sa steam table (sa ngayon: TTD na fixed at extraction na scaled sa design).
- BFWP suction strainer at branch loss (0.29 / 0.4 kg/cm2 galing snapshot) -> strainer data K1AU3-D1-0-052.
- Mga port (ext.da ng turbine, cd.out ng condenser) ay binabasa kapag naisulat na ng ibang bahagi.
