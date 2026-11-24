# LMYP OTS 1.0.0-beta.391 (TCS LOGIC : MARIA, lane 1, 2026-11-25)

Sumunod sa beta.381. TCS logic lang (headless), walang pagbabago sa plant model, sa HMI at sa tumatakbong app.

## Ano ang bago

| # | Ano | Detalye | Pinagmulan |
|---|---|---|---|
| 1 | Ang 14 G sheet (generator breaker at protection) ay kasama na sa iisang programa | `TCE_RUN.gnet(sheet)`: reader ng sheet ng 310SD03-743 (typed sa IBD form): gate G:OR / G:A at ang input bar nito, NC = NOT, kahon na "DI" + oras = pick-up delay (ML 47 TP), continuation circle = connector papunta / galing sa ibang G sheet (sa numero ng circle at sa "SH-G-xx" sa tabi; "SH-G-*" = sa lahat ng bumabasa ng numerong iyon), contact ng relay / switch ng equipment = PLANT port na may pangalan ng relay (hal. `PLANT:G-5A.r27 (27A) (GPP) UNDER VOLTAGE ON`) | 310SD03-743 rev 1 sheets 7 ~ 20 |
| 2 | Ayos sa join | Ang source ng isang G sheet na may circle ay ang input connector nito (hindi na pinapalitan ng port); ang src na may ':' sa key ay binabasa nang buo | |
| 3 | Test | `tests/tce/sheets.cjs`: kasama ang G sheets; SH-G-1A "52G CLOSED" = NOT ng OPEN contact; SH-G-1B circle 45 "52G REMOTE SELECTED" = selector ng SH-G-1A; floor 214 | |

## Bilang

- TCE / TCA: **204 sa 407** (walang pagbabago). G sheets: **0 → 10 sa 14**. Lahat: **214 sa 421**.
- Ang 4 G sheet na hindi pa (G-5A, G-5B, G-6A, G-6B, generator protection "A" at "B"): 20 delay timer na "t" lang ang nakasulat sa drawing (setting ng protection relay, wala sa drawing). Pinagmulan na hahanapin: LM-GEE-2015-0059 R1 Inspection Report for GPP, GCP, SYN Limay Unit 1 (PC, SMGP `LMYP-1 Complete (From Edmaru)\LMYP-1 MHPS TG Shop Test Report\#1\`); check: Phase 2 DBE-16-0138 R1 Setting List of Gen. Protection Panel (identical units). Walang oras na hinulaan.
- 1 input na dalawa ang pinagmulan: "SH-G-*" circle 6 (G-5A at G-6A): naiwan bilang port hanggang mabasa sa drawing kung OR ito.
- Ports: 1,646 (CON 897, PIO 474, CRT 124, PLANT 123, SYS 27, REF 1).

## Sinubok

- `node tests/tce/sheets.cjs` (214 / 421, 30 s sa ~1.6 s, G checks pass), `node tests/tce/run.cjs` 57 / 57, `node tools/data/tce_net.mjs` parehong bilang, build `--check` SAME.

## Hindi sinubok

- Hindi pa nakakabit sa app at sa plant (ports = 0, lane TCS I/O). Walang shadow run laban sa `tcs-gen.js` pa.

## Susunod

Macro meanings mula sa HIACS backup (203 TCE / TCA sheet ang naghihintay), ang relay times ng G-5A / 5B / 6A / 6B, saka shadow run.
