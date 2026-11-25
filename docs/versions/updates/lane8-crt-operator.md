# Lane 8 (QA : SAORI): ang ABC input na "(CRT)" ay operator

## Ano ang nagbago
- **`tools/trace/trace.cjs`**: kapag "(CRT)" ang pangalan ng ABC input sa memory list, push button o select ito ng operator sa CRT. Binibilang na ito bilang operator, hindi na "walang sumusulat" (hiling ni SORA).
- **`tools/trace/RULES.md`**: nakatala ang rule, luma at bago.

## Sinuri (main 0fa7dbc, 150 MW, 5 plant min)
- ABC input na walang sumusulat: 102 -> 85.
- Operator: 144 -> 161.
- Memory sa sheet na walang source: 33 -> 16.
- Pareho ang ibang linya.

## Hindi nasubok
- Walang binago sa app; tool lang ng QA.

SAORI
