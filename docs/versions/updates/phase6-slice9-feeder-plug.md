# Phase 6 slice 9: discharge plugging ng coal feeder A / B / C (2026-11-26 PHT)

Ano ang nakikita ng operator: ang alarm na "COAL FEEDER x DISCHARGE PLUGGED" (nabarahan ang daanan ng uling palabas ng feeder) ay galing na
sa sariling contact ng bawat feeder. Kapag ginawa ng trainer ang fault na "Coal feeder B discharge chute plugged", ang feeder B lang ang
nag-a-alarm; kapag inalis ang fault, nawawala ang alarm. Pareho ang kilos sa dati; ang binago ay ang pinanggagalingan: isa na lang na
source (field row) at nakasulat sa sariling tag ng bawat feeder (B4 / C4), kaya nakikita na ng bilang ang B at C.

- Source: IO list STN104 I.012A / I.044A / I.048A; DITL-19 (#B / #C) output 65; Yamato L12 Coal Feeder P8 signal 18; trainer fault cf.jamA ~ C.
- Sinubok (headless): 150 MW walang alarm; fault B -> DITL-19 #B lang ang may contact at output; clear -> wala.
- Bilang: nakakabit 1797 -> 1800; may value 2188 -> 2191; hindi nakakabit 98 -> 96; nasa drawing pero wala sa row 130 -> 129.
- Hindi sinubok: sa browser (live app).
