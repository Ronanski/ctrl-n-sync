# TCS program: isang kopya lang, nasa engine (lane 0, YUA)

## Ano ang nagbago
- Ang buong TCE / TCA program (497 sheets) ay tumatakbo na sa engine, kasama ng DITL at ABC. Dating may pangalawang kopya ang TCE page na may sariling memory.
- Ang 14 sheet na nagpapatakbo ng motor ay sa sarili nilang cycle (0.03 at 0.1 s). Ang iba ay bawat 0.25 s.
- PI/O input: galing sa TCS I/O list, isang beses bawat scan. Ang " ERR" port ay hindi na napupunan ng analog value.
- INITIAL (TCE050 / TCA100): galing na sa sariling sheet nila.
- TCE page, press at lamp: diretso sa program ng engine. Puwedeng pindutin ang kahit aling CRT button ng program, at 3 s plant time ang hawak.
- Ang memory ng lahat ng sheet ay kasama sa SAVE, LOAD at keyframe.
- ZSO-CD1115: galing na sa limit ng sariling endBand.

## LOAD at keyframe (nakita ni SORA / SAORI)
- Ang LOAD ay nagkakalkula dati ulit ng heat transfer chain, kaya 66 value ang naiiba sa naka-save. Ngayon ang naka-save ang ginagamit; ang wala lang sa save ang kinakalkula.
- Bagong test: tests/lanes/integrator/keyframe.cjs. Na-save sa 150 MW, inilagay sa Cold world: 0 pagkakaiba agad at pagkatapos ng 60 scan.

## Iba sa dati
- Kapag naka-pause ang plant, naka-pause din ang TCS program. Dati tumatakbo ang kopya sa page nang hiwalay.
- TCE.compare(): ipinapakita pa rin ang hindi pareho sa tcs.js. Iyon ang listahan ng susunod na ikakabit.

## Wala pa
- ATS steps, TCS papuntang DCS, at protection output: susunod, mula sa parehong program.

YUA
