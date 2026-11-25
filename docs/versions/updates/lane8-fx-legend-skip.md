# v1.0.0-beta.554 (QA : SAORI, lane 8): hindi na binibilang ng F(X) ang legend ng simbolo

## Ano ang nagbago
- **`tools/trace/trace.cjs`**: ang F(X) count ay lumalaktaw na sa ABC-000 (legend ng simbolo ng analog set), gaya ng I/O catalog. Ang FX block doon ay halimbawang drawing lang, hindi controller (hiling ni AKIHO).
- **`tools/trace/RULES.md`**: nakatala ang bagong rule, luma at bago.

## Sinuri (main 79c27fe, 150 MW, 5 plant min)
- Luma -> bago: FX blocks 112 -> 111, walang table 1 -> 0. Ang iba pang linya ng summary ay pareho.

## Hindi nasubok
- Walang binago sa app; tool lang ng QA.

SAORI
