# Phase 11 part 7+8 (SUZU), fix 5: closed cooling water line from mass balance MB-021, cooler duties by port (2026-11-27, GO FIX 11)

Binago (Rule 0: ang design point ng linya ay galing na sa MB-021, hindi na sa HMI picture 27.PNG):
- Pressures ng linya (K1AU3-MB-021 rev 0, A2-0-001 RA p 13): suction 3.0 (item 5), PT-CW1152 7.8 (item 7), PT-CW1153 7.2 (item 8), PT-CW1156 7.2 -> 6.5 (item 30, bagong sariling loss papuntang bottom ash header), sa 1500 T/H; tank NL 1.7 m (SOP 7). Ang lumang numero 6.4 / 5.2 / tank 0.8 m ay galing sa 27.PNG: tinanggal. Nasa labas ng AN_ACW (AN_ACW_MB) kasi dala ng save ang AN_ACW.
- Check: pump curve 3.0 + 4.955 = 7.96 sa 1500, ang sheet ay 8.0 (item 6); umaandar sa 1517 T/H.
- Init ng bawat cooler ng ibang part: binabasa ang lahat ng port q.ccw.<part> (hal. q.ccw.YUI = generator losses), hindi na U.genQ. Sinusulat ang port ccw {m, T} at ccw.q {Q}.
- Bottom ash cooler na nakahinto pero may dumadaloy na tubig: ang water outlet = supply agad (walang init na pumapasok); dati 1800 s na lag.
- Ang hati ng tubig ng lube oil cooler at ng bottom ash cooler ay sa MB-021 design flow (AN_ACW_MB.Q).

Pagkakaiba sa planta (naka-log): ang 27.PNG (148 MW) ay 6.4 / 5.2 kg/cm2 at supply 38 C; ang design sheet ay 7.8 / 7.2 at, sa malinis na CCWHE (D1-0-041, walang fouling factor na nakalimbag), supply mga 30.4 C sa 3.7 MW na init ng users. Ang sheet ang ginamit.

Sinubok (headless, 150 MW): mu_ccw_model ALL PASS (inayos ang inaasahang numero mula 27.PNG papuntang MB-021 at energy balance, 900 s settle), field_valves ALL PASS, ashcool ALL PASS; no-fit 37 (0 bago), one-path PASS, ports PASS.
Hindi sinubok: bfwp_motor_ccw (naputol sa oras, uulitin).
Bukas: strainer DP 0.27 (27.PNG, walang strainer sheet), loop mass 180,000 kJ/K (NO-SOURCE).
