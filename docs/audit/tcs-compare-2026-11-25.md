# TCS compare: the live TCE / TCA program against the engine (lane 9 SORA, 2026-11-25 11:40 PHT)

Source: `TCE.compare()` in the running app (src/digital/tce-live.js), station page at 150 MW, 20 s of plant time, main after PR 567. It uses
lane 1's `TCE_RUN.outs(prog)` and lane 2's TCS I/O list (`TCE_IO_LIVE`, the 'out' ends of src/digital/tce-io.js). Read only: nothing is written to the plant.

## The outputs of the program (2,560)

- CRT lamps 685: the HMI reads them (`TCE.read`). They have no engine twin to compare against.
- Connectors to sheets outside the set 249: the TCT / TCP sheets (mostly "connector B# to TCT#"). These are not in the TCE / TCA set and have no engine twin. Counted only.
- Spare connectors "(-)" 1,250.
- PI/O outputs 376: the only outputs that have an engine twin (the TCS I/O list row the output drives).

## The 376 PI/O outputs: compared today 0

1. **Builder box, no row: 187.** These are the table builder sheets TCA830 ~ 835, TCA850, TCE600 ~ 603 and TCE610. Each box is drawn with no name (key ''), and the row is printed beside it as "(TCA980-17)" (TCA831: TCA980-17 at y 137 beside the box at y 128). `outs()` gives `to: 'PI/O '` and no row, so the program does not say which row the output is.
   - **All 38 TCS I/O list outputs that already have an engine value are on these sheets.** Examples: TCA980-17 ~ 22 start-up mode and load hold to DCS STN102, TCE960-1 / 2 / 3 oil pump start commands, TCE960-13 / 14 MSV / RSV / ICV full close, TCE960-26 turbine trip, TCE970-6 turbine speed AO, and TCA990-2 / 10 steam seal valve demands.
   - **Ask to lane 1 (MARIA): in `outs()`, give each builder box output `row: 'TCA980-17'` (the "(TCxxxx-n)" printed beside its box), as compile already does for the input boxes.** `TCE.compare()` already uses `o.row`. With it, 38 compares go live at once.
2. **No engine value: 36.** These are the servo valve coil drives (TCE990 / 991 / 992 SERVO-AO) of TCE210 ~ 214 and TCE218 / 219. The tce-io.js end says "the model moves the valve from the flow demand", so it has no engine value.
   - **Ask to lane 2 (TSUBASA): a read for these 'out' ends.** It is the engine's own servo command of the same valve (tcs.js valve demand of MSV / CV / ICV A / B). This is not a new value, so the output can then be compared.
   - Seen in the program: TCE210 ~ 214 give NaN (those sheets are not complete yet), while TCE218 / 219 give 1 / 1 / 0 per coil set.
3. **Reader box: 70.** TCE060 ~ 069 td2 / v2o3 (TRIPLE DETECTOR / 2OO3). These are not PI/O channels, the same list as tests/lanes/tcs-io/io.cjs READER. Correct as is.
4. **Generator panel: 83.** These are G sheet outputs to the generator / GCP panel. They are not TCS PI/O table rows. They are compared later against tcs-gen.js, after lane 2 maps them.

## Next

When either ask lands, `TCE.compare()` gives same / differs per row with no change here. QA (SAORI) reads the `rows` (sheet, key, row, tce, eng, st, why).
