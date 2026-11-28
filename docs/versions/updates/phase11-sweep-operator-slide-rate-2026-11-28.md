# Phase 11: sweep operator MSP slide rate from the FHI saturation limit (2026-11-28)

- Binago: tools/accept/part1.cjs, ang scripted operator ng sweep ay nagbababa ng PIC-COBM SV nang hanggang 2.1 kg/cm2 bawat minuto (dati 0.5, walang source).
- Source: FHI P2 Sect 8 Tab 9 / Fig. 1, drum saturation temperature 83 C/h pababa. DERIVED: dTsat/dP ~ 0.66 C bawat kg/cm2 sa 100 ~ 126 kg/cm2G, kaya 83 / 60 / 0.66 = 2.1 kg/cm2/min. Walang design pressure-rate o load-rate sa Sect 7 / 8 (YUA read, /mnt/project-files/phase-msp-fhi-reads-2026-11-28.md).
- FHI Fig. 11 (SH outlet 125.6 ~ 129 kg/cm2G mula 40 hanggang 100 %, 100.0 sa 30 %) ay tugma sa HB line na sinusundan ng goal.
- Sinubok: quick sweep sa branch (resulta nasa PR).
- Hindi binago: ang plant model at ang logic. Test tool lang.
