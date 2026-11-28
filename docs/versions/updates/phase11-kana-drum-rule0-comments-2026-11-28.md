# Phase 11 KANA: drum block, Rule 0 references removed (2026-11-28)

Comment-only change in plant.js (drum block) and hx.js. No value changes.
- Removed the operating procedure quotes (PR-OPE-5002 / 5004) from the drum shrink, lower header drain, MBD, CBD and thermal
  expansion notes. The laws there are all from design data: flow diagram PD-019, mass balance MB-019, KOSO MBD valve sheet,
  hydro test R3-0-101, drum K1AU3-B-0-004, IF97.
- Removed the old 03.png note on pr.integLoss (25 T/H). It was history, and the value has been the MB-019 item 22 CBD design of
  15 T/H since beta.66.
- hx.js header: "no fit to a plant snapshot or trend" is now "design data and first principles only, no fit".
- no-snapshot baseline 565 -> 556. no-fit baseline 22 -> 21 (the old 03.png integLoss line).
- KANA audit: every item that the docs can close is closed. ntu0 3 stays (c): tube ID / wall are NOT IN DOCS.
