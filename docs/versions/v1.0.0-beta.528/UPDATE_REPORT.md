# LMYP OTS 1.0.0-beta.528 (QA : SAORI, lane 8, 2026-11-25)

Sumunod sa beta.520. Tool lang; walang binago sa app, sa plant model, sa logic o sa HMI.

## Ano ang bago

`tools/trace/trace.cjs`: ang row-unit copy (lane 0 PR 549, `s._inst.only` = Set ng row index) ay may hawak lang na mga row na iyon. Ang ibang row nito at ang free text ng drawing ay hindi binibilang sa copy (ang base drawing ang may-ari).

## Sinubok

Sa branch ng PR 549 (a086e24), 150 MW 5 plant min, lumang tool vs bagong tool: pareho ang lahat ng bilang (LINKED 1,601, value 1,713, B5 92 / 151). Ang 3 row-unit copy ngayon (DITL-21D #B / #C / #D, 2 row bawat isa) ay walang ibang row na may address, kaya pananggalang ito para sa susunod na copy. Sa main c48ad90 + PR 535: walang pagbabago (1,524 / 1,651).
