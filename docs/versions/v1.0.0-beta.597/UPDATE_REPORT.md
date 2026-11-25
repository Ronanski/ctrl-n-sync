# v1.0.0-beta.597 — Lane 7 gap list closed: VCB off points, gland steam temperature output (HMI turbine)

## Ano ang bago (nakikita ng operator)
- Monitor faceplate (Y button) ng BFWP-A / B, CEP-A / B, closed cooling pumps A / B at sea water pumps A / B / C: bagong row na **VCB off** (ang pangalawang contact ng VCB, MIV-Pxxxx2).
- Auxiliary steam: **Turbine side, output** (TT-AS1017-1, ang output ng DCS ng gland steam turbine side temperature).

## Batayan
- DCS I/O list: MIV-P1115A2 / B2, MIV-P1116A2 / B2, MIV-P1108A2 / B2, MIV-P1501A2 / B2 / C2 (station 3), TT-AS1017-1 (station 2 AO0471).

## Bilang (gap list ng lane 7, bawat equipment ng I/O list na walang kahit isang address sa page)
- Condensate 2 -> 0, make-up and cooling 2 -> 0, sea water 3 -> 0, auxiliary steam 1 -> 0 (MV-AS1394 / 1397 ay nakakabit sa pamamagitan ng kanilang sheet DITL-75 / 116). Feedwater, turbine, turbine oil, generator: 0.
- HP bypass (PCV-MS1020, PT-MS1021, TT-MS1022-1 / -2): nasa Reheat steam and turbine bypass page na.

## Hindi pa
- Ang mga punto na walang value sa engine ay `-----`.

## Sinubok
- `tests/lanes/hmi-turbine/pages-bound.cjs`; bilang ng gap list mula sa lahat ng HX page at registry (static).
