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

## Sea water, generator, turbine oil, gland steam (10 AM)
- Sea water: ball separators L-1112 / L-1111 sa condenser outlet A / B (PD-020 C-4 / C-5), walang label (map);
  ball vessels T-1115 / T-1116 sa tabi ng tube cleaning pumps (PD-020 D-6 / D-7). Kung bago o pagkatapos ng outlet hand valve
  ang separator: NOT IN DOCS.
- Generator: air coolers H-1971A ~ D sa ilalim ng generator, ayos A, C, D, B mula turbine end (PD-021, PD-027 A-1 ~ A-4).
- Turbine oil (Hitachi 310PB64-455, basa ni YUA): duplex oil filter S-1932A / B (dating "Oil filter"), control oil filters
  S-1933A / B, mist eliminator S-1936, purifier strainer S-1943 at coalescer S-1942, lube oil accumulators T-1934A ~ C,
  control oil accumulator T-1395 (nakalimbag T-n935), trip oil accumulator T-1938; air buffer tank T-1128 ng turning gear
  (PD-023 sh4/6).
- Condensate: drain trap Z-1912 ng gland steam condenser (PD-014 C-9); bagong simbolo `R.trap` (ISA bilog na may T).
- Hindi pa: OR-CW1001A / B (walang cooling water return line na nakaguhit sa turbine oil page).
- Bilang: 281 / 349 may simbolo, 8 wala sa docs, 60 natitira.

## Make-up at industrial water (10:30 AM)
- Make-up pumps: strainers STR-MU0001 ~ 3 sa suction pagkatapos ng V-MU0003 ~ 5 (PD-024 D/E/F-7); ang V-MU0003 ~ 5 ay
  valve symbol na ngayon (pula = bukas, click = field faceplate), hindi na status box.
- Industrial water pumps: strainers STR-IW0001 / 2 (PD-025 C/D-4/5).
- Potable water tank T-0114 (PD-026 C/D-6), walang signal sa I/O list kaya walang value.
- Hindi pa: RO-MU0709A ~ C at RO-IW0715A / B (min flow lines ay hindi nakaguhit sa page).
- Bilang: 287 / 349 may simbolo, 8 wala sa docs, 54 natitira.

## Oil burner, sampling, limestone at sand (11 AM)
- Diesel oil: ang strainer sa pagitan ng V-DO0004 at ng pumps ay STR-DO0002 (PD-022 E-4, DPIT-DO0001; equipment list item
  319), hindi STR-DO0001: naitama ang tag. Ang STR-DO0001 (truck inlet strainer, item 318) ay nasa truck inlet line ng tank;
  ang lugar nito sa PD-022 ay hindi nabasa (galing lang sa pangalan). Flame arrester Z-0701 sa vent ng tank (PD-022 B-3).
  Relief valve ZV-DO1001 sa burner supply pagkatapos ng FCV-DO1012 (PD-022 G-6).
- Sampling: measuring vessels Z-1102 / 1104 / 1106 sa itaas ng chemical tanks (PD-042), sampling rack Z-1140 (PD-044).
- Limestone at sand: vent filters S-1313 / S-1301 sa bubong ng silo (PD-062 / 063 B-3/4), air receiver T-1312 (PD-062 C/D-9).
- Bilang: 297 / 349 may simbolo, 8 wala sa docs, 44 natitira.

## Ash (8:40 AM)
- Fly ash transmitters (PD-073 sh1/9): anim na grupo sa collecting line papunta sa fly ash silo: S-1255A ~ D (air heater
  hoppers), S-1250A / B ~ S-1254A / B (precipitator fields 1 ~ 5). Ang limang conveying line FH-1-700 ~ 706 ay iisang linya
  sa page. Air tank T-1250 (PD-073 F/G-2) sa simula ng linya.
- Fly ash silo: vent filter S-1256 at vent fan F-1250 sa bubong, dry unloader L-1250 sa ilalim (PD-073 sh2/9).
- Bottom ash silo: bag filter S-1091 bago ang F-1091 (walang label, map), loading spout L-1903 sa ilalim (nakalimbag L-1093).
- L-1904 = ang two-way separator (nakalimbag L-1094); S-1092 = ang vibrating screens A / B (map).
- Mga bagong simbolo: `R.pots` (hanay ng maliit na vessel), `R.spout` (loading spout).
- Bilang: 319 / 349 may simbolo, 8 wala sa docs, 22 natitira.

## Furnace gas, sea water, min flow orifices (9:20 AM)
- Furnace gas: hydraulic coupling Z-1056 sa shaft ng ID fan (PD-051 F-8); air buffer tanks T-1064A / B ng biasing dampers
  (K1AU3-D1-0-070 R0): A sa reheater pass damper (PT-IA1064-A), B sa superheater pass damper (PT-IA1064-B). Walang label (map).
- Sea water: priming air ejectors Z-1113A / B (nakalimbag Z-1131A / B, PD-020 rev D A-7 / A-8), walang linya.
- Min flow orifices: RO-IW0715A / B (PD-025), RO-MU0709A ~ C (PD-024 B-8; kung aling orifice ang sa aling pump: NOT IN DOCS,
  ayos A, B, C), OR-CW1001A / B sa cooling water ng lube oil coolers (PD-021 D-3). Maikling sanga lang ang linya.
- Bilang: 331 / 349 may simbolo, 8 wala sa docs, 10 natitira.
