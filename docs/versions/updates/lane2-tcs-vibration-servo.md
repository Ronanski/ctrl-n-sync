# Lane 2 TCS IO: TSI vibration HIGH contacts at servo AO reads (2026-11-25)

Ayos sa `src/digital/tce-io.js` lang. Walang pagbabago sa plant model at sa HMI.

## Ano ang bago

- **8 TSI shaft vibration HIGH contact** (TCA904-1 / 2 / 17 / 18, TCA905-1 / 2 / 17 / 18): ON kapag ang `U.loVx<n>` / `U.loVy<n>` >= 0.125 mm. Pinagmulan: setpoint list 310SC90-778 R0 p 11-12 rows 17-24 (IBD TA-18), kapareho ng limit na gamit na ng `tcs-trip.js` TA-18. Dati ay "needs" dahil walang nakitang setting.
- **36 SERVO-AO na dulo** (TCE990 / 991 / 992): ang read ay ang valve demand ng engine (`tcsVtState` sa `tcs.js`, %). Walang actuator lag sa model, kaya ito rin ang posisyon ng valve. Hiningi ni SORA (lane 9) para maikumpara ang output ng TCS program.

## Bilang

- needs 160 → 152; model 131 → 139.

## Sinubok

- `node tests/lanes/tcs-io/io.cjs` PASS.
- Live headless sa tunay na page sa 151 MW: 256 reads, 0 walang numero; vibration 0.016 ~ 0.063 mm kaya 0 ang 8 HIGH contact; servo AO MSV(A) 100, CV(A) 97.5, ICV 100 %; 0 page error.

## Hindi sinubok

- Ang vibration na lampas 0.125 mm (walang paraan sa model na itaas ito nang walang force).

## Susunod

- Ang 152 na natitira ay kailangan ng model piece mula kay YUA: listahan sa project files `lanes/tcs-io/needs-for-yua.md` (10 grupo).

Pirma: TCS IO : TSUBASA (lane 2).
