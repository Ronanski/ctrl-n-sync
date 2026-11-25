# Phase 6 slice 8: breaker ON / OFF ng mga fan ng boiler (2026-11-26 PHT)

Ano ang nakikita ng operator: ang breaker (VCB, ang 6.6 kV na switch na nagbibigay ng kuryente sa motor) ng IDF, PAF, SAF, FA blower A at
FA blower B ay may ON / OFF na. Ang ON ay kapag tumatakbo ang fan at walang field trip o black-out na nagbukas ng breaker; ang OFF ay ang
kabaligtaran. Sa 150 MW: IDF, PAF, SAF at FA blower A = ON; FA blower B (nakahinto) = OFF.

- Source: IO list STN103 I.0045, I.0364 / 0365, I.0524 / 0525, I.004A / 004B, I.036A / 036B; motor sheet DITL-25A / 26A / 27A / 28A / 28A #B;
  elec.js BUS 1AM (ETAP load flow: PAF M-1004, IDF M-1220). Parehong rule ng VCB ng BFWP at condensate pump.
- Hindi ginawa: IDF VCB ON I.0044 (nasa DITL-80Q, hiwalay ang ayos ng sheet na iyon); plant air compressor A / B / C VCB (STN105), sunod.
- Bilang: hindi nakakabit na I/O 107 -> 98; may value 2179 -> 2188; B2 49 -> 40.
- Hindi sinubok: sa browser (live app).
