# Phase 11 KANA: SH pressure drop sa buong daloy, stored heat ng drum mula sa tubig na nasa saturation (2026-11-28)

Sources: FHI P2S7 Tab 3 (SH drop law), FHI P2S8 Tab 2 (water weights), FHI P2S7 Tab 1 (downcomers), K1AU3D-101 / -109 (drum),
B-0-001 (evaporative steel), IAPWS-IF97. Finding ng RIN (load rejection).

## Binago (nakikita ng operator)
- SH pressure drop: kinakalkula na sa LAHAT ng steam na lumalabas sa superheater (turbine + HP bypass + blow-off + SH safety
  valve). Dati turbine lang: kapag nag-trip ang turbine at bukas ang HP bypass, umaakyat ang presyon sa labas ng SH hanggang sa
  presyon ng drum at bumubukas ang SH safety valve (115 T/H). Ngayon sa turbine trip mula 150 MW: MSP 124.8, walang safety valve,
  drum level dip mga -230 mm (dati -594 mm).
- Stored heat ng drum at evaporator (Cw): 545 MJ/K mula sa tubig na nasa saturation sa 150 MW (51 t: downcomers, risers sa void
  0.23, drum sa ilalim ng NWL) x dh_f/dT 6.4 (IF97) + bakal 437.7 t x 0.5. Dati 953 MJ/K (tubig ng hydro test na malamig at puno,
  kasama ang economizer). Mas mabilis na gumagalaw ang presyon sa pagbabago ng firing, gaya ng totoong boiler.

## Sinubok
- 150 MW hawak 20 min: 150.9 ~ 151.1 MW, level ±9 mm, walang trip. Turbine trip probe: walang SH safety valve lift.
- Lane tests 74, 0 failed (bawat commit). no-fit, one-path, u-const pasado. Walang st150 at sweep (rule ng phase thread).

## Bukas
- Kung kasama ng B-0-001 437.7 t ang bakal ng economizer (may sariling 112 MJ/K ang hx.js). Ang dami ng tubig ay hawak sa 150 MW.

## Governor sa 0 habang 150 MW ang apoy (gen-electrical reverse power case), sa 194 s, PR 714 laban sa main
- Drum 153.4 vs 148.2 kg/cm2. Ang HP bypass + SH safety valve (mga 240 T/H) ay dumadaan na sa SH drop, at mas maliit ang Cw (545 MJ/K).
- Level 276 vs 233 mm, +43 mm. Hinati:
  - thermal expansion ng 147 m3 na tubig (economizer / wall / downcomer), rho 600.9 vs 610.0 kg/m3: +99 mm;
  - mass balance (mas mababa ang FW): -16 mm;
  - mas maraming steam sa riser (sw 131 vs 91 mm): -40 mm.
- Ang +43 mm ay galing sa mas mataas na drum pressure (pisika), hindi bagong swing. Lumalampas ito sa DRUM LEVEL H.H. 254 mm, kaya nag-MFT sa 194 s bago ang reverse power relay. Hindi binago ang test; ang generator lane ang may hawak ng case.
