# Phase 11 part 6 (generator): one generator model

MODEL GENERATOR ELECTRICAL : YUI, 2026-11-27 PHT.

- Binago: ang generator page (page 17, HMI, house load ng elec.js) ay may sariling Mvar mula sa fixed power factor 0.977 ng screen 37.PNG at sariling field na naka-scale sa screen na iyon. Ang TCS I/O, Modbus at var-hour meter ay gumagamit ng physics ng `tcs-gen.js` (EMF behind Xd 1.92 pu, TR 2310 Xt 0.137 pu, 230 kV bus; GEE-2015-0152 R1 p6, GAE-2013-0136 R2, K1AU3E1-0003 rev 2). Dalawang sagot sa iisang makina (150 MW: 33.1 laban sa 8.8 Mvar). Ngayon iisa na: `anGenEl` ay binabasa ang `U.gen` (Mvar, power factor, stator current, terminal voltage, exciter field 4.5 A / pu at 6.14 ohm, GAE-2015-0004 R1). Tinanggal ang lumang `AN_GEN.pf / xd / If / Vf / E0`. Naayos din: ang open circuit voltage bago 52G ay hindi na napaparami ng speed nang dalawang beses.
- Sinubok: `tests/lanes/gen/gen-electrical.cjs`: sweep 45 ~ 150 MW (0.5 MW bawat hakbang) ng phasor model, V curves 310SD23-270 R1 sa loob ng 2 %, at sa 150 MW page = TCS sa lahat ng generator value. Field sa 151.8 MW 8.92 A (screen 37.PNG 8.7 A, pang-check lang). `modbus-values.cjs` pasado.
- Hindi sinubok: ang galaw ng Mvar habang inaayos ng operator ang 90R (hindi nagbago ang code nito).
- Natitira: generator temperatures (ngayon naka-scale pa sa screen P35SHAFT), ports, motor current mula sa load. Ang plant air compressor sa black-out ay kay SUZU (`anAirStep`), naipasa ang finding.
