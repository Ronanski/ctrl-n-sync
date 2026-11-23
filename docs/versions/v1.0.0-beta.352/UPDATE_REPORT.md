# LMYP OTS 1.0.0-beta.352 (LEADER : JENNIE, 2026-11-24)

Pangatlong beta sa ilalim ng "GO DESIGN". Prayoridad ng user (06:44 PHT): ang bed ay dapat nasa design na 850 - 870 C sa bawat load, at bumababa habang bumababa ang load.

## Ano ang inayos

1. **Design bed anchor (D9): 860 C, hindi na 937 C ng planta.**
   - tbA 860 C, cSol 10,211 kW/K, uaS 185.8 kW/K, SH panels 76.1 kW/K bawat isa, fgP at tuA sa design anchor.
   - Galing ang lahat sa design: P2S4 p2-4-8 (850 - 900 C normal), SU:10198 (hold 850 - 870 C), FHI P2S7 Fig 8 (furnace 840 C sa 100 %), panel heat 62.5 MW.
   - Steady check sa anchor: furnace exit 840.0 C, upper walls 146.5 MW, panels 62.5 MW.
2. **Hawak muna ang D3 (kKL 3.8). Nananatili ang kKL 9.2.**
   - Sinukat (plant-study 15, damping file, points 5 - 9): sa kKL 3.8, nawawala ang karamihan ng mabilis na sagot ng steam sa coal. Ito ang daan na gas velocity papunta sa solids circulation, at ito ang lead na kailangan ng PIC-COBM loop.
   - Resulta: lumalaki ang 12-min na swing ng coal at pressure hanggang DRUM LEVEL H.H. Nangyari ito sa design anchor at pati sa lumang anchor (main na kKL 3.8 lang: lumaki ang swing sa 60 min).
   - Sa kKL 9.2 at design anchor: kumakalma ang swing sa 150 MW (60 min, bed 868 - 874 C).
   - Bukas pa ang D3: hindi pareho ang solids profile ng FHI sa 60 % load sa profile ng 150 MW na binabaan lang ang velocity. Kailangan pa itong lutasin sa physics.
3. **Na-rebuild ang st150 (150 MW start state)** mula sa design bed. Sa unang chunk, sinisimulan ng make.cjs ang bed sa tbA ng engine source.
   - 150 min, walang trip: 151.0 MW, coal 91.0 T/H, bed 865 C, drum 133.3, MST 541.0, RHT 538.4, level +3.6 mm.
4. **Bagong tool: tools/accept/part1.cjs** (ACCEPTANCE Part 1, headless).
   - Nagsisimula sa 150 MW. Pinipindot ang ▼▼ / ▼ ng HIC-ULD habang binabantayan ang TARGET MW (COS SI0243), hanggang 90 at 45 MW.
   - 60 min settle, tapos 30 min measurement sa bawat load.
   - Limestone mula sa U.lm.q (pareho ng U.lmQ). Ang CRH ay ang HP exhaust (HB 446.1). Ang FW ay walang blowdown (HB turbine side).

## Part 1 resulta (headless, 30 min window bawat load)

| | main beta.349 | beta.352 |
|---|---|---|
| PASS / FAIL (lahat ng cell) | 32 / 54 | 34 / 52 |
| Bed 45 / 90 / 150 MW, C | 928 / 981 / 949 | 821 / **863** / 870 |
| Furnace average 45 / 90 / 150, C (design 610 / 755 / 840) | 787 / 838 / 906 | 758 / 810 / 860 |
| MST 90 MW, C (HB 538) | 521 | **541** |
| RHT 90 MW, C (HB 541) | 526 | **536** |

Buong table: tools/accept/results/part1-beta352.md (at part1-beta349-main.md para sa main).

Bumababa na ang bed kasabay ng load: 870 sa 150 MW, 863 sa 90 MW, at 821 sa 72 MW.

## Findings (bago, may rekomendasyon)

| # | Finding | Rekomendasyon |
|---|---|---|
| D3 | kKL 3.8 (FHI 60 % point) ang nagpapa-swing sa pressure loop hanggang DRUM LEVEL H.H. | Lutasin sa physics ang solids profile sa part load. Huwag galawin ang PIC-COBM gains. |
| D10 | Pababa sa 45 MW: sa mga 70 MW, bumibitaw ang HIC-BM at EIC-TM sa MAN, at sinusundan ng target ang MW. Kaya 72 MW lang ang "45 MW" column. | Hanapin ang select signal ng ABC-001C na nagpapa-MAN sa boiler master sa mababang load. Pagkatapos, ulitin ang 45 MW. |
| D11 | Patay ang limestone sa 150 MW start state (U.lmQ = U.lm.q = 0). Design: 12 T/H sa MCR (FHI Fig 13). Wala ang calcination at sulphation heat sa bed balance, at kulang ang solids na pumapasok sa bed. | I-start ang limestone sa st150 sa operator start ng DITL-LS, naka-AUTO ang SOx control (ABC-005 AICFG10571). |
| D12 | PA sa part load: sumusunod sa drawing F(X) ABC-002 S1-LN12 + HIC-TADBS bias. 90 MW: 313 T/H, FHI 236. Ang bias -26.7 ay galing sa plant trend. | Ibalik ang bias sa design (station 50 % = 0). Itala ang F(X) bilang logic ng planta laban sa FHI Fig 12. |
| D13 | Main steam pressure 122.3 sa lahat ng load, HB 126 (ata). | Suriin ang SH pressure drop (drum 133.3, HB SH outlet 129 g) at ang set point ng PIC-COBM. |

## Test

| Test | Resulta |
|---|---|
| npm run -s build, npm run -s check | SAME |
| st150 rebuild 150 min | walang trip, bed 865 C |
| Part 1 (part1.cjs, 60 / 30 min) | 34 PASS / 52 FAIL, walang trip, 0 page errors |
| D9 kKL 9.2, 60 min mula 860 C | kumakalma ang swing |
| main + kKL 3.8, 60 min | lumalaki ang swing (D3 hawak) |
