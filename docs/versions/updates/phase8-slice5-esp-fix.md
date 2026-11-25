# Phase 8 slice 5: ESP at fly ash, ayon sa pangalawang basa ng PC (2026-11-26)

Batayan: pangalawang basa ni YUA sa PC (5:38 ~ 5:50 AM PHT): K1AU3-D1-0-016 R1 Engineering Data of ESP (ED, KC Cottrell, p74 ~ 90 = control block diagram), fly ash O&M L5-1 (FA), ESP O&M. Walang binuksang program backup. Walang address ng network.

## Sinuri laban sa nauna (PR 625 / 626)
- 2 bar ng fluidizing air: setting lang ito (pinakamataas na itatakda, FA p42), hindi kondisyon ng paghinto. Walang code na gumamit nito bilang stop: walang binago.
- CE off time ng field 4 / 5: ang drawing ay 23 / 27 min, ang manual ay 25 / 31 min. Ang 31 ay labas sa range ng screen (0 ~ 30 min) ng drawing, kaya hindi ito maitatakda: ang drawing ang ginamit. NAKATALANG PAGKAKAIBA: ED p75, p76 laban sa ESP-OM p3.

## Binago (`src/analog/engine/pkg.js`)
- CE rapping: unang delay 3 / 5 / 7 / 9 / 11 min (field 1 ~ 5), tapos 2 min on, off 7 / 13 / 19 / 23 / 27 min (ED p75, p76).
- DE rapping: dalawang motor bawat field sabay, unang delay 11 / 13 / 15 / 17 / 19 min, 2 min on; ang "continuous" ng manual = off 0 (hinango). Timer words: running 2 (30117 ~ 30126, 40197 ~ 40206), stopped 0 (30071 ~ 30080, 40151 ~ 40160).
- REMOTE ng 25 motor (CE, DE, vibrator A / B) at ng 5 TR = 1: tumatakbo lang ang AUTO timer ng PLC kapag REMOTE ang switch (ED p89, p90), at gumagana lang ang remote ON ng TR kapag REMOTE (ED p110, p111) (hinango).
- Wet unloader at rotary valve (40009.04 ~ .10): kinansela sa kontrata (FA p13 item 10, p33), spare, 0.
- Sa start state na nasa serbisyo na (150 MW), lampas na ang unang delay.

## Nakatala, hindi ginawang value
- Heater H-1201: ang drawing (ED p87) ay thermostat sa TE-BA1730 (on sa 100 C o mas mababa, off sa 120 C o mas mataas, o kapag nag-fault ang fan). Walang model ng temperatura ng insulator, kaya nananatili ang tuntunin ng manual (off 1 h matapos ma-energize ang TR).
- Purge fan F-1201: ayon sa drawing, humihinto 5 ~ 20 min matapos ang heater o 10 ~ 50 min matapos ang lahat ng TR (range lang). Nananatili ang dati (humihinto sa dulo ng 2 h stop window, INFERRED).
- Vibrator: tumatakbo habang bukas ang blocking valve ng fly ash sa ilalim ng hopper (ED p82 ~ 86; interlock contact ED p27, FA p558). Kailangan ang tank cycle times (NO-SOURCE), kaya walang run value.
- TR nameplate: U-1201 83 kV 840 mA; U-1202 ~ 1205 72 kV average, 111 kV peak, 1000 mA (ED p103, p107). Hindi ito ang normal na operating value: walang value ang kV / mA.
- Silo T-1251: 1600 m3, 10 m diameter, 20.2 m shell (FA p11, p436). Ang level ay kailangan ng simula at ng unloading ng truck: walang value pa.

## Natitirang NO-SOURCE
Fly ash filling / pressurized fail / transported fail / purge time at delay t; taas ng silo H / HH; normal na TR kV / mA; setting ng vibrator on / wait at ng fan stop timer (range lang); REMOTE / AUTO ng fan at heater; DCS CONTROL; buong "EPS SYSTEM AUTO START" (40027.00).

## Sinubok
`tests/lanes/pkg/pkg-modbus.cjs`: 24 check, pumasa. Package Modbus na may value sa 150 MW: 270 -> 345 / 562 (fa 63, esp 264, ctcs 18). Hindi sinubok sa browser.
