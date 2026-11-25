# v1.0.0-beta.553 (ALARMS AND CURVES : AKIHO, lane 5): Modbus lists ng fly ash, ESP at CTCS

## Ano ang nagbago
- **562 Modbus point na wala pa sa app ay nasa app na.** Dati, turbine system (237) at SCADA (199) lang ang Modbus list sa app. Idinagdag ang tatlong package PLC sa GCS10F / STN104:
  - fly ash: 141 PLC → DCS, 25 DCS → PLC (picture PICT26);
  - ESP (electrostatic precipitator): 225 PLC → DCS, 153 DCS → PLC (PICT23), kasama ang T/R set voltage at current at ang rapping timer settings;
  - CTCS (condenser tube cleaning): 17 PLC → DCS, 1 DCS → PLC (PICT30).
  - Hindi isinama ang coal handling, water treatment, air compressors at air dryers (user 2026-11-25 00:52 PHT).
- Bawat point ay may DCS address (SI word at bit), user tag ng word (hal. 104-WB128) at operator picture, mula mismo sa listahan.
- **Library (ALL SIGNALS) at signal tracer:** lumalabas ang mga ito sa ilalim ng STN104. May tatlong bagong pindutan ang tracer: Fly ash conveying PLC (166), Electrostatic precipitator PLC (378), Condenser tube cleaning PLC (18). Ang path: package PLC → SCADA LAN switch → gateway GCS10F → FL-NET hub-2A / 2B (cables 2A10 / 2B10 / 2A11 / 2B11, 20 m) → FCS104 (cables 2A8 / 2B8, 2A9 / 2B9, 10 m) → STN104 address.
- Bagong `tools/data/modbus.py` → `src/ui/plant/modbus.js` (lahat ng Modbus list); wala na ang Modbus sa `dcslists.py` / `dcslists.js` (loop at user tag list na lang). Pareho ang 436 row ng turbine at SCADA bago at pagkatapos.

## Source
- Subsystem PLC\<Fly Ash | ESP | CTCS>\IO List\LMYP-1 #1-MODBUS Communication list between DCS and <fly ash | ESP | CTCS>.xls (sheets PLC to DCS, DCS to PLC).
- LMYP-1 #1-Communication list between DCS and package.xls, sheet #1 GCS10F: fly ash connection 3 / 4, ESP 5 / 6, CTCS 7 (iisang PLC), "RJ-45 <--> Fiber Optic".
- K1AU3-E2-0-106 sh2 cable list: HUB-2A / 2B rows 8X / 9X (FCS104A / B, 10 m) at 10X / 11X (GCS10FA / B, 20 m).

## Sinuri
- Ang turbine at SCADA rows ng bagong tool ay kapareho ng dati (436 = 436, bawat column).
- Sa page: lumalabas ang 166 / 378 / 18 signal sa tracer; LSH-FH1710 → STN104 SI5000 bit 0; walang page error.

## Hindi pa / natitira
- Ang package-side cable at port ng SCADA LAN switch ng tatlong ito ay nasa K1AU3-E2-0-115 (hindi pa nabasa para sa kanila): "not read" ang nakasulat sa path.
- Walang value pa ang mga point (wala sa logic sheet ang SI5000 ~ / SI5400 ~ / SI5800 ~; HMI picture lang ang gumagamit). Ang value ay kasama ng HMI ng ESP / fly ash.
