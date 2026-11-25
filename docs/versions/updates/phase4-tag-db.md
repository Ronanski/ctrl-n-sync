# Phase 4: ang I/O list ay iisang table na, at sinusuri ang bawat file laban dito (thread "Verify the 15 phases")

## Ano ang nagbago
- Bagong `docs/TAGS.md`: `src/data/ades.txt` ang iisang table ng bawat DCS address (3,816 I/O point, 2,702 tag, memory list 101 ~ 105); sino ang gumagamit.
- Bagong `tests/lanes/qa/tag-db.cjs` (Checks): isang tag = isang address; bawat row ng alarms (705), bind (10), tcs-dcs (69), field rows at states (616) at loop list (1,058 address) ay tugma sa table. Bagsak kapag may bagong hindi tugma.
- `tests/lanes/qa/tag-db-known.json`: 10 kilalang pagkakaiba na may dahilan at may-ari: 4 field tag na may dagdag na gitling (MIR-L-1090 laban sa MIR-L1090), 2 panel na ARP / IRP, 1 loop address SI9990 na wala sa memory list, 3 alarm row na PSL-DO1043 sa address ng PSH-DO1043.
- `docs/PHASES.md` Phase 4.

## Test
- Pasado (0 bago, 10 kilala). Bago ang tuntunin ng alarm name (TE- = TT-, numero ng sensor), 120 ang lumabas; sinuri ang tuntunin na hindi nito pinagsasama ang ibang sensor (A1 laban sa A2).
- Walang binago sa app mismo.
