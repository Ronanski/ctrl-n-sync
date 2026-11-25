# Lane 8 (QA : SAORI): ang (CRT) / LCD push button ay operator, ang PTN / PS ay parameter ng block

## Ano ang nagbago
- **`tools/trace/trace.cjs`**: kapag "(CRT)" ang pangalan ng ABC input sa memory list, push button o select ito ng operator sa CRT. Binibilang na ito bilang operator, hindi na "walang sumusulat" (hiling ni SORA).
- Ang PTN (pattern slot) at PS (ramp parameter, ABC-003E PS0004 = 5 %/min) ay "block parameter" (hiling ni AKIHO).
- Ang DITL row na LOCATION "LCD", o ang address na "(CRT)" sa memory list, ay operator din (hiling ni RARA).
- **`tools/trace/RULES.md`**: nakatala ang rule, luma at bago.

## Sinuri (main 0fa7dbc, 150 MW, 5 plant min)
- ABC input na walang sumusulat: 102 -> 85.
- Operator: 144 -> 161.
- Memory sa sheet na walang source: 33 -> 16.
- Block parameter: ABC B1 85 -> 77, memory na walang source 16 -> 12.
- LCD / (CRT) sa DITL: DITL rows na walang source 239 -> 203.
- Pareho ang ibang linya.

## Hindi nasubok
- Walang binago sa app; tool lang ng QA.

SAORI
