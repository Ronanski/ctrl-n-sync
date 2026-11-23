# LMYP OTS 1.0.0-beta.330 (LEADER : JENNIE, 2026-11-23)

## Ano ang inayos (Audit 3 #5, NO-SOURCE)

**Power factor ng 6.6 kV motors.** Dati iisang 0.85 ito para sa lahat ng motor at walang source. Ngayon may sariling pf ang bawat motor, kinuha sa ETAP load flow ng planta.
- Source: K1AU3-E1-0-307 RA, "Calculation for voltage dip of large motor starting", 2014-02-20.
- Bus Input Data (p A.3): MW at Mvar ng bawat motor bus.
- Branch Connections (p A.12): aling cable (C M-xxxx) ang galing sa Bus 1AM papunta sa motor bus.

| Motor | MW / Mvar | pf |
|---|---|---|
| M-1004 PAF | 3.919 / 1.545 | 0.930 |
| M-1115A BFP | 3.761 / 1.485 | 0.930 |
| M-1220 IDF | 3.498 / 1.385 | 0.930 |
| M-1005 SAF | 1.967 / 0.793 | 0.927 |
| M-1501A/B seawater pump | 1.702 / 0.690 | 0.927 |
| M-1007A/B FA blower | 0.514 / 0.216 | 0.922 |
| M-0703A plant air compressor | 0.559 / 0.234 | 0.922 |
| M-1108A ACWP | 0.237 / 0.102 | 0.919 |
| M-1116A CEP | 0.269 / 0.115 | 0.919 |

Ang standby motor (B o C, walang load sa study) ay may pf ng kapareha nitong tumatakbo.

## Epekto sa operator

Sa 150 MW, mula 14.4 MW naging **15.7 MW** ang house load, at 6.3 MVAr ang reactive. Bumaba nang mga 1.3 MW ang export. Nasa 49.9 % ang unit auxiliary transformer.

## Mga test

- elec_desk: ALL PASS (bagong expected value, kinompyut mula sa formula sa itaas)
- gate: ALL PASS
- check: SAME

## Findings

| # | Finding | Rekomendasyon |
|---|---|---|
| F1 | Sa ETAP study (2014, rev A), ang TR-1A1 ay 32/40 MVA. Sa app, 34/44 MVA ito mula sa KEY ONE LINE K1AU3E1-0003 rev 2 (as-built). | Panatilihin ang 34/44 dahil as-built ang rev 2. Itinala lang ito. |
| F2 | Hindi pa rin kasama sa house load ang 460 V loads (IA compressors, SWBP, MCCs). May kVA ng bawat MCC sa ETAP (hal. MCC-WT1 761 kVA) pero design load iyon, hindi totoong takbo. | Sa susunod na beta, idagdag ang 460 V bus load mula sa ETAP Bus Input Data ng 1B1-M at 1B2-M. Isasama ko ang source sa tabi ng value. |
