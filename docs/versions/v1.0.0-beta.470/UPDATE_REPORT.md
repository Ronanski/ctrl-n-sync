# v1.0.0-beta.470 — Field loader para sa mga lane (lane 0, integrator)

## Ano ang bago
- Bagong folder `src/world/field/`: may isang JS file ang bawat lane (halimbawa `boiler.js`, `bop.js`). Ang file ay tumatawag ng `FIELD.add(lane, rows)`.
- Ganito ang hugis ng row: `{ stn, ai | di: 1, tag, v(U, X), rel, src, sheet? }`. Ang `v` ay nagbabasa lang ng engine state at hindi kailanman nagsusulat.
  - **AI row:** isinusulat ang value sa bawat AI block ng address na iyon, minsan bawat scan, pagkatapos ng unit model step. Hindi ginagalaw ang forced output, at kina-clamp ng range ang value.
  - **DI row:** ang DITL input row ng tag ay 1 habang true ang `v`, parang switch row ng plant model. Kung naka-switch na sa plant model ang tag, iyon pa rin ang nag-iisang source at nakalista ang row sa `FIELD.dup`.
- Ang `X` ay ang mga reader ng engine para sa mga row: `X.av` (opening ng control valve, kasama ang air lock at stuck fault, at hindi ginagalaw ang hold memory), `X.ditlPos` (posisyon ng valve sa DITL), `X.ditlRun` (RUN o STOP ng DITL drawing) at `X.ai('stn|AI0128')`.
- Binabasa ng HMI ang row sa `AN.fieldRead(key)`. Nasa `AN.unit.fld` ang value ng huling scan (kasama sa keyframe, kaya may laman din sa Worker mode). Kapag kaka-load pa lang at hindi pa pinipindot ang RUN, walang `fld`, kaya binabasa agad ang row sa sandaling iyon (nakita ni KIRARA).
- Sa HMI, ang page value na walang logic transmitter ay kumukuha muna sa field row ng parehong I/O address o tag bago sa anumang fallback ng page. Isa lang ang source bawat tag.
- Kung walang file sa folder, walang nagbabago sa app.

## Batayan
- Lane plan 2026-11-25 (content first), `src/world/field/README.md`.

## Test
- Bagong test `tests/lanes/integrator/field-loader.cjs`. Headless gamit ang 49 row ni KIRARA: paused = may value, page mode RUN = 41 key sa `AN.unit.fld`, Worker mode RUN = 41 key sa mirror page, walang page error. Ang 12 TT-FG row ay wala pang value dahil nasa PR 532 pa ang `gBank`.
- Build, check SAME, no-fit, lanes test.

YUA
