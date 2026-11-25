# Field contact na nakasulat bilang address sa drawing (lane 3, DCS LINKS BOILER : KIRARA)

## Ano ang bago
- Ilang input row sa boiler drawing ang may FROM na output din ng parehong sheet (QA xref, 11:30 AM, "missing"). Ang numerong iyon ay ang station channel ng field contact. Hindi ito ang source; ang field ang source. Field row na ang pinagmumulan ng mga ito ngayon:
  - **DITL-18 (A ~ D) row 20**, BI7-DO1043-x LAMP TEST ng burner local panel: field state, normal = hindi pinipindot.
  - **DITL-19 (A ~ C) row 6 / 23**, MIL-CL1061-x REMOTE ng coal feeder: field state, normal = REMOTE. Kapag inilagay sa LOCAL sa Plant menu, nagiging 0 ang "COAL FEEDER x REMOTE SELECTED".
  - **DITL-19 (A ~ C) row 12**, MIT-CL1061-x COAL FEEDER FAULT: ang field trip ng feeder. Dati, sa A lang ito nakakabit.
  - **DITL-43 row 4**, YSR-FA1052M1 AIR PREHEATER LOCAL: field state, normal = hindi LOCAL.
- **DITL-43 field contact sa output wire (APH panel)**:
  - XA-FA1052-1 / 2 / 3 / 4 / 6 (fire detection, sensor, fire alarm, speed sensor, normal power): normal = OK.
  - ES-FA1052 (emergency push button): normal = hindi pinindot.
  - Sa Plant menu: kapag "fire alarm", nawawala ang "NO FIRE ALARM"; kapag emergency P.B., lumalabas ang "EMERGENCY P.B. ON".
- **`src/world/plantsw.js`** (para i-review ng lane 0):
  - Ang field row na may `adr` ay kinakabit din sa row na may nakasulat na I/O address nito, sa sheet na iyon lang.
  - Hindi na nasisira ang `sheet` ng isang copy ("DITL-19 #B"). Dati, nagiging "DITL-19B" ito, kaya hindi nakakabit ang field row sa #B at #C.
- **`src/data/st150.txt`**: tinanggal ang lumang 150 MW seed bit ng DITL-19 row 6 / 23 (A ~ C). Kung naiwan ito, laging 1 ang REMOTE kahit naka-LOCAL ang field state.

## Hindi pa (para sa lane 0)
- **DITL-43 row 5 / 10 / 12 / 13** (NOT TRIP, RUNNING, SPEED NOT LOW / L.L.). Sa unang scan pagkatapos mag-load, binabasa na ng APH inverter ng DITL-43 ang NOT TRIP bago pa magkaroon ng value ang plant switch. Kaya kapag walang seed bit, nagti-trip ang APH (MFT). Wala rin sa nababasang drawing ang start command na O.0206 / O.0207.

## Sinuri
- 10 minuto sa 150 MW, luma laban sa bago: pareho ang lahat ng value ng planta at lahat ng DITL output.
- Headless:
  - Kapag naka-LOCAL ang Coal feeder A, nagiging 0 ang REMOTE SELECTED.
  - Sumusunod sa field state ang lamp test at ang APH LOCAL.
- Lane tests 16 / 16, no-fit 0 bago.

KIRARA
