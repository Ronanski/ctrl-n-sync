# v1.0.0-beta.490 (LEADER : YUA, lane 0): Rule 0A at gas ng bawat backpass bank

## Ano ang nagbago
- **RULES.md 3.0A at HANDOFF**: content muna (user 2026-11-25). Una ang lahat ng logic, sunod ang bawat address sa bawat signal, sunod ang HMI (hindi kasama ang WTP, coal handling at air compressors), at saka pa lang ang plant model. Lahat ay 100 % tama ayon sa plant documents, at walang tuning ng model habang may kulang pang content.
- **HANDOFF**: pinalitan ang lumang team at version lines. Ngayon nakalista ang 10 lane, at ang beta number ay nagtatapos sa digit ng lane.
- **hx.js `U.hxO.gBank`** (hiling ng lane 3 KIRARA, P&ID PD-051 TT-FG1100 hanggang 1111): ang gas na lumalabas sa bawat bank ng backpass. Kasama ang wl, ang RH 3 hanggang 0, ang No.2 eco R, ang finishing SH 2 hanggang 0, ang No.3 eco, ang No.2 eco S, ang mix, ang e1In at ang No.1 eco. Export lang ito ng parehong kuwenta, kaya walang nagbago sa takbo.

- **`gBank.e3m`** (TT-FG1109, No.3 eco lower inlet): ang gas sa kalahati ng surface ng No.3 eco ayon sa parehong kuwenta ng bank (exponential, isang metal temperature). Pantay na kalahati ang ginamit dahil wala pa sa mga dokumento ang hati.

## Sinuri
- build at check: SAME
- no-fit: 0 bago
- tests/lanes/run-all.cjs: pasado

YUA
