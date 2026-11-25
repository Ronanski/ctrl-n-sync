# Phase 6 slice 1: one net, several addresses (2026-11-26 ~12:50 AM PHT)

Source: YUA read of the PDFs (/mnt/project-files/phase6-mov-damper-wiring-2026-11-26.md): ABC-050 M.012C -> O.0842 and O.0844 (HP bypass
spray solenoids, TR236 3 s); M.012D -> O.0843 and O.0845 (LP bypass / desuperheater spray, TR237).

- The app already reads them: the reader puts every address text of a wire in S.tagN, and the engine link index (engine/links.js) takes
  each one within 4 of the wire as a name of that net. The QA trace counted only the one name it shows (S.lab), so O.0842 / 0843 / 0845
  showed as unlinked.
- tools/trace/trace.cjs now catalogs the same tagN names (same rule as links.js); such a row is an alias of the net and is not counted
  again as a B1 break.
- Counts (QA trace, 150 MW, 2 min): I/O linked 1,787 -> 1,791, unlinked 145 -> 142, value 2,139 -> 2,143, memory on a sheet
  2,971 -> 3,046; memory with no source 9 -> 10 (M.0149 SOx ctl BU-CMD on ABC-005, newly seen, no source: a real gap).
  tools/trace/baseline.json moved in this PR.
- No app code changed. Still open from the 8 drawn rows: ABC-054 / 055 PO1 / PO2 = AO0704 / 0705 / 0708 / 0709 (the pulse output of the
  PO block is not an address of a net yet) and DITL-22 O.0447 MOR-P1115B2 (#D copy).
