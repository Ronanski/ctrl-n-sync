# Phase 6: bawat unit ay sariling sheet, 2026-11-26 ~11 PM PHT

Utos ng user (10:20 PM PHT): "Alam mo nmn pala n dapat hiwalay na sheet eh!" Ang drawing na para sa ilang unit (hal. "THE DIAGRAM IS THE SAME FOR BURNER B,C,D") ay dati isang entry lang sa listahan, at ang B / C / D ay pinipili sa maliit na A ~ D button sa header. Ngayon ang bawat unit ay sariling sheet ng logic viewer.

Binago:
- Listahan ng sheet (kaliwa), sheet picker, Prev / Next at PageUp / PageDown: isang entry bawat unit. Pangalan: `(18)DITL-07 #A`, `#B`, `#C`, `#D`; `(62)DITL-38 #MV-BD1001` ...; `DITL-80G #N-1011` ~ `#N-1038`; at ang mga unit ng `src/world/inst/*.json`. Ang title ay sa unit mismo (hal. "BURNER B COMMAND").
- Header: "DITL-07 · C"; tinanggal ang A ~ D button (hindi na kailangan).
- Title ng unit kapag pareho ang title ng mga unit ng isang drawing (puna ni MARIA / coordinator): (1) ang sariling pangalan ng unit sa drawing, kapag nagbibigay ito ng sariling title sa bawat unit (DITL-22 row 25 motor "BFWP A AUX. LOP A" -> "BFWP A AUX. LOP B", "BFWP B AUX. LOP A", "BFWP B AUX. LOP B"; I/O list STN103 I.0050 / I.0370 / I.0053 / I.0373); (2) kung wala, ang title at ang unit ("PERMISSION TO BURNER (1) · C", "MOTOR CONTROL VALVE · MV-BD1002", "SOOTBLOWER CONTROL LOGIC DIAGRAM(14) · N-1012"). 889 entry sa picker, 889 magkakaibang pangalan.
- Bilang: 41 drawing, 141 dagdag na unit sheet; DCS sheet sa listahan 249 -> 390. Ang 30 sa 141 ay unit ng ilang row lang ng drawing (hal. DITL-21D row 22, DITL-80M lances), ayon sa drawing.
- Bawat unit: sariling address (mula sa address list ng drawing, I/O list at memory list), sariling text, sariling latch / timer / motor / valve, at live sa sarili.
- Iisang logic source: ang unit ay binubuo mula sa drawing sa pag-load. Bagong bantay `tests/lanes/qa/unit-sheets.cjs`: bumabagsak kapag ang isang unit ay iba sa drawing sa kahit ano maliban sa address, text at live na estado (uri ng block, pin, wire papasok / palabas, set / reset, comparator, oras ng timer, input row, output row), o kapag bumaba ang bilang na 41 / 141. Sinubok din na bumabagsak ito kapag sinadyang ginawang OR ang isang AND ng DITL-07 #C.
- Nananatili: copy clash 0 (trace-gate) at ang Phase 6 gate.

Sinubok: unit-sheets PASS; sa built app (150 MW, Engineer, DITL): listahan "Sheets (390)", DITL-07 #C bumukas na may burner C na text at address, Next = DITL-07 #D. Larawan: `/mnt/project-files/phase6/unit-sheet-DITL-07-C-2026-11-26.png`.
Hindi sinubok: tablet na layout.
