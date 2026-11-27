# Phase 11 part 6 (generator): cold air 45 C from the nameplate

MODEL GENERATOR ELECTRICAL : YUI, 2026-11-27 PHT.

- Binago: ang cooling gas pagkalabas ng air coolers ng generator ay 45 C sa 37 C na tubig (nameplate 310SD18-613, generator O&M GAE-2014-0791 R0 PDF p180, basa ni YUA), hindi 40 C (ang reference ng IEC na ginamit bago nabasa ang nameplate). Kaya approach 8 K, at ang stator rise sa rated current ay 123 - 45 = 78 K (dati 83 K). Sa 150 MW: gas 46 C (alarm ng TCS 50 C), stator 104 C (dati 41 / 103 C).
- Sinubok: `tests/lanes/gen/gen-electrical.cjs`, `no-fit.cjs`, `one-path.cjs`.
- Walang ibang bahagi na nagbago.
