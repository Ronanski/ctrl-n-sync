# Phase 11 NANA fix: economizer inlet pressure PT-FW1160 from the design, 2026-11-27 PHT

**Binago:** ang PT-FW1160 (pressure sa economizer inlet) ay drum + 3.5 x (feedwater / 499.1)^2 dati, mula sa snapshot 03.png. Ngayon ay drum + 2.2 x (drum feed / 480)^2. Ang 2.2 kg/cm2 sa 480 T/H ay ang drop mula sa outlet ng main feedwater valve hanggang sa drum: Raven valve sheet P2 147.2 at FHI P2S7 drum 145.0 sa MCR. Ito rin ang batas ng valve (AN_MFW.kDn), kaya iisa lang ang path.

**Sinubok:** loaded start sa 150 MW, 3 min:
- PT-FW1160 135.2 ~ 135.5 kg/cm2, drum 133.4 (alarm L 110 / H 220);
- 151 MW, walang trip.

Pasado rin ang one-path at no-fit.

**Hindi ginawa:** ang 150 MW start ay hindi inayos ulit. Display transmitter lang ito; walang plant state na nagbago.

**Hindi sinubok:** ang live app.
