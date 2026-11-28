# Phase 11 KANA: SH tap pressures from the spray valve sheets (2026-11-28)

Rule 0 cleanup (user 2026-11-28 5:18 AM PHT). The SH tap shares of `AN_SHDP` (unit.js) that give PT-BR1130 (after SH panel #1,
spray 1 point) and PT-BR1150 (finishing SH inlet, spray 2 point), and the spray point of FT-FW1109 / 1119 (fw.js), came from the
transmitters of a plant screen (6.4 / 11.6 and 9.3 / 11.6). They now come from design data.

- Source: control valve data sheet K1AU3-E2-0-123 R1, item 19 TCV-FW1110-1 COND 2 12,500 kg/h 166.5 -> 142.0 kg/cm2 G (pdf p102),
  item 23 TCV-FW1120-1 COND 2 10,000 kg/h 166.5 -> 138.5 kg/cm2 G (pdf p122). COND 2 of item 19 = the FHI Fig 10 MCR spray
  (2.7 % x 460 = 12.4 T/H). PC read by YUA: /mnt/project-files/kana-sh-tap-reads-2026-11-28.md.
- Drum at MCR = SH outlet 129 + SH drop 16 = 145 kg/cm2 G (FHI P2S7 Tab 1, DERIVED).
- s1 = (145 - 142.0) / 16 = 0.188 (was 0.552), s2 = (145 - 138.5) / 16 = 0.406 (was 0.802).
- NO-SOURCE: desuperheater nozzle DP (no DSH data sheet in the docs), taken as 0.
- Geometry route closed: tube ID and tubes per panel NOT IN DOCS (kana-sh-tubes-sootblow-2026-11-28.md).
- Effect: both spray points sit higher (closer to the drum), so each spray valve has less DP and opens a bit more for the same flow.
- no-snapshot baseline 577 -> 575.
