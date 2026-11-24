# LMYP OTS 1.0.0-beta.364 (LEADER : JENNIE, 2026-11-24)

Sumunod sa beta.363. Tatlong bahagi: ang bagong permanenteng rule at ang bantay nito sa Checks, ang listahan ni Lisa, at ang bagong bilang.

## 1. Rule: walang per-load na ayos (user 2026-11-24, permanente)

- RULES.md 3.12 at HANDOFF (unang babasahin): walang per-load na table, interpolation o constant na ikinabit sa trend o snapshot ng planta sa physics. Ang physics ay galing sa first principles at design geometry. Ang set point ay galing lang sa logic curve ng planta.
- Bagong hakbang sa Checks: `tools/check/no-fit.cjs`. Binabasa nito ang engine. Bagsak ang Checks kapag may bagong linya na naka-key sa load o MW, o nagsasabing galing sa trend o snapshot ng planta, nang walang `DESIGN-SRC:` / `LOGIC-SRC:` na source sa linya.
- Ang 44 na lumang linya ay nasa `tools/check/no-fit-baseline.json`. Tatanggalin sila isa-isa (findings D27 ~ D36). Bawal magdagdag.

## 2. Listahan ni Lisa (sinuri laban sa docs)

| Item | Sanhi | Ginawa |
|---|---|---|
| No.2 HP heater level 5 hanggang 136 mm pagka-trip | **Totoong sira.** Ang condensate na pumapasok ay kinuwenta mula sa init na kinukuha ng feedwater, kahit wala nang steam galing sa turbine (sarado ang extraction). | `anHphStep`: ang condensate ay ang mas maliit sa init na kinuha ng feedwater at sa steam na pinapadala ng turbine sa pressure ng shell. Pantay ang dalawa sa steady load. Pagka-trip: walang bagong steam, kaya walang bagong condensate. |
| No.2 HP heater drain 52.2 vs 45.1 | Start transient ng lumang daan (AN.reset). Pagkatapos ng 10 min: 46.8 t/h sa feedwater na 474. | Test: ginagamit na ang "Start at 150 MW" ng app, at kinukumpara sa design feedwater na 458.7 t/h (FHI 1.1.2): 45.3 vs 45.147. |
| MST tumataas pagka-trip | **Physics, hindi sira.** Isinasara ng logic ang SH sprays sa MFT (DS-32 / 33). Mainit pa ang bed at refractory, at dumadaan pa rin ang purge air. Sumasara ang HP bypass (490 hanggang 40 t/h). Konting steam sa mainit na boiler, kaya umiinit. | Test: sinusukat laban sa alarm list TE-MS1004 H 548 C. |
| AH gas in 308 vs 322 | Malinis ang banks sa bawat start. Ang FHI Tab 3 ay design point na may design fouling. | Test: sinusukat sa design fouling. Gas in 322.8, PA 285.9, SA 301.9 (Tab 3: 322 / 285.8 / 301.6). Bagong finding: sa ganoong fouling, ang RH ay 530 vs 540. Mali ang iisang fouling sa lahat ng banks (D30). |
| Bed heat-up 747 C/h | Ang lumang test ay pinilit ang bed sa 470 C sa 150 MW na may coal: hindi ito kaso ng Fig 2. | Bagong test mula sa save na S10 (apat na burner): **661 C/h ang pinakamabilis na 5 min, at mga 300 C/h sa 30 min, laban sa FHI 110 at sa limit na 153.** Totoong sira ito, nasa susunod na beta (D31). |
| MAN station hold ramp | Ang lumang sheet faceplate ay natatakpan ng bagong shell. Ang HX card ng bagong HMI ay walang hold-to-ramp. | Para kay Rosé (D37): hold-to-ramp sa ▲ ▼ ng HX card, at bagong test doon. |

## 3. Para kay Rosé

- `AN.tcs().aux.ibd`: ang permissives ng TB-9 / TB-12 / TC-28 / TC-31 / TC-35 galing mismo sa IBD sheet (0 / 1, null kapag hindi pa tumakbo ang sheet), ayon sa hiling niya. Sinuri ang bawat net sa gates ng sheet.

## 4. Bilang (bagong paraan)

**2 pasado, 44 natitira.** Ang Part 1 ay 0 / 24: susukatin ulit sa buong kurba (sweep 40 ~ 100 %), hindi sa 3 load. Pasado sa Part 2: ABC / DITL sheets, at Bilis (135 ~ 144 FPS).

## Mga test

- PASADO: air_valves, hp_heaters, unit_trip (6 na kaso), tcs_ibd_devices, no-fit (44 luma, 0 bago).
- BAGSAK, totoong sira na susunod ayusin: bed_heatup (661 C/h).
- Hindi pa natakbo: gas_path sa bagong build (ang probe ay nagbigay ng 322.8 / 285.9 / 301.9).

## Susunod

Boiler physics mula sa FHI geometry: solids vs load (D3 / kKL), bed temperature, bed inventory, fouling bawat bank, bed heat-up sa burners. Pagkatapos: items 6 ~ 10 ng audit, ang curve sweep, at bagong bilang.
