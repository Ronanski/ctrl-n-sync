# v1.0.0-beta.557 — Turbine pages, TCS operator buttons, registry machines and monitor points (lane 7, HMI turbine)

## Ano ang bago (nakikita ng operator)
- **Turbine control interface** (bagong page, Plant > Turbine and generator): lahat ng hard-wired na signal ng TCS / generator panel at DCS sa limang hanay (trip at valves, speed at start-up, utos sa drain valves, load control, generator).
- **Turbine operation** (bagong page): 20 faceplate ng TCS CRT (trip, reset, start-up mode, speed / load, turning gear, oil pumps ...), mga pindot na button at mga lamp mula sa TCE / TCA sheets.
- **Turbine valves and excitation** (bagong page): 16 faceplate (valve test, MSV / CV / CRV, excitation, mga valve ng TCS).
- **Turbine**: main steam pressure 2, main steam temperature, first stage pressure A / B / C.
- **Industrial and waste water**: ang P-0715A / B, P-0058A / B ay tunay na makina na (click = control faceplate, Y = permissive / monitor); MV-IW0391 ay motor valve na may faceplate. Ang remote / local ng P-0715 ay nasa monitor faceplate.
- **Auxiliary steam**: bagong MV-AS1397 turbine gland steam line drain (DITL-116), papunta sa flash pipe.
- **Generator**: 52G1 on / off contact, 52L1 open contact, generator trip output ng DCS.
- **Turbine oil**: air buffer tank ng turning gear (PT-IA1128).
- **Monitor faceplate (Y button)** ng BFWP-A / B (lube oil pumps A / B, lube oil pressure at level switches, winding, bearing, vibration), CEP-A / B, closed cooling pumps A / B, sea water pumps A / B / C; at ang VCB lamp ng control faceplate ay bumabasa na ng VCB point ng I/O list.

## Batayan
- DCS I/O list (station 2 / 3 / 4: MIG-52G1-1 / -2, MIG-52L1, MIT-GENS, PT-IA1128, MIR / MIT / MIL-P1115x1 / x2, PS-LO1115-x1 ~ x3, LS-LO1115-x, MIV-P1115 / P1116 / P1108 / P1501, TT- / VT- ng mga pump); TCS-DI / AI / AO, GCP-AI / AO.
- Sheets: DITL-87, 111, 116, 120; TCE / TCA sheets ng TCS (mga CRT port at lamp key); flow diagrams K1AU3-PD-014, 025, 040.

## Bilang (gap list ng lane 7)
- Turbine: 51 kulang -> 4 (natira: HP bypass MS1020 / 1021 / 1022-1 / -2, nasa lane 6).
- Generator: 11 -> 0. Auxiliary steam: MV-AS1397 nakakabit na.
- TCS operator: 124 button at 117 lamp; 45 lamp na walang drawing sa alinmang sheet ay hindi ikinabit (nakalista bilang miss).

## Hindi pa
- Ang mga punto na wala pang value sa engine ay `-----` (lube oil switches, winding / bearing / vibration ng mga pump, 52G1 contacts ay may value na). Ang unit ng vibration ay wala sa I/O list: numero lang ang ipinapakita.
- Ang 40 TCS motor button ng PR 545 (MARIA) ay idadagdag kapag nasa main na.

## Sinubok
- `tests/lanes/hmi-turbine/pages-bound.cjs`: 5 pages, 350 elemento, 0 problema.
- Headless app 150 MW RUN: bukas ang industrial water, auxiliary steam, generator, feedwater, turbine oil; walang error; ang Y faceplate ng BFWP-A ay nagpapakita ng 25 monitor row; ang 52G1 on contact = Y, off = N.
