# Phase 8 follow-up: the Modbus link DCS <-> TCS (2026-11-27, 4:35 AM PHT)

Source: PC read of YUA, /mnt/project-files/phase8-modbus-linkfail-2026-11-27.md (TCS backup ETH+MD sheets TCT090A, TCT090, TCT081D; Turbine
Modbus list; STN102 / 104 / 105 memory lists; FCS2000 manuals 06 and 16). Phase 8 stays TAPOS.

## Binago (ano ang nakikita ng operator)
- Ang alive signal ng DCS papunta sa turbine control (Modbus 25) ay nagpapalit na bawat cycle, at ibinabalik ito ng turbine control sa
  Modbus 10068 (dati: laging 1).
- Dalawang bagong fault ng instructor (Start menu, Faults): "Modbus line A / line B between the DCS and the turbine control system lost".
- Isang linya ang putol: tuloy ang lahat (ang kabilang linya ang gamit, TCT090A).
- Dalawang linya ang putol nang 10 s: ang turbine control ay tumatanggi sa lahat ng utos galing DCS (gland seal group start / stop, ATS AUTO /
  OFF, ATS step buttons): "Both Modbus lines DCS to TCS are dead ...". Walang trip, walang alarm sa turbine control (TCT090A). Ang utos ng
  turbine control screen mismo (hal. HOLD, target speed) ay tinatanggap pa rin.
- Sa putol na linya, hawak ng DCS ang huling value ng echo (FCS2000 manual 06 1.3.6 note 1).

## Hindi pa (NOT IN DOCS, docs/phase8/link.json nosource)
- Ang oras bago itaas ng DCS ang LINE-A / LINE-B COMM. FAIL (STN102 WB r393 / r394, STN104 B.1270 ~ 1274, STN105 B.126E ~ 127F): wala sa
  docs; ang DITL sheet na nagse-set nito ay larawang PDF na hindi pa nakikita. Hindi ito sine-set ng app.
- Ang poll period ng gateway (setting "Time Interval", wala ang value ng LMYP) at ang isinusulat ng gateway kapag hindi sumasagot ang PLC.
- Ang watchdog fail time ng fly ash / ESP / CTCS.

## Sinubok
- tests/lanes/qa/phase8-link.cjs: alive at echo nagpapalit at magkapareho; linya A putol 9 s = buhay pa, 11 s = patay, B buhay at tanggap ang
  utos; dalawang linya patay = tinanggihan ang ATS OFF at gland seal start, tanggap ang HOLD ng turbine screen; echo hawak; bumalik ang mga
  linya = healthy. phase8-gate, tcs-io, pkg-modbus: pasado.
- Hindi sinubok: tests/regress/fault_groups.js ay may lumang FAIL "Other 33" (wala sa Checks; ang dalawang bagong fault ay nasa Electrical
  and generator).
