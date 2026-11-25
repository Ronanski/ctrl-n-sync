# LMYP OTS 1.0.0-beta.592 (TCS IO : TSUBASA, lane 2, 2026-11-25)

Sumunod sa beta.587. Ayos sa `src/digital/tce-io.js` at `src/data/tcs-dcs.json` lang. Walang pagbabago sa plant model at sa HMI.

## Ano ang bago

| # | Ano | Detalye | Pinagmulan |
|---|---|---|---|
| 1 | Aux steam header pressure papunta sa TCS | TCA931-2 (COMM AI TABLE(2) CH 1) = DCS AO0404 TCS-AS1004 = ang PT-AS1004 ng DCS na ipinapasa sa TCS (U.asP, aux steam model). Dati ay link lang, walang value | DCS I/O list STN102 AO0404 / AI0514; WIRING.xls AO0404 junction TCS-AIO; XSMM row 538, IBD TC-20 |
| 2 | Gland steam turbine side temperature papunta sa TCS | TCA931-3 (CH 2, parehong card LYA000A) = DCS AO0471 TT-AS1017-1 = TT-AS1017 ng DCS (U.asT17). Dati ay "needs" | DCS I/O list STN102 AO0471 / AI0902 (0 ~ 300 °C, kapareho ng range ng TCS CH 2); WIRING.xls AO0471 junction "DCS-->TCS" |

## Bilang

- Dulo ng mga channel: needs 161 → 160; may value na ang 2 DCS → TCS na channel (dcs 19 → 20).
- Live headless sa 150 MW (beta.579, ayos ni SORA): 228 table reads at 175 Modbus reads, 0 walang numero (dati 6 + 9 = ang AN.tceSteam / AN.tceCrp).

## Sinubok

- `node tests/lanes/tcs-io/io.cjs` PASS (ang check ng binding ay 69 na ngayon; ang punto na walang TCS tag ay dapat may patunay na "DCS-->TCS" sa wiring list).
- Live headless sa tunay na page sa 150 MW (151.0 MW): 230 reads, 0 walang numero; TCA931-2 = 10.2 kg/cm2, TCA931-3 = 185.0 °C (pareho sa PT-AS1004 / TT-AS1017 ng aux steam model); 0 page error.

## Hindi sinubok

- Ang TCS sheets na gumagamit ng TCA931-2 / -3 (TCA316, TCA801B) ay tumatakbo pa bilang larawan sa lane 1; ang value ay nasa dulo ng channel na.

## Susunod

- 160 "needs" na channel (drain MOV, NRV, generator Mvar / current / pf, AVR, TSI setting, rotor position, diff expansion).
