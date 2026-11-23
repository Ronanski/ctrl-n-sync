# LMYP OTS 1.0.0-beta.348 (LEADER : JENNIE, 2026-11-24)

Pangalawang beta sa ilalim ng "GO DESIGN". Maliit ang beta na ito: ang bed ash coolers lang (B4). Hindi pa isinama ang design bed anchor (D9) at ang solids sa mababang load (D3), dahil nag-trip ang planta sa test. Nasa ibaba ang dahilan.

## Ano ang inayos

1. **Furnace dP controller at ash coolers, naka-AUTO na sa 150 MW start (B4).**
   - Dati: DPICFG108 naka-MANUAL 0 %, at naka-MANUAL ang apat na bottom ash screw cooler (SICL1060A hanggang D), galing sa snapshot ng planta. Kaya nakatigil ang coolers sa full load.
   - Ngayon, ayon sa ABC-009A / B: naka-AUTO ang DPICFG108. Siya ang nagpapatakbo sa cooler master PIC-BASC at sa apat na cooler station, na naka-AUTO rin.
   - Ang set point ay ang FHI P2S7 Fig 9 normal na overall furnace pressure drop sa 100 % load, 1630 mmH2O (low limit 1450, high 2100).
   - Sa 150 MW start, 1548 mmH2O ang furnace dP. Kaya nakatigil pa ang coolers, at dahan-dahang napupuno ang bed (mga +1.2 T/H net). Aandar ang coolers kapag umabot ang dP sa 1630. Ito ang tamang kilos ayon sa logic.
2. **Na-rebuild ang st150** (150 MW start state) na naka-AUTO ang mga loop na ito: 151.05 MW, MST 541.4, RHT 539.1, steam 462.4 T/H, bed 942 C.

## Hindi isinama: D9 (bed 860 C) at D3 (solids sa mababang load)

Galing sa design ang mga constant:
- tbA 860 at cSol 10,211 kW/K;
- uaS 185.8;
- panels 76.1 kW/K bawat isa;
- kKL 3.8.

Tama ang steady anchor: furnace exit 840.0 C, walls 146.5 MW, panels 62.5 MW.

Kapag tumatakbo ang planta, ito ang nangyari:

- **Mula sa lumang start state (bed 917 C):**
  - Bumagsak ang bed nang 70 C sa loob ng 4 minuto.
  - Umabot ang coal sa feeder limit na 100 T/H.
  - Nag-trip sa drum level sa minute 23.
- **Mula sa bed na 860 C:**
  - May alon bawat 12 minuto na lumalaki. Ang lapad ng alon ng coal kada 10 minuto ay 6.5, 8, 10.5, 15, 18.5, at 24.6 T/H.
  - Nag-trip sa drum level sa minute 105.
- **Phase ng alon:**
  - Coal, tapos bed pagkalipas ng 2 minuto, tapos MST pagkalipas ng 2 minuto.
  - Sumusunod ang MW sa MST.
  - Sinasagot ito ng boiler master sa pressure pagkalipas ng 5 minuto.
  - Halos 0 ang spray 2 (design Tab 3: 462 papuntang 460 C), kaya walang kontrol sa MST sa mababang side.
- **Sa panels na 65 kW/K** (lahat ng iba ay design anchor pa rin): mas mabagal lumaki ang alon (4.3 hanggang 9.4 T/H sa 60 minuto).

Hindi ko tinono ang DCS gains o ang constants para lang tumigil ang alon. Hindi rin iyon papayagan ng "walang patch".

## Findings

| # | Finding | Rekomendasyon |
|---|---|---|
| D9 | Sa design anchor, lumalaki ang 12-minutong alon ng coal, bed, MST, MW at pressure hanggang mag-trip (minute 105). Bounded ang alon sa planta (MSP period 16 - 19 min). | Pag-aralan sa design anchor, galing sa physics: (1) lag ng panel metal at steam side (hx.js p1 / p2); (2) lag ng coal papuntang init (char burnout: sa model, wala pang 1 minuto; sa planta, 3 - 4 minuto); (3) gaano kabilis nakikita ng turbine MW loop (TCE195) ang epekto ng MST. Patch: team-files/plant-study/d9-d3-design-anchor-2026-11-24.patch. |
| D3 | Kasama sa D9 ang kKL 3.8. Wala itong epekto sa 150 MW. | Isama kapag stable na ang D9, at husgahan sa Fig 8 sa load sweep. |
| B4 | Ngayon pa lang naka-AUTO ang coolers. Hindi pa nasusubok ang pag-andar nila sa dP 1630. | Subukan sa mahabang takbo sa 150 MW, o mula sa save na mataas ang bed. |
| A1 | Nakatayo pa rin ang PIST10013 alarm (H 62.5 galing sa temporary list). | Kunin ang design first stage mula sa ABC-052 LN12, at ilagay ang H sa itaas ng VWO. |

## Tests

| Test | Resulta |
|---|---|
| npm run check | SAME |
| behaviour gate (20 min sa 150 MW, save / load, determinism) | ALL PASS |
| unit_load | ALL PASS |
| feedwater | ALL PASS |
| sootblower_steam | ALL PASS |
| ms_page_values | ALL PASS |
| furnace dP probe (10 min) | DPICFG108 SV 1630, PV 1548 papuntang 1550, coolers 0 (tama: dP < SV) |
