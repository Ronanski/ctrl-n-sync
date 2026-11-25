# Lane 2 (TCS IO : TSUBASA): Modbus DCS -> PLC points of fly ash, ESP and CTCS on their DCS memory bits, 2026-11-25

## Binago
- **Signal tracer (Library ALL SIGNALS)**: ang bawat DO (DCS papuntang PLC) ng fly ash, ESP at CTCS ay nakakabit na sa sarili nitong DCS memory bit ng STN104 (halimbawa: AH-A Blow Tank Start PB = M.1260, Modbus 40051). Dati, "area, coil 40051" lang ang nakasulat.
- Batayan: ang memory list ng STN104 (AN.ades), remark "MODBUS ADDRESS <word> FOR <system>(DCS TO PLC)". 119 ang tugma sa parehong description. Ang 5 ay tugma sa puwesto ng bit, at pareho ang ibig sabihin kahit iba ang pagkakasulat: alive / watch dog, ALL HAMMER(S) / VIBRATOR(S) SWITCH AUTO, COMMUNICATION ACTIVE BIT.

## Bilang
- DO points na may eksaktong DCS address: 0 → 124 sa 124.
- Kasama ang PLC -> DCS DI / AI (SI word at bit, nasa tracer na) at ang AO (AB address): 562 sa 562 ang may DCS address na.
- May value: 0 sa 562 pa rin. Walang HMI page ng ESP, fly ash o CTCS na sumusulat sa mga memory bit na ito, at walang modelo ng package PLC para sa 383 PLC -> DCS points.

## Sinubok
- Headless sa tunay na page: ang search na "memory bit" sa tracer ay nagbibigay ng 124 rows, lahat may M.xxxx. 0 page error.

## Natitira
- HMI: ang PICT23 (ESP), PICT26 (fly ash) at PICT30 (CTCS) na may mga push button na sumusulat sa mga memory bit na ito.
- Modelo: ang estado ng package PLC (rapping hammer, vibrator, blow tank, TR set, CTCS). Kailangan ng vendor PLC logic o O&M bilang batayan.

Pirma: TCS IO : TSUBASA (lane 2).
