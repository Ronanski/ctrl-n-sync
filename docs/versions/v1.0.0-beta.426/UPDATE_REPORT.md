# LMYP OTS 1.0.0-beta.426 (EIMI, lane 6, 2026-11-25)

Test harness lang, walang app change.

## Ano ang inayos

| # | Finding | Ano ang nangyari | Ayos | Rekomendasyon |
|---|---|---|---|---|
| 1 | "ABC VALUES LAYOUT" check flaky sa CI (PR 512, 518: fail, tapos pass sa rerun, parehong code) | Na-reproduce sa CI: 5 sa 8 takbo bumagsak sa isang job (ABC-009A timer value, ABC-010 value n109). Ang `open()` ng tests/regress/lib.js ay nagsisimula 500 ms pagka-load ng sheets, habang tinatapos pa ng shell ang start: Roboto pa ang mga value (bago ang class `sc`, saka lang IBM Plex Mono) at 27 px mas maikli ang drawing pane hanggang magsara ang message bar. Ang sinusukat ng test ay depende sa bilis ng makina | `open()` naghihintay na: class `sc` + fonts loaded + `document.fonts.ready` + parehong laki ng drawing pane sa 4 sunod na basa (1 s). Walang binagong tolerance | Lahat ng test na gumagamit ng `open()` ay sumusukat na sa tapos na page. Kapag may bagong flaky, unang tingnan kung nagsimula bago tapos ang shell |

## Tests

- CI probe (pansamantalang branch, buburahin): 10 sunod na takbo sa CI, 0 sheet na may problema
- Local: values_layout 0 of 54
- build --check SAME, operator text ok, no-fit 0 bago
