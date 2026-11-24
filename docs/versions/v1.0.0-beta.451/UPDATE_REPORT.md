# v1.0.0-beta.451: TCS program: ang API para sa operator station (TCS LOGIC : MARIA, 2026-11-25 PHT)

## Binago
- `src/digital/tce-run.js`: tatlong function para sa HMI ng lane 9 (SORA, `src/digital/tce-live.js`), walang binago sa logic:
  - `crt(prog)`: lahat ng CRT push button (port na pipindutin: `CRT:<sheet>.<tag>`) at CRT lamp (sheet, key, tag).
  - `read(prog, sheet, keyOrTag)`: value ng net, ng CRT lamp (key o tag) o ng CRT button; `undefined` kung hindi kilala, at walang ginagawang bago (hindi gaya ng `get`).
  - `outs(prog)`: ang lahat ng isinusulat ng program: `pio` (PI/O output, sa field / DCS / panel), `crt` (lamp), `con` (connector sa labas ng TCE / TCA: IBD, DCS), `spare` (connector "(-)"). Ang lahat ng `prog.ports` ay input na binabasa lang.

## Bilang
- Walang pagbabago: 196 ng 419 sheets.

## Sinubok
- tests/tce/sheets.cjs: crt (124 button, 685 lamp), read ng hindi kilalang key = undefined at walang bagong value, read ng lamp TCE150_1_IIS sa tag, outs may PI/O at CRT. Headless.

## Hindi sinubok
- Wala pang nakikita ang operator: ang paggamit sa app ay sa PR ng lane 9.
