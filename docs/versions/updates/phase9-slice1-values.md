# Phase 9 slice 1: mga value box ng HMI na walang laman (2026-11-26)

Sinukat: 33 HX page, simula "Normal operation at full load" (150 MW), plant model tumatakbo. 672 value box; 42 ang '-----' bago, 26 ngayon.

## Naayos (16), bawat isa may pinagmulan
- Generator panel (turbine interface, 11): ang analog output ng DCS papunta sa metro ng generator control panel (tcs-dcs.json rows 'out', drawing GAE-2013-0136) ay walang ABC sheet na nagpapakita ng logic, kaya inuulit nito ang DCS input ng parehong dami (iisang pinagmulan, `src/digital/tce-io.js` MB 'GCP:*'): current A / B / C (6.37 kA), Mvar (8.5), voltage A-B / B-C / C-A (13.79 kV), frequency (59.97 Hz), MW (D).
- Var-hour (GCP-AI1006): integral ng generator Mvar, gaya ng watt-hour (`tcs-dev.js` U.dev.mvarh). INFERRED: lagging (export) Mvar lang ang binibilang; ang anyo ng metro ay wala sa drawing.
- Target MW sa turbine (TCS-AO1001, STN101 AO0359): ang output ng EIC-TM (unit.js U.aoTM), ang binabasa ng TCE930-5.
- Gland steam temperature papunta sa TCS (TT-AS1017-1, STN102 AO0471): retransmit ng TT-AS1017 (tcs-dcs.json, TCA931-3).
- Cyclone gas (furnace gas, 3): TT-FG1092-B = furnace exit gas papasok sa cyclone B (parehong gas ng A, parallel ang dalawang cyclone, P&ID PD-051); TT-FG1096-A / B = pangalawang thermocouple sa labasan ng cyclone (I/O list "(2)" katabi ng TT-FG1095 "(1)"), U.gCy.
- PT-IA1128 (turbine oil): instrument air buffer tank T-1128 ng turning gear (snapshot OPERATING_POINTS PIIA1128): walang daloy palabas, kaya presyon ng instrument air header (gaya ng PT-IA1064-A / B).

## NO-SOURCE (26), walang value
- Power factor (TCS-AI1009, GCP-AO1007): ang TCS ay nagpapadala sa anyong 0.5 ~ 1.5 ng transducer (lag = pf, lead = 2 - pf); hindi pa nabasa ang anyo sa sheet.
- Industrial water (6): tank level, pump header pressure, strainer DP, valve position: wala pang model (ang tangke ay pinupuno ng water treatment plant, labas sa saklaw).
- Turbine readings (18): metal temperature ng casing / rotor, expansion, rotor position, SI1240: wala pang model ng metal ng turbine.

## Test
Bago: `tests/regress/hx_values.js` (nasa Checks): bawat value box ng 33 page sa 150 MW ay may value, maliban sa listahan sa itaas na may dahilan; kapag nagka-value ang isa, kailangang alisin sa listahan (lumiliit lang). Pumasa dito: 672 box, 26 walang value. Hindi sinubok: Cold / Warm / Hot start, at ang hitsura ng page (walang bagong guhit).
