# LMYP OTS 1.0.0-beta.418 (QA : SAORI, lane 8, 2026-11-25)

Sumunod sa beta.410. Tool at test lang; walang binago sa app, sa plant model, sa logic o sa HMI.

## Ano ang bago

1. `tools/trace/trace.cjs` (at `tools/trace/world.cjs`): ang QA trace. Pinapatakbo ang tunay na engine ng app (ABC + DITL + plant model, ang parehong `src/` ng Worker) nang headless mula sa "Normal operation at full load" (o Cold), at para sa bawat address ng I/O list at memory list, bawat station: nasa sheet ba (ABC net, DITL row, bawat machine copy, maikling listahan na `O.0080/400`), may nagsusulat ba habang tumatakbo, gumagalaw ba, nasa plant model o page ba. Inililista ang mga putol: B1 input sa sheet na walang nagsusulat, B2 I/O input na wala kahit saan, B3 faceplate tag na walang controller sa sheet, B4 alarm na walang set point. Kasama ang bilang ng F(X), alarm blocks, TCE / TCA / G / IBD. `--tag <tag>` = ang buong kadena ng isang tag.
2. `tests/lanes/qa/tce-complete.cjs`: bilang ng TCE / TCA / G sheet na tumatakbo nang KUMPLETO (bawat block may kahulugan AT nakasulat sa sheet ang kailangang parameter: FG curve, SG K, oras ng timer, PIV limit). Bagsak kapag bumaba sa floor (194).

## Unang bilang (main 2083cd1, 5 plant min sa 150 MW)

- DCS I/O na may tag: 2,702. Nakakabit 1,482; nasa drawing pero hindi nakakabit 380; model / page lang 214; wala kahit saan 537; hindi kasama (WTP, coal handling, air compressor) 89.
- TCE / TCA kumpleto: 184 sa 407; G 10 sa 14.

## Sinubok

`node tools/trace/trace.cjs --mins 2` (~50 s), `--tag ZSO-CD1123`, `--tag M.3220 --stn 1`; `node tests/lanes/qa/tce-complete.cjs` (194, exit 0).

## Hindi sinubok

Hindi pa sa Checks (ang `tests/lanes/` ay papasok sa Checks sa PR 0 ng integrator). Ang "nakakabit" ay patunay na may kabit at may source; hindi pa patunay na tama ang value laban sa drawing (iyon ang review bawat lane).
- B5 (bago): kopya ng makina na nagbabasa ng address ng ibang makina (hal. DITL-18 #C / #D na O.0413 ng burner B): 161 point sa 282 row, hinala na susuriin sa drawing.
- Ayos (RARA): ang output address na nakasulat sa gitna ng logic (DITL-31 O.0040/360) ay output, hindi ang input row sa tabi nito; ang input point ay binibilang lang sa sariling input row na may pinagmumulan; ang ZSO / ZSC / MIR na sinasagot ng valve / motor model ng DITL ay nakakabit.
