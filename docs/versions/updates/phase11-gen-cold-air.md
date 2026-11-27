# Phase 11 part 6 (generator): air cooler data from the generator O&M (cold air 45 C, duty 2,120 kW)

MODEL GENERATOR ELECTRICAL : YUI, 2026-11-27 PHT.

- Binago 1: ang cooling gas pagkalabas ng air coolers ng generator ay 45 C sa 37 C na tubig (nameplate 310SD18-613, generator O&M GAE-2014-0791 R0 PDF p180, basa ni YUA), hindi 40 C (ang reference ng IEC na ginamit bago nabasa ang nameplate). Tugma rin ang cooler sheets ng Kitashiba PLH10293 / PLH10294 (hangin palabas 45.0 C). Approach 8 K; stator rise sa rated current 123 - 45 = 78 K (dati 83 K).
- Binago 2: ang init na ibinibigay ng generator sa closed cooling water (port q.ccw.YUI) ay sarado na sa rated duty ng apat na air cooler, 2,120 kW (O&M GAE-2015-0063 R0 p36: 2 x 810 + 2 x 250 kW, basa ni YUA), hindi 3,041 kW (ang laki ng tubo ng cooling water sa mass balance MB-021). Ang friction ng bearing (240 kW) ay napupunta sa lube oil, wala rito. Sa 150 MW: mga 1.94 MW (dati 2.85 MW).
- Binago 3: ginawang muli ang 150 MW start (src/data/st150.txt, tools/steady150/make.cjs), dahil ang lumang start ay may lumang temperatura ng generator (gas 39 / 38 / 43 / 44 C, stator 92 ~ 99 C) na tumatagal ng ~30 min bago umayos.
- Sinubok: `tests/lanes/gen/gen-electrical.cjs` sa LOADED na 150 MW start, `no-fit.cjs`, `one-path.cjs`, `ports.cjs`.
- Walang ibang bahagi ng planta na nagbago (walang bumabasa pa ng q.ccw.YUI; si SUZU ang kukuha nito).
