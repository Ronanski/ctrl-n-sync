# Turbine readings at states mula sa TCS (Modbus)

Ano ang nakikita ng operator: dalawang bagong page sa Turbine and generator.

- **Turbine readings from the turbine control**: 143 na reading na ipinapadala ng TCS sa DCS sa Modbus (STN102 SI1100 ~ SI1245). Kasama dito ang steam pressure at temperature, metal temperature, speed, vibration, expansion, oil at bearings, generator, at posisyon ng mga valve. Bawat reading ay may loop tag ng DCS kapag may loop ito sa loop list. Halimbawa: PIMS19011 main stop valve inlet pressure A, 122.3 kg/cm².
- **Turbine states from the turbine control**: 80 state mula sa SI1000 ~ SI1004. Ang automatic start-up program ay naka-table ayon sa step (0 hanggang 8), may selected, executed, completed at mode. Kasama rin ang oil system at turning gear, ang master trip solenoids, ang non-return valves at ang gland seal valves.

Paano nababasa ang halaga: may bagong basa sa `src/ui/plant/plant.js` (resolve, `k: 'mb'`). Ang isang tag, o word/bit na nasa Modbus list (PLC to DCS) at wala pang ibang source, ay kumukuha ng halaga sa TCS I/O end ng row na iyon (`TCE_IO_LIVE.mbRead`). Iyon din ang halagang pinapakain sa TCS program, kaya iisa lang ang source. Ang tag na may sheet, I/O row o field row na ay hindi nagbabago. Si YUA ang magre-review ng bahaging ito bago i-merge.

Ganoon din ang 33 hardwired na signal mula sa TCS papuntang DCS na walang ABC o DITL sheet na bumabasa (listahan ni TSUBASA `tcs-dcs-33-no-row.md`; `tcs-dcs.json` rows, dir in). Halimbawa ang TCS-DI1055 turbine trip-2, galing sa TCE960-26. Nasa Turbine control interface, Generator at Purge-trip page na ang lahat ng 33. Dati `-----` ang lahat. Ngayon, 12 ang may halaga sa 150 MW. Ang iba ay wala pang halaga sa TCS end (IBD TA-6, TCA990 generator, MOD line, GCP).

Source:
- "LMYP-1 #1 MODBUS Communication list between DCS and turbine system.xls", sheet PLC to DCS (`src/data/tcs-dcs.json`)
- STN102 loop list (`src/ui/plant/dcslists.js`)
- Listahan ni lane 2 TSUBASA (`modbus-where-used.md`, "For MINAMI")

Ang unit ng 37 reading na walang loop ay ayon sa letra ng instrument (ZT = %, TE = °C, PT = kg/cm²), dahil walang range ang listahan para sa kanila.

Sinubok:
- Headless app sa 150 MW (RUN). Sa readings page, 113 sa 143 ang may halaga. Ang 30 na `-----` ay mga row na wala pang halaga sa TCS I/O end (metal temperatures, rotor position, generator voltage at current).
- Sa states page, may state ang start-up program, oil system, trip solenoids at ilang valve. Ang mga non-return valve limit at oil alarm contact ay `-----` pa rin.
- `tests/lanes/hmi-turbine/pages-bound.cjs`: 8 pages, 638 elements, 0 problema.

Hindi pa nasubok: tablet layout, at ang Cold start.

Natitira:
- Ang 14 na button ng DCS papuntang TCS (WM0210: gland seal start/stop, ATS auto/off, steps 0 ~ 8). Ilalagay ito sa Turbine page kasabay ng palit ng engine ni YUA, para walang pangalawang daan.
- Ang `-----` na row ay para kay lane 2: kailangang bigyan ng halaga ang TCS I/O end nila.

Lane 7, HMI TURBINE : MINAMI
