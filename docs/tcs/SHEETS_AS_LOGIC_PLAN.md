# TCS sheets as the running logic (Full Audit 3 item #4): code plan

2026-11-22 PHT, LEADER : JENNIE. Plan only; the steps below are built one PR at a time.

## Why

The TCS soft logic sheets (Hitachi 331DM09784 TCE, 331DM09788 TCA, generator G-1A ~ G-9) are in the app as live drawings (`src/digital/tce/*.js`, drawn by `src/digital/parts/02d-tce.js`), but the page "runs no gate of the sheet": every state on a wire is a read of the hand-written logic in `src/analog/engine/tcs.js` (`tcsLiveRead`, the `live` map of a sheet). So the turbine logic exists twice: once as a picture of the vendor logic and once as code. RULES 3.1 (one logic) wants one: the sheets.

The IBD sheets (310SC90-794, `tcs-trip.js`) already run as a netlist (`tcs-ibd-data.js`, net numbers of the drawing). The same must happen for TCE / TCA.

## What the sheets hold today (counted 2026-11-22, main at beta.247)

- 407 TCE / TCA sheets, 13,586 wire pieces, 8,305 small blocks, 508 macro blocks of 51 kinds; 281 `live` reads on 91 sheets.
- Small blocks by kind: BTR 3,797 and FTR 1,061 (transfer marks on a wire), OR 665, A (AND) 573, SG 429, NOT 420, ASW 152, CMP 104, FFS 99, TP 98, FFR 95, TW 91, CPL 63, SUB 57, FG 54, G 54, TD 50, LMS 45, DSW 31, UCK / LCK 57, and about 40 rarer kinds (ADD, MLT, DIV, ABS, LIM, PDF, PIV, HLD, RL, LG, I, AM, FILTER ...).
- Macros: TRIPPLE INPUT DIAGNOSTICS 146, AI DIAG.MD 96, CRI MONT.MD 72, TMR AI DIAGNOSTICS 42, VALVE DIAGNOSIS 24, DISTRIBUTION 10, STEP CONTROL MD 9, AIR OPERAT VALVE 9, MOTOR STANDARD 8, and 42 kinds used 1 ~ 8 times (the SIM.MT models, HEAT SOAK, THSC INITIAL, LOAD SET ...).
- Netlist by geometry (`tools/data/tce_net.mjs`, 2026-11-22): of the 13,586 wire pieces, 6 end at a place the tool cannot name yet (TCA549, TCA762, TCA782, TCE140 x3); every block and macro with inputs has its inputs found (61 of them with an X: the loop mark, value of the last scan; read as inverted until 2026-11-25); the BTR / FTR / X marks never start a wire, they sit on it and pass its signal. Of the 2,715 input connectors, 1,999 join the output connector of the letter they name on the sheet they name, and 716 come from outside the TCE / TCA set (IBD, DCS, G sheets); none is left without a source (beta.254). For 89 of the 1,999 the output connector's printed sheet list does not include the receiving sheet: 62 lists were not typed, 27 leave the sheet out or give it under another letter. The in-connector is the link (it names sheet and letter); the list is the drawing's cross reference, so these 89 are list rows to read again on the drawing (`--list` prints them as `list`).

## Steps

1. **Compiler (tools, no app change; first version in this PR).** `tools/data/tce_net.mjs`: every sheet to a netlist. A wire's source key is its net; its last point gives the pin it feeds (left edge of a block or macro, ordered by the pin marks `l` and the pin y); BTR / FTR / X marks split a net into "before" and "after" (X = loop mark, not inverted: TCE227 seal-in, TCE300 B3); off-page connectors join nets across sheets by the letter and the sheet the in-connector names (the output's sheet list is checked as a cross reference and its gaps are listed). Output: per sheet, the blocks with their ordered inputs and outputs. The check fails on any pin with no net unless the drawing shows it open, named in a list with the reason. Added to `checks.yml` next to `tce_check.mjs`.
2. **Block meanings (first version beta.258: 56 kinds, `tests/tce/run.cjs` in the Checks; not loaded in the app until step 4).** `src/digital/tce-run.js`: one function per small block kind, from the HIACS symbol legend and the macro list pages of the TCA PDF (pages TCA013 ~ TCA020, not typed as sheets) and the Hitachi TCS manual TC-14-116 (`2-2 TURBINE CONTROL SYSTEM_R1.pdf`, text PDF). Each function carries its source in a comment (RULES 3.4). The parameters are the ones printed under each block (`notes`). Timers in plant time at the cycle of the sheet (`cycle`, 100 ms or as drawn). Macros: the 9 most used first (they cover 456 of the 508); each SIM.MT macro is a plant model and stays in the plant model, bound as an input.
3. **Inputs and outputs.** The PI/O tables (TCE9xx DI / AI / DO / AO / PTI / servo sheets) are the only door to the plant: the DI / AI rows read the plant model values of the TCS I/O list (`iolist-tcs.zip`, XSMM_IO_List_R1, per controller EHG / TPC / COM), the DO / AO / servo rows drive the model (valve demands, motor starts, trips). The Modbus rows to the DCS go through the same list. No other read or write.
4. **Shadow run.** The sheet logic runs beside `tcs.js` without driving anything. A headless probe compares the 281 `live` reads (the sheet's net against the engine's value) at 150 MW, at Cold, through a turbine trip and through the ATS steps from the save point S68. Every difference is a finding: a sheet typing error, a block meaning error, or a `tcs.js` error. Each is fixed at its source; none is hidden by a tolerance.
5. **Swap.** When the shadow run agrees: the TCS decisions (ATS steps, criteria, speed and load set, valve sequences, protection) come from the sheets; `tcs.js` keeps only the turbine physics (rotor, metal, valves as actuators, oil, gland, vacuum) and the I/O binding. The duplicated code is removed in the same PR. The behaviour gate and an ATS run from S68 must pass.
6. **IBD.** The trip netlist of `tcs-trip.js` stays (TCE / TCA win over IBD for the logic, the IBD gives the trip logic: RULES 3.8); its inputs that today come from `tcs.js` are taken from the sheet nets.

## Order of work

Step 1 first (it gives the exact size of steps 2 and 3), then steps 2 ~ 4 per controller: COM (ATS, TCA5xx, the most `live` reads), then EHG (speed and load, TCE16x), then TPC (protection). Step 5 per controller once its shadow run agrees.

## Not in this plan

The look of the sheets (Rosé, UI owner) does not change. No PDF, scan or image enters the app.
