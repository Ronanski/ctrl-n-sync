# v1.0.0-beta.477 — Turbine control interface page (lane 7, HMI turbine)

## Ano ang bago (nakikita ng operator)
- Bagong page sa Plant > Turbine and generator: **Turbine control interface**. Lahat ng hard-wired na signal sa pagitan ng turbine control system, generator panel at DCS, nakaayos sa limang hanay:
  - Trip at mga valve (turbine trip 1 at 2, stop / intercept / control valves closed, load unbalance, MSV test).
  - Speed at start-up (speed < 2400 rpm, turning gear, ICV to CV transfer, seal feed valve, start-up mode ambient cold / cold 1 / cold 2 / warm / hot, load hold, rated speed).
  - Utos ng turbine sa drain valves MV-AS1394 at MV-AS1397.
  - Load control (DCS control mode permissive at on, Modbus line A / B, target MW papunta at feedback, maximum load up rate).
  - Generator (field breaker 41, lockout 86GA / 86GB, current, voltage, power factor, frequency, MVar, energy, at ang mga value na ipinapadala sa panel).

## Batayan
- DCS I/O list: TCS-DI1003 ~ 1058, TCS-AI / AO, GCP-AI / AO; range at unit mula sa DCS loop list.

## Bilang (gap list ng lane 7)
- Turbine: 51 kulang -> 8 kulang (natira: HP bypass pressure / temperature, main steam pressure 2, first stage pressure B / C, main steam temperature).
- Generator: 11 kulang -> 0.

## Hindi pa
- Ang mga signal na wala pang link ay `-----` (TCS I/O binding, lane 2). Walang button dito: ang mga TCS button ay ilalagay sa Turbine page kapag live na ang TCS program.

## Sinubok
- `tests/lanes/hmi-turbine/pages-bound.cjs`: 3 pages, 111 elemento, 0 problema. Headless app 150 MW RUN: bukas ang page, walang error; may live na value na ang ilan (DCS control mode ON, target MW feedback 151 MW, rated speed 3598 rpm).
