# Phase 11 part 7+8 (SUZU), fix 6: condenser sea water outlet from the condenser port (2026-11-27, GO FIX 11)

Binago: ang outlet ng bawat water box path (TT ng sea water palabas ng condenser) = inlet 30 C + ang init na kinukuha ng path na iyon mula sa steam (port `cd` ng MEI, x.QA / x.QB kW) / (tubig x cp, AN_CD.cp). Tinanggal ang sariling tantya ng steam ng sea water (main steam x 316 / 460 + LP bypass x 5.6 C rise): pangalawang kopya ito ng duty ng condenser. Tinanggal ang AN_SW.rise0 at cTH. Ang cSt at mcr ay naiwan dahil binabasa pa ng anCondStep ng MEI (hanggang rank 6).

Sinubok (headless, 150 MW start, 10 plant min): MW 148.3, cd port QA = QB = 96.3 MW, P 0.066 ata, sea water 17,684 m3/h bawat path, outlet 34.85 C (design D1-0-039: 35.6 C sa 31,500 T/H at 316 T/H na steam). One-path PASS, no-fit 37 (0 bago), ports PASS.
Hindi sinubok: isang water box sarado (ang init ay nasa kabilang path ayon sa port ng MEI).
