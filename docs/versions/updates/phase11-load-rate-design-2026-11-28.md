# Phase 11: load limit stations from design / logic, not a screen (2026-11-28)

- Binago: hmi-op.js AN_HMI_MAN at ang 150 MW start (st150, init tools/steady150/init/load-limits.js, 3 plant min).
  - HIC-MWRL (ABC-001B, load change rate): 3.0 MW/min mula sa screen (33.PNG) -> 1.2 MW/min = design normal load rate 0.8 %/min x 150 MW (MHPS PPE-15-0080 R1 start-up / shutdown curves, 100 ~ 60 % load; YUA read /mnt/project-files/aoi-load-response-search-2026-11-28.md).
  - HIC-MWHL (ABC-001A): 238.4 mula sa screen -> 151 MW = MH 75.5 % x SH 200 MW (backup parameters). 151 na ang start dati (clamp).
  - HIC-MWLL (ABC-001A): 0.0, source ngayon = SL 0 (station range).
- Ang init ay sumusulat din sa operator COS ng station ("COS manual > MAN HIC-MWRL"), dahil iyon ang binabasa ng manual leg; kung hindi, bumabalik ang 3.0.
- Sinubok: settle 3 min, 150.98 MW, Pms 126.95, walang trip; HIC-MWRL 1.2 sa bagong start (headless). Ang sweep sa design rate ay tumatakbo.
- Bakit: ang sweep ay bumababa ng load nang 3 MW/min (2 %/min), 2.5x mas mabilis sa design; ang mga row na kinukuha sa ramp (coal, heat rate, FW temp, spray) ay naapektuhan.
