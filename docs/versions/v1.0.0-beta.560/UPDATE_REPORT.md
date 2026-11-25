# v1.0.0-beta.560 (LEADER : YUA, lane 0): I/O address ng sariling makina sa bawat kopya

## Ano ang nagbago
- **Address sa kopya ng drawing** (SAORI, QA trace B5): ang drawing para sa makina A hanggang D ay may dalawang address text sa tabi ng wire ("O.0093/413" at "O.0733/1053"). Ngayon, ang tag sa I/O list ang nagsasabi kung kanino ang address: ang kopya #C ay O.0733 lang. Saklaw ang DITL-13, 18, 19, 20, 21A, 22, 24, 28A, 29A, 117 at iba pa.
- **DITL-22**: bawat kopya (LOP 1 / 2 ng BFWP A at B) ay may sariling start at stop command.
- **Row na walang signal name sa kopya**: nagbabasa dati ng address ng ibang row na wala ring pangalan. DITL-61A #B row 27 ay M.1193 na (dati M.3217), DITL-117 #B hanggang #D row 2 at 4 ay M.0861 at M.0862 na (dati baligtad).
- **DITL-BA01 at BA02** (EIMI): 12 row na tag lang ang nakasulat (ZSC-BH1759 at iba pa) ay nagbabasa na ng parehong switch ng I/O address nila. Dati ay laging 0.
- **Test na ashcool**: lumang start state ang gamit, kaya nagte-trip ang unit sa test. Ngayon ay 150 MW start ng app; may check na na nasa 150 MW ang unit.
- Bagong test: tests/lanes/integrator/copy-address.cjs.

## Sinuri
- Luma laban sa bago, 10 minuto sa 150 MW (Node): walang nagbago sa takbo ng planta. Walang nagbagong link sa pagitan ng mga drawing.
- QA trace: 90 point sa 149 na maling row, naging 22 sa 28. Ang natira: text ng drawing na para sa lahat ng makina ("A~C"), tag na walang letra ng makina (ZSO-FW1031, DPT-CD1001), at row na tama pero ibang letra ang nabasa ng trace.
- build at check: SAME; no-fit: 0 bago; tests/lanes/run-all.cjs: pasado; ashcool: pasado

YUA
