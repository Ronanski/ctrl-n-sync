# v1.0.0-beta.437 (HMI TURBINE : MINAMI, lane 7): bagong page na Heater drains, at mga switch sa Feedwater, Condensate, Extraction

## Ano ang nagbago
- **Bagong page: Plant > Water and steam > Heater drains.** Ang drain ng limang heater bilang isang cascade: high pressure heater 2 at 1 papunta sa deaerator, low pressure heater 3, 2 at 1 papunta sa condenser. Sa ilalim ng bawat heater ang dalawang level control valve ng drawing: ang primary valve (papunta sa susunod na heater) at ang alternate valve (dump: sa condenser para sa HP, sa flash chamber para sa LP).
- Nakakabit: 10 controller ng analog logic (ABC-035 ~ 039: LICHD11051 / 52, 11061 / 62, 11011 / 12, 11021 / 22, 11031 / 32), 5 level high high switch na binabasa ng DITL-41 (LS-HD1101 ~ 1106), 10 level transmitter, drain flow at temperatura ng HP heater 1 at 2 mula sa plant model.
- Ang pindot sa valve ay nagbubukas ng faceplate ng controller (A / M, SV, MV), gaya ng ibang page.
- Pinagmulan: flow diagram K1AU3-PD-018 Rev D (heater vent and drain system), DCS I/O list.

- **Feedwater**: Deaerator level low low (LSLL-CD1104-4, DITL-23B), Pump A / B suction valve (ZSO-FW1031 / 1032).
- **Condensate**: Polisher train ready (RY-CD01, DITL-64).
- **Extraction steam**: Flash pipe level high / low (LS-FS1410 / 1411, DITL-57).
- Ang anim na ito ay nakakabit sa address ng I/O list; '-----' pa habang wala pang link (lane 4).

## Hindi pa may value (nakikita ang '-----')
- Drain flow at temperatura ng LP heater 2 at 3 (FT / TT-HD1102, 1103) at shell pressure ng LP heater 1 (PT-HD1101): mga I/O point na wala pang link. Para sa lane 4 (DCS LINKS BOP).

## Sinuri
- `node tests/lanes/hmi-turbine/pages-bound.cjs`: 34 na element, lahat nakakabit sa tunay na address (ABC sheet, DITL sheet, I/O list o plant model).
- Sa app (headless, 150 MW, RUN): bukas ang page, gumagalaw ang mga value, NORMAL ang 5 level high high, primary valves 31 ~ 47 %, alternate 0 %.

MINAMI
