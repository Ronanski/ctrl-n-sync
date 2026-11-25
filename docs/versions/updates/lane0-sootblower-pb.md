# Sootblower N-1012 ~ N-1038: START at REVERSE sa DITL-80M (LEADER : YUA, lane 0)

- **Dati**: ang START / RETRACT ng bawat sootblower (maliban sa N-1011 at N-1012) ay diretsong pinipindot ang row 6 / 11 ng kopya nito sa DITL-80G. Walang dumadaan sa DITL-80M kaya wala ang 2 segundong pulse at ang REMOTE SELECTED (I.073F).
- **Ngayon**: may kopya ng DITL-80M rows 3 / 75 ang bawat sootblower (`src/world/inst/sootblowers.json`). Ang row 6 / 11 ng DITL-80G ay binabasa ang sariling output nito (80M-303 / 80M-375 ng drawing). Address: memory list 102, SB1 ~ SB28 START P.B. / RETRACT P.B. Ang faceplate ay pumipindot na sa kopya ng DITL-80M.
- **Row 2 / 8 (OPERATING / SKIPPED)**: tama na ang DITL-80B ~ 80F. Iyon ang output na nagsasabing "TO DITL80G" para sa sariling sootblower; ang 80A-76 / 78 sa drawing ay para sa N-1011.
- **Test**: tests/lanes/integrator/sootblower-pb.cjs: 108 link, at ang pindot ng N-1013 ay pulse na 2 segundo.

YUA
