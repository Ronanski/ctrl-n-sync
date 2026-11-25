# ARCHITECTURE: scan, ayos ng takbo, timing at DCS-TCS link (Phase 3)

Ginawa 2026-11-25 ~8:10 PM PHT (user "sunod sunod"). Isinulat mula sa code mismo, hindi mula sa ulat. Bantay sa Checks: `tests/lanes/qa/architecture.cjs` (bumabagsak kapag ang numero rito ay iba na sa code) at `tests/gate/behaviour.cjs` (parehong numero sa dalawang takbo).

## 1. Isang mundo, isang orasan

- Iisang plant time para sa ABC, DITL, plant model at TCS (`src/world/world.js`, `src/analog/engine/sched.js`).
- **Dalawang orasan:**
  - **Operator clock** (ang app na pinapatakbo ng tao): bawat 100 ms ng PC, ang plant time = real time × speed (`anTick`, hanggang 2 s real time bawat tick). Hinahati ito sa mga step na 0.5 s (`anSteps`), hindi lalampas sa `AN_STEP_MAX` = 1 s bawat step. Kapag hindi kaya ng PC, bumababa ang tunay na bilis, hindi ang tama ng planta.
  - **Fixed clock** (`AN.runFixed`, `AN.clockFixed`): step na eksaktong 0.5 s, walang orasan ng PC. Ito ang **deterministic** na takbo: parehong build = parehong numero sa bawat PC (ISA-77.20 repeatability). Ginagamit ng behaviour gate at ng QA trace.

## 2. Ayos ng takbo (bawat step)

| # | Grupo | Kailan | Ano ang ginagawa |
|---|---|---|---|
| 1 | ABC | bawat tick (100 ms ng PC), step 0.5 s | links -> procRemote -> shareExt -> `anStep` ng bawat ABC sheet. Ang plant model (`unit.js anUnitStep`) ay tumatakbo sa loob ng step ng ABC-001C; ang lumang TCS model (`tcs.js tcsStep`) ay nasa loob ng plant step |
| 2 | DITL world | sa pagitan ng mga plant step: bawat 1 s ng plant kapag may timer o gumagalaw na device (`W.busy`), bawat 3 s kapag tahimik; kapag hindi tumatakbo ang planta, bawat 200 ms | inputs ng bawat DITL sheet mula sa nakaraang scan (isang scan na delay, gaya ng DCS) -> plantIn -> simSheet + timers / MOV / motors -> FIRST-OUT -> outputs -> DITL at ABC inputs |
| 3 | TCS sheets (TCE / TCA / G) | sa loob ng engine (`src/analog/engine/tcs-sheets.js`) | bawat sheet ay nag-i-scan sa sariling cycle ng drawing (10 / 30 / 100 ms, seksyon 3). Ang 14 na sheet na nagpapatakbo ng motor ay kumukuha ng input bawat 0.1 s (COMM+MD cycle); ang iba ay kumukuha ng input mula sa TCS I/O list bawat 0.25 s, sa tabi ng `tcs.js` hanggang sila na ang magpatakbo |

Sa loob ng isang TCE / TCA sheet: bawat block ay tumatakbo pagkatapos ng mga block na nagpapakain dito; ang loop at seal-in ay kumukuha ng value ng nakaraang scan (`src/digital/tce-run.js`).

## 3. Cycle ng TCS sheets (mula sa drawing)

Nakasulat sa bawat TCE / TCA sheet ang controller at ang cycle (331DM09784 / 331DM09788, PC lang):

- COMM+MD: 195 sheet sa 100 ms, 1 sheet sa 30 ms.
- EHG+MD: 159 sheet sa 30 ms, 5 sheet sa 10 ms, 1 sheet sa 100 ms.

Tala: ang 14 na sheet na nagpapatakbo ay hinahati sa 0.1 s, at ang iba ay tumatakbo bawat 0.25 s. Kaya ang 30 ms at 10 ms na sheet ay **hindi pa** tumatakbo sa sarili nilang cycle sa engine (bukas na item).

## 3a. Scan ng totoong DCS (STN101 ~ 105), nabasa sa PC 2026-11-25 9:10 PM

Dalawang dokumento, parehong PC lang:

| Ano | Halaga | Source |
|---|---|---|
| Execution cycle ng controller (bilis ng pagkuwenta ng kontrol) | 1 s (Mfr. Std.) | K1AU3-E2-0-001 Rev. A Specification of DCS (FHI, 2013-07), 3.0 YES/NO form 1-2 item 3 |
| Pinakamabilis na scan ng CPU | 50 ms o mas mabilis | 1-2 item 8 |
| Basa ng input ng I/O card ng kontrol | 50 ms o mas mabilis | 1-3 item 4 |
| Sequence event recorder | 1 ms, 128 points pataas | 1-1 item 4 |
| Lipat sa kapalit na CPU | mas mabilis sa 10 ms | 1-2 item 7 |
| Cycle ng bawat loop (nakalagay sa planta) | 1,154 loop sa 1.0 s; 11 loop sa 0.2 s | STN101 ~ 105_LOOP,USERTAG.xls, sheet LOOP_AX, column "Cyl"; "Pha" = 0.2 / 0.4 / 0.6 / 0.8 |

Bawat station (1.0 s / 0.2 s): STN101 235 / 7, STN102 258 / 4, STN103 258 / 0, STN104 166 / 0, STN105 237 / 0 (kabuuan 1,165).

Ang 11 loop na 0.2 s: FICFA1071, FICFA1081, FICFA1055A, FICFA1055B, PICFG108A, PICHR1391, HICBR1391 (STN101); PICMS1006, TICMS1022, PICHR1003, TICHR1012 (STN102).

Limitasyon: ang spec ay hiling ng bumibili (blangko ang sagot ng vendor sa kopyang ito); ang loop list ang aktuwal na setting. Walang nakasulat na unit ang "Cyl"; segundo ang basa dahil 1.0 = 1 s ng spec. Walang dokumento ng cycle ng DITL (ladder / sequence) program; ang alam lang ay ang CPU 50 ms ng spec. Ang DCS Training Textbook ay walang control cycle (trend collection 200 ms ~ 1 s lang).

## 4. DCS-TCS link

- Hardwired: `src/data/tcs-dcs.json` rows = 69 DCS I/O point (TCS I/O list 310SC90-773 rev 2). Ang DCS address ay kumukuha ng output ng TCE / TCA sheet na gumuguhit nito (`src/analog/engine/tcs-dcs.js`, 25 PI/O output sa `TCS_HW`).
- Modbus: `src/data/tcs-dcs.json` modbus = 252 row (227 PLC papuntang DCS, 25 DCS papuntang PLC; 15 blank / spare sa listahan). Test: `tests/lanes/tcs-io/io.cjs`.
- Hiwalay na sistema ang TCS at DCS; ang link lang ay ang tunay na common signals (project instructions 3).

## 5. Bukas na item (hindi pa tapos ang Phase 3)

1. ~~Scan rate ng totoong DCS~~ NABASA 2026-11-25 9:10 PM (seksyon 3a). Natitira: ang ABC ng app ay 0.5 s sa lahat ng loop; ang planta ay 1.0 s at 0.2 s (11 loop). Ang DITL world na 1 ~ 3 s ay mas mabagal sa 50 ms ng spec. Hindi pa binabago ang engine dito.
2. ~~TCS sheets sa sariling cycle~~ TAPOS 2026-11-25 8:45 PM: bawat sheet ay nag-i-scan sa sariling cycle (dati 0.25 s ang hindi pa nagpapatakbo). Gastos: 18.6 -> 21.1 ms bawat 0.5 s na hakbang (headless). Bantay: `architecture.cjs`.
3. **Lumang `tcs.js`** ay tumatakbo pa sa tabi ng TCE / TCA sheets (Audit 3 #4). Hindi ito maliit na item: 1,847 linya, at ang mga grupong hindi pa pinapatakbo ng sheet (hal. EHG, turbine speed, valve) ay nasa `tcs.js` pa. Mawawala ito group por group kapag ang sheet na ang nagpapatakbo (lane 1 TCS logic).

## 6. Mga numerong binabantayan (binabasa ng test)

```json
{
  "abcTickMs": 100,
  "worldIdleMs": 200,
  "plantStepS": 0.5,
  "plantStepMaxS": 1,
  "worldChunkBusyS": 1,
  "worldChunkQuietS": 3,
  "fixedStepS": 0.5,
  "tcsSliceS": 0.1,
  "tcsSlowS": 0.25,
  "tcsDriveSheets": 14,
  "tcsCycles": { "COMM+MD 100": 195, "COMM+MD 30": 1, "EHG+MD 30": 159, "EHG+MD 10": 5, "EHG+MD 100": 1 },
  "tcsDcsRows": 69,
  "tcsHwOutputs": 25,
  "modbusRows": 252
}
```
