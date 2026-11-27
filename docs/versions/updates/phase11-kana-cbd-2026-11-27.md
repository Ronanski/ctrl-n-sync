# Phase 11 KANA (drum): continuous blowdown sa design na presyon (2026-11-27)

Source: mass balance K1AU3-A2-0-001 sheet K1AU3-MB-019 (item 22 CBD 15 T/H, item 24 drum outlet 142.5 kg/cm2).

## Binago (nakikita ng operator)
- Continuous blowdown (MV-BD1002): ang 15 T/H ng design ay sinusukat na ngayon sa presyon ng drum ng parehong design sheet
  (142.5 kg/cm2). Dati 134 kg/cm2, ang drum ng lumang 150 MW na simula (snapshot). Sa 150 MW halos pareho ang daloy (mga 0.5 T/H
  na mas kaunti), sa mababang presyon sumusunod pa rin sa choked flashing na daloy.
- Tinanggal ang lumang paliwanag sa unit.js tungkol sa lumang curve model ng SH / RH temperatura (napalitan na ng hx.js).

## Sinubok
- 150 MW na simula, hawak 20 min: 150.8 ~ 151.2 MW, drum level ±10 mm, walang trip. Lane tests 69, 0 failed. no-fit at one-path pasado.
- Walang st150 sa PR na ito (rule ng phase thread: ang phase thread ang nagse-settle ng st150 sa main).
