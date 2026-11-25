# Phase 8 slice 3: ESP package PLC (2026-11-26 ~6:00 AM PHT)

Batayan: ESP O&M L19-1 (KC Cottrell, LMYP-1-14), basa ni YUA sa PC. Walang ladder at walang program backup.

## Ano ang ginawa (`src/analog/engine/pkg.js`)
- In service ang ESP kapag naka-energize ang mga TR. Ito rin ang estado na ginagamit ng house load (AN_SRC.field.esp).
- Sa 150 MW:
  - tumatakbo ang TR01 ~ TR05;
  - tuloy-tuloy ang DE rapping;
  - nakabukas ang purge fan;
  - patay ang heater, dahil pinapatay ito 1 oras matapos ma-energize ang mga TR.
- CE rapping: 2 min tumatakbo, saka 7 / 13 / 19 / 25 / 31 min nakahinto para sa field 1 ~ 5 (manual p3).
- Pagkapatay ng mga TR: tuloy-tuloy ang CE rapping nang 2 oras, saka hihinto ang mga aux. Ang purge fan ay humihinto kasabay ng ID fan sa manual; dito ay sa dulo ng 2 oras (hinuha).
- Timer na ipinapakita sa DCS: CE 2 at 7 ~ 31 min; current limit ng TR 100 % (p9 ~ 10).
- Fault, TR alarm at communication error: 0, dahil wala pang fault model. Hopper level high: 0, dahil inuubos ng ash system ang laman ng hopper.
- Utos ng DCS (start / stop): 0, dahil wala pang screen na nagpapadala.

## NO-SOURCE (walang value)
- REMOTE / DCS CONTROL selector, InterLock bits.
- TR kV / mA at primary V / A: walang model ng kuryente ng TR.
- Timer ng DE at ng vibrator, AUTO ng fan at heater.
- Ang takbo ng vibrator ay nakadepende sa fly ash (3 s bawat bukas ng inlet), kaya isasama ito sa fly ash slice.

## Bilang
- Package Modbus na may value: 22 -> 214 sa 562 (ESP 194).

## Sinubok
- `tests/lanes/pkg/pkg-modbus.cjs`: pasado (16). Kasama ang ESP sa 150 MW, ang mga timer, ang duty ng CE rapping at ang 2 oras pagkapatay.
- Browser gen_panel: pasado.
- Hindi sinubok sa live app.
