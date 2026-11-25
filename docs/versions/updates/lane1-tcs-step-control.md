# TCS ATS STEP CONTROL MD mula sa ATS program drawing (TCS LOGIC : MARIA, 2026-11-25 PHT)

## Binago
- `src/digital/tce-run.js`: bagong macro `STEP CONTROL MD`.
  - Batayan: ATS program 310SC90-795 Rev 2. Sheet 8 ay start-up step transition logic (book p 132), sheet 9 ay shutdown step (p 133), sheet 10 ay criteria check (p 134), sheet 11 ay criteria bypass (p 135).
  - Ang mga pin ay ayon sa naka-print sa TCA520 ~ TCA528.
- SELECTED:
  - Pumipili ang STEP UP ORDER o ang PB STEP n kapag may permissive, kapag hindi pa tapos ang criteria Dn, at kapag hindi pa EXECUTED.
  - Bumibitaw kapag may ibang step na pinili, kapag EXECUTED na, o kapag mas mataas na step ang tumatakbo.
- EXECUTED: kapag tapos ang step bago nito (criteria Dn-1), OK ang in condition (An), at SELECTED. Bumibitaw kapag mas mataas na step ang tumatakbo.
- COMPLETED: kapag OK ang out condition (Dn) habang EXECUTED. Bumibitaw kapag COMPLETED na ang mas mataas na step.
- Ang BYPASS ay itinuturing na OK ang criteria (sheet 11).
- Hindi nasa transition logic: ang naka-print na DEF timer sa tabi ng block (TD 3.0 s x3, TP 0.2 s, TP 1.0 s). Hindi binasa.

## Bilang
- Tumatakbo na ang 9 na step sheet, TCA520 ~ TCA528 (step 0 HP turbine warming hanggang step 8 shutdown).
- Drawing-complete: 208 → 217.
- Lahat: 307 → 316 sa 419.

## Test
- May bagong behaviour test sa `tests/tce/sheets.cjs`: select, ibang step, permissive, PB, execute, START isang scan, complete, at reset ng upper step.
- FLOOR = 217.
