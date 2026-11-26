# Phase 9 slice 6: YUA's full P&ID position file, part A (2026-11-27, 8:10 AM PHT)

Source: /mnt/project-files/phase9-pid-positions-2026-11-27.md (flow diagram set K1AU3-A1-0-001 Rev A, read by eye).

## Binago (nakikita ng operator)
- Feedwater: restriction orifice sa recirculation ng bawat feed pump (OR-FW1001 / 1002, PD-017 A-2); lube oil unit ng bawat feed pump
  (Z-1115A / B, PD-017 G-2 / G-5).
- Condensate: suction strainer ng dalawang condensate pump (PD-016 D-9 / D-10); strainer bago ng curtain spray at flash spray 2
  (STR-CD1003 / 1004); orifice sa minimum flow (OR-CD1001) at sa make-up (OR-MU1002); strainer bago ng deaerator (STR-CD1008).
- Reheat and turbine bypass: strainer sa pagitan ng block valve at control valve ng tatlong spray (STR-FW1008 HP bypass, STR-FW1007
  reheater, STR-CD1005 LP bypass).
- Bagong simbolo: restriction orifice (plate sa pagitan ng dalawang flange), hx-real.js R.orifice.
- Gate: ang equipment na hindi iginuhit sa flow diagram set ay nakalista sa docs/phase9/equipment.json `nodoc` kasama ang sheet na binasa
  at ang kulang na dokumento (53: 27 air cannon PD-061 note 3, 11 Hitachi turbine oil, 3 coal feeder air buffer tank, 2 main steam drain
  orifice, iba pa). Walang simbolong inimbento para sa mga ito.
- Bilang: 222 / 349 may simbolo, 53 wala sa drawing, 74 natitira.

## Hindi pa
- OR-FW1003 / 1004 (balance line): hindi nakaguhit ang balance line sa page.
- P-1716A / B (polisher booster pumps), T-1135 (flash pipe): susunod.

## Dagdag (8:30 AM)
- Combustion air: suction silencer ng PAF at SAF (S-1053 / 1054, nakalimbag na Z-1053 / Z-1054 SILENCER), filter silencer ng dalawang
  fluidizing air blower (S-1055A / B), silencer pagkatapos ng surge valve (Z-1055A / B; dati salita lang na "silencer"), ang manual damper
  ng hot primary air papunta sa furnace (V-FA1001 ~ 1004, isang simbolo), at ang lube oil cooler ng PAF (Z-1053).
- Bilang: 233 / 349 may simbolo, 53 wala sa drawing, 63 natitira.

## Part 2 ni YUA (7:35 AM): RB rev D at vendor docs
- Nakita na ang 45 na dating NOT IN DOCS: OR-MS1001 / 1002 (PD-011 / PD-014 rev D), Z-1113A / B (nakalimbag Z-1131A / B, PD-020 rev D),
  Z-1130 (PD-027 rev D), 27 air cannon (Martin LB-C214007-02 / 03), T-1064A / B (K1AU3-D1-0-070), 11 turbine oil item (Hitachi 310PB64-455).
  Tinanggal sila sa `nodoc`; gagawan ng simbolo.
- Natitira sa `nodoc` (8): STR-CD1011, T-0761 / 0762, S-1960, T-1065A ~ C, OR-CD1002.
- Bilang: 233 / 349 may simbolo, 8 wala sa docs, 108 natitira.

## Air cannon (9 AM)
- Coal page: 9 air cannon bawat bunker (T-1066A ~ I = bunker A, T-1067 = B, T-1068 = C), nakaguhit sa cone ng bunker.
  Source: Martin LB-C214007-02 / 03 (bilang at lokasyon sa cone). Kung aling set ang aling bunker: INFERRED mula sa ayos ng tag.
- Bilang: 260 / 349 may simbolo, 8 wala sa docs, 81 natitira.
