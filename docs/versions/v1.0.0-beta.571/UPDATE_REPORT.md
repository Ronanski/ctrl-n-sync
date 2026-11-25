# v1.0.0-beta.571: TCS diagnostics macros mula sa manual text, GO MANUAL (TCS LOGIC : MARIA, 2026-11-25 PHT)

## Binago
- **USER GO MANUAL (2026-11-25 7:19 AM PHT):** ang diagnostics macro na wala sa drawing ang loob ay binibigyan ng kahulugan mula sa manual text, may marka `src = 'from manual text, inside not drawn'` at hiwalay na bilang (`stats().runText`).
- `src/digital/tce-run.js`, bagong macro (lahat mula sa manual text, TC-14-116 p 1298 No. 4 / 9, p 1308 No. 6, p 85):
  - **DUAL INPUT DIAGNOSTICS** (TCA370, TCA371, TCE101) at **DUP AI DIAGNOSTICS** (TCE070): OUT = mean ng mabuting value; masama = abnormal o labas sa HL / LL nang TP; DEV E = layo > DEV nang DELAY TP; walang mabuti = ABN, OUT = SIM.
  - **TMR LVDT DIAGNOSIS** (TCE121 ~ TCE135): ERRi = layo ng LVDT i sa gitna, labas sa sariling HL / LL nang DELAY TP; OUT = gitna ng mabuti.
  - **VALVE DIAGNOSIS** (TCE120 ~ TCE135): ABN.O = posisyon labas sa H/L o sobrang bilis ng pagbabago; ABN.M = posisyon malayo sa demand nang 5 s; ABN.A = servo amp labas sa 102.4 %.
  - **TRIPLE DETECTOR2** (OUT = gitna ng tatlo, DEV) at **2OO3** (dalawa sa tatlo) sa TCE060 ~ TCE069.
- `src/digital/tce/_lib.js`: ang TRIPLE DETECTOR2 at 2OO3 ng TCE060 ~ TCE069 ay na-type na bilang tunay na block (dati ay kahon lang na walang pin); larawan sa /mnt/project-files/screenshots/lane1/tce060-triple-detector-2oo3.png.

## Bilang
- Drawing-complete: 202 (walang pagbabago). Manual text: 70 → 99. Lahat: 272 → 301 ng 419.

## Sinubok
- tests/tce/sheets.cjs (headless): DUAL INPUT, TMR LVDT, VALVE DIAGNOSIS, TRIPLE DETECTOR2, 2OO3, at ang pin ng TCE060 TRIPLE DETECTOR2; FLOOR_TEXT 99.
- Larawan ng TCE060 sa app (DITL viewer): tugma ang ayos sa drawing.

## Hindi sinubok
- Ang loob ng mga macro ay hindi drawn; kapag may Logic Monitor print, iyon ang papalit.
- Wala pang nakikita ang operator sa HMI.
