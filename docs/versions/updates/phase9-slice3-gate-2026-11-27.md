# Phase 9 slice 3: bantay ng TAPOS ng HMI, 2026-11-27 ~3:35 AM PHT

Ano: `tests/lanes/qa/phase9-gate.cjs` (static, walang browser, parehong basa ng page gaya ng `tests/lanes/hmi-turbine/pages-bound.cjs`).
TAPOS ang row 9 lang kapag:
- bawat PASOK na equipment ng SCOPE 4.5 (K1AU3-L1-0-002 R0, 349) ay may simbolo sa isang HMI page. Puwede itong tag na nakasulat sa element ng page (tag, machine, loop o valve; kasama ang listahang "A / B", "A-D", "1001 to 1003"), o isang row sa `docs/phase9/equipment.json` map na nagsasabi kung aling element ang gumuguhit nito (at dapat naroon ang element);
- in-approve ng user ang bawat page (`approved` sa parehong file; COMMANDMENT 4: ang user lang ang nag-a-approve).
Ang mga kahon na walang value ay hawak pa rin ng `tests/regress/hx_values.js`.

Bilang ngayon: 191 / 349 may simbolo (tag sa page 138, map 53). 158 ang wala pang sariling simbolo. Karamihan ay strainer, orifice, safety valve, air cannon (27), sootblower na wala pa, fly ash transmitter (14), air / buffer tank, accumulator, silencer, ang cyclone at seal pot B (iisang simbolo lang ang nakaguhit para sa A at B), at ang generator air cooler A ~ D. Approval ng user: 0 / 33.

Map (53): mga simbolong nakaguhit na pero hindi nakasulat ang tag (hal. PAF = F-1053, IDF = F-1056, BFWP-A = P-1115A, ang motor na kasama sa simbolo ng pump, furnace = H-1001, drum = T-1001). Kapag iisang simbolo ang para sa dalawa (MSV A / B), nakasulat ito sa note.

Sinubok: phase9-gate PASS (row 9 BAHAGI, nagpi-print ng natitira bawat page); sinubok din na pumapalya ito kapag mali ang map (5 FAIL noong may map row ng tag na nasa page na). Walang binago sa screen.

Susunod: lagyan ng simbolo ang 158, page kada page, may larawan bago ipakita sa user.

## Dagdag (4:10 AM PHT)
- Drum and superheaters page: 4 strainer sa spray water line (STR-FW1003 / 1004 / 1005 / 1006), bago ng bawat spray valve, ayon sa R0 equipment list ("STR ... TCV INLET"). Walang label sa screen dahil masikip ang sulok; nakakabit sa listahan sa `docs/phase9/equipment.json`.
- Desuperheater ng reheat (DSH-FW1150) at ng auxiliary steam (DSH-CD1126): nakaguhit na, idinagdag sa map.
- Bilang: 197 / 349 may simbolo, 152 natitira.
