# TCS sheet reader: ang bilog na may X ay feedback mark (lane 0, integrator)

## Ano ang nagbago
- **Bilog na may X (61 input)**: dati binabasa na baligtad ang signal. Sa drawing, marka ito ng linyang bumabalik mula sa block na mas huling ma-scan (value ng nakaraang scan); hindi ito baligtad. Batayan: TCE227 OR 005 pabalik sa A 004 (seal-in ng CRV test), TCE300 B3 MOP (B) RUNNING (kapares ng MOP (A) na walang X; IBD TB-1 ay RUNNING mismo), at mga analog na linya (TCA763).
- **Linya na motor o valve test ang pinanggalingan (44)**: ang pin ay ayon sa taas ng linya sa drawing. Dati unang pin lagi: ang MOP RUNNING, STOPPED at FAULT ng TCE300 / 305 / 310 ay START pala ang binabasa, at ang FULL TEST ng TCE220 ay PARTIAL TEST.
- **"(*)" sa tabi ng connector**: ang parehong sheet. 21 na connector ang nagkaroon ng source (2,141 naging 2,162).

## Sinuri
- tests/lanes/integrator/tce-loop-mark.cjs: 0 input na baligtad, tamang pin, at tumatakbong TCE300: pagbaba ng discharge ng tumatakbong MOP, umaandar ang standby na AUTO.
- tests/tce, tests/lanes/run-all.cjs, build SAME, no-fit 0 bago.

YUA
