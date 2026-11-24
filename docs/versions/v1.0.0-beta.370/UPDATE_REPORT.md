# LMYP OTS 1.0.0-beta.370 (JENNIE, 2026-11-24)

Sumunod sa beta.369 (Rosé, Warm / Hot sa start screen).

## Ano ang inayos

| # | Finding | Ano ang nangyari | Ayos |
|---|---|---|---|
| 1 | D31 bed heat-up 661 C/h | Energy balance mula sa S10: oil 4.03 T/H x 42.7 MJ/kg = 47.8 MW, gas 22.2 MW, lower refractory 5.3 MW, natitira 20.3 MW sa 84 MJ/K (100 t bed, FHI T9 p3) = 870 C/h sa simula, ~660 C/h sa unang 5 min. Tama ang physics. Ang FHI Fig 2 (110 C/h) at limit 153 C/h ay hawak ng operator sa firing | Test ang mali: bed_heatup.js sumusuri na ang taas ng bed = heat balance (U.bbQ) sa loob ng 3 %, bumabagal ang rate, nananatili ang 4 burner 45 min |
| 2 | Burner out sa 1 h (S10) | DITL-03A MFT, first out DITL-05 DRUM LEVEL H.H.: kumukulo na ang tubig (Pd 0.6), lumalaki ang level (swell). Walang nag-blowdown | Hindi bug ng model: trabaho ng operator (PR-OPE-5002 "observe drum level swelling") |
| 3 | Warm / Hot fixed numbers (AN_RESTART, Q3, RULES 3.12) | Galing sa FHI Fig 3 / 4 na isinulat sa planta | Tinanggal ang AN_RESTART, anUnitRestart, anRestartDrum, AN.unitRestart; ang start screen ay physics-trip saves na (Rosé beta.367) |
| 4 | TCS mode "hot" sa HP 403 C pagka-load ng Warm | Ang mode ay kinuha lang sa trip (tcsTrip) at hindi na sumunod sa paglamig habang naka-hold ang trip | tcsMode bawat scan bago ang TURBINE PREPARATION (tcs.js tcsStep, unit.js trip hold): Warm = warm, Hot = hot |
| 5 | EIC-TM PV 151 MW sa 0 MW | Ang GEN MW AI0419 / AI0774 isinulat na eksaktong 0, kaya ang AVERAGE SELECT ng ABC-001C inakalang patay ang transmitter at hinawakan ang 151 | Isinusulat na 1e-3 (live 4 mA), gaya ng turbine inlet pressure: PV = 0 MW |

## Tests

- bed_heatup.js ALL PASS (energy check [[13.5,13.5],[7.89,7.89],[4.76,4.76]])
- warm_hot_start.js ALL PASS (mode warm / hot, EIC-TM PV = generator MW)
- unit_trip.js ALL PASS
- tests/regress/restart_drum.js tinanggal (sinusuri ang AN_RESTART na wala na)
- no-fit: 44 lumang fit, 0 bago

## Susunod

Solids at bed temperature mula sa FHI geometry (kapalit ng kKL, D27 / D3), bed inventory Fig 9 (D29), fouling bawat bank (D30).
