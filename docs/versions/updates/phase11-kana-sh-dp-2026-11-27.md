# Phase 11 KANA (drum, evaporator, superheater): SH pressure drop from design, drum water surface from the drawing (2026-11-27)

Sources: FHI CFB Boiler Design and Operation Manual P2S7 Tab 3 (SH pressure drop 16 kg/cm2 at MCR 460 T/H, SH out 129 kg/cm2 G
541 C) and Tab 4 Fig 11; as-built drum K1AU3-B-0-004 (K1AU3D-101 R 824.2 x 12,481 mm, K1AU3D-109 N.W.L. 254 mm below the centreline).
Doc reads: /mnt/project-files/phase11/kana-doc-reads.md.

## Binago (nakikita ng operator)
- Pressure drop mula drum hanggang labas ng superheater: dati 11.6 kg/cm2 na kinuha sa isang snapshot ng planta (constant na
  ikinabit, bawal sa rule 0). Ngayon physics: dP = k m^2 / rho (turbulent na daloy sa tubo), k mula sa FHI Tab 3, rho = density ng
  steam sa SH (IF97). Sa 150 MW ang drum ay ~139 kg/cm2 kapag 122 ang main steam (dati 133.4).
- Presyon sa gitna ng SH (PT-BR1130 pagkatapos ng panel #1, PT-BR1150 bago ng finishing SH): sumusunod sa parehong batas.
- Drum level: ang ibabaw ng tubig sa drum ay mula sa drawing (chord sa taas ng level + dalawang hemispherical head): 21.5 m2 sa NWL;
  dati 20.6 m2 sa lahat ng level.
- Bagong 150 MW na simula (st150) gawa ng tools/steady150/make.cjs; ang unang chunk ay naglalagay ng drum sa MSP + SH drop ng batas.

## Hindi pa / bukas
- Ang hati ng drop sa PT-BR1130 / 1150 (6.4 / 11.6, 9.3 / 11.6) ay basa pa ng transmitter ng planta; kailangan ang geometry ng
  panel SH (tube ID at haba; FHI Tab 1 ay may OD lang).
- Ang spray water DP (anFwTagStep, NANA) at sootblower steam (anSbDrain, SUZU) ay gumagamit pa ng lumang 6.4 x (MSF / 474.1)^2:
  ipinasa sa may-ari na gamitin ang anShTap.
- SH outlet pressure 129 (FHI Fig 11): itinatakda ng set point ng PIC-COBM (122.3 sa snapshot), hindi ng model.
- Shrink / swell ng drum level (ks 10 mm per kg/cm2, tau 60 s, NO-SOURCE): susunod na PR, mula sa riser / downcomer physics.
