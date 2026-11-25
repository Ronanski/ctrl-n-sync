# Lane 8 (QA : SAORI): block parameter, LCD / (CRT) push button, iisang address, TO side

## Ano ang nagbago (tools/trace/trace.cjs, tools/trace/xref.cjs, RULES.md)
- Ang PTN (pattern slot) at PS (ramp parameter, ABC-003E PS0004 = 5 %/min) ay "block parameter" (hiling ni AKIHO).
- Ang DITL row na LOCATION "LCD", o ang address na "(CRT)" sa memory list, ay operator (hiling ni RARA).
- Ang ABC input ay may sumusulat kapag sinusulat ang parehong station at address sa ibang ABC sheet (hiling ni YUA).
- xref: ang source row na may "TO DITL<reader>" ay tamang kabit (hiling ni YUA).

## Sinuri (150 MW, 5 plant min), luma -> bago
- ABC B1: 85 -> 77 (block parameter) -> 70 (iisang address).
- DITL rows na walang source: 239 -> 203.
- xref, ibang sheet: 54 -> 46. Ang 46 ay 80G copy na nagbabasa ng row na "TO DITL80H".

## Hindi nasubok
- Walang binago sa app; tool lang ng QA.

SAORI
