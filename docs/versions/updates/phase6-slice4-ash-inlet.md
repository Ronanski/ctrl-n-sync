# Phase 6 slice 4: inlet valve ng 4 bottom ash screw cooler (2026-11-26 PHT)

Ano ang nakikita ng operator: ang ZSO / ZSC-BH1060-A ~ D (limit switch na "bukas" / "sarado" ng inlet valve ng bawat cooler) ay may value na.
Sa 150 MW lahat ay sarado (nakahinto ang 4 cooler, HMI snapshot 16.PNG). Kapag pinindot ang OPEN sa DITL-117 (CRT OPEN P.B.), bumubukas
ang valve at nananatiling bukas kahit tapos na ang 2 s na utos; ang CLOSE ang nagsasara.

- Source: IO list STN103 I.025B / 025C, I.053B / 053C, I.064B / 064C, I.068B / 068C; DITL-117 (#B ~ #D) output row 7 OPEN COMMAND
  (O.0217 / O.0298 / O.0618 / O.029D) at row 12 CLOSE COMMAND (O.0218 / O.0299 / O.0619 / O.029E).
- Ang DITL-117 / 118 ay hindi bumabasa ng limit switch: sa CRT lang ito pumupunta.
- NO-SOURCE: tagal ng pagbukas / pagsara ng valve (walang data sheet sa docs), kaya sumusunod agad ang switch sa utos (kagaya ng pressing valve).
- Bilang (QA trace): hindi nakakabit na I/O 125 -> 117; may value 2161 -> 2169; input na walang pinanggagalingan (B2) 63 -> 55.
- Test: tests/lanes/boiler/ash-cooler-inlet.cjs (150 MW sarado; OPEN -> bukas at nananatili; CLOSE -> sarado; hindi gumagalaw ang iba).
- Hindi sinubok: sa browser (live app).
