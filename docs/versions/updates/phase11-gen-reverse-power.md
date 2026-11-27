# Phase 11 generator: the reverse power margin and the 52G opening after a turbine trip (YUI, 2026-11-28)

Ano ang tiningnan: ang "manipis na margin" ng reverse power (−2.34 MW laban sa trip −2.29 MW) at ang pagbukas ng 52G pagka-turbine trip.

## Reverse power (32): hindi manipis ang margin
- Ang −2.34 MW ay ang unang 1 s na sample habang nagsasara pa ang valves (GOV SET 0), hindi ang steady value.
- Steady motoring power ng model, valves sarado, 52G nakasara: **−2.88 MW = −0.0163 pu** ng 176.5 MVA. Ito ay:
  - turbine mechanical loss 1.55 MW (AN_TB.mech, HB lumped loss less the generator losses);
  - generator no-load losses 1.33 MW (type test LM-GEE-2014-0822 R0 p31: friction and windage 875 kW, core 388 kW at 1.0 V, field, exciter, stator I²R at 0.25 kA).
- Relay GEE-2015-0173 R1 p16: 2nd step (trip) −0.013 pu = −2.29 MW / 10 s ay 80 % ng motoring; 1st step (alarm) −0.008 pu = −1.41 MW / 5 s ay 49 %. Margin 0.59 MW. Physics ito, walang binago sa relay o sa losses.
- Hindi naka-model (NO-SOURCE): ang blade windage ng turbine na walang steam flow sa vacuum. Dagdag lang ito sa motoring, kaya lalaki pa ang margin.
- Sunod-sunod sa app: GOV SET 0, ang power ay bumababa, 32 1st at 2nd step sa −2.3 MW, 86G-A / 86G-B 10 s pagkatapos (SH-G-5A / 6A d32), ST trip, 52G open, field off.

## Turbine trip: hindi reverse power ang nagbubukas ng 52G
- Drawing: IBD TA-6 "MAIN STOP VALVE FULL CLOSE (FOR BOILER PROTECTION & ELECTRICAL TRIP)" (310SC90-794 p27) -> SH-G-9 "ST TRIP (FOR GENERATOR TRIP)" -> SH-G-5A / 6A input 4 / 6, OR'd after 86G-A / B (hindi dumadaan sa gor ng relays) -> SH-G-5B / 6B generator trip at breaker trip coils.
- Ibig sabihin: sa turbine trip, ang 52G ay binubuksan ng stop valve full close, walang reverse power interval. Ang 32 ay backup kapag nawala ang steam nang walang turbine trip (GOV SET 0, valve failure).
- Sa model: ang trip flag ay I.0400 mula sa TA-6, kaya bukas na ang 52G sa valve full close. Ang tunay na mali (nakita ni RIN): hindi binabasa ng steam flow ang stop valves, kaya ang power ay nanatili sa 152 MW hanggang sa pagbukas ng 52G. Si RIN ang mag-aayos sa susunod niyang PR (ang CV / ICV flow ay pinararami sa stop valve opening).

## Rule 0 (user 5:18 AM PHT): walang snapshot sa generator files
- TIGE1005 (AC exciter outlet air): tinanggal ang 80 C / 7.85 A ng screen P35SHAFT. Ngayon = cold air ng generator closed circuit (45 C nameplate; ang exciter ay humihinga mula rito, O&M OM1 p45 Fig 2.8) + rise na 45 K x (main field / 1,141 A)^2. Ang 45 K = design normal outlet 90 C (TE-GEn005, 310SC99-329) less 45 C, kaya air flow 29 kW / (1.005 x 45) = 0.64 kg/s (DERIVED, yui-reads-5.md).
- gen-electrical test: tinanggal ang INFO line ng screen 37.PNG.

## Test
- gen-electrical: bagong check, motoring power = turbine + generator no-load, lampas sa 2nd step nang 0.3 MW o higit.
