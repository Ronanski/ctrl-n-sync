# v1.0.0-beta.363 (ROSÉ, 2026-11-24)

## What was wrong
On 52 of the 54 ABC sheets, 957 live values sat on a drawing text, a wire or a block. That breaks the logic-sheet rule (1:1 layout, clean). `tests/regress/values_layout.js` found them but was not in CI.

## Causes and fixes (`src/analog/ui/links-canvas.js`)
1. **The view was set after the values were placed.** Chrome lays out these small texts (3 to 4 units) at their screen size, so every text was measured under the view of the sheet painted before. On ABC-017, PTN009001 measured 5.1 high and drew 5.8. The sheet's view is now set first.
2. **A big outline counted as a solid box.** The frame round a group of blocks put a penalty on every place inside it. Only symbols up to 15 units across are boxes now; a bigger outline counts as its lines.
3. **Equipment values.** AO, ACT, PO and ALM values centred under their box, and timer values from the old `place()` (which treated a slanted wire as its whole box), stay where they are when nothing is under them. Otherwise they are placed round the box with the same scoring as the address values, and they move only when the new place is better. The keep check uses the text's real height. An alarm is 9 characters wide ('HIGH-HIGH').
4. **Placing round a box.** When every place up to the last gap still crosses a wire, the search goes on to 15, 18 and 22 units. Beside a box more than two lines high, the value can also sit level with its upper or lower part (a timer's output wire leaves it in the middle).
5. **A net drawn but not in the netlist** is placed along the drawn wire that ends at its pin (ABC-001C).
6. **The DESIGN BASE table texts** count as obstacles (ABC-010).
7. The AO/ACT/PO/ALM value line sits 1.35 times the font size under its box (was 1.1; the number touched the box line).

## Test side
- `values_layout.js` measures a text's width from where its characters are drawn. Chrome's getBBox of these small texts is off ('0000' at 3.12 px gave x -1.75, width 10.87 while it draws from 0 to 7.50).
- `.github/workflows/checks.yml` runs `values_layout.js` after the behaviour gate.

## Test (PC, headless Chrome)
- values_layout: 2436 labels, 0 on a text, value, block or wire, 0 not centred, 0 of 54 sheets with a problem (was 957 on 52).
- `build.js --check` SAME, version check.
