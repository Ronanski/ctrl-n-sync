# Lane 7: DCS to turbine outputs on the Turbine control interface page

## Ano ang bago (nakikita ng operator)
- Turbine control interface: apat na bagong state, ang mga utos ng DCS papunta sa turbine control system:
  - "To turbine: gland steam line drain in auto" (TCS-DO1001)
  - "To turbine: DCS control mode on / off" (TCS-DO1002 / 1003)
  - "To turbine: auto synchronizing start" (TCS-DO1006)

## Batayan
- DCS I/O list: S2 O.048F, S1 O.0178 / O.0179, S2 O.0492; TCS ends TCA905-24, TCE900-17 / 18, TCE901-8 (XSMM_IO_List_R1, src/data/tcs-dcs.json).

## Bilang
- HMI gap (tools/audit/hmi-gap.cjs): generator DO 4 -> 0; kabuuan 26 -> 22 kulang. Lane 7 na lang: XV-CR1013 (cold reheat drain pot DP-CR03), na sinasabi ng I/O list mismo na "not used", kaya hindi iginuhit.

## Sinubok
- tests/lanes/hmi-turbine/pages-bound.cjs: 6 pages, 419 elemento, 0 problema. Headless 150 MW RUN: bukas ang page, walang error.

Lane 7, HMI TURBINE : MINAMI
