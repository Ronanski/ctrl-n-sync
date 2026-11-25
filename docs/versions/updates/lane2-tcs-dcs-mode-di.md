# Lane 2 TCS IO: TCS na pinagmulan ng DCS input I.0081 / I.0082 / I.0418 (2026-11-25)

Ayos sa `src/digital/tce-io.js` lang. Walang pagbabago sa plant model at sa HMI.

## Ano ang bago

- **STN101 I.0081 TCS-DI1046 DCS CONTROL MODE PERMISSIVE (ABC-001C)** = TCS DO TCE961-5 (EHG DO TABLE(2) CH 4) ← TCE602 ← TCE180 output B. Ang read ng dulo ay ang `tb.perm` ng engine (TCE p.127 TCE180).
- **STN101 I.0082 TCS-DI1047 DCS MODE ON FEEDBACK (ABC-001C)** = TCS DO TCE960-20 (EHG DO TABLE(1) CH 13) ← TCE601 007 ← TCE180 DCS CONTROL MODE ON (FFR011). Ang read ng dulo ay ang value na isinusulat ng engine sa ABC-001C I.0082.
- **STN102 I.0418 TCS-DI1031 ICV TO CV TRANSFER COMPLETE (ABC-019, ABC-050, ABC-051)** = TCS DO TCE960-32 (EHG DO TABLE(1) CH 1F) ← TCE601 016 ← TCE184. May read na ito dati (`L.xfer`).
- Ang pagkabit ng tatlong dulo sa lahat ng ABC row na bumabasa sa address (lalo na ABC-019 at ABC-051 I.0418, na wala pang writer) ay kay YUA (`unit.js` U.di).

## Sinubok

- `node tests/lanes/tcs-io/io.cjs` PASS.
- Live headless sa tunay na page sa 151 MW: 258 reads, 0 walang numero; TCE961-5 = 1, TCE960-20 = 1, TCE960-32 = 1 (CCS on, permissive on); 0 page error.

## Hindi sinubok

- Ang pagbaba ng permissive (trip / 52G open) sa live run.

Pirma: TCS IO : TSUBASA (lane 2).
