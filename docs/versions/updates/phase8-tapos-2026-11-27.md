# Phase 8 TAPOS, 2026-11-27 ~2:45 AM PHT

Ano: sarado ang Phase 8 (komunikasyon). Ang bantay ay `tests/lanes/qa/phase8-gate.cjs` at ang bagong `tests/lanes/qa/phase8-link.cjs`.

## 1. Audit ng mga row na may value (laban sa docs)
Sinuri sa bawat run ng gate, mula 150 MW:
- address: DI word = SI1000 + (ma - 10001) / 16 at bit; AI word = SI1100 + (ma - 30001); DO word WM0210 / 0211 at bit (turbine list);
- direksyon laban sa uri (PLC to DCS = DI / AI, DCS to PLC = DO; package DCS to PLC = holding register 4xxxx);
- dulo sa TCS table (DI row sa DI / DO row, AI row hindi sa digital row; pareho ang tag);
- range ng TCS row = range ng DCS loop na nagpapakita ng word (STN10x_LOOP,USERTAG.xls, `src/ui/plant/dcslists.js`);
- value sa 150 MW nasa loob ng range ng DCS loop; digital value 0 o 1; walang analog sa bit; tama ang ayos ng bit sa bawat word.
Resulta: 0 mali. 91 analog value nasa loob ng range ng DCS loop. Sinubok na pumapalya ang audit kapag mali (sinadyang mali sa range: 11 FAIL).

## 2. Link (`docs/phase8/link.json`, `tests/lanes/qa/phase8-link.cjs`)
Mula sa docs at sinubok sa 150 MW:
- watchdog ng fly ash (40052.15 palabas, 40009.15 pabalik), ESP (40026.10 / 30018.15), CTCS (coil 18 / 15): nagbabago bawat cycle ng DCS, at ang bumabalik = ang ipinadala;
- TR01 ~ TR05 communication error = 0;
- TCS alive (10068) at DCS alive (DO25) = 1;
- Modbus I/F ng TCS: CPU(A) / (B) normal = 1, P.S.(A) / (B) abnormal = 0 (TCA906 -> TCA052 -> TCA820 -> TCA822);
- gateway alarm GCS10F-SYSERR (STN104 I.057B): 0 sa serbisyo, 1 kapag inilagay ng instructor, 0 ulit kapag inalis.
Walang docs (nosource, nakasulat ang mga nabasang docs): ano ang ipinapakita ng DCS kapag nawala ang link (hold / bad / zero), poll period ng GCS10F, oras ng watchdog bago mag-fail at ang alarm, ano ang ginagawa ng TCS kapag tumigil ang DCS alive. Kailangan ang manual ng HIACS GCS10F Modbus (wala sa nabasang set).

## 3. Basa ni YUA ng image-only docs (`/mnt/project-files/phase8-image-docs-2026-11-27.md`)
- Power factor: 4 mA = 0.5 LEAD, 12 mA = 1.0, 20 mA = 0.5 LAG (GEE-2015-0141 R2 p13). Sa scale na 0.5 ~ 1.5: lead = pf, lag = 2 - pf; lag = Mvar plus. TCA931-18, TCA990-14, Modbus 30141 at GCP meter: may value na (150 MW: pf 0.998 lag, nakikita 1.002). Pinalitan ang lumang komento na baligtad ("lag = pf").
- Fly ash: L+T fill mode = 1 (recommended mode, L5-1 Sec 4 p3 / p11, INFERRED). Vent filter REMOTE = 1 (umaandar kasabay ng blow tank, kaya PLC ang nagpapatakbo: derived).
- ESP purge fan / heater REMOTE = 1 (parehong rule ng ibang motor, ED p15, p87, p89, p90: derived).
- CE rapping field 4 / 5: O&M part 7 = 25 / 31 min, drawing ED p75 / 76 = 23 / 27 min at screen range 0 ~ 30 min (hindi kasya ang 31). Ang drawing pa rin ang gamit; nakatala ang pagkakaiba.
- DE rapping tuloy-tuloy (off 0): pareho na sa app.

## 4. Walang value, may dahilan (`docs/phase8/open.json`, 0 bukas)
- b 2: gland seal group command (walang utos).
- c 47: setting ng vibrator interval timer (screen range lang), AUTO / DCS Auto-Manual ng fan at heater, DCS CONTROL, Control Mode Remote at Unloading System Auto ng silo: wala sa lahat ng nabasang docs.
- m 160 (may-ari Phase 11, plant model): turbine metal temperature / expansion / rotor position 17, gland valve switch 4, blow tank cycle 79, vibrator ng fly ash 10 at ESP 20, silo level at sumusunod dito 10, TR kV / mA 20.
- Blow tank: kumpleto ang rule (L5-1 Sec 4 p11), pero walang numero ang fill timer, pressurized fail ("several seconds"), transported fail ("several minutes"), delay t at purge cycle. DERIVED: ang pressurize ng 1000 L na tangke hanggang 2.5 bar sa 20 Nm3/min na hangin ay hindi lalampas sa 2.5 / 1.013 x 1.0 / (20 / 60) = 7.4 s (tugma sa "several seconds"). Ang transport time ay kailangan ng solids loading ng linya, na walang docs; kaya hindi ito ginawa ngayon nang may imbentong numero, at nasa Phase 11 (process model).
- Silo: 1,600 m3, 10 m; HH tip EL 31.55 m (N11, 1,000 mm), H tip EL 30.52 m (N9, 2,000 mm), L FL+9.6 m (DERIVED mula sa D1-0-017 p60). Ang level ay estado ng proseso (pasok mula sa tangke, labas sa truck): Phase 11.

## Bilang
Turbine 214 / 237 may value; package 376 / 562 (fly ash 65, ESP 293, CTCS 18). `tests/lanes/pkg/pkg-modbus.cjs` MIN 372 -> 376, `tests/lanes/tcs-io/modbus-values.cjs` MIN 213 -> 214 (hindi puwedeng bumaba).

## Sinubok
phase8-gate PASS (row 8 TAPOS, lahat ng kondisyon), phase8-link PASS, pkg-modbus, modbus-values, io, scope-doc, integrator/tcs-dcs PASS; buong suite (run-all). Hindi sinubok: live sa browser (walang bagong screen; ang power factor ay lalabas sa turbine page at Library).
