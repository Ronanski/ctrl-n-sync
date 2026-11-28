# Phase 11 generator: overspeed after a 52G trip (load rejection), physics budget (YUI with RIN, 2026-11-28)

Ano ang tiningnan: ang model ay umaabot ng mga 102 % (sa branch ni RIN), ang manual ay mga 106 % (OPM STIE-14788 "the speed rises to about 106 % in about 1 s; the ICV opens to no-load flow at about 102 %"). Physics lang, walang fit sa 106.

## Inertia (YUI): tama
- GD2 turbine 23,700 + generator / exciter 16,200 = 39,900 kg m2 (GAE-2013-0136 R2). J = GD2 / 4 = 9,975 kg m2.
- KE sa 3600 rpm = 0.5 x 9,975 x 377^2 = 709 MJ, H = 709 / 176.5 = 4.01 s (U.Hgen). Walang mali.
- Pe pagkabukas ng 52G = generator no-load losses 1.33 MW + turbine mech 1.55 MW (halos walang preno).

## Enerhiya na kailangan sa itaas ng 3600 rpm
- 102 %: 28.6 MJ; 104 %: 57.8 MJ; 106 %: 87.6 MJ (KE x (n^2 - 1)).

## Galing sa valves at sa naiipit na steam (RIN, ang may-ari ng speed code)
- Sa 52G trip ay pumuputok agad ang PLU (power less load 0 > 40 %). Ang CV / ICV ay sumasara sa fast-acting path: NG6 pilot 0.04 s + cylinder dump, CV 0.15 s, ICV 0.21 s (AN_TBV, rin-actuators-2026-11-28.md, DERIVED). Ang "within 0.25 s" ng MTSV p872 ay ang trip-oil path (turbine trip: MSV 0.38, CV 0.41, RSV 0.44, ICV 0.47 s), hindi ito.
- Steam na naiipit sa likod ng valves (310PK03-994, rin-turbine-section-2026-11-28.md): HP 9.2 kg (tSc 0.073 s); IP / LP 6.8 m3, 22.0 kg (tXo 0.198 s: leads 1.1, IP inlet 0.4, IP blading 1.22, IP-LP passage 0.5, LP blading 3.54 m3). Tugma sa hiwalay na basa ng coordinator (IP 0.9, LP 3.8 m3 blade path, DERIVED; LP hood mga 115 m3 pero nasa vacuum, kaunting enerhiya).
- Budget: HP 38 MW x (0.075 + 0.073) + IP/LP 117 MW x (0.105 + 0.198) = mga 41 MJ, less losses = 36 MJ -> **102.5 %** (trapezoid integration, converged sa 0.02 s).
- Para sa 106 % (87.6 MJ) kailangan ng effective 0.30 ~ 0.35 s na valve time: iyon ang trip-oil path. Kaya ang 106 % ng manual ay malamang para sa pagsara na walang PLU, o isang "not more than" na design figure. Pinanatili ang 102.5 % (physics); ang 106 % ay bukas na item na may ganitong dahilan, hanggang may doc na nagsasabing mas mabagal ang PLU. Walang fit sa 106.

## Rule 0 sa lane ko
- Page 17 energy meters (MWh / MVArh): dati nagsimula sa meter reading ng screen 37.PNG. Ngayon ay mula 0, tulad ng GCP meters ng tcs-dev.js. Ang st150 ay may lumang halaga pa; mapapalitan sa susunod na re-settle (phase thread).
- Ang comment ng generator page na bumabanggit ng 37.PNG ay inalis (history ay nasa git).

## Reverse power test (32): tapat na anyo, walang mask
- Wala nang hold ng BOILER MFT sa TA-9. Ang case ay ibinababa muna ang unit sa CCS (HIC-ULD, ang parehong sulat ng faceplate) na naka-set sa 45 MW (HB case 7, dulo ng design sweep); bumababa ito sa 3 MW/min hanggang alisin ng logic ang boiler master sa AUTO (M.2013, steam flow < 220 T/H, mga 73 MW), saka GOV SET 0: motoring, 32, 86G-A / B, 52G open.
- Sa 150 MW, ang GOV 0 ay nagpapa-MFT sa boiler (drum H.H.), at iyon ang sariling protection ng planta, kaya hindi doon sinusubok ang 32.

## Ang pula sa main (gen-electrical, 32 case): steam na bumabalik mula sa deaerator
- Sanhi: pagsara ng CV at ICV sa GOV 0, ang IP / LP ay may 6 MW pa (dahan-dahang humihina) mula sa deaerator na nag-flash pabalik sa turbine sa extraction No.3, kaya hindi naging negative ang MW.
- Design: ang extraction NRVs ay swing check (azbil / KARATU VCL-5101-H, PVD-13-0074): kusang sumasara sa reverse flow; ang air cylinder ay tulong lang (within 2 s).
- Ayos (tcs-dev.js, OK ni RIN): ang ex3p / ex3s ay sumasara sa dump rate kapag ang stage pressure (ext.da.P) ay mas mababa sa deaerator (Psat(T) + 1.0332 ata). Ang HP1 / LP3 / LP2 shells ay walang reverse state sa model (solved below the stage pressure), kaya trip-only pa ang No.2 / 4 / 5.
- Resulta: motoring -2.88 MW, 32 2nd step, 86G-A / B 10 s pagkatapos, 52G open. Pasado sa main at sa PR 714 ni KANA.
