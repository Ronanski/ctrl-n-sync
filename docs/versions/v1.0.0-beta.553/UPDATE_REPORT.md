# v1.0.0-beta.553 (DCS LINKS BOILER : KIRARA, lane 3): rear wall dampers FA1019 ~ FA1026

## Ano ang nagbago
- **`src/world/field/boiler.js`**: ang 8 rear wall furnace temperature control damper (FA1019 ~ FA1026, ABC-016) ay kapareho na ng front wall (hiling ng lane 6 EIMI):
  - ZSO / ZSC (open / closed limit): mula sa sariling ZT-FA1019 ~ 1026 (AI0416 ~ AI0423), sa end-of-travel rule ng app.
  - MIT / TS / MIL: field state. Normal: walang trip, walang torque, REMOTE, dahil ang ABC-016 ang nagpo-posisyon sa damper mula sa DCS.
  - 40 I/O point, 24 bagong field state.

## Sinuri
- Headless sa 151 MW:
  - Nasa gitna ang mga damper, kaya parehong 0 ang ZSO / ZSC. REMOTE = 1.
  - "Damper FA1022 motor tripped" (`AN.fault`): MIT-FA1022 = 1.
  - Walang duplicate, 0 page error.
- `tests/lanes/run-all.cjs` 14 / 14.

## Hindi nasubok
- Ang mga button sa Plant menu sa UI.
- Ang HMI.

KIRARA
