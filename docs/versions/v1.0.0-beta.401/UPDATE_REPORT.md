# LMYP OTS 1.0.0-beta.401 (TCS LOGIC : MARIA, lane 1, 2026-11-25)

Sumunod sa beta.391. Generator protection logic (headless). Ang Logic page ay pareho ang itsura (ang drawing ay "t" pa rin ang nakasulat).

## Ano ang bago

| # | Ano | Value | Pinagmulan |
|---|---|---|---|
| 1 | 18 sa 20 relay delay ng SH-G-5A / 5B / 6A / 6B na "t" lang sa drawing | 59GN 10 s; 59 1st step 2 s, 2nd step 20 s; 27 2 s; 24 3rd step 2 s; 81U #1 / #2 at 81O #3 / #4 2 s bawat isa (protection A at B pareho) | LM-GEE-2015-0059 R1 Inspection Report GPP Limay Unit 1 (Beckwith M-3425A): A p.21, 29, 33, 35, 41; B p.49, 57, 61, 63, 69 (as-set Time Delay at sinukat na operating time) |
| 2 | Paano nakatala | Bawat sheet ay may `set: { key: ['TP:<s>', '<page at item>'] }`; binabasa ng `TCE_RUN.gnet` kapag "t" lang ang nasa kahon | |
| 3 | Test | `tests/tce/sheets.cjs`: 59GNA 10 s, 59A 2nd 20 s, 81O #4 2 s, at ang 24 2nd step ay wala pang oras | |

## Bilang

- G sheets: **10 → 12 sa 14** (G-5B, G-6B tumatakbo na). Lahat: **214 → 216 sa 421**. TCE / TCA 204 sa 407 (hintay ng macros).
- Natitira sa G: G-5A at G-6A, ang 24 (volts / hertz) 2nd step ay inverse time curve #1, time dial 2, pickup 107 %: ang oras ay nakadepende sa V/Hz. Kailangan ang formula ng curve mula sa Beckwith M-3425A instruction book (wala sa report). Walang oras na hinulaan.

## Sinubok

- `node tests/tce/sheets.cjs` 216 / 421, `node tools/data/tce_check.mjs` OK, build SAME (bagong dist dahil nasa app ang G sheets).

## Hindi sinubok

- Hindi pa nakakabit sa planta (ports). Walang shadow run laban sa `tcs-gen.js`.

## Susunod

Macros mula sa HIACS backup (hintay ng zip sa PC).
