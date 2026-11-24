# LMYP OTS 1.0.0-beta.326 (LEADER : JENNIE, 2026-11-23)

Audit 3 #5: ang pressure ng turbine extraction papuntang deaerator, mula na sa turbine heat balance.

## Ano ang nagbago para sa operator

Turbine heat balance (Hitachi PPE-14-0725 R1, pareho ang apat na unit): Case 1 100 % (310SD07-485) at Case 4 60 % (310SD09-055).

| Extraction | 100 % (458.3 T/H) | 60 % (273.4 T/H) | Pinupuntahan |
| --- | --- | --- | --- |
| No.3 | 6.369 ata = 5.34 kg/cm2 g | 3.943 ata = 2.91 g | Deaerator |
| No.4 | 1.914 ata = 0.88 g | 1.190 ata = 0.16 g | LP heater #3 |

- Dati, ang No.3 ay tuwid na proporsyonal sa steam (5.3 x steam / 474, walang source). Ngayon, ito ang tuwid na linya sa dalawang case ng heat balance. Sa 150 MW, 5.34 ito (snapshot PITS1017 5.3). Sa 90 MW, 2.91 ito (dati 3.16).
- Dati, ang No.4 (4.5 kg/cm2, walang source) ay ginagamit din bilang pinanggagalingan ng pressure ng deaerator. Mali ito, dahil sa LP heater #3 pumupunta ang No.4 ayon sa heat balance. Tinanggal na ito. Ang ipinapakita ng PT-TS1022 ay hindi nagbago, sumusunod pa rin sa first stage pressure (snapshot 1.29).

## Findings

| # | Finding | Rekomendasyon |
| --- | --- | --- |
| F1 | PT-TS1022 sa plant snapshot ay 1.29 kg/cm2 sa 150 MW, ang heat balance ay 0.88 (stage) / 0.79 (heater). 0.4 ang pagitan. | Hayaan ang snapshot sa display; tingnan kung nasaan ang tap ng transmitter (P&ID PD-013). |
| F2 | `extraction_warming.js` FAIL (sumasara sa 448.9 C, hindi 330) at `cd_page_values.js` error sa linya 46, pareho din sa main beta.324. Hindi galing sa beta na ito. | Susunod kong aayusin. |
| F3 | Power factor 0.85 ng 6.6 kV motors (elec.js) wala pa ring source. | Susunod na Audit #5: motor data sheets. |

## Tests

- hp_heaters, lp_heaters: ALL PASS.
- Behaviour gate (20 plant min, 150 MW): ALL PASS.
- extraction_warming, cd_page_values: parehong resulta sa main (F2).
- `npm run -s check`: SAME.
