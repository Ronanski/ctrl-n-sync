# LMYP OTS 1.0.0-beta.332 (LEADER : JENNIE, 2026-11-23)

## Ano ang inayos (Audit 3 #5, NO-SOURCE)

**Kasama na sa house load ang 460 V load ng unit.** Dati hindi ito binibilang at walang source. Ngayon kinukuha ito sa ETAP load flow ng planta, K1AU3-E1-0-307 RA, LOAD FLOW REPORT p A.14, Bus 1AM.

| Saan dumadaan | MW / Mvar | Kailan binibilang |
|---|---|---|
| TR-1B1 (Bus21) | 0.413 / 0.263 | habang naka-on ang unit |
| TR-1B2 (Bus49), walang ESP | 0.808 / 0.233 | habang naka-on ang unit |
| ESP T/R sets (Bus51, nasa TR-1B2) | 0.910 / 0.024 | kapag in service ang ESP (field state) |

- Kapag nag-black-out ang BUS 1AM, patay din ang 460 V buses, kaya zero ang 460 V load.
- Nadagdag sa 6.6 kV bus current ang current ng dalawang transformer sa 6.6 kV side: 76.6 A kapag walang ESP.

## Epekto sa operator (150 MW)

| | beta.330 | beta.332 (ESP off) | beta.332 (ESP on) |
|---|---|---|---|
| House load | 15.7 MW | 16.4 MW | 17.4 MW |
| Unit aux transformer | 49.9 % | 52.4 % | mas mataas pa nang kaunti |

## Mga test

| Test | Resulta |
|---|---|
| elec_desk | ALL PASS (may bagong check para sa ESP) |
| instructor (black-out ng bus 1AM) | PASS |
| gate | ALL PASS |
| check | SAME |

## Findings

| # | Finding | Rekomendasyon |
|---|---|---|
| F1 | Nakakabit din sa Bus 1AM ang coal yard (CY-M), coal unloading (CSU), conveyor (CNVR) at water treatment (WT-M). Nasa 7.9 MW sila sa study, pero common plant loads ang mga ito at hindi naka-model ang mga system nila. | Huwag munang isama. Kapag na-model na ang coal handling, idagdag ang load nila mula sa parehong study. |
