# Phase 11 KANA (drum): shrink at swell ng drum level mula sa physics ng riser (2026-11-27)

Sources: Astrom at Bell, "Drum-boiler dynamics", Automatica 36 (2000) (mean void ng riser, circulation balance); FHI CFB Boiler
Design and Operation Manual P2S7 Tab 1 (tubo ng downcomer at riser), P2S8 Tab 2 (volume ng furnace 74.5 m3 at evaporator 14.0 m3);
K1AU3-B-0-006 (taas ng drum FL+45,262, lower header FL+5,008). Doc reads: /mnt/project-files/phase11/kana-doc-reads.md.

## Binago (nakikita ng operator)
- Shrink / swell: dati isang lag na ikinabit (10 mm bawat kg/cm2, 60 s, NO-SOURCE). Ngayon ang level na binabasa ng transmitter =
  tubig sa drum + pagbabago ng dami ng steam bubble sa mga riser (water wall at evaporator) hinati sa ibabaw ng tubig sa drum.
  Bumababa ang presyon (hal. turbine trip o bukas ang bypass): kumukulo ang tubig, dumadami ang bubble, TUMATAAS ang level (swell).
  Bumabagsak ang firing (MFT): nawawala ang bubble, BUMABABA ang level (shrink).
- Sa 150 MW: circulation 5,900 T/H, 16 m3 ng steam sa riser (void 0.23). Ang bilis ng tugon ay ang oras ng daloy sa riser.
- Tinanggal: ang lag ks / tauS at ang patay na level rate k 0.02 (walang bumabasa).
- st150 (150 MW na simula): inayos mula sa st150 ng main, settle 10 min sa bagong code: 150.9 MW, drum 139.6, MSP 122.4.

## Sinubok
- Lane tests: 68, 0 failed. Steady sa loaded na 150 MW simula (walang galaw ang level). Turbine trip probe: swell sa pagbaba ng
  presyon, shrink pagkatapos ng MFT.
- Sweep 45-150 MW: 2 / 22 curve bago at pagkatapos.

## Hindi pa / bukas
- Friction ng riser at downcomer: Moody / Crane (walang haba ng bawat riser sa drawing); maliit ang epekto sa void.
