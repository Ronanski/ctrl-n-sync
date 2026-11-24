# v1.0.0-beta.450 — Field loader para sa mga lane (lane 0, integrator)

## Ano ang bago
- Bagong folder `src/world/field/`: may isang JS file ang bawat lane (halimbawa `boiler.js`, `bop.js`). Ang file ay tumatawag ng `FIELD.add(lane, rows)`.
- Ganito ang hugis ng row: `{ stn, ai | di: 1, tag, v(U, X), rel, src, sheet? }`. Ang `v` ay nagbabasa lang ng engine state at hindi kailanman nagsusulat.
  - **AI row:** isinusulat ang value sa bawat AI block ng address na iyon, minsan bawat scan, pagkatapos ng unit model step. Hindi ginagalaw ang forced output, at kina-clamp ng range ang value.
  - **DI row:** ang DITL input row ng tag ay 1 habang true ang `v`, parang switch row ng plant model. Kung naka-switch na sa plant model ang tag, iyon pa rin ang nag-iisang source at nakalista ang row sa `FIELD.dup`.
- Ang `X` ay ang mga reader ng engine para sa mga row: `X.av` (opening ng control valve, kasama ang air lock at stuck fault, at hindi ginagalaw ang hold memory), `X.ditlPos` (posisyon ng valve sa DITL), `X.ditlRun` (RUN o STOP ng DITL drawing) at `X.ai('stn|AI0128')`.
- Nasa `AN.unit.fld` ang value ng bawat row, ayon sa address at ayon sa tag. Kasama ito sa keyframe, kaya nababasa rin ng HMI sa Worker mode.
- Sa HMI, ang page value na walang logic transmitter ay kumukuha muna sa field row ng parehong I/O address o tag bago sa anumang fallback ng page. Isa lang ang source bawat tag.
- Kung walang file sa folder, walang nagbabago sa app.

## Batayan
- Lane plan 2026-11-25 (content first), `src/world/field/README.md`.

## Test
- Headless test na may pansamantalang file (6 row: AI na walang ABC block, AI na may IO-list tag, ditlPos, ditlRun, av, ai). Lahat ng value ay nasa `AN.unit.fld` pagkatapos ng Run, at binasa ng HMI resolver ang PIIA1064A at TIFG1102 mula sa field row. Walang page error. Tinanggal na ang test file.
- Build, check SAME, no-fit, lanes test.

YUA
