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
| 3 | TCS sheets (TCE / TCA / G) | sa loob ng engine (`src/analog/engine/tcs-sheets.js`) | ang 14 na sheet na nagpapatakbo ng motor ay tumatakbo sa slice na 0.1 s (COMM+MD cycle); ang iba ay isang scan bawat 0.25 s sa tabi ng `tcs.js` hanggang sila na ang magpatakbo |

Sa loob ng isang TCE / TCA sheet: bawat block ay tumatakbo pagkatapos ng mga block na nagpapakain dito; ang loop at seal-in ay kumukuha ng value ng nakaraang scan (`src/digital/tce-run.js`).

## 3. Cycle ng TCS sheets (mula sa drawing)

Nakasulat sa bawat TCE / TCA sheet ang controller at ang cycle (331DM09784 / 331DM09788, PC lang):

- COMM+MD: 195 sheet sa 100 ms, 1 sheet sa 30 ms.
- EHG+MD: 159 sheet sa 30 ms, 5 sheet sa 10 ms, 1 sheet sa 100 ms.

Tala: ang 14 na sheet na nagpapatakbo ay hinahati sa 0.1 s, at ang iba ay tumatakbo bawat 0.25 s. Kaya ang 30 ms at 10 ms na sheet ay **hindi pa** tumatakbo sa sarili nilang cycle sa engine (bukas na item).

## 4. DCS-TCS link

- Hardwired: `src/data/tcs-dcs.json` rows = 69 DCS I/O point (TCS I/O list 310SC90-773 rev 2). Ang DCS address ay kumukuha ng output ng TCE / TCA sheet na gumuguhit nito (`src/analog/engine/tcs-dcs.js`, 25 PI/O output sa `TCS_HW`).
- Modbus: `src/data/tcs-dcs.json` modbus = 252 row (227 PLC papuntang DCS, 25 DCS papuntang PLC; 15 blank / spare sa listahan). Test: `tests/lanes/tcs-io/io.cjs`.
- Hiwalay na sistema ang TCS at DCS; ang link lang ay ang tunay na common signals (project instructions 3).

## 5. Bukas na item (hindi pa tapos ang Phase 3)

1. **Scan rate ng totoong DCS (STN101 ~ 105):** wala sa repo. Hanapin sa DCS textbook / FCS spec (K1AU3-E2-0-001-RA Specification of DCS, PC) ang basic scan period. Hanggang doon, ang 0.5 s step ng ABC at ang 1 ~ 3 s na scan ng DITL world ay pasya ng app, hindi galing sa planta.
2. **TCS sheets sa sariling cycle** (10 / 30 ms): sa engine ay 0.1 s at 0.25 s pa lang.
3. **Lumang `tcs.js`** ay tumatakbo pa sa tabi ng TCE / TCA sheets (Audit 3 #4).

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
