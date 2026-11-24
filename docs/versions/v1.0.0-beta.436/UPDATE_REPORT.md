# LMYP OTS 1.0.0-beta.436 (EIMI, lane 6, 2026-11-25)

Audit tool at listahan lang, walang app change.

## Ano ang idinagdag
- `tools/audit/hmi-gap.cjs`: binabasa ang DCS I/O list ng app (src/data/ades.txt), Unit 1 lang, wala ang WTP, coal handling at air compressors (user 2026-11-24: unli supply). Bawat equipment ay tinitingnan kung nasa isang HMI page na (tag sa page o sa bind ng registry).
- `docs/audit/hmi-gap-list-2026-11-25.md`: 1,067 equipment, 791 nasa page na, 276 kulang, bawat isa may tag, address at type, nakahati sa page at lane (6 boiler, 7 turbine).

## Findings
| # | Finding | Rekomendasyon |
|---|---------|---------------|
| 1 | 276 equipment ng I/O list ang wala pa sa kahit anong HMI page | Lane 6 at 7 ang maglalagay, page by page ayon sa listahan; patakbuhin ulit ang tool pagkatapos ng bawat page |
| 2 | 18 DIAG point (station diagnostics) ang walang page | Station DCS diagnostics panel ng lane 6 |

## Checks
- node tools/build/build.js --check, operator-text-check, no-fit, version-check
