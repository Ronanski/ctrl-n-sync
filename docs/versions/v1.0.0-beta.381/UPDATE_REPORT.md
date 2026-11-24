# LMYP OTS 1.0.0-beta.381 (TCS LOGIC : MARIA, lane 1, 2026-11-25)

Sumunod sa beta.375. TCS logic lang (headless), walang pagbabago sa plant model, sa HMI at sa tumatakbong app.

## Ano ang bago

| # | Ano | Detalye | Pinagmulan |
|---|---|---|---|
| 1 | Ang 407 TCE / TCA sheet ay iisang programa na tumatakbo | `src/digital/tce-run.js`: `TCE_RUN.compile(sheets)` binabasa ang bawat sheet mula sa drawing (net reader, inilipat dito mula sa `tools/data/tce_net.mjs` para iisa lang ang reader ng tool at ng app), kinakabit ang bawat input sa net na nagpapagalaw dito (sa sheet, sa off-page connector, sa definition / reference, o sa PORT kapag galing sa labas ng TCE / TCA set), at `TCE_RUN.step` pinapatakbo ang bawat sheet sa sariling cycle nito, sunod ayon sa numero ng sheet, at sa loob ng sheet ang bawat block pagkatapos ng mga block na nagpapakain dito | Typed sheets (331DM09784 TCE, 331DM09788 TCA); macro list TCA013 ~ TCA020 (ML 1 ~ 73) |
| 2 | SW ng block | Ang side input (itaas o ibaba) ay ang SW ng macro list. Patunay sa TCA100 / TCE050: ang INITIAL = TP A001 ng ON(1) ay 0 sa unang 10 s ng controller at 1 pagkatapos; ito ang SW ng mga timer at comparator, kaya hawak sila sa 0 sa unang 10 s ("INITIAL clears every timer") | TCA100 page 34 |
| 3 | Ports (para sa lane TCS I/O) | 1,494 port: CON 896 (connector mula sa TPC tables TCP1xxx ~ 3xxx, CRT tables TCT, IBD, DCS), PIO 446 (PI/O row, pangalan = table at order, hal. `PIO:TCA900-1`), CRT 124 (push button ng TCS HMI), SYS 27, REF 1. Ang I/O binding ang nagse-set nito; walang ibang daan papasok o palabas | Drawing |
| 4 | Test | `tests/tce/sheets.cjs`: compile ng lahat, 30 s plant time, pareho ang resulta sa dalawang takbo, bawat binary block 0 / 1 lang, at hindi bababa sa 204 ang tumatakbong sheet | |

## Bilang

- Sheets na tumatakbo bilang logic (lahat ng block at macro may kahulugan): **0 → 204 sa 407** (G sheets: 0 sa 14, susunod).
- Small blocks na may kahulugan: 3,343 sa 3,363. Kulang: MODE 5, UNT-FG 4, VALVE CONTROL MT1 6, SC 2, FILTER 1, L-RATE 1, PRESS COMPENSATE MT1 1.
- Macros: 0 sa 508 (51 uri). Ito ang humaharang sa 203 sheet. Ang kahulugan ng macro ay wala sa PDF; nasa HIACS engineering backup ito sa PC (kinokopya ng LEADER : YUA).

## Sinubok

- `node tests/tce/sheets.cjs` (204 / 407, 30 s sa ~1.3 s), `node tests/tce/run.cjs` 57 / 57, `node tools/data/tce_net.mjs` parehong bilang gaya dati (6 not named, 1,999 joined, 716 external, 0 bad), `node tools/data/tce_check.mjs` OK, build `--check` SAME.

## Hindi sinubok

- Hindi pa naikakabit sa app at sa plant (wala pang I/O binding; ang ports ay 0). Kaya wala pang shadow run laban sa `tcs.js`.

## Susunod

1. Ang 14 G sheet (generator breaker at protection relay logic) bilang tumatakbong logic.
2. Macro meanings mula sa HIACS backup (TRIPPLE INPUT DIAGNOSTICS, AI DIAG.MD, CRI MONT.MD, TMR AI DIAGNOSTICS, VALVE DIAGNOSIS, STEP CONTROL MD ... ).
3. Shadow run ng COM, EHG, TPC kapag may binding na ang ports (lane TCS I/O).
