# v1.0.0-beta.461: TCS diagnostics macros mula sa manual text (TCS LOGIC : MARIA, 2026-11-25 PHT)

## Binago
- `src/digital/tce-run.js`: tatlong macro (MD) na may kahulugan na, lahat may marka na `src = 'from manual text, inside not drawn'`:
  - **TRIPPLE INPUT DIAGNOSTICS** (LME105, 146 block, TCE075 ~ TCE119A, TCE145): OUT = 2 out of 3 ng IN1 ~ IN3; DEV E = hindi pare-pareho ang tatlo nang TP 3.0 s (TC-14-116 p 85 "2/3", p 1298 No. 9).
  - **AI DIAG.MD** (LMA510 / LME510, 96 block, TCA310 ~ TCA443, TCE102 ~ TCE104): range check H/L HL / LL at rate check DEV HL / LL, bawat isa sa sarili nitong DEF TP at DEF N; ABN = PI/O error o DEF N na sunod-sunod na masamang sample; OUT = IN, at SIM kapag ABN (TC-14-116 p 1298 No. 4). Hal. GEN. FREQUENCY TCA321: 0 Hz < LL 54.5 = ABN, OUT = SIM 60 Hz. Ang K:1 ay hindi binabasa (hindi sinasabi ng manual).
  - **TMR AI DIAGNOSTICS** (LME111 + LME111A, 42 block, TCE060 ~ TCE073, TCA372): masamang channel = ERR o labas sa HL / LL nang TP 1.0 s; DEV E = lumayo sa gitna nang higit sa DEV nang DELAY TP 3.0 s; OUT = gitna ng tatlong mabuti (dalawa: average); ABN = kulang sa dalawang mabuti, OUT = SIM; ERR = may masamang channel (TC-14-116 p 1308 No. 6).
  - Kapag kulang ang printed parameter na ginagamit ng macro, bukas ang block (open item), walang default.
  - `stats()` ay may `runText` (sheets na tumatakbo dahil sa macro mula sa manual text) at `mText`: hiwalay na bilang para sa QA.
- **Bug, naayos:** ang PI/O error box ay naka-print ng parehong table row ng value ("(TCA900-1)" sa TCA040 = DI 1 at ang card error; "(TCA932-3)" sa TCA322 = AI at ang error nito), kaya iisang signal ang value at ang error. Ngayon ang error ay `PIO:<row> ERR`. Ports 1437 → 1485 (48 error na hiwalay na).

## Bilang
- Drawing-complete: 196 (walang pagbabago).
- Tumatakbo na may macro mula sa manual text (hindi pa drawing-complete): 0 → 70 sheets (284 macro block).
- Lahat: 196 → 266 ng 419.
- Hindi pa tumatakbo kahit may 01 / 02 / 04: TCE060 ~ TCE069 (TRIPLE DETECTOR2 at 2OO3 box), TCE070 (DUP AI DIAGNOSTICS), TCA320 (SC), TCE145 (CMP SW).

## Sinubok
- tests/tce/sheets.cjs (headless): 2 out of 3 at DEV E pagkalipas ng 3 s; AI DIAG range / PI/O error / SIM; TMR AI gitna, DEV E, dalawang error = SIM; TCA322 line 3 value at error hiwalay; dalawang floor (drawing-complete 196, manual text 70).
- tests/lanes/qa/tce-complete.cjs: 266, 0 sheet na may defect.

## Hindi sinubok
- Ang loob ng tatlong macro ay hindi drawn sa kahit anong dokumento (lane 2 spec 01 / 02 / 04). Kapag may Logic Monitor print, iyon ang papalit.
- Wala pang nakikita ang operator sa app (shadow run pagkatapos ng I/O binding).
