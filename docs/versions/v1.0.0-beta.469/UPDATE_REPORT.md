# v1.0.0-beta.469 (lane 9 AUDIT FIX : SORA, 2026-11-25 PHT)

## Ano ang binago
- Ang TCS I/O list ng lane 2 (src/data/tcs-io.json, src/data/tcs-dcs.json, src/digital/tce-io.js) ay nasa app na mismo, hindi lang sa test. Basa lang ito: walang isinusulat sa planta (window.TCE_IO_LIVE, window.TCS_IO_LIST, window.TCS_DCS_LIST).
- src/analog/engine/api.js: AN.tceSteam = tcsSteam(AN_UNIT), AN.tceCrp = tcsCrp(AN_UNIT). Ito ang daan ng steam values ng turbine papunta sa TCS I/O list.

## Ano ang makikita
- Bago: sa built page, NaN ang MSV inlet steam temp A ~ D, MSV inlet press A / B, hot reheat temp / press at HP exhaust press A ~ C.
- Ngayon sa 150 MW: MSV inlet temp A ~ D 539.7 C, MSV inlet press 122.3 kg/cm2g, hot reheat 537.8 C / 34.1 kg/cm2g, HP exhaust press A ~ C 33.96 kg/cm2g. 117 model ends ng TCS I/O list, 0 NaN.

## Item 3: ang TCE/TCA program ay tumatakbo na sa app (side by side)
- Bago: ang compiled TCS program (src/digital/tce-run.js, lane 1) ay sa test lang tumatakbo.
- Ngayon (src/digital/tce-live.js): kusa itong nagsisimula pagbukas ng app at sumusunod sa oras ng planta. Ang 419 sheet ng TCE / TCA / G ay tumatakbo, bawat isa sa sarili nitong cycle; 196 dito ay buo ang logic (main beta.459). May 472 PI/O input ito, at 207 ang may value na galing sa TCS I/O list. Ang 265 na wala pa ay kulang ng model value, spare, DCS address, reader box o output row.
- SIDE BY SIDE LANG: walang isinusulat ito sa planta, sa tcs.js, sa IBD o sa DCS.
- HMI API (napagkasunduan kasama si MARIA): TCE.press(port, ms) ay CRT button na 1 sa loob ng 3000 ms, saka 0; TCE.read(sheet, key) ay { on: false } kapag naka-off ang program; TCE.crt(), TCE.compare(), TCE.status(), TCE.ports() / TCE.port(name), at TCE.start() / stop().
- Gastos: mga 6 ~ 10 ms bawat 250 ms (mga 3 % ng CPU). Kapag naka-fast forward, hanggang 0.5 s ng planta lang ang tinatakbo nito bawat tick, at ipinapakita ng status ang lag.

## Sinubok
- tests/regress/tce_io_page.cjs at tests/regress/tce_live.cjs (headless, station page 150 MW): ALL PASS. Sinubok din sa worker mode (ang default ng Beta site): tumatakbo, 207 inputs ang may value.
- tests/lanes/run-all.cjs: lahat PASS. build --check SAME.

## Hindi sinubok / natitira
- TCE.compare() laban sa tcs.js: naghihintay pa sa outs(prog) ni MARIA (lane 1). Hanggang doon, ready: false ang sagot nito.
- Hindi sinubok sa tablet. Hindi pa nito pinapatakbo ang planta (sinasadya).
