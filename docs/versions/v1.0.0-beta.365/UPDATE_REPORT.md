# LMYP OTS 1.0.0-beta.365 (HMI : ROSÉ, 2026-11-24)

Sumunod sa beta.364. Dalawang bahagi: ang totoong TCS faceplates (D18) at ang hold-to-ramp ng MAN station (D37). UI lang; walang binago sa engine.

## 1. D18: TCS faceplates galing mismo sa IBD sheet

| Device | Sheet | Mga utos | Permissive na ipinapakita (Y / N, net ng sheet) |
|---|---|---|---|
| Turning gear | TB-9 | START, STOP, AUTO, MANUAL; JOG sa LOCAL (field operator) | MANUAL (19), MSV / ICV sarado (2), bearing oil (3), walang hand-turning interlock (4), walang electrical trouble (24) |
| Vapor extractor | TB-12 | START, STOP | walang trouble (10) |
| Gland steam exhauster | TC-28 | START, STOP, AUTO, MANUAL | MANUAL (6), walang trouble (15) |
| Gland steam seal valve | TC-31 | OPEN, CLOSE, AUTO, MANUAL | MANUAL (3) |
| LP exhaust hood spray | TC-35 | OPEN, AUTO, MANUAL | walang CLOSE push button sa sheet; sumasara lang sa AUTO (nakasulat sa faceplate) |

- Bagong faceplate `LS_FPOP.ibd` (`src/ui/plant/fp-pop.js`). Ang utos ay ang 1.5 s na pulse sa push-button net ng sheet (`AN.turbine('ibd')`). Ang status, mode at permissives ay binabasa sa live nets ng sheet (`AN.tcsIbd`). Patay ang button kapag naka-pause, kapag nasa ganoong estado na, o kapag may N sa permissive. May link sa IBD sheet at sa Events.
- Ang kulay ng makina sa HX page ay galing na sa device flag ng sheet (`tg`, `vex`, `gse`, `ssfv`, `hso`), hindi na sa lumang hula (rpm, pressure).
- Bagong item sa Aux steam page: GLAND STEAM EXHAUSTER (TC-28), galing sa gland steam condenser H-1903, labas sa outdoor.

## 2. D37: MAN station hold-to-ramp

- **Sanhi: ang test, hindi ang app.** Ang lumang `manstation.js` ay hindi isinara ang start screen, at pinindot habang nakatakip pa ang "Loading 150 MW". Kaya ang mouse ay tumama sa takip, hindi sa ▲▲.
- Ayos: ang test ay pumapasok na gaya ng operator (Engineer card), naghihintay matapos ang load, at sinusuri na walang nakatakip sa ▲▲ bago pindutin. Sa touch, totoong touch hold na (hindi mouse).
- Ang controller faceplate ng HX page (`#plfp`, hal. LICCD1104 sa Condensate) ay gumagamit ng parehong ▲▲ ▲ ▼ ▼▼ (`stepBtn`, `src/ui/hmi/hmi.js`), kaya pareho ang hold.
- Ang `hx-cards-ui.js` ay mockup lang (wala sa app build); hindi ito ginalaw.

## Rule 0

Walang bagong numero na ikinabit sa planta. Ang permissives ay mga net ng sheet; ang 1.5 s pulse ay galing sa engine (`TCS_IBD_PBN`).

## Mga test

- PASADO: `tests/regress/tcs_faceplates.js` (bago: Cold, RUN, turning gear / MOP / vapor extractor, gland exhauster / gland seal / hood spray, totoong click), `tests/regress/manstation.js` (desktop at touch, 2 takbo).

## Findings

| # | Nakita | Rekomendasyon |
|---|---|---|
| R1 | Ang ibang lumang test na diretso sa `file://` ay puwedeng matakpan din ng start screen | Gamitin ang `startAs` ng `tests/regress/lib.js` sa bawat bagong click test; ayusin ang luma kapag nadaanan |

## Susunod

Warm at Hot sa start screen, at ang screenshot ng bawat HMI page para sa approval.
