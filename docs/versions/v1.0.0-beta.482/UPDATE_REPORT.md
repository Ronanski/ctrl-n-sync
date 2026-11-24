# LMYP OTS 1.0.0-beta.482 (TCS IO : TSUBASA, lane 2, 2026-11-25)

Sumunod sa beta.430. Ayos sa `src/digital/tce-io.js` lang. Walang pagbabago sa plant model at sa HMI.

## Ano ang bago

| # | Ano | Detalye | Pinagmulan |
|---|---|---|---|
| 1 | 14 channel na may value na pala sa model | Generator stator coil A ~ F (U.genT.ts), cooling gas A ~ D (U.genT.ta), AC exciter outlet air (U.genT.ex), HP exhaust steam A ~ C (X.T.cr): ang parehong value na pinapasok ng app sa IBD GD-5 at TA-20. Dati ay "needs" | tcs-trip.js TCS_IBD_NET GD-5 / TA-20, unit.js anGenTemp |

## Bilang

- Dulo ng 507 channel: model 117 → 131, needs 175 → 161.

## Sinubok

- `node tests/lanes/tcs-io/io.cjs` 14 PASS.
- Live headless sa tunay na page sa 150 MW: stator coil 92 ~ 99 °C, cooling gas 38 ~ 44 °C, exciter air 88.9 °C, HP exhaust 368.8 °C; table reads 228 (6 walang numero, hintay ng AN.tceSteam / AN.tceCrp), Modbus 175 (9 hintay).

## Susunod

Pag naka-main na ang load ng SORA: check na nawala ang 9 na walang numero.
