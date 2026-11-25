# Lane 2 TCS IO: TCS field devices sa engine (tcs-dev.js) (2026-11-25)

Bagong file na `src/analog/engine/tcs-dev.js` (U.dev, plain data), isang tawag na `tcsDev(U, dt)` pagkatapos ng `tcsOil(U, dt)` sa `unit.js`, at ang binding sa `src/digital/tce-io.js`.

## Ano ang bago

- **Turbine drain MOVs (TC-1, 2, 5, 7, 8, 12, 13), HP turbine warming valve, steam seal feed inlet valve**: posisyon, OPENED / CLOSED at torque switches. Gumagalaw sa OPEN / CLOSE command ng sariling IBD sheet (seal-in: tumatakbo hanggang sa dulo; inching: habang may command). Travel: TP 35.0 s - 5 s = 30 s (TCA610 ~ 626, TCA650; IBD sheet 16 / 18 "opening time + 5 sec"); inching TCA618 R 2.5 %/s; K 99 % OPENED, K 1 % CLOSED. Ang warming valve ay ang posisyon ng engine (U.tt ZT-AS1011), ang SSFI ay ang c.ssfv ng engine.
- **Extraction NRVs No.2 ~ 5 at cold reheat NRV (TC-19, TC-41 ~ 45)**: bukas habang on load at walang trip (solenoid energized, may steam flow), sarado ng cylinder pagka-trip. AOV travel R 20 %/s (5 s).
- **LP exhaust hood spray valve FV-CD1904**: limit switches mula sa c.hso (IBD TC-35).
- **Generator voltage A-B / B-C / C-A**: tcs-gen.js g.V x 13.8 kV (K1AU3E1-0003 G1 13.8 kV). AVR IN USE = field switch 41.
- **Healthy na contacts** (walang fault ang model, tuntunin ng tcs.js tcsIO): 18 AVR / protection trouble = 0, VT fuse normal = 1, 4 oil filter dP HIGH = 0, generator leakage HIGH = 0. Oil tank LOW / HIGH = 0 mula sa c.tankOk. Hand turning interlock = 0 (kapareho ng TB-9 net 53), turning gear local PB = 0, DS closed = 1.
- **Gland steam seal header / LP inlet temp**: U.tt TEGS1002 / TEGS1003 ng engine.

- **Hardwired TCS -> DCS na ends (para sa 33 ni MINAMI)**: IBD TA-6 net 15 (MSV / HPCV fully closed and TCS major trouble, I.0403 / 0404), IBD TA-1 input 10 (OPC turbine trip PB, I.1280), 86G-A / B operated at generator trip (U.lo86 ng gen-panel.js; I.093A / 093B / 041A), SSFI closed (I.0419), mode judgement instrument normal = 1 (I.089D), load up rate U.rateUp x 100 / 150 %/min (AI0421), gen voltage x3 (AI0807 / 0871 / 0903), generator MWh = integral ng MW (U.dev.mwh, AI0694).
- **Modbus generator voltage A / B / C** (30134 ~ 30136): g.V x 13.8 kV.

## Bilang

- TCS channels na "needs": 152 → 64.
- 33 hardwired TCS -> DCS points: 12 → 24 na may value (natitira 9: gen current A / B / C, Mvar, pf, Mvarh, Modbus line A / B duty, AMB. COLD MODE TEMP.).
- Modbus words na walang value: 3 generator voltage → 0 (natitira: Mvar, rotor position, metal temps ni YUA).

## Sinubok

- `node tests/lanes/run-all.cjs`: 16 tests, 0 failed. `tools/check/no-fit.cjs`: 0 new.
- Live headless sa tunay na page, 150 MW tapos turbine trip: 346 reads, 0 walang numero. Bago ang trip: lahat ng drain CLOSED, NRV FULL OPEN, hood spray CLOSED, gen voltage 13.8 kV. Pagka-trip: NRV sarado sa 5 s, hood spray bukas, gen voltage 0. 0 page error.

## Hindi pa / natitira

- Hindi bumubukas ang drains pagka-trip: walang OPEN command ang IBD TC-1 ~ 13 (hindi naka-AUTO ang memory ng sheet). Kay YUA / MARIA ito (IBD init).
- 64 needs pa: 11 AVR selection / limiter, 7 generator current / Mvar / pf / field, 13 metal temps (YUA), servo coil current 18, TSI 2, EOS 3, THC RTD 4, gland diverting 2, SSFV bypass, SFV close limit, space heaters 2.

Pirma: TCS IO : TSUBASA (lane 2).
