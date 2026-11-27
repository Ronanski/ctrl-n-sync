# Phase 11 part 6 (generator): protection relays (A) and (B) pick-up contacts from the model

MODEL GENERATOR ELECTRICAL : YUI, 2026-11-27 PHT.

- Binago: ang mga contact ng generator protection relay (A) sa TCS sheets SH-G-5A / SH-G-5B (310SD03-743 sheets 13 / 14) at ng relay (B) sa SH-G-6A / SH-G-6B ay pinapakain na ng generator model, hindi na nakatigil sa simula.
  - Saan galing: port `relay.gen` (ports.js), sinusulat ng `elec.js anGenRelay` mula sa boltahe ng generator (U.gen.V) at sa bilis ng shaft.
  - Ang settings ay GEE-2015-0173 R1 (basa ni YUA). 24 V/Hz: 105 / 107 / 115 %. 59 over voltage: 120 / 123 V. 27 under voltage: 86 V. 81 frequency: 57.4 / 57.2 / 62.6 / 62.8 Hz. Ang base ay 115 V.
  - Ang V/Hz % ay pumapasok din sa inverse time element ng 24 (d24b).
- Ang mapa ay nasa `tcs-sheets.js TCS_SH_IN` at mapa lang ito. Ang timers, ang 52G / 60FL gating at ang OR papunta sa 86G-A ay nasa sheet pa rin.
- Hindi pinapakain dahil walang estado nito sa model: 87G, 59GN, 40, 46, 51V, 50, 78, 60FL.
- Pareho ang settings ng relay (B) sa (A) (GEE-2015-0173 p.41 ~ 65, basa ni YUA, /mnt/project-files/yui-relay-b-2026-11-27.md). Ang pagkakaiba ay ang lockout nito: 86G-B, na nasa sheet na.
- Ang 32 reverse power ay nasa `turbine.js anRp32` pa rin. Susunod na PR: ililipat ang timer nito sa SH-G-5A d32, at ang lockout 86G-A ay kukunin sa output ng sheet. Ginagawa ito kasama ni RIN at ng TCS lane para iisa lang ang daan.
- Sinubok (`tests/lanes/gen/gen-electrical.cjs`):
  - Sa 150 MW, A at B: sarado lahat ng contact, V/Hz 100.0 %, walang trip.
  - Pagkatapos ng turbine trip (48 Hz, 0 V): nag-pick up ang 27 at 81U. Walang lockout dahil bukas ang 52G.
  - Pasado rin ang `no-fit.cjs`, `one-path.cjs` at `ports.cjs`.
- MOC: `moc.cjs --record`, walang controlled item na nagbago. Engine code ang hook; hindi nagalaw ang sheet, tag o link file.
- Hindi sinubok: aktwal na over voltage o V/Hz event. Wala pang paraan sa model para itaas ang boltahe nang lampas sa AVR.
