# Phase 11 KANA: backpass fouling without a trend (2026-11-28)

Binago:
- Lahat ng backpass bank (RH, primary SH, economizer) ay laging may design fouling rInf 0.0042 m2K/W, sa bawat load at bawat start state. Ang rInf ay CALC: ang value na nagbibigay ng air heater gas in na 322 C sa 150 MW (FHI P2S7 Tab 3).
- Inalis ang paglaki ng fouling (tau 56 h, galing sa plant trend) at ang linis ng bawat lance (e 0.8, walang source). Rule 0: walang snapshot o trend sa plant model.
- Ang settle at ang live run ay iisa na ang fouling (dati malinis sa settle).

Nawala hanggang may dokumento: ang pagbaba at pagtaas ng SH spray dahil sa soot blowing. Tumatakbo pa rin ang mga sootblower sa logic, pero hindi na nito binabago ang heat transfer. Kailangan ng dokumentong may fouling rate, blowing interval at lance effectiveness (Diamond Power N11639-SC1: 28 blowers, 84 min, 3,882 kg lang).

Sinubok: no-fit (2 linya ang nabawas sa baseline), one-path, u-const, gas path (PA 287.1 / SA 303.2 vs Tab 3 285.8 / 301.6), lane tests, 150 MW hold 20 min.
Hindi sinubok: full sweep 45-150 MW (phase thread, sa main). Hindi kasama ang st150.
