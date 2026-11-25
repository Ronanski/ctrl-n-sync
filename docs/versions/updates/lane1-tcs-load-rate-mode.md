# TCS load-up rate MODE blocks (TCS LOGIC : MARIA, 2026-11-25 PHT)

Bilang: 360 → 361 of 419 TCS sheets (TCA768A SPEED LOAD HOLD; drawing-complete 254 → 255).

## Binago
- **MODE (LMA810, TCA768A), limang block (HOT, WARM, COLD 1, COLD 2, A-COLD):** load-up rate (%/min) ayon sa generator load, galing sa mga table na naka-print sa tabi ng bawat block (4 MW points at 6 rates).
  - Habang hindi pa tapos ang IP → HP transfer (T = 0, CRI 2.6), 5.0 %/min sa lahat ng mode.
  - Kapag T = 1, ang rate ng load band:
    - > 90 MW
    - 60-90 MW
    - 33-60 MW
    - 22.5-33 MW
    - < 22.5 MW
  - HOT: 0.7 / 0.4 / 0.4 / 1.0 / 1.0. WARM: 0.6 / 0.35 / 0.25 / 0.25 / 0.75. COLD at A-COLD: 0.5 / 0.3 / 0.2 / 0.2 / 0.5.
- **Source (PDF lookup ni EIMI):** PPE-14-0726 R1 p 3 / Att-2 / 3, 310SC90-775 p 26 *2 at STIE-14811 p 147. Tinapat ni EIMI ang mga slope sa FHI start-up curves (PART-2 SECT 7).

## (c) Hinango, hindi naka-print
- Ang 0 / 1 na kahulugan ng T.
- Kung ">" o ">=" ang bawat hangganan ng band, at kung may dead band.
- Ang dalawang pinakamababang band ay nakabatay lang sa pagkakasunod ng pagkaka-print.

## Sinubok
- tests/tce/sheets.cjs: pasado. Bagong test: sa HOT, ang 100 MW ay 0.7, ang 70 MW ay 0.4, ang 25 MW ay 1.0, ang 10 MW ay 1.0, at kapag T = 0 ay 5.0.
