# Bomba na hindi na umaandar ulit sa relay RESET (lane 0, YUA)

## Ano ang nagbago
- Ang row na galing sa output ng sarili nitong drawing (seal-in; halimbawa DITL-30 row 1 SEAWATER BOOSTER PUMP A RUNNING, FROM 30-58) ay iisa na ang pinanggagalingan: ang output na iyon. Ang field bit ng 150 MW start o ng lumang save ay pampasimula lang; nawawala ito kapag 1 na ang output.
- Dati, pagkatapos ng field trip at RESET ng relay, kusang umaandar ulit ang SWBP (DITL-30), DOP (DITL-31) at MWP (DITL-112) kahit walang START. Nahanap ni RARA (lane 4).
- Hindi kasama ang contact ng MOV mismo (REMOTE, TORQUE): doon nakatago ang totoong contact.
- Habang binubuo ang 150 MW start, hawak pa ng field bit ang state.

## Sinuri
- 150 MW, 20 minuto, luma laban sa bago: parehong value at parehong output ng lahat ng DITL.
- Bagong test: tests/lanes/integrator/seal-row.cjs (151 row, 12 makina).
- build, build --check, version-check, no-fit, tests/lanes/run-all.cjs: pasado.

YUA
