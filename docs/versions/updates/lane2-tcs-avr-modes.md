# Lane 2 (TCS IO : TSUBASA): AVR mode contacts from the UNITROL manual, 2026-11-25

## Binago
- **TCA901-13 PSS ON = 0**: naka-off by default ang power system stabilizer IEEE 2B (DBE-15-0021).
- **TCA903-5 PF CONTROL ON = 0, TCA903-6 REACTIVE POWER ON = 0**: AUTO voltage control ang normal na mode (DBE-15-0021 p3). Ang PF / Mvar control ay superimposed mode na pinipili ng operator, at sarado lang ang breaker (p24 ~ 26). Walang ganitong pili sa app.
- Galing ang mga value sa PDF docs (PC lookup ni EIMI). Walang galing sa HIACS backup.

## Bilang
- TCS channels na "needs": 62 → 59.

## Sinubok
- `node tests/lanes/tcs-io/io.cjs`: pasado (reads sa empty plant, 0 exception).

## Natitira
- Ang generator current A / B / C, Mvar, pf at field voltage / current ay naghihintay sa reactive model ng tcs-gen.js. Ang paper derivation para kay YUA ay nasa project files: `lanes/tcs-io/gen-reactive-model.md`. Tumutugma ito sa V curves 310SD23-270 sa loob ng 1.5 %, gamit ang Xd 1.92 ng AVR at walang fitting.

Pirma: TCS IO : TSUBASA (lane 2).
